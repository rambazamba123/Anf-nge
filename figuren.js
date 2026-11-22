/* ==========================================================================
   Skipper – Crew-Baukasten (v5.72, docs/baukasten.md; Nutzer 20.11.2026: „Figuren/Boot austauschbar … dass es überall übernommen wird“)
   Eine Datei für alle Figuren. Wer eine Figur ändert, ändert sie hier, und alle Bühnen, die den Baukasten nutzen, zeigen sie neu.
   - Farben laufen über CSS-Variablen (--hinnerk-jacke usw.); die Werft setzt sie auf <html>, dann ändert sich jede gezeichnete Figur sofort.
   - Der Zeichenstil (feder, kreide, aquarell) hängt an <html data-stil>; auch er wirkt sofort, ohne neu zu zeichnen.
   - Kleidung (Hut, Jacke, Haare, Fell) wählt look().kleid; sie wirkt beim nächsten Zeichnen (Bühnen hören auf das Ereignis „look“).
   FIGUREN.figur(id, o): o = {blick: 'seite'|'vorn'|'ruecken', pose, laune, kleid, wer, dreh}; Füße bei (0,0), Höhe = FIG[id].h, „seite“ schaut nach rechts.
   Posen Menschen: stehen, zeigen, winken, pinne, steuern, sitzen, hueften (vorn), block (Hilke). Katze: sitzen, laufen, strecken, liegen, putzen, springen. Papagei: sitzen, fliegen.
   ========================================================================== */
(() => {
'use strict';
if (window.FIGUREN) return;

const STILE = {
  feder: 'Feder: feine Tusche um jede Form, wie Pettersson',
  kreide: 'Kreide: dicker, krakeliger Strich, wie Janosch',
  aquarell: 'Aquarell: ohne Strich, weiche Ränder, Papierton',
  pastell: 'Pastell: wie Aquarell, aber hell und zart',
  flach: 'Flach: sauber, ohne Strich, wie Gouache',
  linol: 'Linolschnitt: dicker Strich, wenige Farbstufen',
  tusche: 'Tusche: braune Tusche mit Wasserfarbe, wie ein altes Buch',
  bleistift: 'Bleistift: grau schraffiert, nur ein Hauch Farbe',
  scherenschnitt: 'Scherenschnitt: dunkle Umrisse, helle Details',
  /* v5.77 Weiterentwicklung von Feder und Aquarell (Nutzer 22.11.2026: „alte Feder/Aquarell-Stil ist gut, diese weiterentwickeln“) */
  federfein: 'Feder fein: dünne Linie, mehr Schraffur, wie eine Buchillustration',
  laviert: 'Feder laviert: Sepia-Tusche mit Wasserfarbe darüber (wie Pettersson und Findus)',
  aquarellnass: 'Aquarell nass: Farbe läuft aus, dunkler Pigmentrand',
  aquarellstift: 'Aquarell mit Bleistift: zarte Vorzeichnung unter der Farbe'
};
/* Körperbau (v5.75; Nutzer 21.11.2026: „mehrere Varianten, süßer etc.“): k = Kopfgröße, bw/bh = Breite/Höhe des Körpers, auge = Augenart, wange = Backen */
const TYPEN = {
  klassisch: {name: 'Klassisch', k: 1, bw: 1, bh: 1, auge: 'punkt', wange: 1},
  suess: {name: 'Süß', k: 1.5, bw: .92, bh: .8, auge: 'gross', wange: 1.8},
  puppe: {name: 'Püppchen', k: 1.85, bw: .82, bh: .64, auge: 'gross', wange: 2.1},
  kugel: {name: 'Kugelrund', k: 1.25, bw: 1.25, bh: .86, auge: 'glanz', wange: 1.4},
  schlaksig: {name: 'Schlaksig', k: .92, bw: .88, bh: 1.1, auge: 'punkt', wange: .8},
  kraeftig: {name: 'Kräftig', k: 1.05, bw: 1.3, bh: .97, auge: 'glanz', wange: .9}
};
const AUGEN = {punkt: 'Punkt', glanz: 'Mit Glanzlicht', gross: 'Groß und glänzend', perle: 'Kulleraugen', strich: 'Zufriedener Strich'};
const FIG = {
  hinnerk: {name: "Käpt'n Hinnerk", gangStd: 'seemann', typStd: 'kraeftig', wer: 'HINNERK', h: 100, w: 1.18, bauch: .55, lean: 4, nase: 'knolle', bart: 'voll', haar: 'kranz',
    farben: {haut: '#efc19c', bart: '#f1ece2', haar: '#e9e4da', jacke: '#34465f', hose: '#4b505b', stiefel: '#3c4a3a', hut: '#25304a', akzent: '#c9a03c'},
    kleid: {hut: {elbsegler: 'Elbsegler-Mütze', fischer: 'rote Fischermütze', suedwester: 'Südwester', ohne: 'ohne'}, jacke: {troyer: 'Troyer (Strick)', oelzeug: 'Ölzeug', joppe: 'Joppe mit Knöpfen'}},
    std: {hut: 'elbsegler', jacke: 'troyer'}},
  smilla: {name: 'Smilla', gangStd: 'flott', typStd: 'kraeftig', wer: 'SMILLA', h: 82, w: .86, bauch: 0, lean: 0, nase: 'stups', sommersprossen: true,
    farben: {haut: '#f4caa6', haar: '#b8582c', jacke: '#c8503c', hose: '#3d4f6e', stiefel: '#e2b23c', hut: '#2f6f8f', akzent: '#f2efe6'},
    kleid: {haar: {zopf: 'langer Zopf', dutt: 'Dutt', kurz: 'kurz'}, jacke: {regen: 'Regenjacke', ringel: 'Ringelpulli', oelzeug: 'Ölzeug'}},
    std: {haar: 'zopf', jacke: 'regen'}},
  hilke: {name: 'Hilke, Hafenmeisterin', gangStd: 'stapfen', typStd: 'kraeftig', wer: 'HAFENMEISTER', h: 94, w: 1.04, bauch: .25, lean: 0, nase: 'gerade', brille: true,
    farben: {haut: '#e9bb95', haar: '#6a4330', jacke: '#2f5d7c', hose: '#38404c', stiefel: '#2c2c2c', weste: '#e8873a', akzent: '#fffdf5'},
    kleid: {weste: {warn: 'Warnweste', ohne: 'ohne Weste'}}, std: {weste: 'warn'}},
  harms: {name: 'Kapitän Harms', gangStd: 'marsch', typStd: 'schlaksig', wer: 'HARMS', h: 102, w: 1.02, bauch: .15, lean: -1, nase: 'lang', bart: 'kurz', haar: 'grau', brille: true,
    farben: {haut: '#ecc09e', bart: '#c9c6c0', haar: '#bdb9b2', jacke: '#1f2738', hose: '#1f2738', stiefel: '#141414', hut: '#f4f1ea', akzent: '#d9a93b'},
    kleid: {hut: {kapitaen: 'Kapitänsmütze', ohne: 'ohne Mütze'}}, std: {hut: 'kapitaen'}},
  backbord: {name: 'Bordkatze Backbord', gangStd: 'schleichen', typStd: 'klassisch', wer: 'BACKBORD', h: 24, tier: 'katze',
    farben: {fell: '#e08a3c', streifen: '#a9531e', bauch: '#f7e1c0', nase: '#d9776f', halsband: '#2d4a7a', bb: '#ff4a3d', stb: '#3ddc6a'},
    kleid: {fell: {getigert: 'rot getigert', latz: 'rot mit weißem Latz', socken: 'rot mit weißen Pfoten'}}, std: {fell: 'getigert'}},
  klabauter: {name: 'Klabauter', gangStd: 'watscheln', typStd: 'kraeftig', wer: 'KLABAUTER', h: 34, tier: 'papagei',
    farben: {kopf: '#d9412f', koerper: '#4f9a47', fluegel: '#2f7038', schnabel: '#f0b33a', bauch: '#7fbf63', fuss: '#6b6b6b'},
    kleid: {}, std: {}},
  /* v5.78 alle übrigen Figuren der Hörreise (podcast/figuren.md §6, §9, §10), im Stil der Crew; Standard-Körperbau kräftig (Nutzer 22.11.2026) */
  quirin: {name: 'Quirin, Binnenschiffer', gangStd: 'normal', typStd: 'kraeftig', wer: 'QUIRIN', h: 98, w: 1.12, bauch: .2, lean: 0, nase: 'gerade', bart: 'kurz', frisur: 'kurz', jacke: 'fleece',
    farben: {haut: '#ecc29c', bart: '#7a4b2a', haar: '#6a3f22', jacke: '#e0a23e', hose: '#4a6fa0', stiefel: '#7a5432', hut: '#3f7fae', akzent: '#fff4d8'},
    kleid: {hut: {schiffer: 'Schiffermütze', cap: 'Basecap', ohne: 'ohne'}}, std: {hut: 'schiffer'}},
  jasper: {name: 'Jasper, Segler', gangStd: 'schlendern', typStd: 'kraeftig', wer: 'JASPER', h: 96, w: .98, bauch: 0, lean: -1, nase: 'lang', frisur: 'scheitel', jacke: 'segel',
    farben: {haut: '#f0c7a2', haar: '#e2c070', jacke: '#c8382e', hose: '#d6c49a', stiefel: '#7a5a3a', hut: '#1d1d1f', akzent: '#f4f1e8'},
    kleid: {hut: {sonnenbrille: 'Sonnenbrille im Haar', cap: 'Basecap', ohne: 'ohne'}}, std: {hut: 'sonnenbrille'}},
  hafenmeister: {name: 'Hafenmeister Klüverhafen', gangStd: 'schlendern', typStd: 'kraeftig', wer: 'HAFENMEISTER2', h: 100, w: 1.1, bauch: .4, lean: 1, nase: 'knolle', bart: 'schnauz', haar: 'grau', brille: true, jacke: 'arbeit', weste: 'warn',
    farben: {haut: '#e8b996', bart: '#b9b4ac', haar: '#c3beb6', jacke: '#4d6340', weste: '#e9cf3c', hose: '#33363d', stiefel: '#23252a', hut: '#f2efe8', akzent: '#c9a03c'},
    kleid: {hut: {schiffer: 'Schiffermütze', ohne: 'ohne'}}, std: {hut: 'schiffer'}},
  polizistin: {name: 'Wasserschutzpolizistin', rund: 1, gangStd: 'flott', typStd: 'kraeftig', wer: 'POLIZEI', h: 93, w: .96, bauch: 0, lean: 0, nase: 'gerade', frisur: 'pferd', jacke: 'uniform',
    farben: {haut: '#e6b48e', haar: '#3a2a20', jacke: '#1f3554', hose: '#1f3554', stiefel: '#151515', hut: '#1f3554', akzent: '#e3c45a'},
    kleid: {hut: {polizei: 'Dienstmütze', ohne: 'ohne'}}, std: {hut: 'polizei'}},
  polizist: {name: 'Wasserschutzpolizist', gangStd: 'normal', typStd: 'kraeftig', wer: 'POLIZEI2', h: 99, w: 1.1, bauch: .1, lean: 0, nase: 'gerade', frisur: 'kurz', jacke: 'uniform',
    farben: {haut: '#6e4a32', haar: '#1b1512', jacke: '#1f3554', hose: '#1f3554', stiefel: '#151515', hut: '#1f3554', akzent: '#e3c45a'},
    kleid: {hut: {polizei: 'Dienstmütze', ohne: 'ohne'}}, std: {hut: 'polizei'}},
  schleuse: {name: 'Schleusenwärter Klappdörp', gangStd: 'stapfen', typStd: 'kraeftig', wer: 'SCHLEUSE', h: 95, w: 1.14, bauch: .5, lean: 2, nase: 'knolle', bart: 'schnauz', haar: 'kranz', jacke: 'arbeit', weste: 'warn',
    farben: {haut: '#eab894', bart: '#d8d2c8', haar: '#d8d2c8', jacke: '#3b4a5e', hose: '#2f3a46', stiefel: '#2a2a2a', weste: '#e8873a', hut: '#3b4a5e', akzent: '#fffdf5'},
    kleid: {hut: {ohne: 'ohne', schiffer: 'Schiffermütze'}}, std: {hut: 'ohne'}},
  rangerin: {name: 'Rangerin im Watt', gangStd: 'huepfen', typStd: 'kraeftig', wer: 'RANGERIN', h: 90, w: .94, bauch: 0, lean: 0, nase: 'stups', sommersprossen: true, frisur: 'locken', jacke: 'ranger',
    farben: {haut: '#efc6a2', haar: '#9a4a24', jacke: '#5d7a3e', hose: '#6b5a40', stiefel: '#3c4a3a', hut: '#a68a52', akzent: '#2a2a2a'},
    kleid: {hut: {ranger: 'Rangerhut', ohne: 'ohne'}}, std: {hut: 'ranger'}},
  seenotretter: {name: 'Seenotretter', gangStd: 'flott', typStd: 'kraeftig', wer: 'SEENOT', h: 100, w: 1.12, bauch: 0, lean: 0, nase: 'gerade', bart: 'kurz', frisur: 'kurz', jacke: 'overall', weste: 'rettung',
    farben: {haut: '#e9bc98', bart: '#5a3a26', haar: '#5a3a26', jacke: '#d6452f', hose: '#d6452f', stiefel: '#1f1f1f', weste: '#f08a24', hut: '#f4f1ea', akzent: '#d9e3e6'},
    kleid: {hut: {helm: 'Helm', ohne: 'ohne'}}, std: {hut: 'helm'}},
  mausvater: {name: 'Mäusevater', gangStd: 'laufen', tier: 'maus', wer: 'MAUS', h: 16, gross: 1.15, extra: 'muetze', farben: {fell: '#a6968a', bauch: '#ece0d2', nase: '#e59a94', akzent: '#3f6f9a'}, kleid: {}, std: {}},
  mausmutter: {name: 'Mäusemutter', gangStd: 'laufen', tier: 'maus', wer: 'MAUS', h: 15, gross: 1.05, extra: 'tuch', farben: {fell: '#b5a394', bauch: '#f1e6d8', nase: '#e59a94', akzent: '#c8503c'}, kleid: {}, std: {}},
  mauskind: {name: 'Mäusekind', gangStd: 'springen', tier: 'maus', wer: 'MAUS', h: 11, gross: .8, extra: 'schal', farben: {fell: '#a89a8e', bauch: '#efe4d6', nase: '#ee9c96', akzent: '#e2b23c'}, kleid: {}, std: {}},
  mausbaby: {name: 'Mäusebaby', gangStd: 'laufen', tier: 'maus', wer: 'MAUS', h: 8, gross: .6, extra: 'schleife', farben: {fell: '#c2b4a6', bauch: '#f4ebdf', nase: '#f0a49e', akzent: '#d8708a'}, kleid: {}, std: {}},
  muschelwicht: {name: 'Muschelwicht', gangStd: 'krabbeln', tier: 'fabel', wer: 'FABEL', h: 18, farben: {haut: '#f0c8a6', jacke: '#e8d2b4', hut: '#c0392b', akzent: '#f2d36b'}, kleid: {}, std: {}},
  nebelpuschel: {name: 'Nebelpuschel', gangStd: 'wabern', tier: 'fabel', wer: 'FABEL', h: 22, farben: {fell: '#eef1f2', haut: '#9aa6ad'}, kleid: {}, std: {}},
  tangschrat: {name: 'Tangschrat', gangStd: 'schlurfen', tier: 'fabel', wer: 'FABEL', h: 24, farben: {fell: '#5f7d45', akzent: '#e8823a'}, kleid: {}, std: {}},
  leuchtfloh: {name: 'Leuchtfloh', gangStd: 'flattern', tier: 'fabel', wer: 'FABEL', h: 20, farben: {fell: '#4d6a8a'}, kleid: {}, std: {}},
  knotenwurm: {name: 'Knotenwurm', gangStd: 'kriechen', tier: 'fabel', wer: 'FABEL', h: 14, farben: {}, kleid: {}, std: {}},
  sandkruemel: {name: 'Sandkrümel', gangStd: 'hopsen', tier: 'fabel', wer: 'FABEL', h: 10, farben: {}, kleid: {}, std: {}},
  quallchen: {name: 'Quallchen', gangStd: 'schweben', tier: 'fabel', wer: 'FABEL', h: 22, farben: {}, kleid: {}, std: {}},
  moewe: {name: 'Möwe', gangStd: 'watscheln', tier: 'fabel', wer: 'MOEWE', h: 20, farben: {}, kleid: {}, std: {}},
  lotse: {name: 'Mats, Verkehrszentrale', gangStd: 'normal', typStd: 'kraeftig', wer: 'VERKEHR', h: 98, w: 1, bauch: .15, lean: 0, nase: 'gerade', frisur: 'scheitel', brille: true, jacke: 'hemd',
    farben: {haut: '#ecc4a0', haar: '#2e2622', jacke: '#9cb8d4', hose: '#2f3a4e', stiefel: '#1f1f22', hut: '#2a2a2e', akzent: '#2f3a4e'},
    kleid: {hut: {headset: 'Headset', ohne: 'ohne'}}, std: {hut: 'headset'}}
};

/* Hinnerk zur Auswahl (v5.82, Nutzer 23.11.2026: „ähnlich wie der jetzige, aber etwas anders, süßer, Bart anders … Auswahlmöglichkeiten“).
   Eine Variante überschreibt Bart, Körperbau (typ als eigenes Maß) und Farben. Gewählt wird in der Werft (S.cfg.look.var.hinnerk, Standard leer = wie bisher; R7). */
const VARIANTEN = {hinnerk: {
  bisher: {name: 'Wie bisher', kurz: 'H1'},
  krause: {name: 'Schifferkrause', kurz: 'H2', bart: 'krause', typ: {k: 1.12, bw: 1.26, bh: .95, auge: 'glanz', wange: 1.5}},
  walross: {name: 'Walross-Schnauzer', kurz: 'H3', bart: 'walross', typ: {k: 1.1, bw: 1.3, bh: .96, auge: 'glanz', wange: 1.4}},
  wolke: {name: 'Wolkenbart', kurz: 'H4', bart: 'rausche', typ: {k: 1.16, bw: 1.24, bh: .93, auge: 'perle', wange: 1.6}},
  gestutzt: {name: 'Kurz gestutzt', kurz: 'H5', bart: 'gestutzt', typ: {k: 1.1, bw: 1.24, bh: .97, auge: 'glanz', wange: 1.3}, farben: {bart: '#d6d0c5', haar: '#d6d0c5'}},
  zwirbel: {name: 'Zwirbelbart', kurz: 'H6', bart: 'zwirbel', typ: {k: 1.12, bw: 1.26, bh: .95, auge: 'glanz', wange: 1.5}},
  knuddel: {name: 'Knuddel-Hinnerk', kurz: 'H7', typ: {k: 1.28, bw: 1.32, bh: .86, auge: 'perle', wange: 1.9}}
}};
function variante(id, o) { const V = VARIANTEN[id]; if (!V) return null; const w = (o && o.var) || (look().var || {})[id]; return w && V[w] && w !== 'bisher' ? V[w] : null; }
function mitVariante(f, V) { return V ? {...f, ...V, farben: {...f.farben, ...(V.farben || {})}} : f; }
/* Körperbau, der wirklich gilt: Aufruf (o.typ) vor Werft je Figur vor Variante vor „alle“ vor Standard der Figur */
function typVon(id, o = {}) {
  const f = FIG[id]; if (!f) return TYPEN.klassisch; const L0 = look(), ex = o.typ || (L0.typ || {})[id], V = variante(id, o);
  if (ex) return TYPEN[ex] || TYPEN.klassisch;
  if (V && V.typ) return V.typ;
  return TYPEN[L0.typAlle || f.typStd || 'klassisch'] || TYPEN.klassisch;
}

/* ---------- Stil und Farben als CSS (einmal pro Dokument) ---------- */
/* Stilregeln: gelten für <html data-stil="X"> (alle Figuren ohne festen Stil) und für .st-X (Vorschauen mit festem Stil) */
function stilCss() {
  const V = (st, d) => `:root[data-stil="${st}"] .cr:not(.fest),.cr.st-${st}{${d}}`;
  const R = (st, desc, d) => desc === null ? `:root[data-stil="${st}"] .cr.stil:not(.fest),.cr.stil.st-${st}{${d}}` : desc.split(',').map(x => `:root[data-stil="${st}"] .cr:not(.fest) ${x},.cr.st-${st} ${x}`).join(',') + `{${d}}`;
  const wasser = st => R(st, '.ln', 'stroke:none') + R(st, '.ol', 'display:none') + R(st, '.det', 'opacity:.32') + R(st, '.schraff', 'display:none') + R(st, '.sch', 'opacity:.24');
  let c = '';
  c += V('kreide', '--tinte:#2a211b;--strich:2.1') + R('kreide', null, 'filter:url(#cr-kreide)') + R('kreide', '.schraff', 'opacity:.3');
  c += wasser('aquarell') + R('aquarell', null, 'filter:url(#cr-aquarell)');
  c += wasser('pastell') + R('pastell', null, 'filter:url(#cr-aquarell) saturate(.6) brightness(1.13)') + R('pastell', '.sch', 'opacity:.12');
  c += R('flach', '.ln', 'stroke:none') + R('flach', '.ol', 'display:none') + R('flach', '.det', 'opacity:.55') + R('flach', '.schraff', 'display:none') + R('flach', '.sch', 'opacity:.13') + R('flach', null, 'filter:none');
  c += V('linol', '--tinte:#1c1612;--strich:2.3') + R('linol', null, 'filter:url(#cr-linol) saturate(1.25)') + R('linol', '.sch', 'display:none') + R('linol', '.schraff', 'display:none') + R('linol', '.hl', 'display:none') + R('linol', '.det', 'opacity:1');
  c += V('tusche', '--tinte:#2b1d12;--strich:1.25') + R('tusche', null, 'filter:url(#cr-feder) sepia(.85) saturate(1.25) contrast(1.05)') + R('tusche', '.schraff', 'opacity:.8');
  c += V('bleistift', '--tinte:#47474c;--strich:.9') + R('bleistift', null, 'filter:url(#cr-stift) grayscale(.9) contrast(1.12) brightness(1.04)') + R('bleistift', '.schraff', 'opacity:.9') + R('bleistift', '.det', 'opacity:.9') + R('bleistift', '.sch', 'opacity:.22');
  const dunkel = '#2a2233', hellD = '#efe3cc';
  c += R('scherenschnitt', 'path,ellipse,circle,rect', `fill:${dunkel}!important`) + R('scherenschnitt', '.gl', `stroke:${dunkel}!important;fill:none!important`) + R('scherenschnitt', '.ol,.ln', 'stroke:none!important')
    + R('scherenschnitt', '.det,[fill="none"]', 'fill:none!important') + R('scherenschnitt', '.det', `stroke:${hellD}!important;opacity:.8`) + R('scherenschnitt', '.tinte', `fill:${hellD}!important`)
    + R('scherenschnitt', '.wange,.sch,.hl,.schraff', 'display:none') + R('scherenschnitt', null, 'filter:url(#cr-feder)');
  c += V('federfein', '--tinte:#2e241c;--strich:.75') + R('federfein', '.schraff', 'opacity:.95') + R('federfein', '.det', 'opacity:.9');
  c += V('laviert', '--tinte:#4a2f1c;--strich:1') + R('laviert', null, 'filter:url(#cr-lavur) sepia(.22) saturate(1.12)') + R('laviert', '.sch', 'opacity:.28') + R('laviert', '.schraff', 'opacity:.45');
  c += wasser('aquarellnass') + R('aquarellnass', null, 'filter:url(#cr-nass) saturate(1.12)') + R('aquarellnass', '.sch', 'opacity:.3');
  c += V('aquarellstift', '--tinte:#6d6a66;--strich:.55') + R('aquarellstift', '.ln', 'stroke-opacity:.75') + R('aquarellstift', '.det', 'opacity:.45') + R('aquarellstift', '.schraff', 'display:none') + R('aquarellstift', null, 'filter:url(#cr-aquarell)');
  return c;
}
function css() {
  if (document.getElementById('crewcss')) return;
  let v = '';
  for (const [id, f] of Object.entries(FIG)) v += `.cr-${id}{${Object.entries(f.farben).map(([k, c]) => `--${k}:var(--${id}-${k},${c})`).join(';')}}`;
  const teile = ['haut', 'bart', 'haar', 'jacke', 'hose', 'stiefel', 'hut', 'akzent', 'weste', 'fell', 'streifen', 'bauch', 'nase', 'halsband', 'bb', 'stb', 'kopf', 'koerper', 'fluegel', 'schnabel', 'fuss'];
  v += teile.map(t => `.cr .f-${t}{fill:var(--${t})}.cr .s-${t}{stroke:var(--${t})}`).join('');
  const s = document.createElement('style'); s.id = 'crewcss';
  s.textContent = v + `
  .cr{--tinte:#3b2a1f;--strich:1.15}
  .cr .ln{stroke:var(--tinte);stroke-width:var(--strich);stroke-linejoin:round;stroke-linecap:round}
  .cr .ol{fill:none;stroke:var(--tinte);stroke-linecap:round;stroke-linejoin:round;stroke-width:calc(var(--b) * 1px + var(--strich) * 2px)}
  .cr .gl{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:calc(var(--b) * 1px)}
  .cr .det{fill:none;stroke:var(--tinte);stroke-width:calc(var(--strich) * .62);stroke-linecap:round;opacity:.75}
  .cr .tinte{fill:var(--tinte)}
  .cr .sch{fill:#2a1608;opacity:.17}.cr .hl{fill:#fff;opacity:.2}.cr .wange{fill:#e0705f;opacity:.28}
  .cr .hinten{filter:brightness(.8)}
  .cr .schraff{fill:url(#cr-schraff);opacity:.55}
  .cr.stil{filter:url(#cr-feder)}` + stilCss();
  document.head.appendChild(s);
  defs();
}
function defs() {
  if (document.getElementById('crewdefs')) return;
  const d = document.createElement('div'); d.id = 'crewdefs'; d.setAttribute('aria-hidden', 'true');
  d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  d.innerHTML = `<svg width="0" height="0"><defs>
    <filter id="cr-feder" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.3"/></filter>
    <filter id="cr-kreide" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.4" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="2" result="k"/><feColorMatrix in="k" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.28 1.06" result="km"/><feComposite in="d" in2="km" operator="in"/></filter>
    <filter id="cr-aquarell" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="5"/><feDisplacementMap in="SourceGraphic" scale="2.6" result="d"/><feGaussianBlur in="d" stdDeviation=".35"/></filter>
    <filter id="cr-linol" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="2" seed="12" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.2" result="d"/>
      <feComponentTransfer in="d"><feFuncR type="discrete" tableValues="0 .22 .45 .7 .9 1"/><feFuncG type="discrete" tableValues="0 .22 .45 .7 .9 1"/><feFuncB type="discrete" tableValues="0 .22 .45 .7 .9 1"/></feComponentTransfer></filter>
    <filter id="cr-stift" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="2" seed="21"/><feDisplacementMap in="SourceGraphic" scale=".9"/></filter>
    <filter id="cr-lavur" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="11" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" result="d"/><feMorphology in="SourceAlpha" operator="erode" radius="1.4" result="e"/><feComposite in="SourceAlpha" in2="e" operator="out" result="rand"/><feFlood flood-color="#6b4422" flood-opacity=".22"/><feComposite in2="rand" operator="in" result="pig"/><feMerge><feMergeNode in="d"/><feMergeNode in="pig"/></feMerge></filter>
    <filter id="cr-nass" x="-12%" y="-12%" width="124%" height="124%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="17" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.6" result="d"/><feGaussianBlur in="d" stdDeviation=".35" result="w"/><feMorphology in="SourceAlpha" operator="erode" radius="1.8" result="e"/><feComposite in="SourceAlpha" in2="e" operator="out" result="r0"/><feDisplacementMap in="r0" in2="t" scale="4" result="rand"/><feFlood flood-color="#3c2410" flood-opacity=".3"/><feComposite in2="rand" operator="in" result="pig"/><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="1" seed="4" result="k"/><feColorMatrix in="k" type="matrix" values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .35 -.1" result="korn"/><feComposite in="korn" in2="w" operator="in" result="kk"/><feMerge><feMergeNode in="w"/><feMergeNode in="kk"/><feMergeNode in="pig"/></feMerge></filter>
    <pattern id="cr-schraff" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0 V3" stroke="#3b2a1f" stroke-width=".55"/></pattern>
  </defs></svg>`;
  (document.body || document.documentElement).appendChild(d);
}

/* ---------- kleine Helfer ---------- */
const r1 = n => Math.round(n * 10) / 10;
const pt = p => `${r1(p[0])} ${r1(p[1])}`;
const dreh = (o, art, wer, px, py) => o.dreh === false ? '' : ` data-dreh="${art}" data-wer="${wer || ''}" data-px="${r1(px)}" data-py="${r1(py)}"`;
/* Glied (Arm, Bein) als Röhre: Umriss darunter, Farbe darüber; b = Breite */
function glied(pts, b, farbe, extra = '') {
  const d = 'M' + pts.map(pt).join(' L');
  return `<path class="ol" style="--b:${b}" d="${d}"/><path class="gl s-${farbe}" style="--b:${b}" d="${d}"/>${extra}`;
}
const hand = (x, y, rot = 0) => `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})"><path d="M-3.2 -1.5 Q-3.6 3.6 0 4.2 Q3.4 3.8 3.2 -1 Q3 -3.6 0 -3.6 Q-3 -3.6 -3.2 -1.5Z" class="f-haut ln"/><path d="M2.6 -1.2 Q5.2 -1.2 4.8 1.4" class="det"/></g>`;
function laune(o) { return o.laune || 'normal'; }
function kleidVon(id, o) { const f = FIG[id], k = {...f.std, ...((o && o.kleid) || {})}; for (const t of Object.keys(f.kleid)) if (!f.kleid[t][k[t]]) k[t] = f.std[t]; return k; }

/* Augen in fünf Arten; die Größe kommt vom Körperbau (o._t), Glanzlichter bleiben auch in dunklen Stilen hell */
function augeSvg(ax, ay, o, staunt, rx, ry) {
  const T = o._t || TYPEN.klassisch, a = o.auge || T.auge, rr = staunt ? 1.3 : 1;
  const hl = (r, dx, dy) => `<circle cx="${r1(ax + dx)}" cy="${r1(ay + dy)}" r="${r}" fill="#fff"/>`;
  if (a === 'glanz') return `<ellipse cx="${ax}" cy="${ay}" rx="${r1(rx * 1.3 * rr)}" ry="${r1(ry * 1.3 * rr)}" class="tinte"/>${hl(.5, .45, -.6)}`;
  if (a === 'gross') return `<ellipse cx="${ax}" cy="${ay}" rx="${r1(rx * 1.9 * rr)}" ry="${r1(ry * 1.95 * rr)}" class="tinte"/>${hl(.95, .65, -.8)}${hl(.42, -.55, .75)}`;
  if (a === 'perle') return `<circle cx="${ax}" cy="${ay}" r="${r1(rx * 2.1 * rr)}" fill="#fffdf5" class="ln" style="stroke-width:.55"/><circle cx="${r1(ax + .5)}" cy="${r1(ay + .25)}" r="${r1(rx * 1.05)}" class="tinte"/>${hl(.4, .9, -.1)}`;
  if (a === 'strich') return `<path d="M${r1(ax - rx * 1.4)} ${r1(ay + .2)} Q${ax} ${r1(ay + 1.7)} ${r1(ax + rx * 1.4)} ${r1(ay + .2)}" class="det" style="opacity:1;stroke-width:calc(var(--strich) * .9)"/>`;
  return `<ellipse cx="${ax}" cy="${ay}" rx="${r1(rx * (staunt ? 1.3 : 1))}" ry="${r1(ry * (staunt ? 1.29 : 1))}" class="tinte"/>`;
}

/* Mund mit zwei Zuständen (v5.81, Nutzer 23.11.2026: „Wenn die Personen sprechen, bewegt sich der Mund“): .m-zu wie bisher, .m-auf offen (Höhe 0…1),
   gesetzt von der Filmbühne oder FIGUREN.mund(el, wert); Anker oben am Mund (data-ax, data-ay), damit er nach unten aufgeht */
function mundG(o, f, mx, my, zu, art) {
  const ay = r1(my - .7), X = r1(mx), auf = art === 'seite'
    ? `<path d="M${r1(mx - 2.3)} ${ay} Q${r1(mx - .3)} ${r1(my + 3.7)} ${r1(mx + 1.9)} ${r1(my - 1)}Z" fill="#5c231b"/><path d="M${r1(mx - 1.3)} ${r1(my + 1.7)} Q${r1(mx - .1)} ${r1(my + 3)} ${r1(mx + .9)} ${r1(my + 1.3)}" fill="#c96d5e"/>`
    : `<path d="M${r1(mx - 2.6)} ${ay} Q${X} ${r1(my - 1.3)} ${r1(mx + 2.6)} ${ay} Q${r1(mx + 2.3)} ${r1(my + 3.5)} ${X} ${r1(my + 3.7)} Q${r1(mx - 2.3)} ${r1(my + 3.5)} ${r1(mx - 2.6)} ${ay}Z" fill="#5c231b"/><ellipse cx="${X}" cy="${r1(my + 2.6)}" rx="1.4" ry=".8" fill="#c96d5e"/>`;
  return `<g class="mund"${dreh(o, 'mund', f.wer, mx, my)}><g class="m-zu">${zu}</g><g class="m-auf" data-ax="${X}" data-ay="${ay}" transform="translate(${X} ${ay}) scale(1 0) translate(${-X} ${-ay})">${auf}</g></g>`;
}

/* ---------- Köpfe ---------- */
/* Kopf von der Seite, schaut nach rechts; (hx, hy) Mitte */
/* ---------- Allgemeine Frisuren und Kopfbedeckungen (v5.78, für die neuen Figuren; die alte Crew behält ihre eigenen) ----------
   f.frisur: kurz | scheitel | locken | pferd; Kopf: Mitte hx/hy, Scheitel bei hy - 11. blick: seite (schaut nach rechts) | vorn | ruecken */
function haarHinten(f, blick, hx, hy) {
  const fr = f.frisur; if (!fr) return '';
  if (fr === 'pferd') return blick === 'seite' ? `<path d="M${hx - 7} ${hy - 6} Q${hx - 16} ${hy - 4} ${hx - 15} ${hy + 8} Q${hx - 14} ${hy + 16} ${hx - 17} ${hy + 20} Q${hx - 10} ${hy + 16} ${hx - 10} ${hy + 6} Q${hx - 10} ${hy} ${hx - 5} ${hy - 3}Z" class="f-haar ln"/>`
    : blick === 'ruecken' ? `<path d="M${hx - 3} ${hy - 4} Q${hx - 5} ${hy + 10} ${hx - 1} ${hy + 20} Q${hx + 4} ${hy + 10} ${hx + 3} ${hy - 4}Z" class="f-haar ln"/>` : '';
  if (fr === 'locken') { const r = blick === 'seite' ? [[-9, -4], [-11, 3], [-9, 9], [-5, 12]] : [[-11, -2], [-12, 5], [11, -2], [12, 5], [-8, 11], [8, 11]];
    return r.map(([x, y]) => `<circle cx="${hx + x}" cy="${hy + y}" r="4.4" class="f-haar ln"/>`).join(''); }
  return '';
}
function haarVorn(f, blick, hx, hy) {
  const fr = f.frisur; if (!fr) return '';
  if (blick === 'ruecken') return `<path d="M${hx - 9.6} ${hy + 4} Q${hx - 11} ${hy - 12} ${hx} ${hy - 12} Q${hx + 11} ${hy - 12} ${hx + 9.6} ${hy + 4} Q${hx} ${hy + 7} ${hx - 9.6} ${hy + 4}Z" class="f-haar ln"/>` + (fr === 'locken' ? [-6, 0, 6].map(x => `<circle cx="${hx + x}" cy="${hy - 9}" r="3.6" class="f-haar ln"/>`).join('') : '');
  if (blick === 'seite') {
    let h = `<path d="M${hx - 8.8} ${hy + 1} Q${hx - 10} ${hy - 11.4} ${hx + 1} ${hy - 11.4} Q${hx + 9.6} ${hy - 11} ${hx + 9.8} ${hy - 4} Q${hx + 4} ${hy - 8.6} ${hx - 1} ${hy - 7.4} Q${hx - 5.4} ${hy - 5} ${hx - 6} ${hy + 1}Z" class="f-haar ln"/>`;
    if (fr === 'scheitel') h += `<path d="M${hx - 2} ${hy - 11} Q${hx + 8} ${hy - 13.6} ${hx + 11} ${hy - 6} Q${hx + 6} ${hy - 9} ${hx} ${hy - 8}Z" class="f-haar ln"/><path d="M${hx - 1} ${hy - 10.4} Q${hx + 4} ${hy - 11.6} ${hx + 8} ${hy - 9}" class="det"/>`;
    if (fr === 'locken') h += [[-4, -11], [2, -12.4], [7.6, -10]].map(([x, y]) => `<circle cx="${hx + x}" cy="${hy + y}" r="3.4" class="f-haar ln"/>`).join('');
    return h;
  }
  let h = `<path d="M${hx - 9.6} ${hy + 1} Q${hx - 11} ${hy - 12} ${hx} ${hy - 12} Q${hx + 11} ${hy - 12} ${hx + 9.6} ${hy + 1} Q${hx + 7.6} ${hy - 6.4} ${hx + 1} ${hy - 7} Q${hx - 6} ${hy - 7} ${hx - 9.6} ${hy + 1}Z" class="f-haar ln"/>`;
  if (fr === 'scheitel') h += `<path d="M${hx - 3} ${hy - 12} Q${hx + 9} ${hy - 13} ${hx + 10.4} ${hy - 3} Q${hx + 5} ${hy - 9} ${hx - 2} ${hy - 8}Z" class="f-haar ln"/>`;
  if (fr === 'locken') h += [[-7, -10], [-1.6, -12.4], [4, -12], [8.4, -9]].map(([x, y]) => `<circle cx="${hx + x}" cy="${hy + y}" r="3.4" class="f-haar ln"/>`).join('');
  return h;
}
function hutGen(hut, blick, hx, hy) {
  if (!hut || hut === 'ohne') return '';
  const se = blick === 'seite', ru = blick === 'ruecken';
  const krone = (top, br) => se ? `<path d="M${hx - 10} ${hy - 4.6} Q${hx - 9.8} ${hy - top} ${hx + .6} ${hy - top - .2} Q${hx + 10.4} ${hy - top + .4} ${hx + 10.2} ${hy - 5.6}Z" class="f-hut ln"/>`
    : `<path d="M${hx - br} ${hy - 5} Q${hx - br - .4} ${hy - top} ${hx} ${hy - top - .2} Q${hx + br + .4} ${hy - top} ${hx + br} ${hy - 5}Z" class="f-hut ln"/>`;
  const schirm = se ? `<path d="M${hx + 4.6} ${hy - 6} Q${hx + 12} ${hy - 7.2} ${hx + 16} ${hy - 4.4} Q${hx + 11} ${hy - 3} ${hx + 4.6} ${hy - 4}Z" class="tinte"/>` : ru ? '' : `<path d="M${hx - 8} ${hy - 5.6} Q${hx} ${hy - 1.4} ${hx + 8} ${hy - 5.6}Z" class="tinte"/>`;
  if (hut === 'schiffer') return krone(15.4, 10.6) + (se ? `<path d="M${hx - 10} ${hy - 7.4} Q${hx} ${hy - 8.4} ${hx + 10.2} ${hy - 7.6} L${hx + 10.2} ${hy - 5.6} Q${hx} ${hy - 6.2} ${hx - 10} ${hy - 4.6}Z" class="tinte" opacity=".7"/>` : `<path d="M${hx - 10.6} ${hy - 8} H${hx + 10.6} V${hy - 5} H${hx - 10.6}Z" class="tinte" opacity=".7"/>`) + schirm + (ru ? '' : `<circle cx="${se ? hx + 7 : hx}" cy="${hy - 10.4}" r="1.3" class="f-akzent"/>`);
  if (hut === 'polizei') return krone(16.6, 11.6) + (se ? `<path d="M${hx - 10} ${hy - 8.6} H${hx + 10.2} V${hy - 5.4} H${hx - 10}Z" fill="#f2efe6" class="ln"/>` : `<path d="M${hx - 11} ${hy - 8.6} H${hx + 11} V${hy - 5.2} H${hx - 11}Z" fill="#f2efe6" class="ln"/>`) + schirm + (ru ? '' : `<path d="M${se ? hx + 5 : hx - 1.6} ${hy - 12.6} l1.6 -1.6 l1.6 1.6 l-1.6 1.6Z" class="f-akzent ln"/>`);
  if (hut === 'cap') return krone(14.4, 10.2) + (se ? `<path d="M${hx + 6} ${hy - 5.6} Q${hx + 14} ${hy - 6.2} ${hx + 18.6} ${hy - 3.4} Q${hx + 12} ${hy - 2.4} ${hx + 6} ${hy - 3.8}Z" class="f-hut ln"/>` : ru ? `<path d="M${hx - 3} ${hy - 6} H${hx + 3}" class="det"/>` : `<path d="M${hx - 9} ${hy - 5.4} Q${hx} ${hy - .6} ${hx + 9} ${hy - 5.4}Z" class="f-hut ln"/>`) + `<circle cx="${hx}" cy="${hy - 14.2}" r="1.2" class="f-hut ln"/>`;
  if (hut === 'helm') return (se ? `<path d="M${hx - 11} ${hy - 1} Q${hx - 12} ${hy - 17.6} ${hx + 1} ${hy - 17.8} Q${hx + 13} ${hy - 17} ${hx + 12} ${hy - 3} L${hx + 14} ${hy - 2} Q${hx + 13} ${hy - 4} ${hx + 12.4} ${hy - 6}" class="f-hut ln"/>`
    : `<path d="M${hx - 12} ${hy - 1} Q${hx - 13} ${hy - 18} ${hx} ${hy - 18.2} Q${hx + 13} ${hy - 18} ${hx + 12} ${hy - 1}Z" class="f-hut ln"/>`) + `<path d="M${hx - 11} ${hy - 9} Q${hx} ${hy - 11} ${hx + 11.6} ${hy - 9}" stroke="#f08a24" stroke-width="2.4" fill="none"/><path d="M${hx - 6} ${hy - 15} Q${hx} ${hy - 17} ${hx + 6} ${hy - 15}" class="hl"/>`;
  if (hut === 'ranger') return (se ? `<path d="M${hx - 17} ${hy - 5} Q${hx} ${hy - 9.4} ${hx + 19} ${hy - 5.4} Q${hx} ${hy - 2.6} ${hx - 17} ${hy - 5}Z" class="f-hut ln"/>` : `<ellipse cx="${hx}" cy="${hy - 6}" rx="${ru ? 17 : 17.6}" ry="3.6" class="f-hut ln"/>`) + krone(17, 9) + `<path d="M${hx - 9} ${hy - 8.4} Q${hx} ${hy - 9.6} ${hx + 9} ${hy - 8.4}" stroke="#5a4428" stroke-width="2" fill="none"/>`;
  if (hut === 'sonnenbrille') return ru ? '' : se ? `<path d="M${hx + 1} ${hy - 12.2} Q${hx + 5.6} ${hy - 13} ${hx + 9} ${hy - 9.8} Q${hx + 5.4} ${hy - 9} ${hx + 1.4} ${hy - 10.6}Z" class="f-hut ln"/>` : [-1, 1].map(sd => `<ellipse cx="${hx + sd * 4.4}" cy="${hy - 10.6}" rx="3.6" ry="2.2" class="f-hut ln"/>`).join('') + `<path d="M${hx - 1} ${hy - 10.8} H${hx + 1}" class="det" style="opacity:1"/>`;
  if (hut === 'headset') return (se ? `<path d="M${hx - 6} ${hy - 1} Q${hx - 8} ${hy - 15} ${hx + 2} ${hy - 13.6}" fill="none" class="s-hut" stroke-width="2"/><ellipse cx="${hx - 4.4}" cy="${hy + .4}" rx="3" ry="3.6" class="f-hut ln"/><path d="M${hx - 3} ${hy + 3} Q${hx + 2} ${hy + 8} ${hx + 7} ${hy + 6.6}" fill="none" class="s-hut" stroke-width="1.3"/><circle cx="${hx + 7.4}" cy="${hy + 6.4}" r="1.2" class="f-hut"/>`
    : `<path d="M${hx - 10} ${hy - 1} Q${hx - 11} ${hy - 15} ${hx} ${hy - 15} Q${hx + 11} ${hy - 15} ${hx + 10} ${hy - 1}" fill="none" class="s-hut" stroke-width="2"/>` + [-1, 1].map(sd => `<ellipse cx="${hx + sd * 10}" cy="${hy}" rx="2.6" ry="3.6" class="f-hut ln"/>`).join('') + (ru ? '' : `<path d="M${hx + 10} ${hy + 3} Q${hx + 8} ${hy + 8} ${hx + 3} ${hy + 7.6}" fill="none" class="s-hut" stroke-width="1.3"/>`));
  return '';
}
const schnauz = (blick, hx, hy) => blick === 'seite' ? `<path d="M${hx + 6.6} ${hy + 4.2} Q${hx + 10.6} ${hy + 3.6} ${hx + 11.6} ${hy + 6.6} Q${hx + 9} ${hy + 5.6} ${hx + 6} ${hy + 6.2}Z" class="f-bart ln"/>`
  : `<path d="M${hx - 4.6} ${hy + 6} Q${hx - 2} ${hy + 3.6} ${hx + .8} ${hy + 4.8} Q${hx + 3.6} ${hy + 3.6} ${hx + 6.2} ${hy + 6} Q${hx + 3} ${hy + 6.4} ${hx + .8} ${hy + 6} Q${hx - 1.6} ${hy + 6.4} ${hx - 4.6} ${hy + 6}Z" class="f-bart ln"/>`;
/* Neue Bärte für Hinnerk (v5.82, VARIANTEN): Schifferkrause (Kinnbart ohne Schnauz), Walross (großer Schnauzer über dem Mund, Stoppeln),
   Wolkenbart (rund und flauschig), kurz gestutzt (kurzer Bart mit Schnauz und Koteletten), Zwirbelbart (gezwirbelter Schnauz mit Kinnbärtchen) */
const BAERTE_NEU = ['krause', 'walross', 'rausche', 'gestutzt', 'zwirbel'];
const pf = (pts, cls = 'f-bart ln', extra = '') => `<path d="${pts}" class="${cls}"${extra}/>`;
function bartSeite(f, o, hx, hy, mundL) {
  const b = f.bart, X = v => r1(hx + v), Y = v => r1(hy + v);
  const mundZu = (mx, my) => mundL || `<path d="M${r1(mx - 2)} ${r1(my)} Q${r1(mx)} ${r1(my + .9)} ${r1(mx + 1.6)} ${r1(my - .2)}" class="det" style="opacity:1"/>`;
  if (b === 'krause') return pf(`M${X(-4.2)} ${Y(-.6)} Q${X(-5.8)} ${Y(10.4)} ${X(.6)} ${Y(14.6)} Q${X(6.4)} ${Y(17.4)} ${X(10.8)} ${Y(12.4)} Q${X(11.8)} ${Y(10.6)} ${X(10.2)} ${Y(9.4)} Q${X(7.4)} ${Y(10.6)} ${X(4.4)} ${Y(9.8)} Q${X(-.8)} ${Y(8.2)} ${X(-2.2)} ${Y(2.4)} Q${X(-2.4)} ${Y(.6)} ${X(-2.6)} ${Y(-.6)}Z`)
    + `<path d="M${X(1.6)} ${Y(11.6)} q1 2.4 3 3.2 M${X(6.6)} ${Y(12.2)} q.6 1.8 2.2 2.4 M${X(-2.6)} ${Y(7)} q.4 2.4 2 3.6" class="det"/>`;
  if (b === 'walross') { const mx = hx + 8.2, my = hy + 8.6;
    return pf(`M${X(-2.6)} ${Y(3)} Q${X(-2.4)} ${Y(10.6)} ${X(3)} ${Y(11)} Q${X(9.6)} ${Y(10.6)} ${X(10.6)} ${Y(4.6)} Q${X(9)} ${Y(8.4)} ${X(6.4)} ${Y(8.4)} Q${X(2)} ${Y(8.4)} ${X(-2.6)} ${Y(3)}Z`, 'f-bart', ' opacity=".45"')
      + mundG(o, f, mx, my, mundZu(mx, my), 'seite')
      + pf(`M${X(7.8)} ${Y(3.2)} Q${X(12.8)} ${Y(2.6)} ${X(13.6)} ${Y(6.2)} Q${X(14)} ${Y(10)} ${X(11.2)} ${Y(11.2)} Q${X(11.4)} ${Y(8.6)} ${X(9.4)} ${Y(8)} Q${X(7)} ${Y(7.6)} ${X(4.8)} ${Y(6.8)} Q${X(4.6)} ${Y(4.2)} ${X(7.8)} ${Y(3.2)}Z`)
      + `<path d="M${X(8.6)} ${Y(4.4)} q2.6 .6 3.4 3.4 M${X(6.6)} ${Y(5.2)} q1.6 .8 2 2.2" class="det"/>`; }
  if (b === 'rausche') { const mx = hx + 8, my = hy + 8.6;
    return pf(`M${X(-4.6)} ${Y(.2)} Q${X(-7.6)} ${Y(12.4)} ${X(-1.4)} ${Y(18.4)} Q${X(4.2)} ${Y(22.4)} ${X(10.2)} ${Y(18.8)} Q${X(15.6)} ${Y(15)} ${X(14)} ${Y(7.4)} Q${X(13)} ${Y(4.2)} ${X(10.4)} ${Y(5.2)} Q${X(7.6)} ${Y(6.8)} ${X(5.4)} ${Y(5.4)} Q${X(.8)} ${Y(4.4)} ${X(-4.6)} ${Y(.2)}Z`)
      + `<path d="M${X(1)} ${Y(10)} q1.4 3 3.6 3.6 M${X(7)} ${Y(11.4)} q1 2.6 3 3 M${X(2)} ${Y(16)} q2 1.4 4 .8 M${X(9.6)} ${Y(15.4)} q1.6 -.4 2.6 -2 M${X(-3.4)} ${Y(9)} q.6 2.6 2.4 4" class="det"/>`
      + mundG(o, f, mx, my, `<path d="M${r1(mx - 1.8)} ${r1(my)} Q${r1(mx)} ${r1(my + 1)} ${r1(mx + 1.8)} ${r1(my - .2)}" class="det" style="opacity:1"/>`, 'seite'); }
  if (b === 'gestutzt') return pf(`M${X(-5.4)} ${Y(-4.4)} Q${X(-5.6)} ${Y(1)} ${X(-2.6)} ${Y(3.4)} L${X(-1.6)} ${Y(2)} Q${X(-3.6)} ${Y(0)} ${X(-3.4)} ${Y(-4.6)}Z`)
    + pf(`M${X(-2.6)} ${Y(3)} Q${X(-2.4)} ${Y(10.6)} ${X(3)} ${Y(11)} Q${X(9.6)} ${Y(10.6)} ${X(10.6)} ${Y(4.6)} Q${X(9)} ${Y(8.4)} ${X(6.4)} ${Y(8.4)} Q${X(2)} ${Y(8.4)} ${X(-2.6)} ${Y(3)}Z`) + schnauz('seite', hx, hy);
  if (b === 'zwirbel') return pf(`M${X(5.4)} ${Y(8.8)} Q${X(5.8)} ${Y(14.8)} ${X(8.6)} ${Y(15.4)} Q${X(10.8)} ${Y(13.4)} ${X(9.8)} ${Y(8.6)} Q${X(7.6)} ${Y(9.6)} ${X(5.4)} ${Y(8.8)}Z`)
    + pf(`M${X(7.2)} ${Y(4.2)} Q${X(10.6)} ${Y(3.4)} ${X(12.6)} ${Y(4.8)} Q${X(14.6)} ${Y(6)} ${X(16)} ${Y(4.4)} Q${X(16.8)} ${Y(3.2)} ${X(15.8)} ${Y(2.4)} Q${X(16.2)} ${Y(3.8)} ${X(15)} ${Y(4.4)} Q${X(13.6)} ${Y(5.2)} ${X(12.4)} ${Y(6.2)} Q${X(9.6)} ${Y(6.8)} ${X(7.2)} ${Y(5.8)}Z`);
  return '';
}
function bartVorn(f, o, hx, hy, mund, mundL) {
  const b = f.bart, X = v => r1(hx + v), Y = v => r1(hy + v);
  const nase = f.nase === 'knolle' ? `<circle cx="${X(1.2)}" cy="${Y(2.4)}" r="3.6" class="f-haut ln"/><circle cx="${X(1.6)}" cy="${Y(2.8)}" r="2" class="wange"/>` : '';
  const kurz = (extra = '') => pf(`M${X(-8.4)} ${Y(2)} Q${X(-8)} ${Y(11)} ${X(0)} ${Y(11.6)} Q${X(8)} ${Y(11)} ${X(8.4)} ${Y(2)} Q${X(6)} ${Y(8.4)} ${X(0)} ${Y(8.4)} Q${X(-6)} ${Y(8.4)} ${X(-8.4)} ${Y(2)}Z`, extra ? 'f-bart' : 'f-bart ln', extra);
  if (b === 'krause') return mund + pf(`M${X(-9.4)} ${Y(-1.6)} Q${X(-11.2)} ${Y(12.4)} ${X(0)} ${Y(16.4)} Q${X(11.2)} ${Y(12.4)} ${X(9.4)} ${Y(-1.6)} Q${X(8.6)} ${Y(5.4)} ${X(5.8)} ${Y(9.4)} Q${X(.4)} ${Y(11.8)} ${X(-5.4)} ${Y(9.4)} Q${X(-8.6)} ${Y(5.4)} ${X(-9.4)} ${Y(-1.6)}Z`)
    + `<path d="M${X(-4)} ${Y(12)} q1 2.2 3 2.8 M${X(4)} ${Y(12)} q-1 2.2 -3 2.8 M${X(-8)} ${Y(6)} q0 2.6 1.6 4 M${X(8)} ${Y(6)} q0 2.6 -1.6 4" class="det"/>`;
  if (b === 'walross') { const mx = hx + .8, my = hy + 8.6, zu = mundL || `<path d="M${r1(mx - 2.2)} ${r1(my - .2)} Q${r1(mx)} ${r1(my + 1.1)} ${r1(mx + 2.2)} ${r1(my - .2)}" class="det" style="opacity:1"/>`;
    return kurz(' opacity=".45"') + mundG(o, f, mx, my, zu, 'vorn')
      + pf(`M${X(.8)} ${Y(3.8)} Q${X(-3.4)} ${Y(2.8)} ${X(-7)} ${Y(5.4)} Q${X(-9)} ${Y(9)} ${X(-7.2)} ${Y(11.6)} Q${X(-6.2)} ${Y(8.8)} ${X(-3.4)} ${Y(8.4)} Q${X(-1)} ${Y(8.2)} ${X(.8)} ${Y(7)} Q${X(2.6)} ${Y(8.2)} ${X(5)} ${Y(8.4)} Q${X(7.8)} ${Y(8.8)} ${X(8.8)} ${Y(11.6)} Q${X(10.6)} ${Y(9)} ${X(8.6)} ${Y(5.4)} Q${X(5)} ${Y(2.8)} ${X(.8)} ${Y(3.8)}Z`)
      + `<path d="M${X(-1.4)} ${Y(4.6)} q-2.6 .6 -4 3 M${X(3)} ${Y(4.6)} q2.6 .6 4 3" class="det"/>` + nase; }
  if (b === 'rausche') return pf(`M${X(-9.8)} ${Y(-1)} Q${X(-13)} ${Y(14.6)} ${X(0)} ${Y(20.4)} Q${X(13)} ${Y(14.6)} ${X(9.8)} ${Y(-1)} Q${X(7.4)} ${Y(5.6)} ${X(4)} ${Y(5)} Q${X(.8)} ${Y(3.6)} ${X(-2.4)} ${Y(5)} Q${X(-7.4)} ${Y(5.6)} ${X(-9.8)} ${Y(-1)}Z`)
    + `<path d="M${X(-5)} ${Y(10)} q.6 3 3 4.2 M${X(5)} ${Y(10)} q-.6 3 -3 4.2 M${X(-1.6)} ${Y(16.6)} q1.6 1.2 3.4 0 M${X(-9)} ${Y(5)} q-.4 3.4 1.4 5.6 M${X(9)} ${Y(5)} q.4 3.4 -1.4 5.6" class="det"/>` + mund + nase;
  if (b === 'gestutzt') return kurz() + mund + schnauz('vorn', hx, hy)
    + [-1, 1].map(sd => pf(`M${X(sd * 9.2)} ${Y(-5)} Q${X(sd * 9.6)} ${Y(1)} ${X(sd * 8.2)} ${Y(3.6)} L${X(sd * 7.2)} ${Y(2.6)} Q${X(sd * 8)} ${Y(0)} ${X(sd * 7.8)} ${Y(-5)}Z`)).join('');
  if (b === 'zwirbel') { const c = hx + .8, sw = sd => pf(`M${r1(c)} ${Y(4.2)} Q${r1(c + sd * 3.2)} ${Y(3.6)} ${r1(c + sd * 5.8)} ${Y(5)} Q${r1(c + sd * 7.8)} ${Y(6.2)} ${r1(c + sd * 9)} ${Y(4.4)} Q${r1(c + sd * 9.6)} ${Y(3)} ${r1(c + sd * 8.6)} ${Y(2.4)} Q${r1(c + sd * 9)} ${Y(3.8)} ${r1(c + sd * 8)} ${Y(4.4)} Q${r1(c + sd * 6.6)} ${Y(5.8)} ${r1(c + sd * 4.8)} ${Y(6.4)} Q${r1(c + sd * 2.2)} ${Y(6.8)} ${r1(c)} ${Y(5.8)}Z`);
    return mund + pf(`M${X(-1.6)} ${Y(8.8)} Q${X(-1.6)} ${Y(14)} ${X(.8)} ${Y(14.8)} Q${X(3.2)} ${Y(14)} ${X(3.2)} ${Y(8.8)} Q${X(.8)} ${Y(9.8)} ${X(-1.6)} ${Y(8.8)}Z`) + sw(-1) + sw(1); }
  return mund;
}
function kopfSeite(id, f, k, o, hx, hy) {
  const L = laune(o);
  let s = '';
  /* Haar hinten und Zopf (unter dem Kopf) */
  if (id === 'smilla' && k.haar === 'zopf') s += `<g${dreh(o, 'zopf', f.wer, hx - 7, hy - 2)}><path d="M${hx - 7} ${hy - 3} Q${hx - 15} ${hy + 4} ${hx - 13} ${hy + 18} Q${hx - 10} ${hy + 24} ${hx - 11} ${hy + 30} Q${hx - 6} ${hy + 22} ${hx - 8} ${hy + 14} Q${hx - 9} ${hy + 6} ${hx - 4} ${hy - 1}Z" class="f-haar ln"/>
    ${[8, 14, 20].map(dy => `<path d="M${hx - 13.5} ${hy + dy} Q${hx - 11} ${hy + dy + 2} ${hx - 9} ${hy + dy}" class="det"/>`).join('')}<circle cx="${hx - 11}" cy="${hy + 26}" r="1.6" class="f-hut ln"/></g>`;
  if (id === 'smilla' && k.haar === 'dutt') s += `<circle cx="${hx - 7}" cy="${hy - 9}" r="5.2" class="f-haar ln"/><path d="M${hx - 10} ${hy - 9} Q${hx - 7} ${hy - 13} ${hx - 4} ${hy - 9}" class="det"/>`;
  if (id === 'hilke') s += `<circle cx="${hx - 8}" cy="${hy - 6}" r="4.8" class="f-haar ln"/>`;
  s += haarHinten(f, 'seite', hx, hy);
  /* Kopf */
  s += `<path d="M${hx - 8.6} ${hy - 1} Q${hx - 9} ${hy - 10.6} ${hx + .5} ${hy - 10.8} Q${hx + 9.4} ${hy - 10.4} ${hx + 9.4} ${hy - 1.5} Q${hx + 9.6} ${hy + 8.6} ${hx + 2.5} ${hy + 10} Q${hx - 6.4} ${hy + 10.4} ${hx - 8.6} ${hy - 1}Z" class="f-haut ln"/>`;
  s += `<path d="M${hx - 8.2} ${hy + 1} Q${hx - 7} ${hy + 9} ${hx} ${hy + 9.8} Q${hx - 5} ${hy + 6} ${hx - 8.2} ${hy + 1}Z" class="sch"/>`;
  /* Ohr */
  s += `<path d="M${hx - 3.6} ${hy - 2.8} Q${hx - 6.4} ${hy - 3} ${hx - 6.2} ${hy + .6} Q${hx - 6} ${hy + 3.8} ${hx - 3.2} ${hy + 3.2}" class="f-haut ln"/><path d="M${hx - 4.4} ${hy - 1} Q${hx - 5.2} ${hy + .4} ${hx - 4.2} ${hy + 1.6}" class="det"/>`;
  /* Wange, Sommersprossen */
  s += `<circle cx="${hx + 4.6}" cy="${hy + 3.2}" r="${r1(2.6 * (o._t || TYPEN.klassisch).wange)}" class="wange"/>`;
  if (f.sommersprossen) s += [[3.4, 1.6], [5.4, 1.2], [4.6, 2.8], [6.4, 2.4]].map(([a, b]) => `<circle cx="${hx + a}" cy="${hy + b}" r=".45" class="tinte" opacity=".6"/>`).join('');
  /* Auge und Braue */
  const ay = hy - 2.2, ax = hx + 5.4;
  const braue = {normal: 0, froh: -1, lacht: -1.4, genervt: 3, staunt: -2, besorgt: -2.5, skeptisch: 1.5}[L] || 0;
  s += `<g class="auge"${dreh(o, 'blink', f.wer, ax, ay)}>${L === 'lacht' ? `<path d="M${ax - 1.6} ${ay + .4} Q${ax} ${ay - 1.6} ${ax + 1.6} ${ay + .4}" class="det" style="opacity:1"/>` : augeSvg(ax, ay, o, L === 'staunt', 1.15, 1.4)}</g>`;
  s += `<path d="M${ax - 2.6} ${ay - 3 + (braue > 0 ? 0 : braue * .3)} Q${ax} ${ay - 4.2 + braue * .2} ${ax + 2.6} ${ay - 3.2 + braue * .6}" class="det" style="opacity:1;stroke-width:calc(var(--strich) * ${id === 'hinnerk' ? 1.4 : .9})${id === 'hinnerk' ? ';stroke:var(--bart)' : ''}"/>`;
  if (f.brille) s += `<circle cx="${ax + .4}" cy="${ay}" r="2.9" fill="#fff" fill-opacity=".18" class="det" style="opacity:1"/><path d="M${ax - 2.5} ${ay - .6} L${hx - 3.4} ${hy - 2.4}" class="det" style="opacity:1"/>`;
  /* Nase */
  const N = {knolle: `<path d="M${hx + 8.6} ${hy - 1.8} Q${hx + 13.6} ${hy - 1.6} ${hx + 13} ${hy + 2.6} Q${hx + 12.2} ${hy + 5} ${hx + 9} ${hy + 3.8}" class="f-haut ln"/><circle cx="${hx + 11.2}" cy="${hy + 1.6}" r="1.8" class="wange"/>`,
    stups: `<path d="M${hx + 9} ${hy - 1} Q${hx + 11.4} ${hy + 1.2} ${hx + 10.6} ${hy + 2.4} Q${hx + 9.8} ${hy + 3} ${hx + 9} ${hy + 2.6}" class="f-haut ln"/>`,
    gerade: `<path d="M${hx + 9} ${hy - 3} L${hx + 11.6} ${hy + 2.2} Q${hx + 11} ${hy + 3.4} ${hx + 9.2} ${hy + 3.2}" class="f-haut ln"/>`,
    lang: `<path d="M${hx + 8.8} ${hy - 3.4} Q${hx + 13.8} ${hy + 2.2} ${hx + 13.6} ${hy + 3.6} Q${hx + 12.6} ${hy + 4.6} ${hx + 9.2} ${hy + 3.8}" class="f-haut ln"/>`}[f.nase] || '';
  s += N;
  /* Mund (beim Sprechen geht er auf: data-dreh „mund“) */
  const mx = hx + 6.8, my = hy + 6.2;
  const MUND = {froh: `<path d="M${mx - 2.4} ${my - .6} Q${mx} ${my + 1.8} ${mx + 1.8} ${my - 1}" class="det" style="opacity:1"/>`, lacht: `<path d="M${mx - 2.4} ${my - .8} Q${mx} ${my + 3} ${mx + 2} ${my - 1}Z" fill="#7a2e22" class="det" style="opacity:1"/>`,
    genervt: `<path d="M${mx - 2.2} ${my + .2} L${mx + 1.6} ${my - .2}" class="det" style="opacity:1"/>`, staunt: `<ellipse cx="${mx}" cy="${my + .3}" rx="1.1" ry="1.5" fill="#7a2e22"/>`};
  if (!f.bart || ['kurz', 'schnauz', 'krause', 'gestutzt', 'zwirbel'].includes(f.bart)) s += mundG(o, f, mx, my, (MUND[L] || `<path d="M${mx - 2} ${my} Q${mx} ${my + .9} ${mx + 1.6} ${my - .2}" class="det" style="opacity:1"/>`) + (id === 'smilla' ? `<path d="M${mx - 1.8} ${my + .5} Q${mx} ${my + 1.8} ${mx + 1.4} ${my + .3}" stroke="#c4605a" stroke-width="1.1" fill="none" stroke-linecap="round"/>` : ''), 'seite');
  /* Bart */
  if (f.bart === 'voll') s += `<path d="M${hx - 3.8} ${hy + 1.6} Q${hx - 4.4} ${hy + 13} ${hx + 3} ${hy + 14.4} Q${hx + 11.6} ${hy + 13.6} ${hx + 12} ${hy + 4.4} Q${hx + 8.6} ${hy + 6.6} ${hx + 5.6} ${hy + 5} Q${hx + 1} ${hy + 4.4} ${hx - 3.8} ${hy + 1.6}Z" class="f-bart ln"/>
    <path d="M${hx} ${hy + 8} Q${hx + 1} ${hy + 11} ${hx + 3} ${hy + 12} M${hx + 6} ${hy + 8.6} Q${hx + 7} ${hy + 11} ${hx + 8} ${hy + 11.4}" class="det"/>${mundG(o, f, hx + 7.4, hy + 7.6, `<path d="M${hx + 5.6} ${hy + 7.6} Q${hx + 7.4} ${hy + 8.6} ${hx + 9.4} ${hy + 7.4}" class="det" style="opacity:1"/>`, 'seite')}`;
  if (f.bart === 'kurz') s += `<path d="M${hx - 2.6} ${hy + 3} Q${hx - 2.4} ${hy + 10.6} ${hx + 3} ${hy + 11} Q${hx + 9.6} ${hy + 10.6} ${hx + 10.6} ${hy + 4.6} Q${hx + 9} ${hy + 8.4} ${hx + 6.4} ${hy + 8.4} Q${hx + 2} ${hy + 8.4} ${hx - 2.6} ${hy + 3}Z" class="f-bart ln"/>`;
  if (f.bart === 'schnauz') s += schnauz('seite', hx, hy);
  s += bartSeite(f, o, hx, hy, MUND[L]);
  /* Smilla (v5.78, Nutzer: „etwas attraktiver“, jugendfrei): Wimpern, Lippen, eine lose Strähne */
  if (id === 'smilla') s += `<path d="M${ax + 1} ${ay - 1.3} l1.7 -1.1 M${ax + 1.5} ${ay - .3} l1.9 -.5" class="det" style="opacity:1"/><path d="M${hx - 1} ${hy - 8} Q${hx - 4.6} ${hy - 1} ${hx - 2.6} ${hy + 6}" class="s-haar" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  /* Haar vorn und oben */
  if (f.haar === 'kranz') s += `<path d="M${hx - 8.8} ${hy - 4} Q${hx - 10.6} ${hy + 1} ${hx - 7.6} ${hy + 4.6} Q${hx - 6.8} ${hy} ${hx - 5.4} ${hy - 4.6}Z" class="f-haar ln"/>`;
  if (f.haar === 'grau') s += `<path d="M${hx - 8.8} ${hy - 2} Q${hx - 9.6} ${hy + 2} ${hx - 7.6} ${hy + 4} Q${hx - 7} ${hy - 1} ${hx - 5.6} ${hy - 4}Z" class="f-haar ln"/>`;
  if (id === 'smilla') s += k.haar === 'kurz'
    ? `<path d="M${hx - 9.2} ${hy + 4} Q${hx - 11} ${hy - 11} ${hx + 1} ${hy - 11.6} Q${hx + 9.6} ${hy - 11} ${hx + 9.8} ${hy - 4} Q${hx + 5} ${hy - 7.4} ${hx + 1} ${hy - 6} Q${hx - 3.4} ${hy - 4} ${hx - 5.6} ${hy + 3}Z" class="f-haar ln"/>`
    : `<path d="M${hx - 8.6} ${hy + 1.6} Q${hx - 10} ${hy - 11} ${hx + 1} ${hy - 11.4} Q${hx + 9.4} ${hy - 11} ${hx + 9.6} ${hy - 4.6} Q${hx + 6} ${hy - 7.8} ${hx + 2} ${hy - 7} Q${hx - 3} ${hy - 6.4} ${hx - 5.4} ${hy - 2}Z" class="f-haar ln"/><path d="M${hx - 3} ${hy - 9} Q${hx + 1} ${hy - 10.4} ${hx + 5} ${hy - 9.2}" class="det"/>`;
  if (id === 'hilke') s += `<path d="M${hx - 8.8} ${hy + 1} Q${hx - 10} ${hy - 11.4} ${hx + 1} ${hy - 11.4} Q${hx + 9.6} ${hy - 11} ${hx + 9.8} ${hy - 4} Q${hx + 4} ${hy - 8.6} ${hx - 1} ${hy - 7.4} Q${hx - 5.4} ${hy - 5} ${hx - 6} ${hy + 1}Z" class="f-haar ln"/>`;
  s += haarVorn(f, 'seite', hx, hy);
  if (f.frisur || ['hafenmeister', 'schleuse'].includes(id)) s += hutGen(k.hut, 'seite', hx, hy);
  /* Hüte */
  if (id === 'hinnerk') {
    if (k.hut === 'elbsegler') s += `<path d="M${hx - 10} ${hy - 4.6} Q${hx - 9.8} ${hy - 15.4} ${hx + .6} ${hy - 15.6} Q${hx + 10.4} ${hy - 15} ${hx + 10.2} ${hy - 5.6} Z" class="f-hut ln"/><path d="M${hx - 10} ${hy - 7.4} Q${hx} ${hy - 8.4} ${hx + 10.2} ${hy - 7.6} L${hx + 10.2} ${hy - 5.6} Q${hx} ${hy - 6.2} ${hx - 10} ${hy - 4.6}Z" class="tinte" opacity=".7"/>
      <path d="M${hx + 4.6} ${hy - 6} Q${hx + 12} ${hy - 7.2} ${hx + 16} ${hy - 4.4} Q${hx + 11} ${hy - 3} ${hx + 4.6} ${hy - 4}Z" class="tinte"/><circle cx="${hx + 7}" cy="${hy - 10.4}" r="1.4" class="f-akzent"/><path d="M${hx - 6} ${hy - 12} Q${hx} ${hy - 14} ${hx + 6} ${hy - 12.6}" class="hl"/>`;
    if (k.hut === 'fischer') s += `<path d="M${hx - 9.8} ${hy - 4} Q${hx - 10.6} ${hy - 17} ${hx} ${hy - 17.2} Q${hx + 10.6} ${hy - 17} ${hx + 10.2} ${hy - 4.6}Z" fill="#b8402f" class="ln"/><path d="M${hx - 10.4} ${hy - 8.4} H${hx + 10.6} V${hy - 4} H${hx - 10.4}Z" fill="#9c3426" class="ln"/>${[-6, -2, 2, 6].map(x => `<path d="M${hx + x} ${hy - 8} V${hy - 4.4}" class="det"/>`).join('')}`;
    if (k.hut === 'suedwester') s += `<path d="M${hx - 8} ${hy - 6} Q${hx - 7} ${hy - 16} ${hx + 1} ${hy - 16} Q${hx + 9} ${hy - 16} ${hx + 9} ${hy - 6}Z" fill="#e7b730" class="ln"/><path d="M${hx + 13} ${hy - 6} Q${hx} ${hy - 9} ${hx - 13} ${hy - 4} Q${hx - 16} ${hy + 3} ${hx - 13} ${hy + 4} Q${hx - 10} ${hy - 1} ${hx - 2} ${hy - 4} Q${hx + 6} ${hy - 6} ${hx + 13} ${hy - 6}Z" fill="#e7b730" class="ln"/>`;
  }
  if (id === 'smilla' && k.jacke !== 'ringel') s += `<path d="M${hx - 9.4} ${hy - 6} Q${hx - 9} ${hy - 14.6} ${hx + .4} ${hy - 14.8} Q${hx + 9.6} ${hy - 14.4} ${hx + 9.4} ${hy - 6.4} Q${hx} ${hy - 9} ${hx - 9.4} ${hy - 6}Z" class="f-hut ln"/><circle cx="${hx - 1}" cy="${hy - 16}" r="2.6" class="f-akzent ln"/>`;
  if (id === 'harms' && k.hut === 'kapitaen') s += `<path d="M${hx - 10.4} ${hy - 7.6} Q${hx - 12} ${hy - 16.4} ${hx + 1} ${hy - 16.6} Q${hx + 13} ${hy - 16.2} ${hx + 11.6} ${hy - 8.4}Z" class="f-hut ln"/><path d="M${hx - 9} ${hy - 8.4} H${hx + 10.4} V${hy - 5} H${hx - 9}Z" class="tinte"/>
    <path d="M${hx + 4} ${hy - 5.4} Q${hx + 12} ${hy - 6} ${hx + 15.4} ${hy - 3.4} Q${hx + 10} ${hy - 2.4} ${hx + 4} ${hy - 3.4}Z" class="tinte"/><circle cx="${hx + 6.4}" cy="${hy - 10.6}" r="1.8" class="f-akzent ln"/>`;
  return `<g class="kopfg"${dreh(o, 'kopf', f.wer, hx - 1, hy + 9)}>${s}</g>`;
}
/* Kopf von vorn (leicht nach rechts gedreht) */
function kopfVorn(id, f, k, o, hx, hy) {
  const L = laune(o);
  let s = '';
  if (id === 'smilla' && k.haar === 'zopf') s += `<g${dreh(o, 'zopf', f.wer, hx - 8, hy)}><path d="M${hx - 8} ${hy - 2} Q${hx - 15} ${hy + 6} ${hx - 13} ${hy + 20} Q${hx - 11} ${hy + 25} ${hx - 12} ${hy + 30} Q${hx - 7} ${hy + 22} ${hx - 9} ${hy + 12}Z" class="f-haar ln"/><circle cx="${hx - 12}" cy="${hy + 27}" r="1.6" class="f-hut ln"/></g>`;
  if (id === 'smilla' && k.haar === 'dutt') s += `<circle cx="${hx}" cy="${hy - 13}" r="5" class="f-haar ln"/>`;
  if (id === 'hilke') s += `<circle cx="${hx - 2}" cy="${hy - 12}" r="4.6" class="f-haar ln"/>`;
  s += haarHinten(f, 'vorn', hx, hy);
  s += [-1, 1].map(sd => `<path d="M${hx + sd * 8.4} ${hy - 2.4} Q${hx + sd * 11.4} ${hy - 2.6} ${hx + sd * 11} ${hy + 1} Q${hx + sd * 10.6} ${hy + 4} ${hx + sd * 8} ${hy + 3.4}" class="f-haut ln"/>`).join('');
  s += `<path d="M${hx - 9} ${hy - 1} Q${hx - 9.4} ${hy - 11} ${hx} ${hy - 11.2} Q${hx + 9.4} ${hy - 11} ${hx + 9} ${hy - 1} Q${hx + 9} ${hy + 9.4} ${hx} ${hy + 10.4} Q${hx - 9} ${hy + 9.4} ${hx - 9} ${hy - 1}Z" class="f-haut ln"/>`;
  s += `<path d="M${hx - 8.6} ${hy + 1} Q${hx - 7.6} ${hy + 8.6} ${hx - 1} ${hy + 10} Q${hx - 6} ${hy + 6} ${hx - 8.6} ${hy + 1}Z" class="sch"/>`;
  { const wr = r1(2.4 * (o._t || TYPEN.klassisch).wange); s += `<circle cx="${hx - 5}" cy="${hy + 3}" r="${wr}" class="wange"/><circle cx="${hx + 5.4}" cy="${hy + 3}" r="${wr}" class="wange"/>`; }
  if (f.sommersprossen) s += [[-6, 1.4], [-4.4, 2.2], [4.6, 1.6], [6.2, 2.2], [5.2, .8]].map(([a, b]) => `<circle cx="${hx + a}" cy="${hy + b}" r=".45" class="tinte" opacity=".6"/>`).join('');
  const ay = hy - 2;
  const braue = {froh: -1, lacht: -1.4, genervt: 3, staunt: -2, besorgt: -2.5}[L] || 0;
  s += [-1, 1].map(sd => { const ax = hx + sd * 3.8 + .6; return `<g class="auge"${dreh(o, 'blink', f.wer, ax, ay)}>${L === 'lacht' ? `<path d="M${ax - 1.5} ${ay + .4} Q${ax} ${ay - 1.6} ${ax + 1.5} ${ay + .4}" class="det" style="opacity:1"/>` : augeSvg(ax, ay, o, L === 'staunt', 1.1, 1.35)}</g>
    <path d="M${ax - 2.3} ${ay - 3 - (sd < 0 ? braue * .3 : 0)} Q${ax} ${ay - 4} ${ax + 2.3} ${ay - 3 - (sd > 0 ? braue * .3 : 0) + (braue > 0 ? sd * -1.2 : 0)}" class="det" style="opacity:1;stroke-width:calc(var(--strich) * ${id === 'hinnerk' ? 1.4 : .9})${id === 'hinnerk' ? ';stroke:var(--bart)' : ''}"/>`; }).join('');
  if (f.brille) s += [-1, 1].map(sd => `<circle cx="${hx + sd * 3.8 + .6}" cy="${ay}" r="2.8" fill="#fff" fill-opacity=".18" class="det" style="opacity:1"/>`).join('') + `<path d="M${hx - .6} ${ay} H${hx + 1.8}" class="det" style="opacity:1"/>`;
  s += {knolle: `<circle cx="${hx + 1.2}" cy="${hy + 2.4}" r="3.6" class="f-haut ln"/><circle cx="${hx + 1.6}" cy="${hy + 2.8}" r="2" class="wange"/>`, stups: `<path d="M${hx + .2} ${hy + .6} Q${hx + 2.6} ${hy + 3.2} ${hx + .4} ${hy + 3.6}" class="det" style="opacity:1"/>`,
    gerade: `<path d="M${hx + .8} ${hy - 1} L${hx + 2} ${hy + 3} L${hx} ${hy + 3.4}" class="det" style="opacity:1"/>`, lang: `<path d="M${hx + .6} ${hy - 2} Q${hx + 3.6} ${hy + 3} ${hx + 2.6} ${hy + 4.4} Q${hx + 1} ${hy + 4.8} ${hx - .4} ${hy + 4}" class="f-haut ln"/>`}[f.nase] || '';
  const mx = hx + .8, my = hy + 6.4;
  const MUND = {froh: `<path d="M${mx - 2.6} ${my - .6} Q${mx} ${my + 2} ${mx + 2.6} ${my - .6}" class="det" style="opacity:1"/>`, lacht: `<path d="M${mx - 2.8} ${my - .8} Q${mx} ${my + 3.4} ${mx + 2.8} ${my - .8}Z" fill="#7a2e22" class="det" style="opacity:1"/>`,
    genervt: `<path d="M${mx - 2.4} ${my} H${mx + 2.4}" class="det" style="opacity:1"/>`, staunt: `<ellipse cx="${mx}" cy="${my + .3}" rx="1.3" ry="1.7" fill="#7a2e22"/>`};
  const mund = mundG(o, f, mx, my, (MUND[L] || `<path d="M${mx - 2.2} ${my - .2} Q${mx} ${my + 1.1} ${mx + 2.2} ${my - .2}" class="det" style="opacity:1"/>`) + (id === 'smilla' ? `<path d="M${mx - 1.8} ${my + .6} Q${mx} ${my + 1.9} ${mx + 1.8} ${my + .6}" stroke="#c4605a" stroke-width="1.1" fill="none" stroke-linecap="round"/>` : ''), 'vorn');
  if (f.bart === 'voll') s += `<path d="M${hx - 9} ${hy + 1} Q${hx - 9} ${hy + 14} ${hx} ${hy + 15.6} Q${hx + 9} ${hy + 14} ${hx + 9} ${hy + 1} Q${hx + 6} ${hy + 6.4} ${hx + 3} ${hy + 5.4} Q${hx} ${hy + 4.2} ${hx - 3} ${hy + 5.4} Q${hx - 6} ${hy + 6.4} ${hx - 9} ${hy + 1}Z" class="f-bart ln"/>
    <path d="M${hx - 4} ${hy + 9} Q${hx - 3} ${hy + 12} ${hx - 1} ${hy + 13} M${hx + 4} ${hy + 9} Q${hx + 3} ${hy + 12} ${hx + 1} ${hy + 13}" class="det"/>` + mund + `<circle cx="${hx + 1.2}" cy="${hy + 2.4}" r="3.6" class="f-haut ln"/><circle cx="${hx + 1.6}" cy="${hy + 2.8}" r="2" class="wange"/>`;
  else if (f.bart === 'kurz') s += `<path d="M${hx - 8.4} ${hy + 2} Q${hx - 8} ${hy + 11} ${hx} ${hy + 11.6} Q${hx + 8} ${hy + 11} ${hx + 8.4} ${hy + 2} Q${hx + 6} ${hy + 8.4} ${hx} ${hy + 8.4} Q${hx - 6} ${hy + 8.4} ${hx - 8.4} ${hy + 2}Z" class="f-bart ln"/>` + mund;
  else if (BAERTE_NEU.includes(f.bart)) s += bartVorn(f, o, hx, hy, mund, MUND[L]);
  else s += mund;
  if (f.bart === 'schnauz') s += schnauz('vorn', hx, hy);
  if (id === 'smilla') s += [-1, 1].map(sd => { const ax = hx + sd * 3.8 + .6; return `<path d="M${ax + sd * 1.3} ${ay - 1.2} l${sd * 1.4} -1.2 M${ax + sd * 1.8} ${ay - .2} l${sd * 1.6} -.6" class="det" style="opacity:1"/>`; }).join('') + `<path d="M${hx - 6} ${hy - 7} Q${hx - 10} ${hy - 1} ${hx - 8.4} ${hy + 6}" class="s-haar" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  if (f.haar === 'kranz') s += [-1, 1].map(sd => `<path d="M${hx + sd * 9.2} ${hy - 4} Q${hx + sd * 11} ${hy + 1} ${hx + sd * 9} ${hy + 4}" class="s-haar" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('');
  if (f.haar === 'grau') s += [-1, 1].map(sd => `<path d="M${hx + sd * 9} ${hy - 5} Q${hx + sd * 10.4} ${hy} ${hx + sd * 9} ${hy + 2}" class="s-haar" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('');
  if (id === 'smilla') s += k.haar === 'kurz'
    ? `<path d="M${hx - 10} ${hy + 5} Q${hx - 12} ${hy - 12.4} ${hx} ${hy - 12.4} Q${hx + 12} ${hy - 12.4} ${hx + 10} ${hy + 5} Q${hx + 8} ${hy - 4} ${hx + 3} ${hy - 6.4} Q${hx - 4} ${hy - 7} ${hx - 7} ${hy - 3} Q${hx - 9} ${hy} ${hx - 10} ${hy + 5}Z" class="f-haar ln"/>`
    : `<path d="M${hx - 9.6} ${hy + 2} Q${hx - 11} ${hy - 12} ${hx} ${hy - 12} Q${hx + 11} ${hy - 12} ${hx + 9.6} ${hy + 1} Q${hx + 8} ${hy - 6} ${hx + 2} ${hy - 6.6} Q${hx - 2} ${hy - 6.8} ${hx - 3.4} ${hy - 4.4} Q${hx - 6} ${hy - 6} ${hx - 9.6} ${hy + 2}Z" class="f-haar ln"/>`;
  if (id === 'hilke') s += `<path d="M${hx - 9.6} ${hy + 1} Q${hx - 11} ${hy - 12} ${hx} ${hy - 12} Q${hx + 11} ${hy - 12} ${hx + 9.6} ${hy + 1} Q${hx + 7} ${hy - 7} ${hx} ${hy - 7} Q${hx - 7} ${hy - 7} ${hx - 9.6} ${hy + 1}Z" class="f-haar ln"/>`;
  s += haarVorn(f, 'vorn', hx, hy);
  if (f.frisur || ['hafenmeister', 'schleuse'].includes(id)) s += hutGen(k.hut, 'vorn', hx, hy);
  if (id === 'hinnerk') {
    if (k.hut === 'elbsegler') s += `<path d="M${hx - 10.6} ${hy - 5} Q${hx - 11} ${hy - 16} ${hx} ${hy - 16.2} Q${hx + 11} ${hy - 16} ${hx + 10.6} ${hy - 5}Z" class="f-hut ln"/><path d="M${hx - 10.6} ${hy - 8} Q${hx} ${hy - 9} ${hx + 10.6} ${hy - 8} V${hy - 5} Q${hx} ${hy - 6} ${hx - 10.6} ${hy - 5}Z" class="tinte" opacity=".7"/><path d="M${hx - 9} ${hy - 5} Q${hx} ${hy - 1.6} ${hx + 9} ${hy - 5} Q${hx} ${hy - 3.6} ${hx - 9} ${hy - 5}Z" class="tinte"/><circle cx="${hx}" cy="${hy - 11.2}" r="1.6" class="f-akzent"/>`;
    if (k.hut === 'fischer') s += `<path d="M${hx - 10.6} ${hy - 4} Q${hx - 11} ${hy - 18} ${hx} ${hy - 18} Q${hx + 11} ${hy - 18} ${hx + 10.6} ${hy - 4}Z" fill="#b8402f" class="ln"/><path d="M${hx - 11} ${hy - 8.4} H${hx + 11} V${hy - 4} H${hx - 11}Z" fill="#9c3426" class="ln"/>`;
    if (k.hut === 'suedwester') s += `<path d="M${hx - 8.6} ${hy - 6} Q${hx - 8} ${hy - 16.4} ${hx} ${hy - 16.4} Q${hx + 8} ${hy - 16.4} ${hx + 8.6} ${hy - 6}Z" fill="#e7b730" class="ln"/><path d="M${hx - 15} ${hy - 4} Q${hx} ${hy - 9} ${hx + 15} ${hy - 4} Q${hx + 13} ${hy - 1} ${hx + 11} ${hy - 2} Q${hx} ${hy - 6} ${hx - 11} ${hy - 2} Q${hx - 13} ${hy - 1} ${hx - 15} ${hy - 4}Z" fill="#e7b730" class="ln"/>`;
  }
  if (id === 'smilla' && k.jacke !== 'ringel') s += `<path d="M${hx - 9.8} ${hy - 6.4} Q${hx - 10} ${hy - 15} ${hx} ${hy - 15.2} Q${hx + 10} ${hy - 15} ${hx + 9.8} ${hy - 6.4} Q${hx} ${hy - 9.4} ${hx - 9.8} ${hy - 6.4}Z" class="f-hut ln"/><circle cx="${hx}" cy="${hy - 16.4}" r="2.6" class="f-akzent ln"/>`;
  if (id === 'harms' && k.hut === 'kapitaen') s += `<path d="M${hx - 12} ${hy - 8} Q${hx - 13} ${hy - 17} ${hx} ${hy - 17.4} Q${hx + 13} ${hy - 17} ${hx + 12} ${hy - 8}Z" class="f-hut ln"/><path d="M${hx - 10} ${hy - 8.6} H${hx + 10} V${hy - 5} H${hx - 10}Z" class="tinte"/><path d="M${hx - 9} ${hy - 5} Q${hx} ${hy - 1.4} ${hx + 9} ${hy - 5}Z" class="tinte"/><circle cx="${hx}" cy="${hy - 11.4}" r="2" class="f-akzent ln"/>`;
  return `<g class="kopfg"${dreh(o, 'kopf', f.wer, hx, hy + 9)}>${s}</g>`;
}
function kopfRuecken(id, f, k, o, hx, hy) {
  let s = `<path d="M${hx - 9} ${hy - 1} Q${hx - 9.4} ${hy - 11} ${hx} ${hy - 11.2} Q${hx + 9.4} ${hy - 11} ${hx + 9} ${hy - 1} Q${hx + 9} ${hy + 9.4} ${hx} ${hy + 10.4} Q${hx - 9} ${hy + 9.4} ${hx - 9} ${hy - 1}Z" class="f-haut ln"/>`;
  s += [-1, 1].map(sd => `<path d="M${hx + sd * 8.4} ${hy - 2.4} Q${hx + sd * 11.2} ${hy - 2.4} ${hx + sd * 10.8} ${hy + 1} Q${hx + sd * 10.4} ${hy + 4} ${hx + sd * 8} ${hy + 3.4}" class="f-haut ln"/>`).join('');
  if (f.haar === 'kranz' || f.haar === 'grau') s += `<path d="M${hx - 8.8} ${hy - 4} Q${hx - 9.4} ${hy + 4} ${hx - 6} ${hy + 5} Q${hx} ${hy + 3} ${hx + 6} ${hy + 5} Q${hx + 9.4} ${hy + 4} ${hx + 8.8} ${hy - 4} Q${hx + 6} ${hy - 1} ${hx} ${hy - 1.4} Q${hx - 6} ${hy - 1} ${hx - 8.8} ${hy - 4}Z" class="f-haar ln"/><path d="M${hx - 5} ${hy + 1} Q${hx - 4} ${hy + 3} ${hx - 2} ${hy + 2.6} M${hx + 5} ${hy + 1} Q${hx + 4} ${hy + 3} ${hx + 2} ${hy + 2.6}" class="det"/>`;
  if (['voll', 'krause', 'rausche', 'gestutzt'].includes(f.bart)) { const b = f.bart === 'rausche' ? 1.35 : 1; s += [-1, 1].map(sd => `<path d="M${hx + sd * 8.6} ${hy + 3} Q${r1(hx + sd * 10 * b)} ${r1(hy + 9 * b)} ${r1(hx + sd * 6 * b)} ${r1(hy + 12 * b)}" class="s-bart" stroke-width="${r1(3 * b)}" fill="none" stroke-linecap="round"/>`).join(''); }
  if (id === 'smilla' || id === 'hilke') s += `<path d="M${hx - 9.6} ${hy + 4} Q${hx - 11} ${hy - 12} ${hx} ${hy - 12} Q${hx + 11} ${hy - 12} ${hx + 9.6} ${hy + 4} Q${hx} ${hy + 7} ${hx - 9.6} ${hy + 4}Z" class="f-haar ln"/>`;
  if (id === 'smilla' && k.haar === 'zopf') s += `<g${dreh(o, 'zopf', f.wer, hx, hy + 4)}><path d="M${hx - 3} ${hy + 4} Q${hx - 4} ${hy + 18} ${hx - 1} ${hy + 28} Q${hx + 3} ${hy + 18} ${hx + 3} ${hy + 4}Z" class="f-haar ln"/>${[10, 16, 22].map(dy => `<path d="M${hx - 3} ${hy + dy} Q${hx} ${hy + dy + 2} ${hx + 2.6} ${hy + dy}" class="det"/>`).join('')}</g>`;
  if (id === 'smilla' && k.haar === 'dutt') s += `<circle cx="${hx}" cy="${hy - 9}" r="5" class="f-haar ln"/>`;
  if (id === 'hilke') s += `<circle cx="${hx}" cy="${hy - 6}" r="5" class="f-haar ln"/>`;
  if (id === 'hinnerk' && k.hut === 'elbsegler') s += `<path d="M${hx - 10.6} ${hy - 5} Q${hx - 11} ${hy - 16} ${hx} ${hy - 16.2} Q${hx + 11} ${hy - 16} ${hx + 10.6} ${hy - 5}Z" class="f-hut ln"/><path d="M${hx - 10.6} ${hy - 8} Q${hx} ${hy - 9} ${hx + 10.6} ${hy - 8} V${hy - 5} Q${hx} ${hy - 6} ${hx - 10.6} ${hy - 5}Z" class="tinte" opacity=".7"/>`;
  if (id === 'hinnerk' && k.hut === 'fischer') s += `<path d="M${hx - 10.6} ${hy - 4} Q${hx - 11} ${hy - 18} ${hx} ${hy - 18} Q${hx + 11} ${hy - 18} ${hx + 10.6} ${hy - 4}Z" fill="#b8402f" class="ln"/><path d="M${hx - 11} ${hy - 8.4} H${hx + 11} V${hy - 4} H${hx - 11}Z" fill="#9c3426" class="ln"/>`;
  if (id === 'hinnerk' && k.hut === 'suedwester') s += `<path d="M${hx - 8.6} ${hy - 6} Q${hx - 8} ${hy - 16.4} ${hx} ${hy - 16.4} Q${hx + 8} ${hy - 16.4} ${hx + 8.6} ${hy - 6}Z" fill="#e7b730" class="ln"/><path d="M${hx - 14} ${hy - 3} Q${hx} ${hy - 7} ${hx + 14} ${hy - 3} Q${hx + 14} ${hy + 6} ${hx} ${hy + 7} Q${hx - 14} ${hy + 6} ${hx - 14} ${hy - 3}Z" fill="#e7b730" class="ln"/>`;
  if (id === 'smilla' && k.jacke !== 'ringel') s += `<path d="M${hx - 9.8} ${hy - 6.4} Q${hx - 10} ${hy - 15} ${hx} ${hy - 15.2} Q${hx + 10} ${hy - 15} ${hx + 9.8} ${hy - 6.4}Z" class="f-hut ln"/><circle cx="${hx}" cy="${hy - 16.4}" r="2.6" class="f-akzent ln"/>`;
  if (id === 'harms' && k.hut === 'kapitaen') s += `<path d="M${hx - 12} ${hy - 8} Q${hx - 13} ${hy - 17} ${hx} ${hy - 17.4} Q${hx + 13} ${hy - 17} ${hx + 12} ${hy - 8}Z" class="f-hut ln"/><path d="M${hx - 10} ${hy - 8.6} H${hx + 10} V${hy - 5} H${hx - 10}Z" class="tinte"/>`;
  s = haarHinten(f, 'ruecken', hx, hy) + s + haarVorn(f, 'ruecken', hx, hy);
  if (f.frisur || ['hafenmeister', 'schleuse'].includes(id)) s += hutGen(k.hut, 'ruecken', hx, hy);
  return `<g class="kopfg"${dreh(o, 'kopf', f.wer, hx, hy + 9)}>${s}</g>`;
}

/* Körper und Kopf getrennt skalieren (Körperbau): der Kopf wächst um den Hals, der Körper wird breiter oder niedriger; teil2 = alles, was vor dem Kopf liegt (vorderer Arm) */
function mitKopf(teil1, kopf, teil2, T, hx, hy) {
  if (T.bw === 1 && T.bh === 1 && T.k === 1) return teil1 + kopf + teil2;
  const px = hx, py = hy + 9, sc = `scale(${T.bw} ${T.bh})`;
  return `<g transform="${sc}">${teil1}</g><g transform="translate(${r1(px * T.bw)} ${r1(py * T.bh)}) scale(${T.k}) translate(${r1(-px)} ${r1(-py)})">${kopf}</g>${teil2 ? `<g transform="${sc}">${teil2}</g>` : ''}`;
}

/* ---------- Kleidung am Rumpf ---------- */
function jackeDetails(id, k, blick, x0, x1, yo, yu, bauch) {
  /* x0..x1 Breite des Rumpfs, yo Schulter, yu Saum; blick seite: Vorderkante bei x1 */
  const j = id === 'hinnerk' ? k.jacke : id === 'smilla' ? k.jacke : id === 'harms' ? 'uniform' : id === 'hilke' ? 'arbeit' : (FIG[id] && FIG[id].jacke) || '';
  let s = '';
  if (j === 'troyer') {
    s += blick === 'seite' ? `<path d="M${x1 - 6} ${yo + 1} Q${x1 - 3} ${yo + 7} ${x1 - 2} ${yo + 10}" class="det"/><path d="M${x0 + 1} ${yu - 3} H${x1 + bauch * 2}" class="det"/><path d="M${x0 + 1} ${yu - 1.4} H${x1 + bauch * 2}" class="det"/>`
      : `<path d="M-4 ${yo + 1} L0 ${yo + 8} L4 ${yo + 1}" class="det"/><path d="M0 ${yo + 8} V${yo + 12}" class="det"/>${[-2.4, -1].map(d => `<path d="M${x0 + 1} ${yu + d} H${x1 - 1}" class="det"/>`).join('')}`;
    s += `<path d="M${x0 + 3} ${yo + 12} Q${(x0 + x1) / 2} ${yo + 14} ${x1 - 3} ${yo + 12} M${x0 + 3} ${yo + 18} Q${(x0 + x1) / 2} ${yo + 20} ${x1 - 3} ${yo + 18}" class="det" style="opacity:.35"/>`;
  }
  if (j === 'oelzeug') s += (blick === 'seite' ? `<path d="M${x1 - 1} ${yo + 4} L${x1 + bauch * 3} ${yu}" class="det"/>` : `<path d="M0 ${yo + 3} V${yu}" class="det"/>`) + `<rect x="${blick === 'seite' ? x1 - 7 : x0 + 3}" y="${yu - 10}" width="6" height="5" rx="1" class="det"/>`;
  if (j === 'joppe') s += blick === 'seite' ? [0, 6, 12].map(d => `<circle cx="${x1 - 1.6 + bauch * (d / 8)}" cy="${yo + 8 + d}" r="1" class="f-akzent ln"/>`).join('') : [0, 6, 12].map(d => `<circle cx="-2.4" cy="${yo + 8 + d}" r="1" class="f-akzent ln"/><circle cx="2.4" cy="${yo + 8 + d}" r="1" class="f-akzent ln"/>`).join('') + `<path d="M-5 ${yo} L0 ${yo + 7} L5 ${yo}" class="det"/>`;
  if (j === 'regen') s += (blick === 'seite' ? `<path d="M${x1 - 1} ${yo + 3} L${x1} ${yu}" class="det"/><path d="M${x0 + 2} ${yu - 9} H${x1 - 3}" class="det"/>` : `<path d="M0 ${yo + 2} V${yu}" class="det"/><path d="M${x0 + 2} ${yu - 9} H${x1 - 2}" class="det"/>`) + `<path d="M${blick === 'seite' ? x0 + 2 : -5} ${yo - 1} Q${blick === 'seite' ? x0 + 4 : 0} ${yo - 4} ${blick === 'seite' ? x0 + 9 : 5} ${yo - 1}" class="det"/>`;
  if (j === 'ringel') s += Array.from({length: 6}, (_, i) => `<path d="M${x0 + .6} ${yo + 4 + i * 4.2} H${x1 + (blick === 'seite' ? bauch * 2 - .6 : -.6)}" stroke="#f2efe6" stroke-width="2.1"/>`).join('');
  if (j === 'uniform') s += blick === 'seite' ? [0, 7, 14].map(d => `<circle cx="${x1 - 1.6}" cy="${yo + 8 + d}" r="1.1" class="f-akzent ln"/>`).join('') + `<path d="M${x1 - 5} ${yo} L${x1 - 1} ${yo + 6}" class="det"/>`
    : [0, 7, 14].map(d => `<circle cx="-3" cy="${yo + 8 + d}" r="1.1" class="f-akzent ln"/><circle cx="3" cy="${yo + 8 + d}" r="1.1" class="f-akzent ln"/>`).join('') + `<path d="M-6 ${yo} L0 ${yo + 8} L6 ${yo}" fill="#f4f1ea" class="ln"/><path d="M0 ${yo + 3} L-1 ${yo + 8} L0 ${yo + 13} L1 ${yo + 8}Z" fill="#7a2e2e"/>`;
  /* v5.78 neue Jacken */
  const se = blick === 'seite', mitte = se ? x1 - 2 : 0;
  if (j === 'fleece') s += `<path d="M${mitte} ${yo + 1} V${yu}" class="det"/><path d="M${se ? x1 - 9 : 2} ${yo + 7} h6" class="det"/><path d="M${x0 + 1} ${yu - 2} H${x1 - 1}" class="det" style="opacity:.5"/>`;
  if (j === 'segel') s += `<path d="M${mitte} ${yo} V${yu}" class="det"/><path d="M${se ? x1 - 7 : -6} ${yo - 1} Q${se ? x1 - 3 : 0} ${yo + 3} ${se ? x1 + 1 : 6} ${yo - 1}" fill="#f4f1e8" class="ln"/><path d="M${x0 + 1} ${yo + 13} H${x1 - 1}" stroke="#f4f1e8" stroke-width="1.8"/>`;
  if (j === 'hemd') s += (se ? `<path d="M${x1 - 6} ${yo} L${x1 - 1} ${yo + 4} L${x1 - 4} ${yo + 7}" class="det" style="opacity:1"/>` : `<path d="M-5 ${yo} L0 ${yo + 5} L5 ${yo} M0 ${yo + 5} V${yu}" class="det" style="opacity:1"/>`) + `<path d="M${se ? x1 - 3 : 0} ${yo + 10} v.1 m0 6 v.1 m0 6 v.1" class="det" style="opacity:1;stroke-width:1.6"/>`;
  if (j === 'overall') s += `<path d="M${x0 + 1} ${yo + 14} H${x1 - 1} M${x0 + 1} ${yo + 17} H${x1 - 1}" stroke="#e8eef0" stroke-width="1.6"/><path d="M${mitte} ${yo + 1} V${yu}" class="det"/>`;
  if (j === 'ranger') s += (se ? `<rect x="${x1 - 6}" y="${yo + 8}" width="5" height="4" rx="1" class="det"/>` : `<rect x="-8" y="${yo + 8}" width="5" height="4" rx="1" class="det"/><rect x="3" y="${yo + 8}" width="5" height="4" rx="1" class="det"/>`)
    + (se ? `<rect x="${x1 - 3}" y="${yo + 13}" width="5" height="7" rx="1.4" fill="#2a2a2a" class="ln"/>` : `<rect x="-5.4" y="${yo + 13}" width="4.4" height="7" rx="1.4" fill="#2a2a2a" class="ln"/><rect x="1" y="${yo + 13}" width="4.4" height="7" rx="1.4" fill="#2a2a2a" class="ln"/>`) + `<path d="M${se ? x1 - 6 : -6} ${yo} Q${se ? x1 - 2 : 0} ${yo + 10} ${se ? x1 : 4} ${yo + 13}" class="det" style="opacity:.8"/>`;
  return s;
}
function weste(id, k, blick, x0, x1, yo, yu) {
  const fw = FIG[id] && FIG[id].weste;
  if (fw === 'rettung') return blick === 'seite' ? `<path d="M${x0 + 1} ${yo} Q${x1} ${yo - 3} ${x1 + 1} ${yo + 3} L${x1} ${yu - 8} H${x0 + 1}Z" class="f-weste ln"/><path d="M${x0 + 1} ${yo + 12} H${x1}" stroke="#e8eef0" stroke-width="1.8"/>`
    : `<path d="M${x0 + 1} ${yo + 1} Q0 ${yo - 4} ${x1 - 1} ${yo + 1} L${x1 - 1} ${yu - 8} H${x0 + 1}Z" class="f-weste ln"/><path d="M-3 ${yo} L0 ${yo + 6} L3 ${yo}" fill="#f2efe6" class="ln"/><path d="M${x0 + 1} ${yo + 12} H${x1 - 1}" stroke="#e8eef0" stroke-width="1.8"/>`;
  if (!((id === 'hilke' && k.weste === 'warn') || fw === 'warn')) return '';
  return blick === 'seite' ? `<path d="M${x0 + 2} ${yo + 2} H${x1 - 2} L${x1 - 1} ${yu - 2} H${x0 + 1}Z" class="f-weste ln"/><path d="M${x0 + 1.4} ${yu - 9} H${x1 - 1.2} M${x0 + 1.4} ${yu - 5.4} H${x1 - 1}" stroke="#f3f1e6" stroke-width="1.6"/>`
    : `<path d="M${x0 + 2} ${yo + 2} L-3 ${yo + 2} L-2 ${yu - 2} L${x0 + 1} ${yu - 2}Z M${x1 - 2} ${yo + 2} L3 ${yo + 2} L2 ${yu - 2} L${x1 - 1} ${yu - 2}Z" class="f-weste ln"/><path d="M${x0 + 1.4} ${yu - 9} H-2.4 M2.4 ${yu - 9} H${x1 - 1.4} M${x0 + 1.4} ${yu - 5.4} H-2.2 M2.2 ${yu - 5.4} H${x1 - 1.2}" stroke="#f3f1e6" stroke-width="1.6"/>`;
}
const jackenFarbe = (id, k) => (id === 'hinnerk' && k.jacke === 'oelzeug') || (id === 'smilla' && k.jacke === 'oelzeug') ? 'style="fill:#e7b730"' : (id === 'smilla' && k.jacke === 'ringel') ? 'style="fill:#2f4f80"' : (id === 'hinnerk' && k.jacke === 'joppe') ? 'style="fill:#6b4a32"' : '';
const aermelFarbe = (id, k) => (id === 'hinnerk' && k.jacke === 'oelzeug') || (id === 'smilla' && k.jacke === 'oelzeug') ? 'stroke:#e7b730' : (id === 'smilla' && k.jacke === 'ringel') ? 'stroke:#2f4f80' : (id === 'hinnerk' && k.jacke === 'joppe') ? 'stroke:#6b4a32' : '';

/* ---------- Mensch von der Seite (schaut nach rechts) ---------- */
const WINKEL = {stehen: [8, -4], zeigen: [-96, 4], winken: [-158, 2], pinne: [38, 10], steuern: [-48, -38], sitzen: [-20, -14], block: [-46, -30], hueften: [10, -4]};
/* ---------- Gangarten (v5.78; Nutzer 22.11.2026: „Figuren animiert, verschiedene Geh-Stile, zum Auswählen“) ----------
   o.gang = {art, t}: t = Phase 0…1 eines Doppelschritts. schritt = Schwung der Oberschenkel (Grad), knie = Knieheben, fest = Knie dauernd gebeugt,
   arm = Armschwung (Grad), vor = Vorlage des Oberkörpers, roll = Schaukeln vor/zurück (Seemannsgang), hupf = Hüpfen, tasche = Hände in den Taschen */
const GANG = {
  normal: {name: 'Normal', schritt: 20, knie: 26, fest: 4, arm: 16, vor: 1, roll: 0, hupf: 0, tempo: 1},
  seemann: {name: 'Seemannsgang', schritt: 17, knie: 18, fest: 8, arm: 10, vor: 2, roll: 3.2, hupf: 0, tempo: .8, breit: 1},
  flott: {name: 'Flott', schritt: 27, knie: 34, fest: 4, arm: 26, vor: 4, roll: 0, hupf: 1.2, tempo: 1.35},
  schlendern: {name: 'Schlendern', schritt: 14, knie: 16, fest: 3, arm: 4, vor: -1.5, roll: .8, hupf: 0, tempo: .7, tasche: 1},
  stapfen: {name: 'Stapfen', schritt: 18, knie: 52, fest: 10, arm: 12, vor: 4, roll: 0, hupf: 0, tempo: .75},
  marsch: {name: 'Marsch', schritt: 24, knie: 6, fest: 0, arm: 34, vor: -2, roll: 0, hupf: 0, tempo: 1.1},
  huepfen: {name: 'Hüpfen', schritt: 26, knie: 44, fest: 6, arm: 22, vor: 2, roll: 0, hupf: 5, tempo: 1.2},
  schleichen: {name: 'Schleichen', schritt: 15, knie: 22, fest: 30, arm: 6, vor: 9, roll: 0, hupf: 0, tempo: .6}
};
function gangBeine(G, t) {
  const ph = t * Math.PI * 2, bein = off => { const th = G.schritt * Math.sin(ph + off) * Math.PI / 180, ka = (G.fest + G.knie * Math.max(0, Math.sin(ph + off + Math.PI / 2))) * Math.PI / 180;
    const hip = [off ? -1.2 : 1.6, -46], kn = [hip[0] + 20 * Math.sin(th + ka * .5), hip[1] + 20 * Math.cos(th + ka * .5)], fu = [kn[0] + 19.5 * Math.sin(th - ka * .5), kn[1] + 19.5 * Math.cos(th - ka * .5)]; return [hip, kn, fu]; };
  const v = bein(0), h = bein(Math.PI), boden = -7 - Math.max(v[2][1], h[2][1]);
  return {v, h, dy: boden - G.hupf * Math.abs(Math.sin(ph)), ph};
}
function menschSeite(id, f, k, o) {
  const pose = o.pose || 'stehen', sitzt = pose === 'sitzen' || pose === 'pinne', dy = sitzt ? 20 : 0, w = f.w, b = f.bauch;
  const G = o.gang && !sitzt ? (GANG[o.gang.art] || GANG.normal) : null, GB = G ? gangBeine(G, o.gang.t || 0) : null;
  const ln = f.lean + (G ? G.vor + G.roll * Math.sin(GB.ph * 2) : 0);
  const L = (x, y) => [x + (y < -46 + dy ? ln * Math.min(1, (-(y - dy) - 46) / 30) : 0), y];
  const ar = aermelFarbe(id, k);
  let s = '';
  /* Beine */
  const beinH = GB ? GB.h : sitzt ? [[-3, -26], [11, -26], [11, -7]] : [[-2.4, -46], [-4, -26], [-5, -7]];
  const beinV = GB ? GB.v : sitzt ? [[0, -24], [14, -24], [15, -7]] : [[2, -46], [4.2, -26], [3.4, -7]];
  const stiefel = (a, hinten) => `<g${hinten ? ' class="hinten"' : ''}><path d="M${a[0] - 4.6} ${a[1] - 9} H${a[0] + 4.6} V${a[1] + 5} H${a[0] - 4.6}Z" class="f-stiefel ln"/><path d="M${a[0] - 5} ${a[1] + 4.4} H${a[0] + 8} Q${a[0] + 11.6} ${a[1] + 4.6} ${a[0] + 11.4} ${a[1] + 7.6} H${a[0] - 5}Z" class="f-stiefel ln"/><path d="M${a[0] - 5} ${a[1] + 6.2} H${a[0] + 11.2}" class="det"/></g>`;
  s += `<g class="hinten">${glied(beinH, 8.6 * w, 'hose')}</g>` + stiefel(beinH[2], true);
  /* hinterer Arm */
  const sx = 1, sy = -71 + dy, [wh0, wv0] = WINKEL[pose] || WINKEL.stehen;
  const sw = G ? (G.tasche ? 0 : G.arm * Math.sin(GB.ph)) : 0, wh = G ? (G.tasche ? -6 : 4) + sw : wh0, wv = G ? (G.tasche ? -6 : 4) - sw : wv0;
  const arm = (pts, ang, hinten, art, extra = '') => { const [px, py] = L(sx, sy); return `<g transform="rotate(${ang} ${r1(px)} ${r1(py)})"><g${hinten ? ' class="hinten"' : ''}${art ? dreh(o, art, f.wer, px, py) : ''}>${extra}${glied(pts.map(([x, y]) => [px + x, py + y]), 7.2 * w, 'jacke').replace(/class="gl s-jacke"/, `class="gl s-jacke" style="--b:${7.2 * w}${ar ? ';' + ar : ''}"`)}${hand(px + pts[2][0], py + pts[2][1] + 2.6, 0)}</g></g>`; };
  s += arm([[0, 0], [1.6, 13], [4, 24]], wv, true, '');
  s += `${glied(beinV, 8.6 * w, 'hose')}` + stiefel(beinV[2], false);
  /* Rumpf */
  const ta = id === 'smilla' || f.rund ? .8 : 1, ru = f.rund ? 1.1 : 1;
  const T = [L(-3, -77 + dy), L(-8 * w, -74 + dy), L(-10.4 * w * ta, -58 + dy), L(-9.6 * w * ru, -46 + dy), L(-10.4 * w * ru, -38 + dy), L(10 * w + b * 3, -38 + dy), L(10.6 * w * (ta < 1 ? (f.rund ? 1.02 : .92) : 1) + b * 8, -54 + dy), L(8 * w * ta + b * 3, -62 + dy), L(5, -75 + dy), L(3, -77 + dy)];
  s += `<path d="M${pt(T[0])} Q${pt(T[1])} ${pt(L(-8.6 * w, -70 + dy))} Q${pt(T[2])} ${pt(T[3])} L${pt(T[4])} Q${pt(L(0, -36 + dy))} ${pt(T[5])} Q${pt(T[6])} ${pt(T[7])} Q${pt(T[8])} ${pt(T[9])}Z" class="f-jacke ln" ${jackenFarbe(id, k)}/>`;
  s += `<path d="M${pt(L(-9.8 * w, -58 + dy))} Q${pt(L(-10 * w, -42 + dy))} ${pt(L(-8 * w, -39 + dy))} L${pt(L(-4 * w, -39 + dy))} Q${pt(L(-7 * w, -48 + dy))} ${pt(L(-7.4 * w, -60 + dy))}Z" class="sch"/><path d="M${pt(L(-9.4 * w, -56 + dy))} L${pt(L(-6 * w, -40 + dy))}" class="schraff"/>`;
  s += `<g transform="translate(${r1(ln * .5)} 0)">${jackeDetails(id, k, 'seite', -9.6 * w, 8 * w + b * 3, -74 + dy, -38 + dy, b)}${weste(id, k, 'seite', -9.6 * w, 9.6 * w + b * 3, -73 + dy, -40 + dy)}</g>`;
  /* Kopf */
  const [hx, hy] = L(3.4, -86.4 + dy);
  s += `<path d="M${r1(hx - 3.4)} ${r1(hy + 7)} V${r1(hy + 11)} H${r1(hx + 2.6)} V${r1(hy + 7)}" class="f-haut ln"/>`;
  const teil1 = s; s = '';
  let kt = kopfSeite(id, f, k, o, hx, hy);
  /* Hinnerks Pfeife */
  if (id === 'hinnerk' && o.pfeife !== false && pose !== 'zeigen') kt += `<path d="M${r1(hx + 9)} ${r1(hy + 7.6)} Q${r1(hx + 14)} ${r1(hy + 9)} ${r1(hx + 17)} ${r1(hy + 8.4)}" class="det" style="opacity:1;stroke-width:1.6;stroke:#5b3a22"/><path d="M${r1(hx + 15.6)} ${r1(hy + 4.6)} h4 v4.6 q-2 1.4 -4 0z" fill="#6b3d1f" class="ln"/>`;
  /* v5.81: o.wende = Kopf kann sich zum Betrachter drehen (beim Sprechen); beide Köpfe liegen übereinander, die Filmbühne oder FIGUREN.wende schaltet um */
  if (o.wende) { let kv = kopfVorn(id, f, k, o, hx, hy);
    if (id === 'hinnerk' && o.pfeife !== false && pose !== 'zeigen') kv += `<path d="M${r1(hx + 4)} ${r1(hy + 7)} Q${r1(hx + 9)} ${r1(hy + 9.6)} ${r1(hx + 12)} ${r1(hy + 9)}" class="det" style="opacity:1;stroke-width:1.6;stroke:#5b3a22"/><path d="M${r1(hx + 10.6)} ${r1(hy + 5.4)} h4 v4.6 q-2 1.4 -4 0z" fill="#6b3d1f" class="ln"/>`;
    kt = `<g data-wende="${f.wer}" data-hx="${r1(hx)}" data-hy="${r1(hy)}"><g class="kw-s">${kt}</g><g class="kw-v" style="display:none">${kv}</g></g>`; }
  /* vorderer Arm (über allem) */
  const vorn = pose === 'block' ? [[0, 0], [5, 11], [12, 14]] : pose === 'steuern' ? [[0, 0], [4, 11], [9, 19]] : [[0, 0], [2.4, 13], [5.4, 24]];
  const [bx, by] = L(sx, sy);
  s += arm(vorn, wh, false, 'arm', pose === 'block' ? `<rect x="${r1(bx + 9)}" y="${r1(by + 6)}" width="11" height="14" rx="1" fill="#fffdf5" class="ln" transform="rotate(${-wh} ${r1(bx + 14)} ${r1(by + 13)})"/><path d="M${r1(bx + 11)} ${r1(by + 10)} h7 M${r1(bx + 11)} ${r1(by + 13)} h7 M${r1(bx + 11)} ${r1(by + 16)} h5" class="det" transform="rotate(${-wh} ${r1(bx + 14)} ${r1(by + 13)})"/>` : '');
  const erg = mitKopf(teil1, kt, s, o._t || TYPEN.klassisch, hx, hy);
  return GB ? `<g transform="translate(0 ${r1(GB.dy)})">${erg}</g>` : erg;
}
/* ---------- Mensch von vorn ---------- */
function menschVorn(id, f, k, o) {
  const pose = o.pose || 'stehen', sitzt = pose === 'sitzen' || pose === 'pinne' || pose === 'tisch', dy = sitzt ? 20 : 0, w = f.w, b = f.bauch, ar = aermelFarbe(id, k);
  let s = '';
  const beine = sitzt ? [[[-5, -26], [-6, -18], [-6, -7]], [[5, -26], [6, -18], [6, -7]]] : [[[-4.4, -46], [-5, -26], [-5, -7]], [[4.4, -46], [5, -26], [5, -7]]];
  beine.forEach((pts, i) => { s += glied(pts, 8.6 * w, 'hose'); const a = pts[2]; s += `<path d="M${a[0] - 4.6} ${a[1] - 9} H${a[0] + 4.6} V${a[1] + 5} H${a[0] - 4.6}Z" class="f-stiefel ln"/><path d="M${a[0] - 5.4} ${a[1] + 4} Q${a[0]} ${a[1] + 2.6} ${a[0] + 5.4} ${a[1] + 4} Q${a[0] + 6} ${a[1] + 7.6} ${a[0]} ${a[1] + 7.6} Q${a[0] - 6} ${a[1] + 7.6} ${a[0] - 5.4} ${a[1] + 4}Z" class="f-stiefel ln"/>`; });
  const ta = id === 'smilla' || f.rund ? .74 : 1, ru = f.rund ? 1.08 : 1;
  const T = `M-3.4 ${-77 + dy} Q${-9 * w} ${-76 + dy} ${-10.4 * w} ${-71 + dy} Q${-12 * w * ta - b * 2} ${-56 + dy} ${-11 * w * ru - b * 2} ${-46 + dy} L${-11.6 * w * ru - b} ${-38 + dy} Q0 ${-35.6 + dy} ${11.6 * w * ru + b} ${-38 + dy} L${11 * w * ru + b * 2} ${-46 + dy} Q${12 * w * ta + b * 2} ${-56 + dy} ${10.4 * w} ${-71 + dy} Q${9 * w} ${-76 + dy} 3.4 ${-77 + dy}Z`;
  s += `<path d="${T}" class="f-jacke ln" ${jackenFarbe(id, k)}/><path d="M${-11 * w} ${-60 + dy} Q${-11.6 * w} ${-44 + dy} ${-9 * w} ${-38.6 + dy} L${-5 * w} ${-38 + dy} Q${-8 * w} ${-50 + dy} ${-8.4 * w} ${-62 + dy}Z" class="sch"/>`;
  s += jackeDetails(id, k, 'vorn', -11 * w, 11 * w, -74 + dy, -38 + dy, b) + weste(id, k, 'vorn', -11 * w, 11 * w, -73 + dy, -40 + dy);
  const hx = .4, hy = -86.6 + dy;
  s += `<path d="M-3 ${hy + 7} V${hy + 11} H3 V${hy + 7}" class="f-haut ln"/>`;
  const teil1 = s; s = '';
  let kt = kopfVorn(id, f, k, o, hx, hy);
  /* Arme */
  const sy = -71 + dy;
  const armV = (sd, pts, art) => { const px = sd * 10.2 * w, py = sy; return `<g${art ? dreh(o, art, f.wer, px, py) : ''}>${glied(pts.map(([x, y]) => [px + sd * x, py + y]), 7.2 * w, 'jacke').replace(/class="gl s-jacke"/, `class="gl s-jacke" style="--b:${7.2 * w}${ar ? ';' + ar : ''}"`)}${hand(px + sd * pts[2][0], py + pts[2][1] + 2.4)}</g>`; };
  const P = {stehen: [[[0, 0], [1.6, 13], [2.4, 24]], [[0, 0], [1.6, 13], [2.4, 24]]], hueften: [[[0, 0], [7, 11], [1.4, 22]], [[0, 0], [7, 11], [1.4, 22]]],
    winken: [[[0, 0], [1.6, 13], [2.4, 24]], [[0, 0], [9, -9], [12, -22]]], zeigen: [[[0, 0], [1.6, 13], [2.4, 24]], [[0, 0], [12, -4], [24, -6]]],
    block: [[[0, 0], [1.6, 13], [2.4, 24]], [[0, 0], [2, 12], [-6, 16]]], sitzen: [[[0, 0], [2, 12], [-2, 20]], [[0, 0], [2, 12], [-2, 20]]], pinne: [[[0, 0], [2, 12], [-2, 20]], [[0, 0], [6, 10], [12, 16]]],
    steuern: [[[0, 0], [1, 12], [-4, 18]], [[0, 0], [1, 12], [-4, 18]]]}[pose] || null;
  const PP = P || [[[0, 0], [1.6, 13], [2.4, 24]], [[0, 0], [1.6, 13], [2.4, 24]]];
  /* v5.81 Pose „tisch“: am Tisch sitzen, Oberarme bis zur Tischkante (o.kante, lokales y); Unterarme und Hände kommen mit FIGUREN.tischArme nach der Tischplatte */
  if (pose === 'tisch') { const ke = o.kante != null ? o.kante : sy + 14; s += [-1, 1].map(sd => { const px = sd * 10.2 * w; return glied([[px, sy], [px + sd * 1.8, (sy + ke) / 2], [px + sd * 2.4, ke + 1.5]], 7.2 * w, 'jacke').replace(/class="gl s-jacke"/, `class="gl s-jacke" style="--b:${7.2 * w}${ar ? ';' + ar : ''}"`); }).join(''); }
  else s += armV(-1, PP[0], '') + armV(1, PP[1], 'arm');
  if (pose === 'block') s += `<rect x="-8" y="${sy + 10}" width="12" height="15" rx="1" fill="#fffdf5" class="ln"/><path d="M-6 ${sy + 14} H2 M-6 ${sy + 17} H2 M-6 ${sy + 20} H0" class="det"/>`;
  if (id === 'hinnerk' && o.pfeife !== false && pose !== 'zeigen') kt += `<path d="M${hx + 4} ${hy + 7} Q${hx + 9} ${hy + 9.6} ${hx + 12} ${hy + 9}" class="det" style="opacity:1;stroke-width:1.6;stroke:#5b3a22"/><path d="M${hx + 10.6} ${hy + 5.4} h4 v4.6 q-2 1.4 -4 0z" fill="#6b3d1f" class="ln"/>`;
  return mitKopf(teil1, kt, s, o._t || TYPEN.klassisch, hx, hy);
}
function menschRuecken(id, f, k, o) {
  const pose = o.pose || 'stehen', sitzt = pose === 'sitzen' || pose === 'pinne', dy = sitzt ? 20 : 0, w = f.w, b = f.bauch, ar = aermelFarbe(id, k);
  let s = '';
  const beine = sitzt ? [[[-5, -26], [-6, -18], [-6, -7]], [[5, -26], [6, -18], [6, -7]]] : [[[-4.4, -46], [-5, -26], [-5, -7]], [[4.4, -46], [5, -26], [5, -7]]];
  beine.forEach(pts => { s += glied(pts, 8.6 * w, 'hose'); const a = pts[2]; s += `<path d="M${a[0] - 4.6} ${a[1] - 9} H${a[0] + 4.6} V${a[1] + 7.6} H${a[0] - 4.6}Z" class="f-stiefel ln"/>`; });
  const sy = -71 + dy;
  const armR = (sd, pts, art) => { const px = sd * 10.2 * w, py = sy; return `<g${art ? dreh(o, art, f.wer, px, py) : ''}>${glied(pts.map(([x, y]) => [px + sd * x, py + y]), 7.2 * w, 'jacke').replace(/class="gl s-jacke"/, `class="gl s-jacke" style="--b:${7.2 * w}${ar ? ';' + ar : ''}"`)}${hand(px + sd * pts[2][0], py + pts[2][1] + 2.4)}</g>`; };
  const PP = pose === 'pinne' ? [[[0, 0], [1.6, 12], [2, 22]], [[0, 0], [8, 10], [16, 14]]] : pose === 'steuern' ? [[[0, 0], [-2, 12], [-6, 18]], [[0, 0], [-2, 12], [-6, 18]]] : pose === 'winken' ? [[[0, 0], [1.6, 13], [2.4, 24]], [[0, 0], [9, -9], [12, -22]]] : [[[0, 0], [1.6, 13], [2.4, 24]], [[0, 0], [1.6, 13], [2.4, 24]]];
  const T = `M-3.4 ${-77 + dy} Q${-9 * w} ${-76 + dy} ${-10.4 * w} ${-71 + dy} Q${-12 * w - b * 2} ${-56 + dy} ${-11 * w - b * 2} ${-46 + dy} L${-11.6 * w - b} ${-38 + dy} Q0 ${-35.6 + dy} ${11.6 * w + b} ${-38 + dy} L${11 * w + b * 2} ${-46 + dy} Q${12 * w + b * 2} ${-56 + dy} ${10.4 * w} ${-71 + dy} Q${9 * w} ${-76 + dy} 3.4 ${-77 + dy}Z`;
  s += `<path d="${T}" class="f-jacke ln" ${jackenFarbe(id, k)}/><path d="M0 ${-74 + dy} V${-40 + dy}" class="det" style="opacity:.3"/>`;
  if ((id === 'hilke' && k.weste === 'warn') || ['warn', 'rettung'].includes(FIG[id].weste)) s += `<path d="M${-9 * w} ${-72 + dy} H${9 * w} L${10 * w} ${-41 + dy} H${-10 * w}Z" class="f-weste ln"/><path d="M${-10 * w} ${-50 + dy} H${10 * w} M${-10 * w} ${-46 + dy} H${10 * w}" stroke="#f3f1e6" stroke-width="1.6"/>`;
  if (id === 'smilla' && k.jacke === 'ringel') s += Array.from({length: 6}, (_, i) => `<path d="M${-10.6 * w} ${-70 + dy + i * 4.2} H${10.6 * w}" stroke="#f2efe6" stroke-width="2.1"/>`).join('');
  s += armR(-1, PP[0], '') + armR(1, PP[1], 'arm');
  s += `<path d="M-3 ${-79 + dy} V${-75 + dy} H3 V${-79 + dy}" class="f-haut ln"/>`;
  return mitKopf(s, kopfRuecken(id, f, k, o, 0, -86.6 + dy), '', o._t || TYPEN.klassisch, 0, -86.6 + dy);
}

/* ---------- Mäusefamilie (v5.79; Nutzer 23.11.2026: „Maus-Familie mit mehreren Animationen“) ----------
   Posen: sitzen, laufen (trippeln), schnuppern, putzen, springen; o.gang.t = Phase für die Bewegung. f.gross = Größe, f.extra = Mütze | tuch | schal | schleife */
function maus(f, k, o) {
  const pose = o.pose || 'sitzen', t = o.gang ? (o.gang.t || 0) : (o.t || 0), ph = t * Math.PI * 2, g = f.gross || 1, ex = f.extra;
  const ohr = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" class="f-fell ln"/><circle cx="${x}" cy="${y}" r="${r1(r * .6)}" class="f-nase" opacity=".7"/>`;
  const auge = (x, y) => `<circle cx="${x}" cy="${y}" r="1.1" class="tinte"/><circle cx="${x + .4}" cy="${y - .4}" r=".35" fill="#fff"/>`;
  let s = '';
  if (pose === 'laufen' || pose === 'springen') {
    const hoch = pose === 'springen' ? Math.max(0, Math.sin(ph)) * 10 : Math.abs(Math.sin(ph * 2)) * 1.1;
    s += `<g transform="translate(0 ${r1(-hoch)})">`;
    s += `<path d="M-8 -5 Q-16 ${r1(-4 + 3 * Math.sin(ph))} -21 ${r1(-9 + 2 * Math.sin(ph + 1))}" class="s-fell" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    s += [[5, 0], [3, Math.PI], [-4, Math.PI], [-6, 0]].map(([x, off]) => `<path d="M${x} -3 L${r1(x + 1.8 * Math.sin(ph + off))} ${r1(-.4 - Math.max(0, Math.cos(ph + off)) * 1.2)}" class="s-fell" stroke-width="1.6" stroke-linecap="round"/>`).join('');
    s += `<ellipse cx="0" cy="-6" rx="8.4" ry="5.2" class="f-fell ln"/><path d="M-5 -2.6 Q0 -1.4 5 -2.6" class="f-bauch"/>`;
    s += ohr(6, -12.6, 3.4) + `<path d="M5 -10.6 Q10 -12 14 -7.6 Q10 -4.4 5 -5Z" class="f-fell ln"/>` + auge(9.6, -8.6) + `<circle cx="14" cy="-7.6" r="1" class="f-nase"/>`;
    s += `<path d="M13 -7 l4 -1 M13 -6.6 l4 1" class="det" style="opacity:.6"/>`;
    if (ex === 'muetze') s += `<path d="M3 -11 Q6 -17 10 -11Z" class="f-akzent ln"/>`;
    if (ex === 'schal') s += `<path d="M3.6 -9.6 Q5.6 -7 7.4 -9.6 L6 -5 L5 -5Z" class="f-akzent ln"/>`;
    if (ex === 'schleife') s += `<path d="M4 -15 l2 1.6 l2 -1.6 l-2 -1Z" class="f-akzent ln"/>`;
    if (ex === 'tuch') s += `<path d="M2.6 -13 Q7 -17 10.6 -11 Q7 -12 2.6 -13Z" class="f-akzent ln"/>`;
    s += `</g>`;
  } else {
    const nase = pose === 'schnuppern' ? Math.sin(ph * 3) * .7 : 0, hk = pose === 'schnuppern' ? -2 : 0, pf = pose === 'putzen' ? -3 + Math.sin(ph * 2) * 2.4 : 0;
    s += `<path d="M-4 -1 Q-12 0 -13 -6 Q-13 -10 -9 -10" class="s-fell" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    s += `<ellipse cx="0" cy="-7" rx="5.4" ry="7" class="f-fell ln"/><ellipse cx="1" cy="-6" rx="3.2" ry="4.8" class="f-bauch"/>`;
    if (ex === 'tuch') s += `<path d="M-4.6 -5 Q0 -2 4.6 -5 L4 -1 Q0 1 -4 -1Z" class="f-akzent ln" opacity=".9"/>`;
    s += `<ellipse cx="-2.6" cy="-.4" rx="2.4" ry="1.1" class="f-fell ln"/><ellipse cx="3" cy="-.4" rx="2.4" ry="1.1" class="f-fell ln"/>`;
    s += `<g transform="translate(0 ${hk})">` + ohr(-3.6, -20.4, 3.4) + ohr(5, -20.4, 3.4) + `<circle cx="1" cy="-15.6" r="5" class="f-fell ln"/>` + auge(-.8, -16.4) + auge(3, -16.4)
      + `<circle cx="${r1(1.1 + nase)}" cy="-12.6" r="1" class="f-nase"/><path d="M${r1(-1 + nase)} -12.4 l-4 -1 M${r1(-1 + nase)} -12 l-4 1 M${r1(3 + nase)} -12.4 l4 -1 M${r1(3 + nase)} -12 l4 1" class="det" style="opacity:.6"/>`;
    if (ex === 'muetze') s += `<path d="M-3.4 -19 Q1 -26 5.6 -19Z" class="f-akzent ln"/><circle cx="1.1" cy="-24.6" r="1" class="f-akzent ln"/>`;
    if (ex === 'schleife') s += `<path d="M3.6 -24 l2.2 1.6 l2.2 -1.6 l-2.2 -1Z" class="f-akzent ln"/>`;
    if (ex === 'tuch') s += `<path d="M-4.6 -19.4 Q1 -27 6.6 -19.4 Q1 -21.6 -4.6 -19.4Z" class="f-akzent ln"/>`;
    s += `</g>`;
    if (ex === 'schal') s += `<path d="M-3.6 -11 Q1 -9 5.4 -11 L5 -9 Q1 -7 -3.4 -9Z M3 -9.6 L4.2 -5 L5.6 -5.6 L4.6 -9.6Z" class="f-akzent ln"/>`;
    s += `<ellipse cx="${pf ? -1.6 : -2}" cy="${r1(-8 + pf)}" rx="1.3" ry="1.8" class="f-fell ln"/><ellipse cx="${pf ? 3.6 : 4}" cy="${r1(-8 + pf)}" rx="1.3" ry="1.8" class="f-fell ln"/>`;
  }
  return g === 1 ? s : `<g transform="scale(${g})">${s}</g>`;
}
/* ---------- Fabelwesen (v5.79, v5.80 süßer und mehr; eigene Erfindungen, angelehnt an Sagen der Nordsee wie Nis Puk und Klabautermann, keine fremden Figuren) ----------
   v5.80 (Nutzer 23.11.2026): immer im Aquarell ohne Umriss (figur() setzt den Stil fest), damit man sieht: Extras, spielen nicht mit. Große Augen mit Glanzpunkt,
   rote Bäckchen, kleine Witze (Muschel zu groß, Gähnen, Knoten im Bauch). Gruppen mit FIGUREN.gruppe(id, n). Gesichter mit festen Farben, damit sie im Aquarell sichtbar bleiben. */
const FAB_TINTE = '#3a2a1c';
function fabGesicht(x, y, s, t, o2 = {}) {
  const zu = ((t * 2.3 + (o2.ph || 0)) % 1) > .93, ax = 2.4 * s, r = 1.9 * s, mund = o2.mund || 'lacht';
  const auge = cx => zu ? `<path d="M${r1(cx - r)} ${y} q${r1(r)} ${r1(r * .8)} ${r1(2 * r)} 0" stroke="${FAB_TINTE}" stroke-width="${r1(.7 * s)}" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="${r1(cx)}" cy="${y}" rx="${r1(r)}" ry="${r1(r * 1.15)}" fill="#fffdf6"/><circle cx="${r1(cx + .3 * s)}" cy="${r1(y + .2 * s)}" r="${r1(r * .62)}" fill="${FAB_TINTE}"/><circle cx="${r1(cx + .7 * s)}" cy="${r1(y - .5 * s)}" r="${r1(r * .26)}" fill="#fff"/>`;
  const m = mund === 'gaehnt' ? `<ellipse cx="${x}" cy="${r1(y + 3 * s)}" rx="${r1(1.1 * s)}" ry="${r1(1.5 * s)}" fill="#7a3a2e"/>` : mund === 'oh' ? `<circle cx="${x}" cy="${r1(y + 2.8 * s)}" r="${r1(.7 * s)}" fill="#7a3a2e"/>`
    : `<path d="M${r1(x - 1.2 * s)} ${r1(y + 2.4 * s)} q${r1(1.2 * s)} ${r1(1.3 * s)} ${r1(2.4 * s)} 0" stroke="${FAB_TINTE}" stroke-width="${r1(.6 * s)}" fill="none" stroke-linecap="round"/>`;
  return auge(x - ax) + auge(x + ax) + `<ellipse cx="${r1(x - ax - 1.4 * s)}" cy="${r1(y + 2.2 * s)}" rx="${r1(1.2 * s)}" ry="${r1(.7 * s)}" fill="#f08a8a" opacity=".6"/><ellipse cx="${r1(x + ax + 1.4 * s)}" cy="${r1(y + 2.2 * s)}" rx="${r1(1.2 * s)}" ry="${r1(.7 * s)}" fill="#f08a8a" opacity=".6"/>` + m;
}
function fabel(id, f, k, o) {
  const t = o.gang ? (o.gang.t || 0) : (o.t || 0), ph = t * Math.PI * 2, P = o.ph || 0;
  if (id === 'muschelwicht') { /* Wicht mit viel zu großer Muschel als Haus auf dem Rücken, Zipfelmütze wippt */
    const wk = Math.sin(ph * 2) * 4, hb = Math.abs(Math.sin(ph * 2)) * .8;
    return `${[[-3, 0], [0, Math.PI], [4, 0], [6.5, Math.PI]].map(([x, off]) => `<path d="M${x} -3 L${r1(x + 1.4 * Math.sin(ph * 2 + off))} 0" stroke="#e0a986" stroke-width="1.8" stroke-linecap="round"/>`).join('')}
      <g transform="translate(0 ${r1(-hb)})"><circle cx="6" cy="-8" r="5.2" fill="#f3cfae" class="ln"/>${fabGesicht(7, -8.6, .62, t, {ph: P})}
      <g transform="rotate(${r1(wk)} 5 -12.6)"><path d="M1.4 -11.6 Q5 -24 12 -20 Q8.6 -15.6 10 -11.6Z" fill="#c8483a" class="ln"/><circle cx="12" cy="-20" r="1.3" fill="#f2d36b"/></g>
      <g transform="rotate(${r1(-wk * .6)} -4 -4)"><path d="M-14 -3 Q-16 -21 -4 -22 Q7 -21 4 -3Z" fill="#efd9bd" class="ln"/>${[-11, -7.5, -4, -.5].map((x, n) => `<path d="M-5 -3 L${r1(x - 1)} ${-19 + Math.abs(n - 1.5) * 1.2}" stroke="#d8b892" stroke-width="1.6" fill="none"/>`).join('')}<path d="M-14 -3 H4" stroke="#d8b892" stroke-width="2"/></g></g>`; }
  if (id === 'nebelpuschel') { /* Wölkchen auf Füßchen; gähnt ab und zu */
    const hb = 3 + Math.abs(Math.sin(ph)) * 5, sq = 1 + Math.sin(ph * 2) * .07, gaehnt = (t % 1) > .55 && (t % 1) < .7;
    return `<ellipse cx="0" cy="0" rx="${r1(8 - hb * .3)}" ry="1.5" fill="#2a1608" opacity=".1"/><g transform="translate(0 ${r1(-hb)}) scale(${r1(1 / sq)} ${r1(sq)})">
      <path d="M-3 0 v2.4 M3 0 v2.4" stroke="#9aa6ad" stroke-width="1.6" stroke-linecap="round"/>
      ${[[-6, -7, 6], [6, -7, 6], [0, -12, 7.4], [-3.6, -3.4, 5.2], [3.6, -3.4, 5.2], [-8.6, -11, 3.6], [8.6, -11, 3.6]].map(([x, y, r], n) => `<circle cx="${x}" cy="${y}" r="${r1(r + Math.sin(ph * 2 + n) * .45)}" fill="${n % 2 ? '#f4f6f7' : '#e8edf0'}" class="ln"/>`).join('')}
      ${fabGesicht(0, -9, .8, t, {ph: P, mund: gaehnt ? 'gaehnt' : 'lacht'})}</g>`; }
  if (id === 'tangschrat') { /* Tang-Kerlchen mit Seestern-Hut, Augen lugen durch den Pony */
    const sw = Math.sin(ph) * 4;
    return `<g transform="rotate(${r1(sw * .5)} 0 0)"><path d="M-4 0 L-3.6 -5 M4 0 L3.4 -5" stroke="#46613a" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M-8 -5 Q-9.6 -19 0 -20.4 Q9.6 -19 8 -5 Q0 -2 -8 -5Z" fill="#6f8f50" class="ln"/>
      ${[-7, -4.4, -1.6, 1.2, 4, 6.6].map((x, n) => `<path d="M${x} -5 Q${r1(x + sw * .3)} -1.4 ${r1(x - 1 + sw * .5)} ${r1(1.4 + n % 2)}" stroke="#58773f" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M-7 -12 Q-13 ${r1(-7 + sw)} -11.4 -1.4 M7 -12 Q13 ${r1(-7 - sw)} 11.4 -1.4" stroke="#58773f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      ${fabGesicht(0, -12.4, .72, t, {ph: P})}
      ${[-6, -3, 0, 3, 6].map(x => `<path d="M${x} -19.6 q${r1(.6 + sw * .1)} 3 ${r1(-.4)} 5" stroke="#58773f" stroke-width="1.5" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M0 -20 l1.6 -3.4 l1.1 3.4 l3.4 .6 l-2.9 1.8 l.7 3.4 l-2.7 -2.3 l-2.9 2 l.9 -3.4 l-2.7 -2Z" fill="#ef8a44" class="ln" transform="translate(1 -1.6) rotate(${r1(sw * 2)} 1 -19)"/></g>`; }
  if (id === 'leuchtfloh') { /* runder Glühkäfer mit Laterne am Po, flattert */
    const fl = .35 + Math.abs(Math.sin(ph * 6)) * .65, hb = 12 + Math.sin(ph) * 3, gl = .55 + Math.sin(ph * 2) * .25;
    return `<ellipse cx="0" cy="0" rx="5" ry="1.2" fill="#2a1608" opacity=".08"/><g transform="translate(0 ${r1(-hb)})"><circle cx="-6.6" cy="2" r="8" fill="#ffe27a" opacity="${r1(gl * .45)}"/>
      <g transform="translate(0 -3.6) scale(1 ${r1(fl)})"><ellipse cx="-2" cy="-4" rx="6" ry="3" fill="#e8f4ff" opacity=".8" transform="rotate(-25 -2 -4)"/><ellipse cx="3" cy="-4" rx="6" ry="3" fill="#e8f4ff" opacity=".8" transform="rotate(25 3 -4)"/></g>
      <circle cx="-6" cy="2" r="3.2" fill="#ffd94a" class="ln"/><ellipse cx="0" cy="0" rx="6" ry="5" fill="#5d7fa3" class="ln"/>${fabGesicht(1.4, -.6, .62, t, {ph: P})}
      <path d="M2 -4.6 q.6 -3.4 2.8 -4 M.4 -4.8 q-.4 -3.4 1 -4.6" stroke="${FAB_TINTE}" stroke-width=".7" fill="none" stroke-linecap="round"/><circle cx="4.8" cy="-8.6" r=".9" fill="#ffd94a"/><circle cx="1.4" cy="-9.4" r=".9" fill="#ffd94a"/></g>`; }
  if (id === 'knotenwurm') return knotenwurm(t, P);
  if (id === 'moewe') return moeweZeichnen(t, o);
  if (id === 'sandkruemel') { /* drei Sandkrümel, die nacheinander hopsen (immer als Grüppchen) */
    return [[-8, .8, 0], [0, 1, .33], [8, .7, .66]].map(([x, g, o2]) => { const u = (t + o2) % 1, hp = Math.max(0, Math.sin(u * Math.PI * 2)) * 5 * g;
      return `<ellipse cx="${x}" cy="0" rx="${r1(3 * g)}" ry=".8" fill="#2a1608" opacity=".1"/><g transform="translate(${x} ${r1(-hp)}) scale(${g})"><path d="M-4 -3 Q-4.4 -8 0 -8.4 Q4.4 -8 4 -3 Q3.6 0 0 0 Q-3.6 0 -4 -3Z" fill="#e9cf96" class="ln"/>
        ${[[-2, -6], [1.8, -2.4], [-1, -1.6], [2.6, -6.4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".45" fill="#b8955a"/>`).join('')}${fabGesicht(.2, -4.6, .5, t, {ph: P + o2})}</g>`; }).join(''); }
  if (id === 'quallchen') { /* Quallenkind: Schirm pumpt, Ärmchen wehen */
    const pu = Math.sin(ph * 2), hb = 12 + Math.sin(ph) * 3;
    return `<ellipse cx="0" cy="0" rx="5" ry="1.2" fill="#2a1608" opacity=".07"/><g transform="translate(0 ${r1(-hb)})">
      ${[-4.6, -2, .6, 3.2, 5.6].map((x, n) => `<path d="M${x} -1 q${r1(Math.sin(ph * 2 + n) * 2)} 3 0 6 q${r1(-Math.sin(ph * 2 + n + 1) * 2)} 3 0 6" stroke="#e7a7c4" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}
      <path d="M${r1(-7 - pu * .8)} 0 Q${r1(-7 - pu)} ${r1(-11 + pu)} 0 ${r1(-11 + pu)} Q${r1(7 + pu)} ${r1(-11 + pu)} ${r1(7 + pu * .8)} 0 Q0 2 ${r1(-7 - pu * .8)} 0Z" fill="#f4bfd6" opacity=".92" class="ln"/>
      <path d="M-4 -8 Q-2 -10 1 -9.6" stroke="#fff" stroke-width="1.2" fill="none" opacity=".7" stroke-linecap="round"/>${fabGesicht(0, -4.6, .62, t, {ph: P})}</g>`; }
  return '';
}
/* Möwe (v5.82, Nutzer 23.11.2026: „Möwen im neuen Stil, wie die anderen Fabelwesen ohne Umrandung“): Silbermöwe als Extra (Aquarell), schaut nach rechts, Füße bei 0,0.
   Posen: stehen, sitzen (auf Pfahl oder Wasser, ohne Beine), laufen (o.gang.t), picken, schreien, fliegen und gleiten (o.t = Flügelschlag). Eigene feste Farben. */
function moeweZeichnen(t, o) {
  const ph = t * Math.PI * 2, pose = o.pose || 'stehen', W = '#fbfaf6', WS = '#d5dce2', G = '#a3b3bf', GD = '#7f909d', SP = '#2c3138', GE = '#f2c23a', BE = '#e79a3c';
  const auge = (x, y) => `<circle cx="${r1(x)}" cy="${r1(y)}" r=".95" fill="#2b2420"/><circle cx="${r1(x + .3)}" cy="${r1(y - .35)}" r=".32" fill="#fff"/><path d="M${r1(x - 1.5)} ${r1(y - 1.5)} q1.4 -.8 2.8 .1" stroke="#6a5a4a" stroke-width=".55" fill="none" stroke-linecap="round"/>`;
  const schnabel = (x, y, auf = 0) => `<path d="M${r1(x)} ${r1(y - .9)} L${r1(x + 4.4)} ${r1(y - .2)} Q${r1(x + 4.8)} ${r1(y + .6)} ${r1(x + 3.8)} ${r1(y + .9)} L${r1(x)} ${r1(y + .5)}Z" fill="${GE}"/><path d="M${r1(x)} ${r1(y + .5)} L${r1(x + 3.6)} ${r1(y + 1 + auf * 2.4)} L${r1(x)} ${r1(y + 1.5 + auf * 1.4)}Z" fill="${GE}"/><circle cx="${r1(x + 3)}" cy="${r1(y + .9 + auf * 1.2)}" r=".55" fill="#d8452c"/>`;
  if (pose === 'fliegen' || pose === 'gleiten') {
    const u = pose === 'gleiten' ? .18 + Math.sin(ph) * .08 : Math.sin(ph * 2), y0 = -14 - (pose === 'gleiten' ? 0 : u * 1.2);
    const fl = (dx, k, farbe, op) => { const ty = y0 - 13 * u * k, tx = -5 + dx, sp = 2.4 + 3 * Math.abs(u);
      return `<path d="M${r1(2 + dx)} ${r1(y0 - .6)} Q${r1(-1 + dx)} ${r1(y0 - 8 * u * k - 2)} ${r1(tx)} ${r1(ty)} Q${r1(tx - 3)} ${r1(ty + 1)} ${r1(tx - 4.6)} ${r1(ty + sp)} Q${r1(-3 + dx)} ${r1(y0 - 2 * u * k + 1.4)} ${r1(-4 + dx)} ${r1(y0 + 1.2)}Z" fill="${farbe}" opacity="${op}"/><path d="M${r1(tx)} ${r1(ty)} Q${r1(tx - 3)} ${r1(ty + 1)} ${r1(tx - 4.6)} ${r1(ty + sp)} L${r1(tx - 1.4)} ${r1(ty + 1.6)}Z" fill="${SP}" opacity="${op}"/>`; };
    return `${fl(3, .8, GD, .9)}<path d="M-10 ${r1(y0 + .2)} Q-6 ${r1(y0 - 3.2)} 2 ${r1(y0 - 3)} Q8.6 ${r1(y0 - 3)} 9.6 ${r1(y0 - .4)} Q8 ${r1(y0 + 2.6)} 1 ${r1(y0 + 2.6)} Q-6 ${r1(y0 + 2.6)} -10 ${r1(y0 + .2)}Z" fill="${W}"/><path d="M-10 ${r1(y0 + .2)} L-13 ${r1(y0 - 1)} L-12.6 ${r1(y0 + 1.6)}Z" fill="${W}"/>
      <path d="M-6 ${r1(y0 + 1.8)} Q0 ${r1(y0 + 3.4)} 6 ${r1(y0 + 1.6)}" stroke="${WS}" stroke-width="1.2" fill="none"/>${auge(7.4, y0 - 1.4)}${schnabel(9.4, y0 - .4)}${fl(0, 1, G, 1)}`;
  }
  const lauf = pose === 'laufen', gt = o.gang ? (o.gang.t || 0) : t, s1 = lauf ? Math.sin(gt * Math.PI * 2) : 0, bob = lauf ? Math.abs(s1) * .8 : 0;
  const sitzt = pose === 'sitzen', pickt = pose === 'picken', schreit = pose === 'schreien', by = sitzt ? 3.6 : 0, k0 = by - bob;
  let s = `<ellipse cx="0" cy="0" rx="8" ry="1.3" fill="#2a1608" opacity=".1"/>`;
  if (!sitzt) s += [[-1.2, s1], [1.6, -s1]].map(([x, w]) => `<path d="M${x} -5 L${r1(x + w * 1.6)} 0" stroke="${BE}" stroke-width="1.2" stroke-linecap="round"/><path d="M${r1(x + w * 1.6 - 1.2)} 0 h2.6" stroke="${BE}" stroke-width="1" stroke-linecap="round"/>`).join('');
  s += `<g transform="translate(0 ${r1(k0)})"><path d="M-12.6 -9.4 Q-7 -14 1.4 -13.4 Q7.8 -12.6 8.6 -8.6 Q8.2 -4.2 1.8 -3.8 Q-4.6 -3.8 -8.2 -6.8 Z" fill="${W}"/><path d="M-5 -4.8 Q1 -3 7 -6" stroke="${WS}" stroke-width="1.4" fill="none"/>
    <path d="M-9.8 -10.8 Q-3 -13.8 4.2 -11.8 Q2.2 -7.6 -4 -6.9 Q-8.4 -7.2 -11.2 -8.6 L-14.4 -9.8 Q-11.6 -10.2 -9.8 -10.8Z" fill="${G}"/><path d="M-11.2 -8.6 L-14.8 -10 L-12.2 -10.6Z" fill="${SP}"/><circle cx="-12.8" cy="-9.7" r=".45" fill="#fff"/>
    <path d="M-7 -9.2 q3 -1.2 6 -.6" stroke="${GD}" stroke-width=".6" fill="none" opacity=".7"/></g>`;
  /* Kopf: beim Picken nickt er zum Boden, beim Schreien geht er hoch und der Schnabel auf */
  const kx = 6.8, ky = (schreit ? -17.6 : -15.4) + k0, pk = pickt ? 48 + Math.max(0, Math.sin(ph * 3)) * 26 : 0;
  s += `<path d="M3.6 ${r1(-11.4 + k0)} Q${r1(kx - 2)} ${r1(ky + 1)} ${r1(kx)} ${r1(ky)} L${r1(kx + 1.6)} ${r1(ky + 2.6)} Q${r1(kx - .4)} ${r1(ky + 4.6)} 7.6 ${r1(-8 + k0)}Z" fill="${W}"/>`;
  s += `<g${pk ? ` transform="rotate(${r1(pk)} 5.6 ${r1(-10 + k0)})"` : ''}><circle cx="${r1(kx)}" cy="${r1(ky)}" r="4" fill="${W}"/>${auge(kx + 1.3, ky - .8)}${schnabel(kx + 3.2, ky + .4, schreit ? .6 + Math.abs(Math.sin(ph * 3)) * .4 : 0)}</g>`;
  return s;
}
/* Knotenwurm (v5.81, Nutzer 23.11.2026: „sollen einen richtigen Achterknoten als Körper bekommen“): die Stützpunkte des Achtknotens aus knoten.js (ACHT, LOOSE),
   etwas zusammengezogen, quer gelegt. Hinten der feste Part als Schwanz mit Takling, vorn das lose Ende mit dem Kopf. Über/unter nach den Ebenen des Knotenkurses.
   Bewegung: der Schwanz schlängelt, der Knoten atmet, der Kopf nickt. Eigene feste Farben, damit es auch im Aquarell ohne Umriss ein Tau bleibt. */
const ACHT_CP = [[150, 76, 's1'], [150, 96, 's1'], [150, 116, 's1'], [150, 140, 's2'], [150, 168, 's2'], [151, 196, 's2'], [157, 219, 'lb'], [177, 229, 'lb'], [198, 217, 'lr'], [204, 192, 'lr'], [197, 170, 'lr'],
  [185, 162, 'e1'], [168, 164, 'e1'], [150, 167, 'e1'], [128, 160, 'e1'], [114, 143, 'e2'], [116, 122, 'e2'], [131, 109, 'e2'], [150, 105, 'e2'], [168, 108, 'e2'], [179, 120, 'e3'], [178, 142, 'e3'],
  [175, 166, 'e3'], [173, 190, 'e4'], [171, 214, 'e4'], [168, 238, 'e4'], [164, 262, 'end']];
const ACHT_Z = {s1: 6, s2: 1, lb: 6, lr: 3, e1: 2, e2: 2, e3: 7, e4: 3, end: 3};
function knotenwurm(t, P) {
  const ph = t * Math.PI * 2, C = {x: 162, y: 172}, k = .86 + Math.sin(ph) * .025;
  /* Punkte: Knoten zusammengezogen (atmet), Schwanz schlängelt (nur s1), Ende mit dem Kopf nickt */
  const cp = ACHT_CP.map(([x, y, l], i) => {
    if (l === 's1') { const f = (116 - y) / 40; return {x: x + Math.sin(ph * 2 - y / 9) * 9 * f, y: y + Math.sin(ph) * 6 * f, l}; }
    const q = {x: C.x + (x - C.x) * k, y: C.y + (y - C.y) * k, l};
    if (i >= 23) { const g = (i - 22) / 4; q.x += Math.sin(ph + .6) * 7 * g; q.y += Math.cos(ph) * 3 * g; }
    return q; });
  const sp = [];
  for (let i = 0; i < cp.length - 1; i++) { const p0 = cp[i - 1] || cp[i], p1 = cp[i], p2 = cp[i + 1], p3 = cp[i + 2] || cp[i + 1];
    for (let j = 0; j < 6; j++) { const u = j / 6, u2 = u * u, u3 = u2 * u, f = (a, b, c, d) => .5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (3 * b - a - 3 * c + d) * u3);
      sp.push({x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y), l: p1.l}); } }
  sp.push({...cp[cp.length - 1]});
  /* quer legen: (x, y) → (y − 164, 117 − x) · 0,2 → Schwanz links, Kopf rechts, Bauch am Boden */
  const T = q => [r1((q.y - 164) * .2), r1((117 - q.x) * .2)];
  const st = []; let cur = null;
  sp.forEach((q, i) => { if (!cur || cur.l !== q.l) { cur = {l: q.l, z: ACHT_Z[q.l], a: i, b: i}; st.push(cur); } cur.b = i; });
  const d = (a, b) => 'M' + sp.slice(Math.max(0, a), Math.min(sp.length, b)).map(q => T(q).join(' ')).join(' L');
  let s = `<ellipse cx="2" cy=".4" rx="17" ry="1.6" fill="#2a1608" opacity=".1"/>`;
  st.map((q, i) => ({...q, i})).sort((a, b) => a.z - b.z || a.i - b.i).forEach(q => { const pd = d(q.a - 2, q.b + 3);
    s += `<path d="${pd}" stroke="#6b4a26" stroke-width="3.3" fill="none" stroke-linejoin="round"/><path d="${pd}" stroke="#e3bd78" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`
      + `<path d="${pd}" stroke="#b98a4a" stroke-width="2.5" fill="none" stroke-dasharray=".35 .85" opacity=".6"/><path d="${pd}" stroke="#fff3d6" stroke-width=".7" fill="none" opacity=".5" transform="translate(-.25 -.3)"/>`; });
  /* Schwanz: blauer Takling am festen Part */
  const [sx, sy] = T(sp[0]), [sx2, sy2] = T(sp[2]);
  s += `<path d="M${sx} ${sy} L${r1(sx + (sx2 - sx) * .9)} ${r1(sy + (sy2 - sy) * .9)}" stroke="#2f4f80" stroke-width="2.9" stroke-linecap="round"/>`;
  /* Kopf am losen Ende, schaut nach rechts, mit Mützchen */
  const [kx, ky] = T(sp[sp.length - 1]), nick = Math.sin(ph * 2) * 4;
  s += `<g transform="translate(${r1(kx + 2.4)} ${r1(ky - .6)}) rotate(${r1(nick)})"><circle r="3.9" fill="#e3bd78" stroke="#6b4a26" stroke-width=".55"/>${fabGesicht(.9, -.4, .48, t, {ph: P})}`
    + `<path d="M-2.8 -2.8 Q.4 -7.2 3.6 -3.2Z" fill="#2f4f80"/><circle cx=".5" cy="-5.8" r=".85" fill="#f3ead2"/></g>`;
  return s;
}
/* Ein kleines Grüppchen derselben Art: versetzt, unterschiedlich groß, nicht im Gleichschritt (Nutzer 23.11.2026: „teilweise in kleinen Gruppen“) */
function gruppe(id, n = 3, o = {}) {
  const f = FIG[id]; if (!f) return '';
  const t = o.gang ? o.gang.t || 0 : o.t || 0;
  return Array.from({length: n}, (_, i) => { const dx = (i - (n - 1) / 2) * (f.h || 20) * 1.05 + (i % 2 ? 3 : -2), dy = (i % 2) * 3, g = [1, .82, .92, .74, .88][i % 5], tt = (t + i * .27) % 1;
    return `<g transform="translate(${r1(dx)} ${dy}) scale(${g})">${figur(id, {...o, gang: o.gang ? {...o.gang, t: tt} : undefined, t: tt, ph: i * .37})}</g>`; }).join('');
}

/* ---------- Blick von oben (v5.77; Nutzer 22.11.2026: „Figuren aus verschiedenen Winkeln: Seite, hinten, vorn, oben“) ----------
   Die Figur schaut nach unten (zum Betrachter hin); Mittelpunkt des Kopfes bei y = -24, Füße vorn bei y = -6. */
function menschOben(id, f, k, o) {
  const w = f.w, b = f.bauch || 0, T = o._t || TYPEN.klassisch, kk = 8.4 * Math.min(1.5, T.k), pose = o.pose || 'stehen', vor = pose === 'pinne' || pose === 'steuern' || pose === 'zeigen';
  const sb = (11 * w + b * 2.2) * (1 + (T.bw - 1) * .45);
  let s = `<ellipse cx="2" cy="-18" rx="${r1(sb + 5)}" ry="13" fill="#2a1608" opacity=".14"/>`;
  s += `<ellipse cx="-5" cy="-6" rx="3.6" ry="4.8" class="f-stiefel ln"/><ellipse cx="5" cy="-6" rx="3.6" ry="4.8" class="f-stiefel ln"/>`;
  const arm = sd => vor && sd > 0 ? `<path d="M${r1(sd * sb * .8)} -25 Q${r1(sd * (sb + 3))} -16 ${r1(sd * (sb - 2))} -8" class="ol" style="--b:${r1(6.6 * w)}"/><path d="M${r1(sd * sb * .8)} -25 Q${r1(sd * (sb + 3))} -16 ${r1(sd * (sb - 2))} -8" class="gl s-jacke" style="--b:${r1(6.6 * w)}"/><circle cx="${r1(sd * (sb - 2))}" cy="-7" r="2.8" class="f-haut ln"/>`
    : `<ellipse cx="${r1(sd * (sb + 1.5))}" cy="-21" rx="4" ry="8.4" class="f-jacke ln" ${jackenFarbe(id, k)}/><circle cx="${r1(sd * (sb + 1.8))}" cy="-13.4" r="2.7" class="f-haut ln"/>`;
  s += arm(-1) + arm(1);
  s += `<ellipse cx="0" cy="-23" rx="${r1(sb)}" ry="${r1(9.5 * T.bw)}" class="f-jacke ln" ${jackenFarbe(id, k)}/>`;
  if (b > .3) s += `<ellipse cx="0" cy="-15.5" rx="${r1(sb * .55)}" ry="4.6" class="f-jacke ln" ${jackenFarbe(id, k)}/>`;
  s += `<path d="M${r1(-sb * .9)} -26 Q0 -31 ${r1(sb * .9)} -26" class="det" style="opacity:.35"/>`;
  if ((id === 'hilke' && k.weste === 'warn') || ['warn', 'rettung'].includes(FIG[id].weste)) s += `<path d="M${r1(-sb * .82)} -25 Q0 -16 ${r1(sb * .82)} -25 L${r1(sb * .78)} -20 Q0 -11 ${r1(-sb * .78)} -20Z" class="f-weste ln"/><path d="M${r1(-sb * .8)} -22.4 Q0 -13.6 ${r1(sb * .8)} -22.4" stroke="#f3f1e6" stroke-width="1.3" fill="none"/>`;
  /* Kopf */
  const hy = -25.5;
  let kt = '';
  if (id === 'smilla') { kt += `<circle cx="0" cy="${hy}" r="${r1(kk + .8)}" class="f-haar ln"/>`; if (k.haar === 'zopf') kt += `<path d="M0 ${r1(hy - kk)} Q-3 ${r1(hy - kk - 9)} 1 ${r1(hy - kk - 17)}" class="ol" style="--b:4.4"/><path d="M0 ${r1(hy - kk)} Q-3 ${r1(hy - kk - 9)} 1 ${r1(hy - kk - 17)}" class="gl s-haar" style="--b:4.4"/>`; else if (k.haar === 'dutt') kt += `<circle cx="0" cy="${r1(hy - kk + 1)}" r="3.6" class="f-haar ln"/>`;
    kt += `<circle cx="0" cy="${r1(hy + 1)}" r="${r1(kk * .86)}" class="f-hut ln"/><circle cx="0" cy="${r1(hy + 1)}" r="2.6" fill="#f2efe6" class="ln"/>`; }
  else if (id === 'hinnerk') { const hut = k.hut || 'elbsegler', col = hut === 'fischer' ? 'style="fill:#b8402e"' : hut === 'suedwester' ? 'style="fill:#e2b23c"' : '';
    kt += `<path d="M${r1(-kk * .9)} ${r1(hy + 4)} Q0 ${r1(hy + kk + 9)} ${r1(kk * .9)} ${r1(hy + 4)}" class="f-bart ln"/>`;
    if (hut === 'ohne') kt += `<circle cx="0" cy="${hy}" r="${r1(kk)}" class="f-haut ln"/><path d="M${r1(-kk * .8)} ${r1(hy - 2)} A${r1(kk * .85)} ${r1(kk * .85)} 0 0 1 ${r1(kk * .8)} ${r1(hy - 2)}" class="det" style="opacity:.5"/>`;
    else { if (hut === 'suedwester') kt += `<ellipse cx="0" cy="${r1(hy - 1)}" rx="${r1(kk * 1.4)}" ry="${r1(kk * 1.3)}" class="f-hut ln" ${col}/>`; kt += `<circle cx="0" cy="${hy}" r="${r1(kk)}" class="f-hut ln" ${col}/>`;
      if (hut === 'elbsegler') kt += `<path d="M${r1(-kk * .75)} ${r1(hy + kk * .55)} Q0 ${r1(hy + kk * 1.45)} ${r1(kk * .75)} ${r1(hy + kk * .55)}Z" fill="#1a2236" class="ln"/><circle cx="0" cy="${r1(hy + kk * .2)}" r="1.4" fill="#c9a03c"/>`;
      if (hut === 'fischer') kt += `<path d="M${r1(-kk * .4)} ${r1(hy - kk * .3)} q${r1(kk * .4)} -4 ${r1(kk * .8)} 0" class="det"/>`; } }
  else if (id === 'harms') { if (k.hut === 'ohne') kt += `<circle cx="0" cy="${hy}" r="${r1(kk)}" class="f-haar ln"/>`;
    else kt += `<circle cx="0" cy="${hy}" r="${r1(kk * 1.08)}" class="f-hut ln"/><circle cx="0" cy="${hy}" r="${r1(kk * .62)}" fill="none" class="det" style="opacity:.4"/><path d="M${r1(-kk * .8)} ${r1(hy + kk * .7)} Q0 ${r1(hy + kk * 1.55)} ${r1(kk * .8)} ${r1(hy + kk * .7)}Z" fill="#141a26" class="ln"/><circle cx="0" cy="${r1(hy + kk * .45)}" r="1.6" class="f-akzent"/>`; }
  else if (f.frisur || f.haar) { const h = k.hut || 'ohne';
    if (h === 'ranger') kt += `<circle cx="0" cy="${hy}" r="${r1(kk * 1.75)}" class="f-hut ln"/>`;
    kt += `<circle cx="0" cy="${hy}" r="${r1(kk)}" class="${['ohne', 'sonnenbrille', 'headset'].includes(h) ? (f.haar === 'kranz' ? 'f-haut' : 'f-haar') : 'f-hut'} ln"/>`;
    if (f.frisur === 'pferd' && h !== 'helm') kt += `<path d="M0 ${r1(hy - kk)} Q-2 ${r1(hy - kk - 7)} 1 ${r1(hy - kk - 12)}" class="ol" style="--b:4"/><path d="M0 ${r1(hy - kk)} Q-2 ${r1(hy - kk - 7)} 1 ${r1(hy - kk - 12)}" class="gl s-haar" style="--b:4"/>`;
    if (['schiffer', 'polizei', 'cap'].includes(h)) kt += `<path d="M${r1(-kk * .75)} ${r1(hy + kk * .55)} Q0 ${r1(hy + kk * 1.5)} ${r1(kk * .75)} ${r1(hy + kk * .55)}Z" class="${h === 'cap' ? 'f-hut' : 'tinte'} ln"/>`;
    if (h === 'helm') kt += `<path d="M${r1(-kk)} ${hy} H${r1(kk)}" stroke="#f08a24" stroke-width="2.2"/>`;
    if (f.bart === 'kurz' || f.bart === 'schnauz') kt += `<path d="M${r1(-kk * .6)} ${r1(hy + kk * .8)} Q0 ${r1(hy + kk * 1.3)} ${r1(kk * .6)} ${r1(hy + kk * .8)}" class="s-bart" stroke-width="2.4" fill="none"/>`; }
  else { kt += `<circle cx="0" cy="${hy}" r="${r1(kk)}" class="f-haar ln"/><circle cx="0" cy="${r1(hy - kk * .5)}" r="3.4" class="f-haar ln"/><path d="M${r1(-kk * .6)} ${r1(hy + kk * .7)} q${r1(kk * .6)} 2 ${r1(kk * 1.2)} 0" class="f-haut ln"/>`;
    if (f.brille) kt += `<path d="M${r1(-kk * .7)} ${r1(hy + kk * .5)} H${r1(kk * .7)}" class="det" style="opacity:.8"/>`; }
  return s + kt;
}
function katzeOben(f, k) {
  const latz = k.fell === 'latz', socken = k.fell === 'socken';
  return `<ellipse cx="2" cy="-12" rx="13" ry="16" fill="#2a1608" opacity=".14"/><path d="M6 -2 Q16 -2 16 -14 Q16 -24 10 -26" class="ol" style="--b:4"/><path d="M6 -2 Q16 -2 16 -14 Q16 -24 10 -26" class="gl s-fell" style="--b:4"/>
    <ellipse cx="0" cy="-14" rx="9" ry="12.5" class="f-fell ln"/>${[-19, -14, -9].map(y => `<path d="M-7 ${y} Q0 ${y + 3} 7 ${y}" class="s-streifen" stroke-width="1.8" fill="none"/>`).join('')}
    ${socken ? '<circle cx="-5" cy="-1" r="2.2" fill="#f7efe2" class="ln"/><circle cx="5" cy="-1" r="2.2" fill="#f7efe2" class="ln"/>' : ''}
    <circle cx="0" cy="-2" r="6.4" class="f-fell ln"/><path d="M-5.6 -5 L-6.4 -10.4 L-2.2 -7 Z M5.6 -5 L6.4 -10.4 L2.2 -7 Z" class="f-fell ln"/><path d="M-3 -5 Q0 -3.6 3 -5" class="s-streifen" stroke-width="1.4" fill="none"/>
    ${latz ? '<path d="M-3 2 Q0 4.6 3 2" fill="#f7efe2"/>' : ''}<path d="M-2 -8.4 Q0 -7.4 2 -8.4" class="s-halsband" stroke-width="1.6" fill="none"/>`;
}
function papageiOben() {
  return `<ellipse cx="2" cy="-12" rx="10" ry="14" fill="#2a1608" opacity=".14"/><path d="M-3 -24 L0 -34 L3 -24Z" class="f-fluegel ln"/><ellipse cx="0" cy="-15" rx="6.6" ry="10" class="f-koerper ln"/>
    <path d="M-6 -20 Q-10 -12 -4 -6 Q-5 -13 -6 -20Z M6 -20 Q10 -12 4 -6 Q5 -13 6 -20Z" class="f-fluegel ln"/><circle cx="0" cy="-5" r="4.6" class="f-kopf ln"/><path d="M-1.8 -1.6 Q0 2.6 1.8 -1.6Z" class="f-schnabel ln"/>
    <circle cx="-2.6" cy="-5.4" r=".9" class="tinte"/><circle cx="2.6" cy="-5.4" r=".9" class="tinte"/>`;
}

/* ---------- Bordkatze Backbord (rot getigert, Halsband: von ihr aus links rot, rechts grün) ---------- */
/* Gangarten der Katze (v5.79; Nutzer 23.11.2026: „Für Backbord noch ein paar mehr“): Schritt (amp), Pfote heben (lift), Wippen (bob), tiefer (tief) */
/* v5.80 neu (Nutzer 23.11.2026: „Diese Animationen funktionieren teilweise noch nicht gut“): echte Beinfolge je Gangart (Schritt: eins nach dem anderen,
   Trab: diagonal, Rennen: Galopp mit Strecken und Beugen, Springen: ein Bogen ohne Bildwechsel), Beine mit Gelenk, Kopf ruhig, Schwanz schwingt mit.
   offs: Phase der Beine [hinten links, hinten rechts, vorn links, vorn rechts]; amp Schrittweite; lift Pfote heben; bob Wippen; tief Körper tiefer; schwanz Haltung */
const KATZE_GANG = {schleichen: {name: 'Schleichen', offs: [0, .5, .25, .75], amp: 2.6, lift: .9, bob: .25, tief: 2.2, tempo: .55, schwanz: 'tief', nick: 2},
  traben: {name: 'Traben', offs: [0, .5, .5, 0], amp: 3.6, lift: 2, bob: .8, tempo: 1, schwanz: 'hoch', nick: 1.5},
  rennen: {name: 'Rennen', offs: [0, .1, .5, .6], amp: 5.6, lift: 2.6, bob: 1.4, tempo: 1.8, schwanz: 'lang', beug: 2.4, kipp: 5},
  stolzieren: {name: 'Stolzieren', offs: [0, .5, .25, .75], amp: 2.8, lift: 3, bob: .4, tempo: .8, kopf: -8, schwanz: 'kringel', nick: 1},
  springen: {name: 'Springen', sprung: 1, tempo: 1.2, hoehe: 9, schwanz: 'lang'},
  tappen: {name: 'Tapsen', offs: [0, .5, .25, .75], amp: 1.6, lift: 2.6, bob: .6, tempo: .7, schwanz: 'hoch', nick: 2.5}};
function katze(f, k, o) {
  const pose = o.pose || 'sitzen', fell = k.fell;
  const latz = fell === 'latz' || fell === 'socken', socken = fell === 'socken';
  const schwanz = (d, px, py) => `<g${dreh(o, 'schwanz', f.wer, px, py)}><path d="${d}" class="ol" style="--b:4.4"/><path d="${d}" class="gl s-fell" style="--b:4.4"/><path d="${d}" fill="none" class="s-streifen" stroke-width="4.4" stroke-dasharray="1.8 3.2" stroke-linecap="butt"/></g>`;
  const T = o._t || TYPEN.klassisch, hk = Math.min(1.6, T.k), ea = T.auge === 'gross' ? 1.35 : T.auge === 'glanz' ? 1.15 : 1;
  const kopfG = (x, y, rot = 0, blick = 'seite') => `<g transform="translate(${x} ${r1(y + 4)}) scale(${hk}) translate(${-x} ${r1(-(y + 4))})"><g transform="rotate(${rot} ${x} ${y})"${dreh(o, 'kopf', f.wer, x - 3, y + 4)}>
    <path d="M${x - 2} ${y - 4} L${x - 1} ${y - 11} L${x + 3} ${y - 6}Z" class="f-fell ln"/><path d="M${x + 3} ${y - 6.4} L${x + 6.4} ${y - 11.4} L${x + 7.4} ${y - 4.6}Z" class="f-fell ln"/><path d="M${x - .8} ${y - 6} L${x - .4} ${y - 9} L${x + 1.6} ${y - 6.4}Z" fill="#f2b6a6"/>
    <path d="M${x - 5.8} ${y} Q${x - 6} ${y - 7} ${x + 1} ${y - 7} Q${x + 8} ${y - 7} ${x + 8.6} ${y - 1} Q${x + 9} ${y + 4.6} ${x + 2} ${y + 5} Q${x - 5.4} ${y + 5} ${x - 5.8} ${y}Z" class="f-fell ln"/>
    <path d="M${x - 1} ${y - 6.6} L${x} ${y - 3.6} M${x + 1.8} ${y - 7} L${x + 2.2} ${y - 4} M${x + 4.4} ${y - 6.6} L${x + 3.8} ${y - 3.8}" class="s-streifen" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M${x + 4} ${y + 1.2} Q${x + 7} ${y - .4} ${x + 9} ${y + 2} Q${x + 7.6} ${y + 4.6} ${x + 3.6} ${y + 4}Z" class="f-bauch"/>
    <g${dreh(o, 'blink', f.wer, x + 4.2, y - 2)}><ellipse cx="${x + 4.2}" cy="${y - 2}" rx="${r1(1.5 * ea)}" ry="${r1(1.7 * ea)}" fill="#9fcf5a"/><ellipse cx="${x + 4.4}" cy="${y - 2}" rx=".5" ry="${r1(1.4 * ea)}" class="tinte"/>${ea > 1 ? `<circle cx="${x + 4.9}" cy="${y - 2.8}" r=".7" fill="#fff"/>` : ''}</g>
    <path d="M${x + 8.2} ${y + .6} l1 .9 l-1.4 .4z" class="f-nase"/><path d="M${x + 7.6} ${y + 2.8} q.8 .8 1.6 0" class="det" style="opacity:1"/>
    <path d="M${x + 7} ${y + 1.6} L${x + 13} ${y} M${x + 7} ${y + 2.4} L${x + 13} ${y + 2.8}" class="det" style="opacity:.6"/></g></g>`;
  const kopf = kopfG;
  const halsband = (x, y, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 3.4} ${y - 1} Q${x} ${y + 1.6} ${x + 3.6} ${y - 1.4}" class="s-halsband" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="${x + 1.2}" cy="${y + .8}" r="1.5" class="f-bb ln"/><circle cx="${x + 1.2}" cy="${y + .8}" r="3.4" class="f-bb" opacity=".22"/></g>`;
  const pfote = (x, y, weiss) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1.4" class="${weiss ? '' : 'f-fell '}ln"${weiss ? ' fill="#f6f2ea"' : ''}/>`;
  const streifenRumpf = (pts) => pts.map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 1} ${(y1 + y2) / 2} ${x2} ${y2}" class="s-streifen" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join('');
  let s = '';
  if (pose === 'sitzen') {
    s += schwanz('M-6 -2 Q-14 -1 -14 -8 Q-14 -13 -10 -14', -6, -2);
    s += `<path d="M-7 0 Q-9 -8 -5 -13 Q-1 -17 4 -14 Q8 -10 7 0Z" class="f-fell ln"/>` + streifenRumpf([[-6, -9, -3, -6], [-7, -5, -3, -2], [-4, -13, -1, -10]]);
    s += `<path d="M2 -12 Q6 -8 5 0 L1 0 Q2 -6 0 -10Z" class="f-bauch"/>`;
    s += pfote(3, -.6, socken) + pfote(-1, -.6, socken) + halsband(3, -14) + kopf(3, -18);
    if (latz) s += `<path d="M3 -13 Q6.4 -10 5.4 -5 Q3 -6 1.6 -10Z" fill="#f6f2ea"/>`;
  } else if (pose === 'laufen') {
    s += katzeLauf(o, socken, {schwanz, kopf, halsband, pfote, streifenRumpf});
  } else if (pose === 'strecken') {
    s += schwanz('M-10 -12 Q-16 -18 -14 -26', -10, -12);
    s += glied([[-8, -11], [-9, -1]], 3.4, 'fell') + pfote(-9, -.6, socken) + glied([[-5, -11], [-4, -1]], 3.4, 'fell') + pfote(-4, -.6, socken);
    s += glied([[6, -5], [16, -1]], 3.2, 'fell') + pfote(17, -.8, socken) + glied([[5, -4], [14, 0]], 3.2, 'fell');
    s += `<path d="M-11 -12 Q-10 -18 -3 -16 Q5 -12 9 -6 Q10 -2 5 -3 Q-2 -6 -8 -7 Q-12 -8 -11 -12Z" class="f-fell ln"/>` + streifenRumpf([[-7, -16, -6, -8], [-3, -15, -2, -6.6], [1, -13, 2, -5]]);
    s += halsband(8, -6, 50) + kopf(11, -6, 18);
  } else if (pose === 'liegen') {
    s += schwanz('M-9 -2 Q-4 3 6 1 Q10 0 11 -2', -9, -2);
    s += `<path d="M-10 0 Q-11 -9 -2 -10 Q7 -10 9 -3 Q9 0 4 0Z" class="f-fell ln"/>` + streifenRumpf([[-6, -9, -5, -2], [-2, -10, -1, -2], [2, -9.6, 3, -3]]);
    s += `<g transform="translate(2 -1) scale(.95)">${kopf(4, -5, 10)}</g>` + `<path d="M7 -1.6 Q8 -1 7 0" class="det"/>`;
  } else if (pose === 'putzen') {
    s += schwanz('M-6 -2 Q-14 -1 -14 -8 Q-14 -13 -10 -14', -6, -2);
    s += `<path d="M-7 0 Q-9 -8 -5 -13 Q-1 -17 4 -14 Q8 -10 7 0Z" class="f-fell ln"/>` + streifenRumpf([[-6, -9, -3, -6], [-7, -5, -3, -2]]);
    s += `<path d="M2 -12 Q6 -8 5 0 L1 0 Q2 -6 0 -10Z" class="f-bauch"/>` + pfote(-1, -.6, socken) + halsband(3, -14) + kopf(3, -18, -12);
    s += glied([[4, -10], [9, -13], [9, -19]], 3.2, 'fell') + pfote(9, -19.6, socken);
  } else if (pose === 'springen') {
    s += schwanz('M-11 -14 Q-19 -14 -23 -10', -11, -14);
    s += glied([[-8, -12], [-14, -6]], 3.4, 'fell') + pfote(-14.6, -5.4, socken) + glied([[-6, -12], [-12, -4]], 3.4, 'fell') + glied([[7, -15], [14, -12]], 3.2, 'fell') + pfote(14.6, -11.6, socken) + glied([[8, -14], [15, -9]], 3.2, 'fell');
    s += `<path d="M-11 -14 Q-10 -20 -2 -20 L6 -19 Q11 -18 10 -13 Q8 -10 2 -11 L-6 -11 Q-11 -11 -11 -14Z" class="f-fell ln"/>` + streifenRumpf([[-6, -19.6, -5, -11.4], [-2, -20, -1, -11], [2, -19.6, 3, -11]]);
    s += halsband(10, -16, 20) + kopf(13, -20, -6);
  }
  return s;
}
/* Laufende Katze: Beine mit Gelenk (zwei Glieder), Fußbahn als Bogen, Körper wippt, Kopf ruhiger, Schwanz mit Verzögerung. Ohne o.gang: Stand im Trab-Bild. */
function katzeLauf(o, socken, Z) {
  const KG = (o.gang && KATZE_GANG[o.gang.art]) || null, t = KG ? (o.gang.t || 0) % 1 : 0, ph = t * Math.PI * 2, P2 = Math.PI * 2;
  const HUEFT = [[-8, 'h'], [-5, 'h'], [6, 'v'], [9, 'v']], L = 3.8;
  /* Gelenk zwischen Hüfte H und Pfote F; Knie zeigt nach hinten (Katze: Ellbogen hinten, Sprunggelenk hinten) */
  const bein = (hx, hy, fx, fy) => { let dx = fx - hx, dy = fy - hy, d = Math.hypot(dx, dy); if (d > 2 * L - .05) { const k = (2 * L - .05) / d; fx = hx + dx * k; fy = hy + dy * k; dx *= k; dy *= k; d = 2 * L - .05; }
    const mx = (hx + fx) / 2, my = (hy + fy) / 2, h = Math.sqrt(Math.max(0, L * L - d * d / 4)), nx = -dy / d, ny = dx / d, sg = nx > 0 ? -1 : 1;
    return [[hx, hy], [mx + nx * h * sg, my + ny * h * sg], [fx, fy]]; };
  let koerperY = 0, kipp = 0, beug = 0, kopfY = 0, kopfRot = KG && KG.kopf || 0, fuesse;
  if (KG && KG.sprung) {
    /* ein Sprung: Ducken (Boden), Abstoßen, Bogen in der Luft mit gestreckten Beinen, weich landen */
    const g = .32, hoehe = KG.hoehe || 9;
    if (t < g) { const v = t / g; koerperY = 2.6 * Math.sin(Math.PI * v); kipp = -3 * Math.sin(Math.PI * v); fuesse = HUEFT.map(([x]) => [x + (x < 0 ? 1 : -1) * .8 * Math.sin(Math.PI * v), 0]); }
    else { const v = (t - g) / (1 - g), sb = Math.sin(Math.PI * v); koerperY = -hoehe * sb; kipp = -9 * Math.cos(Math.PI * v) * sb * 1.6;
      fuesse = HUEFT.map(([x, w]) => w === 'h' ? [x - 4.6 * sb, -7 + 7 - 1.5 * sb + koerperY] : [x + 4.6 * sb, -7 + 7 - 2.6 * sb + koerperY]); }
    kopfY = -koerperY * .15;
  } else {
    const A = KG ? KG.amp : 0, LI = KG ? KG.lift : 0;
    koerperY = KG ? -KG.bob * Math.abs(Math.sin(ph * 2)) + (KG.tief || 0) : 0; kopfY = KG ? KG.bob * .45 * Math.abs(Math.sin(ph * 2)) : 0;
    if (KG && KG.beug) { beug = KG.beug * Math.sin(ph); kipp = KG.kipp * Math.sin(ph + .6); }
    if (KG && KG.nick) kopfRot += KG.nick * Math.sin(ph * 2);
    fuesse = HUEFT.map(([x], i) => { const th = ph + (KG ? KG.offs[i] : 0) * P2; return [x + A * Math.sin(th) + (x < 0 ? -beug : beug) * .5, -LI * Math.max(0, Math.cos(th))]; });
  }
  const tief = KG && KG.tief ? KG.tief : 0;
  let s = `<ellipse cx="1" cy=".6" rx="${r1(13 - Math.min(6, Math.max(0, -koerperY) * .5))}" ry="1.6" fill="#2a1608" opacity=".14"/>`;
  /* Schwanz: Haltung je Gangart, schwingt verzögert */
  const sw = KG ? Math.sin(ph - 1.2) * (KG.sprung ? 2 : 2.4) : 0, by = -9 + koerperY, art = KG ? KG.schwanz : 'hoch';
  const sd = art === 'tief' ? `M-10 ${by} Q-17 ${r1(by + 2 + sw * .4)} -22 ${r1(by + 5 + sw)}` : art === 'lang' ? `M-10 ${by} Q-18 ${r1(by - 2 + sw * .5)} -25 ${r1(by - 1 + sw)}`
    : art === 'kringel' ? `M-10 ${by} Q-15 ${r1(by - 10)} ${r1(-12 + sw * .4)} ${r1(by - 16)} Q${r1(-8 + sw * .3)} ${r1(by - 19)} ${r1(-7 + sw * .3)} ${r1(by - 15)}` : `M-10 ${by} Q-16 ${r1(by - 4 + sw * .4)} ${r1(-18 + sw * .6)} ${r1(by - 11)}`;
  s += Z.schwanz(sd, -10, by);
  /* Hüften drehen mit dem Körper (Kippen beim Galopp und Sprung) */
  const kr = kipp * Math.PI / 180, hueft = x => { const px = x + (x < 0 ? -beug * .5 : beug * .5) - 1, py = -7 + 10; return [1 + px * Math.cos(kr) - py * Math.sin(kr), -10 + px * Math.sin(kr) + py * Math.cos(kr) + koerperY]; };
  const b = HUEFT.map(([x], i) => { const [hx, hy2] = hueft(x); return bein(hx, hy2, fuesse[i][0], fuesse[i][1]); });
  const zeichneBein = i => `<g${i % 2 ? ' class="hinten"' : ''}>${glied(b[i], 3.2, 'fell')}${Z.pfote(r1(b[i][2][0] + .8), r1(b[i][2][1] - .5), socken)}</g>`;
  s += zeichneBein(1) + zeichneBein(3);
  s += `<g transform="translate(0 ${r1(koerperY)}) rotate(${r1(kipp)} 1 -10)">`;
  const hx0 = -11 - beug * .5, vx0 = 12 + beug * .5;
  s += `<path d="M${r1(hx0)} -9 Q${r1(hx0)} -15 ${r1(hx0 + 7)} -15 L${r1(vx0 - 6)} -15 Q${r1(vx0)} -15 ${r1(vx0)} -10 Q${r1(vx0)} -5 ${r1(vx0 - 6)} -5 L${r1(hx0 + 5)} -5 Q${r1(hx0)} -5 ${r1(hx0)} -9Z" class="f-fell ln"/>` + Z.streifenRumpf([[-7, -14.6, -6, -6], [-3, -15, -2, -6], [1, -15, 2, -6], [5, -15, 5, -7]]);
  s += `<path d="M-6 -5.4 Q0 -4 6 -5.4 Q2 -7 -6 -5.4Z" class="f-bauch"/>` + Z.halsband(11 + beug * .5, -12, 30);
  s += `<g transform="translate(0 ${r1(kopfY - (tief ? tief * .3 : 0))})">${Z.kopf(14 + beug * .5, -15, r1(4 + kopfRot - kipp * .6))}</g></g>`;
  s += zeichneBein(0) + zeichneBein(2);
  return s;
}

/* ---------- Klabauter (Papagei) ---------- */
function papagei(f, k, o) {
  const pose = o.pose || 'sitzen';
  let s = '';
  if (pose === 'fliegen') {
    const sw = o.schlag || 0;
    s += `<path d="M-4 -14 Q-16 -30 -26 -22 Q-16 -20 -8 -10Z" class="f-fluegel ln" transform="rotate(${r1(-sw * .6)} -6 -13)"/>`;
    s += `<path d="M-14 -12 L-24 -8 L-22 -14Z" class="f-kopf ln"/><path d="M-12 -14 Q-4 -20 6 -18 Q12 -16 10 -10 Q2 -6 -10 -9Z" class="f-koerper ln"/>`;
    s += `<g transform="rotate(${r1(sw)} -2 -14)"${dreh(o, 'arm', f.wer, -2, -14)}><path d="M-2 -14 Q4 -34 18 -32 Q8 -22 4 -12Z" class="f-fluegel ln"/>${[0, 1, 2].map(i => `<path d="M${2 + i * 4} ${-28 + i * 2} L${4 + i * 4} ${-20 + i * 2}" class="det"/>`).join('')}</g>`;
    s += `<circle cx="10" cy="-18" r="6" class="f-kopf ln"/><path d="M15 -20 Q20 -19 18 -14 Q16 -15 15 -16Z" class="f-schnabel ln"/><circle cx="11.6" cy="-19.4" r="2.2" fill="#fff" class="ln"/><circle cx="12" cy="-19.4" r="1" class="tinte"/>`;
    return s;
  }
  s += `<path d="M-3 -9 L-9 4 L-4 4 L-1 -6Z" class="f-fluegel ln"/>`;
  s += `<path d="M-6 -2 Q-8 -14 -3 -22 Q2 -27 7 -24 Q10 -16 8 -6 Q5 0 -2 0Z" class="f-koerper ln"/><path d="M2 -16 Q6 -10 5 -3 Q2 -1 0 -4 Q1 -10 2 -16Z" class="f-bauch"/>`;
  s += `<g${dreh(o, 'arm', f.wer, -2, -18)}><path d="M-2 -19 Q-7 -12 -6 -2 Q-2 -6 1 -14Z" class="f-fluegel ln"/>${[0, 1].map(i => `<path d="M${-5 + i * 2} ${-10 + i * 2} L${-4 + i * 2} ${-4 + i}" class="det"/>`).join('')}</g>`;
  const TP = o._t || TYPEN.klassisch, hkp = Math.min(1.5, TP.k), eap = TP.auge === 'gross' ? 1.35 : TP.auge === 'glanz' ? 1.15 : 1;
  s += `<g transform="translate(2 -24) scale(${hkp}) translate(-2 24)"><g${dreh(o, 'kopf', f.wer, 2, -24)}><circle cx="3" cy="-27" r="6.6" class="f-kopf ln"/><path d="M-1 -32 Q0 -38 4 -37 M2 -33 Q4 -39 8 -36" class="s-kopf" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M8.8 -25.4 L12.4 -23.4 L9.2 -21.4Z" fill="#5c231b"/><g class="schnabel" data-ax="9" data-ay="-25.2"${dreh(o, 'schnabel', f.wer, 9, -25.2)}><path d="M8.8 -25.4 Q11.8 -24.6 12.6 -23.1 Q11.2 -21 9 -22.4Z" class="f-schnabel ln"/></g><path d="M8.4 -29.6 Q14 -29 12.4 -23 Q11 -24 9 -24.6Z" class="f-schnabel ln"/><path d="M9 -25 Q10.6 -24 11.6 -23.4" class="det"/>
    <g${dreh(o, 'blink', f.wer, 5, -28.6)}><circle cx="5" cy="-28.6" r="${r1(2.4 * eap)}" fill="#fff" class="ln"/><circle cx="5.4" cy="-28.6" r="${r1(1.1 * eap)}" class="tinte"/></g></g></g>`;
  s += `<path d="M0 0 V2.6 M3 0 V2.6" class="s-fuss" stroke-width="1.6"/><path d="M-2 3 H5" class="s-fuss" stroke-width="1.6" stroke-linecap="round"/>`;
  return s;
}

/* ---------- Schnittstelle ---------- */
function figur(id, o = {}) {
  css();
  const f0 = FIG[id]; if (!f0) return '';
  const k = kleidVon(id, o.kleid ? o : {kleid: (look().kleid || {})[id]});
  const L0 = look(), V = variante(id, o), f = mitVariante(f0, V), T = typVon(id, o);
  o = {...o, _t: T, auge: o.auge || L0.auge || null};
  let inner;
  if (o.blick === 'oben') inner = f.tier === 'katze' ? katzeOben(f, k) : f.tier === 'papagei' ? papageiOben() : menschOben(id, f, k, o);
  else if (f.tier === 'maus') inner = maus(f, k, o);
  else if (f.tier === 'fabel') inner = fabel(id, f, k, o);
  else if (f.tier === 'katze') inner = katze(f, k, o);
  else if (f.tier === 'papagei') inner = papagei(f, k, o);
  else inner = (o.blick === 'vorn' ? menschVorn : o.blick === 'ruecken' ? menschRuecken : menschSeite)(id, f, k, o);
  const sk = f.tier ? 1 : f.h / 100;
  if (sk !== 1) inner = `<g transform="scale(${sk})">${inner}</g>`;
  /* Extras (Fabelwesen, Mäuse) immer im Aquarell ohne Umriss: alles Umrandete spielt mit (v5.80, E34) */
  const fst = STILE[o.stil] ? o.stil : (f.tier === 'fabel' || f.tier === 'maus') ? 'aquarell' : '';
  const vf = V && V.farben ? ` style="${Object.entries(V.farben).map(([t, c]) => `--${id}-${t}:${c}`).join(';')}"` : '';
  return `<g class="cr cr-${id} stil${fst ? ' fest st-' + fst : ''}"${vf}${dreh(o, 'fig', o.wer || f.wer, 0, 0)}><ellipse cx="${f.tier ? 1 : 1}" cy=".6" rx="${f.tier ? 11 : 13 * (f.w || 1) * T.bw}" ry="2.2" class="tinte" opacity=".12"/>${inner}</g>`;
}
/* Gespeichertes Aussehen (S.cfg.look, Standard leer; R7). index.html setzt Farben und Stil auf <html> (lookAnwenden). */
/* Unterarme und Hände auf dem Tisch (v5.81) zur Pose „tisch“ von vorn: nach der Tischplatte zeichnen, an derselben Stelle und Größe wie die Figur.
   o.kante = Tischkante (lokales y, wie bei der Pose), o.halt = 'becher' (Hinnerk), 'stift' (Smilla) oder nichts */
function tischArme(id, o = {}) {
  css(); const f0 = FIG[id]; if (!f0 || f0.tier) return '';
  const f = mitVariante(f0, variante(id, o)), k = kleidVon(id, o.kleid ? o : {kleid: (look().kleid || {})[id]}), T = typVon(id, o);
  const w = f.w, ar = aermelFarbe(id, k), sy = -51, ke = o.kante != null ? o.kante : sy + 14, hy = ke + 9.5;
  let s = '';
  for (const sd of [-1, 1]) {
    const ex = sd * (10.2 * w + 2.4), hx = sd * (o.breit != null ? o.breit : 6.4 * w);
    s += glied([[ex, ke + .6], [r1(ex * .62 + hx * .38), r1(ke + 5.2)], [hx, hy]], 7.2 * w, 'jacke').replace(/class="gl s-jacke"/, `class="gl s-jacke" style="--b:${7.2 * w}${ar ? ';' + ar : ''}"`);
    /* Stift (v5.82, Nutzer: „Stiftposition bei Smilla ist nicht ideal“): in der rechten Hand (im Bild links), unter den Fingern, Spitze vorn auf der Karte, Ende zur Schulter */
    if (o.halt === 'stift' && sd < 0) s += `<path d="M${r1(hx + 3.8)} ${r1(hy + 5.8)} L${r1(hx - 5.6)} ${r1(hy - 3.8)}" stroke="#3a2a1c" stroke-width="2.3" stroke-linecap="round"/><path d="M${r1(hx + 3.2)} ${r1(hy + 5.1)} L${r1(hx - 5.4)} ${r1(hy - 3.6)}" stroke="#e8b33c" stroke-width="1.5" stroke-linecap="round"/><path d="M${r1(hx + 3.9)} ${r1(hy + 5.9)} l-.9 -1" stroke="#3a2a1c" stroke-width="1.3" stroke-linecap="round"/><path d="M${r1(hx - 5.6)} ${r1(hy - 3.8)} l.9 .9" stroke="#d98a8a" stroke-width="1.6" stroke-linecap="round"/>`;
    s += `<ellipse cx="${r1(hx - sd * .5)}" cy="${r1(hy + 2.2)}" rx="3.4" ry="2.5" class="f-haut ln"/><path d="M${r1(hx - sd * 2.6)} ${r1(hy + 3)} q${sd * 2.2} 1.3 ${sd * 4.4} .1" class="det"/>`;
  }
  const sk = f.h / 100;
  return `<g class="cr cr-${id} stil"><g transform="scale(${sk})"><g transform="scale(${T.bw} ${T.bh})">${s}</g></g></g>`;
}
/* Sprechen ohne Filmbühne (Medaillon, Entwurfsseiten): Mund 0…1 öffnen, Schnabel aufmachen, Kopf zum Betrachter drehen (0 = Seite, 1 = vorn) */
function mundSetzen(el, v) {
  const k = Math.max(0, Math.min(1, v || 0));
  el.querySelectorAll('.m-auf').forEach(a => { const x = +a.dataset.ax, y = +a.dataset.ay; a.setAttribute('transform', `translate(${x} ${y}) scale(${(.72 + .28 * k).toFixed(3)} ${k.toFixed(3)}) translate(${-x} ${-y})`); const z = a.previousElementSibling; if (z) z.style.opacity = k > .1 ? 0 : 1; });
  el.querySelectorAll('.schnabel').forEach(b => b.setAttribute('transform', `rotate(${(k * 34).toFixed(1)} ${b.dataset.ax} ${b.dataset.ay})`));
}
function wendeSetzen(el, u) {
  (el.matches && el.matches('[data-wende]') ? [el] : [...el.querySelectorAll('[data-wende]')]).forEach(w => { const sv = w.querySelector('.kw-s'), vv = w.querySelector('.kw-v'), x = +w.dataset.hx, y = +w.dataset.hy; if (!sv || !vv) return;
    const vorn = u >= .5, f = vorn ? .7 + (u - .5) * .6 : 1 - u * .6, g = vorn ? vv : sv; sv.style.display = vorn ? 'none' : ''; vv.style.display = vorn ? '' : 'none';
    g.setAttribute('transform', f > .995 ? '' : `translate(${x} ${y}) scale(${f.toFixed(3)} 1) translate(${-x} ${-y})`); });
}
function look() { try { return (window.S && S.cfg && S.cfg.look) || {}; } catch (e) { return {}; } }
/* Einzelbild als eigenes SVG, z. B. für die Werft oder Menüs */
function bild(id, o = {}) {
  const f = FIG[id]; if (!f) return '';
  const h = f.h + 24, w = f.tier ? 50 : 70;
  return `<svg class="crsvg" viewBox="${-w / 2} ${-h + 4} ${w} ${h}" aria-label="${f.name}">${figur(id, o)}</svg>`;
}
window.FIGUREN = {figur, gruppe, tischArme, mund: mundSetzen, wende: wendeSetzen, bild, css, FIG, STILE, TYPEN, AUGEN, GANG, KATZE_GANG, VARIANTEN, typ: typVon, kleidVon, look};
})();
