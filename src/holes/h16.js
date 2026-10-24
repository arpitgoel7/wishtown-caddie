// Hole 16 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[16] = {
  number: 16, par: 3, si: 14, mapped: true,
  frame: {lat: 28.5265227, lon: 77.3540582, bearing: -154.024},
  view: {x0: -95, x1: 95, y0: -20, y1: 240},
  tees: {
    Black: {x: 1, y: -2, card: 181},
    Blue: {x: 8, y: 22, card: 157},
    White: {x: 8, y: 22, card: 157},
    Red: {x: 14, y: 61, card: 116},
  },
  pins: {Front: {x: 12, y: 166}, Middle: {x: 12, y: 178}, Back: {x: 12, y: 190}},
  green: [[0,160],[15,157],[25,165],[27,185],[20,200],[5,203],[-5,195],[-3,175]],
  fairway: [[-5,100],[25,100],[28,155],[0,158],[-5,125]],
  hazards: [
    { kind: 'ob', poly: [[38,45],[110,45],[110,240],[60,240],[55,100],[38,95]], name: 'Out of bounds, right', tip: 'Tennis court, pool and club buildings beyond the cart path on the right.' },
    { kind: 'water', poly: OSM[16].water1, name: 'Lake left of the green', tip: 'Penalty area all along the left, from 120 to past the green. A pulled tee shot is wet; miss right.' },
    { kind: 'sand', poly: OSM[16].bunker3, name: 'Bunker front left of the green', tip: 'Between the lake and the green; front-left pins sit just past it.' },
    { kind: 'trees', poly: [[30,100],[50,100],[55,200],[35,210],[30,160]], name: 'Trees, right', tip: 'Scattered trees right of the green before the boundary.' },
  ],
  notes: 'Tee yardages follow the official card. A par 3 with a lake along the whole left side; the safe miss is short or right. The green and tees are placed from the imagery (OpenStreetMap includes the approach in the green and tags the tee boxes as greens).',
};
