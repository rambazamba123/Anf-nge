/* Skipper – Deck, Happen, Rennen, Statistik, Kajüte und Kajütenfunk-Start (v5.62, Leitfaden Fassung 4, Nutzer 12.11.2026).
   Zeichnungen aus szenerie.js. Nutzt Funktionen aus index.html (todayPath, fragenStand, charMenu …), deshalb erst nach dem Start aufrufen.
   Spielstand: neu S.cfg.kurs.harms (Harms am Ende, Standard an), S.deckTitel (Titel über den Happen) und S.zuletztDa (Tag des letzten Besuchs); alle ohne Pflicht (R7). */
(function () {
  const Z = () => window.SZENERIE;
  const ic = (k, cls = 'dic') => Z().SYM[k].replace('<svg ', `<svg class="${cls}" aria-hidden="true" `);
  const fig = (w, x, fuss, h) => charSVG(w).replace(/^<svg class="ch\s*"/, `<svg class="ch" x="${(x - h * .34).toFixed(1)}" y="${(fuss - h).toFixed(1)}" width="${(h * 100 / 147).toFixed(1)}" height="${h}"`);
  const gesicht = (w, px) => `<span class="dges" style="width:${px}px;height:${px}px">${charSVG(w).replace(/^<svg class="ch\s*"/, '<svg class="ch" style="position:absolute;width:139%;left:-19.5%;top:-22%"')}</span>`;
  const harmsInnen = () => charSVG('kroeger').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  let stopHarms = null;

  /* Stimmung: bis die Geschichte sie setzt, aus App-Wetter und Tageszeit */
  const stimmung = () => { try { return Z().stimmungAus(dayPart(), weatherToday()); } catch (e) { return 'fahrt'; } };

  /* ---------- Rennen: eine Spur, zwei Boote (wie courseCard) ---------- */
  function rennen() {
    const start = S.start || (S.start = today(), save(), S.start), LEAD = .15, iso = examIsoOf(S.course);
    if (!iso) return `<button class="drennen" id="drennen"><span class="drk"><b>Wann ist deine Prüfung?</b><span>Termin eintragen</span></span><span class="drspur"><span class="drwasser"></span><span class="drstart">🏁</span><span class="drziel">${Z().miniHarms(harmsInnen(), 50)}</span></span></button>`;
    const [y, m, d] = iso.split('-').map(Number), ex = dayNum(new Date(y, m - 1, d)), end = Math.max(today() + 1, ex), span = Math.max(1, end - start);
    const pos = t => LEAD + (1 - LEAD) * Math.min(1, Math.max(0, (t - start) / span)), pruef = pos(today()), du = pos(ex) * fragenStand(S.course).v;
    const tage = Math.round((pruef - du) / (1 - LEAD) * span), left = Math.max(0, ex - today());
    const lage = tage > 0 ? `${tage} ${tage === 1 ? 'Tag' : 'Tage'} zurück` : tage < 0 ? `${-tage} ${tage === -1 ? 'Tag' : 'Tage'} voraus` : 'gleichauf';
    const segel = (c, label) => `<svg viewBox="0 0 26 26" width="30" height="30" role="img" aria-label="${label}"><path d="M13 3v15M13 4l7 11h-7z" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><path d="M4 18h18l-3 4H7z" fill="${c}"/></svg>`;
    return `<button class="drennen" id="drennen"><span class="drk"><b>${left === 0 ? 'Heute ist Prüfung' : `Noch ${left} ${left === 1 ? 'Tag' : 'Tage'} bis zur Prüfung`}</b><span>${lage}</span></span>
      <span class="drspur"><span class="drwasser"></span><span class="drstart">🏁</span><span class="drziel">${Z().miniHarms(harmsInnen(), 50)}</span>
        <span class="drbt" style="--p:${pruef.toFixed(3)}">${segel('#8a96a3', 'Prüfungsboot')}</span><span class="drbt du" style="--p:${du.toFixed(3)}">${segel('#e8a33c', 'Dein Boot')}</span></span>
      <span class="drl"><span><i style="background:#e8a33c"></i>Du (Prüfungsreife ${Math.round(fragenStand(S.course).v * 100)} %)</span><span><i style="background:#8a96a3"></i>Prüfungsboot</span></span></button>`;
  }

  /* ---------- Happen ---------- */
  const TITEL = ['Vier Happen für heute', 'Deine Tagesration', 'Heute auf dem Zettel', 'Vier Häppchen bis zum Kaffee', 'Kleine Wache für heute'];
  const SATZ = {
    nachholen: ['smilla', 'Erst das Nachholen. Die Geschichte ist schon weiter als du.'],
    plan: ['smilla', 'Läuft. Vier Happen, dann gibt’s Kaffee.'],
    pruefung: ['smilla', 'Nicht mehr lange bis Harms. Ab jetzt nur noch Wackelkandidaten.'],
    zurueck: ['hinnerk', 'Moin. Lange nicht gesehen. Wir fangen leicht an.'],
    gruen: ['hinnerk', 'Alles grün. Dann bleibt’s so. Kurz was auffrischen.']};
  const DREH = ['Na gut, neue Mischung.', 'Noch mal? Wählerisch heute.', 'Schluss mit Würfeln. Die vier nehmen wir.'];
  const NAME = {knoten: 'Knotenkunde', navi: 'Navigation', praxis: 'Praxis / Manöver', licht: 'Lichterkunde'};
  const fehlt = () => toast('Das ließ sich nicht laden. Prüf dein Internet.');
  /* Happen aus dem Tagesplan (todayPath) und Ergänzungen; Nachholen = viele fällige Wiederholungen */
  function pool() {
    const p = todayPath(), out = [], due = Q.filter(q => isDue(q.n)).length;
    p.filter(s => !s.done).forEach(s => {
      if (s.id === 'review') out.push({a: 'frage', t: due >= 12 ? `${Math.min(BLOCK, due)} Fragen nachholen` : 'Wiederholen', prio: due >= 12, run: s.run});
      else if (s.id === 'unit' || s.id === 'review2') out.push({a: 'frage', t: /^Neu/.test(s.label) ? 'Neue Fragen' : /Wackel|Festigen/.test(s.label) ? 'Wackelkandidaten' : 'Weiterlernen', run: s.run});
      else if (s.id === 'praxis' || s.id === 'praxis2') out.push({a: /Knoten/.test(s.label) ? 'knoten' : /Navigation/.test(s.label) ? 'navi' : 'praxis', run: s.run});
      else if (s.id === 'extra') out.push(/Harms/.test(s.label) ? {a: 'frage', t: 'Probeprüfung', run: s.run} : {a: 'funk', t: 'Eine Folge hören', run: () => funkStart()}); });
    const kn = KNOTEN_IDS.find(k => knotenWert(k) < 1) || KNOTEN_IDS[today() % KNOTEN_IDS.length];
    const extra = [{a: 'knoten', run: () => loadKnoten().then(() => KNOTEN.zeige(kn)).catch(fehlt)}, {a: 'navi', run: () => navi7Oeffnen()}, {a: 'praxis', run: () => maneuverGame()}, {a: 'licht', run: () => lightsGame()},
      {a: 'frage', t: 'Wackelkandidaten', run: () => extraRound({doneLabel: 'Zurück an Deck', onDone: () => setTab('deck')})}];
    return {haupt: out, extra};
  }
  function lage(haupt) {
    if (haupt.some(h => h.prio)) return 'nachholen';
    const left = daysLeft(); if (left != null && left <= 10) return 'pruefung';
    if (warWeg) return 'zurueck';
    if (!wackelig().length && !Q.filter(q => isDue(q.n)).length && Q.some(q => st(q.n))) return 'gruen';
    return 'plan';
  }
  const eindeutig = l => { const seen = new Set(); return l.filter(h => { const id = h.a + (h.t || ''); if (seen.has(id)) return false; seen.add(id); return true; }); };
  const karte = h => !h ? '<div class="dhp leer"></div>' : `<button class="dhp${h.prio ? ' prio' : ''}">${ic(h.a)}<b>${h.t || NAME[h.a]}</b></button>`;
  let spins = 0, dreht = false, aktuell = [], satzJetzt = null, warWeg = null;

  function happen() {
    subScreen(); place = 'deck';
    const {haupt, extra} = pool(), lg = lage(haupt);
    if (!aktuell.length) aktuell = eindeutig(haupt.concat(extra)).slice(0, 4);
    const [wer, satz] = SATZ[lg];
    app.innerHTML = `<div class="dseite dhappen"><div class="dkopf"><button class="dzur" id="dzur" aria-label="Zurück an Deck">${ic('zurueck')}</button></div>
      <div class="dsag">${gesicht(wer, 44)}<span id="dsatz">„${satzJetzt || satz}“</span></div>
      <div class="dhpl" id="dhpl">${aktuell.map(karte).join('')}</div>
      <div class="drad"><button id="drad" aria-label="${spins >= 3 ? 'Rad: heute nicht mehr' : 'Rad drehen: neue Happen'}">${Z().rad(Math.min(1, spins / 3))}</button></div></div>`;
    $('#dzur').onclick = () => { AUD.click(); spins = 0; aktuell = []; satzJetzt = null; setTab('deck'); };
    app.querySelectorAll('.dhp:not(.leer)').forEach((b, i) => b.onclick = () => { AUD.unlock(); AUD.click(); lernHeim = 'deck'; const h = aktuell[i]; spins = 0; aktuell = []; satzJetzt = null; h.run(); });
    app.querySelector('.dsag .dges').onclick = () => VOX.say(wer, satzJetzt || satz, 'fixed');
    $('#drad').onclick = () => drehen(haupt, extra, wer);
  }
  function drehen(haupt, extra, wer) {
    if (spins >= 3 && !dreht) { AUD.sfx('falsch', {vol: .35}); const b = $('#drad'); if (b) { b.classList.remove('nein'); void b.offsetWidth; b.classList.add('nein'); } return; }
    if (dreht) return; dreht = true; AUD.unlock(); AUD.sfx('ratsche', {vol: .3});
    const g = app.querySelector('.radd'), pf = app.querySelector('.pfeile'), liste = $('#dhpl'), t0 = performance.now(), dauer = 3400, alle = eindeutig(haupt.concat(extra));
    if (pf) pf.style.opacity = 0;
    let w = 0, letzt = 0, last = t0;
    const mischen = leer => { const fest = alle.filter(h => h.prio), rest = alle.filter(h => !h.prio).sort(() => Math.random() - .5).slice(0, 4 - fest.length), neu = fest.concat(rest).sort(() => Math.random() - .5); aktuell = neu; return leer ? neu.map(h => Math.random() < .35 ? null : h) : neu; };
    const schritt = t => { if (!liste.isConnected) { dreht = false; return; } const k = Math.min(1, (t - t0) / dauer), v = k < .45 ? 40 + 1400 * (k / .45) ** 2 : 1440 * (1 - (k - .45) / .55) ** 2; w += v * (t - last) / 1000; last = t; if (g) g.style.transform = `rotate(${w}deg)`;
      if (v > 420 && t - letzt > 85) { letzt = t; liste.innerHTML = mischen(true).map(karte).join(''); }
      if (k < 1) requestAnimationFrame(schritt); else { mischen(false); dreht = false; spins++; satzJetzt = DREH[spins - 1]; AUD.click(); happen(); } };
    requestAnimationFrame(schritt);
  }

  /* ---------- Statistik: zwei Prüfungen, je zwei Reiter ---------- */
  let reiter = 'theorie';
  function statistik() {
    subScreen(); place = 'deck';
    const zeile = (t, n, ges, sitzt, txt) => `<div class="dkat"><span class="dkz"><b>${esc(t)}</b><span>${txt || `${sitzt} sitzen · ${ges} gesehen · ${n}`}</span></span><span class="dbar"><i style="width:${n ? sitzt / n * 100 : 0}%;background:var(--d-dunkel)"></i><i style="width:${n ? Math.max(0, ges - sitzt) / n * 100 : 0}%;background:var(--d-gelb)"></i></span></div>`;
    let inhalt = '';
    if (reiter === 'theorie') inhalt = TOPICS.map(t => { const s = topicStats(t), f = s.f.z || {}, gesehen = s.total - (f.grau || 0); return zeile(t.name, s.total, gesehen, s.m); }).join('');
    if (reiter === 'navi') { const lek = (S.navi && S.navi.lek) || {}, nl = NAVI_LEKTIONEN[S.course] || []; inhalt = nl.length ? nl.map(l => { const x = lek[l] || {}; return zeile(l === 'L0' ? 'Grundlagen' : 'Lektion ' + l.slice(1), 1, x.n || x.erkl || x.bsp || x.gef ? 1 : 0, x.sterne ? 1 : 0, x.sterne ? 'sitzt' : x.n || x.erkl ? 'geübt' : 'offen'); }).join('') : '<p class="dleer">Für diesen Schein gibt es keine Navigationsaufgabe.</p>';
      const n7 = S.navi7 && S.navi7.ok ? Object.keys(S.navi7.ok).length : 0; inhalt += `<p class="dleer">Seekarte 7: ${n7} Aufgaben gelöst.</p>`; }
    if (reiter === 'praxis') inhalt = MAN_IDS.map(m => { const x = (S.man || {})[m] || {}; return zeile(MAN_NAMEN[m], 1, x.seen || x.ok ? 1 : 0, x.ok ? 1 : 0, x.ok ? 'sitzt' : x.seen ? 'geübt' : 'offen'); }).join('');
    if (reiter === 'knoten') inhalt = KNOTEN_IDS.map(k => { const w = knotenWert(k); return zeile(KNOTEN_NAMEN[k], 1, w > 0 ? 1 : 0, w >= 1 ? 1 : 0, w >= 1 ? 'sitzt' : w > 0 ? 'geübt' : 'offen'); }).join('');
    const r = (k, i, n) => `<button data-r="${k}" aria-pressed="${reiter === k}">${ic(i)}<span>${n}</span></button>`;
    app.innerHTML = `<div class="dseite"><div class="dkopf"><button class="dzur" id="dzur" aria-label="Zurück an Deck">${ic('zurueck')}</button></div>
      <div class="dreiter"><div class="dgrp"><small>Theorieprüfung</small><div>${r('theorie', 'frage', 'Theorie')}${r('navi', 'navi', 'Navigation')}</div></div><div class="dgrp"><small>Praktische Prüfung</small><div>${r('praxis', 'praxis', 'Praxis')}${r('knoten', 'knoten', 'Knoten')}</div></div></div>
      <div class="dstat">${inhalt}</div><button class="btn ghost wide" id="dmehr" style="margin:6px 12px 14px;width:calc(100% - 24px)">Alles zur Prüfung: Meine Prüfungen</button></div>`;
    $('#dzur').onclick = () => { AUD.click(); setTab('deck'); };
    $('#dmehr').onclick = () => { AUD.click(); lernHeim = 'deck'; meinePruefungen(); };
    app.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { AUD.click(); reiter = b.dataset.r; statistik(); });
  }

  /* ---------- Deck ---------- */
  function deck() {
    Z().stil(); if (stopHarms) stopHarms();
    /* „Lange weg“: einmal je App-Start, ob der letzte Besuch fünf oder mehr Tage her ist (S.zuletztDa, Standard leer) */
    if (warWeg === null) warWeg = !!S.zuletztDa && today() - S.zuletztDa >= 5;
    if (S.zuletztDa !== today()) { S.zuletztDa = today(); save(); }
    const st = stimmung(), {haupt} = pool(), [wer] = SATZ[lage(haupt)];
    if (S.deckTitel == null || deck.neu) { S.deckTitel = ((S.deckTitel || 0) + 1 + Math.floor(Math.random() * (TITEL.length - 1))) % TITEL.length; save(); }
    deck.neu = false;
    /* Die Szene bekommt das Format ihres Kastens: nichts wird seitlich abgeschnitten (sonst fehlt auf schmalen Handys der Motor), oben und unten gibt es mehr Himmel und Meer */
    const szeneFuer = h => { const hz = h * .55, hot = `<rect class="dhot" data-go="kajuete" x="36" y="${(hz - 20).toFixed(1)}" width="28" height="15" rx="3"/><rect class="dhot" data-go="motor" x="83" y="${(hz - 13).toFixed(1)}" width="10" height="20" rx="3"/>`; return Z().szene({h, stim: st, fig, hot}); };
    app.innerHTML = `<div class="ddeck"><div class="dszene">${szeneFuer(100)}</div>
      <button class="dempf" id="dempf">${gesicht(wer, 46)}<span><b>${TITEL[S.deckTitel]}</b></span><span class="dpf">›</span></button>
      ${rennen()}
      <button class="gear dgear" id="gear" aria-label="Einstellungen">${ic('zahn', '')}</button></div>`;
    const box = app.querySelector('.dszene'); if (box.clientWidth) { const h = Math.max(70, Math.round(100 * box.clientHeight / box.clientWidth)); if (h !== 100) box.innerHTML = szeneFuer(h); }
    $('#dempf').onclick = () => { AUD.unlock(); AUD.click(); happen(); };
    $('#drennen').onclick = () => { AUD.unlock(); AUD.click(); if (!examIsoOf(S.course)) return zieleOeffnen(() => setTab('deck')); statistik(); };
    $('#gear').onclick = () => { AUD.click(); returnTo = 'deck'; renderSettings(); };
    app.querySelectorAll('.dszene [data-go]').forEach(el => el.addEventListener('click', e => { e.stopPropagation(); AUD.unlock(); if (el.dataset.go === 'kajuete') goBelow(); else nachladen('welt.js').then(() => WELT.seite()).catch(fehlt); }));
    app.querySelectorAll('.dszene .ch[data-ch]').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); AUD.unlock(); if (CREW[g.dataset.ch]) charMenu(g.dataset.ch); }));
    requestAnimationFrame(() => setTimeout(() => app.querySelectorAll('.drbt').forEach(b => b.classList.add('da')), 150));
    const mh = app.querySelector('.miniharms'); if (mh) stopHarms = Z().harmsLeben(mh);
  }

  /* ---------- Kajüte als Panorama ---------- */
  let panoX = null, geschoben = false;
  function kajuete() {
    Z().stil();
    const lek = (S.navi && S.navi.lek) || {}, nl = NAVI_LEKTIONEN[S.course] || [], kurs = nl.length ? nl.filter(l => lek[l] && lek[l].sterne).length / nl.length : 0;
    const man = MAN_IDS.filter(m => S.man && S.man[m] && S.man[m].ok).length, kn = KNOTEN_IDS.filter(k => knotenWert(k) >= .5).length;
    app.innerHTML = `<div class="dkaj"><div class="dpano" id="dpano">${Z().kajuete({fig, stim: stimmung(), stunde: shipHour(), knoten: kn, kurs, manoever: man, gast: 'hafen'})}</div>
      ${geschoben ? '' : '<span class="dpf l" id="dpl">‹</span><span class="dpf r" id="dpr">›</span>'}
      ${!courseBucket(S.course).examSet ? `<button class="dtermin" id="cdsave">🎯 Prüfungstermin eintragen</button>` : ''}
      <button class="gear dgear" id="gear" aria-label="Einstellungen">${ic('zahn', '')}</button><p class="dkinfo" id="dkinfo"></p></div>`;
    const pa = $('#dpano'), sv = pa.querySelector('svg'), vb = sv.viewBox.baseVal, passe = () => { const h = pa.clientHeight; sv.style.height = h + 'px'; sv.style.width = (h * vb.width / vb.height) + 'px'; };
    passe(); const tischX = 205 / vb.width; pa.scrollLeft = panoX != null ? panoX : Math.max(0, pa.scrollWidth * tischX - pa.clientWidth / 2);
    const weg = () => { if (geschoben) return; geschoben = true; ['#dpl', '#dpr'].forEach(s => { const e = $(s); if (e) { e.style.opacity = 0; setTimeout(() => e.remove(), 400); } }); };
    let x0 = pa.scrollLeft; pa.onscroll = () => { panoX = pa.scrollLeft; if (Math.abs(pa.scrollLeft - x0) > 12) weg(); };
    const pl = $('#dpl'), pr = $('#dpr'); if (pl) pl.onclick = () => { weg(); pa.scrollBy({left: -pa.clientWidth * .8, behavior: 'smooth'}); }; if (pr) pr.onclick = () => { weg(); pa.scrollBy({left: pa.clientWidth * .8, behavior: 'smooth'}); };
    let d = null; pa.onpointerdown = e => { if (e.pointerType !== 'mouse') return; d = {x: e.clientX, s: pa.scrollLeft, moved: false}; };
    pa.onpointermove = e => { if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) d.moved = true; pa.scrollLeft = d.s - dx; };
    pa.onpointerup = () => setTimeout(() => { d = null; }, 0);
    pa.addEventListener('click', e => { if (d && d.moved) { e.stopPropagation(); e.preventDefault(); } }, true);
    const cd = $('#cdsave'); if (cd) cd.onclick = () => zieleOeffnen(() => setTab('cabin'));
    $('#gear').onclick = () => { AUD.click(); returnTo = 'cabin'; renderSettings(); };
    const info = t => { const i = $('#dkinfo'); if (i) { i.textContent = t; clearTimeout(info.t); info.t = setTimeout(() => { i.textContent = ''; }, 2600); } };
    const TUN = {tel: () => harmsKommt(), knoten: () => knotenBrett(), navi: () => { AUD.sfx('bleistift', {vol: .5, dur: .9}); navSchool(); }, buch: () => meinePruefungen(), praxis: () => maneuverGame(), karte: () => hoerreiseWahl(),
      hocker: () => funkStart(), funk: () => info('Das Funkgerät kommt später, wenn du den Funkschein machst.'), tuer: () => setTab('deck'), bull1: () => setTab('deck'), bull2: () => setTab('deck'), bull3: () => setTab('deck'), bull4: () => setTab('deck'),
      glocke: el => startEgg('glocke', el),
      /* Barometer dreimal klopfen: das Glas fällt, Nebel zieht für ein paar Minuten auf (Egg wie früher) */
      baro: el => { const now = Date.now(); baro.t = (baro.t || []).filter(t => now - t < 4000).concat(now); const nd = el.querySelector('.bnadel'); if (nd) nd.style.transform = `rotate(${-baro.t.length * 35}deg)`;
        if (baro.t.length >= 3) { baro.t = []; wxOverride('nebel', 6 * 60000); foundEgg('barometer'); sayEgg('barometer').then(() => { if (document.querySelector('.dkaj')) kajuete(); }); }
        else setTimeout(() => { if (nd && !(baro.t || []).length) nd.style.transform = ''; }, 4200); }};
    pa.querySelectorAll('.szh[data-hot]').forEach(el => { const go = () => { AUD.unlock(); AUD.click(); (TUN[el.dataset.hot] || (() => {}))(el); }; el.addEventListener('click', go); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
    pa.querySelectorAll('.ch[data-ch]').forEach(g => g.addEventListener('click', e => { e.stopPropagation(); AUD.unlock(); if (CREW[g.dataset.ch]) charMenu(g.dataset.ch); }));
  }

  const baro = {};

  /* ---------- Kajütenfunk: nur noch „In Fahrt“, zwei Schalter ---------- */
  function funkStart(id) {
    subScreen(); place = 'kajuete';
    const k = S.cfg.kurs = S.cfg.kurs || {}, i = id ? HOERREISE.findIndex(([x]) => x === id) : hoerreiseNaechste(), [fid, titel] = HOERREISE[Math.max(0, i)];
    const zeichnen = () => {
      const reden = !!S.cfg.zuruf, harms = k.harms !== false;
      app.innerHTML = `<div class="dseite dfunk"><div class="dkopf"><button class="dzur" id="dzur" aria-label="Zurück in die Kajüte">${ic('zurueck')}</button></div>
        <div class="dftitel"><small>Folge ${Math.max(0, i) + 1}</small><b>${esc(titel)}</b></div>
        <div class="dkipp"><button data-k="reden" aria-pressed="${reden}" aria-label="hören und laut antworten">${ic('reden', '')}</button><button data-k="ohr" aria-pressed="${!reden}" aria-label="nur hören">${ic('ohr', '')}</button></div>
        <button class="dharms" id="dharms" aria-pressed="${harms}" aria-label="Harms am Ende: ${harms ? 'an' : 'aus'}">${ic('harms', '')}</button>
        <button class="dplay" id="dplay" aria-label="Folge starten">${ic('play', '')}</button>
        <div class="dfmehr"><button class="linkbtn" id="dandere">Andere Folge</button><button class="linkbtn" id="dprobe">Alte Probefolge: Schleuse mit Quirin</button></div></div>`;
      $('#dzur').onclick = () => { AUD.click(); setTab('cabin'); };
      app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { AUD.click(); S.cfg.zuruf = b.dataset.k === 'reden'; save(); zeichnen(); });
      $('#dharms').onclick = () => { AUD.click(); k.harms = !harms; save(); zeichnen(); };
      $('#dplay').onclick = () => { AUD.unlock(); AUD.click(); k.modus = 'auto'; save(); hoerreiseOeffnen(fid); };
      $('#dandere').onclick = () => { AUD.click(); hoerreiseWahl(); };
      $('#dprobe').onclick = () => { AUD.click(); nachladen('kurs.js').then(() => KURS.oeffnen('probe')).catch(fehlt); };
    };
    zeichnen();
  }

  const CSS = `:root{--d-dunkel:#2f8f4e;--d-gelb:#e9c23f;--d-lamp:#e8a33c;--d-papier:#f3e7c9;--d-tinte:#2b2118}
  .dges{display:inline-block;border-radius:50%;overflow:hidden;background:#f2c68f;position:relative;flex:none;cursor:pointer}
  .dic{width:26px;height:26px;display:block}
  .ddeck{position:relative;display:flex;flex-direction:column;margin:0 -16px -86px;padding-bottom:calc(78px + env(safe-area-inset-bottom,0px));min-height:100dvh;background:#0f2433;color:#f3e7c9}
  .ddeck .dszene{position:relative;flex:1 1 auto;min-height:46vh}.ddeck .dszene>svg{position:absolute;inset:0}.ddeck .dszene .dhot{fill:transparent;cursor:pointer}.ddeck .dszene .ch{cursor:pointer}
  .ddeck .dgear,.dkaj .dgear{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));right:10px;width:42px;height:42px;border-radius:12px;border:0;background:rgba(15,36,51,.7);color:#f3e7c9;display:grid;place-items:center;z-index:4}
  .ddeck .dgear svg,.dkaj .dgear svg{width:24px;height:24px}
  .dempf{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;margin:10px 12px 0;background:rgba(255,255,255,.07);border:1.5px solid rgba(232,163,60,.55);border-radius:16px;padding:10px 12px;color:inherit;font:inherit;text-align:left;cursor:pointer}
  .dempf b{font-family:var(--display,inherit);font-size:1.12rem}.dempf .dpf{color:var(--d-lamp);font-size:1.6rem}
  .drennen{margin:10px 12px 12px;background:#152a38;border:1px solid rgba(243,231,201,.15);border-radius:16px;padding:10px 12px;cursor:pointer;font:inherit;color:inherit;text-align:left;display:grid;gap:6px}
  .drk{display:flex;justify-content:space-between;gap:8px;font-size:.86rem}.drk b{font-family:var(--display,inherit)}.drk span{color:#f0b36a;white-space:nowrap}
  .drspur{position:relative;height:56px;display:block}.drwasser{position:absolute;left:0;right:30px;top:24px;height:20px;border-radius:10px;background:linear-gradient(90deg,#1d4a63,#28607e)}
  .drstart{position:absolute;left:2px;top:22px;font-size:.9rem}.drziel{position:absolute;right:-6px;top:0}
  .drbt{position:absolute;top:14px;left:0;transition:left 5s cubic-bezier(.25,.6,.3,1)}.drbt.da{left:calc(var(--p) * (100% - 80px))}.drbt.du{top:18px}
  .drl{display:flex;gap:12px;flex-wrap:wrap;font-size:.72rem;opacity:.75}.drl i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px;vertical-align:-1px}
  .dseite{margin:0 -16px -120px;min-height:100dvh;background:#0f2433;color:#f3e7c9;display:flex;flex-direction:column}
  .dkopf{display:flex;padding:calc(10px + env(safe-area-inset-top,0px)) 10px 0}.dzur{width:42px;height:42px;border-radius:12px;border:0;background:rgba(255,255,255,.08);color:#f3e7c9;display:grid;place-items:center;cursor:pointer}
  .dsag{display:flex;gap:10px;align-items:center;padding:8px 14px 0;font-size:.95rem}
  .dhpl{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:10px;padding:12px}
  .dhp{background:var(--d-papier);color:var(--d-tinte);border-radius:16px;border:0;display:grid;place-items:center;align-content:center;gap:10px;text-align:center;padding:10px;position:relative;cursor:pointer;font:inherit}
  .dhp .dic{width:58px;height:58px;color:#2f6f8a}.dhp b{font-family:var(--display,inherit);font-size:1.08rem;line-height:1.15}.dhp.leer{background:rgba(243,231,201,.12)}
  .dhp.prio{outline:3px solid #c0392b}.dhp.prio::before{content:"nachholen";position:absolute;top:-8px;right:8px;background:#c0392b;color:#fff;font:800 .62rem var(--body,inherit);border-radius:999px;padding:1px 6px}
  .drad{display:grid;justify-items:center;padding:6px 0 calc(14px + env(safe-area-inset-bottom,0px))}.drad button{border:0;background:none;padding:0;cursor:pointer}.drad svg{width:150px;height:150px}
  .drad .pfeile{transition:opacity .25s}.drad button.nein svg{animation:dnein .45s ease-in-out}@keyframes dnein{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
  .dreiter{display:flex;gap:8px;padding:12px 10px 0}.dgrp{flex:1;border:2px solid rgba(243,231,201,.28);border-radius:16px;padding:4px 5px 5px;display:grid;gap:3px}
  .dgrp small{font:800 .62rem var(--body,inherit);opacity:.7;text-align:center}.dgrp>div{display:flex;gap:4px}
  .dgrp button{flex:1;display:grid;justify-items:center;gap:2px;padding:6px 2px;border-radius:11px;border:1.5px solid transparent;background:transparent;color:rgba(243,231,201,.66);font:700 .7rem var(--body,inherit);cursor:pointer}
  .dgrp button[aria-pressed="true"]{border-color:var(--d-lamp);color:var(--d-lamp);background:rgba(232,163,60,.12)}
  .dstat{padding:12px;display:grid;gap:8px}.dkat{background:#152a38;border:1px solid rgba(243,231,201,.15);border-radius:12px;padding:8px 10px;display:grid;gap:4px;font-size:.84rem}
  .dkz{display:flex;justify-content:space-between;gap:8px}.dkz span{opacity:.7;white-space:nowrap}.dbar{height:9px;border-radius:5px;background:rgba(255,255,255,.08);overflow:hidden;display:flex}.dbar i{display:block;height:100%}
  .dleer{font-size:.82rem;opacity:.75;margin:4px 2px}
  .dkaj{position:relative;margin:0 -16px -86px;height:calc(100dvh - 66px);background:#2c1c11;overflow:hidden}
  .dpano{position:absolute;inset:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;touch-action:pan-x;cursor:grab}.dpano::-webkit-scrollbar{display:none}.dpano svg{display:block}
  .dpf.l,.dpf.r{position:absolute;top:50%;transform:translateY(-50%);width:34px;height:60px;display:grid;place-items:center;font:800 2rem var(--display,inherit);color:#f3e7c9;background:rgba(15,36,51,.55);cursor:pointer;transition:opacity .35s;z-index:3}.dpf.l{left:0;border-radius:0 14px 14px 0}.dpf.r{right:0;border-radius:14px 0 0 14px}
  .dtermin{position:absolute;left:10px;top:calc(10px + env(safe-area-inset-top,0px));z-index:4;border:0;border-radius:12px;padding:10px 12px;background:var(--d-lamp);color:#1a1a1a;font:800 .85rem var(--body,inherit)}
  .dkinfo{position:absolute;left:14px;right:14px;top:calc(62px + env(safe-area-inset-top,0px));margin:0;padding:10px 12px;border-radius:12px;background:rgba(15,36,51,.88);color:#f3e7c9;font-size:.86rem;z-index:4}.dkinfo:empty{display:none}
  .dfunk{align-items:center;justify-content:space-evenly;padding-bottom:20px}.dfunk .dkopf{align-self:stretch}
  .dftitel{display:grid;justify-items:center;text-align:center}.dftitel small{opacity:.7}.dftitel b{font-family:var(--display,inherit);font-size:1.6rem;line-height:1.1;padding:0 16px}
  .dkipp{display:grid;grid-template-columns:1fr 1fr;width:min(300px,86vw);border:2px solid rgba(243,231,201,.25);border-radius:999px;overflow:hidden}
  .dkipp button{height:96px;border:0;background:transparent;color:#5b6770;display:grid;place-items:center;cursor:pointer}.dkipp button svg{width:66px;height:56px}.dkipp button[aria-pressed="true"]{background:var(--d-lamp);color:#1a1a1a}
  .dharms{width:120px;height:120px;border-radius:30px;border:3px solid var(--d-lamp);background:rgba(232,163,60,.12);display:grid;place-items:center;cursor:pointer}.dharms svg{width:78px;height:78px}
  .dharms[aria-pressed="false"]{border-color:rgba(243,231,201,.2);background:transparent}.dharms[aria-pressed="false"] svg{filter:grayscale(1);opacity:.45}
  .dplay{width:108px;height:108px;border-radius:50%;border:0;background:var(--d-lamp);color:#1a1a1a;display:grid;place-items:center;cursor:pointer}.dplay svg{width:56px;height:56px;margin-left:6px}
  .dfmehr{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;font-size:.85rem}.dfmehr .linkbtn{color:#f3e7c9;opacity:.8}`;
  function stil() { if (document.getElementById('deck-css')) return; const s = document.createElement('style'); s.id = 'deck-css'; s.textContent = CSS; document.head.appendChild(s); }
  stil();
  window.DECK = {deck, happen, statistik, kajuete, funkStart, rennen, neuerBesuch: () => { deck.neu = true; }};
})();
