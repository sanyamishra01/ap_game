import { useEffect } from "react";
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
  } = useRecorder();

  /**
   * Move forward ONLY when:
   * - recording has stopped
   * - backend processing finished
   * - AP scores exist
   */
  useEffect(() => {
    if (!recording && !loading && apScores) {
      const timer = setTimeout(() => {
        onComplete();
      }, SCREEN_TIMINGS.record ?? 1000);

      return () => clearTimeout(timer);
    }
  }, [recording, loading, apScores, onComplete]);

  return (
    <ScreenWrapper keyName="record">
      <div className="space-y-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          3 Easy Steps
        </h2>

        {/* Steps */}
        <div className="space-y-2 text-base text-slate-300 max-w-md mx-auto">
          <p>1️⃣ Take a deep breath</p>
          <p>2️⃣ Tap to start</p>
          <p>3️⃣ Hum from your nose (mouth closed)</p>
        </div>

        {/* Start Button */}
        <button
          onClick={start}
          disabled={recording}
          className={`px-8 py-3 rounded-lg text-white text-base font-semibold transition
            ${
              recording
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {recording ? "Recording…" : "Start Recording"}
        </button>

        {/* Recording Visual */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <Waveform active={recording} />

          {/* Live Mic Status */}
          {recording && (
            <div className="flex items-center gap-2 text-sm">
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
            <p className="text-sm text-slate-400">
              Sending audio for analysis…
            </p>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
