import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { ICONS, IconName } from "./registry";
import { TimedIcon } from "./library/vendorIcon";
import { Canvas, DrawSpeed } from "./primitives";
import { BG, CENTER } from "./theme";

/** Length of one exported clip: pop, draw, flash, then a breathing hold. */
export const CLIP = 90;
/** Build frames per real frame: a plain glyph draws in well under a second. */
const SPEED = 4;
/** Fallback build length for icons that don't report one. */
const DEFAULT_END = 92;

export const libraryClipSchema = z.object({ id: z.string() });

/**
 * One library icon animated for editing: it springs in with a little
 * overshoot while it draws fast, flashes its glow the moment the drawing
 * lands, then floats and breathes until the cut.
 */
export const LibraryClip: React.FC<z.infer<typeof libraryClipSchema>> = ({ id }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Icon = ICONS[id as IconName] as TimedIcon | undefined;
  if (!Icon) {
    throw new Error(`Unknown icon "${id}"`);
  }
  const end = (Icon.buildEnd ?? DEFAULT_END) / SPEED;

  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 170, mass: 0.7 } });
  const enter = interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" });

  // The landing: a quick thump and a glow flash, both keyed to `end`.
  const land = frame - end;
  const thump = spring({
    frame: land,
    fps,
    config: { damping: 8, stiffness: 260, mass: 0.5 },
  });
  const bump = land < 0 ? 0 : Math.sin(Math.min(thump, 1) * Math.PI) * 0.05;
  const flash = interpolate(land, [0, 3, 22], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = interpolate(land, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin((frame / 96) * Math.PI * 2) * 5 * settle;

  const scale = (0.55 + 0.45 * pop) * (1 + bump);
  const rotate = (1 - pop) * -7;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Canvas scale={0.88} glowOpacity={0.3 + 0.55 * flash}>
        <g
          opacity={enter}
          style={{
            transform: `translateY(${float}px) rotate(${rotate}deg) scale(${scale})`,
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transformBox: "view-box",
          }}
        >
          <DrawSpeed value={SPEED}>
            <Icon />
          </DrawSpeed>
        </g>
      </Canvas>
    </AbsoluteFill>
  );
};

export const libraryReelSchema = z.object({ ids: z.array(z.string()) });

/** Every clip back to back, so 200 icons render in one pass and get split. */
export const LibraryReel: React.FC<z.infer<typeof libraryReelSchema>> = ({ ids }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    {ids.map((id, i) => (
      <Sequence key={id} from={i * CLIP} durationInFrames={CLIP}>
        <LibraryClip id={id} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
