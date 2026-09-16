import { Beat } from "./Storyboard";

/**
 * "El maestro zen" — tiempos estimados del ritmo del texto (~3 palabras/seg,
 * cadencia reflexiva). La animacion va muda: al montarla sobre la voz,
 * ajustar start/end de la linea que se corra.
 */
export const ZEN_BEATS: Beat[] = [
  {
    icon: "zenAsked",
    start: 0,
    end: 4.6,
    note: "Le preguntaron a un maestro zen cual era su secreto para vivir en paz.",
  },
  {
    icon: "eatWalk",
    start: 4.6,
    end: 8.8,
    note: 'Respondio: "Cuando como, como. Cuando camino, camino".',
  },
  {
    icon: "crowdRow",
    start: 8.8,
    end: 11.4,
    note: '"Eso lo hace cualquiera", le dijeron.',
  },
  {
    icon: "eatingElsewhere",
    start: 11.4,
    end: 14.6,
    note: '"No. Vos comes pensando en el trabajo."',
  },
  {
    icon: "bedUnfinished",
    start: 14.6,
    end: 18.4,
    note: '"Y te acostas pensando en todo lo que no hiciste."',
  },
  {
    icon: "atomProof",
    start: 18.4,
    end: 21.0,
    note: "Y la ciencia le dio la razon.",
  },
  {
    icon: "halfDay",
    start: 21.0,
    end: 26.4,
    note: "Un estudio de Harvard encontro que pasamos casi la mitad del dia pensando en otra cosa.",
  },
  {
    icon: "feelWorse",
    start: 26.4,
    end: 29.4,
    note: "Y que en esos momentos nos sentimos peor.",
  },
  {
    icon: "whereIsPeace",
    start: 29.4,
    end: 31.8,
    note: "Entonces, donde esta la paz?",
  },
  {
    icon: "notElsewhere",
    start: 31.8,
    end: 33.8,
    note: "No esta en otro lugar.",
  },
  {
    icon: "anchorBreath",
    start: 33.8,
    end: 37.8,
    note: "Esta en lo que tenes delante, si estas ahi.",
  },
];
