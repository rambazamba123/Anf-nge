/* Die Reise (VISION.md, docs/reise-konzept.md, O93–O100): ein Tag auf See = eine Folge.
   Nachgeladen über reiseOeffnen() (index.html, nach szene.js). Daten in data/reise.json (Sätze der Crew sind Platzhalter, B164).
   Kartentisch: Tisch antippen, die Seekarte 7 kippt ins Bild, darauf nur drei Felder: Morgens · Unterwegs · Abends.
   Ein Feld spielt seine Schritte der Reihe nach (Sätze, Wahl, amtliche Fragen, Navigationsaufgabe auf der Karte, Minispiel, Knoten, Logbuch).
   Alles bleibt in der Geschichte: Minispiel und Knoten kommen danach hierher zurück. Der Speicherpunkt ist die genaue Stelle.
   Modus „Mitmachen“ oder „Nur hören“ (Automodus): Die Crew löst alles laut vor, Denkpause sechs Sekunden, dann die Lösung, ohne Antippen.
   Spielstand: S.reise {pos: {tag, phase, i}, fertig: {'tag:phase': datum}, modus: 'mit'|'auto', wahl: {}, log: []} (Standard beim ersten Öffnen, R7). */
window.REISE = (() => {
  let D = null, lauf = null;
  const laden = () => D ? Promise.resolve(D) : fetch('data/reise.json?v=' + window.__ver).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(j => (D = j));
  const PHASEN = [['morgen', '☀️', 'Morgens', 'Besprechung und Navigation'], ['unterwegs', '⛵', 'Unterwegs', 'Fahrt, Anlegen, Knoten'], ['abend', '🌙', 'Abends', 'Hafen, Rückblick, Logbuch']];
  const heute = () => new Date().toISOString().slice(0, 10);
  const pause = ms => new Promise(r => setTimeout(r, ms));
  function stand() {
    if (!S.reise || typeof S.reise !== 'object') S.reise = {};
    const r = S.reise; r.fertig = r.fertig || {}; r.log = r.log || []; r.wahl = r.wahl || {}; r.modus = r.modus || 'mit';
    if (!r.pos || !D.tage.some(t => t.tag === r.pos.tag)) r.pos = {tag: D.tage[0].tag, phase: 'morgen', i: 0};
    return r;
  }
  const tagDaten = () => D.tage.find(t => t.tag === stand().pos.tag) || D.tage[0];
  const auto = () => stand().modus === 'auto';
  const fertig = (t, ph) => !!stand().fertig[t.tag + ':' + ph];
  const sprecher = w => CREW[w] ? w : (S.crew && S.crew[w]) || 'hinnerk';

  /* ---------- Seekarte 7 als Ausschnitt (SVG über dem Kartenbild; Koordinaten in PDF-Punkten) ---------- */
  function karte(t, box, extra = '') {
    const K = D.karte7, [x0, y0, x1, y1] = box, r = t.route || [], last = stand().fertig[t.tag + ':unterwegs'] ? r[r.length - 1] : r[0];
    return `<svg class="karte7" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" role="img" aria-label="${esc(K.titel)}">
      <image href="${esc(K.bild)}" x="0" y="0" width="${K.w}" height="${K.h}"/>
      ${r.length ? `<polyline points="${r.map(p => p.join(',')).join(' ')}" fill="none" stroke="#c0392b" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round"/>` : ''}
      ${last ? `<g transform="translate(${last[0]} ${last[1]})"><circle r="5" fill="#fff" stroke="#c0392b" stroke-width="1.5"/><path d="M-3 1 L3 1 L2 3 L-2 3Z M0 -3 L0 1 M0 -3 L2.5 0 L0 0" fill="#c0392b" stroke="#c0392b" stroke-width=".6"/></g>` : ''}
      ${extra}</svg>`;
  }
  const routeBox = t => { const xs = t.route.map(p => p[0]), ys = t.route.map(p => p[1]), m = 30, w = Math.max(...xs) - Math.min(...xs) + 2 * m, h = Math.max(...ys) - Math.min(...ys) + 2 * m, hh = Math.max(h, w * .62);
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2; return [cx - w / 2, cy - hh / 2, cx + w / 2, cy + hh / 2]; };

  /* ---------- Kartentisch: drei große Felder ---------- */
  function oeffnen(kippen = true) {
    return laden().then(() => {
      stopLauf(); subScreen(); place = 'reise'; returnTo = 'cabin'; window.scrollTo(0, 0);
      const r = stand(), t = tagDaten(), naechste = PHASEN.find(([p]) => !fertig(t, p));
      app.innerHTML = `<div class="topbar"><button class="btn small ghost" id="rauf">↑ Aufstehen</button><span class="tag">Kartentisch</span><span></span></div>
        <div class="tischplatte ${kippen ? 'kippt' : ''}">${karte(t, routeBox(t))}</div>
        <h2 class="rtitel">Tag ${t.tag}: ${esc(t.titel)}</h2><p class="small muted" style="margin:0 0 10px">${esc(t.von)} → ${esc(t.nach)} · ${t.sm} sm · ${esc(t.wetter)}</p>
        <div class="rfelder">${PHASEN.map(([p, ico, name, d]) => { const f = fertig(t, p), jetzt = naechste && naechste[0] === p, weiter = jetzt && r.pos.phase === p && r.pos.i > 0;
          return `<button class="rfeld ${f ? 'fertig' : ''} ${jetzt ? 'jetzt' : ''}" data-ph="${p}"><span class="rico">${f ? '✓' : ico}</span><b>${name}</b><small>${weiter ? 'Hier geht es weiter' : d}</small></button>`; }).join('')}</div>
        <div class="rmodus" role="group" aria-label="Wie willst du den Tag erleben?"><button class="chip" data-mod="mit" aria-pressed="${r.modus !== 'auto'}">✋ Mitmachen</button><button class="chip" data-mod="auto" aria-pressed="${r.modus === 'auto'}">🎧 Nur hören</button></div>
        <p class="small muted">${r.modus === 'auto' ? 'Nur hören: Der Tag läuft als Hörspiel durch, die Crew löst alles laut vor.' : 'Mitmachen: Du entscheidest, rechnest und antwortest selbst.'} Die Sätze der Crew sind Platzhalter, bis die Geschichte geschrieben ist.</p>
        ${r.log.length ? `<details class="card"><summary><b>📓 Logbuch der Reise</b></summary>${r.log.slice(-5).reverse().map(l => `<p class="small" style="margin:6px 0 0"><b>${esc(l.d)}</b> · Tag ${l.tag}: ${esc(l.text)}</p>`).join('')}</details>` : ''}`;
      AUD.sfx('blaettern', {vol: .4});
      $('#rauf').onclick = () => { AUD.click(); setTab('cabin'); };
      app.querySelectorAll('[data-ph]').forEach(b => b.onclick = () => { AUD.unlock(); AUD.click(); phase(b.dataset.ph); });
      app.querySelectorAll('[data-mod]').forEach(b => b.onclick = () => { AUD.click(); r.modus = b.dataset.mod; save(); oeffnen(false); });
    });
  }

  /* ---------- Ein Feld spielen ---------- */
  function stopLauf() { if (lauf) { lauf.aus = true; if (lauf.fahrt) lauf.fahrt.aus = true; } lauf = null; if (window.SZENE) SZENE.stop(); VOX.stop('Reise'); AUD.loop('motorLauf', 0); }
  function buehne(ph, t) {
    subScreen(); place = 'reise'; window.TOERN_STILL = true;
    const [, ico, name] = PHASEN.find(x => x[0] === ph);
    app.innerHTML = `<div class="topbar"><button class="btn small ghost" id="rzur">← Kartentisch</button><span class="tag">${ico} ${name} · Tag ${t.tag}</span><button class="chip" id="rmod" aria-pressed="${auto()}">${auto() ? '🎧 Nur hören' : '✋ Mitmachen'}</button></div>
      <div class="rbuehne" id="rbuehne">${ph === 'morgen' ? karte(t, routeBox(t)) : '<canvas id="fahrtcv" aria-label="Blick von hinten auf das eigene Boot"></canvas>'}</div>
      <div class="card rszene" id="szbox"></div>`;
    $('#rzur').onclick = () => { AUD.click(); oeffnen(false); };
    $('#rmod').onclick = () => { const r = stand(); r.modus = auto() ? 'mit' : 'auto'; save(); $('#rmod').setAttribute('aria-pressed', auto()); $('#rmod').textContent = auto() ? '🎧 Nur hören' : '✋ Mitmachen'; toast(auto() ? 'Nur hören: Ab dem nächsten Schritt läuft alles von allein.' : 'Mitmachen: Ab dem nächsten Schritt bist du dran.'); };
    if (ph !== 'morgen') lauf.fahrt = fahrtBild(t, ph);
  }
  function fahrtBild(t, ph) {
    const cv = $('#fahrtcv'); if (!cv) return null; const g = cv.getContext('2d');
    const groesse = () => { const w = cv.clientWidth || 360, h = Math.min(320, Math.round(window.innerHeight * .38)); cv.width = w * devicePixelRatio; cv.height = h * devicePixelRatio; cv.style.height = h + 'px'; g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); return [w, h]; };
    let [W, H] = groesse();
    const F = {t: 0, tempo: ph === 'abend' ? .15 : 1, halt: false, aus: false, ende: 1e9, gischt: [], tonne: false};
    const wx = t.wx || 'schoen', dp = (t.dp && t.dp[ph]) || 'tag', rau = ph === 'abend' ? .15 : ({schoen: .45, windig: .85, sturm: 1.35, regen: .55, nebel: .3}[wx] || .5);
    if (ph === 'unterwegs') AUD.loop('motorLauf', .2);
    let last = performance.now();
    const schritt = now => { if (F.aus || !cv.isConnected) { AUD.loop('motorLauf', 0); return; } const dt = Math.min(.05, (now - last) / 1000); last = now; F.t += dt * F.tempo; zeichne(g, W, H, F, dp, wx, rau, now / 1000); requestAnimationFrame(schritt); };
    requestAnimationFrame(schritt);
    return F;
  }
  async function phase(ph, weiterTag) {
    await laden(); await nachladen('szene.js');
    stopLauf();
    const r = stand(), t = tagDaten(), steps = t.phasen[ph] || [];
    if (r.pos.phase !== ph || r.pos.tag !== t.tag || fertig(t, ph)) r.pos = {tag: t.tag, phase: ph, i: 0};
    const me = lauf = {aus: false};
    buehne(ph, t);
    for (let i = r.pos.i; i < steps.length; i++) {
      if (me.aus) return;
      r.pos.i = i; save();
      await schritt(steps[i], ph, t, me);
    }
    if (me.aus) return;
    r.fertig[t.tag + ':' + ph] = heute();
    const n = PHASEN.findIndex(x => x[0] === ph), nach = PHASEN[n + 1];
    r.pos = {tag: t.tag, phase: nach ? nach[0] : 'morgen', i: 0}; save();
    stopLauf();
    /* Im Automodus läuft der ganze Tag durch, sonst zurück an den Kartentisch */
    if (auto() && nach) { await pause(800); return phase(nach[0]); }
    oeffnen(false);
  }
  /* Nach Minispiel oder Knoten wieder in die Geschichte (die Bühne wurde ersetzt) */
  function zurueckInGeschichte(ph, t, me) { if (me.aus) return; lauf = me; buehne(ph, t); window.scrollTo(0, 0); }
  async function schritt(s, ph, t, me) {
    const box = () => $('#szbox');
    if (s.wer && s.t) return SZENE.spiele([{wer: s.wer, t: auto() && s.auto ? s.auto : s.t}], {box: box(), art: 'local', ueberspringbar: false});
    if (s.wahl) {
      if (!auto()) { const res = await SZENE.spiele([s], {box: box(), art: 'local', ueberspringbar: false}); Object.assign(stand().wahl, res.wahlen); return; }
      const o = s.opts.find(x => x.empfohlen || x.ok) || s.opts[0];
      await SZENE.spiele([{wer: 'hinnerk', t: s.wahl}, {wer: 'smilla', t: o.t}], {box: box(), art: 'local', ueberspringbar: false});
      if (s.id) stand().wahl[s.id] = o.wert != null ? o.wert : o.t;
      if (o.dann) await SZENE.spiele(o.dann, {box: box(), art: 'local', ueberspringbar: false});
      return;
    }
    if (s.frage != null) return frage(s, box(), me);
    if (s.navi) return navi(s.navi, t, box(), me);
    if (s.mini) return mini(s, ph, t, me);
    if (s.knoten) return knoten(s.knoten, ph, t, me);
    if (s.logbuch) { stand().log.push({d: heute(), tag: t.tag, text: s.logbuch}); save(); AUD.sfx('bleistift', {vol: .5, dur: .9}); box().innerHTML = `<p style="margin:0">📓 <b>Ins Logbuch:</b> ${esc(s.logbuch)}</p>`; return pause(2500); }
  }
  /* Amtliche Frage: mitmachen = antworten (zählt), nur hören = vorlesen, sechs Sekunden Denkpause, Lösung */
  function abendFrage() {
    const mc = q => q && q.kind !== 'open' && q.a && q.a.length === 4, schon = new Set((lauf && lauf.gefragt) || []);
    let l = (typeof faellig === 'function' ? faellig() : []).filter(q => mc(q) && !schon.has(q.n));
    if (!l.length) l = shuffle(Q.filter(q => mc(q) && st(q.n) && !schon.has(q.n)));
    if (!l.length) l = shuffle(Q.filter(q => mc(q) && !schon.has(q.n)));
    const q = l[0]; if (q && lauf) (lauf.gefragt = lauf.gefragt || []).push(q.n); return q;
  }
  async function frage(s, box, me) {
    const q = s.frage === 'faellig' ? abendFrage() : (typeof QN !== 'undefined' && QN[s.frage]) || (typeof DATA !== 'undefined' ? DATA.find(x => x.n === s.frage) : null);
    if (!q || !q.a || q.a.length !== 4) return;
    if (!auto()) { const res = await SZENE.spiele([{frage: 1, id: s.id || 'q' + q.n}], {box, art: 'local', ueberspringbar: false, frage: () => q}); if (s.id) stand().wahl[s.id] = res.wahlen[s.id]; return; }
    const order = [0, 1, 2, 3].sort(() => Math.random() - .5);
    box.innerHTML = `<p style="margin:0 0 6px"><b>${esc(q.q)}</b></p>${order.map((k, j) => `<div class="ans" data-k="${k}"><b class="abc">${'ABCD'[j]}</b> ${esc(q.a[k])}</div>`).join('')}<div class="kdenk" id="rdenk"></div>`;
    await VOX.say(S.crew.M || 'smilla', SZENE.text(q, order), 'local'); if (me.aus) return;
    const d = $('#rdenk'); if (d) d.textContent = '🤔 Denkpause … 6 s'; AUD.ticks && AUD.ticks(6, .3); await pause(6000); if (me.aus) return;
    if (d) d.textContent = '';
    box.querySelectorAll('.ans').forEach(b => { if (b.dataset.k === '0') b.classList.add('ok'); });
    await VOX.say(S.crew.K || 'hinnerk', 'Richtig ist: ' + q.a[0], 'local'); await pause(600);
  }
  /* Navigationsaufgabe direkt auf der Seekarte 7, verbunden mit der Etappe des Tages */
  function navi(n, t, box, me) {
    const b = $('#rbuehne'), ziel = `<circle class="nziel" cx="${n.ziel[0]}" cy="${n.ziel[1]}" r="${n.radius || 12}" fill="none" stroke="#f1c40f" stroke-width="2.5"/>`;
    b.innerHTML = karte(t, n.ausschnitt || routeBox(t));
    const svg = b.querySelector('svg');
    const zeige = () => svg.insertAdjacentHTML('beforeend', ziel);
    if (auto()) { box.innerHTML = `<p style="margin:0"><b>🧭 Navigation:</b> ${esc(n.aufgabe)}</p>`; return VOX.say('smilla', n.aufgabe, 'local').then(() => { if (me.aus) return; zeige(); return VOX.say('smilla', n.auto || n.richtig, 'local'); }).then(() => pause(800)); }
    return new Promise(res => {
      let versuche = 0;
      box.innerHTML = `<p style="margin:0 0 6px"><b>🧭 Navigation (Smilla):</b> ${esc(n.aufgabe)}</p><p class="small muted" style="margin:0" id="nrueck">Tippe auf die Karte. Mit zwei Fingern kannst du zoomen.</p>`;
      VOX.say('smilla', n.aufgabe, 'local');
      svg.addEventListener('click', ev => {
        const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; const m = p.matrixTransform(svg.getScreenCTM().inverse());
        const ok = Math.hypot(m.x - n.ziel[0], m.y - n.ziel[1]) <= (n.radius || 12) * 1.4;
        svg.insertAdjacentHTML('beforeend', `<circle cx="${m.x}" cy="${m.y}" r="3" fill="${ok ? '#27ae60' : '#c0392b'}"/>`);
        if (ok) { AUD.sfx('richtig', {vol: .5}); zeige(); $('#nrueck').textContent = n.richtig; VOX.say('smilla', n.richtig, 'local').then(() => pause(500)).then(res); return; }
        versuche++; AUD.sfx('falsch', {vol: .3});
        const h = versuche >= 3 ? 'Hier ist sie. ' + n.richtig : n.hilfe;
        $('#nrueck').textContent = h; VOX.say('smilla', h, 'local');
        if (versuche >= 3) { zeige(); pause(3500).then(res); }
      });
    });
  }
  /* Minispiel als Bonus mitten in der Geschichte; danach geht es genau hier weiter */
  function mini(s, ph, t, me) {
    const m = D.minis[s.mini]; if (!m || typeof window[m.f] !== 'function') return;
    if (auto()) return SZENE.spiele([{wer: 'smilla', t: 'Die Bonusrunde ' + m.name + ' lassen wir heute aus. Die kannst du jederzeit unter Frei üben spielen.'}], {box: $('#szbox'), art: 'local', ueberspringbar: false});
    return new Promise(res => {
      $('#szbox').innerHTML = `<p style="margin:0 0 8px"><b>🎲 Bonusrunde: ${esc(m.name)}</b><br>${esc(s.text || '')}</p><div class="row"><button class="btn lamp" id="mgo">Los!</button><button class="btn ghost" id="mweg">Auslassen</button></div>`;
      $('#mweg').onclick = () => { AUD.click(); res(); };
      $('#mgo').onclick = () => {
        AUD.click(); if (lauf && lauf.fahrt) lauf.fahrt.aus = true; AUD.loop('motorLauf', 0);
        BONUS = {key: s.mini, runden: m.runden, sek: m.sek, fertig: pts => { zurueckInGeschichte(ph, t, me); toast(`Bonusrunde ${m.name}: ${pts} von ${m.max}`, 3000); res(); }};
        window[m.f]();
        setTimeout(() => ['#gback', '#quit'].forEach(sel => { const b = $(sel); if (b) b.onclick = () => bonusEnde(0); }), 80);
      };
    });
  }
  /* Knoten genau dann, wenn man ihn braucht: Animation mit Hinnerk, danach zurück in die Geschichte */
  async function knoten(id, ph, t, me) {
    if (auto()) {
      const kd = await fetch('data/knoten.json?v=' + window.__ver).then(r => r.json()).catch(() => null);
      const k = kd && (kd.knoten || kd).find && (kd.knoten || kd).find(x => x.id === id); if (!k) return;
      return SZENE.spiele([{wer: 'hinnerk', t: 'Der ' + k.name + ', Schritt für Schritt.'}].concat(k.schritte.map(x => ({wer: 'hinnerk', t: x}))), {box: $('#szbox'), art: 'local', ueberspringbar: false});
    }
    await loadKnoten();
    return new Promise(res => {
      if (lauf && lauf.fahrt) lauf.fahrt.aus = true; AUD.loop('motorLauf', 0);
      KNOTEN.zeige(id);
      const zurueck = () => { VOX.stop('Knoten'); zurueckInGeschichte(ph, t, me); res(); };
      setTimeout(() => {
        const gb = $('#gback'); if (gb) gb.onclick = zurueck;
        const ueb = $('#kueb'); if (ueb) ueb.insertAdjacentHTML('afterend', '<button class="btn" id="kgesch">⛵ Weiter in der Geschichte</button>');
        const k = $('#kgesch'); if (k) k.onclick = () => { AUD.click(); zurueck(); };
      }, 80);
    });
  }

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
    const tp = (t - 7) / 11;
    if (F.tonne !== false && tp > 0 && tp < 1.15) {
      const d = tp * tp, x = W / 2 - (W * .06 + W * .42 * d), y = hy + (H - hy) * d * .92, s = 3 + 34 * d, wip = Math.sin(uhr * 2) * rau * 2 * d;
      g.save(); g.translate(x, y + wip); g.fillStyle = '#c8322a'; g.fillRect(-s * .45, -s * 1.3, s * .9, s * 1.3); g.fillStyle = '#9e241e'; g.fillRect(-s * .45, -s * 1.3, s * .9, s * .18);
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
  return {oeffnen, phase, laden, zeichne, rundgang1, stopLauf};
})();
