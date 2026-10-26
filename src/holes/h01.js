// Hole 1 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[1] = {
  number: 1, par: 4, si: 7, mapped: true,
  frame: {lat: 28.5263417, lon: 77.3604243, bearing: -148.429},
  view: {x0: -95, x1: 95, y0: -20, y1: 505},
  // Tees are currently played about 25 yds past the end of the pond (owner, Oct 2026), so every colour plays from
  // the same spot, about 260 yds to the middle pin. Official card: Black 454, Blue 410, White 368, Red 312.
  // Card-length positions: Black {x: 0, y: -4}, Blue {x: 1, y: 40}, White {x: -2, y: 82}, Red {x: 2, y: 138}.
  tees: {
    Black: {x: 10, y: 190, card: 260},
    Blue: {x: 10, y: 190, card: 260},
    White: {x: 10, y: 190, card: 260},
    Red: {x: 10, y: 190, card: 260},
  },
  pins: {Front: {x: 1, y: 440}, Middle: {x: 1, y: 450}, Back: {x: 1, y: 461}},
  green: OSM[1].green,
  fairway: [[8,170],[40,172],[45,220],[40,275],[35,320],[15,335],[5,365],[-5,395],[-8,428],[-22,425],[-22,395],[-12,360],[0,330],[10,300],[10,250],[5,200]],
  hazards: [
    { kind: 'ob', poly: [[-110,-20],[-24,-20],[-22,290],[-38,320],[-42,440],[-110,440]], name: 'Out of bounds, left', tip: 'The houses run the full length of the hole on the left. Stroke and distance; the big miss for anyone who hooks it.' },
    { kind: 'water', poly: OSM[1].water1, name: 'Pond behind the tees', tip: 'Penalty area, but behind the tees as they are set now (about 25 yds past its far end), so out of play.' },
    { kind: 'water', poly: OSM[1].water2, name: 'Lake right of the green', tip: 'Penalty area. Hugs the whole right side of the green; anything pushed or faded long on the approach is wet.' },
    { kind: 'sand', poly: OSM[1].bunker9, name: 'Bunker short left of the green', tip: 'The safe bail-out side away from the lake, but this bunker catches it.' },
    { kind: 'sand', poly: OSM[1].bunker10, name: 'Bunker left of the green', tip: 'Small pot beside the back half of the green.' },
    { kind: 'sand', poly: OSM[1].bunker5, name: 'Bunker beside the other green', tip: 'Neighbouring: belongs to the green in the middle of the hole, but in play for a lay-up at about 345.' },
    { kind: 'trees', poly: [[-22,175],[5,175],[12,250],[17,260],[17,300],[8,330],[-24,330],[-24,250]], name: 'Tree line, left', tip: 'Thick trees between the fairway and the houses. Usually a chip-out sideways.' },
    { kind: 'trees', poly: [[30,165],[50,165],[50,215],[30,210]], name: 'Tree clumps in the fairway, right (165–215)', tip: 'Small trees in the right half of the landing area; a weak drive or lay-up on the right can be stymied.' },
    { kind: 'trees', poly: [[32,347],[80,347],[80,377],[32,377]], name: 'Trees around the other green, right', tip: 'Scattered trees right of the line at about 350–375; stay left of them on the approach.' },
    { kind: 'trees', poly: [[42,185],[95,185],[95,335],[70,330],[50,310],[45,260],[48,220]], name: 'Scattered trees, right', tip: 'Open enough to find a gap, but a fade that runs on is blocked from the green.' },
  ],
  notes: 'The tees are currently set about 25 yds past the end of the pond, so the hole plays about 260 yds from every tee (official card: Blue 410, Red 312). Another hole\'s green sits in the corridor at about 345 (right of the line): if you land on it, take relief. The approach is played between the cart path on the left and the lake on the right.',
};
