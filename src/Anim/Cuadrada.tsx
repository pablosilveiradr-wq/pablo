import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Canvas, DrawPath, DrawSpeed } from "./primitives";
import { BG, FPS, INK, STROKE, STROKE_THIN } from "./theme";
import { FONT } from "./Visita";

/**
 * "Cuadrada": box breathing 4·4·4·4, one round. Vertical for Reels.
 * Lungs in line: on the in-breath the airways light up from the trachea down
 * and the lungs swell; held full; on the out-breath they go dark from the tips
 * back up; held empty. Above, the phase and a 1-2-3-4 count; below, a square
 * whose dot walks one side per phase. Everything sits inside the Reels safe
 * zone (top 260, bottom 480, right 160 px). No audio.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const s = (sec: number) => Math.round(sec * FPS);

const INTRO = 1.6;
const PHASE = 4;
export const CUADRADA_FRAMES = s(INTRO + 4 * PHASE + 1.6);
const PHASES = ["INHALÁ", "SOSTENÉ", "EXHALÁ", "SOSTENÉ"];

/* ---------------------------------------------------------------- lungs */

const CX = 540;
type Branch = { x1: number; y1: number; x2: number; y2: number; d: number };

/** Airways: trachea, two bronchi, then a small branching tree into each lung. */
const AIRWAYS: Branch[] = (() => {
  const out: Branch[] = [{ x1: CX, y1: 210, x2: CX, y2: 340, d: 0 }];
  const grow = (x: number, y: number, ang: number, len: number, d: number, side: number) => {
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len;
    out.push({ x1: x, y1: y, x2, y2, d });
    if (d >= 4) {
      return;
    }
    const spread = 0.42 - d * 0.04;
    grow(x2, y2, ang - spread * side, len * 0.78, d + 1, side);
    grow(x2, y2, ang + spread * side * 0.9, len * 0.74, d + 1, side);
  };
  // each side: main bronchus heading down and out
  grow(CX, 340, (Math.PI * 2) / 3, 94, 1, 1); // left (viewer's)
  grow(CX, 340, Math.PI / 3, 94, 1, -1); // right
  return out;
})();
const TIPS = AIRWAYS.filter((b) => b.d === 4);

const lobe = (side: 1 | -1) => {
  const X = (x: number) => CX + side * (x - CX);
  return `M ${X(512)} 352 C ${X(480)} 268 ${X(380)} 286 ${X(344)} 378 C ${X(306)} 474 ${X(296)} 590 ${X(318)} 650 C ${X(336)} 700 ${X(404)} 704 ${X(474)} 682 C ${X(504)} 672 ${X(516)} 648 ${X(516)} 616 Z`;
};

const Lungs: React.FC<{ fill: number; frame: number }> = ({ fill, frame }) => {
  const swell = 1 + 0.06 * fill;
  const glow = 0.15 + 0.85 * fill;
  return (
    <g style={{ transform: `scale(${swell})`, transformOrigin: `${CX}px 470px`, transformBox: "view-box" }}>
      <defs>
        <radialGradient id="lungGlow">
          <stop offset="0%" stopColor={INK} stopOpacity={0.35} />
          <stop offset="60%" stopColor={INK} stopOpacity={0.08} />
          <stop offset="100%" stopColor={INK} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={CX} cy={500} rx={300} ry={260} fill="url(#lungGlow)" stroke="none" opacity={0.2 + 0.8 * fill} />
      <DrawPath d={lobe(1)} duration={28} strokeWidth={STROKE_THIN * 1.3} />
      <DrawPath d={lobe(-1)} duration={28} strokeWidth={STROKE_THIN * 1.3} />
      {/* the airways: dim always, lit as far as the air has reached */}
      {AIRWAYS.map((b, i) => {
        const lit = Math.max(0, Math.min(1, fill * 5.2 - b.d));
        return (
          <g key={i}>
            <path d={`M ${b.x1} ${b.y1} L ${b.x2} ${b.y2}`} strokeWidth={b.d <= 1 ? STROKE : STROKE_THIN} opacity={0.22} />
            {lit > 0 ? (
              <path
                d={`M ${b.x1} ${b.y1} L ${b.x1 + (b.x2 - b.x1) * lit} ${b.y1 + (b.y2 - b.y1) * lit}`}
                strokeWidth={(b.d <= 1 ? STROKE * 1.2 : STROKE_THIN * 1.2) * (1 + 0.15 * glow)}
              />
            ) : null}
          </g>
        );
      })}
      {/* air sacs at the tips, once the air gets there */}
      {TIPS.map((b, i) => {
        const o = Math.max(0, Math.min(1, fill * 5.2 - 4.4)) * (0.75 + 0.25 * Math.sin(frame / 9 + i));
        return o > 0 ? <circle key={i} cx={b.x2} cy={b.y2} r={6} fill={INK} stroke="none" opacity={o} /> : null;
      })}
    </g>
  );
};

/* ------------------------------------------------------------- the box */

const BOX = { x: 540, y: 805, h: 70 };
const corners = [
  [BOX.x - BOX.h, BOX.y + BOX.h], // start: bottom left
  [BOX.x - BOX.h, BOX.y - BOX.h], // up: inhale
  [BOX.x + BOX.h, BOX.y - BOX.h], // across: hold
  [BOX.x + BOX.h, BOX.y + BOX.h], // down: exhale
  [BOX.x - BOX.h, BOX.y + BOX.h], // back: hold
];

const Box: React.FC<{ phase: number; t: number; on: number }> = ({ phase, t, on }) => {
  const a = corners[Math.min(3, phase)];
  const b = corners[Math.min(3, phase) + 1];
  const x = a[0] + (b[0] - a[0]) * t;
  const y = a[1] + (b[1] - a[1]) * t;
  return (
    <g opacity={on}>
      <path d={`M ${corners[0][0]} ${corners[0][1]} L ${corners[1][0]} ${corners[1][1]} L ${corners[2][0]} ${corners[2][1]} L ${corners[3][0]} ${corners[3][1]} Z`} strokeWidth={STROKE_THIN} opacity={0.45} />
      {/* sides already done stay bright */}
      {new Array(Math.min(4, phase)).fill(0).map((_, i) => (
        <path key={i} d={`M ${corners[i][0]} ${corners[i][1]} L ${corners[i + 1][0]} ${corners[i + 1][1]}`} strokeWidth={STROKE} />
      ))}
      {phase < 4 ? <path d={`M ${a[0]} ${a[1]} L ${x} ${y}`} strokeWidth={STROKE} /> : null}
      <circle cx={phase < 4 ? x : corners[0][0]} cy={phase < 4 ? y : corners[0][1]} r={11} fill={INK} stroke="none" />
    </g>
  );
};

/* ----------------------------------------------------------- the reel */

export const Cuadrada: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = s(INTRO);
  const P = s(PHASE);
  const rel = f - t0;
  const phase = rel < 0 ? -1 : Math.min(4, Math.floor(rel / P));
  const pt = rel < 0 ? 0 : phase >= 4 ? 1 : (rel - phase * P) / P;

  // How full the lungs are: fill on 1, full on 2, empty on 3, empty on 4.
  const fill =
    phase === 0 ? pt : phase === 1 ? 1 : phase === 2 ? 1 - pt : 0;
  const count = phase >= 0 && phase < 4 ? Math.min(4, Math.floor(pt * 4) + 1) : 0;
  const pop = phase >= 0 && phase < 4 ? interpolate((pt * 4) % 1, [0, 0.15], [1.25, 1], clamp) : 1;
  const out = interpolate(f, [CUADRADA_FRAMES - 15, CUADRADA_FRAMES], [1, 0], clamp);
  const introText = interpolate(f, [4, 14, t0 - 6, t0], [0, 1, 1, 0], clamp);
  const boxOn = interpolate(f, [t0 - 10, t0], [0, 1], clamp);
  const label = phase >= 0 && phase < 4 ? PHASES[phase] : "";
  const labelIn = phase >= 0 && phase < 4 ? interpolate(rel - phase * P, [0, 6], [0, 1], clamp) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: out }}>
      <Canvas scale={1} glowOpacity={0.25 + 0.25 * fill}>
        <DrawSpeed value={1}>
          <Lungs fill={fill} frame={f} />
          <Box phase={Math.max(0, phase)} t={phase < 0 ? 0 : pt} on={boxOn} />
        </DrawSpeed>
      </Canvas>
      {/* intro: the pattern */}
      <div style={{ position: "absolute", top: 330, left: 160, right: 160, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 56, letterSpacing: "0.12em", color: INK, opacity: introText }}>
        4 · 4 · 4 · 4
      </div>
      {/* phase and count */}
      <div style={{ position: "absolute", top: 300, left: 160, right: 160, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 64, letterSpacing: "0.14em", color: INK, opacity: labelIn, textShadow: "0 0 22px rgba(242,242,242,0.35)" }}>
        {label}
      </div>
      {count > 0 ? (
        <div style={{ position: "absolute", top: 390, left: 160, right: 160, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 52, color: INK, opacity: 0.85, transform: `scale(${pop})` }}>
          {count}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
