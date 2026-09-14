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

const ROAD = { from: 0, duration: 75 };
const EYE = { from: 72, duration: 135 };
const SPHERE = { from: 205, duration: 195 };
const ORBIT = { from: 396, duration: 114 };
const GRID = { from: 508, duration: DESPIERTO_DURATION - 508 };

export const Despierto: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence from={ROAD.from} durationInFrames={ROAD.duration}>
      <Road durationInFrames={ROAD.duration} />
    </Sequence>
    <Sequence from={EYE.from} durationInFrames={EYE.duration}>
      <Eye durationInFrames={EYE.duration} />
    </Sequence>
    <Sequence from={SPHERE.from} durationInFrames={SPHERE.duration}>
      <DotSphere durationInFrames={SPHERE.duration} />
    </Sequence>
    <Sequence from={ORBIT.from} durationInFrames={ORBIT.duration}>
      <SocialOrbit durationInFrames={ORBIT.duration} />
    </Sequence>
    <Sequence from={GRID.from} durationInFrames={GRID.duration}>
      <RingGrid />
    </Sequence>
  </AbsoluteFill>
);
