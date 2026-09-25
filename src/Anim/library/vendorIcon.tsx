import React from "react";
import { DrawPath, Dot, Frame, IconProps } from "../primitives";
import { STROKE } from "../theme";
import { VENDOR } from "./vendor";

/** An icon that knows the build frame its drawing finishes on. */
export type TimedIcon = React.FC<IconProps> & { buildEnd?: number };

/** Build frames the last dot of a glyph needs after its strokes. */
const DOT_TAIL = 16;

/** Longest a vendored glyph takes to draw on, in build frames. */
const BUDGET = 92;

/**
 * Draw schedule for a glyph: each stroke's duration follows its length, and
 * the next one starts a little before it ends, so the icon draws as one
 * continuous gesture. Squeezed to BUDGET if the glyph has a lot of strokes.
 */
const schedule = (lens: readonly number[]) => {
  const durs = lens.map((l) => Math.max(12, Math.min(38, 8 + l / 24)));
  const starts: number[] = [];
  let t = 0;
  for (const d of durs) {
    starts.push(t);
    t += d * 0.55;
  }
  const end = Math.max(...starts.map((s, i) => s + durs[i]), 1);
  const k = end > BUDGET ? BUDGET / end : 1;
  return {
    starts: starts.map((s) => s * k),
    durs: durs.map((d) => d * k),
    end: end * k,
  };
};

/**
 * A professional line glyph (Lucide / Tabler geometry) drawn in the house
 * style: hairline stroke, glow, nib, and a slow breath once it has landed.
 */
export const vendorIcon = (key: string, breath = 0.012, weight = 1) => {
  const glyph = VENDOR[key];
  if (!glyph) {
    throw new Error(`Unknown vendored glyph "${key}" — run scripts/import_icons.py`);
  }
  const plan = schedule(glyph.lens);
  const Glyph: TimedIcon = ({ delay = 0 }) => (
    <Frame breath={breath}>
      {glyph.paths.map((d, i) => (
        <DrawPath
          key={i}
          d={d}
          delay={delay + plan.starts[i]}
          duration={plan.durs[i]}
          strokeWidth={STROKE * weight}
        />
      ))}
      {glyph.dots.map(([x, y], i) => (
        <Dot key={`d${i}`} cx={x} cy={y} r={9 * weight} delay={delay + plan.end * 0.8 + i * 3} />
      ))}
    </Frame>
  );
  Glyph.buildEnd = glyph.dots.length
    ? Math.max(plan.end, plan.end * 0.8 + glyph.dots.length * 3 + DOT_TAIL)
    : plan.end;
  return Glyph;
};

type Part = {
  /** A vendored glyph, or `C` for a piece drawn in the kit. */
  readonly key?: string;
  readonly C?: React.FC<IconProps>;
  /** Scale, and offset in canvas units, applied about the canvas centre. */
  readonly s?: number;
  readonly dx?: number;
  readonly dy?: number;
  /** Build frame this part starts drawing at; defaults to one after another. */
  readonly at?: number;
};

/**
 * Several vendored glyphs arranged into one icon — how metaphors get built
 * out of professional parts instead of freehand strokes.
 */
export const combo = (parts: readonly Part[], breath = 0.012) => {
  // A part drawn at scale s gets a 1/s stroke, so every part of the icon
  // carries the same line weight however small it sits.
  const glyphs: TimedIcon[] = parts.map(
    (p) => p.C ?? vendorIcon(p.key ?? "", 0, 1 / (p.s ?? 1)),
  );
  const Combo: TimedIcon = ({ delay = 0 }) => (
    <Frame breath={breath}>
      {parts.map((p, i) => {
        const G = glyphs[i];
        return (
          <Frame key={i} scale={p.s ?? 1} dx={p.dx ?? 0} dy={p.dy ?? 0}>
            <G delay={delay + (p.at ?? i * 34)} />
          </Frame>
        );
      })}
    </Frame>
  );
  Combo.buildEnd = Math.max(
    ...parts.map((p, i) => (p.at ?? i * 34) + (glyphs[i].buildEnd ?? 60)),
  );
  return Combo;
};
