#!/usr/bin/env python3
"""Minimal original DSP toolkit used to synthesize every sound in this project.

Nothing here samples, downloads or wraps an external audio service - all output
is generated from oscillators, shaped noise and filters (Section 9a).
"""
import numpy as np
from scipy import signal as sig

SR = 48000


# --------------------------------------------------------------------------
# sources
# --------------------------------------------------------------------------
def t(dur):
    return np.arange(int(dur * SR)) / SR


def sine(freq, dur, phase=0.0):
    """freq may be a scalar or a per-sample array (for glides)."""
    n = int(dur * SR)
    if np.isscalar(freq):
        return np.sin(2 * np.pi * freq * (np.arange(n) / SR) + phase)
    f = np.asarray(freq)[:n]
    return np.sin(2 * np.pi * np.cumsum(f) / SR + phase)


def saw(freq, dur):
    n = int(dur * SR)
    f = np.full(n, freq) if np.isscalar(freq) else np.asarray(freq)[:n]
    ph = (np.cumsum(f) / SR) % 1.0
    return 2 * ph - 1


def noise(dur, seed=None):
    rng = np.random.default_rng(seed)
    return rng.standard_normal(int(dur * SR))


def pink(dur, seed=None):
    """1/f noise via a cascaded one-pole approximation (Voss-McCartney style)."""
    w = noise(dur, seed)
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1, -2.494956002, 2.017265875, -0.522189400]
    return sig.lfilter(b, a, w)


# --------------------------------------------------------------------------
# envelopes
# --------------------------------------------------------------------------
def env_exp(dur, attack=0.002, decay=None, curve=4.0):
    """Percussive envelope: fast attack, exponential decay."""
    n = int(dur * SR)
    decay = decay if decay is not None else dur - attack
    a = int(attack * SR)
    d = max(1, min(n - a, int(decay * SR)))
    e = np.zeros(n)
    if a > 0:
        e[:a] = np.linspace(0, 1, a) ** 0.5
    e[a:a + d] = np.exp(-curve * np.linspace(0, 1, d))
    return e


def env_swell(dur, peak=0.45, curve=2.0):
    """Symmetric-ish swell for risers and air textures."""
    n = int(dur * SR)
    p = int(np.clip(peak, 0.01, 0.99) * n)
    e = np.zeros(n)
    e[:p] = np.linspace(0, 1, p) ** curve
    e[p:] = np.cos(np.linspace(0, np.pi / 2, n - p)) ** curve
    return e


def glide(a, b, dur, curve=2.5):
    """Exponential frequency glide from a to b."""
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    return a * (b / a) ** (x ** (1.0 / curve))


# --------------------------------------------------------------------------
# filters
# --------------------------------------------------------------------------
def _clip_hz(f):
    return float(np.clip(f, 20.0, SR * 0.45))


def lp(x, hz, order=4):
    sos = sig.butter(order, _clip_hz(hz), 'lowpass', fs=SR, output='sos')
    return sig.sosfilt(sos, x)


def hp(x, hz, order=4):
    sos = sig.butter(order, _clip_hz(hz), 'highpass', fs=SR, output='sos')
    return sig.sosfilt(sos, x)


def bp(x, lo, hi, order=4):
    lo, hi = _clip_hz(lo), _clip_hz(hi)
    if hi <= lo * 1.05:
        hi = lo * 1.2
    sos = sig.butter(order, [lo, _clip_hz(hi)], 'bandpass', fs=SR, output='sos')
    return sig.sosfilt(sos, x)


def sweep_bp(x, f_lo, f_hi, q=1.9, block=256):
    """Band-pass whose centre frequency follows a per-sample array.

    Processed in short blocks with a static biquad per block, which keeps the
    sweep smooth while staying fast in numpy.
    """
    n = len(x)
    fc = np.asarray(f_lo) if not np.isscalar(f_lo) else np.linspace(f_lo, f_hi, n)
    fc = fc[:n]
    out = np.zeros(n)
    zi = None
    for s in range(0, n, block):
        e = min(n, s + block)
        c = _clip_hz(float(np.mean(fc[s:e])))
        bw = max(c / q, 30.0)
        sos = sig.butter(2, [_clip_hz(c - bw / 2), _clip_hz(c + bw / 2)],
                         'bandpass', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        y, zi = sig.sosfilt(sos, x[s:e], zi=zi)
        out[s:e] = y
    return out


def resonator(x, hz, q=28.0):
    """High-Q peaking resonator - gives ticks and clicks a metallic body."""
    w = _clip_hz(hz) / (SR / 2)
    b, a = sig.iirpeak(w, q)
    return sig.lfilter(b, a, x)


# --------------------------------------------------------------------------
# shaping / space
# --------------------------------------------------------------------------
def saturate(x, drive=2.0):
    return np.tanh(x * drive) / np.tanh(drive)


def reverb(x, decay=1.6, mix=0.3, pre=0.012, seed=7, damp=6500):
    """Convolution reverb against a synthetic exponential-decay noise tail."""
    n_ir = int(decay * SR)
    rng = np.random.default_rng(seed)
    ir = rng.standard_normal(n_ir) * np.exp(-np.linspace(0, 6.5, n_ir))
    ir = lp(ir, damp)
    ir[:int(pre * SR)] = 0.0
    ir /= (np.sqrt(np.sum(ir ** 2)) + 1e-9)
    wet = sig.fftconvolve(x, ir)[:len(x) + n_ir]
    out = np.zeros(len(wet))
    out[:len(x)] += x * (1 - mix)
    out += wet * mix
    return out


def stereo(x, pan=0.0, spread=0.0, seed=3):
    """Mono -> stereo. `spread` adds a short decorrelating delay per side."""
    p = np.clip(pan, -1, 1)
    l_g = np.cos((p + 1) * np.pi / 4)
    r_g = np.sin((p + 1) * np.pi / 4)
    left, right = x * l_g, x * r_g
    if spread > 0:
        d = int(spread * SR)
        rng = np.random.default_rng(seed)
        jl, jr = d, d + rng.integers(3, 40)
        left = np.concatenate([np.zeros(jl), left])[:len(x)] * 0.5 + left * 0.5
        right = np.concatenate([np.zeros(jr), right])[:len(x)] * 0.5 + right * 0.5
    return np.stack([left, right], axis=1)


def pan_move(x, start, end):
    """Constant-power pan that travels across the stereo field."""
    n = len(x)
    p = np.linspace(start, end, n)
    return np.stack([x * np.cos((p + 1) * np.pi / 4),
                     x * np.sin((p + 1) * np.pi / 4)], axis=1)


def normalize(x, peak=0.97):
    m = np.max(np.abs(x))
    return x if m < 1e-9 else x * (peak / m)


def fit(x, n):
    """Trim or zero-pad to exactly n samples (works mono or stereo)."""
    if x.ndim == 1:
        out = np.zeros(n)
        k = min(n, len(x))
        out[:k] = x[:k]
        return out
    out = np.zeros((n, x.shape[1]))
    k = min(n, len(x))
    out[:k] = x[:k]
    return out


def add_at(dst, src, start, gain=1.0):
    """Mix `src` into `dst` at sample offset `start`, clipping at the edges."""
    if start >= len(dst):
        return
    s = max(0, start)
    off = s - start
    k = min(len(dst) - s, len(src) - off)
    if k <= 0:
        return
    if dst.ndim == 2 and src.ndim == 1:
        dst[s:s + k, 0] += src[off:off + k] * gain
        dst[s:s + k, 1] += src[off:off + k] * gain
    else:
        dst[s:s + k] += src[off:off + k] * gain


def write_wav(path, x, sr=SR):
    """16-bit PCM WAV writer (stdlib only)."""
    import wave
    x = np.asarray(x)
    if x.ndim == 1:
        x = x[:, None]
    x = np.clip(x, -1.0, 1.0)
    pcm = (x * 32767.0).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(x.shape[1])
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def db(x):
    """RMS level in dBFS."""
    r = np.sqrt(np.mean(np.asarray(x) ** 2))
    return -np.inf if r < 1e-12 else 20 * np.log10(r)
