import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Brand, Outro } from "./Brand";
import { clamp, H, Scene, W } from "./common";
import { loadJost, JOST } from "./font";
import {
  AvatarChain,
  BrainBadge,
  Cage,
  Cards,
  Orbit,
  SadFolder,
  Tower,
} from "./scenes";

loadJost();

export const CADENA_DURATION = 696; // 23.2s at 30fps

/** Caption track, timed off the reference frame by frame. */
const CAPTIONS: [number, number, string][] = [
  [0.0, 0.83, "Para tener éxito"],
  [1.1, 1.97, "debes cambiar tus"],
  [2.17, 3.67, "pensamientos y creencias."],
  [4.17, 5.43, "De hecho, tus creencias"],
  [5.43, 7.07, "dictan tus pensamientos."],
  [7.07, 9.27, "Que a su vez guía tus acciones"],
  [9.87, 10.97, "es esta cadena la que"],
  [11.23, 13.0, "te llevó a donde estás hoy."],
  [13.47, 15.5, "Así que si,\nno estás satisfecho"],
  [15.5, 16.57, "con tu situación"],
  [16.73, 17.63, "debes examinar"],
  [17.8, 23.2, "y cambiar tus creencias"],
];

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill>
      {CAPTIONS.map(([from, to, text], i) => {
        const last = i === CAPTIONS.length - 1;
        const o =
          interpolate(t, [from, from + 0.16], [0, 1], clamp) *
          (last
            ? interpolate(t, [19.2, 19.9], [1, 0.25], clamp)
            : interpolate(t, [to - 0.16, to], [1, 0], clamp));

        if (o <= 0.001) {
          return null;
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 410,
              left: 80,
              right: 80,
              textAlign: "center",
              opacity: o,
              fontFamily: JOST,
              fontWeight: 300,
              fontSize: 62,
              lineHeight: 1.25,
              letterSpacing: 0.5,
              color: "white",
              whiteSpace: "pre-line",
            }}
          >
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Sigueme: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame / fps, [0.45, 0.9, 2.85, 3.0], [0, 1, 1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        top: 1520,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: o,
        fontFamily: JOST,
        fontWeight: 300,
        fontSize: 54,
        color: "white",
      }}
    >
      Sígueme
    </div>
  );
};

/** Scene cuts, in frames, measured off the reference. */
const S = {
  tower: { from: 0, duration: 51 },
  badge: { from: 49, duration: 69 },
  cage: { from: 120, duration: 87 },
  orbit: { from: 206, duration: 81 },
  avatar: { from: 286, duration: 114 },
  folder: { from: 399, duration: 85 },
  cards: { from: 483, duration: 92 },
  outro: { from: 575, duration: CADENA_DURATION - 575 },
};

export const Cadena: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence from={S.tower.from} durationInFrames={S.tower.duration} layout="none">
      <Scene
        durationInFrames={S.tower.duration}
        origin={{ x: 540, y: 726 }}
        inDur={0.2}
      >
        <Tower />
      </Scene>
    </Sequence>

    <Sequence from={S.badge.from} durationInFrames={S.badge.duration} layout="none">
      <Scene durationInFrames={S.badge.duration} origin={{ x: 540, y: 1080 }}>
        <BrainBadge />
      </Scene>
    </Sequence>

    <Sequence from={S.cage.from} durationInFrames={S.cage.duration} layout="none">
      <Scene
        durationInFrames={S.cage.duration}
        origin={{ x: 540, y: 880 }}
        outDur={0.2}
      >
        <Cage />
      </Scene>
    </Sequence>

    <Sequence from={S.orbit.from} durationInFrames={S.orbit.duration} layout="none">
      <Scene durationInFrames={S.orbit.duration} origin={{ x: 540, y: 990 }}>
        <Orbit />
      </Scene>
    </Sequence>

    <Sequence from={S.avatar.from} durationInFrames={S.avatar.duration} layout="none">
      <Scene durationInFrames={S.avatar.duration} origin={{ x: 540, y: 1010 }}>
        <AvatarChain />
      </Scene>
    </Sequence>

    <Sequence from={S.folder.from} durationInFrames={S.folder.duration} layout="none">
      <Scene durationInFrames={S.folder.duration} origin={{ x: 540, y: 1068 }}>
        <SadFolder />
      </Scene>
    </Sequence>

    <Sequence from={S.cards.from} durationInFrames={S.cards.duration} layout="none">
      <Scene durationInFrames={S.cards.duration} origin={{ x: 540, y: 1050 }}>
        <Cards />
      </Scene>
      <Sigueme />
    </Sequence>

    <Sequence from={S.outro.from} durationInFrames={S.outro.duration} layout="none">
      <Outro />
    </Sequence>

    <Captions />
    <Brand />
  </AbsoluteFill>
);

export const CadenaSize = { width: W, height: H };
