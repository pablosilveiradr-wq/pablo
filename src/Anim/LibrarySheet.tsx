import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";
import { ICONS, IconName } from "./registry";
import { LIBRARY_RAW } from "./library";
import { Canvas } from "./primitives";
import { BG } from "./theme";

export const librarySheetSchema = z.object({
  items: z.array(z.object({ id: z.string(), label: z.string() })),
  cols: z.number(),
  /** Unfitted icons, no labels or grid: what the fit script measures. */
  raw: z.boolean().optional(),
});

/**
 * A numbered contact sheet of icons at their held pose, for approving the
 * library from a still instead of scrubbing through clips.
 */
export const LibrarySheet: React.FC<z.infer<typeof librarySheetSchema>> = ({
  items,
  cols,
  raw = false,
}) => {
  const { width } = useVideoConfig();
  const cell = width / cols;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ display: "flex", flexWrap: "wrap", width }}>
        {items.map((item, i) => {
          const Icon = raw ? LIBRARY_RAW[item.id] : ICONS[item.id as IconName];
          return (
            <div
              key={i}
              style={{
                position: "relative",
                width: cell,
                height: cell,
                boxShadow: raw ? undefined : "inset 0 0 0 1px #262626",
              }}
            >
              {Icon ? (
                <Canvas scale={0.88} glow={!raw}>
                  <Icon />
                </Canvas>
              ) : null}
              {raw ? null : (
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 10,
                    color: "#8f8",
                    font: "600 22px sans-serif",
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Rows of square cells: the sheet is exactly as tall as it needs to be. */
export const librarySheetHeight = (
  count: number,
  cols: number,
  width: number,
) => Math.ceil(Math.ceil(count / cols) * (width / cols));
