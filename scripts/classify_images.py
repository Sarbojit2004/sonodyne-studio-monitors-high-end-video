#!/usr/bin/env python3
"""Classify each image's background tone -> src/data/bg-class.json.

The reel's presentation mode depends on this: pure-white studio pack shots sit
directly on a white card (they blend into the light ground), while dark studio
and lifestyle frames are always framed as inset panels so the page background
never goes dark (Section 2).
"""
import glob, json, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = {}
for p in sorted(glob.glob(os.path.join(ROOT, "public/img/*.webp"))):
    slug = os.path.basename(p).replace(".webp", "")
    a = np.asarray(Image.open(p).convert("RGB").resize((64, 64)))
    c = np.concatenate([a[0:6, 0:6].reshape(-1, 3), a[0:6, -6:].reshape(-1, 3),
                        a[-6:, 0:6].reshape(-1, 3), a[-6:, -6:].reshape(-1, 3)])
    m, s = float(c.mean()), float(c.std(axis=0).mean())
    out[slug] = "white" if (m > 250 and s < 1) else ("grey" if m > 110 else "dark")

with open(os.path.join(ROOT, "src/data/bg-class.json"), "w") as fh:
    json.dump(out, fh, indent=1, sort_keys=True)
from collections import Counter
print("wrote src/data/bg-class.json:", dict(Counter(out.values())), f"({len(out)} images)")
