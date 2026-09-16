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
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 1080 1080";
  const transform = raw.match(/<g transform="([^"]+)"/)?.[1] ?? "";
  const paths = [...raw.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);

  if (paths.length === 0) {
    throw new Error(`${file}: no se encontro ningun trazo. Revisa que sea linea clara sobre fondo oscuro.`);
  }

  const ts =
    `// Generado por scripts/trace.mjs desde ${basename(file)}. No editar a mano.\n` +
    `export const ${name} = {\n` +
    `  viewBox: ${JSON.stringify(viewBox)},\n` +
    `  transform: ${JSON.stringify(transform)},\n` +
    `  paths: [\n${paths.map((d) => `    ${JSON.stringify(d)},`).join("\n")}\n  ],\n` +
    `} as const;\n`;

  writeFileSync(join(OUT_DIR, `${name}.ts`), ts);
  console.log(`  ${basename(file)} -> ${name}.ts (${paths.length} trazos)`);
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
console.log(`\nListo. ${names.length} archivo(s) en ${OUT_DIR}/`);
