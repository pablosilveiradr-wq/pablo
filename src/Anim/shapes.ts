/** Reusable path geometry shared across icons. */

/** Scalloped blob used for thought bubbles. */
export const cloudPath = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  lobes = 11,
) => {
  const pts = new Array(lobes).fill(0).map((_, i) => {
    const a = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as const;
  });
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i <= lobes; i++) {
    const [px, py] = pts[i % lobes];
    const [qx, qy] = pts[i - 1];
    const r = Math.hypot(px - qx, py - qy) * 0.75;
    d += ` A ${r} ${r} 0 0 1 ${px} ${py}`;
  }
  return d;
};

/** The hook of a question mark. The dot underneath is drawn separately. */
export const questionHook = (x: number, y: number, s = 1) =>
  `M ${x - 30 * s} ${y - 30 * s} ` +
  `C ${x - 32 * s} ${y - 72 * s} ${x + 34 * s} ${y - 76 * s} ${x + 31 * s} ${y - 34 * s} ` +
  `C ${x + 29 * s} ${y - 6 * s} ${x} ${y - 6 * s} ${x} ${y + 24 * s}`;

/** Rounded rectangle as an explicit path so it can be drawn on. */
export const roundedRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) =>
  `M ${x + r} ${y} L ${x + w - r} ${y} A ${r} ${r} 0 0 1 ${x + w} ${y + r} ` +
  `L ${x + w} ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} ` +
  `L ${x + r} ${y + h} A ${r} ${r} 0 0 1 ${x} ${y + h - r} ` +
  `L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y}`;

/** A bowl: half-capsule with a rim. */
export const bowlPath = (cx: number, cy: number, w: number, h: number) =>
  `M ${cx - w / 2} ${cy} C ${cx - w / 2} ${cy + h * 0.72} ${cx - w * 0.29} ${cy + h} ${cx} ${cy + h} ` +
  `C ${cx + w * 0.29} ${cy + h} ${cx + w / 2} ${cy + h * 0.72} ${cx + w / 2} ${cy}`;
