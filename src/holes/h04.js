// Hole 4 — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway & tree areas traced from satellite imagery (±5 yds). Ported from v1 (north-up) by rotation.
HOLES[4] = {
  number: 4, par: 4, si: 15, mapped: true,
  frame: { lat: 28.516547, lon: 77.3621105, bearing: -4.373 },
  view: { x0: -95, x1: 95, y0: -20, y1: 360 },
  tees: {
    Black: { x: 4, y: 11, card: 294 },
    Blue: { x: 4, y: 11, card: 294 },
    White: { x: 7, y: 41, card: 264 },
    Red: { x: 6, y: 59, card: 246 },
  },
  pins: { Front: { x: -2, y: 296 }, Middle: { x: -2, y: 306 }, Back: { x: 0, y: 316 } },
  green: OSM[4].green,
  fairway: [[-6,126],[31,123],[38,163],[42,195],[45,252],[38,262],[21,269],[-1,271],[-4,263],[17,256],[16,237],[0,233],[-5,201],[-7,161]],
  hazards: [
    { kind: 'ob', poly: [[-111,119],[-76,116],[-56,385],[-91,388]], name: 'Out of bounds, left', tip: 'The houses down the left, beyond the trees past about 150 yds. Stroke and distance.' },
    { kind: 'water', poly: OSM[4].water1, name: 'Pond in front of the tee', tip: 'Penalty area. Only a topped or thin tee shot finds it, but from the back tees it sits across the right half of the line.' },
    { kind: 'water', poly: OSM[4].water2, name: 'Pond right of the fairway', tip: 'Penalty area. It catches long tee shots that leak right.' },
    { kind: 'sand', poly: OSM[4].bunker10, name: 'Front greenside bunker', tip: 'Guards the front and centre of the green. Front pins sit right behind it.' },
    { kind: 'sand', poly: OSM[4].bunker11, name: 'Bunker behind the green', tip: 'Catches approaches that fly long.' },
    { kind: 'sand', poly: OSM[4].bunker9, name: 'Bunker right of the green', tip: 'Neighbouring: belongs to the next green, but in play if you bail out right.' },
    { kind: 'trees', poly: [[-19,62],[-53,64],[-42,244],[-18,238],[-9,216],[-12,141]], name: 'Trees and cart path, left', tip: 'Usually a punch-out back to the fairway.' },
    { kind: 'trees', poly: [[-16,238],[13,238],[17,249],[5,258],[-14,258]], name: 'Tree clump at the corner, left', tip: 'Blocks the left side of the landing area for longer hitters.' },
    { kind: 'trees', poly: [[32,131],[70,125],[81,144],[77,190],[55,196],[43,189],[35,158]], name: 'Trees between the ponds, right', tip: 'Blocks the approach from the right rough.' },
  ],
  notes: 'Tee yardages follow the official card. The GPS distance from the back of the tee box to the centre of the green is about 306.',
};
