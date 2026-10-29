import React from "react";
import { interpolate } from "remotion";
import { circlePath, DrawPath } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Glow, poly, useScene } from "./Invisible";
import { arcHead, head, ImpulsoScene, MarkedReel, Persona, Pildora, ramp, useMark } from "./Impulso";
import { Cabeza, Candado, Freno } from "./Pies";

/**
 * "Papel": animation to lay over Pablo's reel on writing out what keeps going
 * round your head about someone (the head holds what matters as a priority so as
 * not to lose sight of it, the repetition wears you out; write non-stop for 10
 * minutes; once it's on paper the head no longer has to hold it). 1:1, no text,
 * on the ORIGINAL timeline of his video; each detail lands on its word (`marks`).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const W = STROKE_THIN * 1.3;

/* --------------------------------------------------------------- pieces */

/** A small heart centred on (x, y): what matters to you. */
const heart = (x: number, y: number, k = 1) => {
  const P = (dx: number, dy: number) => `${(x + dx * k).toFixed(1)} ${(y + dy * k).toFixed(1)}`;
  return `M ${P(0, 30)} C ${P(-12, 20)} ${P(-40, 6)} ${P(-40, -12)} C ${P(-40, -26)} ${P(-28, -34)} ${P(-18, -34)} C ${P(-10, -34)} ${P(-3, -29)} ${P(0, -22)} C ${P(3, -29)} ${P(10, -34)} ${P(18, -34)} C ${P(28, -34)} ${P(40, -26)} ${P(40, -12)} C ${P(40, 6)} ${P(12, 20)} ${P(0, 30)} Z`;
};

/** A sheet with a folded corner, (x0, y0) to (x1, y1). */
const sheet = (x0: number, y0: number, x1: number, y1: number, fold = 50) =>
  `M ${x0} ${y0} H ${x1 - fold} L ${x1} ${y0 + fold} V ${y1} H ${x0} Z M ${x1 - fold} ${y0} V ${y0 + fold} H ${x1}`;

/** A written line from x0 to x1 at y: straight, or wavy (messy) by `mess`. */
const written = (x0: number, x1: number, y: number, mess: number, seed: number) => {
  const n = 16;
  const pts = new Array(n + 1).fill(0).map((_, i) => [x0 + ((x1 - x0) * i) / n, y + Math.sin(i * 1.7 + seed) * 7 * mess]);
  return poly(pts, false);
};

/** A pencil whose tip sits exactly on (x, y), body up and to the right. */
const Pencil: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => {
  const a = -0.95; // direction from tip to the eraser end
  const [dx, dy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-dy, dx];
  const at = (t: number, s: number) => `${(x + dx * t + nx * s).toFixed(1)} ${(y + dy * t + ny * s).toFixed(1)}`;
  const w = 14;
  return (
    <g opacity={o}>
      <path d={`M ${at(0, 0)} L ${at(34, w)} L ${at(150, w)} L ${at(150, -w)} L ${at(34, -w)} Z`} fill={BG} strokeWidth={W} />
      <path d={`M ${at(34, w)} L ${at(34, -w)} M ${at(128, w)} L ${at(128, -w)}`} strokeWidth={STROKE_THIN} />
    </g>
  );
};

/** Head in profile holding what matters: a heart inside a ring. */
const Holding: React.FC<{ x: number; y: number; r: number; ring: number; heartO?: number; glow?: number; id: string }> = ({ x, y, r, ring, heartO = 1, glow = 0, id }) => {
  const hx = x + 0.06 * r;
  const hy = y - 0.05 * r;
  return (
    <>
      <path d={head(x, y, r)} strokeWidth={STROKE} />
      <Glow cx={hx} cy={hy} r={r * 0.9} o={glow} id={id} />
      {heartO > 0 ? <path d={heart(hx, hy, r / 150)} strokeWidth={W} fill={INK} fillOpacity={0.2} opacity={heartO} /> : null}
      {ring > 0 ? <path d={circlePath(hx, hy, 70 * (r / 150))} strokeWidth={W * (1 + ring)} opacity={Math.min(1, ring * 2)} /> : null}
    </>
  );
};

/* ------------------------------------------------------------------ scenes */

/** When something matters this much, the head holds it as a priority all the time. */
const Importa: React.FC = () => {
  const { f } = useScene();
  const [imp, sos, pri] = [useMark(0), useMark(1), useMark(2)];
  const H = { x: 420, y: 400, r: 160 };
  const hx = H.x + 0.06 * H.r;
  const hy = H.y - 0.05 * H.r;
  const k = H.r / 150;
  const pulse = ramp(f, pri - 2, 6) * (0.5 + 0.5 * Math.sin(f / 5));
  return (
    <>
      <DrawPath d={head(H.x, H.y, H.r)} duration={18} />
      <Glow cx={hx} cy={hy} r={150} o={0.3 * ramp(f, imp, 10) + 0.4 * pulse} id="impGlow" />
      <DrawPath d={heart(hx, hy, k)} delay={imp - 6} duration={12} strokeWidth={W} />
      <DrawPath d={circlePath(hx, hy, 70 * k)} delay={sos - 6} duration={12} strokeWidth={W * (1 + ramp(f, pri - 2, 8))} />
    </>
  );
};

/** So as not to lose sight of it: an eye with the heart in its iris. */
const Vista: React.FC = () => {
  const { f } = useScene();
  const [per, vis] = [useMark(0), useMark(1)];
  return (
    <>
      <DrawPath d={`M 240 520 Q ${CX} 270 840 520 Q ${CX} 770 240 520 Z`} duration={14} strokeWidth={STROKE} />
      <DrawPath d={circlePath(CX, 520, 110)} delay={Math.max(4, per - 10)} duration={10} strokeWidth={W} />
      <DrawPath d={heart(CX, 522, 1.3)} delay={Math.max(8, per - 4)} duration={10} strokeWidth={W} />
      <Glow cx={CX} cy={520} r={200} o={0.6 * ramp(f, vis - 2, 8)} id="eyeGlow" />
    </>
  );
};

/** And that repetition wears you out: a battery losing a notch with every turn. */
const Agota: React.FC = () => {
  const { f } = useScene();
  const [rep, ago] = [useMark(0), useMark(1)];
  const level = 4 - Math.min(3, Math.floor(Math.max(0, f - rep) / 12));
  const x0 = 330;
  const x1 = 710;
  const y0 = 430;
  const y1 = 610;
  const cw = (x1 - x0 - 40) / 4;
  const blink = f > ago ? 0.35 + 0.65 * (Math.floor((f - ago) / 6) % 2) : 1;
  return (
    <>
      <DrawPath d={`M ${x0 + 24} ${y0} H ${x1 - 24} A 24 24 0 0 1 ${x1} ${y0 + 24} V ${y1 - 24} A 24 24 0 0 1 ${x1 - 24} ${y1} H ${x0 + 24} A 24 24 0 0 1 ${x0} ${y1 - 24} V ${y0 + 24} A 24 24 0 0 1 ${x0 + 24} ${y0} Z M ${x1} ${y0 + 60} H ${x1 + 30} V ${y1 - 60} H ${x1}`} duration={12} strokeWidth={W} />
      {new Array(4).fill(0).map((_, i) =>
        i < level ? (
          <rect key={i} x={x0 + 20 + i * cw + 6} y={y0 + 20} width={cw - 12} height={y1 - y0 - 40} rx={8} fill={INK} stroke="none" opacity={(i === 0 && level === 1 ? blink : 1) * 0.75 * ramp(f, 8 + i * 2, 6)} />
        ) : null,
      )}
    </>
  );
};

const DOC = { x0: 380, y0: 270, x1: 700, y1: 710 };
const LINE_Y = (i: number) => DOC.y0 + 110 + i * 50;

/** Grab a sheet of paper. */
const Papel: React.FC = () => {
  const { f } = useScene();
  const [aga, pap] = [useMark(0), useMark(1)];
  return (
    <>
      <DrawPath d={sheet(DOC.x0, DOC.y0, DOC.x1, DOC.y1)} duration={Math.max(12, aga)} strokeWidth={W} />
      <Glow cx={CX} cy={490} r={260} o={0.4 * ramp(f, pap - 2, 8)} id="paperGlow" />
    </>
  );
};

/** Write non-stop for 10 minutes, without correcting, without checking it's well written. */
const Escribe: React.FC = () => {
  const { f, dur } = useScene();
  const [esc, diez, cor] = [useMark(0), useMark(1), useMark(2)];
  const per = 18; // frames per written line
  const t = Math.max(0, f - (esc - 6)) / per;
  const n = Math.min(8, t);
  const ring = interpolate(f, [diez, dur - 2], [0, 1], clamp);
  const R = 345;
  const e = -Math.PI / 2 + ring * Math.PI * 2;
  const lx0 = DOC.x0 + 40;
  const lx1 = DOC.x1 - 40;
  // once he says "sin corregir", lines come out messier
  const messFrom = Math.floor(Math.max(0, cor - (esc - 6)) / per);
  let tip: [number, number] = [lx0, LINE_Y(0)];
  const lines = [];
  for (let i = 0; i < 8; i++) {
    const k = Math.max(0, Math.min(1, n - i));
    if (k <= 0) {
      break;
    }
    const mess = i >= messFrom ? 1 : 0;
    const x = lx0 + (lx1 - lx0) * k;
    lines.push(<path key={i} d={written(lx0, x, LINE_Y(i), mess, i * 2.1)} strokeWidth={STROKE_THIN} />);
    tip = [x, LINE_Y(i) + (mess ? Math.sin(16 * k * 1.7 + i * 2.1) * 7 : 0)];
  }
  return (
    <>
      <path d={sheet(DOC.x0, DOC.y0, DOC.x1, DOC.y1)} strokeWidth={W} />
      {lines}
      {f > esc - 8 ? <Pencil x={tip[0]} y={tip[1]} o={ramp(f, esc - 8, 4)} /> : null}
      {ring > 0 ? (
        <>
          <path d={circlePath(CX, 490, R)} strokeWidth={STROKE_THIN} opacity={0.3} />
          <path d={`M ${CX} ${490 - R} A ${R} ${R} 0 ${ring > 0.5 ? 1 : 0} 1 ${CX + Math.cos(e) * R} ${490 + Math.sin(e) * R}`} strokeWidth={STROKE * 1.2} />
          <circle cx={CX + Math.cos(e) * R} cy={490 + Math.sin(e) * R} r={10} fill={INK} stroke="none" />
        </>
      ) : null}
    </>
  );
};

/** Put it on paper and the head no longer has to hold it: the heart moves from the head to the sheet. */
const Pasa: React.FC = () => {
  const { f } = useScene();
  const [pas, pap, cab, sos] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const H = { x: 300, y: 420, r: 130 };
  const from = [H.x + 0.06 * H.r, H.y - 0.05 * H.r];
  const D = { x0: 640, y0: 300, x1: 880, y1: 640 };
  const to = [(D.x0 + D.x1) / 2, 480];
  const m = interpolate(f, [pas, pap + 6], [0, 1], clamp);
  const ease = 0.5 - 0.5 * Math.cos(m * Math.PI);
  const hx = from[0] + (to[0] - from[0]) * ease;
  const hy = from[1] + (to[1] - from[1]) * ease - Math.sin(ease * Math.PI) * 90;
  const ringGone = 1 - ramp(f, sos - 4, 12);
  return (
    <>
      <Holding x={H.x} y={H.y} r={H.r} ring={ringGone * (f < cab ? 1 : 0.6)} heartO={0} glow={0.35 * ramp(f, sos, 12)} id="pasaGlow" />
      <path d={sheet(D.x0, D.y0, D.x1, D.y1, 40)} strokeWidth={W} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${D.x0 + 30} ${D.y0 + 210 + i * 30} H ${D.x1 - 30 - (i === 3 ? 60 : 0)}`} strokeWidth={STROKE_THIN} opacity={0.6} />
      ))}
      <path d={heart(hx, hy, 130 / 150)} strokeWidth={W} fill={INK} fillOpacity={0.2} />
      <Glow cx={to[0]} cy={to[1]} r={150} o={0.4 * ramp(f, pap + 6, 10)} id="onPaper" />
    </>
  );
};

/** Because it's already outside, put away: the sheet slides into a folder. */
const Guarda: React.FC = () => {
  const { f } = useScene();
  const [fue, gua] = [useMark(0), useMark(1)];
  const drop = interpolate(f, [fue - 8, gua], [0, 1], clamp);
  const dy = -220 * (1 - drop);
  const front = ramp(f, gua - 2, 8);
  return (
    <>
      <DrawPath d={`M 330 420 V 720 H 750 V 450 H 530 L 500 420 Z`} duration={12} strokeWidth={W} />
      <g transform={`translate(0 ${dy})`}>
        <path d={sheet(410, 360, 670, 640, 40)} fill={BG} strokeWidth={W} />
        <path d={heart(540, 450, 0.9)} strokeWidth={W} fill={INK} fillOpacity={0.2} />
      </g>
      {/* the folder's front closes over the sheet */}
      <DrawPath d={`M 330 520 H 750 V 720 H 330 Z`} delay={4} duration={10} strokeWidth={W} occlude />
      <Glow cx={CX} cy={600} r={260} o={0.45 * front} id="folderGlow" />
    </>
  );
};

/** And so it stops repeating itself: an arrow circling the head slows to a halt. */
const Repite: React.FC = () => {
  const { f } = useScene();
  const [dej, rep] = [useMark(0), useMark(1)];
  const C = { x: 500, y: 500, R: 300 };
  let ang = 0;
  for (let i = 0; i < f; i++) {
    ang += i < dej ? 10 : interpolate(i, [dej, rep + 6], [10, 0], clamp);
  }
  const e = -0.6;
  return (
    <>
      <path d={head(470, 430, 150)} strokeWidth={STROKE} />
      <Glow cx={470} cy={430} r={180} o={0.4 * ramp(f, rep, 12)} id="calmHead" />
      <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: `${C.x}px ${C.y}px`, transformBox: "view-box" }}>
        <DrawPath d={`M ${C.x + C.R} ${C.y} A ${C.R} ${C.R} 0 1 1 ${C.x + C.R * Math.cos(e)} ${C.y + C.R * Math.sin(e)}`} duration={12} strokeWidth={STROKE * 1.2} />
        <path d={arcHead(C.x, C.y, C.R, e)} strokeWidth={STROKE * 1.2} opacity={ramp(f, 8, 4)} />
      </g>
    </>
  );
};

/** What you let go of on paper stops going round inside: the spiral in the head slows and goes still. */
const Adentro: React.FC = () => {
  const { f } = useScene();
  const [sol, pap, vue, ade] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const H = { x: 330, y: 420, r: 140 };
  const sx = H.x + 0.06 * H.r;
  const sy = H.y - 0.05 * H.r;
  let a0 = 0;
  for (let i = 0; i < f; i++) {
    a0 += i < vue ? 0.25 : interpolate(i, [vue, ade + 4], [0.25, 0], clamp);
  }
  const still = ramp(f, ade - 2, 12);
  const spiral = poly(
    new Array(91).fill(0).map((_, i) => {
      const t = (i / 90) * Math.PI * 5;
      const r = 4 + (52 * i) / 90;
      return [sx + Math.cos(t + a0) * r, sy + Math.sin(t + a0) * r];
    }),
    false,
  );
  const D = { x0: 660, y0: 300, x1: 880, y1: 620 };
  return (
    <>
      <path d={head(H.x, H.y, H.r)} strokeWidth={STROKE} />
      {still < 1 ? <path d={spiral} strokeWidth={STROKE_THIN} opacity={1 - still} /> : null}
      <Glow cx={sx} cy={sy} r={150} o={0.55 * still} id="stillGlow" />
      {still > 0 ? <circle cx={sx} cy={sy} r={10 * still} fill={INK} stroke="none" /> : null}
      <DrawPath d={sheet(D.x0, D.y0, D.x1, D.y1, 40)} delay={Math.max(0, sol - 8)} duration={12} strokeWidth={W} />
      {[0, 1, 2, 3, 4].map((i) => (
        <DrawPath key={i} d={written(D.x0 + 30, D.x1 - 30, D.y0 + 90 + i * 40, 1, i * 2.1)} delay={Math.max(0, sol - 2) + i * 2} duration={6} strokeWidth={STROKE_THIN} />
      ))}
      <Glow cx={(D.x0 + D.x1) / 2} cy={(D.y0 + D.y1) / 2} r={170} o={0.4 * ramp(f, pap - 2, 8)} id="sheetGlow" />
    </>
  );
};

/* ------------------------------------------------------------- composition */

export type PapelProps = { scenes?: ImpulsoScene[]; seconds?: number };

const ART: React.FC[] = [Persona, Cabeza, Freno, Importa, Vista, Agota, Papel, Escribe, Candado, Pasa, Guarda, Repite, Adentro, Pildora];

export const PAPEL_SECONDS = 38.8;
export const PAPEL_FRAMES = Math.round(PAPEL_SECONDS * FPS);

export const PapelReel: React.FC<PapelProps> = ({ scenes = [] }) => <MarkedReel scenes={scenes} art={ART} />;
