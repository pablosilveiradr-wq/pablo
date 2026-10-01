#!/usr/bin/env python3
"""Sound effects for the Metacognicion animation, synthesised from scratch.

  python3 scripts/sfx_metacognicion.py OUT.wav

No samples: filtered noise and sine partials, so there is nothing
to license. Cue times follow src/Anim/Metacognicion.tsx.
"""
import math
import random
import struct
import sys
import wave

SR = 48000
DUR = 8.5

random.seed(11)
N = int(SR * DUR)
L = [0.0] * N
R = [0.0] * N


def add(start_s, samples, gain=1.0, pan=0.0):
    i0 = int(start_s * SR)
    gl = gain * math.cos((pan + 1) * math.pi / 4)
    gr = gain * math.sin((pan + 1) * math.pi / 4)
    for k, v in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            L[i] += v * gl
            R[i] += v * gr


def noise(n):
    return [random.uniform(-1, 1) for _ in range(n)]


def bandpass_sweep(x, f0, f1, q=1.2):
    y, n = [0.0] * len(x), len(x)
    x1 = x2 = y1 = y2 = 0.0
    for i in range(n):
        f = f0 * (f1 / f0) ** (i / max(1, n - 1))
        w = 2 * math.pi * f / SR
        alpha = math.sin(w) / (2 * q)
        a0, a1, a2 = 1 + alpha, -2 * math.cos(w), 1 - alpha
        v = (alpha * x[i] - alpha * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, x[i], y1, v
        y[i] = v
    return y


def env(n, attack, release, shape=2.0):
    out = []
    for i in range(n):
        t = i / n
        if t < attack:
            e = (t / attack) ** shape
        elif t > 1 - release:
            e = ((1 - t) / release) ** shape
        else:
            e = 1.0
        out.append(e)
    return out


def norm(x):
    p = max(abs(v) for v in x) or 1
    return [v / p for v in x]


def whoosh(seconds, f0, f1, q=1.3, attack=0.35, release=0.6):
    n = int(seconds * SR)
    x = norm(bandpass_sweep(noise(n), f0, f1, q))
    e = env(n, attack, release, 1.6)
    return [v * e[i] for i, v in enumerate(x)]


def blink(freq=1400):
    """Eye opening: a soft rounded tick with a tiny tone."""
    n = int(0.18 * SR)
    out = []
    for i in range(n):
        t = i / SR
        a = min(1.0, t / 0.003)
        out.append(a * (0.7 * math.sin(2 * math.pi * freq * t) + 0.3 * math.sin(2 * math.pi * freq * 2 * t)) * math.exp(-t * 32))
    return out


def shimmer(seconds, base=2200):
    """Light: many high partials with tremolo, rising a little."""
    n = int(seconds * SR)
    parts = [(base * r, random.random() * 6.28, 5 + random.random() * 9) for r in (1.0, 1.25, 1.5, 1.88, 2.24, 2.67)]
    e = env(n, 0.3, 0.55, 1.4)
    out = []
    for i in range(n):
        t = i / SR
        glide = 1 + 0.12 * (i / n)
        v = sum(math.sin(2 * math.pi * f * glide * t + ph) * (0.6 + 0.4 * math.sin(2 * math.pi * tr * t)) for f, ph, tr in parts)
        out.append(v * e[i])
    return norm(out)


def chime(base, seconds):
    n = int(seconds * SR)
    partials = [(1.0, 1.0, 1.0), (2.0, 0.35, 1.8), (2.76, 0.18, 2.6), (5.4, 0.06, 4.0)]
    out = []
    for i in range(n):
        t = i / SR
        a = min(1.0, t / 0.01)
        out.append(a * sum(amp * math.sin(2 * math.pi * base * r * t) * math.exp(-d * t * 1.2) for r, amp, d in partials) * 0.4)
    return out


# Cues (seconds), from Metacognicion.tsx
EYE1, BEAM, PULL, HEAD2, EYE2, MEET = 1.4, 1.8, 2.4, 2.7, 3.9, 4.2
# Only discrete cues: no continuous bed under the picture (Pablo disliked it).

add(0.0, whoosh(1.4, 260, 900, attack=0.4, release=0.5), 0.35)              # the head drawing in
add(EYE1, blink(1500), 0.16, pan=-0.2)
add(BEAM, shimmer(1.4, 2300), 0.18, pan=-0.1)
add(BEAM, whoosh(0.9, 600, 4200, q=1.6, attack=0.5, release=0.5), 0.28)
add(PULL, whoosh(1.3, 520, 140, q=0.9, attack=0.3, release=0.65), 0.6)      # camera pulling back
add(HEAD2, whoosh(1.0, 300, 900, attack=0.45, release=0.5), 0.2, pan=0.3)
add(EYE2, blink(1320), 0.13, pan=0.25)
add(MEET, chime(659.3, 3.5), 0.5, pan=-0.15)                               # E5
add(MEET + 0.06, chime(987.8, 3.2), 0.3, pan=0.15)                          # B5, a fifth up
add(MEET, shimmer(2.2, 2600), 0.12)

peak = max(max(abs(v) for v in L), max(abs(v) for v in R)) or 1
g = 0.85 / peak
fade_in, fade_out = int(0.05 * SR), int(0.5 * SR)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    frames = bytearray()
    for i in range(N):
        f = min(1.0, i / fade_in, (N - i) / fade_out)
        frames += struct.pack("<hh", int(L[i] * g * f * 32767), int(R[i] * g * f * 32767))
    w.writeframes(bytes(frames))
print(f"wrote {sys.argv[1]} ({DUR}s)")
