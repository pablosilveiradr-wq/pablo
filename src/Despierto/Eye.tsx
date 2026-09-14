import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Scene 2 — the eye. An almond of white with a black iris that darts
 * around, then blinks shut and leaves only its highlight behind.
 */

const CX = 540;
const CY = 900;
const HALF_W = 132;
const BULGE = 56;

const almond = (top: number, bottom: number) =>
  [
    `M ${CX - HALF_W} ${CY}`,
    `Q ${CX} ${CY - top * 2} ${CX + HALF_W} ${CY}`,
    `Q ${CX} ${CY + bottom * 2} ${CX - HALF_W} ${CY}`,
    "Z",
  ].join(" ");

export const Eye: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Lid: opens, holds, blinks once, then shuts for good.
  const open = interpolate(
    t,
    [0, 0.5, 3.3, 3.47, 3.7, 4.0, 4.15],
    [0, 1, 1, 0.06, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // The bottom lid keeps a little curve while the top one drops.
  const top = BULGE * open;
  const bottom = BULGE * interpolate(open, [0, 1], [0.22, 1]);

  const look = interpolate(
    t,
    [0.6, 1.1, 1.5, 1.9, 2.3, 3.0, 3.4],
    [0, 0, -1, -1, 0, 0, 0.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const irisX = CX + look * 62;
  const irisR = 54;

  // Once the lid is shut, only the highlight is left — it becomes the dot
  // the next scene grows out of, settling to its resting size.
  const dot = interpolate(t, [4.1, 4.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotR = interpolate(t, [4.2, 4.5], [34, 24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <clipPath id="eye-clip">
            <path d={almond(top, bottom)} />
          </clipPath>
        </defs>
        <path d={almond(top, bottom)} fill="white" opacity={1 - dot} />
        <g clipPath="url(#eye-clip)" opacity={1 - dot}>
          <circle cx={irisX} cy={CY - 2} r={irisR} fill="black" />
          <circle cx={irisX - 15} cy={CY - 16} r={7.5} fill="white" />
        </g>
        <circle cx={CX} cy={CY} r={dotR * dot} fill="white" opacity={dot} />
      </svg>
    </AbsoluteFill>
  );
};
