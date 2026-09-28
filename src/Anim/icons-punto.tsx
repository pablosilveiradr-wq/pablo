import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Appear,
  DrawPath,
  Dot,
  Frame,
  IconProps,
  circlePath,
  useReveal,
} from "./primitives";
import { STROKE_THIN } from "./theme";

/**
 * "El punto" — the P6 tool. The forearm is five icons that share one frame and
 * play as a single scene, so the location is learned by accumulation: wrist
 * crease, three fingers up, the midline, the tendons, then the point itself.
 * Every layer below is authored against these same coordinates.
 */
const ArmFrame: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <Frame scale={1.1} dy={7}>
    {children}
  </Frame>
);

/**
 * Wrist crease, and the point three finger-widths up from it. The arm is
 * framed as a close-up: the elbow runs off the top, the hand off the bottom,
 * which is what keeps it reading as a forearm rather than a tumbler.
 */
const CREASE = 690;
const POINT = 534;

/** The forearm, inner face up, with the crease the measurement starts from. */
export const ArmBase: React.FC<IconProps> = ({ delay = 0 }) => (
  <ArmFrame>
    <DrawPath
      d="M 445 690 C 440 600 426 430 415 250"
      delay={delay}
      duration={34}
    />
    <DrawPath
      d="M 635 690 C 640 600 654 430 665 250"
      delay={delay + 8}
      duration={34}
    />
    <DrawPath
      d="M 445 690 C 432 742 418 786 414 848 C 411 900 416 950 419 1010"
      delay={delay + 26}
      duration={30}
    />
    <DrawPath
      d="M 635 690 C 648 742 662 786 666 848 C 669 900 664 950 661 1010"
      delay={delay + 32}
      duration={30}
    />
    <DrawPath
      d={`M 445 ${CREASE} Q 540 713 635 ${CREASE}`}
      delay={delay + 48}
      duration={24}
    />
  </ArmFrame>
);

/** Three finger-widths measured off the crease, toward the elbow. */
export const ArmThree: React.FC<IconProps> = ({ delay = 0 }) => (
  <ArmFrame>
    {[
      ["M 445 638 L 635 638", 0],
      ["M 441 586 L 639 586", 10],
      [`M 438 ${POINT} L 642 ${POINT}`, 20],
    ].map(([d, t], i) => (
      <DrawPath
        key={i}
        d={d as string}
        delay={delay + (t as number)}
        duration={18}
        strokeWidth={STROKE_THIN}
        opacity={0.55}
      />
    ))}
    <DrawPath
      d={`M 426 ${CREASE} L 412 ${CREASE} L 412 ${POINT} L 426 ${POINT}`}
      delay={delay + 34}
      duration={26}
      strokeWidth={STROKE_THIN}
    />
  </ArmFrame>
);

/** The midline of the inner face, where the point sits. */
export const ArmInner: React.FC<IconProps> = ({ delay = 0 }) => (
  <ArmFrame>
    <Appear delay={delay} duration={20} opacity={0.4}>
      <line
        x1={540}
        y1={676}
        x2={540}
        y2={396}
        strokeWidth={STROKE_THIN}
        strokeDasharray="12 16"
      />
    </Appear>
  </ArmFrame>
);

/** The two tendons the point sits between. */
export const ArmTendons: React.FC<IconProps> = ({ delay = 0 }) => (
  <ArmFrame>
    <DrawPath
      d="M 508 660 C 505 592 507 486 513 404"
      delay={delay}
      duration={32}
    />
    <DrawPath
      d="M 572 660 C 575 592 573 486 567 404"
      delay={delay + 10}
      duration={32}
    />
  </ArmFrame>
);

/** Press here, and keep pressing. */
export const ArmPress: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const shown = useReveal(delay + 18, 18);
  return (
    <ArmFrame>
      <Dot cx={540} cy={POINT} r={17} delay={delay} />
      {[0, 1].map((i) => {
        const t = ((frame / 52 + i * 0.5) % 1 + 1) % 1;
        return (
          <circle
            key={i}
            cx={540}
            cy={POINT}
            r={20 + t * 42}
            fill="none"
            strokeWidth={STROKE_THIN}
            opacity={(1 - t) * 0.55 * shown}
          />
        );
      })}
    </ArmFrame>
  );
};

/** Head and shoulders, with the two places the knot shows up. */
const Torso: React.FC<{ readonly delay: number }> = ({ delay }) => (
  <>
    <DrawPath d={circlePath(540, 458, 72)} delay={delay} duration={26} />
    <DrawPath
      d="M 400 760 L 400 620 C 400 500 680 500 680 620 L 680 760"
      delay={delay + 18}
      duration={36}
      occlude
    />
  </>
);

/** Chest and stomach, the two places the script names. */
const ZONES: readonly (readonly [number, number])[] = [
  [600, 38],
  [692, 32],
];

/** The knot, in the chest and in the stomach. */
export const TightTorso: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.07} dy={-35} breath={0.012}>
    <Torso delay={delay} />
    {ZONES.map(([cy, r], i) => (
      <g key={i}>
        <DrawPath
          d={circlePath(540, cy, r)}
          delay={delay + 44 + i * 14}
          duration={20}
          strokeWidth={STROKE_THIN}
        />
        <DrawPath
          d={circlePath(540, cy, r * 0.5)}
          delay={delay + 56 + i * 14}
          duration={16}
          strokeWidth={STROKE_THIN}
        />
        {[0, 1, 2, 3].map((k) => {
          const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
          return (
            <Appear
              key={k}
              delay={delay + 70 + i * 14 + k * 3}
              duration={10}
              opacity={0.6}
            >
              <line
                x1={540 + Math.cos(a) * (r + 30)}
                y1={cy + Math.sin(a) * (r + 30)}
                x2={540 + Math.cos(a) * (r + 10)}
                y2={cy + Math.sin(a) * (r + 10)}
                strokeWidth={STROKE_THIN}
              />
            </Appear>
          );
        })}
      </g>
    ))}
  </Frame>
);

/** The same two places, let go of. */
export const CalmTorso: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const shown = useReveal(delay + 50, 20);
  return (
    <Frame scale={1.07} dy={-35} breath={0.02}>
      <Torso delay={delay} />
      {ZONES.map(([cy, r], i) => (
        <g key={i}>
          <DrawPath
            d={circlePath(540, cy, r * 0.85)}
            delay={delay + 44 + i * 14}
            duration={20}
            strokeWidth={STROKE_THIN}
            opacity={0.5}
          />
          {[0, 1].map((k) => {
            const t = ((frame / 64 + k * 0.5 + i * 0.25) % 1 + 1) % 1;
            return (
              <circle
                key={k}
                cx={540}
                cy={cy}
                r={r + t * 44}
                fill="none"
                strokeWidth={STROKE_THIN}
                opacity={(1 - t) * 0.45 * shown}
              />
            );
          })}
        </g>
      ))}
    </Frame>
  );
};
