/* Navi-Folge am Kartentisch (v5.65, docs/reise.md HR52, docs/navi-folge-plan.md). Nachgeladen über naviFolgeOeffnen(id) in index.html, nach brede.js.
   Abendwache: Die Crew erklärt am Kartentisch der Reisekarte Brede-Bucht, macht vor, du machst selbst; am Ende ein Test ohne Hilfe.
   Daten: data/navi-folgen.json (Drehbuch mit Schritten sag, zeige, frage, vormachen, aufgabe, test, ende; feste Sätze in „saetze“).
   Kippschalter In der App / Am Tisch mit Papierkarte (S.navifolge.ort), Sprechblasen aus (Standard) oder an (dann tippt man weiter).
   Anpassung je Fertigkeit (S.navifolge.fk[fk] {n, ok, serie}): sicher (zwei in Folge ohne Hilfe) = kein Vormachen mehr, weniger Hilfe beim Start.
   Falscher Kurs in der Geschichtsaufgabe: Die Frieda-Figur fährt ihn ab, läuft auf, ein Teil kommt ins Mängelbuch (HR54), repariert durch eine richtige Lösung.
   Spielstand S.navifolge {fk, fertig: {id: Datum}, test: {id: {ok, n, d}}, maengel: [id], ort, blasen} (Standard beim ersten Öffnen, R7). */
(function () {
  let D = null;
  const Z = {lauf: 0, folge: null, weiter: null, fehlerfahrt: false, werte: {}};
  const st = () => { const s = S.navifolge = S.navifolge || {}; s.fk = s.fk || {}; s.fertig = s.fertig || {}; s.test = s.test || {}; s.maengel = s.maengel || []; if (!s.ort) s.ort = 'app'; if (s.blasen == null) s.blasen = false; return s; };
  const K = () => BREDE.daten, f2 = v => Math.round(v * 100) / 100, pick = a => a[Math.random() * a.length | 0];
  const warte = ms => new Promise(r => setTimeout(r, ms));
  const ZIFF = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
  const ziffern = v => String(Math.round(v) % 360).padStart(3, '0').split('').map(c => ZIFF[+c]).join('-');
  const ZAHLW = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
  const ZEHN = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
  const wort = n => { n = Math.round(n); if (n < 20) return ZAHLW[n]; if (n < 100) { const e = n % 10, z = ZEHN[n / 10 | 0]; return e ? (e === 1 ? 'ein' : ZAHLW[e]) + 'und' + z : z; } if (n < 200) return 'hundert' + (n % 100 ? wort(n % 100) : ''); return wort(n / 100 | 0) + 'hundert' + (n % 100 ? wort(n % 100) : ''); };
  const komma = v => { const r = Math.round(v * 10) / 10, g = Math.floor(r), z = Math.round((r - g) * 10); return z ? `${wort(g)} Komma ${ZAHLW[z]}` : wort(g); };
  const zahl1 = v => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
  const NAMEN = {s: 'Smilla', h: "Käpt'n Hinnerk", k: 'Klabauter'};
  const cidVon = w => ({s: (S.crew && S.crew.M) || 'smilla', h: 'hinnerk', k: 'klabauter'})[w] || 'smilla';
  const nachts = () => { try { const h = shipHour(); return h >= 19 || h < 6; } catch (e) { return false; } };
  const heute = () => new Date().toISOString().slice(0, 10);

  /* ---------- Werte einer Strecke aus der Karte ---------- */
  function strecke(von, nach, fahrt) {
    const a = BREDE.punkt(von), b = BREDE.punkt(nach), kurs = BREDE.kurs(a, b), sm = BREDE.sm(a, b), v = fahrt || (K().fahrt && K().fahrt.frieda) || 5;
    return {von, nach, a, b, kurs, sm, fahrt: v, min: sm / v * 60};
  }
  const sprechName = id => (D.sprech && D.sprech[id]) || id;
  function text(t, w) {
    if (!t) return '';
    const x = Object.assign({}, Z.werte, w || {});
    return t.replace(/\{(\w+)\}/g, (m, k) => {
      if (!x.s) return m; const s = x.s;
      return ({von: sprechName(s.von), nach: sprechName(s.nach), kurs: ziffern(s.kurs), kursZahl: wort(Math.round(s.kurs)), sm: komma(s.sm), smZahl: zahl1(s.sm), min: wort(Math.round(s.min / 5) * 5), fahrt: wort(s.fahrt), std: komma(s.sm / s.fahrt),
        falsch: x.falsch != null ? ziffern(x.falsch) : m, loesung: x.loesung || m})[k] ?? m;
    });
  }
  const ortText = (e) => typeof e === 'string' ? e : (e[st().ort] || e.t || '');

  /* ---------- Fertigkeiten (adaptiv) ---------- */
  const fkStand = fk => st().fk[fk] || {n: 0, ok: 0, serie: 0};
  const stufe = fk => { const f = fkStand(fk); return f.serie >= 2 ? 2 : f.ok >= 1 ? 1 : 0; };
  function fkMelde(fk, ok, ohneHilfe) {
    const f = st().fk[fk] = fkStand(fk); f.n++; if (ok) f.ok++; f.serie = ok && ohneHilfe ? f.serie + 1 : 0; f.d = heute();
    try { save(); } catch (e) {}
  }

  /* ---------- Bühne ---------- */
  const DREIECK_R = 46;
  function buehneHTML(stil, szene) {
    const holz = szene === 'B'
      ? `<rect x="-200" y="-200" width="800" height="900" fill="#1a0f0a"/>${Array.from({length: 14}, (_, i) => `<path d="M${-200 + i * 60} -200 V700" stroke="#000" stroke-width="1.2" opacity=".5"/>`).join('')}`
      : `<defs><linearGradient id="nfholz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a4f2c"/><stop offset=".5" stop-color="#8d5d36"/><stop offset="1" stop-color="#6e4526"/></linearGradient></defs><rect x="-200" y="-200" width="800" height="900" fill="url(#nfholz)"/>${Array.from({length: 14}, (_, i) => `<path d="M${-200 + i * 60} -200 V700" stroke="#4a2e19" stroke-width="1.2" opacity=".5"/>`).join('')}`;
    const licht = szene === 'B'
      ? `<radialGradient id="nfrot" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#ff5a3a" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`
      : `<radialGradient id="nflampe" cx=".55" cy=".35" r=".7"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".28"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient>`;
    const nacht = stil === 'K4';
    return `<svg class="nfsvg" id="nfsvg" viewBox="-26 -22 412 524" preserveAspectRatio="xMidYMid meet">${holz}<defs>${licht}</defs>
      <rect x="-30" y="-26" width="420" height="532" fill="#000" opacity=".35" transform="translate(5 7)"/>
      <g id="nfkarte">${BREDE.inhalt(stil, {routen: (Z.folge && Z.folge.abend) ? Array.from({length: Z.folge.abend}, (_, i) => i + 1) : []})}
        <g id="nfov"><path id="nflinie" d="" stroke="${nacht ? '#ffd27a' : '#3b3326'}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
          <g id="nfdreieck" opacity="0"></g><g id="nfzirkel" opacity="0"></g>
          <g id="nfboot" opacity="0"><path d="M0 -9 Q5 -3 4 7 H-4 Q-5 -3 0 -9Z" fill="#fff" stroke="#22364a" stroke-width="1.2"/><path d="M-2 2 H2" stroke="#d33a2f" stroke-width="1.4"/></g>
          <g id="nfrums" opacity="0"></g>
          <g id="nfhand" opacity="0"><path d="M-10 0 L-13 90 L13 90 L10 0 Z" fill="#e9c23f"/><ellipse cx="0" cy="-6" rx="10" ry="11" fill="#f2c68f"/><path d="M-7 -13 q-2 -8 2 -8 q3 0 2 8 M-1 -15 q-1 -9 3 -9 q3 0 2 9 M4 -13 q1 -7 4 -6 q2 2 0 8" fill="#f2c68f" stroke="#c08a5c" stroke-width=".5"/></g>
        </g></g>
      <rect x="-200" y="-200" width="800" height="900" fill="url(#${szene === 'B' ? 'nfrot' : 'nflampe'})" pointer-events="none"/></svg>`;
  }
  const $s = id => document.getElementById(id);
  const setz = (el, x, y, r = 0, sc = 1) => el && el.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(r)}) scale(${sc})`);
  function hand(x, y, r = -15, sicht = 1) { const h = $s('nfhand'); if (!h) return; h.setAttribute('opacity', sicht); setz(h, x + 6, y + 14, r); }
  const anim = (ms, fn, L) => new Promise(res => { const t0 = performance.now(); const tick = t => { if (L !== Z.lauf) return res(); const p = Math.min(1, (t - t0) / ms), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; fn(e); if (p < 1) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); });
  /* Ausschnitt: Punkte mit Rand, ans Format der Bühne angepasst */
  function zoom(pts, pad = 30) {
    const sv = $s('nfsvg'), box = $s('nfb'); if (!sv || !box) return;
    if (pts === 'ganz') { sv.setAttribute('viewBox', '-26 -22 412 524'); return; }
    let x0 = Math.min(...pts.map(p => p[0])) - pad, x1 = Math.max(...pts.map(p => p[0])) + pad, y0 = Math.min(...pts.map(p => p[1])) - pad, y1 = Math.max(...pts.map(p => p[1])) + pad;
    const asp = (box.clientWidth || 400) / (box.clientHeight || 460); let w = x1 - x0, h = y1 - y0;
    if (w / h < asp) { const nw = h * asp; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / asp; y0 -= (nh - h) / 2; h = nh; }
    sv.setAttribute('viewBox', `${f2(x0)} ${f2(y0)} ${f2(w)} ${f2(h)}`);
  }
  /* Kursdreieck: Mitte auf dem Startpunkt, lange Kante auf dem Meridian, Skala zur Seite des Kurses */
  function dreieck(p, kurs, sicht = 1) {
    const d = $s('nfdreieck'); if (!d) return; const R = DREIECK_R, ost = kurs < 180, sg = ost ? 1 : -1, nacht = st().stil === 'K4';
    const farbe = nacht ? '#9fe8ff' : '#2a4a62'; let o = `<path d="M${p[0]} ${p[1] - R - 14} L${p[0] + sg * (R + 14)} ${p[1]} L${p[0]} ${p[1] + R + 14} Z" fill="${nacht ? 'rgba(160,230,255,.12)' : 'rgba(255,255,255,.42)'}" stroke="${farbe}" stroke-width=".9"/>`;
    for (let i = 0; i <= 180; i++) {
      const c = ost ? i : 180 + i, a = c * Math.PI / 180, l = i % 10 === 0 ? 7 : i % 5 === 0 ? 4.5 : 2.4;
      o += `<path d="M${f2(p[0] + Math.sin(a) * R)} ${f2(p[1] - Math.cos(a) * R)} L${f2(p[0] + Math.sin(a) * (R - l))} ${f2(p[1] - Math.cos(a) * (R - l))}" stroke="${farbe}" stroke-width="${i % 10 ? .35 : .6}"/>`;
      if (i % 10 === 0) o += `<text x="${f2(p[0] + Math.sin(a) * (R - 11))}" y="${f2(p[1] - Math.cos(a) * (R - 11) + 1.8)}" font-size="4.6" font-weight="800" fill="${farbe}" text-anchor="middle" font-family="Nunito,sans-serif">${c}</text>`;
    }
    o += `<path d="M${p[0]} ${p[1] - R - 14} V${p[1] + R + 14}" stroke="#c0392b" stroke-width=".5" stroke-dasharray="2 1.5"/><circle cx="${p[0]}" cy="${p[1]}" r="1.4" fill="#c0392b"/>`;
    d.innerHTML = o; d.setAttribute('opacity', sicht);
  }
  function zirkel(a, b, sicht = 1) {
    const z = $s('nfzirkel'); if (!z) return; const hx = (a[0] + b[0]) / 2 + 18, hy = (a[1] + b[1]) / 2 - 6;
    z.setAttribute('opacity', sicht);
    z.innerHTML = `<path d="M${f2(a[0])} ${f2(a[1])} L${f2(hx)} ${f2(hy)} L${f2(b[0])} ${f2(b[1])}" stroke="#5a6670" stroke-width="1.8" fill="none" stroke-linejoin="round"/><circle cx="${f2(hx)}" cy="${f2(hy)}" r="2.8" fill="#8a96a0" stroke="#3a444c" stroke-width=".6"/><circle cx="${f2(a[0])}" cy="${f2(a[1])}" r="1.1" fill="#c0392b"/><circle cx="${f2(b[0])}" cy="${f2(b[1])}" r="1.1" fill="#c0392b"/>`;
  }
  function linie(a, b) { const l = $s('nflinie'); if (l) l.setAttribute('d', a ? `M${f2(a[0])} ${f2(a[1])} L${f2(b[0])} ${f2(b[1])}` : ''); }
  function aufraeumen() { ['nfdreieck', 'nfzirkel', 'nfboot', 'nfrums', 'nfhand'].forEach(i => { const e = $s(i); if (e) e.setAttribute('opacity', 0); }); linie(null); }
  const randY = (s) => { const y = Math.max(s.sm * 20 + 8, Math.min(472, Math.max(s.a[1], s.b[1]))); return [y, y - s.sm * K().massstab.einheitenJeSm]; };

  /* ---------- Sprechen: ohne Blasen nach Stimme oder Lesezeit, mit Blasen tippt man weiter ---------- */
  async function sprich(w, t, L) {
    if (L !== Z.lauf || !t) return;
    document.querySelectorAll('#nfges .nfg').forEach(x => x.classList.toggle('spricht', x.dataset.w === w));
    const b = $s('nfblase'), blasen = st().blasen;
    if (b) { b.hidden = !blasen; if (blasen) b.innerHTML = `<small>${NAMEN[w]}</small>${esc(t)}<i>Tippen = weiter</i>`; }
    const lese = Math.min(7000, 900 + t.length * 55);
    const stimme = (S.cfg && S.cfg.naviCrew === false) ? Promise.resolve(false) : (async () => { try { await VOX.say(cidVon(w), t, 'local'); return true; } catch (e) { return false; } })();
    const tipp = new Promise(r => { Z.weiter = r; });
    await Promise.race([blasen ? tipp : new Promise(() => {}), (async () => { const t0 = Date.now(); const ok = await stimme; const rest = lese - (Date.now() - t0); if (!ok || rest > 0) await warte(ok ? Math.min(rest, 600) : lese); })()]);
    Z.weiter = null; try { VOX.stop && VOX.stop('Navi-Folge'); } catch (e) {}
    if (b) b.hidden = true; document.querySelectorAll('#nfges .nfg').forEach(x => x.classList.remove('spricht'));
  }
  async function saetze(liste, L, w) { for (const s of liste || []) { if (L !== Z.lauf) return; await sprich(s.w || 's', text(ortText(s.t !== undefined ? s.t : s), w), L); } }

  /* ---------- Untere Leiste: Auftrag, Werkzeuge, Zahlentasten ---------- */
  function unten(html) { const u = $s('nfu'); if (u) u.innerHTML = html; }
  function tasten(einheit, max = 3) {
    return new Promise(res => {
      let ein = '';
      const feld = () => { const f = $s('nffeld'); if (f) f.textContent = (ein || '___') + ' ' + einheit; };
      const tk = $s('nftasten'); if (!tk) return;
      tk.innerHTML = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'].map(k => `<button type="button" data-k="${k}" ${k === ',' && einheit === '°' ? 'disabled' : ''}>${k}</button>`).join('') + '<button type="button" class="ok" data-k="ok">Prüfen</button>';
      tk.onclick = e => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; try { AUD.click(); } catch (x) {}
        if (k === '⌫') ein = ein.slice(0, -1); else if (k === 'ok') { if (!ein) return; tk.onclick = null; return res(parseFloat(ein.replace(',', '.'))); } else if (k === ',') { if (!ein.includes(',')) ein += ein ? ',' : '0,'; } else if (ein.replace(',', '').length < max) ein += k;
        feld(); };
      feld();
    });
  }
  const WERKZ = {linie: ['✏️', 'Bleistift'], dreieck: ['📐', 'Kursdreieck'], zirkel: ['🧭', 'Zirkel']};
  function werkzeugLeiste(noetig, fertig) {
    if (st().ort === 'papier') return `<div class="nfpapier">📄 Am Tisch: Miss auf deiner Papierkarte und tipp hier nur die Zahl ein.</div>`;
    return `<div class="nfwerkz">${noetig.map(w => `<button type="button" data-w="${w}" class="${fertig.includes(w) ? 'erledigt' : (noetig.find(x => !fertig.includes(x)) === w ? 'blink' : '')}" aria-label="${WERKZ[w][1]}">${WERKZ[w][0]}<small>${WERKZ[w][1]}</small></button>`).join('')}</div>`;
  }

  /* ---------- Vormachen ---------- */
  async function vormachen(art, s, L) {
    aufraeumen();
    if (art === 'kurs') {
      zoom([s.a, s.b], 40); const t = D.saetze.vor_kurs;
      await sprich(t[0].w, text(t[0].t, {s}), L); hand(...s.a);
      await anim(1300, e => { const x = s.a[0] + (s.b[0] - s.a[0]) * e, y = s.a[1] + (s.b[1] - s.a[1]) * e; linie(s.a, [x, y]); hand(x, y); }, L);
      await sprich(t[1].w, text(t[1].t, {s}), L); zoom([s.a, [s.a[0], s.a[1] - DREIECK_R - 16], [s.a[0], s.a[1] + DREIECK_R + 16], [s.a[0] + (s.kurs < 180 ? 1 : -1) * (DREIECK_R + 16), s.a[1]]], 10);
      dreieck(s.a, s.kurs); hand(s.a[0] + (s.kurs < 180 ? 30 : -30), s.a[1] + 30, 0);
      await sprich(t[2].w, text(t[2].t, {s}), L);
    } else {
      zoom([s.a, s.b], 40); const t = D.saetze.vor_distanz;
      await sprich(t[0].w, text(t[0].t, {s}), L);
      await anim(1100, e => { zirkel(s.a, [s.a[0] + (s.b[0] - s.a[0]) * e, s.a[1] + (s.b[1] - s.a[1]) * e]); }, L);
      await sprich(t[1].w, text(t[1].t, {s}), L);
      const [y0, y1] = randY(s); zoom([[-30, y0 + 6], [40, y1 - 6]], 6);
      await anim(1300, e => zirkel([s.a[0] + (-8 - s.a[0]) * e, s.a[1] + (y0 - s.a[1]) * e], [s.b[0] + (-8 - s.b[0]) * e, s.b[1] + (y1 - s.b[1]) * e]), L);
      for (const x of t.slice(2)) await sprich(x.w, text(x.t, {s}), L);
    }
    await warte(300); aufraeumen();
  }

  /* ---------- Aufgabe mit Zahlentasten, adaptive Hilfe, Fehlerfahrt ---------- */
  /* Nach jeder Aufgabe verschwinden Zahlentasten und Auftrag, damit nichts in eine erledigte Aufgabe getippt wird */
  async function aufgabe(art, s, opt, L) { const r = await aufgabeInnen(art, s, opt, L); Z.soll = null; if (L === Z.lauf) unten(''); return r; }
  async function aufgabeInnen(art, s, opt, L) {
    const tol = D.toleranz[art], test = !!opt.test, ort = st().ort;
    const noetig = art === 'kurs' ? ['linie', 'dreieck'] : art === 'distanz' ? ['zirkel'] : [];
    let hilfe = test ? 0 : Math.max(0, 2 - stufe(opt.fk || art) - (opt.geschichte ? 1 : 0)), fertig = [], versuche = 0;
    const soll = art === 'kurs' ? Math.round(s.kurs) : art === 'distanz' ? Math.round(s.sm * 10) / 10 : Math.round(s.min);
    const einheit = art === 'kurs' ? '°' : art === 'distanz' ? 'sm' : 'min';
    Z.soll = {art, soll, test};   /* für Tests (tests/navifolge-pruefen.js) */
    const zeigeHilfe = h => {
      if (art === 'kurs') { if (h >= 1 && !fertig.includes('linie')) { linie(s.a, s.b); fertig.push('linie'); } if (h >= 2 && !fertig.includes('dreieck')) { dreieck(s.a, s.kurs); fertig.push('dreieck'); zoom([s.a, [s.a[0], s.a[1] - DREIECK_R - 16], [s.a[0], s.a[1] + DREIECK_R + 16], [s.a[0] + (s.kurs < 180 ? 1 : -1) * (DREIECK_R + 16), s.a[1]]], 10); } }
      if (art === 'distanz' && h >= 2 && !fertig.includes('zirkel')) { const [y0, y1] = randY(s); zirkel([-8, y0], [-8, y1]); fertig.push('zirkel'); zoom([[-30, y0 + 6], [40, y1 - 6]], 6); }
    };
    aufraeumen(); zoom([s.a, s.b], 40);
    if (ort === 'app' && !test) zeigeHilfe(hilfe);
    const auftrag = () => art === 'fahrzeit' ? text(D.saetze.auf_fahrzeit[Math.min(hilfe, 2)], {s}) : text(D.saetze['auf_' + art][ort][Math.min(hilfe, 2)], {s});
    const zeichne = () => unten(`<div class="nfauf"><b>${test ? '🧪 Test · ' : ''}${art === 'kurs' ? 'Kurs' : art === 'distanz' ? 'Distanz' : 'Fahrzeit'}:</b> ${esc(sprechName(s.von))} → ${esc(sprechName(s.nach))}${art === 'fahrzeit' ? ` · ${zahl1(s.sm)} sm bei ${s.fahrt} kn` : ''}</div>
      ${noetig.length ? werkzeugLeiste(noetig, fertig) : ''}<div class="nfeingabe"><span id="nffeld" class="nffeld"></span><span id="nferg" class="nferg"></span></div><div class="nftasten" id="nftasten"></div>`);
    zeichne();
    const knoepfe = () => document.querySelectorAll('#nfu .nfwerkz [data-w]').forEach(b => b.onclick = async () => {
      const w = b.dataset.w; if (fertig.includes(w) || Z.werkzeugLaeuft) return; Z.werkzeugLaeuft = true; const vorher = noetig[noetig.indexOf(w) - 1]; if (vorher && !fertig.includes(vorher)) { Z.werkzeugLaeuft = false; toast('Erst ' + WERKZ[vorher][1] + '.'); return; }
      try { AUD.click(); } catch (e) {}
      if (w === 'linie') await anim(700, e => linie(s.a, [s.a[0] + (s.b[0] - s.a[0]) * e, s.a[1] + (s.b[1] - s.a[1]) * e]), L);
      if (w === 'dreieck') zeigeHilfe(2);
      if (w === 'zirkel') { await anim(700, e => zirkel(s.a, [s.a[0] + (s.b[0] - s.a[0]) * e, s.a[1] + (s.b[1] - s.a[1]) * e]), L); const [y0, y1] = randY(s); zoom([[-30, y0 + 6], [40, y1 - 6]], 6); await anim(900, e => zirkel([s.a[0] + (-8 - s.a[0]) * e, s.a[1] + (y0 - s.a[1]) * e], [s.b[0] + (-8 - s.b[0]) * e, s.b[1] + (y1 - s.b[1]) * e]), L); }
      if (!fertig.includes(w)) fertig.push(w); Z.werkzeugLaeuft = false;
      const leiste = document.querySelector('#nfu .nfwerkz'); if (leiste) leiste.outerHTML = werkzeugLeiste(noetig, fertig); knoepfe();
    });
    knoepfe();
    if (!test || versuche === 0) await sprich('s', auftrag(), L);
    while (L === Z.lauf) {
      const v = await tasten(einheit, art === 'distanz' ? 3 : 3); if (L !== Z.lauf) return {ok: false};
      versuche++;
      const diff = art === 'kurs' ? Math.abs(((v - soll + 540) % 360) - 180) : Math.abs(v - soll), ok = diff <= tol;
      const erg = $s('nferg');
      if (ok) {
        if (erg) erg.innerHTML = '✅ ' + (art === 'distanz' ? zahl1(soll) : soll) + ' ' + einheit;
        try { AUD.sfx && AUD.sfx('richtig'); } catch (e) {}
        fkMelde(opt.fk || art, true, versuche === 1 && hilfe === 0);
        if (!test) await saetze([pick(D.saetze.richtig)], L, {s});
        if (art === 'kurs' && st().maengel.length) { const m = st().maengel.pop(); try { save(); } catch (e) {} const sd = (K().schaeden || []).find(x => x.id === m); toast('🔧 Mängelbuch: ' + (sd ? sd.name : m) + ' repariert'); }
        return {ok: true, versuche, hilfe};
      }
      try { AUD.sfx && AUD.sfx('falsch'); } catch (e) {}
      if (test) { if (erg) erg.innerHTML = '❌ ' + (art === 'distanz' ? zahl1(soll) : soll) + ' ' + einheit; fkMelde(opt.fk || art, false, false); await warte(900); return {ok: false, versuche, hilfe}; }
      if (erg) erg.innerHTML = '❌ Nicht ganz';
      if (art === 'kurs' && Math.abs(((v - soll + 360) % 360) - 180) <= 4) await saetze(D.saetze.gegenkurs, L, {s});
      else if (art === 'distanz' && Math.abs(v - BREDE.sm(s.a, s.b) * K().massstab.einheitenJeSm / K().massstab.einheitenJeLaengenminute) <= .3) await saetze(D.saetze.unten_gemessen, L, {s});
      else if (versuche < 3) await saetze(D.saetze.falsch, L, {s});
      if (art === 'kurs' && opt.geschichte && !Z.fehlerfahrt) { Z.fehlerfahrt = true; await fehlerfahrt(s, v, L); zeichne(); knoepfe(); }
      if (versuche >= 3) {
        await saetze(D.saetze.loesung, L, {s, loesung: art === 'kurs' ? ziffern(soll) + ' Grad' : art === 'distanz' ? komma(soll) + ' Seemeilen' : wort(soll) + ' Minuten'});
        fkMelde(opt.fk || art, false, false); if (erg) erg.innerHTML = '➜ ' + (art === 'distanz' ? zahl1(soll) : soll) + ' ' + einheit; await warte(1200); return {ok: false, versuche, hilfe};
      }
      hilfe = Math.min(2, hilfe + 1); if (ort === 'app') zeigeHilfe(hilfe);
      const ef = $s('nferg'); if (ef) ef.textContent = '';
      if (document.querySelector('#nfu .nfwerkz')) { document.querySelector('#nfu .nfwerkz').outerHTML = werkzeugLeiste(noetig, fertig); knoepfe(); }
      await sprich('s', auftrag(), L);
    }
    return {ok: false};
  }

  /* Falscher Kurs: die Frieda-Figur fährt ihn ab, bis sie auf Land oder Watt trifft (HR54) */
  async function fehlerfahrt(s, falsch, L) {
    aufraeumen(); const b = $s('nfboot'), rad = falsch * Math.PI / 180, weit = Math.max(s.sm * 20 * 1.4, 60);
    const harte = [...document.querySelectorAll('#nfsvg .hart')];
    let treffer = null, ziel = null;
    for (let d = 4; d <= weit; d += 2) {
      const p = [s.a[0] + Math.sin(rad) * d, s.a[1] - Math.cos(rad) * d];
      if (p[0] < -10 || p[0] > 370 || p[1] < -10 || p[1] > 490) { ziel = p; break; }
      const h = harte.find(el => { try { const pt = (el.ownerSVGElement.createSVGPoint ? Object.assign(el.ownerSVGElement.createSVGPoint(), {x: p[0], y: p[1]}) : new DOMPoint(p[0], p[1])); return el.isPointInFill(pt); } catch (e) { return false; } });
      ziel = p; if (h) { treffer = h.dataset.art; break; }
    }
    zoom([s.a, s.b, ziel], 40);
    await saetze(D.saetze.fehlerfahrt, L, {s, falsch: Math.round(falsch)});
    b.setAttribute('opacity', 1); linie(s.a, ziel);
    await anim(2400, e => setz(b, s.a[0] + (ziel[0] - s.a[0]) * e, s.a[1] + (ziel[1] - s.a[1]) * e, falsch, 1.5), L);
    if (treffer) {
      const r = $s('nfrums'); r.setAttribute('opacity', 1); r.innerHTML = `<g transform="translate(${f2(ziel[0])} ${f2(ziel[1] - 14)})"><path d="M-12 -5 L-3 -2 L-9 5 L0 2 L3 10 L5 0 L14 3 L7 -3 L12 -10 L2 -5 L0 -14 L-3 -5 Z" fill="#f3c63a" stroke="#c0392b" stroke-width="1"/><text y="2.5" font-size="6" font-weight="800" text-anchor="middle" fill="#c0392b" font-family="Nunito,sans-serif">RUMS</text></g>`;
      const w = $s('nfb'); if (w) { w.classList.remove('wackel'); void w.offsetWidth; w.classList.add('wackel'); }
      try { AUD.stoss ? AUD.stoss('grund', .8) : AUD.sfx('falsch'); } catch (e) {} try { navigator.vibrate && navigator.vibrate(120); } catch (e) {}
    }
    await saetze(D.saetze.auflauf[treffer || 'frei'], L, {s});
    if (treffer) {
      const sd = (K().schaeden || []).find(x => x.id === (treffer === 'watt' ? 'propeller' : 'ruder')) || pick(K().schaeden);
      st().maengel.push(sd.id); try { save(); } catch (e) {}
      const p = $s('nfpanel'); if (p) { p.innerHTML = `<span>🔧</span><div><b>Mängelbuch: ${esc(sd.name)}</b><p>Wäre es echt gewesen: ${esc(sd.folge)}</p></div>`; p.hidden = false; }
      await saetze(D.saetze.nach_schaden, L, {s});
      await warte(1200); if (p) p.hidden = true;
    }
    aufraeumen();
  }

  /* ---------- Frage (Multiple Choice, Grundlagen) ---------- */
  async function frage(sc, L) {
    await sprich('s', sc.frage, L);
    unten(`<div class="nfauf"><b>Frage:</b> ${esc(sc.frage)}</div><div class="nfwahl">${sc.opts.map((o, i) => `<button type="button" class="btn" data-i="${i}">${esc(o)}</button>`).join('')}</div>`);
    const i = await new Promise(r => document.querySelectorAll('#nfu .nfwahl [data-i]').forEach(b => b.onclick = () => r(+b.dataset.i)));
    if (L !== Z.lauf) return;
    const ok = i === sc.ok; document.querySelectorAll('#nfu .nfwahl [data-i]').forEach(b => { b.disabled = true; if (+b.dataset.i === sc.ok) b.classList.add('ok'); else if (+b.dataset.i === i) b.classList.add('no'); });
    try { AUD.sfx && AUD.sfx(ok ? 'richtig' : 'falsch'); } catch (e) {}
    if (sc.fk) fkMelde(sc.fk, ok, true);
    await sprich('s', ok ? sc.richtig : sc.falsch, L);
  }

  /* ---------- Test: drei Aufgaben ohne Hilfe zu allem, was die Folge gebündelt hat ---------- */
  function testStrecken() { const p = [...D.uebung].sort(() => Math.random() - .5); return p.slice(0, 3).map(([a, b]) => strecke(a, b, Z.folge.fahrt)); }
  async function testlauf(arten, L) {
    const id = Z.folge.id;
    for (let runde = 0; runde < 2 && L === Z.lauf; runde++) {
      await saetze(D.saetze.test_start, L);
      const str = testStrecken(); let gut = 0;
      for (let i = 0; i < arten.length && L === Z.lauf; i++) { const r = await aufgabe(arten[i], str[i], {test: true, fk: arten[i]}, L); if (r.ok) gut++; }
      if (L !== Z.lauf) return;
      const t = st().test[id] = {ok: gut >= 2, n: gut, von: arten.length, d: heute()}; try { save(); } catch (e) {}
      unten(`<div class="nfauf nftest"><b>${t.ok ? '✅ Test bestanden' : '🔁 Noch nicht'}</b> ${gut} von ${arten.length} richtig</div>`);
      if (t.ok) { await saetze([pick(D.saetze.test_gut)], L); return true; }
      await saetze(D.saetze.test_schlecht, L);
      if (runde === 0) { const ueb = testStrecken(); for (let i = 0; i < arten.length && L === Z.lauf; i++) await aufgabe(arten[i], ueb[i], {fk: arten[i]}, L); }
    }
    return false;
  }

  /* ---------- Ablauf ---------- */
  async function spiele(f) {
    const L = ++Z.lauf; Z.folge = f; Z.fehlerfahrt = false; Z.werkzeugLaeuft = false;
    const bsp = strecke(f.beispiel[0], f.beispiel[1], f.fahrt), auf = strecke(f.aufgabe[0], f.aufgabe[1], f.fahrt);
    Z.werte = {s: auf};
    const ersetze = v => v === '{bvon}' ? bsp : v === '{avon}' ? auf : null;
    for (const sc of f.schritte) {
      if (L !== Z.lauf) return;
      if (sc.sag) { unten(''); await sprich(sc.sag, text(ortText(sc.t !== undefined ? sc.t : sc)), L); }
      else if (sc.zeige) zoom(sc.zeige === 'ganz' ? 'ganz' : sc.zeige.map(BREDE.punkt), 30);
      else if (sc.frage) await frage(sc, L);
      else if (sc.vormachen) { unten(''); const s = ersetze(sc.von) || strecke(sc.von, sc.nach, f.fahrt); if (stufe(sc.fk) >= 2) await saetze([pick(D.saetze.kannst_schon)], L); else await vormachen(sc.vormachen, s, L); }
      else if (sc.aufgabe) await aufgabe(sc.aufgabe, ersetze(sc.von) || strecke(sc.von, sc.nach, f.fahrt), {fk: sc.fk, geschichte: sc.geschichte}, L);
      else if (sc.test) await testlauf(sc.test, L);
      else if (sc.ende) break;
    }
    if (L !== Z.lauf) return;
    st().fertig[f.id] = heute(); try { save(); } catch (e) {}
    await saetze(D.saetze.ende, L);
    zoom('ganz'); aufraeumen();
    unten(`<div class="nfauf"><b>⚓ Feierabend.</b> Die Etappe für morgen steht im Logbuch.</div><div class="nfwahl"><button class="btn" id="nfextra">➕ Zusatzrunde (drei Aufgaben)</button><button class="btn ghost" id="nfzu">Zurück</button></div>`);
    $s('nfextra').onclick = () => zusatz(f); $s('nfzu').onclick = () => NF.start(f.id);
  }
  async function zusatz(f) {
    const L = ++Z.lauf; Z.folge = f;
    const str = testStrecken(), arten = f.fertigkeiten;
    for (let i = 0; i < arten.length && L === Z.lauf; i++) await aufgabe(arten[i], str[i % str.length], {fk: arten[i]}, L);
    if (L === Z.lauf) NF.start(f.id);
  }

  /* ---------- Startbild mit Kippschalter ---------- */
  function rahmen(f, innen) {
    gameShell('Abendwache · ' + f.titel, innen);
    $('#gback').onclick = () => { Z.lauf++; try { VOX.stop && VOX.stop('Navi-Folge'); } catch (e) {} stopGames(); setTab(typeof returnTo !== 'undefined' ? returnTo : 'cabin'); };
  }
  const NF = {};
  NF.laden = () => D ? Promise.resolve(D) : Promise.all([BREDE.laden(), fetch('data/navi-folgen.json?v=' + (window.__ver || '')).then(r => r.json())]).then(([, d]) => (D = d));
  NF.start = async function (id) {
    await NF.laden(); const f = D.folgen.find(x => x.id === id) || D.folgen[0], s = st();
    s.stil = nachts() ? 'K4' : 'K1';
    const fertig = s.fertig[f.id], t = s.test[f.id];
    rahmen(f, `<div class="nfstart">
      <div class="nfbild">${BREDE.svg(s.stil, {vb: '0 280 300 200', par: 'xMidYMid slice', routen: Array.from({length: f.abend}, (_, i) => i + 1)})}</div>
      <p class="small muted">Abendwache Tag ${f.abend} · plant die Etappe von Tag ${f.plant}${fertig ? ' · ✓ gemacht ' + fertig.split('-').reverse().join('.') : ''}${t ? ' · Test ' + t.n + '/' + t.von : ''}</p>
      <h2>${esc(f.titel)}</h2>
      <p class="small">Heute zusammen: ${f.lektionen.map(esc).join(' · ')}. Am Ende ein kurzer Test.</p>
      <div class="nfschalter" role="group" aria-label="Wo übst du?"><button type="button" data-ort="app" aria-pressed="${s.ort === 'app'}">📱 In der App</button><button type="button" data-ort="papier" aria-pressed="${s.ort === 'papier'}">📄 Am Tisch mit Papierkarte</button></div>
      <label class="nfkipp"><input type="checkbox" id="nfbl" ${s.blasen ? 'checked' : ''}> 💬 Sprechblasen (Tippen = weiter)</label>
      ${s.maengel.length ? `<div class="nfmaengel">🔧 Mängelbuch: ${s.maengel.map(m => { const sd = (K().schaeden || []).find(x => x.id === m); return esc(sd ? sd.name : m); }).join(', ')}. Ein richtiger Kurs repariert es.</div>` : ''}
      <button class="btn wide" id="nflos">⚓ Los geht's</button></div>`);
    document.querySelectorAll('.nfschalter [data-ort]').forEach(b => b.onclick = () => { s.ort = b.dataset.ort; document.querySelectorAll('.nfschalter [data-ort]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); try { save(); } catch (e) {} });
    $s('nfbl').onchange = e => { s.blasen = e.target.checked; try { save(); } catch (x) {} };
    $s('nflos').onclick = () => { try { AUD.unlock && AUD.unlock(); VOX.phoneUnlock && VOX.phoneUnlock(); } catch (e) {} NF.tisch(f); };
  };
  NF.tisch = function (f) {
    const s = st(), szene = s.stil === 'K4' ? 'B' : 'A';
    Z.folge = f;
    rahmen(f, `<div class="nfw"><div class="nfbuehne" id="nfb">${buehneHTML(s.stil, szene)}
      <div class="nfges" id="nfges">${['s', 'k', 'h'].map(w => `<div class="nfg" data-w="${w}" title="${NAMEN[w]}">${charSVG(cidVon(w))}</div>`).join('')}</div>
      <div class="nfblase" id="nfblase" hidden></div><div class="nfpanel" id="nfpanel" hidden></div>
      <div class="nfkopf"><button type="button" id="nfort" title="App oder Papierkarte">${s.ort === 'app' ? '📱' : '📄'}</button><button type="button" id="nfbtn" aria-pressed="${s.blasen}" title="Sprechblasen">💬</button></div></div>
      <div class="nfunten" id="nfu"></div></div>`);
    $s('nfb').addEventListener('click', e => { if (e.target.closest('button')) return; if (Z.weiter) Z.weiter(); });
    $s('nfort').onclick = () => { s.ort = s.ort === 'app' ? 'papier' : 'app'; $s('nfort').textContent = s.ort === 'app' ? '📱' : '📄'; toast(s.ort === 'app' ? 'In der App' : 'Am Tisch mit Papierkarte'); try { save(); } catch (e) {} };
    $s('nfbtn').onclick = () => { s.blasen = !s.blasen; $s('nfbtn').setAttribute('aria-pressed', String(s.blasen)); try { save(); } catch (e) {} };
    spiele(f);
  };
  NF.stop = () => { Z.lauf++; };
  NF.stand = id => { const s = st(); return {fertig: s.fertig[id], test: s.test[id], maengel: s.maengel.slice()}; };
  NF.liste = () => (D ? D.folgen : []).map(f => ({id: f.id, titel: f.titel, abend: f.abend, plant: f.plant, stufe: f.stufe, lektionen: f.lektionen}));
  NF._z = Z; NF._strecke = strecke;
  NF.css = `.nfstart{padding:8px 16px 24px;display:grid;gap:10px}.nfstart h2{margin:0;font-family:var(--display,inherit)}.nfbild{border-radius:14px;overflow:hidden;height:170px;box-shadow:0 2px 10px #0003}.nfbild svg{width:100%;height:100%;display:block}
    .nfschalter{display:grid;grid-template-columns:1fr 1fr;gap:6px}.nfschalter button{padding:10px 8px;border-radius:12px;border:2px solid var(--line,#ccc);background:var(--card,#fff);color:inherit;font:inherit;font-weight:700}.nfschalter button[aria-pressed=true]{border-color:var(--accent,#e2a03f);background:color-mix(in srgb,var(--accent,#e2a03f) 18%,transparent)}
    .nfkipp{display:flex;gap:8px;align-items:center}.nfmaengel{background:#fff3d6;color:#5a3a00;border-radius:10px;padding:8px 10px;font-size:.92rem}
    .nfw{display:flex;flex-direction:column;height:calc(100dvh - 56px);min-height:0}.nfbuehne{position:relative;flex:1 1 auto;min-height:0;overflow:hidden;background:#3a2414}.nfsvg{position:absolute;inset:0;width:100%;height:100%;display:block}
    .nfbuehne.wackel{animation:nfwackel .45s}@keyframes nfwackel{20%{transform:translate(-5px,2px)}40%{transform:translate(5px,-2px)}60%{transform:translate(-3px,1px)}80%{transform:translate(2px,0)}}
    .nfges{position:absolute;left:8px;top:8px;display:flex;gap:6px}.nfg{width:46px;height:46px;border-radius:50%;overflow:hidden;background:#f6ecd6;border:2px solid #0003;transition:transform .2s,box-shadow .2s}.nfg svg{width:150%;height:150%;margin:-8% 0 0 -25%}.nfg.spricht{transform:scale(1.14);box-shadow:0 0 0 3px #ffd36b}
    .nfblase{position:absolute;left:8px;right:8px;top:62px;background:#fffdf6;color:#222;border-radius:14px;padding:8px 12px;box-shadow:0 2px 8px #0004;font-size:1rem}.nfblase small{display:block;font-weight:800;opacity:.7}.nfblase i{display:block;font-size:.75rem;opacity:.55;margin-top:2px}
    .nfpanel[hidden],.nfblase[hidden],.nfunten:empty{display:none}.nfpanel{position:absolute;left:8px;right:8px;bottom:8px;background:#fff7e2;color:#3a2a00;border-radius:12px;padding:8px 10px;display:flex;gap:8px;align-items:flex-start;box-shadow:0 2px 8px #0004}.nfpanel span{font-size:1.6rem}.nfpanel p{margin:2px 0 0;font-size:.9rem}
    .nfkopf{position:absolute;right:8px;top:8px;display:flex;gap:6px}.nfkopf button{width:40px;height:40px;border-radius:50%;border:0;background:#0006;color:#fff;font-size:1.1rem}.nfkopf button[aria-pressed=true]{background:#e2a03f}
    .nfunten{flex:0 0 auto;padding:8px 12px calc(10px + env(safe-area-inset-bottom));display:grid;gap:6px;background:var(--bg,#fff)}.nfunten:empty{display:none}.nfauf{font-size:.98rem}.nfpapier{font-size:.9rem;background:color-mix(in srgb,var(--accent,#e2a03f) 15%,transparent);border-radius:10px;padding:6px 10px}
    .nfwerkz{display:flex;gap:6px}.nfwerkz button{flex:1;display:grid;justify-items:center;padding:6px 4px;border-radius:12px;border:2px solid var(--line,#ccc);background:var(--card,#fff);color:inherit;font-size:1.3rem}.nfwerkz button small{font-size:.7rem;font-weight:700}.nfwerkz button.erledigt{opacity:.45}.nfwerkz button.blink{animation:nfblink 1s infinite;border-color:#e2a03f}@keyframes nfblink{50%{box-shadow:0 0 0 4px #ffd36b}}
    .nfeingabe{display:flex;gap:10px;align-items:baseline}.nffeld{font-size:1.5rem;font-weight:800;font-variant-numeric:tabular-nums;min-width:6ch}.nferg{font-weight:700}
    .nftasten{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.nftasten button{padding:9px 0;border-radius:10px;border:1px solid var(--line,#ccc);background:var(--card,#fff);color:inherit;font-size:1.15rem;font-weight:700}.nftasten button.ok{grid-column:span 4;background:#e2a03f;color:#222;border:0}.nftasten button:disabled{opacity:.3}
    .nfwahl{display:grid;gap:6px}.nfwahl .ok{background:#2f9e55;color:#fff}.nfwahl .no{background:#c0392b;color:#fff}.nftest{font-size:1.1rem}
    @media (prefers-reduced-motion:reduce){.nfwerkz button.blink,.nfbuehne.wackel{animation:none}}`;
  if (typeof document !== 'undefined' && !document.getElementById('nf-css')) { const e = document.createElement('style'); e.id = 'nf-css'; e.textContent = NF.css; document.head.appendChild(e); }
  window.NAVIFOLGE = NF;
})();
