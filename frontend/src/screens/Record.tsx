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
    hadVoice,
    secondsLeft,
    apScores,
    loading,
    reset,
  } = useRecorder();

  const [hasStarted, setHasStarted] = useState(false);

  // Move forward ONLY if valid audio was captured
  // useEffect(() => {
  //   if (!recording && hasStarted && hadVoice && apScores && !loading) {
  //     const t = setTimeout(onComplete, SCREEN_TIMINGS.record);
  //     return () => clearTimeout(t);
  //   }
  // }, [recording, hasStarted, hadVoice, apScores, loading, onComplete]);

  const showRetry =
    hasStarted && !recording && !hadVoice && !loading;

  return (
    <ScreenWrapper keyName="record">
      <div className="space-y-6 text-center">

        <h2 className="text-3xl font-semibold text-white">
          3 Easy Steps
        </h2>

        <div className="space-y-1 text-sm text-slate-300">
          <p>① Take a deep breath</p>
          <p>② Tap to start</p>
          <p>③ Hum from your nose (mouth closed)</p>
        </div>

        {!recording && !hasStarted && (
          <button
            onClick={() => {
              setHasStarted(true);
              start();
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Start Recording
          </button>
        )}

        {recording && (
          <>
            <Waveform active />

            <p className="text-sm text-slate-300">
              {isLive
                ? "Humming detected — keep going"
                : "Waiting for humming…"}
            </p>

            {secondsLeft !== null && (
              <p className="text-sm text-blue-400">
                Recording: {secondsLeft}s
              </p>
            )}
          </>
        )}

        {showRetry && (
          <>
            <p className="text-sm text-red-400">
              No voice detected. Please try again.
            </p>

            <button
              onClick={() => {
                reset();
                setHasStarted(false);
              }}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </ScreenWrapper>
  );
}
