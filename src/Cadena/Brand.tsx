import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./common";
import { JOST } from "./font";

export const Crystal: React.FC<{ size: number; opacity?: number }> = ({
  size,
  opacity = 1,
}) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 100 135" style={{ opacity }}>
    <defs>
      <linearGradient id="cr-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f4f4f4" />
        <stop offset="100%" stopColor="#4e4e4e" />
      </linearGradient>
      <linearGradient id="cr-b" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d2d2d2" />
        <stop offset="100%" stopColor="#242424" />
      </linearGradient>
    </defs>
    <polygon points="50,2 84,30 50,46 16,30" fill="url(#cr-a)" />
    <polygon points="16,30 50,46 50,133" fill="url(#cr-b)" />
    <polygon points="84,30 50,46 50,133" fill="url(#cr-a)" opacity={0.7} />
    <polygon points="50,2 50,46 16,30" fill="#0c0c0c" opacity={0.55} />
  </svg>
);

export const IgGlyph: React.FC<{ size: number; color: number }> = ({
  size,
  color,
}) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {[false, true].map((colored) => (
      <svg
        key={String(colored)}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: colored ? color : 1 - color,
        }}
      >
        <defs>
          <linearGradient id="ig-g" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffd521" />
            <stop offset="28%" stopColor="#f50000" />
            <stop offset="62%" stopColor="#b900b4" />
            <stop offset="100%" stopColor="#5b6def" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke={colored ? "url(#ig-g)" : "white"}
          strokeWidth={8}
          strokeLinecap="round"
        >
          <rect x={7} y={7} width={86} height={86} rx={26} />
          <circle cx={50} cy={50} r={21} />
          <circle cx={73} cy={26} r={2} strokeWidth={9} />
        </g>
      </svg>
    ))}
  </div>
);

const HANDLE = "@PABLO.SILVEIRA.DR";

/**
 * Logo, handle and subtitle. The handle sits on the right for the first
 * half, moves to the left for the middle scenes, and comes back at the end.
 */
export const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const side = interpolate(t, [9.35, 9.55, 18.1, 18.3], [0, 1, 1, 0], clamp);
  const igColor = interpolate(t, [2.2, 2.45, 4.4, 4.8], [0, 1, 1, 0], clamp);
  const gone = interpolate(t, [19.1, 19.3], [1, 0], clamp);
  const logoDim = interpolate(t, [19.3, 19.9], [1, 0.25], clamp);
  const subtitle = interpolate(t, [0.6, 0.9, 9.2, 9.4], [0, 1, 1, 0], clamp);
  const igIn = interpolate(t, [0.1, 0.45], [0, 1], clamp);
  const textIn = interpolate(t, [0.55, 0.9], [0, 1], clamp);

  const right = { x: 966, y: 500 };
  const left = { x: 116, y: 1072 };
  const x = interpolate(side, [0, 1], [right.x, left.x]);
  const y = interpolate(side, [0, 1], [right.y, left.y]);
  const align = side > 0.5 ? "flex-start" : "flex-end";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 228,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Crystal size={92} opacity={0.95 * logoDim} />
      </div>

      <div
        style={{
          position: "absolute",
          left: x - 100,
          top: y - 30,
          width: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: align,
          gap: 10,
          opacity: gone,
        }}
      >
        <div style={{ opacity: igIn }}>
          <IgGlyph size={58} color={igColor} />
        </div>
        <div
          style={{
            opacity: textIn,
            fontFamily: JOST,
            fontWeight: 500,
            fontSize: 33,
            letterSpacing: 0.5,
            color: "white",
            whiteSpace: "nowrap",
          }}
        >
          {HANDLE}
        </div>
        <div
          style={{
            opacity: subtitle,
            fontFamily: JOST,
            fontWeight: 300,
            fontSize: 27,
            letterSpacing: 0.5,
            color: "rgba(255,255,255,0.45)",
            whiteSpace: "nowrap",
            marginTop: -4,
          }}
        >
          Mapa · Adventure
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Scene 8 — the sign-off. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const appear = interpolate(t, [0.1, 0.55], [0, 1], clamp);
  const textIn = interpolate(t, [0.45, 0.9], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 820,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            opacity: appear,
            transform: `scale(${interpolate(appear, [0, 1], [0.55, 1])})`,
          }}
        >
          <IgGlyph size={174} color={1} />
        </div>
        <div
          style={{
            opacity: textIn,
            fontFamily: JOST,
            fontWeight: 500,
            fontSize: 42,
            letterSpacing: 1,
            color: "white",
          }}
        >
          {HANDLE}
        </div>
      </div>
    </AbsoluteFill>
  );
};
