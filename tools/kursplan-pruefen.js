/* Prüft den Kursplan des Kajütenfunks (podcast/kursplan-sbf.json, Fassung 5) gegen den Katalog und das finale Konzept
   (docs/konzept-kajuetenfunk.md). Teile → Kapitel → Folgen. Prüft:
   - jede Katalogfrage in genau einer Folge; Teil G enthält genau seinen Fragenbereich (Basisfragen 1–72), Teil S den Rest
   - Form, Baustein, Gast, Revier, Animationen und Recherche-Nummern (docs/recherche-kajuetenfunk.md) gibt es
   - der Baustein und der Rahmen (Dramaturgie) wechseln von Folge zu Folge, jede Folge hat eine Lage; Schwerpunktfragen gehören zur Folge; Länge im Rahmen
   - Vergleichsfolgen beziehen sich nur auf Fragen früherer Folgen
   - die erzeugten Abschnitte im Konzept sind aktuell (sonst Warnung)
   Aufruf: node tools/kursplan-pruefen.js              Prüfung und Übersicht
           node tools/kursplan-pruefen.js --md         Übersichtstabellen (Markdown)
           node tools/kursplan-pruefen.js --steckbriefe  Folgen-Steckbriefe (Markdown)
           node tools/kursplan-pruefen.js --umfang     Umfang je Kapitel: Folgen, Minuten, Fragen (Markdown)
           node tools/kursplan-pruefen.js --animationen  Animationskatalog mit den Folgen, die ihn nutzen (Markdown)
           node tools/kursplan-pruefen.js --fragen     alle Fragen je Folge mit allen amtlichen Antworten und dem Merksatz der App (docs/kurs-fragen-sbf.md)
           node tools/kursplan-pruefen.js --konzept    schreibt Umfang, Übersicht, Animationen und Steckbriefe ins Konzept (zwischen den Markierungen) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), args = process.argv.slice(2);
const KONZEPT = path.join(ROOT, 'docs/konzept-kajuetenfunk.md');
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'podcast/kursplan-sbf.json'), 'utf8'));
const kat = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sbf.json'), 'utf8')).filter(q => !q.skip);
const QN = new Map(kat.map(q => [q.n, q]));
let KARTE = {};   /* Merksätze der App (Feld m), dieselben gelten im Kajütenfunk */
try { KARTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/karten-sbf.json'), 'utf8')).k || {}; } catch (e) {}
const fehler = [], warn = [];
const RECH = new Set((fs.existsSync(path.join(ROOT, 'docs/recherche-kajuetenfunk.md')) ? fs.readFileSync(path.join(ROOT, 'docs/recherche-kajuetenfunk.md'), 'utf8') : '').match(/^\| (R\d+) \|/gm)?.map(z => z.slice(2, -2)) || []);
let FIG = {};
try { FIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'podcast/audio_config.json'), 'utf8')).figuren || {}; } catch (e) { warn.push('podcast/audio_config.json nicht lesbar, Gäste nicht abgeglichen'); }
const L = plan.laenge || {}, FORM = {system: 'System zuerst', regel: 'Regel für Regel', einfuehrung: 'Einführung', praxis: 'Praxis', kartenaufgabe: 'Kartenaufgabe', vergleich: 'Vergleich'};
const RAHMEN = {hoerspiel: 'Hörspiel', toern: 'Törn', unterricht: 'Unterricht', garnabend: 'Garn-Abend', duell: 'Duell', besuch: 'Besuch'};
const NAME = {garn: 'Garn', stichprobe: 'Stichprobe', detektiv: 'Fehler-Detektiv', tonlabor: 'Ton-Labor', gast: 'Gast', streit: 'Streitgespräch', kopfkino: 'Kopfkino'};

/* Folgen der Reihe nach, mit Teil und Kapitel */
const folgen = plan.teile.flatMap(t => t.kapitel.flatMap(k => k.folgen.map(f => ({...f, teil: t, kap: k}))));
const wo = new Map(), ids = new Set();
folgen.forEach((f, i) => {
  if (ids.has(f.id)) fehler.push(`Folge ${f.id} doppelt`); ids.add(f.id);
  if (!plan.formen[f.form]) fehler.push(`Folge ${f.id}: unbekannte Form „${f.form}“`);
  for (const n of f.fragen) {
    if (!QN.has(n)) fehler.push(`Folge ${f.id}: Frage ${n} gibt es im Katalog nicht`);
    else if (wo.has(n)) fehler.push(`Frage ${n} steht in ${wo.get(n).id} und in ${f.id}`);
    else wo.set(n, {id: f.id, i});
    const [von, bis] = f.teil.fragen_bereich || [1, 9999];
    if (n < von || n > bis) fehler.push(`Folge ${f.id}: Frage ${n} liegt außerhalb von Teil ${f.teil.id} (${von}–${bis})`);
  }
  if (['system', 'regel'].includes(f.form) && !f.fragen.length) fehler.push(`Folge ${f.id} (${f.form}) hat keine Fragen`);
  if (f.form === 'vergleich' && !(f.bezug || []).length) fehler.push(`Vergleichsfolge ${f.id} ohne Bezug`);
  for (const n of f.schwerpunkt || []) if (!f.fragen.includes(n)) fehler.push(`Folge ${f.id}: Schwerpunktfrage ${n} gehört nicht zur Folge`);
  if (!f.baustein) warn.push(`Folge ${f.id} ohne Baustein`);
  else if (!plan.bausteine[f.baustein]) fehler.push(`Folge ${f.id}: unbekannter Baustein „${f.baustein}“`);
  const vor = folgen[i - 1];
  if (vor && f.baustein && vor.baustein === f.baustein) fehler.push(`Folge ${f.id}: gleicher Baustein wie ${vor.id} (${f.baustein})`);
  if (f.baustein === 'gast' && !f.gast) fehler.push(`Folge ${f.id}: Baustein Gast ohne Gast`);
  /* Abwechslung (Fassung 5): jede Folge hat einen Rahmen und eine Lage, nie zweimal derselbe Rahmen hintereinander */
  if (!f.rahmen) fehler.push(`Folge ${f.id} ohne Rahmen`);
  else if (!(plan.rahmen || {})[f.rahmen]) fehler.push(`Folge ${f.id}: unbekannter Rahmen „${f.rahmen}“`);
  if (vor && f.rahmen && vor.rahmen === f.rahmen) fehler.push(`Folge ${f.id}: gleicher Rahmen wie ${vor.id} (${f.rahmen})`);
  if (!f.lage) warn.push(`Folge ${f.id} ohne Lage`);
  if (f.rahmen === 'besuch' && !f.gast) warn.push(`Folge ${f.id}: Rahmen Besuch ohne Gast`);
  if (f.gast && !plan.gaeste[f.gast]) fehler.push(`Folge ${f.id}: unbekannter Gast „${f.gast}“`);
  if (f.gast && Object.keys(FIG).length && !FIG[f.gast]) warn.push(`Folge ${f.id}: Gast ${f.gast} fehlt in podcast/audio_config.json`);
  if (!(plan.reviere || []).includes(f.revier)) fehler.push(`Folge ${f.id}: unbekanntes Revier „${f.revier}“`);
  for (const a of f.animation || []) if (!plan.animationen[a]) fehler.push(`Folge ${f.id}: unbekannte Animation „${a}“`);
  for (const r of f.recherche || []) if (!RECH.has(r)) fehler.push(`Folge ${f.id}: Recherche ${r} fehlt in docs/recherche-kajuetenfunk.md`);
  if (L.folge_grenze && f.minuten > L.folge_grenze) warn.push(`Folge ${f.id}: ${f.minuten} min, länger als ${L.folge_grenze}`);
  if (L.folge_ziel_min && f.minuten < L.folge_ziel_min - 2) warn.push(`Folge ${f.id}: nur ${f.minuten} min`);
});
for (const q of kat) if (!wo.has(q.n)) fehler.push(`Frage ${q.n} ist keiner Folge zugeordnet`);
folgen.forEach((f, i) => (f.bezug || []).forEach(n => { const w = wo.get(n); if (!w) fehler.push(`Folge ${f.id}: Bezug auf unbekannte Frage ${n}`); else if (w.i >= i) fehler.push(`Folge ${f.id}: Bezug auf Frage ${n} aus der späteren Folge ${w.id}`); }));
for (const a of Object.keys(plan.animationen)) if (!folgen.some(f => (f.animation || []).includes(a))) warn.push(`Animation „${a}“ wird in keiner Folge benutzt`);

const bildTon = f => f.fragen.filter(n => QN.get(n).img || QN.get(n).sig).length;
const summe = l => l.reduce((a, f) => a + f.minuten, 0);
const hm = m => `${Math.floor(m / 60)} h ${m % 60} min`;
const kurz = liste => { const s = [...liste].sort((a, b) => a - b), out = []; for (let i = 0; i < s.length; i++) { let j = i; while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++; out.push(j - i >= 2 ? `${s[i]}–${s[j]}` : j > i ? `${s[i]}, ${s[j]}` : `${s[i]}`); i = j; } return out.join(', '); };
const kuerze = (t, max) => { t = t.replace(/\s+/g, ' ').trim().replace(/[.?]$/, ''); return t.length > max ? t.slice(0, max - 1).replace(/\s+\S*$/, '') + ' …' : t; };
const ziel = (n, max = 70) => kuerze(QN.get(n).a[0], max);
/* Kurzform der Frage; bei Bild- und Tonfragen nur der Hinweis */
const frageKurz = n => { const q = QN.get(n); return q.img ? '[Bild]' : q.sig ? `[Ton ${q.sig.trim().replace(/\s{2,}/g, ' / ').replace(/\s+/g, ' ')}]` : kuerze(q.q, 60) + '?'; };   /* Gruppen von Tönen mit „/“ trennen */

function uebersicht() {
  const z = [];
  for (const t of plan.teile) {
    const tf = folgen.filter(f => f.teil === t);
    z.push(`\n### Teil ${t.id}: ${t.titel} (für ${t.fuer.join(' und ')}; ${tf.length} Folgen, ${hm(summe(tf))})`);
    for (const k of t.kapitel) {
      z.push(`\n**${k.id} ${k.titel}** – ${k.ueberblick}\n`, '| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |', '|---|---|---|---|---|---|---|---|---|');
      for (const f of k.folgen) {
        const fr = f.fragen.length ? kurz(f.fragen) : f.form === 'vergleich' ? `Bezug: ${f.bezug.length} Fragen` : '–';
        z.push(`| ${f.id} | ${f.titel} | ${FORM[f.form]} | ${RAHMEN[f.rahmen] || '–'} | ${fr} | ${f.fragen.length ? bildTon(f) : '–'} | ${NAME[f.baustein] || '–'}${f.gast ? ` (${plan.gaeste[f.gast]})` : ''} | ${f.revier} | ${f.minuten} |`);
      }
    }
  }
  const rz = Object.keys(RAHMEN).map(r => `${RAHMEN[r]} ${folgen.filter(f => f.rahmen === r).length}`).join(', ');
  z.push(`\n**Zusammen:** ${folgen.length} Folgen, ${hm(summe(folgen))}; ${wo.size} von ${kat.length} Katalogfragen. **Rahmen:** ${rz}.`);
  return z.join('\n').trim();
}

function steckbriefe() {
  const z = [];
  for (const t of plan.teile) {
    z.push(`\n### Teil ${t.id}: ${t.titel}`);
    for (const k of t.kapitel) {
      z.push(`\n#### Kapitel ${k.id}: ${k.titel}\n\n*Kapitelüberblick (Anfang der ersten Folge):* ${k.ueberblick}`);
      for (const f of k.folgen) {
        z.push(`\n**${f.id} ${f.titel}** · ${FORM[f.form]} · ${RAHMEN[f.rahmen] || '–'} · ${f.minuten} min`);
        if (f.lage) z.push(`- **Lage:** ${f.lage}`);
        if (f.fragen.length) z.push(`- **Fragen (${f.fragen.length}):** ${f.fragen.map(n => `${n} ${frageKurz(n)} → ${ziel(n, 55)}`).join(' · ')}`);
        if ((f.schwerpunkt || []).length) z.push(`- **Ausführlich erklären:** ${f.schwerpunkt.join(', ')}; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.`);
        if ((f.bezug || []).length) z.push(`- **Bezug (Wiederholung):** ${kurz(f.bezug)}`);
        z.push(`- **Baustein:** ${NAME[f.baustein] || '–'}${f.gast ? ` mit ${plan.gaeste[f.gast]} (${f.gast})` : ''} · **Revier:** ${f.revier} · **Szene:** ${f.ort}`);
        if ((f.animation || []).length) z.push(`- **Bild und Animation (interaktiv):** ${f.animation.map(a => plan.animationen[a].titel).join(', ')}`);
        z.push(`- **Praxis und Hintergrund:** ${f.praxis}`);
        if ((f.recherche || []).length) z.push(`- **Recherche:** ${f.recherche.join(', ')}`);
        if (f.braucht) z.push(`- **Wartet auf:** ${f.braucht}`);
      }
    }
  }
  return z.join('\n').trim();
}

function umfang() {
  const z = ['| Kapitel | Thema | Folgen | Minuten | Fragen | davon Bild/Ton | Minuten je Frage |', '|---|---|---|---|---|---|---|'];
  const zeile = (id, titel, l, fett) => { const fr = l.reduce((a, f) => a + f.fragen.length, 0), bt = l.reduce((a, f) => a + bildTon(f), 0), m = summe(l), b = x => fett ? `**${x}**` : x;
    return `| ${[id, titel, l.length, m, fr || '–', fr ? bt : '–', fr ? (m / fr).toFixed(1).replace('.', ',') : '–'].map(b).join(' | ')} |`; };
  for (const t of plan.teile) {
    for (const k of t.kapitel) z.push(zeile(k.id, k.titel, folgen.filter(f => f.kap === k)));
    z.push(zeile(`Teil ${t.id}`, t.titel, folgen.filter(f => f.teil === t), true));
  }
  z.push(zeile('zusammen', 'Kurs SBF See (ohne Binnen)', folgen, true));
  return z.join('\n');
}

function animationen() {
  const z = ['| ID | Animation | zeigt | baut auf | Prio | in Folgen |', '|---|---|---|---|---|---|'];
  const nach = Object.entries(plan.animationen).sort((a, b) => (a[1].prio || 9) - (b[1].prio || 9));
  for (const [id, a] of nach) z.push(`| \`${id}\` | ${a.titel} | ${a.zeigt} | ${a.baut_auf} | ${a.prio || '–'} | ${folgen.filter(f => (f.animation || []).includes(id)).map(f => f.id).join(', ') || '–'} |`);
  z.push(`\n**Zusammen:** ${nach.length} Animationen, davon Priorität 1: ${nach.filter(([, a]) => a.prio === 1).length}; ${folgen.filter(f => (f.animation || []).length).length} von ${folgen.length} Folgen haben mindestens eine.`);
  return z.join('\n');
}

function fragenliste() {
  const out = ['# Kajütenfunk: alle Fragen je Folge\n\nAus `data/sbf.json` (amtlicher Fragenkatalog SBF See, wie in der App hinterlegt) und `podcast/kursplan-sbf.json` (Fassung 4) erzeugt mit `node tools/kursplan-pruefen.js --fragen`. **✓** ist die richtige Antwort, **✗** sind die amtlichen Falschantworten (Grundlage für Fallen und Fallen-Check), 💡 ist der Merksatz aus der App (`data/karten-sbf.json`, gilt auch im Kajütenfunk). [Bild] heißt: Zur Frage gehört eine Abbildung. Tonfolgen: ● kurz, ▬ lang. Teil G (Basisfragen) gilt auch für SBF Binnen.'];
  for (const t of plan.teile) for (const k of t.kapitel) {
    out.push(`\n## ${k.id} ${k.titel}`);
    for (const f of k.folgen) {
      out.push(`\n### ${f.id} ${f.titel}`);
      if (!f.fragen.length) { out.push(f.bezug ? `Wiederholung, Bezug auf: ${kurz(f.bezug)}` : '(keine Katalogfragen)'); continue; }
      for (const n of f.fragen) {
        const q = QN.get(n), zus = q.img ? ' [Bild]' : q.sig ? ` [Tonfolge: ${q.sig}]` : '';
        const m = (KARTE['sbf:' + n] || {}).m;
        out.push(`\n**${n}.**${(f.schwerpunkt || []).includes(n) ? ' (Schwerpunkt)' : ''} ${q.q.replace(/\s+/g, ' ')}${zus}\n- ✓ ${q.a[0]}${q.a.slice(1).map(a => `\n- ✗ ${a}`).join('')}${m ? `\n- 💡 ${m}` : ''}`);
      }
    }
  }
  return out.join('\n');
}

/* Erzeugte Abschnitte im Konzept zwischen <!-- NAME:START --> und <!-- NAME:END --> */
const MARK = {UMFANG: umfang, KURSPLAN: uebersicht, ANIMATIONEN: animationen, STECKBRIEFE: steckbriefe};
function konzeptAbschnitte(text, schreiben) {
  let neu = text, veraltet = [];
  for (const [name, fn] of Object.entries(MARK)) {
    const re = new RegExp(`(<!-- ${name}:START[^>]*-->\\n)([\\s\\S]*?)(\\n<!-- ${name}:END -->)`);
    const m = neu.match(re);
    if (!m) { veraltet.push(`${name} (Markierung fehlt)`); continue; }
    const soll = fn();
    if (m[2].trim() !== soll.trim()) { veraltet.push(name); if (schreiben) neu = neu.replace(re, (_, a, __, c) => a + '\n' + soll.trim() + '\n' + c); }   /* Leerzeilen um den Block, damit Tabellen sicher dargestellt werden */
  }
  return {neu, veraltet};
}

if (args.includes('--md')) console.log(uebersicht());
else if (args.includes('--steckbriefe')) console.log(steckbriefe());
else if (args.includes('--animationen')) console.log(animationen());
else if (args.includes('--umfang')) console.log(umfang());
else if (args.includes('--fragen')) console.log(fragenliste());
else if (args.includes('--konzept')) {
  if (fehler.length) { for (const f of fehler) console.log('FEHLER   ' + f); console.log('Erst die Fehler beheben.'); process.exit(1); }
  const {neu, veraltet} = konzeptAbschnitte(fs.readFileSync(KONZEPT, 'utf8'), true);
  fs.writeFileSync(KONZEPT, neu);
  console.log(veraltet.length ? `Konzept aktualisiert: ${veraltet.join(', ')}` : 'Konzept war schon aktuell.');
} else {
  console.log(`Kursplan ${plan.schein.toUpperCase()}, Fassung ${plan.fassung}: ${plan.teile.length} Teile, ${plan.teile.reduce((a, t) => a + t.kapitel.length, 0)} Kapitel, ${folgen.length} Folgen, ${wo.size} von ${kat.length} Fragen zugeordnet`);
  for (const t of plan.teile) { const tf = folgen.filter(f => f.teil === t); console.log(`  Teil ${t.id} ${t.titel}: ${tf.length} Folgen, ${hm(summe(tf))}, ${tf.reduce((a, f) => a + f.fragen.length, 0)} Fragen`); }
  console.log(`Dauer zusammen: ${hm(summe(folgen))}; Folgen im Schnitt ${(summe(folgen) / folgen.length).toFixed(1)} min`);
  console.log(`Rahmen: ${Object.keys(RAHMEN).map(r => `${RAHMEN[r]} ${folgen.filter(f => f.rahmen === r).length}`).join(', ')}`);
  const wartet = folgen.filter(f => f.braucht);
  if (wartet.length) console.log(`Wartet auf Quellen: ${wartet.map(f => f.id).join(', ')}`);
  if (fs.existsSync(KONZEPT)) { const {veraltet} = konzeptAbschnitte(fs.readFileSync(KONZEPT, 'utf8'), false); if (veraltet.length) warn.push(`docs/konzept-kajuetenfunk.md: erzeugte Abschnitte nicht aktuell (${veraltet.join(', ')}); node tools/kursplan-pruefen.js --konzept`); }
  for (const w of warn) console.log('Warnung  ' + w);
  for (const f of fehler) console.log('FEHLER   ' + f);
  console.log(fehler.length ? `${fehler.length} Fehler.` : 'Keine Fehler.');
}
process.exitCode = fehler.length ? 1 : 0;   /* kein process.exit: sonst wird lange Ausgabe in eine Pipe abgeschnitten */
