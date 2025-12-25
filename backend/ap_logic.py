import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300

# 🔒 Physiological dB window (calibrated from your old system)
AP_MIN_DB = 10.0   # very weak hum
AP_MAX_DB = 60.0   # strong nasal hum


def calculate_ap(audio_bytes: bytes):
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    fs = audio.frame_rate

    if samples.size == 0:
        return []

    # STFT (MATCHES STREAMLIT)
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

    freq_indices = np.where(
        (f >= HUMMING_LOW_FREQ) & (f <= HUMMING_HIGH_FREQ)
    )[0]

    if freq_indices.size == 0:
        return []

    Z_band = np.abs(Zxx[freq_indices, :])

    if Z_band.size == 0:
        return []

    # Absolute dB (NO normalization)
    intensity_db = 20 * np.log10(Z_band + 1e-6)

    # Average over frequency band → frame-wise AP
    avg_intensity = np.mean(intensity_db, axis=0)

    # ✅ Correct AP mapping
    ap_scores = (avg_intensity - AP_MIN_DB) / (AP_MAX_DB - AP_MIN_DB)
    ap_scores = np.clip(ap_scores, 0, 1)

    return ap_scores.tolist()
