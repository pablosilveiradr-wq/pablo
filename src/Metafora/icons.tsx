import React from "react";
import { interpolate } from "remotion";
import { theme } from "./theme";

/**
 * Every icon is a list of SVG paths drawn inside a 100x100 viewBox.
 * Keeping them as raw path data lets <LineArt /> animate the stroke of
 * each path independently (the "draw-on" look of the reference videos).
 */

const circle = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;

const ray = (cx: number, cy: number, inner: number, outer: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return `M ${cx + Math.cos(rad) * inner} ${cy + Math.sin(rad) * inner} L ${
    cx + Math.cos(rad) * outer
  } ${cy + Math.sin(rad) * outer}`;
};

export const ICONS = {
  brain: [
    "M50 16 C40 12 30 18 30 26 C22 26 18 34 21 40 C14 44 14 54 21 58 C19 66 26 74 34 72 C38 80 46 84 50 80 Z",
    "M50 16 C60 12 70 18 70 26 C78 26 82 34 79 40 C86 44 86 54 79 58 C81 66 74 74 66 72 C62 80 54 84 50 80 Z",
    "M50 16 L50 80",
    "M30 26 C38 30 40 36 34 40",
    "M70 26 C62 30 60 36 66 40",
    "M21 40 C30 44 34 50 28 56",
    "M79 40 C70 44 66 50 72 56",
  ],
  cage: [
    "M20 22 L80 22",
    "M20 78 L80 78",
    "M26 22 L26 78",
    "M38 22 L38 78",
    "M50 22 L50 78",
    "M62 22 L62 78",
    "M74 22 L74 78",
  ],
  ballchain: [
    circle(64, 66, 16),
    circle(42, 56, 5),
    circle(32, 50, 5),
    circle(22, 44, 5),
    "M47 59 L50 61",
    "M37 53 L40 55",
  ],
  stopwatch: [
    circle(50, 54, 30),
    "M43 16 L57 16",
    "M50 16 L50 24",
    "M50 54 L50 36",
    "M50 54 L64 62",
    "M50 26 L50 30",
    "M78 54 L74 54",
    "M50 82 L50 78",
    "M22 54 L26 54",
  ],
  camera: [
    "M16 36 h18 l6 -8 h20 l6 8 h18 a6 6 0 0 1 6 6 v30 a6 6 0 0 1 -6 6 h-62 a6 6 0 0 1 -6 -6 v-30 a6 6 0 0 1 6 -6 z",
    circle(50, 57, 15),
    "M44 54 l0 -3",
    "M56 54 l0 -3",
    "M43 64 q7 -7 14 0",
  ],
  folder: [
    "M14 74 v-40 h20 l6 8 h34 v32 z",
    "M22 80 v-40 h20 l6 8 h34 v32 z",
    "M56 72 L56 50",
    "M48 58 L56 50 L64 58",
  ],
  cards: [
    "M22 22 h48 a4 4 0 0 1 4 4 v54 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 v-54 a4 4 0 0 1 4 -4 z",
    "M30 22 h48 a4 4 0 0 1 4 4 v54 a4 4 0 0 1 -4 4",
    circle(34, 38, 5),
    "M50 33 l5 5 l-5 5 l-5 -5 z",
    "M62 33 h10 v10 h-10 z",
    "M29 55 l5 8 h-10 z",
    circle(50, 59, 5),
    "M57 64 h10 v-10 z",
    circle(34, 74, 4),
    "M45 78 h10 v-9 h-10 z",
  ],
  person: [
    circle(50, 42, 17),
    "M34 35 C34 20 66 20 66 35",
    "M34 35 a5 5 0 0 1 0 -9",
    "M43 26 a5 5 0 0 1 0 -9",
    "M54 25 a5 5 0 0 1 0 -9",
    "M64 29 a5 5 0 0 1 0 -9",
    "M44 42 l0 -4",
    "M56 42 l0 -4",
    "M44 50 q6 5 12 0",
    "M30 96 v-16 a20 20 0 0 1 40 0 v16",
  ],
  dumbbell: [
    "M30 50 h40",
    "M22 42 h8 v16 h-8 z",
    "M70 42 h8 v16 h-8 z",
    "M16 46 v8",
    "M84 46 v8",
  ],
  bulb: [
    "M50 20 a20 20 0 0 1 12 36 v6 h-24 v-6 a20 20 0 0 1 12 -36 z",
    "M40 70 h20",
    "M43 78 h14",
  ],
  rain: [
    "M32 56 a12 12 0 0 1 2 -24 a16 16 0 0 1 30 4 a10 10 0 0 1 -2 20 z",
    "M38 64 l-4 10",
    "M50 64 l-4 10",
    "M62 64 l-4 10",
  ],
  sun: [
    circle(50, 50, 14),
    ...[0, 45, 90, 135, 180, 225, 270, 315].map((d) => ray(50, 50, 20, 30, d)),
  ],
  loop: [
    "M50 22 a28 28 0 1 1 -24 14",
    "M50 22 l-10 -8",
    "M50 22 l-10 8",
  ],
  heart: [
    "M50 80 C16 58 20 28 38 28 C46 28 50 35 50 40 C50 35 54 28 62 28 C80 28 84 58 50 80 Z",
  ],
  knot: [
    "M30 35 C60 30 40 70 70 65",
    "M70 35 C40 30 60 70 30 65",
    circle(50, 50, 30),
  ],
} satisfies Record<string, string[]>;

export type IconName = keyof typeof ICONS;

export const LineArt: React.FC<{
  name: IconName;
  /** 0 = nothing drawn, 1 = fully drawn. */
  progress: number;
  size: number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
  /** Seconds-of-delay between consecutive paths, as a fraction of progress. */
  stagger?: number;
}> = ({
  name,
  progress,
  size,
  strokeWidth = theme.stroke,
  color = theme.ink,
  opacity = 1,
  stagger = 0.35,
}) => {
  const paths = ICONS[name];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", opacity }}
    >
      {paths.map((d, i) => {
        const start = (i / paths.length) * stagger;
        const end = start + (1 - stagger);
        const p = interpolate(progress, [start, end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <path
            key={d}
            d={d}
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
    </svg>
  );
};
