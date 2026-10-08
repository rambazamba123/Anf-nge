/* Vergibt Situations-Tags für alle SBF-See- und SKS-Fragen (data/tags.json).
   Automatisch über Stichwörter in Frage und richtiger Antwort; Kataloge bleiben unverändert.
   Aufruf: node tools/tag-fragen.js            → schreibt data/tags.json
           node tools/tag-fragen.js --stich 50 → zieht 50 zufällige Fragen zur Handprüfung */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const read = f => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8'));
const REGEL = [
  // Wortanfang-Treffer (\b vor dem Stamm), damit „Recht“ nicht „rechtwinklig“ trifft
  ['nacht', /\b(Nacht|Nächte|nachts|Dunkel\w*|Dämmerung|Sonnenuntergang|Sonnenaufgang)\b/i],
  ['nebel', /\b(Nebel|unsichtig\w*|verminderte[rn]? Sicht)\b/i],
  ['fahrwasser', /\b(Fahrwasser|Fahrrinne|Seeschifffahrtsstraße|Wasserstraße|Engstelle|Kanal|Verkehrstrennung|Hafeneinfahrt|Einlaufen)/i],
  ['ausweichen', /\b(ausweich|Kurshalt|Vorfahrt|Kollision|Zusammenstoß|Begegn|Überhol|überhol|Gefahr eines)/i],
  ['lichter', /\b(Licht(er|en|s)?|Signalkörper|Laterne|Topplicht|Seitenlicht|Hecklicht|Rundumlicht)\b/i],
  ['schallsignale', /\b(Schallzeichen|Schallsignal\w*|Warnsignal|Gefahrsignal|Schalltöne|Töne|Tonsignal|Pfeife|Glocke|Gong|Nebelsignal|Horn)\b/i],
  ['betonnung', /\b(Tonne|Tonnen|Betonnung|Kardinal\w*|Leitfeuer\w*|Richtfeuer\w*|Torfeuer\w*|Befeuerung|Kennung|Quermarke\w*|Leuchtturm\w*|Leuchtfeuer\w*|Leuchttonne\w*|Blinkfeuer|Feuer|Feuers|Funkelfeuer|Blitzfeuer|Gleichtaktfeuer|Unterbrochenes Feuer)\b/i],
  ['tafel', /\b(Tafel|Tafelzeichen|Sichtzeichen)/i],
  ['flagge', /\b(Flagge|Wimpel|Flaggensignal|Signalflagge)/i],
  ['motor', /\b(Motor|Motoren|Maschine|Antriebsmaschine|Kühlwasser|Propeller|Schraube|Wendegetriebe|Batterie|Benzin|Diesel|Kraftstoff|Zündung|Saildrive|Vergaser|Ölstand|Öldruck|Impeller|Lichtmaschine|Ladekontroll|Einspritz)/i],
  ['wetter', /\b(Wetter\w*|Starkwind\w*|Windstärke\w*|Windrichtung\w*|Windversetzung|Sturmwarnung|Starkwindwarnung|Warnung|Wind\b|Böe|Sturm|Luftdruck|Front|Hochdruck\w*|Tiefdruck\w*|Tiefausläufer|Tiefkern|Gewitter|Seegang|Dünung|Wolke|Beaufort|Bft|Brecher|Schauer|Regen|Hagel|Taupunkt|Isobar|Wellen|Welle)\b/i],
  ['sicherheit', /\b(Sicherheit|Rettung|Weste|Notsignal|Notzeichen|Seenot|Feuerlöscher|Brand|über Bord|Überbord|Notfall|Notruf|Lenz|Löschdecke|Gurt|verlass\w*|Warnnachricht|Gefahr|Rettungsinsel|Floß|Flüssiggas|Gas(?![a-zäöüß])|offenes Feuer|Gefahrgut|gefährlich)/i],
  ['recht', /\b(Recht(?!e[nmrs]?\b|s-|s? bzw|s?winkl|s?dreh|s?seit|weisend)|Rechts(vorschrift|regel)|Verordnung|Verkehrsvorschrift\w*|Vorschrift\w*|Pflicht|Erlaubnis|Führerschein|Fahrerlaubnis|Alkohol|Promille|Zeugnis|zuständig|Gebühr|Kennzeichen|Befähigung|Einreise|Zoll|Genehmigung|Ordnungswidrig|Schiffsführer|Sorgfalt|Verantwortung|Verbot)/i],
  ['navigation', /\b(Navigation|Kurs|Peilung|peil|Koppel|Standlinie|Seekarte|Kompass|Missweisung|Ablenkung|Deviation|Distanz|Seemeile|GPS|Ortsbestimmung|Besteck|Kartennull|Wasserstand|Ortung)/i],
  ['manoever', /\b(Manöver|Wende|Wenden|Halse|Anlegen|Ablegen|drehen|Bugstrahl|Stopp|aufstopp|Schlepp|Hahnepot|Päckchen|Boje|Anker|Steuerfähig|Radeffekt)/i],
  ['seemannschaft', /\b(Segel|Takel|Tauwerk|Leine|Knoten|Rigg|Mast|Want|Stag|Reff|Trimm|Schot|Fall|Luv|Lee|Bootsbau|GFK|Rumpf|Gelcoat|Sandwich|Fender|Festmacher|Klampe|Pütz|Pinne|Ruder|laufende|laufendes)/i],
  ['strom', /\b(Strom(?!menge|verbrauch|kreis|stärke|leitung|schalter|ausfall|erzeug|-)|Stromversetzung|Strömung|Tide|Tidenhub|Ebbe|Flut|Gezeit|Abdrift|Hochwasser|Niedrigwasser)/i],
  ['stabilitaet', /\b(kentern|Kentern|Stabilität|aufricht|Krängung|Schwerpunkt)/i],
  ['umwelt', /\b(Umwelt\w*|Naturschutz|Tierwelt|Pflanzen\w*|Seehund\w*|Vogel\w*|Reinhalt\w*|Abfall\w*|Müll\w*|Feuchtgebiet\w*)/i],
  ['vtg', /\b(Verkehrstrennung|VTG|Einbahnweg|Trennlinie)/i],

];
const TOPIC_FALLBACK = { b1: 'recht', b2: 'tafel', b3: 'manoever', b4: 'seemannschaft', b5: 'sicherheit' };
const SKS_FALLBACK = { nav: 'navigation', recht: 'recht', wetter: 'wetter', see1: 'seemannschaft', see2: 'seemannschaft' };
function tagsFuer(text, fallback) {
  const tags = REGEL.filter(([, re]) => re.test(text)).map(([t]) => t);
  if (!tags.length && fallback) tags.push(fallback);
  return tags;
}
function sbfTopic(n) {
  if (n <= 15) return 'b1'; if (n <= 30) return 'b2'; if (n <= 48) return 'b3';
  if (n <= 72) return 'b4'; return 'b5';
}
const sbf = read('sbf.json'), sks = read('sks.json');
const ausgabe = { about: 'Situations-Tags je Frage (automatisch vergeben, tools/tag-fragen.js). Schlüssel: sbf:n bzw. sks:<id>. Kataloge unverändert.',
  vokabular: REGEL.map(([t]) => t).concat(['segel']).filter((v, i, a) => a.indexOf(v) === i), tags: {} };
const stich = [];
for (const q of sbf) {
  const t = tagsFuer(q.q + ' ' + (Array.isArray(q.a) ? q.a[0] : q.a), TOPIC_FALLBACK[sbfTopic(q.n)]);
  ausgabe.tags['sbf:' + q.n] = t; stich.push({k: 'SBF ' + q.n, q: q.q, t});
}
for (const q of sks) {
  if (q.sketch) continue;
  const t = tagsFuer(q.q + ' ' + q.a, SKS_FALLBACK[q.s]);
  ausgabe.tags['sks:' + q.id] = t; stich.push({k: 'SKS ' + q.id, q: q.q, t});
}
const anz = Object.keys(ausgabe.tags).length;
if (process.argv.includes('--stich')) {
  const n = +process.argv[process.argv.indexOf('--stich') + 1] || 50;
  const pick = [...stich].sort(() => Math.random() - 0.5).slice(0, n);
  for (const p of pick) console.log(`${p.k} | ${p.t.join(', ')} | ${p.q.replace(/\s+/g, ' ').slice(0, 150)}`);
} else {
  fs.writeFileSync(path.join(root, 'data', 'tags.json'), JSON.stringify(ausgabe, null, 1));
  const leer = Object.values(ausgabe.tags).filter(t => !t.length).length;
  console.log(`Tags für ${anz} Fragen geschrieben. Ohne Tag: ${leer}.`);
}
