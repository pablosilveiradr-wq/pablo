import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Appear,
  ArrowsInward,
  DashedRing,
  Dot,
  DrawPath,
  Frame,
  IconProps,
  Waves,
  circlePath,
} from "./primitives";
import { roundedRect } from "./shapes";
import { INK, STROKE_THIN } from "./theme";

/**
 * "Todavia estas a tiempo" — the refrain gets the same hourglass three times,
 * each one with less sand, so the repetition is the point instead of a repeat.
 */

/** @param level how full the top bulb still is, 1 to 0. */
const hourglass = (level: number): React.FC<IconProps> => {
  const Glass: React.FC<IconProps> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const sy = 372 + (1 - level) * 158;
    const hw = 112 - ((sy - 372) / 158) * 104;
    const peak = 720 - 64 * (1 - level);
    return (
      <Frame scale={1.05} breath={0.01}>
        <DrawPath d="M 400 348 L 680 348" delay={delay} duration={18} />
        <DrawPath d="M 400 732 L 680 732" delay={delay + 10} duration={18} />
        <DrawPath
          d="M 424 348 C 424 462 540 502 540 540 C 540 578 424 618 424 732"
          delay={delay + 18}
          duration={30}
        />
        <DrawPath
          d="M 656 348 C 656 462 540 502 540 540 C 540 578 656 618 656 732"
          delay={delay + 26}
          duration={30}
        />
        {level > 0.03 ? (
          <DrawPath
            d={`M ${540 - hw} ${sy} L ${540 + hw} ${sy}`}
            delay={delay + 50}
            duration={14}
            strokeWidth={STROKE_THIN}
          />
        ) : null}
        <DrawPath
          d={`M 458 720 C 472 ${peak} 608 ${peak} 622 720`}
          delay={delay + 56}
          duration={18}
          strokeWidth={STROKE_THIN}
        />
        <Appear delay={delay + 64} duration={12}>
          {[0, 1].map((i) => {
            const t = ((frame / 38 + i * 0.5) % 1 + 1) % 1;
            return (
              <circle
                key={i}
                cx={540}
                cy={550 + t * 150}
                r={4}
                fill={INK}
                stroke="none"
                opacity={(1 - t) * 0.75}
              />
            );
          })}
        </Appear>
      </Frame>
    );
  };
  return Glass;
};

export const StillTime1 = hourglass(0.78);
export const StillTime2 = hourglass(0.52);
export const StillTime3 = hourglass(0.28);
export const SandLow = hourglass(0.02);

/** The call you have not made. */
export const PhoneCall: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.05} dx={-20} dy={-10} breath={0.012}>
    <DrawPath
      d={roundedRect(430, 360, 220, 380, 30)}
      delay={delay}
      duration={38}
      occlude
    />
    <DrawPath
      d="M 505 398 L 575 398"
      delay={delay + 30}
      duration={10}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d={circlePath(540, 688, 18)}
      delay={delay + 38}
      duration={12}
      strokeWidth={STROKE_THIN}
    />
    <Waves cx={664} cy={440} count={3} gap={26} spread={0.8} rotate={90} delay={delay + 48} />
  </Frame>
);

/** Starting the thing again. */
export const StartAgain: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.25} dy={-40}>
    <DrawPath
      d="M 380 690 L 700 690"
      delay={delay}
      duration={26}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d="M 540 690 C 540 610 540 540 540 462"
      delay={delay + 20}
      duration={28}
    />
    <DrawPath
      d="M 540 594 C 468 594 438 548 443 522 C 489 517 535 548 540 594"
      delay={delay + 40}
      duration={26}
    />
    <DrawPath
      d="M 540 532 C 612 532 642 486 637 460 C 591 455 545 486 540 532"
      delay={delay + 56}
      duration={26}
    />
  </Frame>
);

/** What you put down and never picked up: the shape left open. */
export const LeftBehind: React.FC<IconProps> = ({ delay = 0 }) => {
  const R = 185;
  const a0 = -Math.PI / 2;
  const a1 = a0 + (240 * Math.PI) / 180;
  const x0 = 540 + Math.cos(a0) * R;
  const y0 = 540 + Math.sin(a0) * R;
  const x1 = 540 + Math.cos(a1) * R;
  const y1 = 540 + Math.sin(a1) * R;
  return (
    <Frame scale={1.05} breath={0.012}>
      <DrawPath
        d={`M ${x0} ${y0} A ${R} ${R} 0 1 1 ${x1} ${y1}`}
        delay={delay}
        duration={44}
      />
      <Appear delay={delay + 48} duration={16} opacity={0.35}>
        <path
          d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x0} ${y0}`}
          strokeWidth={STROKE_THIN}
          strokeDasharray="12 16"
        />
      </Appear>
      <Dot cx={x1} cy={y1} r={10} delay={delay + 52} />
    </Frame>
  );
};

/** One word, and only one. */
export const OneWord: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.12} breath={0.012}>
    <DrawPath
      d="M 380 400 L 700 400 A 40 40 0 0 1 740 440 L 740 600 A 40 40 0 0 1 700 640 L 520 640 L 468 700 L 468 640 L 380 640 A 40 40 0 0 1 340 600 L 340 440 A 40 40 0 0 1 380 400 Z"
      delay={delay}
      duration={46}
      occlude
    />
    <DrawPath d="M 432 520 L 648 520" delay={delay + 44} duration={20} />
  </Frame>
);

/** Take it while it is still there. */
export const UseItNow: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.85}>
    <Dot cx={540} cy={540} r={24} delay={delay} />
    <DashedRing
      cx={540}
      cy={540}
      r={145}
      count={40}
      delay={delay + 12}
      duration={28}
      opacity={0.45}
    />
    <ArrowsInward cx={540} cy={540} radius={190} length={58} count={6} delay={delay + 34} />
  </Frame>
);
