#!/usr/bin/env python3
"""Write IMAGE_COVERAGE.md - the explicit per-image placement map (Checkpoint 5)."""
import json, os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))
amap = json.load(open(os.path.join(ROOT, "src/data/asset-map.json")))
rev = {v.replace(".webp", ""): k for k, v in amap.items()}
fps = tl["fps"]

SCENE_TITLE = {
    "s01-hook": "1. Hook", "s02-dna": "2. Shared engineering DNA",
    "s03-350": "3. SRP 350 G", "s04-400": "4. SRP 400 G",
    "s05-501": "5. SRP 501 G", "s06-601": "6. SRP 601 G",
    "s07-slf": "7. SLF 210 V3", "s08-system": "8. The system together",
    "s09-pricing": "9. Pricing", "s10-cta": "10. Call to action",
}

rows = []
for sc in tl["scenes"]:
    for sh in sc["shots"]:
        for slug in sh["img"]:
            rows.append((slug, sc["id"], sh["from"], sh["dur"], sh["mode"], "primary"))
    for am in sc["ambient"]:
        rows.append((am["img"], sc["id"], am["from"], am["dur"], f"ambient {am['band']} band", "ambient"))

by_scene = defaultdict(list)
for r in rows:
    by_scene[r[1]].append(r)

seen = {}
for slug, sid, f, d, mode, tier in sorted(rows, key=lambda r: r[2]):
    seen.setdefault(slug, (sid, f, mode, tier))

L = []
L.append("# Image coverage map\n")
L.append("Every product/context image in this repository appears in the finished reel.")
L.append("The two logo files are excluded by design (Section 4a) and are not part of the")
L.append("compulsory-coverage set.\n")
n_pri = len({r[0] for r in rows if r[5] == "primary"})
n_amb = len({r[0] for r in rows if r[5] == "ambient"})
L.append(f"- **Total enumerated images:** {len(seen)}")
L.append(f"- **Primary / hero tier** (composed inside the 250-1580px safe zone): {n_pri}")
L.append(f"- **Ambient tier** (blurred fill in the top/bottom bands): {n_amb}")
L.append(f"- **Runtime:** {tl['durationInFrames']} frames = {tl['durationInFrames']/fps:.3f}s\n")
L.append("> The stated count for this project was 73. A full `git ls-files` enumeration")
L.append("> finds 68 non-logo images (70 image files minus the 2 logos); 5 of those are")
L.append("> byte-identical duplicates of another file, so there are 63 unique pictures.")
L.append("> All 68 files are placed regardless.\n")

for sid in [s["id"] for s in tl["scenes"]]:
    if sid not in by_scene:
        continue
    sc = next(s for s in tl["scenes"] if s["id"] == sid)
    L.append(f"\n## {SCENE_TITLE.get(sid, sid)}")
    L.append(f"`{sc['from']}`-`{sc['from']+sc['dur']}` "
             f"({sc['from']/fps:.1f}s - {(sc['from']+sc['dur'])/fps:.1f}s)\n")
    L.append("| original file | placement | tier | frames |")
    L.append("|---|---|---|---|")
    for slug, _, f, d, mode, tier in sorted(by_scene[sid], key=lambda r: (r[5] != "primary", r[2])):
        L.append(f"| `{rev.get(slug, slug)}` | {mode} | {tier} | {f}-{f+d} |")

L.append("\n## Re-used later\n")
L.append("The pricing card re-uses one hero pack shot per product as a row thumbnail")
L.append("(`srp-350-02`, `srp-400-09`, `srp-501-03`, `srp-601-08`, `slf-210-v3-08`).")
L.append("Each already has its own dedicated first appearance above, so this is")
L.append("additional exposure, not a coverage slot.\n")
L.append("Verify with `python3 scripts/verify_coverage.py`.")

open(os.path.join(ROOT, "IMAGE_COVERAGE.md"), "w").write("\n".join(L) + "\n")
print(f"wrote IMAGE_COVERAGE.md ({len(seen)} images: {n_pri} primary, {n_amb} ambient)")
