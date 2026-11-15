# Navi-Folge und neue Navigationsschule: Plan (15.11.2026, Entwurf)

> Auftrag des Nutzers (14./15.11.2026): Für die Navigation eine **interaktive Folge** am Kartentisch. Die Crew ist aktiv dabei wie eine kleine Folge, erklärt und begleitet; es soll sich wie eine Geschichte anfühlen, mit Fragen und eigenen Aufgaben. Die Navigationsschule wird grundsätzlich umgebaut: Im Vordergrund steht die Folge, das ausführliche Lexikon (jede Aufgabe, jedes Thema) bleibt, wird aber übersichtlicher.
> Grafik-Entwürfe zum Ansehen: Artifact „Navi-Folge am Kartentisch“ (Szenen A/B/C, Kartenstile K1–K4, Menü M1/M2). In der App ist noch nichts gebaut.

## 1. Was beschlossen ist (Antworten vom 15.11.)
| Nr. | Beschluss |
|---|---|
| NF1 | Die Navi-Folge ist beides: Teil der Abendwache und Einstieg in jede Stufe der Navigationsschule (dieselbe Szene). |
| NF2 | Blick von oben auf den Kartentisch, die Hände der Crew führen Dreieck und Zirkel. **Ohne Sprechblasen**; Sprechblasen-Modus einschaltbar, dann springt ein Tipp zum nächsten Satz (Tempo selbst bestimmen). |
| NF3 | Feste Geschichtsaufgabe voll vertont (a) und Übungsrunden mit wechselnden Zahlen aus Zahl-Bausteinen (b). Namen der Tonnen, Orte und Zahlen sind **Platzhalter**, damit sie sich ändern lassen, wenn sich die Karte ändert. |
| NF4 | Wählbar am Start (Kippschalter wie beim Kajütenfunk): **in der App** oder **am Tisch mit Papierkarte**. Vorschlag siehe §4. |
| NF5 | Antworten mit Zahlentasten. |
| NF7 | Fehler werden gezeigt: Die Frieda fährt den falschen Kurs, läuft auf, **etwas an Bord geht kaputt** (Propeller, Ruderblatt, Fender …). Die Idee gibt es schon in Törn 2.0 (`data/toerns.json` `schaden`, `reparatur`, Ausrüstung `teile`, `toern.js` `folgen`); der Törn fällt weg (SK14), der Gedanke wandert hierher. |
| NF8 | **Adaptiv:** Wer schnell lernt, kommt schnell voran; wer langsam lernt, bekommt viel Hilfe der Crew. Höchstens drei Aufgaben je Folge (eine vorgemacht, eine mit Hilfe, eine allein), mehr nur als freiwillige Extrarunde. |
| NF9 | In den Navi-Folgen die **klassische Crew**: Smilla führt, Klabauter wiederholt Merkwörter, Hinnerk ist selten dabei (er schaut nur morgens auf die Karte). |
| NF10 | Erste Test-Folge: **Kurs und Distanz messen**. |
| NF12 | **Neue kleine Übungskarte** mit wenigen, großen Seezeichen, Nord- oder Ostsee-Landschaft, spannend zu befahren, verschiedene Gebiete. Entwurf „Brede-Bucht“ im Artifact, vier Stile. |
| NF13 | Mindestens **zwei Routen** auf der Karte (sicher außen herum, Abkürzung durch den Priel). |
| NF14 | Am Tisch sagt die Crew „Nimm dein Kursdreieck“. In der App sagt sie es auch, und das Werkzeug **blinkt** in der Werkzeugleiste. |
| N1 | Die Lückenaufgabe ist kein eigener Schritt; sie steckt in der adaptiven Hilfe (NF8). |
| N2 | „Gemischt wiederholen“ mit **drei** Aufgaben. |

## 2. Neue Idee: Hinnerks Geheimnis (Vorschlag, braucht dein Ja)
- **Deine Idee:** Hinnerk schaut nur morgens auf die Karte, steuert dann und kommt immer richtig an, sogar nachts. Die Crew staunt. Sehr spät verrät er sein Geheimnis: Er navigiert heimlich mit einem Handy oder einem anderen Gerät. Nicht zu präsent.
- **Widerspruch zum Bestand:** Beschlossen ist schon „Hinnerk sieht nachts schlecht“ (E20) und „vor Dunkelheit ankern, immer“ als erste Spur seines Geheimnisses (Reiseplan Tag 1, Figurenkarte F4).
- **Mein Vorschlag, beides zusammen:** Hinnerk sieht nachts schlecht. Gerade darum hat er ein altes Kartenplotter-Handy in der Ölzeugtasche. Mit dem kommt er immer an, auch in der einzigen Nacht, in der er doch fahren muss. Die Spuren sind klein: ein Piepen in der Tasche, „Batterie“, er geht zum Pinkeln nach vorn, wenn es knifflig wird.
  - Die Auflösung kommt an Tag 6 oder 7, wenn du selbst sicher navigierst. Dann darf auch die Lehre kommen: „Das Ding kann ausfallen. Darum lernst du's auf Papier.“
  - So passt es zur Prüfung und zur Seemannschaft: Elektronik ist eine Hilfe, kein Ersatz.

## 3. Wie die Navi-Geschichte aussehen kann (Vorschläge, du wählst)
| Nr. | Idee | So läuft es | Stärke | Schwäche |
|---|---|---|---|---|
| **S1** | **Der Abend vor der Etappe** (ganz in der Hauptgeschichte) | Jede Navi-Folge ist ein Abend der Reise: Smilla zeigt dir, wie man die Etappe von morgen plant. Am nächsten Morgen fährt die Crew deinen Kurs (V3). | Zeitlich passt alles, ein einziger Faden. | Schnelle Lernende müssen auf die Reise warten (dafür freiwillige Extrarunden). |
| **S2** | **Die Umwege** (in der Hauptgeschichte, aber eigenständig hörbar) | Die Navi-Folgen sind die Tage, an denen etwas schiefgeht: falsch abgebogen, ein Ersatzteil aus Klüverhafen holen, Hochwasser abwarten (HR48). Genau dann muss navigiert werden. | Viel Handlung, „falsch abbiegen“ ist Teil der Geschichte. | Umwege sind laut HR48 höchstens einer je Tag. |
| **S3** | **Hinnerks Geheimnis** (Rätsel-Faden durch alle Navi-Folgen) | Hinnerk kommt immer an, keiner weiß wie. Smilla und du wollt es ohne ihn schaffen und vergleicht eure Kurse mit seinen. Jede Folge eine kleine Spur, ganz am Ende die Auflösung (§2). | Starker Grund, selbst zu lernen; leicht dosierbar. | Braucht dein Ja zu §2. |
| **S4** | **Die Wettfahrt** (zwei Routen) | Smilla nimmt mit dem Dingi oder einem geliehenen Boot Route B, die Frieda Route A; du navigierst und rechnest, wer zuerst da ist. | Nutzt beide Routen, Spannung. | Teilt die Crew, mehr Grafik und Technik. |
| **S5** | **Opas Logbuch** (eigene kleine Geschichte, gleiche Crew) | Smilla findet das alte Logbuch ihres Großvaters mit Kursen und Peilungen; jede Folge entschlüsselt einen Wegpunkt, am Ende liegt am Wrack eine Überraschung. | Abgeschlossen, unabhängig vom Reisetempo, passt zur Piratenkarte. | Zweiter Handlungsstrang neben der Reise. |

**Meine Empfehlung:** S1 als Rückgrat, S3 als leiser Faden darüber, S2 für die ein bis zwei Tage mit Umweg. Alles bleibt eine Geschichte und läuft zeitlich mit der Hörreise mit. S5 nur, wenn du lieber eine abgeschlossene Navi-Geschichte willst, die man unabhängig von der Reise lernt.

## 4. Papierkarte oder App: Kippschalter und Erklärungen (NF4)
- **Mein Vorschlag:** Kippschalter am Start, Standard „in der App“; umschaltbar auch mitten in der Folge.
- **Was gleich bleibt:** das Was und Warum (welche Linie, welcher Meridian, warum der Breitenrand), die Aufgabe und die Zahl, die du eintippst.
- **Was sich unterscheidet:** nur ein bis drei Sätze je Schritt zur Handhabung, zum Beispiel beim Zirkel:
  - App: „Zieh die Spitzen auf Anfang und Ende, dann schieb ihn an den Rand.“
  - Papier: „Spitzen auf die beiden Tonnen, den Zirkel nicht mehr verstellen, ab an den Rand.“
  - Wie bei der Anrede werden beide Fassungen vertont, die App spielt die passende.
- **Am Tisch** zeigt die App die Karte trotzdem (zum Vergleichen) und prüft nur deine Zahl.

## 5. Adaptiv, ohne dass die Geschichte stockt (NF8)
- **Hilfe in drei Stufen** je Fertigkeit, wie im Entwurf: viel (Linie und Dreieck liegen schon, du liest nur ab), mittel (die Linie liegt), keine.
- **Die Stufe wählt die App selbst:** Wer zwei richtig hat, bekommt weniger Hilfe. Wer zweimal falsch liegt, bekommt mehr, und Smilla macht es noch einmal langsamer vor. Gemerkt wird je Fertigkeit (wie die Lückenaufgabe, `fade`).
- **Schnelle Lernende:** „Kannst du schon? Dann zeig mal.“ Eine Aufgabe ohne Hilfe; wenn sie sitzt, entfällt das Vormachen.
- **Langsame Lernende:** Extrarunde am Tisch mit der Crew. Nie gesperrt; wer nicht weiterkommt, dem rechnet Smilla es vor, und die Geschichte geht weiter.

## 6. Harms und die Navigation (N3, Möglichkeiten)
| Nr. | Möglichkeit | Wie es klingt |
|---|---|---|
| H-a | Harms stellt in der Fragerunde am Ende der Hörreise **eine Rechenfrage** (Zahlentasten). | „Rechtweisender Kurs zwei-sieben-null, Missweisung vier Ost, Ablenkung minus zwei. Kompasskurs?“ |
| H-b | Am Ende jeder Stufe der Navigationsschule eine **kleine Prüfung von Harms** am Telefon, drei Aufgaben ohne Hilfe. | „So. Drei Aufgaben. Keine Smilla.“ |
| H-c | Ab Tag 4 ruft Harms abends an und fragt nach **deinem Kurs von gestern** (V7). | „Welchen Kurs hast du gestern gerechnet? Und warum?“ |
| H-d | An Tag 7 an Bord der Albertine die **ganze Navigationsaufgabe** wie in der Prüfung (neun Teile, 25 Minuten). | Prüfungsmodus der Schule, mit Harms als Prüfer. |
- **Empfehlung:** H-b und H-d sicher, H-a ab Tag 4 einmal je Fragerunde, H-c gelegentlich.

## 7. Aufgaben, geordnet nach dem, was wovon abhängt
**Stufe 0: Entscheidungen von dir** (ohne sie lohnt kein Bau)
- Szene A, B oder C; Kartenstil K1 bis K4; Menü M1 oder M2.
- Geschichte S1 bis S5; Hinnerks Geheimnis (§2).
- T1 bis T12 aus `docs/folgen-tag1-neu.md`.

**Stufe 1: Grundlagen** (alles Weitere baut darauf)
1. **Neue Karte als Daten:** Brede-Bucht mit Koordinaten aller Objekte in `data/karte-brede.json` und eine Zeichenfunktion im gewählten Stil. Die Navigationsschule rechnet daraus (wie heute mit `data/karte.json`). Später ersetzt deine Piratenkarte die Zeichnung, die Daten bleiben.
2. **Drehbuch-Format** für Navi-Folgen (`data/navi-folgen.json`): Schritte `sag` (mit Fassungen App und Papier), `zeige` (Ausschnitt der Karte), `vormachen` (Werkzeug-Bewegung), `aufgabe` (Fertigkeit mit Hilfe-Stufe), `frage`, `fehlerfahrt`, `schaden`, `merke`; Platzhalter `{tonne}`, `{kurs}`, `{distanz}`.
3. **Zahl-Bausteine** für Stimmen (null bis neun, „Komma“, „Grad“, „Seemeilen“) je Sprecher; ohne Stimme liest die Gratis-Stimme.

**Stufe 2: Bauteile**
4. **Kartentisch-Bühne** (eigene Datei, z. B. `navifolge.js`): Tisch, Hände, Werkzeug-Animationen, Gesichter ohne Sprechblasen, Sprechblasen-Modus mit Tippen, Start mit Kippschalter, Zoom auf den Ausschnitt.
5. **Adaptive Hilfe** je Fertigkeit (§5) und Werkzeug-Blinken (NF14).
6. **Fehlerfahrt mit Schaden:** Boot fährt den falschen Kurs, läuft auf, ein Teil geht kaputt (Liste in den Daten).
7. **Navigationsschule auf die neue Karte:** Aufgabengeneratoren lesen die Brede-Bucht; die alte Kliev-Karte bleibt als Archiv.

**Stufe 3: Inhalte und Oberfläche**
8. **Navi-Folge 1** „Kurs und Distanz“ schreiben (nach S…), mit Logik-Prüfung.
9. **Menü und Lexikon neu** (M1 oder M2), die Folge oben.
10. **Harms-Prüfungen** nach §6.

**Parallel, unabhängig davon**
11. Folge 0 und 1-1 bis 1-3 neu (nach T1–T12).

**Stufe 4: Verbinden**
12. Abendwache Tag 1 im Reiseplan (`abend`), Morgenreaktion der Crew (V3), Kurslinie auf der Reisekarte.
13. Vertonen (Credits nach T5).
