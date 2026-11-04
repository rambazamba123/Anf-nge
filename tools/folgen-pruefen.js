/* Prüft die 3D-Folgen (data/welt-folgen.json) und die Crew-Gespräche (data/crew-dialoge.json), v5.22 (Strategie-Gutachten §3.10).
   Fehler (Abbruch im pre-commit): unbekannte Schritte, ungültiges Wetter, Ort oder Gast, unbekannte Kompetenz, Frage außerhalb 1–285,
   Wahl mit richtig/falsch ohne Erklärung, Selbst-Aufgabe ohne Ziel, verbotene Sätze (verallgemeinerte Regeln, direktes Lob von Hinnerk).
   Warnungen: Selbst-Aufgabe ohne Erklärung davor, Hinnerk mit mehr als zwölf Wörtern. Info: welche Fragen in Folgen vorkommen.
   Aufruf: node tools/folgen-pruefen.js [--info] */
const fs = require('fs'), R = __dirname + '/../';
const F = JSON.parse(fs.readFileSync(R + 'data/welt-folgen.json', 'utf8')), K = JSON.parse(fs.readFileSync(R + 'data/kompetenzen.json', 'utf8')), CD = JSON.parse(fs.readFileSync(R + 'data/crew-dialoge.json', 'utf8'));
const welt = fs.readFileSync(R + 'welt.js', 'utf8');
const schluessel = name => { const m = welt.match(new RegExp('const ' + name + ' = \\{([\\s\\S]*?)\\};\\n')); return m ? [...m[1].matchAll(/(?:^|[{,]|\n)\s*(\w+): \{/g)].map(x => x[1]) : []; };
const WIND = schluessel('WIND'), SICHT = schluessel('SICHT'), REGEN = schluessel('REGEN'), ZEIT = schluessel('ZEIT'), ORTE = schluessel('ORTE');
const KID = new Set(K.kompetenzen.map(k => k.id)), ALT = ['fender', 'vorleine', 'klampe', 'motor', 'ablegen', 'steuern', 'fremdhafen', 'webe'];
const BEKANNT = new Set(['wer', 't', 'szene', 'kamera', 'crew', 'ort', 'wetter', 'auto', 'gas', 'raffer', 'steuert', 'plaudern', 'frage', 'fragt', 'wahl', 'k', 'dim', 'ziel', 'selbst', 'aufgabe', 'hinweis', 'ansage', 'gut', 'falsch', 'tore', 'lage', 'stoerung', 'kurs', 'tol', 'sek', 'mob', 'ruf', 'begegnung', 'abstand', 'r',
  'ton', 'knoten', 'modell', 'warte', 'ende', 'gast', 'teil', 'notiz', 'punkte', 'treibe', 'fest', 'freigabe', 'ok', 'freigaben', 'logbuch', 'zettel', 'halt', 'navi', 'merke', 'melde', 'gehoert', 'strom', 'heft', 'wennFrei', 'dann', 'sonst']);
const SELBST = ['ziel', 'ablegen', 'anlegen', 'horn', 'motor', 'aufstoppen', 'wenden', 'kurs', 'mob', 'begegnung'], ZIEL_NOETIG = ['ziel', 'ablegen', 'anlegen', 'aufstoppen'];
const VERBOTEN = [[/immer westlich/i, 'verallgemeinerte Regel (Kardinalzeichen hängen von der Tonne ab)'], [/wer den anderen rechts von sich hat/i, 'Ausweichregel ohne Rahmen (nur Maschinenfahrzeuge, KVR 15)']];
const LOB = /\b(sauber gemacht|gut gemacht|super|toll|klasse|perfekt|prima|bravo)\b/i;
const fehler = [], warn = [], fragen = {};
function pruefeText(ort, w, t) { for (const [re, g] of VERBOTEN) if (re.test(t)) fehler.push(`${ort}: verbotener Satz (${g}): „${t}“`);
  if (w === 'hinnerk' && LOB.test(t)) fehler.push(`${ort}: Hinnerk lobt nie direkt: „${t}“`);
  if (w === 'hinnerk' && t.split(/\s+/).length > 12) warn.push(`${ort}: Hinnerk spricht ${t.split(/\s+/).length} Wörter am Stück (Regel: etwa acht)`); }
function kOk(ort, k) { if (k && !KID.has(k) && !ALT.includes(k)) fehler.push(`${ort}: unbekannte Kompetenz ${k}`); }
function liste(f, schritte, pfad, zustand) {
  schritte.forEach((s, i) => { const ort = `${f.id} ${pfad}${i}`;
    for (const k of Object.keys(s)) if (!BEKANNT.has(k)) fehler.push(`${ort}: unbekanntes Feld „${k}“`);
    if (s.wer && s.t) pruefeText(ort, s.wer, s.t);
    if (s.wetter) pruefeWetter(ort, s.wetter);
    if (s.ort && !ORTE.includes(s.ort)) fehler.push(`${ort}: unbekannter Ort ${s.ort}`);
    if (s.gast && !['hafen', 'jasper'].includes(s.gast.wer)) fehler.push(`${ort}: unbekannter Gast ${s.gast.wer}`);
    kOk(ort, s.k); if (s.melde) kOk(ort, s.melde.k); if (s.wennFrei) kOk(ort, s.wennFrei); if (s.freigabe) kOk(ort, s.freigabe);
    [].concat(s.gehoert || [], Array.isArray(s.heft) ? s.heft : []).forEach(k => kOk(ort, k));
    if (s.frage) { if (!(s.frage >= 1 && s.frage <= 285)) fehler.push(`${ort}: Frage ${s.frage} gibt es nicht`); (fragen[s.frage] = fragen[s.frage] || []).push(f.id); }
    if ('ziel' in s) zustand.ziel = !!s.ziel;
    if (s.selbst) { if (!SELBST.includes(s.selbst)) fehler.push(`${ort}: unbekannte Selbst-Aufgabe ${s.selbst}`);
      if (ZIEL_NOETIG.includes(s.selbst) && !zustand.ziel) fehler.push(`${ort}: Selbst-Aufgabe ${s.selbst} ohne gesetztes Ziel`);
      const davor = schritte.slice(Math.max(0, i - 4), i).some(x => x.wer || x.zettel); if (!davor && !s.hinweis && !s.aufgabe) warn.push(`${ort}: Selbst-Aufgabe ohne Erklärung davor`);
      if (!s.aufgabe) warn.push(`${ort}: Selbst-Aufgabe ohne sichtbare Aufgabe (aufgabe)`); }
    if (s.wahl) { const o = s.wahl.opts || []; if (o.length < 2) fehler.push(`${ort}: Wahl mit weniger als zwei Antworten`);
      if (o.some(x => x.ok != null)) { if (!o.some(x => x.ok === true)) fehler.push(`${ort}: Wahl ohne richtige Antwort`); o.forEach((x, j) => { if (x.ok === false && !x.info) fehler.push(`${ort}: falsche Antwort ${j + 1} ohne Erklärung (info)`); }); }
      o.forEach((x, j) => { if (x.melde) kOk(ort, x.melde.k); if (x.dann) liste(f, x.dann, `${pfad}${i}.${j}.`, zustand); }); }
    if (s.wennFrei) { liste(f, s.dann || [], `${pfad}${i}.dann.`, {...zustand}); liste(f, s.sonst || [], `${pfad}${i}.sonst.`, zustand); }
  }); }
function pruefeWetter(ort, w) { if (w.wind && !WIND.includes(w.wind)) fehler.push(`${ort}: Wind ${w.wind} gibt es nicht (${WIND})`);
  if (w.sicht && !SICHT.includes(w.sicht)) fehler.push(`${ort}: Sicht ${w.sicht} gibt es nicht`); if (w.regen && !REGEN.includes(w.regen)) fehler.push(`${ort}: Regen ${w.regen} gibt es nicht (${REGEN})`);
  if (w.zeit && ZEIT.length && !ZEIT.includes(w.zeit)) fehler.push(`${ort}: Zeit ${w.zeit} gibt es nicht`); if (w.von != null && !(w.von >= 0 && w.von <= 7)) fehler.push(`${ort}: Windrichtung ${w.von} (0–7)`); }
const ids = new Set();
for (const f of F.folgen) { if (ids.has(f.id)) fehler.push(`doppelte Folge ${f.id}`); ids.add(f.id);
  if (f.ort && !ORTE.includes(f.ort)) fehler.push(`${f.id}: unbekannter Ort ${f.ort}`); if (f.wetter) pruefeWetter(f.id, f.wetter);
  (f.ziele || []).forEach(k => kOk(f.id + ' ziele', k)); liste(f, f.schritte || [], '', {ziel: false}); }
for (const g of CD.gespraeche) { (g.zeilen || []).forEach((z, i) => [].concat(z.t || [], z.v || []).forEach(t => pruefeText(`Gespräch ${g.id} ${i}`, z.wer, t)));
  [].concat(g.wenn || [], g.nicht || []).filter(x => x.startsWith('frei:')).forEach(x => kOk('Gespräch ' + g.id, x.slice(5))); }
if (process.argv.includes('--info')) console.log(`Fragen in Folgen: ${Object.keys(fragen).length} von 285`);
warn.forEach(w => console.log('Warnung: ' + w));
if (fehler.length) { fehler.forEach(x => console.error('Fehler: ' + x)); process.exit(1); }
console.log(`Folgen geprüft: ${F.folgen.length} Folgen, ${CD.gespraeche.length} Gespräche, keine Fehler.`);
