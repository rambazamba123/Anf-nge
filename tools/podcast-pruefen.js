/* Prüft Podcast-Skripte (Autorenskript, Ebene A) vor der Audioerzeugung – PODCAST_BIBLE.md §14 (A32, A33).
   Findet unbekannte Regiecodes, fehlende Voice-IDs, nicht freigegebene Aussprache, Abkürzungen ohne Eintrag,
   Klammern und SSML im Sprechtext und zu lange Beiträge. Schätzt Länge und Zahl der Anfragen.
   Aufruf: node tools/podcast-pruefen.js [--entwurf] [skript.md ...]
     ohne Dateien: alle Skripte in podcast/skripte/
     streng (Standard): vor jeder Generierung, jede Lücke ist ein Fehler
     --entwurf: beim Schreiben, nicht Freigegebenes (Aussprache, Tags, Modell) nur als Warnung */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), rel = p => path.relative(ROOT, p);
const args = process.argv.slice(2), entwurf = args.includes('--entwurf');
const fehler = [], warn = [];
const F = (ort, t) => fehler.push(`${ort}: ${t}`);             /* immer Fehler */
const S = (ort, t) => (entwurf ? warn : fehler).push(`${ort}: ${t}`);   /* Fehler nur vor der Generierung */
const W = (ort, t) => warn.push(`${ort}: ${t}`);              /* immer Warnung */

/* Konfiguration */
const KONFIG = path.join(ROOT, 'podcast/audio_config.json');
let cfg;
try { cfg = JSON.parse(fs.readFileSync(KONFIG, 'utf8')); } catch (e) { console.error(`${rel(KONFIG)} fehlt oder ist kein gültiges JSON: ${e.message}`); process.exit(1); }
const K = rel(KONFIG);
if (!cfg.modell || !cfg.modell.id) S(K, 'Modell-ID fehlt; vor der Produktion per Hörtest wählen und aus der Doku übernehmen (A9, F9)');
const FIG = cfg.figuren || {};
let manifest = {};
try { manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'audio/stimmen/manifest.json'), 'utf8')).voices || {}; } catch (e) { W(K, 'audio/stimmen/manifest.json nicht lesbar, Stimmen nicht abgeglichen'); }
for (const [id, f] of Object.entries(FIG)) {
  if (!f.voice_id) F(K, `Figur ${id} hat keine voice_id`);
  else if (f.paket_id && manifest[f.paket_id] && manifest[f.paket_id] !== f.voice_id) W(K, `Figur ${id}: voice_id weicht vom Stimmenpaket ab (${f.paket_id})`);
}
const MAX = (cfg.chunking && cfg.chunking.max_zeichen) || 2000;
const KATS = new Set(cfg.regie_kategorien || []), INT = cfg.intentionen || {};
const GROSS = cfg.grossschreibung_betonung && cfg.grossschreibung_betonung.status !== 'aus' ? cfg.grossschreibung_betonung : null;

/* Ausspracheverzeichnis */
const METHODEN = new Set(['literal', 'alias', 'dictionary', 'native_ipa', 'manual_review']), STATI = new Set(['offen', 'geprüft', 'freigegeben']);
const VZ = path.join(ROOT, (cfg.aussprache && cfg.aussprache.datei) || 'podcast/pronunciation_dictionary.md');
const LEX = new Map();
if (!fs.existsSync(VZ)) F(K, `Ausspracheverzeichnis ${rel(VZ)} fehlt`);
else {
  const txt = fs.readFileSync(VZ, 'utf8'), ver = (txt.match(/^Version:\s*(\d+)/m) || [])[1];
  if (String(ver) !== String(cfg.aussprache && cfg.aussprache.version)) F(rel(VZ), `Version ${ver} passt nicht zur Konfiguration (${cfg.aussprache && cfg.aussprache.version})`);
  txt.split('\n').forEach((z, i) => {
    if (!/^\|/.test(z) || /^\|\s*-/.test(z) || /^\|\s*Begriff\s*\|/.test(z)) return;
    const ort = `${rel(VZ)}:${i + 1}`, s = z.split('|').slice(1, -1).map(x => x.trim());
    if (s.length < 4) return F(ort, 'Tabellenzeile unvollständig');
    const [begriff, gesprochen, methode, status, notiz = ''] = s, b = begriff.replace(/`/g, '');
    if (!METHODEN.has(methode)) F(ort, `unbekannte Methode „${methode}“`);
    if (!STATI.has(status)) F(ort, `unbekannter Status „${status}“`);
    if (status === 'freigegeben' && (methode === 'manual_review' || !gesprochen || gesprochen === '?')) F(ort, `„${b}“ ist freigegeben, aber die Lesung ist ungeklärt`);
    if (LEX.has(b)) F(ort, `„${b}“ steht doppelt im Verzeichnis`);
    LEX.set(b, {gesprochen, methode, status, notiz});
  });
}
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LEXRE = [...LEX.keys()].map(b => [b, new RegExp(`(?<![\\p{L}\\p{N}])${esc(b)}(?![\\p{L}\\p{N}])`, 'gu')]);

/* Katalogfragen für [[FRAGE: …]] */
const KAT = {};
for (const [k, f] of [['sbf', 'data/sbf.json'], ['bin', 'data/binnen.json']]) {
  try { const d = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); KAT[k] = new Set((Array.isArray(d) ? d : d.questions).map(q => q.n)); } catch (e) { W(K, `${f} nicht lesbar`); KAT[k] = new Set(); }
}

/* Skripte */
let dateien = args.filter(a => !a.startsWith('--')).map(a => path.resolve(a));
if (!dateien.length) {
  const dir = path.join(ROOT, 'podcast/skripte'), alle = [];
  const lauf = d => { if (fs.existsSync(d)) for (const e of fs.readdirSync(d, {withFileTypes: true})) e.isDirectory() ? lauf(path.join(d, e.name)) : e.name.endsWith('.md') && alle.push(path.join(d, e.name)); };
  lauf(dir); dateien = alle.sort();
  if (!dateien.length) console.log('Keine Skripte in podcast/skripte/ gefunden. Geprüft wurden Konfiguration und Ausspracheverzeichnis.');
}
const CODE = /\[\[\s*([A-ZÄÖÜ]+)\s*(?::\s*([^\]]*?))?\s*\]\]/g;
const ABK = /(?<![\p{L}\p{N}])(?:[A-ZÄÖÜ]{2,}[\p{L}\p{N}]*|[A-ZÄÖÜ][a-zäöüß]+[A-ZÄÖÜ][\p{L}]*)(?![\p{L}\p{N}])/gu;
const alleFragen = new Set();
for (const datei of dateien) {
  const D = rel(datei);
  if (!fs.existsSync(datei)) { F(D, 'Datei fehlt'); continue; }
  const zeilen = fs.readFileSync(datei, 'utf8').split('\n');
  let i = 0, kopf = {}, schnitt = false;
  if (zeilen[0] && zeilen[0].trim() === '---') {
    for (i = 1; i < zeilen.length && zeilen[i].trim() !== '---'; i++) { const m = zeilen[i].match(/^(\w+):\s*(.*)$/); if (m) kopf[m[1]] = m[2]; }
    i++;
  }
  if (!kopf.folge) W(D, 'Kopf ohne „folge:“');
  const beitraege = [], fragen = new Set(), offeneBegriffe = new Map(), fehlAbk = new Map();
  const betont = [];
  for (; i < zeilen.length; i++) {
    const roh = zeilen[i], ort = `${D}:${i + 1}`, z = roh.trim();
    if (!z || z.startsWith('#') || /^<!--.*-->$/.test(z)) continue;
    const m = z.match(/^([A-ZÄÖÜ][A-ZÄÖÜ0-9_]*):\s*(.*)$/);
    const codesTeil = m ? m[2] : z;
    for (const c of codesTeil.matchAll(CODE)) {
      const [, kat, wert = ''] = c;
      if (!KATS.has(kat)) { F(ort, `unbekannter Regiecode [[${kat}]] (A7)`); continue; }
      if (!wert.trim()) { F(ort, `[[${kat}]] ohne Wert`); continue; }
      if (kat === 'PRON') {
        const e = LEX.get(wert.trim());
        if (!e) F(ort, `[[PRON: ${wert}]] steht nicht im Ausspracheverzeichnis`);
        else if (e.status !== 'freigegeben') S(ort, `[[PRON: ${wert}]] ist noch nicht freigegeben (${e.status})`);
      } else if (kat === 'INTENTION') {
        const e = INT[wert.trim()];
        if (!e) W(ort, `[[INTENTION: ${wert}]] hat keinen Audio-Tag und wirkt nur über die Textgestaltung (A6)`);
        else if (e.status !== 'freigegeben') S(ort, `Audio-Tag ${e.tag} für „${wert}“ ist noch nicht freigegeben (${e.status}, A14)`);
      } else if (kat === 'PAUSE') { if (!(cfg.pause_werte || []).includes(wert.trim())) F(ort, `[[PAUSE: ${wert}]] – erlaubt: ${(cfg.pause_werte || []).join(', ')}`); }
      else if (kat === 'TEMPO') { if (!(cfg.tempo_werte || []).includes(wert.trim())) F(ort, `[[TEMPO: ${wert}]] – erlaubt: ${(cfg.tempo_werte || []).join(', ')}`); }
      else if (kat === 'FIGUR') { if (!FIG[wert.trim()]) F(ort, `[[FIGUR: ${wert}]] ist keine Figur der Konfiguration`); }
      else if (kat === 'FRAGE') {
        for (const id of wert.split(',').map(x => x.trim()).filter(Boolean)) {
          const q = id.match(/^(sbf|bin):(\d+)$/);
          if (!q) F(ort, `Fragen-ID „${id}“ hat nicht die Form sbf:123 oder bin:123`);
          else if (!KAT[q[1]].has(+q[2])) F(ort, `Fragen-ID „${id}“ gibt es im Katalog nicht`);
          else { fragen.add(id); alleFragen.add(id); }
        }
      }
    }
    if (!m) {
      if (/\[\[\s*PAUSE\s*:\s*dramatisch\s*\]\]/.test(z)) schnitt = true;   /* dramatische Pause = Grenze zwischen zwei Anfragen (A11) */
      if (z.replace(CODE, '').trim()) F(ort, 'Zeile ist weder Sprecherzeile („FIGUR: Text“) noch Regiecode');
      continue;
    }
    const wer = m[1], text = m[2].replace(CODE, ' ').replace(/\s+/g, ' ').trim();
    if (!FIG[wer]) { F(ort, `Sprecher ${wer} steht nicht in der Konfiguration`); continue; }
    if (!FIG[wer].voice_id) F(ort, `Sprecher ${wer} hat keine voice_id`);
    if (!text) { F(ort, `Beitrag von ${wer} ohne Sprechtext`); continue; }
    if (/[[\]]/.test(text)) F(ort, 'eckige Klammern im Sprechtext; Audio-Tags entstehen nur aus [[INTENTION]] (A5, A14)');
    if (/<[^>]+>/.test(text)) F(ort, 'SSML oder HTML im Sprechtext (A15)');
    if (/\([^)]*\)/.test(text)) W(ort, 'runde Klammern werden mitgesprochen; Regie gehört in [[…]]');
    if (/[*_`#]/.test(text)) W(ort, 'Markdown-Zeichen im Sprechtext');
    if (new RegExp(`(^|\\s)(${Object.keys(FIG).join('|')})\\s*:`, 'i').test(text)) W(ort, 'Sprecherlabel im Sprechtext (A25)');
    if (text.length > MAX) F(ort, `Beitrag mit ${text.length} Zeichen ist länger als eine Anfrage (${MAX}, A11)`);
    for (const [b, re] of LEXRE) { re.lastIndex = 0; if (re.test(text) && LEX.get(b).status !== 'freigegeben') offeneBegriffe.set(b, (offeneBegriffe.get(b) || 0) + 1); }
    for (const a of text.matchAll(ABK)) {
      if (LEX.has(a[0])) continue;
      if (GROSS && /^[A-ZÄÖÜ]+$/.test(a[0])) { betont.push(`${ort} „${a[0]}“`); continue; }   /* Großschreibung als Betonung (A24, VS36) */
      fehlAbk.set(a[0], ort);
    }
    beitraege.push({wer, n: text.length, schnitt}); schnitt = false;
  }
  for (const [b, n] of offeneBegriffe) S(D, `„${b}“ (${n}×) – Aussprache noch nicht freigegeben (${LEX.get(b).status}, A31)`);
  if (betont.length) W(D, `Großschreibung als Betonung (${betont.length}×): ${betont.join(', ')} – im Hörtest prüfen (A24)`);
  if (GROSS && betont.length > (GROSS.max_pro_skript || 3)) F(D, `zu viel Großschreibung als Betonung (${betont.length}, höchstens ${GROSS.max_pro_skript || 3})`);
  for (const [a, ort] of fehlAbk) S(ort, `„${a}“ sieht aus wie eine Abkürzung ohne Eintrag im Ausspracheverzeichnis (A23)`);
  /* Anfragen schätzen: Beiträge der Reihe nach bündeln, nie einen Beitrag teilen */
  let anfragen = 0, cur = 0;
  for (const b of beitraege) { if (!anfragen || b.schnitt || cur + b.n > MAX) { anfragen++; cur = 0; } cur += b.n; }
  const zeichen = beitraege.reduce((s, b) => s + b.n, 0), min = zeichen / (cfg.sprechtempo_zeichen_pro_sekunde || 13.9) / 60;
  console.log(`${D}: ${beitraege.length} Beiträge, ${zeichen} Zeichen, etwa ${min.toFixed(1)} Minuten, mindestens ${anfragen} Anfragen, ${fragen.size} Katalogfragen`);
}
if (dateien.length) console.log(`Abdeckung SBF See: ${[...alleFragen].filter(x => x.startsWith('sbf:')).length} von ${KAT.sbf.size} Fragen`);
for (const w of warn) console.log(`Warnung  ${w}`);
for (const f of fehler) console.log(`FEHLER   ${f}`);
console.log(fehler.length ? `${fehler.length} Fehler${entwurf ? '' : ' – keine Generierung'}.` : `Keine Fehler${entwurf ? ' (Entwurf)' : ''}.`);
process.exit(fehler.length ? 1 : 0);
