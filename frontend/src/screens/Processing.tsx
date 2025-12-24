import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Loader from "../components/ui/Loader";

interface ProcessingProps {
  onComplete: () => void;
}

export default function Processing({ onComplete }: ProcessingProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <ScreenWrapper keyName="processing">
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-6">
        <Loader label="Analyzing airway vibration patterns…" />

        <p className="mt-6 text-lg text-slate-300 max-w-md text-center">
          Comparing voice resonance against reference breathing profiles.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Demo simulation · No medical inference
        </p>
      </div>
    </ScreenWrapper>
  );
}
