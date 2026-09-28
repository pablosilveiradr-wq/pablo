#!/usr/bin/env python3
"""Body-part icons for marking where an exercise goes.

  python3 scripts/body_icons.py      write the SVGs and src/Anim/body/pictos-data.ts

Each icon is drawn on the same 24 grid as the Lucide/Tabler glyphs, from
circles, half circles, capsules, rounded boxes and straight lines only: no
faces, mitten hands. Every entry names the landmarks a touch point can go
on, in grid units. The SVGs land in the house icon set, so
`import_icons.py build` turns them into drawable glyphs like any other.
"""
import json
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_SVG = os.path.join(ROOT, "src/Anim/library/vendor/house")
OUT_TS = os.path.join(ROOT, "src/Anim/body/pictos-data.ts")


def n(v):
    return f"{round(v, 2):g}"


def c(cx, cy, r):
    return f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" />'


def p(d):
    return f'<path d="{d}" />'


def ln(x1, y1, x2, y2):
    return p(f"M{n(x1)} {n(y1)}L{n(x2)} {n(y2)}")


def half(cx, cy, r, side):
    if side == "left":
        return p(f"M{n(cx)} {n(cy - r)}A{n(r)} {n(r)} 0 0 0 {n(cx)} {n(cy + r)}")
    if side == "right":
        return p(f"M{n(cx)} {n(cy - r)}A{n(r)} {n(r)} 0 0 1 {n(cx)} {n(cy + r)}")
    if side == "up":
        return p(f"M{n(cx - r)} {n(cy)}A{n(r)} {n(r)} 0 0 1 {n(cx + r)} {n(cy)}")
    return p(f"M{n(cx - r)} {n(cy)}A{n(r)} {n(r)} 0 0 0 {n(cx + r)} {n(cy)}")


def arc(x1, y1, x2, y2, r, sweep=1, large=0):
    return p(f"M{n(x1)} {n(y1)}A{n(r)} {n(r)} 0 {large} {sweep} {n(x2)} {n(y2)}")


def rr(x, y, w, h, r):
    return f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}" rx="{n(r)}" />'


def _rot(x, y, cx, cy, deg):
    a = math.radians(deg)
    return (cx + (x - cx) * math.cos(a) - (y - cy) * math.sin(a),
            cy + (x - cx) * math.sin(a) + (y - cy) * math.cos(a))


def cap(cx, cy, w, h, deg=0):
    """Closed capsule, long axis vertical, turned `deg` clockwise."""
    r = w / 2
    top, bot = cy - h / 2 + r, cy + h / 2 - r
    q = lambda x, y: "{} {}".format(*(n(v) for v in _rot(x, y, cx, cy, deg)))
    return p(f"M{q(cx - r, top)}A{n(r)} {n(r)} 0 0 1 {q(cx + r, top)}L{q(cx + r, bot)}"
             f"A{n(r)} {n(r)} 0 0 1 {q(cx - r, bot)}Z")


def mitten(cx, top, bottom, w=7, thumb="right", tl=5.0):
    """Hand without fingers: a round-topped block open at the wrist, plus a
    thumb capsule leaning out on one side."""
    r = w / 2
    s = 1 if thumb == "right" else -1
    block = p(f"M{n(cx - r)} {n(bottom)}V{n(top + r)}A{n(r)} {n(r)} 0 0 1 {n(cx + r)} {n(top + r)}V{n(bottom)}")
    h = bottom - top
    tcx, tcy = cx + s * (r + 1.9), top + 0.5 * h
    return [block, cap(tcx, tcy, 2.6, tl, s * 32)]


def ring(cx, cy, r, gaps=()):
    """Circle with gaps where something sits in front of it. Gaps are
    (from, to) angles in degrees, 0 = right, 90 = down, going clockwise."""
    if not gaps:
        return c(cx, cy, r)
    spans, a = [], None
    gaps = sorted(((g0 % 360, g1 % 360) if g0 % 360 < g1 % 360 else (g0 % 360, g1 % 360 + 360)) for g0, g1 in gaps)
    start = gaps[0][1]
    ends = [g[0] for g in gaps[1:]] + [gaps[0][0] + 360]
    starts = [g[1] for g in gaps]
    out = []
    for s0, e0 in zip(starts, ends):
        pt = lambda d: (cx + r * math.cos(math.radians(d)), cy + r * math.sin(math.radians(d)))
        (x0, y0), (x1, y1) = pt(s0), pt(e0)
        out.append(p(f"M{n(x0)} {n(y0)}A{n(r)} {n(r)} 0 {1 if e0 - s0 > 180 else 0} 1 {n(x1)} {n(y1)}"))
    return out


def flat(*xs):
    out = []
    for x in xs:
        out.extend(x if isinstance(x, list) else [x])
    return out


# ── the catalogue ────────────────────────────────────────────────────────
# (category, id, name, [svg elements], {landmark: (x, y)})
E = []


def add(cat, id_, name, els, pts):
    E.append((cat, id_, name, flat(*els), pts))


def ears(cy, r, x0, x1, er=1.3):
    return [half(x0, cy, er, "left"), half(x1, cy, er, "right")]


SHOULDERS = p("M4 22.5a8 7 0 0 1 16 0")
NECK = [ln(10.2, 13.6, 10.2, 15.4), ln(13.8, 13.6, 13.8, 15.4)]

H = "Cabeza y cuello"
add(H, "cabeza-frente", "Cabeza de frente", [c(12, 8.5, 5), *ears(8.5, 5, 7, 17), *NECK, SHOULDERS],
    {"coronilla": (12, 3.8), "frente": (12, 5.6), "entrecejo": (12, 7.6), "sien-izquierda": (8, 7.6), "sien-derecha": (16, 7.6),
     "mejilla-derecha": (14.6, 9.6), "debajo-nariz": (12, 10.4), "menton": (12, 12.6), "mandibula-derecha": (15.6, 11.2),
     "delante-oreja-derecha": (16.4, 8.8), "cuello-derecho": (13.8, 14.4), "clavicula-derecha": (15, 17.2), "pecho": (12, 19)})
add(H, "cara", "Cara (primer plano)", [c(12, 12, 8.5), *ears(12, 8.5, 3.5, 20.5, 1.8)],
    {"coronilla": (12, 4), "frente": (12, 6.6), "entrecejo": (12, 9.6), "sien-izquierda": (5.6, 9.4), "sien-derecha": (18.4, 9.4),
     "debajo-ojo-izquierdo": (9, 12.2), "debajo-ojo-derecho": (15, 12.2), "pomulo-derecho": (16.4, 13.4), "debajo-nariz": (12, 15),
     "menton": (12, 19), "mandibula-derecha": (17.2, 16.6), "delante-oreja-derecha": (19.4, 12)})
add(H, "cabeza-perfil", "Cabeza de perfil", [c(12, 8.5, 5.5), half(17.5, 9.2, 1.5, "right"), ln(8.4, 12.9, 8.4, 15.6), ln(12.2, 14, 12.2, 15.6),
    p("M3 22.5a7.5 7 0 0 1 15 0")],
    {"coronilla": (12, 3.2), "frente": (16.2, 5), "sien": (15, 7.4), "delante-oreja": (12.6, 9), "detras-oreja": (9.4, 9),
     "base-craneo": (8.6, 12.4), "nuca": (9.6, 14.6), "mandibula": (14.8, 12)})
add(H, "cabeza-atras", "Cabeza de atrás / nuca", [c(12, 8.5, 5), *ears(8.5, 5, 7, 17), *NECK, SHOULDERS, ln(12, 16.2, 12, 21.5)],
    {"coronilla": (12, 3.8), "base-craneo-izquierda": (10.4, 12.4), "base-craneo-derecha": (13.6, 12.4), "nuca": (12, 14.4),
     "trapecio-izquierdo": (7.6, 17.4), "trapecio-derecho": (16.4, 17.4), "entre-omoplatos": (12, 20.4)})
add(H, "coronilla", "Coronilla (desde arriba)", [c(12, 12.5, 7), half(12, 5.5, 1, "up"), half(5, 12.5, 1.4, "left"), half(19, 12.5, 1.4, "right")],
    {"coronilla": (12, 12.5), "frente": (12, 7.6), "nuca": (12, 17.6)})
add(H, "oreja", "Oreja", [p("M17 8.5a6.5 6.5 0 1 0-13 0c0 6 6 6 6 10a3.5 3.5 0 1 0 7 0"), p("M9 8.5a2.5 2.5 0 0 1 5 0v1a2 2 0 1 0 0 4")],
    {"lobulo": (13.5, 20.4), "punta-oreja": (10.5, 2.4), "borde-oreja": (4.2, 9), "concha": (11.6, 11.6), "fosa-triangular": (9.4, 6.4), "trago": (16.4, 12.6)})
add(H, "ojos", "Ojos y cejas", [p("M3 12q3.5-4 7 0q-3.5 4-7 0z"), p("M14 12q3.5-4 7 0q-3.5 4-7 0z"), c(6.5, 12, 1.2), c(17.5, 12, 1.2),
    arc(3, 8.4, 10, 8.4, 6), arc(14, 8.4, 21, 8.4, 6)],
    {"entrecejo": (12, 8.6), "ceja-izquierda": (6.5, 7.6), "ceja-derecha": (17.5, 7.6), "debajo-ojo-izquierdo": (6.5, 15.4),
     "debajo-ojo-derecho": (17.5, 15.4), "lagrimal-izquierdo": (10.6, 12.4), "lagrimal-derecho": (13.4, 12.4)})
add(H, "ojo-cerrado", "Ojo cerrado", [p("M3 11q9 7 18 0"), ln(6, 13.6, 5, 15.6), ln(12, 14.6, 12, 17), ln(18, 13.6, 19, 15.6)],
    {"parpado": (12, 13.6), "sien": (21.4, 10.6), "lagrimal": (3.6, 11.6)})
add(H, "nariz", "Nariz", [ln(10.5, 4, 10.5, 13), ln(13.5, 4, 13.5, 13), p("M10.5 13q-3.5 2-2.5 4.5q1 1.5 3 .8q1 .5 2 0q2 .7 3-.8q1-2.5-2.5-4.5")],
    {"punta-nariz": (12, 16.2), "costado-nariz-izquierdo": (8.4, 15.6), "costado-nariz-derecho": (15.6, 15.6), "puente": (12, 5.6), "debajo-nariz": (12, 19.4)})
add(H, "boca", "Boca / labios", [p("M3 12q4.5-5 9-3q4.5-2 9 3"), p("M3 12q9 9 18 0"), ln(3, 12, 21, 12)],
    {"comisura-izquierda": (3, 12), "comisura-derecha": (21, 12), "labio-superior": (12, 9.4), "debajo-labio": (12, 18.6)})
add(H, "cuello", "Cuello y clavículas", [p("M7 3q5 6 10 0"), ln(9.5, 5.4, 9.5, 12), ln(14.5, 5.4, 14.5, 12), p("M2 15q4-2.5 9-1.6"), p("M22 15q-4-2.5-9-1.6"), p("M2 21q10-7 20 0")],
    {"garganta": (12, 9), "hueco-clavicula": (12, 14), "debajo-clavicula-izquierda": (7, 16.6), "debajo-clavicula-derecha": (17, 16.6), "cuello-costado-derecho": (14.5, 8.6)})
add(H, "hombros-atras", "Hombros y trapecio (atrás)", [ln(10, 3, 10, 8), ln(14, 3, 14, 8), p("M10 8q-5 2-8 5v8"), p("M14 8q5 2 8 5v8"), ln(12, 9, 12, 21)],
    {"trapecio-izquierdo": (6.4, 10), "trapecio-derecho": (17.6, 10), "base-cuello": (12, 8.6), "entre-omoplatos": (12, 14.6), "hombro-derecho": (20.8, 13.6)})
add(H, "cabeza-inclinada", "Cabeza inclinada (estirar el cuello)", [c(14.4, 8, 5), ln(11.4, 12.4, 10.2, 15.6), ln(15.2, 13, 13.8, 15.8), SHOULDERS],
    {"cuello-costado-izquierdo": (10, 13.4), "trapecio-izquierdo": (7, 17.2), "sien-derecha": (18.4, 6.6)})
add(H, "mano-en-la-frente", "Mano en la frente", [ring(12, 12, 6.5, [(-128, -52)]), *ears(12, 6.5, 5.5, 18.5), ln(10, 18.4, 10, 21.5), ln(14, 18.4, 14, 21.5),
    cap(12, 6.6, 2.8, 10, 90)],
    {"frente": (12, 6.6), "entrecejo": (12, 9.4)})

T = "Torso"
TORSO = p("M9 3.5h6l4.5 2.5v7l-1 9.5h-13l-1-9.5v-7z")
add(T, "torso-frente", "Torso de frente", [TORSO, half(12, 3.5, 1.6, "down")],
    {"hueco-clavicula": (12, 5.8), "debajo-clavicula-derecha": (15.4, 7.2), "esternon": (12, 9.4), "boca-estomago": (12, 12.6),
     "ombligo": (12, 16.4), "bajo-vientre": (12, 19.6), "costado-derecho": (17.6, 13.4)})
add(T, "espalda", "Espalda", [TORSO, ln(12, 4.5, 12, 21.5)],
    {"entre-omoplatos": (12, 9), "omoplato-derecho": (15.4, 8.6), "media-espalda": (12, 13), "lumbar": (12, 17.8), "cintura-derecha": (16.4, 16.4)})
add(T, "pecho", "Pecho", [p("M3 5q9-3 18 0v14"), p("M3 5v14"), arc(5, 12, 11.2, 12, 4, 0), arc(12.8, 12, 19, 12, 4, 0), ln(12, 4, 12, 17)],
    {"esternon": (12, 10), "pecho-izquierdo": (8, 9.6), "pecho-derecho": (16, 9.6), "debajo-clavicula-derecha": (16, 5.8)})
add(T, "panza", "Panza / abdomen", [p("M4 3v8q0 6 3 10h10q3-4 3-10v-8"), c(12, 12, 0.9), p("M8 20q4 1.5 8 0")],
    {"ombligo": (12, 12), "boca-estomago": (12, 6), "bajo-vientre": (12, 16.4), "costado-derecho": (18.4, 9)})
add(T, "costillas", "Costillas", [TORSO, ln(12, 4.5, 12, 11), p("M12 7q-3 .5-5 2.5"), p("M12 7q3 .5 5 2.5"), p("M12 9.5q-3 .5-5 2.5"), p("M12 9.5q3 .5 5 2.5"),
    p("M12 12q-3 .5-5 2.5"), p("M12 12q3 .5 5 2.5")],
    {"esternon": (12, 8), "costillas-derechas": (16.4, 11.6), "costillas-izquierdas": (7.6, 11.6), "debajo-costillas": (12, 15.4)})
add(T, "columna", "Columna", [rr(10, 2.5, 4, 2.6, 1), rr(10, 6.3, 4, 2.6, 1), rr(10, 10.1, 4, 2.6, 1), rr(10, 13.9, 4, 2.6, 1), rr(10, 17.7, 4, 2.6, 1),
    ln(8, 3.8, 10, 3.8), ln(14, 3.8, 16, 3.8), ln(8, 7.6, 10, 7.6), ln(14, 7.6, 16, 7.6), ln(8, 11.4, 10, 11.4), ln(14, 11.4, 16, 11.4)],
    {"cervical": (12, 3.8), "dorsal": (12, 9.8), "lumbar": (12, 15.2), "sacro": (12, 19)})
add(T, "espalda-baja", "Espalda baja / lumbar", [p("M5 3v7q0 5-1 8"), p("M19 3v7q0 5 1 8"), p("M4 18q8 5 16 0"), ln(12, 3, 12, 17), c(9.5, 16, 0.6), c(14.5, 16, 0.6)],
    {"lumbar": (12, 10), "sacro": (12, 16.6), "rinon-derecho": (15.6, 7.6), "rinon-izquierdo": (8.4, 7.6), "cadera-derecha": (18, 14)})
add(T, "omoplatos", "Omóplatos", [p("M3 4q9-3 18 0v16"), p("M3 4v16"), ln(12, 3, 12, 20), p("M5.5 7h4.5l-2.5 7z"), p("M18.5 7h-4.5l2.5 7z")],
    {"entre-omoplatos": (12, 9.6), "omoplato-izquierdo": (7.6, 9), "omoplato-derecho": (16.4, 9), "debajo-omoplato": (12, 16.4)})
add(T, "clavicula", "Clavículas", [ln(9.5, 3, 9.5, 8), ln(14.5, 3, 14.5, 8), p("M2.5 11q4-2.5 8.5-1.6"), p("M21.5 11q-4-2.5-8.5-1.6"), c(12, 10.6, 1)],
    {"hueco-clavicula": (12, 10.6), "debajo-clavicula-izquierda": (6.6, 13), "debajo-clavicula-derecha": (17.4, 13), "clavicula-derecha": (17.4, 9.8)})
add(T, "cadera", "Cadera / pelvis", [p("M4 5q0 6 4 9l4 3l4-3q4-3 4-9"), p("M4 5q8 3 16 0"), c(8.5, 15, 1.4), c(15.5, 15, 1.4)],
    {"cadera-derecha": (18.4, 8), "cadera-izquierda": (5.6, 8), "centro-pelvis": (12, 11), "ingle-derecha": (15.5, 17.6)})
add(T, "diafragma", "Diafragma", [TORSO, p("M5.5 13q6.5-7 13 0")],
    {"diafragma": (12, 10.6), "boca-estomago": (12, 12.6), "costado-derecho": (17.6, 12.4)})
add(T, "estomago", "Estómago", [p("M9 3v4c-3 1-5 4-5 7.5a6 6 0 0 0 11 3.2c1.4-2.2 3.5-2 4-4.7c.4-2-1-3.5-3-3.5c-2 0-3 1.5-4 1.5c-1 0-1.5-1-1.5-2v-6")],
    {"estomago": (9.6, 14.6), "boca-estomago": (11, 9.4)})
add(T, "pulmones", "Pulmones", [p("M6.08 7.07c-2.08 2.43-3.08 5.93-3.08 10.43c0 2 .5 3 2 3c2 0 3-.5 5-1.5V10a3 3 0 0 0-3.92-2.93z"),
    p("M17.92 7.07c2.08 2.43 3.08 5.93 3.08 10.43c0 2-.5 3-2 3c-2 0-3-.5-5-1.5V10a3 3 0 0 1 3.92-2.93z"), ln(12, 3, 12, 11), p("M10 13l2-2l2 2")],
    {"pulmon-izquierdo": (7, 14), "pulmon-derecho": (17, 14), "centro-pecho": (12, 9)})
add(T, "corazon", "Corazón", [p("M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2c-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z")],
    {"corazon": (12, 11)})

A = "Brazos"
add(A, "brazo", "Brazo", [cap(12, 6.5, 4.4, 9), cap(12, 15.6, 3.8, 8), c(12, 21.4, 1.6)],
    {"hombro": (12, 2.6), "biceps": (12, 6.5), "codo": (12, 11.3), "antebrazo": (12, 15.6), "muneca": (12, 19.6)})
add(A, "brazo-doblado", "Brazo doblado", [cap(8, 8, 4.4, 11), cap(13.5, 15, 4, 11, 90), c(20.6, 15, 1.8)],
    {"hombro": (8, 3.6), "biceps": (8, 8), "codo": (8, 14.4), "antebrazo": (14, 15), "muneca": (18.4, 15)})
add(A, "codo", "Codo", [cap(8, 6, 5, 10), c(8, 13.4, 1.8), cap(15.8, 13.4, 4.4, 11, 90)],
    {"codo-punta": (8, 13.4), "codo-pliegue": (10.6, 11.6), "biceps": (8, 6), "antebrazo": (15.8, 13.4)})
add(A, "antebrazo-interno", "Antebrazo interno", [*mitten(12, 2, 8.6, 6, "right", 3.6), ln(9, 9.4, 8.4, 22), ln(15, 9.4, 15.6, 22), ln(9.2, 9, 14.8, 9),
    ln(11, 10.4, 11, 14), ln(13, 10.4, 13, 14)],
    {"centro-palma": (12, 5.6), "muneca-centro": (12, 9), "muneca-menique": (9.6, 9), "muneca-pulgar": (14.4, 9), "tres-dedos": (12, 12.6),
     "antebrazo-medio": (12, 16.4), "codo-pliegue": (12, 21.4)})
add(A, "antebrazo-externo", "Antebrazo externo", [*mitten(12, 2, 8.6, 6, "left", 3.6), ln(9, 9.4, 8.4, 22), ln(15, 9.4, 15.6, 22), ln(9.2, 9, 14.8, 9)],
    {"dorso-mano": (12, 5.6), "muneca-dorso": (12, 9), "tres-dedos-dorso": (12, 12.6), "antebrazo-medio": (12, 16.4), "codo": (12, 21.4)})
add(A, "muneca", "Muñeca", [*mitten(12, 2, 11, 9, "right", 4.4), ln(7.5, 12.4, 7, 22), ln(16.5, 12.4, 17, 22), ln(7.6, 12, 16.4, 12), ln(7.6, 13.4, 16.4, 13.4),
    ln(10.8, 14.6, 10.8, 19), ln(13.2, 14.6, 13.2, 19)],
    {"muneca-centro": (12, 12.6), "muneca-menique": (8.6, 12.6), "muneca-pulgar": (15.4, 12.6), "entre-tendones": (12, 17), "centro-palma": (12, 7)})
add(A, "hombros", "Hombros", [ln(10, 3, 10, 7), ln(14, 3, 14, 7), ln(10, 7, 6.4, 8.8), ln(14, 7, 17.6, 8.8), c(5, 10.4, 1.9), c(19, 10.4, 1.9),
    cap(5, 16.8, 3.2, 8.4), cap(19, 16.8, 3.2, 8.4), ln(8.2, 10, 8.2, 21.5), ln(15.8, 10, 15.8, 21.5)],
    {"hombro-izquierdo": (5, 10.4), "hombro-derecho": (19, 10.4), "trapecio-derecho": (16, 7.9), "base-cuello": (12, 7)})
add(A, "axila", "Axila / costado (brazo arriba)", [c(11, 3.4, 2.2), rr(8.2, 6.6, 5.6, 7.4, 1.8), cap(6.4, 10.4, 1.8, 7.2), cap(16.6, 4, 1.8, 7.2, 30),
    cap(9.8, 18.6, 2.2, 8.4), cap(12.2, 18.6, 2.2, 8.4)],
    {"axila": (14.4, 7.4), "costado-derecho": (14.2, 11), "brazo-arriba": (17.2, 3)})
add(A, "brazo-extendido", "Brazo extendido", [cap(8, 12, 4.4, 11, 90), cap(16.4, 12, 3.8, 7, 90), c(21.4, 12, 1.6)],
    {"hombro": (3, 12), "biceps": (8, 12), "codo": (12.8, 12), "antebrazo": (16.4, 12), "muneca": (19.6, 12)})

M = "Manos"
add(M, "mano-palma", "Palma de la mano", [*mitten(11, 3, 16, 8, "right"), ln(7, 17.2, 7, 22), ln(15, 17.2, 15, 22), ln(7.2, 16.6, 14.8, 16.6)],
    {"centro-palma": (11, 11), "base-dedos": (11, 6), "base-pulgar": (14, 14.4), "muneca-centro": (11, 16.6), "muneca-menique": (7.8, 16.6),
     "muneca-pulgar": (14.2, 16.6), "borde-mano": (7, 11), "yema-pulgar": (17.8, 6.8), "tres-dedos": (11, 20.4)})
add(M, "mano-dorso", "Dorso de la mano", [*mitten(13, 3, 16, 8, "left"), ln(9, 17.2, 9, 22), ln(17, 17.2, 17, 22), c(10.6, 7, 0.5), c(13, 6.2, 0.5), c(15.4, 7, 0.5)],
    {"dorso-centro": (13, 11), "entre-pulgar-indice": (9, 8.6), "nudillos": (13, 6.4), "muneca-dorso": (13, 16.6), "borde-mano": (17, 11)})
add(M, "mano-canto", "Canto de la mano", [cap(12, 8.2, 4.4, 12.4), cap(15.8, 10.2, 2, 4.4, 30), ln(10, 15.2, 10, 22), ln(14, 15.2, 14, 22)],
    {"canto": (9.8, 9), "punta-dedos": (12, 2.6), "muneca": (12, 15.2)})
add(M, "puno", "Puño", [rr(6, 5, 12, 11, 4), p("M6 10h8a2 2 0 0 1 0 4h-3"), ln(8, 16.6, 8, 22), ln(16, 16.6, 16, 22)],
    {"nudillos": (12, 5.4), "puno-centro": (12, 12), "muneca": (12, 17)})
add(M, "senalar", "Mano señalando", [*mitten(12, 11.4, 21.4, 8, "right", 4), cap(10, 6, 2.6, 8.4)],
    {"yema-indice": (10, 2.4), "nudillo": (10, 11.8), "dorso": (12, 16)})
add(M, "pulgar", "Pulgar arriba", [rr(6, 10, 11, 9, 3.5), cap(8.6, 5.8, 3, 7.6), ln(8, 19.6, 8, 22.5), ln(15, 19.6, 15, 22.5)],
    {"yema-pulgar": (8.6, 2.6), "base-pulgar": (8.6, 9), "nudillos": (12, 10.4)})
add(M, "entre-pulgar-indice", "Entre pulgar e índice", [*mitten(10, 4, 18, 10, "right", 7), ln(5, 18, 5, 22), ln(15, 18, 15, 22)],
    {"entre-pulgar-indice": (15.6, 9.6), "base-pulgar": (16, 14), "dorso": (10, 11)})
add(M, "yema", "Yema del dedo", [p("M7 22V9a5 5 0 0 1 10 0v13"), p("M9.5 9a2.5 2.5 0 0 1 5 0"), p("M9.5 12a2.5 2.5 0 0 1 5 0")],
    {"yema": (12, 7.6), "falange": (12, 16)})
add(M, "manos-juntas", "Manos juntas", [p("M11.4 21V9a3 3 0 0 0-6 0v7l-2 5"), p("M12.6 21V9a3 3 0 0 1 6 0v7l2 5")],
    {"palmas": (12, 12), "puntas": (12, 7), "munecas": (12, 19)})
add(M, "mano-sobre-mano", "Una mano sobre la otra", [rr(4, 9, 11, 9, 3.5), rr(9, 6, 11, 9, 3.5)],
    {"centro": (14.5, 10.5), "mano-abajo": (8, 15)})
add(M, "tres-dedos", "Medir tres dedos", [ln(8, 2, 8, 22), ln(16, 2, 16, 22), ln(8, 5.8, 16, 5.8), cap(12, 8, 2.2, 10, 90), cap(12, 10.6, 2.2, 10, 90),
    cap(12, 13.2, 2.2, 10, 90)],
    {"pliegue-muneca": (12, 5.8), "tres-dedos": (12, 15.8), "entre-tendones": (12, 15.8)})
add(M, "mano-abierta", "Mano abierta (con dedos)", [p("M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"), p("M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"),
    p("M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"), p("M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15")],
    {"centro-palma": (14, 15), "yema-mayor": (12, 3), "base-pulgar": (8, 17)})
add(M, "presionar-palma", "Presionar la palma con el pulgar", [*mitten(11, 3, 16, 8, "right"), ln(7, 17.2, 7, 22), ln(15, 17.2, 15, 22), cap(11, 11, 2.6, 5)],
    {"centro-palma": (11, 11)})
add(M, "pulso-muneca", "Tomar el pulso en la muñeca", [*mitten(12, 2, 8.6, 6, "right", 3.6), ln(9, 9.4, 8.4, 22), ln(15, 9.4, 15.6, 22),
    cap(12, 11, 1.6, 5, 90), cap(12, 13, 1.6, 5, 90)],
    {"pulso": (12, 12), "muneca-centro": (12, 9.4)})

L = "Piernas"
add(L, "pierna", "Pierna de frente", [cap(12, 6.6, 5, 9.6), c(12, 13, 1.2), cap(12, 18.4, 4, 7.6), ln(10, 22.8, 15, 22.8)],
    {"muslo": (12, 6.6), "rodilla": (12, 13), "debajo-rodilla": (12, 15.6), "espinilla": (12, 18.4), "tobillo": (12, 21.6)})
add(L, "pierna-perfil", "Pierna de perfil", [cap(11, 7, 5, 11), cap(11, 16.8, 4, 8.4), p("M9.5 21h7a1 1 0 0 0 0-1.6l-3-1")],
    {"muslo": (11, 7), "rodilla": (13.2, 12.2), "pantorrilla": (9.4, 16), "tobillo": (11, 20.6)})
add(L, "rodilla", "Rodilla", [p("M7 2v8"), p("M17 2v8"), c(12, 12, 3), p("M8 22v-8"), p("M16 22v-8"), p("M7 10q1 3 1 4"), p("M17 10q-1 3-1 4")],
    {"rodilla": (12, 12), "debajo-rodilla": (12, 17), "costado-rodilla": (16.6, 12), "encima-rodilla": (12, 7.4)})
add(L, "pantorrilla", "Pantorrilla (atrás)", [p("M8 2v6q-2 4-1 8l2 6"), p("M16 2v6q2 4 1 8l-2 6"), p("M8 8q4 2 8 0")],
    {"corva": (12, 7.4), "pantorrilla": (12, 12), "talon-de-aquiles": (12, 20)})
add(L, "muslo", "Muslo", [p("M6 2v18"), p("M18 2v18"), p("M6 20q6 3 12 0"), c(12, 17.6, 1.6)],
    {"muslo-frente": (12, 9), "muslo-costado": (17.4, 9), "encima-rodilla": (12, 15)})
add(L, "tobillo", "Tobillo", [p("M9 2v12"), p("M15 2v12"), p("M9 14q-1 5 3 6h8a1.5 1.5 0 0 0 0-3l-5-1v-2"), c(15.6, 12.6, 1.2)],
    {"tobillo-externo": (15.6, 12.6), "tobillo-interno": (9, 13), "talon": (9.8, 19), "empeine": (15, 16.6)})
add(L, "corva", "Detrás de la rodilla", [p("M7 2v8"), p("M17 2v8"), p("M8 22v-8"), p("M16 22v-8"), p("M7 10q1 3 1 4"), p("M17 10q-1 3-1 4"), p("M9 12q3 1.4 6 0")],
    {"corva": (12, 12.4), "pantorrilla": (12, 18), "muslo-atras": (12, 6)})
add(L, "gluteos", "Glúteos / cadera", [p("M4 4v8a8 8 0 0 0 16 0v-8"), p("M12 8v12"), p("M4 4q8 2 16 0")],
    {"gluteo-derecho": (16, 13), "gluteo-izquierdo": (8, 13), "sacro": (12, 7), "cadera-derecha": (19, 9)})
add(L, "pierna-sentada", "Pierna sentada", [cap(9, 9, 4.6, 12, 90), cap(15.4, 15.2, 4, 10), ln(13.4, 20.8, 20, 20.8)],
    {"muslo": (9, 9), "rodilla": (15.4, 9), "pantorrilla": (15.4, 15), "tobillo": (15.4, 19.4)})
add(L, "piernas", "Piernas", [cap(9, 12, 4.4, 20), cap(15, 12, 4.4, 20), c(9, 12, 1), c(15, 12, 1)],
    {"rodilla-derecha": (15, 12), "rodilla-izquierda": (9, 12), "muslo-derecho": (15, 6), "tobillo-derecho": (15, 20.6)})

F = "Pies"
SOLE = p("M7 10a5 5 0 0 1 10 0l-1.5 7.5a3.5 3.5 0 0 1-7 0q.5-4-1.5-7.5z")
TOES = [c(8.2, 3.6, 1.6), c(11.2, 2.8, 1.1), c(13.6, 3.2, 1), c(15.6, 4, .9), c(17.2, 5.3, .8)]
add(F, "planta", "Planta del pie", [SOLE, *TOES],
    {"planta-tercio": (12, 11), "dedo-gordo": (8.2, 3.6), "base-dedos": (12, 6.4), "arco": (8.6, 15), "talon": (12, 19.4)})
add(F, "empeine", "Empeine (pie desde arriba)", [p("M9 2v6q-2 4-2 9a5 5 0 0 0 10 0q0-5-2-9v-6"), c(8.6, 21.4, .9), c(11, 21.8, .8), c(13.2, 21.8, .7),
    c(15.2, 21.2, .6)],
    {"empeine": (12, 13), "entre-dedo-1-y-2": (9.8, 17.6), "tobillo": (12, 6), "dedo-gordo": (8.6, 21.4)})
add(F, "pie-perfil", "Pie de perfil (interno)", [p("M6 3v9q-2 1-2 4q0 3 3 3h13a1.5 1.5 0 0 0 0-3l-7-2-3-3v-8"), p("M8 19q4-4 8 0")],
    {"arco": (12, 17.6), "talon": (5, 17), "tobillo-interno": (7.6, 11), "dedo-gordo": (20, 17.4), "empeine": (13, 14)})
add(F, "pie-perfil-externo", "Pie de perfil (externo)", [p("M18 3v9q2 1 2 4q0 3-3 3h-13a1.5 1.5 0 0 1 0-3l7-2 3-3v-8"), c(16.4, 11, 1.1)],
    {"tobillo-externo": (16.4, 11), "talon": (19, 17), "borde-externo": (12, 18.6), "dedo-chico": (4, 17.4)})
add(F, "dedos-pie", "Dedos del pie", [cap(5.5, 12, 4, 8), cap(10, 11, 3.2, 7), cap(13.8, 11.4, 3, 6.4), cap(17.2, 12.2, 2.8, 5.6), cap(20.2, 13.2, 2.4, 4.8)],
    {"dedo-gordo": (5.5, 10), "entre-dedo-1-y-2": (7.8, 14.6), "dedo-chico": (20.2, 12)})
add(F, "talon", "Talón", [p("M7 3v10a5 5 0 0 0 10 0v-10"), p("M9 19q3 2 6 0")],
    {"talon": (12, 16.6), "tendon-de-aquiles": (12, 6), "tobillo-interno": (7.6, 11)})
add(F, "huellas", "Huellas", [p("M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"),
    p("M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"), ln(16, 17, 20, 17), ln(4, 13, 8, 13)],
    {"pie-izquierdo": (6, 7), "pie-derecho": (18, 11)})
add(F, "pie-en-el-suelo", "Pie apoyado en el suelo", [p("M6 4v9q-2 1-2 3q0 2 2 2h13a1.5 1.5 0 0 0 0-3l-7-2-3-3v-6"), ln(2, 21, 22, 21)],
    {"planta": (12, 18), "talon": (5, 17), "empeine": (13, 13.6), "suelo": (12, 21)})
add(F, "pies", "Ambos pies", [p("M4 9a3.5 3.5 0 0 1 7 0l-1 7a2.5 2.5 0 0 1-5 0q.3-3-1-7z"), p("M13 9a3.5 3.5 0 0 1 7 0q-1.3 4-1 7a2.5 2.5 0 0 1-5 0z"),
    c(5, 3.4, 1), c(7.6, 3, .8), c(19, 3.4, 1), c(16.4, 3, .8)],
    {"planta-izquierda": (7.5, 10), "planta-derecha": (16.5, 10), "talon-derecho": (16.5, 17)})
add(F, "tobillo-frente", "Tobillo y pie de frente", [p("M9 2v10q-3 2-4 6q0 2 2 2h10q2 0 2-2q-1-4-4-6v-10"), c(7.4, 13, 1), c(16.6, 13, 1)],
    {"tobillo-interno": (7.4, 13), "tobillo-externo": (16.6, 13), "empeine": (12, 16), "dedos": (12, 19.4)})
add(F, "masaje-planta", "Masaje en la planta", [SOLE, *TOES, cap(12, 11, 2.6, 5)],
    {"planta-tercio": (12, 11), "talon": (12, 19.4)})

B = "Cuerpo y posturas"
HEAD_P = c(12, 3.4, 2.2)
TORSO_P = rr(9.2, 6.6, 5.6, 7.4, 1.8)
ARMS_P = [cap(7.4, 10.4, 1.8, 7.2), cap(16.6, 10.4, 1.8, 7.2)]
LEGS_P = [cap(10.8, 18.6, 2.2, 8.4), cap(13.2, 18.6, 2.2, 8.4)]
add(B, "cuerpo-frente", "Cuerpo de frente", [HEAD_P, TORSO_P, *ARMS_P, *LEGS_P],
    {"cabeza": (12, 3.4), "pecho": (12, 8.4), "panza": (12, 11.8), "hombro-derecho": (14, 7.2), "mano-derecha": (16.6, 13.6),
     "rodilla-derecha": (13.2, 18.4), "pie-derecho": (13.2, 22.4)})
add(B, "cuerpo-espalda", "Cuerpo de espalda", [HEAD_P, TORSO_P, *ARMS_P, *LEGS_P, ln(12, 7.6, 12, 13)],
    {"nuca": (12, 6.2), "entre-omoplatos": (12, 8.4), "lumbar": (12, 12.4), "corva-derecha": (13.2, 18.4), "talon-derecho": (13.2, 22.4)})
add(B, "cuerpo-perfil", "Cuerpo de perfil", [HEAD_P, rr(9.8, 6.6, 4.4, 7.4, 1.8), cap(12, 18.6, 2.4, 8.4), ln(12, 22.8, 15, 22.8), half(14.2, 3.4, .5, "right")],
    {"cabeza": (12, 3.4), "pecho": (14, 8.4), "espalda": (9.8, 9), "panza": (14, 12), "rodilla": (12.6, 18.4)})
add(B, "sentado", "Sentado", [c(9, 3.4, 2.2), rr(7, 6.6, 4.4, 7, 1.8), cap(14, 15.2, 2.4, 8, 90), cap(17.4, 19.2, 2.2, 5.6)],
    {"cabeza": (9, 3.4), "espalda": (7.4, 9), "panza": (11, 11.6), "rodilla": (17.4, 15.2), "pie": (17.4, 21.6)})
add(B, "sentado-silla", "Sentado en una silla", [c(9, 3.4, 2.2), rr(7, 6.6, 4.4, 7, 1.8), cap(14, 15.2, 2.4, 8, 90), cap(17.4, 19.2, 2.2, 5.6),
    ln(5.6, 4, 5.6, 22.5), ln(5.6, 16.8, 13, 16.8), ln(13, 16.8, 13, 22.5)],
    {"espalda": (7.4, 9), "panza": (11, 11.6), "pies": (17.4, 22), "rodilla": (17.4, 15.2)})
add(B, "meditando", "Sentado meditando", [c(12, 4.4, 2.2), rr(9.6, 7.6, 4.8, 6.4, 1.8), cap(12, 17.6, 2.4, 15, 90), cap(8, 12.6, 1.8, 6, 35), cap(16, 12.6, 1.8, 6, -35)],
    {"cabeza": (12, 4.4), "pecho": (12, 9.6), "panza": (12, 12.6), "manos": (16.8, 15.4)})
add(B, "acostado", "Acostado boca arriba", [c(3.6, 12, 2.2), rr(6.6, 9.2, 7.4, 5.6, 1.8), cap(18.4, 10.8, 2.2, 8.4, 90), cap(18.4, 13.2, 2.2, 8.4, 90)],
    {"cabeza": (3.6, 12), "pecho": (8.4, 12), "panza": (12, 12), "rodillas": (18.4, 12)})
add(B, "acostado-mano-panza", "Acostado con la mano en la panza", [c(3.6, 13.4, 2.2), rr(6.6, 10.6, 7.4, 5.6, 1.8), cap(18.4, 12.2, 2.2, 8.4, 90),
    cap(18.4, 14.6, 2.2, 8.4, 90), cap(10.8, 9.2, 1.8, 5, 90)],
    {"panza": (10.8, 12.4), "pecho": (8.2, 12.4)})
add(B, "acostado-costado", "Acostado de costado", [c(4, 9, 2.2), rr(6.8, 8, 7, 4.4, 1.8), cap(16.6, 11.4, 2.4, 7, 60), cap(19.6, 15.6, 2.2, 5.4, -20), ln(2, 18, 22, 18)],
    {"cabeza": (4, 9), "costado": (10, 8.4), "cadera": (14, 10.6)})
add(B, "brazos-abiertos", "Brazos abiertos", [HEAD_P, TORSO_P, cap(4.8, 7.4, 1.8, 6.8, 90), cap(19.2, 7.4, 1.8, 6.8, 90), *LEGS_P],
    {"pecho": (12, 8.4), "panza": (12, 11.8), "mano-derecha": (22, 7.4), "mano-izquierda": (2, 7.4)})
add(B, "brazos-arriba", "Brazos arriba (estirar)", [c(12, 5.6, 2.2), rr(9.2, 8.8, 5.6, 6.6, 1.8), cap(7.6, 3.8, 1.8, 6.4, -25), cap(16.4, 3.8, 1.8, 6.4, 25),
    cap(10.8, 19.6, 2.2, 7.6), cap(13.2, 19.6, 2.2, 7.6)],
    {"pecho": (12, 10.4), "costado-derecho": (14.8, 11.6), "manos": (12, 1)})
add(B, "caminando", "Caminando", [c(12.4, 3.4, 2.2), rr(10, 6.6, 4.8, 7, 1.8), cap(7.8, 10.2, 1.8, 6.4, 25), cap(17.2, 10.2, 1.8, 6.4, -25),
    cap(10.6, 18.4, 2.2, 8.4, 18), cap(14.6, 18.4, 2.2, 8.4, -18)],
    {"pecho": (12.4, 8.4), "pie-derecho": (16, 22), "pie-izquierdo": (9.2, 22)})
add(B, "mano-en-pecho", "Mano en el pecho", [c(12, 4, 2.6), p("M4 22.5a8 8 0 0 1 16 0"), cap(12, 17.4, 3, 7, 90)],
    {"pecho": (12, 17.4), "cabeza": (12, 4)})
add(B, "manos-en-panza", "Manos en la panza", [c(12, 3, 2.2), rr(8.4, 6.2, 7.2, 12, 2.4), cap(12, 13.4, 2.4, 5.4, 90), cap(12, 16.2, 2.4, 5.4, 90)],
    {"panza": (12, 14.8), "pecho": (12, 9)})
add(B, "pecho-y-panza", "Una mano en el pecho y otra en la panza", [c(12, 3, 2.2), rr(8.4, 6.2, 7.2, 12, 2.4), cap(12, 9.2, 2.4, 5.4, 90),
    cap(12, 15, 2.4, 5.4, 90)],
    {"pecho": (12, 9.2), "panza": (12, 15)})
add(B, "abrazo-mariposa", "Abrazo mariposa", [c(12, 3.6, 2.4), p("M4 22.5a8 8 0 0 1 16 0"), cap(12, 16, 2.4, 11, 60), cap(12, 16, 2.4, 11, -60)],
    {"pecho": (12, 16), "hombro-derecho": (17, 13.4), "hombro-izquierdo": (7, 13.4)})
add(B, "manos-en-sienes", "Manos en las sienes", [c(12, 11, 5.5), cap(4.4, 11, 2.6, 7), cap(19.6, 11, 2.6, 7), ln(10, 16.6, 10, 20.5), ln(14, 16.6, 14, 20.5)],
    {"sien-derecha": (17, 9.6), "sien-izquierda": (7, 9.6), "frente": (12, 7)})
add(B, "presionar-sien", "Presionar la sien con un dedo", [c(11, 11, 5.5), *ears(11, 5.5, 5.5, 16.5), ln(9, 16.6, 9, 20.5), ln(13, 16.6, 13, 20.5),
    cap(19.4, 8.6, 2.4, 6, 45)],
    {"sien-derecha": (16, 9.4)})
add(B, "presionar-entrecejo", "Presionar el entrecejo", [ring(12, 13, 6.5, [(-104, -76)]), *ears(13, 6.5, 5.5, 18.5), ln(10, 19.4, 10, 22.5), ln(14, 19.4, 14, 22.5),
    cap(12, 5.4, 2.4, 7)],
    {"entrecejo": (12, 9.4), "frente": (12, 8)})
add(B, "tirar-lobulos", "Tirar de los lóbulos", [c(12, 10, 6), *ears(10, 6, 6, 18, 1.5), ln(10, 16, 10, 20.5), ln(14, 16, 14, 20.5),
    cap(4.2, 14.2, 2, 4.4, 25), cap(19.8, 14.2, 2, 4.4, -25)],
    {"lobulo-derecho": (18.4, 12), "lobulo-izquierdo": (5.6, 12)})
add(B, "masaje-mandibula", "Masaje en la mandíbula", [c(12, 10, 6.5), *ears(10, 6.5, 5.5, 18.5), ln(10, 16.6, 10, 20.5), ln(14, 16.6, 14, 20.5),
    cap(8.2, 12.8, 1.8, 3.6, -30), cap(15.8, 12.8, 1.8, 3.6, 30)],
    {"mandibula-derecha": (15.8, 12.8), "mandibula-izquierda": (8.2, 12.8), "atm-derecha": (17, 10.6)})
add(B, "manos-en-la-cara", "Manos tapando los ojos", [ring(12, 10, 6, [(-172, -146), (-34, -8)]), cap(12, 9.4, 3, 11.6, 90), ln(10, 16.2, 10, 20),
    ln(14, 16.2, 14, 20), p("M4 22.5a8 5 0 0 1 16 0")],
    {"ojos": (12, 9.4), "frente": (12, 5.6)})
add(B, "masaje-nuca", "Masaje en la nuca", [c(12, 8, 5.5), ln(10, 13.4, 10, 14.6), ln(14, 13.4, 14, 14.6), p("M4 22.5a8 6 0 0 1 16 0"), cap(12, 16.4, 2.6, 7, 90)],
    {"nuca": (12, 16.4), "base-craneo": (12, 13.2)})
add(B, "tocar-coronilla", "Mano en la coronilla", [ring(12, 13, 6.5, [(-130, -50)]), *ears(13, 6.5, 5.5, 18.5), ln(10, 19.4, 10, 22.5), ln(14, 19.4, 14, 22.5),
    cap(12, 7.4, 2.6, 9, 90)],
    {"coronilla": (12, 7.4)})
add(B, "golpecitos-clavicula", "Golpecitos en la clavícula", [c(12, 5, 3), p("M4 22.5a8 8 0 0 1 16 0"), cap(15.8, 11.6, 2, 5, -20), cap(18, 12.2, 2, 5, -20)],
    {"clavicula-derecha": (15, 15.6), "clavicula-izquierda": (9, 15.6)})
add(B, "hombros-arriba", "Subir los hombros", [c(12, 7, 3.4), ln(10.6, 10.4, 10.6, 12), ln(13.4, 10.4, 13.4, 12), p("M4 21.5v-7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7"),
    p("M3 8l2-2l2 2"), p("M17 8l2-2l2 2")],
    {"hombro-derecho": (18.4, 12.6), "hombro-izquierdo": (5.6, 12.6), "trapecio": (15.6, 11.6)})
add(B, "respirar", "Respirar (pecho que se expande)", [c(12, 3, 2.2), rr(8.4, 6.2, 7.2, 12, 2.4), p("M4 10l-2 2l2 2"), p("M20 10l2 2l-2 2")],
    {"pecho": (12, 9), "panza": (12, 14.6)})
add(B, "escaneo-corporal", "Escaneo corporal", [p("M4 8V6a2 2 0 0 1 2-2h2"), p("M4 16v2a2 2 0 0 0 2 2h2"), p("M16 4h2a2 2 0 0 1 2 2v2"),
    p("M16 20h2a2 2 0 0 0 2-2v-2"), c(12, 7.4, 1.4), ln(12, 9.6, 12, 14.6), ln(9, 11.4, 15, 11.4), p("M10 17.6l2-3l2 3")],
    {"cabeza": (12, 7.4), "pecho": (12, 11.4), "panza": (12, 13.6)})


def main():
    os.makedirs(OUT_SVG, exist_ok=True)
    # Drop drawings of entries that no longer exist, so the set matches the list.
    keep = {f"cuerpo-{id_}.svg" for _, id_, _, _, _ in E}
    for fn in os.listdir(OUT_SVG):
        if fn.startswith("cuerpo-") and fn not in keep:
            os.remove(os.path.join(OUT_SVG, fn))
    head = ('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" '
            'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">')
    rows = []
    for cat, id_, name, els, pts in E:
        with open(os.path.join(OUT_SVG, f"cuerpo-{id_}.svg"), "w", encoding="utf-8") as f:
            f.write("<!-- Generated by scripts/body_icons.py -->\n" + head + "\n  " + "\n  ".join(els) + "\n</svg>\n")
        rows.append({"id": id_, "name": name, "cat": cat, "key": f"house/cuerpo-{id_}",
                     "points": {k: [round(x, 2), round(y, 2)] for k, (x, y) in pts.items()}})
    ts = ["/** Written by scripts/body_icons.py — regenerate rather than edit. */",
          "export type BodyPicto = {",
          "  readonly id: string;",
          "  readonly name: string;",
          "  readonly cat: string;",
          "  /** Glyph key in the vendored icon set. */",
          "  readonly key: string;",
          "  /** Landmarks in 24-grid units. */",
          "  readonly points: Readonly<Record<string, readonly [number, number]>>;",
          "};",
          "",
          "export const BODY_PICTOS: readonly BodyPicto[] = " + json.dumps(rows, ensure_ascii=False, indent=1) + ";",
          ""]
    with open(OUT_TS, "w", encoding="utf-8") as f:
        f.write("\n".join(ts))
    print(f"{len(E)} body icons")


if __name__ == "__main__":
    main()
