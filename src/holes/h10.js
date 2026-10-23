// Hole 10 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[10] = {
  number: 10, par: 4, si: 6, mapped: true,
  frame: {lat: 28.5204465, lon: 77.3629686, bearing: -175.64},
  view: {x0: -95, x1: 95, y0: -20, y1: 480},
  tees: {
    Black: {x: 0, y: 0, card: 420},
    Blue: {x: -2, y: 26, card: 394},
    White: {x: -8, y: 48, card: 372},
    Red: {x: -11, y: 80, card: 340},
  },
  pins: {Front: {x: 2, y: 410}, Middle: {x: 2, y: 420}, Back: {x: 2, y: 428}},
  green: OSM[10].green,
  fairway: [[-30,110],[15,110],[18,200],[5,215],[3,280],[5,340],[-2,395],[-20,400],[-30,360],[-35,300],[-37,230],[-35,170]],
  hazards: [
    { kind: 'ob', poly: [[-110,440],[-30,446],[-25,495],[-110,495]], name: 'Out of bounds, behind the green left', tip: 'Houses beyond the green on the left. Only a long, pulled approach.' },
    { kind: 'water', poly: OSM[10].water1, name: 'Pond right of the landing area (215–275)', tip: 'Penalty area on the right at driving distance. A push or slice off the tee finds it; aim down the left half.' },
    { kind: 'water', poly: OSM[10].water2, name: 'Lake front right of the green', tip: 'Penalty area from 345 right up to the green. An approach from the right has to carry it; bail out left, not right.' },
    { kind: 'sand', poly: OSM[10].bunker8, name: 'Fairway bunker, left (310)', tip: 'Left edge of the fairway; long hitters reach it from the tee, others with a lay-up.' },
    { kind: 'sand', poly: OSM[10].bunker9, name: 'Fairway bunker, left (330)', tip: 'Left edge of the fairway, about 90 yds short of the green.' },
    { kind: 'sand', poly: OSM[10].bunker10, name: 'Bunker, left (375)', tip: 'Catches an approach bailed out left of the lake.' },
    { kind: 'sand', poly: OSM[10].bunker12, name: 'Bunker left of the green', tip: 'The bail-out side of the green; better than the lake.' },
    { kind: 'sand', poly: OSM[10].bunker11, name: 'Bunker right of the green', tip: 'Between the green and the lake.' },
    { kind: 'sand', poly: OSM[10].bunker13, name: 'Bunker behind the green, right', tip: 'Catches a long approach.' },
    { kind: 'trees', poly: [[-38,100],[-95,100],[-95,420],[-40,420],[-40,300],[-27,290],[-27,265],[-40,260],[-40,228],[-15,224],[-15,200],[-38,195]], name: 'Trees and cart path, left', tip: 'Tree line down the left, with clumps reaching into the rough at 200–225 and 265–290.' },
    { kind: 'trees', poly: [[10,340],[25,345],[50,342],[50,280],[30,278],[15,290],[8,310]], name: 'Tree clump between the ponds, right', tip: 'Sits between the two ponds on the right; blocks the approach from the right side.' },
  ],
  notes: 'Tee yardages follow the official card. Water all down the right: a pond at driving distance and a lake in front of the green on the right. The whole hole is played down the left half.',
};
