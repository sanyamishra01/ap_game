import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ScreenKey =
  | "home"
  | "payment"
  | "record"
  | "processing"
  | "result"
  | "offer"
  | "exit";

interface ScreenWrapperProps {
  children: ReactNode;
  keyName: ScreenKey;
}

export default function ScreenWrapper({
  children,
  keyName,
}: ScreenWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={keyName}
        className="
          min-h-screen flex items-center justify-center
          bg-gradient-to-br
          from-[#020617]
          via-[#0f172a]
          to-[#0ea5e9]
          px-3 py-4
        "
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Kiosk Card */}
        <div
          className="
            w-full max-w-xl
            h-[92vh] sm:h-[88vh] max-h-[760px]
            rounded-2xl
            bg-white/15 backdrop-blur-xl
            border border-white/30
            shadow-[0_0_60px_rgba(236,72,153,0.45)]
            text-white
            flex flex-col
          "
        >
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
            {children}
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
