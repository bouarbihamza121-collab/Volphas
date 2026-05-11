# Volphas — Sonia audio

This folder holds pre-recorded MP3s of every English word and phrase in the app,
spoken in Microsoft's **Sonia** voice. With these files bundled, every learner
hears the exact same Sonia voice on every device — phone, laptop, any browser
— without depending on device TTS.

## Generating the audio (one time)

### Windows — easiest path
1. Install Python from <https://python.org/downloads>
   (tick **"Add Python to PATH"** on the first installer screen).
2. Double-click `tools/generate_audio.bat`.
3. Wait ~30 seconds. Done.

### Mac / Linux
1. `python3 tools/generate_audio.py`

That's it. No Azure account, no API key, no signup. The script uses the free
public `edge-tts` library, which connects anonymously to the same Microsoft
service that Edge's "Read Aloud" feature uses. Sonia is the default voice.

## How it works

- `manifest.json` — maps each English text to a filename.
- `*.mp3` — the generated audio files.
- `volphas-app.html` has an inlined `AUDIO_MAP`. When you click the speaker
  button, the app plays the matching MP3 if present; if not, it falls back to
  the device's built-in TTS (so nothing breaks while you're still generating).

## Adding new exercises

When you add new `word:` / `phrase:` fields in `EXERCISES`, run:

```
python tools/extract_audio_texts.py    # updates manifest + AUDIO_MAP
python tools/generate_audio.py         # synthesizes only the NEW files
```

Existing MP3s are kept. Safe to re-run any time.
