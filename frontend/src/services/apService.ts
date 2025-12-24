const API_BASE = import.meta.env.VITE_API_BASE;

export async function uploadAudioAndGetAP(audioBlob: Blob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  const res = await fetch(`${API_BASE}/ap-score`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  return await res.json();
}
