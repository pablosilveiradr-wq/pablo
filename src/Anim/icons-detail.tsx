import React from "react";
import { DrawPath, IconProps, useBreath } from "./primitives";
import { questionHook } from "./shapes";
import { CENTER, STROKE, STROKE_THIN } from "./theme";

const C = CENTER;

/** Un trazo del dibujo: cuando entra y cuanto tarda en dibujarse. */
type Stroke = { d: string; at: number; for?: number; w?: number; o?: number };

const render = (strokes: Stroke[], delay: number) =>
  strokes.map((s, i) => (
    <DrawPath
      key={i}
      d={s.d}
      delay={delay + s.at}
      duration={s.for ?? 22}
      strokeWidth={s.w ?? STROKE}
      opacity={s.o ?? 1}
    />
  ));

/**
 * Monje en posicion de oracion. Silueta limpia, sin cara ni relleno: el
 * dibujo se sostiene por la curva, no por la cantidad de elementos. Pocas
 * piezas grandes y bien trazadas se animan mucho mejor que muchas chicas.
 */
export const ZenMonkPray: React.FC<IconProps> = ({ delay = 0 }) => {
  const b = useBreath(0.012, 150);
  const fx = C - 40;

  const strokes: Stroke[] = [
    // --- Cabeza -----------------------------------------------------------
    {
      d:
        `M ${fx} ${C - 246} C ${fx + 42} ${C - 246} ${fx + 60} ${C - 212} ${fx + 60} ${C - 174} ` +
        `C ${fx + 60} ${C - 136} ${fx + 36} ${C - 110} ${fx} ${C - 110} ` +
        `C ${fx - 36} ${C - 110} ${fx - 60} ${C - 136} ${fx - 60} ${C - 174} ` +
        `C ${fx - 60} ${C - 212} ${fx - 42} ${C - 246} ${fx} ${C - 246} Z`,
      at: 0,
      for: 40,
    },

    // --- Cuello -----------------------------------------------------------
    { d: `M ${fx - 31} ${C - 118} C ${fx - 32} ${C - 100} ${fx - 34} ${C - 90} ${fx - 40} ${C - 80}`, at: 34, for: 14, w: STROKE_THIN },
    { d: `M ${fx + 31} ${C - 118} C ${fx + 32} ${C - 100} ${fx + 34} ${C - 90} ${fx + 40} ${C - 80}`, at: 37, for: 14, w: STROKE_THIN },

    // --- Silueta: hombros y cuerpo, de un lado al otro ---------------------
    {
      d:
        `M ${fx - 214} ${C + 250} ` +
        `C ${fx - 212} ${C + 146} ${fx - 196} ${C + 62} ${fx - 160} ${C + 8} ` +
        `C ${fx - 132} ${C - 36} ${fx - 94} ${C - 66} ${fx - 46} ${C - 80} ` +
        `L ${fx - 40} ${C - 82}`,
      at: 44,
      for: 40,
    },
    {
      d:
        `M ${fx + 214} ${C + 250} ` +
        `C ${fx + 212} ${C + 146} ${fx + 196} ${C + 62} ${fx + 160} ${C + 8} ` +
        `C ${fx + 132} ${C - 36} ${fx + 94} ${C - 66} ${fx + 46} ${C - 80} ` +
        `L ${fx + 40} ${C - 82}`,
      at: 48,
      for: 40,
    },
    { d: `M ${fx - 214} ${C + 250} L ${fx + 214} ${C + 250}`, at: 82, for: 22 },

    // --- Cuello de la tunica, cruzado -------------------------------------
    { d: `M ${fx - 44} ${C - 78} C ${fx - 24} ${C - 34} ${fx - 6} ${C - 4} ${fx + 10} ${C + 18}`, at: 92, for: 22, w: STROKE_THIN },
    { d: `M ${fx + 44} ${C - 78} C ${fx + 30} ${C - 46} ${fx + 18} ${C - 22} ${fx + 10} ${C + 18}`, at: 96, for: 22, w: STROKE_THIN },
    { d: `M ${fx + 10} ${C + 18} C ${fx + 48} ${C + 78} ${fx + 78} ${C + 150} ${fx + 92} ${C + 250}`, at: 112, for: 26, w: STROKE_THIN },
    { d: `M ${fx + 62} ${C - 58} C ${fx + 84} ${C + 10} ${fx + 108} ${C + 130} ${fx + 116} ${C + 250}`, at: 118, for: 26, w: STROKE_THIN, o: 0.85 },

    // --- Manos juntas ------------------------------------------------------
    {
      d:
        `M ${fx} ${C - 62} C ${fx + 28} ${C - 34} ${fx + 40} ${C + 8} ${fx + 38} ${C + 50} ` +
        `C ${fx + 37} ${C + 72} ${fx + 24} ${C + 82} ${fx} ${C + 82}`,
      at: 126,
      for: 26,
    },
    {
      d:
        `M ${fx} ${C - 62} C ${fx - 28} ${C - 34} ${fx - 40} ${C + 8} ${fx - 38} ${C + 50} ` +
        `C ${fx - 37} ${C + 72} ${fx - 24} ${C + 82} ${fx} ${C + 82}`,
      at: 130,
      for: 26,
    },
    { d: `M ${fx} ${C - 58} L ${fx} ${C + 80}`, at: 150, for: 20, w: STROKE_THIN, o: 0.8 },

    // --- Antebrazos que suben a las manos ---------------------------------
    { d: `M ${fx - 172} ${C + 128} C ${fx - 128} ${C + 106} ${fx - 76} ${C + 90} ${fx - 38} ${C + 78}`, at: 158, for: 26 },
    { d: `M ${fx + 172} ${C + 128} C ${fx + 128} ${C + 106} ${fx + 76} ${C + 90} ${fx + 38} ${C + 78}`, at: 162, for: 26 },
    { d: `M ${fx - 186} ${C + 186} C ${fx - 134} ${C + 158} ${fx - 78} ${C + 130} ${fx - 40} ${C + 108}`, at: 172, for: 26, w: STROKE_THIN, o: 0.85 },
    { d: `M ${fx + 186} ${C + 186} C ${fx + 134} ${C + 158} ${fx + 78} ${C + 130} ${fx + 40} ${C + 108}`, at: 176, for: 26, w: STROKE_THIN, o: 0.85 },

    // --- La pregunta -------------------------------------------------------
    { d: questionHook(C + 286, C - 146, 1.5), at: 190, for: 24 },
    { d: `M ${C + 286} ${C - 72} a 11 11 0 1 1 0.1 0`, at: 208, for: 12 },
  ];

  return (
    <g style={{ transform: `scale(${b})`, transformOrigin: `${C}px ${C}px`, transformBox: "view-box" }}>
      {render(strokes, delay)}
    </g>
  );
};
