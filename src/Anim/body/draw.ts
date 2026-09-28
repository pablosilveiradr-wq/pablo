/**
 * Geometry helpers for the anatomical bases. Bodies are drawn as smooth
 * splines through hand-placed anchor points, in canvas units (1080 square,
 * centre 540), so each base can be tuned by nudging a few numbers.
 */

export type Pt = readonly [number, number];

const fmt = (v: number) => Math.round(v * 10) / 10;

/**
 * Catmull-Rom spline through `pts` as cubic Béziers. `tension` 1 is the
 * classic curve; lower pulls it tighter to the anchors.
 */
export const spline = (pts: readonly Pt[], closed = false, tension = 1): string => {
  const n = pts.length;
  if (n < 2) {
    return "";
  }
  const at = (i: number): Pt =>
    closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M ${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  const k = tension / 6;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) * k;
    const c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k;
    const c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += ` C ${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
};

/** Rotate a point about an origin, degrees clockwise on screen. */
export const rot = ([x, y]: Pt, [ox, oy]: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  const dx = x - ox;
  const dy = y - oy;
  return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a)];
};

/** Linear interpolation between two points. */
export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/**
 * A finger (or toe) as outline points, base to tip to base, standing on the
 * segment `base` (left point, right point) and leaning `tilt` degrees. The
 * finger tapers to `taper` of its base width and ends in a round tip.
 */
export const digit = (
  base: readonly [Pt, Pt],
  length: number,
  tilt = 0,
  taper = 0.84,
): { outline: Pt[]; axis: (t: number) => Pt; width: number } => {
  const [l, r] = base;
  const c: Pt = [(l[0] + r[0]) / 2, (l[1] + r[1]) / 2];
  const w = Math.hypot(r[0] - l[0], r[1] - l[1]);
  const wt = w * taper;
  const up = (x: number, y: number): Pt => rot([c[0] + x, c[1] - y], c, tilt);
  const outline: Pt[] = [
    l,
    up(-w * 0.5, length * 0.3),
    up(-wt * 0.5, length - wt * 0.55),
    up(-wt * 0.4, length - wt * 0.16),
    up(0, length),
    up(wt * 0.4, length - wt * 0.16),
    up(wt * 0.5, length - wt * 0.55),
    up(w * 0.5, length * 0.3),
    r,
  ];
  return { outline, axis: (t: number) => up(0, length * t), width: w };
};

/** Short crease across a digit at fraction `t` of its length. */
export const crease = (
  d: { axis: (t: number) => Pt; width: number },
  t: number,
  span = 0.62,
  sag = 5,
): string => {
  const c = d.axis(t);
  const ahead = d.axis(Math.min(1, t + 0.01));
  const ang = Math.atan2(ahead[1] - c[1], ahead[0] - c[0]) + Math.PI / 2;
  const hw = (d.width * span) / 2;
  const a: Pt = [c[0] - Math.cos(ang) * hw, c[1] - Math.sin(ang) * hw];
  const b: Pt = [c[0] + Math.cos(ang) * hw, c[1] + Math.sin(ang) * hw];
  const m: Pt = [c[0] - Math.cos(ang - Math.PI / 2) * sag, c[1] - Math.sin(ang - Math.PI / 2) * sag];
  return `M ${fmt(a[0])} ${fmt(a[1])} Q ${fmt(m[0])} ${fmt(m[1])} ${fmt(b[0])} ${fmt(b[1])}`;
};

/** Mirror a path's points left-right about the canvas centre (x -> 1080 - x). */
export const mirrorPts = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => [1080 - x, y] as Pt);
