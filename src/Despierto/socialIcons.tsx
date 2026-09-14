import React from "react";

/** Simplified social glyphs, drawn white-on-black at 100x100. */

const SQUIRCLE =
  "M22 4 h56 a18 18 0 0 1 18 18 v56 a18 18 0 0 1 -18 18 h-56 a18 18 0 0 1 -18 -18 v-56 a18 18 0 0 1 18 -18 z";

const Instagram = () => (
  <>
    <path d={SQUIRCLE} fill="white" />
    <circle cx={50} cy={50} r={18} fill="none" stroke="black" strokeWidth={7} />
    <circle cx={73} cy={27} r={4.5} fill="black" />
  </>
);

const YouTube = () => (
  <>
    <rect x={5} y={24} width={90} height={52} rx={16} fill="white" />
    <path d="M42 38 L68 50 L42 62 Z" fill="black" />
  </>
);

const TikTok = () => (
  <>
    <circle cx={50} cy={50} r={46} fill="white" />
    <path
      d="M57 22 h10 c1 8 6 13 14 14 v10 c-6 0 -11 -2 -14 -5 v20 a17 17 0 1 1 -17 -17 c1 0 2 0 3 1 v10 a7 7 0 1 0 4 6 z"
      fill="black"
    />
  </>
);

const Facebook = () => (
  <>
    <circle cx={50} cy={50} r={46} fill="white" />
    <path
      d="M57 36 h9 v-11 h-10 c-9 0 -14 6 -14 14 v7 h-8 v11 h8 v25 h12 v-25 h9 l2 -11 h-11 v-6 c0 -3 1 -4 3 -4 z"
      fill="black"
    />
  </>
);

const Threads = () => (
  <path
    d="M64 28 c-20 -10 -38 2 -38 22 c0 20 16 30 30 24 c11 -5 13 -18 4 -23 c-9 -5 -18 1 -14 9"
    fill="none"
    stroke="white"
    strokeWidth={9}
    strokeLinecap="round"
  />
);

const Snapchat = () => (
  <path
    d="M50 8 c-16 0 -25 12 -25 27 c0 6 1 9 -2 11 c-4 3 -11 2 -11 7 c0 4 8 5 11 9 c2 3 0 6 3 8 c4 1 10 -1 14 1 c4 2 6 9 10 9 c4 0 6 -7 10 -9 c4 -2 10 0 14 -1 c3 -2 1 -5 3 -8 c3 -4 11 -5 11 -9 c0 -5 -7 -4 -11 -7 c-3 -2 -2 -5 -2 -11 c0 -15 -9 -27 -25 -27 z"
    fill="white"
  />
);

export const SOCIAL = [Instagram, TikTok, Threads, YouTube, Snapchat, Facebook];

export const SocialIcon: React.FC<{ index: number; size: number }> = ({
  index,
  size,
}) => {
  const Glyph = SOCIAL[index % SOCIAL.length];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <Glyph />
    </svg>
  );
};
