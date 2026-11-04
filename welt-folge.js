/* welt-folge.js: Folgen in der 3D-Welt abspielen. v5.22: Schritte {k} (Kompetenz), {melde}, {gehoert}, {strom}, {heft}, {wennFrei, dann, sonst}; Folge-Feld ziele (Kompetenzen). Drehbuch in data/welt-folgen.json, die Welt liefert WELT.api.
   Schritte: {wer, t} sprechen · {kamera} · {crew: {wer: platz}} · {ort} · {wetter} · {auto: [[x, z(, h)]], gas, raffer} Autopilot
   {frage: n} amtliche Frage · {wahl: {t, opts}} · {ziel: {x, z, r, name, h}} · {selbst: 'ziel' | 'horn' | 'anlegen' | 'motor', max, hinweis, auto, ansage}
   {ton: '▬'} Signal des anderen Schiffs · {knoten: id} · {modell: Text} · {warte: Sekunden} · {szene: 'kajuete' | 'welt'} · {ende: true}
   {gast: {wer: 'hafen'|'jasper', x, z, von, blick} geht auf dem Steg an seinen Platz · {gast: {wer, kajuete: true}} steht in der Kajüte · {gast: {wer, weg: true}}}
   Gespräch und Scheinwahl: {wahl: {t, opts: [{t, dann: [Schritte]}]}}: Jede Antwort hat ihre eigene Reaktion, gespielt wird nur die gewählte (E21).
   v5.20: {aufgabe: Text | null} bleibt oben stehen · {notiz} kurz einblenden · {punkte: {ziel, teile, zeige, falsch}} Teile am 3D-Boot antippen
   {treibe: {x, z, h, sek, rums}} Boot ohne Physik bewegen · {fest: {x, z, h}} an den Steg holen · {freigabe: id, ok} · {freigaben: true} Liste „Was ich an Bord darf“
   {logbuch: Text} · {zettel: {titel, zeilen}} Bild zum Anschauen · {halt: Text} Haltepunkt (später genau hier weiter, S.folgen[id].i) · {navi: id} Aufgabe auf der Seekarte 7 (navi7.js)
   Bei selbst-Schritten zeigt {aufgabe} sofort, was zu tun ist (Nutzer 03.11.2026).
   v5.21 Crew-Regisseur (crew.js): {merke: 'merkmal'} schreibt ins Crew-Gedächtnis · {plaudern: 'kajuete'|'fahrt'|'hafen'} die Crew redet von selbst
   (passendes Gespräch aus data/crew-dialoge.json oder Schweigen) · {auto: …, plaudern: 'fahrt'} redet während der Fahrt.
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
  if (f.ort) api.ort(f.ort); if (f.wetter) api.wetter(f.wetter); api.karte(!!f.karte);
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
  if (s.selbst) { if (s.aufgabe) api.aufgabe(s.aufgabe); let r; try { r = await selbst(s, api); } finally { if (s.aufgabe) api.aufgabe(null); } /* vor auto: selbst-Schritte haben eine Ersatzroute im Feld auto */
    if (s.k && r && api.modus !== 'auto' && !r.hilfe) await gemeldet(api, s.k, 'c', r.ok, {lage: s.lage || f.id});
    if (api.folge) (api.folge.selbst = api.folge.selbst || []).push(Object.assign({k: s.k, art: s.selbst}, r || {})); return r; }
  if (s.melde) return gemeldet(api, s.melde.k, s.melde.dim || 'b', s.melde.ok !== false, {lage: f.id});
  if (s.gehoert) { if (window.LERN) (Array.isArray(s.gehoert) ? s.gehoert : [s.gehoert]).forEach(LERN.gehoert); return; }
  if ('karte' in s) return api.karte(!!s.karte);
  if (s.pfeife) return api.pfeife();
  if (s.besuch) return api.besuch(s.besuch);
  if (s.besuchWeg) return api.besuchWeg();
  if ('anker' in s) return api.anker(s.anker === 'auf');
  if ('strom' in s) { api.strom(s.strom); if (s.strom && s.strom.v) return api.notiz(`🌊 Strom: ${String(s.strom.v).replace('.', ',')} m/s nach ${s.strom.nach}°`, 3000); return; }
  if (s.heft) return heftTafel(api, s.heft === true ? (f.ziele || []) : s.heft);
  /* Die Geschichte richtet sich nach dem Ausbildungsheft: Was freigegeben ist, machst du; sonst macht es die Crew (Gutachten §3.3) */
  if (s.wennFrei) { const ja = window.LERN && LERN.darf(s.wennFrei); for (const d of (ja ? s.dann : s.sonst) || []) { if (!api.laeuft) return; await schritt(d, api, f); } return; }
  if (s.teil) return api.notiz('<b>' + esc2(s.teil) + '</b>', 2200);
  if ('aufgabe' in s) return api.aufgabe(s.aufgabe);
  if (s.notiz) return api.notiz(s.notiz);
  if (s.punkte) { const r = await api.punkte(s.punkte); if (s.k && !s.punkte.zeige && api.modus !== 'auto') await gemeldet(api, s.k, s.dim || 'b', r === true, {lage: f.id}); return r; }
  if (s.treibe) return api.treibe(s.treibe);
  if (s.fest) return api.fest(s.fest);
  /* v5.22: {freigabe: 'K-…'} zählt nichts mehr, es zeigt nur den Stand im Ausbildungsheft (gezählt wird beim Tun, Gutachten W1); alte IDs werden umgestellt */
  if (s.freigabe) { if (!window.LERN) return; const k = LERN.ALT[s.freigabe] || s.freigabe; return api.notiz(`📒 <b>${esc2(LERN.name(k))}</b><br>${LERN.text(k)}`, 3200); }
  if (s.freigaben) return heftTafel(api, f.ziele || []);
  if (s.logbuch) { try { S.reise = S.reise || {}; S.reise.log = S.reise.log || []; S.reise.log.push({d: new Date().toISOString().slice(0, 10), tag: f.nr || 0, text: s.logbuch}); save(); AUD.sfx('bleistift', {vol: .5, dur: .9}); } catch (e) {} return api.notiz('📓 <b>Logbuch</b><br>' + esc2(s.logbuch), 4200); }
  if (s.zettel) return zettel(api, s.zettel);
  if (s.halt) return halt(api, s);
  if (s.navi) return navi(api, s.navi);
  if (s.auto) { const fahrt = api.auto(s.auto, {gas: s.gas, raffer: s.raffer, wer: s.steuert}); if (s.plaudern && window.CREWDIR) await CREWDIR.plaudern(s.plaudern, (w, t) => api.sprich(w, t)); return fahrt; }
  if (s.merke) { if (window.CREWDIR) (Array.isArray(s.merke) ? s.merke : [s.merke]).forEach(CREWDIR.merke); return; }
  if (s.plaudern) return window.CREWDIR ? CREWDIR.plaudern(s.plaudern, (w, t) => api.sprich(w, t)) : null;
  if (s.szene) return api.szene(s.szene);
  if (s.wer) return api.sprich(s.wer, s.t);
  if (s.kamera) return api.kamera(s.kamera);
  if (s.crew) { for (const w in s.crew) api.crewGehe(w, s.crew[w]); return; }
  if (s.ort) return api.ort(s.ort);
  if (s.wetter) return api.wetter(s.wetter);
  if (s.frage) return api.frage(s.frage, s.fragt);
  if (s.wahl) { const i = await api.wahl(s.wahl, s.fragt), o = s.wahl.opts[i];
    /* Verständnis: Eine Wahl mit richtig/falsch zählt für die Kompetenz k (im Hörmodus wählt die App, das zählt nicht); melde an einer Antwort zählt eigens (z. B. „Hält er? Ehrlich.“) */
    if (o && api.modus !== 'auto') { if (s.k && o.ok != null) await gemeldet(api, s.k, 'b', o.ok, {lage: f.id}); if (o.melde) await gemeldet(api, o.melde.k, o.melde.dim || 'e', o.melde.ok !== false, {lage: f.id}); }
    if (o && o.dann) for (const d of o.dann) { if (!api.laeuft) return; await schritt(d, api, f); } return i; }
  if (s.gast) return api.gast(s.gast);
  if ('ziel' in s) return api.ziel(s.ziel);
  if (s.ton) return api.ton(s.ton);
  if (s.knoten) return api.knoten(s.knoten);
  if (s.modell) return api.modell(s.modell);
  if (s.warte) return new Promise(r => setTimeout(r, s.warte * 1000));
  if (s.ende) return ende(api, f);
}
/* Ins Ausbildungsheft eintragen; wird eine Kompetenz neu freigegeben, merkt die Crew es (Hinnerk lobt nie direkt) */
async function gemeldet(api, k, dim, ok, info) { if (!window.LERN || !k) return; const r = LERN.melde(k, dim, ok, info); if (!r || !r.neu) return;
  /* Hinnerk sagt nie „freigegeben“, er hat seine eigenen Wörter (docs/reise.md §2); manchmal zündet er sich nur wortlos die Pfeife an */
  const zufall = a => a[Math.floor(Math.random() * a.length)];
  if (r.nach === 'freigegeben') { api.notiz(`📒 ${esc2(LERN.name(k))}: <b>gehört jetzt dir</b>`, 3600); if (Math.random() < .3) { api.pfeife(); await api.sprich('smilla', 'Er zündet sich die Pfeife an. Das heißt: gut.'); } else await api.sprich('hinnerk', zufall(['Dat gehört jetzt dir.', 'Mach du man.', 'Kannst du. Ab jetzt du.'])); await api.sprich('klabauter', zufall(['Darf! Darf!', 'Kann er! Kann er!'])); }
  else if (r.nach === 'sicher') { api.notiz(`📒 ${esc2(LERN.name(k))}: <b>sitzt</b>`, 3600); await api.sprich('hinnerk', zufall(['Sitzt wie \'n Webeleinstek.', 'Dat sitzt.'])); }
  else if (r.nach === 'geuebt' && r.vor !== 'geuebt') api.notiz(`📒 Geübt: ${esc2(LERN.name(k))}`, 2400); }
const nah = (api, z) => Math.hypot(api.P.x - z.x, api.P.z - z.z) < (z.r || 6);
/* Selbst machen (v5.22, Strategie-Gutachten §3.6): keine Uhr mehr. Hilfe gibt es nur auf Wunsch („🤖 Hinnerk übernimmt“) oder nach Fehlversuchen.
   Gemessen wird, was die Welt sowieso erkennt: Zusammenstöße, Tonnen auf der falschen Seite, zu schnell im Hafen. Rückgabe {ok, hilfe, werte}.
   Mit {k: 'K-…'} zählt das Ergebnis im Ausbildungsheft (Dimension Können, ohne Hilfe und ohne Rempler). Im Hörmodus bleibt die Aufgabe offen.
   Neue Arten: ablegen, aufstoppen, wenden {r}, kurs {kurs, tol, sek}, mob {mob, ruf}, begegnung {begegnung: {art, abstand, v}}; motor {stoerung: 'warm'}. */
/* Hilfe: Wer übernehmen soll, tippt auf ein Gesicht (Hinnerk schnell, Smilla nach Regeln). Rückgabe 'ok' oder der Name, der übernommen hat. */
function mitHilfe(api, fn) { let per = null; api.angebot().then(k => { if (k) per = api.hilfeWer || 'hinnerk'; });
  return api.warte(() => per || fn()).then(() => { api.angebotWeg(); return per || 'ok'; }); }
const stilVon = r => ({wer: r === 'smilla' ? 'smilla' : 'hinnerk', stil: r === 'smilla' ? 'smilla' : 'hinnerk', gas: r === 'smilla' ? .4 : .8});
const grad = h => Math.round(((h * 180 / Math.PI) % 360 + 360) % 360);
async function selbst(s, api) {
  const z = api.zielDef, M0 = {st: api.stoesse, dn: api.mess.daneben, sn: api.mess.schnell};
  const werte = () => ({stoesse: api.stoesse - M0.st, daneben: api.mess.daneben - M0.dn, schnell: api.mess.schnell - M0.sn});
  const fertig = (ok, hilfe, extra) => Object.assign({ok: !!ok && !hilfe, hilfe: !!hilfe, werte: werte()}, extra || {});
  if (api.modus === 'auto') return autoSelbst(s, api, z);
  if (s.hinweis) api.sprich(s.selbst === 'anlegen' || s.selbst === 'begegnung' ? 'smilla' : 'hinnerk', s.hinweis);
  if (s.selbst === 'horn') {
    const h0 = api.hornZahl, r = await mitHilfe(api, () => api.hornZahl > h0);
    if (r === 'ok') { await api.sprich('smilla', s.gut || 'Gut gehört. So weiß jeder, dass hier ein Boot fährt.'); return fertig(true, false); }
    await api.sprich('smilla', 'So klingt es:'); api.ton('▬'); return fertig(false, true);
  }
  if (s.selbst === 'motor') {
    if (api.motor === 'an' && !s.stoerung) return fertig(true, false);
    if (s.stoerung) api.motorStoerung(s.stoerung);
    api.motorOffen(); const r = await mitHilfe(api, () => api.motor === 'an'); api.motorZu();
    if (r === 'ok') { await api.sprich('hinnerk', s.gut || 'Läuft.'); return fertig(true, false); }
    api.motorAn(); await api.sprich('hinnerk', 'Ich mach das. Quickstopp rein, Tank auf, pumpen, Choke, Neutral, starten.'); return fertig(false, true);
  }
  if (s.selbst === 'kurs') { /* Steuern nach Kompass: Kurs halten, bis er eine Weile anliegt (Dauer der Übung, keine Entscheidungsuhr) */
    const soll = s.kurs, tol = s.tol || 8, dauer = s.sek || 20; let seit = null;
    const lauf = setInterval(() => api.aufgabe(`Kurs ${soll}° steuern und halten · Kompass: ${grad(api.P.h)}°`), 400);
    const r = await mitHilfe(api, () => { const ab = Math.abs(((grad(api.P.h) - soll + 540) % 360) - 180); if (ab <= tol && api.grundFahrt > .8) { if (seit == null) seit = api.uhr; return api.uhr - seit >= dauer; } seit = null; return false; });
    clearInterval(lauf); api.aufgabe(null);
    if (r === 'ok') { await api.sprich('smilla', s.gut || 'Kurs liegt an. So meldest du das auch: „Kurs liegt an.“'); return fertig(true, false); }
    await api.sprich('hinnerk', 'Ich nehm sie. Kleine Ausschläge, früh gegensteuern.'); return fertig(false, true);
  }
  if (s.selbst === 'mob') { /* Mensch über Bord: Puppe treibt achteraus, ranfahren, längsseits, auskuppeln */
    api.mob(s.mob || {}); if (s.ruf) await api.sprich(s.ruf.wer || 'klabauter', s.ruf.t);
    const r = await mitHilfe(api, () => api.mobErreicht);
    if (r === 'ok') { await api.sprich('hinnerk', s.gut || 'Hab ihn. Schraube steht.'); api.mobWeg(); return fertig(true, false); }
    await api.sprich('hinnerk', 'Ich fahr. Heck weg, gegen den Wind ran, auskuppeln.'); api.mobWeg(); return fertig(false, true);
  }
  if (s.selbst === 'begegnung') { /* Ausweichen nach den Regeln: Seite, Zeitpunkt und Abstand werden gemessen */
    const b = s.begegnung || {art: 'entgegen'}, e = await api.begegnung(b), wir = b.art !== 'kreuzLinks';
    const ok = e.cpa >= (s.abstand || 12) && (!wir || (e.stb && e.frueh)) && api.stoesse === M0.st;
    if (ok) await api.sprich('smilla', s.gut || (wir ? 'Früh und deutlich nach Steuerbord. Genau so.' : 'Richtig: Kurs und Fahrt gehalten, der andere musste ausweichen.'));
    else if (wir && !e.stb) await api.sprich('smilla', s.falsch || 'Du hättest nach Steuerbord ausweichen müssen, früh und deutlich.');
    else if (wir && !e.frueh) await api.sprich('smilla', 'Richtige Seite, aber spät. Früh und deutlich, damit der andere es sieht.');
    else await api.sprich('smilla', 'Zu dicht. Mehr Abstand halten.');
    return fertig(ok, false, {begegnung: e});
  }
  if (!z) return fertig(false, false);
  if (s.selbst === 'ziel' || s.selbst === 'ablegen') {
    const weg = (s.auto || []).concat([[z.x, z.z]]); let drin = false; /* meide {x, z, r}: Gefahrenbereich (z. B. zwischen Kardinaltonne und Wrack); Hineinfahren zählt als Fehler */
    const r = await mitHilfe(api, () => { if (s.meide && !drin && Math.hypot(api.P.x - s.meide.x, api.P.z - s.meide.z) < s.meide.r) { drin = true; api.notiz(s.falsch || 'Zu nah an der Gefahr!', 4500); } return nah(api, z); });
    if (r === 'ok') return fertig(api.stoesse === M0.st && !drin && (!s.tore || api.mess.daneben === M0.dn), false);
    await api.auto(weg, stilVon(r)); return fertig(false, true);
  }
  if (s.selbst === 'anhalten') { /* auf ein Signal hin anhalten (z. B. Polizei: kurz, lang, kurz, kurz) */
    let seit = null; const r = await mitHilfe(api, () => { if (api.grundFahrt < .3) { if (seit == null) seit = api.uhr; return api.uhr - seit > 1.5; } seit = null; return false; });
    if (r === 'ok') { if (s.gut) await api.sprich('smilla', s.gut); return fertig(true, false); } return fertig(false, true);
  }
  if (s.selbst === 'aufstoppen') { /* im Ring zum Stehen kommen: Gas weg, kurz rückwärts, Fahrt über Grund fast null */
    let seit = null; const r = await mitHilfe(api, () => { if (nah(api, z) && api.grundFahrt < .25) { if (seit == null) seit = api.uhr; return api.uhr - seit > 1.5; } seit = null; return false; });
    if (r === 'ok') { await api.sprich('hinnerk', s.gut || 'Steht.'); return fertig(api.stoesse === M0.st, false); }
    await api.sprich('hinnerk', 'Gas weg, kurz zurück, wieder neutral. So.'); return fertig(false, true);
  }
  if (s.selbst === 'wenden') { /* Wenden auf engem Raum: um mindestens 160 Grad drehen, ohne den Kreis zu verlassen */
    let x0 = api.P.x, z0 = api.P.z, h0 = api.P.h, raus = 0; const R = s.r || 14;
    const r = await mitHilfe(api, () => { if (Math.hypot(api.P.x - x0, api.P.z - z0) > R) { raus++; x0 = api.P.x; z0 = api.P.z; h0 = api.P.h; api.notiz('Zu viel Platz gebraucht. Nochmal: vor, zurück, Pinne jedes Mal umlegen.'); return false; }
      return Math.abs(Math.atan2(Math.sin(api.P.h - h0), Math.cos(api.P.h - h0))) > 2.8; });
    if (r === 'ok') { await api.sprich('hinnerk', s.gut || 'Rum isse.'); return fertig(api.stoesse === M0.st, false, {raus}); }
    await api.sprich('hinnerk', 'Vor, zurück. Pinne jedes Mal umlegen.'); return fertig(false, true);
  }
  if (s.selbst === 'anlegen') {
    const zielH = [z.x, z.z, z.h || 0], weg = (s.auto || []).concat(z.anfahrt ? [z.anfahrt] : [], [zielH]);
    const r = await mitHilfe(api, () => api.angelegt(z));
    if (r === 'ok') { await api.fest(z); const st = api.stoesse - M0.st; await api.sprich('hinnerk', st ? 'Fest. Aber gerumst. Zählt noch nich.' : (s.gut || 'Fest.')); return fertig(!st, false); }
    await api.auto(weg, Object.assign(stilVon(r), {gas: .35, anfahrt: z.anfahrt})); return fertig(false, true);
  }
  return fertig(false, false);
}
/* Hörmodus: Hinnerk macht es, die Aufgabe bleibt im Heft offen */
async function autoSelbst(s, api, z) {
  if (s.k && window.LERN) LERN.offen(s.k, api.folge && api.folge.id);
  if (s.selbst === 'horn') { await new Promise(r => setTimeout(r, 1500)); api.ton('▬'); return {ok: false, hilfe: true}; }
  if (s.selbst === 'motor') { for (const t of s.ansage || []) await api.sprich('hinnerk', t); api.motorAn(); return {ok: false, hilfe: true}; }
  if (s.selbst === 'anhalten') return {ok: false, hilfe: true};
  if (['mob', 'begegnung', 'kurs', 'wenden', 'aufstoppen'].includes(s.selbst)) { for (const t of s.ansage || ['Im Hörmodus mach ich das. Am Handy übst du es selbst.']) await api.sprich('hinnerk', t); return {ok: false, hilfe: true}; }
  if (!z) return {ok: false, hilfe: true};
  if (s.selbst === 'anlegen') { await api.auto((s.auto || []).concat(z.anfahrt ? [z.anfahrt] : [], [[z.x, z.z, z.h || 0]]), {gas: .35, anfahrt: z.anfahrt}); return {ok: false, hilfe: true}; }
  await api.auto((s.auto || []).concat([[z.x, z.z]]), {gas: .6}); return {ok: false, hilfe: true};
}
/* Zettel, Bild oder Brief zum Anschauen (Platzhalter, bis die Grafik da ist) */
function zettel(api, z) { return new Promise(async res => { const el = api.tafel(`<div class="wzettel"><b>${esc2(z.titel || '')}</b>${(z.zeilen || []).map(t => `<p>${esc2(t)}</p>`).join('')}</div><button class="btn lamp wide" id="wzok">Weiter</button>`);
  if (api.modus === 'auto') { await new Promise(r => setTimeout(r, 2500)); api.tafelZu(); return res(); } el.querySelector('#wzok').onclick = () => { try { AUD.click(); } catch (e) {} api.tafelZu(); res(); }; }); }
/* „Was ich an Bord darf“: Auszug aus dem Ausbildungsheft (die Kompetenzen der Folge) */
function heftTafel(api, liste) { return new Promise(async res => { if (!window.LERN) return res(); const L = (liste || []).filter(Boolean);
  const el = api.tafel(`<p class="wqf">📒 <b>Was ich an Bord darf</b></p><table class="wfg">${L.map(k => `<tr><td>${esc2(LERN.name(k))}</td><td>${LERN.text(k)}</td></tr>`).join('')}</table><p class="small muted" style="margin:6px 0">Alles steht im Ausbildungsheft (Frei üben).</p><button class="btn lamp wide" id="wfgok">Weiter</button>`);
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
