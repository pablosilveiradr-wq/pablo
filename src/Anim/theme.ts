// Visual language extracted from the reference animations
// (anclaje / defusion / soltar): pure black canvas, thin off-white
// line art, one centred metaphor per beat, no text, no fills.

export const CANVAS = 1080;
export const CENTER = CANVAS / 2;

export const BG = "#000000";
export const INK = "#F2F2F2";

// Measured on the references: ~3.5px at 1080 once ICON_SCALE is applied.
export const STROKE = 3.1;
export const STROKE_THIN = 2.0;

// The references keep every icon inside a generous safe box so the
// composition still breathes when cropped to 9:16.
export const SAFE = 700;

// The references let each icon occupy ~60% of the frame width. Icons are
// authored at a comfortable size and scaled up once, here.
export const ICON_SCALE = 1.28;

export const FPS = 30;

// Fade in/out at each end of a beat, in frames. Beats do not overlap, so this
// is a quick dip through black rather than a dissolve between two icons.
export const CROSSFADE = 9;
