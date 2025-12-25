import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";

interface ExitProps {
  onExit: () => void;
}

export default function Exit({ onExit }: ExitProps) {
  return (
    <ScreenWrapper keyName="exit">
      {/* HEADER */}
      <div className="px-6 pt-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Thank You
        </h2>
      </div>

      {/* BODY */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center gap-6 text-center">
        <p className="text-slate-300 max-w-md">
          Your lung health check is complete.
        </p>

        <p className="text-slate-400">
          You may now step away from the kiosk.
        </p>

        <div className="w-full max-w-xs">
          <Button label="Exit" onClick={onExit} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-6 pt-4 border-t border-white/20 text-center">
        <p className="text-xs text-slate-500">
          Kiosk ready for next user
        </p>
      </div>
    </ScreenWrapper>
  );
}
