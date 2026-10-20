# Strategy logic (approved by the owner)

All distances in yards. σ = one standard deviation. `h` = playing handicap (≥0). `conf` = club confidence 1–5 (3 neutral).

## 1. Ball pattern per club
| Element | Rule |
|---|---|
| Carry | Normal(carry, σd), σd = carry × (3% + 0.22%·h) × (1 + 0.15·(3−conf)) |
| Side miss | Normal(bias, σlat). If "± yds" entered: σlat = value × (1 + 0.08·(3−conf)). If "% on target": σlat = hw / z((1+p)/2), hw = 16 woods/driver, 11 irons/hybrids, 9 wedges (×(1+0.08·(3−conf))). Blank: σlat = carry × (5% + 0.28%·h) × (1 + 0.15·(3−conf)) |
| Shot shape (right-handed) | Stock shape per player: draw / straight / fade, curve small / medium / big; any club can override it. The aim is the finishing target, so the average shot ends on the aim line. Misses are lopsided toward the curve side: a split normal with σ×1.3 on the curve side and σ×0.7 on the other, so 65% of misses go the way the ball curves and the average miss distance is unchanged. The plan gives a start line: curve = carry × 3% / 6% / 10% (small / medium / big), start that far right of target for a draw, left for a fade. Straight = symmetric, as before. Pitches and punch-outs are straight |
| Mishit | p = (1.2% + 0.55%·h) × club factor (driver 1.3, wood 1.15, hybrid 1.0, iron 0.9, wedge 0.7) × (1 + 0.25·(3−conf))^1.5, cap 40%. Carry 35–75% of normal, side spread ×1.6, roll ×0.8 + 8 |
| Roll | total − carry, then +8% for a draw, −8% for a fade; ×1 fairway, ×0.55 green, ×0.35 rough; stops in sand/trees; rolling into water = water |
| Next-shot lie | Rough: carry −7%, σlat +15%, σd +25%. Fairway bunker: carry −15%, spreads +30%, no woods / nothing over 175 carry. Trees: punch-outs only (40/70/100 yds, any direction). Driver only from the tee |
| Pitches | 30 yds up to just below the shortest club, every 10 yds; σlat = 6%·d·(1+h/25), σd = 8%·d·(1+h/25) |

## 2. Short game & putting (within 40 yds off the green, or on the green)
Tour baselines (Broadie) plus handicap add-on:
- Off green: + h × 0.020 (fairway), 0.025 (rough), 0.035 (sand); trees = rough + 0.35.
- Putting: + h × (0.004 + 0.00008 × feet).
- Over trouble: from inside 40 yds, if the straight line from the ball to the pin crosses water, sand or trees before it reaches the green (not counting the bunker or trees the ball is already in), add water 0.15 + 0.02·h, sand 0.06 + 0.012·h, trees 0.10 + 0.012·h (each counted once). Before this, any spot within 40 yds was valued by its lie alone, so a pitch over the lake or a bunker looked as easy as an open one. (Added in Batch 1; estimates, to calibrate against real scores.)

## 3. Route optimisation
- Each hole has its own frame: origin at the back tee, y along the line back tee → green centre (18Birdies GPS), x to the right, in yards. Tees sit where tee → middle pin equals the card yardage.
- Hole → 1-yd lie raster (rough, fairway, green, sand, water, trees, OB) from the hazard polygons; overlaps resolve in the order OB, water, sand, green, trees, fairway. Raster and grid cover the hole's map view.
- Dynamic programming on a 5-yd grid × lie: for each spot, every eligible club × aims at the pin ±7°, ±14°; keep the lowest expected strokes. Two sweeps, nearest-to-pin first; the second sweep re-checks only each spot's 4 best clubs from the first (a speed shortcut: on Hole 4 it gives identical results). Samples: 24 good + 6 mishit per action.
- Tee: every full club × 21 aims (±20°, 2° steps) × (400 good + 80 mishit samples). Top 6 + driver are played to the hole 2,500 times each using the stored policy.
- Penalties: water = +1, drop on the line 2 yds behind the entry point. OB = stroke and distance.
- Goals: **Play to handicap safely** = minimise avg + 1.0 × P(net double bogey or worse). **Lowest average** = minimise avg.
- Hazard penalty for the safe goal (Batch 1, currently **off**): the engine can add a fixed cost to every finish in sand, trees, water or OB when it chooses each shot, not just the tee shot (`SAFE_RISK` in `src/engine.js`). Tested at 0.5, 1.0 and 1.5 strokes: only around 1.5 does an 18 handicap lay up on the Hole 2 second shot, and there the average rises (5.69 → 6.03) and double bogey or worse goes up (15% → 23%; 27 hcp 39% → 52%). Smaller values change little and also nudge doubles up. Left at 0 until the owner decides.
- Strokes received on a hole: floor(PH/18) + (PH mod 18 ≥ SI ? 1 : 0), PH = playing handicap; net par = par + strokes.
- Outputs: avg score, P(net par or better), Stableford average (2 + net par − score, floor 0), blow-up risk, water %, landing mix, second shot (and a third on long holes), plus a round plan with the chosen tee club and aim on every mapped hole.

## 4. Known limits
No wind, elevation, firmness, or flight-over-trees checks; water drop zones not modelled; short game personalised only through handicap. Calibration is estimated (18 hcp ≈ 4.6 on Hole 4 looks slightly optimistic) and should be checked against real team scores.

Shot shape assumes a right-handed player. Curve size only sets the start-line advice; the miss pattern (65/35) and roll (±8%) are the same for small, medium and big curves.

## 5. Approved additions
- Shot shape and per-hole strokes: built in Batch 0 (above).
