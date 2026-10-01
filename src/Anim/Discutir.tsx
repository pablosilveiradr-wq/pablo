import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, circlePath, Dot, DrawPath, DrawSpeed } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Chunk } from "./Visita";

/**
 * "Discutir": how peaceful life gets when you stop needing to win arguments.
 * Six line-art scenes: lying in the sun; a calm face while angry faces around
 * it fade; meditating while the question marks bounce off; one cylinder that
 * one person sees as a circle and another as a square; two bubbles clashing;
 * back to the sun. Each scene paces itself to its own length, so a voice-over
 * can set the timing through props.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Progress through the current scene, 0..1, plus the local frame. */
const useScene = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return { f, p: f / durationInFrames, dur: durationInFrames };
};

const Glow: React.FC<{ cx: number; cy: number; r: number; o: number; id: string }> = ({ cx, cy, r, o, id }) =>
  o > 0 ? (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={INK} stopOpacity={0.45} />
          <stop offset="40%" stopColor={INK} stopOpacity={0.14} />
          <stop offset="100%" stopColor={INK} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke="none" opacity={o} />
    </>
  ) : null;

/** Outline of a rounded capsule from (x1,y1) to (x2,y2), `w` thick. */
const capsule = (x1: number, y1: number, x2: number, y2: number, w: number) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const r = w / 2;
  const nx = -Math.sin(a) * r;
  const ny = Math.cos(a) * r;
  const f = (n: number) => n.toFixed(1);
  return `M ${f(x1 + nx)} ${f(y1 + ny)} L ${f(x2 + nx)} ${f(y2 + ny)} A ${r} ${r} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)} L ${f(x1 - nx)} ${f(y1 - ny)} A ${r} ${r} 0 0 0 ${f(x1 + nx)} ${f(y1 + ny)} Z`;
};

/* ---------------------------------------------------------------- scenes */

/** 1 & 6 · Lying on the grass, hands behind the head, sun and clouds drifting. */
const Descanso: React.FC<{ bright?: boolean }> = ({ bright = false }) => {
  const { f } = useScene();
  const breathe = 1 + Math.sin(f / 22) * 0.02;
  const cloud = (x: number, y: number, k: number) =>
    `M ${x} ${y} H ${x + 120 * k} A ${22 * k} ${22 * k} 0 0 0 ${x + 112 * k} ${y - 40 * k} A ${34 * k} ${34 * k} 0 0 0 ${x + 50 * k} ${y - 52 * k} A ${26 * k} ${26 * k} 0 0 0 ${x + 8 * k} ${y - 26 * k} A ${18 * k} ${18 * k} 0 0 0 ${x} ${y} Z`;
  const drift = f * 0.35;
  const spin = f * 0.4;
  return (
    <g transform="translate(0 -10)">
      <Glow cx={760} cy={240} r={170} o={interpolate(f, [10, 26], [0, bright ? 1 : 0.7], clamp)} id={bright ? "sun2" : "sun1"} />
      <DrawPath d={circlePath(760, 240, 48)} duration={16} />
      <g style={{ transform: `rotate(${spin}deg)`, transformOrigin: "760px 240px", transformBox: "view-box" }}>
        {new Array(8).fill(0).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <DrawPath
              key={i}
              d={`M ${760 + Math.cos(a) * 66} ${240 + Math.sin(a) * 66} L ${760 + Math.cos(a) * 86} ${240 + Math.sin(a) * 86}`}
              delay={12 + i}
              duration={6}
              strokeWidth={STROKE_THIN}
            />
          );
        })}
      </g>
      <g transform={`translate(${drift} 0)`}>
        <DrawPath d={cloud(240, 250, 1)} delay={6} duration={18} strokeWidth={STROKE_THIN} />
        <DrawPath d={cloud(470, 190, 0.7)} delay={10} duration={16} strokeWidth={STROKE_THIN} opacity={0.7} />
      </g>
      {/* grass */}
      <DrawPath d="M 160 620 H 920" duration={18} />
      {[220, 300, 470, 650, 800, 880].map((x, i) => (
        <DrawPath key={x} d={`M ${x} 620 l 6 -14 M ${x + 10} 620 l 2 -18 M ${x + 20} 620 l -4 -12`} delay={14 + i * 2} duration={6} strokeWidth={STROKE_THIN * 0.9} />
      ))}
      {/* the person, in capsules like the library's bodies: arm folded behind the head, one knee up */}
      <g style={{ transform: `scale(1, ${breathe})`, transformOrigin: "540px 620px", transformBox: "view-box" }}>
        <DrawPath d={capsule(392, 548, 352, 488, 30)} delay={18} duration={12} strokeWidth={STROKE_THIN * 1.2} occlude />
        <DrawPath d={capsule(352, 488, 296, 528, 28)} delay={20} duration={12} strokeWidth={STROKE_THIN * 1.2} occlude />
        <DrawPath d={circlePath(330, 562, 36)} delay={10} duration={14} occlude />
        <DrawPath d={capsule(396, 582, 600, 588, 56)} delay={14} duration={16} occlude />
        <DrawPath d={capsule(604, 598, 792, 604, 34)} delay={26} duration={12} occlude />
        <DrawPath d={capsule(604, 582, 690, 494, 40)} delay={22} duration={12} occlude />
        <DrawPath d={capsule(690, 494, 770, 590, 36)} delay={24} duration={12} occlude />
      </g>
    </g>
  );
};

/** 2 · A calm face; the angry faces around it, mid-argument, fade away. */
const Caras: React.FC = () => {
  const { f, dur } = useScene();
  const half = dur * 0.5;
  const ring = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2 + Math.PI / 6;
    return { x: 540 + Math.cos(a) * 285, y: 430 + Math.sin(a) * 215, a };
  });
  const calm = interpolate(f, [half, half + 20], [0, 1], clamp);
  return (
    <>
      <Glow cx={540} cy={430} r={240} o={calm} id="calmGlow" />
      {/* the calm face */}
      <DrawPath d={circlePath(540, 430, 92)} duration={16} />
      <DrawPath d="M 498 412 Q 512 400 526 412 M 554 412 Q 568 400 582 412" delay={12} duration={8} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 510 458 Q 540 480 570 458" delay={14} duration={8} strokeWidth={STROKE_THIN} />
      {ring.map(({ x, y }, i) => {
        const shake = f < half ? Math.sin(f / 2 + i) * 3 : 0;
        const k = interpolate(f, [half + i * 3, half + i * 3 + 18], [1, 0], clamp);
        const out = 1 + (1 - k) * 0.25;
        if (k <= 0) {
          return null;
        }
        const bx = x + (x < 540 ? -46 : 46);
        return (
          <g
            key={i}
            opacity={k}
            style={{ transform: `translate(${shake}px, 0) scale(${out})`, transformOrigin: "540px 430px", transformBox: "view-box" }}
          >
            <DrawPath d={circlePath(x, y, 48)} delay={8 + i * 3} duration={12} strokeWidth={STROKE_THIN * 1.2} />
            <DrawPath d={`M ${x - 26} ${y - 16} L ${x - 8} ${y - 8} M ${x + 26} ${y - 16} L ${x + 8} ${y - 8}`} delay={16 + i * 3} duration={6} strokeWidth={STROKE_THIN} />
            <DrawPath d={`M ${x - 16} ${y + 22} Q ${x} ${y + 10} ${x + 16} ${y + 22}`} delay={18 + i * 3} duration={6} strokeWidth={STROKE_THIN} />
            {/* an angry speech bubble */}
            <DrawPath
              d={`M ${bx - 30} ${y - 74} h 60 a 10 10 0 0 1 10 10 v 22 a 10 10 0 0 1 -10 10 h -22 l -10 12 l -2 -12 h -26 a 10 10 0 0 1 -10 -10 v -22 a 10 10 0 0 1 10 -10 Z`}
              delay={22 + i * 3}
              duration={10}
              strokeWidth={STROKE_THIN}
            />
            <DrawPath d={`M ${bx - 18} ${y - 52} l 8 -10 l 8 10 l 8 -10 l 8 10 l 8 -10`} delay={28 + i * 3} duration={6} strokeWidth={STROKE_THIN} />
          </g>
        );
      })}
    </>
  );
};

/** 3 · Meditating: question marks drift in and dissolve against the calm. */
const Meditar: React.FC = () => {
  const { f, dur } = useScene();
  const aura = interpolate(f, [12, 30], [0, 1], clamp);
  const qs = [
    { x0: 170, y0: 230 },
    { x0: 910, y0: 270 },
    { x0: 200, y0: 560 },
    { x0: 890, y0: 590 },
    { x0: 540, y0: 140 },
  ];
  return (
    <>
      <Glow cx={540} cy={450} r={250} o={aura * 0.9} id="medGlow" />
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 20) % 60) / 60;
        return aura > 0 ? <circle key={i} cx={540} cy={470} r={150 + 70 * t} strokeWidth={STROKE_THIN} opacity={aura * 0.5 * (1 - t)} /> : null;
      })}
      {/* the figure, as in the library's Meditar */}
      <DrawPath d={circlePath(540, 330, 40)} duration={14} />
      <DrawPath d="M 470 520 L 492 446 A 48 48 0 0 1 588 446 L 610 520" delay={8} duration={16} />
      <DrawPath d="M 400 540 Q 540 600 680 540 Q 540 500 400 540 Z" delay={14} duration={16} />
      {/* the misunderstandings drift in and fade before they reach */}
      {qs.map((q, i) => {
        const t0 = 18 + i * 10;
        const k = interpolate(f, [t0, t0 + dur * 0.55], [0, 1], clamp);
        const x = q.x0 + (540 - q.x0) * k * 0.55;
        const y = q.y0 + (450 - q.y0) * k * 0.55;
        const o = interpolate(k, [0, 0.12, 0.7, 1], [0, 1, 1, 0], clamp);
        return o > 0 ? (
          <g key={i} opacity={o}>
            <path d={`M ${x - 34} ${y - 30} h 68 a 12 12 0 0 1 12 12 v 34 a 12 12 0 0 1 -12 12 h -24 l -10 14 l -4 -14 h -30 a 12 12 0 0 1 -12 -12 v -34 a 12 12 0 0 1 12 -12 Z`} strokeWidth={STROKE_THIN} />
            <text x={x} y={y + 1} fill={INK} stroke="none" fontFamily="Montserrat, sans-serif" fontWeight={500} fontSize={34} textAnchor="middle" dominantBaseline="central">
              ?
            </text>
          </g>
        ) : null;
      })}
    </>
  );
};

/** 4 · One cylinder: seen from above it is a circle, from the side a square. */
const Percepcion: React.FC = () => {
  const { f, dur } = useScene();
  const a = dur * 0.22;
  const b = dur * 0.45;
  const reveal = interpolate(f, [dur * 0.7, dur * 0.7 + 14], [0, 1], clamp);
  const eye = (x: number, y: number, rot: number, delay: number) => (
    <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}>
      <DrawPath d={`M ${x - 40} ${y} Q ${x} ${y - 30} ${x + 40} ${y} Q ${x} ${y + 30} ${x - 40} ${y} Z`} delay={delay} duration={10} strokeWidth={STROKE_THIN * 1.2} />
      <Dot cx={x} cy={y} r={9} delay={delay + 8} />
    </g>
  );
  return (
    <g transform="translate(0 10)">
      <Glow cx={540} cy={470} r={220} o={reveal} id="cylGlow" />
      {/* the cylinder */}
      <DrawPath d="M 460 400 A 80 24 0 0 1 620 400 A 80 24 0 0 1 460 400 Z" duration={14} />
      <DrawPath d="M 460 400 V 560 A 80 24 0 0 0 620 560 V 400" delay={6} duration={16} />
      {/* someone looking from above sees a circle */}
      {eye(540, 200, 90, a)}
      <g strokeDasharray="6 10">
        {f > a + 6 ? <path d="M 528 232 L 470 392 M 552 232 L 610 392" strokeWidth={STROKE_THIN * 0.8} opacity={interpolate(f, [a + 6, a + 14], [0, 0.8], clamp)} /> : null}
      </g>
      <DrawPath d="M 270 150 h 140 a 14 14 0 0 1 14 14 v 100 a 14 14 0 0 1 -14 14 h -140 a 14 14 0 0 1 -14 -14 v -100 a 14 14 0 0 1 14 -14 Z" delay={a + 10} duration={12} strokeWidth={STROKE_THIN} />
      <DrawPath d={circlePath(340, 214, 36)} delay={a + 18} duration={10} />
      {/* someone looking from the side sees a square */}
      {eye(880, 480, 0, b)}
      {f > b + 6 ? <path d="M 840 470 L 626 410 M 840 490 L 626 556" strokeWidth={STROKE_THIN * 0.8} strokeDasharray="6 10" opacity={interpolate(f, [b + 6, b + 14], [0, 0.8], clamp)} /> : null}
      <DrawPath d="M 810 590 h 140 a 14 14 0 0 1 14 14 v 100 a 14 14 0 0 1 -14 14 h -140 a 14 14 0 0 1 -14 -14 v -100 a 14 14 0 0 1 14 -14 Z" delay={b + 10} duration={12} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 846 620 h 68 v 68 h -68 Z" delay={b + 18} duration={10} />
    </g>
  );
};

/** 5 · Two bubbles clashing, sparks between them. */
const Choque: React.FC = () => {
  const { f, dur } = useScene();
  const shake = (i: number) => Math.sin(f / 1.6 + i) * 4;
  const fade = interpolate(f, [dur - 10, dur], [1, 0.6], clamp);
  return (
    <g opacity={fade}>
      <g transform={`translate(${shake(0)} 0)`}>
        <DrawPath d="M 230 330 h 220 a 26 26 0 0 1 26 26 v 110 a 26 26 0 0 1 -26 26 h -120 l -40 46 l -6 -46 h -54 a 26 26 0 0 1 -26 -26 v -110 a 26 26 0 0 1 26 -26 Z" duration={14} />
        <DrawPath d="M 270 410 l 30 -30 l 30 30 l 30 -30 l 30 30 l 30 -30" delay={10} duration={8} strokeWidth={STROKE_THIN} />
      </g>
      <g transform={`translate(${shake(2)} 0)`}>
        <DrawPath d="M 630 330 h 220 a 26 26 0 0 1 26 26 v 110 a 26 26 0 0 1 -26 26 h -54 l -6 46 l -40 -46 h -120 a 26 26 0 0 1 -26 -26 v -110 a 26 26 0 0 1 26 -26 Z" delay={4} duration={14} />
        <DrawPath d="M 670 410 l 30 -30 l 30 30 l 30 -30 l 30 30 l 30 -30" delay={14} duration={8} strokeWidth={STROKE_THIN} />
      </g>
      {/* the spark between them */}
      <DrawPath d="M 540 300 L 520 380 L 560 400 L 530 480" delay={16} duration={8} strokeWidth={STROKE} />
    </g>
  );
};

/* ------------------------------------------------------------- composition */

export type DiscutirScene = { start: number; end: number };
export type DiscutirChunk = { text: string; start: number; end: number };
export type DiscutirProps = { scenes?: DiscutirScene[]; chunks?: DiscutirChunk[]; seconds?: number };

export const DISCUTIR_LINES: { start: number; end: number; chunks: string[] }[] = [
  { start: 0.4, end: 3.0, chunks: ["Es increíble", "lo tranquila", "que se vuelve la vida"] },
  { start: 3.2, end: 6.4, chunks: ["cuando decidís", "que ya no tenés", "energía", "para discutir"] },
  { start: 6.6, end: 8.9, chunks: ["y estás en paz", "con que", "*no te entiendan."] },
  { start: 9.3, end: 13.0, chunks: ["Porque cada uno", "entiende", "desde su propio", "nivel de percepción,"] },
  { start: 13.2, end: 14.4, chunks: ["y ninguna", "discusión"] },
  { start: 14.5, end: 16.6, chunks: ["vale más que", "*tu salud mental."] },
];

export const DISCUTIR_SECONDS = 18.5;
export const DISCUTIR_FRAMES = Math.round(DISCUTIR_SECONDS * FPS);

const DEFAULT_SCENES: DiscutirScene[] = [
  { start: 0, end: 3.1 },
  { start: 3.1, end: 6.5 },
  { start: 6.5, end: 9.15 },
  { start: 9.15, end: 13.1 },
  { start: 13.1, end: 14.45 },
  { start: 14.45, end: DISCUTIR_SECONDS },
];

const ART: React.FC[] = [() => <Descanso />, Caras, Meditar, Percepcion, Choque, () => <Descanso bright />];

const defaultChunks = (): DiscutirChunk[] =>
  DISCUTIR_LINES.flatMap((line) => {
    const w = line.chunks.map((c) => c.replace("*", "").length + 4);
    const total = w.reduce((a, b) => a + b, 0);
    let t = line.start;
    return line.chunks.map((text, i) => {
      const start = t;
      t += ((line.end - line.start) * w[i]) / total;
      return { text, start, end: i === line.chunks.length - 1 ? line.end + 0.2 : t };
    });
  });

const Shot: React.FC<{ C: React.FC; last: boolean }> = ({ C, last }) => {
  const { f, dur } = useScene();
  const out = last ? 18 : 6;
  const o = interpolate(f, [0, 6], [0, 1], clamp) * interpolate(f, [dur - out, dur], [1, 0], clamp);
  const push = interpolate(f, [0, dur], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${push})` }}>
      <Canvas scale={0.88}>
        <DrawSpeed value={1}>
          <C />
        </DrawSpeed>
      </Canvas>
    </AbsoluteFill>
  );
};

export const Discutir: React.FC<DiscutirProps> = ({ scenes = DEFAULT_SCENES, chunks }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={Math.round(s.start * fps)} durationInFrames={Math.round((s.end - s.start) * fps)}>
          <Shot C={ART[i]} last={i === scenes.length - 1} />
        </Sequence>
      ))}
      {(chunks ?? defaultChunks()).map((c, i) => (
        <Sequence key={`c${i}`} from={Math.round(c.start * fps)} durationInFrames={Math.max(1, Math.round((c.end - c.start) * fps))}>
          <Chunk text={c.text} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
