"""Shorten the silences between words to at most MAX seconds, cutting in the middle of each gap.
tighten.py IN.wav WORDS.json OUT.wav [MAX]"""
import json, sys
import numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1])
w = json.load(open(sys.argv[2]))
MAX = float(sys.argv[4]) if len(sys.argv) > 4 else 0.28
keep, pos, cut = [], 0, 0.0
fade = int(0.012 * sr)
for i in range(len(w) - 1):
    gap = w[i + 1][1] - w[i][2]
    if gap > MAX:
        mid = (w[i][2] + w[i + 1][1]) / 2
        a = int((mid - (gap - MAX) / 2) * sr)
        b = int((mid + (gap - MAX) / 2) * sr)
        seg = x[pos:a].copy()
        seg[-fade:] *= np.linspace(1, 0, fade)
        keep.append(seg)
        pos = b
        cut += (b - a) / sr
tail = x[pos:].copy()
tail[:fade] *= np.linspace(0, 1, fade)
keep.append(tail)
y = np.concatenate(keep)
sf.write(sys.argv[3], y, sr)
print(f"cut {cut:.2f}s -> {len(y)/sr:.2f}s")
