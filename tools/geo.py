"""Shared geo helpers: hole frame <-> lat/lon, Esri tile crops.
Hole frame: origin = the hole's back-tee GPS point, y = yards along the line back tee -> green centre,
x = yards right of that line. `frame(lat0, lon0)` is the un-rotated (north-up) frame used by Hole 4 v1."""
import json, math, os, subprocess
from PIL import Image
YD = 1.09361
TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
ROOT = os.path.join(os.path.dirname(__file__), '..')
CACHE = os.path.join(ROOT, '.cache', 'tiles')
TEES = ['Black', 'Blue', 'White', 'Red']  # 18Birdies order (men's index 0, 2, 4, 6)

def frame(lat0, lon0, bearing=0.0):
    """bearing = compass direction (deg) of the +y axis. Returns (to_xy, to_ll)."""
    kx = 111320 * math.cos(math.radians(lat0)) * YD; ky = 110574 * YD
    c, s = math.cos(math.radians(bearing)), math.sin(math.radians(bearing))
    def to_xy(lat, lon):
        e, n = (lon - lon0) * kx, (lat - lat0) * ky
        return e * c - n * s, e * s + n * c
    def to_ll(x, y):
        e, n = x * c + y * s, -x * s + y * c
        return lat0 + n / ky, lon0 + e / kx
    return to_xy, to_ll

def course():
    return json.load(open(os.path.join(ROOT, 'data', 'course_18birdies.json')))

def hole_frame(n, crs=None):
    """Rotated frame for hole n (1-based): origin back tee, y toward the green centre. Returns dict."""
    h = (crs or course())['holes'][n - 1]
    t = h['teeGeoPoints'][0]
    g = [p for p in h['greens'][0]['geoPoints'][2:5] if p]
    gc = h['greens'][0]['geoPoints'][3] or {'latitude': sum(p['latitude'] for p in g) / len(g), 'longitude': sum(p['longitude'] for p in g) / len(g)}
    xy0, _ = frame(t['latitude'], t['longitude'])
    e, nn = xy0(gc['latitude'], gc['longitude'])
    bearing = math.degrees(math.atan2(e, nn))
    to_xy, to_ll = frame(t['latitude'], t['longitude'], bearing)
    return {'lat': t['latitude'], 'lon': t['longitude'], 'bearing': round(bearing, 3), 'to_xy': to_xy, 'to_ll': to_ll,
            'length': math.hypot(e, nn), 'hole': h}

def merc(lat, lon, z):
    n = 2 ** z
    return (lon + 180) / 360 * n * 256, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n * 256

def tile(z, x, y):
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, f'{z}_{x}_{y}.jpg')
    if not os.path.exists(f):
        subprocess.run(['curl', '-sS', '--max-time', '30', '-o', f, TILE_URL.format(z=z, x=x, y=y)], check=True)
    return Image.open(f)

def crop(to_ll, xmin, xmax, ymin, ymax, z=19, px_per_yd=3):
    """Satellite crop of the local box (any rotation), top = ymax, left = xmin, at px_per_yd."""
    W, H = int((xmax - xmin) * px_per_yd), int((ymax - ymin) * px_per_yd)
    corners = [merc(*to_ll(x, y), z) for x, y in ((xmin, ymax), (xmax, ymax), (xmin, ymin), (xmax, ymin))]
    X0, Y0 = int(min(c[0] for c in corners) // 256), int(min(c[1] for c in corners) // 256)
    X1, Y1 = int(max(c[0] for c in corners) // 256), int(max(c[1] for c in corners) // 256)
    img = Image.new('RGB', ((X1 - X0 + 1) * 256, (Y1 - Y0 + 1) * 256))
    for X in range(X0, X1 + 1):
        for Y in range(Y0, Y1 + 1):
            img.paste(tile(z, X, Y), ((X - X0) * 256, (Y - Y0) * 256))
    (ax, ay), (bx, by), (cx, cy) = [(c[0] - X0 * 256, c[1] - Y0 * 256) for c in corners[:3]]
    # output pixel (u, v) -> mosaic pixel; mercator is linear enough over one hole
    data = ((bx - ax) / W, (cx - ax) / H, ax, (by - ay) / W, (cy - ay) / H, ay)
    return img.transform((W, H), Image.AFFINE, data, resample=Image.BICUBIC)
