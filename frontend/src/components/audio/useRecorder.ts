import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

export const useRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [recording, setRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  /* --------------------------------
   * RESET (used for retry)
   * -------------------------------- */
  const reset = () => {
    chunksRef.current = [];
    setApScores(null);
    setIsLive(false);
    setLoading(false);
  };

  /* --------------------------------
   * START RECORDING
   * -------------------------------- */
  const start = async () => {
    if (recording) return; // guard

    reset();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    streamRef.current = stream;

    /* ---------- LIVE MIC DETECTION ---------- */
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const detectLive = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(data);
      const avg =
        data.reduce((sum, v) => sum + v, 0) / data.length;

      setIsLive(avg > 8); // tuned for humming

      rafRef.current = requestAnimationFrame(detectLive);
    };

    detectLive();

    /* ---------- MEDIA RECORDER ---------- */
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      // Cleanup live detection
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setIsLive(false);

      audioCtxRef.current?.close();
      audioCtxRef.current = null;

      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      setLoading(true);

      const audioBlob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });

      try {
        const data = await uploadAudioAndGetAP(audioBlob);
        setApScores(data.ap_scores ?? null);
      } catch (err) {
        console.error("AP backend error:", err);
        setApScores(null);
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.start();
    setRecording(true);

    // ⏱ Fixed kiosk duration
    setTimeout(() => stop(), 7000);
  };

  /* --------------------------------
   * STOP RECORDING
   * -------------------------------- */
  const stop = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);
  };

  return {
    start,
    stop,
    reset,

    recording,
    isLive, // 🔴 live mic indicator
    apScores,
    loading,
  };
};
