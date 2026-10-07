import "./index.css";
import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { DEMO_BEATS } from "./Anim/demo-storyboard";
import { ZEN_BEATS } from "./Anim/zen-storyboard";
import { REF_BEATS } from "./Anim/ref-storyboard";
import { FOTO_BEATS } from "./Anim/foto-storyboard";
import { FLECHA_BEATS } from "./Anim/flecha-storyboard";
import { TODAVIA_BEATS } from "./Anim/todavia-storyboard";
import { NADIE_BEATS } from "./Anim/nadie-storyboard";
import { PUNTO_BEATS } from "./Anim/punto-storyboard";
import {
  Storyboard,
  storyboardDuration,
  storyboardSchema,
} from "./Anim/Storyboard";
import { FPS } from "./Anim/theme";
import { TracedPreview } from "./Anim/TracedPreview";
import { IconPreview, iconPreviewSchema } from "./Anim/IconPreview";
import {
  LibrarySheet,
  librarySheetHeight,
  librarySheetSchema,
} from "./Anim/LibrarySheet";
import { CATALOG } from "./Anim/traced/catalog";
import {
  CLIP,
  LibraryClip,
  LibraryReel,
  libraryClipSchema,
  libraryReelSchema,
} from "./Anim/LibraryClip";
import { CATALOG as LIBRARY_CATALOG } from "./Anim/library/catalog";
import { PRESENTE_FRAMES, Presente } from "./Anim/Presente";
import { VISITA_FRAMES, Visita, VisitaProps } from "./Anim/Visita";
import { PASAJERO_FRAMES, Pasajero } from "./Anim/Pasajero";
import { TRIANGULAR_FRAMES, Triangular } from "./Anim/Triangular";
import { INVISIBLE_FRAMES, Invisible, InvisibleProps } from "./Anim/Invisible";
import { PAUSA_FRAMES, Pausa, PausaProps } from "./Anim/Pausa";
import { METACOGNICION_FRAMES, Metacognicion } from "./Anim/Metacognicion";
import { DISCUTIR_FRAMES, Discutir, DiscutirProps } from "./Anim/Discutir";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Storyboard"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={storyboardDuration(DEMO_BEATS, FPS)}
        defaultProps={{ beats: DEMO_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Storyboard-9x16"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={storyboardDuration(DEMO_BEATS, FPS)}
        defaultProps={{ beats: DEMO_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Zen"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={storyboardDuration(ZEN_BEATS, FPS)}
        defaultProps={{ beats: ZEN_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Zen-9x16"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={storyboardDuration(ZEN_BEATS, FPS)}
        defaultProps={{ beats: ZEN_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Ref"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={storyboardDuration(REF_BEATS, FPS)}
        defaultProps={{ beats: REF_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Foto"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={storyboardDuration(FOTO_BEATS, FPS)}
        defaultProps={{ beats: FOTO_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Foto-9x16"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={storyboardDuration(FOTO_BEATS, FPS)}
        defaultProps={{ beats: FOTO_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Flecha"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={storyboardDuration(FLECHA_BEATS, FPS)}
        defaultProps={{ beats: FLECHA_BEATS, scale: 0.88 }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Flecha-9x16"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={storyboardDuration(FLECHA_BEATS, FPS)}
        defaultProps={{ beats: FLECHA_BEATS }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Todavia"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={storyboardDuration(TODAVIA_BEATS, FPS)}
        defaultProps={{ beats: TODAVIA_BEATS, scale: 0.88 }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Nadie"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={storyboardDuration(NADIE_BEATS, FPS)}
        defaultProps={{ beats: NADIE_BEATS, scale: 0.88 }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Punto"
        component={Storyboard}
        schema={storyboardSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={storyboardDuration(PUNTO_BEATS, FPS)}
        defaultProps={{ beats: PUNTO_BEATS, scale: 0.88 }}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyboardDuration(props.beats, FPS),
        })}
      />
      <Composition
        id="Presente"
        component={Presente}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={PRESENTE_FRAMES}
      />
      <Composition
        id="Discutir"
        component={Discutir}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={DISCUTIR_FRAMES}
        defaultProps={{} as DiscutirProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props as DiscutirProps).seconds ? Math.round(((props as DiscutirProps).seconds as number) * FPS) : DISCUTIR_FRAMES,
        })}
      />
      <Composition
        id="Metacognicion"
        component={Metacognicion}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={METACOGNICION_FRAMES}
      />
      <Composition
        id="Pausa"
        component={Pausa}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={PAUSA_FRAMES}
        defaultProps={{} as PausaProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props as PausaProps).seconds ? Math.round(((props as PausaProps).seconds as number) * FPS) : PAUSA_FRAMES,
        })}
      />
      <Composition
        id="Invisible"
        component={Invisible}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={INVISIBLE_FRAMES}
        defaultProps={{} as InvisibleProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props as InvisibleProps).seconds ? Math.round(((props as InvisibleProps).seconds as number) * FPS) : INVISIBLE_FRAMES,
        })}
      />
      <Composition
        id="Triangular"
        component={Triangular}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={TRIANGULAR_FRAMES}
      />
      <Composition
        id="Pasajero"
        component={Pasajero}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={PASAJERO_FRAMES}
      />
      <Composition
        id="Visita"
        component={Visita}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={VISITA_FRAMES}
        defaultProps={{} as VisitaProps}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props as VisitaProps).seconds ? Math.round(((props as VisitaProps).seconds as number) * FPS) : VISITA_FRAMES,
        })}
      />
      <Composition
        id="LibraryClip"
        component={LibraryClip}
        schema={libraryClipSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={CLIP}
        defaultProps={{ id: "pensamiento" }}
      />
      <Composition
        id="LibraryReel"
        component={LibraryReel}
        schema={libraryReelSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={CLIP}
        defaultProps={{ ids: LIBRARY_CATALOG.map((x) => x.id) }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(1, props.ids.length) * CLIP,
        })}
      />
      <Composition
        id="LibrarySheet"
        component={LibrarySheet}
        schema={librarySheetSchema}
        width={2000}
        height={2000}
        fps={FPS}
        durationInFrames={240}
        defaultProps={{ items: [], cols: 5 }}
        calculateMetadata={({ props }) => ({
          height: Math.max(
            400,
            librarySheetHeight(props.items.length, props.cols, 2000),
          ),
        })}
      />
      <Composition
        id="IconPreview"
        component={IconPreview}
        schema={iconPreviewSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={330}
        defaultProps={{ icon: "zenMonk" }}
      />
      {CATALOG.map(({ name, art }) => (
        <Composition
          key={name}
          id={`art-${name}`}
          component={TracedPreview}
          width={1080}
          height={1080}
          fps={FPS}
          durationInFrames={90}
          defaultProps={{ art, mode: "draw" as const }}
        />
      ))}
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
    </>
  );
};
