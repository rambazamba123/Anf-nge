/* lern.js: Ausbildungsheft (v5.22, Strategie-Gutachten §3.2, Nutzer 04.11.2026 „setze alle Vorschläge so um“).
   Kompetenzen aus data/kompetenzen.json, je drei Dimensionen getrennt:
   A Wissen = amtliche Fragen der Kompetenz (Farben aus dem bestehenden Lernstand, nichts doppelt gespeichert)
   B Verständnis = Situationsfragen, Bauchregeln, Entscheidungen in den Folgen (melde(k, 'b', ok))
   C Können = gemessene Aufgaben in 3D (melde(k, 'c', ok, {lage, hilfe})) und echt mit dem Übungsset (melde(k, 'e', ok))
   Stufen: neu → gehört → geübt → freigegeben → sicher, dazu eingerostet (lange nichts gezeigt). Kriterien je Art in KRIT.
   Spielstand S.lern {v, k: {id: {b, c, e: [[Tag, ok, lage, hilfe]], f: Tag der Freigabe, s: Tag „sicher“, h: gehört}}, offen: [{k, folge, d}]}
   (R7: Standard beim ersten Aufruf; alte Freigaben aus S.freigaben werden übernommen).
   Schnittstelle: LERN.laden() · melde(k, dim, ok, info) · stufe(k) · darf(k) · gehoert(k) · offen(k, folge) · seite() · text(k) · name(k) */
window.LERN = (() => {
  let D = null; const KM = {};
  const laden = () => D ? Promise.resolve(D) : fetch('data/kompetenzen.json?v=' + window.__ver).then(r => r.json()).then(j => { D = j; j.kompetenzen.forEach(k => { KM[k.id] = k; }); return D; });
  /* alte Freigaben (v5.18–v5.21) → Kompetenzen */
  const ALT = {fender: 'K-HAF-01', vorleine: 'K-HAF-02', klampe: 'K-KNO-08', motor: 'K-MOT-01', ablegen: 'K-MAN-02', steuern: 'K-SEE-01', fremdhafen: 'K-MAN-01', webe: 'K-KNO-06'};
  const tag = () => today();
  function ein(id) { const m = S.lern.k, e = m[id] = m[id] || {}; e.b = e.b || []; e.c = e.c || []; e.e = e.e || []; return e; }
  function mem() {
    if (!S.lern || typeof S.lern !== 'object') {
      S.lern = {v: 1, k: {}, offen: []};
      for (const a in ALT) { const x = S.freigaben && S.freigaben[a]; if (!x || !x.n) continue; const d = x.d ? dayNum(new Date(x.d)) : tag(), e = ein(ALT[a]);
        for (let i = 0; i < Math.min(2, x.n); i++) e.c.push([d - (x.n > 1 && !i ? 1 : 0), 1, 'alt', 0]); if (x.frei) e.f = d; }
    }
    const m = S.lern; m.k = m.k || {}; m.offen = Array.isArray(m.offen) ? m.offen : []; return m;
  }
  /* A Wissen: Farben der amtlichen Fragen (Lernstand SBF See; die Basisfragen teilt der Binnen-Schein mit) */
  function qsSbf() { return S.course === 'sbf' ? S.qs || {} : (typeof courseBucket === 'function' ? courseBucket('sbf').qs : null) || {}; }
  function wissen(id) { const k = KM[id], qs = qsSbf(), n = k && k.fragen ? k.fragen.length : 0; let gesehen = 0, sitzt = 0, fest = 0;
    if (n) k.fragen.forEach(q => { const s = qs[q]; if (!s) return; gesehen++; const f = farbe(s); if (/gruen/.test(f)) sitzt++; if (f === 'dunkelgruen') fest++; });
    return {n, gesehen, sitzt, fest, quote: n ? sitzt / n : 1, festQuote: n ? fest / n : 1}; }
  const okTage = (arr, ohneHilfe) => [...new Set(arr.filter(x => x[1] && (!ohneHilfe || !x[3])).map(x => x[0]))].sort((a, b) => a - b);
  /* Kriterien je Art (Gutachten §3.2): Freigabe und „sicher“ brauchen einen zweiten Nachweis an einem späteren Tag */
  const PRAKTISCH = {knoten: 1, ablauf: 1, manoever: 1, rechnen: 1};
  const KRIT = {
    knoten: {frei: e => okTage(e.c.concat(e.e), true).length >= 2, info: 'zweimal richtig gebunden, an zwei Tagen (Spiel oder echtes Tau)'},
    ablauf: {frei: (e, w) => okTage(e.c, true).length >= 2 && (w.n === 0 || w.quote >= .6), info: 'zweimal ohne Hilfe geschafft, an zwei Tagen'},
    manoever: {frei: (e, w) => okTage(e.c, true).length >= 2 && (w.n === 0 || w.quote >= .6), info: 'zweimal sauber gefahren (ohne Rempler, ohne Hilfe), an zwei Tagen'},
    rechnen: {frei: (e, w) => okTage(e.c, true).length >= 2 && (w.n === 0 || w.quote >= .5), info: 'zwei Aufgaben auf der Seekarte richtig, an zwei Tagen'},
    erkennen: {frei: (e, w) => w.quote >= .8 && e.b.filter(x => !x[1]).length <= e.b.filter(x => x[1]).length, info: '80 % der Fragen sitzen'},
    regel: {frei: (e, w) => w.quote >= .8 && e.b.filter(x => x[1]).length >= 2, info: '80 % der Fragen sitzen und zwei Lagen richtig entschieden'},
    wissen: {frei: (e, w) => w.quote >= .8, info: '80 % der Fragen sitzen'}};
  function sicher(k, e, w) { const nach = x => x[1] && !x[3] && x[0] >= e.f + 7;
    if (PRAKTISCH[k.art]) return e.c.concat(e.e).some(nach);
    if (k.art === 'regel') return w.festQuote >= .8 && e.b.some(nach);
    return w.festQuote >= .8; }
  function letzterOk(e) { const t = e.c.concat(e.e, e.b).filter(x => x[1]).map(x => x[0]); return t.length ? Math.max(...t) : e.f || 0; }
  function stufe(id) { const k = KM[id]; if (!k) return 'neu'; const m = mem(), e = m.k[id] || {b: [], c: [], e: []}, w = wissen(id), kr = KRIT[k.art] || KRIT.wissen;
    if (!(e.b.length + e.c.length + e.e.length > 0 || w.gesehen > 0 || e.h)) return 'neu';
    if (!e.f && kr.frei(e, w)) { ein(id).f = tag(); save(); }
    const E = m.k[id] || e;
    if (E.f) { const s = sicher(k, E, w); if (s && !E.s) { E.s = tag(); save(); }
      if (PRAKTISCH[k.art] ? tag() - letzterOk(E) > (s ? 45 : 21) : w.quote < .6) return 'eingerostet';
      return s ? 'sicher' : 'freigegeben'; }
    if (e.c.some(x => x[1]) || e.e.some(x => x[1]) || e.b.some(x => x[1]) || w.sitzt) return 'geuebt';
    return 'gehoert'; }
  const STUFEN = {neu: ['○', 'neu', 'noch nicht dran'], gehoert: ['◔', 'gehört', 'erklärt bekommen'], geuebt: ['◑', 'geübt', 'schon selbst gemacht'], freigegeben: ['✅', 'freigegeben', 'darfst du an Bord'], sicher: ['⭐', 'sicher', 'sitzt auch nach einer Woche'], eingerostet: ['🧽', 'eingerostet', 'lange her, kurz wiederholen']};
  const darf = id => ['freigegeben', 'sicher'].includes(stufe(id));
  /* Melden: eine Dimension bekommt einen Nachweis; Rückgabe vorher/nachher, damit die Crew reagieren kann */
  function melde(id, dim, ok, info = {}) { if (!KM[id] || !['b', 'c', 'e'].includes(dim)) return null; mem(); const vor = stufe(id), e = ein(id);
    e[dim].push([tag(), ok ? 1 : 0, info.lage || '', info.hilfe ? 1 : 0]); if (e[dim].length > 14) e[dim].splice(0, e[dim].length - 14);
    if (ok && dim !== 'b') S.lern.offen = S.lern.offen.filter(o => o.k !== id);
    save(); const nach = stufe(id); return {vor, nach, neu: vor !== nach}; }
  function gehoert(id) { if (!KM[id]) return; mem(); const e = ein(id); if (!e.h) { e.h = tag(); save(); } }
  /* Hörmodus: Die Handlung bleibt offen und wird im Heft vorgemerkt (Gutachten W9) */
  function offen(id, folge) { if (!KM[id]) return; const o = mem().offen; if (!o.some(x => x.k === id)) { o.push({k: id, folge: folge || '', d: tag()}); save(); } }
  const text = id => { const s = STUFEN[stufe(id)]; return s[0] + ' ' + s[1]; };
  const name = id => (KM[id] || {}).name || id;
  /* Ausbildungsheft als Seite */
  async function seite() {
    try { await laden(); } catch (e) { toast('Das Ausbildungsheft ließ sich nicht laden.'); return; }
    subScreen(); mem();
    const gr = {}; D.kompetenzen.forEach(k => { (gr[k.gruppe] = gr[k.gruppe] || []).push(k); });
    const z = {}; D.kompetenzen.forEach(k => { const s = stufe(k.id); z[s] = (z[s] || 0) + 1; });
    const balken = (v, n) => `<span class="lbal"><i style="width:${n ? Math.round(100 * v / n) : 0}%"></i></span>`;
    const zeile = k => { const e = S.lern.k[k.id] || {b: [], c: [], e: []}, w = wissen(k.id), s = STUFEN[stufe(k.id)], bOk = e.b.filter(x => x[1]).length, cTage = okTage(e.c, true).length, eOk = e.e.filter(x => x[1]).length;
      return `<div class="lzeile"><div><b>${esc(k.name)}</b>${k.pruefung ? ' <small class="muted">Praxisprüfung</small>' : ''}<br><small class="muted">Freigabe: ${esc((KRIT[k.art] || KRIT.wissen).info)}</small></div><span class="lstufe" title="${esc(s[2])}">${s[0]} ${esc(s[1])}</span>
        <div class="ldim">${w.n ? `<span>Wissen ${balken(w.sitzt, w.n)} ${w.sitzt}/${w.n}</span>` : ''}${k.art === 'regel' || k.art === 'erkennen' || bOk ? `<span>Verständnis ${bOk ? '✓'.repeat(Math.min(bOk, 4)) : '–'}</span>` : ''}${PRAKTISCH[k.art] ? `<span>Können ${cTage ? '✓'.repeat(Math.min(cTage, 4)) : '–'}${eOk ? ` · echt ${'✓'.repeat(Math.min(eOk, 3))}` : ''}</span>` : ''}</div></div>`; };
    const offenL = S.lern.offen.filter(o => KM[o.k]);
    app.innerHTML = `<div class="qhead" style="margin-top:18px"><h1 style="margin:0">📒 Ausbildungsheft</h1><button class="btn small ghost" id="back">Zurück</button></div>
      <p class="small muted">Hier steht, was du weißt, verstehst und kannst. Freigegeben heißt: Die Crew lässt dich das an Bord machen. Sicher heißt: Es sitzt auch nach einer Woche noch.</p>
      <div class="card lsumme">${Object.keys(STUFEN).filter(s => z[s]).map(s => `<span>${STUFEN[s][0]} ${z[s]} ${esc(STUFEN[s][1])}</span>`).join('')}</div>
      ${offenL.length ? `<div class="card"><b>Am Handy nachholen</b><br><small class="muted">Im Hörmodus hat Hinnerk das gemacht. Selbst machen zählt.</small>${offenL.map(o => `<div class="small">• ${esc(name(o.k))}</div>`).join('')}</div>` : ''}
      ${Object.keys(gr).map(g => `<h3 class="lgruppe">${esc(D.gruppen[g] || g)}</h3><div class="card">${gr[g].map(zeile).join('')}</div>`).join('')}
      <p class="small muted">Die App ersetzt keine Stunde am echten Ruder. Die Manöver in 3D sind vereinfacht: kein Böenwind, Strom überall gleich, andere Boote fahren stur nach Regel.</p>`;
    $('#back').onclick = () => setTab('frei');
  }
  return {laden, melde, stufe, darf, gehoert, offen, seite, text, name, wissen, get daten() { return D; }, STUFEN, KRIT, ALT};
})();
