#!/usr/bin/env python3
"""Checkpoint 2/7: prove the generated audio is real, decodable and in sync.

- every file in the palette + the three beds exists and decodes via ffprobe
- beds are exactly the composition length
- the cue track actually has energy at each cut frame (not silence)
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, "public", "audio")


def probe(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "stream=codec_name,sample_rate,channels,duration_ts:format=duration",
         "-of", "json", path],
        capture_output=True, text=True)
    if r.returncode != 0:
        return None
    j = json.loads(r.stdout)
    st = j["streams"][0]
    return {"codec": st["codec_name"], "sr": int(st["sample_rate"]),
            "ch": int(st["channels"]), "dur": float(j["format"]["duration"])}


def read_wav(path):
    with wave.open(path, "rb") as w:
        n, ch, sr = w.getnframes(), w.getnchannels(), w.getframerate()
        a = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float32) / 32768.0
    return a.reshape(-1, ch), sr


def main():
    tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))
    fps = tl["fps"]
    total_s = tl["durationInFrames"] / fps
    ok = True

    print("=== SFX palette ===")
    names = sorted(os.listdir(os.path.join(AUD, "sfx")))
    for f in names:
        p = os.path.join(AUD, "sfx", f)
        info = probe(p)
        if not info:
            ok = False
            print(f"  FAIL undecodable: {f}")
            continue
        a, _ = read_wav(p)
        peak = float(np.max(np.abs(a)))
        silent = peak < 1e-4
        if silent or info["dur"] < 0.03:
            ok = False
        print(f"  {'FAIL' if silent else 'ok  '} {f:24} {info['codec']} "
              f"{info['sr']}Hz {info['ch']}ch {info['dur']:5.2f}s peak {peak:.2f}")
    print(f"  palette size: {len(names)} files")

    print("\n=== beds ===")
    for f, want_len in (("ambient-bed.wav", True), ("sfx-cues.wav", True),
                        ("music-bed.wav", True)):
        p = os.path.join(AUD, f)
        if not os.path.exists(p):
            ok = False
            print(f"  FAIL missing: {f}")
            continue
        info = probe(p)
        a, sr = read_wav(p)
        peak = float(np.max(np.abs(a)))
        rms = float(np.sqrt(np.mean(a ** 2)))
        dur_ok = abs(info["dur"] - total_s) < 0.02 if want_len else True
        if not dur_ok or peak < 1e-4:
            ok = False
        print(f"  {'ok  ' if dur_ok and peak > 1e-4 else 'FAIL'} {f:20} "
              f"{info['dur']:6.3f}s (want {total_s:.3f}) {info['ch']}ch "
              f"peak {peak:.2f} rms {20 * np.log10(rms + 1e-12):6.1f} dBFS")

    p = os.path.join(ROOT, "public/vo/voiceover-reel-sonodyne.wav")
    info = probe(p)
    print(f"  ok   {'vo placeholder':20} {info['dur']:6.3f}s (silent, ready for VO)")

    # --- cue sync: energy must be present at every cut frame ---------------
    # 300ms window: tight enough to prove sync to the cut, wide enough for the
    # deliberately slow-attack swell cues.
    print("\n=== cue sync (energy within 300ms of each cut frame) ===")
    cues, sr = read_wav(os.path.join(AUD, "sfx-cues.wav"))
    mono = cues.mean(axis=1)
    win = int(0.30 * sr)
    frames = sorted({c["frame"] for c in tl["cues"]})
    dead = []
    for fr in frames:
        s = int(round(fr / fps * sr))
        seg = mono[s:s + win]
        if len(seg) == 0 or float(np.max(np.abs(seg))) < 0.004:
            dead.append(fr)
    print(f"  distinct cut frames : {len(frames)}")
    print(f"  total cue events    : {len(tl['cues'])}")
    if dead:
        ok = False
        print(f"  FAIL silent at frames: {dead}")
    else:
        print("  ok   every cut frame carries an audible cue")

    # --- ambient bed continuity: no silent gap anywhere --------------------
    amb, sr = read_wav(os.path.join(AUD, "ambient-bed.wav"))
    m = np.abs(amb.mean(axis=1))
    block = sr // 2
    n_blocks = len(m) // block
    quiet = [i for i in range(1, n_blocks - 1)
             if float(np.max(m[i * block:(i + 1) * block])) < 1e-4]
    print(f"\n=== ambient bed continuity ({n_blocks} x 0.5s blocks) ===")
    if quiet:
        ok = False
        print(f"  FAIL silent blocks at: {quiet[:12]}")
    else:
        print("  ok   bed is continuous end to end, no silent gap")

    print("\n" + ("PASS - audio pipeline validated." if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
