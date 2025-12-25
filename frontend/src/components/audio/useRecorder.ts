import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

const RECORD_DURATION = 6; // seconds
const VOICE_THRESHOLD = 10;

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const [recording, setRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hadVoice, setHadVoice] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // --- Audio context for LIVE detection ---
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const detectVoice = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      if (avg > VOICE_THRESHOLD) {
        setIsLive(true);
        setHadVoice(true); // 🔒 lock forever
      } else if (!hadVoice) {
        setIsLive(false);
      }

      rafRef.current = requestAnimationFrame(detectVoice);
    };

    detectVoice();

    // --- Media Recorder ---
    chunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);

      setRecording(false);
      setIsLive(false);

      // 🚫 Do NOT send silent audio
      if (!hadVoice) return;

      setLoading(true);

      try {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const res = await uploadAudioAndGetAP(blob);
        setApScores(res.ap_scores);
      } catch (err) {
        console.error("AP backend error:", err);
      } finally {
        setLoading(false);
      }
    };

    // --- Start recording ---
    mediaRecorder.current.start();
    setRecording(true);
    setHadVoice(false);
    setSecondsLeft(RECORD_DURATION);

    // --- Countdown ---
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (!prev || prev <= 1) {
          stop();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
  };

  const reset = () => {
    setRecording(false);
    setIsLive(false);
    setHadVoice(false);
    setSecondsLeft(null);
    setApScores(null);
  };

  return {
    start,
    stop,
    reset,
    recording,
    isLive,
    hadVoice,
    secondsLeft,
    apScores,
    loading,
  };
};
