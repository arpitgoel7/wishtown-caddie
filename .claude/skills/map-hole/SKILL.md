---
name: map-hole
description: Map one Wish Town hole (hazards, fairway, trees, OB, tees, pins) into src/holes/hNN.js and verify it. Use for "map hole N" or any Batch 1–3 task.
---

# Map a hole

Read `CLAUDE.md` first. Do one hole at a time and commit after each.

1. `python3 tools/prep_hole.py NN`. It writes `src/holes/hNN-osm.js` (OSM water/bunkers/greens in the hole frame, keys like `water1`, `bunker4`, `green`), `.cache/hNN-grid.jpg` (rotated satellite image, tee at the bottom, 25-yd grid, OSM outlines and keys, tees, pins) and, if missing, a stub `src/holes/hNN.js` with the frame, view, tees (matched to the card) and pins already filled.
2. Look at `.cache/hNN-grid.jpg` once. Confirm which OSM features belong to this hole versus neighbouring holes; drop the rest, but keep neighbouring hazards that are in play (label them "neighbouring").
3. Trace from the grid image, in hole-frame yards: `fairway`, tree areas (`treesLeft`, `treesRight`, clumps), `ob` polygons (houses, boundary roads). Keep polygons to 6–14 points; ±5 yds is fine.
4. Fill `src/holes/hNN.js` using `h04.js` as the template: check the generated tees and pins, add `fairway` and the `hazards` list (`kind` ob / water / sand / trees, `poly` — an `OSM[NN].key` or a traced polygon — `name`, and a short `tip`: what it catches, who it matters to), `notes`, then set `mapped: true`. The engine orders overlaps itself (OB → water → sand → green → trees → fairway). Widen `view` if a dogleg or hazard falls outside it.
5. Verify: `node tools/test_engine.js NN`. Scores should be plausible (par 3: scratch ≈ par, 18 hcp ≈ par+0.8; par 4/5 similar). If a club choice looks odd, check the polygons before touching the engine.
6. `python3 tools/build.py`, render once with `tools/screenshot.js` and look at the map: outlines must sit on the imagery.
7. Commit `Map hole NN` and push.

Budget: about 6–8 tool calls and at most 2 image views per hole. Do not re-view images to double-check.
