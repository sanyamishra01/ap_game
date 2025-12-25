import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300

AP_MIN_DB = 10.0   # same physiological meaning as before
AP_MAX_DB = 60.0


def calculate_ap(audio_bytes: bytes):
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    # 🔴 CRITICAL FIX: restore PCM scale
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    samples = samples / (2**15)

    fs = audio.frame_rate
    if samples.size == 0:
        return []

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

    freq_idx = np.where(
        (f >= HUMMING_LOW_FREQ) & (f <= HUMMING_HIGH_FREQ)
    )[0]

    if freq_idx.size == 0:
        return []

    Z_band = np.abs(Zxx[freq_idx, :])
    if Z_band.size == 0:
        return []

    intensity_db = 20 * np.log10(Z_band + 1e-12)
    avg_intensity = np.mean(intensity_db, axis=0)

    # ✅ EXACT SAME AP SCALE AS STREAMLIT
    ap_scores = (avg_intensity - AP_MIN_DB) / (AP_MAX_DB - AP_MIN_DB)
    ap_scores = np.clip(ap_scores, 0, 1)

    return ap_scores.tolist()
