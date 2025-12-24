import { useEffect, useState } from "react";

interface CountdownProps {
  seconds: number;
  onComplete?: () => void;
}

export default function Countdown({
  seconds,
  onComplete,
}: CountdownProps) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count === 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="text-6xl font-bold text-blue-600">
      {count}
    </div>
  );
}
