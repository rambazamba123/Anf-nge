/* welt.js: 3D-Welt (Prototyp v5.11). Dritte Person wie bei GTA, bunte Spielzeugwelt, austauschbares Boot.
   Boot-Vertrag: ein THREE.Object3D, Bug zeigt nach +Z, Ursprung in der Mitte auf der Wasserlinie, Einheit Meter.
   Optional userData: laenge, breite, propeller, ruder, lichter {top, bb, sb, heck}, anker {katze: Vector3}.
   Ein fremdes Modell (zum Beispiel der 3D-Druck) wird mit WELT.normiere(obj, {laenge}) passend gemacht und mit WELT.setzeBoot(obj) eingesetzt. */
(function () {
'use strict';
const W = window.WELT = {}, $ = s => document.querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const cl = (v, a, b) => Math.max(a, Math.min(b, v)), TAU = Math.PI * 2, RAD = Math.PI / 180;
let T = null; /* THREE */

function css() {
  if (document.getElementById('weltcss')) return;
  const s = document.createElement('style'); s.id = 'weltcss';
  s.textContent = `.wt{position:relative;height:calc(100dvh - 215px);min-height:340px;border-radius:14px;overflow:hidden;background:#bfe6f5;touch-action:none;margin:0 0 8px}
  .wt canvas{width:100%;height:100%;display:block}
  .wt .hud{position:absolute;left:8px;top:8px;background:rgba(255,255,255,.82);border-radius:10px;padding:4px 9px;font-weight:800;font-size:13px;color:#2b3a4a}
  .wt .bub{position:absolute;left:8px;right:8px;top:44px;background:rgba(255,252,240,.95);border-radius:14px;padding:8px 11px;font-size:14px;color:#2b2118;box-shadow:0 2px 8px rgba(0,0,0,.18)}
  .wt .bub b{color:#b5563a}
  .wt .ruder,.wt .gas{position:absolute;bottom:10px;display:flex;gap:8px}
  .wt .ruder{left:10px}.wt .gas{right:10px;flex-direction:column-reverse}
  .wt .wb{width:62px;height:62px;border-radius:50%;border:3px solid #fff;background:rgba(240,181,62,.92);font-size:26px;font-weight:900;color:#3a2a10;box-shadow:0 2px 6px rgba(0,0,0,.3)}
  .wt .gas .wb{width:54px;height:54px;font-size:20px;background:rgba(61,95,143,.9);color:#fff}
  .wt .gas .wb.on{background:#f0b53e;color:#3a2a10}
  .wt .wb:active{transform:scale(.94)}
  .wtbar{display:flex;gap:6px;flex-wrap:wrap}.wtbar .btn{flex:1;min-width:70px}`;
  document.head.appendChild(s);
}

/* ---------- Bausteine ---------- */
let TOON = null;
function toonMap() { if (!TOON) { TOON = new T.DataTexture(new Uint8Array([170, 215, 255]), 3, 1, T.RedFormat); TOON.minFilter = TOON.magFilter = T.NearestFilter; TOON.needsUpdate = true; } return TOON; }
const mat = (c, o) => new T.MeshToonMaterial(Object.assign({color: c, gradientMap: toonMap()}, o || {}));
const flach = (c, o) => new T.MeshStandardMaterial(Object.assign({color: c, flatShading: true, roughness: .9}, o || {}));
function mesh(g, m, x, y, z) { const o = new T.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; }
function umriss(o, s) { const u = new T.Mesh(o.geometry, new T.MeshBasicMaterial({color: 0x24323f, side: T.BackSide})); u.scale.setScalar(s || 1.05); o.add(u); return o; }
function augen(g, y, z, d, r) { for (const s of [-1, 1]) { g.add(mesh(new T.SphereGeometry(r, 10, 8), new T.MeshBasicMaterial({color: 0xffffff}), s * d, y, z)); g.add(mesh(new T.SphereGeometry(r * .55, 8, 6), new T.MeshBasicMaterial({color: 0x1b1b1b}), s * d, y, z + r * .55)); } }

/* Rumpf aus Spanten: stationen s (0 Heck bis 1 Bug), Profil als Linienzug */
function loft(p, profil, farbe, outline) {
  const N = 22, pos = []; let K = 0;
  const st = []; for (let i = 0; i <= N; i++) { const s = i / N; st.push({s, z: (s - .5) * p.L, b: p.bf(s) * p.B / 2, t: p.tf(s) * p.T, f: p.F * (.88 + .5 * Math.pow(s, 2.6))}); }
  const lin = st.map(q => profil(q)); K = lin[0].length;
  for (let i = 0; i < N; i++) for (let k = 0; k < K - 1; k++) {
    const a = lin[i][k], b = lin[i][k + 1], c = lin[i + 1][k], d = lin[i + 1][k + 1], z0 = st[i].z, z1 = st[i + 1].z;
    pos.push(a[0], a[1], z0, c[0], c[1], z1, b[0], b[1], z0, b[0], b[1], z0, c[0], c[1], z1, d[0], d[1], z1);
  }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
  const m = new T.Mesh(g, mat(farbe, {side: T.DoubleSide, flatShading: true}));
  if (outline) umriss(m, outline); return m;
}
function bauRumpf(p) {
  const g = new T.Group(), sh = .14;
  const unter = q => { const o = []; for (let k = 0; k <= 10; k++) { const a = (-90 + 18 * k) * RAD; o.push([q.b * Math.sin(a), -q.t * Math.cos(a)]); } return o; };
  const links = (y0, y1) => q => [[-q.b, y0], [-q.b, y1 === 'f' ? q.f : y1]], rechts = (y0, y1) => q => [[q.b, y1 === 'f' ? q.f : y1], [q.b, y0]];
  g.add(loft(p, unter, p.c.unter));
  for (const f of [links, rechts]) { g.add(loft(p, f(0, sh), p.c.streifen)); g.add(loft(p, f(sh, 'f'), p.c.rumpf)); }
  /* Deck */
  const N = 22, pos = [];
  for (let i = 0; i < N; i++) { const s0 = i / N, s1 = (i + 1) / N, b0 = p.bf(s0) * p.B / 2, b1 = p.bf(s1) * p.B / 2, f0 = p.F * (.88 + .5 * Math.pow(s0, 2.6)), f1 = p.F * (.88 + .5 * Math.pow(s1, 2.6)), z0 = (s0 - .5) * p.L, z1 = (s1 - .5) * p.L; pos.push(-b0, f0, z0, b0, f0, z0, -b1, f1, z1, b0, f0, z0, b1, f1, z1, -b1, f1, z1); }
  const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); dg.computeVertexNormals();
  g.add(new T.Mesh(dg, mat(p.c.deck, {side: T.DoubleSide})));
  /* Heckspiegel */
  const hb = p.bf(0) * p.B / 2; g.add(mesh(new T.PlaneGeometry(hb * 2, p.F * .88 + p.T * .55 * .5), mat(p.c.rumpf, {side: T.DoubleSide}), 0, (p.F * .88 - p.T * .55 * .5) / 2 - .02, -p.L / 2));
  return g;
}
const HULL = {bf: s => s < .55 ? .93 + .07 * Math.sin(s / .55 * Math.PI * .5) : Math.max(.02, Math.pow(Math.cos((s - .55) / .45 * Math.PI / 2), .65)), tf: s => (.55 + .45 * Math.min(1, s / .3)) * (s > .72 ? 1 - .85 * (s - .72) / .28 : 1)};

function bauBoot(o) {
  o = Object.assign({art: 'kajuete', L: 9, B: 3.1, T: .7, F: 1, name: 'SKIPPER', mast: 'liegt', katze: true, nacht: false}, o || {});
  const c = Object.assign({rumpf: 0xfdf8ee, streifen: 0xe0503c, unter: 0x2f5f8f, deck: 0xc99a66, kajuete: 0xfdf8ee, dach: 0x3f7fb3, fenster: 0x274b66}, o.farben || {});
  const p = Object.assign({}, HULL, {L: o.L, B: o.B, T: o.T, F: o.F, c});
  const b = new T.Group(); b.add(bauRumpf(p));
  const lichter = {};
  if (o.art === 'kajuete') {
    const kb = o.B * .62, kh = 1.15, kl = o.L * .38, kz = -o.L * .06, y0 = o.F * .95;
    const kk = mesh(new T.BoxGeometry(kb, kh, kl), mat(c.kajuete), 0, y0 + kh / 2, kz); umriss(kk, 1.04); b.add(kk);
    const dach = mesh(new T.BoxGeometry(kb + .3, .13, kl + .35), mat(c.dach), 0, y0 + kh + .06, kz); umriss(dach, 1.04); b.add(dach);
    for (const s of [-1, 1]) for (const k of [-1, 0, 1]) b.add(mesh(new T.PlaneGeometry(kl * .26, kh * .5), mat(c.fenster, {side: T.DoubleSide}), s * (kb / 2 + .01), y0 + kh * .58, kz + k * kl * .31)).rotation.y = Math.PI / 2;
    b.add(mesh(new T.PlaneGeometry(kb * .8, kh * .5), mat(c.fenster, {side: T.DoubleSide}), 0, y0 + kh * .58, kz + kl / 2 + .01));
    lichter.top = mesh(new T.SphereGeometry(.13, 10, 8), new T.MeshBasicMaterial({color: 0x555555}), 0, y0 + kh + .45, kz + kl * .2); b.add(lichter.top);
    b.add(mesh(new T.CylinderGeometry(.04, .04, .4, 6), mat(0x555555), 0, y0 + kh + .27, kz + kl * .2));
    b.userData.anker = {katze: new T.Vector3(0, y0 + kh + .13, kz - kl * .15)};
    if (o.mast === 'liegt') { for (const s of [-1]) { const m = mesh(new T.CylinderGeometry(.06, .08, o.L * .8, 8), mat(0xb9885a), s * (kb / 2 + .28), y0 + .28, 0); m.rotation.x = Math.PI / 2; b.add(m); } for (const z of [-.28, .28]) b.add(mesh(new T.BoxGeometry(.1, .28, .16), mat(0x8a6a4a), -(kb / 2 + .28), y0 + .14, o.L * z * .8)); }
  } else { /* offenes Boot mit Außenborder */
    b.add(mesh(new T.BoxGeometry(o.B * .8, .1, .5), mat(c.dach), 0, o.F + .5, -o.L * .12));
    b.userData.anker = {katze: new T.Vector3(0, o.F + .6, -o.L * .12)};
    lichter.top = mesh(new T.SphereGeometry(.12, 10, 8), new T.MeshBasicMaterial({color: 0x555555}), 0, o.F + 1.2, -o.L * .3); b.add(lichter.top); b.add(mesh(new T.CylinderGeometry(.03, .03, .7, 6), mat(0x555555), 0, o.F + .85, -o.L * .3));
  }
  /* Seitenlichter und Hecklicht */
  const kug = col => mesh(new T.SphereGeometry(.14, 10, 8), new T.MeshBasicMaterial({color: col}), 0, 0, 0);
  lichter.bb = kug(0x552222); lichter.bb.position.set(-o.B * .3, o.F * 1.2 + .1, o.L * .3); lichter.sb = kug(0x225522); lichter.sb.position.set(o.B * .3, o.F * 1.2 + .1, o.L * .3);
  lichter.heck = kug(0x555555); lichter.heck.position.set(0, o.F + .5, -o.L / 2 + .15); b.add(lichter.bb, lichter.sb, lichter.heck);
  /* Reling-Pfosten am Bug und Heck */
  for (const s of [-1, 1]) for (const z of [-.45, -.3, .1, .3, .38]) b.add(mesh(new T.CylinderGeometry(.03, .03, .45, 5), mat(0xe9eef2), s * p.bf(z + .5) * o.B / 2 * .94, o.F * (.88 + .5 * Math.pow(z + .5, 2.6)) + .22, z * o.L));
  /* Antrieb unter Wasser */
  const prop = new T.Group(); prop.position.set(0, -o.T * .45, -o.L / 2 + .7);
  for (let k = 0; k < 3; k++) { const fl = mesh(new T.BoxGeometry(.06, .5, .12), mat(0xd8a640)); fl.position.y = .22; const h = new T.Group(); h.rotation.z = k * TAU / 3; h.add(fl); prop.add(h); }
  prop.add(mesh(new T.SphereGeometry(.1, 8, 6), mat(0x888888))); b.add(prop);
  const rud = new T.Group(); rud.position.set(0, -o.T * .45, -o.L / 2 + .3); rud.add(mesh(new T.BoxGeometry(.05, .75, .5), mat(0x2f5f8f), 0, -.15, -.2)); b.add(rud);
  b.userData = Object.assign(b.userData, {laenge: o.L, breite: o.B, propeller: prop, ruder: rud, lichter, nacht: lichter});
  return b;
}
W.bauBoot = bauBoot;
/* fremdes Modell passend machen: skaliert auf Länge, Bug nach +Z (achse '+x' '-x' '-z' …), Mitte auf die Wasserlinie */
W.normiere = function (obj, opt) {
  opt = Object.assign({laenge: 9, achse: '+z', wasserlinie: .3}, opt || {});
  const g = new T.Group(); g.add(obj); const turn = {'+z': 0, '-z': Math.PI, '+x': -Math.PI / 2, '-x': Math.PI / 2}[opt.achse] || 0; obj.rotation.y = turn;
  const bx = new T.Box3().setFromObject(g), sz = bx.getSize(new T.Vector3()), ct = bx.getCenter(new T.Vector3()), k = opt.laenge / sz.z;
  obj.scale.multiplyScalar(k); obj.position.set(-ct.x * k, -(bx.min.y + sz.y * opt.wasserlinie) * k, -ct.z * k);
  g.userData = {laenge: opt.laenge, breite: sz.x * k, anker: {katze: new T.Vector3(0, sz.y * k * .7, 0)}};
  return g;
};

/* ---------- Kleine Wesen ---------- */
function katze() {
  const g = new T.Group(), f = mat(0xf0a24a);
  g.add(umriss(mesh(new T.SphereGeometry(.28, 12, 10), f, 0, .26, 0), 1.08));
  const kopf = umriss(mesh(new T.SphereGeometry(.2, 12, 10), f, 0, .62, .18), 1.1); g.add(kopf);
  for (const s of [-1, 1]) { const o = mesh(new T.ConeGeometry(.07, .15, 4), f, s * .12, .8, .16); g.add(o); }
  augen(g, .66, .33, .08, .045); g.add(mesh(new T.SphereGeometry(.03, 6, 5), new T.MeshBasicMaterial({color: 0xd66a6a}), 0, .6, .38));
  const schwanz = mesh(new T.CylinderGeometry(.04, .05, .5, 6), f, 0, .45, -.32); schwanz.rotation.x = -.8; g.add(schwanz); g.userData.schwanz = schwanz;
  g.scale.setScalar(1.15); return g;
}
function moewe() {
  const g = new T.Group(), w = mat(0xffffff), fl = [];
  g.add(umriss(mesh(new T.SphereGeometry(.22, 10, 8), w), 1.1)); g.children[0].scale.set(.8, .8, 1.5);
  g.add(mesh(new T.SphereGeometry(.14, 10, 8), w, 0, .08, .32)); g.add(mesh(new T.ConeGeometry(.04, .14, 5), mat(0xf0b53e), 0, .06, .5)).rotation.x = Math.PI / 2;
  augen(g, .12, .38, .07, .035);
  for (const s of [-1, 1]) { const a = new T.Group(); a.add(mesh(new T.BoxGeometry(.7, .03, .3), w, s * .35, 0, 0)); g.add(a); fl.push([a, s]); }
  g.userData.fl = fl; g.scale.setScalar(1.3); return g;
}
function seehund() {
  const g = new T.Group(), f = mat(0x9aa4ad);
  g.add(umriss(mesh(new T.SphereGeometry(.42, 14, 10), f, 0, 0, 0), 1.07)); g.add(mesh(new T.SphereGeometry(.17, 10, 8), mat(0x6c7680), 0, -.08, .38));
  augen(g, .12, .32, .15, .07); g.add(mesh(new T.SphereGeometry(.05, 8, 6), new T.MeshBasicMaterial({color: 0x222222}), 0, -.02, .46));
  for (const s of [-1, 1]) g.add(mesh(new T.CylinderGeometry(.003, .003, .22, 3), new T.MeshBasicMaterial({color: 0xffffff}), s * .1, -.08, .5)).rotation.z = Math.PI / 2;
  return g;
}
function tonne(farbe, kenn) {
  const g = new T.Group(), c = kenn === 'rot' ? 0xe0503c : 0x4aa361;
  const koerper = umriss(mesh(new T.CylinderGeometry(.55, .85, 1.3, 14), mat(c), 0, .55, 0), 1.07); g.add(koerper);
  g.add(mesh(new T.CylinderGeometry(.14, .14, 1.4, 8), mat(0x5a4a3a), 0, 1.7, 0));
  const top = kenn === 'rot' ? mesh(new T.CylinderGeometry(.34, .34, .6, 10), mat(c), 0, 2.5, 0) : mesh(new T.ConeGeometry(.38, .7, 10), mat(c), 0, 2.5, 0);
  g.add(umriss(top, 1.08));
  const licht = mesh(new T.SphereGeometry(.2, 10, 8), new T.MeshBasicMaterial({color: 0x444444}), 0, 3.05, 0); g.add(licht);
  g.userData = {licht, c, kenn}; return g;
}
function insel() {
  const g = new T.Group();
  g.add(umriss(mesh(new T.CylinderGeometry(14, 20, 3, 16), mat(0xf0dc9a), 0, 0, 0), 1.03));
  g.add(mesh(new T.CylinderGeometry(10, 12, 1.2, 16), mat(0x7cc067), 0, 1.7, 0));
  const turm = umriss(mesh(new T.CylinderGeometry(1.6, 2.4, 9, 12), mat(0xfdf8ee), 0, 6.5, 0), 1.04); g.add(turm);
  for (const y of [4.5, 7.5]) g.add(mesh(new T.CylinderGeometry(1.9 - y * .03, 2, 1.4, 12), mat(0xe0503c), 0, y, 0));
  g.add(mesh(new T.CylinderGeometry(1.9, 1.9, 1.6, 12), mat(0x3a4a5a), 0, 11.8, 0));
  const lampe = mesh(new T.SphereGeometry(1.1, 10, 8), new T.MeshBasicMaterial({color: 0x444444}), 0, 11.8, 0); g.add(lampe);
  g.add(mesh(new T.ConeGeometry(2.2, 1.8, 12), mat(0xe0503c), 0, 13.5, 0));
  for (const [x, z, h] of [[6, 4, 2.4], [-7, 3, 1.8], [4, -7, 2.1]]) { g.add(mesh(new T.CylinderGeometry(.25, .35, h, 6), mat(0x8a6a4a), x, 2.2 + h / 2, z)); g.add(umriss(mesh(new T.SphereGeometry(1.5, 10, 8), mat(0x3f9a5b), x, 2.2 + h + .8, z), 1.05)); }
  g.userData.lampe = lampe; return g;
}
function wolke() { const g = new T.Group(), m = new T.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: .93}); for (const [x, y, z, r] of [[0, 0, 0, 7], [7, -1, 1, 5], [-7, -1, -1, 5.5], [3, 3, 0, 5]]) g.add(mesh(new T.SphereGeometry(r, 10, 8), m, x, y, z)); g.scale.y = .55; return g; }

/* ---------- Die Welt ---------- */
W.seite = async function () {
  css();
  gameShell('3D-Welt (Test)', `<div class="wt" id="wt"><div class="hud" id="wthud">Kurs 000° · 0,0 kn</div><div class="bub" id="wtbub"></div>
    <div class="ruder"><button class="wb" id="wtl" aria-label="Links">◀</button><button class="wb" id="wtr" aria-label="Rechts">▶</button></div>
    <div class="gas"><button class="wb" id="wtg2">▲▲</button><button class="wb" id="wtg1">▲</button><button class="wb on" id="wtg0">■</button><button class="wb" id="wtgr">▼</button></div></div>
    <div class="wtbar"><button class="btn small" data-cam="hinten">🎥 Hinter dem Boot</button><button class="btn small ghost" data-cam="seite">↔ Seite</button><button class="btn small ghost" data-cam="oben">⬆ Oben</button><button class="btn small ghost" data-cam="schau">🔍 Nah</button>
    <button class="btn small ghost" id="wtnacht">🌙 Nacht</button><button class="btn small ghost" id="wttausch">🔁 Anderes Boot</button></div>
    <p class="small muted" style="margin:8px 0 0">Wischen dreht die Kamera, zwei Finger zoomen. ◀ ▶ lenken, ▲ ▼ Gas. Fahre zwischen den Tonnen durch.</p>`);
  const host = $('#wt'), back = $('#gback');
  try { await window.nachladen('lib/three.min.js'); } catch (e) { host.innerHTML = '<p style="padding:16px">3D ließ sich nicht laden.</p>'; return; }
  T = window.THREE; if (!document.body.contains(host)) return;
  let r;
  try { r = new T.WebGLRenderer({antialias: true}); } catch (e) { host.innerHTML = '<p style="padding:16px">Dein Gerät kann kein 3D (WebGL) zeigen.</p>'; return; }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75); r.setPixelRatio(dpr); host.insertBefore(r.domElement, host.firstChild);
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(55, 1, .5, 700);
  const TAG = {himmel: 0xbfe6f5, nebel: 0xcdeaf3, sonne: 2.4, hemi: 2.3, wasser: 0x52bdd2, kamm: 0xa9e6ee}, NACHT = {himmel: 0x16223f, nebel: 0x1d2c50, sonne: .5, hemi: .9, wasser: 0x1f4a73, kamm: 0x3b7098};
  let nacht = false; scene.background = new T.Color(TAG.himmel); scene.fog = new T.Fog(TAG.nebel, 120, 420);
  const hemi = new T.HemisphereLight(0xffffff, 0x6a8fa8, TAG.hemi), sun = new T.DirectionalLight(0xfff2d8, TAG.sonne); sun.position.set(40, 80, 30); scene.add(hemi, sun);
  /* Wasser: flache Dreiecke, folgt dem Boot */
  const WS = 300, WN = 64, wg = new T.PlaneGeometry(WS, WS, WN, WN); wg.rotateX(-Math.PI / 2);
  const wp = wg.attributes.position, wfarbe = new Float32Array(wp.count * 3); wg.setAttribute('color', new T.BufferAttribute(wfarbe, 3));
  const wm = new T.Mesh(wg, new T.MeshLambertMaterial({vertexColors: true, flatShading: true})); scene.add(wm);
  const baseXZ = Array.from({length: wp.count}, (_, i) => [wp.getX(i), wp.getZ(i)]);
  const welle = (x, z, t) => Math.sin(x * .11 + t * .9) * .38 + Math.sin(z * .14 - t * 1.1) * .3 + Math.sin((x + z) * .07 + t * .6) * .35;
  /* Orte */
  const ins = insel(); ins.position.set(75, 0, -140); scene.add(ins);
  const rot = tonne(0, 'rot'), gruen = tonne(0, 'gruen'); rot.position.set(-18, 0, -70); gruen.position.set(18, 0, -70); scene.add(rot, gruen);
  const hund = seehund(); hund.position.set(24, 0, -64); scene.add(hund);
  const wolken = [[-90, 60, -120], [60, 75, -200], [130, 65, 20], [-140, 70, -10]].map(([x, y, z]) => { const w = wolke(); w.position.set(x, y, z); scene.add(w); return w; });
  const fremd = bauBoot({art: 'kajuete', L: 14, B: 4.2, T: 1, F: 1.3, name: 'FREMD', mast: 'steht', katze: false, farben: {rumpf: 0x3b8f8a, streifen: 0xf0b53e, unter: 0x24483f, dach: 0xe0503c}}); scene.add(fremd);
  const moewen = [0, 1].map(i => { const m = moewe(); scene.add(m); return m; });
  /* Spieler-Boot (austauschbar) */
  const spieler = {h: 0, x: 0, z: 0, v: 0, gas: 0, ruder: 0, ruderZiel: 0, boot: null}; const katzeFig = katze();
  const BOOTE = [() => bauBoot({art: 'kajuete'}), () => bauBoot({art: 'offen', L: 6, B: 2.2, T: .45, F: .7, mast: 'steht', farben: {streifen: 0x4aa361, dach: 0xf0b53e, rumpf: 0xffe9c2}})]; let bi = 0;
  W.setzeBoot = obj => { if (spieler.boot) scene.remove(spieler.boot); spieler.boot = obj; scene.add(obj); const a = (obj.userData.anker || {}).katze; katzeFig.parent && katzeFig.parent.remove(katzeFig); obj.add(katzeFig); katzeFig.position.copy(a || new T.Vector3(0, 1.5, 0)); setzeNacht(); };
  W.setzeBoot(BOOTE[0]());
  function setzeNacht() {
    const Z = nacht ? NACHT : TAG; scene.background.setHex(Z.himmel); scene.fog.color.setHex(Z.nebel); hemi.intensity = Z.hemi; sun.intensity = Z.sonne;
    for (const b of [spieler.boot, fremd]) { const l = (b.userData || {}).lichter; if (!l) continue; const on = nacht; l.top.material.color.setHex(on ? 0xffffee : 0x555555); l.heck.material.color.setHex(on ? 0xffffee : 0x555555); l.bb.material.color.setHex(on ? 0xff2a2a : 0x552222); l.sb.material.color.setHex(on ? 0x2aff4a : 0x225522); }
    ins.userData.lampe.material.color.setHex(nacht ? 0xfff2a0 : 0x444444); $('#wtnacht') && ($('#wtnacht').textContent = nacht ? '☀️ Tag' : '🌙 Nacht');
  }
  /* Kamera: dritte Person */
  const K = {yaw: 0, pitch: .32, dist: 17, lock: false, last: 0, preset: 'hinten', pos: new T.Vector3(0, 6, -17), blick: new T.Vector3()};
  const PRE = {hinten: {pitch: .32, dist: 17, yaw: 0, lock: false}, seite: {pitch: .12, dist: 20, yaw: Math.PI / 2, lock: true}, oben: {pitch: 1.5, dist: 32, yaw: 0, lock: true}, schau: {pitch: .22, dist: 11, yaw: .9, lock: true}};
  document.querySelectorAll('[data-cam]').forEach(b => b.onclick = () => { const p = PRE[b.dataset.cam]; Object.assign(K, p, {preset: b.dataset.cam}); document.querySelectorAll('[data-cam]').forEach(x => x.classList.toggle('ghost', x !== b)); });
  const cv = r.domElement, ptr = new Map(); let pinch = 0;
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); K.last = performance.now(); });
  cv.addEventListener('pointermove', e => { const q = ptr.get(e.pointerId); if (!q) return; const dx = e.clientX - q[0], dy = e.clientY - q[1]; q[0] = e.clientX; q[1] = e.clientY;
    if (ptr.size === 2) { const [a, b] = [...ptr.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) K.dist = cl(K.dist * pinch / d, 6, 60); pinch = d; return; }
    K.yaw -= dx * .008; K.pitch = cl(K.pitch + dy * .006, .05, 1.5); K.last = performance.now(); });
  const loslass = e => { ptr.delete(e.pointerId); pinch = 0; }; cv.addEventListener('pointerup', loslass); cv.addEventListener('pointercancel', loslass);
  cv.addEventListener('wheel', e => { e.preventDefault(); K.dist = cl(K.dist * (1 + Math.sign(e.deltaY) * .1), 6, 60); }, {passive: false});
  /* Bedienung */
  const halten = (id, f) => { const b = $(id); const an = e => { e.preventDefault(); f(true); }, aus = () => f(false); b.addEventListener('pointerdown', an); ['pointerup', 'pointerleave', 'pointercancel'].forEach(n => b.addEventListener(n, aus)); };
  let links = false, rechts = false; halten('#wtl', v => links = v); halten('#wtr', v => rechts = v);
  const GAS = [['#wtgr', -1], ['#wtg0', 0], ['#wtg1', 1], ['#wtg2', 2]];
  GAS.forEach(([id, g]) => $(id).onclick = () => { spieler.gas = g; GAS.forEach(([i, v]) => $(i).classList.toggle('on', v === g)); });
  const taste = e => { const d = e.type === 'keydown'; if (e.key === 'ArrowLeft' || e.key === 'a') links = d; else if (e.key === 'ArrowRight' || e.key === 'd') rechts = d; else if (d && (e.key === 'ArrowUp' || e.key === 'w')) $(GAS[Math.min(3, GAS.findIndex(([, v]) => v === spieler.gas) + 1)][0]).click(); else if (d && (e.key === 'ArrowDown' || e.key === 's')) $(GAS[Math.max(0, GAS.findIndex(([, v]) => v === spieler.gas) - 1)][0]).click(); };
  window.addEventListener('keydown', taste); window.addEventListener('keyup', taste);
  $('#wtnacht').onclick = () => { nacht = !nacht; setzeNacht(); };
  $('#wttausch').onclick = () => { bi = (bi + 1) % BOOTE.length; W.setzeBoot(BOOTE[bi]()); say('hinnerk', 'Anderes Boot, gleiche Welt. So tauschen wir später unser echtes Schiff ein.'); };
  /* Crew spricht über das, was man sieht */
  const bub = $('#wtbub'); let bubT = 0;
  function say(wer, t, ms) { const n = ({hinnerk: 'Käpt\'n', smilla: 'Smilla', klabauter: 'Klabauter'})[wer]; bub.innerHTML = `<b>${n}:</b> ${esc(t)}`; bub.style.display = ''; clearTimeout(bubT); bubT = setTimeout(() => bub.style.display = 'none', ms || 7000); try { window.VOX && VOX.say(wer, t, 'local'); } catch (e) {} }
  say('smilla', 'Zwischen den Tonnen durch: Rot liegt links an Backbord, Grün rechts an Steuerbord. Probier es aus.', 9000);
  let tor = 0, hundSag = false;
  /* Spurwelle */
  const spur = []; const spm = new T.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: .8, depthWrite: false}), spg = new T.CircleGeometry(.5, 10); spg.rotateX(-Math.PI / 2);
  for (let i = 0; i < 40; i++) { const m = new T.Mesh(spg, spm.clone()); m.visible = false; scene.add(m); spur.push({m, t: 9}); } let spurI = 0, spurT = 0;
  /* Größe */
  const gr = () => { const w = host.clientWidth, h = host.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  new ResizeObserver(gr).observe(host); gr();
  /* Schleife */
  let t0 = performance.now(), alt = t0, laufend = true, fpsN = 0, fpsT = t0; W.fps = 0;
  function schritt(now) {
    if (!laufend) return; if (!host.isConnected) { ende(); return; } requestAnimationFrame(schritt);
    const dt = Math.min(.05, (now - alt) / 1000); alt = now; const t = (now - t0) / 1000, S = spieler, B = S.boot;
    /* Fahren */
    const vmax = [-1.6, 0, 2.2, 6][S.gas + 1]; S.v += (vmax - S.v) * Math.min(1, dt * (S.gas === 0 ? .5 : .8));
    S.ruderZiel = (rechts ? 1 : 0) - (links ? 1 : 0); S.ruder += (S.ruderZiel - S.ruder) * Math.min(1, dt * 5);
    const wirk = Math.min(1, Math.abs(S.v) / 1.5), radeff = S.gas > 0 ? -.03 : S.gas < 0 ? .06 : 0; /* Radeffekt: vorwärts Heck nach Steuerbord, rückwärts nach Backbord */
    S.h += (S.ruder * wirk * .42 * Math.sign(S.v || 1) + radeff * (S.gas !== 0 ? 1 : 0)) * dt;
    S.x += Math.sin(S.h) * S.v * dt; S.z -= Math.cos(S.h) * S.v * dt;
    B.position.set(S.x, welle(S.x, S.z, t) * .55 + .25, S.z);
    const nick = (welle(S.x + Math.sin(S.h) * 3, S.z - Math.cos(S.h) * 3, t) - welle(S.x - Math.sin(S.h) * 3, S.z + Math.cos(S.h) * 3, t)) * .08, roll = Math.sin(t * 1.3) * .035 - S.ruder * wirk * .07 + Math.sin(t * .7) * .02;
    B.rotation.set(-nick - Math.min(.07, S.v * .012), Math.PI - S.h, roll, 'YXZ');
    const u = B.userData; if (u.propeller) u.propeller.rotation.z += S.gas * dt * 14; if (u.ruder) u.ruder.rotation.y = -S.ruder * .5;
    /* Spur */
    spurT += dt; if (spurT > .09 && Math.abs(S.v) > .8) { spurT = 0; const sp = spur[spurI++ % spur.length], L = (u.laenge || 9) / 2; sp.t = 0; sp.m.visible = true; sp.m.position.set(S.x - Math.sin(S.h) * L, .12 + B.position.y * .2, S.z + Math.cos(S.h) * L); sp.m.scale.setScalar(1.2 + Math.abs(S.v) * .25); }
    for (const sp of spur) if (sp.m.visible) { sp.t += dt; sp.m.scale.multiplyScalar(1 + dt * .5); sp.m.material.opacity = Math.max(0, .75 - sp.t * .25); if (sp.t > 3) sp.m.visible = false; }
    /* Wasser */
    const cx = Math.round(S.x / 4.7) * 4.7, cz = Math.round(S.z / 4.7) * 4.7; wm.position.set(cx, 0, cz);
    const cw = new T.Color(nacht ? NACHT.wasser : TAG.wasser), ck = new T.Color(nacht ? NACHT.kamm : TAG.kamm), tmp = new T.Color();
    for (let i = 0; i < wp.count; i++) { const [bx, bz] = baseXZ[i], h = welle(bx + cx, bz + cz, t); wp.setY(i, h * .55); tmp.copy(cw).lerp(ck, cl((h + .6) * .55, 0, 1)); wfarbe[i * 3] = tmp.r; wfarbe[i * 3 + 1] = tmp.g; wfarbe[i * 3 + 2] = tmp.b; }
    wp.needsUpdate = true; wg.attributes.color.needsUpdate = true; wg.computeVertexNormals();
    /* Welt bewegen */
    for (const q of [rot, gruen]) { q.position.y = welle(q.position.x, q.position.z, t) * .55 - .1; q.rotation.z = Math.sin(t * 1.1 + q.position.x) * .05; q.userData.licht.material.color.setHex(nacht && (Math.floor(t * 1.2) % 2 === 0) ? (q.userData.kenn === 'rot' ? 0xff2a2a : 0x2aff4a) : 0x444444); }
    hund.position.y = -.05 + Math.sin(t * .8) * .12 + welle(hund.position.x, hund.position.z, t) * .5; hund.rotation.y = Math.sin(t * .3) * .6 + Math.PI;
    wolken.forEach((w, i) => { w.position.x += dt * (1.2 + i * .3); if (w.position.x > 220) w.position.x = -220; });
    moewen.forEach((m, i) => { const a = t * (.35 + i * .08) + i * 3, R = 26 + i * 14; m.position.set(S.x + Math.cos(a) * R, 13 + Math.sin(t * .8 + i) * 1.5, S.z + Math.sin(a) * R); m.rotation.set(0, -a, 0); m.rotation.z = -.25; m.userData.fl.forEach(([w, s]) => w.rotation.z = s * Math.sin(t * 7 + i) * .55); });
    const sc = katzeFig.userData.schwanz; if (sc) sc.rotation.z = Math.sin(t * 2.3) * .5;
    /* Fremdes Schiff fährt einen Kreis um die Insel-Bucht */
    const fa = t * .035, FR = 95; fremd.position.set(Math.cos(fa) * FR - 30, welle(Math.cos(fa) * FR, Math.sin(fa) * FR, t) * .5 + .3, Math.sin(fa) * FR - 200); fremd.rotation.y = -fa + Math.PI; fremd.rotation.z = Math.sin(t * .9) * .03;
    /* Crew-Kommentare */
    const dz = S.z + 70; if (tor === 0 && Math.abs(dz) < 14 && Math.hypot(S.x, dz) < 40) { tor = 1; }
    if (tor === 1 && dz < -3) { tor = Math.abs(S.x) < 14 ? 2 : 3; if (tor === 2) say('hinnerk', 'Sauber zwischen den Tonnen durch. So gehört sich das.'); else say('smilla', 'Verpasst. Rot links, Grün rechts, die Mitte ist das Fahrwasser. Fahr eine Runde und versuche es nochmal.'); }
    if (tor >= 2 && Math.hypot(S.x, dz) > 70) tor = 0;
    if (!hundSag && Math.hypot(S.x - 24, S.z + 64) < 10) { hundSag = true; say('klabauter', 'Seehund! Seehund! Abstand halten! Krrah!'); }
    /* Kamera folgt */
    if (!K.lock && now - K.last > 2200) { K.yaw += (0 - K.yaw) * Math.min(1, dt * 1.5); }
    const winkel = S.h + K.yaw + Math.PI, cp = Math.cos(K.pitch), ziel = new T.Vector3(S.x + Math.sin(winkel) * K.dist * cp, Math.max(1.2, B.position.y + 1 + Math.sin(K.pitch) * K.dist), S.z - Math.cos(winkel) * K.dist * cp);
    K.pos.lerp(ziel, Math.min(1, dt * (K.lock ? 8 : 3.2))); cam.position.copy(K.pos); K.blick.lerp(new T.Vector3(S.x, B.position.y + 1.4, S.z), Math.min(1, dt * 6)); cam.lookAt(K.blick);
    r.render(scene, cam);
    const kn = Math.abs(S.v) * 1.94, hd = ((S.h / RAD) % 360 + 360) % 360; $('#wthud') && ($('#wthud').textContent = 'Kurs ' + String(Math.round(hd)).padStart(3, '0') + '° · ' + kn.toFixed(1).replace('.', ',') + ' kn');
    fpsN++; if (now - fpsT > 1000) { W.fps = fpsN; fpsN = 0; fpsT = now; }
  }
  function ende() { laufend = false; window.removeEventListener('keydown', taste); window.removeEventListener('keyup', taste); try { r.dispose(); } catch (e) {} }
  back.onclick = () => { ende(); clearTimeout(bubT); if (window.VOX) VOX.stop(); setTab(typeof returnTo !== 'undefined' ? returnTo : 'cabin'); };
  W.ende = ende; W.szene = {scene, cam, spieler, K, setzeNacht: () => { nacht = !nacht; setzeNacht(); }, say};
  requestAnimationFrame(schritt);
};
})();
