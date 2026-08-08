#!/usr/bin/env python3
"""Package a downloadable, self-contained project zip.

Includes everything needed for `npm install && npm run render` (or
`npm run render:lf`) to reproduce either render independently, excluding
node_modules, git internals, and already-rendered output (which ships
separately once verified). Run BEFORE attempting the full long-form render,
per Section 11 checkpoint 9.
"""
import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "out", "sonodyne-project-src.zip")

EXCLUDE_DIRS = {
    "node_modules", ".git", "build", "out", "qa", "qa-lf",
    "__pycache__", ".remotion",
}
EXCLUDE_FILES = {".DS_Store"}
EXCLUDE_EXT = {".zip"}


def should_skip_dir(name):
    return name in EXCLUDE_DIRS


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    n = 0
    total_bytes = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for dirpath, dirnames, filenames in os.walk(ROOT):
            dirnames[:] = [d for d in dirnames if not should_skip_dir(d)]
            for f in filenames:
                if f in EXCLUDE_FILES or os.path.splitext(f)[1] in EXCLUDE_EXT:
                    continue
                full = os.path.join(dirpath, f)
                rel = os.path.relpath(full, ROOT)
                z.write(full, rel)
                n += 1
                total_bytes += os.path.getsize(full)

    size = os.path.getsize(OUT)
    print(f"wrote {OUT}")
    print(f"  {n} files, {total_bytes/1e6:.1f} MB uncompressed -> {size/1e6:.1f} MB zipped")


if __name__ == "__main__":
    main()
