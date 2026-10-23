// Hole 9 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[9] = {
  number: 9, par: 3, si: 11, mapped: true,
  frame: {lat: 28.5208835, lon: 77.3627678, bearing: -171.387},
  view: {x0: -95, x1: 95, y0: -20, y1: 250},
  tees: {
    Black: {x: 0, y: 3, card: 186},
    Blue: {x: 3, y: 29, card: 160},
    White: {x: 3, y: 49, card: 140},
    Red: {x: 3, y: 49, card: 140},
  },
  pins: {Front: {x: 6, y: 175}, Middle: {x: 6, y: 189}, Back: {x: 6, y: 203}},
  green: OSM[9].green,
  fairway: [[-20,95],[25,95],[25,150],[12,163],[-12,160],[-25,130]],
  hazards: [
    { kind: 'sand', poly: OSM[9].bunker2, name: 'Bunker short left of the green', tip: 'Guards the front-left; a short, pulled tee shot finds it.' },
    { kind: 'sand', poly: [[-15,195],[-10,197],[-8,185],[-8,178],[-12,177],[-15,185]], name: 'Bunker left of the green', tip: 'Small bunker beside the middle and back of the green (traced from imagery; not in OpenStreetMap).' },
    { kind: 'sand', poly: OSM[9].bunker4, name: 'Bunker right of the green', tip: 'Right beside the green; catches a pushed tee shot to a middle pin.' },
    { kind: 'trees', poly: [[-45,0],[-95,0],[-95,215],[-40,215],[-38,150],[-45,100]], name: 'Trees, left', tip: 'Beyond the cart path; only a badly pulled tee shot.' },
    { kind: 'trees', poly: [[25,60],[45,60],[52,100],[48,140],[28,140],[25,100]], name: 'Tree clump, right', tip: 'Short right of the green; catches a weak slice.' },
  ],
  notes: 'Tee yardages follow the official card. A short par 3 to a long, narrow green (about 40 yds deep, 15 wide) guarded by bunkers on both sides. Club for the pin: front to back is three clubs.',
};
