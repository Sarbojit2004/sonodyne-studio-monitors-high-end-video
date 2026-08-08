#!/usr/bin/env python3
"""Checkpoint 5: prove every enumerated image is placed somewhere in the reel.

Compares the compulsory-coverage set (every non-logo image in the repo) against
the image slugs referenced by src/data/timeline.json. Exits non-zero on any gap
so it can gate the render.
"""
import glob
import json
import os
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOGOS = {"SONODYNE BRAND LOGO.png", "SHIVANSH ELECTRONICS BRAND LOGO.png"}


def main():
    # 1. the compulsory set: every image in the repo root that is not a logo
    repo_imgs = []
    for f in sorted(glob.glob(os.path.join(ROOT, "*.webp")) +
                    glob.glob(os.path.join(ROOT, "*.png"))):
        if os.path.basename(f) in LOGOS:
            continue
        repo_imgs.append(os.path.basename(f))

    amap = json.load(open(os.path.join(ROOT, "src/data/asset-map.json")))
    required = {amap[b].replace(".webp", "") for b in repo_imgs}

    # 2. what public/img actually holds
    on_disk = {os.path.basename(p).replace(".webp", "")
               for p in glob.glob(os.path.join(ROOT, "public/img/*.webp"))}

    # 3. what the timeline references
    tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))
    primary = Counter(tl["coverage"]["primary"])
    ambient = Counter(tl["coverage"]["ambient"])
    placed = set(primary) | set(ambient)

    print(f"repo images (non-logo)   : {len(required)}")
    print(f"copied into public/img   : {len(on_disk)}")
    print(f"referenced in timeline   : {len(placed)}")
    print(f"  primary/hero tier      : {len(set(primary))}")
    print(f"  ambient band tier      : {len(set(ambient))}")

    ok = True

    missing_disk = required - on_disk
    if missing_disk:
        ok = False
        print(f"\nFAIL - in repo but not copied to public/img ({len(missing_disk)}):")
        for m in sorted(missing_disk):
            print("   ", m)

    unplaced = required - placed
    if unplaced:
        ok = False
        print(f"\nFAIL - enumerated but NOT placed in any beat ({len(unplaced)}):")
        for m in sorted(unplaced):
            print("   ", m)

    ghosts = placed - required
    if ghosts:
        ok = False
        print(f"\nFAIL - timeline references an image that does not exist ({len(ghosts)}):")
        for m in sorted(ghosts):
            print("   ", m)

    both = set(primary) & set(ambient)
    if both:
        print(f"\nnote - appears in both tiers ({len(both)}): {sorted(both)}")

    # per-product breakdown
    print("\nper-product placement:")
    fams = [("SRP 350 G", "srp-350"), ("SRP 400 G", "srp-400"),
            ("SRP 501 G", "srp-501"), ("SRP 601 G", "srp-601"),
            ("SLF 210 V3", "slf-210-v3"), ("generic", "studio-monitor")]
    for label, pref in fams:
        req = {r for r in required if r.startswith(pref)}
        pri = {r for r in req if r in primary}
        amb = {r for r in req if r in ambient}
        flag = "OK " if req <= placed else "GAP"
        print(f"  {flag} {label:12} total {len(req):3}  primary {len(pri):3}  ambient {len(amb):3}")

    # timing sanity
    tot = tl["durationInFrames"]
    acc = sum(s["dur"] for s in tl["scenes"])
    print(f"\nduration: {tot} frames ({tot / tl['fps']:.3f}s); scenes sum to {acc}")
    if acc != tot:
        ok = False
        print("FAIL - scene durations do not sum to the composition length")

    for sc in tl["scenes"]:
        if not sc["shots"]:
            continue
        last = sc["shots"][-1]
        if last["from"] + last["dur"] != sc["from"] + sc["dur"]:
            ok = False
            print(f"FAIL - {sc['id']} shots do not fill the scene")

    print("\n" + ("PASS - every enumerated image is placed." if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
