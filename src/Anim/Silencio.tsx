import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { circlePath, DrawPath } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { Glow, poly, rnd, Shot, useScene } from "./Invisible";
import { FONT } from "./Visita";

/**
 * "Silencio" (vertical, for Reels): we fill every silence because what we
 * avoid shows up there. A glass of water with sand: shake it and it never
 * clears; leave it still and the sand settles.
 *
 * Vertical 1080x1920. The art is drawn on the usual 1080 square, which the
 * canvas centres (y 420..1500). Text sits inside Instagram's safe zone: clear
 * of the top bar (260 px), the caption/user block at the bottom (480 px) and
 * the like/comment column on the right (160 px).
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const CY = 380;

/** Sound waves next to a source: ((( ))) arcs that pulse outward. */
const Waves: React.FC<{ x: number; y: number; dir?: 1 | -1; on: number; n?: number }> = ({ x, y, dir = 1, on, n = 3 }) => {
  const { f } = useScene();
  return on > 0 ? (
    <g opacity={on}>
      {new Array(n).fill(0).map((_, i) => {
        const r = 22 + i * 20 + ((f * 0.8) % 20);
        const a = 0.75;
        return (
          <path
            key={i}
            d={`M ${x + dir * Math.cos(a) * r} ${y - Math.sin(a) * r} A ${r} ${r} 0 0 ${dir === 1 ? 1 : 0} ${x + dir * Math.cos(a) * r} ${y + Math.sin(a) * r}`}
            strokeWidth={STROKE_THIN}
            opacity={0.85 - i * 0.22}
          />
        );
      })}
    </g>
  ) : null;
};

/** Icon-style head in profile looking right (same geometry as Metacognición). */
const head = (cx: number, cy: number, r: number) => {
  const P = (kx: number, ky: number) => `${(cx + r * kx).toFixed(1)} ${(cy + r * ky).toFixed(1)}`;
  return `M ${P(-0.42, 2.0)} L ${P(-0.5, 0.866)} A ${r} ${r} 0 1 1 ${P(1, 0)} L ${P(1.3, 0.55)} L ${P(1.06, 0.62)} L ${P(1.06, 1.16)} L ${P(0.62, 1.36)} L ${P(0.62, 2.0)}`;
};

/** The glass and the sand in it. `stir` 1 = shaken, 0 = still; `settle` 0..1 how far the sand has come down. */
const GL = { top: 250, bot: 640, wt: 140, wb: 105 };
const glassX = (y: number, side: -1 | 1) => CX + side * (GL.wt + ((GL.wb - GL.wt) * (y - GL.top)) / (GL.bot - GL.top));
const Glass: React.FC<{ stir: number; settle: number; draw?: boolean }> = ({ stir, settle, draw = true }) => {
  const { f } = useScene();
  const shakeX = stir * Math.sin(f / 2.2) * 10;
  const wl = GL.top + 50;
  const surf = new Array(25).fill(0).map((_, i) => {
    const x0 = glassX(wl, -1) + 6;
    const x1 = glassX(wl, 1) - 6;
    const x = x0 + ((x1 - x0) * i) / 24;
    return [x, wl + Math.sin(i / 3 + f / 3) * 7 * stir];
  });
  const grains = new Array(70).fill(0).map((_, i) => {
    // where a grain rests on the bottom
    const restX = CX + (rnd(i) - 0.5) * 2 * (GL.wb - 18);
    const heap = 1 - Math.abs(restX - CX) / GL.wb;
    const restY = GL.bot - 10 - rnd(i + 40) * (14 + 26 * heap);
    // where it swirls while the water moves
    const ang = rnd(i + 80) * Math.PI * 2 + f * (0.05 + rnd(i + 3) * 0.05);
    const rad = 30 + rnd(i + 9) * 85;
    const swX = CX + Math.cos(ang) * rad;
    const swY = (wl + GL.bot) / 2 + 30 + Math.sin(ang) * rad * 1.15;
    // falling: each grain lands at its own moment
    const land = Math.min(1, Math.max(0, (settle - rnd(i + 21) * 0.6) / 0.4));
    const k = stir > 0 ? 0 : land;
    return { x: swX + (restX - swX) * k, y: swY + (restY - swY) * k, r: 3 + rnd(i + 5) * 2.5 };
  });
  const murk = stir * 0.12 + (1 - settle) * 0.1 * (stir > 0 ? 0 : 1);
  const outline = `M ${glassX(GL.top, -1)} ${GL.top} L ${glassX(GL.bot, -1)} ${GL.bot - 12} Q ${glassX(GL.bot, -1) + 2} ${GL.bot} ${glassX(GL.bot, -1) + 14} ${GL.bot} L ${glassX(GL.bot, 1) - 14} ${GL.bot} Q ${glassX(GL.bot, 1) - 2} ${GL.bot} ${glassX(GL.bot, 1)} ${GL.bot - 12} L ${glassX(GL.top, 1)} ${GL.top}`;
  return (
    <g transform={`translate(${shakeX} 0)`}>
      {murk > 0 ? <path d={poly([[glassX(wl, -1), wl], [glassX(wl, 1), wl], [glassX(GL.bot, 1), GL.bot], [glassX(GL.bot, -1), GL.bot]])} fill={INK} stroke="none" opacity={murk} /> : null}
      {grains.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={INK} stroke="none" opacity={0.85} />
      ))}
      <path d={poly(surf, false)} strokeWidth={STROKE_THIN} opacity={0.8} />
      {draw ? <DrawPath d={outline} duration={18} strokeWidth={STROKE * 1.1} /> : <path d={outline} strokeWidth={STROKE * 1.1} />}
    </g>
  );
};

/* ------------------------------------------------------------------ scenes */

/** You get home: the door opens and light comes in. */
const Casa: React.FC = () => {
  const { f, dur } = useScene();
  const open = interpolate(f, [8, dur * 0.7], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const W = 190;
  const H = 360;
  const x0 = CX - W / 2;
  const y0 = CY - H / 2;
  const leaf = W * (1 - 0.72 * open);
  const skew = 36 * open;
  return (
    <>
      <DrawPath d={`M ${x0} ${y0 + H} V ${y0} H ${x0 + W} V ${y0 + H}`} duration={14} strokeWidth={STROKE_THIN * 1.3} />
      <DrawPath d={`M ${x0 - 140} ${y0 + H} H ${x0 + W + 140}`} duration={14} strokeWidth={STROKE_THIN} opacity={0.6} />
      {open > 0 ? <path d={poly([[x0 + leaf, y0 + H], [x0 + W, y0 + H], [x0 + W + 170 * open, y0 + H + 110], [x0 + leaf + 50 * open, y0 + H + 110]])} fill={INK} stroke="none" opacity={0.1 * open} /> : null}
      <path d={poly([[x0, y0], [x0 + leaf, y0 - skew], [x0 + leaf, y0 + H + skew], [x0, y0 + H]])} strokeWidth={STROKE_THIN * 1.3} />
      <circle cx={x0 + leaf - 18} cy={y0 + H / 2} r={5} fill={INK} stroke="none" />
    </>
  );
};

/** The TV, a podcast, the phone: each one switches on, each one makes noise. */
const Aparatos: React.FC = () => {
  const { f, dur } = useScene();
  const at = (k: number) => interpolate(f, [dur * k, dur * k + 6], [0, 1], clamp);
  const tv = at(0);
  const hp = at(0.3);
  const ph = at(0.6);
  return (
    <>
      {/* TV */}
      <g opacity={tv}>
        <path d={`M 250 190 H 470 A 14 14 0 0 1 484 204 V 330 A 14 14 0 0 1 470 344 H 250 A 14 14 0 0 1 236 330 V 204 A 14 14 0 0 1 250 190 Z`} strokeWidth={STROKE_THIN * 1.3} />
        <path d="M 330 344 L 320 372 H 400 L 390 344" strokeWidth={STROKE_THIN * 1.2} />
        <path d="M 252 206 H 468 V 328 H 252 Z" fill={INK} stroke="none" opacity={0.12} />
      </g>
      <Waves x={500} y={267} on={tv} />
      {/* headphones */}
      <g opacity={hp} transform="translate(-60 0)">
        <path d="M 640 360 V 330 A 80 80 0 0 1 800 330 V 360" strokeWidth={STROKE_THIN * 1.4} />
        <path d="M 622 352 h 30 a 6 6 0 0 1 6 6 v 56 a 6 6 0 0 1 -6 6 h -30 a 6 6 0 0 1 -6 -6 v -56 a 6 6 0 0 1 6 -6 Z" strokeWidth={STROKE_THIN * 1.3} />
        <path d="M 788 352 h 30 a 6 6 0 0 1 6 6 v 56 a 6 6 0 0 1 -6 6 h -30 a 6 6 0 0 1 -6 -6 v -56 a 6 6 0 0 1 6 -6 Z" strokeWidth={STROKE_THIN * 1.3} />
      </g>
      <Waves x={780} y={386} on={hp} n={2} />
      {/* phone */}
      <g opacity={ph}>
        <path d="M 446 450 h 100 a 18 18 0 0 1 18 18 v 180 a 18 18 0 0 1 -18 18 h -100 a 18 18 0 0 1 -18 -18 v -180 a 18 18 0 0 1 18 -18 Z" strokeWidth={STROKE_THIN * 1.3} />
        <path d="M 444 476 H 548 V 640 H 444 Z" fill={INK} stroke="none" opacity={0.14} />
        <path d="M 482 462 h 28" strokeWidth={STROKE_THIN} />
      </g>
      <Waves x={590} y={558} on={ph} />
    </>
  );
};

/** Anything but silence: noise fills the whole frame. */
const Ruido: React.FC = () => {
  const { f } = useScene();
  return (
    <>
      {new Array(13).fill(0).map((_, row) => {
        const y = 150 + row * 40;
        const amp = 8 + rnd(row) * 16;
        const fr = 0.03 + rnd(row + 30) * 0.05;
        let d = "";
        for (let x = 230; x <= 830; x += 8) {
          const v = Math.sin(x * fr + f * (0.3 + rnd(row + 7) * 0.3)) * amp * (0.6 + 0.4 * Math.sin(x * 0.011 + row));
          d += `${d ? " L" : "M"} ${x} ${(y + v).toFixed(1)}`;
        }
        const o = interpolate(f, [row * 1.2, row * 1.2 + 6], [0, 0.4 + rnd(row + 3) * 0.5], clamp);
        return <path key={row} d={d} strokeWidth={STROKE_THIN} opacity={o} />;
      })}
    </>
  );
};

/** In the silence, what you were avoiding shows up: noise goes flat, a cloud in your head. */
const Esquivar: React.FC = () => {
  const { f, dur } = useScene();
  const flat = interpolate(f, [0, 12], [1, 0], clamp);
  const cloud = interpolate(f, [dur * 0.35, dur * 0.6], [0, 1], clamp);
  let d = "";
  for (let x = 230; x <= 830; x += 8) {
    d += `${d ? " L" : "M"} ${x} ${(640 + Math.sin(x * 0.05 + f * 0.4) * 18 * flat).toFixed(1)}`;
  }
  const hx = 450;
  const hy = 330;
  return (
    <>
      <path d={d} strokeWidth={STROKE_THIN} opacity={0.6} />
      <DrawPath d={head(hx, hy, 120)} duration={22} />
      {cloud > 0 ? (
        <g opacity={cloud} style={{ transform: `scale(${0.7 + 0.3 * cloud})`, transformOrigin: `${hx - 10}px ${hy - 10}px`, transformBox: "view-box" }}>
          <path d={`M ${hx - 70} ${hy + 10} H ${hx + 52} A 22 22 0 0 0 ${hx + 50} ${hy - 32} A 34 34 0 0 0 ${hx - 12} ${hy - 46} A 28 28 0 0 0 ${hx - 58} ${hy - 24} A 18 18 0 0 0 ${hx - 70} ${hy + 10} Z`} fill={INK} fillOpacity={0.25} strokeWidth={STROKE_THIN * 1.2} />
        </g>
      ) : null}
    </>
  );
};

/** Like a glass of water with sand. */
const Vaso: React.FC = () => <Glass stir={0} settle={1} />;

/** Keep moving it and it never clears. */
const Mover: React.FC = () => <Glass stir={1} settle={0} draw={false} />;

/** Leave it still a minute and the sand comes down. */
const Quieto: React.FC = () => {
  const { f, dur } = useScene();
  return <Glass stir={0} settle={interpolate(f, [0, dur * 0.95], [0, 0.75], clamp)} draw={false} />;
};

/** Try it today: one minute. */
const Minuto: React.FC = () => {
  const { f, dur } = useScene();
  const R = 170;
  const k = interpolate(f, [6, dur * 0.95], [0, 1], clamp);
  const a = -Math.PI / 2 + k * Math.PI * 2;
  return (
    <>
      <DrawPath d={circlePath(CX, CY + 40, R)} duration={14} strokeWidth={STROKE_THIN} opacity={0.5} />
      {k > 0 ? (
        <path d={`M ${CX} ${CY + 40 - R} A ${R} ${R} 0 ${k > 0.5 ? 1 : 0} 1 ${CX + Math.cos(a) * R} ${CY + 40 + Math.sin(a) * R}`} strokeWidth={STROKE * 1.3} />
      ) : null}
      <path d={`M ${CX - 14} ${CY + 40 - R - 26} h 28`} strokeWidth={STROKE_THIN * 1.3} />
      <circle cx={CX} cy={CY + 40} r={6} fill={INK} stroke="none" />
    </>
  );
};

/** No screen, no music: both go dark and get crossed out. */
const SinNada: React.FC = () => {
  const { f, dur } = useScene();
  const off = interpolate(f, [dur * 0.2, dur * 0.45], [0, 1], clamp);
  const cross = interpolate(f, [dur * 0.35, dur * 0.6], [0, 1], clamp);
  return (
    <>
      <path d="M 316 250 h 100 a 18 18 0 0 1 18 18 v 180 a 18 18 0 0 1 -18 18 h -100 a 18 18 0 0 1 -18 -18 v -180 a 18 18 0 0 1 18 -18 Z" strokeWidth={STROKE_THIN * 1.3} />
      <path d="M 314 276 H 418 V 440 H 314 Z" fill={INK} stroke="none" opacity={0.18 * (1 - off)} />
      <path d={`M 290 480 L ${290 + 150 * cross} ${480 - 250 * cross}`} strokeWidth={STROKE_THIN * 1.4} />
      {/* a music note */}
      <g opacity={1 - 0.5 * off}>
        <path d="M 640 440 V 280 L 760 256 V 410" strokeWidth={STROKE_THIN * 1.4} />
        <path d={circlePath(620, 442, 22)} strokeWidth={STROKE_THIN * 1.3} />
        <path d={circlePath(740, 412, 22)} strokeWidth={STROKE_THIN * 1.3} />
      </g>
      <path d={`M 590 480 L ${590 + 200 * cross} ${480 - 250 * cross}`} strokeWidth={STROKE_THIN * 1.4} />
    </>
  );
};

/** Let the sand come down: the last grains settle and the water clears. */
const Baje: React.FC = () => {
  const { f, dur } = useScene();
  return <Glass stir={0} settle={interpolate(f, [0, dur * 0.8], [0.75, 1], clamp)} draw={false} />;
};

/** In silence, what matters is heard: a flat line lets one soft wave through. */
const Escucha: React.FC = () => {
  const { f, dur } = useScene();
  const t = interpolate(f, [dur * 0.15, dur * 0.85], [0, 1], clamp);
  const px = 260 + 500 * t;
  let d = "";
  for (let x = 230; x <= 830; x += 6) {
    const v = Math.exp(-Math.pow((x - px) / 50, 2)) * 70 * Math.sin((x - px) / 16);
    d += `${d ? " L" : "M"} ${x} ${(CY + 40 + v).toFixed(1)}`;
  }
  return (
    <>
      <Glow cx={px} cy={CY + 40} r={140} o={0.7} id="escGlow" />
      <path d={d} strokeWidth={STROKE_THIN * 1.3} />
    </>
  );
};

/* ------------------------------------------------------------- timing */

export type SilencioScene = { start: number; end: number };
export type SilencioLine = { text: string; start: number; end: number; scene: number; row: number; words?: number[] };
export type SilencioProps = { scenes?: SilencioScene[]; lines?: SilencioLine[]; seconds?: number };

const ART: React.FC[] = [Casa, Aparatos, Ruido, Esquivar, Vaso, Mover, Quieto, Minuto, SinNada, Baje, Escucha];

export const SILENCIO_SCRIPT: string[][] = [
  ["Llegás a casa y lo primero", "que hacés es prender algo."],
  ["La tele. Un podcast.", "El celular."],
  ["Cualquier cosa,", "menos el silencio."],
  ["Porque en el silencio aparece", "lo que venías esquivando."],
  ["Es como un vaso", "de agua con arena."],
  ["Si lo movés todo el tiempo,", "nunca se aclara."],
  ["Si lo dejás quieto un minuto,", "la arena baja."],
  ["Probá hoy:", "un minuto, sin nada."],
  ["Sin pantalla, sin música."],
  ["Dejá que la arena baje."],
  ["En el silencio,", "lo que importa", "se escucha mejor."],
];

const estimate = () => {
  const scenes: SilencioScene[] = [];
  const lines: SilencioLine[] = [];
  let t = 0.4;
  SILENCIO_SCRIPT.forEach((rows, si) => {
    const start = si === 0 ? 0 : t - 0.1;
    let rt = t;
    rows.forEach((text, row) => {
      lines.push({ text, start: rt, end: 0, scene: si, row });
      rt += text.length / 14 + 0.08;
    });
    t = rt + 0.4;
    scenes.push({ start, end: 0 });
  });
  const seconds = t + 1.6;
  scenes.forEach((s, i) => (s.end = i + 1 < scenes.length ? scenes[i + 1].start : seconds));
  lines.forEach((l) => (l.end = scenes[l.scene].end));
  return { scenes, lines, seconds };
};

const DEFAULT = estimate();
export const SILENCIO_FRAMES = Math.round(DEFAULT.seconds * FPS);

/** Text block inside the Reels safe zone: centred, 760 px wide, rows from y 1210. */
const SafeText: React.FC<{ text: string; row: number; times?: number[] }> = ({ text, row, times }) => {
  const f = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const words = text.split(" ");
  const step = Math.min(5, 26 / words.length);
  const at = (i: number) => (times && times[i] !== undefined ? times[i] * fps : i * step);
  const out = interpolate(f, [durationInFrames - 3, durationInFrames], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 1210 + row * 64,
        left: 160,
        right: 160,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 46,
        lineHeight: 1.2,
        color: INK,
        opacity: out,
        textShadow: "0 0 18px rgba(242,242,242,0.25)",
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

export const Silencio: React.FC<SilencioProps> = ({ scenes = DEFAULT.scenes, lines = DEFAULT.lines }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={Math.round(s.start * fps)} durationInFrames={Math.max(1, Math.round((s.end - s.start) * fps))}>
          <Shot C={ART[i]} last={i === scenes.length - 1} scale={1} />
        </Sequence>
      ))}
      {lines.map((l, i) => (
        <Sequence key={`t${i}`} from={Math.round(l.start * fps)} durationInFrames={Math.max(1, Math.round((l.end - l.start) * fps))}>
          <SafeText text={l.text} row={l.row} times={l.words} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
