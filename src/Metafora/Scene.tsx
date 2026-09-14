import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CoreDot } from "./fx";

type SceneState = {
  /** Stroke draw-on progress for the line art, 0 to 1. */
  draw: number;
  /** Local frame inside the scene. */
  frame: number;
};

const SceneContext = createContext<SceneState>({ draw: 1, frame: 0 });

export const useScene = () => useContext(SceneContext);

/**
 * Wraps a scene in the signature transition of this style: everything
 * grows out of a single white dot and collapses back into it.
 */
export const Scene: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    durationInFrames: Math.round(fps * 0.6),
    config: { damping: 14, mass: 0.6 },
  });

  const exitStart = durationInFrames - Math.round(fps * 0.35);
  const exit = interpolate(frame, [exitStart, durationInFrames - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale =
    interpolate(enter, [0, 1], [0.08, 1]) *
    interpolate(exit, [0, 1], [1, 0.06]);

  const opacity =
    interpolate(enter, [0.08, 0.45], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(exit, [0.5, 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // The dot is bright exactly when the artwork is too small to read.
  const dot = Math.max(
    interpolate(enter, [0, 0.5], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(exit, [0.45, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const draw = interpolate(
    frame,
    [Math.round(fps * 0.15), Math.round(fps * 1.1)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <SceneContext.Provider value={{ draw, frame }}>
      <AbsoluteFill>
        <AbsoluteFill
          style={{
            transform: `scale(${scale})`,
            opacity,
          }}
        >
          {children}
        </AbsoluteFill>
        {dot > 0.02 ? <CoreDot size={26} opacity={dot} /> : null}
      </AbsoluteFill>
    </SceneContext.Provider>
  );
};
