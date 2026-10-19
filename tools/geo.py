"""Shared geo helpers: local yard frame <-> lat/lon, Esri tile mosaics. Local frame: origin = hole's back-tee GPS point,
x = yards right (east for an un-rotated hole), y = yards toward the green (north). Batch 0 adds rotation per hole."""
import math, os, subprocess
from PIL import Image
YD = 1.09361
TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
CACHE = os.path.join(os.path.dirname(__file__), '..', '.cache', 'tiles')

def frame(lat0, lon0):
    kx = 111320 * math.cos(math.radians(lat0)) * YD; ky = 110574 * YD
    to_xy = lambda lat, lon: ((lon - lon0) * kx, (lat - lat0) * ky)
    to_ll = lambda x, y: (lat0 + y / ky, lon0 + x / kx)
    return to_xy, to_ll

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
    """North-up satellite crop covering the local box, resized to px_per_yd."""
    a = merc(*to_ll(xmin, ymax), z); b = merc(*to_ll(xmax, ymin), z)
    X0, Y0, X1, Y1 = int(a[0] // 256), int(a[1] // 256), int(b[0] // 256), int(b[1] // 256)
    img = Image.new('RGB', ((X1 - X0 + 1) * 256, (Y1 - Y0 + 1) * 256))
    for X in range(X0, X1 + 1):
        for Y in range(Y0, Y1 + 1):
            img.paste(tile(z, X, Y), ((X - X0) * 256, (Y - Y0) * 256))
    box = tuple(int(round(v)) for v in (a[0] - X0 * 256, a[1] - Y0 * 256, b[0] - X0 * 256, b[1] - Y0 * 256))
    return img.crop(box).resize((int((xmax - xmin) * px_per_yd), int((ymax - ymin) * px_per_yd)), Image.LANCZOS)
