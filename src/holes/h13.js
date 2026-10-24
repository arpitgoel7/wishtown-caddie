// Hole 13 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[13] = {
  number: 13, par: 3, si: 8, mapped: true,
  frame: {lat: 28.5220591, lon: 77.3570065, bearing: 26.561},
  view: {x0: -95, x1: 95, y0: -20, y1: 285},
  tees: {
    Black: {x: 0, y: 3, card: 224},
    Blue: {x: -6, y: 27, card: 200},
    White: {x: -14, y: 28, card: 200},
    Red: {x: -1, y: 57, card: 170},
  },
  pins: {Front: {x: 2, y: 220}, Middle: {x: 2, y: 227}, Back: {x: 2, y: 235}},
  green: OSM[13].green,
  fairway: [[-35,150],[-5,150],[-5,198],[-25,205],[-35,190]],
  hazards: [
    { kind: 'ob', poly: [[-110,-20],[-65,-20],[-65,285],[-110,285]], name: 'Out of bounds, left', tip: 'Apartment blocks beyond the trees on the left.' },
    { kind: 'water', poly: OSM[13].water1, name: 'Lake in front and right of the green', tip: 'Penalty area from about 85 yds right up to the green on the right. Anything short or pushed is wet; the bail-out is short and left.' },
    { kind: 'sand', poly: OSM[13].bunker5, name: 'Bunker front right of the green', tip: 'Between the green and the lake.' },
    { kind: 'sand', poly: OSM[13].bunker6, name: 'Bunker left of the green', tip: 'Catches a pulled tee shot.' },
    { kind: 'sand', poly: OSM[13].bunker7, name: 'Bunker back left of the green', tip: 'Catches a long tee shot to a back pin.' },
    { kind: 'trees', poly: [[-38,30],[-65,30],[-65,270],[-40,270],[-35,150]], name: 'Trees, left', tip: 'Scattered trees before the boundary.' },
  ],
  notes: 'Tee yardages follow the official card. A long par 3 over the lake: the water sits short and right of the green, so the safe miss is short left, where there is room to chip on.',
};
