/* Reisekarte „Brede-Bucht“ (v5.65): Zeichnung aus data/karte-brede.json, Rechnen auf der Karte.
   Platzhalter, bis die Piratenkarte des Nutzers kommt (docs/navi-folge-plan.md, docs/reise.md HR51).
   BREDE.laden() → Promise; BREDE.svg(stil, opt) ganze Karte als <svg>; BREDE.inhalt(stil, opt) nur der Inhalt (für eigene Szenen);
   stil: 'K1' Seekarte am Tag, 'K4' Nachtkarte mit blinkenden Feuern. opt: {routen: [Tage], vb: viewBox, aria}
   BREDE.punkt(id) → [x, y] eines Ortes oder Seezeichens; BREDE.kurs(a, b) rechtweisender Kurs in Grad; BREDE.sm(a, b) Distanz in Seemeilen;
   BREDE.geo([x, y]) → {breite, laenge} als Text. Einheiten: 1 sm = 20 in beide Richtungen, Norden oben (winkeltreu wie eine Seekarte). */
(function () {
  let D = null;
  const f2 = v => Math.round(v * 10) / 10;
  const STIL = {
    K1: {papier: '#fbf8ef', tief: '#ffffff', flach: '#cfe6f2', watt: '#d4dcae', land: '#f2e2b1', kueste: '#8a6a3a', text: '#22364a', tiefen: '#5d7f99', rand: '#22364a', vtg: '#b5308a', breit: 1.1, gross: 1.25},
    K4: {papier: '#081521', tief: '#0c2235', flach: '#143a52', watt: '#1f3b33', land: '#18261f', kueste: '#6fd3c1', text: '#9fc3dd', tiefen: '#5f88a6', rand: '#6fd3c1', vtg: '#e07ab8', breit: 1.2, gross: 1.3, nacht: true}};
  const GLUT = {gruen: '#4ff08a', rot: '#ff5a4a', ansteuer: '#fff3c4', nord: '#fff3c4', west: '#fff3c4', einzel: '#fff3c4'};
  function zeichen(o, s) {
    const ol = '#1d2a33', sw = .9;
    const kopf = {gruen: `<path d="M-4.5 0 L0 -13 L4.5 0 Z" fill="#2f9e55" stroke="${ol}" stroke-width="${sw}"/>`, rot: `<rect x="-4.5" y="-12" width="9" height="12" rx="1" fill="#d33a2f" stroke="${ol}" stroke-width="${sw}"/>`,
      ansteuer: `<path d="M-4 0 L-4 -10 Q0 -15 4 -10 L4 0 Z" fill="#fff" stroke="${ol}" stroke-width="${sw}"/><path d="M-1.4 -13.2 L-1.4 0 M1.6 -13 L1.6 0" stroke="#d33a2f" stroke-width="1.6"/><circle cy="-17" r="2.4" fill="#d33a2f" stroke="${ol}" stroke-width=".6"/>`,
      nord: `<path d="M-4 0 L-4 -11 L4 -11 L4 0 Z" fill="#f3c63a" stroke="${ol}" stroke-width="${sw}"/><path d="M-4 -11 L4 -11 L4 -6 L-4 -6 Z" fill="#1d2a33"/><path d="M-3.4 -15 L0 -20 L3.4 -15 Z M-3.4 -20.5 L0 -25.5 L3.4 -20.5 Z" fill="#1d2a33"/>`,
      west: `<path d="M-4 0 L-4 -11 L4 -11 L4 0 Z" fill="#f3c63a" stroke="${ol}" stroke-width="${sw}"/><path d="M-4 -7.5 L4 -7.5 L4 -4 L-4 -4 Z" fill="#1d2a33"/><path d="M-3.4 -21 L0 -16 L3.4 -21 Z M-3.4 -15 L0 -20 L3.4 -15 Z" fill="#1d2a33" transform="translate(0 -1)"/>`,
      einzel: `<path d="M-4 0 L-4 -11 L4 -11 L4 0 Z" fill="#1d2a33" stroke="${ol}" stroke-width="${sw}"/><rect x="-4" y="-7.5" width="8" height="3.6" fill="#d33a2f"/><circle cy="-14.5" r="2.1" fill="#1d2a33"/><circle cy="-19.5" r="2.1" fill="#1d2a33"/>`,
      gelb: `<path d="M-4 0 L-4 -10 L4 -10 L4 0 Z" fill="#f3c63a" stroke="${ol}" stroke-width="${sw}"/><path d="M-3 -16 L3 -12 M3 -16 L-3 -12" stroke="#d6a400" stroke-width="1.6"/>`}[o.art] || '';
    const glut = s.nacht && o.k ? `<circle cy="-8" r="6" fill="${GLUT[o.art] || '#fff3c4'}" opacity=".5" class="bk-${o.k}"/>` : '';
    return `<g class="bz" data-id="${o.id}" transform="translate(${o.x} ${o.y}) scale(${s.gross})">${glut}${kopf}<path d="M-6 0 H6" stroke="${s.text}" stroke-width=".8" opacity=".6"/><text x="7" y="-4" font-size="8" font-weight="800" fill="${s.text}" font-family="Nunito,sans-serif">${o.id}</text></g>`; }
  const OBJ = {
    kirche: s => `<circle r="4" fill="none" stroke="${s.text}" stroke-width="1.2"/><path d="M0 -4 V-12 M-3 -9 H3" stroke="${s.text}" stroke-width="1.2"/>`,
    muehle: s => `<circle r="2.4" fill="${s.text}"/><path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="${s.text}" stroke-width="1.4"/>`,
    mast: s => `<path d="M-3 6 L0 -10 L3 6 M-2 0 H2" stroke="${s.text}" stroke-width="1.1" fill="none"/><circle cy="-11" r="1.6" fill="#d33a2f"/>`,
    leuchtturm: s => `<path d="M-4 0 L-2 -16 H2 L4 0 Z" fill="#fff" stroke="${s.text}" stroke-width=".9"/><path d="M-2.6 -10 H2.6 M-3.3 -5 H3.3" stroke="#d33a2f" stroke-width="2"/><circle cy="-18" r="2.6" fill="#f3c63a"/>`};
  function inhalt(stil = 'K1', opt = {}) {
    if (!D) return '';
    const s = STIL[stil] || STIL.K1, id = 'br' + Math.random().toString(36).slice(2, 7), M = D.massstab;
    const txt = (x, y, t, sz, w = 700, extra = '') => `<text x="${x}" y="${y}" font-size="${sz}" font-weight="${w}" fill="${s.text}" font-family="Nunito,sans-serif" ${/text-anchor/.test(extra) ? '' : 'text-anchor="middle"'} ${extra}>${t}</text>`;
    let o = `<defs><clipPath id="${id}c"><rect x="0" y="0" width="360" height="480"/></clipPath><radialGradient id="${id}sek"><stop offset="0" stop-color="#fff3c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient></defs>`;
    o += `<rect x="-26" y="-22" width="412" height="524" fill="${s.papier}"/><g clip-path="url(#${id}c)"><rect width="360" height="480" fill="${s.tief}"/>`;
    /* flache Zone und 10-m-Linie */
    const L = D.land, W = D.watt, G = D.gewaesser;
    o += `<path d="M0 270 C80 250 140 200 220 170 C280 150 320 110 360 90 L360 480 L0 480 Z" fill="${s.flach}" opacity=".35"/>`;
    [L.festlandWest, L.festlandOst, L.luettoog, L.harmsoog, W.groterSand, W.seehundsand].forEach(d => { o += `<path d="${d}" fill="none" stroke="${s.flach}" stroke-width="22" stroke-linejoin="round"/>`; });
    o += `<path d="M0 270 C80 250 140 200 220 170 C280 150 320 110 360 90" stroke="${s.tiefen}" stroke-width=".9" stroke-dasharray="5 3" fill="none"/>`;
    /* Verkehrstrennungsgebiet: Trennzone in der Mitte, Einbahnwege, Pfeile (südlicher Weg ostwärts, nördlicher westwärts) */
    const V = D.vtg, dx = V.bis[0] - V.von[0], dy = V.bis[1] - V.von[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, ux = dx / l, uy = dy / l;
    const lin = k => `M${f2(V.von[0] + nx * k)} ${f2(V.von[1] + ny * k)} L${f2(V.bis[0] + nx * k)} ${f2(V.bis[1] + ny * k)}`;
    o += [-V.breite / 2, V.breite / 2].map(k => `<path d="${lin(k)}" stroke="${s.vtg}" stroke-width="1" stroke-dasharray="7 4" fill="none"/>`).join('');
    o += `<path d="${lin(-V.zone / 2)}" stroke="${s.vtg}" stroke-width="1" fill="none"/><path d="${lin(V.zone / 2)}" stroke="${s.vtg}" stroke-width="1" fill="none"/>`;
    o += [.25, .55, .85].map(t => { const cx = V.von[0] + dx * t, cy = V.von[1] + dy * t, pfeil = (k, r) => { const px = cx + nx * k, py = cy + ny * k, a = r ? -1 : 1; return `<path d="M${f2(px - ux * 12 * a)} ${f2(py - uy * 12 * a)} L${f2(px + ux * 12 * a)} ${f2(py + uy * 12 * a)} M${f2(px + ux * 12 * a - (ux * 5 - nx * 3) * a)} ${f2(py + uy * 12 * a - (uy * 5 - ny * 3) * a)} L${f2(px + ux * 12 * a)} ${f2(py + uy * 12 * a)} L${f2(px + ux * 12 * a - (ux * 5 + nx * 3) * a)} ${f2(py + uy * 12 * a - (uy * 5 + ny * 3) * a)}" stroke="${s.vtg}" stroke-width="1.3" fill="none"/>`; }; return pfeil(18, false) + pfeil(-18, true); }).join('');
    /* Watt, Priel, Land, Flüsse, Kanal */
    o += `<path class="hart" data-art="watt" d="${W.groterSand}" fill="${s.watt}" stroke="${s.kueste}" stroke-width=".9" stroke-dasharray="3 2"/><path class="hart" data-art="watt" d="${W.seehundsand}" fill="${s.watt}" stroke="${s.kueste}" stroke-width=".9" stroke-dasharray="3 2"/>`;
    o += `<path d="M184 180 C200 170 248 172 254 196 C262 226 230 236 204 232 C182 228 172 196 184 180 Z" fill="none" stroke="#3f8f4e" stroke-width="1" stroke-dasharray="2 3"/>`;
    o += `<path d="${G.priel}" stroke="${s.flach}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${G.priel}" stroke="${s.tief}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>`;
    [L.festlandWest, L.festlandOst, L.luettoog, L.harmsoog].forEach(d => { o += `<path class="hart" data-art="land" d="${d}" fill="${s.land}" stroke="${s.kueste}" stroke-width="${s.breit}" stroke-linejoin="round"/>`; });
    o += `<path d="${G.brede}" stroke="${s.tief}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="${G.kanal}" stroke="${s.tief}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${G.kanal}" stroke="${s.kueste}" stroke-width=".5" fill="none" opacity=".6"/>`;
    o += `<path d="M222 400 C240 430 270 440 296 450 L300 520 L226 520 Z" fill="${s.tief}"/>`;
    /* Pricken am Priel */
    [[322,298],[308,280],[294,264],[278,246],[262,232]].forEach(([x, y]) => [[-7, -5, true], [7, 5, false]].forEach(([ddx, ddy, bb]) => { const px = x + ddx, py = y + ddy; o += `<path d="M${px} ${py} V${py - 8}" stroke="${s.kueste}" stroke-width="1"/><path d="M${px - 2.2} ${bb ? py - 8 : py - 4.6} L${px} ${bb ? py - 5.4 : py - 7.4} L${px + 2.2} ${bb ? py - 8 : py - 4.6}" stroke="${s.kueste}" stroke-width=".9" fill="none"/>`; }));
    /* Tiefen */
    D.tiefen.forEach(([x, y, t]) => o += `<text x="${x}" y="${y}" font-size="8" font-style="italic" fill="${s.tiefen}" font-family="Nunito,sans-serif" text-anchor="middle">${t}</text>`);
    /* Schleuse, Brücke, Fähre, Wrack, Häfen, Anker, Strom */
    o += `<g transform="translate(291 430) rotate(-28)"><rect x="-7" y="-4" width="14" height="8" fill="${s.land}" stroke="${s.text}" stroke-width="1.1"/><path d="M-7 -4 V4 M7 -4 V4" stroke="${s.text}" stroke-width="2.4"/></g>`;
    o += `<path d="M328 384 L340 377" stroke="${s.text}" stroke-width="2.6"/><path d="M328 387 L340 380" stroke="${s.text}" stroke-width=".7"/>${txt(316, 372, 'Brücke', 6.5, 700)}`;
    o += `<path d="M90 380 L104 364" stroke="${s.text}" stroke-width="1" stroke-dasharray="3 2"/>${txt(116, 384, 'Fähre', 6.5, 700)}`;
    o += `<g transform="translate(300 200)"><path d="M-9 0 H9 M-6 -4 L-6 4 M0 -5 L0 5 M6 -4 L6 4" stroke="${s.text}" stroke-width="1.4"/></g>`;
    o += `<g transform="translate(196 304)" stroke="${s.text}" stroke-width="1.2" fill="none"><circle cy="-6" r="1.8"/><path d="M0 -4 V5 M-4 1 Q0 7 4 1 M-3 -1 H3"/></g>`;
    o += `<g transform="translate(14 436)" stroke="${s.text}" stroke-width="1" fill="none"><circle cy="-5" r="1.5"/><path d="M0 -3.5 V4 M-3.4 1 Q0 6 3.4 1"/></g>`;
    o += `<g transform="translate(200 120)"><path d="M0 -7 L6 0 L0 7 L-6 0 Z" fill="none" stroke="#b5308a" stroke-width="1.2"/><text y="3" font-size="7.5" font-weight="800" fill="#b5308a" text-anchor="middle" font-family="Nunito,sans-serif">A</text></g>`;
    o += `<path d="M70 398 L76 390 M86 398 L82 390" stroke="${s.kueste}" stroke-width="2.4"/><path d="M216 410 L224 408 M216 418 L224 420" stroke="${s.kueste}" stroke-width="2.4"/><path d="M344 336 L348 330 M356 336 L352 330" stroke="${s.kueste}" stroke-width="2.4"/><path d="M298 146 L304 144 M298 156 L304 158" stroke="${s.kueste}" stroke-width="2.4"/><path d="M110 74 L116 72 M110 84 L116 86" stroke="${s.kueste}" stroke-width="2.4"/>`;
    /* Leuchtturm Elvhörn mit Sektoren, Richtfeuer in die Elv */
    o += s.nacht ? `<path d="M306 346 L230 280 L210 320 Z" fill="url(#${id}sek)" opacity=".5" class="bk-fl"/>` : `<path d="M306 346 L250 296 M306 346 L238 318" stroke="${s.text}" stroke-width=".6" stroke-dasharray="2 2"/><path d="M268 312 A50 50 0 0 0 262 326" stroke="#d33a2f" stroke-width="3" fill="none" opacity=".6"/>`;
    o += `<path d="M248 300 L250 470" stroke="${s.text}" stroke-width=".7" stroke-dasharray="8 3 1 3"/>${txt(256, 316, 'Richtfeuer 180°', 6.5, 700, 'transform="rotate(90 256 316)" text-anchor="start"')}`;
    D.peilobjekte.forEach(p => { o += `<g transform="translate(${p.x} ${p.y})">${(OBJ[p.art] || OBJ.kirche)(s)}</g>`; });
    /* Beschriftung der Orte */
    D.orte.forEach(r => { if (r.lx == null || r.art === 'leuchtturm') return; const gross = ['hafen', 'insel'].includes(r.art), schraeg = r.art === 'watt' && r.id === 'grotersand';
      const rechts = r.lx > 318 ? 'text-anchor="end" ' : '';
      o += txt(r.lx, r.ly, r.name, gross ? 9.5 : r.art === 'vtg' ? 6.5 : 7.5, gross ? 800 : 700, schraeg ? 'transform="rotate(-20 ' + r.lx + ' ' + r.ly + ')"' : r.art === 'fluss' && r.id === 'brede' ? 'transform="rotate(-62 16 400)"' : r.art === 'vtg' ? `transform="rotate(-24 ${r.lx} ${r.ly})" style="fill:${s.vtg}"` : rechts); });
    o += txt(250, 22, 'Brede-Bucht', 12, 800, 'letter-spacing="2"') + txt(250, 33, 'Übungskarte · nicht zur Navigation', 6.2, 600);
    /* Kompassrose mit Missweisung */
    o += `<g transform="translate(130 264)" stroke="${s.text}" fill="none"><circle r="22" stroke-width=".8"/><circle r="16" stroke-width=".5"/>${Array.from({length: 36}, (_, i) => { const a = i * 10 * Math.PI / 180; return `<path d="M${f2(Math.sin(a) * 19)} ${f2(-Math.cos(a) * 19)} L${f2(Math.sin(a) * 22)} ${f2(-Math.cos(a) * 22)}" stroke-width=".6"/>`; }).join('')}<path d="M0 -20 L3 0 L0 20 L-3 0 Z" fill="${s.text}" stroke="none" opacity=".8"/><text y="-25" font-size="8" font-weight="800" fill="${s.text}" stroke="none" text-anchor="middle" font-family="Nunito,sans-serif">N</text><text y="32" font-size="5.6" fill="${s.text}" stroke="none" text-anchor="middle" font-family="Nunito,sans-serif">Mw ${M.mw}</text></g>`;
    /* Routen der Reise (nur, was die Geschichte schon erreicht hat) */
    (opt.routen || []).forEach(t => { const r = D.routen[t]; if (r) o += `<path d="M${r.map(p => p.join(' ')).join(' L')}" stroke="${s.nacht ? '#7fb7ff' : '#2b6cb0'}" stroke-width="1.5" stroke-dasharray="6 4" stroke-linecap="round" fill="none" opacity=".85"/>`; });
    D.seezeichen.forEach(z => o += zeichen(z, s));
    o += `</g>`;
    /* Rand: Breite links und rechts, Länge oben und unten */
    const E = M.einheitenJeSm, EL = M.einheitenJeLaengenminute, nB = Math.round(480 / E), nL = Math.floor(360 / EL);
    const rand = x0 => Array.from({length: nB}, (_, i) => `<rect x="${x0}" y="${i * E}" width="8" height="${E}" fill="${i % 2 ? s.papier : s.rand}"/>`).join('') + Array.from({length: nB * 10 + 1}, (_, i) => `<path d="M${x0 < 0 ? x0 + 8 : x0} ${f2(i * E / 10)} h${x0 < 0 ? -(i % 10 ? 3 : 6) : (i % 10 ? 3 : 6)}" stroke="${s.rand}" stroke-width=".4"/>`).join('');
    o += `<g class="brand">${rand(-12)}${rand(364)}<rect x="-12" y="0" width="8" height="480" fill="none" stroke="${s.rand}" stroke-width=".6"/><rect x="364" y="0" width="8" height="480" fill="none" stroke="${s.rand}" stroke-width=".6"/>`;
    for (let i = 0; i <= nB; i += 2) o += `<text x="-14" y="${i * E + 3}" font-size="6.2" fill="${s.text}" text-anchor="end" font-family="Nunito,sans-serif" font-weight="700">${M.breiteOben - i}'</text>`;
    o += `<text x="-14" y="-8" font-size="6.2" fill="${s.text}" text-anchor="end" font-family="Nunito,sans-serif" font-weight="800">${M.breiteGrad}°N</text>`;
    for (let i = 0; i <= nL; i++) { const x = i * EL; o += `<rect x="${f2(x)}" y="-12" width="${i < nL ? EL : 0}" height="6" fill="${i % 2 ? s.papier : s.rand}" stroke="${s.rand}" stroke-width=".4"/>${i % 5 === 0 ? `<text x="${f2(x)}" y="-14" font-size="5.8" fill="${s.text}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700">${i}'</text>` : ''}`; }
    o += `<text x="372" y="-14" font-size="6" fill="${s.text}" font-family="Nunito,sans-serif" font-weight="800">${String(M.laengeGrad).padStart(3, '0')}°E</text></g>`;
    return o; }
  const CSS = `.bk-fl{animation:bkfl 4s steps(1) infinite}@keyframes bkfl{0%,8%{opacity:1}9%,100%{opacity:.08}}.bk-fl2{animation:bkfl2 5s steps(1) infinite}@keyframes bkfl2{0%,5%{opacity:1}6%,13%{opacity:.08}14%,19%{opacity:1}20%,100%{opacity:.08}}.bk-qk{animation:bkqk 1s steps(1) infinite}@keyframes bkqk{0%,45%{opacity:1}46%,100%{opacity:.08}}.bk-iso{animation:bkiso 4s steps(1) infinite}@keyframes bkiso{0%,49%{opacity:1}50%,100%{opacity:.08}}@media (prefers-reduced-motion:reduce){[class^="bk-"]{animation:none!important}}`;
  function stil() { if (typeof document === 'undefined' || document.getElementById('brede-css')) return; const e = document.createElement('style'); e.id = 'brede-css'; e.textContent = CSS; document.head.appendChild(e); }
  const svg = (stil0 = 'K1', opt = {}) => { stil(); return `<svg class="bredekarte" viewBox="${opt.vb || '-26 -22 412 524'}" preserveAspectRatio="${opt.par || 'xMidYMid meet'}" role="img" aria-label="${opt.aria || 'Reisekarte Brede-Bucht'}">${inhalt(stil0, opt)}</svg>`; };
  const punkt = id => { if (Array.isArray(id)) return id; const o = D && (D.orte.find(r => r.id === id || r.name === id) || D.seezeichen.find(z => z.id === id) || D.peilobjekte.find(p => p.id === id)); return o ? [o.x, o.y] : null; };
  const kurs = (a, b) => { a = punkt(a); b = punkt(b); return (Math.atan2(b[0] - a[0], -(b[1] - a[1])) * 180 / Math.PI + 360) % 360; };
  const sm = (a, b) => { a = punkt(a); b = punkt(b); return Math.hypot(b[0] - a[0], b[1] - a[1]) / (D ? D.massstab.einheitenJeSm : 20); };
  const geo = p => { p = punkt(p); const M = D.massstab, br = M.breiteOben - p[1] / M.einheitenJeSm, la = M.laengeLinks + p[0] / M.einheitenJeLaengenminute, mi = v => (Math.round(v * 10) / 10).toFixed(1).replace('.', ','); return {breite: `${M.breiteGrad}° ${mi(br)}' N`, laenge: `${String(M.laengeGrad).padStart(3, '0')}° ${mi(la)}' E`, b: br, l: la}; };
  const laden = () => D ? Promise.resolve(D) : fetch('data/karte-brede.json?v=' + (typeof __ver !== 'undefined' ? __ver : '')).then(r => r.json()).then(d => (D = d));
  const B = {laden, svg, inhalt, punkt, kurs, sm, geo, stil, setzen: d => { D = d; }, get daten() { return D; }, STIL};
  if (typeof window !== 'undefined') window.BREDE = B;
  if (typeof module !== 'undefined') module.exports = B;
})();
