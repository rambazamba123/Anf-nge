/* V26 Grundkurs Seezeichen (See) und Zeichen Binnen. Daten: data/seezeichen.json (window.SEEZ_DATA).
   Jede Lektion: die Crew erklärt kurz, Karten mit den Originalbildern und der amtlichen Antwort aus dem Fragenkatalog,
   dazu eine Merkhilfe; bei Leuchtfeuern blinkt die Kennung im richtigen Takt. Danach die Prüfungsfragen der Lektion.
   Geschafft ist eine Lektion ab 80 % richtig. Stand: S.seez[art][lektion] = 1 (Standard leer). */
(function () {
'use strict';
const SZ = {};
const CSS = `<style>
.szk .szcrew{background:var(--paper);border:2px solid var(--line);border-radius:14px;padding:10px 12px;margin:10px 0}
.szk .szcrew p{margin:4px 0}
.szk .szkarten{display:grid;grid-template-columns:1fr;gap:10px}
.szk .szkarte{background:var(--paper);border:2px solid var(--line);border-radius:16px;padding:10px 12px}
.szk .szkarte h3{margin:0 0 6px;font:700 1.05rem var(--hfont)}
.szk .szbilder{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;background:#fff;border-radius:10px;padding:6px;margin-bottom:8px}
.szk .szbilder img{max-width:100%;max-height:170px;object-fit:contain}
.szk .szamt{font-size:.9rem;margin:0}.szk .szamt b{color:var(--sea)}
.szk .szmerk{font-size:.88rem;margin:6px 0 0}
.szk .szquelle{font-size:.72rem;color:var(--muted);margin:4px 0 0}
.szk .szlek{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:2px solid var(--line);background:var(--paper);border-radius:14px;padding:10px 12px;margin:8px 0;color:var(--ink);min-height:56px}
.szk .szlek .nr{flex:0 0 32px;height:32px;border-radius:50%;background:var(--line);display:grid;place-items:center;font-weight:800}
.szk .szlek.ok .nr{background:var(--stb);color:#fff}
.szk .szlek b{display:block}.szk .szlek small{color:var(--muted)}
.szk .kenn{display:flex;align-items:center;gap:12px;padding:8px 0;border-top:1px dashed var(--line)}
.szk .kenn:first-of-type{border-top:0}
.szk .lampe{flex:0 0 34px;height:34px;border-radius:50%;background:#2b2b2b;box-shadow:inset 0 0 0 3px #555;transition:background .05s}
.szk .kenn code{font:700 .95rem ui-monospace,monospace}
</style>`;

/* Kennung in An/Aus-Schritte (Sekunden) übersetzen: Fl, LFl, Oc, Iso, Q, VQ, F, Gruppen in Klammern, Zusatz +LFl */
function takt(k) {
  const m = k.match(/^(LFl|Fl|Oc|Iso|VQ|Q|F)(?:\((\d+)\))?(\+LFl)?\s*([RGW])?/); if (!m) return {farbe: '#fff6c8', schritte: [[1, 1]]};
  const art = m[1], n = +(m[2] || 1), farbe = {R: '#ff4a3d', G: '#3bd16f', W: '#fff6c8'}[m[4] || 'W'];
  const s = [];
  if (art === 'F') return {farbe, schritte: [[1, 4]]};
  if (art === 'Iso') return {farbe, schritte: [[1, 2], [0, 2]]};
  const an = {Fl: .4, LFl: 2, Oc: 2.2, Q: .3, VQ: .15}[art], aus = {Fl: .8, LFl: 1, Oc: .6, Q: .7, VQ: .35}[art];
  for (let i = 0; i < n; i++) s.push([1, an], [0, aus]);
  if (m[3]) s.push([1, 2], [0, .5]);
  /* Nord-Kardinal (Q ohne Gruppe) funkelt ohne Pause; sonst Pause nach der Gruppe */
  if (!(art === 'Q' || art === 'VQ') || m[2] || m[3]) s.push([0, art === 'Oc' ? 2 : 3]);
  return {farbe, schritte: s};
}
function blinken(root) {
  const lampen = [...root.querySelectorAll('[data-takt]')].map(el => ({el, t: takt(el.dataset.takt), i: 0, bis: 0}));
  const tick = now => {
    if (!root.isConnected) return;
    lampen.forEach(l => { if (now >= l.bis) { const [an, d] = l.t.schritte[l.i % l.t.schritte.length]; l.el.style.background = an ? l.t.farbe : '#2b2b2b'; l.el.style.boxShadow = an ? `0 0 14px ${l.t.farbe}, inset 0 0 0 3px #555` : 'inset 0 0 0 3px #555'; l.bis = now + d * 1000; l.i++; } });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
/* Eigene Zeichnungen nur, wo die Prüfung keine Bilder zeigt (Binnen fragt nur mit Text) */
const ZEICHNUNG = {
  rotstumpf: '<svg viewBox="0 0 80 90" width="90" aria-label="Rote Stumpftonne"><path d="M10 80 Q40 88 70 80" stroke="#2d5f6a" stroke-width="3" fill="none"/><rect x="22" y="30" width="36" height="46" rx="3" fill="#d6332c" stroke="#7a1a14" stroke-width="2"/><ellipse cx="40" cy="30" rx="18" ry="5" fill="#e24a3f" stroke="#7a1a14" stroke-width="2"/></svg>',
  gruenspitz: '<svg viewBox="0 0 80 90" width="90" aria-label="Grüne Spitztonne"><path d="M10 80 Q40 88 70 80" stroke="#2d5f6a" stroke-width="3" fill="none"/><path d="M40 14 L64 76 L16 76 Z" fill="#2e9a52" stroke="#14532c" stroke-width="2" stroke-linejoin="round"/></svg>',
  fluss: '<svg viewBox="0 0 300 120" width="100%" aria-label="Fluss von der Quelle zur Mündung"><path d="M0 70 C60 40 120 90 180 60 S270 50 300 62" stroke="#5d8fc4" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M20 66 C70 44 120 86 180 58 S260 50 286 60" stroke="#fff" stroke-width="2" stroke-dasharray="6 6" fill="none"/><path d="M262 56 l14 4 -12 8" fill="none" stroke="#fff" stroke-width="3"/><text x="6" y="22" font-size="13" font-weight="700" fill="#2a2019">Quelle</text><text x="238" y="22" font-size="13" font-weight="700" fill="#2a2019">Mündung</text><text x="110" y="112" font-size="12" font-weight="700" fill="#d6332c">rechtes Ufer (talwärts)</text><text x="96" y="40" font-size="12" font-weight="700" fill="#2e9a52">linkes Ufer</text></svg>'
};

const daten = art => window.SEEZ_DATA[art];
const katalog = art => art === 'binnen' ? BIN_DATA : DATA;
const frage = (art, n) => katalog(art).find(q => q.n === n);
const stand = art => ((S.seez = S.seez || {})[art] = S.seez[art] || {});
const sprich = lines => { try { VOX.stop('Seezeichen'); VOX.lines(lines.map(l => ({cid: cid(l.s), t: l.t})), 'fixed'); } catch (e) {} };
const crewHtml = lines => `<div class="szcrew">${lines.map(l => `<p><b style="color:${CREW[cid(l.s)].color}">${esc(nameOf(l.s))}:</b> ${esc(l.t)}</p>`).join('')}</div>`;

SZ.kurs = function (art) {
  const D = daten(art), st = stand(art);
  subScreen(); place = 'pruef';
  const fertig = D.lektionen.filter(l => st[l.id]).length;
  app.innerHTML = `${CSS}<div class="szk"><div class="topbar"><button class="btn small ghost" id="back">← Zurück</button><b class="tbtitle">${esc(D.titel)}</b><span class="small muted">${fertig}/${D.lektionen.length}</span></div>
    ${crewHtml(D.intro)}
    ${D.lektionen.map((l, i) => `<button class="szlek${st[l.id] ? ' ok' : ''}" data-l="${l.id}"><span class="nr">${st[l.id] ? '✓' : i + 1}</span><span><b>${esc(l.t)}</b><small>${l.karten.length} Karten · ${l.fragen.length} Prüfungsfragen${st[l.id] ? ' · geschafft' : ''}</small></span></button>`).join('')}
    <p class="small muted" style="margin:10px 2px 24px">${art === 'binnen' ? 'In der Binnen-Prüfung werden die Zeichen nur mit Text abgefragt. Die kleinen Zeichnungen sind zur Veranschaulichung.' : 'Die Bilder sind die Originale aus dem amtlichen Fragenkatalog: genau so sehen sie in der Prüfung aus.'}</p></div>`;
  $('#back').onclick = () => { AUD.click(); setTab('cabin'); };
  app.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { AUD.click(); SZ.lektion(art, b.dataset.l); });
  if (!st._intro) { st._intro = 1; save(); sprich(D.intro); }
};
SZ.lektion = function (art, id) {
  const D = daten(art), L = D.lektionen.find(l => l.id === id), i = D.lektionen.indexOf(L), next = D.lektionen[i + 1];
  subScreen(); place = 'pruef';
  const karte = k => { const q = k.q ? frage(art, k.q) : null, imgs = q && q.img ? q.img : [];
    return `<div class="szkarte"><h3>${esc(k.t)}</h3>${imgs.length ? `<div class="szbilder">${imgs.map(s => `<img src="${s}" alt="${esc(k.t)}" loading="lazy">`).join('')}</div>` : k.zeichnung && ZEICHNUNG[k.zeichnung] ? `<div class="szbilder">${ZEICHNUNG[k.zeichnung]}</div>` : ''}
      ${q ? `<p class="szamt"><b>Prüfungsantwort:</b> ${esc(ansText(q))}</p>` : `<p class="szamt">${esc(k.text || '')}</p>`}${k.merk ? `<p class="szmerk">💡 ${esc(k.merk)}</p>` : ''}${q ? `<p class="szquelle">Amtlicher Fragenkatalog, Frage ${q.n}${imgs.length ? ' (Originalbild)' : ''}</p>` : ''}</div>`; };
  app.innerHTML = `${CSS}<div class="szk"><div class="topbar"><button class="btn small ghost" id="back">← Kurs</button><b class="tbtitle">${i + 1}. ${esc(L.t)}</b><span></span></div>
    ${crewHtml(L.crew)}
    ${L.bild && ZEICHNUNG[L.bild] ? `<div class="szkarte" style="margin-bottom:10px">${ZEICHNUNG[L.bild]}</div>` : ''}
    <div class="szkarten">${L.karten.map(karte).join('')}</div>
    ${L.kennungen ? `<div class="szkarte" style="margin-top:10px"><h3>So blinken die Feuer</h3>${L.kennungen.map(k => `<div class="kenn"><span class="lampe" data-takt="${esc(k.k)}"></span><span><code>${esc(k.k)}</code><br><small>${esc(k.t)}</small></span></div>`).join('')}<p class="szquelle">Takt vereinfacht dargestellt, nicht maßstäblich.</p></div>` : ''}
    <button class="btn lamp wide" id="szq" style="margin-top:12px">Prüfungsfragen zu dieser Lektion (${L.fragen.length})</button>
    ${next ? `<button class="btn ghost wide" id="szn" style="margin-top:8px">Weiter: ${esc(next.t)}</button>` : ''}<div style="height:24px"></div></div>`;
  $('#back').onclick = () => { AUD.click(); VOX.stop(); SZ.kurs(art); };
  const n = $('#szn'); if (n) n.onclick = () => { AUD.click(); VOX.stop(); SZ.lektion(art, next.id); };
  $('#szq').onclick = () => {
    AUD.click(); VOX.stop();
    scheinAktiv(D.kurs);  /* die Fragen zählen für den Schein, aus dessen Katalog sie stammen */
    const qs = L.fragen.map(n => QN[n]).filter(Boolean);
    runQuiz(qs, 'Seezeichen: ' + L.t, 'learn', {hint: 'Genau so fragt die Prüfung.', doneLabel: 'Zurück zum Kurs', noRequeue: true,
      onDone: r => { const ok = qs.length && (qs.length - (r.wrong || []).length) / qs.length >= .8; if (ok) { stand(art)[L.id] = 1; save(); toast('Lektion geschafft!'); } SZ.kurs(art); }});
  };
  blinken(app);
  sprich(L.crew);
};
SZ.offen = art => { const D = window.SEEZ_DATA && daten(art); return D ? D.lektionen.filter(l => !stand(art)[l.id]).length : null; };
window.SEEZ = SZ;
})();
