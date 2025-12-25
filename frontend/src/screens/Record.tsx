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
   * Move forward ONLY if:
   * - recording finished
   * - voice was detected
   * - AP scores received
   * -------------------------------- */
  useEffect(() => {
    if (!recording && hadVoice && apScores && !loading) {
      const timer = setTimeout(
        onComplete,
        SCREEN_TIMINGS.record ?? 800
      );
      return () => clearTimeout(timer);
    }
  }, [recording, hadVoice, apScores, loading, onComplete]);

  return (
    <ScreenWrapper keyName="record">
      <div className="flex flex-col justify-between h-full text-center">

        {/* 🔹 TOP SECTION */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            3 Easy Steps
          </h2>

          <ul className="space-y-2 text-sm md:text-base text-slate-300">
            <li>① Take a deep breath</li>
            <li>② Tap to start</li>
            <li>③ Hum from your nose (mouth closed)</li>
          </ul>
        </div>

        {/* 🔹 ACTION SECTION */}
        <div className="space-y-6 mt-6">
          {!recording && !loading && (
            <button
              onClick={start}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Start Recording
            </button>
          )}

          {recording && (
            <div className="px-6 py-3 rounded-lg bg-slate-700 text-white font-medium">
              Recording…
            </div>
          )}

          {/* 🔴 LIVE / SILENT STATUS */}
          {recording && (
            <p
              className={`text-sm ${
                isLive ? "text-green-400" : "text-red-400"
              }`}
            >
              {isLive ? "Voice detected" : "No voice detected"}
            </p>
          )}
        </div>

        {/* 🔹 VISUAL SECTION */}
        <div className="space-y-4 mt-6">
          <Waveform active={recording && isLive} />

          {loading && (
            <p className="text-sm text-slate-400">
              Sending audio for analysis…
            </p>
          )}

          {/* ❌ NO VOICE → RETRY */}
          {!recording && !loading && !hadVoice && (
            <button
              onClick={reset}
              className="text-sm text-blue-400 underline"
            >
              Retry recording
            </button>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
