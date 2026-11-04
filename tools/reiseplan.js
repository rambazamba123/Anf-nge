/* Reiseplan „In sieben Tagen zum SBF See“ (data/reiseplan.json) prüfen und als Tabelle in docs/reise.md schreiben (zwischen <!-- PLAN:START --> und <!-- PLAN:END -->).
   Prüft: jede der 285 SBF-See-Fragen genau einmal abends; Kompetenzen gibt es; was angewendet wird, wurde vorher (oder in derselben Folge) eingeführt;
   alle Prüfungsknoten bis Tag 5; Navigationsstufen N0–N6 kommen vor. Aufruf: node tools/reiseplan.js [--check] */
const fs = require('fs'), R = __dirname + '/../';
const P = JSON.parse(fs.readFileSync(R + 'data/reiseplan.json', 'utf8')), K = JSON.parse(fs.readFileSync(R + 'data/kompetenzen.json', 'utf8'));
const KM = Object.fromEntries(K.kompetenzen.map(k => [k.id, k]));
const R2 = s => !s ? [] : String(s).split(',').flatMap(p => { const [a, b] = p.split('-').map(Number); return b ? Array.from({length: b - a + 1}, (_, i) => a + i) : [a]; });
const fehler = [], wo = {}, eingef = new Set(), knotenTag = {}, navi = new Set(); let n = 0;
for (const t of P.tage) for (const f of t.folgen) { n++;
  for (const q of R2(f.fragen)) (wo[q] = wo[q] || []).push(f.id);
  for (const k of [].concat(f.stoff || [], f.anwenden || [])) if (!KM[k]) fehler.push(`${f.id}: unbekannte Kompetenz ${k}`);
  (f.stoff || []).forEach(k => eingef.add(k));
  for (const k of f.anwenden || []) if (!eingef.has(k)) fehler.push(`${f.id}: wendet ${k} an, ohne dass es vorher eingeführt wurde`);
  for (const k of f.knoten || []) knotenTag[k] = t.nr;
  if (f.navi) String(f.navi).match(/N\d/g).forEach(x => navi.add(x)); if (t.navi) (t.navi.match(/N\d/g) || []).forEach(x => navi.add(x)); }
for (let q = 1; q <= 285; q++) { if (!wo[q]) fehler.push(`Frage ${q} kommt nicht vor`); else if (wo[q].length > 1) fehler.push(`Frage ${q} mehrfach: ${wo[q]}`); }
for (const k of ['acht', 'palstek', 'kreuz', 'schot', 'stopper', 'webelein', 'rundtoern', 'klampe']) { if (!knotenTag[k]) fehler.push(`Knoten ${k} fehlt`); else if (knotenTag[k] > 5) fehler.push(`Knoten ${k} erst an Tag ${knotenTag[k]} (Ziel: bis Tag 5)`); }
for (let i = 0; i <= 6; i++) if (!navi.has('N' + i)) fehler.push(`Navigationsstufe N${i} fehlt`);
if (fehler.length) { fehler.forEach(x => console.error('Fehler: ' + x)); process.exit(1); }
if (process.argv.includes('--check')) { console.log(`Reiseplan in Ordnung: ${P.tage.length} Tage, ${n} Folgen, 285 Fragen.`); process.exit(0); }
const DU = {zuhoeren: '👂 zuhören', ausguck: '👀 Ausguck', handgriffe: '✋ Handgriffe', mitmachen: '🪢 mitmachen', pinne: '🧭 kurz an die Pinne', selbst: '⛵ selbst', fuehren: '⚓ du führst', pruef: '📝 Prüfung'};
const ART = {kajuete: '🌧️', garn: '🧶', hafen: '⚓', fahrt: '☀️', anker: '🌊', schleuse: '🚧', nacht: '🌙', nebel: '🌫️', sturm: '⛈️', pruef: '📝', abschied: '👋'};
let md = '';
for (const t of P.tage) {
  md += `\n### Tag ${t.nr}: ${t.titel}\n**Wo:** ${t.ort} · **Du:** ${t.du}${t.knoten ? ' · **Knoten:** ' + t.knoten.join(', ') : ''}${t.navi ? ' · **Navigation:** ' + t.navi : ''}\n\n**Geschichte:** ${t.story}\n\n**Kiste:** ${t.set} · **Haken:** ${t.haken}\n\n| Folge | | Titel | Ort | Du | Was passiert | Fragen |\n|---|---|---|---|---|---|---|\n`;
  for (const f of t.folgen) md += `| ${f.id} | ${ART[f.art] || ''} | ${f.titel} | ${f.ort} | ${DU[f.du] || f.du} | ${f.text} | ${f.fragen || '–'} |\n`;
}
md += `\n**Bonus:** ${P.bonus.map(b => `${b.titel}: ${b.text}`).join(' · ')}\n`;
const ziel = R + 'docs/reise.md', alt = fs.readFileSync(ziel, 'utf8'), a = alt.indexOf('<!-- PLAN:START -->'), b = alt.indexOf('<!-- PLAN:END -->');
if (a < 0 || b < 0) { console.error('docs/reise.md: Marken PLAN:START/END fehlen'); process.exit(1); }
fs.writeFileSync(ziel, alt.slice(0, a) + '<!-- PLAN:START -->\n' + md + alt.slice(b));
console.log(`docs/reise.md geschrieben: ${P.tage.length} Tage, ${n} Folgen, 285 Fragen.`);
