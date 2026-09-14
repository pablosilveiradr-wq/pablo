import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Scene 3 — a sphere stippled with dots, its pole turned towards the
 * camera and lit from inside. The dots bunch up towards the limb, which
 * is what sells the roundness.
 */

const RADIUS = 222;
const RINGS = 30;
const DENSITY = 30;
/** Dots on the smallest rings, so the pole stays tightly stippled. */
const BASE = 18;
/** Each ring is twisted a little further round, which draws the spiral. */
const TWIST = 0.15;
// Tilt of the polar axis, so the lit pole sits down and to the left.
const ALPHA = (28 * Math.PI) / 180;
const BETA = (-22 * Math.PI) / 180;

type Point = { theta: number; phi: number };

const usePoints = (): Point[] =>
  useMemo(() => {
    const out: Point[] = [];

    for (let i = 0; i < RINGS; i++) {
      const theta = (Math.PI * (i + 0.5)) / RINGS;
      const count = Math.round(BASE + DENSITY * Math.sin(theta));

      for (let j = 0; j < count; j++) {
        out.push({ theta, phi: (2 * Math.PI * j) / count + i * TWIST });
      }
    }

    return out;
  }, []);

const project = (theta: number, phi: number, rot: number) => {
  const sin = Math.sin(theta);
  const x = sin * Math.cos(phi + rot);
  const y = sin * Math.sin(phi + rot);
  const z = Math.cos(theta);

  // Rotate about X, then about Y.
  const y1 = y * Math.cos(ALPHA) - z * Math.sin(ALPHA);
  const z1 = y * Math.sin(ALPHA) + z * Math.cos(ALPHA);
  const x2 = x * Math.cos(BETA) + z1 * Math.sin(BETA);
  const z2 = -x * Math.sin(BETA) + z1 * Math.cos(BETA);

  return { x: x2, y: y1, z: z2 };
};

export const DotSphere: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const points = usePoints();

  const grow = spring({
    frame,
    fps,
    durationInFrames: Math.round(fps * 1.1),
    config: { damping: 200 },
  });

  const shrink = interpolate(
    frame,
    [durationInFrames - Math.round(fps * 0.45), durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale = interpolate(grow, [0, 1], [0.04, 1]) * interpolate(shrink, [0, 1], [0.04, 1]);
  const opacity = interpolate(grow, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rot = (frame / fps) * 0.3;
  const pole = project(0, 0, rot);
  const poleX = 540 + pole.x * RADIUS;
  const poleY = 960 - pole.y * RADIUS;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          width: 1080,
          height: 1920,
          position: "absolute",
        }}
      >
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <defs>
            <radialGradient id="core-glow">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="22%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          {points.map((p, i) => {
            const { x, y, z } = project(p.theta, p.phi, rot);
            if (z <= 0.04) {
              return null;
            }

            return (
              <circle
                key={i}
                cx={540 + x * RADIUS}
                cy={960 - y * RADIUS}
                r={2.7}
                fill="white"
                opacity={0.35 + 0.6 * z}
              />
            );
          })}
          <circle cx={poleX} cy={poleY} r={104} fill="url(#core-glow)" />
          <circle
            cx={poleX}
            cy={poleY}
            r={19}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={2}
          />
          <circle cx={poleX} cy={poleY} r={7} fill="white" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
