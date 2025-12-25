import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Waveform from "../components/audio/Waveform";
import Button from "../components/ui/Button";
import { useRecorder } from "../components/audio/useRecorder";

interface RecordProps {
  onComplete: () => void;
}

export default function Record({ onComplete }: RecordProps) {
  const {
    start,
    reset,
    recording,
    hasStarted,
    isLive,
    hadVoice,
    secondsLeft,
    apScores,
    loading,
  } = useRecorder();

  /**
   * ✅ Move forward ONLY when backend returns AP score
   * This guarantees backend-driven flow
   */
  useEffect(() => {
    if (apScores && apScores.length > 0) {
      onComplete();
    }
  }, [apScores, onComplete]);

  return (
    <ScreenWrapper keyName="record">
      <div className="flex flex-col items-center text-center space-y-8 max-w-md mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-white">
          3 Easy Steps
        </h2>

        {/* Instructions */}
        <div className="space-y-2 text-slate-300">
          <p>① Take a deep breath</p>
          <p>② Tap to start</p>
          <p>③ Hum from your nose (mouth closed)</p>
        </div>

        {/* ───────────────────────────── */}
        {/* INITIAL STATE — Start button */}
        {/* ───────────────────────────── */}
        {!hasStarted && !loading && (
          <Button
            label="Start Recording"
            onClick={start}
          />
        )}

        {/* ───────────────────────────── */}
        {/* RECORDING STATE */}
        {/* ───────────────────────────── */}
        {hasStarted && recording && (
          <>
            <Waveform active={isLive} />

            <p className="text-slate-300">
              {isLive
                ? "Humming detected… keep going"
                : "Listening for humming…"}
            </p>

            {/* Countdown starts ONLY after humming is detected */}
            {isLive && secondsLeft !== null && (
              <p className="text-lg text-white font-semibold">
                {secondsLeft}s
              </p>
            )}
          </>
        )}

        {/* ───────────────────────────── */}
        {/* FAILED STATE — Retry */}
        {/* Shown ONLY if:
            - recording finished
            - user actually started
            - no voice was detected */}
        {/* ───────────────────────────── */}
        {hasStarted &&
          !recording &&
          hadVoice === false &&
          !loading && (
            <>
              <p className="text-red-400 font-medium">
                No humming detected. Please try again.
              </p>

              <Button
                label="Retry"
                onClick={reset}
              />
            </>
          )}

        {/* ───────────────────────────── */}
        {/* LOADING STATE */}
        {/* ───────────────────────────── */}
        {loading && (
          <p className="text-slate-400">
            Sending audio for analysis…
          </p>
        )}
      </div>
    </ScreenWrapper>
  );
}
