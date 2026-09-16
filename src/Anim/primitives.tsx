import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BG, CANVAS, CENTER, ICON_SCALE, INK, STROKE, STROKE_THIN } from "./theme";

const EASE = Easing.inOut(Easing.cubic);

/** Every icon takes the same prop: when, in frames, it starts building. */
export type IconProps = { readonly delay?: number };

/** 0 -> 1 reveal ramp, clamped on both ends. */
export const useReveal = (delay = 0, duration = 22) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
};

/** Slow sine used for the idle "breathing" the references never stop doing. */
export const useBreath = (amount = 0.02, period = 110) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin((frame / period) * Math.PI * 2) * amount;
};

export const Canvas: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <svg
    viewBox={`0 0 ${CANVAS} ${CANVAS}`}
    width="100%"
    height="100%"
    style={{ position: "absolute", inset: 0 }}
    fill="none"
    stroke={INK}
    strokeWidth={STROKE}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <g
      style={{
        transform: `scale(${ICON_SCALE})`,
        transformOrigin: `${CENTER}px ${CENTER}px`,
        transformBox: "view-box",
      }}
    >
      {children}
    </g>
  </svg>
);

/** A path that draws itself on, the way every outline in the references does. */
export const DrawPath: React.FC<{
  readonly d: string;
  readonly delay?: number;
  readonly duration?: number;
  readonly strokeWidth?: number;
  readonly opacity?: number;
  /** Paint the background through the shape first, so lines behind it stop. */
  readonly occlude?: boolean;
}> = ({
  d,
  delay = 0,
  duration = 26,
  strokeWidth = STROKE,
  opacity = 1,
  occlude = false,
}) => {
  const p = useReveal(delay, duration);
  if (p <= 0) {
    return null;
  }
  return (
    <>
      {occlude ? (
        <path
          d={d}
          fill={BG}
          stroke="none"
          opacity={Math.min(1, p / 0.35) * opacity}
        />
      ) : null}
      <path
        d={d}
        pathLength={1}
        strokeWidth={strokeWidth}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        opacity={opacity}
      />
    </>
  );
};

/** Fade + optional offset/scale wrapper for elements that pop rather than draw. */
export const Appear: React.FC<{
  readonly delay?: number;
  readonly duration?: number;
  readonly dx?: number;
  readonly dy?: number;
  readonly scaleFrom?: number;
  readonly origin?: [number, number];
  readonly opacity?: number;
  readonly children: React.ReactNode;
}> = ({
  delay = 0,
  duration = 16,
  dx = 0,
  dy = 0,
  scaleFrom = 1,
  origin,
  opacity = 1,
  children,
}) => {
  const p = useReveal(delay, duration);
  if (p <= 0) {
    return null;
  }
  const s = interpolate(p, [0, 1], [scaleFrom, 1]);
  const tx = interpolate(p, [0, 1], [dx, 0]);
  const ty = interpolate(p, [0, 1], [dy, 0]);
  return (
    <g
      opacity={p * opacity}
      transform={`translate(${tx} ${ty})`}
      style={
        origin
          ? {
              transform: `scale(${s})`,
              transformOrigin: `${origin[0]}px ${origin[1]}px`,
              transformBox: "view-box",
            }
          : undefined
      }
    >
      {children}
    </g>
  );
};

export const circlePath = (cx: number, cy: number, r: number) =>
  `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r}`;

/**
 * Dashed ring built from discrete ticks so it can sweep on around the circle,
 * which a plain strokeDasharray cannot do.
 */
export const DashedRing: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly count?: number;
  readonly delay?: number;
  readonly duration?: number;
  readonly opacity?: number;
}> = ({
  cx,
  cy,
  r,
  count = 56,
  delay = 0,
  duration = 34,
  opacity = 0.55,
}) => {
  const frame = useCurrentFrame();
  const per = duration / count;
  return (
    <g opacity={opacity}>
      {new Array(count).fill(0).map((_, i) => {
        const a0 = (i / count) * Math.PI * 2 - Math.PI / 2;
        const a1 = a0 + (Math.PI * 2) / count / 2;
        const p = interpolate(frame - delay - i * per, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (p <= 0) {
          return null;
        }
        return (
          <line
            key={i}
            x1={cx + Math.cos(a0) * r}
            y1={cy + Math.sin(a0) * r}
            x2={cx + Math.cos(a1) * r}
            y2={cy + Math.sin(a1) * r}
            strokeWidth={STROKE_THIN}
            opacity={p}
          />
        );
      })}
    </g>
  );
};

/** Arrows converging on a point — the "contain / anchor" gesture. */
export const ArrowsInward: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly radius: number;
  readonly length?: number;
  readonly count?: number;
  readonly delay?: number;
}> = ({ cx, cy, radius, length = 74, count = 8, delay = 0 }) => {
  const frame = useCurrentFrame();
  // Arrows creep inward and ease back out, forever.
  const push = Math.sin((frame / 96) * Math.PI * 2) * 10;
  return (
    <g>
      {new Array(count).fill(0).map((_, i) => {
        const a = (i / count) * Math.PI * 2 - Math.PI / 2;
        const outer = radius + length - push;
        const inner = radius - push;
        const ox = cx + Math.cos(a) * outer;
        const oy = cy + Math.sin(a) * outer;
        const ix = cx + Math.cos(a) * inner;
        const iy = cy + Math.sin(a) * inner;
        const head = 11;
        const ha = a + Math.PI;
        return (
          <Appear key={i} delay={delay + i * 3} duration={14}>
            <line x1={ox} y1={oy} x2={ix} y2={iy} strokeWidth={STROKE_THIN} />
            <line
              x1={ix}
              y1={iy}
              x2={ix + Math.cos(ha + 0.5) * head}
              y2={iy + Math.sin(ha + 0.5) * head}
              strokeWidth={STROKE_THIN}
            />
            <line
              x1={ix}
              y1={iy}
              x2={ix + Math.cos(ha - 0.5) * head}
              y2={iy + Math.sin(ha - 0.5) * head}
              strokeWidth={STROKE_THIN}
            />
          </Appear>
        );
      })}
    </g>
  );
};

/** Concentric arcs radiating from a source — sound, alarm, signal. */
export const Waves: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly count?: number;
  readonly gap?: number;
  readonly spread?: number;
  readonly rotate?: number;
  readonly delay?: number;
}> = ({ cx, cy, count = 3, gap = 26, spread = 0.9, rotate = 0, delay = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      {new Array(count).fill(0).map((_, i) => {
        const r = 24 + i * gap;
        const pulse = interpolate(
          Math.sin(((frame - i * 6) / 40) * Math.PI * 2),
          [-1, 1],
          [0.25, 1],
        );
        const a0 = -Math.PI / 2 - spread;
        const a1 = -Math.PI / 2 + spread;
        const d = `M ${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r}`;
        return (
          <Appear key={i} delay={delay + i * 4} duration={12} opacity={pulse}>
            <path d={d} strokeWidth={STROKE_THIN} />
          </Appear>
        );
      })}
    </g>
  );
};

/** Baseline with tick marks that land one after another. */
export const Ticks: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly count?: number;
  readonly height?: number;
  readonly delay?: number;
}> = ({ x, y, width, count = 6, height = 22, delay = 0 }) => (
  <g>
    <DrawPath d={`M ${x} ${y} L ${x + width} ${y}`} delay={delay} duration={24} />
    {new Array(count).fill(0).map((_, i) => {
      const tx = x + (width / (count - 1)) * i;
      return (
        <Appear key={i} delay={delay + 14 + i * 5} duration={10}>
          <line
            x1={tx}
            y1={y - height}
            x2={tx}
            y2={y}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      );
    })}
  </g>
);

/** The small solid dot the references use as a cursor / attention marker. */
export const Dot: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly r?: number;
  readonly delay?: number;
  readonly opacity?: number;
}> = ({ cx, cy, r = 7, delay = 0, opacity = 1 }) => {
  const p = useReveal(delay, 10);
  if (p <= 0) {
    return null;
  }
  return <circle cx={cx} cy={cy} r={r * p} fill={INK} stroke="none" opacity={opacity} />;
};

/** Minimal human glyph: head plus shoulder arc. */
export const Person: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size?: number;
  readonly delay?: number;
  readonly opacity?: number;
}> = ({ x, y, size = 1, delay = 0, opacity = 1 }) => (
  <Appear delay={delay} duration={14} opacity={opacity} scaleFrom={0.7} origin={[x, y]}>
    <circle cx={x} cy={y - 13 * size} r={9 * size} strokeWidth={STROKE_THIN} />
    <path
      d={`M ${x - 15 * size} ${y + 13 * size} a ${15 * size} ${15 * size} 0 0 1 ${30 * size} 0`}
      strokeWidth={STROKE_THIN}
    />
  </Appear>
);
