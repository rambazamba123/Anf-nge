# Skipper: der große Überblick (03.11.2026, v5.20)

> **Wozu diese Datei:** Hier steht an einer Stelle, wie Skipper heute gedacht und gebaut ist, was fertig ist und was als Nächstes kommt.
> **Weitere Dateien:** Einzelheiten stehen in `docs/gesamtplan.md` (alle Tage und Fragen), `docs/dialog-regeln.md` (wie die Crew redet), `docs/folge-01-entwurf.md` (Folge 1) und `CLAUDE.md` (Regeln, Code, Entscheidungen).

## 1. In einem Satz
Du heuerst auf der „Frieda“ an. Die Crew bildet dich Folge für Folge aus, bis du Smillas Platz übernehmen kannst und reif für die Prüfung bist. Das geht als richtiger Törn von Hafen zu Hafen.

## 2. Wie man die App benutzt
1. **App-Start:** Das Kennenlernen ist ein Gespräch mit der Crew. Gefragt werden Schein, Termin, Lernzeit, Lernort, Übungsset und Erfahrung. Die Folgen fragen das nicht noch einmal.
2. **Kajüte:**
   - Hier hängt alles, was man braucht.
   - Der **Hocker** startet die Folgen.
   - Die Seekarte, das Knotenbrett und das Manöverbrett sind zum freien Üben da.
3. **Frei üben:** Fragen, Navigation, Knoten, Manöver, Prüfungen. Das geht jederzeit, auch nach der Reise zum trockenen Pauken.
4. **Smillas letzter Tag** ist eine Woche vor deinem Prüfungstermin. Wer schneller lernt, ist früher fertig. Das ist gewollt.

## 3. Eine Folge (Bauplan)
- **Länge:** etwa 30 Minuten in 2–3 Teilen mit Haltepunkten. „Später weiter“ merkt sich die genaue Stelle.
- **Ablauf:**
  1. Hören: Die Crew erklärt, bevor es drauf ankommt, auch schon in einer früheren Folge.
  2. Handeln: Du tust es selbst, in 3D.
  3. Rückmeldung: Die Crew lobt oder berichtigt sofort.
  4. Abends kommen die amtlichen Fragen dazu.
- **Gespräche** mit Antwortknöpfen. Jede Antwort hat ihre eigene Reaktion (E21).
- **Scheinwahlen:** etwa zwei je Folge. Der Weg steht fest, bei der „falschen“ Wahl bringt die Crew eine glaubwürdige Ausrede.
- **Hinnerks Bauchregeln:** Sie bleiben nie stehen. Smilla berichtigt, es passiert ein kleiner Unfall, oder du entscheidest selbst.
- **Aufgaben erklärt die Crew vorher klar.** Solange du selbst steuerst oder etwas antippst, steht oben, was zu tun ist (🎯).
- **Keine Uhr entscheidet für dich.** Ausnahme ist die Probeprüfung.
- **Freigaben** („Was ich an Bord darf“): geübt → zweimal hintereinander richtig → freigegeben.
- **Logbuch** am Ende jeder Folge.
- **Hörmodus (🎧):** Die Crew macht die Handgriffe vor und löst die Fragen nach sechs Sekunden Denkpause auf.

## 3b. Lebendige Crew (v5.21)
Der Crew-Regisseur (`crew.js`, `docs/crew-regisseur.md`) lässt die Crew an ruhigen Stellen von selbst reden oder schweigen und erinnert sich an Erlebtes aus früheren Folgen. Alles bleibt vorgeschrieben und eingesprochen, ohne Live-KI.

## 4. 2D und 3D (Entscheidung E22)
- **3D:**
  - Alle Fahrten und Manöver laufen in 3D.
  - Alle Aufgaben am Boot laufen am **selben 3D-Boot**: Teile antippen, Fender, Leinen, Ausrüstung.
  - Wo es hilft, ist die Ansicht fest (von oben, von der Seite, später im Schnitt), aber es bleibt dasselbe Boot.
- **2D:** Gespräche in der Kajüte. Es ist dieselbe Kajüte wie im Spiel, mit der Crew darin und Gästen als ganzen Figuren.
- **Erklär-Animationen:** zusätzlich zum Selbststudium, wenn man später etwas nachschauen will (Frei üben).
- **Gäste sind Personen:** Sie gehen in 3D über den Steg oder stehen in der Kajüte.

## 5. Das 3D-Revier
**Heute gebaut (v5.20, Grafik bewusst schlicht):**
- **Kuttershaven (Heimathafen):**
  - Molen, zwei Stege, Lieger, Häuser.
  - Das gelbe Arbeitsboot der Hafenmeisterin liegt direkt vor unserem Liegeplatz.
  - Unser Platz hat zwei Liegeplätze.
- **Draußen vor Kuttershaven:**
  - Fahrwasser mit drei Tonnenpaaren und die Ansteuerungstonne.
  - Die Insel mit Leuchtturm, die Sandbank mit Seehund und die Nordtonne.
- **Tonnenkette nach Norden:** vier Paare rot/grün. Einlaufend liegt Rot an Backbord.
- **Hindernisse unterwegs:**
  - Ein Wrack mit **allen vier Kardinaltonnen** (Nord, Ost, Süd, West).
  - Eine **Einzelgefahrenstelle** (schwarz-rot mit zwei Bällen).
  - **Gelbe Sonderzeichen** am Sperrgebiet.
- **Klüverhafen (Nachbarhafen):** Molen mit roten und grünen Molenköpfen, Steg mit Liegeplatz, Lieger, Häuser.

**Geplant, jeweils für die Kapitel, die es brauchen:**

| Ort | Wofür | Kapitel |
|---|---|---|
| Ruderboot im Vorhafen, Jaspers Boje | Ruderboot-Mission | 0 (Tag 2) |
| Hafenbecken mit Übungsboxen | Rückwärts in die Box, Radeffekt | 1 |
| Elbe mit Großschifffahrt | Frachter im engen Fahrwasser, Überholen | 2 |
| Schleuse und Nord-Ostsee-Kanal | Schleusen, Kanalregeln | 3 |
| Watt mit Prielen und Pricken | Trockenfallen, Gezeiten | 4 |
| Ankerbucht | Ankern, Ankerverbote | 4 |
| Nacht und Nebel (Wetter vorhanden) | Lichter lesen, Schallsignale | 5 |
| Helgoland mit Seegatt | Fahrt über See | 6 |
| Schweres Wetter (vorhanden, verbessern) | Reffen, Mensch über Bord, Notfall | 7 |

**Grafik:** Die Orte werden später nach deinen grafischen Vorgaben schön gemacht. Bis dahin reicht es, wenn alles da ist und funktioniert.

## 6. Folgen, die es zum Spielen gibt (Kajüte → Hocker)

| Folge | Inhalt | Abendfragen |
|---|---|---|
| 1 Mooooin, Landratte! | Zettel am Steg, Crew, Rundgang am 3D-Boot (antippen), Vorleine ohne Uhr, Treiben und Rums am Arbeitsboot, Fender-Aufgabe, Freigaben, Hafenmeisterin, Bauchregel „in Fahrt“ | 1–3 |
| 3 Von Bug bis Heck | Schietwetter: Gas in der Kajüte erklärt, Gaskasten, Feuerlöscher, Rettungsring und Westen am 3D-Boot, Hinnerks alte Weste, Klampe belegen mit dem Übungsset | 62–69 |
| 7 Raus bis zur Ansteuerungstonne | Möwen gegen Barometer, Hafenmeisterin, Motor selbst, Fahrwasser selbst, Ausweichen nach Steuerbord, Schilf, Anlegen selbst | 14, 15, 31–33, 38, 58, 71 |
| 11 Nach Klüverhafen | Kartentisch mit Seekarte 7, Kardinaltonnen erklärt, Tonnenkette selbst, Wrack westlich umfahren, Sperrgebiet als Scheinwahl, fremder Hafen, Jasper | 156, 157, 200–203, 208 |
| 15 Zurück nach Kuttershaven | Ankerverbot mit Jasper, Webeleinstek, selbst ablegen, langer Ton in der Ausfahrt, Gefahrsignal gehört, Heimfahrt, Anlegen am anderen Steg | 161–164, 171, 172 |

**Regel für die Fragen (deine Frage nach dem Vorwissen):**
- Amtliche Fragen kommen erst abends.
- Vorher muss das Thema in derselben oder einer früheren Folge erklärt oder erlebt worden sein.
- Während der Fahrt gibt es keine Katalogfragen, sondern Handlungen: Wohin weichst du aus? Wo fährst du am Wrack vorbei?
- In Folge 7 waren die Fragen 14, 15 und 33 vorher nicht erklärt. Jetzt erklärt die Crew sie vorher, du handelst, und abends kommen die Fragen.
- Das prüfe ich künftig für jede Folge. Ein Prüfwerkzeug dafür kommt mit den nächsten Folgen.

## 7. Bausteine für Folgen (für Drehbuch und Code)
- **Sprechen und Gespräch:**
  - Satz `{wer, t}`
  - Gespräch und Scheinwahl `{wahl: {t, opts: [{t, dann}]}}`
  - Entscheidung mit richtig/falsch `{wahl: {opts: [{ok, info}]}}`
- **Orte und Bilder:** Szene `kajuete`/`welt`, Kamera (fest oder eigener Blickwinkel), Wetter, Ort.
- **Am Boot:** Teile antippen `punkte`, Treiben `treibe`, Anholen `fest`.
- **Fahren:**
  - Hinnerk fährt `auto` (auch im Zeitraffer).
  - Selbst steuern `selbst: 'ziel' | 'anlegen' | 'motor' | 'horn'`, immer mit sichtbarer Aufgabe und „Hinnerk übernimmt“.
- **Lernen:**
  - Amtliche Frage `frage`.
  - Seekarte am Kartentisch `navi` (Aufgaben aus `data/navi7.json`).
  - Knoten `knoten` und Übungsset `modell`.
- **Ablauf und Rahmen:**
  - Freigabe `freigabe` und Liste `freigaben`.
  - Gast `gast`, Signal `ton`, Zettel `zettel`.
  - Haltepunkt `halt`, Logbuch `logbuch`, Ende.

## 8. Was noch fehlt (Reihenfolge nach meinem Vorschlag)
1. **Deine grafischen Vorgaben,** dann Boot, Häfen und Figuren in 3D schön machen.
2. **Fehlende Orte** nach Tabelle 5, jeweils mit der ersten Folge, die sie braucht.
3. **Steuerbare Begegnungen:** Ein anderes Boot fährt wirklich auf dich zu, und du weichst mit der Pinne aus. Heute ist das noch eine Wahl.
4. **Prüfwerkzeug für Folgen:** Jede Frage kommt vor, Vorwissen ist vorhanden, Antworten sind geprüft.
5. **Beispiel-Bibliothek für die Dialoge,** dann alle Folgen in diesem Ton schreiben (`docs/dialog-regeln.md`).
6. **Stimmen:** Gäste (Hafenmeisterin, Jasper) und Vertonung mit ElevenLabs.
7. **Später:** Kenner-Test (optional), Modus Karte 49, Schnellspur.

## 9. Aufgaben für dich
- **Zettel gestalten lassen** (Folge 1, mit einer Bild-KI). Vorschlag für die Anfrage:
  > Ein handgeschriebener Zettel aus leicht vergilbtem Papier, mit einer rostigen Reißzwecke an einen verwitterten Holzpfahl am Hafensteg geheftet. Im Hintergrund unscharf Wasser und ein kleines Motorboot. Warmer, flacher, gezeichneter Stil wie ein Kinderbuch für Erwachsene, Hochformat 3:4. Auf dem Zettel steht in krakeliger Handschrift: „Crew gesucht. Ausbildung inklusive. Melden an Bord der Frieda, Steg 3. Nicht klopfen. Rufen.“
  - **Hinweis:** Bild-KIs schreiben Text oft fehlerhaft. Dann lass den Zettel lieber leer erzeugen; die App schreibt den Text selbst darauf.
  - Das Bild als PNG in den Ordner `import` hochladen.
- **Dialog-Regeln prüfen:** `docs/dialog-regeln.md`, vor allem Abschnitt 2 (Regeln) und 2b (neue Recherche).
- **Jaspers Stimme aussuchen:** Einstellungen → Werkstatt → 🎭 Stimmen-Casting → Rolle „Jasper (Bojenlieger)“.
- **Die fünf Folgen am Handy spielen** und sagen, was hakt.
