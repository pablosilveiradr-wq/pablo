"""Align the Invisible script to a voice-over's Whisper words; write Visita-style props + padded audio."""
import difflib, json, re, sys, unicodedata, wave, struct
SP = "/tmp/claude-0/-home-user-pablo/5f6ba2a0-a070-517a-b7b0-8c0e47955b82/scratchpad/hoy"
LEAD, TAIL = 0.4, 2.0
S = [
 [["La mayor parte de lo que da forma a una vida"], ["no se puede ver."]],
 [["No podés ver el tiempo pasar."]],
 [["No podés ver una decisión"], ["convirtiéndose en un rumbo."]],
 [["No podés ver el momento"], ["en que un desconocido se vuelve importante."]],
 [["O cuando algo común"], ["se vuelve un recuerdo."]],
 [["Notamos los resultados."], ["Pero rara vez"], ["las fuerzas invisibles"], ["que los crearon."]],
 [["Atención."]], [["Elección."]], [["Distancia."]], [["Repetición."]], [["Conexión."]],
 [["Un pequeño cambio"], ["puede volverse una vida completamente distinta."]],
 [["Un momento breve"], ["puede quedarse por décadas."]],
 [["Una persona puede irse"], ["y aun así cambiar hacia dónde vas."]],
 [["Quizás lo que no se ve"], ["pesa más de lo que creemos."]],
 [["Quizás es lo que"], ["más nos forma."]],
 [["Por eso le damos forma."]],
 [["Una línea."]], [["Un punto."]], [["Un movimiento."]],
 [["Una forma de ver"], ["lo que siempre estuvo ahí."]],
 [["Hacer visible lo invisible."]],
]
def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    return re.sub(r"[^a-z]", "", "".join(c for c in t if unicodedata.category(c) != "Mn"))

words = json.load(open(f"{SP}/words.json"))
hw = [norm(w[0]) for w in words]
# script tokens with (scene, line) of each line's first token
tok, first = [], []
for si, sc in enumerate(S):
    for li, (text,) in enumerate(sc):
        first.append((si, li, len(tok), text))
        tok += [norm(x) for x in text.split()]
sm = difflib.SequenceMatcher(None, tok, hw, autojunk=False)
m = {}
for a, b, n in sm.get_matching_blocks():
    for k in range(n):
        m[a + k] = b + k
print("matched", len(m), "of", len(tok))
def start_of(ti):
    j = ti
    while j not in m:  # nearest following matched token
        j += 1
    return words[m[j]][1] + LEAD
ends = {}
lines = []
for si, li, ti, text in first:
    st = round(start_of(ti) - 0.08, 3)
    wts = [round(start_of(ti + k) - st - 0.04, 3) for k in range(len(text.split()))]
    lines.append(dict(text=text, start=st, scene=si, words=wts))
last_word_end = words[-1][2] + LEAD
seconds = round(last_word_end + TAIL, 3)
scene_start = {}
for l in lines:
    scene_start.setdefault(l["scene"], l["start"])
scenes = []
for si in range(len(S)):
    st = 0 if si == 0 else round(scene_start[si] - 0.04, 3)
    scenes.append(dict(start=st, dark=si == 5))
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else seconds
for i, l in enumerate(lines):
    sc = scenes[l["scene"]]
    same = [x for x in lines if x["scene"] == l["scene"]]
    idx = same.index(l)
    if l["scene"] == 5:
        l["row"] = 0 if idx == 0 else idx - 1
        l["end"] = round(same[1]["start"] - 0.05, 3) if idx == 0 else sc["end"]
    else:
        l["row"] = idx
        l["end"] = sc["end"]
json.dump(dict(scenes=scenes, lines=lines, seconds=seconds), open(f"{SP}/props.json", "w"), ensure_ascii=False, indent=1)
print("seconds", seconds)
for s, (sc) in zip(scenes, S):
    print(round(s["start"], 2), round(s["end"] - s["start"], 2), sc[0][0])
