// PNG de linea (blanco sobre negro) -> paths SVG listos para animar.
//
//   node scripts/trace.mjs                 # traza todo assets/import/*.png
//   node scripts/trace.mjs foto.png        # traza uno solo
//
// Requiere: imagemagick (convert) y potrace.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { basename, extname, join } from "node:path";

const IN_DIR = "assets/import";
const OUT_DIR = "src/Anim/traced";
const TMP = ".trace-tmp";


// --- Encuadre ------------------------------------------------------------
// El arte generado afuera llega corrido y a escalas distintas. Medimos su
// caja real y emitimos un transform que lo centra y lo lleva siempre a la
// misma proporcion del cuadro, para que las escenas no salten entre si.

const NUM = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;

const pathBBox = (d, [a, b, c, dd, e, f]) => {
  // Parser suficiente para la salida de potrace: M/m, L/l, C/c, H/h, V/v, Z/z.
  let x = 0, y = 0, startX = 0, startY = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const put = (px, py) => {
    const tx = a * px + c * py + e;
    const ty = b * px + dd * py + f;
    if (tx < minX) minX = tx;
    if (tx > maxX) maxX = tx;
    if (ty < minY) minY = ty;
    if (ty > maxY) maxY = ty;
  };
  for (const [, cmd, args] of d.matchAll(/([MmLlCcHhVvZzSsQqTtAa])([^MmLlCcHhVvZzSsQqTtAa]*)/g)) {
    const n = (args.match(NUM) ?? []).map(Number);
    const rel = cmd === cmd.toLowerCase();
    switch (cmd.toUpperCase()) {
      case "M":
        for (let i = 0; i + 1 < n.length; i += 2) {
          x = rel ? x + n[i] : n[i];
          y = rel ? y + n[i + 1] : n[i + 1];
          if (i === 0) { startX = x; startY = y; }
          put(x, y);
        }
        break;
      case "L":
      case "T":
        for (let i = 0; i + 1 < n.length; i += 2) {
          x = rel ? x + n[i] : n[i];
          y = rel ? y + n[i + 1] : n[i + 1];
          put(x, y);
        }
        break;
      case "H":
        for (const v of n) { x = rel ? x + v : v; put(x, y); }
        break;
      case "V":
        for (const v of n) { y = rel ? y + v : v; put(x, y); }
        break;
      case "C":
        for (let i = 0; i + 5 < n.length; i += 6) {
          // Los puntos de control acotan la curva: sirve para la caja.
          put(rel ? x + n[i] : n[i], rel ? y + n[i + 1] : n[i + 1]);
          put(rel ? x + n[i + 2] : n[i + 2], rel ? y + n[i + 3] : n[i + 3]);
          x = rel ? x + n[i + 4] : n[i + 4];
          y = rel ? y + n[i + 5] : n[i + 5];
          put(x, y);
        }
        break;
      case "S":
      case "Q":
        for (let i = 0; i + 3 < n.length; i += 4) {
          put(rel ? x + n[i] : n[i], rel ? y + n[i + 1] : n[i + 1]);
          x = rel ? x + n[i + 2] : n[i + 2];
          y = rel ? y + n[i + 3] : n[i + 3];
          put(x, y);
        }
        break;
      case "A":
        for (let i = 0; i + 6 < n.length; i += 7) {
          x = rel ? x + n[i + 5] : n[i + 5];
          y = rel ? y + n[i + 6] : n[i + 6];
          put(x, y);
        }
        break;
      case "Z":
        x = startX; y = startY;
        break;
    }
  }
  return { minX, minY, maxX, maxY };
};

/** Lee "translate(0,1080) scale(0.1,-0.1)" como matriz [a,b,c,d,e,f]. */
const parseTransform = (t) => {
  let m = [1, 0, 0, 1, 0, 0];
  const mul = (n) => {
    m = [
      m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
      m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
      m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
    ];
  };
  for (const [, fn, argstr] of t.matchAll(/(translate|scale|matrix)\s*\(([^)]*)\)/g)) {
    const n = (argstr.match(NUM) ?? []).map(Number);
    if (fn === "translate") mul([1, 0, 0, 1, n[0] ?? 0, n[1] ?? 0]);
    else if (fn === "scale") mul([n[0] ?? 1, 0, 0, n[1] ?? n[0] ?? 1, 0, 0]);
    else if (fn === "matrix") mul(n);
  }
  return m;
};

/** Proporcion del cuadro que ocupa el dibujo, igual para todas las escenas. */
const FILL = 0.62;

const reframe = (paths, transform, size) => {
  const m = parseTransform(transform);
  const boxes = paths.map((d) => pathBBox(d, m));
  const minX = Math.min(...boxes.map((b) => b.minX));
  const minY = Math.min(...boxes.map((b) => b.minY));
  const maxX = Math.max(...boxes.map((b) => b.maxX));
  const maxY = Math.max(...boxes.map((b) => b.maxY));
  const w = maxX - minX;
  const h = maxY - minY;
  if (!(w > 0 && h > 0)) return { transform, scale: 1 };
  const s = (size * FILL) / Math.max(w, h);
  const cx = minX + w / 2;
  const cy = minY + h / 2;
  return {
    transform:
      `translate(${(size / 2).toFixed(2)} ${(size / 2).toFixed(2)}) ` +
      `scale(${s.toFixed(5)}) ` +
      `translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)}) ` +
      transform,
    scale: s,
  };
};

const camel = (s) =>
  s
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[0-9]+/, "")
    .replace(/^./, (c) => c.toLowerCase());

const trace = (file) => {
  const name = camel(basename(file, extname(file)));
  const pbm = join(TMP, `${name}.pbm`);
  const svg = join(TMP, `${name}.svg`);

  // Umbral + negado: potrace traza lo negro, y el dibujo viene en blanco.
  execFileSync("convert", [file, "-colorspace", "gray", "-threshold", "45%", "-negate", pbm]);
  execFileSync("potrace", [
    "-s", "-o", svg,
    "--turdsize", "6",      // descarta motas sueltas
    "--alphamax", "1.0",    // esquinas mas suaves
    "--opttolerance", "0.2",
    pbm,
  ]);

  const raw = readFileSync(svg, "utf8");
  const transform = raw.match(/<g transform="([^"]+)"/)?.[1] ?? "";
  const paths = [...raw.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  // Todo se normaliza a un lienzo 1080 cuadrado, centrado y a escala pareja.
  const SIZE = 1080;
  const viewBox = `0 0 ${SIZE} ${SIZE}`;

  if (paths.length === 0) {
    throw new Error(`${file}: no se encontro ningun trazo. Revisa que sea linea clara sobre fondo oscuro.`);
  }

  const framed = reframe(paths, transform, SIZE);

  const ts =
    `// Generado por scripts/trace.mjs desde ${basename(file)}. No editar a mano.\n` +
    `export const ${name} = {\n` +
    `  viewBox: ${JSON.stringify(viewBox)},\n` +
    `  transform: ${JSON.stringify(framed.transform)},\n` +
    `  paths: [\n${paths.map((d) => `    ${JSON.stringify(d)},`).join("\n")}\n  ],\n` +
    `} as const;\n`;

  writeFileSync(join(OUT_DIR, `${name}.ts`), ts);
  const dims = execFileSync("identify", ["-format", "%w %h", file]).toString().split(" ").map(Number);
  const warn = Math.min(...dims) < 1400 ? "  <- resolucion baja: el detalle fino se puede perder" : "";
  console.log(
    `  ${basename(file)} -> ${name}.ts (${paths.length} trazos, ${dims[0]}x${dims[1]}, reencuadrado x${framed.scale.toFixed(3)})${warn}`,
  );
  return name;
};

const arg = process.argv[2];
const files = arg
  ? [arg]
  : existsSync(IN_DIR)
    ? readdirSync(IN_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f)).map((f) => join(IN_DIR, f))
    : [];

if (files.length === 0) {
  console.log(`Nada para trazar. Deja los PNG en ${IN_DIR}/`);
  process.exit(0);
}

mkdirSync(TMP, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });
console.log(`Trazando ${files.length} imagen(es):`);
const names = files.map(trace);
rmSync(TMP, { recursive: true, force: true });

writeFileSync(
  join(OUT_DIR, "index.ts"),
  `// Generado por scripts/trace.mjs. No editar a mano.\n` +
    names.map((n) => `export { ${n} } from "./${n}";`).join("\n") +
    "\n",
);

// Catalogo: Root registra una composicion de preview por cada pieza importada.
writeFileSync(
  join(OUT_DIR, "catalog.ts"),
  `// Generado por scripts/trace.mjs. No editar a mano.\n` +
    `import type { Traced } from "../TracedIcon";\n` +
    names.map((n) => `import { ${n} } from "./${n}";`).join("\n") +
    `\n\nexport const CATALOG: ReadonlyArray<{ name: string; art: Traced }> = [\n` +
    names.map((n) => `  { name: ${JSON.stringify(n)}, art: ${n} },`).join("\n") +
    `\n];\n`,
);
console.log(`\nListo. ${names.length} archivo(s) en ${OUT_DIR}/`);
