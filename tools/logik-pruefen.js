/* Logik-Wächter für die Hörreise-Folgen (docs/reise.md HR34, v5.50).
   Findet die Fehlerarten, die der Nutzer am 08.11.2026 beim Hören bemerkt hat, soweit eine Maschine sie finden kann.
   Ob ein Satz Sinn ergibt, prüft das nicht: Das bleibt die Leseprobe vor jeder Vertonung.

   Fehler (Commit bricht ab):
   - Eine Figur spricht, die laut data/reiseplan.json (crew: ab, bis, zurueck, gast) gar nicht an Bord ist.
   - Harms sagt „Morgen wieder“ oder „bis morgen“, obwohl er am selben Tag in einer späteren Folge noch einmal dran ist.
   Hinweise:
   - Derselbe Satz kommt in einer Folge zweimal vor (ohne Vertiefung, Hörkarte und Harms' amtliche Texte).
   - Nach einer Denkpause fehlt die Auflösung (Glocke oder Satz der Crew in den nächsten Zeilen).
   - „Frage an dich“ ohne Denkpause oder Wahl danach.
   - Ein Spruch aus der Kiste, dessen Hinweis einen Anlass nennt („wenn …“), steht ohne diesen Anlass in der Nähe (nur bekannte Fälle, Liste ANLASS).

   Aufruf: node tools/logik-pruefen.js            (alle podcast/folgen/reise-*.md)
           node tools/logik-pruefen.js datei.md    (nur diese) */
const fs = require('fs'), path = require('path');
const wurzel = path.resolve(__dirname, '..');
const plan = JSON.parse(fs.readFileSync(path.join(wurzel, 'data/reiseplan.json'), 'utf8'));
const ordner = path.join(wurzel, 'podcast/folgen');
const dateien = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(ordner).filter(f => /^reise-\d+-\d+\.md$/.test(f)).map(f => path.join(ordner, f));
const CODE = /\[\[\s*([A-ZÄÖÜ]+)\s*(?::\s*([^\]]*?))?\s*\]\]/g;
const ohneCodes = s => s.replace(CODE, ' ').replace(/\{\{[^}]*\}\}/g, ' ').replace(/\s+/g, ' ').trim();
const nr = id => { const [t, n] = String(id).split('-').map(Number); return t * 100 + n; };
/* Sprüche, die nur mit Anlass passen: Spruch-ID → Wörter, von denen eines in den drei Zeilen davor stehen muss */
const ANLASS = {'hi-erkennung-04': /frech|Klookschieter|du alter|besserwiss|Klugschei|Opa|lahm/i};

const fehler = [], hinweise = [];
const F = (d, z, t) => fehler.push(`✖ ${path.basename(d)}:${z}: ${t}`), H = (d, z, t) => hinweise.push(`• ${path.basename(d)}:${z}: ${t}`);

/* Wer ist wann an Bord? */
const anBord = (wer, id) => {
  const c = (plan.crew || []).find(x => x.wer === wer); if (!c) return true;   /* Gäste ohne Eintrag (Hafenmeisterin, Harms am Telefon) prüft das nicht */
  const n = nr(id), drin = n >= nr(c.ab) && (!c.bis || n <= nr(c.bis)), zurueck = c.zurueck && n >= nr(c.zurueck);
  const gast = Array.isArray(c.gast) ? c.gast.includes(id) : false;
  return drin || zurueck || gast;
};
/* Folgen mit Harms je Tag (für „Morgen wieder“) */
const lese = d => fs.readFileSync(d, 'utf8');
const folgeId = (txt, d) => { const m = txt.match(/^folge:\s*(\S+)/m); return m ? m[1] : path.basename(d).replace(/^reise-|\.md$/g, ''); };
const alle = fs.readdirSync(ordner).filter(f => /^reise-\d+-\d+\.md$/.test(f)).map(f => { const t = lese(path.join(ordner, f)); return {id: folgeId(t, f), harms: /^HARMS:/m.test(t)}; });

for (const d of dateien) {
  const txt = lese(d), id = folgeId(txt, d), zeilen = txt.split('\n');
  let bereich = null, kopf = txt.startsWith('---'), kopfZu = false;
  const saetze = new Map();
  zeilen.forEach((roh, i) => {
    const z = roh.trim(), zn = i + 1;
    if (kopf && !kopfZu) { if (i > 0 && z === '---') kopfZu = true; return; }
    if (!z || z.startsWith('#')) return;
    const v = z.match(/\[\[\s*(VERTIEFUNG|HOERKARTE)\s*:\s*([^\]]*?)\s*\]\]/);
    if (v) { bereich = v[1] === 'VERTIEFUNG' && v[2] === 'ende' ? null : v[1]; return; }
    if (/\[\[\s*ABSCHNITT/.test(z)) bereich = null;
    const m = z.match(/^([A-ZÄÖÜ][A-ZÄÖÜ0-9_]*):\s*(.*)$/); if (!m) {
      if (/\[\[\s*DENKPAUSE/.test(z)) {
        /* Auflösung: in den nächsten fünf Zeilen eine Glocke, eine Vertiefung oder ein Satz */
        const rest = zeilen.slice(i + 1, i + 6).join('\n');
        if (!/Schiffsglocke|VERTIEFUNG|^[A-ZÄÖÜ]+:/m.test(rest)) H(d, zn, 'nach der Denkpause fehlt die Auflösung');
      }
      return;
    }
    const wer = m[1], text = ohneCodes(m[2]);
    if (!anBord(wer.toLowerCase(), id)) F(d, zn, `${wer} spricht, ist laut Reiseplan in ${id} aber nicht an Bord`);
    if (wer === 'HARMS' && /morgen wieder|bis morgen/i.test(text)) {
      const [tag] = id.split('-'), spaeter = alle.filter(f => f.id.split('-')[0] === tag && nr(f.id) > nr(id) && f.harms);
      if (spaeter.length) F(d, zn, `Harms sagt „${text.match(/morgen wieder|bis morgen/i)[0]}“, ruft am selben Tag aber noch in ${spaeter.map(f => f.id).join(', ')} an`);
    }
    if (/Frage an dich/i.test(text) && !bereich) {
      const rest = zeilen.slice(i + 1, i + 5).join('\n');
      if (!/DENKPAUSE|WAHL/.test(rest)) H(d, zn, '„Frage an dich“ ohne Denkpause oder Wahl danach');
    }
    for (const [sid, re] of Object.entries(ANLASS)) if (m[2].includes(`SPRUCH: ${sid}`)) {
      const davor = zeilen.slice(Math.max(0, i - 3), i).join(' ');
      if (!re.test(davor)) H(d, zn, `Spruch ${sid} ohne seinen Anlass in den Zeilen davor (siehe podcast/sprueche.json, Hinweis)`);
    }
    if (bereich || wer === 'HARMS') return;
    /* fast derselbe Satz: mindestens fünf Wörter und 60 % gleiche Wörter (Reihenfolge egal) */
    text.split(/(?<=[.!?:])\s+/).forEach(s => {
      const w = new Set(s.toLowerCase().replace(/[^a-zäöüß ]/g, ' ').split(/\s+/).filter(x => x.length > 1));
      if (w.size < 5) return;
      for (const [k, alt] of saetze) {
        const gleich = [...w].filter(x => alt.w.has(x)).length, quote = gleich / new Set([...w, ...alt.w]).size;
        if (quote >= .6) { H(d, zn, `fast derselbe Satz wie in Zeile ${alt.zn}: „${s.slice(0, 60)}“`); return; }
      }
      saetze.set(s, {w, zn});
    });
  });
}
hinweise.forEach(h => console.log(h));
fehler.forEach(f => console.log(f));
console.log(`Logik-Wächter: ${dateien.length} Folgen, ${fehler.length} Fehler, ${hinweise.length} Hinweise.`);
process.exit(fehler.length ? 1 : 0);
