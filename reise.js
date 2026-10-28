/* Die Reise am Kartentisch (VISION.md H3, M7, M8, M10): Probe-Etappe zum Durchspielen.
   Nachgeladen über reiseOeffnen() (index.html). Daten in data/reise.json (Sätze der Crew sind Platzhalter, B164).
   Ablauf einer Etappe: Tagesbesprechung → Törnplanung → Kajütenfunk → Fahrt → Knoten-Station → Abendrunde → Logbuch.
   Jeder Teil ist einzeln spielbar und wird abgehakt. Gesprochen wird über SZENE (szene.js) mit der Gratis-Stimme.
   Spielstand: S.reise {etappe, teile: {teilId: datum}, log: [{d, etappe, titel, ergebnis}], ort} (Standard beim ersten Öffnen, R7). */
window.REISE = (() => {
  let D = null;
  const laden = () => D ? Promise.resolve(D) : fetch('data/reise.json?v=' + window.__ver).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(j => (D = j));
  function stand() {
    if (!S.reise || typeof S.reise !== 'object') S.reise = {};
    const r = S.reise; r.etappe = r.etappe || D.etappen[0].id; r.teile = r.teile || {}; r.log = r.log || []; r.wahl = r.wahl || {};
    return r;
  }
  const etappe = () => D.etappen.find(e => e.id === stand().etappe) || D.etappen[0];
  const naechster = e => e.teile.find(t => !stand().teile[t.id]);
  const heute = () => new Date().toISOString().slice(0, 10);
  function erledigt(id) { stand().teile[id] = heute(); save(); }

  /* ---------- Kartentisch von oben ---------- */
  function karteSVG(e) {
    const k = D.karte, r = stand(), ort = r.teile.fahrt ? e.nach : e.von;
    const pt = id => k.haefen.find(h => h.id === id);
    const a = pt(e.von), b = pt(e.nach), boot = pt(ort);
    const wasser = k.wasser.map(p => p.join(',')).join(' ');
    return `<svg class="reisekarte" viewBox="0 0 400 280" role="img" aria-label="${esc(k.titel)}">
      <rect width="400" height="280" rx="10" fill="#f3e6c4"/>
      <path d="M0 40 Q80 10 160 30 T400 0 L400 0 L0 0Z" fill="#e7d6ab"/>
      <polyline points="${wasser}" fill="none" stroke="#8cc3dc" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="${wasser}" fill="none" stroke="#a9d4e6" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#b5452f" stroke-width="2.5" stroke-dasharray="6 5"/>
      ${k.haefen.map(h => `<g><circle cx="${h.x}" cy="${h.y}" r="5" fill="${h.id === e.nach || h.id === e.von ? '#b5452f' : '#5b4a33'}"/><text x="${h.x > 300 ? h.x - 8 : h.x + 8}" y="${h.y + (h.y < 40 ? 16 : -6)}" text-anchor="${h.x > 300 ? 'end' : 'start'}" font-size="13" font-family="Nunito, sans-serif" fill="#3a2c1b">${esc(h.name)}</text></g>`).join('')}
      <g class="spielfigur" transform="translate(${boot.x - 22} ${boot.y - 26})"><path d="M2 14 L16 14 L13 20 L5 20Z" fill="#fff" stroke="#3a2c1b"/><path d="M9 2 L9 14 M9 3 L15 12 L9 12" fill="#f6d27a" stroke="#3a2c1b"/></g>
      <text x="10" y="272" font-size="10" fill="#7a6648" font-family="Nunito, sans-serif">${esc(k.titel)}</text>
      <g transform="translate(372 240)"><circle r="16" fill="none" stroke="#7a6648"/><path d="M0 -14 L4 0 L0 14 L-4 0Z" fill="#7a6648"/><text y="-19" font-size="10" text-anchor="middle" fill="#7a6648">N</text></g>
    </svg>`;
  }
  function oeffnen(kippen = true) {
    return laden().then(() => {
      subScreen(); place = 'reise'; returnTo = 'cabin'; window.scrollTo(0, 0);
      const e = etappe(), r = stand(), n = naechster(e);
      app.innerHTML = `<div class="topbar"><button class="btn small ghost" id="rauf">↑ Aufstehen</button><span class="tag">Kartentisch</span><span></span></div>
        <div class="tischplatte ${kippen ? 'kippt' : ''}">${karteSVG(e)}</div>
        <div class="card"><h2 style="margin:0 0 4px">${esc(e.titel)}</h2><p class="small muted" style="margin:0 0 8px">${e.sm} Seemeilen · Probe-Etappe: Die Sätze der Crew sind Platzhalter, sie werden mit der Story neu geschrieben.</p>
          <ol class="path etappenteile">${e.teile.map(t => `<li class="${r.teile[t.id] ? 'done' : t === n ? 'now' : ''}"><button class="linkbtn" data-teil="${t.id}"><span class="tick" aria-hidden="true">${r.teile[t.id] ? '✓' : t.ico}</span> ${esc(t.name)}</button></li>`).join('')}</ol>
          ${n ? `<button class="btn lamp wide" id="rweiter">▶ Weiter: ${esc(n.name)}</button>` : `<p style="margin:8px 0"><b>⚓ Etappe geschafft.</b> Die nächste Etappe kommt mit der echten Reise.</p><button class="btn ghost wide" id="rneu">🔁 Probe-Etappe nochmal</button>`}
        </div>
        ${r.log.length ? `<div class="card"><h3 style="margin-top:0">📓 Logbuch der Reise</h3>${r.log.slice(-5).reverse().map(l => `<p class="small" style="margin:0 0 6px"><b>${esc(l.d)}</b> · ${esc(l.titel)}<br>${esc(l.ergebnis)}</p>`).join('')}</div>` : ''}`;
      AUD.sfx('blaettern', {vol: .4});
      $('#rauf').onclick = () => { AUD.click(); setTab('cabin'); };
      app.querySelectorAll('[data-teil]').forEach(b => b.onclick = () => { AUD.click(); teil(b.dataset.teil); });
      const w = $('#rweiter'); if (w) w.onclick = () => { AUD.unlock(); AUD.click(); teil(n.id); };
      const nz = $('#rneu'); if (nz) nz.onclick = () => { r.teile = {}; save(); oeffnen(false); };
    });
  }

  /* ---------- Teile ---------- */
  function szenenSeite(titel) {
    subScreen(); place = 'reise';
    app.innerHTML = `<div class="topbar"><button class="btn small ghost" id="rzur">← Kartentisch</button><span class="tag">${esc(titel)}</span><span></span></div><div class="card" id="szbox"></div>`;
    $('#rzur').onclick = () => { SZENE.stop(); oeffnen(false); };
    return $('#szbox');
  }
  /* Amtliche Fragen der Abendrunde: die wackligsten fälligen, sonst neue (nur Ankreuzfragen) */
  function abendFragen() {
    const mc = q => q && q.kind !== 'open' && q.a && q.a.length === 4;
    let l = (typeof faellig === 'function' ? faellig() : []).filter(mc);
    if (l.length < 3) l = l.concat(shuffle(Q.filter(q => mc(q) && !st(q.n))).slice(0, 3 - l.length));
    if (l.length < 3) l = l.concat(shuffle(Q.filter(mc)).slice(0, 3 - l.length));
    return l.slice(0, 3);
  }
  async function szene(id, titel) {
    const e = etappe(), box = szenenSeite(titel);
    const fr = id === 'abend' ? abendFragen() : [];
    let fi = 0;
    const res = await SZENE.spiele(e.szenen[id], {box, art: 'local', frage: () => fr[fi++]});
    Object.assign(stand().wahl, res.wahlen);
    erledigt(id);
    return res;
  }
  async function teil(id) {
    await nachladen('szene.js');
    const e = etappe(), t = e.teile.find(x => x.id === id); if (!t) return;
    if (id === 'fahrt') return fahrt(e);
    if (id === 'logbuch') return logbuch(e);
    const res = await szene(id, t.name);
    if (place !== 'reise') return;
    const w = res.wahlen;
    if (id === 'planung' && w.navi === 'navi') return navSchool();
    if (id === 'folge' && w.hoeren === 'ja') return nachladen('kurs.js').then(() => KURS.oeffnen('probe')).catch(() => { toast('Der Kajütenfunk ließ sich nicht laden.'); oeffnen(false); });
    if (id === 'knoten' && w.knoten === 'ja') return loadKnoten().then(() => KNOTEN.zeige('palstek')).catch(() => { toast('Das Knotenbrett ließ sich nicht laden.'); oeffnen(false); });
    oeffnen(false);
  }
  function logbuch(e) {
    const r = stand(), w = r.wahl;
    const richtig = ['f1', 'f2', 'f3'].filter(k => w[k] === 'richtig').length;
    const ergebnis = `${e.sm} sm gefahren · Abendrunde ${richtig} von 3 richtig${w.hoeren === 'ja' ? ' · Kajütenfunk gehört' : ''}${w.knoten === 'ja' ? ' · Palstek angesehen' : ''}`;
    r.log.push({d: heute(), etappe: e.id, titel: e.titel, ergebnis});
    erledigt('logbuch');
    AUD.sfx('bleistift', {vol: .5, dur: .9});
    toast('Ins Logbuch eingetragen.');
    oeffnen(false);
  }

  /* ---------- Fahrt-Szene: Blick von hinten auf das eigene Boot (M10, Nutzer 28.10.2026) ---------- */
  const HIMMEL = {morgen: ['#f2b98a', '#bfe0f0'], tag: ['#7fbde6', '#dff1fb'], abend: ['#ee935a', '#7b98c2'], nacht: ['#0b1730', '#24406b']};
  const SEE = {morgen: ['#6c97b3', '#2f5d7c'], tag: ['#4f9cc4', '#1f5f86'], abend: ['#58789b', '#2a4462'], nacht: ['#1b2f4d', '#0a1528']};
  const RAU = {schoen: .45, windig: .85, sturm: 1.35, regen: .55, nebel: .3};
  function fahrt(e) {
    subScreen(); place = 'reise';
    const wx = weatherToday(), dp = dayPart(), rau = RAU[wx] || .5;
    app.innerHTML = `<div class="topbar"><button class="btn small ghost" id="rzur">← Kartentisch</button><span class="tag">Fahrt · ${esc(WX_NAMES[wx] || '')}</span><button class="btn small ghost" id="rschnell" aria-pressed="false">⏩ 2×</button></div>
      <div class="fahrtbild"><canvas id="fahrtcv" aria-label="Fahrt von hinten auf das eigene Boot"></canvas><div class="fahrtszene card" id="szbox"></div></div>
      <button class="btn ghost wide" id="rskip" style="margin-top:8px">Fahrt überspringen</button>`;
    const cv = $('#fahrtcv'), g = cv.getContext('2d'), box = $('#szbox');
    const groesse = () => { const w = cv.clientWidth || 360, h = Math.min(440, Math.round(window.innerHeight * .55)); cv.width = w * devicePixelRatio; cv.height = h * devicePixelRatio; cv.style.height = h + 'px'; g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); return {w, h}; };
    let {w: W, h: H} = groesse();
    const F = {t: 0, tempo: 1, halt: false, aus: false, tonne: -1, gefragt: false, ende: 26, gischt: []};
    AUD.loop('motorLauf', .25); AUD.playMusic(null);
    let last = performance.now();
    const schritt = now => {
      if (F.aus) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (!F.halt) F.t += dt * F.tempo;
      zeichne(g, W, H, F, dp, wx, rau, now / 1000);
      if (!F.halt && !F.gefragt && F.t > 13.5) { F.gefragt = true; F.halt = true; frage(); }
      if (F.t >= F.ende && !F.fertig) { F.fertig = true; fertig(); }
      requestAnimationFrame(schritt);
    };
    const ende = () => { F.aus = true; AUD.loop('motorLauf', 0); SZENE.stop(); };
    const zurueck = () => { ende(); oeffnen(false); };
    $('#rzur').onclick = zurueck;
    $('#rschnell').onclick = () => { F.tempo = F.tempo === 1 ? 2 : 1; $('#rschnell').setAttribute('aria-pressed', F.tempo === 2); };
    $('#rskip').onclick = () => { erledigt('fahrt'); zurueck(); };
    window.addEventListener('resize', () => { if (!F.aus) ({w: W, h: H} = groesse()); });
    async function frage() {
      const r = await SZENE.spiele([e.szenen.fahrt_aufgabe], {box, art: 'local', ueberspringbar: false});
      Object.assign(stand().wahl, r.wahlen); box.innerHTML = ''; F.halt = false;
    }
    async function fertig() {
      F.halt = true;
      await SZENE.spiele(e.szenen.fahrt_nach, {box, art: 'local', ueberspringbar: false});
      erledigt('fahrt'); if (place === 'reise' && !F.aus) zurueck();
    }
    (async () => { await SZENE.spiele(e.szenen.fahrt_vor, {box, art: 'local', ueberspringbar: false}); box.innerHTML = ''; requestAnimationFrame(schritt); })();
  }
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
    if (tp > 0 && tp < 1.15) {
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

  return {oeffnen, teil, laden, zeichne};
})();
