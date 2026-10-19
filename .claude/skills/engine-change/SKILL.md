---
name: engine-change
description: Rules for changing the strategy model in src/engine.js (shot shape, handicap effects, penalties, objectives).
---

# Changing the engine

- The owner approved the logic in `docs/LOGIC.md`. Any change that alters recommendations must be described in plain words to the owner **before** building, unless it was already approved (shot shape and per-hole strokes are approved).
- Update `docs/LOGIC.md` in the same commit as the code.
- Regression: run `node tools/test_engine.js` before and after. Hole 4 benchmarks with sample bags (Blue, middle pin): scratch ≈ 3.8, 9 hcp ≈ 4.2, 18 hcp ≈ 4.6, 27 hcp ≈ 5.0; ladies Red 18 hcp ≈ 4.5. A move of more than 0.1 needs an explanation.
- Keep one solve under ~3 s in node. Samples, aims and grid size in `engine.js` are the speed levers.
- Keep the engine free of DOM code; it runs inside a Web Worker built from the page's script tags.
