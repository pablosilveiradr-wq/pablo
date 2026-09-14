import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SOCIAL, SocialIcon } from "./socialIcons";

/**
 * Scene 4 — social icons circling the ring, spinning up until they smear,
 * then bursting into a field of particles. The ring survives the blast and
 * carries on into the next scene.
 */

const ORBIT_R = 268;
const ICON = 104;
const GHOSTS = 14;
/** Shutter angle: how much of the frame interval the smear covers. */
const SHUTTER = 1.7;

/** Total rotation in degrees at time t (seconds) — starts slow, runs away. */
const rotationAt = (t: number) => 40 * t + 14.5 * t ** 4.23;

const PARTICLES = 170;

export const SocialOrbit: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const burstAt = 2.75;

  const speed = (rotationAt(t) - rotationAt(Math.max(0, t - 1 / fps))) * fps;

  const iconsOpacity = interpolate(
    t,
    [0, 0.25, burstAt - 0.06, burstAt + 0.05],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const blur = interpolate(speed, [90, 1500], [0, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringOpacity = interpolate(t, [0, 0.3], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The ring shrinks at the end so it lands as the centre cell of the grid.
  const end = durationInFrames / fps;
  const ringR = interpolate(t, [end - 0.65, end - 0.08], [80, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = useMemo(
    () =>
      new Array(PARTICLES).fill(0).map((_, i) => ({
        angle: random(`a${i}`) * Math.PI * 2,
        speed: 420 + random(`s${i}`) * 900,
        size: 2 + random(`z${i}`) * 3.4,
        delay: random(`d${i}`) * 0.12,
        life: 0.9 + random(`l${i}`) * 0.9,
      })),
    [],
  );

  const sinceBurst = t - burstAt;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width={220} height={220} viewBox="0 0 220 220">
          <circle
            cx={110}
            cy={110}
            r={ringR}
            fill="none"
            stroke="white"
            strokeWidth={2.6}
            opacity={ringOpacity}
          />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {new Array(GHOSTS).fill(0).map((_, g) => {
          // Sample the rotation across the frame's exposure and screen the
          // samples together — that is what makes a real motion smear.
          const sampleT = t - ((g / GHOSTS) * SHUTTER) / fps;
          const sampleRot = rotationAt(Math.max(0, sampleT));

          return (
            <div
              key={g}
              style={{
                position: "absolute",
                opacity: (iconsOpacity * 1.9) / GHOSTS,
                mixBlendMode: "screen",
                filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                transform: `rotate(${sampleRot}deg)`,
              }}
            >
              {SOCIAL.map((_icon, i) => {
                const deg = (i / SOCIAL.length) * 360;

                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      transform: `rotate(${deg}deg) translate(${ORBIT_R}px) rotate(${
                        -deg - sampleRot
                      }deg) translate(-50%, -50%)`,
                    }}
                  >
                    <SocialIcon index={i} size={ICON} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </AbsoluteFill>

      {sinceBurst > -0.1 ? (
        <AbsoluteFill>
          <svg width={1080} height={1920} viewBox="0 0 1080 1920">
            {particles.map((p, i) => {
              const age = sinceBurst - p.delay;
              if (age < 0 || age > p.life) {
                return null;
              }

              const eased = 1 - Math.pow(1 - age / p.life, 2.4);
              const dist = ORBIT_R * 0.7 + p.speed * eased;

              return (
                <circle
                  key={i}
                  cx={540 + Math.cos(p.angle) * dist}
                  cy={960 + Math.sin(p.angle) * dist}
                  r={p.size}
                  fill="white"
                  opacity={interpolate(
                    age / p.life,
                    [0, 0.15, 0.7, 1],
                    [0, 1, 0.85, 0],
                  )}
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
