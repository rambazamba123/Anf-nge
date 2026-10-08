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
/* tool: 'hand' | 'dreieck' | 'zirkel' | 'stift' | 'punkt' */
NAV.mountChart = function (host, opt = {}) {
  host.innerHTML = `<div class="nwrap"><svg class="nsvg" xmlns="http://www.w3.org/2000/svg">${chartSVG()}<g id="nlines"></g><g id="nmarks"></g><g id="nhi"></g><g id="ntools"></g></svg>
    <div class="nlens hidden"><svg><use href="#nchart"/><use href="#nlines"/><use href="#nmarks"/><use href="#ntools"/></svg><i></i></div>
    <div class="ntoolbar">${[['hand', '✋', 'Verschieben'], ['dreieck', '◺', 'Kursdreieck'], ['zirkel', '⋀', 'Zirkel'], ['stift', '✎', 'Bleistift'], ['punkt', '✕', 'Kreuz setzen']].filter(t => !opt.tools || opt.tools.includes(t[0])).map(([id, ic, n]) => `<button data-tool="${id}" aria-label="${n}" title="${n}">${ic}</button>`).join('')}<button data-act="undo" aria-label="Rückgängig" title="Rückgängig">↶</button></div>
    <div class="nzoom"><button data-z="1" aria-label="Vergrößern">+</button><button data-z="-1" aria-label="Verkleinern">−</button></div>
    <div class="ntip hidden"></div></div>`;
  const svg = host.querySelector('.nsvg'), lens = host.querySelector('.nlens'), lsvg = lens.querySelector('svg'), tip = host.querySelector('.ntip');
  const G = id => svg.querySelector('#' + id);
  const st = {tool: 'hand', lines: [], marks: [], undo: [], dreieck: null, zirkel: null, vb: null};
  const vbSet = v => { const r = svg.getBoundingClientRect(), asp = (r.height || 400) / (r.width || 400); v.h = v.w * asp; v.x = Math.max(-200, Math.min(W - v.w + 200, v.x)); v.y = Math.max(-200, Math.min(H - v.h + 200, v.y)); st.vb = v; /* 5.11: Beschriftung wächst beim Herauszoomen mit, damit sie lesbar bleibt (Lupe zeigt die Originalgröße) */ const lz = Math.min(3.6, Math.max(1, v.w / (r.width || 400))); svg.style.setProperty('--lz', lz.toFixed(2)); svg.classList.toggle('weit', lz > 2.3); svg.setAttribute('viewBox', `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}`); };
  const toChart = (cx, cy) => { const r = svg.getBoundingClientRect(), v = st.vb; return {x: v.x + (cx - r.left) / r.width * v.w, y: v.y + (cy - r.top) / r.height * v.h}; };
  const scale = () => { const r = svg.getBoundingClientRect(); return st.vb.w / r.width; };
  const focus = (lat, lon, w = 520) => { const p = proj(lat, lon); vbSet({x: p.x - w / 2, y: p.y - w * .55, w}); };
  const start = () => { const c = opt.center || {lat: 20.5, lon: 36}; focus(c.lat, c.lon, opt.width || 560); };
  start(); requestAnimationFrame(start);
  /* Zeichnen der Benutzer-Ebenen */
  const ink = () => {
    G('nlines').innerHTML = st.lines.map(l => `<path d="M${l.a.x.toFixed(1)} ${l.a.y.toFixed(1)} L${l.b.x.toFixed(1)} ${l.b.y.toFixed(1)}" class="pencil${l.c ? ' ' + l.c : ''}"/>`).join('');
    G('nmarks').innerHTML = st.marks.map(m => `<g class="xmark${m.c ? ' ' + m.c : ''}" transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)})"><path d="M-6 -6 L6 6 M6 -6 L-6 6"/>${m.t ? `<text x="8" y="-6">${m.t}</text>` : ''}</g>`).join('');
    let t = '';
    if (st.dreieck) {
      const d = st.dreieck, L = 120, R = 70;
      let ticks = ''; for (let a = 180; a <= 360; a += 1) { const s1 = Math.sin(rad(a)), c1 = -Math.cos(rad(a)), Lt = a % 10 === 0 ? 9 : a % 5 === 0 ? 6 : 3; ticks += `<path d="M${(s1 * (R - Lt)).toFixed(1)} ${(c1 * (R - Lt)).toFixed(1)} L${(s1 * R).toFixed(1)} ${(c1 * R).toFixed(1)}"/>`; if (a % 10 === 0 && a < 360 && a > 180) { const o = (360 - a) % 360, i2 = (540 - a) % 360; ticks += `<text x="${(s1 * (R + 9)).toFixed(1)}" y="${(c1 * (R + 9) + 3).toFixed(1)}" class="dlab">${o}</text><text x="${(s1 * (R - 16)).toFixed(1)}" y="${(c1 * (R - 16) + 3).toFixed(1)}" class="dlab i">${i2}</text>`; } }
      t += `<g class="dreieck" transform="translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) rotate(${d.a.toFixed(2)})"><path d="M0 ${-L} L0 ${L} L${-L} 0 Z" class="dbody"/><g class="dticks">${ticks}</g>
        <path d="M0 ${-L} L0 ${L}" class="dedge"/><path d="M0 ${-L + 4} l-5 12 h10 Z" class="darrow"/><circle cx="0" cy="${-L}" r="11" class="dhandle" data-h="rot"/><circle cx="0" cy="0" r="3" class="dctr"/></g>
        <g transform="translate(${d.x.toFixed(1)} ${d.y.toFixed(1)})"><path d="M0 ${-R - 16} V${R + 16}" class="dmer"/></g>`;
    }
    if (st.zirkel) {
      const z = st.zirkel, top = {x: (z.a.x + z.b.x) / 2, y: Math.min(z.a.y, z.b.y) - 40 - Math.hypot(z.a.x - z.b.x, z.a.y - z.b.y) * .25};
      t += `<g class="zirkel"><path d="M${z.a.x} ${z.a.y} L${top.x} ${top.y} L${z.b.x} ${z.b.y}"/><circle cx="${top.x}" cy="${top.y}" r="9" class="zhinge" data-h="move"/><circle cx="${z.a.x}" cy="${z.a.y}" r="7" class="ztip" data-h="a"/><circle cx="${z.b.x}" cy="${z.b.y}" r="7" class="ztip" data-h="b"/></g>`;
    }
    G('ntools').innerHTML = t;
  };
  const push = () => { st.undo.push(JSON.stringify({lines: st.lines, marks: st.marks})); if (st.undo.length > 40) st.undo.shift(); };
  /* Lupe: zeigt die Stelle unter dem Finger dreifach vergrößert, etwas oberhalb */
  const showLens = (cx, cy) => {
    const p = toChart(cx, cy), r = svg.getBoundingClientRect(), s = scale() / 3.2, w = 110 * s;
    lsvg.setAttribute('viewBox', `${(p.x - w / 2).toFixed(1)} ${(p.y - w / 2).toFixed(1)} ${w.toFixed(1)} ${w.toFixed(1)}`);
    lens.style.left = (cx - r.left - 55) + 'px'; lens.style.top = (cy - r.top - 150) + 'px'; lens.classList.remove('hidden');
  };
  const hideLens = () => lens.classList.add('hidden');
  /* Zeiger: ein Finger je nach Werkzeug, zwei Finger zoomen */
  const ptrs = new Map(); let drag = null, pinch = null;
  svg.addEventListener('pointerdown', e => {
    try { svg.setPointerCapture(e.pointerId); } catch (x) {} ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = {d: Math.hypot(a.x - b.x, a.y - b.y), vb: {...st.vb}, m: toChart((a.x + b.x) / 2, (a.y + b.y) / 2)}; drag = null; hideLens(); return; }
    const p = toChart(e.clientX, e.clientY), h = e.target.dataset && e.target.dataset.h;
    if (st.tool === 'dreieck' && st.dreieck) {
      if (h === 'rot') drag = {k: 'drot'};
      else if (e.target.closest('.dreieck')) drag = {k: 'dmove', ox: p.x - st.dreieck.x, oy: p.y - st.dreieck.y};
      else drag = {k: 'pan', x: e.clientX, y: e.clientY, vb: {...st.vb}};
    } else if (st.tool === 'zirkel') {
      if (st.zirkel && h === 'a') drag = {k: 'za'}; else if (st.zirkel && h === 'b') drag = {k: 'zb'};
      else if (st.zirkel && h === 'move') drag = {k: 'zm', p, a: {...st.zirkel.a}, b: {...st.zirkel.b}};
      else drag = {k: 'zset', p, sx: e.clientX, sy: e.clientY};
      if (drag.k !== 'zm') showLens(e.clientX, e.clientY);
    } else if (st.tool === 'stift') { drag = {k: 'line', a: snap(p)}; showLens(e.clientX, e.clientY); }
    else if (st.tool === 'punkt') { drag = {k: 'mark'}; showLens(e.clientX, e.clientY); }
    else drag = {k: 'pan', x: e.clientX, y: e.clientY, vb: {...st.vb}, t: Date.now(), tgt: e.target};
  });
  svg.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y), f = pinch.d / Math.max(20, d), w = Math.max(90, Math.min(W * 1.2, pinch.vb.w * f)); const m = pinch.m; vbSet({x: m.x - (m.x - pinch.vb.x) * w / pinch.vb.w, y: m.y - (m.y - pinch.vb.y) * w / pinch.vb.w, w}); return; }
    if (!drag) return; const p = toChart(e.clientX, e.clientY);
    if (drag.k === 'pan') { const sc = drag.vb.w / svg.getBoundingClientRect().width; vbSet({...drag.vb, x: drag.vb.x - (e.clientX - drag.x) * sc, y: drag.vb.y - (e.clientY - drag.y) * sc}); if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) drag.moved = true; }
    else if (drag.k === 'dmove') { st.dreieck.x = p.x - drag.ox; st.dreieck.y = p.y - drag.oy; ink(); }
    else if (drag.k === 'drot') { st.dreieck.a = n360(deg(Math.atan2(p.x - st.dreieck.x, -(p.y - st.dreieck.y)))); ink(); emit('dreieck'); }
    else if (drag.k === 'za' || drag.k === 'zb') { st.zirkel[drag.k === 'za' ? 'a' : 'b'] = p; ink(); showLens(e.clientX, e.clientY); }
    else if (drag.k === 'zm') { const dx = p.x - drag.p.x, dy = p.y - drag.p.y; st.zirkel.a = {x: drag.a.x + dx, y: drag.a.y + dy}; st.zirkel.b = {x: drag.b.x + dx, y: drag.b.y + dy}; ink(); }
    else if (drag.k === 'zset') showLens(e.clientX, e.clientY);
    else if (drag.k === 'line') { drag.b = snap(p); ink(); G('ntools').insertAdjacentHTML('beforeend', `<path d="M${drag.a.x} ${drag.a.y} L${drag.b.x} ${drag.b.y}" class="pencil live"/>`); showLens(e.clientX, e.clientY); }
    else if (drag.k === 'mark') showLens(e.clientX, e.clientY);
  });
  const up = e => {
    ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; hideLens();
    if (!drag) return; const p = toChart(e.clientX, e.clientY), d = drag; drag = null;
    if (d.k === 'zset') { if (!st.zirkel || st.zirkel.done) st.zirkel = {a: p, b: p, done: false, n: 1}; else { st.zirkel.b = p; st.zirkel.done = true; } ink(); emit('zirkel'); }
    else if (d.k === 'line') { if (d.b && Math.hypot(d.b.x - d.a.x, d.b.y - d.a.y) > 8) { push(); st.lines.push({a: d.a, b: d.b}); emit('line'); } ink(); }
    else if (d.k === 'mark') { push(); st.marks.push(snap(p)); ink(); emit('mark'); }
    else if (d.k === 'za' || d.k === 'zb' || d.k === 'zm') emit('zirkel');
    else if (d.k === 'dmove') emit('dreieck');
    else if (d.k === 'pan' && !d.moved && opt.onTap) { const o = d.tgt && d.tgt.closest && d.tgt.closest('[data-oid]'); opt.onTap({p, ll: unproj(p.x, p.y), obj: o ? K.objekte.find(x => x.id === o.dataset.oid) : null}); }
  };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  svg.addEventListener('wheel', e => { e.preventDefault(); const m = toChart(e.clientX, e.clientY), f = e.deltaY > 0 ? 1.15 : 1 / 1.15, v = st.vb, w = Math.max(90, Math.min(W * 1.2, v.w * f)); vbSet({x: m.x - (m.x - v.x) * w / v.w, y: m.y - (m.y - v.y) * w / v.w, w}); }, {passive: false});
  /* Einrasten auf Objekte (Tonnen, Kreuze) im Umkreis von 10 Pixeln */
  function snap(p) {
    const lim = 10 * scale(); let best = null, bd = lim;
    K.objekte.forEach(o => { const q = proj(o.lat, o.lon), d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = q; } });
    st.marks.forEach(q => { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = q; } });
    return best ? {x: best.x, y: best.y} : p;
  }
  const listeners = {}; const emit = k => (listeners[k] || []).forEach(f => f());
  host.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => ctl.setTool(b.dataset.tool));
  host.querySelector('[data-act="undo"]').onclick = () => { const u = st.undo.pop(); if (u) { const o = JSON.parse(u); st.lines = o.lines; st.marks = o.marks; ink(); } else if (st.zirkel) { st.zirkel = null; ink(); } };
  host.querySelectorAll('[data-z]').forEach(b => b.onclick = () => { const v = st.vb, f = +b.dataset.z > 0 ? 1 / 1.4 : 1.4, w = Math.max(90, Math.min(W * 1.2, v.w * f)); const m = {x: v.x + v.w / 2, y: v.y + v.h / 2}; vbSet({x: m.x - w / 2, y: m.y - w * v.h / v.w / 2, w}); });
  const ctl = {
    svg, st, K, toChart, focus, ink,
    on(k, f) { (listeners[k] = listeners[k] || []).push(f); },
    setTool(t) {
      st.tool = t; host.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tool === t));
      if (t === 'dreieck' && !st.dreieck) { const v = st.vb; st.dreieck = {x: v.x + v.w / 2, y: v.y + v.h / 2, a: 45}; }
      ink(); ctl.tipText({hand: 'Mit einem Finger verschieben, mit zwei Fingern zoomen. Tonne antippen: Infos.', dreieck: 'Dreieck ziehen zum Verschieben, am runden Griff drehen. Abgelesen wird, wo die rote Meridianlinie den Gradbogen schneidet.', zirkel: 'Zwei Punkte antippen. Dann am Gelenk zum Breitenrand ziehen und dort die Minuten ablesen: 1\' = 1 sm.', stift: 'Linie ziehen. Am Anfang und Ende rastet der Stift an Tonnen und Kreuzen ein.', punkt: 'Antippen setzt ein Kreuz, zum Beispiel einen Standort.'}[t] || '');
    },
    tipText(t) { tip.textContent = t; tip.classList.toggle('hidden', !t); },
    /* Linie entlang der Dreieckskante durch die Karte ziehen */
    lineFromDreieck(c) { const d = st.dreieck; if (!d) return; const s1 = Math.sin(rad(d.a)), c1 = -Math.cos(rad(d.a)); push(); st.lines.push({a: {x: d.x - s1 * 1400, y: d.y - c1 * 1400}, b: {x: d.x + s1 * 1400, y: d.y + c1 * 1400}, c}); ink(); emit('line'); },
    addLine(a, b, c) { st.lines.push({a, b, c}); ink(); },
    addMark(p, t, c) { st.marks.push({x: p.x, y: p.y, t, c}); ink(); },
    clear() { st.lines = []; st.marks = []; st.undo = []; st.zirkel = null; ink(); },
    highlight(ids) { G('nhi').innerHTML = (ids || []).map(id => { const o = K.objekte.find(x => x.id === id); if (!o) return ''; const p = proj(o.lat, o.lon); return `<circle cx="${p.x}" cy="${p.y}" r="22" class="nhi"/>`; }).join(''); },
    /* Messwerte (für Hilfen in der geführten Übung) */
    zirkelSm() { const z = st.zirkel; if (!z || !z.done) return null; const a = unproj(z.a.x, z.a.y), b = unproj(z.b.x, z.b.y); return kursDist(a, b).d; },
    dreieckDeg() { return st.dreieck ? st.dreieck.a : null; },
    setVB(v) { vbSet({...v}); },
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
.zirkel path{stroke:#444;stroke-width:2;fill:none}.zirkel .zhinge{fill:#c8962e;stroke:#444}.zirkel .ztip{fill:rgba(214,51,44,.25);stroke:#d6332c}
.nhi{fill:none;stroke:#f0b43e;stroke-width:3;stroke-dasharray:5 3}
.nlens{position:absolute;width:110px;height:110px;border-radius:50%;overflow:hidden;border:3px solid #2a2a6a;background:#fff;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,.3);z-index:5}
.nlens svg{width:100%;height:100%}.nlens i{position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px 0 0 -5px;border:1px solid #d6332c;border-radius:50%}
.ntoolbar{position:absolute;left:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:4}
.ntoolbar button,.nzoom button{width:40px;height:40px;border-radius:10px;border:1px solid #9aa;background:rgba(255,255,255,.94);font-size:20px;line-height:1;color:#2a2a6a}
.ntoolbar button[aria-pressed="true"]{background:#2a2a6a;color:#fff}
.nzoom{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:4}
.ntip{position:absolute;left:56px;right:56px;bottom:8px;background:rgba(255,250,240,.95);color:#2a2019;border-radius:10px;padding:6px 10px;font-size:.78rem;z-index:4}
.nsheetgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.nsheetgrid label{margin:0;font-size:.8rem}
.nfield{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0}.nfield input{width:110px}
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
    <div class="row" style="margin:8px 0;flex-wrap:wrap"><button class="btn small ghost" id="nline">Linie am Dreieck ziehen</button><button class="btn small ghost" id="nclear">Alles wegwischen</button><button class="btn small ghost" id="nsheet">Rechenblatt</button></div>
    <div class="card small" id="ninfo">Tippe eine Tonne oder ein Feuer an.</div>`);
  $('#gback').onclick = () => NAV.hub();
  const ctl = NAV.mountChart($('#nchartbox'), {onTap: t => { $('#ninfo').innerHTML = t.obj ? infoCard(t.obj) : 'Position: <b>' + fmtPos(t.ll) + '</b>'; }});
  $('#nline').onclick = () => { if (!ctl.st.dreieck) return toast('Erst das Kursdreieck auswählen.'); ctl.lineFromDreieck(); };
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
    return {text: `Der rwK beträgt <b>${fmtDeg(rwk)}</b>. Die Ablenkung beträgt <b>${fmtSigned(abl)}</b>, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?`, chart: {center: ROSE(), tools: ['hand'], width: 420}, fields: [{k: 'mw', l: 'Mw', t: 'sdeg'}, {k: 'mg', l: 'MgK', t: 'deg'}], sol: {mw: m, mg}, tol: {mw: 0, mg: 1},
      hint: ['Die Mw steht in der Kompassrose: 3° E, also +3°.', 'Von der Karte zum Kompass: MgK = rwK − Mw − Abl.'], expl: `MgK = ${fmtDeg(rwk)} − (${fmtSigned(m)}) − (${fmtSigned(abl)}) = ${fmtDeg(mg)}.`}; },
  mg2rw() { const row = pick(K.deviation), mg = n360(row[0] + pick([0, 0, 10, -10])), abl = Math.round(ablenkung(mg)), m = mw(), rw = n360(mg + abl + m);
    const tab = ABL_TAB();
    return {text: `Am Steuerkompass liegt der MgK <b>${fmtDeg(mg)}</b> an. Die Ablenkung entnimmst du der Ablenkungstabelle (zwischen den Werten gleichmäßig verteilen), die Mw der Karte (3° E). Wie lautet der rwK?${tab}`, chart: null, fields: [{k: 'abl', l: 'Abl.', t: 'sdeg'}, {k: 'rw', l: 'rwK', t: 'deg'}], sol: {abl, rw}, tol: {abl: 1, rw: 1},
      hint: ['Such in der Tabelle die Ablenkung zum MgK. Liegt er zwischen zwei Werten, rechne anteilig.', 'Vom Kompass zur Karte: rwK = MgK + Abl. + Mw.'], expl: `Abl. bei ${fmtDeg(mg)}: ${fmtSigned(abl)}. rwK = ${fmtDeg(mg)} + (${fmtSigned(abl)}) + (${fmtSigned(m)}) = ${fmtDeg(rw)}.`}; },
  peilRechnen() { const mgp = ri(0, 359), m = mw(), rwp = n360(mgp + m);
    return {text: `Mit dem Handpeilkompass peilst du einen Leuchtturm in <b>${fmtDeg(mgp)}</b> (MgP). Die Ablenkung beträgt 0°, die Mw ist 3° E. Wie lautet die rwP?`, chart: null, fields: [{k: 'rwp', l: 'rwP', t: 'deg'}], sol: {rwp}, tol: {rwp: 1}, hint: ['Peilungen rechnest du wie Kurse: rwP = MgP + Abl. + Mw.'], expl: `rwP = ${fmtDeg(mgp)} + 0° + 3° = ${fmtDeg(rwp)}.`}; },
  kreuz() {
    let ship, o1, o2, p1, p2;
    for (let i = 0; i < 400; i++) { ship = seaPoint(); const P = PEIL(); o1 = pick(P); o2 = pick(P); if (o1 === o2) continue; const a = kursDist(ship, o1), b = kursDist(ship, o2), dd = angDiff(a.k, b.k); if (a.d < 2 || b.d < 2 || a.d > 14 || b.d > 14 || dd < 50 || dd > 130) continue; p1 = a.k; p2 = b.k; break; }
    const m = mw(), mg1 = Math.round(n360(p1 - m)), mg2 = Math.round(n360(p2 - m)), rw1 = n360(mg1 + m), rw2 = n360(mg2 + m), pos = kreuzpeilung(o1, rw1, o2, rw2) || ship;
    return {text: `Zur Standortbestimmung peilst du mit dem Handpeilkompass (Abl. 0°): <b>${o1.id}</b> MgP = ${fmtDeg(mg1)}, <b>${o2.id}</b> MgP = ${fmtDeg(mg2)}. Die Mw ist der Karte zu entnehmen. Wie lauten die rwP? Trage die Standlinien ein und setze ein Kreuz auf deinen Standort.`,
      chart: {center: pos, hi: [o1.id, o2.id], tools: ['hand', 'dreieck', 'stift', 'punkt'], width: 700}, fields: [{k: 'r1', l: 'rwP ' + o1.id, t: 'deg'}, {k: 'r2', l: 'rwP ' + o2.id, t: 'deg'}, {k: 'pos', l: 'Standort (Kreuz)', t: 'pos'}], sol: {r1: rw1, r2: rw2, pos}, tol: {r1: 1, r2: 1},
      hint: ['rwP = MgP + Abl. + Mw, also jeweils plus 3°.', 'Leg das Dreieck mit der Kante an das Objekt, Pfeil zeigt zum Objekt (die rwP), und zieh mit „Linie am Dreieck“ die Standlinie.', 'Wo sich beide Linien kreuzen, setzt du mit ✕ den beobachteten Ort.'],
      expl: `rwP ${o1.id} = ${fmtDeg(rw1)}, rwP ${o2.id} = ${fmtDeg(rw2)}. Beobachteter Ort: ${fmtPos(pos)}.`,
      soll: c => { const P = proj(pos.lat, pos.lon); c.addLine(proj(o1.lat, o1.lon), P, 'soll'); c.addLine(proj(o2.lat, o2.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); }};
  },
  feuer() { const L = K.objekte.filter(o => o.kenn), o = pick(L), o4 = [o.id, ...L.filter(x => x.kenn !== o.kenn).map(x => x.id).sort(() => Math.random() - .5).slice(0, 3)].sort(() => Math.random() - .5);
    return {text: `Nachts siehst du voraus ein Feuer: <b>${kennWorte(o.kenn)}</b>. Welches ist es?`, chart: {center: o, tools: ['hand'], width: 900, noInfo: true}, fields: [{k: 'mc', l: '', t: 'mc', opts: o4}], sol: {mc: o.id}, hint: ['Vergleiche mit den Kennungen in der Karte: Fl = Blitz, Q = Funkeln, Iso = Gleichtakt, Oc = unterbrochen. Die Zahl in Klammern ist die Gruppe, die letzte Zahl die Wiederkehr.'], expl: `Es ist ${o.id} (${o.kenn}).`}; },
  distZeit() { const v = ri(8, 24) / 2, t = ri(2, 18) * 5, d = v * t / 60;
    return {text: `Du fährst <b>${comma(v)} kn</b> über Grund. Welche Distanz legst du in <b>${t} Minuten</b> zurück?`, chart: null, fields: [{k: 'd', l: 'Distanz', t: 'sm'}], sol: {d}, tol: {d: .1}, hint: ['Distanz = Fahrt × Zeit. Zeit in Stunden: Minuten durch 60.'], expl: `${comma(v)} kn × ${t}/60 h = ${comma(d, 2)} sm.`}; },
  zeitDist() { const v = ri(8, 24) / 2, d = ri(15, 120) / 10, t = d / v * 60;
    return {text: `Bis zur nächsten Tonne sind es <b>${comma(d)} sm</b>. Du fährst <b>${comma(v)} kn</b> über Grund. Wie lange brauchst du?`, chart: null, fields: [{k: 't', l: 'Zeit', t: 'min'}], sol: {t}, tol: {t: 1}, hint: ['Zeit = Distanz durch Fahrt, mal 60 für Minuten.'], expl: `${comma(d)} sm : ${comma(v)} kn × 60 = ${Math.round(t)} Minuten.`}; },
  koppelort() {
    let a, k, v, t, z;
    for (let i = 0; i < 300; i++) { a = pick(BUOYS()); k = ri(0, 35) * 10; v = ri(10, 20) / 2; t = ri(3, 9) * 10; z = versegeln(a, k, v * t / 60); if (inSea(z)) break; }
    const hh = ri(8, 15), mm = pick([0, 15, 30]), tt = mm + t, fmtT = m2 => `${String(hh + Math.floor(m2 / 60)).padStart(2, '0')}:${String(m2 % 60).padStart(2, '0')}`;
    return {text: `Um ${fmtT(mm)} Uhr passierst du die Tonne <b>${a.id}</b> nahebei. Du steuerst rwK <b>${fmtDeg(k)}</b> mit <b>${comma(v)} kn</b>. Strom und Wind gibt es nicht. Wo ist dein Koppelort um <b>${fmtT(tt)} Uhr</b>?`,
      chart: {center: z, hi: [a.id], tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 700}, fields: [{k: 'lat', l: 'Breite', t: 'lat'}, {k: 'lon', l: 'Länge', t: 'lon'}], sol: {lat: z.lat, lon: z.lon},
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
      fields: [{k: 'kueg', l: 'KüG', t: 'deg'}, {k: 'fueg', l: 'FüG', t: 'kn'}], sol: {kueg: g.k, fueg: g.v}, tol: {kueg: 3},
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
      chart: {center: {lat: (a.lat + b.lat) / 2, lon: (a.lon + b.lon) / 2}, hi: [a.id, b.id], tools: ['hand', 'stift', 'dreieck']}, fields: [{k: 'kdw', l: 'KdW', t: 'deg'}, {k: 'fueg', l: 'FüG', t: 'kn'}], sol: {kdw, fueg}, tol: {kdw: 3},
      hint: [`Erst den KüG abnehmen: ${a.id} nach ${b.id}.`, 'Strompfeil (1 Stunde) vom Start antragen. Um seine Spitze einen Kreis mit Radius FdW schlagen, der die Kurslinie schneidet.', 'Von der Strompfeilspitze zum Schnittpunkt: das ist dein KdW. Vom Start zum Schnittpunkt: die FüG.'],
      expl: `KüG ${fmtDeg(kd.k)}. Vorhalten ergibt KdW ${fmtDeg(kdw)}, FüG ${comma(fueg)} kn.`, soll: ctl => ctl.addLine(proj(a.lat, a.lon), proj(b.lat, b.lon), 'soll')};
  },
  stromTab() { const c = zufallsStrom();
    return {text: `Es ist <b>${stdText(c.std)}</b>, <b>${c.sp ? 'Springzeit' : 'Nippzeit'}</b>. Lies aus der Stromtabelle für den Punkt A Richtung und Stärke des Gezeitenstroms ab.<table class="ntab"><tr><th>Std</th>${K.strom.std.map(s => `<td>${s === 0 ? 'HW' : (s > 0 ? '+' : '−') + Math.abs(s)}</td>`).join('')}</tr><tr><th>rw°</th>${K.strom.rw.map(r => `<td>${r == null ? '—' : String(r).padStart(3, '0')}</td>`).join('')}</tr><tr><th>kn Sp</th>${K.strom.sp.map(v => `<td>${comma(v)}</td>`).join('')}</tr><tr><th>kn Np</th>${K.strom.np.map(v => `<td>${comma(v)}</td>`).join('')}</tr></table>`,
      chart: null, fields: [{k: 'r', l: 'Strom setzt', t: 'deg'}, {k: 'v', l: 'Stärke', t: 'kn'}], sol: {r: c.r, v: c.v}, tol: {r: 0, v: .05},
      hint: ['Spalte nach der Stunde zu Hochwasser wählen, Zeile Sp (Springzeit) oder Np (Nippzeit).'], expl: `${stdText(c.std)}, ${c.sp ? 'Springzeit' : 'Nippzeit'}: Strom setzt ${fmtDeg(c.r)} mit ${comma(c.v)} kn.`}; },
  abdrift() { const rwk = ri(0, 71) * 5, a = ri(3, 10), bb = Math.random() < .5, bw = bb ? a : -a, kdw = n360(rwk + bw);
    return {text: `Du steuerst rwK <b>${fmtDeg(rwk)}</b>. Der Wind kommt von <b>${bb ? 'Backbord' : 'Steuerbord'}</b> und verursacht <b>${a}°</b> Abdrift. Wie groß ist die Beschickung für Wind (BW), und welcher KdW ergibt sich?`, chart: null,
      fields: [{k: 'bw', l: 'BW', t: 'sdeg'}, {k: 'kdw', l: 'KdW', t: 'deg'}], sol: {bw, kdw}, tol: {bw: 0, kdw: 1}, hint: ['Wind von Backbord drückt nach Steuerbord: BW ist plus. Wind von Steuerbord: minus.', 'KdW = rwK + BW.'], expl: `BW = ${fmtSigned(bw)}, KdW = ${fmtDeg(rwk)} ${bw > 0 ? '+' : '−'} ${a}° = ${fmtDeg(kdw)}.`}; },
  windVorhalt() { const kdw = ri(0, 71) * 5, a = ri(3, 10), bb = Math.random() < .5, bw = bb ? a : -a, rwk = n360(kdw - bw);
    return {text: `Du willst durchs Wasser genau KdW <b>${fmtDeg(kdw)}</b> laufen. Der Wind kommt von <b>${bb ? 'Backbord' : 'Steuerbord'}</b>, die Abdrift beträgt <b>${a}°</b>. Welchen rwK musst du steuern?`, chart: null,
      fields: [{k: 'rwk', l: 'rwK', t: 'deg'}], sol: {rwk}, tol: {rwk: 1}, hint: ['KdW = rwK + BW, also rwK = KdW − BW.', 'Wind von Backbord: BW plus, also musst du weniger Grad steuern (gegen den Wind halten).'], expl: `BW = ${fmtSigned(bw)}. rwK = ${fmtDeg(kdw)} − (${fmtSigned(bw)}) = ${fmtDeg(rwk)}.`}; },
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
    return {scen, steps: [
      {text: 'Wie lautet der rwK?', chart: ch, fields: [{k: 'k', l: 'rwK', t: 'deg'}], sol: {k: kd.k}, hint: [], expl: `rwK = ${fmtDeg(kd.k)}.`, soll: c => c.addLine(A, B, 'soll'), lek: 'L2'},
      {text: `Die Ablenkung beträgt <b>${fmtSigned(abl)}</b>, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?`, chart: ch, fields: [{k: 'mg', l: 'MgK', t: 'deg'}], sol: {mg: mgk}, tol: {mg: 1}, folge: R => { const r = R[0] && R[0].res.k; return r && r.ok ? {mg: n360(Math.round(num(r.got)) - mw() - abl)} : null; }, hint: [], expl: `MgK = ${fmtDeg(rwk)} − (${fmtSigned(mw())}) − (${fmtSigned(abl)}) = ${fmtDeg(mgk)}.`, lek: 'L3'},
      {text: `Wie groß ist die Distanz zwischen <b>${a.id}</b> und <b>${b.id}</b>?`, chart: ch, fields: [{k: 'd', l: 'Distanz', t: 'sm'}], sol: {d: kd.d}, hint: [], expl: `Distanz ${comma(kd.d)} sm.`, lek: 'L2'},
      {text: 'In welcher Zeit wird diese Distanz zurückgelegt?', chart: ch, fields: [{k: 't', l: 'Zeit', t: 'min'}], sol: {t: kd.d / v * 60}, folge: R => { const r = R[2] && R[2].res.d; return r && r.ok ? {t: num(r.got) / v * 60} : null; }, hint: [], expl: `${comma(kd.d)} sm : ${comma(v)} kn × 60 = ${Math.round(kd.d / v * 60)} min.`, lek: 'L5'},
      {text: `Auf welcher Position befindet sich das Boot nach Koppelort um <b>${T(t1)} Uhr</b>?`, chart: ch, fields: [{k: 'lat', l: 'Breite', t: 'lat'}, {k: 'lon', l: 'Länge', t: 'lon'}], sol: {lat: ok.lat, lon: ok.lon}, hint: [], expl: `Koppelort ${fmtPos(ok)}.`, soll: c => c.addMark(proj(ok.lat, ok.lon), 'Ok', 'soll'), lek: 'L5'},
      {text: `Um ${T(t1)} Uhr werden mit dem Handpeilkompass (Abl. 0°) gepeilt: <b>${o1.id}</b> MgP = ${fmtDeg(mg1)}, <b>${o2.id}</b> MgP = ${fmtDeg(mg2)}. Die Mw ist der Seekarte zu entnehmen. Wie lauten die rwP?`, chart: ch, fields: [{k: 'r1', l: 'rwP ' + o1.id, t: 'deg'}, {k: 'r2', l: 'rwP ' + o2.id, t: 'deg'}], sol: {r1: rw1, r2: rw2}, tol: {r1: 1, r2: 1}, hint: [], expl: `rwP ${o1.id} = ${fmtDeg(rw1)}, rwP ${o2.id} = ${fmtDeg(rw2)}.`, lek: 'L4'},
      {text: 'Trage die rechtweisenden Peilungen in die Seekarte ein und setze ein Kreuz auf den beobachteten Ort.', chart: ch, fields: [{k: 'pos', l: 'Beobachteter Ort', t: 'pos'}], sol: {pos: obs}, hint: [], expl: `Beobachteter Ort ${fmtPos(obs)}.`, soll: c => { const P = proj(obs.lat, obs.lon); c.addLine(proj(o1.lat, o1.lon), P, 'soll'); c.addLine(proj(o2.lat, o2.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); }, lek: 'L4'},
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
      fields: [{k: 'r1', l: 'rwP 1', t: 'deg'}, {k: 'r2', l: 'rwP 2', t: 'deg'}, {k: 'd', l: 'Versegelte Distanz', t: 'sm'}, {k: 'pos', l: `Standort ${uhr(hh, t)} Uhr`, t: 'pos'}], sol: {r1: L.rw1, r2: L.rw2, d, pos: L.pos}, tol: {r1: 1, r2: 1, d: .1, pos: .4},
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
      fields: [{k: 'ab', l: 'Abstand', t: 'sm'}, {k: 'rwp', l: 'rwP', t: 'deg'}, {k: 'pos', l: `Standort ${uhr(hh, t)} Uhr`, t: 'pos'}], sol: {ab: d, rwp, pos: s2}, tol: {ab: .1, rwp: 1},
      hint: ['Verdoppelt sich der Seitenwinkel, ist der Abstand bei der zweiten Peilung so groß wie die gefahrene Distanz (gleichschenkliges Dreieck). 45° und dann querab heißt Vierstrichpeilung.', `Distanz = ${comma(v)} kn × ${t} min / 60.`, `rwP = rwK ${side > 0 ? 'plus' : 'minus'} Seitenwinkel (${sd}).`, 'Vom Objekt die Gegenrichtung der rwP zeichnen und den Abstand mit dem Zirkel abtragen.'],
      expl: `Gefahren: ${comma(v)} kn × ${t} min = ${comma(d, 2)} sm, also Abstand ${comma(d, 2)} sm. rwP = ${fmtDeg(k)} ${side > 0 ? '+' : '−'} ${2 * a}° = ${fmtDeg(rwp)}. Standort ${fmtPos(s2)}.`,
      soll: c => { const P = proj(s2.lat, s2.lon); c.addLine(proj(O.lat, O.lon), P, 'soll'); c.addLine(proj(s1.lat, s1.lon), P, 'soll'); c.addMark(P, 'Ob', 'soll'); }};
  },
  peilAbstand() {
    let O, s, b; for (let i = 0; i < 300; i++) { O = pick(PEIL()); s = seaPoint(); b = kursDist(s, O); if (b.d >= 1.5 && b.d <= 8) break; }
    const mg = Math.round(n360(b.k - mw())), rw = n360(mg + mw()), D = Math.round(b.d * 10) / 10, pos = versegeln(O, rw + 180, D);
    return {text: `Du peilst <b>${O.id}</b> mit dem Handpeilkompass (Abl. 0°): MgP = ${fmtDeg(mg)}. Gleichzeitig misst das Radar mit dem VRM einen Abstand von <b>${comma(D)} sm</b>. Die Mw ist der Karte zu entnehmen. Wie lautet die rwP, und wo stehst du?`,
      chart: {center: pos, hi: [O.id], tools: ['hand', 'dreieck', 'zirkel', 'stift', 'punkt'], width: 600},
      fields: [{k: 'rwp', l: 'rwP', t: 'deg'}, {k: 'pos', l: 'Standort', t: 'pos'}], sol: {rwp: rw, pos}, tol: {rwp: 1},
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
    return {scen, need: 5, steps: [
      {text: `Welchen KüG musst du von ${a.id} nach ${b.id} laufen?`, chart: ch, fields: [{k: 'kueg', l: 'KüG', t: 'deg'}], sol: {kueg: kd.k}, hint: [], hilfe: ['Bleistiftlinie von Tonne zu Tonne, Kursdreieck anlegen und am Gradbogen ablesen.'], expl: `KüG = ${fmtDeg(kd.k)}.`, soll: cc => cc.addLine(A, B, 'soll'), lek: 'L2'},
      {text: `Lies Richtung und Stärke des Gezeitenstroms ab.${stromTabHTML}`, chart: null, fields: [{k: 'r', l: 'Strom setzt', t: 'deg'}, {k: 'v', l: 'Stärke', t: 'kn'}], sol: {r: c.r, v: c.v}, tol: {r: 0, v: .05}, hint: [], hilfe: ['Spalte nach der Stunde zu Hochwasser, Zeile Sp oder Np. Die Richtung ist die, in die der Strom setzt.'], expl: `Strom setzt ${fmtDeg(c.r)} mit ${comma(c.v)} kn.`, lek: 'L6'},
      {text: 'Welchen KdW musst du steuern, damit du trotz Strom auf dem KüG bleibst, und welche FüG ergibt sich?', chart: ch, fields: [{k: 'kdw', l: 'KdW', t: 'deg'}, {k: 'fueg', l: 'FüG', t: 'kn'}], sol: {kdw, fueg}, tol: {kdw: 3}, hint: [], hilfe: ['Strompfeil für eine Stunde vom Start antragen, um seine Spitze einen Kreis mit der FdW schlagen und mit der Kurslinie schneiden.', 'Strompfeilspitze → Schnittpunkt = KdW. Start → Schnittpunkt = FüG.'], expl: `Vorhalten ergibt KdW ${fmtDeg(kdw)} und FüG ${comma(fueg)} kn.`, lek: 'L6'},
      {text: 'Welchen rwK musst du wegen der Abdrift steuern?', chart: null, fields: [{k: 'rwk', l: 'rwK', t: 'deg'}], sol: {rwk}, tol: {rwk: 1}, folge: R => { const r = R[2] && R[2].res.kdw; return r && r.ok ? {rwk: n360(num(r.got) - bw)} : null; }, hint: [], hilfe: [`Wind von ${side > 0 ? 'Backbord' : 'Steuerbord'}: BW = ${fmtSigned(bw)}. rwK = KdW − BW.`], expl: `BW = ${fmtSigned(bw)}, rwK = ${fmtDeg(kdw)} − (${fmtSigned(bw)}) = ${fmtDeg(rwk)}.`, lek: 'L7'},
      {text: 'Welcher MgK liegt am Steuerkompass an?', chart: null, fields: [{k: 'mg', l: 'MgK', t: 'deg'}], sol: {mg: mgk}, tol: {mg: 2}, folge: R => { const r = R[3] && R[3].res.rwk; return r && r.ok ? {mg: mgAusMw(n360(num(r.got) - mw()))} : null; }, hint: [], hilfe: ['Erst mwK = rwK − Mw. Die Ablenkung gilt für den MgK: Nimm sie für den mwK aus der Tabelle, rechne den MgK und prüf, ob die Ablenkung dazu passt.'], expl: `mwK = ${fmtDeg(rwk)} − (${fmtSigned(mw())}) = ${fmtDeg(mwk)}. Abl. bei MgK ${fmtDeg(mgk)}: ${fmtSigned(Math.round(ablenkung(mgk)))}. MgK = ${fmtDeg(mgk)}.`, lek: 'L3'},
      {text: `Wann erreichst du ${b.id}?`, chart: ch, fields: [{k: 'eta', l: 'Fahrzeit', t: 'min'}], sol: {eta: kd.d / fueg * 60}, tol: {eta: 4}, folge: R => { const r = R[2] && R[2].res.fueg; return r && r.ok ? {eta: kd.d / num(r.got) * 60} : null; }, hint: [], hilfe: ['Distanz am Breitenrand abgreifen. Zeit = Distanz : FüG × 60.'], expl: `${comma(kd.d)} sm : ${comma(fueg)} kn × 60 = ${Math.round(kd.d / fueg * 60)} min, Ankunft etwa ${uhr(hh, Math.round(kd.d / fueg * 60))} Uhr.`, lek: 'L5'},
      {text: `Unterwegs peilst du um <b>${uhr(hh, tP)} Uhr</b> <b>${L.O.id}</b> mit dem Handpeilkompass (Abl. 0°): MgP = ${fmtDeg(L.mg1)}. Um <b>${uhr(hh, tP + t2)} Uhr</b> peilst du ${L.O.id} erneut: MgP = ${fmtDeg(L.mg2)}. Bestimme deinen Ort um ${uhr(hh, tP + t2)} Uhr mit einer Versegelungspeilung (versegelt wird über Grund).`, chart: {...ch, hi: [L.O.id]}, fields: [{k: 'pos', l: 'Beobachteter Ort', t: 'pos'}], sol: {pos: L.pos}, tol: {pos: .4}, hint: [], hilfe: ['Beide Peilungen: plus 3° Mw.', `Erste Standlinie um FüG × ${t2} min auf dem KüG versegeln, mit der zweiten schneiden.`], expl: `Versegelt ${comma(dv, 2)} sm auf ${fmtDeg(kd.k)}. Beobachteter Ort ${fmtPos(L.pos)}.`, soll: versegelSoll(L, kd.k, dv), lek: 'L10'},
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
function fieldHTML(f) {
  if (f.t === 'mc') return `<div class="menu" data-mc="${f.k}">${f.opts.map(o => `<button class="menuitem" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  if (f.t === 'pos') return `<p class="small muted" style="margin:4px 0">${NAV.linkTerms(esc(f.l))}: setze mit dem Werkzeug ✕ ein Kreuz in die Karte.</p>`;
  const pre = f.t === 'lat' ? '55°' : f.t === 'lon' ? '006°' : '', post = f.t === 'lat' ? "' N" : f.t === 'lon' ? "' E" : f.t === 'deg' || f.t === 'sdeg' ? '°' : f.t === 'sm' ? 'sm' : f.t === 'kn' ? 'kn' : f.t === 'min' ? 'min' : f.t === 'm' ? 'm' : '';
  const ph = f.t === 'lat' || f.t === 'lon' ? 'Min., z. B. 20,4' : f.t === 'deg' ? 'z. B. 074' : f.t === 'sdeg' ? 'z. B. +3 oder −2' : '';
  return `<label class="nfield"><span style="min-width:96px">${NAV.linkTerms(esc(f.l))}</span>${pre}<input data-k="${f.k}" inputmode="${f.t === 'sdeg' ? 'text' : 'decimal'}" placeholder="${ph}" autocomplete="off">${post}</label>`;
}
/* Eine Aufgabe zeigen. opts: {title, mode:'guided'|'free'|'master'|'exam', onResult(ok,res), next} */
NAV.task = function (task, opts) {
  const guided = opts.mode === 'guided', exam = opts.mode === 'exam'; NAV.lastTask = task;
  gameShell(opts.title || 'Übung', `${opts.head || ''}<div class="card small" id="xtask" style="margin-top:6px">${NAV.linkTerms(task.text)}</div>
    ${task.chart ? '<div id="nchartbox"></div><div class="row" style="margin:6px 0;flex-wrap:wrap"><button class="btn small ghost" id="nline">Linie am Dreieck</button><button class="btn small ghost" id="nsheet">Rechenblatt</button><span class="small muted" id="xctrl"></span></div>' : '<div class="row" style="margin:6px 0"><button class="btn small ghost" id="nsheet">Rechenblatt</button></div>'}
    <div class="card" id="xform">${task.fields.map(fieldHTML).join('')}
      <div class="row" style="margin-top:8px"><button class="btn lamp" id="xcheck">${exam ? 'Weiter' : 'Prüfen'}</button>${guided ? '<button class="btn ghost" id="xhint">Hilfe</button>' : ''}</div><div id="xhints"></div><div id="xfb"></div></div>`);
  NAV.bindTerms(app);
  if (opts.back) $('#gback').onclick = opts.back;
  let ctl = null;
  if (task.chart) {
    const ch = task.chart;
    ctl = NAV.mountChart($('#nchartbox'), {center: ch.center, width: ch.width || 520, tools: ch.tools, tool: 'hand', onTap: t => { if (!ch.noInfo && !exam && t.obj) toast(t.obj.id + (t.obj.kenn ? ' · ' + t.obj.kenn : '')); }});
    if (ch.hi) ctl.highlight(ch.hi);
    if (ch.ring) { const p = proj(ch.ring.lat, ch.ring.lon); ctl.svg.querySelector('#nhi').insertAdjacentHTML('beforeend', `<circle cx="${p.x}" cy="${p.y}" r="18" class="nhi"/>`); }
    if (ch.hideKenn) ctl.svg.querySelectorAll('.nlab.k').forEach(e => e.remove());
    NAV.lastCtl = ctl;
    if (opts.keep) { ctl.st.lines = opts.keep.lines.slice(); ctl.st.marks = opts.keep.marks.slice(); if (opts.keep.vb) ctl.setVB(opts.keep.vb); ctl.ink(); }
    $('#nline').onclick = () => { if (!ctl.st.dreieck) return toast('Erst das Kursdreieck wählen.'); ctl.lineFromDreieck(); };
    if (guided && task.ctrl) { const upd = () => { $('#xctrl').textContent = task.ctrl(ctl); }; ctl.on('dreieck', upd); ctl.on('zirkel', upd); }
  }
  $('#nsheet').onclick = () => NAV.sheet();
  const vals = {};
  app.querySelectorAll('[data-mc]').forEach(g => g.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { vals[g.dataset.mc] = b.dataset.v; g.querySelectorAll('[data-v]').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  let hints = 0, used = false;
  if ($('#xhint')) $('#xhint').onclick = () => { used = true; if (hints < task.hint.length) { $('#xhints').insertAdjacentHTML('beforeend', `<p class="small" style="margin:6px 0 0">💡 ${NAV.linkTerms(esc(task.hint[hints]))}</p>`); NAV.bindTerms($('#xhints')); hints++; } };
  if (guided) $('#xhint').click();
  $('#xcheck').onclick = () => {
    app.querySelectorAll('[data-k]').forEach(i => { vals[i.dataset.k] = i.value; });
    const res = grade(task, vals, ctl), ok = task.fields.every(f => res[f.k].ok);
    if (exam) return opts.onResult(ok, res, task, false, ctl);
    AUD.sfx(ok ? 'richtig' : 'falsch', {vol: ok ? .5 : .35});
    $('#xfb').innerHTML = `<div class="fb" style="margin-top:8px">${task.fields.map(f => `<p style="margin:2px 0">${res[f.k].ok ? '<span class="nok">✓</span>' : '<span class="nno">✗</span>'} ${esc(f.l || 'Antwort')}: ${res[f.k].ok ? 'richtig' : `deine ${esc(String(res[f.k].got || '–'))}, richtig ${esc(solText(f, task.sol[f.k]))}`}</p>`).join('')}
      <p class="small" style="margin:8px 0 0">${NAV.linkTerms(esc(task.expl))}</p>${task.soll ? '<p class="small muted" style="margin:4px 0 0">Die Lösung ist in der Karte gestrichelt eingezeichnet.</p>' : ''}<button class="btn wide" id="xnext" style="margin-top:10px">${opts.nextLabel || 'Nächste Aufgabe'}</button></div>`;
    NAV.bindTerms($('#xfb'));
    if (ctl && task.soll) task.soll(ctl);
    $('#xcheck').disabled = true;
    if (opts.onResult) opts.onResult(ok, res, task, used, ctl);
    $('#xnext').onclick = () => opts.next && opts.next();
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
  let i = 0, pts = 0, keep = null, fin = false; const results = [];
  const end = () => { if (fin) return; fin = true; opts.done(pts, results, mt); };
  const step = () => {
    if (fin) return; if (i >= mt.steps.length) return end();
    const s = mt.steps[i], t = {...s, chart: s.chart ? {...s.chart, hideKenn: s.hideKenn} : null};
    /* 5.11: Folgefehler. Lag ein früherer Wert innerhalb der Toleranz, wird mit dem eigenen Wert weitergerechnet (sonst zählen 2° Ablesefehler doppelt) */
    if (s.folge) { const f = s.folge(results); if (f) t.sol = {...s.sol, ...f}; }
    const head = `<div class="card small" style="margin-top:6px">${NAV.linkTerms(mt.scen)}</div><p class="small muted" style="margin:6px 0 0">Teilaufgabe ${i + 1} von ${mt.steps.length}${opts.mode !== 'exam' ? ` · bisher ${pts} Punkte` : ''}${opts.extraHead ? ' · ' + opts.extraHead() : ''}</p>`;
    NAV.task(t, {title: opts.title, mode: opts.mode, head, back: opts.back, keep, nextLabel: i < mt.steps.length - 1 ? 'Nächste Teilaufgabe' : 'Auswertung',
      onResult: (ok, res, task, used, c) => {
        pts += ok ? 1 : 0; results.push({ok, step: s, res});
        if (c) keep = {lines: c.st.lines.slice(), marks: c.st.marks.slice(), vb: {...c.st.vb}};
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
const lekState = id => { const n = S_(); return n.lek[id] = n.lek[id] || {serie: 0, sterne: 0, n: 0}; };
NAV.path = function () {
  const L = NV.lektionen || [];
  gameShell('Lernpfad', `<p class="small muted" style="margin:6px 0 10px">Jede Lektion: Die Crew erklärt, dann geführte Übung, freie Übung und Meisterschaft. Drei richtige Aufgaben ohne Hilfe in Folge geben einen Stern. Ab Lektion 5 mit Stern darfst du im Törn selbst Kurse absetzen.</p>
    <div class="menu">${L.map((l, i) => { const s = lekState(l.id); return `<button class="menuitem" data-l="${l.id}"><b>${s.sterne ? '⭐ ' : ''}${i + 1}. ${esc(l.t)}</b><span class="small muted">${esc(l.d)}${s.n ? ` · ${s.n} Aufgaben gelöst` : ''}</span></button>`; }).join('')}</div>`);
  $('#gback').onclick = () => NAV.hub();
  app.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { AUD.click(); NAV.lesson(b.dataset.l); });
};
NAV.lesson = function (id) {
  const l = lekOf(id), s = lekState(id), cid2 = r => cid(r);
  gameShell(l.t, `<div class="card"><h2 style="margin:0 0 6px">${esc(l.t)}</h2>${l.crew.map(c => `<p style="margin:6px 0"><b>${esc(nameOf(c.s))}:</b> ${NAV.linkTerms(esc(c.t))}</p>`).join('')}
      <button class="btn small ghost" id="lread">▶ Vorlesen lassen</button></div>
    <div class="menu" style="margin-top:10px">
      <button class="menuitem" data-m="guided"><b>Geführte Übung</b><span class="small muted">Mit Hilfen und Kontrollwerten</span></button>
      <button class="menuitem" data-m="free"><b>Freie Übung</b><span class="small muted">Zufallsaufgaben, so viele du willst</span></button>
      <button class="menuitem" data-m="master"><b>Meisterschaft ${s.sterne ? '⭐' : `(${s.serie} von 3)`}</b><span class="small muted">Ohne Hilfe, drei richtig in Folge</span></button>
    </div>`);
  NAV.bindTerms(app);
  $('#gback').onclick = () => { VOX.stop(); NAV.path(); };
  $('#lread').onclick = () => { AUD.unlock(); VOX.stop(); VOX.lines(l.crew.map(c => ({cid: cid2(c.s), t: c.t})), 'fixed'); };
  app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { VOX.stop(); NAV.exercise(id, b.dataset.m); });
};
NAV.exercise = function (id, mode) {
  const l = lekOf(id), s = lekState(id), typ = pick(l.typen), task = GEN[typ]();
  const head = `<p class="small muted" style="margin:6px 0 0">${mode === 'guided' ? 'Geführte Übung' : mode === 'free' ? 'Freie Übung' : `Meisterschaft: ${s.serie} von 3 in Folge`}${s.sterne ? ' · ⭐' : ''}</p>`;
  if (task.steps) {
    /* Gesamtaufgabe: bestanden ab 7 von 9 Punkten (wie in der Prüfung) */
    if (mode === 'guided') task.steps.forEach(st => { st.hint = st.hilfe || GESAMT_HINTS[st.lek] || []; });
    const need = task.need || 7, all = task.steps.length;
    return NAV.multi(task, {title: l.t, mode, back: () => NAV.lesson(id), extraHead: () => mode === 'master' ? `Meisterschaft ${s.serie} von 3` : '', done: pts => {
      const ok = pts >= need; s.n++;
      if (mode === 'master') { s.serie = ok ? s.serie + 1 : 0; if (ok && s.serie >= 3 && !s.sterne) { s.sterne = 1; toast(`⭐ Stern für „${l.t}“!`); } }
      save(); AUD.sfx(ok ? 'richtig' : 'falsch', {vol: .5});
      gameShell(l.t, `<div class="card"><h2 style="margin:0" class="${ok ? 'pass' : 'fail'}">${pts} von ${all} Punkten</h2><p class="muted">${ok ? `Bestanden: Du brauchst mindestens ${need} Punkte.` : `Noch nicht: Du brauchst mindestens ${need} von ${all} Punkten.`}</p>
        <div class="row"><button class="btn lamp" id="again">Neue Gesamtaufgabe</button><button class="btn ghost" id="tol">Zur Lektion</button></div></div>`);
      $('#gback').onclick = () => NAV.lesson(id); $('#again').onclick = () => NAV.exercise(id, mode); $('#tol').onclick = () => NAV.lesson(id);
    }});
  }
  NAV.task(task, {title: l.t, mode, head, back: () => NAV.lesson(id), next: () => NAV.exercise(id, mode),
    onResult: (ok, res, t, usedHint) => {
      if (ok) s.n++;
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
  gameShell('Navigationsschule', `<p class="small muted" style="margin:6px 0 10px">Am Kartentisch der Kliev-Mündung. Die Karte ist erfunden und selbst gezeichnet, Maßstab etwa 1 : 100 000.</p>
    <div class="menu">
      <button class="menuitem" data-n="free"><b>Freie Karte</b><span class="small muted">Kursdreieck, Zirkel, Bleistift und Lupe ausprobieren</span></button>
      ${NAV.fibel ? `<button class="menuitem" data-n="fibel"><b>Navi-Fibel</b><span class="small muted">Alle Begriffe mit Erklärung und Merkhilfe</span></button>` : ''}
      ${NAV.path ? `<button class="menuitem" data-n="path"><b>Lernpfad</b><span class="small muted">${stars} von ${(NV.lektionen || []).length} Lektionen mit Stern</span></button>` : ''}
      ${NAV.exam ? `<button class="menuitem" data-n="exam"><b>Prüfungsmodus</b><span class="small muted">9 Teilaufgaben wie in der Prüfung, ohne Hilfen</span></button>` : ''}
      <button class="menuitem" data-n="old"><b>Amtliche Aufgaben</b><span class="small muted">Die 15 Originalaufgaben als Text (dafür brauchst du die BSH-Übungskarte 49)</span></button>
    </div>`);
  app.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { AUD.click(); const k = b.dataset.n; if (k === 'free') NAV.freeChart(); else if (k === 'old') navGame(); else if (NAV[k]) NAV[k](); });
};
})();
