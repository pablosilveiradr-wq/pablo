import { Beat } from "./Storyboard";

/**
 * "Vuelvo al ahora" — pildora para la cabeza dispersa (nombrar cinco cosas
 * que ves). No hay toma grabada todavia, asi que los tiempos son estimados a
 * ritmo hablado (~22.8s); al montarla sobre la voz, correr start/end de la
 * linea que no cierre. Todos los iconos son de la libreria (numero en la nota).
 */
export const PRESENTE_BEATS: Beat[] = [
  { icon: "herramienta", start: 0, end: 1.5, note: "061 · Te doy una herramienta" },
  { icon: "mente-dispersa", start: 1.5, end: 3.2, note: "220 · para cuando tenes la cabeza dispersa" },
  { icon: "distraccion", start: 3.2, end: 4.7, note: "016 · y no podes enfocarte." },
  { icon: "observar", start: 4.7, end: 6.1, note: "389 · Mira alrededor" },
  { icon: "etiqueta", start: 6.1, end: 7.5, note: "018 · y nombra en silencio" },
  { icon: "contar", start: 7.5, end: 8.9, note: "074 · cinco cosas que ves," },
  { icon: "paso-a-paso", start: 8.9, end: 10.2, note: "384 · una por una," },
  { icon: "lupa", start: 10.2, end: 11.7, note: "191 · con calma y detalle." },
  { icon: "voz", start: 11.7, end: 13.0, note: "214 · Y repeti conmigo:" },
  { icon: "mente-en-otro-lado", start: 13.0, end: 14.5, note: "007 · mi mente estaba lejos," },
  { icon: "aqui-y-ahora", start: 14.5, end: 16.0, note: "063 · pero yo estoy aca." },
  { icon: "presente", start: 16.0, end: 17.4, note: "092 · Este momento es real," },
  { icon: "nube", start: 17.4, end: 19.0, note: "342 · lo demas son pensamientos." },
  { icon: "ahora", start: 19.0, end: 20.6, note: "064 · Vuelvo al ahora." },
  { icon: "saludo", start: 20.6, end: 22.8, note: "116 · Te veo en la proxima pildora." },
];
