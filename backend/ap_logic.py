import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300

# These match your Streamlit behaviour
AP_MIN_DB = 0.0     # silence
AP_MAX_DB = 80.0    # practical upper bound


def calculate_ap(audio_bytes: bytes):
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    fs = audio.frame_rate

    if samples.size == 0:
        return []

    # Restore original PCM scale
    samples /= (2**15)

    # STFT (EXACT Streamlit params)
    f, _, Zxx = stft(
        samples,
        fs=fs,
        window="hamming",
        nperseg=1024,
        noverlap=512,
        nfft=2048,
        boundary="zeros",
        padded=True,
    )

    freq_idx = np.where((f >= HUMMING_LOW_FREQ) & (f <= HUMMING_HIGH_FREQ))[0]
    if freq_idx.size == 0:
        return []

    Z_band = np.abs(Zxx[freq_idx, :])
    if Z_band.size == 0:
        return []

    # Frame-wise intensity
    intensity_db = 20 * np.log10(Z_band + 1e-6)
    avg_intensity = np.mean(intensity_db, axis=0)

    # Frame-wise AP (same as before)
    ap_frames = np.clip(avg_intensity / 100.0, 0, 1)

    # 🔑 CRITICAL FIX:
    # Use robust percentile instead of mean
    final_ap = float(np.percentile(ap_frames, 30))

    return [final_ap]
