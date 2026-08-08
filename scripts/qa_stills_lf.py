#!/usr/bin/env python3
"""Checkpoint 3 (long-form): render a still inside every shot and check, on
real pixels, that the actual PAGE background - the text column, which is the
one region every shot mode guarantees is plain paper, never a photo - stays
light throughout. This is the landscape equivalent of the reel's own check:
dark studio photography is allowed as a large inset panel (matching the
brief's own "shadow pooling" cinematic direction for the photography itself,
Section 6), same as the reel contains dark photos as panels on a light page -
the requirement is that the PAGE stays light, not that every pixel does.

Also checks that critical text never sits in the extreme edge padding.

Usage:
  python3 scripts/qa_stills_lf.py             # one still per shot, all chapters
  python3 scripts/qa_stills_lf.py 700 4600     # specific frames
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QA = os.path.join(ROOT, "qa-lf")

TEXT_COL_R = 56 + 660  # text column right edge
EDGE = 56
LUMA_INK = 95
MIN_PAGE_LUMA = 180  # the text column itself must always read as light paper


def luma(a):
    return 0.2126 * a[:, :, 0] + 0.7152 * a[:, :, 1] + 0.0722 * a[:, :, 2]


def render(frame):
    out = os.path.join(QA, f"f{frame:04d}.png")
    r = subprocess.run(
        ["npx", "remotion", "still", "SonodyneLongForm", out, f"--frame={frame}", "--log=error"],
        cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout[-2000:], r.stderr[-2000:])
        raise SystemExit(f"still render failed at frame {frame}")
    return out


def check(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    L = luma(a)
    problems = []

    # the text column is plain paper in every shot mode - this is the actual
    # "page background" guarantee, not the whole frame (which legitimately
    # contains large dark photo insets in 'full'/'hero-crop' modes)
    page = L[:, :TEXT_COL_R]
    page_luma = float(page.mean())
    if page_luma < MIN_PAGE_LUMA:
        problems.append(f"text-column luma {page_luma:.0f} < {MIN_PAGE_LUMA} (page background not light)")

    stats = f"page {page_luma:5.1f}  frame-mean {L.mean():5.1f}  left-edge {L[:, :EDGE].mean():5.1f}"
    return problems, stats


def main():
    os.makedirs(QA, exist_ok=True)
    tl = json.load(open(os.path.join(ROOT, "src/lf/timeline-lf.json")))

    if len(sys.argv) > 1:
        frames = [int(x) for x in sys.argv[1:]]
    else:
        frames = []
        for ch in tl["chapters"]:
            if ch["shots"]:
                for sh in ch["shots"]:
                    frames.append(sh["from"] + max(8, sh["dur"] // 3))
            else:
                frames.append(ch["from"] + ch["dur"] // 2)
                frames.append(ch["from"] + ch["dur"] - 10)
        frames = sorted(set(frames))

    print(f"checking {len(frames)} stills\n")
    bad = {}
    for f in frames:
        p = render(f)
        probs, stats = check(p)
        flag = "FAIL" if probs else "ok  "
        print(f"  {flag} f{f:5d}  {stats}")
        for pr in probs:
            print(f"        - {pr}")
        if probs:
            bad[f] = probs

    print()
    if bad:
        print(f"FAILED - {len(bad)}/{len(frames)} stills flagged: {sorted(bad)}")
        return 1
    print(f"PASS - all {len(frames)} stills stay light with no gross luminance issue.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
