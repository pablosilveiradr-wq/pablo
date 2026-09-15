import "./index.css";
import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { CADENA_DURATION, Cadena } from "./Cadena";
import { ESPEJO_DURATION, Espejo } from "./Espejo";
import { LIMITES_DURATION, Limites } from "./Limites";
import { DESPIERTO_DURATION, Despierto } from "./Despierto";
import {
  Metafora,
  calculateMetaforaMetadata,
  defaultMetaforaProps,
  metaforaSchema,
} from "./Metafora";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Limites"
        component={Limites}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={LIMITES_DURATION}
      />
      <Composition
        id="Espejo"
        component={Espejo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={ESPEJO_DURATION}
      />
      <Composition
        id="Cadena"
        component={Cadena}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={CADENA_DURATION}
      />
      <Composition
        id="Despierto"
        component={Despierto}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={DESPIERTO_DURATION}
      />
      <Composition
        id="Metafora"
        component={Metafora}
        calculateMetadata={calculateMetaforaMetadata}
        schema={metaforaSchema}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={600}
        defaultProps={defaultMetaforaProps}
      />
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
