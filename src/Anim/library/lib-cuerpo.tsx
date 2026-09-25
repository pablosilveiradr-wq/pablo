import React from "react";
import { Frame, IconProps } from "../primitives";
import { heartPath, roundedRect } from "../shapes";
import { Build, Bust, Ln, Pt, circ, crescent, headAt, zigzag } from "./kit";

/** A rope pulled tight at both ends, with the knot in the middle. */
export const Nudo: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={20}>
    <Ln
      d="M 340 560 C 420 560 460 470 540 470 C 616 470 616 566 540 572 C 466 578 476 496 540 504 C 606 512 640 560 740 560"
      dur={60}
    />
    <Ln d={headAt(340, 560, Math.PI, 24)} thin dur={10} />
    <Ln d={headAt(740, 560, 0, 24)} thin dur={10} />
  </Build>
);

export const Latido: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={30}>
    <Ln d={heartPath(540, 400, 110)} dur={30} />
    <Ln
      d="M 330 570 L 440 570 L 462 530 L 484 610 L 510 450 L 536 650 L 558 570 L 750 570"
      thin
      dur={40}
    />
  </Build>
);

export const Pulmones: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame breath={0.03}>
    <Build delay={delay} step={14}>
      <Ln d="M 540 360 L 540 470" />
      <Ln d="M 540 470 L 514 500 M 540 470 L 566 500" thin />
      <Ln d="M 514 470 C 470 420 404 470 396 560 C 390 640 420 690 474 688 C 510 686 514 650 514 610 Z" dur={36} />
      <Ln d="M 566 470 C 610 420 676 470 684 560 C 690 640 660 690 606 688 C 570 686 566 650 566 610 Z" dur={36} />
    </Build>
  </Frame>
);

export const HombrosTensos: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={12}>
    <Bust cx={540} headY={440} r={100} />
    <Ln d={zigzag(372, 566, 4, 12, 14)} thin />
    <Ln d={zigzag(660, 566, 4, 12, 14)} thin />
    <Ln d={zigzag(394, 530, 3, 12, 12)} thin o={0.6} />
    <Ln d={zigzag(650, 530, 3, 12, 12)} thin o={0.6} />
  </Build>
);

export const DolorDeCabeza: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={14}>
    <Bust cx={540} headY={440} r={125} />
    <Ln d="M 392 338 L 368 372 L 394 380 L 368 418" thin />
    <Ln d="M 688 338 L 712 372 L 686 380 L 712 418" thin />
    <Ln d="M 486 438 L 518 446" thin />
    <Ln d="M 594 438 L 562 446" thin />
  </Build>
);

const Battery: React.FC<{ readonly bars: number; readonly delay?: number }> = ({
  bars,
  delay = 0,
}) => (
  <Build delay={delay} step={10}>
    <Ln d={roundedRect(380, 470, 280, 140, 22)} dur={34} />
    <Ln d={roundedRect(660, 510, 22, 60, 6)} thin />
    {new Array(bars).fill(0).map((_, i) => (
      <Ln key={i} d={roundedRect(402 + i * 62, 492, 44, 96, 7)} thin dur={12} />
    ))}
  </Build>
);

export const SinEnergia: React.FC<IconProps> = ({ delay = 0 }) => (
  <Battery bars={1} delay={delay} />
);

export const ConEnergia: React.FC<IconProps> = ({ delay = 0 }) => (
  <Battery bars={4} delay={delay} />
);

const Zzz: React.FC<{ readonly delay?: number }> = ({ delay = 0 }) => (
  <Build delay={delay} step={8}>
    {[
      [640, 440, 44],
      [696, 376, 32],
      [740, 324, 22],
    ].map(([x, y, s]) => (
      <Ln
        key={x}
        d={`M ${x} ${y} L ${x + s} ${y} L ${x} ${y + s} L ${x + s} ${y + s}`}
        thin
        dur={10}
      />
    ))}
  </Build>
);

export const Dormir: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame breath={0.012}>
    <Build delay={delay} step={30}>
      <Ln d={crescent(520, 560, 160)} dur={44} />
      <Zzz />
    </Build>
  </Frame>
);

export const Insomnio: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={16}>
    <Ln d="M 360 580 Q 540 460 720 580" />
    <Ln d="M 360 580 Q 540 700 720 580" />
    <Ln d={circ(540, 580, 44)} />
    <Pt x={540} y={580} r={17} />
    <Ln d={crescent(700, 380, 60)} thin />
  </Build>
);

export const TomarAgua: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={16}>
    <Ln d="M 460 380 L 480 700 L 600 700 L 620 380" dur={34} />
    <Ln d="M 466 470 q 18 -10 37 0 t 37 0 t 37 0 t 37 0" thin />
    <Ln d="M 540 262 C 520 292 516 312 540 322 C 564 312 560 292 540 262 Z" thin />
  </Build>
);
