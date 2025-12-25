import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";

// replace with your WhatsApp QR image
import whatsappQr from "../assets/whatsapp-qr.jpeg";

interface WhatsAppProps {
  onNext: () => void;
}

export default function WhatsApp({ onNext }: WhatsAppProps) {
  return (
    <ScreenWrapper keyName="whatsapp">
      {/* HEADER */}
      <div className="px-6 pt-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Join Us on WhatsApp
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center gap-6 text-center">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <img
            src={whatsappQr}
            alt="WhatsApp QR Code"
            className="w-40 h-40 object-contain"
          />
        </div>

        <p className="text-sm text-slate-400 max-w-xs">
          Scan to receive your reports, tips, and updates on lung health.
        </p>

        <div className="w-full max-w-xs">
          <Button label="Next" onClick={onNext} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-6 pt-4 border-t border-white/20 text-center">
        <p className="text-xs text-slate-500">
          Optional · You can skip anytime
        </p>
      </div>
    </ScreenWrapper>
  );
}
