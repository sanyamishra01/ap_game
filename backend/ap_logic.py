import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

# Frequency band for humming (Hz)
HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300


def calculate_ap(audio_bytes: bytes):
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    sample_rate = audio.frame_rate

    if samples.size == 0:
        return []

    # RMS normalize (critical)
    rms = np.sqrt(np.mean(samples**2)) + 1e-6
    samples = samples / rms

    f, t, Zxx = stft(
        samples,
        fs=sample_rate,
        window="hamming",
        nperseg=1024,
        noverlap=512,
        nfft=2048,
        boundary=None,
        padded=False
    )

    freq_mask = (f >= 80) & (f <= 300)
    Zxx_band = np.abs(Zxx[freq_mask, :])

    if Zxx_band.size == 0:
        return []

    # Band energy per frame
    band_energy = np.mean(Zxx_band**2, axis=0)

    # Convert to dB
    band_energy_db = 10 * np.log10(band_energy + 1e-9)

    # ✅ Absolute physiological mapping (NOT min-max)
    # Empirically safe range for nasal humming
    MIN_DB = -60   # very weak / obstructed
    MAX_DB = -20   # strong nasal resonance

    ap_scores = (band_energy_db - MIN_DB) / (MAX_DB - MIN_DB)
    ap_scores = np.clip(ap_scores, 0, 1)

    return ap_scores.tolist()
