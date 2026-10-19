---
name: build-app
description: Build the Wish Town Caddie page from src/, check it headlessly and publish it. Use after any change to src/ or a newly mapped hole.
---

# Build and publish

1. Build: `python3 tools/build.py` → `dist/index.html`. Satellite crops come from `.cache/` (re-fetched from Esri if missing).
2. Check once: `node tools/screenshot.js dist/index.html`. Run it from the scratchpad (it writes `ss-*.png` to the current directory). It must report no errors and `scrollW` equal to the viewport width (1280 desktop, 400 phone). View the phone screenshot only if something looks wrong.
3. Publish with the Artifact tool, updating the existing artifact `https://claude.ai/artifact/Qf7H6fiTVYjkjvjcrEqpMP` (read it first, as the tool requires).
4. Commit and push. Report the link and what changed in 3–5 lines.
