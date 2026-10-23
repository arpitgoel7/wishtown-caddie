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

## Batch 1 — Map holes 1–6  ☑
Prompt: `Run Batch 1 from TASKS.md: map holes 1, 2, 3, 5, 6 and re-check 4 using the map-hole skill.`
- [x] Holes 1, 2, 3, 5, 6 mapped; Hole 4 re-checked (unchanged; scratch 3.75 / 18 hcp 4.56).
- [x] Hole 2 Blue tee moved onto the bank (GPS point fell in the pond); untraced OSM-missing bunkers added on holes 5 and 6.
- [x] `tools/geo.py` retries truncated satellite tiles.
- [ ] Hole 2 solves in ~3–4 s (over the ~3 s budget); owner to decide whether to speed up the engine.
- [ ] Don't re-run `prep_hole.py 04`: the current tool renumbers Hole 4's OSM keys, which `h04.js` relies on.

## Batch 2 — Map holes 7–12  ☑
Prompt: `Run Batch 2 from TASKS.md: map holes 7–12 using the map-hole skill.`
- [x] Holes 7–12 mapped (18 hcp Blue, middle pin: 7 ≈4.66, 8 ≈5.27, 9 ≈3.86, 10 ≈5.31, 11 ≈4.93, 12 ≈6.45).
- [x] Untraced bunkers added from imagery on holes 7 (right, 240), 8 (centre, 290) and 9 (left of green). Tree spines traced on 11 (100–205) and 12 (150–330, 405–460).
- [ ] Hole 12: the left corridor is ~25 yds wide, so for 18+ handicaps the engine drives right into hole 2's fairway (aim hits the +20° search limit) and then brings the lake into play. Owner to confirm that's a real line, or mark it out of play.
- [ ] Left boundaries on holes 7 and 8 are guesses (no houses visible); hole 8 has a small OB box over open land, hole 7 none. Confirm with the club.
- [ ] Hole 12 solve ≈3.0 s (at the budget).

## Batch 3 — Map holes 13–18  ☐
Prompt: `Run Batch 3 from TASKS.md: map holes 13–18 using the map-hole skill.`

## Batch 4 — PDF export & AWS  ☐ (owner will schedule)
Prompt: `Run Batch 4 from TASKS.md.`
- [ ] export-pdf skill: "Export my 18-hole plan" (one page per hole: map, route, club, aim, scores) via client-side PDF (jsPDF from cdnjs).
- [ ] deploy-aws skill: S3 + CloudFront static hosting; needs owner's AWS keys as environment secrets, or hand over a deploy script.

## Later
- [ ] Flyover video per hole (owner to choose tool, e.g. Higgsfield).
- [ ] Calibrate the model against real team scores.
