// Hole 12 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[12] = {
  number: 12, par: 5, si: 12, mapped: true,
  frame: {lat: 28.518103, lon: 77.359091, bearing: -17.483},
  view: {x0: -95, x1: 95, y0: -20, y1: 595},
  tees: {
    Black: {x: 0, y: 0, card: 540},
    Blue: {x: 0, y: 15, card: 525},
    White: {x: 4, y: 52, card: 488},
    Red: {x: 4, y: 92, card: 448},
  },
  pins: {Front: {x: 0, y: 531}, Middle: {x: 0, y: 540}, Back: {x: 0, y: 550}},
  green: OSM[12].green,
  fairway: [[-3,110],[20,110],[22,200],[28,250],[35,280],[40,330],[50,350],[35,400],[28,410],[25,470],[5,478],[-10,470],[-12,400],[-3,350],[0,300],[-3,200]],
  hazards: [
    { kind: 'ob', poly: [[-110,-20],[-33,-20],[-33,340],[-45,460],[-60,510],[-110,510]], name: 'Out of bounds, left', tip: 'Houses and the road beyond the tree line for the whole hole. Stroke and distance for a hook.' },
    { kind: 'water', poly: OSM[12].water2, name: 'Lake right of the green', tip: 'Penalty area from 470 to past the green on the right. Lay up left of it and play the third from the left side.' },
    { kind: 'sand', poly: OSM[12].bunker9, name: 'Fairway bunker, left (250)', tip: 'Left edge of the landing area for a good drive.' },
    { kind: 'sand', poly: OSM[12].bunker10, name: 'Fairway bunker, left (290)', tip: 'Left edge of the fairway; long hitters reach it.' },
    { kind: 'sand', poly: OSM[12].bunker11, name: 'Bunker, right (305)', tip: 'Beyond the tree band on the right; for a big slice.' },
    { kind: 'sand', poly: OSM[12].bunker12, name: 'Bunker, right (330)', tip: 'Beyond the tree band on the right.' },
    { kind: 'sand', poly: OSM[12].bunker13, name: 'Lay-up bunker, left (385)', tip: 'Where a lay-up second shot on the left finishes.' },
    { kind: 'sand', poly: OSM[12].bunker14, name: 'Lay-up bunker, left (410)', tip: 'Where a lay-up second shot on the left finishes.' },
    { kind: 'sand', poly: OSM[12].bunker15, name: 'Bunker left of the green', tip: 'The bail-out side, away from the lake.' },
    { kind: 'sand', poly: OSM[12].bunker16, name: 'Bunker right of the green', tip: 'Between the green and the lake.' },
    { kind: 'trees', poly: [[-3,100],[-30,100],[-30,350],[-35,460],[-15,470],[-12,400],[-3,350],[-1,300],[-5,200]], name: 'Trees and cart path, left', tip: 'Tree strip before the boundary; usually a chip-out back to the fairway.' },
    { kind: 'trees', poly: [[16,150],[46,150],[57,200],[63,253],[75,260],[75,325],[55,330],[40,330],[35,280],[28,250],[22,200]], name: 'Tree band, right of centre (150–330)', tip: 'A diagonal band of trees on the right edge of the fairway. A drive pushed right is blocked out.' },
    { kind: 'trees', poly: [[28,405],[63,405],[63,460],[45,465],[28,455]], name: 'Trees in front of the lake (405–460)', tip: 'Block a second shot hit down the right toward the green.' },
  ],
  notes: 'Tee yardages follow the official card. A long par 5 with OB down the whole left and a band of trees right of centre, so the fairway is a corridor down the left half. The lake guards the right of the green: lay up left and pitch on.',
};
