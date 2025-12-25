import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import { useLungStore } from "../state/useLungStore";

interface ResultProps {
  onNext: () => void;
}

export default function Result({ onNext }: ResultProps) {
  const { lhi, zone } = useLungStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNext]);

  if (lhi === null || zone === null) return null;

  const zoneConfig = {
    green: {
      bg: "bg-green-500",
      label: "Green Zone",
      text: "Airways are open with minimal signs of irritation.",
    },
    yellow: {
      bg: "bg-yellow-400",
      label: "Yellow Zone",
      text: "Mild airway narrowing detected.",
    },
    red: {
      bg: "bg-red-500",
      label: "Red Zone",
      text: "Severe airway inflammation likely.",
    },
  } as const;

  const config = zoneConfig[zone];

  return (
    <ScreenWrapper keyName="result">
      <div className="space-y-8 text-center">
        {/* Result Card */}
        <div
          className={`rounded-2xl p-10 text-white shadow-xl ${config.bg}`}
        >
          <p className="text-lg opacity-90">Your Airway Patency Score</p>

          <p className="text-7xl font-bold my-4">{lhi}</p>

          <p className="text-2xl font-semibold">{config.label}</p>
        </div>

        {/* Explanation */}
        <p className="text-xl text-slate-700 max-w-md mx-auto">
          {config.text}
        </p>

        {/* Footer */}
        <p className="text-sm text-slate-400">
          This result is a simulated risk indicator, not a medical diagnosis.
        </p>
      </div>
    </ScreenWrapper>
  );
}
