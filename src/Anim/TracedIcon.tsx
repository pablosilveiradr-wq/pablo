import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useBreath, useReveal } from "./primitives";
import { INK } from "./theme";

export type Traced = {
  /** "fill": contornos de potrace. "stroke": linea real de un vector importado. */
  readonly paint?: "fill" | "stroke";
  readonly strokeWidth?: number;
  readonly viewBox: string;
  readonly transform: string;
  readonly paths: readonly string[];
};

/** "draw" solo existe para arte con linea real: dibuja el trazo de punta a punta. */
export type RevealMode = "draw" | "wipe" | "radial" | "stagger" | "fade";

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

  const stroked = art.paint === "stroke";
  // Un contorno relleno no tiene linea que recorrer: ahi "draw" cae a barrido.
  const reveal: RevealMode = mode === "draw" && !stroked ? "wipe" : mode;

  const [, , vbW, vbH] = art.viewBox.split(/\s+/).map(Number);
  const cx = vbW / 2;
  const cy = vbH / 2;
  const maxR = Math.hypot(vbW, vbH) / 2;

  if (p <= 0) {
    return null;
  }

  // El barrido lleva un borde suave para que la linea no aparezca de golpe.
  const sweep = interpolate(p, [0, 1], [-0.25, 1.25]);
  const n = Math.max(art.paths.length, 1);

  const body = (
    <g
      transform={art.transform}
      fill={stroked ? "none" : INK}
      stroke={stroked ? INK : "none"}
      strokeWidth={stroked ? art.strokeWidth : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {art.paths.map((raw, i) => {
        // Un vector importado trae su propia matriz por figura: "matrix(...)|d".
        const bar = raw.indexOf("|");
        const own = bar === -1 ? undefined : raw.slice(0, bar);
        const d = bar === -1 ? raw : raw.slice(bar + 1);
        const staggered =
          reveal === "stagger"
            ? interpolate(frame - delay - (i * duration) / n, [0, 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        if (reveal === "draw") {
          // Cada figura se dibuja en orden, solapandose un poco con la anterior.
          const dp = interpolate(frame - delay - (i * duration * 0.7) / n, [0, duration * 0.55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          });
          if (dp <= 0) {
            return null;
          }
          return (
            <path
              key={i}
              d={d}
              transform={own}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - dp}
            />
          );
        }
        return <path key={i} d={d} transform={own} opacity={staggered} />;
      })}
    </g>
  );

  return (
    <g
      opacity={reveal === "fade" ? p : 1}
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
          {reveal === "wipe" ? (
            <rect x={0} y={0} width={vbW} height={vbH} fill={`url(#wipe-${id})`} />
          ) : reveal === "radial" ? (
            <circle cx={cx} cy={cy} r={maxR * p} fill="#fff" />
          ) : (
            <rect x={0} y={0} width={vbW} height={vbH} fill="#fff" />
          )}
        </mask>
      </defs>
      <g mask={reveal === "wipe" || reveal === "radial" ? `url(#mask-${id})` : undefined}>
        {body}
      </g>
    </g>
  );
};
