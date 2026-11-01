/* welt.js: 3D-Welt (v5.12). Dritte Person, weicher warmer Stil, austauschbares Boot, Wetter und Wellen zum Kombinieren,
   Zusammenstöße, Hafen mit Molen, Stegen und Häusern.
   Aufbau:  1 STIL (Farben und Oberflächen: hier ändert man den Look)   2 WETTER und WELLEN (Daten)   3 Bausteine und Texturen
            4 Boote (Vertrag unten)   5 Tiere   6 Hafen, See, Insel   7 Wasser und Himmel   8 Physik und Zusammenstöße
            9 Steuerung, Kamera, Oberfläche
   Boot-Vertrag: THREE.Object3D, Bug nach +Z, Backbord = +X, Ursprung mittig auf der Wasserlinie, Einheit Meter.
   userData (alles optional): laenge, breite, motor (Gruppe, dreht beim Lenken um Y), propeller, lichter [{lampe, glow, sektor}],
   katzenWeg [Vector3 auf Deck], kreise [{z, r}] für Zusammenstöße. Fremde Modelle: WELT.normiere(obj, {laenge, achse}). */
(function () {
'use strict';
const W = window.WELT = {};
const $ = s => document.querySelector(s), esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const cl = (v, a, b) => v < a ? a : v > b ? b : v, mix = (a, b, u) => a + (b - a) * u, sm = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
const TAU = Math.PI * 2, RAD = Math.PI / 180, wdiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b)), rnd = (a, b) => a + Math.random() * (b - a);
let T = null;

/* ================= 1. STIL ================= */
const WARM = {
  rumpf: '#f4ede0', streifen: '#a8432f', unterwasser: '#2d4b5e', deck: '#b98455', fuge: '#5e3d22', kajuete: '#efe6d6', dach: '#e2d6c2', holz: '#9c6236', holzHell: '#c9935e',
  messing: '#c8962e', glas: '#1f2c35', innen: '#f3c97a', chrom: '#cfd5da', motor: '#33383d', motorBand: '#c0392b', fender: '#e9eef2', tau: '#e3d5b4', ring: '#e2553f',
  rot: '#c8402f', gruen: '#3f8a4f', gelb: '#e8b23a', schwarz: '#26292c', weiss: '#f7f3ea', mast: '#dfe3e6',
  sand: '#e3cf9f', sandNass: '#b9a477', gras: '#7fa35a', grasDunkel: '#5d8644', fels: '#8d8a82', pflaster: '#a39684', beton: '#b8b2a6', kaimauer: '#7d7468', pfahl: '#5a4634',
  ziegel: '#a5523c', putz: '#efe3cc', putzBlau: '#9fb6c4', putzGelb: '#e9cf8d', putzRosa: '#e3b3a0', dachRot: '#8e3b2c', dachGrau: '#58606a', rahmen: '#f6f1e6', tuer: '#2f5d6e',
  kran: '#d9a13a', baum: '#4f7a3c', baumDunkel: '#3e6a3a', stamm: '#6b4a32',
  katze: '#e39a4c', katzeHell: '#f8dcb4', nase: '#e58a8a', moewe: '#fbfbf7', moeweGrau: '#a7b0b8', schnabel: '#f0b53e', ente: '#7a5a3c', enteKopf: '#2f6b4a', kueken: '#f2cf4a', seehund: '#8f979e',
  schiff: '#f5f1e8', schiffBlau: '#2f5d8a', schornstein: '#c0392b', segelPersenning: '#2f5d8a', rotTank: '#c8402e'
};
const STILE = {
  warm: {name: 'Warm und weich', flach: false, belichtung: 1.0, schatten: true, f: WARM,
    rau: {rumpf: .3, streifen: .32, unterwasser: .7, glas: .06, messing: .3, chrom: .18, motor: .32, fender: .45, deck: .85, mast: .3, schiff: .35, weiss: .4},
    metall: {messing: .85, chrom: .9, mast: .4}},
  spielzeug: {name: 'Spielzeug', flach: true, belichtung: 1.12, schatten: false,
    f: Object.assign({}, WARM, {rumpf: '#fffaf0', streifen: '#e0503c', unterwasser: '#2f6fae', deck: '#e0a96d', dach: '#5aa0d8', kajuete: '#fff6e6', gras: '#8cc65a', sand: '#f2dc9a', katze: '#f59a3c', schiffBlau: '#3d7fd0'}),
    rau: {}, metall: {}}
};
W.STILE = STILE;
let ST = STILE.warm, MC = {}, TOON = null;
const toon = () => { if (!TOON) { TOON = new T.DataTexture(new Uint8Array([150, 205, 255]), 3, 1, T.RedFormat); TOON.minFilter = TOON.magFilter = T.NearestFilter; TOON.needsUpdate = true; } return TOON; };
/* Material aus dem Stil. key = Farbname aus ST.f (oder eine Farbe). o: {farbe, rau, vc, side, map, eigen} */
function M(key, o = {}) {
  const id = [key, o.farbe, o.rau, o.vc ? 1 : 0, o.side, o.map ? o.map.uuid : '', o.transparent ? o.opacity : ''].join('|');
  if (!o.eigen && MC[id]) return MC[id];
  const farbe = o.vc || o.map ? (o.farbe || '#ffffff') : (o.farbe || ST.f[key] || key);
  const p = {color: farbe, vertexColors: !!o.vc, side: o.side || T.FrontSide};
  if (o.map) p.map = o.map; if (o.transparent) { p.transparent = true; p.opacity = o.opacity; }
  const m = ST.flach ? new T.MeshToonMaterial(Object.assign(p, {gradientMap: toon()}))
    : new T.MeshStandardMaterial(Object.assign(p, {roughness: o.rau != null ? o.rau : (ST.rau[key] != null ? ST.rau[key] : .8), metalness: ST.metall[key] || 0}));
  if (ST.flach) m.flatShading = true;
  if (!o.eigen) MC[id] = m; return m;
}
/* Lichter und Fenster, die nachts leuchten */
let NACHT = [];
function Mlicht(key, leucht, staerke = 1.4) { const m = M(key, {eigen: true}); m.emissive = new T.Color('#000000'); NACHT.push({m, leucht: new T.Color(leucht), staerke}); return m; }

/* ================= 2. WETTER und WELLEN ================= */
/* H = Wellenhöhe in m (Küstennähe, etwas unter den Werten der offenen See), L = Länge der Hauptwelle */
const WIND = {flaute: {n: 'Flaute', bft: 0, ms: 0, H: 0, L: 10}, leicht: {n: 'Leicht', bft: 2, ms: 3, H: .25, L: 10}, maessig: {n: 'Mäßig', bft: 4, ms: 7, H: .8, L: 18},
  frisch: {n: 'Frisch', bft: 5, ms: 9.5, H: 1.5, L: 27}, stark: {n: 'Stark', bft: 7, ms: 15, H: 2.6, L: 40}, sturm: {n: 'Sturm', bft: 9, ms: 22, H: 4.2, L: 56}};
const RICHTUNG = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
/* Nebeldichte für FogExp2; extrem: man sieht das eigene Boot gerade noch */
const SICHT = {klar: {n: 'Klar', d: .0009}, dunst: {n: 'Dunst', d: .004}, nebel: {n: 'Nebel', d: .011}, dicht: {n: 'Dichter Nebel', d: .02}, extrem: {n: 'Extrem dichter Nebel', d: .034}};
const REGEN = {kein: {n: 'Kein Regen', z: 0}, regen: {n: 'Regen', z: 700}, stark: {n: 'Starkregen', z: 1500}};
const ZEIT = {
  morgen: {n: 'Morgen', el: 9, az: 100, oben: '#86a9cf', horiz: '#f1c9a6', sonne: '#ffd1a0', licht: 2.3, hemi: .9, wasser: '#2f6676', bel: 1},
  tag: {n: 'Tag', el: 47, az: 200, oben: '#5b93cc', horiz: '#d3e6ee', sonne: '#fff0d6', licht: 3.1, hemi: 1.1, wasser: '#2a6a7c', bel: 1},
  abend: {n: 'Abend', el: 7, az: 265, oben: '#58699a', horiz: '#f2a56f', sonne: '#ffad6a', licht: 2.3, hemi: .8, wasser: '#2b566a', bel: 1},
  nacht: {n: 'Nacht', el: 32, az: 140, oben: '#0a1330', horiz: '#1d2a49', sonne: '#a8bde0', licht: .32, hemi: .28, wasser: '#10283a', bel: 1.25}};
const WELLEN = {windsee: {n: 'Windsee', info: 'kurz, kommt mit dem Wind'}, duenung: {n: 'Dünung', info: 'lange runde Wellen von weit her'},
  kreuzsee: {n: 'Kreuzsee', info: 'zwei Wellenzüge kreuzen sich'}, kabbel: {n: 'Kabbelwasser', info: 'kurz und steil, Strom gegen Wind'}, schwell: {n: 'Schwell', info: 'Heckwellen anderer Schiffe'}};
const ORTE = {hafen: {n: 'Liegeplatz im Hafen', x: -27.2, z: 150, h: 0}, einfahrt: {n: 'Vor der Hafeneinfahrt', x: 0, z: 25, h: Math.PI}, see: {n: 'Offene See', x: 40, z: -150, h: .5}};
const KAMERAS = {hinten: {n: 'Hinter dem Boot', dist: 25, pitch: .27, yaw: 0, lock: false}, weit: {n: 'Weit', dist: 46, pitch: .36, yaw: 0, lock: false},
  seite: {n: 'Seite', dist: 22, pitch: .12, yaw: Math.PI / 2, lock: true}, oben: {n: 'Von oben', dist: 52, pitch: 1.45, yaw: 0, lock: true}, nah: {n: 'Nah', dist: 11, pitch: .22, yaw: .75, lock: true}};
const QUALI = {auto: {n: 'Automatisch'}, hoch: {n: 'Hoch', dpr: 1.6, schatten: true, env: true}, mittel: {n: 'Mittel', dpr: 1.15, schatten: false, env: true}, niedrig: {n: 'Niedrig', dpr: .8, schatten: false, env: false}};
const STANDARD = {quali: 'auto', wind: 'leicht', von: 7, sicht: 'klar', regen: 'kein', zeit: 'tag', wellen: {windsee: true, duenung: false, kreuzsee: false, kabbel: false, schwell: true}, ort: 'hafen', stil: 'warm', kam: 'hinten', boot: 0};
function cfg() {
  const S = window.S || {}; S.cfg = S.cfg || {};
  const c = S.cfg.welt = Object.assign({}, STANDARD, S.cfg.welt || {}); c.wellen = Object.assign({}, STANDARD.wellen, c.wellen || {});
  if (!WIND[c.wind]) c.wind = STANDARD.wind; if (!SICHT[c.sicht]) c.sicht = 'klar'; if (!REGEN[c.regen]) c.regen = 'kein'; if (!ZEIT[c.zeit]) c.zeit = 'tag';
  if (!ORTE[c.ort]) c.ort = 'hafen'; if (!STILE[c.stil]) c.stil = 'warm'; if (!KAMERAS[c.kam]) c.kam = 'hinten'; if (!QUALI[c.quali]) c.quali = 'auto'; return c;
}
const speichern = () => { try { if (typeof save === 'function') save(); } catch (e) {} };
/* Wellen als Summe von Gerstner-Wellen: A Amplitude, k Wellenzahl, Richtung (dx, dz), Q Steilheit */
function wellenListe(c) {
  const w = WIND[c.wind], hin = c.von * 45 * RAD + Math.PI, L = [];
  const add = (H, Lw, dir, Q, art) => { if (H <= 0) return; const k = TAU / Lw; L.push({A: H / 2, k, lam: Lw, om: Math.sqrt(9.81 * k), dx: Math.sin(dir), dz: -Math.cos(dir), Q, art, ph: Math.random() * TAU}); };
  if (c.wellen.windsee && w.H) { add(w.H * .62, w.L, hin, .55, 'w'); add(w.H * .38, w.L * .64, hin + .45, .5, 'w'); if (w.L * .42 >= 9.5) add(w.H * .28, w.L * .42, hin - .5, .45, 'w'); }
  if (c.wellen.duenung) { add(1.3, 120, hin + 1.1, .25, 'd'); add(.7, 84, hin + 1.25, .22, 'd'); }
  if (c.wellen.kreuzsee) { const H = Math.max(.9, w.H * .8); add(H * .7, 30, hin + 1.05, .6, 'k'); add(H * .7, 27, hin - 1.05, .6, 'k'); }
  if (c.wellen.kabbel) { add(.75, 13, hin + Math.PI, .9, 'b'); add(.55, 10.5, hin + Math.PI - .5, .9, 'b'); add(.45, 11.5, hin + Math.PI + .6, .85, 'b'); }
  const n = L.length || 1; L.forEach(q => { q.Q = Math.min(q.Q, .85 / (q.k * q.A * n)); });
  return L;
}

/* ================= 3. Bausteine und Texturen ================= */
function mk(geo, mat, x, y, z, eltern, schatten = true) {
  const o = new T.Mesh(geo, mat); o.position.set(x || 0, y || 0, z || 0);
  if (schatten && ST.schatten) { o.castShadow = true; o.receiveShadow = true; }
  if (eltern) eltern.add(o); return o;
}
function tex(w, h, zeichne, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; zeichne(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; if (rep) t.repeat.set(rep[0], rep[1]); return t;
}
let TX = {};
function texturen() {
  const f = ST.f;
  TX.deck = tex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { const l = rnd(-8, 8); g.fillStyle = `hsl(28,${40 + rnd(-4, 4)}%,${46 + l}%)`; g.fillRect(i * 32, 0, 32, h);
    g.fillStyle = 'rgba(80,50,25,.14)'; for (let k = 0; k < 6; k++) g.fillRect(i * 32 + rnd(3, 28), 0, 1, h);
    const y = rnd(0, h); g.fillStyle = f.fuge; g.fillRect(i * 32, y, 32, 2); }
    g.fillStyle = f.fuge; for (let i = 0; i <= 8; i++) g.fillRect(i * 32 - 1, 0, 2, h); });
  TX.pflaster = tex(256, 256, (g, w, h) => { g.fillStyle = '#6f675c'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) for (let x = (y / 16 % 2) * 10; x < w; x += 20) {
    g.fillStyle = `hsl(32,${8 + rnd(0, 8)}%,${50 + rnd(-9, 9)}%)`; g.beginPath(); g.roundRect ? g.roundRect(x + 1, y + 1, 18, 14, 4) : g.rect(x + 1, y + 1, 18, 14); g.fill(); } }, [30, 6]);
  TX.glow = tex(64, 64, (g, w) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w); });
  TX.wolke = tex(256, 128, g => { for (let i = 0; i < 14; i++) { const x = rnd(50, 206), y = rnd(45, 85), r = rnd(22, 46), q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, 'rgba(255,255,255,.75)'); q.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = q; g.fillRect(0, 0, 256, 128); } });
  TX.schaum = tex(128, 128, (g, w, h) => { for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${rnd(.15, .7)})`; g.beginPath(); g.arc(rnd(0, w), rnd(0, h), rnd(.6, 2.6), 0, 7); g.fill(); } });
  TX.flagge = tex(60, 36, (g) => { g.fillStyle = '#1b1b1b'; g.fillRect(0, 0, 60, 12); g.fillStyle = '#d0281f'; g.fillRect(0, 12, 60, 12); g.fillStyle = '#f2c230'; g.fillRect(0, 24, 60, 12); });
  TX.fell = tex(128, 64, (g, w, h) => { g.fillStyle = f.katze; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(140,70,20,.42)';
    for (let y = 6; y < h - 6; y += 7) { g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x * .2 + y) * 1.6); for (let x = w; x >= 0; x -= 8) g.lineTo(x, y + 3 + Math.sin(x * .2 + y) * 1.6); g.fill(); } });
  TX.wasserN = wasserNormal();
}
/* Normal-Karte für kleine Wellen (kachelbar, aus Sinuswellen) */
function wasserNormal() {
  const N = 256, d = new Uint8Array(N * N * 4), W8 = [];
  for (let i = 0; i < 14; i++) W8.push({fx: Math.round(rnd(-9, 9)) || 1, fy: Math.round(rnd(-9, 9)) || 2, a: rnd(.3, 1) / (1 + i * .25), p: rnd(0, TAU)});
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let gx = 0, gy = 0; const u = x / N, v = y / N;
    for (const q of W8) { const c = Math.cos(TAU * (q.fx * u + q.fy * v) + q.p) * q.a; gx += c * q.fx; gy += c * q.fy; }
    const nx = -gx * .045, ny = -gy * .045, l = Math.hypot(nx, ny, 1), i = (y * N + x) * 4;
    d[i] = (nx / l * .5 + .5) * 255; d[i + 1] = (ny / l * .5 + .5) * 255; d[i + 2] = (1 / l * .5 + .5) * 255; d[i + 3] = 255; }
  const t = new T.DataTexture(d, N, N, T.RGBAFormat); t.wrapS = t.wrapT = T.RepeatWrapping; t.magFilter = T.LinearFilter; t.minFilter = T.LinearMipmapLinearFilter; t.generateMipmaps = true; t.needsUpdate = true; return t;
}
/* Feste Teile je Material zu einem Stück zusammenfassen (weniger Zeichenaufrufe). Ausnahmen bleiben einzeln. */
function verschmelze(root, ausnahmen = []) {
  root.updateMatrixWorld(true); const inv = new T.Matrix4().copy(root.matrixWorld).invert(), gruppen = new Map(), weg = [];
  root.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o.userData.einzeln) return; let p = o.parent; while (p && p !== root) { if (ausnahmen.includes(p)) return; p = p.parent; } if (ausnahmen.includes(o)) return;
    const k = o.material.uuid; if (!gruppen.has(k)) gruppen.set(k, {m: o.material, g: [], schatten: o.castShadow}); const geo = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()).applyMatrix4(new T.Matrix4().multiplyMatrices(inv, o.matrixWorld)); gruppen.get(k).g.push(geo); weg.push(o); });
  weg.forEach(o => o.parent.remove(o));
  for (const {m, g, schatten} of gruppen.values()) { const n = g.reduce((a, x) => a + x.attributes.position.count, 0), pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), col = m.vertexColors ? new Float32Array(n * 3) : null; let o = 0;
    for (const x of g) { const c = x.attributes.position.count; pos.set(x.attributes.position.array, o * 3); if (x.attributes.normal) nor.set(x.attributes.normal.array, o * 3); if (x.attributes.uv) uv.set(x.attributes.uv.array, o * 2); if (col && x.attributes.color) { const ca = x.attributes.color; for (let i = 0; i < c; i++) { col[(o + i) * 3] = ca.getX(i); col[(o + i) * 3 + 1] = ca.getY(i); col[(o + i) * 3 + 2] = ca.getZ(i); } } o += c; x.dispose(); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('normal', new T.BufferAttribute(nor, 3)); geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); if (col) geo.setAttribute('color', new T.BufferAttribute(col, 3));
    geo.computeBoundingSphere(); const me = new T.Mesh(geo, m); me.castShadow = schatten && ST.schatten; me.receiveShadow = ST.schatten; root.add(me); }
  return root;
}
function glow(farbe, groesse) { const s = new T.Sprite(new T.SpriteMaterial({map: TX.glow, color: farbe, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0})); s.scale.setScalar(groesse); s.renderOrder = 5; return s; }
const rohr = (pts, r, mat, eltern, seg = 40) => { const c = new T.CatmullRomCurve3(pts.map(p => new T.Vector3(p[0], p[1], p[2]))); return mk(new T.TubeGeometry(c, seg, r, 7), mat, 0, 0, 0, eltern); };
function lathe(profil, farbe, seg = 24) { return new T.LatheGeometry(profil.map(p => new T.Vector2(p[0], p[1])), seg); }

/* ================= 4. Boote ================= */
/* Rumpf aus Spanten: s = 0 Heck … 1 Bug. Farbbänder (Unterwasser, Wasserpass, Rumpf) über doppelte Reihen scharf getrennt. */
function rumpf(o, farb) {
  const L = o.L, B = o.B, N = 32;
  const st = s => { const b = B / 2 * (s < .55 ? .9 + .1 * Math.sin(s / .55 * Math.PI / 2) : Math.max(.012, Math.pow(Math.cos((s - .55) / .45 * Math.PI / 2), .72)));
    const t = o.T * (s < .12 ? .78 + 1.8 * s : 1) * (s > .72 ? Math.max(.05, 1 - Math.pow((s - .72) / .28, 1.35)) : 1);
    return {b, t, f: o.F * (1 + o.sprung * Math.pow(s, 2.2))}; };
  const zOf = (s, y, q) => (s - .5) * L + (s > .78 ? o.rake * Math.pow((s - .78) / .22, 2) * cl((y + q.t) / (q.f + q.t), 0, 1) : 0);
  const half = q => { const a = []; for (let k = 0; k <= 9; k++) { const w = k / 9 * Math.PI / 2; a.push([q.b * Math.pow(Math.sin(w), .7), -q.t * Math.pow(Math.cos(w), 1.5)]); }
    for (const y of [.075, .08, .2, .205, q.f * .5, q.f * .8, q.f]) a.push([q.b * (1 + .05 * y / q.f), y]); return a; };
  const cU = new T.Color(farb.unterwasser), cS = new T.Color(farb.streifen), cR = new T.Color(farb.rumpf), band = y => y < .078 ? cU : y < .203 ? cS : cR;
  const pos = [], col = [], idx = []; let RN = 0;
  for (let i = 0; i <= N; i++) { const s = i / N, q = st(s), h = half(q), R = [];
    for (let j = h.length - 1; j >= 0; j--) R.push(h[j]); for (let j = 1; j < h.length; j++) R.push([-h[j][0], h[j][1]]); RN = R.length;
    for (const [x, y] of R) { pos.push(x, y, zOf(s, y, q)); const c = band(y); col.push(c.r, c.g, c.b); } }
  for (let i = 0; i < N; i++) for (let j = 0; j < RN - 1; j++) { const a = i * RN + j, b = a + RN; idx.push(a, b, a + 1, a + 1, b, b + 1); }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  const grp = new T.Group(); mk(g, M('rumpf', {vc: true, side: T.DoubleSide}), 0, 0, 0, grp);
  /* Heckspiegel in waagerechten Streifen, damit die Farbbänder durchlaufen */
  const q0 = st(0), h0 = half(q0), tp = [], tc = [], z0 = -L / 2;
  for (let j = 0; j < h0.length - 1; j++) { const [x1, y1] = h0[j], [x2, y2] = h0[j + 1];
    for (const [x, y] of [[x1, y1], [x2, y2], [-x2, y2], [x1, y1], [-x2, y2], [-x1, y1]]) { tp.push(x, y, z0); const c = band(y); tc.push(c.r, c.g, c.b); } }
  const tg = new T.BufferGeometry(); tg.setAttribute('position', new T.Float32BufferAttribute(tp, 3)); tg.setAttribute('color', new T.Float32BufferAttribute(tc, 3)); tg.computeVertexNormals();
  mk(tg, M('rumpf', {vc: true, side: T.DoubleSide}), 0, 0, 0, grp);
  /* Deck mit Planken und leichter Wölbung */
  const dp = [], du = [], di = [], K = 6;
  /* Deck (oder beim offenen Boot der Boden über der Wasserlinie). Dreiecke so herum, dass das Deck nach oben zeigt (sonst sieht man von oben ins Bootsinnere) */
  const boden = o.boden;
  for (let i = 0; i <= N; i++) { const s = i / N, q = st(s), yy = boden != null ? boden : q.f; for (let k = 0; k <= K; k++) { const u = k / K * 2 - 1, x = u * q.b * (boden != null ? .97 : 1), y = boden != null ? boden + .02 * (1 - u * u) : q.f - .02 + .05 * (1 - u * u);
    dp.push(x, y, zOf(s, yy, q)); du.push(x / .6, zOf(s, yy, q) / 2); } }
  for (let i = 0; i < N; i++) for (let k = 0; k < K; k++) { const a = i * (K + 1) + k, b = a + K + 1; di.push(a, b, a + 1, a + 1, b, b + 1); }
  const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.Float32BufferAttribute(dp, 3)); dg.setAttribute('uv', new T.Float32BufferAttribute(du, 2)); dg.setIndex(di); dg.computeVertexNormals();
  mk(dg, o.deckFarbe ? M(o.deckFarbe) : M('deck', {map: TX.deck}), 0, 0, 0, grp);
  /* Scheuerleiste */
  for (const sx of [1, -1]) { const pts = []; for (let i = 0; i <= N; i++) { const s = i / N, q = st(s); pts.push([sx * q.b * 1.05, q.f - .03, zOf(s, q.f, q)]); } rohr(pts, .05, M(farb.leiste || 'holz'), grp, 64); }
  rohr([[q0.b * 1.05, q0.f - .03, z0], [0, q0.f - .03, z0 - .02], [-q0.b * 1.05, q0.f - .03, z0]], .05, M(farb.leiste || 'holz'), grp, 12);
  const deckY = z => { const s = cl(z / L + .5, 0, 1), q = st(s); return q.f + .02; }, breiteBei = z => st(cl(z / L + .5, 0, 1)).b;
  return {grp, st, zOf, deckY, breiteBei, bugZ: zOf(1, st(1).f, st(1))};
}
/* Lampe mit Sektor (bb rot, sb grün, heck, top, rund) */
function lampe(eltern, x, y, z, farbe, sektor, liste, gross = 1) {
  const m = new T.MeshBasicMaterial({color: '#3a3a3a'}), l = mk(new T.SphereGeometry(.05 * gross, 10, 8), m, x, y, z, eltern, false); l.userData.einzeln = true;
  const g = glow(farbe, 1.1 * gross); g.position.set(x, y, z); eltern.add(g); liste.push({lampe: l, glow: g, sektor, farbe: new T.Color(farbe)}); return l;
}
function bauBoot(o) {
  o = Object.assign({art: 'kajuete', L: 8.4, B: 2.9, T: .55, F: .95, sprung: .4, rake: .6, mast: 'liegt', fender: true, flagge: true, motor: true, farben: {}}, o || {});
  if (o.art === 'offen') Object.assign(o, {L: o.L === 8.4 ? 5.6 : o.L, B: 2.15, T: .38, F: .72, sprung: .3, rake: .4, boden: .22});
  if (o.art === 'segler') Object.assign(o, {T: .7, F: .85, sprung: .35, rake: .8, motor: false, flagge: false});
  const farb = Object.assign({rumpf: ST.f.rumpf, streifen: ST.f.streifen, unterwasser: ST.f.unterwasser}, o.farben);
  const b = new T.Group(), R = rumpf(o, farb); b.add(R.grp);
  const L = o.L, B = o.B, lichter = [], weg = [];
  const yS = R.deckY(0);
  if (o.art === 'kajuete') {
    const zA = -L * .12, zF = L * .2, H = 1.02, w = B * .6, yb = R.deckY(0) - .02;
    const sh = new T.Shape(); sh.moveTo(zA, 0); sh.lineTo(zF, 0); sh.lineTo(zF - .5, .78); sh.quadraticCurveTo(zF - .62, H, zF - .85, H); sh.lineTo(zA + .12, H); sh.quadraticCurveTo(zA, H, zA, H - .12); sh.lineTo(zA, 0);
    const kg = new T.ExtrudeGeometry(sh, {depth: w, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 3, curveSegments: 8}); kg.rotateY(-Math.PI / 2); kg.translate(w / 2, yb, 0);
    mk(kg, M('kajuete'), 0, 0, 0, b);
    const rs = new T.Shape(), rx = w / 2 + .12, ra = zA - .14, rf = zF - .72, rr = .18; rs.moveTo(-rx + rr, -ra); rs.lineTo(rx - rr, -ra); rs.quadraticCurveTo(rx, -ra, rx, -ra - rr); rs.lineTo(rx, -rf + rr); rs.quadraticCurveTo(rx, -rf, rx - rr, -rf); rs.lineTo(-rx + rr, -rf); rs.quadraticCurveTo(-rx, -rf, -rx, -rf + rr); rs.lineTo(-rx, -ra - rr); rs.quadraticCurveTo(-rx, -ra, -rx + rr, -ra);
    const rg = new T.ExtrudeGeometry(rs, {depth: .06, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 2}); rg.rotateX(-Math.PI / 2); rg.translate(0, yb + H + .03, 0);
    mk(rg, M('dach'), 0, 0, 0, b);
    const yr = yb + H + .12;
    /* Bullaugen wie in der Kajüte: Messingring, innen warmes Licht */
    const glas = Mlicht('glas', ST.f.innen, 1.2), ringG = new T.TorusGeometry(.15, .035, 10, 24), glG = new T.CircleGeometry(.15, 24);
    for (const sx of [1, -1]) for (const z of [zA + .5, zA + 1.15, zA + 1.8]) {
      const r = mk(ringG, M('messing'), sx * (w / 2 + .085), yb + .55, z, b, false); r.rotation.y = Math.PI / 2;
      const gl = mk(glG, glas, sx * (w / 2 + .075), yb + .55, z, b, false); gl.rotation.y = sx * Math.PI / 2; }
    /* Frontscheiben auf der Schräge */
    const neig = -Math.atan2(.5, .78);
    for (const sx of [1, -1]) { const p = mk(new T.PlaneGeometry(w * .4, .5), glas, sx * w * .22, yb + .42, zF - .27 + .07, b, false); p.rotation.x = neig; }
    /* Tür hinten mit kleinem Bullauge, Rettungsring */
    mk(new T.BoxGeometry(.56, .82, .04), M('holz'), -w * .12, yb + .45, zA - .06, b);
    const tr = mk(ringG, M('messing'), -w * .12, yb + .62, zA - .09, b, false); tr.scale.setScalar(.6);
    const rgG = new T.TorusGeometry(.2, .055, 10, 32), rc = []; const pa = rgG.attributes.position;
    for (let i = 0; i < pa.count; i++) { const a = Math.atan2(pa.getY(i), pa.getX(i)), c = new T.Color(Math.floor((a + Math.PI) / (Math.PI / 4)) % 2 ? ST.f.ring : ST.f.weiss); rc.push(c.r, c.g, c.b); }
    rgG.setAttribute('color', new T.Float32BufferAttribute(rc, 3)); mk(rgG, M('ring', {vc: true}), w * .26, yb + .55, zA - .1, b);
    /* Handläufe auf dem Dach, Antenne, Lampenmast */
    for (const sx of [1, -1]) { const h = mk(new T.CylinderGeometry(.025, .025, (rf - ra) * .7, 6), M('holz'), sx * (w / 2 - .02), yr + .06, (ra + rf) / 2, b); h.rotation.x = Math.PI / 2; }
    mk(new T.CylinderGeometry(.03, .03, .75, 8), M('weiss'), 0, yr + .36, zF - 1.05, b);
    lampe(b, 0, yr + .75, zF - 1.05, '#fff6e0', 'top', lichter);
    const an = mk(new T.CylinderGeometry(.012, .012, 1.4, 5), M('schwarz'), -w * .3, yr + .65, zA + .1, b, false); an.rotation.x = -.2;
    /* Seitenlichter an der Kajüte vorn: Backbord rot (+x), Steuerbord grün (−x) */
    for (const [sx, f, sk] of [[1, '#ff3a2a', 'bb'], [-1, '#37ff6a', 'sb']]) { mk(new T.BoxGeometry(.08, .1, .18), M('schwarz'), sx * (w / 2 + .1), yb + .95, zF - .82, b); lampe(b, sx * (w / 2 + .15), yb + .95, zF - .76, f, sk, lichter); }
    /* Der abgebaute Mast liegt auf zwei Böcken auf dem Dach */
    if (o.mast === 'liegt') { for (const z of [ra + .25, rf - .25]) mk(new T.BoxGeometry(.5, .2, .1), M('holz'), 0, yr + .07, z, b);
      const m = mk(new T.CylinderGeometry(.065, .075, L * .78, 10), M('mast'), 0, yr + .23, (ra + rf) / 2 - .5, b); m.rotation.x = Math.PI / 2; }
    /* Steuerstand in der Plicht an Steuerbord: Konsole mit Instrumenten, davor das Rad (dreht sich mit), daneben der Gashebel */
    const kz = zA - .55, kx = -.55, ky = R.deckY(kz);
    const ks = new T.Shape(); ks.moveTo(-.22, 0); ks.lineTo(.22, 0); ks.lineTo(.22, .78); ks.lineTo(-.05, .98); ks.lineTo(-.22, .98); ks.lineTo(-.22, 0);
    const kg2 = new T.ExtrudeGeometry(ks, {depth: .5, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 2}); kg2.rotateY(Math.PI / 2); kg2.translate(kx - .25, ky, kz);
    mk(kg2, M('kajuete'), 0, 0, 0, b);
    mk(new T.BoxGeometry(.42, .02, .2), M('schwarz'), kx, ky + .89, kz - .1, b, false).rotation.x = .55;
    for (const dx of [-.11, .11]) { const d = mk(new T.CircleGeometry(.055, 18), M('weiss'), kx + dx, ky + .9, kz - .115, b, false); d.rotation.x = -Math.PI / 2 + .55; }
    b.userData.steuerstand = {x: kx, y: ky + .78, z: kz - .27, neig: -.35};
    /* Reling vom Bugkorb bis zur Kajüte */
    const zb0 = R.bugZ - .35 - 1.05;
    for (const sx of [1, -1]) { const pts = []; for (let z = zA + .3; z <= zb0 + .01; z += (zb0 - zA - .3) / 4) { const x = sx * (R.breiteBei(z) - .1), y = R.deckY(z); pts.push([x, y + .55, z]); mk(new T.CylinderGeometry(.014, .014, .55, 5), M('chrom'), x, y + .27, z, b, false); }
      pts.push([sx * .55, R.deckY(L * .45) + .55, zb0]); rohr(pts, .016, M('chrom'), b, 24); }
    /* Tank mit Belüftungsschraube und Pumpball an Backbord achtern */
    const tz = -L / 2 + .75, tx = .72, ty = R.deckY(tz);
    mk(new T.BoxGeometry(.34, .26, .46), M('rotTank'), tx, ty + .13, tz, b); mk(new T.CylinderGeometry(.04, .04, .05, 10), M('schwarz'), tx + .08, ty + .28, tz + .12, b, false);
    const sl = [[tx, ty + .2, tz - .2], [tx - .2, ty + .08, tz - .55], [.25, ty + .02, -L / 2 + .15], [0, ty + .1, -L / 2 - .05]]; rohr(sl, .016, M('schwarz'), b, 16);
    const pb = mk(new T.SphereGeometry(.05, 12, 8), M('schwarz'), tx - .2, ty + .08, tz - .55, b, false); pb.scale.set(1, 1, 1.6);
    /* Badeleiter am Heck an Steuerbord */
    const lx = -(B / 2 - .55), lz = -L / 2 - .06, ly = R.deckY(-L / 2);
    for (const dx of [-.14, .14]) rohr([[lx + dx, ly + .25, lz + .25], [lx + dx, ly + .3, lz], [lx + dx, ly - .1, lz - .02], [lx + dx, ly - .75, lz - .04]], .014, M('chrom'), b, 10);
    for (let i = 0; i < 3; i++) mk(new T.BoxGeometry(.3, .025, .08), M('chrom'), lx, ly - .2 - i * .22, lz - .04, b, false);
    weg.push([0, -L * .38], [.85, -L * .3], [w / 2 + .3, zA + .2], [w / 2 + .3, zF - .4], [0, zF + .7], [-(w / 2 + .3), zF - .4], [-(w / 2 + .3), zA + .2], [-.85, -L * .3]);
    b.userData.dachPlatz = new T.Vector3(.1, yr + .05, zA + .4);
    b.userData.plaetze = {hinnerk: [-.6, -2.6], smilla: [.75, -2.15], bug: [0, zF + 1.2], dach: [0, (ra + rf) / 2 - .2, yr + .3]};
  } else if (o.art === 'offen') {
    /* offenes Boot: Steuerkonsole mit Windschutz, Bänke */
    const yb = o.boden;
    mk(new T.BoxGeometry(.7, .9, .6), M('kajuete'), 0, yb + .45, L * .05, b);
    const ws = mk(new T.PlaneGeometry(.75, .35), M('glas', {transparent: true, opacity: .45}), 0, yb + 1.05, L * .05 + .28, b, false); ws.rotation.x = -.5;
    mk(new T.BoxGeometry(B * .78, .08, .45), M('holzHell'), 0, yb + .38, -L * .3, b); mk(new T.BoxGeometry(B * .6, .08, .4), M('holzHell'), 0, yb + .38, L * .26, b);
    for (const z of [-L * .3, L * .26]) for (const sx of [1, -1]) mk(new T.BoxGeometry(.06, .36, .3), M('holzHell'), sx * B * .2, yb + .18, z, b);
    b.userData.steuerstand = {x: 0, y: yb + .92, z: L * .05 - .32, neig: -.55};
    mk(new T.CylinderGeometry(.03, .03, .9, 6), M('weiss'), 0, R.deckY(-L * .4) + .45, -L * .4, b); lampe(b, 0, R.deckY(-L * .4) + .92, -L * .4, '#fff6e0', 'rund', lichter);
    for (const [sx, f, sk] of [[1, '#ff3a2a', 'bb'], [-1, '#37ff6a', 'sb']]) lampe(b, sx * .2, R.deckY(L * .38) + .12, L * .38, f, sk, lichter);
    weg.push([0, -L * .25], [.6, 0], [0, L * .3], [-.6, 0]);
    b.userData.plaetze = {hinnerk: [0, L * .05 - .6, yb], smilla: [.5, -L * .3, yb], bug: [0, L * .3, yb], dach: [0, L * .05, yb + .9]};
  } else if (o.art === 'segler') {
    const yb = R.deckY(0) - .02, w = B * .55, zA = -L * .15, zF = L * .12;
    mk(new T.BoxGeometry(w, .45, zF - zA), M('kajuete'), 0, yb + .22, (zA + zF) / 2, b);
    mk(new T.BoxGeometry(w + .14, .06, zF - zA + .1), M('holz'), 0, yb + .47, (zA + zF) / 2, b);
    const mh = L * 1.35; mk(new T.CylinderGeometry(.05, .07, mh, 8), M('mast'), 0, yb + mh / 2, zF + .25, b);
    const baum = mk(new T.CylinderGeometry(.05, .05, L * .42, 8), M('mast'), 0, yb + 1.1, zF + .25 - L * .21, b); baum.rotation.x = Math.PI / 2;
    const per = mk(new T.CapsuleGeometry(.13, L * .36, 4, 8), M('segelPersenning'), 0, yb + 1.25, zF + .25 - L * .21, b); per.rotation.x = Math.PI / 2;
    for (const [sx, z] of [[1, 0], [-1, 0]]) { const wa = rohr([[0, yb + mh * .95, zF + .25], [sx * B * .48, R.deckY(z) + .02, z]], .008, M('chrom'), b, 2); }
    rohr([[0, yb + mh * .97, zF + .25], [0, R.deckY(L * .45), L * .5 + .4]], .008, M('chrom'), b, 2);
    lampe(b, 0, yb + mh + .05, zF + .25, '#fff6e0', 'rund', lichter);
  }
  /* Bugkorb, Klampen, Anker */
  if (o.art !== 'offen') { const zb = R.bugZ - .35, yb = R.deckY(L * .45);
    const pk = [[.55, yb + .55, zb - 1.05], [.38, yb + .6, zb - .45], [0, yb + .62, zb], [-.38, yb + .6, zb - .45], [-.55, yb + .55, zb - 1.05]];
    rohr(pk, .022, M('chrom'), b, 40); for (const p of pk) mk(new T.CylinderGeometry(.015, .015, .58, 5), M('chrom'), p[0], p[1] - .29, p[2], b, false);
    mk(new T.BoxGeometry(.12, .12, .3), M('schwarz'), 0, yb + .03, zb + .12, b); }
  const klampe = (x, z) => { const y = R.deckY(z) + .02; mk(new T.BoxGeometry(.05, .05, .08), M('chrom'), x, y, z, b, false); const k = mk(new T.CapsuleGeometry(.022, .16, 3, 6), M('chrom'), x, y + .05, z, b, false); k.rotation.x = Math.PI / 2; };
  klampe(0, L * .4); for (const sx of [1, -1]) { klampe(sx * (B / 2 - .25), -L / 2 + .35); klampe(sx * (R.breiteBei(0) - .2), 0); }
  /* Fender */
  if (o.fender) for (const sx of [1, -1]) for (const z of [-L * .18, L * .1]) { const x = sx * (R.breiteBei(z) + .13), y = R.deckY(z);
    mk(new T.CylinderGeometry(.008, .008, .4, 4), M('tau'), x * .97, y - .15, z, b, false); mk(new T.CapsuleGeometry(.1, .28, 4, 10), M('fender'), x, y - .55, z, b); }
  /* Hecklicht und Flagge */
  if (o.art === 'kajuete') { const zH = -L / 2 + .25, yH = R.deckY(zH);
    mk(new T.CylinderGeometry(.022, .022, .7, 6), M('weiss'), -(B / 2 - .35), yH + .35, zH, b); lampe(b, -(B / 2 - .35), yH + .72, zH, '#fff6e0', 'heck', lichter); }
  if (o.flagge) { const fz = -L / 2 + .12, fy = R.deckY(fz), fl = new T.Group(); fl.position.set(B / 2 - .45, fy, fz); b.add(fl);
    mk(new T.CylinderGeometry(.018, .022, 1.15, 6), M('holz'), 0, .57, 0, fl);
    const dreh = new T.Group(); dreh.position.y = 1.1; fl.add(dreh);
    const fg = new T.PlaneGeometry(.55, .34, 10, 4); fg.translate(.275, -.17, 0); const tuch = mk(fg, M('weiss', {map: TX.flagge, side: T.DoubleSide}), 0, 0, 0, dreh, false);
    tuch.userData.basis = fg.attributes.position.array.slice(); b.userData.flagge = {dreh, tuch}; }
  /* Außenborder: dreht beim Lenken um die Hochachse am Spiegel */
  if (o.motor) { const yT = R.st(0).f, mot = new T.Group(); mot.position.set(0, yT - .12, -L / 2 - .1); b.add(mot);
    const k = o.art === 'offen' ? .85 : 1;
    mk(new T.BoxGeometry(.2, .32, .14), M('motor'), 0, 0, .05, mot);
    const haube = mk(new T.CapsuleGeometry(.19 * k, .26 * k, 6, 14), M('motor'), 0, .36 * k, -.13, mot); haube.scale.set(1, 1, 1.4);
    mk(new T.CylinderGeometry(.2 * k, .2 * k, .06, 16), M('motorBand'), 0, .2 * k, -.13, mot).scale.set(1, 1, 1.4);
    mk(new T.BoxGeometry(.1, 1.15, .17), M('motor'), 0, -.52, -.12, mot);
    mk(new T.BoxGeometry(.38, .025, .36), M('motor'), 0, -.92, -.14, mot);
    const torp = mk(new T.CapsuleGeometry(.075, .26, 4, 10), M('motor'), 0, -1.17, -.1, mot); torp.rotation.x = Math.PI / 2;
    mk(new T.BoxGeometry(.025, .22, .14), M('motor'), 0, -1.32, -.14, mot);
    const prop = new T.Group(); prop.position.set(0, -1.17, -.3); mot.add(prop);
    mk(new T.ConeGeometry(.05, .1, 10), M('chrom'), 0, 0, -.04, prop).rotation.x = -Math.PI / 2;
    const blatt = new T.CircleGeometry(.11, 12); blatt.scale(1, .55, 1);
    for (let i = 0; i < 3; i++) { const a = new T.Group(); a.rotation.z = i * TAU / 3; prop.add(a); const bl = mk(blatt, M('chrom', {side: T.DoubleSide}), 0, .1, 0, a, false); bl.rotation.y = .55; }
    /* Pinne am Außenborder (sichtbar im Modus Pinne); sie dreht mit dem Motor */
    const pin = new T.Group(); pin.position.set(0, .22, .02); mot.add(pin);
    const arm = mk(new T.CylinderGeometry(.022, .03, .72, 8), M('motor'), 0, .06, .36, pin); arm.rotation.x = Math.PI / 2 - .17;
    mk(new T.CapsuleGeometry(.035, .14, 4, 8), M('schwarz'), 0, .12, .74, pin).rotation.x = Math.PI / 2 - .17;
    b.userData.motor = mot; b.userData.propeller = prop; b.userData.pinne = pin; }
  /* Steuerrad am Steuerstand (sichtbar im Modus Rad) und Gashebel daneben */
  const st0 = b.userData.steuerstand, beweglich = [];
  if (st0) { const halter = new T.Group(); halter.position.set(st0.x, st0.y, st0.z); halter.rotation.x = st0.neig; b.add(halter); beweglich.push(halter);
    const rad = new T.Group(); halter.add(rad); mk(new T.TorusGeometry(.19, .022, 8, 28), M('holz'), 0, 0, 0, rad);
    for (let i = 0; i < 6; i++) { const sp = new T.Group(); sp.rotation.z = i * TAU / 6; rad.add(sp); mk(new T.CylinderGeometry(.012, .012, .26, 5), M('holz'), 0, .13, 0, sp); mk(new T.SphereGeometry(.026, 8, 6), M(i === 0 ? 'messing' : 'holz'), 0, .27, 0, sp); }
    mk(new T.CylinderGeometry(.04, .04, .05, 12), M('messing'), 0, 0, 0, rad).rotation.x = Math.PI / 2;
    const heb = new T.Group(); heb.position.set(st0.x + .27, st0.y - .04, st0.z + .14); b.add(heb); beweglich.push(heb);
    mk(new T.CylinderGeometry(.012, .012, .2, 5), M('chrom'), 0, .1, 0, heb); mk(new T.SphereGeometry(.03, 8, 6), M('schwarz'), 0, .21, 0, heb);
    Object.assign(b.userData, {rad, hebel: heb}); }
  verschmelze(b, [b.userData.motor, b.userData.flagge && b.userData.flagge.dreh, ...beweglich].filter(Boolean));
  const kw = weg.map(([x, z]) => new T.Vector3(x, (o.boden != null ? o.boden + .03 : R.deckY(z)) + .01, z));
  Object.assign(b.userData, {art: o.art, laenge: L, breite: B, lichter, katzenWeg: kw, kreise: [{z: L * .3, r: B * .42}, {z: 0, r: B * .5}, {z: -L * .32, r: B * .48}], deckY: R.deckY, breiteBei: R.breiteBei});
  return b;
}
W.bauBoot = bauBoot;
/* Ausflugsschiff (Maschinenfahrzeug: Topplicht, Seitenlichter, Hecklicht) */
function bauSchiff() {
  const o = {L: 20, B: 5.6, T: 1.1, F: 1.7, sprung: .22, rake: 1.2}, farb = {rumpf: ST.f.schiffBlau, streifen: ST.f.weiss, unterwasser: '#7a2f25', leiste: 'schwarz'};
  const b = new T.Group(), R = rumpf(Object.assign({deckFarbe: 'beton'}, o), farb); b.add(R.grp); const L = o.L, lichter = [], y0 = R.deckY(0);
  const glas = Mlicht('glas', ST.f.innen, 1.4);
  mk(new T.BoxGeometry(4.2, 2.1, 11), M('schiff'), 0, y0 + 1.05, -1.5, b);
  for (const sx of [1, -1]) mk(new T.PlaneGeometry(10, .8), glas, sx * 2.11, y0 + 1.3, -1.5, b, false).rotation.y = sx * Math.PI / 2;
  mk(new T.BoxGeometry(4.5, .12, 11.4), M('schiffBlau'), 0, y0 + 2.16, -1.5, b);
  mk(new T.BoxGeometry(3.2, 1.5, 2.6), M('schiff'), 0, y0 + 2.95, 3, b);
  mk(new T.PlaneGeometry(2.8, .7), glas, 0, y0 + 3.15, 4.31, b, false);
  mk(new T.BoxGeometry(3.4, .1, 2.9), M('schiffBlau'), 0, y0 + 3.75, 3, b);
  const sch = mk(new T.CylinderGeometry(.55, .65, 2, 16), M('schornstein'), 0, y0 + 3.2, -3.5, b); mk(new T.CylinderGeometry(.57, .57, .4, 16), M('schwarz'), 0, y0 + 4.2, -3.5, b);
  mk(new T.CylinderGeometry(.06, .08, 3.2, 8), M('weiss'), 0, y0 + 5.3, 3.4, b);
  lampe(b, 0, y0 + 6.9, 3.4, '#fff6e0', 'top', lichter, 1.6);
  for (const [sx, f, sk] of [[1, '#ff3a2a', 'bb'], [-1, '#37ff6a', 'sb']]) lampe(b, sx * 1.75, y0 + 3.95, 4.1, f, sk, lichter, 1.4);
  lampe(b, 0, y0 + 1.2, -L / 2 + .2, '#fff6e0', 'heck', lichter, 1.4);
  for (const sx of [1, -1]) rohr([[sx * 2.5, y0 + .9, -8], [sx * 2.6, y0 + .9, 0], [sx * 2.2, y0 + .9, 7]], .03, M('weiss'), b, 20);
  verschmelze(b);
  Object.assign(b.userData, {laenge: L, breite: o.B, lichter, kreise: [{z: 6.5, r: 2.6}, {z: 0, r: 2.9}, {z: -6.5, r: 2.9}]});
  return b;
}
/* fremdes Modell passend machen: skaliert auf Länge, Bug nach +Z, Mitte auf die Wasserlinie */
W.normiere = function (obj, opt) {
  opt = Object.assign({laenge: 8.4, achse: '+z', wasserlinie: .3}, opt || {});
  const g = new T.Group(); g.add(obj); obj.rotation.y = {'+z': 0, '-z': Math.PI, '+x': -Math.PI / 2, '-x': Math.PI / 2}[opt.achse] || 0;
  const bx = new T.Box3().setFromObject(g), sz = bx.getSize(new T.Vector3()), ct = bx.getCenter(new T.Vector3()), k = opt.laenge / sz.z;
  obj.scale.multiplyScalar(k); obj.position.set(-ct.x * k, -(bx.min.y + sz.y * opt.wasserlinie) * k, -ct.z * k);
  g.userData = {laenge: opt.laenge, breite: sz.x * k, lichter: [], katzenWeg: [new T.Vector3(0, sz.y * k * .7, 0)], kreise: [{z: opt.laenge * .3, r: sz.x * k * .45}, {z: 0, r: sz.x * k * .5}, {z: -opt.laenge * .3, r: sz.x * k * .48}]};
  return g;
};

/* ================= 5. Tiere ================= */
function bauKatze() {
  const g = new T.Group(), fell = M('katze', {map: TX.fell}), hell = M('katzeHell');
  const kg = new T.SphereGeometry(.2, 20, 16); kg.rotateX(Math.PI / 2);
  const koerper = mk(kg, fell, 0, .22, 0, g); koerper.scale.set(1.05, .85, 1.3);
  mk(new T.SphereGeometry(.17, 16, 12), hell, 0, .17, .02, g).scale.set(.95, .6, 1.12);
  const kopf = new T.Group(); kopf.position.set(0, .38, .25); g.add(kopf);
  mk(new T.SphereGeometry(.14, 18, 14), fell, 0, 0, 0, kopf).scale.set(1.1, .95, .95);
  for (const sx of [1, -1]) { mk(new T.SphereGeometry(.065, 12, 10), hell, sx * .06, -.045, .08, kopf);
    const o = mk(new T.ConeGeometry(.055, .1, 6), fell, sx * .085, .12, -.01, kopf); o.rotation.z = -sx * .35;
    mk(new T.SphereGeometry(.028, 10, 8), M('schwarz', {rau: .2}), sx * .058, .025, .118, kopf); mk(new T.SphereGeometry(.009, 6, 5), M('weiss'), sx * .05, .035, .142, kopf, false); }
  mk(new T.SphereGeometry(.017, 8, 6), M('nase'), 0, -.02, .14, kopf, false);
  const beine = []; for (const [x, z] of [[.1, .15], [-.1, .15], [.1, -.15], [-.1, -.15]]) { const h = new T.Group(); h.position.set(x, .17, z); g.add(h); mk(new T.CapsuleGeometry(.048, .09, 3, 8), fell, 0, -.1, 0, h); beine.push(h); }
  const schwanz = []; let el = g; const p0 = new T.Vector3(0, .26, -.27);
  for (let i = 0; i < 5; i++) { const s = new T.Group(); if (i === 0) s.position.copy(p0); else s.position.set(0, .085, 0); if (i === 0) s.rotation.x = -.9; el.add(s); mk(new T.CapsuleGeometry(.035 - i * .002, .06, 3, 6), fell, 0, .045, 0, s, false); schwanz.push(s); el = s; }
  g.userData = {kopf, beine, schwanz, koerper}; g.scale.setScalar(1.35); return g;
}
function bauMoewe(sitzt) {
  const g = new T.Group(), w = M('moewe'), gr = M('moeweGrau');
  const k = mk(new T.SphereGeometry(.2, 14, 10), w, 0, 0, 0, g); k.scale.set(.8, .8, 1.6);
  mk(new T.SphereGeometry(.13, 12, 10), w, 0, .1, .3, g); mk(new T.ConeGeometry(.035, .14, 6), M('schnabel'), 0, .08, .46, g).rotation.x = Math.PI / 2;
  for (const sx of [1, -1]) mk(new T.SphereGeometry(.022, 6, 5), M('schwarz'), sx * .07, .14, .38, g, false);
  const fl = []; for (const sx of [1, -1]) { const a = new T.Group(); g.add(a); const fg = mk(new T.BoxGeometry(.75, .025, .26), gr, sx * .38, 0, -.02, a); mk(new T.BoxGeometry(.18, .028, .2), M('schwarz'), sx * .7, 0, -.05, a, false); fl.push([a, sx]); if (sitzt) { a.rotation.z = sx * 1.3; a.position.x = sx * .1; fg.scale.set(.5, 1, 1); } }
  g.userData.fl = fl; g.scale.setScalar(1.2); return g;
}
function bauEnte(kueken) {
  const g = new T.Group(), k = kueken ? .45 : 1;
  const r = mk(new T.SphereGeometry(.2 * k, 12, 10), M(kueken ? 'kueken' : 'ente'), 0, .06 * k, 0, g); r.scale.set(.85, .7, 1.25);
  mk(new T.SphereGeometry(.11 * k, 12, 10), M(kueken ? 'kueken' : 'enteKopf'), 0, .24 * k, .17 * k, g);
  mk(new T.BoxGeometry(.07 * k, .025 * k, .1 * k), M('schnabel'), 0, .22 * k, .28 * k, g, false);
  for (const sx of [1, -1]) mk(new T.SphereGeometry(.018 * k, 6, 5), M('schwarz'), sx * .055 * k, .27 * k, .24 * k, g, false);
  return g;
}
function bauSeehund() {
  const g = new T.Group(), f = M('seehund');
  const k = mk(new T.CapsuleGeometry(.35, .9, 6, 14), f, 0, .3, 0, g); k.rotation.x = Math.PI / 2;
  const kopf = new T.Group(); kopf.position.set(0, .55, .75); g.add(kopf);
  mk(new T.SphereGeometry(.26, 16, 12), f, 0, 0, 0, kopf); mk(new T.SphereGeometry(.12, 10, 8), M('#b5bcc2'), 0, -.07, .2, kopf);
  for (const sx of [1, -1]) { mk(new T.SphereGeometry(.055, 10, 8), M('schwarz', {rau: .15}), sx * .1, .07, .2, kopf, false); mk(new T.SphereGeometry(.015, 6, 5), M('weiss'), sx * .09, .09, .25, kopf, false); }
  mk(new T.SphereGeometry(.035, 6, 5), M('schwarz'), 0, -.02, .3, kopf, false);
  g.userData.kopf = kopf; return g;
}

/* Crew an Bord: einfache Platzhalter-Figuren, bis die Figuren gestaltet sind (H10) */
function bauFigur(wer) {
  const g = new T.Group(), kopf = new T.Group();
  if (wer === 'klabauter') {
    const gr = M('#3f9a4a'), k = mk(new T.CapsuleGeometry(.1, .14, 4, 10), gr, 0, .16, 0, g); k.rotation.x = .35;
    kopf.position.set(0, .34, .06); g.add(kopf); mk(new T.SphereGeometry(.09, 12, 10), gr, 0, 0, 0, kopf); mk(new T.SphereGeometry(.06, 10, 8), M('#f2d34a'), 0, -.01, .05, kopf);
    const sn = mk(new T.ConeGeometry(.03, .08, 6), M('#3a3a3a'), 0, -.02, .1, kopf); sn.rotation.x = Math.PI / 2 + .5;
    for (const sx of [1, -1]) { mk(new T.SphereGeometry(.016, 6, 5), M('schwarz'), sx * .05, .03, .07, kopf, false); const f = mk(new T.CapsuleGeometry(.04, .14, 3, 6), M('#c8402f'), sx * .1, .16, -.02, g); f.rotation.x = .4; }
    const sw = mk(new T.CapsuleGeometry(.03, .22, 3, 6), M('#2f5d8a'), 0, .02, -.16, g); sw.rotation.x = 1.1;
  } else {
    const F = wer === 'hinnerk' ? {jacke: '#2f4b6e', hose: '#3a3f46', haar: '#e8e4dc'} : {jacke: '#e8b23a', hose: '#2f4b6e', haar: '#a0452a'}, haut = M('#f1c9a5');
    for (const sx of [1, -1]) { mk(new T.CapsuleGeometry(.075, .55, 4, 8), M(F.hose), sx * .1, .38, 0, g); mk(new T.BoxGeometry(.13, .08, .22), M('schwarz'), sx * .1, .04, .04, g); }
    const rumpfF = mk(new T.CapsuleGeometry(.2, .38, 6, 12), M(F.jacke), 0, 1.02, 0, g); rumpfF.scale.z = .75;
    for (const sx of [1, -1]) { const a = mk(new T.CapsuleGeometry(.06, .45, 4, 8), M(F.jacke), sx * .26, 1, 0, g); a.rotation.z = sx * .18; mk(new T.SphereGeometry(.06, 8, 6), haut, sx * .3, .72, .02, g); }
    kopf.position.set(0, 1.5, 0); g.add(kopf); mk(new T.SphereGeometry(.15, 16, 12), haut, 0, 0, 0, kopf);
    for (const sx of [1, -1]) mk(new T.SphereGeometry(.02, 6, 5), M('schwarz'), sx * .055, .03, .135, kopf, false);
    mk(new T.SphereGeometry(.03, 8, 6), M('#e0a080'), 0, -.01, .15, kopf, false);
    if (wer === 'hinnerk') { const bart = mk(new T.SphereGeometry(.12, 12, 10), M(F.haar), 0, -.09, .06, kopf); bart.scale.set(1, .8, .7);
      mk(new T.CylinderGeometry(.155, .16, .1, 16), M('#1f2c3d'), 0, .12, 0, kopf); const sch = mk(new T.CylinderGeometry(.11, .11, .015, 16, 1, false, -Math.PI / 2, Math.PI), M('schwarz'), 0, .08, .08, kopf); sch.rotation.y = Math.PI;
      mk(new T.TorusGeometry(.155, .012, 6, 20), M('messing'), 0, .14, 0, kopf, false).rotation.x = Math.PI / 2; }
    else { const h = mk(new T.SphereGeometry(.16, 14, 10), M(F.haar), 0, .04, -.03, kopf); h.scale.set(1, .9, 1); mk(new T.SphereGeometry(.08, 10, 8), M(F.haar), 0, .1, -.15, kopf); }
  }
  g.userData.kopf = kopf; g.userData.wer = wer; return g;
}

/* ================= 6. Hafen, See, Insel ================= */
function haus(eltern, x, z, w, d, h, wand, dach, fenster, dunkel) {
  const g = new T.Group(); g.position.set(x, 2.2, z); eltern.add(g);
  mk(new T.BoxGeometry(w, h, d), M(wand), 0, h / 2, 0, g);
  const ds = new T.Shape(); ds.moveTo(-w / 2 - .3, 0); ds.lineTo(0, w * .45); ds.lineTo(w / 2 + .3, 0); ds.lineTo(-w / 2 - .3, 0);
  const dg = new T.ExtrudeGeometry(ds, {depth: d + .6, bevelEnabled: false}); dg.translate(0, 0, -(d + .6) / 2); mk(dg, M(dach), 0, h, 0, g);
  mk(new T.BoxGeometry(.6, 1.6, .6), M('ziegel'), w * .25, h + w * .35, 0, g);
  const nx = Math.max(1, Math.floor(w / 2.2)), ny = Math.max(1, Math.floor(h / 2.6));
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const fx = -w / 2 + (i + .5) * w / nx, fy = 1.3 + j * 2.6;
    if (j === 0 && i === Math.floor(nx / 2)) { mk(new T.BoxGeometry(1, 2, .1), M('tuer'), fx, 1, -d / 2 - .03, g); continue; }
    mk(new T.BoxGeometry(1.05, 1.25, .08), M('rahmen'), fx, fy, -d / 2 - .02, g, false);
    mk(new T.PlaneGeometry(.85, 1.05), Math.random() < .6 ? fenster : dunkel, fx, fy, -d / 2 - .07, g, false).rotation.y = Math.PI; }
  return g;
}
function bauWelt(scene) {
  const W2 = {stat: [], bojen: [], lampen: [], blink: []}, g = new T.Group(); scene.add(g);
  const kap = (ax, az, bx, bz, r, art) => W2.stat.push({k: 1, ax, az, bx, bz, r, art}), kreis = (x, z, r, art) => W2.stat.push({k: 0, ax: x, az: z, r, art});
  /* Land, Kaimauer, Strand */
  mk(new T.BoxGeometry(170, 5.2, 4), M('kaimauer'), 0, -.4, 172, g);
  const pf = mk(new T.PlaneGeometry(170, 16), M('pflaster', {map: TX.pflaster}), 0, 2.21, 182, g); pf.rotation.x = -Math.PI / 2;
  const gr = mk(new T.PlaneGeometry(1200, 400), M('gras'), 0, 2.2, 390, g); gr.rotation.x = -Math.PI / 2;
  for (const sx of [1, -1]) { const s = mk(new T.PlaneGeometry(520, 34), M('sand'), sx * 345, .6, 178, g); s.rotation.x = -Math.PI / 2 - .1;
    const n = mk(new T.PlaneGeometry(520, 30), M('sandNass'), sx * 345, -1.2, 160, g); n.rotation.x = -Math.PI / 2 - .06; }
  kap(-85, 171.5, 85, 171.5, 1.6, 'stein');
  /* Molen aus Steinen mit Weg obendrauf; Einfahrt zwischen x −13 und 13 */
  const fels = [], molen = [[[-85, 171], [-75, 95], [-18, 72]], [[85, 171], [75, 95], [18, 72]]];
  for (const m of molen) for (let i = 0; i < m.length - 1; i++) { const [ax, az] = m[i], [bx, bz] = m[i + 1], len = Math.hypot(bx - ax, bz - az), ang = Math.atan2(bx - ax, bz - az);
    const weg = mk(new T.BoxGeometry(4, 3.4, len + 3), M('beton'), (ax + bx) / 2, .9, (az + bz) / 2, g); weg.rotation.y = ang;
    for (let s = 0; s <= len; s += 2.1) for (const sd of [-1, 1]) for (const row of [0, 1]) { const u = s / len, px = mix(ax, bx, u), pz = mix(az, bz, u), off = sd * (2.6 + row * 2.3 + rnd(-.4, .4));
      fels.push([px + Math.cos(ang) * off, row ? rnd(-1.6, -.6) : rnd(-.3, .9), pz - Math.sin(ang) * off, rnd(1.2, 2.3) - row * .3]); }
    kap(ax, az, bx, bz, 5.6, 'stein'); }
  const fg = new T.DodecahedronGeometry(1, 0), fi = new T.InstancedMesh(fg, M('fels'), fels.length), mtx = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), c = new T.Color();
  fels.forEach((p, i) => { e.set(rnd(0, 3), rnd(0, 3), rnd(0, 3)); q.setFromEuler(e); mtx.compose(new T.Vector3(p[0], p[1], p[2]), q, new T.Vector3(p[3], p[3] * rnd(.6, .9), p[3])); fi.setMatrixAt(i, mtx); fi.setColorAt(i, c.setScalar(rnd(.78, 1.12))); });
  if (ST.schatten) { fi.castShadow = fi.receiveShadow = true; } g.add(fi);
  /* Molenköpfe: von See kommend Rot an Backbord (Osten), Grün an Steuerbord (Westen) */
  for (const [x, farbe, f2] of [[18, 'rot', '#ff3a2a'], [-18, 'gruen', '#37ff6a']]) { mk(new T.CylinderGeometry(1.2, 1.5, 6, 16), M(farbe), x, 3.5, 72, g); mk(new T.CylinderGeometry(1.5, 1.5, .4, 16), M('weiss'), x, 6.6, 72, g);
    const gl = glow(f2, 4); gl.position.set(x, 7.3, 72); g.add(gl); W2.blink.push({glow: gl, takt: 4, an: .5, ph: x > 0 ? 0 : 2}); kreis(x, 72, 6, 'stein'); }
  /* Stege mit Pfählen */
  const pfaehle = [];
  const steg = (x, z0, z1) => { const len = z0 - z1, d = mk(new T.BoxGeometry(2.2, .25, len), M('holzHell', {map: TX.deck}), x, .95, (z0 + z1) / 2, g);
    for (let z = z1 + 1; z < z0; z += 4) for (const sx of [-1.25, 1.25]) pfaehle.push([x + sx, z]); kap(x, z0, x, z1, 1.2, 'holz'); return d; };
  steg(-30, 171, 116); steg(25, 171, 120);
  for (const z of [160, 148, 136, 124]) { mk(new T.BoxGeometry(6, .22, 1.1), M('holzHell'), -34, .93, z, g); kap(-31, z, -37, z, .65, 'holz'); pfaehle.push([-36.8, z]); }
  const pg = new T.CylinderGeometry(.18, .2, 5, 8), pi = new T.InstancedMesh(pg, M('pfahl'), pfaehle.length);
  pfaehle.forEach(([x, z], i) => { mtx.compose(new T.Vector3(x, -.9, z), new T.Quaternion(), new T.Vector3(1, 1, 1)); pi.setMatrixAt(i, mtx); }); if (ST.schatten) pi.castShadow = true; g.add(pi);
  /* Boote an den Stegen */
  const liegen = [[-34, 154, 0, {art: 'segler', L: 8.6, farben: {rumpf: '#2f4f6e', streifen: '#f4ede0'}}], [-34, 142, 0, {art: 'kajuete', L: 7.8, mast: 'ohne', farben: {rumpf: '#fbf5e8', streifen: '#2f5d8a'}}],
    [-34, 130, 0, {art: 'segler', L: 9.4, farben: {rumpf: '#f7f1e3', streifen: '#2a7a5a'}}], [28.4, 150, 0, {art: 'segler', L: 10, farben: {rumpf: '#8a2f2a', streifen: '#f4ede0'}}],
    [21.6, 128, Math.PI, {art: 'kajuete', L: 7.2, mast: 'ohne', farben: {rumpf: '#e9e4d6', streifen: '#c0392b', unterwasser: '#5a2a24'}}], [28.4, 130, 0, {art: 'offen', farben: {rumpf: '#f2e6c8'}}]];
  for (const [x, z, h, o] of liegen) { const b = bauBoot(Object.assign({flagge: false}, o)); b.position.set(x, .05, z); b.rotation.y = h; g.add(b); const L = b.userData.laenge / 2 - .3; kap(x, z - L, x, z + L, b.userData.breite * .5, 'boot'); W2.lieger = (W2.lieger || []).concat(b); }
  /* Häuser, Hafenmeister, Kran, Laternen, Poller */
  const fenster = Mlicht('glas', '#ffcf7a', 1.3), dunkel = M('glas');
  const H = [[-68, 'putzBlau', 'dachGrau', 9, 8], [-56, 'ziegel', 'dachRot', 10, 9], [-44, 'putzGelb', 'dachRot', 8, 7], [-33, 'putz', 'dachGrau', 9, 8], [-20, 'putzRosa', 'dachRot', 10, 8.5], [-6, 'ziegel', 'dachGrau', 9, 10],
    [8, 'putz', 'dachRot', 11, 7.5], [21, 'putzBlau', 'dachRot', 9, 8], [33, 'ziegel', 'dachRot', 9, 9]];
  for (const [x, wand, dach, w, h] of H) haus(g, x, 196, w, 9, h, wand, dach, fenster, dunkel);
  const hm = haus(g, 56, 194, 12, 10, 7, 'putz', 'dachRot', fenster, dunkel); mk(new T.BoxGeometry(3.5, 5, 3.5), M('putz'), -3, 10, -2, hm); mk(new T.ConeGeometry(2.8, 2.4, 4), M('dachRot'), -3, 13.7, -2, hm).rotation.y = Math.PI / 4;
  const kr = new T.Group(); kr.position.set(44, 2.2, 177); g.add(kr); mk(new T.BoxGeometry(1.2, 12, 1.2), M('kran'), 0, 6, 0, kr); const ausl = mk(new T.BoxGeometry(.8, .8, 14), M('kran'), 0, 12, -4, kr); ausl.rotation.x = -.15; mk(new T.CylinderGeometry(.02, .02, 8, 4), M('schwarz'), 0, 8.6, -10, kr, false);
  for (const x of [-52, -12, 14, 62]) { mk(new T.CylinderGeometry(.09, .12, 4.2, 8), M('schwarz'), x, 4.3, 175, g); mk(new T.BoxGeometry(.5, .6, .5), M('schwarz'), x, 6.6, 175, g);
    const lm = Mlicht('glas', '#ffd590', 2.2); mk(new T.BoxGeometry(.4, .45, .4), lm, x, 6.6, 175, g, false); const gl = glow('#ffd590', 3.2); gl.position.set(x, 6.6, 175); g.add(gl); W2.lampen.push({glow: gl}); }
  for (const x of [-35, 20, 58]) { const pl = new T.PointLight('#ffc879', 0, 30, 2); pl.position.set(x, 6.4, 174); g.add(pl); W2.lampen.push({licht: pl}); }
  const pol = []; for (let x = -80; x <= 80; x += 9) pol.push([x, 172.4]);
  const polG = lathe([[0, 0], [.22, 0], [.2, .35], [.14, .45], [.24, .55], [.22, .65], [0, .68]]), poI = new T.InstancedMesh(polG, M('schwarz', {rau: .5, side: T.DoubleSide}), pol.length);
  pol.forEach(([x, z], i) => { mtx.compose(new T.Vector3(x, 2.2, z), new T.Quaternion(), new T.Vector3(1.2, 1.2, 1.2)); poI.setMatrixAt(i, mtx); }); g.add(poI);
  W2.sitzMoewen = [[-44, 172.4], [10, 172.4], [37, 172.4]].map(([x, z]) => { const m = bauMoewe(true); m.position.set(x, 3.25, z); m.userData.r0 = rnd(0, TAU); g.add(m); return m; });
  /* Fahrwasser: von See kommend rote Stumpftonnen an Backbord (Osten), grüne Spitztonnen an Steuerbord (Westen) */
  const tonne = (x, z, art) => { const t = new T.Group(); t.position.set(x, 0, z); g.add(t); let farbe = '#ff3a2a', takt = 4;
    if (art === 'rot') { mk(new T.CylinderGeometry(.95, 1.05, .7, 18), M('rot'), 0, .1, 0, t); mk(new T.CylinderGeometry(.6, .62, 1.5, 16), M('rot'), 0, 1.1, 0, t); mk(new T.CylinderGeometry(.32, .32, .55, 12), M('rot'), 0, 2.45, 0, t); }
    else if (art === 'gruen') { farbe = '#37ff6a'; mk(new T.CylinderGeometry(.95, 1.05, .7, 18), M('gruen'), 0, .1, 0, t); mk(new T.ConeGeometry(.75, 1.9, 16), M('gruen'), 0, 1.35, 0, t); mk(new T.ConeGeometry(.33, .55, 12), M('gruen'), 0, 2.65, 0, t); }
    else if (art === 'anst') { farbe = '#fff6e0'; takt = 10; const sg = new T.SphereGeometry(1.1, 20, 14), sc = [], sp = sg.attributes.position;
      for (let i = 0; i < sp.count; i++) { const a = Math.atan2(sp.getZ(i), sp.getX(i)), cc = new T.Color(Math.floor((a + Math.PI) / (Math.PI / 4)) % 2 ? ST.f.rot : ST.f.weiss); sc.push(cc.r, cc.g, cc.b); }
      sg.setAttribute('color', new T.Float32BufferAttribute(sc, 3)); mk(sg, M('weiss', {vc: true}), 0, .55, 0, t); mk(new T.SphereGeometry(.3, 12, 10), M('rot'), 0, 2.2, 0, t); mk(new T.CylinderGeometry(.06, .06, .7, 6), M('schwarz'), 0, 1.65, 0, t); }
    else if (art === 'nord') { farbe = '#fff6e0'; takt = 1; mk(new T.CylinderGeometry(.8, .95, 1.1, 16), M('gelb'), 0, .2, 0, t); mk(new T.CylinderGeometry(.62, .8, 1.1, 16), M('schwarz'), 0, 1.25, 0, t);
      for (const y of [2.15, 2.75]) mk(new T.ConeGeometry(.32, .45, 12), M('schwarz'), 0, y, 0, t); }
    mk(new T.CylinderGeometry(.05, .05, .3, 6), M('schwarz'), 0, art === 'anst' ? 2.6 : 3.05, 0, t, false);
    const gl = glow(farbe, 3); gl.position.set(0, art === 'anst' ? 2.85 : 3.3, 0); t.add(gl);
    const bo = {obj: t, x, z, hx: x, hz: z, vx: 0, vz: 0, r: 1.15, m: 220, kipp: new T.Vector2(), kv: new T.Vector2(), glow: gl, takt, ph: rnd(0, takt), art}; W2.bojen.push(bo); W2.blink.push({glow: gl, takt, an: art === 'anst' ? 2 : .5, ph: bo.ph}); return bo; };
  for (const z of [40, -15, -70]) { tonne(16, z, 'rot'); tonne(-16, z, 'gruen'); }
  tonne(0, -130, 'anst'); tonne(60, -222, 'nord');
  /* Sandbank mit Seehund, Insel mit Leuchtturm */
  const sb = mk(new T.CylinderGeometry(14, 16, .8, 28), M('sandNass'), 60, -.42, -200, g); sb.scale.z = .55;
  const insel = new T.Group(); insel.position.set(120, 0, -250); g.add(insel);
  const ip = [[0, 13], [6, 12.4], [12, 10], [18, 6.5], [22, 3.6], [25, 2.2], [27, 1.4], [30, .6], [33, -.6], [37, -3]];
  const inselH = (x, z) => { const a = Math.atan2(z, x), k = 1 + .12 * Math.sin(3 * a) + .06 * Math.sin(7 * a + 1), r = Math.hypot(x, z) / k;
    for (let i = 0; i < ip.length - 1; i++) if (r <= ip[i + 1][0]) return mix(ip[i][1], ip[i + 1][1], (r - ip[i][0]) / (ip[i + 1][0] - ip[i][0])); return -3; };
  const ig = lathe(ip.map(([r, y]) => [r, y]), null, 48), ipos = ig.attributes.position, icol = [];
  for (let i = 0; i < ipos.count; i++) { const x = ipos.getX(i), z = ipos.getZ(i), y = ipos.getY(i), a = Math.atan2(z, x), k = 1 + .12 * Math.sin(3 * a) + .06 * Math.sin(7 * a + 1);
    ipos.setX(i, x * k); ipos.setZ(i, z * k); const cc = new T.Color(y > 2.6 ? (y > 7 ? ST.f.grasDunkel : ST.f.gras) : y > .2 ? ST.f.sand : ST.f.sandNass); icol.push(cc.r, cc.g, cc.b); }
  ig.setAttribute('color', new T.Float32BufferAttribute(icol, 3)); ig.computeVertexNormals(); mk(ig, M('gras', {vc: true, side: T.DoubleSide}), 0, 0, 0, insel);
  kreis(120, -250, 29, 'grund');
  const tg = lathe([[0, 0], [2.4, 0], [2.3, 4], [2.1, 8], [1.9, 12], [1.8, 15], [0, 15]], null, 24), tpos = tg.attributes.position, tcol = [];
  for (let i = 0; i < tpos.count; i++) { const y = tpos.getY(i), cc = new T.Color(Math.floor(y / 3.75) % 2 ? ST.f.rot : ST.f.weiss); tcol.push(cc.r, cc.g, cc.b); }
  tg.setAttribute('color', new T.Float32BufferAttribute(tcol, 3)); tg.computeVertexNormals(); const turm = new T.Group(); turm.position.set(-2, inselH(-2, 3) - .3, 3); insel.add(turm); mk(tg, M('weiss', {vc: true, side: T.DoubleSide}), 0, 0, 0, turm);
  mk(new T.CylinderGeometry(2.6, 2.6, .3, 20), M('schwarz'), 0, 15.1, 0, turm); const lglas = Mlicht('glas', '#fff2c0', 2.5); mk(new T.CylinderGeometry(1.3, 1.3, 1.8, 16), lglas, 0, 16.2, 0, turm, false); mk(new T.ConeGeometry(1.7, 1.6, 16), M('rot'), 0, 17.9, 0, turm);
  const lgl = glow('#fff2c0', 9); lgl.position.set(0, 16.2, 0); turm.add(lgl);
  const strahl = new T.Group(); strahl.position.set(0, 16.2, 0); turm.add(strahl);
  const sg = new T.ConeGeometry(4, 70, 24, 1, true); sg.translate(0, -35, 0); sg.rotateZ(Math.PI / 2);
  for (const s of [1, -1]) { const m = new T.Mesh(sg, new T.MeshBasicMaterial({color: '#fff2c0', transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide})); m.rotation.y = s > 0 ? 0 : Math.PI; strahl.add(m); }
  W2.leuchtturm = {glow: lgl, strahl, pos: new T.Vector3(118, 28.7, -247)};
  haus(insel, 8, -6, 6, 5, 3.5, 'putz', 'dachRot', fenster, dunkel).position.y = inselH(8, -6) - .5;
  for (const [x, z, s, kegel] of [[10, 8, 1, 1], [-9, -6, 1.2, 0], [14, -9, .9, 1], [-14, 8, 1.1, 1], [3, 15, 1, 0], [-17, -12, .9, 1]]) { const y = inselH(x, z) - .3;
    mk(new T.CylinderGeometry(.25 * s, .35 * s, 2.4 * s, 6), M('stamm'), x, y + 1.1 * s, z, insel);
    if (kegel) { mk(new T.ConeGeometry(2 * s, 3.4 * s, 10), M('baumDunkel'), x, y + 3.6 * s, z, insel); mk(new T.ConeGeometry(1.5 * s, 2.6 * s, 10), M('baumDunkel'), x, y + 5 * s, z, insel); }
    else mk(new T.SphereGeometry(2.1 * s, 14, 10), M('baum'), x, y + 3.6 * s, z, insel); }
  verschmelze(g, W2.bojen.map(b => b.obj).concat([W2.leuchtturm.strahl])); W2.gruppe = g; return W2;
}

/* ================= 7. Himmel ================= */
function bauHimmel() {
  const u = {oben: {value: new T.Color()}, horiz: {value: new T.Color()}, unten: {value: new T.Color()}, sonneFarbe: {value: new T.Color()}, sonneDir: {value: new T.Vector3(0, 1, 0)}, dunst: {value: 0}};
  const m = new T.ShaderMaterial({uniforms: u, side: T.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 oben; uniform vec3 horiz; uniform vec3 unten; uniform vec3 sonneFarbe; uniform vec3 sonneDir; uniform float dunst; varying vec3 vD;
      void main(){ vec3 d = normalize(vD); float h = d.y; vec3 c = h > 0.0 ? mix(horiz, oben, pow(clamp(h, 0.0, 1.0), 0.5)) : mix(horiz, unten, clamp(-h * 5.0, 0.0, 1.0));
        float s = max(dot(d, normalize(sonneDir)), 0.0); c += sonneFarbe * (pow(s, 1200.0) * 4.0 + pow(s, 14.0) * 0.32) * (1.0 - dunst);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  return {m, u};
}

/* ================= 8 + 9. Die Welt ================= */
W.seite = async function (opt = {}) {
  const C = cfg(); ST = STILE[C.stil]; MC = {}; NACHT = []; TOON = null;
  css();
  const gesicht = c => typeof charSVG === 'function' ? charSVG(c).replace('viewBox="0 -2 100 147"', 'viewBox="14 -2 72 72"') : '';
  gameShell('3D-Welt (Test)', `<div id="wtwrap"><div class="wt" id="wt"><div class="hud" id="wthud"><b id="wtk">Kurs 000° · 0,0 kn</b><span id="wtg">neutral · Ruder mittschiffs</span></div>
    <canvas class="wkarte" id="wtkarte" width="224" height="224" aria-label="Karte"></canvas>
    <div class="wgs" id="wtgs">${['hinnerk', 'smilla', 'klabauter'].map(c => `<div class="wg" data-c="${c}">${gesicht(c)}</div>`).join('')}</div><div class="bub" id="wtbub" style="display:none"></div>
    <div class="wtq" id="wtq" style="display:none"></div><div class="wap" id="wtap" style="display:none">🤖 Autopilot</div><button class="btn small lamp wang" id="wtangebot" style="display:none"></button><div class="wsz" id="wtszene" style="display:none"></div>
    <div class="wpad" id="wtpad"><svg class="wst" viewBox="-60 -60 120 120" aria-hidden="true"><g id="wtsg"></g></svg><div class="wgs2"><i class="wgk"></i></div><b class="wl1">voraus</b><b class="wl2">N</b><b class="wl3">zurück</b><button class="wsart" id="wtsart" type="button"></button></div>
    <button class="wb motor" id="wtmot" aria-label="Motor"><span>🔑</span><i id="wtmotl"></i></button><div class="wmp" id="wtmp" style="display:none"></div>
    <button class="wb horn" id="wthorn" aria-label="Schallsignal">📯</button>
    <div class="wtpanel" id="wtpanel" style="display:none"></div></div>
    <div class="wtbar"><button class="btn small" id="wtkam">🎥 ${esc(KAMERAS[C.kam].n)}</button><button class="btn small ghost" id="wtwet">☁️ Wetter und Ort</button><button class="btn small ghost" id="wttausch">🔁 Boot</button><button class="btn small ghost" id="wtfolge">🎬 Testfolge</button><button class="btn small ghost" id="wtmodus" style="display:none">✋ Selbst</button></div></div>`);
  const host = $('#wt'), back = $('#gback');
  try { await nachladen('lib/three.min.js'); } catch (e) { host.innerHTML = '<p style="padding:16px">3D ließ sich nicht laden.</p>'; return; }
  T = window.THREE; if (!document.body.contains(host)) return;
  let r; try { r = new T.WebGLRenderer({antialias: true}); } catch (e) { host.innerHTML = '<p style="padding:16px">Dein Gerät kann kein 3D (WebGL) zeigen.</p>'; return; }
  let dpr = Math.min(window.devicePixelRatio || 1, 1.6); r.setPixelRatio(dpr); r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = ST.belichtung;
  r.shadowMap.enabled = ST.schatten; r.shadowMap.type = T.PCFSoftShadowMap; host.insertBefore(r.domElement, host.firstChild);
  texturen();
  try { AUD.unlock(); AUD.sfx('motorStart', {vol: .5}); } catch (e) {}
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(52, 1, .3, 2500);
  scene.fog = new T.FogExp2('#cfe0e8', .001);
  const hemi = new T.HemisphereLight('#cfe3f2', '#6b5a45', 1), sonne = new T.DirectionalLight('#fff0d6', 3);
  sonne.castShadow = ST.schatten; sonne.shadow.mapSize.set(1024, 1024); Object.assign(sonne.shadow.camera, {left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 220}); sonne.shadow.bias = -.0006; sonne.shadow.normalBias = .03;
  scene.add(hemi, sonne, sonne.target);
  /* Himmel, Umgebung für Spiegelungen, Sterne, Wolken */
  const HI = bauHimmel(), himmel = new T.Mesh(new T.SphereGeometry(1800, 32, 16), HI.m); himmel.renderOrder = -1; himmel.frustumCulled = false; scene.add(himmel);
  const envSzene = new T.Scene(); envSzene.add(new T.Mesh(new T.SphereGeometry(50, 32, 16), HI.m)); const pmrem = new T.PMREMGenerator(r); let envRT = null;
  const stG = new T.BufferGeometry(), stP = []; for (let i = 0; i < 500; i++) { const a = rnd(0, TAU), h = Math.pow(Math.random(), .6) * 1.3 + .12; stP.push(Math.cos(a) * Math.cos(h) * 1700, Math.sin(h) * 1700, Math.sin(a) * Math.cos(h) * 1700); }
  stG.setAttribute('position', new T.Float32BufferAttribute(stP, 3)); const sterne = new T.Points(stG, new T.PointsMaterial({color: '#ffffff', size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0})); sterne.frustumCulled = false; scene.add(sterne);
  const wolken = []; for (let i = 0; i < 18; i++) { const s = new T.Sprite(new T.SpriteMaterial({map: TX.wolke, color: '#ffffff', transparent: true, depthWrite: false, opacity: .9})); const a = rnd(0, TAU), d = rnd(420, 900);
    s.userData = {a, d, y: rnd(90, 190)}; s.scale.set(rnd(220, 380), rnd(80, 130), 1); scene.add(s); wolken.push(s); }
  /* Welt */
  const WL = bauWelt(scene);
  const schiff = bauSchiff(); scene.add(schiff); const SCH = {obj: schiff, a: 0, x: 50, z: -260, h: 0, v: 3.2, R: 110, cx: -60, cz: -260, vx: 0, vz: 0, wack: 0, wv: 0};
  /* Wasser: Gitter folgt dem Boot (in Zellenschritten, damit nichts schwimmt), dahinter eine große ruhige Fläche */
  /* Das Gitter ist in der Mitte fein (knapp 0,9 m, das Boot liegt immer dort) und wird nach außen grob. Außen zeigt es nur die langen Wellen,
     die kurzen übernimmt dort die Struktur der Oberfläche; so flimmert nichts, wenn das Gitter mitwandert. */
  const WS = 330, WN = 96, WA = .25, ZELLE = WS / WN * WA, wg = new T.PlaneGeometry(WS, WS, WN, WN); wg.rotateX(-Math.PI / 2);
  const wpos = wg.attributes.position, basis = new Float32Array(wpos.count * 2), wcol = new Float32Array(wpos.count * 3), wh = new Float32Array(wpos.count);
  const verzerr = v => { const u = v / (WS / 2); return WS / 2 * (WA * u + (1 - WA) * u * u * u); }, weite = v => { const u = v / (WS / 2); return WS / WN * (WA + 3 * (1 - WA) * u * u); };
  for (let i = 0; i < wpos.count; i++) { const x0 = wpos.getX(i), z0 = wpos.getZ(i); basis[2 * i] = verzerr(x0); basis[2 * i + 1] = verzerr(z0); wh[i] = Math.max(weite(x0), weite(z0)); wpos.setXYZ(i, basis[2 * i], 0, basis[2 * i + 1]); }
  wg.setAttribute('color', new T.BufferAttribute(wcol, 3));
  const wN = TX.wasserN; wN.repeat.set(26, 26);
  const wmat = ST.flach ? new T.MeshLambertMaterial({vertexColors: true, flatShading: true}) : new T.MeshStandardMaterial({vertexColors: true, roughness: .16, metalness: 0, normalMap: wN, normalScale: new T.Vector2(.3, .3)});
  const wmatE = new T.MeshPhongMaterial({vertexColors: true, shininess: 90, specular: '#cfd8dc', normalMap: wN, normalScale: new T.Vector2(.35, .35)});
  const wasser = new T.Mesh(wg, wmat); wasser.receiveShadow = false; wasser.frustumCulled = false; scene.add(wasser);
  const fernN = wN.clone(); fernN.repeat.set(200, 200); fernN.needsUpdate = true;
  const fmat = ST.flach ? new T.MeshLambertMaterial({color: '#2a6a7c'}) : new T.MeshStandardMaterial({color: '#2a6a7c', roughness: .2, normalMap: fernN, normalScale: new T.Vector2(.25, .25)});
  const fern = new T.Mesh(new T.PlaneGeometry(5000, 5000), fmat); fern.rotation.x = -Math.PI / 2; fern.position.y = -.08; scene.add(fern);
  /* Spieler-Boot */
  const motStart = () => ({quick: false, tank: false, pump: 0, choke: false, kalt: true, laufT: 0, chokeT: 0, zuege: 0, warnT: 0});
  const P = {x: 0, z: 0, vx: 0, vz: 0, h: 0, r: 0, g: 0, d: 0, gZiel: 0, dZiel: 0, y: 0, vy: 0, nick: 0, vn: 0, roll: 0, vr: 0, boot: null, hk: 0, motor: 'an', mot: Object.assign(motStart(), {quick: true, tank: true, pump: 3, kalt: false}), gleit: 0, buckel: 0};
  const BOOTE = [() => bauBoot({art: 'kajuete'}), () => bauBoot({art: 'offen', mast: 'ohne', farben: {streifen: '#2f6f9e', rumpf: '#fbf2df'}})];
  const katze = bauKatze(), KZ = {i: 0, u: 0, modus: 'gehen', zeit: 0, hupf: 0, schreck: 0, ph: 0};
  /* Die Crew steht nicht mehr an Bord (Nutzer 01.11.2026): sie ist mit ihren Gesichtern am Bildschirmrand dabei. bauFigur bleibt für später. */
  const CREWF = {}, crewPlatz = {hinnerk: 'hinnerk', smilla: 'smilla', klabauter: 'dach'};
  const platzVon = (obj, name) => { const pl = (obj.userData.plaetze || {})[name]; if (!pl) return null; return new T.Vector3(pl[0], pl[2] != null ? pl[2] : (obj.userData.deckY ? obj.userData.deckY(pl[1]) : 1), pl[1]); };
  function crewSetzen() { for (const w in CREWF) { const f = CREWF[w]; f.parent && f.parent.remove(f); const v = platzVon(P.boot, crewPlatz[w]); f.userData.weg = null; if (!v) continue; P.boot.add(f); f.position.copy(v); f.rotation.y = 0; } }
  /* Eine Figur geht an einen anderen Platz, außen an der Kajüte vorbei */
  function crewGehe(w, platz) { crewPlatz[w] = platz; const f = CREWF[w]; if (!f) return; const v = platzVon(P.boot, platz); if (!v || !f.parent) return; const a = f.position.clone(), seite = (P.boot.userData.breite || 3) * .4, dY = P.boot.userData.deckY || (() => v.y);
    f.userData.weg = Math.abs(v.z - a.z) > 2 && w !== 'klabauter' ? [new T.Vector3(seite, dY(a.z), a.z), new T.Vector3(seite, dY(v.z), v.z), v] : [v]; }
  W.setzeBoot = obj => { if (P.boot) { scene.remove(P.boot); } P.boot = obj; scene.add(obj); katze.parent && katze.parent.remove(katze); obj.add(katze);
    const weg = obj.userData.katzenWeg || []; KZ.i = 0; KZ.u = 0; if (weg[0]) katze.position.copy(weg[0]); crewSetzen(); steuerTeile(); setzeWetter(); };
  /* Wellen und Wetter */
  let WLst = [], windMs = 0, windVon = 0, schaumMenge = 0, nachtAn = false, lichterAn = false, wasserFarbe = new T.Color(), krone = new T.Color('#f2f6f4');
  const hafenRuhe = (x, z) => 1 - .88 * sm(-6, 8, Math.min(x + 72, 72 - x, z - 80, 168 - z));
  const schwell = (x, z, t) => { if (!C.wellen.schwell) return 0; const dx = x - SCH.x, dz = z - SCH.z, f = Math.sin(SCH.h), g2 = -Math.cos(SCH.h), a = -(dx * f + dz * g2), l = Math.abs(dx * Math.cos(SCH.h) + dz * Math.sin(SCH.h));
    if (a < 2 || a > 260) return 0; const kante = a * .36 + 3; if (l > kante + 6) return 0; return .55 * Math.exp(-a / 110) * sm(kante + 6, kante - 2, l) * Math.sin(.55 * (a * .5 + l * 1.1) - t * 2.6); };
  const hoeheRoh = (x, z, t) => { let y = 0; const da = hafenRuhe(x, z); for (const q of WLst) y += q.A * da * Math.sin(q.k * (q.dx * x + q.dz * z) - q.om * t + q.ph); return y + schwell(x, z, t) * da; };
  /* Höhe der echten Oberfläche: Gerstner-Wellen verschieben das Wasser auch seitlich; zurückrechnen, damit Boot und Bild übereinstimmen */
  const flaeche = (x, z, t) => { let px = x, pz = z; for (let it = 0; it < 3; it++) { let dx = 0, dz = 0; const da = hafenRuhe(px, pz);
    for (const q of WLst) { const c = Math.cos(q.k * (q.dx * px + q.dz * pz) - q.om * t + q.ph) * q.Q * q.A * da; dx += c * q.dx; dz += c * q.dz; } px = x - dx; pz = z - dz; } return hoeheRoh(px, pz, t); };
  W.hoehe = (x, z) => flaeche(x, z, uhr);
  function setzeWetter() {
    const Z = ZEIT[C.zeit], w = WIND[C.wind], sicht = SICHT[C.sicht], regen = REGEN[C.regen], trueb = (C.regen !== 'kein' ? .6 : 0) + (C.wind === 'sturm' ? .5 : C.wind === 'stark' ? .3 : 0) + ({klar: 0, dunst: .25, nebel: .7, dicht: .85, extrem: .95})[C.sicht];
    const t2 = cl(trueb, 0, 1), grau = new T.Color(C.zeit === 'nacht' ? '#1a222c' : '#a3abb0');
    WLst = wellenListe(C); windMs = w.ms; windVon = C.von * 45 * RAD; nachtAn = C.zeit === 'nacht'; lichterAn = nachtAn || C.zeit === 'abend' || ['nebel', 'dicht', 'extrem'].includes(C.sicht);
    schaumMenge = ({flaute: 0, leicht: 0, maessig: .15, frisch: .55, stark: .85, sturm: 1})[C.wind];
    const oben = new T.Color(Z.oben).lerp(grau, t2 * .85), horiz = new T.Color(Z.horiz).lerp(grau.clone().offsetHSL(0, 0, .05), t2 * .9);
    HI.u.oben.value.copy(oben); HI.u.horiz.value.copy(horiz); HI.u.unten.value.copy(new T.Color(Z.wasser).lerp(grau, t2 * .5)); HI.u.sonneFarbe.value.set(Z.sonne); HI.u.dunst.value = t2;
    const el = Z.el * RAD, az = Z.az * RAD; HI.u.sonneDir.value.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    sonne.color.set(Z.sonne); sonne.intensity = Z.licht * (1 - t2 * .7); hemi.intensity = Z.hemi * (1 - t2 * .25); hemi.color.copy(oben).lerp(new T.Color('#ffffff'), .4);
    scene.fog.color.copy(horiz); scene.fog.density = sicht.d + (C.regen === 'stark' ? .004 : C.regen === 'regen' ? .0015 : 0);
    r.toneMappingExposure = ST.belichtung * Z.bel;
    wasserFarbe.set(Z.wasser).lerp(grau, t2 * .35); fmat.color.copy(wasserFarbe);
    if (!ST.flach) { const ns = C.wind === 'flaute' ? .05 : ({leicht: .3, maessig: .5, frisch: .65, stark: .8, sturm: 1})[C.wind]; wmat.normalScale.set(ns, ns); fmat.normalScale.set(ns * .8, ns * .8); wmat.roughness = C.regen === 'kein' ? .14 : .3; }
    sterne.material.opacity = nachtAn && t2 < .3 ? .9 : 0;
    wolken.forEach((s, i) => { s.material.color.copy(new T.Color(nachtAn ? '#3a4560' : C.zeit === 'abend' ? '#ffd9bf' : '#ffffff').lerp(grau, t2)); s.visible = i < 5 + t2 * 13; s.material.opacity = .55 + t2 * .4; });
    for (const n of NACHT) { n.m.emissive.copy(lichterAn || nachtAn ? n.leucht : new T.Color(0)); n.m.emissiveIntensity = nachtAn ? n.staerke : .35 * n.staerke; }
    for (const l of WL.lampen) if (l.licht) l.licht.intensity = nachtAn ? 70 : 0;
    regenAn(regen.z); sonne.position.copy(HI.u.sonneDir.value).multiplyScalar(120);
    if (envRT) envRT.dispose(); envRT = null; if (!ST.flach) { envRT = pmrem.fromScene(envSzene, .04); scene.environment = QA && QUALI[QA].env ? envRT.texture : null; }
    const be = $('#wtbft'); if (be) be.textContent = w.bft + ' Bft';
  }
  /* Regen */
  const RN = 1500, rg = new T.BufferGeometry(), rp = new Float32Array(RN * 6); rg.setAttribute('position', new T.BufferAttribute(rp, 3));
  const regenL = new T.LineSegments(rg, new T.LineBasicMaterial({color: '#b9c6cf', transparent: true, opacity: .45})); regenL.frustumCulled = false; scene.add(regenL); let regenZahl = 0;
  for (let i = 0; i < RN; i++) { rp[i * 6] = rnd(-40, 40); rp[i * 6 + 1] = rnd(0, 30); rp[i * 6 + 2] = rnd(-40, 40); }
  function regenAn(n) { regenZahl = n; regenL.visible = n > 0; rg.setDrawRange(0, n * 2); }
  /* Kielwasser als Band, Bugwellen als zwei auseinanderlaufende Bänder */
  function band(nMax, breite, drift, staerke) {
    const pts = [], geo = new T.BufferGeometry(), pos = new Float32Array(nMax * 6), col = new Float32Array(nMax * 8), uv = new Float32Array(nMax * 4), idx = [];
    for (let i = 0; i < nMax - 1; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 4)); geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); geo.setIndex(idx);
    const m = new T.Mesh(geo, new T.MeshBasicMaterial({map: TX.schaum, vertexColors: true, transparent: true, depthWrite: false, side: T.DoubleSide})); m.frustumCulled = false; m.renderOrder = 3; scene.add(m);
    return {m, add(x, z, vx, vz, s, t) { pts.unshift({x, z, vx, vz, s, t}); if (pts.length > nMax) pts.pop(); },
      upd(t) { const n = pts.length; for (let i = 0; i < nMax; i++) { const p = pts[Math.min(i, n - 1)]; if (!p) { col[i * 8 + 3] = col[i * 8 + 7] = 0; continue; }
        const a = t - p.t, x = p.x + p.vx * a, z = p.z + p.vz * a, q = pts[Math.min(i + 1, n - 1)], qx = q.x + q.vx * (t - q.t), qz = q.z + q.vz * (t - q.t);
        let nx = -(z - qz), nz = x - qx; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l; const w = breite * (1 + a * drift), y = flaeche(x, z, t) + .07, al = i >= n ? 0 : cl(p.s * staerke * (1 - a / 8), 0, 1) * (i === 0 ? 0 : 1);
        pos.set([x + nx * w, y, z + nz * w, x - nx * w, y, z - nz * w], i * 6); col.set([1, 1, 1, al, 1, 1, 1, al], i * 8); uv.set([0, i * .25, 1, i * .25], i * 4); }
        geo.attributes.position.needsUpdate = geo.attributes.color.needsUpdate = geo.attributes.uv.needsUpdate = true; }};
  }
  const kiel = band(80, 1, .45, .8), bugL = band(60, .35, .25, .55), bugR = band(60, .35, .25, .55), schiffKiel = band(70, 2, .4, .7);
  /* Gischt und Spritzer */
  const GN = 260, gg = new T.BufferGeometry(), gpos = new Float32Array(GN * 3), gcol = new Float32Array(GN * 4), G = [];
  gg.setAttribute('position', new T.BufferAttribute(gpos, 3)); gg.setAttribute('color', new T.BufferAttribute(gcol, 4));
  const gischt = new T.Points(gg, new T.PointsMaterial({size: .35, map: TX.glow, vertexColors: true, transparent: true, depthWrite: false})); gischt.frustumCulled = false; scene.add(gischt);
  for (let i = 0; i < GN; i++) G.push({x: 0, y: -99, z: 0, vx: 0, vy: 0, vz: 0, t: 9}); let gI = 0;
  const spritz = (x, y, z, vx, vy, vz) => { const p = G[gI++ % GN]; Object.assign(p, {x, y, z, vx, vy, vz, t: 0}); };
  /* Tiere */
  const fliegen = [0, 1, 2].map(i => { const m = bauMoewe(false); scene.add(m); return m; });
  const enten = [bauEnte(false), bauEnte(true), bauEnte(true), bauEnte(true), bauEnte(true)].map((e, i) => { scene.add(e); return {o: e, x: 10 - i * .8, z: 140, h: 0}; });
  let entenZiel = {x: 10, z: 140, t: 0};
  const seehund = bauSeehund(); seehund.position.set(62, .1, -200); seehund.rotation.y = 2.2; scene.add(seehund); const SH = {weg: false, zeit: 0, y: .1};
  /* Kamera */
  const K = Object.assign({mode: C.kam, last: -9999, shake: 0, pos: new T.Vector3(), blick: new T.Vector3(), hs: 0, fov: 52}, KAMERAS[C.kam]);
  /* Startort */
  function setzeOrt(id) { const o = ORTE[id]; Object.assign(P, {x: o.x, z: o.z, h: o.h, vx: 0, vz: 0, r: 0, g: 0, gZiel: 0, d: 0, dZiel: 0, hk: o.h, fest: id === 'hafen' ? {x: o.x, z: o.z, h: o.h} : null,
      motor: id === 'hafen' ? 'aus' : 'an', mot: id === 'hafen' ? motStart() : Object.assign(motStart(), {quick: true, tank: true, pump: 3, kalt: false})}); if (typeof motorPanel === 'function') try { motorPanel(); } catch (e) {} K.hs = o.h; pad && pad.setze(0, 0);
    K.pos.set(o.x - Math.sin(o.h) * 90, 40, o.z + Math.cos(o.h) * 90); K.blick.set(o.x, 1, o.z); tor = {}; }
  /* Physik: Schub über den Außenborder, Widerstand, Radeffekt, Wind */
  function physik(dt, t) {
    const fx = Math.sin(P.h), fz = -Math.cos(P.h), rx = Math.cos(P.h), rz = Math.sin(P.h);
    let u = P.vx * fx + P.vz * fz, s = P.vx * rx + P.vz * rz;
    if (P.fest && (Math.abs(P.gZiel) > .05)) P.fest = null;
    if (!FAHRT) {
    P.g += (P.gZiel - P.g) * Math.min(1, dt * 2.2); P.d += (P.dZiel - P.d) * Math.min(1, dt * 4);
    /* Schub nur bei laufendem Motor. Widerstand: erst Verdrängerfahrt, dann der „Buckel“ (Bug hoch, viel Welle), ab etwa 11 kn Gleitfahrt */
    const an = P.motor === 'an', gE = an ? P.g * (P.mot.choke && P.mot.chokeT > 6 ? .55 : 1) : 0, schub = gE > 0 ? gE * 3.3 : gE * 1.15, wk = P.d * .5;
    const wid = u < 0 ? .062 * u * Math.abs(u) + .14 * u : .16 * u + .012 * u * u + 1.3 * Math.exp(-Math.pow((u - 4.6) / 1.6, 2)) * Math.min(1, u / 2.5);
    let du = schub * Math.cos(wk) - wid, ds = -.9 * s * Math.abs(s) - 1.3 * s, dr = P.d * (.075 * Math.min(Math.max(u, -3), 5) + .04 * Math.max(0, u - 5) + .34 * gE) - 2 * P.r * (1 + Math.max(0, u - 4) / 10);
    if (gE < -.05) dr += .14 * -gE * (1 - Math.min(1, Math.abs(u) / 2)); else if (gE > .05) dr -= .025 * gE * (1 - Math.min(1, u / 3));
    if (windMs) { const lee = windVon + Math.PI, wx = Math.sin(lee), wz = -Math.cos(lee), kr = .0011 * windMs * windMs;
      du += kr * (wx * fx + wz * fz) * .35; ds += kr * (wx * rx + wz * rz); const langsam = 1 - Math.min(1, Math.abs(u) / 3); dr += .0006 * windMs * windMs * Math.sin(wdiff(lee, P.h)) * (.35 + .65 * langsam); }
    const wellig = WLst.reduce((a, q) => a + q.A, 0); if (wellig > .3) dr += Math.sin(t * .9 + Math.sin(t * .37) * 2) * .02 * wellig;
    u += du * dt; s += ds * dt; P.r += dr * dt; P.h += P.r * dt;
    { const nfx = Math.sin(P.h), nfz = -Math.cos(P.h), nrx = Math.cos(P.h), nrz = Math.sin(P.h);
    P.vx = u * nfx + s * nrx; P.vz = u * nfz + s * nrz; } P.x += P.vx * dt; P.z += P.vz * dt; P.u = u;
    /* festgemacht: Leinen halten das Boot am Platz */
    if (P.fest) { const k = Math.min(1, dt * 1.5); P.x += (P.fest.x - P.x) * k; P.z += (P.fest.z - P.z) * k; P.h += wdiff(P.fest.h, P.h) * k; P.vx *= 1 - k; P.vz *= 1 - k; P.r *= 1 - k; }
    }
    const nfx = Math.sin(P.h), nfz = -Math.cos(P.h), nrx = Math.cos(P.h), nrz = Math.sin(P.h); if (FAHRT) u = P.u || 0;
    /* Auf und ab, Stampfen und Rollen: fünf Messpunkte auf der echten Oberfläche, Feder und Dämpfer */
    const L = P.boot.userData.laenge || 8, B = P.boot.userData.breite || 3, dY = P.boot.userData.deckY || (() => .9);
    const pt = (lz, lx) => flaeche(P.x + nfx * lz - nrx * lx, P.z + nfz * lz - nrz * lx, t);
    const hb = pt(L * .38, 0), hh = pt(-L * .4, 0), hp = pt(0, B * .42), hs = pt(0, -B * .42), hm = pt(0, 0);
    P.gleit = sm(5.8, 7.6, u); P.buckel = u > 2.5 ? Math.exp(-Math.pow((u - 5) / 1.25, 2)) : 0;
    const ty = (hb + hh + hp + hs + 2 * hm) / 6 + .15 * P.gleit, tn = Math.atan((hb - hh) / (L * .78)) + .03 * Math.min(1, Math.max(0, u) / 5) + .09 * P.buckel + .03 * P.gleit, tr = Math.atan((hp - hs) / (B * .84)) * .9 + P.r * Math.max(0, u) * .035 + (windMs > 10 ? -.03 * Math.sin(wdiff(windVon, P.h)) : 0);
    P.vy += ((ty - P.y) * 20 - P.vy * 6) * dt; P.y += P.vy * dt; P.vn += ((tn - P.nick) * 14 - P.vn * 5) * dt; P.nick = cl(P.nick + P.vn * dt, -.35, .35); P.vr += ((tr - P.roll) * 11 - P.vr * 3.5) * dt; P.roll = cl(P.roll + P.vr * dt, -.42, .42);
    /* Freibord: Die Deckskante darf höchstens 12 cm unter Wasser geraten (ein Schwapp ist in Ordnung, Untertauchen nicht) */
    let ueber = -9, wo = null;
    for (const [lz, lx] of [[L * .42, 0], [-L * .46, 0], [0, B * .48], [0, -B * .48], [L * .22, B * .42], [L * .22, -B * .42], [-L * .3, B * .48], [-L * .3, -B * .48]]) {
      const o = pt(lz, lx) - (P.y + dY(lz) + lz * Math.sin(P.nick) + lx * Math.sin(P.roll)); if (o > ueber) { ueber = o; wo = [lz, lx]; } }
    P.ueber = ueber; if (ueber > .12) { P.y += ueber - .12; if (P.vy < 0) P.vy *= .3; }
    P.schwapp = (P.schwapp || 0) - dt;
    if (ueber > -.04 && P.schwapp < 0 && wo) { P.schwapp = .25; const wx = P.x + nfx * wo[0] - nrx * wo[1], wz = P.z + nfz * wo[0] - nrz * wo[1]; for (let i = 0; i < 10; i++) spritz(wx, P.y + dY(wo[0]) + .1, wz, rnd(-1.5, 1.5) + P.vx * .5, rnd(1.5, 3.5), rnd(-1.5, 1.5) + P.vz * .5); }
  }
  /* Zusammenstöße: Boot als drei Kreise; Bojen werden weggestoßen, Schiffe schubsen leicht, Steine und Stege stehen fest */
  let ruckZeit = 0, crewZeit = 0;
  function kollision(t) {
    const B = P.boot, kr = (B.userData.kreise || [{z: 0, r: 1.5}]), mB = 2500, I = mB * Math.pow(B.userData.laenge || 8, 2) / 14, fx = Math.sin(P.h), fz = -Math.cos(P.h);
    const stoss = (ox, oz, nx, nz, pen, vox, voz, mO, e, art, anderes) => {
      const iB = 1 / mB, iO = mO ? 1 / mO : 0, an = (ox * nz - oz * nx), vpx = P.vx - P.r * oz, vpz = P.vz + P.r * ox, vn = (vpx - vox) * nx + (vpz - voz) * nz;
      const anteil = iB / (iB + iO); P.x += nx * pen * anteil; P.z += nz * pen * anteil; if (anderes) { anderes.x -= nx * pen * (1 - anteil); anderes.z -= nz * pen * (1 - anteil); }
      if (vn >= 0) return; const j = -(1 + e) * vn / (iB + iO + an * an / I); P.vx += j * nx * iB; P.vz += j * nz * iB; P.r += an * j / I * .9;
      if (anderes && mO) { anderes.vx -= j * nx * iO; anderes.vz -= j * nz * iO; }
      const st = Math.min(1, -vn / 2.4); if (st > .12 && t - ruckZeit > .25) { ruckZeit = t; ruck(art, st, P.x + ox, P.z + oz); }
    };
    for (const c of kr) { const ox = fx * c.z, oz = fz * c.z, cx = P.x + ox, cz = P.z + oz;
      for (const s of WL.stat) { let qx = s.ax, qz = s.az; if (s.k) { const dx = s.bx - s.ax, dz = s.bz - s.az, u = cl(((cx - s.ax) * dx + (cz - s.az) * dz) / (dx * dx + dz * dz), 0, 1); qx = s.ax + dx * u; qz = s.az + dz * u; }
        const dx = cx - qx, dz = cz - qz, d = Math.hypot(dx, dz), pen = c.r + s.r - d; if (pen > 0 && d > 1e-4) stoss(ox, oz, dx / d, dz / d, pen, 0, 0, 0, s.art === 'grund' ? .02 : s.art === 'stein' ? .12 : .25, s.art); }
      for (const b of WL.bojen) { const dx = cx - b.x, dz = cz - b.z, d = Math.hypot(dx, dz), pen = c.r + b.r - d; if (pen > 0 && d > 1e-4) { stoss(ox, oz, dx / d, dz / d, pen, b.vx, b.vz, b.m, .45, 'boje', b); b.kv.x += -dz / d * .9; b.kv.y += dx / d * .9; } }
      const sf = Math.sin(SCH.h), sz = -Math.cos(SCH.h);
      for (const k of schiff.userData.kreise) { const sx = SCH.x + sf * k.z, szz = SCH.z + sz * k.z, dx = cx - sx, dz = cz - szz, d = Math.hypot(dx, dz), pen = c.r + k.r - d;
        if (pen > 0 && d > 1e-4) { const sch = {x: 0, z: 0, vx: 0, vz: 0}; stoss(ox, oz, dx / d, dz / d, pen, SCH.vx, SCH.vz, 40000, .25, 'schiff', sch); SCH.wv += .05; } } }
  }
  const SPRUCH = {stein: [['hinnerk', 'Wahrschau! Das war die Mole.'], ['smilla', 'Rums. Da helfen auch keine Fender mehr.']], holz: [['hinnerk', 'Sachte! Der Steg kann nichts dafür.']],
    boot: [['hinnerk', 'Abstand halten! Das gibt Ärger mit dem Eigner.'], ['smilla', 'Kratzer im Lack. Langsamer ran, dann passiert das nicht.']], boje: [['klabauter', 'Tonne! Tonne! Krrah!'], ['smilla', 'Die Tonne steht da mit Absicht.']],
    schiff: [['smilla', 'Das war knapp. Wer hätte hier ausweichen müssen?']], grund: [['hinnerk', 'Festgefahren. Langsam rückwärts, dann kommen wir frei.']]};
  function ruck(art, st, x, z) {
    stoesse++; K.shake = Math.max(K.shake, st * (art === 'boje' ? .5 : 1)); try { navigator.vibrate && navigator.vibrate(Math.round(25 + st * 90)); } catch (e) {}
    try { AUD.stoss(art === 'grund' ? 'stein' : art === 'schiff' ? 'boot' : art, st); } catch (e) {}
    for (let i = 0; i < 6 + st * 18; i++) spritz(x, flaeche(x, z, uhr) + .2, z, rnd(-2, 2), rnd(1.5, 4.5) * st + 1, rnd(-2, 2));
    if (st > .3) { KZ.schreck = 1.1; try { AUD.sfx('katze', {vol: .5}); } catch (e) {} }
    if (uhr - crewZeit > 7 && st > .2 && !(FOLGE && sprecher)) { crewZeit = uhr; const L2 = SPRUCH[art] || SPRUCH.boot, s = L2[Math.random() * L2.length | 0]; sag(s[0], s[1]); }
  }
  /* Steuerfeld wie im Manöverspiel: ein Finger, hoch/runter stufenlos Gas mit Raste in der Mitte, seitlich das Ruder; Doppeltipp = Ruder mittschiffs */
  /* Steuerart wie im Manöverspiel (gemeinsame Einstellung): Pinne am Außenborder (Pinne nach rechts, Bug nach links) oder Steuerrad */
  const steuerArt = () => (window.S && S.cfg && S.cfg.steuer) || 'pinne';
  const SVG_RAD = `<g id="wtdreh"><circle r="44" fill="none" stroke="#6e4120" stroke-width="9"/><circle r="44" fill="none" stroke="#c9935e" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<g transform="rotate(${i * 45})"><line y1="-9" y2="-51" stroke="#9c6236" stroke-width="5" stroke-linecap="round"/><circle cy="-54" r="6" fill="${i ? '#9c6236' : '#e0b04a'}" stroke="#6e4120" stroke-width="1.5"/></g>`).join('')}<circle r="11" fill="#c8962e" stroke="#7a5a1e" stroke-width="2"/></g>`;
  const SVG_PINNE = `<line x1="-46" y1="36" x2="46" y2="36" stroke="#fffaf0" stroke-opacity=".45" stroke-width="3"/><text x="-48" y="52" font-size="9" fill="#ff8a7a" font-weight="700">Bb</text><text x="34" y="52" font-size="9" fill="#7dff9a" font-weight="700">Stb</text>
    <g id="wtdreh"><rect x="-5" y="-42" width="10" height="80" rx="5" fill="#3a4046"/><rect x="-8" y="-50" width="16" height="24" rx="7" fill="#15181b"/><ellipse cx="0" cy="44" rx="17" ry="12" fill="#33383d" stroke="#c0392b" stroke-width="3"/></g>`;
  const pad = (() => { const el = $('#wtpad'), knob = el.querySelector('.wgk'), sg = $('#wtsg'), DZ = .12; let kx = 0, ky = 0, start = null, lastTap = 0, art = null;
    const zeig = () => { const m = steuerArt(); if (m !== art) { art = m; sg.innerHTML = m === 'rad' ? SVG_RAD : SVG_PINNE; $('#wtsart').textContent = m === 'rad' ? '☸ Rad' : '🛶 Pinne'; }
      const d = $('#wtdreh'); if (d) d.setAttribute('transform', m === 'rad' ? `rotate(${(kx * 135).toFixed(1)})` : `rotate(${(kx * 35).toFixed(1)} 0 44)`);
      knob.style.top = ((1 - ky) / 2 * 100).toFixed(1) + '%'; };
    const setze = () => { const g = Math.abs(ky) < DZ ? 0 : Math.sign(ky) * (Math.abs(ky) - DZ) / (1 - DZ), war = P.gZiel; P.gZiel = Math.round(g * 40) / 40; P.dZiel = steuerArt() === 'pinne' ? -kx : kx;
      if ((war === 0) !== (P.gZiel === 0) || Math.sign(war) !== Math.sign(P.gZiel)) { try { AUD.click(); } catch (e) {} } zeig(); };
    el.addEventListener('pointerdown', e => { if (FAHRT && !FAHRT.o.fest) { uebernehmen(); ky = P.g; kx = 0; } el.setPointerCapture(e.pointerId); start = {x: e.clientX, y: e.clientY, kx, ky}; const now = performance.now(); if (now - lastTap < 320) { kx = 0; setze(); start.kx = 0; } lastTap = now; });
    el.addEventListener('pointermove', e => { if (!start) return; const w = el.clientWidth, h = el.clientHeight; kx = cl(start.kx + (e.clientX - start.x) / (w / 2 - 24), -1, 1); ky = cl(start.ky - (e.clientY - start.y) / (h / 2 - 26), -1, 1); setze(); });
    const los = () => { start = null; }; el.addEventListener('pointerup', los); el.addEventListener('pointercancel', los); zeig();
    $('#wtsart').addEventListener('pointerdown', e => e.stopPropagation());
    $('#wtsart').onclick = e => { e.stopPropagation(); S.cfg.steuer = steuerArt() === 'pinne' ? 'rad' : 'pinne'; try { save(); AUD.click(); } catch (x) {} setze(); steuerTeile();
      sag('hinnerk', steuerArt() === 'pinne' ? 'Pinne am Außenborder: Pinne nach rechts, und der Bug geht nach links. Rückwärts andersrum.' : 'Steuerrad: Rad nach rechts, Bug nach rechts. Der Außenborder dreht mit.', 5000); };
    return {setze: (gx, px) => { ky = gx; kx = px; setze(); }, get: () => [ky, kx], zeig}; })();
  /* ---------- Motor starten wie in echt: Quickstopp, Tankentlüftung, Pumpball, Choke, Neutral, dann Starttaste (Kajütboot) oder Startleine ----------
     Fehler haben echte Folgen: ohne Quickstopp keine Zündung (Frage 42), Belüftungsschraube zu = Motor geht nach einer Weile aus (Frage 57),
     Choke zu lange drin = er säuft ab, im Gang springt er nicht an. Die Crew sagt, woran es liegt. */
  const vStr = new T.Vector3(), mpEl = $('#wtmp'), eStart = () => !!(P.boot && P.boot.userData.art === 'kajuete');
  let hinweisT = -99;
  const tipp = (t, wer = 'hinnerk') => { if (uhr - hinweisT < .4) return; hinweisT = uhr; sag(wer, t, 5500); };
  const mTon = a => { try { AUD.motorTon ? AUD.motorTon(a) : AUD.click(); } catch (e) {} };
  function motorAn(still) { Object.assign(P.mot, {quick: true, tank: true, pump: 3, choke: false, laufT: 0, chokeT: 0}); P.motor = 'an'; if (!still) try { AUD.sfx('motorStart', {vol: .5}); } catch (e) {} motorPanel(); }
  function motorAus(grund) { if (P.motor !== 'an') return; P.motor = 'aus'; mTon('aus'); if (grund) tipp(grund); motorPanel(); }
  function startVersuch(kraft) {
    if (P.motor === 'an') return; const m = P.mot; m.zuege++;
    if (!m.quick) { mTon('klick'); return tipp('Nix. Ohne eingeklinkte Quickstopp-Leine gibt es keine Zündung.'); }
    if (Math.abs(P.gZiel) > .02) { mTon('klick'); return tipp('Erst den Hebel auf Neutral. Im Gang springt er nicht an.'); }
    if (m.pump < 3) { mTon('husten'); return tipp('Er hustet nur. Erst den Pumpball drücken, bis er hart ist.'); }
    if (m.kalt && !m.choke) { mTon('husten'); return tipp(m.zuege > 2 ? 'Kalter Motor will Choke. Zieh den Choke.' : 'Er will nicht. Was braucht ein kalter Motor?'); }
    if (!m.kalt && m.choke) { mTon('husten'); return tipp('Er säuft ab. Ein warmer Motor braucht keinen Choke.'); }
    if (kraft < .45 || Math.random() > (eStart() ? .92 : .72)) { mTon('husten'); return tipp(eStart() ? 'Fast. Taste noch mal etwas länger halten.' : 'Fast. Kräftiger ziehen, ganz durch.'); }
    P.motor = 'an'; m.laufT = 0; m.chokeT = 0; m.warnT = 0; try { AUD.sfx('motorStart', {vol: .5}); } catch (e) {}
    tipp(m.choke ? 'Läuft! Jetzt den Choke langsam reinschieben. Und kommt der Kontrollstrahl?' : 'Läuft. Der Kontrollstrahl kommt, Kühlwasser ist da.'); motorPanel(); }
  function motorTick(dt) { if (P.motor !== 'an') return; const m = P.mot; m.laufT += dt; if (m.laufT > 50) m.kalt = false;
    if (m.choke) { m.chokeT += dt; if (m.chokeT > 7 && !m.warnT) { m.warnT = 1; tipp('Der läuft zu fett. Choke rein!'); } if (m.chokeT > 15) { m.kalt = false; motorAus('Abgesoffen. Der Choke war noch drin. Nach dem Start langsam reinschieben.'); } }
    if (!m.tank && m.laufT > 40) motorAus('Motor aus, aber der Tank ist voll? Die Belüftungsschraube ist zu. Ohne Luft saugt die Pumpe ein Vakuum.'); }
  function motorPanel() { const m = P.mot, an = P.motor === 'an', e = eStart(), lamp = $('#wtmotl'); if (lamp) lamp.className = an ? 'an' : '';
    if (!mpEl || mpEl.style.display === 'none') return;
    const z = (ok, txt, sch) => `<button class="wms${ok ? ' ok' : ''}" data-s="${sch}"><i>${ok ? '✓' : ''}</i><span>${txt}</span></button>`;
    mpEl.innerHTML = `<div class="wmk"><b>${an ? '🟢 Motor läuft' : '🔑 Motor starten'}</b><button class="wmzu" id="wmzu" aria-label="Schließen">✕</button></div>` + (an
      ? (m.choke ? z(false, 'Choke reinschieben', 'choke') : '') + `<div class="wms ok"><i>💧</i><span>Kontrollstrahl kommt (Kühlung)</span></div>` + (e ? `<div class="wms ok"><i>✓</i><span>Öl- und Ladekontrolle aus</span></div>` : '') + `<button class="btn ghost wide" id="wmaus">⛔ Quickstopp ziehen (Not-Aus)</button>`
      : z(m.quick, 'Quickstopp-Leine einklinken', 'quick') + z(m.tank, 'Tank: Belüftungsschraube auf', 'tank') + z(m.pump >= 3, `Pumpball drücken <small>${m.pump >= 3 ? '(hart)' : m.pump + ' von 3'}</small>`, 'pump')
        + z(m.choke, m.kalt ? 'Choke ziehen (Motor kalt)' : 'Choke (Motor warm: nicht nötig)', 'choke') + `<div class="wms" id="wmneu"><i></i><span>Hebel auf Neutral</span></div>`
        + (e ? `<button class="btn lamp wide wmst" id="wmstart">🔑 Starttaste gedrückt halten</button>` : `<div class="wmzug" id="wmstart"><b>⬇</b><span>Startleine: Griff antippen und kräftig nach unten ziehen</span></div>`));
    neutralZeigen();
    $('#wmzu').onclick = () => { mpEl.style.display = 'none'; try { AUD.click(); } catch (x) {} };
    mpEl.querySelectorAll('button.wms').forEach(bt => bt.onclick = () => { const sch = bt.dataset.s;
      if (sch === 'quick') { m.quick = !m.quick; mTon('klick'); } else if (sch === 'tank') { m.tank = !m.tank; mTon('klick'); } else if (sch === 'pump') { m.pump = Math.min(3, m.pump + 1); mTon('pump'); }
      else if (sch === 'choke') { m.choke = !m.choke; mTon('klick'); if (!m.choke) { m.chokeT = 0; m.warnT = 0; } } motorPanel(); });
    const aus = $('#wmaus'); if (aus) aus.onclick = () => { m.quick = false; motorAus('Quickstopp gezogen: Die Zündung ist unterbrochen, der Motor steht.'); };
    const st = $('#wmstart'); if (!st) return; let ab = null;
    st.addEventListener('pointerdown', ev => { ev.preventDefault(); st.setPointerCapture(ev.pointerId); ab = {y: ev.clientY, t: performance.now()}; if (e) mTon('anlasser'); st.classList.add('zieht'); });
    const los = ev => { if (!ab) return; const dy = ev.clientY - ab.y, dt2 = (performance.now() - ab.t) / 1000; ab = null; st.classList.remove('zieht');
      if (e) return startVersuch(Math.min(1, dt2 / .8));
      if (dy < 35) return tipp('Griff festhalten und mit Schwung nach unten ziehen.'); mTon('zug'); startVersuch(Math.min(1, dy / 110) * (dt2 < .7 ? 1 : .5)); };
    st.addEventListener('pointerup', los); st.addEventListener('pointercancel', () => { ab = null; st.classList.remove('zieht'); }); }
  function neutralZeigen() { const n = $('#wmneu'); if (!n) return; const ok = Math.abs(P.gZiel) < .02; n.classList.toggle('ok', ok); n.querySelector('i').textContent = ok ? '✓' : ''; }
  $('#wtmot').onclick = () => { try { AUD.click(); } catch (e) {} mpEl.style.display = mpEl.style.display === 'none' ? '' : 'none'; motorPanel(); };
  /* Am Boot sichtbar: Rad am Steuerstand oder Pinne am Außenborder */
  function steuerTeile() { const U = P.boot && P.boot.userData; if (!U) return; const m = steuerArt(); if (U.rad) U.rad.parent.visible = m === 'rad'; if (U.pinne) U.pinne.visible = m === 'pinne'; }
  const taste = e => { if (e.type !== 'keydown') return; const [gy, gx] = pad.get(); const k = e.key;
    if (k === 'ArrowUp' || k === 'w') pad.setze(cl(gy + .1, -1, 1), gx); else if (k === 'ArrowDown' || k === 's') pad.setze(cl(gy - .1, -1, 1), gx);
    else if (k === 'ArrowLeft' || k === 'a') pad.setze(gy, cl(gx - .15, -1, 1)); else if (k === 'ArrowRight' || k === 'd') pad.setze(gy, cl(gx + .15, -1, 1)); else return; e.preventDefault(); };
  window.addEventListener('keydown', taste);
  /* Kamera mit dem Finger drehen und zoomen */
  const cv = r.domElement, ptr = new Map(); let pinch = 0;
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); K.last = performance.now(); });
  cv.addEventListener('pointermove', e => { const q = ptr.get(e.pointerId); if (!q) return; const dx = e.clientX - q[0], dy = e.clientY - q[1]; q[0] = e.clientX; q[1] = e.clientY;
    if (ptr.size === 2) { const [a, b] = [...ptr.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) K.dist = cl(K.dist * pinch / d, 7, 90); pinch = d; return; }
    K.yaw -= dx * .008; K.pitch = cl(K.pitch + dy * .006, .04, 1.5); K.last = performance.now(); });
  const loslass = e => { ptr.delete(e.pointerId); pinch = 0; }; cv.addEventListener('pointerup', loslass); cv.addEventListener('pointercancel', loslass);
  cv.addEventListener('wheel', e => { e.preventDefault(); K.dist = cl(K.dist * (1 + Math.sign(e.deltaY) * .1), 7, 90); }, {passive: false});
  $('#wtkam').onclick = () => { const ids = Object.keys(KAMERAS), n = ids[(ids.indexOf(K.mode) + 1) % ids.length]; Object.assign(K, KAMERAS[n], {mode: n}); C.kam = n; speichern(); $('#wtkam').textContent = '🎥 ' + KAMERAS[n].n; };
  $('#wttausch').onclick = () => { C.boot = (C.boot + 1) % BOOTE.length; speichern(); W.setzeBoot(BOOTE[C.boot]()); sag('hinnerk', 'Anderes Boot, gleiche Welt. So tauschen wir später unser echtes Schiff ein.'); };
  $('#wthorn').onclick = () => { hornZahl++; try { AUD.horn('▬'); } catch (e) {} if (['nebel', 'dicht', 'extrem'].includes(C.sicht) && !sagte.horn) { sagte.horn = 1; sag('smilla', 'Ein langer Ton heißt: Maschinenfahrzeug, das Fahrt durchs Wasser macht. Im Nebel mindestens alle zwei Minuten.'); } };
  /* Wetter-Tafel: alles einzeln wählbar und kombinierbar */
  const panel = $('#wtpanel');
  function tafel() {
    const chips = (gruppe, liste, aktiv) => Object.keys(liste).map(id => `<button class="wtc" data-g="${gruppe}" data-v="${id}" aria-pressed="${aktiv === id}">${esc(liste[id].n || liste[id])}</button>`).join('');
    panel.innerHTML = `<div class="wtph"><b>Wetter und Ort</b><button class="btn small ghost" id="wtzu">✕</button></div>
      <h4>Wind</h4>${chips('wind', WIND, C.wind)}<h4>Wind aus</h4>${RICHTUNG.map((n, i) => `<button class="wtc" data-g="von" data-v="${i}" aria-pressed="${C.von === i}">${n}</button>`).join('')}
      <h4>Wellen (beliebig kombinierbar)</h4>${Object.keys(WELLEN).map(id => `<button class="wtc" data-g="wellen" data-v="${id}" aria-pressed="${!!C.wellen[id]}" title="${esc(WELLEN[id].info)}">${esc(WELLEN[id].n)}</button>`).join('')}
      <p class="small muted" style="margin:2px 0 6px">${Object.keys(WELLEN).map(id => `<b>${esc(WELLEN[id].n)}:</b> ${esc(WELLEN[id].info)}`).join(' · ')}</p>
      <h4>Sicht</h4>${chips('sicht', SICHT, C.sicht)}<h4>Regen</h4>${chips('regen', REGEN, C.regen)}<h4>Tageszeit</h4>${chips('zeit', ZEIT, C.zeit)}
      <h4>Ort</h4>${chips('ort', ORTE, '')}<h4>Qualität${C.quali === 'auto' && QA ? ' (jetzt: ' + QUALI[QA].n + ')' : ''}</h4>${chips('quali', QUALI, C.quali)}<h4>Stil</h4>${Object.keys(STILE).map(id => `<button class="wtc" data-g="stil" data-v="${id}" aria-pressed="${C.stil === id}">${esc(STILE[id].name)}</button>`).join('')}`;
    $('#wtzu').onclick = () => { panel.style.display = 'none'; };
    panel.querySelectorAll('.wtc').forEach(b => b.onclick = () => { const g = b.dataset.g, v = b.dataset.v; try { AUD.click(); } catch (e) {}
      if (g === 'wellen') C.wellen[v] = !C.wellen[v]; else if (g === 'von') C.von = +v; else if (g === 'ort') { setzeOrt(v); panel.style.display = 'none'; return; }
      else if (g === 'quali') { C.quali = v; speichern(); setzeQuali(v === 'auto' ? 'hoch' : v); qualiPruef = 3; tafel(); return; }
      else if (g === 'stil') { if (C.stil !== v) { C.stil = v; speichern(); ende(); W.seite(); } return; } else C[g] = v;
      speichern(); setzeWetter(); tafel(); kommentarWetter(g, v); });
  }
  $('#wtwet').onclick = () => { if (panel.style.display === 'none') { tafel(); panel.style.display = ''; } else panel.style.display = 'none'; };
  /* Crew spricht über das, was man sieht */
  const bub = $('#wtbub'); let bubT = 0; const sagte = {};
  let sprecher = null;
  function sag(wer, t, ms, still) { const n = ({hinnerk: 'Käpt\'n', smilla: 'Smilla', klabauter: 'Klabauter'})[wer]; bub.innerHTML = `<b>${n}:</b> ${esc(t)}`; bub.style.display = ''; clearTimeout(bubT);
    sprecher = wer; document.querySelectorAll('#wtgs .wg, #wtszene .wsf').forEach(x => x.classList.toggle('spricht', x.dataset.c === wer));
    bubT = setTimeout(() => { bub.style.display = 'none'; sprecher = null; document.querySelectorAll('#wtgs .wg').forEach(x => x.classList.remove('spricht')); }, ms || 7000);
    if (!still) try { if (typeof VOX !== 'undefined') VOX.say(wer, t, 'local'); } catch (e) {} }
  function kommentarWetter(g, v) {
    if (g === 'wind' && v === 'sturm') sag('hinnerk', 'Sturm. Bei so einem Wetter bleibt man im Hafen. Rettungswesten an!');
    else if (g === 'wind' && v === 'flaute') sag('smilla', 'Flaute. Kein Wind, keine Welle. Das Wasser ist wie ein Spiegel.');
    else if (g === 'sicht' && ['nebel', 'dicht', 'extrem'].includes(v)) sag('smilla', 'Nebel: Fahrt runter, Ausguck, Lichter an und Schallsignal geben. Tipp auf das Horn.');
    else if (g === 'wellen' && v === 'kabbel' && C.wellen.kabbel) sag('hinnerk', 'Kabbelwasser. Wenn der Strom gegen den Wind läuft, wird die See kurz und steil.');
    else if (g === 'wellen' && v === 'duenung' && C.wellen.duenung) sag('smilla', 'Dünung: lange Wellen von einem Sturm weit weg. Hier kann trotzdem Flaute sein.');
  }
  let tor = {};
  function kommentare(t) {
    if (P.z > 80 && P.z < 168 && Math.abs(P.x) < 72 && (P.u || 0) > 3.2 && t - (sagte.hafenT || -99) > 25) { sagte.hafenT = t; sag('hinnerk', 'Langsam im Hafen! Unser Schwell schaukelt die Lieger am Steg.', 4500); }
    if (P.gleit > .8 && !sagte.gleit) { sagte.gleit = 1; sag('smilla', 'Jetzt gleitet sie! Der Bug kommt runter, das Boot hebt sich aus dem Wasser und wird schneller.', 5000); }
    if (P.buckel > .8 && (P.u || 0) < 5.2 && !sagte.buckel && t > 20) { sagte.buckel = 1; sag('hinnerk', 'Bug hoch, viel Welle, wenig Fahrt: Das ist der Buckel. Mehr Gas, dann kommt sie ins Gleiten.', 5500); }
    for (const z of [40, -15, -70]) { const d = P.z - z, innen = Math.abs(P.x) < 22, k = 't' + z, nah = Math.abs(d) < 25 && Math.abs(P.x) < 45;
      if (!nah) { tor[k] = 0; continue; } if (!tor[k]) tor[k] = {seite: Math.sign(d), drin: innen};
      else if (Math.sign(d) !== tor[k].seite && !tor[k].fertig) { tor[k].fertig = 1; const ein = Math.cos(P.h) < 0, mitte = Math.abs(P.x) < 15;
        if (!mitte) sag('smilla', 'Daneben! Bleib zwischen den Tonnen. Daneben kann es flach sein.');
        else if (ein) sag('hinnerk', 'Sauber. Von See kommend: Rot an Backbord, Grün an Steuerbord.');
        else sag('smilla', 'Gut so. Beim Auslaufen ist es andersherum: Rot liegt jetzt an Steuerbord.'); } }
    const dh = Math.hypot(P.x - 62, P.z + 200); if (dh < 40 && !SH.weg && !sagte.seehund) { sagte.seehund = 1; sag('klabauter', 'Seehund! Seehund! Abstand halten! Krrah!'); }
    const de = Math.hypot(P.x - enten[0].x, P.z - enten[0].z); if (de < 14 && !sagte.enten) { sagte.enten = 1; sag('klabauter', 'Entchen! Entchen! Langsam, sonst schaukeln die!'); }
    if (P.z < 60 && P.z > 50 && Math.abs(P.x) < 30 && !sagte.einfahrt && Math.cos(P.h) < 0) { sagte.einfahrt = 1; sag('smilla', 'Hafeneinfahrt: Langsam fahren und auf auslaufende Schiffe achten.'); }
  }
  /* ================= Folgen: Schnittstelle für welt-folge.js ================= */
  let ZIEL = null, ROUTE = null, FOLGE = null, hornZahl = 0, stoesse = 0, pausiert = false, ANDOCK = null, modus = 'selbst';
  const zielObj = new T.Group(); { const ring = new T.Mesh(new T.TorusGeometry(1, .06, 8, 48), new T.MeshBasicMaterial({color: '#f0b53e', transparent: true, opacity: .85, depthWrite: false})); ring.rotation.x = Math.PI / 2; zielObj.add(ring);
    const saeule = new T.Mesh(new T.CylinderGeometry(.25, .25, 26, 8, 1, true), new T.MeshBasicMaterial({color: '#ffd27a', transparent: true, opacity: .35, depthWrite: false, blending: T.AdditiveBlending})); saeule.position.y = 13; zielObj.add(saeule);
    const rahmen = new T.Group(), rm = new T.MeshBasicMaterial({color: '#f0b53e', transparent: true, opacity: .9, depthWrite: false}); for (const [w, d, x, z] of [[3.4, .14, 0, 4.6], [3.4, .14, 0, -4.6], [.14, 9.2, 1.7, 0], [.14, 9.2, -1.7, 0]]) { const m = new T.Mesh(new T.BoxGeometry(w, .08, d), rm); m.position.set(x, 0, z); rahmen.add(m); } zielObj.add(rahmen); zielObj.visible = false; scene.add(zielObj); }
  const warteMs = ms => new Promise(r => setTimeout(r, ms / (W.tempo || 1)));
  const frageVon = n => (typeof QN !== 'undefined' && QN[n] && QN[n].a && QN[n].a.length === 4) ? QN[n] : (typeof DATA !== 'undefined' ? DATA.find(x => x.n === n) : null);
  const qEl = $('#wtq'), apEl = $('#wtap'), padEl = $('#wtpad');
  const tafelZeigen = html => { qEl.innerHTML = html; qEl.style.display = ''; padEl.style.visibility = 'hidden'; return qEl; };
  const tafelZu = () => { qEl.style.display = 'none'; qEl.innerHTML = ''; padEl.style.visibility = ''; };
  /* Sprechen und warten (Sprechblase antippen = weiter) */
  function sprich(wer, t) { return new Promise(res => { if (!laufend) return res(); sag(wer, t, 60000, true); let fertig = false;
    const done = () => { if (fertig) return; fertig = true; bub.onclick = null; clearTimeout(bubT); bubT = setTimeout(() => { bub.style.display = 'none'; sprecher = null; document.querySelectorAll('#wtgs .wg').forEach(x => x.classList.remove('spricht')); }, 1800); res(); };
    const v = typeof VOX !== 'undefined' ? Promise.resolve(VOX.say(wer, t, 'local')).catch(() => {}) : Promise.resolve();
    Promise.all([v, warteMs(cl(t.length * 52, 1800, 9000))]).then(() => setTimeout(done, 450)); bub.onclick = () => { try { VOX.stop('weiter'); } catch (e) {} done(); }; }); }
  /* Amtliche Frage: antworten zählt; im Hörmodus vorlesen, sechs Sekunden, Lösung */
  function frage(n, wer = 'smilla') { const q = frageVon(n); if (!q) return Promise.resolve(null);
    const order = [0, 1, 2, 3].sort(() => Math.random() - .5);
    const el = tafelZeigen(`<p class="wqf"><span class="small muted">Prüfungsfrage ${q.n}</span><br><b>${esc(q.q)}</b></p>${q.img ? `<div class="wqimg">${q.img.map(u => `<img src="${esc(u)}" alt="">`).join('')}</div>` : ''}${order.map((k, j) => `<button class="ans" data-k="${k}"><b class="abc">${'ABCD'[j]}</b> ${esc(q.a[k])}</button>`).join('')}<div class="small muted" id="wqinfo"></div>`);
    const zeigeLoesung = k => el.querySelectorAll('.ans').forEach(b => { b.disabled = true; const kk = +b.dataset.k; if (kk === 0) b.classList.add('ok'); else if (kk === k) b.classList.add('no'); });
    if (modus === 'auto') return (async () => { try { await VOX.say(wer, (window.SZENE ? SZENE.text(q, order) : q.q), 'local'); } catch (e) {} if (!laufend) return null; const i = $('#wqinfo'); if (i) i.textContent = '🤔 Denkpause … 6 s'; try { AUD.ticks && AUD.ticks(6, .3); } catch (e) {}
      await warteMs(6000); zeigeLoesung(-1); await sprich('hinnerk', 'Richtig ist: ' + q.a[0]); tafelZu(); return null; })();
    return new Promise(res => { let ctl = null, fertig = false;
      const antwort = k => { if (fertig) return; fertig = true; if (ctl) ctl.stop(); try { VOX.stop('Antwort'); } catch (e) {} const ok = k === 0; try { AUD.sfx(ok ? 'richtig' : 'falsch', {vol: .55}); } catch (e) {} zeigeLoesung(k);
        if (typeof record === 'function' && window.S && S.course !== 'sks') { try { record(q.n, ok); } catch (e) {} } if (FOLGE) FOLGE.fragen.push(ok);
        setTimeout(async () => { if (!ok) await sprich('smilla', 'Nicht ganz. Richtig ist: ' + q.a[0]); tafelZu(); res(ok); }, ok ? 1100 : 900); };
      el.querySelectorAll('.ans').forEach(b => b.onclick = () => antwort(+b.dataset.k));
      try { ctl = window.SZENE ? SZENE.frage(q, order, {wer, onPick: antwort}) : null; } catch (e) {} }); }
  /* Entscheidung mit Empfehlung der Crew; eine falsche Wahl wird erklärt */
  function wahl(d, wer = 'smilla') { return new Promise(async res => {
    const el = tafelZeigen(`<p class="wqf"><b>${esc(d.t)}</b></p>${d.opts.map((o, i) => `<button class="ans${o.empfohlen ? ' emp' : ''}" data-i="${i}">${o.empfohlen ? '<span class="wemp">★ Empfehlung</span> ' : ''}${esc(o.t)}</button>`).join('')}`);
    if (modus === 'auto') { await sprich(wer, d.t); let i = d.opts.findIndex(o => o.empfohlen); if (i < 0) i = Math.max(0, d.opts.findIndex(o => o.ok)); el.querySelector(`[data-i="${i}"]`).classList.add('ok'); await sprich('hinnerk', d.opts[i].t + '.'); tafelZu(); return res(i); }
    sprich(wer, d.t);
    el.querySelectorAll('.ans').forEach(b => b.onclick = async () => { const i = +b.dataset.i, o = d.opts[i]; try { VOX.stop('Wahl'); AUD.click(); } catch (e) {}
      el.querySelectorAll('.ans').forEach(x => x.disabled = true);
      if (o.ok === false) { b.classList.add('no'); try { AUD.sfx('falsch', {vol: .5}); } catch (e) {} if (o.info) await sprich('smilla', o.info); const r = d.opts.findIndex(x => x.ok); if (r >= 0) { el.querySelector(`[data-i="${r}"]`).classList.add('ok'); await sprich('hinnerk', 'Richtig ist: ' + d.opts[r].t + '.'); } if (FOLGE) FOLGE.wahlen.push(false); }
      else { b.classList.add('ok'); if (o.ok) { try { AUD.sfx('richtig', {vol: .5}); } catch (e) {} if (FOLGE) FOLGE.wahlen.push(true); } if (o.info) await sprich('hinnerk', o.info); else await warteMs(700); }
      tafelZu(); res(i); }); }); }
  /* Mitmachen mit dem Übungsset (E17) */
  function modell(t) { return new Promise(async res => { tafelZeigen(`<p class="wqf">🪢 <b>Mit deinem Modell</b></p><p>${esc(t)}</p><button class="btn lamp wide" id="wqok">✓ Gemacht</button><button class="btn ghost wide" id="wqohne" style="margin-top:6px">Weiter ohne Modell</button>`);
    if (modus === 'auto') { await sprich('hinnerk', t); await warteMs(2500); tafelZu(); return res(true); }
    sprich('hinnerk', t); $('#wqok').onclick = () => { try { VOX.stop('m'); AUD.click(); } catch (e) {} tafelZu(); res(true); }; $('#wqohne').onclick = () => { try { VOX.stop('m'); } catch (e) {} tafelZu(); res(false); }; }); }
  /* Knoten: das 3D-Bild wartet, solange das Knotenbrett offen ist */
  async function knoten(id) { const kd = await fetch('data/knoten.json?v=' + window.__ver).then(r => r.json()).catch(() => null), k = kd && (kd.knoten || kd).find && (kd.knoten || kd).find(x => x.id === id); if (!k) return;
    if (modus === 'auto') { await sprich('hinnerk', 'Der ' + k.name + '. ' + (k.spruch ? 'Zum Mitsagen: ' + k.spruch : '')); for (const x of k.schritte || []) { if (!laufend) return; await sprich('hinnerk', x); } return; }
    await sprich('hinnerk', 'Ich zeig dir den ' + k.name + '.'); try { await loadKnoten(); } catch (e) { return; }
    return new Promise(res => { const wrap = $('#wtwrap'); pausiert = true; try { AUD.loop('motorLauf', 0); } catch (e) {} wrap.remove(); KNOTEN.zeige(id);
      const zurueck = () => { try { VOX.stop('Knoten'); } catch (e) {} gameShell('3D-Welt (Test)', ''); app.appendChild(wrap); const gb = $('#gback'); if (gb) gb.onclick = zurueckKnopf; pausiert = false; gr(); res(); };
      setTimeout(() => { const gb = $('#gback'); if (gb) gb.onclick = zurueck; const ueb = $('#kueb'); if (ueb) ueb.insertAdjacentHTML('afterend', '<button class="btn lamp" id="kgesch">⛵ Zurück aufs Boot</button>'); const b = $('#kgesch'); if (b) b.onclick = () => { try { AUD.click(); } catch (e) {} zurueck(); }; }, 80); }); }
  /* ---------- Autopilot: Weg planen um alle Hindernisse, dann sauber abfahren ---------- */
  /* Hindernisse: feste Kapseln und Kreise, dazu die Tonnen; Abstand = halbe Bootsbreite + Sicherheit */
  const ABSTAND = 2.4;
  const hindernisAbstand = (x, z) => { let m = 1e9;
    for (const s2 of WL.stat) { let qx = s2.ax, qz = s2.az; if (s2.k) { const dx = s2.bx - s2.ax, dz = s2.bz - s2.az, u = cl(((x - s2.ax) * dx + (z - s2.az) * dz) / (dx * dx + dz * dz), 0, 1); qx = s2.ax + dx * u; qz = s2.az + dz * u; } m = Math.min(m, Math.hypot(x - qx, z - qz) - s2.r); }
    for (const b of WL.bojen) m = Math.min(m, Math.hypot(x - b.hx, z - b.hz) - b.r - 1); return m; };
  /* Strecke frei? Am Anfang und Ende darf es enger sein (Ablegen und Anlegen) */
  function frei(ax, az, bx, bz, ignA = 0, ignB = 0) { const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / 2));
    for (let i = 0; i <= n; i++) { const d = L * i / n; if (d < ignA || L - d < ignB) continue; if (hindernisAbstand(ax + (bx - ax) * i / n, az + (bz - az) * i / n) < ABSTAND) return false; } return true; }
  /* Wegnetz: Hafenbecken, Einfahrt, Fahrwasser, offene See */
  const NETZ = []; { const add = (x, z) => { if (hindernisAbstand(x, z) >= ABSTAND + .5) NETZ.push([x, z]); };
    for (let x = -66; x <= 66; x += 11) for (let z = 84; z <= 165; z += 9) add(x, z);
    for (const z of [72, 62, 52, 40, 25, 10, -5, -20, -35, -50, -65, -80, -95, -110, -145]) add(0, z);
    for (let x = -200; x <= 200; x += 40) for (let z = -360; z <= 30; z += 40) add(x, z); }
  function planen(a, b, ignA, ignB) {
    if (frei(a[0], a[1], b[0], b[1], ignA, ignB)) return [a, b];
    const pts = [a, b].concat(NETZ), n = pts.length, dist = new Array(n).fill(Infinity), vor = new Array(n).fill(-1), fertig = new Array(n).fill(false); dist[0] = 0;
    const kante = (i, j) => { const L = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (L > 75 && i > 1 && j > 1) return -1; return frei(pts[i][0], pts[i][1], pts[j][0], pts[j][1], i === 0 ? ignA : 0, j === 1 ? ignB : 0) ? L : -1; };
    for (;;) { let u = -1; for (let i = 0; i < n; i++) if (!fertig[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i; if (u < 0 || u === 1) break; fertig[u] = true;
      for (let v = 0; v < n; v++) { if (fertig[v] || v === u) continue; const dd = Math.hypot(pts[u][0] - pts[v][0], pts[u][1] - pts[v][1]); if (dist[u] + dd >= dist[v]) continue; const L = kante(u, v); if (L >= 0) { dist[v] = dist[u] + L; vor[v] = u; } } }
    if (vor[1] < 0) return [a, b]; const weg = []; for (let k = 1; k >= 0; k = vor[k]) { weg.unshift(pts[k]); if (k === 0) break; }
    /* Abkürzen, wo die Sicht frei ist */
    const kurz = [weg[0]]; let i = 0; while (i < weg.length - 1) { let j = weg.length - 1; while (j > i + 1 && !frei(weg[i][0], weg[i][1], weg[j][0], weg[j][1], i === 0 ? ignA : 0, j === weg.length - 1 ? ignB : 0)) j--; kurz.push(weg[j]); i = j; } return kurz; }
  /* Ecken runden (Chaikin), Anfang und Ende bleiben */
  function glatt(w) { for (let r = 0; r < 2; r++) { if (w.length < 3) return w; const n = [w[0]]; for (let i = 0; i < w.length - 1; i++) { const [ax, az] = w[i], [bx, bz] = w[i + 1]; if (i > 0) n.push([ax * .75 + bx * .25, az * .75 + bz * .25]); if (i < w.length - 2) n.push([ax * .25 + bx * .75, az * .25 + bz * .75]); } n.push(w[w.length - 1]); w = n; } return w; }
  /* Liegt ein Ziel auf einer Tonne oder an Land, hält der Autopilot davor an */
  function vorHindernis(a, p) { let x = p[0], z = p[1]; const L = Math.hypot(x - a[0], z - a[1]); if (L < .1) return [x, z];
    for (let d = 0; d < L && hindernisAbstand(x, z) < ABSTAND + 1.5; d += 1) { x = p[0] + (a[0] - p[0]) * d / L; z = p[1] + (a[1] - p[1]) * d / L; } return [x, z]; }
  let FAHRT = null, angebotWeg = () => {};
  /* Autopilot starten: pts = Wegpunkte, der letzte darf einen Kurs haben [x, z, h] = Anlegen; o.anfahrt = Punkt davor */
  function starteFahrt(pts, o, res) {
    if (P.motor !== 'an') motorAn(); P.fest = null; let weg = [[P.x, P.z]], endH = null;
    pts.forEach((p, k) => { const letzt = k === pts.length - 1, a = weg[weg.length - 1];
      if (letzt && p[2] != null) { endH = p[2]; weg.push([p[0], p[1]]); return; }
      const t2 = planen(a, vorHindernis(a, p), k === 0 ? 5 : 0, 0); weg = weg.concat(t2.slice(1)); });
    let anleg = null; if (endH != null) { anleg = weg.pop(); }
    weg = glatt(weg); if (anleg) weg.push(anleg);
    const cum = [0]; for (let i = 1; i < weg.length; i++) cum.push(cum[i - 1] + Math.hypot(weg[i][0] - weg[i - 1][0], weg[i][1] - weg[i - 1][1]));
    FAHRT = {weg, cum, L: cum[cum.length - 1], s: 0, v: Math.max(0, P.u || 0), gas: o.gas || .5, raffer: o.raffer || 1, endH, res, pts, o};
    ROUTE = weg; apEl.style.display = ''; apEl.textContent = o.raffer > 1 ? '⏩ Zeitraffer' : '🤖 ' + (o.wer || 'Hinnerk') + ' steuert · Hebel antippen = selbst';
    padEl.classList.add('auto'); padEl.classList.remove('aus');
  }
  function auto(pts, o = {}) { return new Promise(res => starteFahrt(pts, o, res)); }
  const punktBei = s2 => { const F = FAHRT, c = F.cum; let i = 1; while (i < c.length - 1 && c[i] < s2) i++; const a = F.weg[i - 1], b = F.weg[i], u = c[i] > c[i - 1] ? cl((s2 - c[i - 1]) / (c[i] - c[i - 1]), 0, 1) : 1; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; };
  /* Fahren entlang des Weges: im Hafen langsam, vor dem Ende sanft abbremsen, Kurs folgt der Strecke */
  function fahrtTick(dt) { const F = FAHRT, rest = F.L - F.s, imHafen = P.z > 60 && Math.abs(P.x) < 90;
    const vmax = imHafen ? 1.5 : 1.2 + F.gas * 5, soll = Math.min(vmax, Math.sqrt(2 * .2 * Math.max(0, rest)) + (F.endH != null ? 0 : .3));
    F.v += cl(soll - F.v, -.6 * dt, .4 * dt);
    const [ax, az] = punktBei(F.s), [bx, bz] = punktBei(Math.min(F.L, F.s + 3)); let th = Math.hypot(bx - ax, bz - az) > .05 ? Math.atan2(bx - ax, -(bz - az)) : P.h;
    if (F.endH != null && rest < 9) { const zh = Math.abs(wdiff(F.endH, th)) < Math.PI / 2 ? F.endH : F.endH + Math.PI; th = th + wdiff(zh, th) * (1 - rest / 9); }
    const diff = wdiff(th, P.h); P.r = cl(diff * 1.6, -.4, .4); P.h += P.r * dt;
    const vEff = F.v * Math.max(.3, Math.cos(Math.min(1.25, Math.abs(diff)))); F.s = Math.min(F.L, F.s + vEff * dt);
    const [nx, nz] = punktBei(F.s); P.vx = (nx - P.x) / dt; P.vz = (nz - P.z) / dt; P.x = nx; P.z = nz; P.u = vEff;
    P.g = P.gZiel = cl(vEff / 4 + (soll < F.v - .05 ? -.2 : 0), -.3, 1); P.d = P.dZiel = cl(P.r / .4, -1, 1);
    if (F.s >= F.L - .05 && (F.endH == null || F.v < .2)) fahrtEnde(); }
  function fahrtEnde() { const F = FAHRT; FAHRT = null; ROUTE = null; apEl.style.display = 'none'; padEl.classList.remove('auto'); const v = F.endH == null ? Math.min(F.v, .8) : 0; P.vx = Math.sin(P.h) * v; P.vz = -Math.cos(P.h) * v; P.u = v; P.r = 0; P.g = P.gZiel = P.dZiel = P.d = 0; pad.setze(0, 0);
    if (F.endH != null) { const zh = Math.abs(wdiff(F.endH, P.h)) < Math.PI / 2 ? F.endH : F.endH + Math.PI; P.h = zh; P.fest = {x: P.x, z: P.z, h: zh}; } F.res(); }
  /* Mitten im Autopiloten selbst übernehmen: Hebel antippen. Hinnerk kann jederzeit zurück an das Ruder. */
  function uebernehmen() { const F = FAHRT; if (!F) return; FAHRT = null; ROUTE = null; padEl.classList.remove('auto'); apEl.textContent = '✋ Du steuerst';
    const l = F.pts[F.pts.length - 1], zz = {x: l[0], z: l[1], h: l[2], r: l[2] != null ? 3.5 : 12, anfahrt: F.o.anfahrt}, ohneZiel = !ZIEL; if (ohneZiel) ziel(zz);
    let per = null; angebot('🤖 Hinnerk übernimmt').then(k => { if (k) per = 'knopf'; });
    warte(() => per || (l[2] != null ? angelegt(zz) : Math.hypot(P.x - l[0], P.z - l[1]) < zz.r), 900).then(async () => { angebotWeg(); apEl.style.display = 'none';
      if (per === 'knopf') { if (ohneZiel) ziel(null); const rest = l[2] != null && F.o.anfahrt ? [F.o.anfahrt, l] : [l]; starteFahrt(rest, F.o, F.res); return; }
      if (l[2] != null) await fest(zz); if (ohneZiel) ziel(null); F.res(); }); }
  /* Knopf auf der Bühne, z. B. „Hinnerk übernimmt“ */
  function angebot(t) { const b = $('#wtangebot'); b.textContent = t; b.style.display = ''; return new Promise(res => { b.onclick = () => { try { AUD.click(); } catch (e) {} b.style.display = 'none'; angebotWeg = () => {}; res(true); }; angebotWeg = () => { b.style.display = 'none'; angebotWeg = () => {}; res(false); }; }); }
  /* Szenenwechsel: Gespräch in der Kajüte (2D) über der 3D-Welt, oder zurück in die Welt */
  let verdeckt = false;
  function szene(n) { const el = $('#wtszene'); if (n === 'welt') { el.style.display = 'none'; verdeckt = false; return; }
    el.innerHTML = `<div class="wsbull"></div><div class="wslampe"></div><div class="wstisch"></div><div class="wsfig">${['hinnerk', 'smilla', 'klabauter'].map(c => `<div class="wsf" data-c="${c}">${typeof charSVG === 'function' ? charSVG(c) : ''}</div>`).join('')}</div>`;
    el.style.display = ''; verdeckt = true; }
  /* Warten, bis etwas eintritt (jedes Bild geprüft), höchstens max Sekunden */
  const WARTE = [];
  function warte(fn, max) { return new Promise(res => WARTE.push({fn, bis: max ? uhr + max : Infinity, res})); }
  function warteTick() { for (let i = WARTE.length - 1; i >= 0; i--) { const w = WARTE[i]; let ok = false; try { ok = w.fn(); } catch (e) {} if (ok || uhr > w.bis) { WARTE.splice(i, 1); w.res(!!ok); } } }
  function ziel(d) { ZIEL = d; zielObj.visible = !!d; if (d) { zielObj.position.set(d.x, 0, d.z); const lp = d.h != null; zielObj.children[0].visible = !lp; zielObj.children[2].visible = lp; zielObj.children[0].scale.setScalar(d.r || 5); zielObj.children[2].rotation.y = Math.PI - (d.h || 0); } }
  /* Angelegt: im Liegeplatz-Rechteck (längs 7 m, quer 1,8 m um den Platz), langsam, Kurs parallel zum Steg; beide Richtungen zählen */
  let anlegeTipp = 0;
  function angelegt(z) { const fx = Math.sin(z.h || 0), fz = -Math.cos(z.h || 0), dx = P.x - z.x, dz = P.z - z.z, laengs = dx * fx + dz * fz, quer = dx * Math.cos(z.h || 0) + dz * Math.sin(z.h || 0), v = Math.hypot(P.vx, P.vz);
    const ok = Math.abs(laengs) < (z.lang || 7) && Math.abs(quer) < (z.quer || 1.9) && v < .6 && Math.abs(Math.sin(P.h - (z.h || 0))) < .55;
    const d = Math.hypot(dx, dz); if (!ok && d < 18 && uhr - anlegeTipp > 7 && FOLGE) { anlegeTipp = uhr; if (v > 1.1) sag('hinnerk', 'Zu schnell! Gas raus, kurz zurück zum Aufstoppen.', 4000); else if (Math.abs(quer) >= (z.quer || 1.9) && Math.abs(laengs) < (z.lang || 7)) sag('smilla', 'Noch näher an den Steg, ganz langsam.', 4000); }
    return ok; }
  /* Anlegen geschafft: die Crew holt das Boot sauber an den Steg und macht fest */
  function andocken(dt) { const A = ANDOCK; A.t += dt; const k = Math.min(1, dt * 1.6), hz = Math.abs(wdiff(P.h, A.h)) < Math.PI / 2 ? A.h : A.h + Math.PI;
    P.x += (A.x - P.x) * k; P.z += (A.z - P.z) * k; P.h += wdiff(hz, P.h) * k; P.vx *= .85; P.vz *= .85; P.r *= .8; P.gZiel = 0; P.dZiel = 0;
    if (A.t > 1.8) { ANDOCK = null; P.fest = {x: A.x, z: A.z, h: hz}; pad.setze(0, 0); A.res && A.res(); } }
  function wetter(t) { Object.assign(C, t); if (t.wellen) C.wellen = Object.assign({}, C.wellen, t.wellen); setzeWetter(); }
  function kamera(n) { if (KAMERAS[n]) { Object.assign(K, KAMERAS[n], {mode: n}); $('#wtkam').textContent = '🎥 ' + KAMERAS[n].n; } }
  function ton(sig) { const rel = wdiff(Math.atan2(SCH.x - P.x, -(SCH.z - P.z)), P.h); try { AUD.horn(sig || '▬', null, Math.sin(rel)); } catch (e) {} }
  const fest = z => new Promise(res => { ANDOCK = {x: z.x, z: z.z, h: z.h || 0, t: 0, res}; });
  W.api = {get fahrt() { return FAHRT; }, get motor() { return P.motor; }, motorAn: () => motorAn(), motorOffen: () => { mpEl.style.display = ''; motorPanel(); }, motorZu: () => { mpEl.style.display = 'none'; }, szene, angebot, angebotWeg: () => angebotWeg(), sprich, frage, wahl, modell, knoten, auto, warte, ziel, wetter, kamera, ton, crewGehe, fest, ort: id => setzeOrt(id), route: p => { ROUTE = p; }, tafel: tafelZeigen, tafelZu, get zielDef() { return ZIEL; }, get uhr() { return uhr; },
    get P() { return P; }, get modus() { return modus; }, get hornZahl() { return hornZahl; }, get stoesse() { return stoesse; }, angelegt, get laeuft() { return laufend; }, get folge() { return FOLGE; }};
  /* Folge starten und beenden; Wetter und Ort danach wie vorher */
  let startet = false;
  async function starteFolge(id, ab = 0) {
    if (FOLGE || startet) return; startet = true; try { await nachladen('szene.js'); await nachladen('welt-folge.js'); } catch (e) { startet = false; toast('Die Folge ließ sich nicht laden.'); return; }
    startet = false; if (!laufend) return; const vorher = JSON.parse(JSON.stringify(C)); FOLGE = {id, fragen: [], wahlen: [], start: uhr, stoesse0: stoesse, vorher};
    $('#wtfolge').textContent = '⏹ Folge beenden'; $('#wtmodus').style.display = ''; $('#wttausch').style.display = 'none';
    const meine = FOLGE; let erg = null; try { erg = await WFOLGE.spiele(id, W.api, ab); } catch (e) { console.error(e); }
    if (FOLGE !== meine) return; /* schon beendet (und vielleicht neu gestartet) */
    folgeEnde(); if (erg === 'nochmal' && laufend) starteFolge(id);
  }
  function folgeEnde() { if (!FOLGE) return; const F = FOLGE; FOLGE = null; FAHRT = null; ANDOCK = null; angebotWeg(); szene('welt'); padEl.classList.remove('auto'); ziel(null); ROUTE = null; WARTE.splice(0).forEach(w => w.res(false)); apEl.style.display = 'none'; padEl.classList.remove('aus');
    Object.assign(C, F.vorher); setzeWetter(); speichern(); if (!laufend) return;
    $('#wtfolge').textContent = '🎬 Testfolge'; $('#wtmodus').style.display = 'none'; $('#wttausch').style.display = ''; for (const w in CREWF) crewPlatz[w] = w === 'klabauter' ? 'dach' : w; crewSetzen(); }
  $('#wtfolge').onclick = () => { try { AUD.click(); } catch (e) {} if (FOLGE) { FOLGE.abbruch = true; if (window.WFOLGE) WFOLGE.stop(); try { VOX.stop('Folge'); } catch (e) {} bub.style.display = 'none'; tafelZu(); folgeEnde(); } else starteFolge('probe'); };
  $('#wtmodus').onclick = () => { modus = modus === 'auto' ? 'selbst' : 'auto'; $('#wtmodus').textContent = modus === 'auto' ? '🎧 Auto' : '✋ Selbst'; try { AUD.click(); } catch (e) {} };
  /* Karte oben rechts: Norden oben; antippen = groß */
  const kc = $('#wtkarte'), kx = kc.getContext('2d'); let kGross = false;
  kc.addEventListener('click', () => { kGross = !kGross; kc.classList.toggle('gross', kGross); const n = kGross ? 640 : 224; kc.width = kc.height = n; karteZeichnen(); });
  function karteZeichnen() { const N0 = kc.width, R = kGross ? 420 : 150, k = N0 / (2 * R), X = x => N0 / 2 + (x - P.x) * k, Y = z => N0 / 2 + (z - P.z) * k, g = kx;
    g.fillStyle = nachtAn ? '#123047' : '#3f8aa0'; g.fillRect(0, 0, N0, N0);
    g.fillStyle = nachtAn ? '#3b4a3b' : '#9fbf7a'; g.fillRect(0, Y(172), N0, N0); g.fillStyle = '#d9c99a'; g.fillRect(0, Y(162), X(-85), Y(178) - Y(162)); g.fillRect(X(85), Y(162), N0, Y(178) - Y(162));
    g.fillStyle = '#a39684'; g.fillRect(X(-85), Y(170), X(85) - X(-85), Y(184) - Y(170));
    g.strokeStyle = '#8d8a82'; g.lineWidth = Math.max(3, 9 * k); g.lineCap = 'round'; for (const m of [[[-85, 171], [-75, 95], [-18, 72]], [[85, 171], [75, 95], [18, 72]]]) { g.beginPath(); m.forEach(([x, z], i) => i ? g.lineTo(X(x), Y(z)) : g.moveTo(X(x), Y(z))); g.stroke(); }
    g.strokeStyle = '#c9935e'; g.lineWidth = Math.max(1.5, 2.2 * k); for (const [x, a, b2] of [[-30, 171, 116], [25, 171, 120]]) { g.beginPath(); g.moveTo(X(x), Y(a)); g.lineTo(X(x), Y(b2)); g.stroke(); }
    for (const b of WL.lieger || []) { g.fillStyle = '#e8e2d4'; g.beginPath(); g.arc(X(b.position.x), Y(b.position.z), Math.max(1.5, 1.4 * k), 0, 7); g.fill(); }
    g.fillStyle = '#e3cf9f'; g.beginPath(); g.arc(X(120), Y(-250), 31 * k, 0, 7); g.fill(); g.fillStyle = '#7fa35a'; g.beginPath(); g.arc(X(120), Y(-250), 23 * k, 0, 7); g.fill();
    g.fillStyle = '#c9b585'; g.beginPath(); g.ellipse(X(60), Y(-200), 15 * k, 8 * k, 0, 0, 7); g.fill();
    const farbeB = {rot: '#e0503c', gruen: '#3fae5a', anst: '#ffffff', nord: '#f2c230'};
    for (const b of WL.bojen) { g.fillStyle = farbeB[b.art] || '#fff'; g.strokeStyle = b.art === 'anst' ? '#e0503c' : b.art === 'nord' ? '#222' : 'rgba(0,0,0,.35)'; g.lineWidth = 1.5; g.beginPath(); g.arc(X(b.x), Y(b.z), Math.max(3, 1.6 * k), 0, 7); g.fill(); g.stroke(); }
    if (ROUTE) { g.strokeStyle = '#ffd27a'; g.lineWidth = 2; g.setLineDash([6, 5]); g.beginPath(); g.moveTo(X(P.x), Y(P.z)); ROUTE.forEach(([x, z], i) => { if (!FAHRT || FAHRT.cum[i] >= FAHRT.s) g.lineTo(X(x), Y(z)); }); g.stroke(); g.setLineDash([]); }
    if (ZIEL) { g.strokeStyle = '#ffd27a'; g.lineWidth = 3; g.beginPath(); g.arc(X(ZIEL.x), Y(ZIEL.z), Math.max(5, (ZIEL.r || 5) * k), 0, 7); g.stroke(); }
    const pfeil = (x, z, h, f, gr) => { g.save(); g.translate(X(x), Y(z)); g.rotate(h); g.fillStyle = f; g.strokeStyle = '#222'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -gr); g.lineTo(gr * .6, gr * .8); g.lineTo(-gr * .6, gr * .8); g.closePath(); g.fill(); g.stroke(); g.restore(); };
    pfeil(SCH.x, SCH.z, SCH.h, '#f5f1e8', Math.max(6, 10 * k)); pfeil(P.x, P.z, P.h, '#f0b53e', Math.max(8, 5 * k) * (N0 / 224));
    const sf = N0 / 224; g.fillStyle = 'rgba(255,255,255,.9)'; g.font = `bold ${12 * sf}px sans-serif`; g.textAlign = 'center'; g.fillText('N', 12 * sf, 16 * sf);
    if (windMs) { g.save(); g.translate(20 * sf, N0 - 22 * sf); g.rotate(windVon + Math.PI); g.strokeStyle = '#fff'; g.lineWidth = 2.5 * sf; g.beginPath(); g.moveTo(0, 10 * sf); g.lineTo(0, -10 * sf); g.moveTo(-5 * sf, -4 * sf); g.lineTo(0, -10 * sf); g.lineTo(5 * sf, -4 * sf); g.stroke(); g.restore(); }
    g.fillStyle = '#fff'; g.font = `bold ${10 * sf}px sans-serif`; g.textAlign = 'right'; g.fillText(WIND[C.wind].bft + ' Bft', N0 - 6 * sf, N0 - 8 * sf);
    g.textAlign = 'left'; g.fillText((kGross ? '200' : '50') + ' m', 34 * sf, N0 - 8 * sf); g.fillRect(34 * sf, N0 - 20 * sf, (kGross ? 200 : 50) * k, 2 * sf); }
  /* Größe und Qualität */
  const gr = () => { const w = host.clientWidth, h = host.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  const ro = new ResizeObserver(gr); ro.observe(host); gr();
  /* Qualität: Automatisch beginnt hoch und geht herunter, wenn das Handy ruckelt */
  let QA = null;
  function setzeQuali(q) { const alt = QA; QA = q; const Q = QUALI[q]; dpr = Math.min(window.devicePixelRatio || 1, Q.dpr); r.setPixelRatio(dpr); gr();
    const sch = Q.schatten && ST.schatten; r.shadowMap.enabled = sch; sonne.castShadow = sch; scene.environment = Q.env && envRT ? envRT.texture : null;
    if (!ST.flach) { wasser.material = Q.env ? wmat : wmatE; }
    if (alt) scene.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.needsUpdate = true; }); }); }
  setzeQuali(C.quali === 'auto' ? 'hoch' : C.quali);
  setzeOrt(C.ort); W.setzeBoot(BOOTE[C.boot % BOOTE.length]());
  if (!opt.folge) sag('hinnerk', C.ort === 'hafen' ? 'Moin! Wir liegen im Hafen. Schieb den Hebel nach oben für voraus, zur Seite zum Lenken.' : 'Moin! Steuern mit einem Finger: hoch für Gas, zur Seite zum Lenken.', 9000);
  /* Schleife */
  let t0 = performance.now(), alt = t0, laufend = true, fpsN = 0, fpsT = t0, tonT = 0, hudT = 0, uhr = 0, kielT = 0, moeweT = 8, hornT = 20, qualiPruef = 3; W.fps = 0;
  const v3 = new T.Vector3(), farbe = new T.Color();
  function sektor(sk, objH, ox, oz) { if (sk === 'rund') return 1; const rel = wdiff(Math.atan2(cam.position.x - ox, -(cam.position.z - oz)), objH) / RAD, a = Math.abs(rel);
    if (sk === 'top') return sm(115, 110, a); if (sk === 'heck') return sm(110, 115, a); if (sk === 'sb') return rel > -2 ? sm(115, 110, a) * sm(-2, 2, rel) : 0; if (sk === 'bb') return rel < 2 ? sm(115, 110, a) * sm(2, -2, rel) : 0; return 1; }
  function lichterSetzen(boot, h) { for (const l of boot.userData.lichter || []) { l.glow.getWorldPosition(v3); const v = lichterAn ? sektor(l.sektor, h, v3.x, v3.z) : 0;
    l.glow.material.opacity = v * (nachtAn ? 1 : .55); l.lampe.material.color.copy(farbe.copy(l.farbe).multiplyScalar(.25 + .75 * v)); const d = v3.distanceTo(cam.position); l.glow.scale.setScalar((l.glow.userData.s || (l.glow.userData.s = l.glow.scale.x)) * (1 + d / 60)); } }
  function schritt(now) {
    if (!laufend) return; if (!host.isConnected) { if (pausiert) { alt = now; requestAnimationFrame(schritt); return; } ende(); return; } requestAnimationFrame(schritt);
    const dt = Math.min(.05, (now - alt) / 1000); alt = now; uhr += dt; const t = uhr, B = P.boot, U = B.userData;
    const nS = (FAHRT ? FAHRT.raffer : 1) * (W.tempo || 1); for (let i = 0; i < nS; i++) { if (FAHRT) fahrtTick(dt); if (ANDOCK) andocken(dt); physik(dt, t); if (!FAHRT) kollision(t); } warteTick();
    const fx = Math.sin(P.h), fz = -Math.cos(P.h);
    B.position.set(P.x, P.y, P.z); B.rotation.set(-P.nick, Math.PI - P.h, P.roll, 'YXZ');
    if (U.motor) U.motor.rotation.y = P.d * .5; if (U.propeller && P.motor === 'an') U.propeller.rotation.z += P.g * dt * 38;
    if (U.rad) U.rad.rotation.z = P.d * 2.2; if (U.hebel) U.hebel.rotation.x = P.g * .7;
    motorTick(dt * (W.tempo || 1)); if (P.motor !== 'an' && Math.abs(P.gZiel) > .2 && !FAHRT && uhr - (P.motHinweis || -99) > 25) { P.motHinweis = uhr; tipp('Der Motor ist aus. Erst starten: Schlüssel links unten.'); }
    if (U.flagge) { const awx = Math.sin(windVon + Math.PI) * windMs - P.vx, awz = -Math.cos(windVon + Math.PI) * windMs - P.vz, aw = Math.hypot(awx, awz), weh = Math.atan2(awx, -awz);
      const rel = wdiff(weh, P.h); U.flagge.dreh.rotation.y = Math.atan2(-Math.cos(rel), -Math.sin(rel)); const pa = U.flagge.tuch.geometry.attributes.position, bs = U.flagge.tuch.userData.basis, st = cl(aw / 8, 0, 1);
      U.flagge.dreh.rotation.z = -(1 - st) * 1.2; for (let i = 0; i < pa.count; i++) { const x = bs[i * 3]; pa.setZ(i, Math.sin(x * 9 - t * (4 + aw)) * .05 * x * (.3 + st)); } pa.needsUpdate = true; }
    /* Wasser */
    const cx = Math.round(P.x / ZELLE) * ZELLE, cz = Math.round(P.z / ZELLE) * ZELLE; wasser.position.set(cx, 0, cz); fern.position.x = cx; fern.position.z = cz;
    const aw = WLst.filter(q => q.art === 'w' || q.art === 'b').reduce((a, q) => a + q.A, 0) || 1, wa = wpos.array;
    /* Das Boot verdrängt das Wasser: unter dem Rumpf und dicht daneben steht das Wasser höchstens bis knapp über den Wasserpass.
       So läuft eine Welle am Boot entlang und bricht an ihm, statt durch Deck und Kajüte zu gehen. */
    const bL = (U.laenge || 8) / 2 + .7, bB = (U.breite || 3) / 2 + .55, sNick = Math.sin(P.nick), sRoll = Math.sin(P.roll), bR = bL * 1.7, rxB = Math.cos(P.h), rzB = Math.sin(P.h);
    for (let i = 0; i < wpos.count; i++) { const bx = basis[2 * i] + cx, bz = basis[2 * i + 1] + cz, rand = sm(165, 120, Math.hypot(basis[2 * i], basis[2 * i + 1])), da = hafenRuhe(bx, bz) * rand, h = wh[i];
      let X = 0, Y = 0, Z = 0, sch = 0, brech = 0;
      for (const q of WLst) { const lod = q.lam >= 4 * h ? 1 : q.lam <= 2 * h ? 0 : sm(2 * h, 4 * h, q.lam); if (!lod) continue;
        const th = q.k * (q.dx * bx + q.dz * bz) - q.om * t + q.ph, sn = Math.sin(th), cs = Math.cos(th), A = q.A * da * lod; X += q.Q * A * q.dx * cs; Z += q.Q * A * q.dz * cs; Y += A * sn; if (q.art === 'w' || q.art === 'b') sch += sn * A; }
      Y += schwell(bx, bz, t) * da;
      const ex = bx + X - P.x, ez = bz + Z - P.z; if (ex * ex + ez * ez < bR * bR) { const lz = ex * fx + ez * fz, lx = -(ex * rxB + ez * rzB), e = (lz / bL) * (lz / bL) + (lx / bB) * (lx / bB);
        if (e < 2.2) { const deckel = P.y + lz * sNick + lx * sRoll + .14 + .5 * Math.max(0, e - 1), k = e < 1 ? 1 : sm(2.2, 1, e); if (Y > deckel) { brech = (Y - deckel) * k; Y = mix(Y, deckel, k); } } }
      wa[i * 3] = basis[2 * i] + X; wa[i * 3 + 1] = Y; wa[i * 3 + 2] = basis[2 * i + 1] + Z;
      const br = cl(Math.sin(bx * .41 + bz * .17 + t * .2) * Math.sin(bz * .37 - bx * .23 + t * .5) * 1.6 - .2, 0, 1), f = cl(sm(.68, 1.02, sch / aw) * schaumMenge * br * .7 + Math.min(.55, brech * .9), 0, .75), hl = cl(Y * .06, -.06, .1);
      wcol[i * 3] = mix(wasserFarbe.r * (1 + hl), krone.r, f); wcol[i * 3 + 1] = mix(wasserFarbe.g * (1 + hl), krone.g, f); wcol[i * 3 + 2] = mix(wasserFarbe.b * (1 + hl), krone.b, f); }
    wpos.needsUpdate = true; wg.attributes.color.needsUpdate = true; wg.computeVertexNormals();
    const rep = 26, wo = (windMs + 1.5) * .0035; wN.offset.set(cx / WS * rep + t * wo, -cz / WS * rep + t * wo * .6); fernN.offset.set(t * wo * 4, t * wo * 2.4);
    /* Kielwasser und Bugwellen */
    kielT += dt; const u = P.u || 0;
    if (kielT > .12) { kielT = 0; const L = U.laenge / 2, s = cl(Math.abs(u) / 3, 0, 1) + Math.abs(P.g) * .3; kiel.add(P.x - fx * L, P.z - fz * L, 0, 0, s, t);
      const rx = Math.cos(P.h), rz = Math.sin(P.h), sp = Math.max(0, u) * .32; bugL.add(P.x + fx * L * .7 - rx * U.breite * .5, P.z + fz * L * .7 - rz * U.breite * .5, -rx * sp, -rz * sp, cl(u / 4, 0, 1), t);
      bugR.add(P.x + fx * L * .7 + rx * U.breite * .5, P.z + fz * L * .7 + rz * U.breite * .5, rx * sp, rz * sp, cl(u / 4, 0, 1), t);
      const sf = Math.sin(SCH.h), szz = -Math.cos(SCH.h); schiffKiel.add(SCH.x - sf * 10, SCH.z - szz * 10, 0, 0, .8, t);
      if (Math.abs(P.g) > .25 && P.motor === 'an') for (let i = 0; i < 3; i++) spritz(P.x - fx * (L + .4), P.y - .1, P.z - fz * (L + .4), -fx * P.g * 2 + rnd(-.4, .4), rnd(.2, .8), -fz * P.g * 2 + rnd(-.4, .4));
      /* Kontrollstrahl: Der laufende Außenborder spritzt Kühlwasser seitlich heraus */
      if (P.motor === 'an' && U.motor) { U.motor.getWorldPosition(vStr); spritz(vStr.x - fx * .2 - rx * .2, vStr.y + .12, vStr.z - fz * .2 - rz * .2, -rx * .9 + P.vx, .9, -rz * .9 + P.vz); }
      /* Gleitfahrt: seitliche Gischt vom Rumpf */
      if (P.gleit > .5) for (let i = 0; i < 4; i++) { const sd = Math.random() < .5 ? -1 : 1; spritz(P.x + fx * L * .1 + rx * sd * U.breite * .5, P.y + .05, P.z + fz * L * .1 + rz * sd * U.breite * .5, rx * sd * rnd(2, 4) - fx * rnd(0, 2), rnd(1, 2.5), rz * sd * rnd(2, 4) - fz * rnd(0, 2)); }
      if (u > 2.5 && (P.vn < -.15 || Math.random() < .1 * aw)) for (let i = 0; i < 8; i++) { const sd = Math.random() < .5 ? -1 : 1; spritz(P.x + fx * L * .8 + rx * sd * .6, P.y + .3, P.z + fz * L * .8 + rz * sd * .6, rx * sd * rnd(1, 3) + fx * u * .5, rnd(2, 4.5), rz * sd * rnd(1, 3) + fz * u * .5); } }
    kiel.upd(t); bugL.upd(t); bugR.upd(t); schiffKiel.upd(t);
    for (let i = 0; i < GN; i++) { const p = G[i]; if (p.t < 3) { p.t += dt; p.vy -= 9.81 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; if (p.y < flaeche(p.x, p.z, t) - .3) p.t = 9; }
      gpos[i * 3] = p.x; gpos[i * 3 + 1] = p.t < 3 ? p.y : -99; gpos[i * 3 + 2] = p.z; gcol.set([1, 1, 1, p.t < 3 ? cl(1 - p.t / 1.6, 0, .9) : 0], i * 4); }
    gg.attributes.position.needsUpdate = gg.attributes.color.needsUpdate = true;
    /* Schiff fährt seine Runde */
    SCH.a += SCH.v / SCH.R * dt; const nx = SCH.cx + Math.cos(SCH.a) * SCH.R, nz = SCH.cz + Math.sin(SCH.a) * SCH.R; SCH.vx = (nx - SCH.x) / dt; SCH.vz = (nz - SCH.z) / dt; SCH.x = nx; SCH.z = nz;
    SCH.h = Math.atan2(-Math.sin(SCH.a), -Math.cos(SCH.a)) + Math.PI; SCH.h = Math.atan2(SCH.vx, -SCH.vz) || SCH.h; SCH.wv += (-SCH.wack * 3 - SCH.wv * 1.5) * dt; SCH.wack += SCH.wv * dt;
    schiff.position.set(SCH.x, flaeche(SCH.x, SCH.z, t) * .6, SCH.z); schiff.rotation.set(Math.sin(t * .6) * .015 * (1 + aw), Math.PI - SCH.h, Math.sin(t * .8) * .02 * (1 + aw) + SCH.wack, 'YXZ');
    /* Bojen: verankert, schwimmen auf und ab, werden weggestoßen und kommen zurück */
    for (const b of WL.bojen) { b.vx += (-(b.x - b.hx) * .25 - b.vx * .6) * dt; b.vz += (-(b.z - b.hz) * .25 - b.vz * .6) * dt; b.x += b.vx * dt; b.z += b.vz * dt;
      b.kv.x += (-b.kipp.x * 6 - b.kv.x * 1.6) * dt; b.kv.y += (-b.kipp.y * 6 - b.kv.y * 1.6) * dt; b.kipp.x += b.kv.x * dt; b.kipp.y += b.kv.y * dt;
      b.obj.position.set(b.x, flaeche(b.x, b.z, t) * .9 - .15, b.z); b.obj.rotation.set(b.kipp.x + Math.sin(t * 1.3 + b.hx) * .04 * (1 + aw), 0, b.kipp.y + Math.cos(t * 1.1 + b.hz) * .04 * (1 + aw)); }
    for (const l of WL.blink) { const ph = (t + l.ph) % l.takt; l.glow.material.opacity = lichterAn && ph < l.an ? 1 : 0; }
    for (const l of WL.lampen) if (l.glow) l.glow.material.opacity = nachtAn ? .9 : 0;
    /* Leuchtturm: Strahl dreht, leuchtet hell auf, wenn er zu dir zeigt */
    const LT = WL.leuchtturm, la = t * .9; LT.strahl.rotation.y = la; LT.strahl.children.forEach(m => { m.material.opacity = nachtAn ? (C.sicht !== 'klar' ? .07 : .045) : 0; });
    const zuMir = Math.atan2(-(cam.position.z - LT.pos.z), cam.position.x - LT.pos.x), blitz = Math.max(Math.pow(Math.max(0, Math.cos(la - zuMir)), 60), Math.pow(Math.max(0, Math.cos(la + Math.PI - zuMir)), 60));
    LT.glow.material.opacity = nachtAn || lichterAn ? .35 + blitz * .65 : 0; LT.glow.scale.setScalar(9 + blitz * 18);
    lichterSetzen(B, P.h); lichterSetzen(schiff, SCH.h);
    /* Tiere */
    fliegen.forEach((m, i) => { const a = t * (.28 + i * .07) + i * 2.1, R = 22 + i * 12, mx = i === 2 ? 10 : P.x, mz = i === 2 ? 130 : P.z; m.position.set(mx + Math.cos(a) * R, 12 + i * 3 + Math.sin(t * .7 + i) * 1.4, mz + Math.sin(a) * R); m.rotation.set(0, -a, -.28); m.userData.fl.forEach(([w, s]) => w.rotation.z = s * Math.sin(t * 7 + i) * .5); });
    WL.sitzMoewen.forEach((m, i) => { m.rotation.y = m.userData.r0 + Math.sin(t * .7 + i * 2) * .5; });
    if (t > entenZiel.t) entenZiel = {x: rnd(-60, 60), z: rnd(95, 160), t: t + rnd(8, 14)};
    enten.forEach((e, i) => { let zx, zz; if (i === 0) { zx = entenZiel.x; zz = entenZiel.z; } else { zx = enten[i - 1].x; zz = enten[i - 1].z; }
      let vx = zx - e.x, vz = zz - e.z; const d = Math.hypot(vx, vz), soll = i ? .7 : 0; let sp = i ? cl((d - soll) * 1.5, 0, 1.2) : .45; vx /= d || 1; vz /= d || 1;
      const bx = e.x - P.x, bz = e.z - P.z, bd = Math.hypot(bx, bz); if (bd < 10) { vx = vx * .3 + bx / bd; vz = vz * .3 + bz / bd; sp = 1.3; }
      if (WL.stat.some(s => !s.k && Math.hypot(e.x - s.ax, e.z - s.az) < s.r + 1)) { vx = -vx; vz = -vz; }
      e.x += vx * sp * dt; e.z += vz * sp * dt; if (sp > .05) e.h = Math.atan2(vx, vz); e.o.position.set(e.x, flaeche(e.x, e.z, t) - .02, e.z); e.o.rotation.y = e.h; e.o.rotation.z = Math.sin(t * 3 + i) * .05; });
    if (!SH.weg && Math.hypot(P.x - 62, P.z + 200) < 24) { SH.weg = true; SH.zeit = t + 18; sag('klabauter', 'Zu nah! Der Seehund ist abgetaucht. Krrah!'); }
    if (SH.weg && t > SH.zeit && Math.hypot(P.x - 62, P.z + 200) > 45) SH.weg = false;
    SH.y += ((SH.weg ? -1.4 : .1) - SH.y) * dt * 1.5; seehund.position.y = SH.y; seehund.userData.kopf.rotation.y = Math.sin(t * .5) * .5;
    katzeLauf(dt, t);
    if (ZIEL) { zielObj.position.y = flaeche(ZIEL.x, ZIEL.z, t) + .05; zielObj.children[0].material.opacity = .55 + .3 * Math.sin(t * 3); zielObj.children[0].rotation.z = t * .4; }
    for (const w in CREWF) { const f = CREWF[w], kp = f.userData.kopf, weg = f.userData.weg;
      if (weg && weg.length) { const v = weg[0], d = f.position.distanceTo(v); if (d < .05) { weg.shift(); if (!weg.length) f.rotation.y = 0; } else { const st = Math.min(d, dt * .9); f.rotation.y = Math.atan2(v.x - f.position.x, v.z - f.position.z); f.position.addScaledVector(v.clone().sub(f.position).normalize(), st); f.position.y = v.y + Math.abs(Math.sin(t * 9)) * .03; } }
      kp.rotation.x = sprecher === w ? Math.sin(t * 9) * .09 : 0; kp.rotation.y = sprecher === w ? 0 : Math.sin(t * .5 + w.length) * .35; if (w === 'klabauter' && sprecher === w) f.rotation.z = Math.sin(t * 12) * .08; }
    /* Wetter in Bewegung */
    if (regenZahl) { const kx = cam.position.x, kz = cam.position.z, lee = windVon + Math.PI, wx = Math.sin(lee) * windMs * .06, wz = -Math.cos(lee) * windMs * .06;
      for (let i = 0; i < regenZahl; i++) { let y = rp[i * 6 + 1] - dt * 15; let x = rp[i * 6], z = rp[i * 6 + 2]; if (y < -1 || Math.abs(x - kx) > 40 || Math.abs(z - kz) > 40) { y = rnd(18, 30); x = kx + rnd(-40, 40); z = kz + rnd(-40, 40); }
        x += wx * dt * 15; z += wz * dt * 15; rp.set([x, y, z, x - wx * .9, y + .9, z - wz * .9], i * 6); } rg.attributes.position.needsUpdate = true; }
    wolken.forEach(s => { s.userData.a += dt * .0006 * (windMs + 1); const a = s.userData.a; s.position.set(cam.position.x + Math.cos(a) * s.userData.d, s.userData.y, cam.position.z + Math.sin(a) * s.userData.d); });
    himmel.position.copy(cam.position); sterne.position.copy(cam.position);
    sonne.target.position.set(P.x, 0, P.z); sonne.position.set(P.x + HI.u.sonneDir.value.x * 120, HI.u.sonneDir.value.y * 120, P.z + HI.u.sonneDir.value.z * 120);
    /* Kamera folgt (dritte Person), Wackeln nach Stößen und im Sturm */
    if (!K.lock && now - K.last > 2600) K.yaw += (0 - K.yaw) * Math.min(1, dt * 1.2);
    K.hs += wdiff(P.h, K.hs) * Math.min(1, dt * 2.2);
    const dist = C.sicht === 'extrem' ? Math.min(K.dist, 17) : C.sicht === 'dicht' ? Math.min(K.dist, 22) : K.dist, ang = K.hs + K.yaw, cp = Math.cos(K.pitch);
    const zx = P.x - Math.sin(ang) * dist * cp, zz = P.z + Math.cos(ang) * dist * cp; let zy = Math.max(flaeche(zx, zz, t) + 1.4, P.y + 1.6 + Math.sin(K.pitch) * dist);
    /* Kein Wellenkamm zwischen Kamera und Boot: die Kamera steigt, bis die Sicht frei ist */
    if (WLst.length) { const ziel = P.y + .3; for (const f of [.14, .22, .32, .45, .65, .85]) { const sy = flaeche(mix(P.x, zx, f), mix(P.z, zz, f), t) + .45; zy = Math.max(zy, ziel + (sy - ziel) / f); } zy = Math.min(zy, P.y + 1.6 + Math.sin(K.pitch) * dist + 14); }
    K.pos.x += (zx - K.pos.x) * Math.min(1, dt * (K.lock ? 6 : 2.6)); K.pos.y += (zy - K.pos.y) * Math.min(1, dt * 3); K.pos.z += (zz - K.pos.z) * Math.min(1, dt * (K.lock ? 6 : 2.6));
    K.shake = Math.max(0, K.shake - dt * 1.8) ; const wack = K.shake * .5 + (windMs > 14 ? .06 * (windMs - 14) / 8 : 0);
    cam.position.set(K.pos.x + Math.sin(t * 41) * wack * .3, K.pos.y + Math.sin(t * 37) * wack * .25, K.pos.z + Math.cos(t * 43) * wack * .3);
    K.blick.lerp(v3.set(P.x, P.y + 1.4, P.z), Math.min(1, dt * 5)); cam.lookAt(K.blick);
    K.fov += (52 + cl(Math.abs(u), 0, 11) * .75 - K.fov) * dt * 2; if (Math.abs(cam.fov - K.fov) > .05) { cam.fov = K.fov; cam.updateProjectionMatrix(); }
    const tR = performance.now(); if (!verdeckt) r.render(scene, cam); W.mess = {js: Math.round(tR - now), render: Math.round(performance.now() - tR)};
    /* Töne (gedrosselt) */
    tonT -= dt; if (tonT < 0) { tonT = .25; try { const ag = Math.abs(P.g); const an = P.motor === 'an', rau = an && P.mot.choke && P.mot.chokeT > 6; AUD.loop('motorLauf', an ? .14 + ag * .32 + P.gleit * .06 : 0, .82 + ag * .5 + P.gleit * .2 + (rau ? Math.random() * .25 - .12 : 0)); const hw = WLst.reduce((a, q) => a + q.A, 0);
      AUD.loop('wellen', cl(.12 + hw * .25, 0, .7)); AUD.loop('wind', windMs > 2 && windMs < 15 ? cl(windMs / 18, 0, .55) : 0); AUD.loop('sturm', windMs >= 15 ? .6 : 0); AUD.loop('regen', C.regen === 'stark' ? .7 : C.regen === 'regen' ? .4 : 0); } catch (e) {} }
    moeweT -= dt; if (moeweT < 0) { moeweT = rnd(14, 30); if (!nachtAn && P.z > 0) try { AUD.sfx('moewe', {vol: .25, pan: rnd(-.7, .7)}); } catch (e) {} }
    hornT -= dt; if (hornT < 0) { hornT = 30; const dS = Math.hypot(SCH.x - P.x, SCH.z - P.z); if (['nebel', 'dicht', 'extrem'].includes(C.sicht) && dS < 500) { const rel = wdiff(Math.atan2(SCH.x - P.x, -(SCH.z - P.z)), P.h); try { AUD.horn('▬', null, Math.sin(rel)); } catch (e) {} } }
    if (!FOLGE) kommentare(t);
    hudT -= dt; if (hudT < 0) { hudT = .15; const kn = Math.abs(u) * 1.94, hd = ((P.h / RAD) % 360 + 360) % 360, gp = Math.round(Math.abs(P.gZiel) * 100), rw = Math.round(Math.abs(P.dZiel) * 30);
      $('#wtk').textContent = 'Kurs ' + String(Math.round(hd)).padStart(3, '0') + '° · ' + kn.toFixed(1).replace('.', ',') + ' kn';
      const pin = steuerArt() === 'pinne', rs = pin ? -P.dZiel : P.dZiel;
      $('#wtg').textContent = (P.motor !== 'an' ? 'Motor aus' : !P.gZiel ? 'neutral' : (P.gZiel > 0 ? 'voraus ' : 'zurück ') + gp + ' %') + ' · ' + (!rw ? (pin ? 'Pinne' : 'Ruder') + ' mittschiffs' : (pin ? 'Pinne nach ' : 'Ruder ') + (rs > 0 ? 'Stb ' : 'Bb ') + rw + '°') + (P.gleit > .8 ? ' · Gleitfahrt' : P.buckel > .5 ? ' · Übergang' : '');
      karteZeichnen(); if (mpEl.style.display !== 'none') neutralZeigen(); }
    fpsN++; if (now - fpsT > 1000) { W.fps = fpsN; fpsN = 0; fpsT = now; qualiPruef--; if (C.quali === 'auto' && qualiPruef <= 0 && QA !== 'niedrig' && W.fps < 24) { setzeQuali(QA === 'hoch' ? 'mittel' : 'niedrig'); qualiPruef = 3; } }
  }
  /* Die Katze läuft an Deck herum, setzt sich, putzt sich, erschrickt bei Stößen */
  function katzeLauf(dt, t) {
    const weg = P.boot.userData.katzenWeg || [], U = katze.userData; if (weg.length < 2) return;
    KZ.zeit -= dt; let gehen = false;
    if (KZ.schreck > 0) { KZ.schreck -= dt; katze.position.y = weg[KZ.i].y + Math.max(0, Math.sin((1.1 - KZ.schreck) / 1.1 * Math.PI)) * .5; U.koerper.scale.y = .85 + KZ.schreck * .15; }
    else if (KZ.modus === 'gehen') { const a = weg[KZ.i], b = weg[(KZ.i + 1) % weg.length], d = a.distanceTo(b); KZ.u += dt * .38 / Math.max(d, .1);
      if (KZ.u >= 1) { KZ.u = 0; KZ.i = (KZ.i + 1) % weg.length; if (Math.random() < .45) { KZ.modus = Math.random() < .5 ? 'sitzen' : 'putzen'; KZ.zeit = rnd(2.5, 7); } }
      katze.position.lerpVectors(a, b, KZ.u); katze.rotation.y = Math.atan2(b.x - a.x, b.z - a.z); gehen = true; }
    else if (KZ.zeit < 0) KZ.modus = 'gehen';
    KZ.ph += dt * (gehen ? 9 : 0); U.beine.forEach((h, i) => h.rotation.x = gehen ? Math.sin(KZ.ph + (i === 0 || i === 3 ? 0 : Math.PI)) * .55 : 0);
    U.koerper.position.y = .22 + (gehen ? Math.abs(Math.sin(KZ.ph)) * .015 : 0) - (KZ.modus === 'sitzen' ? .03 : 0);
    U.kopf.rotation.x = KZ.modus === 'putzen' ? .5 + Math.sin(t * 6) * .25 : Math.sin(t * .7) * .08; U.kopf.rotation.y = KZ.modus === 'sitzen' ? Math.sin(t * .4) * .6 : 0;
    U.schwanz.forEach((s, i) => { if (i) s.rotation.z = Math.sin(t * 2.4 - i * .7) * (KZ.schreck > 0 ? .1 : .32); else s.rotation.x = KZ.schreck > 0 ? -.2 : -.9; });
  }
  function ende() {
    if (!laufend) return; laufend = false; window.removeEventListener('keydown', taste); ro.disconnect();
    try { ['motorLauf', 'wellen', 'wind', 'sturm', 'regen'].forEach(n => AUD.loop(n, 0)); } catch (e) {}
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach(x => x.dispose()); });
    Object.values(TX).forEach(x => x.dispose && x.dispose()); if (envRT) envRT.dispose(); pmrem.dispose(); r.dispose(); try { r.forceContextLoss(); } catch (e) {}
  }
  const zurueckKnopf = () => { if (FOLGE && window.WFOLGE) WFOLGE.stop(); FOLGE = null; ende(); clearTimeout(bubT); if (typeof VOX !== 'undefined') VOX.stop(); setTab(typeof returnTo !== 'undefined' ? returnTo : 'cabin'); };
  back.onclick = zurueckKnopf;
  W.starteFolge = starteFolge; W.setzeModus = m => { modus = m; const b = $('#wtmodus'); if (b) b.textContent = m === 'auto' ? '🎧 Auto' : '✋ Selbst'; };
  W.ende = ende; W.zustand = {P, K, C, SCH, WL, scene, cam, r, sag, setzeWetter, setzeOrt, pad, wasser, abstand: hindernisAbstand};
  requestAnimationFrame(schritt);
  if (opt.folge) setTimeout(() => starteFolge(opt.folge), 1500);
};

function css() {
  if (document.getElementById('weltcss')) return;
  const s = document.createElement('style'); s.id = 'weltcss';
  s.textContent = `.wt{position:relative;height:calc(100dvh - 150px);min-height:360px;border-radius:14px;overflow:hidden;background:#cfe0e8;touch-action:none;margin:0 0 8px;user-select:none;-webkit-user-select:none}
  .wt canvas{width:100%;height:100%;display:block}
  .wt .hud{position:absolute;left:8px;top:8px;background:rgba(255,250,240,.86);border-radius:10px;padding:4px 9px;font-size:12px;color:#2b3a4a;line-height:1.3}.wt .hud b{display:block;font-size:13px}
  .wt .wind{position:absolute;right:8px;top:8px;width:50px;height:58px;border-radius:12px;background:rgba(20,30,40,.5);color:#fffaf0;text-align:center;font:700 10px sans-serif}
  .wt .wind i{display:block;font-style:normal;font-size:22px;line-height:38px;transition:transform .3s}
  .wt .bub{position:absolute;left:62px;right:8px;top:126px;z-index:2;background:rgba(255,252,240,.95);border-radius:14px;padding:8px 11px;font-size:14px;color:#2b2118;box-shadow:0 2px 8px rgba(0,0,0,.18)}.wt .bub b{color:#b5563a}
  .wpad{position:absolute;right:10px;bottom:10px;width:176px;height:164px;border-radius:22px;background:rgba(20,30,40,.55);touch-action:none}
  .wpad .wst{position:absolute;left:4px;top:26px;width:122px;height:122px;pointer-events:none;overflow:visible}
  .wpad .wgs2{position:absolute;right:14px;top:18px;bottom:18px;width:14px;border-radius:7px;background:rgba(0,0,0,.4);box-shadow:inset 0 0 0 1px rgba(255,250,240,.3);pointer-events:none}
  .wpad .wgk{position:absolute;left:50%;top:50%;width:30px;height:20px;margin:-10px 0 0 -15px;border-radius:7px;background:#f0b53e;border:2px solid #fffaf0;box-shadow:0 2px 0 rgba(0,0,0,.35)}
  .wpad b{position:absolute;right:34px;color:#fffaf0;font:700 9px sans-serif;pointer-events:none}.wpad .wl1{top:14px}.wpad .wl2{top:50%;margin-top:-6px}.wpad .wl3{bottom:14px}
  .wt .wb.motor{position:absolute;left:10px;bottom:70px;width:52px;height:52px;border-radius:50%;border:3px solid #fffaf0;background:rgba(43,47,51,.88);font-size:22px;padding:0}.wt .wb.motor i{position:absolute;right:4px;top:4px;width:11px;height:11px;border-radius:50%;background:#c0392b;border:2px solid #fffaf0}.wt .wb.motor i.an{background:#3cc46a}
  .wmp{position:absolute;left:8px;bottom:136px;width:236px;max-height:62%;overflow:auto;background:rgba(255,250,240,.97);color:#2b2118;border-radius:14px;padding:8px;z-index:7;box-shadow:0 2px 10px rgba(0,0,0,.3)}
  .wmp .wmk{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.wmp .wmzu{border:0;background:none;font-size:16px;padding:2px 6px}
  .wmp .wms{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:1px solid #d9c9ab;background:#fff;border-radius:10px;padding:7px 8px;margin:0 0 5px;font:600 13px Nunito,sans-serif;color:#2b2118}
  .wmp .wms i{flex:0 0 20px;height:20px;border-radius:6px;border:2px solid #c9b79a;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:12px}.wmp .wms.ok{background:#eaf7ee;border-color:#8cc69c}.wmp .wms.ok i{border-color:#3c9a5a;color:#2d7a45}
  .wmp .wmzug{display:flex;gap:8px;align-items:center;border:2px dashed #c0392b;border-radius:12px;padding:12px 8px;font:700 13px Nunito,sans-serif;touch-action:none;user-select:none;background:#fff4ef}.wmp .wmzug b{font-size:22px;color:#c0392b;transition:transform .15s}.wmp .wmzug.zieht b{transform:translateY(10px)}
  .wmp .wmst.zieht{filter:brightness(.9)}
  .wpad .wsart{position:absolute;left:8px;top:6px;border:0;border-radius:10px;background:rgba(255,250,240,.9);color:#2b2118;font:800 11px sans-serif;padding:4px 7px}
  .wt .horn{position:absolute;left:10px;bottom:10px;width:52px;height:52px;border-radius:50%;border:3px solid #fffaf0;background:rgba(61,95,143,.85);font-size:22px}
  .wtpanel{position:absolute;left:6px;right:6px;top:6px;bottom:6px;overflow:auto;background:rgba(255,250,240,.97);border-radius:14px;padding:8px 10px;color:#2b2118;z-index:3}
  .wtph{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.wtpanel h4{margin:8px 0 4px;font-size:13px}
  .wtc{border:1.5px solid #c9b79a;background:#fffaf0;border-radius:16px;padding:5px 10px;margin:0 4px 5px 0;font:600 13px inherit;color:#3a2a10}
  .wtc[aria-pressed="true"]{background:#f0b53e;border-color:#c8962e}
  .wt .wkarte{position:absolute;right:8px;top:8px;width:112px;height:112px;border-radius:12px;border:2px solid rgba(255,250,240,.9);box-shadow:0 2px 6px rgba(0,0,0,.25);z-index:2}
  .wt .wkarte.gross{left:8px;width:calc(100% - 16px);height:auto;aspect-ratio:1/1;z-index:4}
  .wgs{position:absolute;left:8px;top:58px;display:flex;flex-direction:column;gap:6px;z-index:1}
  .wg{width:44px;height:44px;border-radius:50%;background:#f3d79a;border:2.5px solid rgba(255,250,240,.95);overflow:hidden;opacity:.8;transition:transform .2s,opacity .2s;box-shadow:0 1px 4px rgba(0,0,0,.25)}
  .wg.spricht{transform:scale(1.2);opacity:1;border-color:#f0b53e}.wg svg{width:100%;height:100%;display:block}
  .wtq{position:absolute;left:8px;right:8px;bottom:8px;max-height:64%;overflow:auto;background:rgba(255,250,240,.97);border-radius:14px;padding:10px;z-index:3;color:#2b2118;box-shadow:0 2px 10px rgba(0,0,0,.25)}
  .wtq .btn.ghost{color:#2b2118;border-color:#c9b79a;background:transparent}.wtq .wqf{margin:0 0 8px}.wqimg img{max-width:100%;max-height:130px;display:block;margin:0 auto 8px}
  .wtq .ans{display:block;width:100%;text-align:left;margin:0 0 6px}.wtq .ans.emp{border-color:#f0b53e;border-width:2px}.wemp{font-size:11px;color:#b5563a;font-weight:800}
  .wap{position:absolute;left:10px;bottom:72px;background:rgba(20,30,40,.6);color:#fffaf0;border-radius:10px;padding:4px 9px;font:700 12px sans-serif;z-index:1}
  .wpad.aus{opacity:.35;pointer-events:none}.wpad.auto{opacity:.55}
  .wt .wang{position:absolute;left:10px;bottom:132px;z-index:3}
  .wsz{position:absolute;inset:0;z-index:3;overflow:hidden;background:linear-gradient(#8a5e3c,#6b4a32 62%,#4f3624)}
  .wsz .wsbull{position:absolute;left:50%;top:9%;width:110px;height:110px;margin-left:-55px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#cfe6f0,#5f9fb5);border:9px solid #c8962e;box-shadow:inset 0 0 12px rgba(0,0,0,.35)}
  .wsz .wslampe{position:absolute;right:16%;top:8%;width:26px;height:40px;border-radius:8px;background:#ffd590;box-shadow:0 0 40px 18px rgba(255,213,144,.45)}
  .wsz .wstisch{position:absolute;left:-5%;right:-5%;bottom:0;height:24%;background:linear-gradient(#b98455,#8a5e3c);border-top:6px solid #c9935e}
  .wsz .wsfig{position:absolute;left:0;right:0;bottom:16%;display:flex;justify-content:center;align-items:flex-end;gap:2%}
  .wsz .wsf{width:30%;transition:transform .25s;transform-origin:50% 100%}.wsz .wsf svg{width:100%;height:auto;display:block}.wsz .wsf.spricht{transform:scale(1.08) translateY(-4px)}
  .wt .bub{z-index:5}.wtq{z-index:6}
  .wtbar{display:flex;gap:6px}.wtbar .btn{flex:1;min-width:0;font-size:12px;padding-left:3px;padding-right:3px}`;
  document.head.appendChild(s);
}
})();
