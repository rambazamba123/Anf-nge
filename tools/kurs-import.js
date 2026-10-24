/* Kajütenfunk-Folgen aus der App einbauen (kurs.js → „📦 ZIP speichern“).
   Aufruf: node tools/kurs-import.js [ordner]   (Standard: import/)
   - entpackt jede kurs-*.zip, liest ablauf.json (folge, modell, stimmen, dateien)
   - legt die Folge nach audio/kurs/<folge>/ (alte Dateien dieser Folge werden ersetzt)
   - geraeusche-*.zip (kurs.js → „⬇ Alle als ZIP“): legt jedes <id>.mp3, das in podcast/geraeusche.json steht, nach
     podcast/geraeusche/ und trägt dort „datei“ ein; dann nimmt die App diese Datei und niemand muss das Geräusch neu erzeugen
   Danach hört jeder die Folge ohne eigenen Schlüssel. Braucht das Programm unzip. */
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process'), os = require('os');
const root = path.resolve(__dirname, '..'), dir = path.resolve(root, process.argv[2] || 'import');
const zips = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^(kurs|geraeusche)-.*\.zip$/i.test(f)).sort().map(f => path.join(dir, f)) : [];
if (!zips.length) { console.log('Keine kurs-*.zip oder geraeusche-*.zip in ' + dir); process.exit(0); }
/* podcast/geraeusche.json zurückschreiben, ein Geräusch je Zeile wie bisher */
function geraeuscheSchreiben(datei, gd) {
  const kurz = v => JSON.stringify(v).replace(/^\{|\}$/g, '').replace(/","/g, '", "').replace(/":/g, '": ').replace(/,"(?=[a-z_]+":)/g, ', "');
  const zeilen = Object.entries(gd.geraeusche).map(([id, g]) => `  ${JSON.stringify(id)}: {${kurz(g)}}`);
  const kopf = Object.entries(gd).filter(([k]) => k !== 'geraeusche').map(([k, v]) => ` ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
  fs.writeFileSync(datei, `{\n${kopf.join('\n')}\n "geraeusche": {\n${zeilen.join(',\n')}\n }\n}\n`);
}
for (const z of zips) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kurs-'));
  execFileSync('unzip', ['-q', '-o', z, '-d', tmp]);
  if (/^geraeusche-/i.test(path.basename(z))) {
    const gdDatei = path.join(root, 'podcast/geraeusche.json'), gd = JSON.parse(fs.readFileSync(gdDatei, 'utf8')), out = path.join(root, 'podcast/geraeusche');
    fs.mkdirSync(out, {recursive: true}); let n = 0;
    for (const f of fs.readdirSync(tmp).filter(f => /^[\w-]+\.mp3$/.test(f))) {
      const id = f.replace(/\.mp3$/, ''); if (!gd.geraeusche[id]) { console.log(`  ${f}: steht nicht in podcast/geraeusche.json, übersprungen`); continue; }
      fs.copyFileSync(path.join(tmp, f), path.join(out, f)); gd.geraeusche[id].datei = `podcast/geraeusche/${f}`; n++;
    }
    geraeuscheSchreiben(gdDatei, gd);
    fs.rmSync(tmp, {recursive: true, force: true});
    console.log(`${path.basename(z)}: ${n} Geräusche nach podcast/geraeusche/, „datei“ in podcast/geraeusche.json eingetragen`);
    continue;
  }
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
