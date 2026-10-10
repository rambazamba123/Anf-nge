/* ==========================================================================
   Skipper – Knoten (V12): Knotenbrett in der Kajüte und Spiel „Knotenkunde“
   Wird erst bei Bedarf nachgeladen (loadKnoten in index.html). Daten: data/knoten.json.
   Die alten, schematischen Zeichnungen waren nicht korrekt und wurden entfernt (Nutzer, 10.10.2026).
   Seit v4.64/v4.65 ist jeder Knoten eine echte Tau-Animation (Feld "anim" in knoten.json, Verzeichnis ANIM).
   ========================================================================== */
(() => {
const KN = window.KNOTEN = window.KNOTEN || {};
let D = null;
KN.init = () => D ? Promise.resolve() : fetch('data/knoten.json?v=' + window.__ver).then(r => r.json()).then(j => { D = j; altPalstek(); });
/* v4.64 hatte einen zweiten Eintrag „Palstek (animiert)“; seit alle Knoten animiert sind, gibt es nur noch einen Palstek */
function altPalstek() { const k = window.S && S.knoten, a = k && k['palstek-anim']; if (!a) return; const p = k.palstek = k.palstek || {}; if (a.ok) p.ok = 1; if (a.zeit && (!p.zeit || a.zeit < p.zeit)) p.zeit = a.zeit; delete k['palstek-anim']; }
const byId = id => D.knoten.find(k => k.id === id);
const K_ = () => (S.knoten = S.knoten || {});

const CSS = `<style>.knotbild{width:100%;max-width:360px;display:block;margin:0 auto}.knotgrid{display:grid;grid-template-columns:1fr;gap:8px}
.knotgrid button{border:2px solid var(--line);background:var(--paper);border-radius:14px;padding:8px;color:var(--ink);text-align:left}.knotgrid b{display:block;font:700 .95rem var(--hfont);margin-top:4px}
.menuitem.richtig{border-color:var(--stb,#1e7f4f);box-shadow:inset 0 0 0 2px var(--stb,#1e7f4f)}.shake{animation:kshake .35s}@keyframes kshake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.knotsteps li{margin:4px 0;opacity:.45;transition:opacity .3s}.knotsteps li.an{opacity:1;font-weight:700}.knotsteps.tipp li{cursor:pointer}
canvas.knotbild{border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.15)}.knotctl{align-items:center;gap:8px;margin:8px 0 2px;flex-wrap:nowrap}.knotctl>.btn{flex:0 0 auto;min-height:40px;padding:.4em .9em}.knotctl input{flex:1 1 auto;min-width:0}.knotneu{font-size:.75rem;color:var(--bb,#c2473b);font-weight:700}
@keyframes knotzieh{to{stroke-dashoffset:0}}.knotuhr{font:700 2.4rem var(--hfont);text-align:center;margin:8px 0}</style>`;

/* ---------- Gemeinsames Werkzeug für alle Knoten-Animationen ----------
   Jedes Tau ist eine glatte Kurve durch Stützpunkte [x, y, Stück]. Jedes Stück liegt auf einer Ebene (z):
   so stimmen alle Kreuzungen (über/unter). Der feste Part kommt von außerhalb des Bildes und läuft nach,
   wenn das lose Ende vorangeht (die Kardeele wandern mit). Requisiten (Block, Reling, Ring, Klampe) haben auch eine Ebene. */
const STIL = {
  gelb: {f: '#e0b65a', r: '#5a3e1e', s: 'rgba(120,78,28,.42)', h: 'rgba(255,243,210,.55)', k: '#2e3d5c'},
  blau: {f: '#5d8fc4', r: '#1c3048', s: 'rgba(18,36,64,.42)', h: 'rgba(225,240,255,.5)', k: '#c2473b'},
  rot: {f: '#d4674f', r: '#5a2216', s: 'rgba(90,30,20,.4)', h: 'rgba(255,225,215,.5)', k: '#2e3d5c'}
};
const P = a => a.map(([x, y, l]) => ({x, y, l}));
const lerp = (a, b, e) => a + (b - a) * e;
const sm = x => x * x * (3 - 2 * x);
/* Zentripetale Catmull-Rom-Kurve, dicht abgetastet; s = Abschnitt (für die Ebene), m = Bogenlänge */
function spline(cp) {
  const out = [], n = cp.length;
  for (let i = 0; i < n - 1; i++) {
    const p1 = cp[i], p2 = cp[i + 1], p0 = cp[i - 1] || {x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y}, p3 = cp[i + 2] || {x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y};
    const d = (a, b) => Math.max(1e-3, Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y)));
    const t0 = 0, t1 = d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
    const m = Math.max(3, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 2.5));
    for (let j = 0; j < m; j++) {
      const t = t1 + (t2 - t1) * j / m, L = (a, b, ta, tb) => ({x: ((tb - t) * a.x + (t - ta) * b.x) / (tb - ta), y: ((tb - t) * a.y + (t - ta) * b.y) / (tb - ta)});
      const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3), B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3), C = L(B1, B2, t1, t2);
      out.push({x: C.x, y: C.y, s: i});
    }
  }
  out.push({x: cp[n - 1].x, y: cp[n - 1].y, s: n - 2});
  let c = 0; out.forEach((p, i) => { if (i) c += Math.hypot(p.x - out[i - 1].x, p.y - out[i - 1].y); p.m = c; });
  return out;
}
function at(pts, m) { let i = 1; while (i < pts.length - 1 && pts[i].m < m) i++; const a = pts[i - 1], b = pts[i], f = Math.max(0, Math.min(1, (m - a.m) / Math.max(1e-6, b.m - a.m))), dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; return {x: a.x + dx * f, y: a.y + dy * f, tx: dx / L, ty: dy / L}; }
/* Teilstück zwischen den Bogenlängen m0 und m1, Enden genau eingesetzt */
function slice(all, m0, m1) {
  m0 = Math.max(0, m0); m1 = Math.min(all[all.length - 1].m, m1);
  const q = [at(all, m0)]; q[0].m = m0;
  for (const p of all) if (p.m > m0 && p.m < m1) q.push(p);
  const e = at(all, m1); e.m = m1; q.push(e); return q;
}
const pathOf = (cx, pts) => { cx.beginPath(); cx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i].x, pts[i].y); };
/* Bogenlänge am Stützpunkt i */
const marke = (cp, i) => { const sp = spline(cp), p = sp.find(q => q.s === i); return p ? p.m : sp[sp.length - 1].m; };
/* Ein Taustück zeichnen: Rand, Füllung, Glanz, schräge Kardeele (mit dem Tau wandernd, Phase ab der Spitze) */
function strang(cx, pc, st, tw, phase) {
  const pts = pc.pts; if (pts.length < 2) return;
  cx.lineJoin = 'round'; cx.lineCap = 'butt';
  pathOf(cx, pc.extO || pts); cx.strokeStyle = st.r; cx.lineWidth = tw + 2.6; cx.stroke();
  pathOf(cx, pc.ext || pts); cx.strokeStyle = st.f; cx.lineWidth = tw; cx.stroke();
  cx.strokeStyle = st.h; cx.lineWidth = tw * .3; cx.stroke();
  const E = pc.ext || pts, sp = tw * .47, r = tw / 2 - .6, sk = tw * .22; cx.beginPath();
  for (let m = Math.ceil((E[0].m - phase) / sp) * sp + phase; m < E[E.length - 1].m; m += sp) {
    const q = at(E, m), a = at(E, m - tw * .5), b = at(E, m + tw * .5), nx = -q.ty, ny = q.tx;
    if (a.tx * b.tx + a.ty * b.ty < .55) continue;  /* in engen Biegungen keine Kardeele, sie stünden über den Rand */
    cx.moveTo(q.x + nx * r + q.tx * sk, q.y + ny * r + q.ty * sk); cx.lineTo(q.x - nx * r - q.tx * sk, q.y - ny * r - q.ty * sk);
  }
  cx.strokeStyle = st.s; cx.lineWidth = Math.max(1, tw * .13); cx.stroke();
}
/* Spitze mit Takling */
function spitze(cx, pts, st, tw) {
  const n = pts.length, q = at(pts, pts[n - 1].m), a = Math.atan2(q.ty, q.tx), tip = pts[n - 1];
  const band = pts.filter(p => p.m > tip.m - tw * .9); if (band.length > 1) { pathOf(cx, band); cx.strokeStyle = st.k; cx.lineWidth = tw + .4; cx.stroke(); }
  cx.beginPath(); cx.arc(tip.x, tip.y, tw / 2, a - Math.PI / 2, a + Math.PI / 2); cx.fillStyle = st.k; cx.fill(); cx.strokeStyle = st.r; cx.lineWidth = 1.3; cx.stroke();
}
function pill(cx, txt, x, y, al = 'left', col = '#3b2a14') {
  cx.font = '700 11px Nunito, system-ui, sans-serif'; const w = cx.measureText(txt).width + 10, x0 = al === 'left' ? x : al === 'right' ? x - w : x - w / 2;
  cx.fillStyle = 'rgba(255,251,240,.93)'; cx.strokeStyle = 'rgba(90,62,30,.35)'; cx.lineWidth = 1; cx.beginPath(); cx.roundRect ? cx.roundRect(x0, y - 9, w, 17, 8) : cx.rect(x0, y - 9, w, 17); cx.fill(); cx.stroke();
  cx.fillStyle = col; cx.textBaseline = 'middle'; cx.fillText(txt, x0 + 5, y);
}
function pfeil(cx, x1, y1, x2, y2, col = '#c2473b') {
  const a = Math.atan2(y2 - y1, x2 - x1); cx.strokeStyle = col; cx.fillStyle = col; cx.lineWidth = 4; cx.lineCap = 'round';
  cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2 - Math.cos(a) * 8, y2 - Math.sin(a) * 8); cx.stroke();
  cx.beginPath(); cx.moveTo(x2, y2); cx.lineTo(x2 - Math.cos(a - .5) * 13, y2 - Math.sin(a - .5) * 13); cx.lineTo(x2 - Math.cos(a + .5) * 13, y2 - Math.sin(a + .5) * 13); cx.closePath(); cx.fill(); cx.lineCap = 'butt';
}
/* Posen weich verbinden (Catmull-Rom in der Zeit), alle Posen gleich viele Punkte; Stück-Namen aus der letzten Pose */
function posen(KK, e) {
  const u = e * (KK.length - 1), i = Math.min(KK.length - 2, Math.floor(u)), f = u - i, g = k => KK[Math.max(0, Math.min(KK.length - 1, k))];
  const cr = (a, b, c, d) => .5 * (2 * b + (c - a) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (3 * b - a - 3 * c + d) * f * f * f);
  const k0 = g(i - 1), k1 = g(i), k2 = g(i + 1), k3 = g(i + 2), Z = KK[KK.length - 1];
  return k1.map((p, j) => ({x: cr(k0[j].x, p.x, k2[j].x, k3[j].x), y: cr(k0[j].y, p.y, k2[j].y, k3[j].y), l: Z[j].l}));
}
const lp = (A, B, e) => A.map((p, i) => ({x: lerp(p.x, B[i].x, e), y: lerp(p.y, B[i].y, e), l: B[i].l}));
/* Pose bis zur Spitze (Index i0) mit dem Rest der fertigen Kurve verlängern (verschoben), damit der Übergang ins Durchstecken nahtlos ist */
const mitRest = (pose, fertig) => { const i0 = pose.length - 1, dx = pose[i0].x - fertig[i0].x, dy = pose[i0].y - fertig[i0].y; return pose.concat(fertig.slice(i0 + 1).map(p => ({x: p.x + dx, y: p.y + dy, l: p.l}))); };
/* Knoten zum Festziehen zusammenschieben: Punkte ab Index von bis bis zur Mitte c um Faktor k */
const zusammen = (cp, von, bis, c, k) => cp.map((p, i) => i < von || i > bis ? {...p} : {x: c.x + (p.x - c.x) * k, y: c.y + (p.y - c.y) * k, l: p.l});

/* Animation bauen: def = {H, seile: {id: {stil, tw}}, z: {Stück: Ebene}, obj: [{z, draw(cx, s)}], phasen: [{st, d, f(e)}], form(s) -> {id: {cp, bis | i}}, deko(cx, s, R)} */
function knotenAnim(def) {
  const W = 300, H = def.H || 420, PH = def.phasen;
  const DUR = Math.round(PH.reduce((s, p) => s + p.d, 0) * 100) / 100;
  const nSt = Math.max(...PH.map(p => p.st)) + 1;
  const START = [...Array(nSt)].map((_, k) => { let a = 0; for (const ph of PH) { if (ph.st === k) return a; a += ph.d; } return a; });
  function stateAt(t) {
    let a = 0;
    for (const ph of PH) { if (t <= a + ph.d) return Object.assign({st: ph.st}, ph.f(sm(Math.max(0, Math.min(1, (t - a) / ph.d))))); a += ph.d; }
    return Object.assign({st: PH[PH.length - 1].st}, PH[PH.length - 1].f(1));
  }
  function bauen(spec) {
    let pts = spline(spec.cp);
    let bis = spec.bis != null ? spec.bis : spec.i != null ? (pts.find(p => p.s === spec.i) || pts[pts.length - 1]).m + (spec.u || 0) : null;
    if (bis != null && bis < pts[pts.length - 1].m) { const c = pts.findIndex(p => p.m >= bis); if (c > 0) { const a = pts[c - 1], b = pts[c], f = (bis - a.m) / Math.max(1e-6, b.m - a.m); pts = pts.slice(0, c); pts.push({x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), s: a.s, m: bis}); } }
    return {pts, lab: spec.cp.map(p => p.l), tip: pts[pts.length - 1]};
  }
  function stuecke(r, zmap) {
    const out = []; let cur = null;
    r.pts.forEach(p => {
      const l = r.lab[p.s];
      if (!cur || cur.l !== l) { const prev = cur; cur = {l, z: zmap[l] != null ? zmap[l] : 3, pts: prev ? [prev.pts[prev.pts.length - 1]] : []}; out.push(cur); }
      cur.pts.push(p);
    });
    const sl = (pc, d) => slice(r.pts, pc.pts[0].m - d, pc.pts[pc.pts.length - 1].m + d);
    out.forEach(pc => { pc.extO = sl(pc, 2); pc.ext = sl(pc, 3.5); });
    return out;
  }
  function draw(cx, t) {
    const s = stateAt(t), F = def.form(s), zmap = Object.assign({}, def.z, s.z || {}), R = {}, alle = [];
    cx.fillStyle = '#f4ead2'; cx.fillRect(0, 0, W, H);
    def.grund && def.grund(cx, s);
    let ord = 0;
    for (const id in F) {
      const sd = def.seile[id], r = bauen(F[id]); R[id] = r; const st = STIL[sd.stil || 'gelb'], tw = sd.tw || 9, ph = ((r.tip.m % (tw * .47)) + tw * .47) % (tw * .47);
      const pcs = stuecke(r, zmap), last = pcs[pcs.length - 1];
      pcs.forEach(pc => alle.push({z: pc.z, o: ord++, f: () => { strang(cx, pc, st, tw, ph); if (pc === last && !sd.ohneSpitze) spitze(cx, pc.pts, st, tw); }}));
      cx.save(); cx.translate(2.5, 3.5); pathOf(cx, r.pts); cx.strokeStyle = 'rgba(70,45,15,.16)'; cx.lineWidth = tw + 2; cx.lineJoin = 'round'; cx.stroke(); cx.restore();
    }
    (def.obj || []).forEach(o => alle.push({z: o.z, o: -1 - ord++, f: () => o.draw(cx, s, R)}));
    alle.sort((a, b) => a.z - b.z || a.o - b.o).forEach(x => x.f());
    def.deko && def.deko(cx, s, R);
    return s;
  }
  return {W, H, DUR, START, draw};
}

/* ---------- Palstek als Animation: ein echtes Tau, das gelegt und durchgezogen wird ----------
   Das Tau ist eine Kurve fester Länge. Der feste Part hängt oben fest, das lose Ende wird geführt.
   Was vorn durch das kleine Auge gesteckt wird, fehlt dem großen Auge: Es wird kleiner, wie in echt.
   Über und unter: Jedes Taustück liegt auf einer Ebene (z). Alle Kreuzungen wie beim echten Knoten:
   loser Part über dem festen Part, von unten (hinten) durchs Auge, hinter dem festen Part herum, von oben zurück. */
const PAL = (() => {
  const W = 300, H = 420, TW = 9, ROPE = '#e0b65a', RAND = '#5a3e1e';
  /* Ebenen: s1 fester Part oben (über dem Kragen), s2 fester Part am Auge (unter allem),
     bot/top unterer und oberer Bogen des kleinen Auges, e1 loser Part über dem festen Part, eye großes Auge,
     r1–r5 Weg des Endes: von hinten hoch, vorn raus, hinter dem festen Part herum, vorn rein, hinten raus. */
  const Z = {s1: 5, s2: 1, bot: 6, top: 1, e1: 4, eye: 2, r1: 3, r2: 7, r3: 2, r4: 7, r5: 3, end: 3};
  /* Fertig gelegt, noch lose (Ende durchgesteckt) */
  const LOOSE = {
    head: P([[150, -30, 's1'], [150, 20, 's1'], [150, 62, 's1'], [150, 82, 's2'], [149, 93, 's2'], [145, 105, 's2'], [133, 115, 's2'], [123, 133, 'bot'], [129, 152, 'bot'], [149, 161, 'bot'], [169, 155, 'bot'], [180, 137, 'top'], [175, 117, 'top'], [161, 106, 'e1'], [144, 101, 'e1'], [127, 98, 'e1'], [110, 104, 'e1'], [102, 122, 'e1'], [100, 145, 'eye']]),
    route: P([[165, 172, 'r1'], [162, 152, 'r1'], [160, 131, 'r2'], [161, 113, 'r2'], [163, 95, 'r3'], [165, 79, 'r3'], [160, 66, 'r3'], [150, 61, 'r3'], [140, 65, 'r3'], [135, 78, 'r4'], [136, 95, 'r4'], [138, 113, 'r4'], [140, 135, 'r5'], [142, 160, 'r5'], [143, 180, 'end']])
  };
  /* Festgezogen */
  const TIGHT = {
    head: P([[150, -30, 's1'], [150, 20, 's1'], [150, 66, 's1'], [150, 84, 's2'], [149, 93, 's2'], [146, 101, 's2'], [139, 107, 's2'], [133, 117, 'bot'], [137, 128, 'bot'], [150, 132, 'bot'], [162, 128, 'bot'], [167, 118, 'top'], [164, 108, 'top'], [157, 103, 'e1'], [147, 100, 'e1'], [138, 99, 'e1'], [128, 103, 'e1'], [122, 115, 'e1'], [119, 134, 'eye']]),
    route: P([[158, 152, 'r1'], [158, 140, 'r1'], [158, 124, 'r2'], [158, 110, 'r2'], [159, 94, 'r3'], [160, 82, 'r3'], [157, 73, 'r3'], [150, 70, 'r3'], [143, 73, 'r3'], [140, 82, 'r4'], [140, 95, 'r4'], [141, 108, 'r4'], [142, 120, 'r5'], [142, 134, 'r5'], [143, 154, 'end']])
  };
  /* Schritt 1 in vier Posen: Das Tau hängt gerade. Der Part zum losen Ende wird rechts angehoben (Bucht),
     oben gehalten und dann vorn über den festen Part nach links gelegt. So entsteht das kleine Auge, der lose Part liegt oben. */
  const KA = {head: P([[150, -30, 's1'], [150, 20, 's1'], [150, 62, 's1'], [150, 82, 's2'], [149, 93, 's2'], [147, 106, 's2'], [146, 122, 's2'], [147, 140, 'bot'], [151, 158, 'bot'], [158, 175, 'bot'], [168, 188, 'bot'], [180, 190, 'top'], [190, 180, 'top'], [193, 164, 'e1'], [192, 148, 'e1'], [199, 162, 'e1'], [203, 182, 'e1'], [206, 202, 'e1'], [207, 224, 'eye']]), E: {x: 234, y: 214}};
  const KB = {head: P([[150, -30, 's1'], [150, 20, 's1'], [150, 62, 's1'], [150, 82, 's2'], [149, 93, 's2'], [147, 105, 's2'], [139, 117, 's2'], [132, 134, 'bot'], [137, 151, 'bot'], [152, 159, 'bot'], [168, 154, 'bot'], [180, 137, 'top'], [180, 117, 'top'], [172, 102, 'e1'], [162, 90, 'e1'], [156, 104, 'e1'], [148, 124, 'e1'], [140, 144, 'e1'], [134, 165, 'eye']]), E: {x: 200, y: 195}};
  LOOSE.E = LOOSE.route[0]; TIGHT.E = TIGHT.route[0];
  const K0 = {head: (() => { const h = LOOSE.head; let y = h[4].y; return h.map((p, i) => { if (i > 4) y += Math.hypot(p.x - h[i - 1].x, p.y - h[i - 1].y); return {x: 150, y: i <= 4 ? p.y : y, l: p.l}; }); })(), E: {x: 214, y: 205}};
  const KK = [K0, KA, KB, LOOSE];
  /* Weiche Kurve durch die Posen (Catmull-Rom in der Zeit), e von 0 bis 1 */
  function posen(e) {
    const u = e * (KK.length - 1), i = Math.min(KK.length - 2, Math.floor(u)), f = u - i, g = k => KK[Math.max(0, Math.min(KK.length - 1, k))];
    const cr = (a, b, c, d) => .5 * (2 * b + (c - a) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (3 * b - a - 3 * c + d) * f * f * f);
    const k0 = g(i - 1), k1 = g(i), k2 = g(i + 1), k3 = g(i + 2), E = {x: cr(k0.E.x, k1.E.x, k2.E.x, k3.E.x), y: cr(k0.E.y, k1.E.y, k2.E.y, k3.E.y)};
    return {head: k1.head.map((p, j) => ({x: cr(k0.head[j].x, p.x, k2.head[j].x, k3.head[j].x), y: cr(k0.head[j].y, p.y, k2.head[j].y, k3.head[j].y), l: LOOSE.head[j].l})), E};
  }

  /* Großes Auge zwischen A (Ende des losen Parts) und E (wo das Ende hochkommt), Tiefe D */
  function eyePts(A, E, D) {
    const xm = (A.x + E.x) / 2 + 12, yb = A.y + D;
    return P([[A.x - 4, A.y + .33 * D, 'eye'], [A.x - 1, A.y + .7 * D, 'eye'], [xm - 30, yb - 8, 'eye'], [xm, yb, 'eye'], [xm + 30, yb - 10, 'eye'], [E.x + 30, (yb - 10 + E.y + 50) / 2, 'eye'], [E.x + 22, E.y + 50, 'eye'], [E.x + 8, E.y + 18, 'eye']]);
  }
  const lerp = (a, b, e) => a + (b - a) * e, lp = (A, B, e) => A.map((p, i) => ({x: lerp(p.x, B[i].x, e), y: lerp(p.y, B[i].y, e), l: (e < .5 ? p : B[i]).l}));
  /* Tau aufbauen: head, Auge (Tiefe so, dass die Länge stimmt), route; abgeschnitten an der Gesamtlänge */
  let LTOT = 0;
  function build(head, route, routeShown) {
    const A = head[head.length - 1], E = route[0], iE = head.length + 8;
    const mk = D => spline(head.concat(eyePts(A, E, D), route));
    const lenToE = pts => { const k = pts.findIndex(p => p.s === iE); return pts[k].m; };
    let pts = mk(100); const rFull = pts[pts.length - 1].m - lenToE(pts);
    const want = LTOT - (routeShown === 'full' ? rFull : routeShown);
    let lo = 30, hi = 2400;
    for (let k = 0; k < 22; k++) { const mid = (lo + hi) / 2; if (lenToE(mk(mid)) < want) lo = mid; else hi = mid; }
    pts = mk((lo + hi) / 2);
    const lab = head.concat(eyePts(A, E, (lo + hi) / 2), route).map(p => p.l);
    /* an der Gesamtlänge abschneiden: dort ist die Spitze des losen Endes */
    const cut = pts.findIndex(p => p.m >= LTOT);
    if (cut > 0) { const a = pts[cut - 1], b = pts[cut], f = (LTOT - a.m) / Math.max(1e-6, b.m - a.m); pts = pts.slice(0, cut); pts.push({x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), s: a.s, m: LTOT}); }
    return {pts, lab, D: (lo + hi) / 2, A, E};
  }
  /* Gesamtlänge: lose fertig gelegt mit einem Auge der Tiefe 175 */
  (() => { const sp = spline(LOOSE.head.concat(eyePts(LOOSE.head[LOOSE.head.length - 1], LOOSE.E, 175), LOOSE.route)); LTOT = sp[sp.length - 1].m; })();
  /* Wegmarken des Endes: durchs Auge (bis r3), um den Baum (bis r4), zurück (bis Spitze) */
  const U = (() => { const sp = spline(LOOSE.head.concat(eyePts(LOOSE.head[LOOSE.head.length - 1], LOOSE.E, 175), LOOSE.route)), iE = LOOSE.head.length + 8, mE = sp.find(p => p.s === iE).m;
    const at = i => sp.find(p => p.s === iE + i).m - mE; return {a: at(4), b: at(9), c: LTOT - mE}; })();
  const shift = (route, E) => route.map(p => ({x: p.x + E.x - route[0].x, y: p.y + E.y - route[0].y, l: p.l}));

  /* Ablauf: Phasen mit Schritt (0–4) und Dauer in Sekunden */
  const sm = x => x * x * (3 - 2 * x);
  const PH = [
    {st: 0, d: .9, f: () => ({kk: 0})},
    {st: 0, d: 3.6, f: e => ({kk: e})},
    {st: 0, d: .7, f: () => ({u: 0})},
    {st: 1, d: 2.1, f: e => ({u: lerp(0, U.a, e)})},
    {st: 1, d: .5, f: () => ({u: U.a})},
    {st: 2, d: 2.5, f: e => ({u: lerp(U.a, U.b, e)})},
    {st: 2, d: .5, f: () => ({u: U.b})},
    {st: 3, d: 2.3, f: e => ({u: lerp(U.b, U.c, e)})},
    {st: 3, d: .8, f: () => ({u: U.c})},
    {st: 4, d: 1.1, f: e => ({t: 0, pfeil: e})},
    {st: 4, d: 2.2, f: e => ({t: e, pfeil: 1, zug: e})},
    {st: 4, d: .2, f: () => ({t: 1, pfeil: 1})}
  ];
  const DUR = Math.round(PH.reduce((s, p) => s + p.d, 0) * 100) / 100;
  function stateAt(t) {
    let a = 0;
    for (const ph of PH) { if (t <= a + ph.d) return Object.assign({st: ph.st}, ph.f(sm(Math.max(0, Math.min(1, (t - a) / ph.d))))); a += ph.d; }
    return Object.assign({st: 4}, PH[PH.length - 1].f(1));
  }
  function rope(s) {
    if (s.kk != null) { const k = posen(s.kk); return Object.assign(build(k.head, shift(LOOSE.route, k.E), 0), {legen: true}); }
    if (s.u != null) return build(LOOSE.head, LOOSE.route, s.u);
    return build(lp(LOOSE.head, TIGHT.head, s.t), lp(LOOSE.route, TIGHT.route, s.t), 'full');
  }

  /* ---------- Zeichnen ---------- */
  function pieces(r) {
    const out = []; let cur = null;
    r.pts.forEach((p, i) => {
      let l = r.lab[p.s]; if (r.legen && (l === 'e1' || l === 'eye')) l = 'vorn';
      if (!cur || cur.l !== l) { const prev = cur; cur = {l, z: l === 'vorn' ? 8 : Z[l], pts: prev ? [prev.pts[prev.pts.length - 1]] : []}; out.push(cur); }
      cur.pts.push(p);
    });
    /* Überlappung an den Stößen: Rand 2, Füllung 3,5 Einheiten (sonst scheint ein Haarspalt durch) */
    const all = r.pts;
    const sl = (pc, d) => slice(all, pc.pts[0].m - d, pc.pts[pc.pts.length - 1].m + d);
    out.forEach(pc => { pc.extO = sl(pc, 2); pc.ext = sl(pc, 3.5); });
    return out;
  }
  function draw(cx, t) {
    const s = stateAt(t), r = rope(s), pcs = pieces(r);
    cx.fillStyle = '#f4ead2'; cx.fillRect(0, 0, W, H);
    /* Schatten des ganzen Taus auf dem Brett */
    cx.save(); cx.translate(2.5, 3.5); pathOf(cx, r.pts); cx.strokeStyle = 'rgba(70,45,15,.16)'; cx.lineWidth = TW + 2; cx.lineJoin = 'round'; cx.stroke(); cx.restore();
    const last = pcs[pcs.length - 1];
    pcs.map((p, i) => ({p, i})).sort((a, b) => a.p.z - b.p.z || a.i - b.i).forEach(({p}) => { strang(cx, p, STIL.gelb, TW, 0); if (p === last) spitze(cx, p.pts, STIL.gelb, TW); });
    /* Beschriftung */
    const tip = r.pts[r.pts.length - 1];
    if (s.kk != null || (s.u != null && s.u < 12)) pill(cx, 'loses Ende', Math.min(W - 70, tip.x + 10), tip.y + 16);
    if (!s.pfeil) pill(cx, 'fester Part', 160, 16);
    if (s.pfeil) {
      const al = s.pfeil, zug = (s.zug || 0) * 7; cx.globalAlpha = al;
      pfeil(cx, 168, 60 - zug, 168, 20 - zug, '#c2473b'); pill(cx, '① fester Part: ziehen', 140, 34 - zug, 'right', '#9b2f24');
      /* Griff: loses Ende und der Augen-Part daneben (beide kommen unten aus dem kleinen Auge) */
      const E = r.E, x0 = Math.min(tip.x, E.x) - 11, x1 = Math.max(tip.x, E.x) + 11, y0 = Math.min(tip.y, E.y) - 14, y1 = Math.max(tip.y, E.y) + 10, gx = (x0 + x1) / 2;
      cx.setLineDash([4, 3]); cx.strokeStyle = '#c2473b'; cx.lineWidth = 2; cx.beginPath(); cx.roundRect ? cx.roundRect(x0, y0, x1 - x0, y1 - y0, 9) : cx.rect(x0, y0, x1 - x0, y1 - y0); cx.stroke(); cx.setLineDash([]);
      pfeil(cx, gx, y1 + 4 + zug, gx, y1 + 42 + zug, '#c2473b');
      pill(cx, '② loses Ende + Auge zusammen halten', gx, y1 + 56 + zug, 'center', '#9b2f24');
      if (s.t > .6) { const yb = Math.max(...r.pts.filter(p => r.lab[p.s] === 'eye').map(p => p.y)); cx.globalAlpha = (s.t - .6) / .4; pill(cx, 'Auge', gx - 6, Math.min(H - 24, (y1 + 56 + yb) / 2 + 6), 'center'); }
      cx.globalAlpha = 1;
    }
    return s;
  }
  /* Beginn jedes Schritts (Sekunden) */
  const START = [0, 1, 2, 3, 4].map(k => { let a = 0; for (const ph of PH) { if (ph.st === k) return a; a += ph.d; } return a; });
  return {W, H, DUR, START, draw};
})();

/* Achtknoten: Stopper am Ende einer Leine, die durch einen Block läuft.
   Kreuzungen (lose): C1 Ende über festem Part (e1 über s2), C2 Ende hinter festem Part (e2 unter s1),
   C3 Ende von vorn in die erste Bucht (e3 über e1), C4 hinten wieder heraus (e4 unter dem unteren Bogen lb). Abwechselnd über/unter = Acht. */
const ACHT = (() => {
  const LOOSE = P([[150, -30, 's1'], [150, 40, 's1'], [150, 88, 's1'], [150, 116, 's1'], [150, 140, 's2'], [150, 168, 's2'], [151, 196, 's2'],
    [157, 219, 'lb'], [177, 229, 'lb'], [198, 217, 'lr'], [204, 192, 'lr'], [197, 170, 'lr'], [185, 162, 'e1'], [168, 164, 'e1'], [150, 167, 'e1'], [128, 160, 'e1'], [114, 143, 'e2'],
    [116, 122, 'e2'], [131, 109, 'e2'], [150, 105, 'e2'], [168, 108, 'e2'], [179, 120, 'e3'], [178, 142, 'e3'], [175, 166, 'e3'], [173, 190, 'e4'], [171, 214, 'e4'], [168, 238, 'e4'], [164, 266, 'end']]);
  const I1 = 15, I2 = 21, IE = LOOSE.length - 1;  // Spitze nach Schritt 1, 2, 3
  /* Schritt 1: Tau hängt gerade aus dem Block; das Ende wird rechts zur Bucht angehoben und vorn über den festen Part gelegt */
  const K0 = (() => { let y = LOOSE[3].y; return LOOSE.slice(0, I1 + 1).map((p, i) => { if (i > 3) y += Math.hypot(p.x - LOOSE[i - 1].x, p.y - LOOSE[i - 1].y) * .92; return {x: 150 + (i > 3 ? (i - 3) * .6 : 0), y: i <= 3 ? p.y : y, l: p.l}; }); })();
  const KA = P([[150, -30, 's1'], [150, 40, 's1'], [150, 88, 's1'], [150, 116, 's1'], [150, 140, 's2'], [150, 168, 's2'], [151, 196, 's2'],
    [156, 220, 'lb'], [174, 232, 'lb'], [195, 224, 'lr'], [206, 202, 'lr'], [207, 178, 'lr'], [205, 156, 'e1'], [204, 136, 'e1'], [206, 118, 'e1'], [210, 102, 'e1']]);
  const KB = P([[150, -30, 's1'], [150, 40, 's1'], [150, 88, 's1'], [150, 116, 's1'], [150, 140, 's2'], [150, 168, 's2'], [151, 196, 's2'],
    [157, 219, 'lb'], [177, 229, 'lb'], [198, 218, 'lr'], [205, 194, 'lr'], [200, 170, 'lr'], [190, 152, 'e1'], [176, 136, 'e1'], [160, 122, 'e1'], [146, 112, 'e1']]);
  const C = {x: 162, y: 172}, TIGHT = (() => { const t = zusammen(LOOSE, 4, IE, C, .56); t[IE] = {x: t[IE].x - 2, y: t[IE].y + 30, l: 'end'}; t[IE - 1] = {x: t[IE - 1].x - 1, y: t[IE - 1].y + 12, l: t[IE - 1].l}; return t; })();
  const M = [I1, I2, IE].map(i => marke(LOOSE, i));
  const def = {
    H: 380,
    seile: {a: {stil: 'gelb', tw: 9}},
    z: {s1: 6, s2: 1, lb: 6, lr: 3, e1: 2, e2: 2, e3: 7, e4: 3, end: 3},
    obj: [{z: 9, draw(cx) { /* Block: Gehäuse mit Scheibe, die Leine kommt unten heraus */
      const g = cx.createLinearGradient(124, 0, 176, 0); g.addColorStop(0, '#6b4a2b'); g.addColorStop(.5, '#a77a4c'); g.addColorStop(1, '#6b4a2b');
      cx.fillStyle = 'rgba(70,45,15,.18)'; cx.beginPath(); cx.roundRect(127, 2, 52, 66, 16); cx.fill();
      cx.fillStyle = g; cx.strokeStyle = '#3d2814'; cx.lineWidth = 2; cx.beginPath(); cx.roundRect(124, -2, 52, 66, 16); cx.fill(); cx.stroke();
      cx.fillStyle = '#3d2814'; cx.beginPath(); cx.arc(150, 26, 15, 0, 7); cx.fill(); cx.fillStyle = '#c9c2b4'; cx.beginPath(); cx.arc(150, 26, 12, 0, 7); cx.fill(); cx.fillStyle = '#7d766a'; cx.beginPath(); cx.arc(150, 26, 3.5, 0, 7); cx.fill();
      cx.fillStyle = '#3d2814'; cx.fillRect(144, 56, 12, 8);
    }}],
    phasen: [
      {st: 0, d: .9, f: () => ({k: 0})},
      {st: 0, d: 3.4, f: e => ({k: e, z: {e1: 8}})},
      {st: 0, d: .6, f: () => ({u: M[0]})},
      {st: 1, d: 2.4, f: e => ({u: lerp(M[0], M[1], e)})},
      {st: 1, d: .5, f: () => ({u: M[1]})},
      {st: 2, d: 2.4, f: e => ({u: lerp(M[1], M[2], e)})},
      {st: 2, d: .8, f: () => ({u: M[2]})},
      {st: 3, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 3, d: 2.2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 3, d: .2, f: () => ({t: 1, pfeil: 1})}
    ],
    form(s) {
      if (s.k != null) return {a: {cp: mitRest(posen([K0, KA, KB, LOOSE.slice(0, I1 + 1)], s.k), LOOSE), i: I1}};
      if (s.u != null) return {a: {cp: LOOSE, bis: s.u}};
      return {a: {cp: lp(LOOSE, TIGHT, s.t)}};
    },
    deko(cx, s, R) {
      const tip = R.a.tip;
      if (s.k != null) pill(cx, 'loses Ende', Math.min(230, tip.x + 10), tip.y + 16);
      if (!s.pfeil) pill(cx, 'fester Part', 182, 84);
      if (s.pfeil) {
        const zug = (s.zug || 0) * 7; cx.globalAlpha = s.pfeil;
        pfeil(cx, 132, 112 - zug, 132, 76 - zug); pill(cx, '① fester Part', 124, 92 - zug, 'right', '#9b2f24');
        pfeil(cx, tip.x + 14, tip.y - 6 + zug, tip.x + 14, tip.y + 30 + zug); pill(cx, '② Ende', tip.x + 24, tip.y + 12 + zug, 'left', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Kreuzknoten: zwei Reffbändsel (gelb von links, blau von rechts) kommen aus dem gerefften Segel.
   1. Halbknoten: rechts (blau) über links (gelb), hinten herum (c1 blau über, c2 blau unter).
   2. Halbknoten: links (gelb) über rechts (blau), hinten herum (c3 gelb über, c4 gelb unter).
   Gegenläufiger Drehsinn = Kreuzknoten (gleicher Drehsinn wäre ein Altweiberknoten). Jedes Ende kommt neben seiner eigenen Part heraus. */
const KREUZ = (() => {
  const A = P([[95, 372, 'as'], [98, 330, 'as'], [102, 300, 'as'], [114, 278, 'as'], [126, 262, 'au'], [131, 251, 'au'], [134, 244, 'ao'], [137, 236, 'ao'], [140, 224, 'ao'],
    [146, 216, 'ac'], [157, 209, 'ac'], [168, 203, 'ac'], [174, 197, 'ab'], [166, 191, 'ab'], [155, 189, 'ab'], [140, 186, 'at'], [124, 178, 'at'], [106, 169, 'at'], [88, 163, 'end']]);
  const B = P([[205, 372, 'bs'], [202, 330, 'bs'], [198, 300, 'bs'], [186, 278, 'bs'], [168, 266, 'bc'], [148, 257, 'bc'], [131, 251, 'bc'], [118, 248, 'bc'], [112, 243, 'bb'], [120, 239, 'bb'],
    [137, 238, 'bb'], [150, 234, 'bb'], [156, 224, 'bu'], [157, 209, 'bu'], [157, 200, 'bo'], [157, 191, 'bo'], [162, 181, 'bt'], [176, 171, 'bt'], [194, 164, 'bt'], [212, 160, 'end']]);
  const IA = 11, IB = 7;  // Spitze von gelb nach „über blau gelegt“, von blau nach „über gelb gelegt“
  /* Anfang: beide Enden stehen nach oben */
  const A0 = A.slice(0, 9).concat(P([[141, 210, 'ac'], [142, 194, 'ac'], [143, 178, 'ac']]));
  const B0 = P([[205, 372, 'bs'], [202, 330, 'bs'], [198, 300, 'bs'], [192, 280, 'bs'], [190, 262, 'bc'], [189, 246, 'bc'], [189, 230, 'bc'], [190, 214, 'bc']]);
  const C = {x: 146, y: 222}, fest = (cp, von, aus) => cp.map((p, i) => i < von ? {...p} : {x: C.x + (p.x - C.x) * .68 + (i >= aus ? (p.x < C.x ? -10 : 10) : 0), y: C.y + (p.y - C.y) * .62 + (i >= aus ? -4 : 0), l: p.l});
  const AT = fest(A, 3, 15), BT = fest(B, 3, 16);
  const MA = [marke(A, IA), marke(A, A.length - 1)], MB = [marke(B, IB), marke(B, B.length - 1)];
  const def = {
    H: 380,
    seile: {a: {stil: 'gelb', tw: 10}, b: {stil: 'blau', tw: 10}},
    z: {as: 4, au: 2, ao: 6, ac: 7, ab: 1, at: 4, bs: 4, bc: 7, bb: 1, bu: 2, bo: 6, bt: 4, end: 4},
    obj: [{z: 9, draw(cx) { /* gerefftes Segel: Tuchwulst mit Falten */
      cx.fillStyle = 'rgba(70,45,15,.16)'; cx.beginPath(); cx.roundRect(14, 306, 280, 80, 30); cx.fill();
      const g = cx.createLinearGradient(0, 300, 0, 380); g.addColorStop(0, '#fbfaf6'); g.addColorStop(.5, '#e6e2d8'); g.addColorStop(1, '#bdb7aa');
      cx.fillStyle = g; cx.strokeStyle = '#8f887a'; cx.lineWidth = 1.5; cx.beginPath(); cx.roundRect(10, 300, 280, 84, 30); cx.fill(); cx.stroke();
      cx.strokeStyle = 'rgba(120,112,98,.45)'; cx.lineWidth = 1.2;
      for (const [x, a] of [[40, .3], [78, -.2], [122, .25], [176, -.25], [222, .2], [258, -.3]]) { cx.beginPath(); cx.moveTo(x, 306); cx.quadraticCurveTo(x + 14 * a + 6, 334, x + 30 * a, 380); cx.stroke(); }
    }}],
    phasen: [
      {st: 0, d: .8, f: () => ({ka: 0, kb: 0})},
      {st: 0, d: 1.4, f: e => ({ka: 0, kb: e})},
      {st: 0, d: 2.8, f: e => ({ka: 0, ub: lerp(MB[0], MB[1], e)})},
      {st: 0, d: .6, f: () => ({ka: 0, ub: MB[1]})},
      {st: 1, d: 1.4, f: e => ({ka: e, ub: MB[1]})},
      {st: 1, d: 2.6, f: e => ({ua: lerp(MA[0], MA[1], e), ub: MB[1]})},
      {st: 1, d: .8, f: () => ({ua: MA[1], ub: MB[1]})},
      {st: 2, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 2, d: 2.2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 2, d: .2, f: () => ({t: 1, pfeil: 1})}
    ],
    form(s) {
      if (s.t != null) return {a: {cp: lp(A, AT, s.t)}, b: {cp: lp(B, BT, s.t)}};
      const a = s.ua != null ? {cp: A, bis: s.ua} : {cp: mitRest(lp(A0, A.slice(0, IA + 1), s.ka), A), i: IA};
      const b = s.ub != null ? {cp: B, bis: s.ub} : {cp: mitRest(lp(B0, B.slice(0, IB + 1), s.kb), B), i: IB};
      return {a, b};
    },
    deko(cx, s, R) {
      if (s.st === 0 && s.ub == null) { pill(cx, 'linkes Ende', R.a.tip.x - 8, R.a.tip.y - 16, 'right'); pill(cx, 'rechtes Ende', R.b.tip.x + 8, R.b.tip.y - 14, 'left'); }
      if (s.pfeil) {
        const zug = (s.zug || 0) * 7, a = R.a.tip, b = R.b.tip; cx.globalAlpha = s.pfeil;
        pfeil(cx, a.x - 4 + zug * -1, a.y - 14, a.x - 40 - zug, a.y - 26); pill(cx, '① links ziehen', a.x - 14 - zug, a.y - 44, 'center', '#9b2f24');
        pfeil(cx, b.x + 4 + zug, b.y - 14, b.x + 40 + zug, b.y - 26); pill(cx, '② rechts ziehen', b.x + 14 + zug, b.y - 44, 'center', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Schotstek: die dicke Leine (blau) bildet die Bucht, die dünne (gelb) macht die Arbeit.
   Aufbau wie ein Palstek mit zwei Leinen, von hinten gesehen: dünn unter dem Buchtbogen hindurch (von unten durch die Bucht),
   hinten um beide Parten der Bucht, unter sich selbst durch und vorn über den Buchtpart hinaus (nicht durch die Bucht).
   Beide losen Enden liegen auf derselben Seite (oben links), so ist er richtig. */
const SCHOT = (() => {
  const T = pts => pts.map(p => ({x: 150 + (p.x - 150) * 1.5, y: 30 + p.y * 1.5, l: p.l}));  /* 1,5-fach, mittig */
  /* dünne Leine: kommt von oben */
  const D_LOOSE = T(P([[150, -30, 's1'], [150, 20, 's1'], [150, 62, 's1'], [150, 82, 's2'], [149, 93, 's2'], [145, 105, 's2'], [133, 115, 's2'], [123, 133, 'bot'], [129, 152, 'bot'], [149, 161, 'bot'], [169, 155, 'bot'], [180, 137, 'top'], [175, 117, 'top'], [161, 106, 'e1'], [144, 101, 'e1'], [127, 98, 'e1'], [110, 104, 'e1'], [101, 120, 'e1'], [97, 142, 'end']]));
  const D_TIGHT = T(P([[150, -30, 's1'], [150, 20, 's1'], [150, 66, 's1'], [150, 84, 's2'], [149, 93, 's2'], [146, 101, 's2'], [139, 107, 's2'], [133, 117, 'bot'], [137, 128, 'bot'], [150, 132, 'bot'], [162, 128, 'bot'], [167, 118, 'top'], [164, 108, 'top'], [157, 103, 'e1'], [147, 100, 'e1'], [138, 99, 'e1'], [128, 103, 'e1'], [121, 116, 'e1'], [117, 136, 'end']]));
  /* dicke Leine: kommt von unten, Bucht mit Bogen oben, Ende geht wieder nach unten */
  const B_LOOSE = T(P([[178, 420, 'r0'], [172, 320, 'r0'], [168, 240, 'r0'], [165, 172, 'r1'], [162, 152, 'r1'], [160, 131, 'r2'], [161, 113, 'r2'], [163, 95, 'r3'], [165, 79, 'r3'], [160, 66, 'r3'], [150, 61, 'r3'], [140, 65, 'r3'], [135, 78, 'r4'], [136, 95, 'r4'], [138, 113, 'r4'], [140, 135, 'r5'], [142, 160, 'r5'], [143, 186, 'end']]));
  const B_TIGHT = T(P([[172, 420, 'r0'], [165, 320, 'r0'], [160, 230, 'r0'], [158, 152, 'r1'], [158, 140, 'r1'], [158, 124, 'r2'], [158, 110, 'r2'], [159, 94, 'r3'], [160, 82, 'r3'], [157, 73, 'r3'], [150, 70, 'r3'], [143, 73, 'r3'], [140, 82, 'r4'], [140, 95, 'r4'], [141, 108, 'r4'], [142, 120, 'r5'], [142, 134, 'r5'], [143, 160, 'end']]));
  /* Schritt 1: dicke Leine liegt locker, das Ende wird oben zur Bucht umgelegt */
  const B0 = T(P([[178, 420, 'r0'], [176, 320, 'r0'], [175, 240, 'r0'], [177, 172, 'r1'], [182, 150, 'r1'], [189, 132, 'r2'], [197, 118, 'r2'], [205, 108, 'r3'], [213, 101, 'r3'], [221, 97, 'r3'], [228, 97, 'r3'], [234, 101, 'r3'], [237, 108, 'r4'], [238, 117, 'r4'], [236, 127, 'r4'], [232, 137, 'r5'], [227, 146, 'r5'], [221, 154, 'end']]));
  const BA = T(P([[178, 420, 'r0'], [173, 320, 'r0'], [169, 240, 'r0'], [166, 172, 'r1'], [163, 152, 'r1'], [161, 131, 'r2'], [161, 113, 'r2'], [162, 95, 'r3'], [162, 79, 'r3'], [158, 64, 'r3'], [148, 56, 'r3'], [136, 56, 'r3'], [124, 60, 'r4'], [114, 67, 'r4'], [106, 76, 'r4'], [100, 86, 'r5'], [96, 97, 'r5'], [94, 110, 'end']]));
  const ID = [4, 12, D_LOOSE.length - 1];  // Spitze der dünnen Leine: vor der Bucht, nach „herum“, am Ende
  const M = [marke(D_LOOSE, 1) + 24, marke(D_LOOSE, 5), marke(D_LOOSE, ID[1]), marke(D_LOOSE, ID[2])];
  const def = {
    H: 400,
    seile: {b: {stil: 'blau', tw: 15}, d: {stil: 'gelb', tw: 9.5}},
    /* von hinten gesehene Palstek-Ebenen (10 − z) */
    z: {s1: 5, s2: 9, bot: 4, top: 9, e1: 6, r0: 7, r1: 7, r2: 3, r3: 8, r4: 3, r5: 7, end: 7},
    phasen: [
      {st: 0, d: .8, f: () => ({k: 0})},
      {st: 0, d: 2.8, f: e => ({k: e})},
      {st: 0, d: .6, f: () => ({k: 1})},
      {st: 1, d: 2.2, f: e => ({u: lerp(M[0], M[1], e)})},
      {st: 1, d: .5, f: () => ({u: M[1]})},
      {st: 2, d: 2.6, f: e => ({u: lerp(M[1], M[2], e)})},
      {st: 2, d: .5, f: () => ({u: M[2]})},
      {st: 3, d: 1.9, f: e => ({u: lerp(M[2], M[3], e)})},
      {st: 3, d: .8, f: () => ({u: M[3]})},
      {st: 4, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 4, d: 2.2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 4, d: .2, f: () => ({t: 1, pfeil: 1})}
    ],
    form(s) {
      if (s.k != null) return {b: {cp: posen([B0, BA, B_LOOSE], s.k)}, d: {cp: D_LOOSE, bis: M[0]}};
      if (s.u != null) return {b: {cp: B_LOOSE}, d: {cp: D_LOOSE, bis: s.u}};
      return {b: {cp: lp(B_LOOSE, B_TIGHT, s.t)}, d: {cp: lp(D_LOOSE, D_TIGHT, s.t)}};
    },
    deko(cx, s, R) {
      if (s.k != null) pill(cx, 'dicke Leine', 200, 360);
      if (s.k != null || s.u < M[0] + 10) pill(cx, 'dünne Leine', 160, 22);
      if (s.pfeil) {
        const zug = (s.zug || 0) * 7; cx.globalAlpha = s.pfeil;
        pfeil(cx, 170, 70 - zug, 170, 30 - zug); pill(cx, '① dünner Part', 182, 50 - zug, 'left', '#9b2f24');
        pfeil(cx, 160, 300 + zug, 160, 342 + zug); pill(cx, '② dicker Part', 150, 322 + zug, 'right', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Webeleinstek an der Reling (Fenderleine), Blick von vorn.
   Die Leine kommt vom Fender (unten), läuft vorn hoch (sv), über die Stange, hinten herunter (h1), unten wieder nach vorn,
   kreuzt vorn schräg über die stehende Part (dg), läuft ein zweites Mal herum (h2) und das Ende geht unter der Kreuzung durch (tl).
   Vorn liegt das X (Schräge über festem Part und Ende), hinten zwei parallele Windungen. Ebenen: Stange 5, vorn 6/8, hinten 2. */
const WEBE = (() => {
  const Y = 150, R = 16;
  const LOOSE = P([[164, 440, 'sv'], [164, 330, 'sv'], [164, 250, 'sv'], [164, 200, 'sv'], [164, 172, 'sv'], [164, 145, 'sv'], [165, 131, 'h1'], [169, 126, 'h1'], [175, 132, 'h1'],
    [192, 151, 'h1'], [205, 167, 'h1'], [208, 174, 'dg'], [202, 173, 'dg'], [186, 165, 'dg'], [160, 152, 'dg'], [132, 139, 'dg'], [113, 130, 'dg'], [106, 126, 'h2'], [101, 131, 'h2'],
    [96, 146, 'h2'], [91, 163, 'h2'], [91, 172, 'tl'], [98, 174, 'tl'], [111, 167, 'tl'], [124, 155, 'tl'], [133, 140, 'tl'], [138, 122, 'tl'], [141, 102, 'tl'], [143, 82, 'end']]);
  const IA = 4, I1 = 11, I2 = 21, IE = LOOSE.length - 1;
  const TIGHT = LOOSE.map((p, i) => i <= IA ? {...p, x: 158} : {x: 152 + (p.x - 152) * .74, y: Y + (p.y - Y) * .97, l: p.l});
  TIGHT[IE - 1] = {...TIGHT[IE - 1], y: TIGHT[IE - 1].y + 4}; TIGHT[IE] = {x: TIGHT[IE].x, y: TIGHT[IE].y + 8, l: 'end'};
  const M = [marke(LOOSE, IA), marke(LOOSE, I1), marke(LOOSE, I2), marke(LOOSE, IE)];
  /* Vor dem ersten Schritt: Leine kommt locker vom Fender, das Ende zeigt zur Stange */
  const K0 = P([[164, 440, 'sv'], [167, 330, 'sv'], [175, 262, 'sv'], [186, 222, 'sv'], [194, 196, 'sv']]);
  const def = {
    H: 380,
    seile: {a: {stil: 'gelb', tw: 13}},
    z: {sv: 6, h1: 2, dg: 8, h2: 2, tl: 6, end: 6},
    obj: [{z: 5, draw(cx) { /* Reling: Rohr mit zwei Stützen */
      for (const x of [22, 278]) { const g = cx.createLinearGradient(x - 8, 0, x + 8, 0); g.addColorStop(0, '#8d949b'); g.addColorStop(.45, '#e4e8ec'); g.addColorStop(1, '#7c838a'); cx.fillStyle = g; cx.fillRect(x - 8, Y, 16, 260); cx.strokeStyle = 'rgba(40,46,52,.45)'; cx.strokeRect(x - 8, Y, 16, 260); }
      cx.fillStyle = 'rgba(70,45,15,.16)'; cx.fillRect(0, Y - R + 4, 300, R * 2);
      const g = cx.createLinearGradient(0, Y - R, 0, Y + R); g.addColorStop(0, '#9aa1a8'); g.addColorStop(.35, '#f1f4f6'); g.addColorStop(.6, '#c3c9cf'); g.addColorStop(1, '#6f767d');
      cx.fillStyle = g; cx.fillRect(-2, Y - R, 304, R * 2); cx.strokeStyle = 'rgba(40,46,52,.55)'; cx.lineWidth = 1; cx.strokeRect(-2, Y - R, 304, R * 2);
    }}],
    phasen: [
      {st: 0, d: .8, f: () => ({k: 0})},
      {st: 0, d: 1.2, f: e => ({k: e})},
      {st: 0, d: 2.4, f: e => ({u: lerp(M[0], M[1], e)})},
      {st: 0, d: .5, f: () => ({u: M[1]})},
      {st: 1, d: 3, f: e => ({u: lerp(M[1], M[2], e)})},
      {st: 1, d: .5, f: () => ({u: M[2]})},
      {st: 2, d: 1.8, f: e => ({u: lerp(M[2], M[3], e)})},
      {st: 2, d: .8, f: () => ({u: M[3]})},
      {st: 3, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 3, d: 2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 3, d: .2, f: () => ({t: 1, pfeil: 1})}
    ],
    form(s) {
      if (s.k != null) return {a: {cp: mitRest(lp(K0, LOOSE.slice(0, IA + 1), s.k), LOOSE), i: IA}};
      if (s.u != null) return {a: {cp: LOOSE, bis: s.u}};
      return {a: {cp: lp(LOOSE, TIGHT, s.t)}};
    },
    deko(cx, s, R) {
      const tip = R.a.tip;
      if (s.k != null || s.u < M[0] + 30) pill(cx, 'loses Ende', tip.x + 12, tip.y + 4);
      if (!s.pfeil) pill(cx, 'zum Fender', 176, 330);
      if (s.pfeil) {
        const zug = (s.zug || 0) * 6; cx.globalAlpha = s.pfeil;
        pfeil(cx, tip.x + 18, tip.y + 30 - zug, tip.x + 18, tip.y - 8 - zug); pill(cx, '① Ende ziehen', tip.x + 30, tip.y + 10 - zug, 'left', '#9b2f24');
        pfeil(cx, 182, 250 + zug, 182, 292 + zug); pill(cx, '② Fender zieht', 192, 272 + zug, 'left', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Rundtörn mit zwei halben Schlägen an einem Festmacherring, Blick von vorn.
   Die Leine kommt vom Boot (unten), läuft zweimal ganz um den Ring (hinten hoch rb, vorn herunter rf),
   dann mit dem Ende um die stehende Part: 1. halber Schlag (vorn quer a1, hinten herum hb, schräg über sich selbst dg),
   2. halber Schlag in gleicher Richtung (hinten herum hb, das Ende vorn unter der Schrägen hindurch tl). Zusammen ein Webeleinstek um die Part. */
const RUND = (() => {
  const CX = 150, CY = 40, RR = 88, RD = 9;  // Ring: Mitte, Radius, halbe Dicke (Wandplatte oben außerhalb des Bildes)
  const yc = x => CY + Math.sqrt(RR * RR - (x - CX) * (x - CX)), o = RD + 6;
  const LOOSE = P([[104, 440, 'sl'], [110, 330, 'sl'], [116, 240, 'sl'], [118, 175, 'sl'], [118, 150, 'rb'], [119, yc(119) - 6, 'rb'], [122, yc(122) - o, 'rf'],
    [128, yc(128) - 9, 'rf'], [134, yc(134) + 2, 'rf'], [140, yc(140) + 12, 'rb'], [145, yc(145) + o, 'rb'], [148, yc(148) + 5, 'rb'], [149, yc(149) - 6, 'rb'], [152, yc(152) - o, 'rf'],
    [158, yc(158) - 9, 'rf'], [164, yc(164) + 2, 'rf'], [170, yc(170) + 12, 'rf'], [178, 160, 'ab'], [183, 184, 'ab'], [178, 206, 'ab'], [162, 220, 'a1'], [140, 225, 'a1'], [118, 226, 'a1'],
    [98, 224, 'a1'], [88, 218, 'hb'], [100, 210, 'hb'], [118, 208, 'hb'], [136, 206, 'hb'], [148, 205, 'dg'], [142, 211, 'dg'], [130, 221, 'dg'], [118, 231, 'dg'], [104, 244, 'dg'], [92, 254, 'dg'],
    [88, 260, 'hb'], [102, 263, 'hb'], [118, 263, 'hb'], [136, 262, 'hb'], [148, 258, 'tl'], [138, 251, 'tl'], [118, 246, 'tl'], [100, 246, 'tl'], [82, 248, 'tl'], [64, 252, 'end']]);
  const I0 = 3, I1 = 19, I2 = 33, IE = LOOSE.length - 1;
  /* Festgezogen: Törns liegen eng am Ring, die Schläge sind bis unter den Ring hochgeschoben */
  const TIGHT = LOOSE.map((p, i) => {
    if (i < I0) return {...p};
    if (i <= 16) return {x: 146 + (p.x - 146) * .84, y: p.y < yc(p.x) ? p.y + 2 : p.y - 2, l: p.l};
    if (i <= I1) return {x: 150 + (p.x - 150) * .7, y: 140 + (p.y - 140) * .55, l: p.l};
    return {x: 119 + (p.x - 118) * .62, y: 168 + (p.y - 235) * .62, l: p.l};
  });
  TIGHT[3] = {x: 119, y: 200, l: 'sl'};
  /* Weg vom Törn zum ersten Schlag gerade, ohne Bauch */
  for (const [i, f] of [[17, .3], [18, .58], [19, .82]]) TIGHT[i] = {x: lerp(TIGHT[16].x, TIGHT[20].x + 14, f), y: lerp(TIGHT[16].y, TIGHT[20].y, f), l: LOOSE[i].l}; TIGHT[IE] = {x: TIGHT[IE].x - 10, y: TIGHT[IE].y + 6, l: 'end'};
  const M = [marke(LOOSE, I0), marke(LOOSE, I1), marke(LOOSE, I2), marke(LOOSE, IE)];
  const K0 = P([[104, 440, 'sl'], [108, 330, 'sl'], [118, 250, 'sl'], [132, 212, 'sl']]);
  const def = {
    H: 380,
    seile: {a: {stil: 'gelb', tw: 12}},
    z: {sl: 5, rb: 2, rf: 7, ab: 7, a1: 7, hb: 3, dg: 9, tl: 7, end: 7},
    obj: [{z: 5, draw(cx) { /* Wandplatte, Bügel und Ring */
      cx.fillStyle = 'rgba(70,45,15,.16)'; cx.beginPath(); cx.roundRect(126, -4, 54, 34, 6); cx.fill();
      const g = cx.createLinearGradient(0, -6, 0, 30); g.addColorStop(0, '#9aa1a8'); g.addColorStop(1, '#5f666d'); cx.fillStyle = g; cx.strokeStyle = '#3e444a'; cx.lineWidth = 1.5; cx.beginPath(); cx.roundRect(123, -8, 54, 34, 6); cx.fill(); cx.stroke();
      for (const x of [132, 168]) { cx.fillStyle = '#3e444a'; cx.beginPath(); cx.arc(x, 9, 3, 0, 7); cx.fill(); }
      cx.strokeStyle = '#4b5258'; cx.lineWidth = 9; cx.beginPath(); cx.arc(150, 30, 9, Math.PI, 0); cx.stroke();
      cx.save(); cx.translate(2.5, 3.5); cx.strokeStyle = 'rgba(70,45,15,.16)'; cx.lineWidth = RD * 2; cx.beginPath(); cx.arc(CX, CY, RR, 0, 7); cx.stroke(); cx.restore();
      cx.strokeStyle = '#3e444a'; cx.lineWidth = RD * 2 + 2.4; cx.beginPath(); cx.arc(CX, CY, RR, 0, 7); cx.stroke();
      cx.strokeStyle = '#a9b0b6'; cx.lineWidth = RD * 2; cx.stroke();
      cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = RD * .7; cx.beginPath(); cx.arc(CX, CY, RR - 2, Math.PI * 1.05, Math.PI * 1.95); cx.stroke();
      cx.beginPath(); cx.arc(CX, CY, RR - 2, Math.PI * .1, Math.PI * .9); cx.stroke();
    }}],
    phasen: [
      {st: 0, d: .8, f: () => ({k: 0})},
      {st: 0, d: 1, f: e => ({k: e})},
      {st: 0, d: 3.4, f: e => ({u: lerp(M[0], M[1], e)})},
      {st: 0, d: .5, f: () => ({u: M[1]})},
      {st: 1, d: 2.8, f: e => ({u: lerp(M[1], M[2], e)})},
      {st: 1, d: .5, f: () => ({u: M[2]})},
      {st: 2, d: 2.2, f: e => ({u: lerp(M[2], M[3], e)})},
      {st: 2, d: .8, f: () => ({u: M[3]})},
      {st: 3, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 3, d: 2.2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 3, d: .2, f: () => ({t: 1, pfeil: 1})}
    ],
    form(s) {
      if (s.k != null) return {a: {cp: mitRest(lp(K0, LOOSE.slice(0, I0 + 1), s.k), LOOSE), i: I0}};
      if (s.u != null) return {a: {cp: LOOSE, bis: s.u}};
      return {a: {cp: lp(LOOSE, TIGHT, s.t)}};
    },
    deko(cx, s, R) {
      const tip = R.a.tip;
      if (s.k != null || s.u < M[0] + 30) pill(cx, 'loses Ende', tip.x + 12, tip.y + 6);
      if (!s.pfeil) pill(cx, 'zum Boot', 120, 340);
      if (s.pfeil) {
        const zug = (s.zug || 0) * 8; cx.globalAlpha = s.pfeil * (1 - (s.t || 0) * .3);
        pfeil(cx, 170, 268 - zug, 170, 226 - zug); pill(cx, '① Schläge hochschieben', 180, 248 - zug, 'left', '#9b2f24');
        cx.globalAlpha = s.pfeil;
        pfeil(cx, 132, 296 + zug, 128, 338 + zug); pill(cx, '② Boot zieht', 140, 318 + zug, 'left', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Belegen einer Klampe, Blick von oben. Die Leine kommt vom Boot (unten links) und läuft zuerst zum fernen Horn.
   1. einmal ganz um den Fuß (unter beiden Hörnern durch, uh), 2. Acht: schräg über die Mitte (d1), unter dem rechten Horn durch,
   schräg zurück über d1 (d2, das X), unter dem linken Horn durch, 3. Kopfschlag: noch einmal schräg (d3), um das rechte Horn
   und das Ende unter d3 zurück, so klemmt es unter sich selbst (kl). Ebenen: Klampe 5, unter den Hörnern 3, oben 7 bis 10. */
const KLAMPE = (() => {
  const LOOSE = P([[18, 420, 'zu'], [60, 340, 'zu'], [110, 282, 'zu'], [156, 250, 'zu'], [188, 234, 'zu'], [203, 224, 'uh'], [209, 208, 'uh'], [210, 190, 'uh'], [208, 172, 'uh'],
    [198, 159, 'ob'], [170, 155, 'ob'], [130, 155, 'ob'], [102, 159, 'uh'], [92, 172, 'uh'], [90, 190, 'uh'], [92, 208, 'uh'], [100, 221, 'd1'], [124, 211, 'd1'], [150, 192, 'd1'],
    [178, 173, 'd1'], [204, 158, 'd1'], [220, 159, 'uh'], [229, 173, 'uh'], [231, 190, 'uh'], [229, 207, 'uh'], [220, 221, 'd2'], [200, 214, 'd2'], [176, 205, 'd2'], [150, 190, 'd2'],
    [122, 172, 'd2'], [96, 157, 'd2'], [80, 158, 'uh'], [70, 172, 'uh'], [67, 190, 'uh'], [70, 208, 'uh'], [80, 222, 'd3'], [98, 232, 'd3'], [124, 228, 'd3'], [150, 212, 'd3'],
    [176, 197, 'd3'], [202, 181, 'd3'], [228, 165, 'd3'], [241, 161, 'uh'], [251, 170, 'uh'], [256, 184, 'uh'], [256, 199, 'uh'], [251, 213, 'kl'], [240, 222, 'kl'], [224, 218, 'kl'],
    [198, 201, 'kl'], [172, 182, 'kl'], [146, 162, 'kl'], [126, 147, 'kl'], [112, 137, 'end']]);
  const I0 = 4, I1 = 16, I2 = 35, IE = LOOSE.length - 1;
  const TIGHT = LOOSE.map((p, i) => i <= I0 ? {...p} : {x: 150 + (p.x - 150) * .96, y: 190 + (p.y - 190) * .84, l: p.l});
  TIGHT[IE] = {x: TIGHT[IE].x - 6, y: TIGHT[IE].y - 4, l: 'end'};
  const M = [marke(LOOSE, I0), marke(LOOSE, I1), marke(LOOSE, I2), marke(LOOSE, IE)];
  const K0 = P([[18, 420, 'zu'], [52, 330, 'zu'], [92, 276, 'zu'], [128, 250, 'zu'], [156, 242, 'zu']]);
  /* Klampe von oben: zwei Hörner, Mitte etwas breiter, zwei Schrauben */
  const umriss = cx => { cx.beginPath(); cx.moveTo(16, 190); cx.bezierCurveTo(22, 178, 70, 180, 112, 176); cx.bezierCurveTo(136, 172, 164, 172, 188, 176); cx.bezierCurveTo(230, 180, 278, 178, 284, 190);
    cx.bezierCurveTo(278, 202, 230, 200, 188, 204); cx.bezierCurveTo(164, 208, 136, 208, 112, 204); cx.bezierCurveTo(70, 200, 22, 202, 16, 190); cx.closePath(); };
  const def = {
    H: 360,
    seile: {a: {stil: 'gelb', tw: 11}},
    z: {zu: 4, uh: 3, ob: 4, d1: 7, d2: 8, d3: 10, kl: 9, end: 9},
    grund(cx) { cx.strokeStyle = 'rgba(120,90,50,.18)'; cx.lineWidth = 1; for (let y = 22; y < 360; y += 34) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(300, y); cx.stroke(); } },
    obj: [{z: 5, draw(cx) {
      cx.save(); cx.translate(3, 4); umriss(cx); cx.fillStyle = 'rgba(70,45,15,.2)'; cx.fill(); cx.restore();
      const g = cx.createLinearGradient(0, 172, 0, 208); g.addColorStop(0, '#f2f4f5'); g.addColorStop(.45, '#c8ced3'); g.addColorStop(1, '#8b9298');
      umriss(cx); cx.fillStyle = g; cx.fill(); cx.strokeStyle = '#4a5157'; cx.lineWidth = 1.6; cx.stroke();
      cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(34, 185); cx.bezierCurveTo(80, 181, 130, 178, 150, 178); cx.bezierCurveTo(170, 178, 220, 181, 266, 185); cx.stroke();
      for (const x of [128, 172]) { cx.fillStyle = '#6d757c'; cx.beginPath(); cx.arc(x, 190, 4.2, 0, 7); cx.fill(); cx.strokeStyle = '#3b4146'; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(x - 2.6, 190); cx.lineTo(x + 2.6, 190); cx.stroke(); }
    }}],
    phasen: [
      {st: 0, d: .8, f: () => ({k: 0})},
      {st: 0, d: 1, f: e => ({k: e})},
      {st: 0, d: 2.8, f: e => ({u: lerp(M[0], M[1], e)})},
      {st: 0, d: .5, f: () => ({u: M[1]})},
      {st: 1, d: 3.6, f: e => ({u: lerp(M[1], M[2], e)})},
      {st: 1, d: .5, f: () => ({u: M[2]})},
      {st: 2, d: 3, f: e => ({u: lerp(M[2], M[3], e)})},
      {st: 2, d: .8, f: () => ({u: M[3]})},
      {st: 3, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 3, d: 2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 3, d: .2, f: () => ({t: 1, pfeil: 1})}
    ],
    form(s) {
      if (s.k != null) return {a: {cp: mitRest(lp(K0, LOOSE.slice(0, I0 + 1), s.k), LOOSE), i: I0}};
      if (s.u != null) return {a: {cp: LOOSE, bis: s.u}};
      return {a: {cp: lp(LOOSE, TIGHT, s.t)}};
    },
    deko(cx, s, R) {
      const tip = R.a.tip;
      if (s.k != null || s.u < M[0] + 25) pill(cx, 'loses Ende', tip.x + 6, tip.y + 20);
      if (!s.pfeil) pill(cx, 'zum Boot', 70, 330);
      if (s.pfeil) {
        const zug = (s.zug || 0) * 6; cx.globalAlpha = s.pfeil;
        pfeil(cx, tip.x + 8, tip.y + 4, tip.x - 20 - zug, tip.y - 18 - zug); pill(cx, '① Ende festziehen', tip.x - 14 - zug, tip.y - 34 - zug, 'center', '#9b2f24');
        pfeil(cx, 84, 300, 62 - zug, 334 + zug); pill(cx, '② Boot zieht', 92, 318 + zug, 'left', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Stopperstek an einer Leine unter Last (blau), Blick von vorn. Der Zug kommt von rechts, entlang der blauen Leine.
   Der stehende Part liegt vorn an der blauen Leine (sv) und steigt links (bei S) hoch. Zwei Törns laufen nach rechts,
   also zur Zugseite, und kreuzen dabei vorn über den stehenden Part (d1, d2). Danach führt das Ende hinten herum zur anderen
   Seite (b2) und macht dort einen halben Schlag (f3, b3). Das Ende wird unter diesem letzten Törn durchgesteckt (tl).
   Ebenen: hinten 1–2, blaue Leine 5, vorn 6, Törns 8. */
const STOPPER = (() => {
  const Y = 172;
  const LOOSE = P([[390, 214, 'sv'], [340, 198, 'sv'], [290, 188, 'sv'], [242, 182, 'sv'], [202, 180, 'sv'], [165, 180, 'sv'], [140, 178, 'sv'], [130, 172, 'sv'], [126, 160, 'sv'],
    [129, 147, 'b0'], [135, 142, 'b0'], [141, 146, 'b0'], [150, 163, 'b0'], [160, 183, 'b0'], [168, 198, 'b0'], [174, 203, 'd1'], [179, 197, 'd1'], [178, 182, 'd1'], [172, 164, 'd1'], [166, 150, 'd1'],
    [168, 142, 'b1'], [174, 146, 'b1'], [182, 163, 'b1'], [192, 183, 'b1'], [200, 198, 'b1'], [206, 203, 'd2'], [211, 197, 'd2'], [210, 182, 'd2'], [205, 164, 'd2'], [199, 150, 'd2'],
    [198, 142, 'b2'], [192, 150, 'b2'], [185, 164, 'b2'], [152, 174, 'b2'], [115, 180, 'b2'], [100, 190, 'b2'], [92, 202, 'f3'], [86, 197, 'f3'], [86, 184, 'f3'], [85, 167, 'f3'], [84, 152, 'f3'],
    [81, 143, 'b3'], [75, 143, 'b3'], [70, 150, 'b3'], [62, 170, 'b3'], [58, 188, 'b3'], [58, 201, 'tl'], [65, 203, 'tl'], [75, 193, 'tl'], [85, 176, 'tl'], [92, 157, 'tl'], [98, 137, 'tl'],
    [101, 114, 'tl'], [104, 90, 'end']]);
  const last = l => LOOSE.map(p => p.l).lastIndexOf(l);
  const IA = 6, I1 = last('d1'), I2 = last('d2'), IE = LOOSE.length - 1;
  const TIGHT = LOOSE.map((p, i) => i <= IA ? {...p, y: lerp(p.y, Y + 4, .8)} : i <= I2 + 4 ? {x: 150 + (p.x - 150) * .85, y: Y + (p.y - Y) * .9, l: p.l} : {x: 128 + (p.x - 128) * .8, y: Y + (p.y - Y) * .9, l: p.l});
  TIGHT[IE] = {x: TIGHT[IE].x - 2, y: TIGHT[IE].y - 6, l: 'end'};
  const M = [marke(LOOSE, IA), marke(LOOSE, I1), marke(LOOSE, I2), marke(LOOSE, IE)];
  /* Vorher: die Leine hängt locker unter der blauen Leine, das Ende zeigt zu ihr */
  const K0 = P([[390, 247, 'sv'], [340, 247, 'sv'], [292, 244, 'sv'], [248, 240, 'sv'], [208, 232, 'sv'], [172, 222, 'sv'], [148, 212, 'sv']]);
  const HOST = P([[-40, Y, 'host'], [150, Y, 'host'], [340, Y, 'host']]);
  const def = {
    H: 290,
    seile: {a: {stil: 'gelb', tw: 15}, b: {stil: 'blau', tw: 36, ohneSpitze: true}},
    z: {host: 5, sv: 6, b0: 2, d1: 8, b1: 2, d2: 8, b2: 1, f3: 8, b3: 2, tl: 6, end: 6},
    phasen: [
      {st: 0, d: .8, f: () => ({k: 0})},
      {st: 0, d: 1.2, f: e => ({k: e})},
      {st: 0, d: 2.6, f: e => ({u: lerp(M[0], M[1], e)})},
      {st: 0, d: .5, f: () => ({u: M[1]})},
      {st: 1, d: 2.4, f: e => ({u: lerp(M[1], M[2], e)})},
      {st: 1, d: .5, f: () => ({u: M[2]})},
      {st: 2, d: 3.4, f: e => ({u: lerp(M[2], M[3], e)})},
      {st: 2, d: .8, f: () => ({u: M[3]})},
      {st: 3, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 3, d: 2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 3, d: .2, f: () => ({t: 1, pfeil: 1})}
    ],
    form(s) {
      const b = {cp: HOST};
      if (s.k != null) return {b, a: {cp: mitRest(lp(K0, LOOSE.slice(0, IA + 1), s.k), LOOSE), i: IA}};
      if (s.u != null) return {b, a: {cp: LOOSE, bis: s.u}};
      return {b, a: {cp: lp(LOOSE, TIGHT, s.t)}};
    },
    deko(cx, s, R) {
      const tip = R.a.tip;
      cx.globalAlpha = 1 - (s.pfeil || 0); pill(cx, 'Leine unter Last', 294, 112, 'right'); cx.globalAlpha = 1;
      if (s.k != null || s.u < M[0] + 30) pill(cx, 'loses Ende', tip.x - 8, tip.y + 22, 'right');
      if (!s.pfeil) { cx.globalAlpha = .55; pfeil(cx, 236, 226, 286, 236); cx.globalAlpha = 1; pill(cx, 'Zug kommt von hier', 290, 252, 'right'); }
      if (s.pfeil) {
        const zug = (s.zug || 0) * 6; cx.globalAlpha = s.pfeil;
        pfeil(cx, tip.x + 16, tip.y + 34 - zug, tip.x + 16, tip.y - 4 - zug); pill(cx, '① Ende festziehen', tip.x + 28, tip.y + 14 - zug, 'left', '#9b2f24');
        pfeil(cx, 226 + zug, 222, 282 + zug, 232); pill(cx, '② Zug nach rechts', 290, 250, 'right', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Webleinstek auf Slip an der Reling: wie der Webeleinstek, aber das Ende geht nicht ganz durch.
   Nach dem zweiten Törn hängt das Ende unten (PRE). Dann wird statt des Endes eine Bucht unter der Kreuzung durchgesteckt (SLIP):
   beide Schenkel der Bucht liegen unter der Schrägen (dg), das Ende bleibt draußen. Ein Zug am Ende zieht die Bucht wieder heraus.
   Ebenen wie beim Webeleinstek: Stange 5, vorn 6/8, hinten 2. */
const SLIP = (() => {
  const Y = 105, R = 16, D = 45;  // gleiche Form wie der Webeleinstek, nur 45 Punkte höher (Platz für das hängende Ende)
  const Q = a => P(a.map(([x, y, l]) => [x, y - D, l]));
  const KNOT = [[164, 440, 'sv'], [164, 330, 'sv'], [164, 250, 'sv'], [164, 200, 'sv'], [164, 172, 'sv'], [164, 145, 'sv'], [165, 131, 'h1'], [169, 126, 'h1'], [175, 132, 'h1'],
    [192, 151, 'h1'], [205, 167, 'h1'], [208, 174, 'dg'], [202, 173, 'dg'], [186, 165, 'dg'], [160, 152, 'dg'], [132, 139, 'dg'], [113, 130, 'dg'], [106, 126, 'h2'], [101, 131, 'h2'],
    [96, 146, 'h2'], [91, 163, 'h2'], [91, 172, 'tl']];
  /* Ende hängt nach dem zweiten Törn herunter */
  const PRE = Q(KNOT.concat([...Array(18)].map((_, i) => [92 + i, 185 + i * 12.6, i === 16 ? 'end' : 'tl'])));
  /* Bucht unter der Kreuzung durch, Ende bleibt unten */
  const LOOSE = Q(KNOT.concat([[98, 174, 'tl'], [111, 167, 'tl'], [123, 156, 'tl'], [130, 143, 'tl'], [133, 130, 'tl'], [135, 119, 'tl'], [138, 111, 'tl'], [144, 108, 'tl'], [149, 112, 'tl'],
    [150, 122, 'tl'], [149, 134, 'tl'], [145, 147, 'tl'], [139, 161, 'tl'], [128, 175, 'tl'], [118, 187, 'tl'], [112, 202, 'tl'], [110, 218, 'end'], [109, 234, 'end']]));
  /* Zwischenpose: die Mitte des Endes ist zur Bucht hochgenommen und liegt unter der Kreuzung bereit */
  const KB = Q(KNOT.concat([[95, 188, 'tl'], [100, 203, 'tl'], [107, 214, 'tl'], [115, 219, 'tl'], [123, 216, 'tl'], [128, 208, 'tl'], [131, 199, 'tl'], [135, 194, 'tl'], [139, 198, 'tl'],
    [140, 207, 'tl'], [137, 218, 'tl'], [132, 230, 'tl'], [126, 243, 'tl'], [120, 256, 'tl'], [115, 270, 'tl'], [112, 286, 'tl'], [110, 302, 'end'], [109, 318, 'end']]));
  const IA = 4, I1 = 11, IB = 29, IE = LOOSE.length - 1;  // IB: Scheitel der Bucht
  const TIGHT = LOOSE.map((p, i) => i <= IA ? {...p, x: 158} : {x: 152 + (p.x - 152) * .74, y: Y + (p.y - Y) * .97, l: p.l});
  for (let i = IE - 2; i <= IE; i++) TIGHT[i] = {x: TIGHT[i].x - 3, y: TIGHT[i].y + 6, l: TIGHT[i].l};
  const M = [marke(PRE, IA), marke(PRE, I1), marke(PRE, PRE.length - 1)];
  const K0 = Q([[164, 440, 'sv'], [167, 330, 'sv'], [175, 262, 'sv'], [186, 222, 'sv'], [194, 196, 'sv']]);
  const def = {
    H: 380,
    seile: {a: {stil: 'gelb', tw: 13}},
    z: {sv: 6, h1: 2, dg: 8, h2: 2, tl: 6, end: 6},
    obj: [{z: 5, draw(cx) { /* Reling: Rohr mit zwei Stützen */
      for (const x of [22, 278]) { const g = cx.createLinearGradient(x - 8, 0, x + 8, 0); g.addColorStop(0, '#8d949b'); g.addColorStop(.45, '#e4e8ec'); g.addColorStop(1, '#7c838a'); cx.fillStyle = g; cx.fillRect(x - 8, Y, 16, 300); cx.strokeStyle = 'rgba(40,46,52,.45)'; cx.strokeRect(x - 8, Y, 16, 300); }
      cx.fillStyle = 'rgba(70,45,15,.16)'; cx.fillRect(0, Y - R + 4, 300, R * 2);
      const g = cx.createLinearGradient(0, Y - R, 0, Y + R); g.addColorStop(0, '#9aa1a8'); g.addColorStop(.35, '#f1f4f6'); g.addColorStop(.6, '#c3c9cf'); g.addColorStop(1, '#6f767d');
      cx.fillStyle = g; cx.fillRect(-2, Y - R, 304, R * 2); cx.strokeStyle = 'rgba(40,46,52,.55)'; cx.lineWidth = 1; cx.strokeRect(-2, Y - R, 304, R * 2);
    }}],
    phasen: [
      {st: 0, d: .8, f: () => ({k: 0})},
      {st: 0, d: 1.2, f: e => ({k: e})},
      {st: 0, d: 2.4, f: e => ({u: lerp(M[0], M[1], e)})},
      {st: 0, d: .5, f: () => ({u: M[1]})},
      {st: 1, d: 3.4, f: e => ({u: lerp(M[1], M[2], e)})},
      {st: 1, d: .5, f: () => ({u: M[2]})},
      {st: 2, d: 3.2, f: e => ({b: e})},
      {st: 2, d: .8, f: () => ({b: 1})},
      {st: 3, d: 1.1, f: e => ({t: 0, pfeil: e})},
      {st: 3, d: 2, f: e => ({t: e, pfeil: 1, zug: e})},
      {st: 3, d: .6, f: () => ({t: 1, pfeil: 1})},
      {st: 4, d: 1, f: e => ({los: 0, pf2: e})},
      {st: 4, d: 2.4, f: e => ({los: e, pf2: 1, zug: e})},
      {st: 4, d: .6, f: () => ({los: 1, pf2: 1})}
    ],
    form(s) {
      if (s.k != null) return {a: {cp: mitRest(lp(K0, PRE.slice(0, IA + 1), s.k), PRE), i: IA}};
      if (s.u != null) return {a: {cp: PRE, bis: s.u}};
      if (s.b != null) return {a: {cp: posen([PRE, KB, LOOSE], s.b)}};
      if (s.los != null) return {a: {cp: posen([TIGHT, LOOSE, KB, PRE], s.los)}};
      return {a: {cp: lp(LOOSE, TIGHT, s.t)}};
    },
    deko(cx, s, R) {
      const tip = R.a.tip;
      if (s.k != null || s.u < M[0] + 30) pill(cx, 'loses Ende', tip.x + 12, tip.y + 4);
      if (s.st === 2 && s.b > .6) { cx.globalAlpha = (s.b - .6) / .4; pill(cx, 'Bucht', 162, 56); pill(cx, 'Ende bleibt draußen', tip.x + 12, tip.y - 2); cx.globalAlpha = 1; }
      if (s.st < 3) pill(cx, 'zum Fender', 176, 300);
      if (s.pfeil) {
        const zug = (s.zug || 0) * 6, a = R.a.pts.find(p => p.s === IB) || tip; cx.globalAlpha = s.pfeil;
        pfeil(cx, a.x + 2, a.y - 6 - zug, a.x + 2, a.y - 40 - zug); pill(cx, '① Bucht festziehen', a.x + 14, a.y - 26 - zug, 'left', '#9b2f24');
        pfeil(cx, 182, 210 + zug, 182, 252 + zug); pill(cx, '② Fender zieht', 192, 232 + zug, 'left', '#9b2f24');
        cx.globalAlpha = 1;
      }
      if (s.pf2) {
        const zug = (s.zug || 0) * 10; cx.globalAlpha = s.pf2;
        pfeil(cx, tip.x - 16, tip.y - 20 + zug, tip.x - 16, tip.y + 18 + zug); pill(cx, '③ Lösen', tip.x - 26, tip.y - 2 + zug, 'right', '#9b2f24');
        cx.globalAlpha = 1;
      }
    }
  };
  return knotenAnim(def);
})();

/* Alle Animationen nach dem Feld "anim" in data/knoten.json */
const ANIM = {palstek: PAL, acht: ACHT, kreuz: KREUZ, schot: SCHOT, webelein: WEBE, webeleinslip: SLIP, stopper: STOPPER, rundtoern: RUND, klampe: KLAMPE};
KN.ANIM = ANIM;

/* Abspieler: zeichnet eine Animation A auf eine Leinwand, hält am Ende an. o: {von, bis, auto, schritt(st), zeit(t), fertig()} */
function spieler(cv, A, o = {}) {
  const dpr = Math.min(3, window.devicePixelRatio || 1); cv.width = A.W * dpr; cv.height = A.H * dpr;
  const cx = cv.getContext('2d'), von = o.von || 0, bis = o.bis != null ? o.bis : A.DUR;
  let t = von, play = o.auto !== false, last = 0, st = -1, gezeichnet = -1, raf = 0;
  const frame = now => {
    raf = 0; if (!cv.isConnected) return;
    if (play) { t = Math.min(bis, t + (last ? Math.min(.1, (now - last) / 1000) : 0)); last = now; if (t >= bis) { play = false; o.fertig && o.fertig(); } }
    if (t !== gezeichnet) { cx.setTransform(dpr, 0, 0, dpr, 0, 0); const s = A.draw(cx, t); gezeichnet = t; if (s.st !== st) { st = s.st; o.schritt && o.schritt(st); } o.zeit && o.zeit(t, play); }
    if (play) raf = requestAnimationFrame(frame);
  };
  const weiter = () => { if (!raf) raf = requestAnimationFrame(frame); };
  weiter();
  return {get spielt() { return play; }, play() { if (t >= bis) t = von; play = true; last = 0; weiter(); }, pause() { play = false; o.zeit && o.zeit(t, false); },
    seek(x) { t = Math.max(von, Math.min(bis, x)); last = 0; weiter(); }};
}

/* ---------- Knotenbrett: alle Knoten, je mit Animation, Schritten, Merkhilfe und Übung ---------- */
KN.brett = function () {
  returnTo = 'cabin';
  const k = K_();
  gameShell('Knotenbrett', `${CSS}<p class="small muted" style="margin:6px 0 10px">Die neun Knoten der praktischen Prüfung. Antippen: Schritt für Schritt zusehen und mit echtem Tau üben. Sicher ist ein Knoten, wenn er dreimal in der Knotenkunde richtig war und du ihn einmal mit echtem Tau gebunden hast.</p>
    <div class="knotgrid">${D.knoten.map(x => `<button data-k="${x.id}"><b>${k[x.id] && k[x.id].ok && (k[x.id].kk || 0) >= 3 ? '✓ ' : ''}${esc(x.name)}</b><span class="small muted">Knotenkunde ${Math.min(3, (k[x.id] && k[x.id].kk) || 0)} von 3 · echtes Tau ${k[x.id] && k[x.id].ok ? '✓' : 'offen'}</span>${k[x.id] && k[x.id].zeit ? `<span class="small muted">Bestzeit ${k[x.id].zeit} s · </span>` : ''}<span class="small muted">${esc(x.wofuer.split('. ')[0])}.</span></button>`).join('')}</div>`);
  $('#gback').onclick = () => setTab('cabin');
  app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { AUD.click(); KN.zeige(b.dataset.k); });
};
KN.zeige = function (id) {
  const k = byId(id), A = ANIM[k.anim], anim = !!A;
  gameShell(k.name, `${CSS}<div class="card">${anim ? `<canvas id="kanim" class="knotbild" role="img" aria-label="${esc(k.name)}: Animation"></canvas>
    <div class="row knotctl"><button class="btn small ghost" id="kneu" aria-label="Von vorn">⏮</button><button class="btn small" id="kplay">⏸ Pause</button><input type="range" id="kzeit" min="0" max="${anim ? A.DUR : 0}" step="0.05" value="0" aria-label="Zeit"></div>` : ''}
    <ol class="knotsteps${anim ? ' tipp' : ''}" id="kst">${k.schritte.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <p class="small" style="margin:6px 0 0">💡 ${esc(k.merk)}</p><p class="small muted" style="margin:6px 0 0"><b>Wofür:</b> ${esc(k.wofuer)}</p></div>
    <div class="row" style="margin-top:10px"><button class="btn lamp" id="kueb">🪢 Mit echtem Tau üben</button></div>`);
  $('#gback').onclick = () => KN.brett();
  const lis = [...app.querySelectorAll('#kst li')];
  $('#kueb').onclick = () => KN.ueben(id);
  if (!anim) { lis.forEach(li => li.classList.add('an')); return; }
  /* Animation: der gerade gezeigte Schritt ist hervorgehoben; Schritte antippen springt dorthin */
  const sl = $('#kzeit'), pb = $('#kplay');
  const sp = spieler($('#kanim'), A, {
    schritt: st => lis.forEach((li, i) => li.classList.toggle('an', i === st)),
    zeit: (t, laeuft) => { sl.value = t; pb.textContent = laeuft ? '⏸ Pause' : t >= A.DUR ? '▶ Nochmal' : '▶ Weiter'; }
  });
  pb.onclick = () => { AUD.click(); sp.spielt ? sp.pause() : sp.play(); };
  $('#kneu').onclick = () => { AUD.click(); sp.seek(0); sp.play(); };
  sl.oninput = () => { const v = +sl.value; sp.pause(); sp.seek(v); };
  lis.forEach((li, i) => li.onclick = () => { if (A.START[i] != null) { sp.seek(A.START[i]); sp.play(); } });
};
/* Übung mit echtem Tau: Zeit stoppen, dann selbst bewerten */
KN.ueben = function (id) {
  const k = byId(id); let t0 = 0, iv = null;
  gameShell('Üben: ' + k.name, `${CSS}<div class="card"><p style="margin:0">Nimm ein Stück Tau oder eine Kordel. Tippe auf Start, binde den <b>${esc(k.name)}</b> und tippe auf Fertig.</p><ol class="small" style="margin:8px 0 0;padding-left:20px">${k.schritte.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <div class="knotuhr" id="kuhr">0,0 s</div><div class="row" style="justify-content:center"><button class="btn lamp" id="kgo">Start</button></div><div id="kbew"></div></div>`);
  $('#gback').onclick = () => { clearInterval(iv); KN.zeige(id); };
  $('#kgo').onclick = () => {
    if (!t0) { t0 = performance.now(); AUD.click(); $('#kgo').textContent = 'Fertig'; iv = setInterval(() => { $('#kuhr').textContent = ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s'; }, 100); return; }
    clearInterval(iv); const sek = Math.round((performance.now() - t0) / 100) / 10; $('#kgo').remove();
    $('#kbew').innerHTML = `<p style="margin:10px 0 6px">Zieh kräftig dran. Hält der Knoten?</p><div class="row"><button class="btn lamp" id="kja">Hält ✓</button><button class="btn ghost" id="knein">Nochmal</button></div>`;
    $('#kja').onclick = () => { const r = K_()[id] = K_()[id] || {}; r.ok = 1; if (!r.zeit || sek < r.zeit) { r.zeit = sek; toast(`Neue Bestzeit: ${String(sek).replace('.', ',')} s`); } save(); AUD.sfx('richtig', {vol: .5}); KN.brett(); };
    $('#knein').onclick = () => KN.ueben(id);
  };
};

/* ---------- Spiel „Knotenkunde“: 8 Runden aus Wofür, Reihenfolge und „Was passiert hier?“ (ein Schritt einer Animation) ----------
   Knoten mit "doppelt" zählen bei Wofür und Reihenfolge nicht mit, sonst gäbe es zwei richtige Antworten. Verwandte Knoten ("verwandt") stehen nie zusammen zur Wahl. */
KN.spiel = function (test) {
  returnTo = 'cabin';
  const KL = D.knoten.filter(x => !x.doppelt), AN = D.knoten.filter(x => ANIM[x.anim]);
  const arten = test || shuffle(['wofuer', 'wofuer', 'wofuer', AN.length ? 'schritt' : 'wofuer', AN.length ? 'schritt' : 'wofuer', 'reihe', 'reihe', 'reihe']);
  let i = 0, score = 0;
  const runde = () => {
    if (i >= arten.length) {
      const nb = recordScore('knoten', score);
      gameShell('Knotenkunde', `${CSS}<div class="card"><h2 style="margin:0">${score} von ${arten.length} richtig</h2><p class="muted">${nb ? 'Neuer Rekord!' : 'Gut gebunden ist halb gesegelt.'}</p>
        <div class="row"><button class="btn lamp" id="knag">Nochmal</button><button class="btn ghost" id="knbr">Zum Knotenbrett</button></div></div>`);
      $('#gback').onclick = () => setTab('cabin'); $('#knag').onclick = () => KN.spiel(); $('#knbr').onclick = () => KN.brett(); return;
    }
    const art = arten[i], k = art === 'schritt' ? AN[Math.random() * AN.length | 0] : KL[Math.random() * KL.length | 0], andere = shuffle(KL.filter(x => x !== k && x.verwandt !== k.id && k.verwandt !== x.id)).slice(0, 3);
    const kopf = `<p class="small muted" style="margin:6px 0">Runde ${i + 1} von ${arten.length} · ${score} richtig</p>`;
    const weiter = (ok, text) => { if (ok) { score++; const r = K_()[k.id] = K_()[k.id] || {}; r.kk = (r.kk || 0) + 1; save(); } AUD.sfx(ok ? 'richtig' : 'falsch', {vol: ok ? .45 : .35}); $('#kfb').innerHTML = `<p style="margin:8px 0"><b style="color:var(${ok ? '--stb' : '--bb'})">${ok ? 'Richtig!' : 'Nicht ganz.'}</b> ${esc(text)}</p><button class="btn lamp" id="knx">Weiter</button>`; $('#knx').onclick = () => { i++; runde(); }; };
    if (art === 'reihe') {
      const order = shuffle(k.schritte.map((s, j) => j)); let pos = 0, fehler = false;
      gameShell('Knotenkunde', `${CSS}${kopf}<div class="card"><p style="margin:0 0 6px"><b>${esc(k.name)}:</b> Tippe die Schritte in der richtigen Reihenfolge.</p>
        <div class="menu" id="krs">${order.map(j => `<button class="menuitem" data-j="${j}">${esc(k.schritte[j])}</button>`).join('')}</div><div id="kfb"></div></div>`);
      app.querySelectorAll('[data-j]').forEach(b => b.onclick = () => {
        if (pos >= k.schritte.length) return; const j = +b.dataset.j;
        if (j === pos) { b.disabled = true; b.insertAdjacentHTML('afterbegin', `<b>${pos + 1}. </b>`); pos++; AUD.click(); if (pos === k.schritte.length) weiter(!fehler, fehler ? 'Mit einem Fehler geschafft. Schau dir die Reihenfolge am Knotenbrett noch mal an.' : 'Alle Schritte in der richtigen Reihenfolge.'); }
        else { fehler = true; b.classList.add('shake'); AUD.sfx('falsch', {vol: .25}); setTimeout(() => b.classList.remove('shake'), 400); }
      });
    } else if (art === 'schritt') {
      /* Ein Schritt einer Knoten-Animation läuft ab: Welcher ist es? */
      const A = ANIM[k.anim], n = Math.random() * Math.min(k.schritte.length, A.START.length) | 0, von = A.START[n], bis = n < A.START.length - 1 ? A.START[n + 1] - .05 : A.DUR;
      gameShell('Knotenkunde', `${CSS}${kopf}<div class="card"><p style="margin:0 0 6px"><b>${esc(k.name)}:</b> Was passiert hier gerade?</p><canvas id="kanim" class="knotbild" style="max-width:250px" role="img" aria-label="Ein Schritt: ${esc(k.name)}"></canvas>
        <div class="row" style="justify-content:center;margin-top:6px"><button class="btn small ghost" id="knoch">▶ Nochmal ansehen</button></div>
        <div class="menu" style="margin-top:8px">${shuffle(k.schritte.map((s, j) => j)).map(j => `<button class="menuitem" data-o="${j}">${esc(k.schritte[j])}</button>`).join('')}</div><div id="kfb"></div></div>`);
      const sp = spieler($('#kanim'), A, {von, bis});
      $('#knoch').onclick = () => { sp.seek(von); sp.play(); };
      app.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
        app.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; if (+x.dataset.o === n) x.classList.add('richtig'); });
        weiter(+b.dataset.o === n, `Das war Schritt ${n + 1} von ${k.schritte.length}.`);
      });
    } else {
      const opts = shuffle([k, ...andere]);
      const frage = `<p style="margin:0 0 6px"><b>Welcher Knoten passt?</b></p><p style="margin:0 0 6px">${esc(k.lage)}</p>`;
      gameShell('Knotenkunde', `${CSS}${kopf}<div class="card">${frage}<div class="menu" style="margin-top:8px">${opts.map(o => `<button class="menuitem" data-o="${o.id}">${esc(o.name)}</button>`).join('')}</div><div id="kfb"></div></div>`);
      app.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
        app.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; if (x.dataset.o === k.id) x.classList.add('richtig'); });
        weiter(b.dataset.o === k.id, `${k.name}: ${k.wofuer}`);
      });
    }
    $('#gback').onclick = () => setTab('cabin');
  };
  runde();
};
})();
