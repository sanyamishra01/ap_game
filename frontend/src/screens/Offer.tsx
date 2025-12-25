import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";
import { useLungStore } from "../state/useLungStore";
import { SCREEN_TIMINGS } from "../config/timings";

// Package images
import greenImg from "../assets/offers/green.png";
import yellowImg from "../assets/offers/yellow.png";
import redImg from "../assets/offers/red.png";

interface OfferProps {
  onNext: () => void;
}

export default function Offer({ onNext }: OfferProps) {
  const { zone } = useLungStore();

  // Auto-advance after configured time
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, SCREEN_TIMINGS.offer);

    return () => clearTimeout(timer);
  }, [onNext]);

  if (!zone) return null;

  const offers = {
    green: {
      price: "₹99",
      title: "Preventive Care Kit",
      items: "2 NOVICULE-TA sachets + 2 days assessment",
      urgency: "Maintain healthy breathing in high pollution.",
      image: greenImg,
    },
    yellow: {
      price: "₹299",
      title: "Protection Kit",
      items: "6 NOVICULE-TA sachets + 3 days assessment",
      urgency: "Recommended due to mild airway stress.",
      image: yellowImg,
    },
    red: {
      price: "₹499",
      title: "Urgent Care Package",
      items:
        "10 NOVICULE-TA sachets + 1-week Haal-Chaal report + Expert advisory",
      urgency: "Early support may help reduce discomfort.",
      image: redImg,
    },
  } as const;

  const offer = offers[zone];

  return (
    <ScreenWrapper keyName="offer">
      <div className="space-y-8 text-center">
        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
          Recommended for You
        </h2>

        {/* Offer Card */}
        <div className="rounded-2xl border border-slate-200 p-8 shadow-md space-y-5 max-w-md mx-auto">
          {/* Package Image */}
          <img
            src={offer.image}
            alt={offer.title}
            className={`w-40 h-40 mx-auto object-contain rounded-xl border-4 ${
              zone === "green"
                ? "border-green-400"
                : zone === "yellow"
                ? "border-yellow-400"
                : "border-red-400"
            }`}
          />

          <p className="text-5xl font-bold text-blue-600">
            {offer.price}
          </p>

          <p className="text-2xl font-semibold">
            {offer.title}
          </p>

          <p className="text-lg text-slate-600">
            {offer.items}
          </p>
        </div>

        {/* QR Placeholder */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-32 bg-slate-200 flex items-center justify-center text-slate-500 rounded">
            QR CODE
          </div>
          <p className="text-sm text-slate-500">
            Scan to continue on your phone
          </p>
        </div>

        {/* Urgency Message */}
        <p className="text-lg text-slate-700 max-w-md mx-auto">
          {offer.urgency}
        </p>

        {/* CTA (manual override) */}
        <div className="max-w-sm mx-auto">
          <Button label="Proceed" onClick={onNext} />
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-slate-400">
          Demo experience · No payment will be processed
        </p>
      </div>
    </ScreenWrapper>
  );
}
