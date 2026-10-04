#!/usr/bin/env python3
"""Stage gate: compare a fresh capture set against the committed baseline.

    OUT_DIR=./after node baseline/shoot.mjs
    python3 baseline/compare.py ./after

Exits 0 if every capture is within its calibrated noise floor, 1 otherwise.
Writes a diff PNG into <dir>/_diff/ for anything that fails.

The noise floor in noise-floor.json was measured over four consecutive runs of
an unchanged site. 20 of the 21 captures are byte-identical run to run; only
index-1440 moves, by at most 0.3348% of pixels, because .hx-ind__d transitions
to a fractional `max-height: 9em` under `overflow: hidden`. That goes away at
Stage 10. Any difference above the floor is a real change.
"""
import json, os, sys
from PIL import Image, ImageChops

BASE  = os.path.dirname(os.path.abspath(__file__))
OTHER = sys.argv[1] if len(sys.argv) > 1 else "./after"
FLOOR = json.load(open(os.path.join(BASE, "noise-floor.json")))["measured_pct"]
MIN_TOLERANCE = 0.01   # percent — anything under this is rounding, not a change
HEADROOM      = 1.5    # the floor is a 4-run sample, so allow half again

def bands(diff, height, width):
    """contiguous y-ranges that contain any differing pixel"""
    px, rows = diff.load(), []
    for y in range(height):
        if any(px[x, y] != (0, 0, 0) for x in range(0, width, 3)):
            rows.append(y)
    if not rows:
        return []
    out, start, prev = [], rows[0], rows[0]
    for y in rows[1:]:
        if y > prev + 15:
            out.append((start, prev)); start = y
        prev = y
    out.append((start, prev))
    return out

names = sorted(f for f in os.listdir(BASE) if f.endswith(".png"))
fails, checked = [], 0

for n in names:
    a_path, b_path = os.path.join(BASE, n), os.path.join(OTHER, n)
    if not os.path.exists(b_path):
        fails.append((n, "missing from the new capture set")); continue
    a = Image.open(a_path).convert("RGB")
    b = Image.open(b_path).convert("RGB")
    checked += 1
    if a.size != b.size:
        fails.append((n, f"size changed {a.size[0]}x{a.size[1]} -> {b.size[0]}x{b.size[1]}"))
        continue
    d = ImageChops.difference(a, b)
    if d.getbbox() is None:
        print(f"  ok        {n:24s} identical"); continue
    count = sum(1 for p in d.getdata() if p != (0, 0, 0))
    pct   = 100 * count / (a.size[0] * a.size[1])
    tol   = max(FLOOR.get(n, 0.0) * HEADROOM, MIN_TOLERANCE)
    if pct <= tol:
        print(f"  ok        {n:24s} {pct:.4f}% (floor {tol:.4f}%)")
    else:
        os.makedirs(os.path.join(OTHER, "_diff"), exist_ok=True)
        d.save(os.path.join(OTHER, "_diff", n))
        bs = bands(d, a.size[1], a.size[0])
        fails.append((n, f"{pct:.4f}% of pixels differ (floor {tol:.4f}%), "
                         f"{len(bs)} band(s): " +
                         ", ".join(f"y{y0}-{y1}" for y0, y1 in bs[:6]) +
                         (" ..." if len(bs) > 6 else "")))

print()
if fails:
    print(f"FAIL — {len(fails)} of {len(names)} captures changed:")
    for n, why in fails:
        print(f"  {n}: {why}")
    print(f"\nDiff images in {os.path.join(OTHER, '_diff')}")
    sys.exit(1)
print(f"PASS — {checked} captures within the baseline noise floor.")
