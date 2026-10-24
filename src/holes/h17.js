// Hole 17 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[17] = {
  number: 17, par: 4, si: 4, mapped: true,
  frame: {lat: 28.5250235, lon: 77.3525269, bearing: 113.837},
  view: {x0: -95, x1: 95, y0: -20, y1: 430},
  tees: {
    Black: {x: 0, y: 0, card: 390},
    Blue: {x: -5, y: 34, card: 356},
    White: {x: -5, y: 34, card: 356},
    Red: {x: 8, y: 62, card: 325},
  },
  pins: {Front: {x: 2, y: 362}, Middle: {x: 2, y: 374}, Back: {x: 2, y: 387}},
  green: [[-12,350],[5,346],[22,352],[26,368],[20,388],[5,396],[-10,390],[-15,370]],
  fairway: [[-28,86],[18,86],[25,100],[55,100],[58,250],[50,300],[40,330],[25,345],[5,342],[-3,330],[2,260],[15,232],[-15,232],[-28,180]],
  hazards: [
    { kind: 'ob', poly: [[72,-20],[110,-20],[110,440],[60,440],[65,330],[72,200]], name: 'Out of bounds, right', tip: 'Houses beyond the cart path and trees all down the right.' },
    { kind: 'water', poly: OSM[17].water1, name: 'Lake left of the tee shot (65–155)', tip: 'Penalty area on the left of the drive zone. A pull or hook off the tee is wet.' },
    { kind: 'water', poly: OSM[17].water2, name: 'Lake around the green', tip: 'Penalty area wrapping the left, back and right of the green from 225. The approach from the right side plays over its corner; miss short and right.' },
    { kind: 'sand', poly: OSM[17].bunker2, name: 'Fairway bunker, left (150–180)', tip: 'Left side of the landing area, beside the lake.' },
    { kind: 'sand', poly: OSM[17].bunker3, name: 'Fairway bunker, centre (160–180)', tip: 'In the middle of the landing area.' },
    { kind: 'sand', poly: OSM[17].bunker4, name: 'Fairway bunker, left (195)', tip: 'At the end of the lower fairway, in front of the tree line.' },
    { kind: 'sand', poly: OSM[17].bunker5, name: 'Bunker complex short of the green (240–325)', tip: 'A long string of bunkers between the fairway and the green. The approach from the right has to carry it.' },
    { kind: 'sand', poly: OSM[17].bunker6, name: 'Bunker front right of the green', tip: 'Short right of the green.' },
    { kind: 'sand', poly: OSM[17].bunker7, name: 'Pot bunker on the green front', tip: 'Small bunker cut into the front of the green.' },
    { kind: 'trees', poly: [[-45,198],[20,198],[25,215],[15,230],[-45,232]], name: 'Tree line across the hole (200–230)', tip: 'Ends the lower fairway; a long straight drive runs into it. The fairway continues up the right.' },
    { kind: 'trees', poly: [[-40,165],[-95,165],[-95,420],[-38,420],[-40,230]], name: 'Trees, left of the lake', tip: 'Beyond the lake on the left.' },
    { kind: 'trees', poly: [[55,40],[72,40],[72,200],[65,330],[58,330],[58,250],[55,100]], name: 'Tree line, right', tip: 'Between the fairway and the houses.' },
  ],
  notes: 'Tee yardages follow the official card, measured round the dogleg. A dogleg right to a green on a peninsula: lake left of the drive, a tree line across the hole at 200–230, then up the right and in over the bunkers with the lake around the green. The green, fairway and tees are placed from the imagery and 18Birdies (OpenStreetMap tags fairways and tee boxes here as greens).',
};
