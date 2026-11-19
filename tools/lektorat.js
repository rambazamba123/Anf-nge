#!/usr/bin/env node
/* Lektorat: Prüfpaket für einen zweiten, unabhängigen Lauf über fertige Folgen und Animationen (Nutzer 17.11.2026:
   „ein zweiter unabhängiger Lauf, dem Logikfehler auffallen … das soll es auch für Grafiken geben“; docs/reise.md HR61).
   Das Werkzeug urteilt nicht selbst über Sinn und Logik. Es baut das Paket, das ein Lektor ohne Vorwissen braucht:
   die Hörfassung (nur das, was man wirklich hört und sieht, in Reihenfolge, mit Zeilennummern), den Zusammenhang
   (vorige und nächste Folge, wer an Bord ist, Story-Logbuch, amtliche Antworten) und auf Wunsch Filmstreifen der Animationen.
   Dazu ein paar mechanische Funde (Anführungszeichen, Reste ohne Buchstaben, Antwort ohne Frage).
   Den Lektor gibt ein frischer Lauf ohne den Schreib-Kontext (Unteragent), Auftrag in podcast/lektorat-auftrag.md.
   Aufruf:  node tools/lektorat.js <folge-id | datei.md> […]          → podcast/lektorat/pakete/<id>.md
            node tools/lektorat.js <folge-id> --bilder                 (dazu Filmstreifen jeder Animation der Folge; braucht python3 -m http.server 8765)
            node tools/lektorat.js --anim <anim-id> [phasen 0,1,2]      (nur eine Animation als Filmstreifen mit Phasentexten)
            node tools/lektorat.js --mechanik [dateien]                 (nur die mechanischen Funde, für den pre-commit; bricht bei Fehlern ab)
   Befunde und was daraus wurde: docs/lektorat/<id>.md. */
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const AUS = R('podcast/lektorat/pakete');
const args = process.argv.slice(2), flag = f => args.includes(f), frei = args.filter(a => !a.startsWith('--'));

/* ---------- Folgen, Reihenfolge, Nummern aus der App ---------- */
const html = fs.readFileSync(R('index.html'), 'utf8'), kurs = fs.readFileSync(R('kurs.js'), 'utf8');
const reihe = (() => { const i = html.indexOf('const HOERREISE = ['), j = html.indexOf('];\n', i); return i < 0 ? [] : [...html.slice(i, j).replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\['([a-z0-9-]+)'/g)].map(x => x[1]); })();
const nrMap = (() => { const m = html.match(/function hoerreiseNr\(id\)[^\n]*\(\{([^}]*)\}\)/); const o = {}; if (m) for (const x of m[1].matchAll(/'([a-z0-9-]+)':\s*'([0-9-]+)'/g)) o[x[1]] = x[2]; return o; })();
const nr = id => nrMap[id] || String(id).replace(/^reise-/, '');
const datei = id => { const m = kurs.match(new RegExp(`'${id}':\\s*\\{datei:\\s*'([^']+)'`)); return m ? m[1] : null; };
const sbf = JSON.parse(fs.readFileSync(R('data/sbf.json'), 'utf8')), frage = n => sbf.find(q => q.n === +n);
const plan = JSON.parse(fs.readFileSync(R('data/reiseplan.json'), 'utf8'));
const logbuch = fs.existsSync(R('docs/geschichte-logbuch.md')) ? fs.readFileSync(R('docs/geschichte-logbuch.md'), 'utf8') : '';

/* ---------- Hörfassung ---------- */
const NAMEN = {HINNERK: 'Hinnerk', SMILLA: 'Smilla', KLABAUTER: 'Klabauter', HARMS: 'Harms', HAFENMEISTER: 'Hilke (Hafenmeisterin)', QUIRIN: 'Quirin', JASPER: 'Jasper', POLIZEI: 'Polizei', BACKBORD: 'Backbord'};
const anrede = t => t.replace(/\{\{anrede:w=([^|]*)\|m=([^|]*)\|n=([^}]*)\}\}/g, '$3');
const ohneCodes = t => anrede(t).replace(/\[\[[^\]]*\]\]/g, '').replace(/\s+/g, ' ').trim();
function hoerfassung(txt) {
  const z = txt.split('\n'), out = [], ids = new Set(), anims = [];
  let i = 0, vert = false, kapitel = 0;
  if (z[0].trim() === '---') { i = 1; while (i < z.length && z[i].trim() !== '---') i++; i++; }
  for (; i < z.length; i++) {
    const roh = z[i], s = roh.trim(), n = i + 1; if (!s || s.startsWith('#')) continue;
    let m;
    for (const c of s.matchAll(/\[\[(WAHL|STOFF|KATALOG|VERTIEFUNG|VORAB|HOERKARTE):([^\]]*)\]\]/g)) for (const x of c[2].matchAll(/sbf:(\d+)/g)) ids.add(+x[1]);
    if ((m = s.match(/^([A-ZÄÖÜ_]+):\s*(.*)$/))) { const t = ohneCodes(m[2]); if (t) out.push(`[Z.${n}]${vert ? ' (Vertiefung)' : ''} ${NAMEN[m[1]] || m[1]}: ${t}`);
      const a = m[2].match(/\[\[AUDIO:\s*([^\]]+)\]\]/); if (a) out.push(`[Z.${n}] — Geräusch: ${a[1]}`); continue; }
    if ((m = s.match(/^\[\[ABSCHNITT:\s*(.*)\]\]$/))) { kapitel++; out.push('', `## Kapitel ${kapitel}: ${m[1]}`); continue; }
    if ((m = s.match(/^\[\[SZENE:\s*(.*)\]\]$/))) { out.push(`[Z.${n}] — Szene (nur Regie, nicht gesprochen): ${m[1]}`); continue; }
    if ((m = s.match(/^\[\[AUDIO:\s*(.*)\]\]$/))) { out.push(`[Z.${n}] — Geräusch: ${m[1]}`); continue; }
    if ((m = s.match(/^\[\[ANIM:\s*([a-z0-9-]+)\s*(?:,\s*(\d+))?\]\]$/i))) { anims.push({id: m[1], p: +(m[2] || 0), z: n}); out.push(`[Z.${n}] — Bild: Animation „${m[1]}“, Phase ${m[2] || 0}`); continue; }
    if ((m = s.match(/^\[\[WAHL:\s*(.*)\]\]$/))) { const t = m[1].split('|').map(x => x.trim()), id = /^(sbf|bin):\d+$/.test(t[0]) ? t.shift() : null;
      out.push(`[Z.${n}] — Antwortknöpfe${id ? ' zu ' + id : ' (Ratefrage, zählt nicht)'}: ${t.map((o, k) => 'ABCD'[k] + ') ' + o.replace(/^\*/, '') + (o.startsWith('*') ? ' ✓' : '')).join(' · ')}`); continue; }
    if ((m = s.match(/^\[\[DENKPAUSE:\s*(\d+)\]\]$/))) { out.push(`[Z.${n}] — Denkpause ${m[1]} s`); continue; }
    if ((m = s.match(/^\[\[VERTIEFUNG:\s*(.*)\]\]$/))) { vert = m[1] !== 'ende'; out.push(vert ? `[Z.${n}] — Vertiefung (hört nur, wer falsch geantwortet hat):` : `[Z.${n}] — Ende der Vertiefung`); continue; }
    if ((m = s.match(/^\[\[HEUTE:\s*(.*)\]\]$/))) { out.push(`[Z.${n}] — Karte auf dem Bildschirm „Heute an Bord“: ${m[1].split('|').map(x => x.trim()).join(' · ')}`); continue; }
    if ((m = s.match(/^\[\[MITNEHMEN:\s*(.*)\]\]$/))) { out.push(`[Z.${n}] — Karte auf dem Bildschirm „Das nimmst du mit“: ${m[1].split('|').map(x => x.trim()).join(' · ')}`); continue; }
    if ((m = s.match(/^\[\[(PAUSE|BILD|SIGNAL):\s*(.*)\]\]$/))) { out.push(`[Z.${n}] — ${m[1] === 'PAUSE' ? 'Pause' : m[1] === 'BILD' ? 'Bild' : 'Signal'}: ${m[2]}`); continue; }
  }
  return {zeilen: out, ids: [...ids].sort((a, b) => a - b), anims};
}
/* ---------- Mechanische Funde (sicher maschinell erkennbar) ---------- */
function mechanik(txt, name) {
  const f = [], z = txt.split('\n'); let vorher = null;
  z.forEach((roh, i) => {
    const m = roh.trim().match(/^([A-ZÄÖÜ_]+):\s*(.*)$/); if (!m) return; const t = ohneCodes(m[2]), n = i + 1;
    const auf = (t.match(/„/g) || []).length, zu = (t.match(/“/g) || []).length;
    if (auf !== zu) f.push({n, art: 'Fehler', t: `Anführungszeichen nicht geschlossen („ ${auf}× / “ ${zu}×): ein Zitat über mehrere Zeilen oder ein Rest wird sonst falsch vorgelesen`});
    if (t && !/[A-Za-zÄÖÜäöüß0-9]/.test(t)) f.push({n, art: 'Fehler', t: `Zeile ohne Wörter („${t}“): wird als Zeichen vorgelesen`});
    if (/^[„“"'.,;:!?…-]+\s/.test(t) || /\s[„“"]$/.test(t)) f.push({n, art: 'Hinweis', t: 'Satzzeichen allein am Anfang oder Ende'});
    if (vorher && /^(Und|Genau|Richtig|Stimmt)[.?!]?$/.test(t) && vorher.wer === m[1]) f.push({n, art: 'Hinweis', t: `„${t}“ antwortet auf die eigene Zeile davor (gleiche Figur)`});
    vorher = {wer: m[1], t};
  });
  return f.map(x => ({...x, datei: name}));
}
/* ---------- Zusammenhang ---------- */
function gesprochen(id, wo, n) {
  const d = datei(id); if (!d || !fs.existsSync(R(d))) return [];
  const l = hoerfassung(fs.readFileSync(R(d), 'utf8')).zeilen.filter(x => /^\[Z\.\d+\] [^—]/.test(x) && !/Vertiefung/.test(x));
  return wo === 'ende' ? l.slice(-n) : l.slice(0, n);
}
function anBord(fnr) {
  const [tg, fo] = fnr.split('-').map(Number), wert = s => { const [a, b] = String(s).split('-').map(Number); return a * 100 + b; }, x = tg * 100 + fo;
  return (plan.crew || []).filter(c => wert(c.ab) <= x && (!c.bis || x <= wert(c.bis) || (c.zurueck && x >= wert(c.zurueck)))).map(c => c.wer + (c.gast ? ' (Gast)' : ''));
}
function logbuchVon(fnr, id) {
  const ks = [fnr, id].filter(Boolean); const teile = logbuch.split(/\n(?=### )/);
  return teile.filter(t => ks.some(k => t.startsWith('### ' + k + ' ') || t.includes('| ' + id + ' '))).join('\n\n').slice(0, 6000);
}
/* ---------- Filmstreifen einer Animation (braucht den Server auf 8765) ---------- */
async function film(animId, phasen, ziel) {
  const pw = require('playwright'), sleep = ms => new Promise(r => setTimeout(r, ms));
  const b = await pw.chromium.launch(); const p = await b.newPage({viewport: {width: 400, height: 500}}); const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://localhost:8765/index.html'); await sleep(2500);
  const info = await p.evaluate(async id => { await nachladen('anim.js'); await ANIM.bereit; ANIM.css(); id = (ANIM.alias && ANIM.alias[id]) || id; const d = ANIM.defs[id]; if (!d) return null;
    document.body.innerHTML = '<div id="c" style="width:400px;height:500px"></div>'; const c = document.getElementById('c'); c.innerHTML = ANIM.html(id); window.__sv = ANIM.start(c);
    return {titel: d.titel, phasen: (d.phasen || []).map(x => ({cap: x.cap || '', t: x.t || '', min: x.min || 4}))}; }, animId);
  if (!info) { await b.close(); return null; }
  const folge = phasen && phasen.length ? phasen : info.phasen.map((_, i) => i), bilder = [];
  for (const ph of folge) { await p.evaluate(ph => ANIM.phase(window.__sv, ph), ph); const dauer = Math.max(3, Math.min(8, (info.phasen[ph] || {}).min || 4));
    for (let t = 0; t < dauer; t += 1) { await sleep(1000); bilder.push({ph, b64: (await p.screenshot()).toString('base64')}); } }
  const g = await b.newPage({viewport: {width: 1240, height: 800}});
  await g.setContent(`<body style="margin:0;background:#222;display:flex;flex-wrap:wrap;gap:4px;width:1240px;font:13px sans-serif">${bilder.map((x, i) => `<div style="position:relative"><img src="data:image/png;base64,${x.b64}" width="200"><span style="position:absolute;left:2px;bottom:4px;background:#fff;padding:0 3px">${i} · P${x.ph}</span></div>`).join('')}</body>`);
  await sleep(400); await g.screenshot({path: ziel, fullPage: true}); await b.close();
  return {...info, folge, n: bilder.length, errs};
}

(async () => {
  fs.mkdirSync(AUS, {recursive: true});
  if (flag('--mechanik')) {
    const ds = frei.length ? frei : [...fs.readdirSync(R('podcast/folgen')).filter(d => /^reise-.*\.md$/.test(d)).map(d => 'podcast/folgen/' + d), ...fs.readdirSync(R('podcast/skripte')).filter(d => /^gold-.*\.md$/.test(d)).map(d => 'podcast/skripte/' + d)];
    const alle = ds.flatMap(d => mechanik(fs.readFileSync(R(d), 'utf8'), d));
    alle.forEach(x => console.log(`${x.art === 'Fehler' ? '✖' : '⚠'} ${x.datei}:${x.n}: ${x.t}`));
    const fe = alle.filter(x => x.art === 'Fehler').length; console.log(`Lektorat (Mechanik): ${ds.length} Folgen, ${fe} Fehler, ${alle.length - fe} Hinweise.`);
    process.exit(fe ? 1 : 0);
  }
  if (flag('--anim')) {
    const id = frei[0], ph = frei[1] ? frei[1].split(',').map(Number) : null, png = path.join(AUS, `bild-${id}.png`);
    const r = await film(id, ph, png); if (!r) { console.log('Animation nicht gefunden: ' + id); process.exit(1); }
    const md = `# Lektorat Animation „${id}“: ${r.titel}\n\nFilmstreifen: \`${path.relative(R('.'), png)}\` (${r.n} Bilder, eins je Sekunde, P = Phase).\n\n## Phasen mit gesprochenem Text und Überschrift\n${r.folge.map(p => `- **P${p}** „${r.phasen[p].cap}“: ${r.phasen[p].t}`).join('\n')}\n${r.errs.length ? '\nKonsole: ' + r.errs.join(' | ') + '\n' : ''}`;
    fs.writeFileSync(path.join(AUS, `anim-${id}.md`), md); console.log(md); return;
  }
  for (const arg of frei) {
    const id = fs.existsSync(R(arg)) ? (reihe.find(x => datei(x) === arg) || path.basename(arg, '.md')) : arg, d = fs.existsSync(R(arg)) ? arg : datei(id);
    if (!d || !fs.existsSync(R(d))) { console.log('Folge nicht gefunden: ' + arg); continue; }
    const txt = fs.readFileSync(R(d), 'utf8'), h = hoerfassung(txt), fnr = nr(id), i = reihe.indexOf(id), vor = reihe[i - 1], nach = reihe[i + 1];
    const titel = (txt.match(/^titel:\s*(.*)$/m) || [])[1] || id;
    const kat = h.ids.map(n => { const q = frage(n); return q ? `- **sbf:${n}** ${q.q}\n  - richtig: ${q.a[0]}\n  - falsch: ${q.a.slice(1).join(' · ')}` : `- sbf:${n} (nicht im Katalog gefunden)`; }).join('\n');
    const mech = mechanik(txt, d);
    let bilder = '';
    if (flag('--bilder')) {
      const gruppen = {}; h.anims.forEach(a => { (gruppen[a.id] = gruppen[a.id] || []).push(a); });
      for (const [aid, liste] of Object.entries(gruppen)) { const png = path.join(AUS, `bild-${id}-${aid}.png`), r = await film(aid, [...new Set(liste.map(a => a.p))], png);
        bilder += r ? `\n### Animation „${aid}“ (${r.titel})\nFilmstreifen: \`${path.relative(R('.'), png)}\`. Im Skript: ${liste.map(a => `Z.${a.z} Phase ${a.p}`).join(', ')}.\n${r.folge.map(p => `- **P${p}** „${r.phasen[p].cap}“: ${r.phasen[p].t}`).join('\n')}\n` : `\n### Animation „${aid}“: nicht gefunden\n`; }
    }
    const md = `# Lektorat-Paket ${fnr} „${titel}“ (${id})

> Für einen unabhängigen Lektor. Erst \`podcast/lektorat-auftrag.md\` lesen, dann dieses Paket. Nicht die Schreibregeln prüfen, sondern ob die Folge für jemanden, der nur zuhört, Sinn ergibt, stimmig ist und fachlich stimmt. Skript: \`${d}\`.

## Zusammenhang
- **Platz in der Reise:** Folge ${fnr}${vor ? `, davor ${nr(vor)} (${vor})` : ', die erste Folge'}${nach ? `, danach ${nr(nach)} (${nach})` : ''}.
- **An Bord laut Reiseplan:** ${anBord(fnr).join(', ') || '–'}. Backbord (Bordkatze) ist immer da und spricht nie.
- **Schluss der Folge davor** (gesprochen):
${vor ? gesprochen(vor, 'ende', 8).map(x => '  ' + x).join('\n') : '  –'}
- **Anfang der Folge danach** (gesprochen):
${nach ? gesprochen(nach, 'anfang', 6).map(x => '  ' + x).join('\n') : '  –'}

## Amtliche Fragen dieser Folge (data/sbf.json, a[0] ist richtig)
${kat || '–'}

## Story-Logbuch (Absicht der Autorin, nicht Teil des Gehörten)
${logbuchVon(fnr, id) || '–'}

## Hörfassung (das hört und sieht man, in dieser Reihenfolge)
${h.zeilen.join('\n')}
${bilder ? '\n## Animationen als Filmstreifen\n' + bilder : ''}
## Mechanische Funde
${mech.length ? mech.map(x => `- ${x.art} Z.${x.n}: ${x.t}`).join('\n') : '- keine'}
`;
    const ziel = path.join(AUS, `${id}.md`); fs.writeFileSync(ziel, md);
    console.log(`${path.relative(R('.'), ziel)}: ${h.zeilen.length} Zeilen Hörfassung, ${h.ids.length} amtliche Fragen, ${h.anims.length} Bild-Einsätze, ${mech.length} mechanische Funde`);
  }
})();
