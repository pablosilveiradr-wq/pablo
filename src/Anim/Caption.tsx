import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CROSSFADE, INK } from "./theme";

/** The subtitle line the references park under every icon. */
export const Caption: React.FC<{
  readonly text: string;
  readonly delay?: number;
}> = ({ text, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Leaves ahead of the icon so two beats never caption the frame at once.
  const p =
    interpolate(frame - delay, [0, 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(
      frame,
      [durationInFrames - CROSSFADE - 8, durationInFrames - CROSSFADE],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "16%",
        display: "flex",
        justifyContent: "center",
        padding: "0 8%",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: '"URW Gothic", "Century Gothic", "Futura", sans-serif',
          fontSize: 62,
          fontWeight: 400,
          letterSpacing: "0.01em",
          color: INK,
          textAlign: "center",
          lineHeight: 1.25,
        }}
      >
        {text}
      </span>
    </div>
  );
};
