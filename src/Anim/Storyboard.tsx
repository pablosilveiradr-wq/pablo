import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { ICONS, IconName } from "./registry";
import { BUILD, Canvas, DrawSpeed } from "./primitives";
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
  /**
   * Beats sharing a scene tag play as one shot: no dip through black between
   * them, and each one's art stays up once it has drawn. That is how a diagram
   * gets built a layer at a time instead of being recut on every line.
   */
  scene: z.string().optional(),
});

export type Beat = z.infer<typeof beatSchema>;

export const storyboardSchema = z.object({
  beats: z.array(beatSchema),
  /** Multiplier on the shared icon size, when a reel wants to sit smaller. */
  scale: z.number().optional(),
});

type Scene = { start: number; end: number; beats: Beat[] };

/** Runs of consecutive beats carrying the same scene tag collapse into one shot. */
const toScenes = (beats: Beat[]): Scene[] =>
  beats.reduce<Scene[]>((out, beat) => {
    const open = out[out.length - 1];
    if (open && beat.scene && beat.scene === open.beats[0].scene) {
      open.beats.push(beat);
      open.end = beat.end;
      return out;
    }
    out.push({ start: beat.start, end: beat.end, beats: [beat] });
    return out;
  }, []);

/** The clock a beat of `frames` needs so its drawing lands about two thirds in. */
const drawSpeed = (frames: number) => Math.min(4.4, BUILD / (frames * 0.68));

/** One shot: a single metaphor, or a diagram several beats build up together. */
const SceneLayer: React.FC<{
  readonly scene: Scene;
  readonly scale: number;
}> = ({ scene, scale }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

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

  // A slow push-in over the shot, so a held icon is never a frozen frame.
  const push = interpolate(frame, [0, durationInFrames], [1, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const offset = (beat: Beat) => Math.round((beat.start - scene.start) * fps);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Canvas lifted={scene.beats.some((b) => b.text)} scale={scale}>
          {scene.beats.map((beat, i) => {
            const Icon = ICONS[beat.icon as IconName];
            const from = offset(beat);
            return (
              <Sequence
                key={i}
                from={from}
                durationInFrames={durationInFrames - from}
                layout="none"
              >
                <DrawSpeed
                  value={drawSpeed(Math.round((beat.end - beat.start) * fps))}
                >
                  <Icon />
                </DrawSpeed>
              </Sequence>
            );
          })}
        </Canvas>
      </AbsoluteFill>
      {scene.beats.map((beat, i) =>
        beat.text ? (
          <Sequence
            key={i}
            from={offset(beat)}
            durationInFrames={Math.round((beat.end - beat.start) * fps)}
            layout="none"
          >
            <Caption text={beat.text} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};

export const Storyboard: React.FC<z.infer<typeof storyboardSchema>> = ({
  beats,
  scale = 1,
}) => {
  const { fps } = useVideoConfig();
  const scenes = toScenes(beats.filter((b) => ICONS[b.icon as IconName]));

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {scenes.map((scene, i) => {
        const from = Math.round(scene.start * fps);
        const duration = Math.round((scene.end - scene.start) * fps);
        if (duration <= 0) {
          return null;
        }
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneLayer scene={scene} scale={scale} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Total length of a storyboard, in frames. */
export const storyboardDuration = (beats: Beat[], fps: number) =>
  Math.round(Math.max(...beats.map((b) => b.end)) * fps);
