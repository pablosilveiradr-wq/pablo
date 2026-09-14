import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const W = 1080;
export const H = 1920;
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Soft radial halo. */
export const Glow: React.FC<{
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
  id: string;
  /** 0 = white core, higher = softer. */
  core?: number;
}> = ({ cx, cy, r, opacity = 1, id, core = 0.95 }) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor={`rgba(255,255,255,${core})`} />
        <stop offset="35%" stopColor="rgba(255,255,255,0.35)" />
        <stop offset="65%" stopColor="rgba(255,255,255,0.09)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} opacity={opacity} />
  </>
);

/** The spiky halo used behind the folder and the cards. */
export const Sunburst: React.FC<{
  cx: number;
  cy: number;
  inner: number;
  outer: number;
  rays?: number;
  rotation?: number;
  opacity?: number;
  color?: string;
  width?: number;
}> = ({
  cx,
  cy,
  inner,
  outer,
  rays = 96,
  rotation = 0,
  opacity = 1,
  color = "#3a3a3a",
  width = 3,
}) => (
  <g transform={`rotate(${rotation} ${cx} ${cy})`} opacity={opacity}>
    {new Array(rays).fill(0).map((_, i) => {
      const a = ((i / rays) * 360 * Math.PI) / 180;
      const len = i % 2 === 0 ? outer : inner + (outer - inner) * 0.55;

      // Tapered spikes, not hairlines — that is what gives the halo its bite.
      const half = (width / inner) * 0.5;

      return (
        <path
          key={i}
          d={`M ${cx + Math.cos(a - half) * inner} ${cy + Math.sin(a - half) * inner}
              L ${cx + Math.cos(a) * len} ${cy + Math.sin(a) * len}
              L ${cx + Math.cos(a + half) * inner} ${cy + Math.sin(a + half) * inner} Z`}
          fill={color}
        />
      );
    })}
  </g>
);

export const DottedRing: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rotation?: number;
  opacity?: number;
  dot?: number;
  gap?: number;
  color?: string;
}> = ({
  cx,
  cy,
  r,
  rotation = 0,
  opacity = 0.5,
  dot = 3,
  gap = 14,
  color = "#ffffff",
}) => (
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke={color}
    strokeWidth={dot}
    strokeLinecap="round"
    strokeDasharray={`0.1 ${gap}`}
    opacity={opacity}
    transform={`rotate(${rotation} ${cx} ${cy})`}
  />
);

/** Ring built from interlocking chain links. */
export const ChainRing: React.FC<{
  cx: number;
  cy: number;
  r: number;
  links?: number;
  rotation?: number;
  opacity?: number;
  scale?: number;
}> = ({ cx, cy, r, links = 24, rotation = 0, opacity = 1, scale = 1 }) => (
  <g opacity={opacity}>
    {new Array(links).fill(0).map((_, i) => {
      const deg = (i / links) * 360 + rotation;
      const a = (deg * Math.PI) / 180;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const lw = 30 * scale;
      const lh = 46 * scale;

      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${deg + 90})`}>
          <rect
            x={-lw / 2}
            y={-lh / 2}
            width={lw}
            height={lh}
            rx={lw / 2}
            fill="none"
            stroke="#8a8a8a"
            strokeWidth={5 * scale}
          />
          <rect
            x={-lw / 2 + 7 * scale}
            y={-lh / 2 + 9 * scale}
            width={lw - 14 * scale}
            height={lh - 18 * scale}
            rx={(lw - 14 * scale) / 2}
            fill="none"
            stroke="#5a5a5a"
            strokeWidth={3 * scale}
          />
        </g>
      );
    })}
  </g>
);

/** Glossy dark disc with a rim highlight — the "badge" of scenes 2 and 5. */
export const GlossDisc: React.FC<{
  cx: number;
  cy: number;
  r: number;
  id: string;
  rotation?: number;
}> = ({ cx, cy, r, id, rotation = 0 }) => (
  <>
    <defs>
      <radialGradient id={`${id}-body`} cx="38%" cy="30%" r="78%">
        <stop offset="0%" stopColor="#8e8e8e" />
        <stop offset="45%" stopColor="#4a4a4a" />
        <stop offset="80%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#050505" />
      </radialGradient>
      <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0.08)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-body)`} />
    <g transform={`rotate(${rotation} ${cx} ${cy})`}>
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.9}
        fill="none"
        stroke={`url(#${id}-rim)`}
        strokeWidth={r * 0.05}
      />
      <path
        d={`M ${cx - r * 0.66} ${cy - r * 0.48} A ${r * 0.82} ${r * 0.82} 0 0 1 ${
          cx + r * 0.52
        } ${cy - r * 0.62}`}
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth={r * 0.035}
        strokeLinecap="round"
      />
    </g>
  </>
);

/**
 * Every cut passes through this one point, so the white dot is a single
 * unbroken thread from the first scene to the last instead of jumping up
 * and down between them.
 */
export const HANDOFF = { x: 540, y: 1060 };

/**
 * The transition every scene shares: it grows out of a white dot and
 * collapses back into one.
 */
export const Scene: React.FC<{
  durationInFrames: number;
  /** Where the scene pinches down to. */
  /** Where this scene grows out of — the previous scene's pinch point. */
  inOrigin?: { x: number; y: number };
  /** Where it collapses to — the next scene's growth point. */
  outOrigin?: { x: number; y: number };
  inDur?: number;
  outDur?: number;
  children: React.ReactNode;
}> = ({
  durationInFrames,
  inOrigin = HANDOFF,
  outOrigin = HANDOFF,
  inDur = 0.5,
  outDur = 0.33,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grow = spring({
    frame,
    fps,
    durationInFrames: Math.round(fps * inDur),
    config: { damping: 200 },
  });

  const collapse = interpolate(
    frame,
    [durationInFrames - Math.round(fps * outDur), durationInFrames - 1],
    [1, 0],
    clamp,
  );

  const scale =
    interpolate(grow, [0, 1], [0.04, 1]) * interpolate(collapse, [0, 1], [0.04, 1]);
  const opacity =
    interpolate(grow, [0, 0.2], [0, 1], clamp) *
    interpolate(collapse, [0, 0.3], [0, 1], clamp);

  const growing = grow < 0.5;
  const origin = growing ? inOrigin : outOrigin;

  // Tie the dot to the scale, not to the timing: it is bright exactly
  // while the artwork is too small to read, in both directions, so the
  // thread never breaks at a cut.
  const dot = interpolate(scale, [0.04, 0.8], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          opacity,
          transformOrigin: `${growing ? inOrigin.x : outOrigin.x}px ${
            growing ? inOrigin.y : outOrigin.y
          }px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
      {dot > 0.02 ? (
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute" }}
        >
          <Glow
            id="pinch-glow"
            cx={origin.x}
            cy={origin.y}
            r={40 + 70 * dot}
            opacity={dot}
          />
          <circle
            cx={origin.x}
            cy={origin.y}
            r={6 + 12 * dot}
            fill="white"
            opacity={Math.min(1, dot * 1.8)}
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
