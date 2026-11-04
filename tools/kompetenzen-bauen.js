/* Baut data/kompetenzen.json (Ausbildungsheft, lern.js) aus der Liste unten. Jede amtliche SBF-See-Frage gehört zu genau einer Kompetenz.
   Aufruf: node tools/kompetenzen-bauen.js  (prüft auch, dass keine Frage fehlt oder doppelt ist) */
const fs = require('fs');
const R = s => s.split(',').flatMap(p => { const [a, b] = p.split('-').map(Number); return b ? Array.from({length: b - a + 1}, (_, i) => a + i) : [a]; });
const K = [
 ['K-GRU-01', 'Schiffsführer, Verantwortung, in Fahrt', 'grund', 'wissen', '1-3'],
 ['K-GRU-02', 'Töne, Segler als Maschinenfahrzeug', 'grund', 'wissen', '4-7'],
 ['K-GRU-03', 'Luv und Lee, Backbord und Steuerbord', 'grund', 'erkennen', '8,9'],
 ['K-HAF-01', 'Fender und Leinen klarlegen', 'hafen', 'ablauf', ''],
 ['K-HAF-02', 'Leinen auf Kommando', 'hafen', 'ablauf', ''],
 ['K-LIC-01', 'Lichterführung: Grundregeln', 'lichter', 'erkennen', '10-13'],
 ['K-KVR-01', 'Ausweichen: Begegnen und Kreuzen (Maschinenfahrzeuge)', 'kvr', 'regel', '14,15,125,136'],
 ['K-SIG-01', 'Schallsignale und Warnsignale', 'signale', 'erkennen', '16,140,141,161-164,178,186,188'],
 ['K-TAF-01', 'Tafelzeichen: Gebote, Verbote, Hinweise', 'zeichen', 'erkennen', '17-29,176'],
 ['K-SCH-01', 'Schleuse und Nord-Ostsee-Kanal', 'kanal', 'wissen', '30,173-175'],
 ['K-UMW-01', 'Umwelt, Schilf, Veröffentlichungen', 'umwelt', 'wissen', '31-33,38,58'],
 ['K-HAN-01', 'Sog, Schwell, enges Fahrwasser', 'handling', 'regel', '34,36,37,61'],
 ['K-MAN-01', 'Anlegen', 'manoever', 'manoever', '35,40,48'],
 ['K-MAN-02', 'Ablegen', 'manoever', 'manoever', ''],
 ['K-MAN-03', 'Aufstoppen', 'manoever', 'manoever', ''],
 ['K-MAN-04', 'Wenden auf engem Raum', 'manoever', 'manoever', ''],
 ['K-MAN-05', 'Mensch über Bord', 'manoever', 'manoever', '276'],
 ['K-MAN-06', 'Steuern nach Kompass', 'manoever', 'manoever', ''],
 ['K-PRO-01', 'Propeller und Radeffekt', 'handling', 'regel', '41,44-47,50,51'],
 ['K-ANK-01', 'Ankern', 'handling', 'wissen', '39,171'],
 ['K-MOT-01', 'Außenborder starten', 'motor', 'ablauf', '42'],
 ['K-MOT-02', 'Motor überwachen, Tanken, Pannen', 'motor', 'wissen', '43,49,52-57,60'],
 ['K-GAS-01', 'Gasanlage', 'sicherheit', 'wissen', '62-66'],
 ['K-SIC-01', 'Westen, Feuerlöscher, Rettungsmittel', 'sicherheit', 'wissen', '67-69'],
 ['K-SIC-02', 'Zusammenstoß und Notsignale', 'sicherheit', 'wissen', '70,72,279-285'],
 ['K-WET-01', 'Wetter', 'wetter', 'wissen', '71,260-270'],
 ['K-REC-01', 'Recht und Verantwortung', 'recht', 'wissen', '59,73-78,85,86,152,153,158,160'],
 ['K-KVR-02', 'Begriffe der Verkehrsregeln', 'kvr', 'wissen', '79-83,89,90'],
 ['K-KVR-03', 'Ausweichen: Segler, Überholen, Kurshalter', 'kvr', 'regel', '126-135,137,139'],
 ['K-LIC-02', 'Lichter: Maschinen-, Segel-, Ruderfahrzeuge, Ankerlieger', 'lichter', 'erkennen', '91-94,113,114,159'],
 ['K-LIC-03', 'Lichter: Schlepper und Fischer', 'lichter', 'erkennen', '95-99,102-105'],
 ['K-LIC-04', 'Lichter: manövrierunfähig, -behindert, tiefgangbehindert, Lotse', 'lichter', 'erkennen', '100,101,106-112,115'],
 ['K-NEB-01', 'Schallsignale bei verminderter Sicht', 'signale', 'erkennen', '84,116-124,138,271'],
 ['K-VTG-01', 'Verkehrstrennungsgebiete', 'kvr', 'regel', '87,88,142-147'],
 ['K-FAH-01', 'Besondere Fahrzeuge, Sichtzeichen', 'zeichen', 'erkennen', '148-151,154,155,177,179,187,189'],
 ['K-FAH-02', 'Fahrwasserregeln', 'fahrwasser', 'regel', '156,157,165-168,172,181'],
 ['K-FAH-03', 'Wassersport und Sperrgebiete', 'fahrwasser', 'wissen', '169,170,180,182-185'],
 ['K-SEE-01', 'Laterale Zeichen (Fahrwasser)', 'zeichen', 'erkennen', '190-196,198,199'],
 ['K-SEE-02', 'Kardinal-, Gefahren- und Sonderzeichen', 'zeichen', 'erkennen', '200-203,208'],
 ['K-FEU-01', 'Feuer und Kennungen', 'zeichen', 'erkennen', '197,204-207,209-215,220-224'],
 ['K-NAT-01', 'Naturschutz und Nationalpark', 'umwelt', 'wissen', '216-219,225-230'],
 ['K-NAV-01', 'Nautische Veröffentlichungen', 'navigation', 'wissen', '231,232,234,235,237,238'],
 ['K-NAV-02', 'Seekarte: Position, Kurs, Distanz', 'navigation', 'rechnen', '236,239-248'],
 ['K-GEZ-01', 'Gezeiten', 'navigation', 'wissen', '233,249-255'],
 ['K-SCW-01', 'Schleppen und schwere See', 'sicherheit', 'wissen', '256-259,274,275,277,278'],
 ['K-AIS-01', 'AIS', 'navigation', 'wissen', '272,273'],
 ['K-KNO-01', 'Achtknoten', 'knoten', 'knoten', ''],
 ['K-KNO-02', 'Palstek', 'knoten', 'knoten', ''],
 ['K-KNO-03', 'Kreuzknoten', 'knoten', 'knoten', ''],
 ['K-KNO-04', 'Schotstek', 'knoten', 'knoten', ''],
 ['K-KNO-05', 'Stopperstek', 'knoten', 'knoten', ''],
 ['K-KNO-06', 'Webeleinstek', 'knoten', 'knoten', ''],
 ['K-KNO-07', 'Rundtörn mit zwei halben Schlägen', 'knoten', 'knoten', ''],
 ['K-KNO-08', 'Klampe belegen', 'knoten', 'knoten', ''],
];
const seen = {}; for (const k of K) for (const n of k[4] ? R(k[4]) : []) (seen[n] = seen[n] || []).push(k[0]);
const fehler = []; for (let n = 1; n <= 285; n++) { if (!seen[n]) fehler.push('Frage ' + n + ' fehlt'); else if (seen[n].length > 1) fehler.push('Frage ' + n + ' doppelt: ' + seen[n]); }
if (fehler.length) { console.error(fehler.join('\n')); process.exit(1); }
const KN = {'K-KNO-01': 'acht', 'K-KNO-02': 'palstek', 'K-KNO-03': 'kreuz', 'K-KNO-04': 'schot', 'K-KNO-05': 'stopper', 'K-KNO-06': 'webelein', 'K-KNO-07': 'rundtoern', 'K-KNO-08': 'klampe'};
const MN = {'K-MAN-01': 'anlegen', 'K-MAN-02': 'ablegen', 'K-MAN-03': 'aufstoppen', 'K-MAN-04': 'wenden', 'K-MAN-05': 'mob', 'K-MAN-06': 'kompass'};
const out = {hinweis: 'Kompetenzen SBF See (Ausbildungsheft, lern.js). Erzeugt mit node tools/kompetenzen-bauen.js, nicht von Hand ändern. art: wissen | erkennen | regel | ablauf | manoever | knoten | rechnen; Kriterien je art in lern.js (KRIT). fragen: amtliche Fragen, jede genau einmal. knoten/manoever: IDs in data/knoten.json bzw. data/manoever.json. pruefung: Teil der praktischen Prüfung.',
  gruppen: {grund: 'Grundbegriffe', hafen: 'Im Hafen', manoever: 'Manöver', motor: 'Motor', handling: 'Boot handhaben', knoten: 'Knoten', zeichen: 'Zeichen und Tonnen', fahrwasser: 'Fahrwasser', kvr: 'Ausweichregeln', lichter: 'Lichter', signale: 'Schall- und Warnsignale', sicherheit: 'Sicherheit', umwelt: 'Umwelt und Natur', kanal: 'Schleuse und Kanal', wetter: 'Wetter', navigation: 'Navigation', recht: 'Recht'},
  kompetenzen: K.map(([id, name, gruppe, art, f]) => Object.assign({id, name, gruppe, art, fragen: f ? R(f) : []}, KN[id] ? {knoten: KN[id], pruefung: true} : {}, MN[id] ? {manoever: MN[id], pruefung: true} : {}))};
fs.writeFileSync(__dirname + '/../data/kompetenzen.json', JSON.stringify(out, null, 1).replace(/\[\n\s+([\d,\s]+?)\n\s+\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n');
console.log('data/kompetenzen.json: ' + K.length + ' Kompetenzen, 285 Fragen');
