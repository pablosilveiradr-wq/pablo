import React from "react";
import { AbsoluteFill } from "remotion";
import { TracedIcon, type RevealMode, type Traced } from "./TracedIcon";
import { BG } from "./theme";

/**
 * Banco de control para arte importado: confirma encuadre, densidad de trazo
 * y como se comporta el revelado antes de meterlo en un guion.
 */
export const TracedPreview: React.FC<{
  readonly art: Traced;
  readonly mode?: RevealMode;
}> = ({ art, mode = "draw" }) => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <svg
      viewBox={art.viewBox}
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0 }}
    >
      <TracedIcon art={art} mode={mode} duration={48} />
    </svg>
  </AbsoluteFill>
);
