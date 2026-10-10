/* Zeigt, welche Quellen in quellen/ liegen und welche für Etappe 2 noch fehlen (siehe docs/quellen.md).
   Aufruf: node tools/quellen-check.js */
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'quellen');
const SOLL = ['pruefungsrichtlinie', 'spfv', 'elwis-nutzung', 'sbf-see-katalog', 'sbf-see-navigationsaufgaben', 'kvr', 'seeschstro', 'betonnung', 'sbf-binnen-katalog', 'binschstro', 'sks-katalog', 'sks-kartenaufgaben', 'sks-praxis-richtlinie'];
const da = fs.existsSync(dir) ? fs.readdirSync(dir).map(f => f.toLowerCase()) : [];
if (!da.length) console.log('Der Ordner quellen/ fehlt oder ist leer.');
for (const s of SOLL) console.log((da.some(f => f.startsWith(s)) ? '✓ ' : '✗ ') + s);
const fremd = da.filter(f => !SOLL.some(s => f.startsWith(s)));
if (fremd.length) console.log('\nWeitere Dateien (bitte zuordnen):\n' + fremd.map(f => '  ' + f).join('\n'));
