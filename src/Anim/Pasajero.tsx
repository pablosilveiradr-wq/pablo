import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, circlePath, Dot, DrawPath, DrawSpeed } from "./primitives";
import { BG, FPS, INK, STROKE_THIN } from "./theme";
import { Chunk } from "./Visita";

/**
 * "Pasajero": one continuous shot of the sea. Each line changes something in
 * it: the sun sets, night comes, people pass along the shore, a tree runs
 * through the seasons, and the day comes back while footprints carry on past
 * today. White line on pure black, Spanish captions word by word, no audio.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const s = (sec: number) => sec * FPS;

export const PASAJERO_LINES: { start: number; end: number; chunks: string[] }[] = [
  { start: 0.4, end: 3.3, chunks: ["Todo", "en este mundo", "es pasajero."] },
  { start: 3.7, end: 5.4, chunks: ["La vida", "*cambia."] },
  { start: 5.8, end: 8.2, chunks: ["La gente", "viene", "y va."] },
  { start: 8.5, end: 11.4, chunks: ["Y ninguna estación", "dura", "para siempre."] },
  { start: 11.8, end: 13.1, chunks: ["Acordate", "siempre:"] },
  { start: 13.3, end: 18.6, chunks: ["lo que estás", "viviendo hoy", "es una parada,", "*y el camino sigue."] },
];

export const PASAJERO_SECONDS = 20.5;
export const PASAJERO_FRAMES = Math.round(PASAJERO_SECONDS * FPS);

const HORIZON = 350;
const SHORE = 588;

/** A wavy line across the water, drifting sideways. */
const wave = (y: number, amp: number, len: number, phase: number, x0 = 130, x1 = 950) => {
  let d = "";
  for (let x = x0; x <= x1; x += 10) {
    const yy = y + Math.sin((x / len) * Math.PI * 2 + phase) * amp;
    d += `${d ? " L" : "M"} ${x} ${yy.toFixed(1)}`;
  }
  return d;
};

/** Beach edge: where the water laps, moving in and out. */
const shoreLine = (lap: number, x0 = 130, x1 = 950) => `M ${x0} ${SHORE + lap} C 380 ${SHORE - 18 + lap} 700 ${SHORE + 12 + lap} ${x1} ${SHORE - 6 + lap}`;

const Sea: React.FC = () => {
  const f = useCurrentFrame();
  const lap = Math.sin(f / 28) * 7;
  return (
    <>
      <DrawPath d={`M 130 ${HORIZON} H 950`} duration={24} />
      <DrawPath d={wave(398, 3, 150, f / 22)} delay={8} duration={24} strokeWidth={STROKE_THIN * 0.8} opacity={0.55} />
      <DrawPath d={wave(452, 5, 190, -f / 26 + 1)} delay={12} duration={24} strokeWidth={STROKE_THIN * 0.9} opacity={0.7} />
      <DrawPath d={wave(520, 7, 240, f / 30 + 2)} delay={16} duration={24} strokeWidth={STROKE_THIN} opacity={0.85} />
      <DrawPath d={shoreLine(lap)} delay={20} duration={26} />
      <DrawPath d={shoreLine(lap * 0.5 + 14, 210, 870)} delay={26} duration={24} strokeWidth={STROKE_THIN * 0.8} opacity={0.45} />
    </>
  );
};

/** The sun sets through the first lines and comes back up at the end. */
const Sun: React.FC = () => {
  const f = useCurrentFrame();
  const setY = interpolate(f, [s(0.4), s(5.2)], [HORIZON - 30, HORIZON + 66], clamp);
  const riseY = interpolate(f, [s(12.0), s(18.4)], [HORIZON + 66, HORIZON - 70], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const y = f < s(12) ? setY : riseY;
  const glow = f < s(12) ? interpolate(f, [s(0.2), s(0.9), s(4.2), s(5.2)], [0, 1, 0.6, 0], clamp) : interpolate(f, [s(12.4), s(17)], [0, 1], clamp);
  const rays = interpolate(f, [s(16.4), s(17.4)], [0, 1], clamp);
  const r = 58;
  // the part of the disc under the horizon is hidden: clip to the sky
  return (
    <>
      <defs>
        <clipPath id="sky">
          <rect x={0} y={0} width={1080} height={HORIZON - 1} />
        </clipPath>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor={INK} stopOpacity={0.5} />
          <stop offset="40%" stopColor={INK} stopOpacity={0.14} />
          <stop offset="100%" stopColor={INK} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g clipPath="url(#sky)">
        {glow > 0 ? <circle cx={540} cy={y} r={200} fill="url(#sunGlow)" stroke="none" opacity={glow} /> : null}
        <DrawPath d={circlePath(540, y, r)} delay={4} duration={18} />
        {rays > 0
          ? new Array(9).fill(0).map((_, i) => {
              const a = Math.PI + (i / 8) * Math.PI;
              return (
                <path
                  key={i}
                  d={`M ${540 + Math.cos(a) * (r + 16)} ${y + Math.sin(a) * (r + 16)} L ${540 + Math.cos(a) * (r + 16 + 22 * rays)} ${y + Math.sin(a) * (r + 16 + 22 * rays)}`}
                  strokeWidth={STROKE_THIN}
                  opacity={rays}
                />
              );
            })
          : null}
      </g>
      {/* its reflection on the water, shrinking as it sets and growing as it rises */}
      {[0, 1, 2, 3].map((i) => {
        const vis = Math.max(0, 1 - Math.abs(y - HORIZON) / 70);
        const w = (70 - i * 14) * vis * (1 + 0.08 * Math.sin(f / 6 + i));
        return w > 4 ? (
          <path key={i} d={`M ${540 - w} ${HORIZON + 16 + i * 16} H ${540 + w}`} strokeWidth={STROKE_THIN} opacity={0.6 * vis} />
        ) : null;
      })}
    </>
  );
};

/** Night: a moon and a few stars, then the day comes back. */
const Night: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [s(4.0), s(5.2), s(12.0), s(13.4)], [0, 1, 1, 0], clamp);
  if (o <= 0) {
    return null;
  }
  const stars = [
    [300, 210],
    [420, 150],
    [620, 190],
    [720, 140],
    [230, 300],
    [880, 290],
    [520, 250],
  ];
  return (
    <g opacity={o}>
      <path d="M 790 170 A 42 42 0 1 0 832 234 A 32 32 0 0 1 790 170 Z" strokeWidth={STROKE_THIN} />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3 + Math.sin(f / 7 + i * 2) * 1.1} fill={INK} stroke="none" opacity={interpolate(f, [s(4.2) + i * 4, s(4.6) + i * 4], [0, 1], clamp)} />
      ))}
    </g>
  );
};

/** Head and shoulders, bobbing as it walks. */
const Walker: React.FC<{ x: number; y: number; o: number; step: number }> = ({ x, y, o, step }) => {
  const b = -Math.abs(Math.sin(step)) * 4;
  return o > 0 ? (
    <g opacity={o} transform={`translate(0 ${b})`}>
      <path d={circlePath(x, y - 62, 19)} strokeWidth={STROKE_THIN * 1.3} />
      <path d={`M ${x - 32} ${y} A 32 32 0 0 1 ${x + 32} ${y}`} strokeWidth={STROKE_THIN * 1.3} />
    </g>
  ) : null;
};

/** People come and go along the shore. */
const People: React.FC = () => {
  const f = useCurrentFrame();
  const walkers = [
    // enters from the left and stays a while
    { x0: 160, x1: 430, t0: s(5.7), t1: s(8.6), fin: 10, fout: s(8.6) },
    // was there and walks off to the right
    { x0: 640, x1: 930, t0: s(5.6), t1: s(8.4), fin: 0, fout: s(7.6) },
    // passes through
    { x0: 820, x1: 560, t0: s(6.4), t1: s(9.0), fin: 12, fout: s(8.5) },
  ];
  return (
    <>
      {walkers.map((w, i) => {
        const k = interpolate(f, [w.t0, w.t1], [0, 1], clamp);
        const x = w.x0 + (w.x1 - w.x0) * k;
        const o = interpolate(f, [w.t0, w.t0 + Math.max(1, w.fin)], [w.fin ? 0 : 1, 1], clamp) * interpolate(f, [w.fout, w.fout + 16], [1, 0], clamp) * (f >= w.t0 - (w.fin ? 0 : 8) ? 1 : 0);
        return <Walker key={i} x={x} y={SHORE + 128 - (x - 540) * 0.03} o={o} step={f / 4 + i} />;
      })}
    </>
  );
};

/** A tree on the shore that runs through the seasons, then buds again at the end. */
const Tree: React.FC = () => {
  const f = useCurrentFrame();
  const X = 216;
  const G = SHORE + 118;
  const t0 = s(8.4);
  const inO = interpolate(f, [t0, t0 + 8], [0, 1], clamp);
  if (f < t0) {
    return null;
  }
  const spring = interpolate(f, [t0 + 10, t0 + 16, s(9.4), s(9.8)], [0, 1, 1, 0], clamp);
  const summer = interpolate(f, [s(9.4), s(9.8), s(10.2), s(10.6)], [0, 1, 1, 0], clamp);
  const autumn = interpolate(f, [s(10.2), s(10.5), s(10.9), s(11.3)], [0, 1, 1, 0], clamp);
  const winter = interpolate(f, [s(10.9), s(11.3)], [0, 1], clamp);
  const dim = interpolate(f, [s(12.0), s(13.0)], [1, 0.45], clamp);
  const buds = interpolate(f, [s(16.6), s(17.4)], [0, 1], clamp);
  const crown = Math.max(spring, summer, autumn * 0.6);
  const cy = G - 214;
  return (
    <g opacity={inO * Math.max(dim, buds)}>
      <DrawPath d={`M ${X} ${G} V ${G - 150} M ${X} ${G - 86} L ${X - 42} ${G - 128} M ${X} ${G - 112} L ${X + 38} ${G - 152}`} delay={t0} duration={12} strokeWidth={STROKE_THIN * 1.2} />
      {crown > 0 ? <path d={circlePath(X, cy, 80)} fill={BG} strokeWidth={STROKE_THIN * 1.2} opacity={crown} /> : null}
      {summer > 0 ? <circle cx={X} cy={cy} r={80} fill={INK} stroke="none" opacity={0.12 * summer} /> : null}
      {/* spring blossoms */}
      {[
        [-34, -26],
        [24, -38],
        [40, 10],
        [-16, 24],
        [2, -6],
        [-44, 16],
      ].map(([dx, dy], i) => (
        <circle key={i} cx={X + dx} cy={cy + dy} r={8} strokeWidth={STROKE_THIN * 0.9} opacity={spring} />
      ))}
      {/* autumn leaves falling */}
      {autumn > 0
        ? [0, 1, 2, 3, 4].map((i) => {
            const t = f - s(10.2) - i * 3;
            const ly = cy + 30 + t * 3.2;
            const lx = X - 56 + i * 26 + Math.sin(t / 5 + i) * 12;
            return t > 0 && ly < G ? <path key={i} d={`M ${lx} ${ly} q 10 -11 20 0 q -10 11 -20 0 Z`} strokeWidth={STROKE_THIN * 0.9} opacity={autumn} /> : null;
          })
        : null}
      {/* winter snow */}
      {winter > 0
        ? new Array(10).fill(0).map((_, i) => {
            const t = f - s(10.9) + ((i * 37) % 60);
            const sy = cy - 100 + ((t * 2.4) % 250);
            const sx = X - 110 + ((i * 53) % 220) + Math.sin(t / 9 + i) * 7;
            return <circle key={i} cx={sx} cy={sy} r={3.6} fill={INK} stroke="none" opacity={winter * dim * interpolate(sy, [G - 30, G], [1, 0], clamp)} />;
          })
        : null}
      {/* and it buds again */}
      {[
        [X - 42, G - 128],
        [X + 38, G - 152],
        [X, G - 150],
      ].map(([x, y], i) => (
        <circle key={`b${i}`} cx={x} cy={y} r={9 * buds} strokeWidth={STROKE_THIN} opacity={buds} />
      ))}
    </g>
  );
};

/** Footprints along the sand: up to today, a stop, then on. */
const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const at = (x: number) => SHORE + 132 - (x - 150) * 0.06;
  const prints = new Array(18).fill(0).map((_, i) => {
    const x = 180 + i * 44;
    const side = i % 2 ? 1 : -1;
    const y = at(x) + side * 12;
    // first half walks in up to today; the rest appears on "y el camino sigue"
    const t = i < 9 ? s(13.4) + i * 5 : s(16.5) + (i - 9) * 4;
    const o = interpolate(f, [t, t + 6], [0, 1], clamp) * interpolate(f, [s(19.6), s(20.4)], [1, 0], clamp);
    const k = 1 - i * 0.022;
    return { x, y, o, k };
  });
  const stopAt = s(15.1);
  const ring = interpolate(f, [stopAt, stopAt + 10], [0, 1], clamp);
  const phase = f > stopAt + 12 ? ((f - stopAt - 12) % 40) / 40 : -1;
  const hx = 180 + 9 * 44 - 22;
  const hy = at(hx);
  return (
    <>
      {prints.map((p, i) =>
        p.o > 0 ? (
          <ellipse key={i} cx={p.x} cy={p.y} rx={13 * p.k} ry={7 * p.k} strokeWidth={STROKE_THIN} opacity={p.o} transform={`rotate(-4 ${p.x} ${p.y})`} />
        ) : null,
      )}
      {/* today: where you stand */}
      <Dot cx={hx} cy={hy - 2} r={8} delay={stopAt} />
      {ring > 0 ? <circle cx={hx} cy={hy - 2} r={22 * ring} strokeWidth={STROKE_THIN * 1.2} /> : null}
      {phase >= 0 ? <circle cx={hx} cy={hy - 2} r={22 + 26 * phase} strokeWidth={STROKE_THIN} opacity={0.7 * (1 - phase)} /> : null}
    </>
  );
};

const chunks = () =>
  PASAJERO_LINES.flatMap((line) => {
    const w = line.chunks.map((c) => c.replace("*", "").length + 4);
    const total = w.reduce((a, b) => a + b, 0);
    let t = line.start;
    return line.chunks.map((text, i) => {
      const start = t;
      t += ((line.end - line.start) * w[i]) / total;
      return { text, start, end: i === line.chunks.length - 1 ? line.end + 0.25 : t };
    });
  });

export const Pasajero: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const o = interpolate(f, [durationInFrames - 18, durationInFrames], [1, 0], clamp);
  const push = interpolate(f, [0, durationInFrames], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill style={{ opacity: o, transform: `scale(${push})` }}>
        <Canvas scale={0.88}>
          <DrawSpeed value={1}>
            <g transform="translate(0 -10)">
              <Night />
              <Sun />
              <Sea />
              <Tree />
              <People />
              <Steps />
            </g>
          </DrawSpeed>
        </Canvas>
      </AbsoluteFill>
      {chunks().map((c, i) => (
        <Sequence key={i} from={Math.round(c.start * fps)} durationInFrames={Math.max(1, Math.round((c.end - c.start) * fps))}>
          <Chunk text={c.text} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
