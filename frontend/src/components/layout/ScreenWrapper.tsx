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
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Card */}
        <div
          className="
            w-full max-w-xl
            h-[88vh] max-h-[720px]
            rounded-2xl
            bg-white/15 backdrop-blur-xl
            border border-white/30
            shadow-[0_0_60px_rgba(236,72,153,0.45)]
            text-white
            flex flex-col
          "
        >
          {children}
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
