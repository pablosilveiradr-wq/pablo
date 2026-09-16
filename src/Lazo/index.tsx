import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, H, W } from "../Cadena/common";

/**
 * "Cuanto más tirás, más aprieta."
 *
 * The motion carries the whole idea, so it is built around cause and
 * effect rather than a set of sliders moving at once:
 *
 *  - four separate tugs, each a fast lunge and a slow recoil
 *  - the loop is a ratchet: every tug closes it one notch and it never
 *    opens again while the fight lasts
 *  - each tug is shorter than the last, because there is less room
 *  - the loop closes a beat AFTER the lunge, so the pull reads as the
 *    cause of the tightening
 *  - it only opens once nothing has pulled on it for a while
 */
export const LAZO_DURATION = 270; // 9s at 30fps

const PEG = { x: 196, y: 1602 };
const HOME = { x: 556, y: 986 };
const BALL_R = 88;

/** Away from the peg — the direction it strains in. */
const DIR = (() => {
  const dx = HOME.x - PEG.x;
  const dy = HOME.y - PEG.y;
  const len = Math.hypot(dx, dy);
  return { x: dx / len, y: dy / len };
})();

/** Each lunge, and how far it gets. Less room every time. */
const TUGS = [
  { at: 1.3, amp: 230 },
  { at: 2.05, amp: 192 },
  { at: 2.6, amp: 150 },
  { at: 3.05, amp: 104 },
];

/** How wide the loop is after each tug has closed it. */
const NOTCHES = [196, 170, 148, 128, 112];

/** A lunge: out fast, back slow. */
const lunge = (t: number, at: number, amp: number) => {
  const x = t - at;
  if (x < 0) {
    return 0;
  }
  if (x < 0.13) {
    return amp * (1 - (1 - x / 0.13) ** 3);
  }
  return amp * Math.exp(-(x - 0.13) * 1.75);
};

export const Lazo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const fadeIn = interpolate(t, [0, 0.6], [0, 1], clamp);

  // Leans towards the peg before it lunges away — the wind-up.
  const windUp = interpolate(t, [0.85, 1.28], [0, 1], clamp) *
    interpolate(t, [1.28, 1.36], [1, 0], clamp);

  const lunged = TUGS.reduce((sum, tg) => sum + lunge(t, tg.at, tg.amp), 0);
  // After the last tug it stays out there, stuck at the end of the rope.
  // This is the beat the whole thing turns on, so it is held.
  const stuck = 134 * interpolate(t, [3.05, 3.45], [0, 1], clamp);
  // Then it gives up and sinks home, slowly. No bounce — it is spent.
  const giveUp = interpolate(t, [4.4, 5.8], [1, 0], clamp) ** 0.6;
  const reach = (lunged + stuck) * giveUp - windUp * 26;

  // Straining against the rope: three slow waves, nothing fast enough
  // to strobe at 30fps.
  const held = interpolate(t, [3.3, 3.65, 4.25, 4.7], [0, 1, 1, 0], clamp);
  const wob =
    held * (3.4 * Math.sin(t * 14.5) + 2.2 * Math.sin(t * 9.1) + 1.4 * Math.sin(t * 21));

  const cx = HOME.x + DIR.x * reach + wob;
  const cy = HOME.y + DIR.y * reach + wob * 0.5;

  // The ratchet: each tug closes it a notch, a beat after the lunge.
  let tight = NOTCHES[0];
  TUGS.forEach((tg, i) => {
    const p = interpolate(t, [tg.at + 0.11, tg.at + 0.33], [0, 1], clamp);
    tight += (NOTCHES[i + 1] - tight) * p;
  });

  // Nothing happens for a while after it stops. Then it opens by itself.
  const opening = interpolate(t, [6.2, 7.4], [0, 1], clamp) ** 0.85;
  const r = tight + opening * 236;

  const toPeg = Math.atan2(PEG.y - cy, PEG.x - cx);
  const kx = cx + Math.cos(toPeg) * r;
  const ky = cy + Math.sin(toPeg) * r;

  // The rope has a fixed length: taut at full stretch, slack otherwise.
  const ROPE = Math.hypot(HOME.x - PEG.x, HOME.y - PEG.y) + 30;
  const slack = Math.max(0, ROPE - Math.hypot(kx - PEG.x, ky - PEG.y));

  const fall = interpolate(t, [7.2, 8.7], [0, 1], clamp) ** 1.6;
  const drop = fall * 1100;
  const mx = (PEG.x + kx) / 2;
  const my = (PEG.y + ky) / 2 + slack * 0.85 + drop * 0.5;

  const ropeFade = interpolate(t, [7.8, 8.8], [1, 0], clamp);

  // It breathes only once it is actually free.
  const free = interpolate(t, [6.6, 8.5], [0, 1], clamp);
  const breathe = 1 + free * Math.sin((t - 6.4) * 1.7) * 0.045;
  const closed = interpolate(tight, [112, 196], [1, 0], clamp);
  const squash = 1 - closed * 0.07 * (1 - opening);
  const dim = closed * 0.3 * (1 - free);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="lazo-glow">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="28%" stopColor="rgba(255,255,255,0.36)" />
            <stop offset="62%" stopColor="rgba(255,255,255,0.09)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <g opacity={fadeIn}>
          {/* what it is tied to */}
          <g opacity={ropeFade}>
            <line
              x1={PEG.x - 74}
              y1={PEG.y + 40}
              x2={PEG.x + 74}
              y2={PEG.y + 40}
              stroke="white"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <line
              x1={PEG.x}
              y1={PEG.y + 40}
              x2={PEG.x}
              y2={PEG.y - 34}
              stroke="white"
              strokeWidth={7}
              strokeLinecap="round"
            />
            <circle
              cx={PEG.x}
              cy={PEG.y - 48}
              r={18}
              fill="none"
              stroke="white"
              strokeWidth={6}
            />
          </g>

          {/* the rope */}
          <path
            d={`M ${PEG.x} ${PEG.y - 60} Q ${mx} ${my} ${kx} ${ky + drop}`}
            fill="none"
            stroke="white"
            strokeWidth={6}
            strokeLinecap="round"
            opacity={ropeFade}
          />

          {/* the loop */}
          <circle
            cx={cx}
            cy={cy + drop}
            r={r}
            fill="none"
            stroke="white"
            strokeWidth={6}
            opacity={ropeFade}
          />

          {/* a snap of strain on each tug, then gone */}
          {TUGS.map((tg, i) => {
            const flash = interpolate(
              t,
              [tg.at + 0.11, tg.at + 0.2, tg.at + 0.52],
              [0, 1, 0],
              clamp,
            );
            if (flash <= 0.01) {
              return null;
            }

            return (
              <g key={i} opacity={flash * 0.85}>
                {[0, 1, 2, 3, 4, 5].map((k) => {
                  const a = ((k * 60 + 24 + i * 17) * Math.PI) / 180;
                  const inner = r + 14;
                  const outer = inner + 20 + flash * 30;
                  return (
                    <line
                      key={k}
                      x1={cx + Math.cos(a) * inner}
                      y1={cy + Math.sin(a) * inner}
                      x2={cx + Math.cos(a) * outer}
                      y2={cy + Math.sin(a) * outer}
                      stroke="white"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* the calm that arrives after */}
          {free > 0 ? (
            <circle
              cx={cx}
              cy={cy}
              r={190 + free * 420}
              fill="none"
              stroke="white"
              strokeWidth={3}
              strokeDasharray="0.1 24"
              strokeLinecap="round"
              opacity={(1 - free) * 0.45}
            />
          ) : null}

          <circle
            cx={cx}
            cy={cy}
            r={BALL_R * (3 + free * 1.2) * breathe}
            fill="url(#lazo-glow)"
            opacity={0.85 - dim}
          />
          <ellipse
            cx={cx}
            cy={cy}
            rx={BALL_R * squash * breathe}
            ry={BALL_R * (2 - squash) * breathe}
            fill="#fbfbfb"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
