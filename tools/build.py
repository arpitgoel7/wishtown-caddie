"""Build the Wish Town Caddie page -> dist/index.html (single self-contained file).
Embeds every src/holes/hNN*.js, the engine, the roster, the scorecard and one satellite crop per mapped hole."""
import base64, glob, io, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from geo import ROOT, course, crop, frame
from prep_hole import app_ppy, clean_tag

def hole_meta(src):
    """mapped flag, frame and view from a hole file (plain JS object literal, read with regexes)."""
    fr = re.search(r'frame:\s*\{([^}]*)\}', src).group(1); vw = re.search(r'view:\s*\{([^}]*)\}', src).group(1)
    return {'mapped': re.search(r'mapped:\s*true', src) is not None, 'frame': {k: float(re.search(rf'{k}:\s*(-?[\d.]+)', fr).group(1)) for k in ('lat', 'lon', 'bearing')},
            'view': {k: float(re.search(rf'{k}:\s*(-?[\d.]+)', vw).group(1)) for k in ('x0', 'x1', 'y0', 'y1')}}

def hole_image(n, m):
    f = f'{ROOT}/.cache/h{n:02d}-clean.jpg'
    v = m['view']
    tag = clean_tag(m['frame'], v)
    if not os.path.exists(f) or not os.path.exists(f + '.tag') or open(f + '.tag').read() != tag:
        _, to_ll = frame(m['frame']['lat'], m['frame']['lon'], m['frame']['bearing'])
        os.makedirs(f'{ROOT}/.cache', exist_ok=True)
        crop(to_ll, v['x0'], v['x1'], v['y0'], v['y1'], px_per_yd=app_ppy(v)).save(f, 'JPEG', quality=70, optimize=True, progressive=True)
        open(f + '.tag', 'w').write(tag)
    return 'data:image/jpeg;base64,' + base64.b64encode(open(f, 'rb').read()).decode()

def main():
    crs = course()
    files = sorted(glob.glob(f'{ROOT}/src/holes/h[0-9][0-9]-osm.js')) + sorted(glob.glob(f'{ROOT}/src/holes/h[0-9][0-9].js'))
    holes_js = '\n'.join(open(f).read() for f in files)
    imgs = {}
    for f in sorted(glob.glob(f'{ROOT}/src/holes/h[0-9][0-9].js')):
        n = int(os.path.basename(f)[1:3]); m = hole_meta(open(f).read())
        if m['mapped']: imgs[n] = hole_image(n, m)
    sc = {'holes': [{'par': h['menPar'], 'si': h['menHandicap'], 'y': [h['teeYardages'][i] for i in (0, 2, 4, 6)]} for h in crs['holes']]}
    roster = json.load(open(f'{ROOT}/data/roster.json'))
    roster = {'players': [{k: p[k] for k in ('name', 'playingHandicap', 'tee', 'reserve')} for p in roster['players']]}
    t = open(f'{ROOT}/src/template.html').read()
    out = (t.replace('{{HOLES}}', holes_js).replace('{{ENGINE}}', open(f'{ROOT}/src/engine.js').read())
            .replace('{{IMGS}}', json.dumps(imgs)).replace('{{SCORECARD}}', json.dumps(sc)).replace('{{ROSTER}}', json.dumps(roster)))
    os.makedirs(f'{ROOT}/dist', exist_ok=True)
    open(f'{ROOT}/dist/index.html', 'w').write(out)
    print(f'wrote dist/index.html ({len(out) / 1e6:.2f} MB), mapped holes: {sorted(imgs)}')

if __name__ == '__main__':
    main()
