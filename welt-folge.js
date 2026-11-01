/* welt-folge.js: Folgen in der 3D-Welt abspielen. Drehbuch in data/welt-folgen.json, die Welt liefert WELT.api.
   Schritte: {wer, t} sprechen · {kamera} · {crew: {wer: platz}} · {ort} · {wetter} · {auto: [[x, z(, h)]], gas, raffer} Autopilot
   {frage: n} amtliche Frage · {wahl: {t, opts}} · {ziel: {x, z, r, name, h}} · {selbst: 'ziel' | 'horn' | 'anlegen', max, hinweis, auto}
   {ton: '▬'} Signal des anderen Schiffs · {knoten: id} · {modell: Text} · {warte: Sekunden} · {ende: true}
   Hörmodus (🎧 Auto): Der Autopilot fährt die Strecken, Fragen werden vorgelesen und aufgelöst. */
(function () {
'use strict';
const F = window.WFOLGE = {}; let DATEN = null, aus = false;
F.stop = () => { aus = true; };
F.spiele = async function (id, api, ab = 0) {
  aus = false; if (!DATEN) DATEN = await fetch('data/welt-folgen.json?v=' + window.__ver).then(r => r.json());
  const f = DATEN.folgen.find(x => x.id === id); if (!f) return null;
  if (f.ort && !ab) api.ort(f.ort); if (f.wetter) api.wetter(f.wetter);
  let erg = null; for (let i = ab; i < f.schritte.length; i++) { if (aus || !api.laeuft) return null; F.i = i; erg = await schritt(f.schritte[i], api, f); }
  return erg;
};
F.daten = () => DATEN;
async function schritt(s, api, f) {
  if (s.selbst) return selbst(s, api); /* vor auto: selbst-Schritte haben eine Ersatzroute im Feld auto */
  if (s.auto) return api.auto(s.auto, {gas: s.gas, raffer: s.raffer, wer: s.steuert});
  if (s.wer) return api.sprich(s.wer, s.t);
  if (s.kamera) return api.kamera(s.kamera);
  if (s.crew) { for (const w in s.crew) api.crewGehe(w, s.crew[w]); return; }
  if (s.ort) return api.ort(s.ort);
  if (s.wetter) return api.wetter(s.wetter);
  if (s.frage) return api.frage(s.frage, s.fragt);
  if (s.wahl) return api.wahl(s.wahl, s.fragt);
  if ('ziel' in s) return api.ziel(s.ziel);
  if (s.ton) return api.ton(s.ton);
  if (s.knoten) return api.knoten(s.knoten);
  if (s.modell) return api.modell(s.modell);
  if (s.warte) return new Promise(r => setTimeout(r, s.warte * 1000));
  if (s.ende) return ende(api, f);
}
const nah = (api, z) => Math.hypot(api.P.x - z.x, api.P.z - z.z) < (z.r || 6);
/* Selbst steuern: Ziel erreichen, Horn geben oder anlegen. Klappt es nicht in der Zeit, übernimmt Hinnerk. */
async function selbst(s, api) {
  const z = api.zielDef;
  if (s.selbst === 'horn') {
    if (api.modus === 'auto') { await new Promise(r => setTimeout(r, 1500)); api.ton('▬'); return; }
    const h0 = api.hornZahl; if (await api.warte(() => api.hornZahl > h0, s.max || 45)) return api.sprich('smilla', s.gut || 'Gut gehört. So weiß jeder, dass hier ein Boot fährt.');
    await api.sprich('smilla', 'So klingt es:'); api.ton('▬'); return;
  }
  if (!z) return;
  if (s.selbst === 'ziel') {
    if (api.modus === 'auto') { await api.auto((s.auto || []).concat([[z.x, z.z]]), {gas: .6}); return; }
    if (s.hinweis) api.sprich('hinnerk', s.hinweis);
    if (await api.warte(() => nah(api, z), s.max || 240)) return;
    await api.sprich('hinnerk', 'Ich übernehme mal. Schau zu.'); await api.auto((s.auto || []).concat([[z.x, z.z]]), {gas: .6}); return;
  }
  if (s.selbst === 'anlegen') {
    const zielH = [z.x, z.z, z.h || 0];
    if (api.modus === 'auto') { await api.auto((s.auto || []).concat([zielH]), {gas: .35}); return; }
    if (s.hinweis) api.sprich('smilla', s.hinweis);
    const t0 = api.uhr; let tipp = 0;
    const ok = await api.warte(() => { if (api.uhr - t0 > 50 && !tipp) { tipp = 1; api.sprich('hinnerk', 'Langsamer! Kurz vor dem Steg Gas raus, dann kurz zurück zum Aufstoppen.'); } return api.angelegt(z); }, s.max || 240);
    if (ok) { await api.fest(z); return api.sprich('hinnerk', s.gut || 'Fest! Sauber angelegt.'); }
    await api.sprich('hinnerk', 'Ich leg an. Pass auf, wie langsam ich ran gehe.'); await api.auto((s.auto || []).concat([zielH]), {gas: .35});
  }
}
/* Ende: kurzer Logbuch-Eintrag */
function ende(api, f) {
  const Fo = api.folge || {fragen: [], wahlen: []}, r = Fo.fragen.filter(Boolean).length, w = Fo.wahlen.filter(Boolean).length, min = Math.max(1, Math.round((api.uhr - (Fo.start || 0)) / 60)), st = api.stoesse - (Fo.stoesse0 || 0);
  const el = api.tafel(`<p class="wqf">📓 <b>${f.titel || 'Folge'} geschafft</b></p>
    <p class="small">Prüfungsfragen: <b>${r} von ${Fo.fragen.length}</b> richtig${Fo.wahlen.length ? ` · Entscheidungen: <b>${w} von ${Fo.wahlen.length}</b>` : ''}<br>Zusammenstöße: <b>${st}</b> · Dauer: etwa <b>${min} min</b></p>
    <button class="btn lamp wide" id="wfnochmal">🔁 Nochmal</button><button class="btn ghost wide" id="wffrei" style="margin-top:6px">⛵ Frei weiterfahren</button>`);
  api.sprich('klabauter', st ? 'Fest! Fest! Nur ' + st + ' Mal gerumst! Krrah!' : 'Fest! Fest! Kein Kratzer! Krrah!');
  return new Promise(res => { el.querySelector('#wfnochmal').onclick = () => { api.tafelZu(); res('nochmal'); }; el.querySelector('#wffrei').onclick = () => { api.tafelZu(); res('frei'); }; });
}
})();
