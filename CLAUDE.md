# Wish Town Caddie

Personal hole-by-hole strategy app for the **AAA Titans** league team at **Jaypee Greens Wish Town, Noida** (par 71, 18 holes). Owner: Arpit Goel.

Goals, in order: (1) let each player see every hole, (2) show where the hazards are, (3) give each player the safest route to play to their handicap.

## Ground rules (agreed with the owner)
- **Yards everywhere.** Card yardages are the official ones; geometry comes from GPS/satellite.
- **Tees:** men play Blue (Black exists). Ladies play **Red** (Anoop Singh, Nyra Singh, Gunjan Bijlani). White exists but no one on the team plays it.
- **Handicaps in `data/roster.json` are PLAYING handicaps.** Strokes on a hole: `floor(PH/18) + (PH % 18 >= SI ? 1 : 0)`. Men and ladies share the stroke index.
- **Strategy logic is approved as written in `docs/LOGIC.md`.** Any change to the model must update that doc and be explained to the owner first.
- **Shot shape (approved, to build in Batch 0):** stock shape per player (draw/straight/fade + small/medium/big curve), optional per-club override, lopsided misses (~65/35 toward the curve side), roll ±8% (draw/fade), aim start-line so the stock curve finishes on target. Replaces "usual miss".
- **PDF route B:** "Export my 18-hole plan" button in the hosted app (needs AWS hosting; claude.ai artifacts block downloads/print).
- **Hosting:** AWS S3 + CloudFront later (Batch 4). No shared backend; each player's bag stays in their browser.
- **Usage matters:** the owner shares a usage budget with Cowork. Work in the batches in `TASKS.md`, one fresh session per batch, and stop at the end of the batch.
- **Flyover video:** last stage, not planned yet.

## Data sources
| What | File | Source |
|---|---|---|
| Scorecard (par, SI, yardages for Black/Blue/White/Red), tee & green GPS points per hole | `data/course_18birdies.json` | 18Birdies public page (personal data stripped) |
| Ratings Oct 2025 | in the same file | India Golf Weekly: Black men 71.2/130, White ladies 73.8/133, Red ladies 70.6/122, Blue men not published |
| Bunkers, water, greens (complete: 80 bunkers / 12 water = club's 62+18 / 9+3) | `data/osm_golf_features.json` | OpenStreetMap (ODbL, credit it) |
| Satellite imagery | fetched on demand into `.cache/tiles` (git-ignored) | Esri World Imagery (credit "© Esri, Maxar, Earthstar Geographics") |
| Fairway, tree lines, OB | traced by hand per hole into `src/holes/hNN.js` | from the imagery, ±5 yds |

The OSM extract covers bbox 28.48–28.56 N, 77.33–77.40 E. Overpass mirror that worked: `https://maps.mail.ru/osm/tools/overpass/api/interpreter` (overpass-api.de resets connections from this environment).

## Code map
- `src/engine.js` — strategy engine (lie raster, player model, 5-yd dynamic programming, tee-option search, playouts). Runs in a Web Worker in the page.
- `src/holes/h04.js`, `h04-osm.js` — Hole 4 definition (local yard frame from the back tee; x right, y toward green).
- `src/template.html` — the single-page app (map, Game plan / My bag / Hazards / Scorecard tabs).
- `tools/geo.py` — local frame ⇄ lat/lon, Esri tile crops. `tools/build_h04.py` — rebuilds the v1 Hole 4 page to `dist/`.
- `tools/test_engine.js` — sanity run across handicaps (expect scratch ≈3.8, 18 hcp ≈4.6 on Hole 4). `tools/screenshot.js <html>` — headless check (Playwright + preinstalled Chromium).
- `docs/hole4-v1-published.html` — the version the owner approved. Published artifact: https://claude.ai/artifact/Qf7H6fiTVYjkjvjcrEqpMP

## Conventions
- Engine solve must stay under ~3 s in node for one hole/player (phones).
- Match the existing code style; keep the page a single self-contained HTML file.
- Never put model identifiers in commits.
