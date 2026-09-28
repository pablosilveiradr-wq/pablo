import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { IconProps, useDrawFrame } from "../primitives";
import { Build, Ln, Pt, circ } from "./kit";

/** A two-bell alarm clock that rattles once it has drawn. */
export const Alarma: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const ringing = interpolate(useDrawFrame() - delay, [80, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = Math.sin(frame * 1.7) * 2.2 * ringing;
  return (
    <g transform={`rotate(${shake} 540 560)`}>
      <Build delay={delay} step={10}>
        <Ln d={circ(540, 560, 150)} dur={34} occ />
        <Ln d="M 386 474 A 64 64 0 0 1 470 404 Z" />
        <Ln d="M 694 474 A 64 64 0 0 0 610 404 Z" />
        <Ln d="M 540 560 L 540 470" />
        <Ln d="M 540 560 L 608 594" />
        <Pt x={540} y={560} r={10} />
        <Ln d="M 450 682 L 418 728" thin />
        <Ln d="M 630 682 L 662 728" thin />
        <Ln d="M 346 540 q -16 26 0 52" thin o={0.6} />
        <Ln d="M 734 540 q 16 26 0 52" thin o={0.6} />
      </Build>
    </g>
  );
};
