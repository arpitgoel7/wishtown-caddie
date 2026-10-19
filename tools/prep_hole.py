"""Prepare hole NN for mapping:  python3 tools/prep_hole.py NN [--no-img]
Writes src/holes/hNN-osm.js (OSM water/bunkers/greens near the hole, in the rotated hole frame),
.cache/hNN-grid.jpg (satellite, tee at the bottom, 25-yd grid, OSM outlines + keys) for tracing,
.cache/hNN-clean.jpg (the crop the app embeds), and a stub src/holes/hNN.js if none exists.
Prints the frame, tee positions matched to the card yardages, and front/middle/back pins."""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from geo import ROOT, TEES, course, crop, hole_frame

def pip(x, y, poly):
    inside, j = False, len(poly) - 1
    for i in range(len(poly)):
        (xi, yi), (xj, yj) = poly[i], poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi: inside = not inside
        j = i
    return inside

def centroid(poly):
    a = cx = cy = 0
    for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
        k = x0 * y1 - x1 * y0; a += k; cx += (x0 + x1) * k; cy += (y0 + y1) * k
    if abs(a) < 1e-9: return sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly)
    return cx / (3 * a), cy / (3 * a)

def osm_features(F):
    osm = json.load(open(f'{ROOT}/data/osm_golf_features.json'))
    L = F['length']; out = []
    for e in osm['elements']:
        if 'geometry' not in e: continue
        g = e.get('tags', {}).get('golf')
        kind = {'water_hazard': 'water', 'lateral_water_hazard': 'water', 'bunker': 'bunker', 'green': 'green'}.get(g)
        if not kind: continue
        pts = [F['to_xy'](p['lat'], p['lon']) for p in e['geometry']]
        if pts[0] == pts[-1]: pts = pts[:-1]
        if not any(abs(x) <= 100 and -30 <= y <= L + 60 for x, y in pts): continue
        out.append({'kind': kind, 'id': e['id'], 'poly': [[round(x, 1), round(y, 1)] for x, y in pts]})
    for f in out: f['c'] = centroid(f['poly'])
    # the hole's own green: contains (or is nearest to) the GPS green centre at (0, L)
    greens = [f for f in out if f['kind'] == 'green']
    own = min(greens, key=lambda f: (not pip(0, L, f['poly']), math.hypot(f['c'][0], f['c'][1] - L))) if greens else None
    keys, n = {}, {'water': 0, 'bunker': 0, 'green': 0}
    for f in sorted(out, key=lambda f: (f['c'][1], f['c'][0])):
        if f is own: f['key'] = 'green'; continue
        n[f['kind']] += 1
        f['key'] = {'water': 'water', 'bunker': 'bunker', 'green': 'otherGreen'}[f['kind']] + str(n[f['kind']])
    return out, own

def pins_from_green(poly):
    cx, cy = centroid(poly)
    ys = [y / 2 for y in range(int(2 * min(p[1] for p in poly)), int(2 * max(p[1] for p in poly)) + 1) if pip(cx, y / 2, poly)]
    a, b = (min(ys), max(ys)) if ys else (cy - 10, cy + 10)
    r = lambda v: round(v)
    return {'Front': {'x': r(cx), 'y': r(a + 0.2 * (b - a))}, 'Middle': {'x': r(cx), 'y': r((a + b) / 2)}, 'Back': {'x': r(cx), 'y': r(a + 0.8 * (b - a))}}

def tees_for(F, mid):
    h = F['hole']; out = {}
    for k, name in enumerate(TEES):
        t, card = h['teeGeoPoints'][2 * k], h['teeYardages'][2 * k]
        px, py = F['to_xy'](t['latitude'], t['longitude'])
        dx, dy = px - mid['x'], py - mid['y']; d = math.hypot(dx, dy)
        if d < 1: dx, dy, d = 0, -1, 1
        out[name] = {'x': round(mid['x'] + dx / d * card), 'y': round(mid['y'] + dy / d * card), 'card': card}
    return out

def view_for(F, own):
    ys = [p[1] for p in own['poly']] if own else [F['length']]
    xs = [p[0] for p in own['poly']] if own else [0]
    x0 = min(-95, 5 * math.floor((min(xs) - 25) / 5)); x1 = max(95, 5 * math.ceil((max(xs) + 25) / 5))
    return {'x0': x0, 'x1': x1, 'y0': -20, 'y1': 5 * math.ceil(max(F['length'] + 55, max(ys) + 35) / 5)}

def clean_tag(fr, v):
    """identifies the clean crop (frame + view), so tools/build.py knows when to re-render it"""
    return json.dumps([round(fr['lat'], 7), round(fr['lon'], 7), round(fr['bearing'], 3)] + [round(v[k]) for k in ('x0', 'x1', 'y0', 'y1')])

def app_ppy(v):
    return min(3.0, 1500 / (v['y1'] - v['y0']))

def grid_image(F, v, feats, tees, pins, path):
    from PIL import ImageDraw
    ppy = 3
    img = crop(F['to_ll'], v['x0'], v['x1'], v['y0'], v['y1'], px_per_yd=ppy)
    d = ImageDraw.Draw(img)
    P = lambda x, y: ((x - v['x0']) * ppy, (v['y1'] - y) * ppy)
    for x in range(25 * math.ceil(v['x0'] / 25), v['x1'] + 1, 25):
        d.line([P(x, v['y0']), P(x, v['y1'])], fill=(255, 255, 255) if x == 0 else (200, 200, 200), width=2 if x == 0 else 1)
        for y in range(0, v['y1'], 100): d.text((P(x, y)[0] + 2, P(x, y)[1] + 2), str(x), fill=(255, 255, 0))
    for y in range(25 * math.ceil(v['y0'] / 25), v['y1'] + 1, 25):
        d.line([P(v['x0'], y), P(v['x1'], y)], fill=(200, 200, 200), width=2 if y % 100 == 0 else 1)
        d.text((P(v['x0'], y)[0] + 3, P(v['x0'], y)[1] - 12), str(y), fill=(255, 255, 0))
    col = {'water': (90, 166, 240), 'bunker': (240, 210, 120), 'green': (124, 252, 154)}
    for f in feats:
        d.line([P(*p) for p in f['poly'] + f['poly'][:1]], fill=col[f['kind']], width=2)
        d.text(P(*f['c']), f['key'], fill=(255, 255, 255))
    for k, t in tees.items():
        d.rectangle([P(t['x'], t['y'])[0] - 4, P(t['x'], t['y'])[1] - 4, P(t['x'], t['y'])[0] + 4, P(t['x'], t['y'])[1] + 4], outline=(255, 255, 255))
        d.text((P(t['x'], t['y'])[0] + 7, P(t['x'], t['y'])[1] - 5), k, fill=(255, 255, 255))
    for k, p in pins.items(): d.ellipse([P(p['x'], p['y'])[0] - 3, P(p['x'], p['y'])[1] - 3, P(p['x'], p['y'])[0] + 3, P(p['x'], p['y'])[1] + 3], outline=(255, 60, 60), width=2)
    img.save(path, 'JPEG', quality=80)

STUB = """// Hole {n} — Jaypee Greens Wish Town. Hole frame: origin = back tee, y = yards toward the green centre, x = yards right.
// Hazards from OpenStreetMap; fairway, trees and OB to be traced from .cache/h{nn}-grid.jpg (±5 yds).  NOT MAPPED YET.
HOLES[{n}] = {{
  number: {n}, par: {par}, si: {si}, mapped: false,
  frame: {frame},
  view: {view},
  tees: {{
{tees}
  }},
  pins: {pins},
  green: OSM[{n}].green,
  fairway: [],
  hazards: [
    // {{ kind: 'ob' | 'water' | 'sand' | 'trees', poly: ..., name: '...', tip: '...' }} — OB first, then water, sand, trees
  ],
  notes: '',
}};
"""

def main():
    n = int(sys.argv[1]); nn = f'{n:02d}'
    crs = course(); F = hole_frame(n, crs); h = F['hole']
    feats, own = osm_features(F)
    pins = pins_from_green(own['poly']) if own else {'Middle': {'x': 0, 'y': round(F['length'])}}
    tees = tees_for(F, pins['Middle']); v = view_for(F, own)
    fr = {'lat': round(F['lat'], 7), 'lon': round(F['lon'], 7), 'bearing': F['bearing']}
    body = ',\n'.join(f"  {f['key']}: {json.dumps(f['poly'], separators=(',', ':'))}" for f in feats)
    feats.sort(key=lambda f: (f['c'][1], f['c'][0]))
    lst = '\n'.join(f"//   {f['key']:<12} {f['kind']:<6} centre ({f['c'][0]:.0f}, {f['c'][1]:.0f})  osm way {f['id']}" for f in feats)
    open(f'{ROOT}/src/holes/h{nn}-osm.js', 'w').write(
        f"// Hole {n}: OpenStreetMap features near the hole (© OpenStreetMap contributors, ODbL), in the hole frame (yards).\n"
        f"// Frame: origin {fr['lat']}, {fr['lon']} (back tee), y axis bearing {fr['bearing']}°. Generated by tools/prep_hole.py.\n{lst}\n"
        f"OSM[{n}] = {{\n{body}\n}};\n")
    stub = f'{ROOT}/src/holes/h{nn}.js'
    if not os.path.exists(stub):
        open(stub, 'w').write(STUB.format(n=n, nn=nn, par=h['menPar'], si=h['menHandicap'], frame=json.dumps(fr).replace('"', ''), view=json.dumps(v).replace('"', ''),
            pins=json.dumps(pins).replace('"', ''), tees='\n'.join(f"    {k}: {json.dumps(t).replace(chr(34), '')}," for k, t in tees.items())))
    print(f'hole {n}: par {h["menPar"]} SI {h["menHandicap"]}  frame {fr}  GPS back tee -> green centre {F["length"]:.0f} yds')
    print('view', v); print('pins', pins); print('tees', tees)
    print(lst.replace('//', ''))
    if '--no-img' not in sys.argv:
        os.makedirs(f'{ROOT}/.cache', exist_ok=True)
        grid_image(F, v, feats, tees, pins, f'{ROOT}/.cache/h{nn}-grid.jpg')
        crop(F['to_ll'], v['x0'], v['x1'], v['y0'], v['y1'], px_per_yd=app_ppy(v)).save(f'{ROOT}/.cache/h{nn}-clean.jpg', 'JPEG', quality=70, optimize=True, progressive=True)
        open(f'{ROOT}/.cache/h{nn}-clean.jpg.tag', 'w').write(clean_tag(fr, v))
        print(f'wrote .cache/h{nn}-grid.jpg and .cache/h{nn}-clean.jpg')

if __name__ == '__main__':
    main()
