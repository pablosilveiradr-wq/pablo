#!/usr/bin/env python3
"""Icon library tooling.

  python3 scripts/library.py fit              measure every drawn icon, write fit.ts
  python3 scripts/library.py sheets OUT_DIR   numbered approval sheets, 25 per page
  python3 scripts/library.py list             print the catalog with status

Fit renders each icon unfitted, finds the bounding box of its ink, and solves
the scale and offset that land it centred at a shared optical size. That is
what keeps 200 hand-authored icons consistent without eyeballing each one.
"""
import json
import math
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "src/Anim/library/catalog.ts")
FIT_TS = os.path.join(ROOT, "src/Anim/library/fit.ts")
BROWSER = os.environ.get(
    "REMOTION_BROWSER",
    "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
)

SHEET_W = 2000
COLS = 5
CELL = SHEET_W // COLS
# Measuring wants more pixels per icon than an approval sheet does.
FIT_COLS = 4
FIT_CELL = SHEET_W // FIT_COLS
FIT_CHUNK = 40
# Canvas scales icons by ICON_SCALE (1.28) times the sheet's 0.88 about 540.
K = 1.28 * 0.88
INK = 24  # measured with the glow off, so any ink at all counts

# Target size in canvas units. A square icon spans T_AREA; long thin ones
# may stretch to T_MAX along their long side so they don't read tiny.
T_AREA = 390.0
T_MAX = 500.0
S_MIN, S_MAX = 0.62, 1.35  # past this, stroke weight visibly drifts


def entries():
    src = open(CATALOG, encoding="utf-8").read()
    body = src[src.index("export const CATALOG"):]
    out = []
    for m in re.finditer(r'e\(\s*"([^"]+)",\s*"([^"]+)"(?:,\s*([\w.]+))?\s*,?\s*\)', body):
        out.append({"n": len(out) + 1, "id": m.group(1), "name": m.group(2), "drawn": bool(m.group(3))})
    return out


def bundle():
    subprocess.run(["npx", "remotion", "bundle"], cwd=ROOT, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def still(items, out_png, raw, cols=COLS):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump({"items": items, "cols": cols, "raw": raw}, f)
        props = f.name
    subprocess.run(
        ["npx", "remotion", "still", "build", "LibrarySheet", out_png,
         f"--props={props}", "--frame=200", f"--browser-executable={BROWSER}"],
        cwd=ROOT, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    os.unlink(props)


def pixels(png):
    w, h = (int(v) for v in subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height", "-of", "csv=p=0", png]).decode().strip().split(","))
    raw = subprocess.check_output(
        ["ffmpeg", "-loglevel", "error", "-i", png, "-f", "rawvideo", "-pix_fmt", "gray", "-"])
    return w, h, raw


def to_canvas(px):
    v = px * 1080.0 / FIT_CELL
    return 540.0 + (v - 540.0) / K


def fit():
    todo = [e for e in entries() if e["drawn"]]
    bundle()
    fits = {}
    for start in range(0, len(todo), FIT_CHUNK):
        chunk = todo[start:start + FIT_CHUNK]
        png = os.path.join(tempfile.gettempdir(), f"libfit_{start}.png")
        still([{"id": e["id"], "label": ""} for e in chunk], png, raw=True, cols=FIT_COLS)
        w, _, g = pixels(png)
        for i, e in enumerate(chunk):
            ox, oy = (i % FIT_COLS) * FIT_CELL, (i // FIT_COLS) * FIT_CELL
            xs, ys = [], []
            for y in range(oy, oy + FIT_CELL):
                row = g[y * w + ox: y * w + ox + FIT_CELL]
                hit = [x for x, v in enumerate(row) if v > INK]
                if hit:
                    xs += (hit[0], hit[-1])
                    ys.append(y - oy)
            if not xs:
                print(f"  ! {e['id']}: nothing drawn at frame 200")
                continue
            x0, x1 = to_canvas(min(xs)), to_canvas(max(xs))
            y0, y1 = to_canvas(min(ys)), to_canvas(max(ys))
            bw, bh = max(x1 - x0, 1), max(y1 - y0, 1)
            s = min(T_MAX / max(bw, bh), T_AREA / math.sqrt(bw * bh))
            s = max(S_MIN, min(S_MAX, s))
            cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
            fits[e["id"]] = {"s": round(s, 3), "dx": round(-s * (cx - 540), 1),
                             "dy": round(-s * (cy - 540), 1)}
        os.unlink(png)
    lines = ["/** Written by scripts/library.py fit — regenerate rather than edit. */",
             "export const FIT: Record<string, { s: number; dx: number; dy: number }> = {"]
    for k, v in fits.items():
        lines.append(f'  "{k}": {{ s: {v["s"]}, dx: {v["dx"]}, dy: {v["dy"]} }},')
    lines.append("};")
    open(FIT_TS, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"fit {len(fits)} icons -> {os.path.relpath(FIT_TS, ROOT)}")


def sheets(out_dir, only=None):
    os.makedirs(out_dir, exist_ok=True)
    todo = [e for e in entries() if e["drawn"] and (only is None or e["n"] in only)]
    bundle()
    paths = []
    for page, start in enumerate(range(0, len(todo), 25), 1):
        chunk = todo[start:start + 25]
        png = os.path.join(out_dir, f"libreria_{page:02d}_{chunk[0]['n']:03d}-{chunk[-1]['n']:03d}.png")
        still([{"id": e["id"], "label": f"{e['n']:03d} {e['name']}"} for e in chunk], png, raw=False)
        paths.append(png)
        print(png)
    return paths


def listing():
    for e in entries():
        print(f"{e['n']:03d} {'✓' if e['drawn'] else '·'} {e['id']:28s} {e['name']}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "list"
    if cmd == "fit":
        fit()
    elif cmd == "sheets":
        only = None
        if len(sys.argv) > 3:
            a, b = (int(x) for x in sys.argv[3].split("-"))
            only = set(range(a, b + 1))
        sheets(sys.argv[2], only)
    else:
        listing()
