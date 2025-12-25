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
    hasValidAudio,
  } = useRecorder();

  const [hasStarted, setHasStarted] = useState(false);

  // Move forward ONLY when valid audio was recorded
  useEffect(() => {
    if (!recording && hasStarted && hasValidAudio) {
      const timer = setTimeout(() => {
        onComplete();
      }, SCREEN_TIMINGS.record);

      return () => clearTimeout(timer);
    }
  }, [recording, hasStarted, hasValidAudio, onComplete]);

  const handleStart = async () => {
    setHasStarted(true);
    await start();
  };

  const showRetry =
    hasStarted && !recording && !hasValidAudio;

  return (
    <ScreenWrapper keyName="record">
      <div className="space-y-8 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          3 Easy Steps
        </h2>

        {/* Steps */}
        <div className="space-y-2 text-base text-slate-300">
          <p>① Take a deep breath</p>
          <p>② Tap to start</p>
          <p>③ Hum from your nose (mouth closed)</p>
        </div>

        {/* Start Button */}
        {!recording && !hasStarted && (
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Start Recording
          </button>
        )}

        {/* Recording State */}
        {recording && (
          <>
            <button
              disabled
              className="px-6 py-3 bg-slate-600 text-white rounded-lg"
            >
              Recording…
            </button>

            <Waveform active />

            <p className="text-sm text-slate-300">
              {isLive
                ? "Humming detected — keep going"
                : "Waiting for humming…"}
            </p>
          </>
        )}

        {/* Retry State */}
        {showRetry && (
          <>
            <p className="text-sm text-red-400">
              No voice detected. Please try again.
            </p>

            <button
              onClick={() => setHasStarted(false)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </ScreenWrapper>
  );
}
