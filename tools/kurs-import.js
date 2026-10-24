/* Kajütenfunk-Folgen aus der App einbauen (kurs.js → „📦 ZIP speichern“).
   Aufruf: node tools/kurs-import.js [ordner]   (Standard: import/)
   - entpackt jede kurs-*.zip, liest ablauf.json (folge, modell, stimmen, dateien)
   - legt die Folge nach audio/kurs/<folge>/ (alte Dateien dieser Folge werden ersetzt)
   Danach hört jeder die Folge ohne eigenen Schlüssel. Braucht das Programm unzip. */
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process'), os = require('os');
const root = path.resolve(__dirname, '..'), dir = path.resolve(root, process.argv[2] || 'import');
const zips = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^kurs-.*\.zip$/i.test(f)).sort().map(f => path.join(dir, f)) : [];
if (!zips.length) { console.log('Keine kurs-*.zip in ' + dir); process.exit(0); }
for (const z of zips) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kurs-'));
  execFileSync('unzip', ['-q', '-o', z, '-d', tmp]);
  const ab = JSON.parse(fs.readFileSync(path.join(tmp, 'ablauf.json'), 'utf8'));
  if (!/^[\w-]+$/.test(ab.folge || '')) { console.log(`${z}: ungültige Folge „${ab.folge}“, übersprungen.`); continue; }
  const out = path.join(root, 'audio/kurs', ab.folge);
  fs.rmSync(out, {recursive: true, force: true}); fs.mkdirSync(out, {recursive: true});
  let n = 0, bytes = 0;
  for (const f of Object.values(ab.dateien || {})) {
    if (!/^[\w-]+\.mp3$/.test(f)) continue;
    const src = path.join(tmp, f); if (!fs.existsSync(src)) { console.log(`  fehlt im ZIP: ${f}`); continue; }
    fs.copyFileSync(src, path.join(out, f)); n++; bytes += fs.statSync(src).size;
  }
  fs.writeFileSync(path.join(out, 'ablauf.json'), JSON.stringify(ab, null, 1));
  const idx = path.join(root, 'audio/kurs/index.json'), ix = fs.existsSync(idx) ? JSON.parse(fs.readFileSync(idx, 'utf8')) : {folgen: {}};
  ix.folgen = ix.folgen || {}; ix.folgen[ab.folge] = {skript: ab.skript, teile: n, erzeugt: ab.erzeugt || null};
  fs.writeFileSync(idx, JSON.stringify(ix, null, 1) + '\n');
  fs.rmSync(tmp, {recursive: true, force: true});
  console.log(`${path.basename(z)}: Folge „${ab.folge}“ mit ${n} Teilen (${(bytes / 1048576).toFixed(1)} MB) nach audio/kurs/${ab.folge}/`);
}
console.log('Danach: ZIPs aus import/ löschen, __ver und sw.js hochzählen, committen.');
