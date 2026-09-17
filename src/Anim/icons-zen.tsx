import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Appear,
  circlePath,
  DashedRing,
  Dot,
  DrawPath,
  Frame,
  IconProps,
  Person,
} from "./primitives";
import { bowlPath, cloudPath, questionHook, roundedRect } from "./shapes";
import { CENTER, STROKE_THIN } from "./theme";

const C = CENTER;

/** The question put to someone who is already still. */
export const ZenAsked: React.FC<IconProps> = ({ delay = 0 }) => {
  const fx = C - 60;
  const qx = C + 250;
  const qy = C - 120;
  return (
    <Frame scale={0.8} dx={8} dy={45} breath={0.012}>
      <DrawPath d={circlePath(fx, C - 186, 38)} delay={delay} duration={22} />
      <DrawPath
        d={`M ${fx - 86} ${C + 24} C ${fx - 86} ${C - 116} ${fx - 52} ${C - 144} ${fx} ${C - 144} C ${fx + 52} ${C - 144} ${fx + 86} ${C - 116} ${fx + 86} ${C + 24}`}
        delay={delay + 12}
        duration={28}
      />
      <DrawPath
        d={`M ${fx - 146} ${C + 24} C ${fx - 146} ${C + 92} ${fx - 80} ${C + 112} ${fx} ${C + 112} C ${fx + 80} ${C + 112} ${fx + 146} ${C + 92} ${fx + 146} ${C + 24}`}
        delay={delay + 26}
        duration={30}
      />
      <DrawPath
        d={`M ${fx - 84} ${C - 48} C ${fx - 134} ${C - 16} ${fx - 148} ${C + 4} ${fx - 144} ${C + 26}`}
        delay={delay + 40}
        duration={16}
      />
      <DrawPath
        d={`M ${fx + 84} ${C - 48} C ${fx + 134} ${C - 16} ${fx + 148} ${C + 4} ${fx + 144} ${C + 26}`}
        delay={delay + 44}
        duration={16}
      />
      <DrawPath d={questionHook(qx, qy, 1.6)} delay={delay + 56} duration={24} />
      <Dot cx={qx} cy={qy + 82} r={10} delay={delay + 76} />
    </Frame>
  );
};

/** One thing at a time: the meal, then the walk. */
export const EatWalk: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const rise = Math.sin((frame / 70) * Math.PI * 2) * 6;
  const steps: [number, number, number][] = [
    [C - 148, C + 112, -16],
    [C - 16, C + 158, -16],
    [C + 116, C + 204, -16],
  ];
  return (
    <Frame scale={0.85} dx={14} dy={8}>
      <DrawPath d={bowlPath(C, C - 118, 214, 108)} delay={delay} duration={30} />
      <DrawPath d={`M ${C - 132} ${C - 118} L ${C + 132} ${C - 118}`} delay={delay + 22} duration={18} />
      {[-52, 0, 52].map((dx, i) => (
        <Appear key={i} delay={delay + 34 + i * 6} duration={14} opacity={0.75}>
          <path
            d={`M ${C + dx} ${C - 152 + rise} c -16 -22 16 -34 0 -56`}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      ))}
      {steps.map(([sx, sy, rot], i) => (
        <Appear key={i} delay={delay + 54 + i * 10} duration={14} scaleFrom={0.75} origin={[sx, sy]}>
          <g transform={`rotate(${rot} ${sx} ${sy})`}>
            <path
              d={
                `M ${sx} ${sy - 56} ` +
                `C ${sx + 30} ${sy - 56} ${sx + 34} ${sy - 16} ${sx + 28} ${sy + 14} ` +
                `C ${sx + 24} ${sy + 42} ${sx + 10} ${sy + 56} ${sx} ${sy + 56} ` +
                `C ${sx - 10} ${sy + 56} ${sx - 24} ${sy + 42} ${sx - 28} ${sy + 14} ` +
                `C ${sx - 34} ${sy - 16} ${sx - 30} ${sy - 56} ${sx} ${sy - 56} Z`
              }
              strokeWidth={STROKE_THIN}
            />
            <path d={`M ${sx - 22} ${sy - 18} q 22 -14 44 0`} strokeWidth={STROKE_THIN} opacity={0.7} />
          </g>
        </Appear>
      ))}
    </Frame>
  );
};

/** "Anyone can do that" — the crowd that assumes it already does. */
export const CrowdRow: React.FC<IconProps> = ({ delay = 0 }) => {
  const row = [-300, -150, 0, 150, 300];
  return (
    <Frame scale={0.8}>
      {row.map((dx, i) => (
        <Person key={i} x={C + dx} y={C - 40} size={2.6} delay={delay + i * 7} opacity={dx === 0 ? 1 : 0.6} />
      ))}
      <Appear delay={delay + 46} duration={16} opacity={0.5}>
        <line
          x1={C - 320}
          y1={C + 110}
          x2={C + 320}
          y2={C + 110}
          strokeWidth={STROKE_THIN}
          strokeDasharray="16 18"
        />
      </Appear>
    </Frame>
  );
};

/** Eating here, but working somewhere else. */
export const EatingElsewhere: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 120) * Math.PI * 2) * 7;
  const bx = C + 132;
  const by = C - 168;
  return (
    <Frame scale={0.86} dx={3} dy={30}>
      <DrawPath d={bowlPath(C - 130, C + 60, 190, 96)} delay={delay} duration={28} />
      <DrawPath d={`M ${C - 236} ${C + 60} L ${C - 24} ${C + 60}`} delay={delay + 20} duration={16} />
      <Dot cx={C - 44} cy={C - 6} r={7} delay={delay + 18} opacity={0.7} />
      <Dot cx={C - 6} cy={C - 54} r={10} delay={delay + 22} opacity={0.8} />
      <g transform={`translate(${drift} 0)`}>
        <DrawPath d={cloudPath(bx, by, 196, 116, 11)} delay={delay + 26} duration={32} />
        <Appear delay={delay + 48} duration={14}>
          <path d={roundedRect(bx - 66, by - 30, 132, 90, 12)} strokeWidth={STROKE_THIN} />
          <path d={`M ${bx - 26} ${by - 30} l 0 -22 l 52 0 l 0 22`} strokeWidth={STROKE_THIN} />
          <line x1={bx - 66} y1={by + 8} x2={bx + 66} y2={by + 8} strokeWidth={STROKE_THIN} />
        </Appear>
      </g>
    </Frame>
  );
};

/** Lying down with the list of everything left undone. */
export const BedUnfinished: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 110) * Math.PI * 2) * 6;
  const cx = C + 40;
  const cy = C - 158;
  return (
    <Frame scale={0.81} dx={3} dy={9}>
      <DrawPath d={`M ${C - 250} ${C + 96} L ${C - 250} ${C + 200}`} delay={delay} duration={18} />
      <DrawPath
        d={`M ${C - 250} ${C + 128} L ${C + 216} ${C + 128} A 26 26 0 0 1 ${C + 242} ${C + 154} L ${C + 242} ${C + 200}`}
        delay={delay + 12}
        duration={30}
      />
      <DrawPath d={`M ${C - 250} ${C + 170} L ${C + 242} ${C + 170}`} delay={delay + 34} duration={20} />
      <Appear delay={delay + 42} duration={14}>
        <path d={roundedRect(C - 232, C + 96, 120, 34, 16)} strokeWidth={STROKE_THIN} />
      </Appear>
      <Dot cx={C - 96} cy={C + 44} r={7} delay={delay + 22} opacity={0.7} />
      <Dot cx={C - 56} cy={C - 8} r={10} delay={delay + 26} opacity={0.8} />
      <g transform={`translate(${drift} 0)`}>
        <DrawPath d={cloudPath(cx, cy, 218, 128, 11)} delay={delay + 30} duration={34} />
        {[0, 1, 2].map((i) => {
          const ly = cy - 46 + i * 46;
          return (
            <Appear key={i} delay={delay + 54 + i * 7} duration={12}>
              <rect x={cx - 108} y={ly - 15} width={30} height={30} rx={7} strokeWidth={STROKE_THIN} />
              <line x1={cx - 58} y1={ly} x2={cx + 108} y2={ly} strokeWidth={STROKE_THIN} />
            </Appear>
          );
        })}
      </g>
    </Frame>
  );
};

/** And the science agreed. */
export const AtomProof: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const spin = (frame / 6) % 360;
  return (
    <Frame scale={1.06} dy={41}>
      <g style={{ transform: `rotate(${spin}deg)`, transformOrigin: `${C}px ${C - 60}px`, transformBox: "view-box" }}>
        {[0, 60, 120].map((rot, i) => (
          <Appear key={i} delay={delay + i * 10} duration={20}>
            <ellipse
              cx={C}
              cy={C - 60}
              rx={168}
              ry={64}
              transform={`rotate(${rot} ${C} ${C - 60})`}
              strokeWidth={STROKE_THIN}
            />
          </Appear>
        ))}
      </g>
      <Dot cx={C} cy={C - 60} r={12} delay={delay + 34} />
      <DrawPath
        d={`M ${C - 68} ${C + 150} L ${C - 20} ${C + 196} L ${C + 76} ${C + 100}`}
        delay={delay + 46}
        duration={22}
      />
    </Frame>
  );
};

/** Half the day spent somewhere other than here. */
export const HalfDay: React.FC<IconProps> = ({ delay = 0 }) => {
  const R = 168;
  const cx = C - 70;
  const cy = C - 20;
  return (
    <Frame scale={0.68} dx={-39} dy={26}>
      <DrawPath
        d={`M ${cx} ${cy - R} A ${R} ${R} 0 0 0 ${cx} ${cy + R}`}
        delay={delay}
        duration={30}
      />
      <DashedRing cx={cx} cy={cy} r={R} count={26} delay={delay + 24} duration={26} opacity={0.5} />
      <DrawPath d={`M ${cx} ${cy - R} L ${cx} ${cy + R}`} delay={delay + 30} duration={20} />
      <Dot cx={cx} cy={cy} r={9} delay={delay + 46} />
      <Appear delay={delay + 56} duration={16} opacity={0.6}>
        <path
          d={`M ${cx + 130} ${cy - 96} C ${cx + 210} ${cy - 150} ${cx + 250} ${cy - 168} ${cx + 288} ${cy - 172}`}
          strokeWidth={STROKE_THIN}
          strokeDasharray="10 14"
        />
      </Appear>
      <DrawPath d={cloudPath(cx + 366, cy - 170, 112, 68, 9)} delay={delay + 70} duration={28} />
    </Frame>
  );
};

/** And in those moments we feel worse. */
export const FeelWorse: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay - 40, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Cubic Bezier sampled so the dot rides the same curve that is drawn.
  const p0 = [C - 270, C - 96] as const;
  const p1 = [C - 110, C - 112] as const;
  const p2 = [C - 10, C + 60] as const;
  const p3 = [C + 250, C + 120] as const;
  const bez = (i: 0 | 1) => {
    const u = 1 - t;
    return (
      u * u * u * p0[i] +
      3 * u * u * t * p1[i] +
      3 * u * t * t * p2[i] +
      t * t * t * p3[i]
    );
  };
  return (
    <Frame scale={0.76} dy={-33}>
      <DrawPath d={`M ${C - 300} ${C + 186} L ${C + 300} ${C + 186}`} delay={delay} duration={22} />
      <DrawPath
        d={`M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`}
        delay={delay + 16}
        duration={44}
      />
      <Dot cx={bez(0)} cy={bez(1)} r={11} delay={delay + 40} />
      <Appear delay={delay + 74} duration={14} dy={-18}>
        <line x1={C + 250} y1={C + 152} x2={C + 250} y2={C + 166} strokeWidth={STROKE_THIN} />
        <path d={`M ${C + 238} ${C + 154} L ${C + 250} ${C + 170} L ${C + 262} ${C + 154}`} strokeWidth={STROKE_THIN} />
      </Appear>
    </Frame>
  );
};

/** So where is it? */
export const WhereIsPeace: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.69} breath={0.02}>
    <DrawPath d={questionHook(C, C - 30, 2.5)} delay={delay} duration={34} />
    <Dot cx={C} cy={C + 100} r={15} delay={delay + 34} />
    <DashedRing cx={C} cy={C} r={288} count={48} delay={delay + 26} duration={34} opacity={0.45} />
  </Frame>
);

/** Not somewhere else. */
export const NotElsewhere: React.FC<IconProps> = ({ delay = 0 }) => {
  const spots: [number, number][] = [
    [C - 250, C - 150],
    [C + 250, C - 150],
    [C, C + 205],
  ];
  return (
    <Frame scale={0.65} dy={-18}>
      <Dot cx={C} cy={C - 20} r={10} delay={delay} opacity={0.8} />
      {spots.map(([sx, sy], i) => {
        const ang = Math.atan2(sy - (C - 20), sx - C);
        const x0 = C + Math.cos(ang) * 46;
        const y0 = C - 20 + Math.sin(ang) * 46;
        const x1 = sx - Math.cos(ang) * 78;
        const y1 = sy - Math.sin(ang) * 78;
        return (
          <g key={i}>
            <Appear delay={delay + 4 + i * 4} duration={10} opacity={0.55}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} strokeWidth={STROKE_THIN} strokeDasharray="10 14" />
            </Appear>
            <DrawPath d={circlePath(sx, sy, 58)} delay={delay + 10 + i * 4} duration={16} />
            <DrawPath
              d={`M ${sx - 38} ${sy - 38} L ${sx + 38} ${sy + 38}`}
              delay={delay + 28 + i * 5}
              duration={14}
            />
            <DrawPath
              d={`M ${sx + 38} ${sy - 38} L ${sx - 38} ${sy + 38}`}
              delay={delay + 33 + i * 5}
              duration={14}
            />
          </g>
        );
      })}
    </Frame>
  );
};

/** The Harvard study: a paper with data, under an academic cap. */
export const StudyPaper: React.FC<IconProps> = ({ delay = 0 }) => {
  const bars: [number, number][] = [
    [452, 634],
    [512, 584],
    [572, 544],
  ];
  return (
    <Frame scale={0.9} dx={8} dy={19} breath={0.01}>
      <DrawPath d={roundedRect(410, 404, 260, 336, 16)} delay={delay} duration={34} occlude />
      <DrawPath
        d="M 540 298 L 646 332 L 540 366 L 434 332 Z"
        delay={delay + 26}
        duration={24}
        occlude
      />
      <DrawPath
        d="M 494 350 L 494 384 C 494 400 586 400 586 384 L 586 350"
        delay={delay + 44}
        duration={18}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath d="M 646 332 L 652 392" delay={delay + 54} duration={10} strokeWidth={STROKE_THIN} />
      <Dot cx={652} cy={400} r={7} delay={delay + 62} />
      <DrawPath
        d="M 440 452 L 640 452"
        delay={delay + 52}
        duration={14}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath
        d="M 440 486 L 590 486"
        delay={delay + 58}
        duration={12}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath
        d="M 440 694 L 640 694"
        delay={delay + 66}
        duration={16}
        strokeWidth={STROKE_THIN}
      />
      {bars.map(([bx, top], i) => (
        <Appear key={i} delay={delay + 76 + i * 7} duration={14} dy={22}>
          <rect
            x={bx}
            y={top}
            width={36}
            height={694 - top}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      ))}
    </Frame>
  );
};

/** Steam curls rising off a rim at `y`, the sign that the meal is happening now. */
const Steam: React.FC<{
  readonly y: number;
  readonly delay: number;
  readonly spread?: number;
}> = ({ y, delay, spread = 52 }) => {
  const frame = useCurrentFrame();
  const rise = Math.sin((frame / 70) * Math.PI * 2) * 6;
  return (
    <>
      {[-spread, 0, spread].map((dx, i) => (
        <Appear key={i} delay={delay + i * 6} duration={14} opacity={0.75}>
          <path
            d={`M ${540 + dx} ${y + rise} c -16 -22 16 -34 0 -56`}
            strokeWidth={STROKE_THIN}
          />
        </Appear>
      ))}
    </>
  );
};

/** "Cuando como, como" — the meal, and nothing else in the frame. */
export const BowlNow: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1} dy={5} breath={0.012}>
    <DrawPath d={bowlPath(540, 505, 400, 200)} delay={delay} duration={34} />
    <DrawPath d="M 340 505 L 740 505" delay={delay + 26} duration={20} />
    <Steam y={471} delay={delay + 40} spread={80} />
  </Frame>
);

/** "Cuando camino, camino" — one print at a time, going somewhere. */
export const WalkNow: React.FC<IconProps> = ({ delay = 0 }) => {
  const steps: [number, number][] = [
    [360, 720],
    [470, 650],
    [580, 580],
    [690, 510],
  ];
  const print = (sx: number, sy: number) =>
    `M ${sx} ${sy - 56} ` +
    `C ${sx + 30} ${sy - 56} ${sx + 34} ${sy - 16} ${sx + 28} ${sy + 14} ` +
    `C ${sx + 24} ${sy + 42} ${sx + 10} ${sy + 56} ${sx} ${sy + 56} ` +
    `C ${sx - 10} ${sy + 56} ${sx - 24} ${sy + 42} ${sx - 28} ${sy + 14} ` +
    `C ${sx - 34} ${sy - 16} ${sx - 30} ${sy - 56} ${sx} ${sy - 56} Z`;
  return (
    <Frame scale={1} dx={15} dy={-75}>
      <Appear delay={delay} duration={18} opacity={0.35}>
        <line
          x1={330}
          y1={748}
          x2={720}
          y2={482}
          strokeWidth={STROKE_THIN}
          strokeDasharray="12 16"
        />
      </Appear>
      {steps.map(([sx, sy], i) => (
        <Appear
          key={i}
          delay={delay + 12 + i * 11}
          duration={14}
          scaleFrom={0.75}
          origin={[sx, sy]}
        >
          <g transform={`rotate(-16 ${sx} ${sy})`}>
            <path d={print(sx, sy)} strokeWidth={STROKE_THIN} />
            <path
              d={`M ${sx - 22} ${sy - 18} q 22 -14 44 0`}
              strokeWidth={STROKE_THIN}
              opacity={0.7}
            />
          </g>
        </Appear>
      ))}
    </Frame>
  );
};

/** "Y dijo que no" — the correction, before the reason for it. */
export const SaidNo: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1} breath={0.012}>
    <DrawPath
      d="M 380 380 L 700 380 A 40 40 0 0 1 740 420 L 740 600 A 40 40 0 0 1 700 640 L 520 640 L 468 700 L 468 640 L 380 640 A 40 40 0 0 1 340 600 L 340 420 A 40 40 0 0 1 380 380 Z"
      delay={delay}
      duration={44}
      occlude
    />
    <DrawPath d="M 470 450 L 610 570" delay={delay + 40} duration={20} />
    <DrawPath d="M 610 450 L 470 570" delay={delay + 52} duration={20} />
  </Frame>
);

/** "Todo lo que no hiciste" — the list that never gets a tick. */
export const UndoneList: React.FC<IconProps> = ({ delay = 0 }) => {
  const rows = [0, 1, 2, 3];
  return (
    <Frame scale={1.05} dy={-21}>
      {rows.map((i) => {
        const y = 400 + i * 80;
        const fade = 1 - i * 0.18;
        return (
          <g key={i}>
            <DrawPath
              d={`M 350 ${y - 27} L 405 ${y - 27} L 405 ${y + 28} L 350 ${y + 28} Z`}
              delay={delay + i * 13}
              duration={20}
              strokeWidth={STROKE_THIN}
              opacity={fade}
            />
            <DrawPath
              d={`M 435 ${y} L ${i === 3 ? 640 : 730} ${y}`}
              delay={delay + 10 + i * 13}
              duration={18}
              strokeWidth={STROKE_THIN}
              opacity={fade}
            />
          </g>
        );
      })}
      <Appear delay={delay + 62} duration={14} opacity={0.22}>
        <line x1={350} y1={712} x2={405} y2={712} strokeWidth={STROKE_THIN} />
        <line x1={435} y1={712} x2={620} y2={712} strokeWidth={STROKE_THIN} />
      </Appear>
    </Frame>
  );
};

/**
 * What is actually in front of you — the same bowl as the opening, but now
 * with attention landing on it instead of somewhere else.
 */
export const RightHere: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1} dy={-10} breath={0.014}>
    <DrawPath d={bowlPath(540, 505, 260, 130)} delay={delay} duration={30} />
    <DrawPath d="M 410 505 L 670 505" delay={delay + 22} duration={16} />
    <DrawPath
      d="M 390 690 L 690 690"
      delay={delay + 36}
      duration={22}
      strokeWidth={STROKE_THIN}
    />
    <Steam y={471} delay={delay + 44} />
    <DashedRing
      cx={540}
      cy={550}
      r={200}
      count={44}
      delay={delay + 56}
      duration={32}
      opacity={0.4}
    />
  </Frame>
);
