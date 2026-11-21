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
  hinnerk: {name: "Käpt'n Hinnerk", typStd: 'kraeftig', wer: 'HINNERK', h: 100, w: 1.18, bauch: .55, lean: 4, nase: 'knolle', bart: 'voll', haar: 'kranz',
    farben: {haut: '#efc19c', bart: '#f1ece2', haar: '#e9e4da', jacke: '#34465f', hose: '#4b505b', stiefel: '#3c4a3a', hut: '#25304a', akzent: '#c9a03c'},
    kleid: {hut: {elbsegler: 'Elbsegler-Mütze', fischer: 'rote Fischermütze', suedwester: 'Südwester', ohne: 'ohne'}, jacke: {troyer: 'Troyer (Strick)', oelzeug: 'Ölzeug', joppe: 'Joppe mit Knöpfen'}},
    std: {hut: 'elbsegler', jacke: 'troyer'}},
  smilla: {name: 'Smilla', typStd: 'kraeftig', wer: 'SMILLA', h: 88, w: .86, bauch: 0, lean: 0, nase: 'stups', sommersprossen: true,
    farben: {haut: '#f4caa6', haar: '#b8582c', jacke: '#c8503c', hose: '#3d4f6e', stiefel: '#e2b23c', hut: '#2f6f8f', akzent: '#f2efe6'},
    kleid: {haar: {zopf: 'langer Zopf', dutt: 'Dutt', kurz: 'kurz'}, jacke: {regen: 'Regenjacke', ringel: 'Ringelpulli', oelzeug: 'Ölzeug'}},
    std: {haar: 'zopf', jacke: 'regen'}},
  hilke: {name: 'Hilke, Hafenmeisterin', typStd: 'kraeftig', wer: 'HAFENMEISTER', h: 94, w: 1.04, bauch: .25, lean: 0, nase: 'gerade', brille: true,
    farben: {haut: '#e9bb95', haar: '#6a4330', jacke: '#2f5d7c', hose: '#38404c', stiefel: '#2c2c2c', weste: '#e8873a', akzent: '#fffdf5'},
    kleid: {weste: {warn: 'Warnweste', ohne: 'ohne Weste'}}, std: {weste: 'warn'}},
  harms: {name: 'Kapitän Harms', typStd: 'schlaksig', wer: 'HARMS', h: 102, w: 1.02, bauch: .15, lean: -1, nase: 'lang', bart: 'kurz', haar: 'grau', brille: true,
    farben: {haut: '#ecc09e', bart: '#c9c6c0', haar: '#bdb9b2', jacke: '#1f2738', hose: '#1f2738', stiefel: '#141414', hut: '#f4f1ea', akzent: '#d9a93b'},
    kleid: {hut: {kapitaen: 'Kapitänsmütze', ohne: 'ohne Mütze'}}, std: {hut: 'kapitaen'}},
  backbord: {name: 'Bordkatze Backbord', typStd: 'klassisch', wer: 'BACKBORD', h: 24, tier: 'katze',
    farben: {fell: '#e08a3c', streifen: '#a9531e', bauch: '#f7e1c0', nase: '#d9776f', halsband: '#2d4a7a', bb: '#ff4a3d', stb: '#3ddc6a'},
    kleid: {fell: {getigert: 'rot getigert', latz: 'rot mit weißem Latz', socken: 'rot mit weißen Pfoten'}}, std: {fell: 'getigert'}},
  klabauter: {name: 'Klabauter', typStd: 'kraeftig', wer: 'KLABAUTER', h: 34, tier: 'papagei',
    farben: {kopf: '#d9412f', koerper: '#4f9a47', fluegel: '#2f7038', schnabel: '#f0b33a', bauch: '#7fbf63', fuss: '#6b6b6b'},
    kleid: {}, std: {}},
  /* v5.78 alle übrigen Figuren der Hörreise (podcast/figuren.md §6, §9, §10), im Stil der Crew; Standard-Körperbau kräftig (Nutzer 22.11.2026) */
  quirin: {name: 'Quirin, Binnenschiffer', typStd: 'kraeftig', wer: 'QUIRIN', h: 98, w: 1.12, bauch: .2, lean: 0, nase: 'gerade', bart: 'kurz', frisur: 'kurz', jacke: 'fleece',
    farben: {haut: '#ecc29c', bart: '#7a4b2a', haar: '#6a3f22', jacke: '#4f6f4a', hose: '#3e5a7a', stiefel: '#6b4a2e', hut: '#22324a', akzent: '#e8d9a8'},
    kleid: {hut: {schiffer: 'Schiffermütze', cap: 'Basecap', ohne: 'ohne'}}, std: {hut: 'schiffer'}},
  jasper: {name: 'Jasper, Segler', typStd: 'kraeftig', wer: 'JASPER', h: 96, w: .98, bauch: 0, lean: -1, nase: 'lang', frisur: 'scheitel', jacke: 'segel',
    farben: {haut: '#f0c7a2', haar: '#e2c070', jacke: '#c8382e', hose: '#d6c49a', stiefel: '#7a5a3a', hut: '#1d1d1f', akzent: '#f4f1e8'},
    kleid: {hut: {sonnenbrille: 'Sonnenbrille im Haar', cap: 'Basecap', ohne: 'ohne'}}, std: {hut: 'sonnenbrille'}},
  hafenmeister: {name: 'Hafenmeister Klüverhafen', typStd: 'kraeftig', wer: 'HAFENMEISTER2', h: 100, w: 1.1, bauch: .4, lean: 1, nase: 'knolle', bart: 'schnauz', haar: 'grau', brille: true, jacke: 'arbeit',
    farben: {haut: '#e8b996', bart: '#b9b4ac', haar: '#c3beb6', jacke: '#2c3e5c', hose: '#33363d', stiefel: '#23252a', hut: '#f2efe8', akzent: '#c9a03c'},
    kleid: {hut: {schiffer: 'Schiffermütze', ohne: 'ohne'}}, std: {hut: 'schiffer'}},
  polizistin: {name: 'Wasserschutzpolizistin', typStd: 'kraeftig', wer: 'POLIZEI', h: 93, w: .96, bauch: 0, lean: 0, nase: 'gerade', frisur: 'pferd', jacke: 'uniform',
    farben: {haut: '#e6b48e', haar: '#3a2a20', jacke: '#1f3554', hose: '#1f3554', stiefel: '#151515', hut: '#1f3554', akzent: '#e3c45a'},
    kleid: {hut: {polizei: 'Dienstmütze', ohne: 'ohne'}}, std: {hut: 'polizei'}},
  schleuse: {name: 'Schleusenwärter Klappdörp', typStd: 'kraeftig', wer: 'SCHLEUSE', h: 95, w: 1.14, bauch: .5, lean: 2, nase: 'knolle', bart: 'schnauz', haar: 'kranz', jacke: 'arbeit', weste: 'warn',
    farben: {haut: '#eab894', bart: '#d8d2c8', haar: '#d8d2c8', jacke: '#3b4a5e', hose: '#2f3a46', stiefel: '#2a2a2a', weste: '#e8873a', hut: '#3b4a5e', akzent: '#fffdf5'},
    kleid: {hut: {ohne: 'ohne', schiffer: 'Schiffermütze'}}, std: {hut: 'ohne'}},
  rangerin: {name: 'Rangerin im Watt', typStd: 'kraeftig', wer: 'RANGERIN', h: 90, w: .94, bauch: 0, lean: 0, nase: 'stups', sommersprossen: true, frisur: 'locken', jacke: 'ranger',
    farben: {haut: '#efc6a2', haar: '#9a4a24', jacke: '#5d7a3e', hose: '#6b5a40', stiefel: '#3c4a3a', hut: '#a68a52', akzent: '#2a2a2a'},
    kleid: {hut: {ranger: 'Rangerhut', ohne: 'ohne'}}, std: {hut: 'ranger'}},
  seenotretter: {name: 'Seenotretter', typStd: 'kraeftig', wer: 'SEENOT', h: 100, w: 1.12, bauch: 0, lean: 0, nase: 'gerade', bart: 'kurz', frisur: 'kurz', jacke: 'overall', weste: 'rettung',
    farben: {haut: '#e9bc98', bart: '#5a3a26', haar: '#5a3a26', jacke: '#d6452f', hose: '#d6452f', stiefel: '#1f1f1f', weste: '#f08a24', hut: '#f4f1ea', akzent: '#d9e3e6'},
    kleid: {hut: {helm: 'Helm', ohne: 'ohne'}}, std: {hut: 'helm'}},
  lotse: {name: 'Mats, Verkehrszentrale', typStd: 'kraeftig', wer: 'VERKEHR', h: 98, w: 1, bauch: .15, lean: 0, nase: 'gerade', frisur: 'scheitel', brille: true, jacke: 'hemd',
    farben: {haut: '#ecc4a0', haar: '#2e2622', jacke: '#9cb8d4', hose: '#2f3a4e', stiefel: '#1f1f22', hut: '#2a2a2e', akzent: '#2f3a4e'},
    kleid: {hut: {headset: 'Headset', ohne: 'ohne'}}, std: {hut: 'headset'}}
};

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
  if (!f.bart || f.bart === 'kurz' || f.bart === 'schnauz') s += `<g${dreh(o, 'mund', f.wer, mx, my)}>${MUND[L] || `<path d="M${mx - 2} ${my} Q${mx} ${my + .9} ${mx + 1.6} ${my - .2}" class="det" style="opacity:1"/>`}</g>`;
  /* Bart */
  if (f.bart === 'voll') s += `<path d="M${hx - 3.8} ${hy + 1.6} Q${hx - 4.4} ${hy + 13} ${hx + 3} ${hy + 14.4} Q${hx + 11.6} ${hy + 13.6} ${hx + 12} ${hy + 4.4} Q${hx + 8.6} ${hy + 6.6} ${hx + 5.6} ${hy + 5} Q${hx + 1} ${hy + 4.4} ${hx - 3.8} ${hy + 1.6}Z" class="f-bart ln"/>
    <path d="M${hx} ${hy + 8} Q${hx + 1} ${hy + 11} ${hx + 3} ${hy + 12} M${hx + 6} ${hy + 8.6} Q${hx + 7} ${hy + 11} ${hx + 8} ${hy + 11.4}" class="det"/><g${dreh(o, 'mund', f.wer, hx + 7.4, hy + 7.6)}><path d="M${hx + 5.6} ${hy + 7.6} Q${hx + 7.4} ${hy + 8.6} ${hx + 9.4} ${hy + 7.4}" class="det" style="opacity:1"/></g>`;
  if (f.bart === 'kurz') s += `<path d="M${hx - 2.6} ${hy + 3} Q${hx - 2.4} ${hy + 10.6} ${hx + 3} ${hy + 11} Q${hx + 9.6} ${hy + 10.6} ${hx + 10.6} ${hy + 4.6} Q${hx + 9} ${hy + 8.4} ${hx + 6.4} ${hy + 8.4} Q${hx + 2} ${hy + 8.4} ${hx - 2.6} ${hy + 3}Z" class="f-bart ln"/>`;
  if (f.bart === 'schnauz') s += schnauz('seite', hx, hy);
  /* Smilla (v5.78, Nutzer: „etwas attraktiver“, jugendfrei): Wimpern, Lippen, eine lose Strähne */
  if (id === 'smilla') s += `<path d="M${ax + 1} ${ay - 1.3} l1.7 -1.1 M${ax + 1.5} ${ay - .3} l1.9 -.5" class="det" style="opacity:1"/><path d="M${mx - 1.8} ${my + .5} Q${mx} ${my + 1.8} ${mx + 1.4} ${my + .3}" stroke="#c4605a" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M${hx - 1} ${hy - 8} Q${hx - 4.6} ${hy - 1} ${hx - 2.6} ${hy + 6}" class="s-haar" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
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
  const mund = `<g${dreh(o, 'mund', f.wer, mx, my)}>${MUND[L] || `<path d="M${mx - 2.2} ${my - .2} Q${mx} ${my + 1.1} ${mx + 2.2} ${my - .2}" class="det" style="opacity:1"/>`}</g>`;
  if (f.bart === 'voll') s += `<path d="M${hx - 9} ${hy + 1} Q${hx - 9} ${hy + 14} ${hx} ${hy + 15.6} Q${hx + 9} ${hy + 14} ${hx + 9} ${hy + 1} Q${hx + 6} ${hy + 6.4} ${hx + 3} ${hy + 5.4} Q${hx} ${hy + 4.2} ${hx - 3} ${hy + 5.4} Q${hx - 6} ${hy + 6.4} ${hx - 9} ${hy + 1}Z" class="f-bart ln"/>
    <path d="M${hx - 4} ${hy + 9} Q${hx - 3} ${hy + 12} ${hx - 1} ${hy + 13} M${hx + 4} ${hy + 9} Q${hx + 3} ${hy + 12} ${hx + 1} ${hy + 13}" class="det"/>` + mund + `<circle cx="${hx + 1.2}" cy="${hy + 2.4}" r="3.6" class="f-haut ln"/><circle cx="${hx + 1.6}" cy="${hy + 2.8}" r="2" class="wange"/>`;
  else if (f.bart === 'kurz') s += `<path d="M${hx - 8.4} ${hy + 2} Q${hx - 8} ${hy + 11} ${hx} ${hy + 11.6} Q${hx + 8} ${hy + 11} ${hx + 8.4} ${hy + 2} Q${hx + 6} ${hy + 8.4} ${hx} ${hy + 8.4} Q${hx - 6} ${hy + 8.4} ${hx - 8.4} ${hy + 2}Z" class="f-bart ln"/>` + mund;
  else s += mund;
  if (f.bart === 'schnauz') s += schnauz('vorn', hx, hy);
  if (id === 'smilla') s += [-1, 1].map(sd => { const ax = hx + sd * 3.8 + .6; return `<path d="M${ax + sd * 1.3} ${ay - 1.2} l${sd * 1.4} -1.2 M${ax + sd * 1.8} ${ay - .2} l${sd * 1.6} -.6" class="det" style="opacity:1"/>`; }).join('') + `<path d="M${mx - 1.8} ${my + .6} Q${mx} ${my + 1.9} ${mx + 1.8} ${my + .6}" stroke="#c4605a" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M${hx - 6} ${hy - 7} Q${hx - 10} ${hy - 1} ${hx - 8.4} ${hy + 6}" class="s-haar" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
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
  if (f.bart === 'voll') s += [-1, 1].map(sd => `<path d="M${hx + sd * 8.6} ${hy + 3} Q${hx + sd * 10} ${hy + 9} ${hx + sd * 6} ${hy + 12}" class="s-bart" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
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
  const ta = id === 'smilla' ? .8 : 1;
  const T = [L(-3, -77 + dy), L(-8 * w, -74 + dy), L(-10.4 * w * ta, -58 + dy), L(-9.6 * w, -46 + dy), L(-10.4 * w, -38 + dy), L(10 * w + b * 3, -38 + dy), L(10.6 * w * (ta < 1 ? .92 : 1) + b * 8, -50 + dy), L(8 * w * ta + b * 3, -62 + dy), L(5, -75 + dy), L(3, -77 + dy)];
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
  /* vorderer Arm (über allem) */
  const vorn = pose === 'block' ? [[0, 0], [5, 11], [12, 14]] : pose === 'steuern' ? [[0, 0], [4, 11], [9, 19]] : [[0, 0], [2.4, 13], [5.4, 24]];
  const [bx, by] = L(sx, sy);
  s += arm(vorn, wh, false, 'arm', pose === 'block' ? `<rect x="${r1(bx + 9)}" y="${r1(by + 6)}" width="11" height="14" rx="1" fill="#fffdf5" class="ln" transform="rotate(${-wh} ${r1(bx + 14)} ${r1(by + 13)})"/><path d="M${r1(bx + 11)} ${r1(by + 10)} h7 M${r1(bx + 11)} ${r1(by + 13)} h7 M${r1(bx + 11)} ${r1(by + 16)} h5" class="det" transform="rotate(${-wh} ${r1(bx + 14)} ${r1(by + 13)})"/>` : '');
  const erg = mitKopf(teil1, kt, s, o._t || TYPEN.klassisch, hx, hy);
  return GB ? `<g transform="translate(0 ${r1(GB.dy)})">${erg}</g>` : erg;
}
/* ---------- Mensch von vorn ---------- */
function menschVorn(id, f, k, o) {
  const pose = o.pose || 'stehen', sitzt = pose === 'sitzen' || pose === 'pinne', dy = sitzt ? 20 : 0, w = f.w, b = f.bauch, ar = aermelFarbe(id, k);
  let s = '';
  const beine = sitzt ? [[[-5, -26], [-6, -18], [-6, -7]], [[5, -26], [6, -18], [6, -7]]] : [[[-4.4, -46], [-5, -26], [-5, -7]], [[4.4, -46], [5, -26], [5, -7]]];
  beine.forEach((pts, i) => { s += glied(pts, 8.6 * w, 'hose'); const a = pts[2]; s += `<path d="M${a[0] - 4.6} ${a[1] - 9} H${a[0] + 4.6} V${a[1] + 5} H${a[0] - 4.6}Z" class="f-stiefel ln"/><path d="M${a[0] - 5.4} ${a[1] + 4} Q${a[0]} ${a[1] + 2.6} ${a[0] + 5.4} ${a[1] + 4} Q${a[0] + 6} ${a[1] + 7.6} ${a[0]} ${a[1] + 7.6} Q${a[0] - 6} ${a[1] + 7.6} ${a[0] - 5.4} ${a[1] + 4}Z" class="f-stiefel ln"/>`; });
  const ta = id === 'smilla' ? .72 : 1;
  const T = `M-3.4 ${-77 + dy} Q${-9 * w} ${-76 + dy} ${-10.4 * w} ${-71 + dy} Q${-12 * w * ta - b * 2} ${-56 + dy} ${-11 * w - b * 2} ${-46 + dy} L${-11.6 * w - b} ${-38 + dy} Q0 ${-35.6 + dy} ${11.6 * w + b} ${-38 + dy} L${11 * w + b * 2} ${-46 + dy} Q${12 * w * ta + b * 2} ${-56 + dy} ${10.4 * w} ${-71 + dy} Q${9 * w} ${-76 + dy} 3.4 ${-77 + dy}Z`;
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
  s += armV(-1, PP[0], '') + armV(1, PP[1], 'arm');
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

/* ---------- Blick von oben (v5.77; Nutzer 22.11.2026: „Figuren aus verschiedenen Winkeln: Seite, hinten, vorn, oben“) ----------
   Die Figur schaut nach unten (zum Betrachter hin); Mittelpunkt des Kopfes bei y = -24, Füße vorn bei y = -6. */
function menschOben(id, f, k, o) {
  const w = f.w, b = f.bauch || 0, T = o._t || TYPEN.klassisch, kk = 8.4 * Math.min(1.5, T.k), pose = o.pose || 'stehen', vor = pose === 'pinne' || pose === 'steuern' || pose === 'zeigen';
  const sb = (13.5 * w + b * 3) * T.bw;
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
    s += schwanz('M-10 -9 Q-17 -12 -19 -19', -10, -9);
    s += [[-8, -7, -9, 0], [-5, -7, -4, 0], [6, -7, 7, 0], [9, -7, 10, 0]].map(([x1, y1, x2, y2], i) => `<g${i % 2 ? ' class="hinten"' : ''}>${glied([[x1, y1], [x2 + (i < 2 ? -1 : 1), y2 - 1]], 3.4, 'fell')}${pfote(x2 + (i < 2 ? -1 : 1), y2 - .6, socken)}</g>`).join('');
    s += `<path d="M-11 -9 Q-11 -15 -4 -15 L6 -15 Q12 -15 12 -10 Q12 -5 6 -5 L-6 -5 Q-11 -5 -11 -9Z" class="f-fell ln"/>` + streifenRumpf([[-7, -14.6, -6, -6], [-3, -15, -2, -6], [1, -15, 2, -6], [5, -15, 5, -7]]);
    s += `<path d="M-6 -5.4 Q0 -4 6 -5.4 Q2 -7 -6 -5.4Z" class="f-bauch"/>` + halsband(11, -12, 30) + kopf(14, -15, 4);
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

/* ---------- Klabauter (Papagei) ---------- */
function papagei(f, k, o) {
  const pose = o.pose || 'sitzen';
  let s = '';
  if (pose === 'fliegen') {
    s += `<path d="M-4 -14 Q-16 -30 -26 -22 Q-16 -20 -8 -10Z" class="f-fluegel ln"/>`;
    s += `<path d="M-14 -12 L-24 -8 L-22 -14Z" class="f-kopf ln"/><path d="M-12 -14 Q-4 -20 6 -18 Q12 -16 10 -10 Q2 -6 -10 -9Z" class="f-koerper ln"/>`;
    s += `<g${dreh(o, 'arm', f.wer, -2, -14)}><path d="M-2 -14 Q4 -34 18 -32 Q8 -22 4 -12Z" class="f-fluegel ln"/>${[0, 1, 2].map(i => `<path d="M${2 + i * 4} ${-28 + i * 2} L${4 + i * 4} ${-20 + i * 2}" class="det"/>`).join('')}</g>`;
    s += `<circle cx="10" cy="-18" r="6" class="f-kopf ln"/><path d="M15 -20 Q20 -19 18 -14 Q16 -15 15 -16Z" class="f-schnabel ln"/><circle cx="11.6" cy="-19.4" r="2.2" fill="#fff" class="ln"/><circle cx="12" cy="-19.4" r="1" class="tinte"/>`;
    return s;
  }
  s += `<path d="M-3 -9 L-9 4 L-4 4 L-1 -6Z" class="f-fluegel ln"/>`;
  s += `<path d="M-6 -2 Q-8 -14 -3 -22 Q2 -27 7 -24 Q10 -16 8 -6 Q5 0 -2 0Z" class="f-koerper ln"/><path d="M2 -16 Q6 -10 5 -3 Q2 -1 0 -4 Q1 -10 2 -16Z" class="f-bauch"/>`;
  s += `<g${dreh(o, 'arm', f.wer, -2, -18)}><path d="M-2 -19 Q-7 -12 -6 -2 Q-2 -6 1 -14Z" class="f-fluegel ln"/>${[0, 1].map(i => `<path d="M${-5 + i * 2} ${-10 + i * 2} L${-4 + i * 2} ${-4 + i}" class="det"/>`).join('')}</g>`;
  const TP = o._t || TYPEN.klassisch, hkp = Math.min(1.5, TP.k), eap = TP.auge === 'gross' ? 1.35 : TP.auge === 'glanz' ? 1.15 : 1;
  s += `<g transform="translate(2 -24) scale(${hkp}) translate(-2 24)"><g${dreh(o, 'kopf', f.wer, 2, -24)}><circle cx="3" cy="-27" r="6.6" class="f-kopf ln"/><path d="M-1 -32 Q0 -38 4 -37 M2 -33 Q4 -39 8 -36" class="s-kopf" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M8.4 -29.6 Q14 -29 12.4 -23 Q11 -24 9 -24.6Z" class="f-schnabel ln"/><path d="M9 -25 Q10.6 -24 11.6 -23.4" class="det"/>
    <g${dreh(o, 'blink', f.wer, 5, -28.6)}><circle cx="5" cy="-28.6" r="${r1(2.4 * eap)}" fill="#fff" class="ln"/><circle cx="5.4" cy="-28.6" r="${r1(1.1 * eap)}" class="tinte"/></g></g></g>`;
  s += `<path d="M0 0 V2.6 M3 0 V2.6" class="s-fuss" stroke-width="1.6"/><path d="M-2 3 H5" class="s-fuss" stroke-width="1.6" stroke-linecap="round"/>`;
  return s;
}

/* ---------- Schnittstelle ---------- */
function figur(id, o = {}) {
  css();
  const f = FIG[id]; if (!f) return '';
  const k = kleidVon(id, o.kleid ? o : {kleid: (look().kleid || {})[id]});
  const L0 = look(), tn = o.typ || (L0.typ || {})[id] || L0.typAlle || f.typStd || 'klassisch', T = TYPEN[tn] || TYPEN.klassisch;
  o = {...o, _t: T, auge: o.auge || L0.auge || null};
  let inner;
  if (o.blick === 'oben') inner = f.tier === 'katze' ? katzeOben(f, k) : f.tier === 'papagei' ? papageiOben() : menschOben(id, f, k, o);
  else if (f.tier === 'katze') inner = katze(f, k, o);
  else if (f.tier === 'papagei') inner = papagei(f, k, o);
  else inner = (o.blick === 'vorn' ? menschVorn : o.blick === 'ruecken' ? menschRuecken : menschSeite)(id, f, k, o);
  const sk = f.tier ? 1 : f.h / 100;
  if (sk !== 1) inner = `<g transform="scale(${sk})">${inner}</g>`;
  return `<g class="cr cr-${id} stil${STILE[o.stil] ? ' fest st-' + o.stil : ''}"${dreh(o, 'fig', o.wer || f.wer, 0, 0)}><ellipse cx="${f.tier ? 1 : 1}" cy=".6" rx="${f.tier ? 11 : 13 * (f.w || 1) * T.bw}" ry="2.2" class="tinte" opacity=".12"/>${inner}</g>`;
}
/* Gespeichertes Aussehen (S.cfg.look, Standard leer; R7). index.html setzt Farben und Stil auf <html> (lookAnwenden). */
function look() { try { return (window.S && S.cfg && S.cfg.look) || {}; } catch (e) { return {}; } }
/* Einzelbild als eigenes SVG, z. B. für die Werft oder Menüs */
function bild(id, o = {}) {
  const f = FIG[id]; if (!f) return '';
  const h = f.h + 24, w = f.tier ? 50 : 70;
  return `<svg class="crsvg" viewBox="${-w / 2} ${-h + 4} ${w} ${h}" aria-label="${f.name}">${figur(id, o)}</svg>`;
}
window.FIGUREN = {figur, bild, css, FIG, STILE, TYPEN, AUGEN, GANG, kleidVon, look};
})();
