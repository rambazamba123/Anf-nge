/* Reiseplan „In sieben Tagen zum SBF See“ (data/reiseplan.json) prüfen und als Tabelle in docs/reise.md schreiben (zwischen <!-- PLAN:START --> und <!-- PLAN:END -->).
   Prüft: jede der 285 SBF-See-Fragen genau einmal; Kompetenzen gibt es; was angewendet wird, wurde vorher (oder in derselben Folge) eingeführt;
   alle Prüfungsknoten bis Tag 5; Navigationsstufen N0–N6 kommen vor.
   v5.24 (Hörreise, E25, docs/reise.md §7): Themenblöcke aus podcast/kursplan-sbf.json: Feld bloecke stimmt mit den Fragen überein; System-Blöcke werden nicht geteilt
   (Regel-Blöcke dürfen Regel für Regel verteilt werden); höchstens drei Blöcke je Folge; ein Überblick kommt vor (oder in) der Folge seiner Blöcke;
   Crew: Folgen nennen nur Figuren, die schon an Bord sind; sobald es sie gibt: Ablaufmuster (muster) und Abschluss-Abfrage (abfrage) nie zweimal hintereinander gleich.
   Aufruf: node tools/reiseplan.js [--check] */
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
/* Themenblöcke (Kursplan): welche Fragen zusammen erklärt werden und in welcher Lehrform */
const KP = JSON.parse(fs.readFileSync(R + 'podcast/kursplan-sbf.json', 'utf8')), BL = {}, QB = {};
for (const t of KP.teile) for (const c of t.kapitel) for (const b of c.folgen) if (b.fragen.length) { BL[b.id] = b; b.fragen.forEach(q => { QB[q] = b.id; }); }
const ALLE = P.tage.flatMap(t => t.folgen), POS = Object.fromEntries(ALLE.map((f, i) => [f.id, i])), heimat = {}, warn = [];
for (const f of ALLE) { const soll = [...new Set(R2(f.fragen).map(q => QB[q]))].sort(), ist = [...(f.bloecke || [])].sort();
  if (soll.join() !== ist.join()) fehler.push(`${f.id}: Feld bloecke (${ist}) passt nicht zu den Fragen (${soll})`);
  if (soll.length > 3) fehler.push(`${f.id}: ${soll.length} Themenblöcke, höchstens drei`);
  for (const b of soll) (heimat[b] = heimat[b] || []).push(f.id); }
for (const [b, wo2] of Object.entries(heimat)) if (wo2.length > 1) { if (BL[b].form === 'system') fehler.push(`System-Block ${b} „${BL[b].titel}“ ist geteilt (${wo2}); er wird zusammen erklärt`); else warn.push(`Regel-Block ${b} verteilt auf ${wo2}`); }
/* Überblicke vor den Einzelheiten */
const UID = new Set(); for (const u of P.ueberblicke || []) { if (UID.has(u.id)) fehler.push(`Überblick ${u.id} doppelt`); UID.add(u.id); if (POS[u.folge] == null) { fehler.push(`Überblick ${u.id}: Folge ${u.folge} gibt es nicht`); continue; }
  for (const b of u.bloecke) { if (!BL[b]) { fehler.push(`Überblick ${u.id}: Block ${b} gibt es nicht`); continue; } for (const h of heimat[b] || []) if (POS[h] < POS[u.folge]) fehler.push(`Block ${b} (${h}) kommt vor seinem Überblick ${u.id} (${u.folge})`); } }
/* Crew wächst: Klabauter und Quirin erst ab ihrer Folge (Feld wer in Folgen, Abschluss-Abfrage „klabauter“) */
const AB = Object.fromEntries((P.crew || []).filter(c => c.ab).map(c => [c.wer, POS[c.ab]]));
for (const c of P.crew || []) if (c.ab && POS[c.ab] == null) fehler.push(`Crew ${c.wer}: Folge ${c.ab} gibt es nicht`);
const ABFRAGEN = ['harms', 'logbuch', 'klabauter'];
ALLE.forEach((f, i) => { const v = ALLE[i - 1];
  for (const w of f.wer || []) if (AB[w] != null && i < AB[w]) fehler.push(`${f.id}: ${w} ist da noch nicht an Bord`);
  if (f.abfrage && !ABFRAGEN.includes(f.abfrage)) fehler.push(`${f.id}: Abfrage ${f.abfrage} unbekannt (${ABFRAGEN})`);
  if (f.abfrage === 'klabauter' && i < AB.klabauter) fehler.push(`${f.id}: Klabauter-Quiz, bevor Klabauter an Bord ist`);
  if (v && f.muster && f.muster === v.muster) fehler.push(`${f.id}: dasselbe Ablaufmuster wie ${v.id} (${f.muster})`);
  if (v && f.abfrage && f.abfrage === v.abfrage) fehler.push(`${f.id}: dieselbe Abschluss-Abfrage wie ${v.id}`); });
if (fehler.length) { fehler.forEach(x => console.error('Fehler: ' + x)); process.exit(1); }
if (process.argv.includes('--warn')) warn.forEach(x => console.log('Hinweis: ' + x));
if (process.argv.includes('--check')) { console.log(`Reiseplan in Ordnung: ${P.tage.length} Tage, ${n} Folgen, 285 Fragen.`); process.exit(0); }
const DU = {zuhoeren: '👂 zuhören', ausguck: '👀 Ausguck', handgriffe: '✋ Handgriffe', mitmachen: '🪢 mitmachen', pinne: '🧭 kurz an die Pinne', selbst: '⛵ selbst', fuehren: '⚓ du führst', pruef: '📝 Prüfung'};
const ART = {kajuete: '🌧️', garn: '🧶', hafen: '⚓', fahrt: '☀️', anker: '🌊', schleuse: '🚧', nacht: '🌙', nebel: '🌫️', sturm: '⛈️', pruef: '📝', abschied: '👋'};
let md = '';
for (const t of P.tage) {
  md += `\n### Tag ${t.nr}: ${t.titel}\n**Wo:** ${t.ort} · **Du:** ${t.du}${t.knoten ? ' · **Knoten:** ' + t.knoten.join(', ') : ''}${t.navi ? ' · **Navigation:** ' + t.navi : ''}\n\n**Geschichte:** ${t.story}\n\n**Kiste:** ${t.set} · **Haken:** ${t.haken}\n\n| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |\n|---|---|---|---|---|---|---|\n`;
  for (const f of t.folgen) { const u = (P.ueberblicke || []).filter(x => x.folge === f.id).map(x => `<br>🧭 *Überblick: ${x.titel}*`).join('');
    md += `| ${f.id} | ${ART[f.art] || ''} | ${f.titel} | ${f.ort} | ${DU[f.du] || f.du} | ${f.text}${u} | ${f.fragen || '–'}${(f.bloecke || []).length ? '<br>' + f.bloecke.map(b => `${b} ${BL[b].form === 'system' ? '◼' : '▸'}`).join(' ') : ''} |\n`; }
}
md += `\n**Bonus:** ${P.bonus.map(b => `${b.titel}: ${b.text}`).join(' · ')}\n`;
const ziel = R + 'docs/reise.md', alt = fs.readFileSync(ziel, 'utf8'), a = alt.indexOf('<!-- PLAN:START -->'), b = alt.indexOf('<!-- PLAN:END -->');
if (a < 0 || b < 0) { console.error('docs/reise.md: Marken PLAN:START/END fehlen'); process.exit(1); }
fs.writeFileSync(ziel, alt.slice(0, a) + '<!-- PLAN:START -->\n' + md + alt.slice(b));
console.log(`docs/reise.md geschrieben: ${P.tage.length} Tage, ${n} Folgen, 285 Fragen.`);
