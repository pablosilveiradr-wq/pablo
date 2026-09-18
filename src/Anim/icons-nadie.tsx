import React from "react";
import {
  Appear,
  DrawPath,
  Dot,
  Frame,
  IconProps,
  circlePath,
} from "./primitives";
import { heartPath } from "./shapes";
import { STROKE_THIN } from "./theme";

/**
 * "Nadie ve" — the refrain lands on a shut eye three times, and the close
 * opens that same eye. Everything else is what nobody got to watch.
 */

/** @param open 0 shut, 1 looking straight at you. */
const eye = (open: number): React.FC<IconProps> => {
  const Eye: React.FC<IconProps> = ({ delay = 0 }) => (
    <Frame scale={1.12} dy={12} breath={0.012}>
      <DrawPath
        d="M 372 452 Q 540 398 708 452"
        delay={delay}
        duration={20}
        strokeWidth={STROKE_THIN}
        opacity={0.45}
      />
      {open > 0.05 ? (
        <DrawPath
          d={`M 340 540 Q 540 ${540 - 232 * open} 740 540`}
          delay={delay + 14}
          duration={30}
        />
      ) : null}
      <DrawPath
        d={`M 340 540 Q 540 ${540 + 112 * (0.35 + 0.65 * open)} 740 540`}
        delay={delay + 18}
        duration={30}
      />
      {open > 0.25 ? (
        <>
          <DrawPath
            d={circlePath(540, 540 + 16 * open, 62 * open)}
            delay={delay + 46}
            duration={22}
          />
          <Dot cx={540} cy={540 + 16 * open} r={24 * open} delay={delay + 62} />
        </>
      ) : null}
      {open < 0.3
        ? [430, 540, 650].map((x, i) => (
            <Appear key={i} delay={delay + 48 + i * 5} duration={12} opacity={0.6}>
              <line
                x1={x}
                y1={572 + (x === 540 ? 8 : 0)}
                x2={x - 14}
                y2={614 + (x === 540 ? 8 : 0)}
                strokeWidth={STROKE_THIN}
              />
            </Appear>
          ))
        : null}
      {open > 0.8
        ? [0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return (
              <Appear key={i} delay={delay + 74 + i * 3} duration={12} opacity={0.5}>
                <line
                  x1={540 + Math.cos(a) * 226}
                  y1={540 + Math.sin(a) * 158}
                  x2={540 + Math.cos(a) * 268}
                  y2={540 + Math.sin(a) * 188}
                  strokeWidth={STROKE_THIN}
                />
              </Appear>
            );
          })
        : null}
    </Frame>
  );
  return Eye;
};

export const EyeShut = eye(0);
export const EyeHalf = eye(0.45);
export const EyeSeeing = eye(1);

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
    <DrawPath
      d="M 690 610 C 716 630 718 655 706 672"
      delay={delay + 78}
      duration={16}
      strokeWidth={STROKE_THIN}
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
    <DrawPath d="M 540 604 L 540 688" delay={delay + 42} duration={22} />
    <DrawPath
      d="M 512 660 L 540 690 L 568 660"
      delay={delay + 60}
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
    <Appear delay={delay + 56} duration={16} opacity={0.3}>
      <path
        d="M 340 676 C 470 640 600 540 740 436"
        strokeWidth={STROKE_THIN}
        strokeDasharray="12 16"
      />
    </Appear>
    <Dot cx={740} cy={398} r={12} delay={delay + 70} />
  </Frame>
);
