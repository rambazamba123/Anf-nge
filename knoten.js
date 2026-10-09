/* ==========================================================================
   Skipper – Knoten (V12): Knotenbrett in der Kajüte und Spiel „Knotenkunde“
   Wird erst bei Bedarf nachgeladen (loadKnoten in index.html). Daten: data/knoten.json.
   Die alten, schematischen Zeichnungen waren nicht korrekt und wurden entfernt (Nutzer, 10.10.2026).
   Neu: Palstek als echte Tau-Animation (PAL, Eintrag mit "anim" in knoten.json). Die übrigen Knoten: Schritte als Text.
   ========================================================================== */
(() => {
const KN = window.KNOTEN = window.KNOTEN || {};
let D = null;
KN.init = () => D ? Promise.resolve() : fetch('data/knoten.json?v=' + window.__ver).then(r => r.json()).then(j => { D = j; });
const byId = id => D.knoten.find(k => k.id === id);
const K_ = () => (S.knoten = S.knoten || {});

const CSS = `<style>.knotbild{width:100%;max-width:360px;display:block;margin:0 auto}.knotgrid{display:grid;grid-template-columns:1fr;gap:8px}
.knotgrid button{border:2px solid var(--line);background:var(--paper);border-radius:14px;padding:8px;color:var(--ink);text-align:left}.knotgrid b{display:block;font:700 .95rem var(--hfont);margin-top:4px}
.menuitem.richtig{border-color:var(--stb,#1e7f4f);box-shadow:inset 0 0 0 2px var(--stb,#1e7f4f)}.shake{animation:kshake .35s}@keyframes kshake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.knotsteps li{margin:4px 0;opacity:.45;transition:opacity .3s}.knotsteps li.an{opacity:1;font-weight:700}.knotsteps.tipp li{cursor:pointer}
canvas.knotbild{border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,.15)}.knotctl{align-items:center;gap:8px;margin:8px 0 2px;flex-wrap:nowrap}.knotctl>.btn{flex:0 0 auto;min-height:40px;padding:.4em .9em}.knotctl input{flex:1 1 auto;min-width:0}.knotneu{font-size:.75rem;color:var(--bb,#c2473b);font-weight:700}
@keyframes knotzieh{to{stroke-dashoffset:0}}.knotuhr{font:700 2.4rem var(--hfont);text-align:center;margin:8px 0}</style>`;

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
  const P = a => a.map(([x, y, l]) => ({x, y, l}));
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

  /* Zentripetale Catmull-Rom-Kurve durch die Punkte, dicht abgetastet; s = Abschnitt (für die Ebene) */
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
  /* Teilstück der Kurve zwischen den Bogenlängen m0 und m1, Enden genau eingesetzt */
  function slice(all, m0, m1) {
    m0 = Math.max(0, m0); m1 = Math.min(all[all.length - 1].m, m1);
    const q = [at(all, m0)]; q[0].m = m0;
    for (const p of all) if (p.m > m0 && p.m < m1) q.push(p);
    const e = at(all, m1); e.m = m1; q.push(e); return q;
  }
  const pathOf = (cx, pts) => { cx.beginPath(); cx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i].x, pts[i].y); };
  function at(pts, m) { let i = 1; while (i < pts.length - 1 && pts[i].m < m) i++; const a = pts[i - 1], b = pts[i], f = Math.max(0, Math.min(1, (m - a.m) / Math.max(1e-6, b.m - a.m))), dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; return {x: a.x + dx * f, y: a.y + dy * f, tx: dx / L, ty: dy / L}; }
  function strang(cx, pc) {
    const pts = pc.pts; if (pts.length < 2) return;
    cx.lineJoin = 'round'; cx.lineCap = 'butt';
    pathOf(cx, pc.extO || pts); cx.strokeStyle = RAND; cx.lineWidth = TW + 2.6; cx.stroke();
    pathOf(cx, pc.ext || pts); cx.strokeStyle = ROPE; cx.lineWidth = TW; cx.stroke();
    cx.strokeStyle = 'rgba(255,243,210,.55)'; cx.lineWidth = TW * .3; cx.stroke();
    /* Schlag des Taus: schräge Kardeele, die mit dem Tau mitwandern */
    const E = pc.ext || pts, sp = 4.2, r = TW / 2 - .6; cx.beginPath();
    for (let m = Math.ceil(E[0].m / sp) * sp; m < E[E.length - 1].m; m += sp) { const q = at(E, m), nx = -q.ty, ny = q.tx; cx.moveTo(q.x + nx * r + q.tx * 2, q.y + ny * r + q.ty * 2); cx.lineTo(q.x - nx * r - q.tx * 2, q.y - ny * r - q.ty * 2); }
    cx.strokeStyle = 'rgba(120,78,28,.42)'; cx.lineWidth = 1.2; cx.stroke();
  }
  function spitze(cx, pts) {
    const n = pts.length, q = at(pts, pts[n - 1].m), a = Math.atan2(q.ty, q.tx), tip = pts[n - 1];
    /* Takling (Garn um das Ende) */
    const band = pts.filter(p => p.m > tip.m - 8); if (band.length > 1) { pathOf(cx, band); cx.strokeStyle = '#2e3d5c'; cx.lineWidth = TW + .4; cx.stroke(); }
    cx.beginPath(); cx.arc(tip.x, tip.y, TW / 2, a - Math.PI / 2, a + Math.PI / 2); cx.fillStyle = '#2e3d5c'; cx.fill(); cx.strokeStyle = RAND; cx.lineWidth = 1.3; cx.stroke();
  }
  function pill(cx, txt, x, y, al = 'left', col = '#3b2a14') {
    cx.font = '700 11px Nunito, system-ui, sans-serif'; const w = cx.measureText(txt).width + 10, x0 = al === 'left' ? x : al === 'right' ? x - w : x - w / 2;
    cx.fillStyle = 'rgba(255,251,240,.93)'; cx.strokeStyle = 'rgba(90,62,30,.35)'; cx.lineWidth = 1; cx.beginPath(); cx.roundRect ? cx.roundRect(x0, y - 9, w, 17, 8) : cx.rect(x0, y - 9, w, 17); cx.fill(); cx.stroke();
    cx.fillStyle = col; cx.textBaseline = 'middle'; cx.fillText(txt, x0 + 5, y);
  }
  function pfeil(cx, x1, y1, x2, y2, col) {
    const a = Math.atan2(y2 - y1, x2 - x1); cx.strokeStyle = col; cx.fillStyle = col; cx.lineWidth = 4; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2 - Math.cos(a) * 8, y2 - Math.sin(a) * 8); cx.stroke();
    cx.beginPath(); cx.moveTo(x2, y2); cx.lineTo(x2 - Math.cos(a - .5) * 13, y2 - Math.sin(a - .5) * 13); cx.lineTo(x2 - Math.cos(a + .5) * 13, y2 - Math.sin(a + .5) * 13); cx.closePath(); cx.fill(); cx.lineCap = 'butt';
  }
  function draw(cx, t) {
    const s = stateAt(t), r = rope(s), pcs = pieces(r);
    cx.fillStyle = '#f4ead2'; cx.fillRect(0, 0, W, H);
    /* Schatten des ganzen Taus auf dem Brett */
    cx.save(); cx.translate(2.5, 3.5); pathOf(cx, r.pts); cx.strokeStyle = 'rgba(70,45,15,.16)'; cx.lineWidth = TW + 2; cx.lineJoin = 'round'; cx.stroke(); cx.restore();
    const last = pcs[pcs.length - 1];
    pcs.map((p, i) => ({p, i})).sort((a, b) => a.p.z - b.p.z || a.i - b.i).forEach(({p}) => { strang(cx, p); if (p === last) spitze(cx, p.pts); });
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

/* Abspieler: zeichnet die Animation auf eine Leinwand, hält am Ende an. o: {von, bis, auto, schritt(st), zeit(t), fertig()} */
function spieler(cv, o = {}) {
  const dpr = Math.min(3, window.devicePixelRatio || 1); cv.width = PAL.W * dpr; cv.height = PAL.H * dpr;
  const cx = cv.getContext('2d'), von = o.von || 0, bis = o.bis != null ? o.bis : PAL.DUR;
  let t = von, play = o.auto !== false, last = 0, st = -1, gezeichnet = -1, raf = 0;
  const frame = now => {
    raf = 0; if (!cv.isConnected) return;
    if (play) { t = Math.min(bis, t + (last ? Math.min(.1, (now - last) / 1000) : 0)); last = now; if (t >= bis) { play = false; o.fertig && o.fertig(); } }
    if (t !== gezeichnet) { cx.setTransform(dpr, 0, 0, dpr, 0, 0); const s = PAL.draw(cx, t); gezeichnet = t; if (s.st !== st) { st = s.st; o.schritt && o.schritt(st); } o.zeit && o.zeit(t, play); }
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
  gameShell('Knotenbrett', `${CSS}<p class="small muted" style="margin:6px 0 10px">Die Knoten für die praktische Prüfung. Antippen: Schritt für Schritt lesen und mit echtem Tau üben. Bilder zu den Knoten kommen später.</p>
    <div class="knotgrid">${D.knoten.map(x => `<button data-k="${x.id}"><b>${k[x.id] && k[x.id].ok ? '✓ ' : ''}${esc(x.name)}</b>${x.anim ? '<span class="knotneu">▶ mit Animation</span> ' : ''}${k[x.id] && k[x.id].zeit ? `<span class="small muted">Bestzeit ${k[x.id].zeit} s · </span>` : ''}<span class="small muted">${esc(x.wofuer.split('. ')[0])}.</span></button>`).join('')}</div>`);
  $('#gback').onclick = () => setTab('cabin');
  app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { AUD.click(); KN.zeige(b.dataset.k); });
};
KN.zeige = function (id) {
  const k = byId(id), anim = k.anim === 'palstek';
  gameShell(k.name, `${CSS}<div class="card">${anim ? `<canvas id="kanim" class="knotbild" role="img" aria-label="${esc(k.name)}: Animation"></canvas>
    <div class="row knotctl"><button class="btn small ghost" id="kneu" aria-label="Von vorn">⏮</button><button class="btn small" id="kplay">⏸ Pause</button><input type="range" id="kzeit" min="0" max="${PAL.DUR}" step="0.05" value="0" aria-label="Zeit"></div>` : ''}
    <ol class="knotsteps${anim ? ' tipp' : ''}" id="kst">${k.schritte.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <p class="small" style="margin:6px 0 0">💡 ${esc(k.merk)}</p><p class="small muted" style="margin:6px 0 0"><b>Wofür:</b> ${esc(k.wofuer)}</p></div>
    <div class="row" style="margin-top:10px"><button class="btn lamp" id="kueb">🪢 Mit echtem Tau üben</button></div>`);
  $('#gback').onclick = () => KN.brett();
  const lis = [...app.querySelectorAll('#kst li')];
  $('#kueb').onclick = () => KN.ueben(id);
  if (!anim) { lis.forEach(li => li.classList.add('an')); return; }
  /* Animation: der gerade gezeigte Schritt ist hervorgehoben; Schritte antippen springt dorthin */
  const sl = $('#kzeit'), pb = $('#kplay');
  const sp = spieler($('#kanim'), {
    schritt: st => lis.forEach((li, i) => li.classList.toggle('an', i === st)),
    zeit: (t, laeuft) => { sl.value = t; pb.textContent = laeuft ? '⏸ Pause' : t >= PAL.DUR ? '▶ Nochmal' : '▶ Weiter'; }
  });
  pb.onclick = () => { AUD.click(); sp.spielt ? sp.pause() : sp.play(); };
  $('#kneu').onclick = () => { AUD.click(); sp.seek(0); sp.play(); };
  sl.oninput = () => { const v = +sl.value; sp.pause(); sp.seek(v); };
  lis.forEach((li, i) => li.onclick = () => { sp.seek(PAL.START[i]); sp.play(); });
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

/* ---------- Spiel „Knotenkunde“: 8 Runden aus Wofür, Reihenfolge und (mit Animation) „Was passiert hier?“ ----------
   Knoten mit "doppelt" (z. B. der animierte Palstek) zählen bei Wofür und Reihenfolge nicht mit, sonst gäbe es zwei richtige Antworten. */
KN.spiel = function (test) {
  returnTo = 'cabin';
  const KL = D.knoten.filter(x => !x.doppelt), AN = D.knoten.find(x => x.anim === 'palstek');
  const arten = test || shuffle(['wofuer', 'wofuer', 'wofuer', 'wofuer', AN ? 'schritt' : 'wofuer', 'reihe', 'reihe', 'reihe']);
  let i = 0, score = 0;
  const runde = () => {
    if (i >= arten.length) {
      const nb = recordScore('knoten', score);
      gameShell('Knotenkunde', `${CSS}<div class="card"><h2 style="margin:0">${score} von ${arten.length} richtig</h2><p class="muted">${nb ? 'Neuer Rekord!' : 'Gut gebunden ist halb gesegelt.'}</p>
        <div class="row"><button class="btn lamp" id="knag">Nochmal</button><button class="btn ghost" id="knbr">Zum Knotenbrett</button></div></div>`);
      $('#gback').onclick = () => gamesHub(); $('#knag').onclick = () => KN.spiel(); $('#knbr').onclick = () => KN.brett(); return;
    }
    const art = arten[i], k = art === 'schritt' ? AN : KL[Math.random() * KL.length | 0], andere = shuffle(KL.filter(x => x !== k)).slice(0, 3);
    const kopf = `<p class="small muted" style="margin:6px 0">Runde ${i + 1} von ${arten.length} · ${score} richtig</p>`;
    const weiter = (ok, text) => { if (ok) score++; AUD.sfx(ok ? 'richtig' : 'falsch', {vol: ok ? .45 : .35}); $('#kfb').innerHTML = `<p style="margin:8px 0"><b style="color:var(${ok ? '--stb' : '--bb'})">${ok ? 'Richtig!' : 'Nicht ganz.'}</b> ${esc(text)}</p><button class="btn lamp" id="knx">Weiter</button>`; $('#knx').onclick = () => { i++; runde(); }; };
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
      /* Ein Schritt der Palstek-Animation läuft ab: Welcher ist es? */
      const n = Math.random() * k.schritte.length | 0, von = PAL.START[n], bis = n < 4 ? PAL.START[n + 1] - .05 : PAL.DUR;
      gameShell('Knotenkunde', `${CSS}${kopf}<div class="card"><p style="margin:0 0 6px"><b>Palstek:</b> Was passiert hier gerade?</p><canvas id="kanim" class="knotbild" style="max-width:250px" role="img" aria-label="Ein Schritt des Palsteks"></canvas>
        <div class="row" style="justify-content:center;margin-top:6px"><button class="btn small ghost" id="knoch">▶ Nochmal ansehen</button></div>
        <div class="menu" style="margin-top:8px">${shuffle(k.schritte.map((s, j) => j)).map(j => `<button class="menuitem" data-o="${j}">${esc(k.schritte[j])}</button>`).join('')}</div><div id="kfb"></div></div>`);
      const sp = spieler($('#kanim'), {von, bis});
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
    $('#gback').onclick = () => gamesHub();
  };
  runde();
};
})();
