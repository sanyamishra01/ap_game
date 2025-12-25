import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import { useRecorder } from "../components/audio/useRecorder";
import Waveform from "../components/audio/Waveform";
import { SCREEN_TIMINGS } from "../config/timings";

type RecordProps = {
  onComplete: () => void;
};

export default function Record({ onComplete }: RecordProps) {
  const { start, recording } = useRecorder();

  /**
   * When recording stops, move to next screen
   * (NO analysis on this slide)
   */
  useEffect(() => {
    if (!recording) {
      const timer = setTimeout(() => {
        onComplete();
      }, SCREEN_TIMINGS.record);

      return () => clearTimeout(timer);
    }
  }, [recording, onComplete]);

  return (
    <ScreenWrapper keyName="record">
      <div className="space-y-10 text-center">
        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
          3 Easy Steps
        </h2>

        {/* Instructions */}
        <div className="space-y-3 text-lg text-slate-400 max-w-md mx-auto">
          <p>1️⃣ Take a deep breath</p>
          <p>2️⃣ Tap to start</p>
          <p>3️⃣ Hum from your nose (do not open your mouth)</p>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <button
            onClick={start}
            disabled={recording}
            className={`px-8 py-3 rounded text-white text-lg font-semibold transition
              ${
                recording
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {recording ? "Recording…" : "Start Recording"}
          </button>
        </div>

        {/* Recording Visual */}
        <div className="pt-6 flex flex-col items-center gap-4">
          <Waveform active={recording} />

          {recording && (
            <p className="text-sm text-slate-400">
              Recording in progress…
            </p>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
