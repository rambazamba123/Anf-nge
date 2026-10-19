/* Prüft die Kreuzknoten-Animation in knoten.js mathematisch: Ist das gezeichnete Ergebnis ein echter Kreuzknoten
   oder ein Altweiberknoten? Dazu werden die beiden festen Parten (unten herum) und die beiden Enden (oben herum)
   verbunden. Aus der geschlossenen Kurve mit den gezeichneten Über/unter-Lagen wird das Jones-Polynom berechnet.
   Kreuzknoten: -t^3 + t^2 - t + 3 - t^-1 + t^-2 - t^-3 (zwei gegenläufige Halbknoten).
   Altweiberknoten: (t^-1 + t^-3 - t^-4)^2 oder das Spiegelbild (zwei gleichläufige Halbknoten).
   Aufruf: node tools/knoten-pruefen.js            (prüft lose und festgezogen) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'knoten.js'), 'utf8')
  .replace('function knotenAnim(def) {', 'function knotenAnim(def) { const __r = __knotenAnim(def); __r.def = def; return __r; }\nfunction __knotenAnim(def) {');
const ctx = {window: {}, console, Math, JSON, Promise};
vm.createContext(ctx); vm.runInContext(src, ctx);
const KR = ctx.window.KNOTEN.ANIM.kreuz, def = KR.def;
/* Catmull-Rom wie in knoten.js (dort steckt spline() im Modul; hier dieselbe Formel) */
function spline(cp) {
  const out = [], n = cp.length;
  for (let i = 0; i < n - 1; i++) {
    const p1 = cp[i], p2 = cp[i + 1], p0 = cp[i - 1] || {x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y}, p3 = cp[i + 2] || {x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y};
    const d = (a, b) => Math.max(1e-3, Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y))), t1 = d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
    const m = Math.max(3, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 2.5));
    for (let j = 0; j < m; j++) {
      const t = t1 + (t2 - t1) * j / m, L = (a, b, ta, tb) => ({x: ((tb - t) * a.x + (t - ta) * b.x) / (tb - ta), y: ((tb - t) * a.y + (t - ta) * b.y) / (tb - ta)});
      const A1 = L(p0, p1, 0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3), B1 = L(A1, A2, 0, t2), B2 = L(A2, A3, t1, t3), C = L(B1, B2, t1, t2);
      out.push({x: C.x, y: C.y, l: cp[i].l});
    }
  }
  out.push({x: cp[n - 1].x, y: cp[n - 1].y, l: cp[n - 2].l});
  return out;
}
function jones(F) {
  const kurve = spec => spline(spec.cp).map(p => ({x: p.x, y: p.y, z: def.z[p.l] != null ? def.z[p.l] : 3}));
  const G = kurve(F.a), B = kurve(F.b), g0 = G[0], g1 = G[G.length - 1], b0 = B[0], b1 = B[B.length - 1];
  const oben = [{x: g1.x - 40, y: g1.y}, {x: g1.x - 40, y: -300}, {x: b1.x + 40, y: -300}, {x: b1.x + 40, y: b1.y}], unten = [{x: b0.x + 60, y: b0.y}, {x: b0.x + 60, y: 900}, {x: g0.x - 60, y: 900}, {x: g0.x - 60, y: g0.y}];
  const K = [...G, ...oben.map(p => ({...p, z: 0})), ...B.slice().reverse(), ...unten.map(p => ({...p, z: 0}))], n = K.length;
  const inter = (p, q, r, s) => { const d = (q.x - p.x) * (s.y - r.y) - (q.y - p.y) * (s.x - r.x); if (Math.abs(d) < 1e-12) return null; const u = ((r.x - p.x) * (s.y - r.y) - (r.y - p.y) * (s.x - r.x)) / d, v = ((r.x - p.x) * (q.y - p.y) - (r.y - p.y) * (q.x - p.x)) / d; return u > 0 && u < 1 && v > 0 && v < 1 ? [u, v] : null; };
  const X = [];
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
    if (i === 0 && j === n - 1) continue;
    const p = K[i], q = K[(i + 1) % n], r = K[j], s = K[(j + 1) % n], uv = inter(p, q, r, s); if (!uv) continue;
    if (p.z === r.z) throw new Error(`Kreuzung bei ${p.x.toFixed(0)}/${p.y.toFixed(0)} auf gleicher Ebene: über/unter nicht eindeutig`);
    X.push({ti: i + uv[0], tj: j + uv[1], overI: p.z > r.z, di: {x: q.x - p.x, y: q.y - p.y}, dj: {x: s.x - r.x, y: s.y - r.y}});
  }
  const pass = []; X.forEach((c, k) => { pass.push({t: c.ti, k, o: c.overI}); pass.push({t: c.tj, k, o: !c.overI}); }); pass.sort((a, b) => a.t - b.t);
  const m = pass.length, inE = {}, outE = {}; pass.forEach((p, e) => { const key = p.k + (p.o ? 'o' : 'u'); outE[key] = e; inE[key] = (e - 1 + m) % m; });
  const ang = v => Math.atan2(-v.y, v.x);
  const PD = X.map((c, k) => {
    const dU = c.overI ? c.dj : c.di, dO = c.overI ? c.di : c.dj;
    const arms = [{e: inE[k + 'u'], a: ang({x: -dU.x, y: -dU.y})}, {e: outE[k + 'u'], a: ang(dU)}, {e: inE[k + 'o'], a: ang({x: -dO.x, y: -dO.y})}, {e: outE[k + 'o'], a: ang(dO)}];
    const a0 = arms[0].a, nm = x => ((x - a0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); arms.sort((p, q) => nm(p.a) - nm(q.a));
    return {e: arms.map(x => x.e), sign: dO.x * -dU.y - -dO.y * dU.x > 0 ? 1 : -1};
  });
  const add = (P, Q) => { const R = {...P}; for (const k in Q) R[k] = (R[k] || 0) + Q[k]; return R; };
  const mul = (P, Q) => { const R = {}; for (const a in P) for (const b in Q) { const k = +a + +b; R[k] = (R[k] || 0) + P[a] * Q[b]; } return R; };
  let br = {}; const N = PD.length;
  for (let s = 0; s < 1 << N; s++) {
    const par = [...Array(m).keys()], f = x => par[x] === x ? x : (par[x] = f(par[x])), u = (a, b) => { par[f(a)] = f(b); }; let na = 0;
    PD.forEach((c, k) => { const [a, b, cc, d] = c.e; if (s >> k & 1) { u(a, b); u(cc, d); na++; } else { u(a, d); u(b, cc); } });
    let term = {[na - (N - na)]: 1}; for (let i = 1, L = new Set([...Array(m).keys()].map(f)).size; i < L; i++) term = mul(term, {2: -1, '-2': -1});
    br = add(br, term);
  }
  const w = PD.reduce((s, c) => s + c.sign, 0), V = mul(br, {[-3 * w]: w % 2 ? -1 : 1});
  return Object.entries(V).filter(([, c]) => c).map(([e, c]) => [-e / 4, c]).sort((a, b) => b[0] - a[0]).map(([e, c]) => `${c > 0 ? '+' : ''}${c}t^${e}`).join(' ');
}
const KREUZ = '-1t^3 +1t^2 -1t^1 +3t^0 -1t^-1 +1t^-2 -1t^-3';
const ALT = ['+1t^-2 +2t^-4 -2t^-5 +1t^-6 -2t^-7 +1t^-8', '+1t^8 -2t^7 +1t^6 -2t^5 +2t^4 +1t^2'];
let fehler = 0;
for (const [name, F] of [['lose', def.form({ua: 1e9, ub: 1e9})], ['festgezogen', def.form({t: 1})]]) {
  const v = jones(F), art = v === KREUZ ? 'Kreuzknoten' : ALT.includes(v) ? 'ALTWEIBERKNOTEN' : 'anderer Knoten';
  console.log(`${name}: ${art}  (V = ${v})`); if (art !== 'Kreuzknoten') fehler++;
}
process.exit(fehler ? 1 : 0);
