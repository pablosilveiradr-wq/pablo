"""Scene starts and in-scene word cues from Whisper words, on the ORIGINAL timeline (no speed-up).
scene_marks.py WORDS.json SPEC.json OUT.json TOTAL_SECONDS
SPEC: [{"first": "<first word of the scene>", "marks": ["word", ...]}, ...] in order."""
import json, re, sys, unicodedata
words = json.load(open(sys.argv[1]))
spec = json.load(open(sys.argv[2]))
total = float(sys.argv[4])
def n(t):
    t = unicodedata.normalize("NFD", t.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in t if unicodedata.category(c) != "Mn"))
W = [n(w[0]) for w in words]
pos, scenes = 0, []
for sc in spec:
    i = W.index(n(sc["first"]), pos)
    start = words[i][1]
    marks, j = [], i
    for m in sc["marks"]:
        j = W.index(n(m), j)
        marks.append(words[j][1])
        j += 1
    scenes.append(dict(start=start, marks=marks))
    pos = j if sc["marks"] else i + 1
for k, s in enumerate(scenes):
    s["start"] = 0 if k == 0 else round(s["start"] - 0.1, 3)
for k, s in enumerate(scenes):
    s["end"] = scenes[k + 1]["start"] if k + 1 < len(scenes) else total
    s["marks"] = [round(m - s["start"], 3) for m in s["marks"]]
json.dump(dict(scenes=scenes, seconds=total), open(sys.argv[3], "w"), ensure_ascii=False)
for s, sc in zip(scenes, spec):
    print(f"{s['start']:6.2f} {s['end'] - s['start']:5.2f} {sc['first']:<14} {s['marks']}")
