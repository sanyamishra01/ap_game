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
    isLive,
    hadVoice,
    secondsLeft,
    loading,
  } = useRecorder();

  const showRetry = !recording && !loading && hadVoice === false;

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

        {/* Start / Recording Button */}
        {!recording && !loading && (
          <div className="pt-2">
            <Button label="Start Recording" onClick={start} />
          </div>
        )}

        {recording && (
          <div className="px-6 py-3 rounded-lg bg-slate-700/60 text-white font-medium">
            Recording… {secondsLeft}s
          </div>
        )}

        {/* Waveform */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <Waveform active={recording || isLive} />

          {/* Live mic feedback */}
          {recording && (
            <p className="text-sm text-slate-400">
              Keep humming steadily…
            </p>
          )}

          {!recording && isLive && (
            <p className="text-sm text-green-400">
              🎤 Voice detected
            </p>
          )}
        </div>

        {/* Retry */}
        {showRetry && (
          <div className="pt-6 space-y-2">
            <p className="text-sm text-red-400">
              No humming detected. Please try again.
            </p>
            <Button label="Retry" onClick={reset} variant="danger" />
          </div>
        )}

        {/* Transition trigger */}
        {loading && (
          <div className="pt-4 text-slate-400 text-sm">
            Sending audio for analysis…
          </div>
        )}

        {/* Auto-proceed when recording + upload finishes */}
        {loading === false && hadVoice === true && !recording && (
          <>
            {onComplete()}
          </>
        )}
      </div>
    </ScreenWrapper>
  );
}
