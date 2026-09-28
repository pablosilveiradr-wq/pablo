"""Pick the best take per line, lay the voice-over out, and write the Visita timing props.

  python assemble.py OUT_DIR
"""
import difflib, glob, json, os, re, sys, unicodedata
import numpy as np
import torch, torchaudio as ta

torch.set_num_threads(1)
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
LINES = open("lines.txt").read().strip().splitlines()
# Caption chunks per line (word counts must add up to the line); * = landing chunk.
CHUNKS = [
    ["Podés", "volver", "al pasado,", "pero ahora", "*está vacío."],
    ["Tu vieja", "escuela", "sigue ahí,", "pero tus", "amigos", "*no."],
    ["La casa", "de tu infancia", "sigue en pie,", "pero tu familia", "*ya no", "vive ahí."],
    ["El café", "que amabas", "sigue abierto,", "pero el que", "sabía", "tu pedido", "*ya no está."],
    ["Las calles", "son las mismas,", "pero", "las caras", "*no."],
    ["Los edificios", "no cambiaron,", "pero", "la energía", "*sí."],
    ["El pasado", "es un lugar", "para visitar,", "pero la vida", "pasa", "*en el presente."],
]
for c, l in zip(CHUNKS, LINES):
    assert " ".join(x.lstrip("*") for x in c) == l, (c, l)

from faster_whisper import WhisperModel

asr = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=1)


def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(ch for ch in t if unicodedata.category(ch) != "Mn")
    t = t.replace("puedes", "podes")
    return re.sub(r"[^a-z ]", "", t).split()


def words_of(f):
    segs, _ = asr.transcribe(f, language="es", word_timestamps=True, beam_size=5)
    return [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]


takes = {}
for f in sorted(glob.glob("takes/s*.wav")):
    m = re.match(r"takes/s(\d)_([ab])(\d)\.wav", f)
    i, ref = int(m.group(1)), m.group(2)
    ws = words_of(f)
    said = norm(" ".join(w[0] for w in ws))
    want = norm(LINES[i])
    score = difflib.SequenceMatcher(None, said, want).ratio()
    dur = ws[-1][2] - ws[0][1] if ws else 0
    rate = len(LINES[i]) / dur if dur else 0
    takes.setdefault(i, []).append(dict(f=f, ref=ref, ws=ws, score=score, rate=rate))
    print(f, round(score, 2), round(rate, 1), "|", " ".join(w[0] for w in ws), flush=True)


def quality(t):
    # Exact words first; then a calm pace (about 13 chars/s) over a rushed one.
    return (10 if t["score"] == 1 else 0) + t["score"] - 0.02 * abs(t["rate"] - 13)


best_ref = max("ab", key=lambda r: sum(max(quality(t) for t in takes[i] if t["ref"] == r) for i in takes))
chosen = [max((t for t in takes[i] if t["ref"] == best_ref), key=quality) for i in range(len(LINES))]
print("ref", best_ref, [os.path.basename(c["f"]) for c in chosen])

SR = 48000
LEAD, GAP, TAIL = 0.6, 1.1, 2.0
track = []
t = LEAD
scenes, chunks = [], []
for i, c in enumerate(chosen):
    wav, sr = ta.load(c["f"])
    wav = ta.functional.resample(wav, sr, SR)[0].numpy()
    ws = c["ws"]
    a, b = max(0, ws[0][1] - 0.06), ws[-1][2] + 0.3
    seg = wav[int(a * SR): int(b * SR)]
    fade = int(0.02 * SR)
    seg[:fade] *= np.linspace(0, 1, fade)
    seg[-fade * 4:] *= np.linspace(1, 0, fade * 4)
    at = t
    track.append((at, seg))
    # word times on the timeline
    wt = [(w[0], at + w[1] - a, at + w[2] - a) for w in ws]
    n_text = sum(len(x.split()) for x in CHUNKS[i])
    pero = next((w for w in wt if norm(w[0]) == ["pero"]), None)
    if len(wt) == n_text:
        k = 0
        for x in CHUNKS[i]:
            n = len(x.split())
            chunks.append(dict(text=x, start=round(wt[k][1] - 0.05, 3)))
            k += n
    else:  # fall back to spreading the chunks by length over the line
        print("word count mismatch on line", i, len(wt), n_text)
        L0, L1 = wt[0][1], wt[-1][2]
        w = [len(x) + 4 for x in CHUNKS[i]]
        acc = L0
        for x, wi in zip(CHUNKS[i], w):
            chunks.append(dict(text=x, start=round(acc, 3)))
            acc += (L1 - L0) * wi / sum(w)
    line_end = at + len(seg) / SR
    chunks[-1]["lineEnd"] = round(line_end + 0.15, 3)
    scenes.append(dict(start=round(0 if i == 0 else at - 0.45, 3), turn=round(pero[1] if pero else (at + line_end) / 2, 3)))
    t = line_end + GAP

seconds = round(t - GAP + TAIL, 3)
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else seconds
for i, ch in enumerate(chunks):
    nxt = chunks[i + 1]["start"] if i + 1 < len(chunks) else seconds
    ch["end"] = round(min(nxt, ch.pop("lineEnd")) if "lineEnd" in ch else nxt, 3)

out = np.zeros(int(seconds * SR), dtype=np.float32)
for at, seg in track:
    i0 = int(at * SR)
    out[i0: i0 + len(seg)] += seg[: len(out) - i0]
ta.save(f"{OUT}/voz_raw.wav", torch.from_numpy(out)[None], SR)
json.dump(dict(scenes=scenes, chunks=chunks, seconds=seconds), open(f"{OUT}/visita_props.json", "w"), ensure_ascii=False, indent=1)
print("seconds", seconds)
print(json.dumps(scenes))
