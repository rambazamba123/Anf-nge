/* Reiseplan prüfen und Übersicht schreiben (O93–O100, Nutzer 29.10.2026).
   Liest data/reise-plan.json, podcast/kursplan-sbf.json und data/sbf.json.
   Prüft: jede Folge des Kursplans mindestens einmal, jede SBF-See-Frage (1–285) und jede Binnen-Frage (73–300) mindestens einmal (Wiederholung erlaubt, Nutzer 29.10.2026), Tage lückenlos.
   Schreibt docs/reise-konzept.md zwischen <!-- PLAN:START --> und <!-- PLAN:END --> (der Text davor und danach bleibt).
   Aufruf: node tools/reise-plan.js [--check] */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const plan = JSON.parse(fs.readFileSync(path.join(root, 'data/reise-plan.json'), 'utf8'));
const kurs = JSON.parse(fs.readFileSync(path.join(root, 'podcast/kursplan-sbf.json'), 'utf8'));
const sbf = JSON.parse(fs.readFileSync(path.join(root, 'data/sbf.json'), 'utf8'));
const FOLGEN = {};
kurs.teile.forEach(t => t.kapitel.forEach(k => k.folgen.forEach(f => { FOLGEN[f.id] = f; })));
const fehler = [], ART = {block: 'Lektion', fahrt: 'Fahrt', gruppe: 'Lage'};
const gesehen = {}, frageTag = {};
const binnen = JSON.parse(fs.readFileSync(path.join(root, 'data/binnen.json'), 'utf8'));
const binTag = {}, hinweise = [];
plan.tage.forEach((t, i) => {
  if (t.tag !== i + 1) fehler.push(`Tag ${t.tag}: erwartet ${i + 1}`);
  if (!plan.akte.some(a => a.id === t.akt)) fehler.push(`Tag ${t.tag}: Akt ${t.akt} unbekannt`);
  t.folgen.forEach(([id, art]) => {
    if (!FOLGEN[id]) return fehler.push(`Tag ${t.tag}: Folge ${id} gibt es im Kursplan nicht`);
    if (!ART[art]) fehler.push(`Tag ${t.tag}: Art „${art}“ unbekannt`);
    if (gesehen[id]) hinweise.push(`Folge ${id} kommt mehrfach vor (Tag ${gesehen[id]} und ${t.tag})`); else gesehen[id] = t.tag;
    if (!plan.folge_wissen[id]) fehler.push(`Folge ${id}: kein Seemannswissen zugeordnet`);
    (FOLGEN[id].fragen || []).forEach(n => { if (frageTag[n]) hinweise.push(`Frage ${n} kommt mehrfach vor`); else frageTag[n] = {tag: t.tag, folge: id, art}; });
  });
  if (t.binnen) { const [a, b] = t.binnen.fragen; for (let n = a; n <= b; n++) if (!binTag[n]) binTag[n] = t.tag; }
  if (!(t.navi in plan.navi_stufen)) fehler.push(`Tag ${t.tag}: Navi-Stufe ${t.navi} unbekannt`);
});
for (let n = 73; n <= 300; n++) if (!binTag[n]) fehler.push(`Binnen-Frage ${n} fehlt`);
Object.keys(FOLGEN).forEach(id => { if (!gesehen[id]) fehler.push(`Folge ${id} fehlt im Reiseplan`); });
sbf.forEach(q => { if (!frageTag[q.n]) fehler.push(`Frage ${q.n} fehlt`); });
if (fehler.length) { console.error('Reiseplan: ' + fehler.length + ' Fehler\n- ' + fehler.join('\n- ')); process.exit(1); }
if (process.argv.includes('--check')) { console.log(`Reiseplan in Ordnung: ${plan.tage.length} Tage, ${Object.keys(frageTag).length} See-Fragen, ${Object.keys(binTag).length} Binnen-Fragen.` + (hinweise.length ? '\nHinweise (erlaubt):\n- ' + hinweise.join('\n- ') : '')); process.exit(0); }

const W = plan.seemannswissen, kurz = (s, n = 90) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const esc = s => String(s).replace(/\|/g, '/');
const zaehl = {}; Object.values(frageTag).forEach(f => { const w = plan.folge_wissen[f.folge]; zaehl[w] = zaehl[w] || {n: 0, block: 0, fahrt: 0, gruppe: 0}; zaehl[w].n++; zaehl[w][f.art]++; });
const arten = {block: 0, fahrt: 0, gruppe: 0}; Object.values(frageTag).forEach(f => arten[f.art]++);
let md = [];
md.push(`*Erzeugt mit \`node tools/reise-plan.js\` aus \`data/reise-plan.json\` (${plan.stand}). Nicht von Hand ändern, sondern die Daten.*`, '');
const dauer = t => t.folgen.reduce((a, [id]) => a + (FOLGEN[id].minuten || 13), 0) + (t.folgen.length || t.binnen ? 6 : 0) + (t.navi && t.navi !== 'ueben' ? 8 : t.navi ? 4 : 0) + 3 * (t.steuern || []).length + 4 * t.knoten.length + 5 * t.mini.length + (t.binnen ? 13 : 0);
const akteTab = plan.akte.map(a => { const ts = plan.tage.filter(t => t.akt === a.id && !t.optional), opt = plan.tage.filter(t => t.akt === a.id && t.optional), min = ts.reduce((x, t) => x + dauer(t), 0);
  return `| ${a.id} | ${a.titel} | ${ts.length}${opt.length ? ' (+' + opt.length + ' freiwillig)' : ''} | ${(min / 60).toFixed(1)} h | ${a.ziel} |`; });
const gesamtMin = plan.tage.filter(t => !t.optional).reduce((x, t) => x + dauer(t), 0);
md.push('### Akte', '', '| Akt | Titel | Tage | Dauer (grob) | Ziel |', '|---|---|---|---|---|', ...akteTab, '',
  `Gesamt etwa ${(gesamtMin / 60).toFixed(0)} Stunden ohne die freiwilligen Segeltage. Die Dauer ist **grob geschätzt**: Folgenminuten aus dem Kursplan plus Fragerunde (6 min), Navigation (8 min, Routine 4 min), Steuerszene (3 min je), Knoten (4 min je), Minispiel (5 min je). Echte Zeiten kommen erst vom Handy-Test. SKS folgt später als eigener Kurs (Nutzer, 29.10.2026).`, '');
md.push('### Zahlen', '', `- ${plan.tage.length} Tage, ${Object.keys(frageTag).length} amtliche Fragen SBF See (davon 72 Basisfragen in Akt 1), dazu ${Object.keys(binTag).length} Binnenfragen (73–300) in Akt 7`,
  `- Lektion (Block der Crew): ${arten.block} Fragen · Fahrt (einzeln unterwegs): ${arten.fahrt} · Lage (mehrere Fragen in einer Situation): ${arten.gruppe}`,
  `- Im Schnitt ${(Object.keys(frageTag).length / plan.tage.length).toFixed(1)} neue Fragen pro Tag`, '');
md.push('### Seemannswissen', '', '| Bereich | Fragen | Lektion | Fahrt | Lage | Tage |', '|---|---|---|---|---|---|');
Object.entries(W).forEach(([k, name]) => { const z = zaehl[k] || {n: 0, block: 0, fahrt: 0, gruppe: 0}; const tage = [...new Set(Object.values(frageTag).filter(f => plan.folge_wissen[f.folge] === k).map(f => f.tag))].sort((a, b) => a - b);
  md.push(`| ${name} | ${z.n} | ${z.block} | ${z.fahrt} | ${z.gruppe} | ${tage.join(', ') || '–'} |`); });
md.push('', '### Navigation, Knoten und Manöver über die Reise', '', '| Stufe | Was | Tage |', '|---|---|---|');
Object.entries(plan.navi_stufen).forEach(([k, v]) => md.push(`| ${k} | ${v} | ${plan.tage.filter(t => t.navi === k).map(t => t.tag).join(', ')} |`));
md.push('', '| Tag | Knoten | Manöver | Minispiel |', '|---|---|---|---|');
plan.tage.filter(t => t.knoten.length || t.manoever.length || t.mini.length).forEach(t => md.push(`| ${t.tag} | ${t.knoten.join(', ') || '–'} | ${t.manoever.join(', ') || '–'} | ${t.mini.join(', ') || '–'} |`));
md.push('', '### Die Tage', '');
let aktAlt = 0;
plan.tage.forEach(t => {
  if (t.akt !== aktAlt) { aktAlt = t.akt; const a = plan.akte.find(x => x.id === t.akt); md.push(`#### Akt ${a.id}: ${a.titel}`, '', `*${a.ziel}*`, ''); }
  const ler = t.folgen.length ? t.folgen.map(([id, art]) => `${FOLGEN[id].titel} (${id}, ${ART[art]}${(FOLGEN[id].fragen || []).length ? ', Fragen ' + FOLGEN[id].fragen.join(', ') : ''})`).join('; ')
    : (t.binnen && t.binnen.fragen.length ? `${t.binnen.thema} (Binnenfragen ${t.binnen.fragen[0]}–${t.binnen.fragen[1]})` : 'Wiederholung und Probeprüfung');
  md.push(`**Tag ${t.tag}: ${t.titel}**${t.optional ? ' (freiwillig)' : ''} · ${t.von === t.nach ? t.nach + ' (Hafentag)' : (t.von || '?') + ' → ' + t.nach + (t.sm ? `, etwa ${t.sm} sm` : '')} · ${t.wetter} · ${t.zeit}`,
    `- Geschichte (Vorschlag): ${t.handlung}`, `- Lernen: ${ler}`,
    `- Navigation: ${plan.navi_stufen[t.navi]}${t.knoten.length ? ' · Knoten: ' + t.knoten.join(', ') : ''}${t.manoever.filter(Boolean).length ? ' · Manöver: ' + t.manoever.filter(Boolean).join(', ') : ''}${t.mini.length ? ' · Minispiel: ' + t.mini.join(', ') : ''}`,
    ...(t.steuern && t.steuern.length ? [`- Selbst steuern: ${t.steuern.join('; ')}`] : []), ...(t.grafik && t.grafik.length ? [`- Grafik: ${t.grafik.join('; ')}`] : []), '');
});
md.push('### Alle Fragen', '', '| Nr. | Frage | Seemannswissen | Tag | Art | Folge |', '|---|---|---|---|---|---|');
sbf.slice().sort((a, b) => a.n - b.n).forEach(q => { const f = frageTag[q.n]; md.push(`| ${q.n} | ${esc(kurz(q.q))} | ${W[plan.folge_wissen[f.folge]]} | ${f.tag} | ${ART[f.art]} | ${f.folge} |`); });

const ziel = path.join(root, 'docs/reise-konzept.md');
let alt = fs.existsSync(ziel) ? fs.readFileSync(ziel, 'utf8') : '<!-- PLAN:START -->\n<!-- PLAN:END -->\n';
const a = alt.indexOf('<!-- PLAN:START -->'), b = alt.indexOf('<!-- PLAN:END -->');
if (a < 0 || b < 0) { console.error('docs/reise-konzept.md: Marken PLAN:START/END fehlen'); process.exit(1); }
fs.writeFileSync(ziel, alt.slice(0, a) + '<!-- PLAN:START -->\n' + md.join('\n') + '\n' + alt.slice(b));
console.log(`docs/reise-konzept.md geschrieben: ${plan.tage.length} Tage, ${Object.keys(frageTag).length} Fragen.`);
