// Hole 14 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[14] = {
  number: 14, par: 4, si: 18, mapped: true,
  frame: {lat: 28.5261185, lon: 77.3571203, bearing: -15.197},
  view: {x0: -95, x1: 95, y0: -20, y1: 360},
  tees: {
    Black: {x: 0, y: 3, card: 288},
    Blue: {x: -30, y: 41, card: 252}, // the team's Blue tee plays from the White markers here (owner, Oct 2026); card Blue = 285 from {x: 0, y: 6}
    White: {x: -30, y: 41, card: 252},
    Red: {x: -30, y: 41, card: 252},
  },
  pins: {Front: {x: -2, y: 282}, Middle: {x: -2, y: 291}, Back: {x: -2, y: 300}},
  green: [[-20,280],[-5,276],[10,278],[18,288],[14,300],[0,306],[-15,304],[-22,292]],
  fairway: [[-72,140],[-35,135],[-25,150],[-22,205],[-10,218],[15,240],[20,262],[0,268],[-30,262],[-50,240],[-60,210],[-75,170]],
  hazards: [
    { kind: 'ob', poly: [[25,0],[110,0],[110,330],[45,330],[40,265],[20,240],[-5,215],[-5,192],[5,150],[10,120],[25,40]], name: 'Out of bounds, right', tip: 'Construction ground and the apartment complex right of the hole. A push off the tee is gone.' },
    { kind: 'water', poly: OSM[14].water1, name: 'Pond left of the tee shot', tip: 'Penalty area from 40 to 130 on the left. From the forward tees it sits right in front of a pulled drive.' },
    { kind: 'sand', poly: OSM[14].bunker2, name: 'Bunker front right of the green', tip: 'Big bunker guarding the front-right; the short approach has to carry it.' },
    { kind: 'sand', poly: OSM[14].bunker3, name: 'Bunker short left of the green', tip: 'Left of the approach.' },
    { kind: 'sand', poly: OSM[14].bunker4, name: 'Bunker left of the green', tip: 'Catches a pulled approach.' },
    { kind: 'sand', poly: OSM[14].bunker5, name: 'Bunker behind the green', tip: 'Catches an approach that flies long.' },
    { kind: 'trees', poly: [[-47,40],[25,40],[20,90],[5,130],[3,150],[-2,205],[-20,205],[-24,150],[-40,135],[-47,100]], name: 'Trees between the tee and the fairway (40–205)', tip: 'The tee shot has to carry this block to reach the fairway on the left. Anything short or straight at the flag finishes in the trees.' },
    { kind: 'trees', poly: [[-75,135],[-95,135],[-95,330],[-55,330],[-55,270],[-62,240],[-75,170]], name: 'Trees and cart path, left', tip: 'Left of the fairway.' },
  ],
  notes: 'Blue plays from the White tee on this hole (252 yds; the card\'s Blue tee is 285). A short par 4 that bends left: carry the trees and the corner of the pond to the fairway on the left, then a short approach over the front-right bunker. Out of bounds (construction and apartments) all down the right. The green and the White/Red tee are placed from the imagery, because OpenStreetMap and 18Birdies disagree with it here; the imagery may predate the new clubhouse works.',
};
