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
- **Crew:** witzig, herzlich, plattdeutsch angehaucht. Die Freigabe ist **so, wie sie aktuell im Code steht** (seit v4.8 immer FSK 18). Ändern nur auf meine Anweisung. Laut Nutzer (05.10.2026) ist der Ton auch für 14-Jährige in Ordnung.
- **Rangordnung:** SBF-Lernende werden liebevoll aufgezogen und nicht ganz ernst genommen („Badewannen-Kapitän“). SKS-Lernende bekommen spürbar mehr Respekt.

## 4. Code-Karte
*Stand v4.34 (Törn 2.0, Lauf 4; davor Architektur-Lauf, Konzept: `docs/konzept-architektur.md`).*
- **KI und Kosten:**
  - KI-Schalter `S.cfg.ki` (Standard an), `kiOn()`, `applyKi()` setzt `body.noki` und `body.nodev`
  - Kostenknöpfe haben die Klasse `.ki` (grau („ausgegraut“) mit ✦) und verschwinden bei ausgeschalteter KI. Automatische KI-Aufrufe gibt es nicht.
  - `ai()` zählt `S.kiUse` {day, n}; `KI_LIMIT` (0 = aus) für das spätere Tageslimit
  - Sprech-Arten: `fixed` (fester Satz, kommt ins Paket), `story`, `live` (KI-Antwort), `local` (wechselnder App-Text, nie ElevenLabs)
  - Entwickler-Werkzeuge `.dev`, `devOn()` (an bei ElevenLabs-Schlüssel oder `S.cfg.dev`)
- **Fragekarten:** `data/karten-sbf.json`, `karten-bin.json`, `karten-sks.json` ({k: {Schlüssel: {e, m, f}}}), Schlüssel `sbf:n`, `bin:n`, `sks:<id>`
  - `KARTEN`, `cardOf`, `cardHtml`, `localMn`, `localLesson`, `askCrewBox` (grauer Rückfrage-Kasten), `qContext`, `TUTOR` (Leitplanken), `readCls`
- **Stimmenpaket:** `PACK.voices` (Manifest legt die Stimmen fest), `VOX.voiceOf`, `packLines` (alle Crews), `packVoices`, `downloadPack` (ZIP-Teile unter 20 MB plus `geschichten.json`), `buildVoicePack`, `exportClips`
  - Werkzeuge: `tools/stimmen-import.js` (ZIPs aus `import/`), `tools/stimmenpaket.js` (direkt mit `ELEVENLABS_API_KEY`)
- **Offline:** Schriften in `fonts/`, `offlineStock()` (einmal pro Version), `sw.js` mit `MEDIEN` (Versionsname des Medien-Speichers)
- **Zurück-Taste:** `initBackKey`, `handleBack` (Reihenfolge `BACKS`), `guardBack`
- **Zuhören:** `AUD.hush` schaltet Musik und Geräusche beim Zuhören stumm
- **Navigationsschule** liegt in `navi.js` (nachgeladen über `loadNavi()`; `navSchool()` öffnet `NAV.hub`):
  - Daten: `data/karte.json` (erfundene Kliev-Mündung, Tonnen, Feuer, Mw, Ablenkungstabelle, Stromtabelle), `data/navi.json` (`fibel`, `lektionen` L1–L9)
  - Karte: `proj`/`unproj` (Mercator, Minuten ab 55°N/006°E), `NAV.mountChart` (Zoom, Lupe, Kursdreieck, Zirkel, Stift, Kreuz)
  - Rechnen: `kursDist`, `versegeln`, `kreuzpeilung`, `ablenkung`
  - Lernen: `NAV.fibel`/`term`/`linkTerms`, Aufgabengenerator `GEN` (inkl. `gesamt`), `NAV.task` + `grade` (Toleranzen `TOL`), `NAV.multi`, `NAV.path`/`lesson`/`exercise`, `NAV.exam` (25 min)
  - Spielstand: `S.navi` {`fibel`, `lek[id]` {`serie`, `sterne`, `n`}, `pruef[]`}; `NAV.kennWorte` (Kennung in Worten)
- **Törn 2.0** liegt in `toern.js` (nachgeladen über `loadToern()` nach `navi.js`; das Steuer an Deck ruft `openToern()` → `TOERN.open`):
  - Daten: `data/toerns.json` (`stufen` mit `scheine`, `aufgaben`, `schaden`, `ohneTeil`, `empfohlen`; `orte`; 15 `toerns` mit `etappen[].wp`), `data/ereignisse.json` (`ereignisse` mit `ref` auf amtliche Fragen, `gen` Kartenaufgaben, `fahrzeuge` Lichter/Signalkörper, `tags`, `crew`), `data/ausruestung.json` (`start`, `teile`), `data/tags.json`, `data/sks-mc.json`
  - Kern ohne DOM `TOERN.core` (auch in Node): `tagWetter`, `bericht`, `entscheid`, `plan`, `genKandidaten`, `zeit`, `folgen`, `malus`, `sterne`, `simulate`
  - Oberfläche: `TOERN.open` (Törnwahl), `starten`, `weiter` (springt in die gespeicherte Phase), `aufwachen`, `wetterbericht`, `fahrt` (Canvas `draw`: Himmel, Land per Strahl `rayLand`, Tonnen mit Kennung `lightOn`, Schiffe `drawShip` mit Lichtern nach Lage, Nebel, Regen, Deck, Wanten als Peilmarke, Steuerrad, Verklicker), Mini-Karte über `NAV.mountChart`, `zeigeAufgabe`/`antwort` (Reaktionszeit, Signale tuten, Peilen, Fernglas), `frageAufgabe` (SBF, SKS-MC, „nur offen“), `genAufgabe` (Tonne, Kardinal, Feuer, Lichter, Signalkörper, Strom, Kurs selbst absetzen), `etappeEnde`/`nachbesprechung`, `seenot`, `laden` (Bootsladen), `logbuch`, `TOERN.mcRunde` (SKS-Ankreuzrunde)
  - Spielstand: `S.toern2` {`kasse`, `prov`, `sprit`, `teile[]`, `vorrat{}`, `log[]`, `seen{}`, `provDay`, `schnitt{}`, `lauf`: {`id`, `si`, `e`, `tag`, `phase`, `w`, `plan`, `t`, `i`, `card`, `zustand`, `laune`, `punkte`, `eRes[]`, `res[]`, `sterne[]`}}; Standard `null`. Der alte `S.toern` bleibt unangetastet, sein Logbuch zeigt `toernCard` mit an.
  - Am langen Boot zeigt `ausrArt()` verbaute Teile. `AUD.sfx`/`AUD.horn` können mit `pan` links/rechts klingen.
- **Dateien:**
  - `index.html` (Code und CSS, ~458 KB; soll nicht weiter wachsen, 5.15)
  - `sw.js` (Cache; `VERSION` immer gleich `__ver`)
  - `navi.js` (Navigationsschule), `toern.js` (Törn 2.0)
  - `manifest.webmanifest`, `icon-192/512.png`
  - `data/`: `sbf.json`, `sks.json`, `binnen.json`, `nav.json`, `folgen.json`, `lexikon.json`
  - `img/q/` (SBF-Bilder), `img/b/` (Binnen-Bilder, auch SBF 16–30)
  - `audio/`
  - `audio/stimmen/` (Stimmenpaket mit `manifest.json`; legt auch die Stimmen fest, noch leer)
  - `docs/`: Konzepte, `toern2-plan.md`, `lauf3-plan.md`, `feste-saetze.md`
  - `tests/`: `smoke/rauchtest.js` (Rauchtest mit eigenem Server), `toern-daten.js`, `balancing.js`; `tools/`: `tag-fragen.js`, `sks-mc-pruefen.js`, `json-kompakt.js`
- **Start:**
  - `startApp` → `loadData` (alle `data/`-Dateien) → `boot` → `splash` → `runIntro` (Streit, `INTRO`) → `convoOnboarding` (Knöpfe plus Textfeld; `ONB`, `ONB2`, `ONB2_OPTS`, `NICKS`) → `keysStep` → `endIntro`
  - Flag `introV5` wird erst in `endIntro` gesetzt. `?neustart` setzt die Intro-Flags zurück, `S.reOnb` erzwingt neue Fragen.
- **Deck:**
  - `renderBoat` mit zwei Ebenen über `deckView`: `boatScene` (Übersicht, Antippen zoomt) und `longBoatScene` (1200×640, wischen)
  - Hilfen: `ovToDetail`, `bindPano(pano, key, centerX)`
  - Eggs: `startEgg` mit Handlern je `data-egg`
  - Fernglas: `bindFernglas`, `GAME_KEYS`, `BOAT_HINTS` / `DETAIL_HINTS`
- **Kajüte:**
  - `renderCabin`, `cabinScene`, `CABIN_SPOTS` (`fn` = vom Fernglas markiert), `SPOT`, `TAP`
  - Erstbesuch: `cabinWelcome` (Texte `CABIN`, SKS-Quiz, `fahrplanSheet`)
  - Hocker: `bgSit`
- **Easter-Eggs:**
  - Register `EGGS`, Fund melden mit `foundEgg(id)` → `S.eggs`, Anzeige `eggCard`
  - Sätze `EGG_LINES` (über `sayEgg`), `FLAG_ART`, `glasenNow`, `wxOverride`
- **Spiele:**
  - `GAMES`, `gamesHub` (Raster, `GAME_ART`), `gameShell`, `gameOver`
  - Punkte immer über `recordScore(key, wert)`: Trophäen `TROPHY`, Crew-Rekorde `NPC_BEST`, Sprüche `OVERTAKE`, Rang `rankInfo`, `leaderSheet`, `trophyCard`
- **Lernen und Prüfung:**
  - `runQuiz` (Option `scoreKey`), `examIntro` / `startExam` (beliebig viele Teile aus `COURSE.exam.parts`), `startExamOpen` (SKS)
  - Plan: `computePlan`, `fahrplan`
- **Kurse:**
  - `COURSES` (`sbf`, `sks`, `binnen`), `useCourse`, `switchCourse`, `QN`, `TOPICS`
  - Themen: `SBF_TOPICS`, `BIN_TOPICS`, `SKS_TOPICS`
  - Binnen-Prüfung: `BIN_EXAM.motor` / `.segel`, Wahl über `S.binSegel`
- **Lexikon:** `LEX` (aus `lexikon.json`), `lexEntries`, `renderLexikon` (Kategorien, Suche), `lexSheet`, `lexOf(q)` (Knopf in der Lernrunde nach dem Antworten), `sksRelated`
- **Folgen:** `EPISODES`, `SHORTS`, `playEpisode`, `epFill`, `showStory`
- **Stimme:**
  - `VOX` (`say`, `lines`, `clip`)
  - `CLIPS` (IndexedDB `skipper-audio` v2: Stores `clips` und `meta`)
  - Stimmenpaket: `PACK`, `packLines`, `buildVoicePack`, `exportClips`
  - Geräusche und Musik: `AUD`
- **Zeit und Wetter:** `shipHour`, `dayPart`, `weatherToday` (beachtet `WX_OVERRIDE`), `palette`
- **Crew:** `CREW`, `ROLE_OPTIONS`, `cid`, `nameOf`, `styleRules`, `TONE` (immer `erw`)
- **Spielstand `S`** (Key `skipper-sbfsee-v1`):
  - Profil: `profile` {`name`, `exam`, `minutes`, `exp`, `goal`, `revier`, `drive`, `facts[]`}
  - Kurse: `course`, `courses[id]` (Lernstand je Kurs: `qs`, `lessons`, `exams` …)
  - Ausstattung: `crew`, `cfg`, `boat`
  - Spiele und Funde: `best`, `nav`, `passed`, `eggs`
  - Flags: `introV5`, `cabinWelcome`, `reOnb`, `binSegel`, `tour`

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

### 5.4 Bootsansichten (Lauf 3, ersetzt das bisherige 5.4)
**Übersicht (herausgezoomt):**
- Das ganze Boot auf einen Blick. Man kann nicht wischen oder verschieben, Details gibt es wenige.
- Das ist das „Übermenü“: Lernfortschritt pro Schein, Einstellungen, Account- und Schlüssel-Infos, Schein wechseln.
- Ein klarer Weg „An Bord gehen“ führt in die Detailansicht, zusätzlich geht es per Antippen.

**Detailansicht (herangezoomt):**
- Ein deutlich kleinerer Ausschnitt: Man sieht praktisch nur das Deck, höchstens etwas Reling, das Meer unten nicht.
- Wischbar ist nur waagerecht, über das lange Boot.
- Die Ansicht startet zwischen Steuerrad und Kajüteneingang.
- Das Steuerrad startet den Törn (siehe 5.14).
- Alles andere ist sinnvoll über das Boot verteilt: Niedergang, Mast, Bug, Motor, Aufgaben und Easter-Eggs.

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

### 5.6 Törn-Light (einfachste Variante) – **ersetzt durch 5.14 (Törn 2.0), Umsetzung läuft**
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

### 5.9 Begrüßungs-Moin
- Ein richtig gezogenes „MOOOOOOOOIN“: Das O soll 2 bis 3 Sekunden klingen.
- Prüfen, ob ElevenLabs lange Vokale kürzt. Wenn ja, eine Lösung finden, zum Beispiel eine andere Schreibweise, langsamere Wiedergabe nur dieses Clips oder einen eigenen Clip.
- Der Satz kommt als fester Satz ins Stimmenpaket.

### 5.10 Einführung beim ersten Öffnen
- Jede Funktion bekommt beim ersten Öffnen eine kurze Einführung durch die Crew: Navigationsschule, Törn, Spielekiste, Lexikon, Prüfung, Hocker und jeder Schein.
- Die Einführung dauert höchstens etwa 30 Sekunden, lässt sich überspringen und besteht aus festen Sätzen.
- Im Spielstand wird pro Funktion gemerkt, ob sie schon lief.
- In den Einstellungen gibt es „Einführungen erneut zeigen“.
- Die Navigationsschule kommt zuerst dran.

### 5.11 Navigationsschule prüfen und ergänzen
- **Kritisch durchgehen wie ein strenger Prüfer.** Prüfpunkte:
  - Rechnungen
  - Vorzeichen bei Missweisung und Deviation
  - Strom und Wind: „wohin“ statt „woher“
  - Ablesung am Kursdreieck
  - Distanz nur am Breitenrand
  - Bedienbarkeit am Handy

  Gefundene Fehler beheben und im Bericht auflisten.
- **Lesbarkeit:** Die Kartenbeschriftung muss auch bei kleinem Zoom lesbar sein.
- **SKS-Tiefe:** Doppelpeilung, Versegelungspeilung und eine Kartenaufgabe im SKS-Stil ergänzen.
- **Toleranz:** Die ±10° bei kleinen Besteckversetzungen bleiben vorerst.

### 5.12 Prüfer holt einen ab
- Der Zugang über die Tür passt nicht und fällt weg.
- Neu: Man bestellt Kapitän Harms per Telefon oder Funkgerät in der Kajüte. Alternativ bittet man Smilla oder den Käpt'n, ihn zu holen.
- Harms kommt kurz herein, mit Animation und einem Spruch, und holt einen zur Prüfungssimulation ab.
- Das Fernglas markiert den neuen Zugang.

### 5.13 Funk und Pyro als eigene Scheine (Späterphase: nur Architektur jetzt)
- **Vorbereitung:** Zuerst prüfen, was in `quellen/` liegt, zum Beispiel SRC, UBI oder FKN.
- **Jeder Schein wird ein eigener Kurs** wie SBF, SKS und Binnen:
  - Katalog und Themen
  - Lernrunden
  - Probeprüfung nach amtlicher Regel
  - Lexikon-Einträge
  - Auswahl beim Kennenlernen und unter „Schein wechseln“
- **Übungen Funk:**
  - Buchstabiertafel
  - MAYDAY-, PAN-PAN- und SÉCURITÉ-Meldungen zusammensetzen
  - Kanäle und DSC
  - englische Standardsätze, nur soweit die Unterlagen das hergeben
- **Übungen Pyro:** Signalmittel erkennen und richtig handhaben.
- **Daten:** in `data/*.json`, nur bei Bedarf laden.

### 5.14 Törn 2.0 (ersetzt den Törn-Light aus 5.6)
Vorerst nur Wissen aus SBF See und SKS. Binnen, Funk und Pyro kommen später und sollen sich allein durch Hinzufügen von Daten einhängen lassen.

**Architektur**
- Eigene Datei `toern.js`, nur bei Bedarf geladen (wie `navi.js`). `index.html` wächst nicht.
- `data/toerns.json`: Törns (Name, Stufe, Etappen, Route auf unserer Karte, typische Wetterlagen, empfohlene Scheine, empfohlene Ausrüstung).
- `data/ereignisse.json`: alle Ereignisse datengetrieben (Auslöser: Fahrgebiet/Wetter/Tageszeit/Stufe; Reaktionszeit; Art Handlung oder Frage; Folgen bei richtig/falsch/zu spät; benötigte bzw. hilfreiche Ausrüstung).
- `data/ausruestung.json`: verbaubare Teile und Verbrauchsgüter mit Wirkung und Preis.
- `data/tags.json`: Situations-Tags für JEDE SBF- und SKS-Frage (z. B. nacht, nebel, fahrwasser, ausweichen, lichter, schallsignale, betonnung, motor, wetter, sicherheit, recht, navigation, manoever, seemannschaft). Automatisch über Themen und Stichwörter vergeben, Kataloge selbst nicht verändern. 50 Stichproben von Hand prüfen, Fehlerquote in den Bericht.
- Neuer Schein später = Katalog taggen + in den Pool hängen, sonst nichts.

**SKS als Multiple Choice (für Törn UND Lernrunden nutzbar)**
- `data/sks-mc.json`: pro SKS-Frage drei Antworten: 1 richtige + 2 falsche.
- Richtige Antwort: die amtliche Antwort, kurz gefasst (max. ca. 15 Wörter), ohne den Sinn zu verändern. Wenn sie sich nicht sinnvoll kürzen lässt: amtlichen Kern wörtlich übernehmen.
- Falsche Antworten: „glaubwürdiger Humbug“ – klingt seemännisch plausibel, gleiche Länge und gleicher Stil wie die richtige, ist aber eindeutig falsch. Sie darf NICHT teilweise richtig sein und keine echte Regel verdrehen, die anderswo im Katalog richtig ist. Gern mit leisem Augenzwinkern, aber nicht albern.
- Reihenfolge der Antworten zufällig. Nach der Antwort immer die volle amtliche Antwort zeigen.
- Jede Frage einmal selbst gegen den Katalog prüfen. Fragen, bei denen sich keine eindeutig falschen Antworten bauen lassen, bekommen das Kennzeichen „nur offen“ und kommen im Törn ohne Zeitlimit als Aufdecken-und-selbst-bewerten. Anzahl im Bericht.
- Die offizielle SKS-Probeprüfung bleibt mit freien Antworten wie bisher.

**Ablauf**
1. Steuerrad in der Detailansicht an Deck antippen → Törnauswahl. Mehrere Törns, ALLE sofort wählbar. Pro Törn: Name, Stufe, Anzahl Etappen, ungefähre Dauer, empfohlene Scheine, empfohlene Ausrüstung. Ein laufender Törn steht oben als „Fortsetzen“.
   Stufen: Landratte → Leichtmatrose → Seebär → Kap-Hoornier → Klabautermann.
   Törns (eigenes Revier, darf ergänzt werden):
   - Landratte: „Kaffee im Nachbarhafen“, „Fischbrötchen-Fahrt“, „Einmal um die Ansteuerungstonne“
   - Leichtmatrose: „Zum Leuchtturmwirt“, „Mit der Tide ins Watt“, „Abendrot vor Kliev“
   - Seebär: „Nachtfahrt nach Süderoog“, „Nebel über der Barre“, „Quer übers Fahrwasser“
   - Kap-Hoornier: „Gegen Wind und Tide“, „Drei Tage Nordsee“, „Rund um die Inseln“
   - Klabautermann: „Herbststurm-Überführung“, „Nacht, Nebel, Nordwest 7“, „Die Große Runde“
2. Start: Bildschirm wird langsam schwarz und wieder hell, man „wacht an Bord auf“ (ab dem 2. Mal überspringbar).
3. Erste Aufgabe jedes Törntags: Seewetterbericht lesen und entscheiden: auslaufen, verschieben oder anders planen (Motor statt Segel, Reff). Bei Schietwetter liegen bleiben ist richtig und gibt Punkte.
4. Fahrt-Bildschirm:
   - Oben: Blick vom Steuer nach vorn. Unten im Bild das Steuerrad, darüber ein einfacher Durchblick aufs Meer mit Bug, Vorsegel und Horizont. Objekte: Tonnen, Feuer, Lichter, Signalkörper, andere Schiffe, Land. Objekte tauchen am Horizont auf und wachsen mit der Nähe. Tag/Nacht, Wetter und Seegang sichtbar. Canvas, schlicht, flüssig auf Android.
   - Unten: unsere Karte, folgt dem Boot.
   - Anzeige: geschätzte Restzeit der Etappe, aktuelles Wetter, Prognose, Bootszustand, Proviant, Sprit, Bordkasse.
   - Etappe = 5–8 Minuten aktives Spiel, hohe Aufgabendichte, keine Leerlaufstrecken. Lange Törns = mehrere Etappen über mehrere Tage.
   - Pause/Fortsetzen jederzeit, auch mitten in der Etappe. App schließen = Pause, Stand bleibt.
5. Wetter wechselt während des Törns und bringt eigene Aufgaben: Flaute (Motor/Sprit oder warten), Starkwind (reffen), hoher Seegang (Kurs zur Welle, Sicherheit), Nebel (Schallsignale, Fahrt anpassen), Gewitter, Böen. Wind wechselt täglich.
6. Aufgaben:
   - Zufällig, aber passend zu Fahrgebiet, Wetter und Tageszeit. Bevorzugt Themen, die der Nutzer noch schwach kann.
   - Etwa 60 % Handlungen, 40 % Fragen (SBF-Ankreuzfragen und SKS-MC).
   - Reaktionszeit hängt von der AUFGABE ab, nicht von der Stufe: Motorausfall im Fahrwasser = sehr kurz; Schiff am Horizont = länger. Richtwert 15–60 Sekunden.
   - Schwierigkeit steigt über: Nacht, Nebel, kombinierte Ereignisse, weniger Hilfen, strengere Folgen.
   - Inhalte nur aus den amtlichen Katalogen und `quellen/`. Keine Regel erfinden; die richtige Handlung muss der amtlichen Antwort entsprechen.

**Sehen und Handeln** (sinnvoll mit einfachen Mitteln umsetzen)
- Peilen nach Augenmaß: Eine feste Marke an Reling/Want im Bild. Bleibt ein fremdes Schiff an derselben Stelle der Marke stehen, während es näher kommt = Kollisionskurs. Knopf „Peilung nehmen“ (Handpeilkompass) zeigt die Gradzahl; nach einiger Zeit erneut peilen und vergleichen. Dann richtig reagieren nach KVR: Wer ist ausweichpflichtig, wie ausweichen (Ruder legen, deutlich und früh), passende Schallsignale.
- Nachts sieht man nur Lichter: Fahrzeugart, Fahrtrichtung und Lage aus den Lichtern erkennen.
- Fernglas-Knopf: kurz heranzoomen, um Toppzeichen, Farben, Signalkörper oder Flaggen zu erkennen – kostet aber Reaktionszeit.
- Tonnen und Feuer blinken in ihrer echten Kennung (Rhythmus aus unserer Karte); man zählt und bestimmt sie und findet sie auf der Karte. Toppzeichen erst aus der Nähe erkennbar.
- Signalkörper (Ball, Kegel, Zylinder, Rhombus) und Flaggen an anderen Fahrzeugen bei Tag.
- Nebel: Bild wird grau, man hört nur Schallsignale – gern mit Stereo-Richtung (links/rechts, Hinweis „mit Kopfhörern besser“). Eigene Nebelsignale richtig geben.
- Landmarken an der Küstensilhouette (Kirchturm, Leuchtturm) peilen → Standort auf der Karte bestimmen (nutzt die Navi-Werkzeuge).
- Wind und Wetter lesen: Verklicker im Masttopp, Wellenkämme, Wolkenbild, fallendes Barometer als Vorwarnung.
- Strom erkennen: Tonne liegt schräg im Strom, Kielwasser an der Tonne.
- Echolot piept bei abnehmender Wassertiefe.
- Funkverkehr als Text/Ton: Lagemeldung oder Sicherheitsmeldung der Verkehrszentrale, man zieht die richtige Konsequenz (nur Wissen aus SBF/SKS, keine SRC-Prüfungsinhalte).
- Weitere Handlungen: reffen, Motorstörung nach Checkliste beheben, Mensch-über-Bord-Manöver, Anlegen (Manöverspiel), Rettungsmittel richtig einsetzen.
- Die Crew ruft „Wahrschau!“ als Hinweis, auf leichteren Stufen früher.

**Folgen, Ressourcen, Ausrüstung**
- Bootszustand ist das Leben. Schwere Fehler: Seenot, Abschleppen oder Abbruch; dabei gehen Proviant und Bordkasse verloren. Abbruch kostet Proviant. Proviant gibt es durchs Lernen. Dazu Sprit und Crew-Laune.
- Bordkasse (durch Lernen und Törns) zum Kaufen. Unterwegs findet man manchmal Gegenstände: verbaubar (z. B. Radarreflektor, UKW-Funk, Reffanlage, Kartenplotter, Autopilot, Rettungsinsel) oder Verbrauchsgut (z. B. Signalmittel, Ersatz-Impeller, Diesel, Proviant). Verbaute Teile sind in der langen Detailansicht des Bootes sichtbar. Ausrüstung macht bestimmte Ereignisse leichter oder überhaupt lösbar. Wenige, spürbare Gegenstände, kein Grind.

**Nachbesprechung nach jeder Etappe**
Sterne und Punkte, jeder Fehler mit kurzer Erklärung und Link ins Lexikon bzw. zur Frage, Eintrag im Törn-Logbuch. Falsch beantwortete Fragen fließen in die normale Wiederholung im Lernplan.

**Balancing (messbar)**
Testskript, das simulierte Spieler mit 40 %, 70 % und 95 % Trefferquote jede Stufe fahren lässt. Ziel: 40 % schafft nur Landratte zuverlässig, 70 % kommt bis Seebär, Klabautermann nur mit sehr hohem Wissen und guter Ausrüstung. Werte in den Bericht.

**Ton und Stimme**
Crew kommentiert witzig wie bisher. Alle wiederkehrenden Sätze sind feste Sätze ohne Namen fürs Stimmenpaket. Geräusche: Wind, Wellen, Motor, Alarm, Schallsignale.

**Nicht jetzt, aber nicht verbauen**
Echte Reviere als Pakete mit sehr groben, selbst gezeichneten Karten (z. B. Athen → Istanbul, Bornholm); selbst steuern von oben; Binnen, Funk und Pyro im Fragen-Pool.

**Tests**
Rauchtest erweitern: Törnauswahl, kompletter Landratte-Törn, Nachtereignis, Nebelereignis, Pause/Fortsetzen, SKS-MC-Runde, alter Spielstand lädt ohne Fehler. Hochformat 400×860, Konsole fehlerfrei.

**Am Ende**
§4 und §8 aktualisieren. Bericht im festen Format: erledigt / bewusst anders entschieden / offen / Handy-Checkliste / was ich übersehen könnte / Balancing-Werte / Tag-Stichprobe / Anzahl SKS-Fragen „nur offen“ / gefundene Navigationsfehler / neue feste Sätze fürs Stimmenpaket. Dann auf das OK zum Push warten.


### 5.15 Technik
- **Rauchtest-Skript im Repo** (`tests/smoke`):
  - klickt alle Kurse und Hauptbereiche durch
  - meldet Fehler in der Konsole
  - läuft vor jedem Commit
- **Dateigröße:** `index.html` darf nicht weiter wachsen. Neue Bereiche kommen in eigene Dateien, die bei Bedarf geladen werden, so wie `navi.js`.
- **Feste Sätze:** Eine Liste aller neuen festen Sätze pflegen. Am Ende eines Laufs erzeugt der Nutzer das Stimmenpaket einmal. Liegt eine `stimmen.zip` im Repo-Ordner, wird sie nach `audio/stimmen/` eingebaut.

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
- [x] 5.4 Panorama mit zwei Ebenen und neuem langem Boot (v4.13: `longBoatScene`, `deckView`, `ovToDetail`, Knopf „Übersicht“)
- [x] Easter-Eggs (v4.14: 11 neue, 29 insgesamt; `EGG_LINES`, `FLAG_ART`, `glasenNow`, `wxOverride`)
- [x] 5.8 SBF Binnen (v4.15: `data/binnen.json` 300 Fragen, 70 Bilder in `img/b/`, `COURSES.binnen`, `BIN_TOPICS`, `BIN_EXAM` motor/segel, `S.binSegel`; SBF-See-Fragen 16–30 mit Bild freigeschaltet)
- [x] 5.7 Lexikon komplett (v4.16: `data/lexikon.json` mit Kategorie, Merkhilfe, Tonmuster; `lexEntries`, `lexOf`, `lexSheet`, `sksRelated`; SBF 84, Binnen 79 Einträge)
- [x] Konzept 5.5 und 5.6 freigegeben (04.10.2026, inkl. Vorschläge zu Toleranzen und Zeit; `docs/konzept-navi-toern.md`)
- [x] Lauf 1 abgeschlossen und gepusht (v4.10–v4.16)
- [x] Lauf 2 abgeschlossen und gepusht (v4.17–v4.23)
- [x] 5.5 Navigationsschule
  - [x] 5.5e Prüfungsmodus (v4.21: `NAV.exam`, 25 min, Fehleranalyse mit Lektionsempfehlung, `S.navi.pruef`; Teil 3 der SBF-Probeprüfung nutzt ihn)
  - [x] 5.5d Lektionen 6–9 (v4.20: Strom/Vorhalten, Wind/Abdrift, Gezeiten, Gesamtaufgabe `GEN.gesamt` + `NAV.multi`, Zeichnungen bleiben über die Schritte)
  - [x] 5.5c Lektionen 1–5 (v4.19: `GEN` mit 14 Aufgabentypen, `NAV.task` Übungsmaschine, `grade` mit Toleranzen, `NAV.path/lesson/exercise`, Meisterschaft → `S.navi.lek[id].sterne`)
  - [x] 5.5b Navi-Fibel (v4.18: 23 Begriffe in `data/navi.json`, `NAV.fibel`, `NAV.term`, `NAV.linkTerms` macht Begriffe überall antippbar)
  - [x] 5.5a Karte und Werkzeuge (v4.17: `navi.js` nachgeladen, `data/karte.json`, Mercator, Zoom, Lupe, Kursdreieck mit Gradbogen, Zirkel, Bleistift, Rechenblatt)
- [x] Architektur-Lauf (v4.24–v4.31, 05.10.2026, Konzept `docs/konzept-architektur.md`)
  - [x] A1 KI-Schalter, gelbe Kostenknöpfe, keine automatischen KI-Aufrufe, Tageszähler (v4.24)
  - [x] A3 Stimmenpaket: feste Stimmen, alle Crews, Export, Import- und Erzeugungs-Skript, eigene Folgen bleiben (v4.25)
  - [x] A4 Offline: lokale Schriften, Offline-Vorrat, versionierter Medien-Speicher (v4.26)
  - [x] A5 Zurück-Taste, ruhigeres Zuhören im Gespräch (v4.27)
  - [x] A2 Fragekarten: SBF 285, Binnen 228, SKS 635 (v4.28–v4.31)
  - [x] Kostenknöpfe grau wie „ausgegraut“ statt gelb, weil Gelb schon für Hauptknöpfe genutzt wird (v4.32, Wunsch des Nutzers)
  - [x] Gepusht auf `claude/sweet-cori-fklbww` (live erst nach Übernahme in `main`)
- **Entscheidungen des Nutzers (05.10.2026):** Konten mit Supabase. Stimmenpaket erst erzeugen, wenn der Nutzer die Podcastfolgen überarbeitet hat, dann in bester verfügbarer Qualität. Kostenknöpfe grau (siehe v4.32).
- **Offene Entscheidungen (noch nicht beantwortet):**
  - Stimmenqualität: „die beste mögliche 3“ wurde als hohe Qualität verstanden (Multilingual v2). **Bitte bestätigen.** Ob ElevenLabs inzwischen ein besseres Modell hat, wird vor der Erzeugung geprüft.
  - „Weiter“-Knöpfe (gelb-orange, ohne Kosten): nicht geändert. **Umfärben ja/nein?**
  - Altersfreigabe im Store: Der Ton ist FSK 18, du hast ihn für 14-Jährige als in Ordnung bezeichnet. Store-Einstufung (Apple/Google) noch offen. Entscheidung vor dem Store.
  - Tageslimit pro Konto: `KI_LIMIT` steht auf 0 (keine Grenze). Zahl für Fragen, Gespräche und Stimmen pro Tag fehlt.
- **Muss vor dem Store umgesetzt werden (aus dem Konzept, bisher nur dort):**
  - Datenschutz-Einwilligung vor der ersten KI-Nutzung (Pflicht für den Store).
  - Konto-Löschung in der App (Apple verlangt sie).
  - Datenschutzerklärung als Seite.
- **Nicht auf einem echten Handy getestet.** Handy-Checkliste:
  - Mikrofon im Gespräch (Freihand und Tippen), Redepause, ob die Crew den Satz hört
  - Zurück-Taste in der installierten App und im Browser
  - Offline: App-Start ohne Netz, Bilder, Töne, Schriften
  - Stimmen: ElevenLabs-Stimme oder Handystimme, Lautstärke, Abspielen der Kostenknöpfe bei KI aus
  - Kostenknöpfe grau, verschwinden bei KI aus
  - Zurück-Taste im Quiz, in der Karte und in den Einstellungen
- **Werkzeuge nur als Trockenlauf geprüft:** `tools/stimmenpaket.js` ist noch nie mit echtem Schlüssel gelaufen. Erst mit der Freigabe der Podcastfolgen.
- **Lauf 3 (Nachtrag, eingearbeitet 08.10.2026):** Plan und Unteretappen in `docs/lauf3-plan.md`. Funk und Pyro später, nur Schein-Architektur jetzt.
- [x] **Törn 2.0 (Lauf 4, Konzept 5.14)** (v4.33–v4.34, Plan `docs/toern2-plan.md`)
  - [x] T1 Tags (920 Fragen; Stichprobe 14 % → 10 % Fehler, systematische Fehler korrigiert)
  - [x] T2 SKS-MC (613 Multiple Choice, 22 nur offen)
  - [x] T3 Daten (5 Stufen, 15 Törns, 38 Ereignisse, 13 Ausrüstungsteile)
  - [x] T4 `toern.js` mit Sicht vom Steuer, Aufgaben, Wetter, Ausrüstung, Pause, Nachbesprechung
  - [x] T5 SKS-Ankreuzrunde in der Lernrunde
  - [x] T6 Balancing (alle Ziele erreicht)
  - [x] T7 altes Gerüst entfernt, Rauchtest `tests/smoke/rauchtest.js`
  - Offen: Standortbestimmung per Landmarken-Peilung als Aufgabe, Funk-Lagemeldungen als eigene Aufgabe, eigene Geräusche für Wind/Alarm (heute vorhandene Klänge), echte Handyprüfung
- **Offen (Reihenfolge):**
  1. Übernahme in `main`, damit GitHub Pages die neue Version zeigt
  2. A6 Konten und Server mit Supabase (freigegeben), danach KI-Tageslimit auf dem Server
  3. Stimmenpaket: **erst nach der Überarbeitung der Podcastfolgen durch den Nutzer**, dann in bester Qualität (Handy-ZIP oder `tools/stimmenpaket.js` mit Secret `ELEVENLABS_API_KEY` und Freigabe von `api.elevenlabs.io`)
  4. Folgen für SKS und Binnen, danach das Stimmenpaket ergänzen
  5. Capacitor, Datenschutz, Store, Skins mit Käufen
  6. Unter Deck im Schnitt; Funk und Pyro (warten auf Kataloge)
  7. Datenfehler prüfen (Originalkatalog): SBF 279 (doppelte Antwort), SBF 285 und Binnen 253 (angehängter PDF-Text), SKS nav-92 (Antwort leer), recht-23 (Frage abgeschnitten), „Stand: 01. Juli 2006“-Reste in SKS-Antworten
  8. Widerspruch: 5.7 nennt `img/lex/`, den Ordner gibt es nicht (das Lexikon nutzt `img/q/` und `img/b/`)
- [ ] Lauf 3 (Nachtrag)
  - [ ] L3a 5.9 Moin (Netz für ElevenLabs nötig)
  - [ ] L3b 5.4 zwei Ansichten
  - [ ] L3c 5.10 Einführungen
  - [ ] L3d 5.11 Navi-Prüfung und SKS-Navi
  - [ ] L3e 5.12 Prüfer holt ab
  - [ ] L3f 5.13 Schein-Auswahl (Funk/Pyro später)
  - [ ] L3g 5.15 Technik und Rauchtest
- [x] 5.6 Törn-Light (v4.22–4.23; seit v4.33 durch Törn 2.0 ersetzt, Code aus navi.js entfernt)
  - [x] 5.6a Gerüst: Start am Steuer (`NAV.toernStart`), 4 Etappen `ETAPPEN`, Cockpit-Szene, Mini-Karte folgt dem Boot, Segel/Motor, Kreuzen am Wind, Spielstand `S.toern` (fortsetzen)
  - [x] 5.6b Ereignisse: Tonne, VTG, Begegnung (KVR), Nacht/Lichter, Nebel, Motor, Böe, MOB, Feuer, Polizei (Quiz), Anlegen; Wende/Halse-Entscheidung; Kurse selbst absetzen ab Sternen L1–L5
  - [x] 5.6c Ressourcen (Proviant aus Lerntagen, Sprit, Laune, Boot), Abbruch kostet Proviant, Ankunft mit Sternen, Törn-Logbuch
