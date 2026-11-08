/* ==========================================================================
   Skipper – Animationen, vierter Teil (v5.29): Teil B „Zusatz“ aus docs/animationen-liste.md (nicht geprüft, aber an Bord wichtig).
   Nutzt den Baukasten aus anim2.js. Seemannschaft nach gängiger Praxis, ohne quellen/ geprüft (R8).
   ========================================================================== */
(() => {
const A = window.ANIM; if (!A || !A.szene || A.defs.gleiter) return;
const S = A.szene, B = A.bau, {q, qa, T, P, LF, H, M, K} = A.hilfe;
const Z = (id, o) => S(id, {art: 'zusatz', ...o});
/* Liste mit Bild links: Punkte erscheinen nach Phasen (bis: Anzahl sichtbarer Punkte je Phase) */
const liste = (bild, punkte) => ({bg: `<rect width="400" height="300" fill="#f3ead2"/><g transform="translate(88 165)">${bild}</g>` + punkte.map((t, i) => `<g class="lp" data-i="${i}" opacity="0" transform="translate(184 ${62 + i * 30})">${B.haken(0, 0)}${T(12, 5, t, 'start', 11)}</g>`).join('')});
const zeige = n => s => qa(s, '.lp').forEach(e => e.setAttribute('opacity', +e.dataset.i < n ? 1 : 0));
const bootSeite = (c = '#fbf8f2') => B.seite(110, [], c, false) + '<rect x="-24" y="-32" width="40" height="16" rx="3" fill="#cfd6db" stroke="#555"/><path d="M-55 -6 H48" stroke="#c0392b" stroke-width="3"/>';

/* ======================= B1 Handling und Seemannschaft ======================= */
Z('gleiter', {titel: 'Verdränger oder Gleiter', nr: 'B1.1', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.tag(180), obj: {boot: bootSeite(), welle: '<path d="M30 0 Q60 -14 90 0 M-60 0 Q-90 -10 -120 0" stroke="#fff" stroke-width="4" fill="none"/>', tx: T(0, 0, '', 'middle', 13)},
  start: {boot: {x: 200, y: 182}, welle: {x: 200, y: 182, o: .4}, tx: {x: 200, y: 60}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['langsam: das Boot schiebt das Wasser weg', 'schneller: Bug hoch, große Welle, viel Sprit', 'gleiten: das Boot liegt oben auf dem Wasser'][p]; },
  phasen: [P(H, 'Langsam schiebt das Boot das Wasser zur Seite. Das nennt man Verdrängerfahrt. Ruhig und sparsam.', {cap: 'Verdrängerfahrt'}),
    P(M, 'Geben wir mehr Gas, steigt der Bug, und hinten entsteht eine große Welle. In diesem Bereich frisst der Motor am meisten.', {cap: 'Der Buckel', k: {boot: {r: -9, y: 186}, welle: {o: 1, s: 1.4}}}),
    P(H, 'Mit genug Kraft kommt das Boot auf die eigene Bugwelle und gleitet obenauf. Viel schneller, aber im Hafen verboten und bei Seegang hart.', {cap: 'Gleitfahrt', k: {boot: {r: -3, y: 178}, welle: {o: .6, s: 1}}})]});

Z('trimm', {titel: 'Trimm und Trimmklappen', nr: 'B1.2', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.tag(180), obj: {boot: bootSeite(), klappe: '<path d="M-56 4 L-72 10" stroke="#333" stroke-width="5"/>', tx: T(0, 0, '', 'middle', 13)}, start: {boot: {x: 200, y: 182, r: -10}, klappe: {x: 200, y: 182, r: -10, o: 0}, tx: {x: 200, y: 60}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['Bug zu hoch: das Boot stampft, man sieht nichts', 'Trimmklappen runter: Heck hoch, Bug runter', 'zu weit: der Bug schneidet in die Welle'][p]; },
  phasen: [P(H, 'Liegt das Gewicht hinten, steht der Bug zu hoch. Das Boot stampft, und vorn sieht man nichts.', {cap: 'Bug zu hoch'}),
    P(M, 'Trimmklappen am Heck drücken das Heck hoch und den Bug runter. Dann liegt das Boot flacher und braucht weniger Sprit.', {cap: 'Trimmklappen runter', an: ['klappe'], k: {boot: {r: -3}, klappe: {r: -3}}}),
    P(H, 'Aber nicht übertreiben. Bug zu tief, und er schneidet in die Wellen. Das kann gefährlich werden.', {cap: 'Nicht zu tief', k: {boot: {r: 4}, klappe: {r: 4}}})]});

Z('pivot', {titel: 'Wo sich das Boot dreht', nr: 'B1.3', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.wasser(), obj: {boot: B.boot() + '<circle cx="0" cy="-10" r="4" fill="#f08a1c"/>', bahn: '<path d="M0 0" stroke="#fff" stroke-width="2" stroke-dasharray="4 4" fill="none"/>', tx: T(0, 0, 'Drehpunkt etwa ein Drittel von vorn', 'middle', 12)},
  start: {boot: {x: 200, y: 160, s: 2}, tx: {x: 200, y: 280, o: 0}},
  phasen: [P(H, 'Vorwärts dreht sich das Boot nicht um die Mitte, sondern um einen Punkt etwa ein Drittel von vorn.', {cap: 'Der Drehpunkt', an: ['tx']}),
    P(M, 'Darum schwenkt beim Kurvenfahren vor allem das Heck aus. Am Steg entlang heißt das: Platz fürs Heck lassen.', {cap: 'Das Heck schwenkt aus', k: {boot: {r: 35}}, dur: 3}),
    P(H, 'Rückwärts wandert der Drehpunkt nach hinten. Dann schwenkt der Bug.', {cap: 'Rückwärts: Bug schwenkt', k: {boot: {r: 0}}, dur: 2})]});

Z('abdrift', {titel: 'Wind und Abdrift beim Manövrieren', nr: 'B1.4', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.wasser() + [0, 1, 2].map(i => B.pfeil(20, 60 + i * 80, 70, 60 + i * 80, '#fff', 3, 'fl')).join('') + T(45, 40, 'Wind', 'middle', 11),
  obj: {boot: B.boot(), soll: '<path d="M0 0 V-200" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>', ist: '<path d="M0 0 L60 -190" stroke="#f08a1c" stroke-width="2.5" stroke-dasharray="5 4"/>'},
  start: {boot: {x: 170, y: 260}, soll: {x: 170, y: 260, o: 0}, ist: {x: 170, y: 260, o: 0}},
  phasen: [P(H, 'Mit Fahrt merkt man den Wind kaum. Wir fahren geradeaus.', {cap: 'Mit Fahrt: kaum Wirkung', an: ['soll'], k: {boot: {y: 200}}}),
    P(M, 'Langsam im Hafen schiebt der Wind das Boot seitlich weg. Der Bug fällt zuerst ab, weil er leichter ist.', {cap: 'Langsam: Abdrift, Bug fällt ab', an: ['ist'], k: {boot: {x: 215, y: 120, r: 28}}, dur: 3.5}),
    P(H, 'Darum mit etwas mehr Fahrt und gegen den Wind vorhalten. Und beim Anlegen lieber gegen den Wind.', {cap: 'Vorhalten, gegen den Wind anlegen', k: {boot: {x: 190, y: 60, r: -10}}, dur: 3})]});

Z('hafenstrom', {titel: 'Strömung im Hafen', nr: 'B1.5', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.wasser() + B.pier(0, 60) + [0, 1, 2, 3].map(i => B.pfeil(250, 20 + i * 75, 250, 70 + i * 75, '#fff', 3, 'fl')).join('') + T(280, 16, 'Strom', 'middle', 11),
  obj: {boot: B.boot()}, start: {boot: {x: 200, y: 60, r: 180}},
  phasen: [P(H, 'Hier läuft ein Strom am Steg entlang nach unten. Mit dem Strom anlegen ist schwer, man wird zu schnell.', {cap: 'Mit dem Strom: zu schnell', k: {boot: {x: 110, y: 200}}, dur: 3}),
    P(M, 'Besser eine Runde drehen und gegen den Strom anlegen. Dann bremst der Strom, und man steuert sauber.', {cap: 'Wenden und gegen den Strom', k: {boot: {weg: [[200, 260], [250, 240], [180, 220]]}}, dur: 3.5}),
    P(H, 'Langsam gegenan, und das Boot legt sich fast von selbst an den Steg.', {cap: 'Gegen den Strom anlegen', k: {boot: {x: 92, y: 150, r: 0}}, dur: 3})]});

Z('fender', {titel: 'Fender richtig hängen', nr: 'B1.7', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.tag(160) + '<rect x="0" y="120" width="400" height="40" fill="#b98750" stroke="#7a5a3a" stroke-width="3"/>', obj: {boot: B.seite(220, [], '#fbf8f2', false) + '<path d="M-110 -8 H96" stroke="#c0392b" stroke-width="3"/>', f: [-70, -10, 50].map(x => `<rect x="${x - 7}" y="-6" width="14" height="28" rx="7" fill="#2e86c1"/><path d="M${x} -6 V-18" stroke="#888" stroke-width="2"/>`).join(''), x: B.kreuz(0, 0), ok: B.haken(0, 0)},
  start: {boot: {x: 200, y: 180}, f: {x: 200, y: 140}, x: {x: 330, y: 70, o: 0}, ok: {x: 330, y: 70, o: 0}},
  phasen: [P(H, 'Fender hängen da, wo das Boot den Steg berührt. Hier hängen sie zu hoch, über der Kante.', {cap: 'Zu hoch: nutzlos', an: ['x']}),
    P(M, 'Sie gehören auf Höhe der Stegkante, so dass sie zwischen Rumpf und Steg liegen. Drei reichen meist.', {cap: 'Auf Höhe der Stegkante', aus: ['x'], an: ['ok'], k: {f: {y: 162}}}),
    P(H, 'Fest mit dem Webeleinstek an der Reling, nicht an der Relingsstütze, die bricht.', {cap: 'Am Webeleinstek'})]});

Z('springablegen', {titel: 'Ablegen mit der Achterspring', nr: 'B1.8', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.wasser() + B.pier(0, 60) + '<circle cx="54" cy="70" r="6" fill="#333"/><circle cx="54" cy="240" r="6" fill="#333"/>', obj: {boot: B.boot(), leine: ''}, start: {boot: {x: 92, y: 150}},
  fx(s, tp, p, st, c) { const b = c.boot, th = b.r * Math.PI / 180, x = b.x - 10 * Math.cos(th) - 24 * Math.sin(th), y = b.y - 10 * Math.sin(th) + 24 * Math.cos(th); q(s, '[data-o="leine"]').innerHTML = p < 3 ? `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L54 240" stroke="#e8c46a" stroke-width="3"/>` : ''; },
  phasen: [P(H, 'Liegt der Wind auf dem Steg, nehmen wir eine Achterspring: vom Heck nach vorn zum Poller hinter uns.', {cap: 'Achterspring belegen'}),
    P(M, 'Langsam rückwärts in die Spring eindampfen. Das Heck kommt an den Steg, der Bug schwenkt raus.', {cap: 'Rückwärts eindampfen: Bug schwenkt raus', k: {boot: {x: 100, r: 32}}, dur: 3}),
    P(H, 'Fender ans Heck! Wenn der Bug weit genug draußen ist …', {cap: 'Fender ans Heck'}),
    P(M, '… Spring los und vorwärts weg vom Steg.', {cap: 'Spring los, voraus', k: {boot: {weg: [[160, 70], [210, 20]]}}, dur: 3})]});

Z('ankerpraxis', {titel: 'Ankern in der Praxis: wie viel Kette?', nr: 'B1.9', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: '<rect width="400" height="110" fill="#bfe0f2"/><rect y="110" width="400" height="190" fill="#4d93bd"/><path d="M0 250 H400 V300 H0Z" fill="#c9b27c"/>',
  obj: {boot: B.seite(80, [], '#fbf8f2', false), kurz: '<path d="M0 0 Q20 60 60 140" stroke="#333" stroke-width="3" fill="none"/>' + T(70, 110, 'zu kurz: Zug nach oben', 'start', 11, 'r'), lang: '<path d="M0 0 Q60 130 260 140" stroke="#333" stroke-width="3" fill="none"/>' + T(150, 120, 'lang: Zug flach am Grund', 'middle', 11, 'w'), a1: '<path d="M0 -8 V8 M-8 2 Q0 12 8 2" stroke="#222" stroke-width="3" fill="none"/>', tx: T(0, 0, 'Faustregel: Kette 3- bis 5-mal, Leine 5- bis 7-mal die Tiefe', 'middle', 12)},
  start: {boot: {x: 80, y: 110}, kurz: {x: 120, y: 110, o: 0}, lang: {x: 120, y: 110, o: 0}, a1: {x: 180, y: 246, o: 0}, tx: {x: 200, y: 60, o: 0}},
  phasen: [P(H, 'Ist die Kette zu kurz, zieht sie den Anker schräg nach oben, und er bricht aus.', {cap: 'Zu kurz', an: ['kurz', 'a1']}),
    P(M, 'Lang genug, liegt die Kette flach am Grund. Ihr Gewicht federt die Rucke ab, und der Anker gräbt sich ein.', {cap: 'Lang genug', aus: ['kurz'], an: ['lang'], k: {a1: {x: 380}}}),
    P(H, 'Faustregel: Kette drei- bis fünfmal die Wassertiefe, mit Leine mehr. Bei Wind lieber mehr.', {cap: 'Faustregel', an: ['tx']})]});

Z('ankerwache', {titel: 'Ankerwache', nr: 'B1.10', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.wasser() + B.ufer('M0 0 H400 V60 Q200 90 0 60Z') + '<path d="M120 50 l0 -24 l6 0 l0 24z" fill="#8a5a3a"/><path d="M290 48 l0 -30 l6 0 l0 30z" fill="#fff" stroke="#333"/>',
  obj: {kreis: '<circle r="70" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 5"/><circle r="4" fill="#222"/>', boot: B.boot(), peil: '<path d="M0 0 L-80 -150 M0 0 L95 -152" stroke="#f2c200" stroke-width="2" stroke-dasharray="5 4"/>', alarm: T(0, 0, 'Peilung wandert: der Anker slippt!', 'middle', 13, 'r')},
  start: {kreis: {x: 200, y: 190}, boot: {x: 200, y: 250, r: 180}, peil: {x: 200, y: 250, o: 0}, alarm: {x: 200, y: 290, o: 0}},
  phasen: [P(H, 'Vor Anker schwojt das Boot im Kreis um den Anker, je nach Wind und Strom.', {cap: 'Schwojen im Kreis', k: {boot: {weg: [[260, 210], [255, 160]]}}, dur: 3}),
    P(M, 'Merk dir zwei Landmarken. Ändert sich ihre Peilung nur im Rahmen des Kreises, ist alles gut.', {cap: 'Ankerpeilung', an: ['peil'], k: {peil: {x: 255, y: 160}}}),
    P(H, 'Wandert das Boot aus dem Kreis heraus, slippt der Anker. Dann sofort handeln: Motor an, neu ankern.', {cap: 'Driftet: handeln', an: ['alarm'], aus: ['peil'], k: {boot: {x: 300, y: 270}}, dur: 3})]});

Z('schleppen2', {titel: 'Schleppen in der Praxis', nr: 'B1.11', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.wasser(), obj: {zug: B.boot(), anh: B.boot(), leine: '<path d="M0 0 L-14 30 M0 0 L14 30 M0 0 V-150" stroke="#e8c46a" stroke-width="2.5" fill="none"/>' + T(22, 24, 'Hahnepot', 'start', 11), tx: T(0, 0, 'lange Leine, ruhige Fahrt', 'middle', 12)},
  start: {zug: {x: 200, y: 70}, anh: {x: 200, y: 260}, leine: {x: 200, y: 220}, tx: {x: 300, y: 150, o: 0}},
  phasen: [P(H, 'Der Anhang bekommt die Leine an einem Hahnepot, also an zwei Punkten vorn, damit sie nicht einseitig zieht.', {cap: 'Hahnepot am Anhang'}),
    P(M, 'Langsam anfahren, nie ruckartig. Die Leine lang lassen, damit sie federt.', {cap: 'Langsam anfahren', an: ['tx'], k: {zug: {y: 40}, anh: {y: 230}, leine: {y: 190}}, dur: 3}),
    P(H, 'Nicht schneller als der Anhang in Verdrängerfahrt könnte. Und jemand passt auf die Leine auf.', {cap: 'Nicht zu schnell'})]});

Z('rueckwaerts', {titel: 'Rückwärts fahren', nr: 'B1.12', gruppe: 'B1 Seemannschaft (Zusatz)',
  bg: B.wasser(), obj: {boot: B.boot(), p1: B.pfeil(0, 0, -30, 0, '#f08a1c', 4)}, start: {boot: {x: 200, y: 90}, p1: {x: 200, y: 125, o: 0}},
  phasen: [P(H, 'Rückwärts gehorcht das Boot anders. Zuerst zieht der Radeffekt das Heck nach Backbord, egal wie das Ruder steht.', {cap: 'Erst der Radeffekt', an: ['p1'], k: {boot: {y: 140, r: 14}, p1: {y: 175}}}),
    P(M, 'Erst wenn das Boot Fahrt achteraus hat, wirkt das Ruder. Darum ruhig und mit kurzen Schüben.', {cap: 'Ruder wirkt spät', aus: ['p1'], k: {boot: {y: 200, r: 4}}, dur: 3}),
    P(H, 'Und den Blick nach achtern. Wer rückwärts fährt, guckt dahin, wo er hinfährt.', {cap: 'Nach achtern schauen', k: {boot: {y: 250, r: 0}}})]});

/* ======================= B2 Sicherheit und Ausrüstung ======================= */
Z('weste', {titel: 'Weste anlegen und prüfen', nr: 'B2.1', gruppe: 'B2 Sicherheit (Zusatz)', ...liste(T(0, 20, '🦺', 'middle', 90), ['Feststoff oder Automatik?', 'Gurt schließen und straff ziehen', 'Schrittgurt durch die Beine', 'Patrone und Auslöser prüfen', 'Lampe und Pfeife dran?']),
  obj: {}, phasen: [P(H, 'Es gibt Feststoffwesten und Automatikwesten. Die Automatik bläst sich im Wasser von selbst auf.', {cap: 'Welche Weste?', fx: zeige(1)}),
    P(M, 'Anziehen, Gurt zu und straff. Der Schrittgurt kommt durch die Beine, sonst rutscht man im Wasser raus.', {cap: 'Richtig anziehen', fx: zeige(3)}),
    P(H, 'Vor der Saison: Patrone fest, Auslöser grün, Lampe und Pfeife dran.', {cap: 'Prüfen', fx: zeige(5)})]});

Z('insel', {titel: 'Rettungsinsel', nr: 'B2.2', gruppe: 'B2 Sicherheit (Zusatz)', ...liste(T(0, 20, '🛟', 'middle', 80), ['Fangleine am Boot fest', 'Insel in Lee über Bord', 'Leine ziehen, sie bläst sich auf', 'vom Boot aus trocken einsteigen', 'in die Insel erst, wenn es sein muss']),
  obj: {}, phasen: [P(H, 'Die Fangleine der Insel bleibt am Boot fest. Dann geht die Insel in Lee über Bord.', {cap: 'Fest und über Bord', fx: zeige(2)}),
    P(M, 'An der Leine ziehen, bis sie auslöst. Dann bläst sich die Insel auf.', {cap: 'Auslösen', fx: zeige(3)}),
    P(H, 'Möglichst trocken einsteigen. Und merk dir: Ins Rettungsfloß nur, wenn das eigene Boot wirklich verloren ist.', {cap: 'Erst steigen, wenn es sein muss', fx: zeige(5)})]});

Z('pyro', {titel: 'Pyrotechnik', nr: 'B2.3', gruppe: 'B2 Sicherheit (Zusatz)', ...liste(T(0, 20, '🧨', 'middle', 80), ['Handfackel: in Lee halten, Arm weg', 'Rakete: steil, leicht gegen den Wind', 'Rauchtopf: in Lee ins Wasser', 'nur bei Gefahr für Leib und Leben', 'Verfallsdatum beachten']),
  obj: {}, phasen: [P(H, 'Eine Handfackel hält man in Lee über Bord, Arm weit weg, damit die Tropfen nicht aufs Boot fallen.', {cap: 'Handfackel', fx: zeige(1)}),
    P(M, 'Die Fallschirmrakete schießt man fast senkrecht, leicht gegen den Wind. Den Rauchtopf wirft man in Lee ins Wasser.', {cap: 'Rakete und Rauch', fx: zeige(3)}),
    P(H, 'Alles nur im echten Notfall. Und abgelaufene Pyros taugen nichts, die gibt man zurück.', {cap: 'Nur im Notfall', fx: zeige(5)})]});

Z('leck', {titel: 'Wassereinbruch', nr: 'B2.5', gruppe: 'B2 Sicherheit (Zusatz)',
  bg: B.tag(140) + '<path d="M80 140 L320 140 L300 240 L100 240Z" fill="#fbf8f2" stroke="#555" stroke-width="3"/>',
  obj: {wasser: '<rect x="-100" y="0" width="200" height="1" fill="#4d93bd" opacity=".8"/>', loch: '<circle r="6" fill="#222"/>' + B.pfeil(-30, 0, -8, 0, '#4d93bd', 4), pfropf: '<path d="M-6 -6 L6 -6 L3 6 L-3 6Z" fill="#a0784c"/>', pumpe: T(0, 0, '🪣 Lenzpumpe', 'middle', 13), funk: T(0, 0, '📻 Notruf, Kurs aufs Land', 'middle', 13)},
  start: {wasser: {x: 200, y: 238}, loch: {x: 140, y: 220}, pfropf: {x: 120, y: 220, o: 0}, pumpe: {x: 280, y: 110, o: 0}, funk: {x: 200, y: 60, o: 0}},
  fx(s, tp, p, st, c) { const h = p === 0 ? Math.min(40, tp * 12) : p === 1 ? 40 : Math.max(10, 40 - tp * 10); const r = q(s, '[data-o="wasser"] rect'); r.setAttribute('y', -h); r.setAttribute('height', h); },
  phasen: [P(H, 'Wasser im Boot! Erst schauen, wo es reinkommt.', {cap: 'Wo kommt es her?'}),
    P(M, 'Loch zustopfen: mit einem Holzpfropfen, einem Kissen, irgendwas. Seeventile gleich mit prüfen.', {cap: 'Leck abdichten', an: ['pfropf'], k: {pfropf: {x: 140}}}),
    P(H, 'Dann lenzen, also pumpen. Und wird es nicht weniger: Notruf und Kurs aufs nächste Land.', {cap: 'Lenzen, notfalls Notruf', an: ['pumpe', 'funk']})]});

Z('grund', {titel: 'Grundberührung', nr: 'B2.6', gruppe: 'B2 Sicherheit (Zusatz)',
  bg: '<rect width="400" height="140" fill="#bfe0f2"/><rect y="140" width="400" height="160" fill="#4d93bd"/><path d="M0 230 Q120 210 220 190 Q300 180 400 200 V300 H0Z" fill="#c9b27c"/>', obj: {boot: B.seite(90, [], '#fbf8f2', false), rums: T(0, 0, 'Rums!', 'middle', 16, 'r'), tx: T(0, 0, '', 'middle', 13)},
  start: {boot: {x: 120, y: 140}, rums: {x: 250, y: 110, o: 0}, tx: {x: 200, y: 50}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['sofort auskuppeln', 'rückwärts zurück, wo wir herkamen', 'Schäden prüfen: Bilge, Ruder, Antrieb'][p]; },
  phasen: [P(H, 'Rums, wir sitzen auf. Erst mal auskuppeln, damit der Propeller nicht kaputt geht.', {cap: 'Auskuppeln', an: ['rums'], k: {boot: {x: 230, r: -4}}}),
    P(M, 'Dann langsam rückwärts, denselben Weg zurück, den wir gekommen sind. Bei fallendem Wasser schnell, bei steigendem warten.', {cap: 'Rückwärts zurück', aus: ['rums'], k: {boot: {x: 130, r: 0}}, dur: 3}),
    P(H, 'Frei? Dann in die Bilge schauen und Ruder und Antrieb prüfen.', {cap: 'Schäden prüfen'})]});

Z('seekrank', {titel: 'Seekrankheit, Hitze, Kälte', nr: 'B2.7', gruppe: 'B2 Sicherheit (Zusatz)', ...liste(T(0, 20, '🤢', 'middle', 80), ['auf den Horizont schauen', 'frische Luft, nicht unter Deck', 'trinken, leicht essen', 'in Lee, gesichert', 'Sonne und Kälte: Mütze, Schichten']),
  obj: {}, phasen: [P(H, 'Wird es einem übel: raus an die frische Luft und auf den Horizont gucken. Unter Deck wird es schlimmer.', {cap: 'Horizont und frische Luft', fx: zeige(2)}),
    P(M, 'Viel trinken, leicht essen. Und wer spucken muss, tut das in Lee, gesichert mit dem Gurt.', {cap: 'Trinken, in Lee', fx: zeige(4)}),
    P(K, 'Lee! Lee! Nicht Luv!', {cap: 'Sonne und Kälte nicht vergessen', fx: zeige(5)})]});

Z('bergen', {titel: 'Bergen aus dem Wasser', nr: 'B2.8', gruppe: 'B2 Sicherheit (Zusatz)',
  bg: B.tag(170) + `<g transform="translate(200 172)">${B.seite(200, [], '#fbf8f2', false)}</g>`,
  obj: {mensch: B.mensch(), leiter: '<path d="M0 -10 V40 M14 -10 V40" stroke="#888" stroke-width="3"/>' + [0, 12, 24, 36].map(y => `<path d="M0 ${y} H14" stroke="#888" stroke-width="3"/>`).join(''), gurt: '<path d="M0 -70 V0" stroke="#e8c46a" stroke-width="3"/><circle cy="4" r="9" fill="none" stroke="#e84a3a" stroke-width="4"/>', tx: T(0, 0, '', 'middle', 13)},
  start: {mensch: {x: 260, y: 200}, leiter: {x: 290, y: 160, o: 0}, gurt: {x: 260, y: 130, o: 0}, tx: {x: 200, y: 50}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['Motor aus, Person am Boot sichern', 'Badeleiter, wenn sie noch Kraft hat', 'erschöpft: Bergegurt und Talje oder Fall'][p]; },
  phasen: [P(H, 'Die Person ist am Boot. Motor aus und erst mal mit einer Leine sichern.', {cap: 'Sichern'}),
    P(M, 'Hat sie noch Kraft, klettert sie die Badeleiter hoch.', {cap: 'Badeleiter', an: ['leiter'], k: {mensch: {x: 296, y: 182}}, dur: 2.5}),
    P(H, 'Ist sie erschöpft, kommt sie aus eigener Kraft nicht hoch. Dann eine Rettungsschlaufe um, und mit Talje oder Fall hochziehen.', {cap: 'Bergegurt und Talje', aus: ['leiter'], an: ['gurt'], k: {mensch: {x: 260, y: 150}, gurt: {y: 90}}, dur: 3})]});

/* ======================= B3 Technik und Pflege ======================= */
Z('motorcheck', {titel: 'Motorcheck vor der Fahrt', nr: 'B3.1', gruppe: 'B3 Technik (Zusatz)', ...liste(T(0, 20, '⚙️', 'middle', 80), ['Öl am Messstab', 'Kühlwasser und Seeventil auf', 'Keilriemen und Impeller', 'Bilge trocken und gelüftet', 'Batterie und Kraftstoff', 'nach dem Start: Kontrollstrahl']),
  obj: {}, phasen: [P(H, 'Vor jeder Fahrt: Ölstand prüfen, Seeventil auf, Kühlwasser da.', {cap: 'Öl und Kühlwasser', fx: zeige(2)}),
    P(M, 'Keilriemen gespannt, Bilge trocken und gelüftet, genug Sprit, Batterie geladen.', {cap: 'Riemen, Bilge, Sprit, Strom', fx: zeige(5)}),
    P(H, 'Läuft der Motor, muss Kühlwasser hinten rauskommen. Kein Strahl, sofort aus.', {cap: 'Kontrollstrahl', fx: zeige(6)})]});

Z('stottern', {titel: 'Wenn der Motor stottert', nr: 'B3.2', gruppe: 'B3 Technik (Zusatz)', ...liste(T(0, 20, '🔧', 'middle', 80), ['Tankentlüftung offen?', 'Kraftstofffilter verstopft?', 'Wasser im Sprit?', 'zu heiß: Impeller, Seeventil', 'Leine in der Schraube?']),
  obj: {}, phasen: [P(H, 'Stottert der Außenborder bei vollem Tank, ist oft die Belüftung am Tank zu oder die Leitung verstopft.', {cap: 'Luft und Leitung', fx: zeige(2)}),
    P(M, 'Wasser im Sprit oder ein dreckiger Filter machen ihn auch unrund.', {cap: 'Wasser und Filter', fx: zeige(3)}),
    P(H, 'Wird er heiß: Seeventil, Impeller, Kühlwasser. Und rumpelt es plötzlich, hat er vielleicht eine Leine gefangen.', {cap: 'Hitze und Leine', fx: zeige(5)})]});

Z('batterie', {titel: 'Batterie und Strom', nr: 'B3.3', gruppe: 'B3 Technik (Zusatz)',
  bg: '<rect width="400" height="300" fill="#efe7d6"/>', obj: {s: '<rect x="-40" y="-22" width="80" height="44" rx="6" fill="#2b2b2b"/>' + T(0, 5, 'Starter', 'middle', 12, 'w'), v: '<rect x="-40" y="-22" width="80" height="44" rx="6" fill="#2b2b2b"/>' + T(0, 5, 'Verbraucher', 'middle', 12, 'w'),
    sch: '<circle r="18" fill="#c0392b"/>' + T(0, 5, 'I/II', 'middle', 11, 'w') + T(0, 36, 'Hauptschalter', 'middle', 11), lima: '<path d="M0 0 H-80" stroke="#f2c200" stroke-width="5" class="fl"/>' + T(-40, -10, 'Lichtmaschine lädt', 'middle', 11), lampe: T(0, 0, '💡📻🧊', 'middle', 22)},
  start: {s: {x: 100, y: 200}, v: {x: 300, y: 200}, sch: {x: 200, y: 110}, lima: {x: 200, y: 260, o: 0}, lampe: {x: 300, y: 130, o: 0}},
  phasen: [P(H, 'Gute Boote haben zwei Batterien: eine nur zum Starten, eine für Licht, Funk und Kühlbox.', {cap: 'Zwei Batterien'}),
    P(M, 'So kann man abends Musik hören und morgens trotzdem den Motor starten.', {cap: 'Verbraucher getrennt', an: ['lampe']}),
    P(H, 'Läuft der Motor, lädt die Lichtmaschine beide. Wer das Boot verlässt, schaltet den Hauptschalter aus.', {cap: 'Laden und ausschalten', an: ['lima']})]});

Z('kompass', {titel: 'Kompass und Ablenkung an Bord', nr: 'B3.5', gruppe: 'B3 Technik (Zusatz)',
  bg: '<rect width="400" height="300" fill="#f3ead2"/>', obj: {rose: '<circle r="70" fill="#fffaf0" stroke="#7a6a56" stroke-width="2"/>' + T(0, -50, 'N', 'middle', 13), nadel: B.pfeil(0, 30, 0, -60, '#c0392b', 5), eisen: T(0, 0, '📱🔧', 'middle', 26), tx: T(0, 0, 'Abstand zu Eisen und Elektronik', 'middle', 12)},
  start: {rose: {x: 180, y: 160}, nadel: {x: 180, y: 160}, eisen: {x: 340, y: 160, o: 0}, tx: {x: 200, y: 270, o: 0}},
  phasen: [P(H, 'Der Kompass zeigt nach magnetisch Nord. Aber Eisen, Lautsprecher und Handys in der Nähe lenken ihn ab.', {cap: 'Was ihn ablenkt'}),
    P(M, 'Leg das Handy neben den Kompass, und er zeigt plötzlich zwanzig Grad daneben.', {cap: 'Handy daneben: falsche Anzeige', an: ['eisen'], k: {eisen: {x: 260}, nadel: {r: 22}}, dur: 2}),
    P(H, 'Darum steht der Kompass mit dem Steuerstrich parallel zur Kiellinie, gut ablesbar und weit weg von Eisen.', {cap: 'Richtig aufstellen', an: ['tx'], aus: ['eisen'], k: {eisen: {x: 340}, nadel: {r: 0}}})]});

Z('winter', {titel: 'Winterlager', nr: 'B3.6', gruppe: 'B3 Technik (Zusatz)', ...liste(T(0, 20, '❄️', 'middle', 80), ['Kühlwasser raus oder Frostschutz', 'Motor einmotten, Öl wechseln', 'Tank voll gegen Kondenswasser', 'Batterie raus und laden', 'Polster raus, lüften']),
  obj: {}, phasen: [P(H, 'Im Winter friert Wasser im Motor und sprengt ihn. Also Kühlwasser raus oder Frostschutz rein.', {cap: 'Frostschutz', fx: zeige(1)}),
    P(M, 'Öl wechseln, Motor einmotten, Tank voll, damit sich kein Kondenswasser bildet.', {cap: 'Motor und Tank', fx: zeige(3)}),
    P(H, 'Batterie mit nach Hause und laden. Polster raus, Boot lüften, sonst schimmelt es.', {cap: 'Batterie und Lüften', fx: zeige(5)})]});

/* ======================= B4 Revier und Planung ======================= */
Z('toernplanung', {titel: 'Törnplanung', nr: 'B4.1', gruppe: 'B4 Revier (Zusatz)', ...liste(T(0, 20, '🗺️', 'middle', 80), ['Wetterbericht und Warnungen', 'Tide und Strom', 'Kurs, Distanz, Zeit', 'Ausweichhäfen', 'Sprit mit Reserve', 'jemandem an Land Bescheid sagen']),
  obj: {}, phasen: [P(H, 'Erst das Wetter: Wind, Warnungen, und wie es sich entwickelt.', {cap: 'Wetter', fx: zeige(1)}),
    P(M, 'Dann Tide und Strom, Kurs und Distanz auf der Karte, und wie lange es dauert.', {cap: 'Tide, Kurs, Zeit', fx: zeige(3)}),
    P(H, 'Wohin, wenn es schiefgeht? Ausweichhäfen raussuchen, Sprit mit Reserve, und an Land sagen, wann wir ankommen.', {cap: 'Plan B', fx: zeige(6)})]});

Z('hafenregeln', {titel: 'Hafenregeln', nr: 'B4.2', gruppe: 'B4 Revier (Zusatz)', ...liste(T(0, 20, '⚓', 'middle', 80), ['langsam, kein Schwell', 'Ausfahrende haben Vorrang', 'grünes Schild: Platz frei', 'beim Hafenmeister melden', 'Liegegeld zahlen']),
  obj: {}, phasen: [P(H, 'Im Hafen fährt man langsam. Keine Welle, die anderen schlagen sonst an die Stege.', {cap: 'Langsam, kein Schwell', fx: zeige(1)}),
    P(M, 'In der Einfahrt wartet man meist, bis die Ausfahrenden draußen sind.', {cap: 'Erst raus, dann rein', fx: zeige(2)}),
    P(H, 'Ein grünes Schild am Liegeplatz heißt frei, rot heißt belegt. Dann beim Hafenmeister melden und Liegegeld zahlen.', {cap: 'Liegeplatz und Hafenmeister', fx: zeige(5)})]});

Z('watt', {titel: 'Wattfahren', nr: 'B4.3', gruppe: 'B4 Revier (Zusatz)',
  bg: '<rect width="400" height="300" fill="#e3d29a"/><path d="M150 300 Q170 200 210 150 Q250 100 240 0 H290 Q300 110 260 160 Q220 210 210 300Z" fill="#5ba7cf"/>',
  obj: {pricken: [[170, 260], [200, 190], [236, 130], [250, 60]].map(([x, y]) => `<path d="M${x} ${y} v-18" stroke="#5a3a1a" stroke-width="2"/><path d="M${x - 5} ${y - 22} l5 4 l5 -4" stroke="#5a3a1a" stroke-width="2" fill="none"/><path d="M${x + 44} ${y} v-18" stroke="#5a3a1a" stroke-width="2"/><path d="M${x + 39} ${y - 14} l5 -4 l5 4" stroke="#5a3a1a" stroke-width="2" fill="none"/>`).join(''), boot: B.boot(), ebbe: '<rect x="0" y="0" width="400" height="300" fill="#e3d29a" opacity=".0"/>', tx: T(0, 0, '', 'middle', 13)},
  start: {boot: {x: 190, y: 290, s: .7}, tx: {x: 200, y: 24}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['Pricken zeigen den Weg im Watt', 'nur um Hochwasser fahren', 'trockenfallen: geplant, nicht aus Versehen'][p]; },
  phasen: [P(H, 'Im Watt zeigen Pricken den Weg, Birkenstämmchen mit Zweigen. Welche Seite welche ist, steht in der Karte.', {cap: 'Pricken'}),
    P(M, 'Das Wasser ist nur um Hochwasser tief genug. Wer zu spät losfährt, bleibt sitzen.', {cap: 'Rund um Hochwasser', k: {boot: {weg: [[205, 210], [240, 150], [262, 70]]}}, dur: 4}),
    P(H, 'Trockenfallen kann auch schön sein, mit flachem Boot und geplant. Aus Versehen ist es kein Spaß.', {cap: 'Trockenfallen planen'})]});

Z('nachtfahrt', {titel: 'Nachtfahrt', nr: 'B4.5', gruppe: 'B4 Revier (Zusatz)',
  bg: B.nacht(170) + [B.licht(60, 160, LF.r), B.licht(110, 158, LF.g), B.licht(300, 150, LF.w, 3, 'bl'), B.licht(350, 162, LF.y, 3)].join(''), obj: {rot: '<rect x="-60" y="-30" width="120" height="60" rx="10" fill="#4a0d0d" opacity=".9"/>' + T(0, 6, 'Rotlicht unter Deck', 'middle', 12, 'w'), aus: T(0, 0, '👀 Ausguck', 'middle', 14, 'w'), tx: T(0, 0, '', 'middle', 13, 'w')},
  start: {rot: {x: 200, y: 240, o: 0}, aus: {x: 200, y: 110, o: 0}, tx: {x: 200, y: 60}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['Lichter lesen: wer, wohin, was tut er?', 'Augen brauchen 20 Minuten', 'immer einer guckt nur raus'][p]; },
  phasen: [P(H, 'Nachts siehst du nur Lichter. Die musst du lesen können: Wer ist das, wohin fährt er, was tut er?', {cap: 'Lichter lesen'}),
    P(M, 'Deine Augen brauchen etwa zwanzig Minuten, bis sie im Dunkeln richtig sehen. Darum unter Deck nur rotes Licht, und nicht aufs helle Handy gucken.', {cap: 'Nachtsicht schonen', an: ['rot']}),
    P(H, 'Und einer macht nur Ausguck, nichts anderes.', {cap: 'Ausguck', an: ['aus']})]});

Z('sichtweite', {titel: 'Sichtweite und Erdkrümmung', nr: 'B4.6', gruppe: 'B4 Revier (Zusatz)',
  bg: '<rect width="400" height="300" fill="#142033"/><path d="M-100 330 Q200 170 500 330" fill="#0b1726" stroke="#4d93bd" stroke-width="3"/>',
  obj: {turm: '<rect x="-6" y="-70" width="12" height="70" fill="#ddd"/>' + B.licht(0, -74, LF.w, 5), boot: '<rect x="-14" y="-8" width="28" height="8" fill="#ddd"/><circle cy="-12" r="3" fill="#f2c200"/>', strahl: '<path d="M0 0 L240 70" stroke="#fff7d6" stroke-width="2" stroke-dasharray="6 4"/>', tx: T(0, 0, '', 'middle', 13, 'w')},
  start: {turm: {x: 70, y: 242}, boot: {x: 330, y: 250}, strahl: {x: 70, y: 168, o: 0}, tx: {x: 200, y: 50}},
  enter(s, p) { q(s, '[data-o="tx"] text').textContent = ['die Erde ist rund', 'je höher Feuer und Auge, desto weiter', 'Faustregel: etwa 2 × Wurzel aus der Höhe in m, in sm'][p]; },
  phasen: [P(H, 'Die Erde ist rund. Ein Feuer verschwindet irgendwann hinter dem Horizont, auch wenn es hell genug wäre.', {cap: 'Hinter der Kimm'}),
    P(M, 'Je höher das Feuer steht und je höher dein Auge ist, desto weiter siehst du es.', {cap: 'Höhe bringt Sicht', an: ['strahl'], k: {turm: {s: 1.3}}}),
    P(H, 'Faustregel: Wurzel aus der Höhe in Metern mal etwa zwei ergibt Seemeilen, für Feuer und Auge getrennt, dann zusammenzählen.', {cap: 'Faustregel'})]});
})();
