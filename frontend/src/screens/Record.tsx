import { useEffect, useState } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import { useRecorder } from "../components/audio/useRecorder";
import Waveform from "../components/audio/Waveform";
import { SCREEN_TIMINGS } from "../config/timings";

type RecordProps = {
  onComplete: () => void;
};

export default function Record({ onComplete }: RecordProps) {
  const {
    start,
    recording,
    isLive,
    apScores,
    loading,
    reset,
  } = useRecorder();

  const [showRetry, setShowRetry] = useState(false);

  /**
   * Move forward ONLY if:
   * - recording finished
   * - backend finished
   * - AP scores exist
   * - audio WAS live
   */
  useEffect(() => {
    if (!recording && !loading && apScores && isLive) {
      const timer = setTimeout(() => {
        onComplete();
      }, SCREEN_TIMINGS.record ?? 800);

      return () => clearTimeout(timer);
    }

    // Recording finished but NO voice detected → retry
    if (!recording && !loading && !isLive && apScores) {
      setShowRetry(true);
    }
  }, [recording, loading, apScores, isLive, onComplete]);

  const handleRetry = () => {
    setShowRetry(false);
    reset(); // clear previous chunks & state
    start();
  };

  return (
    <ScreenWrapper keyName="record">
      <div className="h-[520px] flex flex-col justify-between text-center">
        {/* TOP */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            3 Easy Steps
          </h2>

          <div className="space-y-1 text-sm text-slate-300">
            <p>1️⃣ Take a deep breath</p>
            <p>2️⃣ Tap to start</p>
            <p>3️⃣ Hum from your nose (mouth closed)</p>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="space-y-4">
          {!recording && !showRetry && (
            <button
              onClick={start}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Start Recording
            </button>
          )}

          {recording && (
            <button
              disabled
              className="px-6 py-3 rounded-lg bg-slate-600 text-white"
            >
              Recording…
            </button>
          )}

          {showRetry && (
            <button
              onClick={handleRetry}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Retry Recording
            </button>
          )}
        </div>

        {/* BOTTOM */}
        <div className="space-y-3">
          <Waveform active={recording} />

          {recording && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span
                className={`w-3 h-3 rounded-full ${
                  isLive ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-slate-300">
                {isLive ? "Recording live" : "No audio detected"}
              </span>
            </div>
          )}

          {loading && (
            <p className="text-xs text-slate-400">
              Sending audio for analysis…
            </p>
          )}

          {showRetry && (
            <p className="text-xs text-red-400">
              No humming detected. Please try again.
            </p>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
