import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

# Frequency bands (Hz)
LFE_LOW = 1000
LFE_HIGH = 2000

HFE_LOW = 4000
HFE_HIGH = 5000

# Log-ratio bounds (physiologically calibrated)
LOG_MIN = -1.3   # clear airway
LOG_MAX = 0.1    # severe obstruction


def calculate_ap(audio_bytes: bytes):
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    fs = audio.frame_rate

    if samples.size == 0:
        return []

    # 🔑 Remove DC offset
    samples = samples - np.mean(samples)

    # 🔑 RMS normalization (global, safe)
    rms = np.sqrt(np.mean(samples**2)) + 1e-9
    samples = samples / rms

    # STFT
    f, _, Zxx = stft(
        samples,
        fs=fs,
        window="hann",
        nperseg=1024,
        noverlap=512,
        nfft=2048,
        boundary=None,
        padded=False,
    )

    power = np.abs(Zxx) ** 2

    # Band masks
    lfe_mask = (f >= LFE_LOW) & (f <= LFE_HIGH)
    hfe_mask = (f >= HFE_LOW) & (f <= HFE_HIGH)

    if not np.any(lfe_mask) or not np.any(hfe_mask):
        return []

    # Total energy across time
    lfe_energy = np.sum(np.mean(power[lfe_mask, :], axis=0))
    hfe_energy = np.sum(np.mean(power[hfe_mask, :], axis=0))

    if lfe_energy <= 0:
        return []

    # Ratio
    ratio = hfe_energy / lfe_energy

    # Log scale
    log_ratio = np.log10(ratio + 1e-12)

    # Normalize → AP score
    ap = 1 - (log_ratio - LOG_MIN) / (LOG_MAX - LOG_MIN)
    ap = float(np.clip(ap, 0, 1))

    return [ap]
