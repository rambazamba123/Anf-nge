/* Seekarte 7 „Deutsche Gischt“: liest aus img/karte7.svg die Objekte (Tonnen, Feuer, Landmarken), die Stromtabelle und die Gezeiten
   und schreibt data/karte7.json. Die Navigation (navi.js, Revier „gischt“) rechnet damit auf der echten Karte.
   Eichung (aus den Randbeschriftungen des SVG): 54°00'N liegt bei y = 437,5, 1' Breite = 22,1; 7°30'E liegt bei x = 130,0, 1' Länge = 12,97.
   Positionen in Bogenminuten ab 54°00'N / 007°00'E (wie bei der alten Karte, nur mit anderer Basis).
   Aufruf: node tools/karte7-extrahieren.js           schreibt data/karte7.json
           node tools/karte7-extrahieren.js --check   prüft, ob die Datei zum SVG passt */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const svg = fs.readFileSync(path.join(root, 'img/karte7.svg'), 'utf8');
const body = svg.slice(svg.indexOf('</style>') + 8);
const CAL = {y54: 437.5, sy: 22.1, x730: 130.0, sx: 12.97};
const latOf = y => +((CAL.y54 - y) / CAL.sy).toFixed(2);
const lonOf = x => +(30 + (x - CAL.x730) / CAL.sx).toFixed(2);
const yOfLat = lat => CAL.y54 - lat * CAL.sy, xOfLon = lon => CAL.x730 + (lon - 30) * CAL.sx;
const T = [...body.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map(m => ({x: +m[1], y: +m[2], t: m[3]}));
const near = (x, y, r) => T.filter(t => Math.hypot(t.x - x, t.y - y) <= r).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
const KENN = /^(Q|VQ|IQ|Fl|Iso|Oc|Mo|F\.|LFl)/;
const objekte = [];
/* ---- Tonnen: ein weißer Punkt r=1,6, davor das Symbol ---- */
const dots = [...body.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="1\.6" fill="white" stroke="#111"/g)];
let pos = 0;
const NAMEN = /^(TG\d+(\/\w+)?|E\d|A\d+|ST|NGN|Westertill-N|Düne-S|Helgoland-O|Accumer Ee|Otzumer Balje|Norderelbe|Süderpiep|1b\/Jade1)$/;
dots.forEach(m => {
  const x = +m[1], y = +m[2], vor = body.slice(Math.max(pos, m.index - 900), m.index); pos = m.index;
  let typ = null, kard = null;
  const marke = vor.match(/<path d="(M[\d.]+,[\d.]+l3,-?4l3,-?4z[^"]*)" fill="#111"/);
  if (/width="2\.00" height="16\.8" fill="#d4202a"/.test(vor)) typ = 'mitte';
  else if (marke) {
    typ = 'kardinal';
    const teile = [...marke[1].matchAll(/M([\d.]+),([\d.]+)l3,(-?4)l3,-?4z/g)].map(t => ({y: +t[2], auf: t[3] === '-4'})).sort((u, v) => u.y - v.y);
    kard = teile.map(t => t.auf ? 'auf' : 'ab').join('-');
  } else if (/q4,-16 8,0z" fill="#f2c418"/.test(vor)) typ = 'sonder';
  else { const sym = (vor.match(/<path d="M[\d.]+,[\d.]+[^"]*" fill="#[0-9a-f]+"/g) || []).slice(-1)[0] || ''; typ = /#d4202a/.test(sym) ? 'bb' : /#1f9a3c/.test(sym) ? 'stb' : null; }
  const tx = near(x, y, 16), kt = near(x, y, 22).find(t => KENN.test(t.t));
  const lateral = typ === 'bb' || typ === 'stb';
  let nm = (!lateral && tx.find(t => NAMEN.test(t.t))) || tx.find(t => /^\d+[a-z]?$/.test(t.t) && Math.hypot(t.x - x, t.y - y) >= 9) || tx.find(t => NAMEN.test(t.t));
  if (!nm && typ === 'sonder') nm = near(x, y, 70).find(t => /^Außenelbe-Reede \d$/.test(t.t));
  objekte.push({typ, kard, x, y, name: nm && nm.t, kenn: kt && kt.t});
});
/* Elbe: rote Tonnen (gerade) und grüne (ungerade) von 1 bis 40 in einer Kette; Jade, Weser und die Ansteuerung bekommen ihren Fahrwassernamen */
const fw = o => o.x >= 690 && o.y <= 560 ? 'Elbe' : (o.x < 700 && o.y > 560 && o.x > 270 && o.x < 520) ? 'Jade' : (o.x < 700 && o.y > 480) ? 'Weser' : 'See';
const FARBE = {bb: 'rot', stb: 'grün', mitte: 'rot/weiß senkrecht gestreift', sonder: 'gelb'};
const TOPP = {bb: 'roter Zylinder', stb: 'grüner Kegel, Spitze oben', mitte: 'roter Ball', sonder: 'gelbes Kreuz'};
const BED = {bb: 'Backbordseite des Fahrwassers (beim Einlaufen)', stb: 'Steuerbordseite des Fahrwassers (beim Einlaufen)', mitte: 'Ansteuerungstonne, Mitte des Fahrwassers (sicheres Wasser)', sonder: 'Sonderzeichen (Abgrenzung des Reedegebiets)'};
const out = [];
objekte.forEach(o => {
  if (!o.typ) return;
  const reg = fw(o); let typ = o.typ, id = o.name || null, kenn = o.kenn || null, farbe = FARBE[typ], topp = TOPP[typ], bed = BED[typ];
  if (typ === 'kardinal') {
    typ = {'auf-auf': 'nord', 'auf-ab': 'ost', 'ab-ab': 'sued', 'ab-auf': 'west'}[o.kard] || 'nord';
    farbe = {nord: 'schwarz über gelb', ost: 'schwarz-gelb-schwarz', sued: 'gelb über schwarz', west: 'gelb-schwarz-gelb'}[typ];
    topp = {nord: 'zwei schwarze Kegel, Spitzen nach oben', ost: 'zwei schwarze Kegel, Basen zueinander', sued: 'zwei schwarze Kegel, Spitzen nach unten', west: 'zwei schwarze Kegel, Spitzen zueinander'}[typ];
    bed = {nord: 'Nordkardinal: nördlich passieren', ost: 'Ostkardinal: östlich passieren', sued: 'Südkardinal: südlich passieren', west: 'Westkardinal: westlich passieren'}[typ];
  }
  if ((typ === 'bb' || typ === 'stb') && id && /^\d+[a-z]?$/.test(id) && reg !== 'See') id = reg + ' ' + id;
  const anon = !id; if (anon) id = `${reg}: ${typ === 'bb' ? 'rote' : typ === 'stb' ? 'grüne' : 'unbenannte'} Tonne (${Math.round(o.x)}|${Math.round(o.y)})`;
  out.push({id, ...(anon ? {anon: true} : {}), typ, fw: reg, x: o.x, y: o.y, lat: latOf(o.y), lon: lonOf(o.x), kenn, farbe, topp, bed});
});
/* ---- Korrekturen einzelner Tonnen (Namen, die die Nähe-Suche nicht findet) ---- */
const FIX = {'609,357': {id: 'Außenelbe-Reede 2', kenn: null}, '885,470': {id: 'Elbe 13', alias: 'Neuwerk-Reede 1'}, '697,454': {id: 'Elbe 1', kenn: 'Q.G'}};
out.forEach(o => { const f = FIX[Math.round(o.x) + ',' + Math.round(o.y)]; if (f) { Object.assign(o, f); delete o.anon; } });
/* ---- Leuchttürme, Landmarken, Häfen (von Hand aus dem SVG, siehe Prüfung oben) ---- */
const FEUER = [
  {id: 'Alte Weser', typ: 'turm', x: 619.0, y: 615.7, kenn: 'F.WRG 33m 23-18M · Horn Mo(AL) 60s', bed: 'Leuchtturm Alte Weser'},
  {id: 'Tegeler Plate', typ: 'turm', x: 670.8, y: 699.7, kenn: null, bed: 'Leuchtturm Tegeler Plate'},
  {id: 'Neuwerk', typ: 'turm', x: 909.5, y: 545.0, kenn: 'Fl(3) WRG 20s 38m 16-11M', bed: 'Leuchtturm Neuwerk'},
  {id: 'Westkirche Spiekeroog', typ: 'kirche', x: 283.0, y: 730.6, kenn: null, bed: 'Westkirche Spiekeroog, gut peilbar'},
  {id: 'Wasserturm Langeoog', typ: 'mast', x: 117.0, y: 763.8, kenn: null, bed: 'Wasserturm Langeoog, gut peilbar'},
  {id: 'Kirchturm Kuttershaven', typ: 'kirche', x: 1159.0, y: 599.0, kenn: null, bed: 'Kirchturm Kuttershaven, gut peilbar'},
  {id: 'Kirchturm Klüverhafen', typ: 'kirche', x: 1292.0, y: 569.0, kenn: null, bed: 'Kirchturm Klüverhafen, gut peilbar'},
  {id: 'Funkmast', typ: 'mast', x: 1284.0, y: 494.0, kenn: null, bed: 'Funkmast bei Lotsenkoog, gut peilbar'}
];
FEUER.forEach(f => out.push({...f, fw: '', lat: latOf(f.y), lon: lonOf(f.x), farbe: null, topp: null}));
const HAEFEN = [['Kuttershaven', 1176, 584], ['Klüverhafen', 1281, 558], ['Lotsenkoog', 1293, 505], ['Tampensiel', 428, 825]].map(([id, x, y]) => ({id, x, y, lat: latOf(y), lon: lonOf(x)}));
HAEFEN.forEach(h => out.push({id: h.id, typ: 'hafen', fw: '', x: h.x, y: h.y, lat: h.lat, lon: h.lon, kenn: null, farbe: null, topp: null, bed: 'Hafen ' + h.id}));
/* ---- Strom ◇A und Gezeiten ---- */
const col = (x, y0, y1) => T.filter(t => Math.abs(t.x - x) < 3 && t.y > y0 && t.y < y1).sort((a, b) => a.y - b.y).map(t => t.t);
const num = s => s == null ? null : +String(s).replace(',', '.').replace('−', '-');
const std = col(1236, 262, 350).map(s => s === 'HW' ? 0 : num(s)), rw = col(1266, 262, 350).map(num), sp = col(1296, 262, 350).map(num), np = col(1322, 262, 350).map(num);
const pm = T.find(t => /^53°\d+,\d' N 00\d°\d+,\d' E/.test(t.t)).t.match(/53°(\d+),(\d)' N 00(\d)°(\d+),(\d)' E/), sLat = +(+pm[1] + pm[2] / 10 - 60).toFixed(2), sLon = +(+pm[4] + pm[5] / 10 + (pm[3] - 7) * 60).toFixed(2);
const strom = {punkt: 'A', lat: sLat, lon: sLon, x: +xOfLon(sLon).toFixed(1), y: +yOfLat(sLat).toFixed(1), std, rw, sp, np, hinweis: 'fiktiv; Stromrichtung rw °, Geschwindigkeit in kn bei Springzeit (Spr.) und Nipptide (Npt.)'};
const gez = {ort: 'Kuttershaven', tage: 'Beispieltag (Springzeit), Zeiten MESZ', rows: [['HW', '05:14', 3.5], ['NW', '11:32', 0.3], ['HW', '17:41', 3.6], ['NW', '23:58', 0.4]], MHW: 3.4, MNW: 0.4, tide: '12 h 25 min', bezug: 'Höhen über KN (LAT)'};
const K = {
  _hinweis: 'Erzeugt mit node tools/karte7-extrahieren.js aus img/karte7.svg. Nicht von Hand ändern, sondern das Werkzeug oder die Überschreibungen dort. Positionen in Bogenminuten ab 54°00\'N / 007°00\'E; x und y sind SVG-Punkte.',
  bild: 'img/karte7.svg', w: 1400, h: 939,
  basis: {lat: 54, lon: 7},
  lin: {x0: +xOfLon(24).toFixed(2), y0: +yOfLat(15.13).toFixed(2), sx: CAL.sx, sy: CAL.sy, lon0: 24, lat1: 15.13},
  rahmen: {x0: 52.18, y0: 103.0, x1: 1349.18, y1: 876.5},
  bounds: {lat0: -19.86, lat1: 15.13, lon0: 24, lon1: 124},
  mw: {deg: 3.1, dir: 'E', jahr: 2026, note: "Mw 1°E (2012), jährliche Änderung 9' E → 2026: etwa 3,1° E"},
  deviation: [[0, 2], [30, 4], [60, 5], [90, 4], [120, 2], [150, 0], [180, -2], [210, -4], [240, -5], [270, -4], [300, -2], [330, 0]],
  objekte: out, haefen: HAEFEN, strom, gezeiten: gez
};
const json = JSON.stringify(K, null, 1).replace(/\n {3,}/g, ' ').replace(/\n {2}\]/g, ' ]');
const ziel = path.join(root, 'data/karte7.json');
if (process.argv.includes('--check')) {
  const alt = fs.existsSync(ziel) ? JSON.parse(fs.readFileSync(ziel, 'utf8')) : null;
  if (!alt || JSON.stringify(alt.objekte) !== JSON.stringify(K.objekte)) { console.error('data/karte7.json passt nicht zu img/karte7.svg: node tools/karte7-extrahieren.js ausführen'); process.exit(1); }
  console.log(`Karte 7 in Ordnung: ${alt.objekte.length} Objekte.`); process.exit(0);
}
fs.writeFileSync(ziel, json + '\n');
const z = {}; out.forEach(o => { z[o.typ] = (z[o.typ] || 0) + 1; });
console.log('data/karte7.json geschrieben:', out.length, 'Objekte', JSON.stringify(z));
