/* ==========================================================================
   Skipper – Navigationsschule (5.5)
   Wird erst am Kartentisch nachgeladen (loadNavi in index.html).
   Karte: data/karte.json (erfundene Kliev-Mündung). Positionen in Bogenminuten
   ab 55°00'N / 006°00'E. Projektion: Mercator, 1' Länge = SC Einheiten.
   ========================================================================== */
(() => {
const NAV = window.NAV = window.NAV || {};
let K = null, NV = null, MTOP = 0, W = 0, H = 0;
const SC = 28.45, PAD = 60;
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI, n360 = a => ((a % 360) + 360) % 360;
const r1 = v => Math.round(v * 10) / 10;
/* Mercator-Ordinate in Längenminuten; lat in Minuten ab 55°00' */
const merc = lat => Math.log(Math.tan(Math.PI / 4 + rad(55 + lat / 60) / 2)) * 180 / Math.PI * 60;
function proj(lat, lon) { return {x: PAD + (lon - K.bounds.lon0) * SC, y: PAD + (MTOP - merc(lat)) * SC}; }
function unproj(x, y) {
  const lon = K.bounds.lon0 + (x - PAD) / SC, m = MTOP - (y - PAD) / SC;
  const phi = 2 * Math.atan(Math.exp(rad(m / 60))) - Math.PI / 2;
  return {lat: deg(phi) * 60 - 3300, lon};
}
/* Entwurfskoordinaten (Rahmen 0..1138 x 0..1000) → Karte */
const fromXY = ([x, y]) => proj(30 - y / 50, 20 + x / 28.45);

/* ---------- Rechnen (Mittelbreitenverfahren, für Distanzen dieser Karte genau genug) ---------- */
const cosM = (a, b) => Math.cos(rad(55 + (a.lat + b.lat) / 120));
function kursDist(a, b) {
  const dy = b.lat - a.lat, dx = (b.lon - a.lon) * cosM(a, b);
  return {k: n360(deg(Math.atan2(dx, dy))), d: Math.hypot(dx, dy)};
}
function versegeln(p, k, d) {
  const dy = d * Math.cos(rad(k)), mid = {lat: p.lat + dy / 2};
  return {lat: p.lat + dy, lon: p.lon + d * Math.sin(rad(k)) / Math.cos(rad(55 + mid.lat / 60))};
}
/* Standort aus zwei rechtweisenden Peilungen (vom Schiff zum Objekt) */
function kreuzpeilung(o1, p1, o2, p2) {
  const ref = {lat: (o1.lat + o2.lat) / 2}, c = Math.cos(rad(55 + ref.lat / 60));
  const P = o => [(o.lon) * c, o.lat];
  const [x1, y1] = P(o1), [x2, y2] = P(o2);
  const d1 = [Math.sin(rad(p1 + 180)), Math.cos(rad(p1 + 180))], d2 = [Math.sin(rad(p2 + 180)), Math.cos(rad(p2 + 180))];
  const den = d1[0] * d2[1] - d1[1] * d2[0]; if (Math.abs(den) < 1e-6) return null;
  const t = ((x2 - x1) * d2[1] - (y2 - y1) * d2[0]) / den;
  return {lat: y1 + t * d1[1], lon: (x1 + t * d1[0]) / c};
}
function ablenkung(mgk) {
  const t = K.deviation, a = n360(mgk);
  for (let i = 0; i < t.length; i++) { const [k0, v0] = t[i], [k1, v1] = t[(i + 1) % t.length]; const kk1 = k1 || 360; if (a >= k0 && a <= kk1) return v0 + (v1 - v0) * (a - k0) / (kk1 - k0); }
  return 0;
}
const mw = () => K.mw.dir === 'E' ? K.mw.deg : -K.mw.deg;
const fmtLat = lat => { const t = 55 * 60 + lat; return `${Math.floor(t / 60)}° ${(t % 60).toFixed(1).replace('.', ',').padStart(4, '0')}' N`; };
const fmtLon = lon => { const t = 6 * 60 + lon; return `${String(Math.floor(t / 60)).padStart(3, '0')}° ${(t % 60).toFixed(1).replace('.', ',').padStart(4, '0')}' E`; };
const fmtPos = p => fmtLat(p.lat) + '  ' + fmtLon(p.lon);
const fmtDeg = k => String(Math.round(n360(k)) % 360).padStart(3, '0') + '°';
const fmtSigned = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(Math.round(v)) + '°';
const num = s => { if (s == null) return NaN; const m = String(s).replace(',', '.').replace(/[−–]/g, '-').match(/-?\d+(\.\d+)?/); return m ? +m[0] : NaN; };
const angDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
Object.assign(NAV, {proj, unproj, kursDist, versegeln, kreuzpeilung, ablenkung, mw, fmtPos, fmtLat, fmtLon, fmtDeg, fmtSigned, num, angDiff, n360, r1});

/* ---------- Karte zeichnen ---------- */
const COL = {t10: '#dbeef8', t5: '#b9dcef', tief: '#fbfdff', watt: '#c9dcb0', land: '#f1e3b8'};
const pts = a => a.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
function ellXY([cx, cy, rx, ry]) { const a = []; for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2; a.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } return a; }
function rotRect(v, y0, y1) {
  const r = rad(v.rot), c = Math.cos(r), s = Math.sin(r);
  return [[v.x0, y0], [v.x1, y0], [v.x1, y1], [v.x0, y1]].map(([x, y]) => [v.cx + x * c - y * s, v.cy + x * s + y * c]);
}
function symbol(o) {
  const p = proj(o.lat, o.lon), x = p.x, y = p.y, flare = o.kenn ? `<path d="M0 0 L-3 -16 Q0 -20 3 -16 Z" fill="#c1489a" opacity=".75" transform="rotate(35)"/>` : '';
  let g = '';
  if (o.typ === 'bb') g = `<rect x="-5" y="-12" width="10" height="13" fill="#d6332c" stroke="#222" stroke-width=".6"/><rect x="-3" y="-18" width="6" height="4" fill="#d6332c"/>`;
  else if (o.typ === 'stb') g = `<path d="M-6 1 L0 -14 L6 1 Z" fill="#3c8c5a" stroke="#222" stroke-width=".6"/><path d="M-3 -16 L0 -21 L3 -16 Z" fill="#3c8c5a"/>`;
  else if (o.typ === 'mitte') g = `<path d="M-6 1 Q-6 -12 0 -12 Q6 -12 6 1 Z" fill="#fff" stroke="#d6332c" stroke-width="1.2"/><path d="M0 -12 V1" stroke="#d6332c" stroke-width="3"/><circle cy="-16" r="3" fill="#d6332c"/>`;
  /* Kardinaltonnen: Toppzeichen zwei Kegel. Nord: beide Spitzen oben, schwarz über gelb.
     West: Spitzen zueinander, gelb-schwarz-gelb. */
  else if (o.typ === 'nord') g = `<rect x="-4" y="-13" width="8" height="7" fill="#222"/><rect x="-4" y="-6" width="8" height="7" fill="#f2c230"/><path d="M-4 -16 L0 -21 L4 -16 Z M-4 -22 L0 -27 L4 -22 Z" fill="#222"/>`;
  else if (o.typ === 'west') g = `<rect x="-4" y="-13" width="8" height="14" fill="#f2c230"/><rect x="-4" y="-8.5" width="8" height="5" fill="#222"/><path d="M-4 -16 L0 -20.5 L4 -16 Z M-4 -26 L0 -21.5 L4 -26 Z" fill="#222"/>`;
  else if (o.typ === 'einzel') g = `<rect x="-4" y="-13" width="8" height="14" fill="#222"/><rect x="-4" y="-8" width="8" height="5" fill="#d6332c"/><circle cy="-16" r="2.4" fill="#222"/><circle cy="-21.5" r="2.4" fill="#222"/>`;
  else if (o.typ === 'turm') g = `<circle r="4" fill="#fff" stroke="#222" stroke-width="1.2"/><circle r="1.4" fill="#222"/><path d="M0 0 L-4 -22 Q0 -27 4 -22 Z" fill="#c1489a" opacity=".75"/>`;
  else if (o.typ === 'kirche') g = `<circle r="4" fill="#fff" stroke="#222" stroke-width="1.2"/><path d="M0 -10 V-4 M-3 -7 H3" stroke="#222" stroke-width="1.2"/>`;
  else if (o.typ === 'mast') g = `<path d="M-4 0 L0 -14 L4 0 M-2.5 -6 H2.5" stroke="#222" stroke-width="1.2" fill="none"/><circle r="1.6" fill="#222"/>`;
  else if (o.typ === 'feuer') g = `<circle r="2" fill="#222"/><path d="M0 0 L-3 -16 Q0 -20 3 -16 Z" fill="#c1489a" opacity=".75" transform="rotate(-30)"/>`;
  const buoy = ['bb', 'stb', 'mitte', 'nord', 'west', 'einzel'].includes(o.typ);
  const lx = o.lab === 'l' ? -8 : 8, la = o.lab === 'l' ? ' text-anchor="end"' : '';
  const lab = `<text x="${lx}" y="-6" class="nlab"${la}>${o.id}</text>${o.kenn ? `<text x="${lx}" y="5" class="nlab k"${la}>${o.kenn}</text>` : ''}`;
  return `<g class="nobj" data-oid="${o.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${buoy ? '<circle r="1.6" fill="#222"/>' + flare : ''}${g}${lab}<circle r="14" fill="transparent"/></g>`;
}
function roseSVG() {
  const c = fromXY([240, 720]), R = 112;
  let s = `<g class="rose" transform="translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})"><circle r="${R}" fill="none" stroke="#7a2a7a" stroke-width="1.2"/>`;
  for (let a = 0; a < 360; a += 1) { const L = a % 10 === 0 ? 10 : a % 5 === 0 ? 6 : 3; const r0 = R - L; const ss = Math.sin(rad(a)), cc = -Math.cos(rad(a)); s += `<path d="M${(ss * r0).toFixed(1)} ${(cc * r0).toFixed(1)} L${(ss * R).toFixed(1)} ${(cc * R).toFixed(1)}" stroke="#7a2a7a" stroke-width="${a % 10 ? .5 : .9}"/>`; if (a % 30 === 0) s += `<text x="${(ss * (R + 12)).toFixed(1)}" y="${(cc * (R + 12) + 3).toFixed(1)}" class="rlab">${String(a).padStart(3, '0')}</text>`; }
  s += `<path d="M0 ${-R} L-5 ${-R + 14} L5 ${-R + 14} Z" fill="#7a2a7a"/>`;
  s += `<g transform="rotate(${mw()})"><circle r="70" fill="none" stroke="#7a2a7a" stroke-width=".7" stroke-dasharray="3 3"/>`;
  for (let a = 0; a < 360; a += 10) { const ss = Math.sin(rad(a)), cc = -Math.cos(rad(a)); s += `<path d="M${(ss * 64).toFixed(1)} ${(cc * 64).toFixed(1)} L${(ss * 70).toFixed(1)} ${(cc * 70).toFixed(1)}" stroke="#7a2a7a" stroke-width=".6"/>`; }
  s += `<path d="M0 -70 L-4 -58 L0 -61 L4 -58 Z" fill="#7a2a7a"/></g><path d="M0 ${-R} V${R} M${-R} 0 H${R}" stroke="#7a2a7a" stroke-width=".4"/>`;
  s += `<text y="30" class="rlab">Mw ${K.mw.deg}°${K.mw.dir} (${K.mw.jahr})</text></g>`;
  return s;
}
function scalesSVG() {
  const b = K.bounds, x0 = PAD, x1 = proj(0, b.lon1).x, yT = proj(b.lat1, 0).y, yB = proj(b.lat0, 0).y;
  let s = `<g class="scale">`;
  /* Breitenrand: Teilung 0,1' – hier misst man Distanzen (1' = 1 sm) */
  for (let t = b.lat0 * 10; t <= b.lat1 * 10; t++) {
    const lat = t / 10, y = proj(lat, 0).y, L = t % 10 === 0 ? 14 : t % 5 === 0 ? 9 : 5;
    s += `<path d="M${x0 - 2} ${y.toFixed(2)} h${-L} M${x1 + 2} ${y.toFixed(2)} h${L}" />`;
    if (t % 10 === 0) { const lab = `${55}°${String(lat).padStart(2, '0')}'`; s += `<text x="${x0 - 18}" y="${(y + 3).toFixed(1)}" class="slab" text-anchor="end">${lab}</text><text x="${x1 + 18}" y="${(y + 3).toFixed(1)}" class="slab">${lab}</text>`; }
  }
  for (let t = b.lon0 * 10; t <= b.lon1 * 10; t++) {
    const lon = t / 10, x = proj(0, lon).x, L = t % 10 === 0 ? 14 : t % 5 === 0 ? 9 : 5;
    s += `<path d="M${x.toFixed(2)} ${yT - 2} v${-L} M${x.toFixed(2)} ${yB + 2} v${L}" />`;
    if (t % 50 === 0) { const tt = 360 + lon, lab = `${String(Math.floor(tt / 60)).padStart(3, '0')}°${String(tt % 60).padStart(2, '0')}'`; s += `<text x="${x.toFixed(1)}" y="${yT - 20}" class="slab" text-anchor="middle">${lab}</text><text x="${x.toFixed(1)}" y="${yB + 30}" class="slab" text-anchor="middle">${lab}</text>`; }
  }
  /* Gradnetz alle 5' */
  for (let lat = b.lat0 + 5; lat < b.lat1; lat += 5) { const y = proj(lat, 0).y; s += `<path class="grid" d="M${x0} ${y.toFixed(1)} H${x1}"/>`; }
  for (let lon = b.lon0 + 5; lon < b.lon1; lon += 5) { const x = proj(0, lon).x; s += `<path class="grid" d="M${x.toFixed(1)} ${yT} V${yB}"/>`; }
  return s + `<rect x="${x0}" y="${yT}" width="${x1 - x0}" height="${yB - yT}" fill="none" stroke="#222" stroke-width="1.6"/></g>`;
}
function chartSVG() {
  const b = K.bounds; MTOP = merc(b.lat1); W = PAD * 2 + (b.lon1 - b.lon0) * SC; H = PAD * 2 + (MTOP - merc(b.lat0)) * SC;
  const yT = PAD, yB = H - PAD, x1 = W - PAD;
  let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/><clipPath id="nclip"><rect x="${PAD}" y="${yT}" width="${x1 - PAD}" height="${yB - yT}"/></clipPath><g clip-path="url(#nclip)"><rect x="${PAD}" y="${yT}" width="${x1 - PAD}" height="${yB - yT}" fill="#fbfdff"/>`;
  K.flaechen.forEach(f => { const P = (f.ell ? ellXY(f.ell) : f.xy).map(fromXY); s += `<polygon points="${pts(P)}" fill="${COL[f.art]}" ${f.art === 'land' ? 'stroke="#8a7a52" stroke-width="1.4"' : ''}/>`; });
  const v = K.vtg, lane = (a, b2, fill) => `<polygon points="${pts(rotRect(v, a, b2).map(fromXY))}" fill="${fill}" stroke="#d14fa0" stroke-width="1.3" stroke-dasharray="8 4"/>`;
  s += lane(v.lane1[0], v.lane1[1], 'none') + lane(v.lane2[0], v.lane2[1], 'none') + `<polygon points="${pts(rotRect(v, v.sep[0], v.sep[1]).map(fromXY))}" fill="#f3c6e2"/>`;
  const vc = fromXY([v.cx + 60, v.cy]); s += `<text class="vtg" transform="translate(${vc.x.toFixed(0)} ${vc.y.toFixed(0)}) rotate(${v.rot})" text-anchor="middle" y="4">${v.name}</text>`;
  K.tiefen.forEach(([x, y, t]) => { const p = fromXY([x, y]); s += `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" class="tief">${t}</text>`; });
  K.namen.forEach(n => { const p = fromXY(n.xy); s += `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" class="nname${n.w ? ' w' : ''}${n.watt ? ' g' : ''}" style="font-size:calc(${n.s}px * var(--lz,1))" text-anchor="middle"${n.rot ? ` transform="rotate(${n.rot} ${p.x.toFixed(1)} ${p.y.toFixed(1)})"` : ''}>${n.t}</text>`; });
  const wr = proj(K.wrack.lat, K.wrack.lon); s += `<g transform="translate(${wr.x.toFixed(1)} ${wr.y.toFixed(1)})"><path d="M-9 0 H9 M-5 -4 V4 M0 -4 V4 M5 -4 V4" stroke="#222" stroke-width="1.4"/></g>`;
  const sa = proj(K.strom.lat, K.strom.lon); s += `<g transform="translate(${sa.x.toFixed(1)} ${sa.y.toFixed(1)})"><path d="M0 -7 L7 0 L0 7 L-7 0 Z" fill="none" stroke="#7a2a7a" stroke-width="1.2"/><text x="0" y="3" class="rlab">${K.strom.punkt}</text></g>`;
  K.objekte.forEach(o => { s += symbol(o); });
  s += roseSVG() + `</g>` + scalesSVG();
  return `<g id="nchart">${s}</g>`;
}
NAV.chartSize = () => ({W, H});

/* ---------- Kartenansicht mit Werkzeugen ---------- */
/* tool: 'hand' | 'dreieck' | 'zirkel' | 'stift' | 'punkt'. opt.hilfen: Knopf „An den Breitenrand“ (in Übungen, nicht in der Prüfung).
   Rückgängig und Wiederholen gelten für alles, was man zeichnet oder verstellt, auch Zirkel und Dreieck. */
/* Gradbogen des Kursdreiecks (in seinem eigenen Koordinatensystem, einmal gebaut) */
const DTICKS = (() => { const R = 70; let t = ''; for (let a = 180; a <= 360; a += 1) { const s1 = Math.sin(rad(a)), c1 = -Math.cos(rad(a)), Lt = a % 10 === 0 ? 9 : a % 5 === 0 ? 6 : 3; t += `<path d="M${(s1 * (R - Lt)).toFixed(1)} ${(c1 * (R - Lt)).toFixed(1)} L${(s1 * R).toFixed(1)} ${(c1 * R).toFixed(1)}"/>`; if (a % 10 === 0 && a < 360 && a > 180) { const o = (360 - a) % 360, i2 = (540 - a) % 360; t += `<text x="${(s1 * (R + 9)).toFixed(1)}" y="${(c1 * (R + 9) + 3).toFixed(1)}" class="dlab">${o}</text><text x="${(s1 * (R - 16)).toFixed(1)}" y="${(c1 * (R - 16) + 3).toFixed(1)}" class="dlab i">${i2}</text>`; } } return t; })();
/* Schnittpunkt zweier Strecken (für das Einrasten) */
function schnitt(l1, l2) {
  const r = {x: l1.b.x - l1.a.x, y: l1.b.y - l1.a.y}, s = {x: l2.b.x - l2.a.x, y: l2.b.y - l2.a.y}, d = r.x * s.y - r.y * s.x; if (Math.abs(d) < 1e-9) return null;
  const qx = l2.a.x - l1.a.x, qy = l2.a.y - l1.a.y, t = (qx * s.y - qy * s.x) / d, u = (qx * r.y - qy * r.x) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? {x: l1.a.x + t * r.x, y: l1.a.y + t * r.y} : null;
}
NAV.mountChart = function (host, opt = {}) {
  const TOOLS = [['hand', '✋', 'Verschieben'], ['dreieck', '◺', 'Kursdreieck'], ['zirkel', '⋀', 'Zirkel'], ['stift', '✎', 'Bleistift'], ['punkt', '✕', 'Kreuz setzen']].filter(t => !opt.tools || opt.tools.includes(t[0]));
  const zeichnen = TOOLS.some(t => t[0] !== 'hand');
  host.innerHTML = `<div class="nwrap"><svg class="nsvg" xmlns="http://www.w3.org/2000/svg">${chartSVG()}<g id="nlines"></g><g id="nmarks"></g><g id="nhi"></g><g id="ntools"></g></svg>
    <div class="nlens hidden"><svg><use href="#nchart"/><use href="#nlines"/><use href="#nmarks"/><use href="#ntools"/></svg><i></i></div>
    ${zeichnen ? `<div class="ntoolbar">${TOOLS.map(([id, ic, n]) => `<button data-tool="${id}" aria-label="${n}" title="${n}">${ic}</button>`).join('')}<span class="nsp"></span><button data-act="undo" aria-label="Rückgängig" title="Rückgängig">↶</button><button data-act="redo" aria-label="Wiederholen" title="Wiederholen">↷</button></div>` : ''}
    <div class="ntop"><div class="ntip hidden"></div><div class="nctx"></div></div><div class="nablese hidden"></div>
    <div class="nzoom"><button data-z="1" aria-label="Vergrößern">+</button><button data-z="-1" aria-label="Verkleinern">−</button></div></div>`;
  const svg = host.querySelector('.nsvg'), lens = host.querySelector('.nlens'), lsvg = lens.querySelector('svg'), tip = host.querySelector('.ntip'), ctxEl = host.querySelector('.nctx'), ablEl = host.querySelector('.nablese');
  const G = id => svg.querySelector('#' + id);
  const st = {tool: 'hand', lines: [], marks: [], undo: [], redo: [], dreieck: null, zirkel: null, vb: null};
  const vbSet = v => { const r = svg.getBoundingClientRect(), asp = (r.height || 400) / (r.width || 400); v.h = v.w * asp; v.x = Math.max(-200, Math.min(W - v.w + 200, v.x)); v.y = Math.max(-200, Math.min(H - v.h + 200, v.y)); st.vb = v; /* 5.11: Beschriftung wächst beim Herauszoomen mit, damit sie lesbar bleibt (Lupe zeigt die Originalgröße) */ const lz = Math.min(3.6, Math.max(1, v.w / (r.width || 400))); svg.style.setProperty('--lz', lz.toFixed(2)); svg.classList.toggle('weit', lz > 2.3); svg.setAttribute('viewBox', `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}`); if (st.zirkel) inkTools(); };
  const toChart = (cx, cy) => { const r = svg.getBoundingClientRect(), v = st.vb; return {x: v.x + (cx - r.left) / r.width * v.w, y: v.y + (cy - r.top) / r.height * v.h}; };
  const toScreen = p => { const r = svg.getBoundingClientRect(), v = st.vb; return {x: (p.x - v.x) / v.w * r.width, y: (p.y - v.y) / v.h * r.height}; };
  const scale = () => { const r = svg.getBoundingClientRect(); return st.vb.w / (r.width || 400); };
  const focus = (lat, lon, w = 520) => { const p = proj(lat, lon); vbSet({x: p.x - w / 2, y: p.y - w * .55, w}); };
  /* genau mittig auf einen Ort (Törn-Karte, V13) */
  const center = (lat, lon, w = st.vb.w) => { const p = proj(lat, lon), r = svg.getBoundingClientRect(), h = w * ((r.height || 400) / (r.width || 400)); vbSet({x: p.x - w / 2, y: p.y - h / 2, w}); };
  const start = () => { const c = opt.center || {lat: 20.5, lon: 36}; focus(c.lat, c.lon, opt.width || 560); };
  start(); requestAnimationFrame(start);
  /* Wird die Karte kleiner oder größer (Zahlentasten, Drehen), bleibt die Mitte stehen */
  if (window.ResizeObserver) new ResizeObserver(() => { const v = st.vb, r = svg.getBoundingClientRect(); if (!v || !r.width || !r.height) return; const h = v.w * r.height / r.width; vbSet({x: v.x, y: v.y + v.h / 2 - h / 2, w: v.w}); }).observe(svg);
  /* Breitenrand links und rechts: dort misst der Zirkel (1' = 1 sm) */
  const randXs = () => [PAD - 5, proj(0, K.bounds.lon1).x + 5];
  const minY = lat => proj(lat, 0).y;
  const latOf = p => unproj(p.x, p.y).lat;
  /* Zirkel: Gelenk seitlich, runde Griffe neben den Spitzen (der Finger verdeckt die Spitze nicht) */
  const zGeo = z => {
    const s = scale(), dx = z.b.x - z.a.x, dy = z.b.y - z.a.y, d = Math.hypot(dx, dy), m = {x: (z.a.x + z.b.x) / 2, y: (z.a.y + z.b.y) / 2};
    let n = d < 1 ? {x: 0, y: -1} : {x: dy / d, y: -dx / d}; if (n.y > 0) n = {x: -n.x, y: -n.y};
    if (Math.abs(n.y) < .35) { const rechts = m.x < W / 2; if ((n.x > 0) !== rechts) n = {x: -n.x, y: -n.y}; }
    const h = {x: m.x + n.x * (d * .3 + 34 * s), y: m.y + n.y * (d * .3 + 34 * s)};
    const grip = p => { const ex = p.x - h.x, ey = p.y - h.y, e = Math.hypot(ex, ey) || 1; return {x: p.x + ex / e * 36 * s, y: p.y + ey / e * 36 * s}; };
    return {s, h, ga: grip(z.a), gb: grip(z.b)};
  };
  const f1 = v => v.toFixed(1);
  const zirkelSVG = z => { const {s, h, ga, gb} = zGeo(z), c = (p, r, cl, hh) => `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${f1(r * s)}" class="${cl}"${hh ? ` data-h="${hh}"` : ''}/>`;
    return `<g class="zirkel"><path d="M${f1(z.a.x)} ${f1(z.a.y)} L${f1(h.x)} ${f1(h.y)} L${f1(z.b.x)} ${f1(z.b.y)}" class="zleg"/>${z.done ? `<path d="M${f1(z.a.x)} ${f1(z.a.y)} L${f1(ga.x)} ${f1(ga.y)} M${f1(z.b.x)} ${f1(z.b.y)} L${f1(gb.x)} ${f1(gb.y)}" class="zgl"/>` : ''}
      ${c(h, 11, 'zhinge', 'move')}${z.done ? c(ga, 15, 'zgrip', 'a') + c(gb, 15, 'zgrip', 'b') + c(ga, 5, 'zgdot') + c(gb, 5, 'zgdot') : ''}${c(z.a, 9, 'zhit', 'a')}${c(z.b, 9, 'zhit', 'b')}${c(z.a, 2.6, 'ztip')}${c(z.b, 2.6, 'ztip')}</g>`; };
  const dreieckSVG = d => { const L = 120, R = 70;
    return `<g class="dreieck" transform="translate(${f1(d.x)} ${f1(d.y)}) rotate(${d.a.toFixed(2)})"><path d="M0 ${-L} L0 ${L} L${-L} 0 Z" class="dbody"/><g class="dticks">${DTICKS}</g>
      <path d="M0 ${-L} L0 ${L}" class="dedge"/><path d="M0 ${-L + 4} l-5 12 h10 Z" class="darrow"/><circle cx="0" cy="${-L}" r="11" class="dhandle" data-h="rot"/><circle cx="0" cy="0" r="3" class="dctr"/></g>
      <g transform="translate(${f1(d.x)} ${f1(d.y)})"><path d="M0 ${-R - 16} V${R + 16}" class="dmer"/></g>`; };
  /* Zeichnen der Benutzer-Ebenen: Linien und Kreuze, dann Werkzeuge */
  const inkLines = () => {
    G('nlines').innerHTML = st.lines.map(l => `<path d="M${l.a.x.toFixed(1)} ${l.a.y.toFixed(1)} L${l.b.x.toFixed(1)} ${l.b.y.toFixed(1)}" class="pencil${l.c ? ' ' + l.c : ''}"/>`).join('');
    G('nmarks').innerHTML = st.marks.map(m => `<g class="xmark${m.c ? ' ' + m.c : ''}" transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)})"><path d="M-6 -6 L6 6 M6 -6 L-6 6"/>${m.t ? `<text x="8" y="-6">${m.t}</text>` : ''}</g>`).join('');
  };
  const inkTools = () => { G('ntools').innerHTML = (st.dreieck ? dreieckSVG(st.dreieck) : '') + (st.zirkel ? zirkelSVG(st.zirkel) : ''); ablese(); kontext(); };
  const ink = () => { inkLines(); inkTools(); knoepfe(); };
  /* Rückgängig und Wiederholen: Linien, Kreuze, Zirkel und Dreieck */
  const stand = () => JSON.stringify({lines: st.lines, marks: st.marks, zirkel: st.zirkel, dreieck: st.dreieck});
  const push = () => { st.undo.push(stand()); if (st.undo.length > 60) st.undo.shift(); st.redo = []; knoepfe(); };
  const zurueck = j => { const o = JSON.parse(j); st.lines = o.lines; st.marks = o.marks; st.zirkel = o.zirkel; st.dreieck = o.dreieck; ink(); emit('zirkel'); emit('dreieck'); emit('line'); };
  const knoepfe = () => { const u = host.querySelector('[data-act="undo"]'), r = host.querySelector('[data-act="redo"]'); if (u) u.disabled = !st.undo.length; if (r) r.disabled = !st.redo.length; };
  /* Ablese-Fenster: liegen beide Zirkelspitzen am Breitenrand, zeigt es die Teilung um jede Spitze vergrößert (Minuten und Zehntel) */
  const randVon = z => z && z.done ? randXs().find(x => Math.abs(z.a.x - x) < .5 && Math.abs(z.b.x - x) < .5) : undefined;
  const lineal = (lat, cap) => {
    const Wd = 170, sp = 2.2, x = m => (m - lat + sp / 2) / sp * Wd; let s = '';
    for (let t = Math.ceil((lat - sp / 2) * 10); t <= Math.floor((lat + sp / 2) * 10); t++) { const X = x(t / 10).toFixed(1), L = t % 10 === 0 ? 15 : t % 5 === 0 ? 10 : 6; s += `<path d="M${X} 28 v${-L}"/>`; if (t % 10 === 0) s += `<text x="${X}" y="42">${t / 10}'</text>`; }
    return `<figure><svg viewBox="0 0 ${Wd} 46">${s}<path class="nnadel" d="M${Wd / 2} 3 V29"/><circle class="nnadel" cx="${Wd / 2}" cy="29" r="2.4"/></svg><figcaption>${cap}</figcaption></figure>`;
  };
  const ablese = () => {
    const z = st.zirkel; if (randVon(z) == null) { ablEl.classList.add('hidden'); return; }
    const la = latOf(z.a), lb = latOf(z.b), html = `<b>Breitenrand vergrößert</b><div>${lineal(Math.min(la, lb), 'untere Spitze')}${lineal(Math.max(la, lb), 'obere Spitze')}</div><small>Minuten der Breite, Norden rechts. Unterschied = Distanz in sm.</small>`;
    if (ablEl.innerHTML !== html) ablEl.innerHTML = html; ablEl.classList.remove('hidden');
  };
  /* Knöpfe am Rand der Karte, je nach Werkzeug */
  const kontext = () => {
    const z = st.zirkel, b = [];
    if (st.tool === 'dreieck' && st.dreieck && TOOLS.some(t => t[0] === 'dreieck')) b.push('<button data-ctx="linie">⟋ Linie am Dreieck</button>');
    if (opt.hilfen && z && z.done && randVon(z) == null) b.push('<button data-ctx="rand">⇤ An den Breitenrand</button>');
    const html = b.join(''); if (ctxEl.innerHTML !== html) ctxEl.innerHTML = html;
  };
  ctxEl.addEventListener('click', e => { const b = e.target.closest('[data-ctx]'); if (!b) return; tip.classList.add('hidden'); if (b.dataset.ctx === 'linie') ctl.lineFromDreieck(); else ctl.zirkelAnRand(); });
  /* Lupe: zeigt die Stelle (Kartenpunkt p) dreifach vergrößert, über oder unter dem Finger */
  const showLensAt = p => {
    const q = toScreen(p), s = scale() / 3.2, w = 110 * s;
    lsvg.setAttribute('viewBox', `${(p.x - w / 2).toFixed(1)} ${(p.y - w / 2).toFixed(1)} ${w.toFixed(1)} ${w.toFixed(1)}`);
    lens.style.left = (q.x - 55) + 'px'; lens.style.top = (q.y > 170 ? q.y - 150 : q.y + 46) + 'px'; lens.classList.remove('hidden');
  };
  const hideLens = () => lens.classList.add('hidden');
  /* Einrasten: Tonnen, Kreuze, Linienenden und Schnittpunkte im Umkreis von 10 Pixeln */
  function snap(p) {
    const lim = 10 * scale(); let best = null, bd = lim;
    const pruef = q => { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = q; } };
    K.objekte.forEach(o => pruef(proj(o.lat, o.lon)));
    st.marks.forEach(pruef);
    st.lines.forEach(l => { pruef(l.a); pruef(l.b); });
    for (let i = 0; i < st.lines.length; i++) for (let j = i + 1; j < st.lines.length; j++) { const q = schnitt(st.lines[i], st.lines[j]); if (q) pruef(q); }
    return best ? {x: best.x, y: best.y} : p;
  }
  /* Zirkelspitze: wie oben, am Breitenrand rastet sie auf der Teilung ein (volle Minuten, wenn nah dran) */
  const snapTip = p => {
    const q = snap(p); if (q !== p) return q; const s = scale();
    const sx = randXs().find(x => Math.abs(p.x - x) < 12 * s); if (sx == null) return p;
    const y = minY(Math.round(latOf({x: sx, y: p.y}))); return {x: sx, y: Math.abs(y - p.y) < 6 * s ? y : p.y};
  };
  /* Zirkel am Gelenk verschieben: kommt er an den Breitenrand, stellt er sich dort senkrecht (Spreizung bleibt) */
  const zAmRand = (a, b, voll) => {
    const s = scale(), m = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}, sx = voll != null ? voll : randXs().find(x => Math.abs(m.x - x) < 60 * s);
    if (sx == null) return {a, b};
    const len = Math.hypot(b.x - a.x, b.y - a.y), yT = minY(K.bounds.lat1), yB = minY(K.bounds.lat0);
    let unten = m.y + len / 2; const yv = minY(Math.round(latOf({x: sx, y: unten}))); if (voll != null || Math.abs(yv - unten) < 8 * s) unten = yv;
    unten = Math.min(yB, Math.max(yT + len, unten));
    return {a: {x: sx, y: unten - len}, b: {x: sx, y: unten}};
  };
  /* Zeiger: ein Finger je nach Werkzeug, zwei Finger zoomen und verschieben */
  const ptrs = new Map(); let drag = null, pinch = null;
  const einmal = d => { if (!d.pushed) { push(); d.pushed = true; } };
  svg.addEventListener('pointerdown', e => {
    try { svg.setPointerCapture(e.pointerId); } catch (x) {} ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY}); tip.classList.add('hidden');  /* wer loslegt, braucht den Hinweis nicht mehr */
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = {d: Math.hypot(a.x - b.x, a.y - b.y), vb: {...st.vb}, m: toChart((a.x + b.x) / 2, (a.y + b.y) / 2)}; drag = null; hideLens(); return; }
    const p = toChart(e.clientX, e.clientY), h = e.target.dataset && e.target.dataset.h, z = st.zirkel;
    if (st.tool === 'dreieck' && st.dreieck) {
      if (h === 'rot') drag = {k: 'drot'};
      else if (e.target.closest('.dreieck')) drag = {k: 'dmove', ox: p.x - st.dreieck.x, oy: p.y - st.dreieck.y};
      else drag = {k: 'pan', x: e.clientX, y: e.clientY, vb: {...st.vb}};
    } else if (st.tool === 'zirkel') {
      if (z && z.done && (h === 'a' || h === 'b')) { drag = {k: 'z' + h, ox: z[h].x - p.x, oy: z[h].y - p.y}; showLensAt(z[h]); }
      else if (z && h === 'move') drag = {k: 'zm', p, a: {...z.a}, b: {...z.b}};
      else { drag = {k: 'zset'}; showLensAt(snapTip(p)); }
    } else if (st.tool === 'stift') { drag = {k: 'line', a: snap(p)}; showLensAt(drag.a); }
    else if (st.tool === 'punkt') { drag = {k: 'mark'}; showLensAt(snap(p)); }
    else drag = {k: 'pan', x: e.clientX, y: e.clientY, vb: {...st.vb}, t: Date.now(), tgt: e.target};
  });
  svg.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y), f = pinch.d / Math.max(20, d), w = Math.max(90, Math.min(W * 1.2, pinch.vb.w * f)), r = svg.getBoundingClientRect(), rx = ((a.x + b.x) / 2 - r.left) / r.width, ry = ((a.y + b.y) / 2 - r.top) / r.height; vbSet({x: pinch.m.x - rx * w, y: pinch.m.y - ry * w * r.height / r.width, w}); return; }
    if (!drag) return; const p = toChart(e.clientX, e.clientY);
    if (drag.k === 'pan') { const sc = drag.vb.w / svg.getBoundingClientRect().width; vbSet({...drag.vb, x: drag.vb.x - (e.clientX - drag.x) * sc, y: drag.vb.y - (e.clientY - drag.y) * sc}); if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) drag.moved = true; }
    else if (drag.k === 'dmove') { einmal(drag); st.dreieck.x = p.x - drag.ox; st.dreieck.y = p.y - drag.oy; inkTools(); }
    else if (drag.k === 'drot') { einmal(drag); st.dreieck.a = n360(deg(Math.atan2(p.x - st.dreieck.x, -(p.y - st.dreieck.y)))); inkTools(); emit('dreieck'); }
    else if (drag.k === 'za' || drag.k === 'zb') { einmal(drag); const t = snapTip({x: p.x + drag.ox, y: p.y + drag.oy}); st.zirkel[drag.k[1]] = t; inkTools(); showLensAt(t); }
    else if (drag.k === 'zm') { einmal(drag); const dx = p.x - drag.p.x, dy = p.y - drag.p.y, q = zAmRand({x: drag.a.x + dx, y: drag.a.y + dy}, {x: drag.b.x + dx, y: drag.b.y + dy}); st.zirkel.a = q.a; st.zirkel.b = q.b; inkTools(); }
    else if (drag.k === 'zset') showLensAt(snapTip(p));
    else if (drag.k === 'line') { drag.b = snap(p); inkTools(); G('ntools').insertAdjacentHTML('beforeend', `<path d="M${drag.a.x} ${drag.a.y} L${drag.b.x} ${drag.b.y}" class="pencil live"/>`); showLensAt(drag.b); }
    else if (drag.k === 'mark') showLensAt(snap(p));
  });
  const up = e => {
    ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; hideLens();
    if (!drag) return; const p = toChart(e.clientX, e.clientY), d = drag; drag = null;
    if (d.k === 'zset') { push(); const q = snapTip(p); if (!st.zirkel || st.zirkel.done) st.zirkel = {a: q, b: q, done: false, n: 1}; else { st.zirkel.b = q; st.zirkel.done = true; } inkTools(); emit('zirkel'); }
    else if (d.k === 'line') { if (d.b && Math.hypot(d.b.x - d.a.x, d.b.y - d.a.y) > 8) { push(); st.lines.push({a: d.a, b: d.b}); emit('line'); } ink(); }
    else if (d.k === 'mark') { push(); st.marks.push(snap(p)); ink(); emit('mark'); }
    else if (d.k === 'za' || d.k === 'zb' || d.k === 'zm') { inkTools(); emit('zirkel'); }
    else if (d.k === 'dmove') emit('dreieck');
    else if (d.k === 'pan' && !d.moved && opt.onTap) { const o = d.tgt && d.tgt.closest && d.tgt.closest('[data-oid]'); opt.onTap({p, ll: unproj(p.x, p.y), obj: o ? K.objekte.find(x => x.id === o.dataset.oid) : null}); }
    knoepfe();
  };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  svg.addEventListener('wheel', e => { e.preventDefault(); const m = toChart(e.clientX, e.clientY), f = e.deltaY > 0 ? 1.15 : 1 / 1.15, v = st.vb, w = Math.max(90, Math.min(W * 1.2, v.w * f)); vbSet({x: m.x - (m.x - v.x) * w / v.w, y: m.y - (m.y - v.y) * w / v.w, w}); }, {passive: false});
  const listeners = {}; const emit = k => (listeners[k] || []).forEach(f => f());
  host.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => ctl.setTool(b.dataset.tool));
  const ub = host.querySelector('[data-act="undo"]'), rb = host.querySelector('[data-act="redo"]');
  if (ub) ub.onclick = () => { if (!st.undo.length) return; st.redo.push(stand()); zurueck(st.undo.pop()); };
  if (rb) rb.onclick = () => { if (!st.redo.length) return; st.undo.push(stand()); zurueck(st.redo.pop()); };
  host.querySelectorAll('[data-z]').forEach(b => b.onclick = () => { const v = st.vb, f = +b.dataset.z > 0 ? 1 / 1.4 : 1.4, w = Math.max(90, Math.min(W * 1.2, v.w * f)); const m = {x: v.x + v.w / 2, y: v.y + v.h / 2}; vbSet({x: m.x - w / 2, y: m.y - w * v.h / v.w / 2, w}); });
  let tipT = 0; tip.onclick = () => tip.classList.add('hidden');
  const ctl = {
    svg, st, K, toChart, focus, center, ink,
    on(k, f) { (listeners[k] = listeners[k] || []).push(f); },
    setTool(t) {
      st.tool = t; host.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tool === t));
      if (t === 'dreieck' && !st.dreieck) { const v = st.vb; st.dreieck = {x: v.x + v.w / 2, y: v.y + v.h / 2, a: 45}; }
      ink(); ctl.tipText({hand: 'Mit einem Finger verschieben, mit zwei Fingern zoomen. Tonne antippen: Infos.', dreieck: 'Dreieck ziehen zum Verschieben, am gelben Griff drehen. Abgelesen wird, wo die rote Meridianlinie den Gradbogen schneidet.', zirkel: 'Zwei Punkte antippen, die Spitzen rasten an Tonnen und Kreuzen ein. Mit den runden Griffen verstellst du die Spitzen. Am Gelenk zum Breitenrand ziehen: Dort stellt sich der Zirkel senkrecht. 1\' = 1 sm.', stift: 'Linie ziehen. Anfang und Ende rasten an Tonnen, Kreuzen und Schnittpunkten ein.', punkt: 'Antippen setzt ein Kreuz, zum Beispiel einen Standort. Es rastet an Schnittpunkten ein.'}[t] || '');
      clearTimeout(tipT); tipT = setTimeout(() => tip.classList.add('hidden'), 8000);
    },
    tipText(t) { tip.textContent = t; tip.classList.toggle('hidden', !t); },
    /* Linie entlang der Dreieckskante durch die Karte ziehen */
    lineFromDreieck(c) { const d = st.dreieck; if (!d) return; const s1 = Math.sin(rad(d.a)), c1 = -Math.cos(rad(d.a)); push(); st.lines.push({a: {x: d.x - s1 * 1400, y: d.y - c1 * 1400}, b: {x: d.x + s1 * 1400, y: d.y + c1 * 1400}, c}); ink(); emit('line'); },
    addLine(a, b, c) { st.lines.push({a, b, c}); ink(); },
    addMark(p, t, c) { st.marks.push({x: p.x, y: p.y, t, c}); ink(); },
    clear() { if (st.lines.length || st.marks.length || st.zirkel) push(); st.lines = []; st.marks = []; st.zirkel = null; ink(); },
    highlight(ids) { G('nhi').innerHTML = (ids || []).map(id => { const o = K.objekte.find(x => x.id === id); if (!o) return ''; const p = proj(o.lat, o.lon); return `<circle cx="${p.x}" cy="${p.y}" r="22" class="nhi"/>`; }).join(''); },
    /* Zirkel mit seiner Spreizung an den nächsten Breitenrand legen, auf gleicher Breite, untere Spitze auf einer vollen Minute */
    zirkelAnRand() {
      const z = st.zirkel; if (!z || !z.done) return;
      const xs = randXs(), m = (z.a.x + z.b.x) / 2, sx = Math.abs(m - xs[0]) <= Math.abs(m - xs[1]) ? xs[0] : xs[1], q = zAmRand(z.a, z.b, sx), von = {a: {...z.a}, b: {...z.b}};
      /* Ansicht: Zirkel ganz im oberen Teil der Karte, darunter liegt das Ablese-Fenster */
      push(); const t0 = performance.now(), v0 = {...st.vb}, r0 = svg.getBoundingClientRect(), len = Math.hypot(q.b.x - q.a.x, q.b.y - q.a.y), w1 = Math.max(v0.w, len / (.42 * (r0.height || 300)) * (r0.width || 400)), cy = (q.a.y + q.b.y) / 2;
      const v1 = {x: sx === xs[0] ? sx - w1 * .22 : sx - w1 * .78, w: w1}, li = (a, b, k) => a + (b - a) * k;
      const schritt = now => { const k = Math.min(1, (now - t0) / 380), e = k * k * (3 - 2 * k);
        z.a = {x: li(von.a.x, q.a.x, e), y: li(von.a.y, q.a.y, e)}; z.b = {x: li(von.b.x, q.b.x, e), y: li(von.b.y, q.b.y, e)};
        const w = li(v0.w, v1.w, e), r = svg.getBoundingClientRect(), h = w * r.height / r.width; vbSet({x: li(v0.x, v1.x, e), y: li(v0.y, cy - h * .36, e), w}); inkTools();
        if (k < 1) requestAnimationFrame(schritt); else { z.a = q.a; z.b = q.b; inkTools(); emit('zirkel'); } };
      requestAnimationFrame(schritt);
    },
    /* Messwerte (für Hilfen in den Übungen) */
    zirkelSm() { const z = st.zirkel; if (!z || !z.done) return null; const a = unproj(z.a.x, z.a.y), b = unproj(z.b.x, z.b.y); return kursDist(a, b).d; },
    dreieckDeg() { return st.dreieck ? st.dreieck.a : null; },
    setVB(v) { vbSet({...v}); },
    /* Zeichnungen, Werkzeuge und Verlauf für die nächste Teilaufgabe mitnehmen */
    zustand() { return {lines: st.lines.slice(), marks: st.marks.slice(), zirkel: st.zirkel && JSON.parse(JSON.stringify(st.zirkel)), dreieck: st.dreieck && {...st.dreieck}, undo: st.undo.slice(), redo: st.redo.slice(), vb: {...st.vb}}; },
    uebernehmen(k) { st.lines = (k.lines || []).slice(); st.marks = (k.marks || []).slice(); st.zirkel = k.zirkel || null; st.dreieck = k.dreieck || null; st.undo = (k.undo || []).slice(); st.redo = (k.redo || []).slice(); if (k.vb) vbSet({...k.vb}); ink(); tip.classList.add('hidden'); },
  };
  ctl.setTool(opt.tool || 'hand'); ink();
  return ctl;
};

/* ---------- Einstieg: Navigationsschule ---------- */
const CSS = `
.nwrap{position:relative;margin:0 -16px;height:62svh;min-height:360px;background:#fff;overflow:hidden;touch-action:none;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.nsvg{width:100%;height:100%;display:block;touch-action:none;user-select:none;-webkit-user-select:none}
.nsvg text{font-family:Helvetica,Arial,sans-serif}
.nlab{font-size:calc(9px * var(--lz,1));fill:#222}.weit .nlab.k,.weit .tief{display:none}.nlab.k{fill:#7a2a7a;font-size:calc(8px * var(--lz,1))}.rlab{font-size:calc(9px * var(--lz,1));fill:#7a2a7a;text-anchor:middle}
.slab{font-size:calc(10px * var(--lz,1));fill:#222}.scale path{stroke:#222;stroke-width:.8}.grid{stroke:#7a8a99;stroke-width:.5;stroke-dasharray:2 4}
.tief{font-size:calc(10px * var(--lz,1));font-style:italic;fill:#333}.nname{font-style:italic;fill:#5a4a2a}.nname.w{fill:#2f5d7c}.nname.g{fill:#56703a}
.vtg{font-size:calc(11px * var(--lz,1));fill:#a0306e}
.pencil{stroke:#2a2a6a;stroke-width:1.4;fill:none}.pencil.live{stroke-dasharray:4 3}.pencil.ok{stroke:#1e7f4f;stroke-width:1.8}.pencil.soll{stroke:#c1489a;stroke-width:1.6;stroke-dasharray:6 4}
.xmark path{stroke:#2a2a6a;stroke-width:1.8}.xmark text{font-size:10px;fill:#2a2a6a}.xmark.ok path{stroke:#1e7f4f}.xmark.soll path{stroke:#c1489a}
.dreieck .dbody{fill:rgba(240,248,255,.55);stroke:#5a7a9a;stroke-width:1}.dreieck .dedge{stroke:#2a2a6a;stroke-width:1.6}
.dreieck .darrow{fill:#2a2a6a}.dreieck .dticks path{stroke:#2a2a6a;stroke-width:.6}.dlab{font-size:7px;fill:#2a2a6a;text-anchor:middle}.dlab.i{fill:#8a4a4a}
.dreieck .dhandle{fill:#f0b43e;stroke:#2a2a6a;stroke-width:1;cursor:grab}.dreieck .dctr{fill:#2a2a6a}.dmer{stroke:#d6332c;stroke-width:1;stroke-dasharray:4 2}
.zirkel .zleg{stroke:#444;stroke-width:2.2;fill:none;stroke-linejoin:round;vector-effect:non-scaling-stroke}.zirkel .zgl{stroke:#8a6a2a;stroke-width:1.2;stroke-dasharray:3 3;fill:none;vector-effect:non-scaling-stroke}
.zirkel .zhinge{fill:#c8962e;stroke:#444;vector-effect:non-scaling-stroke}.zirkel .zgrip{fill:rgba(240,181,62,.92);stroke:#5a4410;stroke-width:1.5;vector-effect:non-scaling-stroke}.zirkel .zgdot{fill:#fff;pointer-events:none}.zirkel .zhit{fill:transparent}.zirkel .ztip{fill:#d6332c;pointer-events:none}
.nhi{fill:none;stroke:#f0b43e;stroke-width:3;stroke-dasharray:5 3}
.nlens{position:absolute;width:110px;height:110px;border-radius:50%;overflow:hidden;border:3px solid #2a2a6a;background:#fff;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,.3);z-index:5}
.nlens svg{width:100%;height:100%}.nlens i{position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px 0 0 -5px;border:1px solid #d6332c;border-radius:50%}
.ntoolbar{position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:6px;z-index:4;pointer-events:none}.ntoolbar button{pointer-events:auto}.ntoolbar .nsp{flex:1}
.ntoolbar button,.nzoom button{width:42px;height:42px;padding:0;border-radius:10px;border:1px solid #9aa;background:rgba(255,255,255,.94);font-size:20px;line-height:1;color:#2a2a6a;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.ntoolbar button[aria-pressed="true"]{background:#2a2a6a;color:#fff}.ntoolbar button:disabled{opacity:.35}
.nzoom{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:4}
.ntop{position:absolute;left:8px;right:58px;top:8px;display:flex;flex-direction:column;align-items:flex-start;gap:6px;z-index:4;pointer-events:none}.ntop>*{pointer-events:auto}
.ntip{background:rgba(255,250,240,.96);color:#2a2019;border-radius:10px;padding:6px 10px;font-size:.78rem;box-shadow:0 2px 6px rgba(0,0,0,.15)}
.nctx{display:flex;gap:6px;flex-wrap:wrap}.nctx:empty{display:none}
.nctx button{min-height:38px;border-radius:19px;border:1px solid #2a2a6a;background:rgba(255,255,255,.97);color:#2a2a6a;font:800 .8rem var(--bfont);padding:0 12px;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.nablese{position:absolute;left:8px;right:8px;bottom:58px;z-index:5;background:rgba(255,255,255,.97);border:1px solid #9aa;border-radius:12px;padding:4px 8px;color:#2a2a6a;font-size:.72rem;line-height:1.3;box-shadow:0 3px 10px rgba(0,0,0,.2)}
.nablese>div{display:flex;gap:10px}.nablese figure{flex:1;margin:2px 0;text-align:center;background:#f2f6fb;border:1px solid #c9d3de;border-radius:8px;padding:2px 4px 1px}.nablese svg{width:100%;height:auto;display:block}
.nablese svg path{stroke:#2a2a6a;stroke-width:1}.nablese svg text{font:700 9px Helvetica,Arial,sans-serif;fill:#2a2a6a;text-anchor:middle}.nablese .nnadel{stroke:#d6332c;stroke-width:2;fill:#d6332c}
.nablese figcaption{font-weight:700}.nablese small{display:block;color:#6c5f52}
.ntask .nwrap{height:44svh;min-height:290px}.nschritte{list-style:none;margin:10px 0;padding:0;display:grid;gap:8px}.nschritte .menuitem{display:flex;gap:10px;align-items:center;width:100%;text-align:left}.nschritte small{display:block;color:var(--muted)}.nnr{flex:0 0 30px;height:30px;border-radius:50%;background:var(--line);display:grid;place-items:center;font-weight:800}.menuitem.nnext{border-color:var(--lamp);box-shadow:0 0 0 3px rgba(240,181,62,.25)}.nbeg .fanim{max-width:300px}.nrech summary{cursor:pointer;min-height:40px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.nhint{background:#fff8e6;color:#3a2610;border-radius:8px;padding:6px 8px}
.nsheetgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.nsheetgrid label{margin:0;font-size:.8rem}
.nfield{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:5px 0}.nfield .nfl{min-width:92px;font-weight:700;font-size:.9rem}
.nfield input,.nzeile input{flex:0 0 92px;width:92px;min-width:0;padding:.3em .6em;border:2px solid var(--line);border-radius:10px;background:#fff;color:#2a2019;font:700 1rem var(--bfont)}
.nunit{font-size:.85rem;color:var(--muted)}input.kpon{border-color:var(--lamp)!important;box-shadow:0 0 0 3px rgba(240,181,62,.35)}input.npinned{background:#fff1c4!important}
/* Aufgabe (V28-Facelift): oben die Aufgabe, in der Mitte die Karte, unten das Arbeitsblatt */
.wrap:has(.nt2){padding-bottom:0}
.nt2{display:flex;flex-direction:column;height:calc(100svh - 64px);min-height:430px;margin:0 -16px;overflow:hidden}
.ntbar{flex:0 0 auto;padding:0 16px 6px}.ntmeta{display:flex;align-items:center;gap:6px;min-height:30px;font-size:.78rem;color:var(--muted);font-weight:700}.ntmeta #xmeta{flex:1}
.ntmeta .btn{min-height:32px;padding:2px 10px;font-size:.78rem}.ntq{font-size:.92rem;line-height:1.35;max-height:5.5em;overflow:auto}
.ntmid{flex:1 1 auto;min-height:130px;position:relative}.ntmid>#nchartbox{position:absolute;inset:0}.nt2 .nwrap{height:100%;min-height:0;margin:0;border-bottom:0}
.nt2.nochart .ntmid{overflow:auto;padding:0 16px}.ntext{font-size:.92rem}
.ntover{position:absolute;left:8px;right:8px;top:6px;max-height:calc(100% - 12px);overflow:auto;z-index:8;background:var(--paper);color:var(--ink);border:1px solid var(--paper-edge);border-radius:14px;padding:8px 12px 10px;box-shadow:0 8px 20px rgba(0,0,0,.3);font-size:.88rem}
.nover-x{float:right;margin:0 0 4px 8px;min-height:32px}
.ntsheet{flex:0 1 auto;max-height:62%;display:flex;flex-direction:column;background:var(--paper);border-top:1px solid var(--paper-edge);border-radius:16px 16px 0 0;box-shadow:0 -4px 14px rgba(0,0,0,.14);position:relative;z-index:6}
.nt2.fbon .ntsheet{max-height:74%}.nt2.sheetzu .ntsc,.nt2.sheetzu .nkeys{display:none}
.nttabs{display:flex;gap:6px;padding:8px 12px 4px;flex:0 0 auto}.nttabs button{flex:1;min-height:36px;border-radius:10px;border:1px solid var(--line);background:transparent;color:var(--ink);font:800 .8rem var(--bfont);padding:0 4px}
.nttabs button[aria-selected="true"]{background:var(--sea);border-color:var(--sea);color:var(--sea-ink)}
.ntsc{flex:1 1 auto;min-height:0;overflow:auto;padding:4px 16px 10px}.ntsc .btn{min-height:44px}
.nkeys{flex:0 0 auto;display:grid;gap:5px;padding:6px 8px calc(8px + env(safe-area-inset-bottom,0px));background:var(--bg);border-top:1px solid var(--line)}
.nkrow{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}.nkrow.b{grid-template-columns:repeat(5,1fr) 1.8fr}
.nkeys button{min-height:42px;border-radius:9px;border:1px solid var(--line);background:var(--paper);color:var(--ink);font:800 1.05rem var(--bfont);padding:0}.nkeys button:disabled{opacity:.3}
.nkeys .nkok{background:var(--lamp);border-color:var(--lamp);color:#3a2610;font-size:.9rem}
.nbisher{margin:2px 0 6px;font-size:.78rem;color:var(--muted)}.nbisher span{display:inline-block;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:0 8px;margin:2px 4px 0 0;color:var(--ink)}
.nmess{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.nmess:empty{display:none}.nchip{border:1px dashed var(--sea);background:transparent;color:var(--ink);border-radius:16px;padding:4px 10px;font:700 .78rem var(--bfont);min-height:34px}
.nschema{display:grid;gap:3px;margin:4px 0 8px}.nzeile{display:flex;align-items:center;gap:6px;margin:0}.nzeile .nop{flex:0 0 14px;text-align:center;font-weight:800;color:var(--muted)}
.nzeile .nlab{flex:0 0 58px;font-weight:700;font-size:.85rem}.nzeile .nquelle{font-size:.7rem;color:var(--muted)}.nrhint{margin:2px 0}
.nnotiz{display:flex;gap:8px;align-items:center;font-size:.85rem;margin:4px 0}.nnotiz input{flex:1;min-width:0;padding:.42em .6em;border:2px solid var(--line);border-radius:10px;background:#fff;color:#2a2019}
.nok{color:var(--stb,#1e7f4f);font-weight:700}.nno{color:var(--bb,#c2473b);font-weight:700}
.ntab{border-collapse:collapse;margin:8px 0;font-size:.72rem;display:block;max-width:100%;overflow-x:auto}.ntab th,.ntab td{border:1px solid var(--line);padding:3px 4px;text-align:center;min-width:30px}
`;
NAV.init = async function () {
  if (!document.getElementById('navicss')) { const s = document.createElement('style'); s.id = 'navicss'; s.textContent = CSS + FIBCSS; document.head.appendChild(s); }
  if (K) return;
  const get = f => fetch('data/' + f + '?v=' + window.__ver).then(r => { if (!r.ok) throw new Error(f); return r.json(); });
  [K, NV] = await Promise.all([get('karte.json'), get('navi.json').catch(() => ({}))]);
  MTOP = merc(K.bounds.lat1);
  chartSVG();
};
NAV.data = () => ({K, NV});
const S_ = () => { S.navi = S.navi || {}; S.navi.lek = S.navi.lek || {}; S.navi.fibel = S.navi.fibel || {}; S.navi.pruef = S.navi.pruef || []; return S.navi; };
NAV.state = S_;
function infoCard(o) {
  return `<b>${esc(o.id)}</b>${o.kenn ? ` · Kennung <b>${esc(o.kenn)}</b>` : ''}<br>${o.farbe ? 'Farbe: ' + esc(o.farbe) + '<br>' : ''}${o.topp ? 'Toppzeichen: ' + esc(o.topp) + '<br>' : ''}<span class="muted">${esc(o.bed || '')}</span><br><span class="muted">${fmtPos(o)}</span>`;
}
NAV.infoCard = infoCard;
/* Freie Karte: alle Werkzeuge ausprobieren, Rechenblatt dabei */
NAV.freeChart = function () {
  gameShell('Freie Karte', `<div id="nchartbox"></div>
    <div class="row" style="margin:8px 0;flex-wrap:wrap"><button class="btn small ghost" id="nclear">Alles wegwischen</button><button class="btn small ghost" id="nsheet">Rechenblatt</button></div>
    <div class="card small" id="ninfo">Tippe eine Tonne oder ein Feuer an.</div>`);
  $('#gback').onclick = () => NAV.hub();
  const ctl = NAV.mountChart($('#nchartbox'), {hilfen: true, onTap: t => { $('#ninfo').innerHTML = t.obj ? infoCard(t.obj) : 'Position: <b>' + fmtPos(t.ll) + '</b>'; }});
  $('#nclear').onclick = () => ctl.clear();
  $('#nsheet').onclick = () => NAV.sheet();
  ctl.on('zirkel', () => { const d = ctl.zirkelSm(); if (d != null) $('#ninfo').innerHTML = `Zirkel gespreizt. Am Breitenrand ablesen. <span class="muted">(Zur Kontrolle: ${r1(d).toString().replace('.', ',')} sm)</span>`; });
  ctl.on('dreieck', () => { $('#ninfo').innerHTML = `Dreieck liegt an. Lies am Gradbogen ab. <span class="muted">(Zur Kontrolle: Kante zeigt ${fmtDeg(ctl.dreieckDeg())})</span>`; });
};
/* Rechenblatt: Notizfelder, bleiben in der Sitzung erhalten */
const sheetVals = {};
NAV.sheet = function () {
  const F = [['rwK', 'rwK'], ['mw', 'Mw'], ['mwK', 'mwK'], ['abl', 'Abl.'], ['mgk', 'MgK'], ['dist', 'Distanz sm'], ['fahrt', 'Fahrt kn'], ['zeit', 'Zeit'], ['notiz', 'Notiz']];
  const w = sheet(`<h2 style="margin:0 0 8px">Rechenblatt</h2><p class="small muted" style="margin:0 0 8px">Merke: rwK = MgK + Abl. + Mw. Östliche Werte sind plus, westliche minus.</p>
    <div class="nsheetgrid">${F.map(([k, n]) => `<label>${n}<input data-sv="${k}" value="${esc(sheetVals[k] || '')}" ${k === 'notiz' ? '' : 'inputmode="decimal"'}></label>`).join('')}</div>`);
  w.querySelectorAll('[data-sv]').forEach(i => i.oninput = () => { sheetVals[i.dataset.sv] = i.value; });
};
/* ---------- Navi-Fibel: Begriffe mit Erklärung, kleiner Animation und Merkhilfe ---------- */
const ARR = (x1, y1, x2, y2, c, cls = '') => { const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = -ux * 11, by = -uy * 11, px = -uy * 5, py = ux * 5;
  return `<g class="${cls}"><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="3"/><path d="M${x2} ${y2} l${(bx + px).toFixed(1)} ${(by + py).toFixed(1)} M${x2} ${y2} l${(bx - px).toFixed(1)} ${(by - py).toFixed(1)}" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`; };
function anim(type) {
  const boat = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 -12 Q7 -2 5 10 L-5 10 Q-7 -2 0 -12 Z" fill="#fbf6ec" stroke="#2a2a6a" stroke-width="1.5"/></g>`;
  const N = (x, c, t, rot = 0) => `<g transform="translate(${x} 130) rotate(${rot})"><path d="M0 0 V-100" stroke="${c}" stroke-width="2" stroke-dasharray="${t === 'rwN' ? '' : '5 3'}"/><text y="-104" text-anchor="middle" font-size="11" fill="${c}">${t}</text></g>`;
  const A = {
    gradnetz: `<circle cx="130" cy="75" r="62" fill="#dbeef8" stroke="#2f5d7c"/>${[-40, -20, 0, 20, 40].map(d => `<ellipse cx="130" cy="75" rx="${Math.abs(62 * Math.sin(rad(90 - Math.abs(d))))}" ry="62" fill="none" stroke="#2f5d7c" stroke-width=".7"/>`).join('')}${[-40, -20, 0, 20, 40].map(d => `<path d="M${130 - 62 * Math.cos(rad(d))} ${75 - 62 * Math.sin(rad(d))} H${130 + 62 * Math.cos(rad(d))}" stroke="#c2473b" stroke-width="${d ? .8 : 2}"/>`).join('')}<circle class="fpulse" cx="160" cy="55" r="5" fill="#f0b43e"/><text x="200" y="40" font-size="11">Breite ↕</text><text x="200" y="120" font-size="11">Länge ↔</text>`,
    seemeile: `<path d="M30 20 V140" stroke="#222" stroke-width="2"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M30 ${20 + i * 24} h14" stroke="#222"/><text x="48" y="${24 + i * 24}" font-size="10">${20 - i}'</text>`).join('')}<g class="fslide"><path d="M140 44 L170 10 L200 68" stroke="#444" stroke-width="2.4" fill="none"/></g><text x="120" y="130" font-size="11">1' Breite = 1 sm = 1852 m</text>`,
    kurse: `${N(70, '#2a2a6a', 'rwN')}${N(70, '#7a2a7a', 'mwN', 16)}${N(70, '#c2473b', 'MgN', 34)}<g class="frock">${boat(70, 130, 60)}</g><path d="M70 130 L170 72" stroke="#2a2a6a" stroke-width="2"/><text x="110" y="144" font-size="11">rwK = MgK + Abl. + Mw</text>`,
    missweisung: `${N(110, '#2a2a6a', 'rwN')}<g class="fswing">${N(110, '#7a2a7a', 'mwN', 12)}</g><path d="M110 60 A70 70 0 0 1 124 61" stroke="#c2473b" stroke-width="2" fill="none"/><text x="160" y="80" font-size="11">Mw (Ost = +)</text>`,
    deviation: `<circle cx="100" cy="80" r="50" fill="#f7f2e6" stroke="#2a2a6a"/><g class="fneedle"><path d="M100 36 L105 80 L100 124 L95 80 Z" fill="#c2473b"/></g><g class="fknife"><path d="M180 70 L215 64 L217 68 L182 74 Z" fill="#9aa"/><rect x="215" y="62" width="16" height="8" fill="#7a4e33"/></g><text x="160" y="130" font-size="11">Eisen → Ablenkung</text>`,
    peilung: `<g transform="translate(200 40)"><path d="M0 0 L-4 -22 Q0 -27 4 -22 Z" fill="#c1489a"/><circle r="4" fill="#fff" stroke="#222"/></g>${boat(60, 120, 50)}<path class="fdraw" d="M60 120 L200 40" stroke="#2a2a6a" stroke-width="2" stroke-dasharray="6 4"/><text x="30" y="40" font-size="11">rwP = MgP + Abl. + Mw</text>`,
    kreuzpeilung: `<g transform="translate(40 30)"><circle r="4" fill="#fff" stroke="#222"/></g><g transform="translate(230 40)"><circle r="4" fill="#fff" stroke="#222"/></g><path class="fdraw" d="M40 30 L150 120" stroke="#2a2a6a" stroke-width="2"/><path class="fdraw d2" d="M230 40 L120 125" stroke="#2a2a6a" stroke-width="2"/><g class="fpop"><path d="M127 103 l12 12 M139 103 l-12 12" stroke="#c2473b" stroke-width="3"/></g>`,
    koppel: `${boat(40, 110, 70)}${ARR(40, 110, 200, 50, '#2a2a6a', 'fdraw')}<circle class="fpop" cx="200" cy="50" r="6" fill="none" stroke="#2a2a6a" stroke-width="2"/><text x="60" y="140" font-size="11">Fahrt × Zeit = Distanz</text>`,
    gissort: `${ARR(40, 110, 190, 50, '#2a2a6a')}<circle cx="190" cy="50" r="6" fill="none" stroke="#2a2a6a" stroke-width="2"/>${ARR(190, 50, 220, 85, '#3c8c5a', 'fdraw')}<path class="fpop" d="M214 79 h12 v12 h-12 Z" fill="none" stroke="#3c8c5a" stroke-width="2"/><text x="40" y="140" font-size="11">Koppelort + Strom/Wind = Gissort</text>`,
    bv: `<circle cx="80" cy="60" r="6" fill="none" stroke="#2a2a6a" stroke-width="2"/><text x="60" y="45" font-size="10">Ok</text>${ARR(80, 60, 190, 100, '#c2473b', 'fdraw')}<path d="M182 92 l16 16 M198 92 l-16 16" stroke="#2a2a6a" stroke-width="2.5"/><text x="200" y="125" font-size="10">Ob</text>`,
    strom: `${ARR(40, 120, 180, 40, '#2a2a6a', 'fdraw')}${ARR(180, 40, 220, 100, '#3c8c5a', 'fdraw d2')}${ARR(40, 120, 220, 100, '#c2473b', 'fdraw d3')}<text x="70" y="70" font-size="10" fill="#2a2a6a">KdW/FdW</text><text x="205" y="60" font-size="10" fill="#3c8c5a">Strom</text><text x="110" y="135" font-size="10" fill="#c2473b">KüG/FüG</text>`,
    vorhalte: `<path d="M20 30 H240 M20 120 H240" stroke="#9cc3d9" stroke-width="2"/>${ARR(160, 60, 200, 60, '#3c8c5a')}<g class="frock">${boat(130, 115, -25)}</g><path class="fdraw" d="M130 115 L130 35" stroke="#c2473b" stroke-width="2" stroke-dasharray="5 3"/><text x="20" y="145" font-size="11">schräg gegen den Strom steuern</text>`,
    abdrift: `<g class="fwind">${ARR(20, 40, 60, 40, '#7a8a99')}${ARR(20, 70, 60, 70, '#7a8a99')}</g>${boat(130, 120, 0)}<path d="M130 120 V20" stroke="#2a2a6a" stroke-width="2"/><path class="fdraw" d="M130 120 L160 22" stroke="#c2473b" stroke-width="2" stroke-dasharray="5 3"/><text x="170" y="40" font-size="10" fill="#c2473b">KdW</text><text x="100" y="18" font-size="10">rwK</text><text x="10" y="100" font-size="10">Wind von Bb → +</text>`,
    gezeiten: `<path d="M10 120 H250" stroke="#8a7a52" stroke-width="2"/><rect class="ftide" x="10" y="60" width="240" height="60" fill="#b9dcef"/><path d="M10 105 H250" stroke="#c2473b" stroke-dasharray="4 3"/><text x="14" y="102" font-size="10" fill="#c2473b">Kartennull</text><text x="160" y="50" font-size="11">HW … NW … HW</text>`,
  };
  return `<svg viewBox="0 0 260 150" class="fanim">${A[type] || ''}</svg>`;
}
const FIBCSS = `.fanim{width:100%;max-width:340px;height:auto;display:block;margin:6px auto;background:#fbfdff;border-radius:10px}
@media (prefers-reduced-motion:no-preference){
.fanim .fdraw{stroke-dasharray:400;stroke-dashoffset:400;animation:fdraw 1.6s ease-out forwards}.fanim .d2{animation-delay:.9s}.fanim .d3{animation-delay:1.8s}
@keyframes fdraw{to{stroke-dashoffset:0}}
.fanim .fpop{opacity:0;animation:fpop .4s 2.2s forwards}@keyframes fpop{to{opacity:1}}
.fanim .fpulse{animation:fpulse 1.4s ease-in-out infinite}@keyframes fpulse{50%{r:9}}
.fanim .fslide{animation:fslide 2.4s ease-in-out infinite alternate}@keyframes fslide{to{transform:translate(-100px,30px)}}
.fanim .fswing{transform-origin:110px 130px;animation:fswing 2s ease-in-out infinite alternate}@keyframes fswing{from{transform:rotate(-6deg)}}
.fanim .fneedle{transform-origin:100px 80px;animation:fneedle 3s ease-in-out infinite}@keyframes fneedle{40%,60%{transform:rotate(18deg)}}
.fanim .fknife{animation:fknife 3s ease-in-out infinite}@keyframes fknife{40%,60%{transform:translateX(-40px)}}
.fanim .frock{animation:frock 3s ease-in-out infinite}@keyframes frock{50%{transform:translateY(-3px)}}
.fanim .fwind{animation:fwind 1.5s linear infinite}@keyframes fwind{to{transform:translateX(20px);opacity:.3}}
.fanim .ftide{animation:ftide 5s ease-in-out infinite alternate}@keyframes ftide{to{transform:translateY(30px)}}}
.nterm{border:0;background:none;padding:0;color:inherit;font:inherit;text-decoration:underline dotted;text-underline-offset:3px;cursor:help}`;
NAV.anim = anim;
/* Begriff anzeigen (überall antippbar) */
NAV.term = function (id) {
  const f = (NV.fibel || []).find(x => x.id === id); if (!f) return;
  S_().fibel[id] = 1; save();
  sheet(`<h2 style="margin:0 0 6px">${esc(f.t)}</h2>${anim(f.a)}<p style="margin:6px 0">${esc(f.e)}</p><p class="small" style="margin:0">💡 ${esc(f.m)}</p>`);
};
/* In Texten Fachbegriffe antippbar machen: ersetzt Kürzel durch Knöpfe */
const TERMS = [['rwK', 'rwk'], ['mwK', 'mwk'], ['MgK', 'mgk'], ['rwP', 'rwp'], ['MgP', 'rwp'], ['Mw', 'mw'], ['Abl.', 'abl'], ['Ablenkung', 'abl'], ['Missweisung', 'mw'], ['Kreuzpeilung', 'kreuzpeilung'], ['Versegelungspeilung', 'versegelung'], ['Doppelpeilung', 'doppelpeilung'], ['Vierstrichpeilung', 'doppelpeilung'], ['Koppelort', 'koppelort'], ['Gissort', 'gissort'], ['Besteckversetzung', 'bv'], ['KdW', 'kdw'], ['FdW', 'fdw'], ['KüG', 'kueg'], ['FüG', 'fueg'], ['Vorhaltewinkel', 'vorhalte'], ['Abdrift', 'abdrift'], ['Standlinie', 'standlinie'], ['Kartennull', 'kartennull'], ['Seemeile', 'sm']];
NAV.linkTerms = html => { let out = html; TERMS.forEach(([w, id]) => { out = out.replace(new RegExp('(^|[\\s(>„])(' + w.replace('.', '\\.') + ')(?=[\\s,.:;)!?<“]|$)', 'g'), `$1<button class="nterm" data-term="${id}">$2</button>`); }); return out; };
NAV.bindTerms = root => root.querySelectorAll('[data-term]').forEach(b => b.onclick = e => { e.stopPropagation(); NAV.term(b.dataset.term); });
NAV.fibel = function (filter = '') {
  const n = S_(), f = filter.trim().toLowerCase(), list = (NV.fibel || []).filter(x => !f || (x.t + ' ' + x.e).toLowerCase().includes(f));
  gameShell('Navi-Fibel', `<p class="small muted" style="margin:6px 0 8px">${Object.keys(n.fibel).length} von ${(NV.fibel || []).length} Begriffen angesehen.</p>
    <input type="search" id="fsr" placeholder="Suchen, z. B. Peilung" value="${esc(filter)}" style="width:100%">
    <div class="menu" style="margin-top:10px">${list.map(x => `<button class="menuitem" data-f="${x.id}"><b>${n.fibel[x.id] ? '✓ ' : ''}${esc(x.t)}</b><span class="small muted">${esc(x.e.split('. ')[0])}.</span></button>`).join('') || '<p class="muted">Nichts gefunden.</p>'}</div>`);
  $('#gback').onclick = () => NAV.hub();
  app.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { NAV.term(b.dataset.f); setTimeout(() => { const s = $('#sheet'); if (s) s.querySelector('[data-close]').addEventListener('click', () => NAV.fibel($('#fsr') ? $('#fsr').value : ''), {once: true}); }, 0); });
  let t = null; $('#fsr').oninput = e => { clearTimeout(t); t = setTimeout(() => { NAV.fibel(e.target.value); const s = $('#fsr'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); }, 300); };
};
/* ==========================================================================
   Lernpfad: Aufgabengenerator, Übungsmaschine, Meisterschaft
   Jede Aufgabe: {text, chart, fields:[{k,l,t}], sol:{}, tol:{}, hint:[], expl, soll(ctl)}
   ========================================================================== */
const rnd = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rnd(a, b + 1)), pick = a => a[Math.floor(Math.random() * a.length)];
const BUOYS = () => K.objekte.filter(o => ['bb', 'stb', 'mitte', 'nord', 'west', 'einzel'].includes(o.typ));
const PEIL = () => K.objekte.filter(o => ['turm', 'kirche', 'mast', 'mitte', 'einzel', 'nord', 'west'].includes(o.typ));
const ROSE = () => { const p = fromXY([240, 720]); return unproj(p.x, p.y); };
const comma = (v, d = 1) => v.toFixed(d).replace('.', ',');
const latMinOf = lat => 55 * 60 + lat - 55 * 60, lonMinOf = lon => lon;
/* Liegt ein Punkt im freien Wasser (nicht an Land, nicht auf der Insel, auf der Karte)? */
function inSea(p) {
  const b = K.bounds; if (p.lat < b.lat0 + 1 || p.lat > b.lat1 - 1 || p.lon < b.lon0 + 1.5 || p.lon > 49.5) return false;
  const isl = {lat: 30 - 240 / 50, lon: 20 + 360 / 28.45}; if (Math.hypot((p.lat - isl.lat), (p.lon - isl.lon) * .57) < 2.6) return false;
  return true;
}
function seaPoint() { for (let i = 0; i < 200; i++) { const p = {lat: rnd(14, 26), lon: rnd(24, 48)}; if (inSea(p)) return p; } return {lat: 19, lon: 36}; }
function twoBuoys(dmin = 2, dmax = 10) { const B = BUOYS(); for (let i = 0; i < 300; i++) { const a = pick(B), b = pick(B); if (a === b) continue; const kd = kursDist(a, b); if (kd.d >= dmin && kd.d <= dmax) return [a, b, kd]; } const a = B[0], b = B[3]; return [a, b, kursDist(a, b)]; }
/* Kennung in Worte fassen, z. B. „Fl(2) R 9s“ → „zwei rote Blitze, Wiederkehr 9 Sekunden“ */
NAV.kennWorte = k => kennWorte(k);
function kennWorte(k) {
  const m = k.match(/^(Fl|Q|VQ|Iso|Oc)(?:\((\d+)\))?\s*([RGW])?\s*(\d+)?s?/); if (!m) return k;
  const zahl = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'][+m[2] || 1], farbe = {R: 'rote', G: 'grüne', W: 'weiße'}[m[3] || 'W'], farbe1 = {R: 'rotes', G: 'grünes', W: 'weißes'}[m[3] || 'W'];
  const art = m[1] === 'Fl' ? (m[2] ? `Gruppen aus ${zahl} ${farbe}n Blitzen` : `${farbe1.replace(/s$/, 'r')} Blitz`.replace('weißer', 'weißer').replace('roter', 'roter')) : m[1] === 'Q' ? (m[2] ? `Gruppen aus ${zahl} weißen Funkeln` : 'ununterbrochenes weißes Funkeln') : m[1] === 'Iso' ? `${farbe1} Gleichtaktfeuer` : (m[2] ? `${farbe1} unterbrochenes Feuer in Gruppen zu ${zahl}` : `${farbe1} unterbrochenes Feuer`);
  return art + (m[4] ? `, Wiederkehr ${m[4]} Sekunden` : '');
}
/* Ablenkungstabelle in zwei Blöcken zu je 6 Werten, damit sie im Hochformat ganz sichtbar ist */
const ABL_TAB = () => [K.deviation.slice(0, 6), K.deviation.slice(6)].map(part => `<table class="ntab"><tr><th>MgK</th>${part.map(r => `<td>${String(r[0]).padStart(3, '0')}</td>`).join('')}</tr><tr><th>Abl.</th>${part.map(r => `<td>${fmtSigned(r[1])}</td>`).join('')}</tr></table>`).join('');
const GEN = {
  posAblesen() { const o = pick(BUOYS()); return {text: `Lies die geographische Position der Tonne <b>${o.id}</b> ab.`, chart: {center: o, hi: [o.id], tools: ['hand']}, fields: [{k: 'lat', l: 'Breite', t: 'lat'}, {k: 'lon', l: 'Länge', t: 'lon'}], sol: {lat: o.lat, lon: o.lon},
    hint: ['Die Breite liest du am linken oder rechten Kartenrand ab: Grad, Minuten und Zehntel.', 'Die Länge liest du oben oder unten ab. Leg die Lupe (Finger gedrückt halten) auf den Rand.'], expl: `${o.id} liegt auf ${fmtPos(o)}.`, soll: c => c.addMark(proj(o.lat, o.lon), '', 'soll')}; },
  posSetzen() { const p = seaPoint(); return {text: `Trage die Position <b>${fmtPos(p)}</b> mit einem Kreuz in die Karte ein.`, chart: {center: p, tools: ['hand', 'punkt']}, fields: [{k: 'pos', l: 'Kreuz in der Karte', t: 'pos'}], sol: {pos: p},
    hint: ['Erst die Breite am Rand suchen, dann die Länge oben oder unten.', 'Mit dem Werkzeug ✕ setzt du das Kreuz. Die Lupe hilft beim genauen Setzen.'], expl: `Gesucht war ${fmtPos(p)}.`, soll: c => c.addMark(proj(p.lat, p.lon), 'Soll', 'soll')}; },
  symbol() {
    const B = BUOYS(), o = pick(B), q = Math.random() < .5;
    if (q) { const opts = [...new Set([o.bed, ...B.filter(x => x.typ !== o.typ).map(x => x.bed)])].slice(0, 6); const o4 = [o.bed, ...opts.filter(x => x !== o.bed).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
      return {text: `Was bedeutet die Tonne <b>${o.id}</b>? Schau dir Farbe und Toppzeichen in der Karte an.`, chart: {center: o, hi: [o.id], tools: ['hand'], noInfo: true}, fields: [{k: 'mc', l: '', t: 'mc', opts: o4}], sol: {mc: o.bed}, hint: ['Rot und stumpf ist Backbord, grün und spitz ist Steuerbord. Gelb-schwarze Tonnen sind Kardinaltonnen.'], expl: `${o.id}: ${o.farbe}, Toppzeichen ${o.topp}. ${o.bed}.`}; }
    const kk = [...new Set(B.map(x => x.kenn))], o4 = [o.kenn, ...kk.filter(x => x !== o.kenn).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
    return {text: `Welche Kennung hat das Feuer der Tonne <b>${o.id}</b>?`, chart: {center: o, hi: [o.id], tools: ['hand'], noInfo: true, hideKenn: true}, fields: [{k: 'mc', l: '', t: 'mc', opts: o4}], sol: {mc: o.kenn}, hint: ['Bei Lateraltonnen wechseln sich Fl und Fl(2) ab, Kardinaltonnen funkeln (Q).'], expl: `${o.id} hat ${o.kenn}: ${kennWorte(o.kenn)}.`};
  },
  tiefe() { const t = pick(K.tiefen), p0 = fromXY([t[0], t[1]]), ll = unproj(p0.x, p0.y), kt = num(t[2].replace('₅', '.5')), h = ri(5, 35) / 10;
    return {text: `An der markierten Stelle steht eine Kartentiefe. Die Höhe der Gezeit beträgt gerade <b>${comma(h)} m</b>. Wie groß ist die Kartentiefe, und wie tief ist das Wasser dort jetzt?`, chart: {center: ll, tools: ['hand'], ring: ll}, fields: [{k: 'kt', l: 'Kartentiefe', t: 'm'}, {k: 'wt', l: 'Wassertiefe', t: 'm'}], sol: {kt, wt: kt + h},
      hint: ['Die kleine Zahl ist die Kartentiefe in Metern unter Kartennull.', 'Wassertiefe = Kartentiefe + Höhe der Gezeit.'], expl: `Kartentiefe ${comma(kt)} m plus ${comma(h)} m Gezeit sind ${comma(kt + h)} m Wassertiefe.`}; },
  kursMessen() { const [a, b, kd] = twoBuoys(); return {text: `Wie lautet der rechtweisende Kurs (rwK) von <b>${a.id}</b> nach <b>${b.id}</b>?`, chart: {center: {lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2}, hi: [a.id, b.id], tools: ['hand', 'stift', 'dreieck']}, fields: [{k: 'k', l: 'rwK', t: 'deg'}], sol: {k: kd.k},
    hint: ['Zieh mit dem Bleistift eine Linie von Tonne zu Tonne (sie rastet ein).', 'Leg das Kursdreieck mit der Kante an die Linie, der Pfeil zeigt zum Ziel. Dann lies dort ab, wo die rote Meridianlinie den Gradbogen schneidet.'], expl: `Der rwK von ${a.id} nach ${b.id} ist ${fmtDeg(kd.k)}.`, ctrl: c => c.dreieckDeg() != null ? `Dreieckskante zeigt ${fmtDeg(c.dreieckDeg())}` : '', soll: c => c.addLine(proj(a.lat, a.lon), proj(b.lat, b.lon), 'soll')}; },
  distMessen() { const [a, b, kd] = twoBuoys(); return {text: `Wie groß ist die Distanz zwischen <b>${a.id}</b> und <b>${b.id}</b>?`, chart: {center: {lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2}, hi: [a.id, b.id], tools: ['hand', 'zirkel']}, fields: [{k: 'd', l: 'Distanz', t: 'sm'}], sol: {d: kd.d},
    hint: ['Zirkel wählen und die beiden Tonnen antippen.', 'Dann am Gelenk zum Breitenrand ziehen, ungefähr auf derselben Höhe, und die Minuten ablesen: 1\' = 1 sm.'], expl: `Die Distanz beträgt ${comma(kd.d)} sm.`, ctrl: c => { const d = c.zirkelSm(); return d != null ? `Zirkel misst ${comma(d)} sm` : ''; }, soll: c => c.addLine(proj(a.lat, a.lon), proj(b.lat, b.lon), 'soll')}; },
  rw2mg() { const rwk = ri(0, 359), abl = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), m = mw(), mg = n360(rwk - m - abl);
    return {text: `Der rwK beträgt <b>${fmtDeg(rwk)}</b>. Die Ablenkung beträgt <b>${fmtSigned(abl)}</b>, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?`, chart: {center: ROSE(), tools: ['hand'], width: 420}, fields: [{k: 'mw', l: 'Mw', t: 'sdeg'}, {k: 'mg', l: 'MgK', t: 'deg'}], sol: {mw: m, mg}, tol: {mw: 0, mg: 1}, geg: {rwk: gd(rwk), abl: gs(abl)},
      hint: ['Die Mw steht in der Kompassrose: 3° E, also +3°.', 'Von der Karte zum Kompass: MgK = rwK − Mw − Abl.'], expl: `MgK = ${fmtDeg(rwk)} − (${fmtSigned(m)}) − (${fmtSigned(abl)}) = ${fmtDeg(mg)}.`}; },
  mg2rw() { const row = pick(K.deviation), mg = n360(row[0] + pick([0, 0, 10, -10])), abl = Math.round(ablenkung(mg)), m = mw(), rw = n360(mg + abl + m);
    const tab = ABL_TAB();
    return {text: `Am Steuerkompass liegt der MgK <b>${fmtDeg(mg)}</b> an. Die Ablenkung entnimmst du der Ablenkungstabelle (zwischen den Werten gleichmäßig verteilen), die Mw der Karte (3° E). Wie lautet der rwK?${tab}`, chart: null, fields: [{k: 'abl', l: 'Abl.', t: 'sdeg'}, {k: 'rw', l: 'rwK', t: 'deg'}], sol: {abl, rw}, tol: {abl: 1, rw: 1}, geg: {mgk: gd(mg), mw: gs(m)},
      hint: ['Such in der Tabelle die Ablenkung zum MgK. Liegt er zwischen zwei Werten, rechne anteilig.', 'Vom Kompass zur Karte: rwK = MgK + Abl. + Mw.'], expl: `Abl. bei ${fmtDeg(mg)}: ${fmtSigned(abl)}. rwK = ${fmtDeg(mg)} + (${fmtSigned(abl)}) + (${fmtSigned(m)}) = ${fmtDeg(rw)}.`}; },
  peilRechnen() { const mgp = ri(0, 359), m = mw(), rwp = n360(mgp + m);
    return {text: `Mit dem Handpeilkompass peilst du einen Leuchtturm in <b>${fmtDeg(mgp)}</b> (MgP). Die Ablenkung beträgt 0°, die Mw ist 3° E. Wie lautet die rwP?`, chart: null, fields: [{k: 'rwp', l: 'rwP', t: 'deg'}], sol: {rwp}, tol: {rwp: 1}, geg: {pmg: gd(mgp), pabl: '0', pmw: gs(m)}, peil: true, hint: ['Peilungen rechnest du wie Kurse: rwP = MgP + Abl. + Mw.'], expl: `rwP = ${fmtDeg(mgp)} + 0° + 3° = ${fmtDeg(rwp)}.`}; },
  kreuz() {
    let ship, o1, o2, p1, p2;
    for (let i = 0; i < 400; i++) { ship = seaPoint(); const P = PEIL(); o1 = pick(P); o2 = pick(P); if (o1 === o2) continue; const a = kursDist(ship, o1), b = kursDist(ship, o2), dd = angDiff(a.k, b.k); if (a.d < 2 || b.d < 2 || a.d > 14 || b.d > 14 || dd < 50 || dd > 130) continue; p1 = a.k; p2 = b.k; break; }
    const m = mw(), mg1 = Math.round(n360(p1 - m)), mg2 = Math.round(n360(p2 - m)), rw1 = n360(mg1 + m), rw2 = n360(mg2 + m), pos = kreuzpeilung(o1, rw1, o2, rw2) || ship;
    return {text: `Zur Standortbestimmung peilst du mit dem Handpeilkompass (Abl. 0°): <b>${o1.id}</b> MgP = ${fmtDeg(mg1)}, <b>${o2.id}</b> MgP = ${fmtDeg(mg2)}. Die Mw ist der Karte zu entnehmen. Wie lauten die rwP? Trage die Standlinien ein und setze ein Kreuz auf deinen Standort.`,
      chart: {center: pos, hi: [o1.id, o2.id], tools: ['hand', 'dreieck', 'stift', 'punkt'], width: 700}, fields: [{k: 'r1', l: 'rwP ' + o1.id, t: 'deg'}, {k: 'r2', l: 'rwP ' + o2.id, t: 'deg'}, {k: 'pos', l: 'Standort (Kreuz)', t: 'pos'}], sol: {r1: rw1, r2: rw2, pos}, tol: {r1: 1, r2: 1}, geg: {pabl: '0'}, peil: true,
      hint: ['rwP = MgP + Abl. + Mw, also jeweils plus 3°.', 'Leg das Dreieck mit der Kante an das Objekt, Pfeil zeigt zum Objekt (die rwP), und zieh mit „Linie am Dreieck“ die Standlinie.', 'Wo sich beide Linien kreuzen, setzt du mit ✕ den beobachteten Ort.'],
      expl: `rwP ${o1.id} = ${fmtDeg(rw1)}, rwP ${o2.id} = ${fmtDeg(rw2)}. Beobachteter Ort: ${fmtPos(pos)}.`,
      soll: c => { const P = proj(pos.lat, pos.lon); c.addLine(proj(o1.lat, o1.lon), P, 'soll'); c.addLine(proj(o2.lat, o2.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); }};
  },
  feuer() { const L = K.objekte.filter(o => o.kenn), o = pick(L), o4 = [o.id, ...L.filter(x => x.kenn !== o.kenn).map(x => x.id).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
    return {text: `Nachts siehst du voraus ein Feuer: <b>${kennWorte(o.kenn)}</b>. Welches ist es?`, chart: {center: o, tools: ['hand'], width: 900, noInfo: true}, fields: [{k: 'mc', l: '', t: 'mc', opts: o4}], sol: {mc: o.id}, hint: ['Vergleiche mit den Kennungen in der Karte: Fl = Blitz, Q = Funkeln, Iso = Gleichtakt, Oc = unterbrochen. Die Zahl in Klammern ist die Gruppe, die letzte Zahl die Wiederkehr.'], expl: `Es ist ${o.id} (${o.kenn}).`}; },
  distZeit() { const v = ri(8, 24) / 2, t = ri(2, 18) * 5, d = v * t / 60;
    return {text: `Du fährst <b>${comma(v)} kn</b> über Grund. Welche Distanz legst du in <b>${t} Minuten</b> zurück?`, chart: null, fields: [{k: 'd', l: 'Distanz', t: 'sm'}], sol: {d}, tol: {d: .1}, geg: {fahrt: comma(v), zeit: String(t)}, hint: ['Distanz = Fahrt × Zeit. Zeit in Stunden: Minuten durch 60.'], expl: `${comma(v)} kn × ${t}/60 h = ${comma(d, 2)} sm.`}; },
  zeitDist() { const v = ri(8, 24) / 2, d = ri(15, 120) / 10, t = d / v * 60;
    return {text: `Bis zur nächsten Tonne sind es <b>${comma(d)} sm</b>. Du fährst <b>${comma(v)} kn</b> über Grund. Wie lange brauchst du?`, chart: null, fields: [{k: 't', l: 'Zeit', t: 'min'}], sol: {t}, tol: {t: 1}, geg: {dist: comma(d), fahrt: comma(v)}, hint: ['Zeit = Distanz durch Fahrt, mal 60 für Minuten.'], expl: `${comma(d)} sm : ${comma(v)} kn × 60 = ${Math.round(t)} Minuten.`}; },
  /* Lektion 0: Grundlagen */
  richtung() {
    const R = [['Nord', 0], ['Nordost', 45], ['Ost', 90], ['Südost', 135], ['Süd', 180], ['Südwest', 225], ['West', 270], ['Nordwest', 315]], [name, g] = pick(R);
    const hint = ['0° ist Nord, 90° Ost, 180° Süd, 270° West. Gezählt wird rechts herum.', 'Genau dazwischen liegen 45° Nordost, 135° Südost, 225° Südwest und 315° Nordwest.'];
    if (Math.random() < .5) { const o4 = [name, ...R.map(r => r[0]).filter(x => x !== name).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
      return {text: `Du steuerst rwK <b>${fmtDeg(g)}</b>. In welche Himmelsrichtung fährst du?`, chart: null, fields: [{k: 'mc', l: '', t: 'mc', opts: o4}], sol: {mc: name}, hint, expl: `${fmtDeg(g)} ist ${name}.`}; }
    return {text: `Du willst genau nach <b>${name}</b> fahren. Welchen Kurs in Grad steuerst du?`, chart: null, fields: [{k: 'k', l: 'Kurs', t: 'deg'}], sol: {k: g}, tol: {k: 0}, hint, expl: `${name} ist ${fmtDeg(g)}.`};
  },
  gegenkurs() { const k = ri(1, 71) * 5, g = n360(k + 180);
    return {text: `Du bist auf Kurs <b>${fmtDeg(k)}</b> unterwegs und musst umkehren. Welchen Kurs steuerst du zurück (Gegenkurs)?`, chart: null, fields: [{k: 'g', l: 'Gegenkurs', t: 'deg'}], sol: {g}, tol: {g: 0},
      hint: ['Der Gegenkurs zeigt genau in die andere Richtung: Er unterscheidet sich um 180°.', 'Ist der Kurs kleiner als 180°, rechnest du plus 180°. Ist er 180° oder mehr, rechnest du minus 180°.'], expl: `${fmtDeg(k)} ${k < 180 ? '+' : '−'} 180° = ${fmtDeg(g)}.`}; },
  minSm() { const a = ri(30, 300) / 10, b = a + ri(15, 160) / 10, d = b - a;
    return {text: `Zwei Tonnen liegen genau nördlich voneinander: die eine auf <b>${fmtLat(a)}</b>, die andere auf <b>${fmtLat(b)}</b>. Wie weit sind sie voneinander entfernt?`, chart: null, fields: [{k: 'd', l: 'Distanz', t: 'sm'}], sol: {d}, tol: {d: .05},
      hint: ['Eine Minute Breite ist genau eine Seemeile.', `Zieh die Minuten voneinander ab: ${comma(b % 60)} − ${comma(a % 60)}.`], expl: `${comma(d)}' Breitenunterschied sind ${comma(d)} sm.`}; },
  koppelort() {
    let a, k, v, t, z;
    for (let i = 0; i < 300; i++) { a = pick(BUOYS()); k = ri(0, 35) * 10; v = ri(10, 20) / 2; t = ri(3, 9) * 10; z = versegeln(a, k, v * t / 60); if (inSea(z)) break; }
    const hh = ri(8, 15), mm = pick([0, 15, 30]), tt = mm + t, fmtT = m2 => `${String(hh + Math.floor(m2 / 60)).padStart(2, '0')}:${String(m2 % 60).padStart(2, '0')}`;
    return {text: `Um ${fmtT(mm)} Uhr passierst du die Tonne <b>${a.id}</b> nahebei. Du steuerst rwK <b>${fmtDeg(k)}</b> mit <b>${comma(v)} kn</b>. Strom und Wind gibt es nicht. Wo ist dein Koppelort um <b>${fmtT(tt)} Uhr</b>?`,
      chart: {center: z, hi: [a.id], tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 700}, fields: [{k: 'lat', l: 'Breite', t: 'lat'}, {k: 'lon', l: 'Länge', t: 'lon'}], sol: {lat: z.lat, lon: z.lon}, geg: {rwk: gd(k), fahrt: comma(v), zeit: String(t)},
      hint: [`Distanz = ${comma(v)} kn × ${t} min / 60.`, 'Dreieck an die Tonne legen, auf den Kurs drehen und die Kurslinie ziehen.', 'Distanz mit dem Zirkel am Breitenrand abgreifen und auf der Kurslinie abtragen, dort das Kreuz setzen und die Position ablesen.'],
      expl: `Distanz ${comma(v * t / 60, 2)} sm auf ${fmtDeg(k)} ab ${a.id}: Koppelort ${fmtPos(z)}.`, soll: c => { const A = proj(a.lat, a.lon), Z = proj(z.lat, z.lon); c.addLine(A, Z, 'soll'); c.addMark(Z, 'Ok', 'soll'); }};
  },
};
/* ---------- Strom, Wind, Gezeiten (Lektionen 6–8) ---------- */
const vec = (k, v) => [Math.sin(rad(k)) * v, Math.cos(rad(k)) * v];
const vk = ([e, n]) => ({k: n360(deg(Math.atan2(e, n))), v: Math.hypot(e, n)});
function stromAus(hIdx, spring) { const s = K.strom; return {std: s.std[hIdx], r: s.rw[hIdx], v: spring ? s.sp[hIdx] : s.np[hIdx]}; }
const stdText = h => h === 0 ? 'Hochwasser' : `${Math.abs(h)} Stunde${Math.abs(h) > 1 ? 'n' : ''} ${h < 0 ? 'vor' : 'nach'} Hochwasser`;
function zufallsStrom() { const idx = pick(K.strom.rw.map((r, i) => r == null ? -1 : i).filter(i => i >= 0)), sp = Math.random() < .5; return {...stromAus(idx, sp), sp}; }
Object.assign(GEN, {
  stromKueg() { const kdw = ri(0, 71) * 5, fdw = ri(8, 16) / 2, c = zufallsStrom(), g = vk([vec(kdw, fdw)[0] + vec(c.r, c.v)[0], vec(kdw, fdw)[1] + vec(c.r, c.v)[1]]);
    return {text: `Du steuerst KdW <b>${fmtDeg(kdw)}</b> mit FdW <b>${comma(fdw)} kn</b>. Der Strom setzt <b>${fmtDeg(c.r)}</b> mit <b>${comma(c.v)} kn</b>. Wie lauten KüG und FüG?`, chart: null,
      fields: [{k: 'kueg', l: 'KüG', t: 'deg'}, {k: 'fueg', l: 'FüG', t: 'kn'}], sol: {kueg: g.k, fueg: g.v}, tol: {kueg: 3}, geg: {kdw: gd(kdw), fahrt: comma(fdw)},
      hint: ['Zeichne das Stromdreieck für eine Stunde: erst den Pfeil KdW/FdW, an dessen Spitze den Strompfeil.', 'Vom Anfang des ersten bis zur Spitze des zweiten Pfeils: Richtung = KüG, Länge = FüG. Rechnerisch: Vektoren addieren.'],
      expl: `Vektorsumme aus ${fmtDeg(kdw)}/${comma(fdw)} kn und Strom ${fmtDeg(c.r)}/${comma(c.v)} kn: KüG ${fmtDeg(g.k)}, FüG ${comma(g.v)} kn.`}; },
  vorhalteStrom() {
    let a, b, kd, fdw, c, kdw, fueg;
    for (let i = 0; i < 100; i++) {
      [a, b, kd] = twoBuoys(3, 10); fdw = ri(8, 14) / 2; c = zufallsStrom();
      /* Strom in Anteil längs (par) und quer (perp) zum gewünschten KüG zerlegen; das Boot muss den Queranteil aufheben */
      const u = vec(kd.k, 1), p = [u[1], -u[0]], cv = vec(c.r, c.v), par = cv[0] * u[0] + cv[1] * u[1], perp = cv[0] * p[0] + cv[1] * p[1];
      if (Math.abs(perp) >= fdw * .8) continue;
      const wPar = Math.sqrt(fdw * fdw - perp * perp), W = [u[0] * wPar - p[0] * perp, u[1] * wPar - p[1] * perp];
      kdw = vk(W).k; fueg = wPar + par; if (fueg > .5) break;
    }
    return {text: `Du willst über Grund genau von <b>${a.id}</b> nach <b>${b.id}</b>. Deine FdW ist <b>${comma(fdw)} kn</b>, der Strom setzt <b>${fmtDeg(c.r)}</b> mit <b>${comma(c.v)} kn</b>. Welchen KdW musst du steuern, und welche FüG ergibt sich?`,
      chart: {center: {lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2}, hi: [a.id, b.id], tools: ['hand', 'stift', 'dreieck']}, fields: [{k: 'kdw', l: 'KdW', t: 'deg'}, {k: 'fueg', l: 'FüG', t: 'kn'}], sol: {kdw, fueg}, tol: {kdw: 3}, geg: {fahrt: comma(fdw)},
      hint: [`Erst den KüG abnehmen: ${a.id} nach ${b.id}.`, 'Strompfeil (1 Stunde) vom Start antragen. Um seine Spitze einen Kreis mit Radius FdW schlagen, der die Kurslinie schneidet.', 'Von der Strompfeilspitze zum Schnittpunkt: das ist dein KdW. Vom Start zum Schnittpunkt: die FüG.'],
      expl: `KüG ${fmtDeg(kd.k)}. Vorhalten ergibt KdW ${fmtDeg(kdw)}, FüG ${comma(fueg)} kn.`, soll: ctl => ctl.addLine(proj(a.lat, a.lon), proj(b.lat, b.lon), 'soll')};
  },
  stromTab() { const c = zufallsStrom();
    return {text: `Es ist <b>${stdText(c.std)}</b>, <b>${c.sp ? 'Springzeit' : 'Nippzeit'}</b>. Lies aus der Stromtabelle für den Punkt A Richtung und Stärke des Gezeitenstroms ab.<table class="ntab"><tr><th>Std</th>${K.strom.std.map(s => `<td>${s === 0 ? 'HW' : (s > 0 ? '+' : '−') + Math.abs(s)}</td>`).join('')}</tr><tr><th>rw°</th>${K.strom.rw.map(r => `<td>${r == null ? '—' : String(r).padStart(3, '0')}</td>`).join('')}</tr><tr><th>kn Sp</th>${K.strom.sp.map(v => `<td>${comma(v)}</td>`).join('')}</tr><tr><th>kn Np</th>${K.strom.np.map(v => `<td>${comma(v)}</td>`).join('')}</tr></table>`,
      chart: null, fields: [{k: 'r', l: 'Strom setzt', t: 'deg'}, {k: 'v', l: 'Stärke', t: 'kn'}], sol: {r: c.r, v: c.v}, tol: {r: 0, v: .05},
      hint: ['Spalte nach der Stunde zu Hochwasser wählen, Zeile Sp (Springzeit) oder Np (Nippzeit).'], expl: `${stdText(c.std)}, ${c.sp ? 'Springzeit' : 'Nippzeit'}: Strom setzt ${fmtDeg(c.r)} mit ${comma(c.v)} kn.`}; },
  abdrift() { const rwk = ri(0, 71) * 5, a = ri(3, 10), bb = Math.random() < .5, bw = bb ? a : -a, kdw = n360(rwk + bw);
    return {text: `Du steuerst rwK <b>${fmtDeg(rwk)}</b>. Der Wind kommt von <b>${bb ? 'Backbord' : 'Steuerbord'}</b> und verursacht <b>${a}°</b> Abdrift. Wie groß ist die Beschickung für Wind (BW), und welcher KdW ergibt sich?`, chart: null,
      fields: [{k: 'bw', l: 'BW', t: 'sdeg'}, {k: 'kdw', l: 'KdW', t: 'deg'}], sol: {bw, kdw}, tol: {bw: 0, kdw: 1}, geg: {rwk: gd(rwk)}, hint: ['Wind von Backbord drückt nach Steuerbord: BW ist plus. Wind von Steuerbord: minus.', 'KdW = rwK + BW.'], expl: `BW = ${fmtSigned(bw)}, KdW = ${fmtDeg(rwk)} ${bw > 0 ? '+' : '−'} ${a}° = ${fmtDeg(kdw)}.`}; },
  windVorhalt() { const kdw = ri(0, 71) * 5, a = ri(3, 10), bb = Math.random() < .5, bw = bb ? a : -a, rwk = n360(kdw - bw);
    return {text: `Du willst durchs Wasser genau KdW <b>${fmtDeg(kdw)}</b> laufen. Der Wind kommt von <b>${bb ? 'Backbord' : 'Steuerbord'}</b>, die Abdrift beträgt <b>${a}°</b>. Welchen rwK musst du steuern?`, chart: null,
      fields: [{k: 'rwk', l: 'rwK', t: 'deg'}], sol: {rwk}, tol: {rwk: 1}, geg: {kdw: gd(kdw)}, hint: ['KdW = rwK + BW, also rwK = KdW − BW.', 'Wind von Backbord: BW plus, also musst du weniger Grad steuern (gegen den Wind halten).'], expl: `BW = ${fmtSigned(bw)}. rwK = ${fmtDeg(kdw)} − (${fmtSigned(bw)}) = ${fmtDeg(rwk)}.`}; },
  tidenhub() { const hw = ri(28, 42) / 10, nw = ri(1, 6) / 10, kt = pick([2, 3, 4, 5, 6]);
    return {text: `Für Hinnerksiel gibt der Gezeitenkalender heute Hochwasser mit <b>${comma(hw)} m</b> und Niedrigwasser mit <b>${comma(nw)} m</b> über Kartennull an. Wie groß ist der Tidenhub? Und wie tief ist das Wasser bei Niedrigwasser an einer Stelle mit <b>${kt} m</b> Kartentiefe?`, chart: null,
      fields: [{k: 'hub', l: 'Tidenhub', t: 'm'}, {k: 'wt', l: 'Wassertiefe bei NW', t: 'm'}], sol: {hub: hw - nw, wt: kt + nw}, hint: ['Tidenhub = Hochwasserhöhe − Niedrigwasserhöhe.', 'Wassertiefe = Kartentiefe + Höhe der Gezeit (hier die NW-Höhe).'], expl: `Tidenhub ${comma(hw)} − ${comma(nw)} = ${comma(hw - nw)} m. Wassertiefe ${kt} + ${comma(nw)} = ${comma(kt + nw)} m.`}; },
  durchfahrt() { const tg = ri(10, 19) / 10, sich = .5, kt = 1.5, h = tg + sich - kt;
    return {text: `Du willst bei ruhigem Wetter über den Gummientensand (Kartentiefe <b>1,5 m</b>). Dein Boot hat <b>${comma(tg)} m</b> Tiefgang, du willst <b>0,5 m</b> Wasser unter dem Kiel haben. Welche Höhe der Gezeit brauchst du mindestens?`, chart: {center: {lat: 17, lon: 39.3}, tools: ['hand'], width: 380},
      fields: [{k: 'h', l: 'Höhe der Gezeit', t: 'm'}], sol: {h}, hint: ['Benötigte Wassertiefe = Tiefgang + Sicherheit.', 'Höhe der Gezeit = benötigte Wassertiefe − Kartentiefe.'], expl: `${comma(tg)} + 0,5 − 1,5 = ${comma(h)} m.`}; },
  /* ---------- Gesamtaufgabe (Lektion 9 und Prüfungsmodus): neun verkettete Teilaufgaben ---------- */
  gesamt() {
    let a, b, kd, v, t1, ok, ob, o1, o2, rw1, rw2, mg1, mg2;
    for (let i = 0; i < 500; i++) {
      [a, b, kd] = twoBuoys(4, 10); v = ri(10, 20) / 2; t1 = ri(2, 5) * 10; if (v * t1 / 60 > kd.d - .5) continue;
      ok = versegeln(a, kd.k, v * t1 / 60); ob = versegeln(ok, ri(0, 35) * 10, rnd(.3, 1.1)); if (!inSea(ob) || !inSea(ok)) continue;
      const P = PEIL(); o1 = pick(P); o2 = pick(P); if (o1 === o2 || o1 === a || o2 === a) continue;
      const p1 = kursDist(ob, o1), p2 = kursDist(ob, o2), dd = angDiff(p1.k, p2.k); if (p1.d < 1.5 || p2.d < 1.5 || p1.d > 14 || p2.d > 14 || dd < 50 || dd > 130) continue;
      mg1 = Math.round(n360(p1.k - mw())); mg2 = Math.round(n360(p2.k - mw())); break;
    }
    rw1 = n360(mg1 + mw()); rw2 = n360(mg2 + mw()); const obs = kreuzpeilung(o1, rw1, o2, rw2) || ob, bv = kursDist(ok, obs);
    const rwk = Math.round(kd.k), abl = pick([-5, -4, -3, -2, 2, 3, 4, 5]), mgk = n360(rwk - mw() - abl), hh = ri(8, 15), T = m2 => `${String(hh + Math.floor(m2 / 60)).padStart(2, '0')}:${String(m2 % 60).padStart(2, '0')}`;
    const ch = {center: {lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2}, tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 760, noInfo: true}, A = proj(a.lat, a.lon), B = proj(b.lat, b.lon);
    const typB = BUOYS().filter(x => x.typ !== b.typ || x.kenn !== b.kenn), combo = x => `Farbe: ${x.farbe}; Kennung: ${x.kenn}; Toppzeichen: ${x.topp}`;
    const optsB = [...new Set([combo(b), ...typB.map(combo)])].filter(x => x !== combo(b)).sort(() => Math.random() - .5).slice(0, 3).concat(combo(b)).sort(() => Math.random() - .5);
    const scen = `Ein Sportboot läuft in der Kliev-Mündung mit <b>${comma(v)} kn</b> Fahrt über Grund. Um <b>${T(0)} Uhr</b> wird die Tonne <b>${a.id}</b> nahebei passiert. Von dort wird der Kurs auf die Tonne <b>${b.id}</b> abgesetzt.`;
    return {scen, geg: {fahrt: comma(v)}, steps: [
      {text: 'Wie lautet der rwK?', chart: ch, fields: [{k: 'k', l: 'rwK', t: 'deg'}], sol: {k: kd.k}, hint: [], expl: `rwK = ${fmtDeg(kd.k)}.`, soll: c => c.addLine(A, B, 'soll'), lek: 'L2'},
      {text: `Die Ablenkung beträgt <b>${fmtSigned(abl)}</b>, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?`, chart: ch, fields: [{k: 'mg', l: 'MgK', t: 'deg'}], sol: {mg: mgk}, tol: {mg: 1}, geg: {abl: gs(abl)}, folge: R => { const r = R[0] && R[0].res.k; return r && r.ok ? {mg: n360(Math.round(num(r.got)) - mw() - abl)} : null; }, hint: [], expl: `MgK = ${fmtDeg(rwk)} − (${fmtSigned(mw())}) − (${fmtSigned(abl)}) = ${fmtDeg(mgk)}.`, lek: 'L3'},
      {text: `Wie groß ist die Distanz zwischen <b>${a.id}</b> und <b>${b.id}</b>?`, chart: ch, fields: [{k: 'd', l: 'Distanz', t: 'sm'}], sol: {d: kd.d}, hint: [], expl: `Distanz ${comma(kd.d)} sm.`, lek: 'L2'},
      {text: 'In welcher Zeit wird diese Distanz zurückgelegt?', chart: ch, fields: [{k: 't', l: 'Zeit', t: 'min'}], sol: {t: kd.d / v * 60}, folge: R => { const r = R[2] && R[2].res.d; return r && r.ok ? {t: num(r.got) / v * 60} : null; }, hint: [], expl: `${comma(kd.d)} sm : ${comma(v)} kn × 60 = ${Math.round(kd.d / v * 60)} min.`, lek: 'L5'},
      {text: `Auf welcher Position befindet sich das Boot nach Koppelort um <b>${T(t1)} Uhr</b>?`, chart: ch, fields: [{k: 'lat', l: 'Breite', t: 'lat'}, {k: 'lon', l: 'Länge', t: 'lon'}], sol: {lat: ok.lat, lon: ok.lon}, hint: [], expl: `Koppelort ${fmtPos(ok)}.`, soll: c => c.addMark(proj(ok.lat, ok.lon), 'Ok', 'soll'), lek: 'L5'},
      {text: `Um ${T(t1)} Uhr werden mit dem Handpeilkompass (Abl. 0°) gepeilt: <b>${o1.id}</b> MgP = ${fmtDeg(mg1)}, <b>${o2.id}</b> MgP = ${fmtDeg(mg2)}. Die Mw ist der Seekarte zu entnehmen. Wie lauten die rwP?`, chart: ch, fields: [{k: 'r1', l: 'rwP ' + o1.id, t: 'deg'}, {k: 'r2', l: 'rwP ' + o2.id, t: 'deg'}], sol: {r1: rw1, r2: rw2}, tol: {r1: 1, r2: 1}, geg: {pabl: '0'}, peil: true, hint: [], expl: `rwP ${o1.id} = ${fmtDeg(rw1)}, rwP ${o2.id} = ${fmtDeg(rw2)}.`, lek: 'L4'},
      {text: 'Trage die rechtweisenden Peilungen in die Seekarte ein und setze ein Kreuz auf den beobachteten Ort.', chart: ch, fields: [{k: 'pos', l: 'Beobachteter Ort', t: 'pos'}], sol: {pos: obs}, peil: true, hint: [], expl: `Beobachteter Ort ${fmtPos(obs)}.`, soll: c => { const P = proj(obs.lat, obs.lon); c.addLine(proj(o1.lat, o1.lon), P, 'soll'); c.addLine(proj(o2.lat, o2.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); }, lek: 'L4'},
      {text: 'Wie lautet die Besteckversetzung (vom Koppelort zum beobachteten Ort)?', chart: ch, fields: [{k: 'bk', l: 'BV Richtung', t: 'deg'}, {k: 'bd', l: 'BV Distanz', t: 'sm'}], sol: {bk: bv.k, bd: bv.d}, tol: {bk: 10, bd: .2}, hint: [], expl: `BV = ${fmtDeg(bv.k)} – ${comma(bv.d)} sm.`, lek: 'L5'},
      {text: `Beschreibe Farbe, Kennung und Toppzeichen der Tonne <b>${b.id}</b>.`, chart: ch, fields: [{k: 'mc', l: '', t: 'mc', opts: optsB}], sol: {mc: combo(b)}, hint: [], expl: `${b.id}: ${combo(b)}.`, lek: 'L1', hideKenn: true},
    ]};
  },
});
/* ---------- SKS-Stufe (5.11): Versegelungspeilung, Doppelpeilung, Peilung und Abstand, Kartenaufgabe im SKS-Stil ----------
   Grundlage im amtlichen SKS-Katalog: nav-48/49 (Besteckversetzung), nav-50 (Schnittwinkel 30–150°), nav-54/55/103 (Peilung und Abstand),
   nav-44 (FdW/FüG), nav-62 (Peilung beschicken). Handpeilkompass: Abl. 0°. */
const uhr = (hh, m) => `${String(hh + Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
/* MgK aus mwK über die Ablenkungstabelle (die Abl. gilt für den MgK, deshalb kurz iterieren) */
function mgAusMw(mwk) { let mg = mwk; for (let i = 0; i < 6; i++) mg = n360(mwk - ablenkung(mg)); return mg; }
/* Versegelte Standlinie: Standlinie 1 um Kurs/Distanz über Grund verschieben und mit Standlinie 2 schneiden */
function versegelOrt(o, rw1, rw2, k, d) { const o2 = versegeln(o, k, d); return kreuzpeilung(o2, rw1, o, rw2); }
function versegelLage(k, d, from) {
  for (let i = 0; i < 400; i++) {
    const s2 = from ? versegeln(from.a, from.k, from.p0 + d) : seaPoint(), s1 = versegeln(s2, k + 180, d), O = pick(PEIL());
    if (!inSea(s1) || !inSea(s2)) continue;
    const b1 = kursDist(s1, O), b2 = kursDist(s2, O); if (b1.d < 1.5 || b2.d < 1.5 || b1.d > 12 || b2.d > 12) continue;
    const dd = angDiff(b1.k, b2.k); if (dd < 30 || dd > 150) continue;
    const mg1 = Math.round(n360(b1.k - mw())), mg2 = Math.round(n360(b2.k - mw())), rw1 = n360(mg1 + mw()), rw2 = n360(mg2 + mw());
    const pos = versegelOrt(O, rw1, rw2, k, d); if (!pos) continue;
    return {O, s2, mg1, mg2, rw1, rw2, pos};
  }
  return null;
}
const versegelSoll = (L, k, d) => c => { const P = proj(L.pos.lat, L.pos.lon), o2 = versegeln(L.O, k, d); c.addLine(proj(L.O.lat, L.O.lon), P, 'soll'); c.addLine(proj(o2.lat, o2.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); };
Object.assign(GEN, {
  versegelung() {
    let L = null, k, v, t, d; while (!L) { k = ri(0, 35) * 10; v = ri(10, 16) / 2; t = ri(3, 6) * 10; d = v * t / 60; L = versegelLage(k, d); }
    const hh = ri(8, 16);
    return {text: `Du steuerst rwK <b>${fmtDeg(k)}</b> mit <b>${comma(v)} kn</b> Fahrt über Grund. Strom und Wind gibt es nicht. Um <b>${uhr(hh, 0)} Uhr</b> peilst du <b>${L.O.id}</b> mit dem Handpeilkompass (Abl. 0°): MgP = ${fmtDeg(L.mg1)}. Um <b>${uhr(hh, t)} Uhr</b> peilst du <b>${L.O.id}</b> erneut: MgP = ${fmtDeg(L.mg2)}. Die Mw ist der Karte zu entnehmen. Bestimme deinen Standort um ${uhr(hh, t)} Uhr mit einer Versegelungspeilung.`,
      chart: {center: L.pos, hi: [L.O.id], tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 700},
      fields: [{k: 'r1', l: 'rwP 1', t: 'deg'}, {k: 'r2', l: 'rwP 2', t: 'deg'}, {k: 'd', l: 'Versegelte Distanz', t: 'sm'}, {k: 'pos', l: `Standort ${uhr(hh, t)} Uhr`, t: 'pos'}], sol: {r1: L.rw1, r2: L.rw2, d, pos: L.pos}, tol: {r1: 1, r2: 1, d: .1, pos: .4}, geg: {rwk: gd(k), fahrt: comma(v), zeit: String(t), pabl: '0'}, peil: true,
      hint: ['rwP = MgP + Abl. + Mw, hier also jeweils plus 3°.', `Distanz = ${comma(v)} kn × ${t} min / 60.`, 'Erste Standlinie durch das Objekt zeichnen. Dann diese Linie um die Distanz in Kursrichtung parallel verschieben: Dreieck auf den Kurs legen, ab einem Punkt der Linie die Distanz mit dem Zirkel abtragen und dort die Parallele ziehen.', 'Wo die verschobene erste und die zweite Standlinie sich schneiden, ist dein Ort zur Zeit der zweiten Peilung.'],
      expl: `rwP 1 = ${fmtDeg(L.rw1)}, rwP 2 = ${fmtDeg(L.rw2)}. Die erste Standlinie wird um ${comma(d, 2)} sm auf ${fmtDeg(k)} versegelt. Schnittpunkt: ${fmtPos(L.pos)}.`, soll: versegelSoll(L, k, d)};
  },
  doppel() {
    let O, k, v, t, d, s1, s2, side, a;
    for (let i = 0; i < 400; i++) {
      O = pick(PEIL()); side = Math.random() < .5 ? 1 : -1; a = pick([30, 45, 45]); k = ri(0, 35) * 10; v = ri(10, 16) / 2; t = ri(3, 8) * 5; d = v * t / 60;
      s2 = versegeln(O, k + side * 2 * a + 180, d); s1 = versegeln(s2, k + 180, d);
      if (inSea(s1) && inSea(s2) && inSea(versegeln(s1, k, d / 2))) break;
    }
    const sd = side > 0 ? 'Steuerbord' : 'Backbord', rwp = n360(k + side * 2 * a), hh = ri(8, 16), quer = 2 * a === 90;
    return {text: `Du steuerst rwK <b>${fmtDeg(k)}</b> mit <b>${comma(v)} kn</b> Fahrt über Grund, ohne Strom und Wind. Um <b>${uhr(hh, 0)} Uhr</b> siehst du <b>${O.id}</b> genau <b>${a}° an ${sd}</b> voraus (Seitenpeilung). Um <b>${uhr(hh, t)} Uhr</b> steht es <b>${quer ? `querab an ${sd}` : `${2 * a}° an ${sd}`}</b>. Wie weit bist du dann von ${O.id} entfernt, wie lautet die rwP, und wo stehst du?`,
      chart: {center: s2, hi: [O.id], tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 700},
      fields: [{k: 'ab', l: 'Abstand', t: 'sm'}, {k: 'rwp', l: 'rwP', t: 'deg'}, {k: 'pos', l: `Standort ${uhr(hh, t)} Uhr`, t: 'pos'}], sol: {ab: d, rwp, pos: s2}, tol: {ab: .1, rwp: 1}, geg: {rwk: gd(k), fahrt: comma(v), zeit: String(t)},
      hint: ['Verdoppelt sich der Seitenwinkel, ist der Abstand bei der zweiten Peilung so groß wie die gefahrene Distanz (gleichschenkliges Dreieck). 45° und dann querab heißt Vierstrichpeilung.', `Distanz = ${comma(v)} kn × ${t} min / 60.`, `rwP = rwK ${side > 0 ? 'plus' : 'minus'} Seitenwinkel (${sd}).`, 'Vom Objekt die Gegenrichtung der rwP zeichnen und den Abstand mit dem Zirkel abtragen.'],
      expl: `Gefahren: ${comma(v)} kn × ${t} min = ${comma(d, 2)} sm, also Abstand ${comma(d, 2)} sm. rwP = ${fmtDeg(k)} ${side > 0 ? '+' : '−'} ${2 * a}° = ${fmtDeg(rwp)}. Standort ${fmtPos(s2)}.`,
      soll: c => { const P = proj(s2.lat, s2.lon); c.addLine(proj(O.lat, O.lon), P, 'soll'); c.addLine(proj(s1.lat, s1.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); }};
  },
  peilAbstand() {
    let O, s, b; for (let i = 0; i < 300; i++) { O = pick(PEIL()); s = seaPoint(); b = kursDist(s, O); if (b.d >= 1.5 && b.d <= 8) break; }
    const mg = Math.round(n360(b.k - mw())), rw = n360(mg + mw()), D = Math.round(b.d * 10) / 10, pos = versegeln(O, rw + 180, D);
    return {text: `Du peilst <b>${O.id}</b> mit dem Handpeilkompass (Abl. 0°): MgP = ${fmtDeg(mg)}. Gleichzeitig misst das Radar mit dem VRM einen Abstand von <b>${comma(D)} sm</b>. Die Mw ist der Karte zu entnehmen. Wie lautet die rwP, und wo stehst du?`,
      chart: {center: pos, hi: [O.id], tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 600},
      fields: [{k: 'rwp', l: 'rwP', t: 'deg'}, {k: 'pos', l: 'Standort', t: 'pos'}], sol: {rwp: rw, pos}, tol: {rwp: 1}, geg: {pmg: gd(mg), pabl: '0', dist: comma(D)}, peil: true,
      hint: ['rwP = MgP + Abl. + Mw.', 'Die Peilung ist die erste Standlinie, der Abstandskreis um das Objekt die zweite.', 'Abstand am Breitenrand mit dem Zirkel abgreifen und vom Objekt aus auf der Standlinie abtragen.'],
      expl: `rwP = ${fmtDeg(mg)} + 0° + ${fmtSigned(mw())} = ${fmtDeg(rw)}. Auf der Gegenrichtung ${fmtDeg(rw + 180)} ${comma(D)} sm ab ${O.id}: ${fmtPos(pos)}.`,
      soll: c => { const P = proj(pos.lat, pos.lon); c.addLine(proj(O.lat, O.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); }};
  },
  /* Kartenaufgabe im SKS-Stil: Strom, Vorhalten, Wind, Ablenkungstabelle, versegelte Peilung über Grund */
  sksGesamt() {
    let a, b, kd, fdw, c, kdw, fueg, L, side, ab, bw, rwk, mgk, t2, dv, p0;
    for (let i = 0; i < 300; i++) {
      [a, b, kd] = twoBuoys(5, 11); fdw = ri(10, 14) / 2; c = zufallsStrom();
      const u = vec(kd.k, 1), p = [u[1], -u[0]], cv = vec(c.r, c.v), par = cv[0] * u[0] + cv[1] * u[1], perp = cv[0] * p[0] + cv[1] * p[1];
      if (Math.abs(perp) >= fdw * .7) continue;
      const wPar = Math.sqrt(fdw * fdw - perp * perp); kdw = vk([u[0] * wPar - p[0] * perp, u[1] * wPar - p[1] * perp]).k; fueg = wPar + par; if (fueg < 2) continue;
      t2 = pick([20, 30]); dv = fueg * t2 / 60; p0 = rnd(.5, Math.max(.6, kd.d - dv - .5)); if (p0 + dv > kd.d - .3) continue;
      L = versegelLage(kd.k, dv, {a, k: kd.k, p0}); if (L) break;
    }
    if (!L) return GEN.sksGesamt();
    side = Math.random() < .5 ? 1 : -1; ab = ri(3, 8); bw = side * ab; rwk = n360(kdw - bw); const mwk = n360(rwk - mw()); mgk = mgAusMw(mwk);
    const hh = ri(8, 14), tP = Math.round(p0 / fueg * 60), A = proj(a.lat, a.lon), B = proj(b.lat, b.lon);
    const ch = {center: {lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2}, tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 760, noInfo: true};
    const scen = `Eine Yacht läuft mit <b>${comma(fdw)} kn</b> Fahrt durchs Wasser. Um <b>${uhr(hh, 0)} Uhr</b> passiert sie die Tonne <b>${a.id}</b> und will über Grund genau zur Tonne <b>${b.id}</b>. Es ist <b>${stdText(c.std)}</b>, <b>${c.sp ? 'Springzeit' : 'Nippzeit'}</b>; der Gezeitenstrom aus der Stromtabelle (Punkt A) gilt für das ganze Gebiet. Der Wind kommt von <b>${side > 0 ? 'Backbord' : 'Steuerbord'}</b> und verursacht <b>${ab}°</b> Abdrift. Die Ablenkung entnimmst du der Ablenkungstabelle, die Mw der Karte.${ABL_TAB()}`;
    const stromTabHTML = `<table class="ntab"><tr><th>Std</th>${K.strom.std.map(s => `<td>${s === 0 ? 'HW' : (s > 0 ? '+' : '−') + Math.abs(s)}</td>`).join('')}</tr><tr><th>rw°</th>${K.strom.rw.map(r => `<td>${r == null ? '—' : String(r).padStart(3, '0')}</td>`).join('')}</tr><tr><th>kn Sp</th>${K.strom.sp.map(v => `<td>${comma(v)}</td>`).join('')}</tr><tr><th>kn Np</th>${K.strom.np.map(v => `<td>${comma(v)}</td>`).join('')}</tr></table>`;
    return {scen, need: 5, geg: {fahrt: comma(fdw)}, steps: [
      {text: `Welchen KüG musst du von ${a.id} nach ${b.id} laufen?`, chart: ch, fields: [{k: 'kueg', l: 'KüG', t: 'deg'}], sol: {kueg: kd.k}, hint: [], hilfe: ['Bleistiftlinie von Tonne zu Tonne, Kursdreieck anlegen und am Gradbogen ablesen.'], expl: `KüG = ${fmtDeg(kd.k)}.`, soll: cc => cc.addLine(A, B, 'soll'), lek: 'L2'},
      {text: `Lies Richtung und Stärke des Gezeitenstroms ab.${stromTabHTML}`, chart: null, fields: [{k: 'r', l: 'Strom setzt', t: 'deg'}, {k: 'v', l: 'Stärke', t: 'kn'}], sol: {r: c.r, v: c.v}, tol: {r: 0, v: .05}, hint: [], hilfe: ['Spalte nach der Stunde zu Hochwasser, Zeile Sp oder Np. Die Richtung ist die, in die der Strom setzt.'], expl: `Strom setzt ${fmtDeg(c.r)} mit ${comma(c.v)} kn.`, lek: 'L6'},
      {text: 'Welchen KdW musst du steuern, damit du trotz Strom auf dem KüG bleibst, und welche FüG ergibt sich?', chart: ch, fields: [{k: 'kdw', l: 'KdW', t: 'deg'}, {k: 'fueg', l: 'FüG', t: 'kn'}], sol: {kdw, fueg}, tol: {kdw: 3}, hint: [], hilfe: ['Strompfeil für eine Stunde vom Start antragen, um seine Spitze einen Kreis mit der FdW schlagen und mit der Kurslinie schneiden.', 'Strompfeilspitze → Schnittpunkt = KdW. Start → Schnittpunkt = FüG.'], expl: `Vorhalten ergibt KdW ${fmtDeg(kdw)} und FüG ${comma(fueg)} kn.`, lek: 'L6'},
      {text: 'Welchen rwK musst du wegen der Abdrift steuern?', chart: null, fields: [{k: 'rwk', l: 'rwK', t: 'deg'}], sol: {rwk}, tol: {rwk: 1}, folge: R => { const r = R[2] && R[2].res.kdw; return r && r.ok ? {rwk: n360(num(r.got) - bw)} : null; }, hint: [], hilfe: [`Wind von ${side > 0 ? 'Backbord' : 'Steuerbord'}: BW = ${fmtSigned(bw)}. rwK = KdW − BW.`], expl: `BW = ${fmtSigned(bw)}, rwK = ${fmtDeg(kdw)} − (${fmtSigned(bw)}) = ${fmtDeg(rwk)}.`, lek: 'L7'},
      {text: 'Welcher MgK liegt am Steuerkompass an?', chart: null, fields: [{k: 'mg', l: 'MgK', t: 'deg'}], sol: {mg: mgk}, tol: {mg: 2}, folge: R => { const r = R[3] && R[3].res.rwk; return r && r.ok ? {mg: mgAusMw(n360(num(r.got) - mw()))} : null; }, hint: [], hilfe: ['Erst mwK = rwK − Mw. Die Ablenkung gilt für den MgK: Nimm sie für den mwK aus der Tabelle, rechne den MgK und prüf, ob die Ablenkung dazu passt.'], expl: `mwK = ${fmtDeg(rwk)} − (${fmtSigned(mw())}) = ${fmtDeg(mwk)}. Abl. bei MgK ${fmtDeg(mgk)}: ${fmtSigned(Math.round(ablenkung(mgk)))}. MgK = ${fmtDeg(mgk)}.`, lek: 'L3'},
      {text: `Wann erreichst du ${b.id}?`, chart: ch, fields: [{k: 'eta', l: 'Fahrzeit', t: 'min'}], sol: {eta: kd.d / fueg * 60}, tol: {eta: 4}, folge: R => { const r = R[2] && R[2].res.fueg; return r && r.ok ? {eta: kd.d / num(r.got) * 60} : null; }, hint: [], hilfe: ['Distanz am Breitenrand abgreifen. Zeit = Distanz : FüG × 60.'], expl: `${comma(kd.d)} sm : ${comma(fueg)} kn × 60 = ${Math.round(kd.d / fueg * 60)} min, Ankunft etwa ${uhr(hh, Math.round(kd.d / fueg * 60))} Uhr.`, lek: 'L5'},
      {text: `Unterwegs peilst du um <b>${uhr(hh, tP)} Uhr</b> <b>${L.O.id}</b> mit dem Handpeilkompass (Abl. 0°): MgP = ${fmtDeg(L.mg1)}. Um <b>${uhr(hh, tP + t2)} Uhr</b> peilst du ${L.O.id} erneut: MgP = ${fmtDeg(L.mg2)}. Bestimme deinen Ort um ${uhr(hh, tP + t2)} Uhr mit einer Versegelungspeilung (versegelt wird über Grund).`, chart: {...ch, hi: [L.O.id]}, fields: [{k: 'pos', l: 'Beobachteter Ort', t: 'pos'}], sol: {pos: L.pos}, tol: {pos: .4}, geg: {pabl: '0'}, peil: true, hint: [], hilfe: ['Beide Peilungen: plus 3° Mw.', `Erste Standlinie um FüG × ${t2} min auf dem KüG versegeln, mit der zweiten schneiden.`], expl: `Versegelt ${comma(dv, 2)} sm auf ${fmtDeg(kd.k)}. Beobachteter Ort ${fmtPos(L.pos)}.`, soll: versegelSoll(L, kd.k, dv), lek: 'L10'},
    ]};
  },
});
NAV.GEN = GEN;
/* Bewertung: Toleranzen laut freigegebenem Konzept (Kurs/Peilung ±2°, Distanz ±0,2 sm, Position ±0,3', Zeit ±2 min) */
const TOL = {deg: 2, sdeg: 0, sm: .2, kn: .2, lat: .3, lon: .3, min: 2, m: .05, pos: .3};
function grade(task, vals, ctl) {
  const res = {};
  task.fields.forEach(f => {
    const tol = (task.tol && task.tol[f.k] != null) ? task.tol[f.k] : TOL[f.t], sol = task.sol[f.k];
    let ok = false, got = vals[f.k];
    if (f.t === 'pos') { const m = ctl && ctl.st.marks.filter(x => !x.c).slice(-1)[0]; if (m) { const ll = unproj(m.x, m.y), d = kursDist(ll, sol).d; ok = d <= tol; got = fmtPos(ll); } else got = 'kein Kreuz'; }
    else if (f.t === 'mc') ok = got === sol;
    else if (f.t === 'deg') ok = !isNaN(num(got)) && angDiff(num(got), sol) <= tol;
    else ok = !isNaN(num(got)) && Math.abs(num(got) - sol) <= tol + 1e-9;
    res[f.k] = {ok, got};
  });
  return res;
}
const solText = (f, v) => f.t === 'deg' ? fmtDeg(v) : f.t === 'sdeg' ? fmtSigned(v) : f.t === 'sm' ? comma(v) + ' sm' : f.t === 'kn' ? comma(v) + ' kn' : f.t === 'lat' ? fmtLat(v) : f.t === 'lon' ? fmtLon(v) : f.t === 'min' ? Math.round(v) + ' min' : f.t === 'm' ? comma(v) + ' m' : f.t === 'pos' ? fmtPos(v) : String(v);
const EINHEIT = {deg: '°', sdeg: '°', sm: 'sm', kn: 'kn', min: 'min', m: 'm', lat: "' N", lon: "' E"};
function fieldHTML(f) {
  if (f.t === 'mc') return `<div class="menu" data-mc="${f.k}">${f.opts.map(o => `<button class="menuitem" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  if (f.t === 'pos') return `<p class="small muted" style="margin:4px 0">${NAV.linkTerms(esc(f.l))}: setze mit dem Werkzeug ✕ ein Kreuz in die Karte.</p>`;
  const pre = f.t === 'lat' ? '55°' : f.t === 'lon' ? '006°' : '', ph = f.t === 'lat' || f.t === 'lon' ? 'Min.' : f.t === 'deg' ? '074' : f.t === 'sdeg' ? '+3' : '';
  return `<label class="nfield"><span class="nfl">${NAV.linkTerms(esc(f.l))}</span>${pre ? `<span class="nunit">${pre}</span>` : ''}<input data-k="${f.k}" data-kp="${f.t}" inputmode="none" placeholder="${ph}" autocomplete="off"><span class="nunit">${EINHEIT[f.t] || ''}</span></label>`;
}
const fmtGot = (f, g) => { const v = String(g).trim(); return f.t === 'lat' ? `55° ${v}'` : f.t === 'lon' ? `006° ${v}'` : EINHEIT[f.t] === '°' ? v + '°' : v + ' ' + (EINHEIT[f.t] || ''); };
/* Drei Hilfe-Stufen aus der Aufgabe: Tipp (erster Hinweis), Rechenweg (weitere Hinweise oder die Formel der Lektion), Lösung (Werte und Erklärung) */
const TIPP_TYP = {deg: 'Lies den Winkel genau ab oder rechne Schritt für Schritt. Gib ihn dreistellig an, z. B. 074.', sm: 'Distanzen misst du am Breitenrand: 1 Minute = 1 Seemeile.', kn: 'Fahrt ist Strecke pro Stunde.', min: 'Zeit = Distanz : Fahrt × 60.', lat: 'Die Breite steht am linken oder rechten Kartenrand.', lon: 'Die Länge steht am oberen oder unteren Kartenrand.', pos: 'Setz mit dem Werkzeug ✕ ein Kreuz in die Karte.', mc: 'Schau dir Farbe, Form und Kennung genau an. Ein Tipp auf das Symbol in der Karte zeigt Einzelheiten.', m: 'Tiefen stehen in Metern unter Kartennull.', sdeg: 'Östlich ist plus, westlich ist minus.'};
function hilfeStufen(task) {
  const h = (task.hint && task.hint.length ? task.hint : task.hilfe && task.hilfe.length ? task.hilfe : GESAMT_HINTS[task.lek] || []).map(esc);
  const tipp = h[0] || TIPP_TYP[task.fields[0].t] || 'Lies die Aufgabe noch einmal genau: Was ist gegeben, was ist gesucht?';
  const weg = h.length > 1 ? h.slice(1).join(' ') : (GESAMT_HINTS[task.lek] || []).map(esc).join(' ') || (TIPP_TYP[task.fields[0].t] && h.length ? TIPP_TYP[task.fields[0].t] : 'Schreib dir die gegebenen Werte ins Rechenblatt und rechne Schritt für Schritt.');
  const loes = task.fields.map(f => `${esc(f.l || 'Antwort')}: <b>${esc(solText(f, task.sol[f.k]))}</b>`).join(' · ') + '. ' + esc(task.expl || '');
  return [{t: 'Tipp', html: tipp}, {t: 'Rechenweg', html: weg}, {t: 'Lösung', html: loes, loes: true}];
}
/* Eigene Zahlentasten statt Handy-Tastatur (die würde die Karte verdecken). Sie bleiben offen, bis man ✓ tippt. E heißt plus, W heißt minus. */
const TASTEN = `<div class="nkeys hidden" id="nkeys"><div class="nkrow">${'1234567890'.split('').map(d => `<button data-key="${d}">${d}</button>`).join('')}</div>
  <div class="nkrow b"><button data-key="pm" aria-label="Vorzeichen">±</button><button data-key="E" aria-label="Ost, plus">E</button><button data-key="W" aria-label="West, minus">W</button><button data-key="," aria-label="Komma">,</button><button data-key="bs" aria-label="Löschen">⌫</button><button data-key="ok" class="nkok">✓ fertig</button></div></div>`;
function zahlenTasten(root) {
  const kp = root.querySelector('#nkeys'); let cur = null;
  const auf = inp => { cur = inp; const t = inp.dataset.kp; kp.classList.remove('hidden'); root.classList.remove('sheetzu');
    kp.querySelectorAll('[data-key]').forEach(b => { const k = b.dataset.key; b.disabled = ['pm', 'E', 'W'].includes(k) ? t !== 'sdeg' : k === ',' ? ['deg', 'sdeg', 'min'].includes(t) : false; });
    root.querySelectorAll('input.kpon').forEach(x => x.classList.remove('kpon')); inp.classList.add('kpon'); };
  const zu = () => { cur = null; kp.classList.add('hidden'); root.querySelectorAll('input.kpon').forEach(x => x.classList.remove('kpon')); };
  root.addEventListener('focusin', e => { const i = e.target; if (i.matches && i.matches('input[data-kp]') && !i.disabled) auf(i); });
  kp.addEventListener('mousedown', e => e.preventDefault());
  kp.addEventListener('click', e => {
    const b = e.target.closest('[data-key]'); if (!b || !cur) return; const k = b.dataset.key; let v = cur.value;
    if (k === 'ok') { const alle = [...root.querySelectorAll('.ntpane:not([hidden]) input[data-kp]:not(:disabled)')], n = alle.slice(alle.indexOf(cur) + 1).find(x => !x.value); if (n) n.focus(); else { cur.blur(); zu(); } return; }
    if (k === 'bs') v = v.slice(0, -1);
    else if (k === 'pm') v = v.startsWith('−') ? '+' + v.slice(1) : v.startsWith('+') ? '−' + v.slice(1) : '−' + v;
    else if (k === 'E' || k === 'W') v = (k === 'E' ? '+' : '−') + v.replace(/^[+−-]/, '');
    else if (k === ',') { if (!v.includes(',')) v += /\d$/.test(v) ? ',' : '0,'; }
    else v += k;
    cur.value = v; cur.dispatchEvent(new Event('input', {bubbles: true}));
  });
  return {zu, aktiv: () => cur};
}
/* Rechenblatt im Arbeitsblatt: Kurs umwandeln wie auf Papier, Weg-Zeit-Fahrt und Notiz.
   Gegebene Werte und die eigenen Ergebnisse früherer Teilaufgaben stehen schon drin (blatt.v Werte, blatt.q Herkunft). */
const BLATT_KEY = {rwK: 'rwk', MgK: 'mgk', mwK: 'mwk', Mw: 'mw', 'Abl.': 'abl', BW: 'bw', KdW: 'kdw', rwP: 'prw', Distanz: 'dist', 'Versegelte Distanz': 'dist', Abstand: 'dist', Zeit: 'zeit', Fahrzeit: 'zeit', FüG: 'fahrt'};
/* gegebene Werte so, wie man sie eintippt: 074 und +3 */
const gd = k => fmtDeg(k).slice(0, 3), gs = v => fmtSigned(v).replace(/[°±]/g, '');
const neuesBlatt = () => ({v: {}, q: {}});
const fuelleGeg = (b, geg) => Object.entries(geg || {}).forEach(([k, v]) => { if (!b.v[k]) { b.v[k] = v; b.q[k] = 'gegeben'; } });
function rechenblattHTML(b, peil) {
  const z = (k, l, op, t) => `<label class="nzeile"><span class="nop">${op}</span><span class="nlab">${l}</span><input data-sv="${k}" data-kp="${t}" inputmode="none" value="${esc(b.v[k] || '')}" autocomplete="off"><span class="nunit">${EINHEIT[t]}</span><small class="nquelle">${esc(b.q[k] || '')}</small></label>`;
  return `<p class="small muted nrhint">Vom Kompass zur Karte plus, von der Karte zum Kompass minus. Ost +, West −.</p>
    ${peil ? `<div class="nschema">${z('pmg', 'MgP', '', 'deg')}${z('pabl', 'Abl.', '+', 'sdeg')}${z('pmwp', 'mwP', '=', 'deg')}${z('pmw', 'Mw', '+', 'sdeg')}${z('prw', 'rwP', '=', 'deg')}</div>` : ''}
    <div class="nschema">${z('mgk', 'MgK', '', 'deg')}${z('abl', 'Abl.', '+', 'sdeg')}${z('mwk', 'mwK', '=', 'deg')}${z('mw', 'Mw', '+', 'sdeg')}${z('rwk', 'rwK', '=', 'deg')}${z('bw', 'BW', '+', 'sdeg')}${z('kdw', 'KdW', '=', 'deg')}</div>
    <p class="small muted nrhint">Distanz = Fahrt × Zeit : 60</p>
    <div class="nschema">${z('dist', 'Distanz', '', 'sm')}${z('fahrt', 'Fahrt', '', 'kn')}${z('zeit', 'Zeit', '', 'min')}</div>
    <label class="nnotiz">Notiz<input type="text" data-sv="notiz" value="${esc(b.v.notiz || '')}" autocomplete="off"></label>`;
}
/* Eine Aufgabe zeigen: oben die Aufgabe, in der Mitte die Karte, unten das Arbeitsblatt mit Antwort, Rechenblatt und Hilfe.
   opts: {title, mode:'guided'|'free'|'master'|'exam', meta(), scen, lageOffen, bisher[[Name, Wert]], blatt, keep, onResult(ok,res,task,used,ctl), next, nextLabel, back} */
NAV.task = function (task, opts) {
  const guided = opts.mode === 'guided', exam = opts.mode === 'exam', hilfeErlaubt = guided || opts.mode === 'free'; NAV.lastTask = task;
  const blatt = opts.blatt || neuesBlatt(); fuelleGeg(blatt, task.geg);
  const TAB = /<table[\s\S]*?<\/table>/g, tabellen = (task.text.match(TAB) || []).join(''), scen = opts.scen || '';
  const bisher = (opts.bisher || []).map(([l, v]) => `<span>${esc(l)} <b>${esc(v)}</b></span>`).join('');
  gameShell(opts.title || 'Übung', `<div class="nt2${task.chart ? '' : ' nochart'}">
    <div class="ntbar"><div class="ntmeta"><span id="xmeta">${opts.meta ? opts.meta() : ''}</span>${scen ? '<button class="btn small ghost" id="xlage">📜 Lage</button>' : ''}${task.chart && tabellen ? '<button class="btn small ghost" id="xtab">📋 Tabelle</button>' : ''}</div>
      ${task.chart ? `<div class="ntq" id="xtask">${NAV.linkTerms(task.text.replace(TAB, ''))}</div>` : ''}</div>
    <div class="ntmid">${task.chart ? '<div id="nchartbox"></div>' : `<div class="card ntext" id="xtask">${NAV.linkTerms(task.text)}</div>`}<div class="ntover hidden" id="xover"></div></div>
    <div class="ntsheet">
      <div class="nttabs"><button data-tab="antwort" aria-selected="true">✍️ Antwort</button><button data-tab="rechen" aria-selected="false">🧮 Rechenblatt</button>${hilfeErlaubt ? '<button data-tab="hilfe" aria-selected="false">💡 Hilfe</button>' : ''}</div>
      <div class="ntsc">
        <div class="ntpane" data-pane="antwort" id="xform">${bisher ? `<p class="nbisher">Bisher: ${bisher}</p>` : ''}<div id="xtipp"></div>${task.fields.map(fieldHTML).join('')}<div class="nmess" id="xmess"></div>
          <div class="row" id="xbtns" style="margin-top:8px"><button class="btn lamp wide" id="xcheck">${exam ? 'Weiter' : 'Prüfen'}</button></div><div id="xfb"></div></div>
        <div class="ntpane" data-pane="rechen" hidden>${rechenblattHTML(blatt, task.peil)}</div>
        ${hilfeErlaubt ? '<div class="ntpane" data-pane="hilfe" hidden><div id="xhints"></div><button class="btn ghost wide" id="xhint" style="margin-top:8px">💡 Tipp</button></div>' : ''}
      </div>${TASTEN}</div></div>`);
  NAV.bindTerms(app);
  if (opts.back) $('#gback').onclick = opts.back;
  const root = app.querySelector('.nt2'), tasten = zahlenTasten(root);
  /* Höhe genau bis zum unteren Bildschirmrand, damit nichts scrollt */
  const passe = () => { if (!root.isConnected) return removeEventListener('resize', passe); root.style.height = Math.max(430, innerHeight - root.getBoundingClientRect().top - scrollY) + 'px'; };
  passe(); addEventListener('resize', passe);
  /* Reiter; der gewählte Reiter klappt das Arbeitsblatt beim zweiten Tippen ein und aus */
  const reiter = name => { root.classList.remove('sheetzu'); root.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === name)); root.querySelectorAll('.ntpane').forEach(p => { p.hidden = p.dataset.pane !== name; }); const a = tasten.aktiv(); if (a && a.closest('.ntpane').hidden) tasten.zu(); };
  root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { AUD.click(); if (b.getAttribute('aria-selected') === 'true') { root.classList.toggle('sheetzu'); if (root.classList.contains('sheetzu')) tasten.zu(); } else reiter(b.dataset.tab); });
  /* Lage und Tabellen liegen bei Bedarf über der Karte */
  const over = $('#xover'); let overWas = '';
  const zeigeOver = (was, html) => { if (overWas === was) { over.classList.add('hidden'); overWas = ''; return; } overWas = was; over.innerHTML = `<button class="btn small ghost nover-x" id="xoverx">✕ Schließen</button>${html}`; NAV.bindTerms(over); over.classList.remove('hidden'); $('#xoverx').onclick = () => { over.classList.add('hidden'); overWas = ''; }; };
  if ($('#xlage')) $('#xlage').onclick = () => zeigeOver('lage', NAV.linkTerms(scen));
  if ($('#xtab')) $('#xtab').onclick = () => zeigeOver('tab', tabellen);
  if (scen && opts.lageOffen) zeigeOver('lage', NAV.linkTerms(scen));
  let ctl = null, used = false;
  /* Messwerte von Dreieck und Zirkel mit 📌 ins Feld übernehmen (nur in den Übungen) */
  const pin = (typ, v) => {
    const passt = i => i.dataset.kp === typ, a = tasten.aktiv(), ant = [...root.querySelectorAll('[data-pane="antwort"] input[data-kp]:not(:disabled)')].filter(passt), rb = [...root.querySelectorAll('[data-pane="rechen"] input[data-kp]')].filter(passt);
    const ziel = a && passt(a) ? a : ant.find(i => !i.value) || ant[0] || rb.find(i => !i.value) || rb[0]; if (!ziel) return toast('Hier gibt es kein passendes Feld.');
    ziel.value = v; ziel.dispatchEvent(new Event('input', {bubbles: true})); used = true; const pane = ziel.closest('.ntpane'); if (pane.hidden) reiter(pane.dataset.pane);
    ziel.classList.add('npinned'); setTimeout(() => ziel.classList.remove('npinned'), 900);
  };
  const messChips = () => {
    const el = $('#xmess'); if (!el || !ctl) return; const d = ctl.dreieckDeg(), z = ctl.zirkelSm(), b = [];
    if (d != null) b.push(`<button class="nchip" data-pin="deg" data-v="${fmtDeg(d).slice(0, 3)}">◺ Dreieck zeigt ${fmtDeg(d)} · 📌 übernehmen</button>`);
    if (z != null) b.push(`<button class="nchip" data-pin="sm" data-v="${comma(z)}">⋀ Zirkel misst ${comma(z)} sm · 📌 übernehmen</button>`);
    el.innerHTML = b.join(''); el.querySelectorAll('[data-pin]').forEach(x => x.onclick = () => pin(x.dataset.pin, x.dataset.v));
  };
  if (task.chart) {
    const ch = task.chart;
    ctl = NAV.mountChart($('#nchartbox'), {center: ch.center, width: ch.width || 520, tools: ch.tools, tool: 'hand', hilfen: hilfeErlaubt, onTap: t => { if (!ch.noInfo && !exam && t.obj) toast(t.obj.id + (t.obj.kenn ? ' · ' + t.obj.kenn : '')); }});
    if (ch.hi) ctl.highlight(ch.hi);
    if (ch.ring) { const p = proj(ch.ring.lat, ch.ring.lon); ctl.svg.querySelector('#nhi').insertAdjacentHTML('beforeend', `<circle cx="${p.x}" cy="${p.y}" r="18" class="nhi"/>`); }
    if (ch.hideKenn) ctl.svg.querySelectorAll('.nlab.k').forEach(e => e.remove());
    NAV.lastCtl = ctl;
    if (opts.keep) ctl.uebernehmen(opts.keep);
    if (hilfeErlaubt) { ctl.on('dreieck', messChips); ctl.on('zirkel', messChips); messChips(); }
  }
  root.querySelectorAll('[data-sv]').forEach(i => i.addEventListener('input', () => { const k = i.dataset.sv; blatt.v[k] = i.value; if (blatt.q[k]) { blatt.q[k] = ''; const q = i.parentNode.querySelector('.nquelle'); if (q) q.textContent = ''; } }));
  const vals = {};
  root.querySelectorAll('[data-mc]').forEach(g => g.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { vals[g.dataset.mc] = b.dataset.v; g.querySelectorAll('[data-v]').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  /* Hilfe in drei Stufen: Tipp, Rechenweg, Lösung. Sie ist nie leer; wer Hilfe nimmt, bekommt dafür keinen Meisterschaftspunkt.
     Geführt steht der Tipp zusätzlich gleich über den Antwortfeldern. */
  const stufen = hilfeStufen(task), knopf = ['💡 Tipp', '🧮 Rechenweg', '✅ Lösung zeigen'];
  let hints = 0;
  const zeigeStufe = () => {
    if (hints >= stufen.length) return;
    used = true; const h = stufen[hints], html = `<p class="small nhint" style="margin:6px 0 0"><b>${h.t}:</b> ${NAV.linkTerms(h.html)}</p>`;
    (guided && hints === 0 ? [$('#xtipp'), $('#xhints')] : [$('#xhints')]).forEach(z => { z.insertAdjacentHTML('beforeend', html); NAV.bindTerms(z); });
    if (h.loes && ctl && task.soll) task.soll(ctl);
    hints++; const b = $('#xhint'); if (b) { if (hints >= stufen.length) { b.disabled = true; b.textContent = 'Mehr Hilfe gibt es nicht'; } else b.textContent = knopf[hints]; }
  };
  if ($('#xhint')) $('#xhint').onclick = zeigeStufe;
  if (guided) zeigeStufe();
  $('#xcheck').onclick = () => {
    root.querySelectorAll('[data-pane="antwort"] [data-k]').forEach(i => { vals[i.dataset.k] = i.value; });
    const res = grade(task, vals, ctl), ok = task.fields.every(f => res[f.k].ok);
    tasten.zu();
    if (exam) return opts.onResult(ok, res, task, false, ctl);
    AUD.sfx(ok ? 'richtig' : 'falsch', {vol: ok ? .5 : .35});
    reiter('antwort'); root.classList.add('fbon');
    root.querySelectorAll('[data-pane="antwort"] input, [data-mc] button').forEach(i => { i.disabled = true; });
    $('#xbtns').remove(); $('#xmess').innerHTML = '';
    $('#xfb').innerHTML = `<div class="fb" style="margin-top:8px">${task.fields.map(f => `<p style="margin:2px 0">${res[f.k].ok ? '<span class="nok">✓</span>' : '<span class="nno">✗</span>'} ${esc(f.l || 'Antwort')}: ${res[f.k].ok ? 'richtig' : `deine ${esc(String(res[f.k].got || '–'))}, richtig ${esc(solText(f, task.sol[f.k]))}`}</p>`).join('')}
      <p class="small" style="margin:8px 0 0">${NAV.linkTerms(esc(task.expl))}</p>${task.soll ? '<p class="small muted" style="margin:4px 0 0">Die Lösung ist in der Karte gestrichelt eingezeichnet.</p>' : ''}<button class="btn wide lamp" id="xnext" style="margin-top:10px">${opts.nextLabel || 'Nächste Aufgabe'}</button></div>`;
    NAV.bindTerms($('#xfb'));
    if (ctl && task.soll) task.soll(ctl);
    if (opts.onResult) opts.onResult(ok, res, task, used, ctl);
    $('#xnext').onclick = () => opts.next && opts.next();
    $('#xfb').scrollIntoView({block: 'nearest'});
  };
  return ctl;
};
const GESAMT_HINTS = {
  L1: ['Farbe und Toppzeichen siehst du am Kartensymbol, die Kennung steht daneben.'],
  L2: ['Linie von Tonne zu Tonne ziehen, Dreieck anlegen, an der roten Meridianlinie ablesen. Distanz mit dem Zirkel am Breitenrand.'],
  L3: ['MgK = rwK − Mw − Abl. Mw aus der Kompassrose: 3° E.'],
  L4: ['rwP = MgP + Abl. + Mw. Dreieck am Objekt anlegen, Linie ziehen, Kreuz auf den Schnittpunkt.'],
  L5: ['Zeit = Distanz : Fahrt × 60. Koppelort: Fahrt × Zeit auf der Kurslinie abtragen. BV: vom Koppelort zum beobachteten Ort.'],
};
/* Mehrteilige Aufgabe (Gesamtaufgabe, Prüfung): Schritte nacheinander, Zeichnungen bleiben stehen */
NAV.multi = function (mt, opts) {
  let i = 0, pts = 0, keep = null, fin = false; const results = [], blatt = neuesBlatt(), bisher = [];
  fuelleGeg(blatt, mt.geg);
  const end = () => { if (fin) return; fin = true; opts.done(pts, results, mt); };
  const step = () => {
    if (fin) return; if (i >= mt.steps.length) return end();
    const s = mt.steps[i], t = {...s, chart: s.chart ? {...s.chart, hideKenn: s.hideKenn} : null};
    /* 5.11: Folgefehler. Lag ein früherer Wert innerhalb der Toleranz, wird mit dem eigenen Wert weitergerechnet (sonst zählen 2° Ablesefehler doppelt) */
    if (s.folge) { const f = s.folge(results); if (f) t.sol = {...s.sol, ...f}; }
    const meta = () => `Teil ${i + 1} von ${mt.steps.length}${opts.mode !== 'exam' ? ` · ${pts} Punkt${pts === 1 ? '' : 'e'}` : ''}${opts.extraHead && opts.extraHead() ? ' · ' + opts.extraHead() : ''}`;
    NAV.task(t, {title: opts.title, mode: opts.mode, meta, scen: mt.scen, lageOffen: i === 0, bisher: bisher.slice(), blatt, back: opts.back, keep, nextLabel: i < mt.steps.length - 1 ? 'Nächste Teilaufgabe' : 'Auswertung',
      onResult: (ok, res, task, used, c) => {
        pts += ok ? 1 : 0; results.push({ok, step: s, res});
        /* eigene Ergebnisse wandern mit: oben als „Bisher“, im Rechenblatt in die passende Zeile */
        s.fields.forEach(f => { const g = res[f.k] && res[f.k].got; if (f.t === 'mc' || f.t === 'pos' || g == null || String(g).trim() === '') return; bisher.push([f.l, fmtGot(f, g)]); const k = BLATT_KEY[f.l]; if (k) { blatt.v[k] = String(g).trim(); blatt.q[k] = 'aus Teil ' + (i + 1); } });
        if (c) keep = c.zustand();
        if (opts.mode === 'exam') { i++; step(); }
      },
      next: () => { i++; step(); }});
  };
  step();
  return {finish: end};
};
/* ---------- Prüfungsmodus (5.5e): Gesamtaufgabe ohne Hilfen, 25 Minuten, Auswertung mit Fehleranalyse ---------- */
const EXAM_MIN = 25;
NAV.exam = function (o = {}) {
  const mt = GEN.gesamt(); let left = EXAM_MIN * 60; clearInterval(NAV._timer);
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  AUD.sfx('glocke', {vol: .6}); LOG.add('navi', 'Prüfungsmodus Start');
  const run = NAV.multi(mt, {title: 'Prüfung Navigation', mode: 'exam', back: () => { if (confirm('Prüfung abbrechen? Sie wird nicht gewertet.')) { clearInterval(NAV._timer); o.inExam ? setTab('cabin') : NAV.hub(); } },
    extraHead: () => `<span id="xtime">⏱ ${fmt(left)}</span>`,
    done: (pts, results) => {
      clearInterval(NAV._timer);
      const n = S_(); n.pruef.push({day: today(), pts}); n.pruef = n.pruef.slice(-30); save(); recordScore('nav', 0);
      if (o.onDone) return o.onDone(pts);
      const missing = mt.steps.length - results.length, wrongLek = [...new Set(results.filter(r => !r.ok).map(r => r.step.lek).concat(missing ? [mt.steps[results.length].lek] : []))];
      const ok = pts >= 7; AUD.sfx(ok ? 'richtig' : 'enttaeuschung', {vol: .5});
      gameShell('Prüfung Navigation', `<div class="card"><h2 style="margin:0" class="${ok ? 'pass' : 'fail'}">${ok ? 'Bestanden' : 'Nicht bestanden'}: ${pts} von 9 Punkten</h2><p class="muted" style="margin:4px 0 0">Bestanden ab 7 Punkten.${missing ? ` Die Zeit war um, ${missing} Teilaufgabe${missing > 1 ? 'n' : ''} fehlte${missing > 1 ? 'n' : ''}.` : ''}</p></div>
        <h3 style="margin:14px 0 6px">Fehleranalyse</h3>
        ${mt.steps.map((s, k) => { const r = results[k]; return `<div class="card small"><b>${r ? (r.ok ? '<span class="nok">✓</span>' : '<span class="nno">✗</span>') : '<span class="nno">–</span>'} ${k + 1}.</b> ${NAV.linkTerms(s.text.replace(/<table[\s\S]*<\/table>/, ''))}<br><span class="muted">Lösung: ${NAV.linkTerms(esc(s.expl))}</span>${r && !r.ok ? `<br><span class="muted">Deine Antwort: ${s.fields.map(f => esc(String(r.res[f.k].got || '–'))).join(', ')}</span>` : ''}</div>`; }).join('')}
        ${wrongLek.length ? `<div class="card"><b>Wiederhole am besten:</b><div class="row" style="margin-top:6px;flex-wrap:wrap">${wrongLek.map(id => { const l = lekOf(id); return l ? `<button class="btn small ghost" data-wl="${id}">${esc(l.t)}</button>` : ''; }).join('')}</div></div>` : ''}
        <div class="row"><button class="btn lamp" id="again">Neue Prüfung</button><button class="btn ghost" id="tohub">Zur Navigationsschule</button></div>`);
      NAV.bindTerms(app);
      $('#gback').onclick = () => NAV.hub(); $('#again').onclick = () => NAV.exam(o); $('#tohub').onclick = () => NAV.hub();
      app.querySelectorAll('[data-wl]').forEach(b => b.onclick = () => NAV.lesson(b.dataset.wl));
    }});
  NAV._timer = setInterval(() => {
    left--; const e = document.getElementById('xtime'); if (e) { e.textContent = '⏱ ' + fmt(left); e.style.color = left < 300 ? 'var(--bb, #c2473b)' : ''; }
    if (left <= 0) { clearInterval(NAV._timer); toast('Die Zeit ist um.'); run.finish(); }
  }, 1000);
};
/* ---------- Lernpfad ---------- */
const lekOf = id => (NV.lektionen || []).find(l => l.id === id);
const lekState = id => { const n = S_(), x = n.lek[id] = n.lek[id] || {serie: 0, sterne: 0, n: 0}; /* ältere Spielstände: wer schon Aufgaben gelöst hat, hat die ersten Schritte erledigt */ ['erkl', 'bsp', 'gef', 'frei'].forEach(k => { if (x[k] == null) x[k] = x.n ? 1 : 0; }); return x; };
NAV.path = function () {
  const L = NV.lektionen || [], fertig = L.filter(l => lekState(l.id).sterne).length;
  const naechste = L.find(l => !lekState(l.id).sterne);
  gameShell('Lernpfad', `<p class="small muted" style="margin:6px 0 10px">Jede Lektion hat fünf Schritte: <b>Erklärung, Beispiel, geführte Übung, freie Übung, Meisterschaft</b>. Drei richtige Aufgaben ohne Hilfe in Folge geben einen Stern. ${fertig} von ${L.length} Lektionen mit Stern.</p>
    <div class="menu">${L.map(l => { const s = lekState(l.id), n = SCHRITTE.filter(x => x.fertig(s)).length;
      return `<button class="menuitem${l === naechste ? ' nnext' : ''}" data-l="${l.id}"><b>${s.sterne ? '⭐ ' : l === naechste ? '➜ ' : ''}${l.id === 'L0' ? '0' : l.id.slice(1)}. ${esc(l.t)}</b><span class="small muted">${esc(l.d)} · ${n} von 5 Schritten</span></button>`; }).join('')}</div>`);
  $('#gback').onclick = () => NAV.hub();
  app.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { AUD.click(); NAV.lesson(b.dataset.l); });
};
/* Die fünf Schritte jeder Lektion; erledigt wird in S.navi.lek[id] gemerkt (erkl, bsp, gef, frei, sterne; Standard 0) */
const SCHRITTE = [
  {k: 'erkl', t: 'Erklärung', d: 'Die Crew erklärt, die Begriffe mit Bild', fertig: s => s.erkl},
  {k: 'bsp', t: 'Beispiel', d: 'Eine Aufgabe, Schritt für Schritt vorgerechnet', fertig: s => s.bsp},
  {k: 'guided', t: 'Geführte Übung', d: 'Mit Tipp, Rechenweg und Lösung auf Wunsch', fertig: s => s.gef},
  {k: 'free', t: 'Freie Übung', d: 'Zufallsaufgaben, Hilfe nur wenn nötig', fertig: s => s.frei},
  {k: 'master', t: 'Meisterschaft', d: 'Ohne Hilfe, drei richtig in Folge', fertig: s => s.sterne}
];
const begriffKarte = id => { const f = (NV.fibel || []).find(x => x.id === id); return f ? `<div class="card nbeg"><b>${esc(f.t)}</b>${anim(f.a)}<p class="small" style="margin:4px 0">${esc(f.e)}</p><p class="small" style="margin:0">💡 ${esc(f.m)}</p></div>` : ''; };
NAV.lesson = function (id) {
  const l = lekOf(id), s = lekState(id), next = SCHRITTE.find(x => !x.fertig(s));
  gameShell(l.t, `<div class="card"><h2 style="margin:0 0 4px">${l.id === 'L0' ? '' : 'Lektion ' + l.id.slice(1) + ': '}${esc(l.t)}</h2><p class="small muted" style="margin:0">${esc(l.d)}</p></div>
    <ol class="nschritte">${SCHRITTE.map((x, i) => `<li><button class="menuitem${x === next ? ' nnext' : ''}" data-m="${x.k}"><span class="nnr">${x.fertig(s) ? '✓' : i + 1}</span><span><b>${x.t}${x.k === 'master' ? (s.sterne ? ' ⭐' : ` (${s.serie} von 3)`) : ''}</b><small>${x.d}</small></span></button></li>`).join('')}</ol>`);
  $('#gback').onclick = () => { VOX.stop(); NAV.path(); };
  app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { AUD.click(); VOX.stop(); const m = b.dataset.m; if (m === 'erkl') NAV.erklaerung(id); else if (m === 'bsp') NAV.beispiel(id); else NAV.exercise(id, m); });
};
/* Schritt 1: Erklärung der Crew (vorgelesen) und die Begriffe der Lektion mit kleiner Animation */
NAV.erklaerung = function (id) {
  const l = lekOf(id), s = lekState(id);
  gameShell(l.t + ': Erklärung', `<div class="card">${l.crew.map(c => `<p style="margin:6px 0"><b>${esc(nameOf(c.s))}:</b> ${NAV.linkTerms(esc(c.t))}</p>`).join('')}<button class="btn small ghost" id="lread">▶ Nochmal vorlesen</button></div>
    ${l.seezeichen ? `<div class="card"><b>Tonnen und Feuer in der Karte</b><p class="small" style="margin:4px 0 8px">Was die Farben, Toppzeichen und Kennungen bedeuten, lernst du im Grundkurs Seezeichen, mit den Bildern aus der Prüfung.</p><button class="btn small" id="lsz">Grundkurs Seezeichen öffnen</button></div>` : ''}
    ${(l.begriffe || []).map(begriffKarte).join('')}
    <button class="btn lamp wide" id="lok" style="margin:10px 0 24px">Verstanden, weiter zum Beispiel</button>`);
  NAV.bindTerms(app);
  const lesen = () => { AUD.unlock(); VOX.stop(); VOX.lines(l.crew.map(c => ({cid: cid(c.s), t: c.t})), 'fixed'); };
  $('#gback').onclick = () => { VOX.stop(); NAV.lesson(id); };
  $('#lread').onclick = lesen; lesen();
  (l.begriffe || []).forEach(b => { S_().fibel[b] = 1; });
  const sz = $('#lsz'); if (sz) sz.onclick = () => { VOX.stop(); seezeichenKurs('see'); };
  $('#lok').onclick = () => { VOX.stop(); s.erkl = 1; save(); NAV.beispiel(id); };
};
/* Schritt 2: Beispiel. Eine Aufgabe wird vorgerechnet, die Lösung ist in der Karte eingezeichnet. */
NAV.beispiel = function (id) {
  const l = lekOf(id), s = lekState(id), task = GEN[l.typen[0]](), steps = task.steps || [task];
  const weg = t => { const h = (t.hint && t.hint.length ? t.hint : t.hilfe || GESAMT_HINTS[t.lek] || []); return `<ol class="small" style="margin:6px 0;padding-left:20px">${h.map(x => `<li>${NAV.linkTerms(esc(x))}</li>`).join('')}<li><b>Ergebnis:</b> ${t.fields.map(f => `${esc(f.l || 'Antwort')} ${esc(solText(f, t.sol[f.k]))}`).join(', ')}. ${NAV.linkTerms(esc(t.expl || ''))}</li></ol>`; };
  const karte = steps.find(t => t.chart);
  gameShell(l.t + ': Beispiel', `<div class="ntask">${task.scen ? `<div class="card small">${NAV.linkTerms(task.scen)}</div>` : ''}
    ${karte ? '<div id="nchartbox"></div>' : ''}
    ${steps.map((t, i) => `<div class="card small"><b>${steps.length > 1 ? 'Teil ' + (i + 1) + ': ' : 'Aufgabe: '}</b>${NAV.linkTerms(t.text)}<p style="margin:8px 0 0"><b>So wird's gemacht:</b></p>${weg(t)}</div>`).join('')}
    <button class="btn lamp wide" id="bok" style="margin:10px 0 6px">Jetzt du: geführte Übung</button><button class="btn ghost wide" id="bnoch" style="margin-bottom:24px">Noch ein Beispiel</button></div>`);
  NAV.bindTerms(app);
  if (karte) { const ctl = NAV.mountChart($('#nchartbox'), {center: karte.chart.center, width: karte.chart.width || 520, tools: ['hand'], tool: 'hand'}); if (karte.chart.hi) ctl.highlight(karte.chart.hi); steps.forEach(t => { if (t.soll) t.soll(ctl); }); }
  s.bsp = 1; save();
  $('#gback').onclick = () => NAV.lesson(id);
  $('#bok').onclick = () => NAV.exercise(id, 'guided');
  $('#bnoch').onclick = () => NAV.beispiel(id);
};
NAV.exercise = function (id, mode) {
  const l = lekOf(id), s = lekState(id), typ = pick(l.typen), task = GEN[typ]();
  const meta = () => `${mode === 'guided' ? 'Geführte Übung' : mode === 'free' ? 'Freie Übung' : `Meisterschaft: ${s.serie} von 3 in Folge`}${s.sterne ? ' · ⭐' : ''}`;
  if (task.steps) {
    /* Gesamtaufgabe: bestanden ab 7 von 9 Punkten (wie in der Prüfung) */
    if (mode === 'guided') task.steps.forEach(st => { st.hint = st.hilfe || GESAMT_HINTS[st.lek] || []; });
    const need = task.need || 7, all = task.steps.length;
    return NAV.multi(task, {title: l.t, mode, back: () => NAV.lesson(id), extraHead: () => mode === 'master' ? `Meisterschaft ${s.serie} von 3` : '', done: pts => {
      const ok = pts >= need; s.n++; if (ok && mode === 'guided') s.gef = 1; if (ok && mode === 'free') s.frei = 1;
      if (mode === 'master') { s.serie = ok ? s.serie + 1 : 0; if (ok && s.serie >= 3 && !s.sterne) { s.sterne = 1; toast(`⭐ Stern für „${l.t}“!`); } }
      save(); AUD.sfx(ok ? 'richtig' : 'falsch', {vol: .5});
      gameShell(l.t, `<div class="card"><h2 style="margin:0" class="${ok ? 'pass' : 'fail'}">${pts} von ${all} Punkten</h2><p class="muted">${ok ? `Bestanden: Du brauchst mindestens ${need} Punkte.` : `Noch nicht: Du brauchst mindestens ${need} von ${all} Punkten.`}</p>
        <div class="row"><button class="btn lamp" id="again">Neue Gesamtaufgabe</button><button class="btn ghost" id="tol">Zur Lektion</button></div></div>`);
      $('#gback').onclick = () => NAV.lesson(id); $('#again').onclick = () => NAV.exercise(id, mode); $('#tol').onclick = () => NAV.lesson(id);
    }});
  }
  NAV.task(task, {title: l.t, mode, meta, back: () => NAV.lesson(id), next: () => NAV.exercise(id, mode),
    onResult: (ok, res, t, usedHint) => {
      if (ok) { s.n++; if (mode === 'guided') s.gef = 1; if (mode === 'free') s.frei = 1; }
      if (mode === 'master') {
        s.serie = ok ? s.serie + 1 : 0;
        if (ok && s.serie >= 3 && !s.sterne) { s.sterne = 1; setTimeout(() => { toast(`⭐ Stern für „${l.t}“!`); AUD.sfx('glocke', {vol: .5}); }, 400); LOG.add('navi', 'Stern ' + id); }
      }
      save();
    }});
};
/* Der Törn liegt seit Törn 2.0 (5.14) in toern.js. */
NAV.hub = async function () {
  await NAV.init();
  const n = S_(), stars = Object.values(n.lek).reduce((a, l) => a + (l.sterne ? 1 : 0), 0);
  const L = NV.lektionen || [], naechste = L.find(l => !lekState(l.id).sterne);
  gameShell('Navigationsschule', `<p class="small muted" style="margin:6px 0 10px">Am Kartentisch der Kliev-Mündung. Die Karte ist erfunden und selbst gezeichnet (Maßstab etwa 1 : 100 000), gerechnet wird wie auf der echten Seekarte.</p>
    ${naechste ? `<button class="btn lamp wide" id="nweiter" style="margin-bottom:10px">Weiter lernen: ${esc(naechste.t)}</button>` : ''}
    <div class="menu">
      <button class="menuitem" data-n="path"><b>Lernpfad</b><span class="small muted">${stars} von ${L.length} Lektionen mit Stern · von den Grundlagen bis zur Gesamtaufgabe</span></button>
      <button class="menuitem" data-n="exam"><b>Prüfungsmodus</b><span class="small muted">9 Teilaufgaben wie in der Prüfung, ohne Hilfen, 25 Minuten</span></button>
      <button class="menuitem" data-n="fibel"><b>Navi-Fibel</b><span class="small muted">Alle Begriffe mit Erklärung und Merkhilfe</span></button>
      <button class="menuitem" data-n="free"><b>Freie Karte</b><span class="small muted">Kursdreieck, Zirkel, Bleistift und Lupe ausprobieren</span></button>
      <button class="menuitem" data-n="old"><b>Amtliche Aufgaben</b><span class="small muted">Die 15 Originalaufgaben als Text (dafür brauchst du die BSH-Übungskarte 49)</span></button>
    </div>`);
  const nw = $('#nweiter'); if (nw) nw.onclick = () => { AUD.click(); NAV.lesson(naechste.id); };
  app.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { AUD.click(); const k = b.dataset.n; if (k === 'free') NAV.freeChart(); else if (k === 'old') navGame(); else if (NAV[k]) NAV[k](); });
};
})();
