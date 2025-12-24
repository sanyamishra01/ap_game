import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScreenWrapperProps {
  children: ReactNode;
  keyName?: string;
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
            min-h-screen flex items-center justify-center p-4
            bg-gradient-to-br
            from-[#020617]
            via-[#0f172a]
            to-[#0ea5e9]
          "
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="
            w-full max-w-xl p-8 rounded-2xl
            bg-white/15 backdrop-blur-xl
            border border-white/30
            shadow-[0_0_60px_rgba(236,72,153,0.45)]
            text-white
          ">

          {children}
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
