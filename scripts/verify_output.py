#!/usr/bin/env python3
"""Checkpoint 9: verify the delivered MP4 directly.

Checks the real container, not the render log: duration to the frame, resolution,
fps, that both streams exist, and that the audio actually contains signal for the
whole runtime rather than being a silent track.
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MP4 = os.path.join(ROOT, "out", "sonodyne-reel-88s.mp4")


def probe(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path],
        capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def main():
    tl = json.load(open(os.path.join(ROOT, "src/data/timeline.json")))
    want_frames = tl["durationInFrames"]
    want_fps = tl["fps"]
    want_s = want_frames / want_fps
    ok = True

    if not os.path.exists(MP4):
        print(f"FAIL - {MP4} does not exist")
        return 1

    size = os.path.getsize(MP4)
    j = probe(MP4)
    v = next((s for s in j["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)

    print(f"file      : {os.path.relpath(MP4, ROOT)}  ({size / 1e6:.1f} MB)")
    if v is None:
        ok = False
        print("FAIL - no video stream")
    else:
        num, den = (int(x) for x in v["r_frame_rate"].split("/"))
        fps = num / den
        nb = int(v.get("nb_frames", 0))
        dur = float(v.get("duration", j["format"]["duration"]))
        print(f"video     : {v['codec_name']} {v['width']}x{v['height']} "
              f"{fps:g}fps  {nb} frames  {dur:.3f}s  pix_fmt {v.get('pix_fmt')}")
        if (v["width"], v["height"]) != (tl["width"], tl["height"]):
            ok = False
            print(f"FAIL - resolution is not {tl['width']}x{tl['height']}")
        if abs(fps - want_fps) > 0.01:
            ok = False
            print(f"FAIL - fps is not {want_fps}")
        if nb and abs(nb - want_frames) > 2:
            ok = False
            print(f"FAIL - {nb} frames, wanted {want_frames} (+/- 2)")
        if abs(dur - want_s) > 0.08:
            ok = False
            print(f"FAIL - duration {dur:.3f}s, wanted {want_s:.3f}s")

    if a is None:
        ok = False
        print("FAIL - no audio stream")
    else:
        print(f"audio     : {a['codec_name']} {a['sample_rate']}Hz "
              f"{a['channels']}ch  {float(a.get('duration', 0)):.3f}s")

    # decode the audio and prove it is not silent anywhere
    wav = "/tmp/_verify_out.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", MP4, "-map", "0:a",
                    "-f", "wav", wav], check=True)
    with wave.open(wav) as w:
        n, ch, sr = w.getnframes(), w.getnchannels(), w.getframerate()
        buf = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float32)
    m = buf.reshape(-1, ch).mean(axis=1) / 32768.0
    peak = float(np.abs(m).max())
    rms = 20 * np.log10(float(np.sqrt((m ** 2).mean())) + 1e-12)
    blk = sr // 2
    quiet = [i for i in range(n // blk)
             if float(np.abs(m[i * blk:(i + 1) * blk]).max()) < 1e-4]
    print(f"audio sig : peak {peak:.3f}  rms {rms:.1f} dBFS  "
          f"{n / sr:.3f}s  silent 0.5s blocks: {len(quiet)}")
    if peak < 0.05:
        ok = False
        print("FAIL - audio track is effectively silent")
    if quiet:
        ok = False
        print(f"FAIL - silent gaps at blocks {quiet[:10]}")
    if peak > 0.999:
        print("note - audio touches full scale (clipping risk)")

    print("\n" + ("PASS - output verified." if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
