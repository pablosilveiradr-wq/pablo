import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ICONS, IconName } from "./registry";
import { Canvas } from "./primitives";
import { BG, CROSSFADE } from "./theme";

export const beatSchema = z.object({
  /** Which metaphor carries this line. */
  icon: z.string(),
  /** Seconds into the voice-over where the line starts. */
  start: z.number(),
  /** Seconds into the voice-over where the line ends. */
  end: z.number(),
  /** The spoken line this beat represents. Never rendered — it is the brief. */
  note: z.string().optional(),
});

export type Beat = z.infer<typeof beatSchema>;

export const storyboardSchema = z.object({
  beats: z.array(beatSchema),
});

/** One metaphor, cross-dissolved in and out like the references. */
const BeatLayer: React.FC<{ readonly icon: IconName }> = ({ icon }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const Icon = ICONS[icon];

  const opacity =
    interpolate(frame, [0, CROSSFADE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(
      frame,
      [durationInFrames - CROSSFADE, durationInFrames],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  return (
    <AbsoluteFill style={{ opacity }}>
      <Canvas>
        <Icon />
      </Canvas>
    </AbsoluteFill>
  );
};

export const Storyboard: React.FC<z.infer<typeof storyboardSchema>> = ({
  beats,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {beats.map((beat, i) => {
        const icon = beat.icon as IconName;
        if (!ICONS[icon]) {
          return null;
        }
        const from = Math.round(beat.start * fps);
        // Overrun by one crossfade so consecutive beats dissolve into each other.
        const duration =
          Math.round((beat.end - beat.start) * fps) + CROSSFADE;
        if (duration <= 0) {
          return null;
        }
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <BeatLayer icon={icon} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Total length of a storyboard, in frames. */
export const storyboardDuration = (beats: Beat[], fps: number) =>
  Math.round(Math.max(...beats.map((b) => b.end)) * fps) + CROSSFADE;
