import React from "react";
import { Frame, IconProps } from "../primitives";
import { CATALOG, LibEntry } from "./catalog";
import { FIT } from "./fit";

type Drawn = LibEntry & { C: React.FC<IconProps> };

const isDrawn = (x: LibEntry): x is Drawn => Boolean(x.C);

/**
 * Wraps an icon in its measured fit so every library entry lands centred at
 * the same optical size, however it was authored.
 */
const fitted = (id: string, C: React.FC<IconProps>) => {
  const Fitted: React.FC<IconProps> = (props) => {
    const f = FIT[id];
    if (!f) {
      return <C {...props} />;
    }
    return (
      <Frame scale={f.s} dx={f.dx} dy={f.dy}>
        <C {...props} />
      </Frame>
    );
  };
  return Fitted;
};

const drawn = CATALOG.filter(isDrawn);

/** Library icons as storyboards use them: fitted, keyed by slug. */
export const LIBRARY_ICONS: Record<string, React.FC<IconProps>> =
  Object.fromEntries(drawn.map((x) => [x.id, fitted(x.id, x.C)]));

/** The same icons unfitted, for measuring. */
export const LIBRARY_RAW: Record<string, React.FC<IconProps>> =
  Object.fromEntries(drawn.map((x) => [x.id, x.C]));
