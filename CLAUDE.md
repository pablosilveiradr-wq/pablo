# Animaciones de iconos para las píldoras de Pablo

Proyecto Remotion que produce las animaciones de iconos de línea para los reels de Pablo (contenido de ansiedad y calma, voz rioplatense). Hablale en español rioplatense.

## La librería: 400 iconos animados, ya renderizados

- **Clips listos en `iconos/NNN_slug.mp4`** (001–400). Úsalos directo: no hace falta volver a renderizarlos para editar un video.
- `iconos/000_indice_001-200.png` y `iconos/000_indice_201-400.png`: hojas con todos los números.
- **`GUIA_ICONOS.md`**: catálogo completo (número, qué muestra, cuándo usarlo) y reglas para pasar un guion a iconos. Leelo antes de elegir iconos.
- Fuente: `src/Anim/library/catalog.ts` (el orden fija la numeración: nunca reordenar, solo agregar al final), glifos en `src/Anim/library/vendor/{lucide,tabler,house}/*.svg`.

## Partes del cuerpo: marcar dónde va cada ejercicio

- 100 bases simples del cuerpo (C001–C100) en `iconos-cuerpo/CNNN_slug.mp4`; lista y puntos en la sección 4 de `GUIA_ICONOS.md`.
- Estilo: solo círculos, semicírculos y cápsulas en la grilla 24 de los iconos, **sin caras, manos sin dedos**. Pablo rechazó el dibujo anatómico "a mano": no volver a eso.
- Cabezas de perfil: como en los sets de iconos (cráneo = círculo, nariz = triángulo, cara recta hasta el mentón, mandíbula y cuello rectos; ojo = arco cerrado o punto). Ver `HC`/`FACE` en `src/Anim/Metacognicion.tsx`. Un perfil "realista" con curvas le pareció espantoso.
- Se generan con `python3 scripts/body_icons.py` (dibujo + puntos con nombre) y `python3 scripts/import_icons.py build`.
- En un storyboard: `icon: "touch:c:<slug>@<punto>"` marca el punto con un pulso; `+lens` agrega la lupa con el detalle (p. ej. `touch:c:antebrazo-interno@tres-dedos+lens`). La base sola es `c:<slug>`.

## Preferencias fijas de Pablo (no negociables)

- **1:1, 1080×1080**, iconos a escala **0.88** ("un poco más chicos").
- **Fondo negro puro**, sin partículas ni nada flotando.
- **Sin audio** en lo que se entrega: nunca usar su voz, solo la animación.
- Un icono por frase corta (~1,3–1,6 s). Anáforas: mismo icono repetido con progresión.
- Líneas que conectan exactamente (nada flotando ni despegado); manos sin dedos dibujados salvo los glifos de la librería.
- Animación de los clips: rebote de entrada, trazado rápido, destello de brillo al terminar, respiración suave. **Sin aro** (lo pidió sacar).
- Antes de producir iconos nuevos en cantidad, mandar hojas de aprobación (fotos) y esperar su OK.
- **Con voz (ElevenLabs con su clon, o grabada): el video SIEMPRE se adapta al audio**, nunca al revés. Acelerar un poco para que sea dinámico: recortar silencios entre palabras a ~0,28 s (`scripts/voz/tighten.py`) y `atempo=1.08` (mantiene el tono). Cada palabra del texto aparece cuando se dice (`scripts/voz/align_props.py` → props `scenes`/`lines` con `words`). Ver `Pausa`/`Invisible`.

## Flujos de trabajo

**Armar la animación de un video** (Pablo manda el video o el guion):
1. Leer las frases (subtítulos quemados o el guion) y sus tiempos.
2. Elegir un icono de la librería por frase (`GUIA_ICONOS.md`); si ninguno encaja, dibujar uno aparte con el mismo estilo.
3. Escribir `src/Anim/<nombre>-storyboard.ts` con beats `{ icon, start, end, note?, scene? }` (`icon` = slug de la librería o `"v:set/glifo"`), registrar la composición en `src/Root.tsx` con `scale: 0.88`, 1080×1080.
4. Renderizar sin audio y verificar con una hoja de contacto antes de entregar.

**Agregar iconos a la librería**: `python3 scripts/import_icons.py add <iconsets> set:glifo …` → `build` → agregar al final de `catalog.ts` → `python3 scripts/library.py fit` → `sheets <dir> a-b` para aprobar → renderizar `LibraryReel` con esos ids → `python3 scripts/library.py split <reel.mp4> iconos a-b` → actualizar `GUIA_ICONOS.md`.

## Render

```
npx remotion bundle
npx remotion render build <Composición> out/x.mp4 --props=props.json \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```
Usar el ffmpeg del sistema (`/usr/bin/ffmpeg`), no el de Remotion.
