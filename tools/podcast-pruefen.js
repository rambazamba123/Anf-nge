/* Prüft Podcast-Skripte (Autorenskript, Ebene A) vor der Audioerzeugung – PODCAST_BIBLE.md §14 (A32, A33).
   Findet unbekannte Regiecodes, fehlende Voice-IDs, nicht freigegebene Aussprache, Abkürzungen ohne Eintrag,
   Klammern und SSML im Sprechtext und zu lange Beiträge. Schätzt Länge und Zahl der Anfragen.
   Folgenskripte des Hörkurses (Kopf „folge: S2.2“, Ordner podcast/folgen/) prüft es zusätzlich nach den Regeln des finalen
   Konzepts (Fassung 5, Anhang A): Katalogsatz je Frage, echte Falschantworten im Fallen-Check, Berichtigung nach jedem Irrtum,
   Revier je Szene (und hörbar), Denkpausen, Antwortknöpfe [[WAHL]] mit Fragen-ID (zählen in der Statistik), Vertiefung
   [[VERTIEFUNG]] nach falscher Antwort, Animationen [[ANIM]], Merkhilfen, Stimmen je Szene, Rückblick,
   Zahlen in Worten, Baustein und Dauer laut Kursplan (podcast/kursplan-sbf.json), Hörkarten [[HOERKARTE]] je Frage der Folge.
   Aufruf: node tools/podcast-pruefen.js [--entwurf] [skript.md ...]
     ohne Dateien: alle Skripte in podcast/skripte/ und podcast/folgen/
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
/* Kursplan des Hörkurses: welche Fragen in welche Folge gehören, Reihenfolge, Baustein, Dauer */
const LR = cfg.lektion_regeln || {}, PLAN = new Map(), FRAGE_LEK = new Map();
let ANIMS = null, REVIERE = LR.revier_werte || [];
try {
  const kp = JSON.parse(fs.readFileSync(path.join(ROOT, 'podcast/kursplan-sbf.json'), 'utf8'));
  kp.teile.flatMap(t => t.kapitel.flatMap(k => k.folgen)).forEach((l, i) => { PLAN.set(l.id, {...l, i}); l.fragen.forEach(n => FRAGE_LEK.set('sbf:' + n, l.id)); });
  ANIMS = new Set(Object.keys(kp.animationen || {})); if (kp.reviere) REVIERE = kp.reviere;
} catch (e) { W(K, 'podcast/kursplan-sbf.json nicht lesbar, Folgen werden ohne Kursplan geprüft'); }
/* Revier hörbar machen: Wo die Regel vom Revier abhängt, muss es in der Szene ausgesprochen werden (Konzept §10) */
const REVIER_WORTE = {fahrwasser: /fahrwasser/i, vtg: /verkehrstrennungsgebiet|einbahnweg/i, nok: /kanal/i, frei: /frei(e[nmr]?)?\s+(see|seeraum)|offene[nmr]? see|außerhalb des fahrwassers|weg vom fahrwasser/i, watt: /watt|priel/i, schleuse: /schleuse|schleusn/i,
  hafen: /hafen|steg|pier|liegeplatz|box|anleger|kai/i, 'an Land': /kajüte|kartentisch|telefon|an land|prüfung|büro/i, fluss: /fluss|rhein|elbe|strom|ufer|binnenschiff/i, binnensee: /\bsee\b|binnensee|schilf|badestelle|ufer/i};
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
  lauf(path.join(ROOT, 'podcast/skripte')); lauf(path.join(ROOT, 'podcast/folgen')); dateien = alle.sort();
  if (!dateien.length) console.log('Keine Skripte in podcast/skripte/ oder podcast/folgen/ gefunden. Geprüft wurden Konfiguration und Ausspracheverzeichnis.');
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
  /* Folge des Hörkurses: Kopf „folge: S2.2“ (Teil G, S oder B); „lektion:“ aus Fassung 3 gilt weiter */
  const fid = kopf.folge && /^[GSB]\d/.test(String(kopf.folge).trim()) ? String(kopf.folge).trim() : null;
  const lek = fid || (kopf.lektion ? String(kopf.lektion).trim() : null), P = lek ? PLAN.get(lek) : null;
  if (!kopf.folge && !lek) W(D, 'Kopf ohne „folge:“');
  /* Probefolge (Kopf „status: probe“, Konzept Anhang H): gekürzt, darum sind fehlende Teile der vollen Folge nur Warnungen */
  const PROBE = kopf.status === 'probe', SV = PROBE ? W : S;
  if (lek && PLAN.size && !P) F(D, `Folge ${lek} steht nicht im Kursplan`);
  const beitraege = [], fragen = new Set(), offeneBegriffe = new Map(), fehlAbk = new Map();
  const betont = [];
  /* Folgenprüfung (nur mit „folge: G…/S…/B…“ im Kopf) */
  const L = {katalog: new Set(), offen: null, irrtum: new Map(), merk: 0, denk: 0, rueck: new Set(), baustein: null, revier: false, stimmen: new Set(), schritte: 0, zahlen: [], ohneRevier: [], szeneText: '', szeneRevier: null, szeneOrt: null, wahl: 0, wahlOffen: null, vorab: null, wahlIds: new Map(), vert: null, verts: new Map(), karte: null, karten: new Map()};
  const ENTSCH = LR.denkpause_entscheidung || '5';
  const szeneNeu = ort => {
    if (lek && L.stimmen.size > (LR.stimmen_je_szene_max || 3)) S(ort, `${L.stimmen.size} Stimmen in einer Szene (höchstens ${LR.stimmen_je_szene_max || 3}): ${[...L.stimmen].join(', ')}`);
    if (lek && L.szeneRevier && REVIER_WORTE[L.szeneRevier] && L.szeneText && !REVIER_WORTE[L.szeneRevier].test(L.szeneText)) W(L.szeneOrt, `Revier „${L.szeneRevier}“ wird in der Szene nicht ausgesprochen; das Revier muss man hören (Konzept §10)`);
    L.stimmen = new Set(); L.revier = false; L.szeneText = ''; L.szeneRevier = null; L.szeneOrt = null;
  };
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
      else if (kat === 'SZENE' || kat === 'SCHRITT' || kat === 'ABSCHNITT') { if (L.vert) { F(L.vert.ort, `[[VERTIEFUNG: ${L.vert.id}]] nicht mit [[VERTIEFUNG: ende]] geschlossen`); L.vert = null; } szeneNeu(ort); if (kat !== 'SZENE') { L.schritte++; L.karte = null; } }
      else if (kat === 'HOERKARTE') {
        /* Hörkarte zu einer Frage: steht nach der Folge, eigener kurzer Clip (Konzept §12.3); zählt nicht zur Länge der Folge */
        if (L.vert) { F(L.vert.ort, `[[VERTIEFUNG: ${L.vert.id}]] nicht mit [[VERTIEFUNG: ende]] geschlossen`); L.vert = null; }
        szeneNeu(ort); const [id] = IDS(wert, ort);
        if (id) { if (L.karten.has(id)) F(ort, `Hörkarte ${id} doppelt`); L.karten.set(id, {ort, zeichen: 0, stimmen: new Set(), kat: new Set()}); L.karte = id; }
      }
      else if (kat === 'REVIER') { if (!REVIERE.includes(wert.trim())) F(ort, `[[REVIER: ${wert}]] – erlaubt: ${REVIERE.join(', ')}`); L.revier = true; L.szeneRevier = wert.trim(); L.szeneOrt = ort; }
      else if (kat === 'WAHL') {
        /* Antwortknöpfe im interaktiven Modus (Fassung 5): [[WAHL: sbf:123]] zeigt die vier amtlichen Antworten,
           [[WAHL: sbf:123 | Antwort | *richtige Antwort]] eigene kurze Antworten. Die Fragen-ID ist Pflicht, denn die Antwort zählt
           in der Statistik wie eine Quizantwort (Nutzer, 23.10.2026). Ausnahme: die Wahl nach [[VORAB]] (Tipp, zählt nicht). */
        const teile = wert.split('|').map(x => x.trim()).filter(Boolean), idTeil = /^(sbf|bin):\d+$/.test(teile[0] || '') ? teile.shift() : null;
        const id = idTeil ? IDS(idTeil, ort)[0] : null;
        if (teile.length) { if (teile.length < 2 || teile.length > 4) F(ort, `[[WAHL]] braucht 2 bis 4 Antworten (oder nur die Katalogfrage sbf:123)`); else if (teile.filter(o => o.startsWith('*')).length !== 1) F(ort, `[[WAHL]]: genau eine Antwort mit * als richtig markieren`); }
        else if (!idTeil) F(ort, `[[WAHL]] ohne Antworten und ohne Fragen-ID`);
        const vorab = !!L.vorab;
        if (!idTeil && !vorab && lek) S(ort, `[[WAHL]] ohne Fragen-ID: Die Antwort zählt sonst nicht in der Statistik. Form: [[WAHL: sbf:123 | … | *…]]`);
        if (id && !vorab && lek && !L.wahlIds.has(id)) L.wahlIds.set(id, ort);
        L.vorab = null; L.wahl++; L.wahlOffen = ort;
      }
      else if (kat === 'VERTIEFUNG') {
        /* Tiefer erklären, nur im interaktiven Modus nach falscher Antwort; eigener Clip, zählt nicht zur Länge der Folge */
        if (wert.trim() === 'ende') { if (!L.vert) F(ort, '[[VERTIEFUNG: ende]] ohne Anfang'); else { L.verts.set(L.vert.id, L.vert); L.vert = null; } }
        else { if (L.vert) F(L.vert.ort, `[[VERTIEFUNG: ${L.vert.id}]] nicht geschlossen`); const [id] = IDS(wert, ort);
          if (id) { if (!L.wahlIds.has(id)) F(ort, `[[VERTIEFUNG: ${id}]] ohne vorherige [[WAHL]] zu dieser Frage`); if (L.verts.has(id)) W(ort, `zweite Vertiefung zu ${id}`); L.vert = {id, ort, zeichen: 0, stimmen: new Set()}; } }
      }
      else if (kat === 'ANIM') { const a = wert.split(',')[0].trim(); if (ANIMS && !ANIMS.has(a)) F(ort, `[[ANIM: ${a}]] steht nicht in den Animationen des Kursplans`); }
      else if (kat === 'DENKPAUSE') {
        if (!(LR.denkpause_sekunden || []).includes(wert.trim())) F(ort, `[[DENKPAUSE: ${wert}]] – erlaubt: ${(LR.denkpause_sekunden || []).join(', ')} Sekunden`);
        L.denk++;
        if (L.wahlOffen && wert.trim() !== ENTSCH) W(ort, `Nach [[WAHL]] gehört eine Entscheidungs-Denkpause von ${ENTSCH} Sekunden`);
        if (lek && !L.wahlOffen && !L.karte && wert.trim() === ENTSCH) W(ort, `Entscheidungs-Denkpause (${ENTSCH} s) ohne [[WAHL]]: Im interaktiven Modus erscheinen dort keine Antwortknöpfe (K10)`);
        L.wahlOffen = null;
      }
      else if (kat === 'MERKHILFE') L.merk++;
      else if (kat === 'BAUSTEIN') L.baustein = wert.trim();
      else if (kat === 'KATALOG' || kat === 'FALLE') { const ids = IDS(wert, ort, fragen); ids.forEach(id => alleFragen.add(id)); if (ids.length) L.offen = {kat, ids, ort}; if (kat === 'KATALOG') ids.forEach(id => (L.karte ? L.karten.get(L.karte).kat.add(id) : L.vert ? null : L.katalog.add(id))); }
      else if (kat === 'IRRTUM') IDS(wert, ort).forEach(id => L.irrtum.set(id, {ort, zeichen: 0}));
      else if (kat === 'BERICHTIGUNG') IDS(wert, ort).forEach(id => { const o = L.irrtum.get(id); if (!o) F(ort, `[[BERICHTIGUNG: ${id}]] ohne vorherigen [[IRRTUM: ${id}]]`); else { const max = (LR.irrtum_berichtigung_max_sekunden || 20) * (cfg.sprechtempo_zeichen_pro_sekunde || 13.9); if (o.zeichen > max) F(ort, `Berichtigung zu ${id} kommt erst nach etwa ${Math.round(o.zeichen / (cfg.sprechtempo_zeichen_pro_sekunde || 13.9))} s (höchstens ${LR.irrtum_berichtigung_max_sekunden || 20} s)`); L.irrtum.delete(id); } });
      else if (kat === 'RUECKBLICK') IDS(wert, ort).forEach(id => L.rueck.add(id + '|' + ort));
      else if (kat === 'VORAB') { const ids = IDS(wert, ort); if (ids.length) L.vorab = ids; }
      else if (kat === 'BILD') IDS(wert, ort);
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
      if (L.karte) { const k = L.karten.get(L.karte); k.zeichen += text.length; k.stimmen.add(wer); }
      else if (L.vert) { L.vert.zeichen += text.length; L.vert.stimmen.add(wer); }
      else { L.stimmen.add(wer); L.szeneText += ' ' + text; if (!L.revier) L.ohneRevier.push(ort); }
      if (L.wahlOffen) { W(L.wahlOffen, `[[WAHL]] ohne folgende [[DENKPAUSE: ${ENTSCH}]]: Im interaktiven Modus hält die App dort an`); L.wahlOffen = null; }
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
    beitraege.push({wer, n: text.length, schnitt, karte: !!(lek && L.karte), vert: !!(lek && L.vert)}); schnitt = false;
  }
  if (lek) {
    szeneNeu(D);
    if (L.vert) F(L.vert.ort, `[[VERTIEFUNG: ${L.vert.id}]] nicht mit [[VERTIEFUNG: ende]] geschlossen`);
    for (const [id, o] of L.irrtum) F(o.ort, `[[IRRTUM: ${id}]] wird nie berichtigt`);
    if (L.offen) F(L.offen.ort, `[[${L.offen.kat}]] ohne folgenden Sprechsatz`);
    if (L.ohneRevier.length) S(L.ohneRevier[0], `Sprechtext ohne [[REVIER: …]] in der Szene (${L.ohneRevier.length}×); jede Szene braucht eine Revier-Angabe`);
    if (L.zahlen.length) S(L.zahlen[0], `Ziffern oder Zeichen (°, %, ‰, §) im Sprechtext (${L.zahlen.length}×); Zahlen in Worten schreiben`);
    if (L.merk > (LR.merkhilfen_max || 3)) S(D, `${L.merk} Merkhilfen (höchstens ${LR.merkhilfen_max || 3})`);
    if (L.denk < (LR.denkpausen_min || 2)) S(D, `nur ${L.denk} Denkpausen (mindestens ${LR.denkpausen_min || 2})`);
    if (P) {
      const fehlt = P.fragen.map(n => 'sbf:' + n).filter(id => !L.katalog.has(id));
      if (fehlt.length) SV(D, `Katalogsatz fehlt für ${fehlt.length} Fragen der Folge: ${fehlt.join(', ')}`);
      [...L.katalog].filter(id => FRAGE_LEK.get(id) !== P.id).forEach(id => W(D, `[[KATALOG: ${id}]] gehört laut Kursplan zu Folge ${FRAGE_LEK.get(id) || '?'}`));
      if (P.baustein && L.baustein && L.baustein !== P.baustein) W(D, `Baustein „${L.baustein}“, laut Kursplan „${P.baustein}“`);
      if (P.baustein && !L.baustein) S(D, `[[BAUSTEIN: …]] fehlt (laut Kursplan „${P.baustein}“)`);
      const frueher = new Set();
      for (const r of L.rueck) { const [id, ort] = r.split('|'), l = PLAN.get(FRAGE_LEK.get(id)); if (!l) continue; if (l.i >= P.i) F(ort, `[[RUECKBLICK: ${id}]] stammt aus Folge ${l.id}, die noch nicht dran war`); else frueher.add(l.id); }
      if (P.i > 2 && frueher.size < (LR.rueckblick_min_lektionen || 2)) SV(D, `Rückblick ruft nur ${frueher.size} frühere Folge(n) ab (mindestens ${LR.rueckblick_min_lektionen || 2})`);
      if (['system', 'regel'].includes(P.form) && !L.wahl) W(D, 'keine [[WAHL]]: Im interaktiven Modus gibt es dann keine Antwortknöpfe');
      /* Vertiefung je Antwortknopf zu einer Frage dieser Folge; Fragen früherer Folgen haben schon ihre Hörkarte */
      for (const [id, ort] of L.wahlIds) if (FRAGE_LEK.get(id) === P.id && !L.verts.has(id)) S(ort, `[[WAHL]] zu ${id} ohne [[VERTIEFUNG: ${id}]]: Wer falsch antwortet, bekommt im interaktiven Modus eine tiefere Erklärung`);
      const ohneKarte = P.fragen.map(n => 'sbf:' + n).filter(id => !L.karten.has(id));
      if (ohneKarte.length) SV(D, `Hörkarte fehlt für ${ohneKarte.length} Fragen der Folge: ${ohneKarte.join(', ')}`);
    }
    for (const [id, v] of L.verts) {
      if (v.stimmen.size > 2) W(v.ort, `Vertiefung ${id} mit ${v.stimmen.size} Stimmen (höchstens zwei)`);
      const vmax = LR.vertiefung_max_zeichen || 600;
      if (v.zeichen > vmax) W(v.ort, `Vertiefung ${id}: ${v.zeichen} Zeichen, etwa ${Math.round(v.zeichen / (cfg.sprechtempo_zeichen_pro_sekunde || 13.9))} s (höchstens ${vmax} Zeichen)`);
      if (!v.zeichen) F(v.ort, `Vertiefung ${id} ohne Sprechtext`);
    }
    for (const [id, k] of L.karten) {
      if (!k.kat.has(id)) S(k.ort, `Hörkarte ${id} ohne Katalogsatz ([[KATALOG: ${id}]])`);
      if (k.stimmen.size > 2) W(k.ort, `Hörkarte ${id} mit ${k.stimmen.size} Stimmen (höchstens zwei)`);
      const max = LR.hoerkarte_max_zeichen || 450;
      if (k.zeichen > max) W(k.ort, `Hörkarte ${id}: ${k.zeichen} Zeichen, etwa ${Math.round(k.zeichen / (cfg.sprechtempo_zeichen_pro_sekunde || 13.9))} s (Ziel 20–25 s, höchstens ${max} Zeichen)`);
      if (P && FRAGE_LEK.get(id) !== P.id) W(k.ort, `Hörkarte ${id} gehört laut Kursplan zu Folge ${FRAGE_LEK.get(id) || '?'}`);
    }
  }
  for (const [b, n] of offeneBegriffe) S(D, `„${b}“ (${n}×) – Aussprache noch nicht freigegeben (${LEX.get(b).status}, A31)`);
  if (betont.length) W(D, `Großschreibung als Betonung (${betont.length}×): ${betont.join(', ')} – im Hörtest prüfen (A24)`);
  if (GROSS && betont.length > (GROSS.max_pro_skript || 3)) F(D, `zu viel Großschreibung als Betonung (${betont.length}, höchstens ${GROSS.max_pro_skript || 3})`);
  for (const [a, ort] of fehlAbk) S(ort, `„${a}“ sieht aus wie eine Abkürzung ohne Eintrag im Ausspracheverzeichnis (A23)`);
  /* Anfragen schätzen: Beiträge der Reihe nach bündeln, nie einen Beitrag teilen */
  let anfragen = 0, cur = 0;
  for (const b of beitraege) { if (!anfragen || b.schnitt || cur + b.n > MAX) { anfragen++; cur = 0; } cur += b.n; }
  const zeichen = beitraege.filter(b => !b.karte && !b.vert).reduce((s, b) => s + b.n, 0), min = zeichen / (cfg.sprechtempo_zeichen_pro_sekunde || 13.9) / 60;
  const vertZeichen = beitraege.filter(b => b.vert).reduce((s, b) => s + b.n, 0);
  const kartenZeichen = beitraege.filter(b => b.karte).reduce((s, b) => s + b.n, 0);
  if (P && P.minuten && !PROBE && (min < P.minuten * .7 || min > P.minuten * 1.3)) W(D, `etwa ${min.toFixed(1)} Minuten Sprechtext, geplant sind ${P.minuten} (ohne Denkpausen und Geräusche)`);
  console.log(`${D}: ${beitraege.length} Beiträge, ${zeichen} Zeichen, etwa ${min.toFixed(1)} Minuten, mindestens ${anfragen} Anfragen, ${fragen.size} Katalogfragen${lek ? `, ${L.schritte} Abschnitte, ${L.denk} Denkpausen, ${L.wahl} Antwortknöpfe, ${L.verts.size} Vertiefungen (${vertZeichen} Zeichen), ${L.merk} Merkhilfen, ${L.karten.size} Hörkarten (${kartenZeichen} Zeichen)` : ''}`);
}
if (dateien.length) console.log(`Abdeckung SBF See: ${[...alleFragen].filter(x => x.startsWith('sbf:')).length} von ${KAT.sbf.size} Fragen`);
for (const w of warn) console.log(`Warnung  ${w}`);
for (const f of fehler) console.log(`FEHLER   ${f}`);
console.log(fehler.length ? `${fehler.length} Fehler${entwurf ? '' : ' – keine Generierung'}.` : `Keine Fehler${entwurf ? ' (Entwurf)' : ''}.`);
process.exit(fehler.length ? 1 : 0);
