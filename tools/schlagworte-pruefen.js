#!/usr/bin/env node
/* Schlagworte zu den amtlichen Fragen (v5.64, Nutzer 14.11.2026)
   data/schlagworte-sbf.json: {v, hinweis, q: {"n": {t: Thema, a: [ein Schlagwort je Antwort, gleiche Reihenfolge wie data/sbf.json]}}}
   Gebraucht für „Frage in Fahrt“ (kurs.js): großes Bild, Frage wird vorgelesen, Knöpfe A–D zeigen nur die Schlagworte.
   Prüft: jede Frage hat einen Eintrag, je Antwort ein Schlagwort, nichts leer, keine zwei gleich, höchstens 34 Zeichen.
   node tools/schlagworte-pruefen.js            prüfen
   node tools/schlagworte-pruefen.js --bauen D  baut die Datei neu aus Textdateien (Zeilen n|Thema|A|B|C|D) in Ordner D */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..'), Q = JSON.parse(fs.readFileSync(path.join(R, 'data/sbf.json'), 'utf8')), DATEI = path.join(R, 'data/schlagworte-sbf.json');
const MAX = 34, arg = process.argv.slice(2);
if (arg[0] === '--bauen') {
  const ordner = arg[1], q = {};
  for (const f of fs.readdirSync(ordner).filter(f => /\.txt$/.test(f)).sort()) for (const z of fs.readFileSync(path.join(ordner, f), 'utf8').split('\n')) {
    if (!/^\d+\|/.test(z)) continue; const [n, t, ...a] = z.split('|').map(s => s.trim()); q[n] = {t, a}; }
  fs.writeFileSync(DATEI, JSON.stringify({v: 1, hinweis: 'Schlagworte zu den SBF-See-Fragen für „Frage in Fahrt“. Von Claude vergeben, aus den Antworttexten in data/sbf.json abgeleitet, ohne quellen/ geprüft. Reihenfolge wie die Antworten in data/sbf.json (a[0] ist die richtige).', q}, null, 0).replace(/\},"/g, '},\n"') + '\n');
}
const D = JSON.parse(fs.readFileSync(DATEI, 'utf8')), fehler = [];
for (const f of Q) {
  const e = D.q[f.n]; if (!e) { fehler.push(`${f.n}: kein Eintrag`); continue; }
  if (!e.t) fehler.push(`${f.n}: Thema fehlt`);
  if (!Array.isArray(e.a) || e.a.length !== f.a.length) { fehler.push(`${f.n}: ${e.a ? e.a.length : 0} Schlagworte, aber ${f.a.length} Antworten`); continue; }
  e.a.forEach((s, i) => { if (!s) fehler.push(`${f.n}: Antwort ${'ABCD'[i]} ohne Schlagwort`); else if (s.length > MAX) fehler.push(`${f.n}: „${s}“ ist länger als ${MAX} Zeichen`); });
  if (new Set(e.a.map(s => s.toLowerCase())).size !== e.a.length) fehler.push(`${f.n}: zwei Schlagworte sind gleich`);
}
for (const n of Object.keys(D.q)) if (!Q.some(f => String(f.n) === n)) fehler.push(`${n}: Eintrag ohne Frage`);
if (fehler.length) { console.log(fehler.join('\n')); console.log(`Schlagworte: ${fehler.length} Fehler`); process.exit(1); }
console.log(`Schlagworte: ${Object.keys(D.q).length} Fragen in Ordnung`);
