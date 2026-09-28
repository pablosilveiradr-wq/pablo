import React from "react";
import { DrawPath, Frame, IconProps, StrokeScale, useStrokeScale } from "../primitives";
import { STROKE, STROKE_THIN } from "../theme";
import type { TimedIcon } from "../library/vendorIcon";
import type { Pt } from "./draw";

/**
 * An anatomical base: the contour lines of a body part, the finer details
 * (creases, tendons, knuckles) drawn lighter on top, and named landmarks where
 * a touch point can be placed later.
 */
export type BodyDef = {
  /** Main contours, full weight, drawn first. */
  readonly lines: readonly string[];
  /** Creases and inner detail, thinner and dimmer, drawn after. */
  readonly details?: readonly string[];
  /** Named landmarks in canvas units, for touch points and zoom lenses. */
  readonly points: Readonly<Record<string, Pt>>;
  /** Bounding box of the drawing (x0, y0, x1, y1); it is centred and sized to TARGET. */
  readonly box: readonly [number, number, number, number];
  /** Cut the drawing at the box, for close-ups taken from a bigger figure. */
  readonly clip?: boolean;
};

export type BodyIcon = TimedIcon & { points: Readonly<Record<string, Pt>> };

/** Longest side of every base once framed, in canvas units. */
const TARGET = 600;

const LINE_DUR = 34;
const LINE_STEP = 9;
const DETAIL_DUR = 14;
const DETAIL_STEP = 3;

/** Turns a definition into a drawable base, optionally mirrored left-right. */
export const bodyBase = (def: BodyDef, mirror = false): BodyIcon => {
  const details = def.details ?? [];
  const [x0, y0, x1, y1] = def.box;
  const s = TARGET / Math.max(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const place = ([x, y]: Pt): Pt => [540 + s * ((mirror ? 1080 - x : x) - (mirror ? 1080 - cx : cx)), 540 + s * (y - cy)];
  const detailStart = def.lines.length * LINE_STEP + LINE_DUR * 0.6;
  const Base: React.FC<IconProps> = ({ delay = 0 }) => {
    const outer = useStrokeScale();
    const clipId = `bx${React.useId().replace(/:/g, "")}`;
    return (
    <Frame breath={0.008}>
      <g transform={`translate(540 540) scale(${mirror ? -s : s} ${s}) translate(${-cx} ${-cy})`}>
        {def.clip ? (
          <defs>
            <clipPath id={clipId}>
              <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
            </clipPath>
          </defs>
        ) : null}
        <g clipPath={def.clip ? `url(#${clipId})` : undefined}>
        <StrokeScale value={outer / s}>
        {def.lines.map((d, i) => (
          <DrawPath key={i} d={d} delay={delay + i * LINE_STEP} duration={LINE_DUR} strokeWidth={STROKE} />
        ))}
        {details.map((d, i) => (
          <DrawPath
            key={`d${i}`}
            d={d}
            delay={delay + detailStart + i * DETAIL_STEP}
            duration={DETAIL_DUR}
            strokeWidth={STROKE_THIN}
            opacity={0.7}
          />
        ))}
        </StrokeScale>
        </g>
      </g>
    </Frame>
    );
  };
  const icon = Base as BodyIcon;
  icon.buildEnd = details.length
    ? detailStart + (details.length - 1) * DETAIL_STEP + DETAIL_DUR
    : (def.lines.length - 1) * LINE_STEP + LINE_DUR;
  icon.points = Object.fromEntries(Object.entries(def.points).map(([k, p]) => [k, place(p)]));
  return icon;
};
