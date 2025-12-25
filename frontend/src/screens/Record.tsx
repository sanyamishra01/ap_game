import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Waveform from "../components/audio/Waveform";
import Button from "../components/ui/Button";
import { useRecorder } from "../components/audio/useRecorder";

interface RecordProps {
  onComplete: () => void;
}

type RecordStatus =
  | "idle"
  | "listening"
  | "recording"
  | "failed"
  | "success";

export default function Record({ onComplete }: RecordProps) {
  const {
    start,
    reset,
    recording,
    isLive,
    hadVoice,
    secondsLeft,
    loading,
  } = useRecorder();

  // 🔐 Single source of truth
  let status: RecordStatus = "idle";

  if (recording) status = "recording";
  else if (loading) status = "success";
  else if (hadVoice === false) status = "failed";
  else if (hadVoice === true) status = "success";
  else if (isLive) status = "listening";

  /**
   * Move to Processing ONLY after successful recording
   */
  useEffect(() => {
    if (!recording && !loading && hadVoice === true) {
      onComplete();
    }
  }, [recording, loading, hadVoice, onComplete]);

  return (
    <ScreenWrapper keyName="record">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          3 Easy Steps
        </h2>

        {/* Instructions */}
        <div className="space-y-2 text-slate-300 text-base">
          <p>① Take a deep breath</p>
          <p>② Tap to start</p>
          <p>③ Hum from your nose (mouth closed)</p>
        </div>

        {/* Start Button (ONLY on idle) */}
        {status === "idle" && (
          <Button label="Start Recording" onClick={start} />
        )}

        {/* Recording lock */}
        {status === "recording" && (
          <div className="px-6 py-3 rounded-lg bg-slate-700/60 text-white font-medium">
            Recording… {secondsLeft}s
          </div>
        )}

        {/* Waveform */}
        {(status === "listening" || status === "recording") && (
          <div className="pt-4 flex flex-col items-center gap-3">
            <Waveform active />
            <p className="text-sm text-slate-400">
              {status === "listening"
                ? "Waiting for humming…"
                : "Keep humming steadily…"}
            </p>
          </div>
        )}

        {/* Failure */}
        {status === "failed" && (
          <div className="pt-6 space-y-3">
            <p className="text-sm text-red-400">
              No humming detected. Please try again.
            </p>
            <Button label="Retry" onClick={reset} />
          </div>
        )}

        {/* Uploading */}
        {loading && (
          <p className="text-sm text-slate-400">
            Sending audio for analysis…
          </p>
        )}
      </div>
    </ScreenWrapper>
  );
}
