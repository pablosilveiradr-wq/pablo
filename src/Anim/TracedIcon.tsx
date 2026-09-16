import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useBreath, useReveal } from "./primitives";
import { INK } from "./theme";

export type Traced = {
  readonly viewBox: string;
  readonly transform: string;
  readonly paths: readonly string[];
};

export type RevealMode = "wipe" | "radial" | "stagger" | "fade";

/**
 * Un dibujo vectorizado (venido de un PNG) animado con el mismo pulso que los
 * iconos escritos a mano. Los trazos son contornos rellenos, no lineas con
 * stroke, asi que el "se dibuja solo" se logra revelando con mascara.
 */
export const TracedIcon: React.FC<{
  readonly art: Traced;
  readonly delay?: number;
  readonly duration?: number;
  readonly mode?: RevealMode;
  /** Angulo del barrido en grados: 0 = izquierda a derecha, 90 = arriba a abajo. */
  readonly angle?: number;
  readonly breathe?: boolean;
}> = ({
  art,
  delay = 0,
  duration = 44,
  mode = "wipe",
  angle = 20,
  breathe = true,
}) => {
  const frame = useCurrentFrame();
  const p = useReveal(delay, duration);
  const b = useBreath(0.016, 120);
  const id = React.useId().replace(/:/g, "");

  const [, , vbW, vbH] = art.viewBox.split(/\s+/).map(Number);
  const cx = vbW / 2;
  const cy = vbH / 2;
  const maxR = Math.hypot(vbW, vbH) / 2;

  if (p <= 0) {
    return null;
  }

  // El barrido lleva un borde suave para que la linea no aparezca de golpe.
  const sweep = interpolate(p, [0, 1], [-0.25, 1.25]);

  const body = (
    <g transform={art.transform} fill={INK} stroke="none">
      {art.paths.map((d, i) => {
        const staggered =
          mode === "stagger"
            ? interpolate(
                frame - delay - (i * duration) / Math.max(art.paths.length, 1),
                [0, 18],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
            : 1;
        return <path key={i} d={d} opacity={staggered} />;
      })}
    </g>
  );

  return (
    <g
      opacity={mode === "fade" ? p : 1}
      style={
        breathe
          ? {
              transform: `scale(${b})`,
              transformOrigin: `${cx}px ${cy}px`,
              transformBox: "view-box",
            }
          : undefined
      }
    >
      <defs>
        <linearGradient
          id={`wipe-${id}`}
          gradientUnits="objectBoundingBox"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientTransform={`rotate(${angle} 0.5 0.5)`}
        >
          <stop offset={Math.max(0, sweep - 0.22)} stopColor="#fff" />
          <stop offset={Math.min(1, Math.max(0, sweep))} stopColor="#000" />
        </linearGradient>
        <mask id={`mask-${id}`}>
          {mode === "wipe" ? (
            <rect x={0} y={0} width={vbW} height={vbH} fill={`url(#wipe-${id})`} />
          ) : mode === "radial" ? (
            <circle cx={cx} cy={cy} r={maxR * p} fill="#fff" />
          ) : (
            <rect x={0} y={0} width={vbW} height={vbH} fill="#fff" />
          )}
        </mask>
      </defs>
      <g mask={mode === "wipe" || mode === "radial" ? `url(#mask-${id})` : undefined}>
        {body}
      </g>
    </g>
  );
};
