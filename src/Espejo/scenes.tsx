import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, DottedRing, Glow, H, Sunburst, W } from "../Cadena/common";
import { FigureBack, FigureFront, Heart, MirrorFrame, Walker } from "./art";

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

/** Places a 200x200 drawing with its feet on (x, y). */
const stand = (x: number, y: number, s: number) =>
  `translate(${x - 100 * s} ${y - 200 * s}) scale(${s})`;

/** The trail the crowd walks away along. */
const A = { x: 600, y: 1350 };
const C = { x: 380, y: 1292 };
const B = { x: 130, y: 1012 };

const onTrail = (p: number) => ({
  x: (1 - p) ** 2 * A.x + 2 * (1 - p) * p * C.x + p ** 2 * B.x,
  y: (1 - p) ** 2 * A.y + 2 * (1 - p) * p * C.y + p ** 2 * B.y,
});

const trailPath = `M ${A.x} ${A.y} Q ${C.x} ${C.y} ${B.x} ${B.y}`;

/** Scene 1 — people walking off and coming apart. One stays. */
export const Leaving: React.FC = () => {
  const t = useT();

  const trail = interpolate(t, [0.1, 0.8], [0, 1], clamp);
  const you = interpolate(t, [0.25, 0.8], [0, 1], clamp);

  const motes = useMemo(
    () =>
      new Array(4).fill(0).map((_, w) =>
        new Array(60).fill(0).map((_, i) => ({
          ox: (random(`x${w}-${i}`) - 0.5) * 110,
          oy: (random(`y${w}-${i}`) - 0.5) * 180,
          dx: -40 - random(`dx${w}-${i}`) * 90,
          dy: (random(`dy${w}-${i}`) - 0.5) * 70 - 20,
          size: 2 + random(`s${w}-${i}`) * 3,
          delay: random(`t${w}-${i}`) * 0.3,
        })),
      ),
    [],
  );

  return (
    <Svg>
      <path
        d={trailPath}
        fill="none"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth={4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - trail}
      />

      {[0, 1, 2, 3].map((i) => {
        const p = interpolate(t, [0, 2.4], [0.18 + i * 0.185, 0.4 + i * 0.185], clamp);
        const pos = onTrail(Math.min(p, 1));
        const s = 0.95 - 0.53 * p;
        const goneAt = 0.85 + i * 0.28;
        const gone = interpolate(t, [goneAt, goneAt + 0.5], [0, 1], clamp);

        return (
          <g key={i}>
            <g opacity={1 - gone} transform={stand(pos.x, pos.y, s)}>
              <Walker phase={t * 7 + i * 1.4} />
            </g>
            {gone > 0
              ? motes[i].map((m, j) => {
                  const q = interpolate(gone, [m.delay, 1], [0, 1], clamp);
                  return (
                    <circle
                      key={j}
                      cx={pos.x + m.ox * s + m.dx * q}
                      cy={pos.y - 100 * s + m.oy * s + m.dy * q}
                      r={m.size}
                      fill="white"
                      opacity={interpolate(q, [0, 0.2, 0.7, 1], [0, 0.8, 0.5, 0])}
                    />
                  );
                })
              : null}
          </g>
        );
      })}

      <g opacity={you} transform={stand(688, 1368, 2.05)}>
        <FigureBack />
      </g>
    </Svg>
  );
};

/** Scene 2 — the mirror gives the whole self back. */
export const MirrorScene: React.FC = () => {
  const t = useT();

  const frameIn = interpolate(t, [0.1, 0.6], [0, 1], clamp);
  const reveal = interpolate(t, [0.55, 1.6], [0, 1], clamp);
  const heart = interpolate(t, [1.6, 1.95], [0, 1], clamp);
  const beat = 1 + Math.sin(Math.max(0, t - 1.9) * 6) * 0.07;

  const MX = 716;
  const MY = 1128;
  const MS = 2.65;
  const top = MY - 86 * MS;
  const height = 172 * MS;

  return (
    <Svg>
      <defs>
        <clipPath id="mirror-reveal">
          <rect x={MX - 200} y={top} width={400} height={height * reveal} />
        </clipPath>
      </defs>

      <Glow id="mirror-glow" cx={MX} cy={MY} r={410} opacity={0.3 * frameIn} core={0.4} />
      <DottedRing
        cx={MX}
        cy={MY}
        r={322}
        rotation={t * 12}
        opacity={0.3 * frameIn}
      />

      <g opacity={frameIn} transform={`translate(${MX - 100 * MS} ${MY - 88 * MS}) scale(${MS})`}>
        <MirrorFrame />
      </g>

      <g clipPath="url(#mirror-reveal)">
        <g transform={stand(MX, 1292, 1.6)}>
          <FigureFront />
        </g>
      </g>

      <g
        opacity={heart}
        transform={`translate(${MX + 122} ${1006}) scale(${0.46 * beat}) translate(-100 -100)`}
      >
        <Heart filled />
      </g>

      <g transform={stand(302, 1476, 2.26)}>
        <FigureBack />
      </g>
    </Svg>
  );
};

/** Scene 3 — the ring closes and the self is still whole. */
export const Intact: React.FC = () => {
  const t = useT();

  const ring = interpolate(t, [0.15, 1.25], [0, 1], clamp);
  const burst = interpolate(t, [1.2, 1.7], [0, 1], clamp);
  const beat = 1 + Math.sin(Math.max(0, t - 0.6) * 5.5) * 0.09;

  const CX = 540;
  const CY = 1166;

  const drift = useMemo(
    () =>
      new Array(60).fill(0).map((_, i) => ({
        y: 780 + random(`dy${i}`) * 740,
        start: -120 - random(`ds${i}`) * 900,
        speed: 260 + random(`dv${i}`) * 300,
        size: 1.6 + random(`dz${i}`) * 2.4,
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
        // The dust sweeps past outside the ring — it never reaches the figure.
        const dist = Math.hypot(x - CX, d.y - CY);
        if (dist < 382) {
          return null;
        }

        return (
          <circle
            key={i}
            cx={x}
            cy={d.y}
            r={d.size}
            fill="white"
            opacity={interpolate(x, [-100, 60, 1000, 1180], [0, 0.5, 0.5, 0], clamp)}
          />
        );
      })}

      <DottedRing cx={CX} cy={CY} r={392} rotation={-t * 14} opacity={0.35 * ring} />
      <Glow id="intact-glow" cx={CX} cy={CY} r={366} opacity={0.34 * ring} core={0.3} />
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

      <g transform={stand(CX, 1424, 2.3)}>
        <FigureFront />
      </g>
      <g
        transform={`translate(${CX + 146} ${994}) scale(${0.44 * beat}) translate(-100 -100)`}
      >
        <Heart filled />
      </g>
    </Svg>
  );
};
