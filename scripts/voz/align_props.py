"""Align a scene script to a voice-over's Whisper words and write props for the line-style reels.
align_props.py SCRIPT.json WORDS.json OUT.json [LEAD] [TAIL]
SCRIPT.json: list of scenes, each a list of text rows. Scene 'dark' flags are not handled here."""
import difflib, json, re, sys, unicodedata
script = json.load(open(sys.argv[1]))
words = json.load(open(sys.argv[2]))
LEAD = float(sys.argv[4]) if len(sys.argv) > 4 else 0.3
TAIL = float(sys.argv[5]) if len(sys.argv) > 5 else 1.8
def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    return re.sub(r"[^a-z]", "", "".join(c for c in t if unicodedata.category(c) != "Mn"))
hw = [norm(w[0]) for w in words]
tok, first = [], []
for si, rows in enumerate(script):
    for ri, text in enumerate(rows):
        first.append((si, ri, len(tok), text))
        tok += [norm(x) for x in text.split()]
m = {}
for a, b, n in difflib.SequenceMatcher(None, tok, hw, autojunk=False).get_matching_blocks():
    for k in range(n):
        m[a + k] = b + k
print("matched", len(m), "of", len(tok))
def t_of(ti):
    # matched token -> its start; otherwise interpolate between matched neighbours
    if ti in m:
        return words[m[ti]][1] + LEAD
    lo = max([k for k in m if k < ti], default=None)
    hi = min([k for k in m if k > ti], default=None)
    if lo is None:
        return t_of(hi)
    if hi is None:
        return words[m[lo]][2] + LEAD
    a, b = words[m[lo]][2] + LEAD, words[m[hi]][1] + LEAD
    return a + (b - a) * (ti - lo) / (hi - lo)
lines = []
for si, ri, ti, text in first:
    st = round(t_of(ti) - 0.08, 3)
    lines.append(dict(text=text, start=st, scene=si, row=ri,
                      words=[round(t_of(ti + k) - st - 0.04, 3) for k in range(len(text.split()))]))
seconds = round(words[-1][2] + LEAD + TAIL, 3)
starts = {}
for l in lines:
    starts.setdefault(l["scene"], l["start"])
scenes = [dict(start=0 if si == 0 else round(starts[si] - 0.04, 3)) for si in range(len(script))]
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else seconds
for l in lines:
    l["end"] = scenes[l["scene"]]["end"]
json.dump(dict(scenes=scenes, lines=lines, seconds=seconds), open(sys.argv[3], "w"), ensure_ascii=False, indent=1)
print("seconds", seconds)
for i, s in enumerate(scenes):
    print(f"{s['start']:6.2f} {s['end'] - s['start']:5.2f}  {script[i][0]}")
