import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas, DrawSpeed } from "./primitives";
import { BG, INK, STROKE, STROKE_THIN } from "./theme";

/**
 * "Triangular": triangle breathing, 4-7-8, on the exact timing of Pablo's
 * viral reel (measured frame by frame from it). A dot climbs the left side
 * while you breathe in, comes down the right side while you hold, and runs
 * back along the base while you breathe out. No text, no audio.
 */

/** Frame where each phase ends, measured from the reference (30 fps). */
export const TRIANGULAR_INHALE = 117;
export const TRIANGULAR_HOLD = 329;
export const TRIANGULAR_FRAMES = 571;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const A = [250, 700] as const; // bottom left: start
const B = [540, 330] as const; // apex
const C = [830, 700] as const; // bottom right
const SIDES = [
  { from: A, to: B, f0: 0, f1: TRIANGULAR_INHALE },
  { from: B, to: C, f0: TRIANGULAR_INHALE, f1: TRIANGULAR_HOLD },
  { from: C, to: A, f0: TRIANGULAR_HOLD, f1: TRIANGULAR_FRAMES - 1 },
];

const lerp = (p: readonly number[], q: readonly number[], t: number) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

export const Triangular: React.FC = () => {
  const f = useCurrentFrame();
  const side = f < TRIANGULAR_INHALE ? 0 : f < TRIANGULAR_HOLD ? 1 : 2;
  const sd = SIDES[side];
  const t = interpolate(f, [sd.f0, sd.f1], [0, 1], clamp);
  const [x, y] = lerp(sd.from, sd.to, t);

  // The dot fills up as you breathe in, stays full while you hold, empties as you breathe out.
  const size = interpolate(f, [0, TRIANGULAR_INHALE, TRIANGULAR_HOLD, TRIANGULAR_FRAMES - 1], [0, 1, 1, 0], clamp);
  const r = 22 + 12 * size;
  const halo = 0.35 + 0.55 * size;

  // A pulse when the dot reaches a corner.
  const corners = [
    { at: TRIANGULAR_INHALE, p: B },
    { at: TRIANGULAR_HOLD, p: C },
  ];

  const intro = interpolate(f, [0, 10], [0.4, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Canvas scale={0.88} glowOpacity={0.35}>
        <DrawSpeed value={1}>
          <defs>
            <radialGradient id="triDot">
              <stop offset="0%" stopColor={INK} stopOpacity={0.55} />
              <stop offset="35%" stopColor={INK} stopOpacity={0.16} />
              <stop offset="100%" stopColor={INK} stopOpacity={0} />
            </radialGradient>
          </defs>
          <g transform="translate(0 30)">
            {/* the triangle */}
            <path d={`M ${A[0]} ${A[1]} L ${B[0]} ${B[1]} L ${C[0]} ${C[1]} Z`} strokeWidth={STROKE_THIN} opacity={0.8 * intro} />
            {/* the stretch of the current side already travelled, brighter */}
            <path d={`M ${sd.from[0]} ${sd.from[1]} L ${x} ${y}`} strokeWidth={STROKE} />
            {/* corner pulses */}
            {corners.map((c, i) => {
              const k = (f - c.at) / 28;
              return k >= 0 && k <= 1 ? (
                <circle key={i} cx={c.p[0]} cy={c.p[1]} r={30 + 60 * k} strokeWidth={STROKE_THIN} opacity={0.8 * (1 - k)} />
              ) : null;
            })}
            {/* the dot */}
            <circle cx={x} cy={y} r={r * 4.5} fill="url(#triDot)" stroke="none" opacity={halo} />
            <circle cx={x} cy={y} r={r} fill={INK} stroke="none" />
          </g>
        </DrawSpeed>
      </Canvas>
    </AbsoluteFill>
  );
};
