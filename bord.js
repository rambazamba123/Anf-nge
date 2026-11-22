/* Skipper – Bord: Deck und Kajüte auf der Glasbühne (v5.82, E34–E36, docs/plan-bord.md).
   deck.js baut Rahmen und Karten (Zettel, Weiter, Rennen) und ruft BORD.deck(box, opt) bzw. BORD.kajuete(box, opt), sobald film.js und figuren.js geladen sind.
   Hier: Bühne (film.js), Wischen mit Tiefe, Heranfahren mit den echten Funktionen der App (opt.tun aus deck.js), Sprechen (Stimmenpaket, der Mund folgt der Lautstärke),
   Leben an Bord (Mäuse, Backbord, Klabauter, Fabelwesen, Möwen; ein Taktgeber, höchstens ein Auftritt zugleich, Ruhe beim Wischen) und das Schiffsrennen im Zeichenstil.
   Spielstand: nichts Neues. Der Schalter für das alte Deck (S.cfg.altesBord, Standard aus) liegt in deck.js und in der Werkstatt (R7). */
(function () {
  'use strict';
  if (window.BORD) return;
  const FB = () => window.FILMB, F = () => window.FIGUREN;
  const r1 = n => Math.round(n * 10) / 10, zufall = a => a[Math.floor(Math.random() * a.length)], warte = ms => new Promise(r => setTimeout(r, ms));
  const weniger = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches || (window.S && S.cfg && S.cfg.motion === 'weniger'); } catch (e) { return false; } };
  let box = null, art = null, nr = 0, Opt = {};
  const da = n => n === nr && !!box && box.isConnected;
  const bw = () => box && box.querySelector('.bbuehne');
  const inB = sel => { const b = bw(); return b ? b.querySelector(sel) : null; };
  const relRect = el => { const r = el.getBoundingClientRect(), b = box.getBoundingClientRect(); return {x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height}; };
  const imRect = (el, x, y, pad = 0) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad; };
  const sfx = (n, o) => { try { if (window.AUD && AUD.ready) AUD.sfx(n, o || {vol: .5}); } catch (e) {} };
  const FERN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="15" r="4"/><circle cx="17" cy="15" r="4"/><path d="M10.5 13.5h3M5 11l2-6h3l1 5M19 11l-2-6h-3l-1 5"/></svg>';

  /* Licht der Bühne: Tageszeit und Wetter der App (die Werft kann es zum Testen festsetzen) */
  function lichtJetzt() {
    try { const l = S.cfg && S.cfg.look && S.cfg.look.licht; if (l) return l; } catch (e) {}
    let wx = 'schoen', dp = 'tag'; try { wx = weatherToday(); dp = dayPart(); } catch (e) {}
    if (wx === 'nebel') return 'nebel'; if (wx === 'regen' || wx === 'sturm') return 'regen';
    return ({morgen: 'morgen', tag: 'mittag', abend: 'abend', nacht: 'nacht'})[dp] || 'mittag';
  }

  /* ---------- Stimmen: echte Aufnahmen aus audio/stimmen, Mund folgt der Lautstärke (Lautstärke der Stimmen aus den Einstellungen) ---------- */
  const WER = {hinnerk: 'HINNERK', smilla: 'SMILLA', klabauter: 'KLABAUTER', hilke: 'HILKE', harms: 'HARMS', kroeger: 'HARMS'};
  const NAME = {hinnerk: "Käpt'n Hinnerk", smilla: 'Smilla', klabauter: 'Klabauter', hilke: 'Hilke', harms: 'Kapitän Harms', kroeger: 'Kapitän Harms', backbord: 'Backbord'};
  const STIMME = {hinnerk: {moin: ['1bps9q1', '8zipg1', 'kqhc0c', '1shkgyg', '1ej9no5'], kajuete: ['1nnlbz5', 'a0u32u']}, smilla: {moin: ['9t6fo4', 'g7dxo9', '13xcbjm', '1degtj5'], kajuete: ['1tr739f', '9t6fo4']},
    klabauter: {moin: ['lzg1b7', '17eg7wk', 'l50afm'], kajuete: ['2fwqkh', 'lzg1b7']}};
  let TEXTE = null, actx = null, laufend = null, sprechNr = 0; const PUFFER = {};
  const texteLaden = () => TEXTE ? Promise.resolve(TEXTE) : fetch('audio/stimmen/manifest.json').then(r => r.json()).then(m => (TEXTE = m.texts || {})).catch(() => (TEXTE = {}));
  const lautst = () => { try { return Math.min(1, (S.cfg && S.cfg.voice != null ? S.cfg.voice : 1) * (window.VOXDIM || 1)); } catch (e) { return 1; } };
  async function spiele(datei) {
    const v = lautst(); if (v <= 0) return null;
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') await actx.resume();
    const b = PUFFER[datei] || (PUFFER[datei] = await fetch(datei).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }).then(a => actx.decodeAudioData(a)));
    const q = actx.createBufferSource(), an = actx.createAnalyser(), g = actx.createGain(); an.fftSize = 512; g.gain.value = v; q.buffer = b; q.connect(an); an.connect(g); g.connect(actx.destination);
    const st = {q, an, fertig: false}; q.onended = () => { st.fertig = true; }; q.start(); return st;
  }
  const pegelVon = (an, arr) => { an.getByteTimeDomainData(arr); let s = 0; for (let i = 0; i < arr.length; i++) { const x = (arr[i] - 128) / 128; s += x * x; } return Math.max(0, Math.min(1, (Math.sqrt(s / arr.length) - .012) * 6.5)); };
  const takt = t => Math.max(0, Math.min(1, .1 + .9 * Math.max(0, Math.sin(t * 12.6)) * (.55 + .45 * Math.sin(t * 3.3))));
  function blaseZeigen(wer, text, ankerEl, med, menue) {
    let b = box.querySelector('.bblase'); if (!b) { b = document.createElement('div'); b.className = 'bblase'; box.appendChild(b); }
    const knopf = menue && typeof charMenu === 'function' && window.CREW && CREW[menue] ? `<button class="bmenue" data-menue="${menue}">Mit ${NAME[menue] ? NAME[menue].replace("Käpt'n ", '') : menue} reden ›</button>` : '';
    b.innerHTML = `<b>${NAME[wer] || ''}</b>${text}${knopf}`; b.classList.remove('links', 'an');
    const T = box.getBoundingClientRect();
    if (med) { const m = box.querySelector('.bmed').getBoundingClientRect(); b.classList.add('links'); b.style.left = (m.right - T.left + 10) + 'px'; b.style.top = ''; b.style.bottom = (T.bottom - m.bottom + 8) + 'px'; }
    else if (ankerEl) { const r = ankerEl.getBoundingClientRect(), cx = r.left + r.width / 2 - T.left; b.style.maxWidth = Math.min(240, T.width - 24) + 'px'; b.style.left = '0px';
      const w = b.offsetWidth, left = Math.max(12, Math.min(T.width - w - 12, cx - w / 2)); b.style.left = left + 'px'; b.style.setProperty('--px', Math.max(10, Math.min(w - 24, cx - left - 7)) + 'px');
      b.style.top = ''; b.style.bottom = Math.max(12, Math.min(T.height - 70, T.bottom - r.top + 10)) + 'px'; }
    requestAnimationFrame(() => b.classList.add('an'));
  }
  function stumm() {
    sprechNr++; if (laufend && laufend.q) { try { laufend.q.stop(); } catch (e) {} } laufend = null;
    if (FB()) { try { FB().sprecher(''); FB().pegel(null); } catch (e) {} }
    if (!box) return; const b = box.querySelector('.bblase'); if (b) b.classList.remove('an'); const m = box.querySelector('.bmed'); if (m) { m.classList.remove('an'); F().mund(m, 0); }
  }
  /* wer spricht clip (oder text ohne Aufnahme); med: im Medaillon statt auf der Bühne; menue: Knopf ins Crew-Menü */
  async function sprich(wer, clip, o = {}) {
    stumm(); try { if (window.VOX) VOX.stop(); } catch (e) {}
    await texteLaden(); const nr0 = sprechNr, text = ((TEXTE[clip] || '').replace(/^[a-zäöü]+: /, '') || o.text || '');
    if (!box) return;
    let med = null;
    if (o.med) { med = box.querySelector('.bmed'); if (!med) { med = document.createElement('div'); med.className = 'bmed'; box.appendChild(med); } med.innerHTML = medaillon(wer); requestAnimationFrame(() => med.classList.add('an')); }
    else if (WER[wer]) FB().sprecher(WER[wer]);
    blaseZeigen(wer, text, o.anker, !!med, o.menue);
    let st = null; if (clip) { try { st = await spiele(`audio/stimmen/${clip}.mp3`); } catch (e) { st = null; } } else if (o.datei) { try { st = await spiele(o.datei); } catch (e) {} }
    if (nr0 !== sprechNr) { if (st) try { st.q.stop(); } catch (e) {} return; }
    laufend = st; const arr = new Uint8Array(512), t0 = performance.now(), dauer = Math.max(1500, text.length * 62);
    await new Promise(res => { const tick = now => {
        if (nr0 !== sprechNr) return res();
        const v = st ? pegelVon(st.an, arr) : null, ende = st ? st.fertig : now - t0 > dauer;
        if (med) F().mund(med, v != null ? v : takt((now - t0) / 1000)); else FB().pegel(v);
        if (ende) return res(); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    if (nr0 !== sprechNr) return;
    if (med) F().mund(med, 0); else { FB().sprecher(''); FB().pegel(null); }
    setTimeout(() => { if (nr0 === sprechNr && box) { const b = box.querySelector('.bblase'); if (b && !b.querySelector('.bmenue')) b.classList.remove('an'); if (med) med.classList.remove('an'); } }, o.menue ? 4200 : 1400);
  }
  /* Kopf einer Figur von vorn im Medaillon (Mund bewegt sich mit) */
  function medaillon(wer) {
    const id = wer === 'kroeger' ? 'harms' : wer, f = F().FIG[id]; if (!f) return '';
    if (f.tier) return `<svg viewBox="-10 -42 28 28">${F().figur(id, {pose: 'sitzen'})}</svg>`;
    const T = F().typ ? F().typ(id) : F().TYPEN[f.typStd] || F().TYPEN.klassisch, sk = f.h / 100, cy = (-77.6 * T.bh - 9 * T.k) * sk, g = 40 * T.k * sk;
    return `<svg viewBox="${(.4 * T.bw * sk - g / 2).toFixed(1)} ${(cy - g * .52).toFixed(1)} ${g.toFixed(1)} ${g.toFixed(1)}">${F().figur(id, {blick: 'vorn'})}</svg>`;
  }
  /* Spricht die App selbst (VOX, z. B. das Moin beim Anlegen), bewegt sich auf der Bühne der Mund mit (ohne Lautstärke: im Takt) */
  function voxHaken() {
    if (!window.VOX || !VOX.hooks || VOX.hooks._bord) return;
    const s0 = VOX.hooks.start, e0 = VOX.hooks.end;
    VOX.hooks.start = (who, text) => { s0(who, text); if (box && box.isConnected && FB() && WER[who]) { try { FB().pegel(null); FB().sprecher(WER[who]); } catch (e) {} } };
    VOX.hooks.end = who => { e0(who); if (box && box.isConnected && FB() && !laufend) { try { FB().sprecher(''); } catch (e) {} } };
    VOX.hooks._bord = true;
  }

  /* ---------- Bühne aufbauen ---------- */
  async function buehne(ort, blick) {
    const FBm = FB(); FBm.reset(); if (FBm.uhr) FBm.uhr(null); FBm.licht(lichtJetzt()); FBm.atmo([]); FBm.mount(bw());
    await FBm.ort(ort, 'sofort', blick);
  }

  /* ---------- Deck: die Frieda am Liegeplatz; Boot antippen = Kajüte, Motor = 3D, Crew antippen = sprechen ---------- */
  async function deck(el, opt = {}) {
    lebenStop(); stumm(); box = el; art = 'deck'; Opt = opt; const n = ++nr; voxHaken();
    await buehne('liegeplatz', 'seite'); if (!da(n)) return;
    FB().kamera('seite', 'liege', 'sofort');
    bw().insertAdjacentHTML('beforeend', '<div class="bhots"><button class="bhot" data-go="kajuete" aria-label="Runter in die Kajüte"></button><button class="bhot" data-go="motor" aria-label="Motor ansehen (3D)"></button></div>');
    /* Antippflächen aus den sichtbaren Teilen des Boots (ohne die unsichtbaren Blasen und Gischt), im Bühnenrahmen gehalten */
    const lage = () => { if (!da(n)) return; const b = inB('#dk-boot'); if (!b) return; const T = bw().getBoundingClientRect(); let l = 1e9, t = 1e9, r = -1e9, u = -1e9;
      for (const x of b.querySelectorAll(':scope > .fb-bob > *')) { if (/-(blasen|gischt)$/.test(x.id || '')) continue; const q = x.getBoundingClientRect(); if (!q.width) continue; l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); u = Math.max(u, q.bottom); }
      if (r < l) return; l = Math.max(l, T.left); r = Math.min(r, T.right - 4);
      const R = {x: l - T.left, y: t - T.top, w: r - l, h: u - t}, set = (k, x0, x1, y0, y1) => { const h = el.querySelector(`.bhot[data-go="${k}"]`); if (h) Object.assign(h.style, {left: (R.x + R.w * x0) + 'px', top: (R.y + R.h * y0) + 'px', width: (R.w * (x1 - x0)) + 'px', height: (R.h * (y1 - y0)) + 'px'}); };
      set('kajuete', .36, .6, .3, .62); set('motor', .88, 1, .42, .92); };
    requestAnimationFrame(lage); setTimeout(lage, 400); addEventListener('resize', lage);
    el.querySelectorAll('.bhot').forEach(h => h.addEventListener('click', e => { e.stopPropagation(); (opt[h.dataset.go] || (() => {}))(); }));
    bw().addEventListener('click', e => tippenDeck(e, n));
    texteLaden(); leben('deck', n);
    if (opt.vonHand && !weniger()) setTimeout(() => { if (!da(n) || (window.VOX && VOX.speaking)) return;
      sprich('hinnerk', zufall(STIMME.hinnerk.moin), {anker: figurEl('hinnerk')}).then(() => { if (da(n) && Math.random() < .35) sprich('smilla', 'g7dxo9', {anker: figurEl('smilla')}); }); }, 800);
  }
  const FIG_DECK = {hinnerk: '#dk-boot .cr-hinnerk', smilla: '#dk-boot .cr-smilla'};
  function figurEl(wer) {
    if (art === 'deck') { if (wer === 'klabauter') return inB('#dk-boot-akt .cr'); if (wer === 'backbord') return inB('#dk-boot-katze .cr'); return [...(bw() ? bw().querySelectorAll(FIG_DECK[wer] || `.cr-${wer}`) : [])].find(x => x.getBoundingClientRect().width > 0) || null; }
    return inB({hinnerk: '#fk-hinnerk', smilla: '#fk-smilla', klabauter: '#fk-klabauter', backbord: '#fk-backbord'}[wer] || `.cr-${wer}`);
  }
  function tippenDeck(e, n) {
    if (!da(n)) return;
    const a = akteurBei(e.clientX, e.clientY); if (a) return a.tipp();
    for (const w of ['hinnerk', 'smilla']) if (imRect(figurEl(w), e.clientX, e.clientY, 4)) return sprich(w, zufall(STIMME[w].moin), {anker: figurEl(w), menue: w});
    const b = inB('#dk-boot'); if (imRect(b, e.clientX, e.clientY)) (Opt.kajuete || (() => {}))();
  }

  /* ---------- Kajüte: Panorama zum Wischen, Dinge antippen = heranfahren, Hocker = in die Runde setzen ---------- */
  const PAN = {min: -430, max: 370, p: 0, K: 1.6, zuletzt: 0, merk: null};
  let ZOOM = null, busy = false;
  /* Dinge mit Funktion: Lage im Bild (box = x, y, Breite, Höhe in Bild-Koordinaten, ohne Verschiebung), Ebene d, wie voll sie die Nahansicht füllen, wer dazu spricht (SK9, R13) */
  const DING = {
    knoten: {sel: '#fk-knotenbrett', box: [157, 125, 86, 144], d: .12, fuell: [.98, .97], wer: 'hinnerk', clip: '13q5g7s', nah: 'knotenbrett'},
    karte: {sel: '#fk-tischplatte', box: [92, 357, 216, 52], d: .5, fuell: [.94, .6], wer: 'hinnerk', clip: '9y2xz6'},
    navi: {sel: '#fk-seekarte', box: [352, 134, 106, 66], d: .12, fuell: [.97, .7], wer: 'smilla', clip: '1t3a6ml', nah: 'seekarteWand'},
    manoever: {sel: '#fk-manoever', box: [372, 44, 82, 82], d: .12, fuell: [.96, .72], wer: 'smilla', clip: '1uxsomq', nah: 'manoeverbrett'},
    buch: {sel: '#fk-buecher', box: [-300, 117, 128, 98], d: .12, fuell: [.97, .66], nah: 'buecherregal'},
    telefon: {sel: '#fk-telefon', box: [-14, 126, 64, 86], d: .12, fuell: [.86, .66], wer: 'harms', clip: 'vzbq4f', nah: 'telefon'},
    kiste: {sel: '#fk-kiste', box: [516, 300, 140, 78], d: .3, fuell: [.9, .5]},
    hocker: {sel: '#fk-hocker', box: [168, 451, 64, 45], d: .75},
    tuer: {sel: '#fk-niedergang', box: [500, 38, 140, 340], d: .3, fuell: [.9, .9]}
  };
  const EGGS = {glocke: '#fk-glocke', baro: '#fk-baro', funk: '#fk-funk'};
  const SPOT = {telefon: 'telefon', knoten: 'knoten', navi: 'navi', manoever: 'manoever', buch: 'buch', karte: 'karte', hocker: 'hocker', tuer: 'tuer', kiste: 'kiste'};
  async function kajuete(el, opt = {}) {
    lebenStop(); stumm(); box = el; art = 'kajuete'; Opt = opt; ZOOM = null; busy = false; const n = ++nr; voxHaken();
    el.insertAdjacentHTML('beforeend', `<div class="bpano"><div></div></div><div class="bover"></div><div class="bdet"></div><div class="bvign"></div>
      <button class="bpf l" aria-label="nach links">‹</button><button class="bpf r" aria-label="nach rechts">›</button><button class="bfern fernglas" aria-label="Fernglas: zeigt, was man antippen kann">${FERN}</button>`);
    await buehne('kajuete', 'innen'); if (!da(n)) return;
    const s0 = PAN.merk != null ? PAN.merk : 0;
    FB().EINST.innen['b-totale'] = {df: .5, pan: s0}; FB().kamera('innen', 'b-totale', 'sofort');
    /* Dinge bekommen data-spot (für Tests und Tastatur); ein Klick darauf (oder das Antippen über dem Wisch-Streifen) führt zu tippen() */
    for (const [k, sp] of Object.entries(SPOT)) { const d = inB(DING[k].sel); if (d) d.setAttribute('data-spot', sp); }
    panoAufbauen(n, s0); texteLaden(); leben('kajuete', n);
    el.addEventListener('click', e => { if (!da(n)) return;
      const m = e.target.closest('[data-menue]'); if (m) { stumm(); return charMenu(m.dataset.menue); }
      const sp = e.target.closest('.bbuehne [data-spot]'); if (sp) return tippen({art: 'ding', k: Object.keys(SPOT).find(k => SPOT[k] === sp.dataset.spot)});
      onKlick(e, n); });
    if (opt.ziel && DING[opt.ziel]) setTimeout(() => { if (da(n)) ran(opt.ziel); }, 450);
  }
  function panoAufbauen(n, s0) {
    const pa = box.querySelector('.bpano'), K = FB().K, halb = box.clientWidth / K / 2, pmM = FB().kaj ? FB().kaj.pm.m : .9;
    Object.assign(PAN, {K, min: (-318 + halb - 200) / pmM, max: (662 - halb - 200) / pmM, p: Math.max(-1e4, s0)});
    PAN.p = Math.max(PAN.min, Math.min(PAN.max, PAN.p));
    pa.firstChild.style.width = ((PAN.max - PAN.min) * K + box.clientWidth) + 'px';
    pa.scrollLeft = (PAN.p - PAN.min) * K; FB().pan(PAN.p);
    let x0 = pa.scrollLeft, weg = PAN.merk != null;
    const pf = box.querySelectorAll('.bpf'); if (weg) pf.forEach(b => b.classList.add('weg'));
    pa.addEventListener('scroll', () => { PAN.zuletzt = performance.now(); PAN.p = PAN.min + pa.scrollLeft / PAN.K; PAN.merk = PAN.p; FB().pan(PAN.p); if (!weg && Math.abs(pa.scrollLeft - x0) > 12) { weg = true; pf.forEach(b => b.classList.add('weg')); } messeWischen(); }, {passive: true});
    box.querySelector('.bpf.l').onclick = () => pa.scrollBy({left: -box.clientWidth * .8, behavior: 'smooth'});
    box.querySelector('.bpf.r').onclick = () => pa.scrollBy({left: box.clientWidth * .8, behavior: 'smooth'});
    box.querySelector('.bfern').onclick = e => { e.stopPropagation(); fernglas(); };
    /* Maus am Rechner: ziehen zum Wischen */
    let d = null; pa.onpointerdown = e => { if (e.pointerType !== 'mouse') return; d = {x: e.clientX, s: pa.scrollLeft, moved: false}; };
    pa.onpointermove = e => { if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) d.moved = true; pa.scrollLeft = d.s - dx; };
    pa.onpointerup = () => setTimeout(() => { d = null; }, 0);
    pa.addEventListener('click', e => { if (d && d.moved) { e.stopPropagation(); e.preventDefault(); } }, true);
  }
  /* Selbstmessung (v5.82): ruckelt das Wischen auf diesem Gerät (Mittel der Bildabstände über 34 ms), schaltet die Bühne die leichte Stufe ein (ohne Unschärfe und Schatten) */
  const MESS = {an: false, fertig: false, d: []};
  function messeWischen() {
    if (MESS.fertig || MESS.an || !FB().leicht) return; MESS.an = true; let letzt = performance.now();
    const f = now => { if (performance.now() - PAN.zuletzt > 250) { MESS.an = false; return; } MESS.d.push(now - letzt); letzt = now;
      if (MESS.d.length >= 48) { const m = MESS.d.slice(4).sort((a, b) => a - b)[Math.floor((MESS.d.length - 4) / 2)]; MESS.fertig = true; MESS.an = false; if (m > 34) { FB().leicht(true); console.info('Bord: leichte Stufe (Bildabstand ' + Math.round(m) + ' ms)'); } return; }
      requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  function onKlick(e, n) {
    if (e.target.closest('[data-zurueck]')) return zurueck();
    const kn = e.target.closest('[data-knoten]'); if (kn) return knotenBlick(kn.dataset.knoten);
    const mn = e.target.closest('[data-manoever]'); if (mn) return tun('praxis');
    const bu = e.target.closest('[data-buch]'); if (bu) return buchAuf(bu.dataset.buch);
    const tu = e.target.closest('[data-tun]'); if (tu) return tun(tu.dataset.tun);
    const ru = e.target.closest('[data-runde]'); if (ru) return rundeKnopf(ru.dataset.runde);
    if (!e.target.closest('.bpano')) return;
    if (ZOOM) return;
    const t = treffer(e); if (t) tippen(t);
  }
  function treffer(e) {
    const x = e.clientX, y = e.clientY;
    const a = akteurBei(x, y); if (a) return {art: 'akteur', a};
    for (const w of ['klabauter', 'backbord', 'hinnerk', 'smilla']) if (imRect(figurEl(w), x, y, 0)) return {art: 'figur', k: w};
    for (const k of Object.keys(EGGS)) if (imRect(inB(EGGS[k]), x, y, 6)) return {art: 'egg', k};
    for (const k of Object.keys(DING)) if (imRect(inB(DING[k].sel), x, y, 6)) return {art: 'ding', k};
    return null;
  }
  let kajNr = 0;
  function tippen(t) {
    if (!t || busy) return;
    try { AUD.unlock(); AUD.click(); } catch (e) {}
    if (t.art === 'ding') return t.k === 'hocker' ? runde() : ran(t.k);
    if (t.art === 'akteur') return t.a.tipp();
    if (t.art === 'figur') {
      if (t.k === 'backbord') return katzeTipp();
      if (t.k === 'klabauter') return klabauterTipp();
      const S2 = STIMME[t.k]; kajNr++; return sprich(t.k, S2.kajuete[kajNr % S2.kajuete.length], {anker: figurEl(t.k), menue: t.k});
    }
    if (t.art === 'egg') {
      const el = inB(EGGS[t.k]);
      if (t.k === 'glocke') { const g = inB('#fk-glocke .glocke'); if (g) { g.classList.remove('laeuten'); void g.getBoundingClientRect(); g.classList.add('laeuten'); } sfx('glocke', {vol: .5}); if (Opt.tun && Opt.tun.glockeEi) Opt.tun.glockeEi(el); }
      if (t.k === 'baro' && Opt.tun && Opt.tun.baro) Opt.tun.baro(el);
      if (t.k === 'funk') sprich('smilla', null, {anker: el, text: 'Das Funkgerät kommt später, wenn du den Funkschein machst.'});
    }
  }
  function tun(k) { stumm(); const f = Opt.tun && Opt.tun[k]; if (f) f(); }
  function fernglas() {
    const over = box.querySelector('.bover');
    for (const k of Object.keys(DING)) { const el = inB(DING[k].sel); if (!el) continue; const r = relRect(el); if (r.x + r.w < 0 || r.x > box.clientWidth) continue; const m = Math.min(220, Math.max(r.w, r.h) + 18), kr = document.createElement('div');
      kr.className = 'bkringel'; Object.assign(kr.style, {left: (r.x + r.w / 2 - m / 2) + 'px', top: (r.y + r.h / 2 - m / 2) + 'px', width: m + 'px', height: m + 'px'}); over.appendChild(kr); setTimeout(() => kr.remove(), 2700); }
  }

  /* Heranfahren: so nah, dass das Ding fast den Bildschirm füllt; dann liegt dasselbe Ding scharf darüber. Die Verschiebung der Tiefe (data-off) wird mitgerechnet */
  function offVon(sel) { const el = inB(sel), w = el && el.closest('[data-off]'); return w ? +w.dataset.off || 0 : 0; }
  function zielFuer(D) {
    const W = box.clientWidth, H = box.clientHeight, K = FB().K, [x0, y, w, h] = D.box, x = x0 + offVon(D.sel), tiefe = .25 + .75 * D.d;
    const f = Math.min(W * D.fuell[0] / (w * K), (H - 150) * D.fuell[1] / (h * K)), z = 1 + (f - 1) / tiefe;
    return {z, fx: x + w / 2, fy: y + h / 2 + 34 / (K * f), df: D.d, pan: 0};
  }
  async function ran(k) {
    const D = DING[k]; if (busy || !box || !D) return; busy = true; stumm(); ZOOM = k;
    box.classList.add('zoom'); const det = box.querySelector('.bdet'); det.classList.remove('an'); det.innerHTML = '';
    FB().EINST.innen['b-' + k] = zielFuer(D);
    if (k === 'tuer') { sfx('schritte', {vol: .5}); await FB().kamera('innen', 'b-' + k, 'fahrt'); busy = false; ZOOM = null; return tun('tuer'); }
    await FB().kamera('innen', 'b-' + k, 'fahrt');
    if (!box || ZOOM !== k) { busy = false; return; }
    if (k === 'karte') await karteAuf(); else if (D.nah) await nahAuf(k, D);
    det.innerHTML = `<button class="bzur" data-zurueck>‹ Kajüte</button>` + (DETAIL[k] ? DETAIL[k]() : ''); requestAnimationFrame(() => det.classList.add('an'));
    busy = false;
    if (D.clip) sprich(D.wer, D.clip, {med: true});
  }
  async function zurueck() {
    if (busy || !box) return; busy = true; stumm(); const det = box.querySelector('.bdet'); det.classList.remove('an');
    const nah = box.querySelector('.bnah'), oben = box.querySelector('.boben'), boden = box.querySelector('.bboden'), kb = box.querySelector('.bkblick');
    if (kb) { cancelAnimationFrame(knotRaf); kb.remove(); }
    if (nah) { nah.classList.remove('fertig'); await nah.animate([{opacity: 1}, {opacity: 0}], {duration: 380, fill: 'forwards'}).finished; nah.remove(); }
    if (oben) { await kippen(false); oben.remove(); if (boden) boden.remove(); }
    FB().EINST.innen['b-totale'] = {df: .5, pan: PAN.p};
    await FB().kamera('innen', 'b-totale', 'fahrt'); det.innerHTML = ''; box.classList.remove('zoom'); ZOOM = null; busy = false;
  }
  /* Dasselbe Ding scharf darüber (Überblendung), mit Antipp-Feldern und Häkchen aus dem echten Lernstand */
  async function nahAuf(k, D) {
    const g = inB(D.sel); if (!g) return;
    const r = relRect(g), nah = document.createElement('div'); nah.className = 'bnah'; nah.dataset.k = k;
    Object.assign(nah.style, {left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px'});
    nah.innerHTML = `<svg viewBox="0 0 10 10" preserveAspectRatio="none"><g class="ni">${FB().teile[D.nah]()}</g></svg>`; box.querySelector('.bover').appendChild(nah);
    const bb = nah.querySelector('.ni').getBBox();
    const pc = (v, a, l) => ((v - a) / l * 100).toFixed(2) + '%', feld = (x, y, w, h, attr, ok) => `<button class="bfeld" ${attr} style="left:${pc(x, bb.x, bb.width)};top:${pc(y, bb.y, bb.height)};width:${(w / bb.width * 100).toFixed(2)}%;height:${(h / bb.height * 100).toFixed(2)}%">${ok ? '<span class="bok">✓</span>' : ''}</button>`;
    const T = FB().teile, ok = Opt.stand || {};
    let felder = '';
    if (k === 'knoten') { const B = T.BRETT, ix = B.x + 7, iy = B.y + 21, cw = (B.w - 14) / 3, ch = (B.h - 28) / 3;
      felder = T.KNOTEN_BRETT.map((kn, i) => feld(ix + (i % 3) * cw, iy + (i / 3 | 0) * ch, cw, ch, `data-knoten="${kn}" aria-label="${T.KNOTEN_SCHILD[kn].join(' ')}"`, (ok.knoten || {})[kn])).join(''); }
    if (k === 'manoever') felder = T.MANOEVER.map(([nm, id], i) => feld(377 + (i % 2) * 37, 61 + (i / 2 | 0) * 32, 35, 30, `data-manoever="${id}" aria-label="${nm}"`, (ok.manoever || {})[id])).join('');
    if (k === 'buch') { let bx = -297; felder = T.BUECHER.map(([t, , bwid]) => { const s = feld(bx, 122, bwid, 82, `data-buch="${t}" aria-label="${t}"`); bx += bwid + 1; return s; }).join(''); }
    nah.querySelector('svg').setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`); nah.insertAdjacentHTML('beforeend', felder);
    await nah.animate([{opacity: 0}, {opacity: 1}], {duration: 600, easing: 'ease-in-out', fill: 'forwards'}).finished;
    nah.getAnimations().forEach(a => a.cancel()); nah.style.opacity = 1; nah.classList.add('fertig');
  }
  const unten = (html, hoch) => `<div class="bdk" style="bottom:${hoch ? 84 : 26}px">${html}</div>`;
  const knopf = (tunK, text) => `<button class="blos" data-tun="${tunK}" style="bottom:26px">${text}</button>`;
  const DETAIL = {
    knoten: () => knopf('knoten', '🪢 Zur Knotenkunde'),
    navi: () => (Opt.abend ? unten(`<b>🌙 Abendwache offen</b><small>Kurs und Distanz am Kartentisch mit Smilla</small>`, true) + knopf('abend', 'Abendwache beginnen') : unten('<b>Navigationsschule</b><small>Lektionen, Übungen und Prüfung</small>', true) + knopf('navi', '🧭 Zur Navigationsschule')),
    manoever: () => unten('<b>Praxis im 3D-Fenster</b><small>Manöver antippen: üben mit der Frieda</small>', true) + knopf('praxis', '⚓ Manöver üben'),
    buch: () => unten('<b>Lernkartei und Meine Prüfungen</b><small>Buch antippen. Lesezeichen: rot neu, gelb geübt, grün sicher</small>', true) + knopf('buch', '📚 Meine Prüfungen'),
    telefon: () => unten('<b>Kapitän Harms</b><small>prüft dich wie in der echten Prüfung</small>', true) + knopf('tel', '☎️ Harms anrufen'),
    karte: () => unten(`<b>${Opt.reise ? Opt.reise.titel : 'Die Reise'}</b><small>${Opt.reise ? Opt.reise.zeile : 'Alle Folgen der Hörreise'}</small>`, true) + knopf('karte', '🗺️ Reise ansehen'),
    kiste: () => unten('<b>Seekiste</b><small>Spielekiste und alles zum freien Üben</small>', true) + `<button class="blos" data-tun="spiele" style="bottom:26px;left:30%">🎲 Spielekiste</button><button class="blos zweit" data-tun="frei" style="bottom:26px;left:72%">Frei üben</button>`
  };
  const BUCH_TUN = {'Meine Prüfungen': 'buch', 'Lernkartei': 'kartei', 'Seezeichen': 'seezeichen', 'Navigation': 'navi'};
  function buchAuf(t) { tun(BUCH_TUN[t] || 'kapitel'); }
  /* Knoten antippen: die echte Animation aus dem Knotenkurs läuft, darunter „Üben“ */
  let knotRaf = 0;
  function knotenBlick(kn) {
    const A = window.KNOTEN && KNOTEN.ANIM && KNOTEN.ANIM[kn]; if (!A) return tun('knoten');
    const d = document.createElement('div'); d.className = 'bkblick'; d.innerHTML = `<div class="p"><canvas width="${A.W * 2}" height="${A.H * 2}"></canvas><b>${FB().teile.KNOTEN_SCHILD[kn].join(' ')}</b><div class="r"><button class="blos klein" data-zu>Zurück zum Brett</button><button class="blos klein" data-tun="knoten">Üben</button></div></div>`;
    box.appendChild(d); requestAnimationFrame(() => d.classList.add('an'));
    const cv = d.querySelector('canvas'), cx = cv.getContext('2d'), t0 = performance.now();
    const lauf = now => { if (!d.isConnected) return; const t = ((now - t0) / 1000) % (A.DUR + 1.6); cx.setTransform(2, 0, 0, 2, 0, 0); A.draw(cx, Math.min(A.DUR, t)); knotRaf = requestAnimationFrame(lauf); };
    cancelAnimationFrame(knotRaf); knotRaf = requestAnimationFrame(lauf);
    d.addEventListener('click', e => { if (e.target.closest('[data-zu]') || e.target === d) { e.stopPropagation(); cancelAnimationFrame(knotRaf); d.remove(); } });
  }
  /* Seekarte am Tisch: heranfahren, dann kippt der Blick, bis man von oben auf den Tisch schaut */
  const TISCH_KIPP = Math.acos(26 / 108) * 180 / Math.PI;
  function tischOben() {
    const karte = window.BREDE && BREDE.svg && BREDE.daten ? BREDE.svg('K1', {routen: [1], vb: '30 180 240 320', par: 'xMidYMid slice'}).replace('<svg ', '<svg x="-60" y="-80" width="120" height="160" ') : '';
    const aermel = (x, y, r, c) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-7" y="-26" width="14" height="30" rx="6" fill="${c}" stroke="#1a1208" stroke-width="1"/><ellipse cx="0" cy="6" rx="6.5" ry="5.5" fill="#efc19c" stroke="#5a3a22" stroke-width="1"/></g>`;
    const becher = (x, y, c, band) => `<g transform="translate(${x} ${y})"><circle r="8" fill="${c}" stroke="#2a1a0e" stroke-width="1"/><circle r="6" fill="#5a3418"/><circle r="8" fill="none" stroke="${band}" stroke-width="1.6" opacity=".8"/><ellipse cx="-1.6" cy="-1.6" rx="2" ry="1.2" fill="#fff" opacity=".35"/></g>`;
    return `<svg viewBox="-108 -108 216 216"><defs><radialGradient id="bo-holz" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#b48352"/><stop offset="1" stop-color="#8a5f38"/></radialGradient><clipPath id="bo-k"><rect x="-60" y="-80" width="120" height="160"/></clipPath><clipPath id="bo-t"><circle r="108"/></clipPath></defs>
      <circle r="108" fill="#946640" stroke="#3a2412" stroke-width="2.4"/><circle r="101" fill="url(#bo-holz)"/>${[-80, -50, -20, 10, 40, 70].map(y => `<path d="M-100 ${y} Q0 ${y + 6} 100 ${y}" stroke="#7a5233" stroke-width=".8" fill="none" opacity=".45"/>`).join('')}
      <rect x="-57" y="-76" width="120" height="160" fill="#000" opacity=".2"/><g clip-path="url(#bo-k)"><rect x="-60" y="-80" width="120" height="160" fill="#fbf8ef"/>${karte}</g><rect x="-60" y="-80" width="120" height="160" fill="none" stroke="#5a3a1c" stroke-width="1.2"/>
      <g transform="translate(34 50) rotate(-30)"><path d="M0 0 L-6 -40 M0 0 L6 -40" stroke="#6a6a6a" stroke-width="2.2"/><circle r="3.4" fill="#c9a03c"/></g><g transform="translate(-30 64) rotate(12)"><rect x="-34" y="-5" width="68" height="10" rx="2" fill="#c9b78a" stroke="#6a5a3a" stroke-width="1" opacity=".92"/>${Array.from({length: 13}, (_, i) => `<path d="M${-31 + i * 5} -5 v${i % 2 ? 2 : 3.5}" stroke="#6a5a3a" stroke-width=".6"/>`).join('')}</g>
      ${becher(0, 92, '#f3efe6', '#e8a33c')}
      <g clip-path="url(#bo-t)">${aermel(-64, -92, -18, '#34465f')}${aermel(-34, -96, 14, '#34465f')}${becher(-48, -78, '#e9e1cf', '#2f5f8a')}
        ${aermel(48, -94, -14, '#c8503c')}${aermel(74, -88, 20, '#c8503c')}${becher(88, -62, '#c8503c', '#f3ead2')}<g transform="translate(40 -70) rotate(28)"><rect x="-1.4" y="-15" width="2.8" height="22" rx=".8" fill="#e8b33c" stroke="#3a2a1c" stroke-width=".6"/><path d="M-1.4 7 l1.4 3.4 l1.4 -3.4z" fill="#3a2a1c"/></g></g></svg>`;
  }
  async function kippen(hin) {
    const o = box.querySelector('.boben'), bo = box.querySelector('.bboden'), W = box.clientWidth, H = box.clientHeight;
    const r = JSON.parse(o.dataset.r), s = Math.min(W * .94 / 120, (H - 230) / 160) * 216 / r.w;
    const ziel = `translate(${W / 2 - (r.x + r.w / 2)}px,${(H - 150) / 2 + 10 - (r.y + r.h / 2)}px) perspective(2600px) rotateX(0deg) scale(${s})`, start = `translate(0px,0px) perspective(2600px) rotateX(${TISCH_KIPP.toFixed(1)}deg) scale(1)`;
    const k = [{transform: start}, {transform: ziel}], b = [{opacity: 0}, {opacity: 1}], opt = {duration: hin ? 2100 : 1200, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards'};
    if (!hin) { k.reverse(); b.reverse(); }
    await Promise.all([o.animate(k, opt).finished, bo.animate(b, {...opt, duration: opt.duration * .8}).finished]);
  }
  async function karteAuf() {
    const pl = inB('#fk-tischplatte'); if (!pl) return;
    const r = relRect(pl), o = document.createElement('div'), bo = document.createElement('div');
    bo.className = 'bboden'; o.className = 'boben'; o.dataset.r = JSON.stringify(r);
    Object.assign(o.style, {left: r.x + 'px', top: (r.y + r.h / 2 - r.w / 2) + 'px', width: r.w + 'px', height: r.w + 'px', transform: `perspective(2600px) rotateX(${TISCH_KIPP.toFixed(1)}deg)`});
    o.innerHTML = tischOben(); box.querySelector('.bover').append(bo, o);
    await o.animate([{opacity: 0}, {opacity: 1}], {duration: 450, fill: 'forwards'}).finished;
    await kippen(true);
  }
  /* Hocker: sich in die Runde setzen (Nutzer 23.11.2026: „nicht auf den Stuhl zoomen, sondern auf den Tisch und die Leute“): Blick auf Augenhöhe, vor dir dein Becher, unten die Hörreise */
  async function runde() {
    if (busy || !box) return; busy = true; stumm(); ZOOM = 'hocker'; box.classList.add('zoom');
    const det = box.querySelector('.bdet'); det.classList.remove('an'); det.innerHTML = '';
    const H = box.clientHeight, W = box.clientWidth, K = FB().K, z = Math.max(1.25, Math.min(1.6, W / (K * 196) / .625 - .6 / .625 + 1));
    FB().EINST.innen['b-runde'] = {z, fx: 200, fy: 322 + 60 / (K * (1 + (z - 1) * .625)) * (H > 700 ? 1 : .6), df: .5, pan: 0};
    sfx('schritte', {vol: .35});
    await FB().kamera('innen', 'b-runde', 'fahrt'); if (!box || ZOOM !== 'hocker') { busy = false; return; }
    det.innerHTML = `<button class="bzur" data-zurueck>‹ Kajüte</button>` + rundeHtml(); requestAnimationFrame(() => det.classList.add('an'));
    busy = false;
    sprich('smilla', '1tr739f', {anker: figurEl('smilla')});
  }
  function rundeHtml() {
    const r = Opt.runde || {}, reden = !!(S.cfg && S.cfg.zuruf), harms = !(S.cfg && S.cfg.kurs && S.cfg.kurs.harms === false);
    return `<div class="brunde"><div class="bfolge"><small>${r.alle ? 'Alle Folgen gehört' : 'Weiter mit der Crew'} · Folge ${r.nr || ''}</small><b>${r.titel || 'Hörreise'}</b></div>
      <button class="bplay" data-runde="play" aria-label="Folge starten">▶</button>
      <div class="bschalter"><button data-runde="reden" aria-pressed="${reden}">🗣️ mitsprechen</button><button data-runde="ohr" aria-pressed="${!reden}">👂 nur hören</button><button data-runde="harms" aria-pressed="${harms}">Harms ${harms ? 'an' : 'aus'}</button></div>
      <div class="bmehr"><button data-runde="andere">Andere Folge</button><button data-runde="film">🎬 Filmprobe</button></div></div>`;
  }
  function rundeKnopf(k) {
    try { AUD.unlock(); AUD.click(); } catch (e) {}
    const r = Opt.runde || {};
    if (k === 'play') { stumm(); return r.play && r.play(); }
    if (k === 'andere') { stumm(); return r.andere && r.andere(); }
    if (k === 'film') { stumm(); return r.film && r.film(); }
    if (k === 'reden' || k === 'ohr') { S.cfg.zuruf = k === 'reden'; save(); }
    if (k === 'harms') { S.cfg.kurs = S.cfg.kurs || {}; S.cfg.kurs.harms = S.cfg.kurs.harms === false; save(); }
    const ru = box.querySelector('.brunde'); if (ru) ru.outerHTML = rundeHtml();
  }

  /* ---------- Leben an Bord (v5.82, E36): ein Taktgeber, höchstens ein Auftritt zugleich, dazwischen 15 bis 45 Sekunden Ruhe; beim Wischen, Heranfahren und im Hintergrund ruht alles ---------- */
  let L = null;
  const akteure = new Set();
  function lebenStop() { if (L) { cancelAnimationFrame(L.raf); L.aus = true; } L = null; akteure.clear(); }
  const ruhig = () => !L || L.aus || !da(L.n) || document.hidden || ZOOM || busy || performance.now() - PAN.zuletzt < 700;
  function akteurBei(x, y) { for (const a of akteure) if (a.g && a.g.isConnected && imRect(a.g, x, y, 10)) return a; return null; }
  /* Darsteller: eine Gruppe in einer Ebene, bewegt per transform, gezeichnet höchstens 12-mal je Sekunde */
  function darsteller(g, o) {
    const a = {g, x: o.x, y: o.y, s: o.s || 1, flip: o.flip || 1, pose: o.pose || 'sitzen', t: 0, zeich: o.zeich, tipp: o.tipp || (() => {}), letzt: -1, alt: ''};
    a.setze = () => { a.g.setAttribute('transform', `translate(${r1(a.x)} ${r1(a.y)}) scale(${r1(a.flip * a.s * 100) / 100} ${r1(a.s * 100) / 100})`); };
    a.mal = (now, zwang) => { if (!zwang && now - a.letzt < 83) return; a.letzt = now; const h = a.zeich(a); if (h !== a.alt) { a.g.innerHTML = h; a.alt = h; } };
    a.setze(); a.mal(0, true); return a;
  }
  /* bewegt a zur Stelle zx (und zy) mit tempo (Einheiten je Sekunde); gangT = Schritte je Einheit; Bogen = Flughöhe */
  function bewege(a, zx, zy, tempo, o = {}) {
    const n0 = L && L.n, x0 = a.x, y0 = a.y, dist = Math.hypot(zx - x0, zy - y0), dauer = Math.max(120, dist / tempo * 1000), t0 = performance.now();
    a.flip = zx < x0 ? -1 * (o.spiegel ? -1 : 1) : (o.spiegel ? -1 : 1);
    return new Promise(res => { const tick = now => {
      if (!L || L.aus || L.n !== n0 || !a.g.isConnected) return res(false);
      const u = Math.min(1, (now - t0) / dauer), e = o.lin ? u : u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      a.x = x0 + (zx - x0) * e; a.y = y0 + (zy - y0) * e - (o.bogen ? Math.sin(u * Math.PI) * o.bogen : 0);
      a.t = (now - t0) / 1000 * (o.takt || 2); a.setze(); a.mal(now);
      if (u >= 1) return res(true); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  }
  async function pose(a, p, ms, takt = 1) { const n0 = L && L.n, t0 = performance.now(); a.pose = p; a.mal(0, true);
    while (L && !L.aus && L.n === n0 && performance.now() - t0 < ms) { await new Promise(r => requestAnimationFrame(r)); a.t = (performance.now() - t0) / 1000 * takt; a.mal(performance.now()); } return !!(L && L.n === n0); }
  const kx = (x, pmName) => x + (FB().kaj ? FB().kaj.off(x, FB().kaj.pm[pmName]) : 0);
  /* Bildschirm-x (in Bühneneinheiten) eines Punktes einer Ebene beim jetzigen Wischweg, und zurück */
  const pmVon = name => FB().kaj ? FB().kaj.pm[name] : 1;
  const sichtbar = (xL, pmName, rand = 0) => { const halb = box.clientWidth / FB().K / 2, s = xL - PAN.p * pmVon(pmName); return s > 200 - halb - rand && s < 200 + halb + rand; };
  const umrechnen = (xL, von, nach) => xL + PAN.p * (pmVon(nach) - pmVon(von));

  function leben(wo, n) {
    lebenStop(); L = {wo, n, aus: false, naechst: performance.now() + (weniger() ? 9000 : 3500 + Math.random() * 4000), fabelZuletzt: performance.now() - 60000, auftritt: null};
    if (wo === 'kajuete') kajueteLeben(); else deckLeben();
    const tick = now => {
      if (!L || L.aus) return; if (!da(L.n)) { lebenStop(); return; }
      if (now - PAN.zuletzt > 400) for (const a of akteure) if (a.ruhend) a.mal(now);
      if (!L.auftritt && now > L.naechst && !ruhig()) {
        const liste = (L.wo === 'kajuete' ? KAJ_AUF : DECK_AUF).filter(x => (!x.fabel || now - L.fabelZuletzt > 100000) && (!x.nur || x.nur()) && !(weniger() && x.unruhig));
        let summe = liste.reduce((s, x) => s + x.w, 0), r = Math.random() * summe, w = liste[0];
        for (const x of liste) { r -= x.w; if (r <= 0) { w = x; break; } }
        if (w) { if (w.fabel) L.fabelZuletzt = now; L.auftritt = w.name; const n0 = L.n;
          Promise.resolve().then(w.los).catch(e => console.warn('Bord-Auftritt', w.name, e)).finally(() => { if (L && L.n === n0) { L.auftritt = null; L.naechst = performance.now() + (15000 + Math.random() * 30000) * (weniger() ? 2 : 1); } }); }
      }
      L.raf = requestAnimationFrame(tick);
    };
    L.raf = requestAnimationFrame(tick);
  }

  /* --- Kajüte: Darsteller --- */
  const MAUS = {s: 1.25, y: 378};
  let katze = null, papagei = null, wurm = null;
  const KATZE_PLATZ = [[118, 490], [300, 494], [150, 496]];
  const PAPAGEI_PLATZ = [[302, 110, 'stange'], [98, 110, 'stange'], [27, 62, 'uhr'], [-232, 117, 'regal'], [430, 128, 'karte']];
  function kajueteLeben() {
    const kl = inB('#fk-klabauter'), bb = inB('#fk-backbord'), wu = inB('#kj-wurm'), mz = inB('#kj-maeuse');
    if (mz) mz.innerHTML = '';
    if (bb) { katze = darsteller(bb, {x: 118, y: 490, s: 1.65, zeich: a => F().figur('backbord', {pose: a.pose, gang: a.gang ? {art: a.gang, t: a.t % 1} : null, dreh: a.pose === 'sitzen'}), tipp: katzeTipp}); katze.platz = 0; akteure.add(katze); }
    if (kl) { papagei = darsteller(kl, {x: 302, y: 110, s: 1.3, zeich: a => F().figur('klabauter', {pose: a.pose, t: a.t % 1, dreh: a.pose !== 'fliegen'}), tipp: klabauterTipp}); papagei.platz = 0; akteure.add(papagei); }
    if (wu) { wurm = darsteller(wu, {x: 206, y: 297, s: .95, zeich: a => F().figur('knotenwurm', {dreh: false, t: a.t % 1}), tipp: () => wurmFlucht()}); wurm.ruhend = true; wurm.zeich = a => { a.t = performance.now() / 2000; return F().figur('knotenwurm', {dreh: false, t: a.t % 1}); }; akteure.add(wurm); }
  }
  function loecher() {
    return [...(bw() ? bw().querySelectorAll('[data-loch]') : [])].map(el => { const w = el.closest('[data-off]'); return {n: el.dataset.loch, x: +el.dataset.lx + (w ? +w.dataset.off || 0 : 0)}; });
  }
  const KAJ_AUF = [
    {name: 'maus', w: 4, los: () => mausLauf()},
    {name: 'klabauter', w: 2.4, los: () => klabauterFlug()},
    {name: 'katze', w: 2, los: () => katzeTun()},
    {name: 'wurm', w: 1, fabel: true, unruhig: true, los: () => wurmTour()},
    {name: 'qualle', w: 1, fabel: true, unruhig: true, los: () => quallchenFlug()},
    {name: 'kruemel', w: 1, fabel: true, unruhig: true, los: () => kruemelHops()},
    {name: 'wicht', w: 1, fabel: true, unruhig: true, los: () => wichtTisch()},
    {name: 'puschel', w: 1, fabel: true, los: () => puschelVorbei()},
    {name: 'floh', w: 1.2, fabel: true, unruhig: true, nur: () => lichtJetzt() === 'nacht', los: () => flohLampe()}
  ];
  async function mausLauf() {
    const L0 = loecher(), sicht = L0.filter(h => sichtbar(h.x, 'm', -6));
    if (sicht.length && Math.random() < .75) return mausHinten(L0, zufall(sicht));
    return mausVorn();
  }
  const mausFamilie = () => Math.random() < .45 ? ['mausmutter', 'mauskind'] : [zufall(['mausmutter', 'mausvater', 'mauskind'])];
  function maeuseAnlegen(cont, ids, x, y, s, flip) {
    return ids.map((id, i) => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); cont.appendChild(g);
      const m = darsteller(g, {x, y, s: s * (i ? .9 : 1), pose: 'schnuppern', zeich: a => F().figur(id, {pose: a.pose, t: a.t % 1, gang: a.pose === 'laufen' || a.pose === 'springen' ? {t: a.t % 1} : null, dreh: false})});
      m.flip = flip; m.setze(); akteure.add(m); return m; });
  }
  /* hinten an der Fußleiste: aus einem Loch, das man sieht, zum nächsten Loch */
  async function mausHinten(L0, von) {
    const rest = L0.filter(h => h !== von).sort((a, b) => Math.abs(a.x - von.x) - Math.abs(b.x - von.x)), nach = Math.random() < .7 ? rest[0] : zufall(rest);
    const cont = inB('#kj-akt-m'); if (!cont || !nach) return;
    const mz = maeuseAnlegen(cont, mausFamilie(), von.x, MAUS.y, MAUS.s, nach.x < von.x ? -1 : 1);
    mz.forEach(m => { m.ziel = nach; m.tipp = () => mausFlucht(m, 'm'); });
    sfx('piep', {vol: .12});
    await pose(mz[0], 'schnuppern', 900);
    if (katze && !katze.jagt && sichtbar(nach.x, 'm', -20) && Math.random() < .45) katzenJagd(umrechnen(nach.x, 'm', 'vorn'));
    await Promise.all(mz.map((m, i) => warte(i * 380).then(async () => { if (m.flieht) return; m.pose = 'laufen';
      if (Math.random() < .3) { const mitte = m.x + (nach.x - m.x) * (.35 + Math.random() * .3); await bewege(m, mitte, MAUS.y, 120, {takt: 5, lin: true}); if (!m.flieht) { await pose(m, 'putzen', 900, 1.2); m.pose = 'laufen'; } }
      if (!m.flieht) await bewege(m, nach.x, MAUS.y, 110, {takt: 5, lin: true}); })));
    await Promise.all(mz.map(m => m.weg || verschwinde(m)));
  }
  /* vorn über den Teppich (Nutzer: „laufen manchmal durchs Bild an verschiedenen Stellen … verschwinden hinter etwas oder laufen aus dem Bild“) */
  async function mausVorn() {
    const cont = inB('#kj-akt-v'); if (!cont) return;
    const halb = box.clientWidth / FB().K / 2, pm = pmVon('vorn'), xs = sx => sx + PAN.p * pm, vonL = Math.random() < .5, y = 497;
    const x0 = xs(vonL ? 200 - halb - 24 : 200 + halb + 24), x1 = xs(vonL ? 200 + halb + 40 : 200 - halb - 40);
    const mz = maeuseAnlegen(cont, mausFamilie(), x0, y, 1.9, vonL ? 1 : -1);
    mz.forEach(m => { m.ziel = {x: x1}; m.tipp = () => mausFlucht(m, 'vorn'); });
    if (katze && !katze.jagt && Math.random() < .5) setTimeout(() => katzenJagd(xs(vonL ? 200 + halb - 34 : 200 - halb + 34)), 900);
    await Promise.all(mz.map((m, i) => warte(i * 300).then(async () => { if (m.flieht) return; m.pose = 'laufen';
      if (Math.random() < .6) { await bewege(m, x0 + (x1 - x0) * (.38 + Math.random() * .2), y, 105, {takt: 5, lin: true}); if (!m.flieht) { await pose(m, 'schnuppern', 1300, 1.4); m.pose = 'laufen'; } }
      if (!m.flieht) await bewege(m, x1, y, 115, {takt: 5, lin: true}); })));
    mz.forEach(m => { if (!m.weg) { m.g.remove(); akteure.delete(m); } });
    await Promise.all(mz.map(m => m.weg).filter(Boolean));
  }
  async function verschwinde(m) { if (!m.g.isConnected) return; const s0 = m.s; for (let i = 1; i <= 6; i++) { m.s = s0 * (1 - i / 7); m.setze(); await warte(30); } m.g.remove(); akteure.delete(m); }
  function mausFlucht(m, ebene) {
    if (m.flieht) return; m.flieht = true; sfx('piep', {vol: .2});
    if (ebene === 'vorn') { const halb = box.clientWidth / FB().K / 2, pm = pmVon('vorn'), sx = m.x - PAN.p * pm, links = sx < 200, zx = (links ? 200 - halb - 50 : 200 + halb + 50) + PAN.p * pm;
      m.weg = (async () => { m.pose = 'springen'; await bewege(m, zx, m.y, 320, {takt: 8, lin: true}); m.g.remove(); akteure.delete(m); })(); return; }
    const L0 = loecher(), ziel = L0.sort((a, b) => Math.abs(a.x - m.x) - Math.abs(b.x - m.x))[0];
    m.weg = (async () => { m.pose = 'springen'; await bewege(m, ziel ? ziel.x : m.x + 300, MAUS.y, 280, {takt: 7, lin: true}); await verschwinde(m); })();
  }
  /* Backbord jagt: läuft vorn mit (eigene Ebene), bleibt vor dem Loch sitzen, schleicht dann zurück */
  async function katzenJagd(zielX) {
    if (!katze || katze.jagt || katze.springt) return; katze.jagt = true;
    try {
      await pose(katze, 'strecken', 350);
      katze.pose = 'laufen'; katze.gang = 'rennen';
      await bewege(katze, zielX, 494, 210, {takt: 3.4});
      katze.gang = null; await pose(katze, 'sitzen', 4500);
      if (Math.random() < .5) await pose(katze, 'putzen', 2200, 1);
      const [px, py] = KATZE_PLATZ[katze.platz]; katze.pose = 'laufen'; katze.gang = 'schleichen'; await bewege(katze, px, py, 60, {takt: 1.4, lin: true});
      katze.gang = null; katze.pose = 'sitzen'; katze.flip = 1; katze.setze(); katze.mal(0, true);
    } finally { if (katze) katze.jagt = false; }
  }
  async function katzeTun() {
    if (!katze || katze.jagt) return; const r = Math.random();
    if (r < .35) { await pose(katze, 'putzen', 4200, 1); }
    else if (r < .6) { await pose(katze, 'liegen', 9000, .6); }
    else { katze.jagt = true; await pose(katze, 'strecken', 900); const neu = (katze.platz + 1 + Math.floor(Math.random() * (KATZE_PLATZ.length - 1))) % KATZE_PLATZ.length, [px, py] = KATZE_PLATZ[neu];
      katze.pose = 'laufen'; katze.gang = 'schleichen'; await bewege(katze, px, py, 55, {takt: 1.4, lin: true}); katze.platz = neu; katze.gang = null; katze.jagt = false; }
    if (katze) { katze.pose = 'sitzen'; katze.flip = 1; katze.setze(); katze.mal(0, true); }
  }
  function katzeTipp() {
    if (!katze || katze.springt) return; sfx(zufall(['katze', 'katze2', 'katze3']), {vol: .5}); katze.springt = true;
    const neu = (katze.platz + 1) % KATZE_PLATZ.length, [px, py] = KATZE_PLATZ[neu];
    (async () => { katze.pose = 'springen'; await bewege(katze, px, py, 260, {bogen: 26, takt: 1}); katze.platz = neu; katze.pose = 'sitzen'; katze.flip = 1; katze.setze(); katze.mal(0, true); katze.springt = false; })();
  }
  async function klabauterFlug(neu) {
    if (!papagei || papagei.fliegt) return; papagei.fliegt = true;
    const frei = PAPAGEI_PLATZ.map((p, j) => j).filter(j => j !== papagei.platz), gesehen = frei.filter(j => sichtbar(kx(PAPAGEI_PLATZ[j][0], 'w2'), 'w2', -16));
    const i = neu != null ? neu : (gesehen.length && Math.random() < .8 ? zufall(gesehen) : zufall(frei)), [px, py] = PAPAGEI_PLATZ[i];
    sfx('papagei', {vol: .25}); papagei.pose = 'fliegen';
    await bewege(papagei, kx(px, 'w2'), py, 150, {bogen: 40, takt: 3});
    papagei.platz = i; papagei.pose = 'sitzen'; papagei.flip = px > 200 ? -1 : 1; papagei.setze(); papagei.mal(0, true); papagei.fliegt = false;
  }
  function klabauterTipp() {
    if (!papagei) return; const S2 = STIMME.klabauter; kajNr++;
    sprich('klabauter', S2.kajuete[kajNr % S2.kajuete.length], {anker: papagei.g, menue: 'klabauter'}).then(() => { if (Math.random() < .35 && !ZOOM) klabauterFlug(); });
  }
  /* Fabelwesen: selten, eins zur Zeit. Jedes flieht angetippt auf seine Art */
  async function wurmTour() {
    if (!wurm) return; wurm.ruhend = false; const x0 = wurm.x;
    wurm.zeich = a => F().figur('knotenwurm', {dreh: false, t: a.t % 1});
    await bewege(wurm, 296, 297, 9, {takt: .5, lin: true});
    const st = inB('#kj-buchstapel'); if (st && wurm.x > 290) { st.classList.add('kipp'); sfx('blaettern', {vol: .3}); await warte(900); }
    await pose(wurm, 'x', 1200, .8);
    await bewege(wurm, x0, 297, 12, {takt: .6, lin: true});
    if (st) st.classList.remove('kipp');
    wurm.zeich = a => { a.t = performance.now() / 2000; return F().figur('knotenwurm', {dreh: false, t: a.t % 1}); }; wurm.ruhend = true; wurm.flip = 1; wurm.setze();
  }
  function wurmFlucht() { if (!wurm || wurm.flieht) return; wurm.flieht = true; wurm.ruhend = false; const x0 = wurm.x;
    (async () => { await bewege(wurm, x0 - 70, 300, 60, {takt: 2.4}); await warte(2500); await bewege(wurm, x0, 297, 20, {takt: 1}); wurm.ruhend = true; wurm.flieht = false; wurm.flip = 1; wurm.setze(); })(); }
  function fabelDarsteller(contSel, id, o) {
    const cont = inB(contSel); if (!cont) return null; const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); cont.appendChild(g);
    const a = darsteller(g, {x: o.x, y: o.y, s: o.s || 1, pose: o.pose, zeich: o.zeich || (b => F().figur(id, {pose: b.pose, t: b.t % 1, gang: {t: b.t % 1}, dreh: false, ...(b.extra || {})}))});
    a.tipp = () => { if (a.flieht) return; a.flieht = true; (o.flucht || (() => {}))(a); }; akteure.add(a); return a;
  }
  const weg = a => { if (a && a.g) a.g.remove(); akteure.delete(a); };
  async function quallchenFlug() {
    const a = fabelDarsteller('#kj-akt-t', 'quallchen', {x: 20, y: -10, s: 1.5, flucht: async b => { await bewege(b, b.x + 40, -120, 260, {takt: 3}); weg(b); }}); if (!a) return;
    await bewege(a, 178, 112, 26, {takt: .5});
    if (a.flieht) return;
    const la = inB('.fk-lampe'); if (la) { la.classList.add('stoss'); setTimeout(() => la.classList.remove('stoss'), 2600); }
    a.extra = {mund: 'oh'}; await pose(a, 'x', 1400, .6); a.extra = null;
    if (!a.flieht) { await bewege(a, 420, -40, 30, {takt: .5}); weg(a); }
  }
  async function kruemelHops() {
    const a = fabelDarsteller('#kj-akt-v', 'sandkruemel', {x: -60, y: 512, s: 1.7, flucht: async b => { await bewege(b, b.x + 360, 512, 300, {takt: 4}); weg(b); }}); if (!a) return;
    await bewege(a, 150, 512, 36, {takt: 1.6, lin: true});
    if (a.flieht) return;
    a.flip = 1; await pose(a, 'x', 2200, 2.2);
    if (!a.flieht) { await bewege(a, 480, 512, 40, {takt: 1.6, lin: true}); weg(a); }
  }
  async function wichtTisch() {
    const off = offVon('#fk-funk'), a = fabelDarsteller('#kj-akt-m', 'muschelwicht', {x: 352 + off, y: 267, s: 1.05, flucht: async b => { b.extra = null; await bewege(b, b.x + 160, 267, 160, {takt: 4}); weg(b); }}); if (!a) return;
    await bewege(a, 440 + off, 267, 14, {takt: .9, lin: true});
    if (a.flieht) return;
    const d = inB('#kj-dose'); if (d) { d.classList.add('kipp'); sfx('bleistift', {vol: .3, dur: .6}); }
    await pose(a, 'x', 1800, .5);
    if (!a.flieht) { await bewege(a, 520 + off, 267, 16, {takt: .9, lin: true}); weg(a); }
    if (d) setTimeout(() => d.classList.remove('kipp'), 4000);
  }
  async function puschelVorbei() {
    const p = inB('#kj-puschel'); if (!p) return; const t0 = performance.now(), n0 = L.n;
    while (L && L.n === n0 && performance.now() - t0 < 14000) { const u = (performance.now() - t0) / 14000, x = -77 - 46 + u * 92, t = (performance.now() - t0) / 1000;
      p.innerHTML = `<g transform="translate(${r1(x)} ${r1(96 + Math.sin(t * .9) * 3)}) scale(1.1)">${F().figur('nebelpuschel', {dreh: false, t: t * .3 % 1})}</g>`; await warte(90); }
    p.innerHTML = '';
  }
  async function flohLampe() {
    const a = fabelDarsteller('#kj-akt-t', 'leuchtfloh', {x: 200, y: 60, s: 1.2, flucht: async b => { await bewege(b, 480, -60, 280, {takt: 6}); weg(b); }}); if (!a) return;
    const t0 = performance.now(); while (!a.flieht && L && performance.now() - t0 < 12000) { const t = (performance.now() - t0) / 1000; a.x = 200 + Math.cos(t * 1.4) * 34; a.y = 70 + Math.sin(t * 1.4) * 10; a.flip = Math.sin(t * 1.4) > 0 ? -1 : 1; a.t = t * 2; a.setze(); a.mal(performance.now()); await new Promise(r => requestAnimationFrame(r)); }
    if (!a.flieht) weg(a);
  }

  /* --- Deck: Möwen, Klabauter und Backbord im Boot, Muschelwichte am Steg --- */
  let dKatze = null, dPapagei = null;
  const PFAEHLE = [[22, 236], [318, 232]];
  const DECK_AUF = [
    {name: 'moewe', w: 4, los: () => moeweLandet()},
    {name: 'klabauter', w: 2, los: () => deckKlabauter()},
    {name: 'katze', w: 1.6, los: () => deckKatze()},
    {name: 'wichte', w: 1, fabel: true, unruhig: true, los: () => wichteSteg()}
  ];
  function deckLeben() {
    const kz = inB('#dk-boot-katze'), ak = inB('#dk-boot-akt');
    /* Backbord: in Bug-rechts-Koordinaten des Boots (boot.js spiegelt), Ursprung wie bisher (−6, −56), Maß .46 gespiegelt */
    if (kz) { dKatze = darsteller(kz, {x: -6, y: -56, s: .46, flip: -1, zeich: a => F().figur('backbord', {pose: a.pose, gang: a.gang ? {art: a.gang, t: a.t % 1} : null, dreh: a.pose === 'sitzen'})}); dKatze.tipp = () => { sfx('katze', {vol: .45}); pose(dKatze, 'strecken', 1200).then(() => { dKatze.pose = 'sitzen'; dKatze.mal(0, true); }); }; akteure.add(dKatze); }
    if (ak) { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); ak.appendChild(g);
      dPapagei = darsteller(g, {x: -30, y: -62, s: .42, flip: -1, zeich: a => F().figur('klabauter', {pose: a.pose, t: a.t % 1, dreh: a.pose !== 'fliegen'})});
      dPapagei.tipp = () => sprich('klabauter', zufall(STIMME.klabauter.moin), {anker: dPapagei.g, menue: 'klabauter'}); akteure.add(dPapagei); }
  }
  async function moeweLandet() {
    const [px, py] = zufall(PFAEHLE), von = px < 200 ? -60 : 480;
    const a = fabelDarsteller('#dk-akt-steg', 'moewe', {x: von, y: py - 70, s: .62, pose: 'fliegen', flucht: async b => { sfx('moewe', {vol: .35}); b.pose = 'fliegen'; await bewege(b, b.x < 200 ? -80 : 500, b.y - 90, 170, {takt: 3}); weg(b); }}); if (!a) return;
    a.zeich = b => F().figur('moewe', {pose: b.pose, t: b.t % 1, gang: {t: b.t % 1}, dreh: false});
    await bewege(a, px, py, 90, {takt: 3});
    if (a.flieht) return;
    a.pose = 'stehen'; a.flip = px < 200 ? 1 : -1; a.setze(); a.mal(0, true);
    await pose(a, 'stehen', 3000 + Math.random() * 4000);
    if (!a.flieht && Math.random() < .55) { sfx('moewe', {vol: .3}); await pose(a, 'schreien', 1400, 1); }
    if (!a.flieht) await pose(a, 'sitzen', 6000 + Math.random() * 8000);
    if (!a.flieht) { a.pose = 'fliegen'; await bewege(a, px < 200 ? 520 : -100, py - 120, 80, {takt: 3}); weg(a); }
  }
  async function deckKlabauter() {
    if (!dPapagei) return; const r = Math.random();
    if (r < .5) { const zx = zufall([-30, 40, -70]), zy = zx === 40 ? -40 : -62; dPapagei.pose = 'fliegen'; await bewege(dPapagei, zx, zy, 60, {bogen: 30, takt: 3, spiegel: true}); dPapagei.pose = 'sitzen'; dPapagei.mal(0, true); }
    else { await pose(dPapagei, 'fliegen', 1600, 3); dPapagei.pose = 'sitzen'; dPapagei.mal(0, true); }
  }
  async function deckKatze() {
    if (!dKatze) return; const r = Math.random();
    await pose(dKatze, r < .4 ? 'putzen' : r < .75 ? 'liegen' : 'strecken', r < .4 ? 4000 : r < .75 ? 9000 : 1400, .8);
    dKatze.pose = 'sitzen'; dKatze.mal(0, true);
  }
  async function wichteSteg() {
    const a = fabelDarsteller('#dk-akt-steg', 'muschelwicht', {x: 56, y: 266, s: .8, flucht: async b => { await bewege(b, -80, 266, 200, {takt: 5}); weg(b); }}); if (!a) return;
    a.zeich = b => `<g>${F().gruppe('muschelwicht', 2, {dreh: false, t: b.t % 1})}</g>`;
    await bewege(a, 112, 266, 9, {takt: .5, lin: true});
    if (!a.flieht) await pose(a, 'x', 2600, .4);
    if (!a.flieht) { await bewege(a, -60, 266, 14, {takt: .5, lin: true}); weg(a); }
  }

  /* ---------- Schiffsrennen im Zeichenstil (v5.82, Nutzer: „das Schiffsrennen dem Stil anpassen“): Aquarell-Wasser, deine Frieda und ein graues Prüfungsboot mit Bugwelle, Harms am Ziel ---------- */
  function rennenSvg(d) {
    const W = 360, x0 = 22, x1 = 312, X = p => r1(x0 + (x1 - x0) * Math.max(0, Math.min(1, p)));
    const B = window.BOOT, boot = (x, farbe, eigen) => { const s = B ? `<g transform="translate(${x} 43) scale(.27)">${B.seite(eigen ? {} : {farbe})}</g>` : `<path d="M${x - 14} 40 h28 l-5 6 h-18z" fill="${eigen ? '#e8a33c' : '#8fa3b3'}"/>`;
      return `<g class="brb${eigen ? ' du' : ''}" style="--x:${x}px"><path d="M${x + 20} 44 q6 -3.4 11 0 M${x - 22} 45 q-9 1.4 -16 -1" fill="none" stroke="#eef6f7" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>${s}</g>`; };
    const harms = window.FIGUREN ? `<g transform="translate(${x1 + 30} 39) scale(.3)">${FIGUREN.figur('harms', {blick: 'seite', dreh: false}).replace('class="cr ', 'class="cr harmsspiegel ')}</g>` : '';
    return `<svg class="brsvg" viewBox="0 0 ${W} 60" role="img" aria-label="Dein Boot ${d.lage}, Prüfungsboot vorneweg">
      <defs><linearGradient id="br-w" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5f9db2"/><stop offset="1" stop-color="#2f6680"/></linearGradient></defs>
      <path d="M2 36 Q60 31 120 35 T240 34 T358 36 L358 54 Q300 57 180 55 T2 54Z" fill="url(#br-w)" opacity=".92"/>
      ${[[20, 44], [70, 49], [130, 42], [190, 50], [250, 44], [300, 49]].map(([x, y]) => `<path d="M${x} ${y} q6 -2.4 12 0" stroke="#d9ebef" stroke-width="1.1" fill="none" opacity=".55" stroke-linecap="round"/>`).join('')}
      <g transform="translate(10 40)"><path d="M-3 -12 L3 -12 L4 2 L-4 2Z" fill="#c0392b"/><path d="M-3.4 -6 H3.6" stroke="#f3efe6" stroke-width="2.4"/><path d="M0 -12 V-18" stroke="#3a2a1c" stroke-width="1.2"/></g>
      <g><path d="M${x1 + 6} 37 h34 v4 h-34z" fill="#8a6a46"/><path d="M${x1 + 10} 41 v14 M${x1 + 34} 41 v14" stroke="#6a4e30" stroke-width="2.4"/><path d="M${x1 + 12} 37 V14" stroke="#3a2a1c" stroke-width="1.2"/>
        <g transform="translate(${x1 + 12} 14)">${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<rect x="${c * 3}" y="${r * 3}" width="3" height="3" fill="${(r + c) % 2 ? '#2a2420' : '#f3efe6'}"/>`).join('')).join('')}</g>${harms}</g>
      ${boot(X(d.pruef), {rumpf: '#9aa4ad', streifen: '#5d6872', unterwasser: '#4a5560', dach: '#c4cbd1', fenster: '#7d8c99', deck: '#d6d9dc', motor: '#4a4f55', schrift: '#5d6872'}, false)}
      ${boot(X(d.du), null, true)}
    </svg>`;
  }

  /* ---------- CSS ---------- */
  const CSS = `
  .bdeck{position:relative;display:flex;flex-direction:column;margin:0 -16px -86px;height:100dvh;padding-bottom:calc(66px + env(safe-area-inset-bottom,0px));box-sizing:border-box;background:#15212c;color:#f1ead8;overflow:hidden}
  .bdeck .bbuehne{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
  .bdeck .bbuehne .fb,.bkaj .bbuehne .fb{border-radius:0}
  .bhots{position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;z-index:3}
  .bhot{position:absolute;pointer-events:auto;background:transparent;border:0;padding:0;cursor:pointer;border-radius:10px}
  .bhot:focus-visible{outline:3px solid #ffd27a}
  .bunten{flex:none;display:flex;flex-direction:column;gap:8px;padding:10px 12px 10px;background:#15212c;position:relative;z-index:4}
  .bpaar{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .bkarte{position:relative;display:flex;align-items:center;gap:8px;min-height:60px;margin:0;background:#1f2e3b;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:8px 10px;color:#f1ead8;font:inherit;text-align:left;cursor:pointer}
  .bkarte b{font-family:var(--display,inherit);font-size:.95rem;line-height:1.12;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .bkarte small{display:block;font-size:.72rem;color:#a9b4bd;line-height:1.2;font-weight:700}
  .bkarte .dges{flex:none}
  .bkarte.bweiter{background:#e1a03c;border-color:transparent;color:#2a1a07}.bkarte.bweiter small{color:rgba(42,26,7,.75)}
  .bkarte.bweiter .dwp{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.18);display:grid;place-items:center;flex:none;font-size:.85rem}
  .bkarte.babend{min-height:0;padding:7px 10px;font-weight:700;font-size:.82rem;border-style:dashed;background:transparent}
  .brennen2{display:block;width:100%;margin:0;background:#1f2e3b;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:8px 10px 6px;color:#f1ead8;font:inherit;text-align:left;cursor:pointer}
  .brennen2 .brk{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.brennen2 .brk b{font-family:var(--display,inherit);font-size:.95rem}.brennen2 .brk span{color:#f0b36a;font-weight:800;font-size:.8rem;white-space:nowrap}
  .brennen2 .brsvg{display:block;width:100%;height:auto;margin-top:2px}
  .brennen2 .brl{display:flex;gap:12px;flex-wrap:wrap;font-size:.7rem;color:#a9b4bd}.brennen2 .brl i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px;vertical-align:-1px}
  .brb{transition:transform 4.5s cubic-bezier(.25,.6,.3,1);transform:translateX(calc(-1 * var(--x) + 20px))}.brennen2.da .brb{transform:none}
  .harmsspiegel{transform:scaleX(-1)}
  .bdeck .dgear,.bkaj .dgear{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));right:10px;width:42px;height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(21,33,44,.8);color:#f1ead8;display:grid;place-items:center;z-index:9}
  .bdeck .dwerft{right:60px;font-size:20px;line-height:42px;padding:0}
  .bkaj{position:relative;margin:0 -16px -86px;height:calc(100dvh - 66px);background:#2c1c11;overflow:hidden}
  .bkaj .bbuehne{position:absolute;inset:0;overflow:hidden}
  .bpano{position:absolute;inset:0;z-index:5;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-x}
  .bpano::-webkit-scrollbar{display:none}.bpano>div{height:100%}
  .bkaj.zoom .bpano{pointer-events:none}
  .bkaj .fb-eb[data-d="0.92"]{transition:opacity .7s}.bkaj.zoom .fb-eb[data-d="0.92"]{opacity:0}
  .bvign{position:absolute;inset:0;z-index:4;pointer-events:none;background:radial-gradient(120% 90% at 50% 46%,rgba(0,0,0,0) 58%,rgba(16,8,3,.42) 100%)}
  .bpf{position:absolute;top:50%;z-index:8;transform:translateY(-50%);width:34px;height:64px;border-radius:12px;background:rgba(21,33,44,.6);color:#f3e7c9;display:grid;place-items:center;font:800 26px var(--body,inherit);cursor:pointer;transition:opacity .4s;border:0}
  .bpf.l{left:6px}.bpf.r{right:6px}.bpf.weg,.bkaj.zoom .bpf{opacity:0;pointer-events:none}
  .bfern{position:absolute;right:10px;bottom:12px;z-index:9;width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,250,240,.92);color:#2a2019;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3)}
  .bfern svg{width:26px;height:26px}.bkaj.zoom .bfern{opacity:0;pointer-events:none}
  .bkringel{position:absolute;z-index:6;border:3px solid #ffd27a;border-radius:50%;pointer-events:none;box-shadow:0 0 0 2px rgba(0,0,0,.25);animation:bkringel 2.6s ease-out forwards}
  @keyframes bkringel{0%{opacity:0;transform:scale(1.25)}15%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}
  .bover{position:absolute;inset:0;z-index:7;pointer-events:none}.bover>*{pointer-events:auto}
  .bdet{position:absolute;inset:0;z-index:10;pointer-events:none}
  .bdet>*{pointer-events:auto;position:absolute;opacity:0;transform:translateY(8px);transition:opacity .45s,transform .45s}
  .bdet.an>*{opacity:1;transform:none}
  .bzur{left:10px;top:calc(10px + env(safe-area-inset-top,0px));font:800 13px var(--body,inherit);padding:9px 13px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(21,33,44,.9);color:#f1ead8;cursor:pointer}
  .blos{left:50%;transform:translateX(-50%)!important;font:800 15px var(--body,inherit);padding:12px 18px;border-radius:14px;border:0;background:#e1a03c;color:#2a1a07;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3);white-space:nowrap}
  .blos.zweit{background:#f3ead2}.blos.klein{position:static;transform:none!important;font-size:13px;padding:9px 12px}
  .bdk{left:50%;transform:translateX(-50%)!important;width:86%;background:rgba(31,46,59,.95);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:10px 12px;color:#f1ead8}
  .bdk b{font-family:var(--display,inherit);font-size:15px;display:block}.bdk small{display:block;font-size:12px;color:#a9b4bd}
  .bnah{position:absolute;z-index:8;opacity:0}.bnah svg{width:100%;height:100%;display:block;overflow:visible}
  .bfeld{position:absolute;border:0;background:none;cursor:pointer;padding:0;border-radius:8px}.bfeld:active{background:rgba(255,220,140,.18)}
  .bok{position:absolute;right:4%;top:3%;width:18px;height:18px;border-radius:50%;background:#2f8a4a;color:#fff;font:900 11px/18px var(--body,inherit);text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.4);opacity:0;transition:opacity .4s .2s}
  .bnah.fertig .bok{opacity:1}
  .bkblick{position:absolute;inset:0;z-index:12;background:rgba(14,11,8,.55);display:grid;place-items:center;opacity:0;transition:opacity .3s}.bkblick.an{opacity:1}
  .bkblick .p{width:86%;background:#f4ead2;border-radius:16px;padding:10px;color:#2b2a26;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.4)}
  .bkblick canvas{width:100%;max-height:52vh;object-fit:contain;display:block;border-radius:10px}.bkblick b{font:800 17px var(--display,inherit)}.bkblick .r{display:flex;gap:8px;justify-content:center;margin-top:6px}
  .bboden{position:absolute;inset:0;z-index:7;opacity:0;pointer-events:none;background:repeating-linear-gradient(90deg,#3d2717 0 38px,#45291a 38px 40px),#3d2717}
  .boben{position:absolute;z-index:8;transform-origin:50% 50%;pointer-events:none}.boben svg{width:100%;height:100%;display:block;overflow:visible}
  .bmed{position:absolute;left:12px;bottom:150px;z-index:11;width:86px;height:86px;border-radius:50%;background:#f3e6c8;border:3px solid #c9a03c;box-shadow:0 6px 18px rgba(0,0,0,.45);overflow:hidden;opacity:0;transform:scale(.6);transition:opacity .3s,transform .3s;pointer-events:none}
  .bmed.an{opacity:1;transform:none}.bmed svg{width:100%;height:100%}
  .bblase{position:absolute;z-index:11;max-width:240px;background:#fffaf0;color:#2b2a26;font:700 13.5px/1.3 var(--body,inherit);padding:8px 11px;border-radius:14px;box-shadow:0 6px 16px rgba(0,0,0,.35);opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;pointer-events:none}
  .bblase.an{opacity:1;transform:none;pointer-events:auto}
  .bblase b{display:block;font:800 11px var(--body,inherit);color:#9a6a2a;margin-bottom:1px;text-transform:uppercase;letter-spacing:.04em}
  .bblase::after{content:"";position:absolute;left:var(--px,24px);bottom:-7px;width:14px;height:14px;background:#fffaf0;transform:rotate(45deg);border-radius:2px}
  .bblase.links::after{left:-6px;bottom:auto;top:16px}
  .bmenue{display:block;margin-top:6px;border:0;border-radius:10px;padding:6px 10px;background:#e1a03c;color:#2a1a07;font:800 12.5px var(--body,inherit);cursor:pointer}
  .brunde{left:50%;bottom:18px;transform:translateX(-50%)!important;width:92%;display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:center;background:rgba(21,33,44,.92);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:12px}
  .bfolge small{display:block;font-size:12px;color:#a9b4bd;font-weight:700}.bfolge b{display:block;font-family:var(--display,inherit);font-size:18px;line-height:1.15;color:#f1ead8}
  .bplay{grid-row:span 2;width:68px;height:68px;border-radius:50%;border:0;background:#e1a03c;color:#2a1a07;font-size:26px;display:grid;place-items:center;cursor:pointer;padding-left:5px}
  .bschalter{display:flex;gap:6px;flex-wrap:wrap}.bschalter button,.bmehr button{border:1px solid rgba(255,255,255,.2);background:transparent;color:#f1ead8;border-radius:999px;padding:6px 10px;font:700 12px var(--body,inherit);cursor:pointer}
  .bschalter button[aria-pressed="true"]{background:rgba(225,160,60,.2);border-color:#e1a03c;color:#ffd08a}
  .bmehr{grid-column:1/-1;display:flex;gap:8px;justify-content:center}.bmehr button{border-style:dashed}
  @media (prefers-reduced-motion: reduce){.brb{transition:none}}`;
  function stil() { if (document.getElementById('bord-css')) return; const s = document.createElement('style'); s.id = 'bord-css'; s.textContent = CSS; document.head.appendChild(s); }
  stil();
  /* zum Testen: einen Auftritt sofort starten (Rauchtest, Bühnentest) */
  function auftritt(name) { if (!L || L.auftritt) return false; const w = (L.wo === 'kajuete' ? KAJ_AUF : DECK_AUF).find(x => x.name === name); if (!w) return false; const n0 = L.n; L.auftritt = name;
    Promise.resolve().then(w.los).catch(e => console.warn('Bord-Auftritt', name, e)).finally(() => { if (L && L.n === n0) { L.auftritt = null; L.naechst = performance.now() + 20000; } }); return true; }
  window.BORD = {deck, kajuete, rennenSvg, kopf: medaillon, auftritt, stumm, sprich, zurueck, ran, runde, lebenStop, _leben: () => L, _akteure: akteure, _pan: PAN, DING};
})();
