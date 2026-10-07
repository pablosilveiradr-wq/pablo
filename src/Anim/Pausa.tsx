import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useVideoConfig } from "remotion";
import { circlePath, DrawPath } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Glow, poly, Shot, TextLine, useScene } from "./Invisible";

/**
 * "Pausa": between what happens to you and what you do there is a space, and
 * almost everything is decided there. An original script, built with the same
 * line language as "Invisible": one image per line, word-by-word text, quick
 * cuts. Timing comes from props so the voice-over can drive it.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const CY = 420;

/** The two points every scene comes back to: what happens (left) and what you do (right). */
const Pair: React.FC<{ gap: number; o?: number }> = ({ gap, o = 1 }) => (
  <g opacity={o}>
    <circle cx={CX - gap / 2} cy={CY} r={9} fill={INK} stroke="none" />
    <circle cx={CX + gap / 2} cy={CY} r={9} fill={INK} stroke="none" />
  </g>
);

/* ------------------------------------------------------------------ scenes */

/** There is a space: the line between the two points opens in the middle. */
const Espacio: React.FC = () => {
  const { f, dur } = useScene();
  const open = interpolate(f, [dur * 0.45, dur * 0.75], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const g = 70 + 120 * open;
  const L = 300;
  return (
    <>
      <Pair gap={2 * L} />
      <DrawPath d={`M ${CX - L} ${CY} L ${CX - g / 2} ${CY}`} duration={14} strokeWidth={STROKE_THIN * 1.2} />
      <DrawPath d={`M ${CX + L} ${CY} L ${CX + g / 2} ${CY}`} duration={14} strokeWidth={STROKE_THIN * 1.2} />
      {open > 0 ? (
        <g opacity={open}>
          <path d={`M ${CX - g / 2 + 14} ${CY - 34} H ${CX - g / 2} V ${CY + 34} H ${CX - g / 2 + 14}`} strokeWidth={STROKE_THIN} />
          <path d={`M ${CX + g / 2 - 14} ${CY - 34} H ${CX + g / 2} V ${CY + 34} H ${CX + g / 2 - 14}`} strokeWidth={STROKE_THIN} />
        </g>
      ) : null}
    </>
  );
};

/** You hardly ever see it: from far away the two points almost touch. */
const Casi: React.FC = () => {
  const { f } = useScene();
  const shrink = interpolate(f, [0, 20], [1, 0], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const g = 16 + 360 * shrink;
  return (
    <>
      <Pair gap={g} />
      <path d={`M ${CX - g / 2 - 200} ${CY} L ${CX - g / 2 - 14} ${CY} M ${CX + g / 2 + 14} ${CY} L ${CX + g / 2 + 200} ${CY}`} strokeWidth={STROKE_THIN * 1.2} opacity={0.6} />
    </>
  );
};

/** Less than a second: a dial with only a sliver lit. */
const Segundo: React.FC = () => {
  const { f } = useScene();
  const R = 170;
  const a1 = -Math.PI / 2 + interpolate(f, [8, 30], [0, 0.32], clamp);
  return (
    <>
      <DrawPath d={circlePath(CX, CY, R)} duration={16} strokeWidth={STROKE_THIN} opacity={0.5} />
      {f > 8 ? (
        <path d={`M ${CX} ${CY - R} A ${R} ${R} 0 0 1 ${CX + Math.cos(a1) * R} ${CY + Math.sin(a1) * R}`} strokeWidth={STROKE * 1.3} />
      ) : null}
      <circle cx={CX} cy={CY} r={6} fill={INK} stroke="none" />
      {f > 8 ? <path d={`M ${CX} ${CY} L ${CX + Math.cos(a1) * (R - 24)} ${CY + Math.sin(a1) * (R - 24)}`} strokeWidth={STROKE_THIN} /> : null}
    </>
  );
};

/** In the gap: a breath. */
const Respiracion: React.FC = () => {
  const { f, fps } = useScene();
  const breath = 0.55 + 0.45 * Math.sin(-Math.PI / 2 + (f / (fps * 2.4)) * Math.PI * 2) * 0.5 + 0.225;
  return (
    <>
      <Pair gap={600} o={0.7} />
      <Glow cx={CX} cy={CY} r={200 * breath} o={0.8} id="brGlow" />
      <path d={circlePath(CX, CY, 140 * breath)} strokeWidth={STROKE_THIN * 1.3} />
      <path d={circlePath(CX, CY, 90 * breath)} strokeWidth={STROKE_THIN * 0.8} opacity={0.5} />
    </>
  );
};

/** In the gap: a question. */
const Pregunta: React.FC = () => (
  <>
    <Pair gap={600} o={0.7} />
    <DrawPath d={circlePath(CX, CY, 130)} duration={16} strokeWidth={STROKE_THIN} opacity={0.6} />
    <DrawPath d={`M ${CX - 46} ${CY - 50} C ${CX - 46} ${CY - 110} ${CX + 52} ${CY - 112} ${CX + 50} ${CY - 46} C ${CX + 48} ${CY - 8} ${CX} ${CY - 4} ${CX} ${CY + 34}`} delay={8} duration={16} strokeWidth={STROKE * 1.3} />
    <circle cx={CX} cy={CY + 76} r={9} fill={INK} stroke="none" />
  </>
);

/** In the gap: the you that chooses. A path forks and one branch lights up. */
const Elige: React.FC = () => {
  const { f, dur } = useScene();
  const pick = interpolate(f, [dur * 0.45, dur * 0.65], [0, 1], clamp);
  return (
    <>
      <DrawPath d={`M ${CX - 300} ${CY + 60} L ${CX - 40} ${CY + 60}`} duration={12} strokeWidth={STROKE_THIN * 1.2} />
      <DrawPath d={`M ${CX - 40} ${CY + 60} C ${CX + 60} ${CY + 60} ${CX + 120} ${CY - 60} ${CX + 280} ${CY - 120}`} delay={10} duration={14} strokeWidth={STROKE_THIN * (1.2 + 1.2 * pick)} />
      <DrawPath d={`M ${CX - 40} ${CY + 60} C ${CX + 60} ${CY + 60} ${CX + 120} ${CY + 160} ${CX + 280} ${CY + 220}`} delay={10} duration={14} strokeWidth={STROKE_THIN} opacity={1 - 0.65 * pick} />
      <circle cx={CX - 40} cy={CY + 60} r={9} fill={INK} stroke="none" />
      <Glow cx={CX + 280} cy={CY - 120} r={90} o={pick} id="eligeGlow" />
      {pick > 0 ? <circle cx={CX + 280} cy={CY - 120} r={9 * pick} fill={INK} stroke="none" /> : null}
    </>
  );
};

/** A message you answer later: a bubble typing, then it waits. */
const Mensaje: React.FC = () => {
  const { f, dur } = useScene();
  const wait = f > dur * 0.5;
  return (
    <>
      <DrawPath d={`M ${CX - 170} ${CY - 90} H ${CX + 170} A 30 30 0 0 1 ${CX + 200} ${CY - 60} V ${CY + 40} A 30 30 0 0 1 ${CX + 170} ${CY + 70} H ${CX - 60} L ${CX - 120} ${CY + 130} L ${CX - 120} ${CY + 70} H ${CX - 170} A 30 30 0 0 1 ${CX - 200} ${CY + 40} V ${CY - 60} A 30 30 0 0 1 ${CX - 170} ${CY - 90} Z`} duration={18} strokeWidth={STROKE_THIN * 1.3} />
      {[-60, 0, 60].map((dx, i) => {
        const bounce = wait ? 0 : Math.max(0, Math.sin(f / 4 - i * 0.9)) * 14;
        return <circle key={i} cx={CX + dx} cy={CY - 10 - bounce} r={14} fill={INK} stroke="none" opacity={wait ? 0.35 : 1} />;
      })}
    </>
  );
};

/** A word you keep to yourself: the bubble folds back into a point. */
const Palabra: React.FC = () => {
  const { f, dur, fps } = useScene();
  const k = spring({ frame: f - dur * 0.35, fps, config: { damping: 16, stiffness: 80 } });
  const s = 1 - 0.96 * k;
  return (
    <g style={{ transform: `scale(${s})`, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}>
      <path d={`M ${CX - 150} ${CY - 80} H ${CX + 150} A 28 28 0 0 1 ${CX + 178} ${CY - 52} V ${CY + 36} A 28 28 0 0 1 ${CX + 150} ${CY + 64} H ${CX - 50} L ${CX - 100} ${CY + 116} L ${CX - 100} ${CY + 64} H ${CX - 150} A 28 28 0 0 1 ${CX - 178} ${CY + 36} V ${CY - 52} A 28 28 0 0 1 ${CX - 150} ${CY - 80} Z`} strokeWidth={STROKE_THIN * 1.3 / Math.max(s, 0.2)} />
      <path d={`M ${CX - 90} ${CY - 8} H ${CX + 90}`} strokeWidth={STROKE_THIN * 1.3 / Math.max(s, 0.2)} opacity={1 - k} />
      {k > 0.8 ? <circle cx={CX} cy={CY} r={9 / s} fill={INK} stroke="none" /> : null}
    </g>
  );
};

/** A door you close slowly: the leaf swings shut, unhurried. */
const Puerta: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [6, dur * 0.9], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const W = 180;
  const H = 360;
  const x0 = CX - W / 2;
  const y0 = CY - H / 2 + 20;
  const open = 1 - k; // 1 = wide open
  const leafW = W * (0.25 + 0.75 * (1 - open));
  const skew = 40 * open;
  return (
    <>
      <DrawPath d={`M ${x0} ${y0 + H} V ${y0} H ${x0 + W} V ${y0 + H}`} duration={14} strokeWidth={STROKE_THIN * 1.3} />
      <DrawPath d={`M ${x0 - 120} ${y0 + H} H ${x0 + W + 120}`} duration={14} strokeWidth={STROKE_THIN} opacity={0.6} />
      {/* light through the opening narrows as the door shuts */}
      {open > 0.02 ? <path d={poly([[x0 + leafW, y0 + H], [x0 + W, y0 + H], [x0 + W + 140 * open, y0 + H + 80], [x0 + leafW + 60 * open, y0 + H + 80]])} fill={INK} stroke="none" opacity={0.08 * open} /> : null}
      <path d={poly([[x0, y0], [x0 + leafW, y0 - skew], [x0 + leafW, y0 + H + skew], [x0, y0 + H]])} strokeWidth={STROKE_THIN * 1.3} />
      <circle cx={x0 + leafW - 18} cy={y0 + H / 2 + 6} r={5} fill={INK} stroke="none" />
    </>
  );
};

/** Nobody applauds that space: a spotlight on an empty gap. */
const Aplauso: React.FC = () => {
  const { f } = useScene();
  const o = interpolate(f, [4, 16], [0, 1], clamp);
  return (
    <>
      <path d={poly([[CX - 30, 150], [CX + 30, 150], [CX + 150, CY + 120], [CX - 150, CY + 120]])} fill={INK} stroke="none" opacity={0.07 * o} />
      <path d={`M ${CX - 30} 150 L ${CX - 150} ${CY + 120} M ${CX + 30} 150 L ${CX + 150} ${CY + 120}`} strokeWidth={STROKE_THIN} opacity={0.5 * o} />
      <DrawPath d={`M ${CX - 150} ${CY + 120} A 150 26 0 0 0 ${CX + 150} ${CY + 120} A 150 26 0 0 0 ${CX - 150} ${CY + 120} Z`} delay={6} duration={14} strokeWidth={STROKE_THIN} />
      {/* empty seats, all dim */}
      {new Array(9).fill(0).map((_, i) => (
        <path key={i} d={`M ${CX - 320 + i * 80} ${CY + 250} a 22 22 0 0 1 44 0`} strokeWidth={STROKE_THIN} opacity={0.3} />
      ))}
    </>
  );
};

/** But almost everything is decided there: from one point, many paths. */
const Decide: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [4, dur * 0.8], [0, 1], clamp);
  const ox = CX - 280;
  return (
    <>
      <Glow cx={ox} cy={CY} r={90} o={1} id="decGlow" />
      <circle cx={ox} cy={CY} r={10} fill={INK} stroke="none" />
      {new Array(9).fill(0).map((_, i) => {
        const a = -0.9 + (i / 8) * 1.8;
        const ex = ox + Math.cos(a) * 600;
        const ey = CY + Math.sin(a) * 420;
        const d = `M ${ox} ${CY} C ${ox + 200} ${CY} ${ox + 300} ${CY + Math.sin(a) * 200} ${ex} ${ey}`;
        return (
          <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} strokeWidth={STROKE_THIN} opacity={0.4 + 0.6 * (i === 4 ? 1 : 0)} />
        );
      })}
    </>
  );
};

/** The more you use it, the bigger it gets: the gap widens, ring by ring. */
const Crece: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [4, dur * 0.85], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const g = 60 + 560 * k;
  return (
    <>
      <Pair gap={g} />
      {[0, 1, 2, 3].map((i) => {
        const r = (g / 2 - 30) * (0.4 + i * 0.2);
        return r > 4 ? <path key={i} d={circlePath(CX, CY, r)} strokeWidth={STROKE_THIN * 0.9} opacity={0.75 - i * 0.15} /> : null;
      })}
    </>
  );
};

const PausaIcono: React.FC = () => (
  <>
    <DrawPath d={`M ${CX - 40} ${CY - 90} V ${CY + 90}`} duration={10} strokeWidth={STROKE * 2.4} />
    <DrawPath d={`M ${CX + 40} ${CY - 90} V ${CY + 90}`} delay={4} duration={10} strokeWidth={STROKE * 2.4} />
  </>
);

const Respiro: React.FC = () => {
  const { f, dur } = useScene();
  const k = Math.sin(Math.min(1, f / dur) * Math.PI);
  return (
    <>
      <Glow cx={CX} cy={CY} r={120 + 120 * k} o={0.4 + 0.6 * k} id="respGlow" />
      <path d={circlePath(CX, CY, 60 + 90 * k)} strokeWidth={STROKE_THIN * 1.3} />
    </>
  );
};

const Eleccion: React.FC = () => {
  const { f, dur } = useScene();
  const pick = interpolate(f, [Math.min(10, dur * 0.35), Math.min(16, dur * 0.5)], [0, 1], clamp);
  return (
    <>
      <DrawPath d={circlePath(CX - 100, CY, 30)} duration={6} strokeWidth={STROKE_THIN * 1.3} />
      <DrawPath d={circlePath(CX + 100, CY, 30)} delay={2} duration={6} strokeWidth={STROKE_THIN * 1.3} />
      {pick > 0 ? <circle cx={CX + 100} cy={CY} r={14 * pick} fill={INK} stroke="none" /> : null}
      <Glow cx={CX + 100} cy={CY} r={100} o={pick} id="elGlow" />
    </>
  );
};

/** That space is you too: back to the two points; in the gap, a light. */
const SosVos: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [dur * 0.25, dur * 0.55], [0, 1], clamp);
  return (
    <>
      <Pair gap={600} />
      <path d={`M ${CX - 300} ${CY} L ${CX - 110} ${CY} M ${CX + 110} ${CY} L ${CX + 300} ${CY}`} strokeWidth={STROKE_THIN * 1.2} opacity={0.6} />
      <Glow cx={CX} cy={CY} r={60 + 160 * k} o={k} id="vosGlow" />
      {k > 0 ? <circle cx={CX} cy={CY} r={12 * k} fill={INK} stroke="none" /> : null}
    </>
  );
};

/* ------------------------------------------------------------- timing */

export type PausaScene = { start: number; end: number };
export type PausaLine = { text: string; start: number; end: number; scene: number; row: number; words?: number[] };
export type PausaProps = { scenes?: PausaScene[]; lines?: PausaLine[]; seconds?: number };

const ART: React.FC[] = [Espacio, Casi, Segundo, Respiracion, Pregunta, Elige, Mensaje, Palabra, Puerta, Aplauso, Decide, Crece, PausaIcono, Respiro, Eleccion, SosVos];

/** The script: one scene per line, long lines split in two rows. */
export const PAUSA_SCRIPT: string[][] = [
  ["Entre lo que te pasa y lo que hacés,", "hay un espacio."],
  ["Casi nunca lo ves."],
  ["Dura menos que un segundo."],
  ["Ahí entra una respiración."],
  ["Ahí entra una pregunta."],
  ["Ahí entra la versión tuya", "que elige."],
  ["Un mensaje que contestás más tarde."],
  ["Una palabra que te guardás."],
  ["Una puerta que cerrás despacio."],
  ["Nadie aplaude ese espacio."],
  ["Pero ahí se decide casi todo."],
  ["Cuanto más lo usás,", "más grande se hace."],
  ["Una pausa."],
  ["Un respiro."],
  ["Una elección."],
  ["Ese espacio también sos vos."],
];

/** Until there is a voice-over: about 13 characters a second, a short breath between lines. */
const estimate = () => {
  const scenes: PausaScene[] = [];
  const lines: PausaLine[] = [];
  let t = 0.4;
  PAUSA_SCRIPT.forEach((rows, si) => {
    const start = si === 0 ? 0 : t - 0.1;
    let rt = t;
    rows.forEach((text, row) => {
      lines.push({ text, start: rt, end: 0, scene: si, row });
      rt += text.length / 13 + 0.1;
    });
    t = rt + (si >= 12 && si <= 14 ? 0.35 : 0.6);
    scenes.push({ start, end: 0 });
  });
  const seconds = t + 1.6;
  scenes.forEach((s, i) => (s.end = i + 1 < scenes.length ? scenes[i + 1].start : seconds));
  lines.forEach((l) => (l.end = scenes[l.scene].end));
  return { scenes, lines, seconds };
};

const DEFAULT = estimate();
export const PAUSA_FRAMES = Math.round(DEFAULT.seconds * FPS);

export const Pausa: React.FC<PausaProps> = ({ scenes = DEFAULT.scenes, lines = DEFAULT.lines }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={Math.round(s.start * fps)} durationInFrames={Math.max(1, Math.round((s.end - s.start) * fps))}>
          <Shot C={ART[i]} last={i === scenes.length - 1} />
        </Sequence>
      ))}
      {lines.map((l, i) => {
        const rows = lines.filter((m) => m.scene === l.scene).length;
        return (
          <Sequence key={`t${i}`} from={Math.round(l.start * fps)} durationInFrames={Math.max(1, Math.round((l.end - l.start) * fps))}>
            <TextLine text={l.text} rows={rows} row={l.row} dark={false} times={l.words} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
