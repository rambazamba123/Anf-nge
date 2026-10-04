/* ==========================================================================
   Skipper – Navigationsschule (5.5) und Törn (5.6)
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
const num = s => { if (s == null) return NaN; const m = String(s).replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? +m[0] : NaN; };
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
  K.namen.forEach(n => { const p = fromXY(n.xy); s += `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" class="nname${n.w ? ' w' : ''}${n.watt ? ' g' : ''}" style="font-size:${n.s}px" text-anchor="middle"${n.rot ? ` transform="rotate(${n.rot} ${p.x.toFixed(1)} ${p.y.toFixed(1)})"` : ''}>${n.t}</text>`; });
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
  const vbSet = v => { const r = svg.getBoundingClientRect(), asp = (r.height || 400) / (r.width || 400); v.h = v.w * asp; v.x = Math.max(-200, Math.min(W - v.w + 200, v.x)); v.y = Math.max(-200, Math.min(H - v.h + 200, v.y)); st.vb = v; svg.setAttribute('viewBox', `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}`); };
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
  };
  ctl.setTool(opt.tool || 'hand'); ink();
  return ctl;
};

/* ---------- Einstieg: Navigationsschule ---------- */
const CSS = `
.nwrap{position:relative;margin:0 -16px;height:62svh;min-height:360px;background:#fff;overflow:hidden;touch-action:none;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.nsvg{width:100%;height:100%;display:block;touch-action:none;user-select:none;-webkit-user-select:none}
.nsvg text{font-family:Helvetica,Arial,sans-serif}
.nlab{font-size:9px;fill:#222}.nlab.k{fill:#7a2a7a;font-size:8px}.rlab{font-size:9px;fill:#7a2a7a;text-anchor:middle}
.slab{font-size:10px;fill:#222}.scale path{stroke:#222;stroke-width:.8}.grid{stroke:#7a8a99;stroke-width:.5;stroke-dasharray:2 4}
.tief{font-size:10px;font-style:italic;fill:#333}.nname{font-style:italic;fill:#5a4a2a}.nname.w{fill:#2f5d7c}.nname.g{fill:#56703a}
.vtg{font-size:11px;fill:#a0306e}
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
`;
NAV.init = async function () {
  if (!document.getElementById('navicss')) { const s = document.createElement('style'); s.id = 'navicss'; s.textContent = CSS; document.head.appendChild(s); }
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
