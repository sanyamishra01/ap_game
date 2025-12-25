import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300


def calculate_ap(audio_bytes: bytes):
    # Load audio
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    fs = audio.frame_rate

    if samples.size == 0:
        return []

    # STFT (MATCHES STREAMLIT SETTINGS)
    f, t, Zxx = stft(
        samples,
        fs=fs,
        window="hamming",
        nperseg=1024,
        noverlap=512,
        nfft=2048,
        boundary="zeros",
        padded=True,
    )

    # Select humming band
    freq_indices = np.where(
        (f >= HUMMING_LOW_FREQ) & (f <= HUMMING_HIGH_FREQ)
    )[0]

    if freq_indices.size == 0:
        return []

    filtered_Zxx = np.abs(Zxx[freq_indices, :])

    if filtered_Zxx.size == 0:
        return []

    # Convert to dB (ABSOLUTE, NOT NORMALIZED)
    stft_intensity = 20 * np.log10(filtered_Zxx + 1e-6)

    # Average across frequency band
    avg_intensity = np.mean(stft_intensity, axis=0)

    # FINAL AP (EXACT SAME FORMULA)
    ap_scores = np.clip(avg_intensity / 100.0, 0.0, 1.0)

    return ap_scores.tolist()
