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
/* ---------- 1b. Glasarten (v5.73; Nutzer 20.11.2026: „Glasplatten festgelegt, aber mehrere Varianten zur Auswahl, von Grund gedacht“) ----------
   Eine Glasart = fünf Stellschrauben: Unschärfe nach Tiefe (blur), Dunst in der Ferne (dunst), Kante jeder Platte (kante: Filter je Ebene),
   Oberfläche (papier, korn: Überzüge), Farbton (ton: Überzug mit Mischmodus) und Schatten der Platten (schatten, Papiertheater).
   Gewählt über <html data-glas> (S.cfg.look.glas, Standard weich). Kanten-Filter kosten Rechenzeit; sie wirken nur auf die mittleren und vorderen Platten. */
const GLAS = {
  weich: {name: 'Weich', satz: 'Glasebenen mit Dunst und Tiefenschärfe', blur: 1, dunst: 1, kante: '', korn: .2, papier: 0, ton: '', schatten: 0},
  klar: {name: 'Klar', satz: 'scharf, kräftig, wenig Dunst', blur: .18, dunst: .35, kante: '', korn: .08, papier: 0, ton: 'rgba(255,240,210,.08)', schatten: 0},
  aquarell: {name: 'Aquarell', satz: 'Lavur mit Pigmentrand und Papierflecken (wie Nordqvist)', blur: .45, dunst: .75, kante: 'pigment', korn: .16, papier: .26, ton: 'rgba(214,180,120,.12)', schatten: 0},
  feder: {name: 'Feder', satz: 'Tuschekontur um jede Platte, sepia', blur: .25, dunst: .55, kante: 'tusche', korn: .22, papier: .3, ton: 'rgba(160,110,60,.16)', schatten: 0},
  buntstift: {name: 'Buntstift', satz: 'krakelig, körnig, kräftige Farben (wie Janosch)', blur: .2, dunst: .4, kante: 'krakel', korn: .24, papier: .15, ton: 'rgba(255,230,180,.06)', schatten: 0},
  theater: {name: 'Papiertheater', satz: 'jede Platte wirft Schatten auf die dahinter', blur: .12, dunst: .5, kante: '', korn: .14, papier: .2, ton: '', schatten: 1}
};
/* ---------- 1c. Licht: Tageszeit und Wetter (v5.77; Nutzer 22.11.2026: „die Glasplatten sind super … besser ausarbeiten“; CLAUDE.md §3: Szenen hängen von Tageszeit und Wetter ab)
   Ein Licht = Farben (überschreibt P), ein Filter über die Welt (welt) und Atmosphäre davor (atmo). FILMB.licht(name) vor mount() aufrufen; danach ort() neu. */
const P0 = JSON.parse(JSON.stringify(P));
const LICHT = {
  mittag: {name: 'Später Vormittag', p: {}, welt: '', atmo: ['glanz']},
  morgen: {name: 'Morgendunst', p: {h: ['#c4b9cc', '#efd6c4', '#f7e9d6'], w: ['#aebfc2', '#5f8089'], nebel: .5, nebelFarbe: '#f6e7dc', sonne: {az: 105, el: .26, farbe: '#ffdcb2'}, ferne: '#bdb4bc', ferne2: '#a69fab', glanz: '#ffe8cf', wolke: '#fbe3d2'}, welt: 'sepia(.08) saturate(1.05)', atmo: ['strahlen', 'staub', 'glanz']},
  abend: {name: 'Abendgold', p: {h: ['#4f5384', '#e3946a', '#f7cf94'], w: ['#8f8aa2', '#3c4866'], nebel: .28, nebelFarbe: '#f3cfad', sonne: {az: 240, el: .14, farbe: '#ffbe72'}, ferne: '#7d7692', ferne2: '#6a6382', glanz: '#ffd29a', wolke: '#f6c49c', moewe: '#fbe2c6'}, welt: 'sepia(.18) saturate(1.12)', atmo: ['strahlen', 'staub', 'glanz']},
  nacht: {name: 'Nacht im Hafen', p: {h: ['#0b142c', '#1f2f57', '#34466e'], w: ['#2b3e5e', '#0f1b33'], nebel: .2, nebelFarbe: '#46557a', sonne: {az: 210, el: .62, farbe: '#e6ecfb'}, ferne: '#2b3553', ferne2: '#222a45', glanz: '#c6d4f0', wolke: '#58668a', hfenster: '#ffd27a', moewe: '#8a96b0'}, welt: 'brightness(.66) saturate(.78) hue-rotate(6deg)', atmo: ['sterne', 'lichter', 'glanz']},
  nebel: {name: 'Nebelbank', p: {h: ['#c6cbc7', '#dde0db', '#e8e9e4'], w: ['#aab6b3', '#7c8e8c'], nebel: .95, nebelFarbe: '#eceee9', sonne: {az: 130, el: .4, farbe: '#f5f5ee'}, ferne: '#c7ccc7', ferne2: '#b8beb9', wolke: '#eef0ec'}, welt: 'saturate(.72) contrast(.94)', atmo: ['ziehen', 'glanz']},
  blau: {name: 'Blaue Stunde (Skagen)', p: {h: ['#3c4878', '#8090bc', '#d6cfd9'], w: ['#7484aa', '#2e3a62'], nebel: .3, nebelFarbe: '#c8c4d8', sonne: {az: 250, el: .04, farbe: '#f6dcc4'}, ferne: '#6a7298', ferne2: '#5a6288', glanz: '#e6e2f2', wolke: '#b9b6d0'}, welt: 'saturate(.92)', atmo: ['glanz', 'staub']},
  regen: {name: 'Regen an der Scheibe', p: {h: ['#7c8891', '#a6b0b6', '#c3cacc'], w: ['#7e9396', '#3e5658'], nebel: .55, nebelFarbe: '#c8cfd1', sonne: {az: 130, el: .4, farbe: '#dfe3e3'}, ferne: '#98a1a0', ferne2: '#87918f', wolke: '#b9c1c4'}, welt: 'saturate(.8) brightness(.95)', atmo: ['regen', 'tropfen', 'glanz']}
};
let lichtName = 'mittag', atmoListe = null;
function lichtSetzen(n) {
  const L = LICHT[n] || LICHT.mittag; lichtName = LICHT[n] ? n : 'mittag';
  for (const k of Object.keys(P)) delete P[k]; Object.assign(P, JSON.parse(JSON.stringify(P0)), JSON.parse(JSON.stringify(L.p)));
  atmoListe = null; if (root) { glasUeberzug(); atmoBauen(); }
}
/* Atmosphäre vor den Platten: strahlen (Licht durch die Platten), staub (Bokeh: unscharfe Lichtpunkte ganz vorn), glanz (Spiegelung auf der vordersten Glasplatte),
   sterne, lichter (warme Fenster und Laternen), ziehen (Nebelbänke ziehen vorbei), regen, tropfen (Tropfen auf der Scheibe) */
const zz = (i, k) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
function atmoBauen() {
  const el = root && root.querySelector('.fb-atmo'); if (!el) return;
  const A = atmoListe || (LICHT[lichtName] || LICHT.mittag).atmo, c = P.sonne.farbe; let h = '';
  if (A.includes('strahlen')) h += `<div class="fa fa-strahlen" style="--c:${c}"></div>`;
  if (A.includes('ziehen')) h += `<div class="fa fa-ziehen"></div><div class="fa fa-ziehen b"></div>`;
  if (A.includes('sterne')) h += Array.from({length: 46}, (_, i) => `<i class="fa-st" style="left:${(zz(i, 1) * 100).toFixed(1)}%;top:${(zz(i, 2) * 40).toFixed(1)}%;width:${(1 + zz(i, 3) * 2).toFixed(1)}px;height:${(1 + zz(i, 3) * 2).toFixed(1)}px;animation-delay:-${(zz(i, 4) * 5).toFixed(1)}s"></i>`).join('');
  if (A.includes('lichter')) h += `<div class="fa fa-lichter"></div>`;
  if (A.includes('regen')) h += `<div class="fa fa-regen"></div><div class="fa fa-regen b"></div>`;
  if (A.includes('staub')) h += Array.from({length: 16}, (_, i) => { const g = 6 + zz(i, 5) * 26; return `<i class="fa-b" style="left:${(zz(i, 6) * 100).toFixed(1)}%;top:${(15 + zz(i, 7) * 75).toFixed(1)}%;width:${g.toFixed(0)}px;height:${g.toFixed(0)}px;--c:${c};filter:blur(${(g / 10).toFixed(1)}px);animation-duration:${(14 + zz(i, 8) * 16).toFixed(0)}s;animation-delay:-${(zz(i, 9) * 20).toFixed(0)}s"></i>`; }).join('');
  if (A.includes('tropfen')) h += Array.from({length: 26}, (_, i) => { const g = 5 + zz(i, 10) * 15; return `<i class="fa-t${i % 5 === 0 ? ' rinnt' : ''}" style="left:${(zz(i, 11) * 100).toFixed(1)}%;top:${(zz(i, 12) * 92).toFixed(1)}%;width:${g.toFixed(0)}px;height:${(g * 1.12).toFixed(0)}px;animation-delay:-${(zz(i, 13) * 18).toFixed(0)}s"></i>`; }).join('');
  if (A.includes('glanz')) h += `<div class="fa fa-glanz"></div>`;
  el.innerHTML = h;
}
function atmo(liste) { atmoListe = Array.isArray(liste) ? liste : null; atmoBauen(); }
let glasName = '', glasCfg = GLAS.weich;
function glasJetzt() { const g = (document.documentElement.dataset.glas || 'weich'); if (g !== glasName) { glasName = g; glasCfg = GLAS[g] || GLAS.weich; if (root) glasUeberzug(); } return glasCfg; }
function glasUeberzug() {
  const G = glasCfg; root.dataset.glas = glasName;
  const k = root.querySelector('.fb-korn'); if (k) k.style.opacity = G.korn;
  const pa = root.querySelector('.fb-papier'); if (pa) pa.style.opacity = G.papier;
  const t = root.querySelector('.fb-ton'); if (t) t.style.background = G.ton || 'transparent';
  const kr = root.querySelector('.fb-korn rect'); if (kr) kr.setAttribute('filter', glasName === 'buntstift' ? 'url(#fb-stift)' : 'url(#fb-korn)');
  const wl = root.querySelector('.fb-welt'); if (wl) wl.style.filter = (LICHT[lichtName] || {}).welt || '';
}
const mix = (a, b, t) => { const h = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const dunkel = (c, t = .18) => mix(c, '#000000', t), hell = (c, t = .2) => mix(c, '#ffffff', t);
const dreh = (art, wer, px, py) => ` data-dreh="${art}" data-wer="${wer || ''}" data-px="${px}" data-py="${py}"`;

/* ---------- 2. Figuren aus dem Crew-Baukasten (figuren.js, v5.72; Gesicht nach rechts, Füße bei 0,0) ----------
   Größen: die alten Figuren waren etwa 72 hoch; die Baukasten-Menschen sind 100 hoch (Smilla 88), darum die kleineren Maßstäbe unten. */
const C = (id, o = {}) => window.FIGUREN ? FIGUREN.figur(id, o) : '';
const hinnerk = (o = {}) => C('hinnerk', {blick: 'seite', wende: true, ...o});
const smilla = (o = {}) => C('smilla', {blick: 'seite', wende: true, ...o});
const hilke = (o = {}) => C('hilke', {blick: 'seite', pose: 'block', wende: true, ...o});
const katze = (o = {}) => C('backbord', {pose: 'sitzen', ...o});
function harmsBuste() { return window.FIGUREN ? `<g transform="translate(61 232) scale(2.3)">${FIGUREN.figur('harms', {blick: 'vorn', dreh: false})}</g>` : ''; }

/* ---------- 3. Die Frieda aus boot.js (Farben und Ausbau aus der Werft), Crew in den Plätzen des Boots ----------
   Hinnerk sitzt ohne Steuerrad an der Pinne und steht mit Steuerrad am Rad (Schalter nur-/nicht-steuerrad aus boot.js). */
const B = () => window.BOOT || null;
function friedaSeite(id) {
  const bo = B(); if (!bo) return `<g id="${id}"></g>`;
  /* Bug-rechts-Koordinaten (boot.js spiegelt mit bugLinks): Hinnerk achtern schaut zum Bug, Smilla vorn schaut nach achtern */
  const hinter = `<g class="nicht-steuerrad"><g transform="translate(-74 -14) scale(.4)">${hinnerk({pose: 'pinne'})}</g></g>
    <g class="nur-up nur-steuerrad"><g transform="translate(-50 -8) scale(.4)">${hinnerk({pose: 'steuern', pfeife: false})}</g></g>`;
  const vor = `<g transform="translate(52 -26) scale(-.37 .37)">${smilla()}</g><g id="${id}-katze" data-fest="" transform="translate(-6 -56) scale(-.46 .46)">${katze()}</g><g id="${id}-akt" data-fest=""></g>`;
  return `<g id="${id}"><g class="fb-bob">
    <g id="${id}-blasen" opacity="0">${[0, 1, 2, 3].map(i => `<circle class="fb-blase" data-i="${i}" cx="90" cy="6" r="2.4" fill="${P.glanz}" opacity=".8"/>`).join('')}</g>
    ${bo.seite({bugLinks: true, hinter, vor})}
    <g id="${id}-gischt" opacity="0"><path d="M-84 10 Q-96 4 -108 10 Q-96 8 -88 14Z" fill="${P.glanz}"/><path d="M-100 8 q-6 -5 -12 0" stroke="${P.glanz}" stroke-width="1.6" fill="none"/></g>
  </g></g>`;
}
/* v5.83 Charterboot im Hafenkino: fremde Farben (kein Ausbau), vier Männer hinter dem Schanzkleid (Bug-rechts-Koordinaten wie BOOT.seite), Bierdose bei der roten Mütze */
function charterBoot() {
  const bo = B(); if (!bo) return '';
  const m = (id, x, y, sk, o = {}) => `<g transform="translate(${x} ${y}) scale(${sk} ${Math.abs(sk)})">${C(id, {blick: 'seite', ...o})}</g>`;
  const crew = `<g id="gg-crew">${m('charter2', -54, -16, .36)}${m('charter1', -74, -16, .36)}${m('charter4', 30, -20, .35)}${m('charter3', 62, -22, -.36)}
    <g id="gg-dose" opacity="0" transform="translate(-65 -36)"><rect x="-2.3" y="-4.2" width="4.6" height="7.4" rx="1" fill="#c8382e" stroke="#5a1a10" stroke-width=".5"/><rect x="-2.3" y="-4.2" width="4.6" height="1.4" fill="#d9d9d9"/></g></g>`;
  return `<g class="fb-bob">${bo.seite({farbe: {rumpf: '#f6f3ec', streifen: '#2f6a9a', unterwasser: '#2b3b4a', dach: '#dfe6ea', schrift: '#2f6a9a', deck: '#e6e0d2'}, hinter: crew})}</g>`;
}
/* v5.83 Leih-Elektroboot (Folge 1-1): kleine Schale, zwei Sonnenhüte, leise */
function leihboot() {
  const kopf = (x, hut) => `<g transform="translate(${x} -15)"><rect x="-5" y="-2" width="10" height="11" rx="4" fill="${hut === 1 ? '#e05a4a' : '#5a8fc0'}"/><circle cx="0" cy="-5" r="4.4" fill="#f0c8a6"/><ellipse cx="0" cy="-8" rx="10" ry="2.6" fill="#e8cf8a" stroke="#b8963a" stroke-width=".7"/><path d="M-4.6 -8.4 Q0 -15 4.6 -8.4Z" fill="#e8cf8a" stroke="#b8963a" stroke-width=".7"/><path d="M-4.6 -9 H4.6" stroke="${hut === 1 ? '#c0392b' : '#2f6a9a'}" stroke-width="1.2"/></g>`;
  return `<g class="fb-bob"><path d="M-34 -6 H32 Q38 -6 34 2 Q30 8 22 8 H-28 Q-36 6 -34 -6Z" fill="#fbf8f2" stroke="#5f5446" stroke-width="1.6"/><path d="M-33 -1 H35" stroke="#3c8a5a" stroke-width="2.4"/>
    <path d="M-34 -6 H32" stroke="#5f5446" stroke-width="1.2"/>${kopf(-12, 1)}${kopf(8, 2)}<rect x="-38" y="-10" width="6" height="12" rx="2" fill="#3b3f44"/><path d="M-35 2 V12" stroke="#3b3f44" stroke-width="2"/></g>`;
}
function friedaHeck(id, uo) {
  const bo = B(); if (!bo) return `<g id="${id}"></g>`;
  const mitte = `<g transform="translate(40 -40) scale(.36)">${C('smilla', {blick: 'vorn'})}</g>
    <g class="nicht-steuerrad"><g transform="translate(-24 -12) scale(.42)">${C('hinnerk', {blick: 'ruecken', pose: 'pinne'})}</g></g>
    <g class="nur-up nur-steuerrad"><g transform="translate(26 -14) scale(.42)">${C('hinnerk', {blick: 'ruecken', pose: 'steuern'})}</g></g>`;
  return `<g id="${id}"><g class="fb-bob">${bo.heck({mitte, unterWasser: !!(uo && uo.unter), ohneSchraube: !!(uo && uo.ohneSchraube)})}
    <g id="${id}-blasen" opacity="0">${[0, 1, 2, 3].map(i => `<circle class="fb-blase" data-i="${i}" cx="0" cy="8" r="3" fill="${P.glanz}" opacity=".8"/>`).join('')}</g>
  </g></g>`;
}
function friedaD34H() {
  const bo = B(); if (!bo) return '';
  const vor = `<g transform="translate(-64 -24) scale(.36)">${smilla()}</g><g transform="translate(40 -26) scale(.4)">${C('hinnerk', {blick: 'ruecken', pose: 'pinne'})}</g>`;
  return `<g class="fb-bob">${bo.d34({vor})}</g>`;
}
const RUMPF_OBEN = 'M0 -50 C17 -36 20 -6 19 22 L18 46 Q18 50 14 50 L-14 50 Q-18 50 -18 46 L-19 22 C-20 -6 -17 -36 0 -50Z';
/* Draufsicht mit Höhenschichten (Nutzer 20.11.2026: „das Boot muss Tiefenwirkung bekommen, alles Hohe in den Vordergrund“) */
const HS = (h, inner, cx = 200, cy = 300, sk = 1.7) => `<g data-h="${h}" data-cx="${cx}" data-cy="${cy}" data-s="${sk}">${inner}</g>`;
function friedaOben3D() {
  const bo = B(); if (!bo) return '';
  /* Köpfe und Schultern von oben in den Farben des Baukastens */
  const v = (n, std) => `style="fill:var(--${n},${std})"`;
  return bo.oben({hs: (h, inner) => HS(h, inner)}) +
    HS(.42, `<g class="nicht-steuerrad"><ellipse cx="0" cy="36" rx="8.5" ry="5.5" ${v('hinnerk-jacke', '#34465f')}/></g><g class="nur-up nur-steuerrad"><ellipse cx="6" cy="30" rx="8.5" ry="5.5" ${v('hinnerk-jacke', '#34465f')}/></g>`) +
    HS(.58, `<g class="nicht-steuerrad"><circle cx="0" cy="37" r="5" ${v('hinnerk-hut', '#25304a')}/></g><g class="nur-up nur-steuerrad"><circle cx="6" cy="31" r="5" ${v('hinnerk-hut', '#25304a')}/></g>`) +
    HS(.4, `<ellipse cx="0" cy="-27" rx="6.5" ry="4.5" ${v('smilla-jacke', '#c8503c')}/>`) + HS(.52, `<circle cx="0" cy="-28" r="4.2" ${v('smilla-hut', '#2f6f8f')}/>`) +
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
  /* v5.82 (Nutzer 23.11.2026: „Möwen im neuen Stil, wie die Fabelwesen ohne Umrandung“): die Möwe aus figuren.js, sechs Flügelschläge vorgezeichnet (der Motor schaltet sie um, statt zu stauchen) */
  if (window.FIGUREN && FIGUREN.FIG.moewe) { const sx = x1 < x0 ? -s : s;
    return `<g data-moewe="${x0},${y0},${x1},${y1},${dur},${ph}"><g transform="scale(${r1(sx * 1.05)} ${r1(s * 1.05)}) translate(0 14)"><g class="fb-flug" data-bilder="6">${[0, 1, 2, 3, 4, 5].map(i => `<g${i ? ' style="display:none"' : ''}>${FIGUREN.figur('moewe', {pose: 'fliegen', t: i / 6 / 2, dreh: false, stil: 'flach'})}</g>`).join('')}</g></g></g>`; }
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
/* ---------- Kajüte als Glasbühne (v5.78; Nutzer 22.11.2026: „die Kajüte zum Durchklicken … verbessere alles“) ----------
   Rückwand mit Bullaugen (draußen Himmel und Wasser im aktuellen Licht), Wand mit Seekarte, Manöverbrett und Knotenbrett, Regal mit Büchern und Buddelschiff,
   Klabauter auf der Stange, Kartentisch mit Lampe und Telefon, vorn Hocker und Backbord. Die Kamera fährt zu den Dingen (EINST.innen). */
/* ---------- Kajüte als Panorama zum Wischen (v5.81, Nutzer 23.11.2026) ----------
   Aufteilung wie die alte Wisch-Kajüte (szenerie.js): links Koje mit Bücherregal und Kombüse, Mitte Telefon, Uhr und Barometer, zwei Bullaugen, Knotenbrett unter der Lampe,
   Hinnerk und Smilla am runden Tisch, vorn Hocker und Backbord, rechts Klabauter, Manöverbrett, Seekarte, Funk, Kartentisch, Ölzeug, Niedergang, Rettungsring, Glocke, Kiste.
   Welt in sichtbaren Einheiten: x −320 … 665, y 0 … 500 (so hoch ist die Bühne im Hochformat), Start in der Mitte (x 200). Fünf Ebenen; beim Wischen wandern nahe etwas schneller.
   Die Gegenstände mit Funktion sind eigene Funktionen (FILMB.teile), damit die Nahansicht dasselbe Bild scharf zeigt. */
const r1 = n => Math.round(n * 10) / 10;
const KJ = {holz: '#6e4a2e', holzH: '#946640', holzD: '#45291a', dunkel: '#2e1d10', messing: '#c9a03c', messingD: '#7d5c1c', papier: '#f1e4c2', rot: '#b8402e', rotD: '#7a2018', gruen: '#3c7a52', blau: '#2f4f80', tinte: '#2a1a0e', schrift: 'Nunito, Segoe UI, sans-serif'};
const KNOTEN_BRETT = ['acht', 'kreuz', 'palstek', 'schot', 'stopper', 'webelein', 'webeleinslip', 'rundtoern', 'klampe'];
const KNOTEN_SCHILD = {acht: ['Achtknoten'], kreuz: ['Kreuzknoten'], palstek: ['Palstek'], schot: ['Schotstek'], stopper: ['Stopperstek'], webelein: ['Webeleinstek'],
  webeleinslip: ['Webeleinstek', 'auf Slip'], rundtoern: ['Rundtörn mit', '2 halben Schlägen'], klampe: ['Klampe', 'belegen']};
/* Text auf einem Schild: Schriftgröße so, dass die längste Zeile hineinpasst (Nutzer: „die Schrift muss von der Größe her unter die Knoten passen“) */
function schild(x, y, w, h, zeilen, o = {}) {
  const n = zeilen.length, lang = Math.max(...zeilen.map(z => z.length)), fs = Math.min(o.max || h * (n > 1 ? .4 : .58), (w * .9) / (lang * .54)), lh = fs * 1.12, y0 = y + h / 2 - (n - 1) * lh / 2 + fs * .35;
  return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${r1(h * .18)}" fill="${o.grund || KJ.messing}" stroke="${o.rand || KJ.messingD}" stroke-width=".6"/>`
    + `<path d="M${r1(x + 1)} ${r1(y + .9)} h${r1(w - 2)}" stroke="#f3dc8e" stroke-width=".5" opacity=".7"/>`
    + zeilen.map((z, i) => `<text x="${r1(x + w / 2)}" y="${r1(y0 + i * lh)}" font-family="${KJ.schrift}" font-weight="800" font-size="${r1(fs * 100) / 100}" fill="${o.farbe || '#3a2508'}" text-anchor="middle">${z}</text>`).join('');
}
/* Knoten auf dem Knotenbrett: Endbild der echten Tau-Animation (knoten.js) im Stil „Feder laviert“, sonst eine schlichte Schlaufe */
const knotBild = (a, x, y, w, h) => {
  const K_ = window.KNOTEN; if (K_ && K_.endbild && K_.ANIM && K_.ANIM[a]) return `<image href="${K_.endbild(a, {stil: K_.LAVIERT.stil, wash: K_.LAVIERT.wash, skala: 1.5})}" x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" preserveAspectRatio="xMidYMid meet"/>`;
  const cx = x + w / 2, cy = y + h / 2; return `<path d="M${r1(cx)} ${r1(y + 2)} V${r1(cy - 4)} q-6 2 -5 9 q3 6 6 0 q2 -7 -3 -8 M${r1(cx + 1.5)} ${r1(cy + 5)} V${r1(y + h - 2)}" stroke="#dcc08a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
};
/* Das Knotenbrett: hochkant, unter jedem Knoten ein Messingschild mit dem Namen */
const BRETT = {x: 150, y: 104, w: 100, h: 172};
function knotenbrett() {
  const {x, y, w, h} = BRETT, ix = x + 7, iy = y + 21, iw = w - 14, ih = h - 28, cw = iw / 3, ch = ih / 3;
  let s = `<g id="fk-knotenbrett"><rect x="${x + 3}" y="${y + 5}" width="${w}" height="${h}" rx="4" fill="#1a0f08" opacity=".3"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#7a5233" stroke="#3a2412" stroke-width="2"/><rect x="${x + 2.5}" y="${y + 2.5}" width="${w - 5}" height="${h - 5}" rx="3" fill="none" stroke="#9a6c42" stroke-width="1.2"/>
    <rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="2" fill="#2c3e54" stroke="#1d2a38" stroke-width="1.4"/><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="2" fill="url(#kj-filz)" opacity=".5"/>`;
  s += schild(x + 22, y + 5, w - 44, 11, ['KNOTEN'], {max: 6.4});
  s += [[x + 5, y + 5], [x + w - 5, y + 5], [x + 5, y + h - 5], [x + w - 5, y + h - 5]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.7" fill="${KJ.messing}" stroke="${KJ.messingD}" stroke-width=".5"/>`).join('');
  KNOTEN_BRETT.forEach((k, i) => { const cx = ix + (i % 3) * cw, cy = iy + (i / 3 | 0) * ch;
    s += `<circle cx="${r1(cx + cw / 2)}" cy="${r1(cy + 2.6)}" r="1.3" fill="${KJ.messing}"/>` + knotBild(k, cx + 1.6, cy + 3.4, cw - 3.2, ch * .66) + schild(cx + 2.2, cy + ch * .73, cw - 4.4, ch * .22, KNOTEN_SCHILD[k]); });
  return s + '</g>';
}
/* Manöverbrett: vier Bildtafeln mit Schildern (Praxis im 3D-Fenster) */
const MANOEVER = [['Ablegen', 'ab'], ['Anlegen', 'an'], ['Wenden', 'wenden'], ['Mensch', 'mob']];
function manoeverbrett() {
  const x = 372, y = 44, w = 82, h = 82;
  const bild = (art, bx, by) => { const boot = (tx, ty, r) => `<g transform="translate(${tx} ${ty}) rotate(${r})"><path d="M0 -6 Q3 -2 3 4 L-3 4 Q-3 -2 0 -6Z" fill="#f3ead2" stroke="#1d2a38" stroke-width=".6"/></g>`;
    const pf = d => `<path d="${d}" stroke="#f0a23a" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    if (art === 'ab') return `<rect x="${bx + 2}" y="${by + 3}" width="5" height="22" fill="#8a6440"/>` + boot(bx + 11, by + 15, 0) + pf(`M${bx + 13} ${by + 8} q8 -2 12 -6 m-3 0 l3 0 l-1 3`);
    if (art === 'an') return `<rect x="${bx + 3}" y="${by + 3}" width="5" height="22" fill="#8a6440"/>` + boot(bx + 17, by + 16, -28) + pf(`M${bx + 28} ${by + 22} q-6 -2 -11 -8 m3 0 l-3 0 l0 3`);   /* Pier links: Anlegen mit Backbord (Rechtsdreher) */
    if (art === 'wenden') return boot(bx + 15, by + 19, 0) + pf(`M${bx + 15} ${by + 12} q-1 -9 7 -8 q6 1 4 8 m-2 -2 l2 2 l2 -2`);
    return `<circle cx="${bx + 16}" cy="${by + 12}" r="5.6" fill="none" stroke="#e8e2d0" stroke-width="2.4"/><circle cx="${bx + 16}" cy="${by + 12}" r="5.6" fill="none" stroke="${KJ.rot}" stroke-width="2.4" stroke-dasharray="2.2 2.2"/><circle cx="${bx + 16}" cy="${by + 7.4}" r="1.6" fill="#f0c8a6"/>` + boot(bx + 7, by + 22, -60);
  };
  let s = `<g id="fk-manoever"><rect x="${x + 2.5}" y="${y + 4}" width="${w}" height="${h}" rx="3" fill="#1a0f08" opacity=".3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${KJ.holzH}" stroke="${KJ.holzD}" stroke-width="2"/>`;
  s += schild(x + 18, y + 4, w - 36, 9.5, ['MANÖVER'], {max: 5.6});
  MANOEVER.forEach(([n, art], i) => { const bx = x + 5 + (i % 2) * 37, by = y + 17 + (i / 2 | 0) * 32;
    s += `<rect x="${bx}" y="${by}" width="35" height="22" rx="1.5" fill="#2c3e54" stroke="#1d2a38" stroke-width=".8"/>` + `<g transform="translate(${bx + 1.5} ${by - 2}) scale(.95)">${bild(art, 0, 0)}</g>` + schild(bx + 3, by + 23, 29, 7, [n]); });
  return s + '</g>';
}
/* Bücherregal über der Koje: Lernkartei und Meine Prüfungen; Lesezeichen in den Farben des Lernstands */
const BUECHER = [['Meine Prüfungen', '#9a3a2a', 14, 'gruen'], ['Lernkartei', '#2f4f80', 12, 'gelb'], ['Lichter', '#3c7a52', 9, 'gruen'], ['Seezeichen', '#c99a3c', 10, 'hell'], ['Fahrregeln', '#6b4a7a', 10, 'gelb'],
  ['Navigation', '#2f6a7a', 11, 'rot'], ['Recht', '#7a5a3a', 8, 'hell'], ['Wetter', '#4a6a9a', 8, 'rot'], ['Merksätze', '#b8402e', 9, 'gelb']];
const LESEZ = {rot: '#d0443a', gelb: '#e8b33c', hell: '#8fc46a', gruen: '#2f8a4a'};
function buecherregal() {
  const x = -300, y = 160, w = 128;
  let s = `<g id="fk-buecher"><rect x="${x - 2}" y="${y + 44}" width="${w + 4}" height="6" fill="${KJ.holzH}" stroke="${KJ.holzD}" stroke-width="1"/><path d="M${x + 2} ${y + 50} l6 8 h-6z M${x + w - 2} ${y + 50} l-6 8 h6z" fill="${KJ.holzD}"/>`;
  let bx = x + 3;
  BUECHER.forEach(([t, c, bw, lz], i) => { const bh = 34 + (i % 3) * 3 + (i === 0 ? 6 : 0), by = y + 44 - bh, kipp = i === BUECHER.length - 1 ? 8 : 0;
    s += `<g transform="rotate(${kipp} ${r1(bx + bw)} ${y + 44})"><rect x="${r1(bx)}" y="${by}" width="${bw}" height="${bh}" rx="1.2" fill="${c}" stroke="${KJ.tinte}" stroke-width=".6"/>`
      + `<path d="M${r1(bx + 1)} ${by + 4} h${bw - 2} M${r1(bx + 1)} ${by + bh - 4} h${bw - 2}" stroke="#e8d7a8" stroke-width=".8" opacity=".8"/>`
      + `<text transform="translate(${r1(bx + bw / 2 + 1.3)} ${r1(by + bh / 2)}) rotate(-90)" font-family="${KJ.schrift}" font-weight="800" font-size="${r1(Math.min(bw * .5, (bh - 10) / (t.length * .55)) * 100) / 100}" fill="#f6edd6" text-anchor="middle">${t}</text>`
      + `<path d="M${r1(bx + bw * .6)} ${by} v-1 l1.4 9 l1.4 -9 v1z" fill="${LESEZ[lz]}" transform="translate(0 0)"/><path d="M${r1(bx + bw * .6 + 1.4)} ${by - 1} v10" stroke="${LESEZ[lz]}" stroke-width="2.2"/></g>`;
    bx += bw + 1; });
  return s + '</g>';
}
/* Seekarte an der Wand (Navigationsschule) */
function seekarteWand() {
  const x = 352, y = 134, w = 106, h = 66;
  return `<g id="fk-seekarte"><rect x="${x + 2}" y="${y + 3}" width="${w}" height="${h}" fill="#1a0f08" opacity=".28"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f6efdc" stroke="${KJ.holzD}" stroke-width="2.2"/>
    <path d="M${x} ${y + 30} Q${x + 18} ${y + 22} ${x + 30} ${y + 34} T${x + 60} ${y + 40} T${x + 84} ${y + 26} L${x + 106} ${y + 22} V${y + 66} H${x}Z" fill="#efd9a8"/><path d="M${x} ${y + 30} Q${x + 18} ${y + 22} ${x + 30} ${y + 34} T${x + 60} ${y + 40} T${x + 84} ${y + 26} L${x + 106} ${y + 22}" stroke="#8a6a3a" stroke-width=".9" fill="none"/>
    <path d="M${x} ${y + 28} Q${x + 18} ${y + 19} ${x + 30} ${y + 31} T${x + 60} ${y + 37} T${x + 84} ${y + 23} L${x + 106} ${y + 19}" stroke="#a9cfe0" stroke-width="2.4" fill="none" opacity=".8"/>
    <path d="M${x + 14} ${y + 14} L${x + 52} ${y + 10} L${x + 88} ${y + 16}" stroke="${KJ.rot}" stroke-width="1" stroke-dasharray="3 2" fill="none"/>${[[14, 14], [52, 10], [88, 16]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="1.6" fill="${KJ.rot}"/>`).join('')}
    <g transform="translate(${x + 92} ${y + 46})"><circle r="8.5" fill="#fff8e6" stroke="#8a6a3a" stroke-width=".6"/><path d="M0 -8 L1.6 0 L0 8 L-1.6 0Z" fill="#8a6a3a"/><path d="M-8 0 L0 1.6 L8 0 L0 -1.6Z" fill="#c4a06a"/><text y="-9.6" font-family="${KJ.schrift}" font-weight="800" font-size="3.4" text-anchor="middle" fill="#8a6a3a">N</text></g>
    <path d="M${x + 22} ${y + 50} l14 -12 M${x + 22} ${y + 50} l6 4" stroke="#5a5a5a" stroke-width="1" fill="none"/><circle cx="${x + 36}" cy="${y + 38}" r="1" fill="#5a5a5a"/>
    ${schild(x + 30, y + h - 12, 46, 9, ['NAVIGATION'], {max: 5})}${[[x + 3, y + 3], [x + w - 3, y + 3]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.6" fill="${KJ.rot}"/>`).join('')}</g>`;
}
/* Telefon (Harms prüft): rotes Wandtelefon mit Wählscheibe, Hörer auf der Gabel, Zettel daneben */
function telefon() {
  return `<g id="fk-telefon" transform="translate(-26 0)"><path d="M42 148 q14 -2 16 10 q2 14 -6 26" stroke="${KJ.tinte}" stroke-width="1.2" fill="none"/>
    <rect x="20" y="136" width="40" height="44" rx="6" fill="${KJ.rot}" stroke="${KJ.rotD}" stroke-width="1.6"/><circle cx="40" cy="162" r="11" fill="#f6efe2" stroke="${KJ.rotD}" stroke-width="1.2"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => { const a = (i * 30 - 60) * Math.PI / 180; return `<circle cx="${r1(40 + Math.cos(a) * 7.4)}" cy="${r1(162 + Math.sin(a) * 7.4)}" r="1.6" fill="none" stroke="${KJ.rotD}" stroke-width=".6"/>`; }).join('')}<circle cx="40" cy="162" r="3" fill="${KJ.rot}"/>
    <path d="M14 136 q26 -12 52 0 l-3 6 q-23 -9 -46 0z" fill="${KJ.rotD}" stroke="${KJ.tinte}" stroke-width=".8"/><circle cx="16" cy="139" r="4.2" fill="${KJ.rotD}"/><circle cx="64" cy="139" r="4.2" fill="${KJ.rotD}"/>
    <g transform="rotate(-6 44 198)"><rect x="34" y="186" width="20" height="24" fill="#fbf4dc" stroke="#b9a274" stroke-width=".6"/><circle cx="44" cy="187.5" r="1.4" fill="${KJ.rot}"/><text x="44" y="195" font-family="${KJ.schrift}" font-weight="800" font-size="3.6" fill="${KJ.rotD}" text-anchor="middle">HARMS</text>
    <path d="M37 199 h14 M37 203 h11 M37 207 h13" stroke="#8a7a5a" stroke-width=".7"/></g>
    <g id="fk-ab"><rect x="62" y="166" width="19" height="14" rx="2" fill="#3a3e42" stroke="${KJ.tinte}" stroke-width=".6"/><rect x="64.5" y="169" width="9" height="5.6" rx="1" fill="#1f2226"/><circle cx="66.8" cy="171.8" r="1.4" fill="#5a5e62"/><circle cx="71.2" cy="171.8" r="1.4" fill="#5a5e62"/><circle class="fk-ab-lampe" cx="77.5" cy="171.6" r="1.5" fill="#e8463c"/></g></g>`;   /* v5.83 Anrufbeantworter (1-1: Harms spricht drauf) */
}
function bullauge(x, y, r, inhalt = '') {
  const id = 'kjb' + Math.round(x + 1000);
  return `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#${id})"><rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${r * 1.12}" fill="url(#fb-hg)"/><rect x="${x - r}" y="${r1(y + r * .12)}" width="${2 * r}" height="${r}" fill="url(#fb-wg)"/>
    <path d="M${x - r * 1.6} ${r1(y + r * .32)} q${r1(r * .4)} -3 ${r1(r * .8)} 0 t${r1(r * .8)} 0 t${r1(r * .8)} 0 t${r1(r * .8)} 0" stroke="${P.glanz}" stroke-width="1.3" fill="none" opacity=".7" data-welle="4,1,${x % 5},${r1(r * .8)}"/>${inhalt}</g>
    <circle cx="${x}" cy="${y}" r="${r}" fill="url(#kj-glas)"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${KJ.messing}" stroke-width="6"/><circle cx="${x}" cy="${y}" r="${r + 5}" fill="none" stroke="${KJ.holzD}" stroke-width="2"/>
    ${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${r1(x + (r + 2.4) * Math.cos(a * Math.PI / 180))}" cy="${r1(y + (r + 2.4) * Math.sin(a * Math.PI / 180))}" r="1.7" fill="#ead08a"/>`).join('')}
    <path d="M${r1(x - r * .55)} ${r1(y - r * .5)} Q${r1(x - r * .2)} ${r1(y - r * .82)} ${r1(x + r * .3)} ${r1(y - r * .72)}" stroke="#fff" stroke-width="2.4" opacity=".35" fill="none" stroke-linecap="round"/>`;
}
function gardine(x, sd, y0, y1) { const m = y1 - y0; return `<g class="fk-gard"><path d="M${x} ${y0} Q${x + sd * 11} ${r1(y0 + m * .26)} ${x + sd * 5} ${r1(y0 + m * .55)} Q${x + sd * 2} ${r1(y0 + m * .78)} ${x + sd * 9} ${y1} L${x + sd * 22} ${y1} Q${x + sd * 17} ${r1(y0 + m * .72)} ${x + sd * 21} ${r1(y0 + m * .45)} Q${x + sd * 24} ${r1(y0 + m * .2)} ${x + sd * 19} ${y0}Z" fill="url(#fk-karo)" stroke="#8a2a22" stroke-width="1.2"/><path d="M${x + sd * 4} ${r1(y0 + m * .62)} q${sd * 8} 5 ${sd * 18} 0" stroke="#8a2a22" stroke-width="2.4"/></g>`; }
function kajueteEbenen() {
  const {holz, holzH, holzD, dunkel, messing, papier, tinte} = KJ;
  const std = uhrMin != null ? {getHours: () => Math.floor(uhrMin / 60) % 24, getMinutes: () => uhrMin % 60} : new Date(), stunde = std.getHours() % 12 + std.getMinutes() / 60;   /* v5.83: Film zeigt die Zeit der Szene */
  /* Licht (v5.82, Nutzer: „Licht könnte schöner fallen, gemütlicher“): warme Lampe, Lichtbahnen aus den Bullaugen (tags), dunklere Ecken; nachts nur Lampe und Mondlicht */
  const nacht = lichtName === 'nacht', abend = lichtName === 'abend' || lichtName === 'blau', grau = lichtName === 'nebel' || lichtName === 'regen';
  const strahlF = nacht ? '#bcd0ff' : abend ? '#ffc98a' : grau ? '#e6ece9' : '#fff1c2', strahlO = nacht ? .07 : grau ? .08 : abend ? .2 : .16, lampeO = nacht ? .6 : abend ? .5 : .4;
  /* Ebene 0: Wand, Decke, Boden, Bullaugen (Blick aufs Wasser) */
  let wand = `<defs><pattern id="fk-karo" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#f6efe2"/><rect width="3.5" height="7" fill="#c0392b" opacity=".55"/><rect width="7" height="3.5" fill="#c0392b" opacity=".55"/></pattern>
    <pattern id="kj-filz" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#41566e"/><circle cx="3" cy="3" r=".5" fill="#22303f"/></pattern>
    <radialGradient id="kj-glas" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="kj-lampe" cx="200" cy="210" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffc96e" stop-opacity="${lampeO}"/><stop offset=".5" stop-color="#e8a33c" stop-opacity="${r1(lampeO * .42)}"/><stop offset="1" stop-color="#e8a33c" stop-opacity="0"/></radialGradient>
    <linearGradient id="kj-rand" x1="-330" x2="680" y1="0" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1a0e06" stop-opacity="${nacht ? .7 : .55}"/><stop offset=".3" stop-color="#1a0e06" stop-opacity="0"/><stop offset=".7" stop-color="#1a0e06" stop-opacity="0"/><stop offset="1" stop-color="#1a0e06" stop-opacity="${nacht ? .66 : .5}"/></linearGradient>
    <linearGradient id="kj-oben" x1="0" y1="-80" x2="0" y2="150" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#140a04" stop-opacity="${nacht ? .62 : .48}"/><stop offset="1" stop-color="#140a04" stop-opacity="0"/></linearGradient>
    <linearGradient id="kj-strahl" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="${strahlF}" stop-opacity="${strahlO}"/><stop offset="1" stop-color="${strahlF}" stop-opacity="0"/></linearGradient>
    <linearGradient id="kj-luke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></linearGradient></defs>
    <rect x="-720" y="-80" width="1900" height="720" fill="${holz}"/>`;
  for (let y = 36, r = 0; y < 377; y += 15, r++) { wand += `<path d="M-720 ${y} H1180" stroke="${holzD}" stroke-width="1.1" opacity=".5"/>`; for (let x = -700 + (r % 3) * 70; x < 1180; x += 210) wand += `<path d="M${x} ${y} v15" stroke="${holzD}" stroke-width=".9" opacity=".35"/>`; }
  [[-250, 128], [-42, 302], [118, 238], [338, 330], [560, 182], [22, 62], [-120, 56], [430, 260]].forEach(([x, y]) => { wand += `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="1.9" fill="${holzD}" opacity=".45"/><ellipse cx="${x}" cy="${y}" rx="7" ry="3.2" fill="none" stroke="${holzD}" stroke-width=".6" opacity=".3"/>`; });
  wand += `<rect x="-720" y="-80" width="1900" height="114" fill="${dunkel}"/>` + Array.from({length: 21}, (_, i) => { const x = -700 + i * 92; return `<rect x="${x}" y="-80" width="22" height="118" fill="#3c2614"/><rect x="${x}" y="30" width="22" height="7" fill="#24160b"/>`; }).join('')
    + `<path d="M-720 37 H1180" stroke="#8a6440" stroke-width="2.2"/>`;
  [-160, -2, 320, 478].forEach(x => { wand += `<rect x="${x - 7}" y="37" width="14" height="341" fill="${holzD}"/><path d="M${x - 3.6} 37 V378" stroke="#7a5233" stroke-width="1.6" opacity=".7"/>`; });
  wand += `<rect x="-720" y="376" width="1900" height="260" fill="#4a2e1a"/>` + [384, 395, 409, 427, 449, 476, 508, 546].map((y, i) => `<path d="M-720 ${y} H1180" stroke="#2c1a0d" stroke-width="${1 + i * .25}" opacity=".7"/>`).join('')
    + [389, 401, 417, 437, 461, 491, 526].map((y, i) => `<path d="M-720 ${y} H1180" stroke="#5c3a22" stroke-width="${r1(.6 + i * .15)}" opacity=".5"/>`).join('')
    + `<rect x="-720" y="372" width="1900" height="7" fill="#2a180c"/><path d="M-720 372 H1180" stroke="#8a6440" stroke-width="1.2" opacity=".7"/>`;
  wand += bullauge(-215, 98, 26) + bullauge(-77, 92, 26) + bullauge(105, 152, 30) + bullauge(295, 152, 30);
  /* Niedergang: Luke mit Tageslicht oben rechts */
  wand += [[-215, 98, 26], [-77, 92, 26], [105, 152, 30], [295, 152, 30]].map(([x, y, r]) => `<path d="M${x - r * .8} ${y - r * .3} L${x + r * .7} ${y - r * .6} L${x + r * 3.6} 378 L${x + r * .4} 378Z" fill="url(#kj-strahl)"/>`).join('')
    + `<rect x="-720" y="-80" width="1900" height="720" fill="url(#kj-lampe)"/><rect x="-720" y="-80" width="1900" height="720" fill="url(#kj-oben)"/><rect x="-720" y="-80" width="1900" height="720" fill="url(#kj-rand)"/>`;

  /* Ebene .12: was an der Wand hängt */
  let w2 = `<g><path d="M-318 28 Q-245 66 -172 30" stroke="#9a8a6a" stroke-width=".8" fill="none"/>${Array.from({length: 9}, (_, i) => { const x = -312 + i * 17; return `<path d="M${x} 30 L${x + 8} 58 L${x + 16} 30" stroke="#9a8a6a" stroke-width=".6" fill="none" opacity=".8"/>`; }).join('')}
      ${[[-290, 50, '#7aa0a8'], [-250, 58, '#4f7f96'], [-206, 50, '#c9b26a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}" opacity=".85"/><circle cx="${x - 2.6}" cy="${y - 2.6}" r="2.2" fill="#fff" opacity=".5"/>`).join('')}</g>`;
  w2 += buecherregal();
  /* Kombüse an der Wand: Tellerbord mit Bechern */
  w2 += `<g><rect x="-142" y="132" width="128" height="72" fill="${holzD}" opacity=".35"/><rect x="-144" y="130" width="128" height="6" fill="${holzH}" stroke="${holzD}"/><rect x="-144" y="166" width="128" height="5" fill="${holzH}" stroke="${holzD}"/><rect x="-144" y="200" width="128" height="6" fill="${holzH}" stroke="${holzD}"/>
      ${Array.from({length: 8}, (_, i) => `<ellipse cx="${-132 + i * 14}" cy="151" rx="6" ry="13" fill="#f3efe4" stroke="#a49a86" stroke-width=".8"/><ellipse cx="${-132 + i * 14}" cy="151" rx="3.4" ry="8" fill="none" stroke="#5f7fa0" stroke-width=".8"/>`).join('')}
      <path d="M-142 158 H-18" stroke="${holzH}" stroke-width="2.6"/>${[[-130, '#b8402e'], [-112, '#2f6a9a'], [-94, '#e8b33c'], [-76, '#3c7a52']].map(([x, c]) => `<path d="M${x} 186 h12 v11 q0 4 -4 4 h-4 q-4 0 -4 -4z" fill="${c}" stroke="${tinte}" stroke-width=".7"/><path d="M${x + 12} 189 q5 0 4 5 q-1 3 -4 2" fill="none" stroke="${tinte}" stroke-width="1"/>`).join('')}
      <path d="M-50 176 v20 M-40 176 v24 M-30 176 v18" stroke="#8a8a88" stroke-width="1.6"/><circle cx="-50" cy="199" r="3" fill="#9a9a96"/><path d="M-43 200 h6 v6 h-6z" fill="#9a9a96"/><ellipse cx="-30" cy="196" rx="3.2" ry="2" fill="#9a9a96"/></g>`;
  /* Uhr und Barometer, Telefon, Pflanzenbord */
  w2 += `<g id="fk-uhr" transform="translate(-24 -4)"><rect x="8" y="66" width="86" height="46" rx="8" fill="${holzH}" stroke="${holzD}" stroke-width="1.6"/>
      <g><circle cx="31" cy="89" r="17" fill="#fffaf0" stroke="${messing}" stroke-width="3.4"/>${Array.from({length: 12}, (_, i) => { const a = i * 30 * Math.PI / 180; return `<path d="M${r1(31 + Math.sin(a) * 13.4)} ${r1(89 - Math.cos(a) * 13.4)} L${r1(31 + Math.sin(a) * 15)} ${r1(89 - Math.cos(a) * 15)}" stroke="${tinte}" stroke-width="${i % 3 ? .6 : 1.3}"/>`; }).join('')}
        <path d="M31 89 L${r1(31 + Math.sin(stunde / 12 * 6.283) * 8.5)} ${r1(89 - Math.cos(stunde / 12 * 6.283) * 8.5)}" stroke="${tinte}" stroke-width="1.8" stroke-linecap="round"/><path d="M31 89 L${r1(31 + Math.sin(std.getMinutes() / 60 * 6.283) * 12)} ${r1(89 - Math.cos(std.getMinutes() / 60 * 6.283) * 12)}" stroke="${tinte}" stroke-width="1.1" stroke-linecap="round"/><g class="fk-sekunde"><path d="M31 92 V76" stroke="${KJ.rot}" stroke-width=".6"/></g><circle cx="31" cy="89" r="1.3" fill="${tinte}"/></g>
      <g id="fk-baro"><circle cx="72" cy="89" r="17" fill="#fffaf0" stroke="${messing}" stroke-width="3.4"/><path d="M60 95 A13 13 0 1 1 84 95" stroke="#d8c49a" stroke-width="3" fill="none"/><path d="M60 95 A13 13 0 0 1 64 79" stroke="#6f9ec4" stroke-width="3" fill="none"/><path d="M80 79 A13 13 0 0 1 84 95" stroke="#e8b33c" stroke-width="3" fill="none"/>
        <g class="bnadel" style="transform-box:fill-box;transform-origin:0% 100%;transition:transform .8s"><path d="M72 89 L76 77" stroke="${tinte}" stroke-width="1.3" stroke-linecap="round"/></g><circle cx="72" cy="89" r="1.4" fill="${messing}"/><text x="72" y="101" font-family="${KJ.schrift}" font-weight="800" font-size="3.4" fill="#8a6a3a" text-anchor="middle">BARO</text></g></g>`;
  w2 += telefon();
  w2 += `<g><rect x="4" y="232" width="84" height="5" fill="${holzH}" stroke="${holzD}"/><path d="M8 237 l5 7 h-5z M84 237 l-5 7 h5z" fill="${holzD}"/>
      <path d="M14 232 l3 -14 h12 l3 14z" fill="#b8742e" stroke="${tinte}" stroke-width=".7"/><path d="M23 218 q-8 -14 -2 -22 M23 218 q4 -16 12 -18 M23 218 q-1 -12 4 -20 M23 218 q-10 -6 -14 -14" stroke="#4f7a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <rect x="42" y="214" width="12" height="18" rx="2" fill="#e9dcc0" stroke="${tinte}" stroke-width=".7"/><rect x="42" y="214" width="12" height="5" rx="1" fill="#c0392b"/><rect x="58" y="210" width="18" height="22" rx="1.5" fill="#2f6a7a" stroke="${tinte}" stroke-width=".7"/><text x="67" y="224" font-family="${KJ.schrift}" font-weight="800" font-size="4" fill="#f3ead2" text-anchor="middle">TEE</text></g>`;
  /* Gardinen, Wimpel, Knotenbrett, Bild, Manöverbrett, Seekarte, Ölzeug, Rettungsring, Glocke */
  w2 += gardine(70, -1, 108, 196) + gardine(140, 1, 108, 196) + gardine(260, -1, 108, 196) + gardine(330, 1, 108, 196) + `<path d="M64 110 H146 M254 110 H336" stroke="${messing}" stroke-width="2.4" stroke-linecap="round"/>`
    + `<g id="kj-schaelchen"><path d="M276 110 v3.6 M286 110 v3.6" stroke="#6b4a2a" stroke-width=".8"/><path d="M272.5 113.4 h17 q-1.2 6.4 -8.5 6.4 q-7.3 0 -8.5 -6.4z" fill="#e9e1cf" stroke="#3a2a1c" stroke-width=".8"/><path d="M274 114.6 h14" stroke="#2f6a9a" stroke-width="1"/></g>`   /* Klabauters Schälchen an der Stange (1-1: „Der Zwieback ist weg!“) */
    + `<g id="fk-klabauter" data-fest="" transform="translate(302 110) scale(1.3)">${C('klabauter', {pose: 'sitzen'})}</g>`;  /* Klabauter sitzt auf der Gardinenstange (gleiche Ebene, damit er beim Wischen nicht verrutscht) */
  w2 += `<path d="M58 46 Q200 76 342 46" stroke="${holzD}" stroke-width="1.2" fill="none"/>` + Array.from({length: 11}, (_, i) => { const x = 62 + i * 26, y = 47 + Math.sin(i / 10 * Math.PI) * 13; return `<path d="M${x} ${r1(y)} L${x + 15} ${r1(y + 1)} L${x + 7.5} ${r1(y + 15)}Z" fill="${['#c0392b', '#e8b33c', '#3c7a52', '#2f6a9a', '#f3ead2'][i % 5]}" stroke="${holzD}" stroke-width=".7"/>`; }).join('');
  w2 += knotenbrett();
  w2 += `<g><rect x="331" y="54" width="27" height="34" fill="#c9a03c" stroke="${holzD}" stroke-width="1.4"/><rect x="334" y="57" width="21" height="28" fill="#bcd6dc"/><path d="M334 78 q5 -3 10 0 t11 0 V85 H334Z" fill="#4f7a8a"/><path d="M343 78 V64 h3 V78" fill="#f3ead2" stroke="${tinte}" stroke-width=".5"/><path d="M342 64 h5 l-2.5 -3z" fill="${KJ.rot}"/></g>`;
  w2 += manoeverbrett() + seekarteWand();
  /* Ölzeug: v5.83 um 38 nach rechts, damit es mit der stärkeren Tiefe (kajOff) nicht über Manöverbrett und Seekarte hängt */
  w2 += `<g transform="translate(38 0)"><circle cx="469" cy="88" r="2.4" fill="${messing}"/><path d="M462 104 Q469 84 476 104" fill="#d9a82a" stroke="#8a6a12" stroke-width="1"/>
      <path d="M452 196 L455 108 Q469 100 483 108 L486 196 Q469 202 452 196Z" fill="#e7b730" stroke="#8a6a12" stroke-width="1.2"/><path d="M469 104 V198" stroke="#b8891a" stroke-width="1.1"/>${[122, 140, 158, 176].map(y => `<rect x="466.5" y="${y}" width="5" height="2.4" rx="1" fill="#6b4a12"/>`).join('')}
      <path d="M455 110 Q446 120 445 176 L452 178 Q454 132 459 118" fill="#d9a82a" stroke="#8a6a12" stroke-width="1"/><path d="M483 110 Q492 120 493 176 L486 178 Q484 132 479 118" fill="#d9a82a" stroke="#8a6a12" stroke-width="1"/>
      <path d="M455 160 h10 v12 h-10z M473 160 h10 v12 h-10z" fill="none" stroke="#b8891a" stroke-width=".9"/></g>`;
  w2 += `<g><circle cx="615" cy="236" r="25" fill="none" stroke="#f3efe6" stroke-width="10"/><circle cx="615" cy="236" r="25" fill="none" stroke="${KJ.rot}" stroke-width="10" stroke-dasharray="19.6 19.6"/><circle cx="615" cy="236" r="30" fill="none" stroke="${tinte}" stroke-width=".6" opacity=".5"/><text font-family="${KJ.schrift}" font-weight="800" font-size="5" fill="${tinte}"><textPath href="#kj-ringtext" startOffset="18%">FRIEDA</textPath></text><path id="kj-ringtext" d="M590 236 A25 25 0 0 1 640 236" fill="none"/></g>`;
  w2 += `<g id="fk-glocke"><path d="M620 92 H660" stroke="${messing}" stroke-width="3"/><path d="M652 92 v8" stroke="${messing}" stroke-width="2"/><g class="glocke" style="transform-box:view-box;transform-origin:652px 100px"><path d="M641 126 Q642 102 652 100 Q662 102 663 126 Z" fill="${messing}" stroke="#7a5a1c" stroke-width="1.2"/><circle cx="652" cy="128" r="2.6" fill="#7a5a1c"/><path d="M646 108 q2 -4 5 -5" stroke="#f3dc8e" stroke-width="1.4" fill="none"/></g></g>`;

  /* Ebene .3: Möbel: Koje, Kombüse, Bank, Kartentisch mit Funk, Niedergang, Kiste */
  let m = `<g><rect x="-312" y="252" width="146" height="126" fill="${holzD}"/><rect x="-306" y="262" width="134" height="40" rx="6" fill="#5f6f86"/><path d="M-306 286 Q-240 278 -172 288 V302 H-306Z" fill="url(#fk-karo)" opacity=".9"/>
      <ellipse cx="-280" cy="272" rx="20" ry="9" fill="#efe8da" stroke="#a8a090" stroke-width=".8"/><rect x="-312" y="300" width="146" height="10" fill="${holzH}" stroke="${tinte}" stroke-width=".8"/><rect x="-312" y="310" width="146" height="68" fill="${holz}"/><path d="M-312 344 H-166" stroke="${holzD}"/>
      <path d="M-222 260 q4 -10 12 -6 q8 4 4 12" fill="#c78a4a" stroke="${tinte}" stroke-width=".7"/><circle cx="-214" cy="258" r="4.5" fill="#c78a4a" stroke="${tinte}" stroke-width=".7"/><circle cx="-215.6" cy="257.4" r=".6" fill="${tinte}"/><circle cx="-212.6" cy="257.4" r=".6" fill="${tinte}"/></g>`;
  m += `<g><rect x="-150" y="214" width="142" height="164" fill="${holzD}"/><rect x="-154" y="210" width="150" height="8" fill="#b08458" stroke="${tinte}" stroke-width=".8"/><path d="M-154 206 H-4" stroke="${messing}" stroke-width="1.6"/>
      ${[0, 1].map(r => [0, 1].map(c => `<rect x="${-146 + c * 70}" y="${226 + r * 74}" width="64" height="66" rx="2" fill="${holz}" stroke="${tinte}" stroke-width=".8"/><circle cx="${-146 + c * 70 + (c ? 8 : 56)}" cy="${259 + r * 74}" r="2.2" fill="${messing}"/>`).join('')).join('')}
      <rect x="-142" y="184" width="54" height="26" rx="3" fill="#8f9396" stroke="${tinte}" stroke-width=".8"/>${[-128, -102].map(x => `<ellipse cx="${x}" cy="186" rx="10" ry="2.6" fill="#3a3a3a"/>`).join('')}
      ${[-128, -102].map(x => `<circle cx="${x}" cy="199" r="3.2" fill="#2e2e2e" stroke="${tinte}" stroke-width=".6"/><path d="M${x} 196.6 v2.6" stroke="#e8e2d0" stroke-width="1"/>`).join('')}<g id="kj-gashahn"><path d="M-86 203 h9 v22" stroke="#e2b23c" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="-77" cy="213" r="3.4" fill="${messing}" stroke="${tinte}" stroke-width=".7"/><path d="M-77 213 l11 -4" stroke="${KJ.rot}" stroke-width="3.6" stroke-linecap="round"/></g>
      <g><path d="M-136 184 q0 -14 12 -14 q12 0 12 14z" fill="#3a5a7a" stroke="${tinte}" stroke-width=".8"/><path d="M-124 170 v-4 h-5" stroke="${tinte}" stroke-width="1.2" fill="none"/><path d="M-112 176 q8 -2 10 -8" stroke="#3a5a7a" stroke-width="2.4" fill="none"/>
        <g class="fk-dampf" id="fk-kessel-dampf" opacity=".7"><path d="M-104 164 q-4 -6 0 -12 q4 -6 0 -12" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M-98 166 q-4 -6 0 -12 q4 -6 0 -12" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" style="animation-delay:-1.2s"/></g></g>
      <path d="M-72 196 q0 -10 10 -10 h30 q6 0 6 6 v4" fill="none" stroke="#9a9a96" stroke-width="3" stroke-linecap="round"/><rect x="-76" y="200" width="56" height="12" rx="3" fill="#6a6e72" stroke="${tinte}" stroke-width=".8"/><ellipse cx="-48" cy="203" rx="20" ry="3" fill="#3a3e42"/>
      <path data-loch="kombuese" data-lx="-34" d="M-44 378 q0 -14 10 -14 q10 0 10 14z" fill="#1e120a"/>
      <g id="fk-katze-kocher" data-fest="" style="opacity:0" transform="translate(-100 185) scale(1.15)">${C('backbord', {pose: 'sitzen'})}</g></g>`;   /* v5.83: Backbord auf dem Kocher (1-2, TU kk) */
  m += `<g><path d="M70 300 Q200 286 330 300 L334 382 L66 382Z" fill="#9a3a2a" stroke="#5a1a10" stroke-width="2"/>${[100, 140, 180, 220, 260, 300].map(x => `<path d="M${x} 296 V380" stroke="#7a2a1e" stroke-width="1.2" opacity=".6"/>`).join('')}
      <path d="M76 314 Q200 302 324 314" stroke="#c0503a" stroke-width="3" fill="none" opacity=".55"/><g transform="translate(204 330)"><ellipse rx="25" ry="17" fill="#6f8f9a" stroke="#3a4a50" stroke-width="2"/><path d="M0 -9 V9 M-6 -4 H6 M-9 4 Q0 13 9 4" stroke="#f3ead2" stroke-width="2" fill="none" stroke-linecap="round"/></g>
      <g transform="translate(316 318)"><g id="kj-buchstapel">${['#3c7a52', '#e8b33c', '#b8402e', '#2f6a9a'].map((c, i) => `<rect x="-14" y="${-14 + i * 6}" width="30" height="6" rx="2" fill="${c}" stroke="${tinte}" stroke-width=".6"/>`).join('')}</g></g></g>`;
  m += `<g><rect x="350" y="268" width="122" height="8" fill="#b08458" stroke="${tinte}" stroke-width=".8"/><rect x="356" y="276" width="8" height="102" fill="${holzD}"/><rect x="458" y="276" width="8" height="102" fill="${holzD}"/><rect x="364" y="276" width="94" height="22" fill="${holz}" stroke="${tinte}" stroke-width=".6"/>
      <path d="M372 266 l26 -4 l1 3 l-26 4z" fill="#d9cfb4" stroke="${tinte}" stroke-width=".5"/><path d="M420 266 l10 -12 M420 266 l4 -13" stroke="#6a6a6a" stroke-width="1"/>
      ${[[400, -12, 0], [410, -4, 6], [420, 6, -4], [430, 14, 4]].map(([x, r, dy]) => `<g transform="rotate(${r} ${x} 360)"><rect x="${x - 4}" y="${304 + dy}" width="8" height="58" fill="#f3ead2" stroke="#b9a274" stroke-width=".6"/><ellipse cx="${x}" cy="${304 + dy}" rx="4" ry="1.8" fill="#e6d8b4" stroke="#b9a274" stroke-width=".6"/><path d="M${x - 1.6} ${304 + dy} a1.6 .7 0 1 0 3.2 0" stroke="#b9a274" stroke-width=".5" fill="none"/></g>`).join('')}
      <path d="M388 378 l5 -40 h40 l5 40z" fill="#b8925e" stroke="${tinte}" stroke-width=".8"/>${[346, 356, 366].map(y => `<path d="M${389 + (378 - y) * .12} ${y} H${437 - (378 - y) * .12}" stroke="#8a6a3e" stroke-width="1.1"/>`).join('')}${[398, 408, 418, 428].map(x => `<path d="M${x} 340 V377" stroke="#8a6a3e" stroke-width=".7" opacity=".7"/>`).join('')}
      <g id="kj-dose"><rect x="446" y="254" width="11" height="14" rx="1.5" fill="#2f6a7a" stroke="${tinte}" stroke-width=".6"/><rect x="446" y="254" width="11" height="3" fill="#c9a03c"/><path d="M448 262 h7" stroke="#f3ead2" stroke-width="1"/></g>
      <g id="fk-funk"><rect x="380" y="226" width="44" height="36" rx="4" fill="#2a2a2a" stroke="${tinte}" stroke-width="1"/><circle cx="394" cy="244" r="8" fill="#4a4a4a"/><circle cx="394" cy="244" r="4" fill="#2f2f2f"/><rect x="406" y="236" width="12" height="4" fill="#7a7a7a"/><rect x="406" y="244" width="12" height="4" fill="#7a7a7a"/><path d="M418 226 l8 -18" stroke="#6a6a6a" stroke-width="1.6"/><rect x="376" y="262" width="52" height="5" fill="${holzH}"/></g></g>`;
  { const L = y => 580 - (y - 38) * 52 / 340, R = y => L(y) + 42;
    m += `<g id="fk-niedergang"><rect x="540" y="-80" width="90" height="118" fill="#2a180c"/><rect x="546" y="-80" width="78" height="114" fill="#cfe3ea"/><rect x="546" y="-80" width="78" height="114" fill="url(#fb-hg)" opacity=".8"/><path d="M542 36 H628" stroke="#8a6440" stroke-width="3"/><path d="M552 38 L632 38 L604 378 L486 378Z" fill="url(#kj-luke)" opacity=".8"/>${[72, 114, 156, 198, 240, 282, 324].map(y => `<path d="M${r1(L(y))} ${y} H${r1(R(y))} l-1 7 H${r1(L(y) - 1)}z" fill="#b08458" stroke="${tinte}" stroke-width=".8"/><path d="M${r1(L(y) + 2)} ${y + 1.6} H${r1(R(y) - 2)}" stroke="#d8b080" stroke-width="1"/>`).join('')}
      <path d="M580 38 L528 378 M622 38 L570 378" stroke="${holzD}" stroke-width="7" stroke-linecap="round"/><path d="M579 38 L527 378" stroke="#8a6440" stroke-width="1.6"/><path d="M636 40 Q640 120 604 300" stroke="${messing}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`; }
  m += `<g id="fk-kiste"><rect x="520" y="322" width="132" height="56" rx="4" fill="${holz}" stroke="${tinte}" stroke-width="1.2"/><rect x="516" y="316" width="140" height="10" rx="3" fill="${holzH}" stroke="${tinte}" stroke-width="1"/>${[524, 640].map(x => `<rect x="${x}" y="326" width="8" height="52" fill="#3a2a1a"/>`).join('')}<rect x="580" y="336" width="12" height="9" rx="1" fill="${messing}"/>
      <ellipse cx="560" cy="310" rx="26" ry="8" fill="#d9c8a0" stroke="#8a7a5a" stroke-width=".8"/><ellipse cx="560" cy="306" rx="20" ry="5.6" fill="none" stroke="#8a7a5a" stroke-width=".8"/><ellipse cx="560" cy="303" rx="14" ry="3.6" fill="none" stroke="#8a7a5a" stroke-width=".8"/></g>`;
  /* weitere Mauselöcher (v5.82, Nutzer: „Die Mäuse bekommen noch Mauselöcher, wo sie reinlaufen“) */
  const loch = (n, x) => `<g data-loch="${n}" data-lx="${x}"><path d="M${x - 9} 378 q0 -13 9 -13 q9 0 9 13z" fill="#1e120a"/><path d="M${x - 9} 378 q0 -13 9 -13 q9 0 9 13" fill="none" stroke="#6e4a2e" stroke-width="1.2" opacity=".7"/></g>`;
  m += `<g>${loch('koje', -197)}</g><g>${loch('bank', 342)}</g><g>${loch('karte', 441)}</g>`;
  m += `<g><path d="M572 432 l5 -36 h30 l5 36z" fill="#9aa2a6" stroke="${tinte}" stroke-width="1"/><path d="M577 396 q15 -16 30 0" stroke="#6a7276" stroke-width="1.6" fill="none"/><ellipse cx="592" cy="396" rx="15" ry="3.6" fill="#6f7a7e"/></g>
      ${[[-238, 384], [-214, 381]].map(([x, y]) => `<g><path d="M${x} ${y} h13 v26 q0 2 3 3 l7 2 q4 2 3 5 h-26 z" fill="#e2b23c" stroke="#8a6a12" stroke-width="1"/><path d="M${x} ${y + 4} h13" stroke="#b8891a" stroke-width="1.2"/><path d="M${x} ${y + 35} h26" stroke="#5a4210" stroke-width="2"/></g>`).join('')}`;

  /* Ebene .5: Lampe und Tischrunde (Personen, Tisch, Hände auf dem Tisch: alles in einer Ebene, damit nichts verrutscht) */
  /* v5.82: Tischkante im Bild fest (TY0); jede Figur bekommt ihre eigene Kante, damit Körperbau und Größe (Smilla 82, Hinnerk-Varianten) zum Tisch passen */
  const S = 1.75, HY = 420, TY0 = r1(HY - 37 * S * .97), FG = window.FIGUREN, typB = id => FG && FG.typ ? FG.typ(id).bh : .97, grS = id => FG ? FG.FIG[id].h / 100 : 1;
  const SY = r1(TY0 + 37 * S * grS('smilla') * typB('smilla')), kanteVon = (id, fuss) => r1((TY0 - fuss) / (S * grS(id) * typB(id))), KH = kanteVon('hinnerk', HY), KS = kanteVon('smilla', SY);
  const becher = (x, y, sk, farbe, band) => `<g transform="translate(${x} ${y}) scale(${sk})"><ellipse cx="0" cy="0" rx="6.6" ry="1.9" fill="#1a0e06" opacity=".32"/><path d="M-4.6 -11 L4.6 -11 L4 -.8 Q0 .6 -4 -.8Z" fill="${farbe}" stroke="#3a2a1c" stroke-width=".7"/><path d="M-4.4 -8.2 L4.4 -8.2" stroke="${band}" stroke-width="1.5"/><ellipse cx="0" cy="-11" rx="4.6" ry="1.4" fill="#5a3418" stroke="#3a2a1c" stroke-width=".6"/><path d="M4.4 -9.2 q3.6 .2 3.1 3.3 q-.5 2.4 -3.5 2" fill="none" stroke="#3a2a1c" stroke-width="1"/><path d="M-3 -10 q-.4 4 .2 8" stroke="#fff" stroke-width=".8" opacity=".55"/></g>`;
  const dampf = (x, y, d) => `<g class="fk-dampf" opacity=".55"><path d="M${r1(x)} ${r1(y)} q-3 -5 0 -10 q3 -5 0 -10" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round" style="animation-delay:${d}s"/></g>`;
  const KANTE = KH, karte = window.BREDE && BREDE.daten && BREDE.svg ? BREDE.svg('K1', {routen: [1], vb: '30 180 240 320', par: 'xMidYMid slice'}).replace('<svg ', '<svg x="-60" y="-80" width="120" height="160" ') : '';
  let t5 = `<defs><linearGradient id="kj-kegel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdc96" stop-opacity="${nacht ? .5 : .4}"/><stop offset="1" stop-color="#ffdc96" stop-opacity="0"/></linearGradient>
      <filter id="kj-weich" x="-5%" y="-10%" width="110%" height="120%"><feGaussianBlur stdDeviation=".55"/></filter><clipPath id="kj-kartenclip"><rect x="-60" y="-80" width="120" height="160"/></clipPath></defs>
    <radialGradient id="kj-pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd98e" stop-opacity="${nacht ? .5 : .36}"/><stop offset="1" stop-color="#ffd98e" stop-opacity="0"/></radialGradient>
    <g class="fk-lampe"><path d="M200 -60 V84" stroke="#2a1a0e" stroke-width="2"/><path d="M200 102 L104 383 H296Z" fill="url(#kj-kegel)" class="fk-schein"/><path d="M181 102 Q184 84 200 82 Q216 84 219 102Z" fill="${messing}" stroke="#5a3a1c" stroke-width="1.4"/><ellipse cx="200" cy="102" rx="19" ry="4" fill="#fff4cf"/><circle cx="200" cy="99" r="17" fill="#ffd58a" opacity=".22" class="fk-schein"/></g>`;
  t5 += `<g id="fk-hinnerk" transform="translate(136 ${HY}) scale(${S})">${C('hinnerk', {blick: 'vorn', pose: 'tisch', kante: KH})}</g><g id="fk-smilla" transform="translate(266 ${SY}) scale(${S})">${C('smilla', {blick: 'vorn', pose: 'tisch', kante: KS})}</g>`;
  const TY = r1(TY0 + 26);
  t5 += `<g id="fk-tisch"><ellipse cx="200" cy="456" rx="70" ry="9" fill="#1a0e06" opacity=".35"/><g filter="url(#kj-weich)"><rect x="190" y="${TY + 30}" width="20" height="${r1(452 - TY - 30)}" fill="${holzD}"/><ellipse cx="200" cy="452" rx="36" ry="7" fill="${holzD}"/>
      <path d="M92 ${TY} Q92 ${r1(TY + 37)} 200 ${r1(TY + 37)} Q308 ${r1(TY + 37)} 308 ${TY} Z" fill="#6e4628" stroke="#3a2412" stroke-width="2"/>
      <ellipse id="fk-tischplatte" cx="200" cy="${TY}" rx="108" ry="26" fill="#a8774a" stroke="#3a2412" stroke-width="2.2"/><ellipse cx="200" cy="${TY - 1}" rx="100" ry="22" fill="none" stroke="#c4925e" stroke-width="1.2" opacity=".6"/></g>
      <g transform="translate(200 ${TY}) scale(1 ${r1(26 / 108 * 1000) / 1000})"><rect x="-58" y="-77" width="120" height="160" fill="#1a0e06" opacity=".2"/><g clip-path="url(#kj-kartenclip)"><rect x="-60" y="-80" width="120" height="160" fill="#fbf8ef"/>${karte || `<path d="M-60 10 Q-20 -20 10 0 T60 -10 V80 H-60Z" fill="#efd9a8"/><path d="M-40 -40 L-10 -20 L20 -36 L44 -10" stroke="${KJ.rot}" stroke-width="3" stroke-dasharray="7 5" fill="none"/>`}</g><rect x="-60" y="-80" width="120" height="160" fill="none" stroke="#5a3a1c" stroke-width="3"/>
        <g transform="translate(34 50) rotate(-30)"><path d="M0 0 L-6 -40 M0 0 L6 -40" stroke="#6a6a6a" stroke-width="3"/><circle r="4" fill="${messing}"/></g><g transform="translate(-30 64) rotate(12)"><rect x="-34" y="-5" width="68" height="10" rx="2" fill="#c9b78a" stroke="#6a5a3a" stroke-width="1.4" opacity=".9"/></g></g></g>`;
  /* Lichtkreis der Lampe auf dem Tisch, dann Hände; Hinnerks Becher steht zwischen seinen Händen, Smillas rechts neben ihrer Hand, dein Becher vorn vor dem Hocker (Nutzer 23.11.2026) */
  t5 += `<ellipse cx="200" cy="${TY - 2}" rx="96" ry="24" fill="url(#kj-pool)"/>`;
  t5 += `<g id="fk-hinnerk-arme" transform="translate(136 ${HY}) scale(${S})">${FG && FG.tischArme ? FG.tischArme('hinnerk', {kante: KH}) : ''}</g><g id="fk-smilla-arme" transform="translate(266 ${SY}) scale(${S})">${FG && FG.tischArme ? FG.tischArme('smilla', {kante: KS, halt: 'stift'}) : ''}</g>`;
  t5 += `<g id="fk-becher-hinnerk">${becher(137, r1(TY0 + 27), 1.15, '#e9e1cf', '#2f5f8a')}${dampf(136, TY0 + 12, 0)}</g><g id="fk-becher-smilla">${becher(293, r1(TY0 + 25), 1.05, '#c8503c', '#f3ead2')}${dampf(292, TY0 + 11, -1.1)}</g>
    <g id="fk-becher-du"><ellipse cx="200" cy="${r1(TY0 + 49.6)}" rx="10" ry="2.8" fill="#b98a56" stroke="#6a4a2a" stroke-width=".8"/>${becher(200, r1(TY0 + 49), 1.25, '#f3efe6', '#e8a33c')}<path d="M197.4 ${r1(TY0 + 41)} l2.6 -3 l2.6 3 m-2.6 -3 v5.4 m-2 -2 h4" stroke="#2f5f8a" stroke-width=".9" fill="none" stroke-linecap="round"/>${dampf(199, TY0 + 33, -2.1)}</g>`;


  /* Ebene .75: vorn Teppich, Hocker, Backbord */
  const vorn = `<ellipse cx="200" cy="482" rx="164" ry="25" fill="#7a2e20"/><ellipse cx="200" cy="482" rx="134" ry="19" fill="#b8742e"/><ellipse cx="200" cy="482" rx="100" ry="13.5" fill="#7a2e20"/><ellipse cx="200" cy="482" rx="64" ry="8" fill="#c99a52" opacity=".7"/>
    <g id="fk-hocker" transform="translate(200 466)"><ellipse cx="0" cy="24" rx="30" ry="4.4" fill="#1a0e06" opacity=".3"/><path d="M-20 -2 L-26 22 M20 -2 L26 22 M0 -2 V23" stroke="${holzD}" stroke-width="6" stroke-linecap="round"/><path d="M-22 12 H22" stroke="${holzD}" stroke-width="3"/><ellipse cx="0" cy="-8" rx="32" ry="9" fill="#c0392b" stroke="#5a1a10" stroke-width="2"/><ellipse cx="0" cy="-11" rx="24" ry="5.5" fill="#d9584a"/></g>
    <g id="fk-backbord" data-fest="" transform="translate(118 490) scale(1.65)">${C('backbord', {pose: 'sitzen'})}</g><g id="kj-akt-v" data-fest=""></g>`;
  /* Ebene .92 ganz vorn (v5.82, Nutzer: „Stiefel, die da stehen etc.“): dunkler, im Schatten, wandern beim Wischen am schnellsten. Lage in Bild-Koordinaten (ausrichten() rückt sie) */
  const sch = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r1(rx * .22)}" fill="#0e0704" opacity=".45"/>`;
  const stiefel = (x, y, c, cd, kipp = 0) => `<g transform="translate(${x} ${y}) rotate(${kipp})"><path d="M-9 -58 L9 -58 L10 -14 Q11 -6 22 -4 Q30 -2 30 4 L30 8 L-11 8 Q-12 -10 -9 -58Z" fill="${c}"/><path d="M-9 -58 L9 -58 L9.6 -50 L-9.4 -50Z" fill="${cd}"/><path d="M-11 4 H30 V8 H-11Z" fill="#2a1a10"/><path d="M6 -52 Q8 -30 8 -14" stroke="#ffd98e" stroke-width="2" opacity=".35" fill="none"/></g>`;
  let fg = `<g>${sch(46, 524, 44)}${stiefel(26, 516, '#a8811f', '#7a5c14', -4)}${stiefel(60, 522, '#b88d22', '#7a5c14', 6)}</g>`;
  fg += `<g>${sch(340, 524, 46)}<g transform="translate(340 512)">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="0" cy="${-i * 4.2}" rx="${40 - i * 3}" ry="${12 - i * .8}" fill="none" stroke="${i % 2 ? '#8a6a3e' : '#a07c48'}" stroke-width="6"/>`).join('')}<path d="M30 -16 Q50 -22 62 -6" stroke="#a07c48" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-17" rx="20" ry="5" fill="#2a180c"/></g></g>`;
  fg += `<g>${sch(-62, 524, 52)}<g transform="translate(-62 520)"><rect x="-46" y="-56" width="92" height="56" rx="3" fill="#5a3a20" stroke="#24150a" stroke-width="2"/>${[-40, -22, -4, 14, 32].map(x => `<path d="M${x} -56 V0" stroke="#3e2714" stroke-width="2"/>`).join('')}<path d="M-46 -30 H46" stroke="#24150a" stroke-width="3"/><path d="M-14 -46 q14 -10 28 0" stroke="#8a6a3e" stroke-width="3" fill="none"/><text x="0" y="-12" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="11" fill="#c9a46a" opacity=".55">FRIEDA</text></g></g>`;
  fg += `<g>${sch(-238, 524, 40)}<g transform="translate(-238 522)"><path d="M-30 0 Q-36 -40 -18 -62 Q0 -72 18 -62 Q36 -40 30 0Z" fill="#6f6a52"/><path d="M-18 -62 Q0 -54 18 -62" stroke="#3e3a2c" stroke-width="3" fill="none"/><path d="M0 -60 Q-4 -76 6 -82" stroke="#c9b48a" stroke-width="2.4" fill="none"/><path d="M-22 -10 Q0 -2 22 -10" stroke="#4e4a38" stroke-width="2" fill="none"/><path d="M16 -50 Q26 -30 22 -8" stroke="#ffd98e" stroke-width="2" opacity=".3" fill="none"/></g></g>`;
  fg += `<g>${sch(-330, 520, 26)}<g transform="translate(-330 516)"><circle cx="0" cy="-30" r="34" fill="#ffcf7a" opacity=".16"/><path d="M-12 0 H12 L10 -8 H-10Z" fill="#7a5a24"/><rect x="-9" y="-44" width="18" height="36" rx="5" fill="#ffe2a0" opacity=".85" stroke="#7a5a24" stroke-width="2"/><path d="M-9 -26 H9 M0 -44 V-8" stroke="#7a5a24" stroke-width="1.4"/><path d="M-10 -44 H10 L6 -50 H-6Z" fill="#7a5a24"/><path d="M0 -50 Q-8 -60 0 -64 Q8 -60 0 -50" stroke="#7a5a24" stroke-width="2" fill="none"/></g></g>`;
  fg += `<g opacity=".92"><rect x="492" y="-80" width="22" height="640" fill="#2a180c"/><path d="M498 -80 V560" stroke="#5a3a22" stroke-width="3" opacity=".7"/><rect x="488" y="150" width="30" height="10" rx="2" fill="#3a2414"/></g>`;
  fg += `<g>${sch(566, 524, 34)}<g transform="translate(566 520)"><path d="M-24 0 L-20 -44 H20 L24 0Z" fill="#5d6468"/><ellipse cx="0" cy="-44" rx="20" ry="5" fill="#3e4447"/><path d="M-18 -44 Q0 -66 18 -44" stroke="#3e4447" stroke-width="2.4" fill="none"/><path d="M8 -46 L30 -120" stroke="#7a5a34" stroke-width="5" stroke-linecap="round"/><path d="M14 -30 L18 -4" stroke="#ffd98e" stroke-width="2" opacity=".25"/></g></g>`;
  fg += `<g>${sch(650, 524, 40)}${stiefel(632, 518, '#8f2a1e', '#5e1a12', -8)}${stiefel(668, 522, '#a0301f', '#5e1a12', 72)}</g>`;
  /* Extras (Aquarell) auf eigenen, kleinen Ebenen: werden laufend neu gezeichnet, ohne die großen Ebenen anzufassen (v5.81, spart Rechenzeit beim Wischen) */
  return [
    {d: 0, svg: wand, pm: KAJ.pm.wand},
    {d: .01, svg: `<g data-xc="-77"><clipPath id="kj-puclip"><circle cx="-77" cy="92" r="24"/></clipPath><g clip-path="url(#kj-puclip)"><g id="kj-puschel"></g></g></g>`, pm: KAJ.pm.wand},
    {d: .12, svg: w2, pm: KAJ.pm.w2},
    {d: .3, svg: m, pm: KAJ.pm.m},
    {d: .3, svg: `<g id="kj-maeuse" data-fest="" transform="translate(-28 378)"></g><g id="kj-wurm" data-fest="" transform="translate(206 297) scale(.95)"></g><g id="kj-akt-m" data-fest=""></g>`, pm: KAJ.pm.m},
    {d: .5, svg: t5 + `<g id="kj-akt-t" data-fest=""></g>`, pm: KAJ.pm.t5},
    {d: .75, svg: vorn, pm: KAJ.pm.vorn},
    {d: .92, svg: fg, pm: KAJ.pm.fg}
  ];
}
const ORTE = {
  tankstelle: {
    seite: () => [
      {d: 0, svg: himmel(90)},
      {d: .1, svg: masten(266, [30, 150, 330]) + haeuser(266, .62, 7, -20)},
      {d: .2, svg: nebelband(200, 276, 520, 30, .8)},
      {d: .28, svg: stegSeite(272) + zapfsaeule(118, 266) + `<g id="fs-hilke" transform="translate(150 266)"><g transform="scale(.5)"><g id="fs-hilke-block">${hilke()}</g><g id="fs-hilke-frei" style="opacity:0">${C('hilke', {blick: 'seite', wende: true})}</g></g></g>`},
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
      /* v5.84 (Nutzer 22.11.2026: „Das Boot sieht aus, als ob es vor dem anderen fährt. Es müsste den Fender berühren“):
         Pauls Boot ELSE liegt jetzt in derselben Tiefe links neben der Frieda, Heck zu uns, Fender an seiner Steuerbordseite.
         Fährt die Frieda rückwärts (p) und wandert ihr Heck nach Backbord (a), stößt sie an den Fender; TU rums drückt ihn zusammen und schaukelt beide Boote */
      {d: .55, svg: `<g id="fh-else" transform="translate(78 364) scale(1.12)"><g id="fh-else-b">
          <path d="M-36 -16 L-31 -46 L33 -46 L38 -16Z" fill="${P.rumpf}" stroke="#5f5446" stroke-width="1.4"/><rect x="-24" y="-40" width="18" height="12" rx="3" fill="#9fb8c4"/><rect x="4" y="-40" width="18" height="12" rx="3" fill="#9fb8c4"/>
          <path d="M58 -16 L86 -30 L82 16 L52 36Z" fill="${P.paul}" stroke="#2e3a4a" stroke-width="1.4"/><path d="M58 -16 L86 -30 L86 -25 L58 -10Z" fill="${P.rumpf}"/>
          <path d="M-58 -16 L58 -16 L52 36 Q0 44 -52 36Z" fill="${P.paulD}" stroke="#2e3a4a" stroke-width="1.6"/><path d="M-58 -16 L58 -16 L57 -9 L-57 -9Z" fill="${P.rumpf}"/>
          <text x="0" y="17" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="15" fill="${P.rumpf}" letter-spacing="1">ELSE</text>
          <path d="M-52 36 Q0 44 52 36" stroke="${P.glanz}" stroke-width="2" fill="none" opacity=".6"/>
          <g transform="translate(66 4) scale(.62)"><g id="fh-fender"><path d="M0 -44 V-30" stroke="${P.motor}" stroke-width="2.2"/><rect x="-15" y="-32" width="30" height="66" rx="15" fill="${P.fender}" stroke="#7a2a20" stroke-width="1.2"/>
          <text transform="rotate(-90)" x="0" y="3.6" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="10" letter-spacing=".8" fill="${P.fenderSchrift}">HINNERK</text></g></g></g></g>
        <g id="fh-pos" transform="translate(262 362) scale(1.15)">${friedaHeck('fh-boot')}</g>`},
      {d: .62, svg: `<g id="fh-kiel" opacity="0"><path data-fluss="-14" d="M240 392 Q200 440 150 520 M284 392 Q320 440 360 520" stroke="${P.glanz}" stroke-width="3" fill="none" stroke-dasharray="14 10" opacity=".75"/></g>`},
      {d: .7, svg: streifen(402, 6, 52, mix(P.w[0], P.w[1], .6), 12, false) + streifen(458, 8, 68, P.w[1], -16, false)}
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
          <g transform="translate(0 196) scale(1.15)">${friedaHeck('fx-boot', {unter: true, ohneSchraube: true}).replace('id="fx-boot"', 'id="fx-boot" data-ohne-bob="1"')}</g>
          <g id="fx-rad" opacity="0"><circle cx="0" cy="242" r="112" fill="rgba(255,255,255,.07)" stroke="#fff6dc" stroke-width="3" stroke-dasharray="10 7"/>
            <g id="fx-speichen">${[0, 45, 90, 135].map(a => `<path d="M0 130 V354" transform="rotate(${a} 0 242)" stroke="#fff6dc" stroke-width="2" opacity=".55"/>`).join('')}</g></g>
          <g id="fx-prop"><ellipse cx="0" cy="234" rx="2.6" ry="8" fill="#9aa3aa"/><ellipse cx="0" cy="250" rx="2.6" ry="8" fill="#9aa3aa"/><ellipse cx="-8" cy="242" rx="8" ry="2.6" fill="#9aa3aa"/><ellipse cx="8" cy="242" rx="8" ry="2.6" fill="#9aa3aa"/><circle cx="0" cy="242" r="5" fill="${P.motor}"/></g>
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
          `<g id="fb-hilke"><g transform="translate(330 276) scale(.29)">${hilke()}</g></g>`, scroll: true},
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
  },
  /* v5.72 Motor aus der Nähe, von achtern (für „Rechtsdreher“, sbf:44: von achtern gesehen dreht er in Vorausfahrt im Uhrzeigersinn).
     TU: dreh (+1 voraus, −1 zurück; Schraube dreht), pfeil (Drehrichtung als Bogen mit Text). Die Frieda kommt aus boot.js (Farbe, Name, Ausbau). */
  kajuete: {innen: kajueteEbenen},
  /* v5.82 (E36): Liegeplatz für das Deck der App: die Frieda am Steg im Heimathafen, ohne Zapfsäule (Hilke tankt in der Geschichte).
     Darsteller (bord.js): Möwen auf den Pfählen und in der Luft, Muschelwichte am Steg, Klabauter und Backbord im Boot */
  liegeplatz: {
    seite: () => [
      {d: 0, svg: himmel(90)},
      {d: .1, svg: masten(266, [30, 150, 330]) + haeuser(266, .62, 7, -20)},
      {d: .2, svg: nebelband(200, 276, 520, 30, .8)},
      {d: .28, svg: stegSeite(272) + `<g><rect x="96" y="250" width="26" height="16" rx="2" fill="${P.stegD}"/><rect x="96" y="250" width="26" height="4" fill="${dunkel(P.stegD, .2)}"/><circle cx="109" cy="244" r="6" fill="none" stroke="#f3efe6" stroke-width="2.6"/><circle cx="109" cy="244" r="6" fill="none" stroke="${KJ.rot}" stroke-width="2.6" stroke-dasharray="4.7 4.7"/></g>`
        + [[22, 236], [318, 232]].map(([x, y]) => `<g><rect x="${x - 4}" y="${y}" width="8" height="${282 - y}" rx="2" fill="${P.stegD}"/><ellipse cx="${x}" cy="${y}" rx="4" ry="1.4" fill="${hell(P.stegD, .25)}"/></g>`).join('') + `<g id="dk-akt-steg" data-fest=""></g>`},
      {d: .36, svg: `<rect x="-60" y="282" width="520" height="300" fill="url(#fb-wg)"/>` + streifen(290, 3, 30, P.w[0], 6) + streifen(308, 4, 40, mix(P.w[0], P.w[1], .35), 9)},
      {d: .45, svg: moewe(-60, 140, 470, 110, 19, 0, .8) + `<g id="dk-akt-luft" data-fest=""></g>`},
      {d: .55, svg: `<g id="dk-pos" transform="translate(231 340) scale(1.4)">${friedaSeite('dk-boot')}</g>`},
      {d: .7, svg: streifen(356, 6, 54, mix(P.w[0], P.w[1], .6), 16) + streifen(404, 8, 70, P.w[1], 22)},
      {d: .95, svg: `<g><rect x="-40" y="300" width="30" height="300" rx="8" fill="${dunkel(P.stegD, .25)}"/><rect x="-14" y="306" width="26" height="300" rx="8" fill="${dunkel(P.stegD, .12)}"/><path d="M-40 330 Q-14 344 12 330" stroke="#c9b48a" stroke-width="4" fill="none"/><ellipse cx="-25" cy="300" rx="15" ry="4" fill="${dunkel(P.stegD, .4)}"/><ellipse cx="-1" cy="306" rx="13" ry="3.6" fill="${dunkel(P.stegD, .3)}"/></g><g id="dk-akt-vorn" data-fest=""></g>`}
    ]
  },
  /* v5.83 Hafenkino (Folge 1-1, Lektorat 22.11.2026): Blick aus dem Cockpit der Frieda über die Bordwand auf den Steg gegenüber.
     Dort liegt das Charterboot mit vier Männern (figuren.js charter1–4); der mit der roten Mütze will das Sagen haben. TU dose (Bierdose), eboot (Leihboot fährt vorbei), weg (die vier gehen). */
  gegenueber: {
    seite: () => [
      {d: 0, svg: himmel(90)},
      {d: .1, svg: masten(256, [40, 190, 320]) + haeuser(256, .6, 7, -10)},
      {d: .2, svg: nebelband(200, 262, 520, 26, .8)},
      {d: .3, svg: stegSeite(266) + [[60, 232], [330, 236]].map(([x, y]) => `<g><rect x="${x - 4}" y="${y}" width="8" height="${276 - y}" rx="2" fill="${P.stegD}"/><ellipse cx="${x}" cy="${y}" rx="4" ry="1.4" fill="${hell(P.stegD, .25)}"/></g>`).join('')},
      {d: .34, svg: `<rect x="-60" y="276" width="520" height="300" fill="url(#fb-wg)"/>` + streifen(282, 2.5, 30, P.w[0], 6)},
      {d: .4, svg: `<g id="gg-charter" transform="translate(206 306) scale(1.02)">${charterBoot()}</g>`},
      {d: .46, svg: streifen(314, 3, 36, mix(P.w[0], P.w[1], .3), 8) + `<g id="gg-eboot" transform="translate(-140 372)">${leihboot()}</g>`},
      {d: .5, svg: moewe(-60, 120, 470, 96, 21, 3, .75)},
      {d: .62, svg: streifen(396, 6, 54, mix(P.w[0], P.w[1], .6), 14) + streifen(440, 8, 70, P.w[1], 20)},
      {d: .95, svg: `<g><path d="M-60 452 Q200 440 460 452 V600 H-60Z" fill="${P.rumpf}" stroke="#5f5446" stroke-width="2.4"/><path d="M-60 466 Q200 454 460 466" stroke="#c0392b" stroke-width="6" fill="none"/>
          <path d="M-60 446 Q200 434 460 446" stroke="#b9874f" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-60 442 Q200 430 460 442" stroke="#d9a86a" stroke-width="2" fill="none" opacity=".7"/>
          <g transform="translate(296 438) scale(1.5)"><ellipse cx="0" cy="0" rx="6.6" ry="1.9" fill="#1a0e06" opacity=".3"/><path d="M-4.6 -11 L4.6 -11 L4 -.8 Q0 .6 -4 -.8Z" fill="#f3efe6" stroke="#3a2a1c" stroke-width=".7"/><path d="M-4.4 -8.2 L4.4 -8.2" stroke="#e8a33c" stroke-width="1.5"/><ellipse cx="0" cy="-11" rx="4.6" ry="1.4" fill="#5a3418" stroke="#3a2a1c" stroke-width=".5"/><path d="M4.4 -9.4 q3.4 .4 2.8 3.4 q-.8 1.6 -3 1" fill="none" stroke="#3a2a1c" stroke-width=".9"/></g></g>`}
    ]
  },
  motor: {
    heck: () => [
      {d: 0, svg: himmel(180) + haeuser(250, .5, 8, -30, false)},
      {d: .2, svg: nebelband(200, 252, 520, 28, .7)},
      {d: .4, svg: `<rect x="-60" y="256" width="520" height="400" fill="url(#fb-wg)"/>` + streifen(262, 3, 34, P.w[0], 7)},
      {d: .55, svg: `<g transform="translate(200 300) scale(2.3)">${friedaHeck('fm-boot', {unter: true, ohneSchraube: true}).replace('id="fm-boot"', 'id="fm-boot" data-ohne-bob="1"')}</g>
        <rect x="-60" y="300" width="520" height="260" fill="#2f5d66" opacity=".55"/>
        <g id="fm-prop">${[0, 120, 240].map(w => `<path d="M200 392 Q188 371 200 363 Q212 371 200 392Z" fill="#c9a24a" stroke="#7a5a1e" stroke-width="1.4" transform="rotate(${w} 200 392)"/>`).join('')}<circle cx="200" cy="392" r="5" fill="#8a6a2a"/></g>
        <g id="fm-cw" opacity="0"><path d="M200 332 A60 60 0 0 1 258 406" fill="none" stroke="#fff6dc" stroke-width="4" stroke-linecap="round"/><path d="M250 396 l9 14 l7 -15" fill="none" stroke="#fff6dc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="200" y="476" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="17" fill="#fff6dc" stroke="rgba(30,50,60,.6)" stroke-width="3" paint-order="stroke">voraus: im Uhrzeigersinn</text></g>
        <g id="fm-ccw" opacity="0"><path d="M200 332 A60 60 0 0 0 142 406" fill="none" stroke="#ffd2c4" stroke-width="4" stroke-linecap="round"/><path d="M150 396 l-9 14 l-7 -15" fill="none" stroke="#ffd2c4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="200" y="476" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="17" fill="#ffd2c4" stroke="rgba(30,50,60,.6)" stroke-width="3" paint-order="stroke">zurück: gegen den Uhrzeigersinn</text></g>
        <text id="fm-titel" opacity="0" x="200" y="30" text-anchor="middle" font-family="Baloo 2,sans-serif" font-weight="800" font-size="15" fill="#1f3b63" stroke="rgba(255,255,255,.7)" stroke-width="3" paint-order="stroke">von achtern gesehen</text>`},
      {d: .85, svg: `<g transform="translate(352 300) scale(.95)">${C('smilla', {blick: 'vorn', pose: 'zeigen'})}</g>`}
    ]
  }
};
/* Einstellungen je Blick (Kamera: z Zoom, fx/fy Blickpunkt, oy Höhe, df Schärfeebene, kipp Neigung) */
const EINST = {
  seite: {totale: {}, deck: {z: 1, fx: 214, fy: 318, pan: 26}, liege: {z: 1.18, fx: 254, fy: 302}, halbnah: {z: 1.55, fx: 205, fy: 318}, hinnerk: {z: 2.5, fx: 272, fy: 300}, smilla: {z: 2.5, fx: 125, fy: 302}, heck: {z: 1.9, fx: 300, fy: 330}, hilke: {z: 2.1, fx: 160, fy: 236, df: .28}, tief: {z: 1.1, oy: -30, fy: 330}, charter: {z: 2.15, fx: 196, fy: 278, df: .4}},
  heck: {totale: {}, nah: {z: 1.7, fx: 230, fy: 330}, fender: {z: 2.2, fx: 158, fy: 352, df: .55}},
  schnitt: {totale: {}, nah: {z: 1.3, fx: 200, fy: 300}},
  oben: {totale: {}, nah: {z: 1.5, fx: 170, fy: 280}, schraeg: {kipp: 32, z: 1.45, fy: 290}},
  /* Kajüte (v5.82): Blicke für Folgen und App. buch, manoever, navi und tuer liegen seit der stärkeren Tiefe um ihre Verschiebung (kajOff) versetzt;
     runde = am Tisch in der Runde (Hocker), baro = Uhr und Barometer, kombuese = Herd und Gashahn, crew = Hinnerk und Smilla halbnah */
  innen: {totale: {df: .5}, knoten: {z: 6, fx: 200, fy: 190, df: .12}, karte: {z: 2, fx: 200, fy: 383, df: .5}, telefon: {z: 4, fx: 40, fy: 160, df: .12}, manoever: {z: 7, fx: 400, fy: 85, df: .12},
    buch: {z: 3, fx: -169, fy: 186, df: .12}, stange: {z: 4.6, fx: 302, fy: 122, df: .2}, navi: {z: 3.4, fx: 394, fy: 167, df: .12}, hocker: {z: 2.4, fx: 200, fy: 470, df: .75}, tuer: {z: 1.6, fx: 560, fy: 200, df: .3},
    runde: {z: 1.45, fx: 200, fy: 330, df: .5}, crew: {z: 1.8, fx: 200, fy: 300, df: .5}, baro: {z: 4.2, fx: 48, fy: 92, df: .12}, kombuese: {z: 3.4, fx: -82, fy: 202, df: .3}},
};
const PEIL = {seite: 270, heck: 180};

/* ---------- 6. Bühne aufbauen ---------- */
const NULLCAM = {z: 1, fx: 200, fy: 250, ox: 0, oy: 0, df: .55, kipp: 0, drehOff: 0, vert: 0, pan: 0};
/* Ort-Einstellungen (v5.81): weit = Ebenen dürfen über den Bildrand gezeichnet sein (Panorama zum Wischen, FILMB.pan), dunst/unschaerfe = Anteil von Dunst und Tiefenschärfe,
   panTiefe = wie stark nahe Ebenen beim Wischen schneller wandern als ferne, atmen = Stärke der leichten Eigenbewegung. Kajüte: fast alles klar, Personen scharf (Nutzer 23.11.2026) */
const ORT_OPT = {kajuete: {weit: true, dunst: 0, unschaerfe: .5, panTiefe: .7, atmen: .45, ausrichten: true}, liegeplatz: {start: 'liege'}};
/* Tiefe beim Wischen (v5.82, Nutzer 23.11.2026: „Gegenstände verschieben sich gegeneinander … ausbauen, etwas verstärken“): jede Ebene der Kajüte wandert mit eigenem Faktor pm
   (nah schneller als fern, wie beim Blick aus dem Zugfenster). Damit die Dinge dort stehen, wo man sie anschaut, rückt jedes Ding um off(x, pm) zur Mitte (ferne Ebenen) oder nach außen (nahe):
   in der Startansicht (Mitte ±160) bleibt alles wie gezeichnet, an den Enden stimmt das Bild, wenn man dorthin gewischt hat (pRef = Wischweg, bei dem man das Ding ansieht). */
const KAJ = {pm: {wand: .7, w2: .78, m: .9, t5: 1, vorn: 1.12, fg: 1.36}, mitte: 160, k: 1.1};
const kajRef = x => Math.sign(x - 200) * Math.max(0, Math.abs(x - 200) - KAJ.mitte) * KAJ.k;
const kajOff = (x, pm) => r1(kajRef(x) * (pm - 1));
/* Nach dem Aufbau: jedes Ding einer Ebene (oberste Gruppen) bekommt seine Verschiebung; data-fest = Darsteller (verschiebt bord.js selbst), data-xc = Mitte vorgegeben */
function ausrichten(key) {
  for (const L of EB[key] || []) {
    const pm = L.pm != null ? L.pm : 1; if (Math.abs(pm - 1) < .001) continue;
    const sv = L.cam.querySelector('svg'); if (!sv) continue;
    for (const el of [...sv.children]) {
      if (/^(defs|clipPath|filter|pattern|linearGradient|radialGradient|style)$/i.test(el.tagName) || el.hasAttribute('data-fest') || el.hasAttribute('data-off')) continue;
      const w = document.createElementNS('http://www.w3.org/2000/svg', 'g'); sv.insertBefore(w, el); w.appendChild(el);
      let xc = el.dataset && el.dataset.xc != null ? +el.dataset.xc : null;
      if (xc == null) { let bb = null; try { bb = w.getBBox(); } catch (e) {} if (!bb || !bb.width || bb.width > 600) { w.setAttribute('data-off', '0'); continue; } xc = bb.x + bb.width / 2; }
      const o = kajOff(xc, pm); w.setAttribute('data-off', o); if (o) w.setAttribute('transform', `translate(${o} 0)`);
    }
  }
}
const NULLS = {p: 0, a: 0, go: 0, motor: 0, hx: 150, winken: 0, fender: 0, rad: 0, dreh: 0, pfeil: 0, fahrt: 0, k: 0, stopp: 0, pier: 0, mann: 0, faehre: 0, hilkeB: 1, klab: 1, hin: 1, dose: 0, eboot: 0, weg: 0, kessel: 1, dampf: 1, kk: 0, block: 1, leer: 0, rums: 0, ch: 1, krach: 0, traum: 0, schwell: 0};
let einstAkt = 'totale', uhrMin = null;   /* uhrMin: Uhr in der Kajüte fest auf diese Minute des Tages (Film), null = Uhr des Geräts (App) */   /* v5.83: zuletzt gewählte Einstellung (für Tests und Werkzeuge) */
let leicht = false, root = null, welt = null, ort = null, blick = 'seite', s = {...NULLS}, tweens = [], SETS = {}, EB = {}, CAM = {}, K = 1, extraBlur = 0, sprecher = '', laeuft = false, scrollOff = 0, pegel = null;
const SV = (x, weit) => `<svg viewBox="-40 -50 480 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"${weit ? ' style="overflow:visible"' : ''}>${x}</svg>`;
function css() {
  if (document.getElementById('fb-css')) return;
  const st = document.createElement('style'); st.id = 'fb-css';
  st.textContent = `.fb{position:relative;width:100%;height:100%;overflow:hidden;border-radius:18px;background:#5b513f;isolation:isolate}
  .fb-innen{position:absolute;inset:0;overflow:hidden;transition:filter .8s}.fb.kalt .fb-innen{filter:blur(5px) saturate(.45) brightness(.94)}
  .fb.traum .fb-innen{filter:sepia(.62) saturate(.75) brightness(1.04) contrast(.92)}.fb-traumrand{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .9s;z-index:3;
    background:radial-gradient(ellipse at 50% 50%,rgba(255,248,230,0) 52%,rgba(250,240,215,.55) 78%,rgba(245,232,200,.92) 100%)}.fb.traum .fb-traumrand{opacity:1}
  .fb-welt{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,#f6eedb 0%,#cdbf9f 55%,#5b513f 100%)}
  .fb-set{position:absolute;inset:0;visibility:hidden}.fb-set.an{visibility:visible}.fb-rig{position:absolute;inset:0;transform-origin:50% 55%}
  .fb-eb{position:absolute;inset:0}.fb-cam{position:absolute;inset:-10%;transform-origin:50% 50%}.fb-cam svg{width:100%;height:100%;display:block}
  .fb-ue{position:absolute;inset:0;pointer-events:none}.fb-blende{opacity:0;background:radial-gradient(ellipse at 50% 50%,${P.nebelFarbe},${hell(P.nebelFarbe, .25)})}
  .fb-wasser{opacity:0;background:linear-gradient(#9cc4c4,#2f5d63)}.fb-flare{opacity:0}
  .fb-kasch{background:radial-gradient(ellipse at 50% 50%,transparent 58%,rgba(30,40,45,.36) 100%)}.fb-korn{mix-blend-mode:multiply;opacity:.2;width:100%;height:100%}.fb-papier{mix-blend-mode:multiply;opacity:0;width:100%;height:100%}.fb-ton{mix-blend-mode:multiply}
  .fk-gard{transform-box:fill-box;transform-origin:50% 0;animation:fkgard 5.2s ease-in-out infinite}@keyframes fkgard{25%{transform:rotate(1.8deg)}75%{transform:rotate(-1.8deg)}}
  .fk-lampe{transform-box:view-box;transform-origin:200px -60px;animation:fklampe 6.4s ease-in-out infinite}@keyframes fklampe{25%{transform:rotate(.9deg)}75%{transform:rotate(-.9deg)}}
  .fk-lampe.stoss{animation:fkstoss 2.6s ease-out}@keyframes fkstoss{12%{transform:rotate(5deg)}32%{transform:rotate(-3.6deg)}52%{transform:rotate(2.2deg)}72%{transform:rotate(-1.2deg)}100%{transform:rotate(0)}}
  #kj-buchstapel{transform-box:fill-box;transform-origin:100% 100%;transition:transform .7s cubic-bezier(.5,0,.7,1.6)}#kj-buchstapel.kipp{transform:rotate(-14deg) translate(6px,0)}
  #kj-dose{transform-box:fill-box;transform-origin:100% 100%;transition:transform .5s cubic-bezier(.5,0,.6,1.4)}#kj-dose.kipp{transform:rotate(90deg) translate(-2px,-1px)}
  .fk-dampf path{animation:fkdampf 3.2s linear infinite;opacity:0}@keyframes fkdampf{0%{transform:translateY(4px);opacity:0}25%{opacity:.9}100%{transform:translateY(-14px);opacity:0}}
  .fk-sekunde{transform-box:fill-box;transform-origin:50% 81.25%;animation:fksek 60s steps(60) infinite}@keyframes fksek{to{transform:rotate(360deg)}}
  .glocke.laeuten{animation:fkglocke 1.6s ease-out}@keyframes fkglocke{15%{transform:rotate(16deg)}35%{transform:rotate(-12deg)}55%{transform:rotate(8deg)}75%{transform:rotate(-4deg)}}
  .fk-flamme{transform-box:fill-box;transform-origin:50% 100%;animation:fkfl 1.1s ease-in-out infinite alternate}@keyframes fkfl{50%{transform:scale(.84,1.14)}to{transform:scale(1.08,.9)}}
  .fk-schein{animation:fksch 2.8s ease-in-out infinite alternate}@keyframes fksch{to{opacity:.78}}
  @media (prefers-reduced-motion:reduce){.fk-gard,.fk-flamme,.fk-schein,.fk-lampe,.fk-dampf path,.fk-sekunde{animation:none}}
  .fb-atmo{overflow:hidden}.fb-atmo .fa{position:absolute;inset:0;pointer-events:none}
  .fa-strahlen{background:repeating-linear-gradient(104deg,transparent 0 7%,color-mix(in srgb,var(--c) 22%,transparent) 8% 11%,transparent 13% 21%);-webkit-mask-image:linear-gradient(transparent,#000 10%,#000 30%,transparent 80%);mask-image:linear-gradient(transparent,#000 10%,#000 30%,transparent 80%);mix-blend-mode:screen;animation:fastrahl 11s ease-in-out infinite alternate}
  @keyframes fastrahl{from{opacity:.45;transform:translateX(-3%)}to{opacity:1;transform:translateX(3%)}}
  .fa-b{position:absolute;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--c) 70%,#fff) 0%,color-mix(in srgb,var(--c) 30%,transparent) 45%,transparent 70%);mix-blend-mode:screen;opacity:.7;animation:fadrift 20s ease-in-out infinite alternate}
  @keyframes fadrift{from{transform:translate(-14px,10px)}to{transform:translate(18px,-16px)}}
  .fa-glanz{background:linear-gradient(112deg,transparent 30%,rgba(255,255,255,.13) 40%,rgba(255,255,255,.04) 46%,transparent 52%,transparent 60%,rgba(255,255,255,.07) 64%,transparent 68%);background-size:260% 100%;animation:faglanz 16s ease-in-out infinite alternate}
  @keyframes faglanz{from{background-position:100% 0}to{background-position:0 0}}
  .fa-st{position:absolute;border-radius:50%;background:#fff;box-shadow:0 0 4px #fff;animation:fafunk 4s ease-in-out infinite}
  @keyframes fafunk{0%,100%{opacity:.35}50%{opacity:1}}
  .fa-lichter{background:radial-gradient(circle at 50% 63%,rgba(255,206,120,.42),transparent 9%),radial-gradient(circle at 29% 52%,rgba(255,200,110,.5),transparent 6%),radial-gradient(circle at 12% 52%,rgba(255,210,130,.35),transparent 4%),radial-gradient(circle at 70% 51%,rgba(255,210,130,.35),transparent 4%),radial-gradient(circle at 88% 53%,rgba(255,210,130,.3),transparent 4%),radial-gradient(ellipse at 50% 78%,rgba(255,200,110,.18),transparent 30%);mix-blend-mode:screen;animation:fafunk 6s ease-in-out infinite}
  .fa-ziehen{background:radial-gradient(ellipse 60% 14% at 30% 58%,rgba(240,242,236,.85),transparent 70%),radial-gradient(ellipse 50% 10% at 80% 72%,rgba(240,242,236,.7),transparent 70%);filter:blur(6px);animation:faziehen 26s linear infinite}
  .fa-ziehen.b{opacity:.7;animation-duration:38s;animation-direction:reverse;top:-12%}
  @keyframes faziehen{from{transform:translateX(-30%)}to{transform:translateX(30%)}}
  .fa-regen{background-image:repeating-linear-gradient(100deg,transparent 0 13px,rgba(225,235,242,.32) 13px 14px,transparent 14px 31px);background-size:100% 140px;animation:faregen .5s linear infinite;opacity:.8}
  .fa-regen.b{background-size:100% 90px;animation-duration:.35s;opacity:.5;filter:blur(1px)}
  @keyframes faregen{from{background-position:0 0}to{background-position:-24px 140px}}
  .fa-t{position:absolute;border-radius:50% 50% 50% 50%/58% 58% 42% 42%;-webkit-backdrop-filter:blur(2.5px) brightness(1.12);backdrop-filter:blur(2.5px) brightness(1.12);box-shadow:inset 0 -2px 3px rgba(0,0,0,.25),inset 0 2px 2px rgba(255,255,255,.55),0 1px 2px rgba(0,0,0,.15)}
  .fa-t.rinnt{animation:farinn 18s ease-in infinite}
  @keyframes farinn{0%,60%{transform:translateY(0)}100%{transform:translateY(160px)}}
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
    <filter id="fb-korn"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .16  0 0 0 0 .1  0 0 0 .6 0"/></filter>
    <filter id="fb-stift"><feTurbulence type="fractalNoise" baseFrequency="1.4 .25" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .28  0 0 0 0 .2  0 0 0 0 .12  0 0 0 1.1 -.3"/></filter>
    <filter id="fb-papierf"><feTurbulence type="fractalNoise" baseFrequency=".012 .018" numOctaves="4" seed="11"/><feColorMatrix values="0 0 0 0 .72  0 0 0 0 .58  0 0 0 0 .38  0 0 0 1.3 -.5"/></filter>
    <filter id="fbg-pigment" x="-3%" y="-3%" width="106%" height="106%"><feMorphology in="SourceAlpha" operator="erode" radius="2" result="e"/><feComposite in="SourceAlpha" in2="e" operator="out" result="rand"/>
      <feFlood flood-color="#4a2e14" flood-opacity=".32"/><feComposite in2="rand" operator="in" result="dunkel"/><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" result="d"/><feMerge><feMergeNode in="d"/><feMergeNode in="dunkel"/></feMerge></filter>
    <filter id="fbg-tusche" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="6" result="t"/><feDisplacementMap in="SourceAlpha" in2="t" scale="1.6" result="a"/>
      <feMorphology in="a" operator="dilate" radius="1.3" result="g"/><feComposite in="g" in2="a" operator="out" result="linie"/><feFlood flood-color="#3b2614"/><feComposite in2="linie" operator="in" result="tinte"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="tinte"/></feMerge></filter>
    <filter id="fbg-krakel" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="8" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.4"/></filter></defs></svg>`;
}
function mount(el) {
  css();
  el.innerHTML = `<div class="fb">${defs()}<div class="fb-innen"><div class="fb-welt"></div></div><div class="fb-ue fb-kasch"></div>
    <svg class="fb-ue fb-papier" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true"><rect width="400" height="500" filter="url(#fb-papierf)"/></svg>
    <svg class="fb-ue fb-korn" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true"><rect width="400" height="500" filter="url(#fb-korn)"/></svg><div class="fb-ue fb-ton"></div><div class="fb-ue fb-atmo"></div>
    <div class="fb-traumrand"></div><div class="fb-ue fb-wasser"></div><div class="fb-ue fb-blende"></div><div class="fb-ue fb-flare"></div>
    <div class="fb-med"><svg viewBox="0 0 122 122">${harmsBuste()}</svg><span class="fb-tel" hidden>☎️</span></div></div>`;
  root = el.querySelector('.fb'); welt = el.querySelector('.fb-welt'); SETS = {}; EB = {}; CAM = {}; ort = null; glasName = ''; glasJetzt(); atmoBauen();
  messen(); if (!laeuft) { laeuft = true; requestAnimationFrame(zeichne); }
}
/* Pixel je Bühnen-Einheit: die Bühne füllt den Rahmen (slice), bei hohen Rahmen zählt die Höhe (v5.80; vorher nur die Breite, dann fuhr die Kamera im Hochformat am Ziel vorbei) */
function messen() { if (root) K = Math.max((root.clientWidth || 400) / 400, (root.clientHeight || 0) / 500) || 1; }
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
    else cam.innerHTML = SV(e.svg, (ORT_OPT[o] || {}).weit);
    eb.appendChild(cam); rig.appendChild(eb);
    EB[key].push({d: e.d, eb, cam, scroll: !!e.scroll, last: '', pm: e.pm});
  }
  welt.appendChild(set); SETS[key] = set; CAM[key] = CAM[key] || {...NULLCAM};
  if ((ORT_OPT[o] || {}).ausrichten) ausrichten(key);
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
let HOEHE = [], WELLEN = [], FLUSS = [], MOEWEN = [], DRIFT = [], TEILE = [], BOBS = [], BLASEN = [], WENDE = [];
function sammeln() {
  const q = x => [...welt.querySelectorAll(x)];
  HOEHE = q('[data-h]').map(el => ({el, h: +el.dataset.h, cx: +el.dataset.cx, cy: +el.dataset.cy, s: +el.dataset.s}));
  WELLEN = q('[data-welle]').map(el => { const [sp, amp, ph, per = 0] = el.dataset.welle.split(',').map(Number); return {el, sp, amp, ph, per, b: el.getAttribute('transform') || ''}; });
  FLUSS = q('[data-fluss]').map(el => ({el, sp: +el.dataset.fluss}));
  MOEWEN = q('[data-moewe]').map(el => { const [x0, y0, x1, y1, dur, ph] = el.dataset.moewe.split(',').map(Number), flug = el.querySelector('.fb-flug'); return {el, x0, y0, x1, y1, dur, ph, flug, bilder: flug && flug.dataset.bilder ? [...flug.children] : null, bi: 0}; });
  DRIFT = q('[data-drift]').map(el => { const [sp, ph] = el.dataset.drift.split(',').map(Number); return {el, sp, ph, cx: +el.getAttribute('cx')}; });
  TEILE = q('[data-dreh]').map(el => ({el, art: el.dataset.dreh, wer: el.dataset.wer, px: +el.dataset.px, py: +el.dataset.py, ph: Math.random() * 6, auf: el.querySelector(':scope > .m-auf'), zu: el.querySelector(':scope > .m-zu'), o: 0, oz: -1}));
  WENDE = q('[data-wende]').map(el => ({el, wer: el.dataset.wende, sv: el.querySelector(':scope > .kw-s'), vv: el.querySelector(':scope > .kw-v'), hx: +el.dataset.hx, hy: +el.dataset.hy, u: 0, zuletzt: -9}));
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
  const OO = ORT_OPT[key.split(':')[0]] || {}, atmen = reduziert ? 0 : (OO.atmen != null ? OO.atmen : 1), ox0 = Math.sin(t * .23) * 4 * atmen, oy0 = Math.cos(t * .17) * 2.5 * atmen;
  for (const L of EB[key]) {
    const d = L.d;
    let zl = 1 + (c.z - 1) * (.25 + .75 * d); zl *= 1 + c.vert * (.55 - d) * (d > .55 ? .7 : 1.8);
    const u = Math.max(0, Math.min(1, (zl - 1) / .5));
    let tx = (c.fx - 200) * (1 - u - zl) + (ox0 + c.ox) * d, ty = (c.fy - 250) * (1 - u - zl) + (oy0 + c.oy) * d;
    if (L.scroll) tx += ((((scrollOff * d) % 480) + 480) % 480) - 240 + 240 * 0;
    /* Wischen: alle Ebenen wandern, nahe etwas schneller als ferne (pm), mit dem Zoom mitskaliert */
    if (c.pan) tx -= c.pan * (L.pm != null ? L.pm : 1 + (d - .5) * (OO.panTiefe != null ? OO.panTiefe : .2)) * zl;
    L.cam.style.transform = `translate(${(tx * K).toFixed(1)}px,${(ty * K).toFixed(1)}px) scale(${zl.toFixed(4)})`;
    if (d > 0) {
      const G = glasJetzt();
      const bl = key === 'orbit:seite' || leicht ? 0 : Math.min(12, 3.2 * G.blur * (OO.unschaerfe != null ? OO.unschaerfe : 1) * Math.abs(d - c.df) * (1 + (zl - 1) * .5) + extraBlur);
      const op = d < .55 ? 1 - P.nebel * G.dunst * (OO.dunst != null ? OO.dunst : 1) * .9 * (.55 - d) / .55 : 1, k = bl.toFixed(1) + '|' + op.toFixed(2) + '|' + glasName + (leicht ? '|l' : '');
      if (L.last !== k) {
        const f = [];
        if (G.kante && d >= .25 && d <= .9 && !leicht) f.push(`url(#fbg-${G.kante})`);
        if (G.schatten && d >= .2 && d < .99 && !leicht) f.push(`drop-shadow(${(2 + d * 4).toFixed(1)}px ${(5 + d * 8).toFixed(1)}px ${(2 + d * 2).toFixed(1)}px rgba(40,28,14,.5))`);
        if (bl > .15) f.push(`blur(${bl.toFixed(1)}px)`);
        L.cam.style.filter = f.join(' '); L.cam.style.opacity = op.toFixed(2); L.last = k;
      }
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
  e = $id('fh-pos'); if (e) e.setAttribute('transform', `translate(${(262 - s.a * 86 + s.rums * 7).toFixed(1)} ${(362 + s.p * 14).toFixed(1)}) scale(${(1.15 + s.p * .18).toFixed(3)})`);
  /* v5.84 Rumms am Fender: Fender wird flach, Pauls Boot ELSE weicht aus und schaukelt nach */
  e = $id('fh-else-b'); if (e) e.setAttribute('transform', `translate(${(-s.rums * 5).toFixed(1)} 0) rotate(${(-s.rums * 4 + Math.sin(t * 1.4) * (.6 + s.rums * 1.5)).toFixed(2)})`);
  e = $id('fh-fender'); if (e) e.setAttribute('transform', `rotate(${(Math.sin(t * 2.2) * (2 + s.fender * 6) * (1 - s.rums)).toFixed(2)}) scale(${((1 + s.fender * .14) * (1 - s.rums * .38)).toFixed(3)} ${(1 + s.fender * .14 + s.rums * .1).toFixed(3)})`);
  e = $id('fh-kiel'); if (e) e.setAttribute('opacity', (s.motor * .9).toFixed(2));
  /* Lehrbild im Schnitt: Propeller und Rad drehen je nach Gang, das Heck wandert */
  e = $id('fx-pos'); if (e) e.setAttribute('transform', `translate(${(200 - s.a * 70).toFixed(1)} 0)`);
  e = $id('fx-prop'); if (e) e.setAttribute('transform', `rotate(${(s.dreh * t * 420 % 360).toFixed(1)} 0 242)`);
  e = $id('fm-prop'); if (e) e.setAttribute('transform', `rotate(${(s.dreh * t * 420 % 360).toFixed(1)} 200 392)`);
  /* v5.84: „von achtern gesehen“ erst mit dem Pfeil, sonst verrät das Bild die Antwort auf sbf:44 (1-5, Smilla irrt erst „von vorne“) */
  e = $id('fm-titel'); if (e) e.setAttribute('opacity', s.pfeil.toFixed(2));
  e = $id('fm-cw'); if (e) e.setAttribute('opacity', (s.dreh >= 0 ? s.pfeil : 0).toFixed(2));
  e = $id('fm-ccw'); if (e) e.setAttribute('opacity', (s.dreh < 0 ? s.pfeil : 0).toFixed(2));
  e = $id('fx-speichen'); if (e) e.setAttribute('transform', `rotate(${(s.dreh * t * 40 % 360).toFixed(1)} 0 242)`);
  e = $id('fx-rad'); if (e) e.setAttribute('opacity', s.rad.toFixed(2));
  e = $id('fx-pfeil'); if (e) e.setAttribute('opacity', s.pfeil.toFixed(2));
  /* Hafenbecken: die Frieda fährt, die Welt zieht vorbei */
  /* v5.84 Schwell an der Ausfahrt (1-4, Fähre und Raser): die Frieda schaukelt stärker */
  e = $id('fa-pos'); if (e) e.setAttribute('transform', `translate(220 ${(346 + Math.sin(t * 2.6) * 5 * s.schwell).toFixed(1)}) rotate(${(Math.sin(t * 2.1) * 5 * s.schwell).toFixed(2)}) scale(1.4)`);
  for (const id of ['fb-boot', 'fa-boot', 'fs-boot']) { const g = $id(id + '-gischt'); if (g) g.setAttribute('opacity', (Math.min(1, (id === 'fs-boot' ? s.go : s.fahrt)) * (.7 + Math.sin(t * 6) * .3)).toFixed(2)); }
  e = $id('fb-hilke'); if (e) e.setAttribute('opacity', s.hilkeB.toFixed(2));
  /* Klabauter in der Kajüte ein- und ausblenden (TU klab; in der Geschichte ist er erst ab Folge 1-6 an Bord) */
  e = $id('fk-klabauter'); if (e && e._k !== s.klab) { e.style.opacity = s.klab.toFixed(2); e._k = s.klab; }
  /* v5.83 Hafenkino: Bierdose, Leihboot fährt vorbei, die vier gehen; Kessel- und Becherdampf (kalter Kaffee, kalter Herd); Backbord auf dem Kocher; Hilke mit oder ohne Quittungsblock */
  /* v5.84 Vorstellung (O178): TU traum=1 zeigt, dass ein Bild nur gedacht ist (Sepia, heller Rand wie eine Erinnerung), z. B. Klüverhafen vom Manöverbrett aus */
  if (root && root._traum !== (s.traum > .5)) { root._traum = s.traum > .5; root.classList.toggle('traum', root._traum); }
  /* v5.84 Hafenkino bewegt (O173): ch 0 = noch draußen rechts, 1 = liegt am Steg; krach = Rumms gegen den Steg */
  e = $id('gg-charter'); if (e) { const k = `${s.ch.toFixed(3)}|${s.krach.toFixed(3)}|${s.ch < 1 ? (t * 4 | 0) : 0}`; if (e._k !== k) { e._k = k;
    const fahrt = 1 - s.ch, wack = fahrt > .01 ? Math.sin(t * 1.3) * 1.2 : 0;
    e.setAttribute('transform', `translate(${(206 + fahrt * 330 - s.krach * 9).toFixed(1)} ${(306 + fahrt * 10).toFixed(1)}) rotate(${(wack - s.krach * 3.5).toFixed(2)}) scale(1.02)`); } }
  e = $id('gg-dose'); if (e) e.setAttribute('opacity', s.dose.toFixed(2));
  e = $id('gg-eboot'); if (e) e.setAttribute('transform', `translate(${(-140 + s.eboot * 680).toFixed(1)} 372)`);
  e = $id('gg-crew'); if (e && e._k !== s.weg) { e.style.opacity = (1 - s.weg).toFixed(2); e._k = s.weg; }
  e = $id('fk-kessel-dampf'); if (e && e._k !== s.kessel) { e.style.opacity = (s.kessel * .7).toFixed(2); e._k = s.kessel; }
  e = $id('fk-becher-smilla'); if (e && e._k !== s.dampf) { const d = e.querySelector('.fk-dampf'); if (d) d.style.opacity = (s.dampf * .55).toFixed(2); e._k = s.dampf; }
  e = $id('fk-katze-kocher'); if (e && e._k !== s.kk) { e.style.opacity = s.kk.toFixed(2); const v = $id('fk-backbord'); if (v) v.style.opacity = (1 - s.kk).toFixed(2); e._k = s.kk; }
  e = $id('fs-hilke-block'); if (e && e._k !== s.block) { e.style.opacity = s.block.toFixed(2); const f = $id('fs-hilke-frei'); if (f) f.style.opacity = (1 - s.block).toFixed(2); e._k = s.block; }
  /* Hinnerk in der Kajüte ausblenden (TU hin), wenn er in der Geschichte oben am Ruder steht; sein Becher bleibt auf dem Tisch */
  /* TU leer (v5.83): die Kajüte ist leer, alle sind oben (1-1, Anruf); Becher mit weg */
  { const oh = s.hin * (1 - s.leer), osm = 1 - s.leer;
    e = $id('fk-hinnerk'); if (e && e._k !== oh) { e.style.opacity = oh.toFixed(2); const arme = $id('fk-hinnerk-arme'); if (arme) arme.style.opacity = oh.toFixed(2); e._k = oh; }
    e = $id('fk-smilla'); if (e && e._k !== osm) { e.style.opacity = osm.toFixed(2); const arme = $id('fk-smilla-arme'); if (arme) arme.style.opacity = osm.toFixed(2); e._k = osm;
      for (const b of ['fk-becher-hinnerk', 'fk-becher-smilla', 'fk-becher-du']) { const g = $id(b); if (g) g.style.opacity = osm.toFixed(2); } } }
  e = $id('fk-becher-hinnerk'); if (e) { const o = s.hin * s.dampf; if (e._k !== o) { const d = e.querySelector('.fk-dampf'); if (d) d.style.opacity = (o * .55).toFixed(2); e._k = o; } }   /* ohne Hinnerk dampft sein Becher nicht: der Kaffee ist kalt (1-3) */
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
  /* faehre < 0 = keine Fähre zu sehen (v5.84: nach der Durchfahrt liegt sie hinten im Hafen, nicht wieder draußen) */
  e = $id('fa-faehre'); if (e) { const f = Math.max(0, s.faehre); e.setAttribute('transform', `translate(${(40 + f * 120).toFixed(1)} ${(266 + f * 12).toFixed(1)}) scale(${(.32 + f * .9).toFixed(3)})`); e.setAttribute('opacity', s.faehre < 0 ? Math.max(0, 1 + s.faehre * 4).toFixed(2) : '1'); }
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
    if (p.art === 'fig') w = sprecher && p.wer === sprecher ? Math.sin(t * 9 + p.ph) * .8 : Math.sin(t * 1.2 + p.ph) * .5;
    else if (p.art === 'arm-h') w = Math.sin(t * .9 + p.ph) * 4 + (sprecher === 'HINNERK' ? Math.sin(t * 4) * 6 : 0);
    else if (p.art === 'arm-s') w = sprecher === 'SMILLA' ? -30 + Math.sin(t * 5) * 14 : 0;
    else if (p.art === 'arm-hi') w = s.winken > .5 ? -95 + Math.sin(t * 9) * 28 : (sprecher === 'HAFENMEISTER' ? -20 + Math.sin(t * 5) * 8 : 0);
    else if (p.art === 'arm') w = p.wer === 'HAFENMEISTER' && s.winken > .5 ? -100 + Math.sin(t * 9) * 26 : sprecher && p.wer === sprecher ? -14 + Math.sin(t * 4 + p.ph) * 11 : Math.sin(t * .9 + p.ph) * 3;
    else if (p.art === 'kopf') w = sprecher && p.wer === sprecher ? Math.sin(t * 3.1 + p.ph) * 3.2 : Math.sin(t * .6 + p.ph) * 1.4;
    else if (p.art === 'blink') {
      const k = ((t + p.ph * 3) % 4.4) < .13 ? .12 : 1;
      if (p.k !== k) { p.el.setAttribute('transform', k === 1 ? '' : `translate(${p.px} ${p.py}) scale(1 ${k}) translate(${-p.px} ${-p.py})`); p.k = k; }
      continue;
    }
    else if (p.art === 'mund' || p.art === 'schnabel') {
      /* v5.81: beim Sprechen geht der Mund wirklich auf; mit FILMB.pegel folgt er der Lautstärke der Stimme, sonst einem Silben-Takt */
      const sp = sprecher && p.wer === sprecher, ziel = !sp ? 0 : pegel != null ? pegel : Math.max(0, Math.min(1, .08 + .92 * Math.max(0, Math.sin(t * 12.6 + p.ph)) * (.55 + .45 * Math.sin(t * 3.3 + p.ph * 2))));
      p.o += (ziel - p.o) * Math.min(1, dt * 24);
      if (Math.abs(p.o - p.oz) < .015) continue; p.oz = p.o;
      if (p.art === 'schnabel') { p.el.setAttribute('transform', `rotate(${(p.o * 34).toFixed(1)} ${p.px} ${p.py})`); continue; }
      if (p.auf) { const x = +p.auf.dataset.ax, y = +p.auf.dataset.ay; p.auf.setAttribute('transform', `translate(${x} ${y}) scale(${(.72 + .28 * p.o).toFixed(3)} ${p.o.toFixed(3)}) translate(${-x} ${-y})`); if (p.zu) p.zu.style.opacity = p.o > .1 ? 0 : 1; }
      else p.el.setAttribute('transform', `translate(${p.px} ${p.py}) scale(1 ${(1 + p.o * 1.4).toFixed(2)}) translate(${-p.px} ${-p.py})`);
      continue;
    }
    else if (p.art === 'zopf') w = Math.sin(t * 2.3 + p.ph) * 7;
    else if (p.art === 'schwanz') w = Math.sin(t * 1.6 + p.ph) * 16;
    p.el.setAttribute('transform', `rotate(${w.toFixed(2)} ${p.px} ${p.py})`);
  }
  /* v5.81: wer spricht, dreht den Kopf zum Betrachter (Figuren mit o.wende), kurz nach dem Satz wieder zurück */
  for (const w of WENDE) {
    if (sprecher && w.wer === sprecher) w.zuletzt = t;
    const ziel = t - w.zuletzt < .5 ? 1 : 0; if (w.u === ziel || !w.sv || !w.vv) continue;
    w.u = ziel > w.u ? Math.min(1, w.u + dt * 5) : Math.max(0, w.u - dt * 4);
    const vorn = w.u >= .5, f = vorn ? .7 + (w.u - .5) * .6 : 1 - w.u * .6, g = vorn ? w.vv : w.sv;
    w.sv.style.display = vorn ? 'none' : ''; w.vv.style.display = vorn ? '' : 'none';
    g.setAttribute('transform', f > .995 ? '' : `translate(${w.hx} ${w.hy}) scale(${f.toFixed(3)} 1) translate(${-w.hx} ${-w.hy})`);
  }
  for (const w of WELLEN) { const dx = w.per ? ((((t * w.sp) % w.per) + w.per) % w.per) - w.per : Math.sin(t * .05 + w.ph) * w.sp * 6; w.el.setAttribute('transform', `${w.b} translate(${dx.toFixed(1)} ${(Math.sin(t * 1.1 + w.ph) * w.amp).toFixed(1)})`); }
  for (const f of FLUSS) f.el.setAttribute('stroke-dashoffset', (t * f.sp).toFixed(1));
  for (const m of MOEWEN) { const u = ((t + m.ph) % m.dur) / m.dur, x = m.x0 + (m.x1 - m.x0) * u, y = m.y0 + (m.y1 - m.y0) * u + Math.sin(u * 9) * 10; m.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); if (m.bilder) { const i = Math.floor(((t * 1.6 + m.ph) % 1) * m.bilder.length); if (i !== m.bi) { m.bilder[m.bi].style.display = 'none'; m.bilder[i].style.display = ''; m.bi = i; } } else if (m.flug) m.flug.setAttribute('transform', `scale(1 ${(.35 + Math.abs(Math.sin(t * 5 + m.ph)) * .8).toFixed(2)})`); }
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
    const n = name + ':' + nb, z = zielCam(nb, (ORT_OPT[name] || {}).start || 'totale'); CAM[n] = {...z};
    if (ueb === 'sofort' || (!alt && ueb !== 'platten')) zeige(n);
    else await (UEB[ueb] || UEB.nebel)(alt, n, z);
    ort = name; blick = nb; einstAkt = (ORT_OPT[name] || {}).start || 'totale'; if (mitte) { sofort(mitte); mitte = null; }
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
    blick = b; einstAkt = einst; if (mitte) { sofort(mitte); mitte = null; }
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
  tweens = []; s = {...NULLS}; einstAkt = 'totale'; extraBlur = 0; scrollOff = 0; sprecher = ''; pegel = null; kette = Promise.resolve();
  if (welt) { welt.innerHTML = ''; } SETS = {}; EB = {}; CAM = {}; ort = null; blick = 'seite'; einfrieren(false); medaillon(null);
  if (root) root.querySelectorAll('.fb-ue').forEach(x => x.getAnimations().forEach(a => a.cancel()));
}
/* sofort auf einen Stand springen (Abspielen ab einem späteren Kapitel) */
function sofort(werte) { for (const [k, [v]] of Object.entries(werte)) if (k in s) s[k] = v; }
/* Wischen (v5.81): Kamera seitlich verschieben, ohne Übergang; Pegel: Mundöffnung 0…1 des Sprechers (null = Silben-Takt) */
function panSetzen(p) { const c = CAM[akt()]; if (c) c.pan = p; }
/* Leichte Stufe (v5.82): ohne Unschärfe, Kanten- und Schattenfilter; bord.js schaltet sie ein, wenn das Wischen ruckelt */
window.FILMB = {_ebenen: (o, b) => ORTE[o][b](), pan: panSetzen, leicht: v => { if (v === undefined) return leicht; leicht = !!v; }, kaj: {pm: KAJ.pm, off: kajOff}, pegel: v => { pegel = v == null ? null : Math.max(0, Math.min(1, v)); }, ORT_OPT, get K() { return K; },
  teile: {knotenbrett, manoeverbrett, buecherregal, seekarteWand, telefon, BRETT, KNOTEN_BRETT, KNOTEN_SCHILD, MANOEVER, BUECHER}, GLAS, LICHT, licht: lichtSetzen, atmo, mount, ort: ortSetzen, kamera, tu, sofort, vertigo, einfrieren, medaillon, sprecher: sprecherSetzen, reset, warte: () => kette,
  uhr: m => { uhrMin = m == null ? null : Math.round(m) % 1440; },
  get zustand() { return {ort, blick, einst: einstAkt, s: {...s}, sets: Object.keys(SETS)}; }, ORTE: Object.keys(ORTE), EINST};
})();
