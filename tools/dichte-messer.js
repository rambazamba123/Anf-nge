#!/usr/bin/env node
/* Dichte-Messer der Hörreise (docs/plan-hoerspiel-neu.md §3.1, podcast/schreibkarte.md). Zeigt Hinweise, bricht nie ab (Nutzer 16.11.2026:
   keine starren Vorgaben; manche Fragen gehen als Bündel, manche brauchen Zeit für sich).
   Aufruf: node tools/dichte-messer.js [datei.md …]   (ohne Angabe: alle Folgen in podcast/folgen/ und die Gold-Folgen in podcast/skripte/)
   Je Folge: Sprechzeit der Geschichte (ohne Harms-Abschnitt und Vertiefungen), neue Fragen und ihre Lernlast, Luft (Zeilen ohne neuen Stoff
   nach einer Auflösung), Redeanteile, längste Kette einer Figur, Aufzählungen, lange Zeilen, Animationen, Fragen bei Harms. */
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const cfg = JSON.parse(fs.readFileSync(R('podcast/audio_config.json'), 'utf8')), ZPS = cfg.sprechtempo_zeichen_pro_sekunde || 13.9;
const kurs = JSON.parse(fs.readFileSync(R('podcast/kursplan-sbf.json'), 'utf8'));
/* Gewicht je Frage aus dem Kursplan: Schwerpunkt = eigene Szene (3), Frage in einer System-Folge = Bündel (1), sonst Regel (2) */
const GEW = {};
for (const t of kurs.teile) for (const k of t.kapitel) for (const f of k.folgen) for (const n of f.fragen || []) GEW[n] = (f.schwerpunkt || []).includes(n) ? 3 : f.form === 'system' ? 1 : 2;
const NAME = {3: 'Szene', 2: 'Regel', 1: 'Bündel'};
let dateien = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!dateien.length) dateien = [...fs.readdirSync(R('podcast/folgen')).filter(d => /^reise-.*\.md$/.test(d)).map(d => 'podcast/folgen/' + d), ...fs.readdirSync(R('podcast/skripte')).filter(d => /^gold-.*\.md$/.test(d)).map(d => 'podcast/skripte/' + d)];
const woerter = t => t.split(/\s+/).filter(Boolean).length;
for (const d of dateien) {
  const zeilen = fs.readFileSync(path.isAbsolute(d) ? d : R(d), 'utf8').split('\n');
  const st = {zeichen: 0, w: 0, spr: {}, fragen: new Set(), harmsFragen: 0, anim: 0, glocken: 0, kette: {wer: '', n: 0, w: 0}, lang: [], aufz: [], kap: [], luft: 0, nachAufl: 0};
  let harms = false, vert = false, kap = null, kette = {wer: '', n: 0, w: 0}, luftZaehler = -1;
  zeilen.forEach((z0, i) => {
    const z = z0.trim(); if (!z || z.startsWith('#') || z === '---' || /^(folge|titel|status|hoerreise|machart):/.test(z)) return;
    let m;
    if ((m = z.match(/^\[\[ABSCHNITT:\s*(.*?)\]\]/))) { harms = /Harms|Logbuch/.test(m[1]); kap = {t: m[1], w: 0, f: new Set(), harms}; st.kap.push(kap); kette = {wer: '', n: 0, w: 0}; return; }
    if (/^\[\[VERTIEFUNG: (?!ende)/.test(z)) { vert = true; return; } if (/^\[\[VERTIEFUNG: ende/.test(z)) { vert = false; luftZaehler = 0; return; }
    if (vert) return;
    for (const c of z.matchAll(/\[\[(STOFF|WAHL|KATALOG):\s*([^\]]*)\]\]/g)) for (const id of c[2].matchAll(/sbf:(\d+)/g)) { if (harms) { if (c[1] === 'WAHL') st.harmsFragen++; } else { st.fragen.add(+id[1]); if (kap) kap.f.add(+id[1]); } }
    if (harms) return;
    /* Eine Animation, die nur die Phase weiterschaltet ([[ANIM: id, 2]] nach [[ANIM: id]] im selben Kapitel), zählt nicht neu */
    if ((m = z.match(/^\[\[ANIM:\s*([a-z0-9-]+)\s*(?:,\s*(\d+))?/i))) { const kid = (kap ? kap.t : '') + '|' + m[1]; st.animK = st.animK || new Set(); if (!(m[2] && st.animK.has(kid))) st.anim++; st.animK.add(kid); return; }
    if (/^\[\[WAHL/.test(z)) { st.glocken++; return; }
    if (!(m = z.match(/^([A-ZÄÖÜ_]+):\s*(.*)$/))) return;
    const txt = m[2].replace(/\[\[[^\]]*\]\]/g, '').replace(/\{\{anrede:w=([^|]*)\|[^}]*\}\}/g, '$1').trim(), w = woerter(txt);
    st.zeichen += txt.length; st.w += w; if (kap) kap.w += w;
    const s = st.spr[m[1]] = st.spr[m[1]] || {z: 0, w: 0}; s.z++; s.w += w;
    if (kette.wer === m[1]) { kette.n++; kette.w += w; } else kette = {wer: m[1], n: 1, w};
    if (kette.w > st.kette.w) st.kette = {...kette, zeile: i + 1};
    if (w > 28) st.lang.push(`Zeile ${i + 1} (${m[1]}, ${w} Wörter)`);
    if (/\b(Erstens|Zweitens|Drittens|Viertens)\b/.test(txt)) st.aufz.push(i + 1);
    /* Luft: die ersten Zeilen nach einer Auflösung, die keinen Merksatz und keine neue Erklärung tragen (grob: kurze Zeilen ohne „Merk“) */
    if (luftZaehler >= 0) { luftZaehler++; if (luftZaehler > 3 && luftZaehler <= 9 && w <= 9 && !/Merk/.test(txt)) st.luft++; if (luftZaehler > 9) luftZaehler = -1; }
  });
  const min = st.zeichen / ZPS / 60, last = [...st.fragen].reduce((s, n) => s + (GEW[n] || 2), 0), ges = st.w || 1;
  const hin = [];
  if (st.fragen.size && min / st.fragen.size < .75) hin.push(`im Schnitt alle ${Math.round(min * 60 / st.fragen.size)} Sekunden eine neue Frage: prüfen, ob das ein echtes Bündel ist`);
  if (min && last / min > 2.6) hin.push(`Lernlast ${last} auf ${min.toFixed(1)} Minuten ist viel: teilen oder Luft einbauen`);
  const top = Object.entries(st.spr).sort((a, b) => b[1].w - a[1].w)[0];
  if (top && top[1].w / ges > .6) hin.push(`${top[0]} spricht ${Math.round(top[1].w / ges * 100)} % der Wörter: klingt das noch nach Gespräch?`);
  if (st.kette.w > 60) hin.push(`${st.kette.wer} redet ${st.kette.n} Zeilen am Stück (${st.kette.w} Wörter, bis Zeile ${st.kette.zeile}): unterbrechen lassen`);
  if (st.aufz.length) hin.push(`Aufzählung („Erstens …“) in Zeile ${st.aufz.join(', ')}: als Handlung erzählen`);
  if (st.lang.length) hin.push(`lange Zeilen: ${st.lang.slice(0, 4).join('; ')}${st.lang.length > 4 ? ' …' : ''}`);
  if (st.fragen.size && st.anim > st.fragen.size + 1) hin.push(`${st.anim} Animations-Einsätze bei ${st.fragen.size} Fragen: höchstens eine je Fakt`);
  if (st.harmsFragen > 5) hin.push(`${st.harmsFragen} Fragen bei Harms am Stück: höchstens fünf, der Rest fragt er später zurück (HR57)`);
  if (st.glocken && !st.luft) hin.push('nach den Auflösungen kaum Luft gefunden (kurze Zeilen ohne neuen Stoff)');
  console.log(`\n${path.basename(d)}: ${min.toFixed(1)} min Sprechtext, ${st.fragen.size} neue Fragen (Lernlast ${last}: ${[...st.fragen].sort((a, b) => a - b).map(n => n + ' ' + NAME[GEW[n] || 2]).join(', ') || '–'})`);
  console.log(`  Redeanteile: ${Object.entries(st.spr).sort((a, b) => b[1].w - a[1].w).map(([k, v]) => `${k} ${Math.round(v.w / ges * 100)} % (⌀ ${(v.w / v.z).toFixed(1)} Wörter)`).join(' · ')}`);
  console.log(`  Kapitel: ${st.kap.filter(k => !k.harms).map(k => `${k.t} ${Math.round(k.w / (ZPS * 60 / 6.2) * 60)} s${k.f.size ? ' [' + [...k.f].join(',') + ']' : ''}`).join(' · ')}`);
  console.log(`  Fragen mit Glocke: ${st.glocken} · Animationen: ${st.anim} · Harms am Ende: ${st.harmsFragen} Fragen`);
  hin.forEach(h => console.log('  Hinweis: ' + h));
  if (!hin.length) console.log('  Keine Hinweise.');
}
