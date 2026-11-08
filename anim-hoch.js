/* ==========================================================================
   Skipper – Animationen im Hochformat (ab v5.32, O168: Nutzer 08.11.2026 „auf jeden Fall alles auf Hochformat umstellen“)
   Wird zuletzt geladen (ANIM.bereit) und ersetzt die alten Fassungen gleicher id an derselben Stelle der Liste.
   Bühne 400 × 500, Schrift groß, Marke „Prüfung/Wissen“ je Phase (O170), Boot aus boot.js (O169).
   Arbeitsplan und Kommentare des Nutzers: docs/animationen-umbau.md. Fachlich nach data/sbf.json, ohne quellen/ geprüft (R8).
   ========================================================================== */
(() => {
const A = window.ANIM, BO = window.BOOT; if (!A || !A.szene || !BO || A.hoch) return;
A.hoch = true;
const S = A.szene, B = A.bau, {q, qa, P, H, M, K} = A.hilfe;
const T = (x, y, txt, a = 'middle', sz = 18, cls = '') => `<text class="t ${cls}" x="${x}" y="${y}" text-anchor="${a}" font-size="${sz}">${txt}</text>`;
const HF = {vb: [400, 500], marke: true, gross: true, neu: '5.32'};
const W = 400, HH = 500;
const wasser = (h = HH, c = '#5ba7cf') => `<rect width="${W}" height="${h}" fill="${c}"/>` + Array.from({length: Math.round(W * h / 9000)}, (_, i) => { const x = (i * 97) % (W - 30) + 10, y = (i * 61) % (h - 40) + 30; return `<path d="M${x} ${y} q8 -5 16 0 t16 0" stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none"/>`; }).join('');
const pier = (h = HH, w = 64) => `<rect width="${w}" height="${h}" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>` + Array.from({length: Math.ceil(h / 50)}, (_, i) => `<path d="M0 ${i * 50 + 25}H${w}" stroke="#8a6a44" stroke-width="2"/>`).join('');
const ufer = d => `<path d="${d}" fill="#a9c48a" stroke="#7d9a62" stroke-width="2"/>`;
/* Radeffekt rückwärts (rechtsdrehender Propeller): das Wasser prallt rechts (Steuerbord) ans Heck und schiebt es nach Backbord */
const prall = (cls = 'prall') => `<g class="${cls}" opacity="0"><path class="fl" d="M0 60 Q10 54 17 44" stroke="#fff" stroke-width="3" fill="none"/><path class="fl" d="M3 64 Q14 58 21 48" stroke="#fff" stroke-width="2.5" fill="none"/>
  <g class="pu"><circle cx="20" cy="42" r="6" fill="#fff" opacity=".9"/><circle cx="24" cy="36" r="4" fill="#fff" opacity=".8"/><circle cx="23" cy="48" r="3.5" fill="#fff" opacity=".8"/></g>${B.pfeil(44, 42, 22, 42, '#f08a1c', 4)}</g>`;
const zeigPrall = an => s => qa(s, '.prall').forEach(e => e.setAttribute('opacity', an ? 1 : 0));
const fender = `<g fill="#2e86c1"><rect x="-23" y="-22" width="6" height="14" rx="3"/><rect x="-23" y="8" width="6" height="14" rx="3"/></g>`;
const schaum = '<g class="schaum" opacity="0" fill="#fff"><circle cx="-5" cy="-58" r="6"/><circle cx="6" cy="-62" r="5"/><circle cx="0" cy="-68" r="4"/></g>';

/* ---------- A1.1 Das Boot und seine Seiten ---------- */
S('boot', {...HF, titel: 'Das Boot und seine Seiten', nr: 'A1.1', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G1.2',
  bg: wasser(), obj: {boot: BO.oben({lichter: true}), bug: T(0, 0, 'Bug', 'middle', 20), heck: T(0, 0, 'Heck', 'middle', 20), bb: T(0, 0, 'Backbord', 'middle', 20, 'r'), sb: T(0, 0, 'Steuerbord', 'middle', 20, 'gr'),
    voraus: B.pfeil(0, 0, 0, -46, '#fff', 5) + T(0, -56, 'voraus', 'middle', 18), achtern: B.pfeil(0, 0, 0, 40, '#fff', 5) + T(0, 66, 'achteraus', 'middle', 18),
    qbb: B.pfeil(0, 0, -86, 0, '#f2c200', 5) + T(-50, 30, 'querab', 'middle', 18), qsb: B.pfeil(0, 0, 86, 0, '#f2c200', 5) + T(50, 30, 'querab', 'middle', 18),
    mitte: '<path d="M0 -125 V140" stroke="#fff" stroke-width="3" stroke-dasharray="9 7"/>' + T(-14, 126, 'mittschiffs', 'end', 18),
    merk: `<rect x="-150" y="-26" width="300" height="52" rx="16" fill="#fff8ea" stroke="#c0392b" stroke-width="3"/>` + T(0, 9, 'Backbord: die linke ist rot', 'middle', 22, 'r')},
  start: {boot: {x: 200, y: 270, s: 2.4}, bug: {x: 200, y: 136, o: 0}, heck: {x: 200, y: 432, o: 0}, bb: {x: 78, y: 200, o: 0}, sb: {x: 322, y: 200, o: 0}, voraus: {x: 200, y: 140, o: 0}, achtern: {x: 200, y: 420, o: 0}, qbb: {x: 152, y: 285, o: 0}, qsb: {x: 248, y: 285, o: 0}, mitte: {x: 200, y: 270, o: 0}, merk: {x: 200, y: 470, o: 0}},
  phasen: [
    P(H, 'Das ist unsere Frieda von oben. Vorne ist der Bug, hinten das Heck.', {cap: 'Bug und Heck', an: ['bug', 'heck']}),
    P(M, 'In Fahrtrichtung links ist Backbord, rechts Steuerbord. Backbord hat das rote Licht, Steuerbord das grüne.', {cap: 'Backbord und Steuerbord', an: ['bb', 'sb']}),
    P(H, 'Was vor uns liegt, liegt voraus. Was hinter uns liegt, achteraus. Und was genau seitlich liegt, im rechten Winkel, liegt querab.', {cap: 'voraus, achteraus, querab', an: ['voraus', 'achtern', 'qbb', 'qsb'], aus: ['bug', 'heck']}),
    P(M, 'Die Linie längs durchs Boot, vom Bug zum Heck, ist die Mitte. Ruder mittschiffs heißt: Das Ruder steht gerade, wir fahren geradeaus.', {cap: 'mittschiffs', an: ['mitte'], aus: ['voraus', 'achtern', 'qbb', 'qsb']}),
    P(K, 'Backbord! Die linke ist rot! Die linke ist rot!', {cap: 'Merkwort', pr: false, an: ['merk', 'bug', 'heck'], aus: ['mitte']})]});

/* ---------- A1.3 Radeffekt von oben: welche Seite zum Anlegen ---------- */
S('radoben', {...HF, titel: 'Radeffekt von oben: Anlegeseite', nr: 'A1.3', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G2.1, G3.1',
  bg: wasser() + pier(HH, 64), obj: {boot: BO.oben() + fender + prall(), txt: T(0, 0, '', 'middle', 18)},
  start: {boot: {x: 250, y: 330, s: 1.7}, txt: {x: 240, y: 470}},
  enter(s, p) { q(s, '[data-o="txt"] text').textContent = ['Heck wandert nach Backbord', 'Backbord an der Pier', 'Heck zieht zur Pier', 'Steuerbord an der Pier', 'Heck zieht weg'][p] || ''; },
  phasen: [
    P(H, 'Erst im freien Wasser: Wir legen den Rückwärtsgang ein. Der rechtsdrehende Propeller wirft das Wasser rechts gegen das Heck, und das Heck wandert nach links, nach Backbord.', {cap: 'Rückwärts: Heck nach Backbord', k: {boot: {y: 360, r: 20}}, dur: 3.5, fx: zeigPrall(true)}),
    P(M, 'Jetzt liegen wir mit Backbord an der Pier und wollen beim Anlegen aufstoppen.', {cap: 'Backbord zur Pier', k: {boot: {x: 106, y: 250, r: -12}}, dur: 2.5, fx: zeigPrall(false)}),
    P(H, 'Rückwärts einkuppeln: Das Heck zieht zur Pier, das Boot legt sich von selbst parallel. Darum ist mit rechtsdrehendem Propeller Backbord die gute Seite.', {cap: 'Der Radeffekt hilft', k: {boot: {x: 99, r: 0}}, dur: 2.5, fx: zeigPrall(true)}),
    P(M, 'Andersherum, mit Steuerbord an der Pier …', {cap: 'Jetzt mit Steuerbord an der Pier', k: {boot: {x: 99, y: 250, r: 180}}, dur: .3, fx: zeigPrall(false)}),
    P(H, '… zieht das Heck beim Aufstoppen weg vom Steg, und das Boot steht schräg.', {cap: 'Steuerbordseite: Heck zieht weg', k: {boot: {x: 125, r: 205}}, dur: 2.5, fx: zeigPrall(true)})]});

/* ---------- A2.1 Anlegen mit Backbord ---------- */
S('anlegen', {...HF, titel: 'Anlegen mit Backbord', nr: 'A2.1', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'G3.1',
  bg: wasser() + pier(HH, 64) + '<circle cx="56" cy="150" r="7" fill="#333"/><circle cx="56" cy="300" r="7" fill="#333"/>',
  obj: {leinen: '<path d="M88 172 Q70 160 56 150 M88 290 Q70 300 56 300" stroke="#e8c46a" stroke-width="3.5" fill="none"/>', winkel: '<path d="M0 0 L0 -60 M0 0 L-36 -48" stroke="#fff" stroke-width="2" stroke-dasharray="5 4" fill="none"/><path d="M0 -30 A30 30 0 0 0 -18 -24" stroke="#f2c200" stroke-width="3" fill="none"/>' + T(-6, -70, 'spitz', 'middle', 16), boot: BO.oben() + fender + prall()},
  start: {leinen: {o: 0}, winkel: {x: 300, y: 430, o: 0}, boot: {x: 300, y: 430, r: -32, s: 1.6}},
  phasen: [
    P(H, 'Wir wollen mit Backbord an die Pier. Langsam und spitz anfahren, der Bug zeigt schräg auf den Liegeplatz. Fender hängen schon draußen.', {cap: 'Spitz anfahren, langsam', an: ['winkel'], k: {boot: {x: 180, y: 270, r: -32}, winkel: {x: 180, y: 270}}, dur: 3.5}),
    P(M, 'Kurz vor der Pier auskuppeln. Das Boot gleitet aus, der Bug kommt nah an die Kante.', {cap: 'Auskuppeln, ausgleiten', aus: ['winkel'], k: {boot: {x: 140, y: 225, r: -30}}, dur: 2.5}),
    P(H, 'Jetzt rückwärts einkuppeln zum Aufstoppen. Der Radeffekt zieht das Heck nach Backbord, also an die Pier.', {cap: 'Rückwärts: Heck zieht an die Pier', k: {boot: {x: 97, y: 225, r: 0}}, dur: 3.5, fx: zeigPrall(true)}),
    P(M, 'Das Boot liegt parallel. Erst die Vorleine, dann die Achterleine an Land.', {cap: 'Leinen fest', an: ['leinen'], fx: zeigPrall(false)})]});

/* ---------- A2.3 Ankern ---------- */
const anker = '<g class="ak"><path d="M0 -26 V6" stroke="#2b2b2b" stroke-width="4.5"/><circle cy="-28" r="4" fill="none" stroke="#2b2b2b" stroke-width="3"/><path d="M-14 -4 Q0 16 14 -4" stroke="#2b2b2b" stroke-width="5" fill="none"/><path d="M-14 -4 l-4 -7 M14 -4 l4 -7" stroke="#2b2b2b" stroke-width="4"/></g>';
(() => { const wl = 170, gy = 440, s = 1.25, ax = 70, bx1 = 172, bx2 = 268;
  const bug = c => [c.boot.x - 82 * s, wl - 22 * s];
  S('ankern', {...HF, titel: 'Ankern', nr: 'A2.3', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'G3.1, S3.2',
    bg: `<rect width="${W}" height="${wl}" fill="#bfe0f2"/><rect y="${wl}" width="${W}" height="${HH - wl}" fill="#4d93bd"/><path d="M14 ${wl} l0 -34 l9 0 l0 34z" fill="#f4efe6" stroke="#555"/><path d="M12 ${wl - 34} l13 0 l-6.5 -9z" fill="#c0392b"/><path d="M0 ${gy - 8} Q${W / 3} ${gy - 18} ${W * .66} ${gy - 6} T${W} ${gy - 10} V${HH} H0Z" fill="#c9b27c"/>`,
    obj: {wind: Array.from({length: 4}, (_, i) => B.pfeil(20 + (i % 2) * 40, 70 + i * 22, 80 + (i % 2) * 40, 70 + i * 22, '#fff', 3, 'fl')).join('') + T(150, 62, 'Wind', 'start', 16), kette: '<path class="kt" stroke="#3a3a3a" stroke-width="3.2" fill="none"/>', anker,
      boden: `<path d="M0 ${gy + 2} Q${W / 3} ${gy - 6} ${W * .66} ${gy + 4} T${W} ${gy} V${HH} H0Z" fill="#c9b27c"/>` + Array.from({length: 9}, (_, i) => `<ellipse cx="${30 + i * 44}" cy="${gy + 18 + (i % 3) * 8}" rx="7" ry="4" fill="#a8925f"/>`).join(''),
      boot: BO.seite({bugLinks: true}), ball: '<path d="M0 8 V22" stroke="#333" stroke-width="2"/>' + B.ball(0, 0, 8), hand: T(0, 0, '✋', 'middle', 26), peil: `<path d="M0 0 L-242 30" stroke="#f2c200" stroke-width="2.5" stroke-dasharray="7 5"/>` + T(-121, 5, 'Ankerpeilung', 'middle', 16)},
    start: {anker: {x: ax, y: wl, o: 0}, boot: {x: 240, y: wl, s}, ball: {o: 0}, hand: {o: 0}, peil: {o: 0}},
    fx(sv, tp, p, st, c) { const k = sv.querySelector('.kt'); if (!k) return; if (c.anker.o < .05) { k.setAttribute('d', ''); return; } const [bx, by] = bug(c), x = c.anker.x, y = c.anker.y - 26;
      k.setAttribute('d', y > gy - 40 && bx - x > 30 ? `M${bx} ${by} C${bx} ${(by + gy) / 2} ${x + (bx - x) * .55} ${gy - 6} ${x + 30} ${gy - 8} L${x} ${y}` : `M${bx} ${by} L${x} ${y}`);
      const b = sv.querySelector('[data-o="ball"]'); if (b) b.setAttribute('transform', `translate(${(bx + 14 * s).toFixed(1)} ${(wl - 48 * s).toFixed(1)})`);
      const h = sv.querySelector('[data-o="hand"]'); if (h) h.setAttribute('transform', `translate(${(bx + 6).toFixed(1)} ${(by - 18).toFixed(1)})`);
      const pe = sv.querySelector('[data-o="peil"]'); if (pe) pe.setAttribute('transform', `translate(${(c.boot.x - 10 * s).toFixed(1)} ${(wl - 50 * s).toFixed(1)})`); },
    phasen: [
      P(H, 'Der Wind kommt von links. Wir fahren langsam gegen den Wind und stoppen auf. Erst wenn das Boot steht, geht der Anker runter.', {cap: 'Gegen den Wind aufstoppen', pr: false, k: {boot: {x: bx1}}, dur: 3}),
      P(M, 'Anker fallen lassen, bis er auf dem Grund liegt.', {cap: 'Anker fallen lassen', pr: false, k: {anker: {o: 1, y: gy - 4}}, dur: 2.5}),
      P(H, 'Der Wind drückt uns zurück, und wir stecken Kette: etwa drei- bis fünfmal so viel, wie das Wasser tief ist. Die Kette legt sich flach auf den Grund.', {cap: 'Kette stecken, sie liegt am Grund', pr: false, k: {boot: {x: bx2}}, dur: 4}),
      P(M, 'Jetzt kurz rückwärts einfahren. Der Zug ist flach, und der Anker gräbt sich mit der Spitze in den Grund.', {cap: 'Einfahren: der Anker gräbt sich ein', pr: false, k: {boot: {x: bx2 + 14}, anker: {y: gy + 6, r: -38}}, dur: 3}),
      P(H, 'Hält er? Hand auf die Kette: Ruckt sie nicht, und ändert sich die Peilung zu einer Landmarke nicht, hält er.', {cap: 'Hält er? Kette und Ankerpeilung', pr: true, an: ['hand', 'peil']}),
      P(M, 'Tagsüber zeigen wir vorn einen schwarzen Ball: Wir liegen vor Anker.', {cap: 'Ankerball am Tag', pr: true, an: ['ball'], aus: ['hand', 'peil']})]});
})();

/* ---------- A2.5 Wenden auf engem Raum ---------- */
S('wenden', {...HF, titel: 'Wenden auf engem Raum', nr: 'A2.5', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'S10.2', pr: false,
  bg: wasser() + ufer(`M0 0 H${W} V110 H0Z`) + ufer(`M0 ${HH} H${W} V390 H0Z`), obj: {boot: BO.oben() + prall() + '<g class="ruderpf" opacity="0">' + B.pfeil(0, 64, 18, 72, '#f2c200', 3) + '</g>', txt: T(0, 0, '', 'middle', 18)},
  start: {boot: {x: 110, y: 250, r: 90, s: 1.5}, txt: {x: 200, y: 445}},
  enter(s, p) { q(s, '[data-o="txt"] text').textContent = ['Kanal zu eng zum Rumfahren', 'Ruder hart Steuerbord, kurz voraus', 'kurz rückwärts: Heck nach Backbord', 'wieder voraus: rum!'][p] || ''; },
  phasen: [
    P(H, 'Der Kanal ist zu eng, um einfach rumzufahren. Wir drehen über Steuerbord, weil uns da der Radeffekt hilft.', {cap: 'Drehen über Steuerbord', pr: false, k: {boot: {x: 175}}, dur: 2.5}),
    P(M, 'Ruder hart Steuerbord und kurz voraus. Der Bug geht nach rechts.', {cap: 'Ruder hart Steuerbord, voraus', pr: false, k: {boot: {x: 205, y: 262, r: 150}}, dur: 2.5}),
    P(H, 'Auskuppeln, dann kurz rückwärts. Das Wasser prallt rechts ans Heck, das Heck zieht nach Backbord, und das Boot dreht auf der Stelle weiter.', {cap: 'Kurz rückwärts: Heck nach Backbord', k: {boot: {x: 196, y: 250, r: 215}}, dur: 3, fx: zeigPrall(true)}),
    P(M, 'Wieder voraus, Ruder hart Steuerbord. Noch ein Stück, und wir sind rum.', {cap: 'Wieder voraus', pr: false, k: {boot: {x: 160, y: 238, r: 270}}, dur: 2.5, fx: zeigPrall(false)})]});

/* ---------- A2.6 Aufstoppen ---------- */
S('aufstoppen', {...HF, titel: 'Aufstoppen', nr: 'A2.6', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'S10.2',
  bg: wasser(), obj: {strecke: '<path d="M0 0 V-170" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>' + T(12, -85, 'Auslaufstrecke', 'start', 16), boje: B.punkt('#f08a1c', 10) + T(0, -18, 'Ziel', 'middle', 16), boot: BO.oben() + prall() + schaum},
  start: {strecke: {x: 200, y: 390, o: 0}, boje: {x: 246, y: 150}, boot: {x: 200, y: 460, s: 1.6}},
  phasen: [
    P(H, 'Aufstoppen heißt: das Boot auf seinem Kurs zum Stehen bringen, hier genau neben der Boje.', {cap: 'Ziel: neben der Boje stehen', pr: false, k: {boot: {y: 390}}, dur: 2.5}),
    P(M, 'Rechtzeitig auskuppeln. Das Boot läuft noch ein ganzes Stück weiter.', {cap: 'Auskuppeln, auslaufen lassen', pr: false, an: ['strecke'], k: {boot: {y: 240}}, dur: 3.5}),
    P(H, 'Dann kurz rückwärts. Der Radeffekt zieht das Heck nach Backbord, darum mit dem Ruder gegenhalten, damit der Bug in der alten Richtung bleibt.', {cap: 'Rückwärts aufstoppen, Kurs halten', pr: false, aus: ['strecke'], k: {boot: {y: 160, r: 5}}, dur: 3, fx: s => { zeigPrall(true)(s); qa(s, '.schaum').forEach(e => e.setAttribute('opacity', 1)); }}),
    P(M, 'Steht. Neben der Boje, und der Bug zeigt noch in die alte Richtung. So ist es kursgerecht.', {cap: 'Steht, kursgerecht', pr: false, k: {boot: {r: 0}}, fx: s => { zeigPrall(false)(s); qa(s, '.schaum').forEach(e => e.setAttribute('opacity', 0)); }})]});

/* ---------- A6.1 Schallsignale (SBF See): alle Signale des Katalogs, Nebel siehe A6.2 ---------- */
(() => {
  /* Tonfolge als Balken: ● kurz (etwa 1 s), ▬ lang (4 bis 6 s), Doppel-Leerzeichen = Pause zwischen Gruppen; das Horn klingt nach dem Vorlesen (nach) */
  const toene = sig => { const out = []; let gap = false; for (let i = 0; i < sig.length; i++) { const c = sig[i]; if (c === '●' || c === '▬') { out.push({l: c === '▬', g: gap}); gap = false; } else if (c === ' ' && sig[i + 1] === ' ') gap = true; } return out; };
  const worte = sig => sig.split(/ {2,}/).map(g => toene(g).map(t => t.l ? 'lang' : 'kurz').join(' – ')).join('   |   ');
  const leiste = (s, sig) => { const g = q(s, '.leiste'); if (!g) return; const ts = toene(sig || ''); let x = 0; const bs = ts.map((t, i) => { if (i) x += t.g ? 30 : 10; const w = t.l ? 64 : 16, b = {x, w}; x += w; return b; });
    const k = x > 360 ? 360 / x : 1, x0 = 200 - x * k / 2;
    g.innerHTML = bs.map(b => `<rect class="tb" x="${(x0 + b.x * k).toFixed(1)}" y="0" width="${(b.w * k).toFixed(1)}" height="30" rx="${(Math.min(15, b.w * k / 2)).toFixed(1)}" fill="#2b4a66"/>`).join('');
    const w = q(s, '.worte'); if (w) { w.textContent = sig ? worte(sig) : ''; w.removeAttribute('textLength'); try { if (w.getComputedTextLength() > 350) { w.setAttribute('textLength', 350); w.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (e) {} } };
  const hupe = sig => svg => { if (typeof AUD === 'undefined' || !AUD.horn) return; AUD.unlock && AUD.unlock(); const bars = qa(svg, '.tb'), hw = q(svg, '.hw');
    const c = AUD.horn(sig, (i, type, d) => { const e = bars[i]; if (e) { e.setAttribute('fill', '#f08a1c'); setTimeout(() => e.setAttribute('fill', '#2b4a66'), d * 1000); } if (hw) { hw.setAttribute('opacity', 1); setTimeout(() => hw.setAttribute('opacity', 0), d * 1000); } });
    svg.__ton = c; return c.done; };
  const karte = zeilen => zeilen.map((z, i) => T(0, i * 30, z, 'middle', 22)).join('');
  const SIG = [
    ['●  ▬', 'Ein kurzer Ton dauert etwa eine Sekunde. Ein langer Ton vier bis sechs Sekunden. Hör hin: erst kurz, dann lang.', ['kurz: etwa 1 Sekunde', 'lang: etwa 4 bis 6 Sekunden'], 'Fragen 4 und 5', H, 'kurz und lang'],
    ['▬', 'Ein langer Ton: Damit kündigst du dich an, wenn du in ein Fahrwasser oder einen Hafen einläufst und die Verkehrslage es erfordert.', ['Einlaufen in Fahrwasser', 'und Häfen,', 'wenn der Verkehr es erfordert'], 'Frage 161', M, 'Ein langer Ton'],
    ['● ● ● ● ●', 'Mindestens fünf kurze Töne: Der Kurshalter weckt den Ausweichpflichtigen auf. Pass auf, du musst ausweichen! Reicht das nicht, kommt das Manöver des letzten Augenblicks.', ['Ausweichpflichtiger wird auf', 'seine Ausweichpflicht', 'aufmerksam gemacht'], 'Fragen 139 und 140', H, 'Mindestens fünf kurze'],
    ['● ▬ ●', 'Kurz, lang, kurz: Ein Ankerlieger warnt ein Fahrzeug, das ihm gefährlich nahe kommt. Bei verminderter Sicht darf jeder Ankerlieger das zusätzlich geben.', ['Ankerlieger warnt vor', 'gefährlicher Annäherung'], 'Fragen 124 und 141', M, 'kurz – lang – kurz'],
    ['▬ ● ● ● ●  ▬ ● ● ● ●', 'Zweimal ein langer und vier kurze Töne: das allgemeine Gefahr- und Warnsignal. Das gibt, wer ein anderes Fahrzeug gefährdet oder selbst gefährdet wird.', ['Allgemeines Gefahr- und', 'Warnsignal: gefährdet', 'oder selbst gefährdet'], 'Fragen 162 bis 164', H, 'Gefahr- und Warnsignal'],
    ['● ● ● ●', 'Vier kurze Töne von der Brücke, dem Sperrwerk oder der Schleuse: Kann gerade nicht geöffnet werden. Fahrt unterbrechen und auf die Freigabe warten.', ['Brücke, Sperrwerk, Schleuse', 'kann nicht geöffnet werden:', 'Fahrt unterbrechen, warten'], 'Frage 178', M, 'Vier kurze'],
    ['● ▬ ● ●', 'Kurz, lang, kurz, kurz: Die Polizei fordert dich zum Anhalten auf. Dann hältst du an.', ['Polizeifahrzeug fordert', 'zum Anhalten auf'], 'Frage 186', H, 'kurz – lang – kurz – kurz'],
    ['▬ ▬ ▬  ▬ ▬ ▬', 'Zweimal drei lange Töne: Die Seeschifffahrtsstraße ist gesperrt. Weiterfahrt verboten.', ['Sperrung der Seeschiff-', 'fahrtsstraße:', 'Weiterfahrt verboten'], 'Frage 188', M, 'Zweimal drei lange'],
    ['● ▬ ● ▬ ● ▬ ● ▬ ● ▬', 'Kurz, lang, immer wieder, mindestens fünfmal: das Bleib-weg-Signal. Gefahrenbereich sofort verlassen!', ['Bleib-weg-Signal:', 'Gefahrenbereich', 'sofort verlassen'], 'Frage 16', H, 'Bleib-weg-Signal'],
    ['● ● ●  ▬ ▬ ▬  ● ● ●', 'Drei kurz, drei lang, drei kurz, als Licht oder Ton: SOS, das Seenotsignal. Und ein Nebelhorn, das ununterbrochen tönt, heißt ebenfalls: Fahrzeug in Seenot.', ['SOS: Seenotsignal', 'Dauerton des Nebelhorns:', 'Fahrzeug in Seenot'], 'Fragen 279, 281, 282', M, 'Seenot: SOS und Dauerton'],
    ['●  ● ●  ● ● ●', 'Und noch was für die Praxis: Ein kurzer Ton heißt, ich ändere meinen Kurs nach Steuerbord. Zwei kurze nach Backbord. Drei kurze: Meine Maschine geht rückwärts.', ['1 kurz: Kurs nach Steuerbord', '2 kurz: Kurs nach Backbord', '3 kurz: Maschine rückwärts'], 'Kollisionsverhütungsregeln', H, 'Kursänderung (Praxis)', false]];
  S('schall', {...HF, titel: 'Schallsignale', nr: 'A6.1', gruppe: 'A6 Schallsignale und Nebel', folge: 'S4.1 bis S4.3',
    bg: `<rect width="400" height="500" fill="#e4eef5"/><rect x="14" y="196" width="372" height="96" rx="16" fill="#fff" stroke="#b9c8d6" stroke-width="2"/><rect x="14" y="306" width="372" height="150" rx="16" fill="#fff8ea" stroke="#d9c39a" stroke-width="2"/>`,
    obj: {horn: `<path d="M-30 -14 L6 -14 L36 -34 V34 L6 14 L-30 14Z" fill="#8a6d4a" stroke="#5a4020" stroke-width="3"/><rect x="-44" y="-8" width="16" height="16" rx="4" fill="#5a4020"/>
        <g class="hw" opacity="0"><path d="M48 -22 Q60 0 48 22" fill="none" stroke="#f08a1c" stroke-width="5"/><path d="M60 -34 Q80 0 60 34" fill="none" stroke="#f08a1c" stroke-width="5"/><path d="M72 -46 Q100 0 72 46" fill="none" stroke="#f08a1c" stroke-width="4" opacity=".7"/></g>`,
      leiste: '<g class="leiste"></g>', worte: '<text class="t worte" x="200" y="58" text-anchor="middle" font-size="17"></text>',
      ...Object.fromEntries(SIG.map((x, i) => ['b' + i, karte(x[2])]))},
    start: {horn: {x: 170, y: 122, s: 1.5}, leiste: {x: 0, y: 212}, worte: {x: 0, y: 212}, ...Object.fromEntries(SIG.map((x, i) => ['b' + i, {x: 200, y: 381 - (x[2].length - 1) * 15, o: 0}]))},
    enter(s, p) { leiste(s, (SIG[p] || [])[0]); },
    phasen: SIG.map(([sig, t, , quelle, wer, cap, pr], i) => P(wer, t, {cap, sub: quelle, ...(pr === false ? {pr: false} : {}), an: ['b' + i], aus: SIG.map((x, j) => 'b' + j).filter(n => n !== 'b' + i), dur: .6, nach: hupe(sig)}))});
})();

/* ---------- Eigene Zeichnung mit tick im Hochformat (Rahmen wie ANIM.szene: Überschrift, Unterzeile, Marke) ---------- */
const roh = (id, o) => { const alt = A.defs[id], gr = 1.35;
  const marke = `<g class="marke" transform="translate(${W - 8} 8)"><rect x="-112" y="0" width="112" height="28" rx="14" fill="#1f5f99"/><text class="t w" x="-56" y="19" text-anchor="middle" font-size="14"></text></g>`;
  A.defs[id] = {id, titel: o.titel, nr: o.nr, gruppe: o.gruppe, art: o.art || 'pruefung', folge: o.folge || '', wo: o.wo || '', neu: HF.neu, vb: HF.vb, phasen: o.phasen,
    svg: o.svg + T((W - 120) / 2, 26 * gr, '', 'middle', 15 * gr, 'cap') + T(W / 2, HH - 9, '', 'middle', 12 * gr, 'sub') + marke, init: o.init, tick: o.tick,
    enter(s, p, st) { const ph = o.phasen[p] || {}, ce = q(s, '.cap'); ce.textContent = ph.cap || ''; ce.removeAttribute('textLength'); try { if (ce.getComputedTextLength() > W - 130) { ce.setAttribute('textLength', W - 130); ce.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (e) {}
      q(s, '.sub').textContent = ph.sub || ''; const pr = ph.pr ?? (o.art || 'pruefung') === 'pruefung', mk = q(s, '.marke'); mk.querySelector('rect').setAttribute('fill', pr ? '#1f5f99' : '#6a8f3a'); mk.querySelector('text').textContent = pr ? '📋 Prüfung' : '💡 Wissen';
      if (o.enter) o.enter(s, p, st); } };
  if (!alt) A.order.push(id); };
const put = (e, a) => { if (e) for (const k in a) e.setAttribute(k, a[k]); };
const ez = u => { u = Math.max(0, Math.min(1, u)); return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; };
const lp = (a, b, u) => a + (b - a) * Math.max(0, Math.min(1, u));
const komma = (v, n = 1) => v.toFixed(n).replace('.', ',');

/* ---------- A8.6 Ebbe und Flut (SBF See 249–255; Wassertiefe = Kartentiefe + Höhe als Wissen) ---------- */
(() => { const KN = 330, SC = 38, NW = .4, HW = 3.6, MID = (HW + NW) / 2, AMP = (HW - NW) / 2, TK = .5, X0 = 70;
  const yh = h => KN - h * SC, hoehe = ph => MID - AMP * Math.cos(2 * Math.PI * ph);
  const steine = [[108, 346, 9], [124, 341, 11], [142, 343, 10], [160, 340, 12], [178, 344, 9], [194, 348, 8], [133, 350, 7], [170, 351, 8]];
  const boden = `M${X0} ${yh(-2.3)} L96 ${yh(-2.3)} Q104 ${yh(-.6)} 118 ${yh(-.5)} L196 ${yh(-.5)} Q210 ${yh(-.6)} 220 ${yh(-2.3)} L400 ${yh(-2.3)} V500 H${X0}Z`;
  roh('gezeiten', {titel: 'Ebbe und Flut', nr: 'A8.6', gruppe: 'A8 Navigation', folge: 'S7.4',
    svg: `<rect width="400" height="500" fill="#cfe9f7"/><rect id="gzw" x="${X0}" y="200" width="${400 - X0}" height="300" fill="#3d8fb8"/><path id="gzs" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
      <path d="${boden}" fill="#d8b87a" stroke="#a8824f" stroke-width="2"/>${steine.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .75}" fill="#8f949c" stroke="#5e636b" stroke-width="1.6"/>`).join('')}
      <path d="M62 ${KN}H400" stroke="#2b3a4a" stroke-width="2" stroke-dasharray="7 5"/>${T(244, KN + 20, 'Kartennull', 'middle', 15)}
      <rect x="8" y="${yh(4.2)}" width="54" height="${(6.6) * SC}" rx="6" fill="#fff" stroke="#5e636b" stroke-width="2"/>${[-2, -1, 0, 1, 2, 3, 4].map(m => `<path d="M8 ${yh(m)}H${m % 2 ? 22 : 30}" stroke="#2b3a4a" stroke-width="2"/>${T(56, yh(m) + 5, m + ' m', 'end', 13)}`).join('')}
      <g id="gzb">${BO.seite({})}</g>
      <g id="gzhub" opacity="0"><path id="gzhp" stroke="#f08a1c" stroke-width="4" fill="none"/>${T(0, 0, '', 'start', 17, 'gzht')}</g>
      <g id="gzm" opacity="0"><path id="gzrot" stroke="#c0392b" stroke-width="4"/><path id="gzbl" stroke="#1f5f99" stroke-width="4"/><path id="gzgr" stroke="#1f9a3c" stroke-width="5" fill="none"/></g>
      <g transform="translate(14 48)"><rect width="372" height="92" rx="12" fill="#fff" stroke="#b9c8d6" stroke-width="2"/><path id="gzc" fill="none" stroke="#3d8fb8" stroke-width="3"/><circle id="gzd" r="7" fill="#f08a1c" stroke="#fff" stroke-width="2"/>
        ${T(20, 84, 'NW', 'middle', 14)}${T(186, 22, 'HW', 'middle', 14)}${T(352, 84, 'NW', 'middle', 14)}${T(186, 84, 'eine Tide: etwa 12 h 25 min', 'middle', 13)}</g>
      ${T(200, 448, '', 'middle', 17, 'gz1')}${T(200, 476, '', 'middle', 21, 'gz2')}`,
    phasen: [
      {wer: H, t: 'Zweimal am Tag steigt das Wasser und fällt wieder. Von einem Niedrigwasser bis zum nächsten Niedrigwasser: Das ist eine Tide.', min: 10, cap: 'Tide: Niedrigwasser bis Niedrigwasser'},
      {wer: M, t: 'Flut: Das Wasser steigt vom Niedrigwasser zum folgenden Hochwasser.', min: 7, cap: 'Flut: das Wasser steigt'},
      {wer: H, t: 'Hochwasser: der höchste Wasserstand, da geht das Steigen ins Fallen über.', min: 5, cap: 'Hochwasser'},
      {wer: M, t: 'Ebbe: Das Wasser fällt vom Hochwasser zum folgenden Niedrigwasser.', min: 7, cap: 'Ebbe: das Wasser fällt'},
      {wer: H, t: 'Niedrigwasser: der niedrigste Stand, da geht das Fallen ins Steigen über. Der Unterschied zwischen Hochwasser und Niedrigwasser heißt Tidenhub.', min: 8, cap: 'Niedrigwasser und Tidenhub'},
      {wer: M, t: 'Und wie tief ist es über den Steinen? In der Karte steht die Kartentiefe, gemessen ab Kartennull: null Komma fünf Meter. Dazu kommt der Wasserstand, jetzt null Komma vier. Macht null Komma neun Meter.', min: 11, cap: 'Wassertiefe = Kartentiefe + Wasserstand', pr: false},
      {wer: H, t: 'Bei Hochwasser sind es da gut vier Meter. Bei Niedrigwasser nicht mal einer. Mit einem Meter Tiefgang sitzt du dann auf den Steinen.', min: 9, cap: 'Bei Niedrigwasser zu flach!', pr: false},
      {wer: M, t: 'Wann Hochwasser und Niedrigwasser sind und wie groß der Tidenhub ist, steht in den Gezeitentafeln oder im Gezeitenkalender vom BSH.', min: 8, cap: 'Gezeitentafeln des BSH'}],
    tick(s, tp, p) {
      let ph; if (p === 0) ph = Math.min(tp / 9, 1); else if (p === 1) ph = ez(tp / 5) * .5; else if (p === 2) ph = .5; else if (p === 3) ph = .5 + ez(tp / 5) * .5; else if (p === 6) ph = tp < 3.5 ? 1 + ez(tp / 3.5) * .5 : tp < 5 ? 1.5 : 1.5 + ez((tp - 5) / 3.5) * .5; else ph = 1;
      const h = hoehe(ph), ys = yh(h);
      put(q(s, '#gzw'), {y: ys.toFixed(1), height: (500 - ys).toFixed(1)}); put(q(s, '#gzs'), {d: `M${X0} ${ys} ` + Array.from({length: 11}, (_, i) => `q 8 ${i % 2 ? 3 : -3} 16 0`).join(' ') + ` M240 ${ys} ` + Array.from({length: 9}, (_, i) => `q 9 ${i % 2 ? 3 : -3} 18 0`).join(' ')});
      put(q(s, '#gzb'), {transform: `translate(318 ${(ys + Math.sin(tp * 2) * 1.2).toFixed(1)}) scale(.62)`});
      put(q(s, '#gzc'), {d: 'M' + Array.from({length: 49}, (_, i) => { const a = i / 48; return `${(20 + a * 332).toFixed(1)} ${(50 + Math.cos(2 * Math.PI * a) * 26).toFixed(1)}`; }).join('L')});
      const f = ph % 1 === 0 && ph > 0 ? 1 : ph % 1; put(q(s, '#gzd'), {cx: (20 + f * 332).toFixed(1), cy: (50 + Math.cos(2 * Math.PI * f) * 26).toFixed(1)});
      const hub = p === 4; put(q(s, '#gzhub'), {opacity: hub ? 1 : 0}); if (hub) { put(q(s, '#gzhp'), {d: `M70 ${yh(HW)}H84M77 ${yh(HW)}V${yh(NW)}M70 ${yh(NW)}H84`}); const t = q(s, '.gzht'); put(t, {x: 90, y: (yh(MID) + 6).toFixed(1)}); t.textContent = 'Tidenhub ' + komma(HW - NW) + ' m'; }
      const mess = p === 5 || p === 6; put(q(s, '#gzm'), {opacity: mess ? 1 : 0});
      if (mess) { put(q(s, '#gzrot'), {d: `M140 ${KN}V${yh(-TK)}`}); put(q(s, '#gzbl'), {d: `M150 ${KN}V${ys}`}); put(q(s, '#gzgr'), {d: `M164 ${yh(-TK)}H174V${ys}H164`}); }
      const t1 = q(s, '.gz1'), t2 = q(s, '.gz2');
      if (mess) { t1.textContent = `Wasserstand ${komma(h)} m + Kartentiefe ${komma(TK)} m`; t2.textContent = `= Wassertiefe ${komma(h + TK)} m`; put(t2, {fill: h + TK < 1 ? '#c0392b' : '#1f7a3a'}); }
      else { t1.textContent = `Wasserstand: ${komma(h)} m über Kartennull`; t2.textContent = p === 4 ? `Tidenhub: ${komma(HW)} − ${komma(NW)} = ${komma(HW - NW)} m` : p === 7 ? 'Gezeitentafeln, Gezeitenkalender' : ''; put(t2, {fill: '#2b3a4a'}); }
    }});
})();

/* ---------- A7.8 Schleuse: Talfahrt (Binnen 117, 119; SBF 21, 28, 30) ---------- */
(() => { const YU = 190, YL = 330, BOD = 420, GO = 113, GU = 295, POLLER = [252, 160];
  const ampel = (x, y, id) => `<g transform="translate(${x} ${y})"><path d="M0 18V60" stroke="#444" stroke-width="5"/><rect x="-11" y="-26" width="22" height="46" rx="8" fill="#2a2a2a"/><circle id="${id}r" cx="0" cy="-13" r="7" fill="#555"/><circle id="${id}g" cx="0" cy="7" r="7" fill="#555"/></g>`;
  roh('schleuse', {titel: 'Schleuse: Talfahrt', nr: 'A7.8', gruppe: 'A10 Binnen', folge: 'G6.3, Binnen',
    svg: `<rect width="400" height="500" fill="#cfe9f7"/><rect x="${GO}" y="150" width="${GU - GO}" height="${BOD - 150}" fill="#c4c9cf"/>${[180, 230, 280, 330, 380].map(y => `<path d="M${GO} ${y}H${GU}" stroke="#aeb4bb" stroke-width="2"/>`).join('')}
      <rect id="swu" x="0" y="${YU}" width="${GO + 1}" height="${300 - YU}" fill="#3d8fb8"/><rect id="swk" x="${GO}" y="${YU}" width="${GU - GO + 1}" height="${BOD - YU}" fill="#3d8fb8"/><rect id="swl" x="${GU}" y="${YL}" width="${400 - GU}" height="${BOD - YL}" fill="#3d8fb8"/>
      <path d="M0 300H${GO}V${BOD}H0Z" fill="#a8824f"/><path d="M${GO} 322H152Q158 322 158 330V${BOD}H${GO}Z" fill="#8f949c" stroke="#5e636b" stroke-width="2"/><rect x="0" y="${BOD}" width="400" height="${500 - BOD}" fill="#a8824f"/>
      <rect x="${GO - 8}" y="140" width="16" height="12" fill="#7a7f87"/><rect x="${GU - 8}" y="140" width="16" height="12" fill="#7a7f87"/><rect x="${GO}" y="146" width="${GU - GO}" height="6" fill="#9aa0a7"/>
      <g fill="#3a3f45"><rect x="${POLLER[0] - 6}" y="${POLLER[1] - 12}" width="12" height="12" rx="3"/></g>
      <path id="sleine" stroke="#e8d27a" stroke-width="3" fill="none"/>
      <rect id="sgo" x="${GO - 4}" y="152" width="8" height="${300 - 152}" fill="#5a5f66" stroke="#33373c" stroke-width="1.5"/><rect id="sgu" x="${GU - 4}" y="152" width="8" height="${BOD - 152}" fill="#5a5f66" stroke="#33373c" stroke-width="1.5"/>
      <rect x="${GO - 4}" y="152" width="8" height="${300 - 152}" fill="none" stroke="#5a5f66" stroke-width="1.5" stroke-dasharray="5 4"/><rect x="${GU - 4}" y="152" width="8" height="${BOD - 152}" fill="none" stroke="#5a5f66" stroke-width="1.5" stroke-dasharray="5 4"/><g id="sbt">${BO.seite({})}</g>
      ${ampel(GO - 26, 102, 'sao')}${ampel(GU + 26, 102, 'sau')}
      ${T(50, 290, 'Oberwasser', 'middle', 15)}${T(204, 410, 'Kammer', 'middle', 15)}${T(350, 410, 'Unterwasser', 'middle', 15)}
      <g id="sdr" opacity="0">${B.pfeil(136, 452, 136, 428, '#c0392b', 4)}${T(136, 472, 'Drempel', 'middle', 16, 'r')}</g>`,
    phasen: [
      {wer: H, t: 'Wir fahren zu Tal und warten vor der Schleuse. Ein rotes Licht: Einfahrt verboten.', min: 6, cap: 'Rot: Einfahrt verboten, warten'},
      {wer: M, t: 'Rot und Grün zusammen: Einfahren dürfen wir noch nicht, aber das Öffnen wird vorbereitet.', min: 6, cap: 'Rot und Grün: Öffnen wird vorbereitet'},
      {wer: H, t: 'Grün: Wir fahren ein. Weit genug nach vorn, damit wir beim Leeren nicht auf dem Drempel aufsetzen.', min: 7, cap: 'Grün: einfahren, weg vom Drempel'},
      {wer: M, t: 'Festmachen, aber so, dass wir die Leine nachlassen können. Nie festknoten, wir sinken ja gleich.', min: 6, cap: 'Leine so, dass man nachlassen kann'},
      {wer: H, t: 'Das obere Tor schließt, und das Wasser läuft ab. Wir sinken mit und lassen die Leine nach.', min: 9, cap: 'Wasser läuft ab: Leine nachlassen'},
      {wer: M, t: 'Wasser gleich hoch: Das untere Tor öffnet, Grün, und wir fahren aus.', min: 7, cap: 'Tor auf, Grün: ausfahren'}],
    tick(s, tp, p) {
      let x = 50, yC = YU, go = 1, gu = 1, ao = 'r', au = 'r', leine = false;
      if (p === 1) ao = 'rg';
      else if (p === 2) { ao = 'g'; go = 1 - ez(tp / 1.4); x = lp(50, 236, ez((tp - 1.2) / 4)); }
      else if (p === 3) { go = 0; x = 236; leine = true; }
      else if (p === 4) { go = ez(tp / 1.4); x = 236; leine = true; yC = lp(YU, YL, ez((tp - 1.6) / 6)); }
      else if (p === 5) { x = lp(236, 360, ez((tp - 1.4) / 3.5)); yC = YL; gu = 1 - ez(tp / 1.2); au = tp > 1 ? 'g' : 'r'; leine = false; }
      put(q(s, '#swk'), {y: yC.toFixed(1), height: (BOD - yC).toFixed(1)});
      put(q(s, '#sgo'), {opacity: go.toFixed(2)}); put(q(s, '#sgu'), {opacity: gu.toFixed(2)});
      const surf = x < GO ? YU : x < GU ? yC : YL; put(q(s, '#sbt'), {transform: `translate(${x.toFixed(1)} ${(surf + Math.sin(tp * 2) * .8).toFixed(1)}) scale(.55)`});
      const bx = x + 30, by = surf - 12; put(q(s, '#sleine'), {d: leine ? `M${bx.toFixed(1)} ${by.toFixed(1)} Q${((bx + POLLER[0]) / 2).toFixed(1)} ${(Math.max(by, POLLER[1]) + 10).toFixed(1)} ${POLLER[0]} ${POLLER[1] - 6}` : 'M0 0'});
      const lampe = (id, z) => { put(q(s, '#' + id + 'r'), {fill: z.includes('r') ? '#ff4a3d' : '#555'}); put(q(s, '#' + id + 'g'), {fill: z.includes('g') ? '#2ee06a' : '#555'}); }; lampe('sao', ao); lampe('sau', au);
      put(q(s, '#sdr'), {opacity: p === 2 || p === 4 ? 1 : 0});
    }});
})();

/* ---------- A4.2 Begegnung: die Peilung bleibt stehen ---------- */
(() => { const C = [200, 190];
  const peil = (a, b) => { const d = Math.atan2(b.x - a.x, -(b.y - a.y)) * 180 / Math.PI - a.r; return Math.round(((d % 360) + 360) % 360); };
  S('begegnung', {...HF, titel: 'Begegnung: die Peilung bleibt stehen', nr: 'A4.2', gruppe: 'A4 Ausweichen und Verkehr', folge: 'G5.2, S2.1, S2.2',
    bg: wasser(), obj: {linie: '<line class="pl" stroke="#f08a1c" stroke-width="3" stroke-dasharray="8 5"/>', er: BO.oben({lichter: true, farbe: {rumpf: '#efe3c4'}}), wir: BO.oben({lichter: true}),
      anz: `<rect x="-120" y="-22" width="240" height="44" rx="12" fill="#fff8ea" stroke="#7a6a56" stroke-width="2"/><text class="t pz" x="0" y="8" text-anchor="middle" font-size="20"></text>`, kp: B.kreuz(0, 0)},
    start: {er: {x: 304, y: C[1], r: -90, s: 1.1}, wir: {x: 200, y: 395, s: 1.1}, anz: {x: 200, y: 478}, kp: {x: C[0], y: C[1], o: 0}},
    fx(s, tp, p, st, c) { const l = s.querySelector('.pl'); if (l) { l.setAttribute('x1', c.wir.x); l.setAttribute('y1', c.wir.y); l.setAttribute('x2', c.er.x); l.setAttribute('y2', c.er.y); }
      const z = s.querySelector('.pz'); if (z) z.textContent = `Peilung zu ihm: ${peil(c.wir, c.er)}° vom Bug`; },
    phasen: [
      P(H, 'Von rechts kommt ein Motorboot. Wir peilen es über unseren Bug: Es steht siebenundzwanzig Grad rechts voraus.', {cap: 'Wir peilen ihn an'}),
      P(M, 'Wir fahren weiter und peilen nochmal. Wieder siebenundzwanzig Grad. Die Peilung steht. Dann treffen wir uns genau hier: Kollisionskurs.', {cap: 'Peilung steht: Kollisionskurs!', an: ['kp'], k: {wir: {y: 292}, er: {x: 252}}, dur: 4}),
      P(H, 'Er kommt von rechts, also müssen wir ausweichen. Früh und deutlich nach Steuerbord, damit er es sieht.', {cap: 'Deutlich nach Steuerbord ausweichen', aus: ['kp'], k: {wir: {weg: [[212, 282], [290, 292]]}, er: {x: 200}}, dur: 3}),
      P(M, 'Jetzt wandert die Peilung, die Zahl ändert sich. Wir gehen hinter seinem Heck vorbei, die Gefahr ist vorbei.', {cap: 'Peilung wandert: Gefahr vorbei', k: {wir: {weg: [[340, 260], [345, 120]]}, er: {x: 100}}, dur: 4})]});
})();
})();
