import React from "react";
import { Frame, IconProps } from "../primitives";
import { heartPath } from "../shapes";
import { Arrow, Build, Bust, Dash, Ln, Pt, circ, ellipse, sparkle } from "./kit";

/**
 * Emociones: a face on a bust. Head centre (540, 450), radius 120; features
 * are placed relative to that so every face shares one skeleton.
 */
const FX = 540;
const FY = 450;
const FR = 120;

const Face: React.FC<{ readonly delay?: number; readonly cx?: number }> = ({
  delay = 0,
  cx = FX,
}) => <Bust cx={cx} headY={FY} r={FR} delay={delay} />;

/** Dot eyes; `dy` moves the gaze down for shame and guilt. */
const Eyes: React.FC<{ readonly delay?: number; readonly dy?: number; readonly cx?: number }> = ({
  delay = 0,
  dy = 0,
  cx = FX,
}) => (
  <>
    <Pt x={cx - 40} y={FY - 8 + dy} r={9} delay={delay} />
    <Pt x={cx + 40} y={FY - 8 + dy} r={9} delay={delay + 4} />
  </>
);

const mouth = {
  smile: `M ${FX - 46} ${FY + 38} Q ${FX} ${FY + 78} ${FX + 46} ${FY + 38}`,
  frown: `M ${FX - 44} ${FY + 62} Q ${FX} ${FY + 26} ${FX + 44} ${FY + 62}`,
  flat: `M ${FX - 34} ${FY + 50} L ${FX + 34} ${FY + 50}`,
};

export const Enojo: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={10}>
    <Face />
    <Ln d={`M ${FX - 70} ${FY - 58} L ${FX - 22} ${FY - 36}`} />
    <Ln d={`M ${FX + 70} ${FY - 58} L ${FX + 22} ${FY - 36}`} />
    <Eyes />
    <Ln d={mouth.frown} />
    {[-50, 0, 50].map((dx) => (
      <Ln
        key={dx}
        d={`M ${FX + dx} ${FY - FR - 16} l -12 -18 l 24 -18 l -24 -18 l 12 -18`}
        thin
        o={0.75}
        dur={14}
      />
    ))}
  </Build>
);

export const Miedo: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={10}>
    <Face />
    <Ln d={`M ${FX - 70} ${FY - 40} L ${FX - 24} ${FY - 58}`} />
    <Ln d={`M ${FX + 70} ${FY - 40} L ${FX + 24} ${FY - 58}`} />
    <Eyes />
    <Ln d={circ(FX, FY + 52, 16)} />
    <Ln
      d={`M ${FX + 96} ${FY - 60} C ${FX + 84} ${FY - 38} ${FX + 84} ${FY - 22} ${FX + 96} ${FY - 22} C ${FX + 108} ${FY - 22} ${FX + 108} ${FY - 38} ${FX + 96} ${FY - 60} Z`}
      thin
    />
    <Ln d={`M ${FX - 160} ${FY - 40} q -14 20 0 40 q 14 20 0 40`} thin o={0.6} />
    <Ln d={`M ${FX + 160} ${FY - 40} q 14 20 0 40 q -14 20 0 40`} thin o={0.6} />
  </Build>
);

export const Ansiedad: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={30}>
    <Ln d={heartPath(540, 540, 300)} dur={40} />
    <Ln
      d="M 330 540 L 438 540 L 460 498 L 480 594 L 504 470 L 528 612 L 552 480 L 574 572 L 596 520 L 614 540 L 750 540"
      thin
      dur={40}
    />
  </Build>
);

export const Alegria: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={10}>
    <Face />
    <Ln d={`M ${FX - 58} ${FY - 2} Q ${FX - 40} ${FY - 26} ${FX - 22} ${FY - 2}`} />
    <Ln d={`M ${FX + 22} ${FY - 2} Q ${FX + 40} ${FY - 26} ${FX + 58} ${FY - 2}`} />
    <Ln d={mouth.smile} />
    <Ln d={sparkle(372, 340, 22)} thin />
    <Ln d={sparkle(712, 360, 16)} thin />
  </Build>
);

export const Calma: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame breath={0.014}>
    <Build delay={delay} step={10}>
      <Face />
      <Ln d={`M ${FX - 58} ${FY - 10} Q ${FX - 40} ${FY + 6} ${FX - 22} ${FY - 10}`} />
      <Ln d={`M ${FX + 22} ${FY - 10} Q ${FX + 40} ${FY + 6} ${FX + 58} ${FY - 10}`} />
      <Ln d={`M ${FX - 30} ${FY + 46} Q ${FX} ${FY + 64} ${FX + 30} ${FY + 46}`} />
      <Ln d={`M ${FX - 110} ${FY - 170} Q ${FX} ${FY - 200} ${FX + 110} ${FY - 170}`} thin o={0.5} />
    </Build>
  </Frame>
);

/** The weight you drag along: ball, chain and the open shackle. */
export const Culpa: React.FC<IconProps> = ({ delay = 0 }) => {
  const links = [0.14, 0.38, 0.62, 0.86].map((t) => [
    440 + (536 - 440) * t,
    440 + (536 - 440) * t,
  ]);
  return (
    <Build delay={delay} step={10}>
      <Ln d={circ(620, 620, 118)} dur={36} occ />
      <Ln d="M 560 560 A 70 70 0 0 1 612 530" thin o={0.6} />
      {links.map(([x, y], i) =>
        i % 2 === 0 ? (
          <Ln key={i} d={ellipse(x, y, 24, 13, 45)} thin dur={12} />
        ) : (
          <Ln
            key={i}
            d={`M ${x - 17} ${y - 17} L ${x + 17} ${y + 17}`}
            thin
            dur={8}
          />
        ),
      )}
      <Ln d={circ(410, 410, 40)} dur={20} />
    </Build>
  );
};

export const Verguenza: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={9}>
    <Face />
    <Eyes dy={18} />
    <Ln d={`M ${FX - 20} ${FY + 56} L ${FX + 20} ${FY + 56}`} />
    {[-1, 1].map((side) =>
      [0, 1, 2].map((k) => (
        <Ln
          key={`${side}${k}`}
          d={`M ${FX + side * (56 + k * 17)} ${FY + 44} l ${side * 9} -20`}
          thin
          o={0.7}
          dur={8}
        />
      )),
    )}
  </Build>
);

export const Soledad: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={16}>
    <Dash d={circ(540, 540, 200)} o={0.35} />
    <Bust cx={540} headY={520} r={42} thin />
  </Build>
);

export const Amor: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame breath={0.02}>
    <Build delay={delay} step={26}>
      <Ln d={heartPath(500, 560, 280)} dur={40} />
      <Ln d={heartPath(640, 440, 150)} dur={30} occ />
    </Build>
  </Frame>
);

export const Esperanza: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={12}>
    <Ln d="M 454 680 L 626 680" thin />
    <Ln d="M 494 680 L 494 520 L 586 520 L 586 680" dur={30} />
    <Ln d="M 540 520 L 540 474" thin />
    <Ln d="M 540 356 C 508 398 502 440 540 474 C 578 440 572 398 540 356 Z" />
    <Ln d="M 540 412 C 529 430 529 448 540 458 C 551 448 551 430 540 412 Z" thin o={0.7} />
    {[-155, -120, -60, -25].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return (
        <Ln
          key={deg}
          d={`M ${540 + Math.cos(a) * 96} ${420 + Math.sin(a) * 96} L ${540 + Math.cos(a) * 128} ${420 + Math.sin(a) * 128}`}
          thin
          o={0.6}
          dur={10}
        />
      );
    })}
  </Build>
);

export const Alivio: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={10}>
    <Face cx={500} />
    <Ln d={`M ${460 - 18} ${FY - 10} Q ${460} ${FY + 6} ${460 + 18} ${FY - 10}`} />
    <Ln d={`M ${540 - 18} ${FY - 10} Q ${540} ${FY + 6} ${540 + 18} ${FY - 10}`} />
    <Ln d={circ(500, FY + 52, 12)} />
    <Ln d={`M 636 ${FY + 30} q 34 -10 68 0`} thin o={0.7} />
    <Ln d={`M 640 ${FY + 60} q 44 -8 88 4`} thin o={0.55} />
    <Ln d={`M 636 ${FY + 90} q 34 -2 64 10`} thin o={0.4} />
  </Build>
);

export const Agobio: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={7}>
    <Bust cx={540} headY={500} r={80} />
    {[-90, -30, 30, 150, 210].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return (
        <Arrow
          key={deg}
          from={[540 + Math.cos(a) * 250, 500 + Math.sin(a) * 250]}
          to={[540 + Math.cos(a) * 130, 500 + Math.sin(a) * 130]}
          thin
        />
      );
    })}
  </Build>
);

export const Vacio: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay}>
    <Dash d={heartPath(540, 540, 320)} o={0.55} gap="14 14" />
  </Build>
);

export const Gratitud: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame breath={0.016}>
    <Build delay={delay} step={16}>
      <Ln d={heartPath(540, 560, 270)} dur={40} />
      <Ln d={sparkle(380, 400, 24)} thin />
      <Ln d={sparkle(702, 392, 18)} thin />
      <Ln d={sparkle(704, 640, 14)} thin />
    </Build>
  </Frame>
);

export const Compasion: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame breath={0.014}>
    <Build delay={delay} step={30}>
      <Ln d={heartPath(540, 540, 340)} thin dur={44} />
      <Ln d={heartPath(540, 522, 130)} dur={30} />
    </Build>
  </Frame>
);
