import React from "react";

/** Props shared by both kinds of dot. */
type Dot = { cx: number; cy: number; r: number; opacity?: number };

/** "You" — a solid, lit ball. */
export const SolidBall: React.FC<Dot & { id: string; glow?: number }> = ({
  cx,
  cy,
  r,
  id,
  opacity = 1,
  glow = 1,
}) => (
  <g opacity={opacity}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
        <stop offset="34%" stopColor="rgba(255,255,255,0.32)" />
        <stop offset="66%" stopColor="rgba(255,255,255,0.08)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r * 2.5} fill={`url(#${id})`} opacity={glow} />
    <circle cx={cx} cy={cy} r={r} fill="#f2f2f2" />
  </g>
);

/** Someone else — an outline only. */
export const HollowBall: React.FC<Dot & { width?: number }> = ({
  cx,
  cy,
  r,
  opacity = 1,
  width = 5,
}) => (
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill="none"
    stroke="white"
    strokeWidth={width}
    opacity={opacity}
  />
);

/** A standing mirror: oval frame on an A-frame stand. */
export const MirrorFrame: React.FC = () => (
  <g
    fill="none"
    stroke="white"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx={100} cy={88} rx={74} ry={86} strokeWidth={6} />
    <ellipse cx={100} cy={88} rx={64} ry={76} strokeWidth={2.5} />
    <path d="M76 168 L100 150 L124 168" strokeWidth={5} />
    <path d="M68 174 h64" strokeWidth={5} />
  </g>
);

export const Heart: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <path
    d="M100 152 C40 108 48 44 76 44 C89 44 100 56 100 66 C100 56 111 44 124 44
       C152 44 160 108 100 152 Z"
    fill={filled ? "white" : "none"}
    stroke="white"
    strokeWidth={10}
    strokeLinejoin="round"
  />
);
