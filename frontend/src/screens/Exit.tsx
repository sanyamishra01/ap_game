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
    }, SCREEN_TIMINGS.exit ?? 8000);

    return () => clearTimeout(timer);
  }, [onReset, reset]);

  return (
    <ScreenWrapper keyName="exit">
      {/* HEADER */}
      <div className="px-6 pt-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Thank You
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-base md:text-lg text-slate-300">
          Your lung health check is complete.
        </p>

        {/* <p className="text-sm text-slate-400">
          You may now step away from the kiosk.
        </p> */}
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-6 pt-4 border-t border-white/20 text-center">
        <p className="text-xs text-slate-500">
          Automatically resetting…
        </p>
      </div>
    </ScreenWrapper>
  );
}
