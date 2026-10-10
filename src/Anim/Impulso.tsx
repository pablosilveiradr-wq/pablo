import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useVideoConfig } from "remotion";
import { circlePath, DrawPath } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Glow, poly, rnd, Shot, useScene } from "./Invisible";

/**
 * "Impulso": animation to lay over Pablo's own reel about stopping thinking
 * of someone (intermittent reinforcement, dopamine). 1:1, no text, on the
 * ORIGINAL timeline of his video (no speed-up), so every scene lands on its
 * line and each detail on its word. Word cues per scene come in `marks`
 * (seconds from the scene start).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const CY = 520;

export const MarksContext = React.createContext<number[]>([]);
/** Frame (scene-local) of the i-th word cue. */
export const useMark = (i: number) => {
  const marks = React.useContext(MarksContext);
  const { fps } = useScene();
  return Math.round((marks[i] ?? 0) * fps);
};
export const ramp = (f: number, at: number, len = 8) => interpolate(f, [at, at + len], [0, 1], clamp);

/** Icon-style head in profile looking right. */
export const head = (cx: number, cy: number, r: number) => {
  const P = (kx: number, ky: number) => `${(cx + r * kx).toFixed(1)} ${(cy + r * ky).toFixed(1)}`;
  return `M ${P(-0.42, 2.0)} L ${P(-0.5, 0.866)} A ${r} ${r} 0 1 1 ${P(1, 0)} L ${P(1.3, 0.55)} L ${P(1.06, 0.62)} L ${P(1.06, 1.16)} L ${P(0.62, 1.36)} L ${P(0.62, 2.0)}`;
};
export const person = (x: number, y: number, k = 1) =>
  `${circlePath(x, y - 34 * k, 22 * k)} M ${x - 40 * k} ${y + 34 * k} A ${40 * k} ${40 * k} 0 0 1 ${x + 40 * k} ${y + 34 * k}`;
/** Arrowhead at angle e (rad) of a circle drawn clockwise: points along the turn, on the line. */
export const arcHead = (cx: number, cy: number, R: number, e: number, L = 34, Wd = 24) => {
  const ex = cx + R * Math.cos(e);
  const ey = cy + R * Math.sin(e);
  const [tx, ty] = [-Math.sin(e), Math.cos(e)];
  const [nx, ny] = [Math.cos(e), Math.sin(e)];
  return `M ${ex - tx * L + nx * Wd} ${ey - ty * L + ny * Wd} L ${ex} ${ey} L ${ex - tx * L - nx * Wd} ${ey - ty * L - ny * Wd}`;
};
export const brain = (x: number, y: number, k = 1) => {
  const P = (dx: number, dy: number) => `${(x + dx * k).toFixed(1)} ${(y + dy * k).toFixed(1)}`;
  return `M ${P(-160, 40)} C ${P(-200, -20)} ${P(-160, -110)} ${P(-90, -120)} C ${P(-70, -170)} ${P(20, -180)} ${P(60, -140)} C ${P(120, -160)} ${P(180, -110)} ${P(170, -50)} C ${P(220, -10)} ${P(190, 70)} ${P(130, 70)} C ${P(110, 110)} ${P(40, 120)} ${P(10, 90)} C ${P(-30, 120)} ${P(-110, 110)} ${P(-120, 75)} C ${P(-150, 80)} ${P(-170, 65)} ${P(-160, 40)} Z M ${P(-90, -120)} C ${P(-60, -80)} ${P(-80, -40)} ${P(-40, -20)} M ${P(60, -140)} C ${P(40, -90)} ${P(80, -60)} ${P(60, -10)} M ${P(-120, 20)} C ${P(-60, 30)} ${P(-30, 0)} ${P(10, 30)} M ${P(170, -50)} C ${P(120, -30)} ${P(110, 20)} ${P(130, 70)}`;
};
const phone = (x: number, y: number) =>
  `M ${x - 60} ${y - 120} h 120 a 22 22 0 0 1 22 22 v 196 a 22 22 0 0 1 -22 22 h -120 a 22 22 0 0 1 -22 -22 v -196 a 22 22 0 0 1 22 -22 Z M ${x - 16} ${y - 104} h 32`;
const bolt = (x: number, y: number, k = 1) => poly([[x + 10 * k, y - 70 * k], [x - 30 * k, y + 8 * k], [x - 2 * k, y + 8 * k], [x - 12 * k, y + 70 * k], [x + 30 * k, y - 10 * k], [x + 2 * k, y - 10 * k]]);

/* ------------------------------------------------------------------ scenes */

/** The person you can't forget: a thought bubble that keeps bringing them back. */
const Persona: React.FC = () => {
  const { f } = useScene();
  const m = useMark(0);
  const loop = f > m ? 0.55 + 0.45 * Math.cos(((f - m) / 22) * Math.PI * 2) : 0;
  return (
    <>
      <DrawPath d={head(370, 450, 120)} duration={22} />
      <DrawPath d={circlePath(560, 350, 12)} delay={12} duration={6} strokeWidth={STROKE_THIN} />
      <DrawPath d={circlePath(610, 300, 18)} delay={14} duration={6} strokeWidth={STROKE_THIN} />
      <DrawPath d={circlePath(740, 260, 120)} delay={16} duration={16} strokeWidth={STROKE_THIN * 1.3} />
      {f > m ? (
        <g opacity={ramp(f, m) * loop}>
          <path d={person(740, 270, 1.1)} strokeWidth={STROKE_THIN * 1.3} />
        </g>
      ) : null}
      <Glow cx={740} cy={260} r={180} o={f > m ? 0.5 * loop : 0} id="perGlow" />
    </>
  );
};

/** As a chemist: a flask; then the brain. */
const Quimico: React.FC = () => {
  const { f } = useScene();
  const m1 = useMark(1);
  const flask = 1 - ramp(f, m1 - 4, 8);
  const br = ramp(f, m1, 10);
  return (
    <>
      {flask > 0 ? (
        <g opacity={flask}>
          <DrawPath d={`M 500 260 V 380 L 400 600 Q 395 615 410 615 H 670 Q 685 615 680 600 L 580 380 V 260 M 486 260 H 594`} duration={18} />
          <path d="M 446 520 H 634" strokeWidth={STROKE_THIN} opacity={0.7} />
          {[0, 1, 2, 3].map((i) => {
            const y = 590 - (((f * 2.2 + i * 22) % 80));
            return <path key={i} d={circlePath(500 + i * 26, y, 6 + (i % 2) * 3)} strokeWidth={STROKE_THIN} opacity={0.8} />;
          })}
        </g>
      ) : null}
      {br > 0 ? (
        <g opacity={br}>
          <Glow cx={CX} cy={CY - 30} r={260} o={0.6} id="brainGlow1" />
          <path d={brain(CX, CY + 20, 1.15)} strokeWidth={STROKE_THIN * 1.3} />
        </g>
      ) : null}
    </>
  );
};

/** How to stop the loop: an arrow spinning round the brain that slows to a halt. */
const Loop: React.FC = () => {
  const { f, dur } = useScene();
  const m0 = useMark(0);
  let ang = 0;
  for (let i = 0; i < f; i++) {
    ang += i < m0 ? 9 : interpolate(i, [m0, dur * 0.95], [9, 0], clamp);
  }
  const R = 250;
  return (
    <>
      <path d={brain(CX, CY + 10, 0.8)} strokeWidth={STROKE_THIN} opacity={0.6} />
      <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}>
        <path d={`M ${CX + R} ${CY} A ${R} ${R} 0 1 1 ${CX + R * Math.cos(-0.5)} ${CY + R * Math.sin(-0.5)}`} strokeWidth={STROKE * 1.2} />
        <path d={arcHead(CX, CY, R, -0.5)} strokeWidth={STROKE * 1.2} />
      </g>
    </>
  );
};

/** Thinking, checking, waiting: three icons, each on its word. */
const Pensar: React.FC = () => {
  const { f } = useScene();
  const [a, b, c] = [useMark(0), useMark(1), useMark(2)];
  // dim from the start, lit on its word
  const lit = (m: number) => 0.2 * ramp(f, 0, 8) + 0.8 * ramp(f, m - 2);
  return (
    <>
      <g opacity={lit(a)}>
        <path d="M 210 520 H 350 A 30 30 0 0 0 346 462 A 46 46 0 0 0 268 444 A 36 36 0 0 0 222 470 A 26 26 0 0 0 210 520 Z" strokeWidth={STROKE_THIN * 1.3} />
        <path d={circlePath(240, 556, 10)} strokeWidth={STROKE_THIN} />
        <path d={circlePath(222, 584, 6)} strokeWidth={STROKE_THIN} />
      </g>
      <g opacity={lit(b)}>
        <path d={phone(540, 520)} strokeWidth={STROKE_THIN * 1.3} />
        <g style={{ transform: `rotate(${f * 8}deg)`, transformOrigin: "540px 520px", transformBox: "view-box" }}>
          <path d="M 570 520 A 30 30 0 1 1 560 498" strokeWidth={STROKE_THIN * 1.3} />
          <path d="M 548 494 L 562 497 L 562 482" strokeWidth={STROKE_THIN * 1.3} />
        </g>
      </g>
      <g opacity={lit(c)}>
        <path d="M 770 420 H 870 M 770 620 H 870 M 780 420 C 780 490 860 490 860 520 C 860 550 780 550 780 620 M 860 420 C 860 490 780 490 780 520 C 780 550 860 550 860 620" strokeWidth={STROKE_THIN * 1.3} />
        <path d={poly([[798, 600], [842, 600], [820, 578]])} fill={INK} stroke="none" opacity={0.8} />
      </g>
    </>
  );
};

/** No control: the three spin faster and faster; on "use this" they collapse into one bright point. */
const Control: React.FC = () => {
  const { f } = useScene();
  const stop = useMark(1);
  const collapse = ramp(f, stop, 10);
  let ang = 0;
  for (let i = 0; i < Math.min(f, stop); i++) {
    ang += 2 + i * 0.25;
  }
  const R = 230 * (1 - collapse);
  return (
    <>
      {[0, 1, 2].map((i) => {
        const a = (ang * Math.PI) / 180 + (i * Math.PI * 2) / 3;
        const x = CX + Math.cos(a) * R;
        const y = CY + Math.sin(a) * R;
        return <path key={i} d={circlePath(x, y, 40 * (1 - collapse) + 4)} strokeWidth={STROKE_THIN * 1.3} opacity={1 - 0.5 * collapse} />;
      })}
      <Glow cx={CX} cy={CY} r={60 + 200 * collapse} o={collapse} id="ctlGlow" />
      {collapse > 0 ? <circle cx={CX} cy={CY} r={14 * collapse} fill={INK} stroke="none" /> : null}
      {collapse > 0 ? <path d={circlePath(CX, CY, 40 + 120 * ramp(f, stop + 4, 20))} strokeWidth={STROKE_THIN} opacity={1 - ramp(f, stop + 4, 20)} /> : null}
    </>
  );
};

/** The first impulse: a spark, the phone, a message arriving. */
const Celular: React.FC = () => {
  const { f } = useScene();
  const [imp, cel, esc] = [useMark(0), useMark(1), useMark(2)];
  const pulse = f > imp ? 0.8 + 0.2 * Math.sin((f - imp) / 3) : 1;
  // dim from the start, lit on its word
  const lit = (m: number) => 0.2 * ramp(f, 0, 8) + 0.8 * ramp(f, m - 2);
  return (
    <>
      <g opacity={lit(imp) * pulse}>
        <path d={bolt(320, 500, 1.3)} strokeWidth={STROKE_THIN * 1.3} />
      </g>
      <Glow cx={320} cy={500} r={140} o={ramp(f, imp) * 0.6} id="boltGlow" />
      <path d={phone(660, 520)} strokeWidth={STROKE_THIN * 1.3} opacity={lit(cel)} />
      <g opacity={ramp(f, cel - 2)}>
        <path d={`M 400 500 L ${400 + 150 * ramp(f, cel, 12)} 500`} strokeWidth={STROKE_THIN} strokeDasharray="6 10" />
      </g>
      {f > esc ? (
        <g opacity={ramp(f, esc - 2, 6)} style={{ transform: `scale(${spring({ frame: f - esc, fps: FPS, config: { damping: 10, stiffness: 160 } })})`, transformOrigin: "660px 450px", transformBox: "view-box" }}>
          <path d="M 610 420 h 100 a 14 14 0 0 1 14 14 v 30 a 14 14 0 0 1 -14 14 h -70 l -18 16 v -16 h -12 a 14 14 0 0 1 -14 -14 v -30 a 14 14 0 0 1 14 -14 Z" strokeWidth={STROKE_THIN * 1.2} />
          {[-24, 0, 24].map((dx) => (
            <circle key={dx} cx={660 + dx} cy={449} r={5} fill={INK} stroke="none" />
          ))}
        </g>
      ) : null}
    </>
  );
};

/** Do nothing, 30 seconds, don't move: the phone sits still while a ring fills round it. */
const Treinta: React.FC = () => {
  const { f, dur } = useScene();
  const [nada, t30] = [useMark(0), useMark(1)];
  const k = interpolate(f, [t30, dur * 0.97], [0, 1], clamp);
  const R = 220;
  const a = -Math.PI / 2 + k * Math.PI * 2;
  const dim = 1 - 0.4 * ramp(f, nada, 12);
  return (
    <>
      <g opacity={dim}>
        <path d={phone(CX, CY)} strokeWidth={STROKE_THIN * 1.3} />
      </g>
      <DrawPath d={circlePath(CX, CY, R)} duration={14} strokeWidth={STROKE_THIN} opacity={0.4} />
      {k > 0 ? <path d={`M ${CX} ${CY - R} A ${R} ${R} 0 ${k > 0.5 ? 1 : 0} 1 ${CX + Math.cos(a) * R} ${CY + Math.sin(a) * R}`} strokeWidth={STROKE * 1.3} /> : null}
      {k > 0 ? <circle cx={CX + Math.cos(a) * R} cy={CY + Math.sin(a) * R} r={9} fill={INK} stroke="none" /> : null}
    </>
  );
};

/** Intermittent reinforcement: a network whose nodes light up at random. */
const Refuerzo: React.FC = () => {
  const { f } = useScene();
  const [imp, ref] = [useMark(0), useMark(1)];
  const nodes = new Array(14).fill(0).map((_, i) => {
    const a = (i / 14) * Math.PI * 2 + rnd(i) * 0.4;
    const r = 120 + rnd(i + 20) * 150;
    return [CX + Math.cos(a) * r, CY + Math.sin(a) * r * 0.85];
  });
  const links: number[][] = [];
  nodes.forEach((p, i) => nodes.forEach((q, j) => j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 190 && links.push([i, j])));
  return (
    <>
      {/* the "important" mark */}
      <g opacity={ramp(f, imp - 2) * (1 - ramp(f, ref - 6, 8))}>
        <path d={circlePath(CX, CY, 70)} strokeWidth={STROKE_THIN * 1.3} />
        <path d={`M ${CX} ${CY - 36} V ${CY + 10}`} strokeWidth={STROKE * 1.4} />
        <circle cx={CX} cy={CY + 34} r={7} fill={INK} stroke="none" />
      </g>
      <g opacity={ramp(f, ref - 4, 10)}>
        {links.map(([i, j], k) => (
          <path key={k} d={`M ${nodes[i][0]} ${nodes[i][1]} L ${nodes[j][0]} ${nodes[j][1]}`} strokeWidth={STROKE_THIN * 0.8} opacity={0.35} />
        ))}
        {nodes.map(([x, y], i) => {
          // on, off, on again at uneven, unpredictable moments
          const on = Math.sin(f * (0.11 + rnd(i + 5) * 0.2) + rnd(i + 9) * 6) > 0.55 ? 1 : 0.15;
          return (
            <g key={i}>
              {on > 0.5 ? <Glow cx={x} cy={y} r={50} o={0.8} id={`nd${i}`} /> : null}
              <circle cx={x} cy={y} r={on > 0.5 ? 10 : 6} fill={INK} stroke="none" opacity={on} />
            </g>
          );
        })}
      </g>
    </>
  );
};

/** Gambling: a slot machine; the reels spin, stop on nothing, spin again. */
const Apuestas: React.FC = () => {
  const { f } = useScene();
  const [ap, gan, jug] = [useMark(0), useMark(1), useMark(2)];
  const spinning = (f > ap && f < gan) || f > jug;
  const lever = (at: number) => interpolate(f, [at, at + 6, at + 14], [0, 1, 0], clamp);
  const pull = Math.max(lever(ap), lever(jug));
  const shapes = [
    (x: number, y: number) => circlePath(x, y, 22),
    (x: number, y: number) => poly([[x, y - 26], [x + 24, y + 18], [x - 24, y + 18]]),
    (x: number, y: number) => `M ${x - 20} ${y - 20} h 40 v 40 h -40 Z`,
    (x: number, y: number) => `M ${x} ${y + 22} C ${x - 40} ${y - 6} ${x - 16} ${y - 34} ${x} ${y - 12} C ${x + 16} ${y - 34} ${x + 40} ${y - 6} ${x} ${y + 22} Z`,
  ];
  const stopAt = [0, 2, 1]; // three different symbols: no win
  return (
    <>
      <DrawPath d="M 330 330 H 750 A 24 24 0 0 1 774 354 V 690 A 24 24 0 0 1 750 714 H 330 A 24 24 0 0 1 306 690 V 354 A 24 24 0 0 1 330 330 Z" duration={16} strokeWidth={STROKE_THIN * 1.3} />
      {[0, 1, 2].map((r) => {
        const x = 400 + r * 140;
        return (
          <g key={r}>
            <path d={`M ${x - 52} 430 h 104 v 140 h -104 Z`} strokeWidth={STROKE_THIN} />
            <defs>
              <clipPath id={`reel${r}`}>
                <rect x={x - 50} y={432} width={100} height={136} />
              </clipPath>
            </defs>
            <g clipPath={`url(#reel${r})`}>
              {spinning
                ? [0, 1, 2].map((k) => {
                    const y = 430 + ((f * (26 + r * 6) + k * 70) % 210) - 35;
                    return <path key={k} d={shapes[(k + r) % 4](x, y)} strokeWidth={STROKE_THIN * 1.2} opacity={0.6} />;
                  })
                : f > ap
                  ? <path d={shapes[stopAt[r]](x, 500)} strokeWidth={STROKE_THIN * 1.4} />
                  : <path d={shapes[3](x, 500)} strokeWidth={STROKE_THIN * 1.2} opacity={0.5} />}
            </g>
          </g>
        );
      })}
      {/* lever */}
      <path d={`M 774 470 H 810 V ${400 + 140 * pull}`} strokeWidth={STROKE_THIN * 1.3} />
      <circle cx={810} cy={380 + 140 * pull} r={20} fill={INK} stroke="none" />
    </>
  );
};

/** Uncertainty → dopamine: a question mark becomes the dopamine molecule, which glows on desire and anticipation. */
const Dopamina: React.FC = () => {
  const { f } = useScene();
  const [inc, dop, des, ant] = [useMark(0), useMark(1), useMark(2), useMark(3)];
  const q = ramp(f, inc - 2) * (1 - ramp(f, dop - 4, 6));
  const mol = ramp(f, dop, 10);
  const glow = Math.max(interpolate(f, [des, des + 6, des + 24], [0, 1, 0.4], clamp), interpolate(f, [ant, ant + 6, ant + 30], [0, 1, 0.6], clamp));
  // benzene ring with two OH, a two-carbon chain and the amine
  const R = 80;
  const rc = [430, 540];
  const v = new Array(6).fill(0).map((_, i) => [rc[0] + Math.cos((i * Math.PI) / 3 - Math.PI / 6) * R, rc[1] + Math.sin((i * Math.PI) / 3 - Math.PI / 6) * R]);
  return (
    <>
      {q > 0 ? (
        <g opacity={q}>
          <path d={`M ${CX - 70} ${CY - 90} C ${CX - 70} ${CY - 190} ${CX + 80} ${CY - 194} ${CX + 76} ${CY - 84} C ${CX + 72} ${CY - 20} ${CX} ${CY - 14} ${CX} ${CY + 50}`} strokeWidth={STROKE * 1.6} />
          <circle cx={CX} cy={CY + 120} r={14} fill={INK} stroke="none" />
        </g>
      ) : null}
      {mol > 0 ? (
        <g opacity={mol}>
          <Glow cx={520} cy={520} r={320} o={0.25 + 0.6 * glow} id="dopGlow" />
          <path d={poly(v)} strokeWidth={STROKE_THIN * 1.4} />
          <path d={circlePath(rc[0], rc[1], R * 0.6)} strokeWidth={STROKE_THIN} />
          {/* OH groups on two neighbouring corners */}
          <path d={`M ${v[3][0]} ${v[3][1]} L ${v[3][0] - 70} ${v[3][1] + 40}`} strokeWidth={STROKE_THIN * 1.4} />
          <path d={`M ${v[4][0]} ${v[4][1]} L ${v[4][0] - 30} ${v[4][1] - 74}`} strokeWidth={STROKE_THIN * 1.4} />
          <path d={circlePath(v[3][0] - 84, v[3][1] + 48, 14)} strokeWidth={STROKE_THIN * 1.2} />
          <path d={circlePath(v[4][0] - 36, v[4][1] - 90, 14)} strokeWidth={STROKE_THIN * 1.2} />
          {/* the chain to the amine */}
          <path d={`M ${v[0][0]} ${v[0][1]} L ${v[0][0] + 80} ${v[0][1] - 46} L ${v[0][0] + 160} ${v[0][1]} L ${v[0][0] + 240} ${v[0][1] - 46}`} strokeWidth={STROKE_THIN * 1.4} />
          <circle cx={v[0][0] + 256} cy={v[0][1] - 56} r={16 + 6 * glow} fill={INK} stroke="none" />
        </g>
      ) : null}
    </>
  );
};

/** So you always come back: a point goes round and returns to where it started. */
const Volves: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [2, dur * 0.9], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const R = 200;
  const a = Math.PI / 2 + k * Math.PI * 2;
  return (
    <>
      <path d={circlePath(CX, CY, R)} strokeWidth={STROKE_THIN} opacity={0.35} />
      {k > 0 ? <path d={`M ${CX} ${CY + R} A ${R} ${R} 0 ${k > 0.5 ? 1 : 0} 1 ${CX + Math.cos(a) * R} ${CY + Math.sin(a) * R}`} strokeWidth={STROKE * 1.3} /> : null}
      <circle cx={CX} cy={CY + R} r={10} fill={INK} stroke="none" />
      <circle cx={CX + Math.cos(a) * R} cy={CY + Math.sin(a) * R} r={12} fill={INK} stroke="none" />
    </>
  );
};

/** The habit as a groove: every time you answer, it gets deeper and brighter. */
const Surco: React.FC<{ weaken?: boolean }> = ({ weaken = false }) => {
  const { f } = useScene();
  const [m0, m1] = [useMark(0), useMark(1)];
  const d = `M 230 640 C 360 640 380 420 540 420 C 700 420 720 640 850 640`;
  // strengthen: on "impulso" an impulse runs along it, on "gana" it thickens
  const thick = weaken ? 1 - 0.85 * ramp(f, m0, Math.max(10, m1 - m0)) : 0.35 + 0.65 * ramp(f, m1, 12);
  const run = weaken ? -1 : interpolate(f, [m0, m0 + 18], [0, 1], clamp);
  return (
    <>
      <Glow cx={CX} cy={480} r={330} o={0.6 * thick} id={weaken ? "surW" : "surS"} />
      <path d={d} strokeWidth={STROKE_THIN + STROKE * 3 * thick} opacity={0.35 + 0.65 * thick} strokeDasharray={weaken && thick < 0.4 ? "6 14" : undefined} />
      {run >= 0 && run < 1 && f > m0 ? (
        <circle
          cx={interpolate(run, [0, 0.5, 1], [230, 540, 850])}
          cy={interpolate(run, [0, 0.25, 0.5, 0.75, 1], [640, 500, 420, 500, 640])}
          r={12}
          fill={INK}
          stroke="none"
        />
      ) : null}
    </>
  );
};
const Gana: React.FC = () => <Surco />;
const Debilita: React.FC = () => <Surco weaken />;

/** You don't miss the person, you miss what your brain expects to feel. */
const Esperar: React.FC = () => {
  const { f } = useScene();
  const [per, ext, sen] = [useMark(0), useMark(1), useMark(2)];
  const fade = 1 - ramp(f, ext - 2, 14);
  const inside = ramp(f, ext, 12);
  const feel = interpolate(f, [sen, sen + 8, sen + 40], [0, 1, 0.6], clamp);
  return (
    <>
      <g opacity={ramp(f, per - 4) * fade}>
        <path d={person(300, 520, 1.6)} strokeWidth={STROKE_THIN * 1.3} strokeDasharray="6 10" />
      </g>
      <DrawPath d={head(520, 400, 130)} duration={20} />
      <g opacity={inside}>
        <Glow cx={510} cy={390} r={120 + 80 * feel} o={0.5 + 0.5 * feel} id="feelGlow" />
        <path d={poly(new Array(6).fill(0).map((_, i) => [510 + Math.cos((i * Math.PI) / 3) * 40, 390 + Math.sin((i * Math.PI) / 3) * 40]))} strokeWidth={STROKE_THIN * 1.3} />
        <circle cx={510} cy={390} r={8 + 6 * feel} fill={INK} stroke="none" />
      </g>
    </>
  );
};

/** See you in the next pill. */
export const Pildora: React.FC = () => {
  const { f, fps } = useScene();
  const m = useMark(0);
  const s = spring({ frame: f - Math.max(0, m - 8), fps, config: { damping: 11, stiffness: 120 } });
  return (
    <g style={{ transform: `rotate(-35deg) scale(${0.6 + 0.4 * s})`, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}>
      <Glow cx={CX} cy={CY} r={260} o={s} id="pillGlow" />
      <path d={`M ${CX - 160} ${CY} A 70 70 0 0 1 ${CX - 90} ${CY - 70} H ${CX + 90} A 70 70 0 0 1 ${CX + 90} ${CY + 70} H ${CX - 90} A 70 70 0 0 1 ${CX - 160} ${CY} Z`} strokeWidth={STROKE * 1.2} />
      <path d={`M ${CX} ${CY - 70} V ${CY + 70}`} strokeWidth={STROKE_THIN * 1.3} />
      <path d={`M ${CX - 90} ${CY - 70} A 70 70 0 0 0 ${CX - 90} ${CY + 70} H ${CX} V ${CY - 70} Z`} fill={INK} stroke="none" opacity={0.25} />
    </g>
  );
};

/* ------------------------------------------------------------- composition */

export type ImpulsoScene = { start: number; end: number; marks: number[] };
export type ImpulsoProps = { scenes?: ImpulsoScene[]; seconds?: number };

const ART: React.FC[] = [Persona, Quimico, Loop, Pensar, Control, Celular, Treinta, Refuerzo, Apuestas, Dopamina, Volves, Gana, Debilita, Esperar, Pildora];

export const IMPULSO_SECONDS = 53.533;
export const IMPULSO_FRAMES = Math.round(IMPULSO_SECONDS * FPS);

/** Scenes on the original timeline of a reel, each fed its word cues. */
export const MarkedReel: React.FC<{ scenes: ImpulsoScene[]; art: React.FC[] }> = ({ scenes, art }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={Math.round(s.start * fps)} durationInFrames={Math.max(1, Math.round((s.end - s.start) * fps))}>
          <MarksContext.Provider value={s.marks}>
            <Shot C={art[i]} last={i === scenes.length - 1} />
          </MarksContext.Provider>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const Impulso: React.FC<ImpulsoProps> = ({ scenes = [] }) => <MarkedReel scenes={scenes} art={ART} />;
