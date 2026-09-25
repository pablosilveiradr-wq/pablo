import React from "react";
import { Frame, IconProps, StrokeScale } from "../primitives";
import { CATALOG, LibEntry } from "./catalog";
import { FIT } from "./fit";
import { VENDOR } from "./vendor";
import { TimedIcon, vendorIcon } from "./vendorIcon";

type Drawn = LibEntry & { C: React.FC<IconProps> };

const isDrawn = (x: LibEntry): x is Drawn => Boolean(x.C);

/**
 * Wraps an icon in its measured fit so every library entry lands centred at
 * the same optical size, however it was authored.
 */
const fitted = (id: string, C: TimedIcon) => {
  const Fitted: TimedIcon = (props) => {
    const f = FIT[id];
    if (!f) {
      return <C {...props} />;
    }
    return (
      <Frame scale={f.s} dx={f.dx} dy={f.dy}>
        <StrokeScale value={1 / f.s}>
          <C {...props} />
        </StrokeScale>
      </Frame>
    );
  };
  Fitted.buildEnd = C.buildEnd;
  return Fitted;
};

const drawn = CATALOG.filter(isDrawn);

/** Library icons as storyboards use them: fitted, keyed by slug. */
export const LIBRARY_ICONS: Record<string, TimedIcon> =
  Object.fromEntries(drawn.map((x) => [x.id, fitted(x.id, x.C)]));

/** The same icons unfitted, for measuring. */
export const LIBRARY_RAW: Record<string, React.FC<IconProps>> =
  Object.fromEntries(drawn.map((x) => [x.id, x.C]));

/**
 * Every vendored glyph under "v:<set>/<name>", whether or not the catalog
 * uses it yet — for previewing candidates and for one-off storyboard beats.
 */
export const VENDOR_ICONS: Record<string, React.FC<IconProps>> =
  Object.fromEntries(Object.keys(VENDOR).map((k) => [`v:${k}`, vendorIcon(k)]));
