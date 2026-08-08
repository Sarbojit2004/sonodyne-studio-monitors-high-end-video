#!/usr/bin/env python3
"""Checkpoint 2/3 (long-form): prove the generated audio is real, decodable,
correctly timed, and never silent - before any scene code references it.
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, "public", "audio", "lf")


def probe(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "stream=codec_name,sample_rate,channels:format=duration",
         "-of", "json", path], capture_output=True, text=True)
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
    tl = json.load(open(os.path.join(ROOT, "src/lf/timeline-lf.json")))
    fps = tl["fps"]
    total_s = tl["durationInFrames"] / fps
    ok = True

    print("=== beds ===")
    for f in ("ambient-bed.wav", "sfx-cues.wav", "music-bed.wav"):
        p = os.path.join(AUD, f)
        if not os.path.exists(p):
            ok = False
            print(f"  FAIL missing: {f}")
            continue
        info = probe(p)
        a, sr = read_wav(p)
        peak = float(np.max(np.abs(a)))
        rms = float(np.sqrt(np.mean(a ** 2)))
        dur_ok = abs(info["dur"] - total_s) < 0.02
        if not dur_ok or peak < 1e-4:
            ok = False
        print(f"  {'ok  ' if dur_ok and peak > 1e-4 else 'FAIL'} {f:16} "
              f"{info['dur']:7.3f}s (want {total_s:.3f}) {info['ch']}ch "
              f"peak {peak:.2f} rms {20*np.log10(rms+1e-12):6.1f} dBFS")

    p = os.path.join(ROOT, "public/vo/voiceover-longform-sonodyne.wav")
    info = probe(p)
    dur_ok = abs(info["dur"] - total_s) < 0.02
    if not dur_ok:
        ok = False
    print(f"  {'ok  ' if dur_ok else 'FAIL'} vo placeholder  {info['dur']:7.3f}s (silent, ready for VO)")

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

    print(f"\n=== ambient bed continuity (298s, 0.5s blocks) ===")
    amb, sr = read_wav(os.path.join(AUD, "ambient-bed.wav"))
    m = np.abs(amb.mean(axis=1))
    block = sr // 2
    n_blocks = len(m) // block
    quiet = [i for i in range(1, n_blocks - 1)
             if float(np.max(m[i * block:(i + 1) * block])) < 1e-4]
    if quiet:
        ok = False
        print(f"  FAIL silent blocks at: {quiet[:12]} (of {n_blocks} total)")
    else:
        print(f"  ok   bed is continuous end to end across {n_blocks} blocks, no silent gap")

    # chapter boundary spot-check: at least one non-silent moment per chapter
    print("\n=== per-chapter audio presence ===")
    for ch in tl["chapters"]:
        s = int(round(ch["from"] / fps * sr))
        e = int(round((ch["from"] + ch["dur"]) / fps * sr))
        seg_amb = amb[s:e].mean(axis=1)
        peak = float(np.max(np.abs(seg_amb))) if len(seg_amb) else 0
        flag = "ok  " if peak > 1e-4 else "FAIL"
        if peak <= 1e-4:
            ok = False
        print(f"  {flag} {ch['id']:12} frames {ch['from']:5d}-{ch['from']+ch['dur']:5d}  ambient peak {peak:.3f}")

    print("\n" + ("PASS - long-form audio pipeline validated." if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
