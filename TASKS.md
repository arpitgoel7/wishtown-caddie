# Tasks

One fresh Claude Code session per batch, with this repo selected. Paste the batch prompt as the first message. Each batch ends with a commit + push and a short report to the owner; do not start the next batch in the same session.

## Batch 0 — Engine & app for 18 holes  ☑
Prompt: `Run Batch 0 from TASKS.md.`
- [x] Multi-hole data model: `src/holes/hNN.js` per hole with a **rotated local frame** (y axis = back tee → green centre), tees placed to match card yardages, pins front/middle/back from the green outline.
- [x] `tools/prep_hole.py NN`: picks the OSM features near the hole's corridor, converts to the hole frame, writes `src/holes/hNN-osm.js`, renders a rotated satellite crop with a 25-yd grid to `.cache/hNN-grid.jpg` for tracing, and a clean crop for the app.
- [x] Port Hole 4 to the new format; results must match v1 within ±0.05 strokes.
- [x] Shot shape in the player model and bag form (CLAUDE.md spec); update `docs/LOGIC.md`.
- [x] Roster from `data/roster.json` preloaded (12 players, Red for the three ladies); strokes per hole from playing handicap + SI.
- [x] App: hole picker (1–18), "Round plan" tab listing the chosen club/aim on every mapped hole; unmapped holes show "coming soon".
- [x] `tools/build.py` → `dist/index.html`; screenshot check; publish to the same artifact URL.

## Batch 1 — Map holes 1–6  ☐
Prompt: `Run Batch 1 from TASKS.md: map holes 1, 2, 3, 5, 6 and re-check 4 using the map-hole skill.`

## Batch 2 — Map holes 7–12  ☐
Prompt: `Run Batch 2 from TASKS.md: map holes 7–12 using the map-hole skill.`

## Batch 3 — Map holes 13–18  ☐
Prompt: `Run Batch 3 from TASKS.md: map holes 13–18 using the map-hole skill.`

## Batch 4 — PDF export & AWS  ☐ (owner will schedule)
Prompt: `Run Batch 4 from TASKS.md.`
- [ ] export-pdf skill: "Export my 18-hole plan" (one page per hole: map, route, club, aim, scores) via client-side PDF (jsPDF from cdnjs).
- [ ] deploy-aws skill: S3 + CloudFront static hosting; needs owner's AWS keys as environment secrets, or hand over a deploy script.

## Later
- [ ] Flyover video per hole (owner to choose tool, e.g. Higgsfield).
- [ ] Calibrate the model against real team scores.
