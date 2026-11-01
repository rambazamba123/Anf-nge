# Plan: „Unser Schiff“ und alle fehlenden Animationen (Entwurf vom 01.11.2026)

> Auftrag (Nutzer, 01.11.2026): Alle für die Geschichte fehlenden Animationen systematisch bauen. Das Boot darin neu durchdenken, es soll wie „unser“ Schiff aussehen. Die Crew begleitet das Gesehene und redet mit dem Nutzer und mit dem, was auf dem Bildschirm zu sehen ist (E17).
> Dieser Plan ist ein **Entwurf zur Freigabe**. Nichts davon ist gebaut. Nummern: Bausteine `P1…`, Fragen `Q1…`. Die Liste der Animationen steht in `docs/animationen-liste.md` (A1.1 …, B1.1 …).

## 1. Was heute nicht stimmt (Befund im Code)
Das Schiff ist heute **vier verschiedene Boote**:

| Wo | Was man sieht |
|---|---|
| Deck (`boatScene`, `index.html`) | Segelyacht mit stehendem Mast, Segeln, Wanten, Flagge |
| Radeffekt (`reise.js`, `GRAFIK.rad`) | Motorboot von hinten mit Kajütendach und rundem Unterwasserschiff |
| Manöverspiel (`manoever.js`, `zeichneBoot`) | Draufsicht, Außenborder an einem kleinen offenen Boot |
| Animationen (`anim.js`) | Pro Animation ein eigenes, einfaches Boot (Anlegen, Begegnung, Festmacher …) |

Dazu sagt die Geschichte (`docs/reise-konzept.md`): „altes Motorboot, der Mast liegt abgebaut an Deck“, und der Mast wird erst spät gestellt (O98, Vorschlag Tag 42). Und der Nutzer hat ein **3D-gedrucktes Modell** vor sich, das der Bildschirm nachspielen soll. Das Deck zeigt also ein Boot, das in der Geschichte noch gar nicht existiert.

## 2. Das neue Boot (P1)
**Grundsatz:** Eine einzige Beschreibung des Bootes, aus der alle Ansichten entstehen. Dann sieht „unser Schiff“ überall gleich aus, und jede Änderung (Farbe, Name, Mast gestellt) gilt überall.

**Datei:** `boot.js` (nachgeladen, R11), Zugriff `BOOT.seite(opt)`, `BOOT.oben(opt)`, `BOOT.heck(opt)`, `BOOT.bug(opt)` (SVG-Text) und `BOOT.canvas(ctx, zustand)` (Draufsicht für Manöver und Fahrt-Szene). Alle Maße in einer Tabelle `BOOT.maß` (Rumpf 100 Einheiten lang, Breite, Freibord, Tiefgang, Aufbau, Antrieb).

**Aussehen (Vorschlag, abhängig von deinem Modell, siehe Q1):**
- ein **altes Kajütmotorboot** mit Charakter, etwa 9 m: weißer Rumpf, roter Streifen über der Wasserlinie, dunkelblaues Unterwasserschiff, Holzleiste (Scheuerleiste) und Holzdeck, kleiner Aufbau mit drei Fenstern und Steuerstand, Reling aus Edelstahl, Heckspiegel mit Namen und Heimathafen
- **Antrieb sichtbar:** Welle, Propeller und Ruder unter Wasser (für Radeffekt, Ruder, Schraubenstrahl)
- **Mast als Zustand:** `mast: 'liegt'` (abgebaut an Deck auf Böcken, Tag 1 bis 41) oder `'steht'` (ab Tag 42); das Deck der App zeigt vorher kein Segelboot mehr
- **Schalter je Ansicht:** Backbord rot und Steuerbord grün markiert, Teile beschriftet (Bug, Heck, achtern, querab, mittschiffs, Klampen, Fender, Poller, Anker, Ankerwinde), Lichter (Nacht und Tag, Sektoren), Leinen (Bug, Heck, Springs), Fender, Farbe der Wasserlinie, Name
- **Stil:** warm, flach, gezeichnet (R-Stil §3), dieselben Farben wie die Kajüte und das Deck

**Brücke zum echten Modell:** Das Modell des Nutzers bekommt dieselben Namen wie die Teile. Die Crew sagt zum Beispiel: „Dreh dein Boot, bis der Bug nach links zeigt. Siehst du die Klampe vorn? Da kommt die Bugleine dran.“ Die Draufsicht ist so gedreht wie die Ansicht des Nutzers von oben auf sein Modell. Alles bleibt auch ohne Modell verständlich („Nur schauen“).

**Was dafür vom Nutzer gebraucht wird (Q1):** ein Foto des Modells von der Seite und von oben (oder die STL-Datei), grobe Maße (Länge, Breite) und wo Klampe und Ring auf der Plattform sitzen. Dann zeichnet Claude das Boot nach dem Modell. Ohne Foto: Vorschlag oben.

## 3. Werkzeugkasten (P2)
Gemeinsame Bausteine, damit nicht jede Animation alles neu erfindet. Alle in `anim.js` bzw. `anim-bau.js` (nachgeladen, wenn `anim.js` zu groß wird, R11):

| Baustein | Inhalt | Genutzt von |
|---|---|---|
| `BOOT` | siehe oben | fast alle |
| Wasser und Himmel | Wellenreihen, Tageszeit, Wetter, Nebel | alle Szenen |
| Fahrzeuge | Maschinenfahrzeug, Segler, Schlepper, Fischer, Tiefgänger, Manövrierbehinderte, Frachter, Schubverband, Fähre; je mit Lichtern und Signalkörpern (Tag/Nacht) | A4, A5, A6, A10 |
| Zeichen | Tonnen (Lateral, Kardinal, Einzelgefahr, Sonder, Mitte), Feuer im Takt, Tafelzeichen, Pricken | A7, A8 |
| Kompassrose und Kartenstücke | Rose, Peilstrahl, Standlinie, Kursdreieck, Ausschnitt der Seekarte 7 | A8 |
| Leinen | Seil mit Durchhang und Zug, Klampe, Poller, Ring, Fender | A2, B1 |
| Anzeigen | Beschriftungen, Pfeile (Kraft, Strom, Wind), Hervorhebung („blinkt“), Bildunterschrift pro Phase | alle |
| Player | schon da: Phasen, ⏯ Auto, Vorlesen, Notizen, `ANIM.start/phase` | alle |

## 4. Wie jede Animation entsteht (P3)
Jede Animation ist ein **Mini-Hörspiel mit Bild**. Vorlage je Animation:
1. **Lernziel in einem Satz** (aus Frage oder Prüfungsstoff, Quelle: Folge und Fragennummern).
2. **Phasen** (3 bis 7): je Phase ein Bildzustand und ein bis zwei Sätze der Crew. Die Sätze nennen das Wichtige ohne „siehst du“, damit sie auch ohne Bild gelten (E16). Ein Satz zeigt aufs Bild („Die rote Tonne links“).
3. **Mitmachen:** wo es passt, ein Tippen („Wohin weicht das Boot aus?“) oder die Anweisung für das Modell („Leg dein Boot so hin“).
4. **Prüfung durch den Code:** Maße und Richtungen werden nicht geschätzt, sondern gerechnet (Kollisionskurs, Sektoren, Zeiten).
5. **Test:** Playwright-Lauf im Format 400×860, Screenshot je Phase, Konsole fehlerfrei, Phasen und Sätze vollständig (Skript im Test, wie `an-test.js`).
6. **Sätze:** als feste Sätze notiert (R10, `docs/feste-saetze.md`), bis dahin Gratis-Stimme.
7. **Einbau:** Eintrag in der Liste (✓), in der Seite „Animationen“ (mit Notizfeld) und, wo die Reise sie braucht, als Schritt `{ansicht:'grafik', bild:id}`.

**Fachlich geprüft** wird nach den amtlichen Katalogen (R8). Wo ohne `quellen/` geprüft wurde, steht es im Bericht.

## 5. Reihenfolge: acht Lieferungen
Zuerst das Boot, dann nach Familien (damit die Bausteine einer Familie nur einmal entstehen). Jede Lieferung ist eine Version mit Handy-Test und Bericht (R14).

| Lieferung | Inhalt | Anzahl |
|---|---|---|
| **L0** | **Boot `boot.js`**, Seite „Unser Boot“ (A1.1: Seiten, Bug, Heck, Teile), Umbau der vorhandenen Animationen und des Radeffekts auf das neue Boot, Deck zeigt das Motorboot (Mast liegt), Manöver und Fahrt-Szene nutzen `BOOT.canvas` | 1 neu + Umbau |
| **L1** | **Regeln und Lichter (Prio 1):** A4.1 Zwei Grundregeln, A5.2 Lichter und Signalkörper je Fahrzeug (Tag/Nacht), A4.4 Kurshalter, A4.8 Segler und Motorboot | 4 |
| **L2** | **Zeichen und Navigation (Prio 1):** A7.1 Fahrwasser von See, A7.2 Feuer im Takt, A7.6 Tafelzeichen, A8.3 Missweisung/Ablenkung, A8.4 Peilung, A8.5 Koppelort und Versetzung | 6 |
| **L3** | **Manöver und Seemannschaft (Prio 1 und 2):** B1.4 Wind und Abdrift, B1.9 Ankern in der Praxis, A2.3 Ankern, A1.3 Radeffekt von oben, A1.4 Ruder und Schraubenstrahl, B1.12 Rückwärts, B1.3 Pivotpunkt, B1.8 Ablegen mit Spring | 8 |
| **L4** | **Binnen (Prio 1 und 2, Akt 7):** A10.1 Berg- und Talfahrt, A10.3 Schubverband und Fähre, A10.4 Brücke und Wehr, A10.5 Binnenschallsignale, A7.7 Brücken und Durchfahrtshöhen | 5 |
| **L5** | **Verkehr und Nebel (Prio 2):** A4.3 Rangfolge, A4.5 Wo gilt was, A4.6 VTG, A4.7 Rechts halten, A5.3 bis A5.6 Lichter Sonderfälle, A6.2 Nebel von oben, A6.3 Glocke und Gong, A2.4 Sog und Schwell, A7.4 Einzelgefahr, A7.5 Leitfeuer | 13 |
| **L6** | **Wetter, Sicherheit, Revier (Prio 2):** A8.7 Strom bei Tide, A9.2 Wetterkarte, A9.5 Notsignale, A9.6 Weste und Sicherheit, B2.5 Leckabwehr, B2.6 Grundberührung, B1.1 Verdränger/Gleiter, B1.5 Strom im Hafen, B3.1 Motorcheck, B4.1 Törnplanung, B4.3 Wattfahren, B4.5 Nachtfahrt, A2.2 Ablegen mit Wind, A2.5 Wenden, A2.7 Mensch über Bord | 15 |
| **L7** | **Rest (Prio 3):** die übrigen Einträge mit Prio 3 (Motor-Kreisläufe, Gas, Beaufort, Schleppen, Rettungsinsel, Pyrotechnik …), nach Bedarf der Reise | etwa 29 |

Zusammen etwa 80 Animationen. Die Zahl ist hoch. Die Lieferungen L1 bis L3 decken alle Prio-1-Themen ab; ab L5 baue ich nach dem, was die Reise-Tage tatsächlich brauchen (Reiseplan `data/reise-plan.json`, Feld `grafik`), und ziehe L7 vor oder zurück.

## 6. Einbau in die Reise
- Jeder Tag in `data/reise-plan.json` hat ein Feld `grafik`. Ich ordne jede Animation dem Tag zu, an dem ihr Stoff dran ist (Abgleich mit Folge und Fragennummern).
- Reise-Tage, die ich schon geschrieben habe (1 und 2), bekommen die neuen Animationen sofort. Die Tage 3 bis 63 bleiben Platzhalter, bis Story und Figuren vom Nutzer da sind (O52, B164). Die Animationen sind davon unabhängig, die Sätze sind klar als Platzhalter markiert.
- Die Crew-Rollen: Hinnerk führt Praxis und Gefühl, Smilla die Regeln, Klabauter den Merksatz am Ende jeder Animation (festes Muster, siehe `docs/figuren-entwurf.md`).

## 7. Aufwand und Risiken (ehrlich)
- Eine gute Animation (Entwurf, Phasen, Rechnen, Test mit Screenshots) kostet bei mir etwa so viel Aufwand wie eine mittlere App-Seite. Ich schaffe mit der Arbeitszeit einer Sitzung etwa **vier bis sechs** je Lieferung, nicht alle 80 auf einmal.
- Das größte Risiko ist die **Zeichenqualität**. Ich sehe die Bilder nur als Screenshot und prüfe Maße im Code, aber ob etwas schön ist, entscheidet dein Blick am Handy. Deshalb pro Lieferung dein Feedback über das Notizfeld, bevor die nächste Familie startet.
- **Dateigröße:** SVG im Code. `anim.js` wächst. Ab etwa 150 KB teile ich nach Familien in nachgeladene Dateien (`anim-regeln.js`, `anim-navi.js`, …).
- **Lizenz:** alles selbst gezeichnet (L7). Ich zeichne keine realen Schiffe nach.

## 8. Fragen an den Nutzer
- **Q1 Modell und Boot:** Foto (Seite, oben) oder STL und Maße deines 3D-gedruckten Bootes; welche Art Boot ist es (Kajütmotorboot, offenes Boot, Segler)? Ohne Foto nehme ich das Kajütmotorboot aus §2. *Beispiel: Ist dein Modell eher eine Jolle oder ein Kutter?*
- **Q2 Bootsname:** soll „unser“ Schiff einen Namen am Heck tragen? *Vorschlag: „Skipper“ oder ein plattdeutscher Name, z. B. „Lütt Dirn“. Nichts davon ist beschlossen.*
- **Q3 Farben:** weiß mit rotem Streifen und dunkelblauem Unterwasserschiff (Vorschlag), oder lieber etwas anderes (z. B. blauer Rumpf, hölzernes Deck)? Das Modell ist oft einfarbig.
- **Q4 Deck der App:** Soll das Deck bis Tag 42 das Motorboot mit liegendem Mast zeigen (stimmig zur Geschichte) und danach die Segelyacht? Oder bleibt das Segelboot?
- **Q5 Tempo:** Sollen die Lieferungen L1 bis L3 einzeln (jeweils eine Version mit Handy-Test) oder in größeren Schritten kommen?
- **Q6 Mitmachen am Modell:** Soll die Crew bei jeder Animation „Leg dein Boot so hin“ sagen, oder nur bei Anlegen, Festmachen, Knoten und Manövern?

## 9. Neue Richtung: 3D-Welt (Nutzer, 01.11.2026, E18)
Nach dem Gespräch über die Architektur gilt als Vorschlag: **eine 3D-Welt statt vieler flacher Einzelbilder.** Der Prototyp läuft seit v5.11 (Frei üben → „🌊 3D-Welt (Test)“, Datei `welt.js`, Bibliothek `lib/three.min.js`, MIT).

**Festgelegt:**
- **Kamera:** dritte Person wie bei GTA, hinter dem Boot, wischen dreht, zwei Finger zoomen. Dazu Festansichten (Seite, Oben, Nah) für Erklärungen.
- **Boot austauschbar:** Das Boot ist nur ein `THREE.Object3D` mit festem Vertrag (Bug nach +Z, Ursprung mittig auf der Wasserlinie, Meter, optional Propeller, Ruder, Lichter, Ankerpunkt für die Katze). `WELT.setzeBoot(obj)` tauscht es, `WELT.normiere(obj, {laenge, achse})` macht ein fremdes Modell (zum Beispiel den 3D-Druck des Nutzers) passend. Sobald wir das echte Boot kennen, wird nur dieses Teil ersetzt.
- **Stil:** modern, süß, bunt, flach schattiert mit dunklem Umriss. Kein Janosch-Nachbau nötig.
- **Wimmelwelt (später, erst wenig):** Wie bei den Büchern von Sven Nordqvist (Pettersson und Findus) gibt es in jeder Ecke kleine Wesen und Tiere zu entdecken, die auf und um ein Schiff leben könnten (Möwen, Seehund, Bordkatze, kleine Fantasiewesen an Deck, in der Bilge, am Mast). Nur der Stil, keine fremden Figuren (§3). Im Prototyp als Anfang: Möwen, Seehund, Katze Backbord. Alles Weitere kommt später und ist eine Sammel- und Entdeck-Ebene, die nie vom Lernen ablenkt (R13: Fernglas markiert nur Funktionen).
- **Alte Animationen bleiben** (`anim.js`, Knoten, Manöverspiel). Wir kommen darauf zurück, wo 2D besser ist (Diagramme, Karten) oder 3D sich nicht lohnt.

**Prototyp-Stand (v5.11):** drehbares Boot, flaches Wasser mit Wellen, Gas (rückwärts, Stopp, langsam, voll) und Ruder mit einfachem Radeffekt, Spur, zwei Tonnen mit Crew-Kommentar beim Durchfahren, Insel mit Leuchtturm, fremdes Schiff mit Lichtern, Tag und Nacht (Lichter und Feuer leuchten), Boot-Tausch. Gemessen im Test (Software-Rendering ohne Grafikkarte) etwa 50 Bilder pro Sekunde, am Handy muss der Nutzer die Geschwindigkeit bestätigen.
**Stand v5.12 (Nutzer, 01.11.2026, zweite Runde):** Stil weicher und realistischer, gemütlich und warm, Umgebung detailreicher (Stil Spielzeug bleibt als Schalter, alle Farben und Oberflächen stehen oben in `welt.js` unter STIL). Boot mit Bullaugen (Messingring wie in der Kajüte, nachts warmes Licht), Außenborder (dreht beim Lenken mit, Propeller dreht), Bugkorb, Fender, Rettungsring, Flagge im scheinbaren Wind, liegender Mast. Steuerung mit einem Finger wie im Manöverspiel (stufenlos Gas und Ruder, Doppeltipp = Ruder mittschiffs). Wetter einzeln und kombinierbar: Wind Flaute bis Sturm mit Richtung, Sicht klar bis extrem dichter Nebel, Regen, Tageszeit; Wellen: Windsee, Dünung, Kreuzsee, Kabbelwasser, Schwell anderer Schiffe (beliebig an und aus). Feste Gegenstände: Tonnen werden weggestoßen und schwingen an der Kette zurück, Schiffe schubsen nur leicht, Mole, Stege und Insel stehen fest (Ton, Vibration, Wackeln der Kamera, die Katze erschrickt). Hafenszene: Molen aus Steinen mit Molenfeuern, zwei Stege mit liegenden Booten, Kaimauer mit Pollern, Häuserzeile, Hafenmeister, Kran, Laternen; davor Fahrwasser mit Tonnen, Ansteuerungstonne, Nord-Kardinaltonne, Sandbank mit Seehund, Insel mit Leuchtturm und Ausflugsschiff. Kleine dicke Katze läuft an Deck herum. Kamera weiter weg (25 m, Kameras: hinten, weit, Seite, oben, nah). Qualität stellt sich selbst ein (hoch, mittel, niedrig).
**Nächste Schritte nach dem Test:** Szenen-Format (Schiffe, Wege, Kamera, Phasen mit Sätzen) statt Einzelbildern; Anlegen, Begegnung, Lichter, Kardinal als erste Szenen; Boot nach dem echten Modell.

**Stand v5.13 (Testfolge):** Aus der 3D-Welt wird die Geschichte: `welt-folge.js` spielt ein Drehbuch aus `data/welt-folgen.json` ab. Bausteine: Crew spricht (Gesichter am Rand, Figuren an Bord), selbst steuern bis zu einem Ziel, Autopilot (auch im Zeitraffer), amtliche Fragen, Entscheidungen, Wetterwechsel, Schallsignal geben, Anlegen mit Hilfe der Crew, Knoten am Knotenbrett und mit dem Modell. Modus „Selbst“ oder „Auto“ (alles läuft von allein, wie der Hörmodus der Reise).
**Offene Frage Q11 (Seekarte 7 als Welt):** Vorschlag: die 3D-Welt Schritt für Schritt auf die Seekarte 7 legen (echte Lage der Tonnen aus `data/karte7.json`, Küste aus der Karte, nur die Umgebung von etwa 1 km wird gebaut, lange Strecken im Zeitraffer). Die Seekarte 7 ist dann die große Karte am Kartentisch und beim Antippen der kleinen Karte. Alternative: getrennte Schauplätze (Hafen, Fahrwasser, Ankerbucht) und die Karte nur zum Planen.
