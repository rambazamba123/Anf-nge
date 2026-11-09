/* Bühnentest der Hörreise (docs/fehler-katalog.md Teil B): findet Fehler, die frühere Läufe erst am Handy des Nutzers gezeigt haben.
   Aufruf: python3 -m http.server 8765 (im Repo, eigenes Fenster), dann node tests/buehne-pruefen.js
   Prüft mit Gratis-Stimme (schnell gestellt) und Handy-Maßen (Pixel 7):
   1. Gesichter springen nicht: Position jedes Gesichts bleibt beim Sprecherwechsel gleich (v5.54, v5.55, v5.56).
   2. Die Frage ist oben nicht abgeschnitten (v5.56: Flex-Zentrierung schob lange Fragen über den Rand).
   3. Eine Animation, die das Skript ohne Phasen aufruft, läuft weiter (v5.56: Anlegen blieb im ersten Bild stehen).
   4. Vor Harms verabschiedet sich die Crew, danach ist Harms allein; seine Frage hat Easy/Tricky (HR45).
   5. Feste Crew ohne Namensschild (HR42).
   6. Keine Fehler in der Konsole. */
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
  await p.evaluate(async id => { await nachladen('kurs.js'); VOX.phoneTest = () => new Promise(r => setTimeout(() => r(true), 700)); KURS.oeffnen(id); }, id); await sleep(2500);
  await p.click('#kzahn'); await sleep(300);
  const gefunden = await p.evaluate(t => { const x = [...document.querySelectorAll('#kursplayer [data-ab]')].find(e => e.textContent.startsWith(t)); if (x) x.click(); return !!x; }, abschnitt);
  if (!gefunden) schlecht(`${id}: Abschnitt „${abschnitt}“ nicht gefunden`);
  await sleep(200); const z = await p.$('#kzu'); if (z && await z.isVisible()) await z.click();
  return {p, ctx, errs};
}
/* Position der Gesichter (Rahmen .kg), gerundet; bei schaukelndem Boot schwankt sie um wenige Pixel, Sprünge sind größer */
const lage = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('#kges .kpl')].map(e => { const r = (e.querySelector('.kg') || e).getBoundingClientRect(); return [e.dataset.w + (e.classList.contains('an') ? '*' : ''), [r.x, r.y, r.width]]; })));

(async () => {
  const b = await pw.chromium.launch();
  /* 1 und 5: Tankstelle (Gast und Crew), Sprecherwechsel */
  { const {p, ctx, errs} = await oeffne(b, 'reise-1-2', 'Die Gasflasche'); let vorher = null, spruenge = 0, wechsel = 0;
    for (let i = 0; i < 70; i++) { await sleep(150); const l = await lage(p); const sp = Object.keys(l).find(k => k.endsWith('*'));
      if (vorher && sp && vorher.sp !== sp) { wechsel++; for (const [k, v] of Object.entries(l)) { const w = k.replace('*', ''), a = vorher.l[w] || vorher.l[w + '*']; if (a && (Math.abs(a[1] - v[1]) > 6 || Math.abs(a[2] - v[2]) > 4)) spruenge++; } }
      const n = {}; for (const [k, v] of Object.entries(l)) n[k.replace('*', '')] = v; vorher = {sp, l: n}; }
    wechsel ? (spruenge ? schlecht(`Gesichter springen beim Sprecherwechsel (${spruenge}×)`) : ok(`Gesichter bleiben stehen (${wechsel} Sprecherwechsel)`)) : schlecht('kein Sprecherwechsel beobachtet');
    const namen = await p.evaluate(() => [...document.querySelectorAll('#kges .kpl .kn')].map(e => e.closest('.kpl').dataset.w));
    namen.some(w => ['HINNERK', 'SMILLA', 'KLABAUTER', 'BACKBORD'].includes(w)) ? schlecht('Feste Crew hat Namensschilder: ' + namen.join(', ')) : ok('Namensschilder nur bei Gästen');
    errs.length ? schlecht('Konsole (1-2): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (1-2 Gasflasche)'); await ctx.close(); }
  /* 4 und 2: Harms ruft an */
  { const {p, ctx, errs} = await oeffne(b, 'reise-1-1', 'Harms ruft an'); let gingen = false, allein = false;
    for (let i = 0; i < 150; i++) { await sleep(300); const s = await p.evaluate(() => ({g: !!document.querySelector('#kges .kpl.geht'), w: [...document.querySelectorAll('#kges .kpl')].map(e => e.dataset.w), f: !!document.querySelector('#kwahl .kharms')}));
      if (s.g) gingen = true; if (s.w.length === 1 && s.w[0] === 'HARMS') allein = true; if (s.f) break; }
    gingen ? ok('Crew verabschiedet sich vor Harms') : schlecht('Crew geht vor Harms nicht ab'); allein ? ok('Harms ist allein') : schlecht('Harms nicht allein auf der Bühne');
    const f = await p.evaluate(() => { const k = document.querySelector('#kwahl .kfrage'); if (!k) return null; const r = k.getBoundingClientRect(); return {top: r.top, et: !!k.querySelector('[data-et]'), harms: !!k.querySelector('.kharms')}; });
    if (!f) schlecht('Harms-Frage erscheint nicht'); else { f.top >= 0 ? ok('Frage oben nicht abgeschnitten') : schlecht(`Frage oben abgeschnitten (${Math.round(f.top)} px)`); f.et && f.harms ? ok('Harms über der Frage, Easy/Tricky da') : schlecht('Harms-Kopf oder Easy/Tricky fehlt'); }
    errs.length ? schlecht('Konsole (1-1): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (1-1 Harms)'); await ctx.close(); }
  /* 3: Animation ohne Phasen läuft weiter (Der Raser: [[ANIM: gleiter]]) */
  { const {p, ctx, errs} = await oeffne(b, 'reise-1-3', 'Der Raser'); let erst = null, spaeter = null;
    for (let i = 0; i < 120; i++) { await sleep(400); const t = await p.evaluate(() => { const s = document.querySelector('#kbild svg'); return s ? [...s.querySelectorAll('text')].map(x => x.textContent).join('|') : null; }); if (t && !erst) erst = t; if (erst && t && t !== erst) { spaeter = t; break; } }
    !erst ? schlecht('Animation im Raser erscheint nicht') : spaeter ? ok('Animation ohne Phasen läuft weiter') : schlecht('Animation bleibt im ersten Bild stehen');
    errs.length ? schlecht('Konsole (1-3): ' + errs.slice(0, 3).join(' | ')) : ok('Konsole fehlerfrei (1-3 Raser)'); await ctx.close(); }
  await b.close();
  console.log(fehler.length ? `${fehler.length} Fehler.` : 'Bühne in Ordnung.'); process.exit(fehler.length ? 1 : 0);
})();
