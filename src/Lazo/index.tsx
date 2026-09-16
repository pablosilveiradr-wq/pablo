import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, H, W } from "../Cadena/common";

/**
 * "Cuanto más tirás, más aprieta." A ball caught in a noose: the harder
 * it pulls away, the tighter the loop closes on it. It stops pulling,
 * the rope goes slack, and the loop opens on its own and falls away.
 *
 * No text — the pull and the release carry it.
 */
export const LAZO_DURATION = 255; // 8.5s at 30fps

/** Where the rope is tied, off the top-left of the frame. */
const ANCHOR = { x: -170, y: 360 };
const HOME = { x: 540, y: 1060 };
const BALL_R = 92;

/** An arc of `sweep` of a full turn, starting at `from` degrees. */
const loopPath = (cx: number, cy: number, r: number, from: number, sweep: number) => {
  const a0 = (from * Math.PI) / 180;
  const a1 = ((from + sweep * 360) * Math.PI) / 180;
  const p0 = { x: cx + Math.cos(a0) * r, y: cy + Math.sin(a0) * r };
  const p1 = { x: cx + Math.cos(a1) * r, y: cy + Math.sin(a1) * r };

  if (sweep > 0.995) {
    return `M ${p0.x} ${p0.y} A ${r} ${r} 0 1 1 ${cx - (p0.x - cx)} ${
      cy - (p0.y - cy)
    } A ${r} ${r} 0 1 1 ${p0.x} ${p0.y}`;
  }

  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${sweep > 0.5 ? 1 : 0} 1 ${p1.x} ${p1.y}`;
};

export const Lazo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const fadeIn = interpolate(t, [0, 0.5], [0, 1], clamp);

  // How hard it is pulling, 0 to 1, and how far it has got.
  const pull = interpolate(t, [0.6, 2.4, 3.3, 3.6, 4.8], [0, 0.75, 1, 1, 0], clamp);
  const strain = interpolate(t, [2.2, 3.3, 3.5, 4.4], [0, 1, 1, 0], clamp);
  // The tremor of something straining against a rope.
  const shake = strain * 5 * Math.sin(t * 42) + strain * 3 * Math.sin(t * 27);

  const cx = HOME.x + pull * 44 + shake;
  const cy = HOME.y - pull * 26 + shake * 0.4;

  // Tightening while it pulls; then the loop opens on its own.
  const opening = interpolate(t, [5.2, 7.2], [0, 1], clamp);
  const r =
    interpolate(pull, [0, 1], [172, 102]) + interpolate(opening, [0, 1], [0, 250]);
  const sweep = interpolate(opening, [0.25, 1], [1, 0.5], clamp);
  const spin = interpolate(opening, [0, 1], [0, 210], clamp);

  // Where the rope meets the loop.
  const toAnchor = Math.atan2(ANCHOR.y - cy, ANCHOR.x - cx);
  const kx = cx + Math.cos(toAnchor) * r;
  const ky = cy + Math.sin(toAnchor) * r;

  // Taut when it pulls, slack the moment it lets go.
  const sag = interpolate(pull, [0, 1], [190, 0]) + interpolate(t, [4.6, 5.6], [0, 90], clamp);
  const fall = interpolate(t, [6.2, 8.1], [0, 1], clamp);
  const mx = (ANCHOR.x + kx) / 2;
  const my = (ANCHOR.y + ky) / 2 + sag + fall * 900;

  const ropeFade = interpolate(t, [6.8, 8.1], [1, 0], clamp);
  const loopFade = interpolate(t, [6.6, 7.8], [1, 0], clamp);

  // It breathes once it is free.
  const free = interpolate(t, [5.6, 7.6], [0, 1], clamp);
  const breathe = 1 + free * Math.sin((t - 5.6) * 1.9) * 0.05;
  const squeeze = 1 - strain * 0.045;

  const ticks = useMemo(
    () => new Array(7).fill(0).map((_, i) => 26 + i * 44 + random(`k${i}`) * 18),
    [],
  );

  const halo = interpolate(t, [6.2, 8.5], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="lazo-glow">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="28%" stopColor="rgba(255,255,255,0.38)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <g opacity={fadeIn}>
          {/* the calm that arrives once nothing is pulling */}
          {halo > 0 ? (
            <circle
              cx={cx}
              cy={cy}
              r={200 + halo * 430}
              fill="none"
              stroke="white"
              strokeWidth={3}
              strokeDasharray="0.1 22"
              strokeLinecap="round"
              opacity={(1 - halo) * 0.5}
            />
          ) : null}

          {/* the rope */}
          <path
            d={`M ${ANCHOR.x} ${ANCHOR.y} Q ${mx} ${my} ${kx} ${ky + fall * 980}`}
            fill="none"
            stroke="white"
            strokeWidth={6}
            strokeLinecap="round"
            opacity={ropeFade}
          />

          {/* the loop around it */}
          <g
            opacity={loopFade}
            transform={`rotate(${spin} ${cx} ${cy}) translate(0 ${fall * 980})`}
          >
            <path
              d={loopPath(cx, cy, r, (toAnchor * 180) / Math.PI, sweep)}
              fill="none"
              stroke="white"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </g>

          {/* strain marks, only while it fights */}
          {strain > 0.02
            ? ticks.map((deg, i) => {
                const a = ((deg + 200) * Math.PI) / 180;
                const len = 16 + strain * 26;
                return (
                  <line
                    key={i}
                    x1={cx + Math.cos(a) * (r + 16)}
                    y1={cy + Math.sin(a) * (r + 16)}
                    x2={cx + Math.cos(a) * (r + 16 + len)}
                    y2={cy + Math.sin(a) * (r + 16 + len)}
                    stroke="white"
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity={strain * 0.75}
                  />
                );
              })
            : null}

          {/* the ball */}
          <circle
            cx={cx}
            cy={cy}
            r={BALL_R * (3.1 + free * 1.1) * breathe}
            fill="url(#lazo-glow)"
            opacity={0.55 + free * 0.45 - strain * 0.25}
          />
          <ellipse
            cx={cx}
            cy={cy}
            rx={BALL_R * squeeze * breathe}
            ry={BALL_R * (2 - squeeze) * breathe}
            fill="#fbfbfb"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
