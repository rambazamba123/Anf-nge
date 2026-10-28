/* V42 Scheine, Termine, Lernzeit (Nutzer, 23./24.10.2026, Konzept §3.5): Man wählt einen oder mehrere Scheine, je Schein
   getrennte Termine für Theorie und Praxis (oder „noch offen“) und die Lernzeit pro Tag aus einer Auswahl.
   Die Crew kommentiert mit festen Textbausteinen aus data/ziele.json (ZIEL_TEXTE), die sich je nach Lage zusammensetzen:
   Kommentar zur Lernzeit, so lernst du, mehrere Scheine, reicht es, Empfehlung, Praxis, Abschluss.
   Spielstand S.ziele {v, scheine: {sbf: {theorie, praxis}}, minuten}; Standard aus den alten Angaben (R7).
   Die Termine gehen weiter in S.courses[id].exam und S.profile.exam, damit Plan und Rennen wie bisher rechnen. */
(function () {
  const MINUTEN = [15, 30, 45, 60, 90];
  const T = () => (typeof ZIEL_TEXTE !== 'undefined' && ZIEL_TEXTE) || {};
  const zufall = a => (a && a.length ? a[Math.random() * a.length | 0] : null);
  const tageBis = iso => iso ? dayNum(new Date(iso + 'T12:00')) - today() : null;
  const stufe = m => String(MINUTEN.reduce((b, x) => Math.abs(x - m) < Math.abs(b - m) ? x : b, 30));

  /* Standard aus den alten Angaben: aktiver Schein und alle Scheine mit eingetragenem Prüfungsdatum */
  function normal() {
    if (S.ziele && S.ziele.v) return S.ziele;
    const scheine = {}, real = !(S.profile && S.profile.examReal === false);
    for (const id of Object.keys(COURSES)) {
      const b = (S.courses || {})[id] || {}, aktiv = id === S.course;
      const datum = aktiv ? (S.profile && S.profile.exam) : b.exam;
      if (aktiv || b.examSet) scheine[id] = {theorie: (aktiv ? b.examSet && real : b.examSet) && datum ? datum : null, praxis: null};
    }
    if (!Object.keys(scheine).length) scheine[S.course || 'sbf'] = {theorie: null, praxis: null};
    return {v: 1, scheine, minuten: (S.profile && S.profile.minutes) || 30};
  }

  /* Lage: Wie viel Lernzeit braucht es noch, wie viel ist bis zum Theorietermin da? (grobe Schätzung, data/ziele.json bedarf) */
  function lage(z) {
    const B = T().bedarf || {sbf: 20, binnen: 14, binnenMitSbf: 9, sks: 35};
    const ids = Object.keys(z.scheine), zeilen = [];
    for (const id of ids) {
      let reife = 0; try { reife = fragenStand(id).v || 0; } catch (e) {}
      const voll = id === 'binnen' && ids.includes('sbf') ? B.binnenMitSbf : B[id] || 20;
      zeilen.push({id, tage: tageBis(z.scheine[id].theorie), praxisTage: tageBis(z.scheine[id].praxis), rest: Math.max(0, voll * (1 - reife)), voll});
    }
    /* Der Reihe nach bis zum jeweiligen Termin: was vorher fällig ist, kostet auch Zeit */
    const datiert = zeilen.filter(x => x.tage != null && x.tage >= 0).sort((a, b) => a.tage - b.tage);
    let summe = 0, schlimmst = null;
    const RANG = {ok: 0, knapp: 1, nein: 2};
    for (const x of datiert) {
      summe += x.rest; x.bisDahin = summe;
      x.verfuegbar = Math.max(0, x.tage) * z.minuten / 60;
      const q = x.bisDahin ? x.verfuegbar / x.bisDahin : 9;
      x.status = q >= 1.25 ? 'ok' : q >= .85 ? 'knapp' : 'nein';
      x.minutenNoetig = x.tage > 0 ? Math.ceil(x.bisDahin * 60 / x.tage / 15) * 15 : null;
      if (!schlimmst || RANG[x.status] > RANG[schlimmst]) schlimmst = x.status;
    }
    return {zeilen, status: schlimmst || 'offen', ersterSchein: (datiert[0] || {}).id || null};
  }

  /* Die Crew kommentiert: feste Bausteine nach Lage */
  function kommentar(z, L = lage(z)) {
    const t = T(), out = [], dazu = l => { if (l) out.push(l); };
    dazu(zufall((t.kommentar || {})[stufe(z.minuten)]));
    dazu(zufall((t.soLernst || {})[stufe(z.minuten)]));
    if (Object.keys(z.scheine).length > 1) dazu(zufall(t.mehrere));
    dazu(zufall((t.reicht || {})[L.status]));
    const e = t.empfehlung || {};
    if (L.status === 'knapp' || L.status === 'nein') {
      if (z.minuten < 90) dazu(zufall(e.mehrZeit));
      dazu(zufall(e.auto));
      if (L.status === 'nein') dazu(zufall(e.termin)); else dazu(zufall(e.wackel));
    }
    const praxis = L.zeilen.map(x => x.praxisTage).filter(d => d != null && d >= 0);
    dazu(zufall((t.praxis || {})[praxis.length ? (Math.min(...praxis) <= 21 ? 'bald' : null) : 'offen']));
    dazu(zufall(t.abschluss));
    return out;
  }

  /* Übernehmen: Termine in die Kurse, Lernzeit ins Profil, aktiver Schein ist der mit dem frühesten Theorietermin */
  function anwenden(z) {
    S.ziele = z; S.courses = S.courses || {};
    /* Vorn liegt der Schein mit dem nächsten Theorietermin; ohne Termine bleibt der aktive, wenn er gewählt ist */
    const L = lage(z), vorn = L.ersterSchein || (z.scheine[S.course] ? S.course : Object.keys(z.scheine)[0]);
    if (vorn && vorn !== S.course) switchCourse(vorn);
    for (const [id, x] of Object.entries(z.scheine)) {
      const b = S.courses[id] = S.courses[id] || {};
      if (x.theorie) { b.exam = x.theorie; b.examSet = true; }
      if (id === S.course && S.profile) { if (x.theorie) S.profile.exam = x.theorie; S.profile.examReal = !!x.theorie; }
    }
    if (S.profile) S.profile.minutes = z.minuten;
    S.plan = null; save();
    return L;
  }

  /* ---------- Formular (Einstellungen und Kennenlernen) ---------- */
  function formular(box, z, aenderung) {
    const ids = Object.keys(COURSES);
    const datum = (id, art) => { const x = z.scheine[id] || {}; return `<div class="zdatum"><label class="small">${art === 'theorie' ? 'Theorie' : 'Praxis'}</label>
      <input type="date" data-d="${id}|${art}" value="${x[art] || ''}" ${x[art] ? '' : 'disabled'}>
      <label class="small zoffen"><input type="checkbox" data-o="${id}|${art}" ${x[art] ? '' : 'checked'}> noch offen</label></div>`; };
    const zeichne = () => {
      box.innerHTML = `<p class="small" style="margin:0 0 6px"><b>Für welche Scheine lernst du?</b> Mehrere gehen.</p>
        <div class="zreihe">${ids.map(id => `<button class="chip" data-s="${id}" aria-pressed="${!!z.scheine[id]}">${esc(COURSES[id].short)}</button>`).join('')}${COURSES_SOON.map(c => `<button class="chip off" disabled aria-disabled="true">${esc((c.name.match(/\((.*)\)/) || [, c.name])[1])} · kommt bald</button>`).join('')}</div>
        ${Object.keys(z.scheine).map(id => `<div class="zschein"><b>${esc(COURSES[id].name)}</b>${datum(id, 'theorie')}${datum(id, 'praxis')}</div>`).join('')}
        <p class="small" style="margin:12px 0 6px"><b>Wie viel Zeit hast du am Tag?</b></p>
        <div class="zreihe">${MINUTEN.map(m => `<button class="chip" data-m="${m}" aria-pressed="${z.minuten === m}">${m} Minuten</button>`).join('')}</div>
        <style>.zreihe{display:flex;flex-wrap:wrap;gap:6px}.zreihe .chip{flex:0 0 auto}.zschein{margin-top:10px;padding:8px;border:1px solid var(--line);border-radius:12px}.zdatum{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}.zdatum label:first-child{width:52px}.zdatum input[type=date]{flex:1;min-width:140px}.zoffen{display:flex;align-items:center;gap:4px}</style>`;
      box.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
        const id = b.dataset.s;
        if (z.scheine[id]) { if (Object.keys(z.scheine).length > 1) delete z.scheine[id]; }
        else z.scheine[id] = {theorie: null, praxis: null};
        zeichne(); aenderung();
      });
      box.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { z.minuten = +b.dataset.m; zeichne(); aenderung(); });
      box.querySelectorAll('[data-d]').forEach(inp => inp.onchange = () => { const [id, art] = inp.dataset.d.split('|'); z.scheine[id][art] = inp.value || null; aenderung(); });
      box.querySelectorAll('[data-o]').forEach(c => c.onchange = () => {
        const [id, art] = c.dataset.o.split('|'), inp = box.querySelector(`[data-d="${id}|${art}"]`);
        if (c.checked) { z.scheine[id][art] = null; inp.value = ''; inp.disabled = true; }
        else { inp.disabled = false; if (!inp.value) inp.value = new Date(Date.now() + (art === 'theorie' ? 42 : 56) * 864e5).toISOString().slice(0, 10); z.scheine[id][art] = inp.value; }
        aenderung();
      });
    };
    zeichne();
  }
  /* Zahlen nur auf dem Bildschirm (die gesprochenen Sätze haben keine Zahlen) */
  function lageHtml(z, L = lage(z)) {
    const h = v => v < 1 ? 'unter einer Stunde' : `etwa ${Math.round(v)} Stunde${Math.round(v) === 1 ? '' : 'n'}`;
    const zeile = x => x.tage == null ? `<li><b>${esc(COURSES[x.id].short)}:</b> noch kein Theorietermin. Bis zur Prüfungsreife sind es ${h(x.rest)}.</li>`
      : x.tage < 0 ? `<li><b>${esc(COURSES[x.id].short)}:</b> Der Termin liegt in der Vergangenheit. Bitte neu eintragen.</li>`
      : `<li><b>${esc(COURSES[x.id].short)}:</b> Theorie in ${x.tage} Tagen (${fmtDate(z.scheine[x.id].theorie)}). Du brauchst noch ${h(x.bisDahin)}${x.bisDahin > x.rest + .5 ? ' (mit dem Schein davor)' : ''}, bis dahin hast du ${h(x.verfuegbar)}. ${{ok: '✅ Reicht.', knapp: '⚠️ Knapp.', nein: '❌ Reicht nicht.'}[x.status]}${x.status !== 'ok' && x.minutenNoetig ? ` Mit etwa ${x.minutenNoetig} Minuten am Tag würde es reichen.` : ''}${x.praxisTage != null && x.praxisTage >= 0 ? ` Praxis in ${x.praxisTage} Tagen.` : ''}</li>`;
    return `<ul class="small" style="margin:0;padding-left:18px">${L.zeilen.map(zeile).join('')}</ul><p class="small muted" style="margin:6px 0 0">Grobe Schätzung: SBF See etwa ${(T().bedarf || {}).sbf || 20} Stunden Lernzeit, Binnen mit See zusammen weniger, weil die Basisfragen nur einmal zählen. Was du schon kannst, wird abgezogen.</p>`;
  }
  async function vorsprechen(z, box) {
    const lines = kommentar(z);
    if (box) box.innerHTML = lines.map(l => `<p class="small" style="margin:0 0 4px"><b>${esc(nameOf(l.s))}:</b> ${esc(l.t)}</p>`).join('');
    AUD.unlock();
    for (const l of lines) { if (box && !document.body.contains(box)) break; await VOX.say(cid(l.s), l.t, 'fixed'); }
  }

  /* Bildschirm in den Einstellungen und für „Kurs abstecken“ */
  function seite(opts = {}) {
    subScreen();
    const z = JSON.parse(JSON.stringify(normal()));
    app.innerHTML = `<div class="qhead" style="margin-top:18px"><h1 style="margin:0">🎯 Scheine und Termine</h1><button class="btn small ghost" id="back">Zurück</button></div>
      <div class="card" id="zform"></div>
      <div class="card"><h3 style="margin-top:0">Reicht die Zeit?</h3><div id="zlage"></div></div>
      <div class="card" id="zcrew"><p class="small muted" style="margin:0">Nach dem Speichern sagt dir die Crew, wie du lernst und ob es reicht.</p></div>
      <div class="row"><button class="btn lamp" id="zsave">Speichern</button></div>`;
    const neu = () => { $('#zlage').innerHTML = lageHtml(z); };
    formular($('#zform'), z, neu); neu();
    $('#back').onclick = () => { VOX.stop(); (opts.zurueck || renderSettings)(); };
    $('#zsave').onclick = async () => { anwenden(z); toast('Gespeichert.'); $('#zsave').textContent = 'Gespeichert ✔'; await vorsprechen(z, $('#zcrew')); };
  }

  /* Kennenlernen: Formular unten im Bild, danach spricht die Crew. Gibt die Ziele zurück. */
  function imGespraech() {
    const z = normal();
    return new Promise(res => {
      const p = stagePanel(`<div id="zform" style="max-height:52vh;overflow:auto"></div><div class="small" id="zlage" style="margin-top:8px"></div><div class="row" style="margin-top:10px"><button class="btn lamp" id="zok">Kurs abstecken</button></div>`);
      const neu = () => { const e = p.querySelector('#zlage'); if (e) e.innerHTML = lageHtml(z); };
      formular(p.querySelector('#zform'), z, neu); neu();
      p.querySelector('#zok').onclick = () => { p.classList.add('answered'); res(z); };
    });
  }

  window.ZIELE = {normal, lage, kommentar, anwenden, seite, imGespraech, vorsprechen};
})();
