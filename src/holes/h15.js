// Hole 15 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[15] = {
  number: 15, par: 4, si: 2, mapped: true,
  frame: {lat: 28.5282732, lon: 77.3560887, bearing: -144.954},
  view: {x0: -95, x1: 95, y0: -20, y1: 435},
  tees: {
    Black: {x: -1, y: 3, card: 372},
    Blue: {x: 1, y: 36, card: 340},
    White: {x: -2, y: 69, card: 304},
    Red: {x: -2, y: 69, card: 304},
  },
  pins: {Front: {x: 8, y: 363}, Middle: {x: 8, y: 375}, Back: {x: 8, y: 387}},
  green: [[-6,358],[8,354],[20,360],[24,375],[20,392],[8,397],[-4,392],[-9,378]],
  fairway: [[-25,80],[25,80],[30,200],[33,260],[30,320],[22,350],[0,352],[-20,345],[-25,300],[-26,215],[-30,180],[-30,120]],
  hazards: [
    { kind: 'ob', poly: [[-110,225],[-45,225],[-45,400],[-110,400]], name: 'Out of bounds, left', tip: 'Houses just beyond the trees on the left from 225 to the green. A pulled approach is in trouble.' },
    { kind: 'ob', poly: [[30,40],[110,40],[110,185],[48,185],[45,95],[30,95]], name: 'Out of bounds, right', tip: 'Tennis court and buildings right of the first 180 yds; only a big slice.' },
    { kind: 'sand', poly: OSM[15].bunker6, name: 'Bunker in the landing area (110–135)', tip: 'Beside a practice green in the middle of the hole; a short tee shot finds it.' },
    { kind: 'sand', poly: OSM[15].bunker5, name: 'Bunker in the landing area (100)', tip: 'Short of the practice green, right of centre.' },
    { kind: 'sand', poly: OSM[15].bunker7, name: 'Bunker, left (150)', tip: 'Left of the practice green.' },
    { kind: 'sand', poly: OSM[15].bunker8, name: 'Bunker left of the green', tip: 'Guards the front-left half of the green.' },
    { kind: 'sand', poly: OSM[15].bunker9, name: 'Bunker back left of the green', tip: 'Catches a pulled approach to a back pin.' },
    { kind: 'trees', poly: [[-17,205],[12,205],[13,220],[0,229],[-15,226]], name: 'Tree clump in the fairway (205–228)', tip: 'Sits in the middle of the fairway just past the cart path. Drives that finish behind it are blocked; play to either side.' },
    { kind: 'trees', poly: [[-35,60],[-70,60],[-70,400],[-28,400],[-26,300],[-27,215],[-32,180]], name: 'Trees, left', tip: 'Dense tree line before the houses; usually a chip-out.' },
    { kind: 'trees', poly: [[33,95],[48,95],[50,185],[62,200],[62,330],[45,355],[33,320],[34,260],[31,210]], name: 'Trees, right', tip: 'Tree line down the right of the second half of the hole.' },
  ],
  notes: 'Tee yardages follow the official card. The hardest hole (SI 2): a practice green with bunkers in the drive zone, a tree clump in the middle of the fairway at 205–228, and OB houses down the left of the approach. The green outline is traced from the imagery (OpenStreetMap includes the approach in it).',
};
