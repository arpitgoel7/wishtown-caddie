// Hole 18 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[18] = {
  number: 18, par: 4, si: 10, mapped: true,
  frame: {lat: 28.5236614, lon: 77.3574252, bearing: 34.997},
  view: {x0: -95, x1: 95, y0: -20, y1: 435},
  tees: {
    Black: {x: 0, y: 1, card: 378},
    Blue: {x: -3, y: 22, card: 357},
    White: {x: -3, y: 22, card: 357},
    Red: {x: 1, y: 54, card: 325},
  },
  pins: {Front: {x: -2, y: 368}, Middle: {x: -2, y: 379}, Back: {x: -2, y: 390}},
  green: OSM[18].green,
  fairway: [[-26,100],[5,100],[5,212],[22,225],[25,290],[20,330],[12,362],[-5,362],[-22,335],[-27,250],[-27,180]],
  hazards: [
    { kind: 'ob', poly: [[-110,-20],[-50,-20],[-50,200],[-40,200],[-40,340],[-60,345],[-60,440],[-110,440]], name: 'Out of bounds, left', tip: 'Houses, then the clubhouse works beyond the cart path. Stroke and distance for a hook.' },
    { kind: 'water', poly: OSM[18].water1, name: 'Pond right of the tees', tip: 'Penalty area wide right of the tees; only a shank or a big slice.' },
    { kind: 'water', poly: OSM[18].water2, name: 'Lake right of the green', tip: 'Penalty area from 290 to past the green on the right. A pushed approach is wet; the bail-out is left.' },
    { kind: 'sand', poly: OSM[18].bunker5, name: 'Fairway bunker, left (255–275)', tip: 'Left edge of the fairway at driving distance.' },
    { kind: 'sand', poly: OSM[18].bunker6, name: 'Bunker, left (320)', tip: 'Left of the approach about 55 yds short.' },
    { kind: 'sand', poly: OSM[18].bunker7, name: 'Bunker right of the green', tip: 'Between the green and the lake.' },
    { kind: 'trees', poly: [[5,98],[45,98],[45,140],[40,212],[25,215],[5,212]], name: 'Tree band, right of centre (100–212)', tip: 'Trees come to within a few yards of the centre line. A drive pushed right is blocked; aim down the left half.' },
    { kind: 'trees', poly: [[30,215],[62,212],[62,290],[30,290],[27,250]], name: 'Scattered trees, right (215–290)', tip: 'Between the fairway and the lake; often a punch-out.' },
    { kind: 'trees', poly: [[-27,90],[-50,90],[-50,200],[-38,200],[-38,340],[-30,345],[-28,250]], name: 'Trees and cart path, left', tip: 'A strip before the boundary.' },
  ],
  notes: 'Tee yardages follow the official card. A straight finishing hole: trees right of centre for the drive and a lake right of the green, OB down the left. Drive down the left half and keep the approach left of the flag.',
};
