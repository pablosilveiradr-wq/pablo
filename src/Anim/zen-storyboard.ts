import { Beat } from "./Storyboard";

/**
 * "El maestro zen" — tiempos leidos de la toma hablada (33.6s), una metafora
 * por linea. Sin subtitulos: se queman en el montaje.
 */
export const ZEN_BEATS: Beat[] = [
  {
    icon: "zenAsked",
    start: 0,
    end: 4.6,
    note: "Le preguntaron a un maestro zen cual era el secreto para vivir en paz.",
  },
  {
    icon: "eatWalk",
    start: 4.6,
    end: 8.3,
    note: 'Respondio: "Cuando como, como. Cuando camino, camino".',
  },
  {
    icon: "crowdRow",
    start: 8.3,
    end: 10.4,
    note: '"Eso lo hace cualquiera", le dijeron.',
  },
  {
    icon: "eatingElsewhere",
    start: 10.4,
    end: 13.8,
    note: 'Y dijo que no: "Vos comes pensando en el trabajo".',
  },
  {
    icon: "bedUnfinished",
    start: 13.8,
    end: 17.0,
    note: '"Te acostas pensando en todo lo que no hiciste".',
  },
  {
    icon: "atomProof",
    start: 17.0,
    end: 18.8,
    note: "Y la ciencia le da la razon.",
  },
  {
    icon: "studyPaper",
    start: 18.8,
    end: 20.6,
    note: "Un estudio en Harvard encontro que...",
  },
  {
    icon: "halfDay",
    start: 20.6,
    end: 23.2,
    note: "...pasamos casi la mitad del dia pensando en otra cosa.",
  },
  {
    icon: "feelWorse",
    start: 23.2,
    end: 26.0,
    note: "Y que en esos momentos nos sentimos peor.",
  },
  {
    icon: "whereIsPeace",
    start: 26.0,
    end: 28.1,
    note: "Entonces, donde esta la paz?",
  },
  {
    icon: "notElsewhere",
    start: 28.1,
    end: 29.9,
    note: "No esta en otro lugar.",
  },
  {
    icon: "rightHere",
    start: 29.9,
    end: 31.9,
    note: "Esta en lo que tenes delante, si estas ahi.",
  },
  {
    icon: "closeWave",
    start: 31.9,
    end: 33.6,
    note: "Te veo en la proxima pildora.",
  },
];
