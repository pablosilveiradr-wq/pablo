import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Appear,
  ArrowsInward,
  circlePath,
  DashedRing,
  Dot,
  DrawPath,
  IconProps,
  Person,
  Ticks,
  useBreath,
  Waves,
} from "./primitives";
import { cloudPath } from "./shapes";
import { CENTER, STROKE_THIN } from "./theme";

const C = CENTER;

/** Anchoring: a still centre held by everything converging on it. */
export const AnchorBreath: React.FC<IconProps> = ({ delay = 0 }) => {
  const b = useBreath(0.035, 100);
  return (
    <g style={{ transform: `scale(${b})`, transformOrigin: `${C}px ${C}px`, transformBox: "view-box" }}>
      <DrawPath d={circlePath(C, C, 92)} delay={delay} duration={30} />
      <DashedRing cx={C} cy={C} r={218} delay={delay + 16} />
      <ArrowsInward cx={C} cy={C} radius={120} delay={delay + 34} />
      <Dot cx={C} cy={C} r={9} delay={delay + 50} />
    </g>
  );
};

/** The scroll: a lit phone and the people it quietly puts in the room. */
export const PhoneFeed: React.FC<IconProps> = ({ delay = 0 }) => {
  const w = 190;
  const h = 330;
  const x = C - w / 2;
  const y = C - h / 2;
  const around: [number, number][] = [
    [C - 330, C - 200],
    [C + 330, C - 200],
    [C - 360, C + 10],
    [C + 360, C + 10],
    [C - 300, C + 210],
    [C + 300, C + 210],
  ];
  return (
    <g>
      <DrawPath
        d={`M ${x + 26} ${y} L ${x + w - 26} ${y} A 26 26 0 0 1 ${x + w} ${y + 26} L ${x + w} ${y + h - 26} A 26 26 0 0 1 ${x + w - 26} ${y + h} L ${x + 26} ${y + h} A 26 26 0 0 1 ${x} ${y + h - 26} L ${x} ${y + 26} A 26 26 0 0 1 ${x + 26} ${y}`}
        delay={delay}
        duration={34}
      />
      <Appear delay={delay + 24} duration={10}>
        <line x1={C - 22} y1={y + 16} x2={C + 22} y2={y + 16} strokeWidth={STROKE_THIN} />
      </Appear>
      {[0, 1, 2].map((i) => (
        <Appear key={i} delay={delay + 34 + i * 8} duration={12} dy={14}>
          <rect
            x={x + 30}
            y={y + 92 + i * 62}
            width={w - 60}
            height={42}
            rx={12}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      ))}
      {around.map(([px, py], i) => (
        <Person key={i} x={px} y={py} size={1.1} delay={delay + 62 + i * 7} opacity={0.75} />
      ))}
    </g>
  );
};

/** A thought passing through, seen from outside instead of believed. */
export const ThoughtCloud: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 130) * Math.PI * 2) * 8;
  return (
    <g transform={`translate(${drift} 0)`}>
      <DrawPath d={cloudPath(C, C - 30, 235, 130)} delay={delay} duration={44} />
      {[0, 1].map((i) => (
        <Appear key={i} delay={delay + 34 + i * 9} duration={12}>
          <line
            x1={C - 150 + i * 30}
            y1={C - 60 + i * 52}
            x2={C + 150 - i * 30}
            y2={C - 60 + i * 52}
            strokeWidth={STROKE_THIN}
            strokeDasharray="26 20"
          />
        </Appear>
      ))}
      <Dot cx={C - 190} cy={C + 130} r={8} delay={delay + 54} />
      <Dot cx={C - 225} cy={C + 172} r={5} delay={delay + 62} />
    </g>
  );
};

/** Looking at the thought rather than from it. */
export const EyeOpen: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const blink = Math.max(0, Math.sin((frame / 150) * Math.PI * 2) - 0.97) * 33;
  const lid = 1 - blink;
  return (
    <g>
      <g style={{ transform: `scaleY(${lid})`, transformOrigin: `${C}px ${C}px`, transformBox: "view-box" }}>
        <DrawPath
          d={`M ${C - 210} ${C} Q ${C} ${C - 170} ${C + 210} ${C} Q ${C} ${C + 170} ${C - 210} ${C}`}
          delay={delay}
          duration={34}
        />
        <Appear delay={delay + 26} duration={14} scaleFrom={0.5} origin={[C, C]}>
          <circle cx={C} cy={C} r={48} />
        </Appear>
      </g>
      <Dot cx={C} cy={C} r={16} delay={delay + 40} />
    </g>
  );
};

/** The alarm: a body reacting before a thought arrives. */
export const BellRing: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const tilt = Math.sin((frame / 22) * Math.PI * 2) * 3.5;
  return (
    <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: `${C}px ${C - 120}px`, transformBox: "view-box" }}>
      <Appear delay={delay} duration={12}>
        <circle cx={C} cy={C - 112} r={11} strokeWidth={STROKE_THIN} />
      </Appear>
      <DrawPath
        d={`M ${C - 130} ${C + 72} C ${C - 130} ${C - 40} ${C - 86} ${C - 92} ${C} ${C - 92} C ${C + 86} ${C - 92} ${C + 130} ${C - 40} ${C + 130} ${C + 72}`}
        delay={delay + 8}
        duration={34}
      />
      <DrawPath d={`M ${C - 158} ${C + 72} L ${C + 158} ${C + 72}`} delay={delay + 32} duration={16} />
      <DrawPath d={`M ${C - 18} ${C + 72} q 18 30 36 0`} delay={delay + 42} duration={12} />
      <Waves cx={C - 190} cy={C - 10} count={3} gap={22} spread={0.75} rotate={-58} delay={delay + 46} />
      <Waves cx={C + 190} cy={C - 10} count={3} gap={22} spread={0.75} rotate={58} delay={delay + 46} />
    </g>
  );
};

/** Coming back down into the body: weight, floor, contact. */
export const FeetGround: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const sink = interpolate(Math.sin((frame / 90) * Math.PI * 2), [-1, 1], [0, 6]);
  const GROUND = C + 40;

  const foot = (fx: number, i: number) => {
    const d = delay + i * 6;
    const shoe =
      `M ${fx - 24} ${GROUND - 70} ` +
      `C ${fx - 36} ${GROUND - 42} ${fx - 38} ${GROUND - 14} ${fx - 20} ${GROUND - 4} ` +
      `L ${fx + 56} ${GROUND - 4} ` +
      `C ${fx + 84} ${GROUND - 4} ${fx + 88} ${GROUND - 26} ${fx + 66} ${GROUND - 34} ` +
      `L ${fx + 34} ${GROUND - 46} ` +
      `C ${fx + 26} ${GROUND - 52} ${fx + 24} ${GROUND - 60} ${fx + 24} ${GROUND - 70}`;
    return (
      <g key={i} transform={`translate(0 ${sink})`}>
        <DrawPath d={`M ${fx - 24} ${C - 230} L ${fx - 24} ${GROUND - 68}`} delay={d} duration={26} />
        <DrawPath d={`M ${fx + 24} ${C - 230} L ${fx + 24} ${GROUND - 68}`} delay={d + 4} duration={26} />
        <DrawPath d={shoe} delay={d + 20} duration={30} />
      </g>
    );
  };

  return (
    <g>
      {foot(C - 160, 0)}
      {foot(C + 40, 1)}
      <DrawPath d={`M ${C - 330} ${GROUND} L ${C + 330} ${GROUND}`} delay={delay + 44} duration={22} />
      {[-1, 1].map((s, i) => (
        <Appear key={i} delay={delay + 62 + i * 6} duration={12} dy={-16}>
          <line x1={C + s * 130} y1={GROUND + 36} x2={C + s * 130} y2={GROUND + 88} strokeWidth={STROKE_THIN} />
          <path
            d={`M ${C + s * 130 - 10} ${GROUND + 76} L ${C + s * 130} ${GROUND + 90} L ${C + s * 130 + 10} ${GROUND + 76}`}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      ))}
    </g>
  );
};

/** Time passing, and the one moment being lived. */
export const TimelineTicks: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame - delay - 50, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x0 = C - 320;
  const w = 640;
  return (
    <g>
      <Ticks x={x0} y={C + 90} width={w} count={7} height={26} delay={delay} />
      <Appear delay={delay + 44} duration={14} scaleFrom={0.6} origin={[C, C - 80]}>
        <circle cx={x0 + w * travel} cy={C - 80} r={40} />
      </Appear>
      <Dot cx={x0 + w * travel} cy={C - 80} r={9} delay={delay + 56} />
      <Appear delay={delay + 56} duration={12} opacity={0.5}>
        <line
          x1={x0 + w * travel}
          y1={C - 34}
          x2={x0 + w * travel}
          y2={C + 70}
          strokeWidth={STROKE_THIN}
          strokeDasharray="10 12"
        />
      </Appear>
    </g>
  );
};

/** Pressure: something small squeezed from both sides. */
export const PressureKnot: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const squeeze = interpolate(Math.sin((frame / 80) * Math.PI * 2), [-1, 1], [0, 26]);
  return (
    <g>
      {[0, 60, 120].map((rot, i) => (
        <Appear key={i} delay={delay + i * 10} duration={20}>
          <ellipse
            cx={C}
            cy={C}
            rx={118}
            ry={46}
            transform={`rotate(${rot} ${C} ${C})`}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      ))}
      {[-1, 1].map((s, i) => (
        <g key={i} transform={`translate(${s * -squeeze} 0)`}>
          <DrawPath
            d={`M ${C + s * 250} ${C - 230} Q ${C + s * 165} ${C} ${C + s * 250} ${C + 230}`}
            delay={delay + 26 + i * 5}
            duration={30}
          />
          <Appear delay={delay + 52} duration={12}>
            <line x1={C + s * 330} y1={C} x2={C + s * 270} y2={C} strokeWidth={STROKE_THIN} />
            <path
              d={`M ${C + s * 290} ${C - 11} L ${C + s * 268} ${C} L ${C + s * 290} ${C + 11}`}
              strokeWidth={STROKE_THIN}
            />
          </Appear>
        </g>
      ))}
    </g>
  );
};

/** Letting it land: something arriving and settling. */
export const HeartSettle: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const beat = 1 + Math.max(0, Math.sin((frame / 45) * Math.PI * 2)) * 0.05;
  const travel = interpolate(frame - delay - 44, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g>
      <g style={{ transform: `scale(${beat})`, transformOrigin: `${C}px ${C}px`, transformBox: "view-box" }}>
        <DrawPath
          d={`M ${C} ${C + 150} C ${C - 210} ${C + 20} ${C - 185} ${C - 145} ${C - 86} ${C - 145} C ${C - 32} ${C - 145} ${C} ${C - 96} ${C} ${C - 56} C ${C} ${C - 96} ${C + 32} ${C - 145} ${C + 86} ${C - 145} C ${C + 185} ${C - 145} ${C + 210} ${C + 20} ${C} ${C + 150} Z`}
          delay={delay}
          duration={44}
        />
      </g>
      <Appear delay={delay + 44} duration={10} opacity={1 - travel}>
        <path
          d={`M ${C + 330} ${C - 40} q -60 60 -130 44`}
          strokeWidth={STROKE_THIN}
          strokeDasharray="8 14"
        />
      </Appear>
      <Dot cx={C + 330 - travel * 300} cy={C - 40 + travel * 60} r={9} delay={delay + 44} opacity={1 - travel * 0.2} />
    </g>
  );
};

/** Other people's lives, framed and watched from outside. */
export const ScreenPair: React.FC<IconProps> = ({ delay = 0 }) => {
  const w = 420;
  const h = 260;
  const x = C - w / 2;
  const y = C - h / 2 - 40;
  return (
    <g>
      <DrawPath
        d={`M ${x + 26} ${y} L ${x + w - 26} ${y} A 26 26 0 0 1 ${x + w} ${y + 26} L ${x + w} ${y + h - 26} A 26 26 0 0 1 ${x + w - 26} ${y + h} L ${x + 26} ${y + h} A 26 26 0 0 1 ${x} ${y + h - 26} L ${x} ${y + 26} A 26 26 0 0 1 ${x + 26} ${y}`}
        delay={delay}
        duration={36}
      />
      <Person x={C - 74} y={C - 40} size={2.1} delay={delay + 30} />
      <Person x={C + 74} y={C - 40} size={2.1} delay={delay + 40} />
      <Appear delay={delay + 50} duration={10} opacity={0.6}>
        <line x1={C - 22} y1={C - 46} x2={C + 22} y2={C - 46} strokeWidth={STROKE_THIN} />
      </Appear>
      <Dot cx={C - 78} cy={C + 168} r={13} delay={delay + 58} opacity={0.8} />
      <Dot cx={C - 122} cy={C + 216} r={8} delay={delay + 66} opacity={0.6} />
    </g>
  );
};
