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
/* v5.67 natürliche Entweder-oder-Frage (HR59): das Antwortwort selbst zählt, aber nur, wenn Wörter genau einer Antwort gehört wurden */
const W = ctx.window.SZENE._wort, AW = ctx.window.SZENE.antwortWorte;
const wf = [
  [['Backbord', 'Steuerbord'], 'backbord', 0, '„Backbord“'], [['Backbord', 'Steuerbord'], 'ich glaube steuerbord', 1, '„ich glaube Steuerbord“'],
  [['Backbord', 'Steuerbord'], 'backbord oder steuerbord', -1, 'beide Wörter (Fragesatz aus dem Lautsprecher) zählen nicht'],
  [['Backbord', 'Steuerbord'], 'keine ahnung', -1, 'kein Antwortwort'],
  [['schnell durch', 'Gas weg'], 'gas weg', 1, '„Gas weg“'], [['von vorne gesehen', 'von achtern gesehen'], 'von achtern', 1, '„von achtern“ (gemeinsames „gesehen“ zählt nicht)'],
  [['es wird nur nass', 'es kann kentern und herangezogen werden'], 'es kann kentern', 1, '„es kann kentern“'],
  [['die Frieda dreht sich', 'es passiert nichts'], 'nichts', 1, '„nichts“'], [['die Frieda dreht sich', 'es passiert nichts'], 'sie dreht', 0, '„sie dreht“']];
for (const [a, s, soll, name] of wf) { const r = W(s.split(' '), AW(a)), ok = r.p === soll; if (!ok) fehler++; console.log((ok ? '✓ ' : '✖ ') + 'Wort: ' + name + (ok ? '' : ' → ' + JSON.stringify(r) + ' ' + JSON.stringify(AW(a)))); }
console.log(fehler ? fehler + ' Fehler.' : 'Zuruf in Ordnung.'); process.exit(fehler ? 1 : 0);
