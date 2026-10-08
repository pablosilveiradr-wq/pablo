import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, circlePath, Dot, DrawPath, DrawSpeed } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { FONT } from "./Visita";

/**
 * "Invisible": most of what shapes a life cannot be seen. A recreation of a
 * one-minute reel, scene by scene and on its timing, in Pablo's line style:
 * white line on pure black, nothing floating, Spanish text revealed word by
 * word. Timing comes from props so a voice-over can drive it later.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useScene = () => {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  return { f, p: Math.min(1, f / durationInFrames), dur: durationInFrames, fps };
};

/** Deterministic pseudo-random in [0,1). */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Glow: React.FC<{ cx: number; cy: number; r: number; o: number; id: string }> = ({ cx, cy, r, o, id }) =>
  o > 0 ? (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={INK} stopOpacity={0.5} />
          <stop offset="40%" stopColor={INK} stopOpacity={0.14} />
          <stop offset="100%" stopColor={INK} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke="none" opacity={o} />
    </>
  ) : null;

export const poly = (pts: number[][], close = true) =>
  `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")}${close ? " Z" : ""}`;

const CX = 540;
const CY = 420;

/* ------------------------------------------------------------------ scenes */

/** Most of what shapes a life: a square turns and rounds into a circle. */
const Forma: React.FC = () => {
  const { f, fps } = useScene();
  const k = spring({ frame: f - 30, fps, config: { damping: 18, stiffness: 50 } });
  const rot = (Math.PI / 4) * k + f * 0.004;
  const N = 64;
  const pts = new Array(N).fill(0).map((_, i) => {
    const a = (i / N) * Math.PI * 2;
    const sq = 175 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
    const r = sq + (205 - sq) * k;
    return [CX + Math.cos(a + rot) * r, CY + Math.sin(a + rot) * r];
  });
  const come = interpolate(f, [0, 24], [1, 0], clamp);
  return (
    <>
      <DrawPath d={poly(pts)} delay={10} duration={24} strokeWidth={STROKE_THIN * 1.2} />
      {[0, 16, 32, 48].map((i) => {
        const [x, y] = pts[i];
        const ox = (x - CX) * 0.6 * come;
        const oy = (y - CY) * 0.6 * come;
        return <circle key={i} cx={x + ox} cy={y + oy} r={6} fill={INK} stroke="none" />;
      })}
    </>
  );
};

/** Time passing: a dial whose light sweeps round. */
const Tiempo: React.FC = () => {
  const { f } = useScene();
  const R = 210;
  const head = -Math.PI / 2 + (f / 75) * Math.PI * 2;
  return (
    <>
      <DrawPath d={circlePath(CX, CY, R)} duration={24} strokeWidth={STROKE_THIN * 0.7} opacity={0.45} />
      {new Array(12).fill(0).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const l = i % 3 === 0 ? 22 : 12;
        return (
          <DrawPath
            key={i}
            d={`M ${CX + Math.cos(a) * (R - l)} ${CY + Math.sin(a) * (R - l)} L ${CX + Math.cos(a) * R} ${CY + Math.sin(a) * R}`}
            delay={6 + i * 1.5}
            duration={6}
            strokeWidth={STROKE_THIN}
          />
        );
      })}
      {new Array(10).fill(0).map((_, i) => {
        const a0 = head - (i + 1) * 0.07;
        const a1 = head - i * 0.07;
        return f > 12 ? (
          <path
            key={i}
            d={`M ${CX + Math.cos(a0) * R} ${CY + Math.sin(a0) * R} A ${R} ${R} 0 0 1 ${CX + Math.cos(a1) * R} ${CY + Math.sin(a1) * R}`}
            strokeWidth={STROKE}
            opacity={1 - i / 10}
          />
        ) : null;
      })}
      {f > 12 ? <circle cx={CX + Math.cos(head) * R} cy={CY + Math.sin(head) * R} r={7} fill={INK} stroke="none" /> : null}
    </>
  );
};

/** A decision becoming a direction: a line that hesitates, then sets off. */
const Rumbo: React.FC = () => {
  const { f, dur } = useScene();
  const lock = dur * 0.5;
  const search = f < lock ? Math.sin(f / 7) * 55 * (1 - f / lock) : 0;
  const len = f < lock ? 150 : interpolate(f, [lock, lock + 20], [150, 380], clamp);
  const a = ((-90 + search) * Math.PI) / 180;
  const ox = CX;
  const oy = 610;
  const tx = ox + Math.cos(a) * len;
  const ty = oy + Math.sin(a) * len;
  const arrow = interpolate(f, [lock + 16, lock + 24], [0, 1], clamp);
  return (
    <>
      <Glow cx={ox} cy={oy} r={70} o={1} id="rumboGlow" />
      <Dot cx={ox} cy={oy} r={8} />
      {f > 4 ? <path d={`M ${ox} ${oy} L ${tx} ${ty}`} strokeWidth={STROKE_THIN * 1.2} /> : null}
      {arrow > 0 ? <path d={`M ${tx - 16} ${ty + 22} L ${tx} ${ty} L ${tx + 16} ${ty + 22}`} strokeWidth={STROKE_THIN * 1.2} opacity={arrow} /> : null}
    </>
  );
};

/** A stranger becoming important: among many points, two find each other. */
const Desconocido: React.FC = () => {
  const { f, dur } = useScene();
  const meet = interpolate(f, [dur * 0.2, dur * 0.55], [0, 1], clamp);
  const link = interpolate(f, [dur * 0.5, dur * 0.62], [0, 1], clamp);
  const dim = 1 - 0.6 * link;
  const a = [430 + 70 * meet, 400 + 25 * meet];
  const b = [660 - 70 * meet, 460 - 25 * meet];
  return (
    <>
      {new Array(46).fill(0).map((_, i) => {
        const x = 170 + rnd(i) * 740;
        const y = 170 + rnd(i + 99) * 500;
        const o = interpolate(f, [i * 0.4, i * 0.4 + 8], [0, 0.45], clamp) * dim;
        return <circle key={i} cx={x} cy={y} r={2.6 + rnd(i + 7) * 2} fill={INK} stroke="none" opacity={o} />;
      })}
      <Glow cx={(a[0] + b[0]) / 2} cy={(a[1] + b[1]) / 2} r={150} o={link} id="strGlow" />
      {link > 0 ? <path d={`M ${a[0]} ${a[1]} L ${a[0] + (b[0] - a[0]) * link} ${a[1] + (b[1] - a[1]) * link}`} strokeWidth={STROKE_THIN * 1.2} /> : null}
      <circle cx={a[0]} cy={a[1]} r={7} fill={INK} stroke="none" />
      <circle cx={b[0]} cy={b[1]} r={7} fill={INK} stroke="none" />
    </>
  );
};

/** Something ordinary becoming a memory: one point in a grid starts to glow. */
const Recuerdo: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [dur * 0.35, dur * 0.75], [0, 1], clamp);
  const dots = [];
  for (let i = -5; i <= 5; i++) {
    for (let j = -4; j <= 4; j++) {
      const x = CX + i * 52;
      const y = CY + j * 52;
      const d = Math.hypot(i, j);
      const o = interpolate(f, [d * 2, d * 2 + 8], [0, 0.5], clamp) * (1 - 0.75 * k * Math.min(1, d / 3));
      if (i === 0 && j === 0) {
        continue;
      }
      dots.push(<circle key={`${i},${j}`} cx={x} cy={y} r={3.2} fill={INK} stroke="none" opacity={o} />);
    }
  }
  return (
    <>
      {dots}
      <Glow cx={CX} cy={CY} r={70 + 120 * k} o={k} id="memGlow" />
      {k > 0 ? <circle cx={CX} cy={CY} r={22 + 40 * k} strokeWidth={STROKE_THIN} opacity={0.6 * k} /> : null}
      <circle cx={CX} cy={CY} r={4 + 6 * k} fill={INK} stroke="none" />
    </>
  );
};

/** Outcomes are what we see: a big bright disc. Then the forces round it. */
const Resultado: React.FC = () => {
  const { f, dur, fps } = useScene();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 90 } });
  const forces = interpolate(f, [dur * 0.45, dur * 0.65], [0, 1], clamp);
  return (
    <>
      {forces > 0
        ? new Array(28).fill(0).map((_, i) => {
            const a0 = (i / 28) * Math.PI * 2 + f * 0.012;
            const r0 = 270 + (i % 4) * 30;
            const a1 = a0 + 0.35;
            const r1 = r0 - 40;
            return (
              <path
                key={i}
                d={`M ${CX + Math.cos(a0) * r0} ${CY + Math.sin(a0) * r0} Q ${CX + Math.cos(a0 + 0.2) * (r0 - 6)} ${CY + Math.sin(a0 + 0.2) * (r0 - 6)} ${CX + Math.cos(a1) * r1} ${CY + Math.sin(a1) * r1}`}
                strokeWidth={STROKE_THIN * 0.8}
                opacity={forces * 0.45}
              />
            );
          })
        : null}
      <Glow cx={CX} cy={CY} r={330} o={s} id="outGlow" />
      <circle cx={CX} cy={CY} r={215 * s} fill={INK} stroke="none" />
    </>
  );
};

/** Attention: focus brackets closing in on a point. */
const Atencion: React.FC = () => {
  const { f } = useScene();
  const h = interpolate(f, [0, 18], [200, 90], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const l = 30;
  const c = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  return (
    <>
      {c.map(([sx, sy], i) => (
        <path
          key={i}
          d={`M ${CX + sx * h} ${CY + sy * (h - l)} L ${CX + sx * h} ${CY + sy * h} L ${CX + sx * (h - l)} ${CY + sy * h}`}
          strokeWidth={STROKE_THIN * 1.3}
        />
      ))}
      <Dot cx={CX} cy={CY} r={7} delay={12} />
    </>
  );
};

/** Choice: two options, one gets chosen. */
const Eleccion: React.FC = () => {
  const { f, dur } = useScene();
  const pick = interpolate(f, [dur * 0.45, dur * 0.55], [0, 1], clamp);
  return (
    <>
      <DrawPath d={circlePath(440, CY, 26)} duration={10} strokeWidth={STROKE_THIN * 1.2} />
      <DrawPath d={circlePath(640, CY, 26)} delay={4} duration={10} strokeWidth={STROKE_THIN * 1.2} />
      {pick > 0 ? <circle cx={640} cy={CY} r={12 * pick} fill={INK} stroke="none" /> : null}
      <Glow cx={640} cy={CY} r={90} o={pick} id="pickGlow" />
    </>
  );
};

/** Distance: two points pulled apart, measured. */
const Distancia: React.FC = () => {
  const { f } = useScene();
  const k = interpolate(f, [0, 18], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const xa = CX - 40 - 230 * k;
  const xb = CX + 40 + 230 * k;
  return (
    <>
      <path d={circlePath(xa, CY, 18)} strokeWidth={STROKE_THIN * 1.2} />
      <path d={circlePath(xb, CY, 18)} strokeWidth={STROKE_THIN * 1.2} />
      <circle cx={xb} cy={CY} r={7} fill={INK} stroke="none" />
      <path d={`M ${xa} ${CY + 60} H ${xb} M ${xa} ${CY + 48} V ${CY + 72} M ${xb} ${CY + 48} V ${CY + 72}`} strokeWidth={STROKE_THIN} opacity={0.8} />
    </>
  );
};

/** Repetition: the same dot, row after row. */
const Repeticion: React.FC = () => {
  const { f } = useScene();
  const out = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 11; c++) {
      const o = interpolate(f, [r * 2.5 + c * 0.6, r * 2.5 + c * 0.6 + 5], [0, 0.85], clamp);
      out.push(<circle key={`${r}-${c}`} cx={CX + (c - 5) * 64} cy={CY + (r - 3) * 64} r={4} fill={INK} stroke="none" opacity={o} />);
    }
  }
  return <>{out}</>;
};

/** Connection: points on a lattice joined to their neighbours, outward from the centre. */
const Conexion: React.FC = () => {
  const { f, dur } = useScene();
  const S = 74;
  const pts: number[][] = [];
  for (let j = -4; j <= 4; j++) {
    for (let i = -4; i <= 4; i++) {
      const x = CX + (i + (j % 2 ? 0.5 : 0)) * S;
      const y = CY + j * S * 0.866;
      if (Math.hypot(x - CX, y - CY) <= 230) {
        pts.push([x, y]);
      }
    }
  }
  const edges: number[][] = [];
  pts.forEach((p, i) =>
    pts.forEach((q, j) => {
      if (j > i && Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1]) - S) < 2) {
        edges.push([i, j]);
      }
    }),
  );
  const grow = interpolate(f, [0, dur * 0.8], [0, 260], clamp);
  return (
    <>
      {edges.map(([i, j], k) => {
        const mx = (pts[i][0] + pts[j][0]) / 2;
        const my = (pts[i][1] + pts[j][1]) / 2;
        const o = interpolate(grow - Math.hypot(mx - CX, my - CY), [0, 30], [0, 0.7], clamp);
        return o > 0 ? <path key={k} d={`M ${pts[i][0]} ${pts[i][1]} L ${pts[j][0]} ${pts[j][1]}`} strokeWidth={STROKE_THIN * 0.8} opacity={o} /> : null;
      })}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={INK} stroke="none" opacity={interpolate(f, [i * 0.5, i * 0.5 + 6], [0, 1], clamp)} />
      ))}
    </>
  );
};

/** A small change: two paths from almost the same point end up far apart. */
const Cambio: React.FC = () => {
  const { f, dur } = useScene();
  const d1 = "M 540 650 C 540 540 520 430 390 330 C 300 260 270 220 250 170";
  const d2 = "M 544 650 C 548 540 580 440 700 350 C 790 280 820 230 840 170";
  const k = interpolate(f, [6, dur * 0.85], [0, 1], clamp);
  return (
    <>
      <Glow cx={542} cy={650} r={70} o={1} id="chgGlow" />
      <circle cx={542} cy={650} r={7} fill={INK} stroke="none" />
      <path d={d1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} strokeWidth={STROKE_THIN * 1.2} />
      <path d={d2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} strokeWidth={STROKE_THIN * 1.2} opacity={0.7} />
    </>
  );
};

/** A brief moment that stays for decades: rings growing out like a tree's. */
const Decadas: React.FC = () => {
  const { f, dur } = useScene();
  const n = Math.floor(interpolate(f, [0, dur * 0.9], [1, 13], clamp));
  return (
    <>
      <Glow cx={CX} cy={CY} r={80} o={1} id="ringGlow" />
      <circle cx={CX} cy={CY} r={6} fill={INK} stroke="none" />
      {new Array(n).fill(0).map((_, i) => {
        const R = 24 + i * 19;
        const born = (i / 13) * dur * 0.9;
        const o = interpolate(f, [born, born + 10], [0, 0.85 - i * 0.03], clamp);
        const pts = new Array(72).fill(0).map((_, k) => {
          const a = (k / 72) * Math.PI * 2;
          const w = 1 + 0.05 * Math.sin(3 * a + i) + 0.03 * Math.sin(5 * a + i * 2);
          return [CX + Math.cos(a) * R * w, CY + Math.sin(a) * R * w];
        });
        return <path key={i} d={poly(pts)} strokeWidth={STROKE_THIN * 0.8} opacity={o} />;
      })}
    </>
  );
};

/** Someone leaves and still bends your course. */
const Partida: React.FC = () => {
  const { f, dur } = useScene();
  const go = interpolate(f, [dur * 0.15, dur * 0.5], [0, 1], clamp);
  const bx = 600 + 260 * go;
  const by = 430 - 230 * go;
  const bend = interpolate(f, [dur * 0.4, dur * 0.95], [0, 1], clamp);
  return (
    <>
      {/* where you were going */}
      <path d="M 480 440 L 860 440" strokeWidth={STROKE_THIN} strokeDasharray="4 12" opacity={0.45} />
      {/* where you are going now */}
      <path d="M 480 440 C 600 440 700 420 830 250" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bend} strokeWidth={STROKE_THIN * 1.2} />
      <circle cx={480} cy={440} r={8} fill={INK} stroke="none" />
      <circle cx={bx} cy={by} r={8} fill={INK} stroke="none" opacity={1 - go * 0.9} />
    </>
  );
};

/** What you cannot see weighs more: a seesaw tips toward the dashed side. */
const Balanza: React.FC = () => {
  const { f, dur, fps } = useScene();
  const flip = spring({ frame: f - dur * 0.45, fps, config: { damping: 12, stiffness: 60 } });
  const ang = 12 - 24 * flip;
  const L = 260;
  const py = 540;
  const rad = (ang * Math.PI) / 180;
  const lx = CX - Math.cos(rad) * L;
  const ly = py - Math.sin(rad) * L;
  const rx = CX + Math.cos(rad) * L;
  const ry = py + Math.sin(rad) * L;
  return (
    <>
      <DrawPath d={`M ${CX - 30} ${py + 50} L ${CX} ${py} L ${CX + 30} ${py + 50}`} duration={10} strokeWidth={STROKE_THIN * 1.2} />
      <path d={`M ${lx} ${ly} L ${rx} ${ry}`} strokeWidth={STROKE_THIN * 1.2} />
      {/* the unseen: dashed */}
      <path d={circlePath(lx, ly - 40, 38)} strokeWidth={STROKE_THIN * 1.2} strokeDasharray="5 8" />
      {/* the seen: solid */}
      <Glow cx={rx} cy={ry - 40} r={90} o={0.8} id="seenGlow" />
      <circle cx={rx} cy={ry - 40} r={38} fill={INK} stroke="none" />
    </>
  );
};

/** They shape us: a dashed circle pushed into shape by forces all round. */
const Moldea: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [dur * 0.35, dur * 0.9], [0, 1], clamp);
  const rays = interpolate(f, [dur * 0.15, dur * 0.4], [0, 1], clamp);
  const pts = new Array(96).fill(0).map((_, i) => {
    const a = (i / 96) * Math.PI * 2;
    const r = 190 * (1 - k * (0.07 * Math.sin(4 * a + 0.6) + 0.05 * Math.sin(7 * a + 2)));
    return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
  });
  return (
    <>
      {rays > 0
        ? new Array(72).fill(0).map((_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const r0 = 240;
            const len = 30 + rnd(i) * 90;
            return (
              <path
                key={i}
                d={`M ${CX + Math.cos(a) * (r0 + len)} ${CY + Math.sin(a) * (r0 + len)} L ${CX + Math.cos(a) * r0} ${CY + Math.sin(a) * r0}`}
                strokeWidth={STROKE_THIN * 0.7}
                opacity={rays * 0.5}
              />
            );
          })
        : null}
      <path d={poly(pts)} strokeWidth={STROKE_THIN * 1.2} strokeDasharray="3 9" opacity={interpolate(f, [0, 10], [0, 1], clamp)} />
    </>
  );
};

/** So we give them form: a loose loop settles into a circle. */
const DarForma: React.FC = () => {
  const { f, dur } = useScene();
  const k = interpolate(f, [dur * 0.2, dur * 0.85], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const pts = new Array(96).fill(0).map((_, i) => {
    const a = (i / 96) * Math.PI * 2;
    const r = 200 * (1 + (1 - k) * (0.14 * Math.sin(3 * a + 1) + 0.09 * Math.sin(5 * a + 0.4)));
    return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
  });
  return (
    <>
      <DrawPath d={poly(pts)} duration={20} strokeWidth={STROKE_THIN * 1.2} />
      {pts
        .filter((_, i) => i % 8 === 0)
        .map(([x, y], i) => (
          <path key={i} d={`M ${x - 6} ${y - 6} h 12 v 12 h -12 Z`} strokeWidth={STROKE_THIN} opacity={interpolate(f, [8 + i * 2, 14 + i * 2], [0, 1], clamp)} />
        ))}
    </>
  );
};

const Linea: React.FC = () => <DrawPath d={`M 300 ${CY} L 780 ${CY}`} duration={18} strokeWidth={STROKE_THIN * 1.3} />;

const Punto: React.FC = () => {
  const { f } = useScene();
  return (
    <>
      <Glow cx={CX} cy={CY} r={80} o={interpolate(f, [0, 10], [0, 1], clamp)} id="ptGlow" />
      <Dot cx={CX} cy={CY} r={10} />
    </>
  );
};

const Movimiento: React.FC = () => {
  const { f } = useScene();
  const a = -Math.PI / 2 + (f / 30) * Math.PI * 1.4;
  const R = 130;
  const trail = new Array(14).fill(0).map((_, i) => {
    const b0 = a - (i + 1) * 0.12;
    const b1 = a - i * 0.12;
    return (
      <path
        key={i}
        d={`M ${CX + Math.cos(b0) * R} ${CY + Math.sin(b0) * R} A ${R} ${R} 0 0 1 ${CX + Math.cos(b1) * R} ${CY + Math.sin(b1) * R}`}
        strokeWidth={STROKE_THIN * 1.2}
        opacity={1 - i / 14}
      />
    );
  });
  return (
    <>
      {trail}
      <circle cx={CX + Math.cos(a) * R} cy={CY + Math.sin(a) * R} r={8} fill={INK} stroke="none" />
    </>
  );
};

/** A way to see what was always there: an eye opens, then the shapes around it show. */
const Ojo: React.FC = () => {
  const { f, dur } = useScene();
  const open = interpolate(f, [4, 22], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const around = interpolate(f, [dur * 0.45, dur * 0.65], [0, 1], clamp);
  const W = 250;
  const H = 130 * open;
  return (
    <>
      <path d={`M ${CX - W} ${CY} Q ${CX} ${CY - H * 2} ${CX + W} ${CY} Q ${CX} ${CY + H * 2} ${CX - W} ${CY} Z`} strokeWidth={STROKE_THIN * 1.3} />
      {open > 0.5 ? (
        <g opacity={(open - 0.5) * 2}>
          <path d={circlePath(CX, CY, 88)} strokeWidth={STROKE_THIN * 1.2} />
          <path d={circlePath(CX, CY, 34)} strokeWidth={STROKE_THIN} />
          {new Array(24).fill(0).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <path key={i} d={`M ${CX + Math.cos(a) * 42} ${CY + Math.sin(a) * 42} L ${CX + Math.cos(a) * 80} ${CY + Math.sin(a) * 80}`} strokeWidth={STROKE_THIN * 0.6} opacity={0.5} />;
          })}
        </g>
      ) : null}
      {/* what was always there: the shapes of the earlier scenes, all round */}
      {around > 0 ? (
        <g opacity={around * 0.7}>
          <path d={circlePath(230, 210, 60)} strokeWidth={STROKE_THIN} strokeDasharray="3 8" />
          <path d={poly(new Array(6).fill(0).map((_, i) => [850 + Math.cos((i / 6) * Math.PI * 2) * 55, 220 + Math.sin((i / 6) * Math.PI * 2) * 55]))} strokeWidth={STROKE_THIN} />
          {new Array(16).fill(0).map((_, i) => (
            <circle key={i} cx={800 + (i % 4) * 26} cy={600 + Math.floor(i / 4) * 26} r={3} fill={INK} stroke="none" />
          ))}
          {[16, 30, 44].map((r) => (
            <path key={r} d={circlePath(250, 640, r)} strokeWidth={STROKE_THIN * 0.8} />
          ))}
        </g>
      ) : null}
    </>
  );
};

/** Making the invisible visible: one point lights up. */
const Visible: React.FC = () => {
  const { f, dur } = useScene();
  const g = interpolate(f, [0, dur * 0.5], [0.2, 1], clamp);
  return (
    <>
      <Glow cx={CX} cy={CY} r={120 + 60 * g} o={g} id="visGlow" />
      <circle cx={CX} cy={CY} r={4 + 6 * g} fill={INK} stroke="none" />
    </>
  );
};

/* ------------------------------------------------------------- timing */

export type InvisibleScene = { start: number; end: number; dark?: boolean };
export type InvisibleLine = {
  text: string;
  start: number;
  end: number;
  scene: number;
  row: number;
  /** When each word is spoken, in seconds from the line start: words appear on the voice. */
  words?: number[];
};
export type InvisibleProps = { scenes?: InvisibleScene[]; lines?: InvisibleLine[]; seconds?: number };

const ART: React.FC[] = [
  Forma, Tiempo, Rumbo, Desconocido, Recuerdo, Resultado, Atencion, Eleccion, Distancia, Repeticion, Conexion,
  Cambio, Decadas, Partida, Balanza, Moldea, DarForma, Linea, Punto, Movimiento, Ojo, Visible,
];

/** Scenes and text on the reference's timing (seconds). */
const S: [number, number, [string, number][]][] = [
  [0, 3.0, [["La mayor parte de lo que da forma a una vida", 0.9], ["no se puede ver.", 2.0]]],
  [3.0, 6.0, [["No podés ver el tiempo pasar.", 3.1]]],
  [6.0, 8.8, [["No podés ver una decisión", 6.0], ["convirtiéndose en un rumbo.", 7.0]]],
  [8.8, 11.8, [["No podés ver el momento", 9.0], ["en que un desconocido se vuelve importante.", 10.0]]],
  [11.8, 14.8, [["O cuando algo común", 12.0], ["se vuelve un recuerdo.", 13.0]]],
  [14.8, 19.8, [["Notamos los resultados.", 15.0], ["Pero rara vez", 17.0], ["las fuerzas invisibles", 17.5], ["que los crearon.", 18.1]]],
  [19.8, 20.8, [["Atención.", 19.9]]],
  [20.8, 22.8, [["Elección.", 20.9]]],
  [22.8, 23.8, [["Distancia.", 22.9]]],
  [23.8, 24.8, [["Repetición.", 23.9]]],
  [24.8, 26.8, [["Conexión.", 24.9]]],
  [26.8, 29.8, [["Un pequeño cambio", 27.6], ["puede volverse una vida completamente distinta.", 28.8]]],
  [29.8, 33.8, [["Un momento breve", 30.6], ["puede quedarse por décadas.", 31.8]]],
  [33.8, 36.8, [["Una persona puede irse", 33.9], ["y aun así cambiar hacia dónde vas.", 35.0]]],
  [36.8, 40.8, [["Quizás lo que no se ve", 37.6], ["pesa más de lo que creemos.", 38.8]]],
  [40.8, 44.8, [["Quizás es lo que", 41.0], ["más nos forma.", 42.8]]],
  [44.8, 47.8, [["Por eso le damos forma.", 45.0]]],
  [47.8, 48.8, [["Una línea.", 47.9]]],
  [48.8, 49.8, [["Un punto.", 48.9]]],
  [49.8, 50.8, [["Un movimiento.", 49.9]]],
  [50.8, 54.8, [["Una forma de ver", 51.0], ["lo que siempre estuvo ahí.", 52.8]]],
  [54.8, 58.8, [["Hacer visible lo invisible.", 55.0]]],
];

export const INVISIBLE_SECONDS = 58.8;
export const INVISIBLE_FRAMES = Math.round(INVISIBLE_SECONDS * FPS);

const DEFAULT_SCENES: InvisibleScene[] = S.map(([start, end], i) => ({ start, end, dark: i === 5 }));
const DEFAULT_LINES: InvisibleLine[] = S.flatMap(([, end], si) => {
  const lines = S[si][2];
  // "Notamos los resultados." stands alone; the next sentence replaces it.
  return lines.map(([text, start], li) => {
    const replacedAt = si === 5 && li === 0 ? lines[1][1] - 0.1 : end - 0.15;
    const row = si === 5 ? (li === 0 ? 0 : li - 1) : li;
    return { text, start, end: replacedAt, scene: si, row };
  });
});

/* -------------------------------------------------------------- render */

/** One line of text, its words fading in one after another. */
export const TextLine: React.FC<{ text: string; rows: number; row: number; dark: boolean; times?: number[] }> = ({ text, rows, row, dark, times }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const words = text.split(" ");
  const step = Math.min(5, 26 / words.length);
  const { fps } = useVideoConfig();
  const at = (i: number) => (times && times[i] !== undefined ? times[i] * fps : i * step);
  const out = interpolate(f, [durationInFrames - 3, durationInFrames], [1, 0], clamp);
  // In the bright-disc scene the text sits inside the disc, in black.
  const top = dark ? 383 + (row - (rows - 1) / 2) * 50 : 850 + row * 56 - (rows - 1) * 28;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: dark ? 34 : 40,
        lineHeight: 1.2,
        color: dark ? BG : INK,
        opacity: out,
        textShadow: dark ? "none" : "0 0 18px rgba(242,242,242,0.25)",
      }}
    >
      {words.map((w, i) => (
        <span key={i} style={{ opacity: interpolate(f, [at(i), at(i) + 6], [0, 1], clamp) }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

export const Shot: React.FC<{ C: React.FC; last: boolean; scale?: number }> = ({ C, last, scale = 0.88 }) => {
  const { f, dur } = useScene();
  const o = interpolate(f, [0, 3], [0, 1], clamp) * interpolate(f, [dur - (last ? 20 : 3), dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Canvas scale={scale} glowOpacity={0.3}>
        <DrawSpeed value={1}>
          <C />
        </DrawSpeed>
      </Canvas>
    </AbsoluteFill>
  );
};

export const Invisible: React.FC<InvisibleProps> = ({ scenes = DEFAULT_SCENES, lines = DEFAULT_LINES }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={Math.round(s.start * fps)} durationInFrames={Math.max(1, Math.round((s.end - s.start) * fps))}>
          <Shot C={ART[i]} last={i === scenes.length - 1} />
        </Sequence>
      ))}
      {lines.map((l, i) => {
        const rows = lines.filter((m) => m.scene === l.scene && m.start < l.end && m.end > l.start).length;
        return (
          <Sequence key={`t${i}`} from={Math.round(l.start * fps)} durationInFrames={Math.max(1, Math.round((l.end - l.start) * fps))}>
            <TextLine text={l.text} rows={Math.max(rows, l.row + 1)} row={l.row} dark={!!scenes[l.scene]?.dark} times={l.words} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
