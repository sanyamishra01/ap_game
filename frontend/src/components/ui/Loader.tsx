import { motion } from "framer-motion";

interface LoaderProps {
  label?: string;
}

export default function Loader({
  label = "Processing…",
}: LoaderProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
      <p className="text-lg text-slate-600">
        {label}
      </p>
    </div>
  );
}
