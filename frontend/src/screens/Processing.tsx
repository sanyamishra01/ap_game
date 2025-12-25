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
      <div className="flex flex-col items-center justify-center text-center px-6 space-y-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Processing your spectrograms…
        </h2>

        <p className="text-lg text-slate-300">
          Generating your Airway Patency score
        </p>

        <Loader />

        <p className="text-sm text-slate-500 max-w-md">
          Demo simulation · Not intended for medical diagnosis
        </p>
      </div>
    </ScreenWrapper>
  );
}
