import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

HUMMING_LOW_FREQ = 80
HUMMING_HIGH_FREQ = 300
GAMMA = 1.45  # 🔑 scale reducer


def calculate_ap(audio_bytes: bytes):
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    fs = audio.frame_rate
    if samples.size == 0:
        return []

    # restore PCM scale
    samples /= (2**15)

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

    intensity_db = 20 * np.log10(Z_band + 1e-6)
    avg_intensity = np.mean(intensity_db, axis=0)

    # frame-wise AP (original logic)
    ap_frames = np.clip(avg_intensity / 100.0, 0, 1)

    # 🔑 gentle scale reduction
    ap_frames = ap_frames ** GAMMA

    # robust aggregation
    final_ap = float(np.percentile(ap_frames, 30))

    return [final_ap]
