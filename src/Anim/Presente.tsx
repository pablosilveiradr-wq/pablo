import "@fontsource/montserrat/500.css";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, DrawPath, DrawSpeed } from "./primitives";
import { BG, INK, STROKE, STROKE_THIN } from "./theme";

/**
 * "Presente": a face hangs from the word Presente, and from the face hang
 * two weights, Pasado and Futuro. The face is sad and the whole mobile sways
 * under the weight. One string snaps, then the other; the weights drop away,
 * the face rises, smiles and lights up. White line, pure black, no audio.
 */

export const PRESENTE_FRAMES = 210;

const FONT = "Montserrat, 'DejaVu Sans', sans-serif";

/** Where the face hangs from: the bottom of the Presente sign. */
const ANCHOR = { x: 540, y: 262 };
const FACE = { x: 540, y: 440, r: 88 };
const BALL_R = 64;
/** Each weight: where its string leaves the face, where the ball hangs, when it is cut. */
const WEIGHTS = [
  { word: "Pasado", from: [478, 504], ball: [452, 712], cut: 92, spin: -14 },
  { word: "Futuro", from: [602, 504], ball: [632, 664], cut: 78, spin: 16 },
] as const;

/** Frame the face starts to feel lighter: both weights are gone. */
const FREE = 100;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Weight: React.FC<{
  readonly w: (typeof WEIGHTS)[number];
  readonly frame: number;
  readonly sway: number;
}> = ({ w, frame, sway }) => {
  const [fx, fy] = w.from;
  const [bx, by] = w.ball;
  const top = by - BALL_R;
  // The string meets the top of the ball, heading from where it leaves the face.
  const ang = Math.atan2(top - fy, bx - fx);
  const len = Math.hypot(bx - fx, top - fy);
  const snapAt = 0.45;
  const cx = fx + Math.cos(ang) * len * snapAt;
  const cy = fy + Math.sin(ang) * len * snapAt;

  const since = frame - w.cut;
  const cut = since >= 0;
  // The stub left on the face pulls back up; the rest falls with the ball.
  const stub = cut ? interpolate(since, [0, 8], [1, 0], clamp) : 1;
  const fall = cut ? 0.5 * 3.4 * since * since : 0;
  const spinDeg = cut ? w.spin * Math.min(1, since / 14) : 0;
  const fade = cut ? interpolate(since, [6, 20], [1, 0], clamp) : 1;
  const textIn = interpolate(frame, [14, 24], [0, 1], clamp);

  return (
    <g
      style={{
        transform: `rotate(${sway}deg)`,
        transformOrigin: `${fx}px ${fy}px`,
        transformBox: "view-box",
      }}
    >
      {/* upper part of the string, still tied to the face */}
      <path
        d={`M ${fx} ${fy} L ${fx + (cx - fx) * stub} ${fy + (cy - fy) * stub}`}
        stroke={INK}
        strokeWidth={STROKE_THIN}
        opacity={cut && stub > 0.02 ? 1 : 0}
      />
      <g
        opacity={fade}
        style={{
          transform: `translateY(${fall}px) rotate(${spinDeg}deg)`,
          transformOrigin: `${bx}px ${by}px`,
          transformBox: "view-box",
        }}
      >
        <DrawPath d={`M ${cut ? cx : fx} ${cut ? cy : fy} L ${bx} ${top}`} delay={8} duration={10} strokeWidth={STROKE_THIN} />
        <DrawPath
          d={`M ${bx - BALL_R} ${by} a ${BALL_R} ${BALL_R} 0 1 0 ${BALL_R * 2} 0 a ${BALL_R} ${BALL_R} 0 1 0 ${-BALL_R * 2} 0`}
          delay={12}
          duration={16}
        />
        <text
          x={bx}
          y={by}
          fill={INK}
          stroke="none"
          fontFamily={FONT}
          fontWeight={500}
          fontSize={25}
          textAnchor="middle"
          dominantBaseline="central"
          opacity={textIn}
        >
          {w.word}
        </text>
      </g>
    </g>
  );
};

export const Presente: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Weighed down it sways heavily; once free it only breathes.
  const heavy = interpolate(frame, [FREE - 10, FREE + 30], [1, 0.25], clamp);
  const sway = Math.sin((frame / 70) * Math.PI * 2) * 2.4 * heavy;
  const ballSway = (i: number) => Math.sin((frame / 52) * Math.PI * 2 + i * 1.7) * 5;

  // Mouth: frown, then a wobble as the weights go, then a smile.
  const toWavy = interpolate(frame, [76, 92], [0, 1], clamp);
  const toSmile = spring({ frame: frame - FREE, fps, config: { damping: 12, stiffness: 120 } });
  const c1 = 462 + (508 - 462) * toWavy + (524 - 508) * toSmile;
  const c2 = 462 + (470 - 462) * toWavy + (524 - 470) * toSmile;
  const mouth = `M 506 488 C 522 ${c1} 558 ${c2} 574 488`;

  // Lighter now: the face lifts with a little bounce and lights up.
  const lift = spring({ frame: frame - FREE, fps, config: { damping: 9, stiffness: 90 } }) * 46;
  const light = interpolate(frame, [FREE + 4, FREE + 14, FREE + 60], [0, 1, 0.55], clamp);
  const flash = interpolate(frame, [FREE + 4, FREE + 10, FREE + 34], [0, 1, 0], clamp);
  const labelIn = interpolate(frame, [4, 14], [0, 1], clamp);
  const follow = spring({ frame: frame - FREE - 6, fps, config: { damping: 20, stiffness: 40 } }) * 150;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Canvas scale={0.88} glowOpacity={0.3 + 0.6 * flash}>
        <DrawSpeed value={1}>
          <defs>
            {/* a halo just outside the face, dark inside: light, not a grey fill */}
            <radialGradient id="faceLight">
              <stop offset="0%" stopColor={INK} stopOpacity={0} />
              <stop offset="50%" stopColor={INK} stopOpacity={0} />
              <stop offset="54%" stopColor={INK} stopOpacity={0.26} />
              <stop offset="72%" stopColor={INK} stopOpacity={0.07} />
              <stop offset="100%" stopColor={INK} stopOpacity={0} />
            </radialGradient>
          </defs>
          {/* framed a little larger and centred; once the face is free the camera settles on it */}
          <g
            style={{
              transform: `translateY(${60 + follow - lift}px) scale(1.14)`,
              transformOrigin: "540px 480px",
              transformBox: "view-box",
            }}
          >
            {/* the sign */}
            <DrawPath d="M 437 196 H 643 A 12 12 0 0 1 655 208 V 250 A 12 12 0 0 1 643 262 H 437 A 12 12 0 0 1 425 250 V 208 A 12 12 0 0 1 437 196 Z" duration={16} />
            <text
              x={540}
              y={230}
              fill={INK}
              stroke="none"
              fontFamily={FONT}
              fontWeight={500}
              fontSize={32}
              textAnchor="middle"
              dominantBaseline="central"
              opacity={labelIn}
            >
              Presente
            </text>
            {/* everything that hangs from it sways about the sign */}
            <g
              style={{
                transform: `rotate(${sway}deg)`,
                transformOrigin: `${ANCHOR.x}px ${ANCHOR.y}px`,
                transformBox: "view-box",
              }}
            >
              <DrawPath d={`M ${ANCHOR.x} ${ANCHOR.y} L ${FACE.x} ${FACE.y - FACE.r}`} delay={4} duration={8} strokeWidth={STROKE_THIN} />
              {light > 0 ? <circle cx={FACE.x} cy={FACE.y} r={FACE.r * 1.9} fill="url(#faceLight)" stroke="none" opacity={light} /> : null}
              <DrawPath
                d={`M ${FACE.x - FACE.r} ${FACE.y} a ${FACE.r} ${FACE.r} 0 1 0 ${FACE.r * 2} 0 a ${FACE.r} ${FACE.r} 0 1 0 ${-FACE.r * 2} 0`}
                delay={8}
                duration={18}
                strokeWidth={STROKE}
              />
              <DrawPath d="M 504 438 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0" delay={18} duration={8} strokeWidth={STROKE_THIN} />
              <DrawPath d="M 558 438 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0" delay={18} duration={8} strokeWidth={STROKE_THIN} />
              <DrawPath d={mouth} delay={20} duration={10} strokeWidth={STROKE_THIN} />
              {WEIGHTS.map((w, i) => (
                <Weight key={w.word} w={w} frame={frame} sway={ballSway(i)} />
              ))}
            </g>
          </g>
        </DrawSpeed>
      </Canvas>
    </AbsoluteFill>
  );
};
