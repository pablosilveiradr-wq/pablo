import { Beat } from "./Storyboard";

/**
 * "El punto" — pildora de la herramienta P6. No hay toma grabada todavia, asi
 * que los tiempos son estimados a ritmo hablado (~23.9s); al montarla sobre la
 * voz, correr start/end de la linea que no cierre.
 *
 * Los cinco beats del antebrazo comparten escena: no cortan a negro entre si,
 * cada capa queda en pantalla y el punto se aprende acumulando.
 */
export const PUNTO_BEATS: Beat[] = [
  {
    icon: "handKey",
    start: 0,
    end: 1.5,
    note: "Te doy una herramienta",
  },
  {
    icon: "pressureKnot",
    start: 1.5,
    end: 3.5,
    note: "para cuando sentis ese nudo de ansiedad",
  },
  {
    icon: "tightTorso",
    start: 3.5,
    end: 5.6,
    note: "en el pecho o el estomago.",
  },
  {
    icon: "armBase",
    start: 5.6,
    end: 7.4,
    note: "Medi tres dedos desde el pliegue de la muneca",
    scene: "brazo",
  },
  {
    icon: "armThree",
    start: 7.4,
    end: 9.6,
    note: "hacia el codo,",
    scene: "brazo",
  },
  {
    icon: "armInner",
    start: 9.6,
    end: 11.5,
    note: "en la cara interna del brazo,",
    scene: "brazo",
  },
  {
    icon: "armTendons",
    start: 11.5,
    end: 12.8,
    note: "y presiona firme",
    scene: "brazo",
  },
  {
    icon: "armPress",
    start: 12.8,
    end: 14.8,
    note: "entre los dos tendones,",
    scene: "brazo",
  },
  {
    icon: "stillTime1",
    start: 14.8,
    end: 16.1,
    note: "un minuto.",
  },
  {
    icon: "calmTorso",
    start: 16.1,
    end: 19.3,
    note: "Ese punto calma el pecho y el estomago apretados.",
  },
  {
    icon: "pauseThink",
    start: 19.3,
    end: 22.1,
    note: "Un minuto de pausa puede cambiarte el momento.",
  },
  {
    icon: "closeWave",
    start: 22.1,
    end: 23.9,
    note: "Te veo en la proxima pildora.",
  },
];
