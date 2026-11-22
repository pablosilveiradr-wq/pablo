"""stock_search.py OUTDIR: search Openverse (StockSnap, CC0) for each beat, download thumbs, one labelled row per beat."""
import json, os, subprocess, sys, time, urllib.parse
out = sys.argv[1]
beats = [(a, b) for a, b in (x.split("=", 1) for x in sys.argv[2:])] or [
    ("explico", "man writing notebook"), ("atencion", "focus concentration"), ("limitado", "hourglass"),
    ("corteza", "brain"), ("concentrarte", "studying desk"), ("pocas", "juggling"), ("tironea", "rope"),
    ("proba", "hand smartphone"), ("celular", "smartphone table"), ("habitacion", "door room"),
    ("bocaabajo", "phone desk"), ("vista", "closed door"), ("midieron", "laboratory"),
    ("cerca", "smartphone"), ("peor", "tired office"), ("ocupada", "distracted"),
    ("sacas", "empty desk"), ("lugar", "calm reading"), ("chau", "sunset person"),
]
for name, q in beats:
    d = os.path.join(out, name)
    os.makedirs(d, exist_ok=True)
    url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode({"q": q, "source": "stocksnap", "page_size": 8})
    raw = subprocess.run(["curl", "-s", "--max-time", "30", url], capture_output=True, text=True).stdout
    try:
        res = json.loads(raw)["results"]
    except Exception:
        print(name, "ERR", raw[:80]); continue
    json.dump(res, open(os.path.join(d, "results.json"), "w"))
    for i, r in enumerate(res):
        subprocess.run(["curl", "-s", "--max-time", "40", "-o", os.path.join(d, f"{i}.jpg"), f"https://api.openverse.org/v1/images/{r['id']}/thumb/?full_size=true"])
        time.sleep(0.4)
    print(name, len(res))
    time.sleep(1)
