import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

const RECORD_DURATION_SEC = 5; // 🔧 configurable

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [recording, setRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hadVoice, setHadVoice] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- RESET ---------------- */
  const reset = () => {
    setRecording(false);
    setIsLive(false);
    setHadVoice(false);
    setSecondsLeft(null);
    setApScores(null);
    setLoading(false);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    audioCtxRef.current?.close();
  };

  /* ---------------- START ---------------- */
  const start = async () => {
    reset();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    /* ---------- LIVE DETECTION (ONCE) ---------- */
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const detectHumOnce = () => {
      if (hadVoice) return;

      analyser.getByteFrequencyData(data);
      const avg =
        data.reduce((a, b) => a + b, 0) / data.length;

      if (avg > 10) {
        // 🔒 LOCK
        setHadVoice(true);
        setIsLive(true);

        // ⏱️ START TIMER
        let remaining = RECORD_DURATION_SEC;
        setSecondsLeft(remaining);

        timerRef.current = setInterval(() => {
          remaining -= 1;
          setSecondsLeft(remaining);

          if (remaining <= 0) {
            clearInterval(timerRef.current!);
            stop();
          }
        }, 1000);

        cancelAnimationFrame(rafRef.current!);
        return;
      }

      rafRef.current = requestAnimationFrame(detectHumOnce);
    };

    detectHumOnce();

    /* ---------- MEDIA RECORDER ---------- */
    chunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      setRecording(false);
      setIsLive(false);
      setSecondsLeft(null);
      audioCtxRef.current?.close();

      if (!hadVoice) return; // ❌ do nothing if silent

      setLoading(true);

      const audioBlob = new Blob(chunks.current, {
        type: "audio/webm",
      });

      try {
        const res = await uploadAudioAndGetAP(audioBlob);
        setApScores(res.ap_scores);
      } catch (err) {
        console.error("AP backend error:", err);
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  /* ---------------- STOP ---------------- */
  const stop = () => {
    mediaRecorder.current?.stop();
  };

  return {
    start,
    reset,
    recording,
    isLive,
    hadVoice,
    secondsLeft, // ⏱️ expose timer
    apScores,
    loading,
  };
};
