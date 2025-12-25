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
    reset,
    recording,
    isLive,
    hadVoice,
    apScores,
    loading,
  } = useRecorder();

  /* --------------------------------
   * MOVE ONLY IF VALID AUDIO
   * -------------------------------- */
  useEffect(() => {
    if (
      !recording &&
      !loading &&
      hadVoice &&
      apScores &&
      apScores.length > 0
    ) {
      const timer = setTimeout(() => {
        onComplete();
      }, SCREEN_TIMINGS.record);

      return () => clearTimeout(timer);
    }
  }, [recording, loading, hadVoice, apScores, onComplete]);

  return (
    <ScreenWrapper keyName="record">
      <div className="space-y-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          3 Easy Steps
        </h2>

        {/* Steps */}
        <div className="space-y-2 text-base text-slate-300 max-w-sm mx-auto">
          <p>1️⃣ Take a deep breath</p>
          <p>2️⃣ Tap start</p>
          <p>3️⃣ Hum from your nose (mouth closed)</p>
        </div>

        {/* Start Button */}
        {!recording && (
          <button
            onClick={start}
            className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Start Recording
          </button>
        )}

        {recording && (
          <div className="text-slate-300 font-medium">
            Recording…
          </div>
        )}

        {/* Waveform */}
        <div className="flex flex-col items-center gap-3">
          <Waveform active={recording} />

          {/* Live status */}
          {recording && (
            <p
              className={`text-sm ${
                isLive ? "text-green-400" : "text-red-400"
              }`}
            >
              {isLive ? "🎤 Voice detected" : "⚠️ No voice detected"}
            </p>
          )}
        </div>

        {/* Retry if silent */}
        {!recording && !loading && !hadVoice && (
          <div className="space-y-2">
            <p className="text-sm text-red-400">
              No voice detected. Please try again.
            </p>
            <button
              onClick={() => {
                reset();
                start();
              }}
              className="px-5 py-2 rounded bg-slate-600 hover:bg-slate-700 text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Backend processing */}
        {loading && (
          <p className="text-sm text-slate-400">
            Processing audio…
          </p>
        )}
      </div>
    </ScreenWrapper>
  );
}
