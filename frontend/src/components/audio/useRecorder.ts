import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const [recording, setRecording] = useState(false);
  const [isLive, setIsLive] = useState(false); // 🔴 LIVE mic indicator
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    /** ---------------------------
     * LIVE MIC CHECK (Web Audio)
     * --------------------------*/
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const checkLive = () => {
      analyser.getByteFrequencyData(data);
      const avg =
        data.reduce((a, b) => a + b, 0) / data.length;

      setIsLive(avg > 8); // threshold (safe for kiosk)
      rafRef.current = requestAnimationFrame(checkLive);
    };

    checkLive();

    /** ---------------------------
     * MEDIA RECORDER
     * --------------------------*/
    chunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      cancelAnimationFrame(rafRef.current!);
      setIsLive(false);
      setLoading(true);

      const audioBlob = new Blob(chunks.current, {
        type: "audio/webm",
      });

      try {
        const data = await uploadAudioAndGetAP(audioBlob);
        setApScores(data.ap_scores);
      } catch (err) {
        console.error("AP backend error:", err);
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.current.start();
    setRecording(true);

    setTimeout(() => stop(), 7000); // kiosk fixed duration
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return {
    start,
    recording,
    isLive,     // 🔴 expose LIVE status
    apScores,
    loading,
  };
};
