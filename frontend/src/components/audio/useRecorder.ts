import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

export const useRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const [recording, setRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);       // 🔴 live mic indicator
  const [hadVoice, setHadVoice] = useState(false);   // ✅ voice ever detected
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  /* -----------------------------
   * START RECORDING
   * ---------------------------- */
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Reset states
      chunksRef.current = [];
      setApScores(null);
      setHadVoice(false);
      setIsLive(false);

      /* -----------------------------
       * LIVE MIC ANALYSIS
       * ---------------------------- */
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;

      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);

      const detectLiveAudio = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(data);
        const avg =
          data.reduce((sum, v) => sum + v, 0) / data.length;

        if (avg > 8) {
          setIsLive(true);
          setHadVoice(true); // ✅ voice detected at least once
        } else {
          setIsLive(false);
        }

        rafRef.current = requestAnimationFrame(detectLiveAudio);
      };

      detectLiveAudio();

      /* -----------------------------
       * MEDIA RECORDER
       * ---------------------------- */
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Cleanup analyser loop
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        setIsLive(false);
        setRecording(false);

        audioCtxRef.current?.close();
        streamRef.current?.getTracks().forEach((t) => t.stop());

        // 🚫 BLOCK backend if no voice
        if (!hadVoice) {
          setLoading(false);
          setApScores(null);
          return;
        }

        setLoading(true);

        const audioBlob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        try {
          const data = await uploadAudioAndGetAP(audioBlob);
          setApScores(data?.ap_scores ?? null);
        } catch (err) {
          console.error("AP backend error:", err);
          setApScores(null);
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      setRecording(true);

      // ⏱️ Fixed kiosk duration
      setTimeout(() => stop(), 7000);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  /* -----------------------------
   * STOP RECORDING
   * ---------------------------- */
  const stop = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  /* -----------------------------
   * RESET (for retry)
   * ---------------------------- */
  const reset = () => {
    setRecording(false);
    setIsLive(false);
    setHadVoice(false);
    setApScores(null);
    setLoading(false);
    chunksRef.current = [];
  };

  return {
    start,
    stop,
    reset,

    recording,
    isLive,     // 🔴 live mic indicator
    hadVoice,   // ✅ whether voice was detected
    apScores,
    loading,
  };
};
