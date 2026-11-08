/* ==========================================================================
   Skipper – Test der Bühne für Animationen (v5.30, O168: Nutzer 08.11.2026 „teste das mit 3 Animationen“)
   Drei Animationen, je zweimal: H = Hochformat 400 × 500, Q = Querformat 400 × 300, aber näher rangezoomt.
   Mit den Kommentaren des Nutzers: A1.1 (querab und achteraus mit eigenem Pfeil, Mittschiffslinie längs, keine Pfeile bei Bug und Heck,
   „Backbord: die linke ist rot“), A1.3 (spitz anfahren, rückwärts einkuppeln, beim Abbremsen zieht das Heck an die Pier; Anprall sichtbar),
   A2.3 (Anker geht in den Boden und gräbt sich ein, Wind sichtbar, größer). Marke „Prüfung/Wissen“ je Phase (O170). Boot aus boot.js (O169).
   Nach der Entscheidung wird das gewählte Format für alle Animationen übernommen; diese Datei fällt dann weg.
   ========================================================================== */
(() => {
const A = window.ANIM, BO = window.BOOT; if (!A || !A.szene || !BO || A.defs.t_boot_h) return;
const S = A.szene, B = A.bau, {q, qa, P, H, M, K} = A.hilfe;
const T = (x, y, txt, a = 'middle', sz = 18, cls = '') => `<text class="t ${cls}" x="${x}" y="${y}" text-anchor="${a}" font-size="${sz}">${txt}</text>`;
const wasser = (w, h, c = '#5ba7cf') => `<rect width="${w}" height="${h}" fill="${c}"/>` + Array.from({length: Math.round(w * h / 9000)}, (_, i) => { const x = (i * 97) % (w - 30) + 10, y = (i * 61) % (h - 40) + 30; return `<path d="M${x} ${y} q8 -5 16 0 t16 0" stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none"/>`; }).join('');
const pier = (h, w = 64) => `<rect width="${w}" height="${h}" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>` + Array.from({length: Math.ceil(h / 50)}, (_, i) => `<path d="M0 ${i * 50 + 25}H${w}" stroke="#8a6a44" stroke-width="2"/>`).join('');
const gemein = {marke: true, gross: true, neu: '5.30'};

/* ---------- A1.1 Das Boot und seine Seiten ---------- */
const bootPhasen = [
  P(H, 'Das ist unsere Frieda von oben. Vorne ist der Bug, hinten das Heck.', {cap: 'Bug und Heck', an: ['bug', 'heck']}),
  P(M, 'In Fahrtrichtung links ist Backbord, rechts Steuerbord. Backbord hat das rote Licht, Steuerbord das grüne.', {cap: 'Backbord und Steuerbord', an: ['bb', 'sb']}),
  P(H, 'Was vor uns liegt, liegt voraus. Was hinter uns liegt, achteraus. Und was genau seitlich liegt, im rechten Winkel, liegt querab.', {cap: 'voraus, achteraus, querab', an: ['voraus', 'achtern', 'qbb', 'qsb'], aus: ['bug', 'heck']}),
  P(M, 'Die Linie längs durchs Boot, vom Bug zum Heck, ist die Mitte. Ruder mittschiffs heißt: Das Ruder steht gerade, wir fahren geradeaus.', {cap: 'mittschiffs', an: ['mitte'], aus: ['voraus', 'achtern', 'qbb', 'qsb']}),
  P(K, 'Backbord! Die linke ist rot! Die linke ist rot!', {cap: 'Merkwort', pr: false, an: ['merk', 'bug', 'heck'], aus: ['mitte']})];
S('t_boot_h', {...gemein, titel: 'Test H: Das Boot und seine Seiten', nr: 'T1 H', gruppe: 'Test', folge: 'G1.2', vb: [400, 500],
  bg: wasser(400, 500), obj: {boot: BO.oben({lichter: true}), bug: T(0, 0, 'Bug', 'middle', 20), heck: T(0, 0, 'Heck', 'middle', 20), bb: T(0, 0, 'Backbord', 'middle', 20, 'r'), sb: T(0, 0, 'Steuerbord', 'middle', 20, 'gr'),
    voraus: B.pfeil(0, 0, 0, -46, '#fff', 5) + T(0, -56, 'voraus', 'middle', 18), achtern: B.pfeil(0, 0, 0, 40, '#fff', 5) + T(0, 66, 'achteraus', 'middle', 18),
    qbb: B.pfeil(0, 0, -86, 0, '#f2c200', 5) + T(-50, 30, 'querab', 'middle', 18), qsb: B.pfeil(0, 0, 86, 0, '#f2c200', 5) + T(50, 30, 'querab', 'middle', 18),
    mitte: '<path d="M0 -125 V140" stroke="#fff" stroke-width="3" stroke-dasharray="9 7"/>' + T(14, -60, 'mittschiffs', 'start', 18),
    merk: `<rect x="-150" y="-26" width="300" height="52" rx="16" fill="#fff8ea" stroke="#c0392b" stroke-width="3"/>` + T(0, 9, 'Backbord: die linke ist rot', 'middle', 22, 'r')},
  start: {boot: {x: 200, y: 270, s: 2.4}, bug: {x: 200, y: 136, o: 0}, heck: {x: 200, y: 432, o: 0}, bb: {x: 78, y: 200, o: 0}, sb: {x: 322, y: 200, o: 0}, voraus: {x: 200, y: 140, o: 0}, achtern: {x: 200, y: 420, o: 0}, qbb: {x: 152, y: 285, o: 0}, qsb: {x: 248, y: 285, o: 0}, mitte: {x: 200, y: 270, o: 0}, merk: {x: 200, y: 470, o: 0}},
  phasen: bootPhasen});
S('t_boot_q', {...gemein, titel: 'Test Q: Das Boot und seine Seiten', nr: 'T1 Q', gruppe: 'Test', folge: 'G1.2',
  bg: wasser(400, 300), obj: {boot: BO.oben({lichter: true}), bug: T(0, 0, 'Bug', 'middle', 20), heck: T(0, 0, 'Heck', 'middle', 20), bb: T(0, 0, 'Backbord', 'middle', 20, 'r'), sb: T(0, 0, 'Steuerbord', 'middle', 20, 'gr'),
    voraus: B.pfeil(0, 0, 40, 0, '#fff', 5) + T(18, -14, 'voraus', 'middle', 17), achtern: B.pfeil(0, 0, -30, 0, '#fff', 5) + T(4, 30, 'achteraus', 'middle', 17),
    qbb: B.pfeil(0, 0, 0, -48, '#f2c200', 5) + T(14, -30, 'querab', 'start', 17), qsb: B.pfeil(0, 0, 0, 48, '#f2c200', 5) + T(14, 38, 'querab', 'start', 17),
    mitte: '<path d="M-150 0 H150" stroke="#fff" stroke-width="3" stroke-dasharray="9 7"/>' + T(-60, -10, 'mittschiffs', 'middle', 17),
    merk: `<rect x="-150" y="-24" width="300" height="48" rx="16" fill="#fff8ea" stroke="#c0392b" stroke-width="3"/>` + T(0, 8, 'Backbord: die linke ist rot', 'middle', 21, 'r')},
  start: {boot: {x: 196, y: 172, r: 90, s: 2.6}, bug: {x: 362, y: 140, o: 0}, heck: {x: 44, y: 214, o: 0}, bb: {x: 196, y: 108, o: 0}, sb: {x: 196, y: 250, o: 0}, voraus: {x: 330, y: 172, o: 0}, achtern: {x: 38, y: 172, o: 0}, qbb: {x: 250, y: 120, o: 0}, qsb: {x: 250, y: 224, o: 0}, mitte: {x: 196, y: 172, o: 0}, merk: {x: 200, y: 270, o: 0}},
  phasen: bootPhasen.map((ph, i) => i === 2 ? {...ph, aus: ['bug', 'heck', 'bb', 'sb']} : i === 3 ? {...ph, an: ['mitte', 'bb', 'sb']} : i === 4 ? {...ph, aus: ['mitte', 'sb']} : ph),
  enter(s, p) { /* im Querformat fährt das Boot nach rechts: Backbord liegt oben */ }});

/* ---------- A1.3 Radeffekt von oben: Anlegen mit Backbord ---------- */
const prall = `<g class="prall" opacity="0"><path class="fl" d="M0 60 Q10 54 17 44" stroke="#fff" stroke-width="3" fill="none"/><path class="fl" d="M3 64 Q14 58 21 48" stroke="#fff" stroke-width="2.5" fill="none"/>
  <g class="pu"><circle cx="20" cy="42" r="6" fill="#fff" opacity=".9"/><circle cx="24" cy="36" r="4" fill="#fff" opacity=".8"/><circle cx="23" cy="48" r="3.5" fill="#fff" opacity=".8"/></g>
  ${B.pfeil(44, 42, 22, 42, '#f08a1c', 4)}</g>`;
const radPhasen = (P0, P1, P2, P3) => [
  P(H, 'Wir wollen mit Backbord an die Pier. Langsam und spitz anfahren, der Bug zeigt schräg auf den Liegeplatz.', {cap: 'Spitz anfahren, langsam', pr: true, k: {boot: P1}, dur: 3.5}),
  P(M, 'Kurz vor der Pier auskuppeln. Das Boot gleitet aus, der Bug kommt nah an die Kante.', {cap: 'Auskuppeln, ausgleiten', k: {boot: P2}, dur: 2.5}),
  P(H, 'Jetzt rückwärts einkuppeln zum Aufstoppen. Der rechtsdrehende Propeller wirft das Wasser rechts gegen das Heck, und das Heck zieht nach links an die Pier.', {cap: 'Rückwärts: Heck zieht an die Pier', k: {boot: P3}, dur: 3.5, fx: s => s.querySelectorAll('.prall').forEach(e => e.setAttribute('opacity', 1))}),
  P(M, 'Das Boot liegt parallel an der Pier. Fender sind schon draußen, jetzt die Leinen an Land.', {cap: 'Liegt parallel: Leinen fest', an: ['leinen'], fx: s => s.querySelectorAll('.prall').forEach(e => e.setAttribute('opacity', 0))})];
const fender = `<g fill="#2e86c1"><rect x="-23" y="-22" width="6" height="14" rx="3"/><rect x="-23" y="8" width="6" height="14" rx="3"/></g>`;
S('t_radoben_h', {...gemein, titel: 'Test H: Anlegen mit Radeffekt', nr: 'T2 H', gruppe: 'Test', folge: 'G2.1, G3.1', vb: [400, 500],
  bg: wasser(400, 500) + pier(500, 64) + '<circle cx="56" cy="150" r="7" fill="#333"/><circle cx="56" cy="300" r="7" fill="#333"/>',
  obj: {leinen: '<path d="M88 172 Q70 160 56 150 M88 290 Q70 300 56 300" stroke="#e8c46a" stroke-width="3.5" fill="none"/>', boot: BO.oben() + fender + prall},
  start: {leinen: {o: 0}, boot: {x: 300, y: 430, r: -32, s: 1.6}},
  phasen: radPhasen(null, {x: 180, y: 270, r: -32}, {x: 140, y: 225, r: -30}, {x: 97, y: 225, r: 0}), oben: ''});
S('t_radoben_q', {...gemein, titel: 'Test Q: Anlegen mit Radeffekt', nr: 'T2 Q', gruppe: 'Test', folge: 'G2.1, G3.1',
  bg: wasser(400, 300) + pier(300, 54) + '<circle cx="47" cy="90" r="6" fill="#333"/><circle cx="47" cy="210" r="6" fill="#333"/>',
  obj: {leinen: '<path d="M78 112 Q62 100 47 90 M78 190 Q62 200 47 210" stroke="#e8c46a" stroke-width="3.5" fill="none"/>', boot: BO.oben() + fender + prall},
  start: {leinen: {o: 0}, boot: {x: 330, y: 280, r: -55, s: 1.4}},
  phasen: radPhasen(null, {x: 175, y: 190, r: -45}, {x: 125, y: 155, r: -40}, {x: 82, y: 150, r: 0})});

/* ---------- A2.3 Ankern ---------- */
const wind = (y0, n, l = 60) => Array.from({length: n}, (_, i) => B.pfeil(20 + (i % 2) * 40, y0 + i * 22, 20 + (i % 2) * 40 + l, y0 + i * 22, '#fff', 3, 'fl')).join('');
const anker = '<g class="ak"><path d="M0 -26 V6" stroke="#2b2b2b" stroke-width="4.5"/><circle cy="-28" r="4" fill="none" stroke="#2b2b2b" stroke-width="3"/><path d="M-14 -4 Q0 16 14 -4" stroke="#2b2b2b" stroke-width="5" fill="none"/><path d="M-14 -4 l-4 -7 M14 -4 l4 -7" stroke="#2b2b2b" stroke-width="4"/></g>';
const ankerSzene = (vb, lay) => {
  const [W, Hh] = vb, wl = lay.wl, gy = lay.gy, s = lay.s;
  const bug = c => [c.boot.x - 82 * s, wl - 22 * s];
  return {...gemein, vb: vb.length === 2 && Hh === 500 ? vb : undefined,
    bg: `<rect width="${W}" height="${wl}" fill="#bfe0f2"/><rect y="${wl}" width="${W}" height="${Hh - wl}" fill="#4d93bd"/>` + `<path d="M14 ${wl} l0 -34 l9 0 l0 34z" fill="#f4efe6" stroke="#555"/><path d="M12 ${wl - 34} l13 0 l-6.5 -9z" fill="#c0392b"/>` + `<path d="M0 ${gy - 8} Q${W / 3} ${gy - 18} ${W * .66} ${gy - 6} T${W} ${gy - 10} V${Hh} H0Z" fill="#c9b27c"/>`,
    obj: {wind: wind(lay.windY, lay.windN), kette: '<path class="kt" stroke="#3a3a3a" stroke-width="3.2" fill="none"/>', anker, boden: `<path d="M0 ${gy + 2} Q${W / 3} ${gy - 6} ${W * .66} ${gy + 4} T${W} ${gy} V${Hh} H0Z" fill="#c9b27c"/>` + Array.from({length: 9}, (_, i) => `<ellipse cx="${30 + i * 44}" cy="${gy + 18 + (i % 3) * 8}" rx="7" ry="4" fill="#a8925f"/>`).join(''),
      boot: BO.seite({bugLinks: true}), ball: '<path d="M0 8 V22" stroke="#333" stroke-width="2"/>' + B.ball(0, 0, 8), hand: T(0, 0, '✋', 'middle', 26), peil: `<path d="M0 0 L${-lay.peilL} ${lay.peilY}" stroke="#f2c200" stroke-width="2.5" stroke-dasharray="7 5"/>` + T(-lay.peilL / 2, lay.peilY / 2 - 10, 'Ankerpeilung', 'middle', 16)},
    start: {wind: {}, anker: {x: lay.ax, y: wl, o: 0}, boot: {x: lay.bx0, y: wl, s}, ball: {o: 0}, hand: {o: 0}, peil: {o: 0}},
    fx(sv, tp, p, st, c) { const k = sv.querySelector('.kt'); if (!k) return; if (c.anker.o < .05) { k.setAttribute('d', ''); return; } const [bx, by] = bug(c), ax = c.anker.x, ay = c.anker.y - 26;
      k.setAttribute('d', ay > gy - 40 && bx - ax > 30 ? `M${bx} ${by} C${bx} ${(by + gy) / 2} ${ax + (bx - ax) * .55} ${gy - 6} ${ax + 30} ${gy - 8} L${ax} ${ay}` : `M${bx} ${by} L${ax} ${ay}`);
      const b = sv.querySelector('[data-o="ball"]'); if (b) b.setAttribute('transform', `translate(${(bx + 14 * s).toFixed(1)} ${(wl - 48 * s).toFixed(1)})`);
      const h = sv.querySelector('[data-o="hand"]'); if (h) h.setAttribute('transform', `translate(${(bx + 6).toFixed(1)} ${(by - 18).toFixed(1)})`);
      const pe = sv.querySelector('[data-o="peil"]'); if (pe) pe.setAttribute('transform', `translate(${(c.boot.x - 10 * s).toFixed(1)} ${(wl - 50 * s).toFixed(1)})`); },
    phasen: [
      P(H, 'Der Wind kommt von links. Wir fahren langsam gegen den Wind und stoppen auf. Erst wenn das Boot steht, geht der Anker runter.', {cap: 'Gegen den Wind aufstoppen', pr: false, k: {boot: {x: lay.bx1}}, dur: 3}),
      P(M, 'Anker fallen lassen, bis er auf dem Grund liegt.', {cap: 'Anker fallen lassen', pr: false, k: {anker: {o: 1, y: gy - 4}}, dur: 2.5}),
      P(H, 'Der Wind drückt uns zurück, und wir stecken Kette: etwa drei- bis fünfmal so viel, wie das Wasser tief ist. Die Kette legt sich flach auf den Grund.', {cap: 'Kette stecken, sie liegt am Grund', pr: false, k: {boot: {x: lay.bx2}}, dur: 4}),
      P(M, 'Jetzt kurz rückwärts einfahren. Der Zug ist flach, und der Anker gräbt sich mit der Spitze in den Grund.', {cap: 'Einfahren: der Anker gräbt sich ein', pr: false, k: {boot: {x: lay.bx2 + 14}, anker: {y: gy + 6, r: -38}}, dur: 3}),
      P(H, 'Hält er? Hand auf die Kette: Ruckt sie nicht, und ändert sich die Peilung zu einer Landmarke nicht, hält er.', {cap: 'Hält er? Kette und Ankerpeilung', pr: true, an: ['hand', 'peil']}),
      P(M, 'Tagsüber zeigen wir vorn einen schwarzen Ball: Wir liegen vor Anker.', {cap: 'Ankerball am Tag', pr: true, an: ['ball'], aus: ['hand', 'peil']})]};
};
S('t_ankern_h', {titel: 'Test H: Ankern', nr: 'T3 H', gruppe: 'Test', folge: 'G3.1, S3.2', ...ankerSzene([400, 500], {wl: 170, gy: 440, s: 1.25, windY: 70, windN: 4, ax: 70, bx0: 240, bx1: 172, bx2: 268, peilL: 242, peilY: 30})});
S('t_ankern_q', {titel: 'Test Q: Ankern', nr: 'T3 Q', gruppe: 'Test', folge: 'G3.1, S3.2', ...ankerSzene([400, 300], {wl: 110, gy: 265, s: 1.1, windY: 48, windN: 2, ax: 70, bx0: 215, bx1: 160, bx2: 262, peilL: 232, peilY: 26})});
})();
