// Hole 7 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB traced from satellite imagery (±5 yds).
HOLES[7] = {
  number: 7, par: 4, si: 13, mapped: true,
  frame: {lat: 28.524803, lon: 77.3634906, bearing: -151.767},
  view: {x0: -95, x1: 95, y0: -20, y1: 410},
  tees: {
    Black: {x: 0, y: 0, card: 357},
    Blue: {x: 6, y: 37, card: 320},
    White: {x: 16, y: 61, card: 296},
    Red: {x: 15, y: 85, card: 272},
  },
  pins: {Front: {x: 1, y: 351}, Middle: {x: 1, y: 357}, Back: {x: 1, y: 363}},
  green: OSM[7].green,
  fairway: [[-18,110],[45,110],[50,200],[45,240],[36,265],[32,300],[22,330],[-15,330],[-20,300],[-22,270],[-18,230],[-20,200]],
  hazards: [
    { kind: 'water', poly: OSM[7].water2, name: 'Pond in the middle of the fairway (115–215)', tip: 'Penalty area right on the line from the tee. Red and White tees reach it with a drive; play down the right side of it, where the fairway is widest.' },
    { kind: 'water', poly: OSM[7].water3, name: 'Pond right of the green', tip: 'Penalty area from 270 to 345 on the right. Catches a pushed approach or a second shot bailing away from the bunkers.' },
    { kind: 'sand', poly: OSM[7].bunker9, name: 'Fairway bunker, left (235–260)', tip: 'Just past the pond on the left; in range for a good drive.' },
    { kind: 'sand', poly: [[34,242],[38,236],[44,236],[47,247],[40,247]], name: 'Fairway bunker, right (240)', tip: 'Small bunker on the right edge of the landing area (traced from imagery; not in OpenStreetMap).' },
    { kind: 'sand', poly: OSM[7].bunker7, name: 'Bunker, right (175)', tip: 'Wide right in the rough; catches a weak slice.' },
    { kind: 'sand', poly: OSM[7].bunker8, name: 'Bunker, right (190)', tip: 'Wide right in the rough; catches a weak slice.' },
    { kind: 'sand', poly: OSM[7].bunker10, name: 'Bunker, left (290)', tip: 'Left of the approach about 65 yds short of the green.' },
    { kind: 'sand', poly: OSM[7].bunker11, name: 'Bunker front left of the green', tip: 'Guards the front-left; a short approach on the left finds it.' },
    { kind: 'trees', poly: [[-25,100],[-95,100],[-95,290],[-30,290],[-25,250],[-24,200]], name: 'Trees and plots, left', tip: 'Dense trees and a nursery plot left of the pond. Usually a chip-out.' },
    { kind: 'trees', poly: [[55,100],[95,100],[95,265],[62,262],[58,230],[55,200]], name: 'Tree line, right', tip: 'Scattered trees right of the fairway from the tee to the pond by the green.' },
  ],
  notes: 'Tee yardages follow the official card. A pond splits the fairway from 115 to 215, and a second pond sits right of the green. The left boundary beyond the trees is not marked on the imagery.',
};
