#!/usr/bin/env python3
"""Sound effects for the Presente animation, synthesised from scratch.

  python3 scripts/sfx_presente.py OUT.wav

No samples: every sound is built here (filtered noise, a plucked string,
sine partials), so there is nothing to license. Cue times follow the frames
in src/Anim/Presente.tsx at 30 fps.
"""
import math
import random
import struct
import sys
import wave

SR = 48000
DUR = 7.0
FPS = 30

# Frames from Presente.tsx
CUT_FUTURO = 78
CUT_PASADO = 92
FREE = 100

random.seed(7)
N = int(SR * DUR)
L = [0.0] * N
R = [0.0] * N


def add(start_s, samples, gain=1.0, pan=0.0):
    """Mix mono samples in at `start_s`, panned -1 (left) .. 1 (right)."""
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
    """Band-pass filter whose centre glides from f0 to f1 (log), biquad per sample."""
    y = [0.0] * len(x)
    x1 = x2 = y1 = y2 = 0.0
    n = len(x)
    for i in range(n):
        f = f0 * (f1 / f0) ** (i / max(1, n - 1))
        w = 2 * math.pi * f / SR
        alpha = math.sin(w) / (2 * q)
        b0, b2 = alpha, -alpha
        a0, a1, a2 = 1 + alpha, -2 * math.cos(w), 1 - alpha
        v = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1 = x1, x[i]
        y2, y1 = y1, v
        y[i] = v
    return y


def lowpass(x, f):
    a = math.exp(-2 * math.pi * f / SR)
    y, prev = [], 0.0
    for v in x:
        prev = (1 - a) * v + a * prev
        y.append(prev)
    return y


def env(n, attack, release, shape=2.0):
    """Swell envelope: rises over `attack` of the length, falls over `release`."""
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


def whoosh(seconds, f0, f1, q=1.4):
    n = int(seconds * SR)
    x = bandpass_sweep(noise(n), f0, f1, q)
    e = env(n, 0.35, 0.6, 1.6)
    peak = max(abs(v) for v in x) or 1
    return [v / peak * e[i] for i, v in enumerate(x)]


def pluck(freq, seconds, bright=0.6):
    """Karplus-Strong string with a click on the attack: a thread snapping."""
    n = int(seconds * SR)
    period = int(SR / freq)
    buf = [random.uniform(-1, 1) for _ in range(period)]
    out = []
    for i in range(n):
        v = buf[i % period]
        nxt = buf[(i + 1) % period]
        buf[i % period] = 0.996 * (bright * v + (1 - bright) * nxt)
        out.append(v)
    click = int(0.003 * SR)
    for i in range(click):
        out[i] += random.uniform(-1, 1) * (1 - i / click) * 1.4
    fade = [math.exp(-6 * i / n) for i in range(n)]
    return [v * fade[i] for i, v in enumerate(out)]


def chime(base, seconds):
    """Soft bell: a few partials, slow decay, gentle attack."""
    n = int(seconds * SR)
    partials = [(1.0, 1.0, 1.0), (1.26, 0.55, 1.3), (1.5, 0.4, 1.6), (2.01, 0.25, 2.4), (2.76, 0.12, 3.2)]
    out = []
    for i in range(n):
        t = i / SR
        a = min(1.0, t / 0.008)
        v = 0.0
        for ratio, amp, dec in partials:
            v += amp * math.sin(2 * math.pi * base * ratio * t) * math.exp(-dec * t * 1.6)
        out.append(v * a * 0.35)
    return out


def swell(seconds):
    n = int(seconds * SR)
    x = lowpass(lowpass(noise(n), 900), 1400)
    peak = max(abs(v) for v in x) or 1
    e = env(n, 0.55, 0.45, 1.8)
    return [v / peak * e[i] for i, v in enumerate(x)]


def s(frame):
    return frame / FPS


# Everything draws in: a soft breath of air.
add(0.0, swell(0.9), 0.4)
# Futuro (right) snaps and falls; then Pasado (left).
add(s(CUT_FUTURO), pluck(780, 0.45), 0.7, pan=0.35)
add(s(CUT_FUTURO) + 0.03, whoosh(0.55, 1600, 260), 0.75, pan=0.3)
add(s(CUT_PASADO), pluck(690, 0.45), 0.7, pan=-0.35)
add(s(CUT_PASADO) + 0.03, whoosh(0.55, 1500, 240), 0.75, pan=-0.3)
# Free: the face rises (upward whoosh) and lights up (chime on the flash).
add(s(FREE), whoosh(0.6, 280, 2400, 1.1), 0.8)
add(s(FREE + 8), chime(1046.5, 3.2), 0.45)
add(s(FREE + 10), chime(1568.0, 2.8), 0.22, pan=0.2)

# Normalise with headroom and fade the very end.
peak = max(max(abs(v) for v in L), max(abs(v) for v in R)) or 1
g = 0.8 / peak
tail = int(0.4 * SR)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    frames = bytearray()
    for i in range(N):
        f = min(1.0, (N - i) / tail)
        frames += struct.pack("<hh", int(L[i] * g * f * 32767), int(R[i] * g * f * 32767))
    w.writeframes(bytes(frames))
print(f"wrote {sys.argv[1]} ({DUR}s)")
