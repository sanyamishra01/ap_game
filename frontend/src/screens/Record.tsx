import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Waveform from "../components/audio/Waveform";
import Button from "../components/ui/Button";
import { useRecorder } from "../components/audio/useRecorder";
import { useLungStore } from "../state/useLungStore";
import { getZone } from "../logic/zonemapping";

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

  const setResult = useLungStore((s) => s.setResult);

  /**
   * ✅ BACKEND → STORE → NEXT SCREEN
   * This MUST happen before moving forward
   */
  useEffect(() => {
    if (!apScores || apScores.length === 0) return;

    // 1️⃣ Aggregate backend AP
    const avgAp =
      apScores.reduce((a, b) => a + b, 0) / apScores.length;

    // 2️⃣ Clamp defensively
    const lhi = Math.max(0, Math.min(1, avgAp));

    // 3️⃣ Determine zone
    const zone = getZone(lhi);

    // 4️⃣ Store result (CRITICAL)
    setResult(lhi, zone);

    // 5️⃣ Move forward
    onComplete();
  }, [apScores, setResult, onComplete]);

  console.log("RAW AP SCORES FROM BACKEND:", apScores);


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

        {/* Start */}
        {!hasStarted && !loading && (
          <Button label="Start Recording" onClick={start} />
        )}

        {/* Recording */}
        {hasStarted && recording && (
          <>
            <Waveform active={isLive} />
            <p className="text-slate-300">
              {isLive
                ? "Humming detected… keep going"
                : "Listening for humming…"}
            </p>

            {isLive && secondsLeft !== null && (
              <p className="text-lg text-white font-semibold">
                {secondsLeft}s
              </p>
            )}
          </>
        )}

        {/* Retry */}
        {hasStarted && !recording && hadVoice === false && !loading && (
          <>
            <p className="text-red-400 font-medium">
              No humming detected. Please try again.
            </p>
            <Button label="Retry" onClick={reset} />
          </>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-slate-400">
            Sending audio for analysis…
          </p>
        )}
      </div>
    </ScreenWrapper>
  );
}
