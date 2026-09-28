import React from "react";
import {
  Appear,
  DashedRing,
  Dot,
  DrawPath,
  Frame,
  IconProps,
  circlePath,
} from "./primitives";
import { cloudPath, roundedRect } from "./shapes";
import { STROKE, STROKE_THIN } from "./theme";

/**
 * "Las dos flechas" — the Buddha parable. Every beat that names an arrow draws
 * the same arrow, so the first and the second read as the same object.
 */

/** Shaft, barbs and fletching, drawn on in that order. */
const Arrow: React.FC<{
  readonly from: readonly [number, number];
  readonly to: readonly [number, number];
  readonly delay?: number;
  readonly duration?: number;
  readonly opacity?: number;
  readonly feathers?: boolean;
}> = ({ from, to, delay = 0, duration = 28, opacity = 1, feathers = true }) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const back = a + Math.PI;
  const barb = 34;
  const spread = 0.42;
  const perp = a + Math.PI / 2;
  const fl = 17;
  return (
    <>
      <DrawPath
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        delay={delay}
        duration={duration}
        opacity={opacity}
      />
      <DrawPath
        d={
          `M ${x2 + Math.cos(back + spread) * barb} ${y2 + Math.sin(back + spread) * barb} ` +
          `L ${x2} ${y2} ` +
          `L ${x2 + Math.cos(back - spread) * barb} ${y2 + Math.sin(back - spread) * barb}`
        }
        delay={delay + duration * 0.72}
        duration={12}
        opacity={opacity}
      />
      {feathers
        ? [0, 1, 2].map((i) => {
            const t = 6 + i * 25;
            const bx = x1 + Math.cos(a) * t;
            const by = y1 + Math.sin(a) * t;
            return (
              <Appear
                key={i}
                delay={delay + duration * 0.55 + i * 4}
                duration={10}
                opacity={opacity}
              >
                <line
                  x1={bx + Math.cos(perp) * fl}
                  y1={by + Math.sin(perp) * fl}
                  x2={bx - Math.cos(perp) * fl}
                  y2={by - Math.sin(perp) * fl}
                  strokeWidth={STROKE_THIN}
                />
              </Appear>
            );
          })
        : null}
    </>
  );
};

/** Short lines radiating off the point an arrow lands on. */
const Impact: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly delay: number;
}> = ({ cx, cy, delay }) => (
  <>
    <Dot cx={cx} cy={cy} r={13} delay={delay} />
    {[0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return (
        <Appear key={i} delay={delay + 6 + i * 3} duration={10} opacity={0.7}>
          <line
            x1={cx + Math.cos(a) * 26}
            y1={cy + Math.sin(a) * 26}
            x2={cx + Math.cos(a) * 48}
            y2={cy + Math.sin(a) * 48}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      );
    })}
  </>
);

/** Buddha telling it. */
export const BuddhaTells: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.95} dx={-25} dy={50} breath={0.012}>
    <DrawPath d={circlePath(540, 354, 38)} delay={delay} duration={22} />
    <DrawPath
      d="M 454 564 C 454 424 488 396 540 396 C 592 396 626 424 626 564"
      delay={delay + 12}
      duration={28}
    />
    <DrawPath
      d="M 394 564 C 394 632 460 652 540 652 C 620 652 686 632 686 564"
      delay={delay + 26}
      duration={30}
    />
    <DrawPath
      d="M 456 492 C 406 524 392 544 396 566"
      delay={delay + 40}
      duration={16}
    />
    <DrawPath
      d="M 624 492 C 674 524 688 544 684 566"
      delay={delay + 44}
      duration={16}
    />
    {[
      ["M 706 400 A 34 34 0 0 1 706 460", 0.8],
      ["M 730 384 A 58 58 0 0 1 730 476", 0.55],
      ["M 754 368 A 82 82 0 0 1 754 492", 0.32],
    ].map(([d, o], i) => (
      <DrawPath
        key={i}
        d={d as string}
        delay={delay + 56 + i * 7}
        duration={14}
        strokeWidth={STROKE_THIN}
        opacity={o as number}
      />
    ))}
  </Frame>
);

/** Two arrows land, not one. */
export const TwoArrows: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.91} dy={48}>
    <DrawPath d={circlePath(540, 560, 115)} delay={delay} duration={30} occlude />
    <DrawPath
      d={circlePath(540, 560, 58)}
      delay={delay + 22}
      duration={18}
      strokeWidth={STROKE_THIN}
    />
    <Arrow from={[320, 330]} to={[498, 520]} delay={delay + 34} duration={26} />
    <Arrow from={[760, 330]} to={[582, 520]} delay={delay + 52} duration={26} />
    <Dot cx={540} cy={560} r={12} delay={delay + 84} />
  </Frame>
);

/** The first one: what actually happened. */
export const FirstArrow: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.05} dx={80} dy={90}>
    <Arrow from={[300, 300]} to={[575, 555]} delay={delay} duration={34} />
    <Impact cx={597} cy={577} delay={delay + 44} />
  </Frame>
);

/** The second one: the part you fire at yourself, out of a thought. */
export const SecondArrow: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.85} dx={17} dy={41}>
    <DrawPath d={cloudPath(500, 360, 165, 88, 11)} delay={delay} duration={38} />
    <Arrow
      from={[560, 460]}
      to={[655, 655]}
      delay={delay + 34}
      duration={30}
      feathers={false}
    />
    <Impact cx={672} cy={678} delay={delay + 66} />
  </Frame>
);

/** And it lands in the body. */
export const ArrowBody: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1} dx={69} dy={34}>
    <DrawPath d={circlePath(540, 400, 80)} delay={delay} duration={26} />
    <DrawPath
      d="M 410 700 L 410 615 C 410 530 670 530 670 615 L 670 700"
      delay={delay + 20}
      duration={34}
      occlude
    />
    <Arrow from={[290, 330]} to={[495, 618]} delay={delay + 44} duration={30} />
    <Impact cx={512} cy={638} delay={delay + 78} />
  </Frame>
);

/** Worrying: the same thought going round again. */
export const WorryLoop: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.05} dy={-5} breath={0.012}>
    <DrawPath d={circlePath(540, 545, 105)} delay={delay} duration={28} occlude />
    <DashedRing
      cx={540}
      cy={545}
      r={190}
      count={40}
      delay={delay + 20}
      duration={30}
      opacity={0.4}
    />
    <DrawPath
      d="M 625 385 A 190 190 0 0 0 455 385"
      delay={delay + 44}
      duration={26}
    />
    <DrawPath
      d="M 478 362 L 455 385 L 477 408"
      delay={delay + 66}
      duration={12}
    />
  </Frame>
);

/** The body held in the alarm the thought keeps ringing. */
export const StressBody: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.95} dy={15}>
    <DrawPath d={circlePath(540, 430, 82)} delay={delay} duration={26} />
    <DrawPath
      d="M 400 700 L 400 620 C 400 530 680 530 680 620 L 680 700"
      delay={delay + 20}
      duration={34}
      occlude
    />
    <DrawPath
      d="M 502 582 L 542 617 L 507 632 L 547 667"
      delay={delay + 46}
      duration={22}
    />
    {[
      ["M 360 570 A 44 44 0 0 0 360 640", "M 720 570 A 44 44 0 0 1 720 640", 0.7],
      ["M 330 548 A 70 70 0 0 0 330 662", "M 750 548 A 70 70 0 0 1 750 662", 0.4],
    ].map(([l, r, o], i) => (
      <g key={i}>
        <DrawPath
          d={l as string}
          delay={delay + 62 + i * 8}
          duration={16}
          strokeWidth={STROKE_THIN}
          opacity={o as number}
        />
        <DrawPath
          d={r as string}
          delay={delay + 66 + i * 8}
          duration={16}
          strokeWidth={STROKE_THIN}
          opacity={o as number}
        />
      </g>
    ))}
  </Frame>
);

/** The event closed, the alarm still running. */
export const ProblemOver: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.98} dx={-15} dy={5}>
    <DrawPath d={roundedRect(350, 450, 170, 170, 14)} delay={delay} duration={32} occlude />
    <DrawPath
      d="M 386 536 L 421 571 L 489 496"
      delay={delay + 28}
      duration={20}
    />
    <DrawPath
      d="M 548 535 q 25 -38 50 0 q 25 38 50 0 q 25 -38 50 0 q 25 38 50 0"
      delay={delay + 46}
      duration={34}
      strokeWidth={STROKE}
    />
    <Dot cx={766} cy={535} r={9} delay={delay + 84} opacity={0.8} />
  </Frame>
);
