import { motion } from "framer-motion";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export default function Button({
  label,
  onClick,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const base =
    "w-full py-5 rounded-xl text-xl font-semibold transition-colors";

  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary:
      "bg-slate-200 text-slate-800 hover:bg-slate-300",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </motion.button>
  );
}
