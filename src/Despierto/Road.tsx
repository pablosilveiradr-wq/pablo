import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Scene 1 — the diagonal track: a solid line with a dashed line running
 * parallel to it, a filled ball rolling up and away, and three hollow
 * circles trailing behind it.
 */

const A = { x: 191, y: 1474 };
const B = { x: 934, y: 675 };

const dx = B.x - A.x;
const dy = B.y - A.y;
const len = Math.hypot(dx, dy);
const dir = { x: dx / len, y: dy / len };
// Normal pointing down-right (dashed line side).
const nDown = { x: -dir.y, y: dir.x };
// Normal pointing up-left (the side the balls roll on).
const nUp = { x: dir.y, y: -dir.x };

// Where the track ends up when it morphs into the eye's closed lid.
const MID = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
const ANGLE = -(Math.atan2(dy, dx) * 180) / Math.PI;
const END_SCALE = 220 / len;
const SHIFT = { x: 533 - MID.x, y: 903 - MID.y };

const onTrack = (s: number, radius: number) => ({
  x: A.x + dir.x * len * s + nUp.x * radius,
  y: A.y + dir.y * len * s + nUp.y * radius,
});

export const Road: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const fadeIn = interpolate(t, [0.05, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(t, [2.45, 2.6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;

  // Exit: the whole track shrinks and swings flat, landing where the eye
  // is about to open. The line becomes the closed lid.
  const morph = interpolate(t, [1.95, 2.58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The leading ball rolls up the track and shrinks as it gets further away.
  const lead = interpolate(t, [0, 2.4], [0.38, 1.12], {
    extrapolateLeft: "clamp",
  });
  const leadR = interpolate(t, [0, 2.4], [92, 26], {
    extrapolateLeft: "clamp",
  });
  const leadPos = onTrack(lead, leadR);

  const trail = [0, 1, 2].map((i) => {
    const s = interpolate(
      t,
      [0.9, 2.4],
      [-0.02 + i * 0.075, 0.06 + i * 0.075],
      {
        extrapolateLeft: "clamp",
      },
    );
    const r = 32;
    const appear = interpolate(t, [1 + i * 0.12, 1.35 + i * 0.12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return { ...onTrack(s, r), r, appear };
  });

  const dashOffset = 22;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          transformOrigin: `${MID.x}px ${MID.y}px`,
          transform: [
            `translate(${SHIFT.x * morph}px, ${SHIFT.y * morph}px)`,
            `rotate(${ANGLE * morph}deg)`,
            `scale(${1 - (1 - END_SCALE) * morph})`,
          ].join(" "),
        }}
      >
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <line
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke="white"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
          <line
            x1={A.x + nDown.x * dashOffset}
            y1={A.y + nDown.y * dashOffset}
            x2={B.x + nDown.x * dashOffset}
            y2={B.y + nDown.y * dashOffset}
            stroke="white"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray="18 16"
          />
          {trail.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={c.r}
              fill="none"
              stroke="white"
              strokeWidth={3}
              opacity={c.appear * 0.9}
            />
          ))}
          <circle cx={leadPos.x} cy={leadPos.y} r={leadR} fill="white" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
