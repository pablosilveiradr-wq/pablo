import React from "react";
import { AbsoluteFill, continueRender, delayRender, Sequence, staticFile, useVideoConfig } from "remotion";
import { BG, FPS, INK } from "./theme";

/**
 * "PostTexto": the text of one of Pablo's posts, cut phrase by phrase on pure
 * black, like the hook of a talking-head reel: one short phrase centred at a
 * time, hard cuts, no transitions, no effects. Set in the post's own typeface
 * (Julius Sans One, OFL, in public/fonts). Vertical 1080×1920; the text sits
 * in the middle, clear of the Reels UI. No audio.
 */

export const FAMILY = "Julius Sans One";
let fontHandle: number | null = null;
if (typeof window !== "undefined" && typeof FontFace !== "undefined") {
  fontHandle = delayRender("Loading Julius Sans One");
  const face = new FontFace(FAMILY, `url(${staticFile("fonts/JuliusSansOne-Regular.ttf")})`);
  face
    .load()
    .then(() => {
      document.fonts.add(face);
      continueRender(fontHandle as number);
    })
    .catch((err) => {
      console.error(err);
      continueRender(fontHandle as number);
    });
}

export type Phrase = { text: string; seconds: number };
export type PostTextoProps = { phrases?: Phrase[] };

/** "Siempre seré la persona que diga: …" (the post Pablo sent), at reading pace. */
export const SIEMPRE: Phrase[] = [
  { text: "Siempre seré", seconds: 1.1 },
  { text: "la persona que diga:", seconds: 1.4 },
  { text: "\"Lo hice con mi corazón,", seconds: 1.6 },
  { text: "no me debés nada\",", seconds: 1.5 },
  { text: "en un mundo", seconds: 1.1 },
  { text: "donde todo el mundo", seconds: 1.3 },
  { text: "te tira cosas en la cara.", seconds: 2.6 },
];

export const postTextoFrames = (phrases: Phrase[]) => phrases.reduce((n, p) => n + Math.round(p.seconds * FPS), 0);

export const PostTexto: React.FC<PostTextoProps> = ({ phrases = SIEMPRE }) => {
  const { fps } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {phrases.map((p, i) => {
        const len = Math.round(p.seconds * fps);
        const seq = (
          <Sequence key={i} from={from} durationInFrames={len}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 60px" }}>
              <div style={{ fontFamily: `'${FAMILY}', sans-serif`, fontSize: 54, letterSpacing: "0.06em", color: INK, textAlign: "center", lineHeight: 1.4, whiteSpace: "nowrap" }}>{p.text}</div>
            </AbsoluteFill>
          </Sequence>
        );
        from += len;
        return seq;
      })}
    </AbsoluteFill>
  );
};
