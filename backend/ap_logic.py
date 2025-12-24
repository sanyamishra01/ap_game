import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

# Frequency band for humming (Hz)
HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300


def calculate_ap(audio_bytes: bytes):
    """
    Core AP (Airway Patency) logic.
    Takes raw audio bytes and returns AP scores as a list.
    """

    # Load audio from bytes (supports wav/webm/mp3)
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))

    # Convert to mono
    audio = audio.set_channels(1)

    # Extract raw samples
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    sample_rate = audio.frame_rate

    # Safety check
    if samples.size == 0:
        return []

    # Short-Time Fourier Transform
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

    # Select humming frequency band
    freq_mask = (f >= HUMMING_LOW_FREQ) & (f <= HUMMING_HIGH_FREQ)
    Zxx_band = np.abs(Zxx[freq_mask, :])

    if Zxx_band.size == 0:
        return []

    # Convert to intensity (dB)
    intensity_db = 20 * np.log10(Zxx_band + 1e-6)

    # Average intensity over frequency band
    avg_intensity = np.mean(intensity_db, axis=0)

    # Normalize to [0, 1] → AP score
    ap_scores = (avg_intensity - avg_intensity.min()) / (
        avg_intensity.max() - avg_intensity.min() + 1e-6
    )

    return ap_scores.tolist()
