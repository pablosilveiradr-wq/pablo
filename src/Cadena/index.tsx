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
export const CADENA_DURATION = 578;

/**
 * Scene cuts in frames, measured off the reference. Each scene starts a
 * few frames before the previous one ends so the white dot is handed
 * straight from one to the next with no gap in between.
 */
const S = {
  tower: { from: 0, duration: 53 },
  badge: { from: 49, duration: 73 },
  cage: { from: 118, duration: 90 },
  orbit: { from: 204, duration: 84 },
  avatar: { from: 284, duration: 118 },
  folder: { from: 398, duration: 88 },
  cards: { from: 482, duration: 96 },
};

export const Cadena: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence from={S.tower.from} durationInFrames={S.tower.duration} layout="none">
      <Scene durationInFrames={S.tower.duration} inDur={0.2}>
        <Tower />
      </Scene>
    </Sequence>

    <Sequence from={S.badge.from} durationInFrames={S.badge.duration} layout="none">
      <Scene durationInFrames={S.badge.duration}>
        <BrainBadge />
      </Scene>
    </Sequence>

    <Sequence from={S.cage.from} durationInFrames={S.cage.duration} layout="none">
      <Scene durationInFrames={S.cage.duration} inDur={0.85} outDur={0.25}>
        <Cage />
      </Scene>
    </Sequence>

    <Sequence from={S.orbit.from} durationInFrames={S.orbit.duration} layout="none">
      <Scene durationInFrames={S.orbit.duration}>
        <Orbit />
      </Scene>
    </Sequence>

    <Sequence from={S.avatar.from} durationInFrames={S.avatar.duration} layout="none">
      <Scene durationInFrames={S.avatar.duration}>
        <AvatarChain />
      </Scene>
    </Sequence>

    <Sequence from={S.folder.from} durationInFrames={S.folder.duration} layout="none">
      <Scene durationInFrames={S.folder.duration}>
        <SadFolder />
      </Scene>
    </Sequence>

    <Sequence from={S.cards.from} durationInFrames={S.cards.duration} layout="none">
      <Scene durationInFrames={S.cards.duration}>
        <Cards />
      </Scene>
    </Sequence>
  </AbsoluteFill>
);

export const CadenaSize = { width: W, height: H };
