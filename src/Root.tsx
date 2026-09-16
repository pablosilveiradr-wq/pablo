import "./index.css";
import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { DEMO_BEATS } from "./Anim/demo-storyboard";
import { ZEN_BEATS } from "./Anim/zen-storyboard";
import {
  Storyboard,
  storyboardDuration,
  storyboardSchema,
} from "./Anim/Storyboard";
import { FPS } from "./Anim/theme";
import { TracedPreview } from "./Anim/TracedPreview";
import { IconPreview, iconPreviewSchema } from "./Anim/IconPreview";
import { CATALOG } from "./Anim/traced/catalog";

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
