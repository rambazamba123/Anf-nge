/* Schreibt eine JSON-Datei kompakt: oberste Ebene eingerückt, Listen mit einem Eintrag pro Zeile.
   Aufruf: node tools/json-kompakt.js data/ereignisse.json */
const fs = require('fs'), f = process.argv[2], D = JSON.parse(fs.readFileSync(f, 'utf8'));
const out = '{\n' + Object.entries(D).map(([k, v]) => {
  if (Array.isArray(v)) return `  ${JSON.stringify(k)}: [\n${v.map(x => '    ' + JSON.stringify(x)).join(',\n')}\n  ]`;
  if (v && typeof v === 'object') return `  ${JSON.stringify(k)}: {\n${Object.entries(v).map(([a, b]) => `    ${JSON.stringify(a)}: ${JSON.stringify(b)}`).join(',\n')}\n  }`;
  return `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`;
}).join(',\n') + '\n}\n';
JSON.parse(out); fs.writeFileSync(f, out);
