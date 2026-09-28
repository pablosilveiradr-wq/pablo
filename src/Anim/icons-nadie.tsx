import React from "react";
import {
  Appear,
  DrawPath,
  Dot,
  Frame,
  IconProps,
  circlePath,
  useReveal,
} from "./primitives";
import { heartPath } from "./shapes";
import { INK, STROKE_THIN } from "./theme";

/**
 * "Nadie ve" — the refrain lands on a shut eye three times, and the close
 * opens that same eye. Everything else is what nobody got to watch.
 */

/** Corners the lids share, so every lash and lid starts on the same curve. */
const EYE_L = 340;
const EYE_R = 740;
const EYE_Y = 540;
/**
 * How far each lid bows from the corner line at full open. Keeping the lift
 * close to the sag is what makes it read as an eye instead of a leaf: too much
 * lift and the almond goes top-heavy and the iris looks off-centre.
 */
const SAG = 52;
const LIFT = 82;

/**
 * A quadratic pinned at both corners sits at EYE_Y + 2t(1-t)(cy - EYE_Y), so a
 * control point 2*SAG below the corners bottoms out SAG below them. Lashes and
 * the iris are placed off this, never off the control point.
 */
const lidAt = (x: number, control: number) => {
  const t = (x - EYE_L) / (EYE_R - EYE_L);
  return EYE_Y + 2 * t * (1 - t) * (control - EYE_Y);
};

/** @param from how open the eye starts, `to` where the beat leaves it. */
const eye = (from: number, to: number): React.FC<IconProps> => {
  const Eye: React.FC<IconProps> = ({ delay = 0 }) => {
    const p = useReveal(delay + 14, 46);
    const open = from + (to - from) * p;
    const iris = Math.min(1, Math.max(0, (open - 0.15) / 0.5));
    // Centre the iris in the gap the two lids actually leave at mid-span.
    const upper = lidAt(540, EYE_Y - 2 * LIFT * open);
    const lower = lidAt(540, EYE_Y + 2 * SAG);
    const irisY = (upper + lower) / 2;
    const irisR = ((lower - upper) / 2) * 0.76 * iris;
    return (
      <Frame scale={1.12} dy={12} breath={0.012}>
        <DrawPath
          d="M 372 452 Q 540 398 708 452"
          delay={delay}
          duration={20}
          strokeWidth={STROKE_THIN}
          opacity={0.45}
        />
        <DrawPath
          d={`M ${EYE_L} ${EYE_Y} Q 540 ${EYE_Y + 2 * SAG} ${EYE_R} ${EYE_Y}`}
          delay={delay + 18}
          duration={30}
        />
        {open > 0.02 ? (
          <path
            d={`M ${EYE_L} ${EYE_Y} Q 540 ${EYE_Y - 2 * LIFT * open} ${EYE_R} ${EYE_Y}`}
            opacity={Math.min(1, open / 0.12)}
          />
        ) : null}
        {irisR > 1 ? (
          <>
            <path d={circlePath(540, irisY, irisR)} opacity={iris} />
            <circle
              cx={540}
              cy={irisY}
              r={irisR * 0.4}
              fill={INK}
              stroke="none"
              opacity={iris}
            />
          </>
        ) : null}
        {to < 0.05
          ? [420, 540, 660].map((x, i) => {
              const y = lidAt(x, EYE_Y + 2 * SAG);
              const dx = (x - 540) * 0.13;
              return (
                <Appear key={i} delay={delay + 44 + i * 5} duration={12} opacity={0.7}>
                  <line
                    x1={x}
                    y1={y}
                    x2={x + dx}
                    y2={y + 44}
                    strokeWidth={STROKE_THIN}
                  />
                </Appear>
              );
            })
          : null}
        {open > 0.75
          ? [0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const k = (open - 0.75) / 0.25;
              return (
                <line
                  key={i}
                  x1={540 + Math.cos(a) * 250}
                  y1={EYE_Y + Math.sin(a) * 175}
                  x2={540 + Math.cos(a) * (250 + 40 * k)}
                  y2={EYE_Y + Math.sin(a) * (175 + 28 * k)}
                  strokeWidth={STROKE_THIN}
                  opacity={k * 0.55}
                />
              );
            })
          : null}
      </Frame>
    );
  };
  return Eye;
};

export const EyeShut = eye(0, 0);
export const EyeHalf = eye(0, 0.45);
export const EyeSeeing = eye(0.45, 1);

/** Getting up anyway, on the mornings it cost something. */
export const WakeNoWill: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.15} dx={10} dy={-54}>
    <DrawPath d="M 330 700 L 330 545" delay={delay} duration={22} />
    <DrawPath
      d="M 330 645 L 730 645 L 730 700"
      delay={delay + 14}
      duration={30}
    />
    <DrawPath
      d="M 352 645 L 352 602 C 352 587 420 587 420 602 L 420 645"
      delay={delay + 34}
      duration={20}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath d={circlePath(640, 548, 46)} delay={delay + 44} duration={24} />
    <DrawPath
      d="M 588 645 C 588 578 692 578 692 645"
      delay={delay + 60}
      duration={24}
      occlude
    />
  </Frame>
);

/** What you kept in: a bubble that never got said, sinking. */
export const SwallowedWords: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.25} dy={-6}>
    <Appear delay={delay} duration={22} opacity={0.4}>
      <path
        d="M 400 380 L 680 380 A 40 40 0 0 1 720 420 L 720 540 A 40 40 0 0 1 680 580 L 400 580 A 40 40 0 0 1 360 540 L 360 420 A 40 40 0 0 1 400 380 Z"
        strokeWidth={STROKE_THIN}
        strokeDasharray="14 16"
      />
    </Appear>
    <DrawPath
      d="M 432 452 L 648 452"
      delay={delay + 20}
      duration={16}
      strokeWidth={STROKE_THIN}
      opacity={0.5}
    />
    <DrawPath
      d="M 432 508 L 580 508"
      delay={delay + 28}
      duration={14}
      strokeWidth={STROKE_THIN}
      opacity={0.5}
    />
    <DrawPath d="M 540 580 L 540 690" delay={delay + 42} duration={24} />
    <DrawPath
      d="M 512 662 L 540 690 L 568 662"
      delay={delay + 62}
      duration={14}
    />
  </Frame>
);

/** You swallowed it so it would not land on anyone. */
export const SparedHeart: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.07} dy={-17} breath={0.012}>
    <DrawPath
      d="M 540 370 L 706 432 L 706 566 C 706 662 626 712 540 742 C 454 712 374 662 374 566 L 374 432 Z"
      delay={delay}
      duration={44}
      occlude
    />
    <DrawPath
      d={heartPath(540, 552, 150)}
      delay={delay + 42}
      duration={30}
      strokeWidth={STROKE_THIN}
    />
  </Frame>
);

/** What it took to get here, one step at a time. */
export const ClimbCost: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.1} dy={-11}>
    <DrawPath
      d="M 330 700 L 424 700 L 424 630 L 518 630 L 518 560 L 612 560 L 612 490 L 706 490 L 706 420 L 760 420"
      delay={delay}
      duration={60}
    />
    <Dot cx={733} cy={408} r={12} delay={delay + 62} />
  </Frame>
);
