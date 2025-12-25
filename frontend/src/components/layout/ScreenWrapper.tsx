import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ScreenKey =
  | "home"
  | "payment"
  | "record"
  | "processing"
  | "result"
  | "offer"
  | "offer-payment"
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
        "
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <div
          className="
            w-full max-w-md md:max-w-lg
            h-[85vh] max-h-[680px]
            mx-auto
            flex flex-col
            rounded-2xl
            bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-[0_0_30px_rgba(59,130,246,0.3)]
            text-white
          "
        >
          {children}
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
