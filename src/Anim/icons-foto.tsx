import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Appear,
  DrawPath,
  Dot,
  IconProps,
  circlePath,
  useBreath,
  useDrawFrame,
  useReveal,
} from "./primitives";
import { CENTER, INK, STROKE_THIN } from "./theme";

/**
 * Metaphors for the "esta foto no alcanza" reel: outline only, one centred
 * subject per beat, authored inside y 250..700 so the caption keeps its band.
 */

/** Heart of exactly `w` across, centred on (cx, cy). */
const heartPath = (cx: number, cy: number, w: number) => {
  const h = w * 0.88;
  const X = (u: number) => cx + (u / 100 - 0.5) * w;
  const Y = (v: number) => cy + (v / 88 - 0.5) * h;
  return [
    `M ${X(50)} ${Y(88)}`,
    `C ${X(20)} ${Y(68)} ${X(0)} ${Y(46)} ${X(0)} ${Y(28)}`,
    `C ${X(0)} ${Y(12)} ${X(12)} ${Y(0)} ${X(26)} ${Y(0)}`,
    `C ${X(36)} ${Y(0)} ${X(45)} ${Y(6)} ${X(50)} ${Y(14)}`,
    `C ${X(55)} ${Y(6)} ${X(64)} ${Y(0)} ${X(74)} ${Y(0)}`,
    `C ${X(88)} ${Y(0)} ${X(100)} ${Y(12)} ${X(100)} ${Y(28)}`,
    `C ${X(100)} ${Y(46)} ${X(80)} ${Y(68)} ${X(50)} ${Y(88)}`,
    "Z",
  ].join(" ");
};

/**
 * Every icon is authored at whatever size its geometry wanted, then framed
 * here: scaled and recentred so all fifteen carry the same optical weight.
 */
const Frame: React.FC<{
  readonly scale?: number;
  readonly dx?: number;
  readonly dy?: number;
  readonly breath?: number;
  readonly children: React.ReactNode;
}> = ({ scale = 1, dx = 0, dy = 0, breath = 0, children }) => {
  const b = useBreath(breath);
  return (
    <g
      style={{
        transform: `translate(${dx}px, ${dy}px) scale(${scale * (breath ? b : 1)})`,
        transformOrigin: `${CENTER}px ${CENTER}px`,
        transformBox: "view-box",
      }}
    >
      {children}
    </g>
  );
};

/** A key, handed over — "te doy una herramienta". */
export const HandKey: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame / 118) * Math.PI * 2) * 8;
  return (
    <Frame scale={1.21} dy={56}>
      <g transform={`translate(0 ${bob})`}>
        <DrawPath d={circlePath(540, 384, 96)} delay={delay} duration={34} />
        <DrawPath
          d={circlePath(540, 384, 38)}
          delay={delay + 26}
          duration={18}
          strokeWidth={STROKE_THIN}
        />
        <DrawPath d="M 540 480 L 540 700" delay={delay + 38} duration={26} />
        <DrawPath d="M 540 604 L 606 604" delay={delay + 58} duration={12} />
        <DrawPath d="M 540 660 L 592 660" delay={delay + 64} duration={12} />
        {[-2.6, -2.05, -1.5, -0.95, -0.4].map((a, i) => (
          <Appear key={i} delay={delay + 24 + i * 5} duration={12}>
            <line
              x1={540 + Math.cos(a) * 118}
              y1={384 + Math.sin(a) * 118}
              x2={540 + Math.cos(a) * 146}
              y2={384 + Math.sin(a) * 146}
              strokeWidth={STROKE_THIN}
              opacity={0.6}
            />
          </Appear>
        ))}
      </g>
    </Frame>
  );
};

/** A phone holding somebody else's post — the thing that sets the beat off. */
export const PhotoPost: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.17} dy={70} breath={0.01}>
    <DrawPath
      d="M 404 296 A 30 30 0 0 1 434 266 L 646 266 A 30 30 0 0 1 676 296 L 676 664 A 30 30 0 0 1 646 694 L 434 694 A 30 30 0 0 1 404 664 Z"
      delay={delay}
      duration={40}
    />
    <DrawPath
      d="M 512 294 L 568 294"
      delay={delay + 30}
      duration={8}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d="M 434 334 L 646 334 L 646 546 L 434 546 Z"
      delay={delay + 34}
      duration={28}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d={circlePath(600, 386, 20)}
      delay={delay + 54}
      duration={14}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d="M 442 528 L 508 434 L 552 490 L 590 446 L 640 528"
      delay={delay + 60}
      duration={24}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d={heartPath(468, 606, 46)}
      delay={delay + 76}
      duration={18}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d="M 516 600 L 644 600"
      delay={delay + 84}
      duration={12}
      strokeWidth={STROKE_THIN}
    />
    <DrawPath
      d="M 516 640 L 596 640"
      delay={delay + 88}
      duration={12}
      strokeWidth={STROKE_THIN}
    />
  </Frame>
);

/** A heart with a fracture running through it — "nunca le importaste". */
export const HeartCrack: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.9} dy={157} breath={0.016}>
    <DrawPath d={heartPath(540, 458, 260)} delay={delay} duration={40} />
    <DrawPath
      d="M 540 382 L 504 434 L 566 472 L 520 514 L 540 566"
      delay={delay + 36}
      duration={26}
    />
  </Frame>
);

/** An open palm held up — stop before you conclude. */
export const HandStop: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.33} dx={35} dy={49} breath={0.012}>
    <DrawPath
      d={[
        "M 452 620",
        "L 452 546",
        "C 408 532 380 480 406 454",
        "C 432 428 464 462 470 506",
        "L 470 358",
        "A 18 18 0 0 1 506 358",
        "L 506 446",
        "L 516 446",
        "L 516 328",
        "A 18 18 0 0 1 552 328",
        "L 552 446",
        "L 562 446",
        "L 562 342",
        "A 18 18 0 0 1 598 342",
        "L 598 456",
        "L 608 456",
        "L 608 392",
        "A 16 16 0 0 1 640 392",
        "L 640 620",
        "C 640 692 452 692 452 620",
        "Z",
      ].join(" ")}
      delay={delay}
      duration={80}
    />
  </Frame>
);

/** The photo put under a lens, with a question where the answer should be. */
export const PhotoLens: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.18} dx={-14} dy={34}>
    <g>
      <DrawPath
        d="M 340 320 L 700 320 L 700 566 L 340 566 Z"
        delay={delay}
        duration={36}
      />
      <DrawPath
        d={circlePath(624, 402, 18)}
        delay={delay + 28}
        duration={12}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath
        d="M 356 548 L 432 446 L 484 506 L 528 452 L 590 548"
        delay={delay + 34}
        duration={24}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath
        d={circlePath(628, 566, 96)}
        delay={delay + 54}
        duration={30}
        occlude
      />
      <DrawPath
        d="M 596 534 C 596 504 662 504 662 534 C 662 558 628 556 628 584"
        delay={delay + 78}
        duration={18}
      />
      <Dot cx={628} cy={614} r={8} delay={delay + 94} />
      <DrawPath d="M 698 636 L 764 702" delay={delay + 84} duration={14} />
    </g>
  </Frame>
);

/** A head under a thought bubble that holds nothing but guesses. */
export const ThoughtSupposing: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 136) * Math.PI * 2) * 7;
  return (
    <Frame scale={1.02} dx={-6} dy={58}>
      <g>
        <DrawPath d={circlePath(410, 532, 80)} delay={delay} duration={30} />
        <DrawPath
          d="M 300 700 C 300 608 520 608 520 700"
          delay={delay + 24}
          duration={28}
        />
        <g transform={`translate(0 ${drift})`}>
          <DrawPath
            d="M 556 322 A 56 56 0 0 1 612 266 L 736 266 A 56 56 0 0 1 792 322 L 792 372 A 56 56 0 0 1 736 428 L 612 428 A 56 56 0 0 1 556 372 Z"
            delay={delay + 34}
            duration={36}
          />
          <Appear delay={delay + 62} duration={14}>
            <circle cx={618} cy={348} r={10} fill={INK} stroke="none" />
            <circle cx={674} cy={348} r={10} fill={INK} stroke="none" />
            <circle cx={730} cy={348} r={10} fill={INK} stroke="none" />
          </Appear>
        </g>
        <DrawPath
          d={circlePath(512, 462, 20)}
          delay={delay + 52}
          duration={12}
          strokeWidth={STROKE_THIN}
        />
        <DrawPath
          d={circlePath(478, 508, 12)}
          delay={delay + 58}
          duration={10}
          strokeWidth={STROKE_THIN}
        />
      </g>
    </Frame>
  );
};

/** One lit frame between two you never get to see. */
export const OneFrame: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={0.96} dy={12}>
    <g>
      <DrawPath
        d="M 248 418 L 428 418 L 428 570 L 248 570 Z"
        delay={delay + 34}
        duration={24}
        strokeWidth={STROKE_THIN}
        opacity={0.28}
      />
      <DrawPath
        d="M 652 418 L 832 418 L 832 570 L 652 570 Z"
        delay={delay + 40}
        duration={24}
        strokeWidth={STROKE_THIN}
        opacity={0.28}
      />
      <DrawPath
        d="M 444 386 L 636 386 L 636 602 L 444 602 Z"
        delay={delay}
        duration={32}
        occlude
      />
      <DrawPath
        d={circlePath(592, 436, 17)}
        delay={delay + 26}
        duration={12}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath
        d="M 456 586 L 516 508 L 552 546 L 584 506 L 626 586"
        delay={delay + 32}
        duration={22}
        strokeWidth={STROKE_THIN}
      />
      <Dot cx={468} cy={664} r={7} delay={delay + 56} opacity={0.5} />
      <Dot cx={540} cy={664} r={7} delay={delay + 62} opacity={0.5} />
      <Dot cx={612} cy={664} r={7} delay={delay + 68} opacity={0.5} />
    </g>
  </Frame>
);

/** The tip you can see, and the weight you cannot — what they actually feel. */
export const Iceberg: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame / 150) * Math.PI * 2) * 5;
  return (
    <Frame scale={0.92} dy={37}>
      <g transform={`translate(0 ${bob})`}>
        <DrawPath
          d="M 452 470 L 540 320 L 628 470 Z"
          delay={delay}
          duration={30}
        />
        <DrawPath
          d="M 236 470 L 844 470"
          delay={delay + 24}
          duration={28}
          strokeWidth={STROKE_THIN}
        />
        <DrawPath
          d="M 392 470 L 688 470 L 654 580 L 578 680 L 476 664 L 374 566 Z"
          delay={delay + 44}
          duration={44}
          strokeWidth={STROKE_THIN}
          opacity={0.5}
        />
        <DrawPath
          d={heartPath(528, 572, 100)}
          delay={delay + 84}
          duration={24}
          strokeWidth={STROKE_THIN}
          opacity={0.75}
        />
      </g>
    </Frame>
  );
};

/** Two people and the part of the thread between them you never held. */
export const LinkPair: React.FC<IconProps> = ({ delay = 0 }) => (
  <Frame scale={1.01} dy={64}>
    <g>
      <DrawPath d={circlePath(348, 542, 58)} delay={delay} duration={24} />
      <DrawPath
        d="M 262 660 C 262 594 434 594 434 660"
        delay={delay + 18}
        duration={22}
      />
      <DrawPath d={circlePath(732, 542, 58)} delay={delay + 12} duration={24} />
      <DrawPath
        d="M 646 660 C 646 594 818 594 818 660"
        delay={delay + 30}
        duration={22}
      />
      <DrawPath
        d="M 410 478 C 444 428 486 408 506 402"
        delay={delay + 46}
        duration={20}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath
        d="M 670 478 C 636 428 594 408 574 402"
        delay={delay + 52}
        duration={20}
        strokeWidth={STROKE_THIN}
      />
      <DrawPath
        d="M 512 320 C 512 292 568 292 568 320 C 568 344 540 342 540 368"
        delay={delay + 66}
        duration={20}
      />
      <Dot cx={540} cy={398} r={8} delay={delay + 84} />
    </g>
  </Frame>
);

/** A sentence brought in to the size the evidence actually supports. */
export const SpeechFit: React.FC<IconProps> = ({ delay = 0 }) => {
  const squeeze = interpolate(useDrawFrame() - delay - 62, [0, 34], [46, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Frame scale={1.19} dy={71}>
      <g>
        <DrawPath
          d="M 408 388 A 40 40 0 0 1 448 348 L 632 348 A 40 40 0 0 1 672 388 L 672 512 A 40 40 0 0 1 632 552 L 528 552 L 476 612 L 476 552 L 448 552 A 40 40 0 0 1 408 512 Z"
          delay={delay}
          duration={44}
        />
        <DrawPath
          d="M 450 420 L 630 420"
          delay={delay + 36}
          duration={14}
          strokeWidth={STROKE_THIN}
        />
        <DrawPath
          d="M 450 474 L 574 474"
          delay={delay + 42}
          duration={14}
          strokeWidth={STROKE_THIN}
        />
        <g transform={`translate(${-squeeze} 0)`}>
          <DrawPath
            d="M 356 360 L 330 360 L 330 542 L 356 542"
            delay={delay + 52}
            duration={18}
            strokeWidth={STROKE_THIN}
          />
        </g>
        <g transform={`translate(${squeeze} 0)`}>
          <DrawPath
            d="M 724 360 L 750 360 L 750 542 L 724 542"
            delay={delay + 56}
            duration={18}
            strokeWidth={STROKE_THIN}
          />
        </g>
      </g>
    </Frame>
  );
};

/** The frame stops carrying information long before your conclusion does. */
export const PhotoGap: React.FC<IconProps> = ({ delay = 0 }) => {
  const dots = [
    { x: 566, y: 520, r: 8, o: 0.7 },
    { x: 600, y: 500, r: 7, o: 0.55 },
    { x: 634, y: 512, r: 6, o: 0.42 },
    { x: 664, y: 486, r: 5, o: 0.3 },
    { x: 690, y: 504, r: 4, o: 0.2 },
  ];
  return (
    <Frame scale={1.49} dy={60}>
      <g>
        <DrawPath
          d="M 372 336 L 708 336 L 708 592 L 372 592 Z"
          delay={delay}
          duration={36}
        />
        <DrawPath
          d="M 392 572 L 466 470 L 518 530 L 554 486"
          delay={delay + 30}
          duration={24}
          strokeWidth={STROKE_THIN}
        />
        {dots.map((d, i) => (
          <Dot
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            delay={delay + 52 + i * 5}
            opacity={d.o}
          />
        ))}
        <DrawPath
          d="M 614 392 C 614 366 668 366 668 392 C 668 414 641 412 641 436"
          delay={delay + 76}
          duration={18}
          strokeWidth={STROKE_THIN}
          opacity={0.75}
        />
        <Dot cx={641} cy={462} r={6} delay={delay + 92} opacity={0.75} />
      </g>
    </Frame>
  );
};

/** Going down the evidence line by line before the story gets to speak. */
export const ClipboardCheck: React.FC<IconProps> = ({ delay = 0 }) => {
  const rows = [0, 1, 2];
  return (
    <Frame scale={1.15} dy={79} breath={0.01}>
      <DrawPath
        d="M 396 316 A 24 24 0 0 1 420 292 L 660 292 A 24 24 0 0 1 684 316 L 684 664 A 24 24 0 0 1 660 688 L 420 688 A 24 24 0 0 1 396 664 Z"
        delay={delay}
        duration={40}
      />
      <DrawPath
        d="M 486 292 L 486 274 A 20 20 0 0 1 506 254 L 574 254 A 20 20 0 0 1 594 274 L 594 292"
        delay={delay + 30}
        duration={20}
        occlude
      />
      {rows.map((i) => {
        const y = 366 + i * 104;
        return (
          <g key={i}>
            <DrawPath
              d={`M 434 ${y} L 474 ${y} L 474 ${y + 40} L 434 ${y + 40} Z`}
              delay={delay + 40 + i * 12}
              duration={18}
              strokeWidth={STROKE_THIN}
            />
            <DrawPath
              d={`M 502 ${y + 20} L ${i === 2 ? 612 : 646} ${y + 20}`}
              delay={delay + 48 + i * 12}
              duration={14}
              strokeWidth={STROKE_THIN}
            />
            <DrawPath
              d={`M 440 ${y + 20} L 452 ${y + 32} L 470 ${y + 6}`}
              delay={delay + 76 + i * 16}
              duration={14}
            />
          </g>
        );
      })}
    </Frame>
  );
};

/** One moment, two readings — you get to pick which one you accept. */
export const ForkPaths: React.FC<IconProps> = ({ delay = 0 }) => {
  const spark = useReveal(delay + 78, 18);
  return (
    <Frame scale={1.25} dx={-13} dy={-11}>
      <g>
        <Dot cx={540} cy={676} r={11} delay={delay} />
        <DrawPath
          d="M 540 664 C 508 588 428 546 376 508"
          delay={delay + 10}
          duration={30}
        />
        <DrawPath
          d="M 540 664 C 572 588 652 546 704 508"
          delay={delay + 18}
          duration={30}
        />
        <DrawPath
          d="M 376 508 L 412 518 M 376 508 L 390 544"
          delay={delay + 40}
          duration={12}
          strokeWidth={STROKE_THIN}
        />
        <DrawPath
          d="M 704 508 L 668 518 M 704 508 L 690 544"
          delay={delay + 46}
          duration={12}
          strokeWidth={STROKE_THIN}
        />
        <g opacity={spark}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={344 + Math.cos(a) * 22}
                y1={434 + Math.sin(a) * 22}
                x2={344 + Math.cos(a) * (22 + 26 * spark)}
                y2={434 + Math.sin(a) * (22 + 26 * spark)}
                strokeWidth={STROKE_THIN}
              />
            );
          })}
        </g>
        <DrawPath
          d={circlePath(736, 434, 46)}
          delay={delay + 60}
          duration={24}
          strokeWidth={STROKE_THIN}
        />
      </g>
    </Frame>
  );
};

/** The hurt held rather than swallowed. */
export const HeartHold: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin((frame / 64) * Math.PI * 2) * 0.03;
  return (
    <Frame scale={1.36} dy={46}>
      <g>
        <g
          style={{
            transform: `scale(${pulse})`,
            transformOrigin: "540px 430px",
            transformBox: "view-box",
          }}
        >
          <DrawPath d={heartPath(540, 414, 232)} delay={delay} duration={36} />
        </g>
        <DrawPath
          d="M 372 564 C 372 690 708 690 708 564"
          delay={delay + 30}
          duration={34}
        />
        <DrawPath
          d="M 372 564 C 358 524 382 492 414 498"
          delay={delay + 54}
          duration={18}
        />
        <DrawPath
          d="M 708 564 C 722 492 698 492 666 498"
          delay={delay + 58}
          duration={18}
        />
        <Dot cx={456} cy={318} r={6} delay={delay + 72} opacity={0.5} />
        <Dot cx={620} cy={296} r={5} delay={delay + 78} opacity={0.4} />
        <Dot cx={540} cy={272} r={4} delay={delay + 84} opacity={0.3} />
      </g>
    </Frame>
  );
};

/** The sign-off. */
export const CloseWave: React.FC<IconProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const wave = Math.sin((frame / 26) * Math.PI * 2) * 6;
  return (
    <Frame scale={1.02} dx={-60} dy={23}>
      <g>
        <DrawPath d={circlePath(500, 424, 78)} delay={delay} duration={30} />
        <DrawPath
          d="M 364 690 C 364 566 636 566 636 690"
          delay={delay + 22}
          duration={32}
        />
        <g
          style={{
            transform: `rotate(${wave}deg)`,
            transformOrigin: "628px 604px",
            transformBox: "view-box",
          }}
        >
          <DrawPath
            d="M 628 604 C 690 586 716 520 704 460"
            delay={delay + 44}
            duration={24}
          />
          <DrawPath
            d="M 686 452 L 678 410"
            delay={delay + 60}
            duration={10}
            strokeWidth={STROKE_THIN}
          />
          <DrawPath
            d="M 706 448 L 706 402"
            delay={delay + 64}
            duration={10}
            strokeWidth={STROKE_THIN}
          />
          <DrawPath
            d="M 726 452 L 734 410"
            delay={delay + 68}
            duration={10}
            strokeWidth={STROKE_THIN}
          />
        </g>
        <DrawPath
          d="M 776 424 A 54 54 0 0 1 776 508"
          delay={delay + 72}
          duration={16}
          strokeWidth={STROKE_THIN}
          opacity={0.55}
        />
        <DrawPath
          d="M 812 400 A 88 88 0 0 1 812 532"
          delay={delay + 80}
          duration={16}
          strokeWidth={STROKE_THIN}
          opacity={0.3}
        />
      </g>
    </Frame>
  );
};
