import React from "react";
import { interpolate } from "remotion";
import { Dot, DrawPath, Frame, IconProps, StrokeScale, useDrawFrame, useReveal, useStrokeScale } from "../primitives";
import { STROKE, STROKE_THIN } from "../theme";
import type { BodyIcon } from "./base";
import type { Pt } from "./draw";

export type TouchOptions = {
  /** Show a magnifier with the area round the point, joined by a leader line. */
  readonly lens?: boolean;
  /** Magnification inside the lens. */
  readonly zoom?: number;
};

const LENS_R = 165;
/** How far the base shrinks and slides over to make room for the lens. */
const SHRINK = 0.8;
const SLIDE = 165;
const PULSE = 40;

/**
 * "Press here": the base draws, a point lands on the landmark with a ring
 * and keeps pulsing; with `lens`, a leader line runs out to a magnifier that
 * shows the same drawing enlarged round the point.
 */
export const touch = (base: BodyIcon, point: string, opts: TouchOptions = {}) => {
  const p = base.points[point];
  if (!p) {
    throw new Error(`Unknown landmark "${point}" (have: ${Object.keys(base.points).join(", ")})`);
  }
  const { lens = false, zoom = 1.8 } = opts;
  const end = base.buildEnd ?? 90;
  const lensOnRight = p[0] > 540;
  const dx = lens ? (lensOnRight ? -SLIDE : SLIDE) : 0;
  const s = lens ? SHRINK : 1;
  const at: Pt = [540 + s * (p[0] - 540) + dx, 540 + s * (p[1] - 540)];
  const lensC: Pt = [lensOnRight ? 830 : 250, Math.max(300, Math.min(760, at[1] - 60))];
  const toward = Math.atan2(lensC[1] - at[1], lensC[0] - at[0]);
  const from: Pt = [at[0] + Math.cos(toward) * 26, at[1] + Math.sin(toward) * 26];
  const to: Pt = [lensC[0] - Math.cos(toward) * LENS_R, lensC[1] - Math.sin(toward) * LENS_R];

  const Marker: React.FC<{ readonly c: Pt; readonly t0: number; readonly k?: number }> = ({ c, t0, k = 1 }) => {
    const frame = useDrawFrame();
    const ring = useReveal(t0 + 4, 10);
    const since = frame - t0 - 14;
    const phase = since > 0 ? (since % PULSE) / PULSE : -1;
    return (
      <>
        <Dot cx={c[0]} cy={c[1]} r={8 * k} delay={t0} />
        {ring > 0 ? <circle cx={c[0]} cy={c[1]} r={20 * k * ring} strokeWidth={STROKE_THIN * 1.2} /> : null}
        {phase >= 0 ? (
          <circle
            cx={c[0]}
            cy={c[1]}
            r={(20 + 30 * phase) * k}
            strokeWidth={STROKE_THIN}
            opacity={interpolate(phase, [0, 1], [0.7, 0])}
          />
        ) : null}
      </>
    );
  };

  const Shifted: React.FC<IconProps> = ({ delay = 0 }) => {
    const B = base;
    return lens ? (
      <Frame scale={s} dx={dx}>
        <StrokeScale value={useStrokeScale() / s}>
          <B delay={delay} />
        </StrokeScale>
      </Frame>
    ) : (
      <B delay={delay} />
    );
  };

  const Touch: React.FC<IconProps> = ({ delay = 0 }) => {
    const id = React.useId().replace(/:/g, "");
    const outer = useStrokeScale();
    const t = delay + end;
    const lensIn = useReveal(t + 24, 14);
    return (
      <>
        <Shifted delay={delay} />
        <Marker c={at} t0={t + 2} />
        {lens ? (
          <>
            <DrawPath d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} delay={t + 12} duration={12} strokeWidth={STROKE_THIN} />
            <DrawPath
              d={`M ${lensC[0] - LENS_R} ${lensC[1]} a ${LENS_R} ${LENS_R} 0 1 0 ${LENS_R * 2} 0 a ${LENS_R} ${LENS_R} 0 1 0 ${-LENS_R * 2} 0`}
              delay={t + 18}
              duration={18}
              strokeWidth={STROKE}
            />
            <defs>
              <clipPath id={`lens${id}`}>
                <circle cx={lensC[0]} cy={lensC[1]} r={LENS_R - 6} />
              </clipPath>
            </defs>
            {lensIn > 0 ? (
              <g clipPath={`url(#lens${id})`} opacity={lensIn}>
                <g transform={`translate(${lensC[0]} ${lensC[1]}) scale(${zoom}) translate(${-at[0]} ${-at[1]})`}>
                  <StrokeScale value={(outer / zoom) * 1.35}>
                    <Shifted delay={delay} />
                    <Marker c={at} t0={t + 2} k={1 / zoom} />
                  </StrokeScale>
                </g>
              </g>
            ) : null}
          </>
        ) : null}
      </>
    );
  };
  const icon = Touch as BodyIcon;
  icon.buildEnd = end + (lens ? 44 : 20);
  icon.points = {};
  return icon;
};
