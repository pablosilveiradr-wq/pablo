import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

/** Faceted crystal watermark that sits at the top of every frame. */
export const CrystalLogo: React.FC<{ size: number; opacity?: number }> = ({
  size,
  opacity = 1,
}) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 100 135" style={{ opacity }}>
    <defs>
      <linearGradient id="crystal-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f2f2f2" />
        <stop offset="100%" stopColor="#5a5a5a" />
      </linearGradient>
      <linearGradient id="crystal-b" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#cfcfcf" />
        <stop offset="100%" stopColor="#2a2a2a" />
      </linearGradient>
    </defs>
    <polygon points="50,2 84,30 50,46 16,30" fill="url(#crystal-a)" />
    <polygon points="16,30 50,46 50,133" fill="url(#crystal-b)" />
    <polygon points="84,30 50,46 50,133" fill="url(#crystal-a)" opacity={0.75} />
    <polygon points="50,2 50,46 16,30" fill="#0d0d0d" opacity={0.55} />
  </svg>
);

export const InstagramGlyph: React.FC<{ size: number; colored?: boolean }> = ({
  size,
  colored = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffd521" />
        <stop offset="25%" stopColor="#f50000" />
        <stop offset="60%" stopColor="#b900b4" />
        <stop offset="100%" stopColor="#5b6def" />
      </linearGradient>
    </defs>
    <g
      fill="none"
      stroke={colored ? "url(#ig-grad)" : theme.ink}
      strokeWidth={8}
      strokeLinecap="round"
    >
      <rect x={8} y={8} width={84} height={84} rx={24} />
      <circle cx={50} cy={50} r={21} />
      <circle cx={73} cy={27} r={2} strokeWidth={9} />
    </g>
  </svg>
);

/** Handle block: IG glyph + @handle + subtitle, as in the reference. */
export const Handle: React.FC<{
  handle: string;
  subtitle?: string;
  opacity?: number;
  align?: "left" | "right";
}> = ({ handle, subtitle, opacity = 1, align = "right" }) => (
  <div
    style={{
      opacity,
      display: "flex",
      flexDirection: "column",
      alignItems: align === "right" ? "flex-end" : "flex-start",
      gap: 6,
    }}
  >
    <InstagramGlyph size={44} />
    <div
      style={{
        fontFamily: theme.font,
        fontWeight: 500,
        fontSize: 30,
        letterSpacing: 1,
        color: theme.ink,
      }}
    >
      {handle}
    </div>
    {subtitle ? (
      <div
        style={{
          fontFamily: theme.font,
          fontWeight: 300,
          fontSize: 22,
          letterSpacing: 1,
          color: theme.faint,
        }}
      >
        {subtitle}
      </div>
    ) : null}
  </div>
);

/** Persistent branding layer: crystal on top, handle on the side. */
export const BrandLayer: React.FC<{
  handle: string;
  subtitle?: string;
  side: "left" | "right";
  top: number;
}> = ({ handle, subtitle, side, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CrystalLogo size={86} opacity={0.95 * appear} />
      </div>
      <div
        style={{
          position: "absolute",
          top,
          [side]: 48,
        }}
      >
        <Handle
          handle={handle}
          subtitle={subtitle}
          opacity={appear}
          align={side}
        />
      </div>
    </AbsoluteFill>
  );
};
