import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, DrawPath, DrawSpeed, StrokeScale, useStrokeScale } from "./primitives";
import { BG, FPS, INK, STROKE_THIN } from "./theme";
import { FONT } from "./Visita";

/**
 * "Metacognición": a profile with its eyes closed and thoughts spinning in its
 * head opens its eye; a beam of light leaves it and the camera pulls back to
 * show a second, mirrored profile facing it: you, watching yourself think.
 * The two lines of text stay on screen, as in the reference. No audio.
 */

export const METACOGNICION_SECONDS = 8.5;
export const METACOGNICION_FRAMES = Math.round(METACOGNICION_SECONDS * FPS);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const s = (sec: number) => Math.round(sec * FPS);

/** A head in profile looking right: forehead, nose, lips, chin, neck, and the back of the head. */
const FACE =
  "M 300 300 C 380 270 450 320 456 400 C 458 420 452 432 456 444 C 470 470 488 488 494 504 C 486 512 470 514 462 516 C 470 524 474 532 466 538 C 460 542 460 546 466 552 C 472 560 468 570 458 576 C 456 590 456 604 444 612 C 430 618 420 622 418 640 L 418 790";
const BACK = "M 300 300 C 220 330 196 430 232 510 C 256 562 300 590 312 642 L 312 790";
const EYE = { x: 424, y: 432 };

const Eye: React.FC<{ open: number; delay: number }> = ({ open, delay }) => (
  <>
    {/* closed: a lid line with three lashes */}
    <g opacity={1 - open}>
      <DrawPath d={`M ${EYE.x - 22} ${EYE.y - 2} Q ${EYE.x} ${EYE.y + 12} ${EYE.x + 22} ${EYE.y - 2}`} delay={delay} duration={8} strokeWidth={STROKE_THIN * 1.2} />
      <DrawPath d={`M ${EYE.x - 12} ${EYE.y + 6} l -4 10 M ${EYE.x} ${EYE.y + 8} l 0 11 M ${EYE.x + 12} ${EYE.y + 6} l 4 10`} delay={delay + 6} duration={6} strokeWidth={STROKE_THIN} />
    </g>
    {/* open: an almond with the pupil looking ahead */}
    {open > 0 ? (
      <g style={{ transform: `scaleY(${0.15 + 0.85 * open})`, transformOrigin: `${EYE.x}px ${EYE.y}px`, transformBox: "view-box" }}>
        <path d={`M ${EYE.x - 22} ${EYE.y} Q ${EYE.x - 2} ${EYE.y - 22} ${EYE.x + 24} ${EYE.y - 2} Q ${EYE.x} ${EYE.y + 16} ${EYE.x - 22} ${EYE.y} Z`} strokeWidth={STROKE_THIN * 1.2} />
        <circle cx={EYE.x + 9} cy={EYE.y - 3} r={7} fill={INK} stroke="none" />
      </g>
    ) : null}
  </>
);

/** Thoughts spinning inside the head, slowing down once they are being watched. */
const Thoughts: React.FC<{ calm: number }> = ({ calm }) => {
  const f = useCurrentFrame();
  const spin = f * (6 - 4.5 * calm);
  const pts = [];
  for (let t = 0; t <= 1; t += 0.02) {
    const a = t * Math.PI * 4.2;
    const r = 6 + 44 * t;
    pts.push(`${(320 + Math.cos(a) * r).toFixed(1)} ${(440 + Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <g style={{ transform: `rotate(${spin}deg)`, transformOrigin: "320px 440px", transformBox: "view-box" }} opacity={0.85 - 0.35 * calm}>
      <DrawPath d={`M ${pts.join(" L ")}`} delay={10} duration={20} strokeWidth={STROKE_THIN} />
    </g>
  );
};

const Head: React.FC<{ eye: number; calm: number; delay: number; thoughts?: boolean }> = ({ eye, calm, delay, thoughts = true }) => (
  <>
    <DrawPath d={FACE} delay={delay} duration={26} />
    <DrawPath d={BACK} delay={delay + 6} duration={22} />
    <Eye open={eye} delay={delay + 14} />
    {thoughts ? <Thoughts calm={calm} /> : null}
  </>
);

export const Metacognicion: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const open1 = interpolate(f, [s(1.4), s(1.75)], [0, 1], clamp);
  const beam = interpolate(f, [s(1.8), s(2.6)], [0, 1], clamp);
  const pull = spring({ frame: f - s(2.4), fps, config: { damping: 22, stiffness: 40 } });
  const open2 = interpolate(f, [s(3.9), s(4.2)], [0, 1], clamp);
  const meet = interpolate(f, [s(4.2), s(4.8)], [0, 1], clamp);
  const calm = interpolate(f, [s(4.2), s(6)], [0, 1], clamp);

  // Camera: close on the eye, then back to show both faces.
  const zoom = 1.9 - 0.98 * pull;
  const sy = 650 - 95 * pull;
  const fx = EYE.x + (540 - EYE.x) * pull;
  const fy = EYE.y + (530 - EYE.y) * pull;
  const glow = 0.3 + 0.5 * interpolate(f, [s(4.2), s(4.6), s(6.5)], [0, 1, 0.3], clamp);

  const topIn = interpolate(f, [s(0.2), s(0.8)], [0, 1], clamp);
  const quoteIn = interpolate(f, [s(4.4), s(5.0)], [0, 1], clamp);
  const out = interpolate(f, [durationInFrames - 15, durationInFrames], [1, 0], clamp);

  // The beam: rays leave the eye toward the other face, widening as they go.
  const rays = [-14, -7, 0, 7, 14].map((dy, i) => {
    const len = (232 - 26) * (meet > 0 ? 1 : beam);
    const x0 = EYE.x + 26;
    const x1 = x0 + len;
    const spread = meet > 0 ? 1 - meet * 0.8 : 1;
    return (
      <path
        key={i}
        d={`M ${x0} ${EYE.y - 2} L ${x1} ${EYE.y - 2 + dy * 2.2 * spread}`}
        strokeWidth={i === 2 ? STROKE_THIN * 1.3 : STROKE_THIN * 0.8}
        opacity={(i === 2 ? 0.95 : 0.55) * Math.min(1, beam * 2)}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: out }}>
      <Canvas scale={0.88} glowOpacity={glow}>
        <DrawSpeed value={1}>
          <defs>
            <radialGradient id="metaGlow">
              <stop offset="0%" stopColor={INK} stopOpacity={0.5} />
              <stop offset="45%" stopColor={INK} stopOpacity={0.12} />
              <stop offset="100%" stopColor={INK} stopOpacity={0} />
            </radialGradient>
          </defs>
          <g style={{ transform: `translate(${540 - fx * zoom}px, ${sy - fy * zoom}px) scale(${zoom})`, transformOrigin: "0 0" }}>
            <StrokeScale value={useStrokeScale() / zoom}>
              {meet > 0 ? <ellipse cx={540} cy={EYE.y} rx={150} ry={90} fill="url(#metaGlow)" stroke="none" opacity={meet} /> : null}
              <Head eye={open1} calm={calm} delay={0} />
              {beam > 0 ? <g>{rays}</g> : null}
              {/* the one watching: the same profile, mirrored */}
              <g style={{ transform: "scaleX(-1)", transformOrigin: "540px 0px", transformBox: "view-box" }} opacity={0.8}>
                <Head eye={open2} calm={calm} delay={s(2.7)} thoughts={false} />
              </g>
            </StrokeScale>
          </g>
        </DrawSpeed>
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 90,
          right: 90,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 50,
          lineHeight: 1.25,
          color: INK,
          opacity: topIn,
          textShadow: "0 0 24px rgba(242,242,242,0.28)",
        }}
      >
        Para la neurociencia, la metacognición es una de las formas más altas de inteligencia
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 110,
          right: 110,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 46,
          lineHeight: 1.3,
          color: INK,
          opacity: quoteIn,
          transform: `translateY(${(1 - quoteIn) * 12}px)`,
          textShadow: "0 0 24px rgba(242,242,242,0.28)",
        }}
      >
        «la capacidad de pensar sobre tu propio pensamiento»
      </div>
    </AbsoluteFill>
  );
};
