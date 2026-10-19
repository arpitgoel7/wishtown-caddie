// Hole 4 — Jaypee Greens Wish Town. Local yards from the back tee marker: x = right, y = toward green.
// Hazards from OpenStreetMap; fairway & tree areas traced from satellite imagery (±5 yds).
const HOLE4 = {
  number: 4, par: 4, si: 15,
  tees: {
    Black: { x: 3, y: 11, card: 294, label: 'Black (men)' },
    Blue: { x: 3, y: 11, card: 294, label: 'Blue (men)' },
    White: { x: 4, y: 41, card: 264, label: 'White (ladies)' },
    Red: { x: 2, y: 59, card: 246, label: 'Red (ladies)' },
  },
  pins: { Front: { x: -25, y: 295 }, Middle: { x: -25, y: 305 }, Back: { x: -24, y: 315 } },
  geom: OSM_GEOM,
  fairway: [[-16,125],[22,125],[25,165],[27,198],[26,255],[18,264],[0,270],[-22,270],[-24,262],[-3,257],[-2,238],[-18,232],[-20,200],[-19,160]],
  treesLeft: [[-24,60],[-58,60],[-60,240],[-36,236],[-25,215],[-23,140]],
  treesClump: [[-34,236],[-5,238],[-2,250],[-15,258],[-34,256]],
  treesRight: [[22,133],[60,130],[70,150],[62,195],[40,200],[28,192],[23,160]],
  ob: [[-120,110],[-85,110],[-85,380],[-120,380]],
};
HOLE4.features = [
  { lie: 6, poly: HOLE4.ob },
  { lie: 4, poly: OSM_GEOM.pond1 }, { lie: 4, poly: OSM_GEOM.pond2 },
  { lie: 3, poly: OSM_GEOM.bunkerFront }, { lie: 3, poly: OSM_GEOM.bunkerBack }, { lie: 3, poly: OSM_GEOM.bunkerRightGreen },
  { lie: 2, poly: OSM_GEOM.green },
  { lie: 5, poly: HOLE4.treesLeft }, { lie: 5, poly: HOLE4.treesClump }, { lie: 5, poly: HOLE4.treesRight },
  { lie: 1, poly: HOLE4.fairway },
];
