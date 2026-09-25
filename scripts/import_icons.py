#!/usr/bin/env python3
"""Vendor professional line icons (Lucide, Tabler) into the library.

  python3 scripts/import_icons.py add SRC_DIR lucide:key tabler:lungs ...
      copy the named SVGs (and each set's licence) into library/vendor/
  python3 scripts/import_icons.py build
      convert every vendored SVG into library/vendor.ts

Both sets are drawn on a 24-unit grid with a 2px round stroke. We keep their
geometry but not their weight: every element becomes an absolute-coordinate
path on our 1080 canvas, drawn on with the house hairline and glow. Anything
that is really a dot (zero-length "h.01" paths, tiny circles, filled marks)
becomes a real dot, because a hairline dot would vanish.
"""
import math
import os
import re
import shutil
import sys
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VENDOR = os.path.join(ROOT, "src/Anim/library/vendor")
OUT = os.path.join(ROOT, "src/Anim/library/vendor.ts")

S = 18.0  # canvas units per grid unit: the 24 grid spans 432 around 540
DOT_EXTENT = 0.6  # grid units; smaller than this and it is a dot, not a line
# A lone straight stroke this short is an eye or a mark: at 2px it reads as a
# pill, at our hairline it would read as a tick, so it becomes a dot too.
TICK = 1.7
DOT_R = 9.0  # canvas units, matches the dots drawn by hand elsewhere

NUM = re.compile(r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?")
SETS = {
    "lucide": ("lucide-static", "icons/{}.svg", "LICENSE"),
    "tabler": ("tabler-icons", "icons/outline/{}.svg", "LICENSE"),
}


def X(x):
    return 540 + (x - 12) * S


def fmt(v):
    return f"{round(v, 2):g}"


class Scan:
    def __init__(self, d):
        self.d, self.i = d, 0

    def ws(self):
        while self.i < len(self.d) and self.d[self.i] in " ,\t\n\r":
            self.i += 1

    def cmd(self):
        self.ws()
        if self.i < len(self.d) and self.d[self.i].isalpha():
            self.i += 1
            return self.d[self.i - 1]
        return None

    def more(self):
        self.ws()
        return self.i < len(self.d) and not self.d[self.i].isalpha()

    def num(self):
        self.ws()
        m = NUM.match(self.d, self.i)
        self.i = m.end()
        return float(m.group())

    def flag(self):
        self.ws()
        self.i += 1
        return int(self.d[self.i - 1])


def arc_points(x1, y1, rx, ry, phi, fa, fs, x2, y2, n=16):
    """Sample an SVG arc (spec F.6.5) — used only to measure length."""
    if rx == 0 or ry == 0:
        return [(x2, y2)]
    c, s = math.cos(math.radians(phi)), math.sin(math.radians(phi))
    dx, dy = (x1 - x2) / 2, (y1 - y2) / 2
    xp, yp = c * dx + s * dy, -s * dx + c * dy
    rx, ry = abs(rx), abs(ry)
    lam = xp * xp / (rx * rx) + yp * yp / (ry * ry)
    if lam > 1:
        rx, ry = rx * math.sqrt(lam), ry * math.sqrt(lam)
    num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp
    den = rx * rx * yp * yp + ry * ry * xp * xp
    k = math.sqrt(max(0, num / den)) * (-1 if fa == fs else 1)
    cxp, cyp = k * rx * yp / ry, -k * ry * xp / rx
    cx = c * cxp - s * cyp + (x1 + x2) / 2
    cy = s * cxp + c * cyp + (y1 + y2) / 2

    def ang(ux, uy, vx, vy):
        a = math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
        return a

    t1 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry)
    dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry)
    if not fs and dt > 0:
        dt -= 2 * math.pi
    elif fs and dt < 0:
        dt += 2 * math.pi
    pts = []
    for i in range(1, n + 1):
        t = t1 + dt * i / n
        px, py = rx * math.cos(t), ry * math.sin(t)
        pts.append((c * px - s * py + cx, s * px + c * py + cy))
    return pts


def bez(p0, p1, p2, p3, n=12):
    out = []
    for i in range(1, n + 1):
        t = i / n
        u = 1 - t
        out.append((u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
                    u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]))
    return out


def path_to_abs(d):
    """Returns (canvas path string, sampled grid points) for an SVG path."""
    sc = Scan(d)
    out, pts = [], []
    cx = cy = sx = sy = 0.0
    last_c = last_q = None
    cmd = None
    while True:
        c = sc.cmd()
        if c is None:
            if not sc.more():
                break
            c = cmd if cmd not in ("M", "m") else ("L" if cmd == "M" else "l")
        cmd = c
        rel = c.islower()
        C = c.upper()
        if C == "Z":
            out.append("Z")
            pts.append((sx, sy))
            cx, cy = sx, sy
            last_c = last_q = None
            continue
        first = True
        while first or sc.more():
            first = False
            ox, oy = (cx, cy) if rel else (0.0, 0.0)
            if C == "M":
                cx, cy = sc.num() + ox, sc.num() + oy
                sx, sy = cx, cy
                out.append(f"M {fmt(X(cx))} {fmt(X(cy))}")
                pts.append((cx, cy))
                C = "L"  # implicit lineto after the first pair
                last_c = last_q = None
            elif C in ("L", "H", "V"):
                if C == "L":
                    nx, ny = sc.num() + ox, sc.num() + oy
                elif C == "H":
                    nx, ny = sc.num() + (cx if rel else 0), cy
                else:
                    nx, ny = cx, sc.num() + (cy if rel else 0)
                cx, cy = nx, ny
                out.append(f"L {fmt(X(cx))} {fmt(X(cy))}")
                pts.append((cx, cy))
                last_c = last_q = None
            elif C in ("C", "S"):
                if C == "C":
                    x1, y1 = sc.num() + ox, sc.num() + oy
                else:
                    x1, y1 = (2 * cx - last_c[0], 2 * cy - last_c[1]) if last_c else (cx, cy)
                x2, y2 = sc.num() + ox, sc.num() + oy
                nx, ny = sc.num() + ox, sc.num() + oy
                pts += bez((cx, cy), (x1, y1), (x2, y2), (nx, ny))
                out.append(f"C {fmt(X(x1))} {fmt(X(y1))} {fmt(X(x2))} {fmt(X(y2))} {fmt(X(nx))} {fmt(X(ny))}")
                last_c, last_q = (x2, y2), None
                cx, cy = nx, ny
            elif C in ("Q", "T"):
                if C == "Q":
                    x1, y1 = sc.num() + ox, sc.num() + oy
                else:
                    x1, y1 = (2 * cx - last_q[0], 2 * cy - last_q[1]) if last_q else (cx, cy)
                nx, ny = sc.num() + ox, sc.num() + oy
                c1 = (cx + 2 / 3 * (x1 - cx), cy + 2 / 3 * (y1 - cy))
                c2 = (nx + 2 / 3 * (x1 - nx), ny + 2 / 3 * (y1 - ny))
                pts += bez((cx, cy), c1, c2, (nx, ny))
                out.append(f"Q {fmt(X(x1))} {fmt(X(y1))} {fmt(X(nx))} {fmt(X(ny))}")
                last_q, last_c = (x1, y1), None
                cx, cy = nx, ny
            elif C == "A":
                rx, ry, phi = sc.num(), sc.num(), sc.num()
                fa, fs = sc.flag(), sc.flag()
                nx, ny = sc.num() + ox, sc.num() + oy
                pts += arc_points(cx, cy, rx, ry, phi, fa, fs, nx, ny)
                out.append(f"A {fmt(rx * S)} {fmt(ry * S)} {fmt(phi)} {fa} {fs} {fmt(X(nx))} {fmt(X(ny))}")
                cx, cy = nx, ny
                last_c = last_q = None
            else:
                raise ValueError(f"unsupported path command {c} in {d}")
    return " ".join(out), pts


def circle_path(cx, cy, rx, ry=None):
    ry = rx if ry is None else ry
    return (f"M {cx - rx} {cy} A {rx} {ry} 0 1 0 {cx + rx} {cy} "
            f"A {rx} {ry} 0 1 0 {cx - rx} {cy}")


def rect_path(x, y, w, h, rx, ry):
    rx = min(rx, w / 2)
    ry = min(ry, h / 2)
    if rx <= 0 or ry <= 0:
        return f"M {x} {y} h {w} v {h} h {-w} Z"
    return (f"M {x + rx} {y} h {w - 2 * rx} a {rx} {ry} 0 0 1 {rx} {ry} v {h - 2 * ry} "
            f"a {rx} {ry} 0 0 1 {-rx} {ry} h {-(w - 2 * rx)} a {rx} {ry} 0 0 1 {-rx} {-ry} "
            f"v {-(h - 2 * ry)} a {rx} {ry} 0 0 1 {rx} {-ry} Z")


def f(el, k, default=0.0):
    v = el.get(k)
    return float(v) if v is not None else default


def convert(svg_file):
    root = ET.parse(svg_file).getroot()
    paths, lens, dots = [], [], []
    for el in root.iter():
        tag = el.tag.split("}")[-1]
        if tag in ("svg", "g", "title", "desc", "defs"):
            continue
        if el.get("stroke") == "none":
            continue
        filled = el.get("fill") not in (None, "none")
        if tag == "path":
            d = el.get("d")
        elif tag == "circle":
            r = f(el, "r")
            d = circle_path(f(el, "cx"), f(el, "cy"), r)
        elif tag == "ellipse":
            d = circle_path(f(el, "cx"), f(el, "cy"), f(el, "rx"), f(el, "ry"))
        elif tag == "rect":
            rx = f(el, "rx", f(el, "ry", 0))
            ry = f(el, "ry", rx)
            d = rect_path(f(el, "x"), f(el, "y"), f(el, "width"), f(el, "height"), rx, ry)
        elif tag == "line":
            d = f"M {f(el, 'x1')} {f(el, 'y1')} L {f(el, 'x2')} {f(el, 'y2')}"
        elif tag in ("polyline", "polygon"):
            nums = [float(v) for v in NUM.findall(el.get("points", ""))]
            pairs = list(zip(nums[0::2], nums[1::2]))
            d = "M " + " L ".join(f"{a} {b}" for a, b in pairs) + (" Z" if tag == "polygon" else "")
        else:
            continue
        canvas, pts = path_to_abs(d)
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        extent = max(max(xs) - min(xs), max(ys) - min(ys))
        straight = canvas.count(" L ") == 1 and not re.search(r"[CQA] ", canvas)
        # Only axis-aligned ticks: short diagonals are rays and rungs, not eyes.
        axis = min(max(xs) - min(xs), max(ys) - min(ys)) < 0.05
        if extent < DOT_EXTENT or (filled and extent < 3) or (straight and axis and extent <= TICK):
            dots.append((X((max(xs) + min(xs)) / 2), X((max(ys) + min(ys)) / 2)))
            continue
        length = sum(math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)) * S
        paths.append(canvas)
        lens.append(round(length))
    return paths, lens, dots


def build():
    entries = []
    for set_name in sorted(os.listdir(VENDOR)):
        folder = os.path.join(VENDOR, set_name)
        if not os.path.isdir(folder):
            continue
        for fn in sorted(os.listdir(folder)):
            if not fn.endswith(".svg"):
                continue
            key = f"{set_name}/{fn[:-4]}"
            paths, lens, dots = convert(os.path.join(folder, fn))
            # Silhouette first, details after: the draw-on reads as sketching.
            order = sorted(range(len(paths)), key=lambda i: -lens[i])
            entries.append((key, [paths[i] for i in order], [lens[i] for i in order], dots))
    lines = [
        "/**",
        " * Written by scripts/import_icons.py build — regenerate rather than edit.",
        " * Geometry from Lucide (ISC) and Tabler Icons (MIT); licences in vendor/.",
        " */",
        "export type VendorGlyph = {",
        "  readonly paths: readonly string[];",
        "  /** Approximate drawn length of each path, for pacing the draw-on. */",
        "  readonly lens: readonly number[];",
        "  readonly dots: readonly (readonly [number, number])[];",
        "};",
        "",
        "export const VENDOR: Record<string, VendorGlyph> = {",
    ]
    for key, paths, lens, dots in entries:
        lines.append(f'  "{key}": {{')
        lines.append("    paths: [")
        for p in paths:
            lines.append(f'      "{p}",')
        lines.append("    ],")
        lines.append(f"    lens: [{', '.join(str(v) for v in lens)}],")
        lines.append(f"    dots: [{', '.join(f'[{fmt(x)}, {fmt(y)}]' for x, y in dots)}],")
        lines.append("  },")
    lines.append("};")
    open(OUT, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(entries)} glyphs -> {os.path.relpath(OUT, ROOT)}")


def add(src_dir, names):
    for spec in names:
        set_name, icon = spec.split(":", 1)
        pkg, pattern, lic = SETS[set_name]
        base = next(os.path.join(src_dir, d, "package") for d in sorted(os.listdir(src_dir))
                    if d.startswith(pkg) and os.path.isdir(os.path.join(src_dir, d)))
        dst = os.path.join(VENDOR, set_name)
        os.makedirs(dst, exist_ok=True)
        shutil.copy(os.path.join(base, pattern.format(icon)), os.path.join(dst, f"{icon}.svg"))
        lic_dst = os.path.join(dst, "LICENSE")
        if not os.path.exists(lic_dst) and os.path.exists(os.path.join(base, lic)):
            shutil.copy(os.path.join(base, lic), lic_dst)
    print(f"added {len(names)}")


if __name__ == "__main__":
    if sys.argv[1] == "add":
        add(sys.argv[2], sys.argv[3:])
    else:
        build()
