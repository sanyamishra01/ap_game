import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import { useLungStore } from "../state/useLungStore";
import { SCREEN_TIMINGS } from "../config/timings";

interface ExitProps {
  onReset: () => void;
}

export default function Exit({ onReset }: ExitProps) {
  const { reset } = useLungStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      reset();
      onReset();
    }, SCREEN_TIMINGS.exit);

    return () => clearTimeout(timer);
  }, [onReset, reset]);

  return (
    <ScreenWrapper keyName="exit">
      <div className="space-y-8 text-center">
        {/* Main Message */}
        <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
          Thank You
        </h2>

        {/* Subtext */}
        <p className="text-xl text-slate-400 max-w-md mx-auto">
          Your lung health check is complete.
        </p>

        {/* Instruction */}
        <p className="text-lg text-slate-500">
          You may now step away from the kiosk.
        </p>

        {/* Footer */}
        <p className="text-sm text-slate-600">
          Automatically resetting…
        </p>
      </div>
    </ScreenWrapper>
  );
}
