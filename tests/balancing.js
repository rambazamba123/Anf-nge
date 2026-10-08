/* Balancing für Törn 2.0 (CLAUDE.md 5.14): simulierte Spieler mit 40 %, 70 % und 95 % Trefferquote fahren jeden Törn.
   Ausrüstung: „grund“ = Startausrüstung, „voll“ = alle Teile und je 2 Vorräte.
   Ziel: 40 % schafft nur Landratte zuverlässig, 70 % kommt bis Seebär, Klabautermann nur mit sehr hohem Wissen und guter Ausrüstung.
   Aufruf: node tests/balancing.js [Läufe je Törn, Standard 400] */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), read = f => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8'));
const {core} = require(path.join(root, 'toern.js'));
const T = read('toerns.json'), E = read('ereignisse.json'), A = read('ausruestung.json'), K = read('karte.json');
const D = {stufen: T.stufen, orte: T.orte, toerns: T.toerns, ereignisse: E.ereignisse, gen: E.gen, tags: E.tags, fahrzeuge: E.fahrzeuge, teile: A.teile, K};
const RUNS = +process.argv[2] || 400;
const AUSR = {
  grund: {teile: new Set(A.start.teile), vorrat: A.start.vorrat},
  voll: {teile: new Set(A.teile.filter(x => x.art === 'teil').map(x => x.id)), vorrat: Object.fromEntries(A.teile.filter(x => x.art === 'vorrat').map(x => [x.id, 2]))},
};
const P = [.4, .7, .95], out = {};
for (const st of T.stufen) {
  out[st.id] = {};
  for (const [an, ausr] of Object.entries(AUSR)) for (const p of P) {
    let ok = 0, n = 0;
    for (const tn of T.toerns.filter(x => x.stufe === st.id)) for (let i = 0; i < RUNS; i++) { n++; if (core.simulate(D, tn, p, ausr.teile, ausr.vorrat, 1000 + i * 7 + tn.id.length * 131).ok) ok++; }
    out[st.id][an + ' ' + Math.round(p * 100) + '%'] = Math.round(ok / n * 100);
  }
}
const cols = Object.keys(out[T.stufen[0].id]);
console.log('Erfolgsquote in % (je Stufe gemittelt über ihre Törns, ' + RUNS + ' Läufe je Törn)\n');
console.log('Stufe'.padEnd(16) + cols.map(c => c.padStart(11)).join(''));
for (const [s, r] of Object.entries(out)) console.log(s.padEnd(16) + cols.map(c => String(r[c]).padStart(11)).join(''));
/* Ziele prüfen */
const g = (s, k) => out[s][k], fehler = [];
if (g('landratte', 'grund 40%') < 75) fehler.push('40 % sollte Landratte zuverlässig schaffen');
if (g('leichtmatrose', 'grund 40%') > 50) fehler.push('40 % sollte Leichtmatrose meist nicht schaffen');
if (g('seebaer', 'grund 70%') < 60) fehler.push('70 % sollte bis Seebär kommen');
if (g('kaphoornier', 'grund 70%') > 45) fehler.push('70 % sollte Kap-Hoornier meist nicht schaffen');
if (g('klabautermann', 'voll 95%') < 65) fehler.push('95 % mit voller Ausrüstung sollte Klabautermann meist schaffen');
if (g('klabautermann', 'grund 95%') > g('klabautermann', 'voll 95%') - 10) fehler.push('Ausrüstung sollte beim Klabautermann spürbar helfen');
if (g('klabautermann', 'voll 70%') > 25) fehler.push('70 % sollte Klabautermann kaum schaffen');
console.log('\n' + (fehler.length ? 'Ziele verfehlt:\n- ' + fehler.join('\n- ') : 'Alle Balancing-Ziele erreicht.'));
process.exit(fehler.length ? 1 : 0);
