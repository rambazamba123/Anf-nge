# Skipper – Projekt-Brief für Claude Code (Version 3)

> **Der Code ist die Wahrheit.** Wenn dieser Brief und der Code sich widersprechen, gilt der Code. Den Widerspruch nennst du im Bericht. Abschnitt 4 (Code-Karte) und Abschnitt 8 (Status) hältst du selbst aktuell, und zwar am Ende jedes Laufs. Einen Neustart nach einem Abbruch beginnst du immer mit Abschnitt 8.

## 1. Worum es geht
„Skipper“ ist eine Lern-App für Bootsführerscheine:
- SBF See (fertig)
- SKS (Katalog drin)
- SBF Binnen (fehlt)
- später Funk (SRC/UBI) und Pyrotechnik (FKN)

Man lernt an Bord einer Segelyacht. Die Crew besteht aus Käpt'n, Matrose oder Matrosin und Bordtier, geprüft wird von Kapitän Harms.

Die App läuft als Web-App auf GitHub Pages. Hauptgerät ist Android mit Chrome im Hochformat, langfristig sollen alle Plattformen laufen. Im Moment nutze nur ich die App, später testen Freunde. Einen Prüfungstermin gibt es nicht: Es geht um die App selbst.

**Wann ist die App fertig?**
- Erkunden wie bei Moorhuhn: ein langes Boot, das man waagerecht wischt.
- Viele versteckte Easter-Eggs.
- Unter Deck im Schnitt.
- Ein vollständiges Lexikon mit Originalgrafiken.
- Eine Navigationsschule, in der man Navigation wirklich lernt.
- Ein digitaler Törn.
- Trophäen und Scoring für alle Spiele.
- Texte und Audios werden gespeichert, damit kaum Tokens oder Credits verbraucht werden.

## 2. Arbeitsregeln
- **Antworten:** kurz, auf Deutsch, laienverständlich. Ich bin GitHub-Anfänger.
- **Ehrlichkeit:** Nichts erfinden, Unsicherheit offen sagen. Sag mir, wenn ich etwas übersehe.
- **Selbstständig arbeiten:**
  - Einen ganzen Lauf (Abschnitt 7) am Stück abarbeiten, ohne zwischendurch auf mein OK zu warten.
  - Kleine Unklarheiten selbst sinnvoll entscheiden und im Bericht nennen.
  - Nur stoppen bei echten Grundsatzfragen, bei Fehlern, die du nicht lösen kannst, oder an einem Haltepunkt.
- **Pro Etappe:**
  - gezielt editieren, nie ganze Dateien neu schreiben
  - testen
  - `__ver` und die Version in `sw.js` hochzählen
  - lokal committen
  - in Abschnitt 8 abhaken
- **Testen:**
  - Lokaler Server: Den vorhandenen Ersatz-Server nutzen, Python fehlt auf diesem Rechner.
  - Hochformat 400×860, Konsole ohne Fehler, alte Spielstände laden ohne Fehler.
  - Wenn möglich mit Screenshots.
- **Spielstände nie brechen:** Speicher-Key `skipper-sbfsee-v1`, interne IDs bleiben (z. B. `kroeger` für Kapitän Harms). Neue Felder bekommen immer einen Standardwert.
- **Prüfungsinhalte:** nur aus den amtlichen Katalogen in `quellen/`. Fachlich muss alles korrekt sein.
- **Schlüssel:** Anthropic- und ElevenLabs-Key nie ins Repo schreiben und nie ausgeben.
- **`quellen/`:** Der Ordner ist in `.gitignore` und wird nie hochgeladen. Die BSH-Übungskarte 49 (`quellen/0381510_h1_FS19ix.webp`) trägt den Vermerk „Alle Rechte vorbehalten“. Sie dient nur als Vorlage für Maßstab, Aufgabentypen und Symbolik. Nichts davon abpausen und nichts in die App übernehmen.
- **Stimmen:** Feste Sätze enthalten keine Namen, damit sie ins Stimmenpaket passen. Alles, was sich wiederholt, wird gespeichert und nie neu erzeugt.

## 3. Stil und Ton
- **Grafik:** warm, flach, gezeichnet, im Stil von Pettersson und Findus oder Janosch. Szenen hängen von Tageszeit und Wetter ab.
- **Crew:** witzig, herzlich, plattdeutsch angehaucht. Die Freigabe ist **so, wie sie aktuell im Code steht** (seit v4.8 immer FSK 18). Ändern nur auf meine Anweisung.
- **Rangordnung:** SBF-Lernende werden liebevoll aufgezogen und nicht ganz ernst genommen („Badewannen-Kapitän“). SKS-Lernende bekommen spürbar mehr Respekt.

## 4. Code-Karte
*Am Ende von Lauf 1 neu schreiben, vom echten Stand v4.9+ aus:*
- Dateien und Ordner (`index.html`, `data/`, `img/`, `audio/`, `audio/stimmen/`, `sw.js`, Icons)
- die wichtigsten Funktionen und Objekte je Bereich: Start, Deck, Kajüte, Spiele, Folgen, Stimme, Zeit, Kurse, Einstellungen
- der Aufbau des Spielstands `S`

Ziel: Eine neue Sitzung findet sich ohne langes Suchen zurecht. Höchstens etwa 40 Zeilen.

## 5. Konzepte (verbindlich)

### 5.1 Erster Start: Begrüßung mit Streit
Beim allerersten Start zankt sich die Crew, wo Backbord ist. Dann bemerkt sie dich, stellt sich vor und geht ins Kennenlernen über.

**Fehler:** Die Szene erscheint nicht. Ursache: `boot()` setzt `introV4` sofort, und alte Spielstände haben das Flag schon.

**Lösung:**
- Ein neues Flag einführen und erst am Ende des Intros setzen.
- Die URL `?neustart` setzt die Intro-Flags zurück, zum Testen.
- Die Knöpfe „Kennenlernen neu starten“ und „Alles zurücksetzen“ gibt es schon. Sie müssen das Intro mit Streit sicher auslösen.
- Die neue Begrüßung am Steg und in der Kajüte (seit v4.8) sinnvoll damit verbinden, nichts doppelt abspielen.

### 5.2 Fernglas und Easter-Eggs
- Das Fernglas markiert nur Dinge mit Funktion: Niedergang, Steuer (Törn), Kartentisch, Spielekiste, Hocker.
- Easter-Eggs werden nie markiert, die muss man selbst entdecken.
- Gefundene Easter-Eggs zählen als Sammlung im Logbuch, angezeigt als „x von y entdeckt“.

### 5.3 Spielekiste und Scoring
- **Aussehen:** ein Raster mit 2 Spalten statt einer Liste.
  - Jede Kachel hat eine kleine SVG-Zeichnung zum Spiel im Stil aus Abschnitt 3.
  - Auf der Kachel stehen Name, Trophäe und eigener Rekord.
- **Scoring für alle Spiele:**
  - Jedes Spiel liefert Punkte, auch Horn-Quiz, Prüfungsfallen und Kartentisch.
  - Trophäen pro Spiel: Bronze, Silber, Gold, jeweils mit festen Schwellen.
  - Dazu ein Gesamtrang vom Schiffsjungen bis zum Kapitän.
- **Bestenliste pro Spiel:**
  - Feste Rekorde aller 6 Crew-Figuren und von Kapitän Harms. Jede Figur hat ein Paradespiel.
  - Wer eine Figur überholt, bekommt einen festen, frechen Spruch.
  - Rekorde erscheinen auch im Logbuch.

### 5.4 Panorama mit zwei Ebenen
1. **Übersicht:** das heutige ganze Boot als „große Ansicht“.
2. **Detailansicht:** Tippt man auf eine Stelle der Übersicht, wird hineingezoomt.
   - Dort liegt ein **neu gezeichnetes, langes Boot**, etwa 3 Bildschirmbreiten breit, das man nur waagerecht wischen kann.
   - Die Teile liegen nebeneinander: Bug, Mast, Cockpit mit Steuer, Motor, Niedergang.
   - Nur die wichtigsten Dinge sind beschriftet.
   - Es gibt einen deutlichen Knopf „Übersicht“ für den Rückweg.

Alle vorhandenen Hotspots und Easter-Eggs ziehen mit um.

### 5.5 Navigationsschule (Kartentisch)
Man soll Navigation wirklich lernen, für SBF See und darauf aufbauend SKS.

**Die Karte:** selbst gezeichnet, eine erfundene Nordsee-Flussmündung. Sie enthält Gezeiten, Tonnen, Feuer, Tiefen, eine Kompassrose mit Missweisung und einen Breiten- und Längenrand.

**Drei Bereiche:**

1. **Navi-Fibel**
   - Ein Glossar mit allen Begriffen, darunter: Breite und Länge, Seemeile, Kartennull, rwK, mwK, MgK, Missweisung, Deviation mit Ablenkungstabelle, rwP, Standlinie, Kreuzpeilung, Koppelort, Gissort, KdW, KüG, FdW, FüG, Stromdreieck, Vorhaltewinkel, Abdrift, Gezeiten.
   - Jeder Begriff hat eine Erklärung, eine kleine Animation und eine Merkhilfe.
   - Begriffe sind überall antippbar.

2. **Lernpfad**, jede Lektion gleich aufgebaut:
   - Die Crew erklärt kurz, mit Animation.
   - Geführte Übung mit Hilfen und konkreter Rückmeldung bei Fehlern.
   - Freie Übung: zufällig erzeugte Aufgaben, also unbegrenzt viele.
   - Meisterschaft: 3 Aufgaben hintereinander ohne Hilfe richtig, dann gibt es einen Stern.

   Die Lektionen:
   1. Karte lesen: Koordinaten, Symbole, Tiefen
   2. Werkzeuge: Kursdreieck und Zirkel, Distanz am Breitenrand
   3. Kurse umrechnen: rwK ↔ mwK ↔ MgK, mit Rechentrainer
   4. Peilen: Peilung, Kreuzpeilung, Feuer erkennen
   5. Koppeln: Fahrt × Zeit = Distanz, Koppelort
   6. Strom: Stromdreieck, Vorhaltewinkel
   7. Wind und Abdrift
   8. Gezeiten, so weit es die amtlichen Aufgaben verlangen
   9. Gesamtaufgaben

   Die SKS-Stufe baut darauf auf. Den Umfang prüfst du anhand von `quellen/`.

3. **Prüfungsmodus**
   - Aufgaben im Format der 15 amtlichen Navigationsaufgaben, übertragen auf unsere Karte.
   - Ohne Hilfen, mit Zeitvorgabe nach amtlicher Regel.
   - Bewertet wird nach dem Bewertungsschlüssel mit seinen Toleranzen.
   - Am Ende: Punkte, Fehleranalyse und welche Lektion man wiederholen sollte.

**Bedienung am Handy:**
- Karte: mit zwei Fingern zoomen, mit einem Finger verschieben. Beim Ablesen hilft eine Lupe.
- Kursdreieck: zum Verschieben ziehen, zum Drehen am Griff fassen.
- Zirkel: zwei Punkte setzen.
- Bleistift: Linien ziehen, mit Rückgängig-Knopf.
- Rechenblatt: ein Feld zum Eintragen der Werte.

**Fortschritt:** Erst wenn die Lektionen 1 bis 5 geschafft sind, darf man im Törn selbst Kurse absetzen.

### 5.6 Törn-Light (einfachste Variante)
- **Start:** Man tippt an Deck aufs Steuer. Dann kommt die Frage „Tagesetappe starten oder fortsetzen?“.
- **Ablauf:** Man sitzt im Cockpit und steuert nicht selbst. Das Boot fährt die Route auf der Navi-Karte, die Ansicht ist eine Cockpit-Szene mit kleiner Karte.
- **Dauer:** Eine Etappe dauert 5 bis 10 Minuten. Tag und Nacht laufen über die Schiffszeit, das Wetter wechselt.
- **Wahl:** Unter Segel (Kurs zum Wind, Wende und Halse als Entscheidung) oder unter Motor (Sprit).
- **Ressourcen:** Proviant, Treibstoff, Crew-Laune und Bootszustand.
  - Proviant verdient man durch tägliches Lernen.
  - Wer eine Etappe abbricht, verliert Proviant.
- **Ereignisse:** zufällig und passend zum Ort, zum Teil als Minispiel aus der Spielekiste:
  - Anlegen im Zielhafen → Manöverspiel
  - Ein Schiff kommt entgegen → Ausweichregel wählen
  - Begegnung bei Nacht → Lichterspiel
  - Nebel → Schallsignale
  - Tonne umfahren → Tonnen-Slalom
  - Motorproblem → Motorkunde
  - Kontrolle durch die Wasserschutzpolizei → Papiere und Fragen
  - Mensch über Bord
  - Wetterumschwung → reffen
  - Verkehrstrennungsgebiet queren
  - Leuchtfeuer erkennen
- **Am Ziel:** Logbucheintrag und Bewertung der Etappe.
- **Später, optional:** selbst steuern von oben, wie bei GTA 2.

### 5.7 Lexikon komplett
- **Inhalte:** alle Lichter, Signalkörper, Tonnen und Betonnung, Schallsignale mit Ton, Flaggen, Tafelzeichen und Kartensymbole.
- **Quelle:** Originalgrafiken aus den ELWIS-PDFs in `quellen/`, ausgeschnitten nach `img/lex/`.
- **Aufbau:** nach Thema sortiert, mit Suche. Jeder Eintrag hat eine Bedeutung und eine Merkhilfe.
- **Querverweise:** in beide Richtungen zwischen Lexikon und Fragen.
- **Kurse:** SBF, SKS und Binnen.

### 5.8 SBF Binnen
- Dritter Kurs aus `quellen/Fragenkatalog Binnen.pdf`, mit Bildern.
- Daten in `data/binnen.json`.
- Prüfungsmodus nach amtlicher Regel.
- Auswahl beim Kennenlernen erweitern.

## 6. Später (nicht in den Läufen 1 und 2)
- **Cloudflare-Worker:**
  - Die Keys liegen im Worker statt im Browser. Tester brauchen nur ein Passwort, ein Tageslimit schützt das Guthaben.
  - Dazu eine Anleitung Schritt für Schritt für mich.
  - Kommt vor dem Freundestest.
- **Folgen** für SKS und Binnen, danach das Stimmenpaket aktualisieren.
- **Unter Deck im Schnitt:** Räume nach und nach füllen. Alle Spiele bleiben vorerst in der Spielekiste.
- **Funk und Pyro:** erst, wenn ich die Kataloge geliefert habe.

## 7. Läufe
**Lauf 1 (am Stück, ohne Zwischenstopp):** 5.1 → 5.2 → 5.3 → 5.4 → Easter-Eggs → 5.8 → 5.7

Easter-Eggs:
- Ziel: mindestens 10 neue, ein Teil davon raffiniert und nur in mehreren Schritten zu entdecken.
- Ideen:
  - Kompass, dazu ein Messer → Deviation
  - Seewasserfilter mit Krabbe
  - Barometer mit Wetterumschwung
  - Nebelglocke, die antwortet
  - Frachter mit Lichterführung bei Nacht
  - Schlingerleiste in der Kombüse
  - Angel mit Flaschenpost
  - Glasen zur Schiffszeit
  - Signalflaggen buchstabieren den Namen

Am Ende von Lauf 1:
- Abschnitt 4 und 8 aktualisieren.
- Ein **gemeinsames Konzept für 5.5 und 5.6** auf höchstens 2 Seiten schreiben, mit Datenmodell, Kartenentwurf (als Bild) und Unteretappen.
- Bericht schreiben, dann **Haltepunkt**: Push und Konzept-Freigabe durch mich.

**Lauf 2 (am Stück):** 5.5 (Karte und Werkzeuge → Fibel → Lektionen → Prüfungsmodus) → 5.6

Danach: Bericht, Push, Abschnitt 8 aktualisieren.

**Bericht (immer gleich aufgebaut, kurz):**
- erledigt
- bewusst anders entschieden, mit Grund
- offen
- **Handy-Checkliste:** was ich selbst prüfen muss, z. B. Mikrofon und echte Stimmen
- was ich übersehen könnte

## 8. Status (von Claude Code gepflegt)
- [x] E0 Start-Check (v4.9: Git ok, `data/` ausgelagert, `img/q/`, `quellen/` mit `.gitignore`)
- [x] Kataloge in `data/` ausgelagert (seit v4.6)
- [x] 5.1 Begrüßung mit Streit und Neustart (v4.10: Flag `introV5`, `?neustart`, bekannte Nutzer ohne neue Fragen)
- [x] 5.2 Fernglas-Regel und Easter-Egg-Sammlung (v4.11: `EGGS`, `foundEgg`, `S.eggs`, Logbuch-Karte)
- [x] 5.3 Spielekiste, Trophäen, Bestenliste, Rang (v4.12: `TROPHY`, `NPC_BEST`, `OVERTAKE`, `recordScore`, `rankInfo`, Raster mit `GAME_ART`)
- [ ] 5.4 Panorama mit zwei Ebenen und neuem langem Boot
- [ ] Easter-Eggs (mindestens 10 neue)
- [ ] 5.8 SBF Binnen
- [ ] 5.7 Lexikon komplett
- [ ] Konzept 5.5 und 5.6 freigegeben
- [ ] 5.5 Navigationsschule
- [ ] 5.6 Törn-Light
