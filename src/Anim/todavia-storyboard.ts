import { Beat } from "./Storyboard";

/**
 * "Todavia estas a tiempo" — tiempos leidos de la toma hablada (15.4s).
 * El estribillo se repite tres veces y se lleva el mismo reloj con menos
 * arena cada vez. Sin subtitulos: se queman en el montaje.
 */
export const TODAVIA_BEATS: Beat[] = [
  {
    icon: "stillTime1",
    start: 0,
    end: 1.2,
    note: "Todavia estas a tiempo...",
  },
  {
    icon: "phoneCall",
    start: 1.2,
    end: 2.0,
    note: "...de llamar...",
  },
  {
    icon: "linkPair",
    start: 2.0,
    end: 3.5,
    note: "...a quien extranas.",
  },
  {
    icon: "stillTime2",
    start: 3.5,
    end: 5.0,
    note: "Todavia estas a tiempo...",
  },
  {
    icon: "startAgain",
    start: 5.0,
    end: 6.2,
    note: "...de empezar...",
  },
  {
    icon: "leftBehind",
    start: 6.2,
    end: 7.6,
    note: "...lo que dejaste.",
  },
  {
    icon: "stillTime3",
    start: 7.6,
    end: 8.6,
    note: "Todavia estas a tiempo...",
  },
  {
    icon: "heartHold",
    start: 8.6,
    end: 10.1,
    note: "...de tratarte bien.",
  },
  {
    icon: "oneWord",
    start: 10.1,
    end: 11.9,
    note: "Todavia es una palabra...",
  },
  {
    icon: "sandLow",
    start: 11.9,
    end: 13.5,
    note: "...que no dura para siempre.",
  },
  {
    icon: "useItNow",
    start: 13.5,
    end: 15.4,
    note: "Usala mientras exista.",
  },
];
