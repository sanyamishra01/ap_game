import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Waveform from "../components/audio/Waveform";
import { useRecorder } from "../components/audio/useRecorder";

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
    secondsLeft,
    apScores,
    loading,
  } = useRecorder();

  /* ---------------------------
   * Move forward ONLY if:
   * - recording finished
   * - backend returned AP scores
   * --------------------------*/
  useEffect(() => {
    if (!recording && !loading && apScores && hadVoice) {
      onComplete();
    }
  }, [recording, loading, apScores, hadVoice, onComplete]);

  return (
    <ScreenWrapper keyName="record">
      <div className="flex flex-col items-center text-center gap-6 pt-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          3 Easy Steps
        </h2>

        {/* Steps */}
        <div className="space-y-2 text-sm md:text-base text-slate-300">
          <p>① Take a deep breath</p>
          <p>② Tap to start</p>
          <p>③ Hum from your nose (mouth closed)</p>
        </div>

        {/* Start Button */}
        {!recording && !loading && !hadVoice && (
          <button
            onClick={start}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
          >
            Start Recording
          </button>
        )}

        {/* Recording Status */}
        {recording && (
          <div className="flex flex-col items-center gap-3">
            <button
              disabled
              className="px-6 py-2 bg-slate-600 rounded text-white cursor-not-allowed"
            >
              Recording…
            </button>

            {/* Countdown timer */}
            {secondsLeft !== null && hadVoice && (
              <p className="text-sm text-blue-400">
                Recording… {secondsLeft}s remaining
              </p>
            )}

            {/* Live / Waiting indicator */}
            {!hadVoice && (
              <p className="text-sm text-yellow-400">
                Waiting for humming sound…
              </p>
            )}
          </div>
        )}

        {/* Waveform */}
        <div className="mt-2">
          <Waveform active={recording && (isLive || hadVoice)} />
        </div>

        {/* No voice detected → Retry */}
        {!recording && !loading && !hadVoice && (
          <p className="text-xs text-slate-400 mt-2">
            Ensure your mic is close and hum clearly
          </p>
        )}

        {/* Backend processing message */}
        {loading && (
          <p className="text-sm text-slate-400 mt-2">
            Sending audio for analysis…
          </p>
        )}

        {/* Retry Button */}
        {!recording && !loading && !hadVoice && (
          <button
            onClick={reset}
            className="mt-2 px-5 py-2 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Retry
          </button>
        )}
      </div>
    </ScreenWrapper>
  );
}
