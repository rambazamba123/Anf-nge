#!/usr/bin/env node
/* Sprüchekiste der Hörreise prüfen (docs/reise.md HR25, podcast/sprueche.json).
   1. Die Kiste selbst: feste, eindeutige IDs, bekannte Figuren, gültige Anrede {{anrede:w=…|m=…|n=…}}, Tage 0–7,
      genug Varianten je Lage (regeln.min_varianten, außer „klein“), Summe der Budgets reicht für den Bedarf.
   2. Die Folgen in podcast/folgen/*.md: [[SPRUCH: id]] im Satz der passenden Figur; Budget je Spruch und Höchstzahl je Lage
      über die ganze Reise; nie zweimal in derselben Folge (außer Lagen mit „oft“); zwischen zwei Einsätzen mindestens
      regeln.abstand Folgen (Reihenfolge aus data/reiseplan.json); Sprüche mit „tage“ nur an diesen Reisetagen.
   Aufruf: node tools/sprueche-pruefen.js           Prüfung (Fehler = Abbruch)
           node tools/sprueche-pruefen.js --frei    zusätzlich: unbenutzte Sprüche je Figur und Lage
           node tools/sprueche-pruefen.js --md      Überblick in podcast/figuren.md §11 neu schreiben
           node tools/sprueche-pruefen.js --check   prüfen, ob der Überblick in podcast/figuren.md aktuell ist */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const KISTE = path.join(ROOT, 'podcast/sprueche.json'), FIGUREN = path.join(ROOT, 'podcast/figuren.md');
const FOLGEN = path.join(ROOT, 'podcast/folgen'), PLAN = path.join(ROOT, 'data/reiseplan.json');
const arg = new Set(process.argv.slice(2));
const fehler = [], warn = [];
const F = (o, t) => fehler.push(`${o}: ${t}`), W = (o, t) => warn.push(`${o}: ${t}`);

const K = JSON.parse(fs.readFileSync(KISTE, 'utf8'));
const R = Object.assign({budget: 3, abstand: 2, min_varianten: 5}, K.regeln || {});
const FIG = K.figuren || {};

/* Anrede: {{anrede:w=…|m=…|n=…}}, alle drei Varianten Pflicht */
const ANREDE = /\{\{\s*anrede\s*:([^}]*)\}\}/g;
function anredeTeile(wert) {
  const v = {};
  for (const p of wert.split('|')) { const m = p.match(/^\s*([wmn])\s*=(.*)$/); if (m) v[m[1]] = m[2].trim(); else v.kaputt = true; }
  return v;
}
function anredePruef(text, ort) {
  for (const m of text.matchAll(ANREDE)) {
    const v = anredeTeile(m[1]);
    if (v.kaputt || !v.w || !v.m || !v.n) F(ort, `Anrede „${m[0]}“: Form {{anrede:w=…|m=…|n=…}}, alle drei Varianten nötig`);
  }
  if (/\{\{(?!\s*anrede\s*:)/.test(text)) F(ort, `unbekannter Platzhalter in „${text}“`);
}
const varianten = t => ['w', 'm', 'n'].map(a => t.replace(ANREDE, (_, w) => anredeTeile(w)[a] || ''));
const norm = t => t.toLowerCase().replace(/\[[^\]]*\]/g, ' ').replace(/[^a-zäöüß0-9]+/g, ' ').trim();

/* 1. Die Kiste */
const SPR = new Map(), LAGE = new Map(), sprecherZu = new Map();
for (const [k, f] of Object.entries(FIG)) { if (!f.sprecher || !f.kurz) F(`figuren.${k}`, 'braucht „sprecher“ und „kurz“'); else sprecherZu.set(f.sprecher, k); }
for (const [i, lg] of (K.lagen || []).entries()) {
  const o = `lagen[${i}] ${lg.wer}/${lg.lage}`;
  if (!FIG[lg.wer]) { F(o, `unbekannte Figur „${lg.wer}“`); continue; }
  const key = `${lg.wer}/${lg.lage}`;
  if (LAGE.has(key)) F(o, 'Lage doppelt');
  if (!lg.name) F(o, 'Lage ohne „name“');
  const tageOk = t => Array.isArray(t) && t.length && t.every(x => Number.isInteger(x) && x >= 0 && x <= 7);
  if (lg.tage && !tageOk(lg.tage)) F(o, '„tage“ muss eine Liste von 0 bis 7 sein');
  const s = lg.s || [];
  if (!lg.klein && s.length < R.min_varianten) F(o, `nur ${s.length} Varianten (mindestens ${R.min_varianten}, sonst „klein“: true)`);
  let kap = 0;
  for (const e of s) {
    const oo = `${o} ${e.id || '?'}`;
    if (!e.id || !new RegExp(`^${FIG[lg.wer].kurz}-${lg.lage}-\\d{2}$`).test(e.id)) F(oo, `ID muss „${FIG[lg.wer].kurz}-${lg.lage}-NN“ heißen`);
    if (SPR.has(e.id)) F(oo, 'ID doppelt');
    if (!e.t || !String(e.t).trim()) F(oo, 'ohne Text');
    else anredePruef(e.t, oo);
    if (e.b !== undefined && !(Number.isInteger(e.b) && e.b >= 1)) F(oo, 'Budget „b“ muss eine ganze Zahl ab 1 sein');
    if (e.tage && !tageOk(e.tage)) F(oo, '„tage“ muss eine Liste von 0 bis 7 sein');
    const b = e.b || R.budget; kap += b;
    SPR.set(e.id, {...e, b, wer: lg.wer, lage: key, oft: !!lg.oft, tage: e.tage || lg.tage || null});
  }
  /* doppelte Texte innerhalb einer Figur */
  const texte = new Map();
  for (const e of s) { const n = norm(e.t || ''); if (texte.has(n)) W(o, `${e.id} hat denselben Text wie ${texte.get(n)}`); texte.set(n, e.id); }
  if (lg.max && kap > lg.max) kap = lg.max;
  if (lg.bedarf && kap < lg.bedarf) F(o, `Budgets reichen nicht: ${kap} Einsätze möglich, Bedarf ${lg.bedarf}. Mehr Varianten schreiben`);
  LAGE.set(key, {...lg, kap, n: 0});
}
/* gleicher Text bei zwei Figuren ist erlaubt (Klabauter plappert nach), innerhalb einer Figur nur als Warnung */
const textFig = new Map();
for (const e of SPR.values()) { const k = e.wer + '|' + norm(e.t); if (textFig.has(k) && textFig.get(k) !== e.lage) W(e.id, `gleicher Text wie ${textFig.get(k)} (andere Lage derselben Figur)`); else textFig.set(k, e.lage); }

/* 2. Die Folgen */
const plan = fs.existsSync(PLAN) ? JSON.parse(fs.readFileSync(PLAN, 'utf8')) : {tage: []};
const ORDER = new Map(); let idx = 0;
for (const t of plan.tage || []) for (const f of t.folgen || []) ORDER.set(f.id, idx++);
const CODE = /\[\[\s*SPRUCH\s*:\s*([^\]]*?)\s*\]\]/g;
const nutz = new Map();   /* id → [{folge, ort}] */
const dateien = fs.existsSync(FOLGEN) ? fs.readdirSync(FOLGEN).filter(d => d.endsWith('.md') && d !== 'VORLAGE.md').sort() : [];
for (const d of dateien) {
  const D = `podcast/folgen/${d}`, zeilen = fs.readFileSync(path.join(FOLGEN, d), 'utf8').split('\n');
  let kopf = {}, i = 0;
  if (zeilen[0] && zeilen[0].trim() === '---') { for (i = 1; i < zeilen.length && zeilen[i].trim() !== '---'; i++) { const m = zeilen[i].match(/^(\w+):\s*(.*)$/); if (m) kopf[m[1]] = m[2].trim(); } i++; }
  const folge = kopf.folge || d.replace(/\.md$/, ''), tag = /^\d-\d+$/.test(folge) ? +folge[0] : null;
  for (; i < zeilen.length; i++) {
    const z = zeilen[i].trim(), ort = `${D}:${i + 1}`;
    if (!z || z.startsWith('#')) continue;
    const m = z.match(/^([A-ZÄÖÜ][A-ZÄÖÜ0-9_]*):\s*(.*)$/);
    for (const c of z.matchAll(CODE)) {
      const id = c[1], e = SPR.get(id);
      if (!e) { F(ort, `[[SPRUCH: ${id}]] steht nicht in podcast/sprueche.json`); continue; }
      if (!m) { F(ort, `[[SPRUCH: ${id}]] gehört in den Satz einer Figur`); continue; }
      const wer = sprecherZu.get(m[1]);
      if (wer !== e.wer) F(ort, `[[SPRUCH: ${id}]] gehört ${FIG[e.wer].name}, hier spricht ${m[1]}`);
      const satz = norm(m[2].replace(CODE, ' ').replace(ANREDE, (_, w) => anredeTeile(w).n || ''));
      if (!varianten(e.t).some(v => satz.includes(norm(v)))) W(ort, `Text weicht vom Spruch ${id} ab („${e.t}“)`);
      if (e.tage && tag !== null && !e.tage.includes(tag)) F(ort, `${id} nur an Tag ${e.tage.join(', ')}, hier Tag ${tag}`);
      if (!nutz.has(id)) nutz.set(id, []);
      nutz.get(id).push({folge, ort, i: ORDER.has(folge) ? ORDER.get(folge) : null});
    }
    /* Anrede in Folgen ebenfalls prüfen */
    if (z.includes('{{')) anredePruef(z, ort);
  }
}
for (const [id, liste] of nutz) {
  const e = SPR.get(id), L = LAGE.get(e.lage);
  L.n += liste.length;
  if (liste.length > e.b) F(id, `${liste.length}× benutzt, Budget ${e.b} (${liste.map(x => x.folge).join(', ')})`);
  if (!e.oft) {
    const je = new Map();
    for (const x of liste) { if (je.has(x.folge)) F(x.ort, `${id} zweimal in Folge ${x.folge}`); je.set(x.folge, x); }
    const mit = [...je.values()].filter(x => x.i !== null).sort((a, b) => a.i - b.i);
    for (let k = 1; k < mit.length; k++) if (mit[k].i - mit[k - 1].i - 1 < R.abstand) F(mit[k].ort, `${id} schon in ${mit[k - 1].folge}; dazwischen müssen mindestens ${R.abstand} Folgen liegen`);
  }
}
for (const [k, L] of LAGE) if (L.max && L.n > L.max) F(k, `Lage ${L.n}× benutzt, höchstens ${L.max}`);

/* Überblick für podcast/figuren.md §11 */
function md() {
  const z = [];
  z.push(`Erzeugt mit \`node tools/sprueche-pruefen.js --md\` aus \`podcast/sprueche.json\` (${SPR.size} Sprüche in ${LAGE.size} Lagen). Budget = Einsätze auf der ganzen Reise mit 46 Folgen; zwischen zwei Einsätzen desselben Spruchs liegen mindestens ${R.abstand} Folgen.`);
  z.push('', '**Erkennungssätze**', '', '| Satz | Figur | Budget | benutzt | Hinweis |', '|---|---|---|---|---|');
  for (const e of SPR.values()) if (e.e) z.push(`| „${e.t}“ | ${FIG[e.wer].name} | ${e.b} | ${(nutz.get(e.id) || []).length} | ${[e.tage ? 'nur Tag ' + e.tage.join(', ') : '', e.hinweis || ''].filter(Boolean).join('; ')} |`);
  z.push('', '**Lagen je Figur**', '', '| Figur | Lage | Varianten | möglich | Bedarf | benutzt |', '|---|---|---|---|---|---|');
  for (const L of LAGE.values()) if (!/\/erkennung$/.test(L.wer + '/' + L.lage)) z.push(`| ${FIG[L.wer].name} | ${L.name} | ${(L.s || []).length} | ${L.kap}${L.max ? ' (max)' : ''} | ${L.bedarf || '–'} | ${L.n} |`);
  return z.join('\n');
}
const START = '<!-- SPRUECHE:START -->', ENDE = '<!-- SPRUECHE:END -->';
if (arg.has('--md') || arg.has('--check')) {
  const s = fs.readFileSync(FIGUREN, 'utf8'), a = s.indexOf(START), b = s.indexOf(ENDE);
  if (a < 0 || b < a) F('podcast/figuren.md', `Marken ${START} und ${ENDE} fehlen`);
  else {
    const neu = s.slice(0, a + START.length) + '\n' + md() + '\n' + s.slice(b);
    if (arg.has('--md')) { if (neu !== s) fs.writeFileSync(FIGUREN, neu); console.log('podcast/figuren.md §11 geschrieben.'); }
    else if (neu !== s) F('podcast/figuren.md', 'Überblick der Sprüchekiste veraltet: node tools/sprueche-pruefen.js --md');
  }
}
if (arg.has('--frei')) {
  for (const L of LAGE.values()) {
    const frei = (L.s || []).filter(e => !nutz.has(e.id)).map(e => `${e.id} „${e.t}“`);
    if (frei.length) console.log(`${FIG[L.wer].name} / ${L.name}: ${frei.length} frei\n  ` + frei.join('\n  '));
  }
}
for (const w of warn) console.log('⚠ ' + w);
for (const f of fehler) console.log('✖ ' + f);
const benutzt = [...nutz.values()].reduce((a, l) => a + l.length, 0);
console.log(`Sprüchekiste: ${SPR.size} Sprüche, ${LAGE.size} Lagen, ${dateien.length} Folgen gelesen, ${benutzt} Einsätze. ${fehler.length} Fehler, ${warn.length} Hinweise.`);
process.exit(fehler.length ? 1 : 0);
