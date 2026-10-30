/* Die Reise (VISION.md, docs/reise-konzept.md, O93–O110): ein Tag auf See = eine durchgehende Geschichte.
   Nachgeladen über reiseOeffnen() (index.html, nach szene.js). Daten in data/reise.json (Sätze der Crew sind Platzhalter, B164).
   Tisch antippen: Die Karte kippt ins Bild und der Tag läuft von selbst. Eine Bühne ohne Scrollen mit drei Ansichten
   (Nutzer 29.10.2026, O105): „karte“ (Seekarte 7 in der Mitte, das Boot fährt die Route), „crew“ (Gespräch, die Gesichter groß)
   und „fahrt“ (Blick von hinten aufs Boot, nur wo man es braucht: Tonne, Lichter …). Die Gesichter der Crew stehen daneben,
   wer spricht, hat die Sprechblase. Antippen der Blase springt weiter, ⏸ hält an.
   Zwischendurch höchstens ein, zwei Fragen, ein, zwei Entscheidungen, Minispiele und Knoten; die Fragen des Tages kommen am Ende (Fragerunde).
   „Mitmachen“ oder „Nur hören“: Im Hörmodus löst die Crew alles laut vor, sechs Sekunden Denkpause, dann die Lösung.
   Nach einem Tag geht es sofort mit dem nächsten weiter.
   Spielstand: S.reise {pos: {tag, i}, fertig: {tag: datum}, modus: 'mit'|'auto', wahl: {}, log: []} (Standard beim ersten Öffnen, R7). */
window.REISE = (() => {
  let D = null, lauf = null;
  const laden = () => D ? Promise.resolve(D) : fetch('data/reise.json?v=' + window.__ver).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(j => (D = j));
  const heute = () => new Date().toISOString().slice(0, 10);
  const pause = ms => new Promise(r => setTimeout(r, ms));
  const CREW3 = ['hinnerk', 'smilla', 'klabauter'];
  const NAME = {hinnerk: "Käpt'n", smilla: 'Smilla', klabauter: 'Klabauter', kroeger: 'Harms'};
  function stand() {
    if (!S.reise || typeof S.reise !== 'object') S.reise = {};
    const r = S.reise; if (!r.fertig || typeof r.fertig !== 'object') r.fertig = {}; r.log = r.log || []; r.wahl = r.wahl || {}; r.modus = r.modus || 'mit';
    if (!r.pos || !D.tage.some(t => t.tag === r.pos.tag) || r.pos.i == null) { const offen = D.tage.find(t => !r.fertig[t.tag]) || D.tage[0]; r.pos = {tag: offen.tag, i: 0}; }
    return r;
  }
  const tagDaten = n => D.tage.find(t => t.tag === (n || stand().pos.tag)) || D.tage[0];
  const auto = () => stand().modus === 'auto';

  /* ---------- Seekarte 7 (SVG über dem Kartenbild; Koordinaten in PDF-Punkten) ---------- */
  function karteSVG(t, box) {
    /* Ausschnitt an das Hochformat der Bühne anpassen: die Breite bleibt, oben und unten kommt Karte dazu */
    const K = D.karte7, r = t.route || [], st = document.getElementById('rbild'), vh = st && st.clientWidth ? st.clientHeight / st.clientWidth : 1;
    let [x0, y0, x1, y1] = box; const w = x1 - x0, h = Math.max(y1 - y0, w * vh), cy = (y0 + y1) / 2; y0 = cy - h / 2; y1 = cy + h / 2;
    return `<svg class="karte7" viewBox="${x0} ${y0} ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(K.titel)}">
      <image href="${esc(K.bild)}" x="0" y="0" width="${K.w}" height="${K.h}"/>
      ${r.length ? `<polyline points="${r.map(p => p.join(',')).join(' ')}" fill="none" stroke="#c0392b" stroke-width="1.8" stroke-dasharray="5 4" stroke-linecap="round"/>` : ''}
      <g id="rboot" transform="translate(${r[0] ? r[0].join(' ') : '0 0'})"><circle r="7" fill="#fff" stroke="#c0392b" stroke-width="2"/><path d="M-4 1.5 L4 1.5 L2.6 4 L-2.6 4Z M0 -4 L0 1.5 M0 -4 L3.4 0 L0 0" fill="#c0392b" stroke="#c0392b" stroke-width=".8"/></g></svg>`;
  }
  const routeBox = t => { const xs = t.route.map(p => p[0]), ys = t.route.map(p => p[1]), m = 40, w = Math.max(...xs) - Math.min(...xs) + 2 * m, h = Math.max(...ys) - Math.min(...ys) + 2 * m;
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2, b = Math.max(w, h * 1.2), hh = b / 1.2; return [cx - b / 2, cy - hh / 2, cx + b / 2, cy + hh / 2]; };
  /* Boot an Routenpunkt i (auch Bruchteile) */
  function bootAuf(t, f) {
    const r = t.route, i = Math.max(0, Math.min(r.length - 1, f)), a = r[Math.floor(i)], b = r[Math.min(r.length - 1, Math.floor(i) + 1)], u = i - Math.floor(i);
    const g = document.getElementById('rboot'); if (g) g.setAttribute('transform', `translate(${a[0] + (b[0] - a[0]) * u} ${a[1] + (b[1] - a[1]) * u})`);
    if (lauf) lauf.boot = i;
  }
  function fahre(t, von, bis, sek) {
    const t0 = performance.now(), me = lauf;
    const sch = now => { if (!me || me.aus || !document.getElementById('rboot')) return; const u = Math.min(1, (now - t0) / (sek * 1000)); bootAuf(t, von + (bis - von) * u); if (u < 1) requestAnimationFrame(sch); };
    requestAnimationFrame(sch);
  }

  /* ---------- Bühne: eine Seite ohne Scrollen ---------- */
  function buehne(t) {
    subScreen(); place = 'reise'; window.TOERN_STILL = true; window.scrollTo(0, 0);
    app.innerHTML = `<div class="rleiste"><button class="btn small ghost" id="rzur" aria-label="Zurück in die Kajüte">←</button><span class="rtag">Tag ${t.tag} · ${esc(t.titel)}</span>
        <button class="btn small ghost" id="rtage" aria-label="Alle Tage">📖</button><button class="btn small ghost" id="rpause" aria-label="Anhalten">⏸</button><button class="chip" id="rmod" aria-pressed="${auto()}">${auto() ? '🎧' : '✋'}</button></div>
      <div class="rbuehne kippt" id="rbuehne" data-ansicht="crew">
        <div class="rrunde" id="rrunde">${rundeHinten('tisch', 'tag')}</div>
        <div class="rgesichter gross" id="rgesichter">${CREW3.map(c => `<div class="rgesicht" data-c="${c}">${charSVG(c)}</div>`).join('')}</div>
        <div class="rvorn" id="rvorn">${rundeVorn('tisch')}</div>
        <div class="rbild zu" id="rbild"></div>
        <button class="rblase leer" id="rblase" aria-live="polite"></button></div>
      <div class="rakt" id="rakt"></div>`;
    $('#rzur').onclick = () => { AUD.click(); stopLauf(); setTab('cabin'); };
    $('#rtage').onclick = () => { AUD.click(); tageListe(); };
    $('#rpause').onclick = () => { AUD.click(); if (!lauf) return; lauf.halt = !lauf.halt; $('#rpause').textContent = lauf.halt ? '▶' : '⏸'; if (lauf.halt) VOX.stop('Pause'); };
    $('#rmod').onclick = () => { const r = stand(); r.modus = auto() ? 'mit' : 'auto'; save(); $('#rmod').setAttribute('aria-pressed', auto()); $('#rmod').textContent = auto() ? '🎧' : '✋'; toast(auto() ? 'Nur hören: Ab jetzt löst die Crew alles laut vor.' : 'Mitmachen: Ab jetzt bist du dran.'); };
    $('#rblase').onclick = () => { if (lauf && lauf.weiter) { VOX.stop('weiter'); lauf.weiter(); } };
  }
  /* Erklärgrafiken (Nutzer 29.10.2026): Alles Gesprochene versteht man auch ohne Bild, die Grafik erklärt es zusätzlich.
     Schritte: {ansicht: 'grafik', bild: 'rad'} öffnet die Grafik, {grafik: n} schaltet zur Phase n (data-p am SVG). */
  const GRAFIK = {
    rad: () => {
      const pfeil = (x1, x2, y, c, cls, w = 6) => `<g class="${cls}"${w < 6 ? ' opacity=".6"' : ''}><line x1="${x1}" y1="${y}" x2="${x2 + (x2 > x1 ? -10 : 10)}" y2="${y}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="${x2 > x1 ? `M${x2} ${y} l-14 -9 v18z` : `M${x2} ${y} l14 -9 v18z`}" fill="${c}"/></g>`;
      const T = (x, y, a, txt, cls) => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}" font-size="12.5" font-weight="700" fill="#2b3a4a" stroke="#fff" stroke-width="3" paint-order="stroke">${txt}</text>`;
      /* Pfeil der Strömung: gestrichelte Bahn mit Spitze; fl = Fließrichtung (Dashes laufen mit) */
      const ström = (d, kopf, cls) => `<g class="${cls}"><path class="flow" d="${d}" fill="none" stroke="#f08a1c" stroke-width="5" stroke-linecap="round"/><polygon points="${kopf}" fill="#f08a1c"/></g>`;
      const hitL = '<path class="hit" d="M118 176 q-10 -2 -16 -10"/><path class="hit" d="M122 190 q-11 1 -18 -3" style="animation-delay:.15s"/><path class="hit" d="M130 160 q-8 -6 -10 -15" style="animation-delay:.3s"/>';
      const hitR = '<path class="hit" d="M282 176 q10 -2 16 -10"/><path class="hit" d="M278 190 q11 1 18 -3" style="animation-delay:.15s"/><path class="hit" d="M270 160 q8 -6 10 -15" style="animation-delay:.3s"/>';
      return `<svg class="gr" data-p="0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Radeffekt: Boot von hinten. Der Propeller schleudert das Wasser nach oben gegen den Rumpf, der Stoß schiebt das Heck zur Seite">
        <style>.gr .rumpf{transition:transform 1.8s ease-in-out}.gr[data-p="3"] .rumpf{transform:translateX(24px)}.gr[data-p="4"] .rumpf{transform:translateX(-24px)}
        .gr .prop{transform-box:view-box;transform-origin:200px 240px}.gr:not([data-p="0"]) .prop{animation:gspin 1.4s linear infinite}.gr[data-p="4"] .prop{animation-direction:reverse}@keyframes gspin{to{transform:rotate(360deg)}}
        .gr .wv{fill:none;stroke:#fff;stroke-width:2;vector-effect:non-scaling-stroke;transform-box:view-box;transform-origin:200px 240px;opacity:0}
        .gr[data-p="2"] .wv,.gr[data-p="3"] .wv,.gr[data-p="4"] .wv{animation:gwav 2.4s ease-out infinite}@keyframes gwav{0%{transform:scale(.45);opacity:.8}100%{transform:scale(3.2);opacity:0}}
        .gr .flow{stroke-dasharray:7 6;animation:gdash .7s linear infinite}@keyframes gdash{to{stroke-dashoffset:-13}}
        .gr .hit{fill:none;stroke:#fff;stroke-width:3.5;stroke-linecap:round;opacity:0}.gr[data-p="2"] .hit,.gr[data-p="3"] .hit,.gr[data-p="4"] .hit{animation:ghit 1.6s ease-out infinite}@keyframes ghit{0%,40%{opacity:0}60%{opacity:1}100%{opacity:0}}
        .gr .a1,.gr .a1r,.gr .aU,.gr .aUr,.gr .t2,.gr .t3,.gr .t4,.gr .p3,.gr .p4{opacity:0;transition:opacity .5s}
        .gr[data-p="1"] .a1,.gr[data-p="2"] .a1,.gr[data-p="3"] .a1,.gr[data-p="4"] .a1r,.gr[data-p="2"] .aU,.gr[data-p="3"] .aU,.gr[data-p="4"] .aUr,.gr[data-p="2"] .t2,.gr[data-p="3"] .t3,.gr[data-p="3"] .p3,.gr[data-p="4"] .t4,.gr[data-p="4"] .p4{opacity:1}
        .gr .hit.aU,.gr .hit.aUr{opacity:0}</style>
        <rect width="400" height="130" fill="#cfe9f7"/><rect y="130" width="400" height="170" fill="#3d8fb8"/>
        <g class="rumpf">
          <path d="M146 64 L154 38 Q200 28 246 38 L254 64Z" fill="#ece5d6" stroke="#8a7a66" stroke-width="1.6"/><rect x="162" y="44" width="28" height="14" rx="3" fill="#7fb2cf"/><rect x="210" y="44" width="28" height="14" rx="3" fill="#7fb2cf"/>
          <path d="M102 64 H298 L280 130 H120Z" fill="#f4efe6" stroke="#8a7a66" stroke-width="2"/><rect x="98" y="58" width="204" height="8" rx="3" fill="#b98750"/>
          <path d="M110 92 H290 L287 103 H113Z" fill="#2b6a9a"/><text x="200" y="124" text-anchor="middle" font-size="12" font-weight="800" fill="#7a5a3a">SKIPPER</text>
          <rect x="112" y="126" width="176" height="6" rx="3" fill="#8a6d4a"/>
          <path d="M120 132 C114 184 154 212 200 212 C246 212 286 184 280 132Z" fill="#8a3b2a" stroke="#5b2a1c" stroke-width="1.5"/><path d="M124 150 H276" stroke="#6f2d20" stroke-width="2" opacity=".6"/>
          <rect x="194" y="210" width="12" height="14" fill="#5b3a2a"/>
          <g class="prop">${[0, 120, 240].map(a => `<ellipse cx="200" cy="222" rx="7" ry="18" transform="rotate(${a} 200 240)" fill="#d9b85c" stroke="#8a6d1f" stroke-width="1.5"/>`).join('')}<circle cx="200" cy="240" r="6" fill="#8a6d1f"/></g>
          ${[0, .8, 1.6].map(d => `<circle class="wv" cx="200" cy="240" r="30" style="animation-delay:${d}s"/>`).join('')}
          <g class="aU">${hitL}</g><g class="aUr">${hitR}</g></g>
        <rect y="130" width="400" height="170" fill="#3d8fb8" opacity=".3"/><path d="M0 130 Q50 124 100 130 T200 130 T300 130 T400 130" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/>
        ${T(10, 112, 'start', 'Backbord', 'ab0')}${T(390, 112, 'end', 'Steuerbord', 'ab0')}${T(10, 150, 'start', 'Von hinten gesehen', 'ab0')}
        <g class="a1"><path d="M232 222 A30 30 0 0 1 200 272" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="5 4"/><polygon points="196,262 212,276 191,279" fill="#fff"/></g>
        <g class="a1r"><path d="M168 222 A30 30 0 0 0 200 272" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="5 4"/><polygon points="204,262 188,276 209,279" fill="#fff"/></g>
        <g class="a1">${T(250, 236, 'start', 'dreht im', 'a1')}${T(250, 250, 'start', 'Uhrzeigersinn', 'a1')}</g><g class="a1r">${T(150, 236, 'end', 'dreht gegen den', 'a1r')}${T(150, 250, 'end', 'Uhrzeigersinn', 'a1r')}</g>
        ${ström('M176 240 Q142 232 128 198', '127,185 118,203 137,203', 'aU')}${ström('M224 240 Q258 232 272 198', '273,185 263,203 282,203', 'aUr')}
        ${T(200, 291, 'middle', 'Außen läuft der Flügel nach oben: Das Wasser prallt an den Rumpf', 't2')}${T(200, 291, 'middle', 'Der Stoß schiebt den Rumpf zur Seite', 't3')}${T(200, 291, 'middle', 'Rückwärts läuft der Flügel auf der anderen Seite nach oben', 't4')}
        ${pfeil(190, 340, 20, '#c0392b', 'p3')}${T(265, 11, 'middle', 'Das Heck weicht nach rechts aus', 'p3')}${pfeil(210, 60, 20, '#c0392b', 'p4')}${T(135, 11, 'middle', 'Das Heck weicht nach links aus', 'p4')}</svg>`;
    }
  };
  /* Die Hauptansicht ist die Runde mit der Crew (Nutzer 29.10.2026). Karte und Fahrt-Szene legen sich nur bei Bedarf darüber
     und verschwinden wieder, wenn der Schritt `ansicht: 'crew'` kommt. Der Ort der Runde: tisch (Kajüte), steg, deck, abend. */
  function ansicht(t, a) {
    const b = $('#rbild'), g = $('#rgesichter'); if (!b) return; lauf.ansicht = a;
    if (lauf.fahrt) { lauf.fahrt.aus = true; lauf.fahrt = null; } AUD.loop('motorLauf', 0);
    const st = $('#rbuehne'); st.dataset.ansicht = a.ansicht;
    if (a.ansicht === 'crew') {
      lauf.ort = a.ort || lauf.ort || 'tisch'; b.classList.add('zu'); b.innerHTML = '';
      $('#rrunde').innerHTML = rundeHinten(lauf.ort, a.dp || lauf.dp || 'tag'); $('#rvorn').innerHTML = rundeVorn(lauf.ort);
      g.className = 'rgesichter gross'; return;
    }
    b.classList.remove('zu'); g.className = 'rgesichter klein';
    if (a.ansicht === 'karte') { b.innerHTML = karteSVG(t, a.box || routeBox(t)); bootAuf(t, lauf.boot || 0); }
    else if (a.ansicht === 'grafik' && GRAFIK[a.bild]) b.innerHTML = GRAFIK[a.bild]();
    else if (a.ansicht === 'fahrt') { b.innerHTML = '<canvas id="fahrtcv" aria-label="Blick von hinten auf das eigene Boot"></canvas>'; lauf.fahrt = fahrtBild(t, a); }
  }
  /* Hintergrund der Runde: Himmel und Wasser je Ort und Tageszeit, in der Kajüte Holzwand mit Bullauge und Laterne */
  function rundeHinten(ort, dp) {
    const H = {morgen: ['#f2b98a', '#bfe0f0'], tag: ['#8cc9ec', '#dff1fb'], abend: ['#ee935a', '#7b98c2'], nacht: ['#0b1730', '#24406b']}[dp] || ['#8cc9ec', '#dff1fb'];
    if (ort === 'steg' || ort === 'deck' || ort === 'abend') {
      const ab = ort === 'abend', hi = ab ? ['#ee935a', '#c9788a'] : H, see = ab ? ['#58789b', '#2a4462'] : ['#4f9cc4', '#2f6f96'];
      return `<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="rh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi[0]}"/><stop offset="1" stop-color="${hi[1]}"/></linearGradient><linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${see[0]}"/><stop offset="1" stop-color="${see[1]}"/></linearGradient></defs>
        <rect width="400" height="600" fill="url(#rh)"/>${ab ? '<circle cx="290" cy="250" r="34" fill="#fde7a6" opacity=".9"/>' : '<ellipse cx="90" cy="90" rx="60" ry="14" fill="#fff" opacity=".7"/><ellipse cx="300" cy="140" rx="48" ry="11" fill="#fff" opacity=".6"/>'}
        <rect y="300" width="400" height="300" fill="url(#rs)"/><path d="M0 300 Q100 288 200 300 T400 296 V312 H0Z" fill="#6aa86a" opacity=".55"/>
        ${[0, 1, 2, 3, 4].map(i => `<path d="M${-20 + i * 90} ${330 + i * 22} q25 -8 50 0 t50 0 t50 0" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`).join('')}</svg>`;
    }
    return `<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="rw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d4426"/><stop offset=".5" stop-color="#85552f"/><stop offset="1" stop-color="#6d4426"/></linearGradient><radialGradient id="rl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient><linearGradient id="rbull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${H[0]}"/><stop offset=".55" stop-color="${H[1]}"/><stop offset=".56" stop-color="#4f9cc4"/><stop offset="1" stop-color="#2f6f96"/></linearGradient></defs>
      <rect width="400" height="600" fill="url(#rw)"/>${[60, 130, 200, 270, 340, 410].map(y => `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#4a2c14" stroke-opacity=".45" stroke-width="2"/>`).join('')}
      <circle cx="305" cy="130" r="58" fill="#c9a24a"/><circle cx="305" cy="130" r="48" fill="url(#rbull)"/><path d="M257 130h96M305 82v96" stroke="#c9a24a" stroke-width="4" opacity=".7"/>
      <line x1="120" y1="0" x2="120" y2="70" stroke="#3a2412" stroke-width="3"/><path d="M104 70h32l-5 34h-22z" fill="#d9a441"/><circle cx="120" cy="92" r="70" fill="url(#rl)"/>
      <rect x="20" y="190" width="110" height="10" rx="3" fill="#3f2713"/><rect x="30" y="160" width="14" height="30" fill="#7a3b2a"/><rect x="48" y="166" width="12" height="24" fill="#3b5f7a"/><rect x="64" y="158" width="14" height="32" fill="#8a7a3a"/></svg>`;
  }
  /* Vordergrund der Runde: der Kartentisch (Aufsicht angedeutet) mit Seekarte, Bechern und Zirkel; sonst Reling oder Planken */
  function rundeVorn(ort) {
    if (ort === 'tisch') return `<svg viewBox="0 0 400 150" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 150 L10 20 H390 L410 150Z" fill="#9a6a3a"/><path d="M10 20 H390 L392 34 H8Z" fill="#b98750"/>
      ${[40, 80, 120].map(y => `<line x1="${-5 + (y - 20) * -.1}" y1="${y}" x2="${405 + (y - 20) * .1}" y2="${y}" stroke="#6d4426" stroke-opacity=".5" stroke-width="1.5"/>`).join('')}
      <path d="M60 52 H300 L316 118 H44Z" fill="#f3e6c4" stroke="#8a7440" stroke-width="2"/><path d="M80 70 q60 -10 120 6 t100 -4" fill="none" stroke="#6aa8c4" stroke-width="3"/><circle cx="240" cy="94" r="3" fill="#c0392b"/><path d="M240 94 L275 78" stroke="#c0392b" stroke-width="2" stroke-dasharray="4 3"/>
      <rect x="326" y="62" width="26" height="22" rx="4" fill="#e9dcc4"/><rect x="26" y="66" width="26" height="22" rx="4" fill="#c9553d"/><path d="M335 56 q6 -10 0 -18 M343 56 q6 -10 0 -18" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/></svg>`;
    return `<svg viewBox="0 0 400 150" preserveAspectRatio="none" aria-hidden="true"><rect y="60" width="400" height="90" fill="#a77a4d"/>${[60, 90, 120].map(y => `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#6d4426" stroke-opacity=".5" stroke-width="2"/>`).join('')}<rect y="52" width="400" height="10" fill="#c9a06a"/></svg>`;
  }
  function fahrtBild(t, a) {
    const cv = $('#fahrtcv'); if (!cv) return null; const g = cv.getContext('2d');
    const w = cv.clientWidth || 360, h = cv.clientHeight || 300; cv.width = w * devicePixelRatio; cv.height = h * devicePixelRatio; g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const F = {t: 0, tempo: 1, aus: false, ende: 1e9, gischt: [], tonne: a.tonne || false};
    const wx = a.wx || t.wx || 'schoen', dp = a.dp || 'tag', rau = {schoen: .45, windig: .85, sturm: 1.35, regen: .55, nebel: .3}[wx] || .5;
    AUD.loop('motorLauf', .2);
    let last = performance.now();
    const schritt = now => { if (F.aus || !cv.isConnected) return; const dt = Math.min(.05, (now - last) / 1000); last = now; if (!(lauf && lauf.halt)) F.t += dt; zeichne(g, w, h, F, dp, wx, rau, now / 1000); requestAnimationFrame(schritt); };
    requestAnimationFrame(schritt);
    return F;
  }
  function stopLauf() { if (lauf) { lauf.aus = true; if (lauf.fahrt) lauf.fahrt.aus = true; if (lauf.weiter) lauf.weiter(); } lauf = null; if (window.SZENE) SZENE.stop(); VOX.stop('Reise'); AUD.loop('motorLauf', 0); }
  const warteHalt = async me => { while (me.halt && !me.aus) await pause(200); };

  /* Ein Satz in der Sprechblase; die Blase antippen springt weiter */
  async function sag(me, wer, text) {
    await warteHalt(me); if (me.aus) return;
    const c = CREW[wer] ? wer : 'hinnerk', bl = $('#rblase'); if (!bl) return;
    document.querySelectorAll('.rgesicht').forEach(x => x.classList.toggle('spricht', x.dataset.c === c));
    bl.classList.remove('leer'); bl.className = 'rblase von-' + c; bl.innerHTML = `<b>${esc(NAME[c] || CREW[c].short)}:</b> ${esc(text)}`;
    await new Promise(res => { me.weiter = res; Promise.resolve(VOX.say(c, text, 'local')).then(res, res); });
    me.weiter = null;
    if (me.halt) { await warteHalt(me); if (!me.aus) return sag(me, wer, text); }
    await pause(250);
  }

  /* ---------- Den Tag spielen ---------- */
  async function spielen(n) {
    await laden(); await nachladen('szene.js');
    stopLauf();
    const r = stand(); if (n && n !== r.pos.tag) r.pos = {tag: n, i: 0};
    const t = tagDaten(), s = t.schritte;
    if (r.fertig[t.tag] && r.pos.i >= s.length) r.pos.i = 0;
    const me = lauf = {aus: false, halt: false, boot: 0};
    buehne(t);
    /* Ansicht und Bootsort an der Einstiegsstelle wiederherstellen */
    let a = {ansicht: 'karte'}; for (let k = 0; k < r.pos.i; k++) { if (s[k].ansicht) a = s[k]; if (s[k].fahre) me.boot = s[k].fahre[1]; }
    ansicht(t, a);
    for (let i = r.pos.i; i < s.length; i++) {
      if (me.aus) return;
      r.pos.i = i; save();
      await schritt(s[i], t, me);
    }
    if (me.aus) return;
    r.fertig[t.tag] = heute();
    const naechster = D.tage.find(x => x.tag > t.tag);
    r.pos = {tag: naechster ? naechster.tag : t.tag, i: naechster ? 0 : s.length}; save();
    tagEnde(t, naechster, me);
  }
  async function schritt(s, t, me) {
    await warteHalt(me); if (me.aus) return;
    if (s.ansicht) { ansicht(t, s); return pause(400); }
    if (s.grafik != null) { const sv = $('#rbild svg.gr'); if (sv) sv.dataset.p = s.grafik; return pause(500); }
    if (s.fahre) { fahre(t, s.fahre[0], s.fahre[1], s.sek || 8); return; }
    if (s.wer && s.t) return sag(me, s.wer, auto() && s.auto ? s.auto : s.t);
    if (s.wahl) return wahl(s, me);
    if (s.frage != null) return frageEinzeln(s, me);
    if (s.navi) return navi(s.navi, t, me);
    if (s.mini) return mini(s, t, me);
    if (s.knoten) return knoten(s.knoten, t, me);
    if (s.fragerunde) return fragerunde(t, me);
    if (s.logbuch) { stand().log.push({d: heute(), tag: t.tag, text: s.logbuch}); save(); AUD.sfx('bleistift', {vol: .5, dur: .9}); akt(`<p class="small" style="margin:0">📓 <b>Logbuch:</b> ${esc(s.logbuch)}</p>`); return pause(2200); }
  }
  const akt = html => { const a = $('#rakt'); if (a) a.innerHTML = html; return a; };

  /* Entscheidung: die Crew empfiehlt, du entscheidest (im Hörmodus nimmt die Crew die Empfehlung) */
  async function wahl(s, me) {
    await sag(me, s.wer || 'hinnerk', s.wahl); if (me.aus) return;
    let o;
    if (auto()) { o = s.opts.find(x => x.empfohlen) || s.opts[0]; await sag(me, 'smilla', o.t); }
    else o = await new Promise(res => {
      akt(s.opts.map((x, i) => `<button class="btn ${x.empfohlen ? 'lamp' : 'ghost'} rwahl" data-o="${i}">${esc(x.t)}${x.empfohlen ? ' <small>⭐ Empfehlung der Crew</small>' : ''}</button>`).join(''));
      document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { AUD.click(); res(s.opts[+b.dataset.o]); });
      me.weiter = () => res(null);
    });
    me.weiter = null; akt('');
    if (!o || me.aus) return;
    if (s.id) { stand().wahl[s.id] = o.wert != null ? o.wert : o.t; save(); }
    for (const d of o.dann || []) { if (me.aus) return; await schritt(d, tagDaten(), me); }
  }
  /* Amtliche Frage: Mitmachen = antworten (zählt), Nur hören = vorlesen, sechs Sekunden Denkpause, Lösung */
  const frageVon = n => (typeof QN !== 'undefined' && QN[n] && QN[n].a && QN[n].a.length === 4) ? QN[n] : (typeof DATA !== 'undefined' ? DATA.find(x => x.n === n) : null);
  function frage(q, me) {
    const order = [0, 1, 2, 3].sort(() => Math.random() - .5);
    const a = akt(`<p class="rq"><b>${esc(q.q)}</b></p>${q.img ? `<div class="rqimg">${q.img.map(s => `<img src="${esc(s)}" alt="">`).join('')}</div>` : ''}${order.map((k, j) => `<button class="ans" data-k="${k}"><b class="abc">${'ABCD'[j]}</b> ${esc(q.a[k])}</button>`).join('')}<div class="kdenk" id="rdenk"></div>`);
    if (auto()) return (async () => {
      await VOX.say(S.crew.M || 'smilla', SZENE.text(q, order), 'local'); if (me.aus) return;
      const d = $('#rdenk'); if (d) d.textContent = '🤔 Denkpause … 6 s'; if (AUD.ticks) AUD.ticks(6, .3); await pause(6000); if (me.aus) return;
      if (d) d.textContent = ''; a.querySelectorAll('.ans').forEach(b => { b.disabled = true; if (b.dataset.k === '0') b.classList.add('ok'); });
      await VOX.say(S.crew.K || 'hinnerk', 'Richtig ist: ' + q.a[0], 'local'); await pause(500);
    })();
    return new Promise(res => {
      let ctl = null, fertig = false;
      const antwort = k => {
        if (fertig) return; fertig = true; if (ctl) ctl.stop(); VOX.stop('Antwort');
        const ok = k === 0; AUD.sfx(ok ? 'richtig' : 'falsch', {vol: .55});
        a.querySelectorAll('.ans').forEach(b => { b.disabled = true; const kk = +b.dataset.k; if (kk === 0) b.classList.add('ok'); else if (kk === k) b.classList.add('no'); });
        if (typeof record === 'function' && S.course !== 'sks') { try { record(q.n, ok); } catch (e) {} }
        setTimeout(() => res(ok), ok ? 1100 : 2200);
      };
      a.querySelectorAll('.ans').forEach(b => b.onclick = () => antwort(+b.dataset.k));
      me.weiter = () => { if (me.aus) { if (ctl) ctl.stop(); res(null); } };
      ctl = SZENE.frage(q, order, {wer: S.crew.M, onPick: antwort});
    });
  }
  async function frageEinzeln(s, me) { const q = frageVon(s.frage); if (!q) return; await frage(q, me); me.weiter = null; akt(''); }
  async function fragerunde(t, me) {
    const neu = (t.fragen || []).map(frageVon).filter(Boolean), alt = (typeof faellig === 'function' ? faellig() : []).filter(q => q.a && q.a.length === 4 && !(t.fragen || []).includes(q.n)).slice(0, 3);
    const liste = neu.concat(alt); if (!liste.length) return;
    await sag(me, 'hinnerk', auto() ? 'Fragerunde. Ich lese vor, du denkst mit.' : 'Fragerunde. ' + liste.length + ' Fragen, dann ist Feierabend.');
    let ok = 0;
    for (let i = 0; i < liste.length; i++) { if (me.aus) return; $('#rblase').innerHTML = `<b>Fragerunde</b> · ${i + 1} von ${liste.length}`; if ((await frage(liste[i], me)) === true) ok++; me.weiter = null; }
    akt('');
    if (!auto()) await sag(me, ok === liste.length ? 'smilla' : 'hinnerk', ok === liste.length ? 'Alles richtig. Nicht schlecht, Badewannen-Kapitän.' : ok + ' von ' + liste.length + ' richtig. Die anderen kommen wieder.');
  }
  /* Navigation direkt auf der Karte, verbunden mit der Etappe des Tages */
  /* Navigation auf der Seekarte 7 mit allen Werkzeugen (navi7.js, Aufgaben in data/navi7.json). Dieselben Aufgaben gibt es unter „Frei üben“. */
  async function navi7(n, t, me) {
    await window.nachladen('navi7.js'); await NAVI7.laden(); if (me.aus) return;
    const def = NAVI7.bank().aufgaben.find(a => a.id === n.id); if (!def) return;
    $('#rbuehne').dataset.ansicht = 'karte'; const b = $('#rbild'), g = $('#rgesichter'); b.classList.remove('zu'); g.className = 'rgesichter klein'; lauf.ansicht = {ansicht: 'karte'};
    const rest = document.createElement('div'); rest.className = 'rnavi'; const a = akt(''); a.appendChild(rest);
    me.weiter = null;
    await NAVI7.aufgabe(def, {host: b, antwort: rest, sag: (w, tx) => sag(me, w, tx), auto: auto()});
    await NAV.revier('kliev'); if (me.aus) return;
    akt(''); ansicht(t, {ansicht: 'karte'}); bootAuf(t, lauf.boot || 0);
  }
  function navi(n, t, me) {
    if (n.id) return navi7(n, t, me);
    if (lauf.ansicht && lauf.ansicht.ansicht !== 'karte') ansicht(t, {ansicht: 'karte', box: n.ausschnitt});
    else if (n.ausschnitt) ansicht(t, {ansicht: 'karte', box: n.ausschnitt});
    const svg = $('#rbild svg'), ziel = `<circle class="nziel" cx="${n.ziel[0]}" cy="${n.ziel[1]}" r="${n.radius || 12}" fill="none" stroke="#f1c40f" stroke-width="2.5"/>`;
    const zeige = () => svg.insertAdjacentHTML('beforeend', ziel);
    if (auto()) return sag(me, 'smilla', n.aufgabe).then(() => { if (me.aus) return; zeige(); return sag(me, 'smilla', n.auto || n.richtig); });
    return sag(me, 'smilla', n.aufgabe).then(() => new Promise(res => {
      let versuche = 0; akt('<p class="small" style="margin:0">🧭 <b>Tippe auf die Karte.</b></p>');
      me.weiter = null;
      svg.addEventListener('click', function tipp(ev) {
        const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; const m = p.matrixTransform(svg.getScreenCTM().inverse());
        const ok = Math.hypot(m.x - n.ziel[0], m.y - n.ziel[1]) <= (n.radius || 12) * 1.4;
        svg.insertAdjacentHTML('beforeend', `<circle cx="${m.x}" cy="${m.y}" r="3" fill="${ok ? '#27ae60' : '#c0392b'}"/>`);
        if (ok || ++versuche >= 3) { svg.removeEventListener('click', tipp); AUD.sfx(ok ? 'richtig' : 'falsch', {vol: .45}); zeige(); akt(''); sag(me, 'smilla', (ok ? '' : 'Hier ist sie. ') + n.richtig).then(res); return; }
        AUD.sfx('falsch', {vol: .3}); sag(me, 'smilla', n.hilfe);
      });
    }));
  }
  /* Minispiel mitten in der Geschichte; danach geht es genau hier weiter */
  function mini(s, t, me) {
    const m = D.minis[s.mini]; if (!m || typeof window[m.f] !== 'function') return;
    if (auto()) return sag(me, 'smilla', s.auto || ('Die Bonusrunde ' + m.name + ' spielst du, wenn du mitmachst.'));
    return sag(me, 'smilla', s.text || ('Bonusrunde: ' + m.name + '?')).then(() => new Promise(res => {
      akt(`<div class="row"><button class="btn lamp" id="mgo">🎲 ${esc(m.name)} spielen</button><button class="btn ghost" id="mweg">Auslassen</button></div>`);
      $('#mweg').onclick = () => { AUD.click(); akt(''); res(); };
      $('#mgo').onclick = () => {
        AUD.click(); if (lauf && lauf.fahrt) lauf.fahrt.aus = true; AUD.loop('motorLauf', 0);
        BONUS = {key: s.mini, runden: m.runden, sek: m.sek, fertig: pts => { zurueck(t, me); toast(`Bonusrunde ${m.name}: ${pts} von ${m.max}`, 2500); res(); }};
        window[m.f]();
        setTimeout(() => ['#gback', '#quit'].forEach(sel => { const b = $(sel); if (b) b.onclick = () => bonusEnde(0); }), 80);
      };
    }));
  }
  /* Nach Minispiel oder Knoten zurück auf die Bühne, gleiche Ansicht */
  function zurueck(t, me) { if (me.aus) return; lauf = me; const a = me.ansicht || {ansicht: 'karte'}; buehne(t); ansicht(t, a); }
  /* Knoten genau dann, wenn man ihn braucht: Animation mit Hinnerk, danach zurück in die Geschichte */
  async function knoten(id, t, me) {
    const kd = await fetch('data/knoten.json?v=' + window.__ver).then(r => r.json()).catch(() => null);
    const k = kd && (kd.knoten || kd).find && (kd.knoten || kd).find(x => x.id === id); if (!k) return;
    if (auto()) { await sag(me, 'hinnerk', 'Der ' + k.name + '. ' + (k.spruch ? 'Zum Mitsagen: ' + k.spruch : '')); for (const x of k.schritte) { if (me.aus) return; await sag(me, 'hinnerk', x); } return; }
    await sag(me, 'hinnerk', 'Jetzt der ' + k.name + '. Ich zeig ihn dir.'); if (me.aus) return;
    await loadKnoten();
    return new Promise(res => {
      if (lauf && lauf.fahrt) lauf.fahrt.aus = true; AUD.loop('motorLauf', 0);
      KNOTEN.zeige(id);
      const fertig = () => { VOX.stop('Knoten'); zurueck(t, me); res(); };
      setTimeout(() => {
        const gb = $('#gback'); if (gb) gb.onclick = fertig;
        const ueb = $('#kueb'); if (ueb) ueb.insertAdjacentHTML('afterend', '<button class="btn lamp" id="kgesch">⛵ Weiter in der Geschichte</button>');
        const b = $('#kgesch'); if (b) b.onclick = () => { AUD.click(); fertig(); };
      }, 80);
    });
  }
  /* Tag geschafft: sofort weiter zum nächsten */
  function tagEnde(t, naechster, me) {
    $('#rblase').className = 'rblase'; $('#rblase').innerHTML = `<b>⚓ Tag ${t.tag} geschafft!</b>`;
    akt(naechster ? `<button class="btn lamp wide" id="rnext">▶ Weiter: Tag ${naechster.tag} · ${esc(naechster.titel)}</button>`
      : `<p class="small" style="margin:0 0 8px">Das ist der letzte Tag, den es schon gibt. Die nächsten kommen mit der Geschichte.</p><button class="btn ghost wide" id="rnochmal">🔁 Tag ${t.tag} nochmal</button>`);
    const nx = $('#rnext'); if (nx) nx.onclick = () => { AUD.click(); spielen(naechster.tag); };
    const nm = $('#rnochmal'); if (nm) nm.onclick = () => { AUD.click(); stand().pos = {tag: t.tag, i: 0}; save(); spielen(t.tag); };
    if (auto() && naechster) setTimeout(() => { if (lauf === me && !me.aus) spielen(naechster.tag); }, 4000);
  }
  /* Alle Tage: nochmal spielen oder springen (nur bereits erreichte) */
  function tageListe() {
    const r = stand(), erreicht = t => r.fertig[t.tag] || t.tag === r.pos.tag;
    const w = sheet(`<h2 style="margin:0 0 8px">Die Reise</h2><div class="menu">${D.tage.map(t => `<button class="menuitem" data-tg="${t.tag}" ${erreicht(t) ? '' : 'disabled'}><b>${r.fertig[t.tag] ? '✓' : t.tag === r.pos.tag ? '▶' : '🔒'} Tag ${t.tag}: ${esc(t.titel)}</b><small>${esc(t.von)} → ${esc(t.nach)}</small></button>`).join('')}</div>
      ${r.log.length ? `<h3>📓 Logbuch</h3>${r.log.slice(-5).reverse().map(l => `<p class="small" style="margin:0 0 6px"><b>${esc(l.d)}</b> · Tag ${l.tag}: ${esc(l.text)}</p>`).join('')}` : ''}`);
    w.querySelectorAll('[data-tg]').forEach(b => b.onclick = () => { closeSheet(); const n = +b.dataset.tg; const rr = stand(); if (rr.pos.tag !== n) rr.pos = {tag: n, i: 0}; save(); spielen(n); });
  }
  /* Tisch antippen: direkt in den Tag (an der gespeicherten Stelle) */
  function oeffnen() { return laden().then(() => spielen()); }

  /* ---------- Fahrt-Szene: Blick von hinten auf das eigene Boot (M10, Nutzer 28.10.2026) ---------- */
  const HIMMEL = {morgen: ['#f2b98a', '#bfe0f0'], tag: ['#7fbde6', '#dff1fb'], abend: ['#ee935a', '#7b98c2'], nacht: ['#0b1730', '#24406b']};
  const SEE = {morgen: ['#6c97b3', '#2f5d7c'], tag: ['#4f9cc4', '#1f5f86'], abend: ['#58789b', '#2a4462'], nacht: ['#1b2f4d', '#0a1528']};
  function zeichne(g, W, H, F, dp, wx, rau, uhr) {
    const t = F.t, hy = Math.round(H * .4);
    /* Himmel und Wolken */
    let gr = g.createLinearGradient(0, 0, 0, hy); gr.addColorStop(0, HIMMEL[dp][0]); gr.addColorStop(1, HIMMEL[dp][1]); g.fillStyle = gr; g.fillRect(0, 0, W, hy);
    if (dp === 'nacht') { g.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 30; i++) g.fillRect((i * 97) % W, (i * 53) % (hy - 20), 1.5, 1.5); }
    g.fillStyle = wx === 'sturm' || wx === 'regen' ? 'rgba(120,130,145,.8)' : 'rgba(255,255,255,.75)';
    for (let i = 0; i < 5; i++) { const x = ((i * 140 - t * (6 + i * 2)) % (W + 160) + W + 160) % (W + 160) - 80, y = 18 + i * 13; g.beginPath(); g.ellipse(x, y, 42 + i * 6, 11, 0, 0, Math.PI * 2); g.ellipse(x + 26, y - 6, 26, 10, 0, 0, Math.PI * 2); g.fill(); }
    /* Land am Horizont: Ufer der Schlei, dazu eine Windmühle, die näher kommt */
    const nah = Math.min(1, t / F.ende);
    g.fillStyle = dp === 'nacht' ? '#13243a' : '#5f8a5a';
    g.beginPath(); g.moveTo(0, hy); for (let x = 0; x <= W; x += 20) g.lineTo(x, hy - 10 - 8 * Math.sin(x / 47 + 1) - (x < W * .3 ? 14 : 0)); g.lineTo(W, hy); g.fill();
    const mx = W * .62, ms = .6 + nah * 1.4, my = hy - 10;
    g.fillStyle = dp === 'nacht' ? '#0d1a2b' : '#7a5b3c'; g.beginPath(); g.moveTo(mx - 6 * ms, my); g.lineTo(mx - 3 * ms, my - 22 * ms); g.lineTo(mx + 3 * ms, my - 22 * ms); g.lineTo(mx + 6 * ms, my); g.fill();
    g.save(); g.translate(mx, my - 22 * ms); g.rotate(uhr * .8); g.strokeStyle = dp === 'nacht' ? '#0d1a2b' : '#4a3a28'; g.lineWidth = 2 * ms;
    for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 16 * ms); g.stroke(); } g.restore();
    /* Wasser mit Wellenreihen, die auf dich zulaufen */
    gr = g.createLinearGradient(0, hy, 0, H); gr.addColorStop(0, SEE[dp][0]); gr.addColorStop(1, SEE[dp][1]); g.fillStyle = gr; g.fillRect(0, hy, W, H - hy);
    const reihen = 22;
    for (let i = 0; i < reihen; i++) {
      const p = ((i + t * 1.6) % reihen) / reihen, d = p * p, y = hy + (H - hy) * d, amp = (1 + d * 9) * rau, lang = 30 + d * 160;
      g.strokeStyle = `rgba(255,255,255,${.08 + d * .35 * Math.min(1, rau + .3)})`; g.lineWidth = .6 + d * 2.4;
      g.beginPath(); for (let x = -10; x <= W + 10; x += 8) { const yy = y + Math.sin(x / lang * 6.283 + i * 1.7 + uhr * 1.3) * amp; x === -10 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke();
    }
    /* Rote Tonne an Backbord: kommt näher, bei der Frage hält alles an */
    /* Tonne: kommt näher und bleibt dann querab, bis die Ansicht wechselt. F.tonne = {farbe: 'rot'|'gruen', seite: 'bb'|'stb', ab}; ohne Angabe die alte rote Tonne an Backbord */
    const T = F.tonne && typeof F.tonne === 'object' ? F.tonne : {farbe: 'rot', seite: 'bb', ab: 7, alt: true};
    const tp = T.alt ? (t - 7) / 11 : Math.min(.82, (t - (T.ab == null ? .3 : T.ab)) / 3);
    if (F.tonne !== false && tp > 0 && tp < 1.15) {
      const d = tp * tp, sx = T.seite === 'stb' ? 1 : -1, x = W / 2 + sx * (W * .06 + W * .42 * d), y = hy + (H - hy) * d * .92, s = 3 + 34 * d, wip = Math.sin(uhr * 2) * rau * 2 * d;
      g.save(); g.translate(x, y + wip);
      if (T.farbe === 'gruen') { g.fillStyle = '#2e8b3e'; g.beginPath(); g.moveTo(0, -s * 1.5); g.lineTo(s * .55, 0); g.lineTo(-s * .55, 0); g.closePath(); g.fill(); g.fillStyle = '#1f6a2c'; g.fillRect(-s * .55, -s * .15, s * 1.1, s * .15); }
      else { g.fillStyle = '#c8322a'; g.fillRect(-s * .45, -s * 1.3, s * .9, s * 1.3); g.fillStyle = '#9e241e'; g.fillRect(-s * .45, -s * 1.3, s * .9, s * .18); }
      if (T.nr) { g.fillStyle = '#fff'; g.font = `bold ${Math.max(8, s * .45)}px sans-serif`; g.textAlign = 'center'; g.fillText(T.nr, 0, -s * .45); }
      g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(-s * .6, 0, s * 1.2, Math.max(1, s * .08)); g.restore();
    }
    /* Kielwasser */
    const bx = W / 2, by = H - 40;
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(bx - 28, by + 6); g.lineTo(bx - 110, H + 4); g.moveTo(bx + 28, by + 6); g.lineTo(bx + 110, H + 4); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 14; i++) { const q = ((i * 37 + uhr * 60) % 90) / 90; g.beginPath(); g.arc(bx + (i % 2 ? 1 : -1) * (20 + q * 70) + Math.sin(i + uhr) * 4, by + 8 + q * 40, 2 + q * 3, 0, 6.3); g.fill(); }
    /* Gischt bei rauer See */
    if (rau > .7 && !F.halt && Math.random() < rau * .25) F.gischt.push({x: bx + (Math.random() < .5 ? -1 : 1) * (30 + Math.random() * 20), y: by - 46, vx: (Math.random() - .5) * 60, vy: -40 - Math.random() * 60, l: 1});
    F.gischt = F.gischt.filter(p => (p.l -= .03) > 0); g.fillStyle = 'rgba(255,255,255,.8)';
    F.gischt.forEach(p => { p.x += p.vx * .016; p.y += p.vy * .016; p.vy += 4; g.beginPath(); g.arc(p.x, p.y, 2.2 * p.l + .5, 0, 6.3); g.fill(); });
    /* Das eigene Motorboot von hinten, es schaukelt mit der See */
    g.save(); g.translate(bx, by + Math.sin(uhr * 1.6) * rau * 4); g.rotate(Math.sin(uhr * 1.1) * rau * .05);
    g.fillStyle = '#f7f3ea'; g.strokeStyle = '#2b2b2b'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(-58, -30); g.lineTo(58, -30); g.lineTo(48, 8); g.lineTo(-48, 8); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#1f4e79'; g.fillRect(-55, -18, 110, 6);
    g.fillStyle = '#2b2b2b'; g.font = 'bold 10px Nunito, sans-serif'; g.textAlign = 'center'; g.fillText(((S.boat && S.boat.name) || 'SKIPPER').toUpperCase().slice(0, 14), 0, 2);
    g.fillStyle = '#e9e2d2'; g.beginPath(); g.moveTo(-38, -30); g.lineTo(-30, -58); g.lineTo(30, -58); g.lineTo(38, -30); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = dp === 'nacht' ? '#f5d77a' : '#9cc8e4'; g.fillRect(-24, -52, 48, 14); g.strokeRect(-24, -52, 48, 14);
    g.strokeStyle = '#2b2b2b'; g.beginPath(); g.moveTo(0, -58); g.lineTo(0, -82); g.stroke();
    g.fillStyle = dp === 'nacht' || dp === 'abend' ? '#fff8d6' : '#ddd'; g.beginPath(); g.arc(0, -84, 3, 0, 6.3); g.fill();
    g.fillStyle = '#555'; g.fillRect(-6, 8, 12, 12);
    g.restore();
    /* Regen und Nebel */
    if (wx === 'regen' || wx === 'sturm') { g.strokeStyle = 'rgba(220,230,240,.45)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 60; i++) { const x = (i * 53 + uhr * 300) % W, y = (i * 91 + uhr * 700) % H; g.moveTo(x, y); g.lineTo(x - 4, y + 12); } g.stroke(); }
    if (wx === 'nebel') { gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(235,238,240,.85)'); gr.addColorStop(.5, 'rgba(235,238,240,.6)'); gr.addColorStop(1, 'rgba(235,238,240,.15)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  }

  /* ---------- Rundgang 1 „Willkommen an Bord“ (H5, M4): Szene unten im Bild, die Crew zeigt die Orte ---------- */
  async function rundgang1() {
    await laden();
    document.querySelectorAll('.rgpanel').forEach(x => x.remove());
    const p = document.createElement('div'); p.className = 'card rgpanel'; document.body.appendChild(p);
    const aus = () => document.querySelectorAll('.rgblink').forEach(x => x.classList.remove('rgblink'));
    SZENE.schutz = true; S.tour = {...(S.tour || {}), boat: true, cabin: true};   /* der Rundgang ersetzt die alte Tour */
    try {
      await SZENE.spiele(D.rundgang1, {box: p, art: 'local', aktionen: {zeige: async s => {
        aus(); if (s.tab && tab !== s.tab) { lernHeim = null; setTab(s.tab); await new Promise(r => setTimeout(r, 400)); }
        const z = document.querySelector(s.ziel); if (z) { z.classList.add('rgblink'); z.scrollIntoView({behavior: 'smooth', block: 'center'}); }
      }}});
    } finally { SZENE.schutz = false; aus(); p.remove(); S.rundgang1 = true; save(); }
  }
  return {oeffnen, spielen, laden, zeichne, rundgang1, stopLauf};
})();
