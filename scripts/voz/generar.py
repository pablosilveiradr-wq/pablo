import os, sys, time, torch, torchaudio as ta
torch.set_num_threads(1); torch.set_num_interop_threads(1)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
lines = open("lines.txt").read().strip().splitlines()
idx = [int(i) for i in sys.argv[1].split(",")]
refs = sys.argv[2].split(",")
for i in idx:
    for ref in refs:
        for take in (1, 2):
            if __import__("os").path.exists(f"takes/s{i}_{ref}{take}.wav"):
                continue
            torch.manual_seed(100 * i + take)
            t = time.time()
            wav = m.generate(lines[i], language_id="es", audio_prompt_path=f"ref_{ref}.wav", exaggeration=0.4, cfg_weight=0.35, temperature=0.7)
            f = f"takes/s{i}_{ref}{take}.wav"
            ta.save(f, wav, m.sr)
            print(f, round(time.time() - t), "s", round(wav.shape[-1] / m.sr, 2), flush=True)
