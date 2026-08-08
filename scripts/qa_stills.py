#!/usr/bin/env python3
"""Checkpoint 3/4: render stills and check them against the layout rules.

The checks are pixel-level and mechanical, so they catch what eyeballing misses:

  1. NO CRITICAL CONTENT in the ambient bands (y<250, y>=1580) or the side
     margins (x<80, x>=1000). Ink is #101317 and every band image is blurred and
     lifted well above mid-grey, so any pixel darker than LUMA_INK in a forbidden
     region can only be text, a rule, a logo or a hard-edged graphic.
  2. THE BACKGROUND STAYS LIGHT - the frame's mean luminance must stay high, and
     the top/bottom bands specifically must stay light rather than going dark.
  3. THE BANDS ARE NOT EMPTY (Section 2b) - each band must carry some tonal
     variation rather than being flat paper.

Usage:
  python3 scripts/qa_stills.py                # render the standard sweep
  python3 scripts/qa_stills.py 700 1300 2400  # specific frames
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QA = os.path.join(ROOT, "qa")

TOP, BOTTOM, SIDE = 250, 1580, 80
LUMA_INK = 95      # anything darker than this reads as deliberate ink
MIN_MEAN_LUMA = 150  # the page must stay light overall
MIN_BAND_LUMA = 140  # bands must not go dark
MIN_BAND_STD = 1.2   # bands must not be flat empty paper


def luma(a):
    return 0.2126 * a[:, :, 0] + 0.7152 * a[:, :, 1] + 0.0722 * a[:, :, 2]


def render(frame, comp="SonodyneReel"):
    out = os.path.join(QA, f"f{frame:04d}.png")
    r = subprocess.run(
        ["npx", "remotion", "still", comp, out, f"--frame={frame}", "--log=error"],
        cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout[-2000:], r.stderr[-2000:])
        raise SystemExit(f"still render failed at frame {frame}")
    return out


def check(path, frame):
    a = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    L = luma(a)
    problems = []

    regions = {
        "TOP band": L[:TOP, :],
        "BOTTOM band": L[BOTTOM:, :],
        "LEFT margin": L[:, :SIDE],
        "RIGHT margin": L[:, -SIDE:],
    }
    for name, reg in regions.items():
        ink = int((reg < LUMA_INK).sum())
        if ink > 0:
            ys, xs = np.where(reg < LUMA_INK)
            problems.append(
                f"{name}: {ink} ink px (darkest {reg.min():.0f}) "
                f"first at row {ys.min()} col {xs.min()}")

    if L.mean() < MIN_MEAN_LUMA:
        problems.append(f"frame mean luma {L.mean():.0f} < {MIN_MEAN_LUMA} (background not light)")

    for name in ("TOP band", "BOTTOM band"):
        reg = regions[name]
        if reg.mean() < MIN_BAND_LUMA:
            problems.append(f"{name} mean luma {reg.mean():.0f} < {MIN_BAND_LUMA} (band went dark)")
        if reg.std() < MIN_BAND_STD:
            problems.append(f"{name} std {reg.std():.2f} < {MIN_BAND_STD} (band is empty)")

    stats = (f"mean {L.mean():5.1f} | top {regions['TOP band'].mean():5.1f}"
             f"/sd {regions['TOP band'].std():4.1f} | bot {regions['BOTTOM band'].mean():5.1f}"
             f"/sd {regions['BOTTOM band'].std():4.1f}")
    return problems, stats


def main():
    os.makedirs(QA, exist_ok=True)
    tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))

    if len(sys.argv) > 1:
        frames = [int(x) for x in sys.argv[1:]]
    else:
        # one still inside every shot, plus the two bespoke scenes
        frames = []
        for sc in tl["scenes"]:
            if sc["shots"]:
                for sh in sc["shots"]:
                    frames.append(sh["from"] + max(6, sh["dur"] // 2))
            else:
                frames.append(sc["from"] + sc["dur"] // 2)
                frames.append(sc["from"] + sc["dur"] - 8)
        frames = sorted(set(frames))

    print(f"checking {len(frames)} stills\n")
    bad = {}
    for f in frames:
        p = render(f)
        probs, stats = check(p, f)
        flag = "FAIL" if probs else "ok  "
        print(f"  {flag} f{f:5d}  {stats}")
        for pr in probs:
            print(f"        - {pr}")
        if probs:
            bad[f] = probs

    print()
    if bad:
        print(f"FAILED - {len(bad)}/{len(frames)} stills violate the layout rules: {sorted(bad)}")
        return 1
    print(f"PASS - all {len(frames)} stills clear the safe zones and stay light.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
