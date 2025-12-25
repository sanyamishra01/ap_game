import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

const RECORD_DURATION = 6; // seconds
const VOICE_THRESHOLD = 8;

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null); // ✅ FIXED

  const [recording, setRecording] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [hadVoice, setHadVoice] = useState<boolean | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    reset();

    setHasStarted(true);
    setRecording(true);
    setSecondsLeft(RECORD_DURATION);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    /** Voice detection (once only) */
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);
    let voiceDetected = false;

    const detectVoice = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      if (!voiceDetected && avg > VOICE_THRESHOLD) {
        voiceDetected = true;
        setIsLive(true);
        cancelAnimationFrame(rafRef.current!);
      }

      if (!voiceDetected) {
        rafRef.current = requestAnimationFrame(detectVoice);
      }
    };

    detectVoice();

    /** MediaRecorder */
    chunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      cancelAnimationFrame(rafRef.current!);
      setRecording(false);

      if (!voiceDetected) {
        setHadVoice(false);
        return;
      }

      setHadVoice(true);
      setLoading(true);

      try {
        const audioBlob = new Blob(chunks.current, { type: "audio/webm" });
        const res = await uploadAudioAndGetAP(audioBlob);
        setApScores(res.ap_scores);
      } catch (e) {
        console.error("AP backend error", e);
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.current.start();

    /** Countdown timer */
    countdownRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (!s || s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const reset = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    setRecording(false);
    setHasStarted(false);
    setIsLive(false);
    setHadVoice(null);
    setSecondsLeft(null);
    setApScores(null);
    setLoading(false);
  };

  return {
    start,
    stop,
    reset,
    recording,
    hasStarted,
    isLive,
    hadVoice,
    secondsLeft,
    apScores,
    loading,
  };
};
