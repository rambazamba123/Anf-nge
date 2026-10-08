/* Prüft die Törn-Daten: Schema, Orte, Routen nicht über Land, Ereignisse und Ausrüstung.
   Aufruf: node tests/toern-daten.js */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), read = f => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8'));
const K = read('karte.json'), T = read('toerns.json');
const exists = f => fs.existsSync(path.join(root, 'data', f));
const E = exists('ereignisse.json') ? read('ereignisse.json') : null, A = exists('ausruestung.json') ? read('ausruestung.json') : null;
let err = 0; const bad = m => { err++; console.log('FEHLER: ' + m); };
const xy = ([lat, lon]) => [(lon - 20) * 28.45, (30 - lat) * 50];
const inPoly = ([x, y], P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
const land = K.flaechen.filter(f => f.art === 'land').map(f => f.xy);
const sm = (a, b) => Math.hypot(b[0] - a[0], (b[1] - a[1]) * Math.cos((55 + (a[0] + b[0]) / 120) * Math.PI / 180));
const stufen = new Set(T.stufen.map(s => s.id)), ausr = new Set(A ? A.teile.map(a => a.id) : []);
for (const t of T.toerns) {
  if (!stufen.has(t.stufe)) bad(`${t.id}: Stufe ${t.stufe} unbekannt`);
  if (A) t.ausr.forEach(a => ausr.has(a) || bad(`${t.id}: Ausrüstung ${a} unbekannt`));
  let L = 0;
  t.etappen.forEach((e, i) => {
    ['von', 'nach'].forEach(k => T.orte[e[k]] || bad(`${t.id}/${i}: Ort ${e[k]} fehlt in orte`));
    if (T.orte[e.von] && sm(T.orte[e.von].pos, e.wp[0]) > .5) bad(`${t.id}/${i}: Start passt nicht zu ${e.von}`);
    if (T.orte[e.nach] && sm(T.orte[e.nach].pos, e.wp[e.wp.length - 1]) > .5) bad(`${t.id}/${i}: Ziel passt nicht zu ${e.nach}`);
    if (i && t.etappen[i - 1].nach !== e.von) bad(`${t.id}/${i}: Etappe beginnt nicht am Ziel der vorigen`);
    let len = 0;
    for (let k = 1; k < e.wp.length; k++) {
      const a = e.wp[k - 1], b = e.wp[k], d = sm(a, b); len += d;
      for (let f = 0; f <= 1; f += .1 / Math.max(d, .1)) {
        const p = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        if (sm(p, e.wp[0]) < .3 || sm(p, e.wp[e.wp.length - 1]) < .3) continue;
        if (land.some(P => inPoly(xy(p), P))) { bad(`${t.id}/${i}: Route über Land bei ${p.map(v => v.toFixed(2))}`); break; }
      }
    }
    L += len;
  });
  console.log(`${t.stufe.padEnd(14)} ${t.name.padEnd(34)} ${t.etappen.length} Etappe(n), ${L.toFixed(1)} sm`);
}
if (E) {
  const ids = new Set();
  for (const e of E.ereignisse) {
    if (ids.has(e.id)) bad('Ereignis doppelt: ' + e.id); ids.add(e.id);
    if (!['handlung', 'erkennen', 'wetter'].includes(e.art)) bad(e.id + ': art');
    if (!(e.zeit >= 10 && e.zeit <= 90)) bad(e.id + ': zeit');
    if (e.opts && !(e.ok >= 0 && e.ok < e.opts.length)) bad(e.id + ': ok');
    if (e.ref && !/^(sbf|sks):/.test(e.ref)) bad(e.id + ': ref');
    (e.wenn && e.wenn.ausr || []).concat(e.hilft ? [e.hilft.teil] : []).forEach(a => A && !ausr.has(a) && bad(e.id + ': Ausrüstung ' + a));
  }
  console.log(E.ereignisse.length + ' Ereignisse');
}
console.log(err ? err + ' Fehler' : 'Alles in Ordnung');
process.exit(err ? 1 : 0);
