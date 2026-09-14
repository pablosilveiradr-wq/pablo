import { continueRender, delayRender, staticFile } from "remotion";

export const JOST = "Jost";

let fontPromise: Promise<void> | null = null;

/**
 * Jost is a geometric sans in the Futura family — the same feel as the
 * reference videos. Loaded from /public so renders stay offline-safe.
 */
export const loadJost = (): Promise<void> => {
  if (fontPromise) {
    return fontPromise;
  }

  const handle = delayRender("Loading Jost");

  fontPromise = (async () => {
    const faces = [
      new FontFace(JOST, `url('${staticFile("jost-300.ttf")}')`, {
        weight: "300",
      }),
      new FontFace(JOST, `url('${staticFile("jost-500.ttf")}')`, {
        weight: "500",
      }),
    ];

    const loaded = await Promise.all(faces.map((f) => f.load()));
    loaded.forEach((f) => document.fonts.add(f));
    continueRender(handle);
  })();

  return fontPromise;
};

export const theme = {
  bg: "#000000",
  ink: "#ffffff",
  dim: "rgba(255,255,255,0.55)",
  faint: "rgba(255,255,255,0.38)",
  font: JOST,
  // Stroke width of the line art, in viewBox units (icons are 100x100).
  stroke: 2.6,
} as const;
