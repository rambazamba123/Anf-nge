/* Bühnentest der Hörreise (docs/fehler-katalog.md Teil B): findet Fehler, die frühere Läufe erst am Handy des Nutzers gezeigt haben.
   Aufruf: python3 -m http.server 8765 (im Repo, eigenes Fenster), dann node tests/buehne-pruefen.js
   Prüft mit Gratis-Stimme (schnell gestellt) und Handy-Maßen (Pixel 7):
   1. Gesichter springen nicht: Position jedes Gesichts bleibt beim Sprecherwechsel gleich (v5.54, v5.55, v5.56; v5.58 mit vorher geladener Animation).
   2. Die Frage ist oben nicht abgeschnitten (v5.56: Flex-Zentrierung schob lange Fragen über den Rand).
   3. Eine Animation, die das Skript ohne Phasen aufruft, läuft weiter (v5.56: Anlegen blieb im ersten Bild stehen).
   4. Vor Harms verabschiedet sich die Crew, danach ist Harms allein; seine Frage hat Easy/Tricky (HR45).
   5. Feste Crew ohne Namensschild (HR42).
   6. Keine Fehler in der Konsole.
   7. v5.59: An Deck steht die Crew mit Körper im Boot (nichts ragt über Bug oder Heck), während einer Animation ist das Gesicht des Sprechers sichtbar
      (v5.58 hatte die Regel .kpl:not(.an) übersehen, als die Klasse in ksp umbenannt wurde). */
const pw = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const STAND = {profile: {name: 'Test', exam: '2026-12-01', minutes: 30, exp: 'none', goal: 'sbf', facts: []}, introV5: true, introDone: true, cabinWelcome: true, seenCabin: true, course: 'sbf',
  crew: {K: 'hinnerk', M: 'smilla', T: 'klabauter'}, qs: {}, lessons: {}, mnemo: {}, talk: [], stories: [], cfg: {music: 0, amb: 0, sfx: .7, voice: 1, pause: 2, kurs: {modus: 'interaktiv', tempo: 1}},
  best: {}, eggs: {}, tour: {boat: true, cabin: true}, navi: {fibel: {}, lek: {}}, v: 7, rundgang1: true, kiOk: true};
const fehler = [], ok = t => console.log('✓ ' + t), schlecht = t => { fehler.push(t); console.log('✖ ' + t); };

async function oeffne(b, id, abschnitt) {
  const ctx = await b.newContext(pw.devices['Pixel 7']); const p = await ctx.newPage(); const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
  await p.addInitScript(x => { if (!sessionStorage.getItem('i')) { localStorage.clear(); localStorage.setItem('skipper-sbfsee-v1', x); sessionStorage.setItem('i', '1'); } }, JSON.stringify(STAND));
  await p.goto('http://localhost:8765/index.html'); await sleep(2500);
  const tz = await p.$('.tapzone'); if (tz) { await tz.click(); await sleep(400); }
  /* v5.58: Erst eine Animation laden wie in der echten Folge (anim.js bringt globale Regeln mit; .an{height:100%} ließ den Sprecher nach oben springen) */
  await p.evaluate(async () => { await nachladen('anim.js'); if (window.ANIM && ANIM.bereit) await ANIM.bereit; if (ANIM.css) ANIM.css(); });
  await p.evaluate(async id => { await nachladen('kurs.js'); VOX.phoneTest = () => new Promise(r => setTimeout(() => r(true), 700)); KURS.oeffnen(id); }, id); await sleep(2500);
  await p.click('#kzahn'); await sleep(300); await p.click('#kemehr'); await sleep(300);
  const gefunden = await p.evaluate(t => { const x = [...document.querySelectorAll('#kursplayer [data-ab]')].find(e => e.textContent.startsWith(t)); if (x) x.click(); return !!x; }, abschnitt);
  if (!gefunden) schlecht(`${id}: Abschnitt „${abschnitt}“ nicht gefunden`);
  await sleep(200); const z = await p.$('#kzu'); if (z && await z.isVisible()) await z.click();
  return {p, ctx, errs};
}
/* Position der Gesichter (Rahmen .kg), gerundet; bei schaukelndem Boot schwankt sie um wenige Pixel, Sprünge sind größer */
const lage = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('#kges .kpl')].map(e => { const r = (e.querySelector('.kg') || e).getBoundingClientRect(); return [e.dataset.w + (e.classList.contains('ksp') ? '*' : ''), [r.x, r.y, r.width]]; })));

(async () => {
  const b = await pw.chromium.launch();
  /* 1 und 5: Tankstelle (Gast und Crew), Sprecherwechsel */
  { const {p, ctx, errs} = await oeffne(b, 'reise-1-2', 'Die Gasflasche'); let vorher = null, spruenge = 0, wechsel = 0;
    for (let i = 0; i < 70; i++) { await sleep(150); const l = await lage(p); const sp = Object.keys(l).find(k => k.endsWith('*'));
      if (vorher && sp && vorher.sp !== sp) { wechsel++; for (const [k, v] of Object.entries(l)) { const w = k.replace('*', ''), a = vorher.l[w] || vorher.l[w + '*']; if (a && (Math.abs(a[1] - v[1]) > 6 || Math.abs(a[2] - v[2]) > 4)) spruenge++; } }
      const n = {}; for (const [k, v] of Object.entries(l)) n[k.replace('*', '')] = v; vorher = {sp, l: n}; }
    wechsel ? (spruenge ? schlecht(`Gesichter springen beim Sprecherwechsel (${spruenge}×)`) : ok(`Gesichter bleiben stehen (${wechsel} Sprecherwechsel)`)) : schlecht('kein Sprecherwechsel beobachtet');
    const bord = await p.evaluate(() => { const k = [...document.querySelectorAll('#kges g.kpl.kb')].filter(g => !['KLABAUTER', 'BACKBORD'].includes(g.dataset.w)), b = document.querySelector('#kges .boot-seite');
      if (!b || !k.length) return {n: k.length}; const r = b.getBoundingClientRect(); return {n: k.length, raus: k.filter(g => { const q = g.getBoundingClientRect(); return q.left < r.left - 2 || q.right > r.right + 2; }).map(g => g.dataset.w)}; });
    !bord.n ? schlecht('An Deck keine Crew mit Körper') : bord.raus.length ? schlecht('Crew ragt aus dem Boot: ' + bord.raus.join(', ')) : ok(`Crew steht mit Körper im Boot (${bord.n})`);
    const namen = await p.evaluate(() => [...document.querySelectorAll('#kges .kpl .kn')].map(e => e.closest('.kpl').dataset.w));
    namen.some(w => ['HINNERK', 'SMILLA', 'KLABAUTER', 'BACKBORD'].includes(w)) ? schlecht('Feste Crew hat Namensschilder: ' + namen.join(', ')) : ok('Namensschilder nur bei Gästen');
    errs.length ? schlecht('Konsole (1-2): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (1-2 Gasflasche)'); await ctx.close(); }
  /* 4 und 2: Harms ruft an */
  /* seit v5.69 haben 1-1 und 1-2 keinen Harms-Abschnitt mehr (neue Machart); die alte 1-3 hat ihn noch */
  { const {p, ctx, errs} = await oeffne(b, 'reise-1-3', 'Harms ruft an'); let gingen = false, allein = false;
    for (let i = 0; i < 150; i++) { await sleep(300); const s = await p.evaluate(() => ({g: !!document.querySelector('#kges .kpl.geht'), w: [...document.querySelectorAll('#kges .kpl')].map(e => e.dataset.w), f: !!document.querySelector('#kwahl .kharms')}));
      if (s.g) gingen = true; if (s.w.length === 1 && s.w[0] === 'HARMS') allein = true; if (s.f) break; }
    gingen ? ok('Crew verabschiedet sich vor Harms') : schlecht('Crew geht vor Harms nicht ab'); allein ? ok('Harms ist allein') : schlecht('Harms nicht allein auf der Bühne');
    const f = await p.evaluate(() => { const k = document.querySelector('#kwahl .kfrage'); if (!k) return null; const r = k.getBoundingClientRect(); return {top: r.top, et: !!k.querySelector('[data-et]'), harms: !!k.querySelector('.kharms')}; });
    if (!f) schlecht('Harms-Frage erscheint nicht'); else { f.top >= 0 ? ok('Frage oben nicht abgeschnitten') : schlecht(`Frage oben abgeschnitten (${Math.round(f.top)} px)`); f.et && f.harms ? ok('Harms über der Frage, Easy/Tricky da') : schlecht('Harms-Kopf oder Easy/Tricky fehlt'); }
    errs.length ? schlecht('Konsole (alte 1-3 Harms): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (alte 1-3 Harms)'); await ctx.close(); }
  /* 3: Animation ohne Phasen läuft weiter (Der Raser: [[ANIM: gleiter]]) */
  /* v5.70 Handystimme: kein Stück, das nur aus Zeichen besteht, keine Anführungszeichen (Nutzer 17.11.2026: „Anführungszeichen … Punkt“) */
  { const {p, ctx} = await oeffne(b, 'gold-3', 'Der Raser');
    const r = await p.evaluate(async () => { const cfg = await (await fetch('podcast/audio_config.json')).json(), schlecht = [];
      for (const id of HOERREISE.map(x => x[0])) { const f = await (await fetch(KURS._datei ? KURS._datei(id) : '')).text().catch(() => '');
        if (!f) continue; KURS.zerlege(f, cfg, {}).items.filter(i => i.t === 'rede').forEach(i => i.zeilen.forEach(z => VOX._chunks(z.text).forEach(c => { if (/[„“”"«»]/.test(c) || c.split(/\s+/).some(w => w && !/[A-Za-zÄÖÜäöüß0-9]/.test(w))) schlecht.push(id + ': ' + c.slice(0, 60)); }))); }
      return schlecht; });
    r.length ? schlecht('Handystimme liest Zeichen vor: ' + r.slice(0, 3).join(' | ')) : ok('Handystimme: keine Zeichen-Reste in allen Folgen der Hörreise');
    await ctx.close(); }
  /* v5.67 Harms fragt zurück (HR57): nie Fragen der eben gehörten Folge, ohne frühere Folge keine Runde */
  { const {p, ctx} = await oeffne(b, 'gold-1', 'Leise raus');
    const r = await p.evaluate(() => { const vorher = JSON.stringify(S.hoerreise || {}); S.hoerreise = {gehoert: {'reise-1-1': '2026-11-16', 'reise-1-2': '2026-11-16'}, stoff: {'reise-1-1': [1, 2, 59], 'reise-1-2': [49, 63], 'gold-1': [41, 46, 47, 48]}};
      const mit = KURS._harmsRunde('gold-1'); S.hoerreise = {gehoert: {}, stoff: {}}; const ohne = KURS._harmsRunde('gold-1'); S.hoerreise = JSON.parse(vorher); return {mit, ohne}; });
    r.mit.length && r.mit.length <= 5 && !r.mit.some(n => [41, 46, 47, 48].includes(n)) ? ok(`Harms fragt zurück: ${r.mit.length} Fragen aus früheren Folgen`) : schlecht('Harms-Runde falsch: ' + JSON.stringify(r.mit));
    r.ohne.length === 0 ? ok('Ohne frühere Folge ruft Harms nicht an') : schlecht('Harms-Runde ohne frühere Folge: ' + JSON.stringify(r.ohne));
    await ctx.close(); }
  { const {p, ctx, errs} = await oeffne(b, 'reise-1-3', 'Der Raser'); let erst = null, spaeter = null;
    for (let i = 0; i < 120; i++) { await sleep(400); const t = await p.evaluate(() => { const s = document.querySelector('#kbild svg'); return s ? [...s.querySelectorAll('text')].map(x => x.textContent).join('|') : null; }); if (t && !erst) erst = t; if (erst && t && t !== erst) { spaeter = t; break; } }
    const sp = await p.evaluate(() => { const k = document.querySelector('#kursplayer.mitbild #kges div.kpl.ksp'); return k ? getComputedStyle(k).display : 'keiner'; });
    sp === 'keiner' ? ok('(kein Sprecher während der Animation erfasst)') : sp !== 'none' ? ok('Sprecher-Gesicht während der Animation sichtbar') : schlecht('Sprecher-Gesicht während der Animation versteckt');
    !erst ? schlecht('Animation im Raser erscheint nicht') : spaeter ? ok('Animation ohne Phasen läuft weiter') : schlecht('Animation bleibt im ersten Bild stehen');
    errs.length ? schlecht('Konsole (1-3): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (1-3 Raser)'); await ctx.close(); }
  /* v5.71 Filmbühne: nach dem Öffnen steht die Bühne im Dokument und die Zeichenschleife läuft (Fehler: #kges wurde nach dem Aufbau geleert, Kamera und Handlung blieben stehen) */
  { const {p, ctx, errs} = await oeffne(b, 'film-a', 'Das Heck will zu Paul');
    const r = await p.evaluate(async () => { const da = !!document.querySelector('#kges .fb'); FILMB.tu({fender: [.5, 200]}); await new Promise(x => setTimeout(x, 700));
      const s = FILMB.zustand; return {da, fender: s.s.fender, ort: s.ort}; });
    r.da ? ok('Filmbühne steht im Player') : schlecht('Filmbühne fehlt im Player (#kges .fb)');
    Math.abs(r.fender - .5) < .01 ? ok(`Filmbühne läuft (Ort ${r.ort})`) : schlecht('Filmbühne steht still: Handlung kommt nicht an (' + r.fender + ')');
    errs.length ? schlecht('Konsole (Filmprobe A): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (Filmprobe A)'); await ctx.close(); }
  /* v5.73 Werft mit Drehrad: Bühne sichtbar (nicht von der Crew-Ansicht verdeckt), Wahl wirkt als Vorschau, Verwerfen stellt zurück, Übernehmen speichert */
  { const ctx = await b.newContext({viewport: {width: 400, height: 860}}); const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
    await p.addInitScript(x => { if (!sessionStorage.getItem('i')) { localStorage.clear(); localStorage.setItem('skipper-sbfsee-v1', x); sessionStorage.setItem('i', '1'); } }, JSON.stringify(STAND));
    await p.goto('http://localhost:8765/index.html'); await sleep(2500);
    await p.evaluate(() => werftOeffnen()); await sleep(2000);
    /* v5.76: einfaches Rad (Glas-Stil, Machart, Zeichenstil, Körperbau, Augen, Mehr); „Mehr“ schaltet alles frei */
    const ein = await p.evaluate(() => { const T = WERFT._themen(), ids = T.map(t => t.id); const m = ids.indexOf('mehr'); WERFT._thema(m); WERFT._wahl(WERFT._themen()[m].opts.findIndex(o => o.w === 'alles'));
      const glas = T.find(t => t.id === 'glas'); return {n: ids.length, ok: ['glas', 'licht', 'stil', 'typ-alle', 'auge', 'mehr'].every(x => ids.includes(x)), voll: WERFT._themen().some(t => t.id === 'p-bug'), glasN: glas ? glas.opts.length : 0}; });
    ein.n <= 7 && ein.ok && ein.voll ? ok(`Werft: einfaches Rad (${ein.n} Themen), „Mehr“ zeigt alles`) : schlecht('Werft: einfaches Rad ' + JSON.stringify(ein));
    ein.glasN === 6 ? ok(`Werft: ${ein.glasN} Glasarten`) : schlecht('Werft: Glasarten ' + ein.glasN);
    const r = await p.evaluate(async () => {
      const film = !!document.querySelector('#werft2 .fb-set.an'), crewZu = getComputedStyle(document.querySelector('#werft2 .wcrew')).display === 'none';
      const T = WERFT._themen(), bug = T.findIndex(t => t.id === 'p-bug'); WERFT._thema(bug); WERFT._wahl(T[bug].opts.findIndex(o => o.w === 'bordkanone'));
      const vorschau = document.documentElement.dataset.up.includes('bordkanone');
      document.querySelector('#wverw').click(); const zurueck = !document.documentElement.dataset.up.includes('bordkanone');
      /* v5.75: Körperbau wirkt als Vorschau (Kopf wird größer), gesperrte Extras lassen sich ohne Testmodus nicht wählen */
      const ti = T.findIndex(t => t.id === 'typ-alle'); WERFT._thema(ti); WERFT._wahl(T[ti].opts.findIndex(o => (o.w || o.id) === 'puppe'));
      const typ = S.cfg.look.typAlle === 'puppe' && FIGUREN.figur('smilla', {blick: 'vorn', dreh: false}).includes('scale(0.82');
      const li = T.findIndex(t => t.id === 'licht'); WERFT._thema(li); WERFT._wahl(T[li].opts.findIndex(o => o.w === 'abend')); await new Promise(x => setTimeout(x, 900)); const licht = !!document.querySelector('#werft2 .fb-atmo .fa-strahlen');
      document.querySelector('#wverw').click(); const typZurueck = !S.cfg.look.typAlle;
      S.cfg.look.test = false; WERFT._thema(bug); WERFT._wahl(T[bug].opts.findIndex(o => o.w === 'bordkanone'));
      const gesperrt = !document.documentElement.dataset.up.includes('bordkanone'); S.cfg.look.test = true;
      WERFT._thema(bug); WERFT._wahl(T[bug].opts.findIndex(o => o.w === 'anker')); document.querySelector('#wueb').click();
      await new Promise(x => setTimeout(x, 300));
      const gesp = JSON.parse(localStorage.getItem('skipper-sbfsee-v1')).cfg.look || {};
      return {film, crewZu, vorschau, zurueck, typ, licht, typZurueck, gesperrt, gespeichert: (gesp.up || []).includes('anker'), zu: !document.getElementById('werft2')};
    });
    r.film && r.crewZu ? ok('Werft: Filmbühne sichtbar') : schlecht('Werft: Bühne verdeckt oder leer ' + JSON.stringify(r));
    r.vorschau && r.zurueck ? ok('Werft: Vorschau wirkt, Verwerfen stellt zurück') : schlecht('Werft: Vorschau/Verwerfen ' + JSON.stringify(r));
    r.licht ? ok('Werft: Licht „Abendgold“ wirkt (Lichtbahnen)') : schlecht('Werft: Licht ' + JSON.stringify(r));
    r.typ && r.typZurueck ? ok('Werft: Körperbau wirkt, Verwerfen stellt zurück') : schlecht('Werft: Körperbau ' + JSON.stringify(r));
    r.gesperrt ? ok('Werft: gesperrte Extras bleiben ohne Testmodus zu') : schlecht('Werft: Sperre ' + JSON.stringify(r));
    r.gespeichert && r.zu ? ok('Werft: Übernehmen speichert und schließt') : schlecht('Werft: Übernehmen ' + JSON.stringify(r));
    errs.length ? schlecht('Konsole (Werft): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (Werft)'); await ctx.close(); }
  /* v5.80/v5.81 Menüs im Standard-Glas (E34, E35): Kajüte als Panorama zum Wischen (Crew, Knotenbrett, Tisch, Hocker im Startbild, Bücher links, Niedergang rechts);
     Knotenbrett-Zoom: Filz füllt die Breite, die Überblendung deckt das Brett, Schilder-Schrift passt; Kopf dreht sich beim Sprechen, Mund geht auf;
     Knotenwurm mit Achtknoten; Knotenbilder aus den Endbildern; Fabelwesen im Aquarell; Backbord läuft ohne Posenwechsel */
  { const ctx = await b.newContext({viewport: {width: 400, height: 930}}); const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
    await p.goto('http://localhost:8765/docs/entwuerfe/menue-standard.html'); await sleep(2000);
    /* an Deck: Sprecher dreht den Kopf her, Mund öffnet mit dem Pegel */
    const dk = await p.evaluate(async () => { FILMB.sprecher('HINNERK'); FILMB.pegel(.9); await new Promise(r => setTimeout(r, 450));
      const w = document.querySelector('#b .cr-hinnerk [data-wende]'), vorn = w && w.querySelector('.kw-v').style.display !== 'none' && w.querySelector('.kw-s').style.display === 'none';
      const a = w && w.querySelector('.kw-v .m-auf'), offen = a ? +((a.getAttribute('transform') || '').match(/scale\([\d.]+ ([\d.]+)\)/) || [0, 0])[1] : 0;
      FILMB.sprecher(''); FILMB.pegel(null); await new Promise(r => setTimeout(r, 900)); const zurueck = w && w.querySelector('.kw-s').style.display !== 'none';
      return {vorn, offen, zurueck}; });
    dk.vorn && dk.offen > .5 && dk.zurueck ? ok(`Deck: beim Sprechen Kopf her, Mund auf (${dk.offen.toFixed(2)}), danach zurück`) : schlecht('Deck Sprechen ' + JSON.stringify(dk));
    await p.click('[data-b="kajuete"]'); await sleep(1800);
    const r = await p.evaluate(() => { const bw = document.getElementById('bw').getBoundingClientRect(), drin = id => { const e = document.querySelector('#b #' + id); if (!e) return false; const q = e.getBoundingClientRect(); return q.left >= bw.left - 2 && q.right <= bw.right + 2 && q.top >= bw.top - 2 && q.bottom <= bw.bottom + 2; };
      const start = ['fk-knotenbrett', 'fk-hinnerk', 'fk-smilla', 'fk-tischplatte', 'fk-hocker', 'fk-klabauter', 'fk-backbord'].filter(id => !drin(id));
      const img = document.querySelectorAll('#b #fk-knotenbrett image').length, kb = KNOTEN.endbild('palstek', {skala: 1});
      const fab = FIGUREN.figur('muschelwicht', {}).includes('st-aquarell') && !FIGUREN.figur('hinnerk', {}).includes('st-aquarell');
      const kat = [0, .2, .4, .6, .8].map(t => FIGUREN.figur('backbord', {pose: 'laufen', dreh: false, gang: {art: 'springen', t}}).length > 500).every(Boolean);
      const wurm = (FIGUREN.figur('knotenwurm', {dreh: false}).match(/stroke="#6b4a26"/g) || []).length;
      return {start, img, kb: kb.startsWith('data:image/png'), fab, kat, wurm}; });
    r.start.length ? schlecht('Kajüte: im Startbild fehlt ' + r.start.join(', ')) : ok('Kajüte: Crew, Knotenbrett, Tisch, Hocker und Backbord im Startbild');
    r.img === 9 && r.kb ? ok('Knotenbrett: neun Knotenbilder aus den Endbildern') : schlecht('Knotenbrett: Bilder ' + r.img + ' ' + r.kb);
    r.fab ? ok('Fabelwesen im Aquarell, Crew mit Umriss') : schlecht('Fabelwesen: Stil falsch');
    r.kat ? ok('Backbord: Sprung als Gangart ohne Posenwechsel') : schlecht('Backbord: Sprung zeichnet nicht');
    r.wurm >= 9 ? ok(`Knotenwurm: Körper ist ein Achtknoten (${r.wurm} Taustücke mit Über/Unter)`) : schlecht('Knotenwurm: kein Achtknoten ' + r.wurm);
    /* Wischen: links die Bücher, rechts der Niedergang */
    const wi = await p.evaluate(async () => { const pa = document.getElementById('pano'), bw = document.getElementById('bw').getBoundingClientRect(), sicht = id => { const q = document.querySelector('#b #' + id).getBoundingClientRect(); return q.right > bw.left && q.left < bw.right; };
      pa.scrollLeft = 0; await new Promise(r => setTimeout(r, 400)); const links = sicht('fk-buecher');
      pa.scrollLeft = pa.scrollWidth; await new Promise(r => setTimeout(r, 400)); const rechts = sicht('fk-niedergang') && sicht('fk-glocke');
      return {links, rechts}; });
    wi.links && wi.rechts ? ok('Kajüte: Wischen zeigt links das Bücherregal, rechts Niedergang und Glocke') : schlecht('Wischen ' + JSON.stringify(wi));
    await p.click('[data-b="knoten"]'); await sleep(4400);
    const z = await p.evaluate(() => { const g = document.querySelector('#b #fk-knotenbrett').getBoundingClientRect(), n = document.querySelector('.nah'), bw = document.getElementById('bw').getBoundingClientRect();
      if (!n) return {n: false}; const q = n.getBoundingClientRect(), filz = n.querySelector('rect[fill="#2c3e54"]').getBoundingClientRect();
      const zuBreit = [...n.querySelectorAll('text')].filter(t => { const pl = t.previousElementSibling && t.previousElementSibling.tagName === 'path' ? t.previousElementSibling.previousElementSibling : null; const pw = pl ? pl.getBoundingClientRect().width : 1e9; return t.getBoundingClientRect().width > pw + .5; }).length;
      return {n: true, d: Math.max(Math.abs(g.left - q.left), Math.abs(g.top - q.top), Math.abs(g.width - q.width), Math.abs(g.height - q.height)), filz: filz.width / bw.width, zuBreit}; });
    z.n && z.d < 6 && z.filz > .9 ? ok(`Knotenbrett: Filz füllt ${Math.round(z.filz * 100)} % der Breite, Überblendung deckt das Brett`) : schlecht('Knotenbrett-Zoom ' + JSON.stringify(z));
    z.zuBreit === 0 ? ok('Knotenbrett: jede Schrift passt auf ihr Schild') : schlecht(`Knotenbrett: ${z.zuBreit} Schriften zu breit`);
    errs.length ? schlecht('Konsole (Menüs): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (Menüs)'); await ctx.close(); }
  await b.close();
  console.log(fehler.length ? `${fehler.length} Fehler.` : 'Bühne in Ordnung.'); process.exit(fehler.length ? 1 : 0);
})();
