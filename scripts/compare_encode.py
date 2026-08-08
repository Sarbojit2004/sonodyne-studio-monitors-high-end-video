#!/usr/bin/env python3
"""Confirm the bt709 / PNG re-encode did not shift the light palette.

Decodes the same frames from the delivered MP4 and compares them against the
reference stills rendered straight from the composition.
"""
import glob, os, subprocess, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MP4 = os.path.join(ROOT, "out", "sonodyne-reel-88s.mp4")
FRAMES = [700, 1400, 2500]

os.makedirs("/tmp/cmp", exist_ok=True)
ok = True
for f in FRAMES:
    ref = os.path.join(ROOT, "qa", f"f{f:04d}.png")
    if not os.path.exists(ref):
        print(f"  skip f{f} (no reference still)")
        continue
    out = f"/tmp/cmp/{f}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", MP4,
                    "-vf", f"select=eq(n\\,{f})", "-vsync", "0", "-frames:v", "1", out],
                   check=True)
    a = np.asarray(Image.open(ref).convert("RGB")).astype(np.float32)
    b = np.asarray(Image.open(out).convert("RGB")).astype(np.float32)
    d = np.abs(a - b)
    # paper ground sample, well inside a flat background region
    pa, pb = a[1350:1380, 900:960].mean(axis=(0, 1)), b[1350:1380, 900:960].mean(axis=(0, 1))
    print(f"  f{f:5d}  mean|delta| {d.mean():5.2f}  p99 {np.percentile(d, 99):5.1f}  "
          f"paper ref {tuple(int(x) for x in pa)} -> enc {tuple(int(x) for x in pb)}")
    if d.mean() > 4.0 or np.abs(pa - pb).max() > 5:
        ok = False
        print("     FAIL - visible shift against the reference still")

print("\n" + ("PASS - encode matches the composition." if ok else "FAILED"))
sys.exit(0 if ok else 1)
