import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";

// ⬇️ replace with your actual QR image path
import qrImage from "../assets/payment-qr.png";

interface PaymentProps {
  onProceed: () => void;
}

export default function Payment({ onProceed }: PaymentProps) {
  return (
    <ScreenWrapper keyName="payment">
      <div className="text-center space-y-10">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow">
          Pay ₹20 to Start the Game
        </h2>

        {/* QR Section */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={qrImage}
            alt="Payment QR Code"
            className="w-48 h-48 rounded-xl shadow-lg bg-white p-2"
          />

          <p className="text-sm text-slate-400">
            Scan using any UPI app
          </p>
        </div>

        {/* CTA */}
        <div className="max-w-sm mx-auto">
          <Button label="Start Game" onClick={onProceed} />
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500">
          Demo kiosk · Payment verification not required
        </p>
      </div>
    </ScreenWrapper>
  );
}
