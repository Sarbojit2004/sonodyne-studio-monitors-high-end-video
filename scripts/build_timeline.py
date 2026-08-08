#!/usr/bin/env python3
"""Generate src/data/timeline.json - the single source of truth for the reel.

Both the Remotion scene code (TypeScript) and the audio synthesizer
(scripts/gen_audio.py) read this file, so visual cuts and SFX cues can never
drift apart.

Run:  python3 scripts/build_timeline.py
"""
import json
import os

FPS = 30
W, H = 1080, 1920
TOTAL = 2640  # 88.000s exactly

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- Instagram safe-zone geometry (Section 2a) -----------------------------
SAFE = {"top": 250, "bottom": 1580, "side": 80}


def shots(start, specs):
    """Lay shots end-to-end from `start`. specs = list of (dur, dict)."""
    out, f = [], start
    for dur, spec in specs:
        s = dict(spec)
        s["from"] = f
        s["dur"] = dur
        s.setdefault("tier", "primary")
        out.append(s)
        f += dur
    return out, f


scenes = []

# =========================================================================
# S1  HOOK - acoustic deception (0 - 345 | 11.5s) | 6 images
# =========================================================================
s1, end = shots(0, [
    (68, {"mode": "panel", "img": ["studio-monitor-00"], "sfx": "impact-deep",
          "move": "push", "text": "hook-a"}),
    (60, {"mode": "panel", "img": ["studio-monitor-02"], "sfx": "whoosh-low",
          "move": "driftL", "text": "hook-b"}),
    (48, {"mode": "panel", "img": ["srp-350-14"], "sfx": "tick-hard",
          "move": "push", "text": "hook-c"}),
    (48, {"mode": "panel", "img": ["srp-400-13"], "sfx": "tick-hard",
          "move": "driftR", "text": "hook-c"}),
    (48, {"mode": "panel", "img": ["srp-601-11"], "sfx": "tick-hard",
          "move": "push", "text": "hook-c"}),
    (73, {"mode": "panel", "img": ["srp-501-09"], "sfx": "riser-open",
          "move": "pull", "text": "hook-d"}),
])
assert end == 345, end
scenes.append({"id": "s01-hook", "from": 0, "dur": 345, "kind": "hook",
               "shots": s1, "ambient": []})

# =========================================================================
# S2  SHARED DNA (345 - 630 | 9.5s) | 8 images
# =========================================================================
s2, end = shots(345, [
    (90, {"mode": "quad-dna", "sfx": "chime-stack", "text": "dna-a",
          "img": ["srp-350-01", "srp-400-02", "srp-501-02", "srp-601-02"],
          "labels": ["SRP 350 G", "SRP 400 G", "SRP 501 G", "SRP 601 G"]}),
    (65, {"mode": "hero", "img": ["srp-400-03"], "sfx": "whoosh-soft",
          "move": "push", "overlay": "rigidity", "text": "dna-b"}),
    (60, {"mode": "hero-crop", "img": ["srp-601-07"], "sfx": "whoosh-soft",
          "move": "dolly-tweeter", "overlay": "directivity", "text": "dna-c"}),
    (38, {"mode": "hero", "img": ["srp-501-05"], "sfx": "tick-soft",
          "move": "driftL", "text": "dna-d"}),
    (32, {"mode": "hero", "img": ["srp-350-04"], "sfx": "tick-soft",
          "move": "driftR", "text": "dna-d"}),
])
assert end == 630, end
scenes.append({"id": "s02-dna", "from": 345, "dur": 285, "kind": "dna",
               "shots": s2, "ambient": []})

# =========================================================================
# S3  SRP 350 G (630 - 960 | 11.0s) | 10 primary + 3 ambient = 13
# =========================================================================
s3, end = shots(630, [
    (82, {"mode": "hero", "img": ["srp-350-02"], "sfx": "impact-soft",
          "move": "push", "text": "p350-title"}),
    (48, {"mode": "duo", "img": ["srp-350-03", "srp-350-05"],
          "sfx": "whoosh-soft", "move": "slideUp", "text": "p350-spec"}),
    (46, {"mode": "triad", "img": ["srp-350-06", "srp-350-07", "srp-350-08"],
          "sfx": "tick-triple", "move": "fan", "text": "p350-spec"}),
    (54, {"mode": "panel", "img": ["srp-350-13"], "sfx": "whoosh-low",
          "move": "push", "text": "p350-sealed"}),
    (46, {"mode": "hero", "img": ["srp-350-09"], "sfx": "tick-soft",
          "move": "driftL", "text": "p350-numbers"}),
    (54, {"mode": "duo", "img": ["srp-350-10", "srp-350-11"],
          "sfx": "whoosh-soft", "move": "slideL", "text": "p350-brand"}),
])
assert end == 960, end
scenes.append({"id": "s03-350", "from": 630, "dur": 330, "kind": "product",
               "product": "srp350", "shots": s3, "ambient": [
                   {"img": "srp-350-12", "band": "top", "from": 630, "dur": 165},
                   {"img": "srp-350-16", "band": "top", "from": 795, "dur": 165},
                   {"img": "srp-350-15", "band": "bottom", "from": 630, "dur": 330},
               ]})

# =========================================================================
# S4  SRP 400 G (960 - 1275 | 10.5s) | 9 primary + 3 ambient = 12
# =========================================================================
s4, end = shots(960, [
    (80, {"mode": "hero", "img": ["srp-400-09"], "sfx": "impact-soft",
          "move": "push", "text": "p400-title"}),
    (54, {"mode": "panel", "img": ["srp-400-12"], "sfx": "whoosh-low",
          "move": "driftR", "text": "p400-port"}),
    (46, {"mode": "triad", "img": ["srp-400-04", "srp-400-06", "srp-400-07"],
          "sfx": "tick-triple", "move": "fan", "text": "p400-spec"}),
    (48, {"mode": "panel", "img": ["srp-400-14"], "sfx": "whoosh-soft",
          "move": "push", "text": "p400-curv"}),
    (46, {"mode": "duo", "img": ["srp-400-05", "srp-400-08"],
          "sfx": "tick-soft", "move": "slideUp", "text": "p400-numbers"}),
    (41, {"mode": "panel", "img": ["srp-400-01"], "sfx": "whoosh-soft",
          "move": "driftL", "text": "p400-brand"}),
])
assert end == 1275, end
scenes.append({"id": "s04-400", "from": 960, "dur": 315, "kind": "product",
               "product": "srp400", "shots": s4, "ambient": [
                   {"img": "srp-400-11", "band": "top", "from": 960, "dur": 160},
                   {"img": "srp-400-10", "band": "top", "from": 1120, "dur": 155},
                   {"img": "srp-400-15", "band": "bottom", "from": 960, "dur": 315},
               ]})

# =========================================================================
# S5  SRP 501 G (1275 - 1545 | 9.0s) | 5 primary + 2 ambient = 7
# =========================================================================
s5, end = shots(1275, [
    (80, {"mode": "hero", "img": ["srp-501-03"], "sfx": "impact-soft",
          "move": "push", "text": "p501-title"}),
    (70, {"mode": "hero-crop", "img": ["srp-501-06"], "sfx": "stepper",
          "move": "dolly-eq", "overlay": "eqsteps", "text": "p501-eq"}),
    (46, {"mode": "duo", "img": ["srp-501-04", "srp-501-07"],
          "sfx": "tick-soft", "move": "slideUp", "text": "p501-spec"}),
    (74, {"mode": "panel", "img": ["srp-501-08"], "sfx": "whoosh-low",
          "move": "push", "text": "p501-numbers"}),
])
assert end == 1545, end
scenes.append({"id": "s05-501", "from": 1275, "dur": 270, "kind": "product",
               "product": "srp501", "shots": s5, "ambient": [
                   {"img": "srp-501-01", "band": "top", "from": 1275, "dur": 270},
                   {"img": "srp-501-10", "band": "bottom", "from": 1275, "dur": 270},
               ]})

# =========================================================================
# S6  SRP 601 G (1545 - 1860 | 10.5s) | 8 primary + 2 ambient = 10
# =========================================================================
s6, end = shots(1545, [
    (85, {"mode": "hero", "img": ["srp-601-08"], "sfx": "impact-deep",
          "move": "push", "text": "p601-title"}),
    (60, {"mode": "panel", "img": ["srp-601-10"], "sfx": "whoosh-low",
          "move": "driftL", "text": "p601-headroom"}),
    (46, {"mode": "duo", "img": ["srp-601-03", "srp-601-04"],
          "sfx": "tick-soft", "move": "slideUp", "text": "p601-spec"}),
    (54, {"mode": "panel", "img": ["srp-601-12"], "sfx": "whoosh-soft",
          "move": "push", "text": "p601-numbers"}),
    (40, {"mode": "duo", "img": ["srp-601-05", "srp-601-06"],
          "sfx": "tick-soft", "move": "fan", "text": "p601-spec"}),
    (30, {"mode": "panel", "img": ["srp-601-01"], "sfx": "whoosh-soft",
          "move": "driftR", "text": "p601-brand"}),
])
assert end == 1860, end
scenes.append({"id": "s06-601", "from": 1545, "dur": 315, "kind": "product",
               "product": "srp601", "shots": s6, "ambient": [
                   {"img": "srp-601-09", "band": "top", "from": 1545, "dur": 315},
                   {"img": "srp-601-13", "band": "bottom", "from": 1545, "dur": 315},
               ]})

# =========================================================================
# S7  SLF 210 V3 (1860 - 2160 | 10.0s) | 6 images
# =========================================================================
s7, end = shots(1860, [
    (90, {"mode": "hero", "img": ["slf-210-v3-08"], "sfx": "sub-drop",
          "move": "push", "text": "slf-title"}),
    (65, {"mode": "hero-crop", "img": ["slf-210-v3-04"], "sfx": "stepper",
          "move": "dolly-eq", "overlay": "phase", "text": "slf-phase"}),
    (60, {"mode": "panel", "img": ["slf-210-v3-03"], "sfx": "whoosh-low",
          "move": "driftR", "overlay": "crossover", "text": "slf-21"}),
    (45, {"mode": "duo", "img": ["slf-210-v3-06", "slf-210-v3-07"],
          "sfx": "tick-soft", "move": "slideUp", "text": "slf-numbers"}),
    (40, {"mode": "panel", "img": ["slf-210-v3-01"], "sfx": "whoosh-soft",
          "move": "push", "text": "slf-brand"}),
])
assert end == 2160, end
scenes.append({"id": "s07-slf", "from": 1860, "dur": 300, "kind": "product",
               "product": "slf210", "shots": s7, "ambient": []})

# =========================================================================
# S8  THE SYSTEM (2160 - 2325 | 5.5s) | 6 images
# =========================================================================
s8, end = shots(2160, [
    (90, {"mode": "quad-range", "sfx": "chime-stack", "text": "sys-family",
          "img": ["srp-350-00", "srp-400-00", "srp-501-00", "srp-601-00"],
          "labels": ["350 G", "400 G", "501 G", "601 G"]}),
    (75, {"mode": "duo", "img": ["slf-210-v3-02", "slf-210-v3-05"],
          "sfx": "sub-drop", "move": "slideUp", "text": "sys-21"}),
])
assert end == 2325, end
scenes.append({"id": "s08-system", "from": 2160, "dur": 165, "kind": "system",
               "shots": s8, "ambient": []})

# =========================================================================
# S9  PRICING (2325 - 2520 | 6.5s) - re-uses hero pack shots as row thumbs
# =========================================================================
scenes.append({"id": "s09-pricing", "from": 2325, "dur": 195, "kind": "pricing",
               "shots": [], "ambient": [],
               "rowFrames": [2340, 2358, 2376, 2394, 2412]})

# =========================================================================
# S10 CTA (2520 - 2640 | 4.0s)
# =========================================================================
scenes.append({"id": "s10-cta", "from": 2520, "dur": 120, "kind": "cta",
               "shots": [], "ambient": []})

# --- derive the SFX cue list ----------------------------------------------
cues = []
for sc in scenes:
    for sh in sc["shots"]:
        cues.append({"frame": sh["from"], "sfx": sh["sfx"],
                     "scene": sc["id"], "gain": 1.0})
    # ambient-band swaps get their own soft texture cue
    for am in sc["ambient"]:
        cues.append({"frame": am["from"], "sfx": "air-swell",
                     "scene": sc["id"], "gain": 0.55})

# scene-boundary accents (layered on top of the shot cue already there)
for sc in scenes[1:]:
    cues.append({"frame": sc["from"], "sfx": "transition-sweep",
                 "scene": sc["id"], "gain": 0.85})

# pricing rows + CTA
for i, f in enumerate(scenes[8]["rowFrames"]):
    cues.append({"frame": f, "sfx": "tick-hard", "scene": "s09-pricing",
                 "gain": 0.7 + i * 0.05})
cues.append({"frame": 2325, "sfx": "impact-soft", "scene": "s09-pricing", "gain": 1.0})
cues.append({"frame": 2520, "sfx": "riser-open", "scene": "s10-cta", "gain": 1.0})
cues.append({"frame": 2560, "sfx": "chime-stack", "scene": "s10-cta", "gain": 0.8})

cues.sort(key=lambda c: c["frame"])

# --- coverage bookkeeping --------------------------------------------------
primary, ambient = [], []
for sc in scenes:
    for sh in sc["shots"]:
        primary.extend(sh.get("img", []))
    for am in sc["ambient"]:
        ambient.append(am["img"])

data = {
    "fps": FPS, "width": W, "height": H, "durationInFrames": TOTAL,
    "safe": SAFE,
    "scenes": scenes,
    "cues": cues,
    "coverage": {"primary": primary, "ambient": ambient},
}

out = os.path.join(ROOT, "src", "data", "timeline.json")
with open(out, "w") as fh:
    json.dump(data, fh, indent=1)

total_imgs = len(primary) + len(ambient)
print(f"wrote {out}")
print(f"  duration      : {TOTAL} frames = {TOTAL / FPS:.3f}s")
print(f"  scenes        : {len(scenes)}")
print(f"  sfx cues      : {len(cues)}")
print(f"  primary images: {len(primary)}")
print(f"  ambient images: {len(ambient)}")
print(f"  TOTAL images  : {total_imgs}")
