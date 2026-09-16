import "./index.css";
import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { DEMO_BEATS } from "./Anim/demo-storyboard";
import {
  Storyboard,
  storyboardDuration,
  storyboardSchema,
} from "./Anim/Storyboard";
import { FPS } from "./Anim/theme";

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
