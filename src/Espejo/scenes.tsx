import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, DottedRing, Glow, H, Sunburst, W } from "../Cadena/common";
import { Heart, HollowBall, MirrorFrame, SolidBall } from "./art";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {children}
    </svg>
  </AbsoluteFill>
);

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** The trail the others roll away along. */
const A = { x: 620, y: 1330 };
const C = { x: 390, y: 1276 };
const B = { x: 132, y: 1010 };

const onTrail = (p: number) => ({
  x: (1 - p) ** 2 * A.x + 2 * (1 - p) * p * C.x + p ** 2 * B.x,
  y: (1 - p) ** 2 * A.y + 2 * (1 - p) * p * C.y + p ** 2 * B.y,
});

const trailPath = `M ${A.x} ${A.y} Q ${C.x} ${C.y} ${B.x} ${B.y}`;

/** Scene 1 — the others roll off and come apart. You stay. */
export const Leaving: React.FC = () => {
  const t = useT();

  const trail = interpolate(t, [0.1, 0.8], [0, 1], clamp);
  const you = interpolate(t, [0.2, 0.7], [0, 1], clamp);

  const motes = useMemo(
    () =>
      new Array(4).fill(0).map((_, w) =>
        new Array(54).fill(0).map((_, i) => {
          const a = random(`a${w}-${i}`) * Math.PI * 2;
          const rr = Math.sqrt(random(`r${w}-${i}`));
          return {
            ox: Math.cos(a) * rr,
            oy: Math.sin(a) * rr,
            dx: -50 - random(`dx${w}-${i}`) * 110,
            dy: (random(`dy${w}-${i}`) - 0.5) * 90 - 30,
            size: 1.8 + random(`s${w}-${i}`) * 2.8,
            delay: random(`t${w}-${i}`) * 0.32,
          };
        }),
      ),
    [],
  );

  return (
    <Svg>
      <path
        d={trailPath}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - trail}
      />

      {[0, 1, 2, 3].map((i) => {
        const p = interpolate(t, [0, 2.4], [0.16 + i * 0.19, 0.38 + i * 0.19], clamp);
        const pos = onTrail(Math.min(p, 1));
        const r = 58 - 30 * p;
        const goneAt = 0.8 + i * 0.28;
        const gone = interpolate(t, [goneAt, goneAt + 0.5], [0, 1], clamp);

        return (
          <g key={i}>
            <HollowBall
              cx={pos.x}
              cy={pos.y}
              r={r}
              width={5 - 1.6 * p}
              opacity={1 - gone}
            />
            {gone > 0
              ? motes[i].map((m, j) => {
                  const q = interpolate(gone, [m.delay, 1], [0, 1], clamp);
                  return (
                    <circle
                      key={j}
                      cx={pos.x + m.ox * r + m.dx * q}
                      cy={pos.y + m.oy * r + m.dy * q}
                      r={m.size}
                      fill="white"
                      opacity={interpolate(q, [0, 0.2, 0.7, 1], [0, 0.85, 0.5, 0])}
                    />
                  );
                })
              : null}
          </g>
        );
      })}

      <SolidBall id="you-1" cx={722} cy={1274} r={78} opacity={you} glow={you} />
    </Svg>
  );
};

/** Scene 2 — the mirror hands you back whole. */
export const MirrorScene: React.FC = () => {
  const t = useT();

  const frameIn = interpolate(t, [0.1, 0.6], [0, 1], clamp);
  const reveal = interpolate(t, [0.6, 1.5], [0, 1], clamp);
  const heart = interpolate(t, [1.55, 1.9], [0, 1], clamp);
  const beat = 1 + Math.sin(Math.max(0, t - 1.9) * 6) * 0.08;

  const MX = 716;
  const MY = 1128;
  const MS = 2.65;
  const top = MY - 86 * MS;

  return (
    <Svg>
      <defs>
        <clipPath id="mirror-reveal">
          <rect
            x={MX - 220}
            y={top}
            width={440}
            height={172 * MS * reveal}
          />
        </clipPath>
      </defs>

      <Glow id="mirror-glow" cx={MX} cy={MY} r={410} opacity={0.26 * frameIn} core={0.34} />
      <DottedRing cx={MX} cy={MY} r={322} rotation={t * 12} opacity={0.28 * frameIn} />

      <g
        opacity={frameIn}
        transform={`translate(${MX - 100 * MS} ${MY - 88 * MS}) scale(${MS})`}
      >
        <MirrorFrame />
      </g>

      <g clipPath="url(#mirror-reveal)">
        <SolidBall id="you-mirror" cx={MX} cy={MY} r={74} />
      </g>

      <g
        opacity={heart}
        transform={`translate(${MX + 128} ${966}) scale(${0.44 * beat}) translate(-100 -100)`}
      >
        <Heart filled />
      </g>

      <SolidBall id="you-2" cx={296} cy={1186} r={74} glow={0.75} />
    </Svg>
  );
};

/** Scene 3 — the ring closes and you are still whole. */
export const Intact: React.FC = () => {
  const t = useT();

  const ring = interpolate(t, [0.15, 1.2], [0, 1], clamp);
  const burst = interpolate(t, [1.15, 1.65], [0, 1], clamp);
  const beat = 1 + Math.sin(Math.max(0, t - 0.6) * 5.5) * 0.09;

  const CX = 540;
  const CY = 1166;

  const drift = useMemo(
    () =>
      new Array(70).fill(0).map((_, i) => ({
        y: 700 + random(`dy${i}`) * 880,
        start: -140 - random(`ds${i}`) * 1000,
        speed: 280 + random(`dv${i}`) * 320,
        size: 1.7 + random(`dz${i}`) * 2.5,
      })),
    [],
  );

  return (
    <Svg>
      <Sunburst
        cx={CX}
        cy={CY}
        inner={368}
        outer={560}
        rays={110}
        rotation={t * 4}
        color="#4a4a4a"
        width={3}
        opacity={0.85 * burst}
      />

      {drift.map((d, i) => {
        const x = d.start + d.speed * t;
        // The dust sweeps past outside the ring — it never reaches you.
        if (Math.hypot(x - CX, d.y - CY) < 372) {
          return null;
        }

        return (
          <circle
            key={i}
            cx={x}
            cy={d.y}
            r={d.size}
            fill="white"
            opacity={interpolate(x, [-120, 60, 1000, 1200], [0, 0.5, 0.5, 0], clamp)}
          />
        );
      })}

      <DottedRing cx={CX} cy={CY} r={392} rotation={-t * 14} opacity={0.32 * ring} />
      <circle
        cx={CX}
        cy={CY}
        r={336}
        fill="none"
        stroke="white"
        strokeWidth={5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - ring}
        transform={`rotate(-90 ${CX} ${CY})`}
      />

      <SolidBall id="you-3" cx={CX} cy={CY} r={94} glow={0.6 + 0.4 * ring} />
      <g
        transform={`translate(${CX + 176} ${982}) scale(${0.44 * beat}) translate(-100 -100)`}
      >
        <Heart filled />
      </g>
    </Svg>
  );
};
