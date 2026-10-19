// Hole 5 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[5] = {
  number: 5, par: 4, si: 9, mapped: true,
  frame: {lat: 28.518502, lon: 77.3614772, bearing: 5.227},
  view: {x0: -95, x1: 95, y0: -20, y1: 470},
  tees: {
    Black: {x: 0, y: 1, card: 410},
    Blue: {x: -17, y: 34, card: 377},
    White: {x: -13, y: 78, card: 333},
    Red: {x: -13, y: 94, card: 317},
  },
  pins: {Front: {x: -3, y: 400}, Middle: {x: -3, y: 411}, Back: {x: -3, y: 422}},
  green: OSM[5].green,
  fairway: [[-25,110],[0,110],[5,180],[20,200],[25,260],[15,300],[5,330],[5,390],[-15,395],[-22,370],[-25,300],[-28,200]],
  hazards: [
    { kind: 'ob', poly: [[-110,-20],[-50,-20],[-50,380],[-62,400],[-62,480],[-110,480]], name: 'Out of bounds, left', tip: 'Apartments, the club pool and courts beyond the cart path. Stroke and distance for a hook.' },
    { kind: 'sand', poly: [[29,265],[43,264],[38,258],[36,250],[33,258]], name: 'Fairway bunker, right (260)', tip: 'Small bunker on the right edge of the landing area (traced from imagery; not in OpenStreetMap).' },
    { kind: 'sand', poly: OSM[5].bunker8, name: 'Bunker front left of the green', tip: 'Guards the front-left; front pins sit just past it.' },
    { kind: 'sand', poly: OSM[5].bunker10, name: 'Bunker left of the green', tip: 'Catches a pulled approach to a back pin.' },
    { kind: 'sand', poly: OSM[5].bunker9, name: 'Bunker right of the green', tip: 'Catches a pushed approach.' },
    { kind: 'trees', poly: [[-50,100],[-28,100],[-25,200],[-28,300],[-25,390],[-50,390]], name: 'Trees and cart path, left', tip: 'A narrow strip before the boundary; usually a chip-out.' },
    { kind: 'trees', poly: [[10,295],[45,295],[50,385],[20,392],[8,360]], name: 'Trees short right of the green', tip: 'Dense trees close to the line in the last 100 yds; a drive pushed right is blocked out.' },
    { kind: 'trees', poly: [[45,195],[95,195],[95,300],[50,300]], name: 'Trees, right', tip: 'Scattered trees right of the landing area.' },
  ],
  notes: 'Tee yardages follow the official card. A narrow, straight par 4: OB left and trees right, so position off the tee matters more than length.',
};
