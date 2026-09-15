import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene } from "../Cadena/common";
import { Intact, Leaving, MirrorScene } from "./scenes";

/**
 * "Te pueden faltar personas, pero nunca vos." Three beats, no text:
 * the crowd walks off and comes apart, the mirror hands the whole self
 * back, and the ring closes around what is left.
 */
export const ESPEJO_DURATION = 228; // 7.6s at 30fps

const S = {
  leaving: { from: 0, duration: 82 },
  mirror: { from: 78, duration: 84 },
  intact: { from: 158, duration: 70 },
};

export const Espejo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence from={S.leaving.from} durationInFrames={S.leaving.duration} layout="none">
      <Scene durationInFrames={S.leaving.duration} inDur={0.55}>
        <Leaving />
      </Scene>
    </Sequence>

    <Sequence from={S.mirror.from} durationInFrames={S.mirror.duration} layout="none">
      <Scene durationInFrames={S.mirror.duration}>
        <MirrorScene />
      </Scene>
    </Sequence>

    <Sequence from={S.intact.from} durationInFrames={S.intact.duration} layout="none">
      <Scene durationInFrames={S.intact.duration} outDur={0.45}>
        <Intact />
      </Scene>
    </Sequence>
  </AbsoluteFill>
);
