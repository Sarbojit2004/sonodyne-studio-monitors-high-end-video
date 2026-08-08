#!/usr/bin/env python3
"""Checkpoint 5 (long-form): prove every enumerated image is placed exactly once
as primary content, with none missing and none double-booked across chapters.
"""
import glob
import json
import os
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGOS = {"SONODYNE BRAND LOGO.png", "SHIVANSH ELECTRONICS BRAND LOGO.png"}


def main():
    repo_imgs = []
    for f in sorted(glob.glob(os.path.join(ROOT, "*.webp")) + glob.glob(os.path.join(ROOT, "*.png"))):
        if os.path.basename(f) in LOGOS:
            continue
        repo_imgs.append(os.path.basename(f))

    amap = json.load(open(os.path.join(ROOT, "src/data/asset-map.json")))
    required = {amap[b].replace(".webp", "") for b in repo_imgs}

    tl = json.load(open(os.path.join(ROOT, "src/lf/timeline-lf.json")))
    primary = Counter(tl["coverage"]["primary"])

    print(f"repo images (non-logo)  : {len(required)}")
    print(f"referenced as primary   : {len(primary)}")

    ok = True
    dupes = {k: c for k, c in primary.items() if c > 1}
    if dupes:
        ok = False
        print(f"\nFAIL - placed as primary MORE THAN ONCE ({len(dupes)}):")
        for k, c in dupes.items():
            print(f"    {k} x{c}")

    missing = required - set(primary)
    if missing:
        ok = False
        print(f"\nFAIL - enumerated but never placed ({len(missing)}):")
        for m in sorted(missing):
            print("   ", m)

    ghosts = set(primary) - required
    if ghosts:
        ok = False
        print(f"\nFAIL - references an image that does not exist ({len(ghosts)}):")
        for m in sorted(ghosts):
            print("   ", m)

    print("\nper-product placement:")
    fams = [("SRP 350 G", "srp-350"), ("SRP 400 G", "srp-400"),
            ("SRP 501 G", "srp-501"), ("SRP 601 G", "srp-601"),
            ("SLF 210 V3", "slf-210"), ("generic", "studio-monitor")]
    for label, pref in fams:
        req = {r for r in required if r.startswith(pref)}
        placed = req & set(primary)
        flag = "OK " if req == placed else "GAP"
        print(f"  {flag} {label:12} total {len(req):3}  placed {len(placed):3}")

    tot = tl["durationInFrames"]
    acc = sum(c["dur"] for c in tl["chapters"])
    print(f"\nduration: {tot} frames ({tot/tl['fps']:.3f}s); chapters sum to {acc}")
    if acc != tot:
        ok = False
        print("FAIL - chapter durations do not sum to the composition length")

    for ch in tl["chapters"]:
        if not ch["shots"]:
            continue
        last = ch["shots"][-1]
        if last["from"] + last["dur"] != ch["from"] + ch["dur"]:
            ok = False
            print(f"FAIL - {ch['id']} shots do not fill the chapter")

    print("\n" + ("PASS - every enumerated image placed exactly once." if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
