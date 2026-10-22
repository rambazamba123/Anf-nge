/* Prüft den Kursplan des Kajütenfunks (podcast/kursplan-sbf.json) gegen den Katalog (docs/konzept-kajuetenfunk.md, Fassung 3).
   Jede Katalogfrage steht in genau einer Lektion; Vergleichslektionen (Kapitel 9) beziehen sich nur auf schon gelernte Fragen;
   der Baustein wechselt von Lektion zu Lektion; Zeiten werden summiert.
   Aufruf: node tools/kursplan-pruefen.js            Prüfung und Übersicht
           node tools/kursplan-pruefen.js --md       Kursplan als Markdown-Tabelle (für das Konzept)
           node tools/kursplan-pruefen.js --fragen   alle Fragen je Lektion mit allen vier amtlichen Antworten (für Skript und Gegenlese) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), args = process.argv.slice(2);
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'podcast/kursplan-sbf.json'), 'utf8'));
const kat = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sbf.json'), 'utf8')).filter(q => !q.skip);
const QN = new Map(kat.map(q => [q.n, q]));
const fehler = [], warn = [];
const NAME = {garn: 'Garn', stichprobe: 'Stichprobe', detektiv: 'Fehler-Detektiv', tonlabor: 'Ton-Labor', gast: 'Gast', streit: 'Streitgespräch', kopfkino: 'Kopfkino'};
const GAST = {POLIZEI: 'Wasserschutzpolizei', HAFENMEISTER: 'Hafenmeisterin', FISCHER: 'Fischer', FUNK: 'Verkehrszentrale', RANGERIN: 'Rangerin'};
const lektionen = plan.kapitel.flatMap(k => k.lektionen.map(l => ({...l, kap: k})));
const wo = new Map(), ids = new Set();
lektionen.forEach((l, i) => {
  if (ids.has(l.id)) fehler.push(`Lektion ${l.id} doppelt`); ids.add(l.id);
  for (const n of l.fragen) {
    if (!QN.has(n)) fehler.push(`Lektion ${l.id}: Frage ${n} gibt es im Katalog nicht`);
    else if (wo.has(n)) fehler.push(`Frage ${n} steht in ${wo.get(n).id} und in ${l.id}`);
    else wo.set(n, {id: l.id, i});
  }
  if (l.baustein && !plan.bausteine[l.baustein]) fehler.push(`Lektion ${l.id}: unbekannter Baustein „${l.baustein}“`);
  const vor = lektionen[i - 1];
  if (vor && l.baustein && vor.baustein === l.baustein) fehler.push(`Lektion ${l.id}: gleicher Baustein wie ${vor.id} (${l.baustein})`);
  if (l.typ === 'lektion' && !l.fragen.length) warn.push(`Lektion ${l.id} hat keine Fragen`);
});
for (const q of kat) if (!wo.has(q.n)) fehler.push(`Frage ${q.n} ist keiner Lektion zugeordnet`);
/* Vergleichslektionen: nur Bezug auf Fragen aus früheren Lektionen */
lektionen.forEach((l, i) => (l.bezug || []).forEach(n => { const w = wo.get(n); if (!w) fehler.push(`Lektion ${l.id}: Bezug auf unbekannte Frage ${n}`); else if (w.i >= i) fehler.push(`Lektion ${l.id}: Bezug auf Frage ${n} aus der späteren Lektion ${w.id}`); }));
const bildTon = l => l.fragen.filter(n => QN.get(n).img || QN.get(n).sig).length;
const summe = lektionen.reduce((a, l) => a + l.minuten, 0), auftakte = plan.kapitel.filter(k => k.auftakt).length;

if (args.includes('--md')) {
  const zeilen = [];
  for (const k of plan.kapitel) {
    zeilen.push(`\n**Kapitel ${k.nr}: ${k.titel}**${k.auftakt ? ` (Auftakt 3–4 min${k.auftakt_von === 'HARMS' ? ', bei Harms' : ''})` : ''}\n`);
    zeilen.push('| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |', '|---|---|---|---|---|---|');
    for (const l of k.lektionen) {
      const fr = l.fragen.length ? kurz(l.fragen) : l.typ === 'vergleich' ? `Wiederholung (${l.bezug.length} Fragen)` : l.typ === 'praxis' ? 'Praxis' : l.typ === 'kartenaufgabe' ? 'Prüfungsteil Navigation' : '–';
      zeilen.push(`| ${l.id} | ${l.titel}${l.gast ? ` (Gast: ${GAST[l.gast] || l.gast})` : ''} | ${fr} | ${l.fragen.length ? bildTon(l) : '–'} | ${l.baustein ? NAME[l.baustein] : '–'} | ${l.minuten} min |`);
    }
  }
  console.log(zeilen.join('\n').trim());
} else if (args.includes('--fragen')) {
  const out = [`# Kajütenfunk SBF See: alle Fragen je Lektion\n\nAus \`data/sbf.json\` (amtlicher Fragenkatalog SBF See, wie in der App hinterlegt) und \`podcast/kursplan-sbf.json\` erzeugt mit \`node tools/kursplan-pruefen.js --fragen\`. **✓** ist die richtige Antwort, **✗** sind die amtlichen Falschantworten (Grundlage für Fallen und Fallen-Check). [Bild] heißt: Zur Frage gehört eine Abbildung. Tonfolgen: ● kurz, ▬ lang.`];
  for (const k of plan.kapitel) {
    out.push(`\n## Kapitel ${k.nr}: ${k.titel}`);
    for (const l of k.lektionen) {
      out.push(`\n### ${l.id} ${l.titel}`);
      if (!l.fragen.length) { out.push(l.bezug ? `Wiederholung, Bezug auf: ${kurz(l.bezug)}` : '(keine Katalogfragen)'); continue; }
      for (const n of l.fragen) {
        const q = QN.get(n), zus = q.img ? ' [Bild]' : q.sig ? ` [Tonfolge: ${q.sig}]` : '';
        out.push(`\n**${n}.** ${q.q.replace(/\s+/g, ' ')}${zus}\n- ✓ ${q.a[0]}${q.a.slice(1).map(a => `\n- ✗ ${a}`).join('')}`);
      }
    }
  }
  console.log(out.join('\n'));
} else {
  console.log(`Kursplan ${plan.schein.toUpperCase()}, Fassung ${plan.fassung}: ${plan.kapitel.length} Kapitel, ${lektionen.length} Lektionen, ${wo.size} von ${kat.length} Fragen zugeordnet`);
  console.log(`Dauer: Lektionen ${Math.floor(summe / 60)} h ${summe % 60} min, dazu ${auftakte} Kapitel-Auftakte (je 3–4 min)`);
  for (const w of warn) console.log('Warnung  ' + w);
  for (const f of fehler) console.log('FEHLER   ' + f);
  console.log(fehler.length ? `${fehler.length} Fehler.` : 'Keine Fehler.');
}
process.exit(fehler.length ? 1 : 0);

/* 1, 2, 3, 5 → „1–3, 5“ */
function kurz(liste) {
  const s = [...liste].sort((a, b) => a - b), out = [];
  for (let i = 0; i < s.length; i++) { let j = i; while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++; out.push(j - i >= 2 ? `${s[i]}–${s[j]}` : j > i ? `${s[i]}, ${s[j]}` : `${s[i]}`); i = j; }
  return out.join(', ');
}
