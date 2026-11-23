import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BG, INK } from "./theme";
import { FAMILY } from "./PostTexto";

/**
 * "EditReel": Pablo's own talking-head video edited like a hook-first reel.
 * Opens on pure black with the first line centred phrase by phrase (his voice
 * running underneath), then hard-cuts to his face with small centred captions
 * and, under them, a box for each idea: a stock photo (4:3) or a line icon from
 * the library (square). Captions use the typeface of his posts (Julius Sans One). Everything
 * stays inside the Reels safe zone. Keeps his audio.
 */

export type Caption = { text: string; start: number; end: number };
/** `icon`: a library clip name (square box) or a photo path like "stock/x.jpg" (4:3 box). */
export type Shot = { icon: string; start: number; end: number };
/** `overlay`: render only the edit (hook, captions, boxes) to lay over his original video in his editor,
 * on transparency ("alpha", for ProRes 4444) or on chroma green ("green"); his video is never re-encoded. */
export type EditReelProps = { video?: string; hookEnd?: number; captions?: Caption[]; broll?: Shot[]; seconds?: number; overlay?: "alpha" | "green"; captionSize?: number; hookSize?: number; photoW?: number; captionY?: number };

const CAPTION_Y = 945; // centre of the caption: on the collar, under the chin
const BOX = { x: 325, y: 1005, size: 430 }; // ends at 1435 (< 1920 - 480) and x 755 (< 1080 - 160)
/** 4:3 photo box, centred, just under the caption; 480 wide ends at y 1350. */
const photoBox = (w: number, y: number) => ({ x: (1080 - w) / 2, y, w, h: (w * 3) / 4 });
const isPhoto = (s: string) => /\.(jpe?g|png|webp)$/i.test(s);
const MAX_W = 760; // captions stay between x 160 and 920, clear of the right-hand buttons
/** Julius Sans One with this spacing runs about 0.74 em per character: shrink long lines to fit. */
const fit = (text: string, size: number) => Math.min(size, MAX_W / (0.74 * text.length));
const ICON_FRAMES = 90; // library clips are 3 s

const Text: React.FC<{ text: string; hook: boolean; green?: boolean; size: number; y: number }> = ({ text, hook, green = false, size, y }) => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      top: hook ? 0 : y - 50,
      height: hook ? undefined : 100,
      bottom: hook ? 0 : undefined,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: `'${FAMILY}', sans-serif`,
      fontSize: fit(text, size),
      letterSpacing: "0.06em",
      color: INK,
      textAlign: "center",
      whiteSpace: "nowrap",
      // over his face the thin letters need a soft shadow to read; on black they don't
      // on chroma green a soft shadow would key out as a green halo: a solid black outline keys clean
      textShadow: hook || green ? undefined : "0 0 2px #000, 0 0 3px #000, 0 0 6px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.9), 0 0 28px rgba(0,0,0,0.7)",
      WebkitTextStroke: hook ? undefined : green ? "5px #000" : "0.6px #F2F2F2",
      paintOrder: green && !hook ? "stroke fill" : undefined,
    }}
  >
    {text}
  </div>
);

/** A library icon clip: plays its 3 s, then holds the last frame for the rest of the shot. */
const IconShot: React.FC<{ icon: string }> = ({ icon }) => {
  const f = useCurrentFrame();
  const src = staticFile(`iconos/${icon}.mp4`);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {f < ICON_FRAMES - 1 ? (
        <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%" }} />
      ) : (
        <Freeze frame={ICON_FRAMES - 2}>
          <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%" }} />
        </Freeze>
      )}
    </AbsoluteFill>
  );
};

export const EditReel: React.FC<EditReelProps> = ({ video = "input/foco.mp4", hookEnd = 0, captions = [], broll = [], overlay, captionSize = 48, hookSize = 54, photoW = 480, captionY = CAPTION_Y }) => {
  // the photo sits just under the caption
  const PHOTO = photoBox(photoW, captionY + 45);
  const { fps } = useVideoConfig();
  const fr = (s: number) => Math.round(s * fps);
  const hookFrames = fr(hookEnd);
  return (
    <AbsoluteFill style={{ backgroundColor: overlay === "alpha" ? "transparent" : overlay === "green" ? "#00FF00" : BG }}>
      {overlay ? null : <OffthreadVideo src={staticFile(video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      {/* the hook: black over the picture, his voice keeps going */}
      {hookFrames > 0 ? (
        <Sequence durationInFrames={hookFrames}>
          <AbsoluteFill style={{ backgroundColor: BG }} />
        </Sequence>
      ) : null}
      {broll.map((b, i) => (
        <Sequence key={`b${i}`} from={fr(b.start)} durationInFrames={Math.max(1, fr(b.end) - fr(b.start))}>
          {isPhoto(b.icon) ? (
            <div style={{ position: "absolute", left: PHOTO.x, top: PHOTO.y, width: PHOTO.w, height: PHOTO.h, overflow: "hidden", backgroundColor: BG }}>
              <Img src={staticFile(b.icon)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.size, height: BOX.size, overflow: "hidden" }}>
              <IconShot icon={b.icon} />
            </div>
          )}
        </Sequence>
      ))}
      {captions.map((c, i) => (
        <Sequence key={`c${i}`} from={fr(c.start)} durationInFrames={Math.max(1, fr(c.end) - fr(c.start))}>
          <Text text={c.text} hook={c.start < hookEnd} green={overlay === "green"} size={c.start < hookEnd ? hookSize : captionSize} y={captionY} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
