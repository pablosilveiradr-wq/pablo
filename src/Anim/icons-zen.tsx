import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Appear,
  circlePath,
  DashedRing,
  Dot,
  DrawPath,
  IconProps,
  Person,
  useBreath,
} from "./primitives";
import { bowlPath, cloudPath, questionHook, roundedRect } from "./shapes";
import { CENTER, STROKE_THIN } from "./theme";

const C = CENTER;

/** The question put to someone who is already still. */
export const ZenAsked: React.FC<IconProps> = ({ delay = 0 }) => {
  const b = useBreath(0.012, 130);
  const fx = C - 60;
  const qx = C + 250;
  const qy = C - 120;
  return (
    <g style={{ transform: `scale(${b})`, transformOrigin: `${C}px ${C}px`, transformBox: "view-box" }}>
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
    </g>
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
    <g>
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
    </g>
  );
};

/** "Anyone can do that" — the crowd that assumes it already does. */
export const CrowdRow: React.FC<IconProps> = ({ delay = 0 }) => {
  const row = [-300, -150, 0, 150, 300];
  return (
    <g>
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
    </g>
  );
};

/** Eating here, but working somewhere else. */
export const EatingElsewhere: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 120) * Math.PI * 2) * 7;
  const bx = C + 132;
  const by = C - 168;
  return (
    <g>
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
    </g>
  );
};

/** Lying down with the list of everything left undone. */
export const BedUnfinished: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 110) * Math.PI * 2) * 6;
  const cx = C + 40;
  const cy = C - 158;
  return (
    <g>
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
    </g>
  );
};

/** And the science agreed. */
export const AtomProof: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const spin = (frame / 6) % 360;
  return (
    <g>
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
    </g>
  );
};

/** Half the day spent somewhere other than here. */
export const HalfDay: React.FC<IconProps> = ({ delay = 0 }) => {
  const R = 168;
  const cx = C - 70;
  const cy = C - 20;
  return (
    <g>
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
    </g>
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
    <g>
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
    </g>
  );
};

/** So where is it? */
export const WhereIsPeace: React.FC<IconProps> = ({ delay = 0 }) => {
  const b = useBreath(0.02, 90);
  return (
    <g style={{ transform: `scale(${b})`, transformOrigin: `${C}px ${C}px`, transformBox: "view-box" }}>
      <DrawPath d={questionHook(C, C - 30, 2.5)} delay={delay} duration={34} />
      <Dot cx={C} cy={C + 100} r={15} delay={delay + 34} />
      <DashedRing cx={C} cy={C} r={288} count={48} delay={delay + 26} duration={34} opacity={0.45} />
    </g>
  );
};

/** Not somewhere else. */
export const NotElsewhere: React.FC<IconProps> = ({ delay = 0 }) => {
  const spots: [number, number][] = [
    [C - 250, C - 150],
    [C + 250, C - 150],
    [C, C + 205],
  ];
  return (
    <g>
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
    </g>
  );
};
