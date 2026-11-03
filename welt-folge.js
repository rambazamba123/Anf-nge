/* welt-folge.js: Folgen in der 3D-Welt abspielen. Drehbuch in data/welt-folgen.json, die Welt liefert WELT.api.
   Schritte: {wer, t} sprechen · {kamera} · {crew: {wer: platz}} · {ort} · {wetter} · {auto: [[x, z(, h)]], gas, raffer} Autopilot
   {frage: n} amtliche Frage · {wahl: {t, opts}} · {ziel: {x, z, r, name, h}} · {selbst: 'ziel' | 'horn' | 'anlegen' | 'motor', max, hinweis, auto, ansage}
   {ton: '▬'} Signal des anderen Schiffs · {knoten: id} · {modell: Text} · {warte: Sekunden} · {szene: 'kajuete' | 'welt'} · {ende: true}
   {gast: {wer: 'hafen'|'jasper', x, z, von, blick} geht auf dem Steg an seinen Platz · {gast: {wer, kajuete: true}} steht in der Kajüte · {gast: {wer, weg: true}}}
   Gespräch und Scheinwahl: {wahl: {t, opts: [{t, dann: [Schritte]}]}}: Jede Antwort hat ihre eigene Reaktion, gespielt wird nur die gewählte (E21).
   v5.20: {aufgabe: Text | null} bleibt oben stehen · {notiz} kurz einblenden · {punkte: {ziel, teile, zeige, falsch}} Teile am 3D-Boot antippen
   {treibe: {x, z, h, sek, rums}} Boot ohne Physik bewegen · {fest: {x, z, h}} an den Steg holen · {freigabe: id, ok} · {freigaben: true} Liste „Was ich an Bord darf“
   {logbuch: Text} · {zettel: {titel, zeilen}} Bild zum Anschauen · {halt: Text} Haltepunkt (später genau hier weiter, S.folgen[id].i) · {navi: id} Aufgabe auf der Seekarte 7 (navi7.js)
   Bei selbst-Schritten zeigt {aufgabe} sofort, was zu tun ist (Nutzer 03.11.2026).
   Hörmodus (🎧 Auto): Der Autopilot fährt die Strecken, Fragen werden vorgelesen und aufgelöst. */
(function () {
'use strict';
const F = window.WFOLGE = {}; let DATEN = null, lauf = 0;
F.stop = () => { lauf++; }; /* jede gestartete Folge hat ihre Nummer; eine beendete läuft nie weiter */
F.spiele = async function (id, api, ab = 0) {
  const mein = ++lauf; if (!DATEN) DATEN = await fetch('data/welt-folgen.json?v=' + window.__ver).then(r => r.json());
  /* Nach dem Beenden darf ein noch laufender Schritt nichts mehr auslösen: jeder Aufruf hängt dann still */
  api = new Proxy(api, {get(t, k) { const v = t[k]; return typeof v === 'function' ? (...a) => mein === lauf ? v(...a) : new Promise(() => {}) : v; }});
  const f = DATEN.folgen.find(x => x.id === id); if (!f) return null;
  if (f.ort) api.ort(f.ort); if (f.wetter) api.wetter(f.wetter);
  /* Weiter ab einem Haltepunkt: nur den Zustand (Ort, Wetter, Szene, Kamera) der Schritte davor herstellen */
  for (let i = 0; i < ab && i < f.schritte.length; i++) { const s = f.schritte[i]; if (s.ort) api.ort(s.ort); if (s.wetter) api.wetter(s.wetter); if (s.szene) api.szene(s.szene); if (s.kamera) api.kamera(s.kamera); }
  let erg = null; for (let i = ab; i < f.schritte.length; i++) { if (mein !== lauf || !api.laeuft) return null; F.i = i; erg = await schritt(f.schritte[i], api, f); if (erg === 'spaeter') { merke(id, i + 1); return 'spaeter'; } }
  if (mein === lauf) merke(id, 0, true);
  return mein === lauf ? erg : null;
};
F.daten = () => DATEN;
function merke(id, i, fertig) { try { if (!S.folgen || typeof S.folgen !== 'object') S.folgen = {}; const alt = S.folgen[id] || {}; S.folgen[id] = Object.assign(alt, {i}, fertig ? {fertig: new Date().toISOString().slice(0, 10)} : {}); save(); } catch (e) {} }
F.ab = id => { const x = window.S && S.folgen && S.folgen[id]; return x && x.i > 0 ? x.i : 0; };
const esc2 = t => String(t).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
async function schritt(s, api, f) {
  if (s.selbst) { if (s.aufgabe) api.aufgabe(s.aufgabe); try { return await selbst(s, api); } finally { if (s.aufgabe) api.aufgabe(null); } } /* vor auto: selbst-Schritte haben eine Ersatzroute im Feld auto */
  if (s.teil) return api.notiz('<b>' + esc2(s.teil) + '</b>', 2200);
  if ('aufgabe' in s) return api.aufgabe(s.aufgabe);
  if (s.notiz) return api.notiz(s.notiz);
  if (s.punkte) return api.punkte(s.punkte);
  if (s.treibe) return api.treibe(s.treibe);
  if (s.fest) return api.fest(s.fest);
  if (s.freigabe) { freigabeSetzen(s.freigabe, s.ok); return api.notiz(`📋 <b>${esc2(FREIGABEN[s.freigabe] || s.freigabe)}</b><br>${freigabeText(s.freigabe)}`, 3200); }
  if (s.freigaben) return freigabenTafel(api);
  if (s.logbuch) { try { S.reise = S.reise || {}; S.reise.log = S.reise.log || []; S.reise.log.push({d: new Date().toISOString().slice(0, 10), tag: f.nr || 0, text: s.logbuch}); save(); AUD.sfx('bleistift', {vol: .5, dur: .9}); } catch (e) {} return api.notiz('📓 <b>Logbuch</b><br>' + esc2(s.logbuch), 4200); }
  if (s.zettel) return zettel(api, s.zettel);
  if (s.halt) return halt(api, s);
  if (s.navi) return navi(api, s.navi);
  if (s.auto) return api.auto(s.auto, {gas: s.gas, raffer: s.raffer, wer: s.steuert});
  if (s.szene) return api.szene(s.szene);
  if (s.wer) return api.sprich(s.wer, s.t);
  if (s.kamera) return api.kamera(s.kamera);
  if (s.crew) { for (const w in s.crew) api.crewGehe(w, s.crew[w]); return; }
  if (s.ort) return api.ort(s.ort);
  if (s.wetter) return api.wetter(s.wetter);
  if (s.frage) return api.frage(s.frage, s.fragt);
  if (s.wahl) { const i = await api.wahl(s.wahl, s.fragt), o = s.wahl.opts[i]; if (o && o.dann) for (const d of o.dann) { if (!api.laeuft) return; await schritt(d, api, f); } return i; }
  if (s.gast) return api.gast(s.gast);
  if ('ziel' in s) return api.ziel(s.ziel);
  if (s.ton) return api.ton(s.ton);
  if (s.knoten) return api.knoten(s.knoten);
  if (s.modell) return api.modell(s.modell);
  if (s.warte) return new Promise(r => setTimeout(r, s.warte * 1000));
  if (s.ende) return ende(api, f);
}
const nah = (api, z) => Math.hypot(api.P.x - z.x, api.P.z - z.z) < (z.r || 6);
/* Selbst steuern: Ziel erreichen, Horn geben oder anlegen. Jederzeit „Hinnerk übernimmt“; nach max Sekunden übernimmt er von selbst. */
function mitHilfe(api, fn, max) { let per = null; api.angebot('🤖 Hinnerk übernimmt').then(k => { if (k) per = 'knopf'; });
  return api.warte(() => per || fn(), max).then(r => { api.angebotWeg(); return per || (r ? 'ok' : 'zeit'); }); }
async function selbst(s, api) {
  const z = api.zielDef;
  if (s.selbst === 'horn') {
    if (api.modus === 'auto') { await new Promise(r => setTimeout(r, 1500)); api.ton('▬'); return; }
    const h0 = api.hornZahl; if (await api.warte(() => api.hornZahl > h0, s.max || 45)) return api.sprich('smilla', s.gut || 'Gut gehört. So weiß jeder, dass hier ein Boot fährt.');
    await api.sprich('smilla', 'So klingt es:'); api.ton('▬'); return;
  }
  if (s.selbst === 'motor') { /* Motor selbst starten; im Hörmodus erklärt Hinnerk den Ablauf */
    if (api.motor === 'an') return;
    if (api.modus === 'auto') { for (const t of s.ansage || []) await api.sprich('hinnerk', t); api.motorAn(); return; }
    if (s.hinweis) api.sprich('hinnerk', s.hinweis); api.motorOffen();
    const r = await mitHilfe(api, () => api.motor === 'an', s.max || 240); api.motorZu();
    if (r === 'ok') return api.sprich('hinnerk', s.gut || 'Läuft. Sauber gemacht.');
    api.motorAn(); return api.sprich('hinnerk', 'Ich mach das. Quickstopp rein, Tank auf, pumpen, Choke, Neutral, starten.');
  }
  if (!z) return;
  if (s.selbst === 'ziel') {
    const weg = (s.auto || []).concat([[z.x, z.z]]);
    if (api.modus === 'auto') return api.auto(weg, {gas: .6});
    if (s.hinweis) api.sprich('hinnerk', s.hinweis);
    const r = await mitHilfe(api, () => nah(api, z), s.max || 300); if (r === 'ok') return;
    await api.sprich('hinnerk', r === 'zeit' ? 'Ich übernehme mal. Schau zu.' : 'Mach ich. Schau zu.'); return api.auto(weg, {gas: .6});
  }
  if (s.selbst === 'anlegen') {
    const zielH = [z.x, z.z, z.h || 0], weg = (s.auto || []).concat(z.anfahrt ? [z.anfahrt] : [], [zielH]);
    if (api.modus === 'auto') return api.auto(weg, {gas: .35, anfahrt: z.anfahrt});
    if (s.hinweis) api.sprich('smilla', s.hinweis);
    const r = await mitHilfe(api, () => api.angelegt(z), s.max || 300);
    if (r === 'ok') { await api.fest(z); return api.sprich('hinnerk', s.gut || 'Fest! Sauber angelegt.'); }
    await api.sprich('hinnerk', 'Ich leg an. Pass auf, wie langsam ich rangehe.'); return api.auto(weg, {gas: .35, anfahrt: z.anfahrt});
  }
}
/* Zettel, Bild oder Brief zum Anschauen (Platzhalter, bis die Grafik da ist) */
function zettel(api, z) { return new Promise(async res => { const el = api.tafel(`<div class="wzettel"><b>${esc2(z.titel || '')}</b>${(z.zeilen || []).map(t => `<p>${esc2(t)}</p>`).join('')}</div><button class="btn lamp wide" id="wzok">Weiter</button>`);
  if (api.modus === 'auto') { await new Promise(r => setTimeout(r, 2500)); api.tafelZu(); return res(); } el.querySelector('#wzok').onclick = () => { try { AUD.click(); } catch (e) {} api.tafelZu(); res(); }; }); }
/* „Was ich an Bord darf“ */
function freigabenTafel(api) { return new Promise(async res => { const el = api.tafel(`<p class="wqf">📋 <b>Was ich an Bord darf</b></p><table class="wfg">${Object.keys(FREIGABEN).map(id => `<tr><td>${esc2(FREIGABEN[id])}</td><td>${freigabeText(id)}</td></tr>`).join('')}</table><button class="btn lamp wide" id="wfgok">Weiter</button>`);
  if (api.modus === 'auto') { await new Promise(r => setTimeout(r, 3000)); api.tafelZu(); return res(); } el.querySelector('#wfgok').onclick = () => { try { AUD.click(); } catch (e) {} api.tafelZu(); res(); }; }); }
/* Haltepunkt: weiter oder später genau hier */
function halt(api, s) { if (api.modus === 'auto') return Promise.resolve(); return new Promise(res => { const el = api.tafel(`<p class="wqf">☕ <b>${esc2(s.halt)}</b></p><button class="btn lamp wide" id="whw">▶ Weiter</button><button class="btn ghost wide" id="whs" style="margin-top:6px">Später weiter</button>`);
  el.querySelector('#whw').onclick = () => { try { AUD.click(); } catch (e) {} api.tafelZu(); res(); }; el.querySelector('#whs').onclick = () => { try { AUD.click(); } catch (e) {} api.tafelZu(); res('spaeter'); }; }); }
/* Aufgabe auf der Seekarte 7 am Kartentisch (dieselben Aufgaben wie unter Frei üben) */
async function navi(api, id) {
  try { await window.nachladen('navi7.js'); await NAVI7.laden(); } catch (e) { return; }
  const def = NAVI7.bank().aufgaben.find(a => a.id === id); if (!def) return;
  const el = api.tafel(`<p class="wqf">🧭 <b>Am Kartentisch</b></p><div class="wnavi" id="wnavi"></div><div class="wnantw" id="wnantw"></div>`);
  try { await NAVI7.aufgabe(def, {host: el.querySelector('#wnavi'), antwort: el.querySelector('#wnantw'), sag: (w, t) => api.sprich(w, t), auto: api.modus === 'auto'}); } catch (e) { console.error(e); }
  try { if (window.NAV && NAV.revier) await NAV.revier('kliev'); } catch (e) {}
  api.tafelZu();
}
/* Ende: kurzer Logbuch-Eintrag */
function ende(api, f) {
  const Fo = api.folge || {fragen: [], wahlen: []}, r = Fo.fragen.filter(Boolean).length, w = Fo.wahlen.filter(Boolean).length, min = Math.max(1, Math.round((api.uhr - (Fo.start || 0)) / 60)), st = api.stoesse - (Fo.stoesse0 || 0);
  const el = api.tafel(`<p class="wqf">📓 <b>${f.titel || 'Folge'} geschafft</b></p>
    <p class="small">Prüfungsfragen: ${Fo.fragen.length ? `<b>${r} von ${Fo.fragen.length}</b> richtig` : 'angehört'}${Fo.wahlen.length ? ` · Entscheidungen: <b>${w} von ${Fo.wahlen.length}</b>` : ''}<br>Zusammenstöße: <b>${st}</b> · Dauer: etwa <b>${min} min</b></p>
    <button class="btn lamp wide" id="wfnochmal">🔁 Nochmal</button><button class="btn ghost wide" id="wffrei" style="margin-top:6px">⛵ Frei weiterfahren</button>`);
  api.sprich('klabauter', st ? 'Fest! Fest! Nur ' + st + ' Mal gerumst! Krrah!' : 'Fest! Fest! Kein Kratzer! Krrah!');
  return new Promise(res => { el.querySelector('#wfnochmal').onclick = () => { api.tafelZu(); res('nochmal'); }; el.querySelector('#wffrei').onclick = () => { api.tafelZu(); res('frei'); }; });
}
})();
