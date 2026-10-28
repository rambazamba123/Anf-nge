/* Rettungsboot (VISION.md H1): legt eine alte App-Version unter alt/ ab, damit sie online spielbar bleibt.
   Aufruf: node tools/alt-version.js [git-ref]   (Standard: c0f7068 = v4.95)
   - holt den Stand mit git archive (ohne audio/, tests/, tools/, docs/, import/ und Texte, die die App nicht lädt)
   - Töne werden nicht kopiert (47 MB): alle Pfade 'audio/…' zeigen auf ../audio/ der aktuellen Version
   - die alte Version hat ihren eigenen Service Worker mit Bereich alt/ und denselben Spielstand (localStorage),
     deshalb gilt R7 weiter: neue Felder immer mit Standardwert, nichts umbenennen */
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process'), os = require('os');
const root = path.resolve(__dirname, '..'), ref = process.argv[2] || 'c0f7068', out = path.join(root, 'alt');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'alt-'));
const tar = path.join(tmp, 'a.tar');
execFileSync('git', ['-C', root, 'archive', '-o', tar, ref]);
const x = path.join(tmp, 'x'); fs.mkdirSync(x);
execFileSync('tar', ['-xf', tar, '-C', x]);
const weg = ['audio', 'tests', 'tools', 'docs', 'import', 'alt', '.githooks', 'quellen'];
for (const d of weg) fs.rmSync(path.join(x, d), {recursive: true, force: true});
for (const f of fs.readdirSync(x)) if (/\.md$/i.test(f) || f === '.gitignore' || f === 'skipperlegend') fs.rmSync(path.join(x, f), {force: true});
fs.rmSync(out, {recursive: true, force: true});
fs.cpSync(x, out, {recursive: true});
/* Tonpfade auf die aktuelle Version umbiegen, MIME-Typen wie 'audio/mpeg' bleiben */
const umbiegen = s => s.replace(/(['"`])audio\/(?!(?:mpeg|webm|wav|ogg|mp4|aac)\b)/g, '$1../audio/');
let n = 0;
for (const f of fs.readdirSync(out).filter(f => /\.(html|js)$/.test(f))) {
  const p = path.join(out, f), a = fs.readFileSync(p, 'utf8'), b = umbiegen(a);
  if (a !== b) { fs.writeFileSync(p, b); n++; }
}
/* Hinweis oben im Bild, damit man die alte Version nicht mit der neuen verwechselt */
const idx = path.join(out, 'index.html');
let h = fs.readFileSync(idx, 'utf8');
const ver = (h.match(/window\.__ver = '([^']+)'/) || [])[1] || ref;
h = h.replace('</body>', `<div style="position:fixed;left:8px;bottom:8px;z-index:99999;background:#2a1c10;color:#f3e3c3;font:600 12px/1.3 system-ui,sans-serif;padding:5px 9px;border-radius:9px;opacity:.85;pointer-events:none">Alte Version ${ver} (Rettungsboot)</div>\n</body>`);
h = h.replace(/<title>([^<]*)<\/title>/, '<title>$1 (alte Version)</title>');
fs.writeFileSync(idx, h);
fs.rmSync(tmp, {recursive: true, force: true});
console.log(`alt/ aus ${ref} (Version ${ver}) gebaut, Tonpfade in ${n} Dateien umgebogen.`);
