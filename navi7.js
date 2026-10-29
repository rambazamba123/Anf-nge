/* ==========================================================================
   Skipper – Navigation auf der Seekarte 7 „Deutsche Gischt“ (H6, Nutzer 29.10.2026)
   Wird nachgeladen (nachladen('navi7.js')). Aufgaben stehen in data/navi7.json und werden von zwei Seiten gespielt:
   in der Reise (reise.js, Schritt {navi: {id}}) und unter „Frei üben“ (NAVI7.seite). Die Antworten rechnet die App aus den Kartendaten
   (data/karte7.json, erzeugt aus dem SVG), sie stehen nirgends von Hand.
   Der Zirkel zählt die Länge selbst ab (Anzeige am Gelenk), das Dreieck zeigt seinen Winkel.
   ========================================================================== */
(() => {
const N7 = window.NAVI7 = {};
let D = null;
const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',');
const n360 = a => ((a % 360) + 360) % 360;
const CSS = `.n7{display:flex;flex-direction:column;gap:8px;margin:0}.n7 .n7q{font-size:.95rem;line-height:1.35}.n7 .n7f{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.n7 .n7f label{display:flex;gap:4px;align-items:center;font-weight:700;font-size:.88rem}.n7 .n7f input{width:4.6em;padding:.4em .5em;border:2px solid var(--line,#c9b99a);border-radius:10px;font-size:1rem;background:#fff;color:#2a2019;text-align:center}
.n7 .n7r{display:flex;gap:8px;flex-wrap:wrap}.n7 .n7m{font-size:.88rem;min-height:1.2em}.n7 .n7m.ok{color:#1e7f4f;font-weight:700}.n7 .n7m.no{color:#c2473b;font-weight:700}
.n7stage{position:relative;height:46vh;min-height:300px;border-radius:14px;overflow:hidden;border:2px solid var(--line,#c9b99a);background:#f7f5ef}.n7stage .nwrap{height:100%}
.n7liste .card{margin:6px 0}.n7liste .row{gap:6px;flex-wrap:wrap}.n7chip{display:inline-block;font-size:.72rem;padding:.1em .5em;border-radius:999px;background:#e8dfc9;margin-left:6px}`;
const css = () => { if (document.getElementById('n7css')) return; const s = document.createElement('style'); s.id = 'n7css'; s.textContent = CSS; document.head.appendChild(s); };
N7.laden = async () => {
  css(); if (typeof loadNavi === 'function') await loadNavi();
  if (!D) D = await fetch('data/navi7.json?v=' + window.__ver).then(r => { if (!r.ok) throw new Error('navi7.json'); return r.json(); });
  await NAV.revier('gischt'); return D;
};
N7.bank = () => D;
const st7 = () => { S.navi7 = S.navi7 || {}; S.navi7.ok = S.navi7.ok || {}; S.navi7.n = S.navi7.n || {}; return S.navi7; };
const merke = (id, ok) => { const s = st7(); s.n[id] = (s.n[id] || 0) + 1; if (ok) s.ok[id] = (s.ok[id] || 0) + 1; save(); };

/* ---------- Aufgabe auflösen: Objekte holen und die richtige Antwort aus den Kartendaten rechnen ---------- */
function lösen(def) {
  const K = NAV.data().K, ob = id => { const o = K.objekte.find(x => x.id === id); if (!o) throw new Error('Objekt fehlt: ' + id); return o; };
  const A = def.von ? ob(def.von) : def.obj ? ob(def.obj) : null, B = def.bis ? ob(def.bis) : null, r = {A, B};
  if (def.typ === 'tippe') r.ziele = (def.ziele || [def.ziel]).map(ob);
  if (A && B) r.kd = NAV.kursDist(A, B);
  if (def.typ === 'position' || def.typ === 'kreuz') r.pos = {lat: A.lat, lon: A.lon};
  if (def.typ === 'distanz') { r.sol = r.kd.d; r.tol = Math.max(.3, r.kd.d * .03); r.einh = 'sm'; }
  if (def.typ === 'kurs') { r.sol = Math.round(r.kd.k); r.tol = 3; r.einh = '°'; }
  if (def.typ === 'zeit') { r.sol = r.kd.d / def.kn * 60; r.tol = Math.max(1, r.sol * .03); r.einh = 'min'; }
  if (def.typ === 'fahrt') { r.sol = def.sm / def.min * 60; r.tol = .3; r.einh = 'kn'; }
  if (def.typ === 'strecke') { r.sol = def.kn * def.min / 60; r.tol = .2; r.einh = 'sm'; }
  if (def.typ === 'koppel') { const p = NAV.versegeln({lat: A.lat, lon: A.lon}, def.kurs, def.kn * def.min / 60); r.pos = p; r.tol = .6; }
  if (def.typ === 'mw') { const jahre = def.jahr - 2012; r.sol = 1 + jahre * 9 / 60; r.tol = .15; r.einh = '°'; }
  if (def.typ === 'kreuzpeilung') {
    const mitte = ids => { const a = ob(ids[0]), b = ob(ids[1]); return {lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2}; };
    r.schiff = def.schiff.mitte ? mitte(def.schiff.mitte) : def.schiff; r.Z = def.ziele.map(ob);
    r.p = r.Z.map(z => Math.round(NAV.kursDist(r.schiff, z).k)); r.pos = NAV.kreuzpeilung(r.Z[0], r.p[0], r.Z[1], r.p[1]); r.tol = .5; r.A = r.Z[0]; r.B = r.Z[1];
  }
  if (def.typ === 'strom') { const i = K.strom.std.indexOf(def.std); r.rw = K.strom.rw[i]; r.kn = K.strom[def.tide === 'npt' ? 'np' : 'sp'][i]; }
  if (def.typ === 'koppelstrom') { const p1 = NAV.versegeln({lat: A.lat, lon: A.lon}, def.kurs, def.kn * def.min / 60); r.pos = NAV.versegeln(p1, def.strom.rw, def.strom.kn * def.min / 60); r.tol = .7; }
  if (def.typ === 'tiefe') { r.sol = def.kartentiefe + def.hoehe; r.tol = .11; r.einh = 'm'; }
  if (def.typ === 'uhrzeit') { const [h, m] = def.uhr.split(':').map(Number); r.sol = h * 60 + m; r.tol = 6; }
  if (def.typ === 'umrechnen') { r.sol = def.richtung === 'rw2mw' ? n360(def.wert - def.mw) : n360(def.wert + def.mw); r.tol = 1; r.einh = '°'; }
  return r;
}
const text = (t, def, r) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => {
  const v = {d: r.kd && fmt(r.kd.d), k: r.kd && String(Math.round(r.kd.k)).padStart(3, '0'), a: def.von || def.obj, b: def.bis, sol: r.sol != null && (def.typ === 'kurs' ? String(r.sol).padStart(3, '0') : fmt(r.sol, def.typ === 'zeit' ? 0 : 1)), pos: r.pos && NAV.fmtPos(r.pos), kn: def.kn, min: def.min, p1: r.p && String(r.p[0]).padStart(3, '0'), p2: r.p && String(r.p[1]).padStart(3, '0'), rw: r.rw != null ? String(r.rw).padStart(3, '0') : def.strom && String(def.strom.rw).padStart(3, '0'), sk: r.kn != null ? fmt(r.kn) : def.strom && fmt(def.strom.kn), std: def.std, hoehe: def.hoehe != null && fmt(def.hoehe), kt: def.kartentiefe != null && fmt(def.kartentiefe), uhr: def.uhr, z1: r.Z && r.Z[0].id, z2: r.Z && r.Z[1].id, sm: def.sm, kurs: def.kurs, wert: def.wert, mw: def.mw, jahr: def.jahr, name: r.A && r.A.id, bed: r.A && r.A.bed, kenn: r.A && r.A.kenn, farbe: r.A && r.A.farbe, topp: r.A && r.A.topp}[k];
  return v == null ? m : v;
});
const posTeile = p => { const la = NAV.fmtLat(p.lat).match(/(\d+)°\s*([\d,]+)/), lo = NAV.fmtLon(p.lon).match(/(\d+)°\s*([\d,]+)/); return {lg: la[1], lm: NAV.num(la[2]), og: lo[1], om: NAV.num(lo[2])}; };

/* ---------- Eine Aufgabe spielen ----------
   o.host   Element für die Karte, o.antwort Element für Frage und Eingabe, o.sag(wer, text) gesprochen (Promise), o.auto = die Crew löst laut vor
   Ergebnis: Promise → {ok, versuche, hilfe} */
N7.aufgabe = async function (def, o) {
  await N7.laden(); const r = lösen(def), K = NAV.data().K;
  const sag = o.sag || ((w, t) => Promise.resolve(VOX.say(w, t, 'local'))), antwort = o.antwort;
  const TOOLS = {strom: ['hand'], tiefe: ['hand'], uhrzeit: ['hand'], tippe: ['hand'], position: ['hand'], kreuz: ['hand', 'punkt'], koppel: ['hand', 'dreieck', 'zirkel', 'punkt'], kreuzpeilung: ['hand', 'dreieck', 'stift', 'punkt'], koppelstrom: ['hand', 'dreieck', 'zirkel', 'punkt'], distanz: ['hand', 'zirkel'], zeit: ['hand', 'zirkel'], kurs: ['hand', 'dreieck']}[def.typ] || ['hand'];
  const objs = [r.A, r.B].filter(Boolean), mid = objs.length ? {lat: objs.reduce((s, x) => s + x.lat, 0) / objs.length, lon: objs.reduce((s, x) => s + x.lon, 0) / objs.length} : {lat: 0, lon: 80};
  const span = objs.length > 1 ? Math.max(Math.abs(objs[0].x - objs[1].x), Math.abs(objs[0].y - objs[1].y) * 1.1) : 0;
  const xyc = def.xy ? NAV.unproj(def.xy[0], def.xy[1]) : null;
  const breite = def.breite || Math.max(300, Math.min(900, span * 1.7 || 380));
  let tippFn = null; o.host.innerHTML = ''; const ctl = NAV.mountChart(o.host, {onTap: t => tippFn && tippFn(t), center: xyc || def.center || (def.typ === 'koppel' || def.typ === 'koppelstrom' ? r.A : def.typ === 'kreuzpeilung' ? r.schiff : mid), width: def.xy ? (def.breite || 360) : def.typ === 'kreuzpeilung' ? (def.breite || 560) : breite, tools: TOOLS, tool: ['kreuz', 'koppel', 'koppelstrom'].includes(def.typ) ? 'punkt' : 'hand', hilfen: !o.pruefung});
  const q = text(def.text, def, r); let hilfeN = 0, versuche = 0, fertig = false;
  const felder = { position: () => { const t = posTeile(r.pos); return `<label>Breite ${t.lg}° <input id="n7a" inputmode="decimal" autocomplete="off" aria-label="Breite in Minuten">′ N</label><label>Länge ${t.og}° <input id="n7b" inputmode="decimal" autocomplete="off" aria-label="Länge in Minuten">′ E</label>`; },
    distanz: () => `<label><input id="n7a" inputmode="decimal" autocomplete="off" aria-label="Distanz"> sm</label>`, kurs: () => `<label>rwK <input id="n7a" inputmode="numeric" autocomplete="off" aria-label="Kurs in Grad">°</label>`,
    zeit: () => `<label><input id="n7a" inputmode="numeric" autocomplete="off" aria-label="Minuten"> min</label>`, fahrt: () => `<label><input id="n7a" inputmode="decimal" autocomplete="off" aria-label="Knoten"> kn</label>`,
    strecke: () => `<label><input id="n7a" inputmode="decimal" autocomplete="off" aria-label="Seemeilen"> sm</label>`, mw: () => `<label>Mw <input id="n7a" inputmode="decimal" autocomplete="off" aria-label="Missweisung in Grad">° E</label>`,
    strom: () => `<label>rw <input id="n7a" inputmode="numeric" autocomplete="off" aria-label="Stromrichtung in Grad">°</label><label><input id="n7b" inputmode="decimal" autocomplete="off" aria-label="Stromgeschwindigkeit in Knoten"> kn</label>`,
    uhrzeit: () => `<label><input id="n7a" inputmode="numeric" autocomplete="off" aria-label="Stunde"> :</label><label><input id="n7b" inputmode="numeric" autocomplete="off" aria-label="Minute"> Uhr</label>`,
    tiefe: () => `<label><input id="n7a" inputmode="decimal" autocomplete="off" aria-label="Wassertiefe in Metern"> m</label>`,
    umrechnen: () => `<label><input id="n7a" inputmode="numeric" autocomplete="off" aria-label="Ergebnis in Grad"> °</label>` }[def.typ];
  const Hilfe = hilfen(def, r);
  antwort.innerHTML = `<div class="n7"><div class="n7q">${q}</div>${felder ? `<div class="n7f">${felder()}</div>` : ''}<div class="n7r">${felder || def.typ === 'kreuz' || def.typ === 'koppel' ? '<button class="btn small" id="n7pruef">Prüfen</button>' : ''}<button class="btn small ghost" id="n7hilfe">💡 Hilfe</button><button class="btn small ghost" id="n7weiter">Weiter ohne</button></div><div class="n7m" id="n7m" aria-live="polite"></div></div>`;
  const msg = (t, c) => { const m = antwort.querySelector('#n7m'); if (m) { m.textContent = t; m.className = 'n7m ' + (c || ''); } };
  const lösung = () => {
    if (r.A) ctl.highlight(objs.map(x => x.id));
    if (def.typ === 'distanz' || def.typ === 'kurs' || def.typ === 'zeit') ctl.addLine({x: r.A.x, y: r.A.y}, {x: r.B.x, y: r.B.y}, 'soll');
    if (def.typ === 'distanz') { const z = {a: {x: r.A.x, y: r.A.y}, b: {x: r.B.x, y: r.B.y}, done: true}; ctl.uebernehmen({...ctl.zustand(), zirkel: z}); }
    if (['kreuz', 'koppel', 'kreuzpeilung', 'koppelstrom'].includes(def.typ)) { const p = NAV.proj(r.pos.lat, r.pos.lon); ctl.addMark(p, '✓', 'soll'); }
    if (def.typ === 'kreuzpeilung') r.Z.forEach((z, i) => { const sch = NAV.proj(r.pos.lat, r.pos.lon), zz = NAV.proj(z.lat, z.lon); ctl.addLine({x: zz.x, y: zz.y}, {x: sch.x, y: sch.y}, 'soll'); });
    if (def.typ === 'tippe') ctl.highlight(def.ziele || [def.ziel]);
  };
  return new Promise(res => {
    const ende = async (ok, wort) => { if (fertig) return; fertig = true; merke(def.id, ok); lösung(); antwort.querySelectorAll('button,input').forEach(b => b.disabled = true); msg(ok ? '✓ ' + wort : wort, ok ? 'ok' : 'no'); if (!(o.auto && def.auto)) await sag('smilla', text(ok ? def.richtig : def.falsch || def.richtig, def, r)); res({ok, versuche, hilfe: hilfeN}); };
    const pruefe = () => {
      if (fertig) return; versuche++;
      let ok = false, nah = false;
      if (['kreuz', 'koppel', 'kreuzpeilung', 'koppelstrom'].includes(def.typ)) {
        const ms = ctl.zustand().marks.filter(m => m.c !== 'soll'), m = ms[ms.length - 1]; if (!m) { msg('Setze erst ein Kreuz mit dem ✕-Werkzeug auf die Karte.', 'no'); versuche--; return; }
        const ll = NAV.unproj(m.x, m.y), d = NAV.kursDist(ll, r.pos).d; ok = d <= (def.typ === 'kreuz' ? .4 : r.tol); nah = d <= (ok ? 0 : (def.typ === 'kreuz' ? 1 : 1.6));
      } else if (def.typ === 'strom' || def.typ === 'uhrzeit') {
        const a = NAV.num(antwort.querySelector('#n7a').value), b = NAV.num(antwort.querySelector('#n7b').value);
        if (isNaN(a) || isNaN(b)) { msg('Trag beide Zahlen ein.', 'no'); versuche--; return; }
        if (def.typ === 'strom') { ok = NAV.angDiff(a, r.rw) <= 5 && Math.abs(b - r.kn) <= .16; nah = NAV.angDiff(a, r.rw) <= 15 && Math.abs(b - r.kn) <= .5; }
        else { const dif = Math.abs(a * 60 + b - r.sol); ok = dif <= r.tol; nah = dif <= 30; }
      } else if (def.typ === 'position') {
        const t = posTeile(r.pos), a = NAV.num(antwort.querySelector('#n7a').value), b = NAV.num(antwort.querySelector('#n7b').value);
        if (isNaN(a) || isNaN(b)) { msg('Trag beide Zahlen ein (Minuten mit Komma, zum Beispiel 55,2).', 'no'); versuche--; return; }
        const da = Math.abs(a - t.lm), db = Math.abs(b - t.om); ok = da <= .31 && db <= .31; nah = da <= 1 && db <= 1;
      } else {
        const a = NAV.num(antwort.querySelector('#n7a').value); if (isNaN(a)) { msg('Trag eine Zahl ein.', 'no'); versuche--; return; }
        const dif = def.typ === 'kurs' || def.typ === 'umrechnen' ? NAV.angDiff(a, r.sol) : Math.abs(a - r.sol); ok = dif <= r.tol; nah = dif <= r.tol * 3;
      }
      if (ok) return ende(true, 'Richtig.');
      if (versuche >= 3) return ende(false, 'Das war es nicht. Hier ist die Lösung.');
      msg(nah ? 'Fast. Noch einmal genauer.' : 'Noch nicht. Tipp: Drück auf „💡 Hilfe“.', 'no'); AUD.sfx('falsch', {vol: .3});
    };
    antwort.querySelector('#n7pruef') && (antwort.querySelector('#n7pruef').onclick = pruefe);
    antwort.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); pruefe(); } }));
    antwort.querySelector('#n7hilfe').onclick = () => { const h = Hilfe[Math.min(hilfeN, Hilfe.length - 1)]; hilfeN++; msg('💡 ' + h); sag('smilla', h); if (hilfeN >= Hilfe.length && r.A) ctl.highlight(objs.map(x => x.id)); };
    antwort.querySelector('#n7weiter').onclick = () => ende(false, 'Weiter. Hier ist die Lösung.');
    /* Tippen auf die Karte (Aufgabentyp „tippe“) */
    if (def.typ === 'tippe') {
      const tipp = t => { if (fertig) return; const o2 = t.obj; versuche++; const ok = o2 && (r.ziele || []).some(z => z.id === o2.id); if (ok) ende(true, 'Richtig.'); else if (versuche >= 3) ende(false, 'Das war es nicht. Hier ist die Lösung.'); else { msg(o2 ? `Das ist „${o2.id}“. Such weiter.` : 'Da ist nichts. Such weiter.', 'no'); AUD.sfx('falsch', {vol: .3}); } };
      tippFn = tipp;
    }
    /* Hörmodus: die Crew löst laut vor */
    if (o.auto) { (async () => { await sag('smilla', text(def.auto || def.text, def, r)); await ende(true, 'Gelöst.'); })(); }
  });
  function hilfen(def, r) {
    const H = def.hilfe && def.hilfe.length ? def.hilfe.map(h => text(h, def, r)) : [];
    const G = {
      tippe: [text('Achte auf Form und Farbe: {bed}', def, r), 'Suche in der Nähe des Namens am Rand der Karte. Mit zwei Fingern kannst du zoomen.'],
      position: ['Die Breite liest du an der Skala links oder rechts ab, auf gleicher Höhe wie der Punkt. Die Länge liest du oben oder unten ab.', 'Eine Minute Breite sind große Striche. Die kleinen Striche sind Zehntelminuten.'],
      kreuz: ['Die Breite liegt auf der Randskala links oder rechts, die Länge auf der Skala oben oder unten. Die Linien kreuzen sich an der gesuchten Stelle.'],
      distanz: ['Wähle den Zirkel ⋀, tippe die beiden Punkte an. Die Länge steht direkt am Zirkel.', 'Am Breitenrand gilt: 1′ Breite = 1 sm. Die Zahl am Zirkel zählt das für dich ab.'],
      kurs: ['Wähle das Dreieck ◺ und lege eine Kante an die Linie zwischen den Punkten. Am Gradbogen liest du dort ab, wo die rote Meridianlinie ihn schneidet.', 'Der Kurs gilt von {a} nach {b}, also in diese Richtung.'],
      zeit: ['Zeit = Strecke ÷ Geschwindigkeit × 60. Die Strecke misst du mit dem Zirkel.'], fahrt: ['Geschwindigkeit = Strecke ÷ Zeit × 60.'], strecke: ['Strecke = Geschwindigkeit × Zeit ÷ 60.'],
      koppel: ['Erst Kurs und Strecke bestimmen: Strecke = Geschwindigkeit × Zeit ÷ 60. Dann die Linie vom Ausgangspunkt auf dem Kurs ziehen und die Strecke mit dem Zirkel abtragen.'],
      kreuzpeilung: ['Die Peilung geht vom Schiff zum Objekt. Zeichne die Linie deshalb vom Objekt aus in die Gegenrichtung: Peilung plus oder minus 180 Grad.', 'Lege das Dreieck an das Objekt, stelle die Gegenpeilung ein, zeichne die Linie mit dem Stift. Das Gleiche am zweiten Objekt. Wo sich die Linien kreuzen, ist das Schiff.'],
      strom: ['Die Tabelle steht am rechten Rand der Karte. Such die Zeile mit der Stunde und lies Richtung und Geschwindigkeit bei Springzeit oder Nipptide ab.'],
      koppelstrom: ['Erst Kurs und Fahrt nach Koppelort: Strecke = Geschwindigkeit × Zeit ÷ 60. Dann vom Koppelort aus den Strom abtragen: Richtung rw, Strecke = Stromgeschwindigkeit × Zeit.', 'Das Ende des Stromstrichs ist der Besteckort.'],
      tiefe: ['Wassertiefe = Kartentiefe + Höhe des Wasserstands über Kartennull. Die Höhen stehen in der Gezeitentabelle am unteren Rand.'],
      uhrzeit: ['Die Gezeitentabelle steht unten rechts in der Karte. HW heißt Hochwasser, NW Niedrigwasser.'],
      mw: ['Missweisung der Karte plus jährliche Änderung mal die Jahre seit der Karte.'], umrechnen: ['rwK = mwK + Mw. mwK = rwK − Mw. Östliche Werte sind plus.']
    }[def.typ] || [];
    return [...H, ...G, 'Lösung: ' + text(def.loesung || '{sol}', def, r)].filter(Boolean);
  }
};

/* ---------- Seite „Frei üben“: Aufgaben nach Stufen ---------- */
N7.seite = async function () {
  await N7.laden(); const s = st7();
  const stufen = Object.entries(D.stufen).filter(([k]) => k !== 'ueben');
  gameShell('Navigation auf der Seekarte', `<div class="n7liste"><p class="small muted" style="margin:0 0 8px">${esc(D.intro)}</p>${stufen.map(([k, v]) => {
    const as = D.aufgaben.filter(a => a.stufe === k), ok = as.filter(a => s.ok[a.id]).length;
    return `<div class="card"><b>${esc(k)} · ${esc(v.titel)}</b><span class="n7chip">${ok}/${as.length}</span><p class="small" style="margin:4px 0">${esc(v.text)}</p><div class="row"><button class="btn small" data-st="${k}">Nächste Aufgabe</button><button class="btn small ghost" data-zu="${k}">Zufällig</button></div></div>`;
  }).join('')}</div>`);
  $('#gback').onclick = () => { NAV.revier('kliev'); setTab('frei'); };
  document.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { const k = b.dataset.st, as = D.aufgaben.filter(a => a.stufe === k); N7.spiele(as.find(a => !s.ok[a.id]) || as[0], k); });
  document.querySelectorAll('[data-zu]').forEach(b => b.onclick = () => { const k = b.dataset.zu; N7.spiele(N7.zufall(k), k); });
};
N7.zufall = function (stufe) {
  const as = D.aufgaben.filter(a => a.stufe === stufe), K = NAV.data().K, el = K.objekte.filter(o => /^Elbe \d+$/.test(o.id)), pick = a => a[Math.random() * a.length | 0];
  const base = pick(as); if (!['distanz', 'kurs', 'zeit', 'koppel', 'position', 'kreuz'].includes(base.typ)) return base;
  const a = pick(el); let b; for (let i = 0; i < 80; i++) { b = pick(el); const d = NAV.kursDist(a, b).d; if (b !== a && d >= 2 && d <= 9) break; }
  const d = {...base, id: base.id + '~' + a.id + '-' + b.id, zufall: true}; if (base.von) { d.von = a.id; d.bis = b.id; } else d.obj = a.id; return d;
};
N7.spiele = async function (def, stufe) {
  gameShell('Navigation · ' + stufe, `<div class="n7stage" id="n7chart"></div><div id="n7akt" style="margin-top:8px"></div><div class="row" style="margin-top:8px"><button class="btn small ghost" id="n7weitere">Nächste Aufgabe</button></div>`);
  $('#gback').onclick = () => N7.seite();
  $('#n7weitere').onclick = () => { const as = D.aufgaben.filter(a => a.stufe === stufe), s = st7(); N7.spiele(Math.random() < .5 ? N7.zufall(stufe) : (as.find(a => !s.ok[a.id] && a.id !== def.id) || N7.zufall(stufe)), stufe); };
  await N7.aufgabe(def, {host: $('#n7chart'), antwort: $('#n7akt')});
};
})();
