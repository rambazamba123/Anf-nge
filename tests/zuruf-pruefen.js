/* Zuruf-Test (docs/fehler-katalog.md Teil B, v5.59): Erkennt szene.js, ob ein Funkwort vom Lautsprecher kommt (Stimme liest „Bravo: Leerlauf“)
   oder vom Menschen (ruft „Bravo“ dazwischen)? Läuft ohne Browser: node tests/zuruf-pruefen.js (im pre-commit, wenn szene.js geändert ist). */
const vm = require('vm'), fs = require('fs'), path = require('path');
const ctx = {document: {}, S: {cfg: {}}, console}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'szene.js'), 'utf8'), ctx);
const f = ctx.window.SZENE._funk, echo = ['Motor aus, nicht nur Leerlauf', 'Im Leerlauf weiterlaufen lassen', 'Öl in die Bilge geben', 'Rauchen ist erlaubt'];
const faelle = [
  ['alfa motor aus nicht nur leerlauf bravo im leerlauf', -1, 'Lautsprecher liest A und B: zählt nicht'],
  ['charlie öl in die bilge delta rauchen ist erlaubt', -1, 'Lautsprecher liest C und D: zählt nicht'],
  ['alfa motor aus nicht nur lehrlauf bravo im lehrlauf', -1, 'Erkennung verschreibt sich (Lehrlauf): zählt trotzdem nicht'],
  ['alfa motor aus nicht nur leerlauf bravo charlie öl', 1, 'Mensch ruft Bravo dazwischen'],
  ['alfa motor aus nicht nur leerlauf bravo bravo im leerlauf', 1, 'Mensch ruft Bravo kurz vor der Stimme'],
  ['delta delta rauchen', 3, 'Delta doppelt'], ['alfa easy', 0, '„Alfa easy“'],
  ['alfa motor aus bravo', 1, 'Funkwort am Ende: wartet kurz (offen)', true], ['bravo', 1, 'nur „Bravo“: wartet kurz (offen)', true]];
let fehler = 0;
for (const [s, soll, name, offen] of faelle) { const r = f(s.split(' '), echo), ok = r.p === soll && (!offen || r.offen); if (!ok) fehler++; console.log((ok ? '✓ ' : '✖ ') + name + (ok ? '' : ' → ' + JSON.stringify(r))); }
const kurz = f('alfa ja bravo nein'.split(' '), ['Ja', 'Nein', 'Vielleicht', 'Nie']); if (kurz.p !== -1) { fehler++; console.log('✖ kurze Antworten (Ja/Nein) als Mensch erkannt'); } else console.log('✓ kurze Antworten (Ja/Nein) vom Lautsprecher');
console.log(fehler ? fehler + ' Fehler.' : 'Zuruf in Ordnung.'); process.exit(fehler ? 1 : 0);
