/* ==========================================================================
   Skipper – Filmbühne der Hörreise (E27, GL9; Regeln docs/film-regeln.md; Vorbild docs/entwuerfe/glasebenen-kamera.html)
   Glasebenen nach Juri Norstein: jede Szene besteht aus Ebenen mit Tiefe d (0 fern … 1 nah). Die Kamera zoomt mit Parallaxe,
   Unschärfe nach Abstand zur Schärfeebene, Luftperspektive. Nachgeladen vom Player (kurs.js, Aussehen „f“).
   Skript-Marken (kurs.js zerlegt sie):
     [[ORT: tankstelle | becken | kluever | ausfahrt, übergang]]   neuer Ort (Bühnenbild)
     [[KAMERA: blick, einstellung, übergang]]                       blick: seite | heck | schnitt | oben
     [[TU: p=.3/2800, a=.6/3000, motor=1]]                         Werte der Szene weich ändern (Wert/Dauer in ms)
     [[VERTIGO]]                                                    Hitchcock-Zoom (FK9)
   API: FILMB.mount(el), .ort(name, ueb, blick), .kamera(blick, einst, ueb), .tu(werte), .sprecher(wer), .einfrieren(an),
        .vertigo(), .medaillon(art), .reset(), .zustand
   ========================================================================== */
(function () {
'use strict';
const reduziert = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 1. Licht: später Vormittag, Sonne im Südosten, weiches Glas (Nutzer 20.11.2026: „weich“) ---------- */
const P = {
  h: ['#9cbccb', '#d5e2e1', '#efe7d1'], w: ['#9db7b4', '#4f7779'], nebel: .3, nebelFarbe: '#f1eee4', sonne: {az: 130, el: .48, farbe: '#fff4d2'},
  rumpf: '#f1ece1', streifen: '#b45a48', unter: '#3d5568', dach: '#c3c9c6', fenster: '#8aa9b4', deck: '#d9cdb2', holz: '#8d6a4a', motor: '#3b3f44',
  haut: '#eec09a', hJacke: '#3d4c63', hBart: '#ece8e0', hMuetze: '#2a3446', sJacke: '#c45a45', sHaar: '#e9bf62', hose: '#40506a',
  hiJacke: '#2f5d7c', hiWeste: '#e08a3c', hiHaar: '#5b3a29', block: '#fffdf5', hrJacke: '#1d2433', hrMuetze: '#f4f1ea', gold: '#d9a93b',
  paul: '#5f7f9c', paulD: '#4a6680', fender: '#f5f1e6', fenderSchrift: '#b45a48',
  haus: ['#b07a5c', '#d8c7a5', '#8fa38a', '#c49a6c', '#a7b6bb'], dachF: '#6e4a3e', hfenster: '#5a6e78', steg: '#8d7259', stegD: '#6c5644', zapf: '#c0463a',
  ferne: '#a9b2a6', ferne2: '#8f9a90', mole: '#8b8676', glanz: '#f4f0e2', moewe: '#f6f3ea', moeweD: '#5a6570', wolke: '#f4efe2', sand: '#c9b88f', tang: '#6f8a5a',
  schilf: '#7d8a52', schilfD: '#55603a', schilfH: '#b8a76a', katze: '#1d1a1a'
};
const mix = (a, b, t) => { const h = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const dunkel = (c, t = .18) => mix(c, '#000000', t), hell = (c, t = .2) => mix(c, '#ffffff', t);
const dreh = (art, wer, px, py) => ` data-dreh="${art}" data-wer="${wer || ''}" data-px="${px}" data-py="${py}"`;

/* ---------- 2. Figuren (Gesicht nach rechts, Füße bei 0,0) ---------- */
function hinnerk() {
  return `<g${dreh('fig', 'HINNERK', 0, 0)}><path d="M-8 0 V-20 M7 0 V-20" stroke="${P.hose}" stroke-width="7.5" stroke-linecap="round"/>
    <path d="M-15 -17 Q-18 -44 -5 -49 L6 -49 Q18 -45 15 -17 Z" fill="${P.hJacke}"/>
    <g${dreh('arm-h', '', 8, -42)}><path d="M8 -42 Q17 -34 20 -24" stroke="${P.hJacke}" stroke-width="7.5" stroke-linecap="round" fill="none"/><circle cx="20" cy="-23" r="3.8" fill="${P.haut}"/></g>
    <circle cx="2" cy="-58" r="9.6" fill="${P.haut}"/><path d="M-6.5 -57 Q-7.5 -44 3 -43 Q12.5 -44 12.5 -55.5 Q8 -51.5 3.5 -52.5 Q-1 -51.5 -6.5 -57Z" fill="${P.hBart}"/>
    <circle cx="11.6" cy="-59.5" r="2.8" fill="${dunkel(P.haut, .1)}"/><circle cx="6.8" cy="-62" r="1.3" fill="#2a1b12"/>
    <path d="M-9.5 -63 Q-8.5 -72 2 -72.5 Q11.5 -72 12 -63 Z" fill="${P.hMuetze}"/><path d="M7 -63.6 L18 -62.6 L14 -60.4 L6 -61Z" fill="#141a26"/>
    <path d="M10 -51.5 L18 -50.5" stroke="#6b3d1f" stroke-width="2.2"/><rect x="16.4" y="-56" width="4.4" height="5.6" rx="1.2" fill="#6b3d1f"/></g>`;
}
function smilla() {
  return `<g${dreh('fig', 'SMILLA', 0, 0)}><path d="M-4.5 0 V-19 M4 0 V-19" stroke="${P.hose}" stroke-width="5.6" stroke-linecap="round"/>
    <path d="M-8.5 -17 Q-10.5 -40 -3 -44 L4 -44 Q10.5 -40 8.5 -17Z" fill="${P.sJacke}"/>
    <g${dreh('arm-s', 'SMILLA', 5, -38)}><path d="M5 -38 Q12 -31 14 -23" stroke="${P.sJacke}" stroke-width="5.6" stroke-linecap="round" fill="none"/><circle cx="14" cy="-22" r="3" fill="${P.haut}"/></g>
    <g${dreh('zopf', '', -6, -56)}><path d="M-6 -57 Q-17 -55 -16 -43 Q-11.5 -49 -5.5 -52Z" fill="${P.sHaar}"/></g><circle cx="1" cy="-52" r="8.2" fill="${P.haut}"/>
    <path d="M8.6 -53.5 L11 -51 L8.6 -49.8Z" fill="${P.haut}"/><path d="M-7.5 -53 Q-8 -62.5 1 -62 Q8.6 -61.6 8.8 -56 Q4 -58.5 -1 -57.4 Q-4.5 -55 -7.5 -49Z" fill="${P.sHaar}"/>
    <circle cx="5.2" cy="-53.8" r="1.15" fill="#2a1b12"/></g>`;
}
function hilke() {
  return `<g${dreh('fig', 'HAFENMEISTER', 0, 0)}><path d="M-7 0 V-19 M6 0 V-19" stroke="${P.hose}" stroke-width="7.2" stroke-linecap="round"/>
    <path d="M-14.5 -17 Q-17 -43 -4 -48 L5 -48 Q17 -43 14.5 -17Z" fill="${P.hiJacke}"/><path d="M-12 -19 Q-13.5 -40 -3 -45 L4 -45 Q13.5 -40 12 -19Z" fill="${P.hiWeste}"/>
    <path d="M-12.5 -29 H12.5" stroke="${P.glanz}" stroke-width="2.4" opacity=".85"/>
    <g${dreh('arm-hi', '', 8, -40)}><path d="M8 -40 Q15 -33 18 -26" stroke="${P.hiWeste}" stroke-width="7" stroke-linecap="round" fill="none"/>
      <rect x="14" y="-36" width="11" height="14" rx="1" fill="${P.block}" transform="rotate(-8 19 -29)"/><circle cx="18" cy="-25" r="3.4" fill="${P.haut}"/></g>
    <circle cx="-6.5" cy="-63" r="5.4" fill="${P.hiHaar}"/><circle cx="1" cy="-56" r="9.2" fill="${P.haut}"/>
    <path d="M-8.4 -54 Q-9 -65.5 1 -65.5 Q9.6 -65 9.8 -58 Q4 -61 -2 -59.5 Q-6 -57 -8.4 -51Z" fill="${P.hiHaar}"/><path d="M9.7 -57.5 L12.6 -54.5 L9.7 -53Z" fill="${P.haut}"/>
    <circle cx="5.6" cy="-57.6" r="1.25" fill="#2a1b12"/></g>`;
}
function ruecken() {
  return `<g${dreh('fig', 'HINNERK', 0, 0)}><path d="M-17 10 Q-19 -24 -6 -30 L6 -30 Q19 -24 17 10Z" fill="${P.hJacke}"/><path d="M12 -22 Q22 -12 28 -4" stroke="${P.hJacke}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="-40" r="10" fill="${P.haut}"/><path d="M-10.5 -43 Q-10 -53 0 -53.5 Q10 -53 10.5 -43 Q0 -46 -10.5 -43Z" fill="${P.hMuetze}"/></g>`;
}
function kopfVorn(c, haar, wer) {
  return `<g${dreh('fig', wer || '', 0, 0)}><path d="M-11 12 Q-11 -2 0 -4 Q11 -2 11 12Z" fill="${c}"/><circle cx="0" cy="-12" r="8" fill="${P.haut}"/><path d="M-8 -12 Q-8.4 -21 0 -21 Q8.4 -21 8.2 -12 Q4 -16.5 0 -16 Q-4 -16.5 -8 -12Z" fill="${haar}"/>
    <circle cx="-3" cy="-11" r="1" fill="#2a1b12"/><circle cx="3" cy="-11" r="1" fill="#2a1b12"/></g>`;
}
function harmsBuste() {
  return `<g><path d="M8 120 Q12 84 48 76 L76 76 Q110 84 114 120Z" fill="${P.hrJacke}"/><circle cx="61" cy="96" r="2.6" fill="${P.gold}"/><circle cx="61" cy="108" r="2.6" fill="${P.gold}"/>
    <ellipse cx="62" cy="52" rx="22" ry="25" fill="${P.haut}"/><path d="M42 34 L33 49 L42 52Z" fill="${P.haut}"/>
    <path d="M41 56 Q43 80 63 82 Q81 80 84 58 Q75 67 62 66 Q50 66 41 56Z" fill="${P.hBart}"/><path d="M40 37 L57 33" stroke="#2a1b12" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="48" cy="42" r="2.2" fill="#2a1b12"/><path d="M45 63 L55 62" stroke="#2a1b12" stroke-width="1.8"/>
    <path d="M34 30 Q36 7 64 5 Q93 7 92 30Z" fill="${P.hrMuetze}"/><rect x="34" y="25" width="58" height="9" fill="#141a26"/><path d="M30 32 L60 32 L52 40 L25 38Z" fill="#141a26"/><circle cx="50" cy="29.5" r="4.2" fill="${P.gold}"/></g>`;
}
function katze() {
  return `<g><g${dreh('schwanz', '', -8, -4)}><path d="M-8 -4 Q-20 -5 -17 -20" stroke="${P.katze}" stroke-width="3.4" stroke-linecap="round" fill="none"/></g>
    <ellipse cx="0" cy="-7" rx="9.5" ry="7.2" fill="${P.katze}"/><circle cx="8" cy="-15" r="5.6" fill="${P.katze}"/><path d="M4.5 -19 L5.5 -25 L9 -20.5Z M9 -20.5 L12.6 -25 L12.8 -18.5Z" fill="${P.katze}"/><circle cx="10.4" cy="-15.6" r="1.1" fill="#f0d060"/></g>`;
}

/* ---------- 3. Die Frieda aus allen Richtungen ---------- */
function friedaSeite(id) {
  const hull = `<path d="M-80 -6 L66 -6 Q76 -8 82 -24 L80 -26 L-78 -26 L-80 -24Z" fill="${P.rumpf}"/>
    <path d="M-80 -6 L66 -6 Q72 -6 74 -10 L70 6 Q62 12 40 12 L-74 10 L-80 4Z" fill="${P.unter}"/><path d="M-79 -14 L78 -14" stroke="${P.streifen}" stroke-width="3.5"/>
    <path d="M-46 -26 L-44 -52 L18 -52 L34 -26Z" fill="${P.rumpf}"/><path d="M-44 -52 L18 -52 L20 -56 L-42 -56Z" fill="${P.dach}"/>
    <path d="M20 -50 L31 -29 L22 -29 L13 -50Z" fill="${P.fenster}"/>${[-34, -18, -2].map(x => `<circle cx="${x}" cy="-39" r="4.6" fill="${P.fenster}"/>`).join('')}
    <path d="M40 -26 V-36 H78 L80 -26" fill="none" stroke="${P.motor}" stroke-width="1.4"/>
    <rect x="-92" y="-34" width="12" height="18" rx="3" fill="${P.motor}"/><rect x="-88" y="-16" width="4" height="26" fill="${P.motor}"/><path d="M-86 -27 L-62 -33" stroke="${P.motor}" stroke-width="2.6"/>`;
  return `<g id="${id}"><g class="fb-bob">
    <g id="${id}-blasen" opacity="0">${[0, 1, 2, 3].map(i => `<circle class="fb-blase" data-i="${i}" cx="90" cy="6" r="2.4" fill="${P.glanz}" opacity=".8"/>`).join('')}</g>
    <g transform="translate(66 -14) scale(.56) scale(-1 1)">${hinnerk()}</g>
    <g transform="scale(-1 1)">${hull}</g>
    <path d="M36 -56 V-78" stroke="${P.motor}" stroke-width="1.6"/><rect x="34" y="-82" width="4" height="4" fill="${P.motor}"/>
    <text x="-30" y="-17.2" font-family="Baloo 2,Trebuchet MS,sans-serif" font-weight="800" font-size="7" letter-spacing=".6" fill="#1f3b63">FRIEDA</text>
    <g transform="translate(-60 -26) scale(.52)">${smilla()}</g><g transform="translate(4 -56) scale(.44)">${katze()}</g>
    <g id="${id}-gischt" opacity="0"><path d="M-84 10 Q-96 4 -108 10 Q-96 8 -88 14Z" fill="${P.glanz}"/><path d="M-100 8 q-6 -5 -12 0" stroke="${P.glanz}" stroke-width="1.6" fill="none"/></g>
  </g></g>`;
}
function friedaHeck(id) {
  return `<g id="${id}"><g class="fb-bob">
    <path d="M0 -72 V-92" stroke="${P.motor}" stroke-width="1.6"/><rect x="-2" y="-96" width="4" height="4" fill="${P.motor}"/>
    <path d="M-34 -40 L-30 -68 L30 -68 L34 -40Z" fill="${P.rumpf}"/><path d="M-31 -66 L31 -66 L33 -72 L-33 -72Z" fill="${P.dach}"/>
    <rect x="-9" y="-62" width="18" height="22" rx="2" fill="${P.holz}"/><g transform="translate(23 -66) scale(.5)">${kopfVorn(P.sJacke, P.sHaar, 'SMILLA')}</g>
    <path d="M-62 -40 L62 -40 L56 0 Q30 15 0 17 Q-30 15 -56 0 Z" fill="${P.rumpf}"/><path d="M-60.5 -30 L60.5 -30 L59.6 -24.5 L-59.6 -24.5Z" fill="${P.streifen}"/>
    <path d="M-56 0 Q-30 15 0 17 Q30 15 56 0 L54.6 8 Q30 22 0 24 Q-30 22 -54.6 8Z" fill="${P.unter}"/>
    <text x="0" y="-9" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="12" letter-spacing="1" fill="#1f3b63">FRIEDA</text>
    <text x="0" y="-1.5" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="5.2" letter-spacing="1.2" fill="#1f3b63">KUTTERSHAVEN</text>
    ${[-50, -36].map(y => `<ellipse cx="64" cy="${y + 22}" rx="5" ry="9" fill="${P.fender}" stroke="${dunkel(P.rumpf, .2)}" stroke-width=".8"/>`).join('')}
    <g transform="translate(-26 -34) scale(.62)">${ruecken()}</g>
    <rect x="-10" y="-60" width="20" height="24" rx="5" fill="${P.motor}"/><rect x="-3.5" y="-37" width="7" height="44" fill="${P.motor}"/>
    <g id="${id}-blasen" opacity="0">${[0, 1, 2, 3].map(i => `<circle class="fb-blase" data-i="${i}" cx="0" cy="8" r="3" fill="${P.glanz}" opacity=".8"/>`).join('')}</g>
  </g></g>`;
}
function friedaD34H() {
  const sch = dunkel(P.rumpf, .12);
  return `<g class="fb-bob"><path d="M12 -56 V-78" stroke="${P.motor}" stroke-width="1.6"/>
    <path d="M-84 -22 Q-50 -27 26 -30 L26 -6 Q-30 2 -78 -8 Z" fill="${P.rumpf}"/><path d="M-78 -8 Q-30 2 26 -6 L26 6 Q-20 12 -70 0Z" fill="${P.unter}"/>
    <path d="M-82 -16 Q-40 -19 26 -20" stroke="${P.streifen}" stroke-width="3"/><path d="M26 -30 L66 -27 L62 -3 Q46 5 26 -6Z" fill="${sch}"/><path d="M26 -20 L65 -18" stroke="${P.streifen}" stroke-width="3"/>
    <path d="M26 -6 Q46 5 62 -3 L60 4 Q44 11 26 6Z" fill="${P.unter}"/><path d="M-44 -26 L-42 -52 L10 -54 L22 -28Z" fill="${P.rumpf}"/><path d="M10 -54 L24 -52 L32 -28 L22 -28Z" fill="${sch}"/>
    <path d="M-43 -52 L10 -54 L24 -52 L20 -57 L6 -58 L-41 -56Z" fill="${P.dach}"/>${[-30, -14].map(x => `<circle cx="${x}" cy="-40" r="4" fill="${P.fenster}"/>`).join('')}
    <g transform="translate(-62 -24) scale(.42)">${smilla()}</g><g transform="translate(34 -28) scale(.5)">${ruecken()}</g>
    <rect x="40" y="-46" width="12" height="18" rx="4" fill="${P.motor}"/><rect x="44" y="-30" width="4" height="36" fill="${P.motor}"/></g>`;
}
const RUMPF_OBEN = 'M0 -50 C17 -36 20 -6 19 22 L18 46 Q18 50 14 50 L-14 50 Q-18 50 -18 46 L-19 22 C-20 -6 -17 -36 0 -50Z';
/* Draufsicht mit Höhenschichten (Nutzer 20.11.2026: „das Boot muss Tiefenwirkung bekommen, alles Hohe in den Vordergrund“) */
const HS = (h, inner, cx = 200, cy = 300, sk = 1.7) => `<g data-h="${h}" data-cx="${cx}" data-cy="${cy}" data-s="${sk}">${inner}</g>`;
function friedaOben3D() {
  const kab = 'M-11 -4 H11 V20 H-11Z', wand = dunkel(P.rumpf, .2);
  return HS(0, `<path d="${RUMPF_OBEN}" fill="${P.unter}"/>`) + [.07, .14, .21].map((h, i) => HS(h, `<path d="${RUMPF_OBEN}" fill="${dunkel(P.rumpf, .26 - i * .05)}"/>`)).join('') +
    HS(.3, `<rect x="-6" y="48" width="12" height="12" rx="3" fill="${P.motor}"/>`) +
    HS(.28, `<path d="${RUMPF_OBEN}" fill="${P.rumpf}" stroke="${dunkel(P.rumpf, .35)}" stroke-width="1.2"/><path d="M0 -46 C14 -33 16.5 -6 15.5 22 L15 45 M0 -46 C-14 -33 -16.5 -6 -15.5 22 L-15 45" stroke="${P.streifen}" stroke-width="2.2" fill="none"/>
      <path d="M0 -42 C10 -32 12 -14 12 -6 L-12 -6 C-12 -14 -10 -32 0 -42Z" fill="${P.deck}"/><rect x="-13" y="22" width="26" height="22" rx="3" fill="${P.deck}"/>
      ${[-10, 14].map(y => `<ellipse cx="-20.5" cy="${y}" rx="3" ry="5" fill="${P.fender}" stroke="${wand}" stroke-width=".6"/><ellipse cx="20.5" cy="${y}" rx="3" ry="5" fill="${P.fender}" stroke="${wand}" stroke-width=".6"/>`).join('')}`) +
    HS(.4, `<path d="M-10 -34 Q0 -50 10 -34" stroke="${P.motor}" stroke-width="1.2" fill="none"/>`) + [.36, .44, .52].map(h => HS(h, `<path d="${kab}" fill="${wand}"/>`)).join('') +
    HS(.6, `<path d="${kab}" fill="${P.dach}" stroke="${dunkel(P.dach, .25)}" stroke-width=".8"/><path d="M-8 -1 H8 M-8 3 H8" stroke="${hell(P.dach, .25)}" stroke-width="1.2"/>`) +
    HS(.42, `<ellipse cx="0" cy="34" rx="8.5" ry="5.5" fill="${P.hJacke}"/>`) + HS(.58, `<circle cx="0" cy="35" r="5" fill="${P.hMuetze}"/>`) +
    HS(.4, `<ellipse cx="0" cy="-27" rx="6.5" ry="4.5" fill="${P.sJacke}"/>`) + HS(.52, `<circle cx="0" cy="-28" r="4.2" fill="${P.sHaar}"/>`) +
    [.62, .68, .74, .8, .86, .92, .97].map(h => HS(h, `<circle cx="0" cy="14" r="1.5" fill="${P.motor}"/>`)).join('') + HS(1, `<rect x="-1.8" y="12.2" width="3.6" height="3.6" fill="${P.motor}"/>`);
}

/* ---------- 4. Bausteine der Welt ---------- */
function himmel(blickAz) {
  let s = `<rect x="-60" y="-60" width="520" height="640" fill="url(#fb-hg)"/>`;
  const k = P.sonne, rel = ((k.az - blickAz + 540) % 360) - 180;
  if (Math.abs(rel) < 58) { const x = 200 + rel / 58 * 250, y = 260 - k.el * 230; s += `<circle cx="${x}" cy="${y}" r="110" fill="url(#fb-sg)"/><circle cx="${x}" cy="${y}" r="20" fill="${k.farbe}" opacity=".9"/>`; }
  else if (Math.abs(rel) < 140) s += `<circle cx="${rel > 0 ? 470 : -70}" cy="${230 - k.el * 120}" r="230" fill="url(#fb-sg)" opacity=".6"/>`;
  s += [[60, 70, 1], [300, 120, .8], [190, 40, .6], [380, 60, .7]].map(([x, y, sk]) => `<g transform="translate(${x} ${y}) scale(${sk})" data-welle="${sk * 3},0,${x % 4},0"><path d="M-46 0 Q-40 -18 -22 -16 Q-14 -32 6 -27 Q20 -38 32 -22 Q50 -22 48 0Z" fill="${P.wolke}" opacity=".75"/></g>`).join('');
  return s;
}
function streifen(y, amp, per, fill, sp, glanz = true, xa = -140, xb = 600) {
  let k = `M${xa} ${y}`;
  for (let x = xa; x < xb; x += per) k += ` Q${x + per * .25} ${y - amp} ${x + per * .5} ${y} T${x + per} ${y}`;
  return `<g data-welle="${sp},${amp * .35},${y % 7},${per}"><path d="${k} L${xb} ${y + 160} L${xa} ${y + 160}Z" fill="${fill}"/>${glanz ? `<path d="${k}" fill="none" stroke="${P.glanz}" stroke-width="1.4" stroke-dasharray="${per * .25} ${per * .75}" opacity=".7"/>` : ''}</g>`;
}
const nebelband = (x, y, w, h, op) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="url(#fb-ng)" opacity="${(op * P.nebel).toFixed(2)}" data-drift="${3 + (x % 5)},${y % 9}"/>`;
function moewe(x0, y0, x1, y1, dur, ph, s = 1) {
  return `<g data-moewe="${x0},${y0},${x1},${y1},${dur},${ph}"><g transform="scale(${s})"><g class="fb-flug"><path d="M-16 -2 Q-8 -10 0 0 Q8 -10 16 -2 Q8 -5 0 3 Q-8 -5 -16 -2Z" fill="${P.moewe}" stroke="${P.moeweD}" stroke-width=".6"/></g></g></g>`;
}
function haeuser(y, sk, n = 7, x0 = -20, schild = true) {
  let s = '';
  for (let i = 0; i < n; i++) { const w = (30 + (i * 7) % 18) * sk, h = (38 + (i * 13) % 30) * sk, x = x0 + i * 62 * sk, c = P.haus[i % P.haus.length];
    s += `<path d="M${x} ${y} V${y - h * .65} L${x + w / 2} ${y - h} L${x + w} ${y - h * .65} V${y}Z" fill="${c}"/><path d="M${x - 2} ${y - h * .63} L${x + w / 2} ${y - h - 3} L${x + w + 2} ${y - h * .63}" fill="none" stroke="${P.dachF}" stroke-width="${3 * sk}"/>
      <rect x="${x + w * .3}" y="${y - h * .5}" width="${w * .16}" height="${h * .16}" fill="${P.hfenster}"/><rect x="${x + w * .58}" y="${y - h * .5}" width="${w * .16}" height="${h * .16}" fill="${P.hfenster}"/>`; }
  if (schild) s += `<rect x="${x0 + 62 * sk * 4}" y="${y - 50 * sk}" width="${56 * sk}" height="${11 * sk}" fill="${P.rumpf}"/><text x="${x0 + 62 * sk * 4 + 28 * sk}" y="${y - 41.5 * sk}" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="${6.4 * sk}" fill="#1f3b63">HAFENMEISTER</text>`;
  return s;
}
const masten = (y, xs) => xs.map(x => `<path d="M${x} ${y} V${y - 110}" stroke="${P.ferne}" stroke-width="1.8"/><path d="M${x} ${y - 102} L${x + 30} ${y - 4}" stroke="${P.ferne}" stroke-width=".8"/>`).join('');
function zapfsaeule(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-9" y="-36" width="18" height="36" rx="3" fill="${P.zapf}"/><rect x="-6" y="-31" width="12" height="9" rx="1.5" fill="${P.rumpf}"/>
    <path d="M9 -24 Q20 -22 18 -6" fill="none" stroke="${P.motor}" stroke-width="2.4"/><rect x="-10" y="-40" width="20" height="6" rx="2" fill="${P.motor}"/></g>`;
}
function stegSeite(y) {
  let p = '';
  for (let x = 8; x < 420; x += 46) p += `<rect x="${x}" y="${y + 6}" width="7" height="36" fill="${P.stegD}"/>`;
  return p + `<rect x="-60" y="${y - 6}" width="520" height="13" fill="${P.steg}"/>` + [70, 220, 360].map(x => `<rect x="${x}" y="${y - 14}" width="9" height="9" rx="2" fill="${P.stegD}"/>`).join('');
}
function schilf(xa, xb, y, hMin, hMax, n, seed = 1) {
  let s = '';
  for (let i = 0; i < n; i++) { const r = ((i * 9301 + seed * 49297) % 233280) / 233280, x = xa + (xb - xa) * ((i + r * .8) / n), h = hMin + (hMax - hMin) * r, b = (r - .5) * 30;
    s += `<path d="M${x} ${y} Q${x + b * .3} ${y - h * .5} ${x + b} ${y - h}" stroke="${i % 3 ? P.schilf : P.schilfD}" stroke-width="${3 + r * 3}" fill="none" stroke-linecap="round"/>`;
    if (i % 4 === 0) s += `<ellipse cx="${x + b}" cy="${y - h - 6}" rx="3" ry="9" fill="${P.schilfH}" transform="rotate(${b * .6} ${x + b} ${y - h - 6})"/>`; }
  return s;
}
function pfeil(x, y, len, farbe, text, links = true) {
  const d = links ? -1 : 1;
  return `<g><path d="M${x} ${y} h${d * len} m${-d * 10} -8 l${d * 10} 8 l${-d * 10} 8" stroke="${farbe}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${text ? `<text x="${x + d * len / 2}" y="${y - 12}" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="15" fill="${farbe}" stroke="rgba(20,30,35,.55)" stroke-width="3" paint-order="stroke">${text}</text>` : ''}</g>`;
}

/* ---------- 5. Orte (Bühnenbilder) ----------
   Blick „seite“: von Westen auf die Backbordseite, Bug links (Norden). „heck“: von achtern (Süden), Backbord ist links.
   „schnitt“: Lehrbild von achtern, halb unter Wasser (das Bild vom Rad am Grund ergibt nur so Sinn, Nutzer 20.11.2026).
   „oben“: Draufsicht, Norden oben, mit Höhenschichten. */
const ORTE = {
  tankstelle: {
    seite: () => [
      {d: 0, svg: himmel(90)},
      {d: .1, svg: masten(266, [30, 150, 330]) + haeuser(266, .62, 7, -20)},
      {d: .2, svg: nebelband(200, 276, 520, 30, .8)},
      {d: .28, svg: stegSeite(272) + zapfsaeule(118, 266) + `<g id="fs-hilke" transform="translate(150 266)"><g transform="scale(.74)">${hilke()}</g></g>`},
      {d: .36, svg: `<rect x="-60" y="282" width="520" height="300" fill="url(#fb-wg)"/>` + streifen(290, 3, 30, P.w[0], 6) + streifen(308, 4, 40, mix(P.w[0], P.w[1], .35), 9)},
      {d: .45, svg: moewe(-60, 140, 470, 110, 17, 0, .85)},
      {d: .55, svg: `<g id="fs-pos" transform="translate(200 340) scale(1.4)">${friedaSeite('fs-boot')}</g>`},
      {d: .7, svg: streifen(356, 6, 54, mix(P.w[0], P.w[1], .6), 16) + streifen(404, 8, 70, P.w[1], 22)},
      {d: .95, svg: `<g><path d="M300 450 Q318 408 360 402 L470 400 L470 520 L330 520 Q306 470 300 450Z" fill="${P.paul}"/><path d="M306 432 Q322 408 360 404 L470 402 L470 414 L362 416 Q330 418 310 438Z" fill="${P.rumpf}"/>
          <path d="M352 402 V382 H470" fill="none" stroke="${P.motor}" stroke-width="2.4"/></g>`}
    ],
    heck: () => [
      {d: 0, svg: himmel(0)},
      {d: .1, svg: masten(296, [60, 180, 300]) + haeuser(296, .5, 7, 10, false)},
      {d: .2, svg: nebelband(220, 300, 480, 30, .8)},
      {d: .3, svg: `<rect x="-60" y="300" width="520" height="300" fill="url(#fb-wg)"/>` + streifen(306, 2.5, 26, P.w[0], 4) + streifen(330, 4, 38, mix(P.w[0], P.w[1], .35), -6)},
      {d: .42, svg: `<path d="M300 296 L336 296 L440 520 L360 520Z" fill="${P.steg}"/>` +
          [0, 1, 2, 3, 4, 5].map(i => { const t = i / 6, y = 300 + t * 200; return `<path d="M${304 + t * 66} ${y} L${336 + t * 100} ${y}" stroke="${P.stegD}" stroke-width="${1 + t * 2}"/>`; }).join('') + zapfsaeule(326, 300, .8)},
      {d: .55, svg: `<g id="fh-pos" transform="translate(262 362) scale(1.15)">${friedaHeck('fh-boot')}</g>`},
      {d: .62, svg: `<g id="fh-kiel" opacity="0"><path data-fluss="-14" d="M240 392 Q200 440 150 520 M284 392 Q320 440 360 520" stroke="${P.glanz}" stroke-width="3" fill="none" stroke-dasharray="14 10" opacity=".75"/></g>`},
      {d: .7, svg: streifen(402, 6, 52, mix(P.w[0], P.w[1], .6), 12, false) + streifen(458, 8, 68, P.w[1], -16, false)},
      {d: .92, svg: `<g><path d="M118 318 L172 300 L172 384 L118 436Z" fill="${P.paul}"/><path d="M118 318 L172 300 L172 310 L118 330Z" fill="${P.rumpf}"/>
          <path d="M-60 318 L118 318 L118 436 Q40 456 -60 446Z" fill="${P.paulD}"/><path d="M-60 318 L118 318 L118 332 L-60 332Z" fill="${P.rumpf}"/>
          <text x="30" y="392" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="17" fill="${P.rumpf}" letter-spacing="1">ELSE</text>
          <g transform="translate(146 372)"><g id="fh-fender"><path d="M0 -44 V-30" stroke="${P.motor}" stroke-width="1.6"/><rect x="-15" y="-32" width="30" height="66" rx="15" fill="${P.fender}"/>
          <text transform="rotate(-90)" x="0" y="3.6" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="10" letter-spacing=".8" fill="${P.fenderSchrift}">HINNERK</text></g></g></g>`}
    ],
    schnitt: () => [
      {d: 0, svg: `<rect x="-60" y="-60" width="520" height="290" fill="url(#fb-hg)"/>` + haeuser(196, .45, 8, -30, false) + `<rect x="-60" y="196" width="520" height="400" fill="url(#fb-uw)"/>` +
          [0, 1, 2, 3, 4].map(i => `<path d="M${40 + i * 80} 200 L${10 + i * 80} 470 L${70 + i * 80} 470Z" fill="#fff" opacity=".05"/>`).join('') +
          `<path d="M-60 470 Q40 456 120 466 T300 462 T460 468 L460 560 L-60 560Z" fill="${P.sand}"/>` + Array.from({length: 12}, (_, i) => `<ellipse cx="${(i * 47) % 460 - 20}" cy="${480 + (i % 3) * 8}" rx="${4 + i % 4}" ry="2.5" fill="${dunkel(P.sand, .2)}"/>`).join('') +
          [30, 350].map(x => `<path d="M${x} 470 q-8 -30 4 -60 q10 -24 -2 -50" stroke="${P.tang}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('') +
          `<text x="14" y="30" font-family="Baloo 2,sans-serif" font-weight="800" font-size="16" fill="#b4473b" stroke="rgba(255,255,255,.7)" stroke-width="3" paint-order="stroke">Backbord</text>
           <text x="386" y="30" text-anchor="end" font-family="Baloo 2,sans-serif" font-weight="800" font-size="16" fill="#3c8c5a" stroke="rgba(255,255,255,.7)" stroke-width="3" paint-order="stroke">Steuerbord</text>`},
      {d: .4, svg: Array.from({length: 22}, (_, i) => `<circle cx="${(i * 61) % 440 - 20}" cy="${220 + (i * 37) % 240}" r="${1 + i % 3}" fill="#e8f4f2" opacity=".35" data-welle="${2 + i % 3},2,${i},0"/>`).join('')},
      {d: .55, svg: `<g id="fx-pos" transform="translate(200 0)">
          <g transform="translate(0 196) scale(1.15)">${friedaHeck('fx-boot').replace('id="fx-boot"', 'id="fx-boot" data-ohne-bob="1"')}</g>
          <path d="M-70 200 Q-60 238 0 246 Q60 238 70 200Z" fill="${P.unter}" opacity=".85"/>
          <rect x="-4" y="236" width="8" height="64" fill="${P.motor}"/><path d="M-6 296 h12 l-2 10 h-8Z" fill="${P.motor}"/>
          <g id="fx-rad" opacity="0"><circle cx="0" cy="305" r="164" fill="rgba(255,255,255,.07)" stroke="#fff6dc" stroke-width="3" stroke-dasharray="10 7"/>
            <g id="fx-speichen">${[0, 45, 90, 135].map(a => `<path d="M0 141 V469" transform="rotate(${a} 0 305)" stroke="#fff6dc" stroke-width="2" opacity=".55"/>`).join('')}</g></g>
          <g id="fx-prop"><ellipse cx="0" cy="291" rx="5" ry="16" fill="#9aa3aa"/><ellipse cx="0" cy="319" rx="5" ry="16" fill="#9aa3aa"/><ellipse cx="-14" cy="305" rx="16" ry="5" fill="#9aa3aa"/><ellipse cx="14" cy="305" rx="16" ry="5" fill="#9aa3aa"/><circle cx="0" cy="305" r="5" fill="${P.motor}"/></g>
        </g><g id="fx-pfeil" opacity="0" transform="translate(200 0)">${pfeil(20, 498, 120, '#fff6dc', 'Heck nach Backbord')}</g>`},
      {d: .7, svg: streifen(198, 4, 40, 'rgba(160,190,190,.25)', 10)}
    ]
  },
  becken: {
    seite: () => [
      {d: 0, svg: himmel(90)},
      {d: .1, svg: [-480, 0, 480].map(o => `<g transform="translate(${o} 0)">${masten(272, [20, 140, 260, 400]) + haeuser(272, .55, 8, -20, false)}</g>`).join(''), scroll: true},
      {d: .2, svg: nebelband(200, 280, 600, 30, .8)},
      {d: .28, svg: [-480, 0, 480].map(o => `<g transform="translate(${o} 0)">${stegSeite(282).replace(/x="-60" y="276" width="520"/, 'x="-20" y="276" width="480"')}</g>`).join('') +
          `<g id="fb-hilke"><g transform="translate(330 276) scale(.42)">${hilke()}</g></g>`, scroll: true},
      {d: .36, svg: `<rect x="-60" y="290" width="520" height="300" fill="url(#fb-wg)"/>` + streifen(296, 3, 30, P.w[0], 12) + streifen(314, 4, 40, mix(P.w[0], P.w[1], .35), 16)},
      {d: .45, svg: moewe(470, 130, -60, 170, 15, 4, .85)},
      {d: .55, svg: `<g id="fb-pos" transform="translate(200 344) scale(1.4)">${friedaSeite('fb-boot')}</g>`},
      {d: .7, svg: streifen(360, 6, 54, mix(P.w[0], P.w[1], .6), 28) + streifen(408, 8, 70, P.w[1], 36)},
      {d: .95, svg: [-480, 0, 480].map(o => `<g transform="translate(${o} 0)"><rect x="40" y="380" width="22" height="200" rx="6" fill="${P.stegD}"/><rect x="300" y="400" width="22" height="200" rx="6" fill="${P.stegD}"/></g>`).join(''), scroll: true}
    ]
  },
  kluever: {
    oben: () => {
      const sx = -Math.sin(P.sonne.az * Math.PI / 180) * 10, sy = Math.cos(P.sonne.az * Math.PI / 180) * 10;
      const pier = (x0, w, id) => `<g id="${id}"><rect x="${x0}" y="-60" width="${w}" height="640" fill="${P.steg}"/>` + Array.from({length: 26}, (_, i) => `<path d="M${x0} ${-50 + i * 24} H${x0 + w}" stroke="${P.stegD}" stroke-width="1.2"/>`).join('') +
        [60, 240, 420].map(y => { const bx = x0 + (x0 < 200 ? w - 8 : 8); return HS(0, `<circle cx="${bx}" cy="${y}" r="6" fill="${P.stegD}"/>`, bx, y, 1) + HS(.18, `<circle cx="${bx}" cy="${y}" r="5" fill="${P.motor}"/>`, bx, y, 1); }).join('') + `</g>`;
      const mann = (x, y) => `<g id="fo-mann" opacity="0">${HS(.3, `<ellipse cx="${x}" cy="${y}" rx="16" ry="10" fill="#7d5a8c"/>`, x, y, 1)}${HS(.45, `<circle cx="${x}" cy="${y}" r="8" fill="#d6a679"/>`, x, y, 1)}
        ${HS(.32, `<path d="M${x - 10} ${y} q-14 8 -10 22 q4 10 -6 18" stroke="#c9b27a" stroke-width="2.6" fill="none"/>`, x, y, 1)}</g>`;
      return [
        {d: 0, svg: `<rect x="-60" y="-60" width="520" height="640" fill="url(#fb-wg)"/>` + Array.from({length: 34}, (_, i) => `<path d="M${(i * 71) % 460 - 30} ${(i * 113) % 600 - 50} q9 -5 18 0" stroke="${P.glanz}" stroke-width="1.5" fill="none" opacity=".5" data-welle="${2 + i % 3},0,${i},0"/>`).join('')},
        {d: .3, svg: pier(40, 64, 'fo-pier-bb') + `<g id="fo-pier-stb" opacity="0">${pier(296, 64, 'fo-pier-stb-in')}</g>` + mann(330, 210)},
        {d: .55, svg: `<g id="fo-pos" transform="translate(160 470)"><g opacity=".22" transform="translate(${sx * 1.3} ${sy * 1.3}) scale(1.74)"><path d="${RUMPF_OBEN}" fill="#000"/></g>
            <g id="fo-kiel" opacity="0"><path data-fluss="-22" d="M-4 90 Q-30 160 -80 260 M4 90 Q30 160 80 260" stroke="${P.glanz}" stroke-width="3" fill="none" stroke-dasharray="12 10" opacity=".8"/></g>
            <g id="fo-wirbel" opacity="0"><path data-fluss="18" d="M-30 70 Q0 110 30 70" stroke="${P.glanz}" stroke-width="3" fill="none" stroke-dasharray="8 6"/></g>
            <g transform="scale(1.7)">${friedaOben3D()}</g>
            <g id="fo-pfeil" opacity="0"><path d="M-8 108 Q-46 116 -66 92" stroke="#ffe08a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-66 92 l2 14 M-66 92 l13 3" stroke="#ffe08a" stroke-width="4" stroke-linecap="round"/></g></g>`},
        {d: .85, svg: nebelband(120, 160, 380, 100, .45) + nebelband(320, 420, 340, 100, .4)}
      ];
    }
  },
  ausfahrt: {
    seite: () => [
      {d: 0, svg: himmel(90)},
      {d: .08, svg: `<path d="M-60 268 Q100 262 240 266 T470 264 L470 284 L-60 284Z" fill="${P.ferne}" opacity=".7"/>
          <g id="fa-faehre" transform="translate(40 266) scale(.32)"><path d="M-90 0 L90 0 L78 26 L-80 26Z" fill="${P.rumpf}"/><path d="M-90 0 L90 0 L86 10 L-86 10Z" fill="#c0463a"/><rect x="-60" y="-34" width="110" height="34" fill="${P.rumpf}"/>
          ${[-50, -30, -10, 10, 30].map(x => `<rect x="${x}" y="-26" width="12" height="9" fill="${P.fenster}"/>`).join('')}<rect x="-6" y="-58" width="16" height="24" fill="#c0463a"/><path d="M2 -60 q10 -14 2 -26 q-8 -12 6 -24" stroke="#bfc4c2" stroke-width="7" fill="none" opacity=".6"/></g>`},
      {d: .2, svg: `<path d="M240 286 L470 280 L470 300 L240 304Z" fill="${P.mole}"/><rect x="250" y="250" width="12" height="36" fill="#b4473b"/><rect x="246" y="244" width="20" height="8" fill="${P.motor}"/>` + nebelband(120, 290, 420, 30, .8)},
      {d: .36, svg: `<rect x="-60" y="290" width="520" height="300" fill="url(#fb-wg)"/>` + streifen(296, 3, 30, P.w[0], 6) + streifen(314, 4, 40, mix(P.w[0], P.w[1], .35), 9)},
      {d: .45, svg: moewe(-60, 120, 470, 150, 19, 8, .8)},
      {d: .55, svg: `<g id="fa-pos" transform="translate(220 346) scale(1.4)">${friedaSeite('fa-boot')}</g>`},
      {d: .7, svg: streifen(362, 6, 54, mix(P.w[0], P.w[1], .6), 14) + streifen(410, 8, 70, P.w[1], 20)},
      {d: .95, svg: `<path d="M-60 430 L120 420 L150 520 L-60 520Z" fill="${P.mole}"/>` + Array.from({length: 9}, (_, i) => `<ellipse cx="${-40 + i * 20}" cy="${430 + (i % 3) * 6}" rx="14" ry="9" fill="${dunkel(P.mole, .15 + (i % 2) * .1)}"/>`).join('') + `<rect x="96" y="352" width="14" height="74" fill="#3c8c5a"/><rect x="92" y="344" width="22" height="9" fill="${P.motor}"/>`}
    ]
  }
};
/* Einstellungen je Blick (Kamera: z Zoom, fx/fy Blickpunkt, oy Höhe, df Schärfeebene, kipp Neigung) */
const EINST = {
  seite: {totale: {}, halbnah: {z: 1.55, fx: 205, fy: 318}, hinnerk: {z: 2.5, fx: 272, fy: 300}, smilla: {z: 2.5, fx: 125, fy: 302}, heck: {z: 1.9, fx: 300, fy: 330}, hilke: {z: 2.1, fx: 160, fy: 236, df: .28}, tief: {z: 1.1, oy: -30, fy: 330}},
  heck: {totale: {}, nah: {z: 1.7, fx: 230, fy: 330}, fender: {z: 2.1, fx: 160, fy: 360, df: .92}},
  schnitt: {totale: {}, nah: {z: 1.3, fx: 200, fy: 300}},
  oben: {totale: {}, nah: {z: 1.5, fx: 170, fy: 280}, schraeg: {kipp: 32, z: 1.45, fy: 290}}
};
const PEIL = {seite: 270, heck: 180};

/* ---------- 6. Bühne aufbauen ---------- */
const NULLCAM = {z: 1, fx: 200, fy: 250, ox: 0, oy: 0, df: .55, kipp: 0, drehOff: 0, vert: 0};
const NULLS = {p: 0, a: 0, go: 0, motor: 0, hx: 150, winken: 0, fender: 0, rad: 0, dreh: 0, pfeil: 0, fahrt: 0, k: 0, stopp: 0, pier: 0, mann: 0, faehre: 0, hilkeB: 1};
let root = null, welt = null, ort = null, blick = 'seite', s = {...NULLS}, tweens = [], SETS = {}, EB = {}, CAM = {}, K = 1, extraBlur = 0, sprecher = '', laeuft = false, scrollOff = 0;
const SV = x => `<svg viewBox="-40 -50 480 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${x}</svg>`;
function css() {
  if (document.getElementById('fb-css')) return;
  const st = document.createElement('style'); st.id = 'fb-css';
  st.textContent = `.fb{position:relative;width:100%;height:100%;overflow:hidden;border-radius:18px;background:#5b513f;isolation:isolate}
  .fb-innen{position:absolute;inset:0;overflow:hidden;transition:filter .8s}.fb.kalt .fb-innen{filter:blur(5px) saturate(.45) brightness(.94)}
  .fb-welt{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,#f6eedb 0%,#cdbf9f 55%,#5b513f 100%)}
  .fb-set{position:absolute;inset:0;visibility:hidden}.fb-set.an{visibility:visible}.fb-rig{position:absolute;inset:0;transform-origin:50% 55%}
  .fb-eb{position:absolute;inset:0}.fb-cam{position:absolute;inset:-10%;transform-origin:50% 50%}.fb-cam svg{width:100%;height:100%;display:block}
  .fb-ue{position:absolute;inset:0;pointer-events:none}.fb-blende{opacity:0;background:radial-gradient(ellipse at 50% 50%,${P.nebelFarbe},${hell(P.nebelFarbe, .25)})}
  .fb-wasser{opacity:0;background:linear-gradient(#9cc4c4,#2f5d63)}.fb-flare{opacity:0}
  .fb-kasch{background:radial-gradient(ellipse at 50% 50%,transparent 58%,rgba(30,40,45,.36) 100%)}.fb-korn{mix-blend-mode:multiply;opacity:.2;width:100%;height:100%}
  .fb-med{position:absolute;left:4%;bottom:4%;width:24%;aspect-ratio:1;border-radius:50%;background:rgba(240,238,228,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
    box-shadow:0 6px 20px rgba(20,30,35,.35);opacity:0;transform:scale(.9);transition:opacity .6s,transform .6s;overflow:hidden;pointer-events:none}
  .fb-med.an{opacity:1;transform:scale(1)}.fb-med svg{width:100%;height:100%}.fb-med .fb-tel{position:absolute;right:4%;top:4%;font-size:1.3em}`;
  document.head.appendChild(st);
}
function defs() {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="fb-hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.h[0]}"/><stop offset=".6" stop-color="${P.h[1]}"/><stop offset="1" stop-color="${P.h[2]}"/></linearGradient>
    <linearGradient id="fb-wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.w[0]}"/><stop offset="1" stop-color="${P.w[1]}"/></linearGradient>
    <linearGradient id="fb-uw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa9a8"/><stop offset="1" stop-color="#2f5357"/></linearGradient>
    <radialGradient id="fb-ng" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${P.nebelFarbe}" stop-opacity=".95"/><stop offset="1" stop-color="${P.nebelFarbe}" stop-opacity="0"/></radialGradient>
    <radialGradient id="fb-sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${P.sonne.farbe}" stop-opacity=".95"/><stop offset=".25" stop-color="${P.sonne.farbe}" stop-opacity=".55"/><stop offset="1" stop-color="${P.sonne.farbe}" stop-opacity="0"/></radialGradient>
    <filter id="fb-korn"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .16  0 0 0 0 .1  0 0 0 .6 0"/></filter></defs></svg>`;
}
function mount(el) {
  css();
  el.innerHTML = `<div class="fb">${defs()}<div class="fb-innen"><div class="fb-welt"></div></div><div class="fb-ue fb-kasch"></div>
    <svg class="fb-ue fb-korn" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true"><rect width="400" height="500" filter="url(#fb-korn)"/></svg>
    <div class="fb-ue fb-wasser"></div><div class="fb-ue fb-blende"></div><div class="fb-ue fb-flare"></div>
    <div class="fb-med"><svg viewBox="0 0 122 122">${harmsBuste()}</svg><span class="fb-tel" hidden>☎️</span></div></div>`;
  root = el.querySelector('.fb'); welt = el.querySelector('.fb-welt'); SETS = {}; EB = {}; CAM = {}; ort = null;
  messen(); if (!laeuft) { laeuft = true; requestAnimationFrame(zeichne); }
}
function messen() { if (root) K = (root.clientWidth || 400) / 400; }
addEventListener('resize', messen);
function setBauen(o, b) {
  const key = o + ':' + b; if (SETS[key]) return SETS[key];
  const set = document.createElement('div'); set.className = 'fb-set'; set.dataset.key = key;
  const rig = document.createElement('div'); rig.className = 'fb-rig'; set.appendChild(rig);
  const ebenen = o === 'orbit' ? orbitEbenen() : ORTE[o][b]();
  EB[key] = [];
  for (const e of ebenen) {
    if (!e.svg) continue;
    const eb = document.createElement('div'); eb.className = 'fb-eb'; eb.dataset.d = e.d;
    const cam = document.createElement('div'); cam.className = 'fb-cam';
    if (o === 'orbit' && e.d > 0 && !e.slot) { cam.style.inset = '-10% -160%'; cam.innerHTML = `<svg viewBox="-640 -50 1680 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${e.svg}</svg>`; }
    else cam.innerHTML = SV(e.svg);
    eb.appendChild(cam); rig.appendChild(eb);
    EB[key].push({d: e.d, eb, cam, scroll: !!e.scroll, last: ''});
  }
  welt.appendChild(set); SETS[key] = set; CAM[key] = CAM[key] || {...NULLCAM};
  sammeln();
  return set;
}
function orbitEbenen() {
  const land = `<path d="M-1300 280 Q-900 262 -500 274 T300 270 T1100 276 T1700 270 L1700 300 L-1300 300Z" fill="${P.ferne2}"/>` + haeuser(276, .5, 30, -1200, false);
  return [
    {d: 0, svg: `<rect x="-60" y="-60" width="520" height="640" fill="url(#fb-hg)"/>`}, {d: .1, svg: land}, {d: .2, svg: nebelband(200, 286, 2400, 44, 1)},
    {d: .35, svg: `<rect x="-1300" y="290" width="3000" height="300" fill="url(#fb-wg)"/>` + streifen(296, 3, 30, P.w[0], 0, true, -1300, 1700) + streifen(318, 4, 40, mix(P.w[0], P.w[1], .4), 0, true, -1300, 1700)},
    {d: .55, svg: `<g id="fb-orbitboot" transform="translate(200 336) scale(1.3)"></g>`, slot: true},
    {d: .7, svg: streifen(360, 6, 56, mix(P.w[0], P.w[1], .6), 0, true, -1300, 1700) + streifen(420, 8, 72, P.w[1], 0, true, -1300, 1700)}
  ];
}
let HOEHE = [], WELLEN = [], FLUSS = [], MOEWEN = [], DRIFT = [], TEILE = [], BOBS = [], BLASEN = [];
function sammeln() {
  const q = x => [...welt.querySelectorAll(x)];
  HOEHE = q('[data-h]').map(el => ({el, h: +el.dataset.h, cx: +el.dataset.cx, cy: +el.dataset.cy, s: +el.dataset.s}));
  WELLEN = q('[data-welle]').map(el => { const [sp, amp, ph, per = 0] = el.dataset.welle.split(',').map(Number); return {el, sp, amp, ph, per, b: el.getAttribute('transform') || ''}; });
  FLUSS = q('[data-fluss]').map(el => ({el, sp: +el.dataset.fluss}));
  MOEWEN = q('[data-moewe]').map(el => { const [x0, y0, x1, y1, dur, ph] = el.dataset.moewe.split(',').map(Number); return {el, x0, y0, x1, y1, dur, ph, flug: el.querySelector('.fb-flug')}; });
  DRIFT = q('[data-drift]').map(el => { const [sp, ph] = el.dataset.drift.split(',').map(Number); return {el, sp, ph, cx: +el.getAttribute('cx')}; });
  TEILE = q('[data-dreh]').map(el => ({el, art: el.dataset.dreh, wer: el.dataset.wer, px: +el.dataset.px, py: +el.dataset.py, ph: Math.random() * 6}));
  BOBS = q('.fb-bob').filter(el => !el.closest('[data-ohne-bob]'));
  BLASEN = q('.fb-blase');
}
const $id = id => document.getElementById(id);

/* ---------- 7. Kamera und Bild für Bild ---------- */
function zielCam(b, e) { return {...NULLCAM, ...((EINST[b] || {})[e] || {})}; }
function kameraAnwenden(key, t) {
  const c = CAM[key], set = SETS[key]; if (!set || !set.classList.contains('an')) return;
  const rig = set.firstChild, rt = (c.kipp || c.drehOff) ? `perspective(${700 * K}px) rotateX(${c.kipp.toFixed(2)}deg) rotateZ(${c.drehOff.toFixed(2)}deg)` : '';
  if (rig._t !== rt) { rig.style.transform = rt; rig._t = rt; }
  const atmen = reduziert ? 0 : 1, ox0 = Math.sin(t * .23) * 4 * atmen, oy0 = Math.cos(t * .17) * 2.5 * atmen;
  for (const L of EB[key]) {
    const d = L.d;
    let zl = 1 + (c.z - 1) * (.25 + .75 * d); zl *= 1 + c.vert * (.55 - d) * (d > .55 ? .7 : 1.8);
    const u = Math.max(0, Math.min(1, (zl - 1) / .5));
    let tx = (c.fx - 200) * (1 - u - zl) + (ox0 + c.ox) * d, ty = (c.fy - 250) * (1 - u - zl) + (oy0 + c.oy) * d;
    if (L.scroll) tx += ((((scrollOff * d) % 480) + 480) % 480) - 240 + 240 * 0;
    L.cam.style.transform = `translate(${(tx * K).toFixed(1)}px,${(ty * K).toFixed(1)}px) scale(${zl.toFixed(4)})`;
    if (d > 0) {
      const bl = key === 'orbit:seite' ? 0 : Math.min(12, 3.2 * Math.abs(d - c.df) * (1 + (zl - 1) * .5) + extraBlur);
      const op = d < .55 ? 1 - P.nebel * .9 * (.55 - d) / .55 : 1, k = bl.toFixed(1) + '|' + op.toFixed(2);
      if (L.last !== k) { L.cam.style.filter = bl > .15 ? `blur(${bl.toFixed(1)}px)` : ''; L.cam.style.opacity = op.toFixed(2); L.last = k; }
    }
  }
}
const EASE = {inout: u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, in: u => u * u * u, out: u => 1 - Math.pow(1 - u, 3), lin: u => u};
function tw(obj, ziel, dur, ease = 'inout') {
  return new Promise(res => { const von = {}; for (const k in ziel) von[k] = obj[k]; tweens.push({obj, von, ziel, dur: reduziert ? Math.min(dur, 250) : Math.max(1, dur), start: performance.now(), ease, res}); });
}
const G = {get extraBlur() { return extraBlur; }, set extraBlur(v) { extraBlur = v; }};
let t0 = performance.now(), letzt = performance.now();
function zeichne(now) {
  if (!root || !document.body.contains(root)) { laeuft = false; return; }
  const t = (now - t0) / 1000, dt = Math.min(.1, (now - letzt) / 1000); letzt = now;
  tweens = tweens.filter(w => { const u = Math.min(1, (now - w.start) / w.dur), e = EASE[w.ease](u); for (const k in w.ziel) w.obj[k] = w.von[k] + (w.ziel[k] - w.von[k]) * e; if (u >= 1) { w.res(); return false; } return true; });
  scrollOff += s.fahrt * dt * 46;
  for (const key in SETS) kameraAnwenden(key, t);
  const bob = Math.sin(t * 1.6) * 1.8, roll = Math.sin(t * 1.2) * 1.1;
  for (const b of BOBS) b.setAttribute('transform', `translate(0 ${bob.toFixed(2)}) rotate(${roll.toFixed(2)})`);
  /* Tankstelle von der Seite: rückwärts nach rechts, voraus nach links */
  let e = $id('fs-pos'); if (e) e.setAttribute('transform', `translate(${(200 + s.p * 62 - s.go * 470).toFixed(1)} 340) scale(1.4)`);
  e = $id('fs-hilke'); if (e) { const hop = Math.abs(Math.sin(t * 7)) * (tweens.some(w => 'hx' in w.ziel) ? 3 : 0); e.setAttribute('transform', `translate(${s.hx.toFixed(1)} ${(266 - hop).toFixed(1)})`); }
  e = $id('fh-pos'); if (e) e.setAttribute('transform', `translate(${(262 - s.a * 86).toFixed(1)} ${(362 + s.p * 14).toFixed(1)}) scale(${(1.15 + s.p * .18).toFixed(3)})`);
  e = $id('fh-fender'); if (e) e.setAttribute('transform', `rotate(${(Math.sin(t * 2.2) * (2 + s.fender * 6)).toFixed(2)}) scale(${(1 + s.fender * .14).toFixed(3)})`);
  e = $id('fh-kiel'); if (e) e.setAttribute('opacity', (s.motor * .9).toFixed(2));
  /* Lehrbild im Schnitt: Propeller und Rad drehen je nach Gang, das Heck wandert */
  e = $id('fx-pos'); if (e) e.setAttribute('transform', `translate(${(200 - s.a * 70).toFixed(1)} 0)`);
  e = $id('fx-prop'); if (e) e.setAttribute('transform', `rotate(${(s.dreh * t * 420 % 360).toFixed(1)} 0 305)`);
  e = $id('fx-speichen'); if (e) e.setAttribute('transform', `rotate(${(s.dreh * t * 40 % 360).toFixed(1)} 0 305)`);
  e = $id('fx-rad'); if (e) e.setAttribute('opacity', s.rad.toFixed(2));
  e = $id('fx-pfeil'); if (e) e.setAttribute('opacity', s.pfeil.toFixed(2));
  /* Hafenbecken: die Frieda fährt, die Welt zieht vorbei */
  for (const id of ['fb-boot', 'fa-boot', 'fs-boot']) { const g = $id(id + '-gischt'); if (g) g.setAttribute('opacity', (Math.min(1, (id === 'fs-boot' ? s.go : s.fahrt)) * (.7 + Math.sin(t * 6) * .3)).toFixed(2)); }
  e = $id('fb-hilke'); if (e) e.setAttribute('opacity', s.hilkeB.toFixed(2));
  /* Klüverhafen von oben: anfahren, aufstoppen, das Heck zieht nach Backbord */
  e = $id('fo-pos'); if (e) {
    const bb = s.pier < .5, kx = bb ? 146 : 254, wink = bb ? -9 : 9;
    const x = 200 + (kx - 200) * s.k + (bb ? 0 : 0), y = 470 - 230 * s.k - 8 * s.stopp;
    const r = wink * Math.min(1, s.k * 1.2) + (bb ? 9 : 9) * s.stopp, rr = r * Math.PI / 180;
    const sx = bb ? 0 : -18 * s.stopp;
    e.setAttribute('transform', `translate(${(x + sx - Math.sin(rr) * 0).toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)})`);
    const kl = $id('fo-kiel'); if (kl) kl.setAttribute('opacity', (s.k > 0 && s.k < 1 ? .8 : 0).toFixed(2));
    const wi = $id('fo-wirbel'); if (wi) wi.setAttribute('opacity', (s.stopp > .02 && s.stopp < .98 ? .9 : 0).toFixed(2));
    const pf = $id('fo-pfeil'); if (pf) pf.setAttribute('opacity', (s.stopp > .02 ? Math.min(1, s.stopp * 3) : 0).toFixed(2));
    const pb = $id('fo-pier-bb'), ps = $id('fo-pier-stb'); if (pb) pb.setAttribute('opacity', Math.min(1, 2 - 2 * s.pier).toFixed(2)); if (ps) ps.setAttribute('opacity', Math.min(1, 2 * s.pier).toFixed(2));   /* pier=.5: beide Piers, für die Frage nach der Seite (verrät nichts) */
    const m = $id('fo-mann'); if (m) m.setAttribute('opacity', s.mann.toFixed(2));
  }
  e = $id('fa-faehre'); if (e) e.setAttribute('transform', `translate(${(40 + s.faehre * 120).toFixed(1)} ${(266 + s.faehre * 12).toFixed(1)}) scale(${(.32 + s.faehre * .9).toFixed(3)})`);
  /* Höhenschichten der Draufsicht: Hohes neigt sich vom Bildmittelpunkt weg */
  if (HOEHE.length && ort === 'kluever') {
    const wx = Math.sin(t * .31) * 3, wy = Math.cos(t * .27) * 3;
    for (const o of HOEHE) {
      const lx = ((o.cx - 200) * .05 + 11 + wx) * o.h, ly = ((o.cy - 250) * .05 - 15 + wy) * o.h, sc = 1 + o.h * .07;
      o.el.setAttribute('transform', o.s !== 1 ? `translate(${(lx / o.s).toFixed(2)} ${(ly / o.s).toFixed(2)}) scale(${sc.toFixed(3)})` : `translate(${(lx + o.cx).toFixed(2)} ${(ly + o.cy).toFixed(2)}) scale(${sc.toFixed(3)}) translate(${-o.cx} ${-o.cy})`);
    }
  }
  for (const b of BLASEN) { const i = +b.dataset.i, u = (t * 1.3 + i * .25) % 1, g = b.parentNode; if (g) g.setAttribute('opacity', s.motor ? 1 : 0); b.setAttribute('transform', `translate(${(u * 18 + (i % 2 ? 4 : -4)).toFixed(1)} ${(-u * 10).toFixed(1)})`); b.setAttribute('opacity', (1 - u).toFixed(2)); }
  for (const p of TEILE) {
    let w = 0;
    if (p.art === 'fig') w = sprecher && p.wer === sprecher ? Math.sin(t * 13 + p.ph) * 1.6 : Math.sin(t * 1.2 + p.ph) * .5;
    else if (p.art === 'arm-h') w = Math.sin(t * .9 + p.ph) * 4 + (sprecher === 'HINNERK' ? Math.sin(t * 4) * 6 : 0);
    else if (p.art === 'arm-s') w = sprecher === 'SMILLA' ? -30 + Math.sin(t * 5) * 14 : 0;
    else if (p.art === 'arm-hi') w = s.winken > .5 ? -95 + Math.sin(t * 9) * 28 : (sprecher === 'HAFENMEISTER' ? -20 + Math.sin(t * 5) * 8 : 0);
    else if (p.art === 'zopf') w = Math.sin(t * 2.3 + p.ph) * 7;
    else if (p.art === 'schwanz') w = Math.sin(t * 1.6 + p.ph) * 16;
    p.el.setAttribute('transform', `rotate(${w.toFixed(2)} ${p.px} ${p.py})`);
  }
  for (const w of WELLEN) { const dx = w.per ? ((((t * w.sp) % w.per) + w.per) % w.per) - w.per : Math.sin(t * .05 + w.ph) * w.sp * 6; w.el.setAttribute('transform', `${w.b} translate(${dx.toFixed(1)} ${(Math.sin(t * 1.1 + w.ph) * w.amp).toFixed(1)})`); }
  for (const f of FLUSS) f.el.setAttribute('stroke-dashoffset', (t * f.sp).toFixed(1));
  for (const m of MOEWEN) { const u = ((t + m.ph) % m.dur) / m.dur, x = m.x0 + (m.x1 - m.x0) * u, y = m.y0 + (m.y1 - m.y0) * u + Math.sin(u * 9) * 10; m.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); if (m.flug) m.flug.setAttribute('transform', `scale(1 ${(.35 + Math.abs(Math.sin(t * 5 + m.ph)) * .8).toFixed(2)})`); }
  for (const d of DRIFT) d.el.setAttribute('cx', (d.cx + Math.sin(t * .04 * d.sp + d.ph) * 50).toFixed(1));
  requestAnimationFrame(zeichne);
}

/* ---------- 8. Übergänge (docs/film-regeln.md FK3–FK12) ---------- */
const ani = (el, kf, dur, ease = 'ease-in-out', extra = {}) => el.animate(kf, {duration: reduziert ? Math.min(dur, 200) : dur, easing: ease, fill: 'both', ...extra}).finished;
const ue = c => root.querySelector('.fb-' + c);
const W = () => 400 * K, H = () => 500 * K;
/* „mitte“: Sprung-Werte (TU mit 0 bis 10 ms direkt nach dem Übergang) gelten genau im Moment des Bildwechsels */
let mitte = null;
function zeige(key) { if (mitte) { sofort(mitte); mitte = null; } for (const k in SETS) SETS[k].classList.toggle('an', k === key); }
function aufraeumen(key) { if (!SETS[key]) return; SETS[key].getAnimations().forEach(a => a.cancel()); (EB[key] || []).forEach(L => L.eb.getAnimations().forEach(a => a.cancel())); }
const UEB = {
  schnitt: async (a, n) => { zeige(n); },
  nebel: async (a, n) => { const b = ue('blende'); await ani(b, [{opacity: 0}, {opacity: 1}], 800, 'ease-in'); zeige(n); await ani(b, [{opacity: 1}, {opacity: 0}], 1100, 'ease-out'); b.getAnimations().forEach(x => x.cancel()); },
  licht: async (a, n) => { const f = ue('flare'), c = P.sonne.farbe; f.style.background = `radial-gradient(circle at 72% 22%, ${c} 0%, ${c} 18%, ${c}cc 45%, ${c}00 80%), linear-gradient(${c}aa, ${c}aa)`;
    await ani(f, [{opacity: 0}, {opacity: 1}], 700, 'ease-in'); zeige(n); await ani(f, [{opacity: 1}, {opacity: 0}], 1000, 'ease-out'); f.getAnimations().forEach(x => x.cancel()); },
  fahrt: async (a, n, z) => {
    if (a === n) { await tw(CAM[n], z, 1600); return; }
    const A = CAM[a], b = ue('blende');
    await Promise.all([tw(A, {z: A.z * 1.8}, 900, 'in'), tw(G, {extraBlur: 6}, 900, 'in'), ani(b, [{opacity: 0}, {opacity: .7}], 900, 'ease-in')]);
    Object.assign(CAM[n], z, {z: z.z * 1.5}); zeige(n);
    await Promise.all([tw(CAM[n], {z: z.z}, 1200, 'out'), tw(G, {extraBlur: 0}, 1100, 'out'), ani(b, [{opacity: .7}, {opacity: 0}], 1100, 'ease-out')]); b.getAnimations().forEach(x => x.cancel());
  },
  schaerfe: async (a, n, z) => {
    if (a === n) { await tw(CAM[n], z, 1500); return; }
    await Promise.all([tw(G, {extraBlur: 12}, 700, 'in'), tw(CAM[a], {df: 1}, 700, 'in')]);
    Object.assign(CAM[n], z, {df: 1}); zeige(n); await Promise.all([tw(G, {extraBlur: 0}, 800, 'out'), tw(CAM[n], {df: z.df}, 1500)]);
  },
  atem: async (a, n, z) => {
    const b = ue('blende');
    await Promise.all([tw(CAM[a], {vert: -.6, oy: CAM[a].oy + 20}, 900), ani(b, [{opacity: 0}, {opacity: .9}], 900, 'ease-in')]);
    Object.assign(CAM[n], z, {vert: .7}); zeige(n); if (a !== n) Object.assign(CAM[a], {vert: 0, oy: 0});
    await Promise.all([tw(CAM[n], {vert: 0}, 1400, 'out'), ani(b, [{opacity: .9}, {opacity: 0}], 1200, 'ease-out')]); b.getAnimations().forEach(x => x.cancel());
  },
  platten: async (a, n, z) => {
    const LA = a ? [...EB[a]].sort((x, y) => y.d - x.d) : [];
    await Promise.all(LA.map((L, i) => ani(L.eb, [{transform: 'none'}, {transform: `translateX(${-W() * 1.25}px) rotate(-2deg)`}], 520, 'ease-in', {delay: i * 85})));
    Object.assign(CAM[n], z); zeige(n); if (a) aufraeumen(a);
    const LN = [...EB[n]].sort((x, y) => x.d - y.d); LN.forEach(L => { L.eb.style.transform = `translateX(${W() * 1.25}px)`; });
    await sleep(reduziert ? 0 : 250);
    await Promise.all(LN.map((L, i) => ani(L.eb, [{transform: `translateX(${W() * 1.25}px) rotate(2deg)`}, {transform: 'none'}], 600, 'cubic-bezier(.2,.8,.3,1)', {delay: i * 90})));
    LN.forEach(L => { L.eb.style.transform = ''; }); aufraeumen(n);
  },
  kran: async (a, n, z) => {
    const b = ue('blende'), nachOben = n.endsWith(':oben');
    if (nachOben) {
      await Promise.all([...EB[a].map(L => ani(L.eb, [{transform: 'none', opacity: 1}, {transform: `translateY(${(L.d * H() * .7).toFixed(0)}px) scale(${1 + L.d * .35})`, opacity: L.d < .1 ? 1 : .2}], 1000, 'ease-in')), ani(b, [{opacity: 0}, {opacity: .85}], 1000, 'ease-in')]);
      Object.assign(CAM[n], z, {kipp: 60, drehOff: -16, z: z.z * 1.35}); zeige(n); aufraeumen(a);
      await Promise.all([tw(CAM[n], {kipp: z.kipp, drehOff: 0, z: z.z}, 1500, 'out'), ani(b, [{opacity: .85}, {opacity: 0}], 1300, 'ease-out')]);
    } else {
      const A = CAM[a];
      await Promise.all([tw(A, {kipp: 60, z: A.z * 1.4, drehOff: 14}, 1000, 'in'), ani(b, [{opacity: 0}, {opacity: .85}], 1000, 'ease-in')]);
      Object.assign(CAM[n], z); zeige(n); Object.assign(A, {kipp: 0, drehOff: 0, z: 1});
      await Promise.all([...EB[n].map(L => ani(L.eb, [{transform: `translateY(${(-L.d * H() * .55).toFixed(0)}px) scale(${1 + L.d * .25})`, opacity: .3}, {transform: 'none', opacity: 1}], 1300, 'ease-out')), ani(b, [{opacity: .85}, {opacity: 0}], 1300, 'ease-out')]);
      aufraeumen(n);
    }
    b.getAnimations().forEach(x => x.cancel());
  },
  /* Abtauchen: die Kamera sinkt unter die Wasserlinie (Lehrbild im Schnitt), Auftauchen umgekehrt */
  tauchen: async (a, n, z) => {
    const w = ue('wasser'), runter = n.endsWith(':schnitt');
    await Promise.all([...EB[a].map(L => ani(L.eb, [{transform: 'none'}, {transform: `translateY(${((runter ? -1 : 1) * (.3 + L.d) * H() * .45).toFixed(0)}px)`}], 900, 'ease-in')), ani(w, [{opacity: 0}, {opacity: .85}], 900, 'ease-in')]);
    Object.assign(CAM[n], z); zeige(n); aufraeumen(a);
    await Promise.all([...EB[n].map(L => ani(L.eb, [{transform: `translateY(${((runter ? 1 : -1) * (.3 + L.d) * H() * .35).toFixed(0)}px)`}, {transform: 'none'}], 1100, 'ease-out')), ani(w, [{opacity: .85}, {opacity: 0}], 1100, 'ease-out')]);
    aufraeumen(n); w.getAnimations().forEach(x => x.cancel());
  },
  /* Orbit um die Frieda: die Ferne wandert mit, Nahes dagegen; dazwischen das Bild schräg von hinten (FK6) */
  orbit: async (a, n, z) => {
    const ba = PEIL[a.split(':')[1]], bn = PEIL[n.split(':')[1]];
    if (ba == null || bn == null || ba === bn) return UEB.fahrt(a, n, z);
    const dir = bn > ba ? 1 : -1, lauf = (L, f) => -dir * (.55 - L.d) * W() * f;
    const O = setBauen('orbit', 'seite') && EB['orbit:seite'], S_O = SETS['orbit:seite'], ob = $id('fb-orbitboot');
    ob.innerHTML = friedaD34H(); sammeln();
    O.filter(L => L.d > 0).forEach(L => { L.eb.style.transform = `translateX(${-lauf(L, .9)}px)`; });
    S_O.classList.add('an'); SETS[a].style.zIndex = 2;
    await Promise.all(EB[a].map(L => ani(L.eb, [{transform: 'none', opacity: 1}, {transform: `translateX(${lauf(L, .9)}px)`, opacity: L.d === .55 ? 1 : 0}], 600, 'ease-in')));
    SETS[a].classList.remove('an'); SETS[a].style.zIndex = ''; aufraeumen(a);
    await Promise.all([...O.filter(L => L.d > 0).map(L => ani(L.eb, [{transform: `translateX(${-lauf(L, .9)}px)`}, {transform: `translateX(${lauf(L, 1.6)}px)`}], 700, 'linear')),
      ani(ob, [{transform: 'translate(200px,336px) scale(1.18,1.3)'}, {transform: 'translate(200px,336px) scale(1.34,1.3)', offset: .5}, {transform: 'translate(200px,336px) scale(1.18,1.3)'}], 700, 'linear')]);
    Object.assign(CAM[n], z); SETS[n].classList.add('an'); SETS[n].style.zIndex = 2;
    await Promise.all(EB[n].map(L => ani(L.eb, [{transform: `translateX(${-lauf(L, .9)}px)`, opacity: L.d === .55 ? 1 : 0}, {transform: 'none', opacity: 1}], 700, 'ease-out')));
    zeige(n); SETS[n].style.zIndex = ''; aufraeumen('orbit:seite'); aufraeumen(n); O.forEach(L => { L.eb.style.transform = ''; }); ob.innerHTML = ''; sammeln();
  }
};

/* ---------- 9. Schnittstelle für den Player ---------- */
let kette = Promise.resolve();
const inKette = fn => (kette = kette.then(fn).catch(e => console.error(e)));
function akt() { return ort ? ort + ':' + blick : null; }
function ortSetzen(name, ueb = 'nebel', b = null, mw = null) {
  return inKette(async () => {
    if (!ORTE[name] || !welt) return;
    mitte = mw;
    const alt = akt(), alteSets = Object.keys(SETS).filter(k => !k.startsWith(name + ':') && k !== 'orbit:seite');
    const nb = b || Object.keys(ORTE[name])[0];
    setBauen(name, nb);
    const n = name + ':' + nb, z = zielCam(nb, 'totale'); CAM[n] = {...z};
    if (ueb === 'sofort' || (!alt && ueb !== 'platten')) zeige(n);
    else await (UEB[ueb] || UEB.nebel)(alt, n, z);
    ort = name; blick = nb; if (mitte) { sofort(mitte); mitte = null; }
    for (const k of alteSets) { if (SETS[k] && !SETS[k].classList.contains('an')) { SETS[k].remove(); delete SETS[k]; delete EB[k]; delete CAM[k]; } }
    sammeln();
  });
}
function kamera(b, einst = 'totale', ueb = 'fahrt', mw = null) {
  return inKette(async () => {
    if (!ort || !ORTE[ort][b]) return;
    mitte = mw;
    const a = akt(); setBauen(ort, b); const n = ort + ':' + b, z = zielCam(b, einst);
    if (ueb === 'sofort' || ueb === 'schnitt') { Object.assign(CAM[n], z); zeige(n); }
    else await (UEB[ueb] || UEB.fahrt)(a, n, z);
    blick = b; if (mitte) { sofort(mitte); mitte = null; }
  });
}
function tu(werte) { for (const [k, [v, ms]] of Object.entries(werte)) if (k in s) tw(s, {[k]: v}, ms || 1200); }
function vertigo() { return inKette(async () => { const c = CAM[akt()]; if (!c) return; await tw(c, {vert: 1}, 1700); await sleep(500); await tw(c, {vert: 0}, 1500); }); }
function einfrieren(an) { if (root) root.classList.toggle('kalt', !!an); }
function medaillon(art) {
  if (!root) return; const m = root.querySelector('.fb-med'); m.classList.toggle('an', !!art); const tel = m.querySelector('.fb-tel'); if (tel) tel.hidden = art !== 'anruf';
}
function sprecherSetzen(wer) { sprecher = wer || ''; }
function reset() {
  tweens = []; s = {...NULLS}; extraBlur = 0; scrollOff = 0; sprecher = ''; kette = Promise.resolve();
  if (welt) { welt.innerHTML = ''; } SETS = {}; EB = {}; CAM = {}; ort = null; blick = 'seite'; einfrieren(false); medaillon(null);
  if (root) root.querySelectorAll('.fb-ue').forEach(x => x.getAnimations().forEach(a => a.cancel()));
}
/* sofort auf einen Stand springen (Abspielen ab einem späteren Kapitel) */
function sofort(werte) { for (const [k, [v]] of Object.entries(werte)) if (k in s) s[k] = v; }
window.FILMB = {mount, ort: ortSetzen, kamera, tu, sofort, vertigo, einfrieren, medaillon, sprecher: sprecherSetzen, reset, warte: () => kette,
  get zustand() { return {ort, blick, s: {...s}, sets: Object.keys(SETS)}; }, ORTE: Object.keys(ORTE), EINST};
})();
