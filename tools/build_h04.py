"""Rebuild the published Hole 4 page (v1) -> dist/wishtown-hole4.html. Batch 0 replaces this with a multi-hole build."""
import base64, io, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from geo import frame, crop
R = os.path.join(os.path.dirname(__file__), '..')
course = json.load(open(f'{R}/data/course_18birdies.json'))
tee = course['holes'][3]['teeGeoPoints'][0]
_, to_ll = frame(tee['latitude'], tee['longitude'])
buf = io.BytesIO(); crop(to_ll, -95, 95, -20, 360).save(buf, 'JPEG', quality=70, optimize=True, progressive=True)
sc = {'holes': [{'par': h['menPar'], 'si': h['menHandicap'], 'y': [h['teeYardages'][i] for i in (0, 2, 4, 6)]} for h in course['holes']]}
t = open(f'{R}/src/template.html').read()
t = t.replace('rows.forEach((r, i) => { r.second = i < 4 ? secondShot(sol, H, r) : null; });', 'rows.forEach((r) => { r.second = secondShot(sol, H, r); });')
t = t.replace('stroke="var(--plan)"', 'stroke="#F2C230"').replace('fill="var(--plan)"', 'fill="#F2C230"')
t = t.replace('* { box-sizing: border-box; }', '* { box-sizing: border-box; }\n[hidden] { display: none !important; }', 1)
out = (t.replace('{{GEOM}}', open(f'{R}/src/holes/h04-osm.js').read()).replace('{{HOLE}}', open(f'{R}/src/holes/h04.js').read())
        .replace('{{ENGINE}}', open(f'{R}/src/engine.js').read()).replace('{{IMG}}', base64.b64encode(buf.getvalue()).decode())
        .replace('{{SCORECARD}}', json.dumps(sc)))
os.makedirs(f'{R}/dist', exist_ok=True); open(f'{R}/dist/wishtown-hole4.html', 'w').write(out); print('wrote dist/wishtown-hole4.html', len(out))
