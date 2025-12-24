import { useRef, useState } from "react";
import { uploadAudioAndGetAP } from "../../services/apService";

export const useRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  const [recording, setRecording] = useState(false);
  const [apScores, setApScores] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    chunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
      }
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(chunks.current, {
        type: "audio/webm",
      });

      setLoading(true);

      try {
        const data = await uploadAudioAndGetAP(audioBlob);
        setApScores(data.ap_scores);

        // OPTIONAL (recommended later):
        // useLungStore.getState().setApScores(data.ap_scores);

      } catch (err) {
        console.error("AP score error:", err);
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.current.start();
    setRecording(true);

    // auto-stop after 5 seconds
    setTimeout(() => stop(), 5000);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return {
    start,
    stop,
    recording,
    apScores,
    loading,
  };
};
