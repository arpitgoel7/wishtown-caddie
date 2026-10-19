# Strategy logic (approved by the owner)

All distances in yards. σ = one standard deviation. `h` = playing handicap (≥0). `conf` = club confidence 1–5 (3 neutral).

## 1. Ball pattern per club
| Element | Rule |
|---|---|
| Carry | Normal(carry, σd), σd = carry × (3% + 0.22%·h) × (1 + 0.15·(3−conf)) |
| Side miss | Normal(bias, σlat). If "± yds" entered: σlat = value × (1 + 0.08·(3−conf)). If "% on target": σlat = hw / z((1+p)/2), hw = 16 woods/driver, 11 irons/hybrids, 9 wedges (×(1+0.08·(3−conf))). Blank: σlat = carry × (5% + 0.28%·h) × (1 + 0.15·(3−conf)) |
| Usual miss (to be replaced by shot shape) | bias = ±0.3·σlat |
| Mishit | p = (1.2% + 0.55%·h) × club factor (driver 1.3, wood 1.15, hybrid 1.0, iron 0.9, wedge 0.7) × (1 + 0.25·(3−conf))^1.5, cap 40%. Carry 35–75% of normal, side spread ×1.6, roll ×0.8 + 8 |
| Roll | total − carry; ×1 fairway, ×0.55 green, ×0.35 rough; stops in sand/trees; rolling into water = water |
| Next-shot lie | Rough: carry −7%, σlat +15%, σd +25%. Fairway bunker: carry −15%, spreads +30%, no woods / nothing over 175 carry. Trees: punch-outs only (40/70/100 yds, any direction). Driver only from the tee |
| Pitches | 30 yds up to just below the shortest club, every 10 yds; σlat = 6%·d·(1+h/25), σd = 8%·d·(1+h/25) |

## 2. Short game & putting (within 40 yds off the green, or on the green)
Tour baselines (Broadie) plus handicap add-on:
- Off green: + h × 0.020 (fairway), 0.025 (rough), 0.035 (sand); trees = rough + 0.35.
- Putting: + h × (0.004 + 0.00008 × feet).

## 3. Route optimisation
- Hole → 1-yd lie raster (rough, fairway, green, sand, water, trees, OB) from the hazard polygons.
- Dynamic programming on a 5-yd grid × lie: for each spot, every eligible club × aims at the pin ±7°, ±14°; keep the lowest expected strokes. Two sweeps, nearest-to-pin first. Samples: 24 good + 6 mishit per action.
- Tee: every full club × 21 aims (±20°, 2° steps) × (400 good + 80 mishit samples). Top 6 + driver are played to the hole 2,500 times each using the stored policy.
- Penalties: water = +1, drop on the line 2 yds behind the entry point. OB = stroke and distance.
- Goals: **Play to handicap safely** = minimise avg + 1.0 × P(net double bogey or worse). **Lowest average** = minimise avg.
- Outputs: avg score, P(net par or better), Stableford average (2 + net par − score, floor 0), blow-up risk, water %, landing mix, second shot.

## 4. Known limits
No wind, elevation, firmness, or flight-over-trees checks; water drop zones not modelled; short game personalised only through handicap. Calibration is estimated (18 hcp ≈ 4.6 on Hole 4 looks slightly optimistic) and should be checked against real team scores.

## 5. Approved additions not yet built
- Shot shape (see CLAUDE.md).
- Per-hole strokes from playing handicap and SI for every hole.
