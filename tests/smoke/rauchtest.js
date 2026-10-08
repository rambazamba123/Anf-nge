/* Rauchtest (CLAUDE.md 5.15 und 5.14): klickt die Hauptbereiche und den Törn durch und meldet Konsolenfehler.
   Startet selbst einen kleinen Webserver (kein Python nötig). Braucht Playwright mit Chromium.
   Aufruf: node tests/smoke/rauchtest.js            (Hochformat 400×860)
           PLAYWRIGHT=/pfad/zu/playwright node tests/smoke/rauchtest.js
   Bilder landen in tests/smoke/bilder/ (nicht im Repo, siehe .gitignore). */
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../..'), out = path.join(__dirname, 'bilder');
const pw = (() => { for (const p of [process.env.PLAYWRIGHT, 'playwright', '/opt/node22/lib/node_modules/playwright']) { try { if (p) return require(p); } catch (e) {} } throw new Error('Playwright fehlt (npm i -g playwright oder PLAYWRIGHT=… setzen)'); })();
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json'};
const server = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, {'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(r);
});
/* Testspielstand: bekannter Nutzer, Intro fertig, Touren gesehen */
const stand = (extra = {}) => ({
  profile: {name: 'Testi', exam: '2026-12-01', minutes: 30, exp: 'none', goal: 'sbf', facts: []},
  introV5: true, introDone: true, cabinWelcome: true, seenCabin: true, course: 'sbf', crew: {K: 'hinnerk', M: 'smilla', T: 'klabauter'},
  qs: {1: {b: 2, d: 0, n: 3}}, lessons: {}, mnemo: {}, talk: [], stories: [], cfg: {music: .35, amb: .6, sfx: .7, voice: 1, pause: 2},
  best: {}, eggs: {}, tour: {boat: true, cabin: true}, navi: {fibel: {}, lek: {}}, updatedAt: Date.now(), ...extra});
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await new Promise(r => server.listen(0, r)); const base = `http://localhost:${server.address().port}/index.html`;
  fs.mkdirSync(out, {recursive: true});
  const browser = await pw.chromium.launch({executablePath: process.env.CHROMIUM || undefined});
  const fehler = [], ok = [];
  const neu = async (s, q = '') => {
    const ctx = await browser.newContext({viewport: {width: 400, height: 860}});
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') fehler.push('Konsole: ' + m.text()); });
    page.on('pageerror', e => fehler.push('Seitenfehler: ' + e.message));
    await page.route(/api\.anthropic\.com|api\.elevenlabs\.io|fonts\.googleapis\.com|cdnjs/, r => r.abort());
    await page.addInitScript(x => { if (!sessionStorage.getItem('init')) { localStorage.clear(); if (x) localStorage.setItem('skipper-sbfsee-v1', x); sessionStorage.setItem('init', '1'); } }, s ? JSON.stringify(s) : '');
    await page.goto(base + q); await sleep(1500);
    const tz = await page.$('.tapzone'); if (tz) { await tz.click(); await sleep(500); }
    return page;
  };
  const schritt = async (name, page, fn) => { const vor = fehler.length; try { await fn(); } catch (e) { fehler.push(name + ': ' + e.message); } await page.screenshot({path: path.join(out, name + '.png')}); if (fehler.length === vor) ok.push(name); else fehler.push('↑ bei ' + name); };
  const ev = (page, f, a) => page.evaluate(f, a);

  /* 1. Erster Start ohne Spielstand */
  let page = await neu(null);
  await schritt('01-erster-start', page, async () => { await sleep(1500); });
  await page.context().close();

  /* 2. Hauptbereiche mit Testspielstand */
  page = await neu(stand());
  await schritt('02-deck', page, async () => { await ev(page, () => setTab('deck')); await sleep(700); });
  await schritt('03-kajuete', page, async () => { await ev(page, () => setTab('cabin')); await sleep(700); });
  for (const c of ['sks', 'binnen', 'sbf']) await schritt('04-schein-' + c, page, async () => { await ev(page, c => { switchCourse(c); setTab('cabin'); }, c); await sleep(600); });
  await schritt('05-spielekiste', page, async () => { await ev(page, () => gamesHub()); await sleep(600); });
  await schritt('06-navischule', page, async () => { await ev(page, () => navSchool()); await sleep(1500);
    /* 5.10: beim ersten Öffnen erklärt die Crew, danach nicht mehr */
    if (!await page.$('#einf')) throw new Error('keine Einführung'); await ev(page, () => document.querySelector('#einfx').click());
    await ev(page, () => navSchool()); await sleep(800); if (await page.$('#einf')) throw new Error('Einführung doppelt'); });
  await schritt('07-einstellungen', page, async () => { await ev(page, () => renderSettings()); await sleep(600); });

  /* 3. Törnwahl und kompletter Landratte-Törn (Zeit vorgespult, jede Aufgabe mit erster Antwort) */
  await schritt('10-toernwahl', page, async () => { await ev(page, () => openToern()); await sleep(1500); if (!await page.$('[data-start]')) throw new Error('keine Törns'); });
  await schritt('11-landratte', page, async () => { await ev(page, () => document.querySelector('[data-start="kaffee"]').click()); await sleep(4200); });
  /* Wetterbericht: die richtige Wahl klicken, bis die Fahrt beginnt */
  for (let k = 0; k < 6; k++) {
    const phase = await ev(page, () => S.toern2.lauf && S.toern2.lauf.phase);
    if (phase !== 'wetter') break;
    await ev(page, () => { const L = S.toern2.lauf, E = TOERN.core.entscheid(L.w, L.si, new Set(S.toern2.teile)); const b = document.querySelector(`[data-k="${E.ok.includes('fahren') ? 'fahren' : E.ok[0]}"]`); if (b) b.click(); });
    await sleep(300); await ev(page, () => { const b = document.querySelector('#twnext'); if (b) b.click(); }); await sleep(900);
  }
  await schritt('12-fahrt', page, async () => { if (!await page.$('#twcv')) throw new Error('keine Fahrt-Ansicht'); });
  await schritt('13-etappe-komplett', page, async () => {
    for (let k = 0; k < 60; k++) {
      const st = await ev(page, () => { const L = S.toern2.lauf; if (!L || L.phase !== 'fahrt') return 'fertig'; if (document.querySelector('#twok')) { document.querySelector('#twok').click(); return 'weiter'; }
        const o = document.querySelector('[data-o]:not([disabled])'); if (o) { o.click(); return 'antwort'; }
        const s = document.querySelector('#twsig'); if (s && !s.disabled) { s.click(); return 'signal'; }
        const a = document.querySelector('#twauf'); if (a) { a.click(); setTimeout(() => { const j = document.querySelector('#twja'); if (j) j.click(); }, 50); return 'offen'; }
        const nx = L.plan.tasks[L.i]; L.t = nx ? Math.max(L.t, nx.at - .3) : L.plan.dauer - .3; return 'spulen'; });
      if (st === 'fertig') break; await sleep(st === 'spulen' ? 900 : 350);
    }
    if (!await page.$('#twfertig') && !await page.$('#twnext') && !await page.$('#twzu')) throw new Error('keine Nachbesprechung');
  });

  await schritt('14-naechster-toern', page, async () => {
    await ev(page, () => document.querySelector('#twfertig').click()); await sleep(1500);
    const ids = await ev(page, () => [...document.querySelectorAll('div.tw-card [data-start]')].map(b => b.dataset.start));
    if (ids.includes('kaffee') || !ids.includes('leuchtturmwirt')) throw new Error('Liste rückt nicht nach: ' + ids.join(','));
    if (!await page.$('details.tw-card')) throw new Error('keine Liste „Geschafft“');
  });
  /* 4. Nacht- und Nebelereignis, Pause und Fortsetzen nach Neuladen */
  await schritt('20-nacht-nebel', page, async () => {
    await ev(page, () => { S.toern2.prov = 5; S.toern2.lauf = null; TOERN.data().toerns.slice(0, 6).forEach(x => { S.toern2.schnitt[x.id] = 2; }); save(); openToern(); }); await sleep(1200);
    await ev(page, () => document.querySelector('[data-start="nachtfahrt"]').click()); await sleep(4200);
    await ev(page, () => { const L = S.toern2.lauf; L.w = {wx: 'schoen', bft: 3, von: 225, sicht: 'gut', see: .5}; document.querySelector('[data-k="fahren"]').click(); }); await sleep(300);
    await ev(page, () => document.querySelector('#twnext').click()); await sleep(1000);
    await ev(page, () => { const L = S.toern2.lauf; L.plan.tasks.splice(L.i, 0, {typ: 'ev', id: 'nebel-kommt', at: L.t + 1}, {typ: 'gen', gen: 'lichter', at: L.t + 2}); }); await sleep(2500);
    await ev(page, () => { const o = document.querySelector('[data-o]'); if (o) o.click(); }); await sleep(300); await ev(page, () => { const b = document.querySelector('#twok'); if (b) b.click(); }); await sleep(2500);
    if (await ev(page, () => S.toern2.lauf.wx) !== 'nebel') throw new Error('Nebel nicht gesetzt');
  });
  const tVor = await ev(page, () => { const b = document.querySelector('[data-o]'); if (b) b.click(); const k = document.querySelector('#twok'); if (k) k.click(); return S.toern2.lauf.t; });
  await page.reload(); await sleep(1500);
  await schritt('21-fortsetzen', page, async () => {
    await ev(page, () => openToern()); await sleep(1500);
    await ev(page, () => document.querySelector('#twweiter').click()); await sleep(1200);
    const t = await ev(page, () => S.toern2.lauf.t); if (Math.abs(t - tVor) > 5) throw new Error(`Stand nicht fortgesetzt (${tVor} → ${t})`);
  });
  await schritt('22-pause', page, async () => { await ev(page, () => document.querySelector('#twpause').click()); await sleep(400); if (!await page.$('#twover')) throw new Error('keine Pause'); await ev(page, () => document.querySelector('#twgo').click()); });

  /* 5. SKS-Ankreuzrunde */
  await schritt('30-sks-mc', page, async () => { await ev(page, () => { switchCourse('sks'); return loadToern().then(() => TOERN.mcRunde()); }); await sleep(700); await ev(page, () => document.querySelector('[data-k]').click()); await sleep(300); if (!await page.$('#mcweiter')) throw new Error('keine Auswertung'); });
  await page.context().close();

  /* 6. Alter Spielstand (Törn-Light, ohne toern2) lädt ohne Fehler */
  page = await neu(stand({toern: {i: 1, p: 2.5, art: 'segel', ev: [], prov: 3, sprit: 80, laune: 70, zustand: 90, log: [{day: 20000, t: 'Alt', art: 'segel', min: 6, ok: 3, n: 4, sterne: 2}], provDay: 20000}}));
  await schritt('40-alter-stand', page, async () => { await ev(page, () => setTab('cabin')); await sleep(600); await ev(page, () => openToern()); await sleep(1500); });
  await page.context().close();

  await browser.close(); server.close();
  console.log('Bestanden: ' + ok.join(', '));
  console.log(fehler.length ? '\nFEHLER:\n' + [...new Set(fehler)].join('\n') : '\nKeine Fehler. Bilder in tests/smoke/bilder/');
  process.exit(fehler.length ? 1 : 0);
})();
