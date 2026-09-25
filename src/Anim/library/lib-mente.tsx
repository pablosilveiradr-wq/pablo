import React from "react";
import { Frame, IconProps } from "../primitives";
import { cloudPath, questionHook, roundedRect } from "../shapes";
import {
  Arrow,
  Build,
  Bust,
  Dash,
  Ln,
  Pt,
  circ,
  headAt,
  scribble,
  zigzag,
} from "./kit";

/**
 * Mente: a big-headed bust whose head is the stage. Head centre (540, 440),
 * radius 125, so everything "inside the mind" sits within x 440..640,
 * y 350..530.
 */
const HX = 540;
const HY = 440;
const HR = 125;

const Head: React.FC<{ readonly delay?: number }> = ({ delay = 0 }) => (
  <Bust cx={HX} headY={HY} r={HR} delay={delay} />
);

export const Sobrepensar: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={22}>
    <Head />
    <Ln d={scribble(HX, HY, 84, 16, 3)} dur={80} />
  </Build>
);

export const PensamientosAcelerados: React.FC<IconProps> = ({ delay = 0 }) => {
  const r = 52;
  const a1 = (190 * Math.PI) / 180;
  const ex = HX + Math.cos(a1) * r;
  const ey = HY + Math.sin(a1) * r;
  return (
    <Build delay={delay} step={16}>
      <Head />
      <Ln d={`M ${HX} ${HY - r} A ${r} ${r} 0 1 1 ${ex} ${ey}`} dur={30} thin />
      <Ln d={headAt(ex, ey, (280 * Math.PI) / 180, 20)} dur={10} thin />
      <Ln d="M 300 400 L 380 400" thin o={0.6} />
      <Ln d="M 280 440 L 380 440" thin o={0.6} />
      <Ln d="M 300 480 L 380 480" thin o={0.6} />
    </Build>
  );
};

export const MenteEnCalma: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame breath={0.012}>
    <Build delay={delay} step={20}>
      <Head />
      <Ln d="M 466 452 L 614 452" thin />
      <Ln d="M 506 452 A 34 34 0 0 1 574 452" thin />
      <Ln d="M 496 490 L 584 490" thin o={0.6} />
    </Build>
  </Frame>
);

export const NieblaMental: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={12}>
    <Head />
    {[400, 446, 492].map((y) => (
      <Ln
        key={y}
        d={`M 380 ${y} q 40 -16 80 0 t 80 0 t 80 0 t 80 0`}
        thin
        o={0.6}
        dur={30}
      />
    ))}
  </Build>
);

export const MenteDespejada: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={18}>
    <Head />
    <Arrow from={[640, 340]} to={[690, 296]} thin />
    <Ln d={cloudPath(752, 262, 60, 34, 9)} thin dur={30} />
  </Build>
);

export const Idea: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={10}>
    <Ln
      d="M 492 572 C 492 536 452 512 452 452 C 452 402 492 364 540 364 C 588 364 628 402 628 452 C 628 512 588 536 588 572"
      dur={40}
    />
    <Ln d="M 492 572 L 588 572" />
    <Ln d="M 500 604 L 580 604" thin />
    <Ln d="M 514 636 L 566 636" thin />
    <Ln d="M 510 520 L 524 474 L 540 508 L 556 474 L 570 520" thin />
    {[-150, -120, -90, -60, -30].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return (
        <Ln
          key={deg}
          d={`M ${540 + Math.cos(a) * 120} ${452 + Math.sin(a) * 120} L ${540 + Math.cos(a) * 152} ${452 + Math.sin(a) * 152}`}
          thin
          o={0.7}
          dur={10}
        />
      );
    })}
  </Build>
);

export const Duda: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={20}>
    <Head />
    <Ln d={questionHook(HX, 432, 1.25)} dur={30} />
    <Pt x={HX} y={496} r={10} />
  </Build>
);

export const Distraccion: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={8}>
    <Pt x={540} y={540} r={16} />
    <Dash d={circ(540, 540, 52)} o={0.4} />
    {[-90, -18, 54, 126, 198].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return (
        <Arrow
          key={deg}
          from={[540 + Math.cos(a) * 80, 540 + Math.sin(a) * 80]}
          to={[540 + Math.cos(a) * 200, 540 + Math.sin(a) * 200]}
          thin
        />
      );
    })}
  </Build>
);

export const CriticaInterna: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={18}>
    <Head />
    <Ln
      d={`${roundedRect(466, 386, 148, 84, 18)} M 500 470 L 488 500 L 524 470`}
      thin
      dur={34}
    />
    <Ln d={zigzag(488, 440, 6, 17, 22)} thin />
  </Build>
);

export const Etiqueta: React.FC<IconProps> = ({ delay = 0 }) => (
  <Build delay={delay} step={14}>
    <Ln d="M 380 470 L 450 400 L 700 400 L 700 540 L 450 540 Z" dur={40} />
    <Ln d={circ(432, 470, 14)} thin />
    <Ln d="M 418 470 C 384 470 350 444 350 404" thin />
    <Ln d="M 490 450 L 660 450" thin />
    <Ln d="M 490 492 L 610 492" thin />
  </Build>
);

export const Recuerdo: React.FC<IconProps> = ({ delay = 0 }) => {
  const r = 56;
  const s = (-30 * Math.PI) / 180;
  const e = (60 * Math.PI) / 180;
  const sx = HX + Math.cos(s) * r;
  const sy = HY + Math.sin(s) * r;
  const ex = HX + Math.cos(e) * r;
  const ey = HY + Math.sin(e) * r;
  return (
    <Build delay={delay} step={18}>
      <Head />
      <Ln d={`M ${sx} ${sy} A ${r} ${r} 0 1 0 ${ex} ${ey}`} thin dur={30} />
      <Ln d={headAt(ex, ey, e - Math.PI / 2, 20)} thin dur={10} />
      <Ln d={`M ${HX} ${HY} L ${HX} ${HY - 30}`} thin />
      <Pt x={HX} y={HY} r={7} />
    </Build>
  );
};
