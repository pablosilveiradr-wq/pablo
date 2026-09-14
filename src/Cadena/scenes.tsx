import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Avatar,
  BrainSide,
  BrainTop,
  Bulb,
  Dumbbell,
  Folder,
  GLYPHS,
  Magnifier,
  RainCloud,
  Stopwatch,
  SunRays,
} from "./art";
import {
  ChainRing,
  clamp,
  DottedRing,
  GlossDisc,
  Glow,
  H,
  Sunburst,
  W,
} from "./common";

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

/** Scene 1 — the lit ball riding a column that rises out of the floor. */
export const Tower: React.FC = () => {
  const t = useT();
  const top = interpolate(t, [0.1, 0.45, 1.0, 1.4], [1900, 998, 816, 802], clamp);
  const r = interpolate(t, [0.1, 0.45, 1.0], [52, 70, 87], clamp);
  const cy = top - r;

  return (
    <Svg>
      <circle
        cx={540}
        cy={cy}
        r={r * 1.85}
        fill="none"
        stroke="#1d1d1d"
        strokeWidth={4}
      />
      <Glow id="tower-glow" cx={540} cy={cy} r={r * 2.6} />
      <circle cx={540} cy={cy} r={r} fill="#ededed" />
      <rect
        x={447}
        y={top}
        width={186}
        height={H - top + 60}
        fill="none"
        stroke="white"
        strokeWidth={4}
      />
    </Svg>
  );
};

/** Scene 2 — the glossy badge with the brain and the icon that flips. */
export const BrainBadge: React.FC = () => {
  const t = useT();
  const spin = t * 10;
  // Heart first, then it inverts into a tick.
  const flip = interpolate(t, [0.9, 1.25], [0, 1], clamp);

  return (
    <Svg>
      <DottedRing cx={540} cy={1080} r={385} rotation={-spin} opacity={0.45} />
      <GlossDisc cx={540} cy={1080} r={326} id="badge" rotation={spin * 0.5} />
      <g transform="translate(260 800) scale(2.8)">
        <BrainTop />
      </g>
      <circle
        cx={540}
        cy={1080}
        r={81}
        fill={flip > 0.5 ? "white" : "#0a0a0a"}
        stroke="white"
        strokeWidth={5}
      />
      <g opacity={1 - flip}>
        <path
          d="M540 1122 C500 1094 504 1054 524 1054 C532 1054 540 1062 540 1068
             C540 1062 548 1054 556 1054 C576 1054 580 1094 540 1122 Z"
          fill="none"
          stroke="white"
          strokeWidth={6}
        />
        <circle cx={540} cy={1080} r={7} fill="#5a5a5a" />
      </g>
      <path
        d="M512 1080 L532 1100 L572 1058"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={flip}
      />
    </Svg>
  );
};

const CAGE = { x0: 298, x1: 782, y0: 642, y1: 1110 };
/**
 * The chain hangs slack: it drops out of the cage, swings left and loops
 * back along the bottom to the ball. Link positions and angles are taken
 * off the reference.
 */
const CHAIN = [
  { x: 470, y: 1102, rot: 80 },
  { x: 506, y: 1131, rot: 150 },
  { x: 441, y: 1146, rot: 168 },
  { x: 402, y: 1177, rot: 75 },
  { x: 446, y: 1202, rot: 2 },
  { x: 505, y: 1202, rot: 0 },
];
const BALL = { x: 592, y: 1191, r: 53 };

/** Scene 3 — the caged brain, which then crumbles into dust. */
export const Cage: React.FC = () => {
  const t = useT();

  const bars = interpolate(t, [0.05, 0.5], [0, 1], clamp);
  const chain = interpolate(t, [0.15, 0.6], [0, 1], clamp);
  const brain = interpolate(t, [0.65, 1.25], [0, 1], clamp);
  // From about a third of the way in, everything starts coming apart.
  const dust = interpolate(t, [1.7, 2.75], [0, 1], clamp);
  const solid = 1 - dust;

  const motes = useMemo(
    () =>
      new Array(340).fill(0).map((_, i) => {
        const onBar = random(`w${i}`) < 0.78;
        let x: number;
        let y: number;

        if (onBar) {
          const col = Math.floor(random(`c${i}`) * 7);
          x = CAGE.x0 + (col * (CAGE.x1 - CAGE.x0)) / 6;
          y = CAGE.y0 + random(`y${i}`) * (CAGE.y1 - CAGE.y0);
        } else {
          const a = random(`a${i}`) * Math.PI * 2;
          const rr = random(`r${i}`) * BALL.r;
          x = BALL.x + Math.cos(a) * rr;
          y = BALL.y + Math.sin(a) * rr;
          if (random(`k${i}`) < 0.4) {
            const l = CHAIN[Math.floor(random(`kl${i}`) * CHAIN.length)];
            x = l.x + (random(`kx${i}`) - 0.5) * 40;
            y = l.y + (random(`ky${i}`) - 0.5) * 34;
          }
        }

        return {
          x,
          y,
          dx: (random(`dx${i}`) - 0.5) * 80,
          dy: (random(`dy${i}`) - 0.5) * 64 - 12,
          size: 1.6 + random(`s${i}`) * 2.6,
          delay: random(`t${i}`) * 0.35,
        };
      }),
    [],
  );

  const barXs = new Array(7)
    .fill(0)
    .map((_, i) => CAGE.x0 + (i * (CAGE.x1 - CAGE.x0)) / 6);

  return (
    <Svg>
      <g stroke="#5f5f5f" strokeWidth={3} opacity={solid}>
        <line
          x1={CAGE.x0}
          y1={CAGE.y0}
          x2={CAGE.x0 + (CAGE.x1 - CAGE.x0) * bars}
          y2={CAGE.y0}
        />
        <line
          x1={CAGE.x0}
          y1={CAGE.y1}
          x2={CAGE.x0 + (CAGE.x1 - CAGE.x0) * bars}
          y2={CAGE.y1}
        />
        {barXs.map((x, i) => {
          const p = interpolate(bars, [i / 10, 0.7 + i / 24], [0, 1], clamp);
          return (
            <line
              key={x}
              x1={x}
              y1={CAGE.y0}
              x2={x}
              y2={CAGE.y0 + (CAGE.y1 - CAGE.y0) * p}
            />
          );
        })}
      </g>

      <g opacity={solid * chain}>
        <g stroke="white" strokeWidth={4} strokeLinecap="round">
          {CHAIN.slice(1).map((l, i) => (
            <line
              key={i}
              x1={CHAIN[i].x}
              y1={CHAIN[i].y}
              x2={l.x}
              y2={l.y}
            />
          ))}
          <line
            x1={CHAIN[CHAIN.length - 1].x}
            y1={CHAIN[CHAIN.length - 1].y}
            x2={BALL.x - BALL.r + 6}
            y2={BALL.y}
          />
        </g>
        {CHAIN.map((l, i) => (
          <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
            <rect
              x={-19}
              y={-15}
              width={38}
              height={30}
              rx={14}
              fill="#000"
              stroke="white"
              strokeWidth={4.5}
            />
          </g>
        ))}
        <circle cx={BALL.x} cy={BALL.y} r={BALL.r} fill="#dcdcdc" />
      </g>

      <g opacity={brain} transform="translate(397 749) scale(1.55)">
        <BrainSide />
      </g>

      {dust > 0 ? (
        <g>
          {motes.map((m, i) => {
            const p = interpolate(dust, [m.delay, 1], [0, 1], clamp);
            return (
              <circle
                key={i}
                cx={m.x + m.dx * p}
                cy={m.y + m.dy * p}
                r={m.size}
                fill="white"
                opacity={interpolate(p, [0, 0.25, 0.8, 1], [0, 0.85, 0.6, 0])}
              />
            );
          })}
        </g>
      ) : null}
    </Svg>
  );
};

const ORBIT_C = { x: 540, y: 990 };
const SATS = [Dumbbell, Bulb, RainCloud, SunRays];

/** Scene 4 — the brain at the centre of a spinning system. */
export const Orbit: React.FC = () => {
  const t = useT();
  const spin = 600 * Math.pow(Math.max(0, t - 1.5), 2.2);
  const speed =
    600 * 2.2 * Math.pow(Math.max(0.001, t - 1.5), 1.2) * (t > 1.5 ? 1 : 0);
  const blur = interpolate(speed, [60, 900], [0, 14], clamp);
  const appear = interpolate(t, [0.35, 0.9], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g opacity={appear * 0.55}>
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2 + Math.PI / 4 + (t * 3 * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={ORBIT_C.x + Math.cos(a) * 190}
                cy={ORBIT_C.y + 40 + Math.sin(a) * 190}
                r={420}
                fill="none"
                stroke="#4e4e4e"
                strokeWidth={4}
                strokeDasharray="10 12"
              />
            );
          })}
          <circle
            cx={ORBIT_C.x}
            cy={ORBIT_C.y}
            r={387}
            fill="none"
            stroke="#5a5a5a"
            strokeWidth={4}
          />
        </g>
        <DottedRing
          cx={ORBIT_C.x}
          cy={ORBIT_C.y}
          r={213}
          opacity={0.5 * appear}
          rotation={spin * 0.2}
        />
        <circle
          cx={ORBIT_C.x}
          cy={ORBIT_C.y}
          r={189}
          fill="#000"
          stroke="white"
          strokeWidth={4}
        />
        <g transform={`translate(${ORBIT_C.x - 115} ${ORBIT_C.y - 98}) scale(1.15)`}>
          <BrainSide />
        </g>
      </svg>

      <AbsoluteFill
        style={{
          filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
          opacity: appear,
        }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {SATS.map((Icon, i) => {
            const deg = (i / SATS.length) * 360 - 90 + spin;
            const a = (deg * Math.PI) / 180;
            const x = ORBIT_C.x + Math.cos(a) * 387;
            const y = ORBIT_C.y + Math.sin(a) * 387;

            return (
              <g key={i}>
                <circle cx={x} cy={y} r={94} fill="rgba(255,255,255,0.20)" />
                <g transform={`translate(${x - 85} ${y - 85}) scale(0.85)`}>
                  <Icon />
                </g>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scene 5 — the portrait ringed by chain, and the stopwatch it drags. */
export const AvatarChain: React.FC = () => {
  const t = useT();
  const move = interpolate(t, [1.25, 2.1], [0, 1], clamp);
  const cy = interpolate(move, [0, 1], [1010, 800]);
  const chainR = interpolate(move, [0, 1], [364, 250]);
  const discR = interpolate(move, [0, 1], [253, 176]);
  const watch = interpolate(t, [1.5, 2.2], [0, 1], clamp);
  const sweep = interpolate(t, [1.9, 3.5], [0, 0.3], clamp);
  const wy = 1470;

  return (
    <Svg>
      <GlossDisc cx={540} cy={cy} r={discR} id="avatar" rotation={t * 6} />
      <Glow
        id="av-glow"
        cx={540}
        cy={cy + discR * 0.05}
        r={discR * 0.95}
        opacity={0.85}
        core={0.8}
      />
      <g
        transform={`translate(${540 - discR * 0.82} ${cy - discR * 0.86}) scale(${
          (discR * 1.64) / 200
        })`}
      >
        <Avatar />
      </g>
      <ChainRing
        cx={540}
        cy={cy}
        r={chainR}
        links={Math.round(chainR / 11)}
        rotation={t * 5}
        scale={chainR / 303}
      />

      <g opacity={watch}>
        <line
          x1={540}
          y1={cy + chainR + 12}
          x2={540}
          y2={wy - 150}
          stroke="white"
          strokeWidth={5}
          strokeDasharray="3 18"
          strokeLinecap="round"
        />
        <Glow id="watch-glow" cx={540} cy={wy} r={182} opacity={1} core={1} />
        <circle cx={540} cy={wy} r={112} fill="#040404" />
        <g transform={`translate(${540 - 160} ${wy - 179}) scale(1.6)`}>
          <Stopwatch sweep={sweep} />
        </g>
      </g>
    </Svg>
  );
};

/** Scene 6 — the folder that is not happy, until it is clicked. */
export const SadFolder: React.FC = () => {
  const t = useT();
  const mood = interpolate(t, [2.1, 2.22], [0, 1], clamp);
  const cursor = interpolate(t, [1.55, 2.1], [0, 1], clamp);
  const flash = interpolate(t, [2.22, 2.4, 2.62], [0, 1, 0], clamp);

  return (
    <Svg>
      <Sunburst
        cx={540}
        cy={1068}
        inner={150}
        outer={333 + flash * 60}
        rotation={t * 4}
        opacity={0.9}
        color={`rgb(${58 + flash * 150},${58 + flash * 150},${58 + flash * 150})`}
      />
      {flash > 0.01 ? (
        <Glow
          id="click-flash"
          cx={540}
          cy={1068}
          r={430}
          opacity={flash * 0.5}
          core={0.5}
        />
      ) : null}
      <g transform="translate(292 830) scale(2.44)">
        <Folder mood={mood} />
      </g>
      {cursor > 0 ? (
        <g
          opacity={cursor}
          transform={`translate(${interpolate(cursor, [0, 1], [706, 452])} ${interpolate(
            cursor,
            [0, 1],
            [1352, 1102],
          )}) scale(${2.1 * interpolate(flash, [0, 1], [1, 0.88])})`}
        >
          <path
            d="M0 0 L0 52 L13 40 L23 62 L34 56 L24 35 L42 34 Z"
            fill="white"
            stroke="#111"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </Svg>
  );
};

const COLS = [438, 549, 660];
const ROWS = [837, 943, 1049, 1155, 1261];

/** Scene 7 — the card of shapes being sifted through. */
export const Cards: React.FC = () => {
  const t = useT();
  const step = Math.floor(t / 0.42);
  const mag = {
    x: interpolate(t, [0.6, 1.6, 2.6], [648, 452, 604], clamp),
    y: interpolate(t, [0.6, 1.6, 2.6], [1230, 1064, 1180], clamp),
  };
  const appear = interpolate(t, [0.1, 0.5], [0, 1], clamp);

  return (
    <Svg>
      <Sunburst
        cx={540}
        cy={1050}
        inner={175}
        outer={315}
        rays={110}
        rotation={t * 3}
        color="#5e5e5e"
        width={3}
        opacity={0.95 * appear}
      />
      <Glow id="cards-glow" cx={540} cy={1050} r={330} opacity={0.18} core={0.3} />

      <rect
        x={311}
        y={777}
        width={387}
        height={612}
        rx={16}
        fill="#000"
        stroke="white"
        strokeWidth={4}
        opacity={appear}
      />
      <rect
        x={347}
        y={744}
        width={387}
        height={612}
        rx={16}
        fill="#000"
        stroke="white"
        strokeWidth={4}
      />
      <rect x={728} y={960} width={14} height={86} rx={7} fill="#cfcfcf" />

      <g fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round">
        {ROWS.map((y, r) =>
          COLS.map((x, c) => {
            const pick =
              Math.floor(random(`g${step}-${r}-${c}`) * GLYPHS.length) %
              GLYPHS.length;
            return (
              <g key={`${r}-${c}`} transform={`translate(${x} ${y}) scale(1.9)`}>
                {GLYPHS[pick](`${step}-${r}-${c}`)}
              </g>
            );
          }),
        )}
      </g>

      <g transform={`translate(${mag.x - 90} ${mag.y - 90}) scale(1.55)`}>
        <Magnifier />
      </g>
    </Svg>
  );
};
