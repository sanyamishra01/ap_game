import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";
import { useLungStore } from "../state/useLungStore";
import { SCREEN_TIMINGS } from "../config/timings";

import greenImg from "../assets/green.png";
import yellowImg from "../assets/yellow.png";
import redImg from "../assets/red.png";

export default function Offer({ onNext }: { onNext: () => void }) {
  const { zone } = useLungStore();

  useEffect(() => {
    const timer = setTimeout(onNext, SCREEN_TIMINGS.offer);
    return () => clearTimeout(timer);
  }, [onNext]);

  if (!zone) return null;

  const offers: Record<
    "green" | "yellow" | "red",
    {
      price: string;
      title: string;
      items: string;
      image: string;
    }
  > = {
    green: {
      price: "₹99",
      title: "Preventive Care Kit",
      items: "2 NOVICULE-TA sachets + 2 days assessment",
      image: greenImg,
    },
    yellow: {
      price: "₹299",
      title: "Protection Kit",
      items: "6 NOVICULE-TA sachets + 3 days assessment",
      image: yellowImg,
    },
    red: {
      price: "₹499",
      title: "Urgent Care Package",
      items:
        "10 NOVICULE-TA sachets + 1-week Haal-Chaal report + expert advisory",
      image: redImg,
    },
  };

  const offer = offers[zone];

  return (
    <ScreenWrapper keyName="offer">
      <div className="px-6 pt-6 text-center">
        <h2 className="text-4xl font-bold text-white">
          Recommended for You
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="rounded-2xl border border-white/20 p-6 space-y-4 text-center">
          <img
            src={offer.image}
            alt={offer.title}
            className="w-28 h-28 mx-auto object-contain"
          />

          <p className="text-4xl font-bold text-blue-400">
            {offer.price}
          </p>

          <p className="text-xl font-semibold">
            {offer.title}
          </p>

          <p className="text-sm text-slate-300">
            {offer.items}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-white/20">
        <Button label="Proceed" onClick={onNext} />
        <p className="text-xs text-slate-400 mt-2 text-center">
          Demo experience · No payment will be processed
        </p>
      </div>
    </ScreenWrapper>
  );
}
