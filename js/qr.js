// Self-contained QR code: encoder (byte mode, EC level M, versions 1-20) and a decoder for camera frames.
// No dependencies, so it works offline in the PWA and inside the Android WebView.

/* ───────── GF(256) + Reed-Solomon ───────── */
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();
const gmul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
function rsGen(n) {
  let p = [1];
  for (let i = 0; i < n; i++) {
    const q = new Array(p.length + 1).fill(0);
    for (let j = 0; j < p.length; j++) { q[j] ^= p[j]; q[j + 1] ^= gmul(p[j], EXP[i]); }
    p = q;
  }
  return p;
}
function rsRem(data, n) {
  const g = rsGen(n);
  const r = new Array(n).fill(0);
  for (const b of data) {
    const f = b ^ r.shift();
    r.push(0);
    if (f) for (let i = 0; i < n; i++) r[i] ^= gmul(g[i + 1], f);
  }
  return r;
}

/* ───────── Tables (level M) : [ecPerBlock, blocks1, data1, blocks2, data2] ───────── */
const BL = {
  1: [10, 1, 16, 0, 0], 2: [16, 1, 28, 0, 0], 3: [26, 1, 44, 0, 0], 4: [18, 2, 32, 0, 0], 5: [24, 2, 43, 0, 0], 6: [16, 4, 27, 0, 0],
  7: [18, 4, 31, 0, 0], 8: [22, 2, 38, 2, 39], 9: [22, 3, 36, 2, 37], 10: [26, 4, 43, 1, 44], 11: [30, 1, 50, 4, 51], 12: [22, 6, 36, 2, 37],
  13: [22, 8, 37, 1, 38], 14: [24, 4, 40, 5, 41], 15: [24, 5, 41, 5, 42], 16: [28, 7, 45, 3, 46], 17: [28, 10, 46, 1, 47],
  18: [26, 9, 43, 4, 44], 19: [26, 3, 44, 11, 45], 20: [26, 3, 41, 13, 42],
};
const ALIGN = {
  2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50], 11: [6, 30, 54],
  12: [6, 32, 58], 13: [6, 34, 62], 14: [6, 26, 46, 66], 15: [6, 26, 48, 70], 16: [6, 26, 50, 74], 17: [6, 30, 54, 78], 18: [6, 30, 56, 82],
  19: [6, 30, 58, 86], 20: [6, 34, 62, 90],
};
const dataCap = (v) => BL[v][1] * BL[v][2] + BL[v][3] * BL[v][4];
export const QR_MAX_BYTES = dataCap(20) - 3;

/* ───────── Function patterns ───────── */
function fmtCells(size) {
  const a = [], b = [];
  for (let i = 0; i < 6; i++) a[i] = [8, i];
  a[6] = [8, 7]; a[7] = [8, 8]; a[8] = [7, 8];
  for (let i = 9; i < 15; i++) a[i] = [14 - i, 8];
  for (let i = 0; i < 8; i++) b[i] = [size - 1 - i, 8];
  for (let i = 8; i < 15; i++) b[i] = [8, size - 15 + i];
  return [a, b];
}
function frame(v) {
  const size = 17 + 4 * v;
  const mod = [], fn = [];
  for (let i = 0; i < size; i++) { mod.push(new Uint8Array(size)); fn.push(new Uint8Array(size)); }
  const set = (x, y, d) => { mod[y][x] = d ? 1 : 0; fn[y][x] = 1; };
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x >= 0 && x < size && y >= 0 && y < size) { const d = Math.max(Math.abs(dx), Math.abs(dy)); set(x, y, d !== 2 && d !== 4); }
    }
  }
  const ap = ALIGN[v] || [];
  const n = ap.length;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ap[i] + dx, ap[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }
  for (const cells of fmtCells(size)) for (const [x, y] of cells) { mod[y][x] = 0; fn[y][x] = 1; }
  set(8, size - 8, true);
  if (v >= 7) {
    let rem = v;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (v << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const d = (bits >>> i) & 1, a = size - 11 + (i % 3), b = Math.floor(i / 3);
      set(a, b, d); set(b, a, d);
    }
  }
  return { size, mod, fn };
}
const formatWord = (mask) => {
  let rem = mask;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((mask << 10) | rem) ^ 0x5412;
};
const MASKS = [
  (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => ((((x + y) % 2) + ((x * y) % 3)) % 2) === 0,
];
/** Visit data modules in the standard zig-zag order. */
function walk(size, fn, cb) {
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        if (!fn[y][x]) cb(x, y, i++);
      }
    }
  }
  return i;
}

function penalty(mod, size) {
  let p = 0;
  const line = (get) => {
    let run = 1;
    for (let i = 1; i < size; i++) {
      if (get(i) === get(i - 1)) { run++; if (run === 5) p += 3; else if (run > 5) p += 1; } else run = 1;
    }
    let s = '';
    for (let i = 0; i < size; i++) s += get(i);
    for (let i = 0; i + 11 <= size; i++) { const w = s.substr(i, 11); if (w === '10111010000' || w === '00001011101') p += 40; }
  };
  for (let y = 0; y < size; y++) line((i) => mod[y][i]);
  for (let x = 0; x < size; x++) line((i) => mod[i][x]);
  let dark = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    dark += mod[y][x];
    if (x < size - 1 && y < size - 1 && mod[y][x] === mod[y][x + 1] && mod[y][x] === mod[y + 1][x] && mod[y][x] === mod[y + 1][x + 1]) p += 3;
  }
  p += 10 * (Math.ceil(Math.abs(dark * 20 - size * size * 10) / (size * size)) - 1);
  return p;
}

/* ───────── Encoder ───────── */
const utf8 = (s) => Array.from(new TextEncoder().encode(s));

export function qrMatrix(text) {
  const bytes = utf8(text);
  let v = 1;
  while (v <= 20 && 4 + (v < 10 ? 8 : 16) + 8 * bytes.length > 8 * dataCap(v)) v++;
  if (v > 20) throw new Error('QR payload too long');
  const bits = [];
  const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, v < 10 ? 8 : 16);
  bytes.forEach((b) => put(b, 8));
  const cap = 8 * dataCap(v);
  put(0, Math.min(4, cap - bits.length));
  while (bits.length % 8) bits.push(0);
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) put(pad, 8);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; data.push(b); }

  const [ec, b1, d1, b2, d2] = BL[v];
  const blocks = [];
  let k = 0;
  for (let i = 0; i < b1 + b2; i++) { const dl = i < b1 ? d1 : d2; const d = data.slice(k, k + dl); k += dl; blocks.push({ d, e: rsRem(d, ec) }); }
  const cw = [];
  for (let i = 0; i < Math.max(d1, d2); i++) for (const bl of blocks) if (i < bl.d.length) cw.push(bl.d[i]);
  for (let i = 0; i < ec; i++) for (const bl of blocks) cw.push(bl.e[i]);

  const { size, mod, fn } = frame(v);
  walk(size, fn, (x, y, i) => { if (i < cw.length * 8) mod[y][x] = (cw[i >> 3] >>> (7 - (i & 7))) & 1; });

  let best = null, bestP = Infinity;
  for (let m = 0; m < 8; m++) {
    const t = mod.map((r) => Uint8Array.from(r));
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) t[y][x] ^= 1;
    const f = formatWord(m);
    const [c1, c2] = fmtCells(size);
    for (let i = 0; i < 15; i++) { const d = (f >>> i) & 1; t[c1[i][1]][c1[i][0]] = d; t[c2[i][1]][c2[i][0]] = d; }
    const p = penalty(t, size);
    if (p < bestP) { bestP = p; best = t; }
  }
  return { size, version: v, mod: best };
}

/** SVG markup of a QR code (black on white, 4-module quiet zone). */
export function qrSvg(text, { label = 'QR', px = 0 } = {}) {
  const { size, mod } = qrMatrix(text);
  const q = 4, n = size + q * 2;
  let d = '';
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (mod[y][x]) { let e = x; while (e < size && mod[y][e]) e++; d += `M${x + q} ${y + q}h${e - x}v1h${-(e - x)}z`; x = e; } else x++;
    }
  }
  const dim = px ? ` width="${px}" height="${px}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}"${dim} role="img" aria-label="${label}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}

/* ───────── Decoder ───────── */
function solveHomography(src, dst) {
  // maps src (u,v) → dst (x,y); 4 point pairs
  const A = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = src[i], [x, y] = dst[i];
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x, x]);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y, y]);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (Math.abs(A[p][c]) < 1e-12) return null;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  const h = A.map((row, i) => row[8] / row[i]);
  return (u, v) => { const w = h[6] * u + h[7] * v + 1; return [(h[0] * u + h[1] * v + h[2]) / w, (h[3] * u + h[4] * v + h[5]) / w]; };
}

function binarize(img) {
  const { width: W, height: H, data } = img;
  const g = new Uint8Array(W * H);
  for (let i = 0, p = 0; i < g.length; i++, p += 4) g[i] = (data[p] * 77 + data[p + 1] * 150 + data[p + 2] * 29) >> 8;
  const I = new Float64Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += g[y * W + x]; I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + row; } }
  const r = Math.max(12, Math.floor(Math.min(W, H) / 10));
  const bin = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(H, y + r + 1);
    for (let x = 0; x < W; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(W, x + r + 1);
      const s = I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0];
      const mean = s / ((x1 - x0) * (y1 - y0));
      bin[y * W + x] = g[y * W + x] < mean * 0.9 - 2 ? 1 : 0;
    }
  }
  return { bin, W, H };
}

function findFinders({ bin, W, H }) {
  const cands = [];
  const px = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : bin[y * W + x]);
  // measure 1:1:3:1:1 along a direction from a centre point; returns {size, shift} or null
  const measure = (cx, cy, dx, dy, maxMod) => {
    const run = (sx, sy, sign, color) => { let n = 0; while (n < maxMod && px(Math.round(sx + sign * dx * n), Math.round(sy + sign * dy * n)) === color) n++; return n; };
    if (!px(cx, cy)) return null;
    const c1 = run(cx, cy, 1, 1), c2 = run(cx, cy, -1, 1);
    const l1 = run(cx + dx * c1, cy + dy * c1, 1, 0), l2 = run(cx - dx * c2, cy - dy * c2, -1, 0);
    const o1 = run(cx + dx * (c1 + l1), cy + dy * (c1 + l1), 1, 1), o2 = run(cx - dx * (c2 + l2), cy - dy * (c2 + l2), -1, 1);
    const center = c1 + c2 - 1;
    const total = center + l1 + l2 + o1 + o2;
    const m = total / 7;
    if (m < 1.5) return null;
    const ok = (a, e) => Math.abs(a - e * m) < e * m * 0.6 + 0.8;
    if (!(ok(center, 3) && ok(l1, 1) && ok(l2, 1) && ok(o1, 1) && ok(o2, 1))) return null;
    return { m, shift: (c1 - c2) / 2 };
  };
  const step = Math.max(1, Math.floor(H / 240));
  for (let y = 0; y < H; y += step) {
    let x = 0;
    while (x < W) {
      while (x < W && !bin[y * W + x]) x++;
      const s = x;
      while (x < W && bin[y * W + x]) x++;
      // use the dark run as the centre candidate of the pattern
      const cx = Math.round((s + x - 1) / 2);
      if (x - s < 2) continue;
      const mh = measure(cx, y, 1, 0, 400);
      if (!mh) continue;
      const mv = measure(cx, y, 0, 1, 400);
      if (!mv) continue;
      let cy = Math.round(y + mv.shift);
      const mh2 = measure(cx, cy, 1, 0, 400), mv2 = measure(cx, cy, 0, 1, 400);
      if (!mh2 || !mv2) continue;
      const fx = cx + mh2.shift, fy = cy + mv2.shift, ms = (mh2.m + mv2.m) / 2;
      const hit = cands.find((c) => Math.hypot(c.x - fx, c.y - fy) < ms * 3);
      if (hit) { hit.x = (hit.x * hit.n + fx) / (hit.n + 1); hit.y = (hit.y * hit.n + fy) / (hit.n + 1); hit.m = (hit.m * hit.n + ms) / (hit.n + 1); hit.n++; }
      else cands.push({ x: fx, y: fy, m: ms, n: 1 });
    }
  }
  return cands.sort((a, b) => b.n - a.n).slice(0, 10);
}

function pickTriple(c) {
  let best = null, bestErr = Infinity;
  for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) for (let k = j + 1; k < c.length; k++) {
    const P = [c[i], c[j], c[k]];
    const ms = P.map((p) => p.m);
    if (Math.max(...ms) / Math.min(...ms) > 1.6) continue;
    for (let t = 0; t < 3; t++) {
      const A = P[t], B = P[(t + 1) % 3], C = P[(t + 2) % 3];
      const ab = Math.hypot(B.x - A.x, B.y - A.y), ac = Math.hypot(C.x - A.x, C.y - A.y), bc = Math.hypot(C.x - B.x, C.y - B.y);
      const err = Math.abs(ab - ac) / Math.max(ab, ac) + Math.abs(bc - Math.SQRT2 * (ab + ac) / 2) / bc;
      if (err < bestErr && err < 0.35) { bestErr = err; best = [A, B, C]; }
    }
  }
  if (!best) return null;
  let [TL, TR, BL] = best;
  const cross = (TR.x - TL.x) * (BL.y - TL.y) - (TR.y - TL.y) * (BL.x - TL.x);
  if (cross < 0) [TR, BL] = [BL, TR];
  return { TL, TR, BL };
}

function readBits(bin, W, H, map, size) {
  const get = (u, v) => { const [x, y] = map(u, v); const xi = Math.round(x), yi = Math.round(y); return xi < 0 || yi < 0 || xi >= W || yi >= H ? 0 : bin[yi * W + xi]; };
  const grid = [];
  for (let y = 0; y < size; y++) {
    const row = new Uint8Array(size);
    for (let x = 0; x < size; x++) {
      const cx = x + 0.5, cy = y + 0.5, d = 0.2;
      const s = get(cx, cy) * 2 + get(cx - d, cy) + get(cx + d, cy) + get(cx, cy - d) + get(cx, cy + d);
      row[x] = s >= 4 ? 1 : 0;
    }
    grid.push(row);
  }
  return grid;
}

function decodeGrid(grid, v) {
  const { size, fn } = frame(v);
  const cells = fmtCells(size);
  const valid = [];
  for (let m = 0; m < 8; m++) valid.push([formatWord(m), m]);
  let mask = -1, bestD = 99;
  for (const cs of cells) {
    let w = 0;
    for (let i = 0; i < 15; i++) w |= grid[cs[i][1]][cs[i][0]] << i;
    for (const [f, m] of valid) {
      let x = w ^ f, d = 0;
      while (x) { d += x & 1; x >>>= 1; }
      if (d < bestD) { bestD = d; mask = m; }
    }
  }
  if (mask < 0 || bestD > 3) return null;
  const bytes = [];
  let cur = 0;
  walk(size, fn, (x, y, i) => {
    const bit = grid[y][x] ^ (MASKS[mask](x, y) ? 1 : 0);
    cur = (cur << 1) | bit;
    if ((i & 7) === 7) { bytes.push(cur); cur = 0; }
  });
  const [ec, b1, d1, b2, d2] = BL[v];
  const nb = b1 + b2;
  const lens = [];
  for (let i = 0; i < nb; i++) lens.push(i < b1 ? d1 : d2);
  const blocks = lens.map(() => []);
  let p = 0;
  for (let i = 0; i < Math.max(d1, d2); i++) for (let b = 0; b < nb; b++) if (i < lens[b]) blocks[b].push(bytes[p++]);
  void ec;
  const data = [].concat(...blocks);
  let bp = 0;
  const take = (n) => { let r = 0; for (let i = 0; i < n; i++) { r = (r << 1) | ((data[bp >> 3] >>> (7 - (bp & 7))) & 1); bp++; } return r; };
  if (take(4) !== 4) return null;
  const len = take(v < 10 ? 8 : 16);
  if (len <= 0 || len > data.length) return null;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = take(8);
  try { return new TextDecoder('utf-8', { fatal: true }).decode(out); } catch { return null; }
}

/** Decode a QR code from an ImageData-like object ({data, width, height}). Returns the text or null. */
export function qrDecode(img) {
  const bz = binarize(img);
  const t = pickTriple(findFinders(bz));
  if (!t) return null;
  const { TL, TR, BL } = t;
  const side = (Math.hypot(TR.x - TL.x, TR.y - TL.y) + Math.hypot(BL.x - TL.x, BL.y - TL.y)) / 2;
  // run lengths measured along image rows/columns are stretched when the code is rotated; undo that
  const ang = Math.atan2(TR.y - TL.y, TR.x - TL.x);
  const fold = Math.abs((((ang * 180) / Math.PI + 45) % 90 + 90) % 90 - 45) * (Math.PI / 180);
  const ms = ((TL.m + TR.m + BL.m) / 3) * Math.cos(fold);
  const est = side / ms + 7;
  const v0 = Math.round((est - 17) / 4);
  const tried = [];
  for (const dv of [0, -1, 1, -2, 2]) {
    const v = v0 + dv;
    if (v < 1 || v > 20 || tried.includes(v)) continue;
    tried.push(v);
    const size = 17 + 4 * v;
    const aff = solveHomography([[3.5, 3.5], [size - 3.5, 3.5], [3.5, size - 3.5], [size - 3.5, size - 3.5]],
      [[TL.x, TL.y], [TR.x, TR.y], [BL.x, BL.y], [TR.x + BL.x - TL.x, TR.y + BL.y - TL.y]]);
    if (!aff) continue;
    let map = aff;
    if (v >= 2) {
      // refine with the bottom-right alignment pattern → handles perspective
      const { bin, W, H } = bz;
      const at = (u, w) => { const [x, y] = aff(u, w); const xi = Math.round(x), yi = Math.round(y); return xi < 0 || yi < 0 || xi >= W || yi >= H ? -1 : bin[yi * W + xi]; };
      let bestS = -1, sumU = 0, sumW = 0, cnt = 0;
      for (let du = -3; du <= 3; du += 0.25) for (let dw = -3; dw <= 3; dw += 0.25) {
        const u = size - 6.5 + du, w = size - 6.5 + dw;
        let sc = at(u, w) === 1 ? 3 : 0;
        for (let a = 0; a < 8; a++) {
          const an = (a * Math.PI) / 4;
          if (at(u + Math.cos(an) * 1.05, w + Math.sin(an) * 1.05) === 0) sc++;
          if (at(u + Math.cos(an) * 2.25, w + Math.sin(an) * 2.25) === 1) sc++;
        }
        if (sc > bestS) { bestS = sc; sumU = u; sumW = w; cnt = 1; } else if (sc === bestS) { sumU += u; sumW += w; cnt++; }
      }
      const bu = sumU / cnt, bw = sumW / cnt;
      if (bestS >= 17) {
        const [ax, ay] = aff(bu, bw);
        const h = solveHomography([[3.5, 3.5], [size - 3.5, 3.5], [3.5, size - 3.5], [size - 6.5, size - 6.5]], [[TL.x, TL.y], [TR.x, TR.y], [BL.x, BL.y], [ax, ay]]);
        if (h) map = h;
      }
    }
    const grid = readBits(bz.bin, bz.W, bz.H, map, size);
    const text = decodeGrid(grid, v);
    if (text) return text;
  }
  return null;
}
