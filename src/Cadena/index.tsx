import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene, W, H } from "./common";
import {
  AvatarChain,
  BrainBadge,
  Cage,
  Cards,
  Orbit,
  SadFolder,
  Tower,
} from "./scenes";

/**
 * Animation only — no captions, no watermark. The reference runs 23.2s,
 * but its last four seconds are the branded sign-off, so this ends when
 * the last scene pinches out.
 */
export const CADENA_DURATION = 590;

/** Scene cuts, in frames, measured off the reference. */
const S = {
  tower: { from: 0, duration: 51 },
  badge: { from: 49, duration: 69 },
  cage: { from: 120, duration: 87 },
  orbit: { from: 206, duration: 81 },
  avatar: { from: 286, duration: 114 },
  folder: { from: 399, duration: 85 },
  cards: { from: 483, duration: 92 },
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
    </Sequence>
  </AbsoluteFill>
);

export const CadenaSize = { width: W, height: H };
