import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

/**
 * Top caption. One short line per scene — read together across the video
 * they form a single sentence, the way the reference does it.
 */
export const Caption: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inDur = Math.round(fps * 0.4);
  const outStart = durationInFrames - Math.round(fps * 0.3);

  const opacity =
    interpolate(frame, [0, inDur], [0, 1], { extrapolateRight: "clamp" }) *
    interpolate(frame, [outStart, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
    });

  const y = interpolate(frame, [0, inDur], [14, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 90,
        right: 90,
        textAlign: "center",
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: theme.font,
        fontWeight: 300,
        fontSize: 64,
        lineHeight: 1.22,
        letterSpacing: 0.5,
        color: theme.ink,
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};
