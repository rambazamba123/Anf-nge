# Strategie-Gutachten Skipper (04.11.2026)

> **Auftrag** (Nutzer, 04.11.2026, „Strategischer Entwicklungsauftrag“): das ganze Konzept kritisch prüfen, Grundsatzentscheidungen bewerten, ein optimiertes Gesamtkonzept und eine Roadmap vorschlagen, Rückfragen in Etappen. **Am Projekt wird nichts geändert**, bis du zustimmst. Dieses Dokument ist nur der Bericht.
> **Grundlage:** echter Code (Stand v5.21), nicht nur die Dokumentation. Wo ich etwas im Code nachgesehen habe, steht die Stelle dabei (`datei:zeile`).
> **Grenzen meiner Prüfung:** Der Ordner `quellen/` (amtliche Originale, Prüfungsrichtlinie) fehlt in der Cloud. Die Seiten mit der Sportbootführerscheinverordnung (`gesetze-im-internet.de`, `gesetze.legal`) sind aus dieser Sitzung gesperrt. Fachliche Aussagen, die ich deshalb nicht am Original prüfen konnte, sind mit **⚠ zu prüfen** markiert.

**Kurzfassung in fünf Sätzen**
1. Skipper hat ein ungewöhnlich gutes Fundament: alle 285 amtlichen Fragen mit Merksätzen, eine 3D-Bootsphysik mit fachlich richtigem Radeffekt, ein Motorstart-Ablauf, eine eigene geeichte Seekarte und ein Manöverspiel nach dem amtlichen Praxisprotokoll.
2. Das größte Problem ist nicht fehlender Inhalt, sondern dass **nichts davon misst, ob jemand etwas kann**. Freigaben zählen, wenn man an einer Stelle der Folge ankommt, nicht wenn man etwas richtig gemacht hat; Fahraufgaben werden nicht bewertet; Wiederholungen hören nach vier richtigen Antworten für immer auf.
3. Es laufen **drei Pläne, drei Fahrt-Systeme, zwei Navigationsschulen und zwei Manöver-Physiken** nebeneinander. Das ist der teuerste Punkt, wenn man jetzt 48 weitere Folgen schreibt.
4. Mein Vorschlag: Ein **Ausbildungsheft mit Kompetenzen** wird das Rückgrat. Folgen, 3D-Aufgaben, Knoten, Karte und Fragen hängen daran und liefern Messwerte. Die Geschichte bleibt der Rahmen.
5. Bevor weitere Folgen entstehen: vier Grundsatzentscheidungen (Abschnitt 5), dann ein Prototyp-Kapitel nach dem neuen Modell, an echten Lernenden getestet.

---

## 1. Bestandsaufnahme

### 1.1 Reifegrad je Bereich

| Bereich | Stand | Belege |
|---|---|---|
| Amtliche Fragen SBF See (285), Binnen, SKS | ✅ fertig | `data/sbf.json` (285), Merksatz je Frage in `data/karten-sbf.json` |
| Lernstand je Frage (Farben, Easy/Tricky, Lernkartei) | ✅ fertig, **mit Fehler** (1.4) | `index.html:2164–2320` |
| Tagespfad „Kurs für heute“, Lernphasen | ✅ fertig | `index.html:5617–5720` |
| Probeprüfung (30 Fragen, 60 min) | ✅ fertig, ohne Kartenteil | `index.html:2112`; Kartenaufgabe nur getrennt in der alten Navigationsschule |
| 3D-Welt: Boot, Physik, Motorstart, Wetter, Wellen, Lichter nach Sektor | ✅ fertig | `welt.js:720–760` |
| 3D-Revier: Hafen, Fahrwasser, Tonnenkette, Wrack mit Kardinaltonnen, Klüverhafen | ✅ fertig, **erfunden, passt nicht zur Seekarte 7** | `welt.js` `bauWelt`; Q11 offen |
| 3D-Aufgaben: Ziel, Anlegen, Horn, Motor, Teile antippen | ◐ teilweise: nur „erreicht/nicht erreicht“, ohne Bewertung | `welt-folge.js:68–100` |
| Andere Schiffe nach Ausweichregeln | ❌ fehlt: ein Ausflugsschiff fährt im Kreis | `welt.js:623` |
| Strom und Gezeiten in 3D | ❌ fehlt (nur Wind) | `welt.js:721` `physik` |
| Mensch über Bord, Kompasskurs, Aufstoppen, Wenden auf engem Raum | ◐ nur im 2D-Manöverspiel, nicht in 3D | `data/manoever.json` |
| Knoten: Animationen, Spiel, Merksprüche | ✅ fertig, mathematisch geprüft | `knoten.js`, `tools/knoten-pruefen.js` |
| Seekarte 7 mit 38 Aufgaben N0–N6, Lösungen gerechnet | ✅ fertig | `navi7.js`, `tools/navi7-pruefen.js` |
| Alte Navigationsschule (Karte „Kliev“) | ✅ läuft noch daneben | `navi.js` |
| Folgen in 3D | ◐ 5 von etwa 53 Tagen, Rohbau, Handystimme | `data/welt-folgen.json` |
| Freigaben „Was ich an Bord darf“ | ◐ Liste und Anzeige da, **Messung falsch** (1.4) | `index.html:4953` |
| „Eingerostet“ | ❌ nur Konzept | `docs/konzept-ausbildung.md` D |
| Crew-Regisseur mit Gedächtnis | ✅ fertig, 16 Gespräche | `crew.js` |
| Kenner-Test, Einstufung | ❌ nur Konzept (zwei sich widersprechende Fassungen) | `docs/gesamtplan.md` §1, `docs/entscheidungen.md` O151 |
| Ausbildungsheft | ❌ nur Konzept | O153 |
| Hörmodus der 3D-Folgen | ◐ nur „Auto“: Hinnerk fährt, aber man muss zusehen | `welt-folge.js` |
| Kajütenfunk (Hörfolgen) | ◐ eigenes System mit eigenem Kursplan, Probefolge | `kurs.js`, `podcast/kursplan-sbf.json` |
| Starter-Set in der App | ◐ nur Liste „Was du brauchst“ und „Hält er? Ehrlich“ beim Knoten | `uebungsListe` |
| Stimmen für Folgen | ❌ noch nichts eingesprochen | – |
| Automatische Tests | ◐ Rauchtest für 2D-Teile; **3D und Folgen nicht im Test**, keine Prüfung von `welt-folgen.json` | `tests/smoke/rauchtest.js`, `.githooks/pre-commit` |

### 1.2 Was schon gut funktioniert
- **Fragen-Fundament:** Alle Fragen laufen über eine Stelle (`record`), egal ob Quiz, 3D-Folge oder Kajütenfunk. Das ist die wichtigste Voraussetzung für ein gemeinsames Lernmodell, und sie ist schon da.
- **3D-Physik fachlich plausibel:** Gelenkt wird über die Schubrichtung des Außenborders (ohne Schub kaum Wirkung). Der Radeffekt hat die richtige Richtung für eine rechtsdrehende Schraube: rückwärts geht das Heck nach Backbord (`welt.js:731`). Dazu kommen Verdrängerbuckel und Gleitfahrt, Wind mit stärkerer Wirkung bei langsamer Fahrt und Lichter nach Sektor.
- **Motorstart als echter Ablauf** mit Fehlerfolgen, wie es die Fragen 42 und 57 verlangen.
- **Seekarte 7:** Die Lösungen rechnet die App aus geeichten Kartendaten, ein Werkzeug prüft alle Aufgaben. Das ist robuster als jede Liste von Hand.
- **Manöverspiel nach dem amtlichen Praxisprotokoll** (Anlage 4 SpFV): Ablegen, Anlegen, Mensch über Bord, Kompasskurs, Aufstoppen, Wenden, je mit Prüfpunkten.
- **Daten statt Code:** Folgen sind Drehbücher in JSON. Ein Autor braucht kein Programmieren.
- **Kostenmodell:** keine Live-KI, jeder Satz wird einmal eingesprochen.

### 1.3 Was konzeptionell stark ist
- **Freigaben** als Bindeglied zwischen Geschichte und Können („Du fasst nix an, was ich nicht freigegeben hab“). Das ist die beste Idee im Projekt, sie ist nur noch nicht richtig umgesetzt.
- **Scheinwahl mit lehrreichem Vorwand** und **Bauchregeln, die nie stehen bleiben.** Beides erzeugt Denken statt Zuhören.
- **„Vorher gehört, dann erlebt, abends gefragt“** entspricht dem, was die Lernforschung empfiehlt: abrufen statt wiederlesen, verteilen statt ballen, Praxis mit Rückmeldung.
- **Starter-Set:** echtes Tau, Modellboot, Kursdreieck und Zirkel. Das hat kaum eine Lern-App.
- **Kein Zeitdruck, keine Streaks, keine Bestrafung von Pausen.** Für Erwachsene, die neben dem Beruf lernen, ist das richtig.

### 1.4 Was didaktisch schwach ist (mit Beleg)

1. **Freigaben messen Anwesenheit, nicht Können.**
   - `freigabeSetzen(id, ok)` zählt bei jedem Aufruf ohne `ok: false` hoch (`index.html:4954`).
   - In den Folgen steht `{freigabe: 'steuern'}` einfach nach der Selbst-Aufgabe (Folge 11, Schritt 42). Er zählt auch, wenn Hinnerk übernommen hat, die Zeit abgelaufen ist oder man im Modus 🎧 Auto nur zugesehen hat.
   - Damit gilt nicht, was Briefing und Gesamtplan versprechen („zweimal hintereinander richtig“, „Freigaben nur durch eigenes Tun“).
2. **Selbst-Aufgaben in 3D werden nicht bewertet.**
   - `selbst()` kennt nur „Ziel erreicht“, „Knopf Hinnerk übernimmt“ oder „Zeit um“ (`welt-folge.js:68–100`). Das Ergebnis wird nicht gespeichert.
   - Nicht gezählt werden: Zusammenstöße, falsche Seite an einer Tonne, zu schnell im Hafen, Anlegen mit Rempler. Die Welt erkennt das alles schon (Kollisionen, Tore, Tempo-Hinweis), es fließt nur nirgends hin.
3. **Verständnis wird nirgends erfasst.**
   - Situationsfragen in den Folgen („Wohin weichst du aus?“, „Wo an der Westtonne vorbei?“) haben richtig und falsch. Gespeichert wird aber nichts.
   - Genau diese Fragen wären der Nachweis für Verständnis und Übertragung.
4. **Die Wiederholung hört zu früh auf.**
   - `isDue` schließt Fach 5 aus: `s.b < 5` (`index.html:2245`). Eine Frage, die viermal hintereinander richtig war, kommt in der normalen Wiederholung **nie wieder**.
   - Der längste genutzte Abstand ist 7 Tage (`INT = [0,1,2,4,7,14]`, die 14 wird nie erreicht).
   - „Dunkelgrün = fest verankert“ kann man an zwei aufeinanderfolgenden Tagen erreichen. Das zeigt Sicherheit an, die nach Forschungslage noch nicht da ist (Vergessenskurve). Bei sechs Wochen Kurs fällt das genau in der Woche vor der Prüfung auf.
5. **Verwechslungsgefahr wird nicht gezielt geübt.**
   - Die Fragen werden zufällig gemischt. Lichter, Schallsignale, Kardinalzeichen und Tafelzeichen werden in der Prüfung aber vor allem verwechselt.
   - Gemischtes Üben ähnlicher Dinge („Interleaving“) gibt es nur nebenbei in den „Prüfungsfallen“.
6. **Prüfungssimulation unvollständig.**
   - Die Probeprüfung hat nur die 30 Fragen. Zur echten Theorieprüfung SBF See gehört nach den Sekundärquellen auch eine Navigationsaufgabe mit 9 Teilfragen ([Uni Ulm Kursinfo](https://www.uni-ulm.de/fileadmin/website_uni_ulm/uscu/PDF/Lehre/SBF/1_SBF-Kursinfo_WS2025.pdf), [Nautigo](https://nautigo.org/wp-content/uploads/2023/03/01-See-Pruefung.pdf)). ⚠ zu prüfen: Bestehensgrenzen am Original.
   - Die Kartenaufgabe gibt es nur in der alten Navigationsschule auf der Karte „Kliev“.
7. **Praxisprüfung nur halb in 3D.**
   - Von den sechs Prüfungsmanövern gibt es in 3D nur Ablegen und Anlegen.
   - Mensch über Bord, Kompasskurs, Aufstoppen und Wenden auf engem Raum gibt es nur im 2D-Manöverspiel, mit anderer Physik.
8. **Verhältnis Reden zu Handeln.**
   - Folge 7: 59 Sätze, 3 Fahraufgaben, 5 Wahlen.
   - Folge 1: 60 Sätze, keine Fahraufgabe (8 Antipp-Punkte).
   - Folge 3: 21 Sätze, 8 amtliche Fragen hintereinander.
   - In Minuten ist das noch vertretbar. Das Muster ist aber „erklären, dann eine Aufgabe“, selten „probier, scheiter, verstehe“.
9. **Lernen in neuen Lagen fehlt.** Jede Fahraufgabe kommt genau einmal, immer bei gleichem Wetter und ohne Strom. Übertragung („Kannst du es auch bei Seitenwind?“) wird nicht geübt.

### 1.5 Technische Probleme
1. **Drei Pläne gleichzeitig:**
   - `data/reise-plan.json`: 63 Tage, acht Akte, wird im pre-commit geprüft.
   - `docs/gesamtplan.md`: 53 Tage, nur Text, ohne Datei und ohne Prüfung.
   - `podcast/kursplan-sbf.json`: Kajütenfunk, eigene Folgen, wird ebenfalls geprüft.
   - Das Prüfwerkzeug prüft also einen Plan, der nicht mehr gilt, und der gültige wird nicht geprüft.
2. **Mehrere Systeme für dasselbe:**
   - Fahrten: `reise.js` (2D), `toern.js` (100 KB, alter Törn), `welt.js` (3D).
   - Navigation: `navi.js` (Kliev) und `navi7.js` (Seekarte 7).
   - Manöver: Physik in `manoever.js` und in `welt.js`.
3. **Folgen ohne Prüfung und ohne Test:** Ein Tippfehler in `welt-folgen.json` (zum Beispiel ein falscher Wetterwert, ist schon passiert) fällt erst am Handy auf.
4. **Spielstand ohne Versionsnummer:** `load()` repariert alte Stände von Fall zu Fall (`index.html:2174`). Ein Wechsel des Lernmodells (Kompetenzen, neue Wiederholung) braucht eine saubere, nummerierte Umstellung.
5. **Folgen-IDs hängen an Tagesnummern** (`tag07`). Ändert sich die Reihenfolge, stimmen ID, Gedächtnis (`folge:tag07`) und Spielstand nicht mehr zusammen.
6. **`index.html` mit 553 KB** und globalen Objekten. Das ist noch beherrschbar, aber neue Lernlogik sollte nicht mehr dort hinein.

### 1.6 Widersprüche zwischen Dokumentation und Code oder zwischen Dokumenten

| # | Dokument sagt | Code oder anderes Dokument sagt |
|---|---|---|
| W1 | „Freigegeben = zweimal hintereinander richtig“, „nur durch eigenes Tun“ (Briefing, Gesamtplan) | zählt das Erreichen des Schritts, auch im Auto-Modus (`index.html:4954`, Folgen) |
| W2 | „Keine Uhr entscheidet für dich“ (E21) | Selbst-Aufgaben: Nach 300 s übernimmt Hinnerk von selbst, beim Horn nach 45 s (`welt-folge.js:69–90`). O151 schlägt „15 Fragen in drei Minuten“ vor. |
| W3 | Hinnerk „lobt nie direkt“ (Dialog-Regeln) | Standardsätze im Code: „Läuft. Sauber gemacht.“, „Fest! Sauber angelegt.“ (`welt-folge.js:83, 99`) |
| W4 | `CLAUDE.md` §1: „an Bord einer **Segelyacht**“ | Frieda ist ein Motorboot; SBF See ist ein Motorbootschein (VISION §4) |
| W5 | O141–O146 (Frieda als Wirtin, Oles Logbuch) stehen als offene Empfehlungen | E20: Frieda gestrichen, Story ruht |
| W6 | O148: sechs **feste** Schritte je Ausfahrt | Gesamtplan: „locker, nicht starr“ |
| W7 | O151: Einstufung für alle | Gesamtplan: Kenner-Test nur optional, Standard kein Test |
| W8 | Freigaben-Liste im Gesamtplan: etwa 20 Fertigkeiten mit Stufe „eingerostet“ | Code: 8 Einträge, keine Stufe „eingerostet“ |
| W9 | Hörmodus: „Handlungen holt man am Handy nach“ | Im Auto-Modus fährt Hinnerk, nichts wird als „offen“ vorgemerkt |
| W10 | `CLAUDE.md` §7: „Stand v4.95“, `index.html` „~514 KB“ | v5.21, 553 KB |
| W11 | Briefing: Probeprüfung wie die echte | ohne Navigationsteil |

### 1.7 Fachliche Prüfung der vorhandenen Texte
Geprüft habe ich alle Sätze der Folgen 1, 3, 7, 11, 15 und alle 16 Crew-Gespräche, die eine Regel enthalten.

**Richtig:**
- In Fahrt = weder vor Anker noch festgemacht noch auf Grund.
- Entgegenkommende Maschinenfahrzeuge weichen beide nach Steuerbord aus.
- Rot an Backbord beim Einlaufen; auslaufend liegt Grün links.
- Kardinalzeichen: Lage und Topzeichen.
- Einzelgefahrenstelle: rundherum befahrbar.
- Allgemeines Gefahr- und Warnsignal: lang und viermal kurz, wiederholt.
- Abstand zum Schilf halten.
- Seitenlichter: Backbord rot, Steuerbord grün.
- Pinne nach rechts, Bug nach links.

**Falsch oder gefährlich vereinfacht (vor dem Einsprechen ändern):**
1. **„Westlich vorbei. Immer westlich vorbei.“** (Gespräch `erinn-wrack`, Hinnerk und Klabauter): Das ist falsch verallgemeinert. An welcher Seite man vorbeifährt, hängt davon ab, welches Kardinalzeichen man ansteuert. Ein fester Satz, der oft wiederholt wird, prägt sich genau so falsch ein.
2. **„Wer den anderen rechts von sich hat, muss ausweichen.“** (Folge 7): Das stimmt für zwei Maschinenfahrzeuge mit kreuzenden Kursen auf freiem Wasser (KVR Regel 15). Es gilt nicht gegenüber Seglern, nicht für Fahrzeuge, die dem Fahrwasser folgen (SeeSchStrO), und nicht beim Überholen. Ohne diesen Rahmen ist es eine gefährliche Faustregel.
3. **Gespräche ohne Ortsbindung:** `erinn-wrack` („Da drüben liegt das Wrack“) und `erinn-ankern` („Hier wollt Jasper ankern“) können auf jeder Fahrt kommen, auch im Hafen. Das ist inhaltlich falsch und verwirrt.

**⚠ zu prüfen am Original:**
- Ankerverbot „rund um Wracks“ (Folge 15) gegen die Fragen 171 und 172.
- Die Scheinwahl „Durchs Fahrwasser oder außen an der grünen Tonne“ (Folge 7) gegen die Regeln, wann Sportboote außerhalb des Fahrwassers fahren sollen. Die „falsche“ Wahl darf keine richtige Regel als falsch hinstellen.
- „Westen mindestens alle zwei Jahre warten“: Das ist eine übliche Herstellerangabe und eine Empfehlung, keine Prüfungsregel. So sollte es auch gesagt werden.

**Vereinfachungen der Simulation, die man kennzeichnen muss:**
- kein Strom und keine Gezeiten
- Wind wirkt gleichmäßig, ohne Böen und Landabdeckung
- das andere Schiff hält keine Regeln
- das Anlegen zählt in einem Rechteck, ohne Leinenarbeit
- Gleitfahrt und Geschwindigkeiten sind ungefähr
- keine Trägheit durch Beladung

### 1.8 Entscheidungen, die später teuer werden
1. **Weitere Folgen schreiben und einsprechen, bevor das Lernmodell steht.** Jede Folge müsste danach umgebaut und neu vertont werden, und Vertonung kostet Credits.
2. **Kein zentrales Kompetenzmodell im Spielstand.** Wer heute 20 Fertigkeiten als Freigaben anlegt und später auf Kompetenzen mit drei Dimensionen umstellt, braucht eine Umstellung für alle Spielstände.
3. **3D-Revier und Seekarte 7 laufen auseinander.** Lernt man Tonnen in 3D und plant auf der Karte, müssen beide dieselbe Welt zeigen. Jede neue Folge in der erfundenen 3D-Welt macht die spätere Angleichung teurer.
4. **Zwei Manöver-Physiken.** Jede neue Manöveraufgabe muss sonst zweimal gebaut und abgestimmt werden.
5. **Tagesnummern als IDs** (siehe 1.5).

---

## 2. Grundsatzentscheidungen, bewertet

| Nr. | Entscheidung heute | Bewertung | Begründung |
|---|---|---|---|
| G1 | Keine Live-KI, alles vorgeschrieben und eingesprochen | **Beibehalten** | Kosten, Kontrolle, fachliche Richtigkeit |
| G2 | Kein Zeitdruck, keine Uhr | **Beibehalten, konsequent machen** | Die versteckten 300 s und 45 s entfernen; Hilfe nur auf Wunsch (Knopf) oder nach Fehlversuchen, nie nach Zeit (W2) |
| G3 | Geschichte „Smilla geht, du übernimmst“ | **Beibehalten** | Ein schlanker, motivierender Rahmen mit eingebautem Ziel (Prüfungstermin). Die Forschung warnt vor zu viel Geschichte; diese ist knapp genug. |
| G4 | 53 Tage zu 30 Minuten als Ablauf | **Ändern** | Als Rahmen gut, als Einheit zu groß. Besser: Einheiten von 10–15 min, 2–3 bilden eine Ausfahrt. Erzählung, Lernstand und Kompetenz laufen getrennt (3.3). |
| G5 | Sechs feste Schritte je Ausfahrt (O148) | **Abschaffen als Pflicht** | Als Baukasten behalten. Eine Knotenstation braucht andere Schritte als ein Ausweichmanöver. |
| G6 | Freigaben „Was ich an Bord darf“ | **Verbessern** | Die Idee behalten, als sichtbare Seite des Kompetenzmodells. Gezählt wird nur nach gemessenem Erfolg, „eingerostet“ kommt dazu. |
| G7 | Freigabe nach zweimal richtig | **Ändern** | Kriterium je Kompetenz, mit verzögertem zweitem Nachweis (3.2) |
| G8 | Lernstand je Frage mit Farben und Lernkartei | **Verbessern** | Fehler in Fach 5 sofort beheben, längere Abstände, Farbe aus der Behaltenswahrscheinlichkeit. FSRS erst prüfen, wenn das einfache Modell nicht reicht. |
| G9 | Abends die amtlichen Fragen zum Erlebten | **Beibehalten** | Abruf kurz nach dem Erleben ist gut. Dazu kommt Wiederholung in späteren Folgen und in anderer Lage. |
| G10 | Fahrten und Manöver in 3D, Gespräche in der 2D-Kajüte (E22) | **Beibehalten, verbinden** | Die Kajüte wird sichtbar zum Innenraum derselben Frieda (3.8) |
| G11 | Zwei Manöver-Systeme (2D-Spiel und 3D) | **Ändern** | 3D wird das eine Übungsgerät. Die Aufsicht von oben wird eine Kamera der 3D-Welt. Das 2D-Spiel friert ein und entfällt, sobald 3D alle sechs Manöver kann. |
| G12 | Zwei Navigationsschulen (Kliev und Seekarte 7) | **Ändern** | Seekarte 7 bleibt. Die Kliev-Schule entfällt, sobald die Prüfungs-Kartenaufgabe auf Seekarte 7 nachgebaut ist. |
| G13 | 3D-Revier frei erfunden | **Ändern** | Das 3D-Revier wird aus den Kartendaten der Seekarte 7 erzeugt (Q11), mindestens Tonnen und Häfen |
| G14 | Alter Törn (`toern.js`), 2D-Reise (`reise.js`), Reiseplan 63 Tage | **Abschaffen** (in Etappen) | Ersetzt durch 3D-Ausfahrten und den Gesamtplan. Wertvolle Teile (Lichter-Szenen, Ereignisse) vorher übernehmen. |
| G15 | Kajütenfunk als eigene Folgenreihe | **Noch nicht entscheidbar** | Sinnvoll als Hörfassung der Ausfahrten (O154). Hängt am Hörmodus (Frage F5, später). |
| G16 | Crew: Hinnerk, Smilla, Klabauter, Katze, Harms, Gäste | **Beibehalten** | Rollen sind klar getrennt (Hände, Kopf, Gedächtnis, Prüfer). Nur die Dosierung regeln (3.7). |
| G17 | Crew-Regisseur mit Gedächtnis | **Beibehalten, verbessern** | Ortsbindung, inhaltlich prüfen, an Kompetenzen statt nur an Merkmale koppeln |
| G18 | Scheinwahlen etwa zwei je Folge | **Beibehalten, prüfen** | Ein Vorwand darf nie eine richtige Regel als falsch hinstellen (1.7) |
| G19 | Bauchregeln von Hinnerk | **Beibehalten** | Stark für Verständnis. Die Auflösung muss im selben Abschnitt kommen und gemessen werden („Stimmt nicht!“, O120). |
| G20 | Einstufung / Kenner-Test | **Noch nicht entscheidbar** | Erst, wenn das Kompetenzmodell steht. Dann ohne Uhr. |
| G21 | Starter-Set | **Beibehalten, ausbauen** | Jede Übung mit Variante virtuell und echt (3.6) |
| G22 | Folgen als JSON-Drehbuch | **Beibehalten, erweitern** | Schritte melden Messwerte an die Lernlogik, Folgen nennen ihre Lernziele (3.9) |
| G23 | Spielstand in einem Objekt `S` ohne Versionsnummer | **Verbessern** | Versionsnummer und nummerierte Umstellungen, bevor das Lernmodell wechselt |
| G24 | Hörmodus teilweise | **Beibehalten, präzisieren** | Gehört wird Wissen, Handeln bleibt offen und wird sichtbar vorgemerkt (W9) |
| G25 | Karte 49 später | **Beibehalten** | Rechte zuerst (O87) |
| G26 | Binnen als eigene Reise | **Beibehalten** | Erst wenn SBF See als Modell trägt |

---

## 3. Optimiertes Gesamtkonzept

### 3.1 Das Produkt in einem Satz
**Eine virtuelle Motorboot-Ausbildung, in der ein Ausbildungsheft festhält, was du weißt, verstehst und kannst, mit der Crew der Frieda als Ausbildern und der Prüfung als erstem Etappenziel.**

Drei Schichten, klar getrennt:
1. **Fundament: Kompetenzen.** Das Heft listet alles, was ein SBF-See-Absolvent wissen, verstehen und können muss. Jede amtliche Frage, jede Fahraufgabe und jeder Knoten gehört zu einer Kompetenz.
2. **Lernumgebung: Ausfahrten.** In 3D, in der Kajüte, am Kartentisch, mit dem Starter-Set. Hier wird gelernt und gemessen.
3. **Rahmen: Frieda und die Crew.** Sie geben Grund, Gefühl und Reihenfolge, aber nie den Maßstab.

### 3.2 Kompetenzmodell
**Aufbau:** etwa 40–60 Kompetenzen in einer Datei `data/kompetenzen.json`, zum Beispiel:
- K-MOT-01 „Außenborder sicher starten“
- K-MAN-03 „Anlegen längsseits“
- K-SEE-02 „Kardinalzeichen erkennen und richtig passieren“
- K-KVR-02 „Kreuzende Kurse, Maschinenfahrzeuge“
- K-LIC-04 „Lichter manövrierbehinderter Fahrzeuge“
- K-KNO-02 „Palstek“

Jede Kompetenz hat drei Dimensionen, getrennt erfasst:

| Dimension | Woher der Nachweis kommt | Beispiel Motorstart |
|---|---|---|
| **A Wissen** | amtliche Fragen der Kompetenz (bestehendes Fragensystem) | Fragen 42, 49, 50, 52, 54–57 |
| **B Verständnis** | Situationsfragen in neuer Lage, Bauchregel stoppen, „Warum?“-Wahl, Fehler erkennen | „Motor springt nicht an, Choke ist raus, Tank zu. Was zuerst?“; Hinnerk sagt „Choke immer drin lassen“, du stoppst ihn |
| **C Können** | gemessene Aufgabe in 3D (Simulation) und, wo sinnvoll, echt mit dem Starter-Set | Startablauf in 3D ohne Fehler; später bei kaltem Motor oder vergessenem Quickstopp |

**Stufen je Kompetenz** (für die Crew und das Heft, abgeleitet aus den drei Dimensionen):
- **neu:** noch nichts gesehen.
- **gehört:** erklärt bekommen, Wissen angefangen.
- **geübt:** einmal selbst geschafft, eventuell mit Hilfe.
- **freigegeben:** Kriterium erfüllt, darunter ein **verzögerter Nachweis** (frühestens 2 Tage später, möglichst in anderer Lage).
- **sicher:** freigegeben und nach weiteren ≥ 7 Tagen ohne Hilfe bestätigt; Wissen im Mittel sicher.
- **eingerostet:** Behaltenswahrscheinlichkeit gesunken. Die Crew bittet vor dem Ernstfall um eine kurze Wiederholung. Es gibt keine Strafe und keinen Rückschritt in der Geschichte.

**Kriterien je Kompetenz statt einer Regel für alle** (Vorschlag):

| Kompetenzart | Freigabe | Sicher |
|---|---|---|
| Knoten | 2 × richtig (Spiel oder echt), davon 1 an einem anderen Tag | + 1 × nach ≥ 7 Tagen, echt oder unter „Last“ (beim Anlegen) |
| Ablauf (Motorstart, Mayday-Meldung) | 2 × fehlerfrei an verschiedenen Tagen | + 1 × mit Störung (kalter Motor, Quickstopp fehlt) |
| Manöver (Anlegen, Wenden, MOB) | 2 × nach Kriterium (Tempo, Winkel, kein Rempler), an verschiedenen Tagen | + 1 × bei anderer Lage (Seitenwind, später Strom) |
| Erkennen (Tonnen, Lichter, Schall) | Wissen ≥ 80 % sicher + 3 Situationsfragen richtig | + Erkennen in 3D bei Nacht oder Nebel |
| Regeln anwenden (Ausweichen) | Wissen + 2 Begegnungen richtig entschieden und gefahren | + 1 Begegnung in neuer Konstellation |
| Rechnen (Navigation) | 2 Aufgaben richtig, je Stufe | + 1 Aufgabe gemischt mit anderen Stufen |

So bekommt jede Fertigkeit ihre passende Zahl an Wiederholungen, und keine gilt nach einem einzigen Glückstreffer als sicher.

### 3.3 Drei Fortschritte, unabhängig voneinander
| Fortschritt | Was er zeigt | Darf er blockieren? |
|---|---|---|
| **Erzählung** (Kapitel, Ausfahrten) | Wo du auf der Reise bist | Nein. Fehlt eine Voraussetzung, bietet die Crew eine Übungseinheit an („Erst nochmal am Steg?“). Du darfst trotzdem weiter, dann fährt Hinnerk diese Stelle. |
| **Lernstand** (Wiederholung) | Was heute fällig ist | Nein, er schlägt nur vor („Wachübergabe“, 5 min) |
| **Kompetenz** (Ausbildungsheft) | Was du kannst | Nur echte Verantwortung: Was nicht freigegeben ist, macht die Crew. Das ist die Freigabe-Logik, kein Schloss. |

**Lernpausen:**
- Nach längerer Pause gibt es eine Rückblende von 20 Sekunden („Was bisher geschah“) und eine kurze Wachübergabe.
- Rostiges wird als „eingerostet“ angezeigt.
- Nichts geht verloren, nichts wird bestraft.

### 3.4 Wiederholungssystem
1. **Sofort:** Fach 5 bleibt fällig (Fehler beheben). Abstände 1, 3, 7, 16, 35 Tage statt 1, 2, 4, 7, 14.
2. **Prüfungstermin einbeziehen:** Liegt die nächste Wiederholung nach dem Termin, wird sie davor gezogen (spätestens 3–5 Tage vor der Prüfung).
3. **Farbe aus Behaltenswahrscheinlichkeit** statt nur Serie. „Dunkelgrün“ erst nach einem richtigen Abruf mit ≥ 7 Tagen Abstand.
4. **Verwechslungsgruppen** (Lichter, Schallsignale, Kardinal- und Lateralzeichen, Tafelzeichen, Flaggen und Signalkörper): Fällige Fragen einer Gruppe kommen gemischt mit ihren „Nachbarn“. Dazu kommen Kontrastkarten („Was ist der Unterschied?“).
5. **Neue Kontexte zählen:** Eine amtliche Frage, die in 3D bei Nacht kommt, zählt wie eine Wiederholung. Die Situationsfrage dazu zählt in Dimension B.
6. **FSRS** ([open-spaced-repetition](https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler), offen, auch in JavaScript, in Anki eingebaut) ist die beste bekannte Lösung. Ich empfehle sie aber erst als zweiten Schritt: Bei 285 Fragen und wenigen Wochen bringt die reparierte Lernkartei mit Prüfungstermin den größten Teil des Nutzens. FSRS lohnt, sobald genug Daten da sind, um die Parameter zu schätzen.

### 3.5 Ausbildungsstruktur
- **Einheit** (10–15 min) ist der kleinste Baustein, eine **Ausfahrt** hat 2–3 Einheiten mit Haltepunkten dazwischen (gibt es schon: `halt`).
- **Dramaturgie-Bausteine statt fester Schritte:**
  - Briefing
  - Erklären (mit Bild oder Animation)
  - Vormachen
  - Selbst machen (gemessen)
  - Störung (neue Lage)
  - Situationsfrage
  - Abendfragen
  - Logbuch
  - Plaudern
- **Jede Ausfahrt nennt ihre Lernziele (Kompetenzen) und ihre Fragen.** Ein Prüfwerkzeug sorgt dafür, dass der Plan als Ganzes stimmt (3.9).
- **Vorlagen je Ausfahrtart** (Beispiele):
  - **Übungstag im Hafen:** Briefing, Vormachen, Selbst ×3 mit steigender Schwierigkeit, Freigabe-Rückmeldung.
  - **Fahrtag:** Planung am Kartentisch, Fahrt mit 2–3 Lagen (Tonne, Begegnung), Wiederholung einer alten Kompetenz unterwegs, Abendfragen.
  - **Schietwettertag:** kurzer Anlass, Wissensblock mit Situationsfragen, Kontrastkarten, eine Knotenstation mit Starter-Set.
  - **Sonderfahrt:** nur freigegebene Kompetenzen, eine Überraschung, ausführliche Nachbesprechung.
- **Wiederholung eingebaut:** Jede Ausfahrt enthält mindestens eine Aufgabe aus einer früheren Kompetenz, die gerade fällig ist (vom Lernstand ausgewählt, nicht fest im Drehbuch).

### 3.6 Praktische Ausbildung in 3D
**Grundsatz:** Jede Simulation hat ein Blatt mit sechs Feldern. Beispiel Anlegen:

| Feld | Anlegen längsseits |
|---|---|
| Lernziel | langsam, im flachen Winkel, mit Aufstoppen rückwärts parallel an den Steg |
| Entscheidungen | Anfahrtswinkel, Gas, wann aufstoppen, von welcher Seite bei Wind |
| Fehler | zu schnell, zu steil, Rempler, zu weit weg, Leine nicht übergeben |
| Konsequenz | Rempler mit Ton und Vibration, Hafenmeisterin schaut; zu weit weg: Leine fällt ins Wasser |
| Feedback | sofort ein Satz zum Warum, danach eine Bahnkurve von oben mit dem eigenen Weg und der Idealbahn |
| Messung | Höchsttempo in den letzten 10 m, Winkel, Abstand, Stoßkraft, Hilfe genutzt ja/nein |

**Was in 3D gebaut werden sollte** (nach Nutzen sortiert):
1. **Manöverbecken** im Hafen: alle sechs Prüfungsmanöver (Ablegen, Anlegen, Mensch über Bord, Kompasskurs, Aufstoppen, Wenden auf engem Raum) mit den Prüfpunkten aus `data/manoever.json` als Messung. Ersetzt das 2D-Spiel; die Aufsicht von oben wird eine Kamera.
2. **Begegnungen nach Regeln:**
   - Ein zweites Fahrzeug fährt nach KVR und SeeSchStrO, ausgelöst aus dem Drehbuch: entgegenkommend, kreuzend, überholend, Segler, Fahrwasser.
   - Gemessen werden Entscheidung (Seite, Zeitpunkt), Ausführung (deutliche Kursänderung, Abstand im nächsten Punkt) und „Peilung steht?“.
3. **Wind, später Strom.** Strom ist für Elbe und Watt der wichtigste fehlende Einfluss (Anlegen gegen den Strom, Versatz). Die Physik ist einfach: Strom ist ein Wasserfeld, das das Boot mitnimmt.
4. **Nacht und Nebel als Erkennen:** Lichter anderer Fahrzeuge in 3D bestimmen, bevor die amtliche Frage kommt; Schallsignale im Nebel hören und deuten.
5. **Fahrwasser und Betonnung:** gibt es schon; zusätzlich messen (Tor richtig passiert, falsche Seite einer Kardinaltonne).

**Was nicht in 3D gehört:** Gasanlage, Recht, Wetterkarte, Veröffentlichungen. Dafür sind Kajüte, Bild und Situationsfrage besser und billiger.

**Ehrlichkeit:**
- Jede Simulation hat eine Karte „Was hier vereinfacht ist“.
- Die Crew sagt einmal klar: „Das hier ersetzt keine Stunde am echten Ruder.“ (VISION Grundsatz 6)

### 3.7 Starter-Set
Jede passende Übung hat zwei Wege:

| Übung | Virtuell | Echt mit Set | Was die App tut |
|---|---|---|---|
| Knoten | Spiel „Was passiert hier?“, Animation | am Seil, Klampe, Ring | Animation im Schritttempo, „Hält er? Ehrlich.“, zählt in C (echt) |
| Anlegen und Leinen | 3D | Modellboot, Leinen an der Klampe | „Leg dein Modell so hin“: Bild zum Vergleichen, Selbstprüfung mit drei Punkten |
| Navigation | Seekarte 7 in der App | Kursdreieck und Zirkel auf gedruckter Karte 7 (oder später Karte 49) | Aufgabe nennt die Zahlen, du rechnest und tippst das Ergebnis ein, die App prüft |
| Lichter | 3D-Nacht | Lichterkarten im Set (Vorschlag) | Quiz mit der Karte vor der Kamera ist zu aufwendig; Karten nur als Lernmittel |

Echte Übungen zählen in Dimension C als eigener Nachweis („echt“). Sie ersetzen den virtuellen Nachweis nicht und werden von ihm nicht ersetzt. Ehrliche Selbsteinschätzung ist das Mittel; Fotoerkennung lohnt nicht.

### 3.8 Figuren und Dosierung
Die Crew ist gut zusammengesetzt. Jede Figur hat eine Lehrrolle:
- **Hinnerk:** Hände, Gefühl, Freigaben.
- **Smilla:** Kopf, Regel, Warum.
- **Klabauter:** Merksatz, Warnruf.
- **Harms:** Prüfung.
- **Katze:** Störung.

**Regeln für die Dosierung** (prüfbar im Werkzeug):
- **Erklären** nur bei „neu“ und „gehört“. Bei „freigegeben“ kommt nur noch ein Satz, bei „sicher“ nichts.
- **Begleiten:** Während einer Selbst-Aufgabe höchstens ein Satz je 20 Sekunden, nur als Reaktion auf etwas (Tempo, Tonne, Fehler).
- **Schweigen:** in den ersten 10 Sekunden einer Selbst-Aufgabe und beim Überlegen einer Entscheidung.
- **Klabauter** höchstens dreimal je Einheit, nie in einer Erklärung.
- **Hinnerk lobt nie direkt;** Lob kommt über die Freigabe („Kannst du ab jetzt.“) und über Smilla.
- **Beziehung:** Anreden wachsen (gibt es), die Crew erinnert sich an Erlebtes (gibt es) und an Fortschritte („Vorige Woche hast du noch gezittert“). Am Ende sagt Hinnerk zum ersten Mal „Skipper“.

### 3.9 2D und 3D: ein Boot
- Die Kajüte ist der Innenraum der 3D-Frieda: Kamera fährt durch den Niedergang hinunter, dann erscheint die gezeichnete Kajüte.
- Durchs Bullauge sieht man den aktuellen Ort und das Wetter der 3D-Welt.
- Gleiche Farben (Rumpf weiß, roter Streifen, Q3), gleiche Gegenstände (Westen im Niedergang, Gaskasten an Steuerbord), in beiden Welten an derselben Stelle.
- Grafik bleibt schlicht. Wichtig sind Orientierung (Karte oben rechts, Norden oben, Ziel sichtbar) und klare Rückmeldung.

### 3.10 Technische Architektur
**Kein Komplettumbau.** Vier Ergänzungen:
1. **`data/kompetenzen.json`**: zentrale Liste. Je Kompetenz gibt es Fragen, Situationsfragen, Aufgaben, Kriterien und Vorwissen.
2. **`lern.js`** (neu, nachgeladen): Lernlogik an einer Stelle: Wiederholung, Kompetenzstand, Freigaben, „eingerostet“. Folgen, 3D, Knoten und Karte melden nur Messwerte: `LERN.melde({k: 'K-MAN-03', dim: 'C', ok, werte})`.
3. **Drehbuch meldet und nennt Ziele:**
   - `selbst`, `wahl` und `punkte` liefern ein Ergebnis an `LERN`.
   - `freigabe` wird ein Ergebnis von `LERN` statt eines Schritts.
   - Jede Folge bekommt einen Kopf mit `ziele`, `fragen`, `braucht` und einer stabilen `id` (nicht `tag07`, sondern zum Beispiel `elbe-erste-fahrt`).
4. **Spielstand mit Version:** `S.v = 6` plus eine Liste nummerierter Umstellungen. Die alten Freigaben werden in Kompetenzen übernommen, die alten Lernkartei-Stände bleiben gültig.

**Prüfwerkzeug `tools/folgen-pruefen.js`** (läuft im pre-commit). Es prüft:
- **Lernziele:** Jede Folge nennt Kompetenzen, jede Kompetenz hat Wissen, Verständnis und Können.
- **Einführung:** Jedes `selbst` hat vorher eine Erklärung oder steht auf einer Kompetenz, die mindestens „gehört“ ist (Vorwissen über die Folgen-Reihenfolge).
- **Fragen:** Alle 285 kommen vor, jede abends nach ihrer Einführung.
- **Wiederholung:** Jede Ausfahrt ab Kapitel 1 enthält mindestens eine ältere Kompetenz.
- **Rückmeldungen:** Jede Wahl mit `ok` hat `info` für jede Antwort.
- **Feste Sätze:** Kein Satz mit verbotenen Mustern (zum Beispiel „immer westlich“, direkte Lobwörter von Hinnerk), keine Ziffern in Sprechtext.
- **Daten:** Wetter-, Orts- und Gastwerte sind gültig.
- **Dosierung:** Sätze je Einheit, Klabauter-Einwürfe.

**Tests:** Jede 3D-Folge einmal im Auto-Modus in Playwright (gibt es als Handtest schon), dazu ein Spielstand der Version 5 laden und umstellen.

---

## 4. Roadmap

| Phase | Inhalt | Aufwand | Nutzen | Risiko | Hängt ab von |
|---|---|---|---|---|---|
| **0 Entscheiden** | Fragen F1–F4 (Abschnitt 5), danach F5–F8 | klein (deine Zeit) | sehr hoch | – | – |
| **1 Sofort reparieren** | Fach 5 wieder fällig, längere Abstände · Freigabe nur nach Erfolg, nie im Auto-Modus · Zeit-Übernahme raus (Knopf und Fehlversuche bleiben) · „Immer westlich vorbei“ und die Ausweichregel berichtigen, Gespräche an Orte binden · Hinnerks Standardlob ändern · `CLAUDE.md` „Segelyacht“ und Stand berichtigen · Prüfwerkzeug für `welt-folgen.json` (Daten) | 1–2 Läufe | hoch | gering | – (Fach 5 und Fachfehler auch ohne F1 sinnvoll) |
| **2 Fundament** | `kompetenzen.json` (SBF See vollständig), `lern.js`, Spielstand-Version, Ausbildungsheft als Seite, Drehbuch meldet Ergebnisse, Folgen-Prüfwerkzeug, 3D-Folgen im Rauchtest | 4–6 Läufe | sehr hoch | mittel (Umstellung alter Stände) | F1, F2, F3 |
| **3 Simulation** | Messung für alle Selbst-Aufgaben · Manöverbecken mit allen sechs Prüfungsmanövern · Begegnungen nach Regeln · Strom · 3D-Revier aus Seekarte 7 | 6–10 Läufe | sehr hoch | mittel (Physik-Abstimmung, Handyleistung) | F4, Phase 2 |
| **4 Prototyp-Kapitel** | Kapitel 0 und 1 (etwa 8 Ausfahrten) neu nach Konzept, mit Situationsfragen, Störungen, Starter-Set-Varianten; **Test mit 3–5 echten Lernenden** (Beobachtung, Lernstand nach 1 und 2 Wochen) | 4–6 Läufe + Testzeit | entscheidend | hoch, wenn übersprungen | Phase 2, Teile von 3 |
| **5 Aufräumen** | `toern.js`, `reise.js`, Reiseplan 63 Tage, Kliev-Schule, 2D-Manöverspiel stilllegen (vorher Gutes übernehmen) | 2–3 Läufe | mittel (Wartbarkeit) | gering | Phase 3 |
| **6 Ausbau** | restliche Kapitel · Probeprüfung mit Kartenteil auf Seekarte 7 · Hörmodus und Kajütenfunk als Hörfassung · Einstufung · FSRS · Vertonung · Karte 49 · Binnen | groß | hoch | Credits, Rechte | Phase 4 bestanden |

**Was ich bewusst nach hinten stelle:** neue Folgen schreiben, Vertonung, schönere Grafik, Wimmelwelt, Steuerrad-Upgrade, Binnen.

---

## 5. Rückfragen, Etappe 1 (Grundsatz)

**F1 Was ist das Rückgrat?**
- **Problem:** Heute sind die Folgen das Rückgrat, Freigaben und Fragen hängen daran. Damit misst die App, wie weit du in der Geschichte bist, nicht was du kannst.
- **Möglichkeiten:**
  - **(a)** Das Ausbildungsheft mit Kompetenzen wird das Rückgrat; Folgen sind Lernumgebungen, die Kompetenzen bedienen.
  - **(b)** Folgen bleiben Rückgrat, Kompetenzen nur als Anzeige.
- **★ Empfehlung: (a).**
- **Folge:** Phase 2 wird nötig, bevor neue Folgen entstehen. Bestehende Folgen bleiben spielbar und bekommen Ziele nachgetragen.

**F2 Wann gilt etwas als „sicher“?**
- **Problem:** „Zweimal hintereinander“ erzeugt falsche Sicherheit, aber zu strenge Regeln frustrieren.
- **Möglichkeiten:**
  - **(a)** Drei Dimensionen mit Kriterien je Kompetenzart und verzögertem Nachweis (Tabelle 3.2).
  - **(b)** Nur Können zählt für Freigaben, Wissen bleibt getrennt.
  - **(c)** Wie heute, zweimal richtig.
- **★ Empfehlung: (a).**
- **Folge:** etwas mehr Wiederholung je Fertigkeit. Die Geschichte blockiert nie, die Crew übernimmt nur, was nicht freigegeben ist.

**F3 Wiederholungssystem**
- **Problem:** Heute endet die Wiederholung nach vier richtigen Antworten (Fehler).
- **Möglichkeiten:**
  - **(a)** Lernkartei reparieren, längere Abstände, Prüfungstermin einbeziehen, Verwechslungsgruppen; FSRS später.
  - **(b)** FSRS sofort.
- **★ Empfehlung: (a).**
- **Folge:** Phase 1 behebt den Fehler sofort. FSRS bleibt offen, ohne dass man sich jetzt festlegt.

**F4 Ein Simulator für die Praxis**
- **Problem:** Zwei Manöver-Physiken (2D-Spiel und 3D).
- **Möglichkeiten:**
  - **(a)** 3D wird das einzige Übungsgerät, die Aufsicht von oben eine Kamera; das 2D-Spiel friert ein und fällt weg, sobald 3D alle sechs Manöver kann.
  - **(b)** Beide behalten (2D für schnelle Übung).
- **★ Empfehlung: (a).**
- **Folge:** Phase 3 baut Mensch über Bord, Kompasskurs, Aufstoppen und Wenden in 3D. Bis dahin bleibt das 2D-Spiel unverändert.

**Danach (Etappe 2, nach deiner Antwort):**
- F5 Hörmodus und Kajütenfunk
- F6 Länge einer Einheit und Aufbau einer Ausfahrt
- F7 3D-Revier aus der Seekarte 7
- F8 Test mit echten Lernenden: wer, wann, wie

---

## Quellen
- **Code und Daten dieses Repos**, Stand v5.21 (Zeilenangaben oben).
- **Prüfungsaufbau** (Sekundärquellen, ⚠ am Original zu prüfen):
  - [Uni Ulm, SBF-Kursinfo WS2025](https://www.uni-ulm.de/fileadmin/website_uni_ulm/uscu/PDF/Lehre/SBF/1_SBF-Kursinfo_WS2025.pdf)
  - [Nautigo, SBF See Prüfung](https://nautigo.org/wp-content/uploads/2023/03/01-See-Pruefung.pdf)
  - [Nautigo, Praxisprotokoll](https://nautigo.org/wp-content/uploads/2023/06/Praxisprotokoll-SBF-Pruefung.pdf)
  - [Bootsschule1, Knoten für den SBF](https://bootsschule1.de/blog/10-knoten-fuer-den-sportbootfuehrerschein-see-und-binnen/)
  - Amtlich: [Anlage 4 SpFV](https://www.gesetze-im-internet.de/spfv/anlage_4.html) (aus der Sitzung gesperrt)
- **Wiederholung:**
  - [FSRS, open-spaced-repetition](https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler)
  - [Open Spaced Repetition](https://github.com/open-spaced-repetition)
- **Lernforschung** (aus Fachwissen, für dieses Gutachten nicht neu recherchiert):
  - Abrufen statt Wiederlesen: Roediger und Karpicke, 2006
  - Verteiltes Lernen: Cepeda und andere, 2006 und 2008
  - Gemischtes Üben ähnlicher Dinge: Rohrer und Taylor, 2007
  - Erwünschte Erschwernisse: Bjork
  - Vorgerechnete Beispiele und Expertise-Umkehr: Sweller; Kalyuga, 2003
  - Bereits im Repo: `docs/recherche-kajuetenfunk.md`, VISION §5
