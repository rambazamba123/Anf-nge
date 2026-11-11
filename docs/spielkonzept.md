# Spielkonzept: Box, Reisekarte, Kajüte und Deck

Fassung 1 vom 10.11.2026, **Entwurf zur Freigabe** (R16). Fassung 1.1 vom 10.11.2026 abends mit den ersten Antworten des Nutzers (unten mit ✓ markiert).

**Antworten vom 10.11.2026 abends (kurz):** SK1 ✓ fester Pier-Plan, die Leinenpunkte am Modell passen genau dazu. SK2 ✓ Tütchen (darin liegen die Sachen). SK5 ✓ Kurs selbst zeichnen und selbst navigieren. SK7 geändert: Seekarte 7 bleibt **Übungskarte**, für die Reise zeichnet der Nutzer eine **neue, kleine Karte** im Stil einer Piratenkarte (§3a). SK8 ✓. SK14 ✓ (Törn fällt weg; der „alte Probetag“ ist der erste Versuch einer Reise am Kartentisch aus v4.97–v5.04, heute unter „Alte Folgen und Tests“; fällt mit weg). Neu: HR47 Navigieren unterwegs, HR48 Umwege, SK18 Modi „⚓ Vor Anker“ und „⛵ In Fahrt“.

**Was diese Datei ist:**
- Sie beschreibt, wie die Teile zusammenspielen: die Box auf dem Tisch, die Reisekarte auf Papier und in der App, die Hörreise und die Lernfunktionen in der Kajüte, die Spaßabteilung an Deck.
- Sie gilt zusammen mit `VISION.md` (Grundsätze, Lernforschung) und `docs/reise.md` (Geschichte, Reiseplan, Regeln der Folgen). Wo sie widerspricht, gilt nach Freigabe diese Datei.
- Claude liest sie vor jeder größeren Arbeit an App, Hörreise oder Box (R16) und baut die App so weiter, **als gäbe es die Box schon**.

**Kennzeichnung:**
- ✓ = Aussage oder Entscheidung des Nutzers (10.11.2026 oder früher, mit Datum). Gilt.
- **SK…** = Vorschlag von Claude oder offene Frage. Gilt erst nach Antwort.
- Was erst ganz am Ende geklärt wird (Recht, Lizenzen, Freischaltung, Vertrieb), steht in `docs/am-ende-klaeren.md`.

## 0. Rückmeldung vom 11.11.2026 (Leitfaden Fassung 1) und Stand
Artifact „Skipper Leitfaden“, Fassung 2, mit Nummern LF24–LF44. ✓ = in der App gebaut, ◇ = im Entwurf gezeigt, wartet auf deine Freigabe, ! = geht nicht wie gewünscht (Begründung dabei).

| Nr. | Wunsch des Nutzers | Stand |
|---|---|---|
| N1 | Zuruf: vorgelesen wird mit Alfa, Bravo, Charlie, Delta; ausgelöst nur mit A, B, C, D; an den Antworten steht A–D (HR49) | ✓ v5.61, im Hörspiel und im Quiz; Test `tests/zuruf-pruefen.js` |
| N2 | Deck: Boot schaut nach links, freies Wasser, kein Steg, kein Ruder-Text; Motor antippen = 3D, Kajüte antippen = Kajüte; ohne Text; Fernglas zeigt das Antippbare (ohne Easter-Eggs) | ◇ LF24, LF25 |
| N3 | Klabauter schwebt über dem Dach | ✓ v5.61 (er stand über der schrägen Frontscheibe; jetzt mitten auf dem Dach) |
| N4 | Unter dem Boot: eine aus der Crew empfiehlt vier Happen (an die Geschichte angepasst; Nachholen zuerst, wenn die Geschichte weiter ist als der eigene Stand; Wackelkandidaten; auch Knoten); kleines Rad dreht neue Happen | ◇ LF27–LF29; baut auf `todayPath` auf |
| N5 | Darunter das Prüfungsboot-Rennen im neuen Look; antippen = Statistik (je Bereich: sitzen, gesehen); gibt es schon, nur neuer Platz | ◇ LF27, LF30 |
| N6 | Oben rechts ⚙️ Einstellungen mit den Entwicklerwerkzeugen; gemeinsam durchgehen, ist aufgebläht | ◇ Vorschlag SK22 unten |
| N7 | Kajüte: die alte, gemütliche Szene bleibt; Spielekiste weg; Knotenbrett bleibt; Karte auf dem Tisch präsenter, führt zur Kartenübersicht (offene Missionen, bisherige Reise); Symbole ja, aber nicht der Hocker | ◇ LF31–LF33 (Funkgerät statt Hocker) |
| N8 | Mehr Symbole, weniger Text; Knotensymbol anpassen | ◇ eigene Symbole im Entwurf |
| N9 | Kajütenfunk: Symbole mittig; Vor Anker mit vier Schaltern (Navigation = Stift/Zirkel/Dreieck, Knoten = Klampe/Boot/Knoten, Praxis = Steuerrad, Lichter = Auge), farbig = mache ich selbst, grau = die Crew erklärt; In Fahrt mit Kippschalter Ohr+Sprechen (Mitreden) oder nur Ohr | ◇ LF34–LF36; in der App gibt es bisher nur den Moduswechsel |
| N10 | Leiste unten verschwindet nach 15 Sekunden, Finger unten holt sie zurück | ✓ v5.61 |
| N11 | Vollbild als Standard | ✓ v5.61 (der Browser erlaubt es erst nach dem ersten Tippen auf ▶) |
| N12 | Statt Vollbild-Knopf ganz links ⟵: pausiert, zur Kartenübersicht | ✓ v5.61 (bis die Reisekarte gebaut ist: Liste der Folgen am Kartentisch) |
| N13 | Minimiermodus: Blase mit Stopp und Vergrößern, verschiebbar, während man andere Apps bedient | ◇ LF41; ! über anderen Apps geht das in einer Web-App nicht (nur in einer echten Android-App), innerhalb von Skipper ja; außerhalb steuern Benachrichtigung und Sperrbildschirm |
| N14 | Frage so groß wie möglich; die längste Frage der Folge bestimmt die Größe | ✓ v5.61 (`frageGroesse`) |
| N15 | Reisekarte: Kacheln mit mehr Symbolen; je Station sammeln sich unerledigte Aufgaben und Fragen in einer Kiste; dort einzeln abarbeiten (auch nur eine), Stand bleibt; Farbe der Kiste nach Stand | ◇ LF42–LF44 |

**SK22 Einstellungen aufräumen (Vorschlag):**
- **Für alle sichtbar:** Schein und Termine; Name und Anrede; Ton (Musik, Geräusche, Lautstärke der Stimmen); große Schrift; Gratis-Stimme je Figur; Vorlesen und Mitreden; Rundgang wiederholen; Sicherung (Spielstand speichern und laden); Über die App (Haftung, Quellen, Lizenzen).
- **In die Werkstatt (nur mit Entwickler-Schalter):** KI und Schlüssel, Klönen, Stimmen, Stimmen-Casting, Hörprobe, Stimmenpaket, Zuhören, Crew-Charakter, Protokoll, Selbsttest, Alte Folgen und Tests.
- **An andere Stellen:** Boot-Look → Ausbau an Deck (SK12); Trophäen und Rekorde → Statistik unter dem Rennen; Törn-Logbuch → fällt mit dem Törn weg.

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
- *(überholt am 10.11. abends, siehe §3a)* Bis zur Freigabe der offiziellen Übungskarte 49 nehmen wir eine eigene Karte. **Die Reise muss so geplant sein, dass alle Elemente auch auf der Karte 49 vorkommen.**

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

## 3a Die neue Reisekarte (zeichnet der Nutzer)
**✓ Nutzer, 10.11.2026 abends:** „Die Karte ist ungefähr so groß wie die Übungskarte 49. Das ist für unseren Zweck viel zu groß. Ich erstelle eine neue Karte, etwa ein Fünftel so groß, spannender, eher wie eine Piratenkarte. Man muss nur navigieren können. Die Strecke muss nicht beidseitig sein; ab und zu bauen wir einen Umweg ein, damit man auch auf einer kleinen Karte genug herumkommt.“ Seekarte 7 bleibt als Übung.

**Meine Meinung:** Richtig so. Eine kleine Karte ist am Tisch handlich, passt in die Box und überfordert nicht. Wichtig ist nur: Die **Navigationsaufgabe in der echten Prüfung läuft auf der Karte 49**. Darum zwei Karten mit klaren Rollen: die Piratenkarte für die Reise und die Grundlagen, die Seekarte 7 (ähnlich der 49) als Übung in der Navigationsschule für die Prüfungsaufgaben (SK16).

**Kartenauftrag (was die Karte haben muss, damit man richtig navigieren kann):**
- **Größe:** DIN A4 quer, Gebiet etwa 20 × 14 Seemeilen; die längste Etappe 8 bis 12 cm, damit Dreieck und Zirkel sinnvoll arbeiten.
- **Ränder:** Breitengrad-Skala links und rechts mit Minuten und Zehnteln (daran misst der Zirkel die Distanz), Längengrad-Skala oben und unten. Ein dünnes Gitter darf sein.
- **Kompassrose** mit Missweisung (Wert, Jahr, jährliche Änderung).
- **Seezeichen normgerecht**, auch im Piratenstil: rote und grüne Fahrwassertonnen, eine Mitte-Fahrwasser-Tonne, vier Kardinaltonnen um ein Wrack, eine Einzelgefahrenstelle, gelbe Sonderzeichen, ein Leuchtturm mit Kennung (am besten Sektorenfeuer), ein Richtfeuer-Paar.
- **Tiefen:** Tiefenzahlen, Linien bei 2, 5 und 10 m, Watt (fällt trocken), ein Priel mit Pricken.
- **Strom und Tide:** eine Strom-Raute mit kleiner Tabelle, Gezeitenangaben für den Heimathafen.
- **Peilobjekte an Land:** Kirchturm, Funkmast oder Windrad, damit man Kreuzpeilungen machen kann.
- **Gebiete:** ein Sperrgebiet, ein Naturschutzgebiet (Seehunde), ein kleines Verkehrstrennungsgebiet vor der offenen See, ein Ankerplatz.
- **Orte der Reise** (Tabelle SK8): Kuttershaven mit Tankstelle, Fluss Brede mit Ankerbucht Schilfwinkel, Fahrwasser Elvmünde, Klüverhafen, Schleuse Klappdörp mit Kanal nach Moorende, Watt Groter Sand mit Wrack und Seehundsand, Insel Lüttoog, Ansteuerung mit Leuchtturm, offene See, Insel Harmsoog mit Hafen.
- **Kein Weg eingezeichnet.** Neben jedem Ort ein unauffälliges Kästchen zum Ausmalen (SK6).
- **Piratenstil:** Papier, gezeichnete Küsten, Verzierungen, Seeungeheuer am Rand, alles erlaubt, solange Zeichen, Zahlen und Skalen lesbar bleiben.
- **Lieferung:** am besten als SVG, sonst als großes PNG. Claude eicht daraus die Kartendaten (wie bei der Seekarte 7, `tools/karte7-extrahieren.js`), legt die Orte fest und baut die Aufgaben.

## 4. Die App: drei Orte
**✓ (10.11.2026):** Die wichtigsten Funktionen sind die **Hörreise** (Name noch offen), die **normale Lernfunktion** (Prüfungsfragen), die **Knotenkunde** und die **Navigationsschule**. Sie funktionieren **unabhängig voneinander**, und **immer leitet die Crew an**, wie ein gutes Lehrmeisterteam, Schritt für Schritt. Die App wird insgesamt schlichter.

### 4.0 Zwei Modi der Hörreise (SK18, v5.59 gebaut)
- **✓ Nutzer, 10.11.:** Kajütenfunk antippen, dann „am Schreibtisch / in der Kajüte“ oder „unterwegs / nebenbei“; man soll während der Folge umschalten können; unterwegs ist der Zuruf an.
- **Namen (Vorschlag, eingebaut):** **⚓ Vor Anker** (du sitzt still, hast Hände und Zeit: tippen, Aufgaben gleich mitmachen) und **⛵ In Fahrt** (du bist unterwegs: zuhören, laut antworten, Aufgaben landen in der Reisekarte für später). Der Zuruf heißt jetzt **🎙️ Mitreden**.
- Weitere Namen zur Wahl: „Am Kartentisch / Auf Wache“, „In der Kajüte / Unterwegs“, „Mitmachen / Nebenbei“; für den Zuruf „Zurufen“ oder „Laut antworten“. Umbenennen ist eine Zeile.
- Umschalten jederzeit unten in der Leiste (Knopf neben ▶). In Fahrt schaltet Mitreden ein; dann ist jede Frage echt (du antwortest laut, nach zwölf Sekunden geht es ohne Antwort weiter). Die Taste ⏯ an Kopfhörer oder Lenkrad heißt bei offener Frage „jetzt antworten“: die Stimme hört auf, das Mikrofon hört zu.
- Grenze: Mitreden braucht den eingeschalteten Bildschirm (die Spracherkennung des Browsers hört bei ausgeschaltetem Bildschirm nicht zu).

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
- **SK1** ✓ Pier-Plan mit festen Plätzen; die Leinenpunkte am Modell passen genau dazu. Offen: der drehbare Wind- und Strompfeil.
- **SK2** ✓ Tütchen: nummerierte Papiertütchen in der Box, darin Tau, Ring, Klampe und so weiter; aufmachen, wenn die Crew es sagt.
- **SK3** Kursdreieck und Zirkel in die Box?
- **SK5** ✓ Kurs selbst zeichnen, selbst navigieren. **SK6** Kästchen zum Ausmalen: mit auf die neue Karte (§3a)?
- **SK7** ✓ geändert: Seekarte 7 bleibt Übung, die Reise bekommt eine kleine Piratenkarte vom Nutzer (§3a).
- **SK8** ✓ Die Orte der Geschichte liegen auf der Reisekarte (jetzt auf der neuen kleinen Karte).
- **SK9** Fünf Gegenstände in der Kajüte wie in der Tabelle?
- **SK11** Häfen an Deck erst frei, wenn die Reise sie erreicht hat?
- **SK12/SK13** Ausbau als Belohnung fürs Lernen, Minispiele als Fundstücke?
- **SK14** ✓ alle Punkte; Törn und alter Probetag fallen weg.
- **SK15** Die Regeln aus §5 als feste Regeln für die Folgen (HR47 ff.)?
- **SK18** ✓ Modi Vor Anker und In Fahrt, umschaltbar in der Folge (§4.0); Namen noch bestätigen.
- **SK17 Name der Hörreise.** Vorschläge: „Frieda funkt“, „Sieben Tage Frieda“, „Leinen los“, „Kurs Harmsoog“, „Logbuch der Frieda“, „Kajütenfunk“ (der alte Name). Meine Wahl: „Frieda funkt“, kurz, nach Hören klingend, mit dem Boot im Namen. Vor der Veröffentlichung Markenrecherche (`docs/am-ende-klaeren.md`).

## 10. Reihenfolge (Vorschlag)
| Schritt | Was |
|---|---|
| **S1** | Strukturen: diese Datei, `docs/am-ende-klaeren.md`, Verweise in `VISION.md`, `CLAUDE.md`, `docs/reise.md` (10.11.2026 ✓ angelegt) |
| **S2** | Antworten SK1–SK17 einarbeiten (◐ 10.11.); neue kleine Reisekarte vom Nutzer (§3a) eichen und Orte festlegen |
| **S3** | Reisekarte in der App: Stationen nach Tagen, Kacheln, Farben, Bleistiftspur; noch ohne neue Aufgaben |
| **S4** | Kajüte neu ordnen (SK9, SK14); Minispiele raus |
| **S5** | Aufgaben mit den Händen: Stoppuhr, Knoten am Pier, Anlegen mit dem Modell, Kurs auf Papier eintippen |
| **S6** | Hörreise-Skripte nach SK15 anpassen (1-1 bis 1-3), weiter schreiben |
| **S7** | Deck: 3D frei fahren, Start am letzten Ort, Häfen nach Reise, Fundstücke, Ausbau |
| **S8** | Dein Box-Prototyp: testen, Pier-Plan und Maße abstimmen |
| **S9** | Ganz am Ende: Karte 49, Freischaltcode, Recht (`docs/am-ende-klaeren.md`) |
