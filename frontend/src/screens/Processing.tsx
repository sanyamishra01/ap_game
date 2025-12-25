import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Loader from "../components/ui/Loader";
import { SCREEN_TIMINGS } from "../config/timings";

interface ProcessingProps {
  onComplete: () => void;
}

export default function Processing({ onComplete }: ProcessingProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, SCREEN_TIMINGS.processing);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <ScreenWrapper keyName="processing">
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 space-y-10">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Processing your spectrograms…
        </h2>

        {/* Sub-heading */}
        <p className="text-xl text-slate-300">
          Generating your Airway Patency Score…
        </p>

        {/* Loader */}
        <Loader />

        {/* Disclaimer */}
        <p className="text-sm text-slate-500 max-w-md">
          Demo simulation · Not intended for medical diagnosis
        </p>
      </div>
    </ScreenWrapper>
  );
}
