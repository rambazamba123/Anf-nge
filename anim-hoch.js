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
const fit = (e, max = 370) => { if (!e) return; e.removeAttribute('textLength'); try { if (e.getComputedTextLength() > max) { e.setAttribute('textLength', max); e.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (x) {} };

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

/* ---------- A1.7 Gas sinkt in die Bilge (SBF 62–64; Hörreise 1-2 nutzt die Phasen 0–2, Reihenfolge bleiben) ---------- */
(() => { const BI = 358, BO_ = 318;   /* Bilge von BI (unten) bis BO_ (Bodenbretter) */
  const innen = 'M118 158 H292 V230 H356 L344 296 Q336 350 296 358 H96 Q62 354 54 324 L48 230 H118Z';
  const rumpf = 'M30 220 H372 Q382 222 377 238 L360 300 Q348 362 298 374 H92 Q48 370 38 330 Z';
  roh('gas', {titel: 'Gas sinkt in die Bilge', nr: 'A1.7', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G4.1',
    svg: `<defs><clipPath id="ghin"><path d="${innen}"/></clipPath><clipPath id="ghr"><path d="${rumpf}"/></clipPath>
        <radialGradient id="gfeuer"><stop offset="0" stop-color="#fff6b0"/><stop offset=".35" stop-color="#ffd23a"/><stop offset=".7" stop-color="#ff7a1a"/><stop offset="1" stop-color="#c0300f" stop-opacity="0"/></radialGradient>
        <linearGradient id="ggas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9e27a" stop-opacity=".35"/><stop offset="1" stop-color="#9cc23a" stop-opacity=".8"/></linearGradient>
        <filter id="gweich"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <rect width="400" height="500" fill="#dfeaf3"/><rect y="300" width="400" height="200" fill="#5ba7cf"/>${Array.from({length: 10}, (_, i) => `<path d="M${(i * 83) % 360 + 10} ${330 + (i * 47) % 150} q8 -5 16 0 t16 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`).join('')}
      <g id="gwelt">
        <path d="${rumpf}" fill="#fbf8f2" stroke="#5f5446" stroke-width="3"/><rect y="300" width="400" height="90" fill="#1f3b63" clip-path="url(#ghr)"/><path d="M34 242 H376" stroke="#c0392b" stroke-width="5"/>
        <path d="M110 150 L118 158 H292 L302 150 Z" fill="#cfd6db" stroke="#5f5446" stroke-width="2.5"/><path d="M110 150 V222 M302 150 V222" stroke="#5f5446" stroke-width="5"/>
        <path d="${innen}" fill="#f3ead8" stroke="#8a7a66" stroke-width="2"/>
        <g clip-path="url(#ghin)"><path id="gfill" fill="url(#ggas)"/><g id="gps" filter="url(#gweich)"></g></g>
        ${Array.from({length: 7}, (_, i) => `<rect x="${66 + i * 40}" y="${BO_}" width="37" height="7" rx="2" fill="#b9874f" stroke="#7a5a3a" stroke-width="1.2"/>`).join('')}
        ${T(200, 346, 'Bilge', 'middle', 18)}
        <g id="gkiste"><rect x="66" y="270" width="88" height="48" rx="4" fill="#d8c3a0" stroke="#7a5a3a" stroke-width="2" fill-opacity=".45"/><rect x="62" y="264" width="96" height="8" rx="3" fill="#b9874f" stroke="#7a5a3a" stroke-width="1.5"/>
          <g id="gfl1"><rect x="92" y="280" width="28" height="36" rx="10" fill="#d6332c" stroke="#7a1f1a" stroke-width="2"/><rect x="101" y="273" width="10" height="8" fill="#555"/></g>${T(110, 258, 'Backskiste', 'middle', 15)}</g>
        <g><rect x="236" y="268" width="62" height="50" rx="4" fill="#e6e1d6" stroke="#6b6b6b" stroke-width="2"/><rect x="232" y="262" width="70" height="8" rx="2" fill="#7a7f87"/><circle cx="252" cy="262" r="6" fill="none" stroke="#333" stroke-width="2.5"/><circle cx="280" cy="262" r="6" fill="none" stroke="#333" stroke-width="2.5"/>${T(267, 300, 'Kocher', 'middle', 13)}
          <path id="gltg" d="M120 312 H236" stroke="#6b6b6b" stroke-width="3"/></g>
        <g id="gsch"><rect x="270" y="186" width="16" height="22" rx="3" fill="#fff" stroke="#7a6a4a" stroke-width="2"/><rect id="gkn" x="275" y="190" width="6" height="8" rx="2" fill="#7a6a4a"/><path id="gfunk" d="M290 186 l9 -12 l-3 9 l9 -3 l-12 15 l3 -9z" fill="#ffd400" stroke="#c08a00" stroke-width="1.5" opacity="0"/></g>
        <g id="glampe"><path d="M196 158 V168" stroke="#555" stroke-width="2"/><path d="M186 168 H206 L202 176 H190Z" fill="#e8d27a" stroke="#7a6a4a"/></g>
        <g id="gkast" opacity="0"><rect x="44" y="176" width="46" height="44" rx="4" fill="#9aa4ae" stroke="#4a525c" stroke-width="2"/><rect x="56" y="182" width="22" height="34" rx="9" fill="#d6332c" stroke="#7a1f1a" stroke-width="2"/><rect x="40" y="212" width="9" height="7" fill="#1d2630"/>${T(68, 168, 'Gaskasten', 'middle', 15)}</g>
        <g id="gzu" opacity="0"><circle cx="106" cy="275" r="11" fill="#fff" stroke="#1f9a3c" stroke-width="3"/><path d="M99 275 H113" stroke="#1f9a3c" stroke-width="4" stroke-linecap="round"/></g>
        <g id="gluft" opacity="0" fill="#fff" stroke="#3d8fb8" stroke-width="3"><path d="M150 140 v-26" fill="none"/><path d="M143 120 l7 -10 l7 10z"/><path d="M250 140 v-26" fill="none"/><path d="M243 120 l7 -10 l7 10z"/></g>
        <g id="gverbot" opacity="0"><circle cx="278" cy="197" r="20" fill="none" stroke="#c0392b" stroke-width="4"/><path d="M264 211 L292 183" stroke="#c0392b" stroke-width="4"/>
          <g transform="translate(330 196)"><rect x="-9" y="-16" width="18" height="32" rx="4" fill="#2b3a4a"/><rect x="-6" y="-12" width="12" height="20" fill="#8fc6e8"/><circle r="20" fill="none" stroke="#c0392b" stroke-width="4"/><path d="M-14 14 L14 -14" stroke="#c0392b" stroke-width="4"/></g></g>
      </g>
      <g id="gboom" opacity="0"><circle id="gball" cx="200" cy="300" r="10" fill="url(#gfeuer)"/><path id="gstern" fill="#ffd23a" stroke="#ff7a1a" stroke-width="4" stroke-linejoin="round"/><g id="gsplit"></g></g>
      <rect id="gflash" width="400" height="500" fill="#fff3c4" opacity="0"/><g id="grauch"></g><g id="gqualm" filter="url(#gweich)"></g>
      <text class="t gwum" x="200" y="140" text-anchor="middle" font-size="64" fill="#c0392b" opacity="0">WUMM!</text>
      ${T(200, 470, '', 'middle', 18, 'ghin')}`,
    phasen: [
      {wer: M, t: 'Gas und Benzindampf sind schwerer als Luft. Was ausströmt, sinkt nach unten und sammelt sich in der Bilge.', min: 8, cap: 'Gas ist schwerer als Luft'},
      {wer: H, t: 'Mit Luft gemischt wird es explosiv. Ein Funke vom Lichtschalter reicht.', min: 6, cap: 'Ein Funke reicht'},
      {wer: M, t: 'Darum steht die Gasflasche an Deck, geschützt vor Sonne, oder in einem Gaskasten mit einer Öffnung ganz unten nach außenbords. Dann läuft das Gas ins Freie.', min: 9, cap: 'An Deck oder Gaskasten: Öffnung unten'},
      {wer: H, t: 'Und riecht es unten doch nach Gas: Gaszufuhr zu und lüften. Keinen Schalter anfassen, kein Funkgerät, kein Handy.', min: 8, cap: 'Gas im Boot: zu, lüften, kein Schalter'}],
    enter(s, p, st) { st.ps = []; st.fill = p === 1 ? 1 : p === 3 ? .8 : 0; st.split = null; st.rauch = [];
      put(q(s, '#gkiste'), {opacity: p === 2 ? .25 : 1}); put(q(s, '#gkast'), {opacity: p === 2 ? 1 : 0}); put(q(s, '#gzu'), {opacity: p === 3 ? 1 : 0}); put(q(s, '#gluft'), {opacity: p === 3 ? 1 : 0}); put(q(s, '#gverbot'), {opacity: p === 3 ? 1 : 0});
      q(s, '.ghin').textContent = ['', '', 'Gas läuft nach außenbords ab', ''][p] || ''; },
    tick(s, tp, p, st) {
      const dt = st.dt || .016, ps = st.ps, top = BI - st.fill * 58;
      if (p === 0 && st.fill < 1 && Math.random() < dt * 16) ps.push({x: 106, y: 278, vx: -10 + Math.random() * 30, vy: 4, r: 7 + Math.random() * 6, a: 1});
      if (p === 2 && Math.random() < dt * 12) ps.push({x: 42, y: 216, vx: -14 - Math.random() * 10, vy: 6, r: 6 + Math.random() * 5, a: 1, raus: true});
      for (const k of ps) { k.vy += (k.raus ? 22 : 26) * dt; k.vy = Math.min(k.vy, 60); k.x += k.vx * dt; k.y += k.vy * dt; k.r += dt * 2;
        if (!k.raus) { if (k.x > 330) k.vx = -Math.abs(k.vx); if (k.x < 64) k.vx = Math.abs(k.vx); if (k.y >= top - 4) { k.vx *= .9; k.a -= dt * 2.2; } }
        else if (k.y > 300) { k.vy *= .2; k.vx -= dt * 10; k.a -= dt * 1.2; } }
      st.ps = ps.filter(k => k.a > 0 && k.x > -30);
      if (p === 0) st.fill = Math.min(1, tp / 7); if (p === 3) st.fill = Math.max(0, .8 - tp * .1);
      const pr = st.ps.filter(k => !k.raus), pa = st.ps.filter(k => k.raus);
      q(s, '#gps').innerHTML = pr.map(k => `<circle cx="${k.x.toFixed(1)}" cy="${k.y.toFixed(1)}" r="${k.r.toFixed(1)}" fill="#a9cd4a" fill-opacity="${(.55 * k.a).toFixed(2)}"/>`).join('');
      q(s, '#grauch').innerHTML = pa.map(k => `<circle cx="${k.x.toFixed(1)}" cy="${k.y.toFixed(1)}" r="${k.r.toFixed(1)}" fill="#a9cd4a" fill-opacity="${(.5 * k.a).toFixed(2)}" filter="url(#gweich)"/>`).join('');
      const fy = BI - st.fill * 58; put(q(s, '#gfill'), {d: st.fill <= 0 ? 'M0 0' : `M40 ${fy} ` + Array.from({length: 10}, (_, i) => `Q${50 + i * 32} ${(fy + Math.sin(tp * 2 + i) * 3).toFixed(1)} ${66 + i * 32} ${fy}`).join(' ') + ` V380 H40Z`});
      /* Funke und Explosion (Phase 1) */
      const boom = p === 1 && tp > 1.3, b = boom ? tp - 1.3 : 0;
      put(q(s, '#gkn'), {y: p === 1 && tp > 1 ? 199 : 190}); put(q(s, '#gfunk'), {opacity: p === 1 && tp > 1 && tp < 1.5 ? 1 : 0});
      put(q(s, '#gboom'), {opacity: boom ? Math.max(0, 1 - Math.max(0, b - 1.4) / 1.2).toFixed(2) : 0});
      if (boom) { const r = Math.min(260, 30 + b * 420); put(q(s, '#gball'), {r: r.toFixed(0)});
        const n = 14, sp = Array.from({length: n * 2}, (_, i) => { const a = i * Math.PI / n, rr = (i % 2 ? .55 : 1) * r * .9; return `${(200 + Math.cos(a) * rr).toFixed(0)} ${(300 + Math.sin(a) * rr * .85).toFixed(0)}`; }); put(q(s, '#gstern'), {d: 'M' + sp.join('L') + 'Z', opacity: Math.max(0, 1 - b / 1.6).toFixed(2)});
        if (!st.split) st.split = Array.from({length: 16}, (_, i) => ({a: i * .4 + Math.random() * .3, v: 160 + Math.random() * 160, w: 10 + Math.random() * 18, r: Math.random() * 360}));
        q(s, '#gsplit').innerHTML = st.split.map(k => { const x = 200 + Math.cos(k.a) * k.v * b, y = 310 + Math.sin(k.a) * k.v * b + 160 * b * b; return `<rect x="${(x - k.w / 2).toFixed(0)}" y="${(y - 3).toFixed(0)}" width="${k.w.toFixed(0)}" height="6" rx="2" fill="#8a5a2a" transform="rotate(${(k.r + b * 400).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }).join('');
        const sh = Math.max(0, 1 - b / 1.2) * 9; put(q(s, '#gwelt'), {transform: `translate(${((Math.random() - .5) * sh).toFixed(1)} ${((Math.random() - .5) * sh).toFixed(1)})`});
        put(q(s, '#gflash'), {opacity: Math.max(0, .9 - b * 2.2).toFixed(2)}); put(q(s, '.gwum'), {opacity: b > .1 && b < 2.6 ? 1 : 0, 'font-size': (64 + Math.min(1, b * 3) * 16).toFixed(0)});
        put(q(s, '#gfill'), {opacity: b > .3 ? 0 : 1});
        if (!st.qu) st.qu = Array.from({length: 18}, (_, i) => ({x: 90 + Math.random() * 220, y: 240 + Math.random() * 100, r: 18 + Math.random() * 22, v: 12 + Math.random() * 18}));
        q(s, '#gqualm').innerHTML = b < .5 ? '' : st.qu.map(k => `<circle cx="${k.x.toFixed(0)}" cy="${(k.y - (b - .5) * k.v * 3).toFixed(0)}" r="${(k.r * Math.min(2, .6 + (b - .5) * .5)).toFixed(0)}" fill="#5a5a5a" fill-opacity="${Math.min(.75, (b - .5) * .8).toFixed(2)}"/>`).join(''); }
      else { st.qu = null; q(s, '#gqualm').innerHTML = ''; put(q(s, '#gwelt'), {transform: ''}); put(q(s, '#gflash'), {opacity: 0}); put(q(s, '.gwum'), {opacity: 0}); put(q(s, '#gfill'), {opacity: 1}); q(s, '#gsplit').innerHTML = ''; }
    }});
})();

/* ---------- A1.8 Tanken ohne Knall (SBF 49, 43; Luken und Lüften als Wissen) ---------- */
(() => { const BX = 262, WL = 336, SK = 1.5, STU = [BX - 66 * SK, WL - 26 * SK];
  const LISTE = [['Motor aus', 49], ['Keine Schalter betätigen', 49], ['Kein Feuer, nicht rauchen', 49], ['Nichts überlaufen lassen', 49], ['Luken zu', 0], ['Vor dem Start lüften', 0], ['Bilge: Lappen, entsorgen', 43]];
  roh('tanken', {titel: 'Tanken ohne Knall', nr: 'A1.8', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G4.1',
    svg: `<rect width="400" height="500" fill="#d9ecf7"/><rect y="250" width="400" height="34" fill="#b98750" stroke="#7a5a3a" stroke-width="2"/>${[40, 120, 200, 280, 360].map(x => `<rect x="${x}" y="284" width="12" height="60" fill="#8a6a44"/>`).join('')}
      <rect y="300" width="400" height="200" fill="#5ba7cf"/>${Array.from({length: 9}, (_, i) => `<path d="M${(i * 91) % 360 + 10} ${380 + (i * 37) % 100} q8 -5 16 0 t16 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`).join('')}
      <g transform="translate(18 74)"><rect x="0" y="0" width="96" height="176" rx="10" fill="#d9534f" stroke="#7a2a28" stroke-width="3"/><rect x="0" y="0" width="96" height="30" rx="10" fill="#b8403c"/><text class="t w" x="48" y="21" text-anchor="middle" font-size="15">BENZIN</text>
        <rect x="12" y="40" width="72" height="44" rx="5" fill="#1d2630" stroke="#555" stroke-width="2"/><text class="t tl" x="76" y="58" text-anchor="end" font-size="15" fill="#7dff9a" stroke="none">0,0 l</text><text class="t te" x="76" y="78" text-anchor="end" font-size="13" fill="#ffd36b" stroke="none">0,00 €</text>
        <rect x="64" y="98" width="24" height="44" rx="6" fill="#7a2a28"/><g id="tzh"><path d="M70 104 h14 v14 l-8 10 h-6z" fill="#2b2b2b"/></g><rect x="-4" y="168" width="104" height="10" rx="3" fill="#7a7f87"/></g>
      <path id="tschl" fill="none" stroke="#222" stroke-width="9" stroke-linecap="round"/><path id="tschl2" fill="none" stroke="#555" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9"/>
      <g id="tboot">${BO.seite({})}</g>
      <g id="tpist" opacity="0"><path d="M0 0 l-22 -8 l-6 6 l18 12 z" fill="#2b2b2b"/><path d="M-26 -4 l-14 4 l2 8 l14 -2z" fill="#2b2b2b"/><rect x="-6" y="-6" width="16" height="6" rx="2" fill="#7a7f87" transform="rotate(30)"/></g>
      <g id="tlap" opacity="0"><path d="M${STU[0] - 14} ${STU[1] + 2} q6 8 14 2 q8 6 16 -2 l-2 8 q-14 6 -26 0z" fill="#f2f2f2" stroke="#999" stroke-width="1.5"/></g>
      <g id="tdampf"></g>
      ${LISTE.map(([t, n], i) => `<g class="tli" data-i="${i}" opacity="0" transform="translate(146 ${66 + i * 27})">${B.haken(0, 0)}${T(14, 6, t, 'start', 16)}</g>`).join('')}`,
    phasen: [
      {wer: H, t: 'Bevor getankt wird: Motor aus. Und keine elektrischen Schalter betätigen.', min: 6, cap: 'Vor dem Tanken', z: 2},
      {wer: M, t: 'Kein offenes Feuer und nicht rauchen. Auch keine Pfeife, Käpt\'n.', min: 6, cap: 'Kein Feuer', z: 3},
      {wer: H, t: 'Langsam tanken und vorsorgen, dass nichts überläuft. Ein Lappen um den Stutzen fängt Tropfen auf.', min: 9, cap: 'Langsam, nichts überlaufen lassen', z: 4},
      {wer: M, t: 'Luken zu, damit keine Dämpfe ins Boot ziehen. Benzindampf ist schwerer als Luft. Vor dem Start gut lüften.', min: 9, cap: 'Luken zu, vor dem Start lüften', z: 6, pr: false},
      {wer: H, t: 'Und ist doch Kraftstoff oder Öl in die Bilge gelaufen: mit Lappen aufnehmen und umweltgerecht entsorgen.', min: 8, cap: 'Kraftstoff in der Bilge', z: 7}],
    enter(s, p, st) { st.l = 0; qa(s, '.tli').forEach(e => e.setAttribute('opacity', +e.dataset.i < (o => o)(A.defs.tanken.phasen[p].z) ? 1 : 0)); st.ds = []; },
    tick(s, tp, p, st) {
      put(q(s, '#tboot'), {transform: `translate(${BX} ${(WL + Math.sin(tp * 1.6) * 1.2).toFixed(1)}) scale(${SK})`});
      const an = p === 2 || p === 3, zx = 18 + 76, zy = 74 + 112, sx = STU[0], sy = STU[1] - 14;
      put(q(s, '#tschl'), {d: an ? `M${zx} ${zy + 8} C${zx + 10} ${zy + 90} ${sx - 50} ${sy + 30} ${sx - 26} ${sy - 4}` : `M${zx} ${zy + 8} C${zx + 6} ${zy + 60} ${zx - 50} ${zy + 50} ${zx - 60} ${zy + 20}`}); put(q(s, '#tschl2'), {d: q(s, '#tschl').getAttribute('d')});
      put(q(s, '#tzh'), {opacity: an ? 0 : 1}); put(q(s, '#tpist'), {opacity: an ? 1 : 0, transform: `translate(${sx} ${sy})`}); put(q(s, '#tlap'), {opacity: an || p === 4 ? 1 : 0});
      if (p === 2) st.l = Math.min(38.5, tp * 6); else if (p >= 3) st.l = 38.5; q(s, '.tl').textContent = st.l.toFixed(1).replace('.', ',') + ' l'; q(s, '.te').textContent = (st.l * 1.79).toFixed(2).replace('.', ',') + ' €';
      const dt = st.dt || .016; if (p === 3 && Math.random() < dt * 8) st.ds.push({x: sx - 8 + Math.random() * 16, y: sy, a: 1});
      st.ds.forEach(k => { k.y += dt * 22; k.x += dt * 4; k.a -= dt * .35; }); st.ds = st.ds.filter(k => k.a > 0);
      q(s, '#tdampf').innerHTML = st.ds.map(k => `<circle cx="${k.x.toFixed(1)}" cy="${k.y.toFixed(1)}" r="6" fill="#b7d36b" fill-opacity="${(.5 * k.a).toFixed(2)}"/>`).join('');
    }});
})();

/* ---------- A2.4 Sog und Schwell großer Schiffe (SBF 34, 37, 61; Hörreise 1-3 nutzt die Phasen 0–3) ---------- */
(() => { const SH = `<g><path d="M0 -120 C18 -100 24 -60 24 0 V110 Q24 120 14 120 H-14 Q-24 120 -24 110 V0 C-24 -60 -18 -100 0 -120Z" fill="#8a94a0" stroke="#4a525c" stroke-width="3"/>
    <rect x="-16" y="66" width="32" height="34" rx="4" fill="#eef2f8" stroke="#4a525c" stroke-width="2"/><rect x="-12" y="70" width="24" height="6" fill="#4a6a8a"/>${[-80, -50, -20, 10, 40].map(y => `<rect x="-14" y="${y}" width="28" height="24" rx="2" fill="${['#c0392b', '#2e86c1', '#e0a63a', '#2e8b57', '#c0392b'][(y + 80) / 30]}" stroke="#4a525c" stroke-width="1.2"/>`).join('')}</g>`;
  const TAN = Math.tan(19.5 * Math.PI / 180);
  const welle = (cx, by, sy, L, op) => { const out = []; const lam = L * .16;
    for (let k = 1; k <= 9; k++) { const d = k * lam, w = d * TAN * .92, c = d * .05, y = sy + d, a = (op * (1 - k / 11)).toFixed(2);
      out.push(`<path d="M${(cx - w).toFixed(1)} ${(y - c).toFixed(1)} Q${cx} ${(y + c * 2).toFixed(1)} ${(cx + w).toFixed(1)} ${(y - c).toFixed(1)}" stroke-opacity="${(a * .6).toFixed(2)}"/>`);
      for (const sg of [-1, 1]) { const ex = cx + sg * d * TAN, len = 10 + k * 2.4; out.push(`<path d="M${(ex - sg * len * .3).toFixed(1)} ${(y + len * .5).toFixed(1)} Q${(ex + sg * len * .2).toFixed(1)} ${(y).toFixed(1)} ${(ex + sg * len * .7).toFixed(1)} ${(y - len * .55).toFixed(1)}" stroke-opacity="${a}"/>`); } }
    for (const sg of [-1, 1]) out.push(`<path d="M${cx + sg * 6} ${by + 6} Q${cx + sg * 30} ${by + 20} ${(cx + sg * 44).toFixed(1)} ${(by + 70).toFixed(1)}" stroke-opacity="${op.toFixed(2)}" stroke-width="4"/>`);
    return out.join(''); };
  roh('sog', {titel: 'Sog und Schwell großer Schiffe', nr: 'A2.4', gruppe: 'A2 Anlegen, Ankern, Manöver', folge: 'G3.2',
    svg: `<rect width="400" height="500" fill="#4f9cc6"/><g id="sgg" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"></g><g id="swv" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"></g>
      <g id="spier" opacity="0"><rect x="340" y="0" width="60" height="500" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>${[60, 190, 320].map((y, i) => `<g class="slieg" data-y="${y}">${BO.oben({farbe: {rumpf: ['#f3e3c3', '#e6eef5', '#f6d9d0'][i]}})}</g>`).join('')}</g>
      <g id="sship">${SH}</g><g id="sklein">${BO.oben({})}</g>
      <g id="sar" fill="#f08a1c" stroke="#f08a1c" stroke-width="4"></g><g id="sx" opacity="0"><circle r="16" fill="#fff" stroke="#c0392b" stroke-width="3"/><path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#c0392b" stroke-width="3.5"/></g>
      ${T(0, 0, '', 'start', 20, 'slab')}`,
    phasen: [
      {wer: H, t: 'Ein großes Schiff schiebt vorn eine Bugwelle vor sich her und zieht hinten eine Heckwelle hinter sich her. Die kann ein kleines Boot zum Kentern bringen.', min: 9, cap: 'Bugwelle und Heckwelle'},
      {wer: M, t: 'Zwischen dem großen Schiff und dir fließt das Wasser schneller. Das saugt dich an: der Sog. So kommt es zur Kollision.', min: 8, cap: 'Sog: das Wasser dazwischen zieht'},
      {wer: H, t: 'Wirst du überholt, schubst dich vorn der Stau weg, in der Mitte zieht dich der Sog ran, und am Heck kann dich der Schwell querschlagen. Im Flachen läufst du sogar auf Grund.', min: 11, cap: 'Überholt werden: Stau, Sog, Schwell'},
      {wer: M, t: 'Darum: Abstand halten. Und an festgemachten Booten fährst du langsam vorbei, sonst wirft deine Welle sie gegen den Steg. Das gelbe Tafelzeichen sagt dasselbe: Sog und Wellenschlag vermeiden.', min: 11, cap: 'Langsam an Liegern vorbei'}],
    enter(s, p, st) { st.bx = p === 2 ? 236 : p === 1 ? 228 : 270; st.rot = 0; st.roll = 0; st.by = p === 2 ? 330 : 250; put(q(s, '#spier'), {opacity: p === 3 ? 1 : 0}); put(q(s, '#sship'), {opacity: p === 3 ? 0 : 1}); },
    tick(s, tp, p, st) {
      const dt = st.dt || .016;
      q(s, '#sgg').innerHTML = Array.from({length: 22}, (_, i) => { const x = (i * 71) % 380, y = ((i * 113) % 520 + tp * 8) % 520 - 10; return `<path d="M${x} ${y.toFixed(0)} q9 -4 18 0 t18 0"/>`; }).join('');
      if (p < 3) {
        const v = p === 2 ? 30 : 64, sx = 150, sy = 640 - ((tp * v) % 900), stern = sy + 120;
        put(q(s, '#sship'), {transform: `translate(${sx} ${sy.toFixed(1)})`}); q(s, '#swv').innerHTML = welle(sx, sy - 120, stern, 260, .9);
        if (p === 2) st.by -= dt * 12;
        const by = st.by, rel = by - sy; let ziel = p === 2 ? 236 : p === 1 ? 222 : 270, rz = 0, lab = '';
        const edge = Math.abs(st.bx - sx) - (by - stern) * TAN; const anKante = by > stern && Math.abs(edge) < 16;
        if (p >= 1 && Math.abs(rel) < 90) { ziel = sx + 52; lab = 'Sog'; }
        if (p === 2 && rel < -90 && rel > -170) { ziel = 250; rz = 14; lab = 'Stau'; }
        if (p === 2 && rel > 110 && rel < 220) { rz = -50; lab = 'Schwell'; }
        if (anKante) st.roll = 1;
        st.roll = Math.max(0, st.roll - dt * .8); st.bx += (ziel - st.bx) * Math.min(1, dt * 1.4); st.rot += (rz - st.rot) * Math.min(1, dt * 2);
        const wack = st.roll * Math.sin(tp * 14) * 16;
        put(q(s, '#sklein'), {transform: `translate(${st.bx.toFixed(1)} ${by.toFixed(1)}) rotate(${(st.rot + wack).toFixed(1)}) scale(.62)`});
        const ar = q(s, '#sar'), bxx = st.bx; ar.innerHTML = lab === 'Sog' ? `<path d="M${(bxx - 18).toFixed(0)} ${by}H${sx + 40}" fill="none"/><path d="M${sx + 34} ${by - 9}L${sx + 20} ${by}L${sx + 34} ${by + 9}Z" stroke="none"/>` : lab === 'Stau' ? `<path d="M${sx + 30} ${by}H${(bxx - 20).toFixed(0)}" fill="none"/><path d="M${(bxx - 26).toFixed(0)} ${by - 9}L${(bxx - 12).toFixed(0)} ${by}L${(bxx - 26).toFixed(0)} ${by + 9}Z" stroke="none"/>` : '';
        const sl = q(s, '.slab'); sl.textContent = lab || (anKante ? 'Welle!' : ''); put(sl, {x: Math.min(330, bxx + 18).toFixed(0), y: (by - 26).toFixed(0)}); put(q(s, '#sx'), {opacity: 0});
      } else {
        /* Phase 3: erst zu schnell (Lieger schlagen an den Steg), dann langsam */
        const schnell = tp < 6, y = schnell ? 560 - tp * 90 : 560 - (tp - 6) * 34, by = ((y % 640) + 640) % 640 - 60, bx = 270;
        q(s, '#swv').innerHTML = schnell ? welle(bx, by - 31, by + 31, 120, .8) : welle(bx, by - 31, by + 31, 60, .35);
        put(q(s, '#sklein'), {transform: `translate(${bx} ${by.toFixed(1)}) scale(.62)`}); q(s, '#sar').innerHTML = '';
        qa(s, '.slieg').forEach(e => { const ly = +e.dataset.y, hit = schnell && ly > by + 20 && ly < by + 170, w = hit ? Math.sin(tp * 16 + ly) * 9 : Math.sin(tp * 2 + ly) * 1; put(e, {transform: `translate(${(366 + (hit ? Math.abs(w) * .5 : 0)).toFixed(1)} ${ly}) rotate(${w.toFixed(1)}) scale(.5)`}); });
        const sl = q(s, '.slab'); sl.textContent = schnell ? 'Zu schnell!' : 'Langsam'; put(sl, {x: 120, y: 470, fill: schnell ? '#c0392b' : '#1f7a3a'}); put(q(s, '#sx'), {opacity: schnell ? 1 : 0, transform: `translate(${bx - 52} ${by.toFixed(0)})`});
      }
    }});
})();

/* ---------- A5.1 Lichterkarussell: oben von oben, unten so, wie du das Boot siehst (Nutzer 08.11.2026) ---------- */
(() => { const C = [200, 170], R = 96;
  const sek = f => ({top: f <= 112.5 || f >= 247.5, gr: f <= 112.5 || f >= 357, ro: f >= 247.5 || f <= 3, he: f >= 112.5 && f <= 247.5});   /* genau von vorn (± 3°) sieht man beide Seitenlichter */
  const bogen = (r, a0, a1) => { const P = a => [C[0] + r * Math.sin(a * Math.PI / 180), C[1] - r * Math.cos(a * Math.PI / 180)]; const [x0, y0] = P(a0), [x1, y1] = P(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  const glow = (id, c, r) => `<g id="${id}" opacity="0"><circle r="${r * 2.8}" fill="${c}" opacity=".28"/><circle r="${r}" fill="${c}"/></g>`;
  roh('lichter', {titel: 'Lichterkarussell', nr: 'A5.1', gruppe: 'A5 Lichter und Signalkörper', folge: 'G5.1, S3.1',
    svg: `<rect width="400" height="500" fill="#0f1d36"/>${Array.from({length: 24}, (_, i) => `<circle cx="${(i * 97) % 390 + 5}" cy="${(i * 53) % 270 + 40}" r="${i % 3 ? .9 : 1.4}" fill="#fff" opacity=".5"/>`).join('')}
      <path d="${bogen(66, -112.5, 112.5)}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="4"/><path d="${bogen(56, 0, 112.5)}" fill="none" stroke="#2ee06a" stroke-width="10"/><path d="${bogen(56, 247.5, 360)}" fill="none" stroke="#ff4a3d" stroke-width="10"/><path d="${bogen(76, 112.5, 247.5)}" fill="none" stroke="#fffbe0" stroke-opacity=".85" stroke-width="4" stroke-dasharray="6 4"/>
      <g transform="translate(${C[0]} ${C[1]}) scale(.9)">${BO.oben({lichter: true, nacht: true})}</g>
      <g id="leye"><circle r="13" fill="#ffd36a" stroke="#fff" stroke-width="2.5"/><circle r="5" fill="#0f1d36"/></g>
      ${T(C[0] + 24, C[1] - R - 6, 'voraus', 'start', 16, 'lw')}${T(C[0] + 24, C[1] + R + 14, 'achteraus', 'start', 16, 'lw')}
      <rect x="14" y="296" width="372" height="170" rx="16" fill="#132748" stroke="#3b5580" stroke-width="2"/>${T(200, 320, 'So siehst du das Boot', 'middle', 16, 'lw')}
      <path d="M24 420 H376" stroke="#3d6a9a" stroke-width="2"/><g id="lsil"></g>
      ${glow('lgT', '#ffffff', 6)}${glow('lgR', '#ff4a3d', 6)}${glow('lgG', '#2ee06a', 6)}${glow('lgH', '#fffbe0', 6)}
      ${T(200, 455, '', 'middle', 17, 'lw lsee')}<style>.an .lw{fill:#e8eef8;stroke:#0f1d36}</style>`,
    phasen: [
      {wer: M, t: 'Kommt ein Motorboot genau auf dich zu, siehst du Rot und Grün nebeneinander und darüber das weiße Topplicht.', min: 7, cap: 'Von vorn: Rot, Grün, Topplicht'},
      {wer: H, t: 'Siehst du es von der Seite, siehst du nur eine Seitenlampe, hier Grün von Steuerbord, dazu das Topplicht.', min: 7, cap: 'Von der Seite: Grün und Topplicht'},
      {wer: M, t: 'Von achtern siehst du nur das weiße Hecklicht.', min: 5, cap: 'Von achtern: nur das Hecklicht'},
      {wer: H, t: 'Und jetzt gehst du einmal ganz herum. Schau unten, wann welche Lampe angeht und wie das Boot sich dreht.', min: 14, cap: 'Einmal rundherum'}],
    init(s, st) { st.phi = 0; },
    tick(s, tp, p, st) {
      const dt = st.dt || .016; if (p === 3) st.phi = (st.phi + 26 * dt) % 360; else { const t = [0, 90, 180][p], d = ((t - st.phi + 540) % 360) - 180; st.phi = (st.phi + d * Math.min(1, dt * 3.5) + 360) % 360; }
      const f = st.phi, fr = f * Math.PI / 180; put(q(s, '#leye'), {transform: `translate(${(C[0] + R * Math.sin(fr)).toFixed(1)} ${(C[1] - R * Math.cos(fr)).toFixed(1)})`});
      /* Ansicht: Beobachter in Richtung f (0 = voraus, 90 = Steuerbord) schaut aufs Boot; rechts im Bild = (−cos f, sin f) in Bootskoordinaten (x Steuerbord, y voraus) */
      const rx = -Math.cos(fr), ry = Math.sin(fr), px = (x, y) => 200 + (x * rx + y * ry) * 2.1, WL = 420;
      const xb = px(0, 44), xs = px(0, -44), w = Math.abs(rx) * 0 + Math.abs(Math.cos(fr)) * 0 + 19 * Math.abs(Math.sin(fr + Math.PI / 2)) * 0;
      const umriss = [[0, 44], [14, 26], [19, 0], [18, -44], [-18, -44], [-19, 0], [-14, 26]].map(([x, y]) => px(x, y)), lo = Math.min(...umriss), hi = Math.max(...umriss);
      const vorn = xb, bugHoch = 8; const kab = [px(-10, 6), px(10, 6), px(10, -20), px(-10, -20)], k0 = Math.min(...kab), k1 = Math.max(...kab);
      q(s, '#lsil').innerHTML = `<path d="M${lo.toFixed(1)} ${WL - 28} L${hi.toFixed(1)} ${WL - 28} L${(hi - 6).toFixed(1)} ${WL} L${(lo + 6).toFixed(1)} ${WL}Z" fill="#1e2a3d" stroke="#4d6a8f" stroke-width="2"/>
        <path d="M${vorn.toFixed(1)} ${WL - 28 - bugHoch} L${vorn.toFixed(1)} ${WL - 28}" stroke="#4d6a8f" stroke-width="3"/>
        <rect x="${k0.toFixed(1)}" y="${WL - 58}" width="${Math.max(6, k1 - k0).toFixed(1)}" height="30" rx="4" fill="#26354c" stroke="#4d6a8f" stroke-width="2"/>
        <path d="M${px(0, 10).toFixed(1)} ${WL - 58} V${WL - 110}" stroke="#4d6a8f" stroke-width="3"/>`;
      const z = sek(f), L = [['lgT', px(0, 10), WL - 112, z.top], ['lgR', px(-19, 22), WL - 32, z.ro], ['lgG', px(19, 22), WL - 32, z.gr], ['lgH', px(0, -44), WL - 34, z.he]];
      L.forEach(([id, x, y, an]) => put(q(s, '#' + id), {transform: `translate(${x.toFixed(1)} ${y})`, opacity: an ? 1 : 0}));
      q(s, '.lsee').textContent = 'Du siehst: ' + [z.top && 'Topplicht', z.ro && 'Rot', z.gr && 'Grün', z.he && 'Hecklicht'].filter(Boolean).join(', ');
    }});
})();

/* ---------- A7.3 Kardinalzeichen als Uhr (Marke Prüfung immer an derselben Stelle, O170) ---------- */
(() => { const M0 = [200, 268], RK = 150;
  const K = [['N', 'nord', [200, 170], 'Nord: schwarz über gelb', 'Kegel: Spitzen nach oben', 'ununterbrochen schnell', 0],
    ['O', 'ost', [334, 300], 'Ost: schwarz, gelb, schwarz', 'Kegel: Basis an Basis', '3 Blitze, wie 3 Uhr', 90],
    ['S', 'sued', [200, 428], 'Süd: gelb über schwarz', 'Kegel: Spitzen nach unten', '6 Blitze + 1 langer, wie 6 Uhr', 180],
    ['W', 'west', [66, 300], 'West: gelb, schwarz, gelb', 'Kegel: Spitzen zueinander', '9 Blitze, wie 9 Uhr', 270]];
  const blitz = (n, t) => { if (n === 'N') return Math.floor(t / .12) % 2 === 0; const per = {O: 5, S: 7.2, W: 7.6}[n], c = {O: 3, S: 6, W: 9}[n], u = t % per; if (u < c * .5) return (u % .5) < .25; if (n === 'S') return u > c * .5 + .3 && u < c * .5 + 1.5; return false; };
  const keil = a => { const P = d => [M0[0] + RK * Math.sin(d * Math.PI / 180), M0[1] - RK * Math.cos(d * Math.PI / 180)], [x0, y0] = P(a - 45), [x1, y1] = P(a + 45); return `M${M0[0]} ${M0[1]} L${x0.toFixed(1)} ${y0.toFixed(1)} A${RK} ${RK} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z`; };
  roh('kardinal', {titel: 'Kardinalzeichen als Uhr', nr: 'A7.3', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', folge: 'S5.4',
    svg: `<rect width="400" height="500" fill="#5ba7cf"/><circle cx="${M0[0]}" cy="${M0[1]}" r="${RK}" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>
      <g transform="translate(364 458)"><circle r="28" fill="#fff" stroke="#2b3a4a" stroke-width="3"/>${[12, 3, 6, 9].map(h => { const a = (h % 12) * 30 * Math.PI / 180; return `<text class="t" x="${(19 * Math.sin(a)).toFixed(0)}" y="${(-19 * Math.cos(a) + 4).toFixed(0)}" text-anchor="middle" font-size="11" stroke="none">${h}</text>`; }).join('')}<path id="kzeig" d="M0 0 V-16" stroke="#c0392b" stroke-width="3.5" stroke-linecap="round"/><circle r="3" fill="#2b3a4a"/></g>
      <path id="kkeil" fill="#2ee06a" fill-opacity=".35" stroke="#1f9a3c" stroke-width="2" opacity="0"/>
      <g transform="translate(${M0[0]} ${M0[1]})"><path d="M-30 4 Q-20 -18 0 -12 Q22 -18 30 2 Q18 20 0 16 Q-20 20 -30 4Z" fill="#6b5a45" stroke="#3a2e22" stroke-width="2.5"/><path d="M-14 -4 L10 6 M-4 -12 L4 12" stroke="#3a2e22" stroke-width="3"/>${T(0, 40, 'Gefahr', 'middle', 16, 'r')}</g>
      ${K.map(([n, art, [x, y]]) => `<g class="kt" data-n="${n}" transform="translate(${x} ${y}) scale(1.35)">${B.tonne(art)}<circle class="kl" cx="0" cy="-70" r="5" fill="#555" stroke="#222"/><circle class="kg" cx="0" cy="-70" r="13" fill="#ffe45a" opacity="0"/></g>`).join('')}
      ${K.map(([n, , [x, y]]) => T(x + (n === 'W' ? -30 : n === 'O' ? 30 : 0), y + (n === 'N' ? -100 : 22), n, 'middle', 22, 'w')).join('')}
      ${T(176, 450, '', 'middle', 18, 'kt1')}${T(176, 476, '', 'middle', 16, 'kt2')}`,
    phasen: [
      {wer: M, t: 'Vier Tonnen stehen um die Gefahrenstelle: Nord, Ost, Süd und West. Du fährst an der Seite vorbei, nach der die Tonne heißt.', min: 8, cap: 'Vier Tonnen um die Gefahr'},
      {wer: H, t: 'Das Nordzeichen steht im Norden der Gefahr: Fahr nördlich vorbei. Beide Kegel zeigen nach oben, und es blitzt ununterbrochen schnell.', min: 8, cap: 'Nord: nördlich vorbei'},
      {wer: M, t: 'Ost: östlich vorbei. Die Kegel stehen Basis an Basis, und es blitzt dreimal, wie drei Uhr.', min: 8, cap: 'Ost: östlich vorbei'},
      {wer: H, t: 'Süd: südlich vorbei. Beide Kegel zeigen nach unten. Es blitzt sechsmal und dann noch einmal lang, wie sechs Uhr.', min: 9, cap: 'Süd: südlich vorbei'},
      {wer: M, t: 'West: westlich vorbei. Die Kegel zeigen mit den Spitzen zueinander, und es blitzt neunmal, wie neun Uhr.', min: 9, cap: 'West: westlich vorbei'}],
    enter(s, p) { const k = K[p - 1]; put(q(s, '#kkeil'), {opacity: k ? 1 : 0, d: k ? keil(k[6]) : 'M0 0'}); qa(s, '.kt').forEach(e => put(e, {opacity: !k || e.dataset.n === k[0] ? 1 : .45}));
      q(s, '.kt1').textContent = k ? k[3] : 'Die Tonne sagt, wo das sichere Wasser ist'; q(s, '.kt2').textContent = k ? k[4] + ' · ' + k[5] : ''; fit(q(s, '.kt1'), 300); fit(q(s, '.kt2'), 300);
      put(q(s, '#kzeig'), {transform: `rotate(${k ? k[6] : 0})`, opacity: k ? 1 : .3}); },
    tick(s, tp, p) { qa(s, '.kt').forEach(e => { const n = e.dataset.n, i = K.findIndex(k => k[0] === n), on = (p === 0 || p === i + 1) && blitz(n, tp + i * .7); put(e.querySelector('.kl'), {fill: on ? '#ffe45a' : '#555'}); put(e.querySelector('.kg'), {opacity: on ? .45 : 0}); }); }});
})();

/* ---------- A9.1 Warum der Wind weht (Schrift größer, Nutzer 08.11.2026) ---------- */
(() => { const HP = [200, 170], TP = [200, 370];
  roh('wetter', {titel: 'Warum der Wind weht', nr: 'A9.1', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'G7.1, S9.1',
    svg: `<rect width="400" height="500" fill="#e3eef4"/>${[30, 56, 82].map(r => `<circle cx="${HP[0]}" cy="${HP[1]}" r="${r}" fill="none" stroke="#b5a2cc" stroke-width="2.5"/><circle cx="${TP[0]}" cy="${TP[1]}" r="${r}" fill="none" stroke="#9ab" stroke-width="2.5"/>`).join('')}
      <text class="t" x="${HP[0]}" y="${HP[1] + 14}" text-anchor="middle" font-size="42" fill="#6a3d9a">H</text><text class="t" x="${TP[0]}" y="${TP[1] + 14}" text-anchor="middle" font-size="42" fill="#2a6a9a">T</text>
      ${T(310, HP[1] - 60, 'Hoch:', 'middle', 18)}${T(310, HP[1] - 38, 'viel Druck', 'middle', 18)}${T(310, TP[1] + 50, 'Tief:', 'middle', 18)}${T(310, TP[1] + 72, 'wenig Druck', 'middle', 18)}
      <g id="wdr" opacity="0">${B.pfeil(HP[0], HP[1] + 40, HP[0], TP[1] - 40, '#f08a1c', 6)}</g><g id="wpt"></g>${T(200, 478, '', 'middle', 18, 'wn')}`,
    phasen: [
      {wer: M, t: 'Hier ein Hoch, dort ein Tief. Im Hoch drückt die Luft stärker, im Tief schwächer.', min: 6, cap: 'Hoch und Tief'},
      {wer: H, t: 'Die Luft will vom hohen zum tiefen Druck. Das ist der Wind.', min: 6, cap: 'Druckunterschied macht Wind'},
      {wer: M, t: 'Durch die Erddrehung wird sie abgelenkt. Auf der Nordhalbkugel strömt sie im Hoch im Uhrzeigersinn hinaus und im Tief gegen den Uhrzeigersinn hinein.', min: 10, cap: 'Erddrehung lenkt ab'},
      {wer: H, t: 'Merk dir: Um das Tief dreht der Wind gegen den Uhrzeigersinn.', min: 6, cap: 'Tief: gegen den Uhrzeigersinn'}],
    init(s, st) { st.pts = Array.from({length: 64}, (_, i) => ({a: Math.random() * 6.28, r: 10 + Math.random() * 74, x: 160 + Math.random() * 80, y: HP[1] + 30 + Math.random() * 140, g: i % 2})); q(s, '#wpt').innerHTML = st.pts.map(() => `<circle r="4" fill="#2b6a9a"/>`).join(''); },
    enter(s, p) { put(q(s, '#wdr'), {opacity: p === 1 ? 1 : 0}); q(s, '.wn').textContent = ['', 'vom Hoch zum Tief', 'Hoch: im Uhrzeigersinn hinaus · Tief: gegen ihn hinein', 'Nordhalbkugel'][p] || ''; fit(q(s, '.wn')); },
    tick(s, tp, p, st) { const dt = st.dt || .016, cs = q(s, '#wpt').children;
      st.pts.forEach((o, i) => { let x, y;
        if (p === 0) { x = o.x; y = o.y; }
        else if (p === 1) { o.y += 80 * dt; if (o.y > TP[1] - 30) { o.y = HP[1] + 30; o.x = 160 + Math.random() * 80; } x = o.x; y = o.y; }
        else if (o.g) { o.a -= 1.0 * dt; o.r -= 12 * dt; if (o.r < 10) { o.r = 84; o.a = Math.random() * 6.28; } x = TP[0] + o.r * Math.cos(o.a); y = TP[1] + o.r * Math.sin(o.a); }
        else { o.a += 1.0 * dt; o.r += 12 * dt; if (o.r > 84) { o.r = 10; o.a = Math.random() * 6.28; } x = HP[0] + o.r * Math.cos(o.a); y = HP[1] + o.r * Math.sin(o.a); }
        put(cs[i], {cx: x.toFixed(1), cy: y.toFixed(1), opacity: p === 0 ? 0 : (p === 3 && !o.g ? .25 : 1)}); }); }});
})();

/* ---------- A1.5 Die vier Kreisläufe des Motors (Einbaumotor im Schnitt, SBF 52–55, 57, 60) ---------- */
(() => {
  /* Leitungen: k = Kreislauf, v = Tempo, c = Farbe der Tropfen/Blasen, r = Größe, w/f = Schlauch */
  const LEIT = [
    ['kw', 'M300 384 V362 Q300 352 312 350 H318', 34, '#d6f0ff', 3.5, 8, '#2e86c1'], ['kw', 'M318 322 Q318 304 300 304 H284', 34, '#d6f0ff', 3.5, 8, '#2e86c1'],
    ['kw', 'M282 296 Q268 288 252 286 H156 Q146 286 146 272 V252 Q146 242 134 242', 30, '#d6f0ff', 3.2, 7, '#3d9ad6'], ['kw', 'M128 244 Q96 248 78 278 Q66 292 24 292', 38, '#e8f6ff', 3.5, 9, '#2b2b2b'],
    ['oel', 'M170 338 Q160 312 166 280 Q170 256 200 254 Q232 256 236 282 Q240 312 228 338', 14, '#ffd27a', 4, 0, ''],
    ['sprit', 'M326 262 H308', 22, '#ffcf6b', 3, 6, '#b86a12'], ['sprit', 'M292 256 H264', 22, '#ffcf6b', 3, 6, '#b86a12'],
    ['strom', 'M92 300 Q92 292 104 292 Q130 292 140 306', 70, '#fff36b', 3.5, 4, '#c0392b'], ['strom', 'M286 258 Q300 240 296 226 Q292 218 270 218 H112 Q96 218 94 240 L92 300', 70, '#fff36b', 3.5, 4, '#e0a800']];
  const LAMPEN = [['tmp', 'Temperatur', '🌡️'], ['oel', 'Öldruck', '🛢️'], ['lad', 'Ladekontrolle', '🔋']];
  roh('motor', {titel: 'Die vier Kreisläufe des Motors', nr: 'A1.5', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G2.2',
    svg: `<defs><clipPath id="mrh"><path d="M16 210 H392 V380 L130 364 Q50 354 18 338Z"/></clipPath></defs>
      <rect width="400" height="500" fill="#dbe9f3"/><rect y="300" width="400" height="200" fill="#4f9cc6"/>${Array.from({length: 9}, (_, i) => `<path d="M${(i * 89) % 360 + 10} ${400 + (i * 31) % 80} q8 -5 16 0 t16 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`).join('')}
      <rect x="14" y="52" width="372" height="96" rx="14" fill="#2b3440" stroke="#151b22" stroke-width="3"/>${T(30, 74, 'Armaturen', 'start', 14, 'w')}
      ${LAMPEN.map(([id, t, i], n) => `<g transform="translate(${80 + n * 120} 100)"><circle id="ml${id}" r="17" fill="#4a1d1a" stroke="#111" stroke-width="2"/><text x="0" y="6" text-anchor="middle" font-size="16">${i}</text>${T(0, 38, t, 'middle', 14, 'w')}</g>`).join('')}
      <path d="M16 210 H392 V380 L130 364 Q50 354 18 338Z" fill="#fbf8f2" stroke="#5f5446" stroke-width="3"/><rect y="300" width="400" height="90" fill="#1f3b63" clip-path="url(#mrh)"/>
      <path d="M28 220 H392 V368 L130 352 Q58 343 30 328Z" fill="#f3ead8" stroke="#8a7a66" stroke-width="2"/><path d="M16 300 H392" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 6"/>
      <rect x="150" y="338" width="16" height="16" fill="#7a5a3a"/><rect x="236" y="338" width="16" height="16" fill="#7a5a3a"/>
      <path d="M140 320 L44 362" stroke="#8a8f98" stroke-width="6"/><g id="mprop" transform="translate(44 362)"><ellipse rx="5" ry="16" fill="#c9a24a" stroke="#7a5a1a" stroke-width="2"/></g><path d="M24 342 L32 342 L32 390 L22 390Z" fill="#666" stroke="#333"/>
      <g id="mkw" class="mk">${'<path class="mlt" data-i="0"/><path class="mlt" data-i="1"/><path class="mlt" data-i="2"/><path class="mlt" data-i="3"/>'}
        <g transform="translate(300 376)"><rect x="-9" y="-6" width="18" height="12" rx="3" fill="#8a6d2a" stroke="#4a3a12" stroke-width="2"/><path id="mhebel" d="M0 -6 L16 -16" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/></g>
        <rect x="310" y="320" width="16" height="32" rx="5" fill="#bfe3f7" fill-opacity=".7" stroke="#4a6a8a" stroke-width="2"/>
        <circle cx="282" cy="298" r="9" fill="#2e86c1" stroke="#1d4f73" stroke-width="2"/><path id="mimp" d="M282 291 V305 M275 298 H289" stroke="#fff" stroke-width="2"/><g id="mspritz"></g></g>
      <rect x="140" y="246" width="122" height="88" rx="10" fill="#5d6b78" stroke="#2f3a44" stroke-width="3"/><rect x="150" y="232" width="102" height="18" rx="4" fill="#6f7d8a" stroke="#2f3a44" stroke-width="2"/><rect x="158" y="222" width="86" height="12" rx="4" fill="#b03a2e" stroke="#6a1f17" stroke-width="2"/>
      ${[168, 184, 200, 216, 232].map(x => `<path d="M${x} 236 V248" stroke="#4a5662" stroke-width="2"/>`).join('')}<rect x="154" y="330" width="94" height="16" rx="5" fill="#4a5662" stroke="#2f3a44" stroke-width="2"/>
      <g id="moel" class="mk"><path class="mlt" data-i="4"/></g>
      <circle cx="286" cy="262" r="13" fill="#9aa4ae" stroke="#4a525c" stroke-width="2.5"/><circle cx="270" cy="318" r="10" fill="#9aa4ae" stroke="#4a525c" stroke-width="2"/><path d="M286 249 L270 308 M298 266 L280 318" stroke="#222" stroke-width="2.5"/>
      <rect x="128" y="236" width="14" height="14" rx="4" fill="#8a8f98" stroke="#4a525c" stroke-width="2"/>
      <g id="msprit" class="mk"><rect x="322" y="222" width="66" height="50" rx="6" fill="#c0392b" stroke="#7a1f1a" stroke-width="2"/><rect x="330" y="244" width="50" height="22" rx="3" fill="#ffb347" fill-opacity=".6"/><path class="mlt" data-i="5"/><path class="mlt" data-i="6"/><rect x="292" y="242" width="16" height="26" rx="5" fill="#f2e2b8" stroke="#8a6a2a" stroke-width="2"/></g>
      <g id="mstrom" class="mk"><rect x="40" y="300" width="64" height="34" rx="4" fill="#2b2b2b" stroke="#111" stroke-width="2"/><rect x="48" y="294" width="10" height="7" fill="#555"/><rect x="86" y="294" width="10" height="7" fill="#c0392b"/><path class="mlt" data-i="7"/><path class="mlt" data-i="8"/>
        <g id="mhaupt" transform="translate(116 324)"><circle r="9" fill="#c0392b" stroke="#6a1f17" stroke-width="2"/><path id="mhs" d="M0 0 L0 -8" stroke="#fff" stroke-width="3"/></g></g>
      <g id="mpunkte"></g>
      ${T(205, 296, 'Motor', 'middle', 18, 'w')}<g class="mlab">${T(318, 404, 'Seeventil', 'middle', 14)}${T(352, 336, 'Filter', 'start', 13)}${T(282, 286, 'Impeller', 'end', 13)}${T(355, 286, 'Tank', 'middle', 14, 'w')}${T(72, 352, 'Batterie', 'middle', 13)}${T(300, 236, 'Filter', 'middle', 12)}${T(46, 286, 'Auspuff', 'middle', 13)}${T(300, 274, '', 'middle', 12)}</g>
      ${T(200, 456, '', 'middle', 17, 'mt1')}${T(200, 480, '', 'middle', 15, 'mt2')}`,
    phasen: [
      {wer: H, t: 'Kühlwasser: Durchs Seeventil kommt Seewasser, der Impeller pumpt es durch den Motor, und mit dem Auspuff geht es wieder raus. Kommt hinten kein Wasser mit, sofort Motor aus!', min: 11, cap: '1 Kühlwasser', a: ['kw'], t1: 'Seeventil · Filter · Impeller · Motor · Auspuff'},
      {wer: M, t: 'Öl schmiert den Motor. Die Öldruckleuchte muss nach dem Start ausgehen. Leuchtet sie weiter, ist der Druckschalter oder die Öldruckpumpe kaputt.', min: 10, cap: '2 Öl', a: ['oel'], t1: 'Öldruckleuchte geht nach dem Start aus'},
      {wer: H, t: 'Kraftstoff kommt aus dem Tank über den Filter zum Motor. Bleibt ein Außenborder mit vollem Tank stehen: Belüftungsschraube zu oder Leitung verstopft.', min: 10, cap: '3 Kraftstoff', a: ['sprit'], t1: 'Tank · Filter · Motor'},
      {wer: M, t: 'Strom: Die Batterie startet den Motor, die Lichtmaschine lädt sie wieder auf. Geht die Ladekontrolle nach dem Start nicht aus, ist die Lichtmaschine oder ihr Regler kaputt.', min: 11, cap: '4 Strom', a: ['strom'], t1: 'Starten aus der Batterie, laden über die Lichtmaschine'},
      {wer: H, t: 'Während der Fahrt im Blick: Motortemperatur, Öldruck, Ladekontrolle. Wird es zu heiß, liegt es am Thermostat, am Impeller, am geschlossenen Seeventil oder an zu wenig Kühlwasser.', min: 12, cap: 'Warnleuchten im Blick', a: ['kw', 'oel', 'sprit', 'strom'], t1: 'Zu heiß? Thermostat · Impeller', t2: 'Seeventil zu · zu wenig Kühlwasser'},
      {wer: M, t: 'Und wenn du das Boot länger verlässt: alle Seeventile zu und den Hauptschalter aus.', min: 7, cap: 'Boot verlassen: Ventile zu, Strom aus', a: [], t1: 'Seeventile schließen, Hauptschalter aus'}],
    init(s, st) { qa(s, '.mlt').forEach(e => { const L = LEIT[+e.dataset.i]; e.setAttribute('d', L[1]); e.setAttribute('fill', 'none'); e.setAttribute('stroke', L[0] === 'oel' ? '#8a5a12' : L[6]); e.setAttribute('stroke-width', L[0] === 'oel' ? 9 : L[5]); e.setAttribute('stroke-linecap', 'round'); e.setAttribute('stroke-opacity', L[0] === 'oel' ? .55 : .85); });
      st.lt = [...qa(s, '.mlt')].map(e => { const L = LEIT[+e.dataset.i]; let len = 0; try { len = e.getTotalLength(); } catch (x) {} return {e, L, len, n: Math.max(2, Math.round(len / 18))}; });
      q(s, '#mpunkte').innerHTML = st.lt.map((l, j) => Array.from({length: l.n}, () => `<circle data-j="${j}" r="${l.L[4]}" fill="${l.L[3]}" stroke="${l.L[0] === 'oel' ? '#6a4208' : 'none'}" stroke-width=".8"/>`).join('')).join(''); st.pk = qa(s, '#mpunkte circle'); },
    enter(s, p, st) { const ph = A.defs.motor.phasen[p]; ['kw', 'oel', 'sprit', 'strom'].forEach(k => put(q(s, '#m' + k), {opacity: p === 5 ? .35 : ph.a.includes(k) || !ph.a.length ? 1 : .22}));
      q(s, '.mt1').textContent = ph.t1 || ''; q(s, '.mt2').textContent = ph.t2 || ''; fit(q(s, '.mt1')); fit(q(s, '.mt2')); },
    tick(s, tp, p, st) { const ph = A.defs.motor.phasen[p], dt = st.dt || .016;
      const zu = p === 5 && tp > 2, lauf = p !== 5 || tp < 2;
      put(q(s, '#mhebel'), {d: zu ? 'M0 -6 L18 -6' : 'M0 -6 L16 -16'}); put(q(s, '#mhs'), {transform: `rotate(${zu ? 90 : 0})`});
      put(q(s, '#mprop'), {transform: `translate(44 362) scale(1 ${lauf ? Math.abs(Math.cos(tp * 9)).toFixed(2) : 1})`}); put(q(s, '#mimp'), {transform: `rotate(${lauf ? (tp * 400 % 360).toFixed(0) : 0} 282 298)`});
      let k = 0; st.lt.forEach((l, j) => { const aktiv = lauf && (ph.a.includes(l.L[0]) || (p === 4)); const strom = l.L[0] === 'strom', start = j === 7;
        const zeig = aktiv && (!strom || (start ? (p === 3 ? tp < 2 : false) : (p !== 3 || tp > 2)));
        for (let i = 0; i < l.n; i++, k++) { const c = st.pk[k]; if (!zeig || !l.len) { c.setAttribute('opacity', 0); continue; } const d = (i * l.len / l.n + tp * l.L[2]) % l.len; let pt; try { pt = l.e.getPointAtLength(d); } catch (x) { pt = {x: 0, y: 0}; } c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1)); c.setAttribute('opacity', 1); } });
      /* Kontrollstrahl am Auspuff */
      const spr = lauf && (ph.a.includes('kw') || p === 4); q(s, '#mspritz').innerHTML = spr ? Array.from({length: 7}, (_, i) => { const u = (tp * 1.4 + i / 7) % 1; return `<circle cx="${(22 - u * 26).toFixed(1)}" cy="${(292 + u * u * 26).toFixed(1)}" r="${(3 - u * 1.5).toFixed(1)}" fill="#d6f0ff" stroke="#2e86c1" stroke-width=".8"/>`; }).join('') : '';
      /* Warnleuchten: Öl und Ladung gehen nach dem Start aus, Temperatur blinkt bei Phase 4 */
      const lampe = (id, an) => put(q(s, '#ml' + id), {fill: an ? '#ff3b2f' : '#4a1d1a'});
      lampe('oel', p === 1 && tp < 1.6); lampe('lad', p === 3 && tp < 2); lampe('tmp', p === 4 && Math.floor(tp * 2.5) % 2 === 0);
    }});
})();

/* ---------- A1.2 Radeffekt von hinten (Hörreise nutzt radeffekt 0, 1, 4; Pfeil trifft die Rumpfhälfte, Nutzer 08.11.2026) ---------- */
(() => { const PX = 200, PY = 338, WL = 236;
  const rumpf = 'M78 150 H322 Q326 200 312 238 Q296 296 200 304 Q104 296 88 238 Q74 200 78 150Z';
  const bogen = sg => `M${PX + sg * 30} ${PY + 6} Q${PX + sg * 78} ${PY - 18} ${PX + sg * 64} ${PY - 56}`;   /* vom Flügel außen hoch an die Rumpfhälfte */
  roh('rad', {titel: 'Radeffekt', nr: 'A1.2', gruppe: 'A1 Boot, Antrieb, Motor', folge: 'G2.1',
    svg: `<defs><clipPath id="rclip"><path d="${rumpf}"/></clipPath></defs><rect width="400" height="500" fill="#dbe9f3"/><rect y="${WL}" width="400" height="${500 - WL}" fill="#4f9cc6"/>
      <g id="rring"></g>
      <g id="rboot"><path d="${rumpf}" fill="#fbf8f2" stroke="#5f5446" stroke-width="3"/><rect y="${WL}" width="400" height="80" fill="#1f3b63" clip-path="url(#rclip)"/><path d="M80 178 H320" stroke="#c0392b" stroke-width="6"/>
        <path d="M134 150 L142 96 H258 L266 150Z" fill="#fbf8f2" stroke="#5f5446" stroke-width="3"/><path d="M138 96 H262 L258 86 H142Z" fill="#cfd6db" stroke="#5f5446" stroke-width="2"/><rect x="170" y="108" width="60" height="26" rx="4" fill="#7fa7c2" stroke="#5f5446" stroke-width="2"/>
        <path d="M${PX} 302 V${PY - 6}" stroke="#8a8f98" stroke-width="6"/><circle id="rprall" cx="0" cy="0" r="0"/>
        <g id="rhit" opacity="0"><path id="rhitp" stroke="#f08a1c" stroke-width="4" fill="none"/></g>
        ${T(112, 140, 'Backbord', 'middle', 17, 'r')}${T(288, 140, 'Steuerbord', 'middle', 17, 'gr')}</g>
      <g id="rprop" transform="translate(${PX} ${PY})">${[0, 120, 240].map(a => `<path d="M0 0 C10 -10 12 -34 0 -40 C-10 -34 -10 -10 0 0Z" fill="#d0a640" stroke="#7a5a1a" stroke-width="2" transform="rotate(${a})"/>`).join('')}<circle r="7" fill="#7a5a1a"/></g>
      <g id="rdreh" opacity="0" fill="none" stroke="#fff" stroke-width="4"><path id="rdrehp"/><path id="rdrehs" fill="#fff" stroke="none"/></g>
      <g id="rstrom" opacity="0"><path id="rbogen" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 12"/><path id="rbogen2" fill="none" stroke="#f08a1c" stroke-width="4"/><path id="rspitze" fill="#f08a1c"/></g>
      <g id="rschub" opacity="0"><path id="rschubp" stroke="#f08a1c" stroke-width="7" fill="none"/><path id="rschubs" fill="#f08a1c"/></g>
      ${T(200, 72, '', 'middle', 18, 'rt')}${T(200, 440, '', 'middle', 18, 'rt1')}${T(200, 468, '', 'middle', 16, 'rt2')}`,
    phasen: [
      {wer: H, t: 'Wir sehen das Boot von hinten. Der Propeller sitzt unter dem Heck.', min: 5, cap: 'Das Boot von hinten'},
      {wer: H, t: 'In Vorausfahrt dreht er sich von hinten gesehen im Uhrzeigersinn. Das nennt man rechtsdrehend.', min: 7, cap: 'Rechtsdrehend: im Uhrzeigersinn', t1: 'voraus: von hinten gesehen rechtsherum'},
      {wer: M, t: 'Der Propeller schleudert das Wasser in alle Richtungen. Auf der Backbordseite laufen die Flügel dabei nach oben und werfen das Wasser gegen den Rumpf.', min: 9, cap: 'Backbord: Wasser prallt an den Rumpf', t1: 'Flügel links laufen nach oben', t2: 'das Wasser trifft die Backbordhälfte'},
      {wer: H, t: 'Der Rumpf bekommt den Stoß ab. Das Wasser drückt ihn nach rechts, und das Heck weicht aus.', min: 7, cap: 'Heck weicht nach Steuerbord aus', t1: 'voraus: Heck nach Steuerbord (schwach)'},
      {wer: M, t: 'Rückwärts dreht sich alles um. Jetzt laufen die Flügel auf der Steuerbordseite nach oben, der Stoß kommt von der anderen Seite, und das Heck zieht nach Backbord, also nach links.', min: 10, cap: 'Rückwärts: Heck nach Backbord', t1: 'rückwärts: linksherum, Stoß an Steuerbord', t2: 'Heck nach Backbord (deutlich)'}],
    init(s, st) { st.rings = []; st.dx = 0; st.w = 0; },
    enter(s, p) { const ph = A.defs.rad.phasen[p]; q(s, '.rt1').textContent = ph.t1 || ''; q(s, '.rt2').textContent = ph.t2 || ''; fit(q(s, '.rt1')); fit(q(s, '.rt2')); },
    tick(s, tp, p, st) { const dt = st.dt || .016, rueck = p === 4, sg = rueck ? 1 : -1;   /* sg: Seite der Rumpfhälfte, die getroffen wird (−1 Backbord = links von hinten) */
      const dreht = p >= 1; if (dreht) st.w += (rueck ? -1 : 1) * dt * 260; put(q(s, '#rprop'), {transform: `translate(${PX + st.dx} ${PY}) rotate(${st.w.toFixed(1)})`});
      /* Drehpfeil um den Propeller */
      put(q(s, '#rdreh'), {opacity: p === 1 || p === 4 ? 1 : 0, transform: `translate(${st.dx.toFixed(1)} 0)`}); { /* Bogen unter dem Propeller: voraus von rechts nach links unten herum = im Uhrzeigersinn (von hinten), rückwärts umgekehrt */
        const r = 54, a0 = rueck ? 140 : 40, a1 = rueck ? 40 : 140, rad = a => a * Math.PI / 180, P = a => [PX + r * Math.cos(rad(a)), PY + r * Math.sin(rad(a))], [x0, y0] = P(a0), [x1, y1] = P(a1);
        put(q(s, '#rdrehp'), {d: `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 ${rueck ? 0 : 1} ${x1.toFixed(1)} ${y1.toFixed(1)}`});
        const sg2 = rueck ? -1 : 1, tx = -Math.sin(rad(a1)) * sg2, ty = Math.cos(rad(a1)) * sg2, nx = -ty, ny = tx;
        put(q(s, '#rdrehs'), {d: `M${(x1 + tx * 14).toFixed(1)} ${(y1 + ty * 14).toFixed(1)} L${(x1 + nx * 8).toFixed(1)} ${(y1 + ny * 8).toFixed(1)} L${(x1 - nx * 8).toFixed(1)} ${(y1 - ny * 8).toFixed(1)}Z`}); }
      /* Wellenringe vom Propeller */
      if (p >= 2 && Math.random() < dt * 3) st.rings.push({r: 10, a: 1}); st.rings.forEach(k => { k.r += dt * 70; k.a -= dt * .5; }); st.rings = st.rings.filter(k => k.a > 0);
      q(s, '#rring').innerHTML = st.rings.map(k => `<circle cx="${PX + st.dx}" cy="${PY}" r="${k.r.toFixed(1)}" fill="none" stroke="#fff" stroke-opacity="${(k.a * .55).toFixed(2)}" stroke-width="3"/>`).join('');
      /* Bogen vom Flügel an die Rumpfhälfte, Aufprall */
      const zeig = p === 2 || p === 3 || p === 4; put(q(s, '#rstrom'), {opacity: zeig ? 1 : 0, transform: `translate(${st.dx.toFixed(1)} 0)`});
      if (zeig) { const d = bogen(sg); put(q(s, '#rbogen'), {d, 'stroke-dashoffset': (-tp * 40).toFixed(0)}); put(q(s, '#rbogen2'), {d});
        const ex = PX + sg * 64, ey = PY - 56; put(q(s, '#rspitze'), {d: `M${ex} ${ey - 4} l${sg * 9} 12 l${-sg * 12} 2z`});
        put(q(s, '#rhit'), {opacity: Math.floor(tp * 3) % 2 ? 1 : .4}); put(q(s, '#rhitp'), {d: `M${ex - 12} ${ey - 8} l-6 -8 M${ex} ${ey - 10} v-10 M${ex + 12} ${ey - 8} l6 -8`, transform: `translate(${-st.dx.toFixed(1)} 0)`}); }
      else put(q(s, '#rhit'), {opacity: 0});
      /* Heck weicht aus: voraus nach rechts (Steuerbord), rückwärts nach links (Backbord) */
      const ziel = p === 3 ? 26 : p === 4 && tp > 2 ? -38 : 0; st.dx += (ziel - st.dx) * Math.min(1, dt * 1.6); put(q(s, '#rboot'), {transform: `translate(${st.dx.toFixed(1)} 0)`});
      const schub = p === 3 || (p === 4 && tp > 1.5); put(q(s, '#rschub'), {opacity: schub ? 1 : 0});
      if (schub) { const d = rueck ? -1 : 1, y = 214, x0 = 200 + st.dx - d * 30, x1 = x0 + d * 70; put(q(s, '#rschubp'), {d: `M${x0.toFixed(1)} ${y} H${x1.toFixed(1)}`}); put(q(s, '#rschubs'), {d: `M${(x1 + d * 16).toFixed(1)} ${y} L${x1.toFixed(1)} ${y - 11} L${x1.toFixed(1)} ${y + 11}Z`}); }
    }});
})();

/* ======================= v5.40: übrige Animationen fürs Hochformat neu gezeichnet ======================= */
/* alt(id): die alte Fassung (Texte der Phasen bleiben, Nutzer 08.11.2026 „Zeichne die übrigen Animationen um“) */
const ALT = {}; ['lichtertafel', 'schlepp', 'manunf', 'fischer', 'anker', 'nebel', 'glocke', 'lateral', 'kennung', 'sonderzeichen', 'sektorenfeuer', 'tafeln', 'bruecke'].forEach(id => { if (A.defs[id]) ALT[id] = A.defs[id]; });
const alt = id => ALT[id] || A.defs[id];
const neu = (id, o) => { const d = alt(id); if (!d) return; S(id, {...HF, titel: d.titel, nr: d.nr, gruppe: d.gruppe, art: d.art, folge: d.folge, ...o, phasen: o.phasen || d.phasen.map((ph, i) => ({...ph, ...((o.ph || {})[i] || {})}))}); };

/* ---------- A5 Lichter und Signalkörper: Nacht oben, Tag unten ---------- */
(() => { const FZ = A.fz; if (!FZ) return; const LFw = '#fffbe0';
  const nachtF = (y0 = 72, h = 206) => `<rect x="0" y="${y0}" width="400" height="${h}" fill="#142033"/><rect x="0" y="${y0 + h - 44}" width="400" height="44" fill="#0b1726"/>`;
  const tagF = (y0 = 284, h = 206) => `<rect x="0" y="${y0}" width="400" height="${h}" fill="#bfe0f2"/><rect x="0" y="${y0 + h - 50}" width="400" height="50" fill="#4d93bd"/>`;
  const paarH = (f, s = Math.min(1.6, 280 / f.L)) => `${nachtF()}${tagF()}<g transform="translate(206 234) scale(${s})">${FZ.nacht(f)}</g><g transform="translate(206 440) scale(${s})">${FZ.tag(f)}</g>${T(16, 98, 'Nacht', 'start', 18, 'w')}${T(16, 308, 'Tag', 'start', 18)}${T(200, 476, f.tt, 'middle', 17, 'w')}`;
  const bg = '<rect width="400" height="500" fill="#f3ead2"/>';
  const reiheH = id => { const d = alt(id); const keys = Object.keys(d.phasen.reduce((m, ph) => { (ph.an || []).forEach(k => m[k] = 1); return m; }, {})); return keys; };
  ['lichtertafel', 'fischer'].forEach(id => { const d = alt(id); if (!d) return; const keys = ['motor', 'segler', 'schlepper', 'trawler', 'fischer', 'tiefgang', 'unf', 'beh', 'anker', 'grund'].filter(k => d.phasen.some(ph => (ph.an || []).includes(k)));
    neu(id, {bg, obj: Object.fromEntries(keys.map(k => [k, paarH(FZ.F[k])])), start: Object.fromEntries(keys.map((k, i) => [k, {o: i ? 0 : 1}]))}); });
  const F = FZ.F;
  neu('manunf', {bg, obj: {unf: paarH(F.unf), beh: paarH(F.beh),
      bag: `${tagF(72, 206)}${nachtF(284, 206)}<g transform="translate(200 228) scale(.95)">${B.seite(200, [[-40, 70], [40, 70]], '#6b5a2e')}${B.ball(-40, -86)}${B.ball(-40, -68)}${B.rhombus(40, -88)}${B.rhombus(40, -64)}</g>
        <g transform="translate(200 440) scale(.95)"><g opacity=".28">${B.seite(200, [[-40, 70], [40, 70], [0, 84]], '#8c99a6')}</g>${B.licht(-40, -84, '#ff4a3d', 5)}${B.licht(-40, -68, '#ff4a3d', 5)}${B.licht(40, -84, '#2ee06a', 5)}${B.licht(40, -68, '#2ee06a', 5)}${B.licht(0, -102, '#ff4a3d', 5)}${B.licht(0, -88, LFw, 5)}${B.licht(0, -74, '#ff4a3d', 5)}</g>
        ${T(90, 100, 'Bälle: hier nicht', 'middle', 16, 'r')}${T(310, 100, 'Rhomben: hier vorbei', 'middle', 16, 'gr')}${T(90, 312, 'zwei Rot: nicht', 'middle', 16, 'w')}${T(310, 312, 'zwei Grün: vorbei', 'middle', 16, 'w')}${T(16, 268, 'Tag', 'start', 16)}${T(16, 480, 'Nacht', 'start', 16, 'w')}`},
    start: {beh: {o: 0}, bag: {o: 0}}});
  neu('anker', {bg, obj: {a: paarH(F.anker),
      g50: `${nachtF()}${tagF()}<g transform="translate(200 234) scale(1.1)"><g opacity=".28">${B.seite(260, [[96, 70], [-96, 40]], '#8c99a6')}</g>${B.licht(96, -88, LFw, 5)}${B.licht(-96, -58, LFw, 5)}</g><g transform="translate(200 440) scale(1.1)">${B.seite(260, [[96, 70], [-96, 40]])}${B.ball(96, -84)}</g>
        ${T(16, 98, 'Nacht', 'start', 18, 'w')}${T(16, 308, 'Tag', 'start', 18)}${T(200, 126, 'vorn höher, achtern niedriger', 'middle', 17, 'w')}${T(200, 476, 'ein Ball', 'middle', 17, 'w')}`,
      gr: paarH(F.grund)}, start: {g50: {o: 0}, gr: {o: 0}}});
  /* Schleppverband: oben Nacht mit Schlepper, Leine und Anhang, unten Tag mit Rhombus */
  neu('schlepp', {bg, obj: {nacht: `${nachtF(72, 220)}${Array.from({length: 18}, (_, i) => `<circle cx="${(i * 89) % 390 + 5}" cy="${90 + (i * 37) % 110}" r="1" fill="#fff" opacity=".6"/>`).join('')}${T(16, 98, 'Nacht', 'start', 18, 'w')}`,
      zug: `<g transform="scale(1.05)">${FZ.nacht(F.schlepper)}</g>`, anh: `<g transform="scale(.95)"><g opacity=".28">${B.seite(120, [], '#8c99a6', false)}</g>${B.licht(48, -22, '#2ee06a', 5)}${B.licht(-58, -20, LFw, 4)}</g>`,
      leine: '<path d="M-140 0 Q-70 18 0 0" stroke="#c9c9c9" stroke-width="2.5" fill="none" opacity=".7"/>', drei: B.licht(0, 0, LFw, 5),
      warn: T(200, 140, 'nie dazwischen durchfahren!', 'middle', 18, 'w'),
      leg: `<rect x="14" y="304" width="372" height="176" rx="16" fill="#fff8ea" stroke="#d9c39a" stroke-width="2"/><g transform="translate(70 360)"><rect x="-20" y="-34" width="40" height="68" rx="10" fill="#142033"/>${B.licht(0, -12, LFw, 6)}${B.licht(0, 12, LFw, 6)}</g>${T(110, 366, 'zwei Topplichter: bis 200 m', 'start', 18)}<g transform="translate(70 438)"><rect x="-20" y="-40" width="40" height="80" rx="10" fill="#142033"/>${B.licht(0, -22, LFw, 6)}${B.licht(0, 0, LFw, 6)}${B.licht(0, 22, LFw, 6)}</g>${T(110, 444, 'drei: Schleppe über 200 m', 'start', 18)}`,
      tag: `${tagF(298, 192)}${T(16, 322, 'Tag', 'start', 18)}<g transform="translate(270 440) scale(.75)">${B.seite(120, [[25, 60]])}${B.rhombus(25, -60)}</g><g transform="translate(90 440) scale(.7)">${B.seite(120, [[0, 40]], '#4a4f57', false)}${B.rhombus(0, -42)}</g><path d="M182 440 Q160 452 132 440" stroke="#555" stroke-width="2" fill="none"/>${T(200, 478, 'Schleppe über 200 m: Rhombus', 'middle', 17, 'w')}`},
    start: {nacht: {}, zug: {x: 300, y: 250}, anh: {x: 80, y: 250}, leine: {x: 236, y: 246}, drei: {x: 326, y: 153, o: 0}, warn: {o: 0}, tag: {o: 0}, leg: {}},
    ph: {1: {an: ['drei', 'warn']}, 2: {an: ['tag'], aus: ['leg']}}});
})();

/* ---------- Hintergründe im Hochformat ---------- */
const LF = A.hilfe.LF || {w: '#fff7d6', r: '#ff4a3d', g: '#3ddc6a', y: '#ffc93d'};
const tagH = (see = 330) => `<rect width="400" height="${see}" fill="#bfe0f2"/><rect y="${see}" width="400" height="${500 - see}" fill="#4d93bd"/>${Array.from({length: 9}, (_, i) => `<path d="M${(i * 83) % 360 + 10} ${see + 26 + (i * 41) % Math.max(20, 480 - see - 26)} q8 -5 16 0 t16 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`).join('')}`;
const nachtH = (see = 330) => `<rect width="400" height="${see}" fill="#142033"/><rect y="${see}" width="400" height="${500 - see}" fill="#0b1726"/>${Array.from({length: 24}, (_, i) => `<circle cx="${(i * 83) % 390 + 5}" cy="${(i * 37) % Math.max(40, see - 60) + 50}" r="${i % 3 ? .9 : 1.4}" fill="#fff" opacity=".55"/>`).join('')}`;
const nebelH = (op = .62) => `<rect width="400" height="500" fill="#e8edf0" opacity="${op}"/>`;
const welleH = (n = 3, r0 = 16, d = 20) => Array.from({length: n}, (_, i) => `<circle r="${r0 + i * d}" fill="none" stroke="#fff" stroke-width="3" opacity="${.85 - i * .22}"/>`).join('');
const zeilen = (x, y, arr, a = 'middle', sz = 18, cls = '', dy = 24) => arr.map((t, i) => T(x, y + i * dy, t, a, sz, cls)).join('');

/* ---------- A6 Nebel und Glocke ---------- */
neu('nebel', {bg: wasser(500, '#7fa9c0'), obj: {sektor: '<path d="M0 0 L-250 0 A250 250 0 0 1 250 0 Z" fill="#f2c200" opacity=".22"/><path d="M-200 0 H200" stroke="#f2c200" stroke-width="3" stroke-dasharray="8 6"/>' + T(150, -8, 'querab', 'middle', 15),
    fremd: `<g transform="scale(1.3)">${B.schiff(90, 20)}</g>`, ton: welleH(), neb: nebelH(.7), wir: BO.oben({lichter: true}), aus: T(0, 0, '👀 Ausguck', 'middle', 18), sig: T(0, 0, '▬  alle 2 Minuten', 'middle', 20)},
  start: {wir: {x: 200, y: 400, s: 1.1}, sektor: {x: 200, y: 400, o: 0}, fremd: {x: 240, y: 130, r: 180, o: 0}, ton: {x: 240, y: 130, o: 0}, aus: {x: 200, y: 318, o: 0}, neb: {}, sig: {x: 200, y: 476, o: 0}},
  ph: {4: {k: {neb: {o: .35}, fremd: {x: 320, y: 230}}}},
  fx(s, tp) { const t = q(s, '[data-o="ton"]'); if (t) t.setAttribute('transform', t.getAttribute('transform').replace(/scale\([^)]*\)/, `scale(${(.6 + (tp % 1.6) / 1.6).toFixed(2)})`)); }});
neu('glocke', {bg: tagH(330) + nebelH(.5), obj: {schiff: `<g transform="scale(1.4)">${B.seite(220, [[80, 60]], '#4a4f57')}</g>`, glocke: `<g transform="scale(1.6)"><path d="M-10 6 Q-10 -14 0 -14 Q10 -14 10 6 Z" fill="#c9a227" stroke="#7a6014"/><circle cy="9" r="3" fill="#7a6014"/></g>`,
    gong: '<circle r="15" fill="#b08d57" stroke="#6b5332" stroke-width="3"/>', w1: welleH(2), w2: welleH(2), uhr: T(0, 0, '', 'middle', 19), grund: `<g transform="scale(1.4)">${B.ball(-40, -60)}${B.ball(-40, -44)}${B.ball(-40, -28)}</g>`},
  start: {schiff: {x: 200, y: 340}, glocke: {x: 312, y: 240}, gong: {x: 74, y: 284, o: 0}, w1: {x: 312, y: 236, o: 0}, w2: {x: 74, y: 284, o: 0}, uhr: {x: 200, y: 120}, grund: {x: 200, y: 340, o: 0}},
  enter(s, p) { q(s, '[data-o="uhr"] text').textContent = ['jede Minute etwa 5 s Glocke vorn', 'ab 100 m: dazu Gong achtern', 'zusätzlich erlaubt: ● ▬ ●', 'auf Grund: 3 Schläge, läuten, 3 Schläge'][p] || ''; fit(q(s, '[data-o="uhr"] text')); },
  fx(s, tp) { const sw = Math.sin(tp * 12) * (tp % 4 < 2 ? 18 : 0), gl = q(s, '[data-o="glocke"] path'); if (gl) gl.setAttribute('transform', `rotate(${sw.toFixed(1)} 0 -14)`);
    if (tp % 2 < .05 && typeof AUD !== 'undefined' && AUD.sfx && document.getElementById('anstage')) try { AUD.sfx('glocke', {vol: .25, dur: .8}); } catch (e) {} }});

/* ---------- A7 Zeichen, Tonnen, Feuer, Tafeln ---------- */
neu('lateral', {bg: wasser(500) + ufer('M0 0 H140 Q100 150 122 300 Q106 420 92 500 H0Z') + ufer('M400 0 H262 Q302 160 286 300 Q300 420 312 500 H400Z'),
  obj: Object.assign({wir: BO.oben({}), mitte: `${B.tonne('mitte')}${T(26, -14, 'Ansteuerung', 'start', 15)}`, pf: B.pfeil(0, 0, 0, -70, '#fff', 5) + T(0, 22, 'von See', 'middle', 15),
      lab: T(0, 0, 'Backbord: rot, gerade Nummern', 'middle', 17, 'r') + T(0, 24, 'Steuerbord: grün, ungerade', 'middle', 17, 'gr')},
    Object.fromEntries([0, 1, 2].flatMap(i => [[`r${i}`, B.tonne('rot', {nr: [2, 4, 6][i]})], [`g${i}`, B.tonne('gruen', {nr: [1, 3, 5][i]})]]))),
  start: Object.assign({wir: {x: 215, y: 478, s: .62}, mitte: {x: 160, y: 452, o: 0}, pf: {x: 352, y: 470, o: 0}, lab: {x: 200, y: 70, o: 0}}, Object.fromEntries([0, 1, 2].flatMap(i => [[`r${i}`, {x: 150, y: 400 - i * 120, o: 0}], [`g${i}`, {x: 256, y: 400 - i * 120, o: 0}]]))),
  ph: {0: {k: {wir: {y: 440, x: 228}}}, 2: {k: {wir: {x: 236, y: 130}}}, 3: {k: {wir: {x: 172, y: 420, r: 180}}}}});
(() => { const MU = {F: [[1, 0]], Fl: [[.4, 3.6]], LFl: [[2, 6]], Q: [[.55, .55]], Oc: [[3, 1]], Iso: [[2, 2]], 'Fl(2)': [[.4, .7], [.4, 3.5]]};
  const an = (m, t) => { const ps = MU[m], per = ps.reduce((a, [x, y]) => a + x + y, 0); let x = t % per; for (const [a, b] of ps) { if (x < a) return true; x -= a; if (x < b) return false; x -= b; } return false; };
  const NA = [['F', 'Festfeuer'], ['Fl', 'Blitz'], ['LFl', 'Blink'], ['Q', 'Funkel'], ['Oc', 'Unterbrochen'], ['Iso', 'Gleichtakt'], ['Fl(2)', 'Blitzgruppe']], Y = i => 84 + i * 56, X0 = 196, SPAN = 12, PX = 180 / SPAN;
  const balken = m => { let out = '', st = null; for (let t = 0; t <= SPAN + .001; t += .05) { const o = t < SPAN && an(m, t); if (o && st === null) st = t; if (!o && st !== null) { out += `<rect x="${(X0 + st * PX).toFixed(1)}" y="-7" width="${Math.max(1.5, (t - st) * PX).toFixed(1)}" height="14" rx="2" fill="#fff7d6"/>`; st = null; } } return out; };
  neu('kennung', {bg: nachtH(500) + NA.map(([m, n], i) => `<g transform="translate(0 ${Y(i)})"><circle class="lp" data-m="${m}" cx="40" cy="0" r="12" fill="#fff7d6"/>${T(64, -3, n, 'start', 17, 'w')}${T(64, 16, m, 'start', 14, 'w')}<rect x="${X0}" y="-9" width="180" height="18" rx="4" fill="#26354c"/>${balken(m)}</g>`).join('') + `<path class="kcur" d="M${X0} 60 V${Y(6) + 20}" stroke="#f08a1c" stroke-width="2.5"/>${T(X0 + 90, Y(6) + 42, '12 Sekunden', 'middle', 14, 'w')}`,
    obj: {rahmen: '<rect x="-190" y="-26" width="380" height="52" rx="12" fill="none" stroke="#f2c200" stroke-width="3"/>', rahmen2: '<rect x="-190" y="-26" width="380" height="52" rx="12" fill="none" stroke="#f2c200" stroke-width="3"/>'},
    start: {rahmen: {x: 200, y: Y(0)}, rahmen2: {x: 200, y: Y(1), o: 0}},
    ph: {0: {an: ['rahmen2'], k: {rahmen: {y: Y(0)}}}, 1: {aus: ['rahmen2'], k: {rahmen: {y: Y(2)}}}, 2: {k: {rahmen: {y: Y(3)}}}, 3: {k: {rahmen: {y: Y(4)}}}, 4: {k: {rahmen: {y: Y(5)}}}, 5: {k: {rahmen: {y: Y(6)}}}},
    fx(s, tp) { qa(s, '.lp').forEach(e => { const o = an(e.dataset.m, tp); e.setAttribute('opacity', o ? 1 : .1); e.setAttribute('r', o ? 12 : 9); }); const c = q(s, '.kcur'); if (c) c.setAttribute('transform', `translate(${((tp % SPAN) * PX).toFixed(1)} 0)`); }});
})();
neu('sonderzeichen', {bg: tagH(400), obj: {e: `<g transform="scale(2.2)">${B.tonne('einzel')}</g>`, ge: `<g transform="scale(2.2)">${B.tonne('gelb')}</g>`, mi: `<g transform="scale(2.2)">${B.tonne('mitte')}</g>`,
    te: zeilen(0, 0, ['Einzelgefahr:', 'rundum befahrbar', 'Blitzgruppe 2'], 'middle', 20), tg: zeilen(0, 0, ['Sonderzeichen gelb:', 'Sperr- oder Sondergebiet'], 'middle', 20), tm: zeilen(0, 0, ['Mitte, Ansteuerung:', 'rundum freies Wasser'], 'middle', 20)},
  start: {e: {x: 80, y: 410, o: 0}, ge: {x: 200, y: 410, o: 0}, mi: {x: 320, y: 410, o: 0}, te: {x: 200, y: 110, o: 0}, tg: {x: 200, y: 110, o: 0}, tm: {x: 200, y: 110, o: 0}}});
neu('sektorenfeuer', {bg: nachtH(500), obj: {leit: `<path d="M0 0 L-97 420 L-36 420Z" fill="#ff4a3d" opacity=".35"/><path d="M0 0 L-36 420 L36 420Z" fill="#fff7d6" opacity=".4"/><path d="M0 0 L36 420 L97 420Z" fill="#3ddc6a" opacity=".35"/>${B.licht(0, 0, LF.w, 8)}`, wir: BO.oben({lichter: true, nacht: true}),
    unter: B.licht(0, 0, LF.w, 7), ober: B.licht(0, 0, LF.w, 7), linie: '<path d="M0 0 V400" stroke="#fff" stroke-width="2" stroke-dasharray="6 5" opacity=".7"/>',
    quer: `<path d="M0 0 L380 -40 L380 40Z" fill="#fff7d6" opacity=".35"/>${B.licht(0, 0, LF.w, 8)}`, tq: T(0, 0, 'Quermarke: hier Kurs ändern', 'middle', 17, 'w')},
  start: {leit: {x: 200, y: 60}, wir: {x: 192, y: 440, s: .55}, unter: {x: 200, y: 96, o: 0}, ober: {x: 200, y: 66, o: 0}, linie: {x: 200, y: 80, o: 0}, quer: {x: 16, y: 260, o: 0}, tq: {x: 220, y: 210, o: 0}},
  ph: {0: {k: {wir: {y: 360}}}, 1: {k: {wir: {x: 148, y: 404}}}, 2: {k: {wir: {x: 200, y: 400}}}, 3: {k: {wir: {x: 200, y: 268}}}}});
(() => { const tafel = (rand, voll, sym, schraeg) => `<rect x="-34" y="-34" width="68" height="68" rx="4" fill="${voll}" stroke="${rand}" stroke-width="7"/>${sym}${schraeg ? '<path d="M-30 30 L30 -30" stroke="#c9302c" stroke-width="7"/>' : ''}`;
  const zwei = '<path d="M-18 14 l6 -24 l6 24z M6 14 l6 -24 l6 24z" fill="#222"/>';
  neu('tafeln', {bg: '<rect width="400" height="500" fill="#dfe9d6"/>', obj: {v: `<g transform="scale(1.5)">${tafel('#c9302c', '#fff', zwei, true)}</g>`, gb: `<g transform="scale(1.5)">${tafel('#c9302c', '#fff', '<path d="M-14 -8 h10 l12 -10 v36 l-12 -10 h-10z" fill="#222"/><path d="M14 -10 q8 10 0 20" stroke="#222" stroke-width="3" fill="none"/>', false)}</g>`,
      hi: `<g transform="scale(1.5)">${tafel('#1f5f99', '#1f5f99', '<text x="0" y="16" font-size="44" text-anchor="middle" fill="#fff" font-weight="900">P</text>', false)}</g>`,
      tv: zeilen(0, 0, ['Verbot:', 'rot mit Balken'], 'start', 20), tgb: zeilen(0, 0, ['Gebot:', 'rot ohne Balken'], 'start', 20), thi: zeilen(0, 0, ['Hinweis:', 'blau'], 'start', 20)},
    start: {v: {x: 100, y: 130, o: 0}, gb: {x: 100, y: 265, o: 0}, hi: {x: 100, y: 400, o: 0}, tv: {x: 180, y: 124, o: 0}, tgb: {x: 180, y: 259, o: 0}, thi: {x: 180, y: 394, o: 0}}});
})();
(() => { const DB = 150, PM = 40;   /* Unterkante der Brücke, Pixel je Meter */
  neu('bruecke', {bg: '<rect width="400" height="500" fill="#bfe0f2"/><rect x="0" y="116" width="400" height="34" fill="#8a8f95"/><rect x="40" y="150" width="26" height="350" fill="#8a8f95"/><rect x="334" y="150" width="26" height="350" fill="#8a8f95"/>',
    obj: {wasser: '<rect x="-400" y="0" width="800" height="400" fill="#4d93bd"/>', boot: `<g transform="scale(1.33)">${B.seite(90, [[0, 70]], '#fbf8f2', false)}<rect x="-14" y="-30" width="30" height="14" fill="#cfd6db"/></g>`, mass: '<path d="M0 0 V-1" stroke="#fff" stroke-width="2.5"/>' + T(8, 0, '', 'start', 17),
      rot: B.licht(0, 0, LF.r, 7) + B.licht(0, 18, LF.r, 7), gruen: B.licht(0, 0, LF.g, 7)},
    start: {wasser: {x: 200, y: DB + 4.8 * PM}, boot: {x: 200, y: DB + 4.8 * PM}, rot: {x: 200, y: 124, o: 0}, gruen: {x: 200, y: 133, o: 0}},
    ph: {1: {k: {wasser: {y: DB + 2.8 * PM}, boot: {y: DB + 2.8 * PM}}}, 3: {k: {boot: {x: 520}}}},
    fx(s, tp, p, st, c) { const w = c.wasser.y, m = q(s, '[data-o="mass"]'); if (!m) return; m.setAttribute('transform', `translate(300 ${w})`); m.querySelector('path').setAttribute('d', `M0 0 V${DB - w}`); const t = m.querySelector('text'); t.setAttribute('y', (DB - w) / 2); t.textContent = `${((w - DB) / PM).toFixed(1).replace('.', ',')} m frei`; }});
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
