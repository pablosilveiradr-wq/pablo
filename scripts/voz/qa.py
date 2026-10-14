"""qa.py VIDEO PROPS OUTDIR: large review sheets, several frames per scene (start, each cue, end)."""
import json, os, subprocess, sys
vid, props, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
p = json.load(open(props))
k = 0
for sc in p["scenes"]:
    d = sc["end"] - sc["start"]
    for t in sorted(set([0.4] + [m + 0.4 for m in sc["marks"] if m + 0.4 < d] + [d - 0.15])):
        T = sc["start"] + t
        subprocess.run(["/usr/bin/ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", f"{T:.2f}", "-i", vid, "-frames:v", "1",
                        "-vf", f"scale=400:400,drawtext=text='{T:.1f}':x=6:y=6:fontcolor=red:fontsize=22", f"{out}/{k:03d}.png"])
        k += 1
for i in range(0, k, 15):
    subprocess.run(["/usr/bin/ffmpeg", "-nostdin", "-v", "error", "-y", "-framerate", "1", "-start_number", str(i), "-i", f"{out}/%03d.png",
                    "-vf", "tile=5x3", "-frames:v", "1", f"{out}/R{i // 15}.png"])
print(k, "frames,", (k + 14) // 15, "sheets")
