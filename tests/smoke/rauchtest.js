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
  /* Echte Mausklicks an Deck (nicht nur per Skript): Motor und Steuerrad müssen reagieren */
  await schritt('02b-deck-klicks', page, async () => { for (const id of ['motor', 'horn']) { const el = await page.$('[data-egg="' + id + '"]'); const bb = await el.boundingBox(); const top = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e && e.closest('[data-egg]') ? e.closest('[data-egg]').dataset.egg : 'nichts'; }, [bb.x + bb.width / 2, bb.y + bb.height / 2]); if (top !== id) throw new Error(id + ' nicht anklickbar (oben liegt: ' + top + ')'); }
    const st = await page.$('[data-egg="pinne"]'), sb = await st.boundingBox(); await page.mouse.click(sb.x + sb.width / 2, sb.y + sb.height / 2); await sleep(1500); if (!await page.$('[data-start]')) throw new Error('Steuerrad öffnet den Törn nicht'); await ev(page, () => setTab('deck')); await sleep(500); });
  await schritt('03-kajuete', page, async () => { await ev(page, () => setTab('cabin')); await sleep(700); });
  /* 5.12: altes Telefon ruft Kapitän Harms, der holt zur Probeprüfung ab */
  await schritt('03b-telefon-harms', page, async () => { await ev(page, () => document.querySelector('[data-spot="telefon"]').click()); await sleep(7500); if (!await page.$('#harms')) throw new Error('Harms kommt nicht'); await ev(page, () => document.querySelector('#hgo').click()); await sleep(600); await ev(page, () => setTab('cabin')); await sleep(400); });
  /* V42: Scheine, Termine, Lernzeit mit Kommentar der Crew */
  await schritt('03d-ziele', page, async () => { await ev(page, () => zieleOeffnen()); await sleep(1200); if (!await page.$('#zform [data-s]')) throw new Error('Ziele öffnen nicht'); await ev(page, () => document.querySelector('[data-m="45"]').click()); await sleep(300); if (!/Theorie|Termin/.test(await page.textContent('#zlage'))) throw new Error('keine Lage'); await ev(page, () => { VOX.stop(); setTab('cabin'); }); await sleep(400); });
  /* V41: Hocker → Kajütenfunk-Probefolge (ohne Erzeugen, kostet nichts) */
  await schritt('03c-kajuetenfunk', page, async () => { await ev(page, () => hockerWahl()); await sleep(300); await ev(page, () => document.querySelector('[data-m="kurs"]').click()); await sleep(1800); if (!await page.$('#kursplayer [data-ab]')) throw new Error('Kajütenfunk öffnet nicht'); if (!await page.$('#kabgen [data-gen]') || !await page.$('#ksfx .krow')) throw new Error('Kajütenfunk: Erzeugen je Abschnitt oder Geräuschliste fehlt'); await ev(page, () => setTab('cabin')); await sleep(400); });
  /* H2: Szenen-Player, Vorlesen und Zuruf (szene.js) */
  await schritt('03e-szene', page, async () => {
    const r = await ev(page, async () => { await nachladen('szene.js'); const d = [SZENE.deute('Alfa'), SZENE.deute('ich sag bravo'), SZENE.deute('charly'), SZENE.deute('Delta'), SZENE.deute('be', false), SZENE.deute('be', true), SZENE.deute('de', true)];
      app.innerHTML = '<div id="szt"></div>'; const p = SZENE.spiele([{wer: 'hinnerk', t: 'Moin.'}, {wahl: 'Wohin?', id: 'ziel', opts: [{t: 'Schlei', wert: 'schlei', empfohlen: true}, {t: 'Kiel', wert: 'kiel'}]}, {knopf: 'Weiter'}], {box: document.getElementById('szt')});
      await new Promise(r => setTimeout(r, 300)); document.querySelector('#szweiter').click(); await new Promise(r => setTimeout(r, 500));
      document.querySelector('.szopt[data-o="0"]').click(); await new Promise(r => setTimeout(r, 400)); document.querySelector('#szwahl .btn').click(); const e = await p; return {d, e}; });
    if (r.d.join() !== '0,1,2,3,-1,1,3') throw new Error('Zuruf falsch gedeutet: ' + r.d);
    if (r.e.ende !== 'fertig' || r.e.wahlen.ziel !== 'schlei') throw new Error('Szene: ' + JSON.stringify(r.e));
    await ev(page, () => { switchCourse('sbf'); runQuiz([Q[1]], 'Test'); }); await sleep(800);
    if (!await page.$('#vlon') || (await page.$$('.ans .abc')).length !== 4) throw new Error('Vorlesen-Knopf oder Buchstaben fehlen');
    await ev(page, () => setTab('cabin')); });
  /* H3: Reise am Kartentisch und Fahrt-Szene von hinten */
  await schritt('03f-reise', page, async () => {
    await ev(page, () => { S.reise = null; S.cfg.fallback = 'text'; reiseOeffnen(); }); await sleep(1800);
    if (!await page.$('#rbuehne') || !await page.$('#rblase') || (await page.$$('.rgesicht')).length !== 3) throw new Error('Bühne mit Gesichtern und Sprechblase fehlt');
    for (let k = 0; k < 6; k++) { await ev(page, () => { const b = document.querySelector('#rblase'); if (b) b.click(); }); await sleep(300); }
    if (!await ev(page, () => S.reise.pos.tag === 1 && S.reise.pos.i >= 3)) throw new Error('Speicherpunkt fehlt');
    await ev(page, () => { REISE.stopLauf(); S.reise = null; S.cfg.fallback = 'phone'; save(); setTab('cabin'); }); });
  /* H5: Rundgang 1 läuft unten im Bild, „Szene überspringen“ beendet ihn und merkt ihn sich */
  await schritt('03g-rundgang', page, async () => {
    await ev(page, () => { S.rundgang1 = false; rundgangStarten(); }); await sleep(1500);
    if (!await page.$('.rgpanel') || !await page.$('.rgblink')) throw new Error('Rundgang zeigt nichts');
    await ev(page, () => document.querySelector('#szende').click()); await sleep(800);
    if (await page.$('.rgpanel') || !await ev(page, () => S.rundgang1)) throw new Error('Rundgang endet nicht');
    await ev(page, () => setTab('cabin')); });
  for (const c of ['sks', 'binnen', 'sbf']) await schritt('04-schein-' + c, page, async () => { await ev(page, c => { switchCourse(c); setTab('cabin'); }, c); await sleep(600); });
  await schritt('05-spielekiste', page, async () => { await ev(page, () => gamesHub()); await sleep(600); });
  /* V12: Knotenbrett und Knotenkunde */
  await schritt('05b-knoten', page, async () => { await ev(page, () => knotenBrett()); await sleep(1000); if (!await page.$('.knotgrid')) throw new Error('kein Knotenbrett'); await ev(page, () => { const x = document.querySelector('#einfx'); if (x) x.click(); KNOTEN.zeige('acht'); }); await sleep(500); await ev(page, () => KNOTEN.spiel()); await sleep(400); if (!await page.$('[data-o],[data-j]')) throw new Error('kein Knotenspiel'); });
  /* V12: jeder Knoten ist eine Tau-Animation (läuft, Schritt hervorgehoben, am Ende Zieh-Pfeile) */
  await schritt('05c-palstek', page, async () => { await ev(page, () => KNOTEN.zeige('palstek')); await sleep(6500);
    const st = await ev(page, () => { const c = document.querySelector('#kanim'), li = document.querySelector('#kst li.an'); return c && c.width > 0 && li ? [...document.querySelectorAll('#kst li')].indexOf(li) : -1; });
    if (st < 1) throw new Error('Palstek-Animation läuft nicht (Schritt ' + st + ')'); await ev(page, () => { const r = document.querySelector('#kzeit'); r.value = r.max; r.oninput(); }); await sleep(300); });
  for (const id of ['acht', 'kreuz', 'schot', 'stopper', 'webelein', 'webeleinslip', 'rundtoern', 'klampe']) await schritt('05c-' + id, page, async () => {
    await ev(page, id => KNOTEN.zeige(id), id); await sleep(2500);
    const ok = await ev(page, () => { const c = document.querySelector('#kanim'); if (!c || !c.width) return 'keine Leinwand'; const r = document.querySelector('#kzeit'); r.value = r.max; r.oninput(); return document.querySelectorAll('#kst li').length >= 3 ? '' : 'keine Schritte'; });
    if (ok) throw new Error(id + ': ' + ok); await sleep(400); });
  await schritt('05d-knoten-schritt', page, async () => { await ev(page, () => KNOTEN.spiel(['schritt'])); await sleep(2500); if (!await page.$('#kanim') || !await page.$('[data-o]')) throw new Error('keine Runde „Was passiert hier?“'); });
  /* Manöverspiel: Übersicht, Vorführung, Kommando-Abfrage, Ein-Finger-Steuerfeld */
  await schritt('05e-manoever', page, async () => {
    await ev(page, () => maneuverGame()); await sleep(1200); if (!await page.$('[data-m="mob"]')) throw new Error('keine Manöver-Übersicht');
    await ev(page, () => MANOEVER.demo('mob', 6)); await sleep(800); if (!await page.$('#dst li.an')) throw new Error('Vorführung zeigt keinen Schritt');
    await ev(page, () => MANOEVER.fahren('ablegen')); await sleep(900); if (!await page.$('#mcmd:not(.hidden) [data-c]')) throw new Error('keine Kommando-Abfrage');
    await ev(page, () => [...document.querySelectorAll('[data-c]')].find(b => /Rundumblick/.test(b.textContent)).click()); await sleep(1500);
    await ev(page, () => document.querySelector('#motbtn').click()); await sleep(600);
    await ev(page, () => [...document.querySelectorAll('[data-c]')].find(b => /Kühlwasser/.test(b.textContent)).click()); await sleep(1500);
    const bb = await (await page.$('#mpad')).boundingBox(); await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.mouse.move(bb.x + bb.width / 2 - 40, bb.y + bb.height / 2 - 50, {steps: 6}); await page.mouse.up(); await sleep(7000);
    if (!await page.$('#mcmd:not(.hidden) [data-c]')) throw new Error('Boot nicht vom Steg gekommen (keine Frage „frei“)'); await ev(page, () => stopGames()); });
  await schritt('06-navischule', page, async () => { await ev(page, () => navSchool()); await sleep(1500);
    /* 5.10: beim ersten Öffnen erklärt die Crew, danach nicht mehr */
    if (!await page.$('#einf')) throw new Error('keine Einführung'); await ev(page, () => document.querySelector('#einfx').click());
    await ev(page, () => navSchool()); await sleep(800); if (await page.$('#einf')) throw new Error('Einführung doppelt'); });
  /* 5.11: SKS-Stufe am Kartentisch (Versegelung, Doppelpeilung, Peilung und Abstand, Kartenaufgabe) */
  /* V26: Lektion 0, fünf Schritte, Hilfe in drei Stufen */
  await schritt('08-navi-L0', page, async () => { await ev(page, () => NAV.lesson('L0')); await sleep(500); await ev(page, () => document.querySelector('[data-m=erkl]').click()); await sleep(700); await ev(page, () => { VOX.stop(); document.getElementById('lok').click(); }); await sleep(800);
    if (!await page.$('#bok')) throw new Error('kein Beispiel'); await ev(page, () => document.getElementById('bok').click()); await sleep(800);
    for (let k = 0; k < 2; k++) { await ev(page, () => document.getElementById('xhint').click()); await sleep(150); } if (await ev(page, () => document.querySelectorAll('#xhints .nhint').length) !== 3) throw new Error('Hilfe nicht dreistufig'); });
  for (const l of ['L10', 'L11']) await schritt('08-navi-' + l, page, async () => { await ev(page, l => NAV.exercise(l, 'guided'), l); await sleep(700); if (!await page.$('#xform')) throw new Error('keine Aufgabe'); });
  /* Navi-Facelift: Arbeitsblatt unten, eigene Zahlentasten, Zirkel an den Breitenrand mit Ablese-Fenster, Rückgängig und Wiederholen, Werte wandern in die nächste Teilaufgabe */
  await schritt('08c-navi-arbeitsblatt', page, async () => {
    await ev(page, () => { window.__t = NAV.GEN.distMessen(); NAV.task(window.__t, {mode: 'guided', title: 'Test', next() {}}); }); await sleep(700);
    if (!await page.$('.nt2 .ntsheet [data-tab=rechen]')) throw new Error('Arbeitsblatt fehlt');
    await page.click('[data-k=d]'); await sleep(150); if (!await page.$('#nkeys:not(.hidden)')) throw new Error('Zahlentasten fehlen');
    for (const k of ['3', ',', '5']) await page.click(`[data-key="${k}"]`);
    if (await ev(page, () => document.querySelector('[data-k=d]').value) !== '3,5') throw new Error('Zahlentasten tippen nicht');
    await ev(page, () => { const c = NAV.lastCtl, K = NAV.data().K, o = id => { const x = K.objekte.find(y => y.id === id); return NAV.proj(x.lat, x.lon); }; c.st.zirkel = {a: o(window.__t.chart.hi[0]), b: o(window.__t.chart.hi[1]), done: true, n: 1}; c.ink(); c.zirkelAnRand(); }); await sleep(800);
    const sichtbar = () => ev(page, () => !document.querySelector('.nablese').classList.contains('hidden'));
    if (!await sichtbar()) throw new Error('Ablese-Fenster fehlt');
    await page.click('[data-act=undo]'); await sleep(200); if (await sichtbar()) throw new Error('Rückgängig wirkt nicht');
    await page.click('[data-act=redo]'); await sleep(200); if (!await sichtbar()) throw new Error('Wiederholen wirkt nicht');
    await ev(page, () => NAV.exercise('L9', 'guided')); await sleep(900);
    await ev(page, () => { document.querySelector('[data-k=k]').value = '090'; document.getElementById('xcheck').click(); }); await sleep(300);
    await ev(page, () => document.getElementById('xnext').click()); await sleep(900);
    if (!await ev(page, () => /rwK 090/.test(document.querySelector('.nbisher').textContent) && document.querySelector('[data-sv=rwk]').value === '090')) throw new Error('Werte aus Teil 1 fehlen'); });
  await schritt('07-einstellungen', page, async () => { await ev(page, () => renderSettings()); await sleep(600); });
  /* V26: Deck mit „Kurs für heute“, Meine Prüfungen (Abschnitte, Themen, Schein wechseln), Seezeichen-Kurs, Spielekiste nur Spiele */
  await schritt('07b-kurs-fuer-heute', page, async () => { await ev(page, () => { Object.keys(INTROS.e || {}).forEach(k => { S.intros = S.intros || {}; S.intros[k] = 1; }); setTab('deck'); }); await sleep(800); if (!await page.$('#kursheute')) throw new Error('Kurs für heute fehlt'); if (!await page.$('.standkarte')) throw new Error('Logbuch-Aufschlüsselung fehlt'); });
  await schritt('07c-meine-pruefungen', page, async () => { await ev(page, () => { setTab('cabin'); }); await sleep(600); await ev(page, () => meinePruefungen()); await sleep(1500); if (!await page.$('details.mssec')) throw new Error('keine Abschnitte');
    await page.click('details[data-sec=theorie] summary'); await sleep(300); await page.click('[data-go=themen]'); await sleep(600); if (!await page.$('.mstema')) throw new Error('keine Themen'); await page.click('#back'); await sleep(600); });
  await schritt('07d-seezeichen', page, async () => { await page.click('details[data-sec=zeichen] summary'); await sleep(300); await page.click('[data-go=kurs]'); await sleep(1500); await page.click('[data-l=kardinal]'); await sleep(800); if (!await page.$('.szbilder img')) throw new Error('keine Originalbilder'); await ev(page, () => VOX.stop()); });
  await schritt('07e-schein-wechsel', page, async () => { await ev(page, () => meinePruefungen('binnen')); await sleep(1200); if (await ev(page, () => S.course) !== 'binnen') throw new Error('Binnen nicht aktiv');
    await ev(page, () => { lernHeim = null; setTab('cabin'); }); await sleep(800); if (await ev(page, () => S.course !== S.crewSchein)) throw new Error('Crew-Schein nicht zurück'); await ev(page, () => gamesHub()); await sleep(800); if (await page.$('[data-gi="5"]')) throw new Error('Kartentisch noch in der Spielekiste'); });
  /* Lauf 5: Easy/Tricky (V36), Kuchendiagramme (V35), Lernwand in der Kajüte (V34), Werkzeugkunde (V40) */
  await schritt('07f-easy-tricky', page, async () => { await ev(page, () => { switchCourse('sbf'); runQuiz([Q[0]], 'Test'); }); await sleep(500); await ev(page, () => document.querySelector('.ans:not([data-k="0"])').click()); await sleep(300);
    if (!await page.$('[data-et="easy"]')) throw new Error('kein Easy/Tricky'); await ev(page, () => document.querySelector('[data-et="easy"]').click()); await sleep(200);
    if (!await ev(page, () => S.qs[Q[0].n] && S.qs[Q[0].n].pr === 1)) throw new Error('Vertippt nicht gemerkt'); await ev(page, () => document.querySelector('#nxt').click()); await sleep(300);
    await ev(page, () => document.querySelector('.ans[data-k="0"]').click()); await sleep(200); if (await ev(page, () => S.qs[Q[0].n].pr)) throw new Error('Bestätigung nicht gezählt'); });
  await schritt('07g-lernwand', page, async () => { await ev(page, () => { lernHeim = null; setTab('cabin'); }); await sleep(700); for (const k of ['.wandkarte', '.manbrett', '[data-spot="manoever"]', '[data-spot="tisch"]']) if (!await page.$(k)) throw new Error('fehlt: ' + k);
    if (await page.$('.scene.cabin .msring')) throw new Error('Fortschrittsring in der Kajüte'); await page.click('[data-spot="manoever"]'); await sleep(1200); if (!await page.$('[data-m="mob"]')) throw new Error('Manöverbrett öffnet das Spiel nicht');
    await ev(page, () => MANOEVER.vorher('mob')); await sleep(400); if (!await page.$('.mbrief')) throw new Error('keine Einweisung'); });
  await schritt('07h-kuchen', page, async () => { await ev(page, () => meinePruefungen('sbf')); await sleep(1200); if (!await page.$('.kuchen')) throw new Error('keine Kuchendiagramme'); });
  await schritt('07i-werkzeugkunde', page, async () => { await ev(page, () => loadNavi().then(() => NAV.werkzeugkunde())); await sleep(1200); if (!await page.$('#wkt')) throw new Error('keine Werkzeugkunde');
    await ev(page, () => { for (let k = 0; k < 8; k++) document.querySelector('#wkskip').click(); }); await sleep(300); if (!await ev(page, () => S.navi.werkzeug)) throw new Error('Werkzeugkunde nicht gemerkt'); });

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
        const bx = document.querySelector('#twbonusx'); if (bx) { bx.click(); return 'bonus'; }
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
  /* V14: Bonusrunde (Minispiel) im Törn: starten, gekürzt spielen, Ertrag geht zurück in den Törn, keine Musik */
  await schritt('23-bonusrunde', page, async () => {
    await ev(page, () => { const L = S.toern2.lauf; if (L.card) { L.card = null; document.querySelector('#twtask').innerHTML = ''; } L.plan.tasks.splice(L.i, 0, {typ: 'mini', key: 'lights', at: L.t + .5}); }); await sleep(1500);
    if (!await page.$('#twbonus')) throw new Error('keine Bonusrunde angeboten');
    const kasse = await ev(page, () => S.toern2.kasse);
    await ev(page, () => document.querySelector('#twbonus').click()); await sleep(900);
    if (!await ev(page, () => BONUS && BONUS.key === 'lights')) throw new Error('Minispiel nicht im Bonus-Modus');
    await ev(page, () => bonusEnde(4)); await sleep(1600);
    if (!await page.$('#twcv')) throw new Error('nicht zurück im Törn');
    const r = await ev(page, () => ({n: (S.toern2.lauf.mini || []).length, k: S.toern2.kasse, best: (S.best || {}).lights || 0}));
    if (r.n < 1 || r.k <= kasse) throw new Error('kein Ertrag: ' + JSON.stringify(r)); if (r.best) throw new Error('Bonus zählt als Rekord');
  });

  /* 5. SKS-Ankreuzrunde */
  await schritt('30-sks-mc', page, async () => { await ev(page, () => { switchCourse('sks'); return loadToern().then(() => TOERN.mcRunde()); }); await sleep(700); await ev(page, () => document.querySelector('[data-k]').click()); await sleep(300); if (!await page.$('#mcweiter')) throw new Error('keine Auswertung'); });
  await page.context().close();

  /* 6. Alter Spielstand (Törn-Light, ohne toern2) lädt ohne Fehler */
  page = await neu(stand({crew: {K: 'ilse', M: 'piet', T: 'backbord'}, toern: {i: 1, p: 2.5, art: 'segel', ev: [], prov: 3, sprit: 80, laune: 70, zustand: 90, log: [{day: 20000, t: 'Alt', art: 'segel', min: 6, ok: 3, n: 4, sterne: 2}], provDay: 20000}}));
  await schritt('40-alter-stand', page, async () => { await ev(page, () => setTab('cabin')); await sleep(600); const c = await ev(page, () => S.crew.K + S.crew.M + S.crew.T); if (c !== 'hinnerksmillaklabauter') throw new Error('Crew nicht umgestellt: ' + c); await ev(page, () => openToern()); await sleep(1500); });
  await page.context().close();

  await browser.close(); server.close();
  console.log('Bestanden: ' + ok.join(', '));
  console.log(fehler.length ? '\nFEHLER:\n' + [...new Set(fehler)].join('\n') : '\nKeine Fehler. Bilder in tests/smoke/bilder/');
  process.exit(fehler.length ? 1 : 0);
})();
