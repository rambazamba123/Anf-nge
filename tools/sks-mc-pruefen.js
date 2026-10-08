/* Prüft data/sks-mc.json gegen den SKS-Katalog: jede Frage vorhanden, Format, Länge, Dubletten, „nur offen“ zählen.
   Aufruf: node tools/sks-mc-pruefen.js */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const sks = JSON.parse(fs.readFileSync(path.join(root, 'data/sks.json'), 'utf8')).filter(q => !q.sketch);
const mc = JSON.parse(fs.readFileSync(path.join(root, 'data/sks-mc.json'), 'utf8')).mc;
let err = 0, offen = 0, mcN = 0, lang = 0; const bad = m => { err++; console.log('FEHLER: ' + m); };
const words = s => s.split(/\s+/).length;
for (const q of sks) {
  const e = mc[q.id]; if (!e) { bad(q.id + ': fehlt'); continue; }
  if (e.offen) { offen++; continue; }
  mcN++;
  if (typeof e.r !== 'string' || !Array.isArray(e.f) || e.f.length !== 2) { bad(q.id + ': Format'); continue; }
  const all = [e.r, ...e.f];
  if (new Set(all.map(s => s.toLowerCase())).size !== 3) bad(q.id + ': doppelte Antwort');
  if (all.some(s => !s.trim() || !/[.!?“]$/.test(s.trim()))) bad(q.id + ': leere Antwort oder ohne Satzzeichen');
  if (words(e.r) > 18) lang++;
}
Object.keys(mc).forEach(k => { if (!sks.find(q => q.id === k)) bad(k + ': nicht im Katalog'); });
console.log(`${sks.length} SKS-Fragen: ${mcN} als Multiple Choice, ${offen} nur offen. Richtige Antwort über 18 Wörter: ${lang}.`);
console.log(err ? err + ' Fehler' : 'Alles in Ordnung');
process.exit(err ? 1 : 0);
