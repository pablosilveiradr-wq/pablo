import { continueRender, delayRender, staticFile } from "remotion";

export const JOST = "Jost";

let promise: Promise<void> | null = null;

export const loadJost = (): Promise<void> => {
  if (promise) {
    return promise;
  }

  const handle = delayRender("Loading Jost");

  promise = (async () => {
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

  return promise;
};
