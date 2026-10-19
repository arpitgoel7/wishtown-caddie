// Hole 6 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[6] = {
  number: 6, par: 4, si: 1, mapped: true,
  frame: {lat: 28.5215815, lon: 77.3613906, bearing: 18.181},
  view: {x0: -95, x1: 95, y0: -20, y1: 455},
  tees: {
    Black: {x: 0, y: -2, card: 400},
    Blue: {x: -13, y: 25, card: 373},
    White: {x: -8, y: 58, card: 340},
    Red: {x: -16, y: 75, card: 323},
  },
  pins: {Front: {x: -3, y: 388}, Middle: {x: -3, y: 398}, Back: {x: -3, y: 408}},
  green: OSM[6].green,
  fairway: [[-35,185],[5,185],[35,195],[40,225],[35,300],[25,340],[15,380],[-12,382],[-18,350],[-25,320],[-40,300],[-45,240]],
  hazards: [
    { kind: 'ob', poly: [[-110,-20],[-72,-20],[-78,130],[-78,460],[-110,460]], name: 'Out of bounds, left', tip: 'The boundary beyond the trees and cart path on the left.' },
    { kind: 'water', poly: OSM[6].water1, name: 'Pond in front of the tees', tip: 'Penalty area. Sits on the line from the tee; about 155 yds to carry from Blue. Aim right of it if you cannot carry it comfortably.' },
    { kind: 'water', poly: OSM[6].water2, name: 'Pond right of the landing area', tip: 'Penalty area. From about 225 to 300 yds on the right; catches a long drive that fades.' },
    { kind: 'water', poly: OSM[6].water3, name: 'Pond short left of the green', tip: 'Penalty area. Catches a pulled or short-left approach. Miss right.' },
    { kind: 'sand', poly: OSM[6].bunker7, name: 'Fairway bunker, centre (260)', tip: 'In the middle of the landing area.' },
    { kind: 'sand', poly: OSM[6].bunker8, name: 'Fairway bunker, centre (275)', tip: 'In the middle of the landing area, just past the first.' },
    { kind: 'sand', poly: [[5,210],[17,216],[16,208],[8,205]], name: 'Fairway bunker, right-centre (210)', tip: 'Small bunker (traced from imagery; not in OpenStreetMap).' },
    { kind: 'sand', poly: OSM[6].bunker6, name: 'Bunker right (200)', tip: 'Wide right, short of the pond.' },
    { kind: 'sand', poly: OSM[6].bunker11, name: 'Bunker left of the green', tip: 'Between the green and the pond.' },
    { kind: 'sand', poly: OSM[6].bunker10, name: 'Bunker right of the green', tip: 'Catches the bail-out away from the pond.' },
    { kind: 'sand', poly: OSM[6].bunker12, name: 'Bunker beyond the right bunker', tip: 'Neighbouring: belongs to the next green, but in play for a big miss right.' },
    { kind: 'trees', poly: [[-75,40],[-48,40],[-45,120],[-50,200],[-50,300],[-55,400],[-75,450]], name: 'Trees and cart path, left', tip: 'A punch-out back to the fairway.' },
    { kind: 'trees', poly: [[60,120],[95,120],[95,330],[70,330],[65,225]], name: 'Trees, right', tip: 'Scattered trees right of the pond.' },
  ],
  notes: 'Tee yardages follow the official card. The hardest hole on the course (SI 1): carry the pond off the tee, avoid the pond right of the landing area, and keep the approach right of the pond by the green.',
};
