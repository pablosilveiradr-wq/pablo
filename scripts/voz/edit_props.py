"""Captions + B-roll props for EditReel from Whisper words.
edit_props.py WORDS.json FIXES.json BROLL.json HOOK_END OUT.json TOTAL
FIXES: {"index": "corrected word"} ("" drops a word, a trailing "/" forces a caption break); BROLL: [{"icon": "187_cerebro", "at": "word index"}]
Captions: at most 5 words, broken at punctuation; each runs to the next one's start."""
import json, sys
words, fixes, broll = (json.load(open(p)) for p in sys.argv[1:4])
hook_end, out, total = float(sys.argv[4]), sys.argv[5], float(sys.argv[6])
w = [[fixes.get(str(i), t), s, e] for i, (t, s, e) in enumerate(words)]
brk = {i for i, x in enumerate(w) if x[0].endswith("/")}
for x in w:
    x[0] = x[0].rstrip("/")
caps, cur = [], []
for i, (t, s, e) in enumerate(w):
    if not t:
        continue
    if cur and (s >= hook_end > w[cur[0]][1]):  # never straddle the cut
        caps.append(cur); cur = []
    cur.append(i)
    if t[-1] in ",.:;?!" or i in brk or len(cur) == 5:
        caps.append(cur); cur = []
if cur:
    caps.append(cur)
captions = []
for k, c in enumerate(caps):
    start = w[c[0]][1]
    end = w[caps[k + 1][0]][1] if k + 1 < len(caps) else total
    text = " ".join(w[i][0] for i in c if w[i][0]).rstrip(",.:;")
    captions.append(dict(text=text, start=round(start, 3), end=round(end, 3)))
captions[0]["start"] = 0
shots = []
for k, b in enumerate(broll):
    start = w[int(b["at"])][1]
    end = w[int(broll[k + 1]["at"])][1] if k + 1 < len(broll) else total
    shots.append(dict(icon=b["icon"], start=round(max(start, hook_end), 3), end=round(end, 3)))
json.dump(dict(hookEnd=hook_end, captions=captions, broll=shots, seconds=total), open(out, "w"), ensure_ascii=False, indent=1)
for c in captions:
    print(f"{c['start']:6.2f} {c['text']}")
