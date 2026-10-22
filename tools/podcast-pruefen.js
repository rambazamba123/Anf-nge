/* Prüft Podcast-Skripte (Autorenskript, Ebene A) vor der Audioerzeugung – PODCAST_BIBLE.md §14 (A32, A33).
   Findet unbekannte Regiecodes, fehlende Voice-IDs, nicht freigegebene Aussprache, Abkürzungen ohne Eintrag,
   Klammern und SSML im Sprechtext und zu lange Beiträge. Schätzt Länge und Zahl der Anfragen.
   Lektionsskripte des Hörkurses (Kopf „lektion: 3.2“, Ordner podcast/lektionen/) prüft es zusätzlich nach den Regeln des
   Konzepts (Fassung 3, Abschnitt 9): Katalogsatz je Frage, echte Falschantworten im Fallen-Check, Berichtigung nach jedem
   Irrtum, Revier je Szene, Denkpausen, Merkhilfen, Stimmen je Szene, Rückblick, Zahlen in Worten, Baustein und Dauer laut Kursplan.
   Aufruf: node tools/podcast-pruefen.js [--entwurf] [skript.md ...]
     ohne Dateien: alle Skripte in podcast/skripte/ und podcast/lektionen/
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
  if (!f.voice_id) W(K, `Figur ${id} hat noch keine voice_id${f.wunsch ? ' (Wunsch: ' + f.wunsch + ')' : ''}`);
  else if (f.paket_id && manifest[f.paket_id] && manifest[f.paket_id] !== f.voice_id) W(K, `Figur ${id}: voice_id weicht vom Stimmenpaket ab (${f.paket_id})`);
}
const MAX = (cfg.chunking && cfg.chunking.max_zeichen) || 2000;
const KATS = new Set(cfg.regie_kategorien || []), INT = cfg.intentionen || {};
/* PAUSE, TEMPO, AUDIO: wird der Wert zu einem Audio-Tag, muss der Tag freigegeben sein (A14) */
const tagPruef = (map, kat, wert, ort) => { const e = (map || {})[wert.trim()]; if (e && e.status !== 'freigegeben') S(ort, `Audio-Tag ${e.tag} für [[${kat}: ${wert.trim()}]] ist noch nicht freigegeben (${e.status}, A14)`); };
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

/* Katalogfragen für [[FRAGE: …]], [[KATALOG: …]] und [[FALLE: …]] */
const KAT = {}, KATQ = {};
for (const [k, f] of [['sbf', 'data/sbf.json'], ['bin', 'data/binnen.json']]) {
  try { const d = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')), l = Array.isArray(d) ? d : d.questions; KAT[k] = new Set(l.map(q => q.n)); KATQ[k] = new Map(l.map(q => [q.n, q])); } catch (e) { W(K, `${f} nicht lesbar`); KAT[k] = new Set(); KATQ[k] = new Map(); }
}
/* Kursplan des Hörkurses: welche Fragen in welche Lektion gehören, Reihenfolge, Baustein, Dauer */
const LR = cfg.lektion_regeln || {}, PLAN = new Map(), FRAGE_LEK = new Map();
try {
  const kp = JSON.parse(fs.readFileSync(path.join(ROOT, 'podcast/kursplan-sbf.json'), 'utf8'));
  kp.kapitel.flatMap(k => k.lektionen).forEach((l, i) => { PLAN.set(l.id, {...l, i}); l.fragen.forEach(n => FRAGE_LEK.set('sbf:' + n, l.id)); });
} catch (e) { W(K, 'podcast/kursplan-sbf.json nicht lesbar, Lektionen werden ohne Kursplan geprüft'); }
/* „Enthält der Sprechtext diesen Katalogsatz?“: Anteil der Wörter (ohne Zahlen und Zeichen), die vorkommen */
const woerter = t => t.toLowerCase().replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(w => w.length > 2);
const treffer = (text, satz) => { const t = new Set(woerter(text)), w = woerter(satz); return w.length ? w.filter(x => t.has(x)).length / w.length : 1; };
const IDS = (wert, ort, set) => wert.split(',').map(x => x.trim()).filter(Boolean).flatMap(id => {
  const q = id.match(/^(sbf|bin):(\d+)$/);
  if (!q) { F(ort, `Fragen-ID „${id}“ hat nicht die Form sbf:123 oder bin:123`); return []; }
  if (!KAT[q[1]].has(+q[2])) { F(ort, `Fragen-ID „${id}“ gibt es im Katalog nicht`); return []; }
  if (set) set.add(id); return [id];
});
const katQ = id => { const [k, n] = id.split(':'); return KATQ[k].get(+n); };

/* Skripte */
let dateien = args.filter(a => !a.startsWith('--')).map(a => path.resolve(a));
if (!dateien.length) {
  const alle = [];
  const lauf = d => { if (fs.existsSync(d)) for (const e of fs.readdirSync(d, {withFileTypes: true})) e.isDirectory() ? lauf(path.join(d, e.name)) : e.name.endsWith('.md') && !/^(README|VORLAGE)/i.test(e.name) && alle.push(path.join(d, e.name)); };
  lauf(path.join(ROOT, 'podcast/skripte')); lauf(path.join(ROOT, 'podcast/lektionen')); dateien = alle.sort();
  if (!dateien.length) console.log('Keine Skripte in podcast/skripte/ oder podcast/lektionen/ gefunden. Geprüft wurden Konfiguration und Ausspracheverzeichnis.');
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
  const lek = kopf.lektion ? String(kopf.lektion).trim() : null, P = lek ? PLAN.get(lek) : null;
  if (!kopf.folge && !lek) W(D, 'Kopf ohne „folge:“ oder „lektion:“');
  if (lek && PLAN.size && !P) F(D, `Lektion ${lek} steht nicht im Kursplan`);
  const beitraege = [], fragen = new Set(), offeneBegriffe = new Map(), fehlAbk = new Map();
  const betont = [];
  /* Lektionsprüfung (nur mit „lektion:“ im Kopf) */
  const L = {katalog: new Set(), offen: null, irrtum: new Map(), merk: 0, denk: 0, rueck: new Set(), baustein: null, revier: false, stimmen: new Set(), schritte: 0, zahlen: [], ohneRevier: []};
  const szeneNeu = ort => { if (lek && L.stimmen.size > (LR.stimmen_je_szene_max || 3)) S(ort, `${L.stimmen.size} Stimmen in einer Szene (höchstens ${LR.stimmen_je_szene_max || 3}): ${[...L.stimmen].join(', ')}`); L.stimmen = new Set(); L.revier = false; };
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
      } else if (kat === 'PAUSE') { if (!(cfg.pause_werte || []).includes(wert.trim())) F(ort, `[[PAUSE: ${wert}]] – erlaubt: ${(cfg.pause_werte || []).join(', ')}`); else tagPruef(cfg.pause_tags, kat, wert, ort); }
      else if (kat === 'TEMPO') { if (!(cfg.tempo_werte || []).includes(wert.trim())) F(ort, `[[TEMPO: ${wert}]] – erlaubt: ${(cfg.tempo_werte || []).join(', ')}`); else tagPruef(cfg.tempo_tags, kat, wert, ort); }
      else if (kat === 'AUDIO') tagPruef(cfg.audio_tags, kat, wert, ort);
      else if (kat === 'FIGUR') { if (!FIG[wert.trim()]) F(ort, `[[FIGUR: ${wert}]] ist keine Figur der Konfiguration`); }
      else if (kat === 'FRAGE') IDS(wert, ort, fragen).forEach(id => alleFragen.add(id));
      else if (kat === 'SZENE' || kat === 'SCHRITT') { szeneNeu(ort); if (kat === 'SCHRITT') L.schritte++; }
      else if (kat === 'REVIER') { if (!(LR.revier_werte || []).includes(wert.trim())) F(ort, `[[REVIER: ${wert}]] – erlaubt: ${(LR.revier_werte || []).join(', ')}`); L.revier = true; }
      else if (kat === 'DENKPAUSE') { if (!(LR.denkpause_sekunden || []).includes(wert.trim())) F(ort, `[[DENKPAUSE: ${wert}]] – erlaubt: ${(LR.denkpause_sekunden || []).join(', ')} Sekunden`); L.denk++; }
      else if (kat === 'MERKHILFE') L.merk++;
      else if (kat === 'BAUSTEIN') L.baustein = wert.trim();
      else if (kat === 'KATALOG' || kat === 'FALLE') { const ids = IDS(wert, ort, fragen); ids.forEach(id => alleFragen.add(id)); if (ids.length) L.offen = {kat, ids, ort}; if (kat === 'KATALOG') ids.forEach(id => L.katalog.add(id)); }
      else if (kat === 'IRRTUM') IDS(wert, ort).forEach(id => L.irrtum.set(id, {ort, zeichen: 0}));
      else if (kat === 'BERICHTIGUNG') IDS(wert, ort).forEach(id => { const o = L.irrtum.get(id); if (!o) F(ort, `[[BERICHTIGUNG: ${id}]] ohne vorherigen [[IRRTUM: ${id}]]`); else { const max = (LR.irrtum_berichtigung_max_sekunden || 20) * (cfg.sprechtempo_zeichen_pro_sekunde || 13.9); if (o.zeichen > max) F(ort, `Berichtigung zu ${id} kommt erst nach etwa ${Math.round(o.zeichen / (cfg.sprechtempo_zeichen_pro_sekunde || 13.9))} s (höchstens ${LR.irrtum_berichtigung_max_sekunden || 20} s)`); L.irrtum.delete(id); } });
      else if (kat === 'RUECKBLICK') IDS(wert, ort).forEach(id => L.rueck.add(id + '|' + ort));
      else if (kat === 'VORAB' || kat === 'BILD') IDS(wert, ort);
      else if (kat === 'SIGNAL') { if (!/^[●▬\s]+$/.test(wert.trim())) F(ort, `[[SIGNAL: ${wert}]] – nur ● (kurz) und ▬ (lang)`); }
    }
    if (!m) {
      if (/\[\[\s*PAUSE\s*:\s*dramatisch\s*\]\]/.test(z)) schnitt = true;   /* dramatische Pause = Grenze zwischen zwei Anfragen (A11) */
      if (z.replace(CODE, '').trim()) F(ort, 'Zeile ist weder Sprecherzeile („FIGUR: Text“) noch Regiecode');
      continue;
    }
    const wer = m[1], text = m[2].replace(CODE, ' ').replace(/\s+/g, ' ').trim();
    if (!FIG[wer]) { F(ort, `Sprecher ${wer} steht nicht in der Konfiguration`); continue; }
    if (!FIG[wer].voice_id) S(ort, `Sprecher ${wer} hat noch keine voice_id (im Casting zuordnen)`);
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
    if (lek) {
      L.stimmen.add(wer);
      if (!L.revier) L.ohneRevier.push(ort);
      for (const o of L.irrtum.values()) o.zeichen += text.length;
      if (/\d|°|%|‰|§/.test(text)) L.zahlen.push(ort);
      if (L.offen) {
        const {kat, ids} = L.offen, min = LR.katalog_treffer_min || .8;
        for (const id of ids) {
          const q = katQ(id); if (!q) continue;
          if (kat === 'KATALOG' && treffer(text, q.a[0]) < min) F(ort, `[[KATALOG: ${id}]]: der Satz enthält die amtliche Antwort nicht („${q.a[0].slice(0, 80)}“)`);
          if (kat === 'FALLE' && !q.a.slice(1).some(a => treffer(text, a) >= min)) F(ort, `[[FALLE: ${id}]]: der Satz zitiert keine amtliche Falschantwort`);
        }
        L.offen = null;
      }
    }
    beitraege.push({wer, n: text.length, schnitt}); schnitt = false;
  }
  if (lek) {
    szeneNeu(D);
    for (const [id, o] of L.irrtum) F(o.ort, `[[IRRTUM: ${id}]] wird nie berichtigt`);
    if (L.offen) F(L.offen.ort, `[[${L.offen.kat}]] ohne folgenden Sprechsatz`);
    if (L.ohneRevier.length) S(L.ohneRevier[0], `Sprechtext ohne [[REVIER: …]] in der Szene (${L.ohneRevier.length}×); jede Szene braucht eine Revier-Angabe`);
    if (L.zahlen.length) S(L.zahlen[0], `Ziffern oder Zeichen (°, %, ‰, §) im Sprechtext (${L.zahlen.length}×); Zahlen in Worten schreiben`);
    if (L.merk > (LR.merkhilfen_max || 3)) S(D, `${L.merk} Merkhilfen (höchstens ${LR.merkhilfen_max || 3})`);
    if (L.denk < (LR.denkpausen_min || 2)) S(D, `nur ${L.denk} Denkpausen (mindestens ${LR.denkpausen_min || 2})`);
    if (P) {
      const fehlt = P.fragen.map(n => 'sbf:' + n).filter(id => !L.katalog.has(id));
      if (fehlt.length) S(D, `Katalogsatz fehlt für ${fehlt.length} Fragen der Lektion: ${fehlt.join(', ')}`);
      [...L.katalog].filter(id => FRAGE_LEK.get(id) !== P.id).forEach(id => W(D, `[[KATALOG: ${id}]] gehört laut Kursplan zu Lektion ${FRAGE_LEK.get(id) || '?'}`));
      if (P.baustein && L.baustein && L.baustein !== P.baustein) W(D, `Baustein „${L.baustein}“, laut Kursplan „${P.baustein}“`);
      if (P.baustein && !L.baustein) S(D, `[[BAUSTEIN: …]] fehlt (laut Kursplan „${P.baustein}“)`);
      const frueher = new Set();
      for (const r of L.rueck) { const [id, ort] = r.split('|'), l = PLAN.get(FRAGE_LEK.get(id)); if (!l) continue; if (l.i >= P.i) F(ort, `[[RUECKBLICK: ${id}]] stammt aus Lektion ${l.id}, die noch nicht dran war`); else frueher.add(l.id); }
      if (P.i > 2 && frueher.size < (LR.rueckblick_min_lektionen || 2)) S(D, `Rückblick ruft nur ${frueher.size} frühere Lektion(en) ab (mindestens ${LR.rueckblick_min_lektionen || 2})`);
    }
  }
  for (const [b, n] of offeneBegriffe) S(D, `„${b}“ (${n}×) – Aussprache noch nicht freigegeben (${LEX.get(b).status}, A31)`);
  if (betont.length) W(D, `Großschreibung als Betonung (${betont.length}×): ${betont.join(', ')} – im Hörtest prüfen (A24)`);
  if (GROSS && betont.length > (GROSS.max_pro_skript || 3)) F(D, `zu viel Großschreibung als Betonung (${betont.length}, höchstens ${GROSS.max_pro_skript || 3})`);
  for (const [a, ort] of fehlAbk) S(ort, `„${a}“ sieht aus wie eine Abkürzung ohne Eintrag im Ausspracheverzeichnis (A23)`);
  /* Anfragen schätzen: Beiträge der Reihe nach bündeln, nie einen Beitrag teilen */
  let anfragen = 0, cur = 0;
  for (const b of beitraege) { if (!anfragen || b.schnitt || cur + b.n > MAX) { anfragen++; cur = 0; } cur += b.n; }
  const zeichen = beitraege.reduce((s, b) => s + b.n, 0), min = zeichen / (cfg.sprechtempo_zeichen_pro_sekunde || 13.9) / 60;
  if (P && P.minuten && (min < P.minuten * .7 || min > P.minuten * 1.3)) W(D, `etwa ${min.toFixed(1)} Minuten Sprechtext, geplant sind ${P.minuten} (ohne Denkpausen und Geräusche)`);
  console.log(`${D}: ${beitraege.length} Beiträge, ${zeichen} Zeichen, etwa ${min.toFixed(1)} Minuten, mindestens ${anfragen} Anfragen, ${fragen.size} Katalogfragen${lek ? `, ${L.schritte} Schritte, ${L.denk} Denkpausen, ${L.merk} Merkhilfen` : ''}`);
}
if (dateien.length) console.log(`Abdeckung SBF See: ${[...alleFragen].filter(x => x.startsWith('sbf:')).length} von ${KAT.sbf.size} Fragen`);
for (const w of warn) console.log(`Warnung  ${w}`);
for (const f of fehler) console.log(`FEHLER   ${f}`);
console.log(fehler.length ? `${fehler.length} Fehler${entwurf ? '' : ' – keine Generierung'}.` : `Keine Fehler${entwurf ? ' (Entwurf)' : ''}.`);
process.exit(fehler.length ? 1 : 0);
