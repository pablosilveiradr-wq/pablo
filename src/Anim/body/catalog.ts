import { VENDOR } from "../library/vendor";
import type { BodyDef } from "./base";
import type { Pt } from "./draw";
import { BODY_PICTOS } from "./pictos-data";

export type BodyEntry = {
  /** Slug, used as "c:<id>" in storyboards and as the clip file name. */
  readonly id: string;
  readonly name: string;
  readonly cat: string;
  readonly def: BodyDef;
  readonly mirror?: boolean;
};

/** 24-grid unit to canvas, the way the icon importer places glyphs. */
const G = (x: number, y: number): Pt => [540 + (x - 12) * 18, 540 + (y - 12) * 18];

const dot = ([x, y]: readonly [number, number]) => `M ${x - 4} ${y} a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0`;

/**
 * Body bases in their fixed order: position + 1 is the number (C001…). All
 * share one frame, like the icon grid, so a hand and a torso sit at the
 * same scale as each other.
 */
export const BODY_CATALOG: BodyEntry[] = BODY_PICTOS.map((e) => {
  const g = VENDOR[e.key];
  if (!g) {
    throw new Error(`Missing glyph ${e.key}: run scripts/body_icons.py and import_icons.py build`);
  }
  return {
    id: e.id,
    name: e.name,
    cat: e.cat,
    def: {
      box: [...G(1.5, 1.5), ...G(22.5, 22.5)] as [number, number, number, number],
      lines: [...g.paths, ...g.dots.map(dot)],
      points: Object.fromEntries(Object.entries(e.points).map(([k, [x, y]]) => [k, G(x, y)])),
    },
  };
});
