"""Whisper word timings: asr.py IN.wav OUT.json"""
import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=1)
segs, _ = m.transcribe(sys.argv[1], language="es", word_timestamps=True, beam_size=5)
words = [(w.word.strip(), round(w.start, 3), round(w.end, 3)) for s in segs for w in s.words]
json.dump(words, open(sys.argv[2], "w"), ensure_ascii=False)
print(len(words), "words;", " ".join(w[0] for w in words))
