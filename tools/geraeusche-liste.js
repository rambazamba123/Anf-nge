/* Seite „Geräusche“ (VISION.md M21, H4): sucht im Code, welches Geräusch aus AUD.files wo benutzt wird,
   und schreibt data/geraeusche-app.json. Grün = benutzt (mit Stellen), rot = unbenutzt.
   Aufruf: node tools/geraeusche-liste.js   (nach neuen Tönen oder Umbauten erneut laufen lassen) */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = Object.fromEntries([...html.match(/const FILES = \{([\s\S]*?)\};/)[1].matchAll(/['"]?([\w-]+)['"]?\s*:\s*'(audio\/[^']+)'/g)].map(m => [m[1], m[2]]));
const quellen = ['index.html', ...fs.readdirSync(root).filter(f => /\.js$/.test(f) && f !== 'sw.js')];
const code = Object.fromEntries(quellen.map(f => [f, fs.readFileSync(path.join(root, f), 'utf8').replace(/const FILES = \{[\s\S]*?\};/, '')]));
/* Wofür ein Geräusch da ist (kurz, für Menschen); fehlt ein Eintrag, steht nur die Fundstelle da */
const ZWECK = {
  'musik-intro': 'Musik im Intro', 'musik-lernen': 'Musik beim Lernen', 'musik-deck': 'Musik an Deck', 'musik-abend': 'Musik am Abend',
  wellen: 'Meer an Deck und in der Kajüte', wind: 'Wind bei frischem Wetter', windLeise: 'leiser Wind', regen: 'Regen', uhr: 'Ticken bei Prüfungen und Denkpausen',
  segel: 'Segel schlagen', glocke: 'Schiffsglocke (Glasen)', moewe: 'Möwen', nebelhornFern: 'Nebelhorn in der Ferne', nebelhorn: 'Nebelhorn',
  katze: 'Bordkatze miaut', papagei: 'Klabauter', funkRauschen: 'Funkgerät rauscht', funkSuchen: 'Funk sucht Kanal', piep: 'Piep',
  schritte: 'Schritte in die Kajüte', tuerAuf: 'Tür oder Kiste geht auf', klopfen: 'Klopfen', streichholz: 'Streichholz', feuerzeug: 'Feuerzeug',
  paffen: 'Hinnerk pafft', buchAuf: 'Buch geht auf', blaettern: 'Blättern, Karte am Kartentisch', sturm: 'Sturm', motorboot: 'Motorboot fährt vorbei',
  schnurren: 'Katze schnurrt', anker: 'Anker', bleistift: 'Bleistift auf der Karte', enttaeuschung: 'Enttäuschung', falsch: 'falsche Antwort', richtig: 'richtige Antwort',
  motorStart: 'Motor startet', motorLauf: 'Motor läuft (Fahrt, Manöver)'
};
const liste = Object.entries(files).map(([name, datei]) => {
  const re = new RegExp(`['"\`]${name.replace(/[-]/g, '\\-')}['"\`]`, 'g');
  const wo = quellen.filter(f => re.test(code[f]));
  return {name, datei, zweck: ZWECK[name] || '', benutzt: wo.length > 0, wo};
});
const bekannt = new Set(Object.values(files));
fs.readdirSync(path.join(root, 'audio')).filter(f => /\.mp3$/.test(f) && !bekannt.has('audio/' + f)).forEach(f => liste.push({name: f.replace(/\.mp3$/, ''), datei: 'audio/' + f, zweck: '', benutzt: false, wo: []}));
fs.writeFileSync(path.join(root, 'data/geraeusche-app.json'), JSON.stringify({_hinweis: 'Erzeugt mit node tools/geraeusche-liste.js', liste}, null, 1) + '\n');
console.log(`${liste.length} Geräusche, ${liste.filter(x => x.benutzt).length} benutzt, unbenutzt: ${liste.filter(x => !x.benutzt).map(x => x.name).join(', ') || 'keins'}`);
