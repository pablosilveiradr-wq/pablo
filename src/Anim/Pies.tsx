import React from "react";
import { interpolate, spring } from "remotion";
import { circlePath, DrawPath } from "./primitives";
import { FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Glow, poly, rnd, useScene } from "./Invisible";
import { brain, head, ImpulsoScene, MarkedReel, person, Pildora, ramp, useMark } from "./Impulso";

/**
 * "Pies": animation to lay over Pablo's reel on grounding through the soles of
 * the feet (the head that won't stop, the part that stays on guard, feet on the
 * floor for 30 seconds, the body lives in the present). 1:1, no text, on the
 * ORIGINAL timeline of his video; each detail lands on its word (`marks`).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const CY = 520;
const W = STROKE_THIN * 1.3;
const FLOOR = 760;

/* --------------------------------------------- glyphs on the 24 icon grid */

const FOOT_SIDE = "M6 4v9q-2 1-2 3q0 2 2 2h13a1.5 1.5 0 0 0 0-3l-7-2-3-3v-6";
const SOLES = [
  "M4 9a3.5 3.5 0 0 1 7 0l-1 7a2.5 2.5 0 0 1-5 0q.3-3-1-7z",
  "M13 9a3.5 3.5 0 0 1 7 0q-1.3 4-1 7a2.5 2.5 0 0 1-5 0z",
  circlePath(5, 3.4, 1),
  circlePath(7.6, 3, 0.8),
  circlePath(19, 3.4, 1),
  circlePath(16.4, 3, 0.8),
];
/** Where each sole meets the ground: ball and heel of both feet (grid units). */
const CONTACT = [[7.3, 8.6], [7.4, 15.8], [16.7, 8.6], [16.6, 15.8]];

/** A 24-grid glyph placed at (x, y) with k px per unit; strokes keep their weight. */
const Grid: React.FC<{ x: number; y: number; k: number; children: React.ReactNode }> = ({ x, y, k, children }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>{children}</g>
);

const Soles: React.FC<{ x: number; y: number; k: number; fill?: number; delay?: number }> = ({ x, y, k, fill = 0, delay = 0 }) => (
  <Grid x={x} y={y} k={k}>
    {fill > 0 ? <path d={SOLES[0] + SOLES[1]} fill={INK} stroke="none" opacity={0.16 * fill} /> : null}
    {SOLES.map((d, i) => (
      <DrawPath key={i} d={d} delay={delay + (i < 2 ? 0 : 8)} duration={i < 2 ? 18 : 6} strokeWidth={W / k} />
    ))}
  </Grid>
);

const ripple = (f: number, at: number, x: number, y: number, rx: number, key: string) => {
  const t = ramp(f, at, 20);
  return t > 0 && t < 1 ? <ellipse key={key} cx={x} cy={y} rx={rx * (0.3 + t)} ry={rx * 0.16 * (0.3 + t)} strokeWidth={STROKE_THIN} opacity={1 - t} /> : null;
};

/* ------------------------------------------------------------------ scenes */

/** The head won't stop: a dot jumping from thought to thought; the switch won't turn it off. */
const Cabeza: React.FC = () => {
  const { f } = useScene();
  const [cab, sal, apa] = [useMark(0), useMark(1), useMark(2)];
  const B = [[660, 250, 56], [830, 330, 48], [700, 440, 40]];
  const hop = 9;
  const k = Math.max(0, f - sal);
  const from = B[Math.floor(k / hop) % 3];
  const to = B[(Math.floor(k / hop) + 1) % 3];
  const t = (k % hop) / hop;
  const jx = from[0] + (to[0] - from[0]) * t;
  const jy = from[1] + (to[1] - from[1]) * t - Math.sin(t * Math.PI) * 50;
  // the switch: tries to go off, snaps back on
  const sw = f > apa ? interpolate(f - apa, [0, 6, 12, 20], [0, 1, 1, 0], clamp) : 0;
  return (
    <>
      <DrawPath d={head(360, 470, 120)} duration={20} />
      {B.map(([x, y, r], i) => (
        <DrawPath key={i} d={circlePath(x, y, r)} delay={cab - 6 + i * 3} duration={10} strokeWidth={W} />
      ))}
      <DrawPath d={circlePath(510, 380, 9)} delay={cab - 8} duration={5} strokeWidth={STROKE_THIN} />
      <DrawPath d={circlePath(560, 330, 14)} delay={cab - 7} duration={5} strokeWidth={STROKE_THIN} />
      {f > sal ? (
        <>
          <Glow cx={jx} cy={jy} r={60} o={0.8} id="hopGlow" />
          <circle cx={jx} cy={jy} r={12} fill={INK} stroke="none" />
        </>
      ) : null}
      {f > apa - 4 ? (
        <g opacity={ramp(f, apa - 4, 6)}>
          <path d={`M 690 620 h 120 a 40 40 0 0 1 0 80 h -120 a 40 40 0 0 1 0 -80 Z`} strokeWidth={W} />
          <circle cx={810 - 120 * sw} cy={660} r={28} fill={INK} stroke="none" />
        </g>
      ) : null}
    </>
  );
};

/** What's going on and how to stop it: an arrow spinning round the brain, slowing to a halt. */
const Freno: React.FC = () => {
  const { f, dur } = useScene();
  const [pas, fre] = [useMark(0), useMark(1)];
  let ang = 0;
  for (let i = 0; i < f; i++) {
    ang += i < fre ? 9 : interpolate(i, [fre, Math.min(dur - 4, fre + 30)], [9, 0], clamp);
  }
  const R = 250;
  const e = -0.5;
  return (
    <>
      <Glow cx={CX} cy={CY - 20} r={260} o={0.5 * ramp(f, pas, 12)} id="frGlow" />
      <path d={brain(CX, CY + 10, 0.8)} strokeWidth={STROKE_THIN} opacity={0.6 + 0.4 * ramp(f, pas, 12)} />
      <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}>
        <DrawPath d={`M ${CX + R} ${CY} A ${R} ${R} 0 1 1 ${CX + R * Math.cos(e)} ${CY + R * Math.sin(e)}`} duration={14} strokeWidth={STROKE * 1.2} />
        <path d={`M ${CX + R * Math.cos(e) - 26} ${CY + R * Math.sin(e) - 6} L ${CX + R * Math.cos(e)} ${CY + R * Math.sin(e)} L ${CX + R * Math.cos(e) - 2} ${CY + R * Math.sin(e) + 28}`} strokeWidth={STROKE * 1.2} opacity={ramp(f, 10, 4)} />
      </g>
    </>
  );
};

/** A part of you stayed switched on: a small point inside the head, lit and pulsing. */
const Encendida: React.FC = () => {
  const { f } = useScene();
  const [sob, par, enc] = [useMark(0), useMark(1), useMark(2)];
  const on = ramp(f, enc - 2, 6);
  const pulse = on * (0.75 + 0.25 * Math.sin((f - enc) / 4));
  return (
    <>
      <DrawPath d={head(470, 420, 160)} duration={20} />
      {/* overthinking: faint rings rippling round the skull */}
      {[0, 1].map((i) => {
        const t = ((Math.max(0, f - sob) / 30 + i / 2) % 1) * ramp(f, sob, 6);
        return t > 0 ? <path key={i} d={circlePath(470, 420, 170 + 90 * t)} strokeWidth={STROKE_THIN} opacity={0.35 * (1 - t)} /> : null;
      })}
      <DrawPath d={circlePath(500, 450, 34)} delay={par - 4} duration={10} strokeWidth={W} />
      <Glow cx={500} cy={450} r={150} o={pulse} id="encGlow" />
      {on > 0 ? <circle cx={500} cy={450} r={16 * on} fill={INK} stroke="none" opacity={pulse} /> : null}
    </>
  );
};

/** On guard though there's nothing to solve: a radar sweeps; problems blip, then there's nothing. */
const Radar: React.FC = () => {
  const { f } = useScene();
  const [ant, pro, gua, nad] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const a = Math.max(0, f - ant) * 0.13 - Math.PI / 2;
  const R = 250;
  const blips = [[0.7, 150], [2.6, 200], [4.4, 110]];
  const guard = ramp(f, gua - 2, 8);
  return (
    <>
      <DrawPath d={circlePath(CX, CY, R)} duration={16} strokeWidth={W * (1 + 0.8 * guard)} />
      <DrawPath d={circlePath(CX, CY, R * 0.62)} delay={4} duration={12} strokeWidth={STROKE_THIN} opacity={0.4} />
      <DrawPath d={circlePath(CX, CY, R * 0.25)} delay={8} duration={8} strokeWidth={STROKE_THIN} opacity={0.4} />
      <Glow cx={CX} cy={CY} r={R + 60} o={0.35 * guard} id="radGlow" />
      {f > ant ? (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M ${CX} ${CY} L ${CX + Math.cos(a - i * 0.07) * R} ${CY + Math.sin(a - i * 0.07) * R}`} strokeWidth={i === 0 ? STROKE : STROKE_THIN} opacity={i === 0 ? 1 : 0.35 - i * 0.05} />
          ))}
          <circle cx={CX} cy={CY} r={9} fill={INK} stroke="none" />
        </>
      ) : null}
      {blips.map(([ang, r], i) => {
        // each blip flares when the sweep passes, until there turns out to be nothing
        const d = (((a - ang) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const flare = Math.max(0.35, 1 - d / 2.2);
        const o = ramp(f, pro - 2 + i * 3, 6) * (1 - ramp(f, nad, 14)) * flare;
        return o > 0 ? <path key={i} d={circlePath(CX + Math.cos(ang) * r, CY + Math.sin(ang) * r, 14)} fill={INK} stroke="none" opacity={o} /> : null;
      })}
    </>
  );
};

/** But try this now: an arrow down to the floor. */
const Abajo: React.FC = () => {
  const { f } = useScene();
  const ah = useMark(0);
  return (
    <>
      <DrawPath d={`M ${CX} 260 V ${FLOOR - 10} M ${CX - 50} ${FLOOR - 60} L ${CX} ${FLOOR - 10} L ${CX + 50} ${FLOOR - 60}`} duration={ah} strokeWidth={STROKE * 1.2} />
      <DrawPath d={`M 300 ${FLOOR} H 780`} duration={10} strokeWidth={W} />
      {ripple(f, ah, CX, FLOOR, 180, "r")}
    </>
  );
};

/** Both feet flat on the floor: two feet come down and land. */
const Piso: React.FC = () => {
  const { f, fps } = useScene();
  const [pie, pis] = [useMark(0), useMark(1)];
  const k = 18;
  const land = spring({ frame: f - (pis - 6), fps, config: { damping: 14, stiffness: 140 } });
  const dy = -90 * (1 - land);
  return (
    <>
      <DrawPath d={`M 160 ${FLOOR} H 920`} duration={12} strokeWidth={W} />
      {[180, 540].map((x, i) => (
        <g key={i} transform={`translate(0 ${dy})`}>
          <Grid x={x} y={FLOOR - 18 * k} k={k}>
            <DrawPath d={FOOT_SIDE} delay={i * 4} duration={Math.max(10, pie - 4)} strokeWidth={W / k} />
          </Grid>
        </g>
      ))}
      {ripple(f, pis, 400, FLOOR, 160, "a")}
      {ripple(f, pis, 760, FLOOR, 160, "b")}
    </>
  );
};

/** All your attention on the soles, how they touch the ground, for 30 seconds. */
const Plantas: React.FC = () => {
  const { f, dur } = useScene();
  const [ate, pla, toc, t30] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const k = 26;
  const ox = CX - 12 * k;
  const oy = CY - 10.5 * k;
  const fill = ramp(f, pla, 14);
  const ring = interpolate(f, [t30, dur - 2], [0, 1], clamp);
  const R = 300;
  const e = -Math.PI / 2 + ring * Math.PI * 2;
  return (
    <>
      <Glow cx={CX} cy={CY + 40} r={340} o={0.25 * ramp(f, ate, 12) + 0.35 * fill} id="solGlow" />
      <Soles x={ox} y={oy} k={k} fill={fill} />
      {CONTACT.map(([x, y], i) => {
        const px = ox + x * k;
        const py = oy + y * k;
        const t = f > toc ? ((f - toc + i * 5) % 30) / 30 : -1;
        return t >= 0 ? (
          <g key={i}>
            <circle cx={px} cy={py} r={9} fill={INK} stroke="none" opacity={ramp(f, toc + i * 3, 6)} />
            <path d={circlePath(px, py, 12 + 34 * t)} strokeWidth={STROKE_THIN} opacity={(1 - t) * ramp(f, toc + i * 3, 6)} />
          </g>
        ) : null;
      })}
      {ring > 0 ? (
        <>
          <path d={circlePath(CX, CY, R)} strokeWidth={STROKE_THIN} opacity={0.3} />
          <path d={`M ${CX} ${CY - R} A ${R} ${R} 0 ${ring > 0.5 ? 1 : 0} 1 ${CX + Math.cos(e) * R} ${CY + Math.sin(e) * R}`} strokeWidth={STROKE * 1.2} />
          <circle cx={CX + Math.cos(e) * R} cy={CY + Math.sin(e) * R} r={10} fill={INK} stroke="none" />
        </>
      ) : null}
    </>
  );
};

/** What almost nobody tells you: a padlock that opens. */
const Candado: React.FC = () => {
  const { f, fps } = useScene();
  const [nad, dic] = [useMark(0), useMark(1)];
  const open = spring({ frame: f - dic, fps, config: { damping: 12, stiffness: 150 } });
  const top = CY - 20;
  return (
    <>
      <DrawPath d={`M ${CX - 120} ${top} h 240 a 20 20 0 0 1 20 20 v 170 a 20 20 0 0 1 -20 20 h -240 a 20 20 0 0 1 -20 -20 v -170 a 20 20 0 0 1 20 -20 Z`} duration={Math.max(10, nad)} strokeWidth={W} />
      <DrawPath d={`M ${CX} ${top + 80} v 50`} delay={6} duration={6} strokeWidth={STROKE} />
      <DrawPath d={circlePath(CX, top + 76, 14)} delay={6} duration={6} strokeWidth={W} />
      {/* the shackle lifts off its right leg and swings open */}
      <g style={{ transform: `translateY(${-50 * open}px) rotate(${-28 * open}deg)`, transformOrigin: `${CX - 80}px ${top}px`, transformBox: "view-box" }}>
        <DrawPath d={`M ${CX - 80} ${top} V ${top - 70} A 80 80 0 0 1 ${CX + 80} ${top - 70} V ${top}`} delay={4} duration={14} strokeWidth={W} />
      </g>
      <Glow cx={CX} cy={top + 80} r={260} o={0.6 * open} id="lockGlow" />
    </>
  );
};

/** You can't think about the future and feel your feet at once: one lights, the other goes dim. */
const DosCosas: React.FC = () => {
  const { f } = useScene();
  const [pen, fut, sen, pie] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const feet = ramp(f, sen - 2, 10);
  const mind = ramp(f, pen - 2, 6) * (1 - 0.75 * feet);
  const k = 13;
  const sx = 770 - 12 * k;
  const sy = CY - 10.5 * k;
  const run = Math.max(0, f - fut) % 24;
  return (
    <>
      <g opacity={mind}>
        <path d={circlePath(320, 470, 150)} strokeWidth={W} strokeDasharray={feet > 0.5 ? "8 12" : undefined} />
        <path d={circlePath(430, 650, 14)} strokeWidth={STROKE_THIN} />
        <path d={circlePath(460, 700, 8)} strokeWidth={STROKE_THIN} />
        {f > fut ? (
          <g opacity={ramp(f, fut, 4)} transform={`translate(${run * 3} 0)`}>
            <path d="M 230 470 H 380 M 340 430 L 380 470 L 340 510" strokeWidth={STROKE * 1.1} />
          </g>
        ) : null}
      </g>
      <g opacity={0.25 + 0.75 * feet}>
        <Soles x={sx} y={sy} k={k} fill={feet} />
      </g>
      <Glow cx={770} cy={CY} r={220} o={feet * (0.6 + 0.4 * ramp(f, pie, 8))} id="dcGlow" />
    </>
  );
};

/** The body lives in the present: a figure on the ground, a point lit where it stands. */
const Presente: React.FC = () => {
  const { f } = useScene();
  const [cue, pre] = [useMark(0), useMark(1)];
  const y = 560;
  const kk = 3.4;
  const base = y + 34 * kk;
  const now = ramp(f, pre - 2, 8);
  return (
    <>
      <DrawPath d={person(CX, y, kk)} duration={Math.max(12, cue + 4)} strokeWidth={W} />
      <DrawPath d={`M 220 ${base} H 860`} duration={12} strokeWidth={W} />
      <Glow cx={CX} cy={base} r={200} o={now} id="nowGlow" />
      {now > 0 ? <circle cx={CX} cy={base} r={13 * now} fill={INK} stroke="none" /> : null}
      {ripple(f, pre, CX, base, 200, "p")}
    </>
  );
};

/** The present turns down the noise in your head: a jagged line inside the skull goes flat. */
const Ruido: React.FC = () => {
  const { f } = useScene();
  const [, apa] = [useMark(0), useMark(1)];
  const calm = ramp(f, apa - 2, 16);
  const hx = 450;
  const hy = 450;
  const r = 150;
  const pts: number[][] = [];
  for (let i = 0; i <= 28; i++) {
    const x = hx - r * 0.72 + (i / 28) * r * 1.44;
    const amp = 46 * (1 - calm) * Math.sin((i / 28) * Math.PI);
    pts.push([x, hy + amp * (rnd(i + Math.floor(f / 3) * 31) * 2 - 1)]);
  }
  return (
    <>
      <DrawPath d={head(hx, hy, r)} duration={16} />
      <path d={poly(pts, false)} strokeWidth={STROKE_THIN * (1.3 + 0.4 * calm)} opacity={ramp(f, 4, 6)} />
      <Glow cx={hx} cy={hy} r={200} o={0.55 * calm} id="calmGlow" />
    </>
  );
};

/** Looking for threats that don't exist: a magnifier searches; the warnings are dashed, then gone. */
const Amenazas: React.FC = () => {
  const { f } = useScene();
  const [men, bus, ame, exi] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const s = Math.max(0, f - bus);
  const mx = 720 + Math.sin(s / 14) * 150;
  const my = 470 + Math.sin(s / 9) * 90;
  const warn = [[620, 330], [860, 470], [680, 640]];
  return (
    <>
      <DrawPath d={head(270, 450, 110)} duration={16} />
      <Glow cx={270} cy={450} r={170} o={0.4 * ramp(f, men, 10)} id="mindGlow" />
      {warn.map(([x, y], i) => {
        const o = ramp(f, ame - 2 + i * 3, 6) * (1 - ramp(f, exi, 14));
        return o > 0 ? (
          <g key={i} opacity={o * 0.8}>
            <path d={poly([[x, y - 46], [x + 50, y + 38], [x - 50, y + 38]])} strokeWidth={STROKE_THIN} strokeDasharray="7 9" />
          </g>
        ) : null;
      })}
      {f > bus - 6 ? (
        <g opacity={ramp(f, bus - 6, 6)}>
          <path d={circlePath(mx, my, 62)} strokeWidth={W} />
          <path d={`M ${mx + 44} ${my + 44} L ${mx + 110} ${my + 110}`} strokeWidth={STROKE * 1.3} />
        </g>
      ) : null}
    </>
  );
};

/** Teach the body how to be safe: a figure, and a shelter that closes over it on "safe". */
const Salvo: React.FC = () => {
  const { f } = useScene();
  const [ens, cue, sal] = [useMark(0), useMark(1), useMark(2)];
  const y = 580;
  const kk = 2.8;
  const base = y + 34 * kk;
  const R = 270;
  return (
    <>
      <DrawPath d={`M ${CX - 380} ${base} H ${CX + 380}`} duration={12} strokeWidth={W} />
      <DrawPath d={person(CX, y, kk)} duration={Math.max(12, ens)} strokeWidth={W} />
      <Glow cx={CX} cy={y - 40} r={180} o={0.45 * ramp(f, cue, 10)} id="bodyGlow" />
      <DrawPath d={`M ${CX - R} ${base} A ${R} ${R} 0 0 1 ${CX + R} ${base}`} delay={sal - 12} duration={14} strokeWidth={STROKE * 1.2} />
      <Glow cx={CX} cy={base - 120} r={R + 40} o={0.5 * ramp(f, sal, 10)} id="safeGlow" />
    </>
  );
};

/* ------------------------------------------------------------- composition */

export type PiesProps = { scenes?: ImpulsoScene[]; seconds?: number };

const ART: React.FC[] = [Cabeza, Freno, Encendida, Radar, Abajo, Piso, Plantas, Candado, DosCosas, Presente, Ruido, Amenazas, Salvo, Pildora];

export const PIES_SECONDS = 41.121;
export const PIES_FRAMES = Math.round(PIES_SECONDS * FPS);

export const Pies: React.FC<PiesProps> = ({ scenes = [] }) => <MarkedReel scenes={scenes} art={ART} />;
