import "./index.css";
import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
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
