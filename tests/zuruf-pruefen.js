/* Zuruf-Test (docs/fehler-katalog.md Teil B; seit v5.61): Vorgelesen wird mit Alfa, Bravo, Charlie, Delta, ausgelöst nur mit A, B, C oder D.
   Prüft szene.js ohne Browser: node tests/zuruf-pruefen.js (im pre-commit, wenn szene.js geändert ist). */
const vm = require('vm'), fs = require('fs'), path = require('path');
const ctx = {document: {}, S: {cfg: {}}, console}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'szene.js'), 'utf8'), ctx);
const f = ctx.window.SZENE._buchstabe, text = ctx.window.SZENE.text;
const faelle = [
  ['alfa motor aus nicht nur leerlauf bravo im leerlauf charlie öl in die bilge delta rauchen ist erlaubt', -1, 'Lautsprecher liest mit Funkwörtern: zählt nicht'],
  ['die der das', -1, 'Artikel zählen nicht'],
  ['b', 1, '„B“'], ['be', 1, '„Be“ (so schreibt es die Erkennung)'], ['zeh', 2, '„Zeh“ = C'], ['de', 3, '„De“ = D'],
  ['a easy', 0, '„A easy“'], ['charlie öl in b die bilge', 1, 'Mensch sagt „B“ mitten in die Stimme'],
  ['alfa', -1, '„Alfa“ allein zählt nicht']];
let fehler = 0;
for (const [s, soll, name] of faelle) { const r = f(s.split(' ')), ok = r.p === soll; if (!ok) fehler++; console.log((ok ? '✓ ' : '✖ ') + name + (ok ? '' : ' → ' + JSON.stringify(r))); }
const ende = f(['a']); if (!ende.amEnde) { fehler++; console.log('✖ Buchstabe am Ende muss warten (amEnde)'); } else console.log('✓ Buchstabe am Ende wartet auf das fertige Ergebnis');
const v = text({q: 'Was tun?', a: ['Eins', 'Zwei', 'Drei', 'Vier']}, [0, 1, 2, 3]);
/Alfa: Eins\. Bravo: Zwei\. Charlie: Drei\. Delta: Vier\./.test(v) ? console.log('✓ Vorlesen mit Alfa bis Delta') : (fehler++, console.log('✖ Vorlesen: ' + v));
console.log(fehler ? fehler + ' Fehler.' : 'Zuruf in Ordnung.'); process.exit(fehler ? 1 : 0);
