import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SPHERE_POLE } from "./DotSphere";

/**
 * Scene 2 — the eye. Geometry and timing are measured off the reference:
 * it opens, drifts left, blinks, comes back, swings right, blinks again,
 * then squeezes sideways into a ball and drops into the sphere's core.
 */

const CX = 533;
const CY = 903;
const HALF_W = 113;
const BULGE = 44;
const IRIS_R = 30;
/** How far the iris travels from the centre at full look. */
const LOOK = 56;

const almond = (halfW: number, top: number, bottom: number) =>
  [
    `M ${CX - halfW} ${CY}`,
    `Q ${CX} ${CY - top * 2} ${CX + halfW} ${CY}`,
    `Q ${CX} ${CY + bottom * 2} ${CX - halfW} ${CY}`,
    "Z",
  ].join(" ");

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Eye: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Lid: opens, blinks at 1.6s and again at 3.2s.
  const open = interpolate(
    t,
    [0.06, 0.13, 0.25, 0.47, 1.6, 1.93, 2.25, 3.23, 3.47, 3.75],
    [0, 0.33, 0.45, 1, 1, 0, 1, 1, 0, 1],
    clamp,
  );

  const top = BULGE * open;
  // The lower lid keeps its bow even when the eye is shut.
  const bottom = BULGE * (0.36 + 0.64 * open);
  // The eye is also shorter end to end while it is opening or blinking.
  const halfW = HALF_W * interpolate(open, [0, 0.12, 0.35, 1], [0.45, 0.75, 0.93, 1]);

  // Iris: settles just right of centre, drifts left, returns behind the
  // first blink, swings right, returns behind the second.
  const look = interpolate(
    t,
    [0.6, 0.67, 1.33, 1.63, 1.73, 2.57, 2.87, 3.2, 3.3],
    [0.06, 0.06, -0.94, -0.94, 0.06, 0.06, 1, 1, 0.06],
    clamp,
  );

  // Exit: the eye narrows horizontally into a ball, then shrinks and
  // falls towards the point the sphere will grow out of.
  const sx = interpolate(t, [4.0, 4.2, 4.63], [1, 0.37, 0.1], clamp);
  const sy = interpolate(t, [4.0, 4.2, 4.63], [1, 0.92, 0.26], clamp);
  const drift = interpolate(t, [4.0, 4.63], [0, 1], clamp);
  const irisOpacity = interpolate(t, [3.95, 4.08], [1, 0], clamp);
  const fade = interpolate(t, [4.9, 5.15], [1, 0], clamp);

  const irisX = CX + look * LOOK;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <clipPath id="eye-clip">
            <path d={almond(halfW, top, bottom)} />
          </clipPath>
        </defs>
        <g
          transform={[
            `translate(${(SPHERE_POLE.x - CX) * drift} ${
              (SPHERE_POLE.y - CY) * drift
            })`,
            `translate(${CX} ${CY})`,
            `scale(${sx} ${sy})`,
            `translate(${-CX} ${-CY})`,
          ].join(" ")}
        >
          <path d={almond(halfW, top, bottom)} fill="white" />
          <g clipPath="url(#eye-clip)" opacity={irisOpacity}>
            <circle cx={irisX} cy={CY - 2} r={IRIS_R} fill="black" />
            <circle cx={irisX - 9} cy={CY - 10} r={5} fill="white" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
