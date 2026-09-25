import React from "react";
import { Appear, DrawPath, Dot, circlePath } from "../primitives";
import { STROKE_THIN } from "../theme";

/**
 * Drawing kit for the icon library. Icons are authored around the canvas
 * centre (540, 540) inside roughly a 400-unit box; the catalog's measured fit
 * takes care of exact centring and size, so geometry here only has to be
 * right relative to itself.
 */

export { circlePath as circ };

/** A stroke that draws itself on. `thin` for secondary detail. */
export const Ln: React.FC<{
  readonly d: string;
  readonly delay?: number;
  readonly dur?: number;
  readonly thin?: boolean;
  readonly o?: number;
  readonly occ?: boolean;
}> = ({ d, delay = 0, dur = 24, thin = false, o = 1, occ = false }) => (
  <DrawPath
    d={d}
    delay={delay}
    duration={dur}
    strokeWidth={thin ? STROKE_THIN : undefined}
    opacity={o}
    occlude={occ}
  />
);

/** A dashed guide that fades in rather than draws (dashes can't draw on). */
export const Dash: React.FC<{
  readonly d: string;
  readonly delay?: number;
  readonly o?: number;
  readonly gap?: string;
}> = ({ d, delay = 0, o = 0.4, gap = "12 16" }) => (
  <Appear delay={delay} duration={18} opacity={o}>
    <path d={d} strokeWidth={STROKE_THIN} strokeDasharray={gap} />
  </Appear>
);

/** Solid dot. */
export const Pt: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r?: number;
  readonly delay?: number;
  readonly o?: number;
}> = ({ x, y, r = 10, delay = 0, o = 1 }) => (
  <Dot cx={x} cy={y} r={r} delay={delay} opacity={o} />
);

type Delayed = { delay?: number };

/**
 * Staggers its direct children: the n-th child gets `delay + n * step` added
 * to whatever delay it already carries. Keeps icons readable as a list of
 * strokes in drawing order instead of hand-numbered delays.
 */
export const Build: React.FC<{
  readonly delay?: number;
  readonly step?: number;
  readonly children: React.ReactNode;
}> = ({ delay = 0, step = 9, children }) => {
  let n = 0;
  return (
    <>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<Delayed>(child)) {
          return child;
        }
        const own = child.props.delay ?? 0;
        return React.cloneElement(child, { delay: own + delay + step * n++ });
      })}
    </>
  );
};

/**
 * Head and shoulders whose apex lands exactly on the bottom of the head. A
 * cubic with both inner handles at `sy` peaks at (base + 3 sy) / 4, so `sy`
 * is solved from where the head ends — the two can never float apart.
 */
export const bust = (cx: number, headY: number, r: number, w = r * 1.75) => {
  const neck = headY + r;
  const base = neck + r * 1.55;
  const sy = (4 * neck - base) / 3;
  return {
    head: circlePath(cx, headY, r),
    shoulders: `M ${cx - w} ${base} C ${cx - w} ${sy} ${cx + w} ${sy} ${cx + w} ${base}`,
    base,
  };
};

/** A person glyph built from `bust`, drawn head then shoulders. */
export const Bust: React.FC<{
  readonly cx: number;
  readonly headY: number;
  readonly r: number;
  readonly w?: number;
  readonly delay?: number;
  readonly thin?: boolean;
  readonly o?: number;
  readonly occ?: boolean;
}> = ({ cx, headY, r, w, delay = 0, thin, o = 1, occ = true }) => {
  const b = bust(cx, headY, r, w);
  return (
    <>
      <Ln d={b.head} delay={delay} dur={20} thin={thin} o={o} />
      <Ln d={b.shoulders} delay={delay + 12} dur={24} thin={thin} o={o} occ={occ} />
    </>
  );
};

/** Point on a quadratic from (x0,y) to (x1,y) with control height `cy`. */
export const quadY = (x: number, x0: number, x1: number, y: number, cy: number) => {
  const t = (x - x0) / (x1 - x0);
  return y + 2 * t * (1 - t) * (cy - y);
};

/** Arrowhead with its tip exactly at (x, y), pointing along `angle` radians. */
export const headAt = (x: number, y: number, angle: number, len = 26, spread = 0.45) => {
  const back = angle + Math.PI;
  return (
    `M ${x + Math.cos(back + spread) * len} ${y + Math.sin(back + spread) * len} ` +
    `L ${x} ${y} ` +
    `L ${x + Math.cos(back - spread) * len} ${y + Math.sin(back - spread) * len}`
  );
};

/** Straight arrow from a to b, head meeting the shaft's end exactly. */
export const Arrow: React.FC<{
  readonly from: readonly [number, number];
  readonly to: readonly [number, number];
  readonly delay?: number;
  readonly thin?: boolean;
  readonly o?: number;
  readonly len?: number;
}> = ({ from, to, delay = 0, thin, o = 1, len = 26 }) => {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  return (
    <>
      <Ln d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} delay={delay} thin={thin} o={o} />
      <Ln d={headAt(to[0], to[1], a, len)} delay={delay + 18} dur={12} thin={thin} o={o} />
    </>
  );
};

const hash = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * A tangle: a smooth Catmull-Rom curve through `n` scattered points inside a
 * disc. Deterministic per seed, so the scribble is the same on every frame.
 */
export const scribble = (cx: number, cy: number, r: number, n: number, seed = 1) => {
  const pts = new Array(n).fill(0).map((_, i) => {
    const a = hash(i, seed) * Math.PI * 2;
    const d = Math.sqrt(0.25 + 0.75 * hash(i, seed + 7)) * r;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d] as const;
  });
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
};

/** Ellipse as a drawable path, its long axis turned `deg` degrees. */
export const ellipse = (cx: number, cy: number, rx: number, ry: number, deg = 0) => {
  const a = (deg * Math.PI) / 180;
  const x1 = cx - Math.cos(a) * rx;
  const y1 = cy - Math.sin(a) * rx;
  const x2 = cx + Math.cos(a) * rx;
  const y2 = cy + Math.sin(a) * rx;
  return `M ${x1} ${y1} A ${rx} ${ry} ${deg} 1 0 ${x2} ${y2} A ${rx} ${ry} ${deg} 1 0 ${x1} ${y1}`;
};

/** Four-point sparkle, concave sides, centred on (x, y). */
export const sparkle = (x: number, y: number, s: number) =>
  `M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} ` +
  `Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s}`;

/** Zig-zag from (x, y) going `n` teeth in direction dx per tooth, amplitude a. */
export const zigzag = (x: number, y: number, n: number, dx: number, a: number) => {
  let d = `M ${x} ${y}`;
  for (let i = 1; i <= n; i++) {
    d += ` L ${x + dx * i} ${y + (i % 2 ? -a : 0)}`;
  }
  return d;
};

/** Crescent moon opening right: an outer half-circle and an inner half-ellipse. */
export const crescent = (cx: number, cy: number, r: number, thin = 0.62) =>
  `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} ` +
  `A ${r * thin} ${r} 0 0 1 ${cx} ${cy - r} Z`;

/** Regular polygon / star path helpers. */
export const polyPath = (pts: readonly (readonly [number, number])[], close = true) =>
  `M ${pts.map(([x, y]) => `${x} ${y}`).join(" L ")}${close ? " Z" : ""}`;

export const ring = (cx: number, cy: number, r: number, n: number, rot = -Math.PI / 2) =>
  new Array(n).fill(0).map((_, i) => {
    const a = rot + (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });

/** Short radiating ticks around a centre, e.g. a sun or a burst. */
export const Rays: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly r0: number;
  readonly r1: number;
  readonly n: number;
  readonly delay?: number;
  readonly o?: number;
  readonly rot?: number;
}> = ({ cx, cy, r0, r1, n, delay = 0, o = 0.8, rot = -Math.PI / 2 }) => (
  <>
    {new Array(n).fill(0).map((_, i) => {
      const a = rot + (i / n) * Math.PI * 2;
      return (
        <Appear key={i} delay={delay + i * 2} duration={10} opacity={o}>
          <line
            x1={cx + Math.cos(a) * r0}
            y1={cy + Math.sin(a) * r0}
            x2={cx + Math.cos(a) * r1}
            y2={cy + Math.sin(a) * r1}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      );
    })}
  </>
);
