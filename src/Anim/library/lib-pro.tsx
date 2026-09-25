import React from "react";
import { useCurrentFrame } from "remotion";
import { Dot, IconProps, useReveal } from "../primitives";
import { INK, STROKE_THIN } from "../theme";
import { Ln } from "./kit";
import { TimedIcon, vendorIcon } from "./vendorIcon";

/**
 * The few pieces no icon set has, drawn to the same rules as the vendored
 * glyphs: one stroke weight, geometry on the 18-unit grid step, no ornament.
 */

/** Ground line for things that stand or step. */
export const Ground: React.FC<IconProps> = ({ delay = 0 }) => (
  <Ln d="M 360 744 L 720 744" delay={delay} dur={20} />
);

/** A pressure point: a dot with rings pulsing out of it. */
export const WristPoint: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const shown = useReveal(delay + 10, 14);
  return (
    <>
      <Dot cx={560} cy={612} r={14} delay={delay} />
      {[0, 1].map((i) => {
        const t = ((frame / 40 + i * 0.5) % 1 + 1) % 1;
        return (
          <circle
            key={i}
            cx={560}
            cy={612}
            r={18 + t * 40}
            fill="none"
            strokeWidth={STROKE_THIN}
            opacity={(1 - t) * 0.6 * shown}
          />
        );
      })}
    </>
  );
};

const Square = vendorIcon("lucide/square", 0);
/** lucide/square's edge on our canvas: x and y both run 378..702. */
const LO = 378;
const HI = 702;

/** Box breathing: the square, and a dot going round it one side per count. */
export const BoxBreath: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const shown = useReveal(delay + 30, 12);
  const side = HI - LO;
  const t = ((frame / 44) % 4 + 4) % 4;
  const k = t % 1;
  const [x, y] =
    t < 1
      ? [LO + side * k, LO]
      : t < 2
        ? [HI, LO + side * k]
        : t < 3
          ? [HI - side * k, HI]
          : [LO, HI - side * k];
  return (
    <>
      <Square delay={delay} />
      <circle cx={x} cy={y} r={15} fill={INK} stroke="none" opacity={shown} />
    </>
  );
};

/** The square lands by ~46 build frames; the dot then circulates forever. */
(BoxBreath as TimedIcon).buildEnd = 56;
