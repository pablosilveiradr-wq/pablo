import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ICONS, IconName } from "./registry";
import { BUILD, Canvas, DrawSpeed, Motes } from "./primitives";
import { Caption } from "./Caption";
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
  /** Subtitle burned under the icon, the way the references caption every line. */
  text: z.string().optional(),
});

export type Beat = z.infer<typeof beatSchema>;

export const storyboardSchema = z.object({
  beats: z.array(beatSchema),
  /** Multiplier on the shared icon size, when a reel wants to sit smaller. */
  scale: z.number().optional(),
});

/** One metaphor, cross-dissolved in and out like the references. */
const BeatLayer: React.FC<{
  readonly icon: IconName;
  readonly text?: string;
  readonly scale?: number;
}> = ({ icon, text, scale = 1 }) => {
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

  // A slow push-in over the beat, so a held icon is never a frozen frame.
  const push = interpolate(frame, [0, durationInFrames], [1, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Land the drawing about two thirds in, so every beat still gets a held pose.
  // The ceiling is what a one-second beat needs to finish drawing at all.
  const speed = Math.min(4.4, BUILD / (durationInFrames * 0.68));

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <DrawSpeed value={speed}>
          <Canvas lifted={Boolean(text)} scale={scale}>
            <Icon />
          </Canvas>
        </DrawSpeed>
      </AbsoluteFill>
      {text ? <Caption text={text} /> : null}
    </AbsoluteFill>
  );
};

export const Storyboard: React.FC<z.infer<typeof storyboardSchema>> = ({
  beats,
  scale,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Motes />
      {beats.map((beat, i) => {
        const icon = beat.icon as IconName;
        if (!ICONS[icon]) {
          return null;
        }
        const from = Math.round(beat.start * fps);
        // Beats never overlap: each one dips out before the next draws on, so
        // two sets of line work can never share the frame.
        const duration = Math.round((beat.end - beat.start) * fps);
        if (duration <= 0) {
          return null;
        }
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <BeatLayer icon={icon} text={beat.text} scale={scale} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Total length of a storyboard, in frames. */
export const storyboardDuration = (beats: Beat[], fps: number) =>
  Math.round(Math.max(...beats.map((b) => b.end)) * fps);
