/* Stimmen-ZIPs aus der App ins Stimmenpaket einbauen.
   Aufruf: node tools/stimmen-import.js [ordner]   (Standard: import/, dazu stimmen.zip im Repo-Ordner)
   - entpackt jede *.zip, kopiert die MP3s nach audio/stimmen/
   - führt manifest.json zusammen (vorhandene Einträge bleiben, die Stimmen werden nur beim ersten Mal festgelegt)
   - eigene Kajütenfunk-Folgen (geschichten.json) landen zur Prüfung in import/geschichten-<datum>.json
   Braucht das Programm unzip. */
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process'), os = require('os');
const root = path.resolve(__dirname, '..'), dir = path.resolve(root, process.argv[2] || 'import'), out = path.join(root, 'audio/stimmen');
const manPath = path.join(out, 'manifest.json');
const man = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, 'utf8')) : {};
man.files = man.files || {}; man.texts = man.texts || {}; man.voices = man.voices || {};
/* 5.15: Auch stimmen*.zip direkt im Repo-Ordner wird eingebaut (vom Handy hochgeladen) */
const zips = (fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.zip')).sort().map(f => path.join(dir, f)) : [])
  .concat(fs.readdirSync(root).filter(f => /^stimmen.*\.zip$/i.test(f)).sort().map(f => path.join(root, f)));
if (!zips.length) { console.log('Keine ZIP-Dateien in ' + dir + ' und keine stimmen.zip im Repo-Ordner'); process.exit(0); }
fs.mkdirSync(dir, {recursive: true});
let neu = 0, alt = 0, konflikt = 0;
for (const z of zips) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stimmen-'));
  execFileSync('unzip', ['-q', '-o', z, '-d', tmp]);
  const m = JSON.parse(fs.readFileSync(path.join(tmp, 'manifest.json'), 'utf8'));
  /* Stimmen: Das erste Paket legt sie fest. Weicht ein späteres ab, werden dessen Aufnahmen nicht übernommen. */
  const mv = m.voices || {};
  if (!Object.keys(man.voices).length) man.voices = mv;
  const clash = Object.keys(mv).some(id => man.voices[id] && mv[id] && man.voices[id] !== mv[id]);
  if (clash) { console.log(`${z}: andere Stimmen als im Paket, übersprungen.`); konflikt++; continue; }
  for (const [k, f] of Object.entries(m.files || {})) {
    const src = path.join(tmp, f); if (!fs.existsSync(src)) continue;
    if (man.files[k]) { alt++; continue; }
    fs.copyFileSync(src, path.join(out, k + '.mp3')); man.files[k] = k + '.mp3'; if (m.texts && m.texts[k]) man.texts[k] = m.texts[k]; neu++;
  }
  const g = path.join(tmp, 'geschichten.json');
  if (fs.existsSync(g)) { const t = path.join(dir, 'geschichten-' + new Date().toISOString().slice(0, 10) + '.json'); fs.copyFileSync(g, t); console.log('Eigene Folgen zur Prüfung: ' + path.relative(root, t)); }
  fs.rmSync(tmp, {recursive: true, force: true});
}
man.made = new Date().toISOString();
fs.writeFileSync(manPath, JSON.stringify(man, null, 1));
console.log(`Fertig: ${neu} neue Sätze, ${alt} schon vorhanden${konflikt ? `, ${konflikt} ZIP mit abweichenden Stimmen übersprungen` : ''}. Im Paket: ${Object.keys(man.files).length}.`);
console.log('Danach: ZIPs aus import/ löschen, __ver und sw.js hochzählen, committen.');
