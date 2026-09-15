import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, H, W } from "../Cadena/common";
import { JOST, loadJost } from "./font";

loadJost();

export const LIMITES_DURATION = 270; // 9s at 30fps

/** Centre of the crater, and the point the camera pushes in on. */
const CX = 540;
const CY = 1088;
const RX = 234;
const RY = 112;
const BALL = { x: 540, y: 1066, r: 61 };

/** Everyone standing outside, and what they shout. */
type Accuser = {
  angle: number;
  word?: string;
  /** Where the shout sits relative to the one shouting it. */
  wx?: number;
  wy?: number;
  anchor?: "start" | "middle" | "end";
  at: number;
};

/**
 * The top of the ring is left clear so nothing crowds the sign, and each
 * shout is anchored away from its own ball so the two never overlap.
 */
const ACCUSERS: Accuser[] = [
  { angle: -150, word: "DEMASIADO", wx: 0, wy: -56, anchor: "middle", at: 1.15 },
  { angle: 180, word: "EGOÍSTA", wx: -54, wy: 12, anchor: "end", at: 0.7 },
  { angle: 150, word: "RARO", wx: 0, wy: 60, anchor: "middle", at: 2.7 },
  { angle: 112, at: 2.45 },
  { angle: 78, at: 2.2 },
  { angle: 44, word: "FRÍO", wx: 54, wy: 12, anchor: "start", at: 1.9 },
  { angle: 10, word: "MALO", wx: 54, wy: 12, anchor: "start", at: 1.35 },
  { angle: -22, word: "GROSERO", wx: 54, wy: 12, anchor: "start", at: 1.0 },
];

const AX = 270;
const AY = 240;

const place = (angle: number, rx = AX, ry = AY) => {
  const a = (angle * Math.PI) / 180;
  return { x: CX + Math.cos(a) * rx, y: CY + Math.sin(a) * ry };
};

export const Limites: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // A slow push in that keeps building — the walls close in on the shot.
  const zoom = 1 + 2.6 * interpolate(t, [0, 9], [0, 1], clamp) ** 4.5;

  const rim = interpolate(t, [0.15, 1.1], [0, 1], clamp);
  const ballIn = interpolate(t, [0.2, 0.9], [0, 1], clamp);
  const signIn = interpolate(t, [0.5, 1.2], [0, 1], clamp);
  const pulse = 1 + Math.sin(t * 3.1) * 0.035;

  const debris = useMemo(
    () =>
      new Array(22).fill(0).map((_, i) => {
        const a = (random(`a${i}`) * 360 * Math.PI) / 180;
        const k = 1.02 + random(`k${i}`) * 0.22;
        const w = 7 + random(`w${i}`) * 9;
        return {
          x: CX + Math.cos(a) * RX * k,
          y: CY + Math.sin(a) * RY * k,
          w,
          rot: random(`r${i}`) * 360,
        };
      }),
    [],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="ball-glow">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="26%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.13)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="floor-pool">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <g transform={`translate(${CX} ${CY}) scale(${zoom}) translate(${-CX} ${-CY})`}>
          {/* the ground inside the line */}
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="#050505" opacity={rim} />
          <ellipse
            cx={CX}
            cy={CY + 26}
            rx={RX * 0.72}
            ry={RY * 0.62}
            fill="url(#floor-pool)"
            opacity={ballIn}
          />
          <ellipse
            cx={CX}
            cy={CY}
            rx={RX}
            ry={RY}
            fill="none"
            stroke="white"
            strokeWidth={3}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - rim}
          />

          {debris.map((d, i) => (
            <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.rot})`} opacity={rim * 0.7}>
              <path
                d={`M${-d.w / 2} 0 L${-d.w / 4} ${-d.w / 2.6} L${d.w / 2} ${-d.w / 5} L${
                  d.w / 3
                } ${d.w / 3} Z`}
                fill="none"
                stroke="white"
                strokeWidth={2}
              />
            </g>
          ))}

          {/* the sign: my limits */}
          <g opacity={signIn}>
            <line
              x1={CX + 5}
              y1={CY - RY + 4}
              x2={CX + 5}
              y2={CY - RY - 104}
              stroke="white"
              strokeWidth={4}
            />
            <path
              d={`M${CX - 80} ${CY - RY - 216} h170 v112 h-170 z`}
              fill="#040404"
              stroke="white"
              strokeWidth={4}
            />
            <path
              d={`M${CX - 88} ${CY - RY - 216} h186 M${CX - 88} ${CY - RY - 104} h186`}
              stroke="white"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <text
              x={CX + 5}
              y={CY - RY - 176}
              textAnchor="middle"
              fill="white"
              fontFamily={JOST}
              fontWeight={500}
              fontSize={38}
              letterSpacing={1.5}
            >
              MIS
            </text>
            <text
              x={CX + 5}
              y={CY - RY - 130}
              textAnchor="middle"
              fill="white"
              fontFamily={JOST}
              fontWeight={500}
              fontSize={38}
              letterSpacing={1.5}
            >
              LÍMITES
            </text>
          </g>

          {/* everyone outside, pointing in */}
          {ACCUSERS.map((acc, i) => {
            const p = place(acc.angle);
            const appear = interpolate(t, [acc.at, acc.at + 0.35], [0, 1], clamp);
            if (appear <= 0) {
              return null;
            }

            const a = (acc.angle * Math.PI) / 180;
            const jab = Math.sin(t * 5 + i) * 7;
            const from = 44 + jab;
            const to = 112 + jab;
            const ax = p.x - Math.cos(a) * from;
            const ay = p.y - Math.sin(a) * from;
            const bx = p.x - Math.cos(a) * to;
            const by = p.y - Math.sin(a) * to;
            const head = 14;

            return (
              <g key={i} opacity={appear}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={32}
                  fill="none"
                  stroke="white"
                  strokeWidth={4}
                />
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke="white" strokeWidth={4} />
                <path
                  d={`M${bx} ${by} L${bx + Math.cos(a - 2.5) * head} ${
                    by + Math.sin(a - 2.5) * head
                  } M${bx} ${by} L${bx + Math.cos(a + 2.5) * head} ${
                    by + Math.sin(a + 2.5) * head
                  }`}
                  stroke="white"
                  strokeWidth={4}
                  strokeLinecap="round"
                  fill="none"
                />
                {acc.word ? (
                  <text
                    x={p.x + (acc.wx ?? 0)}
                    y={p.y + (acc.wy ?? -70)}
                    textAnchor={acc.anchor ?? "middle"}
                    fill="white"
                    fontFamily={JOST}
                    fontWeight={500}
                    fontSize={40}
                    letterSpacing={1.5}
                  >
                    {acc.word}
                  </text>
                ) : null}
              </g>
            );
          })}

          {/* you */}
          <g opacity={ballIn}>
            <circle
              cx={BALL.x}
              cy={BALL.y}
              r={BALL.r * 3.2 * pulse}
              fill="url(#ball-glow)"
            />
            <circle cx={BALL.x} cy={BALL.y} r={BALL.r * pulse} fill="#fbfbfb" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
