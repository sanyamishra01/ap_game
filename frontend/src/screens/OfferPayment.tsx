import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";

// reuse SAME QR image
import qrImage from "../assets/payment-qr.jpeg";

interface OfferPaymentProps {
  onProceed: () => void;
}

export default function OfferPayment({ onProceed }: OfferPaymentProps) {
  return (
    <ScreenWrapper keyName="offer-payment">
      {/* HEADER */}
      <div className="px-6 pt-6 text-center">
        <h2 className="text-4xl font-bold text-white">
          Complete Your Purchase
        </h2>
        <p className="mt-2 text-slate-300 text-sm">
          Scan & pay to proceed
        </p>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <img
          src={qrImage}
          alt="Payment QR Code"
          className="w-52 h-52 rounded-xl bg-white p-2 shadow-lg"
        />

        <p className="text-sm text-slate-400">
          Scan using any UPI app
        </p>
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-6 pt-3 border-t border-white/20">
        <Button label="Proceed" onClick={onProceed} />
        <p className="text-xs text-slate-400 mt-2 text-center">
          Demo kiosk · Payment verification not required
        </p>
      </div>
    </ScreenWrapper>
  );
}
