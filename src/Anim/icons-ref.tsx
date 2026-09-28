import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Appear,
  DrawPath,
  Frame,
  IconProps,
  circlePath,
  useBreath,
  useDrawFrame,
} from "./primitives";
import { CENTER, INK, STROKE_THIN } from "./theme";

/**
 * Icons rebuilt one-to-one from the reference reels: pure outline, one
 * centred subject, everything drawn on with the stroke itself.
 */

/** Shoulders-and-head silhouette every "person" beat in the references sits on. */
const Torso: React.FC<{ readonly delay: number; readonly y?: number }> = ({
  delay,
  y = 700,
}) => (
  <DrawPath
    d={`M 372 ${y} L 372 ${y - 46} C 372 ${y - 140} 708 ${y - 140} 708 ${y - 46} L 708 ${y} Z`}
    delay={delay}
    duration={30}
  />
);

/** Disappointed face — the opening beat of the first reference. */
export const SadPerson: React.FC<IconProps> = ({ delay = 0 }) => {
  return (
    <Frame scale={1.1} dy={24} breath={0.02}>
      <DrawPath d={circlePath(540, 452, 116)} delay={delay} duration={30} />
      <DrawPath d="M 466 420 Q 492 400 518 406" delay={delay + 16} duration={12} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 562 406 Q 588 400 614 420" delay={delay + 20} duration={12} strokeWidth={STROKE_THIN} />
      <Appear delay={delay + 26} duration={10}>
        <circle cx={496} cy={452} r={8} fill={INK} stroke="none" />
        <circle cx={584} cy={452} r={8} fill={INK} stroke="none" />
      </Appear>
      <DrawPath d="M 492 528 Q 540 492 588 528" delay={delay + 30} duration={14} />
      <Torso delay={delay + 34} />
    </Frame>
  );
};

/** Scattered dots trailing tails — the "confusion" beat. */
export const ScatterDots: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useDrawFrame();
  const seeds = [
    { x: 360, y: 400, r: 34, a: -2.5, len: 210, o: 1 },
    { x: 540, y: 368, r: 38, a: -1.8, len: 230, o: 1 },
    { x: 712, y: 402, r: 34, a: -0.9, len: 200, o: 0.92 },
    { x: 300, y: 606, r: 32, a: 2.7, len: 240, o: 0.72 },
    { x: 780, y: 606, r: 32, a: 0.5, len: 240, o: 0.72 },
    { x: 418, y: 668, r: 28, a: 2.2, len: 220, o: 0.55 },
    { x: 540, y: 716, r: 26, a: 1.6, len: 200, o: 0.45 },
    { x: 664, y: 706, r: 26, a: 1.0, len: 200, o: 0.45 },
  ];
  const grown = seeds.map((d, i) => ({
    d,
    t: interpolate(frame - delay - i * 4, [0, 24], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  }));
  return (
    <g>
      {grown.map(({ d, t }, i) =>
        t <= 0 ? null : (
          <path
            key={i}
            d={`M ${d.x} ${d.y} Q ${d.x + Math.cos(d.a - 0.9) * d.len * 0.62} ${
              d.y + Math.sin(d.a - 0.9) * d.len * 0.62
            } ${d.x + Math.cos(d.a) * d.len} ${d.y + Math.sin(d.a) * d.len}`}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - t}
            strokeWidth={STROKE_THIN}
            opacity={d.o}
          />
        ),
      )}
      {grown.map(({ d, t }, i) =>
        t <= 0 ? null : (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r * t}
            fill={INK}
            stroke="none"
            opacity={d.o}
          />
        ),
      )}
    </g>
  );
};

/** Bottle and wine glass — the "replace the alcohol" beat. */
export const BottleGlass: React.FC<IconProps> = ({ delay = 0 }) => {
  const s = useBreath(0.015);
  return (
    <g
      style={{
        transform: `scale(${s})`,
        transformOrigin: `${CENTER}px ${CENTER}px`,
        transformBox: "view-box",
      }}
    >
      <DrawPath d="M 404 318 L 452 318 L 452 372 L 404 372 Z" delay={delay} duration={12} strokeWidth={STROKE_THIN} />
      <DrawPath
        d="M 412 372 L 412 448 C 412 470 386 486 386 520 L 386 706 A 14 14 0 0 0 400 720 L 456 720 A 14 14 0 0 0 470 706 L 470 520 C 470 486 444 470 444 448 L 444 372"
        delay={delay + 8}
        duration={34}
      />
      <DrawPath d="M 386 546 L 470 546" delay={delay + 34} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 386 636 L 470 636" delay={delay + 38} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath
        d="M 556 474 L 690 474 L 676 566 C 668 612 578 612 570 566 Z"
        delay={delay + 30}
        duration={28}
      />
      <DrawPath d="M 623 608 L 623 690" delay={delay + 52} duration={10} />
      <DrawPath d="M 576 694 L 670 694" delay={delay + 58} duration={10} />
    </g>
  );
};

/** Sleeper under a rising sun — the "wake up early" beat. */
export const WakeEarly: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 130) * Math.PI * 2) * 6;
  return (
    <g>
      <g transform={`translate(0 ${drift})`}>
        <DrawPath d={circlePath(540, 340, 66)} delay={delay} duration={26} />
        {[-2.6, -2.1, -1.6, -1.05, -0.5, 0.05].map((a, i) => (
          <Appear key={i} delay={delay + 18 + i * 3} duration={10}>
            <line
              x1={540 + Math.cos(a) * 82}
              y1={340 + Math.sin(a) * 82}
              x2={540 + Math.cos(a) * 104}
              y2={340 + Math.sin(a) * 104}
              strokeWidth={STROKE_THIN}
            />
          </Appear>
        ))}
        <DrawPath
          d="M 452 398 A 30 30 0 0 1 508 384 A 34 34 0 0 1 566 398 Z"
          delay={delay + 28}
          duration={20}
          strokeWidth={STROKE_THIN}
          occlude
        />
      </g>
      <DrawPath
        d="M 396 464 A 26 26 0 0 1 422 438 L 658 438 A 26 26 0 0 1 684 464 L 684 528 A 26 26 0 0 1 658 554 L 422 554 A 26 26 0 0 1 396 528 Z"
        delay={delay + 24}
        duration={32}
      />
      <DrawPath d={circlePath(540, 496, 54)} delay={delay + 44} duration={26} />
      <Torso delay={delay + 56} y={716} />
    </g>
  );
};

/** Video window with a scrub bar — the "your first video" beat. */
export const VideoWindow: React.FC<IconProps> = ({ delay = 0 }) => {
  const play = interpolate(useDrawFrame() - delay - 74, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g>
      <DrawPath
        d="M 372 404 A 16 16 0 0 1 388 388 L 692 388 A 16 16 0 0 1 708 404 L 708 692 A 16 16 0 0 1 692 708 L 388 708 A 16 16 0 0 1 372 692 Z"
        delay={delay}
        duration={38}
      />
      <DrawPath d="M 372 442 L 708 442" delay={delay + 30} duration={16} strokeWidth={STROKE_THIN} />
      <DrawPath
        d="M 412 482 L 668 482 L 668 628 L 412 628 Z"
        delay={delay + 40}
        duration={26}
        strokeWidth={STROKE_THIN}
      />
      <Appear delay={delay + 62} duration={12}>
        <path d="M 404 656 L 404 684 L 428 670 Z" fill={INK} stroke="none" />
      </Appear>
      <DrawPath d="M 444 670 L 676 670" delay={delay + 66} duration={14} strokeWidth={STROKE_THIN} />
      <Appear delay={delay + 74} duration={8}>
        <circle cx={444 + play * 232} cy={670} r={9} fill={INK} stroke="none" />
      </Appear>
    </g>
  );
};

/** Podium with a lone figure — the "if you lost, you will win" beat. */
export const PodiumStep: React.FC<IconProps> = ({ delay = 0 }) => {
  const s = useBreath(0.012);
  return (
    <g
      style={{
        transform: `scale(${s})`,
        transformOrigin: `${CENTER}px ${CENTER}px`,
        transformBox: "view-box",
      }}
    >
      <DrawPath d={circlePath(432, 384, 50)} delay={delay} duration={24} />
      <DrawPath
        d="M 366 504 C 366 442 498 442 498 504 L 498 524 L 366 524 Z"
        delay={delay + 18}
        duration={26}
      />
      <DrawPath d="M 358 524 L 358 700 L 506 700 L 506 524 Z" delay={delay + 34} duration={30} />
      <DrawPath d="M 554 700 L 554 596 L 726 596 L 726 700 Z" delay={delay + 52} duration={30} />
      <DrawPath d="M 296 702 L 784 702" delay={delay + 70} duration={18} />
    </g>
  );
};
