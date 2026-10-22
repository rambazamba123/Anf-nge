# Kajütenfunk als Hörkurs – Konzept (Fassung 3)

Stand: 22.10.2026. Der Prüfbericht vom selben Tag ist eingearbeitet. Der Nutzer hat entschieden: „Implementiere die Anregungen.“
- **Daten:**
  - Kursplan: `podcast/kursplan-sbf.json`
  - alle Fragen je Lektion mit allen vier amtlichen Antworten: `docs/kurs-fragen-sbf.md`
- **Werkzeuge:**
  - `tools/kursplan-pruefen.js` prüft den Kursplan.
  - `tools/podcast-pruefen.js` prüft auch Lektionsskripte (Abschnitt 9).
- **Regelwerk:** `PODCAST_BIBLE.md` und `PODCAST_STATUS.md` werden nach deiner Freigabe dieser Fassung neu gefasst (R15). Bis dahin gelten ihre Regeln zu Ton, Fakten, Aussprache und Audio.

---

## 0. Was sich gegenüber Fassung 2 ändert

| # | Fassung 2 | Fassung 3 | Bericht |
|---|---|---|---|
| 1 | 9 feste Teile in jeder Lektion | **feste Klammer + wechselnder Kern** mit einem Baustein aus sieben | B3, D1 |
| 2 | „Prüfungsdeutsch“ als Schlussblock | **Katalogsatz direkt im Schritt** („Im Katalog heißt das: …“), am Ende ein **Fallen-Check** mit echten amtlichen Falschantworten | B3, B6 |
| 3 | Klabauter sagt drei Merksätze | **Abschluss als Abruf:** Der Hörer nennt die Kernsätze selbst, dann bestätigt Klabauter | B3 |
| 4 | Merkhilfe in jedem Schritt | **höchstens drei** pro Lektion, jede mit Geltungsbereich („gilt beim Kreuzen“) | B3, F |
| 5 | – | **Vorab-Frage im Einstieg,** aufgelöst in der Anwendung | B6 |
| 6 | Denkpause 3 Sekunden | **4 s erinnern, 6 s entscheiden, 8 s Abschluss,** mit leisem Signalton, fest in der MP3 | B6, E |
| 7 | 8 Kapitel, 32 Lektionen | **9 Kapitel, 39 Lektionen** (Abschnitt 2) | C |
| 8 | Szene 3.2 in der Kieler Förde | im **freien Wasser**; jede Szene bekommt eine **Revier-Angabe** | A, F |
| 9 | Smilla führt fast alles, Hinnerk irrt oft | **Lastverteilung** (Abschnitt 5); Hinnerk ist Experte und irrt nur bei Hafenweisheiten; **Quirin ist Mitlerner;** Harms kommt öfter, aber kurz | B4 |
| 10 | – | **Regeln für Irrtümer** (Refutation): Berichtigung innerhalb von 20 Sekunden, mit Warum | B4 |
| 11 | – | **Humor** nur an festen Stellen, Platt nur als Würze, Fachbegriffe hochdeutsch | B5 |
| 12 | alle Fragen zur Lektion sofort | **die Hälfte sofort, die andere Hälfte am nächsten Tag** im „Kurs für heute“ | B7 |
| 13 | vorgelesene Fragerunde im „Auto-Modus“ | **freie Abrufrunde** (Kurzfrage, Pause, Kernantwort). Es heißt „unterwegs über Bluetooth“, nicht „Auto-Modus“, weil Android Auto keine Web-Apps zeigt | B7, E |
| 14 | – | **Signale:** Smilla nennt die Folge in Worten, die App zeigt ● ▬, Signaltöne nie als Kulisse | B8 |
| 15 | Lernkarten zum Hören | **Hörkarten mit Fragehinweis** (ohne Bildschirm verständlich), dazu **„Im Kurs nachhören“** per Zeitmarke | B1 |
| 16 | – | **Prüfweg je Lektion** mit Rückprüfung per Spracherkennung, Lautheitsausgleich und Schreibregeln | F, E |
| 17 | Audio im App-Repository | **Audio getrennt hosten** (Abschnitt 8) | E |

**Zwei Korrekturen am Bericht** (nachgeprüft am Katalog):
- **Die Falle „112,5°“ zu Frage 81 ist echt.** Die amtliche Falschantwort lautet „… aus einer Richtung von mehr als 112,5° achterlicher als querab (Bereich der Seitenlichter) …“. Sie bleibt im Fallen-Check.
- **Im Fallen-Check von 7.4 stand eine erfundene Falle** („Grenzen der Schutzgebiete beim Umweltbundesamt“). Ersetzt durch eine amtliche Falschantwort zu Frage 218.

---

## 1. Ziel und Leitidee

Ein **Theoriekurs zum Hören,** der den SBF See wirklich erklärt.
- Der Kurs lehrt Gedanken, nicht Fragen: 285 Fragen auf etwa 70 Kerngedanken.
- Er baut Abruf und Fehlvorstellungen bewusst ein.
- Jedes Medium macht, was es kann.

**Drei Bausteine:**
1. **Hörkurs** (Kajütenfunk): Unterricht am Stück, mit Kapitelmarken.
2. **Hörkarten** zu jeder Frage (etwa 20 Sekunden):
   - Fragehinweis, Erklärung, Falle, Merkhilfe; ohne Bildschirm verständlich;
   - für „🎧 Erklärung hören“ und die persönliche Nachhilfe-Liste.
   - Dazu „**Im Kurs nachhören**“: Sprung an die Stelle der Lektion, an der der Gedanke erklärt wird. Das kostet keine Zeichen.
3. **App:** Prüfungsfragen im Original mit Bild, Lernkartei mit Farben, Spiele, Navigationsschule, Manöver, Knoten.

**Basisfragen 1–72** gelten auch für SBF Binnen. Die Lektionen 2.1–2.3 und 7.4 werden möglichst ohne See-Bezug geschrieben, damit Binnen sie übernehmen kann (Entscheidung K5).

---

## 2. Kursplan (Fassung 3)

Lektion 0, neun Kapitel, 39 Lektionen. Jede der 285 Fragen steht genau einmal (geprüft mit `node tools/kursplan-pruefen.js`). Die Bausteine wechseln von Lektion zu Lektion.

**Kapitel 0: Willkommen an Bord**

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 0 | Willkommen an Bord: der Kurs und die Prüfung | – | – | – | 6 min |

**Kapitel 1: Grundlagen: Verantwortung und Begriffe** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 1.1 | Wer hat an Bord das Sagen? (Gast: Wasserschutzpolizei) | 1, 2, 59, 75–78 | 0 | Gast | 9 min |
| 1.2 | Die Sprache der Seeleute | 3, 6, 8, 9, 89 | 0 | Kopfkino | 7 min |

**Kapitel 2: Das Boot: Technik, Sicherheit, Manövrieren** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 2.1 | Propeller, Ruder und Radeffekt | 41, 44–48, 50, 51 | 0 | Garn | 10 min |
| 2.2 | Der Motor: überwachen, Störungen, tanken | 42, 43, 49, 52–57, 60 | 0 | Fehler-Detektiv | 12 min |
| 2.3 | Gas, Feuer und Rettungsmittel | 62–69 | 0 | Stichprobe | 10 min |
| 2.4 | Anlegen, Begegnen, Sog und Schwell (Gast: Hafenmeisterin) | 34–37, 40, 61 | 0 | Gast | 8 min |
| 2.5 | Ankern, Baden und Wassersport | 25, 39, 169–171, 179–181 | 3 | Streitgespräch | 10 min |
| 2.6 | Die praktische Prüfung: Manöver und Knoten | Praxis | – | Kopfkino | 10 min |

**Kapitel 3: Wer weicht wem aus?** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 3.1 | Welche Regeln gelten, und wann wird es gefährlich? | 73, 74, 90, 125, 272, 273 | 0 | Garn | 8 min |
| 3.2 | Begegnen, Kreuzen, Überholen, Segeln | 14, 15, 81, 126, 127, 137 | 0 | Streitgespräch | 12 min |
| 3.3 | Wer hat Vorrang? Die Rangfolge | 82, 83, 128–132 | 0 | Stichprobe | 9 min |
| 3.4 | Kurshalter, Ausweichpflichtiger und der letzte Augenblick | 4, 5, 79, 80, 135, 136, 139, 140, 162–164 | 2 | Ton-Labor | 13 min |

**Kapitel 4: Wer ist das da draußen? Lichter, Signalkörper, Schallsignale** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 4.1 | Die Sprache der Lichter | 7, 10–13, 85, 86, 91, 92, 113, 159, 160 | 2 | Kopfkino | 14 min |
| 4.2 | Vor Anker, auf Grund, im Schlepp | 93–96, 105–107, 114, 115 | 6 | Stichprobe | 11 min |
| 4.3 | Manövrierunfähig und manövrierbehindert | 97–104, 148–150 | 9 | Streitgespräch | 13 min |
| 4.4 | Tiefgangbehinderte und Fischer (Gast: Fischer) | 108–112, 133, 134 | 7 | Gast | 9 min |
| 4.5 | Hören statt sehen: Schallsignale bei verminderter Sicht | 84, 116–124, 138, 141, 274 | 3 | Ton-Labor | 15 min |

**Kapitel 5: Fahrwasser, Tonnen und Feuer** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 5.1 | Wie Feuer sprechen: Kennungen | 215, 220–224 | 0 | Kopfkino | 8 min |
| 5.2 | Das Fahrwasser und seine Tonnen | 156, 157, 190–199 | 7 | Garn | 13 min |
| 5.3 | Gefahrenstellen: Kardinal- und Einzelgefahrenzeichen | 200–209 | 9 | Fehler-Detektiv | 12 min |
| 5.4 | Leit-, Richt- und Quermarkenfeuer | 210–214 | 0 | Kopfkino | 8 min |
| 5.5 | Regeln im Fahrwasser | 24, 152, 153, 161, 165–168, 271 | 1 | Stichprobe | 11 min |

**Kapitel 6: Zeichen, Sperrungen und besondere Wasserstraßen** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 6.1 | Tafelzeichen | 17–20, 22, 23, 26, 27, 182 | 9 | Fehler-Detektiv | 11 min |
| 6.2 | Behörden, Sperr- und Warngebiete | 16, 151, 154, 155, 177, 183–189 | 10 | Ton-Labor | 14 min |
| 6.3 | Brücken, Schleusen und der Nord-Ostsee-Kanal | 21, 28–30, 173–176, 178 | 6 | Kopfkino | 11 min |
| 6.4 | Verkehrstrennungsgebiete und Verkehrszentralen (Gast: Verkehrszentrale) | 87, 88, 142–147, 158 | 0 | Gast | 11 min |

**Kapitel 7: Navigation, Gezeiten und Naturschutz** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 7.1 | Seekarte, nautische Bücher und wer was herausgibt | 58, 216, 217, 231, 232, 234–239 | 0 | Streitgespräch | 12 min |
| 7.2 | Kurs, Peilung, Standort | 240–248 | 0 | Kopfkino | 11 min |
| 7.3 | Ebbe und Flut | 233, 249–255 | 0 | Garn | 10 min |
| 7.4 | Naturschutz und Umwelt (Gast: Rangerin) | 31–33, 38, 218, 219, 225–230 | 0 | Fehler-Detektiv | 12 min |
| 7.5 | Die Kartenaufgabe: so läuft sie, so denkst du | Prüfungsteil Navigation | – | Stichprobe | 10 min |

**Kapitel 8: Wetter, Seemannschaft und Notfall** (Auftakt 3–4 min)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 8.1 | Wetter verstehen | 71, 260–270 | 3 | Garn | 14 min |
| 8.2 | Wenn es ernst wird: schweres Wetter, Mensch über Bord, Kentern | 256–259, 275–278 | 0 | Kopfkino | 10 min |
| 8.3 | Notsignale und Pflichten nach einem Unfall | 70, 72, 172, 279–285 | 3 | Streitgespräch | 12 min |

**Kapitel 9: Prüfungsreife: was man verwechselt** (Auftakt 3–4 min, bei Harms)

| Lektion | Thema | Fragen | mit Bild oder Ton | Baustein | Dauer |
|---|---|---|---|---|---|
| 9.1 | Hörprüfung: alle Schallsignale im Vergleich | Wiederholung (27 Fragen) | – | Ton-Labor | 10 min |
| 9.2 | Lichter und Signalkörper im Vergleich | Wiederholung (40 Fragen) | – | Streitgespräch | 9 min |
| 9.3 | Wer weicht wo aus? Freie See, Fahrwasser, Verkehrstrennungsgebiet | Wiederholung (28 Fragen) | – | Fehler-Detektiv | 8 min |
| 9.4 | Zahlen und Behörden, die man verwechselt | Wiederholung (30 Fragen) | – | Stichprobe | 8 min |

**Summe:** etwa 6 Stunden 50 Minuten Lektionen. Dazu kommen Lektion 0 und neun Kapitel-Auftakte, zusammen rund 7,3 Stunden.

**Änderungen und Gründe:**
- **Frage 7 (schwarzer Kegel) → 4.1:** ein Signalkörper; er gehört neben Frage 13, den motorenden Segler.
- **Frage 179 (8 km/h) → 2.5:** 8 km/h und 4,3 kn sind derselbe Wert im selben 500-m-Bereich vor Badestellen. Zusammen gelernt stützen sie sich.
- **5.1 neu, Kennungen zuerst:** Lateral- und Kardinaltonnen setzen Blitz-, Funkel- und unterbrochene Feuer voraus.
- **5.2:** Frage 197 („Oc (2) R. Whis.“) ist eine rote Tonne mit Heulsignal und gehört zu den Lateraltonnen.
- **5.4 eigenständig und kurz:** Leit-, Richt- und Quermarkenfeuer sind Navigation mit Sektoren.
- **5.5 Regeln zuletzt:** Erst wer das Fahrwasser erkennt, versteht die Regeln darin. Die Lektion ist zugleich die Brücke zu Kapitel 6.
- **Fragen 216 und 217 → 7.1:** Fundstellen-Fragen. Sie gehören in die Landkarte „wer gibt was heraus“ (BSH, GDWS, Umweltbundesamt).
- **7.5 neu: Die Kartenaufgabe.**
  - Sie ist Teil der Theorieprüfung und fehlte im Kurs.
  - Die Lektion erklärt Ablauf, Begriffe und Rechenwege und leitet in die Navigationsschule über.
  - Der Inhalt kommt aus der Prüfungsrichtlinie, die dafür in `quellen/` liegen muss.
- **Kapitel 9 neu: Prüfungsreife.**
  - Vier Vergleichslektionen ohne neue Fragen für die häufigsten Verwechslungen über Kapitelgrenzen hinweg: kurz-lang-kurz gegen lang-kurz-kurz, Rot über Rot gegen Rot-Weiß-Rot, BSH gegen GDWS.
  - Den Auftakt spricht Harms.
- **3.2 dauert 12 statt 8 Minuten:** vier Ausweichfälle mit Vorab-Frage, Anwendung und Fallen-Check.
- **Schwere Lektionen:** Bei 4.5 (Schallsignale, 15 Minuten) empfiehlt die App, sie in zwei Sitzungen zu hören.

---

## 3. Bauplan einer Lektion: feste Klammer, wechselnder Kern

| Teil | Dauer | Inhalt | Wer |
|---|---|---|---|
| 1. **Einstieg mit Lage und Vorab-Frage** | 0:45–1:00 | Echte Szene mit Geräusch und **Revier-Angabe**. Daraus folgt eine Prüfungsfrage, die der Hörer „einfach mal tippt“. Aufgelöst wird sie später. | Szene, Hinnerk oder Gast |
| 2. **Rückblick als Abruf** | 0:40 | Zwei Fragen: eine aus der vorletzten Lektion, eine aus einem früheren Kapitel. Pause, Antwort. | wechselnd: Smilla, Quirin, Harms |
| 3. **Landkarte** | 0:20 | „Heute drei Dinge: …“ | Smilla |
| 4. **Kern: 2–4 Schritte** | je 2–4 min | Regel → Warum → Bild im Kopf → (wo es eine echte Falle gibt) Irrtum und Berichtigung → **Katalogsatz** („Im Katalog heißt das: …“) → **Denkfrage mit Pause.** Merkhilfe nur, wo sie trägt, höchstens drei je Lektion. | alle |
| 5. **Ein Baustein aus dem Baukasten** | 1–2 min | wechselnd, siehe unten | je nach Baustein |
| 6. **Anwendung** | 1–2 min | Zwei bis drei Fälle, der Hörer entscheidet in der Pause. Darin wird die Vorab-Frage aufgelöst. | Smilla, Hinnerk |
| 7. **Fallen-Check** | 0:45–1:15 | Zwei bis drei **amtliche Falschantworten** als Behauptung („Stimmt's?“), Pause, kurze Berichtigung | Harms oder Quirin (abwechselnd) |
| 8. **Abschluss** | 1:00 | Der Hörer nennt die Kernsätze selbst (Pause 8 s), Klabauter bestätigt. Dann: was das an Bord heißt, die nächste Lektion, die passende App-Übung. | Klabauter, Hinnerk, Smilla |

**Der Baukasten** (rotierend, nie zweimal hintereinander; Zuordnung im Kursplan):
- **Garn** (60–90 s): eine wahre oder klar als Garn markierte Geschichte, die den Stoff trägt.
- **Harms' Stichprobe** (30 s): eine harte Prüfungsfrage, knurrige Auflösung.
- **Fehler-Detektiv:** Hinnerk erzählt eine kurze Fahrt mit Fehlern, der Hörer findet sie.
- **Ton-Labor:** echte Signale hören, benennen und vergleichen (Kapitel 3, 4, 6, 9).
- **Gast:** Wasserschutzpolizei, Hafenmeisterin, Fischer, Verkehrszentrale, Rangerin.
- **Streitgespräch:** Hinnerk und Smilla vertreten zwei Fälle, die man verwechselt. Der Hörer entscheidet.
- **Kopfkino:** eine geführte Vorstellung („Du stehst am Ruder, es ist Nacht …“), gut für Lichter und Manöver.

**Harms kommt oft vor,** aber kurz: in der Stichprobe oder im Fallen-Check, zusammen in mindestens jeder zweiten Lektion.

---

## 4. Kapitel-Auftakt (3–4 Minuten)

Er erklärt noch nichts. Er ordnet und macht neugierig.

1. **Szene oder Garn** (45 s): warum das Kapitel an Bord zählt.
2. **Was weißt du schon?** (20 s): eine offene Frage mit Pause, die Vorwissen weckt.
3. **Das Denkmodell in einem Satz** (30 s); Klabauter wiederholt es einmal. Beispiel Kapitel 4: „Lichter sind Sätze: Wer bin ich, wohin fahre ich, was tue ich gerade?“
4. **Die Landkarte** (45 s): die Lektionen und warum sie in dieser Reihenfolge kommen.
5. **Was Harms prüft** (30 s): wie viele Fragen es ungefähr gibt und welche Fallen typisch sind.
6. **Ziel** (15 s): „Am Ende des Kapitels kannst du …“

---

## 5. Figuren und Ton

**Lastverteilung:**
- **Smilla** führt durch den Unterricht und erklärt genau.
- **Hinnerk ist der Experte** für Seemannschaft, Manöver, Wetter und Garn.
  - In Kapitel 2 und 8 erklärt er, und Smilla fragt.
  - Er irrt nur bei Hafenweisheiten und Bauchgefühl („Ich war zuerst da“), nicht in jeder Lektion.
- **Quirin ist der Mitlerner.** Der Bergführer vom Chiemsee macht den Schein. Er fragt, was der Hörer denkt, und irrt wie ein Anfänger. Er bringt Übertragungen mit: Wetterumschwung am Berg, Verantwortung für die Seilschaft.
- **Klabauter** liefert die Merkhilfen („Krrah! Merken!“) und den Abschluss. Sonst macht er Witze, immer eindeutig. Er wiederholt **nie** einen falschen Satz.
- **Harms** wie in Abschnitt 3. Lektion 0 (Prüfung erklären) erst mit der Prüfungsordnung (F3).
- **Höchstens drei Stimmen pro Szene.**

**Irrtümer richtig bauen (Refutation):**
- Ein Irrtum kommt einmal und kurz.
- Die Berichtigung folgt innerhalb von 20 Sekunden, erklärt das Warum und ist mindestens so einprägsam.
- Hinnerk spricht am Ende selbst die richtige Fassung.
- Im Skript: `[[IRRTUM: sbf:15]]` … `[[BERICHTIGUNG: sbf:15]]`. Das Werkzeug misst den Abstand.

**Humor:**
- **Richtig platziert:** im Einstieg, im Garn, in Übergängen, in Merkhilfen, in Hinnerks Irrtum.
- **Nie** im Satz, der die Regel trägt, in Denkpausen oder im Katalogsatz.
- Doppeldeutigkeiten (Bible §8) nur, wo das Fachwort sein richtiges Bild behält.

**Sprache:**
- Plattdeutsch nur als Würze in Floskeln und Anreden. Fachbegriffe immer hochdeutsch.
- Viele Hörer kommen aus Süddeutschland, Österreich oder der Schweiz, und Platt ist ein Aussprache-Risiko für die Sprachausgabe.

---

## 6. Hören und Sehen

- **Bildmomente ansagen:** „Wenn du gerade aufs Handy schauen kannst: jetzt.“ Der Satz muss auch ohne Bild verständlich sein. Bilder kommen vor allem in den Kapiteln 4–6.
- **Signale:**
  - In der Prüfung stehen sie als Zeichen da (● ▬), nicht als Ton. Deshalb nennt Smilla jede Folge einmal in Worten („kurz, lang, kurz“), und die App zeigt die Zeichenfolge an. In den Lernrunden tut sie das schon.
  - Signale werden im Code mit exakter Dauer erzeugt (kurz etwa 1 s, lang 4–6 s, Fragen 4 und 5).
  - Erzeugte Hornklänge aus Soundeffekten nie für Prüfungssignale.
- **Signaltöne nie als Kulisse:** Ein Nebelhorn im Hintergrund eines Einstiegs stört das Lernen der Signale.
- **Kennungen hörbar machen** (Kann, Lektion 5.1): ein Blitz als kurzer Ton, ein unterbrochenes Feuer als langer Ton mit kurzer Lücke.
- **Mitlesen:** Text je Schritt, Standard aus. Bei Bildern nur Stichworte, denn gleichzeitig lesen und hören lenkt ab.

---

## 7. Lernkreislauf mit der App

1. **Hören:** Kapitel-Auftakt und Lektion.
   - Ein Schritt gilt erst ab 80 % gehört als „gehört“.
   - Dann werden seine Fragen grau schraffiert.
2. **Fragen zur Lektion** am Bildschirm, im Originalwortlaut mit Bild.
   - Die Hälfte kommt direkt nach dem Hören, die andere Hälfte am nächsten Tag im „Kurs für heute“.
3. **Lernkartei:** Farben und Wiederholungen wie gehabt.
4. **Nachhilfe:**
   - „🎧 Erklärung hören“ nach einer falschen Antwort (Hörkarte) oder „Im Kurs nachhören“ (Sprung in die Lektion);
   - eine persönliche Liste aus den Hörkarten der roten, orangen und „Tricky“-Fragen, mit festen Überleitungen („Nächste Karte“).
5. **Kapitel-Check** bei Harms am Bildschirm. Unter 80 % schlägt die App die passende Nachhilfe vor.
6. **Unterwegs (über Bluetooth):** freie Abrufrunde (Kurzfrage, 5 Sekunden Pause, Kernantwort in einem Satz).
7. **Endspurt** in den letzten drei Tagen: Schwächen-Hörkarten und die Hörprüfung aller Signale (9.1).
8. **Probeprüfung,** sobald die Prüfungsreife stimmt.

---

## 8. Technik

**Grundsätze:**
- **Pausen gehören in die MP3.** Bei ausgeschaltetem Bildschirm drosselt Chrome auf Android die Zeitgeber, eine eingefügte Pause wäre unzuverlässig. Länger warten geht nur bei eingeschaltetem Bildschirm (Taste „Lösung jetzt“).
- **Alles, was der Lernstand steuert, besteht aus festen Clips:** Lektion, Schritt, Hörkarte, Signal. Die App setzt daraus Wiedergabelisten zusammen. Das ist Personalisierung ohne Server und ohne Zusatzkosten.
- **Android Auto zeigt keine Web-Apps.** Es geht über Bluetooth mit Lenkradtasten und Sperrbildschirm (Media Session).

| Idee | Empfehlung |
|---|---|
| Eine Datei je Lektion, Kapitelmarken als JSON daneben | jetzt |
| Media Session (Sperrbildschirm, Bluetooth), „Weiter/Zurück“ springt schrittweise | jetzt |
| Tempo 0,8–1,5 mit gleicher Tonhöhe, „10 s zurück“, „Schritt zurück“ | jetzt |
| Herstellung je Schritt, dann zusammenfügen, mit Lautheitsausgleich | jetzt (Muss) |
| Zeitmarken je Satz: ElevenLabs bietet `text-to-dialogue/with-timestamps` (Zeitmarken je Zeichen); sonst Abgleich mit freien Werkzeugen | jetzt, mit v4 testen |
| Rückprüfung: Audio per Spracherkennung zurück in Text, mit dem Skript vergleichen | jetzt (Muss) |
| Schreibregeln und Ausspracheliste (Abkürzungen ausschreiben, Zahlen in Worten) | jetzt (Muss), vom Werkzeug geprüft |
| Signale im Code mit exakter Dauer, Zeichenfolge auf dem Bildschirm | jetzt |
| Bilder synchron zum Schritt, mit Ansage im Audio | jetzt für Kapitel 4–6 |
| Mitlesen je Schritt | jetzt (Standard aus); wortgenau: nie |
| Denkpausen in der MP3, Taste „Lösung jetzt“ | jetzt |
| „Gehört“ erst ab 80 % eines Schritts | jetzt |
| Hörkarten mit Fragehinweis; „Im Kurs nachhören“; Nachhilfe-Liste | jetzt |
| Offline: Service Worker mit Bereichsanfragen (zum Spulen); dauerhafter Speicher (`storage.persist`, fragt die App schon an) | jetzt (Muss) |
| MP3 mit 48 statt 64 kbit/s, mono | Hörtest |
| Schnelldurchlauf je Kapitel aus den Abschluss-Clips; Prüfungs-Endspurt | später |
| Freie Abrufrunde unterwegs | später |
| Spracheingabe zum Antworten | später, nur als Zusatz |
| „Frag die Crew“ (KI mit eigenem Schlüssel; Katalogantwort und Lernkarte im Auftrag, sichtbar als „KI, ohne Gewähr“) | später |
| Soundeffekte von ElevenLabs für die Kulisse (Lizenz prüfen; nie unter Erklärungen, nie als Signalklang) | später, sparsam |
| Musik oder Geräuschteppich unter Erklärungen | nie |

**Nachgeprüft am 22.10.2026:**
- **ElevenLabs Text to Dialogue** ([API-Referenz](https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert-with-timestamps.md)):
  - Es gibt einen Endpunkt mit Zeitmarken je Zeichen.
  - Die API-Referenz nennt höchstens 10 verschiedene Stimmen pro Anfrage und empfiehlt höchstens 2.000 Zeichen pro Anfrage. Unser Chunking ist auf 2.000 Zeichen eingestellt.
  - Ob das alles für Eleven v4 gilt und wie Regieanweisungen gezählt werden, zeigt erst ein Testaufruf.
- **GitHub Pages** ([Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)):
  - Eine Seite darf höchstens 1 GB groß sein, das Repository sollte unter 1 GB bleiben.
  - Die weiche Grenze für Datenverkehr liegt bei 100 GB im Monat.
  - Bei etwa 160–210 MB Kurs-Audio reicht das für einige hundert vollständige Downloads im Monat.
  - Jede Neuerzeugung bläht das Repository dauerhaft auf. **Das Audio gehört deshalb in ein eigenes Repository ohne Verlauf oder zu einem statischen Speicher** (Entscheidung K4).

---

## 9. Herstellung und Qualitätssicherung

**Prüfweg je Lektion:**
1. **Ablaufplan** (wie Anhang A) mit Fragen-Nummern, Revier und Zeiten. Freigabe durch dich.
2. **Skript** nach Skriptform (Anhang C) und Schreibregeln.
3. **Automatische Prüfung** mit `node tools/podcast-pruefen.js`. Sie prüft:
   - Hat jede Frage der Lektion ihren Katalogsatz?
   - Zitiert jeder Fallen-Check eine echte amtliche Falschantwort?
   - Hat jeder Irrtum seine Berichtigung innerhalb von 20 Sekunden?
   - Hat jede Szene eine Revier-Angabe?
   - Sind Denkpausen erlaubt (4, 6, 8 s), gibt es höchstens drei Merkhilfen und höchstens drei Stimmen je Szene?
   - Ruft der Rückblick mindestens zwei frühere Lektionen ab?
   - Gibt es Ziffern oder Zeichen im Sprechtext? Stimmen Baustein und Dauer laut Kursplan?
4. **Fachliche Prüfung** gegen den Katalog mit allen vier Antworten (`docs/kurs-fragen-sbf.md`): einmal durch ein zweites Sprachmodell, einmal durch einen Menschen mit Ausbildungserfahrung (K2).
5. **Lauttest:** das Skript einmal laut lesen oder probehalber günstig vertonen. Holpert etwas, wird es umgeschrieben.
6. **Vertonung** je Schritt (Eleven v4, Text to Dialogue).
7. **Technische Rückprüfung:** Spracherkennung gegen das Skript, Lautheit, Pausenlängen, Signaldauer.
8. **Hörtest** mit einer Person, die den Stoff nicht kennt: fünf Fragen nach dem Hören.

**Prüfliste vor dem Vertonen** (zum Abhaken; ✱ = prüft das Werkzeug):
- [ ] ✱ Alle zugeordneten Fragen kommen vor, die amtliche Antwort ist klar als richtig erkennbar.
- [ ] Keine Aussage widerspricht dem Katalog oder einer seiner richtigen Antworten.
- [ ] ✱ Das Revier jeder Szene ist angegeben und passt zur Regel (freie See, Fahrwasser, Verkehrstrennungsgebiet, Nord-Ostsee-Kanal).
- [ ] ✱ Die Fallen im Fallen-Check sind echte Falschantworten aus dem Katalog.
- [ ] ✱ Jeder Irrtum wird innerhalb von 20 Sekunden berichtigt, mit Warum.
- [ ] ✱ Jede Merkhilfe sagt, wo sie gilt; höchstens drei Merkhilfen und höchstens drei Stimmen je Szene.
- [ ] Kein Witz im Regelsatz, in einer Pause oder im Katalogsatz; jede Doppeldeutigkeit ist wörtlich harmlos lesbar.
- [ ] Keine Gruppenbeleidigung, kein Nutzername, für 12-Jährige vertretbar.
- [ ] ✱ Abkürzungen sind ausgeschrieben, Zahlen in Worten, Einheiten ausgesprochen.
- [ ] Jeder neue Fachbegriff wird beim ersten Auftreten erklärt.
- [ ] ✱ Denkpausen sind markiert: 4 s erinnern, 6 s entscheiden, 8 s Abschluss.
- [ ] Die Lektion ist ohne Bildschirm verständlich, Bildmomente sind angesagt.
- [ ] ✱ Der Rückblick ruft Stoff aus mindestens zwei früheren Lektionen ab.
- [ ] ✱ Der Baustein ist ein anderer als in der Lektion davor.
- [ ] ✱ Zeichenzahl und Dauer liegen im Rahmen der Lektion.

**Praxisaussagen** über den Katalog hinaus (Garn, „an Bord heißt das“) werden als Hinnerks Meinung erkennbar gemacht oder mit Quelle belegt und gegengelesen.

**Katalogsätze** stehen in eigenen Sätzen. Ändert sich der Katalog, muss nur dieser Schritt neu erzeugt werden. Lektion 0 nennt den Stand des Katalogs.

---

## 10. Umfang und Kosten (Zeichen bei ElevenLabs, grob)

| Teil | Zeichen |
|---|---|
| Lektionen und Auftakte (etwa 7,3 Stunden) | etwa 380.000 |
| Hörkarten mit Fragehinweis (285) | etwa 80.000 |
| Freie Abrufrunde (etwa 212 Fragen ohne Bild) | etwa 32.000 |
| **zusammen** | **etwa 490.000** |
| mit Puffer für Neuerzeugung (50–100 %) | 750.000 bis 1 Million |

- **Was kostet das?** Das hängt vom Abo und vom Modell ab. Eine Drittanbieter-Seite nennt für Eleven v3 über die API etwa 0,10 US-Dollar je 1.000 Zeichen. Das ist keine offizielle Angabe. Vor dem Start prüft Claude die aktuelle Preisliste und misst mit einem Testaufruf, ob Regieanweisungen als Zeichen zählen.
- **Speicher:** bei 48 kbit/s etwa 160 MB, bei 64 kbit/s etwa 210 MB Kurs-Audio. Die Hörkarten kommen dazu.

---

## 11. Antworten auf die Fragen des Prüfberichts

| # | Frage | Antwort |
|---|---|---|
| G1 | Falschantworten im amtlichen Wortlaut? | **Ja.** Die App hat alle vier Antworten jeder Frage. Sie stehen je Lektion in `docs/kurs-fragen-sbf.md`, und das Werkzeug prüft den Fallen-Check damit. Ausnahme: Frage 279 hat nur drei Antworten (bekannter Katalogfehler, am Original zu prüfen). |
| G2 | Prüfungsrichtlinie in `quellen/`? | **Nein, noch nicht.** Lektion 2.6 und 7.5 warten darauf. |
| G3 | Fachliche Gegenlese? | offen, deine Entscheidung (K2) |
| G4 | Zielgruppe (mit Schule oder allein)? | offen (K7) |
| G5 | Hörsituation? | offen (K7) |
| G6 | Budget? | offen (K3) |
| G7 | Zugriff auf Eleven v4? | Ja, auf deinem Handy (Hörprobe). In der Cloud nur mit dem Secret `ELEVENLABS_API_KEY` (E5a). Die drei Testaufrufe: Sprecherzahl, Zeitmarken, Zeichenzählung. |
| G8 | Hosting? | offen (K4); Empfehlung: Audio getrennt hosten |
| G9 | Binnen-Wiederverwendung? | offen (K5); Empfehlung: ja |
| G10 | Probe? | Empfehlung: Auftakt Kapitel 3, Lektion 3.2 und Lektion 7.4 als Gegenprobe; Hörtest mit drei Anfängern (K6) |

---

## 12. Deine Entscheidungen (K1–K8)

- **K1 Freigabe:** Ist diese Fassung freigegeben? Dann fasse ich `PODCAST_BIBLE.md` und `PODCAST_STATUS.md` neu, als Regelwerk für den Hörkurs statt für die Geschichte.
- **K2 Gegenleser:** Gibt es einen Ausbilder oder eine Ausbilderin mit SBF-See-Erfahrung, der oder die jede Lektion vor dem Vertonen liest? Der Bericht nennt das als wichtigste Empfehlung.
- **K3 Budget:** Wie viele Zeichen stehen für die Erstproduktion bereit, und wie viel Puffer?
- **K4 Hosting:** Audio in ein eigenes Repository (ohne Verlauf) oder zu einem anderen statischen Speicher? Mit wie vielen Nutzern rechnest du im ersten Jahr?
- **K5 Binnen:** Sollen die Lektionen 2.1–2.3 und 7.4 so geschrieben werden, dass Binnen sie übernehmen kann?
- **K6 Probe:** Auftakt Kapitel 3 + Lektion 3.2 + Lektion 7.4, dann Hörtest mit drei Anfängern?
- **K7 Zielgruppe und Hörsituation:** Lernen die meisten neben einer Bootsschule oder allein? Wird eher unterwegs oder zu Hause gehört?
- **K8 Aufräumen:** Gehen Leitfaden der Geschichte, Folge 1, Vorgeschmack und die Figuren Frieda und Jonte ins Archiv? Neu wäre die Gastrolle Rangerin. Ihre Stimme wählst du im Casting.

---

## Anhang A: Ablaufplan Lektion 3.2 „Begegnen, Kreuzen, Überholen, Segeln“ (etwa 12 Minuten)

**Fragen:** 14, 15, 81, 126, 127, 137. Vorausgesetzt werden Steuerbord/Backbord und Luv/Lee (1.2) sowie die stehende Peilung (3.1).
**Revier:** Kieler Bucht, außerhalb des Fahrwassers. Frage 126 sagt das ausdrücklich („im freien Seeraum oder außerhalb des Fahrwassers“).
**Baustein:** Streitgespräch.

| Zeit | Teil | Inhalt | Pause |
|---|---|---|---|
| 0:00–0:55 | Einstieg | Unter Motor, außerhalb des Fahrwassers. Ein Motorboot kommt von rechts. Hinnerk: „Ich war zuerst da, ich fahr.“ **Vorab-Frage:** Wer muss ausweichen? Smilla: „Tipp mal. Auflösung kommt.“ | 4 s, ohne Auflösung |
| 0:55–1:35 | Rückblick | Quirin fragt: Woran merkst du, dass es eng wird? Und: Was ist Luv? | je 4 s → Peilung steht, Abstand nimmt ab; die dem Wind zugekehrte Seite |
| 1:35–1:55 | Landkarte | Bei jeder Begegnung gibt es einen, der handelt, und einen, der Kurs hält. Heute vier Fälle: entgegen, kreuzen, überholen, Segler unter sich. | – |
| 1:55–3:55 | Schritt 1: entgegen (14, 127) | Beide nach Steuerbord, Backbord an Backbord vorbei. **Warum:** Keiner muss raten, was der andere tut. **Bild:** wie auf einem schmalen Weg weichen beide nach rechts aus. **Katalogsatz:** „Jedes Fahrzeug muss seinen Kurs nach Steuerbord ändern.“ Hinweis: Frage 127 sagt „Maschinenfahrzeuge“; für Segler gelten andere Regeln (Schritt 4). | 6 s: Du siehst nachts ein rotes und ein grünes Licht nebeneinander und ein weißes darüber. Was tust du? → Er kommt genau entgegen, beide nach Steuerbord. |
| 3:55–6:00 | Schritt 2: kreuzen (15) | `[[IRRTUM]]` Hinnerk: „Ich war zuerst da.“ `[[BERICHTIGUNG]]` Smilla: Wer den anderen an seiner Steuerbordseite hat, weicht aus. **Bild:** rechts vor links. Nachts siehst du dann sein rotes Seitenlicht. **Praxis:** deutlich nach Steuerbord, hinter seinem Heck vorbei. **Merkhilfe** (gilt beim Kreuzen): „Siehst du Rot, musst du handeln!“ Auflösung der Vorab-Frage: Hinnerk muss ausweichen. Hinnerk sagt die richtige Fassung selbst. | 4 s: Er kommt von links. Wer weicht aus? → Er; du hältst Kurs. |
| 6:00–7:45 | Schritt 3: überholen (81, 137) | Überholer ist, wer sich aus mehr als zweiundzwanzigeinhalb Grad achterlicher als querab nähert, also aus dem Bereich, in dem man nachts nur das Hecklicht sieht. Der Überholer weicht immer aus, auch als Segler gegenüber dem Motorboot. **Bild:** Wer das Heck sieht, hat die Arbeit. | 6 s: Du segelst und holst ein langsames Motorboot ein. Wer weicht aus? → Du. |
| 7:45–9:15 | Schritt 4: Segler, Wind von derselben Seite (126) | Hinnerk erklärt am Ruder, warum gerade der Luvseitige ausweicht. *(Seine Begründung „er kann einfach abfallen und hat mehr Spielraum“ vor dem Skript fachlich gegenlesen.)* **Streitgespräch:** Smilla stellt den anderen Fall daneben: Wind von verschiedenen Seiten, dann weicht aus, wer den Wind von Backbord hat. **Merkhilfe** (gilt bei Wind von derselben Seite): „Lee vor Luv.“ | 6 s: Beide Segler haben den Wind von Steuerbord, du bist weiter in Luv. Wer weicht aus? → Du. |
| 9:15–10:30 | Anwendung | Drei Begegnungen, jeweils kurze Szene mit Geräusch: (1) Motorboot genau entgegen, (2) Motorboot kreuzt von Backbord, du hältst Kurs (was „Kurs halten“ genau heißt, kommt in 3.4), (3) du überholst einen Segler. | je 6 s |
| 10:30–11:15 | Fallen-Check (Harms) | „Stimmt's? Bei entgegengesetzten Kursen ändern beide nach Backbord.“ (amtliche Falschantwort zu 14) / „Überholer ist, wer sich in mehr als zweiundzwanzigeinhalb Grad achterlicher als querab *befindet*.“ (zu 81: Es heißt *nähert*) / „Bei Wind von derselben Seite weicht aus, wer den Wind von Backbord hat.“ (zu 126) | je 4 s, dann knappe Berichtigung |
| 11:15–11:45 | Abschluss | Smilla: „Nenn die vier Regeln von heute.“ Pause. Klabauter: Entgegen beide Steuerbord. Kreuzen: wer ihn rechts hat, weicht aus. Überholer weicht immer. Lee vor Luv. | 8 s |
| 11:45–12:10 | An Bord, Ausblick, App | Hinnerk: früh und deutlich ausweichen, damit der andere es merkt. Neugier-Frage für 3.4: Und wenn der andere einfach nicht ausweicht? App: Fragen zur Lektion, dann eine Törn-Aufgabe. | – |

---

## Anhang B: Ablaufplan Lektion 7.4 „Naturschutz und Umwelt“ (etwa 12 Minuten)

**Fragen:** 31, 32, 33, 38, 218, 219, 225–230.
**Denkstruktur:** Drei Fragen vor jedem Schutzgebiet: Wo ist es? Was gilt dort? Wie verhalte ich mich? Die erste ist aus 7.1 bekannt (Fragen 216, 217) und wird nur abgerufen.
**Revier:** Watt. **Baustein:** Fehler-Detektiv. **Gast:** Rangerin.

| Zeit | Teil | Inhalt | Pause |
|---|---|---|---|
| 0:00–1:00 | Einstieg | Wattenmeer bei ablaufendem Wasser, Möwen, in der Ferne Seehunde auf einer Sandbank. Hinnerk will „nur mal kurz ran für ein Foto“. **Vorab-Frage:** Wie viel Abstand empfehlen die 10 goldenen Regeln zu Seehunden? | 4 s, ohne Auflösung |
| 1:00–1:40 | Rückblick | Wo findest du die Grenzen der Schutzgebiete? (7.1) Was ist Niedrigwasser? (7.3) | je 4 s |
| 1:40–2:00 | Landkarte | die drei Fragen vor jedem Schutzgebiet | – |
| 2:00–4:30 | Schritt 1: Warum überhaupt (33, 218) | **Gast Rangerin:** Ein Seehund, der flüchtet, verliert Kraft. Bei Jungtieren kann das die Trennung von der Mutter bedeuten *(mit Fachquelle belegen)*. Schilf und dichte Ufer sind Brut- und Rastplätze und Fischlaichplätze. Katalogsätze zu 33 und 218 im Gespräch. | 4 s: Warum soll man Schilfzonen meiden? |
| 4:30–6:15 | Schritt 2: Wie verhalte ich mich (31, 32, 219, 230) | Die 10 goldenen Regeln als „Hausordnung der Natur“. Daraus wird geprüft: 300 bis 500 Meter Abstand, im Kopf drei bis fünf Fußballfelder. Müll und Öl an Bord sammeln und an Land entsorgen. **Merkhilfe** (gilt für Seehundbänke und Vogelansammlungen): Klabauter: „Drei bis fünf Felder! Felder!“ Auflösung der Vorab-Frage. | 6 s: Du siehst eine Vogelansammlung. Wie weit bleibst du weg? |
| 6:15–8:30 | Schritt 3: Was gilt dort (225–229) | Befahrensregelungen beachten. Was darin stehen kann: Verbote, Beschränkungen, Tempolimits, Sonderregeln für Wasserski, Wassermotorrad und Surfen. Erlaubniszone: bestimmte Wassersportgeräte. Schnellfahrkorridore: nur für gewerblichen Verkehr. In Nationalparken im Bereich der Nordsee-Befahrensverordnung höchstens 12 Knoten über Grund, soweit nichts anderes bestimmt ist. **Merkhilfe:** „Im Park ein Dutzend, über Grund.“ | 6 s: Du willst im Nationalpark schneller fahren und siehst einen Schnellfahrkorridor. Darfst du? → Nein. |
| 8:30–9:30 | Baustein: Fehler-Detektiv | Hinnerk erzählt seinen letzten Wattentörn mit drei Fehlern: zu nah an der Sandbank, Ölreste über Bord, 15 Knoten im Nationalpark. Der Hörer zählt mit. | 6 s |
| 9:30–10:15 | Schritt 4: Antifouling (38) | Wer sein Unterwasserschiff streicht, holt sich Rat beim Umweltbundesamt. Eselsbrücke: Umwelt beim Umweltbundesamt, Karten beim BSH. | 4 s: Wo findest du Infos zu umweltfreundlichem Antifouling? |
| 10:15–11:00 | Fallen-Check (Quirin) | „Stimmt's? Seehundbänke sind gesperrte Wasserflächen.“ (amtliche Falschantwort zu 218: Es geht darum, die Tiere nicht zu stören) / „Im Nationalpark gelten 12 Knoten Fahrt durchs Wasser.“ (zu 229: über Grund) / „Schnellfahrkorridore sind Wasserflächen für bestimmte Sportbootverkehre.“ (zu 228: für den gewerblichen Verkehr) | je 4 s |
| 11:00–12:00 | Abschluss | Der Hörer nennt die drei Fragen vor jedem Schutzgebiet, Klabauter bestätigt. Hinnerk: „Und das Foto? Mit Zoom.“ App: Fragen zur Lektion, Seekarte in der Navigationsschule. | 8 s |

---

## Anhang C: Skriptform der Lektionen

Lektionsskripte liegen in `podcast/lektionen/` (Vorlage: `podcast/lektionen/VORLAGE.md`). Sie haben einen Kopf mit `lektion: 3.2`. Jede Zeile ist entweder eine Sprecherzeile (`SMILLA: …`) oder ein Regiecode.

| Code | Bedeutung |
|---|---|
| `[[SCHRITT: Titel]]` | Teil der Lektion = Kapitelmarke; beginnt eine neue Szene |
| `[[SZENE: Ort, Lage]]` | neue Szene |
| `[[REVIER: frei \| fahrwasser \| vtg \| nok \| hafen \| watt \| schleuse \| an Land]]` | Pflicht in jeder Szene |
| `[[BAUSTEIN: garn \| stichprobe \| detektiv \| tonlabor \| gast \| streit \| kopfkino]]` | der Baustein laut Kursplan |
| `[[VORAB: sbf:15]]` | Vorab-Frage im Einstieg |
| `[[RUECKBLICK: sbf:125]]` | Abruf einer früheren Frage |
| `[[KATALOG: sbf:14]]` | Der nächste Satz enthält die amtliche richtige Antwort. |
| `[[FALLE: sbf:14]]` | Der nächste Satz zitiert eine amtliche Falschantwort. |
| `[[IRRTUM: sbf:15]]` … `[[BERICHTIGUNG: sbf:15]]` | Irrtum und Berichtigung, höchstens 20 Sekunden auseinander |
| `[[DENKPAUSE: 4 \| 6 \| 8]]` | Stille in Sekunden, mit Signalton |
| `[[MERKHILFE: gilt beim Kreuzen]]` | Merkhilfe mit Geltungsbereich, höchstens drei |
| `[[BILD: sbf:91]]` | Bildmoment: Die App zeigt das Katalogbild. |
| `[[SIGNAL: ● ▬ ●]]` | Signal, im Code erzeugt; die App zeigt die Zeichen. |

Dazu gelten die bisherigen Codes der Bible §14: `INTENTION`, `PAUSE`, `TEMPO`, `PRON`, `AUDIO`, `FRAGE`.
