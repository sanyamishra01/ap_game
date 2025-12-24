import { useEffect, useState } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import { useLungStore } from "../state/useLungStore";

interface ExitProps {
  onReset: () => void;
}

export default function Exit({ onReset }: ExitProps) {
  const { reset } = useLungStore();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      reset();
      onReset();
    }, 10000); // auto reset after 10s

    return () => clearTimeout(timer);
  }, [onReset, reset]);

  return (
    <ScreenWrapper keyName="exit">
      <div className="space-y-8 text-center">
        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
          Stay Ahead of Air Quality
        </h2>

        {/* Subtext */}
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Download the app to get daily AQI alerts and repeat
          lung health checks.
        </p>

        {/* Scratch Card */}
        <div
          className="relative mx-auto w-64 h-40 rounded-xl bg-slate-300 flex items-center justify-center cursor-pointer"
          onClick={() => setRevealed(true)}
        >
          {!revealed && (
            <div className="absolute inset-0 bg-slate-400 flex items-center justify-center text-white font-semibold rounded-xl">
              Tap to Reveal Reward
            </div>
          )}

          {revealed && (
            <div className="text-2xl font-bold text-blue-600">
              ₹50 OFF 🎉
            </div>
          )}
        </div>

        {/* Instruction */}
        <p className="text-sm text-slate-500">
          App installation available on your phone
        </p>

        {/* Footer */}
        <p className="text-xs text-slate-400">
          Demo kiosk · Automatically resetting
        </p>
      </div>
    </ScreenWrapper>
  );
}
