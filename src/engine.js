// ===== Hole-strategy engine (coordinates in yards: x = right of tee line, y = toward green) =====
const LIE = { R: 0, F: 1, G: 2, S: 3, W: 4, T: 5, OB: 6 };
const LIE_NAME = ['rough', 'fairway', 'green', 'bunker', 'water', 'trees', 'out of bounds'];

function pip(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// ---- Lie raster (1 yd) ----
const RX0 = -110, RX1 = 120, RY0 = -25, RY1 = 375, RW = RX1 - RX0 + 1, RH = RY1 - RY0 + 1;
function buildRaster(hole) {
  const r = new Uint8Array(RW * RH);
  for (let j = 0; j < RH; j++) {
    const y = RY0 + j;
    for (let i = 0; i < RW; i++) {
      const x = RX0 + i;
      let l = LIE.R;
      for (const f of hole.features) if (pip(x, y, f.poly)) { l = f.lie; break; }
      r[j * RW + i] = l;
    }
  }
  return r;
}
function lieAt(H, x, y) {
  const i = Math.round(x) - RX0, j = Math.round(y) - RY0;
  if (i < 0 || j < 0 || i >= RW || j >= RH) return LIE.T;
  return H.raster[j * RW + i];
}

// ---- Short game & putting baselines (scratch values, then handicap add-on) ----
const PUTT = [[1, 1.0], [2, 1.01], [3, 1.04], [4, 1.13], [5, 1.23], [6, 1.34], [8, 1.5], [10, 1.61], [15, 1.78], [20, 1.87], [30, 1.98], [40, 2.06], [50, 2.14], [60, 2.21], [90, 2.4], [120, 2.55]];
const SGT = {
  [LIE.F]: [[0, 2.05], [5, 2.1], [10, 2.18], [20, 2.4], [30, 2.52], [40, 2.6], [50, 2.66]],
  [LIE.R]: [[0, 2.2], [5, 2.25], [10, 2.34], [20, 2.59], [30, 2.7], [40, 2.78], [50, 2.87]],
  [LIE.S]: [[0, 2.3], [5, 2.35], [10, 2.43], [20, 2.53], [30, 2.66], [40, 2.82], [50, 2.92]],
};
const SG_ADD = { [LIE.F]: 0.02, [LIE.R]: 0.025, [LIE.S]: 0.035 };
function interp(t, v) {
  if (v <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) if (v <= t[i][0]) {
    const [a, fa] = t[i - 1], [b, fb] = t[i];
    return fa + ((fb - fa) * (v - a)) / (b - a);
  }
  return t[t.length - 1][1];
}
function puttE(ft, h) { return Math.max(1, interp(PUTT, ft) + h * (0.004 + 0.00008 * Math.min(ft, 90))); }
function sgE(d, lie, h) {
  const L = lie === LIE.T ? LIE.R : (lie === LIE.G ? LIE.F : lie);
  return interp(SGT[L], d) + h * SG_ADD[L] + (lie === LIE.T ? 0.35 : 0);
}
const SG_R = 40; // within this many yards of the pin (off the green) use short-game baseline

// ---- Player model ----
function invNorm(p) { // Acklam approximation
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155211977];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const q = p < 0.5 ? p : 1 - p;
  let x;
  if (q < 0.02425) { const t = Math.sqrt(-2 * Math.log(q)); x = (((((c[0] * t + c[1]) * t + c[2]) * t + c[3]) * t + c[4]) * t + c[5]) / ((((d[0] * t + d[1]) * t + d[2]) * t + d[3]) * t + 1); }
  else { const t = q - 0.5, r = t * t; x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * t) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); return p < 0.5 ? x : -x; }
  return p < 0.5 ? x : -x;
}
function clubKind(name) {
  const n = name.toLowerCase();
  if (n.startsWith('dr')) return 'driver';
  if (/w(ood)?$|^\dw|wood/.test(n)) return 'wood';
  if (/h(ybrid)?$|^\dh|hybrid|rescue/.test(n)) return 'hybrid';
  if (/^(pw|gw|aw|sw|lw)|wedge/.test(n)) return 'wedge';
  return 'iron';
}
function makePlayer(p) {
  const h = Math.max(-5, Math.min(40, +p.hcp || 0));
  const hp = Math.max(0, h);
  const shots = [];
  for (const c of p.clubs) {
    if (!c.on || !(+c.carry > 0)) continue;
    const carry = +c.carry, total = Math.max(carry, +c.total || carry);
    const kind = clubKind(c.name);
    const conf = Math.max(1, Math.min(5, +c.conf || 3));
    const cfSpread = 1 + 0.15 * (3 - conf), cfMis = Math.pow(1 + 0.25 * (3 - conf), 1.5);
    let sLat;
    const acc = +c.acc;
    if (acc > 0 && p.accMode === 'pct') {
      const hw = kind === 'driver' || kind === 'wood' ? 16 : kind === 'wedge' ? 9 : 11;
      const pr = Math.max(0.05, Math.min(0.98, acc / 100));
      sLat = (hw / invNorm((1 + pr) / 2)) * (1 + 0.08 * (3 - conf));
    } else if (acc > 0) {
      sLat = acc * (1 + 0.08 * (3 - conf));
    } else {
      sLat = carry * (0.05 + 0.0028 * hp) * cfSpread;
    }
    const sD = carry * (0.03 + 0.0022 * hp) * cfSpread;
    const kMul = kind === 'driver' ? 1.3 : kind === 'wood' ? 1.15 : kind === 'hybrid' ? 1.0 : kind === 'wedge' ? 0.7 : 0.9;
    const pm = Math.min(0.4, (0.012 + 0.0055 * hp) * kMul * cfMis);
    const bias = p.bias === 'R' ? 0.3 * sLat : p.bias === 'L' ? -0.3 * sLat : 0;
    shots.push({ name: c.name, kind, type: 'full', carry, roll: total - carry, sLat, sD, pm, bias, conf });
  }
  shots.sort((a, b) => b.carry - a.carry);
  // partial pitches below the shortest full club
  const minC = shots.length ? shots[shots.length - 1].carry : 60;
  for (let c = 30; c <= minC - 8; c += 10) {
    const f = 1 + hp / 25;
    shots.push({ name: `${c}-yd pitch`, kind: 'pitch', type: 'pitch', carry: c, roll: 3, sLat: 0.06 * c * f, sD: 0.08 * c * f, pm: 0.02 + 0.004 * hp, bias: 0, conf: 3 });
  }
  // recovery punches from trees
  for (const c of [40, 70, 100]) shots.push({ name: `Punch out (${c} yds)`, kind: 'punch', type: 'punch', carry: c - 20, roll: 20, sLat: 8, sD: 10, pm: 0.05 + 0.003 * hp, bias: 0, conf: 3 });
  return { h: hp, shots };
}

// ---- Deterministic samples ----
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function normals(n, seed) {
  const r = mulberry32(seed), out = [];
  for (let i = 0; i < n; i++) { const u = Math.max(1e-9, r()), v = r(); const m = Math.sqrt(-2 * Math.log(u)); out.push([m * Math.cos(2 * Math.PI * v), m * Math.sin(2 * Math.PI * v), r()]); }
  return out;
}
const S_GOOD = normals(24, 7), S_MIS = normals(6, 11), S_TEE_GOOD = normals(400, 13), S_TEE_MIS = normals(80, 17);

// ---- Shot physics ----
// returns {x,y,lie,pen,ob,landLie} — pen = penalty strokes (water); ob = true means stroke-and-distance
function shoot(H, x, y, lie, s, ang, z, mis) {
  let carry = s.carry, roll = s.roll, sLat = s.sLat, sD = s.sD;
  if (lie === LIE.R && s.type === 'full') { carry *= 0.93; sLat *= 1.15; sD *= 1.25; }
  if (lie === LIE.S && s.type !== 'punch') { carry *= 0.85; sLat *= 1.3; sD *= 1.3; }
  let c, lat;
  if (mis) { c = carry * (0.35 + 0.4 * z[2]); lat = s.bias + z[0] * sLat * 1.6; roll = roll * 0.8 + 8; }
  else { c = carry + z[1] * sD; lat = s.bias + z[0] * sLat; }
  const dx = Math.sin(ang), dy = Math.cos(ang);
  // landing point
  const lx = x + dx * c + dy * lat, ly = y + dy * c - dx * lat;
  let l = lieAt(H, lx, ly);
  if (l === LIE.OB) return { ob: true };
  if (l === LIE.W) return waterDrop(H, x, y, lx, ly);
  if (l === LIE.S || l === LIE.T) return { x: lx, y: ly, lie: l, pen: 0 };
  // roll along the flight direction (slightly drifting with the miss)
  const rm = l === LIE.F ? 1 : l === LIE.G ? 0.55 : 0.35;
  let r = roll * rm, px = lx, py = ly, ux = (lx - x), uy = (ly - y); const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
  while (r > 0) {
    const st = Math.min(3, r); const nx = px + ux * st, ny = py + uy * st; const nl = lieAt(H, nx, ny);
    if (nl === LIE.W) return waterDrop(H, x, y, nx, ny);
    if (nl === LIE.OB) return { ob: true };
    px = nx; py = ny; l = nl; r -= st;
    if (nl === LIE.S || nl === LIE.T) break;
    if (nl === LIE.R) r = Math.min(r, roll * 0.15);
  }
  return { x: px, y: py, lie: l, pen: 0 };
}
function waterDrop(H, x0, y0, wx, wy) {
  // walk back along the line from the water toward the start until dry, then 2 yds more
  const L = Math.hypot(wx - x0, wy - y0) || 1, ux = (x0 - wx) / L, uy = (y0 - wy) / L;
  let px = wx, py = wy, k = 0;
  while (lieAt(H, px, py) === LIE.W && k < 400) { px += ux; py += uy; k++; }
  px += ux * 2; py += uy * 2;
  let l = lieAt(H, px, py); if (l === LIE.W || l === LIE.OB || l === LIE.G) l = LIE.R;
  return { x: px, y: py, lie: l === LIE.F ? LIE.F : l, pen: 1, water: true, wx, wy };
}

// ---- Dynamic programming over a 5-yd grid ----
const GX0 = -75, GX1 = 85, GY0 = -15, GY1 = 345, GS = 5;
const GNX = (GX1 - GX0) / GS + 1, GNY = (GY1 - GY0) / GS + 1;
const DP_LIES = [LIE.R, LIE.F, LIE.S, LIE.T];
const AIM_DP = [-14, -7, 0, 7, 14].map((d) => (d * Math.PI) / 180);

function eligible(s, lie, d) {
  if (s.type === 'punch') return lie === LIE.T;
  if (lie === LIE.T) return false;
  if (s.type === 'pitch') return d < s.carry + 30 && d > s.carry - 25;
  if (s.kind === 'driver') return lie === 'tee';
  if (lie === LIE.S && (s.kind === 'wood' || s.carry > 175)) return false;
  return s.carry <= d + 35;
}

function solve(H, player, pin) {
  const h = player.h, shots = player.shots;
  const V = {}, P = {};
  for (const L of DP_LIES) { V[L] = new Float32Array(GNX * GNY).fill(NaN); P[L] = new Int16Array(GNX * GNY * 2).fill(-1); }
  const cells = [];
  for (let j = 0; j < GNY; j++) for (let i = 0; i < GNX; i++) {
    const x = GX0 + i * GS, y = GY0 + j * GS, d = Math.hypot(x - pin.x, y - pin.y);
    const near = new Set();
    for (let a = -8; a <= 8; a += 2) for (let b = -8; b <= 8; b += 2) near.add(lieAt(H, x + a, y + b));
    const lies = [];
    if (near.has(LIE.R) || near.has(LIE.F) || near.has(LIE.G) || near.has(LIE.W)) lies.push(LIE.R);
    if (near.has(LIE.F) || near.has(LIE.G)) lies.push(LIE.F);
    if (near.has(LIE.S)) lies.push(LIE.S);
    if (near.has(LIE.T) || near.has(LIE.OB)) lies.push(LIE.T);
    for (const L of lies) {
      V[L][j * GNX + i] = initV(d, L, h);
      if (d > SG_R) cells.push({ i, j, x, y, d, L });
    }
  }
  cells.sort((a, b) => a.d - b.d);
  const ctx = { H, V, pin, h };
  for (let sweep = 0; sweep < 2; sweep++) {
    for (const c of cells) {
      const best = bestAction(ctx, shots, c.x, c.y, c.L, c.d, AIM_DP, S_GOOD, S_MIS, V[c.L][c.j * GNX + c.i]);
      V[c.L][c.j * GNX + c.i] = best.v;
      P[c.L][(c.j * GNX + c.i) * 2] = best.s; P[c.L][(c.j * GNX + c.i) * 2 + 1] = best.a;
    }
  }
  return { V, P, pin, h, shots, H, nStates: cells.length };
}
function initV(d, L, h) { return Math.max(2, 2.55 + d / 110 + h * 0.03 + (L === LIE.R ? 0.15 : L === LIE.T ? 0.6 : L === LIE.S ? 0.3 : 0)); }

function valueAt(ctx, x, y, lie) {
  const { pin, h, V } = ctx;
  const d = Math.hypot(x - pin.x, y - pin.y);
  if (lie === LIE.G) return puttE(d * 3, h);
  if (d <= SG_R) return sgE(d, lie, h);
  const L = lie === LIE.F || lie === LIE.R || lie === LIE.S || lie === LIE.T ? lie : LIE.R;
  const fx = Math.max(0, Math.min(GNX - 1.001, (x - GX0) / GS)), fy = Math.max(0, Math.min(GNY - 1.001, (y - GY0) / GS));
  const i = Math.floor(fx), j = Math.floor(fy), tx = fx - i, ty = fy - j;
  const g = (ii, jj) => { let v = V[L][jj * GNX + ii]; if (isNaN(v)) { v = V[LIE.R][jj * GNX + ii] + (L === LIE.T ? 0.5 : L === LIE.S ? 0.3 : L === LIE.F ? -0.15 : 0); } if (isNaN(v)) v = initV(d, L, h) + 0.5; return v; };
  return (g(i, j) * (1 - tx) + g(i + 1, j) * tx) * (1 - ty) + (g(i, j + 1) * (1 - tx) + g(i + 1, j + 1) * tx) * ty;
}

function evalAction(ctx, s, x, y, lie, ang, good, mis, selfV) {
  let eg = 0, em = 0;
  const one = (z, m) => {
    const o = shoot(ctx.H, x, y, lie, s, ang, z, m);
    if (o.ob) return 1 + selfV;
    return o.pen + valueAt(ctx, o.x, o.y, o.lie);
  };
  for (const z of good) eg += one(z, false);
  for (const z of mis) em += one(z, true);
  return 1 + (1 - s.pm) * (eg / good.length) + s.pm * (em / mis.length);
}

function bestAction(ctx, shots, x, y, lie, d, aims, good, mis, selfV) {
  const base = Math.atan2(ctx.pin.x - x, ctx.pin.y - y);
  let best = { v: Infinity, s: -1, a: 0 };
  for (let si = 0; si < shots.length; si++) {
    const s = shots[si];
    if (!eligible(s, lie, d)) continue;
    const aimsUse = s.type === 'punch' ? [-60, -35, -15, 0, 15, 35, 60].map((q) => (q * Math.PI) / 180) : aims;
    for (let ai = 0; ai < aimsUse.length; ai++) {
      const v = evalAction(ctx, s, x, y, lie, base + aimsUse[ai], good, mis, isFinite(selfV) ? selfV : 5);
      if (v < best.v) best = { v, s: si, a: Math.round((aimsUse[ai] * 180) / Math.PI) };
    }
  }
  if (best.s < 0) best = { v: selfV, s: -1, a: 0 };
  return best;
}

// ---- Tee-shot options and full-hole playouts ----
function teeOptions(sol, tee) {
  const ctx = { H: sol.H, V: sol.V, pin: sol.pin, h: sol.h };
  const d = Math.hypot(sol.pin.x - tee.x, sol.pin.y - tee.y);
  const base = Math.atan2(sol.pin.x - tee.x, sol.pin.y - tee.y);
  const out = [];
  for (let si = 0; si < sol.shots.length; si++) {
    const s = sol.shots[si];
    if (s.type !== 'full' || s.carry > d + 35) continue;
    let best = null;
    for (let deg = -20; deg <= 20; deg += 2) {
      const v = evalAction(ctx, s, tee.x, tee.y, 'tee', base + (deg * Math.PI) / 180, S_TEE_GOOD, S_TEE_MIS, 6);
      if (!best || v < best.v) best = { v, deg };
    }
    out.push({ si, shot: s, aimDeg: best.deg, ang: base + (best.deg * Math.PI) / 180, ev: best.v });
  }
  out.sort((a, b) => a.ev - b.ev);
  return out;
}

function policyAt(sol, x, y, lie) {
  const L = DP_LIES.includes(lie) ? lie : LIE.R;
  const i = Math.max(0, Math.min(GNX - 1, Math.round((x - GX0) / GS))), j = Math.max(0, Math.min(GNY - 1, Math.round((y - GY0) / GS)));
  let s = sol.P[L][(j * GNX + i) * 2], a = sol.P[L][(j * GNX + i) * 2 + 1];
  if (s < 0 && L !== LIE.R) { s = sol.P[LIE.R][(j * GNX + i) * 2]; a = sol.P[LIE.R][(j * GNX + i) * 2 + 1]; }
  if (s < 0) { // fall back to the shortest eligible club that gets closest
    const d = Math.hypot(sol.pin.x - x, sol.pin.y - y);
    let bi = -1, bd = 1e9;
    sol.shots.forEach((sh, k) => { if (eligible(sh, lie === LIE.T ? LIE.T : LIE.R, d)) { const e = Math.abs(sh.carry + sh.roll - d); if (e < bd) { bd = e; bi = k; } } });
    s = bi; a = 0;
  }
  return { s, a };
}

function sampleInt(m, rnd) { const k = Math.floor(m); return k + (rnd() < m - k ? 1 : 0); }

function playouts(sol, tee, opt, n, seed) {
  const rnd = mulberry32(seed), ctx = { H: sol.H, V: sol.V, pin: sol.pin, h: sol.h };
  const scores = [], waterCount = [0], firstLand = [];
  const nrm = () => { const u = Math.max(1e-9, rnd()), v = rnd(); const m = Math.sqrt(-2 * Math.log(u)); return [m * Math.cos(2 * Math.PI * v), m * Math.sin(2 * Math.PI * v), rnd()]; };
  for (let k = 0; k < n; k++) {
    let x = tee.x, y = tee.y, lie = 'tee', strokes = 0, wet = false, guard = 0;
    let s = opt.shot, ang = opt.ang;
    while (guard++ < 12) {
      const o = shoot(sol.H, x, y, lie, s, ang, nrm(), rnd() < s.pm);
      strokes += 1;
      if (o.ob) { strokes += 1; } // replay from same spot
      else {
        strokes += o.pen; if (o.water) wet = true;
        x = o.x; y = o.y; lie = o.lie;
      }
      if (guard === 1 && !o.ob && firstLand.length < 300) firstLand.push(o.water ? { x: o.wx, y: o.wy, lie: LIE.W } : { x, y, lie });
      const d = Math.hypot(sol.pin.x - x, sol.pin.y - y);
      if (lie === LIE.G) { strokes += sampleInt(puttE(d * 3, sol.h), rnd); break; }
      if (lie !== 'tee' && d <= SG_R) { strokes += sampleInt(sgE(d, lie, sol.h), rnd); break; }
      const pa = policyAt(sol, x, y, lie);
      s = sol.shots[pa.s];
      ang = Math.atan2(sol.pin.x - x, sol.pin.y - y) + (pa.a * Math.PI) / 180;
    }
    if (wet) waterCount[0]++;
    scores.push(strokes);
  }
  return { scores, water: waterCount[0] / n, firstLand };
}

if (typeof module !== 'undefined') module.exports = { LIE, LIE_NAME, buildRaster, lieAt, makePlayer, solve, teeOptions, playouts, policyAt, puttE, sgE, valueAt, shoot };
