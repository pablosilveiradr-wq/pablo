import React from "react";
import { interpolate, spring as springAnim } from "remotion";
import { circlePath, DrawPath } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Glow, poly, useScene } from "./Invisible";
import { head, ImpulsoScene, MarkedReel, person, Pildora, ramp, useMark } from "./Impulso";
import { Candado, Freno, Salvo } from "./Pies";
import { bust, spring, tangle } from "./Gargaras";

/**
 * "Exhalá": animation to lay over Pablo's reel on breathing out longer than in
 * (in 4 through the nose, out 8 through the mouth as if blowing on a candle
 * without putting it out; the longer exhale is the body's natural brake).
 * 1:1, no text, on the ORIGINAL timeline of his video; each detail lands on
 * its word (`marks`).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const W = STROKE_THIN * 1.3;

/* ------------------------------------------------------- bust with lungs */

/** One lung hanging from its bronchus at (ax, 510); s scales it from that point. */
const lobe = (ax: number, s: number) => {
  const w = 50 * s;
  const h = 170 * s;
  const r = 40 * s;
  const x0 = ax - w;
  const x1 = ax + w;
  const y0 = 510;
  const y1 = 510 + h;
  return `M ${ax} ${y0} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} V ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0} ${y1 - r} V ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`;
};
const AIRWAY = `M ${CX} 400 V 470 M ${CX} 470 L ${CX - 85} 510 M ${CX} 470 L ${CX + 85} 510`;

/** The bust; `pinch` pulls the chest walls in (a tight chest). */
const torso = (pinch: number) => {
  const p = 40 * pinch;
  return `M ${CX - 150} 760 V 650 Q ${CX - 150 + p} 590 ${CX - 150} 530 V 490 A 90 90 0 0 1 ${CX - 60} 400 H ${CX + 60} A 90 90 0 0 1 ${CX + 150} 490 V 530 Q ${CX + 150 - p} 590 ${CX + 150} 650 V 760 Z`;
};

const Lungs: React.FC<{ s: number; glow?: number; draw?: number }> = ({ s, glow = 0, draw }) => (
  <>
    <Glow cx={CX} cy={590} r={240} o={glow} id="lungGlow" />
    {draw === undefined ? (
      <>
        <path d={AIRWAY} strokeWidth={W} />
        <path d={lobe(CX - 85, s)} strokeWidth={W} />
        <path d={lobe(CX + 85, s)} strokeWidth={W} />
      </>
    ) : (
      <>
        <DrawPath d={AIRWAY} delay={draw} duration={10} strokeWidth={W} />
        <DrawPath d={lobe(CX - 85, s)} delay={draw + 6} duration={14} strokeWidth={W} />
        <DrawPath d={lobe(CX + 85, s)} delay={draw + 6} duration={14} strokeWidth={W} />
      </>
    )}
  </>
);

/** Head, neck and the bust outline (chest pinched by `pinch`). */
const Body: React.FC<{ pinch?: number; draw?: boolean }> = ({ pinch = 0, draw = false }) => {
  const [h, neck] = bust();
  const parts = [h, neck, torso(pinch)];
  return (
    <>
      {parts.map((d, i) => (draw ? <DrawPath key={i} d={d} delay={i * 4} duration={16} strokeWidth={W} /> : <path key={i} d={d} strokeWidth={W} />))}
    </>
  );
};

/** Anxiety squeezes the chest and won't let you think straight. */
const Pecho: React.FC = () => {
  const { f } = useScene();
  const [ans, pec, pen] = [useMark(0), useMark(1), useMark(2)];
  const squeeze = ramp(f, pec - 4, 10);
  return (
    <>
      <Body pinch={squeeze} draw />
      <Lungs s={1 - 0.3 * squeeze} draw={ans - 8} />
      <Glow cx={CX} cy={590} r={140} o={0.5 * squeeze} id="tightGlow" />
      {f > pen - 2 ? <path d={tangle(Math.max(0, f - pen) * 0.25)} strokeWidth={STROKE_THIN} opacity={ramp(f, pen - 2, 6)} /> : null}
    </>
  );
};

/** Short, fast breaths without noticing: the lungs flutter, small and quick. */
const Corto: React.FC = () => {
  const { f } = useScene();
  const [res, cor] = [useMark(0), useMark(1)];
  const fast = f > res ? 0.5 + 0.5 * Math.sin(((f - res) / 9) * Math.PI * 2) : 0;
  const s = 0.82 + 0.1 * fast * ramp(f, res, 6);
  return (
    <>
      <Body draw />
      <Lungs s={s} glow={0.15 * fast * ramp(f, cor, 6)} />
    </>
  );
};

/** And that keeps the body on alert: a spring pulled tight across the shoulders, the body trembling. */
const Alerta: React.FC = () => {
  const { f } = useScene();
  const [man, ale] = [useMark(0), useMark(1)];
  const tense = ramp(f, man - 2, 8);
  const shake = tense * (Math.sin(f * 2.3) * 2 + Math.sin(f * 3.7) * 1.5);
  return (
    <>
      <g transform={`translate(${shake} 0)`}>
        <Body />
      </g>
      {tense > 0 ? <path d={spring(f, tense)} strokeWidth={STROKE_THIN * 1.2} opacity={tense} /> : null}
      <Glow cx={CX} cy={540} r={220} o={0.35 * ramp(f, ale - 2, 8)} id="alertGlow" />
    </>
  );
};

/* ------------------------------------------------------ head, air, counts */

const H = { x: 330, y: 400, r: 130 };
const NOSE = { x: H.x + 1.3 * H.r, y: H.y + 0.55 * H.r };
const MOUTH = { x: H.x + 1.06 * H.r, y: H.y + 0.9 * H.r };

/** Arrow touching the face: into the nose (in) or out from the mouth (out). */
const airArrow = (inward: boolean, len: number, fromAbove = false) => {
  if (inward && fromAbove) {
    const tx = NOSE.x + 8;
    const ty = NOSE.y - 4;
    const sx = tx + len;
    const sy = ty - len * 0.45;
    const ang = Math.atan2(ty - sy, tx - sx);
    const L = 24;
    return `M ${sx} ${sy} L ${tx} ${ty} M ${tx - L * Math.cos(ang - 0.5)} ${ty - L * Math.sin(ang - 0.5)} L ${tx} ${ty} L ${tx - L * Math.cos(ang + 0.5)} ${ty - L * Math.sin(ang + 0.5)}`;
  }
  if (inward) {
    // aimed at the underside of the nose, coming from below so it never crosses the face
    const tx = NOSE.x - 13;
    const ty = NOSE.y + 6;
    const sx = tx + len;
    const sy = ty + len * 0.3;
    const ang = Math.atan2(ty - sy, tx - sx);
    const L = 26;
    return `M ${sx} ${sy} L ${tx} ${ty} M ${tx - L * Math.cos(ang - 0.5)} ${ty - L * Math.sin(ang - 0.5)} L ${tx} ${ty} L ${tx - L * Math.cos(ang + 0.5)} ${ty - L * Math.sin(ang + 0.5)}`;
  }
  const ex = MOUTH.x + len;
  return `M ${MOUTH.x} ${MOUTH.y} H ${ex} M ${ex - 26} ${MOUTH.y - 18} L ${ex} ${MOUTH.y} L ${ex - 26} ${MOUTH.y + 18}`;
};

/** The way out is in how you breathe out: a long bright exhale, a short dim inhale. */
const Salida: React.FC = () => {
  const { f } = useScene();
  const [, exh, inh] = [useMark(0), useMark(1), useMark(2)];
  const out = ramp(f, exh - 4, 12);
  const dim = 1 - 0.6 * ramp(f, inh + 10, 10);
  return (
    <>
      <DrawPath d={head(H.x, H.y, H.r)} duration={18} />
      {out > 0 ? (
        <g opacity={out}>
          <path d={airArrow(false, 60 + 300 * out)} strokeWidth={STROKE * 1.2} />
          <Glow cx={MOUTH.x + 200} cy={MOUTH.y} r={170} o={0.5} id="exGlow" />
        </g>
      ) : null}
      {f > inh - 4 ? <path d={airArrow(true, 150, true)} strokeWidth={STROKE_THIN} strokeDasharray="8 10" opacity={ramp(f, inh - 4, 8) * dim} /> : null}
    </>
  );
};

/** A capsule split into n cells that fill one by one. */
const Counter: React.FC<{ n: number; k: number; on: number; y?: number; x0?: number; x1?: number; id?: string; bright?: boolean }> = ({ n, k, on, y = 860, x0 = 260, x1 = 820, id, bright = false }) => {
  const h = 56;
  const r = h / 2;
  const cw = (x1 - x0) / n;
  return (
    <g opacity={on}>
      <defs>
        <clipPath id={id ?? `cnt${n}`}>
          <path d={`M ${x0 + r} ${y - r} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y + r} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y - r} Z`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id ?? `cnt${n}`})`}>
        {new Array(n).fill(0).map((_, i) => {
          const o = Math.max(0, Math.min(1, k * n - i));
          return o > 0 ? <rect key={i} x={x0 + i * cw} y={y - r} width={cw} height={h} fill={INK} stroke="none" opacity={(bright ? 0.7 : 0.4) * o} /> : null;
        })}
        {new Array(n - 1).fill(0).map((_, i) => (
          <path key={i} d={`M ${x0 + (i + 1) * cw} ${y - r} V ${y + r}`} strokeWidth={STROKE_THIN} />
        ))}
      </g>
      <path d={`M ${x0 + r} ${y - r} H ${x1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y + r} H ${x0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y - r} Z`} strokeWidth={W} />
    </g>
  );
};

/** Breathe in through the nose counting to four. */
const Inhala: React.FC = () => {
  const { f, dur } = useScene();
  const [inh, nar, con] = [useMark(0), useMark(1), useMark(2)];
  const k = interpolate(f, [inh, dur - 2], [0, 1], clamp);
  return (
    <>
      <DrawPath d={head(H.x, H.y - 60, H.r)} duration={16} />
      {f > nar - 6 ? (
        <g transform="translate(0 -60)" opacity={ramp(f, nar - 6, 6)}>
          <path d={airArrow(true, 60 + 140 * ramp(f, nar - 6, 14))} strokeWidth={STROKE * 1.1} />
        </g>
      ) : null}
      <Counter n={4} k={k} on={ramp(f, Math.min(inh, con) - 6, 8)} y={780} />
    </>
  );
};

/** Let the air out through the mouth slowly, as if blowing on a candle without putting it out, counting to eight. */
const Vela: React.FC = () => {
  const { f, dur } = useScene();
  const [sol, boc, sop] = [useMark(0), useMark(1), useMark(2)];
  const hy = H.y - 60;
  const my = MOUTH.y - 60;
  const k = interpolate(f, [sol, dur - 2], [0, 1], clamp);
  const blow = ramp(f, sop - 4, 10);
  const cx = 800;
  const top = 600;
  const lean = 16 * blow * (0.8 + 0.2 * Math.sin(f / 3));
  const flame = `M ${cx} ${top - 14} C ${cx - 22} ${top - 30} ${cx - 16 + lean} ${top - 60} ${cx + lean * 1.6} ${top - 92} C ${cx + 16 + lean} ${top - 60} ${cx + 22} ${top - 30} ${cx} ${top - 14} Z`;
  const reach = ramp(f, boc - 4, 14);
  // the breath: a soft wavy line from the lips to the flame
  const pts = new Array(13).fill(0).map((_, i) => {
    const t = (i / 12) * reach;
    const x = MOUTH.x + (cx - 24 - MOUTH.x) * t;
    const y = my + (top - 50 - my) * t + (i === 0 || i === 12 ? 0 : Math.sin(i * 1.4 - f / 3) * 6);
    return [x, y];
  });
  return (
    <>
      <path d={head(H.x, hy, H.r)} strokeWidth={STROKE} />
      <DrawPath d={`M ${cx - 40} 760 V ${top} H ${cx + 40} V 760 Z`} duration={12} strokeWidth={W} />
      <DrawPath d={`M ${cx} ${top} V ${top - 14}`} delay={8} duration={4} strokeWidth={STROKE_THIN} />
      <g opacity={ramp(f, 8, 6)}>
        <Glow cx={cx + lean} cy={top - 50} r={90} o={0.8 - 0.25 * blow} id="flameGlow" />
        <path d={flame} strokeWidth={W} fill={INK} fillOpacity={0.25} />
      </g>
      {reach > 0 ? <path d={poly(pts, false)} strokeWidth={STROKE_THIN * 1.2} opacity={0.9} /> : null}
      <Counter n={8} k={k} on={ramp(f, sol - 6, 8)} y={860} />
    </>
  );
};

/** Repeat six times: six beads round a ring light up in turn. */
const Seis: React.FC = () => {
  const { f, dur } = useScene();
  const m = useMark(0);
  const k = interpolate(f, [Math.max(0, m - 10), dur - 2], [0, 6], clamp);
  const R = 200;
  return (
    <>
      <DrawPath d={circlePath(CX, 520, R)} duration={10} strokeWidth={W} />
      {new Array(6).fill(0).map((_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
        const lit = Math.max(0, Math.min(1, k - i));
        const x = CX + Math.cos(a) * R;
        const y = 520 + Math.sin(a) * R;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={22} fill={BG} stroke={INK} strokeWidth={W} opacity={ramp(f, 2 + i, 4)} />
            {lit > 0 ? <circle cx={x} cy={y} r={14 * lit} fill={INK} stroke="none" /> : null}
          </g>
        );
      })}
    </>
  );
};

/** When the exhale lasts longer than the inhale: the 8 count, long and bright, over the 4 count. */
const Mas: React.FC = () => {
  const { f } = useScene();
  const [exh, inh] = [useMark(0), useMark(1)];
  // both outlines are there from the start, dim; each lights on its word
  const e = 0.35 + 0.65 * ramp(f, exh - 6, 8);
  const i = 0.35 + 0.65 * ramp(f, inh - 6, 8);
  const cell = 70;
  const x0 = 260;
  return (
    <>
      <Counter n={8} k={interpolate(f, [exh - 4, exh + 20], [0, 1], clamp)} on={e} y={440} x0={x0} x1={x0 + 8 * cell} id="mas8" bright />
      <Glow cx={x0 + 4 * cell} cy={440} r={300} o={0.45 * ramp(f, exh - 6, 8)} id="longGlow" />
      <Counter n={4} k={interpolate(f, [inh - 4, inh + 10], [0, 1], clamp)} on={0.7 * i} y={600} x0={x0} x1={x0 + 4 * cell} id="mas4" />
    </>
  );
};

/** The body's natural brake kicks in: a gauge whose needle drops. */
const Freno2: React.FC = () => {
  const { f, fps } = useScene();
  const [act, fre] = [useMark(0), useMark(1)];
  const cy = 640;
  const R = 260;
  const drop = springAnim({ frame: f - fre, fps, config: { damping: 16, stiffness: 90 } });
  const a = Math.PI + Math.PI * (0.82 - 0.66 * drop) * ramp(f, act - 6, 8);
  const tip = [CX + Math.cos(a) * (R - 40), cy + Math.sin(a) * (R - 40)];
  return (
    <>
      <DrawPath d={`M ${CX - R} ${cy} A ${R} ${R} 0 0 1 ${CX + R} ${cy} Z`} duration={14} strokeWidth={W} />
      {new Array(7).fill(0).map((_, i) => {
        const t = Math.PI + (i * Math.PI) / 6;
        return <path key={i} d={`M ${CX + Math.cos(t) * R} ${cy + Math.sin(t) * R} L ${CX + Math.cos(t) * (R - 28)} ${cy + Math.sin(t) * (R - 28)}`} strokeWidth={STROKE_THIN} opacity={ramp(f, 6 + i, 4)} />;
      })}
      <path d={`M ${CX} ${cy} L ${tip[0]} ${tip[1]}`} strokeWidth={STROKE * 1.2} opacity={ramp(f, 8, 6)} />
      <circle cx={CX} cy={cy} r={16} fill={INK} stroke="none" opacity={ramp(f, 8, 6)} />
      <Glow cx={CX} cy={cy - 60} r={260} o={0.45 * ramp(f, fre, 14)} id="brakeGlow" />
    </>
  );
};

/** The heart slows down in seconds: it beats, and the beats spread out. */
const Corazon: React.FC = () => {
  const { f } = useScene();
  const [cor, baj] = [useMark(0), useMark(1)];
  // beat phase: every 12 frames, stretching to every 30 after "baja"
  let ph = 0;
  for (let i = 0; i < f; i++) {
    ph += 1 / interpolate(i, [baj, baj + 30], [12, 30], clamp);
  }
  const beat = Math.exp(-((ph % 1) * 8)) * ramp(f, cor - 4, 6);
  const s = 1 + 0.08 * beat;
  const d = `M ${CX} 690 C ${CX - 60} 640 ${CX - 200} 570 ${CX - 200} 470 C ${CX - 200} 400 ${CX - 140} 360 ${CX - 90} 360 C ${CX - 50} 360 ${CX - 15} 385 ${CX} 420 C ${CX + 15} 385 ${CX + 50} 360 ${CX + 90} 360 C ${CX + 140} 360 ${CX + 200} 400 ${CX + 200} 470 C ${CX + 200} 570 ${CX + 60} 640 ${CX} 690 Z`;
  return (
    <g style={{ transform: `scale(${s})`, transformOrigin: `${CX}px 520px`, transformBox: "view-box" }}>
      <Glow cx={CX} cy={510} r={260} o={0.25 + 0.5 * beat} id="heartGlow" />
      <DrawPath d={d} duration={16} strokeWidth={STROKE} />
    </g>
  );
};

/** One of the techniques with the most scientific backing: a paper and a check. */
const Respaldo: React.FC = () => {
  const { f } = useScene();
  const [tec, res, cie, exi] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const x0 = 390;
  const x1 = 670;
  const y0 = 280;
  const y1 = 700;
  return (
    <>
      <DrawPath d={`M ${x0} ${y0} H ${x1 - 60} L ${x1} ${y0 + 60} V ${y1} H ${x0} Z M ${x1 - 60} ${y0} V ${y0 + 60} H ${x1}`} delay={Math.max(0, tec - 10)} duration={16} strokeWidth={W} />
      {[0, 1, 2, 3].map((i) => (
        <DrawPath key={i} d={`M ${x0 + 40} ${y0 + 120 + i * 60} H ${x1 - 40 - (i === 3 ? 80 : 0)}`} delay={res - 6 + i * 3} duration={8} strokeWidth={STROKE_THIN} />
      ))}
      <DrawPath d={circlePath(x1, y1, 70)} delay={cie - 4} duration={10} strokeWidth={STROKE} occlude />
      <DrawPath d={`M ${x1 - 30} ${y1 + 2} L ${x1 - 8} ${y1 + 26} L ${x1 + 34} ${y1 - 24}`} delay={cie + 4} duration={8} strokeWidth={STROKE * 1.2} />
      <Glow cx={x1} cy={y1} r={170} o={0.6 * ramp(f, exi - 2, 10)} id="chkGlow" />
    </>
  );
};

/** You're not weak for feeling this: a figure standing on the ground, lit and steady. */
const Debil: React.FC = () => {
  const { f } = useScene();
  const [deb, sen] = [useMark(0), useMark(1)];
  const y = 560;
  const kk = 3.4;
  const base = y + 34 * kk;
  return (
    <>
      <DrawPath d={person(CX, y, kk)} duration={Math.max(10, deb)} strokeWidth={W} />
      <DrawPath d={`M 220 ${base} H 860`} duration={10} strokeWidth={W} />
      <Glow cx={CX} cy={y - 40} r={240} o={0.55 * ramp(f, sen - 2, 10)} id="steadyGlow" />
    </>
  );
};

/** Your body learns: each slow breath, the lungs fill and empty, and the glow settles. */
const Aprende: React.FC = () => {
  const { f } = useScene();
  const [cue, apr, res] = [useMark(0), useMark(1), useMark(2)];
  // slow cycle: in over a third, out over two thirds (4 in, 8 out)
  const T = 42;
  const t = (Math.max(0, f - res + 6) % T) / T;
  const fill = f > res - 6 ? (t < 1 / 3 ? t * 3 : 1 - (t - 1 / 3) * 1.5) : 0.4;
  return (
    <>
      <Body />
      <Lungs s={0.85 + 0.18 * fill} glow={0.15 * ramp(f, cue, 8) + 0.3 * ramp(f, apr, 12) * (0.5 + 0.5 * fill)} />
    </>
  );
};

/* ------------------------------------------------------------- composition */

export type ExhalaProps = { scenes?: ImpulsoScene[]; seconds?: number };

const ART: React.FC[] = [Pecho, Freno, Corto, Alerta, Salida, Inhala, Vela, Seis, Candado, Mas, Freno2, Corazon, Respaldo, Debil, Aprende, Salvo, Pildora];

export const EXHALA_SECONDS = 44.117;
export const EXHALA_FRAMES = Math.round(EXHALA_SECONDS * FPS);

export const Exhala: React.FC<ExhalaProps> = ({ scenes = [] }) => <MarkedReel scenes={scenes} art={ART} />;
