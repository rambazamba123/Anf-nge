/* Skipper – Szenerie (v5.62): Meer, Stimmungen, Möwen, Regen, Boot mit Crew, kleiner Harms, Glücksrad, Kajüte als Panorama.
   Nur Zeichnungen (SVG als Text). Die Seiten dazu baut deck.js. Gebraucht werden BOOT (boot.js) und charSVG (index.html).
   Wellen laufen ohne Ruckeln: Jede Reihe wiederholt sich genau alle P Einheiten und wandert genau P weit.
   Wellenarten je Stimmung (Nutzer 12.11.2026): A ruhige Bänder (Nebel, Nacht), G ruhig mit Funkeln im Licht (Morgen klar, Abend),
   F Fahrt (Wellen laufen nach rechts weg, Bugwelle und Kielwasser), E leichter Sturm, X starker Sturm. */
(function () {
  const f2 = v => (Math.round(v * 100) / 100).toString();
  const zf = (k, s = 1) => { const v = Math.sin(k * 12.9898 * s + 4.1) * 43758.5453; return v - Math.floor(v); };
  const mix = (a, b, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - k) + parseInt(b.substr(i, 2), 16) * k).toString(16).padStart(2, '0')).join('');
  let BX = [0, 100], uid = 0;
  const neuId = p => p + (++uid);

  /* ---------- Stimmungen ---------- */
  const STIM = {
    morgen: {n: 'Morgen, klar', him: ['#9fb6c9', '#f2c9a5'], see: '#6593ab', seeU: '#33627c', wel: '#f3f7f9', sonne: [22, .44, 7, '#fde2b4'], steg: true, moewen: true, wellen: 'G'},
    nebel: {n: 'Morgen im Nebel', him: ['#b9c3ca', '#dfe3e3'], see: '#7a929e', seeU: '#4d6673', wel: '#eef2f4', nebel: true, steg: true, wellen: 'A'},
    fahrt: {n: 'Fahrt bei Sonne', him: ['#5fa7d6', '#cde9f6'], see: '#3a8ab2', seeU: '#17506f', wel: '#eaf7fc', sonne: [80, .14, 6.5, '#ffe58a'], wolken: true, moewen: true, wellen: 'F'},
    abend: {n: 'Abend vor Anker', him: ['#3a2c55', '#f28c4c'], see: '#4e5f80', seeU: '#33415c', wel: '#f6c39a', sonne: [24, .5, 9, '#ffb357'], anker: true, licht: true, wellen: 'G'},
    nacht: {n: 'Nacht und Regen', him: ['#081521', '#1c3549'], see: '#14354a', seeU: '#0c2433', wel: '#7fb7cf', mond: [78, .14], sterne: true, regen: 1, licht: true, wellen: 'A'},
    sturm1: {n: 'Leichter Sturm', him: ['#56636f', '#a3adb5'], see: '#4a6779', seeU: '#1f3646', wel: '#f2f6f8', dunkel: true, wellen: 'E'},
    sturm2: {n: 'Starker Sturm', him: ['#1f272f', '#4d5862'], see: '#2c4658', seeU: '#0f1f2a', wel: '#eef3f6', dunkel: true, regen: 2, blitz: true, wellen: 'X'}};

  /* App-Wetter und Tageszeit → Stimmung (bis die Geschichte die Stimmung selbst setzt) */
  function stimmungAus(tag, wx) {
    if (wx === 'sturm') return 'sturm2';
    if (wx === 'windig') return 'sturm1';
    if (wx === 'nebel') return 'nebel';
    if (tag === 'nacht') return 'nacht';
    if (tag === 'abend' || tag === 'daemmerung') return 'abend';
    if (tag === 'morgen') return 'morgen';
    if (wx === 'regen') return 'nacht';
    return 'fahrt';
  }

  /* ---------- Bausteine fürs Wasser ---------- */
  const bandPfad = (y, P, A, unten) => { const a = BX[0] - 2 * P; let d = `M${f2(a)} ${f2(y)}`; for (let x = a; x < BX[1] + 2 * P; x += P) d += ` Q${f2(x + P / 4)} ${f2(y - A)} ${f2(x + P / 2)} ${f2(y)} T${f2(x + P)} ${f2(y)}`; return d + (unten != null ? ` V${f2(unten)} H${f2(a)} Z` : ''); };
  const spitzPfad = (y, P, A, unten) => { const a = BX[0] - 2 * P; let d = `M${f2(a)} ${f2(y)}`; for (let x = a; x < BX[1] + 2 * P; x += P) d += ` Q${f2(x + P * .32)} ${f2(y)} ${f2(x + P * .5)} ${f2(y - A)} Q${f2(x + P * .68)} ${f2(y)} ${f2(x + P)} ${f2(y)}`; return d + (unten != null ? ` V${f2(unten)} H${f2(a)} Z` : ''); };
  const proKamm = (P, fn) => { let d = ''; for (let x = BX[0] - 2 * P; x < BX[1] + 2 * P; x += P) d += fn(x + P * .5); return d; };
  /* Füllung, die nach unten ausläuft (keine gerade Kante unten) */
  const auslauf = (c, op = 1) => { const id = neuId('al'); return {def: `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset=".55" stop-color="${c}" stop-opacity="${op}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`, url: `url(#${id})`}; };
  const lauf = (inner, P, dur, rechts) => `<g class="wl" style="animation-duration:${f2(dur)}s;--P:${rechts ? P : -P}px">${inner}</g>`;
  const band = (y, P, A, fill, op, dur, unten, o = {}) => lauf(`<path d="${bandPfad(y, P, A, unten)}" fill="${fill}" opacity="${op}"/>${o.kante ? `<path d="${bandPfad(y, P, A)}" stroke="${o.kante}" stroke-width="${f2(.3 + A * .12)}" fill="none" opacity=".35"/>` : ''}${o.extra || ''}`, P, dur, o.rechts);
  const spitzBand = (y, P, A, fill, dur, unten, extra = '', rechts) => lauf(`<path d="${spitzPfad(y, P, A, unten)}" fill="${fill}"/>${extra}`, P, dur, rechts);
  /* Schaum vorn am spitzen Kamm (Wellen laufen nach links, also schäumt die linke Seite) */
  const gischtKamm = (y, P, A, col, op) => `<path d="${proKamm(P, c => `M${f2(c)} ${f2(y - A)} q${f2(-P * .05)} ${f2(A * .35)} ${f2(-P * .13)} ${f2(A * .75)} M${f2(c - P * .02)} ${f2(y - A * .9)} l${f2(-P * .06)} ${f2(A * .2)} `)}" stroke="${col}" stroke-width="${f2(.4 + A * .16)}" fill="none" opacity="${op}" stroke-linecap="round"/>`;
  /* überschlagende Lippe (starker Sturm) */
  const lippe = (y, P, A) => `<path d="${proKamm(P, c => { const t = y - A; return `M${f2(c + P * .03)} ${f2(t)} C${f2(c - P * .05)} ${f2(t - A * .4)} ${f2(c - P * .22)} ${f2(t - A * .2)} ${f2(c - P * .22)} ${f2(t + A * .3)} C${f2(c - P * .16)} ${f2(t + A * .08)} ${f2(c - P * .08)} ${f2(t + A * .1)} ${f2(c - P * .02)} ${f2(t + A * .38)} Z `; })}" fill="#f4f8fa"/><path d="${proKamm(P, c => `M${f2(c - P * .21)} ${f2(y - A * .65)} Q${f2(c - P * .26)} ${f2(y - A * .25)} ${f2(c - P * .36)} ${f2(y)} `)}" stroke="#f4f8fa" stroke-width="${f2(A * .3)}" fill="none" opacity=".4" stroke-linecap="round"/>`;
  const gischt = (y0, y1, n, s = 1) => Array.from({length: n}, (_, i) => `<circle cx="${f2(zf(i, 3.1) * 100)}" cy="${f2(y0 + zf(i + 50, 2.3) * (y1 - y0))}" r="${f2(.3 + zf(i + 9) * .6)}" fill="#f4f8fa" class="spray" style="animation-delay:${f2(zf(i + 3) * 2 * s)}s;animation-duration:${f2(1.2 + zf(i + 7))}s"/>`).join('');
  /* Schaumstreifen in Windrichtung (ab Windstärke 6) */
  const streifen = (hz, h) => lauf(Array.from({length: 7}, (_, i) => { const y = hz + 5 + (h - hz) * (i / 7) * .95; let d = ''; for (let x = -60 + (i * 11) % 30; x < 160; x += 30) d += `M${x} ${f2(y)} h${8 + (i % 3) * 4} `; return `<path d="${d}" stroke="#f4f8fa" stroke-width="${f2(.3 + i * .08)}" opacity=".3" stroke-linecap="round"/>`; }).join(''), 30, 5);
  /* Funkeln im Licht unter der Sonne */
  const glitzer = (s, hz, H) => !s.sonne ? '' : Array.from({length: 38}, (_, i) => { const k = zf(i), y = hz + 1 + H * k * k * .9, w = 1.2 + 5 * k, x = s.sonne[0] + (zf(i + 100) - .5) * (6 + 46 * k); return `<rect x="${f2(x - w / 2)}" y="${f2(y)}" width="${f2(w)}" height="${f2(.25 + .45 * k)}" rx=".3" fill="${s.sonne[3]}" class="glitzer" style="animation-delay:${f2(zf(i + 7) * 3)}s;animation-duration:${f2(1.6 + zf(i + 9) * 1.6)}s"/>`; }).join('');

  /* ruhige Reihen: weiter hinten flach und kurz, vorn höher und länger */
  const reihen = (s, hz, H, n = 7, kontrast = 1) => Array.from({length: n}, (_, i) => { const k = i / (n - 1);
    return {y: hz + 1 + H * (.03 + .63 * k * k + .25 * k), P: 18 + 46 * k, A: .8 + 3 * k, dur: 14 - 7 * k, k,
      c: i % 2 ? mix(s.see, s.seeU, (.45 + .45 * k) * kontrast + (1 - kontrast) * .4) : mix(mix(s.see, '#ffffff', .2 * kontrast), s.seeU, .1 + .5 * k)}; });

  /* Sturm: ausdrückliche Reihen, kein Kamm ragt über den Horizont; jede zweite schwappt anders */
  const sturmReihen = (s, hz, H, stark) => { const n = 7, out = []; let y = hz + 1.2;
    for (let i = 0; i < n; i++) { const k = i / (n - 1), A = (stark ? 1 + 6.5 * k : .7 + 3.8 * k) * (i % 2 ? .78 : 1.08) * (i === 0 ? .5 : 1);
      if (i > 0) y = Math.max(y + (stark ? 4 + 7 * k : 3 + 5 * k), hz + 1.5 + A * 1.05);
      out.push({y, A, P: (stark ? 26 + 44 * k : 16 + 36 * k) * (i % 2 ? 1.18 : .92), dur: (stark ? 9 - 4 * k : 8 - 4 * k) * (i % 2 ? 1.35 : .8), heave: (i % 2 ? 3.4 : 2.4) + k, hub: (stark ? .5 + 2 * k : .3 + 1.1 * k), k,
        c: i % 2 ? mix(s.see, s.seeU, .5 + .4 * k) : mix(mix(s.see, '#ffffff', .14), s.seeU, .15 + .5 * k)}); }
    return out; };
  const heave = (inner, r, i) => `<g class="heave" style="--hub:${f2(-r.hub)}px;animation-duration:${f2(r.heave)}s;animation-delay:${f2(-i * .73)}s">${inner}</g>`;

  function meer(s, h, hz, wo, variante) {
    const H = h - hz, art = s.wellen;
    if (art === 'A' || art === 'G') {
      if (wo === 'vorn') return band(hz + 4.2, 15, .9, mix(s.see, s.seeU, .25), .95, 6, hz + 7);
      const kon = art === 'G' ? .45 : 1;
      return reihen(s, hz, H, 7, kon).map(r => band(r.y, r.P, r.A * (art === 'G' ? .75 : 1), r.c, 1, r.dur, h + 1, {kante: art === 'A' ? s.wel : ''})).join('') + (art === 'G' ? glitzer(s, hz, H) : ''); }
    if (art === 'F') { /* Fahrt: alles läuft nach rechts weg, das Boot fährt nach links */
      if (wo === 'vorn') return band(hz + 4.2, 15, .9, mix(s.see, s.seeU, .25), .95, 2.6, hz + 7, {rechts: true}) + bugwelle(hz) + kielwasser(hz);
      return reihen(s, hz, H).map(r => band(r.y, r.P, r.A, r.c, 1, r.dur * .45, h + 1, {kante: s.wel, rechts: true})).join(''); }
    if (art === 'E') {
      const R = sturmReihen(s, hz, H, false);
      if (variante === '2') { /* Kreuzsee */
        if (wo === 'vorn') { const g = auslauf(mix(s.see, s.seeU, .3)); return `<defs>${g.def}</defs>` + band(hz + 4.2, 13, 1.8, g.url, 1, 3.4, hz + 10); }
        return R.map((r, i) => heave(band(r.y, r.P, r.A, r.c, 1, r.dur, h + 1, {extra: i ? gischtKamm(r.y, r.P, r.A * .6, s.wel, .45) : ''}), r, i)).join('') + R.filter((_, i) => i % 2).map(r => band(r.y + 2, r.P * 1.3, r.A * .8, mix(s.seeU, '#ffffff', .12), .45, r.dur * 1.2, h + 1, {rechts: true})).join(''); }
      if (wo === 'vorn') { const g = auslauf(mix(s.see, s.seeU, .3)); return `<defs>${g.def}</defs>` + spitzBand(hz + 4.5, 14, 2.2, g.url, 3.6, hz + 11, gischtKamm(hz + 4.5, 14, 2.2, s.wel, .9)); }
      return R.map((r, i) => heave(spitzBand(r.y, r.P, r.A, r.c, r.dur, h + 1, i ? gischtKamm(r.y, r.P, r.A, s.wel, .55 + .06 * i) : ''), r, i)).join('') + streifen(hz, h); }
    /* X: starker Sturm */
    const R = sturmReihen(s, hz, H, true);
    if (variante === '2') { /* großer Brecher vor dem Boot, unten ausgelaufen */
      if (wo === 'vorn') { const g = auslauf(mix(s.see, s.seeU, .2)); return `<defs>${g.def}</defs><g class="berg">${spitzBand(hz + 14, 70, 13, g.url, 9, hz + 40, lippe(hz + 14, 70, 13))}</g>` + gischt(hz - 14, hz + 4, 22); }
      return R.map((r, i) => heave(spitzBand(r.y, r.P, r.A * .8, r.c, r.dur, h + 1, i ? gischtKamm(r.y, r.P, r.A * .8, s.wel, .7) : ''), r, i)).join(''); }
    if (wo === 'vorn') { const g = auslauf(mix(s.see, s.seeU, .35)); return `<defs>${g.def}</defs>` + heave(spitzBand(hz + 6, 22, 4.5, g.url, 4, hz + 16, lippe(hz + 6, 22, 4.5)), {heave: 2.8, hub: 1.6}, 1) + gischt(hz - 8, hz + 6, 16); }
    return R.map((r, i) => heave(spitzBand(r.y, r.P, r.A, r.c, r.dur, h + 1, i > 2 ? lippe(r.y, r.P, r.A) : i ? gischtKamm(r.y, r.P, r.A, s.wel, .7) : ''), r, i)).join('') + streifen(hz, h); }
  /* Bugwelle (Bug links) und Kielwasser (hinter dem Heck, rechts) */
  const bugwelle = hz => `<g class="bugw"><path d="M13 ${f2(hz - 1)} q-4 -1.6 -8 1.2 q3 .3 5 2.4 q1.6 -2.2 3 -3.6Z" fill="#f4f8fa" opacity=".9"/><path d="M12 ${f2(hz + 1.4)} q-6 .2 -11 2.6" stroke="#f4f8fa" stroke-width=".7" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
  const kielwasser = hz => lauf(Array.from({length: 4}, (_, i) => { let d = ''; for (let x = 80; x < 150; x += 12) d += `M${f2(x + i * 3)} ${f2(hz + .6 + i * 1.3)} h${f2(4 + i)} `; return `<path d="${d}" stroke="#f4f8fa" stroke-width="${f2(.8 - i * .12)}" opacity="${f2(.8 - i * .15)}" stroke-linecap="round"/>`; }).join(''), 12, 1.4, true);

  /* Regen fällt wirklich nach unten: Muster zweimal übereinander, das Ganze rutscht genau eine Bildhöhe */
  const regen = (h, stark) => { const n = stark ? 46 : 28, layer = (sp, op, len) => { const strich = Array.from({length: n}, (_, i) => `<path d="M${f2(zf(i, 1.7 + sp) * 112 - 6)} ${f2(zf(i + 40, 2.9 + sp) * h)} l${f2(-len * .22)} ${f2(len)}" stroke="#a9cbe0" stroke-width="${f2(.35 + sp * .1)}" opacity="${op}" stroke-linecap="round"/>`).join('');
    return `<g class="regenfall" style="--rh:${f2(h)}px;--rx:${f2(-h * .22)}px;animation-duration:${f2(stark ? .55 + sp * .25 : .9 + sp * .3)}s"><g>${strich}</g><g transform="translate(${f2(h * .22)} ${f2(-h)})">${strich}</g></g>`; };
    return layer(0, .45, stark ? 7 : 5) + layer(1, .3, stark ? 5 : 3.5); };

  /* ---------- Möwen: von der Seite mit Flügelschlag ---------- */
  const MOEWE = `<g><path d="M-2.4 .2 L-3.5 -.3 L-3.4 .7 Z" fill="#e9eef1"/><ellipse cx="0" cy=".3" rx="2.3" ry=".8" fill="#fbfdfe"/><circle cx="2.1" cy="-.05" r=".62" fill="#fbfdfe"/><path d="M2.6 -.1 l.9 .18 l-.9 .2 Z" fill="#e8a33c"/><circle cx="2.25" cy="-.2" r=".12" fill="#1e2a33"/>
    <g><path d="M-.9 0 Q.2 -2.6 2 -3.4 Q1.2 -1.4 .9 0 Z" fill="#b9c4cb"/><path d="M1.4 -2.9 Q1.8 -3.3 2 -3.4 Q1.8 -2.9 1.6 -2.5 Z" fill="#33414b"/><animateTransform attributeName="transform" type="scale" values="1 1;1 -.55;1 1" dur=".55s" repeatCount="indefinite"/></g></g>`;
  const flug = (von, nach, dur, begin, s0, s1, dy, links) => `<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.06;.9;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="translate" values="${von.join(' ')};${f2((von[0] + nach[0]) / 2)} ${f2((von[1] + nach[1]) / 2 + dy)};${nach.join(' ')}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="${s0};${s1}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>${links ? `<g transform="scale(-1 1)">${MOEWE}</g>` : MOEWE}</g></g></g>`;
  /* quer, quer zurück; eine kommt schräg näher (wird größer, wenig hoch und runter), eine fliegt schräg davon (wird kleiner) */
  const moewen = h => flug([-8, h * .2], [110, h * .14], 19, 0, 1.4, 1.4, -3) + flug([-8, h * .27], [110, h * .23], 26, 7, 1, 1, 2) + flug([110, h * .12], [-8, h * .17], 23, 12, 1.15, 1.15, -2, true)
    + flug([30, h * .3], [112, h * .26], 12, 4, .6, 2.4, -1.5) + flug([112, h * .1], [56, h * .24], 15, 9, 2.2, .5, -1, true);

  /* ---------- Szene: Himmel, Meer, Boot mit Crew ---------- */
  function szene(o = {}) {
    const h = o.h || 100, st = o.stim || 'fahrt', s = STIM[st] || STIM.fahrt, hz = h * .55, id = neuId('sz'), fig = o.fig || (() => ''), boot = window.BOOT ? BOOT.seite({bugLinks: true}) : '';
    const rolle = s.wellen === 'E' ? 'roll1' : s.wellen === 'X' ? 'roll2' : s.wellen === 'F' ? 'rollF' : '';
    return `<svg viewBox="0 0 100 ${h}" preserveAspectRatio="xMidYMid slice" class="szenerie" aria-hidden="true">
    <defs><linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.him[0]}"/><stop offset="1" stop-color="${s.him[1]}"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.see}"/><stop offset="1" stop-color="${s.seeU}"/></linearGradient>
      <radialGradient id="${id}g"><stop offset="0" stop-color="${s.sonne ? s.sonne[3] : '#f3e7c9'}" stop-opacity=".55"/><stop offset="1" stop-color="${s.sonne ? s.sonne[3] : '#f3e7c9'}" stop-opacity="0"/></radialGradient>
      <clipPath id="${id}c"><path d="M-10 -10 H110 V${f2(hz - 11.7)} H86 V${h + 10} H14 V${f2(hz - 11.7)} H-10Z"/></clipPath></defs>
    <rect width="100" height="${h}" fill="url(#${id}h)"/>
    ${s.sterne ? [[12, .08], [30, .2], [55, .05], [92, .3], [40, .33], [66, .12], [5, .38]].map(([x, y]) => `<circle cx="${x}" cy="${f2(y * h)}" r=".45" fill="#f3e7c9" class="funkel" style="animation-delay:${x % 3}s"/>`).join('') : ''}
    ${s.sonne ? `<circle cx="${s.sonne[0]}" cy="${f2(s.sonne[1] * h)}" r="${s.sonne[2] * 3}" fill="url(#${id}g)"/><circle cx="${s.sonne[0]}" cy="${f2(s.sonne[1] * h)}" r="${s.sonne[2]}" fill="${s.sonne[3]}"/>` : ''}
    ${s.mond ? `<circle cx="${s.mond[0]}" cy="${f2(s.mond[1] * h)}" r="5" fill="#f3e7c9" opacity=".9"/><circle cx="${s.mond[0] + 2.2}" cy="${f2(s.mond[1] * h - 1)}" r="4.4" fill="${s.him[0]}"/>` : ''}
    ${s.wolken ? `<g class="wolke"><ellipse cx="20" cy="${f2(h * .12)}" rx="12" ry="3.4" fill="#fff" opacity=".85"/><ellipse cx="26" cy="${f2(h * .1)}" rx="7" ry="3.4" fill="#fff" opacity=".85"/><ellipse cx="62" cy="${f2(h * .25)}" rx="9" ry="2.4" fill="#fff" opacity=".7"/></g>` : ''}
    ${s.dunkel ? `<g class="sturmwolken">${[[10, .08, 22], [45, .14, 28], [82, .06, 24], [120, .12, 26], [-25, .16, 20]].map(([x, y, rx]) => `<ellipse cx="${x}" cy="${f2(y * h)}" rx="${rx}" ry="${f2(rx * .28)}" fill="${mix(s.him[0], '#000000', .25)}" opacity=".8"/>`).join('')}</g>` : ''}
    ${s.blitz ? `<rect width="100" height="${h}" fill="#e8eef5" class="blitz"/><path d="M70 ${f2(h * .05)} l-4 ${f2(h * .12)} h3 l-5 ${f2(h * .14)}" stroke="#fff6c8" stroke-width=".9" fill="none" class="blitz"/>` : ''}
    ${s.moewen && o.moewen !== false ? moewen(h) : ''}
    ${s.anker || s.steg ? `<path d="M-5 ${f2(hz - 1)} Q20 ${f2(hz - 6)} 40 ${f2(hz - 2)} T105 ${f2(hz - 1.5)} V${f2(hz)} H-5Z" fill="${s.anker ? '#2d3550' : '#6f8796'}" opacity=".9"/>` : ''}
    <rect y="${f2(hz)}" width="100" height="${f2(h - hz)}" fill="url(#${id}s)"/>
    ${s.steg ? `<g><rect x="-4" y="${f2(hz - 4)}" width="108" height="2.4" fill="#8a6440"/><path d="M-4 ${f2(hz - 4)} H104" stroke="#a87a4e" stroke-width=".6"/>${[2, 18, 34, 50, 66, 82, 98].map(x => `<rect x="${x}" y="${f2(hz - 5)}" width="1.8" height="8" fill="#5a3b22"/>`).join('')}</g>` : ''}
    ${meer(s, h, hz, 'hinten', o.sturm)}
    <g class="schaukel3 ${rolle}" style="transform-origin:50px ${f2(hz)}px">${o.crew === false ? '' : `<g clip-path="url(#${id}c)">${fig('hinnerk', 79, hz - 7, 27)}${fig('smilla', 24, hz - 7, 26)}</g>`}<g transform="translate(50 ${f2(hz)}) scale(.45)">${boot}</g>${o.crew === false ? '' : fig('klabauter', 47.5, hz - 24, 11) + fig('backbord', 60, hz - 24.4, 10)}
      ${s.licht ? `<circle cx="62" cy="${f2(hz - 25)}" r="3" fill="#ffd27a" opacity=".35" class="funkel"/><circle cx="62" cy="${f2(hz - 25)}" r=".9" fill="#fff3c4"/>` : ''}
      ${o.hot || ''}</g>
    ${meer(s, h, hz, 'vorn', o.sturm)}
    ${s.nebel ? `<g class="nebel"><rect x="-60" y="${f2(hz - 12)}" width="220" height="14" fill="#eef2f4" opacity=".35"/><rect x="-60" y="${f2(hz + 2)}" width="220" height="8" fill="#eef2f4" opacity=".25"/></g>` : ''}
    ${s.wellen === 'E' ? gischt(hz - 6, hz + 8, 10) : ''}${s.regen ? regen(h, s.regen === 2) : ''}</svg>`; }

  /* ---------- kleiner Harms im Ziel: macht nur ab und zu etwas ---------- */
  function miniHarms(innen, px) {
    return `<svg class="miniharms" viewBox="0 -2 100 147" width="${f2(px * .68)}" height="${px}" role="img" aria-label="Kapitän Harms wartet im Ziel">${innen}
    <g class="a-nase"><path d="M30 120 Q34 80 48 56" stroke="#7d8896" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="48" cy="56" r="5.5" fill="#f4d0ac"/><path d="M49 52 l1 -4" stroke="#f4d0ac" stroke-width="3.2" stroke-linecap="round"/></g>
    <g class="a-brille"><path d="M28 120 Q30 80 40 56" stroke="#7d8896" stroke-width="11" fill="none" stroke-linecap="round"/><rect x="32" y="40" width="20" height="13" rx="3" fill="#f7f2e6" stroke="#9a9a9a" class="tuch"/></g>
    <g class="a-pfeife"><path d="M55 60 L70 64" stroke="#5a3820" stroke-width="3" stroke-linecap="round"/><path d="M68 58 h7 v8 q-3.5 3 -7 0 z" fill="#5a3820"/><circle cx="72" cy="50" r="3" fill="#ddd" class="rauch"/><circle cx="76" cy="40" r="4" fill="#ddd" class="rauch r2"/></g>
    <g class="a-gaehnen"><ellipse cx="50" cy="59" rx="5" ry="6" fill="#7a3f33"/></g></svg>`; }
  const HARMS_TUN = ['nase', 'brille', 'pfeife', 'gaehnen'];
  function harmsLeben(svg) { let i = 0, t = null; const ruhe = () => { HARMS_TUN.forEach(x => svg.classList.remove(x)); t = setTimeout(tun, 6000 + Math.random() * 9000); }, tun = () => { if (!svg.isConnected) return; svg.classList.add(HARMS_TUN[i++ % HARMS_TUN.length]); t = setTimeout(ruhe, 3200); }; t = setTimeout(tun, 2500 + Math.random() * 3000); return () => clearTimeout(t); }

  /* ---------- Glücksrad mit zwei Pfeilen (links nach oben, rechts nach unten) ---------- */
  const pfeil = (a0, a1, R = 52) => { const p = a => [60 + R * Math.cos(a * Math.PI / 180), 60 + R * Math.sin(a * Math.PI / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1), r = a1 * Math.PI / 180, tx = -Math.sin(r), ty = Math.cos(r), nx = Math.cos(r), ny = Math.sin(r);
    return `<path d="M${f2(x0)} ${f2(y0)} A${R} ${R} 0 0 1 ${f2(x1)} ${f2(y1)}" fill="none" stroke="#e8a33c" stroke-width="5" stroke-linecap="round"/><path d="M${f2(x1 + tx * 11)} ${f2(y1 + ty * 11)} L${f2(x1 + nx * 6.5)} ${f2(y1 + ny * 6.5)} L${f2(x1 - nx * 6.5)} ${f2(y1 - ny * 6.5)} Z" fill="#e8a33c"/>`; };
  const RAD_SVG = '<svg x="27" y="27" width="66" height="66" viewBox="0 0 40 40" fill="none" stroke="#e8a33c" stroke-width="2.4" stroke-linecap="round"><circle cx="20" cy="20" r="11"/><circle cx="20" cy="20" r="3.2"/><path d="M20 4 V36 M4 20 H36 M8.7 8.7 L31.3 31.3 M31.3 8.7 L8.7 31.3"/></svg>';
  const rad = grau => `<svg viewBox="-8 -8 136 136" aria-hidden="true" style="filter:grayscale(${grau}) opacity(${f2(1 - grau * .55)})"><g class="radd" style="transform-origin:60px 60px">${RAD_SVG}</g>${grau >= 1 ? '' : `<g class="pfeile">${pfeil(150, 222)}${pfeil(330, 402)}</g>`}</svg>`;

  /* ---------- Symbole ---------- */
  const KL = 'stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const SYM = {
    knoten: `<svg viewBox="0 0 40 40" ${KL}><path d="M11 19 A9 3 0 0 1 15 16.6 M25 16.6 A9 3 0 0 1 29 19 M11 24 A9 3 0 0 1 15 21.6 M25 21.6 A9 3 0 0 1 29 24" stroke-width="2.6"/><rect x="15" y="12" width="10" height="24" rx="2" fill="currentColor" stroke="none" opacity=".42"/><ellipse cx="20" cy="12" rx="6.5" ry="2.4" fill="currentColor" stroke="none" opacity=".6"/><path d="M11 19 A9 3 0 0 0 29 19 M11 24 A9 3 0 0 0 29 24" stroke-width="2.6"/><path d="M29 19 C33 19 36 17 39 15" stroke-width="2.6"/><path d="M11 24 C7 25 6 29 9 31 C12 33 15 30 13 28" stroke-width="2.4"/><path d="M4 37 H36" stroke-width="2" opacity=".5"/></svg>`,
    navi: `<svg viewBox="0 0 40 40" ${KL} stroke-width="2.4"><path d="M4 35 L30 35 L4 11 Z"/><path d="M9 30 L17 30 L9 22.5 Z" stroke-width="1.6"/><path d="M29 3 L22 27 M29 3 L36 27"/><circle cx="29" cy="3.5" r="2.4"/><path d="M25.6 12.5 H32.4" stroke-width="1.8"/></svg>`,
    licht: `<svg viewBox="0 0 40 40" ${KL} stroke-width="2.4"><path d="M24 11 L39 5 L39 18 Z" fill="#e8a33c" stroke="none" opacity=".75"/><path d="M12 36 L14 14 H20 L22 36 Z"/><path d="M11 14 H23 L21 9 H13 Z"/><path d="M17 9 V6"/><path d="M13.5 22 H20.5 M13 29 H21" stroke-width="1.8"/><circle cx="17" cy="11.5" r="1.6" fill="#e8a33c" stroke="none"/><path d="M5 36 H29"/></svg>`,
    praxis: `<svg viewBox="0 0 40 40" ${KL} stroke-width="2.4"><circle cx="20" cy="20" r="11"/><circle cx="20" cy="20" r="3.2"/><path d="M20 4 V36 M4 20 H36 M8.7 8.7 L31.3 31.3 M31.3 8.7 L8.7 31.3"/></svg>`,
    frage: `<svg viewBox="0 0 40 40" ${KL} stroke-width="2.6"><circle cx="20" cy="20" r="15"/><path d="M15 15 Q15 10 20 10 Q25 10 25 15 Q25 19 20 21 V24"/><circle cx="20" cy="29.5" r="1.4" fill="currentColor"/></svg>`,
    funk: `<svg viewBox="0 0 40 40" ${KL} stroke-width="2.4"><rect x="5" y="14" width="30" height="20" rx="4"/><circle cx="14" cy="24" r="5"/><path d="M23 20 H31 M23 25 H31 M23 30 H29 M28 14 L33 5"/></svg>`,
    ohr: `<svg viewBox="0 0 40 40" ${KL} stroke-width="2.6"><path d="M13 16 Q13 6 22 6 Q31 6 31 16 Q31 22 25 26 Q22 28 22 32 Q22 36 17 36 Q13 36 13 32"/><path d="M18 17 Q18 12 22 12 Q26 12 26 16"/></svg>`,
    reden: `<svg viewBox="0 0 48 40" ${KL} stroke-width="2.4"><path d="M13 36 V30 C7 28 5 23 5 17 C5 9 11 4 18 4 C25 4 29 9 29 14 L32.5 20 L29.5 21 V25 C29.5 27 28 28 26 28 H22 V36"/><path d="M26.5 23.5 H30" stroke-width="2"/><circle cx="21" cy="13" r="1.3" fill="currentColor" stroke="none"/><path d="M35 15 Q38 20 35 25 M39.5 11 Q44.5 20 39.5 29" stroke-width="2.6"/></svg>`,
    harms: '<svg viewBox="0 0 40 40" fill="none" stroke-width="2.4" stroke-linejoin="round"><path d="M7 13 Q7 7 13 7 H27 Q33 7 33 13 L29 16 L25 13 H15 L11 16 Z" fill="#c0392b" stroke="#7a2318"/><rect x="9" y="19" width="22" height="15" rx="3" fill="#c0392b" stroke="#7a2318"/><circle cx="20" cy="26.5" r="4" fill="#fff" stroke="#7a2318"/></svg>',
    play: '<svg viewBox="0 0 40 40"><path d="M14 9 L31 20 L14 31 Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    pause: '<svg viewBox="0 0 40 40"><rect x="11" y="9" width="6" height="22" rx="2" fill="currentColor"/><rect x="23" y="9" width="6" height="22" rx="2" fill="currentColor"/></svg>',
    zahn: `<svg viewBox="0 0 24 24" ${KL} stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
    zurueck: `<svg viewBox="0 0 40 40" ${KL} stroke-width="3"><path d="M24 8 L12 20 L24 32"/></svg>`};

  /* ---------- Kajüte: Panorama 300 × 200, links der Bug, rechts der Niedergang ---------- */
  const szh = (id, spot, label, inner) => hs(id, spot, label, inner);
  const hs = (id, spot, label, inner) => `<g class="szh" data-hot="${id}"${spot ? ` data-spot="${spot}"` : ''} role="button" tabindex="0" aria-label="${label}">${inner}</g>`;
  const zub = inner => `<g class="zub">${inner}</g>`;
  function bullauge(st, cx, cy, r, id) { const s = STIM[st] || STIM.fahrt, alt = BX; BX = [cx - r, cx + r]; const kid = neuId('bu');
    const wild = s.wellen === 'E' || s.wellen === 'X', wasser = [0, 1, 2].map(i => { const y = cy + r * (.08 + i * .3), P = r * (1.1 + i * .5), A = r * (.07 + i * .05) * (s.wellen === 'X' ? 2.4 : s.wellen === 'E' ? 1.6 : 1); const c = i % 2 ? mix(s.see, s.seeU, .4 + i * .2) : mix(mix(s.see, '#ffffff', .18), s.seeU, i * .25);
      return wild ? spitzBand(y, P, A, c, 4 - i, cy + r + 2, gischtKamm(y, P, A, s.wel, .8)) : band(y, P, A, c, 1, (8 - i * 1.6) * (s.wellen === 'F' ? .5 : 1), cy + r + 2, {kante: s.wel, rechts: s.wellen === 'F'}); }).join('');
    BX = alt;
    return hs(id, 'bullauge', 'Bullauge: an Deck, und man sieht das Wetter', `<defs><clipPath id="${kid}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><linearGradient id="${kid}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.him[0]}"/><stop offset="1" stop-color="${s.him[1]}"/></linearGradient></defs>
      <circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="#c9a46a" stroke="#7a5a2a" stroke-width=".8"/><circle cx="${cx}" cy="${cy}" r="${r + .8}" fill="#8a6a3a"/>
      <g clip-path="url(#${kid})"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="url(#${kid}h)"/>${s.sonne ? `<circle cx="${f2(cx + r * .45)}" cy="${f2(cy - r * .35)}" r="${f2(r * .22)}" fill="${s.sonne[3]}"/>` : ''}${s.mond ? `<circle cx="${f2(cx + r * .4)}" cy="${f2(cy - r * .4)}" r="${f2(r * .16)}" fill="#f3e7c9"/>` : ''}${wasser}${s.nebel ? `<rect x="${cx - r}" y="${f2(cy - r * .3)}" width="${2 * r}" height="${f2(r * .6)}" fill="#eef2f4" opacity=".5"/>` : ''}
        <path d="M${f2(cx - r * .7)} ${f2(cy - r * .55)} Q${f2(cx - r * .2)} ${f2(cy - r * .95)} ${f2(cx + r * .3)} ${f2(cy - r * .8)}" stroke="#fff" stroke-width="${f2(r * .12)}" opacity=".18" fill="none" stroke-linecap="round"/></g>
      ${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${f2(cx + Math.cos(a * Math.PI / 180) * (r + 1.9))}" cy="${f2(cy + Math.sin(a * Math.PI / 180) * (r + 1.9))}" r=".7" fill="#7a5a2a"/>`).join('')}`); }
  const seil = (d, w = 3.2) => `<path d="${d}" stroke="#a88f62" stroke-width="${w + 1.4}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#e6d3a8" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#a88f62" stroke-width=".7" stroke-dasharray="1.4 2.6" fill="none"/>`;
  /* das alte Knotenbrett: großer Knoten oben, gelernte Knoten an den Haken */
  function knotenbrett(x, y, sc, gelernt) { const GLYPH = ['M0 0 V3 C-4 4 -4 10 0 10 C4 10 4 4 0 3', 'M0 0 C-4 2 4 4 0 6 C-4 8 4 10 0 11', 'M-3 0 V7 Q0 10 3 7 V0'];
    const haken = Array.from({length: 9}, (_, i) => { const hx = 12 + (i % 2) * 17, hy = 66 + Math.floor(i / 2) * 10; return `<circle cx="${hx}" cy="${hy}" r="1.1" fill="#c8962e"/>${i < gelernt ? `<g transform="translate(${hx} ${hy}) scale(.75)">${seil(GLYPH[i % 3], 2.4)}</g>` : ''}`; }).join('');
    return hs('knoten', 'knoten', 'Knotenbrett: Knotenkunde', `<g class="pendel" style="transform-origin:${f2(x + 20 * sc)}px ${f2(y - 6 * sc)}px"><g transform="translate(${x} ${y}) scale(${sc})"><path d="M20 -6 L5 0 M20 -6 L35 0" stroke="#5a3a24" stroke-width="1.2"/><circle cx="20" cy="-6" r="1.8" fill="#8a6420"/><rect width="40" height="118" rx="3" fill="#8a5a3a" stroke="#5a3a24" stroke-width="1.2"/><path d="M2 40 H38 M2 80 H38" stroke="#000" stroke-opacity=".08"/>
      <circle cx="20" cy="5" r="2" fill="#5a3a24"/><g transform="translate(20 5)">${seil('M0 0 V17 M-1 17 C-7 19 -7 25 0 26 C7 27 6 21 2 19 M-3 26 C-15 32 -13 56 0 56 C13 56 15 32 3 26 M2 25 Q8 30 6 38')}</g>${haken}</g></g>`); }
  const wandkarte = (x, y, sc, kurs) => hs('navi', 'karte', 'Seekarte an der Wand: Navigationsschule', `<g class="wandkarte" transform="translate(${x} ${y}) scale(${sc})"><circle cx="33" cy="-1" r="1.6" fill="#8a6420"/><rect x="0" y="0" width="66" height="40" rx="2" fill="#6e452c"/><rect x="3" y="3" width="60" height="34" fill="#cfe3ea"/>
    <path d="M3 3 H36 Q31 9 37 15 Q29 22 19 19 Q11 27 3 25 Z" fill="#efe2c2" stroke="#8a6420" stroke-width=".6"/><path d="M3 30 Q17 27 27 35 M42 37 Q48 31 63 32" stroke="#9cc2d2" stroke-width=".7" fill="none"/>
    <circle cx="42" cy="13" r="1.7" fill="#c2473b"/><circle cx="48" cy="21" r="1.7" fill="#3e8a5a"/><path d="M56 7 l1.4 -3 1.4 3z" fill="#2b2118"/><path d="M21 23 Q34 28 45 17 Q52 10 58 12" stroke="#7a6a58" stroke-width=".8" stroke-dasharray="1.6 1.6" fill="none"/><path d="M21 23 Q34 28 45 17 Q52 10 58 12" pathLength="100" stroke="#c0392b" stroke-width="1.3" stroke-dasharray="${Math.round(kurs * 100)} 100" fill="none"/>
    <g transform="translate(55 28)"><circle r="5" fill="none" stroke="#3d5f8f" stroke-width=".6"/><path d="M0 -6 L1.2 0 L0 6 L-1.2 0Z" fill="#3d5f8f"/></g></g>`);
  function manbrett(x, y, sc, n) { const feld = [[20, 44], [11, 33], [11, 19], [22, 10], [37, 11], [45, 24], [35, 35]], [bx, by] = feld[Math.min(n, 6)];
    return hs('praxis', 'manoever', 'Manöverbrett: Praxis', `<g class="manbrett" transform="translate(${x} ${y}) scale(${sc})"><circle cx="28" cy="-1" r="1.6" fill="#8a6420"/><rect x="0" y="0" width="56" height="54" rx="3" fill="#8a5a3a" stroke="#4a2e1d" stroke-width="1.5"/><rect x="4" y="4" width="48" height="46" fill="#9cc7d6"/>
      <path d="M16 4V50M28 4V50M40 4V50M4 16H52M4 28H52M4 40H52" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/><rect x="4" y="45" width="30" height="5" fill="#b98a5a"/>
      <path d="${feld.map((q, i) => (i ? 'L' : 'M') + q.join(' ')).join(' ')}" stroke="#2b2118" stroke-width=".7" stroke-dasharray="1.5 1.5" fill="none"/>${feld.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="2.3" fill="${i && i <= n ? '#f0b53e' : '#fbf6ea'}" stroke="#2b2118" stroke-width=".5"/>`).join('')}
      <g transform="translate(${bx} ${by - 1})"><path d="M0 -6 Q3.4 -1.5 2.8 4 H-2.8 Q-3.4 -1.5 0 -6Z" fill="#fbf6ea" stroke="#2b2118" stroke-width=".8"/><path d="M0 -4 V3" stroke="#c2473b" stroke-width="1"/></g></g>`); }
  const buecher = (x, y, w) => hs('buch', 'buecher', 'Bücher: alle Prüfungsfragen', `<rect x="${x}" y="${y + 9}" width="${w}" height="1.8" fill="#4a2e19"/>${['#a83a2a', '#2e6a8a', '#c79a2a', '#3a7a4a', '#7a4a8a', '#b5562f'].map((c, i) => `<rect x="${f2(x + 1 + i * (w - 2) / 6)}" y="${y + (i % 2) * 1.2}" width="${f2((w - 2) / 6 - .5)}" height="${f2(9 - (i % 2) * 1.2)}" fill="${c}" rx=".4"/>`).join('')}`);
  const telefon = (x, y, s = 1) => hs('tel', 'telefon', 'Rotes Telefon: Harms prüft', `<g transform="translate(${x} ${y}) scale(${s})"><path class="hoerer" d="M0 4 Q0 0 4 0 H12 Q16 0 16 4 L14 6 L12 4 H4 L2 6 Z" fill="#d0402f" stroke="#7a2318" stroke-width=".7"/><rect x="1.5" y="7" width="13" height="10" rx="2" fill="#d0402f" stroke="#7a2318" stroke-width=".7"/><circle cx="8" cy="12" r="3" fill="#f3e7c9" stroke="#7a2318" stroke-width=".5"/><path d="M15 13 q4 2 2 5 q-2 3 2 5" stroke="#7a2318" stroke-width=".8" fill="none"/></g>`);
  const funk = (x, y) => hs('funk', 'funk', 'Funkgerät: kommt später mit dem Funkschein', `<g class="zub"><rect x="${x}" y="${y}" width="14" height="8" rx="1.5" fill="#3a2a1e" stroke="#1e140c" stroke-width=".5"/><circle cx="${x + 4}" cy="${y + 4}" r="2" fill="#5a4a3a"/><rect x="${x + 8}" y="${y + 2}" width="4" height="1" fill="#8a7a6a"/><rect x="${x + 8}" y="${y + 4.5}" width="4" height="1" fill="#8a7a6a"/><path d="M${x + 12} ${y} l2 -6" stroke="#5a4a3a" stroke-width=".7"/><g transform="translate(${x + 13} ${y + 7})"><circle r="2.6" fill="#2b1a0e" stroke="#c9a46a" stroke-width=".4"/><rect x="-1.2" y="-.4" width="2.4" height="1.9" rx=".3" fill="#c9a46a"/><path d="M-.8 -.4 v-.7 a.8 .8 0 0 1 1.6 0 v.7" stroke="#c9a46a" stroke-width=".4" fill="none"/></g></g>`);
  const hocker = (x, y, s = 1) => hs('hocker', 'hocker', 'Hocker: Folge starten', `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="10" ry="3.4" fill="none" stroke="#e8a33c" stroke-width="1.6" class="hockerglow"/><path d="M-6 2 L-8 16 M6 2 L8 16 M0 3 V16 M-7 10 H7" stroke="#5a3820" stroke-width="1.6"/><ellipse cx="0" cy="0" rx="8" ry="2.6" fill="#a8402e"/><ellipse cx="0" cy="-.6" rx="7" ry="1.8" fill="#c25a3e"/></g>`);
  /* Schiffsuhr aus Messing mit der Uhrzeit der App */
  function uhr(x, y, r, stunde) { const h = stunde % 12, m = (stunde % 1) * 60, wh = (h + m / 60) * 30 - 90, wm = m * 6 - 90, hand = (w, l, sw, c) => { const a = w * Math.PI / 180; return `<path d="M${x} ${y} L${f2(x + Math.cos(a) * l)} ${f2(y + Math.sin(a) * l)}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`; };
    return `<g class="schiffsuhr" aria-label="Uhr: ${Math.floor(stunde) % 24}:${String(Math.floor(m)).padStart(2, '0')}"><circle cx="${x}" cy="${y}" r="${f2(r + 1.6)}" fill="#a8823e"/><circle cx="${x}" cy="${y}" r="${f2(r + .9)}" fill="#e2c072"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f6efdc"/>
      ${Array.from({length: 12}, (_, i) => { const a = i * 30 * Math.PI / 180, l0 = i % 3 ? r * .82 : r * .7; return `<path d="M${f2(x + Math.cos(a) * l0)} ${f2(y + Math.sin(a) * l0)} L${f2(x + Math.cos(a) * r * .92)} ${f2(y + Math.sin(a) * r * .92)}" stroke="#2b2118" stroke-width="${i % 3 ? .3 : .55}"/>`; }).join('')}
      ${hand(wh, r * .5, .8, '#2b2118')}${hand(wm, r * .76, .5, '#2b2118')}<circle cx="${x}" cy="${y}" r=".6" fill="#c0392b"/><circle cx="${f2(x - r * .4)}" cy="${f2(y - r * .45)}" r="${f2(r * .25)}" fill="#fff" opacity=".25"/></g>`; }

  /* Bootsküche links (Zubehör): Gaskocher in kardanischer Aufhängung mit Topf und Kessel, Spüle, Gashahn, Schapps mit Tellern und Bechern */
  function kombuese(x) { return zub(`<g transform="translate(${x} 0)">
    <rect x="2" y="56" width="58" height="26" rx="1.5" fill="#6a4529" stroke="#3b2414" stroke-width=".7"/><path d="M2 66 H60 M2 76 H60" stroke="#3b2414" stroke-width=".6"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<ellipse cx="${6 + i * 4.2}" cy="62" rx="1.8" ry="3.4" fill="#e9e2cf" stroke="#9a8a6a" stroke-width=".3"/>`).join('')}
    ${[0, 1, 2].map(i => `<rect x="${36 + i * 7}" y="70" width="4.4" height="5.4" rx="1" fill="${['#c0392b', '#2e6a8a', '#e9c23f'][i]}"/><path d="M${40.4 + i * 7} 71.4 q1.6 0 1.6 1.6 q0 1.6 -1.6 1.6" stroke="${['#c0392b', '#2e6a8a', '#e9c23f'][i]}" stroke-width=".7" fill="none"/>`).join('')}
    <path d="M4 86 H58" stroke="#c9a46a" stroke-width=".8"/>${[10, 20, 30].map((hx, i) => `<path d="M${hx} 86 v3" stroke="#c9a46a" stroke-width=".6"/>`).join('')}<path d="M8 89 h4 v2 a3 3 0 0 1 -6 0 v-2z" fill="#3a3a3a"/><path d="M18 89 l4 0 l0 12 l-4 0z" fill="#e9e2cf"/><path d="M28 89 q3 6 0 12" stroke="#8a6a3a" stroke-width="1.2" fill="none"/>
    <rect x="0" y="112" width="62" height="3" rx="1" fill="#b98a5a"/><path d="M0 110.6 H62" stroke="#8a6440" stroke-width="1.1"/>
    <rect x="1" y="115" width="60" height="35" fill="#5e3e26" stroke="#3b2414" stroke-width=".6"/><path d="M31 115 V150 M1 132 H61" stroke="#3b2414" stroke-width=".6"/>${[[26, 124], [36, 124], [26, 141], [36, 141]].map(([kx, ky]) => `<circle cx="${kx}" cy="${ky}" r=".9" fill="#c9a46a"/>`).join('')}
    <!-- Gaskocher kardanisch: Bügel links und rechts, der Kocher pendelt -->
    <path d="M5 112 V97 M29 112 V97" stroke="#8a8f94" stroke-width="1.4"/><g class="kardan" style="transform-origin:17px 97px"><rect x="6" y="98" width="22" height="9" rx="1.2" fill="#b7bdc2" stroke="#6b7177" stroke-width=".6"/><path d="M6 98 H28" stroke="#6b7177" stroke-width="1.2"/>
      <rect x="8" y="91" width="9" height="7" rx="1" fill="#3a4a5a"/><path d="M7.5 91 H17.5" stroke="#26323d" stroke-width="1"/><path d="M12.5 91 v-1.4" stroke="#26323d" stroke-width="1"/><path class="dampf" d="M11 88 q-1.5 -3 0 -6 q1.5 -3 0 -6" stroke="#f3f6f8" stroke-width=".9" fill="none" opacity=".6"/><path class="dampf d2" d="M14 88 q1.5 -3 0 -6 q-1.5 -3 0 -6" stroke="#f3f6f8" stroke-width=".8" fill="none" opacity=".5"/>
      <path d="M19 98 q0 -6 5 -6 q5 0 5 6 z" fill="#c9a24a" stroke="#8a6a2a" stroke-width=".5"/><path d="M29 94 q3 0 4 -3" stroke="#8a6a2a" stroke-width=".9" fill="none"/><path d="M21 92 q3 -3 6 0" stroke="#3a3a3a" stroke-width=".8" fill="none"/>
      <circle cx="12" cy="104.5" r="1.1" fill="#3a3a3a"/><circle cx="22" cy="104.5" r="1.1" fill="#3a3a3a"/></g>
    <g transform="translate(17 120)"><circle r="2.6" fill="#d0402f" stroke="#7a2318" stroke-width=".5"/><path d="M-2 0 H2" stroke="#fff" stroke-width=".9"/></g><path d="M17 122.6 V150" stroke="#c9a46a" stroke-width=".7" stroke-dasharray="1.4 1"/>
    <!-- Spüle mit Hahn und Handpumpe -->
    <ellipse cx="46" cy="112.5" rx="10" ry="1.8" fill="#6b7177"/><ellipse cx="46" cy="112.3" rx="8.4" ry="1.2" fill="#3e454c"/><path d="M52 112 V104 q0 -2 -2.4 -2 h-3" stroke="#a9b0b6" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M40 112 v-6 h2 v6" fill="#8a8f94"/><path d="M41 106 l3 -2" stroke="#8a8f94" stroke-width=".9"/>
    <path d="M58 104 h3 v8 h-3z" fill="#e9e2cf" stroke="#9a8a6a" stroke-width=".3"/></g>`); }

  /* Maschinenraum hinter der kleinen Tür unter dem Niedergang, im Schnitt: Benzintank, Batterien mit Hauptschalter, Bilgepumpe, Feuerlöscher, Werkzeug; darüber die Plicht, hinten am Spiegel hängt der Außenborder */
  function maschinenraum(x, W, st) { const s = STIM[st] || STIM.fahrt;
    return `<g class="mraum">
    <rect x="${x}" y="0" width="${W - x}" height="58" fill="${s.him[1]}"/><path d="M${x} 52 H${W}" stroke="#e9e2cf" stroke-width="3.2"/><path d="M${x} 50 H${W - 6}" stroke="#7a4e2e" stroke-width="1.2"/>
    <path d="M${W - 8} 22 V58" stroke="#e9e2cf" stroke-width="2.4"/><path d="M${x + 22} 52 l18 -10" stroke="#8a5a33" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="${x}" y="56" width="${W - x}" height="5" fill="#7a4e2e"/><path d="M${x} 56 H${W}" stroke="#a87249" stroke-width=".8"/>
    <rect x="${x}" y="61" width="${W - x}" height="89" fill="#2b1d12"/>${Array.from({length: 9}, (_, i) => `<path d="M${x} ${66 + i * 10} H${W - 6}" stroke="#22170e" stroke-width=".5"/>`).join('')}
    <path d="M${W - 6} 22 L${W - 1} 22 L${W - 4} 150 L${W - 8} 150 Z" fill="#e9e2cf" stroke="#9a8a6a" stroke-width=".5"/>
    <circle cx="${x + 34}" cy="68" r="5" fill="#ffd27a" opacity=".22"/><circle cx="${x + 34}" cy="66" r="1.4" fill="#ffe2a0"/>
    ${szh('motor', 'motor', 'Maschinenraum: Motorkunde', `
      <rect x="${x + 6}" y="104" width="20" height="30" rx="2" fill="#b0402f" stroke="#6a1f17" stroke-width=".7"/><rect x="${x + 9}" y="108" width="14" height="6" rx="1" fill="#f3e7c9"/><path d="M${x + 12} 111 h${8}" stroke="#2b2118" stroke-width=".6"/><path d="M${x + 16} 104 V61" stroke="#2b2118" stroke-width="1.6"/><text x="${x + 16}" y="125" text-anchor="middle" font-size="4" fill="#f3e7c9" font-family="sans-serif">TANK</text>
      <rect x="${x + 30}" y="122" width="12" height="12" rx="1" fill="#2f3b45"/><rect x="${x + 43}" y="122" width="12" height="12" rx="1" fill="#2f3b45"/><rect x="${x + 32}" y="120" width="3" height="2" fill="#c0392b"/><rect x="${x + 38}" y="120" width="3" height="2" fill="#2b2b2b"/><rect x="${x + 45}" y="120" width="3" height="2" fill="#c0392b"/><rect x="${x + 51}" y="120" width="3" height="2" fill="#2b2b2b"/>
      <circle cx="${x + 42}" cy="104" r="4.2" fill="#2b2b2b"/><path d="M${x + 42} 101 v6" stroke="#d0402f" stroke-width="2" stroke-linecap="round"/>
      <path d="M${x + 4} 146 h${W - x - 14}" stroke="#4d7b95" stroke-width="2.4" opacity=".7"/><rect x="${x + 48}" y="140" width="8" height="6" rx="2" fill="#5a6a72"/><path d="M${x + 52} 140 V112 q0 -4 4 -4 h${W - x - 64}" stroke="#7a8a92" stroke-width="1.1" fill="none"/>
      <rect x="${x + 4}" y="74" width="5" height="16" rx="2.4" fill="#d0402f"/><path d="M${x + 5} 74 h3 v-2 h-3z" fill="#2b2b2b"/>
      <path d="M${x + 22} 76 l6 10 M${x + 30} 74 v14 M${x + 34} 76 l-3 10" stroke="#a9b0b6" stroke-width="1.2" stroke-linecap="round"/><path d="M${x + 21} 74 h16" stroke="#8a6440" stroke-width="1.2"/>`)}
    ${szh('motor2', 'motor', 'Außenborder am Spiegel: Motorkunde', `<g transform="translate(${W - 2} 30)"><rect x="-1" y="0" width="8" height="10" rx="2.4" fill="#3a3f44"/><path d="M1 10 h4 v26 h-4z" fill="#4a5056"/><path d="M0 36 h6 l1 4 h-8z" fill="#3a3f44"/><path d="M-2 6 h-5" stroke="#8a8f94" stroke-width="1.2"/></g>`)}
    </g>`; }

  /* Niedergang im Schnitt von der Seite: Wange schräg, Stufen als Bretter, Handlauf, oben die Luke mit Schiebeluk; darunter die kleine Tür zum Maschinenraum */
  function niedergang(x, st) { const s = STIM[st] || STIM.fahrt;
    const x0 = x, y0 = 150, x1 = x + 40, y1 = 16, stufen = 7;
    const tritt = Array.from({length: stufen}, (_, i) => { const k = (i + 1) / (stufen + 1), sx = x0 + (x1 - x0) * k, sy = y0 + (y1 - y0) * k; return `<rect x="${f2(sx - 10)}" y="${f2(sy - 1.2)}" width="12" height="2.6" rx=".8" fill="#a87249" stroke="#5a3820" stroke-width=".5"/><path d="M${f2(sx - 10)} ${f2(sy + 1.6)} h12" stroke="#3b2414" stroke-width=".5" opacity=".6"/>`; }).join('');
    return `<rect x="${x + 22}" y="0" width="30" height="16" fill="${s.him[1]}"/><path d="M${x + 22} 14 H${x + 54}" stroke="#2a1a0e" stroke-width="1.6"/><rect x="${x + 40}" y="8" width="16" height="4" rx="1" fill="#8a5a33"/><path d="M${x + 22} 16 L${x + 54} 16 L${x + 50} 150 L${x + 6} 150 Z" fill="#ffe9b8" opacity=".1"/>
      ${szh('tuer', 'deck', 'Niedergang: an Deck', `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="#5a3820" stroke-width="3.6" stroke-linecap="round"/>${tritt}<path d="M${x0 + 10} ${y0 - 34} L${x1 + 8} ${y1 + 8}" stroke="#c9a46a" stroke-width="1.2" stroke-linecap="round"/><path d="M${x0 + 10} ${y0 - 34} v8 M${x1 + 8} ${y1 + 8} v-6" stroke="#c9a46a" stroke-width="1"/>`)}
      ${szh('mtuer', 'motor', 'Kleine Tür: Maschinenraum', `<rect x="${x + 16}" y="118" width="16" height="32" rx="2" fill="#5a3820" stroke="#2a1a0e" stroke-width=".8"/><rect x="${x + 18}" y="120" width="12" height="28" rx="1.4" fill="#2b1d12"/><path d="M${x + 18} 120 L${x + 26} 122 L${x + 26} 146 L${x + 18} 148 Z" fill="#6a4529" stroke="#2a1a0e" stroke-width=".5"/><circle cx="${x + 24.6}" cy="134" r=".8" fill="#c9a46a"/><path d="M${x + 22} 126 l3 -2" stroke="#ffd27a" stroke-width=".5" opacity=".6"/>`)}`; }

  function kajuete(o = {}) {
    const K = 64, W = 452, MR = 382, st = o.stim || 'fahrt', fig = o.fig || (() => ''), sp = x => `<path d="M${x} 16 Q${x - 3} 80 ${x + 2} 146" stroke="#3f2816" stroke-width="5" fill="none"/><path d="M${x + 1.5} 16 Q${x - 1.5} 80 ${x + 3.5} 146" stroke="#7a5233" stroke-width=".8" fill="none"/>`;
    const holz = (y0, y1, c1, c2, w) => `<rect y="${y0}" width="${w}" height="${y1 - y0}" fill="${c1}"/>${Array.from({length: Math.ceil((y1 - y0) / 9)}, (_, i) => `<path d="M0 ${y0 + i * 9} H${w}" stroke="${c2}" stroke-width=".5"/>`).join('')}`;
    const route = (pk, fb) => `<path d="M${pk.map(p => p.join(' ')).join(' L')}" stroke="#3a3a3a" stroke-width=".6" stroke-dasharray="2 1.2" fill="none"/>${pk.map(([x, y], i) => fb[i] ? `<rect x="${x - 1.8}" y="${y - 1.1}" width="3.6" height="2.2" rx=".5" fill="${fb[i]}" stroke="#2b2118" stroke-width=".35"/>` : '').join('')}`;
    return `<svg class="panosvg" viewBox="0 0 ${W} 200" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Kajüte, nach links und rechts schieben">
    <defs><linearGradient id="pw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4529"/><stop offset="1" stop-color="#4f331e"/></linearGradient>
      <radialGradient id="pschein" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#ffd58a" stop-opacity=".55"/><stop offset=".45" stop-color="#f0b050" stop-opacity=".22"/><stop offset="1" stop-color="#e8a33c" stop-opacity="0"/></radialGradient>
      <linearGradient id="pkegel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3a8" stop-opacity=".35"/><stop offset="1" stop-color="#ffe3a8" stop-opacity="0"/></linearGradient>
      <radialGradient id="plk2"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".22"/><stop offset="1" stop-color="#e8a33c" stop-opacity="0"/></radialGradient></defs>
    <rect width="${MR}" height="150" fill="url(#pw)"/>${Array.from({length: 15}, (_, i) => `<path d="M0 ${18 + i * 9} Q${MR / 2} ${22 + i * 9} ${MR} ${18 + i * 9}" stroke="#432a17" stroke-width=".5" fill="none"/>`).join('')}
    <path d="M0 0 H${MR} V14 Q${MR / 2} 24 0 14 Z" fill="#3a2414"/>${[20, 60, 100, 164, 224, 284, 344].map(x => `<path d="M${x} 0 V${f2(16 + 4 * Math.sin(x / MR * Math.PI))}" stroke="#2a1a0e" stroke-width="4"/>`).join('')}
    <path d="M0 14 Q${MR / 2} 24 ${MR} 14" stroke="#7a5233" stroke-width="1.2" fill="none"/>
    <path d="M0 14 L18 20 L26 150 L0 150 Z" fill="#3f2816" opacity=".55"/><path d="M18 20 L26 150" stroke="#2a1a0e" stroke-width="1.4"/>
    ${sp(62)}${sp(K + 62)}${sp(K + 98)}${sp(K + 200)}${sp(K + 250)}
    ${bullauge(st, 42, 42, 9, 'bull1')}${bullauge(st, 94, 36, 8, 'bull4')}
    ${zub(`<path d="M26 122 L60 122 L60 150 L27 150 Z" fill="#5a3b22"/><path d="M27 116 Q40 112 60 114 L60 124 L27 124 Z" fill="#6f87a0"/><ellipse cx="36" cy="114" rx="7" ry="3" fill="#e9e2cf"/><path d="M44 116 L60 115 L60 124 L44 124 Z" fill="#a8463a"/>`)}
    ${buecher(28, 70, 30)}<path d="M27 81 H59" stroke="#7a5233" stroke-width=".8"/>
    ${kombuese(K - 0)}
    <g transform="translate(${K} 0)">
      <circle cx="228" cy="80" r="50" fill="url(#plk2)"/>
      ${bullauge(st, 122, 40, 11, 'bull2')}${bullauge(st, 172, 40, 11, 'bull3')}
      ${zub(`<rect x="190" y="18" width="9" height="11" rx="1" fill="#3a2a1e" stroke="#c9a46a" stroke-width=".6"/><path d="M191 26 l3 -3 l2 2 l2 -2 v4 h-7z" fill="#7a9a8a"/>`)}
      ${telefon(101, 62, .8)}
      ${knotenbrett(72, 42, .5, o.knoten || 0)}
      <path d="M100 116 Q140 110 196 116 L196 140 L100 140 Z" fill="#7a3a2e"/><path d="M100 116 Q140 110 196 116" stroke="#9a4a3a" stroke-width="2.5" fill="none"/>
      ${zub(`<path d="M104 98 h20 v3 h-20z" fill="#5a3b22"/><rect x="106" y="90" width="4" height="8" fill="#a8603a"/><path d="M108 90 q-3 -4 -1 -7 M108 90 q3 -4 1 -8" stroke="#4a8a4a" stroke-width="1.1" fill="none"/><path d="M114 98 v-5 h4 v5" fill="#4a6a8a"/>`)}
      ${uhr(147, 70, 5, o.stunde != null ? o.stunde : 10)}
      <ellipse cx="141" cy="128" rx="92" ry="74" fill="url(#pschein)" class="schein"/>
      <path d="M134 50 L148 50 L176 150 L106 150 Z" fill="url(#pkegel)"/>
      <path d="M141 0 V40" stroke="#c9a46a" stroke-width=".7"/><path d="M134 49 L136.5 40 H145.5 L148 49 Z" fill="#c9a46a"/><path d="M134 49 H148" stroke="#8a6420" stroke-width=".8"/><ellipse cx="141" cy="50" rx="4" ry="2.6" fill="#ffe2a0" class="flacker"/>
      ${fig('hinnerk', 116, 150, 50)}${fig('smilla', 166, 150, 46)}${fig('klabauter', 82, 41, 12)}
    </g>
    ${niedergang(K + 258, st)}
    ${maschinenraum(MR, W, st)}
    <path d="M${MR} 14 V150" stroke="#2a1a0e" stroke-width="3"/><path d="M${MR + 1.6} 61 V150" stroke="#5a3820" stroke-width="1"/>
    ${o.gast ? fig(o.gast, K + 264, 117, 46) : ''}
    ${holz(150, 200, '#3a2619', '#2c1c11', W)}
    <path d="M${MR} 150 V200" stroke="#22170e" stroke-width="2"/>
    <g transform="translate(${K} 0)">
      ${zub(`<ellipse cx="140" cy="184" rx="40" ry="8.8" fill="#8a3b2e"/><ellipse cx="140" cy="184" rx="30" ry="6.4" fill="#c9a24a"/><ellipse cx="140" cy="184" rx="20" ry="4" fill="#8a3b2e"/>`)}
      ${szh('karte', 'tisch', 'Kartentisch: Reisekarte', `<ellipse cx="141" cy="151" rx="36" ry="11.5" fill="#4a2e19"/><ellipse cx="141" cy="148.5" rx="36" ry="11" fill="#8a5a36"/><ellipse cx="141" cy="148" rx="33" ry="9.6" fill="none" stroke="#a87249" stroke-width=".6"/><path d="M138 152 V174" stroke="#4a2e19" stroke-width="4.5"/><path d="M128 176 H150" stroke="#4a2e19" stroke-width="2.5"/>
        <path d="M118.5 145.6 L161 143.4 L166.5 152.2 L114 154.4 Z" fill="#000" opacity=".18"/>
        <path d="M118 144.4 L161 142.2 L166 151 L113.5 153.2 Z" fill="#efe2bf" stroke="#8a6a3e" stroke-width=".45"/><path d="M128 143.9 C132 146 131 149 125 152.8 L113.5 153.2 L118 144.4 Z" fill="#cfe0c0" opacity=".85"/><path d="M161 142.2 L166 151 L156 151.4 C154 148 158 145 161 142.2 Z" fill="#cfe0c0" opacity=".85"/>
        ${route([[121, 150.6], [131, 148.6], [140, 149.6], [149, 146.4], [157, 145.4]], ['#2f8f4e', '#2f8f4e', '#8fcf6a', '#e9c23f', null])}<path d="M156 144.2 l2 1.4 m0 -1.4 l-2 1.4" stroke="#c0392b" stroke-width=".7"/>
        <g transform="translate(160 149.5) scale(1 .45)"><circle r="2.6" fill="none" stroke="#3d5f8f" stroke-width=".45"/><path d="M0 -3 L.7 0 L0 3 L-.7 0Z" fill="#3d5f8f"/></g><path d="M147 152.2 L158 150.6" stroke="#e8b84a" stroke-width="1" stroke-linecap="round"/><path d="M158 150.6 l1 -.15" stroke="#2b2118" stroke-width="1"/>`)}
      ${zub(`<path d="M119 141 h5 v-4 q0 -2 -2.5 -2 q-2.5 0 -2.5 2 z" fill="#4a6a8a"/><path d="M124 138 q2 0 2 2" stroke="#4a6a8a" stroke-width=".7" fill="none"/>`)}
      ${fig('backbord', 100, 192, 13)}${hocker(141, 178, 1.1)}
      ${wandkarte(203, 54, .58, o.kurs || 0)}${manbrett(212, 21, .5, o.manoever || 0)}
      <path d="M204 116 H250 V122 H204 Z" fill="#7a4e2e"/><path d="M206 122 V150 M248 122 V150" stroke="#4a2e19" stroke-width="2.5"/>${zub(`<rect x="210" y="111" width="14" height="5" fill="#2b3a4a"/><path d="M226 116 l8 -3 l8 3" stroke="#c9a46a" stroke-width=".7" fill="none"/>`)}
      ${funk(214, 98)}
      ${zub(`<path d="M244 44 q-3 20 2 40 h6 q4 -20 1 -40 z" fill="#d9a52a"/><path d="M246 44 h7" stroke="#8a6420" stroke-width="1.2"/>`)}
    </g>
    </svg>`; }

  const CSS = `.szenerie{width:100%;height:100%;display:block}
  .szenerie .wl{animation:szwl 7s linear infinite}@keyframes szwl{to{transform:translateX(var(--P))}}
  .szenerie .schaukel3{transform-box:view-box;animation:szschauk 5s ease-in-out infinite}@keyframes szschauk{25%{transform:rotate(1.1deg)}75%{transform:rotate(-1.1deg)}}
  .szenerie .schaukel3.rollF{animation:szschaukF 3.4s ease-in-out infinite}@keyframes szschaukF{25%{transform:rotate(.9deg) translateY(-.3px)}75%{transform:rotate(-.7deg) translateY(.3px)}}
  .szenerie .schaukel3.roll1{animation:szschauk1 3s ease-in-out infinite}@keyframes szschauk1{25%{transform:rotate(2.6deg) translateY(-.6px)}75%{transform:rotate(-2.4deg) translateY(.6px)}}
  .szenerie .schaukel3.roll2{animation:szschauk2 2.6s ease-in-out infinite}@keyframes szschauk2{20%{transform:rotate(4.5deg) translateY(-2.5px)}50%{transform:rotate(-1deg) translateY(1.5px)}75%{transform:rotate(-4.5deg) translateY(-1.5px)}}
  .szenerie .heave{animation:szheave 2.8s ease-in-out infinite}@keyframes szheave{50%{transform:translateY(var(--hub,-2px))}}
  .szenerie .berg{animation:szberg 7s ease-in-out infinite}@keyframes szberg{0%,100%{transform:translateY(6px)}55%{transform:translateY(-6px)}}
  .szenerie .bugw{transform-box:fill-box;transform-origin:100% 100%;animation:szbug .9s ease-in-out infinite alternate}@keyframes szbug{to{transform:scale(1.15,.85)}}
  .szenerie .spray{animation:szspray 1.6s ease-out infinite;opacity:0}@keyframes szspray{0%{opacity:0;transform:translate(0,2px)}20%{opacity:.9}100%{opacity:0;transform:translate(-5px,-7px)}}
  .szenerie .blitz{opacity:0;animation:szblitz 7s linear infinite}@keyframes szblitz{0%,88%,92%,96%,100%{opacity:0}89%,94%{opacity:.75}}
  .szenerie .sturmwolken{animation:szsw 12s linear infinite alternate}@keyframes szsw{to{transform:translateX(-20px)}}
  .szenerie .regenfall{animation:szregen 1s linear infinite}@keyframes szregen{from{transform:translate(0,0)}to{transform:translate(var(--rx),var(--rh))}}
  .szenerie .wolke{animation:szwolke 60s linear infinite alternate}@keyframes szwolke{to{transform:translateX(14px)}}
  .szenerie .nebel{animation:sznebel 24s ease-in-out infinite alternate}@keyframes sznebel{to{transform:translateX(30px)}}
  .szenerie .funkel,.panosvg .funkel{animation:szfunkel 3s ease-in-out infinite}@keyframes szfunkel{50%{opacity:.25}}
  .szenerie .glitzer{animation:szglitzer 3s ease-in-out infinite;opacity:.1}@keyframes szglitzer{50%{opacity:.85}}
  .miniharms g[class^="a-"]{opacity:0}
  .miniharms.nase .a-nase{opacity:1;animation:sznase 3.2s ease-in-out}@keyframes sznase{0%,100%{transform:translateY(30px)}25%,75%{transform:translateY(0)}40%{transform:translate(0,-2px)}55%{transform:translate(1px,0)}}
  .miniharms.brille .a-brille{opacity:1}.miniharms.brille .tuch{animation:szputz .5s ease-in-out infinite alternate}@keyframes szputz{to{transform:translateX(16px)}}
  .miniharms.pfeife .a-pfeife{opacity:1}.miniharms .rauch{opacity:0}.miniharms.pfeife .rauch{animation:szrauch 1.6s ease-out infinite}.miniharms .r2{animation-delay:.8s!important}@keyframes szrauch{0%{opacity:.8;transform:translateY(6px)}100%{opacity:0;transform:translate(4px,-10px) scale(1.6)}}
  .miniharms.gaehnen .a-gaehnen{opacity:1;transform-box:fill-box;transform-origin:center;animation:szgaehn 3.2s ease-in-out}@keyframes szgaehn{0%,100%{transform:scale(.2)}30%,70%{transform:scale(1)}}
  .panosvg .szh{cursor:pointer}.panosvg .szh:focus{outline:none}.panosvg .szh:focus-visible,.panosvg .szh:hover{filter:drop-shadow(0 0 1.6px #ffcf7a) drop-shadow(0 0 1px #ffcf7a)}
  .panosvg .zub{filter:saturate(.25) brightness(.78)}.panosvg .hockerglow{animation:szglow 1.6s ease-in-out infinite}@keyframes szglow{50%{opacity:.35}}
  .panosvg .pendel{transform-box:view-box;animation:szpendel 6s ease-in-out infinite}@keyframes szpendel{25%{transform:rotate(1.2deg)}75%{transform:rotate(-1.2deg)}}
  .panosvg .flacker{animation:szflacker 4s ease-in-out infinite}@keyframes szflacker{40%{opacity:.85}45%{opacity:1}70%{opacity:.9}}
  .panosvg .schein{animation:szschein 5s ease-in-out infinite}@keyframes szschein{50%{opacity:.85}}
  .panosvg .ch .mouth .o{opacity:0}
  .panosvg .kardan{transform-box:view-box;animation:szkardan 5s ease-in-out infinite}@keyframes szkardan{25%{transform:rotate(2deg)}75%{transform:rotate(-2deg)}}
  .panosvg .dampf{animation:szdampf 3s ease-in-out infinite}.panosvg .dampf.d2{animation-delay:1.4s}@keyframes szdampf{0%{opacity:0;transform:translateY(2px)}40%{opacity:.6}100%{opacity:0;transform:translateY(-5px)}}
  .panosvg [data-hot="tel"].klingelt{animation:szkling .12s linear infinite}@keyframes szkling{50%{transform:translateX(.6px)}}
  .panosvg [data-hot="tel"].ab .hoerer{transform:translate(6px,-6px) rotate(-18deg)}
  @media (prefers-reduced-motion:reduce){.szenerie *,.panosvg *,.miniharms *{animation:none!important}}`;
  function stil() { if (document.getElementById('szenerie-css')) return; const st = document.createElement('style'); st.id = 'szenerie-css'; st.textContent = CSS; document.head.appendChild(st); }

  window.SZENERIE = {STIM, stimmungAus, szene, kajuete, miniHarms, harmsLeben, rad, SYM, uhr, stil, mix, _meer: meer};
})();
