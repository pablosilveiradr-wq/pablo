import { Beat } from "./Storyboard";

/**
 * "El maestro zen" — tiempos leidos de la toma hablada (33.6s). Una imagen por
 * frase corta, no por oracion: el reel cambia de metafora cada segundo y pico.
 * Sin subtitulos: se queman en el montaje.
 */
export const ZEN_BEATS: Beat[] = [
  {
    icon: "zenAsked",
    start: 0,
    end: 1.8,
    note: "Le preguntaron a un maestro zen...",
  },
  {
    icon: "handKey",
    start: 1.8,
    end: 3.2,
    note: "...cual era el secreto...",
  },
  {
    icon: "heartSettle",
    start: 3.2,
    end: 4.6,
    note: "...para vivir en paz.",
  },
  {
    icon: "bowlNow",
    start: 4.6,
    end: 7.0,
    note: 'Respondio: "Cuando como, como".',
  },
  {
    icon: "walkNow",
    start: 7.0,
    end: 8.3,
    note: '"Cuando camino, camino".',
  },
  {
    icon: "crowdRow",
    start: 8.3,
    end: 9.6,
    note: '"Eso lo hace cualquiera".',
  },
  {
    icon: "saidNo",
    start: 9.6,
    end: 11.6,
    note: "Le dijeron. Y dijo que no.",
  },
  {
    icon: "eatingElsewhere",
    start: 11.6,
    end: 13.8,
    note: '"Vos comes pensando en el trabajo".',
  },
  {
    icon: "bedUnfinished",
    start: 13.8,
    end: 15.5,
    note: '"Te acostas pensando..."',
  },
  {
    icon: "undoneList",
    start: 15.5,
    end: 17.0,
    note: '"...en todo lo que no hiciste".',
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
    end: 22.1,
    note: "...pasamos casi la mitad del dia...",
  },
  {
    icon: "thoughtSupposing",
    start: 22.1,
    end: 23.4,
    note: "...pensando en otra cosa.",
  },
  {
    icon: "feelWorse",
    start: 23.4,
    end: 24.8,
    note: "Y que en esos momentos...",
  },
  {
    icon: "sadPerson",
    start: 24.8,
    end: 26.1,
    note: "...nos sentimos peor.",
  },
  {
    icon: "pauseThink",
    start: 26.1,
    end: 27.1,
    note: "Entonces...",
  },
  {
    icon: "whereIsPeace",
    start: 27.1,
    end: 28.2,
    note: "...donde esta la paz?",
  },
  {
    icon: "notElsewhere",
    start: 28.2,
    end: 29.9,
    note: "No esta en otro lugar.",
  },
  {
    icon: "rightHere",
    start: 29.9,
    end: 31.2,
    note: "Esta en lo que tenes delante.",
  },
  {
    icon: "feetGround",
    start: 31.2,
    end: 32.2,
    note: "Si estas ahi.",
  },
  {
    icon: "closeWave",
    start: 32.2,
    end: 33.6,
    note: "Te veo en la proxima pildora.",
  },
];
