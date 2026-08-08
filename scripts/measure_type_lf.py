#!/usr/bin/env python3
"""Emit real BarlowCondensed advance widths -> src/lf/bc-metrics.json.

Same rationale as scripts/measure_type.py for the reel: display lines are set
`white-space: nowrap`, so a headline one character too long silently runs past
the text column. This instantiates the actual static font at 800 weight (the
only weight used for headlines) and reads real horizontal metrics.
"""
import json
import os

from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = "public/fonts-lf/bc-800.woff2"


def main():
    f = TTFont(os.path.join(ROOT, SRC))
    upem = f["head"].unitsPerEm
    cmap = f.getBestCmap()
    hmtx = f["hmtx"]
    advances = {}
    for code, name in cmap.items():
        if code < 32 or code > 0x2FFF:
            continue
        ch = chr(code)
        if name in hmtx.metrics:
            advances[ch] = hmtx.metrics[name][0]

    out = {"unitsPerEm": upem, "default": int(sum(advances.values()) / len(advances)),
           "advances": advances}
    p = os.path.join(ROOT, "src/lf/bc-metrics.json")
    with open(p, "w") as fh:
        json.dump(out, fh, separators=(",", ":"), sort_keys=True)
    print(f"wrote {p}  ({len(advances)} glyphs, upem {upem})")

    def w(s, size, tracking=0.0):
        u = sum(advances.get(c, out["default"]) for c in s) / upem
        return (u + tracking * max(0, len(s) - 1)) * size

    for s, size in [("YOUR MIX SOUNDS", 92), ("PRESSURE DIE-CAST ALUMINIUM", 68),
                    ("THEN THE CAR TEST", 92), ("HEADROOM, UNCOMPRESSED.", 92)]:
        print(f"   {s!r:32} @{size:4d}px -> {w(s, size):6.1f}px")


if __name__ == "__main__":
    main()
