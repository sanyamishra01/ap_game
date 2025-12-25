import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

const RECORD_DURATION = 7; // seconds
const VOICE_THRESHOLD = 10;

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const [recording, setRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hadVoice, setHadVoice] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    reset();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    /* ---------------------------
     * Web Audio live detection
     * --------------------------*/
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

      if (!hadVoice && avg > VOICE_THRESHOLD) {
        setHadVoice(true);
        setIsLive(true);
        startCountdown();
      }

      if (!hadVoice) {
        rafRef.current = requestAnimationFrame(detectVoice);
      }
    };

    detectVoice();

    /* ---------------------------
     * MediaRecorder
     * --------------------------*/
    chunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      cleanupDetection();

      if (!hadVoice) return;

      setLoading(true);
      const audioBlob = new Blob(chunks.current, { type: "audio/webm" });

      try {
        const data = await uploadAudioAndGetAP(audioBlob);
        setApScores(data.ap_scores);
      } catch (err) {
        console.error("Backend AP error:", err);
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const startCountdown = () => {
    setSecondsLeft(RECORD_DURATION);

    countdownRef.current = window.setInterval(() => {
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
    setRecording(false);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const cleanupDetection = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setIsLive(false);
  };

  const reset = () => {
    setRecording(false);
    setIsLive(false);
    setHadVoice(false);
    setSecondsLeft(null);
    setApScores(null);
    setLoading(false);
  };

  return {
    start,
    reset,
    recording,
    isLive,
    hadVoice,
    secondsLeft,
    apScores,
    loading,
  };
};
