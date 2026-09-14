import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { DotSphere } from "./DotSphere";
import { Eye } from "./Eye";
import { RingGrid } from "./RingGrid";
import { Road } from "./Road";
import { SocialOrbit } from "./SocialOrbit";

/**
 * Animation only — no captions, no watermark. Timings follow the
 * reference: track, eye, sphere, orbit, grid.
 */

export const DESPIERTO_DURATION = 828; // 27.6s at 30fps

const ROAD = { from: 0, duration: 80 };
const EYE = { from: 75, duration: 134 };
const SPHERE = { from: 207, duration: 162 };
const ORBIT = { from: 364, duration: 143 };
const GRID = { from: 505, duration: DESPIERTO_DURATION - 505 };

export const Despierto: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence from={ROAD.from} durationInFrames={ROAD.duration}>
      <Road />
    </Sequence>
    <Sequence from={EYE.from} durationInFrames={EYE.duration}>
      <Eye />
    </Sequence>
    <Sequence from={SPHERE.from} durationInFrames={SPHERE.duration}>
      <DotSphere durationInFrames={SPHERE.duration} />
    </Sequence>
    <Sequence from={ORBIT.from} durationInFrames={ORBIT.duration}>
      <SocialOrbit />
    </Sequence>
    <Sequence from={GRID.from} durationInFrames={GRID.duration}>
      <RingGrid />
    </Sequence>
  </AbsoluteFill>
);
