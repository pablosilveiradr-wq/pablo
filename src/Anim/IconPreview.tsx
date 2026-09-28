import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { ICONS } from "./registry";
import { Canvas } from "./primitives";
import { BG } from "./theme";

export const iconPreviewSchema = z.object({ icon: z.string() });

/** Mira un solo icono construirse, para ajustarlo sin renderizar todo el guion. */
export const IconPreview: React.FC<z.infer<typeof iconPreviewSchema>> = ({ icon }) => {
  const Icon = ICONS[icon as keyof typeof ICONS];
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Canvas>{Icon ? <Icon /> : null}</Canvas>
    </AbsoluteFill>
  );
};
