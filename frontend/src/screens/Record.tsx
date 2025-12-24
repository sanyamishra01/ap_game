import { useRecorder } from "@/components/audio/useRecorder";
import Waveform from "@/components/audio/Waveform";

export default function Record() {
  const { start, recording, apScores, loading } = useRecorder();

  return (
    <div className="flex flex-col items-center gap-6">
      <Waveform active={recording} />

      <button
        onClick={start}
        disabled={recording}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        {recording ? "Recording..." : "Start Recording"}
      </button>

      {loading && <p>Analyzing audio...</p>}

      {apScores && (
        <div className="text-sm text-center">
          <p>AP samples received: {apScores.length}</p>
          <p>
            Latest AP:{" "}
            <strong>{apScores[apScores.length - 1].toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
