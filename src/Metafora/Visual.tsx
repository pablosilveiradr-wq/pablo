import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ChainRing, Glow, Orbit, Ring, Sunburst } from "./fx";
import { IconName, LineArt } from "./icons";
import { useScene } from "./Scene";
import { theme } from "./theme";

export type Variant = "halo" | "orbit" | "cage" | "chain" | "rings";

const Centered: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    {children}
  </AbsoluteFill>
);

/** A satellite: a dim disc with a small icon inside, used by the orbit variant. */
const Satellite: React.FC<{ icon: IconName; draw: number }> = ({
  icon,
  draw,
}) => (
  <div
    style={{
      width: 150,
      height: 150,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.09)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <LineArt name={icon} progress={draw} size={80} strokeWidth={4} opacity={0.9} />
  </div>
);

export const Visual: React.FC<{
  icon: IconName;
  variant: Variant;
  satellites?: IconName[];
}> = ({ icon, variant, satellites = ["dumbbell", "bulb", "rain", "sun"] }) => {
  const { draw, frame } = useScene();
  const globalFrame = useCurrentFrame();

  // Slow ambient motion so nothing ever sits perfectly still.
  const spin = globalFrame * 0.25;
  const breathe = 1 + Math.sin(frame / 22) * 0.012;

  if (variant === "orbit") {
    return (
      <Centered>
        <Ring size={1400} dotted opacity={0.18} rotation={-spin * 0.6} />
        <Ring size={1050} opacity={0.14} progress={draw} />
        <Ring size={760} dotted opacity={0.25} rotation={spin} />
        <Orbit radius={380} rotation={spin * 1.6}>
          {satellites.map((s) => (
            <Satellite key={s} icon={s} draw={draw} />
          ))}
        </Orbit>
        <Glow size={620} opacity={0.35} />
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: "50%",
            border: `3px solid ${theme.ink}`,
            background: theme.bg,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${breathe})`,
          }}
        >
          <LineArt name={icon} progress={draw} size={230} strokeWidth={3} />
        </div>
      </Centered>
    );
  }

  if (variant === "cage") {
    const ballSwing = Math.sin(frame / 26) * 3;

    return (
      <Centered>
        <Glow size={760} opacity={0.18} />
        <div style={{ transform: `scale(${breathe})` }}>
          <LineArt name={icon} progress={draw} size={360} strokeWidth={3} />
        </div>
        <div style={{ position: "absolute" }}>
          <LineArt name="cage" progress={draw} size={700} strokeWidth={2} opacity={0.9} />
        </div>
        <div
          style={{
            position: "absolute",
            transform: `translate(60px, 470px) rotate(${ballSwing}deg)`,
            transformOrigin: "top left",
          }}
        >
          <LineArt name="ballchain" progress={draw} size={320} strokeWidth={3} />
        </div>
      </Centered>
    );
  }

  if (variant === "chain") {
    return (
      <Centered>
        <ChainRing size={780} rotation={spin * 0.5} opacity={0.8} />
        <Ring size={640} opacity={0.35} progress={draw} strokeWidth={1.5} />
        <Glow size={560} opacity={0.3} />
        <div style={{ transform: `scale(${breathe})` }}>
          <LineArt name={icon} progress={draw} size={420} strokeWidth={3} />
        </div>
      </Centered>
    );
  }

  if (variant === "rings") {
    return (
      <Centered>
        <Ring size={900} dotted opacity={0.22} rotation={-spin} />
        <Ring size={700} opacity={0.3} progress={draw} />
        <Ring size={520} dotted opacity={0.3} rotation={spin * 1.4} />
        <Glow size={520} opacity={0.4} />
        <div style={{ transform: `scale(${breathe})` }}>
          <LineArt name={icon} progress={draw} size={380} strokeWidth={3} />
        </div>
      </Centered>
    );
  }

  // "halo": the spiky sunburst treatment.
  const burst = interpolate(draw, [0, 1], [0.3, 1]);

  return (
    <Centered>
      <Sunburst size={980} rotation={spin * 0.35} opacity={0.42 * burst} />
      <Glow size={820} opacity={0.3} />
      <div style={{ transform: `scale(${breathe})` }}>
        <LineArt name={icon} progress={draw} size={460} strokeWidth={3} />
      </div>
    </Centered>
  );
};
