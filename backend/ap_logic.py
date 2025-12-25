import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

# Humming band (Hz)
HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300

def calculate_ap(audio_bytes: bytes):
    # Load audio
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    sample_rate = audio.frame_rate

    if samples.size == 0:
        return []

    # 🔹 RMS normalize (keep)
    rms = np.sqrt(np.mean(samples**2)) + 1e-9
    samples = samples / rms

    # STFT
    f, t, Zxx = stft(
        samples,
        fs=sample_rate,
        window="hamming",
        nperseg=1024,
        noverlap=512,
        nfft=2048,
        boundary=None,
        padded=False,
    )

    # Humming band
    freq_mask = (f >= HUMMING_LOW_FREQ) & (f <= HUMMING_HIGH_FREQ)
    Zxx_band = np.abs(Zxx[freq_mask, :])

    if Zxx_band.size == 0:
        return []

    # Band energy per frame
    band_energy = np.mean(Zxx_band**2, axis=0)

    # Convert to dB
    band_energy_db = 10 * np.log10(band_energy + 1e-9)

    # 🔧 REALISTIC nasal humming range (post-RMS)
    MIN_DB = -34   # obstructed / weak nasal hum
    MAX_DB = -22   # very clear nasal resonance

    # Raw AP
    ap_scores = (band_energy_db - MIN_DB) / (MAX_DB - MIN_DB)
    ap_scores = np.clip(ap_scores, 0, 1)

    # 🧠 Stability & quality penalty
    median_db = np.median(band_energy_db)

    if median_db < -32:
        ap_scores *= 0.55   # very weak / unstable
    elif median_db < -29:
        ap_scores *= 0.75   # mild instability

    # Final clamp
    ap_scores = np.clip(ap_scores, 0, 1)

    return ap_scores.tolist()
