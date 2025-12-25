import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

# Frequency bands (Hz)
LFE_LOW, LFE_HIGH = 1000, 2000
HFE_LOW, HFE_HIGH = 4000, 5000

# Calibrated physiological bounds (UPDATED)
LOG_MIN = -1.1   # clear nasal hum
LOG_MAX = -0.2   # severe obstruction

VOICE_POWER_THRESHOLD = 1e-6  # voiced-frame gate


def calculate_ap(audio_bytes: bytes):
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    fs = audio.frame_rate

    if samples.size == 0:
        return []

    # Remove DC & normalize loudness
    samples -= np.mean(samples)
    samples /= (np.sqrt(np.mean(samples**2)) + 1e-9)

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

    lfe_mask = (f >= LFE_LOW) & (f <= LFE_HIGH)
    hfe_mask = (f >= HFE_LOW) & (f <= HFE_HIGH)

    if not np.any(lfe_mask) or not np.any(hfe_mask):
        return []

    ap_frames = []

    for t in range(power.shape[1]):
        lfe = np.mean(power[lfe_mask, t])
        hfe = np.mean(power[hfe_mask, t])

        # ✅ voiced-frame gate
        if lfe < VOICE_POWER_THRESHOLD:
            continue

        ratio = hfe / (lfe + 1e-12)
        log_ratio = np.log10(ratio + 1e-12)

        ap = 1 - (log_ratio - LOG_MIN) / (LOG_MAX - LOG_MIN)
        ap_frames.append(np.clip(ap, 0, 1))

    if len(ap_frames) == 0:
        return []

    # ✅ MEDIAN is the key
    final_ap = float(np.median(ap_frames))

    return [final_ap]
