import { motion } from "framer-motion";
import ScreenWrapper from "../components/layout/ScreenWrapper";
import Button from "../components/ui/Button";

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <ScreenWrapper keyName="home">
      <div className="text-center space-y-10">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">

          1-Minute Lung Health Check
        </h1>

        {/* AQI Context */}
        <div className="space-y-2">
          <p className="text-lg text-slate-500">
            Today’s Air Quality
          </p>
          <p className="text-2xl font-semibold text-red-600">
            Delhi AQI: 420 · Severe
          </p>
        </div>

        {/* Trust Copy */}
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          A quick voice-based check designed to help you understand
          how today’s air may be affecting your breathing.
        </p>

        {/* CTA */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="max-w-sm mx-auto"
        >
          <Button label="Start Check" onClick={onStart} />
        </motion.div>

        {/* Footer trust */}
        <p className="text-sm text-slate-400">
          Demo experience · No medical diagnosis
        </p>
        <p className="text-sm text-slate-400">Tech Atriocare · Made with ❤️ in IIT Delhi</p>
      </div>
    </ScreenWrapper>
  );
}
