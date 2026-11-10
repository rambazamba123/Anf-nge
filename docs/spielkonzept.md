# Spielkonzept: Box, Reisekarte, Kajüte und Deck

Fassung 1 vom 10.11.2026, **Entwurf zur Freigabe** (R16).

**Was diese Datei ist:**
- Sie beschreibt, wie die Teile zusammenspielen: die Box auf dem Tisch, die Reisekarte auf Papier und in der App, die Hörreise und die Lernfunktionen in der Kajüte, die Spaßabteilung an Deck.
- Sie gilt zusammen mit `VISION.md` (Grundsätze, Lernforschung) und `docs/reise.md` (Geschichte, Reiseplan, Regeln der Folgen). Wo sie widerspricht, gilt nach Freigabe diese Datei.
- Claude liest sie vor jeder größeren Arbeit an App, Hörreise oder Box (R16) und baut die App so weiter, **als gäbe es die Box schon**.

**Kennzeichnung:**
- ✓ = Aussage oder Entscheidung des Nutzers (10.11.2026 oder früher, mit Datum). Gilt.
- **SK…** = Vorschlag von Claude oder offene Frage. Gilt erst nach Antwort.
- Was erst ganz am Ende geklärt wird (Recht, Lizenzen, Freischaltung, Vertrieb), steht in `docs/am-ende-klaeren.md`.

## 1. Das Spiel in einem Absatz
Du kaufst eine kleine Box. Ihre Verpackung ist ein Stück Pier mit Klampe, Poller und Ring; darin liegen ein 3D-gedrucktes Modell der Frieda, Leinen und eine kleine Seekarte. Die App ist die Crew dazu. In der Kajüte lernst du: Herzstück ist die Hörreise, eine Geschichte in sieben Tagen, in der Hinnerk, Smilla und Klabauter dich zum Bootsführerschein bringen. Daneben stehen die Lernkartei mit allen Prüfungsfragen, die Knotenkunde und die Navigationsschule; jede funktioniert für sich, jede führt die Crew Schritt für Schritt. Die Reise verläuft auf derselben Seekarte, die vor dir auf dem Tisch liegt: Du siehst ihr nicht an, wohin es geht, sondern navigierst von Ort zu Ort, erst schaut die Crew dir über die Schulter, ab dem vierten Tag machst du es allein. An jedem Ort warten Aufgaben: Knoten am Pier mit Stoppuhr, Anlegen mit der Modell-Frieda, Kurs und Distanz auf der Papierkarte, manchmal eine Übung im 3D-Fenster. An Deck ist die Spaßabteilung: Ruder antippen und mit der Frieda frei herumfahren, dort weiter, wo du zuletzt warst, Häfen erkunden, Minispiele finden, das Boot ausbauen. Wer die Hörreise durchspielt, hat alles in sinnvoller Reihenfolge gelernt.

## 2. Die Box
**✓ Inhalt und Idee (10.11.2026):**
- Die Verpackung ist bedruckt wie ein **Pier**. Klampe, Poller und Ring werden aus der Box genommen und **durch Löcher in der Box** befestigt. Mit Steinen oder Ähnlichem beschwert, ist die Box ein fester Pier.
- Darin: das **3D-gedruckte Boot** (die Frieda), **Seile und Schnüre**, Klampe, Ring, Poller, wie ein Knotenübungsbrett.
- Eine **kleine Seekarte**, DIN A4 reicht. Auf ihr übt man das Navigieren, und sie zeigt, wie weit man auf der Reise ist.
- **QR-Codes** für die Knoten: scannen, und die App zeigt die Animation.
- Ein **Code**, der nach dem Download alle Funktionen freischaltet (ganz hinten, siehe §8).
- Mit dem Modell löst man **Anlegeaufgaben** und übt die **Knoten**.

**Vorschläge:**
- **SK1 Pier-Plan.** Klampe, Poller und Ring haben auf dem Pier feste, gedruckte Plätze, und genau derselbe Pier ist in der App gezeichnet. Dann kann die Crew sagen: „Vorleine zum Poller vorn, Achterleine zur Klampe.“ Vorschlag von links nach rechts: Poller, Klampe in der Mitte, Ring rechts; dazu eine gedruckte Liegeplatz-Markierung in Bootslänge und ein Pfeil für Wind und Strom, den man drehen kann (ein Pappzeiger). Damit lassen sich Anlegeaufgaben mit Wind von vorn, von achtern und vom Steg weg stellen.
- **SK2 Fächer oder Umschläge.** `docs/reise.md` §4 sieht Fächer vor, die man erst öffnet, wenn die Geschichte es sagt („Mach mal Fach zwei auf“). Billiger als Fächer sind nummerierte Papiertütchen in der Box. Empfehlung: behalten, aber schlicht (drei bis vier Tütchen statt sechs Fächer), weil das Öffnen im richtigen Moment Spannung macht.
- **SK3 Navigationsbesteck.** Für die Karte braucht man Kursdreieck, Zirkel und Bleistift. Empfehlung: ein kleines Kursdreieck und ein einfacher Zirkel in der Box, Bleistift und Radiergummi auch; sonst nennt die Seite „Was du zum Üben brauchst“ (`uebungsListe`) die Alternativen.
- **SK4 Maßstab.** Modell, Klampe und Pier im selben Maßstab, damit Leinen und Knoten passen. Das Boot in der App ist dasselbe wie das Modell (`boot.js`, E17).

## 3. Die Reisekarte
**✓ Grundsätze (10.11.2026):**
- Die Karte in der Box ist **dieselbe wie in der App**.
- Sie ist **Fortschrittsanzeige**: In der App tippt man auf die Etappen und sieht, welche Aufgaben noch offen sind.
- Sie ist **Navigationsschule**: nichts Kompliziertes, aber die Grundlagen sicher.
- Man sieht der Karte **nicht an, wohin der Weg führt**. Man navigiert von Ort zu Ort.
- In den ersten Seetagen **navigiert die Crew und bringt es dir bei**, langsam übernimmst du, **etwa ab Tag 4 machst du es allein** und wirst zum Navigierprofi.
- Bis zur Freigabe der offiziellen Übungskarte 49 nehmen wir eine eigene Karte. **Die Reise muss so geplant sein, dass alle Elemente auch auf der Karte 49 vorkommen.**

**Wer navigiert (Leiter, passt zu den Stufen N0–N6 aus `docs/reise.md` §3):**
| Tag | Wer navigiert | was du tust | Stufe |
|---|---|---|---|
| 1 | Hinnerk nach Gefühl, Smilla auf der Karte | zuschauen, den Heimathafen auf der Karte finden | – |
| 2 | Smilla | eine Tonne finden und ihre Position ablesen | N0 |
| 3 | Smilla misst mit dir | Kurs mit dem Dreieck, Distanz mit dem Zirkel; Smilla prüft | N1–N2 |
| 4 | **du**, die Crew prüft | Etappe allein planen: Kurs, Distanz, Fahrzeit, Tide | N3 |
| 5 | du | dazu Kompass, Peilung, Missweisung (Nachtfahrt) | N4 |
| 6 | du | dazu Strom und Koppelort (Sturm) | N5 |
| 7 | du, Harms schaut zu | alles gemischt, Kreuzpeilung; eine Aufgabe im Format der amtlichen Navigationsaufgabe | N6 |

**So läuft eine Etappe auf der Karte:**
1. Am Morgen sagt die Crew das Ziel des Tages („Heute nach Klüverhafen“). Vorher ist es nirgends zu sehen.
2. Du suchst es auf der Papierkarte, ab Tag 3 misst du Kurs und Distanz und tippst die Werte in die App. Die App prüft mit Toleranz und zeigt danach den Rechenweg auf der Karte in der App (die Lösungen rechnet sie aus den Kartendaten, wie heute `navi7.js`).
3. **SK5 Bleistiftspur.** Du zeichnest den Kurs mit Bleistift auf deine Papierkarte. In der App erscheint dieselbe Linie als Bleistiftspur. Am Ende der Reise ist die ganze Route auf deiner Karte, von dir selbst gezeichnet.
4. **SK6 Kästchen auf der Karte.** Neben jedem Ort der Reise ist auf der Papierkarte ein kleines Kästchen gedruckt, unauffällig zwischen anderen Orten, damit es die Route nicht verrät. Ist ein Ort geschafft, malst du es aus.

**In der App (Entwurf im Artifact „Reisekarte“, noch nicht gebaut):**
- Die Karte zeigt nur, wo du schon warst, und dein nächstes Ziel, sobald die Crew es genannt hat. Der Rest ist nicht markiert.
- Jede Folge ist eine Station, nach Tagen gruppiert (Tag 1 bis 7 als Reiter oder Leiste).
- Farben wie bei den Fragen (HR aus `docs/reise.md` §3): grau nicht gehört, gelb gehört, hellgrün das meiste gelöst, dunkelgrün alles gelöst; ↻ mit Zahl, wenn Fragen wieder fällig werden.
- Station antippen: Kacheln mit Haken: 🎧 Folge, ❓ Fragen der Folge, 🪢 Knoten am Pier (mit Stoppuhr), ⚓ Anlegen mit dem Modell, 🧭 Kurs auf der Papierkarte, ⛵ 3D-Übung. Offene Aufgaben sieht man sofort.
- **Aufgaben mit den Händen** kann die App nicht sehen. Du sagst ehrlich, ob es geklappt hat („Hält er? Ehrlich.“), das zählt im Ausbildungsheft in der Dimension „echt“ (`lern.js`, `e`). Die Stoppuhr misst die Zeit, die Crew kommentiert sie.

**SK7 Welche Karte (deine Frage, meine Empfehlung):**
- **Empfehlung: jetzt mit der eigenen Karte bauen, aber so, dass der Wechsel auf die Karte 49 nur ein Austausch von Daten ist.**
- Warum: Die App kann die eigene Karte ohne Lizenz zeigen, drucken und verändern. Mit der Karte 49 dürften wir sie bis zur Freigabe weder in der App zeigen noch drucken (R8: nie abpausen). Ohne Anzeige in der App fehlt aber genau das, was du willst: dieselbe Karte auf dem Tisch und in der App.
- Warum der Wechsel nicht kompliziert wird:
  - Unsere **Seekarte 7** (`img/karte7.svg`, `data/karte7.json`) bildet schon das Gebiet der Karte 49 nach, mit den echten Namen: Elbe-Fahrwasser mit den Elbe-Tonnen, Helgoland, Neuwerk, Alte Weser, Tegeler Plate, Jade, Spiekeroog, Accumer Ee, Otzumer Balje. Diese Namen stehen auch auf der Karte 49.
  - Jede Navigationsaufgabe ist in der App ein **Datensatz** (von wo, nach wo, was zu messen ist), die Lösung rechnet die App aus den Koordinaten. Für die Karte 49 braucht man also ein Bild und eine neue Koordinatentabelle; Aufgaben, Geschichte und Code bleiben.
  - Darum gilt ab jetzt: **Reise-Orte und Aufgaben nennen nur Dinge, die es auf der Karte 49 gibt** (Tabelle unten). Was die Karte 49 nicht hat, kommt nicht in die Navigation.
- **SK8 Reiseorte auf der Karte.** Die Geschichte hat heute erfundene Ortsnamen (`docs/reise.md` §5: Kuttershaven, Brede, Elvmünde, Klappdörp, Moorende, Groter Sand, Lüttoog, Harmsoog), und dort steht noch „nicht Seekarte 7“ (E24). Das passt nicht mehr zu „dieselbe Karte wie in der App“. Vorschlag: Die Orte der Geschichte bekommen ihren Platz auf der Reisekarte, jeder an einer Stelle, die es so ähnlich auch auf der Karte 49 gibt:

| Ort der Geschichte | auf der Reisekarte (Seekarte 7) | ähnlich auf der Karte 49 (am Original prüfen) |
|---|---|---|
| Kuttershaven (Heimathafen) | Kuttershaven, gibt es schon | Hafen an der Elbmündung (wie Cuxhaven) |
| Fluss Brede, Ankerbucht Schilfwinkel | Nebenfluss mit Ankerbucht, neu | Nebenfluss oder Priel an der Elbe |
| Strom Elvmünde, Klüverhafen | Elbe-Fahrwasser, Klüverhafen gibt es schon | Elbe-Fahrwasser mit Tonnen, Hafen |
| Schleuse Klappdörp, Kanal, Moorende | Schleuse gibt es schon, Kanal neu | Schleuse und Kanal (welche, prüfen) |
| Groter Sand, Wrack, Lüttoog | Watt mit Priel und Pricken, Wrack mit Kardinaltonnen, Insel | Wattgebiet, Wrack mit Kardinaltonnen, Insel (wie Neuwerk) |
| Nachtfahrt, Nebelbank | Ansteuerung mit Leuchtturm, Leit- und Richtfeuer | Leuchttürme und Feuer der Ansteuerung |
| Offene See | Verkehrstrennungsgebiet | Verkehrstrennungsgebiet der Deutschen Bucht |
| Harmsoog (Ziel) | Hochseeinsel, wie Helgoland | Helgoland |

- Elemente, die die Reise auf jeden Fall braucht und die die Karte 49 haben muss: Lateraltonnen eines Fahrwassers, Kardinaltonnen, Einzelgefahrenzeichen, Sonderzeichen, Leuchtturm mit Kennung, Richtfeuer oder Leitfeuer, Wrack, Watt mit Tiefenangaben, Strom-Raute mit Tabelle, Gezeitenangaben, Kompassrose mit Missweisung, Verkehrstrennungsgebiet, Sperrgebiet oder Naturschutzgebiet, Peilobjekte an Land (Kirchtürme, Türme). Diese Liste prüfen wir am Original, sobald es in `quellen/` liegt.

## 4. Die App: drei Orte
**✓ (10.11.2026):** Die wichtigsten Funktionen sind die **Hörreise** (Name noch offen), die **normale Lernfunktion** (Prüfungsfragen), die **Knotenkunde** und die **Navigationsschule**. Sie funktionieren **unabhängig voneinander**, und **immer leitet die Crew an**, wie ein gutes Lehrmeisterteam, Schritt für Schritt. Die App wird insgesamt schlichter.

### 4.1 Kajüte: Lernen (das Herzstück)
- **✓** Die Hörreise findet in der Kajüte statt. Wer sie durchspielt, lernt alles in sinnvoller Reihenfolge.
- **✓** In der Kajüte gibt es außerdem einen Knopf für die **Übung der Praxis**; er öffnet das 3D-Fenster (Manöver und Fahraufgaben), das wir verbessern.
- **✓** Die **Minispiele verschwinden aus der Kajüte.** Dort konzentriert man sich aufs Lernen.
- **SK9 Fünf Dinge in der Kajüte, jedes ein Gegenstand:**
  | Gegenstand | Funktion | wer führt |
  |---|---|---|
  | Hocker oder Funkgerät | Hörreise | die ganze Crew |
  | Kartentisch | Reisekarte (Fortschritt, Aufgaben) und Navigationsschule | Smilla |
  | Bücherregal | Lernkartei: alle Prüfungsfragen, Zeichen und Begriffe, Meine Prüfungen | Smilla, Klabauter mit Merksätzen |
  | Knotenbrett | Knotenkunde mit Animation, Stoppuhr, Bezug auf die Box | Hinnerk |
  | Steuerstand-Bild oder Manöverbrett | Praxis im 3D-Fenster | Hinnerk |
  | Telefon | Harms: Probeprüfung | Harms |
- **SK10 Ein Lernstand, vier Türen.** Die vier Lernfunktionen teilen sich einen Lernstand. Wer gerade Folge 2-3 gehört hat, dem empfiehlt die Navigationsschule die passende Stufe und die Knotenkunde den Knoten, der dort vorkam. Wer ohne Hörreise lernt, bekommt dieselbe Reihenfolge, nur ohne Geschichte.

### 4.2 Deck: die Spaßabteilung
- **✓** Oben an Deck tippt man aufs **Ruder** und steuert die Frieda im 3D-Modus.
- **✓** Das Boot startet immer dort, wo man es zuletzt gelassen hat.
- **✓** Man kann die Karte vom Hafen aus erkunden, **Minispiele finden**, kleine Aufgaben machen, das **Boot ausbauen**.
- **SK11 Dieselbe Welt wie die Reise.** Die 3D-Welt an Deck ist dasselbe Gebiet wie die Reisekarte. Ein Hafen wird erst zum freien Anfahren frei, wenn du ihn in der Hörreise erreicht hast. So lohnt sich die Reise auch für die Spaßabteilung, und das freie Fahren wiederholt nebenbei, was die Folgen erklärt haben (Tonnen, Fahrwasser, Ausweichen).
- **SK12 Ausbau als Belohnung fürs Lernen**, nicht für Punkte: zum Beispiel das Steuerrad statt der Pinne nach Tag 3 (E19 sieht das Rad als späteres Upgrade vor), Laternen nach den Lichtern an Tag 5, der Skipperwimpel nach Tag 7, Bootsfarbe und Name am Heck jederzeit.
- **SK13 Minispiele als Fundstücke**, zum Beispiel eine Flaschenpost im Hafenbecken öffnet das Knotenrennen, ein Fischerboot das Lichterspiel. Die vorhandenen Spiele (`GAMES`) wandern dorthin.

### 4.3 Was wegfällt oder zusammengelegt wird (Vorschlag SK14)
- **„Frei üben“** als eigene Seite geht in die Kajüte auf (jede Funktion ist dort ein Gegenstand). Die Leiste unten wird **Deck · Kajüte · Karte**; „Karte“ öffnet die Reisekarte direkt.
- Die **alte Navigationsschule** (Kliev-Mündung, `navi.js`) wird durch die Navigationsschule auf der Reisekarte ersetzt (`navi7.js`); was gut ist (Werkzeuge, Rechenblatt, Hilfe in drei Stufen), wandert mit.
- **Seezeichen-Kurs und Lexikon** werden eins: „Zeichen und Begriffe“ im Bücherregal (M16).
- Das **2D-Manöverspiel** bleibt hinter dem Praxis-Knopf, bis das 3D-Fenster alle sechs Prüfungsmanöver kann (F4), dann fällt es weg.
- **Spielekiste** geht an Deck (SK13).
- **Alte Folgen und Tests** (`alteFolgen`) gehen in die Werkstatt.
- Der **alte Törn** und der **alte Probetag** (`reise.js`) fallen weg; ihre Spielstände bleiben lesbar (R7).

## 5. Wie Hörreise, Box und Karte zusammenhängen (wichtig fürs Schreiben)
Jede Folge der Hörreise ist eine Station auf der Reisekarte. Für die Skripte gilt deshalb (Vorschlag **SK15**, wird nach Freigabe eine Regel in `docs/reise.md` §7):
1. **Die Box liegt auf dem Tisch.** Die Crew spricht so, als lägen Pier, Modell, Leinen und Karte vor dir: „Nimm deine Frieda, leg sie an den Pier, Bug zum Poller.“ Wer die Box nicht hat oder gerade im Auto sitzt, versteht trotzdem alles (HR19).
2. **Handgriffe sind Aufgaben der Station.** Im Modus Mitmachen hält die Folge an („Mach mal, ich warte“), im Hörspiel macht es die Crew, und die Aufgabe landet als offene Kachel an der Station (HR20).
3. **Die Karte ist die Papierkarte.** Navigationsstellen nennen nur, was auf der Reisekarte steht, und nur Dinge, die es auch auf der Karte 49 gibt (§3).
4. **Wer navigiert, folgt der Leiter in §3.** Ab Tag 4 fragt die Crew dich nach dem Kurs, statt ihn zu sagen.
5. **Das Ziel des Tages nennt die Crew am Morgen**, nie früher.
6. **Pier-Plan** (SK1): Die Crew benutzt die festen Namen der Pier-Plätze.
7. **Knoten mit Stoppuhr:** Hinnerk macht vor, du bindest, die Stoppuhr läuft; die Zeit kommentiert die Crew mit festen Sätzen.

## 6. Die Navigationsschule
- **✓** Grundlagen sicher, nichts Kompliziertes; dieselbe Karte wie in der Box.
- Sie ist zugleich die Navigation der Reise (§3) und eine eigene Funktion am Kartentisch: Stufen N0–N6 nacheinander, jede mit Erklärung der Crew, vorgerechnetem Beispiel, Aufgabe auf Papier und Aufgabe in der App.
- Grundlage ist `navi7.js` (Aufgaben als Daten, Lösungen aus den Kartendaten, 38 Aufgaben N0–N6).
- **SK16** Am Ende eine Aufgabe im Format der amtlichen Navigationsaufgaben, auf der eigenen Karte; mit der Karte 49 später die echten 15 Aufgaben.

## 7. Die Knotenkunde
- Neun Prüfungsknoten mit Tau-Animation (gibt es), Hinnerk sagt die Schritte an (gibt es), Knotenkunde-Spiel (gibt es).
- **Neu:** QR-Code je Knoten in der Box öffnet direkt die Animation (Link mit `#knoten-palstek` oder ähnlich), Stoppuhr-Aufgabe am Pier, Bezug auf die Pier-Plätze.

## 8. Freischalten (ganz hinten)
- **✓** In der Box liegt ein Code, den man nach dem Download eingibt; er schaltet alle Funktionen frei. Ohne Box ist die App nutzbar, aber nicht vollständig. **Dieser Mechanismus kommt ganz zum Schluss.**
- Bis dahin ist alles frei. Was offen ist (welche Teile frei bleiben, Code ohne Server, Weitergabe), steht in `docs/am-ende-klaeren.md`.

## 9. Offene Fragen (bitte mit Nummer beantworten)
- **SK1** Pier-Plan mit festen Plätzen (Poller, Klampe, Ring) und drehbarem Wind- und Strompfeil? (Empfehlung: ja)
- **SK2** Tütchen nach Tagen statt Fächer, drei bis vier Stück? Oder gar keine Überraschung, alles liegt offen?
- **SK3** Kursdreieck und Zirkel in die Box?
- **SK5/SK6** Bleistiftspur in der App und ausmalbare Kästchen auf der Papierkarte?
- **SK7** Erst eigene Karte, Wechsel auf die Karte 49 als Datenaustausch? (Empfehlung: ja)
- **SK8** Die Orte der Geschichte kommen auf die Reisekarte (Seekarte 7 erweitert), statt erfundener Einzelorte ohne Karte? Das ändert E24 („nicht Seekarte 7“).
- **SK9** Fünf Gegenstände in der Kajüte wie in der Tabelle?
- **SK11** Häfen an Deck erst frei, wenn die Reise sie erreicht hat?
- **SK12/SK13** Ausbau als Belohnung fürs Lernen, Minispiele als Fundstücke?
- **SK14** Leiste unten „Deck · Kajüte · Karte“, „Frei üben“ geht in der Kajüte auf?
- **SK15** Die Regeln aus §5 als feste Regeln für die Folgen (HR47 ff.)?
- **SK17 Name der Hörreise.** Vorschläge: „Frieda funkt“, „Sieben Tage Frieda“, „Leinen los“, „Kurs Harmsoog“, „Logbuch der Frieda“, „Kajütenfunk“ (der alte Name). Meine Wahl: „Frieda funkt“, kurz, nach Hören klingend, mit dem Boot im Namen. Vor der Veröffentlichung Markenrecherche (`docs/am-ende-klaeren.md`).

## 10. Reihenfolge (Vorschlag)
| Schritt | Was |
|---|---|
| **S1** | Strukturen: diese Datei, `docs/am-ende-klaeren.md`, Verweise in `VISION.md`, `CLAUDE.md`, `docs/reise.md` (10.11.2026 ✓ angelegt) |
| **S2** | Antworten SK1–SK17 einarbeiten; Reisekarte festlegen (Seekarte 7 erweitern oder neu, A4-Druckfassung) |
| **S3** | Reisekarte in der App: Stationen nach Tagen, Kacheln, Farben, Bleistiftspur; noch ohne neue Aufgaben |
| **S4** | Kajüte neu ordnen (SK9, SK14); Minispiele raus |
| **S5** | Aufgaben mit den Händen: Stoppuhr, Knoten am Pier, Anlegen mit dem Modell, Kurs auf Papier eintippen |
| **S6** | Hörreise-Skripte nach SK15 anpassen (1-1 bis 1-3), weiter schreiben |
| **S7** | Deck: 3D frei fahren, Start am letzten Ort, Häfen nach Reise, Fundstücke, Ausbau |
| **S8** | Dein Box-Prototyp: testen, Pier-Plan und Maße abstimmen |
| **S9** | Ganz am Ende: Karte 49, Freischaltcode, Recht (`docs/am-ende-klaeren.md`) |
