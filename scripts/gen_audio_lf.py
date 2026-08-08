#!/usr/bin/env python3
"""Synthesize every sound in the 298s long-form video.

Extends the reel's own SFX palette (scripts/gen_audio.py) rather than
rebuilding it - the 12 SFX types the long-form timeline references
(impact-deep/soft, whoosh-low/soft, tick-hard/soft/triple, stepper,
chime-stack, riser-open, sub-drop, transition-sweep) already exist there.
Nothing is sampled or sourced from ElevenLabs or any external service.

Produces, into public/audio/lf/:
  ambient-bed.wav  - continuous 298s texture, never silent
  sfx-cues.wav     - all cues placed on the exact chapter/shot cut frames
  music-bed.wav    - original 298s score following the brief's Section 10
                      direction (clinical setup -> wider pads -> sub-bass climax
                      timed to the SLF chapter), re-derived for this runtime
public/vo/voiceover-longform-sonodyne.wav - silent 298s placeholder

Run:  python3 scripts/gen_audio_lf.py
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, add_at, bp, db, env_exp, env_swell, fit, glide, lp, noise,  # noqa: E402
                 normalize, pan_move, pink, reverb, resonator, saturate, saw,
                 sine, stereo, sweep_bp, write_wav)
from gen_audio import PALETTE, TARGET_PEAK  # noqa: E402 - reuse the reel's SFX palette exactly

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, "public", "audio", "lf")


# =========================================================================
# 1. AMBIENT BED - continuous, subtle, never silent across 298s
# =========================================================================
def build_ambient(total_s):
    n = int(total_s * SR)
    tt = np.arange(n) / SR
    out = np.zeros((n, 2))

    for f, amp, rate, ph in [(55.0, 0.30, 0.021, 0.0),
                             (82.41, 0.17, 0.016, 1.1),
                             (110.0, 0.12, 0.012, 2.3)]:
        det = 1.0 + 0.0016 * np.sin(2 * np.pi * rate * tt + ph)
        v = np.sin(2 * np.pi * np.cumsum(f * det) / SR)
        v *= amp * (0.82 + 0.18 * np.sin(2 * np.pi * 0.009 * tt + ph))
        out[:, 0] += v * 0.98
        out[:, 1] += v * 1.02

    out[:, 0] = lp(out[:, 0], 320)
    out[:, 1] = lp(out[:, 1], 320)

    for ch, seed, rate in ((0, 201, 0.013), (1, 202, 0.017)):
        air = bp(pink(total_s, seed), 2200, 7000)
        air *= 0.085 * (0.55 + 0.45 * np.sin(2 * np.pi * rate * tt + ch))
        out[:, ch] += air

    rng = np.random.default_rng(303)
    n_swells = int(total_s / 6.5)
    for k in range(n_swells):
        at = int((2.0 + k * (total_s - 4.0) / n_swells + rng.uniform(-1.0, 1.0)) * SR)
        d = rng.uniform(2.6, 4.6)
        sw = bp(pink(d, 500 + k), 300, 2600) * env_swell(d, 0.4, 2.4) * 0.06
        add_at(out, sw, at)

    fade = int(1.0 * SR)
    out[:fade] *= np.linspace(0, 1, fade)[:, None]
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return out


# =========================================================================
# 2. MUSIC BED - original score, brief's Section 10 direction stretched to 298s
#    clinical dry setup (350/400) -> wider pads (501/601) -> clean sub-bass
#    climax coinciding with the SLF chapter (frame 4500 = 150.0s)
# =========================================================================
BPM = 112.0
BEAT = 60.0 / BPM
BAR = BEAT * 4  # ~2.14s

PROG = [
    ("Am", [220.00, 261.63, 329.63]),
    ("F",  [174.61, 220.00, 261.63]),
    ("C",  [196.00, 261.63, 329.63]),
    ("G",  [196.00, 246.94, 293.66]),
]
ROOTS = {"Am": 55.00, "F": 43.65, "C": 65.41, "G": 49.00}

SLF_CHAPTER_S = 4500 / 30.0  # 150.0s - the sub-bass climax lands here


def _rimclick(seed):
    d = 0.09
    x = resonator(noise(d, seed), 1750, 26) * env_exp(d, 0.0004, 0.07, 15.0)
    x += hp_(noise(d, seed + 1), 4200) * env_exp(d, 0.0003, 0.05, 24.0) * 0.4
    return normalize(x, 0.55)


def hp_(x, hz):
    from dsp import hp
    return hp(x, hz)


def _hat(seed, closed=True):
    d = 0.07 if closed else 0.20
    x = hp_(noise(d, seed), 7200) * env_exp(d, 0.0003, d * 0.8, 20.0 if closed else 7.0)
    return normalize(x, 0.34 if closed else 0.28)


def _kick(seed):
    d = 0.55
    x = sine(glide(115, 44, d, curve=3.0), d) * env_exp(d, 0.001, d * 0.8, 4.0)
    x = saturate(x, 1.5)
    beater = lp(noise(0.03, seed), 1200) * env_exp(0.03, 0.0005, 0.028, 12.0) * 0.3
    add_at(x, beater, 0)
    return normalize(x, 0.8)


def build_music(total_s):
    n = int(total_s * SR)
    out = np.zeros((n, 2))
    n_bars = int(total_s / BAR)

    perc = np.zeros(n)
    bass = np.zeros(n)
    pad = np.zeros(n)
    sub = np.zeros(n)

    slf_bar = int(SLF_CHAPTER_S / BAR)
    pad_bar = int(slf_bar * 0.42)   # pads widen roughly 501/601 chapter onward
    sub_bar = slf_bar               # sub foundation locks in exactly with SLF

    for b in range(n_bars):
        bar_t = b * BAR
        name, voicing = PROG[b % 4]
        root = ROOTS[name]

        for beat in range(4):
            at = int((bar_t + beat * BEAT) * SR)
            if b >= 2:
                add_at(perc, _hat(1000 + b * 4 + beat), at, 0.5 if beat % 2 == 0 else 0.32)
            if b >= 4 and beat % 4 == 2:
                add_at(perc, _rimclick(2000 + b), at, 0.8)
            if b >= 6:
                add_at(perc, _hat(3000 + b * 4 + beat, closed=True),
                       at + int(BEAT * 0.5 * SR), 0.2)
            if b >= sub_bar and beat % 2 == 0:
                add_at(perc, _kick(4000 + b * 4 + beat), at, 0.85)
            elif pad_bar <= b < sub_bar and beat == 0:
                add_at(perc, _kick(4000 + b * 4 + beat), at, 0.6)

        if b >= pad_bar - 6:
            for beat in (0, 2, 3):
                at = int((bar_t + beat * BEAT) * SR)
                d = BEAT * (1.6 if beat == 0 else 0.7)
                v = saturate(sine(root * 2, d) * 0.7 + saw(root * 2, d) * 0.3, 1.6)
                v *= env_exp(d, 0.006, d * 0.9, 3.2)
                add_at(bass, lp(v, 900), at, 0.55 if beat == 0 else 0.34)

        if b >= pad_bar:
            wide = b >= slf_bar
            d = BAR * 1.02
            ch = np.zeros(int(d * SR))
            notes = voicing + ([voicing[0] * 2, voicing[2] * 2] if wide else [])
            for i, f in enumerate(notes):
                v = (sine(f, d) * 0.55 + saw(f, d) * 0.2 + sine(f * 2.0, d) * 0.12)
                v *= env_swell(d, 0.3, 1.5)
                v *= 1.0 / (1.0 + i * 0.55)
                add_at(ch, v, int(i * 0.012 * SR))
            ch = lp(ch, 2600 if not wide else 4200)
            add_at(pad, ch, int(bar_t * SR), 0.16 if not wide else 0.22)

        if b >= sub_bar:
            d = BAR * 0.94
            f = root if root >= 40 else root * 2
            v = sine(f, d) * env_swell(d, 0.16, 1.2)
            v = saturate(v, 1.2)
            add_at(sub, lp(v, 140), int(bar_t * SR), 0.5)

    tt = np.arange(n) / SR
    perc_g = np.clip((tt - 0.5) / 4.0, 0, 1) * (1 - 0.35 * np.clip((tt - (total_s - 20)) / 12, 0, 1))
    pad_g = np.clip((tt - (pad_bar * BAR - 4)) / 8.0, 0, 1)
    sub_g = np.clip((tt - (sub_bar * BAR)) / 4.0, 0, 1)

    mix = (perc * 0.5 * perc_g + bass * 0.48 + pad * 0.85 * pad_g + sub * 0.9 * sub_g)
    mix = saturate(mix * 1.08, 1.22)

    wet = reverb(mix, 1.6, 0.16, 0.02, seed=177)[:n]
    out[:, 0] = wet * 0.99
    out[:, 1] = np.concatenate([np.zeros(25), wet])[:n] * 1.01

    fade = int(1.4 * SR)
    out[:fade] *= np.linspace(0, 1, fade)[:, None]
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return out


# =========================================================================
# 3. CUE TRACK
# =========================================================================
def build_cues(tl, total_s, bank):
    n = int(total_s * SR)
    out = np.zeros((n, 2))
    fps = tl["fps"]
    placed = 0
    for c in tl["cues"]:
        s = bank[c["sfx"]]
        at = int(round(c["frame"] / fps * SR))
        k = min(len(s), n - at) if at < n else 0
        if k <= 0:
            continue
        out[at:at + k] += s[:k] * c["gain"]
        placed += 1
    return out, placed


def main():
    os.makedirs(AUD, exist_ok=True)
    os.makedirs(os.path.join(ROOT, "public/vo"), exist_ok=True)
    tl = json.load(open(os.path.join(ROOT, "src/lf/timeline-lf.json")))
    total_s = tl["durationInFrames"] / tl["fps"]

    print(f"target duration: {total_s:.3f}s  ({tl['durationInFrames']} frames @ {tl['fps']}fps)")

    print("\n[1/4] SFX palette - reusing scripts/gen_audio.py's synthesized bank")
    bank = {}
    for name, fn in PALETTE.items():
        bank[name] = normalize(fn(), TARGET_PEAK[name])
    used = {c["sfx"] for c in tl["cues"]}
    missing = used - set(bank)
    if missing:
        raise SystemExit(f"FATAL: timeline references undefined SFX: {missing}")
    print(f"   {len(bank)} SFX available, {len(used)} referenced by the timeline, all resolve")

    print("\n[2/4] ambient bed  (target -30 dBFS rms)")
    amb = fit(build_ambient(total_s), int(total_s * SR))
    amb *= 10 ** ((-30.0 - db(amb)) / 20)
    write_wav(os.path.join(AUD, "ambient-bed.wav"), amb)
    print(f"   {len(amb)/SR:.3f}s  peak {np.max(np.abs(amb)):.2f}  rms {db(amb):.1f} dBFS")

    print("\n[3/4] cue track  (target -16 dBFS rms)")
    cues, placed = build_cues(tl, total_s, bank)
    cues *= 10 ** ((-16.0 - db(cues)) / 20)
    peak = np.max(np.abs(cues))
    if peak > 0.99:
        cues *= 0.99 / peak
    write_wav(os.path.join(AUD, "sfx-cues.wav"), cues)
    print(f"   placed {placed}/{len(tl['cues'])} cues  peak {np.max(np.abs(cues)):.2f}  rms {db(cues):.1f} dBFS")

    print("\n[4/4] music bed  (target -20 dBFS rms)")
    mus = fit(build_music(total_s), int(total_s * SR))
    mus *= 10 ** ((-20.0 - db(mus)) / 20)
    peak = np.max(np.abs(mus))
    if peak > 0.95:
        mus *= 0.95 / peak
    write_wav(os.path.join(AUD, "music-bed.wav"), mus)
    print(f"   {len(mus)/SR:.3f}s  peak {np.max(np.abs(mus)):.2f}  rms {db(mus):.1f} dBFS")

    write_wav(os.path.join(ROOT, "public/vo/voiceover-longform-sonodyne.wav"),
              np.zeros((int(total_s * SR), 2)))
    print(f"\nVO placeholder: public/vo/voiceover-longform-sonodyne.wav ({total_s:.3f}s silent)")
    print("done.")


if __name__ == "__main__":
    main()
