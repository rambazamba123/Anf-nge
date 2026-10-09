/* ==========================================================================
   Skipper – Törn 2.0 (CLAUDE.md 5.14)
   Nachgeladen über loadToern() in index.html; braucht navi.js (Karte, Rechnen, Mini-Karte).
   Teil 1: Kern ohne DOM (TOERN.core): Wetter, Aufgabenplan, Folgen, Simulation. Läuft auch in Node (tests/balancing.js).
   Teil 2: Oberfläche: Törnwahl, Aufwachen, Seewetterbericht, Fahrt (Sicht vom Steuer als Canvas + Mini-Karte),
           Aufgaben mit Reaktionszeit, Pause, Nachbesprechung, Logbuch, Bootsladen.
   Daten: data/toerns.json, data/ereignisse.json, data/ausruestung.json, data/tags.json, data/sks-mc.json (optional).
   Spielstand: S.toern2 (Standard null, wird beim ersten Öffnen angelegt). Der alte S.toern bleibt unangetastet.
   ========================================================================== */
(function (root) {
'use strict';

/* ======================= Teil 1: Kern (ohne DOM) ======================= */
const core = {};
core.rng = seed => { let a = (seed >>> 0) || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const pickR = (R, a) => a[Math.floor(R() * a.length)];
const weighted = (R, list, w) => { const tot = list.reduce((s, x) => s + w(x), 0); if (!tot) return null; let r = R() * tot; for (const x of list) { r -= w(x); if (r <= 0) return x; } return list[list.length - 1]; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const shuffleR = (R, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
core.STUFEN = ['landratte', 'leichtmatrose', 'seebaer', 'kaphoornier', 'klabautermann'];
const RK = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'], RL = ['Nord', 'Nordost', 'Ost', 'Südost', 'Süd', 'Südwest', 'West', 'Nordwest'];
core.richtung = (deg, lang) => (lang ? RL : RK)[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

/* ---------- Geometrie (Mittelbreite, Positionen in Bogenminuten ab 55°N / 6°E) ---------- */
const RAD = Math.PI / 180, n360 = a => ((a % 360) + 360) % 360;
const geo = {
  cos: lat => Math.cos((55 + lat / 60) * RAD),
  kd(a, b) { const c = geo.cos((a[0] + b[0]) / 2), dx = (b[1] - a[1]) * c, dy = b[0] - a[0]; return {k: n360(Math.atan2(dx, dy) / RAD), d: Math.hypot(dx, dy)}; },
  len(wp) { let s = 0; for (let i = 1; i < wp.length; i++) s += geo.kd(wp[i - 1], wp[i]).d; return s; },
  /* Position nach dem Anteil f der Route */
  at(wp, f) {
    const L = geo.len(wp); let rest = clamp(f, 0, 1) * L;
    for (let i = 1; i < wp.length; i++) {
      const a = wp[i - 1], b = wp[i], kd = geo.kd(a, b);
      if (rest <= kd.d || i === wp.length - 1) { const g = kd.d ? clamp(rest / kd.d, 0, 1) : 0; return {lat: a[0] + (b[0] - a[0]) * g, lon: a[1] + (b[1] - a[1]) * g, k: kd.k, leg: i}; }
      rest -= kd.d;
    }
    return {lat: wp[0][0], lon: wp[0][1], k: 0, leg: 1};
  },
  /* Nächster Punkt der Route zu einem Objekt: Anteil f und Abstand */
  near(wp, p) { let best = {f: 0, d: 1e9}; const L = geo.len(wp); for (let i = 0; i <= 200; i++) { const q = geo.at(wp, i / 200), d = geo.kd([q.lat, q.lon], p).d; if (d < best.d) best = {f: i / 200, d, k: q.k}; } best.L = L; return best; },
};
core.geo = geo;

/* ---------- Wetter ---------- */
const WXL = {
  schoen: {bft: [2, 4], sicht: 'gut', see: [0.3, 0.8]},
  windig: {bft: [5, 6], sicht: 'gut', see: [1, 1.8]},
  sturm: {bft: [7, 9], sicht: 'mäßig', see: [2.5, 4]},
  regen: {bft: [3, 5], sicht: 'mäßig', see: [0.5, 1.2]},
  nebel: {bft: [1, 3], sicht: 'Nebel', see: [0.2, 0.5]},
  flaute: {bft: [0, 1], sicht: 'gut', see: [0.1, 0.3]},
};
const MILDER = {sturm: 'windig', windig: 'schoen', nebel: 'schoen', regen: 'schoen', schoen: 'schoen', flaute: 'schoen'};
core.wetter = (R, wx, von) => {
  const L = WXL[wx] || WXL.schoen, bft = L.bft[0] + Math.floor(R() * (L.bft[1] - L.bft[0] + 1));
  return {wx, bft, von: von != null ? von : [180, 225, 225, 270, 270, 315, 0, 90][Math.floor(R() * 8)], sicht: L.sicht, see: Math.round((L.see[0] + R() * (L.see[1] - L.see[0])) * 10) / 10};
};
/* Wetter eines Törntags: aus den typischen Lagen des Törns. Nach einem Hafentag wegen Schietwetter wird es milder. */
core.tagWetter = (R, toern, tag, milder, prev) => {
  const list = toern.wetter && toern.wetter.length ? toern.wetter : ['schoen'];
  let wx = R() < .7 ? list[tag % list.length] : pickR(R, list);
  if (milder && prev) wx = MILDER[prev.wx] || 'schoen';
  const w = core.wetter(R, wx, prev && R() < .5 ? n360(prev.von + 45) : null);
  const spaeter = R() < .45 ? pickR(R, list) : wx;
  w.spaeter = spaeter !== wx ? core.wetter(R, spaeter, n360(w.von + 45)) : null;
  return w;
};
core.windText = w => `${core.richtung(w.von, true)} ${w.bft}`;
core.bericht = w => {
  const warn = w.bft >= 8 ? 'Sturmwarnung! ' : w.bft >= 6 ? 'Starkwindwarnung! ' : '';
  const sp = w.spaeter ? `, später ${core.windText(w.spaeter)}${w.spaeter.wx === 'nebel' ? ', Nebel' : w.spaeter.wx === 'regen' ? ', Schauer' : ''}` : '';
  return `${warn}Seewetterbericht Kliev-Mündung: ${core.windText(w)}${w.wx === 'regen' ? ', Schauerböen' : ''}${sp}. Sicht ${w.sicht === 'Nebel' ? 'unter 1000 Meter, Nebel' : w.sicht}. Seegang ${String(w.see).replace('.', ',')} Meter.`;
};
/* Tagesentscheidung: fahren | anders (Reff/Motor/Vorsicht) | bleiben. Liefert die richtigen Antworten mit Begründung. */
core.entscheid = (w, si, teile) => {
  const has = t => teile.has ? teile.has(t) : teile.includes(t);
  if (w.bft >= 8) return {ok: ['bleiben'], warum: 'Sturmwarnung heißt Windstärke 8 und mehr. Da bleibt man im Hafen.', ref: 'sbf:268', anders: 'Gerefft und mit Motor auslaufen'};
  if (w.bft >= 6) return {ok: si >= 3 && has('reffanlage') ? ['anders', 'bleiben'] : ['bleiben'], warum: si >= 3 && has('reffanlage') ? 'Starkwindwarnung (Windstärke 6 und 7). Mit Erfahrung und Rollreff geht es gerefft, im Hafen bleiben ist aber auch richtig.' : 'Starkwindwarnung heißt Windstärke 6 und 7. Für diese Crew und dieses Boot: lieber im Hafen bleiben.', ref: 'sbf:267', anders: 'Gerefft auslaufen'};
  if (w.wx === 'nebel') return {ok: si >= 2 && has('radarreflektor') ? ['anders', 'bleiben'] : ['bleiben'], warum: si >= 2 && has('radarreflektor') ? 'Nebel heißt Sicht unter 1000 Meter. Mit Radarreflektor, Schallsignalen und langsamer Fahrt geht es, im Hafen bleiben ist aber auch richtig.' : 'Nebel heißt Sicht unter 1000 Meter. Ohne Radarreflektor und Erfahrung bleibt man besser im Hafen.', ref: 'sks:wetter-77', anders: 'Langsam, mit Radarreflektor und Schallsignalen'};
  if (w.bft <= 1) return {ok: ['anders'], warum: 'Flaute: Unter Segel kommst du nicht an. Unter Motor planen.', anders: 'Unter Motor fahren'};
  if (w.bft === 5 || w.wx === 'regen') return {ok: si >= 2 ? ['anders', 'fahren'] : ['anders'], warum: 'Frischer Wind oder Schauerböen: früh reffen und vorsichtig planen.', anders: 'Gleich ein Reff einbinden'};
  return {ok: ['fahren'], warum: 'Gutes Segelwetter. Leinen los!', anders: 'Lieber unter Motor'};
};

/* ---------- Passt ein Ereignis zur Lage? ---------- */
core.passt = (e, c) => {
  const w = e.wenn || {};
  if (w.gebiet && !w.gebiet.includes(c.gebiet)) return false;
  if (w.tz && !w.tz.includes(c.tz)) return false;
  if (w.wx && !w.wx.includes(c.wx)) return false;
  if (w.antrieb && w.antrieb !== c.antrieb) return false;
  if (w.ab != null && c.si < w.ab) return false;
  return true;
};
/* Kandidaten aus der Karte: Tonnen, Feuer, Kardinaltonnen an der Route; Lichter, Signalkörper, Strom */
core.genKandidaten = (D, c) => {
  const out = [], wp = c.etappe.wp, nacht = c.tz === 'nacht' || c.tz === 'abend';
  for (const o of (D.K && D.K.objekte) || []) {
    if (!['bb', 'stb', 'mitte', 'nord', 'west', 'einzel'].includes(o.typ)) continue;
    const n = geo.near(wp, [o.lat, o.lon]);
    if (n.f < .08 || n.f > .92) continue;
    const lateral = ['bb', 'stb', 'mitte'].includes(o.typ);
    if (lateral && n.d < .9) out.push({gen: nacht ? 'feuer' : 'tonne', obj: o.id, f: n.f, ein: n.k > 0 && n.k < 180});
    if (!lateral && n.d < 1.6) out.push({gen: 'kardinal', obj: o.id, f: n.f});
  }
  /* Kurse selbst absetzen (erst mit Sternen in Lektion 1–5, CLAUDE.md 5.5): an Kursänderungspunkten */
  if (c.kursSelbst) { const L = geo.len(wp); let acc = 0; for (let k = 1; k < wp.length - 1 && k <= 2; k++) { acc += geo.kd(wp[k - 1], wp[k]).d; out.push({gen: 'kurs', leg: k, f: Math.min(.9, acc / L + .02)}); } }
  if (nacht) out.push({gen: 'lichter'}, {gen: 'lichter'});
  else out.push({gen: 'signalkoerper'});
  if (['fluss', 'kueste'].includes(c.gebiet) && c.si >= 1) out.push({gen: 'strom'});
  return out;
};

/* ---------- Aufgabenplan einer Etappe ----------
   c: {R, toern, etappe, stufe, si, w, tz, antrieb, teile:Set, used:Set, orte}
   Etwa 60 % Handlungen (Ereignisse und Kartenaufgaben), 40 % Fragen aus den Katalogen. */
core.plan = (D, c) => {
  const R = c.R, st = c.stufe, N = st.aufgaben, nF = Math.round(N * .4), nH = N - nF;
  const dauer = 40 + 26 * N;
  let tz = c.tz;
  if (tz === 'tag' && R() < st.nacht) tz = 'abend';
  const lage = {gebiet: c.etappe.gebiet, tz, wx: c.w.wx === 'flaute' ? 'schoen' : c.w.wx, antrieb: c.antrieb, si: c.si};
  const tasks = [];
  /* Anfang und Ende */
  const zielHafen = c.orte[c.etappe.nach] && c.orte[c.etappe.nach].hafen, startHafen = c.orte[c.etappe.von] && c.orte[c.etappe.von].hafen;
  const byId = id => D.ereignisse.find(e => e.id === id);
  let rest = nH;
  if (zielHafen && byId('anlegen')) { tasks.push({typ: 'ev', id: 'anlegen', at: dauer - 10}); rest--; }
  if (startHafen && lage.gebiet === 'fluss' && R() < .5 && !c.used.has('fahrwasser-queren')) { tasks.push({typ: 'ev', id: 'fahrwasser-queren', at: 14}); rest--; }
  if (zielHafen && lage.gebiet === 'fluss' && R() < .5 && !c.used.has('einlaufen') && rest > 2) { tasks.push({typ: 'ev', id: 'einlaufen', at: dauer - 30}); rest--; }
  /* Nebel nach Stufe: ein Nebel-Ereignis einplanen, das das Wetter ändert */
  let wxSpaeter = null;
  if (lage.wx !== 'nebel' && R() < st.nebel && byId('nebel-kommt') && core.passt(byId('nebel-kommt'), lage)) { tasks.push({typ: 'ev', id: 'nebel-kommt', at: Math.round(dauer * (.3 + R() * .2))}); rest--; wxSpaeter = 'nebel'; }
  /* Kartenaufgaben mit festem Ort auf der Route */
  const gen = shuffleR(R, core.genKandidaten(D, {...c, tz}));
  const fest = gen.filter(g => g.f != null).slice(0, Math.max(1, Math.round(rest * .35)));
  fest.forEach(g => { tasks.push({typ: 'gen', ...g, at: Math.round(clamp(g.f * dauer - 25, 20, dauer - 40))}); rest--; });
  /* Übrige Handlungen: passende Ereignisse und freie Kartenaufgaben, gewichtet, keine Wiederholung im Törn */
  const pool = D.ereignisse.filter(e => !e.phase && !c.used.has(e.id) && core.passt(e, {...lage, wx: wxSpaeter && e.wenn && e.wenn.wx ? wxSpaeter : lage.wx}))
    .map(e => ({typ: 'ev', id: e.id, w: e.wxNeu ? .7 : 1}))
    .concat(gen.filter(g => g.f == null).map(g => ({typ: 'gen', ...g, w: .9})));
  const taken = new Set(tasks.map(t => t.id || t.gen + t.obj));
  for (let k = 0; k < 60 && rest > 0; k++) {
    const x = weighted(R, pool.filter(p => !taken.has(p.id || p.gen + (p.obj || k))), p => p.w); if (!x) break;
    if (x.typ === 'ev' && x.id === 'nebel-kommt' && wxSpaeter) continue;
    taken.add(x.id || x.gen + (x.obj || k)); const t = {...x}; delete t.w; tasks.push(t); rest--;
  }
  /* Fragen: Schein nach Stufe, Themen nach Lage */
  const sch = Object.entries(st.scheine || {sbf: 1});
  const tagsFor = wx => [...new Set([].concat(D.tags[lage.gebiet] || [], D.tags[tz] || [], D.tags[wx] || [], D.tags[c.antrieb] || []))];
  for (let i = 0; i < nF + rest; i++) tasks.push({typ: 'frage', schein: weighted(R, sch, s => s[1])[0], tags: tagsFor(lage.wx)});
  /* Zeitpunkte: feste behalten, übrige gleichmäßig mit etwas Zufall verteilen, Mindestabstand */
  const free = tasks.filter(t => t.at == null), fixed = tasks.filter(t => t.at != null);
  const slots = []; const n = tasks.length, step = (dauer - 30) / (n + .5);
  for (let i = 0; i < n; i++) slots.push(Math.round(15 + step * (i + .5) + (R() - .5) * step * .4));
  fixed.forEach(t => { let bi = 0, bd = 1e9; slots.forEach((s, i) => { const d = Math.abs(s - t.at); if (d < bd) { bd = d; bi = i; } }); t.at = slots[bi]; slots.splice(bi, 1); });
  shuffleR(R, free).forEach((t, i) => { t.at = slots[i]; });
  tasks.sort((a, b) => a.at - b.at);
  /* Ereignisse, die ein anderes Wetter brauchen (z. B. Nebel), kommen erst nach dem Wetterwechsel */
  const setzt = {}; tasks.forEach(t => { const e = t.typ === 'ev' && byId(t.id); if (e && e.wxNeu) setzt[e.wxNeu] = t; });
  tasks.forEach(t => { const e = t.typ === 'ev' && byId(t.id); if (!e || !e.wenn || !e.wenn.wx || e.wenn.wx.includes(lage.wx)) return; const w = e.wenn.wx.map(x => setzt[x]).find(Boolean); if (w && w.at > t.at) { const a = w.at; w.at = t.at; t.at = a; } });
  tasks.sort((a, b) => a.at - b.at);
  /* Wetterwechsel am Ereignis (Nebel, Starkwind, Flaute) bestimmt die Themen der Fragen danach */
  let wxNow = lage.wx;
  tasks.forEach(t => {
    const e = t.typ === 'ev' && byId(t.id); if (e && e.wxNeu) wxNow = e.wxNeu === 'flaute' ? 'schoen' : e.wxNeu;
    if (t.typ === 'frage') t.tags = tagsFor(wxNow);
    if (t.typ !== 'frage' && R() < st.kombi) t.kombi = true;
  });
  tasks.forEach(t => { if (t.id) c.used.add(t.id); });
  return {dauer, tz, tasks};
};

/* ---------- Reaktionszeit und Folgen ---------- */
core.def = (D, t) => t.typ === 'ev' ? D.ereignisse.find(e => e.id === t.id) : t.typ === 'gen' ? D.gen[t.gen] : {zeit: t.schein === 'sks' ? 40 : 30, schwere: .8};
core.hat = (c, teil) => c.teile.has(teil) || ((c.vorrat || {})[teil] || 0) > 0;
core.zeit = (D, t, c) => { const e = core.def(D, t) || {}; let z = e.zeit || 30; if (e.hilft && core.hat(c, e.hilft.teil)) z *= e.hilft.zeit || 1; if (t.kombi) z *= .8; return Math.round(z); };
/* outcome: ok | falsch | spaet. Liefert Schaden, Laune, Punkte, Verbrauch und Hinweise. */
core.folgen = (D, t, outcome, c) => {
  const e = core.def(D, t) || {}, st = c.stufe, out = {schaden: 0, laune: 0, punkte: 0, verbrauch: {}, notiz: ''};
  let f = (e.schwere || 1) * (t.kombi ? 1.3 : 1);
  if (e.hilft && core.hat(c, e.hilft.teil)) f *= e.hilft.schaden || 1;
  if (outcome === 'ok') { out.punkte = Math.round(10 * (1 + c.si * .5) * (t.kombi ? 1.5 : 1)); out.laune = 3; }
  else { out.schaden = st.schaden * f * (outcome === 'spaet' ? st.spaet : 1); out.laune = outcome === 'spaet' ? -9 : -6; }
  /* Ab Seebär: Fehlt das Teil, das bei diesem Ereignis hilft, wird es auch bei richtiger Antwort teuer */
  if (e.hilft && st.ohneTeil && !core.hat(c, e.hilft.teil)) { out.schaden += st.ohneTeil * (e.schwere || 1); const tn = (D.teile || []).find(x => x.id === e.hilft.teil); out.notiz = `Ohne ${tn ? tn.name : e.hilft.teil} war das schwerer.`; }
  if (e.noetig) {
    const n = e.noetig.teil, isVorrat = (c.vorratIds || []).includes(n);
    if (!core.hat(c, n)) { out.schaden += st.schaden * .5; out.notiz = e.noetig.text || ''; if (t.id === 'motor-heiss') out.antrieb = 'segel'; }
    else if (isVorrat) out.verbrauch[n] = 1;
  }
  if (e.antriebNeu && outcome === 'ok') out.antrieb = e.antriebNeu;
  out.schaden = Math.round(out.schaden);
  return out;
};
/* Empfohlene Ausrüstung des Törns: Jedes fehlende Teil kostet ab Seebär zu Beginn jeder Etappe Bootszustand */
core.malus = (toern, c) => { const fehlt = (toern.ausr || []).filter(a => !core.hat(c, a)); return {fehlt, schaden: fehlt.length * (c.stufe.empfohlen || 0)}; };
core.sterne = (ok, n, zustand) => { const q = n ? ok / n : 1; return q >= .9 && zustand >= 60 ? 3 : q >= .7 ? 2 : 1; };

/* ---------- Simulation für das Balancing (tests/balancing.js) ----------
   p: Trefferquote des simulierten Spielers. teile: Set verbauter Teile, vorrat: {id: n}. */
core.simulate = (D, toern, p, teile, vorrat, seed) => {
  const R = core.rng(seed), si = core.STUFEN.indexOf(toern.stufe), st = D.stufen[si], used = new Set();
  let zustand = 100, laune = 80, tage = 0; vorrat = {...vorrat};
  const vorratIds = (D.teile || []).filter(x => x.art === 'vorrat').map(x => x.id);
  for (let ei = 0; ei < toern.etappen.length; ei++) {
    const etappe = toern.etappen[ei];
    let w = core.tagWetter(R, toern, tage), extra = 0;
    for (let k = 0; k < 6; k++) {
      const E = core.entscheid(w, si, teile), richtig = R() < p;
      if (richtig) { if (E.ok.length === 1 && E.ok[0] === 'bleiben') { tage++; w = core.tagWetter(R, toern, tage, true, w); continue; } break; }
      if (E.ok.includes('bleiben')) { extra = st.schaden * 1.5; break; }
      laune -= 10; tage++; w = core.tagWetter(R, toern, tage, false, w);
    }
    tage++;
    const antrieb = w.bft <= 1 ? 'motor' : 'segel';
    const c = {R, toern, etappe, stufe: st, si, w, tz: etappe.tz, antrieb, teile, vorrat, vorratIds, used, orte: D.orte};
    zustand -= extra + core.malus(toern, c).schaden;
    const plan = core.plan(D, c);
    for (const t of plan.tasks) {
      const outcome = R() < p ? 'ok' : R() < .2 ? 'spaet' : 'falsch';
      const f = core.folgen(D, t, outcome, c);
      zustand -= f.schaden; laune = clamp(laune + f.laune, 0, 100);
      Object.keys(f.verbrauch).forEach(k => { vorrat[k] = Math.max(0, (vorrat[k] || 0) - f.verbrauch[k]); });
      if (zustand <= 0) return {ok: false, grund: 'seenot', etappe: ei, tage};
      if (laune <= 0) return {ok: false, grund: 'laune', etappe: ei, tage};
    }
    zustand = Math.min(100, zustand + st.reparatur);
  }
  return {ok: true, zustand, tage};
};

/* Node: nur den Kern ausliefern */
if (typeof module !== 'undefined' && module.exports && typeof document === 'undefined') { module.exports = {core}; return; }

/* ======================= Teil 2: Oberfläche ======================= */
const TOERN = root.TOERN = root.TOERN || {};
TOERN.core = core;
let D = null, TAGS = {}, SKSMC = {}, K = null, LANDP = null;
const $ = s => document.querySelector(s);
const comma = (v, d = 0) => Number(v).toFixed(d).replace('.', ',');
const mmss = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const CL = Math.cos(55.35 * RAD);
const CSS = `
.tw-res{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}.tw-chip{background:var(--paper,#fffaf0);border:1px solid var(--line,#ddd);border-radius:999px;padding:3px 9px;font-size:.78rem;white-space:nowrap}
.tw-stufe{margin:14px 0 6px;font:700 1rem var(--hfont)}.tw-card{border:1px solid var(--line,#ddd);border-radius:14px;padding:10px 12px;margin:8px 0;background:var(--paper,#fffaf0)}
.tw-card h3{margin:0 0 2px;font-size:1rem}.tw-card p{margin:4px 0}.tw-tags{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}.tw-tag{font-size:.72rem;border-radius:6px;padding:1px 6px;background:rgba(0,0,0,.06)}
.tw-tag.ok{background:#d9efd9;color:#1d5e2d}.tw-tag.no{background:#f6e0d6;color:#8a3a1a}
.tw-wrap{position:relative;display:flex;flex-direction:column;height:calc(100svh - 64px);max-height:900px}
.tw-hud{display:flex;flex-wrap:wrap;gap:4px;font-size:.74rem;margin:2px 0 4px}.tw-hud span{background:rgba(0,0,0,.06);border-radius:8px;padding:2px 6px;white-space:nowrap}
.tw-view{position:relative;flex:0 0 auto;height:42svh;min-height:230px;max-height:380px;border-radius:14px;overflow:hidden;background:#123}
.tw-view canvas{width:100%;height:100%;display:block}
.tw-ctl{display:flex;gap:6px;margin:6px 0}.tw-ctl button{flex:1;padding:8px 4px;font-size:.82rem}
.tw-low{position:relative;flex:1 1 auto;min-height:170px}.tw-low .nwrap{height:100%!important;min-height:160px}
.tw-mini{position:absolute;inset:0}.tw-zumboot{position:absolute;left:8px;bottom:8px;z-index:5;box-shadow:0 2px 6px rgba(0,0,0,.3)}.tw-mini .ntoolbar,.tw-mini .ntip{display:none}
.tw-task{position:absolute;inset:0;overflow:auto;background:var(--paper,#fffaf0);border:2px solid var(--lamp,#f0b43e);border-radius:14px;padding:10px 12px;z-index:5}
.tw-task h3{margin:0 0 4px;font-size:1rem;display:flex;justify-content:space-between;gap:8px}.tw-task p{margin:4px 0 8px}
.tw-bar{height:6px;background:rgba(0,0,0,.1);border-radius:3px;overflow:hidden;margin:2px 0 8px}.tw-bar i{display:block;height:100%;background:var(--lamp,#f0b43e);transition:width .25s linear}
.tw-bar.eng i{background:#d9542f}.tw-opts{display:flex;flex-direction:column;gap:6px}.tw-opts button{text-align:left;padding:9px 10px;font-size:.88rem;line-height:1.3}
.tw-opts button.richtig{outline:3px solid #1E7F4F}.tw-opts button.falsch{outline:3px solid #c2473b;opacity:.8}
.tw-horn{display:flex;gap:6px;margin:6px 0}.tw-horn button{flex:1;font-size:1.1rem;padding:10px 4px}.tw-seq{font-size:1.4rem;letter-spacing:4px;min-height:1.8rem;text-align:center}
.tw-fb{margin-top:8px;font-size:.86rem}.tw-fb .amt{background:rgba(0,0,0,.05);border-radius:8px;padding:6px 8px;margin:6px 0}
.tw-over{position:absolute;inset:0;z-index:9;background:rgba(10,16,26,.82);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;border-radius:14px}
.tw-over .btn{margin:6px 0;min-width:220px}
.tw-black{position:fixed;inset:0;background:#000;z-index:60;opacity:0;transition:opacity 1.6s ease;pointer-events:none;display:flex;align-items:flex-end;justify-content:center;color:#fff;font:600 1rem var(--hfont);padding-bottom:18svh}
.tw-black.on{opacity:1;pointer-events:auto}.tw-black.hell{opacity:0}
.tw-wx{border-left:4px solid var(--lamp,#f0b43e);padding:8px 10px;background:rgba(0,0,0,.04);border-radius:8px;margin:8px 0;font-size:.92rem}
.tw-row{display:flex;justify-content:space-between;gap:8px;align-items:center;margin:4px 0;font-size:.86rem}
.tw-err{border-top:1px solid var(--line,#ddd);padding:6px 0}.tw-err b{display:block}
.tw-img{max-width:100%;max-height:120px;display:block;margin:4px auto}
`;
const STUFE_NAME = id => (D.stufen.find(s => s.id === id) || {}).name || id;
const SCHEIN = {sbf: 'SBF See', sks: 'SKS', binnen: 'SBF Binnen'};

/* ---------- Spielstand ---------- */
const T2 = () => {
  if (!S.toern2) { const s = D.ausr.start; S.toern2 = {kasse: s.kasse, prov: s.prov, sprit: s.sprit, teile: s.teile.slice(), vorrat: {...s.vorrat}, log: [], seen: {}, provDay: today(), lauf: null, schnitt: {}}; }
  const t = S.toern2; t.teile = t.teile || []; t.vorrat = t.vorrat || {}; t.log = t.log || []; t.seen = t.seen || {}; t.schnitt = t.schnitt || {};
  if (t.provDay == null) t.provDay = today();
  return t;
};
const teileSet = () => new Set(T2().teile);
const vorratIds = () => D.ausr.teile.filter(x => x.art === 'vorrat').map(x => x.id);
const ctxFor = L => ({stufe: D.stufen[L.si], si: L.si, teile: teileSet(), vorrat: T2().vorrat, vorratIds: vorratIds()});
/* Lernen bringt Proviant und Taler: je Lerntag mit mindestens 10 Antworten */
function lernLohn() {
  const t = T2(), h = S.hist || {}; let tage = 0;
  for (let d = t.provDay; d < today(); d++) if ((h[d] || 0) >= 10) tage++;
  if ((h[today()] || 0) >= 10 && t.lohnHeute !== today()) { tage++; t.lohnHeute = today(); }
  t.provDay = today();
  if (tage) { t.prov = Math.min(12, t.prov + tage); t.kasse += 15 * tage; save(); toast(`Fürs Lernen: +${tage} Proviant und ${15 * tage} Taler`); }
}

/* ---------- Laden ---------- */
TOERN.init = async function () {
  if (!document.getElementById('toerncss')) { const s = document.createElement('style'); s.id = 'toerncss'; s.textContent = CSS; document.head.appendChild(s); }
  if (D) return;
  await NAV.init();
  const get = f => fetch('data/' + f + '?v=' + window.__ver).then(r => { if (!r.ok) throw new Error(f); return r.json(); });
  const [toerns, ev, ausr, tags, mc] = await Promise.all([get('toerns.json'), get('ereignisse.json'), get('ausruestung.json'), get('tags.json').catch(() => ({tags: {}})), get('sks-mc.json').catch(() => ({mc: {}}))]);
  K = NAV.data().K;
  D = {stufen: toerns.stufen, orte: toerns.orte, toerns: toerns.toerns, ereignisse: ev.ereignisse, gen: ev.gen, tags: ev.tags, fahrzeuge: ev.fahrzeuge, crew: ev.crew, ausr, teile: ausr.teile, K};
  TAGS = tags.tags || {}; SKSMC = mc.mc || {};
  TOERN.LINES = ev.crew;
  /* Land der Karte in der Seemeilen-Ebene (x = Länge · cos φ, y = Breite) für die Sicht vom Steuer */
  LANDP = K.flaechen.filter(f => f.art === 'land').map(f => f.xy.map(([x, y]) => [(20 + x / 28.45) * CL, 30 - y / 50]));
};
TOERN.data = () => D;
/* Törn-Bildschirm ohne Musik (Meer, Wind und Wetter bleiben) */
const shell = (title, html) => { window.TOERN_STILL = true; gameShell(title, html); AUD.playMusic(null); };

/* ---------- Törnwahl ---------- */
TOERN.open = async function () {
  await TOERN.init(); const t = T2(); lernLohn(); save();
  returnTo = 'deck';
  const L = t.lauf, tn = L && D.toerns.find(x => x.id === L.id);
  const has = new Set(t.teile), stand = sc => { const b = sc === S.course ? S : (S.courses || {})[sc] || {}; const q = b.qs || {}; return Object.values(q).filter(x => x.b >= 3).length; };
  /* Immer die nächsten drei nicht geschafften Törns in Listenreihenfolge; geschaffte werden abgehakt */
  const geschafft = D.toerns.filter(x => t.schnitt[x.id] != null), offen = D.toerns.filter(x => t.schnitt[x.id] == null).slice(0, 3);
  const card = x => {
    const min = Math.round(x.etappen.length * (D.stufen.find(s => s.id === x.stufe).aufgaben * 26 + 40 + 120) / 60);
    return `<div class="tw-card"><h3>${esc(x.name)}</h3><p class="small muted">${esc(x.text)}</p>
      <div class="tw-tags"><span class="tw-tag">${x.etappen.length} Etappe${x.etappen.length > 1 ? 'n' : ''} · ca. ${min} Min.</span>${x.etappen.some(e => e.tz === 'nacht') ? '<span class="tw-tag">🌙 Nacht</span>' : ''}${x.wetter.includes('nebel') ? '<span class="tw-tag">🌫 Nebel möglich</span>' : ''}${x.wetter.includes('sturm') ? '<span class="tw-tag">🌬 Starkwind</span>' : ''}</div>
      <div class="tw-tags">${x.scheine.map(s => `<span class="tw-tag ${stand(s) > 30 ? 'ok' : 'no'}">Schein: ${SCHEIN[s] || s}</span>`).join('')}${x.ausr.map(a => `<span class="tw-tag ${has.has(a) ? 'ok' : 'no'}">${has.has(a) ? '✓' : '○'} ${esc((D.teile.find(z => z.id === a) || {}).name || a)}</span>`).join('')}</div>
      ${L && L.id === x.id ? '<p class="small"><b>Läuft gerade, oben fortsetzen.</b></p>' : `<button class="btn lamp small" data-start="${x.id}">Ablegen</button>`}</div>`;
  };
  gameShell('Törn', `<div class="tw-res"><span class="tw-chip">🪙 ${t.kasse} Taler</span><span class="tw-chip">🍞 ${t.prov} Proviant</span><span class="tw-chip">⛽ ${Math.round(t.sprit)} %</span><span class="tw-chip">🔧 ${t.teile.length} Teile</span></div>
    ${L && tn ? `<div class="tw-card" style="border:2px solid var(--lamp,#f0b43e)"><h3>Fortsetzen: ${esc(tn.name)}</h3><p class="small">Etappe ${L.e + 1} von ${tn.etappen.length}${L.phase === 'fahrt' ? ` · noch ${mmss(L.plan.dauer - L.t)}` : ''} · Boot ${Math.round(L.zustand)} %</p>
      <div class="row"><button class="btn lamp" id="twweiter">Weiter</button><button class="btn ghost small" id="twabbruch">Abbrechen (kostet Proviant)</button></div></div>` : ''}
    <div class="row" style="margin:4px 0"><button class="btn small" id="twladen">🛒 Bootsladen</button><button class="btn small ghost" id="twlog">📖 Törn-Logbuch</button></div>
    <p class="small muted" style="margin:8px 0 0">Drei Törns stehen zur Wahl. Schaffst du einen, wird er abgehakt und der nächste kommt dazu. Grün heißt: Schein schon gut geübt bzw. Teil an Bord. Ab Seebär kostet jedes fehlende empfohlene Teil zu Beginn jeder Etappe Bootszustand.</p>
    ${D.stufen.filter(s => offen.some(x => x.stufe === s.id)).map(s => `<div class="tw-stufe">${esc(s.name)}</div><p class="small muted" style="margin:0">${esc(s.text)}</p>${offen.filter(x => x.stufe === s.id).map(card).join('')}`).join('')}
    ${!offen.length ? '<div class="tw-card"><h3>Alle Törns geschafft! ⚓</h3><p class="small">Du kannst jeden noch einmal fahren.</p></div>' : ''}
    ${geschafft.length ? `<details class="tw-card"><summary><b>✓ Geschafft (${geschafft.length})</b></summary>${geschafft.map(x => `<div class="tw-row"><span>✓ ${esc(x.name)} <span class="small muted">${esc(STUFE_NAME(x.stufe))}</span></span><span>${'⭐'.repeat(t.schnitt[x.id] || 1)} <button class="btn small ghost" data-start="${x.id}">Nochmal</button></span></div>`).join('')}</details>` : ''}`);
  window.TOERN_STILL = true; AUD.playMusic(null);
  app.querySelectorAll('[data-start]').forEach(b => b.onclick = () => { AUD.click(); if (L && !confirm('Der laufende Törn wird abgebrochen und kostet ein Proviantpaket. Neu starten?')) return; if (L) abbrechen(true); starten(b.dataset.start); });
  if ($('#twweiter')) $('#twweiter').onclick = () => { AUD.click(); weiter(); };
  if ($('#twabbruch')) $('#twabbruch').onclick = () => { if (confirm('Törn abbrechen? Ein Proviantpaket geht verloren.')) { abbrechen(); TOERN.open(); } };
  $('#twladen').onclick = () => laden(); $('#twlog').onclick = () => logbuch();
};
function abbrechen(still) {
  const t = T2(); if (!t.lauf) return;
  t.prov = Math.max(0, t.prov - 1); LOG.add('törn', 'abgebrochen: ' + t.lauf.id); t.lauf = null; stopFahrt(); save();
  if (!still) toast('Törn abgebrochen. Ein Proviantpaket ist futsch.');
}
function starten(id) {
  const t = T2(), tn = D.toerns.find(x => x.id === id), si = core.STUFEN.indexOf(tn.stufe);
  if (t.prov < 1) return toast('Kein Proviant an Bord. Lern ein bisschen, dann gibt es neuen (je Lerntag mit 10 Antworten ein Paket).');
  t.lauf = {id, si, e: 0, tag: 0, phase: 'wach', zustand: 100, laune: 80, punkte: 0, res: [], used: [], seed: (Math.random() * 1e9) | 0, w: null, start: Date.now(), sterne: []};
  save(); weiter();
}
/* Springt in die Phase, in der der Törn steht (auch nach App-Neustart) */
function weiter() {
  const L = T2().lauf; if (!L) return TOERN.open();
  if (L.phase === 'wach') return aufwachen();
  if (L.phase === 'wetter') return wetterbericht();
  if (L.phase === 'fahrt') return fahrt();
  if (L.phase === 'nach') return nachbesprechung();
  TOERN.open();
}
const RL_ = L => core.rng(L.seed + L.e * 7919 + L.tag * 104729);
const crewSay = (key, p = 1) => { if (Math.random() > p || !AUD.ready || !D.crew[key]) return; const l = D.crew[key][Math.random() * D.crew[key].length | 0]; VOX.lines([{cid: cid(l.s), t: l.t}], 'fixed'); };

/* ---------- Start: schwarz und wieder hell, „man wacht an Bord auf“ ---------- */
function aufwachen() {
  const t = T2(), L = t.lauf, tn = D.toerns.find(x => x.id === L.id), e = tn.etappen[L.e];
  const b = document.createElement('div'); b.className = 'tw-black'; b.innerHTML = `<span>${L.e ? 'Ein neuer Tag an Bord …' : 'Du wachst an Bord auf …'}</span>`; document.body.appendChild(b);
  const skip = !!t.seen.wach; let done = false;
  const fin = () => { if (done) return; done = true; b.classList.add('hell'); setTimeout(() => b.remove(), 1700); L.phase = 'wetter'; L.w = null; save(); wetterbericht(); crewSay('aufwachen', .8); };
  requestAnimationFrame(() => b.classList.add('on'));
  if (skip) b.onclick = fin;
  t.seen.wach = true;
  setTimeout(fin, skip ? 2600 : 3400);
  AUD.sfx('glocke', {vol: .35});
  LOG.add('törn', `${tn.name}: Etappe ${L.e + 1} ${e.von} → ${e.nach}`);
}

/* ---------- Tagesaufgabe: Seewetterbericht lesen und entscheiden ---------- */
function wetterbericht() {
  const t = T2(), L = t.lauf, tn = D.toerns.find(x => x.id === L.id), e = tn.etappen[L.e];
  if (!L.w) { L.w = core.tagWetter(RL_(L), tn, L.tag + L.e, L.milder, L.wPrev); L.milder = false; save(); }
  const w = L.w, E = core.entscheid(w, L.si, teileSet());
  const opts = [['fahren', 'Auslaufen wie geplant'], ['anders', E.anders], ['bleiben', 'Im Hafen bleiben, morgen ist auch ein Tag']];
  const barom = w.bft >= 6 || (w.spaeter && w.spaeter.bft >= 6) ? '↘ fällt' : w.wx === 'schoen' ? '↗ steigt' : '→ gleich';
  shell(tn.name, `<p class="small muted" style="margin:6px 0">Etappe ${L.e + 1} von ${tn.etappen.length}: <b>${esc(e.von)} → ${esc(e.nach)}</b> · Tag ${L.tag + L.e + 1}</p>
    <div class="tw-wx">📻 ${esc(core.bericht(w))}<br><span class="small">Barometer: ${barom}</span></div>
    <p style="margin:8px 0">Skipper, was machen wir heute?</p><div class="tw-opts" id="twent">${opts.map(([k, l]) => `<button class="btn" data-k="${k}">${esc(l)}</button>`).join('')}</div><div id="twentfb"></div>`);
  $('#gback').onclick = () => { save(); setTab('deck'); };
  app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
    const k = b.dataset.k, ok = E.ok.includes(k); app.querySelectorAll('[data-k]').forEach(x => { x.disabled = true; if (E.ok.includes(x.dataset.k)) x.classList.add('lamp'); });
    AUD.sfx(ok ? 'richtig' : 'falsch', {vol: .4});
    let msg = '', next;
    L.res.push({titel: 'Seewetterbericht', ok, expl: E.warum, ref: E.ref, wetter: true});
    if (ok) L.punkte += 10;
    if (k === 'bleiben') {
      L.tag++; L.wPrev = w; L.w = null; L.milder = ok; save();
      if (ok) { msg = 'Richtig. ' + E.warum + ' Ein Tag im Hafen, die Crew spielt Karten.'; crewSay('liegen'); }
      else { L.laune = Math.max(0, L.laune - 10); msg = 'Zu vorsichtig: ' + E.warum + ' Die Crew murrt.'; crewSay('zuvorsichtig'); }
      next = () => wetterbericht();
    } else {
      if (!ok) { const st = D.stufen[L.si]; L.zustand -= Math.round(st.schaden * (E.ok.includes('bleiben') ? 1.5 : .5)); L.laune = Math.max(0, L.laune - 5); msg = 'Gewagt. ' + E.warum; }
      else msg = 'Gute Entscheidung. ' + E.warum;
      L.antrieb = w.bft <= 1 || (k === 'anders' && /Motor/.test(E.anders)) ? 'motor' : 'segel';
      if (t.sprit < 10) L.antrieb = 'segel';
      L.phase = 'fahrt'; L.plan = null; save();
      next = () => fahrt();
    }
    $('#twentfb').innerHTML = `<div class="tw-fb"><p>${esc(msg)}</p>${E.ref ? amtlich(E.ref) : ''}<button class="btn lamp wide" id="twnext">${k === 'bleiben' ? 'Nächster Morgen' : 'Leinen los'}</button></div>`;
    $('#twnext').onclick = () => { AUD.click(); next(); };
  });
}

/* ---------- Amtliche Antwort zu einer Referenz ---------- */
function qOf(ref) {
  if (!ref) return null; const [s, id] = ref.split(':');
  if (s === 'sbf') { const q = DATA.find(x => String(x.n) === id); return q && {s, n: q.n, q: q.q, a: q.a[0], img: q.img}; }
  if (s === 'sks') { const q = SKS_DATA.find(x => x.id === id); return q && {s, n: q.id, q: q.q, a: q.a}; }
  return null;
}
const cleanA = a => String(a).replace(/Stand: 01\. Juli 2006.*$/s, '').trim();
function amtlich(ref) { const q = qOf(ref); if (!q) return ''; return `<div class="amt small"><b>Amtlich (${q.s === 'sbf' ? 'SBF See ' + q.n : 'SKS ' + q.n}):</b> ${esc(q.q)}<br><i>${esc(cleanA(q.a)).replace(/\n/g, '<br>')}</i></div>`; }

/* ---------- Fahrt ---------- */
let F = null; /* laufender Zustand der Fahrt-Ansicht (nicht gespeichert) */
function stopFahrt() { if (F) { cancelAnimationFrame(F.raf); clearInterval(F.tick); clearTimeout(F.cardT); document.removeEventListener('visibilitychange', F.vis); F = null; } AUD.loop('motorLauf', 0); }
TOERN.stop = stopFahrt;
function fahrt() {
  const t = T2(), L = t.lauf, tn = D.toerns.find(x => x.id === L.id), e = tn.etappen[L.e];
  stopFahrt();
  if (!L.plan) {
    if (t.prov < 1) { toast('Kein Proviant für diese Etappe. Lern ein bisschen, dann geht es weiter.'); return TOERN.open(); }
    t.prov -= 1;
    const lek = (S.navi && S.navi.lek) || {}, kursSelbst = ['L1', 'L2', 'L3', 'L4', 'L5'].every(id => lek[id] && lek[id].sterne);
    const c = {R: RL_(L), toern: tn, etappe: e, stufe: D.stufen[L.si], si: L.si, w: L.w, tz: e.tz, antrieb: L.antrieb, teile: teileSet(), used: new Set(L.used), orte: D.orte, kursSelbst};
    L.plan = core.plan(D, c); L.used = [...c.used]; L.t = 0; L.i = 0; L.wx = L.w.wx; L.bft = L.w.bft; L.eRes = [];
    const m = core.malus(tn, ctxFor(L)); if (m.schaden) { L.zustand -= m.schaden; setTimeout(() => toast(`Ohne ${m.fehlt.map(a => (D.teile.find(x => x.id === a) || {}).name || a).join(', ')} wird es hart: Boot −${m.schaden} %.`, 6000), 900); }
    save();
  }
  const st = D.stufen[L.si];
  shell(tn.name, `<div class="tw-wrap"><div class="tw-hud" id="twhud"></div>
    <div class="tw-view" id="twview"><canvas id="twcv"></canvas></div>
    <div class="tw-ctl"><button class="btn small" id="twfern">🔭 Fernglas</button><button class="btn small" id="twpeil">🧭 Peilen</button><button class="btn small" id="twhorn">📯 Horn</button><button class="btn small ghost" id="twpause">⏸ Pause</button></div>
    <div class="tw-low"><div class="tw-mini" id="twmini"></div><div id="twtask"></div></div></div>`);
  $('#gback').onclick = () => { pause(true); save(); stopFahrt(); setTab('deck'); };
  F = {L, tn, e, st, last: performance.now(), scene: [], card: null, paused: false, fern: 0, peil: null, hornSeq: '', heading: null, hint: 0, wahr: {}};
  /* Mini-Karte: unsere Karte, folgt dem Boot */
  const pos = posNow();
  F.ctl = NAV.mountChart($('#twmini'), {tools: ['hand'], center: pos, width: 300});
  /* V13: Die Karte folgt dem Boot in der Mitte. Wer selbst schiebt oder zoomt, behält seinen Ausschnitt, bis „Zurück zum Boot“ getippt wird. */
  F.folgt = true; $("#twmini").insertAdjacentHTML("beforeend", '<button class="btn small tw-zumboot hidden" id="twzumboot">⌖ Zurück zum Boot</button>');
  const losgelassen = () => { if (!F.folgt) return; F.folgt = false; $('#twzumboot').classList.remove('hidden'); };
  F.ctl.svg.addEventListener('pointerdown', losgelassen); F.ctl.svg.addEventListener('wheel', losgelassen);
  $('#twmini').querySelectorAll('.nzoom button').forEach(b => b.addEventListener('click', losgelassen));
  $('#twzumboot').onclick = e => { e.stopPropagation(); F.folgt = true; F.mk = null; $('#twzumboot').classList.add('hidden'); const p = posNow(); F.ctl.center(p.lat, p.lon); };
  F.ctl.st.lines = e.wp.slice(1).map((p, k) => ({a: NAV.proj(e.wp[k][0], e.wp[k][1]), b: NAV.proj(p[0], p[1]), c: 'soll'})); F.ctl.ink(); F.ctl.tipText('');
  /* Ton */
  AUD.weather(audWx(), dayAt(), 'deck'); if (L.antrieb === 'motor') AUD.loop('motorLauf', .22);
  $('#twfern').onclick = () => { F.fern = performance.now(); AUD.click(); };
  $('#twpeil').onclick = () => peilen();
  $('#twhorn').onclick = () => { if (F.card && F.card.signal) return; AUD.horn('●'); };
  $('#twpause').onclick = () => pause();
  F.vis = () => { if (document.hidden) { pause(true); save(); } }; document.addEventListener('visibilitychange', F.vis);
  const cv = $('#twcv'); F.cv = cv; F.cx = cv.getContext('2d'); sizeCanvas();
  F.tick = setInterval(() => { if (F && !F.paused) save(); }, 4000);
  if (L.card) zeigeAufgabe(L.card.idx, true);
  loop();
}
function sizeCanvas() { const r = F.cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); F.cv.width = Math.round(r.width * dpr); F.cv.height = Math.round(r.height * dpr); F.w = r.width; F.h = r.height; F.dpr = dpr; }
function pause(still) {
  if (!F || F.paused) return; F.paused = true; AUD.loop('motorLauf', 0);
  if (still) return;
  const o = document.createElement('div'); o.className = 'tw-over'; o.id = 'twover';
  o.innerHTML = `<h2 style="margin:0 0 8px">Pause</h2><p class="small" style="margin:0 0 12px">Der Törn ist gespeichert. Du kannst die App auch schließen.</p><button class="btn lamp" id="twgo">Weiter</button><button class="btn" id="twdeck">An Deck (Törn bleibt)</button><button class="btn ghost" id="twab">Törn abbrechen</button>`;
  $('#twview').appendChild(o);
  $('#twgo').onclick = () => { o.remove(); F.paused = false; F.last = performance.now(); if (F.L.antrieb === 'motor') AUD.loop('motorLauf', .22); };
  $('#twdeck').onclick = () => { save(); stopFahrt(); setTab('deck'); };
  $('#twab').onclick = () => { if (confirm('Törn abbrechen? Ein Proviantpaket geht verloren.')) { abbrechen(); setTab('deck'); } };
}
const dayAt = () => { const L = F.L, f = L.t / L.plan.dauer, tz = L.plan.tz; return tz === 'abend' ? (f < .45 ? 'abend' : 'nacht') : tz; };
const audWx = () => ({flaute: 'schoen', schoen: 'schoen', windig: 'windig', sturm: 'sturm', regen: 'regen', nebel: 'nebel'})[F.L.wx] || 'schoen';
function posNow() { const L = T2().lauf, e = D.toerns.find(x => x.id === L.id).etappen[L.e]; return geo.at(e.wp, (L.t || 0) / (L.plan ? L.plan.dauer : 1)); }

/* Hauptschleife: Zeit läuft, solange keine Aufgabe offen und keine Pause ist */
function loop() {
  if (!F) return;
  if (!document.getElementById('twcv')) { save(); return stopFahrt(); }
  const now = performance.now(), dt = Math.min(.25, (now - F.last) / 1000); F.last = now;
  const L = F.L;
  if (!F.paused && !L.card && !F.fb) {
    L.t += dt;
    const nx = L.plan.tasks[L.i];
    /* Wahrschau: Szene erscheint vor der Aufgabe, die Crew ruft auf leichten Stufen */
    if (nx && !F.wahr[L.i] && L.t >= nx.at - 6 * F.st.hilfe - 4) { F.wahr[L.i] = true; vorbereiten(L.i); if (F.st.hilfe >= 1 && nx.typ !== 'frage') crewSay('wahrschau', .7); }
    if (nx && L.t >= nx.at) zeigeAufgabe(L.i);
    else if (!nx && L.t >= L.plan.dauer) return etappeEnde();
  }
  draw(now / 1000, dt);
  if (!F.paused && L.card) karteTick();
  hud();
  F.raf = requestAnimationFrame(loop);
}
function hud() {
  const L = F.L, t = T2(), w = {von: (L.w && L.w.von) || 225, bft: L.bft};
  const sp = L.w && L.w.spaeter;
  const h = `${L.wx === 'nebel' ? '<span>🎧 mit Kopfhörern besser</span>' : ''}<span>Etappe ${L.e + 1}/${F.tn.etappen.length}</span><span>⏱ ${mmss(L.plan.dauer - L.t)}</span><span>🌬 ${core.windText(w)}${L.wx === 'nebel' ? ' 🌫' : L.wx === 'regen' ? ' 🌧' : L.wx === 'flaute' ? ' (Flaute)' : ''}${sp ? ' → ' + core.windText(sp) : ''}</span><span>${L.zustand > 60 ? '💚' : L.zustand > 30 ? '💛' : '❤️'} Boot ${Math.max(0, Math.round(L.zustand))} %</span><span>🙂 ${Math.round(L.laune)}</span><span>🍞 ${t.prov}</span><span>⛽ ${Math.round(t.sprit)} %</span><span>🪙 ${t.kasse}</span><span>${L.antrieb === 'motor' ? '⚙ Motor' : '⛵ Segel'}</span>`;
  if (F.hudTxt !== h) { F.hudTxt = h; $('#twhud').innerHTML = h; }
  /* Boot auf der Mini-Karte, Karte folgt */
  const p = posNow(), P = NAV.proj(p.lat, p.lon);
  if (!F.mk || Math.abs(F.mk.x - P.x) + Math.abs(F.mk.y - P.y) > .4) {
    F.mk = P; const hi = F.ctl.svg.querySelector('#nhi');
    if (hi) hi.innerHTML = `<g transform="translate(${P.x.toFixed(1)} ${P.y.toFixed(1)}) rotate(${p.k.toFixed(0)})"><path d="M0 -12 L6 8 L0 4 L-6 8 Z" fill="#f0b43e" stroke="#2a2a6a" stroke-width="1.5"/></g>`;
    const v = F.ctl.st.vb; if (v && F.folgt) F.ctl.center(p.lat, p.lon);
    if (L.antrieb === 'motor' && !F.paused) { t.sprit = Math.max(0, t.sprit - .03); if (t.sprit <= 0) { L.antrieb = 'segel'; AUD.loop('motorLauf', 0); if (t.vorrat.diesel > 0) { t.vorrat.diesel--; t.sprit = 30; L.antrieb = 'motor'; toast('Tank leer: Dieselkanister nachgefüllt.'); } else toast('Sprit alle! Weiter unter Segel.'); } }
  }
}

/* ---------- Szene vorbereiten: was man vor der Aufgabe sieht und hört ---------- */
function vorbereiten(idx) {
  const L = F.L, task = L.plan.tasks[idx], d = core.def(D, task) || {};
  const R = core.rng(L.seed + idx * 31 + L.e * 997);
  const sz = task.typ === 'ev' ? d.szene || {} : {};
  const now = performance.now() / 1000, dur = 6 * F.st.hilfe + 4 + core.zeit(D, task, ctxFor(L));
  const ship = (fz, von, extra = {}) => {
    const rb0 = von === 'stb' ? 45 + R() * 20 : von === 'bb' ? -45 - R() * 20 : von === 'voraus' ? (R() - .5) * 10 : 160;
    const fog = L.wx === 'nebel';
    F.scene.push({k: 'schiff', idx, fz, rb: rb0, d0: fog ? .5 : extra.nah ? .9 : 2.2, d1: extra.kollision ? .12 : fog ? .22 : .45, t0: now, dur, drift: extra.drift || 0, aspect: extra.aspect || (von === 'stb' ? 'rot' : von === 'bb' ? 'gruen' : extra.gegen ? 'beide' : 'heck'), blau: extra.blau, ...extra});
  };
  if (task.typ === 'ev') {
    if (sz.typ === 'schiff') ship(sz.fz, sz.von, {kollision: sz.kollision, nah: sz.nah, gegen: sz.gegen, blau: sz.blau, aspect: sz.zeige === 'rot' ? 'rot' : sz.zeige === 'gruen' ? 'gruen' : null, drift: sz.peil ? (task.konst = R() < .55, task.konst ? 0 : (R() < .5 ? -1 : 1) * (14 + R() * 10)) : 0});
    if (sz.typ === 'vtg') for (let i = 0; i < 3; i++) F.scene.push({k: 'schiff', idx, fz: 'motor50', rb: -30 + i * 25, d0: 3 + i * .6, d1: 2.6 + i * .5, t0: now, dur: 60, drift: 20, aspect: 'rot'});
    if (sz.typ && sz.typ !== 'schiff') F.scene.push({k: sz.typ, idx, t0: now, dur, pan: sz.pan || 0, horn: sz.horn, glocke: sz.glocke});
    if (sz.horn) setTimeout(() => AUD.horn(sz.horn, null, sz.pan || 0), 600);
    if (sz.glocke) { const ring = () => AUD.sfx('glocke', {vol: .5, pan: sz.pan || 0, dur: 2.5}); ring(); setTimeout(ring, 3000); }
    if (d.wxNeu) { L.wx = d.wxNeu; if (d.wxNeu === 'sturm') L.bft = Math.max(L.bft, 7); if (d.wxNeu === 'windig') L.bft = Math.max(L.bft, 5); if (d.wxNeu === 'flaute') L.bft = 1; if (d.wxNeu === 'nebel') L.bft = Math.min(L.bft, 3); AUD.weather(audWx(), dayAt(), 'deck'); }
  }
  if (task.typ === 'gen') {
    if (task.gen === 'lichter' || task.gen === 'signalkoerper') {
      const pool = D.fahrzeuge.filter(f => task.gen === 'lichter' ? f.nacht : f.tag);
      task.fz = task.fz || pickR(R, pool).id; const von = pickR(R, ['stb', 'bb', 'voraus']);
      ship(task.fz, von, {aspect: von === 'stb' ? 'rot' : von === 'bb' ? 'gruen' : 'beide'});
    }
    if (task.gen === 'strom' && !task.obj) { const B = K.objekte.filter(o => ['bb', 'stb'].includes(o.typ)); const p = posNow(); task.obj = B.sort((a, b) => geo.kd([p.lat, p.lon], [a.lat, a.lon]).d - geo.kd([p.lat, p.lon], [b.lat, b.lon]).d)[0].id; const s = K.strom; const ri = s.rw.map((v, i) => v == null ? -1 : i).filter(i => i >= 0); task.rw = s.rw[pickR(R, ri)]; F.scene.push({k: 'strom', idx, obj: task.obj, rw: task.rw, t0: now, dur}); }
  }
}

/* ---------- Aufgabe zeigen ---------- */
function zeigeAufgabe(idx, wieder) {
  const L = F.L, task = L.plan.tasks[idx];
  if (!F.wahr[idx]) { F.wahr[idx] = true; vorbereiten(idx); }
  const c = ctxFor(L), zeit = core.zeit(D, task, c);
  let A;
  if (task.typ === 'frage') A = frageAufgabe(task, idx);
  else if (task.typ === 'gen') A = genAufgabe(task);
  else { const d = core.def(D, task); A = {titel: d.titel, q: d.q, opts: d.opts, ok: d.ok, expl: d.expl, ref: d.ref, ref2: d.ref2, signal: d.signal, gen: d.gen}; if (d.gen === 'peilung') A = peilAufgabe(task, d); }
  if (!A) { L.i++; return; }
  A.zeit = A.offen ? 0 : zeit; A.idx = idx;
  if (!L.card || L.card.idx !== idx) L.card = {idx, rest: A.zeit, order: null, seq: ''};
  F.card = A; F.hornSeq = L.card.seq || '';
  AUD.sfx('piep', {vol: .35});
  const order = L.card.order || (L.card.order = shuffle(A.opts ? A.opts.map((_, i) => i) : []));
  const hilfe = F.st.hilfe >= 1.5 && A.opts && A.opts.length > 2 && !A.signal;
  $('#twtask').innerHTML = `<div class="tw-task"><h3><span>${esc(A.titel)}${task.kombi ? ' ⚡' : ''}</span>${A.zeit ? `<span class="small" id="twsek">${Math.ceil(L.card.rest)} s</span>` : ''}</h3>${A.zeit ? '<div class="tw-bar" id="twbar"><i style="width:100%"></i></div>' : ''}
    ${A.img ? A.img.map(s => `<img class="tw-img" src="${s}" alt="">`).join('') : ''}<p>${NAV.linkTerms(A.q)}</p>${A.sig ? `<div class="tw-seq">${esc(A.sig.replace(/mindestens\s*/, ''))}</div><button class="btn small ghost" id="twplay" style="margin-bottom:6px">▶ Signal anhören</button>` : ''}
    ${A.signal ? `<div class="tw-seq" id="twseq">${esc(F.hornSeq) || '&nbsp;'}</div><div class="tw-horn"><button class="btn" data-h="●">● kurz</button><button class="btn" data-h="▬">▬ lang</button><button class="btn ghost" data-h="x">⌫</button></div><button class="btn lamp wide" id="twsig">Signal fertig</button>`
      : A.offen ? `<button class="btn lamp wide" id="twauf">Antwort aufdecken</button>` : `<div class="tw-opts">${order.map(i => `<button class="btn" data-o="${i}">${esc(A.opts[i])}</button>`).join('')}</div>`}
    ${hilfe ? '<button class="btn ghost small" id="twtipp" style="margin-top:6px">💡 Crew fragen (streicht eine falsche Antwort)</button>' : ''}<div id="twfb"></div></div>`;
  NAV.bindTerms($('#twtask'));
  app.querySelectorAll('[data-o]').forEach(b => b.onclick = () => antwort(+b.dataset.o === A.ok ? 'ok' : 'falsch', +b.dataset.o));
  app.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { const h = b.dataset.h; if (h === 'x') F.hornSeq = F.hornSeq.split(' ').slice(0, -1).join(' '); else { F.hornSeq = (F.hornSeq ? F.hornSeq + ' ' : '') + h; AUD.horn(h); } L.card.seq = F.hornSeq; $('#twseq').innerHTML = esc(F.hornSeq) || '&nbsp;'; });
  if ($('#twsig')) $('#twsig').onclick = () => antwort(norm(F.hornSeq) === norm(A.signal) ? 'ok' : 'falsch');
  if ($('#twauf')) $('#twauf').onclick = () => offenAufdecken(A);
  if ($('#twplay')) $('#twplay').onclick = () => AUD.horn(A.sig);
  if ($('#twtipp')) $('#twtipp').onclick = e => { e.target.remove(); const wrong = [...app.querySelectorAll('[data-o]')].filter(b => +b.dataset.o !== A.ok && !b.disabled); if (wrong.length) { const b = wrong[Math.random() * wrong.length | 0]; b.disabled = true; b.style.textDecoration = 'line-through'; } };
}
const karte = k => { try { return (typeof KARTEN !== 'undefined' && KARTEN[k]) || null; } catch (e) { return null; } };
const norm = s => String(s || '').replace(/\s+/g, '');
function karteTick() {
  const L = F.L; if (!L.card || !F.card || !F.card.zeit || F.fb) return;
  const now = performance.now(); if (!F.ct) F.ct = now; const dt = (now - F.ct) / 1000; F.ct = now;
  L.card.rest -= Math.min(.25, dt);
  const bar = $('#twbar'), sek = $('#twsek');
  if (bar) { bar.firstElementChild.style.width = Math.max(0, L.card.rest / F.card.zeit * 100) + '%'; bar.classList.toggle('eng', L.card.rest < 8); }
  if (sek) sek.textContent = Math.max(0, Math.ceil(L.card.rest)) + ' s';
  if (L.card.rest <= 0) antwort('spaet');
}
/* Antwort auswerten, Folgen anwenden, Erklärung mit amtlicher Antwort zeigen */
function antwort(outcome, gewaehlt) {
  const L = F.L, A = F.card, task = L.plan.tasks[A.idx], t = T2(); if (F.fb) return;
  F.fb = true; F.ct = 0;
  const c = ctxFor(L), f = core.folgen(D, task, outcome, c);
  L.zustand -= f.schaden; L.laune = Math.max(0, Math.min(100, L.laune + f.laune)); L.punkte += f.punkte;
  Object.keys(f.verbrauch).forEach(k => { t.vorrat[k] = Math.max(0, (t.vorrat[k] || 0) - f.verbrauch[k]); });
  if (f.antrieb && f.antrieb !== L.antrieb) { L.antrieb = f.antrieb; AUD.loop('motorLauf', L.antrieb === 'motor' ? .22 : 0); }
  const ok = outcome === 'ok';
  const r = {titel: A.titel, ok, spaet: outcome === 'spaet', expl: A.expl, ref: A.ref, frage: A.frage, schaden: f.schaden};
  L.eRes.push(r);
  if (A.frage && !ok) markWrong(A.frage);
  AUD.sfx(ok ? 'richtig' : 'falsch', {vol: ok ? .45 : .35}); crewSay(ok ? 'gut' : outcome === 'spaet' ? 'spaet' : 'schlecht', .35);
  app.querySelectorAll('[data-o]').forEach(b => { b.disabled = true; if (+b.dataset.o === A.ok) b.classList.add('richtig'); else if (+b.dataset.o === gewaehlt) b.classList.add('falsch'); });
  ['#twsig', '#twtipp', '#twauf'].forEach(s => { const x = $(s); if (x) x.disabled = true; }); app.querySelectorAll('[data-h]').forEach(b => b.disabled = true);
  const kopf = ok ? '<b class="nok">Richtig!</b>' : outcome === 'spaet' ? '<b class="nno">Zu spät!</b>' : '<b class="nno">Nicht richtig.</b>';
  const folge = ok ? (f.punkte ? ` +${f.punkte} Punkte.` : '') : ` Boot −${f.schaden} %.`;
  $('#twfb').innerHTML = `<div class="tw-fb">${kopf}${folge}${A.signal ? ` Richtig ist: <b>${esc(A.signal)}</b>.` : ''} ${f.notiz ? '<br>' + esc(f.notiz) : ''}<p>${NAV.linkTerms(esc(A.expl || ''))}</p>${A.amtHtml || amtlich(A.ref)}<button class="btn lamp wide" id="twok">Weiter</button></div>`;
  NAV.bindTerms($('#twfb'));
  /* Polizei: drei Katalogfragen gleich hinterher */
  const d = task.typ === 'ev' && core.def(D, task);
  if (d && d.quiz && !task.quizDone) { task.quizDone = true; const sch = Object.entries(F.st.scheine); for (let i = 0; i < d.quiz; i++) L.plan.tasks.splice(A.idx + 1, 0, {typ: 'frage', schein: sch.sort((a, b) => b[1] - a[1])[0][0], tags: ['recht', 'sicherheit', 'fahrwasser'], at: L.t, kontrolle: true}); }
  $('#twok').onclick = () => {
    AUD.click(); $('#twtask').innerHTML = ''; F.fb = false; F.card = null; L.card = null; L.i = A.idx + 1; F.last = performance.now();
    F.scene.forEach(s => { if (s.idx === A.idx) s.weg = performance.now() / 1000; });
    if (L.zustand <= 0) return seenot();
    if (L.laune <= 0) return meuterei();
    save();
  };
  save();
}
/* Falsch beantwortete Katalogfragen in die normale Wiederholung des richtigen Scheins */
function markWrong(fr) {
  try {
    if (fr.s === S.course) return record(fr.n, false);
    S.courses = S.courses || {}; const b = S.courses[fr.s] = S.courses[fr.s] || {}; b.qs = b.qs || {};
    const s = b.qs[fr.n] || {b: 0, d: today(), w: 0, c: 0}; s.b = 1; s.w = (s.w || 0) + 1; s.d = today(); b.qs[fr.n] = s;
  } catch (e) {}
}

/* ---------- Katalogfragen (SBF Ankreuzen, SKS als Multiple Choice oder „nur offen“) ---------- */
function frageAufgabe(task, idx) {
  const L = F.L;
  if (!task.key) {
    const used = new Set(L.fragen || []), sch = task.schein;
    const pool = sch === 'sks' ? SKS_DATA.filter(q => !q.sketch && q.a && !(SKSMC[q.id] && SKSMC[q.id].bild)) : DATA.filter(q => !q.skip);
    const key = q => sch === 'sks' ? 'sks:' + q.id : 'sbf:' + q.n;
    let cand = pool.filter(q => !used.has(key(q)) && (TAGS[key(q)] || []).some(x => task.tags.includes(x)));
    if (cand.length < 4) cand = pool.filter(q => !used.has(key(q)));
    const b = sch === S.course ? S.qs : ((S.courses || {})[sch] || {}).qs || {};
    const q = weighted(Math.random, cand, q => { const s = b[sch === 'sks' ? q.id : q.n]; return !s ? 2 : s.b <= 1 ? 4 : s.b >= 4 ? .5 : 1; });
    if (!q) return null;
    task.key = key(q); L.fragen = (L.fragen || []).concat(task.key);
  }
  const [s, id] = task.key.split(':'), titel = task.kontrolle ? 'Kontrolle: Frage' : 'Frage aus dem Katalog';
  if (s === 'sbf') {
    const q = DATA.find(x => String(x.n) === id); if (!q) return null;
    const card = karte(task.key);
    return {titel: titel + ' (SBF See ' + q.n + ')', q: esc(q.q), img: q.img, sig: q.sig, opts: q.a.slice(), ok: 0, expl: card ? card.e : '', ref: task.key, frage: {s: 'sbf', n: q.n}, amtHtml: `<div class="amt small"><b>Amtlich richtig:</b> ${esc(q.a[0])}</div>`};
  }
  const q = SKS_DATA.find(x => x.id === id); if (!q) return null;
  const mc = SKSMC[id], amt = `<div class="amt small"><b>Amtliche Antwort:</b><br>${esc(cleanA(q.a)).replace(/\n/g, '<br>')}</div>`;
  const card = karte(task.key);
  if (mc && !mc.offen) return {titel: titel + ' (SKS)', q: esc(q.q), opts: [mc.r].concat(mc.f), ok: 0, expl: card ? card.e : '', ref: null, frage: {s: 'sks', n: q.id}, amtHtml: amt};
  return {titel: titel + ' (SKS, offen)', q: esc(q.q), offen: true, amt, ok: 0, frage: {s: 'sks', n: q.id}, amtHtml: amt, expl: card ? card.e : ''};
}
/* „Nur offen“: aufdecken, dann selbst bewerten (ohne Zeitlimit) */
function offenAufdecken(A) {
  $('#twauf').remove();
  $('#twfb').innerHTML = `${A.amt}<p class="small">Hättest du das gewusst?</p><div class="row"><button class="btn lamp" id="twja">Gewusst</button><button class="btn" id="twnein">Nicht gewusst</button></div>`;
  $('#twja').onclick = () => { A.amtHtml = ''; $('#twfb').innerHTML = ''; antwort('ok'); };
  $('#twnein').onclick = () => { A.amtHtml = A.amt; $('#twfb').innerHTML = ''; antwort('falsch'); };
}

/* ---------- Kartenaufgaben: Tonnen, Feuer, Kardinaltonnen, Lichter, Signalkörper, Strom ---------- */
const OBJ = id => K.objekte.find(o => o.id === id);
function genAufgabe(task) {
  const g = task.gen, R = core.rng(F.L.seed + F.L.i * 13);
  if (g === 'tonne') {
    const o = OBJ(task.obj); if (!o) return null;
    if (o.typ === 'mitte') return {titel: 'Ansteuerungstonne', q: `Voraus die Tonne <b>${o.id}</b>: ${esc(o.farbe)}, Toppzeichen ${esc(o.topp)}. Was bedeutet sie?`, opts: ['Mitte des Fahrwassers (sicheres Wasser). Ich kann sie an beiden Seiten passieren.', 'Gefahrenstelle, nur nördlich passieren.', 'Backbordseite des Fahrwassers.', 'Ankerplatz für Sportboote.'], ok: 0, expl: o.bed + '.', ref: 'sbf:190'};
    const ein = task.ein, bb = o.typ === 'bb', seite = (bb === ein) ? 0 : 1;
    return {titel: 'Tonne voraus', q: `Voraus liegt die Tonne <b>${o.id}</b>: ${esc(o.farbe)}, Toppzeichen ${esc(o.topp)}. Du fährst ${ein ? 'von See kommend die Kliev hinauf' : 'die Kliev hinunter Richtung See'}. An welcher Seite lässt du sie liegen?`,
      opts: ['An Backbord', 'An Steuerbord', 'Egal, Hauptsache im Fahrwasser', 'Ich fahre dicht über sie hinweg'], ok: seite, ref: 'sbf:157',
      expl: `${o.id} ist eine ${bb ? 'rote Tonne (Backbordseite)' : 'grüne Tonne (Steuerbordseite)'} des Fahrwassers. Die Steuerbordseite ist die Seite, die ein von See kommendes Schiff an Steuerbord hat. ${ein ? 'Du kommst von See' : 'Du fährst seewärts'}, also: ${seite === 0 ? 'an Backbord' : 'an Steuerbord'} lassen.`};
  }
  if (g === 'kardinal') {
    const o = OBJ(task.obj); if (!o) return null;
    if (o.typ === 'einzel') return {titel: 'Einzelgefahr', q: `Voraus eine Tonne: ${esc(o.farbe)}, Toppzeichen ${esc(o.topp)}, Kennung ${esc(o.kenn)}. Was bedeutet sie?`, opts: ['Eine Einzelgefahrenstelle, die an allen Seiten passiert werden kann.', 'Die Mitte des Fahrwassers.', 'Eine Gefahrenstelle, die nur nördlich zu passieren ist.', 'Ein Liegeplatz für Fischer.'], ok: 0, expl: o.bed + '. Abstand halten!', ref: 'sbf:209'};
    const ri = {nord: 0, west: 3}[o.typ];
    return {titel: 'Kardinaltonne', q: `Voraus eine Tonne: ${esc(o.farbe)}, Toppzeichen ${esc(o.topp)}, Kennung ${esc(o.kenn)}. Wo passierst du sie?`, opts: ['Nördlich der Tonne', 'Südlich der Tonne', 'Östlich der Tonne', 'Westlich der Tonne'], ok: ri, expl: o.bed + '. Die Kardinaltonne liegt in dem Quadranten, in dem man passieren soll.', ref: o.typ === 'nord' ? 'sbf:204' : 'sbf:207'};
  }
  if (g === 'feuer') {
    const o = OBJ(task.obj); if (!o || !o.kenn) return null;
    const andere = shuffle(K.objekte.filter(x => x.kenn && x.id !== o.id && x.kenn !== o.kenn && !['turm', 'feuer'].includes(x.typ))).slice(0, 3);
    const opts = [o].concat(andere).map(x => `${x.id} (${x.kenn})`);
    return {titel: 'Feuer erkennen', q: `Voraus blinkt eine Leuchttonne. Schau genau hin und zähle mit: Welche ist es?`, opts, ok: 0, expl: `Es ist ${o.id}: ${NAV.kennWorte ? NAV.kennWorte(o.kenn) : o.kenn}. ${o.bed}.`, ref: o.typ === 'bb' ? 'sbf:199' : o.typ === 'stb' ? 'sbf:198' : 'sbf:190'};
  }
  if (g === 'lichter' || g === 'signalkoerper') {
    const fz = D.fahrzeuge.find(f => f.id === task.fz), nacht = g === 'lichter';
    const andere = shuffle(D.fahrzeuge.filter(f => f.id !== fz.id && (nacht ? f.nacht : f.tag))).slice(0, 3);
    const opts = [fz].concat(andere).map(f => f.name);
    return {titel: nacht ? 'Lichter bei Nacht' : 'Signalkörper', q: nacht ? 'Voraus Lichter. Was für ein Fahrzeug ist das? (Fernglas hilft.)' : 'Ein Fahrzeug zeigt Signalkörper. Was für eines ist das? (Fernglas hilft.)', opts, ok: 0,
      expl: `Das ist ein ${fz.name}.`, ref: nacht ? fz.ref : fz.tagRef};
  }
  if (g === 'kurs') {
    const wp = F.e.wp, a = wp[task.leg], b = wp[task.leg + 1]; if (!b) return null;
    const rwK = Math.round(NAV.kursDist({lat: a[0], lon: a[1]}, {lat: b[0], lon: b[1]}).k), mw = NAV.mw(), mwK = n360(rwK - mw);
    let m = mwK; for (let i = 0; i < 4; i++) m = n360(mwK - NAV.ablenkung(m)); const abl = Math.round(((mwK - m + 540) % 360) - 180), mgK = n360(Math.round(m));
    const fd = v => String(Math.round(n360(v)) % 360).padStart(3, '0') + '°', falsch1 = n360(rwK + mw - abl), falsch2 = rwK;
    const opts = [fd(mgK), fd(falsch1 === mgK ? falsch1 + 6 : falsch1), fd(falsch2 === mgK || falsch2 === falsch1 ? falsch2 + 10 : falsch2)];
    return {titel: 'Kurs selbst absetzen', q: `Gleich ändern wir den Kurs. In der Karte misst du für den nächsten Abschnitt <b>rwK ${fd(rwK)}</b>. Missweisung ${NAV.fmtSigned(mw)} (${K.mw.dir === 'E' ? 'Ost' : 'West'}), Ablenkung laut Tabelle ${NAV.fmtSigned(abl)}. Welchen Magnetkompasskurs (MgK) steuerst du?`, opts, ok: 0,
      expl: `rwK ${fd(rwK)} − Mw (${NAV.fmtSigned(mw)}) = mwK ${fd(mwK)}; mwK − Abl (${NAV.fmtSigned(abl)}) = MgK ${fd(mgK)}. Östliche Werte zieht man auf dem Weg von rw nach Mg ab.`};
  }
  if (g === 'strom') {
    const o = OBJ(task.obj), rw = task.rw != null ? task.rw : 90, wohin = core.richtung(rw, true), gegen = core.richtung(rw + 180, true), quer = core.richtung(rw + 90, true);
    return {titel: 'Strom an der Tonne', q: `Die Tonne <b>${o.id}</b> liegt schräg, ihr Kielwasser zieht nach <b>${wohin}</b>. Wohin setzt der Strom?`, opts: [`Nach ${wohin}`, `Nach ${gegen}`, `Nach ${quer}`, 'Das kann man an einer Tonne nicht sehen'], ok: 0,
      expl: 'Das Wasser strömt an der Tonne vorbei, das Kielwasser zieht in die Richtung, wohin der Strom setzt. Stromangaben in der Karte nennen immer das „wohin“.'};
  }
  return null;
}
function peilAufgabe(task, d) {
  const konst = !!task.konst;
  return {titel: d.titel, q: d.q, opts: ['Ja: Der Abstand nimmt ab und die Peilung steht.', 'Nein: Die Peilung ändert sich deutlich, er läuft vorbei.', 'Das kann man nur mit Radar sagen.'], ok: konst ? 0 : 1, expl: d.expl, ref: d.ref};
}
/* Peilen: rechtweisende Peilung zum nächsten Schiff (oder Objekt) in Blickrichtung */
function peilen() {
  if (!F) return; AUD.click();
  const ships = F.scene.filter(s => s.k === 'schiff' && !s.weg), now = performance.now() / 1000, p = posNow(), H = F.heading != null ? F.heading : p.k;
  let tx;
  if (ships.length) { const s = ships.sort((a, b) => Math.abs(rbOf(a, now)) - Math.abs(rbOf(b, now)))[0]; tx = `Peilung ${String(Math.round(n360(H + rbOf(s, now) + (Math.random() - .5) * 1.5))).padStart(3, '0')}° · Abstand ca. ${comma(dOf(s, now), 1)} sm`; }
  else { const vis = K.objekte.map(o => ({o, ...geo.kd([p.lat, p.lon], [o.lat, o.lon])})).filter(x => x.d < 6 && Math.abs(((x.k - H + 540) % 360) - 180) < 35).sort((a, b) => Math.abs(((a.k - H + 540) % 360) - 180) - Math.abs(((b.k - H + 540) % 360) - 180))[0];
    tx = vis ? `${vis.o.id}: Peilung ${String(Math.round(vis.k)).padStart(3, '0')}° · ${comma(vis.d, 1)} sm` : 'Nichts in Peilrichtung.'; }
  F.peil = {t: now, tx}; F.peilLog = (F.peilLog || []).concat(tx).slice(-3);
  if (F.card) { const fb = $('#twfb'); if (fb && !F.fb) fb.innerHTML = `<p class="small">🧭 ${F.peilLog.map(esc).join('<br>🧭 ')}</p>`; }
}

/* ---------- Schäden, Seenot, Meuterei, Etappen-Ende ---------- */
function seenot() {
  const t = T2(), L = t.lauf, tn = D.toerns.find(x => x.id === L.id), teile = teileSet();
  const ukw = teile.has('ukw'), insel = teile.has('rettungsinsel'), sig = (t.vorrat.signal || 0) > 0;
  const verlust = Math.round(t.kasse * (insel ? .15 : ukw ? .25 : .5)); t.kasse -= verlust; t.prov = Math.max(0, t.prov - 1); if (sig) t.vorrat.signal--;
  t.log.push({day: today(), t: tn.name, e: L.e + 1, sterne: 0, ok: L.eRes.filter(r => r.ok).length, n: L.eRes.length, punkte: L.punkte, art: ukw ? 'abgeschleppt' : 'seenot'});
  LOG.add('törn', `${tn.name}: ${ukw ? 'abgeschleppt' : 'Seenot'}`);
  stopFahrt(); crewSay('seenot', 1);
  t.lauf = null; save();
  shell('Törn beendet', `<div class="card"><h2 style="margin:0 0 6px">${ukw ? '🚤 Abgeschleppt' : '🆘 Seenot'}</h2><p>Das Boot ist zu sehr mitgenommen. ${ukw ? 'Über UKW kam schnell Hilfe, ein Seenotrettungskreuzer schleppt euch in den Hafen.' : sig ? 'Mit der roten Handfackel habt ihr Hilfe gerufen. Die Seenotretter holen euch rein.' : 'Ohne Funk und Signalmittel dauert es lange, bis Hilfe kommt.'}</p>
    <p class="small">Verlust: ${verlust} Taler und ein Proviantpaket.${insel ? ' Die Rettungsinsel hat Schlimmeres verhindert.' : ''}</p></div>
    ${fehlerListe(L.eRes)}<button class="btn lamp wide" id="twzu">Zur Törnwahl</button>`);
  bindFehler(); $('#twzu').onclick = () => TOERN.open(); $('#gback').onclick = () => setTab('deck');
}
function meuterei() {
  const t = T2(); t.prov = Math.max(0, t.prov - 1); const L = t.lauf; t.lauf = null; stopFahrt(); save();
  shell('Törn beendet', `<div class="card"><h2 style="margin:0 0 6px">😤 Die Crew streikt</h2><p>Die Laune ist auf null. Die Crew will heim. Ein Proviantpaket ist futsch.</p></div>${fehlerListe(L.eRes)}<button class="btn lamp wide" id="twzu">Zur Törnwahl</button>`);
  bindFehler(); $('#twzu').onclick = () => TOERN.open();
}
function etappeEnde() {
  const t = T2(), L = t.lauf, tn = D.toerns.find(x => x.id === L.id), st = D.stufen[L.si];
  const ok = L.eRes.filter(r => r.ok).length, n = L.eRes.length, sterne = core.sterne(ok, n, L.zustand);
  L.sterne.push(sterne); L.res = L.res.concat(L.eRes);
  const taler = Math.round(L.punkte / 10); t.kasse += taler; L.taler = taler;
  /* Fundstück */
  const R = core.rng(L.seed + L.e * 3 + 1);
  if (R() < .3) { const f = pickR(R, D.teile.filter(x => x.fund && (x.art === 'vorrat' || !t.teile.includes(x.id)))); if (f) { if (f.art === 'teil') t.teile.push(f.id); else if (f.id === 'proviant') t.prov++; else t.vorrat[f.id] = (t.vorrat[f.id] || 0) + 1; L.fund = f.id; } }
  t.log.push({day: today(), t: tn.name, e: L.e + 1, sterne, ok, n, punkte: L.punkte, art: L.antrieb});
  t.log = t.log.slice(-60);
  L.zustand = Math.min(100, L.zustand + st.reparatur);
  if (D.orte[tn.etappen[L.e].nach] && D.orte[tn.etappen[L.e].nach].hafen && t.sprit < 100) { const kosten = Math.min(t.kasse, Math.round((100 - t.sprit) / 4)); t.kasse -= kosten; t.sprit = Math.min(100, t.sprit + kosten * 4); L.tank = kosten; }
  L.phase = 'nach'; save(); stopFahrt();
  AUD.sfx('glocke', {vol: .5}); crewSay('ankunft', .9);
  LOG.add('törn', `${tn.name} Etappe ${L.e + 1}: ${ok}/${n}, ${sterne} Sterne`);
  nachbesprechung();
}
function fehlerListe(res) {
  const bad = res.filter(r => !r.ok); if (!bad.length) return '<p class="small">Keine Fehler. Stark!</p>';
  return `<div class="card"><h3 style="margin:0 0 4px">Nachbesprechung</h3>${bad.map((r, i) => `<div class="tw-err"><b>${r.spaet ? '⏱' : '✗'} ${esc(r.titel)}</b><span class="small">${NAV.linkTerms(esc(r.expl || ''))}</span>${r.ref ? `<button class="btn ghost small" data-ref="${esc(r.ref)}" style="margin-top:4px">Amtliche Frage ansehen</button>` : ''}${r.frage && r.frage.s === 'sks' ? `<button class="btn ghost small" data-sks="${esc(r.frage.n)}" style="margin-top:4px">Amtliche Antwort ansehen</button>` : ''}</div>`).join('')}<p class="small muted" style="margin:6px 0 0">Falsch beantwortete Katalogfragen kommen in deine normale Wiederholung.</p></div>`;
}
function bindFehler() {
  app.querySelectorAll('[data-ref]').forEach(b => b.onclick = () => sheet(`<h3 style="margin:0 0 6px">Aus dem Katalog</h3>${amtlich(b.dataset.ref)}`));
  app.querySelectorAll('[data-sks]').forEach(b => b.onclick = () => sheet(`<h3 style="margin:0 0 6px">Aus dem Katalog</h3>${amtlich('sks:' + b.dataset.sks)}`));
  NAV.bindTerms(app);
}
function nachbesprechung() {
  const t = T2(), L = t.lauf, tn = D.toerns.find(x => x.id === L.id), e = tn.etappen[L.e];
  const ok = L.eRes.filter(r => r.ok).length, n = L.eRes.length, sterne = L.sterne[L.sterne.length - 1] || 1, letzte = L.e >= tn.etappen.length - 1;
  const fund = L.fund && D.teile.find(x => x.id === L.fund);
  let bonus = 0;
  if (letzte && !L.bonus) { const avg = L.sterne.reduce((a, b) => a + b, 0) / L.sterne.length; bonus = Math.round([20, 40, 70, 110, 170][L.si] * avg / 3); t.kasse += bonus; L.bonus = bonus; t.schnitt[tn.id] = Math.max(t.schnitt[tn.id] || 0, Math.round(avg)); save(); }
  shell('Angekommen', `<div class="card"><h2 style="margin:0 0 6px">${'⭐'.repeat(sterne)}${'☆'.repeat(3 - sterne)} ${esc(e.nach)} erreicht</h2>
    <p style="margin:0">Etappe ${L.e + 1} von ${tn.etappen.length} · ${ok} von ${n} Aufgaben richtig · ${L.punkte} Punkte</p>
    <p class="small muted" style="margin:6px 0 0">Boot ${Math.round(L.zustand)} % (nach Reparatur) · Laune ${Math.round(L.laune)} · +${L.taler || 0} Taler${L.tank ? ` · getankt für ${L.tank} Taler` : ''}${L.bonus ? ` · Törn-Prämie ${L.bonus} Taler` : ''}</p>
    ${fund ? `<p class="small" style="margin:6px 0 0">🎁 Fundstück: <b>${esc(fund.name)}</b>${fund.art === 'teil' ? ' (gleich verbaut)' : ''}</p>` : ''}</div>
    ${fehlerListe(L.eRes)}
    <div class="row">${letzte ? '<button class="btn lamp" id="twfertig">Törn abschließen</button>' : '<button class="btn lamp" id="twnext">Nächste Etappe</button>'}<button class="btn ghost" id="twdeck">An Deck</button></div>`);
  bindFehler();
  $('#gback').onclick = () => setTab('deck'); $('#twdeck').onclick = () => setTab('deck');
  if ($('#twnext')) $('#twnext').onclick = () => { L.e++; L.phase = 'wach'; L.plan = null; L.card = null; L.fund = null; L.taler = 0; L.tank = 0; L.w = null; L.wPrev = null; L.punkte = 0; save(); weiter(); };
  if ($('#twfertig')) $('#twfertig').onclick = () => { t.lauf = null; save(); LOG.add('törn', tn.name + ' geschafft'); toast(`${tn.name} geschafft!`); TOERN.open(); };
}

/* ---------- Bootsladen und Logbuch ---------- */
function laden() {
  const t = T2();
  const row = x => { const own = x.art === 'teil' && t.teile.includes(x.id), cnt = x.art === 'vorrat' ? (x.id === 'proviant' ? t.prov : t.vorrat[x.id] || 0) : 0;
    return `<div class="tw-card"><div class="tw-row"><b>${esc(x.name)}</b><span>${own ? '✓ an Bord' : x.preis + ' Taler'}</span></div><p class="small muted">${esc(x.text)}</p>${x.art === 'vorrat' ? `<p class="small">Vorrat: ${cnt}</p>` : ''}${own ? '' : `<button class="btn small" data-kauf="${x.id}" ${t.kasse < x.preis ? 'disabled' : ''}>Kaufen</button>`}</div>`; };
  shell('Bootsladen', `<div class="tw-res"><span class="tw-chip">🪙 ${t.kasse} Taler</span><span class="tw-chip">⛽ ${Math.round(t.sprit)} %</span></div>
    <p class="small muted">Taler gibt es fürs Lernen (15 je Lerntag mit 10 Antworten) und für Törns. Verbaute Teile siehst du am Boot in der Nahansicht.</p>
    <button class="btn small" id="twtank" ${t.sprit >= 100 || t.kasse < 1 ? 'disabled' : ''}>Volltanken (${Math.ceil((100 - t.sprit) / 4)} Taler)</button>
    <div class="tw-stufe">Verbauen</div>${D.teile.filter(x => x.art === 'teil').map(row).join('')}<div class="tw-stufe">Vorrat</div>${D.teile.filter(x => x.art === 'vorrat').map(row).join('')}`);
  $('#gback').onclick = () => TOERN.open();
  $('#twtank').onclick = () => { const k = Math.min(t.kasse, Math.ceil((100 - t.sprit) / 4)); t.kasse -= k; t.sprit = Math.min(100, t.sprit + k * 4); save(); laden(); };
  app.querySelectorAll('[data-kauf]').forEach(b => b.onclick = () => { const x = D.teile.find(z => z.id === b.dataset.kauf); if (t.kasse < x.preis) return; t.kasse -= x.preis; if (x.art === 'teil') t.teile.push(x.id); else if (x.id === 'proviant') t.prov++; else t.vorrat[x.id] = (t.vorrat[x.id] || 0) + 1; AUD.sfx('richtig', {vol: .3}); LOG.add('törn', 'gekauft: ' + x.name); save(); laden(); });
}
function logbuch() {
  const t = T2();
  shell('Törn-Logbuch', t.log.length ? t.log.slice().reverse().map(x => `<div class="tw-row"><span class="small">${new Date(x.day * 864e5).toLocaleDateString('de-DE', {day: 'numeric', month: 'short'})} · ${esc(x.t)} · Etappe ${x.e}${x.art === 'seenot' ? ' · Seenot' : x.art === 'abgeschleppt' ? ' · abgeschleppt' : ''}</span><span class="small">${'⭐'.repeat(x.sterne)} ${x.ok}/${x.n}</span></div>`).join('') : '<p class="small muted">Noch keine Etappe gefahren.</p>');
  $('#gback').onclick = () => TOERN.open();
}

/* ======================= Sicht vom Steuer (Canvas) ======================= */
const rbOf = (s, now) => { const f = clamp((now - s.t0) / s.dur, 0, 1); let rb = s.rb + s.drift * f; if (s.weg) rb += (rb >= 0 ? 1 : -1) * (now - s.weg) * 9; return rb; };
const dOf = (s, now) => { const f = clamp((now - s.t0) / s.dur, 0, 1); let d = s.d0 + (s.d1 - s.d0) * f; if (s.weg) d += (now - s.weg) * .08; return d; };
const C = {
  tag: {skyT: '#8fc3e3', skyB: '#d8ecf3', sea: '#3f86a6', seaD: '#2b6a88', land: '#8aa66e', land2: '#c9b57d'},
  morgen: {skyT: '#a9cbe0', skyB: '#f3d3ae', sea: '#4f8fa8', seaD: '#3a7590', land: '#7f9568', land2: '#cdb27f'},
  abend: {skyT: '#5d6fa3', skyB: '#f0a36b', sea: '#3b6f8f', seaD: '#2c5874', land: '#4d4a5e', land2: '#6a5a5a'},
  nacht: {skyT: '#0b1424', skyB: '#1b2c47', sea: '#10233a', seaD: '#0a1829', land: '#0c1522', land2: '#0f1a2a'},
};
/* Kennung → an/aus zum Zeitpunkt t (Sekunden) */
function lightOn(kenn, t) {
  const m = String(kenn || '').match(/^(Fl|Q|VQ|Iso|Oc)(?:\((\d+)\))?\s*([RGW])?(?:\s*(\d+)s)?/); if (!m) return true;
  const typ = m[1], n = +m[2] || 1, per = +m[4] || (typ === 'Q' ? 1 : typ === 'VQ' ? .5 : 4), ph = t % per;
  if (typ === 'Fl') return ph < n * 1.2 && (ph % 1.2) < .5;
  if (typ === 'Q' || typ === 'VQ') { const c = typ === 'Q' ? 1 : .5; return m[2] ? ph < n * c && (ph % c) < c / 2 : (ph % c) < c / 2; }
  if (typ === 'Iso') return ph < per / 2;
  if (typ === 'Oc') return !(ph < n * 2 && (ph % 2) < 1);
  return true;
}
const kennFarbe = k => { const m = String(k || '').match(/\b([RGW])\b/); return m ? {R: '#ff5a4a', G: '#5dff7a', W: '#fffbe0'}[m[1]] : '#fffbe0'; };
/* Abstand bis Land in Blickrichtung (Strahl gegen die Landflächen, Seemeilen) */
function rayLand(px, py, brg) {
  const dx = Math.sin(brg * RAD), dy = Math.cos(brg * RAD); let best = Infinity;
  for (const P of LANDP) for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const ax = P[j][0], ay = P[j][1], bx = P[i][0], by = P[i][1], ex = bx - ax, ey = by - ay, den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
    const t = ((ax - px) * ey - (ay - py) * ex) / den, u = ((ax - px) * dy - (ay - py) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best;
}
function draw(time, dt) {
  const cx = F.cx, W = F.w, H = F.h, dpr = F.dpr; if (!W) return;
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const L = F.L, p = posNow(), day = dayAt(), pal = C[day] || C.tag, wx = L.wx, bft = L.bft || 3, nebel = wx === 'nebel', nacht = day === 'nacht';
  /* Kurs glätten */
  if (F.heading == null) F.heading = p.k; let dH = ((p.k - F.heading + 540) % 360) - 180; F.heading = n360(F.heading + clamp(dH, -25 * dt, 25 * dt));
  const Hd = F.heading, fernOn = performance.now() - F.fern < 3500, fov = fernOn ? 22 : 70, zoom = 70 / fov;
  const roll = Math.sin(time * .9) * (0.6 + bft * .45), pitch = Math.sin(time * 1.3) * (1 + bft * .7);
  const hy = H * .40 + pitch, dyDeck = H * .80;
  const X = rb => W / 2 + rb / (fov / 2) * (W / 2), Y = d => hy + (dyDeck - hy) * Math.min(1.1, .1 / (d + .07));
  cx.save(); cx.translate(W / 2, H * .8); cx.rotate(roll * RAD); cx.translate(-W / 2, -H * .8);
  /* Himmel */
  let g = cx.createLinearGradient(0, -20, 0, hy); g.addColorStop(0, pal.skyT); g.addColorStop(1, pal.skyB); cx.fillStyle = g; cx.fillRect(-40, -40, W + 80, hy + 41);
  if (nacht) { cx.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { const sx = (i * 97.3 + Hd * 3) % (W + 40) - 20, sy = (i * 37.1) % (hy * .8); cx.globalAlpha = .4 + .4 * Math.sin(time + i); cx.fillRect(sx, sy, 1.2, 1.2); } cx.globalAlpha = 1; }
  if (['regen', 'sturm', 'windig'].includes(wx) || L.wx === 'gewitter') { cx.fillStyle = wx === 'sturm' ? 'rgba(70,80,95,.55)' : 'rgba(150,160,175,.35)'; for (let i = 0; i < 6; i++) { const x = ((i * 173 - Hd * 4 + time * 6) % (W + 200)) - 100; cx.beginPath(); cx.ellipse(x, hy * .3 + (i % 3) * 14, 90, 22, 0, 0, 7); cx.fill(); } }
  /* Land am Horizont */
  const sightLand = nebel ? .5 : nacht ? 9 : 14;
  if (!F.land || time - F.landT > .5) {
    F.landT = time; F.land = []; const px = p.lon * CL, py = p.lat;
    for (let i = 0; i <= 48; i++) { const rb = -fov / 2 - 4 + (fov + 8) * i / 48; F.land.push({rb, d: rayLand(px, py, n360(Hd + rb))}); }
  }
  cx.fillStyle = pal.land; cx.beginPath(); cx.moveTo(X(F.land[0].rb), hy);
  F.land.forEach(l => { const h = l.d < sightLand ? Math.min(46, 30 / (l.d + .5)) * zoom * .6 + 2 : 0; cx.lineTo(X(l.rb), hy - h); });
  cx.lineTo(X(F.land[F.land.length - 1].rb), hy); cx.closePath(); cx.fill();
  /* Landmarken: Leuchtturm, Kirchturm, Funkmast */
  const near = [];
  for (const o of K.objekte) { const kd = geo.kd([p.lat, p.lon], [o.lat, o.lon]); const rb = ((kd.k - Hd + 540) % 360) - 180; if (Math.abs(rb) < fov / 2 + 4) near.push({o, rb, d: kd.d}); }
  near.filter(n => ['turm', 'kirche', 'mast'].includes(n.o.typ) && n.d < (nacht ? 16 : sightLand)).forEach(n => {
    const x = X(n.rb), hgt = Math.min(60, 40 / (n.d + .6)) * zoom * .7 + 4;
    if (!nacht && !nebel) { cx.fillStyle = n.o.typ === 'turm' ? '#c2473b' : n.o.typ === 'kirche' ? '#6b5a4a' : '#555'; if (n.o.typ === 'mast') { cx.fillRect(x - .8, hy - hgt * 1.4, 1.6, hgt * 1.4); } else { cx.fillRect(x - 2.5, hy - hgt, 5, hgt); if (n.o.typ === 'kirche') { cx.beginPath(); cx.moveTo(x - 3, hy - hgt); cx.lineTo(x, hy - hgt - 8); cx.lineTo(x + 3, hy - hgt); cx.fill(); } else { cx.fillStyle = '#fff'; cx.fillRect(x - 2.5, hy - hgt * .6, 5, hgt * .15); } } }
    if (n.o.kenn && (nacht || day === 'abend') && lightOn(n.o.kenn, time)) glow(x, hy - hgt, 3 * zoom, kennFarbe(n.o.kenn), 14);
    if (n.o.typ === 'mast' && nacht && Math.floor(time) % 2) glow(x, hy - hgt * 1.4, 2, '#ff4040', 8);
  });
  /* Meer */
  g = cx.createLinearGradient(0, hy, 0, H); g.addColorStop(0, pal.sea); g.addColorStop(1, pal.seaD); cx.fillStyle = g; cx.fillRect(-40, hy, W + 80, H - hy + 40);
  cx.strokeStyle = nacht ? 'rgba(150,180,220,.18)' : 'rgba(255,255,255,.35)'; cx.lineWidth = 1;
  const amp = wx === 'flaute' ? .3 : .6 + bft * .5, spd = L.antrieb === 'motor' ? 1.2 : .9;
  for (let k = 1; k <= 16; k++) { const f = k / 16, y = hy + (dyDeck + 40 - hy) * f * f, n = 6 + k; for (let j = 0; j < n; j++) { const x = ((j / n) * (W + 60) + (time * 18 * spd * f + k * 37 - Hd * 6) % ((W + 60) / n)) - 30; cx.beginPath(); cx.moveTo(x, y); cx.quadraticCurveTo(x + 6 * f * 3, y - amp * f * 3, x + 14 * f * 3, y); cx.stroke(); } }
  /* Tonnen und Feuer der Karte */
  near.filter(n => !['turm', 'kirche', 'mast'].includes(n.o.typ)).sort((a, b) => b.d - a.d).forEach(n => {
    const ziel = F.card && F.L.card && (F.L.plan.tasks[F.L.card.idx] || {}).obj === n.o.id, lightVis = nacht || day === 'abend', maxD = ziel ? 9 : nebel ? .45 : lightVis ? 3.2 : 2.4; if (n.d > maxD) return;
    const x = X(n.rb), y = Y(ziel ? Math.min(n.d, nebel ? .4 : 1.2) : n.d), s = Math.max(ziel ? 3 : 1.5, 7 / ((ziel ? Math.min(n.d, 1.2) : n.d) + .15) * zoom * .45);
    if (!nacht) drawBuoy(n.o, x, y, s);
    if (n.o.kenn && lightVis && lightOn(n.o.kenn, time)) glow(x, y - s * 2.2, Math.max(1.6, s * .35), kennFarbe(n.o.kenn), 10);
    if (F.scene.some(sc => sc.k === 'strom' && sc.obj === n.o.id)) { const sc = F.scene.find(q => q.k === 'strom'); const dir = Math.sin(((sc.rw - Hd) * RAD)); cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 1.2; for (let i = 1; i <= 3; i++) { cx.beginPath(); cx.moveTo(x + dir * s * i * 1.4, y + i * .8); cx.lineTo(x + dir * s * (i * 1.4 + 1.2), y + i * .8); cx.stroke(); } }
  });
  /* Ziel-Hafen: Mole am Ende */
  const etappe = F.e, ziel = D.orte[etappe.nach];
  if (ziel && ziel.hafen) { const kd = geo.kd([p.lat, p.lon], ziel.pos), rb = ((kd.k - Hd + 540) % 360) - 180; if (kd.d < (nebel ? .5 : 3) && Math.abs(rb) < fov / 2 + 5) { const x = X(rb), y = Y(kd.d), s = 10 / (kd.d + .2) * zoom * .5; cx.fillStyle = nacht ? '#0d1520' : '#8b8378'; cx.fillRect(x - s * 3, y - s * .6, s * 2.4, s * .6); cx.fillRect(x + s * .6, y - s * .6, s * 2.4, s * .6); if (lightOn('Iso R 4s', time) && (nacht || day === 'abend')) { glow(x - s * .7, y - s, 2.5, '#ff5a4a', 9); } if (lightOn('Iso G 4s', time + 1) && (nacht || day === 'abend')) glow(x + s * .7, y - s, 2.5, '#5dff7a', 9); } }
  /* Schiffe und Szenen der Aufgaben */
  const now = time;
  F.scene = F.scene.filter(s => !s.weg || now - s.weg < 6);
  F.scene.filter(s => s.k === 'schiff').map(s => ({s, rb: rbOf(s, now), d: dOf(s, now)})).sort((a, b) => b.d - a.d).forEach(({s, rb, d}) => {
    if (Math.abs(rb) > fov / 2 + 8 || (nebel && d > .55)) return;
    drawShip(s, X(rb), Y(d), Math.max(2.4, 14 / (d + .1) * zoom * .6), nacht || (day === 'abend' && d > 1), time);
  });
  F.scene.filter(s => s.k === 'mob').forEach(s => { const x = X(-12), y = Y(.06 + (now - s.t0) * .004); cx.fillStyle = '#e8562c'; cx.beginPath(); cx.arc(x, y, 6, 0, 7); cx.fill(); cx.fillStyle = '#f2c9a0'; cx.beginPath(); cx.arc(x + 1, y - 7, 4, 0, 7); cx.fill(); });
  if (F.scene.some(s => s.k === 'boe')) { cx.fillStyle = 'rgba(20,35,50,.35)'; cx.beginPath(); cx.ellipse(X(30), Y(.6), W * .35, 10, 0, 0, 7); cx.fill(); }
  if (F.scene.some(s => s.k === 'gewitter')) { cx.fillStyle = 'rgba(40,45,60,.85)'; cx.beginPath(); cx.moveTo(X(-25), hy); cx.lineTo(X(-22), hy - 60); cx.lineTo(X(-40), hy - 75); cx.lineTo(X(10), hy - 80); cx.lineTo(X(-5), hy - 62); cx.lineTo(X(0), hy); cx.fill(); if ((time % 3) < .12) { cx.fillStyle = 'rgba(255,255,240,.6)'; cx.fillRect(0, 0, W, H); } }
  if (F.scene.some(s => s.k === 'wolken')) { cx.fillStyle = 'rgba(60,70,85,.4)'; cx.fillRect(0, 0, W, hy * .6); }
  /* Nebel */
  if (nebel) { g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, nacht ? 'rgba(40,46,56,.95)' : 'rgba(205,210,214,.96)'); g.addColorStop(.55, nacht ? 'rgba(40,46,56,.85)' : 'rgba(205,210,214,.85)'); g.addColorStop(1, nacht ? 'rgba(40,46,56,.4)' : 'rgba(205,210,214,.35)'); cx.fillStyle = g; cx.fillRect(-40, -40, W + 80, H + 80); }
  /* Regen */
  if (wx === 'regen' || wx === 'sturm') { cx.strokeStyle = 'rgba(220,230,240,.35)'; cx.lineWidth = 1; for (let i = 0; i < 60; i++) { const x = (i * 53.7 + time * 220) % (W + 40) - 20, y = (i * 91.3 + time * 480) % (H + 40) - 20; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x - 4, y + 12); cx.stroke(); } }
  cx.restore();
  /* Vordergrund: Deck, Bug, Vorsegel, Wanten (Peilmarke), Steuerrad */
  drawBoat(W, H, hy, time, nacht);
  /* Anzeigen */
  cx.fillStyle = 'rgba(0,0,0,.45)'; cx.fillRect(6, H - 30, 92, 24); cx.fillStyle = '#ffe9a8'; cx.font = '600 12px system-ui,sans-serif'; cx.fillText(`rwK ${String(Math.round(Hd)).padStart(3, '0')}°`, 12, H - 13);
  if (F.scene.some(s => s.k === 'echolot')) { const dpt = Math.max(1.2, 2.4 - (now - F.scene.find(s => s.k === 'echolot').t0) * .03); cx.fillStyle = 'rgba(0,0,0,.6)'; cx.fillRect(W - 98, H - 30, 92, 24); cx.fillStyle = dpt < 2 ? '#ff7a6a' : '#9ff2a8'; cx.fillText(`Tiefe ${comma(dpt, 1)} m`, W - 92, H - 13); if (Math.floor(now * 2) % 2 && !F.beep) { F.beep = true; AUD.sfx('piep', {vol: .2}); setTimeout(() => F && (F.beep = false), 900); } }
  if (F.scene.some(s => s.k === 'alarm') && Math.floor(now * 3) % 2) glow(W / 2 + 48, H - 34, 6, '#ff3b30', 14);
  if (F.scene.some(s => s.k === 'rauch')) { cx.fillStyle = 'rgba(90,90,90,.45)'; for (let i = 0; i < 6; i++) { cx.beginPath(); cx.arc(W * .3 + Math.sin(now + i) * 10, H * .78 - ((now * 30 + i * 25) % 140), 14 + i * 2, 0, 7); cx.fill(); } }
  if (F.scene.some(s => s.k === 'funk')) { cx.fillStyle = 'rgba(0,0,0,.55)'; cx.fillRect(W / 2 - 80, 8, 160, 22); cx.fillStyle = '#fff'; cx.font = '600 12px system-ui,sans-serif'; cx.textAlign = 'center'; cx.fillText('📻 Verkehrszentrale …', W / 2, 23); cx.textAlign = 'left'; }
  if (F.scene.some(s => s.k === 'nebel' && (s.horn || s.glocke))) { const s = F.scene.find(q => q.k === 'nebel' && (q.horn || q.glocke)); cx.fillStyle = 'rgba(0,0,0,.5)'; cx.font = '700 13px system-ui,sans-serif'; cx.fillText(s.glocke ? '🔔' : '📯', s.pan < 0 ? 12 : W - 28, hy); }
  if (fernOn) { const r = Math.min(W * .3, H * .42); if (!F.mask) F.mask = document.createElement('canvas'); const m = F.mask, mc = m.getContext('2d'); m.width = W; m.height = H; mc.fillStyle = 'rgba(0,0,0,.93)'; mc.fillRect(0, 0, W, H); mc.globalCompositeOperation = 'destination-out'; mc.beginPath(); mc.arc(W / 2 - r * .55, H * .45, r, 0, 7); mc.arc(W / 2 + r * .55, H * .45, r, 0, 7); mc.fill(); mc.globalCompositeOperation = 'source-over'; cx.drawImage(m, 0, 0, W, H); }
  if (F.peil && time - F.peil.t < 4) { cx.fillStyle = 'rgba(0,0,0,.6)'; cx.fillRect(8, 8, Math.min(W - 16, 250), 22); cx.fillStyle = '#ffe9a8'; cx.font = '600 12px system-ui,sans-serif'; cx.fillText('🧭 ' + F.peil.tx, 14, 23); }
}
function glow(x, y, r, col, R) { const cx = F.cx, g = cx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, col); g.addColorStop(.25, col + 'aa'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, R, 0, 7); cx.fill(); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x, y, Math.max(1, r * .5), 0, 7); cx.fill(); }
function drawBuoy(o, x, y, s) {
  const cx = F.cx, col = {bb: '#d23a2c', stb: '#2f8f4a', mitte: '#d23a2c', nord: '#1b1b1b', west: '#e8c22c', einzel: '#1b1b1b'}[o.typ] || '#888';
  cx.fillStyle = col;
  if (o.typ === 'stb') { cx.beginPath(); cx.moveTo(x - s, y); cx.lineTo(x, y - s * 2.2); cx.lineTo(x + s, y); cx.fill(); }
  else { cx.fillRect(x - s * .8, y - s * 2, s * 1.6, s * 2); }
  if (o.typ === 'mitte') { cx.fillStyle = '#fff'; cx.fillRect(x - s * .25, y - s * 2, s * .5, s * 2); }
  if (o.typ === 'nord') { cx.fillStyle = '#e8c22c'; cx.fillRect(x - s * .8, y - s, s * 1.6, s); }
  if (o.typ === 'west') { cx.fillStyle = '#1b1b1b'; cx.fillRect(x - s * .8, y - s * 1.35, s * 1.6, s * .7); }
  if (o.typ === 'einzel') { cx.fillStyle = '#d23a2c'; cx.fillRect(x - s * .8, y - s * 1.3, s * 1.6, s * .6); }
  /* Toppzeichen erst aus der Nähe */
  if (s > 3) {
    const ty = y - s * 2.2; cx.fillStyle = o.typ === 'bb' || o.typ === 'mitte' ? '#d23a2c' : o.typ === 'stb' ? '#2f8f4a' : '#111';
    const cone = (yy, up) => { cx.beginPath(); if (up) { cx.moveTo(x - s * .5, yy); cx.lineTo(x, yy - s * .7); cx.lineTo(x + s * .5, yy); } else { cx.moveTo(x - s * .5, yy - s * .7); cx.lineTo(x, yy); cx.lineTo(x + s * .5, yy - s * .7); } cx.fill(); };
    if (o.typ === 'bb') cx.fillRect(x - s * .35, ty - s * .8, s * .7, s * .7);
    else if (o.typ === 'stb') cone(ty - s * .1, true);
    else if (o.typ === 'mitte') { cx.beginPath(); cx.arc(x, ty - s * .4, s * .35, 0, 7); cx.fill(); }
    else if (o.typ === 'nord') { cone(ty - s * .8, true); cone(ty - s * .05, true); }
    else if (o.typ === 'west') { cone(ty - s * .8, false); cone(ty - s * .05, true); }
    else if (o.typ === 'einzel') { cx.beginPath(); cx.arc(x, ty - s * .3, s * .28, 0, 7); cx.arc(x, ty - s * .95, s * .28, 0, 7); cx.fill(); }
  }
}
function drawShip(sc, x, y, s, nacht, time) {
  const cx = F.cx, fz = D.fahrzeuge.find(f => f.id === sc.fz) || {id: sc.fz}, big = ['motor50', 'mb', 'tief'].includes(fz.id), len = big ? 4.2 : 2.6;
  const segel = fz.id === 'segel' || fz.id === 'motorsegler';
  if (!nacht) {
    cx.fillStyle = big ? '#2f3a45' : '#e9e4d8'; cx.beginPath(); cx.moveTo(x - s * len, y - s * .9); cx.lineTo(x + s * len, y - s * .9); cx.lineTo(x + s * len * .85, y); cx.lineTo(x - s * len * .85, y); cx.fill();
    cx.fillStyle = big ? '#e9e4d8' : '#b9b2a2'; cx.fillRect(x - s * (big ? 2.6 : .9), y - s * 1.8, s * (big ? 1.4 : 1.6), s * .9);
    if (segel) { cx.fillStyle = '#fbf6ea'; cx.beginPath(); cx.moveTo(x, y - s * 6); cx.lineTo(x, y - s * 1); cx.lineTo(x + s * 2.2, y - s * 1); cx.fill(); cx.beginPath(); cx.moveTo(x - s * .2, y - s * 5.2); cx.lineTo(x - s * .2, y - s * 1); cx.lineTo(x - s * 1.8, y - s * 1); cx.fill(); }
    cx.strokeStyle = '#333'; cx.lineWidth = Math.max(1, s * .15); cx.beginPath(); cx.moveTo(x, y - s * .9); cx.lineTo(x, y - s * 5.5); cx.stroke();
    /* Signalkörper */
    let yy = y - s * 4.6; const r = s * .45; cx.fillStyle = '#111';
    (fz.tag || []).forEach(t => {
      if (t === 'ball') { cx.beginPath(); cx.arc(x, yy, r, 0, 7); cx.fill(); yy += r * 2.4; }
      if (t === 'rhombus') { cx.beginPath(); cx.moveTo(x, yy - r * 1.2); cx.lineTo(x + r, yy); cx.lineTo(x, yy + r * 1.2); cx.lineTo(x - r, yy); cx.fill(); yy += r * 2.6; }
      if (t === 'zylinder') { cx.fillRect(x - r * .8, yy - r * 1.2, r * 1.6, r * 2.4); yy += r * 3; }
      if (t === 'kegel2') { cx.beginPath(); cx.moveTo(x - r, yy - r); cx.lineTo(x + r, yy - r); cx.lineTo(x, yy + r * .2); cx.fill(); cx.beginPath(); cx.moveTo(x, yy + r * .4); cx.lineTo(x - r, yy + r * 1.6); cx.lineTo(x + r, yy + r * 1.6); cx.fill(); yy += r * 3.2; }
      if (t === 'kegelunten') { cx.beginPath(); cx.moveTo(x - r, yy - r); cx.lineTo(x + r, yy - r); cx.lineTo(x, yy + r * .6); cx.fill(); yy += r * 2.4; }
    });
    if (sc.blau && Math.floor(time * 4) % 2) glow(x, y - s * 2.2, 3, '#4aa3ff', 12);
    return;
  }
  /* Nacht: nur Lichter */
  const N = fz.nacht || {topp: 1}, Lr = Math.max(1.5, s * .28), R0 = Math.max(6, s * 1.6);
  for (let i = 0; i < (N.topp || 0); i++) glow(x + (i ? s * .8 : -s * .6), y - s * (4 + i * 1.2), Lr, '#fffbe0', R0);
  (N.rund || []).forEach((c, i) => glow(x, y - s * (2.4 + i * .8), Lr, {r: '#ff4a3a', g: '#4dff6a', w: '#fffbe0'}[c], R0));
  if (!N.keineSeiten && sc.aspect !== 'heck') { if (sc.aspect === 'rot' || sc.aspect === 'beide') glow(x - (sc.aspect === 'beide' ? s * .5 : 0), y - s * 1.2, Lr, '#ff4a3a', R0); if (sc.aspect === 'gruen' || sc.aspect === 'beide') glow(x + (sc.aspect === 'beide' ? s * .5 : 0), y - s * 1.2, Lr, '#4dff6a', R0); }
  if (sc.aspect === 'heck' && !N.keineSeiten) glow(x, y - s * .9, Lr, '#fffbe0', R0);
  if (sc.blau && Math.floor(time * 4) % 2) glow(x, y - s * 3, 3, '#4aa3ff', 14);
}
function drawBoat(W, H, hy, time, nacht) {
  const cx = F.cx, L = F.L, segel = L.antrieb === 'segel' && L.wx !== 'flaute', tip = {x: W / 2, y: hy + (H * .8 - hy) * .55};
  const deck = nacht ? '#3a2c1f' : '#c9a875', rail = nacht ? '#1d140c' : '#7a5a3a';
  /* Wanten links und rechts: feste Peilmarke */
  cx.strokeStyle = nacht ? '#2b3440' : '#596470'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(W * .1, H); cx.lineTo(W * .3, -10); cx.moveTo(W * .9, H); cx.lineTo(W * .7, -10); cx.stroke();
  /* Vorstag */
  cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(tip.x, tip.y); cx.lineTo(W * .52, -10); cx.stroke();
  /* Vorsegel */
  const side = (((L.w && L.w.von) || 225) - F.heading + 540) % 360 - 180 > 0 ? -1 : 1;
  if (segel) { const al = F.card ? .45 : .9; cx.fillStyle = nacht ? 'rgba(59,66,80,' + al + ')' : 'rgba(245,238,221,' + al + ')'; cx.beginPath(); cx.moveTo(tip.x + 2, tip.y - 4); cx.lineTo(W * .515, -10); cx.quadraticCurveTo(W / 2 + side * W * .22, H * .08, W / 2 + side * W * .42, H * .3); cx.closePath(); cx.fill(); cx.strokeStyle = 'rgba(0,0,0,.15)'; cx.stroke(); }
  else if (L.wx === 'flaute' && L.antrieb === 'segel') { cx.fillStyle = nacht ? '#3b4250' : '#f5eedd'; cx.beginPath(); cx.moveTo(tip.x + 2, tip.y - 4); cx.lineTo(W * .515, 0); cx.quadraticCurveTo(W / 2 + 18 * Math.sin(time * 3), H * .4, W / 2 + 30, H * .7); cx.closePath(); cx.fill(); }
  else { cx.strokeStyle = nacht ? '#3b4250' : '#e9dfc8'; cx.lineWidth = 7; cx.beginPath(); cx.moveTo(tip.x, tip.y - 6); cx.lineTo(W * .515, 10); cx.stroke(); }
  /* Deck und Bug */
  cx.fillStyle = deck; cx.beginPath(); cx.moveTo(tip.x, tip.y); cx.lineTo(W * 1.05, H); cx.lineTo(-W * .05, H); cx.closePath(); cx.fill();
  cx.strokeStyle = rail; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(tip.x, tip.y); cx.lineTo(-W * .05, H); cx.moveTo(tip.x, tip.y); cx.lineTo(W * 1.05, H); cx.stroke();
  cx.strokeStyle = 'rgba(0,0,0,.12)'; cx.lineWidth = 1; for (let i = -3; i <= 3; i++) { cx.beginPath(); cx.moveTo(tip.x, tip.y); cx.lineTo(W / 2 + i * W * .17, H); cx.stroke(); }
  /* Bugkorb */
  cx.strokeStyle = nacht ? '#556' : '#9aa3ab'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(tip.x - 16, tip.y + 10); cx.quadraticCurveTo(tip.x, tip.y - 14, tip.x + 16, tip.y + 10); cx.stroke();
  /* Seitenlichter am Bugkorb (nachts an) */
  if (nacht) { glow(tip.x - 14, tip.y + 6, 2, '#ff4a3a', 8); glow(tip.x + 14, tip.y + 6, 2, '#4dff6a', 8); }
  /* Steuerrad */
  const wx0 = W / 2, wy0 = H + 18, r = Math.min(70, W * .18), rud = Math.sin(time * .7) * 6 + (F.scene.some(s => s.weg && time - s.weg < 3) ? 25 : 0);
  cx.save(); cx.translate(wx0, wy0); cx.rotate(rud * RAD);
  cx.strokeStyle = '#4a3020'; cx.lineWidth = 7; cx.beginPath(); cx.arc(0, 0, r, 0, 7); cx.stroke();
  cx.lineWidth = 4; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(Math.cos(a) * (r + 10), Math.sin(a) * (r + 10)); cx.stroke(); }
  cx.fillStyle = '#c8962e'; cx.beginPath(); cx.arc(0, 0, 9, 0, 7); cx.fill(); cx.restore();
  /* Verklicker: Windrichtung relativ zum Bug */
  const wrel = ((((L.w && L.w.von) || 225) - F.heading) + 360) % 360;
  cx.save(); cx.translate(W - 26, 26); cx.fillStyle = 'rgba(0,0,0,.35)'; cx.beginPath(); cx.arc(0, 0, 17, 0, 7); cx.fill(); cx.rotate((wrel + 180) * RAD); cx.fillStyle = '#ffd25a'; cx.beginPath(); cx.moveTo(0, -13); cx.lineTo(5, 6); cx.lineTo(0, 2); cx.lineTo(-5, 6); cx.fill(); cx.restore();
}
/* ---------- SKS als Multiple Choice in der Lernrunde (5.14, T5) ----------
   10 Fragen, bevorzugt fällige und wackelige; nach jeder Antwort die volle amtliche Antwort. Zählt im SKS-Lernstand. */
TOERN.mcRunde = function () {
  const b = S.course === 'sks' ? S.qs : ((S.courses || {}).sks || {}).qs || {};
  const pool = SKS_DATA.filter(q => !q.sketch && SKSMC[q.id] && !SKSMC[q.id].offen);
  const w = q => { const s = b[q.id]; return !s ? 2 : s.b <= 1 ? 5 : s.d + Math.pow(2, s.b) <= today() ? 3 : s.b >= 4 ? .4 : 1; };
  const qs = []; const rest = pool.slice();
  while (qs.length < 10 && rest.length) { const q = weighted(Math.random, rest, w); qs.push(q); rest.splice(rest.indexOf(q), 1); }
  let i = 0, ok = 0;
  const zeig = () => {
    if (i >= qs.length) {
      gameShell('Ankreuz-Runde', `<div class="card"><h2 style="margin:0 0 6px">${ok} von ${qs.length} richtig</h2><p class="small muted" style="margin:0">Falsche Fragen kommen in deine Wiederholung. Die Prüfung bleibt mit freien Antworten, hier übst du das Wiedererkennen.</p></div><div class="row"><button class="btn lamp" id="mcneu">Noch eine Runde</button><button class="btn ghost" id="mczu">Zurück</button></div>`);
      $('#mcneu').onclick = () => TOERN.mcRunde(); $('#mczu').onclick = () => setTab('cabin'); $('#gback').onclick = () => setTab('cabin'); return;
    }
    const q = qs[i], m = SKSMC[q.id], opts = shuffle([m.r].concat(m.f));
    gameShell('Ankreuz-Runde', `<p class="small muted" style="margin:6px 0">Frage ${i + 1} von ${qs.length} · SKS ${esc(q.id)}</p><div class="card"><p style="margin:0 0 10px">${esc(q.q)}</p><div class="tw-opts">${opts.map((o, k) => `<button class="btn" data-k="${k}">${esc(o)}</button>`).join('')}</div><div id="mcfb"></div></div>`);
    $('#gback').onclick = () => setTab('cabin');
    app.querySelectorAll('[data-k]').forEach(btn => btn.onclick = () => {
      const r = opts[+btn.dataset.k] === m.r; if (r) ok++;
      app.querySelectorAll('[data-k]').forEach(x => { x.disabled = true; if (opts[+x.dataset.k] === m.r) x.classList.add('richtig'); else if (x === btn) x.classList.add('falsch'); });
      AUD.sfx(r ? 'richtig' : 'falsch', {vol: r ? .45 : .35});
      try { if (S.course === 'sks') record(q.id, r); else if (!r) markWrong({s: 'sks', n: q.id}); } catch (e) {}
      const card = karte('sks:' + q.id);
      $('#mcfb').innerHTML = `<div class="tw-fb">${r ? '<b class="nok">Richtig!</b>' : '<b class="nno">Nicht richtig.</b>'}<div class="amt small"><b>Amtliche Antwort:</b><br>${esc(cleanA(q.a)).replace(/\n/g, '<br>')}</div>${card && card.m ? `<p class="small">💡 ${esc(card.m)}</p>` : ''}<button class="btn lamp wide" id="mcweiter">Weiter</button></div>`;
      $('#mcweiter').onclick = () => { AUD.click(); i++; zeig(); };
    });
  };
  zeig();
};
TOERN.debug = () => F;
})(typeof window !== 'undefined' ? window : globalThis);
