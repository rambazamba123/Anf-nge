/* ==========================================================================
   Crew – Figuren, Zeichnungen, Persönlichkeiten, feste Sätze
   Rollen: K = Käpt'n (führt das Gespräch), M = Matrose, T = Bordtier, P = Prüfer
   ========================================================================== */
const SKIN = '#f4d0ac', INK = '#2b2118', CHEEK = '#f19a9a', MOUTH = '#7a3f33';

/* Gemeinsame Bausteine: .bod wippt beim Sprechen, .gaze steuert die Blickrichtung,
   .eyes blinzelt, .mouth .o öffnet sich beim Sprechen, .mouth .c ist der geschlossene Mund. */
const eyes = (pts, r = 2.6) => `<g class="gaze"><g class="eyes">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`).join('')}</g></g>`;
const cheeks = (pts, r = 4.5) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CHEEK}" opacity=".55"/>`).join('');
const mouth = (closed, ox, oy, rx = 4, ry = 3.2) =>
  `<g class="mouth">${closed ? `<path class="c" d="${closed}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` : ''}<ellipse class="o" cx="${ox}" cy="${oy}" rx="${rx}" ry="${ry}" fill="${MOUTH}"/></g>`;
const shadow = (rx = 36, cy = 141) => `<ellipse cx="50" cy="${cy}" rx="${rx}" ry="5" fill="#3a2414" opacity=".13"/>`;

const ART = {
  hinnerk: () => `${shadow(38)}<g class="bod">
    <ellipse cx="50" cy="100" rx="42" ry="40" fill="#3d5f8f"/>
    <path d="M36 70 Q33 100 36 134 M64 70 Q67 100 64 134" stroke="#4d73a6" stroke-width="3" fill="none" opacity=".7"/>
    <circle cx="50" cy="48" r="28" fill="${SKIN}"/>
    <ellipse cx="50" cy="68" rx="27" ry="20" fill="#f6f2e8"/>
    ${mouth('M45 73 Q50 77.5 55 73', 50, 74.5, 4.5, 3.4)}
    <circle cx="50" cy="55" r="6" fill="#eaa38e"/>
    ${eyes([[40, 42], [60, 42]])}
    <path d="M35 34 Q40 31 45 34 M55 34 Q60 31 65 34" stroke="#f6f2e8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M21 36 Q50 2 79 36 Z" fill="#26406a"/>
    <rect x="17" y="34" width="66" height="7" rx="3.5" fill="#1b2e4d"/>
    <circle cx="50" cy="22" r="3.5" fill="#e3b552"/></g>`,

  ilse: () => `${shadow(38)}<g class="bod">
    <ellipse cx="50" cy="100" rx="40" ry="40" fill="#3f6e8c"/>
    <path d="M37 76 Q33 102 37 134 M63 76 Q67 102 63 134" stroke="#5b88a6" stroke-width="3" fill="none"/>
    <circle cx="50" cy="46" r="26" fill="${SKIN}"/>
    <path d="M24 46 Q24 18 50 18 Q76 18 76 46 Q70 30 50 30 Q30 30 24 46 Z" fill="#d9d6cf"/>
    <circle cx="50" cy="14" r="9" fill="#d9d6cf"/>
    <rect x="24" y="66" width="52" height="11" rx="5.5" fill="#d6513c"/>
    <rect x="36" y="66" width="6" height="11" fill="#f7f2e6"/><rect x="57" y="66" width="6" height="11" fill="#f7f2e6"/>
    <rect x="60" y="73" width="10" height="22" rx="4" fill="#d6513c"/>
    ${eyes([[42, 45], [58, 45]], 2.4)}
    <circle cx="42" cy="45" r="5.6" fill="none" stroke="#b08a4e" stroke-width="1.4"/><circle cx="58" cy="45" r="5.6" fill="none" stroke="#b08a4e" stroke-width="1.4"/><path d="M47.6 45 L52.4 45" stroke="#b08a4e" stroke-width="1.4"/>
    ${cheeks([[33, 55], [67, 55]])}
    ${mouth('M45 59 Q50 63 55 59', 50, 60, 4, 3)}
    <path d="M30 114 L54 98 M70 114 L46 98" stroke="#c9a36a" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="42" y="102" width="16" height="10" rx="3" fill="#e3b552"/>
    <circle cx="83" cy="126" r="9" fill="#d6513c"/><path d="M77 122 Q83 128 89 122" stroke="#b33f2e" stroke-width="1.2" fill="none"/></g>`,

  smilla: () => `${shadow(36)}<g class="bod">
    <ellipse cx="18" cy="62" rx="6" ry="13" fill="#b5562f"/><ellipse cx="82" cy="62" rx="6" ry="13" fill="#b5562f"/>
    <ellipse cx="50" cy="100" rx="38" ry="40" fill="#f2c040"/>
    <path d="M50 70 L50 138" stroke="#d9a62c" stroke-width="2"/>
    <circle cx="56" cy="88" r="2.4" fill="#b98a1c"/><circle cx="56" cy="104" r="2.4" fill="#b98a1c"/><circle cx="56" cy="120" r="2.4" fill="#b98a1c"/>
    <circle cx="50" cy="48" r="27" fill="${SKIN}"/>
    <path d="M26 44 Q34 37 50 39 Q66 37 74 44 L74 40 Q50 28 26 40 Z" fill="#b5562f"/>
    <path d="M24 42 Q50 6 76 42 Z" fill="#d6513c"/>
    <circle cx="50" cy="12" r="5" fill="#f7f2e6"/>
    ${eyes([[41, 50], [59, 50]])}
    ${cheeks([[33, 58], [67, 58]])}
    ${mouth('M45 59 Q50 64 55 59', 50, 61, 4, 3.4)}</g>`,

  piet: () => `${shadow(30)}<g class="bod">
    <ellipse cx="50" cy="110" rx="30" ry="30" fill="#f7f2e6"/>
    <path d="M24 102 Q50 106 76 102 M22 114 Q50 118 78 114 M26 126 Q50 130 74 126" stroke="#3d5f8f" stroke-width="3.5" fill="none"/>
    <circle cx="50" cy="62" r="24" fill="${SKIN}"/>
    <path d="M28 64 Q26 50 34 47 L37 60 Z M72 64 Q74 50 66 47 L63 60 Z" fill="#8a5a35"/>
    <path d="M27 57 Q50 29 73 57 Z" fill="#3c8c5a"/>
    <rect x="64" y="52" width="20" height="6" rx="3" fill="#2e6e45"/>
    ${eyes([[42, 64], [58, 64]], 2.5)}
    <circle cx="38" cy="70" r="1" fill="#c98a5a"/><circle cx="41" cy="72" r="1" fill="#c98a5a"/><circle cx="59" cy="72" r="1" fill="#c98a5a"/><circle cx="62" cy="70" r="1" fill="#c98a5a"/>
    ${cheeks([[35, 72], [65, 72]], 4)}
    ${mouth('M43 74 Q50 81 57 74', 50, 76, 4.5, 3.6)}</g>`,

  klabauter: () => `${shadow(26)}<g class="bod">
    <path d="M44 120 L35 143 L60 143 L56 120 Z" fill="#2f7fb5"/>
    <ellipse cx="50" cy="96" rx="30" ry="38" fill="#5fae5a"/>
    <ellipse cx="45" cy="106" rx="15" ry="23" fill="#7cc274"/>
    <ellipse cx="65" cy="101" rx="11" ry="22" fill="#448c4a"/>
    <path d="M48 27 Q45 12 53 18 M55 25 Q57 10 63 18" stroke="#e2463b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="49" r="24" fill="#e2463b"/>
    <circle cx="59" cy="45" r="7" fill="#f7f2e6"/>
    ${eyes([[60, 45]], 3.5)}
    ${mouth('', 72, 60, 3.4, 3)}
    <path d="M71 49 Q89 51 77 66 Q71 59 68 55 Z" fill="#f2b233"/>
    <path d="M43 134 L41 143 M57 134 L59 143" stroke="#eb9a4a" stroke-width="3" stroke-linecap="round"/></g>`,

  backbord: () => `${shadow(30)}<g class="bod">
    <path d="M70 122 Q98 112 88 86" stroke="#d98a3c" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="108" rx="32" ry="32" fill="#e39a4c"/>
    <ellipse cx="50" cy="116" rx="16" ry="18" fill="#f6e3c8"/>
    <path d="M28 50 L30 26 L46 40 Z M72 50 L70 26 L54 40 Z" fill="#e39a4c"/>
    <path d="M32 46 L33 32 L42 41 Z M68 46 L67 32 L58 41 Z" fill="#f19a9a"/>
    <circle cx="50" cy="62" r="26" fill="#e39a4c"/>
    <path d="M44 40 L46 48 M50 38 L50 47 M56 40 L54 48" stroke="#c97a35" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="50" cy="72" rx="12" ry="8" fill="#f6e3c8"/>
    ${eyes([[40, 60], [60, 60]], 3)}
    ${mouth('M46 75 Q48 78 50 75 Q52 78 54 75', 50, 77, 3.5, 3)}
    <path d="M47 68 L53 68 L50 71 Z" fill="#e07a7a"/>
    <path d="M38 72 L24 70 M38 75 L24 77 M62 72 L76 70 M62 75 L76 77" stroke="#7a5a3a" stroke-width="1" stroke-linecap="round"/>
    <rect x="32" y="84" width="36" height="6" rx="3" fill="#2b4a6b"/>
    <circle class="glow" cx="64" cy="88" r="7" fill="#e2463b" opacity=".22"/><circle cx="64" cy="88" r="4.2" fill="#e2463b"/>
    <circle class="glow" cx="36" cy="88" r="7" fill="#3c8c5a" opacity=".22"/><circle cx="36" cy="88" r="4.2" fill="#3c8c5a"/></g>`,

  kroeger: () => `${shadow(36)}<g class="bod">
    <ellipse cx="50" cy="96" rx="38" ry="40" fill="#7d8896"/>
    <path d="M42 68 L50 88 L58 68 Z" fill="#f7f2e6"/>
    <path d="M50 74 L46 100 L50 106 L54 100 Z" fill="#b8392f"/>
    <circle cx="50" cy="43" r="26" fill="${SKIN}"/>
    <path d="M25 37 Q50 5 75 37 Q50 27 25 37 Z" fill="#c4c1b8"/>
    ${eyes([[41, 45], [59, 45]], 2.2)}
    <circle cx="41" cy="45" r="7.5" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="59" cy="45" r="7.5" fill="none" stroke="${INK}" stroke-width="2"/>
    <path d="M48.5 45 L51.5 45" stroke="${INK}" stroke-width="2"/>
    ${mouth('M44 58 L56 58', 50, 58.5, 4, 3)}
    <rect x="76" y="89" width="22" height="30" rx="3" fill="#b88a5c"/><rect x="80" y="95" width="14" height="20" rx="1" fill="#f7f2e6"/>
    <path d="M83 100 L91 100 M83 105 L91 105 M83 110 L88 110" stroke="#9a9a9a" stroke-width="1.2"/></g>`,
};

/* Figuren-Steckbriefe. role: Platz an Bord. voicePref: Namen vorinstallierter ElevenLabs-Stimmen
   in Wunschreihenfolge, fx: Wiedergabe-Tempo (verändert auch die Tonhöhe, z. B. für den Papagei). */
const CREW = {
  hinnerk: {name: "Käpt'n Hinnerk", short: 'Hinnerk', role: 'K', color: '#3d5f8f',
    blurb: '38 Jahre Kapitän der Helgoland-Fähre, nie eine Fahrt verpasst.',
    story: 'Hinnerk ist 63 und fuhr 38 Jahre lang die Fähre nach Helgoland, ohne eine einzige Fahrt zu verpassen. Sein Lieblingsthema ist der große Sturm von 87, bei dem die Wellen mit jedem Erzählen höher werden. Seekrank wird er nur im Aufzug.',
    persona: 'Käpt\'n Hinnerk, 63, war 38 Jahre Kapitän der Helgoland-Fähre. Brummig-herzlich, gemütlich, ruhig und weise wie ein alter Handwerksmeister, trocken-humorvoll. Spricht leicht norddeutsch ("Moin", "nö", "Mensch", "klönen", "Butter bei die Fische"), bleibt aber gut verständlich. Running Gag: der große Sturm von 87, die Wellen werden mit jedem Erzählen höher. Wird nur im Aufzug seekrank.',
    voicePref: ['Bill', 'George', 'Brian', 'Arnold', 'Clyde', 'Roger'], gender: 'male', age: 'old', fx: 0.98, pitch: 0.75, rate: 0.95},
  ilse: {name: 'Oma Ilse', short: 'Ilse', role: 'K', color: '#3f6e8c',
    blurb: 'Ex-Krabbenfischerin aus Büsum, strickt immer.',
    story: 'Ilse ist 71 und war Krabbenfischerin in Büsum. Sie strickt ständig, erklärt die härtesten Regeln im sanftesten Ton und lässt trotzdem nie locker, bis es sitzt.',
    persona: 'Oma Ilse, 71, Ex-Krabbenfischerin aus Büsum. Strickt ständig, erklärt die härtesten Regeln im sanftesten Ton und lässt nie locker, bis es sitzt. Sagt "mien Jung" oder "mien Deern", leicht norddeutsch, warm und bestimmt.',
    voicePref: ['Matilda', 'Alice', 'Sarah', 'Laura', 'Dorothy'], gender: 'female', age: 'old', fx: 0.96, pitch: 1.05, rate: 0.93},
  smilla: {name: 'Matrosin Smilla', short: 'Smilla', role: 'M', color: '#d9a21c',
    blurb: 'Fischerstochter von Föhr, kennt jede Prüfungsfalle.',
    story: 'Smilla ist 24 und Fischerstochter von Föhr. Beim ersten Versuch ist sie in der Navigation durchgefallen, weil sie die falsche Tonne 10 erwischt hat. Seitdem kennt sie jede Prüfungsfalle. Sie träumt von einer Reise nach Skagen und malt Krickelmännchen ins Logbuch.',
    persona: 'Matrosin Smilla, 24, Fischerstochter von Föhr. Flink, frech, modern, erklärt knapp und anschaulich. Ist beim ersten Mal in der Navigation durchgefallen, weil sie die falsche Tonne 10 erwischt hat, und kennt deshalb jede Prüfungsfalle. Träumt von einer Reise nach Skagen, malt Krickelmännchen ins Logbuch, frotzelt gern mit dem Käpt\'n.',
    voicePref: ['Lily', 'Charlotte', 'Jessica', 'Laura', 'Aria', 'Sarah'], gender: 'female', age: 'young', fx: 1.02, pitch: 1.2, rate: 1.04},
  piet: {name: 'Hafenjunge Piet', short: 'Piet', role: 'M', color: '#3c8c5a',
    blurb: 'Zwölf, hängt am Steg und fragt, was sich keiner traut.',
    story: 'Piet ist 12 und hängt jeden Tag am Steg. Er weiß alles aus Videos, hat aber noch nie selbst gesteuert. Er stellt genau die Fragen, die sich sonst keiner traut.',
    persona: 'Hafenjunge Piet, 12, hängt am Steg und stellt genau die Fragen, die sich sonst keiner traut. Weiß alles aus Videos, hat aber noch nie selbst ein Boot gesteuert. Begeistert, schnell, ein bisschen vorlaut, aber lieb.',
    voicePref: ['Liam', 'Will', 'Charlie', 'River', 'Callum'], gender: 'male', age: 'young', fx: 1.08, pitch: 1.35, rate: 1.08},
  klabauter: {name: 'Papagei Klabauter', short: 'Klabauter', role: 'T', color: '#d93b30',
    blurb: 'Kam in einer Bananenkiste nach Hamburg, macht das Horn nach.',
    story: 'Klabauter kam vor 40 Jahren in einer Bananenkiste im Hamburger Hafen an. Vom alten Seefunk hat er Fetzen des Seewetterberichts gelernt, die er gern im falschen Moment aufsagt. Das Schiffshorn macht er perfekt nach. Er liebt Zwieback.',
    persona: 'Papagei Klabauter, kam vor 40 Jahren in einer Bananenkiste nach Hamburg. Plappert nur kurze Fetzen: Fachbegriffe, Seewetterbericht ("West 5 bis 6, böig!"), macht das Schiffshorn nach ("Tuuut!"), liebt Zwieback. Spricht ausschließlich in sehr kurzen, lustigen Einwürfen von höchstens acht Wörtern und wiederholt gern ein Schlüsselwort.',
    voicePref: ['Callum', 'Charlie', 'Will', 'Liam', 'River'], gender: 'male', age: 'any', fx: 1.24, pitch: 1.8, rate: 1.15},
  backbord: {name: 'Bordkatze Backbord', short: 'Backbord', role: 'T', color: '#d98a3c',
    blurb: 'Halsband mit Lämpchen: von ihr aus links rot, rechts grün.',
    story: 'Backbord trägt ein Halsband mit zwei Lämpchen: von ihr aus gesehen links rot und rechts grün, genau wie die Seitenlichter. Von vorn betrachtet ist es deshalb andersherum, und genau das ist der Trick. Sie ist etwas eitel und vergisst nie, welche Seite welche ist.',
    persona: 'Bordkatze Backbord. Trägt ein Halsband mit zwei Lämpchen: von ihr aus links rot, rechts grün, wie die Seitenlichter. Schnurrt, ist etwas eitel, verschmitzt, merkt sich alles über Seiten, Lichter und Tonnen. Spricht nur in sehr kurzen Einwürfen von höchstens zehn Wörtern, gern mit "Mrrr".',
    voicePref: ['Lily', 'Jessica', 'Charlotte', 'Aria'], gender: 'female', age: 'any', fx: 1.12, pitch: 1.5, rate: 1.05},
  kroeger: {name: 'Prüfer Dr. Kröger', short: 'Dr. Kröger', role: 'P', color: '#6b7684',
    blurb: 'Ehemaliger Meteorologe, prüft seit 25 Jahren.',
    story: 'Dr. Kröger war Meteorologe und prüft seit 25 Jahren. Er ist streng, weil der Wind keine Rücksicht auf Anfänger nimmt. Heimlich steckt er Durchgefallenen Lerntipps zu und baut Modellschiffe in Flaschen.',
    persona: 'Prüfer Dr. Kröger, ehemaliger Meteorologe, prüft seit 25 Jahren. Streng, sachlich, kurze Sätze, heimlich nett.',
    voicePref: ['Daniel', 'Roger', 'Eric', 'Brian', 'George'], gender: 'male', age: 'middle', fx: 1, pitch: 0.9, rate: 0.98},
};
const ROLE_OPTIONS = {K: ['hinnerk', 'ilse'], M: ['smilla', 'piet'], T: ['klabauter', 'backbord']};
const ROLE_NAMES = {K: "Käpt'n", M: 'Matrose', T: 'Bordtier', P: 'Prüfer'};

function charSVG(id, extraCls = '') {
  return `<svg class="ch ${extraCls}" data-ch="${id}" viewBox="0 -2 100 147" aria-hidden="true">${ART[id]()}</svg>`;
}
function charG(id, x, y, s = 1, extraCls = '') {
  return `<g class="ch ${extraCls}" data-ch="${id}" transform="translate(${x} ${y}) scale(${s})">${ART[id]()}</g>`;
}

/* Feste Sätze: werden einmalig in hoher Qualität erzeugt und dann vom Handy abgespielt. */
const LINES = {
  hinnerk: {
    moin: [
      'Na, schon wieder da? Sehr gut, das gefällt mir.',
      'Moin!',
      'Moin moin!',
      'Mooin moin! Schön, dass du wieder an Bord bist.',
      'Moooooin… Mensch, wo warst du denn so lange?',
      'Mooooooooin! Wir dachten schon, du bist über Bord gegangen!',
    ],
    tap: ['Hab ich dir schon vom großen Sturm von 87 erzählt? Die Wellen waren so hoch wie der Leuchtturm. Mindestens.', 'Ruhig Blut. Wer ruhig bleibt, kommt sicher an.', 'Butter bei die Fische: Heute lernen wir was.'],
    talk: 'Na, worüber wollen wir klönen?',
    after: ['Das war ordentlich Fahrt. Weiter so!', 'Gut gemacht. Morgen geht es weiter.', 'Das waren ein paar Brecher. Macht nix, morgen sitzt das.'],
  },
  ilse: {
    moin: [
      'Na, mien Jung, schon wieder da? Fein.',
      'Moin!',
      'Moin moin!',
      'Mooin moin! Setz dich, der Tee ist noch warm.',
      'Moooooin… Wo hast du dich denn rumgetrieben?',
      'Mooooooooin! Ich hab schon drei Pullover gestrickt, so lange warst du weg!',
    ],
    tap: ['Erst die Masche, dann der Pullover. Erst die Regel, dann die Fahrt.', 'Nicht hudeln. Gründlich ist schneller.', 'Noch ein Tee, mien Jung?'],
    talk: 'So, mien Jung. Worüber wollen wir schnacken?',
    after: ['Ordentlich gemacht. So mag ich das.', 'Gut. Morgen machen wir weiter.', 'Das war noch nichts. Morgen nochmal, ganz in Ruhe.'],
  },
  smilla: {
    tap: ['Ich sag nur: Tonne 10. Es gibt zwei davon. Merk dir das!', 'Wenn ich die Prüfung bestanden hab, segle ich nach Skagen.', 'Der Käpt\'n erzählt gleich wieder vom Sturm. Wetten?'],
    right: ['Klar Schiff!', 'Jawoll!', 'Genau so!', 'Sitzt!'],
    praise: ['Wow, das war stark! Fast alles richtig.', 'Gute Runde! Ein paar Wackler, aber das wird.', 'Puh, das war rau. Aber genau dafür üben wir ja.'],
  },
  piet: {
    tap: ['Darf ich mal steuern? Nur ganz kurz?', 'Ich hab ein Video gesehen, da ist einer rückwärts angelegt. Krass.', 'Wie viele Knoten kannst du schon?'],
    right: ['Krass, richtig!', 'Yes!', 'Voll gut!', 'Stimmt!'],
    praise: ['Boah, fast alles richtig!', 'Gar nicht schlecht! Ein paar gingen daneben.', 'Das war schwer, oder? Ich hätte das auch nicht gewusst.'],
  },
  klabauter: {
    tap: ['Tuuuut! Tuuuut!', 'Deutsche Bucht: West fünf bis sechs, böig!', 'Zwieback! Zwieback!'],
    wrong: ['Falsch! Falsch! Tuuut!', 'Uiuiui! Nochmal!', 'Kawumm! Daneben!'],
    right: ['Richtig! Richtig!', 'Zwieback für dich!'],
  },
  backbord: {
    tap: ['Mrrr. Von mir aus links ist rot. Merk dir das, Schätzchen.', 'Schnurr. Rot ist Backbord. Wie ich.', 'Ich putz mich jetzt.'],
    wrong: ['Mrrr. Daneben, Schätzchen.', 'Fauch! Nochmal.', 'Miau. Das war nix.'],
    right: ['Schnurr. Richtig.', 'Mrrr. Sehr gut.'],
  },
  kroeger: {
    start: 'Guten Tag. Dreißig Fragen, sechzig Minuten. Hilfsmittel sind nicht erlaubt. Sie dürfen beginnen.',
    time10: 'Noch zehn Minuten.',
    time3: 'Noch drei Minuten. Behalten Sie die Ruhe.',
    end: 'Die Zeit ist um. Stifte hinlegen, bitte.',
    pass: ['Bestanden. Ordentliche Arbeit.', 'Bestanden. Das hat der Wind nicht kommen sehen.'],
    fail: ['Nicht bestanden. Der Wind nimmt keine Rücksicht auf Anfänger. Aber Sie lernen schnell.', 'Leider nicht bestanden. Schauen Sie sich die Fehler an. Das schaffen Sie.'],
    tap: ['Bitte keine Fragen während der Prüfung.', 'Ich beobachte das Wetter. Und Sie.'],
  },
};
const lineOf = (id, key, i) => { const v = LINES[id] && LINES[id][key]; if (!v) return ''; if (Array.isArray(v)) return i === undefined ? v[Math.random() * v.length | 0] : v[Math.min(i, v.length - 1)]; return v; };

/* Intro-Skript. {K} {M} {T} werden durch die aktuellen Namen ersetzt. */
const INTRO = [
  {s: 'K', t: 'Ich sag dir, die rote Tonne bleibt an Backbord, wenn wir reinkommen!', look: true},
  {s: 'M', t: 'Ja, eben! Rot an Backbord, beim Einlaufen. Hab ich doch gesagt!', look: true},
  {s: 'K', t: 'Nee, hast du nich. Du hast Steuerbord gesagt. Ich hab das genau gehört.', look: true},
  {s: 'M', t: 'Du hörst ja nicht mal das Nebelhorn, wenn es direkt neben dir tutet!', look: true},
  {s: 'T', t: 'Tuuuut! Rot an Backbord! Tuuuut!', look: true, horn: true},
  {s: 'K', t: 'Oh. Moin! Wir kriegen Besuch.', turn: true},
  {s: 'M', t: 'Du musst der Neue sein. Willkommen an Bord!'},
  {s: 'K', t: 'Ich bin {K}, Käpt\'n auf diesem Kahn. Das ist {M}, und der Krachmacher da heißt {T}.'},
  {s: 'M', t: 'Wir bringen dich sicher durch den Sportbootführerschein See. Versprochen.'},
  {s: 'K', t: 'Sag mal, dürfen wir dich auch hören? Dann können wir ganz normal miteinander schnacken.'},
];
/* Fragen fürs Kennenlernen im Gespräch */
const ONB = {
  micOk: {s: 'M', t: 'Super, ich hör dich. Wie heißt du denn?'},
  name: {s: 'M', t: 'Wie heißt du denn?'},
  nameAgain: {s: 'M', t: 'Das hab ich nicht verstanden. Sag einfach nur deinen Vornamen.'},
  exam: {s: 'K', t: 'Und wann ist deine Prüfung? Sag einfach das Datum.'},
  examAgain: {s: 'K', t: 'Das Datum hab ich nicht verstanden. Sag es zum Beispiel so: elfter November.'},
  minutes: {s: 'M', t: 'Wie viele Minuten hast du am Tag zum Lernen, so ungefähr?'},
  boat: {s: 'K', t: 'Bist du schon mal selbst ein Boot gefahren?'},
  room: {s: 'M', t: 'Ist noch jemand bei dir im Raum? Dann sag ruhig auch mal Moin!'},
  roomYes: {s: 'T', t: 'Moin! Moin! Zwei Leute! Doppelt Zwieback!'},
  roomFish: {s: 'K', t: 'Hm. Keiner da? Dann nenn ich dich einfach Fisch, weil ich dich nicht höre. Moin, Fisch!'},
  done: {s: 'K', t: 'So. Kurs ist abgesteckt. Dann mal: Leinen los!'},
};
