/* ==========================================================================
   Skipper – Knoten (V12): Knotenbrett in der Kajüte und Spiel „Knotenkunde“
   Wird erst bei Bedarf nachgeladen (loadKnoten in index.html). Daten: data/knoten.json.
   Die Zeichnungen sind schematisch: Taustücke (seg) werden nacheinander „gebunden“ (Strich-Animation).
   ========================================================================== */
(() => {
const KN = window.KNOTEN = window.KNOTEN || {};
let D = null;
KN.init = () => D ? Promise.resolve() : fetch('data/knoten.json?v=' + window.__ver).then(r => r.json()).then(j => { D = j; });
const byId = id => D.knoten.find(k => k.id === id);
const K_ = () => (S.knoten = S.knoten || {});

/* Ein Knoten als SVG. anim: Taustücke nacheinander aufziehen (Dauer je Stück in Sekunden) */
function bild(k, anim, dauer = 1.2) {
  const seg = k.seg.map((s, i) => {
    const c = s.c || '#e0b65a', w = s.w || 6, a = anim ? ` style="stroke-dasharray:400;stroke-dashoffset:400;animation:knotzieh ${dauer}s ease-in-out ${(i * dauer).toFixed(2)}s forwards"` : '';
    return `<path d="${s.d}" fill="none" stroke="#5a3e1e" stroke-width="${w + 2.5}" stroke-linecap="round"${a}/><path d="${s.d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${a}/>`;
  }).join('');
  return `<svg class="knotbild" viewBox="0 0 120 80" role="img" aria-label="${esc(k.name)} (schematisch)"><rect width="120" height="80" rx="8" fill="#f4ead2"/>${seg}</svg>`;
}
const CSS = `<style>.knotbild{width:100%;max-width:360px;display:block;margin:0 auto}.knotgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.knotgrid button{border:2px solid var(--line);background:var(--paper);border-radius:14px;padding:8px;color:var(--ink);text-align:left}.knotgrid b{display:block;font:700 .95rem var(--hfont);margin-top:4px}
.menuitem.richtig{border-color:var(--stb,#1e7f4f);box-shadow:inset 0 0 0 2px var(--stb,#1e7f4f)}.shake{animation:kshake .35s}@keyframes kshake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.knotsteps li{margin:4px 0;opacity:.45;transition:opacity .3s}.knotsteps li.an{opacity:1;font-weight:700}
@keyframes knotzieh{to{stroke-dashoffset:0}}.knotuhr{font:700 2.4rem var(--hfont);text-align:center;margin:8px 0}</style>`;

/* ---------- Knotenbrett: alle Knoten, je mit Animation, Schritten, Merkhilfe und Übung ---------- */
KN.brett = function () {
  returnTo = 'cabin';
  const k = K_();
  gameShell('Knotenbrett', `${CSS}<p class="small muted" style="margin:6px 0 10px">Die Knoten für die praktische Prüfung. Antippen: Schritt für Schritt ansehen und mit echtem Tau üben.</p>
    <div class="knotgrid">${D.knoten.map(x => `<button data-k="${x.id}">${bild(x)}<b>${k[x.id] && k[x.id].ok ? '✓ ' : ''}${esc(x.name)}</b>${k[x.id] && k[x.id].zeit ? `<span class="small muted">Bestzeit ${k[x.id].zeit} s</span>` : ''}</button>`).join('')}</div>`);
  $('#gback').onclick = () => setTab('cabin');
  app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { AUD.click(); KN.zeige(b.dataset.k); });
};
KN.zeige = function (id) {
  const k = byId(id), dauer = 1.4, n = k.seg.length;
  gameShell(k.name, `${CSS}<div class="card">${bild(k, true, dauer)}
    <ol class="knotsteps" id="kst">${k.schritte.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <p class="small" style="margin:6px 0 0">💡 ${esc(k.merk)}</p><p class="small muted" style="margin:6px 0 0"><b>Wofür:</b> ${esc(k.wofuer)}</p></div>
    <div class="row" style="margin-top:10px"><button class="btn ghost" id="knoch">▶ Nochmal zeigen</button><button class="btn lamp" id="kueb">🪢 Mit echtem Tau üben</button></div>`);
  $('#gback').onclick = () => KN.brett();
  /* Schritte im Takt der Animation hervorheben */
  const lis = [...app.querySelectorAll('#kst li')], ges = n * dauer * 1000 + 600, je = ges / lis.length;
  lis.forEach((li, i) => setTimeout(() => { lis.forEach(x => x.classList.remove('an')); li.classList.add('an'); }, i * je));
  setTimeout(() => lis.forEach(x => x.classList.add('an')), ges + 400);
  $('#knoch').onclick = () => KN.zeige(id); $('#kueb').onclick = () => KN.ueben(id);
};
/* Übung mit echtem Tau: Zeit stoppen, dann selbst bewerten */
KN.ueben = function (id) {
  const k = byId(id); let t0 = 0, iv = null;
  gameShell('Üben: ' + k.name, `${CSS}<div class="card"><p style="margin:0">Nimm ein Stück Tau oder eine Kordel. Tippe auf Start, binde den <b>${esc(k.name)}</b> und tippe auf Fertig.</p>
    <div class="knotuhr" id="kuhr">0,0 s</div><div class="row" style="justify-content:center"><button class="btn lamp" id="kgo">Start</button></div><div id="kbew"></div></div>`);
  $('#gback').onclick = () => { clearInterval(iv); KN.zeige(id); };
  $('#kgo').onclick = () => {
    if (!t0) { t0 = performance.now(); AUD.click(); $('#kgo').textContent = 'Fertig'; iv = setInterval(() => { $('#kuhr').textContent = ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',') + ' s'; }, 100); return; }
    clearInterval(iv); const sek = Math.round((performance.now() - t0) / 100) / 10; $('#kgo').remove();
    $('#kbew').innerHTML = `<p style="margin:10px 0 6px">Zieh kräftig dran. Hält der Knoten und sieht er aus wie auf dem Bild?</p><div class="row"><button class="btn lamp" id="kja">Hält ✓</button><button class="btn ghost" id="knein">Nochmal</button></div>`;
    $('#kja').onclick = () => { const r = K_()[id] = K_()[id] || {}; r.ok = 1; if (!r.zeit || sek < r.zeit) { r.zeit = sek; toast(`Neue Bestzeit: ${String(sek).replace('.', ',')} s`); } save(); AUD.sfx('richtig', {vol: .5}); KN.brett(); };
    $('#knein').onclick = () => KN.ueben(id);
  };
};

/* ---------- Spiel „Knotenkunde“: 8 Runden aus Erkennen, Wofür und Reihenfolge ---------- */
KN.spiel = function () {
  returnTo = 'cabin';
  const arten = shuffle(['erkennen', 'erkennen', 'erkennen', 'wofuer', 'wofuer', 'wofuer', 'reihe', 'reihe']);
  let i = 0, score = 0;
  const runde = () => {
    if (i >= arten.length) {
      const nb = recordScore('knoten', score);
      gameShell('Knotenkunde', `${CSS}<div class="card"><h2 style="margin:0">${score} von ${arten.length} richtig</h2><p class="muted">${nb ? 'Neuer Rekord!' : 'Gut gebunden ist halb gesegelt.'}</p>
        <div class="row"><button class="btn lamp" id="knag">Nochmal</button><button class="btn ghost" id="knbr">Zum Knotenbrett</button></div></div>`);
      $('#gback').onclick = () => gamesHub(); $('#knag').onclick = () => KN.spiel(); $('#knbr').onclick = () => KN.brett(); return;
    }
    const art = arten[i], k = D.knoten[Math.random() * D.knoten.length | 0], andere = shuffle(D.knoten.filter(x => x !== k)).slice(0, 3);
    const kopf = `<p class="small muted" style="margin:6px 0">Runde ${i + 1} von ${arten.length} · ${score} richtig</p>`;
    const weiter = (ok, text) => { if (ok) score++; AUD.sfx(ok ? 'richtig' : 'falsch', {vol: ok ? .45 : .35}); $('#kfb').innerHTML = `<p style="margin:8px 0"><b style="color:var(${ok ? '--stb' : '--bb'})">${ok ? 'Richtig!' : 'Nicht ganz.'}</b> ${esc(text)}</p><button class="btn lamp" id="knx">Weiter</button>`; $('#knx').onclick = () => { i++; runde(); }; };
    if (art === 'reihe') {
      const order = shuffle(k.schritte.map((s, j) => j)); let pos = 0, fehler = false;
      gameShell('Knotenkunde', `${CSS}${kopf}<div class="card"><p style="margin:0 0 6px"><b>${esc(k.name)}:</b> Tippe die Schritte in der richtigen Reihenfolge.</p>
        <div class="menu" id="krs">${order.map(j => `<button class="menuitem" data-j="${j}">${esc(k.schritte[j])}</button>`).join('')}</div><div id="kfb"></div></div>`);
      app.querySelectorAll('[data-j]').forEach(b => b.onclick = () => {
        if (pos >= k.schritte.length) return; const j = +b.dataset.j;
        if (j === pos) { b.disabled = true; b.insertAdjacentHTML('afterbegin', `<b>${pos + 1}. </b>`); pos++; AUD.click(); if (pos === k.schritte.length) weiter(!fehler, fehler ? 'Mit einem Fehler geschafft. Schau dir die Reihenfolge am Knotenbrett noch mal an.' : 'Alle Schritte in der richtigen Reihenfolge.'); }
        else { fehler = true; b.classList.add('shake'); AUD.sfx('falsch', {vol: .25}); setTimeout(() => b.classList.remove('shake'), 400); }
      });
    } else {
      const opts = shuffle([k, ...andere]);
      const frage = art === 'erkennen' ? `<p style="margin:0 0 6px"><b>Welcher Knoten ist das?</b></p>${bild(k)}` : `<p style="margin:0 0 6px"><b>Welcher Knoten passt?</b></p><p style="margin:0 0 6px">${esc(k.lage)}</p>`;
      gameShell('Knotenkunde', `${CSS}${kopf}<div class="card">${frage}<div class="menu" style="margin-top:8px">${opts.map(o => `<button class="menuitem" data-o="${o.id}">${esc(o.name)}</button>`).join('')}</div><div id="kfb"></div></div>`);
      app.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
        app.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; if (x.dataset.o === k.id) x.classList.add('richtig'); });
        weiter(b.dataset.o === k.id, `${k.name}: ${k.wofuer}`);
      });
    }
    $('#gback').onclick = () => gamesHub();
  };
  runde();
};
})();
