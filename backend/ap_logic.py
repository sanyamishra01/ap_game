import io
import numpy as np
from scipy.signal import stft
from pydub import AudioSegment

# Frequency bands (Hz)
HUM_LOW = 80
HUM_HIGH = 300
VOICE_HIGH = 2000


def calculate_ap(audio_bytes: bytes):
    # Load audio
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples()).astype(np.float32)
    fs = audio.frame_rate

    if samples.size == 0:
        return []

    # STFT (no normalization)
    f, t, Zxx = stft(
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

    # Masks
    hum_mask = (f >= HUM_LOW) & (f <= HUM_HIGH)
    voice_mask = (f >= HUM_LOW) & (f <= VOICE_HIGH)

    hum_energy = np.mean(power[hum_mask, :], axis=0)
    voice_energy = np.mean(power[voice_mask, :], axis=0)

    # Avoid divide-by-zero
    ratio = hum_energy / (voice_energy + 1e-9)

    # Clamp to [0,1]
    ap_scores = np.clip(ratio, 0, 1)

    return ap_scores.tolist()
