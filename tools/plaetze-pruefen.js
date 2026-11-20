#!/usr/bin/env node
/* Plätze am Boot prüfen (v5.73, docs/baukasten.md; Nutzer 20.11.2026: „damit sich Animationen und Zusätze nicht im Weg sind“).
   - Kein Platz überdeckt einen anderen (Freiräume r dürfen sich höchstens um 3 Einheiten berühren).
   - Keine Crew-Stelle (BOOT.PLATZ) liegt im Freiraum eines Platzes.
   - Jedes Teil hängt an einem bekannten Platz und hat eine Zeichnung für die Seite (oder oben).
   - Jeder Platz ist in mindestens drei Ansichten eingebaut.
   Aufruf: node tools/plaetze-pruefen.js   (pre-commit, wenn boot.js geändert ist) */
const fs = require('fs'), path = require('path');
global.window = global; global.document = {getElementById: () => true, createElement: () => ({}), head: {appendChild() {}}};
new Function(fs.readFileSync(path.join(__dirname, '..', 'boot.js'), 'utf8'))();
const B = global.BOOT, fehler = [], hinweise = [];
const BLICKE = ['seite', 'heck', 'oben', 'd34'];
const P = Object.entries(B.PLAETZE);
for (const bl of BLICKE) {
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
    const [an, a] = P[i], [bn, b] = P[j]; if (!a[bl] || !b[bl]) continue;
    const d = Math.hypot(a[bl][0] - b[bl][0], a[bl][1] - b[bl][1]), min = a.r + b.r - 3;
    /* in der Draufsicht stehen Plätze in verschiedener Höhe übereinander; dort nur bei gleicher Höhe prüfen */
    if (bl === 'oben' && Math.abs(a.hs - b.hs) > .15) continue;
    if ((B.ERLAUBT[bl] || []).some(([x, y]) => (x === an && y === bn) || (x === bn && y === an))) continue;
    if (d < min) fehler.push(`${bl}: Platz „${a.name}“ und „${b.name}“ überdecken sich (Abstand ${d.toFixed(1)}, nötig ${min})`);
  }
  for (const [cn, c] of Object.entries(B.PLATZ[bl] || {})) for (const [pn, p] of P) {
    if (!p[bl] || (B.ERLAUBT.crew || {})[cn] === pn) continue; const d = Math.hypot(c[0] - p[bl][0], c[1] - p[bl][1]);
    if (d < p.r) hinweise.push(`${bl}: Crew-Stelle „${cn}“ liegt im Freiraum von „${p.name}“ (Abstand ${d.toFixed(1)} < ${p.r})`);
  }
}
for (const [tn, t] of Object.entries(B.TEILE)) {
  if (!B.PLAETZE[t.platz]) fehler.push(`Teil „${tn}“ hängt an unbekanntem Platz „${t.platz}“`);
  if (!t.seite && !t.oben) fehler.push(`Teil „${tn}“ hat keine Zeichnung`);
}
for (const [pn, p] of P) { const n = BLICKE.filter(bl => p[bl]).length; if (n < 3) hinweise.push(`Platz „${p.name}“ nur in ${n} Ansichten`); }
hinweise.forEach(h => console.log('Hinweis: ' + h)); fehler.forEach(f => console.log('FEHLER: ' + f));
console.log(`Plätze: ${P.length}, Teile: ${Object.keys(B.TEILE).length}, ${fehler.length} Fehler, ${hinweise.length} Hinweise.`);
process.exit(fehler.length ? 1 : 0);
