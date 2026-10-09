/* Stimmenpaket direkt hier erzeugen (ohne Handy und ZIP).
   Voraussetzung: Umgebungsvariable ELEVENLABS_API_KEY und Netzwerkfreigabe für api.elevenlabs.io.
   Aufruf: node tools/stimmenpaket.js            → zeigt nur, was fehlt und was es kostet
           node tools/stimmenpaket.js --los      → erzeugt die fehlenden Sätze nach audio/stimmen/
           Option --sparsam: Flash-Modell (etwa halbe Credits) statt Multilingual
           Option --teil1: nur feste Sätze, ohne Folgen (Teil 2 kommt nach der Überarbeitung der Folgen)
           Option --probe: erzeugt nur drei Probesätze nach import/probe/ (nicht ins Paket), zum Anhören
           Option --modelle: listet die verfügbaren ElevenLabs-Modelle (welches spricht Deutsch am besten?)
           Option --modell=<id>: anderes Modell verwenden
   Der Schlüssel wird nie ausgegeben oder gespeichert. Braucht Playwright (Chromium) und curl. */
const fs = require('fs'), path = require('path'), http = require('http'), {execFileSync} = require('child_process');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'audio/stimmen'), manPath = path.join(out, 'manifest.json');
const KEY = (process.env.ELEVENLABS_API_KEY || '').trim(), LOS = process.argv.includes('--los'), MODEL = (process.argv.find(a => a.startsWith('--modell=')) || '').slice(9) || (process.argv.includes('--sparsam') ? 'eleven_flash_v2_5' : 'eleven_multilingual_v2'),
  TEIL1 = process.argv.includes('--teil1') || process.argv.includes('--probe'), PROBE = process.argv.includes('--probe');
const curl = (args, input) => execFileSync('curl', ['-sS', '--fail-with-body', '-H', 'xi-api-key: ' + KEY, ...args], {input, maxBuffer: 64e6});
const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/json'};
(async () => {
  if (process.argv.includes('--modelle')) { if (!KEY) return console.log('ELEVENLABS_API_KEY fehlt.'); const m = JSON.parse(curl(['https://api.elevenlabs.io/v1/models']).toString()); m.forEach(x => console.log(`${x.model_id}: ${x.name}${(x.languages || []).some(l => l.language_id === 'de') ? ' (Deutsch)' : ''}`)); return; }
  const man = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, 'utf8')) : {};
  man.files = man.files || {}; man.texts = man.texts || {}; man.voices = man.voices || {};
  /* 1. Die App selbst liefert die Liste aller festen Sätze (packLines), für alle Kurse */
  const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, {'content-type': MIME[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(r); }).listen(0);
  const port = srv.address().port, {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch(), page = await b.newPage();
  await page.addInitScript(() => localStorage.setItem('skipper-sbfsee-v1', JSON.stringify({profile: {name: 'Paket', exam: '2030-01-01', minutes: 30}, introV5: true, introDone: true, cabinWelcome: true, cfg: {ki: true}})));
  await page.goto(`http://localhost:${port}/index.html`); await page.waitForFunction(() => typeof packLines === 'function' && typeof EPISODES !== 'undefined' && EPISODES.sbf && EPISODES.sbf.length);
  let voices = man.voices;
  if (!Object.keys(voices).length) {
    if (!KEY) { console.log('Ohne ELEVENLABS_API_KEY kann ich die Stimmen nicht festlegen.'); }
    else { const j = JSON.parse(curl(['https://api.elevenlabs.io/v1/voices']).toString()); const list = (j.voices || []).map(v => ({id: v.voice_id, name: v.name, labels: v.labels || {}}));
      voices = await page.evaluate(list => { S.voices = {}; VOX.autoAssign(list); const v = {}; SPRECHER.forEach(id => { if (S.voices[id]) v[id] = S.voices[id]; }); return v; }, list); }
  }
  const lines = await page.evaluate(async teil1 => { try { await loadNavi(); } catch (e) {} const all = [], seen = new Set();
    for (const c of Object.keys(COURSES)) { activateCourse(c); packLines(!teil1).forEach(l => { const k = PACK.key(l.cid, l.t); if (!seen.has(k)) { seen.add(k); all.push({...l, k}); } }); }
    return all; }, TEIL1);
  await b.close(); srv.close();
  /* Probe: ein kurzer Satz je Sprecher plus das gezogene Moin, nur zum Anhören */
  const probe = ['hinnerk', 'smilla', 'klabauter'].map(c => lines.find(l => l.cid === c && l.t.length > 30)).filter(Boolean).concat(lines.filter(l => /mo{6,}in/i.test(l.t)).slice(0, 1));
  const todo = PROBE ? probe : lines.filter(l => !man.files[l.k]), chars = todo.reduce((a, l) => a + l.t.length, 0);
  console.log(`Feste Sätze: ${lines.length}, im Paket: ${lines.length - todo.length}, fehlen: ${todo.length} (${chars.toLocaleString('de-DE')} Zeichen, Modell ${MODEL}).`);
  if (!LOS) return console.log('Nur angezeigt. Mit --los werden die fehlenden Sätze erzeugt.');
  if (!KEY) return console.log('ELEVENLABS_API_KEY fehlt.');
  man.voices = voices; let ok = 0;
  for (const [i, l] of todo.entries()) {
    const v = voices[l.cid]; if (!v) { console.log('Keine Stimme für ' + l.cid); continue; }
    const body = JSON.stringify({text: l.t, model_id: MODEL, ...(MODEL === 'eleven_flash_v2_5' ? {language_code: 'de'} : {}), voice_settings: {stability: .45, similarity_boost: .78, style: MODEL === 'eleven_multilingual_v2' ? .3 : 0, use_speaker_boost: true}});
    try {
      const mp3 = curl(['-X', 'POST', '-H', 'content-type: application/json', '-H', 'accept: audio/mpeg', '--data-binary', '@-', `https://api.elevenlabs.io/v1/text-to-speech/${v}?output_format=mp3_44100_64`], body);
      if (PROBE) { const pd = path.join(root, 'import/probe'); fs.mkdirSync(pd, {recursive: true}); fs.writeFileSync(path.join(pd, `${i + 1}-${l.cid}.mp3`), mp3); console.log(`Probe ${i + 1}: ${l.cid}: ${l.t}`); ok++; continue; }
      fs.writeFileSync(path.join(out, l.k + '.mp3'), mp3); man.files[l.k] = l.k + '.mp3'; man.texts[l.k] = l.cid + ': ' + l.t; ok++;
    } catch (e) { console.log(`Fehler bei Satz ${i + 1}: ${String(e.stdout || e.message).slice(0, 200)}`); if (/quota|credit/i.test(String(e.stdout))) break; }
    if (ok % 25 === 0) { man.made = new Date().toISOString(); fs.writeFileSync(manPath, JSON.stringify(man, null, 1)); console.log(`${i + 1} von ${todo.length}…`); }
  }
  if (PROBE) return console.log(`Probe fertig: ${ok} Dateien in import/probe/ (nicht im Paket).`);
  man.made = new Date().toISOString(); fs.writeFileSync(manPath, JSON.stringify(man, null, 1));
  console.log(`Fertig: ${ok} Sätze erzeugt. Danach __ver und sw.js hochzählen und committen.`);
})().catch(e => { console.error(e.message); process.exit(1); });
