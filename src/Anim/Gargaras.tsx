import React from "react";
import { interpolate } from "remotion";
import { circlePath, DrawPath } from "./primitives";
import { FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Glow, poly, rnd, useScene } from "./Invisible";
import { head, ImpulsoScene, MarkedReel, Pildora, ramp, useMark } from "./Impulso";
import { Amenazas, Candado, Encendida, Freno, Salvo } from "./Pies";

/**
 * "Gárgaras": animation to lay over Pablo's reel on gargling to stimulate the
 * vagus nerve (head that won't stop and a tense body, the system left on, the
 * nerve that carries calm, water, gargle until the throat vibrates, the nerve
 * runs right by those muscles, the body lets go). 1:1, no text, on the ORIGINAL
 * timeline of his video; each detail lands on its word (`marks`).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const W = STROKE_THIN * 1.3;

/* ------------------------------------------------- front-facing bust, icon style */

const HEAD = { x: CX, y: 290, r: 72 };
const NECK_Y = 400;
/** Head circle, neck meeting it exactly, and a bust capsule closed at the bottom. */
const bust = () => {
  const dx = 26;
  const ny = HEAD.y + Math.sqrt(HEAD.r * HEAD.r - dx * dx);
  return [
    circlePath(HEAD.x, HEAD.y, HEAD.r),
    `M ${CX - dx} ${ny.toFixed(1)} V ${NECK_Y} M ${CX + dx} ${ny.toFixed(1)} V ${NECK_Y}`,
    `M ${CX - 150} 760 V 490 A 90 90 0 0 1 ${CX - 60} ${NECK_Y} H ${CX + 60} A 90 90 0 0 1 ${CX + 150} 490 V 760 Z`,
  ];
};

/** The vagus nerve: from the brainstem down the neck into chest and belly. */
const NERVE_TRUNK = `M ${CX} 318 V 720`;
const NERVE_BRANCHES = [
  `M ${CX} 520 Q ${CX - 40} 528 ${CX - 70} 570`,
  `M ${CX} 520 Q ${CX + 40} 528 ${CX + 70} 570`,
  `M ${CX} 630 Q ${CX - 36} 638 ${CX - 60} 676`,
  `M ${CX} 630 Q ${CX + 36} 638 ${CX + 60} 676`,
];

/** Tension: a tight spring across the shoulders, fixed to both sides of the body. */
const spring = (f: number, amt: number) => {
  const n = 16;
  const y = 540;
  const pts = new Array(n + 1).fill(0).map((_, i) => {
    const x = CX - 150 + (300 * i) / n;
    const a = i === 0 || i === n ? 0 : (i % 2 ? -1 : 1) * 16 * amt * (0.8 + 0.4 * rnd(i + Math.floor(f / 2) * 13));
    return [x, y + a];
  });
  return poly(pts, false);
};

/** Racing thoughts: a spiral turning fast inside the head. */
const tangle = (a0: number) => {
  const pts = new Array(91).fill(0).map((_, i) => {
    const t = (i / 90) * Math.PI * 5;
    const r = 4 + (42 * i) / 90;
    return [HEAD.x + Math.cos(t + a0) * r, HEAD.y + Math.sin(t + a0) * r];
  });
  return poly(pts, false);
};

/** Head won't stop and the body is tense, though nothing's going on. */
const Tenso: React.FC = () => {
  const { f } = useScene();
  const [cab, ten, nad] = [useMark(0), useMark(1), useMark(2)];
  const tense = ramp(f, ten - 2, 6);
  const jit = tense * (1 - 0.5 * ramp(f, nad, 20));
  const shake = jit * (rnd(Math.floor(f / 2)) - 0.5) * 6;
  const race = Math.max(0, f - cab) * 0.25;
  return (
    <>
      <g transform={`translate(${shake} 0)`}>
        {bust().map((d, i) => (
          <DrawPath key={i} d={d} delay={i * 4} duration={16} strokeWidth={W} />
        ))}
      </g>
      {f > cab - 2 ? <path d={tangle(race)} strokeWidth={STROKE_THIN} opacity={ramp(f, cab - 2, 6)} /> : null}
      {tense > 0 ? <path d={spring(f, jit)} strokeWidth={STROKE_THIN * 1.2} opacity={tense} /> : null}
    </>
  );
};

/** To calm it, the nerve that carries calm to the whole body: the vagus, lit top to bottom. */
const Nervio: React.FC = () => {
  const { f } = useScene();
  const [, ner, cal, cue, vag] = [useMark(0), useMark(1), useMark(2), useMark(3), useMark(4)];
  const down = interpolate(f, [cal, cue], [0, 1], clamp);
  const py = 318 + (720 - 318) * down;
  const branches = ramp(f, cue, 10);
  const all = ramp(f, vag - 2, 10);
  return (
    <>
      {bust().map((d, i) => (
        <path key={i} d={d} strokeWidth={W} opacity={0.55} />
      ))}
      <DrawPath d={NERVE_TRUNK} delay={ner - 6} duration={14} strokeWidth={STROKE * (1 + 0.3 * all)} />
      {NERVE_BRANCHES.map((d, i) => (
        <DrawPath key={i} d={d} delay={ner + 4 + i * 2} duration={10} strokeWidth={STROKE_THIN * (1.2 + 0.3 * all)} />
      ))}
      {[[CX, 318], [CX, 720], [CX - 70, 570], [CX + 70, 570], [CX - 60, 676], [CX + 60, 676]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 10 : 8} fill={INK} stroke="none" opacity={ramp(f, ner + (i === 0 ? -6 : i === 1 ? 8 : 12), 4)} />
      ))}
      {f > cal && down < 1 ? (
        <>
          <Glow cx={CX} cy={py} r={70} o={0.9} id="sigGlow" />
          <circle cx={CX} cy={py} r={11} fill={INK} stroke="none" />
        </>
      ) : null}
      {[[CX - 70, 570], [CX + 70, 570], [CX - 60, 676], [CX + 60, 676]].map(([x, y], i) => (
        <Glow key={i} cx={x} cy={y} r={70} o={branches * 0.7} id={`br${i}`} />
      ))}
      <Glow cx={CX} cy={520} r={300} o={0.45 * all} id="vagGlow" />
    </>
  );
};

/** Take a little water: a glass that fills. */
const Agua: React.FC = () => {
  const { f } = useScene();
  const [ah, tom, agu] = [useMark(0), useMark(1), useMark(2)];
  const level = interpolate(f, [tom, agu + 6], [0, 1], clamp);
  const top = 300;
  const bot = 720;
  const wall = (y: number) => 80 - ((y - top) / (bot - top)) * 18; // half width, narrower at the base
  const wy = bot - (bot - top - 70) * level;
  const wave = (x: number) => wy + Math.sin(x / 26 + f / 4) * 5 * level;
  const xs = new Array(17).fill(0).map((_, i) => CX - wall(wy) + (i / 16) * 2 * wall(wy));
  return (
    <>
      <DrawPath d={`M ${CX - wall(top)} ${top} L ${CX - wall(bot)} ${bot} H ${CX + wall(bot)} L ${CX + wall(top)} ${top}`} duration={Math.max(12, ah)} strokeWidth={W} />
      {level > 0 ? (
        <>
          <path d={`M ${xs[0]} ${wave(xs[0])} ${xs.map((x) => `L ${x} ${wave(x)}`).join(" ")} L ${CX + wall(bot)} ${bot} H ${CX - wall(bot)} Z`} fill={INK} stroke="none" opacity={0.14} />
          <path d={`M ${xs[0]} ${wave(xs[0])} ${xs.map((x) => `L ${x} ${wave(x)}`).join(" ")}`} strokeWidth={STROKE_THIN} />
        </>
      ) : null}
      <Glow cx={CX} cy={(wy + bot) / 2} r={220} o={0.35 * level} id="waterGlow" />
    </>
  );
};

/* -------------------------------------------------- profile head with throat */

const G = { x: 450, y: 360, r: 150 };
/** Throat: in the neck, just behind its front line. */
const THROAT = { x: G.x + 0.36 * G.r, y: G.y + 1.62 * G.r };
const THROAT_R = 26;
/** Inside walls of the neck at throat height (back line slopes from -0.5r to -0.42r). */
const NECK_L = G.x - (0.5 - 0.08 * ((1.62 - 0.866) / (2 - 0.866))) * G.r;
const NECK_R = G.x + 0.62 * G.r;
/** Ring for the 20–30 s count, centred on the head so it never crosses it. */
const RING = { x: 480, y: 445, r: 330 };
const nervePath = () => {
  const x = G.x + 0.12 * G.r;
  return `M ${x} ${G.y + 0.45 * G.r} C ${x + 10} ${G.y + 0.9 * G.r} ${x - 8} ${G.y + 1.3 * G.r} ${x + 6} ${G.y + 1.6 * G.r} S ${x} ${G.y + 1.9 * G.r} ${x + 2} ${G.y + 2 * G.r}`;
};

/** Gargle hard until the back of the throat vibrates, 20 or 30 seconds. */
const Gargara: React.FC = () => {
  const { f, dur } = useScene();
  const [gar, vib, gta, t30] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const bub = ramp(f, gar - 2, 6);
  const v = ramp(f, vib - 2, 6);
  const ring = interpolate(f, [t30, dur - 2], [0, 1], clamp);
  const R = RING.r;
  const e = -Math.PI / 2 + ring * Math.PI * 2;
  const { x: rx, y: ry } = RING;
  const tilt = -14 * ramp(f, gar - 6, 12);
  return (
    <>
      <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: `${G.x}px ${G.y + 2 * G.r}px`, transformBox: "view-box" }}>
        <DrawPath d={head(G.x, G.y, G.r)} duration={18} />
        {/* water at the back of the throat: a line wall to wall across the neck, bubbling */}
        {bub > 0 ? (
          <>
            <path d={poly(new Array(15).fill(0).map((_, i) => {
              const x = NECK_L + ((NECK_R - NECK_L) * i) / 14;
              const end = i === 0 || i === 14;
              return [x, THROAT.y + (end ? 0 : Math.sin(i * 1.3 + f / 2) * (5 + 6 * v) * bub)];
            }), false)} strokeWidth={W} opacity={bub} />
            {new Array(3).fill(0).map((_, i) => {
              const t = ((f * 0.05 + i / 3) % 1);
              return <path key={i} d={circlePath(THROAT.x - 30 + i * 22, THROAT.y - 12 - t * 34, 5 + i * 1.5)} strokeWidth={STROKE_THIN} opacity={bub * (1 - t)} />;
            })}
          </>
        ) : null}
        <Glow cx={THROAT.x} cy={THROAT.y} r={110} o={ramp(f, gta - 2, 8) * (0.7 + 0.3 * Math.sin(f / 3))} id="thrGlow" />
        {/* vibration: ripples spreading from the throat, inside the neck */}
        {v > 0
          ? [0, 1].map((i) => {
              const t = ((f / 12 + i / 2) % 1);
              return <path key={i} d={circlePath(THROAT.x - 20, THROAT.y, 8 + 22 * t)} strokeWidth={STROKE_THIN} opacity={v * (1 - t) * 0.8} />;
            })
          : null}
      </g>
      {ring > 0 ? (
        <>
          <path d={circlePath(rx, ry, R)} strokeWidth={STROKE_THIN} opacity={0.3} />
          <path d={`M ${rx} ${ry - R} A ${R} ${R} 0 ${ring > 0.5 ? 1 : 0} 1 ${rx + Math.cos(e) * R} ${ry + Math.sin(e) * R}`} strokeWidth={STROKE * 1.2} />
          <circle cx={rx + Math.cos(e) * R} cy={ry + Math.sin(e) * R} r={10} fill={INK} stroke="none" />
        </>
      ) : null}
    </>
  );
};

/** The vagus runs right past the muscles at the back of the throat. */
const Pasa: React.FC = () => {
  const { f } = useScene();
  const [ner, mus, gta] = [useMark(0), useMark(1), useMark(2)];
  return (
    <>
      <DrawPath d={head(G.x, G.y, G.r)} duration={16} />
      {f > ner ? <circle cx={G.x + 0.12 * G.r} cy={G.y + 0.45 * G.r} r={10} fill={INK} stroke="none" opacity={ramp(f, ner, 4)} /> : null}
      <DrawPath d={nervePath()} delay={ner} duration={18} strokeWidth={STROKE} />
      <DrawPath d={circlePath(THROAT.x, THROAT.y, THROAT_R)} delay={mus - 4} duration={10} strokeWidth={W} />
      <Glow cx={THROAT.x} cy={THROAT.y} r={130} o={0.75 * ramp(f, gta - 2, 8)} id="musGlow" />
    </>
  );
};

/** Working them with the gargle stimulates it directly: pulses run up and down the nerve. */
const Estimula: React.FC = () => {
  const { f } = useScene();
  const [gar, est, dir] = [useMark(0), useMark(1), useMark(2)];
  const nx = G.x + 0.12 * G.r;
  const y0 = G.y + 0.45 * G.r;
  const y1 = G.y + 2 * G.r;
  const lit = ramp(f, dir - 2, 10);
  return (
    <>
      <path d={head(G.x, G.y, G.r)} strokeWidth={STROKE} />
      <circle cx={nx} cy={y0} r={10} fill={INK} stroke="none" />
      <path d={nervePath()} strokeWidth={STROKE * (1 + 0.4 * lit)} />
      <path d={circlePath(THROAT.x, THROAT.y, THROAT_R)} strokeWidth={W} />
      {f > gar - 4
        ? new Array(4).fill(0).map((_, i) => {
            const t = ((f * 0.06 + i / 4) % 1);
            return <path key={i} d={circlePath(THROAT.x - 12 + rnd(i) * 24, THROAT.y + 20 - t * 50, 5 + rnd(i + 3) * 4)} strokeWidth={STROKE_THIN} opacity={ramp(f, gar - 4, 6) * (1 - t)} />;
          })
        : null}
      {f > est
        ? [0, 1].map((i) => {
            const t = (((f - est) / 24 + i / 2) % 1);
            const y = y0 + (y1 - y0) * t;
            return (
              <g key={i}>
                <Glow cx={nx} cy={y} r={60} o={0.9} id={`np${i}`} />
                <circle cx={nx} cy={y} r={9} fill={INK} stroke="none" />
              </g>
            );
          })
        : null}
      <Glow cx={nx} cy={(y0 + y1) / 2} r={260} o={0.5 * lit} id="dirGlow" />
    </>
  );
};

/** Your body starts letting go of the tension: the spring across the shoulders goes slack, the body warms. */
const Suelta: React.FC = () => {
  const { f } = useScene();
  const [cue, sol, ten] = [useMark(0), useMark(1), useMark(2)];
  const tension = 1 - ramp(f, sol, 18);
  return (
    <>
      {bust().map((d, i) => (
        <path key={i} d={d} strokeWidth={W} />
      ))}
      <Glow cx={CX} cy={520} r={280} o={0.25 * ramp(f, cue, 10) + 0.35 * ramp(f, ten, 14)} id="bodyWarm" />
      {tension > 0 ? <path d={spring(f, tension)} strokeWidth={STROKE_THIN * 1.2} opacity={Math.min(1, tension * 3)} /> : null}
    </>
  );
};

/* ------------------------------------------------------------- composition */

export type GargarasProps = { scenes?: ImpulsoScene[]; seconds?: number };

const ART: React.FC[] = [Tenso, Freno, Encendida, Nervio, Agua, Gargara, Candado, Pasa, Estimula, Suelta, Amenazas, Salvo, Pildora];

export const GARGARAS_SECONDS = 45.673;
export const GARGARAS_FRAMES = Math.round(GARGARAS_SECONDS * FPS);

export const Gargaras: React.FC<GargarasProps> = ({ scenes = [] }) => <MarkedReel scenes={scenes} art={ART} />;
