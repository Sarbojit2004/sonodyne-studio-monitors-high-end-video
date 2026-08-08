#!/usr/bin/env python3
"""Generate src/lf/timeline-lf.json - single source of truth for the 298s long-form.

Consumed by both the Remotion scene code (TypeScript) and the audio
synthesizer, so visual cuts and SFX cues cannot drift apart - same pattern as
the reel's build_timeline.py.

Run:  python3 scripts/build_timeline_lf.py
"""
import json
import os

FPS = 30
W, H = 1920, 1080
TOTAL = 8940  # 298.000s exactly

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CHAPTER_DUR = {
    "coldOpen": 540, "sharedDna": 480, "srp350": 840, "srp400": 840,
    "srp501": 900, "srp601": 900, "slf210": 1020, "system": 600,
    "workflows": 720, "pricing": 540, "heritage": 600, "outro": 960,
}
assert sum(CHAPTER_DUR.values()) == TOTAL, sum(CHAPTER_DUR.values())


def shots(start, specs):
    out, f = [], start
    for dur, spec in specs:
        s = dict(spec)
        s["from"] = f
        s["dur"] = dur
        out.append(s)
        f += dur
    return out, f


chapters = []
USED_PRIMARY = []  # tracks every slug placed as primary content, for the coverage check

# =========================================================================
# CH1  COLD OPEN (0 - 540 | 18s) - the two generic images
# =========================================================================
f0 = 0
s, end = shots(f0, [
    (270, {"mode": "full", "img": ["studio-monitor-00"], "move": "push",
           "sfx": "impact-deep", "text": "co-a"}),
    (270, {"mode": "full", "img": ["studio-monitor-02"], "move": "driftL",
           "sfx": "riser-open", "text": "co-b"}),
])
assert end == 540
chapters.append({"id": "coldOpen", "from": f0, "dur": 540, "shots": s})
USED_PRIMARY += ["studio-monitor-00", "studio-monitor-02"]

# =========================================================================
# CH2  SHARED DNA (540 - 1020 | 16s) - 4 macro PCB images, reused across 3 beats
# =========================================================================
f0 = 540
s, end = shots(f0, [
    (200, {"mode": "quad", "sfx": "chime-stack", "text": "dna-a",
           "img": ["srp-350-01", "srp-400-02", "srp-501-02", "srp-601-02"],
           "labels": ["SRP 350 G", "SRP 400 G", "SRP 501 G", "SRP 601 G"]}),
    (140, {"mode": "hero-crop", "img": ["srp-601-02"], "move": "dolly",
           "overlay": "rigidity", "sfx": "whoosh-low", "text": "dna-b"}),
    (140, {"mode": "hero-crop", "img": ["srp-400-02"], "move": "dolly",
           "overlay": "directivity", "sfx": "whoosh-soft", "text": "dna-c"}),
])
assert end == 1020, end
chapters.append({"id": "sharedDna", "from": f0, "dur": 480, "shots": s})
USED_PRIMARY += ["srp-350-01", "srp-400-02", "srp-501-02", "srp-601-02"]

# =========================================================================
# CH3  SRP 350 G (1020 - 1860 | 28s) - 16 images (17 minus the DNA macro)
# =========================================================================
f0 = 1020
s, end = shots(f0, [
    (120, {"mode": "hero", "img": ["srp-350-00"], "move": "push",
           "sfx": "impact-soft", "text": "p350-title"}),
    (90, {"mode": "split", "img": ["srp-350-02"], "move": "driftR",
          "sfx": "tick-soft", "text": "p350-front"}),
    (60, {"mode": "split", "img": ["srp-350-03"], "move": "push",
          "sfx": "tick-soft", "text": None}),
    (90, {"mode": "duo", "img": ["srp-350-04", "srp-350-05"], "move": "fan",
          "sfx": "whoosh-soft", "text": "p350-sealed"}),
    (120, {"mode": "triad", "img": ["srp-350-06", "srp-350-07", "srp-350-08"],
           "move": "fan", "overlay": "rigidity", "sfx": "tick-triple", "text": "p350-rear"}),
    (60, {"mode": "split", "img": ["srp-350-09"], "move": "driftL",
          "sfx": "tick-soft", "text": None}),
    (300, {"mode": "montage", "sfx": "whoosh-low", "text": "p350-lifestyle",
           "img": ["srp-350-10", "srp-350-11", "srp-350-12", "srp-350-13",
                    "srp-350-14", "srp-350-15", "srp-350-16"]}),
])
assert end == 1860, end
chapters.append({"id": "srp350", "from": f0, "dur": 840, "shots": s, "product": "srp350"})
USED_PRIMARY += [f"srp-350-{n:02d}" for n in [0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]]

# =========================================================================
# CH4  SRP 400 G (1860 - 2700 | 28s) - 15 images (16 minus the DNA macro)
# =========================================================================
f0 = 1860
s, end = shots(f0, [
    (120, {"mode": "hero", "img": ["srp-400-00"], "move": "push",
           "sfx": "impact-soft", "text": "p400-title"}),
    (90, {"mode": "split", "img": ["srp-400-03"], "move": "driftR",
          "overlay": "directivity", "sfx": "tick-soft", "text": "p400-curv"}),
    (90, {"mode": "duo", "img": ["srp-400-04", "srp-400-06"], "move": "fan",
          "sfx": "whoosh-low", "text": "p400-port"}),
    (60, {"mode": "split", "img": ["srp-400-05"], "move": "push", "sfx": "tick-soft", "text": None}),
    (60, {"mode": "split", "img": ["srp-400-07"], "move": "driftL", "sfx": "tick-soft", "text": None}),
    (90, {"mode": "duo", "img": ["srp-400-08", "srp-400-09"], "move": "fan",
          "sfx": "tick-triple", "text": "p400-numbers"}),
    (60, {"mode": "split", "img": ["srp-400-10"], "move": "push",
          "sfx": "tick-soft", "text": "p400-bag"}),
    (270, {"mode": "montage", "sfx": "whoosh-low", "text": "p400-lifestyle",
           "img": ["srp-400-01", "srp-400-11", "srp-400-12", "srp-400-13",
                    "srp-400-14", "srp-400-15"]}),
])
assert end == 2700, end
chapters.append({"id": "srp400", "from": f0, "dur": 840, "shots": s, "product": "srp400"})
USED_PRIMARY += [f"srp-400-{n:02d}" for n in [0,1,3,4,5,6,7,8,9,10,11,12,13,14,15]]

# =========================================================================
# CH5  SRP 501 G (2700 - 3600 | 30s) - 10 images (11 minus the DNA macro)
# =========================================================================
f0 = 2700
s, end = shots(f0, [
    (150, {"mode": "hero", "img": ["srp-501-00"], "move": "push",
           "sfx": "impact-soft", "text": "p501-title"}),
    (120, {"mode": "duo", "img": ["srp-501-03", "srp-501-04"], "move": "fan",
           "sfx": "tick-triple", "text": "p501-neo"}),
    (90, {"mode": "split", "img": ["srp-501-05"], "move": "driftR", "sfx": "tick-soft", "text": None}),
    (180, {"mode": "hero-crop", "img": ["srp-501-06"], "move": "dolly",
           "overlay": "eqsteps", "sfx": "stepper", "text": "p501-eq"}),
    (90, {"mode": "split", "img": ["srp-501-07"], "move": "push",
          "sfx": "tick-soft", "text": "p501-numbers"}),
    (270, {"mode": "montage", "sfx": "whoosh-low", "text": "p501-lifestyle",
           "img": ["srp-501-01", "srp-501-08", "srp-501-09", "srp-501-10"]}),
])
assert end == 3600, end
chapters.append({"id": "srp501", "from": f0, "dur": 900, "shots": s, "product": "srp501"})
USED_PRIMARY += [f"srp-501-{n:02d}" for n in [0,1,3,4,5,6,7,8,9,10]]

# =========================================================================
# CH6  SRP 601 G (3600 - 4500 | 30s) - 13 images (14 minus the DNA macro)
# =========================================================================
f0 = 3600
s, end = shots(f0, [
    (150, {"mode": "hero", "img": ["srp-601-00"], "move": "push",
           "sfx": "impact-deep", "text": "p601-title"}),
    (180, {"mode": "triad", "img": ["srp-601-03", "srp-601-04", "srp-601-05"],
           "move": "fan", "sfx": "tick-triple", "text": "p601-headroom"}),
    (90, {"mode": "split", "img": ["srp-601-06"], "move": "driftL",
          "overlay": "rigidity", "sfx": "whoosh-low", "text": None}),
    (120, {"mode": "duo", "img": ["srp-601-07", "srp-601-08"], "move": "fan",
           "sfx": "tick-soft", "text": "p601-numbers"}),
    (360, {"mode": "montage", "sfx": "whoosh-low", "text": "p601-lifestyle",
           "img": ["srp-601-01", "srp-601-09", "srp-601-10", "srp-601-11",
                    "srp-601-12", "srp-601-13"]}),
])
assert end == 4500, end
chapters.append({"id": "srp601", "from": f0, "dur": 900, "shots": s, "product": "srp601"})
USED_PRIMARY += [f"srp-601-{n:02d}" for n in [0,1,3,4,5,6,7,8,9,10,11,12,13]]

# =========================================================================
# CH7  SLF 210 V3 (4500 - 5520 | 34s) - all 8 images
# =========================================================================
f0 = 4500
s, end = shots(f0, [
    (180, {"mode": "full", "img": ["slf-210-v3-01"], "move": "push",
           "sfx": "sub-drop", "text": "slf-title"}),
    (150, {"mode": "hero", "img": ["slf-210-v3-02"], "move": "driftR",
           "sfx": "impact-deep", "text": "slf-driver"}),
    (150, {"mode": "full", "img": ["slf-210-v3-03"], "move": "push",
           "sfx": "whoosh-low", "text": "slf-2p1"}),
    (180, {"mode": "hero-crop", "img": ["slf-210-v3-04"], "move": "dolly",
           "overlay": "phase", "sfx": "stepper", "text": "slf-phase"}),
    (150, {"mode": "hero-crop", "img": ["slf-210-v3-05"], "move": "dolly",
           "overlay": "crossover", "sfx": "whoosh-soft", "text": "slf-crossover"}),
    (90, {"mode": "split", "img": ["slf-210-v3-06"], "move": "driftL", "sfx": "tick-soft", "text": None}),
    (60, {"mode": "split", "img": ["slf-210-v3-07"], "move": "push", "sfx": "tick-soft", "text": None}),
    (60, {"mode": "hero", "img": ["slf-210-v3-08"], "move": "push",
          "sfx": "sub-drop", "text": "slf-numbers"}),
])
assert end == 5520, end
chapters.append({"id": "slf210", "from": f0, "dur": 1020, "shots": s, "product": "slf210"})
USED_PRIMARY += [f"slf-210-v3-{n:02d}" for n in [1,2,3,4,5,6,7,8]]

# =========================================================================
# CH8  SYSTEM TOGETHER (5520 - 6120 | 20s) - secondary reuse, no new images
# =========================================================================
f0 = 5520
s, end = shots(f0, [
    (300, {"mode": "quad-range", "sfx": "chime-stack", "text": "sys-family",
           "img": ["srp-350-00", "srp-400-00", "srp-501-00", "srp-601-00"],
           "labels": ["350 G", "400 G", "501 G", "601 G"]}),
    (300, {"mode": "hero", "img": ["slf-210-v3-08"], "move": "pull",
           "overlay": "crossover", "sfx": "sub-drop", "text": "sys-2p1"}),
])
assert end == 6120, end
chapters.append({"id": "system", "from": f0, "dur": 600, "shots": s})

# =========================================================================
# CH9  WORKFLOWS (6120 - 6840 | 24s) - secondary reuse of lifestyle shots
# =========================================================================
f0 = 6120
s, end = shots(f0, [
    (180, {"mode": "full", "img": ["srp-350-11"], "move": "push",
           "sfx": "whoosh-soft", "text": "wf-home"}),
    (180, {"mode": "full", "img": ["srp-400-13"], "move": "driftR",
           "sfx": "whoosh-soft", "text": "wf-project"}),
    (180, {"mode": "full", "img": ["srp-601-10"], "move": "push",
           "sfx": "whoosh-soft", "text": "wf-broadcast"}),
    (180, {"mode": "full", "img": ["srp-501-08"], "move": "driftL",
           "sfx": "whoosh-low", "text": "wf-commercial"}),
])
assert end == 6840, end
chapters.append({"id": "workflows", "from": f0, "dur": 720, "shots": s})

# =========================================================================
# CH10 PRICING (6840 - 7380 | 18s) - secondary reuse as row thumbnails
# =========================================================================
f0 = 6840
chapters.append({"id": "pricing", "from": f0, "dur": 540, "shots": [],
                  "rowFrames": [6858, 6894, 6930, 6966, 7002]})

# =========================================================================
# CH11 HERITAGE & PROOF (7380 - 7980 | 20s) - secondary reuse as backdrop
# =========================================================================
f0 = 7380
s, end = shots(f0, [
    (200, {"mode": "full", "img": ["srp-601-12"], "move": "push",
           "sfx": "chime-stack", "text": "her-a"}),
    (200, {"mode": "full", "img": ["srp-350-14"], "move": "driftR",
           "sfx": "tick-soft", "text": "her-b"}),
    (200, {"mode": "full", "img": ["srp-400-11"], "move": "driftL",
           "sfx": "tick-soft", "text": "her-c"}),
])
assert end == 7980, end
chapters.append({"id": "heritage", "from": f0, "dur": 600, "shots": s})

# =========================================================================
# CH12 OUTRO (7980 - 8940 | 32s)
# =========================================================================
f0 = 7980
chapters.append({"id": "outro", "from": f0, "dur": 960, "shots": [],
                  "familyFrame": 7980})

# --- SFX cue list -----------------------------------------------------
cues = []
for ch in chapters:
    for sh in ch["shots"]:
        cues.append({"frame": sh["from"], "sfx": sh["sfx"], "chapter": ch["id"], "gain": 1.0})
for ch in chapters[1:]:
    cues.append({"frame": ch["from"], "sfx": "transition-sweep", "chapter": ch["id"], "gain": 0.85})
for i, f in enumerate(chapters[9]["rowFrames"]):
    cues.append({"frame": f, "sfx": "tick-hard", "chapter": "pricing", "gain": 0.7 + i * 0.05})
cues.append({"frame": 6840, "sfx": "impact-soft", "chapter": "pricing", "gain": 1.0})
cues.append({"frame": 7980, "sfx": "riser-open", "chapter": "outro", "gain": 1.0})
cues.append({"frame": 8040, "sfx": "chime-stack", "chapter": "outro", "gain": 0.8})
cues.sort(key=lambda c: c["frame"])

# --- coverage bookkeeping ----------------------------------------------
data = {
    "fps": FPS, "width": W, "height": H, "durationInFrames": TOTAL,
    "chapters": chapters,
    "cues": cues,
    "coverage": {"primary": USED_PRIMARY},
}

out = os.path.join(ROOT, "src", "lf", "timeline-lf.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as fh:
    json.dump(data, fh, indent=1)

print(f"wrote {out}")
print(f"  duration : {TOTAL} frames = {TOTAL/FPS:.3f}s")
print(f"  chapters : {len(chapters)}")
print(f"  sfx cues : {len(cues)}")
print(f"  primary images : {len(USED_PRIMARY)} (unique: {len(set(USED_PRIMARY))})")
