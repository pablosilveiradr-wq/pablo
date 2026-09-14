import React from "react";

/**
 * The drawings. Everything is authored in its own 200x200 box and placed
 * by the scenes with a transform, so sizes stay easy to reason about.
 */

/** Cloud outline: n bumps around a circle — the top-down brain and its folds. */
const cloud = (cx: number, cy: number, r: number, n: number, bump: number) => {
  const pts = new Array(n).fill(0).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

  return (
    `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} ` +
    pts
      .slice(1)
      .concat([pts[0]])
      .map(([x, y]) => `A ${bump} ${bump} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ")
  );
};

/** The symmetric, top-down brain that sits on the badge. */
export const BrainTop: React.FC<{ stroke?: number }> = ({ stroke = 5 }) => (
  <g>
    <path
      d={cloud(100, 100, 74, 13, 23)}
      fill="#080808"
      stroke="white"
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
    <line x1={100} y1={26} x2={100} y2={174} stroke="white" strokeWidth={stroke} />
    {[-1, 1].map((s) => (
      <g key={s} transform={s === 1 ? "" : "translate(200,0) scale(-1,1)"}>
        <path
          d="M108 44 C124 48 128 62 118 70"
          fill="none"
          stroke="white"
          strokeWidth={stroke - 1}
          strokeLinecap="round"
        />
        <path
          d="M132 62 C148 68 150 84 138 90"
          fill="none"
          stroke="white"
          strokeWidth={stroke - 1}
          strokeLinecap="round"
        />
        <path
          d="M126 118 C142 122 146 136 134 144"
          fill="none"
          stroke="white"
          strokeWidth={stroke - 1}
          strokeLinecap="round"
        />
        <path
          d="M104 146 C118 152 120 162 112 168"
          fill="none"
          stroke="white"
          strokeWidth={stroke - 1}
          strokeLinecap="round"
        />
      </g>
    ))}
  </g>
);

/** The side-on brain used in the cage and at the centre of the orbit. */
export const BrainSide: React.FC<{ stroke?: number }> = ({ stroke = 5 }) => (
  <g
    fill="none"
    stroke="white"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M52 132 C30 132 20 116 30 102 C12 94 16 70 34 66 C30 46 50 32 66 40
         C74 24 100 22 110 36 C124 24 146 28 152 46 C172 48 180 70 166 82
         C176 100 160 120 142 114 L136 142 L122 120 C108 130 86 128 76 118
         C70 128 60 132 52 132 Z"
    />
    <path d="M62 62 C76 70 76 86 62 94" />
    <path d="M92 48 C106 58 104 78 90 84" />
    <path d="M124 54 C138 64 136 82 122 88" />
    <path d="M78 106 C94 114 114 112 126 102" />
  </g>
);

export const Dumbbell: React.FC = () => (
  <g fill="none" stroke="white" strokeWidth={6} strokeLinecap="round">
    <line x1={62} y1={100} x2={138} y2={100} />
    <rect x={44} y={74} width={22} height={52} rx={6} />
    <rect x={134} y={74} width={22} height={52} rx={6} />
    <line x1={32} y1={86} x2={32} y2={114} />
    <line x1={168} y1={86} x2={168} y2={114} />
  </g>
);

export const Bulb: React.FC = () => (
  <g fill="none" stroke="white" strokeWidth={6} strokeLinecap="round">
    <path d="M100 38 a38 38 0 0 1 24 67 v12 h-48 v-12 a38 38 0 0 1 24 -67 z" />
    <line x1={80} y1={132} x2={120} y2={132} />
    <line x1={86} y1={148} x2={114} y2={148} />
    {[-40, -20, 0, 20, 40].map((d) => (
      <line
        key={d}
        x1={100 + Math.sin((d * Math.PI) / 180) * 58}
        y1={70 - Math.cos((d * Math.PI) / 180) * 58}
        x2={100 + Math.sin((d * Math.PI) / 180) * 74}
        y2={70 - Math.cos((d * Math.PI) / 180) * 74}
      />
    ))}
  </g>
);

export const RainCloud: React.FC = () => (
  <g fill="none" stroke="white" strokeWidth={6} strokeLinecap="round">
    <path d="M62 116 a24 24 0 0 1 4 -48 a32 32 0 0 1 60 8 a20 20 0 0 1 -4 40 z" />
    {[0, 1, 2, 3].map((i) => (
      <line
        key={i}
        x1={62 + i * 20}
        y1={128}
        x2={54 + i * 20}
        y2={152}
      />
    ))}
  </g>
);

export const SunRays: React.FC = () => (
  <g fill="none" stroke="white" strokeWidth={6} strokeLinecap="round">
    <circle cx={100} cy={100} r={26} />
    {new Array(12).fill(0).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return (
        <line
          key={i}
          x1={100 + Math.cos(a) * 38}
          y1={100 + Math.sin(a) * 38}
          x2={100 + Math.cos(a) * 60}
          y2={100 + Math.sin(a) * 60}
        />
      );
    })}
  </g>
);

export const Stopwatch: React.FC<{ sweep: number }> = ({ sweep }) => {
  const a = (-90 + sweep * 360) * (Math.PI / 180);
  const large = sweep > 0.5 ? 1 : 0;

  return (
    <g fill="none" stroke="white" strokeWidth={6} strokeLinecap="round">
      <circle cx={100} cy={112} r={62} />
      <line x1={86} y1={38} x2={114} y2={38} />
      <path d="M92 38 h16 v14 h-16 z" />
      <line x1={148} y1={52} x2={162} y2={40} />
      {new Array(12).fill(0).map((_, i) => {
        const t = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={100 + Math.cos(t) * 48}
            y1={112 + Math.sin(t) * 48}
            x2={100 + Math.cos(t) * 54}
            y2={112 + Math.sin(t) * 54}
            strokeWidth={4}
          />
        );
      })}
      {sweep > 0.01 ? (
        <path
          d={`M100 112 L100 66 A46 46 0 ${large} 1 ${
            100 + Math.cos(a) * 46
          } ${112 + Math.sin(a) * 46} Z`}
          fill="white"
          stroke="none"
        />
      ) : null}
    </g>
  );
};

/** The cartoon portrait inside the chain badge. */
export const Avatar: React.FC = () => (
  <g>
    {/* shirt */}
    <path d="M80 172 h40 v30 h-40 z" fill="white" />
    {/* ears, behind the face */}
    <circle cx={56} cy={120} r={11} fill="white" />
    <circle cx={144} cy={120} r={11} fill="white" />
    <path
      d="M54 116 q6 4 1 9 M146 116 q-6 4 -1 9"
      fill="none"
      stroke="#151515"
      strokeWidth={3}
      strokeLinecap="round"
    />
    {/* face */}
    <path d="M58 104 a42 42 0 0 1 84 0 v22 a42 44 0 0 1 -84 0 z" fill="white" />
    {/* curly hair, laid over the forehead */}
    <path
      d="M48 126 A22 22 0 0 1 58 60 A22 22 0 0 1 84 40 A22 22 0 0 1 112 40
         A23 23 0 0 1 140 58 A22 22 0 0 1 152 126
         C150 96 130 82 100 82 C70 82 50 96 48 126 Z"
      fill="#0b0b0b"
    />
    {/* eye, wink, nose, smile */}
    <circle cx={84} cy={118} r={4.5} fill="#151515" />
    <path
      d="M109 119 q8 -8 16 0"
      fill="none"
      stroke="#151515"
      strokeWidth={4}
      strokeLinecap="round"
    />
    <path
      d="M101 114 q-6 12 3 13"
      fill="none"
      stroke="#151515"
      strokeWidth={3.5}
      strokeLinecap="round"
    />
    <path
      d="M87 140 q14 11 27 0"
      fill="none"
      stroke="#151515"
      strokeWidth={4}
      strokeLinecap="round"
    />
  </g>
);

/** Two stacked folders with a face on the front one. */
export const Folder: React.FC<{ mood: number }> = ({ mood }) => (
  <g fill="none" stroke="white" strokeWidth={4.5} strokeLinejoin="round">
    <path d="M52 44 h52 l16 20 h56 a10 10 0 0 1 10 10 v82 a10 10 0 0 1 -10 10 h-124 a10 10 0 0 1 -10 -10 v-102 a10 10 0 0 1 10 -10 z" />
    <path d="M28 62 h52 l16 20 h56 a10 10 0 0 1 10 10 v82 a10 10 0 0 1 -10 10 h-124 a10 10 0 0 1 -10 -10 v-102 a10 10 0 0 1 10 -10 z" />
    <circle cx={92} cy={124} r={34} />
    <circle cx={80} cy={114} r={3.5} fill="white" />
    {mood < 0.5 ? (
      <>
        <circle cx={104} cy={114} r={3.5} fill="white" />
        <path d="M78 140 q14 -13 28 0" />
      </>
    ) : (
      <>
        <path d="M99 114 q6 -6 11 0" />
        <path d="M78 132 q14 13 28 0" />
        <path d="M88 138 q6 12 12 0" fill="white" />
      </>
    )}
    <path d="M124 78 q9 14 0 20 q-9 -6 0 -20 z" />
  </g>
);

export const Magnifier: React.FC = () => (
  <g fill="none" stroke="white" strokeWidth={6} strokeLinecap="round">
    <circle cx={86} cy={86} r={44} />
    <line x1={118} y1={118} x2={152} y2={152} />
  </g>
);

/** Small glyphs that fill the grid on the cards. */
export const GLYPHS: ((k: string) => React.ReactNode)[] = [
  (k) => <path key={k} d="M-16 0 H16 M0 -16 V16" strokeWidth={6} />,
  (k) => <rect key={k} x={-16} y={-11} width={32} height={22} />,
  (k) => <path key={k} d="M0 -16 L14 -8 V8 L0 16 L-14 8 V-8 Z" />,
  (k) => <path key={k} d="M-15 6 A15 15 0 0 1 15 6 Z" />,
  (k) => <path key={k} d="M-15 -10 H15 L0 14 Z" />,
  (k) => <path key={k} d="M0 -16 L16 0 L0 16 L-16 0 Z" />,
  (k) => <path key={k} d="M-15 8 A15 15 0 0 1 15 8" fill="none" strokeWidth={5} />,
  (k) => <path key={k} d="M-14 14 V-12 L14 14 Z" />,
  (k) => <path key={k} d="M-12 -12 L12 12 M12 -12 L-12 12" strokeWidth={6} />,
  (k) => <path key={k} d="M0 -15 A15 15 0 0 1 0 15 Z" />,
  (k) => <circle key={k} cx={0} cy={0} r={14} />,
  (k) => <rect key={k} x={-14} y={-14} width={28} height={28} />,
  (k) => <path key={k} d="M0 -16 L15 -5 L9 14 H-9 L-15 -5 Z" />,
  (k) => <path key={k} d="M-15 -8 H15 V8 H-15 Z M-15 0 H15" strokeWidth={4} />,
];
