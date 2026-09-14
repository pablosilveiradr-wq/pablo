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
 * Scene 4 — the icons are thrown out of the ring, circle it while it
 * spins up until they smear, then disintegrate into an expanding cloud of
 * dust. The ring itself survives and carries on into the next scene.
 */

const RING_R = 80;
const ORBIT_R = 268;
const ICON = 104;
const GHOSTS = 14;
/** Shutter angle: how much of the frame interval the smear covers. */
const SHUTTER = 1.7;
const PARTICLES = 620;
/** Seconds into the scene when the icons come apart. */
const BURST = 3.5;

/** Total rotation in degrees at time t (seconds) — starts slow, runs away. */
const rotationAt = (t: number) => 40 * t + 17.5 * t ** 3.54;

export const SocialOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const speed = (rotationAt(t) - rotationAt(Math.max(0, t - 1 / fps))) * fps;

  // The icons are flung out of the ring at the start of the scene.
  const spread = interpolate(t, [0.05, 0.5], [RING_R, ORBIT_R], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconsOpacity = interpolate(
    t,
    [0.05, 0.3, BURST - 0.06, BURST + 0.05],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const iconScale = interpolate(t, [0.05, 0.5], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blur = interpolate(speed, [90, 1500], [0, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringOpacity = interpolate(t, [0, 0.12], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = useMemo(
    () =>
      new Array(PARTICLES).fill(0).map((_, i) => ({
        angle: random(`a${i}`) * Math.PI * 2,
        start: ORBIT_R - 32 + random(`r${i}`) * 64,
        speed: 150 + random(`s${i}`) * 680,
        size: 1.4 + random(`z${i}`) * 2.6,
        delay: random(`d${i}`) * 0.1,
        life: 0.6 + random(`l${i}`) * 0.42,
      })),
    [],
  );

  const sinceBurst = t - BURST;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width={220} height={220} viewBox="0 0 220 220">
          <circle
            cx={110}
            cy={110}
            r={RING_R}
            fill="none"
            stroke="white"
            strokeWidth={2.6}
            opacity={ringOpacity}
          />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill>
        {new Array(GHOSTS).fill(0).map((_, g) => {
          // Sample the rotation across the frame's exposure and screen the
          // samples together — that is what makes a real motion smear.
          const sampleT = t - ((g / GHOSTS) * SHUTTER) / fps;
          const sampleRot = rotationAt(Math.max(0, sampleT));

          return (
            <div
              key={g}
              style={{
                // A zero-sized box pinned to the exact centre of the frame:
                // everything below rotates about this point, not about its
                // own box, which is what threw the orbit off centre.
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 0,
                height: 0,
                opacity: (iconsOpacity * 1.9) / GHOSTS,
                mixBlendMode: "screen",
                filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              }}
            >
              {SOCIAL.map((_icon, i) => {
                const deg = (i / SOCIAL.length) * 360 + sampleRot;

                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: -ICON / 2,
                      top: -ICON / 2,
                      width: ICON,
                      height: ICON,
                      transform: `rotate(${deg}deg) translate(${spread}px) rotate(${-deg}deg) scale(${iconScale})`,
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

              const eased = Math.pow(age / p.life, 0.85);
              const dist = p.start + p.speed * eased;

              return (
                <circle
                  key={i}
                  cx={540 + Math.cos(p.angle) * dist}
                  cy={960 + Math.sin(p.angle) * dist}
                  r={p.size}
                  fill="white"
                  opacity={interpolate(
                    age / p.life,
                    [0, 0.1, 0.65, 1],
                    [0, 1, 0.8, 0],
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
