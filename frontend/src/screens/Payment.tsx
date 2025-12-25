import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";
import qrImage from "../assets/payment-qr.jpeg";

interface PaymentProps {
  onProceed: () => void;
}

export default function Payment({ onProceed }: PaymentProps) {
  return (
    <ScreenWrapper keyName="payment">
      {/* HEADER */}
      <div className="px-6 pt-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Pay ₹20 to Start the Game
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center gap-6 text-center">
        {/* QR */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <img
            src={qrImage}
            alt="Payment QR Code"
            className="w-40 h-40 object-contain"
          />
        </div>

        <p className="text-sm text-slate-400">
          Scan using any UPI app
        </p>

        {/* CTA */}
        <div className="w-full max-w-xs">
          <Button label="Start Game" onClick={onProceed} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-6 pt-4 border-t border-white/20 text-center">
        <p className="text-xs text-slate-500">
          Demo kiosk · Payment verification not required
        </p>
      </div>
    </ScreenWrapper>
  );
}
