# Voz clonada de Pablo (Chatterbox, licencia MIT)

Se corre en un venv aparte (no se sube): `python3 -m venv venv`, luego
`pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu`
y `pip install chatterbox-tts faster-whisper`. Requiere `huggingface.co` permitido en la red.

**Siempre con un hilo por proceso** (`OMP_NUM_THREADS=1`, `torch.set_num_threads(1)`):
con 4 hilos este procesador va 15 veces más lento. Se pueden correr hasta 3 procesos en paralelo (~4,5 GB c/u).

1. Referencia: 8–10 s limpios de la voz de Pablo → `ref_b.wav` (mono 24 kHz, `highpass=f=70,loudnorm=I=-20`).
   Su audio de muestra no se sube al repo.
2. Frases, una por línea, en `lines.txt` (cada una con su "pero": ahí cae el giro de la escena).
3. `python generar.py 0,3,6 a,b` → `takes/sN_<ref><toma>.wav` (2 tomas por frase y referencia).
4. `python armar.py out` → elige la toma con las palabras exactas (Whisper), arma `voz_raw.wav`
   y `visita_props.json` (escenas, giros y texto palabra por palabra con los tiempos de la voz).
5. Render: `npx remotion render build Visita x.mp4 --props=visita_props.json --muted`, masterizar la voz
   (`highpass=f=70,acompressor=threshold=-22dB:ratio=2.5,loudnorm=I=-16:TP=-1.5`) y unir con ffmpeg.
