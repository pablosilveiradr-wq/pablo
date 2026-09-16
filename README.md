# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Captioning

Replace the `sample-video.mp4` with your video file.
Caption all the videos in you `public` by running the following command:

```console
node sub.mjs
```

Only caption a specific video:

```console
node sub.mjs <path-to-video-file>
```

Only caption a specific folder:

```console
node sub.mjs <path-to-folder>
```

## Configure Whisper.cpp

Captioning will download Whisper.cpp and the 1.5GB big `medium.en` model. To configure which model is being used, you can configure the variables in `whisper-config.mjs`.

### Non-English languages

To support non-English languages, you need to change the `WHISPER_MODEL` variable in `whisper-config.mjs` to a model that does not have a `.en` sufix.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://remotion.dev/discord).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## Animaciones de línea (estilo anclaje / defusión / soltar)

Sistema para representar visualmente lo que se dice en un video, con el mismo
lenguaje de las referencias: fondo negro puro, línea blanca fina, una metáfora
centrada por frase, sin texto, encadenadas con cross-fade.

- `src/Anim/theme.ts` — tokens: color, grosor de línea, escala, fps.
- `src/Anim/primitives.tsx` — mecánicas de animación: `DrawPath` (la línea que
  se dibuja sola), `Appear`, `DashedRing`, `ArrowsInward`, `Waves`, `Ticks`,
  `Dot`, `Person`, y las oscilaciones de respiración.
- `src/Anim/icons.tsx` — la biblioteca de metáforas. Cada ícono es un
  componente; agregar uno nuevo es agregar una entrada a `ICONS`.
- `src/Anim/Storyboard.tsx` — el guion es data: una lista de beats
  `{ icon, start, end, note }` con tiempos en segundos del audio.

Para un video nuevo: se transcribe, se parte en frases, y cada frase se mapea a
un ícono con su tiempo. Eso es todo lo que hay que escribir.

```console
npm run dev                                          # preview en Remotion Studio
npx remotion render src/index.ts Storyboard out/v.mp4
npx remotion render src/index.ts Storyboard-9x16 out/v-reel.mp4
```
