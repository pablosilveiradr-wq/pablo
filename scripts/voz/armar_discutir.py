"""Discutir: lay out the ElevenLabs take, stretch its natural pauses, write timing props."""
import json
import numpy as np, torch, torchaudio as ta

SR = 48000
LEAD, TAIL = 0.5, 2.0
CHUNKS = [
    ["Es increíble", "lo tranquila", "que se vuelve la vida"],
    ["cuando decidís", "que ya no tenés", "energía", "para discutir"],
    ["y estás en paz", "con que", "*no te entiendan."],
    ["Porque cada uno", "entiende", "desde su propio", "nivel de percepción,"],
    ["y ninguna", "discusión"],
    ["vale más que", "*tu salud mental."],
]
# extra silence after these words (index of the word that ends the pause)
EXTRA = {17: 0.35, 26: 0.45, 36: 0.35}

wav, sr = ta.load("disc/raw.wav")
wav = wav[0].numpy()
words = json.load(open("disc/words.json"))
assert len(words) == sum(len(c.split()) for l in CHUNKS for c in l), len(words)

# cut points: midway through the gap after each stretched word
pieces, shift, prev = [], {}, 0
offset = LEAD
cuts = sorted(EXTRA)
times = []
for i, w in enumerate(words):
    pass
segments = []
start = 0.0
for k in cuts:
    cut = (words[k][2] + words[k + 1][1]) / 2
    segments.append((start, cut, EXTRA[k]))
    start = cut
segments.append((start, len(wav) / SR, 0.0))

out_parts, t = [np.zeros(int(LEAD * SR), np.float32)], LEAD
mapping = []  # (src_start, src_end, dst_start)
for a, b, gap in segments:
    mapping.append((a, b, t))
    out_parts.append(wav[int(a * SR): int(b * SR)])
    t += b - a
    if gap:
        out_parts.append(np.zeros(int(gap * SR), np.float32))
        t += gap

def remap(x):
    for a, b, d in mapping:
        if a <= x <= b:
            return d + x - a
    return mapping[-1][2] + x - mapping[-1][0]

wt = [(w[0], remap(w[1]), remap(w[2])) for w in words]
voice_end = t
seconds = round(voice_end + TAIL, 3)
out = np.concatenate(out_parts + [np.zeros(int(TAIL * SR), np.float32)])

chunks, scenes, k = [], [], 0
for li, line in enumerate(CHUNKS):
    first = k
    for c in line:
        chunks.append(dict(text=c, start=round(wt[k][1] - 0.12, 3)))
        k += len(c.split())
    line_end = wt[k - 1][2]
    chunks[-1]["lineEnd"] = round(line_end + 0.25, 3)
    scenes.append(dict(start=round(0 if li == 0 else wt[first][1] - 0.3, 3)))
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else seconds
for i, ch in enumerate(chunks):
    nxt = chunks[i + 1]["start"] if i + 1 < len(chunks) else seconds
    le = ch.pop("lineEnd", None)
    ch["end"] = round(min(nxt, le) if le else nxt, 3)

ta.save("disc/voz_raw.wav", torch.from_numpy(out)[None], SR)
json.dump(dict(scenes=scenes, chunks=chunks, seconds=seconds), open("disc/props.json", "w"), ensure_ascii=False, indent=1)
print("seconds", seconds)
print(json.dumps(scenes))
