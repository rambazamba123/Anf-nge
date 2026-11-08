/* ==========================================================================
   Skipper – Animationen, zweiter Teil (v5.29, Nutzer 08.11.2026: „animiere alle fehlenden“)
   Wird von anim.js nachgeladen (ANIM.bereit). Liste und Status: docs/animationen-liste.md (Nummern A1.1 …, B1.1 …).
   Szenen-Baukasten: szene(id, {titel, nr, gruppe, art, folge, wo, bg, obj: {name: svg}, start: {name: {x, y, r, o, s}},
     phasen: [{wer, t, min, cap, dur, k: {name: {x, y, r, o, s, weg: [[x, y] …], dreh}}, an: [namen], aus: [namen], fx(svg, tp, st)}], fx(svg, tp, p, st)})
   Jede Phase bewegt die Teile vom Stand am Ende der vorigen Phase zum neuen Stand (◀ und ▶ springen sauber).
   Gesprochenes versteht man auch ohne Bild (Nutzer 29.10.2026). Fachlich nach data/sbf.json, ohne quellen/ geprüft (R8).
   Das Boot ist überall „unsere Frieda“: weißer Rumpf, roter Streifen, graues Kajütdach, Außenborder (Q3, 01.11.2026).
   ========================================================================== */
(() => {
const A = window.ANIM; if (!A || A.szene) return;
const ez = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u), lp = (a, b, u) => a + (b - a) * u;
const q = (s, sel) => s.querySelector(sel), qa = (s, sel) => s.querySelectorAll(sel);
const T = (x, y, txt, a = 'middle', sz = 13, cls = '') => `<text class="t ${cls}" x="${x}" y="${y}" text-anchor="${a}" font-size="${sz}">${txt}</text>`;
const g = (inner, at = '') => `<g ${at}>${inner}</g>`;

/* ---------- Stile ---------- */
(() => { if (document.getElementById('ancss2')) return; const s = document.createElement('style'); s.id = 'ancss2';
  s.textContent = `.an .bl{animation:anbl 1s steps(1) infinite}@keyframes anbl{50%{opacity:.12}}.an .fl{stroke-dasharray:9 7;animation:anfl .9s linear infinite}@keyframes anfl{to{stroke-dashoffset:-16}}
.an .pu{animation:anpu 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}@keyframes anpu{50%{transform:scale(1.18)}}.an .t.cap{font-size:15px}.an .t.w{fill:#fff;stroke:#16222e}.an .t.r{fill:#c0392b}.an .t.gr{fill:#1f7a3a}.an .t.b{fill:#1f5f99}
.an .hl{stroke:#f08a1c;stroke-width:3;fill:none;stroke-dasharray:6 4}`;
  document.head.appendChild(s); })();

/* ---------- Bausteine ---------- */
const B = A.bau = {};
const WS = (n, f = '#fff', op = .35) => Array.from({length: n}, (_, i) => { const x = (i * 97) % 380 + 10, y = (i * 61) % 270 + 20; return `<path d="M${x} ${y} q8 -5 16 0 t16 0" stroke="${f}" stroke-opacity="${op}" stroke-width="2" fill="none"/>`; }).join('');
B.wasser = (c = '#5ba7cf') => `<rect width="400" height="300" fill="${c}"/>${WS(14)}`;
B.karte = () => `<rect width="400" height="300" fill="#f3ead2"/><g stroke="#d9cba6" stroke-width="1">${[60, 120, 180, 240].map(y => `<path d="M0 ${y}H400"/>`).join('')}${[80, 160, 240, 320].map(x => `<path d="M${x} 0V300"/>`).join('')}</g>`;
B.tag = (see = 190) => `<rect width="400" height="${see}" fill="#bfe0f2"/><rect y="${see}" width="400" height="${300 - see}" fill="#4d93bd"/>${Array.from({length: 7}, (_, i) => `<path d="M${i * 60 + 10} ${see + 30 + (i % 3) * 22} q8 -5 16 0 t16 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`).join('')}`;
B.nacht = (see = 190) => `<rect width="400" height="${see}" fill="#142033"/><rect y="${see}" width="400" height="${300 - see}" fill="#0b1726"/>${Array.from({length: 18}, (_, i) => `<circle cx="${(i * 83) % 390 + 5}" cy="${(i * 37) % (see - 30) + 8}" r="${i % 3 ? 1 : 1.6}" fill="#fff" opacity=".7"/>`).join('')}`;
B.nebel = (op = .62) => `<rect width="400" height="300" fill="#e8edf0" opacity="${op}"/>`;
B.pier = (x = 0, w = 60) => `<rect x="${x}" width="${w}" height="300" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>${[40, 90, 140, 190, 240, 290].map(y => `<path d="M${x} ${y}H${x + w}" stroke="#8a6a44" stroke-width="2"/>`).join('')}`;
B.ufer = (d, c = '#a9c48a') => `<path d="${d}" fill="${c}" stroke="#7d9a62" stroke-width="2"/>`;
/* unsere Frieda von oben, Bug nach oben, 60 lang; lichter = Seitenlichter zeigen */
B.boot = (o = {}) => `<path d="M0 -30 C11 -20 12 6 10 28 L-10 28 C-12 6 -11 -20 0 -30Z" fill="#fbf8f2" stroke="#6f6252" stroke-width="2"/><path d="M0 -26 C8.5 -18 9.5 6 8 25 M0 -26 C-8.5 -18 -9.5 6 -8 25" stroke="#c0392b" stroke-width="1.8" fill="none"/>
  <rect x="-6" y="-8" width="12" height="17" rx="3.5" fill="#cfd6db" stroke="#6f6252" stroke-width="1.4"/><rect x="-3.5" y="27" width="7" height="8" rx="2" fill="#3b3f44"/>${o.lichter ? '<circle cx="-10" cy="-6" r="2.6" fill="#e0413a"/><circle cx="10" cy="-6" r="2.6" fill="#2fb34f"/>' : ''}`;
B.schiff = (L = 150, W = 30, c = '#6b4f8a') => `<path d="M0 ${-L / 2} C${W / 2} ${-L / 2 + 30} ${W / 2} ${-L / 2 + 40} ${W / 2} 0 L${W / 2} ${L / 2 - 4} Q${W / 2} ${L / 2} ${W / 2 - 4} ${L / 2} L${-W / 2 + 4} ${L / 2} Q${-W / 2} ${L / 2} ${-W / 2} ${L / 2 - 4} L${-W / 2} 0 C${-W / 2} ${-L / 2 + 40} ${-W / 2} ${-L / 2 + 30} 0 ${-L / 2}Z" fill="${c}" stroke="#2c2238" stroke-width="2"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${-W / 2 + 4}" y="${-L / 2 + 34 + i * 18}" width="${W - 8}" height="15" fill="${['#d35400', '#2e86c1', '#27ae60', '#c0392b'][i]}" opacity=".9"/>`).join('')}<rect x="${-W / 2 + 3}" y="${L / 2 - 30}" width="${W - 6}" height="22" rx="3" fill="#f4efe6" stroke="#2c2238"/>`;
B.segler = (baum = 25) => `<path d="M0 -26 C9 -16 10 6 8 24 L-8 24 C-10 6 -9 -16 0 -26Z" fill="#fff6e0" stroke="#7a6a4a" stroke-width="1.8"/><circle cx="0" cy="-6" r="2.5" fill="#4a3a22"/><path d="M0 -6 Q${Math.sin(baum * Math.PI / 180) * 18 + 6} ${8} ${Math.sin(baum * Math.PI / 180) * 26} ${Math.cos(baum * Math.PI / 180) * 26 - 6}" stroke="#f5f5f5" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 -6 L${Math.sin(baum * Math.PI / 180) * 26} ${Math.cos(baum * Math.PI / 180) * 26 - 6}" stroke="#7a6a4a" stroke-width="1.5"/>`;
B.mensch = () => `<circle r="9" fill="#f08a1c" opacity=".9"/><circle r="4.5" fill="#f2c9a0" stroke="#7a5a3a"/>`;
B.ring = () => `<circle r="7" fill="none" stroke="#e84a3a" stroke-width="4"/><circle r="7" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="5.5 5.5"/>`;
B.pfeil = (x1, y1, x2, y2, c = '#f08a1c', w = 4, cls = '') => { const a = Math.atan2(y2 - y1, x2 - x1), h = 4 + w * 2.2, b = w * 1.6 + 3; const xa = x2 - Math.cos(a) * h, ya = y2 - Math.sin(a) * h;
  return `<path class="${cls}" d="M${x1} ${y1} L${xa.toFixed(1)} ${ya.toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"/><path d="M${x2} ${y2} L${(xa + Math.sin(a) * b).toFixed(1)} ${(ya - Math.cos(a) * b).toFixed(1)} L${(xa - Math.sin(a) * b).toFixed(1)} ${(ya + Math.cos(a) * b).toFixed(1)}Z" fill="${c}"/>`; };
B.licht = (x, y, c, r = 4.5, cls = '') => `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="${c}" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/></g>`;
const LF = {w: '#fff7d6', r: '#ff4a3d', g: '#3ddc6a', y: '#ffc93d', b: '#5aa0ff'};
B.ball = (x, y, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#151515"/>`;
B.kegel = (x, y, oben = true, r = 8) => oben ? `<path d="M${x} ${y - r} L${x + r} ${y + r * .7} L${x - r} ${y + r * .7}Z" fill="#151515"/>` : `<path d="M${x} ${y + r} L${x + r} ${y - r * .7} L${x - r} ${y - r * .7}Z" fill="#151515"/>`;
B.rhombus = (x, y, r = 8) => `<path d="M${x} ${y - r * 1.25} L${x + r} ${y} L${x} ${y + r * 1.25} L${x - r} ${y}Z" fill="#151515"/>`;
B.zylinder = (x, y) => `<rect x="${x - 7}" y="${y - 10}" width="14" height="20" fill="#151515"/>`;
/* Schiff von der Seite (Steuerbord zu uns, Bug nach rechts): Rumpf von -L/2 bis L/2 an der Wasserlinie 0; masten [x, h] */
B.seite = (L = 200, masten = [[40, 70]], c = '#4a4f57', aufbau = true) => `<path d="M${-L / 2} -16 L${L / 2 - 14} -16 L${L / 2} -26 L${L / 2 - 6} 8 L${-L / 2 + 8} 8Z" fill="${c}" stroke="#222" stroke-width="1.5"/>
  ${aufbau ? `<rect x="${-L / 2 + 14}" y="-42" width="${L * .22}" height="26" fill="#eee8dc" stroke="#222" stroke-width="1.2"/>` : ''}${masten.map(([x, h]) => `<path d="M${x} -16 V${-16 - h}" stroke="#222" stroke-width="2.5"/>`).join('')}`;
/* Tonnen von der Seite, Fuß auf der Wasserlinie (0) */
const KOE = {rot: '#c9302c', gruen: '#1f8f4e', gelb: '#f2c200', schwarz: '#1d1d1d', weiss: '#f6f6f6'};
B.tonne = (art, o = {}) => {
  const body = (bands, w = 15, h = 34) => { const bh = h / bands.length; return bands.map((c, i) => `<rect x="${-w / 2}" y="${-h - 4 + i * bh}" width="${w}" height="${bh + .5}" fill="${KOE[c]}"/>`).join('') + `<rect x="${-w / 2}" y="${-h - 4}" width="${w}" height="${h}" fill="none" stroke="#222" stroke-width="1.3"/>`; };
  const fuss = `<path d="M-13 -4 Q0 4 13 -4 L10 2 Q0 7 -10 2Z" fill="#555"/>`, st = `<path d="M0 -38 V-46" stroke="#222" stroke-width="2"/>`;
  const K = (y, up, c = '#1d1d1d') => up ? `<path d="M0 ${y - 7} L6 ${y + 2} L-6 ${y + 2}Z" fill="${c}"/>` : `<path d="M0 ${y + 2} L6 ${y - 7} L-6 ${y - 7}Z" fill="${c}"/>`;
  const S = {
    rot: `<path d="M-9 -4 L-9 -34 L9 -34 L9 -4Z" fill="${KOE.rot}" stroke="#222" stroke-width="1.3"/>${o.topp !== false ? `${st}<rect x="-5" y="-56" width="10" height="10" fill="${KOE.rot}"/>` : ''}`,
    gruen: `<path d="M-10 -4 L0 -40 L10 -4Z" fill="${KOE.gruen}" stroke="#222" stroke-width="1.3"/>${o.topp !== false ? `<path d="M0 -40 V-46" stroke="#222" stroke-width="2"/><path d="M0 -58 L6 -47 L-6 -47Z" fill="${KOE.gruen}"/>` : ''}`,
    nord: body(['schwarz', 'gelb']) + st + K(-58, true) + K(-49, true),
    sued: body(['gelb', 'schwarz']) + st + K(-49, false) + K(-58, false),
    ost: body(['schwarz', 'gelb', 'schwarz']) + st + K(-60, true) + K(-49, false),
    west: body(['gelb', 'schwarz', 'gelb']) + st + K(-58, false) + K(-51, true),
    einzel: body(['schwarz', 'rot', 'schwarz']) + st + '<circle cy="-50" r="4.5" fill="#1d1d1d"/><circle cy="-60" r="4.5" fill="#1d1d1d"/>',
    gelb: body(['gelb']) + st + '<path d="M-6 -60 L6 -48 M6 -60 L-6 -48" stroke="#f2c200" stroke-width="3.5"/>',
    mitte: `<rect x="-7.5" y="-38" width="15" height="34" fill="#f6f6f6" stroke="#222" stroke-width="1.3"/>${[-5, 0, 5].map(x => `<rect x="${x - 1.6}" y="-38" width="3.2" height="34" fill="${KOE.rot}"/>`).join('')}${st}<circle cy="-51" r="5" fill="${KOE.rot}"/>`};
  return fuss + (S[art] || '') + (o.nr != null ? T(0, 14, o.nr, 'middle', 10, 'w') : '');
};
/* Tonne von oben (klein) */
B.punkt = (c, r = 6) => `<circle r="${r}" fill="${KOE[c] || c}" stroke="#222" stroke-width="1.3"/>`;
B.kasten = (x, y, w, h, txt, c = '#fff8ea') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c}" stroke="#7a6a56" stroke-width="1.5"/>${T(x + w / 2, y + h / 2 + 5, txt, 'middle', 13)}`;
B.haken = (x, y) => `<path d="M${x - 6} ${y} l4 5 l9 -11" stroke="#1f9a3c" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
B.kreuz = (x, y) => `<path d="M${x - 6} ${y - 6} l12 12 M${x + 6} ${y - 6} l-12 12" stroke="#c0392b" stroke-width="3.5" stroke-linecap="round"/>`;

/* ---------- Szenen-Motor ---------- */
const ST0 = {x: 0, y: 0, r: 0, o: 1, s: 1};
const wegPunkte = (von, k) => [[von.x, von.y], ...k.weg];
const wegLen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
const wegAt = (pts, u, dreh = 0) => { const L = wegLen(pts) * u; let s = 0;
  for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (s + d >= L || i === pts.length - 1) { const v = d ? Math.min(1, (L - s) / d) : 1; return {x: lp(a[0], b[0], v), y: lp(a[1], b[1], v), r: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + 90 + dreh}; } s += d; }
  return {x: pts[0][0], y: pts[0][1], r: dreh}; };
const kVon = ph => { const k = {...(ph.k || {})}; (ph.an || []).forEach(n => { k[n] = {...(k[n] || {}), o: 1}; }); (ph.aus || []).forEach(n => { k[n] = {...(k[n] || {}), o: 0}; }); return k; };
const ziel = (von, k) => { if (!k) return von; const z = {...von, ...k}; delete z.weg; delete z.dreh; if (k.weg) { const e = wegAt(wegPunkte(von, k), 1, k.dreh || 0); z.x = e.x; z.y = e.y; if (k.r == null) z.r = e.r; } return z; };
const winkel = (a, b) => { let d = ((b - a) % 360 + 540) % 360 - 180; return a + d; };
A.szene = function (id, o) {
  const namen = Object.keys(o.obj || {});
  /* v5.30: o.vb [Breite, Höhe] (Hochformat 400 × 500 im Test), o.gross = größere Schrift, o.marke = Marke „Prüfung“ oder „Wissen“ je Phase oben rechts (O170, Feld pr in der Phase, Standard aus art) */
  const vb = o.vb || [400, 300], W = vb[0], Hh = vb[1], gr = o.gross ? 1.35 : 1;
  const marke = o.marke ? `<g class="marke" transform="translate(${W - 8} 8)"><rect x="-112" y="0" width="112" height="28" rx="14" fill="#1f5f99"/><text class="t w" x="-56" y="19" text-anchor="middle" font-size="14"></text></g>` : '';
  const svg = (o.bg || '') + namen.map(n => `<g data-o="${n}">${o.obj[n]}</g>`).join('') + (o.oben || '') + T(o.marke ? (W - 120) / 2 : W / 2, 26 * gr, '', 'middle', 15 * gr, 'cap') + T(W / 2, Hh - 9, '', 'middle', 12 * gr, 'sub') + marke;
  const stand = p => { const st = {}; namen.forEach(n => { st[n] = {...ST0, ...((o.start || {})[n] || {})}; }); for (let i = 0; i < p; i++) { const k = kVon(o.phasen[i]); namen.forEach(n => { st[n] = ziel(st[n], k[n]); }); } return st; };
  const zeichne = (s, st) => namen.forEach(n => { const e = s.querySelector(`[data-o="${n}"]`), v = st[n]; if (!e) return; e.setAttribute('transform', `translate(${v.x.toFixed(1)} ${v.y.toFixed(1)}) rotate(${v.r.toFixed(1)}) scale(${v.s.toFixed(3)})`); e.setAttribute('opacity', Math.max(0, Math.min(1, v.o)).toFixed(2)); });
  A.defs[id] = {id, titel: o.titel, nr: o.nr, gruppe: o.gruppe, art: o.art || 'pruefung', folge: o.folge || '', wo: o.wo || '', neu: o.neu || '5.29', vb: o.vb, svg, phasen: o.phasen,
    enter(s, p, st) { st.von = stand(p); st.k = kVon(o.phasen[p] || {}); st.dur = (o.phasen[p] || {}).dur ?? 2.4; q(s, '.cap').textContent = (o.phasen[p] || {}).cap || ''; q(s, '.sub').textContent = (o.phasen[p] || {}).sub || '';
      const mk = q(s, '.marke'); if (mk) { const pr = (o.phasen[p] || {}).pr ?? (o.art || 'pruefung') === 'pruefung'; mk.querySelector('rect').setAttribute('fill', pr ? '#1f5f99' : '#6a8f3a'); mk.querySelector('text').textContent = pr ? '📋 Prüfung' : '💡 Wissen'; }
      if (o.enter) o.enter(s, p, st); zeichne(s, st.von); },
    tick(s, tp, p, st) {
      const u = st.dur ? ez(tp / st.dur) : 1, cur = {};
      namen.forEach(n => { const v = st.von[n], k = st.k[n]; if (!k) { cur[n] = v; return; }
        if (k.weg) { const w = wegAt(wegPunkte(v, k), u, k.dreh || 0); cur[n] = {...v, x: w.x, y: w.y, r: k.r != null ? lp(v.r, k.r, u) : lp(v.r, winkel(v.r, w.r), Math.min(1, u * 6)), o: lp(v.o, k.o ?? v.o, u), s: lp(v.s, k.s ?? v.s, u)}; }
        else { const z = ziel(v, k); cur[n] = {x: lp(v.x, z.x, u), y: lp(v.y, z.y, u), r: lp(v.r, winkel(v.r, z.r), u), o: lp(v.o, z.o, u), s: lp(v.s, z.s, u)}; } });
      zeichne(s, cur); const ph = o.phasen[p] || {}; if (ph.fx) ph.fx(s, tp, st, cur); if (o.fx) o.fx(s, tp, p, st, cur); }};
  A.order.push(id);
};
const S = A.szene;
const P = (wer, t, rest = {}) => ({wer, t, min: Math.max(4, Math.round(t.length / 15)), ...rest});
const H = 'hinnerk', M = 'smilla', K = 'klabauter';

/* ======================= A1 Boot, Antrieb, Motor ======================= */
S('boot', {titel: 'Das Boot und seine Seiten', nr: 'A1.1', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G1.2',
  bg: B.wasser(), obj: {boot: B.boot({lichter: true}), bug: T(0, 0, 'Bug', 'middle', 15), heck: T(0, 0, 'Heck', 'middle', 15), bb: T(0, 0, 'Backbord', 'middle', 15, 'r'), sb: T(0, 0, 'Steuerbord', 'middle', 15, 'gr'),
    voraus: B.pfeil(0, 0, 0, -46, '#fff', 4), achtern: B.pfeil(0, 0, 0, 46, '#fff', 4), querab: B.pfeil(0, 0, 70, 0, '#f2c200', 4) + B.pfeil(0, 0, -70, 0, '#f2c200', 4), mitte: '<path d="M-60 0 H60" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/>', mtx: T(0, 0, 'mittschiffs', 'middle', 12)},
  start: {boot: {x: 200, y: 160, s: 2.6}, bug: {x: 200, y: 64, o: 0}, heck: {x: 200, y: 268, o: 0}, bb: {x: 95, y: 150, o: 0}, sb: {x: 310, y: 150, o: 0}, voraus: {x: 200, y: 70, o: 0}, achtern: {x: 200, y: 250, o: 0}, querab: {x: 200, y: 160, o: 0}, mitte: {x: 200, y: 160, o: 0}, mtx: {x: 200, y: 180, o: 0}},
  phasen: [P(H, 'Das ist unsere Frieda von oben. Vorne ist der Bug, hinten das Heck.', {cap: 'Bug und Heck', an: ['bug', 'heck']}),
    P(M, 'In Fahrtrichtung links ist Backbord, rechts Steuerbord. Backbord hat das rote Licht, Steuerbord das grüne.', {cap: 'Backbord rot, Steuerbord grün', an: ['bb', 'sb']}),
    P(H, 'Nach vorn heißt voraus, nach hinten achteraus. Was seitlich im rechten Winkel liegt, liegt querab.', {cap: 'voraus, achteraus, querab', an: ['voraus', 'achtern', 'querab'], aus: ['bug', 'heck']}),
    P(M, 'Und die Mitte des Bootes, von Seite zu Seite, nennt man mittschiffs. Ruder mittschiffs heißt: geradeaus.', {cap: 'mittschiffs', an: ['mitte', 'mtx'], aus: ['querab']}),
    P(K, 'Backbord rot! Rot! Wie Portwein!', {cap: 'Merkwort: Backbord rot wie Portwein', an: ['bb', 'sb', 'bug', 'heck']})]});

S('wind', {titel: 'Luv und Lee', nr: 'A1.1b', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G1.2',
  bg: B.wasser(), obj: {boot: B.boot(), wind: [0, 30, 60].map(d => B.pfeil(-70, d - 30, -20, d - 30, '#fff', 3, 'fl')).join(''), luv: '<path d="M-30 -40 Q-44 0 -30 40" stroke="#f2c200" stroke-width="7" fill="none" opacity=".8"/>', lee: '<path d="M30 -40 Q44 0 30 40" stroke="#5a7d9a" stroke-width="7" fill="none" opacity=".8"/>', tluv: T(0, 0, 'Luv', 'middle', 16), tlee: T(0, 0, 'Lee', 'middle', 16)},
  start: {boot: {x: 210, y: 160, s: 2.2}, wind: {x: 160, y: 160, o: 0}, luv: {x: 210, y: 160, o: 0}, lee: {x: 210, y: 160, o: 0}, tluv: {x: 140, y: 100, o: 0}, tlee: {x: 290, y: 100, o: 0}},
  phasen: [P(H, 'Der Wind kommt von Backbord, also von links.', {cap: 'Wind von Backbord', an: ['wind']}),
    P(M, 'Die Seite, die dem Wind zugewandt ist, heißt Luv. Da kommt die Luft her.', {cap: 'Luv: dem Wind zugewandt', an: ['luv', 'tluv']}),
    P(M, 'Die Seite, die vom Wind abgewandt ist, heißt Lee. Da ist es ruhiger, dort wird gespuckt und gekotzt.', {cap: 'Lee: vom Wind abgewandt', an: ['lee', 'tlee']}),
    P(H, 'Dreht der Wind auf die andere Seite, tauschen Luv und Lee. Es hängt immer am Wind, nicht am Boot.', {cap: 'Wind dreht: Luv und Lee tauschen', k: {wind: {x: 260, r: 180}, tluv: {x: 290}, tlee: {x: 140}, luv: {r: 180}, lee: {r: 180}}})]});

S('radoben', {titel: 'Radeffekt von oben: Anlegeseite', nr: 'A1.3', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G2.1, G3.1',
  bg: B.wasser() + B.pier(0, 60), obj: {boot: B.boot(), p1: B.pfeil(0, 0, -34, 0, '#f08a1c', 5), schaum: '<g fill="#fff" opacity=".8"><circle cx="-6" cy="40" r="4"/><circle cx="5" cy="46" r="3"/><circle cx="-2" cy="54" r="3.5"/></g>'},
  start: {boot: {x: 250, y: 150}, p1: {x: 250, y: 178, o: 0}, schaum: {x: 250, y: 150, o: 0}},
  phasen: [P(H, 'Im freien Wasser legst du den Rückwärtsgang ein. Der rechtsdrehende Propeller zieht das Heck nach Backbord.', {cap: 'Rückwärts: Heck nach Backbord', k: {boot: {r: 18, y: 175}, p1: {x: 238, y: 205, o: 1}, schaum: {o: 1}}}),
    P(M, 'Jetzt legen wir mit Backbord an. Spitz anfahren, kurz vor der Pier aufstoppen, also rückwärts einkuppeln.', {cap: 'Anlegen mit Backbord', aus: ['p1', 'schaum'], k: {boot: {x: 140, y: 160, r: -30}}, dur: 3}),
    P(H, 'Der Radeffekt zieht das Heck an die Pier. Das Boot legt sich von allein schön parallel.', {cap: 'Der Radeffekt hilft', k: {boot: {x: 92, y: 150, r: 0}, p1: {x: 100, y: 182, o: 1}}}),
    P(M, 'Andersherum, mit Steuerbord an der Pier …', {cap: 'Jetzt mit Steuerbord an der Pier', aus: ['p1'], k: {boot: {x: 92, y: 150, r: 180}}, dur: .2}),
    P(H, '… zieht das Heck beim Aufstoppen weg vom Steg. Darum ist mit rechtsdrehendem Propeller die Backbordseite die bessere.', {cap: 'Steuerbordseite: Heck zieht weg', k: {boot: {x: 112, r: 205}}, dur: 2.5})]});

S('motor', {titel: 'Die vier Kreisläufe des Motors', nr: 'A1.5', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G2.2',
  bg: `<rect width="400" height="300" fill="#efe7d6"/><rect x="150" y="105" width="110" height="80" rx="12" fill="#7d8a94" stroke="#3b444b" stroke-width="3"/>${T(205, 150, 'Motor', 'middle', 16, 'w')}`,
  obj: {kw: `<path d="M40 250 H100 V200 H150" stroke="#2e86c1" stroke-width="6" fill="none" class="fl"/><path d="M260 130 H330 V250" stroke="#2e86c1" stroke-width="6" fill="none" class="fl"/>${T(40, 270, 'Seeventil', 'start', 11)}${T(100, 192, 'Impeller', 'middle', 11)}${T(334, 270, 'Auspuff', 'middle', 11)}`,
    oel: `<path d="M175 185 V215 H235 V185" stroke="#c98a12" stroke-width="6" fill="none" class="fl"/>${T(205, 232, 'Öl', 'middle', 12)}`,
    sprit: `<rect x="20" y="60" width="60" height="40" rx="6" fill="#c0392b"/>${T(50, 85, 'Tank', 'middle', 12, 'w')}<path d="M80 80 H120 V125 H150" stroke="#c0392b" stroke-width="6" fill="none" class="fl"/>${T(118, 72, 'Filter', 'middle', 11)}`,
    strom: `<rect x="300" y="40" width="70" height="36" rx="5" fill="#2b2b2b"/>${T(335, 63, 'Batterie', 'middle', 11, 'w')}<path d="M300 58 H240 V105" stroke="#f2c200" stroke-width="6" fill="none" class="fl"/>${T(255, 50, 'Lichtmaschine lädt', 'middle', 11)}`,
    lampen: `${[['🌡️', 'Temperatur'], ['🛢️', 'Öldruck'], ['🔋', 'Ladung']].map(([i, t], n) => `<g transform="translate(${150 + n * 56} 252)"><circle r="13" fill="#e74c3c" class="bl"/>${T(0, 5, i, 'middle', 13)}${T(0, 30, t, 'middle', 10)}</g>`).join('')}`},
  start: {kw: {o: 0}, oel: {o: 0}, sprit: {o: 0}, strom: {o: 0}, lampen: {o: 0}},
  phasen: [P(H, 'Kühlwasser: Durchs Seeventil kommt Wasser, der Impeller pumpt es durch den Motor, und es kommt hinten wieder raus. Kein Kontrollstrahl, sofort Motor aus!', {cap: '1 Kühlwasser', an: ['kw']}),
    P(M, 'Öl schmiert den Motor. Die Öldruckleuchte muss nach dem Start ausgehen.', {cap: '2 Öl', an: ['oel']}),
    P(H, 'Kraftstoff kommt aus dem Tank über den Filter zum Motor. Ist der Tank voll und der Motor geht aus, ist oft die Belüftung zu oder die Leitung verstopft.', {cap: '3 Kraftstoff', an: ['sprit']}),
    P(M, 'Strom: Die Batterie startet, die Lichtmaschine lädt sie wieder auf. Bleibt die Ladekontrolle an, lädt nichts.', {cap: '4 Strom', an: ['strom']}),
    P(H, 'Wird es zu heiß, liegt es oft am Thermostat, am Impeller, am zuen Seeventil oder zu wenig Kühlwasser. Leuchtet was, guck nach.', {cap: 'Warnleuchten im Blick', an: ['lampen']})]});

S('tanken', {titel: 'Tanken ohne Knall', nr: 'A1.8', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G4.1',
  bg: B.tag(200) + `<rect x="0" y="170" width="140" height="30" fill="#b98750"/><rect x="40" y="90" width="40" height="80" rx="6" fill="#d9534f" stroke="#7a2a28" stroke-width="2"/>${T(60, 120, '⛽', 'middle', 22)}`,
  obj: {boot: B.seite(140, [], '#fbf8f2') + '<path d="M-70 -4 H56" stroke="#c0392b" stroke-width="3"/>', schlauch: '<path d="M80 130 Q120 150 150 168" stroke="#222" stroke-width="4" fill="none"/>',
    l: [['Motor aus', 0], ['Gas und Kocher aus', 1], ['Nicht rauchen, keine Flamme', 2], ['Luken zu', 3], ['Nichts überlaufen lassen', 4], ['Vor dem Start lüften', 5]].map(([t, i]) => `<g class="ln" data-i="${i}" opacity="0" transform="translate(212 ${46 + i * 22})">${B.haken(0, 0)}${T(12, 5, t, 'start', 12)}</g>`).join(''),
    gas: '<g opacity=".7">' + [0, 1, 2, 3, 4].map(i => `<circle cx="${-40 + i * 18}" cy="${-4 + (i % 2) * 6}" r="7" fill="#9bd16a"/>`).join('') + '</g>'},
  start: {boot: {x: 210, y: 200}, schlauch: {o: 0}, gas: {x: 210, y: 210, o: 0}},
  phasen: [P(H, 'Bevor getankt wird: Motor aus, Gas aus, keine Zigarette, keine Pfeife. Auch meine nicht.', {cap: 'Vor dem Tanken', fx: s => qa(s, '.ln').forEach(e => e.setAttribute('opacity', +e.dataset.i < 3 ? 1 : 0))}),
    P(M, 'Luken und Türen zu, damit keine Dämpfe ins Boot ziehen. Langsam tanken, nichts überlaufen lassen.', {cap: 'Beim Tanken', an: ['schlauch'], fx: s => qa(s, '.ln').forEach(e => e.setAttribute('opacity', +e.dataset.i < 5 ? 1 : 0))}),
    P(H, 'Benzindampf ist schwerer als Luft und sammelt sich unten in der Bilge. Darum vor dem Start lüften, sonst knallt es.', {cap: 'Dämpfe sinken in die Bilge', aus: ['schlauch'], an: ['gas'], fx: s => qa(s, '.ln').forEach(e => e.setAttribute('opacity', 1))})]});

/* ======================= A2 Anlegen, Ankern, Manöver ======================= */
S('ablegen', {titel: 'Ablegen mit Wind', nr: 'A2.2', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'S10.2',
  bg: B.wasser() + B.pier(0, 60) + '<circle cx="54" cy="70" r="6" fill="#333"/><circle cx="54" cy="240" r="6" fill="#333"/>',
  obj: {boot: B.boot(), wind: [0, 50, 100].map(d => B.pfeil(0, d, 60, d, '#fff', 3, 'fl')).join(''), spring: '', tw: T(0, 0, '', 'middle', 13)},
  start: {boot: {x: 92, y: 150}, wind: {x: 150, y: 100, o: 0}, tw: {x: 250, y: 60}},
  enter(s, p) { q(s, '[data-o="tw"] text').textContent = p < 2 ? 'Wind ablandig (vom Steg weg)' : 'Wind auflandig (drückt an den Steg)'; },
  phasen: [P(H, 'Weht der Wind vom Steg weg, ist es leicht: Leinen los, und der Wind schiebt uns frei.', {cap: 'Ablandiger Wind', an: ['wind']}),
    P(M, 'Wir treiben quer vom Steg ab, dann langsam voraus.', {cap: 'Frei treiben, dann voraus', k: {boot: {x: 150}}, dur: 3}),
    P(H, 'Drückt der Wind auf den Steg, kommt man so nicht weg. Dann dampft man in die Vorspring ein: Leine vorn bleibt fest, langsam voraus, Ruder zum Steg.', {cap: 'Auflandig: in die Vorspring eindampfen', k: {boot: {x: 92, y: 150, r: 0}, wind: {x: 250, r: 180}}, dur: .1, fx: (s, tp) => { const b = q(s, '[data-o="spring"]'); b.innerHTML = `<path d="M100 ${135} L54 70" stroke="#e8c46a" stroke-width="3"/>`; }}),
    P(M, 'Das Heck dreht vom Steg weg. Ein Fender vorne schützt den Bug.', {cap: 'Heck schwenkt aus', k: {boot: {r: -35, x: 98}}, dur: 2.5, fx: s => { q(s, '[data-o="spring"]').innerHTML = '<path d="M96 125 L54 70" stroke="#e8c46a" stroke-width="3"/>'; }}),
    P(H, 'Jetzt Spring los und rückwärts weg vom Steg. Erst wenn wir frei sind, voraus.', {cap: 'Rückwärts frei, dann voraus', k: {boot: {weg: [[150, 190], [200, 210]], dreh: 180}}, dur: 3, fx: s => { q(s, '[data-o="spring"]').innerHTML = ''; }})]});

S('ankern', {titel: 'Ankern', nr: 'A2.3', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'G3.1, S3.2',
  bg: `<rect width="400" height="120" fill="#bfe0f2"/><rect y="120" width="400" height="180" fill="#4d93bd"/><path d="M0 262 Q100 250 200 266 T400 258 V300 H0Z" fill="#c9b27c"/>${T(370, 150, 'Tiefe', 'end', 11, 'w')}<path d="M376 122 V258" stroke="#fff" stroke-width="2" stroke-dasharray="4 3"/>`,
  obj: {boot: B.seite(90, [[0, 30]], '#fbf8f2', false) + '<rect x="-14" y="-30" width="30" height="14" fill="#cfd6db" stroke="#555"/>', ball: B.ball(0, -54, 6), kette: '<path id="kt" stroke="#3a3a3a" stroke-width="3" fill="none"/>', anker: '<path d="M0 -10 V8 M-8 2 Q0 12 8 2" stroke="#2b2b2b" stroke-width="3.5" fill="none"/>', peil: '<path d="M0 0 L-170 -40" stroke="#f2c200" stroke-width="2" stroke-dasharray="5 4"/>' + T(-120, -46, 'Ankerpeilung', 'middle', 11)},
  start: {boot: {x: 300, y: 120}, ball: {x: 300, y: 120, o: 0}, anker: {x: 300, y: 130, o: 0}, peil: {x: 300, y: 100, o: 0}},
  enter(s, p, st) { st.ky = p; },
  fx(s, tp, p, st, c) { const b = c.boot, a = c.anker; const k = q(s, '#kt'); if (!k) return; if (c.anker.o < .05) { k.setAttribute('d', ''); return; } k.setAttribute('d', `M${b.x - 40} ${b.y - 4} Q${(b.x - 40 + a.x) / 2} ${Math.max(b.y + 40, 250)} ${a.x} ${a.y - 8}`); },
  phasen: [P(H, 'Wir fahren langsam gegen den Wind und stoppen auf. Erst wenn das Boot steht, geht der Anker runter.', {cap: 'Gegen den Wind aufstoppen', k: {boot: {x: 260}}}),
    P(M, 'Anker fallen lassen, dann langsam rückwärts und Kette stecken. Etwa drei- bis fünfmal so viel Kette wie das Wasser tief ist, mit Leine mehr.', {cap: 'Kette stecken: ein Vielfaches der Tiefe', k: {anker: {o: 1, x: 250, y: 255}, boot: {x: 330}}, dur: 3}),
    P(H, 'Kurz rückwärts einfahren, damit der Anker sich eingräbt. Dann Hand auf die Kette.', {cap: 'Anker einfahren', k: {boot: {x: 340}}}),
    P(M, 'Hält er? Wenn die Kette nicht ruckt und sich die Peilung zu einer Landmarke nicht ändert, hält er.', {cap: 'Hält er? Kette und Ankerpeilung', an: ['peil']}),
    P(H, 'Tagsüber zeigt ein Ankerlieger einen schwarzen Ball, nachts ein weißes Rundumlicht.', {cap: 'Ankerball am Tag', an: ['ball'], aus: ['peil'], k: {ball: {x: 340}}})]});

S('wenden', {titel: 'Wenden auf engem Raum', nr: 'A2.5', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'S10.2',
  bg: B.wasser() + B.ufer('M0 0 H400 V60 H0Z') + B.ufer('M0 240 H400 V300 H0Z'), obj: {boot: B.boot(), ruder: '', info: T(0, 0, '', 'middle', 12)},
  start: {boot: {x: 120, y: 150, r: 90}},
  phasen: [P(H, 'Der Kanal ist eng. Wir drehen über Steuerbord, weil uns da der Radeffekt hilft.', {cap: 'Drehen über Steuerbord', k: {boot: {x: 190}}}),
    P(M, 'Ruder hart Steuerbord und kurz voraus. Der Bug geht nach rechts.', {cap: 'Ruder hart Steuerbord, kurz voraus', k: {boot: {x: 215, y: 160, r: 150}}, dur: 2.5}),
    P(H, 'Auskuppeln, dann kurz rückwärts. Das Heck zieht nach Backbord, das Boot dreht weiter.', {cap: 'Kurz rückwärts: Heck nach Backbord', k: {boot: {x: 205, y: 150, r: 215}}, dur: 2.5}),
    P(M, 'Wieder voraus, Ruder hart Steuerbord. Noch ein Stück, und wir sind rum.', {cap: 'Wieder voraus', k: {boot: {x: 180, y: 140, r: 270}}, dur: 2.5})]});

S('aufstoppen', {titel: 'Aufstoppen', nr: 'A2.6', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'S10.2',
  bg: B.wasser(), obj: {boot: B.boot(), boje: B.punkt('#f08a1c', 7), strecke: '<path d="M0 0 V-120" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>' + T(12, -60, 'Auslaufstrecke', 'start', 11), schaum: '<g fill="#fff" opacity=".85"><circle cx="-5" cy="-38" r="5"/><circle cx="6" cy="-42" r="4"/></g>'},
  start: {boot: {x: 200, y: 270}, boje: {x: 228, y: 90}, strecke: {x: 200, y: 230, o: 0}, schaum: {x: 200, y: 160, o: 0}},
  phasen: [P(H, 'Aufstoppen heißt: das Boot auf einer Linie zum Stehen bringen, neben dieser Boje.', {cap: 'Ziel: neben der Boje stehen', k: {boot: {y: 210}}}),
    P(M, 'Rechtzeitig auskuppeln. Das Boot läuft noch ein ganzes Stück weiter.', {cap: 'Auskuppeln, auslaufen lassen', an: ['strecke'], k: {boot: {y: 140}}, dur: 3}),
    P(H, 'Dann kurz rückwärts. Der Radeffekt zieht das Heck nach Backbord, darum gegenhalten, damit der Kurs bleibt.', {cap: 'Rückwärts aufstoppen, Kurs halten', aus: ['strecke'], k: {boot: {y: 98, r: 4}, schaum: {o: 1, y: 98}}, dur: 2.5}),
    P(M, 'Steht. Neben der Boje, und der Bug zeigt noch in die alte Richtung. So ist es kursgerecht.', {cap: 'Steht, kursgerecht', aus: ['schaum'], k: {boot: {r: 0}}})]});

S('mob', {titel: 'Mensch über Bord', nr: 'A2.7', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'G4.2, S9.4',
  bg: B.wasser() + B.pfeil(30, 40, 30, 90, '#fff', 3, 'fl') + T(30, 30, 'Wind', 'middle', 11),
  obj: {boot: B.boot(), mensch: B.mensch(), ring: B.ring(), zeig: B.pfeil(0, 0, -50, 0, '#f2c200', 3), ruf: T(0, 0, '„Mensch über Bord!“', 'middle', 13)},
  start: {boot: {x: 200, y: 200}, mensch: {x: 200, y: 200, o: 0}, ring: {x: 200, y: 200, o: 0}, zeig: {o: 0}, ruf: {x: 200, y: 60, o: 0}},
  phasen: [P(H, 'Einer geht über Bord. Sofort laut rufen, Rettungsring hinterher, und einer zeigt ununterbrochen auf ihn.', {cap: 'Rufen, Ring werfen, zeigen', an: ['ruf'], k: {boot: {y: 120}, mensch: {o: 1, x: 200, y: 215}, ring: {o: 1, x: 222, y: 205}, zeig: {o: 1, x: 255, y: 150}}, dur: 2.5}),
    P(M, 'Ruder rum und zurück. Die Schraube nie in die Nähe des Menschen im Wasser.', {cap: 'Wenden und zurück', aus: ['ruf'], k: {boot: {weg: [[160, 70], [100, 110], [110, 200]]}, zeig: {o: 0}}, dur: 4}),
    P(H, 'Langsam gegen Wind und Welle anfahren, kurz vorher auskuppeln. Das Boot gleitet längsseits an die Person.', {cap: 'Gegen den Wind anfahren, auskuppeln', k: {boot: {weg: [[150, 270], [178, 250], [188, 212]]}}, dur: 3.5}),
    P(M, 'Motor aus, Person an der Seite sichern. Bergen mit Leine, Rettungsschlaufe, Bergenetz oder Badeleiter.', {cap: 'Sichern und bergen', k: {mensch: {x: 205, y: 212}, ring: {x: 214, y: 200}}})]});

/* ======================= A3 Knoten in der Anwendung ======================= */
S('knotenpraxis', {titel: 'Knoten in der Anwendung', nr: 'A3.2', gruppe: 'A3 Knoten', folge: 'S10.1',
  bg: B.wasser() + `<rect y="230" width="400" height="70" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>`,
  obj: {pal: `<rect x="-8" y="0" width="16" height="30" rx="4" fill="#555"/><path d="M0 4 C-20 4 -20 18 0 18 C20 18 20 4 0 4 M0 18 C0 -24 -8 -40 -20 -50" stroke="#e8c46a" stroke-width="4" fill="none"/>${T(0, 50, 'Palstek um den Poller', 'middle', 11)}`,
    rund: `<circle r="10" fill="none" stroke="#888" stroke-width="4"/><path d="M0 10 c-14 0 -14 -18 0 -18 c14 0 14 18 0 18 M-6 12 q-10 10 -4 20 M0 -8 C0 -24 8 -40 20 -50" stroke="#e8c46a" stroke-width="4" fill="none"/>${T(-10, 46, 'Rundtörn + zwei halbe Schläge', 'middle', 11)}`,
    webe: `<path d="M-60 0 H60" stroke="#999" stroke-width="5"/><path d="M-6 0 C-6 -12 6 -12 6 0 C6 12 -6 12 -6 0 M0 6 V50" stroke="#e8c46a" stroke-width="4" fill="none"/><ellipse cx="0" cy="66" rx="12" ry="18" fill="#2e86c1"/>${T(0, -16, 'Webeleinstek: Fender an der Reling', 'middle', 11)}`,
    stopper: `<path d="M-120 0 H120" stroke="#c98a12" stroke-width="5"/><path d="M-10 0 c4 -12 10 -12 12 0 c4 12 10 12 12 0 M14 0 V40" stroke="#e8c46a" stroke-width="4" fill="none"/>${B.pfeil(-120, 0, -150, 0, '#f08a1c', 3)}${T(0, -12, 'Stopperstek an der Leine unter Last', 'middle', 11)}`},
  start: {pal: {x: 90, y: 225, o: 0}, rund: {x: 300, y: 240, o: 0}, webe: {x: 200, y: 62, o: 0}, stopper: {x: 200, y: 182, o: 0}},
  phasen: [P(H, 'Der Palstek kommt als Auge über den Poller. Er zieht sich nicht zu und geht trotzdem wieder auf.', {cap: 'Palstek: festes Auge', an: ['pal']}),
    P(M, 'Am Ring: Rundtörn mit zwei halben Schlägen. Der Rundtörn nimmt die Last, die Schläge sichern.', {cap: 'Rundtörn am Ring', an: ['rund']}),
    P(H, 'An der Reling hängt der Fender am Webeleinstek, schnell in der Höhe verstellt.', {cap: 'Webeleinstek an der Reling', an: ['webe']}),
    P(M, 'Steht eine Leine unter Zug, nimmt der Stopperstek sie ab, damit man die andere lösen kann.', {cap: 'Stopperstek unter Last', an: ['stopper']})]});

/* ======================= A4 Ausweichen und Verkehr ======================= */
S('grundregeln', {titel: 'Zwei Grundregeln beim Ausweichen', nr: 'A4.1', gruppe: 'A4 Ausweichen und Verkehr', folge: 'G5.2',
  bg: B.wasser(), obj: {a: B.boot({lichter: true}), b: B.boot({lichter: true}), seg: B.segler(30), x: B.kreuz(0, 0)},
  start: {a: {x: 200, y: 270}, b: {x: 200, y: 30, r: 180}, seg: {x: 380, y: 150, o: 0, r: -90}, x: {x: 200, y: 150, o: 0}},
  phasen: [P(H, 'Zwei Motorboote kommen sich genau entgegen. Beide weichen nach Steuerbord aus, also nach rechts.', {cap: 'Entgegen: beide nach Steuerbord', k: {a: {weg: [[200, 200], [240, 150], [240, 90]]}, b: {weg: [[200, 100], [160, 150], [160, 220]]}}, dur: 4}),
    P(M, 'Kreuzen sich die Kurse, weicht aus, wer den anderen an seiner Steuerbordseite hat. Von rechts kommt, hat Vorfahrt.', {cap: 'Kreuzend: wer ihn rechts hat, weicht', k: {a: {x: 200, y: 270, r: 0}, b: {x: 380, y: 150, r: -90}}, dur: .1}),
    P(H, 'Also gehen wir mit dem Kurs nach rechts und hinter seinem Heck vorbei, nicht vor seinem Bug.', {cap: 'Hinter seinem Heck vorbei', k: {a: {weg: [[200, 200], [250, 150], [300, 110]]}, b: {weg: [[160, 150], [40, 150]]}}, dur: 4}),
    P(M, 'Und ein Maschinenfahrzeug weicht einem Segelfahrzeug aus. Der Segler kann nicht einfach Gas geben.', {cap: 'Maschine weicht Segler', aus: ['b'], an: ['seg'], k: {a: {x: 200, y: 270, r: 0}, seg: {x: 340, y: 150}}, dur: 1})]});

S('rangleiter', {titel: 'Die Rangfolge', nr: 'A4.3', gruppe: 'A4 Ausweichen und Verkehr', folge: 'S2.3',
  bg: `<rect width="400" height="300" fill="#f3ead2"/>`, obj: Object.fromEntries([['mu', 'manövrierunfähig'], ['mb', 'manövrierbehindert'], ['tg', 'tiefgangbehindert'], ['fi', 'fischend'], ['se', 'Segelfahrzeug'], ['ma', 'Maschinenfahrzeug']].map(([k, t], i) => [k, `<rect x="-130" y="-14" width="260" height="28" rx="8" fill="${['#c0392b', '#d35400', '#8e44ad', '#2980b9', '#16a085', '#7f8c8d'][i]}"/>${T(0, 5, `${i + 1}. ${t}`, 'middle', 14, 'w')}`]).concat([['pf', B.pfeil(0, 0, 0, -150, '#f08a1c', 5)], ['du', T(0, 0, 'Du', 'middle', 14)]])),
  start: Object.fromEntries(['mu', 'mb', 'tg', 'fi', 'se', 'ma'].map((k, i) => [k, {x: 200, y: 52 + i * 38, o: 0}]).concat([['pf', {x: 352, y: 245, o: 0}], ['du', {x: 352, y: 268, o: 0}]])),
  phasen: [P(H, 'Wer weniger kann, steht oben. Ganz oben das manövrierunfähige Fahrzeug, es kann gar nicht ausweichen.', {cap: 'Wer weniger kann, steht oben', an: ['mu', 'mb']}),
    P(M, 'Dann das tiefgangbehinderte, das fischende und das Segelfahrzeug.', {cap: 'Tiefgang, Fischer, Segler', an: ['tg', 'fi', 'se']}),
    P(H, 'Ganz unten das Maschinenfahrzeug. Das sind wir. Wir machen allen darüber Platz.', {cap: 'Unten: wir mit Motor', an: ['ma', 'pf', 'du']}),
    P(M, 'Faustregel: Wer weiter unten steht, weicht denen darüber aus. Im Fahrwasser gelten zusätzlich eigene Regeln.', {cap: 'Unten weicht oben aus'})]});

S('kurshalter', {titel: 'Kurshalter und letzter Augenblick', nr: 'A4.4', gruppe: 'A4 Ausweichen und Verkehr', folge: 'S2.4',
  bg: B.wasser(), obj: {wir: B.boot({lichter: true}), er: B.boot({lichter: true}), ton: '<g class="bl">' + [0, 1, 2, 3, 4].map(i => `<circle cx="${i * 12}" cy="0" r="4" fill="#fff"/>`).join('') + '</g>', sl: '<path d="M0 0 L120 -110" stroke="#f08a1c" stroke-width="2.5" stroke-dasharray="6 4"/>'},
  start: {wir: {x: 200, y: 250}, er: {x: 60, y: 140, r: 90}, ton: {x: 225, y: 285, o: 0}, sl: {x: 200, y: 250, o: 0}},
  phasen: [P(H, 'Er kommt von unserer Backbordseite. Er muss ausweichen, wir sind Kurshalter: Kurs und Geschwindigkeit beibehalten und ihn genau beobachten.', {cap: 'Kurshalter: Kurs und Fahrt halten', k: {wir: {y: 215}, er: {x: 110}}}),
    P(M, 'Er reagiert nicht. Dann gibt der Kurshalter mindestens fünf kurze Töne.', {cap: 'Mindestens fünf kurze Töne', an: ['ton'], k: {wir: {y: 190}, er: {x: 140}}}),
    P(H, 'Wird es so knapp, dass sein Manöver allein nicht mehr reicht, muss auch der Kurshalter handeln. Das ist das Manöver des letzten Augenblicks.', {cap: 'Manöver des letzten Augenblicks', aus: ['ton'], k: {wir: {weg: [[205, 168], [250, 148], [330, 140]]}, er: {x: 150}}, dur: 3.5}),
    P(M, 'So manövrieren, wie es den Zusammenstoß am besten vermeidet. Und vorher gilt: Kurs halten, nicht wild herumkurven.', {cap: 'Zusammenstoß vermeiden'})]});

S('revierkarte', {titel: 'Wo gilt was?', nr: 'A4.5', gruppe: 'A4 Ausweichen und Verkehr', folge: 'S1.1',
  bg: B.karte() + B.ufer('M0 300 V210 Q80 200 120 230 L170 300Z') + B.ufer('M400 300 V200 Q330 190 270 230 L230 300Z'),
  obj: {see: `<rect x="10" y="10" width="380" height="130" rx="10" fill="#9ccbe8" opacity=".55"/>${T(200, 60, 'Hohe See: Kollisionsverhütungsregeln (KVR)', 'middle', 13)}`,
    str: `<path d="M150 300 L190 140 L210 140 L250 300Z" fill="#5ba7cf" opacity=".6"/>${T(200, 200, 'Seeschifffahrtsstraße', 'middle', 12, 'w')}${T(200, 216, '(SeeSchStrO)', 'middle', 11, 'w')}`,
    fw: `<path d="M180 300 L196 140 M220 300 L204 140" stroke="#c0392b" stroke-width="3" stroke-dasharray="7 5"/>${T(200, 250, 'Fahrwasser', 'middle', 12)}`,
    vtg: `<rect x="60" y="80" width="280" height="50" fill="none" stroke="#a12fbf" stroke-width="3" stroke-dasharray="8 4"/>${T(200, 110, 'Verkehrstrennungsgebiet', 'middle', 12, 'b')}`},
  start: {see: {o: 0}, str: {o: 0}, fw: {o: 0}, vtg: {o: 0}},
  phasen: [P(H, 'Draußen auf hoher See gelten die Kollisionsverhütungsregeln, kurz KVR.', {cap: 'Hohe See: KVR', an: ['see']}),
    P(M, 'Auf den Seeschifffahrtsstraßen, also Flussmündungen und Küstengewässern, gilt die Seeschifffahrtsstraßen-Ordnung. Wo sie etwas anders regelt, geht sie den KVR vor.', {cap: 'Seeschifffahrtsstraße: SeeSchStrO geht vor', an: ['str']}),
    P(H, 'Das Fahrwasser ist der Teil, den die Großen brauchen. Da gelten noch strengere Regeln.', {cap: 'Fahrwasser', an: ['fw']}),
    P(M, 'Und im Verkehrstrennungsgebiet fährt jeder auf seiner Seite, wie auf der Autobahn.', {cap: 'Verkehrstrennungsgebiet', an: ['vtg']})]});

S('vtg', {titel: 'Verkehrstrennungsgebiet', nr: 'A4.6', gruppe: 'A4 Ausweichen und Verkehr', folge: 'S6.6',
  bg: B.wasser('#6fb2d6') + `<rect x="0" y="125" width="400" height="50" fill="#d7a6e3" opacity=".55"/>${T(200, 154, 'Trennzone', 'middle', 12)}${[60, 200, 340].map(x => B.pfeil(x - 30, 80, x + 30, 80, '#fff', 3) + B.pfeil(x + 30, 220, x - 30, 220, '#fff', 3)).join('')}<rect x="0" y="262" width="400" height="38" fill="#a9c48a" opacity=".5"/>${T(200, 286, 'Küstenverkehrszone', 'middle', 11)}`,
  obj: {s1: B.schiff(110, 24), s2: B.schiff(120, 24, '#8a4f4f'), wir: B.boot(), schraeg: B.kreuz(0, 0)},
  start: {s1: {x: -60, y: 80, r: 90}, s2: {x: 460, y: 220, r: -90}, wir: {x: 120, y: 290}, schraeg: {x: 0, y: 0, o: 0}},
  phasen: [P(H, 'Ein Verkehrstrennungsgebiet ist wie eine Autobahn: Jeder Einbahnweg nur in seiner Richtung, rechts der Trennzone.', {cap: 'Einbahnwege, rechts der Trennzone', k: {s1: {x: 200}, s2: {x: 230}}, dur: 4}),
    P(M, 'Queren möglichst vermeiden. Wenn es sein muss, dann mit dem Kiel im rechten Winkel zur Verkehrsrichtung, zügig rüber.', {cap: 'Queren: Kiel im rechten Winkel', k: {s1: {x: 330}, s2: {x: 90}, wir: {y: 30}}, dur: 4}),
    P(H, 'Schräg rüber, um Zeit zu sparen? Nein. Und wir Kleinen unter zwanzig Metern dürfen die Großen im Einbahnweg nicht behindern.', {cap: 'Nicht schräg, nicht behindern', an: ['schraeg'], k: {wir: {x: 120, y: 290, r: 0}, schraeg: {x: 200, y: 150}}, dur: .2}),
    P(M, 'Wer nur an der Küste entlang will, nimmt die Küstenverkehrszone.', {cap: 'Küstenverkehrszone für uns', aus: ['schraeg'], k: {wir: {x: 380, y: 280, r: 90}}, dur: 3})]});

S('fahrwasser', {titel: 'Rechts halten im Fahrwasser', nr: 'A4.7', gruppe: 'A4 Ausweichen und Verkehr', folge: 'S6.1',
  bg: B.wasser() + [40, 110, 180, 250].map(y => `<g transform="translate(130 ${y})">${B.punkt('rot')}</g><g transform="translate(270 ${y})">${B.punkt('gruen')}</g>`).join('') + B.pfeil(380, 280, 380, 220, '#fff', 3) + T(380, 296, 'von See', 'middle', 10),
  obj: {gross: B.schiff(120, 22), wir: B.boot(), anker: T(0, 0, '⚓ Ankern verboten', 'middle', 13) + B.kreuz(0, 16), quer: '<path d="M120 0 H280" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>'},
  start: {gross: {x: 175, y: -80, r: 180}, wir: {x: 245, y: 290}, anker: {x: 200, y: 150, o: 0}, quer: {x: 0, y: 200, o: 0}},
  phasen: [P(H, 'Im Fahrwasser fährt jeder so weit rechts wie möglich, also nah an der Steuerbordseite.', {cap: 'So weit rechts wie möglich', k: {wir: {y: 180}, gross: {y: 100}}, dur: 3.5}),
    P(M, 'Der Große braucht das tiefe Wasser. Wir behindern ihn nicht und überholen nicht dort, wo es verboten ist.', {cap: 'Die Großen nicht behindern', k: {wir: {y: 80}, gross: {y: 260}}, dur: 3.5}),
    P(H, 'Wer queren muss, quert zügig und möglichst im rechten Winkel, nicht schräg und nicht vor dem Bug eines Großen.', {cap: 'Queren: zügig, rechtwinklig', an: ['quer'], k: {gross: {y: 420}, wir: {x: 330, y: 200, r: 90}}, dur: .1}),
    P(M, 'Ankern im Fahrwasser ist verboten.', {cap: 'Im Fahrwasser nicht ankern', aus: ['quer'], an: ['anker']})]});

S('segler', {titel: 'Segler und Motorboot', nr: 'A4.8', gruppe: 'A4 Ausweichen und Verkehr', folge: 'S2.2',
  bg: B.wasser() + B.pfeil(30, 40, 90, 40, '#fff', 3, 'fl') + T(60, 30, 'Wind', 'middle', 11),
  obj: {wir: B.boot(), s1: B.segler(40), s2: B.segler(-40), kegel: B.kegel(0, 0, false, 9) + T(0, 26, 'Kegel Spitze unten', 'middle', 11), x: T(0, 0, '= Maschinenfahrzeug', 'middle', 12)},
  start: {wir: {x: 120, y: 260}, s1: {x: 300, y: 120}, s2: {x: 100, y: 120, o: 0, r: 180}, kegel: {x: 300, y: 60, o: 0}, x: {x: 300, y: 175, o: 0}},
  phasen: [P(H, 'Ein Maschinenfahrzeug weicht einem Segelfahrzeug aus. Wir gehen hinter ihm vorbei.', {cap: 'Wir weichen dem Segler', k: {wir: {weg: [[160, 220], [250, 190], [340, 200]]}}, dur: 4}),
    P(M, 'Aber Vorsicht: Ein Segler mit laufendem Motor ist ein Maschinenfahrzeug, auch wenn die Segel oben sind. Tagsüber zeigt er einen schwarzen Kegel, Spitze unten.', {cap: 'Segler unter Motor = Maschinenfahrzeug', an: ['kegel', 'x'], k: {wir: {x: 120, y: 260, r: 0}}, dur: .1}),
    P(H, 'Zwei Segler unter sich: Wer den Wind von Backbord hat, weicht dem mit Wind von Steuerbord aus.', {cap: 'Segler: Wind von Backbord weicht', aus: ['kegel', 'x'], an: ['s2'], k: {s1: {x: 300, y: 150}, s2: {x: 100, y: 150}}}),
    P(M, 'Haben beide den Wind von derselben Seite, weicht der in Luv dem in Lee aus.', {cap: 'Gleiche Seite: Luv weicht Lee'})]});

A.hilfe = {ez, lp, q, qa, T, P, g, LF, H, M, K};
})();
