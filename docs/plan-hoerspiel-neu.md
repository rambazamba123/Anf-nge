# Plan „Hörspiel neu denken“ (16.11.2026)

> Anlass (Nutzer, 16.11.2026): Rückmeldung von Testhörern, die Hörreise sei „etwas unübersichtlich“ und gehe „manchmal zu schnell“. Gewünscht: natürlichere Gespräche, entschleunigt. Dieses Dokument hält Befund, Entscheidungen und Etappen fest. **Nach einem Abbruch hier weiterlesen** (Abschnitt 5 zeigt den Stand).

## 1. Befund in Kürze
- **Dichte:** Folge 1-3 brachte 12 Prüfungsfragen in knapp 7 Minuten Geschichte (alle 34 Sekunden ein neuer Fakt), 15 Animations-Einsätze, danach 12 Harms-Fragen am Stück. Tag 1 hatte 55 neue Fragen.
- **Regeln belohnten Verdichten:** Längenfenster als Deckel (HR46), „keine Pausen, um Laufzeit zu füllen“ (Bible A4). Keine Regel schützte Luft.
- **Vortrag statt Gespräch:** Smilla sprach in 1-1 und 1-3 rund 70 % der Wörter, oft als Aufzählung („Vier Sachen. Erstens …“).
- **Schlechtes Vorbild:** Die alte `VORLAGE.md` zeigte eine Kajütenfunk-Szene mit Katalogtext im Dialog. Die Beispiel-Bibliothek (`docs/dialog-regeln.md` §2b) gab es nie.
- **Regelberg:** rund 750 KB Vorgaben in 20 Dateien, teils widersprüchlich. Wer schreibt, bedient Regeln statt das Ohr.
- **App:** kein Halt im Player (keine Kapitel, 0,2 Sekunden zwischen Szenen), „Frei üben“ mit 20 Einträgen, drei Karten nebeneinander.

## 2. Entscheidungen des Nutzers (16.11.2026)
| Nr. | Entscheidung |
|---|---|
| GL1 | **Keine starren Zahlen.** Manche Fragen gehen gut als Bündel, manche brauchen Zeit für sich. Es gibt Richtwerte, aber die Zeit wird nicht starr verteilt → „Lernlast“ in Abschnitt 3.1. |
| GL2 | **Der Podcast wird neu gedacht.** Mehr Folgen, mehr Tage, auch eine komplett andere Aufteilung sind recht. Grundstruktur und Mechaniken bleiben. Richtgröße: je Tag etwa 40 Minuten, vielleicht nur 20. Erst gut überlegen, dann testen und anpassen → Abschnitt 3.2. |
| GL3 | **Harms fragt zurück:** nicht den Stoff der eben gehörten Folge, sondern Fragen früherer Folgen. Er wird flexibel und angepasst eingesetzt → Abschnitt 3.3. |
| GL4 | Natürliche Entweder-oder-Fragen („Backbord oder Steuerbord?“ ohne Alfa und Bravo): gute Idee, **erst testen**. |
| GL5 | **Kein festes Regelwerk für Redeanteile.** Hauptredeanteil haben Smilla, Hinnerk und die Gäste; Klabauter ist Nebenfigur, Backbord miaut manchmal. Je nach Folge anders. Leitbild: **Wir machen ein Hörspiel.** |
| GL6 | **Eine Karte:** die Brede-Bucht (wird noch überarbeitet). Kliev-Karte und Seekarte 7 wandern aus dem Vordergrund. |
| GL7 | `CLAUDE.md` und andere Doppelungen verschlanken. Lücken füllt der Nutzer auf Nachfrage. |
| GL8 | **Folge 0 fällt weg.** Start mit den Etappen 1, 2 und 3. |

## 3. Das neue Konzept (Entwurf zum Testen)
### 3.1 Lernlast statt Stoppuhr (GL1)
Jede Prüfungsfrage hat ein Gewicht. Das Gewicht bestimmt, wie viel Raum sie in der Geschichte bekommt, nicht eine feste Minutenzahl.
| Gewicht | Was das ist | Raum in der Geschichte |
|---|---|---|
| **Szene** | Schwerpunkt-Frage (im Kursplan `schwerpunkt`), Regel mit typischer Falle, alles, was man an Bord wirklich tut | eine eigene Szene: Anlass, Frage, Auflösung, danach Luft |
| **Bündel** | Fragen, die ein gemeinsames Prinzip trägt (System-Blöcke: Tafeln, Lichter, Motor) | das Prinzip einmal gründlich, jede weitere Frage ein kurzer Anwendungsfall |
| **Nebenbei** | Nachschlagewissen, Unterschied zur Nachbarfrage | ein Satz in der Handlung, sonst nur bei Harms |
- **Leitfrage statt Grenze:** Kann jemand, der im Auto zuhört, nach der Szene in einem Satz sagen, was neu war? Wenn nein, ist die Szene zu voll.
- **Nach jeder Szene mit Gewicht „Szene“ kommt Luft:** Handlung, Frotzeln, Geräusch, ein Blick aufs Wasser. Kein neuer Stoff.
- **Der Dichte-Messer** (`tools/dichte-messer.js`) zeigt je Folge Last, Redeanteile, lange Monologe, Aufzählungen und Animationen als Hinweis. Er bricht nie ab. Wer abweicht, schreibt den Grund ins Folgenblatt („Bündel Radeffekt: sechs Fragen, ein Prinzip“).

### 3.2 Hörtag statt Reisetag (GL2)
- **Ein Hörtag ist eine Sitzung von 20 bis 40 Minuten:** zwei bis drei Folgen (je etwa 6 bis 12 Minuten, eine Folge = ein Thema), dazu einmal Harms, der zurückfragt. Die Abendwache (Navi-Folge, Knoten) kommt obendrauf und braucht die Hände.
- **Die Reise wird länger als sieben Tage.** Wie viele Tage es werden, ergibt sich aus der Lernlast (Schätzung: 18 bis 22 Hörtage). Die Frist in Harms' Sprachnachricht (1-1) wird dann angepasst.
- **Reihenfolge:** Erst wird die neue Machart an zwei Gold-Folgen getestet (Etappe 2). Erst wenn sie gefällt, wird der ganze Reiseplan neu verteilt (Etappe 5). Bis dahin bleibt `data/reiseplan.json` unverändert.

### 3.3 Harms fragt zurück (GL3)
- Frischer Stoff wird sofort nur **in der Geschichte** abgerufen (Zwischenfrage der Crew).
- **Harms prüft mit Abstand:** Er fragt Fälliges aus früheren Folgen im amtlichen Wortlaut, nie die Folge, die gerade lief. Wie viele Fragen (null bis fünf), bestimmt die Lernkartei. Am ersten Hörtag stellt er sich nur vor.
- Er kann zwischen zwei Folgen oder am Ende eines Hörtags anrufen. Die neuen Skripte haben darum keinen festen Harms-Abschnitt mehr; der Player setzt die Runde zusammen.
- Später bekommt jede Frage einen eigenen Harms-Clip (einmal vertont, überall einsetzbar). Bis dahin liest die Gratis-Stimme.

### 3.4 Hörspiel zuerst (GL5)
- Geschrieben wird in der Reihenfolge **Szene vor Stoff:** erst die Szene als Hörspiel (wer will was, was geht schief, wo ist der Witz), dann zwei, drei Fakten an die Handlung hängen.
- Regeln sind Richtschnur, kein Korsett. Die eine Seite `podcast/schreibkarte.md` gilt beim Schreiben; die HR-Regeln in `docs/reise.md` §7 bleiben Nachschlagewerk.
- Vorbild sind die Gold-Szenen in `podcast/dialog-beispiele.md`.

## 4. Etappen und wer sie macht
Der Nutzer muss kein Modell umstellen: Die Hauptsitzung (Fable 5.2) schreibt Grundlagen und Folgen und gibt Code-Arbeit an ein Opus-Untermodell ab.
| Etappe | Inhalt | Wer |
|---|---|---|
| **1 Grundlagen** | Schreibkarte, Regeln HR56–HR60, neue Vorlage, Widersprüche in `docs/reise.md` bereinigen, `CLAUDE.md` verschlanken, Navi-Schreibregeln, Dichte-Messer | Hauptsitzung (Fable 5.2) |
| **2 Gold-Folgen** | Beispiel-Bibliothek; die alte 1-3 neu als drei Folgen in neuer Machart (`podcast/skripte/gold-heck.md`, `gold-motor.md`, `gold-faehre.md`); der Nutzer hört erst mit der Gratis-Stimme, dann eine vertonte Szene | Hauptsitzung (Fable 5.2), mit dem Nutzer |
| **3 Player und Übersicht** | Atempausen, Kapitel, Rahmenkarten, Harms fragt zurück, Rückmelde-Knopf, natürliche Entweder-oder-Antwort per Zuruf (Test), Deck-Knopf „Weiter“, „Frei üben“ in sechs Kacheln, eine Karte vorn, Folge 0 raus | Opus-Untermodell, parallel |
| **4 Navi-Folge** | Wachen mit „Schritt 2 von 4“, erst tun, dann Begriff, Einstufung, Schritt-Zettel, Test am nächsten Abend, Lektionstexte nach `docs/navi-schreibregeln.md` | Opus für Code, Fable für Texte |
| **5 Reiseplan und Serie** | Reiseplan nach Lernlast und Hörtagen neu verteilen, dann die Folgen in Serie (höchstens zwei bis drei je Sitzung, jede mit Hörer-Probe durch ein zweites Modell) | Fable schreibt, zweites Modell prüft |

## 5. Stand (19.11.2026, v5.70)
- [x] Plan abgelegt (16.11.2026)
- [x] **Etappe 1 Grundlagen:** `podcast/schreibkarte.md`, Regeln HR56–HR60 (`docs/reise.md` §7.11, Hinweise an HR17/HR18/HR30/HR38/HR46 und §3), neue `podcast/folgen/VORLAGE.md` (alte im Archiv), `podcast/dialog-beispiele.md`, `docs/navi-schreibregeln.md`, `tools/dichte-messer.js`, Klarstellung Bible A4, `CLAUDE.md` verschlankt (Code-Karte und alter Status ausgelagert)
- [x] **Etappe 2 Gold-Folgen, erster Teil:** aus der alten 1-3 wurden **drei** Folgen (gold-1 „Das Heck will zu Paul“, gold-2 „Ohne Gas kein Ruder“, gold-3 „Dicke Pötte“), je vier Fragen. In der App als Folge 1-3 bis 1-5, mit der Gratis-Stimme hörbar. Offen: Hörtest des Nutzers, danach eine Szene vertonen
- [x] **Etappe 3 Player und Übersicht:** Atempausen mit drei Stufen, Kapitelpunkte und Titel, Karten „Heute an Bord“ und „Das nimmst du mit“, Ende als Blatt, „Harms fragt zurück“, Rückmeldung der Tester, Antwortwort per Zuruf, Deck-Knopf „Weiter mit der Crew“, „Frei üben“ in sechs Kacheln, Seekarte 7 unter „Alte Folgen und Tests“, alte Navigationsschule eingeklappt. Von der Hauptsitzung gebaut (die Untermodelle waren am Nutzungslimit)
- [x] **Etappe 4 Navi-Folge** (v5.68): Navi-Folge 1 mit drei Wachen, Schrittanzeige, Schritt-Zettel, Einstufung und Test am nächsten Abend; Texte nach `docs/navi-schreibregeln.md`
- [x] **Tag 1 komplett neue Machart** (v5.69): 1-1 und 1-2 umgestellt (ohne Harms-Abschnitt, natürliche Fragen, kein Vortrag, ohne Bezug auf Folge 0)
- [x] **Lektorat** (v5.70, HR61): zweiter, unabhängiger Lauf über Tag 1 (zwei Durchgänge, zusammen 13 Fehler und rund 55 Hinweise, eingearbeitet; `docs/lektorat/tag-1.md`); Animation sog als eine Vorbeifahrt, Lieger im Wasser; Handystimme ohne „Anführungszeichen“; gold-1 heißt „Leise raus“, gold-2 „Warten auf die Fähre“
- [ ] **Etappe 5 Reiseplan und Serie** (erst nach dem Hörtest). Stand der Inhalte: geschrieben sind 1-1, 1-2 und gold-1 bis gold-3 (22 der 285 Fragen). Der Reiseplan hat noch die alte Aufteilung (7 Tage, 1-1 bis 7-5; Plan-Folgen 1-4 „Rechts halten“ und 1-5 „Garn“ sind nicht geschrieben, in der App heißen gold-2 und gold-3 „1-4“ und „1-5“; „Dicke Pötte“ ist zugleich der Titel von gold-3 und von Plan-Folge 2-3). Wird beim Neuverteilen bereinigt.

### Was der Dichte-Messer zu den Gold-Folgen sagt (ehrlich)
- gold-1: 3,5 Minuten reiner Sprechtext (mit Denkpausen, Glocken, Atempausen und Animation etwa sechs), Lernlast 10. Hinweis „viel“: begründet, weil 41 und 46 dieselbe Sache sind (Radeffekt und sein Name) und 47 nur ein Satz ist. Echte Last: zwei Dinge.
- gold-3: 3,0 Minuten Sprechtext, Lernlast 8. Hinweis „viel“: 34, 36 und 37 sind ein Bündel (große Schiffe machen Wasser), 61 hat seine eigene Szene. Wenn es beim Hören trotzdem zu voll wirkt, wandert 37 in die erste Folge von Tag 2 (Frachter auf der Elv).
- Smilla spricht in gold-1 und gold-3 rund 64 % der Wörter (alte 1-3: rund 70 %), aber in kurzen Zeilen (im Schnitt zehn Wörter). Keine Quote (GL5); beim Hören prüfen, ob es nach Gespräch klingt.

## 6. Offen (braucht den Nutzer)
- **Hörtest der Gold-Folgen:** Gefällt die Machart? Erst dann Etappe 5.
- **Länge der Reise:** Sieben Tage waren beschlossen (E24). Mit Hörtagen von 20 bis 40 Minuten werden es mehr. Neuer Titel und neue Frist in 1-1 folgen aus Etappe 5.
- **GL4** nach dem Test: natürliche Entweder-oder-Fragen behalten?
- **Folge 0:** Das Kennenlernen und die Kiste standen dort. Wohin damit (App-Start oder erste Szene von 1-1)?

## 7. Film und Ebenen (Nutzer, 20.11.2026; beschlossen als GL9–GL13, E27)
> **Bestätigt** am 20.11.2026 („Du beschreibst es schon sehr gut. Setze alles so um und lass es mich testen.“): FI1 = **GL9** (2D-Film zuerst, Kamera-Marken), FI2 = **GL10** (Grundfassung fürs Auto, Denkfragen mit sechs Sekunden Stille), FI3 = **GL11** (drei Stufen und Schalter Harms), FI4 = **GL12** (Harms: „Was bisher geschah“ und Unterbrechung, nicht Erzähler der ganzen Geschichte), FI5 = **GL13** (Kiste am Rand). Erster Test: **Filmproben** `docs/entwuerfe/film-varianten.html` (auch als Leseseite veröffentlicht): eine Szene aus gold-1 auf vier Bühnen (Papiertheater mit Drehbühne und Wellenwalzen, Scherenschnitt mit Irisblende, Glasebenen mit Nebel und Kamerafahrt, Aufklappbuch mit Umblättern und Musterklammer), gleiche Kamera-Marken, Stufen und Harms schaltbar. Offen: Wahl der Bühne, dann Einbau in `kurs.js`.

### Ursprüngliche Ideen (wörtlich sortiert)
> Wörtlich gesammelt, sortiert und mit Claudes Meinung in der Antwort vom 20.11.2026. Erst nach der Bestätigung des Nutzers wird daraus eine Entscheidung (GL9 ff.), dann ändern sich Bible, Vision und Regeln (R15, R16). Kein Code dazu, bis es definiert ist.

| Nr. | Idee | Was noch zu klären ist |
|---|---|---|
| **FI1 Film statt Einzelbilder** | Die Animationen entstehen aus der Grund-Animation heraus: Man sieht unser Schiff in seinen Szenen (so wie heute auf der Bühne), dazu weitere Blickwinkel (von hinten, von oben, nah) und **Übergänge** dazwischen (z. B. Schwenk von der Seitenansicht nach hinten). Die Bilder passen wie ein Film zum Text. Lehrbilder wie „Radeffekt von oben“ werden eine Kamerafahrt nach oben statt eines eigenen Bildes. | Liste der Einstellungen (Seite, Heck, oben, nah), wie ein Schwenk in 2D aussieht (weicher Schnitt, Zoom, Kran) oder ob der Film in 3D (`welt.js`) läuft (E22), Kamera-Drehbuch je Folge, Gleichlauf mit dem Text |
| **FI2 Die Story ist fürs Auto** | Die Grundfassung ist ein Hörspiel ganz ohne Interaktion. Der Film läuft immer gleich. | Bleiben kurze Denkfragen mit Pause und Auflösung, oder gar keine Fragen in der Grundfassung? |
| **FI3 Ebenen zum Zuschalten** | Am Anfang wählt man: Harms an/aus, mitsprechen, nur hören, mit Zwischenaufgaben (Karte und Zirkel, Knotenbrett). Wer mehr wählt, wird bewusst aus der Story herausgeholt; der Film hält an. | Wo die Unterbrechungen sitzen (Kapitelenden), was davon die Lernkartei zählt, was aus den heutigen Modi (Vor Anker, In Fahrt, Mitreden) wird |
| **FI4 Harms als Erzähler?** | Harms (oder ein Erzähler) holt dich aus der Story: fragt, kommentiert, erzählt. | Erzählt Harms die ganze Geschichte oder spricht er nur in den Unterbrechungen (Bible: Harms prüft ernst, ohne Musik)? |
| **FI5 Die Kiste nur am Rand** | Die Kiste spielt nur eine Nebenrolle: Sie kommt bei der Wahl am Anfang vor (Zwischenaufgaben mit Kiste) und in der Abendwache. Die Geschichte braucht sie nicht. | Plan-Folgen mit Miniaturen (2-1 „Die Kiste“, 4-4 Mini-Anker, 5-1 Mini-Laternen, 5-7 Mini-Rettungsring) wandern in die Zwischenaufgaben |
