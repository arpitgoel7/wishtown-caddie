// Hole 8 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[8] = {
  number: 8, par: 4, si: 5, mapped: true,
  frame: {lat: 28.5229799, lon: 77.3626304, bearing: -170.629},
  view: {x0: -95, x1: 95, y0: -20, y1: 480},
  tees: {
    Black: {x: 0, y: -1, card: 423},
    Blue: {x: 0, y: 18, card: 404},
    White: {x: 2, y: 47, card: 375},
    Red: {x: 2, y: 77, card: 345},
  },
  pins: {Front: {x: 5, y: 414}, Middle: {x: 5, y: 422}, Back: {x: 5, y: 431}},
  green: OSM[8].green,
  fairway: [[-20,120],[17,120],[17,230],[18,290],[25,310],[25,395],[5,400],[0,385],[0,302],[-22,295],[-25,240],[-24,180]],
  hazards: [
    { kind: 'ob', poly: [[-110,150],[-62,150],[-62,290],[-110,290]], name: 'Out of bounds, left', tip: 'Open land beyond the cart track and trees on the left. Only a big hook gets there; confirm the line with the club.' },
    { kind: 'sand', poly: [[8,296],[13,293],[20,300],[19,289],[14,285],[11,291]], name: 'Fairway bunker, centre (290)', tip: 'Small bunker in the middle of the fairway where it narrows (traced from imagery; not in OpenStreetMap). A long hitter\'s drive reaches it.' },
    { kind: 'sand', poly: OSM[8].bunker7, name: 'Fairway bunker, left (260)', tip: 'On the left edge of the fairway at driving distance.' },
    { kind: 'sand', poly: OSM[8].bunker9, name: 'Bunker front left of the green', tip: 'Guards the left half of the green; the second shot from the left trees has to carry it.' },
    { kind: 'sand', poly: OSM[8].bunker11, name: 'Bunker behind the green', tip: 'Catches an approach that flies long.' },
    { kind: 'trees', poly: [[-26,110],[-60,110],[-60,300],[-45,300],[-45,388],[-25,395],[-2,385],[0,330],[-2,302],[-24,293],[-26,240]], name: 'Trees and cart path, left', tip: 'A tree strip down the left, then a dense block from 300 to 385 that reaches the middle of the hole. A drive left of centre is blocked out from the green.' },
    { kind: 'trees', poly: [[18,120],[52,120],[52,400],[28,400],[25,310],[20,290],[18,230]], name: 'Tree line, right', tip: 'Continuous tree line between this fairway and the next hole. Usually a chip-out.' },
  ],
  notes: 'Tee yardages follow the official card. A long, narrow par 4 between two tree lines. Past 300 the fairway shifts right of a big tree block on the left, so the second shot is played from the right half.',
};
