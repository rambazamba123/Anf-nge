#!/usr/bin/env node
/* Karte = Welt (docs/reise.md HR51): Orte im Reiseplan und in den Folgen müssen auf der Reisekarte liegen,
   die Routen der Tage schließen aneinander an, und die Fahrzeiten in den Folgen passen zur Distanz.
   Aufruf: node tools/karte-pruefen.js        (Fehler → Exit 1)
           node tools/karte-pruefen.js --tabelle (Distanzen und Fahrzeiten je Tag ausgeben) */
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const B = require('../brede.js');
const K = JSON.parse(fs.readFileSync(R('data/karte-brede.json'), 'utf8'));
B.setzen(K);
const plan = JSON.parse(fs.readFileSync(R('data/reiseplan.json'), 'utf8'));
const fehler = [], hinweise = [];
/* Orte ohne festen Punkt auf der Karte: an Bord, auf See, Wetter */
const FREI = ['Kajüte', 'Kartentisch', 'Offene See', 'Nebelbank', 'Ansteuerung bei Nacht', 'An Bord des Segelschiffs', 'Ankerplatz', 'Zeitraffer', 'Steg', 'Tankstelle', 'Hafenbecken', 'Ausfahrt', 'Einfahrt', 'Kanalhafen', 'Hafen', 'Vor', 'Fahrwasser', 'Tonnenkette', 'Schleusenkammer', 'Priel', 'Wrackgebiet', 'Watt', 'Fluss', 'Ankerbucht', 'Kanal', 'Strom', 'Sturm', 'See'];
const namen = [];
K.orte.forEach(o => { namen.push(o.name); namen.push(o.name.replace(/^(Schleuse|Leuchtturm|Reede) /, '')); });
const kennt = teil => namen.some(n => teil.includes(n));
const nurFrei = teil => teil.replace(/[(),]/g, ' ').split(/\s+/).filter(Boolean).every(w => FREI.some(f => f.split(' ').includes(w)) || /^(im|am|an|der|des|die|nach|in|und|bei|von)$/.test(w));
plan.tage.forEach(t => {
  t.folgen.forEach(f => {
    String(f.ort || '').split(/,|→/).map(s => s.trim()).filter(Boolean).forEach(teil => {
      if (!kennt(teil) && !nurFrei(teil)) fehler.push(`${f.id}: Ort „${teil}“ fehlt auf der Reisekarte (data/karte-brede.json orte)`);
    });
  });
  String(t.ort || '').split('→').map(s => s.trim()).forEach(teil => { if (!kennt(teil) && !nurFrei(teil)) fehler.push(`Tag ${t.nr}: Ort „${teil}“ fehlt auf der Reisekarte`); });
});
/* Routen: Tag n endet, wo Tag n+1 beginnt; jede Route beginnt und endet an einem Ort */
const tage = Object.keys(K.routen).map(Number).sort((a, b) => a - b);
tage.forEach((t, i) => {
  const r = K.routen[t], weiter = K.routen[tage[i + 1]];
  if (weiter && (r[r.length - 1][0] !== weiter[0][0] || r[r.length - 1][1] !== weiter[0][1])) fehler.push(`Route Tag ${t} endet nicht dort, wo Tag ${tage[i + 1]} beginnt`);
  const naechster = p => K.orte.map(o => ({o, d: Math.hypot(o.x - p[0], o.y - p[1])})).sort((a, b) => a.d - b.d)[0];
  const z = naechster(r[r.length - 1]); if (z.d > 12) fehler.push(`Route Tag ${t} endet an keinem Ort (nächster: ${z.o.name}, ${(z.d / K.massstab.einheitenJeSm).toFixed(1)} sm weg)`);
});
const laenge = r => r.slice(1).reduce((s, p, i) => s + B.sm(r[i], p), 0);
/* Fahrzeiten in den Folgen: „N Meilen“ / „N Seemeilen“ in einem Folgenskript gegen die Tagesstrecke (grob, nur Hinweis) */
const ZAHL = {eins: 1, ein: 1, eine: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, fünfzehn: 15, zwanzig: 20};
const ordner = R('podcast/folgen');
fs.readdirSync(ordner).filter(d => /^reise-\d+-\d+\.md$/.test(d)).forEach(d => {
  const tag = Number(d.split('-')[1]), txt = fs.readFileSync(path.join(ordner, d), 'utf8').split(/<!--\s*FOLGENBLATT[\s\S]*?-->/).join('');
  const r = K.routen[tag]; if (!r) return;
  const soll = laenge(r);
  for (const m of txt.matchAll(/\b(\w+)(?: und 'n halb| einhalb)? (?:See)?[Mm]eilen\b/g)) {
    const n = ZAHL[m[1].toLowerCase()] || Number(m[1]); if (!n) continue;
    if (n > soll * 1.6 + 1) fehler.push(`${d}: „${m[0]}“, aber die ganze Tagesstrecke ${tag} ist nur ${soll.toFixed(1)} sm lang`);
  }
  /* Ortsnamen, die es auf der Karte nicht gibt (alte Namen) */
  ['Kliev', 'Schlei', 'Arnis', 'Kappeln', 'Helgoland', 'Elbe'].forEach(alt => { if (new RegExp('\\b' + alt + '\\b').test(txt)) fehler.push(`${d}: alter Ortsname „${alt}“ (gibt es auf der Reisekarte nicht)`); });
});
if (process.argv.includes('--tabelle')) {
  console.log('Tag | Strecke | bei 5 kn | bei 6 kn');
  tage.forEach(t => { const l = laenge(K.routen[t]), z = v => { const m = Math.round(l / v * 60); return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`; }; console.log(`${t} | ${l.toFixed(1)} sm | ${z(5)} | ${z(6)}`); });
}
hinweise.forEach(h => console.log('Hinweis: ' + h));
if (fehler.length) { fehler.forEach(f => console.log('FEHLER: ' + f)); process.exit(1); }
console.log(`Karte = Welt: ${K.orte.length} Orte, ${tage.length} Tagesrouten, Reiseplan und Folgen passen.`);
