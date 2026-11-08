/* ==========================================================================
   Skipper – Animationen, dritter Teil (v5.29): A5 Lichter bis A10 Binnen aus docs/animationen-liste.md.
   Nutzt den Baukasten aus anim2.js (ANIM.szene, ANIM.bau, ANIM.hilfe). Fachlich nach data/sbf.json, ohne quellen/ geprüft (R8).
   ========================================================================== */
(() => {
const A = window.ANIM; if (!A || !A.szene || A.defs.lichtertafel) return;
const S = A.szene, B = A.bau, {q, qa, T, P, LF, H, M, K} = A.hilfe;

/* ---------- Fahrzeuge bei Nacht und am Tag (von der Seite, Steuerbord zu uns, Bug rechts) ---------- */
const F = {
  motor: {n: 'Maschinenfahrzeug in Fahrt', L: 170, m: [[40, 60]], l: [[40, -78, 'w'], [74, -22, 'g']], tag: [], tt: 'kein Zeichen'},
  segler: {n: 'Segelfahrzeug in Fahrt', L: 110, m: [[5, 90]], segel: true, l: [[48, -22, 'g']], tag: [], tt: 'unter Motor: Kegel, Spitze unten'},
  schlepper: {n: 'Schlepper, Schleppe bis 200 m', L: 120, m: [[25, 60]], l: [[25, -78, 'w'], [25, -64, 'w'], [50, -22, 'g']], tag: [], tt: 'über 200 m: Rhombus'},
  trawler: {n: 'Fischer, der trawlt', L: 120, m: [[10, 66]], l: [[10, -82, 'g'], [10, -66, 'w'], [52, -22, 'g']], tag: [['kegel', 10, -76, false], ['kegel', 10, -60, true]], tt: 'zwei Kegel, Spitzen zueinander'},
  fischer: {n: 'Fischer, nicht trawlend', L: 110, m: [[10, 60]], l: [[10, -76, 'r'], [10, -60, 'w'], [48, -22, 'g']], tag: [['kegel', 10, -70, false], ['kegel', 10, -54, true]], tt: 'zwei Kegel, Spitzen zueinander'},
  tiefgang: {n: 'Tiefgangbehindert', L: 210, m: [[50, 80]], l: [[50, -100, 'r'], [50, -86, 'r'], [50, -72, 'r'], [20, -60, 'w'], [92, -22, 'g']], tag: [['zylinder', 50, -84]], tt: 'Zylinder'},
  unf: {n: 'Manövrierunfähig', L: 150, m: [[30, 60]], l: [[30, -76, 'r'], [30, -62, 'r']], tag: [['ball', 30, -76], ['ball', 30, -58]], tt: 'zwei Bälle'},
  beh: {n: 'Manövrierbehindert', L: 150, m: [[30, 70]], l: [[30, -90, 'r'], [30, -76, 'w'], [30, -62, 'r'], [64, -22, 'g']], tag: [['ball', 30, -92], ['rhombus', 30, -74], ['ball', 30, -56]], tt: 'Ball, Rhombus, Ball'},
  anker: {n: 'Vor Anker (unter 50 m)', L: 140, m: [[50, 50]], l: [[60, -64, 'w']], tag: [['ball', 50, -62]], tt: 'ein Ball'},
  grund: {n: 'Auf Grund', L: 140, m: [[50, 64]], l: [[60, -50, 'w'], [50, -82, 'r'], [50, -68, 'r']], tag: [['ball', 50, -88], ['ball', 50, -72], ['ball', 50, -56]], tt: 'drei Bälle'}};
const form = ([art, x, y, o]) => art === 'ball' ? B.ball(x, y) : art === 'kegel' ? B.kegel(x, y, o) : art === 'rhombus' ? B.rhombus(x, y) : B.zylinder(x, y);
const nacht = f => `<g opacity=".28">${B.seite(f.L, f.m, '#8c99a6', !f.segel)}</g>${f.segel ? '<path d="M5 -100 L5 -22 L-40 -22Z" fill="#9aa5ad" opacity=".25"/>' : ''}${f.l.map(([x, y, c]) => B.licht(x, y, LF[c], 4.5)).join('')}`;
const tag = f => `${B.seite(f.L, f.m, '#4a4f57', !f.segel)}${f.segel ? '<path d="M5 -100 L5 -22 L-40 -22Z" fill="#fff" stroke="#888"/>' : ''}${f.tag.map(form).join('')}`;
const paar = (f, nachtS = .72, tagS = .72) => `<rect x="0" y="40" width="200" height="225" fill="#142033"/><rect x="0" y="210" width="200" height="55" fill="#0b1726"/><rect x="200" y="40" width="200" height="225" fill="#bfe0f2"/><rect x="200" y="210" width="200" height="55" fill="#4d93bd"/>
  <g transform="translate(100 214) scale(${nachtS})">${nacht(f)}</g><g transform="translate(300 214) scale(${tagS})">${tag(f)}</g>${T(100, 58, 'Nacht', 'middle', 12, 'w')}${T(300, 58, 'Tag', 'middle', 12)}${T(300, 254, f.tt, 'middle', 11, 'w')}`;
const reihe = (keys, texte) => ({obj: Object.fromEntries(keys.map(k => [k, paar(F[k])])), start: Object.fromEntries(keys.map((k, i) => [k, {o: i ? 0 : 1}])),
  phasen: keys.map((k, i) => ({...P(texte[i][0], texte[i][1]), cap: F[k].n, an: [k], aus: keys.filter(x => x !== k), dur: .4}))});

/* ======================= A5 Lichter und Signalkörper ======================= */
S('lichtertafel', {titel: 'Lichter und Signalkörper je Fahrzeug', nr: 'A5.2', gruppe: 'A5 Lichter und Signalkörper', folge: 'S3.1–S3.6', bg: '<rect width="400" height="300" fill="#f3ead2"/>',
  ...reihe(['motor', 'segler', 'schlepper', 'trawler', 'fischer', 'tiefgang', 'unf', 'beh', 'anker', 'grund'], [
    [H, 'Ein Maschinenfahrzeug in Fahrt: weißes Topplicht oben, darunter das Seitenlicht, von hier das grüne. Von hinten sähe man das weiße Hecklicht.'],
    [M, 'Ein Segler zeigt nur Seitenlichter und Hecklicht, kein Topplicht. Fährt er mit Motor, ist er ein Maschinenfahrzeug und führt dessen Lichter.'],
    [H, 'Ein Schlepper hat zwei weiße Topplichter übereinander, bei einer Schleppe über zweihundert Metern drei. Hinten zusätzlich das gelbe Schlepplicht.'],
    [M, 'Ein Fischer, der trawlt, also das Netz schleppt: Grün über Weiß, rundum sichtbar. Tagsüber zwei Kegel mit den Spitzen zueinander.'],
    [H, 'Ein anderer Fischer, zum Beispiel mit Stellnetz: Rot über Weiß. Merk dir: Rot über Weiß, Fischer auf der Reis.'],
    [M, 'Drei rote Rundumlichter übereinander: ein tiefgangbehindertes Fahrzeug. Tagsüber ein schwarzer Zylinder. Dem machen wir Platz.'],
    [H, 'Zwei rote übereinander: manövrierunfähig. Der kann nicht ausweichen. Tagsüber zwei schwarze Bälle.'],
    [M, 'Rot, Weiß, Rot: manövrierbehindert, zum Beispiel beim Arbeiten. Tagsüber Ball, Rhombus, Ball.'],
    [H, 'Ein weißes Rundumlicht vorn: Er liegt vor Anker. Tagsüber ein schwarzer Ball.'],
    [M, 'Ankerlicht und dazu zwei rote: Der sitzt auf Grund. Tagsüber drei Bälle. Da kommt man besser nicht hin.']])});

S('schlepp', {titel: 'Schleppverband', nr: 'A5.3', gruppe: 'A5 Lichter und Signalkörper', folge: 'S3.3',
  bg: B.nacht(200), obj: {zug: `<g transform="scale(.55)">${nacht(F.schlepper)}</g>`, anh: `<g transform="scale(.5)"><g opacity=".28">${B.seite(120, [], '#8c99a6', false)}</g>${B.licht(48, -22, LF.g, 4.5)}</g>`, leine: '<path d="M-120 0 Q-60 14 0 0" stroke="#c9c9c9" stroke-width="2" fill="none" opacity=".6"/>', drei: B.licht(0, 0, LF.w, 2.6), lang: T(0, 0, 'Schleppe über 200 m: drei Topplichter', 'middle', 11, 'w'),
    tag: `<rect x="-200" y="-200" width="400" height="300" fill="#bfe0f2"/><rect x="-200" y="0" width="400" height="100" fill="#4d93bd"/><g transform="translate(-20 0) scale(.55)">${B.seite(120, [[25, 60]])}${B.rhombus(25, -60)}</g><g transform="translate(-170 0) scale(.5)">${B.seite(120, [[0, 40]], '#4a4f57', false)}${B.rhombus(0, -46)}</g>${T(0, -110, 'Tag: Rhombus, wenn die Schleppe über 200 m lang ist', 'middle', 11)}`},
  start: {zug: {x: 290, y: 200}, anh: {x: 120, y: 200}, leine: {x: 260, y: 196}, drei: {x: 304, y: 156, o: 0}, lang: {x: 200, y: 260, o: 0}, tag: {x: 200, y: 200, o: 0}},
  phasen: [P(H, 'Nachts siehst du beim Schlepper zwei Topplichter übereinander. Dahinter, an einer langen Leine, hängt der Anhang mit Seitenlichtern und Hecklicht.', {cap: 'Schlepper: zwei Topplichter'}),
    P(M, 'Ist die Schleppe länger als zweihundert Meter, sind es drei Topplichter. Niemals zwischen Schlepper und Anhang durchfahren!', {cap: 'Länger als 200 m: drei', an: ['drei', 'lang']}),
    P(H, 'Am Tag zeigen beide einen schwarzen Rhombus, wenn die Schleppe länger als zweihundert Meter ist.', {cap: 'Tagsignal: Rhombus', an: ['tag']})]});

S('manunf', {titel: 'Manövrierunfähig, manövrierbehindert, Bagger', nr: 'A5.4', gruppe: 'A5 Lichter und Signalkörper', folge: 'S3.4, S3.5',
  bg: '<rect width="400" height="300" fill="#f3ead2"/>', obj: {unf: paar(F.unf), beh: paar(F.beh),
    bag: `<rect x="0" y="40" width="400" height="225" fill="#bfe0f2"/><rect y="200" width="400" height="65" fill="#4d93bd"/><g transform="translate(200 206) scale(.8)">${B.seite(200, [[-40, 70], [40, 70]], '#6b5a2e')}${B.ball(-40, -86)}${B.ball(-40, -68)}${B.rhombus(40, -88)}${B.rhombus(40, -64)}</g>${T(95, 92, 'zwei Bälle:', 'middle', 12)}${T(95, 108, 'hier nicht vorbei', 'middle', 12, 'r')}${T(305, 92, 'zwei Rhomben:', 'middle', 12)}${T(305, 108, 'hier vorbei', 'middle', 12, 'gr')}`},
  start: {beh: {o: 0}, bag: {o: 0}},
  phasen: [P(H, 'Manövrierunfähig heißt: Der kann wegen einer Störung nicht ausweichen, zum Beispiel Ruder kaputt. Nachts zwei rote Lichter übereinander, tagsüber zwei Bälle.', {cap: 'Manövrierunfähig'}),
    P(M, 'Manövrierbehindert heißt: Seine Arbeit hindert ihn am Ausweichen, etwa beim Kabellegen. Rot, Weiß, Rot, und am Tag Ball, Rhombus, Ball.', {cap: 'Manövrierbehindert', an: ['beh'], aus: ['unf'], dur: .4}),
    P(H, 'Ein Bagger zeigt dazu, wo man vorbeikommt: An der Seite mit zwei Bällen oder zwei roten Lichtern nicht, an der Seite mit zwei Rhomben oder zwei grünen Lichtern schon.', {cap: 'Bagger: auf der Rhomben-Seite vorbei', an: ['bag'], aus: ['beh'], dur: .4})]});

S('fischer', {titel: 'Fischer und Tiefgänger', nr: 'A5.5', gruppe: 'A5 Lichter und Signalkörper', folge: 'S3.6', bg: '<rect width="400" height="300" fill="#f3ead2"/>',
  ...reihe(['trawler', 'fischer', 'tiefgang'], [[H, 'Grün über Weiß: Der Fischer schleppt sein Netz. Grün über Weiß, Trawler nachts im Kreis.'], [M, 'Rot über Weiß: Er fischt anders, mit Netzen oder Leinen, die weit vom Schiff abstehen können.'], [H, 'Drei rote Lichter: tiefgangbehindert. Der kommt nicht aus seiner Rinne raus. Tagsüber ein Zylinder.']])});

S('anker', {titel: 'Vor Anker und auf Grund', nr: 'A5.6', gruppe: 'A5 Lichter und Signalkörper', folge: 'S3.2', bg: '<rect width="400" height="300" fill="#f3ead2"/>',
  obj: {a: paar(F.anker), g50: `<rect x="0" y="40" width="400" height="225" fill="#142033"/><rect y="210" width="400" height="55" fill="#0b1726"/><g transform="translate(200 214) scale(.9)"><g opacity=".28">${B.seite(240, [[90, 70], [-90, 40]], '#8c99a6')}</g>${B.licht(90, -88, LF.w, 4.5)}${B.licht(-90, -58, LF.w, 4.5)}</g>${T(200, 80, '50 m und länger: vorn ein weißes Licht, achtern ein niedrigeres', 'middle', 12, 'w')}`, gr: paar(F.grund)},
  start: {g50: {o: 0}, gr: {o: 0}},
  phasen: [P(H, 'Unter fünfzig Metern vor Anker: ein weißes Rundumlicht, wo man es am besten sieht. Tagsüber ein Ball.', {cap: 'Vor Anker'}),
    P(M, 'Große Ankerlieger zeigen zwei weiße Lichter: vorn das höhere, achtern das niedrigere.', {cap: 'Großer Ankerlieger', an: ['g50'], aus: ['a'], dur: .4}),
    P(H, 'Dazu zwei rote übereinander: Das Schiff sitzt auf Grund. Am Tag drei Bälle.', {cap: 'Auf Grund', an: ['gr'], aus: ['g50'], dur: .4})]});

/* ======================= A6 Schall und Nebel ======================= */
const welle = (n = 3) => Array.from({length: n}, (_, i) => `<circle r="${12 + i * 16}" fill="none" stroke="#fff" stroke-width="2.5" opacity="${.8 - i * .22}"/>`).join('');
S('nebel', {titel: 'Nebel: wer tutet da?', nr: 'A6.2', gruppe: 'A6 Schallsignale und Nebel', folge: 'S4.1, S4.2',
  bg: B.wasser('#7fa9c0'), obj: {sektor: '<path d="M0 0 L-150 -120 A190 190 0 0 1 150 -120 Z" fill="#f2c200" opacity=".25"/><path d="M-170 0 H170" stroke="#f2c200" stroke-width="2" stroke-dasharray="6 4"/>', fremd: B.schiff(90, 20), ton: welle(), neb: B.nebel(.7), wir: B.boot({lichter: true}), aus: '<g transform="translate(0 -60)">' + T(0, 0, '👀 Ausguck', 'middle', 13) + '</g>',
    sig: '<g>' + T(0, 0, '▬', 'middle', 26, 'w') + '</g>', tx: T(0, 0, '', 'middle', 13)},
  start: {wir: {x: 200, y: 240}, sektor: {x: 200, y: 240, o: 0}, fremd: {x: 230, y: 70, r: 180, o: 0}, ton: {x: 230, y: 70, o: 0}, aus: {x: 200, y: 200, o: 0}, neb: {x: 0, y: 0}, sig: {x: 200, y: 290, o: 0}, tx: {x: 200, y: 50}},
  phasen: [P(H, 'Nebel. Erst Fahrt runter auf eine sichere Geschwindigkeit, Ausguck nach vorn, Lichter an, Rettungswesten an.', {cap: 'Fahrt runter, Ausguck, Westen', an: ['aus']}),
    P(M, 'Wir geben unser Nebelsignal: Als Maschinenfahrzeug mit Fahrt durchs Wasser alle zwei Minuten ein langer Ton.', {cap: 'Wir: alle 2 Minuten ein langer Ton', an: ['sig']}),
    P(H, 'Da tutet einer, und zwar vorlicher als querab, also irgendwo vor uns. Dann selbst Signal geben und so langsam fahren, dass wir gerade noch steuern können, notfalls aufstoppen.', {cap: 'Signal vorlicher als querab: langsam, notfalls stoppen', an: ['sektor', 'ton'], aus: ['sig']}),
    P(M, 'Ein langer Ton: Maschinenfahrzeug mit Fahrt. Zwei lange: Es hat gestoppt. Lang, kurz, kurz: einer, der schlecht ausweichen kann, oder ein Segler.', {cap: 'Wer tutet da?', sub: '▬ Fahrt · ▬ ▬ gestoppt · ▬ ● ● behindert, Segler, Fischer, Schlepper', aus: ['sektor']}),
    P(H, 'Wir bleiben vorsichtig, bis die Gefahr vorbei ist. Dann sehen wir ihn auch.', {cap: 'Vorsichtig, bis die Gefahr vorbei ist', an: ['fremd'], aus: ['ton'], k: {neb: {o: .35}, fremd: {x: 300, y: 150}}, dur: 3})],
  fx(s, tp, p) { const t = q(s, '[data-o="ton"]'); if (t) t.setAttribute('transform', t.getAttribute('transform').replace(/scale\([^)]*\)/, `scale(${(.6 + (tp % 1.6) / 1.6).toFixed(2)})`)); }});

S('glocke', {titel: 'Glocke und Gong im Nebel', nr: 'A6.3', gruppe: 'A6 Schallsignale und Nebel', folge: 'S4.3',
  bg: B.tag(200) + B.nebel(.55), obj: {schiff: B.seite(220, [[80, 60]], '#4a4f57'), glocke: `<path d="M-10 6 Q-10 -14 0 -14 Q10 -14 10 6 Z" fill="#c9a227" stroke="#7a6014"/><circle cy="9" r="3" fill="#7a6014"/>`, gong: '<circle r="10" fill="#b08d57" stroke="#6b5332" stroke-width="2"/>', w1: welle(2), w2: welle(2), uhr: T(0, 0, '', 'middle', 13), grund: `${B.ball(-40, -60)}${B.ball(-40, -44)}${B.ball(-40, -28)}`},
  start: {schiff: {x: 200, y: 200}, glocke: {x: 280, y: 130}, gong: {x: 110, y: 160, o: 0}, w1: {x: 280, y: 126, o: 0}, w2: {x: 110, y: 160, o: 0}, uhr: {x: 200, y: 60}, grund: {x: 200, y: 200, o: 0}},
  enter(s, p) { q(s, '[data-o="uhr"] text').textContent = ['jede Minute etwa 5 s Glocke vorn', 'über 100 m: dazu Gong achtern', 'zusätzlich erlaubt: ● ▬ ●', 'auf Grund: 3 Schläge, läuten, 3 Schläge'][p] || ''; },
  phasen: [P(H, 'Im Nebel hört man einen Ankerlieger an der Glocke: mindestens jede Minute etwa fünf Sekunden lang rasch geläutet, vorn.', {cap: 'Ankerlieger: Glocke', an: ['w1']}),
    P(M, 'Ist er hundert Meter oder länger, schlägt achtern zusätzlich ein Gong.', {cap: 'Großer Ankerlieger: dazu Gong', an: ['gong', 'w2']}),
    P(H, 'Um uns zu warnen, darf jeder Ankerlieger zusätzlich kurz, lang, kurz mit der Pfeife geben.', {cap: 'Warnung: kurz, lang, kurz'}),
    P(M, 'Sitzt einer auf Grund, schlägt er vor und nach dem Läuten noch je drei einzelne Schläge. Tagsüber drei Bälle.', {cap: 'Auf Grund: drei Schläge, läuten, drei Schläge', an: ['grund'], aus: ['gong', 'w2']})],
  fx(s, tp, p) { const sw = Math.sin(tp * 12) * (tp % 4 < 2 ? 18 : 0); const gl = q(s, '[data-o="glocke"] path'); if (gl) gl.setAttribute('transform', `rotate(${sw.toFixed(1)} 0 -14)`);
    if (tp % 2 < .05 && window.AUD && AUD.sfx && document.getElementById('anstage') && !window.__animStill) try { AUD.sfx('glocke', {vol: .25, dur: .8}); } catch (e) {} }});

/* ======================= A7 Zeichen, Tonnen, Feuer, Tafeln ======================= */
S('lateral', {titel: 'Fahrwasser von See kommend', nr: 'A7.1', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', folge: 'S5.2, S5.3',
  bg: B.wasser() + B.ufer('M0 0 H150 Q120 60 135 120 L0 140Z') + B.ufer('M400 0 H260 Q290 70 270 130 L400 150Z'),
  obj: Object.assign({wir: B.boot(), mitte: `<g transform="scale(.8)">${B.tonne('mitte')}</g>${T(30, -10, 'Ansteuerung', 'start', 11)}`, pf: B.pfeil(0, 0, 0, -60, '#fff', 4) + T(14, -20, 'von See', 'start', 11),
    lab: T(-75, 0, 'Backbord: rot, gerade Nummern', 'middle', 11, 'r') + T(75, 18, 'Steuerbord: grün, ungerade', 'middle', 11, 'gr')},
    Object.fromEntries([0, 1, 2].flatMap(i => [[`r${i}`, `<g transform="scale(.7)">${B.tonne('rot', {nr: [2, 4, 6][i]})}</g>`], [`g${i}`, `<g transform="scale(.7)">${B.tonne('gruen', {nr: [1, 3, 5][i]})}</g>`]]))),
  start: Object.assign({wir: {x: 200, y: 300}, mitte: {x: 190, y: 285, o: 0}, pf: {x: 340, y: 280, o: 0}, lab: {x: 200, y: 262, o: 0}}, Object.fromEntries([0, 1, 2].flatMap(i => [[`r${i}`, {x: 150, y: 245 - i * 75, o: 0}], [`g${i}`, {x: 255, y: 245 - i * 75, o: 0}]]))),
  phasen: [P(H, 'Von See kommend fährt man meist an einer rot-weiß gestreiften Tonne vorbei. Sie zeigt: Hier fängt das Fahrwasser an.', {cap: 'Ansteuerungstonne', an: ['mitte', 'pf'], k: {wir: {y: 280, x: 215}}}),
    P(M, 'Von See kommend liegen links die roten Tonnen, also an Backbord. Stumpf, mit geraden Nummern. Rechts die grünen, spitz, ungerade.', {cap: 'Rot links, grün rechts', an: ['r0', 'r1', 'r2', 'g0', 'g1', 'g2', 'lab'], aus: ['mitte']}),
    P(H, 'Steuerbordseite des Fahrwassers ist die Seite, die ein von See kommendes Schiff rechts hat. Wir halten uns rechts, an die grünen.', {cap: 'Steuerbordseite = rechts von See kommend', aus: ['lab'], k: {wir: {x: 232, y: 70}}, dur: 4}),
    P(M, 'Fährt man wieder raus auf See, ist es umgekehrt: Dann hat man die roten rechts.', {cap: 'Auslaufend umgekehrt', aus: ['pf'], k: {wir: {x: 175, y: 250, r: 180}}, dur: 3.5})]});

const MUST = {F: [[1, 0]], Fl: [[.4, 3.6]], LFl: [[2, 6]], Q: [[.55, .55]], Oc: [[3, 1]], Iso: [[2, 2]], 'Fl(2)': [[.4, .7], [.4, 3.5]]};
const an = (m, t) => { const ps = MUST[m], per = ps.reduce((s, [a, b]) => s + a + b, 0); let x = t % per; for (const [a, b] of ps) { if (x < a) return true; x -= a; if (x < b) return false; x -= b; } return false; };
const NAMEN = [['F', 'Festfeuer'], ['Fl', 'Blitz'], ['LFl', 'Blink'], ['Q', 'Funkel'], ['Oc', 'Unterbrochen'], ['Iso', 'Gleichtakt'], ['Fl(2)', 'Blitzgruppe']];
S('kennung', {titel: 'Feuer im Takt', nr: 'A7.2', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', folge: 'S5.1',
  bg: B.nacht(230) + NAMEN.map(([m, n], i) => `<g transform="translate(${36 + i * 55} 150)"><rect x="-5" y="0" width="10" height="70" fill="#556"/><circle class="lp" data-m="${m}" cy="-6" r="10" fill="#fff7d6"/>${T(0, 90 + (i % 2) * 26, n, 'middle', 10, 'w')}${T(0, 102 + (i % 2) * 26, m, 'middle', 10, 'w')}</g>`).join(''),
  obj: {rahmen: '<rect x="-27" y="-24" width="54" height="150" rx="10" class="hl"/>'}, start: {rahmen: {x: 36, y: 150}},
  phasen: [P(H, 'Ein Festfeuer brennt ohne Pause. Ein Blitz ist kurz, weniger als zwei Sekunden, und die Dunkelheit dazwischen ist länger.', {cap: 'Festfeuer und Blitz', k: {rahmen: {x: 63, s: 1}}}),
    P(M, 'Ein Blink dauert mindestens zwei Sekunden, ist aber immer noch kürzer als die Dunkelheit.', {cap: 'Blink: mindestens 2 s', k: {rahmen: {x: 146}}}),
    P(H, 'Funkeln ist schnell, fünfzig bis sechzig Mal in der Minute.', {cap: 'Funkel: 50 bis 60 pro Minute', k: {rahmen: {x: 201}}}),
    P(M, 'Beim unterbrochenen Feuer ist es umgekehrt: Das Licht ist länger an als aus.', {cap: 'Unterbrochen: Licht länger als Dunkel', k: {rahmen: {x: 256}}}),
    P(H, 'Gleichtakt: genauso lange an wie aus.', {cap: 'Gleichtakt: gleich lang', k: {rahmen: {x: 311}}}),
    P(M, 'Bei einer Gruppe zählst du die Blitze. Die Zeit, bis alles von vorn beginnt, heißt Wiederkehr. Daran erkennst du das Feuer auf der Karte.', {cap: 'Gruppe zählen, Wiederkehr stoppen', k: {rahmen: {x: 366}}})],
  fx(s, tp) { qa(s, '.lp').forEach(e => { const o = an(e.dataset.m, tp); e.setAttribute('opacity', o ? 1 : .08); e.setAttribute('r', o ? 10 : 8); }); }});

S('sonderzeichen', {titel: 'Einzelgefahr, Sonderzeichen, Mitte', nr: 'A7.4', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', folge: 'S5.5',
  bg: B.tag(210), obj: {e: `<g transform="scale(1.6)">${B.tonne('einzel')}</g>`, ge: `<g transform="scale(1.6)">${B.tonne('gelb')}</g>`, mi: `<g transform="scale(1.6)">${B.tonne('mitte')}</g>`,
    te: T(0, 0, 'Einzelgefahr: rundum befahrbar, Blitzgruppe 2', 'middle', 11), tg: T(0, 0, 'Sonderzeichen: gelb, Sperr- oder Sondergebiet', 'middle', 11), tm: T(0, 0, 'Mitte: rot-weiß, freies Wasser rundum', 'middle', 11)},
  start: {e: {x: 90, y: 215, o: 0}, ge: {x: 200, y: 215, o: 0}, mi: {x: 310, y: 215, o: 0}, te: {x: 200, y: 60, o: 0}, tg: {x: 200, y: 60, o: 0}, tm: {x: 200, y: 60, o: 0}},
  phasen: [P(H, 'Schwarz mit rotem Band und zwei schwarzen Bällen oben: eine einzelne Gefahr, zum Beispiel ein Stein. Rundum ist Wasser, aber nicht direkt drauf zu.', {cap: 'Einzelgefahrzeichen', an: ['e', 'te']}),
    P(M, 'Gelb mit liegendem gelbem Kreuz: ein Sonderzeichen. Es markiert besondere Gebiete, zum Beispiel ein Sperr- oder Badegebiet.', {cap: 'Sonderzeichen gelb', an: ['ge', 'tg'], aus: ['te']}),
    P(H, 'Rot-weiß senkrecht gestreift mit rotem Ball: Mitte des Fahrwassers oder Ansteuerung. Hier ist rundum freies Wasser.', {cap: 'Mitte und Ansteuerung', an: ['mi', 'tm'], aus: ['tg']})]});

S('sektorenfeuer', {titel: 'Leit-, Richt- und Quermarkenfeuer', nr: 'A7.5', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', folge: 'S5.5',
  bg: B.nacht(300).replace('height="190"', 'height="300"') + '<path d="M0 30 H400" stroke="#334" stroke-width="40"/>',
  obj: {leit: `<path d="M0 0 L-60 260 L-22 260Z" fill="#ff4a3d" opacity=".35"/><path d="M0 0 L-22 260 L22 260Z" fill="#fff7d6" opacity=".4"/><path d="M0 0 L22 260 L60 260Z" fill="#3ddc6a" opacity=".35"/>${B.licht(0, 0, LF.w, 6)}`, wir: B.boot({lichter: true}),
    unter: B.licht(0, 0, LF.w, 5), ober: B.licht(0, 0, LF.w, 5), linie: '<path d="M0 0 V250" stroke="#fff" stroke-width="1.5" stroke-dasharray="5 4" opacity=".7"/>',
    quer: `<path d="M0 0 L300 -30 L300 30Z" fill="#fff7d6" opacity=".35"/>${B.licht(0, 0, LF.w, 6)}`, tq: T(0, 0, 'Quermarke: hier Kurs ändern', 'middle', 11, 'w')},
  start: {leit: {x: 200, y: 30}, wir: {x: 190, y: 260}, unter: {x: 200, y: 60, o: 0}, ober: {x: 200, y: 40, o: 0}, linie: {x: 200, y: 50, o: 0}, quer: {x: 20, y: 150, o: 0}, tq: {x: 250, y: 120, o: 0}},
  phasen: [P(H, 'Ein Leitfeuer zeigt einen weißen Sektor genau übers Fahrwasser. Daneben farbige Sektoren. Siehst du weiß, bist du richtig.', {cap: 'Leitfeuer: im weißen Sektor bleiben', k: {wir: {y: 210}}}),
    P(M, 'Kommst du aus dem weißen Sektor raus, siehst du die Farbe und weißt, zu welcher Seite du abgekommen bist.', {cap: 'Farbe sehen = abgekommen', k: {wir: {x: 158, y: 180}}}),
    P(H, 'Ein Richtfeuer sind zwei Feuer: vorn das niedrige, dahinter das höhere. Stehen sie genau übereinander, sind sie in Deckung, und du bist auf der Linie.', {cap: 'Richtfeuer: Ober und Unter in Deckung', aus: ['leit'], an: ['unter', 'ober', 'linie'], k: {wir: {x: 200, y: 230}}}),
    P(M, 'Ein Quermarkenfeuer strahlt quer übers Fahrwasser. Fährst du in seinen Sektor, ist hier die Kursänderung.', {cap: 'Quermarkenfeuer: Kursänderung', aus: ['unter', 'ober', 'linie'], an: ['quer', 'tq'], k: {wir: {x: 200, y: 160}}})]});

const tafel = (rand, voll, sym, schraeg) => `<rect x="-34" y="-34" width="68" height="68" rx="4" fill="${voll}" stroke="${rand}" stroke-width="7"/>${sym}${schraeg ? '<path d="M-30 30 L30 -30" stroke="#c9302c" stroke-width="7"/>' : ''}`;
const zwei = '<path d="M-18 14 l6 -24 l6 24z M6 14 l6 -24 l6 24z" fill="#222"/>';
S('tafeln', {titel: 'Tafelzeichen nach Familien', nr: 'A7.6', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', folge: 'G6.1, G6.2',
  bg: '<rect width="400" height="300" fill="#dfe9d6"/>', obj: {v: tafel('#c9302c', '#fff', zwei, true), gb: tafel('#c9302c', '#fff', '<path d="M-14 -8 h10 l12 -10 v36 l-12 -10 h-10z" fill="#222"/><path d="M14 -10 q8 10 0 20" stroke="#222" stroke-width="3" fill="none"/>', false),
    hi: tafel('#1f5f99', '#1f5f99', '<text x="0" y="16" font-size="44" text-anchor="middle" fill="#fff" font-weight="900">P</text>', false),
    tv: T(0, 0, 'Verbot: mit Balken', 'middle', 11), tgb: T(0, 0, 'Gebot: ohne Balken', 'middle', 11), thi: T(0, 0, 'Hinweis: blau', 'middle', 11)},
  start: {v: {x: 80, y: 140, o: 0}, gb: {x: 200, y: 140, o: 0}, hi: {x: 320, y: 140, o: 0}, tv: {x: 80, y: 205, o: 0}, tgb: {x: 200, y: 205, o: 0}, thi: {x: 320, y: 205, o: 0}},
  phasen: [P(H, 'Tafelzeichen gibt es in Familien. Rot umrandet mit rotem Schrägbalken heißt: verboten. Hier zum Beispiel: Überholen verboten.', {cap: 'Verbotszeichen', an: ['v', 'tv']}),
    P(M, 'Rot umrandet ohne Balken ist ein Gebot: Das musst du tun, hier etwa ein Schallsignal geben.', {cap: 'Gebotszeichen', an: ['gb', 'tgb']}),
    P(H, 'Blaue Tafeln sind Hinweise: Hier darfst du etwas, zum Beispiel liegen bleiben.', {cap: 'Hinweiszeichen', an: ['hi', 'thi']}),
    P(K, 'Rot verboten! Verboten! Blau erlaubt!', {cap: 'Erst die Farbe, dann das Bild'})]});

S('bruecke', {titel: 'Brücken und Durchfahrtshöhe', nr: 'A7.7', gruppe: 'A7 Zeichen, Tonnen, Feuer, Tafeln', folge: 'G6.3',
  bg: '<rect width="400" height="300" fill="#bfe0f2"/><rect x="0" y="60" width="400" height="26" fill="#8a8f95"/><rect x="60" y="86" width="22" height="214" fill="#8a8f95"/><rect x="318" y="86" width="22" height="214" fill="#8a8f95"/>',
  obj: {wasser: '<rect x="-400" y="0" width="800" height="300" fill="#4d93bd"/>', boot: B.seite(90, [[0, 70]], '#fbf8f2', false) + '<rect x="-14" y="-30" width="30" height="14" fill="#cfd6db"/>', mass: '<path d="M0 0 V-1" stroke="#fff" stroke-width="2"/>' + T(8, 0, '', 'start', 12),
    rot: B.licht(0, 0, LF.r, 6) + B.licht(0, 16, LF.r, 6), gruen: B.licht(0, 0, LF.g, 6)},
  start: {wasser: {x: 200, y: 230}, boot: {x: 200, y: 230}, rot: {x: 200, y: 74, o: 0}, gruen: {x: 200, y: 74, o: 0}},
  fx(s, tp, p, st, c) { const w = c.wasser.y, m = q(s, '[data-o="mass"]'); if (!m) return; m.setAttribute('transform', `translate(360 ${w})`); m.querySelector('path').setAttribute('d', `M0 0 V${86 - w}`); m.querySelector('text').setAttribute('y', (86 - w) / 2); m.querySelector('text').textContent = `${((w - 86) / 30).toFixed(1).replace('.', ',')} m frei`; },
  phasen: [P(H, 'Unter der Brücke ist nur so viel Platz, wie das Wasser zulässt. Unser Mast ist gut zwei Meter hoch über Wasser.', {cap: 'Wie viel Platz ist frei?'}),
    P(M, 'Steigt das Wasser mit der Flut, wird es enger. Darum vor der Durchfahrt die Höhe prüfen, nicht nach Gefühl.', {cap: 'Flut: weniger Platz', k: {wasser: {y: 170}, boot: {y: 170}}, dur: 3}),
    P(H, 'Signale an der Brücke sagen, ob du durchfahren darfst. Rot heißt: warten.', {cap: 'Rot: Durchfahrt gesperrt', an: ['rot']}),
    P(M, 'Grün: frei. Dann zügig, aber ruhig durch, und auf Gegenverkehr achten.', {cap: 'Grün: frei', aus: ['rot'], an: ['gruen'], k: {boot: {x: 460}}, dur: 4})]});

/* ======================= A8 Navigation ======================= */
const rose = (r = 90) => `<circle r="${r}" fill="#fffaf0" stroke="#7a6a56" stroke-width="2"/>${Array.from({length: 36}, (_, i) => { const a = i * 10 * Math.PI / 180, l = i % 9 ? 6 : 14; return `<path d="M${(Math.sin(a) * r).toFixed(1)} ${(-Math.cos(a) * r).toFixed(1)} L${(Math.sin(a) * (r - l)).toFixed(1)} ${(-Math.cos(a) * (r - l)).toFixed(1)}" stroke="#7a6a56" stroke-width="1.5"/>`; }).join('')}${T(0, -r + 26, 'N', 'middle', 13)}${T(r - 22, 5, 'O', 'middle', 13)}${T(0, r - 16, 'S', 'middle', 13)}${T(-r + 22, 5, 'W', 'middle', 13)}`;
const nadel = (c, l = 80, w = 4) => B.pfeil(0, 0, 0, -l, c, w);
S('missweisung', {titel: 'Missweisung und Ablenkung', nr: 'A8.3', gruppe: 'A8 Navigation', folge: 'S7.2',
  bg: '<rect width="400" height="300" fill="#f3ead2"/>', obj: {rose: rose(100), rn: nadel('#1f5f99', 96), mn: nadel('#c0392b', 96), kn: nadel('#1f9a3c', 96), kurs: B.pfeil(0, 0, 100, 0, '#222', 5), tx: T(0, 0, '', 'start', 12),
    leg: T(0, 0, 'Blau: geografisch Nord · Rot: magnetisch Nord · Grün: Kompass-Nord', 'middle', 11)},
  start: {rose: {x: 150, y: 160}, rn: {x: 150, y: 160}, mn: {x: 150, y: 160, o: 0}, kn: {x: 150, y: 160, o: 0}, kurs: {x: 150, y: 160}, tx: {x: 268, y: 90}, leg: {x: 200, y: 288}},
  enter(s, p) { q(s, '[data-o="tx"] text').innerHTML = [['rwK 090°', 'Kurs auf der Karte,', 'zum Kartennord'], ['Mw 3° Ost', 'die Nadel zeigt', 'zum Magnetpol'], ['mwK = rwK − Mw', '= 090° − 3°', '= 087°'], ['Abl 2° West', 'Eisen an Bord', 'lenkt ab'], ['MgK = mwK − Abl', '= 087° − (−2°)', '= 089°']][p].map((t, i) => `<tspan x="0" dy="${i ? 18 : 0}">${t}</tspan>`).join(''); },
  phasen: [P(H, 'Auf der Karte messen wir den rechtweisenden Kurs, bezogen auf geografisch Nord. Sagen wir neunzig Grad.', {cap: 'Rechtweisender Kurs (rwK)'}),
    P(M, 'Die Kompassnadel zeigt aber zum magnetischen Nordpol. Der Unterschied heißt Missweisung. Hier drei Grad Ost.', {cap: 'Missweisung (Mw)', an: ['mn'], k: {mn: {r: 3}}}),
    P(H, 'Missweisend ist der Kurs dann neunzig minus drei, also siebenundachtzig Grad. Ost wird abgezogen.', {cap: 'Missweisender Kurs (mwK)'}),
    P(M, 'An Bord lenken Eisen und Elektrik den Kompass zusätzlich ab. Das ist die Ablenkung, sie steht in der Ablenkungstabelle. Hier zwei Grad West.', {cap: 'Ablenkung (Abl)', an: ['kn'], k: {kn: {r: 1}}}),
    P(H, 'Magnetkompasskurs: siebenundachtzig minus minus zwei, also neunundachtzig Grad. West wird dazugezählt. Den steuern wir.', {cap: 'Magnetkompasskurs (MgK)'})]});

const turm = (c = '#8a5a3a') => `<path d="M-6 0 L-4 -22 L4 -22 L6 0Z" fill="${c}" stroke="#333"/><path d="M-5 -22 L0 -30 L5 -22Z" fill="#c0392b"/>`;
S('peilung', {titel: 'Peilung und Standlinie', nr: 'A8.4', gruppe: 'A8 Navigation', folge: 'S2.1, S7.1',
  bg: B.karte() + B.ufer('M0 0 H400 V70 Q300 100 200 80 T0 90Z'), obj: {lt: turm('#fff') + T(0, -36, 'Leuchtturm', 'middle', 11), kt: turm() + T(0, -36, 'Kirche', 'middle', 11),
    l1: '<path d="M0 0 L-180 260" stroke="#c0392b" stroke-width="2.5"/>' + T(-60, 60, '210°', 'middle', 12, 'r'), l2: '<path d="M0 0 L180 230" stroke="#1f5f99" stroke-width="2.5"/>' + T(60, 60, '142°', 'middle', 12, 'b'),
    wir: B.boot(), x: '<circle r="9" fill="none" stroke="#f08a1c" stroke-width="3"/>' + T(16, 24, 'Standort', 'start', 12), schlecht: T(0, 0, 'Schnittwinkel möglichst zwischen 30° und 150°', 'middle', 11)},
  start: {lt: {x: 330, y: 70}, kt: {x: 90, y: 82}, l1: {x: 330, y: 70, o: 0}, l2: {x: 90, y: 82, o: 0}, wir: {x: 210, y: 245, s: .7}, x: {x: 210, y: 245, o: 0}, schlecht: {x: 200, y: 290, o: 0}},
  phasen: [P(H, 'Wir wissen nicht genau, wo wir sind. Also peilen wir: Mit dem Peilkompass schauen wir, in welcher Richtung der Leuchtturm liegt.', {cap: 'Peilen'}),
    P(M, 'Die Peilung tragen wir vom Leuchtturm aus in die Karte ein. Irgendwo auf dieser Linie sind wir. Das ist eine Standlinie.', {cap: 'Erste Standlinie', an: ['l1']}),
    P(H, 'Gleich danach peilen wir die Kirche. Zweite Linie.', {cap: 'Zweite Standlinie', an: ['l2']}),
    P(M, 'Wo sich die Linien schneiden, sind wir. Sie sollten sich nicht zu spitz schneiden, sonst wird es ungenau.', {cap: 'Schnittpunkt = Standort', an: ['x', 'schlecht']})]});

S('koppel', {titel: 'Koppelort und Stromversetzung', nr: 'A8.5', gruppe: 'A8 Navigation', folge: 'S7.3',
  bg: B.karte(), obj: {start: '<circle r="6" fill="#222"/>' + T(-12, 18, 'Abfahrt 10:00', 'end', 11), kv: B.pfeil(0, 0, 150, -120, '#222', 3) + T(60, -70, 'Kurs 051°, 6 kn, 1 h', 'middle', 11),
    ko: '<path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#222" stroke-width="3"/>' + T(12, -8, 'Koppelort', 'start', 11), strom: B.pfeil(0, 0, 30, 50, '#1f5f99', 4) + T(36, 22, 'Strom 2 kn', 'start', 11, 'b'),
    bo: '<circle r="8" fill="none" stroke="#f08a1c" stroke-width="3"/>' + T(12, 14, 'Besteckort', 'start', 11), boot: B.boot()},
  start: {start: {x: 100, y: 240}, kv: {x: 100, y: 240, o: 0}, ko: {x: 250, y: 120, o: 0}, strom: {x: 250, y: 120, o: 0}, bo: {x: 280, y: 170, o: 0}, boot: {x: 100, y: 240, r: 51, s: .6}},
  phasen: [P(H, 'Ohne Peilung rechnen wir: Abfahrt um zehn, Kurs einundfünfzig Grad, sechs Knoten. Nach einer Stunde sind wir sechs Seemeilen weiter.', {cap: 'Kurs, Fahrt, Zeit', an: ['kv'], k: {boot: {x: 250, y: 120}}, dur: 3}),
    P(M, 'Diesen gerechneten Ort nennt man Koppelort. Er stimmt nur, wenn nichts uns versetzt.', {cap: 'Koppelort', an: ['ko']}),
    P(H, 'Aber der Strom schiebt uns in der Stunde zwei Seemeilen nach Südost. Den tragen wir am Koppelort an.', {cap: 'Stromversetzung antragen', an: ['strom']}),
    P(M, 'Am Ende des Strompfeils liegt der Ort, an dem wir wirklich ungefähr sind: der Besteckort. Will man ankommen, hält man vorher gegen den Strom vor.', {cap: 'Besteckort, Vorhaltewinkel', an: ['bo'], k: {boot: {x: 280, y: 170}}})]});

S('tidenstrom', {titel: 'Ebbstrom, Flutstrom, Kentern', nr: 'A8.7', gruppe: 'A8 Navigation', folge: 'S7.4',
  bg: B.wasser() + B.ufer('M0 0 H170 Q150 120 175 300 H0Z') + B.ufer('M400 0 H230 Q250 120 225 300 H400Z') + T(200, 290, 'zur See', 'middle', 11) + T(200, 18, 'landeinwärts', 'middle', 11),
  obj: {flut: [0, 1, 2].map(i => B.pfeil(0, 250 - i * 80, 0, 190 - i * 80, '#fff', 5, 'fl')).join(''), ebb: [0, 1, 2].map(i => B.pfeil(0, 50 + i * 80, 0, 110 + i * 80, '#ffe28a', 5, 'fl')).join(''), still: T(0, 150, 'Stillwasser: der Strom kentert', 'middle', 13),
    wind: [0, 1].map(i => B.pfeil(-60 + i * 120, 70, -60 + i * 120, 20, '#c0392b', 4)).join('') + T(0, 92, 'Wind von See', 'middle', 12, 'r'), see: Array.from({length: 6}, (_, i) => `<path d="M${-28 + (i % 2) * 14} ${130 + i * 22} l10 -16 l10 16" fill="#fff" stroke="#356" stroke-width="1.5"/>`).join('')},
  start: {flut: {x: 200, y: 0, o: 0}, ebb: {x: 200, y: 0, o: 0}, still: {x: 200, y: 0, o: 0}, wind: {x: 200, y: 0, o: 0}, see: {x: 200, y: 0, o: 0}},
  phasen: [P(H, 'Wenn das Wasser steigt, läuft es landeinwärts. Das ist der Flutstrom.', {cap: 'Flutstrom: landeinwärts', an: ['flut']}),
    P(M, 'Bei Hochwasser steht der Strom kurz still, dann kentert er und dreht.', {cap: 'Stillwasser, der Strom kentert', an: ['still'], aus: ['flut']}),
    P(H, 'Wenn das Wasser fällt, läuft es zur See hinaus: Ebbstrom.', {cap: 'Ebbstrom: seewärts', an: ['ebb'], aus: ['still']}),
    P(M, 'Gefährlich wird es, wenn der Ebbstrom gegen den Wind läuft. Dann werden die Wellen steil und brechen.', {cap: 'Strom gegen Wind: steile, brechende Seen', an: ['wind', 'see']})]});

S('seemeile', {titel: 'Seemeile und Knoten', nr: 'A8.8', gruppe: 'A8 Navigation', folge: 'S7.2',
  bg: '<rect width="400" height="300" fill="#f3ead2"/><circle cx="120" cy="320" r="230" fill="#9ccbe8" stroke="#356" stroke-width="2"/>',
  obj: {keil: '<path d="M0 0 L60 -222 A230 230 0 0 1 120 -197Z" fill="#f2c200" opacity=".55" stroke="#7a6014"/>' + T(70, -140, "1'", 'middle', 13), tx: T(0, 0, '1 Bogenminute Breite = 1 Seemeile = 1852 m', 'middle', 13),
    rand: '<rect x="-10" y="-130" width="20" height="260" fill="#fff" stroke="#333"/>' + Array.from({length: 13}, (_, i) => `<path d="M-10 ${-130 + i * 20} h${i % 2 ? 6 : 12}" stroke="#333"/>`).join('') + T(0, 150, 'Breitenrand', 'middle', 11),
    kn: T(0, 0, '1 Knoten = 1 Seemeile pro Stunde', 'middle', 13), boot: B.boot()},
  start: {keil: {x: 120, y: 320}, tx: {x: 200, y: 60, o: 0}, rand: {x: 360, y: 150, o: 0}, kn: {x: 200, y: 280, o: 0}, boot: {x: 230, y: 230, r: 90, s: .7, o: 0}},
  phasen: [P(H, 'Die Erde ist ein Kreis mit dreihundertsechzig Grad, jedes Grad hat sechzig Minuten.', {cap: 'Grad und Minuten'}),
    P(M, 'Eine Minute auf dem Längengrad, also eine Minute Breite, ist genau eine Seemeile: tausendachthundertzweiundfünfzig Meter.', {cap: '1 Seemeile = 1852 m', an: ['tx']}),
    P(H, 'Darum misst man Distanzen auf der Seekarte immer am Breitenrand, nie am Längenrand.', {cap: 'Messen am Breitenrand', an: ['rand']}),
    P(M, 'Ein Knoten ist eine Seemeile pro Stunde. Sechs Knoten heißt: in einer Stunde sechs Seemeilen.', {cap: 'Knoten = sm pro Stunde', an: ['kn', 'boot'], k: {boot: {x: 330}}, dur: 4})]});

/* ======================= A9 Wetter, Natur, Sicherheit ======================= */
const isob = (cx, cy, rs) => rs.map(r => `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.2}" ry="${r}" fill="none" stroke="#556" stroke-width="1.8"/>`).join('');
S('wetterkarte', {titel: 'Wetterkarte', nr: 'A9.2', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'S9.1',
  bg: '<rect width="400" height="300" fill="#eef3f6"/>' + isob(120, 150, [24, 50, 76, 102]) + isob(320, 150, [40, 80]) + T(120, 157, 'T', 'middle', 22, 'r') + T(320, 157, 'H', 'middle', 22, 'b'),
  obj: {wt: [[120, 50, 90], [222, 150, 180], [120, 250, 270], [18, 150, 0]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a + 18})">${B.pfeil(14, 0, -14, 0, '#c0392b', 3)}</g>`).join(''),
    wh: [[320, 70, 270], [416, 150, 0], [320, 230, 90], [224, 150, 180]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a + 18})">${B.pfeil(14, 0, -14, 0, '#1f5f99', 3)}</g>`).join(''),
    eng: '<rect x="30" y="80" width="60" height="140" rx="10" class="hl"/>' + T(60, 236, 'eng = viel Wind', 'middle', 11),
    kf: '<path d="M140 120 Q190 190 170 290" stroke="#1f5f99" stroke-width="3" fill="none"/>' + [0, 1, 2, 3].map(i => `<path d="M${150 + i * 7} ${150 + i * 34} l12 -2 l-6 10z" fill="#1f5f99"/>`).join(''),
    wf: '<path d="M140 120 Q210 110 260 40" stroke="#c0392b" stroke-width="3" fill="none"/>' + [0, 1, 2].map(i => `<circle cx="${170 + i * 30}" cy="${112 - i * 22}" r="6" fill="#c0392b"/>`).join(''),
    baro: T(0, 0, 'Luftdruck fällt rasch → Starkwind oder Sturm', 'middle', 12, 'r')},
  start: {wt: {o: 0}, wh: {o: 0}, eng: {o: 0}, kf: {o: 0}, wf: {o: 0}, baro: {x: 200, y: 290, o: 0}},
  phasen: [P(H, 'Die Linien auf der Wetterkarte heißen Isobaren. Sie verbinden Orte mit gleichem Luftdruck.', {cap: 'Isobaren: gleicher Luftdruck'}),
    P(M, 'Um ein Tief dreht sich der Wind bei uns gegen den Uhrzeigersinn und leicht nach innen. Um ein Hoch mit dem Uhrzeigersinn nach außen.', {cap: 'Tief gegen, Hoch mit dem Uhrzeiger', an: ['wt', 'wh']}),
    P(H, 'Liegen die Isobaren eng beieinander, weht viel Wind.', {cap: 'Eng = viel Wind', an: ['eng']}),
    P(M, 'An den Fronten ändert sich das Wetter: Warmfront mit Halbkreisen, Kaltfront mit Dreiecken, oft mit Böen.', {cap: 'Warmfront und Kaltfront', an: ['kf', 'wf'], aus: ['eng']}),
    P(H, 'Und fällt das Barometer rasch, rechne mit Starkwind oder Sturm.', {cap: 'Barometer fällt rasch', an: ['baro']})]});

const BFT = ['Stille', 'leiser Zug', 'leichte Brise', 'schwache Brise', 'mäßige Brise', 'frischer Wind', 'starker Wind', 'steifer Wind', 'stürmischer Wind', 'Sturm', 'schwerer Sturm', 'orkanartiger Sturm', 'Orkan'];
S('beaufort', {titel: 'Beaufort-Skala', nr: 'A9.3', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'S9.2',
  bg: '<rect width="400" height="300" fill="#eef3f6"/>' + BFT.map((n, i) => `<g transform="translate(${26 + i * 29} 250)"><rect class="bf" data-i="${i}" x="-11" y="${-12 - i * 15}" width="22" height="${12 + i * 15}" rx="3" fill="#9aa9b4"/>${T(0, 16, i, 'middle', 12)}</g>`).join(''),
  obj: {tx: T(0, 0, '', 'middle', 13), r6: '<rect x="-30" y="-140" width="60" height="150" rx="8" class="hl"/>', r8: '<rect x="-60" y="-210" width="120" height="220" rx="8" class="hl"/>'},
  start: {tx: {x: 200, y: 60}, r6: {x: 215, y: 250, o: 0}, r8: {x: 318, y: 250, o: 0}},
  enter(s, p) { const farben = [i => i === 5 ? '#6ab04c' : '#9aa9b4', i => i >= 6 && i <= 7 ? '#f2c200' : i === 5 ? '#6ab04c' : '#9aa9b4', i => i >= 8 ? (i >= 10 ? '#c0392b' : '#e67e22') : i >= 6 ? '#f2c200' : i === 5 ? '#6ab04c' : '#9aa9b4', i => i >= 10 ? '#c0392b' : i >= 8 ? '#e67e22' : i >= 6 ? '#f2c200' : '#9aa9b4'][p];
    qa(s, '.bf').forEach(e => e.setAttribute('fill', farben(+e.dataset.i))); q(s, '[data-o="tx"] text').textContent = ['5 = frischer Wind', '6 und 7: Starkwindwarnung', 'ab 8: Sturmwarnung', '10, 11, 12: schwerer Sturm, orkanartiger Sturm, Orkan'][p]; },
  phasen: [P(H, 'Die Beaufort-Skala sagt, wie stark der Wind ist, von null bis zwölf. Fünf heißt im Wetterbericht frischer Wind.', {cap: 'Windstärke nach Beaufort'}),
    P(M, 'Bei sechs und sieben gibt es eine Starkwindwarnung. Für uns heißt das: im Hafen bleiben.', {cap: 'Starkwindwarnung', an: ['r6']}),
    P(H, 'Ab acht ist es eine Sturmwarnung.', {cap: 'Sturmwarnung', an: ['r8'], aus: ['r6']}),
    P(M, 'Zehn, elf und zwölf heißen schwerer Sturm, orkanartiger Sturm und Orkan.', {cap: 'Schwerer Sturm bis Orkan', aus: ['r8']})]});

S('schwerwetter', {titel: 'Schweres Wetter und Schleppen', nr: 'A9.4', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'S9.3',
  bg: '<rect width="400" height="300" fill="#8fa6b4"/>', obj: {see: '<path d="M-400 0 Q-350 -40 -300 0 T-200 0 T-100 0 T0 0 T100 0 T200 0 T300 0 T400 0 T500 0 V200 H-400Z" fill="#3d6f8f"/>', boot: B.seite(70, [], '#fbf8f2') + '<rect x="-10" y="-30" width="22" height="14" fill="#cfd6db"/>',
    hilf: B.seite(70, [], '#e9d9b8'), leine: '<path id="sl" stroke="#e8c46a" stroke-width="2.5" fill="none"/>', ta: '<path d="M0 0 l-14 -8 l0 16z" fill="#c98a12"/>' + T(0, -14, 'Treibanker', 'middle', 11), w: T(0, 0, 'Westen an, Sicherheitsgurte einpicken, Luken dicht', 'middle', 12)},
  start: {see: {x: 0, y: 190}, boot: {x: 230, y: 180}, hilf: {x: 80, y: 180, o: 0}, ta: {x: 330, y: 185, o: 0}, w: {x: 200, y: 50}},
  enter(s, p) { q(s, '[data-o="w"] text').textContent = ['Westen an, Sicherheitsgurte einpicken, Luken dicht', 'Fahrt vermindern', 'Schleppleine: mindestens 2- bis 3-fache Wellenlänge', 'steuerunfähig: Treibanker hält den Bug zur See'][p]; },
  fx(s, tp, p, st, c) { const ph = tp * 2.2, y = Math.sin(ph) * 10; q(s, '[data-o="see"]').setAttribute('transform', `translate(${(-(tp * 40) % 200).toFixed(1)} 190)`); const b = q(s, '[data-o="boot"]'); b.setAttribute('transform', `translate(${c.boot.x.toFixed(1)} ${(180 + y).toFixed(1)}) rotate(${(Math.cos(ph) * (p === 0 ? 14 : 7)).toFixed(1)})`);
    const h = q(s, '[data-o="hilf"]'); h.setAttribute('transform', `translate(${c.hilf.x.toFixed(1)} ${(180 + Math.sin(ph - 1.6) * 10).toFixed(1)}) rotate(${(Math.cos(ph - 1.6) * 7).toFixed(1)})`);
    const l = q(s, '#sl'); if (l) l.setAttribute('d', c.hilf.o > .1 ? `M${c.boot.x - 34} ${180 + y - 8} Q${(c.boot.x + c.hilf.x) / 2} ${205} ${c.hilf.x + 34} ${180 + Math.sin(ph - 1.6) * 10 - 8}` : ''); },
  phasen: [P(H, 'Bevor schweres Wetter kommt: Westen an, Sicherheitsgurte einpicken, alles festzurren, Luken dicht.', {cap: 'Vorbereiten'}),
    P(M, 'Im Seegang Fahrt vermindern. Sonst schlägt das Boot hart in die Wellen, und Rumpf und Leute leiden.', {cap: 'Fahrt vermindern'}),
    P(H, 'Müssen wir jemanden schleppen: lange Leine, mindestens zwei- bis dreimal so lang wie eine Welle, und nicht schneller, als der Anhang selbst fahren könnte.', {cap: 'Schleppen: lange Leine, langsam', an: ['hilf'], k: {boot: {x: 300}}}),
    P(M, 'Ist ein Boot steuerunfähig, hält ein Treibanker oder etwas anderes Schwimmfähiges den Bug in Wind und See.', {cap: 'Treibanker', aus: ['hilf'], an: ['ta']})]});

const ICON = (i, t) => `<g>${T(0, 0, i, 'middle', 30)}${T(0, 26, t, 'middle', 11)}</g>`;
const NOT = [['🎆', 'rote Rakete'], ['🔥', 'Handfackel'], ['🟠', 'oranger Rauch'], ['📯', 'Dauerton'], ['💥', 'Knall'], ['··· ━━━ ···', 'SOS'], ['📻', 'Mayday'], ['🏳️⚫', 'Flagge + Ball'], ['N C', 'Flaggen NC'], ['🙆', 'Arme heben']];
S('notsignale', {titel: 'Notsignale', nr: 'A9.5', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'S9.5',
  bg: '<rect width="400" height="300" fill="#f3ead2"/>', obj: Object.fromEntries(NOT.map(([i, t], n) => [`n${n}`, ICON(i, t)])),
  start: Object.fromEntries(NOT.map((_, n) => [`n${n}`, {x: 50 + (n % 4) * 100, y: 80 + Math.floor(n / 4) * 85, o: 0}])),
  phasen: [P(H, 'Notsignale gibt man nur, wenn Leib oder Leben in Gefahr ist und Hilfe gebraucht wird. Nicht weil der Sprit alle ist.', {cap: 'Nur bei Gefahr für Leib und Leben'}),
    P(M, 'Mit Licht und Feuer: rote Rakete oder Fallschirmrakete, rote Handfackel, orangefarbener Rauch.', {cap: 'Rakete, Fackel, Rauch', an: ['n0', 'n1', 'n2']}),
    P(H, 'Mit Schall: ein Nebelsignal im Dauerton oder Knallsignale etwa jede Minute. SOS geht mit Licht oder Ton.', {cap: 'Dauerton, Knall, SOS', an: ['n3', 'n4', 'n5']}),
    P(M, 'Dazu „Mayday“ im Funk, eine quadratische Flagge mit einem Ball darüber oder darunter, das Flaggensignal N C, und langsam die ausgestreckten Arme heben und senken.', {cap: 'Funk, Flaggen, Arme', an: ['n6', 'n7', 'n8', 'n9']})]});

S('sicherheit', {titel: 'Rettungsweste und Sicherheit an Bord', nr: 'A9.6', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'G4.2',
  bg: '<rect width="400" height="300" fill="#f3ead2"/>', obj: {weste: ICON('🦺', 'Weste zu, mit Schrittgurt'), gurt: ICON('🪢', 'Gurt einpicken'), lo: ICON('🧯', 'ABC-Pulver oder Schaum'), wart: ICON('🔧', 'prüfen: alle 2 Jahre'), insel: ICON('🛟', 'Rettungsmittel warten')},
  start: {weste: {x: 110, y: 90, o: 0}, gurt: {x: 290, y: 90, o: 0}, lo: {x: 110, y: 190, o: 0}, wart: {x: 290, y: 190, o: 0}, insel: {x: 200, y: 250, o: 0}},
  phasen: [P(H, 'Die Weste nützt nur, wenn sie an ist und sitzt. Gurt zu, Schrittgurt nicht vergessen, sonst rutscht man durch.', {cap: 'Weste richtig tragen', an: ['weste']}),
    P(M, 'Bei Seegang den Sicherheitsgurt anlegen und an den dafür vorgesehenen Stellen einpicken.', {cap: 'Einpicken', an: ['gurt']}),
    P(H, 'An Bord gehört ein ABC-Pulver- oder Schaumlöscher, und der wird mindestens alle zwei Jahre geprüft.', {cap: 'Feuerlöscher', an: ['lo', 'wart']}),
    P(M, 'Aufblasbare Westen und Rettungsinseln lässt man nach Herstellerangabe warten, mindestens alle zwei Jahre.', {cap: 'Rettungsmittel warten lassen', an: ['insel']})]});

const flamme = `<path d="M0 0 C-22 -10 -14 -40 0 -60 C4 -40 22 -30 14 -8 C22 -20 18 -34 16 -40 C30 -20 22 0 0 0Z" fill="#f39c12"/><path d="M0 0 C-10 -8 -6 -24 0 -34 C6 -22 12 -10 0 0Z" fill="#ffe28a"/>`;
S('feuer', {titel: 'Feuer an Bord', nr: 'A9.7', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'G4.2',
  bg: '<rect width="400" height="300" fill="#e9dcc0"/><rect y="230" width="400" height="70" fill="#a0784c"/>', obj: {f: flamme, deckel: '<rect x="-40" y="-8" width="80" height="12" rx="4" fill="#666"/>', loe: '<rect x="-12" y="-40" width="24" height="56" rx="8" fill="#c0392b"/><path d="M0 -40 v-10 h18" stroke="#222" stroke-width="4" fill="none"/>', strahl: '<path d="M0 0 Q40 10 80 -6" stroke="#fff" stroke-width="10" opacity=".7" fill="none" stroke-linecap="round"/>', tx: T(0, 0, '', 'middle', 13)},
  start: {f: {x: 250, y: 230, s: 1.3}, deckel: {x: 250, y: 140, o: 0}, loe: {x: 80, y: 200}, strahl: {x: 120, y: 225, o: 0}, tx: {x: 200, y: 60}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['Luft weg: Luken zu, Deckel drauf', 'Löscher erst am Brandherd auslösen', 'von unten löschen, in die Glut', 'bei Gas und Sprit: Zufuhr abdrehen'][p]; },
  phasen: [P(H, 'Feuer braucht Luft. Erst die Luftzufuhr verhindern: Luken zu, einen Deckel oder eine Decke drauf.', {cap: 'Luftzufuhr verhindern', an: ['deckel'], k: {deckel: {y: 200}, f: {s: .9}}}),
    P(M, 'Den Feuerlöscher erst am Brandherd auslösen, nicht schon aus der Ferne.', {cap: 'Erst am Brandherd', aus: ['deckel'], k: {loe: {x: 160}, f: {s: 1.1}}}),
    P(H, 'Dann von unten in die Glut, nicht oben in die Flammen.', {cap: 'Von unten bekämpfen', an: ['strahl'], k: {strahl: {x: 175}, f: {s: .4}}, dur: 3}),
    P(M, 'Brennt Gas oder Sprit, sofort die Zufuhr abdrehen. Sonst brennt es immer wieder an.', {cap: 'Zufuhr abdrehen', aus: ['strahl'], k: {f: {s: 0, o: 0}}})]});

S('umwelt', {titel: 'Umwelt an Bord', nr: 'A9.8', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'G7.1, S8.2',
  bg: B.wasser() + B.ufer('M0 0 H400 V50 Q200 80 0 50Z') + Array.from({length: 22}, (_, i) => `<path d="M${10 + i * 18} 58 l3 -26 l3 26" stroke="#6a8a3a" stroke-width="2" fill="#8fb35a"/>`).join(''),
  obj: {boot: B.boot(), muell: '<g>' + T(0, 0, '🥫', 'middle', 18) + B.kreuz(0, -6) + '</g>', oel: '<ellipse rx="30" ry="12" fill="#3a2f2a" opacity=".6"/>' + B.kreuz(0, 0), station: B.kasten(-60, -18, 120, 36, 'Entsorgung im Hafen', '#d7e7d0'), abstand: '<path d="M0 0 V-60" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>' + T(10, -30, 'Abstand zum Schilf', 'start', 11)},
  start: {boot: {x: 200, y: 200}, muell: {x: 250, y: 220, o: 0}, oel: {x: 140, y: 240, o: 0}, station: {x: 290, y: 270, o: 0}, abstand: {x: 200, y: 160, o: 0}},
  phasen: [P(H, 'Über Bord geht nichts. Kein Müll, keine Dose, keine Kippe.', {cap: 'Nichts über Bord', an: ['muell']}),
    P(M, 'Kein Öl und kein Sprit ins Wasser. Ölige Bilge wird im Hafen entsorgt, Fäkalien an der Absauganlage.', {cap: 'Öl und Fäkalien: an Land entsorgen', an: ['oel', 'station']}),
    P(H, 'Vom Schilf und dicht bewachsenen Ufern halten wir Abstand. Da brüten Vögel, und da wachsen die Kinderstuben der Fische.', {cap: 'Abstand zu Schilf und Röhricht', an: ['abstand'], aus: ['muell', 'oel']})]});

S('nationalpark', {titel: 'Nationalpark und Wattenmeer', nr: 'A9.9', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'S8.1, S8.2',
  bg: B.wasser() + '<path d="M60 120 Q140 80 230 120 Q300 160 260 210 Q160 240 80 200Z" fill="#e3d29a" stroke="#c4ae6a" stroke-width="2"/>',
  obj: {zone: '<path d="M30 100 Q140 40 260 100 Q340 160 290 230 Q160 270 50 220Z" fill="#c0392b" opacity=".12" stroke="#c0392b" stroke-width="2" stroke-dasharray="8 5"/>', robben: [0, 1, 2].map(i => `<ellipse cx="${150 + i * 26}" cy="${150 + (i % 2) * 14}" rx="12" ry="6" fill="#7b6e63"/>`).join(''),
    kreis: '<circle r="120" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>', tk: T(0, 0, '300 bis 500 m Abstand', 'middle', 12, 'w'), boot: B.boot(), kn: T(0, 0, 'in bestimmten Bereichen höchstens 12 kn über Grund', 'middle', 11)},
  start: {zone: {o: 0}, robben: {o: 0}, kreis: {x: 176, y: 157, o: 0}, tk: {x: 176, y: 30, o: 0}, boot: {x: 360, y: 260}, kn: {x: 200, y: 290, o: 0}},
  phasen: [P(H, 'Das Wattenmeer ist Nationalpark. Die Grenzen und Zonen stehen in der Seekarte, die Regeln in der Befahrensverordnung.', {cap: 'Zonen stehen in der Seekarte', an: ['zone']}),
    P(M, 'Auf den Sandbänken liegen Seehunde. Sie nicht anfahren, sie flüchten sonst ins Wasser, und die Jungen verlieren ihre Mütter.', {cap: 'Seehunde nicht stören', an: ['robben']}),
    P(H, 'Abstand halten: dreihundert bis fünfhundert Meter.', {cap: 'Abstand 300 bis 500 m', an: ['kreis', 'tk']}),
    P(M, 'Und in bestimmten Bereichen gilt höchstens zwölf Knoten über Grund. Langsam ist hier sowieso schöner.', {cap: 'Höchstens 12 kn', an: ['kn'], k: {boot: {x: 340, y: 60}}, dur: 4})]});

S('baden', {titel: 'Baden, Wasserski, Ankerverbot', nr: 'A9.10', gruppe: 'A9 Wetter, Natur, Sicherheit', folge: 'S6.2',
  bg: B.wasser() + '<path d="M0 0 H400 V40 Q200 70 0 40Z" fill="#f0dca0"/>' + [80, 160, 260].map(x => `<g transform="translate(${x} 70)">${T(0, 0, '🏊', 'middle', 16)}</g>`).join(''),
  obj: {boot: B.boot(), tx: T(0, 0, '', 'middle', 13), ski: T(0, 0, '🎿', 'middle', 18), zone: '<rect x="-80" y="-40" width="160" height="80" rx="10" fill="none" stroke="#f2c200" stroke-width="3" stroke-dasharray="8 5"/>' + T(0, 56, 'freigegeben für Wasserski', 'middle', 11)},
  start: {boot: {x: 200, y: 260}, tx: {x: 200, y: 290}, ski: {x: 300, y: 200, o: 0}, zone: {x: 300, y: 200, o: 0}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['Badestelle: höchstens 4,3 kn', 'Wasserski nur in freigegebenen Zonen', 'nicht ankern: Fahrwasser, Hafeneinfahrt'][p]; },
  phasen: [P(H, 'Wo erkennbar gebadet wird, fahren wir höchstens vier Komma drei Knoten, das sind acht Kilometer pro Stunde, und halten Abstand.', {cap: 'Langsam an Badestellen', k: {boot: {y: 150, x: 340}}, dur: 4}),
    P(M, 'Wasserski und Wassermotorrad nur dort, wo es durch Zeichen freigegeben ist.', {cap: 'Wasserski nur in Zonen', an: ['zone', 'ski']}),
    P(H, 'Ankern ist an vielen Stellen verboten, zum Beispiel im Fahrwasser und vor Hafeneinfahrten. Das steht in der Seeschifffahrtsstraßen-Ordnung.', {cap: 'Wo nicht ankern', aus: ['zone', 'ski']})]});

/* ======================= A10 Binnen ======================= */
S('bergtal', {titel: 'Berg- und Talfahrt', nr: 'A10.1', gruppe: 'A10 Binnen', folge: 'Binnen', art: 'pruefung',
  bg: B.wasser('#6a9fb8') + B.ufer('M0 0 H400 V50 Q200 70 0 50Z') + B.ufer('M0 300 H400 V250 Q200 230 0 250Z') + [0, 1, 2].map(i => B.pfeil(330 - i * 120, 150, 280 - i * 120, 150, '#fff', 3, 'fl')).join('') + T(360, 140, 'Strom', 'middle', 11),
  obj: {tal: B.schiff(110, 22, '#6b5a2e'), berg: B.schiff(110, 22, '#3f5e7a'), wir: B.boot(), tx: T(0, 0, '', 'middle', 13)},
  start: {tal: {x: 460, y: 115, r: -90}, berg: {x: -60, y: 185, r: 90}, wir: {x: 60, y: 230, r: 90, s: .7, o: 0}, tx: {x: 200, y: 80}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['Talfahrt: mit dem Strom', 'Bergfahrt: gegen den Strom', 'Talfahrer haben Vorrang', 'Wir Kleinen weichen allen aus'][p]; },
  phasen: [P(H, 'Auf dem Fluss heißt mit dem Strom fahren Talfahrt. Der Talfahrer ist schnell und kann schlecht stoppen.', {cap: 'Talfahrt', k: {tal: {x: 300}}, dur: 3}),
    P(M, 'Gegen den Strom ist Bergfahrt. Der Bergfahrer kommt langsamer voran, kann aber besser manövrieren.', {cap: 'Bergfahrt', k: {berg: {x: 100}}, dur: 3}),
    P(H, 'Darum hat in der Regel der Talfahrer Vorrang. Der Bergfahrer lässt ihm einen geeigneten Weg frei.', {cap: 'Talfahrer haben Vorrang', k: {tal: {x: 120}, berg: {x: 280}}, dur: 3.5}),
    P(M, 'Und wir als Kleinfahrzeug machen den Großen generell Platz und halten uns am Rand.', {cap: 'Kleinfahrzeuge weichen', an: ['wir'], k: {wir: {x: 340}}, dur: 4})]});

S('faehre', {titel: 'Fähre und Schubverband', nr: 'A10.3', gruppe: 'A10 Binnen', folge: 'Binnen',
  bg: B.wasser('#6a9fb8') + B.ufer('M0 0 H400 V50 Q200 70 0 50Z') + B.ufer('M0 300 H400 V250 Q200 230 0 250Z'),
  obj: {seil: '<path d="M200 52 V248" stroke="#333" stroke-width="2" stroke-dasharray="3 3"/>', faehre: '<rect x="-24" y="-16" width="48" height="32" rx="5" fill="#e0d6c0" stroke="#555" stroke-width="2"/>', wir: B.boot(), x: B.kreuz(0, 0), schub: B.schiff(80, 26, '#555') + '<rect x="-13" y="-120" width="26" height="78" fill="#7a6a4a" stroke="#333"/>', bw: '<path d="M0 0 V-150" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>' + T(10, -80, 'langer Bremsweg', 'start', 11)},
  start: {seil: {o: 0}, faehre: {x: 200, y: 230}, wir: {x: 60, y: 160, r: 90, s: .8}, x: {x: 200, y: 160, o: 0}, schub: {x: 330, y: 330, o: 0}, bw: {x: 330, y: 160, o: 0}},
  phasen: [P(H, 'Eine Fähre quert den Fluss. Manche hängen an einem Seil, das man nicht immer sieht.', {cap: 'Fähre am Seil', an: ['seil'], k: {faehre: {y: 110}}, dur: 4}),
    P(M, 'Nie dicht vor oder hinter einer Seilfähre durch, schon gar nicht zwischen Fähre und Ufer, wo das Seil liegt.', {cap: 'Nicht übers Seil fahren', an: ['x']}),
    P(H, 'Ein Schubverband ist sehr lang und braucht ewig zum Stoppen. Vor ihm kreuzen wir nie.', {cap: 'Schubverband: langer Bremsweg', aus: ['x'], an: ['schub', 'bw'], k: {schub: {y: 230}}, dur: 3})]});

S('wehr', {titel: 'Brücke und Wehr', nr: 'A10.4', gruppe: 'A10 Binnen', folge: 'Binnen',
  bg: B.wasser('#6a9fb8') + '<rect x="0" y="40" width="400" height="30" fill="#8a8f95"/>' + Array.from({length: 7}, (_, i) => `<rect x="${i * 60 + 10}" y="70" width="12" height="14" fill="#6d7378"/>`).join('') + '<g transform="translate(0 84)">' + Array.from({length: 10}, (_, i) => `<path d="M${i * 40} 0 q10 14 20 0 q10 14 20 0" stroke="#fff" stroke-width="2" fill="none"/>`).join('') + '</g>',
  obj: {sog: [0, 1, 2].map(i => B.pfeil(-60 + i * 60, 60, -60 + i * 60, 10, '#f08a1c', 4, 'fl')).join(''), wir: B.boot(), tafel: '<rect x="-30" y="-14" width="60" height="28" fill="#fff" stroke="#c9302c" stroke-width="4"/><rect x="-30" y="-4" width="60" height="8" fill="#c9302c"/>', tt: T(0, 0, 'Durchfahrt verboten', 'middle', 12)},
  start: {sog: {x: 200, y: 140, o: 0}, wir: {x: 200, y: 260}, tafel: {x: 110, y: 26, o: 0}, tt: {x: 260, y: 30, o: 0}},
  phasen: [P(H, 'Am Wehr fällt das Wasser hinunter. Oberhalb zieht der Strom zum Wehr, unterhalb dreht sich eine Walze, die einen festhält.', {cap: 'Am Wehr zieht es', an: ['sog']}),
    P(M, 'Darum großen Abstand halten und nur die freigegebene Durchfahrt nehmen, meist die Schleuse daneben.', {cap: 'Abstand halten', k: {wir: {x: 300, y: 250, r: 90}}, dur: 3}),
    P(H, 'Eine Tafel mit rot-weiß-rotem Band heißt: Hier geht es nicht durch.', {cap: 'Sperrzeichen', an: ['tafel', 'tt']})]});

const TOENE = [['▬', 'Achtung'], ['●', 'Kurs nach Steuerbord'], ['● ●', 'Kurs nach Backbord'], ['● ● ●', 'Maschine rückwärts'], ['● ● ● ●', 'manövrierunfähig'], ['●●●●●●●●', 'Gefahr eines Zusammenstoßes']];
S('binnenschall', {titel: 'Schallsignale auf Binnengewässern', nr: 'A10.5', gruppe: 'A10 Binnen', folge: 'Binnen',
  bg: '<rect width="400" height="300" fill="#eef3f6"/>', obj: Object.fromEntries(TOENE.map(([z, t], i) => [`t${i}`, `${T(-150, 5, z, 'start', 16)}${T(10, 5, t, 'start', 13)}`])),
  start: Object.fromEntries(TOENE.map((_, i) => [`t${i}`, {x: 200, y: 60 + i * 40, o: 0}])),
  phasen: [P(H, 'Auf dem Fluss: Ein langer Ton heißt Achtung.', {cap: 'Ein langer Ton', an: ['t0']}),
    P(M, 'Ein kurzer: Ich gehe nach Steuerbord. Zwei kurze: nach Backbord. Drei kurze: Meine Maschine geht rückwärts.', {cap: 'Kurze Töne: Kurs und Maschine', an: ['t1', 't2', 't3']}),
    P(H, 'Vier kurze: Ich bin manövrierunfähig.', {cap: 'Vier kurze', an: ['t4']}),
    P(M, 'Eine Folge sehr kurzer Töne: Achtung, es droht ein Zusammenstoß.', {cap: 'Sehr kurze Töne: Gefahr', an: ['t5']})]});

S('wasserski', {titel: 'Wasserski auf dem Fluss', nr: 'A10.6', gruppe: 'A10 Binnen', folge: 'Binnen', art: 'pruefung',
  bg: B.wasser('#6a9fb8') + B.ufer('M0 0 H400 V40 Q200 60 0 40Z') + B.ufer('M0 300 H400 V262 Q200 242 0 262Z'),
  obj: {zone: '<rect x="-110" y="-70" width="220" height="140" rx="10" fill="none" stroke="#1f5f99" stroke-width="3" stroke-dasharray="8 5"/>' + T(0, -78, 'freigegebene Strecke', 'middle', 11, 'b'), boot: B.boot(), leine: '<path d="M0 30 L0 110" stroke="#ddd" stroke-width="1.5"/>', ski: T(0, 120, '🎿', 'middle', 18), zwei: T(0, 0, 'zweite Person schaut nach hinten', 'middle', 12)},
  start: {zone: {x: 200, y: 150, o: 0}, boot: {x: 140, y: 120, r: 90}, leine: {x: 140, y: 120, r: 90, o: 0}, ski: {x: 140, y: 120, r: 90, o: 0}, zwei: {x: 200, y: 280, o: 0}},
  phasen: [P(H, 'Wasserski gibt es nur auf freigegebenen Strecken. Die sind mit Tafeln gekennzeichnet.', {cap: 'Nur auf freigegebenen Strecken', an: ['zone']}),
    P(M, 'Im Zugboot sitzt außer dem Fahrer eine zweite Person, die den Läufer im Blick behält.', {cap: 'Zweite Person beobachtet', an: ['leine', 'ski', 'zwei']}),
    P(H, 'Abstand zu anderen, zu Badenden und zum Ufer. Und raus aus dem Fahrwasser der Großen.', {cap: 'Abstand halten', k: {boot: {x: 260}, leine: {x: 260}, ski: {x: 260}}, dur: 3})]});

S('segeln', {titel: 'Segeln: Kurse, Wende, Halse', nr: 'A10.7', gruppe: 'A10 Binnen', folge: 'Binnen (freiwillig)', art: 'zusatz',
  bg: B.wasser() + [0, 1, 2].map(i => B.pfeil(140 + i * 60, 20, 140 + i * 60, 60, '#fff', 3, 'fl')).join('') + T(200, 14, 'Wind', 'middle', 11),
  obj: {sg: B.segler(15), tx: T(0, 0, '', 'middle', 13), tote: '<path d="M0 0 L-60 -80 A100 100 0 0 1 60 -80 Z" fill="#c0392b" opacity=".18"/>' + T(0, -60, 'geht nicht', 'middle', 11, 'r')},
  start: {sg: {x: 120, y: 220, r: -45}, tx: {x: 200, y: 290}, tote: {x: 200, y: 200, o: 0}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['am Wind: schräg gegen den Wind', 'genau gegen den Wind geht nicht', 'Wende: Bug durch den Wind', 'Halse: Heck durch den Wind'][p]; },
  phasen: [P(H, 'Ein Segler kann schräg gegen den Wind fahren, am Wind. So kreuzt er nach Luv.', {cap: 'Am Wind', k: {sg: {x: 170, y: 170}}}),
    P(M, 'Direkt gegen den Wind geht es nicht. Das ist der Bereich, in dem die Segel nur flattern.', {cap: 'Nicht direkt gegen den Wind', an: ['tote']}),
    P(H, 'Bei der Wende dreht der Bug durch den Wind, und der Segler fährt auf dem anderen Bug weiter.', {cap: 'Wende', aus: ['tote'], k: {sg: {r: 45, x: 200, y: 150}}, dur: 3}),
    P(M, 'Bei der Halse dreht das Heck durch den Wind. Dabei schlägt der Baum rüber, Köpfe runter!', {cap: 'Halse', k: {sg: {r: 200, x: 240, y: 190}}, dur: 3})]});

A.alias = Object.assign(A.alias || {}, {karte: 'peilung', mob: 'mob', boot: 'boot', wind: 'wind'});
})();
