---
name: export-pdf
description: Add the "Export my 18-hole plan" PDF to the hosted app (Batch 4). Only works once the app is on AWS; claude.ai artifacts block downloads.
---

# PDF export (route B, approved)

- Client-side only: load jsPDF (UMD, pinned exact version) from cdnjs. No server.
- Cover page: player, tee, playing handicap, strokes per hole, expected round score and Stableford.
- One page per hole: rotated satellite map with route and shot dots (render the SVG to canvas), tee club + aim, second shot, net par, likely scores, key hazards with reach/carry.
- Compute all 18 holes in the worker first (show progress), then build the PDF.
- File name: `Wishtown-<Player>-plan.pdf`.
