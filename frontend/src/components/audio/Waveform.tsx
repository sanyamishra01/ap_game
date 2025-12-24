import { motion } from "framer-motion";

interface WaveformProps {
  active?: boolean;
  bars?: number;
}

export default function Waveform({
  active = true,
  bars = 24,
}: WaveformProps) {
  return (
    <div className="flex items-end justify-center gap-1 h-20">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 rounded bg-blue-500"
          initial={{ height: 8 }}
          animate={{
            height: active
              ? [8, Math.random() * 60 + 10, 8]
              : 8,
          }}
          transition={{
            duration: 0.8,
            repeat: active ? Infinity : 0,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
