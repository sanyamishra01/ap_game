import { useEffect } from "react";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";
import { useLungStore } from "../state/useLungStore";

interface OfferProps {
  onNext: () => void;
}

export default function Offer({ onNext }: OfferProps) {
  const { zone } = useLungStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 6000); // auto move after 6s

    return () => clearTimeout(timer);
  }, [onNext]);

  if (!zone) return null;

  const offers = {
    green: {
      price: "₹99",
      title: "Preventive Care Kit",
      items: "2 immunity-boosting sachets",
      urgency: "Maintain healthy breathing in high pollution.",
    },
    yellow: {
      price: "₹299",
      title: "Protection Kit",
      items: "5 sachets + anti-pollution mask",
      urgency: "Recommended due to mild airway stress.",
    },
    red: {
      price: "₹499",
      title: "Urgent Care Package",
      items: "Tele-consult + meds + 1-week kit",
      urgency: "Early support may help reduce discomfort.",
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
        <div className="rounded-2xl border border-slate-200 p-8 shadow-md space-y-4">
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

        {/* Urgency */}
        <p className="text-lg text-slate-700 max-w-md mx-auto">
          {offer.urgency}
        </p>

        {/* CTA */}
        <div className="max-w-sm mx-auto">
          <Button label="Proceed" />
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-slate-400">
          Demo experience · No payment will be processed
        </p>
      </div>
    </ScreenWrapper>
  );
}
