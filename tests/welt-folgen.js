/* Test der 3D-Folgen (v5.22): jede Folge einmal im Hörmodus (🎧 Auto) durchspielen, die neuen Probefolgen zusätzlich im Selbst-Modus
   mit einem „Fahrer“, der das Boot an das Ziel setzt, Motor startet, wendet und Oskar holt. Meldet Konsolenfehler und prüft das Ausbildungsheft.
   Aufruf: node tests/welt-folgen.js [folge …]  (MODUS=auto oder MODUS=selbst für nur einen Modus)   (dauert einige Minuten; nicht im pre-commit) */
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const pw = (() => { for (const p of [process.env.PLAYWRIGHT, 'playwright', '/opt/node22/lib/node_modules/playwright']) { try { if (p) return require(p); } catch (e) {} } throw new Error('Playwright fehlt'); })();
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2'};
const server = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, {'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(r); });
const stand = {profile: {name: 'Testi', exam: '2026-12-01', minutes: 30, exp: 'none', goal: 'sbf', facts: []}, introV5: true, introDone: true, cabinWelcome: true, seenCabin: true, course: 'sbf',
  crew: {K: 'hinnerk', M: 'smilla', T: 'klabauter'}, qs: {}, lessons: {}, mnemo: {}, talk: [], stories: [], cfg: {music: 0, amb: 0, sfx: 0, voice: 0, pause: 2}, best: {}, eggs: {}, tour: {boat: true, cabin: true}, freigaben: {fender: {n: 2, frei: true, d: '2026-11-01'}}, updatedAt: Date.now()};
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await new Promise(r => server.listen(0, r)); const base = `http://localhost:${server.address().port}/index.html`;
  const browser = await pw.chromium.launch({executablePath: process.env.CHROMIUM || undefined});
  const alle = JSON.parse(fs.readFileSync(root + '/data/welt-folgen.json', 'utf8')).folgen.map(f => f.id).filter(id => id !== 'probe');
  const wahl = process.argv.slice(2), M = process.env.MODUS, auftrag = (M === 'selbst' ? [] : (wahl.length ? wahl : alle).map(id => [id, 'auto'])).concat(M === 'auto' ? [] : (wahl.length ? wahl : ['motor-an', 'becken', 'tag07']).map(id => [id, 'selbst']));
  let fehlerGesamt = 0;
  for (const [id, modus] of auftrag) {
    const fehler = [], ctx = await browser.newContext({viewport: {width: 400, height: 860}}), page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|404/.test(m.text())) fehler.push('Konsole: ' + m.text()); });
    page.on('pageerror', e => fehler.push('Seitenfehler: ' + e.message));
    await page.route(/api\.anthropic\.com|api\.elevenlabs\.io|fonts\.googleapis\.com|cdnjs/, r => r.abort());
    await page.addInitScript(x => { localStorage.setItem('skipper-sbfsee-v1', x); }, JSON.stringify(stand));
    await page.goto(base); await sleep(1200);
    await page.evaluate(id => { window.welt3dFolge(id); }, id);
    await page.waitForFunction(() => window.WELT && WELT.api && document.querySelector('#wtmodus'), null, {timeout: 20000});
    await page.evaluate(m => { WELT.tempo = 12; if (m === 'auto') document.querySelector('#wtmodus').click(); }, modus);
    const t0 = Date.now(); let fertig = false;
    while (Date.now() - t0 < 420000) {
      fertig = await page.evaluate(m => { const q = s => document.querySelector(s), A = WELT.api, P = A.P;
        const sichtbar = s => { const e = q(s); return e && e.offsetParent !== null ? e : null; };
        if (sichtbar('#wffrei')) { q('#wffrei').click(); return true; }
        for (const s of ['#whw', '#wzok', '#wfgok', '#wqok']) { const b = sichtbar(s); if (b) { b.click(); return false; } }
        if (m === 'selbst') { const a = [...document.querySelectorAll('#wtq .ans:not([disabled])')]; if (a.length) { a[0].click(); return false; }
          const pk = document.querySelector('#wtpkt .wp:not(.an)'); if (pk) { pk.click(); return false; }
          if (A.motor !== 'an' && document.querySelector('#wtmp') && document.querySelector('#wtmp').style.display !== 'none') A.motorAn();
          const z = A.zielDef, mob = A.mobPos;
          if (mob) { P.fest = null; P.x = mob.x + 2.5; P.z = mob.z; P.vx = P.vz = 0; P.g = P.gZiel = 0; }
          else if (z) { P.fest = null; P.x = z.x; P.z = z.z; if (z.h != null) P.h = z.h; P.vx = P.vz = 0; P.g = P.gZiel = 0; P.r = 0; }
          else if (/Dreh das Boot/.test((q('#wtauf') || {}).textContent || '')) { P.h += .4; }
          else if (/ausweichen/.test((q('#wtauf') || {}).textContent || '')) { P.h += .05; P.gZiel = .5; } }
        return false; }, modus).catch(e => { fehler.push('Test: ' + e.message); return true; });
      if (fertig) break; await sleep(250); }
    if (!fertig) fehler.push('nicht fertig geworden');
    const heft = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries((S.lern || {}).k || {}).map(([k, e]) => [k, (window.LERN ? LERN.stufe(k) : '?') + ' c' + e.c.length + ' b' + e.b.length + ' e' + e.e.length])))).catch(() => '{}');
    console.log(`${id} (${modus}): ${fehler.length ? 'FEHLER' : 'ok'} in ${Math.round((Date.now() - t0) / 1000)} s · Heft ${heft}`); fehler.forEach(f => console.log('   ' + f)); fehlerGesamt += fehler.length;
    await ctx.close(); }
  await browser.close(); server.close(); process.exit(fehlerGesamt ? 1 : 0);
})();
