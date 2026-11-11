# Hanzi Habit — HSK 5

A free, static, mobile-friendly HSK 5 vocabulary trainer. No API keys, backend, or accounts are required.

## Publish on GitHub Pages

1. Create a **public GitHub repository**, for example `hsk5-trainer`.
2. Upload `index.html`, `styles.css`, `app.js`, and `vocabulary.json` to the repository root.
3. Open **Settings → Pages → Build and deployment**.
4. Set **Deploy from a branch**, choose `main` and `/ (root)`, then Save.
5. After GitHub publishes the site, open the URL shown under Pages on your phone or laptop. You can add it to your phone's home screen using your browser menu.

For local development, from this folder run `python -m http.server 8000` and visit `http://localhost:8000`.

## How practice works

- The first **100 numbered syllabus entries** are unlocked initially, including separate grammatical senses of the same word.
- Daily goal: **50 independent correct answers**, mixing due reviews and new entries.
- On the front, vocabulary questions show only Chinese characters, without Pinyin or English hints. After submission, feedback reveals Pinyin, meaning, and the syllabus example where included.
- Once a word has at least one independent correct answer, it may also appear as a **fill-in-the-blank sentence question**. The answer must be typed in Chinese characters.
- Wrong answers must be retried immediately. **Only first-attempt correct responses count** toward the 11-success mastery threshold. The word remains due for later independent review after an error.
- Correct answers schedule reviews with growing day intervals (1, 2, 4, 8, 16, 32, 64 days). Wrong answers reset the interval.
- Once a word has **11 independent correct answers**, it is retired from regular testing.
- When at least 70% of unlocked entries have 2 independent correct answers, 10 more entries unlock, up to the included dataset size.
- Progress is stored in browser `localStorage`. It **does not sync between devices**. Use Settings → Export progress / Import progress to move your data.

## Limitations and extending the syllabus

The supplied PDF has visually readable tables but problematic text extraction for Chinese characters. The packaged dataset is a manually assembled transcription of **entries 1–111** from the uploaded syllabus, with example sentences included for **81 entries** (some are adapted practice examples rather than verbatim syllabus text). Where an example was unavailable, it is left blank. Confirm exact wording against the original PDF before relying on an example as a verbatim quote. Expansion automatically proceeds to entry 111, and stops until you add more source-verified rows to `vocabulary.json`.

The typed English grader uses strict normalized equivalents and a limited synonym list. Correct answers phrased in an unlisted way may be rejected; the app deliberately avoids automatically treating ambiguous answers as correct. You can extend `equivalents` in `app.js`.

Sentence Studio checks basic word presence and length and offers the source example for comparison. **It does not claim to correct unrestricted Chinese grammar.** That requires an AI-backed service or richer language tooling, neither of which is part of this offline-first GitHub Pages version.

## Source and license note

Vocabulary definitions and sample sentences are based on the user-provided *New HSK Level 5 Complete Syllabus (2026 edition)* from hskmocktest.com. This is a personal study tool. Verify permissions before redistributing the source vocabulary content publicly.
