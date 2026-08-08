#!/usr/bin/env python3
"""Synthesize every sound in the reel from scratch (Section 9a).

Produces, into public/audio/:
  sfx/<name>.wav   - the individual transition SFX palette (for inspection)
  ambient-bed.wav  - continuous, subtle 88s texture (never silent)
  sfx-cues.wav     - all 67 transition cues placed on the exact cut frames
  music-bed.wav    - 88s original score following the brief's music direction

Cue placement is driven by src/data/timeline.json, the same file the Remotion
scenes read, so audio and picture cannot drift.

Run:  python3 scripts/gen_audio.py
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, add_at, bp, db, env_exp, env_swell, fit, glide, hp, lp,  # noqa: E402
                 noise, normalize, pan_move, pink, reverb, resonator,
                 saturate, saw, sine, stereo, sweep_bp, write_wav)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, "public", "audio")
SFXDIR = os.path.join(AUD, "sfx")


# =========================================================================
# 1. THE SFX PALETTE
#    Each returns a stereo array. Designed to be varied enough that ~67
#    transitions across 88s never feel like the same whoosh repeating.
# =========================================================================
def sfx_impact_deep():
    d = 1.5
    sub = sine(glide(72, 33, d, curve=3.0), d) * env_exp(d, 0.001, d * 0.85, 3.4)
    sub = saturate(sub, 1.8) * 0.95
    body = lp(noise(0.30, 11), 900) * env_exp(0.30, 0.001, 0.28, 7.0) * 0.5
    click = hp(noise(0.05, 12), 3000) * env_exp(0.05, 0.0005, 0.045, 16.0) * 0.35
    x = np.zeros(int(d * SR))
    add_at(x, sub, 0)
    add_at(x, body, 0)
    add_at(x, click, 0)
    x = reverb(x, 1.9, 0.26, 0.014, seed=21)
    return stereo(normalize(x, 0.92), spread=0.008)


def sfx_impact_soft():
    d = 1.0
    sub = sine(glide(96, 52, d, curve=2.6), d) * env_exp(d, 0.001, d * 0.8, 4.2)
    body = lp(pink(0.22, 13), 1400) * env_exp(0.22, 0.001, 0.2, 8.0) * 0.42
    click = resonator(noise(0.04, 14), 1800, 22) * env_exp(0.04, 0.0004, 0.035, 18.0) * 0.3
    x = np.zeros(int(d * SR))
    for s in (sub * 0.8, body, click):
        add_at(x, s, 0)
    x = reverb(x, 1.3, 0.24, 0.01, seed=22)
    return stereo(normalize(x, 0.85), spread=0.006)


def sfx_whoosh_low():
    d = 0.85
    n = pink(d, 31)
    fc = np.concatenate([glide(320, 2100, d * 0.62), glide(2100, 380, d * 0.38)])
    x = sweep_bp(n, fit(fc, int(d * SR)), 0, q=1.5)
    x *= env_swell(d, 0.58, 1.6)
    x = saturate(x * 2.4, 1.6)
    tail = lp(sine(glide(140, 70, 0.5), 0.5), 400) * env_exp(0.5, 0.01, 0.45, 4.0) * 0.3
    add_at(x, tail, int(d * 0.55 * SR))
    x = reverb(x, 1.1, 0.22, 0.008, seed=23)
    return pan_move(normalize(x, 0.9), -0.75, 0.75)


def sfx_whoosh_soft():
    d = 0.55
    n = pink(d, 32)
    fc = np.concatenate([glide(700, 3200, d * 0.6), glide(3200, 900, d * 0.4)])
    x = sweep_bp(n, fit(fc, int(d * SR)), 0, q=2.2) * env_swell(d, 0.5, 1.9)
    x = saturate(x * 2.2, 1.4)
    x = reverb(x, 0.75, 0.2, 0.006, seed=24)
    return pan_move(normalize(x, 0.72), 0.55, -0.55)


def _tick(freq, dur, bright, seed, amp):
    body = resonator(noise(dur, seed), freq, 30.0)
    body *= env_exp(dur, 0.0004, dur * 0.8, 14.0)
    air = hp(noise(dur * 0.4, seed + 1), bright)
    air *= env_exp(dur * 0.4, 0.0002, dur * 0.35, 22.0) * 0.45
    x = np.zeros(int(dur * SR))
    add_at(x, body, 0)
    add_at(x, air, 0)
    return normalize(x, amp)


def sfx_tick_hard():
    x = _tick(2350, 0.16, 5200, 41, 0.9)
    x = reverb(x, 0.5, 0.17, 0.004, seed=25)
    return stereo(x, spread=0.003)


def sfx_tick_soft():
    x = _tick(1250, 0.20, 3400, 43, 0.62)
    x = reverb(x, 0.6, 0.2, 0.005, seed=26)
    return stereo(x, spread=0.004)


def sfx_tick_triple():
    d = 0.42
    x = np.zeros(int(d * SR))
    for i, (f, g) in enumerate([(1500, 0.75), (1900, 0.85), (2400, 1.0)]):
        add_at(x, _tick(f, 0.16, 4200, 45 + i, 0.8), int(i * 0.055 * SR), g)
    x = reverb(x, 0.7, 0.2, 0.005, seed=27)
    return stereo(normalize(x, 0.85), spread=0.005)


def sfx_stepper():
    """Mechanical detent - matches the 0.75dB EQ steps / phase dial visuals."""
    d = 0.55
    x = np.zeros(int(d * SR))
    for i in range(6):
        add_at(x, _tick(2900 + i * 190, 0.07, 6500, 51 + i, 0.6),
               int(i * 0.062 * SR), 0.55 + i * 0.07)
    x = reverb(x, 0.45, 0.15, 0.003, seed=28)
    return stereo(normalize(x, 0.78), spread=0.004)


def sfx_chime_stack():
    """FM bell stack on a just-intonation partial series - the 'premium' cue."""
    d = 2.2
    x = np.zeros(int(d * SR))
    for i, (f, dec, amp) in enumerate([(660, 2.0, 1.0), (880, 1.7, 0.7),
                                       (1100, 1.4, 0.5), (1320, 1.15, 0.36)]):
        mod = sine(f * 2.01, dec) * np.exp(-np.linspace(0, 5, int(dec * SR))) * 2.6
        car = np.sin(2 * np.pi * f * (np.arange(int(dec * SR)) / SR) + mod)
        car *= env_exp(dec, 0.003, dec * 0.95, 3.6) * amp
        add_at(x, car, int(i * 0.045 * SR))
    x = lp(x, 9000)
    x = reverb(x, 2.4, 0.34, 0.018, seed=29)
    return stereo(normalize(x, 0.7), spread=0.012)


def sfx_riser_open():
    d = 1.25
    n = int(d * SR)
    f = glide(180, 2600, d, curve=1.6)
    sw = (saw(f, d) * 0.35 + sine(f, d) * 0.3)
    nz = sweep_bp(pink(d, 61), glide(600, 7000, d), 0, q=1.2) * 0.6
    x = fit(sw, n) + fit(nz, n)
    x *= np.linspace(0, 1, n) ** 1.8
    x = saturate(x * 1.8, 1.5)
    tail = sine(glide(120, 60, 0.6), 0.6) * env_exp(0.6, 0.002, 0.55, 3.5) * 0.5
    x = np.concatenate([x, np.zeros(int(0.6 * SR))])
    add_at(x, tail, n)
    x = reverb(x, 1.5, 0.25, 0.01, seed=30)
    return stereo(normalize(x, 0.82), spread=0.01)


def sfx_sub_drop():
    """Reserved for the SLF 210 V3 beats - clean, controlled 35-50Hz energy."""
    d = 2.4
    sub = sine(glide(88, 36, d, curve=3.2), d) * env_exp(d, 0.004, d * 0.9, 2.6)
    sub = saturate(sub, 1.35)
    h2 = sine(glide(176, 72, d, curve=3.2), d) * env_exp(d, 0.004, d * 0.6, 4.5) * 0.18
    knock = lp(noise(0.12, 71), 600) * env_exp(0.12, 0.001, 0.11, 9.0) * 0.4
    x = np.zeros(int(d * SR))
    for s in (sub, h2, knock):
        add_at(x, s, 0)
    x = reverb(x, 2.0, 0.18, 0.012, seed=31)
    return stereo(normalize(x, 0.95), spread=0.006)


def sfx_air_swell():
    """Very soft texture marking an ambient-band image swap.

    Peaks early (and carries a faint leading breath) so the swap is actually
    perceptible at the cut rather than arriving a beat late.
    """
    d = 1.4
    x = bp(pink(d, 81), 900, 5200) * env_swell(d, 0.22, 1.4) * 0.5
    breath = hp(noise(0.09, 83), 4000) * env_exp(0.09, 0.001, 0.08, 12.0) * 0.22
    add_at(x, breath, 0)
    x = reverb(x, 1.4, 0.3, 0.01, seed=32)
    return pan_move(normalize(x, 0.4), -0.4, 0.4)


def sfx_transition_sweep():
    """Scene boundary - reverse swell into a broadband sweep."""
    d = 1.6
    n = int(d * SR)
    rev = bp(pink(0.7, 91), 400, 4000) * (np.linspace(0, 1, int(0.7 * SR)) ** 2.4)
    fwd = sweep_bp(pink(0.9, 92), glide(3600, 420, 0.9), 0, q=1.3)
    fwd *= env_exp(0.9, 0.004, 0.85, 3.2)
    x = np.zeros(n)
    add_at(x, rev, 0, 0.55)
    add_at(x, fwd, int(0.66 * SR), 0.9)
    body = sine(glide(150, 62, 0.7), 0.7) * env_exp(0.7, 0.003, 0.65, 3.0) * 0.4
    add_at(x, body, int(0.66 * SR))
    x = saturate(x * 1.5, 1.4)
    x = reverb(x, 1.6, 0.26, 0.012, seed=33)
    return pan_move(normalize(x, 0.86), 0.6, -0.6)


# Final stereo peak per cue. Section 9a asks for SFX that sit clearly forward in
# the mix (the user balances against the real VO in post), so these are hot on
# purpose - the relative shape between cues is what matters here.
TARGET_PEAK = {
    "impact-deep": 0.95, "impact-soft": 0.72, "whoosh-low": 0.80,
    "whoosh-soft": 0.62, "tick-hard": 0.70, "tick-soft": 0.50,
    "tick-triple": 0.66, "stepper": 0.58, "chime-stack": 0.72,
    "riser-open": 0.85, "sub-drop": 0.95, "air-swell": 0.34,
    "transition-sweep": 0.88,
}

PALETTE = {
    "impact-deep": sfx_impact_deep,
    "impact-soft": sfx_impact_soft,
    "whoosh-low": sfx_whoosh_low,
    "whoosh-soft": sfx_whoosh_soft,
    "tick-hard": sfx_tick_hard,
    "tick-soft": sfx_tick_soft,
    "tick-triple": sfx_tick_triple,
    "stepper": sfx_stepper,
    "chime-stack": sfx_chime_stack,
    "riser-open": sfx_riser_open,
    "sub-drop": sfx_sub_drop,
    "air-swell": sfx_air_swell,
    "transition-sweep": sfx_transition_sweep,
}


# =========================================================================
# 2. AMBIENT BED - continuous, subtle, never silent (Section 9a)
# =========================================================================
def build_ambient(total_s):
    n = int(total_s * SR)
    tt = np.arange(n) / SR
    out = np.zeros((n, 2))

    # slow-detuned low drone (A1 / E2 / A2)
    for f, amp, rate, ph in [(55.0, 0.30, 0.031, 0.0),
                             (82.41, 0.17, 0.023, 1.1),
                             (110.0, 0.12, 0.017, 2.3)]:
        det = 1.0 + 0.0016 * np.sin(2 * np.pi * rate * tt + ph)
        v = np.sin(2 * np.pi * np.cumsum(f * det) / SR)
        v *= amp * (0.82 + 0.18 * np.sin(2 * np.pi * 0.013 * tt + ph))
        out[:, 0] += v * 0.98
        out[:, 1] += v * 1.02

    out[:, 0] = lp(out[:, 0], 320)
    out[:, 1] = lp(out[:, 1], 320)

    # high 'air' shimmer, barely there
    for ch, seed, rate in ((0, 101, 0.019), (1, 102, 0.024)):
        air = bp(pink(total_s, seed), 2200, 7000)
        air *= 0.085 * (0.55 + 0.45 * np.sin(2 * np.pi * rate * tt + ch))
        out[:, ch] += air

    # sparse room-tone swells so the bed breathes
    rng = np.random.default_rng(303)
    for k in range(14):
        at = int((1.5 + k * (total_s - 3.0) / 14 + rng.uniform(-0.6, 0.6)) * SR)
        d = rng.uniform(2.4, 4.2)
        sw = bp(pink(d, 400 + k), 300, 2600) * env_swell(d, 0.4, 2.4) * 0.06
        add_at(out, sw, at)

    # gentle top and tail
    fade = int(0.9 * SR)
    out[:fade] *= np.linspace(0, 1, fade)[:, None]
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return out


# =========================================================================
# 3. MUSIC BED - original score, follows the brief's Section 10 direction:
#    clinical/dry setup -> widening pads -> clean sub-bass foundation
# =========================================================================
BPM = 120.0
BEAT = 60.0 / BPM          # 0.5s
BAR = BEAT * 4             # 2.0s  -> 44 bars in 88s

# A minor: i - VI - III - VII, one chord per bar
PROG = [
    ("Am", [220.00, 261.63, 329.63]),
    ("F",  [174.61, 220.00, 261.63]),
    ("C",  [196.00, 261.63, 329.63]),
    ("G",  [196.00, 246.94, 293.66]),
]
ROOTS = {"Am": 55.00, "F": 43.65, "C": 65.41, "G": 49.00}


def _rimclick(seed):
    d = 0.09
    x = resonator(noise(d, seed), 1750, 26) * env_exp(d, 0.0004, 0.07, 15.0)
    x += hp(noise(d, seed + 1), 4200) * env_exp(d, 0.0003, 0.05, 24.0) * 0.4
    return normalize(x, 0.55)


def _hat(seed, closed=True):
    d = 0.07 if closed else 0.20
    x = hp(noise(d, seed), 7200) * env_exp(d, 0.0003, d * 0.8, 20.0 if closed else 7.0)
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

    for b in range(n_bars):
        bar_t = b * BAR
        name, voicing = PROG[b % 4]
        root = ROOTS[name]

        # --- percussion: dry and tight from the top (brief: transient clarity)
        for beat in range(4):
            at = int((bar_t + beat * BEAT) * SR)
            if b >= 1:
                add_at(perc, _hat(1000 + b * 4 + beat), at,
                       0.5 if beat % 2 == 0 else 0.32)
            if b >= 2 and beat % 4 == 2:
                add_at(perc, _rimclick(2000 + b), at, 0.8)
            if b >= 3:
                add_at(perc, _hat(3000 + b * 4 + beat, closed=True),
                       at + int(BEAT * 0.5 * SR), 0.2)
            if b >= 12 and beat % 2 == 0:
                add_at(perc, _kick(4000 + b * 4 + beat), at, 0.85)
            elif 6 <= b < 12 and beat == 0:
                add_at(perc, _kick(4000 + b * 4 + beat), at, 0.6)

        # --- bass pulse from bar 6
        if b >= 6:
            for beat in (0, 2, 3):
                at = int((bar_t + beat * BEAT) * SR)
                d = BEAT * (1.6 if beat == 0 else 0.7)
                v = saturate(sine(root * 2, d) * 0.7 + saw(root * 2, d) * 0.3, 1.6)
                v *= env_exp(d, 0.006, d * 0.9, 3.2)
                add_at(bass, lp(v, 900), at, 0.55 if beat == 0 else 0.34)

        # --- pads from bar 10, widening at bar 22 (brief: 'The Expansion')
        if b >= 10:
            wide = b >= 22
            d = BAR * 1.02
            ch = np.zeros(int(d * SR))
            notes = voicing + ([voicing[0] * 2, voicing[2] * 2] if wide else [])
            for i, f in enumerate(notes):
                v = (sine(f, d) * 0.55 + saw(f, d) * 0.2 +
                     sine(f * 2.0, d) * 0.12)
                v *= env_swell(d, 0.3, 1.5)
                v *= 1.0 / (1.0 + i * 0.55)
                add_at(ch, v, int(i * 0.012 * SR))
            ch = lp(ch, 2600 if not wide else 4200)
            add_at(pad, ch, int(bar_t * SR), 0.16 if not wide else 0.22)

        # --- sub foundation from bar 31 (~62s: the SLF 210 V3 beat)
        if b >= 31:
            d = BAR * 0.94
            f = root if root >= 40 else root * 2
            v = sine(f, d) * env_swell(d, 0.16, 1.2)
            v = saturate(v, 1.2)
            add_at(sub, lp(v, 140), int(bar_t * SR), 0.5)

    # arrangement envelopes
    tt = np.arange(n) / SR
    perc_g = np.clip((tt - 0.5) / 4.0, 0, 1) * (1 - 0.45 * np.clip((tt - 78) / 10, 0, 1))
    pad_g = np.clip((tt - 18) / 6.0, 0, 1)
    sub_g = np.clip((tt - 60) / 3.0, 0, 1)

    mix = (perc * 0.52 * perc_g + bass * 0.5 + pad * 0.85 * pad_g + sub * 0.9 * sub_g)
    mix = saturate(mix * 1.1, 1.25)

    wet = reverb(mix, 1.5, 0.17, 0.02, seed=77)[:n]
    out[:, 0] = wet * 0.99
    out[:, 1] = np.concatenate([np.zeros(23), wet])[:n] * 1.01  # micro Haas width

    fade = int(1.2 * SR)
    out[:fade] *= np.linspace(0, 1, fade)[:, None]
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return out


# =========================================================================
# 4. CUE TRACK - place every SFX on its exact cut frame
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


# =========================================================================
def main():
    os.makedirs(SFXDIR, exist_ok=True)
    tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))
    total_s = tl["durationInFrames"] / tl["fps"]

    print(f"target duration: {total_s:.3f}s  ({tl['durationInFrames']} frames @ {tl['fps']}fps)")

    print("\n[1/4] synthesizing SFX palette")
    bank = {}
    for name, fn in PALETTE.items():
        s = normalize(fn(), TARGET_PEAK[name])
        bank[name] = s
        p = os.path.join(SFXDIR, f"{name}.wav")
        write_wav(p, s)
        print(f"   {name:18} {len(s) / SR:5.2f}s  peak {np.max(np.abs(s)):.2f}  "
              f"rms {db(s):6.1f} dBFS  -> {os.path.relpath(p, ROOT)}")

    print("\n[2/4] ambient bed  (target -30 dBFS rms: present but subtle)")
    amb = fit(build_ambient(total_s), int(total_s * SR))
    amb *= 10 ** ((-30.0 - db(amb)) / 20)
    write_wav(os.path.join(AUD, "ambient-bed.wav"), amb)
    print(f"   {len(amb) / SR:.3f}s  peak {np.max(np.abs(amb)):.2f}  rms {db(amb):.1f} dBFS")

    print("\n[3/4] cue track  (target -16 dBFS rms: forward in the mix)")
    cues, placed = build_cues(tl, total_s, bank)
    cues *= 10 ** ((-16.0 - db(cues)) / 20)
    peak = np.max(np.abs(cues))
    if peak > 0.99:
        cues *= 0.99 / peak
    write_wav(os.path.join(AUD, "sfx-cues.wav"), cues)
    print(f"   placed {placed}/{len(tl['cues'])} cues  peak {np.max(np.abs(cues)):.2f}  "
          f"rms {db(cues):.1f} dBFS")

    print("\n[4/4] music bed  (target -20 dBFS rms: under the voiceover)")
    mus = fit(build_music(total_s), int(total_s * SR))
    mus *= 10 ** ((-20.0 - db(mus)) / 20)
    peak = np.max(np.abs(mus))
    if peak > 0.95:
        mus *= 0.95 / peak
    write_wav(os.path.join(AUD, "music-bed.wav"), mus)
    print(f"   {len(mus) / SR:.3f}s  peak {np.max(np.abs(mus)):.2f}  rms {db(mus):.1f} dBFS")

    # silent VO placeholder, exactly the runtime
    write_wav(os.path.join(ROOT, "public/vo/voiceover-reel-sonodyne.wav"),
              np.zeros((int(total_s * SR), 2)))
    print(f"\nVO placeholder: public/vo/voiceover-reel-sonodyne.wav ({total_s:.3f}s silent)")
    print("done.")


if __name__ == "__main__":
    main()
