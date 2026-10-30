/* ==========================================================================
   Skipper – Animationen (Nutzer 30.10.2026, Liste in docs/animationen-liste.md)
   Wird nachgeladen (nachladen('anim.js')). Je Gruppe ein Beispiel; Seite „🎞️ Animationen“ unter „Frei üben“ zeigt sie per Knopfdruck an,
   mit Phasen, Vorlesen und einem Feld für Änderungsvorschläge (S.animNotes).
   Aufbau einer Animation: ANIM.defs[id] = {titel, gruppe, art: 'pruefung' | 'zusatz', folge, svg, phasen: [{wer, t, min}], tick(svg, tp, p, st), enter(svg, p, st)}
   Alles Gesprochene versteht man auch ohne Bild, das Bild erklärt zusätzlich. Auch in der Reise nutzbar: {ansicht: 'grafik', bild: id}, {grafik: n}.
   ========================================================================== */
(() => {
const A = window.ANIM = {defs: {}, order: []};
const NS = 'http://www.w3.org/2000/svg';
const ez = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u), lp = (a, b, u) => a + (b - a) * u, cl = (v, a, b) => Math.max(a, Math.min(b, v));
const q = (s, sel) => s.querySelector(sel), put = (el, o) => { if (el) for (const k in o) el.setAttribute(k, o[k]); };
const T = (x, y, txt, a = 'middle', sz = 13, cls = '') => `<text class="t ${cls}" x="${x}" y="${y}" text-anchor="${a}" font-size="${sz}">${txt}</text>`;
const def = (id, o) => { A.defs[id] = {id, ...o}; A.order.push(id); };
const CSS = `.an{width:100%;height:100%;display:block}.an .t{font-family:Nunito,Helvetica,Arial,sans-serif;font-weight:800;fill:#2b3a4a;stroke:#fff;stroke-width:3;paint-order:stroke}
.anstage{aspect-ratio:4/3;width:100%;max-height:54vh;border-radius:14px;overflow:hidden;border:2px solid var(--line,#c9b99a);background:#f7f5ef}.ancap{margin:8px 0;padding:10px 12px;border-radius:12px;background:var(--card,#fff8ea);color:var(--ink,#2a2019);font-size:.98rem;line-height:1.4;min-height:4.2em}
.ancap b{color:#b86b00}.anctl{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.anctl .dots{display:flex;gap:5px;margin:0 4px}.anctl .dots i{width:9px;height:9px;border-radius:50%;background:#c9b99a}.anctl .dots i.on{background:#f08a1c}
.anlist .card{margin:6px 0}.anlist .tag2{display:inline-block;font-size:.7rem;padding:.1em .55em;border-radius:999px;background:#e8dfc9;color:#4a3a22;margin-right:4px}.anlist .tag2.z{background:#d7e7d0}.anlist h3{margin:14px 0 4px;font-size:1rem}
.annote{width:100%;box-sizing:border-box;min-height:3.2em;margin-top:8px;padding:.5em;border-radius:10px;border:2px solid var(--line,#c9b99a);font:inherit;background:#fff;color:#2a2019}`;
const css = () => { if (document.getElementById('ancss')) return; const s = document.createElement('style'); s.id = 'ancss'; s.textContent = CSS; document.head.appendChild(s); };

/* ---------- Laufzeit ---------- */
A.html = id => { const d = A.defs[id]; if (d.raw) return window.REISE.grafik(id).replace('<svg class="gr"', `<svg class="gr an" data-anim="${id}"`); return `<svg class="an" data-anim="${id}" data-p="0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${d.titel}">${d.svg}</svg>`; };
A.start = host => {
  const svg = host.querySelector('svg.an'); if (!svg) return null; const d = A.defs[svg.dataset.anim]; if (!d) return svg;
  const st = svg._an = {t0: performance.now(), last: performance.now(), p: 0, m: {}};
  if (d.init) d.init(svg, st); if (d.enter) d.enter(svg, 0, st);
  if (d.tick) { const f = now => { if (!svg.isConnected) return; const tp = (now - st.t0) / 1000, dt = Math.min(.1, (now - st.last) / 1000); st.last = now; st.dt = dt; if (!(window.lauf && window.lauf.halt)) d.tick(svg, tp, st.p, st); requestAnimationFrame(f); }; requestAnimationFrame(f); }
  return svg;
};
A.phase = (svg, n) => { svg.dataset.p = n; const st = svg._an, d = A.defs[svg.dataset.anim]; if (!st) return; st.p = n; st.t0 = performance.now(); st.m = {}; if (d && d.enter) d.enter(svg, n, st); };

/* ============ 1 Radeffekt (A1): liegt in reise.js, hier nur die Texte ============ */
def('rad', {titel: 'Radeffekt', gruppe: 'A1 Boot, Antrieb, Motor', art: 'pruefung', folge: 'G2.1', wo: 'Reise Tag 2',
  raw: true, svg: '', phasen: [
    {wer: 'hinnerk', t: 'Wir sehen das Boot von hinten. Der Propeller sitzt unter dem Heck.'},
    {wer: 'hinnerk', t: 'In Vorausfahrt dreht er sich von hinten gesehen im Uhrzeigersinn. Das nennt man rechtsdrehend.'},
    {wer: 'smilla', t: 'Der Propeller schleudert das Wasser in alle Richtungen. Auf der Backbordseite laufen die Flügel dabei nach oben und werfen das Wasser gegen den Rumpf.', min: 6},
    {wer: 'hinnerk', t: 'Der Rumpf bekommt den Stoß ab. Das Wasser drückt ihn nach rechts, und das Heck weicht aus.', min: 5},
    {wer: 'smilla', t: 'Rückwärts dreht sich alles um. Jetzt laufen die Flügel auf der Steuerbordseite nach oben, der Stoß kommt von der anderen Seite, und das Heck zieht nach Backbord, also nach links.', min: 6}]});

/* ============ 2 Anlegen (A2) ============ */
def('anlegen', {titel: 'Anlegen mit Backbord', gruppe: 'A2 Anlegen, Ankern, Manöver', art: 'pruefung', folge: 'G3.1', wo: 'Reise Tag 3',
  svg: `<rect width="400" height="300" fill="#5ba7cf"/><g stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"><path d="M110 40 q12 -6 24 0 t24 0"/><path d="M250 90 q12 -6 24 0 t24 0"/><path d="M170 250 q12 -6 24 0 t24 0"/><path d="M300 200 q12 -6 24 0 t24 0"/></g>
    <rect width="70" height="300" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>${[40, 80, 120, 160, 200, 240, 280].map(y => `<path d="M0 ${y}H70" stroke="#8a6a44" stroke-width="2"/>`).join('')}
    <circle cx="58" cy="105" r="6" fill="#3a3a3a"/><circle cx="58" cy="195" r="6" fill="#3a3a3a"/>
    <g id="ls" opacity="0"><path id="l1" fill="none" stroke="#e8c46a" stroke-width="3"/><path id="l2" fill="none" stroke="#e8c46a" stroke-width="3"/></g>
    <g id="b"><path d="M0 -36 C15 -24 17 8 13 32 L-13 32 C-17 8 -15 -24 0 -36Z" fill="#f4efe6" stroke="#8a7a66" stroke-width="2"/><rect x="-8" y="-6" width="16" height="22" rx="4" fill="#cfd8dc" stroke="#8a7a66"/>
      <circle class="fe" cx="-17" cy="-8" r="4" fill="#f08a1c" opacity="0"/><circle class="fe" cx="-17" cy="12" r="4" fill="#f08a1c" opacity="0"/>
      <g id="a1" opacity="0"><path d="M0 -44V-66" stroke="#fff" stroke-width="4"/><path d="M-6 -62L0 -72L6 -62Z" fill="#fff"/></g>
      <g id="a2" opacity="0"><path d="M4 40H-24" stroke="#f08a1c" stroke-width="5" stroke-linecap="round"/><path d="M-22 33L-34 40L-22 47Z" fill="#f08a1c"/></g></g>
    ${T(200, 22, '', 'middle')}<g id="lab">${T(235, 282, 'Pier links, wir liegen mit Backbord an', 'middle', 12)}</g>`,
  phasen: [
    {wer: 'hinnerk', t: 'Wir wollen mit Backbord an die Pier. Dafür fahren wir im spitzen Winkel darauf zu.'},
    {wer: 'smilla', t: 'Ruhig und langsam. Der Bug zeigt schräg zur Pier, die Fahrt nehmen wir früh raus.', min: 5},
    {wer: 'hinnerk', t: 'Kurz vor der Pier legst du den Rückwärtsgang ein. Der Radeffekt zieht das Heck bei einem rechtsdrehenden Propeller nach Backbord, also zur Pier.', min: 6},
    {wer: 'smilla', t: 'Jetzt liegt das Boot parallel. Fender an die Pierseite, Leinen an Land.', min: 4}],
  tick(s, tp, p) {
    const S0 = [290, 255, -40], P1 = [150, 160, -36], P2 = [97, 150, -1]; let k;
    if (p === 0) k = S0; else if (p === 1) { const u = ez(tp / 3.4); k = S0.map((v, i) => lp(v, P1[i], u)); } else if (p === 2) { const u = ez(tp / 2); k = P1.map((v, i) => lp(v, P2[i], u)); } else k = P2;
    put(q(s, '#b'), {transform: `translate(${k[0].toFixed(1)} ${k[1].toFixed(1)}) rotate(${k[2].toFixed(1)})`});
    put(q(s, '#a1'), {opacity: p === 1 ? 1 : 0}); put(q(s, '#a2'), {opacity: p === 2 ? ez(tp / .6) : 0});
    s.querySelectorAll('.fe').forEach(e => put(e, {opacity: p >= 3 ? ez(tp / .8) : 0}));
    const th = k[2] * Math.PI / 180, w = (lx, ly) => [k[0] + lx * Math.cos(th) - ly * Math.sin(th), k[1] + lx * Math.sin(th) + ly * Math.cos(th)];
    const dr = (id, c, b) => { put(q(s, id), {d: `M${c[0].toFixed(1)} ${c[1].toFixed(1)} Q${((c[0] + b[0]) / 2).toFixed(1)} ${((c[1] + b[1]) / 2 + 9).toFixed(1)} ${b[0]} ${b[1]}`}); };
    dr('#l1', w(-13, -18), [58, 105]); dr('#l2', w(-13, 24), [58, 195]); put(q(s, '#ls'), {opacity: p >= 3 ? ez(tp / 1) : 0});
  }});

/* ============ 3 Begegnung (A4) ============ */
def('begegnung', {titel: 'Begegnung: die Peilung bleibt stehen', gruppe: 'A4 Ausweichen und Verkehr', art: 'pruefung', folge: 'G5.2, S2.1, S2.2', wo: 'Reise Tag 7',
  svg: `<rect width="400" height="300" fill="#5ba7cf"/><g id="gh"></g><line id="sl" stroke="#f08a1c" stroke-width="2.5" stroke-dasharray="6 4"/>
    <g id="bB"><path d="M0 -20 C9 -13 10 4 8 18 L-8 18 C-10 4 -9 -13 0 -20Z" fill="#e9d9b8" stroke="#7a6a4a" stroke-width="1.6"/><rect x="-5" y="-4" width="10" height="12" rx="3" fill="#cfd8dc"/><circle cx="-8" cy="-2" r="2.4" fill="#c0392b"/><circle cx="8" cy="-2" r="2.4" fill="#1f9a3c"/></g>
    <g id="bA"><path d="M0 -20 C9 -13 10 4 8 18 L-8 18 C-10 4 -9 -13 0 -20Z" fill="#f4efe6" stroke="#8a7a66" stroke-width="1.6"/><rect x="-5" y="-4" width="10" height="12" rx="3" fill="#cfd8dc"/><circle cx="-8" cy="-2" r="2.4" fill="#c0392b"/><circle cx="8" cy="-2" r="2.4" fill="#1f9a3c"/></g>
    ${T(200, 285, '', 'middle', 13, 'msg')}${T(172, 262, 'Du', 'end', 12)}${T(358, 90, 'von Steuerbord', 'middle', 11)}`,
  phasen: [
    {wer: 'hinnerk', t: 'Von rechts kommt ein Motorboot. Wir beide fahren auf denselben Punkt zu.'},
    {wer: 'smilla', t: 'Siehst du, die Peilung bleibt gleich? Die Linie wandert nicht. Dann gibt es einen Zusammenstoß.', min: 7},
    {wer: 'hinnerk', t: 'Wer ein Fahrzeug auf Steuerbord hat, weicht aus: früh, deutlich, nach rechts, hinter dem Heck vorbei.', min: 8}],
  enter(s, p, st) { q(s, '#gh').innerHTML = ''; st.m.gn = 0; q(s, '.msg').textContent = ''; },
  tick(s, tp, p, st) {
    const vA = 150, T0 = 5.2; let u = p === 0 ? 0 : tp / T0; if (p === 1) u = Math.min(u, .86); if (p === 2) u = Math.min(u, 1.5);
    let a = [200, 262], hd = 0;
    if (p === 2) { const k0 = .25, k1 = .4; let x = 200, y = 262; const n = Math.max(1, Math.floor(u * 150)); for (let i = 0; i < n; i++) { const uu = i / 150, ps = lp(0, 50, ez((uu - k0) / (k1 - k0))) * Math.PI / 180; x += Math.sin(ps) * vA / 150; y -= Math.cos(ps) * vA / 150; hd = ps * 180 / Math.PI; } a = [x, y]; } else a = [200, 262 - vA * u];
    const b = [352 - vA * u, 112];
    put(q(s, '#bA'), {transform: `translate(${a[0].toFixed(1)} ${a[1].toFixed(1)}) rotate(${hd.toFixed(1)})`}); put(q(s, '#bB'), {transform: `translate(${b[0].toFixed(1)} ${b[1].toFixed(1)}) rotate(-90)`});
    put(q(s, '#sl'), {x1: a[0], y1: a[1], x2: b[0], y2: b[1], opacity: p === 0 ? .6 : 1});
    if (p >= 1 && u >= (st.m.gn + 1) * .17 && st.m.gn < 5) { st.m.gn++; q(s, '#gh').insertAdjacentHTML('beforeend', `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>`); }
    const m = q(s, '.msg'); m.textContent = p === 1 && u >= .86 ? 'Die Peilung bleibt gleich: Kollisionskurs!' : p === 2 && u > .5 ? 'Ich weiche nach Steuerbord aus, hinter dem Heck vorbei.' : '';
  }});

/* ============ 4 Lichterkarussell (A5) ============ */
def('lichter', {titel: 'Lichterkarussell', gruppe: 'A5 Lichter und Signalkörper', art: 'pruefung', folge: 'G5.1, S3.1', wo: 'Reise Tag 7, Tag 20',
  svg: `<rect width="400" height="300" fill="#10203a"/>
    <path id="arcG" fill="none" stroke="#1f9a3c" stroke-width="9"/><path id="arcR" fill="none" stroke="#d6332c" stroke-width="9"/><path id="arcM" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="3"/><path id="arcS" fill="none" stroke="#ffd" stroke-opacity=".8" stroke-width="3" stroke-dasharray="4 3"/>
    <g transform="translate(200 98)"><path d="M0 -34 C12 -22 14 6 11 28 L-11 28 C-14 6 -12 -22 0 -34Z" fill="#cfd8dc" stroke="#8aa" stroke-width="1.5"/><rect x="-6" y="-8" width="12" height="16" rx="3" fill="#8aa"/></g>
    <g id="eye"><circle r="9" fill="#ffd36a" stroke="#fff" stroke-width="2"/><path d="M0 -9L-5 -15H5Z" fill="#fff" transform="rotate(180)"/></g>
    ${T(232, 16, 'vorn', 'start', 10, 'wh')}${T(232, 198, 'achtern', 'start', 10, 'wh')}
    <g transform="translate(0 214)"><rect x="12" y="0" width="376" height="78" rx="12" fill="#1b2d4d" stroke="#3b5580"/>
      <circle id="lT" cx="62" cy="26" r="11" fill="#555"/><circle id="lR" cx="152" cy="26" r="11" fill="#555"/><circle id="lG" cx="248" cy="26" r="11" fill="#555"/><circle id="lH" cx="338" cy="26" r="11" fill="#555"/>
      ${T(62, 54, 'Topplicht', 'middle', 10, 'wh')}${T(152, 54, 'Rot (Backbord)', 'middle', 10, 'wh')}${T(248, 54, 'Grün (Steuerbord)', 'middle', 10, 'wh')}${T(338, 54, 'Hecklicht', 'middle', 10, 'wh')}${T(200, 72, '', 'middle', 11, 'wh sees')}</g>
    <style>.an .wh{fill:#e8eef8;stroke:#10203a}</style>`,
  phasen: [
    {wer: 'smilla', t: 'Von vorn siehst du Rot und Grün nebeneinander und darüber das weiße Topplicht.'},
    {wer: 'hinnerk', t: 'Von der Seite siehst du nur eine Seitenlampe, hier Grün von Steuerbord, dazu das Topplicht.'},
    {wer: 'smilla', t: 'Von achtern siehst du nur das weiße Hecklicht.'},
    {wer: 'hinnerk', t: 'Und jetzt dreht der Beobachter eine ganze Runde. Schau, wann welche Lampe angeht.', min: 12}],
  init(s, st) { st.phi = 0; const arc = (id, r, a0, a1) => { const P = a => [200 + r * Math.sin(a * Math.PI / 180), 98 - r * Math.cos(a * Math.PI / 180)]; const [x0, y0] = P(a0), [x1, y1] = P(a1); put(q(s, id), {d: `M${x0} ${y0} A${r} ${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1} ${y1}`}); };
    arc('#arcG', 52, 0, 112.5); arc('#arcR', 52, 247.5, 360); arc('#arcM', 63, -112.5, 112.5); arc('#arcS', 72, 112.5, 247.5); },
  tick(s, tp, p, st) {
    const dt = st.dt || .016; if (p === 3) st.phi = (st.phi + 30 * dt) % 360; else { const t = [0, 90, 180][p], d = ((t - st.phi + 540) % 360) - 180; st.phi = (st.phi + d * Math.min(1, dt * 3.5) + 360) % 360; }
    const f = st.phi, R = 92; put(q(s, '#eye'), {transform: `translate(${(200 + R * Math.sin(f * Math.PI / 180)).toFixed(1)} ${(98 - R * Math.cos(f * Math.PI / 180)).toFixed(1)})`});
    const top = f <= 112.5 || f >= 247.5, gr = f <= 112.5, ro = f >= 247.5, he = f >= 112.5 && f <= 247.5, on = (id, v, c) => put(q(s, id), {fill: v ? c : '#555', 'fill-opacity': v ? 1 : .6});
    on('#lT', top, '#fff'); on('#lR', ro, '#ff4a3d'); on('#lG', gr, '#2ee06a'); on('#lH', he, '#fffbe0');
    q(s, '.sees').textContent = 'Du siehst: ' + [top && 'Topplicht', ro && 'Rot', gr && 'Grün', he && 'Hecklicht'].filter(Boolean).join(', ');
  }});

/* ============ 5 Schallsignale (A6) ============ */
const SIGS = [['●', 'Ich ändere meinen Kurs nach Steuerbord'], ['● ●', 'Ich ändere meinen Kurs nach Backbord'], ['● ● ●', 'Meine Maschine läuft rückwärts'], ['● ● ● ● ●', 'Warnsignal: Ich verstehe dich nicht, Vorsicht']];
def('schall', {titel: 'Schallsignale sichtbar', gruppe: 'A6 Schallsignale und Nebel', art: 'pruefung', folge: 'S4.1 bis S4.3', wo: 'Reise Tag 26',
  svg: `<rect width="400" height="300" fill="#dfeaf2"/>${SIGS.map(([sg, tx], r) => `<g id="r${r}" transform="translate(0 ${58 + r * 56})"><rect x="14" y="-6" width="372" height="46" rx="12" fill="#fff" stroke="#b9c8d6" stroke-width="2"/>
      <text class="t" x="26" y="12" font-size="12">${tx}</text>${sg.split(' ').map((c, k) => `<circle id="s${r}_${k}" cx="${34 + k * 26}" cy="28" r="8" fill="#9fb4c7"/>`).join('')}</g>`).join('')}
    <g id="hn" transform="translate(340 28)"><path d="M-14 -8L4 -8L18 -18V18L4 8L-14 8Z" fill="#8a6d4a" stroke="#5a4020" stroke-width="2"/><g id="hw" opacity="0"><path d="M24 -12Q32 0 24 12" fill="none" stroke="#f08a1c" stroke-width="3"/><path d="M30 -18Q44 0 30 18" fill="none" stroke="#f08a1c" stroke-width="3"/></g></g>
    ${T(200, 292, 'Das gilt auf See (Kollisionsverhütungsregeln)', 'middle', 10)}`,
  phasen: [
    {wer: 'smilla', t: 'Auf See sagt man mit dem Horn, was man vorhat. Kurze Töne sind Punkte, lange Töne sind Striche.'},
    {wer: 'hinnerk', t: 'Ein kurzer Ton: Ich ändere meinen Kurs nach Steuerbord, also nach rechts.', min: 4},
    {wer: 'smilla', t: 'Zwei kurze Töne: Ich ändere meinen Kurs nach Backbord, also nach links.', min: 5},
    {wer: 'hinnerk', t: 'Drei kurze Töne: Meine Maschine läuft rückwärts.', min: 6},
    {wer: 'smilla', t: 'Fünf kurze Töne: Warnsignal. Ich verstehe dich nicht oder halte deine Absicht für gefährlich.', min: 8}],
  enter(s, p, st) {
    if (st.horn) { try { st.horn.stop(); } catch (e) {} st.horn = null; }
    SIGS.forEach(([sg], r) => sg.split(' ').forEach((c, k) => put(q(s, `#s${r}_${k}`), {fill: '#9fb4c7'}))); SIGS.forEach((x, r) => put(q(s, '#r' + r), {opacity: p === 0 || p === r + 1 ? 1 : .35}));
    if (p >= 1 && window.AUD) { try { AUD.unlock && AUD.unlock(); st.horn = AUD.horn(SIGS[p - 1][0], (i, type, d) => { const e = q(s, `#s${p - 1}_${i}`); if (e) { put(e, {fill: '#f08a1c'}); setTimeout(() => put(e, {fill: '#9fb4c7'}), d * 1000); } st.pulse = performance.now() + d * 1000; }); } catch (e) {} }
  },
  tick(s, tp, p, st) { put(q(s, '#hw'), {opacity: st.pulse && performance.now() < st.pulse ? 1 : 0}); }});

/* ============ 6 Kardinalzeichen als Uhr (A7) ============ */
const KARD = [['N', 200, 50, 'auf-auf', ['#222', '#f2c230'], 'Nord: schwarz über gelb', 12, 0], ['E', 296, 112, 'auf-ab', ['#222', '#f2c230', '#222'], 'Ost: schwarz-gelb-schwarz', 3, 3], ['S', 200, 196, 'ab-ab', ['#f2c230', '#222'], 'Süd: gelb über schwarz', 6, 6], ['W', 104, 112, 'ab-auf', ['#f2c230', '#222', '#f2c230'], 'West: gelb-schwarz-gelb', 9, 9]];
const kbuoy = (n, x, y, tm, cols) => { const h = 30 / cols.length, cone = (yy, up) => `<path d="M${x - 7} ${up ? yy + 9 : yy}L${x} ${up ? yy : yy + 9}L${x + 7} ${up ? yy + 9 : yy}Z" fill="#222"/>`, [a, b] = tm.split('-');
  return `<g id="k${n}"><circle id="kr${n}" cx="${x}" cy="${y + 4}" r="30" fill="none" stroke="#f08a1c" stroke-width="3" opacity="0"/>${cols.map((c, i) => `<rect x="${x - 8}" y="${y + i * h}" width="16" height="${h}" fill="${c}" stroke="#222" stroke-width=".8"/>`).join('')}${cone(y - 23, a === 'auf')}${cone(y - 12, b === 'auf')}<circle id="kl${n}" cx="${x}" cy="${y - 31}" r="4.5" fill="#665" stroke="#222" stroke-width=".8"/></g>`; };
const kdur = {N: 0, E: 4, S: 6.2, W: 6.6};
const klit = (n, t) => { if (n === 'N') return Math.floor(t / .12) % 2 === 0; const per = {E: 4, S: 6.2, W: 6.6}[n], c = {E: 3, S: 6, W: 9}[n], u = t % per; if (u < c * .5) return (u % .5) < .25; if (n === 'S') return u > c * .5 + .3 && u < c * .5 + 1.5; return false; };
def('kardinal', {titel: 'Kardinalzeichen als Uhr', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', art: 'pruefung', folge: 'S5.4', wo: 'Reise Tag 29',
  svg: `<rect width="400" height="300" fill="#5ba7cf"/><g id="gz"><path d="M178 122Q188 100 204 108Q222 104 224 124Q214 140 196 138Q178 140 178 122Z" fill="#6b5a45" stroke="#3a2e22" stroke-width="2"/><path d="M186 96L200 80L214 96" fill="none" stroke="#c0392b" stroke-width="2.5"/>${T(200, 152, 'Gefahrenstelle', 'middle', 10)}</g>
    ${KARD.map(([n, x, y, tm, cols]) => kbuoy(n, x, y, tm, cols)).join('')}${KARD.map(([n, x, y]) => T(x + (n === 'W' ? -34 : n === 'E' ? 34 : 0), n === 'N' ? y - 40 : n === 'S' ? y + 46 : y + 4, n, 'middle', 12)).join('')}
    <g transform="translate(340 232)"><circle r="34" fill="#fff" stroke="#2b3a4a" stroke-width="3"/>${[12, 3, 6, 9].map((h, i) => { const a = (h % 12) * 30 * Math.PI / 180; return `<text class="t" x="${(26 * Math.sin(a)).toFixed(1)}" y="${(-26 * Math.cos(a) + 4).toFixed(1)}" text-anchor="middle" font-size="11">${h}</text>`; }).join('')}<line id="ch" x1="0" y1="0" x2="0" y2="-22" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/><circle r="3" fill="#2b3a4a"/></g>
    ${T(160, 262, '', 'middle', 12, 'ktx')}`,
  phasen: [
    {wer: 'smilla', t: 'Vier Tonnen stehen um die Gefahrenstelle: Nord, Ost, Süd und West. Du fährst dort vorbei, wo die Tonne steht.'},
    {wer: 'hinnerk', t: 'Das Nordzeichen blitzt ununterbrochen schnell. Es steht im Norden der Gefahr: Fahr nördlich vorbei.', min: 5},
    {wer: 'smilla', t: 'Ost blitzt dreimal, wie drei Uhr. Das Toppzeichen sind zwei Kegel, Basis an Basis.', min: 6},
    {wer: 'hinnerk', t: 'Süd blitzt sechsmal und dann noch einmal lang, wie sechs Uhr. Die Kegel zeigen nach unten.', min: 8},
    {wer: 'smilla', t: 'West blitzt neunmal, wie neun Uhr. Die Kegel zeigen mit den Spitzen zueinander.', min: 8}],
  enter(s, p, st) { KARD.forEach(([n]) => put(q(s, '#kr' + n), {opacity: 0})); if (p >= 1) put(q(s, '#kr' + KARD[p - 1][0]), {opacity: 1}); q(s, '.ktx').textContent = p >= 1 ? KARD[p - 1][5] : ''; put(q(s, '#ch'), {transform: `rotate(${p >= 1 ? KARD[p - 1][6] % 12 * 30 : 0})`}); },
  tick(s, tp, p) { KARD.forEach(([n], i) => { const on = p === i + 1 && klit(n, tp); put(q(s, '#kl' + n), {fill: on ? '#ffe45a' : '#665'}); }); }});

/* ============ 7 Ebbe und Flut (A8) ============ */
def('gezeiten', {titel: 'Ebbe und Flut', gruppe: 'A8 Navigation', art: 'pruefung', folge: 'S7.4', wo: 'Reise Tag 32',
  svg: `<rect width="400" height="300" fill="#cfe9f7"/><rect x="0" y="207" width="400" height="93" fill="#d8b87a"/><path d="M180 207Q250 195 300 209Q340 201 400 207V300H180Z" fill="#c9a35e"/>
    <rect id="wa" x="56" y="100" width="344" height="200" fill="#3d8fb8" opacity=".9"/><rect x="0" y="80" width="56" height="220" fill="#8a8f98" stroke="#5a5f68" stroke-width="3"/>${[100, 130, 160, 190].map(y => `<path d="M0 ${y}H56" stroke="#6f747c" stroke-width="2"/>`).join('')}
    <path d="M56 156H400" stroke="#2b3a4a" stroke-width="1.6" stroke-dasharray="6 4"/>${T(398, 152, 'Kartennull (KN)', 'end', 10)}
    <g id="bt"><path d="M-26 -4H26L18 12H-18Z" fill="#f4efe6" stroke="#8a7a66" stroke-width="2"/><rect x="-6" y="-18" width="14" height="14" fill="#cfd8dc" stroke="#8a7a66"/><path d="M-2 12V26" stroke="#5b3a2a" stroke-width="5"/></g>
    <path id="km" stroke="#c0392b" stroke-width="2.5" fill="none"/>${T(330, 250, 'Kartentiefe 2,3 m', 'middle', 10)}
    <g transform="translate(228 14)"><rect width="164" height="84" rx="10" fill="#fff" stroke="#b9c8d6" stroke-width="2"/><path id="cv" fill="none" stroke="#3d8fb8" stroke-width="3"/><circle id="cd" r="5" fill="#f08a1c"/><text class="t" x="82" y="76" text-anchor="middle" font-size="10">Höhe über Kartennull, 12 h 25 min</text></g>
    ${T(150, 40, '', 'middle', 14, 'gz')}${T(150, 62, '', 'middle', 12, 'gt')}`,
  phasen: [
    {wer: 'hinnerk', t: 'Zweimal am Tag steigt das Wasser und fällt wieder. Das ist die Tide.', min: 9},
    {wer: 'smilla', t: 'Ebbe: Das Wasser läuft ab und der Wasserstand fällt.', min: 5.2},
    {wer: 'hinnerk', t: 'Niedrigwasser: wenig Wasser unterm Kiel. Die Wassertiefe ist die Kartentiefe plus die Höhe des Wasserstands.', min: 6},
    {wer: 'smilla', t: 'Flut: Das Wasser läuft auf und der Wasserstand steigt.', min: 5.2},
    {wer: 'hinnerk', t: 'Hochwasser. Der Unterschied zwischen Hoch- und Niedrigwasser ist der Tidenhub.', min: 6}],
  tick(s, tp, p, st) {
    const per = 10, hmax = 3.6, hmin = .4, mid = (hmax + hmin) / 2, amp = (hmax - hmin) / 2; let ph;
    if (p === 0) ph = tp / per; else if (p === 1) ph = Math.min(tp / per, .5); else if (p === 2) ph = .5; else if (p === 3) ph = .5 + Math.min(tp / per, .5); else ph = 1;
    const h = mid + amp * Math.cos(2 * Math.PI * ph), yKN = 156, sc = 22, ys = yKN - h * sc;
    put(q(s, '#wa'), {y: ys}); put(q(s, '#bt'), {transform: `translate(250 ${ys - 2})`}); put(q(s, '#km'), {d: `M330 ${yKN}V${yKN + 2.3 * sc}M324 ${yKN + 2.3 * sc}H336`});
    put(q(s, '#cv'), {d: 'M' + Array.from({length: 49}, (_, i) => { const a = i / 48; return `${8 + a * 148} ${44 - Math.cos(2 * Math.PI * a) * 26}`; }).join('L')});
    put(q(s, '#cd'), {cx: 8 + (ph > 1 ? ph % 1 : ph) * 148, cy: 44 - ((h - mid) / amp) * 26});
    q(s, '.gz').textContent = `Wasserstand: ${h.toFixed(1).replace('.', ',')} m`; q(s, '.gt').textContent = `Wassertiefe: ${(2.3 + h).toFixed(1).replace('.', ',')} m`;
  }});

/* ============ 8 Hoch und Tief (A9) ============ */
def('wetter', {titel: 'Warum der Wind weht', gruppe: 'A9 Wetter, Natur, Sicherheit', art: 'pruefung', folge: 'G7.1, S9.1', wo: 'Reise Tag 28',
  svg: `<rect width="400" height="300" fill="#e3eef4"/>${[24, 44, 64].map(r => `<circle cx="110" cy="140" r="${r}" fill="none" stroke="#b5a2cc" stroke-width="2"/><circle cx="290" cy="140" r="${r}" fill="none" stroke="#9ab" stroke-width="2"/>`).join('')}
    <text class="t" x="110" y="148" text-anchor="middle" font-size="30" fill="#6a3d9a">H</text><text class="t" x="290" y="148" text-anchor="middle" font-size="30" fill="#2a6a9a">T</text>${T(110, 232, 'Hoch: viel Druck', 'middle', 12)}${T(290, 232, 'Tief: wenig Druck', 'middle', 12)}
    <g id="pt"></g>${T(200, 20, '', 'middle', 14, 'wm')}${T(200, 280, '', 'middle', 12, 'wn')}`,
  phasen: [
    {wer: 'smilla', t: 'Hier ein Hoch, dort ein Tief. Im Hoch drückt die Luft stärker, im Tief schwächer.'},
    {wer: 'hinnerk', t: 'Die Luft will vom hohen zum tiefen Druck. Das ist der Wind.', min: 6},
    {wer: 'smilla', t: 'Durch die Erddrehung wird sie abgelenkt. Auf der Nordhalbkugel strömt sie im Hoch im Uhrzeigersinn hinaus und im Tief gegen den Uhrzeigersinn hinein.', min: 9},
    {wer: 'hinnerk', t: 'Merk dir: Um das Tief dreht der Wind gegen den Uhrzeigersinn.', min: 6}],
  init(s, st) { st.pts = Array.from({length: 56}, (_, i) => ({a: Math.random() * 6.28, r: 10 + Math.random() * 60, x: 110 + Math.random() * 180, y: 90 + Math.random() * 100, g: i % 2})); q(s, '#pt').innerHTML = st.pts.map(() => `<circle r="3.2" fill="#2b6a9a"/>`).join(''); },
  enter(s, p, st) { q(s, '.wm').textContent = ['', 'Druckunterschied', 'Erddrehung lenkt ab', 'Wind dreht gegen den Uhrzeigersinn ums Tief'][p] || ''; },
  tick(s, tp, p, st) {
    const dt = st.dt || .016, cs = q(s, '#pt').children; st.pts.forEach((o, i) => {
      let x, y;
      if (p === 0) { x = o.x; y = o.y; o.vis = 0; }
      else if (p === 1) { o.x += 70 * dt; if (o.x > 280) { o.x = 118; o.y = 100 + Math.random() * 80; } x = o.x; y = o.y; o.vis = 1; }
      else { o.vis = 1; if (o.g) { o.a -= 1.0 * dt; o.r -= 11 * dt; if (o.r < 8) { o.r = 66; o.a = Math.random() * 6.28; } x = 290 + o.r * Math.cos(o.a); y = 140 + o.r * Math.sin(o.a); } else { o.a += 1.0 * dt; o.r += 11 * dt; if (o.r > 66) { o.r = 8; o.a = Math.random() * 6.28; } x = 110 + o.r * Math.cos(o.a); y = 140 + o.r * Math.sin(o.a); } }
      put(cs[i], {cx: x.toFixed(1), cy: y.toFixed(1), opacity: p === 0 ? 0 : (p === 3 && !o.g ? .25 : 1)});
    });
  }});

/* ============ 9 Schleuse (A10 Binnen, auch A7.8) ============ */
def('schleuse', {titel: 'Schleuse: Talfahrt', gruppe: 'A10 Binnen', art: 'pruefung', folge: 'G6.3, Binnen', wo: 'Reise Tag 11, Binnen-Akt',
  svg: `<rect width="400" height="300" fill="#cfe9f7"/><rect x="0" y="200" width="110" height="100" fill="#a8824f"/><rect x="110" y="250" width="180" height="50" fill="#a8824f"/><rect x="290" y="250" width="110" height="50" fill="#a8824f"/><rect x="96" y="200" width="18" height="50" fill="#8a8f98" stroke="#5a5f68" stroke-width="2"/>
    <rect id="wu" x="0" y="100" width="110" height="100" fill="#3d8fb8"/><rect id="wk" x="114" y="100" width="174" height="150" fill="#3d8fb8"/><rect id="wl" x="294" y="190" width="106" height="60" fill="#3d8fb8"/>
    <rect id="gu" x="108" y="100" width="5" height="100" fill="#6f747c" stroke="#44484e"/><rect id="gl" x="288" y="100" width="5" height="150" fill="#6f747c" stroke="#44484e"/>
    <rect x="0" y="0" width="400" height="30" fill="none"/>
    <g id="bt"><path d="M-24 -4H24L16 12H-16Z" fill="#f4efe6" stroke="#8a7a66" stroke-width="2"/><rect x="-6" y="-17" width="14" height="13" fill="#cfd8dc" stroke="#8a7a66"/></g>
    <g transform="translate(26 60)"><rect x="-6" y="-8" width="12" height="38" rx="5" fill="#333"/><circle id="lu1" cx="0" cy="0" r="4.5" fill="#d6332c"/><circle id="lu2" cx="0" cy="14" r="4.5" fill="#555"/></g>
    <g transform="translate(374 150)"><rect x="-6" y="-8" width="12" height="38" rx="5" fill="#333"/><circle id="ll1" cx="0" cy="0" r="4.5" fill="#d6332c"/><circle id="ll2" cx="0" cy="14" r="4.5" fill="#555"/></g>
    ${T(55, 288, 'Oberwasser', 'middle', 11)}${T(200, 288, 'Kammer', 'middle', 11)}${T(346, 288, 'Unterwasser', 'middle', 11)}${T(200, 24, '', 'middle', 13, 'sc')}`,
  phasen: [
    {wer: 'hinnerk', t: 'Wir fahren zu Tal und warten vor der Schleuse. Die Ampel steht auf Rot.'},
    {wer: 'smilla', t: 'Grün: Wir fahren in die Kammer ein und machen fest.', min: 5},
    {wer: 'hinnerk', t: 'Das obere Tor schließt, und das Wasser läuft ab. Wir sinken mit dem Wasser und fieren die Leinen mit.', min: 8},
    {wer: 'smilla', t: 'Wasser gleich hoch: Das untere Tor öffnet, und wir fahren aus.', min: 6}],
  tick(s, tp, p) {
    const yU = 100, yL = 190; let x = 40, yC = yU, gu = 0, gl = 1, lampU = 'r', lampL = 'r';
    if (p === 0) { gu = 0; } else if (p === 1) { x = lp(40, 200, ez(tp / 3.2)); lampU = 'g'; } else if (p === 2) { x = 200; gu = ez(tp / 1.2); yC = lp(yU, yL, ez((tp - 1.4) / 5.4)); } else { x = lp(200, 360, ez((tp - 1.2) / 3.4)); gu = 1; yC = yL; gl = 1 - ez(tp / 1.2); lampL = tp > 1 ? 'g' : 'r'; }
    put(q(s, '#wk'), {y: yC, height: 250 - yC}); put(q(s, '#gu'), {height: 100 * gu, y: 200 - 100 * gu, opacity: gu < .02 ? .15 : 1}); put(q(s, '#gl'), {height: 150 * gl, y: 250 - 150 * gl, opacity: gl < .02 ? .15 : 1});
    const surf = x < 112 ? yU : x < 290 ? yC : yL; put(q(s, '#bt'), {transform: `translate(${x.toFixed(1)} ${(surf - 2).toFixed(1)})`});
    const set2 = (a, b, c) => { put(q(s, a), {fill: c === 'r' ? '#ff4a3d' : '#555'}); put(q(s, b), {fill: c === 'g' ? '#2ee06a' : '#555'}); }; set2('#lu1', '#lu2', lampU); set2('#ll1', '#ll2', lampL);
    q(s, '.sc').textContent = p === 2 && tp > 1.4 && tp < 6.8 ? 'Wasser läuft ab …' : '';
  }});

/* ============ 10 Festmacher und Springs (B1, Zusatz) ============ */
const FL = {bug: [[86, 122], [62, 114], 34.9], heck: [[86, 178], [62, 186], 34.9], vor: [[86, 122], [62, 170], 66.5], acht: [[86, 178], [62, 130], 66.5]};
def('festmacher', {titel: 'Festmacher und Springs', gruppe: 'B1 Seemannschaft (Zusatz)', art: 'zusatz', folge: '–', wo: 'Reise Tag 3 (Vorschlag)',
  svg: `<rect width="400" height="300" fill="#5ba7cf"/><g transform="translate(0 -62) scale(1.5)"><rect width="70" height="300" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>${[40, 80, 120, 160, 200, 240, 280].map(y => `<path d="M0 ${y}H70" stroke="#8a6a44" stroke-width="2"/>`).join('')}
    ${[[62, 114], [62, 130], [62, 170], [62, 186]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#3a3a3a"/>`).join('')}
    ${['bug', 'heck', 'vor', 'acht'].map(k => `<path id="f_${k}" fill="none" stroke-width="3.5" stroke-linecap="round"/>`).join('')}
    <g id="bt"><path d="M0 -34 C14 -22 16 8 12 30 L-12 30 C-16 8 -14 -22 0 -34Z" transform="translate(100 150)" fill="#f4efe6" stroke="#8a7a66" stroke-width="2"/><rect x="92" y="136" width="16" height="22" rx="4" fill="#cfd8dc" stroke="#8a7a66"/></g>
    <g id="wa" opacity="0"><path id="wl" stroke="#fff" stroke-width="5"/><path id="wh" fill="#fff"/></g></g><g class="k_bug"><rect x="196" y="30" width="26" height="5" fill="#4aa3ff"/>${T(228, 37, 'Bugleine', 'start', 12)}</g><g class="k_heck"><rect x="196" y="256" width="26" height="5" fill="#4aa3ff"/>${T(228, 263, 'Heckleine', 'start', 12)}</g><g class="k_vor"><rect x="196" y="52" width="26" height="5" fill="#ffd23f"/>${T(228, 59, 'Vorspring', 'start', 12)}</g><g class="k_acht"><rect x="196" y="234" width="26" height="5" fill="#ffd23f"/>${T(228, 241, 'Achterspring', 'start', 12)}</g>${T(290, 168, '', 'middle', 12, 'fm')}`,
  phasen: [
    {wer: 'hinnerk', t: 'Vier Leinen halten das Boot an der Pier: Bugleine, Heckleine, Vorspring und Achterspring.'},
    {wer: 'smilla', t: 'Bug- und Heckleine halten das Boot an der Pier, wenn der Wind es wegdrücken will.', min: 4},
    {wer: 'hinnerk', t: 'Die Vorspring läuft vom Bug nach achtern. Sie hält das Boot, wenn es nach vorn will.', min: 4},
    {wer: 'smilla', t: 'Die Achterspring läuft vom Heck nach vorn. Sie hält das Boot, wenn es nach achtern will.', min: 4}],
  tick(s, tp, p) {
    let dx = 0, dy = 0; const u = ez(tp / 1.2); if (p === 1) dx = 10 * u; if (p === 2) dy = -14 * u; if (p === 3) dy = 14 * u;
    put(q(s, '#bt'), {transform: `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`});
    const act = {1: ['bug', 'heck'], 2: ['vor'], 3: ['acht']}[p] || [], col = {bug: '#4aa3ff', heck: '#4aa3ff', vor: '#ffd23f', acht: '#ffd23f'};
    Object.keys(FL).forEach(k => { const [a, b, L] = FL[k], A2 = [a[0] + dx, a[1] + dy], dist = Math.hypot(A2[0] - b[0], A2[1] - b[1]), taut = dist >= L - .6 && act.includes(k), sag = taut ? 0 : 8;
      put(q(s, '#f_' + k), {d: `M${A2[0]} ${A2[1]}Q${(A2[0] + b[0]) / 2} ${(A2[1] + b[1]) / 2 + sag} ${b[0]} ${b[1]}`, stroke: taut ? '#ff5a3d' : col[k], opacity: p === 0 || act.includes(k) ? 1 : .3, 'stroke-width': taut ? 5 : 3.5});
      const lab = q(s, '.k_' + k); put(lab, {opacity: p === 0 || act.includes(k) ? 1 : .3}); });
    const aw = q(s, '#wa'), W = {1: [[130, 150], [158, 150]], 2: [[170, 150], [170, 126]], 3: [[170, 150], [170, 174]]}[p];
    if (W) { put(aw, {opacity: ez(tp / .5)}); put(q(s, '#wl'), {d: `M${W[0][0]} ${W[0][1]}L${W[1][0]} ${W[1][1]}`}); const dx2 = W[1][0] - W[0][0], dy2 = W[1][1] - W[0][1], l = Math.hypot(dx2, dy2), ux = dx2 / l, uy = dy2 / l; put(q(s, '#wh'), {d: `M${W[1][0] + ux * 9} ${W[1][1] + uy * 9}L${W[1][0] - uy * 7} ${W[1][1] + ux * 7}L${W[1][0] + uy * 7} ${W[1][1] - ux * 7}Z`}); } else put(aw, {opacity: 0});
    q(s, '.fm').textContent = p === 1 ? 'Wind drückt das Boot von der Pier weg' : p === 2 ? 'Das Boot will nach vorn' : p === 3 ? 'Das Boot will nach achtern' : '';
  }});

/* ============ 11 Mayday (B2, Zusatz) ============ */
const MAYD = [['1', '3× MAYDAY'], ['2', 'Name des Bootes (3×)'], ['3', 'Wo? Position'], ['4', 'Was ist los?'], ['5', 'Wie viele Personen? Hilfe erbeten']];
def('mayday', {titel: 'Notruf: Mayday-Ablauf', gruppe: 'B2 Sicherheit (Zusatz)', art: 'zusatz', folge: '–', wo: 'Reise Tag 44 (Vorschlag)',
  svg: `<rect width="400" height="300" fill="#16253f"/><g transform="translate(78 150)"><g id="rg">${[0, 1, 2].map(i => `<circle class="rg" r="22" fill="none" stroke="#f08a1c" stroke-width="3" opacity="0"/>`).join('')}</g><rect x="-30" y="-8" width="60" height="44" rx="8" fill="#3a4a66" stroke="#8aa" stroke-width="2"/><circle cx="-12" cy="14" r="10" fill="#222" stroke="#8aa"/><rect x="6" y="2" width="18" height="8" rx="2" fill="#6ad46a"/><path d="M18 -8V-40" stroke="#8aa" stroke-width="3"/></g>
    ${MAYD.map(([n, tx], i) => `<g id="m${i}" transform="translate(150 ${34 + i * 50})"><rect width="236" height="40" rx="10" fill="#243556" stroke="#3b5580" stroke-width="2"/><circle cx="20" cy="20" r="12" fill="#f08a1c"/><text class="t" x="20" y="25" text-anchor="middle" font-size="13" style="fill:#fff;stroke:none">${n}</text><text class="t" x="42" y="25" font-size="12" style="fill:#e8eef8;stroke:none">${tx}</text></g>`).join('')}`,
  phasen: [
    {wer: 'smilla', t: 'Ein Notruf hat eine feste Reihenfolge. Fünf Dinge, immer in derselben Folge.'},
    {wer: 'hinnerk', t: 'Zuerst dreimal Mayday. Damit weiß jeder: Das ist ein echter Notfall.', min: 4},
    {wer: 'smilla', t: 'Dann der Name deines Bootes, dreimal.', min: 4},
    {wer: 'hinnerk', t: 'Wo bist du? Die Position, oder eine Peilung zu einem bekannten Punkt.', min: 4},
    {wer: 'smilla', t: 'Was ist los? Feuer, Wassereinbruch, ein Mensch über Bord.', min: 4},
    {wer: 'hinnerk', t: 'Wie viele Personen sind an Bord, und welche Hilfe brauchst du? Dann Over und zuhören.', min: 5}],
  enter(s, p) { MAYD.forEach((x, i) => put(q(s, '#m' + i), {opacity: p === 0 || i < p ? (p === 0 || i === p - 1 ? 1 : .55) : .25})); },
  tick(s, tp, p) { s.querySelectorAll('.rg').forEach((c, i) => { const u = ((tp * .7 + i / 3) % 1); put(c, {r: 22 + u * 70, opacity: p >= 1 ? (1 - u) * .8 : 0}); }); }});

/* ============ 12 Echolot (B3, Zusatz) ============ */
const bodenF = x => 200 + 30 * Math.sin(x / 45) + 14 * Math.sin(x / 19 + 1) - 90 * Math.exp(-Math.pow((x - 330) / 38, 2));
def('echolot', {titel: 'Echolot und Wassertiefe', gruppe: 'B3 Technik (Zusatz)', art: 'zusatz', folge: '–', wo: 'Reise Tag 4 (Vorschlag)',
  svg: `<rect width="400" height="300" fill="#cfe9f7"/><rect y="86" width="400" height="214" fill="#3d8fb8"/><path id="bd" fill="#d8b87a" stroke="#a88a4a" stroke-width="2"/>
    <path id="bm" fill="rgba(255,255,255,.28)"/><g transform="translate(120 86)"><path d="M-30 -6H30L22 12H-22Z" fill="#f4efe6" stroke="#8a7a66" stroke-width="2"/><rect x="-8" y="-20" width="16" height="14" fill="#cfd8dc" stroke="#8a7a66"/></g>
    <g transform="translate(236 10)"><rect width="156" height="82" rx="8" fill="#0f2740" stroke="#8aa" stroke-width="2"/><path id="tr" fill="none" stroke="#6ad4ff" stroke-width="2.5"/><text class="t" x="78" y="75" text-anchor="middle" font-size="9" style="fill:#cfe7ff;stroke:none">Echogramm (Zeit nach links)</text></g>
    ${T(70, 40, '', 'middle', 15, 'tf')}${T(70, 62, '', 'middle', 12, 'tk')}${T(200, 292, '', 'middle', 12, 'tw')}`,
  phasen: [
    {wer: 'hinnerk', t: 'Das Echolot schickt einen Schall nach unten und misst, wie lange das Echo braucht. So kennt es die Tiefe.'},
    {wer: 'smilla', t: 'Während wir fahren, zeichnet es den Grund als Linie auf.', min: 6},
    {wer: 'hinnerk', t: 'Da kommt eine Sandbank. Das Wasser unter dem Kiel wird knapp. Jetzt Fahrt raus und Kurs ändern.', min: 8},
    {wer: 'smilla', t: 'Aber Achtung: Das Echolot zeigt nur, was direkt unter dem Geber ist. Voraus siehst du nichts, also immer auch in die Karte schauen.', min: 7}],
  init(s, st) { st.hist = []; st.wx = 0; st.acc = 0; },
  tick(s, tp, p, st) {
    const dt = st.dt || .016, sp = p === 0 ? 0 : p === 2 ? 26 : 40; if (p === 2 && tp > 4.5) st.slow = true; st.wx += sp * dt;
    const pts = []; for (let x = 0; x <= 400; x += 8) pts.push(`${x} ${bodenF(x + st.wx).toFixed(1)}`); put(q(s, '#bd'), {d: `M${pts.join('L')}V300H0Z`});
    const y = bodenF(120 + st.wx), tiefe = (y - 86) / 14, kiel = tiefe - 1.2; st.acc += dt; if (st.acc > .12 && p > 0) { st.acc = 0; st.hist.push(tiefe); if (st.hist.length > 60) st.hist.shift(); }
    put(q(s, '#bm'), {d: `M120 98L${(120 - 12).toFixed(1)} ${y.toFixed(1)}L${(120 + 12).toFixed(1)} ${y.toFixed(1)}Z`}); q(s, '.tf').textContent = `Tiefe: ${tiefe.toFixed(1).replace('.', ',')} m`; q(s, '.tk').textContent = `unter dem Kiel: ${kiel.toFixed(1).replace('.', ',')} m`;
    put(q(s, '#tr'), {d: st.hist.length > 1 ? 'M' + st.hist.map((t, i) => `${(150 - (st.hist.length - 1 - i) * 2.4 + 0).toFixed(1)} ${(8 + Math.min(52, t * 4.5)).toFixed(1)}`).join('L') : ''});
    q(s, '.tw').textContent = kiel < 1.2 ? 'Flach! Wenig Wasser unter dem Kiel' : ''; put(q(s, '.tw'), {style: 'fill:#c0392b'});
  }});

/* ============ 13 Steile See (B4, Zusatz) ============ */
def('steilesee', {titel: 'Wind gegen Strom: steile See', gruppe: 'B4 Revier (Zusatz)', art: 'zusatz', folge: '–', wo: 'Reise Tag 22 (Vorschlag)',
  svg: `<rect width="400" height="300" fill="#cfe9f7"/><path id="wv" fill="#3d8fb8"/><path id="wc" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 14"/><g id="bt"><path d="M-30 -4H30L22 12H-22Z" fill="#f4efe6" stroke="#8a7a66" stroke-width="2"/><rect x="-6" y="-18" width="14" height="14" fill="#cfd8dc" stroke="#8a7a66"/></g>
    <g id="aw"><path d="M40 40H110" stroke="#2b3a4a" stroke-width="5" stroke-linecap="round"/><path id="awh" fill="#2b3a4a"/></g>${T(75, 28, 'Wind', 'middle', 12)}<g id="as"><path d="M40 270H110" stroke="#1d6a9a" stroke-width="5" stroke-linecap="round"/><path id="ash" fill="#1d6a9a"/></g>${T(75, 262, 'Strom', 'middle', 12)}${T(300, 40, '', 'middle', 13, 'sw')}`,
  phasen: [
    {wer: 'hinnerk', t: 'Wind und Strom laufen in dieselbe Richtung: lange, flache Wellen.'},
    {wer: 'smilla', t: 'Läuft der Strom gegen den Wind, stauen sich die Wellen: kurz und steil.', min: 7},
    {wer: 'hinnerk', t: 'Vor Flussmündungen und Sandbänken wird das schnell gefährlich. Warte lieber ab, bis der Strom nachlässt.', min: 7}],
  init(s, st) { st.A = 6; st.L = 150; },
  tick(s, tp, p, st) {
    const dt = st.dt || .016, tA = [6, 12, 18][p], tL = [150, 95, 78][p]; st.A += (tA - st.A) * Math.min(1, dt * 1.6); st.L += (tL - st.L) * Math.min(1, dt * 1.6);
    const dir = 1, k = 2 * Math.PI / st.L, w = 2.4, y = x => 170 + st.A * Math.sin(k * x - w * tp * dir);
    const pts = []; for (let x = 0; x <= 400; x += 5) pts.push(`${x} ${y(x).toFixed(1)}`); put(q(s, '#wv'), {d: `M${pts.join('L')}V300H0Z`}); put(q(s, '#wc'), {d: p === 0 ? '' : `M${pts.join('L')}`, opacity: p === 0 ? 0 : .8});
    const bx = 250, by = y(bx) - 4, sl = (y(bx + 14) - y(bx - 14)) / 28; put(q(s, '#bt'), {transform: `translate(${bx} ${by.toFixed(1)}) rotate(${cl(Math.atan(sl * .5) * 180 / Math.PI, -26, 26).toFixed(1)})`});
    const arr = (hid, x, d) => put(q(s, hid), {d: d > 0 ? `M${x + 14} 0l-12 -8v16Z`.replace(/^M/, 'M') : ''});
    put(q(s, '#awh'), {d: 'M118 40l-14 -9v18Z'}); put(q(s, '#ash'), {d: p === 0 ? 'M118 270l-14 -9v18Z' : 'M32 270l14 -9v18Z'}); put(q(s, '#as path:first-child'), {d: p === 0 ? 'M40 270H110' : 'M44 270H114'});
    q(s, '.sw').textContent = ['Wind mit Strom', 'Wind gegen Strom', 'Wind gegen Strom, Barre'][p];
  }});

/* ---------- Knoten (A3) verweist auf das Knotenbrett ---------- */
A.knoten = {titel: 'Prüfungsknoten', gruppe: 'A3 Knoten', art: 'pruefung', folge: 'G1.2, S10.1', wo: 'Knotenbrett (fertig)'};

/* ---------- Seite „Animationen“ ---------- */
const notes = () => { S.animNotes = S.animNotes || {}; return S.animNotes; };
const zuText = () => A.order.map(id => ({id, t: notes()[id]})).filter(x => x.t && x.t.trim()).map(x => `${A.defs[x.id].titel} (${x.id}): ${x.t.trim()}`).join('\n');
A.seite = async function () {
  css(); await window.nachladen('szene.js'); await window.nachladen('reise.js');
  const grp = art => A.order.filter(id => A.defs[id].art === art).map(id => { const d = A.defs[id], n = (notes()[id] || '').trim(); return `<div class="card"><b>${esc(d.titel)}</b><div class="small muted" style="margin:3px 0"><span class="tag2${art === 'zusatz' ? ' z' : ''}">${esc(d.gruppe)}</span>${d.folge && d.folge !== '–' ? `<span class="tag2">${esc(d.folge)}</span>` : ''}${n ? '<span class="tag2">📝 Notiz</span>' : ''}</div><button class="btn small" data-an="${id}">▶ Ansehen</button></div>`; }).join('');
  gameShell('Animationen', `<div class="anlist"><p class="small muted" style="margin:0 0 6px">Je Gruppe ein Beispiel. Tippe auf „Ansehen“. Unter jeder Animation kannst du dir Änderungen notieren.</p>
    <h3>Prüfungsstoff</h3>${grp('pruefung')}<div class="card"><b>${esc(A.knoten.titel)}</b><div class="small muted" style="margin:3px 0"><span class="tag2">${esc(A.knoten.gruppe)}</span><span class="tag2">${esc(A.knoten.folge)}</span></div><button class="btn small" id="ankn">🪢 Zum Knotenbrett</button></div>
    <h3>Zusatz (nicht geprüft)</h3>${grp('zusatz')}<h3>Meine Änderungsvorschläge</h3><button class="btn small ghost" id="ancopy">📋 Alle Notizen kopieren</button></div>`);
  $('#gback').onclick = () => { setTab('cabin'); };
  document.querySelectorAll('[data-an]').forEach(b => b.onclick = () => { AUD.click && AUD.click(); A.spiele(b.dataset.an); });
  $('#ankn').onclick = () => knotenBrett();
  $('#ancopy').onclick = () => { const t = zuText() || '(noch keine Notizen)'; if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Notizen kopiert.'), () => toast(t)); else toast(t); };
};
A.spiele = function (id) {
  const d = A.defs[id]; let p = 0, auto = false, stopp = false, ton = true;
  gameShell(d.titel, `<div class="anstage" id="anstage">${A.html(id)}</div><div class="ancap" id="ancap"></div>
    <div class="anctl"><button class="btn small ghost" id="anz">◀</button><span class="dots" id="andots">${d.phasen.map(() => '<i></i>').join('')}</span><button class="btn small" id="anw">▶</button><button class="btn small ghost" id="anau">⏯ Auto</button><button class="btn small ghost" id="anto" aria-pressed="true">🔊</button><button class="btn small ghost" id="anre">↻</button></div>
    <label class="small muted" style="display:block;margin-top:10px">Mein Änderungsvorschlag zu dieser Animation</label><textarea class="annote" id="annote" placeholder="Zum Beispiel: Pfeil größer, Text kürzer, andere Farbe …">${esc(notes()[id] || '')}</textarea>`);
  const host = $('#anstage'), svg = A.start(host), cap = () => { $('#ancap').innerHTML = `<b>${esc(({hinnerk: 'Käpt\'n', smilla: 'Smilla', klabauter: 'Klabauter'})[d.phasen[p].wer] || '')}:</b> ${esc(d.phasen[p].t)}`; document.querySelectorAll('#andots i').forEach((e, i) => e.classList.toggle('on', i === p)); };
  const gehe = n => { p = cl(n, 0, d.phasen.length - 1); if (window.VOX) VOX.stop('anim'); A.phase(svg, p); cap(); }; cap();
  const sprich = () => ton && window.VOX ? Promise.resolve(VOX.say(d.phasen[p].wer, d.phasen[p].t, 'local')).catch(() => {}) : Promise.resolve();
  const warte = ms => new Promise(r => setTimeout(r, ms));
  const lauf = async () => { while (auto && !stopp && svg.isConnected) { await Promise.all([sprich(), warte((d.phasen[p].min || 3.5) * 1000)]); if (!auto || stopp) return; if (p >= d.phasen.length - 1) { auto = false; $('#anau').textContent = '⏯ Auto'; return; } gehe(p + 1); } };
  $('#anw').onclick = () => { auto = false; $('#anau').textContent = '⏯ Auto'; gehe(p + 1); }; $('#anz').onclick = () => { auto = false; $('#anau').textContent = '⏯ Auto'; gehe(p - 1); };
  $('#anre').onclick = () => { auto = false; $('#anau').textContent = '⏯ Auto'; gehe(p); };
  $('#anau').onclick = () => { AUD.unlock && AUD.unlock(); auto = !auto; $('#anau').textContent = auto ? '⏸ Stopp' : '⏯ Auto'; if (auto) { if (p >= d.phasen.length - 1) gehe(0); lauf(); } else if (window.VOX) VOX.stop('anim'); };
  $('#anto').onclick = () => { ton = !ton; $('#anto').textContent = ton ? '🔊' : '🔇'; $('#anto').setAttribute('aria-pressed', ton); if (!ton && window.VOX) VOX.stop('anim'); };
  $('#annote').oninput = e => { notes()[id] = e.target.value; save(); };
  $('#gback').onclick = () => { stopp = true; auto = false; if (window.VOX) VOX.stop('anim'); A.seite(); };
};
})();
