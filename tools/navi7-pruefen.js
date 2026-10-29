/* Prüft data/navi7.json gegen data/karte7.json: Jedes Objekt muss es geben, jede Aufgabe einen Typ, jeder Platzhalter einen Wert.
   Druckt die berechneten Lösungen zur Durchsicht. Aufruf: node tools/navi7-pruefen.js [--liste] */
const fs = require('fs'), path = require('path'), root = path.resolve(__dirname, '..');
const K = JSON.parse(fs.readFileSync(path.join(root, 'data/karte7.json'), 'utf8')), D = JSON.parse(fs.readFileSync(path.join(root, 'data/navi7.json'), 'utf8'));
const O = {}; K.objekte.forEach(o => { O[o.id] = o; });
const cos = K.lin.sx / K.lin.sy, kd = (a, b) => { const dy = b.lat - a.lat, dx = (b.lon - a.lon) * cos; return {k: (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360, d: Math.hypot(dx, dy)}; };
const TYPEN = ['tippe', 'position', 'kreuz', 'distanz', 'kurs', 'zeit', 'fahrt', 'strecke', 'koppel', 'mw', 'umrechnen'];
const fehler = [], ids = new Set();
D.aufgaben.forEach(a => {
  if (ids.has(a.id)) fehler.push('doppelte Id ' + a.id); ids.add(a.id);
  if (!TYPEN.includes(a.typ)) fehler.push(`${a.id}: Typ ${a.typ} unbekannt`);
  if (!D.stufen[a.stufe]) fehler.push(`${a.id}: Stufe ${a.stufe} unbekannt`);
  [a.von, a.bis, a.obj, a.ziel].filter(Boolean).forEach(id => { if (!O[id]) fehler.push(`${a.id}: Objekt „${id}“ fehlt`); });
  if (!a.text || !a.richtig) fehler.push(`${a.id}: Text oder Antwort fehlt`);
  const bekannt = ['d', 'k', 'a', 'b', 'sol', 'pos', 'kn', 'min', 'sm', 'kurs', 'wert', 'mw', 'jahr', 'name', 'bed', 'kenn', 'farbe', 'topp'];
  [a.text, a.richtig, a.falsch, a.loesung].filter(Boolean).forEach(t => (t.match(/\{(\w+)\}/g) || []).forEach(m => { if (!bekannt.includes(m.slice(1, -1))) fehler.push(`${a.id}: Platzhalter ${m} unbekannt`); }));
  if (process.argv.includes('--liste') && a.von && a.bis) { const r = kd(O[a.von], O[a.bis]); console.log(`${a.id}: ${a.von} → ${a.bis}: ${Math.round(r.k)}°, ${r.d.toFixed(2)} sm`); }
});
if (fehler.length) { console.error('Navi 7: ' + fehler.length + ' Fehler\n- ' + fehler.join('\n- ')); process.exit(1); }
console.log(`Navi 7 in Ordnung: ${D.aufgaben.length} Aufgaben in ${new Set(D.aufgaben.map(a => a.stufe)).size} Stufen.`);
