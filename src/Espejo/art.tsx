import React from "react";

/**
 * Drawings for the mirror piece, each authored in its own 200x200 box
 * with the feet resting on y = 198.
 */

const line = {
  fill: "none" as const,
  stroke: "white",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Body: React.FC<{ w: number }> = ({ w }) => (
  <>
    <path d="M68 76 C68 65 82 58 100 58 C118 58 132 65 132 76 L136 134 L64 134 Z" strokeWidth={w} />
    <path d="M80 63 q20 15 40 0" strokeWidth={w * 0.8} />
    <path d="M68 80 L59 124 q9 7 18 1" strokeWidth={w} />
    <path d="M132 80 L141 124 q-9 7 -18 1" strokeWidth={w} />
    <path d="M83 134 L81 188" strokeWidth={w} />
    <path d="M117 134 L119 188" strokeWidth={w} />
    <path d="M70 188 h22 q5 0 5 5 v5 h-27 z" strokeWidth={w} />
    <path d="M108 188 h22 q5 0 5 5 v5 h-27 z" strokeWidth={w} />
  </>
);

/** Figure seen from behind — hood down, no face. */
export const FigureBack: React.FC<{ width?: number }> = ({ width = 5 }) => (
  <g {...line}>
    <circle cx={100} cy={38} r={23} strokeWidth={width} />
    <path
      d="M78 32 C80 14 92 8 100 12 C110 6 122 14 122 32"
      strokeWidth={width}
    />
    <Body w={width} />
    <path d="M78 104 q22 9 44 0" strokeWidth={width * 0.8} />
  </g>
);

/** The same figure face on — this is the one in the mirror. */
export const FigureFront: React.FC<{ width?: number }> = ({ width = 5 }) => (
  <g {...line}>
    <circle cx={100} cy={38} r={23} strokeWidth={width} />
    <path
      d="M78 32 C80 14 92 8 100 12 C110 6 122 14 122 32"
      strokeWidth={width}
    />
    <circle cx={92} cy={38} r={3.4} fill="white" stroke="none" />
    <circle cx={108} cy={38} r={3.4} fill="white" stroke="none" />
    <path d="M92 48 q8 7 16 0" strokeWidth={width * 0.8} />
    <Body w={width} />
    <path d="M100 66 L100 112" strokeWidth={width * 0.7} />
  </g>
);

/** A standing mirror: oval frame on an A-frame stand. */
export const MirrorFrame: React.FC = () => (
  <g {...line}>
    <ellipse cx={100} cy={88} rx={74} ry={86} strokeWidth={6} />
    <ellipse cx={100} cy={88} rx={64} ry={76} strokeWidth={2.5} />
    <path d="M76 168 L100 150 L124 168" strokeWidth={5} />
    <path d="M68 174 h64" strokeWidth={5} />
  </g>
);

export const Heart: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <path
    d="M100 152 C40 108 48 44 76 44 C89 44 100 56 100 66 C100 56 111 44 124 44
       C152 44 160 108 100 152 Z"
    fill={filled ? "white" : "none"}
    stroke="white"
    strokeWidth={10}
    strokeLinejoin="round"
  />
);

/** Small walking figure for the crowd heading away. */
export const Walker: React.FC<{ phase: number }> = ({ phase }) => {
  const swing = Math.sin(phase) * 13;

  return (
    <g {...line} strokeWidth={7}>
      <circle cx={100} cy={40} r={22} />
      <path d="M72 82 C72 71 85 64 100 64 C115 64 128 71 128 82 L132 138 L68 138 Z" />
      <path d={`M85 138 L${85 - swing} 194`} />
      <path d={`M115 138 L${115 + swing} 194`} />
    </g>
  );
};
