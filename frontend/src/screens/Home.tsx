import { motion } from "framer-motion";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <ScreenWrapper keyName="home">
      {/* HEADER */}
      <div className="px-6 pt-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">
          1-Minute Lung Health Check
        </h1>
      </div>

      {/* BODY */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center gap-6 text-center">
        {/* AQI Context */}
        <div className="space-y-1">
          <p className="text-sm md:text-base text-slate-400">
            Today’s Air Quality
          </p>
          <p className="text-lg md:text-xl font-medium text-red-500">
            Delhi AQI: 420 · Severe
          </p>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-slate-300 max-w-sm">
          A quick voice-based check to understand how today’s air
          may be affecting your breathing.
        </p>

        {/* CTA */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full max-w-xs"
        >
          <Button label="Start Check" onClick={onStart} />
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-6 pt-4 border-t border-white/20 text-center space-y-1">
        <p className="text-xs text-slate-500">
          Demo experience · No medical diagnosis
        </p>
        <p className="text-xs text-slate-500">
          Tech Atriocare · Made with ❤️ in IIT Delhi
        </p>
      </div>
    </ScreenWrapper>
  );
}
