import { Beat } from "./Storyboard";

/**
 * "Nadie ve" — tiempos leidos de la toma hablada (13.8s). El estribillo cae
 * tres veces sobre el mismo ojo cerrado y el cierre lo abre.
 * Sin subtitulos: se queman en el montaje.
 */
export const NADIE_BEATS: Beat[] = [
  {
    icon: "eyeShut",
    start: 0,
    end: 0.9,
    note: "Nadie ve...",
  },
  {
    icon: "wakeNoWill",
    start: 0.9,
    end: 2.8,
    note: "...las veces que te levantaste sin ganas.",
  },
  {
    icon: "eyeShut",
    start: 2.8,
    end: 3.7,
    note: "Nadie ve...",
  },
  {
    icon: "swallowedWords",
    start: 3.7,
    end: 5.0,
    note: "...lo que te callaste...",
  },
  {
    icon: "sparedHeart",
    start: 5.0,
    end: 6.1,
    note: "...para no hacer dano.",
  },
  {
    icon: "eyeShut",
    start: 6.1,
    end: 7.0,
    note: "Nadie ve...",
  },
  {
    icon: "climbCost",
    start: 7.0,
    end: 8.6,
    note: "...lo que te costo llegar aca.",
  },
  {
    icon: "crowdRow",
    start: 8.6,
    end: 11.0,
    note: "No necesitas que nadie lo vea,",
  },
  {
    icon: "eyeHalf",
    start: 11.0,
    end: 12.4,
    note: "pero no te olvides...",
  },
  {
    icon: "eyeSeeing",
    start: 12.4,
    end: 13.8,
    note: "...de verlo vos.",
  },
];
