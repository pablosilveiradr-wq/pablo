import "@fontsource/montserrat/500.css";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, circlePath, Dot, DrawPath, DrawSpeed, StrokeScale, useStrokeScale } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";

/**
 * "Visita": the past is a place you can visit, but life happens now.
 * Seven line-art scenes, one per pair of lines. Each draws a place that is
 * still there, and on the "pero" the thing that made it yours goes: the
 * friends leave the school, the family leaves the house, the barista leaves
 * the café, the faces turn into strangers, the sun sets on the city. It ends
 * on a pin: you are here. Spanish captions word by word, pure black, no audio.
 */

const FONT = "Montserrat, 'DejaVu Sans', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spoken lines, in seconds. `*` marks the chunk that lands the line. */
export const VISITA_LINES: { start: number; end: number; chunks: string[] }[] = [
  { start: 0.4, end: 4.95, chunks: ["Podés", "volver", "al pasado,"] },
  { start: 5.0, end: 6.8, chunks: ["pero ahora", "*está vacío."] },
  { start: 7.1, end: 9.0, chunks: ["Tu vieja", "escuela", "sigue ahí,"] },
  { start: 9.05, end: 10.85, chunks: ["pero tus", "amigos", "*no."] },
  { start: 11.05, end: 13.4, chunks: ["La casa", "de tu infancia", "sigue en pie,"] },
  { start: 13.5, end: 15.8, chunks: ["pero tu familia", "*ya no", "vive ahí."] },
  { start: 16.0, end: 18.65, chunks: ["El café", "que amabas", "sigue abierto,"] },
  { start: 18.75, end: 21.2, chunks: ["pero el que", "sabía", "tu pedido", "*ya no está."] },
  { start: 21.45, end: 23.6, chunks: ["Las calles", "son las mismas,"] },
  { start: 23.75, end: 26.2, chunks: ["pero", "las caras", "*no."] },
  { start: 26.45, end: 28.65, chunks: ["Los edificios", "no cambiaron,"] },
  { start: 28.75, end: 31.15, chunks: ["pero", "la energía", "*sí."] },
  { start: 31.3, end: 33.7, chunks: ["El pasado", "es un lugar", "para visitar,"] },
  { start: 33.8, end: 37.8, chunks: ["pero la vida", "pasa", "*en el presente."] },
];

export const VISITA_SECONDS = 38.5;
export const VISITA_FRAMES = Math.round(VISITA_SECONDS * FPS);

/* ------------------------------------------------------------------ helpers */

/** Local frame on the scene clock. */
const useF = () => useCurrentFrame();

/** Children fade out and drift up from frame `at`: something that is no longer there. */
const Leave: React.FC<{ at: number; dur?: number; rise?: number; children: React.ReactNode }> = ({
  at,
  dur = 18,
  rise = 22,
  children,
}) => {
  const f = useF();
  const k = interpolate(f, [at, at + dur], [1, 0], clamp);
  if (k <= 0) {
    return null;
  }
  return (
    <g opacity={k} transform={`translate(0 ${-(1 - k) * rise})`}>
      {children}
    </g>
  );
};

/** Fade in from `at`. */
const Enter: React.FC<{ at: number; dur?: number; children: React.ReactNode }> = ({ at, dur = 12, children }) => {
  const f = useF();
  const k = interpolate(f, [at, at + dur], [0, 1], clamp);
  return k > 0 ? <g opacity={k}>{children}</g> : null;
};

/** Head and shoulders, drawn on. */
const Figure: React.FC<{ x: number; y: number; s?: number; delay?: number }> = ({ x, y, s = 1, delay = 0 }) => (
  <>
    <DrawPath d={circlePath(x, y - 26 * s, 17 * s)} delay={delay} duration={12} strokeWidth={STROKE_THIN * 1.2} />
    <DrawPath
      d={`M ${x - 30 * s} ${y + 26 * s} A ${30 * s} ${30 * s} 0 0 1 ${x + 30 * s} ${y + 26 * s}`}
      delay={delay + 5}
      duration={12}
      strokeWidth={STROKE_THIN * 1.2}
    />
  </>
);

/** A dotted trail along a cubic curve, one dot at a time: footsteps. */
const DotsAlong: React.FC<{ p: number[][]; delay: number; n: number }> = ({ p, delay, n }) => (
  <>
    {new Array(n).fill(0).map((_, i) => {
      const t = (i + 0.5) / n;
      const u = 1 - t;
      const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
      const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
      return <Dot key={i} cx={x} cy={y} r={3.6} delay={delay + i * 1.6} />;
    })}
  </>
);

/** An open arrowhead at `tip`, pointing away from `from`. */
const Arrowhead: React.FC<{ tip: number[]; from: number[]; delay: number }> = ({ tip, from, delay }) => {
  const a = Math.atan2(tip[1] - from[1], tip[0] - from[0]);
  const w = (d: number) => `${tip[0] - Math.cos(a + d) * 18} ${tip[1] - Math.sin(a + d) * 18}`;
  return <DrawPath d={`M ${w(0.5)} L ${tip[0]} ${tip[1]} L ${w(-0.5)}`} delay={delay} duration={6} strokeWidth={STROKE_THIN} />;
};

/** A soft glow disc, for lights. */
const Halo: React.FC<{ cx: number; cy: number; r: number; o: number; id: string }> = ({ cx, cy, r, o, id }) =>
  o > 0 ? (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={INK} stopOpacity={0.55} />
          <stop offset="35%" stopColor={INK} stopOpacity={0.18} />
          <stop offset="100%" stopColor={INK} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke="none" opacity={o} />
    </>
  ) : null;

/** A small filled rectangle that lights up / goes dark. */
const Lit: React.FC<{ x: number; y: number; w: number; h: number; o: number }> = ({ x, y, w, h, o }) =>
  o > 0 ? <rect x={x} y={y} width={w} height={h} fill={INK} stroke="none" opacity={o} /> : null;

/* ------------------------------------------------------------------- scenes */

type SceneProps = { readonly turn: number };

/** 1 · A railing running off into the distance toward a light; the light turns out to be empty. */
const Pasado: React.FC<SceneProps> = ({ turn }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const L = { x: 850, y: 250 };
  const top = (u: number) => [200 + 560 * u, 590 - 280 * u] as const;
  const bot = (u: number) => [200 + 560 * u, 700 - 370 * u] as const;
  const us = new Array(13).fill(0).map((_, i) => 1 - Math.pow(0.8, i));

  // Camera: drift along the rail, then push into the light on "pero".
  const go = spring({ frame: f - turn, fps, config: { damping: 26, stiffness: 55 } });
  const drift = interpolate(f, [0, turn], [0, 1], clamp);
  const s = 1 + 0.06 * drift + 0.9 * go;
  const Fx = 525 + 40 * drift + (L.x - 565) * go;
  const Fy = 450 - 30 * drift + (L.y - 420) * go;
  const Sy = 450 - 20 * go;

  const lightIn = interpolate(f, [12, 28], [0, 1], clamp);
  const flicker = 1 + Math.sin(f / 7) * 0.06;
  const dot = interpolate(f, [turn + 4, turn + 22], [1, 0], clamp);
  const halo = lightIn * interpolate(f, [turn + 4, turn + 40], [1, 0.18], clamp);

  return (
    <g style={{ transform: `translate(${540 - Fx * s}px, ${Sy - Fy * s}px) scale(${s})`, transformOrigin: "0 0" }}>
      <StrokeScale value={useStrokeScale() / s}>
        <Halo cx={L.x} cy={L.y} r={150 * flicker} o={halo} id="pasadoLight" />
        <DrawPath d={`M ${top(0)[0]} ${top(0)[1]} L ${top(1)[0]} ${top(1)[1]}`} duration={24} />
        <DrawPath d={`M ${top(0)[0]} ${top(0)[1] + 16} L ${top(1)[0]} ${top(1)[1] + 7}`} delay={4} duration={24} strokeWidth={STROKE_THIN} />
        <DrawPath d={`M ${bot(0)[0]} ${bot(0)[1]} L ${bot(1)[0]} ${bot(1)[1]}`} delay={6} duration={24} strokeWidth={STROKE_THIN} />
        {us.map((u, i) => (
          <DrawPath
            key={i}
            d={`M ${top(u)[0]} ${top(u)[1] + 16 - 9 * u} L ${bot(u)[0]} ${bot(u)[1]}`}
            delay={10 + i * 2}
            duration={8}
            strokeWidth={STROKE_THIN}
          />
        ))}
        {/* the light at the end */}
        {dot > 0 ? <Dot cx={L.x} cy={L.y} r={16 * dot * flicker} delay={12} /> : null}
        {/* ...and what is left of it: an empty ring */}
        <DrawPath d={circlePath(L.x, L.y, 70)} delay={turn + 8} duration={22} strokeWidth={STROKE_THIN} />
        <Enter at={turn + 24} dur={20}>
          <path d={circlePath(L.x, L.y, 96)} strokeWidth={STROKE_THIN * 0.7} strokeDasharray="4 12" opacity={0.6} />
        </Enter>
      </StrokeScale>
    </g>
  );
};

/** 2 · The old school; the friends in front of it leave. */
const Escuela: React.FC<SceneProps> = ({ turn }) => {
  const f = useF();
  const wave = Math.sin(f / 9) * 5;
  const win = (x: number, y: number, d: number) => (
    <DrawPath key={`${x}-${y}`} d={`M ${x} ${y} h 44 v 52 h -44 Z M ${x + 22} ${y} v 52`} delay={d} duration={10} strokeWidth={STROKE_THIN} />
  );
  return (
    <g transform="translate(0 -10)">
      <DrawPath d="M 200 600 H 880" duration={18} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 300 600 V 330 H 780 V 600" delay={4} duration={22} />
      <DrawPath d="M 280 330 L 540 232 L 800 330" delay={10} duration={18} />
      <DrawPath d={`${circlePath(540, 290, 22)} M 540 290 V 276 M 540 290 L 550 296`} delay={20} duration={12} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 540 232 V 160" delay={22} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d={`M 540 162 Q 572 ${158 + wave} 604 ${170 + wave * 0.6} Q 572 ${184 + wave} 540 190`} delay={28} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 496 600 V 530 A 44 44 0 0 1 584 530 V 600 M 540 486 V 600" delay={18} duration={14} strokeWidth={STROKE_THIN} />
      {[330, 390, 646, 706].flatMap((x, i) => [win(x, 364, 22 + i * 2), win(x, 452, 26 + i * 2)])}
      {/* the friends */}
      {[420, 540, 660].map((x, i) => (
        <Leave key={x} at={turn + 4 + i * 8} dur={18}>
          <Figure x={x} y={676} s={1.05} delay={18 + i * 4} />
        </Leave>
      ))}
    </g>
  );
};

/** 3 · The childhood home, lights on and people inside; they are gone and it rains. */
const Casa: React.FC<SceneProps> = ({ turn }) => {
  const f = useF();
  const lights = interpolate(f, [30, 44], [0, 0.2], clamp) * interpolate(f, [turn + 12, turn + 34], [1, 0], clamp);
  const rainO = interpolate(f, [turn + 16, turn + 30], [0, 0.55], clamp);
  const drops = new Array(26).fill(0).map((_, i) => {
    const x0 = 250 + ((i * 97) % 600);
    const y0 = (i * 173) % 400;
    const y = 225 + ((y0 + (f - turn) * 13) % 400);
    return { x: x0 - (y - 225) * 0.18, y };
  });
  return (
    <g transform="translate(0 -6)">
      {rainO > 0
        ? drops.map((d, i) => (
            <path key={i} d={`M ${d.x} ${d.y} l -5 24`} strokeWidth={STROKE_THIN * 0.8} opacity={d.y > 590 ? 0 : rainO} />
          ))
        : null}
      <DrawPath d="M 200 610 H 880" duration={18} strokeWidth={STROKE_THIN} />
      {/* tree */}
      <DrawPath d="M 282 610 V 520" delay={6} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d={circlePath(282, 478, 46)} delay={10} duration={16} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 390 610 V 400 M 690 610 V 400" delay={4} duration={18} />
      <DrawPath d="M 360 410 L 540 262 L 720 410" delay={10} duration={18} />
      <DrawPath d="M 626 339 V 290 H 662 V 369" delay={20} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 510 610 V 530 H 570 V 610" delay={18} duration={12} strokeWidth={STROKE_THIN} />
      <Lit x={420} y={440} w={70} h={70} o={lights} />
      <Lit x={590} y={440} w={70} h={70} o={lights} />
      <DrawPath d="M 420 440 h 70 v 70 h -70 Z" delay={22} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 590 440 h 70 v 70 h -70 Z" delay={24} duration={10} strokeWidth={STROKE_THIN} />
      {/* the family, in the windows */}
      <Leave at={turn + 4} dur={20} rise={12}>
        <DrawPath d={`${circlePath(455, 472, 12)} M 434 510 A 21 21 0 0 1 476 510`} delay={34} duration={12} strokeWidth={STROKE_THIN} />
      </Leave>
      <Leave at={turn + 10} dur={20} rise={12}>
        <DrawPath d={`${circlePath(625, 484, 9)} M 609 510 A 16 16 0 0 1 641 510`} delay={38} duration={12} strokeWidth={STROKE_THIN} />
      </Leave>
      {/* a cloud comes over */}
      <DrawPath
        d="M 455 214 H 628 A 30 30 0 0 0 626 156 A 46 46 0 0 0 540 136 A 36 36 0 0 0 474 164 A 26 26 0 0 0 455 214 Z"
        delay={turn + 6}
        duration={20}
        strokeWidth={STROKE_THIN * 1.2}
      />
    </g>
  );
};

/** 4 · The café: the cup still steams; the barista who knew your order is gone. */
const Cafe: React.FC<SceneProps> = ({ turn }) => {
  const f = useF();
  const steam = [440, 470, 500].map((x, i) => {
    const t = ((f + i * 17) % 52) / 52;
    const o = interpolate(f, [30, 40], [0, 1], clamp) * interpolate(t, [0, 0.25, 1], [0, 0.8, 0], clamp);
    const y = 486 - t * 60;
    return (
      <path key={x} d={`M ${x} ${y} c -12 -14 12 -24 0 -40`} strokeWidth={STROKE_THIN} opacity={o} />
    );
  });
  return (
    <g transform="translate(0 -14)">
      {/* ceiling and the sign that still says open */}
      <DrawPath d="M 200 170 H 880" duration={16} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 250 170 V 222 M 360 170 V 222" delay={6} duration={8} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 222 222 H 388 V 280 H 222 Z" delay={10} duration={14} strokeWidth={STROKE_THIN} />
      <Enter at={20}>
        <text x={305} y={252} fill={INK} stroke="none" fontFamily={FONT} fontWeight={500} fontSize={26} letterSpacing={2} textAnchor="middle" dominantBaseline="central">
          ABIERTO
        </text>
      </Enter>
      {/* counter */}
      <DrawPath d="M 200 610 H 880 M 200 626 H 880" delay={4} duration={20} strokeWidth={STROKE_THIN} />
      {/* the barista behind it */}
      <Leave at={turn + 10} dur={22}>
        <DrawPath d={circlePath(730, 452, 28)} delay={14} duration={12} strokeWidth={STROKE_THIN * 1.2} />
        <DrawPath d="M 668 610 V 556 A 62 62 0 0 1 792 556 V 610" delay={18} duration={14} strokeWidth={STROKE_THIN * 1.2} />
      </Leave>
      <Leave at={turn + 2} dur={14} rise={14}>
        <DrawPath d="M 546 316 H 714 A 18 18 0 0 1 732 334 V 368 A 18 18 0 0 1 714 386 H 700 L 712 408 L 680 386 H 546 A 18 18 0 0 1 528 368 V 334 A 18 18 0 0 1 546 316 Z" delay={32} duration={16} strokeWidth={STROKE_THIN} />
        <Enter at={42}>
          <text x={630} y={351} fill={INK} stroke="none" fontFamily={FONT} fontWeight={500} fontSize={24} textAnchor="middle" dominantBaseline="central">
            ¿Lo de siempre?
          </text>
        </Enter>
      </Leave>
      {/* the cup */}
      <DrawPath d="M 400 510 H 540 L 530 584 Q 528 598 512 598 H 428 Q 412 598 410 584 Z" delay={10} duration={18} />
      <DrawPath d="M 537 528 C 580 522 580 574 530 570" delay={20} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 372 604 Q 470 616 568 604" delay={14} duration={12} strokeWidth={STROKE_THIN} />
      {steam}
    </g>
  );
};

/** 5 · The same streets; the faces that were yours become strangers'. */
const Calles: React.FC<SceneProps> = ({ turn }) => {
  const f = useF();
  const faces = [
    { x: 380, look: -1 },
    { x: 540, look: 1 },
    { x: 700, look: 1 },
  ];
  return (
    <g transform="translate(0 -20)">
      <DrawPath d="M 170 330 H 910" duration={18} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 170 330 V 292 H 222 V 250 H 270 V 300 H 322 V 270 H 372 V 306 H 420 V 330" delay={8} duration={22} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 660 330 V 300 H 710 V 258 H 762 V 290 H 812 V 240 H 862 V 300 H 910 V 330" delay={10} duration={22} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 572 176 A 34 34 0 1 0 606 226 A 26 26 0 0 1 572 176 Z" delay={16} duration={14} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 320 540 L 505 330 M 760 540 L 575 330" delay={6} duration={18} />
      <DrawPath d="M 540 352 V 366 M 540 392 V 414 M 540 450 V 482" delay={18} duration={10} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 240 560 V 380 Q 240 358 262 358 H 284" delay={12} duration={14} strokeWidth={STROKE_THIN} />
      <DrawPath d="M 840 560 V 380 Q 840 358 818 358 H 796" delay={12} duration={14} strokeWidth={STROKE_THIN} />
      <Dot cx={288} cy={368} r={7} delay={24} />
      <Dot cx={792} cy={368} r={7} delay={24} />
      {/* the faces: familiar, then strangers looking away */}
      {faces.map(({ x, look }, i) => {
        const k = interpolate(f, [turn + 4 + i * 6, turn + 18 + i * 6], [0, 1], clamp);
        const ex = look * 12 * k;
        const smile = 22 * (1 - k);
        const cy = 640;
        return (
          <g key={x}>
            <DrawPath d={circlePath(x, cy, 50)} delay={22 + i * 5} duration={14} />
            <Dot cx={x - 17 + ex} cy={cy - 10} r={5.5} delay={30 + i * 5} />
            <Dot cx={x + 17 + ex} cy={cy - 10} r={5.5} delay={30 + i * 5} />
            <DrawPath
              d={`M ${x - 18 + ex * 0.6} ${cy + 16} Q ${x + ex * 0.6} ${cy + 16 + smile} ${x + 18 + ex * 0.6} ${cy + 16}`}
              delay={32 + i * 5}
              duration={8}
              strokeWidth={STROKE_THIN}
            />
          </g>
        );
      })}
    </g>
  );
};

/** 6 · The buildings stay the same; the sun goes down behind them and the city changes. */
const Edificios: React.FC<SceneProps> = ({ turn }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const blds = [
    [220, 320, 450],
    [335, 455, 330],
    [470, 570, 410],
    [585, 710, 290],
    [725, 850, 400],
  ];
  const set = spring({ frame: f - turn, fps, config: { damping: 30, stiffness: 30 } });
  const sunY = 200 + 400 * set;
  const night = interpolate(f, [turn + 16, turn + 40], [0, 1], clamp);
  const windows = blds.flatMap(([x0, x1, t], b) => {
    const out: { x: number; y: number; on: number }[] = [];
    for (let y = t + 30; y < 600; y += 46) {
      for (let x = x0 + 20; x + 16 < x1 - 10; x += 32) {
        const n = out.length + b * 7;
        const on = (n * 37 + b * 11) % 5 < 2 ? 1 : 0;
        out.push({ x, y, on: on * interpolate(f, [turn + 20 + (n % 11) * 3, turn + 26 + (n % 11) * 3], [0, 0.85], clamp) });
      }
    }
    return out;
  });
  return (
    <g transform="translate(0 -30)">
      {/* the sun, which sets behind the rooftops */}
      <Halo cx={648} cy={sunY} r={140} o={interpolate(f, [10, 24], [0, 1], clamp) * (1 - night * 0.9)} id="sunHalo" />
      <DrawPath d={circlePath(648, sunY, 44)} delay={8} duration={16} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        const o = 1 - interpolate(f, [turn, turn + 12], [0, 1], clamp);
        return o > 0 ? (
          <DrawPath
            key={i}
            d={`M ${648 + Math.cos(a) * 60} ${sunY + Math.sin(a) * 60} L ${648 + Math.cos(a) * 80} ${sunY + Math.sin(a) * 80}`}
            delay={20 + i}
            duration={6}
            strokeWidth={STROKE_THIN}
            opacity={o}
          />
        ) : null;
      })}
      {blds.map(([x0, x1, t], i) => (
        <DrawPath key={i} d={`M ${x0} 640 V ${t} H ${x1} V 640 Z`} delay={4 + i * 3} duration={18} occlude />
      ))}
      <DrawPath d="M 180 640 H 900" duration={16} strokeWidth={STROKE_THIN} />
      {windows.map((w, i) => (
        <g key={i}>
          <Lit x={w.x} y={w.y} w={14} h={20} o={w.on} />
          <DrawPath d={`M ${w.x} ${w.y} h 14 v 20 h -14 Z`} delay={16 + (i % 9) * 2} duration={6} strokeWidth={STROKE_THIN * 0.8} opacity={0.8} />
        </g>
      ))}
      {/* night: moon and a few stars */}
      <Enter at={turn + 26} dur={20}>
        <path d="M 300 150 A 36 36 0 1 0 336 204 A 28 28 0 0 1 300 150 Z" strokeWidth={STROKE_THIN} />
      </Enter>
      {[
        [430, 190],
        [520, 240],
        [640, 170],
        [860, 230],
        [220, 260],
      ].map(([x, y], i) => (
        <Enter key={i} at={turn + 34 + i * 4} dur={10}>
          <circle cx={x} cy={y} r={3.5 + Math.sin((f + i * 13) / 8) * 1} fill={INK} stroke="none" />
        </Enter>
      ))}
    </g>
  );
};

/** 7 · The past is somewhere you go and come back from; you live here: a pin drops. */
const Presente: React.FC<SceneProps> = ({ turn }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: f - turn - 4, fps, config: { damping: 9, stiffness: 110 } });
  const pinY = Math.min(0, -360 * (1 - drop));
  const land = turn + 12;
  const dim = interpolate(f, [turn, turn + 24], [1, 0.3], clamp);
  const flash = interpolate(f, [land, land + 6, land + 40], [0, 1, 0.35], clamp);
  return (
    <g transform="translate(0 -20)">
      <DrawPath d="M 170 640 H 910" duration={18} strokeWidth={STROKE_THIN} />
      <g opacity={dim}>
        <DrawPath d="M 242 640 V 566 M 358 640 V 566" delay={6} duration={10} strokeWidth={STROKE_THIN} />
        <DrawPath d="M 224 576 L 300 510 L 376 576" delay={10} duration={12} strokeWidth={STROKE_THIN} />
        <DrawPath d="M 286 640 V 600 H 314 V 640" delay={16} duration={8} strokeWidth={STROKE_THIN} />
        {/* go... */}
        <DotsAlong p={[[600, 600], [560, 400], [400, 380], [336, 480]]} delay={22} n={15} />
        <Arrowhead tip={[330, 492]} from={[372, 420]} delay={46} />
        {/* ...and come back */}
        <DotsAlong p={[[384, 626], [440, 560], [540, 556], [592, 616]]} delay={52} n={11} />
        <Arrowhead tip={[600, 628]} from={[560, 568]} delay={72} />
      </g>
      {/* here */}
      <Halo cx={660} cy={470} r={220} o={flash} id="pinHalo" />
      {f >= turn + 4 ? (
        <g transform={`translate(0 ${pinY})`}>
          <path d="M 660 634 C 634 590 600 552 600 500 A 60 60 0 1 1 720 500 C 720 552 686 590 660 634 Z" strokeWidth={STROKE} />
          <path d={circlePath(660, 498, 22)} strokeWidth={STROKE_THIN} />
        </g>
      ) : null}
      {[0, 1, 2].map((i) => {
        const t = f - land - i * 14;
        if (t < 0 || t > 40) {
          return null;
        }
        const k = t / 40;
        return <ellipse key={i} cx={660} cy={640} rx={30 + 150 * k} ry={8 + 30 * k} strokeWidth={STROKE_THIN} opacity={0.8 * (1 - k)} />;
      })}
    </g>
  );
};

/** The drawing for each scene, in order. */
const SCENE_ART: React.FC<SceneProps>[] = [Pasado, Escuela, Casa, Cafe, Calles, Edificios, Presente];

export type VisitaScene = { start: number; end: number; turn: number };
export type VisitaChunk = { text: string; start: number; end: number };
export type VisitaProps = {
  /** Scene windows in seconds; `turn` is where its "pero" lands. */
  readonly scenes?: VisitaScene[];
  /** Caption chunks in seconds; a leading `*` makes it the line's landing word. */
  readonly chunks?: VisitaChunk[];
  readonly seconds?: number;
};

/** Timing of the reference video, used until a voice-over sets its own. */
const DEFAULT_SCENES: VisitaScene[] = [
  { start: 0, end: 6.95, turn: 5.0 },
  { start: 6.95, end: 10.95, turn: 9.05 },
  { start: 10.95, end: 15.9, turn: 13.5 },
  { start: 15.9, end: 21.3, turn: 18.75 },
  { start: 21.3, end: 26.3, turn: 23.75 },
  { start: 26.3, end: 31.25, turn: 28.75 },
  { start: 31.25, end: VISITA_SECONDS, turn: 33.8 },
];

const FADE = 8;

const Shot: React.FC<{ turn: number; C: React.FC<SceneProps>; last: boolean }> = ({ turn, C, last }) => {
  const f = useF();
  const { durationInFrames } = useVideoConfig();
  const out = last ? 20 : FADE;
  const o = interpolate(f, [0, FADE], [0, 1], clamp) * interpolate(f, [durationInFrames - out, durationInFrames], [1, 0], clamp);
  const push = interpolate(f, [0, durationInFrames], [1, 1.04], clamp);
  const flash = interpolate(f, [turn, turn + 6, turn + 30], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${push})` }}>
      <Canvas scale={0.88} glowOpacity={0.3 + 0.35 * flash}>
        <DrawSpeed value={1}>
          <C turn={turn} />
        </DrawSpeed>
      </Canvas>
    </AbsoluteFill>
  );
};

/** One caption chunk: pops in, holds, cuts to the next. */
const Chunk: React.FC<{ text: string }> = ({ text }) => {
  const f = useF();
  const strong = text.startsWith("*");
  const p = interpolate(f, [0, 5], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 858,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: strong ? 72 : 60,
          color: INK,
          opacity: p,
          transform: `scale(${0.9 + 0.1 * p})`,
          textShadow: "0 0 24px rgba(242,242,242,0.3)",
          letterSpacing: "0.01em",
        }}
      >
        {strong ? text.slice(1) : text}
      </div>
    </AbsoluteFill>
  );
};

/** Chunk timings: each line's time split by chunk length. */
export const visitaChunks = (): VisitaChunk[] =>
  VISITA_LINES.flatMap((line) => {
    const w = line.chunks.map((c) => c.replace("*", "").length + 4);
    const total = w.reduce((a, b) => a + b, 0);
    let t = line.start;
    return line.chunks.map((text, i) => {
      const start = t;
      t += ((line.end - line.start) * w[i]) / total;
      return { text, start, end: t };
    });
  });

export const Visita: React.FC<VisitaProps> = ({ scenes = DEFAULT_SCENES, chunks }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={Math.round(s.start * fps)} durationInFrames={Math.round((s.end - s.start) * fps)}>
          <Shot turn={Math.round((s.turn - s.start) * fps)} C={SCENE_ART[i]} last={i === scenes.length - 1} />
        </Sequence>
      ))}
      {(chunks ?? visitaChunks()).map((c, i) => (
        <Sequence key={`c${i}`} from={Math.round(c.start * fps)} durationInFrames={Math.max(1, Math.round((c.end - c.start) * fps))}>
          <Chunk text={c.text} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
