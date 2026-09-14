import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Scene 5 — a grid of dim rings that switches on cell by cell, with the
 * ring from the previous scene sitting at dead centre. It is the only one
 * that ends up lit.
 */

const COLS = 11;
const ROWS = 9;
const PITCH = 108;
const R = 17;

export const RingGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cells = useMemo(() => {
    const out: { x: number; y: number; at: number; center: boolean }[] = [];
    const cx = (COLS - 1) / 2;
    const cy = (ROWS - 1) / 2;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const center = r === cy && c === cx;
        out.push({
          x: 540 + (c - cx) * PITCH,
          y: 960 + (r - cy) * PITCH,
          // Cells wake up in a scattered order over three seconds.
          at: 0.45 + random(`cell${r}-${c}`) * 3.1,
          center,
        });
      }
    }

    return out;
  }, []);

  // The ring handed over by the previous scene settles into a grid cell.
  const centreR = interpolate(t, [0.15, 1.2], [80, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The centre ring fills in near the end and stays lit.
  const fill = interpolate(t, [5.4, 5.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.sin(Math.max(0, t - 5.95) * 2.4) * 0.05;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="cell-glow">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {cells.map((cell, i) => {
          if (cell.center) {
            return null;
          }

          const on = interpolate(t, [cell.at, cell.at + 0.45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <circle
              key={i}
              cx={cell.x}
              cy={cell.y}
              r={R}
              fill="none"
              stroke="white"
              strokeWidth={2.4}
              opacity={on * 0.22}
            />
          );
        })}

        {fill > 0 ? (
          <circle cx={540} cy={960} r={90 * fill} fill="url(#cell-glow)" />
        ) : null}
        <circle
          cx={540}
          cy={960}
          r={centreR * pulse}
          fill="none"
          stroke="white"
          strokeWidth={3}
          opacity={0.95}
        />
        <circle cx={540} cy={960} r={centreR * 0.86 * fill * pulse} fill="white" />
      </svg>
    </AbsoluteFill>
  );
};
