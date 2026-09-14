import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  interpolate,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { BrandLayer, InstagramGlyph } from "./Brand";
import { Caption } from "./Caption";
import { ICONS } from "./icons";
import { Scene } from "./Scene";
import { loadJost, theme } from "./theme";
import { Visual } from "./Visual";

loadJost();

const iconNames = Object.keys(ICONS) as [keyof typeof ICONS];

export const sceneSchema = z.object({
  text: z.string(),
  icon: z.enum(iconNames),
  variant: z.enum(["halo", "orbit", "cage", "chain", "rings"]),
  seconds: z.number().min(0.5),
});

export const metaforaSchema = z.object({
  handle: z.string(),
  subtitle: z.string(),
  outroText: z.string(),
  outroSeconds: z.number().min(1),
  scenes: z.array(sceneSchema),
});

export type MetaforaProps = z.infer<typeof metaforaSchema>;

export const calculateMetaforaMetadata: CalculateMetadataFunction<
  MetaforaProps
> = ({ props }) => {
  const fps = 30;
  const total =
    props.scenes.reduce((acc, s) => acc + Math.round(s.seconds * fps), 0) +
    Math.round(props.outroSeconds * fps);

  return { fps, durationInFrames: total };
};

const Outro: React.FC<{ handle: string; text: string }> = ({
  handle,
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    durationInFrames: Math.round(fps * 0.8),
    config: { damping: 12, mass: 0.7 },
  });

  const textIn = interpolate(frame, [fps * 0.3, fps * 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 40 }}
    >
      <div style={{ transform: `scale(${interpolate(pop, [0, 1], [0.3, 1])})` }}>
        <InstagramGlyph size={190} colored />
      </div>
      <div
        style={{
          opacity: textIn,
          fontFamily: theme.font,
          fontWeight: 500,
          fontSize: 54,
          letterSpacing: 2,
          color: theme.ink,
        }}
      >
        {handle}
      </div>
      <div
        style={{
          opacity: textIn,
          fontFamily: theme.font,
          fontWeight: 300,
          fontSize: 44,
          letterSpacing: 1,
          color: theme.dim,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Metafora: React.FC<MetaforaProps> = ({
  handle,
  subtitle,
  outroText,
  outroSeconds,
  scenes,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const outroFrames = Math.round(outroSeconds * fps);
  const brandFade = interpolate(
    frame,
    [durationInFrames - outroFrames - fps * 0.3, durationInFrames - outroFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <Series>
        {scenes.map((scene, i) => {
          const dur = Math.round(scene.seconds * fps);

          return (
            <Series.Sequence
              key={`${scene.text}-${i}`}
              durationInFrames={dur}
              layout="none"
            >
              <Scene durationInFrames={dur}>
                <Visual icon={scene.icon} variant={scene.variant} />
              </Scene>
              <Caption text={scene.text} durationInFrames={dur} />
            </Series.Sequence>
          );
        })}
        <Series.Sequence durationInFrames={outroFrames} layout="none">
          <Outro handle={handle} text={outroText} />
        </Series.Sequence>
      </Series>

      <div style={{ opacity: brandFade }}>
        <BrandLayer handle={handle} subtitle={subtitle} side="right" top={430} />
      </div>
    </AbsoluteFill>
  );
};

export const defaultMetaforaProps: MetaforaProps = {
  handle: "@PABLO.SILVEIRA.DR",
  subtitle: "Mapa · Adventure",
  outroText: "Sígueme",
  outroSeconds: 2.6,
  scenes: [
    { text: "Cuando algo te preocupa", icon: "brain", variant: "halo", seconds: 2.8 },
    { text: "tu mente lo repite en loop", icon: "loop", variant: "rings", seconds: 3 },
    { text: "y el cuerpo obedece", icon: "heart", variant: "orbit", seconds: 3.4 },
    { text: "pero un pensamiento\nno es un hecho", icon: "brain", variant: "cage", seconds: 3.4 },
    { text: "ponerle nombre\nlo hace más chico", icon: "cards", variant: "rings", seconds: 3 },
    { text: "y ahí el ruido baja.", icon: "person", variant: "chain", seconds: 3.2 },
  ],
};
