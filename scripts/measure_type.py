#!/usr/bin/env python3
"""Emit real Archivo advance widths -> src/data/archivo-metrics.json.

Display lines are set with `white-space: nowrap`, so a headline that is one
character too long silently runs past the side margin and lands in the
forbidden zone. Guessing an average character width is not good enough - this
instantiates the actual variable font at the display instance (wght 800,
wdth 118) and reads the real horizontal metrics, which the Headline component
then uses to shrink any line that would not fit.
"""
import json
import os

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# the two subsets that between them cover every character used on screen
SRC = [
    "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2",
    "node_modules/@fontsource-variable/archivo/files/archivo-latin-ext-wdth-normal.woff2",
]

# matches theme.ts: T.headline.fontWeight 800, WIDTH.expanded 118%
INSTANCE = {"wght": 800, "wdth": 118}


def main():
    advances = {}
    upem = None
    for rel in SRC:
        f = TTFont(os.path.join(ROOT, rel))
        f = instantiateVariableFont(f, INSTANCE, inplace=True, updateFontNames=False)
        upem = f["head"].unitsPerEm
        cmap = f.getBestCmap()
        hmtx = f["hmtx"]
        for code, name in cmap.items():
            if code < 32 or code > 0x2FFF:
                continue
            ch = chr(code)
            if name in hmtx.metrics and ch not in advances:
                advances[ch] = hmtx.metrics[name][0]

    out = {
        "unitsPerEm": upem,
        "instance": INSTANCE,
        # fallback for anything not in the table
        "default": int(sum(advances.values()) / len(advances)),
        "advances": advances,
    }
    p = os.path.join(ROOT, "src/data/archivo-metrics.json")
    with open(p, "w") as fh:
        json.dump(out, fh, separators=(",", ":"), sort_keys=True)

    # sanity: the widest headline currently in the deck
    def w(s, size, tracking=-0.03):
        u = sum(advances.get(c, out["default"]) for c in s) / upem
        return (u + tracking * max(0, len(s) - 1)) * size

    print(f"wrote {p}  ({len(advances)} glyphs, upem {upem})")
    for s, size in [("IN YOUR ROOM.", 104), ("BEST PRICE.", 80),
                    ("THE TRANSLATION", 72), ("UNCOMPRESSED,", 72),
                    ("BELOW 80Hz", 63.4), ("PERFECT.", 104)]:
        print(f"   {s!r:20} @{size:5.1f}px -> {w(s, size):6.1f}px "
              f"{'OVERFLOWS 920' if w(s, size) > 920 else 'fits'}")


if __name__ == "__main__":
    main()
