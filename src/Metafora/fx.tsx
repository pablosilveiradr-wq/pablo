import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "./theme";

/** Soft radial halo behind the main subject. */
export const Glow: React.FC<{
  size: number;
  opacity?: number;
  color?: string;
}> = ({ size, opacity = 1, color = "rgba(255,255,255,0.5)" }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        opacity,
        background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0) 68%)`,
      }}
    />
  </AbsoluteFill>
);

/** The spiky "sun" halo: many thin rays radiating from the subject. */
export const Sunburst: React.FC<{
  size: number;
  rays?: number;
  rotation?: number;
  opacity?: number;
}> = ({ size, rays = 72, rotation = 0, opacity = 0.5 }) => {
  const cx = 50;
  const inner = 20;
  const outer = 50;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        opacity,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {new Array(rays).fill(0).map((_, i) => {
        const deg = (i / rays) * 360;
        const rad = (deg * Math.PI) / 180;
        const len = inner + (outer - inner) * (i % 2 === 0 ? 1 : 0.62);

        return (
          <line
            key={i}
            x1={cx + Math.cos(rad) * inner}
            y1={cx + Math.sin(rad) * inner}
            x2={cx + Math.cos(rad) * len}
            y2={cx + Math.sin(rad) * len}
            stroke="white"
            strokeWidth={0.5}
            opacity={0.5}
          />
        );
      })}
    </svg>
  );
};

/** Thin concentric ring, optionally dotted, used as orbit guides. */
export const Ring: React.FC<{
  size: number;
  rotation?: number;
  dotted?: boolean;
  opacity?: number;
  strokeWidth?: number;
  progress?: number;
}> = ({
  size,
  rotation = 0,
  dotted = false,
  opacity = 0.3,
  strokeWidth = 1,
  progress = 1,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ position: "absolute", transform: `rotate(${rotation}deg)`, opacity }}
  >
    <circle
      cx={50}
      cy={50}
      r={48}
      fill="none"
      stroke={theme.ink}
      strokeWidth={strokeWidth}
      pathLength={1}
      strokeDasharray={dotted ? "0.004 0.012" : 1}
      strokeDashoffset={dotted ? 0 : 1 - progress}
      strokeLinecap="round"
    />
  </svg>
);

/** Ring made of interlocking chain links — the "cadena" frame. */
export const ChainRing: React.FC<{
  size: number;
  links?: number;
  rotation?: number;
  opacity?: number;
}> = ({ size, links = 34, rotation = 0, opacity = 0.75 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ position: "absolute", transform: `rotate(${rotation}deg)`, opacity }}
  >
    {new Array(links).fill(0).map((_, i) => {
      const deg = (i / links) * 360;
      const rad = (deg * Math.PI) / 180;
      const x = 50 + Math.cos(rad) * 45;
      const y = 50 + Math.sin(rad) * 45;

      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${deg + 90})`}>
          <rect
            x={-2.2}
            y={-5.4}
            width={4.4}
            height={10.8}
            rx={2.2}
            fill="none"
            stroke={theme.ink}
            strokeWidth={1.1}
          />
        </g>
      );
    })}
  </svg>
);

/** Places children evenly on a circle and spins the whole set. */
export const Orbit: React.FC<{
  radius: number;
  rotation: number;
  children: React.ReactNode[];
  /** Keep each child upright instead of rotating with the orbit. */
  counterRotate?: boolean;
}> = ({ radius, rotation, children, counterRotate = true }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ transform: `rotate(${rotation}deg)` }}>
      {children.map((child, i) => {
        const deg = (i / children.length) * 360;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `rotate(${deg}deg) translate(${radius}px) rotate(${
                counterRotate ? -deg - rotation : 0
              }deg)`,
            }}
          >
            <div style={{ transform: "translate(-50%, -50%)" }}>{child}</div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

/**
 * The white core dot every scene grows out of and collapses back into.
 * This is the connective tissue of the whole style.
 */
export const CoreDot: React.FC<{ size: number; opacity?: number }> = ({
  size,
  opacity = 1,
}) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: theme.ink,
        opacity,
        boxShadow: `0 0 ${size * 1.6}px ${size * 0.5}px rgba(255,255,255,0.45)`,
      }}
    />
  </AbsoluteFill>
);
