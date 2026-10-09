# Skipper – Projekt-Brief für Claude Code (Version 4, 09.10.2026)

> **Der Code ist die Wahrheit.** Widersprechen sich Brief und Code, gilt der Code, und der Widerspruch kommt in den Bericht. Abschnitt 7 (Code-Karte) und 8 (Status) pflegt Claude am Ende jedes Laufs. Nach einem Abbruch geht es immer mit Abschnitt 8 weiter.
> Die alte Fassung (Version 3) mit allen erledigten Konzepten liegt in `docs/archiv/claude-v3.md`. Dort stehen die Details zu Navigationsschule (5.5, 5.11), Törn 2.0 (5.14) und den Läufen 1–3.
> **Nummern zum Kommentieren:** Regeln `R1…`, Vorhaben `V1…`, Lizenzpunkte `L1…`, Entscheidungen `E1…`. Die Nummern bleiben fest, Erledigtes wird abgehakt und nicht neu nummeriert.

## 1. Worum es geht
„Skipper“ ist eine Lern-App für Bootsführerscheine: SBF See, SKS und SBF Binnen sind drin. Funk (SRC/UBI) und Pyrotechnik (FKN) kommen, wenn der Nutzer die Kataloge liefert.

Man lernt an Bord einer Segelyacht mit drei Crew-Figuren: **Käpt'n Hinnerk**, **Matrosin Smilla** und **Papagei Klabauter**. Dazu kommt **Bordkatze Backbord** ohne Stimme, die überall herumläuft und Unsinn macht. Geprüft wird von **Kapitän Harms** (interne ID `kroeger`).

Die App läuft als Web-App auf GitHub Pages. Hauptgerät ist Android mit Chrome im Hochformat.

**Ziel:** In etwa zwei Wochen (ab 09.10.2026) ist die App bereit für die Veröffentlichung. Freigabe ab 12 Jahren. Bis dahin geht es um Feinschliff, Stimmen, Lizenzen und Rechtliches, nicht um große neue Bereiche.

## 2. Regeln für die Arbeit
- **R1 Antworten:** kurz, auf Deutsch, laienverständlich. Der Nutzer ist GitHub-Anfänger.
- **R2 Ehrlichkeit:** Nichts erfinden, Unsicherheit offen sagen und Übersehenes ansprechen.
- **R3 Neue Wünsche:** Erst die eigene Meinung zu jedem Punkt, Ideen schärfen und Fragen stellen. Nach der Antwort den Lauf am Stück abarbeiten. Kleine Unklarheiten entscheidet Claude selbst und nennt sie im Bericht. Stoppen nur bei Grundsatzfragen oder Fehlern, die sich nicht lösen lassen.
- **R4 Pro Etappe:** gezielt editieren (nie ganze Dateien neu schreiben), testen, `__ver` und `VERSION` in `sw.js` hochzählen, committen, in §8 abhaken.
- **R5 Testen:** Hochformat 400×860, Konsole fehlerfrei, alte Spielstände laden ohne Fehler, wenn möglich mit Screenshots.
  - Der Rauchtest (`tests/smoke/rauchtest.js`) läuft automatisch vor jedem Commit über `.githooks/pre-commit`, einmalig einschalten mit `git config core.hooksPath .githooks`.
  - Commits, die nur Texte (`.md`) ändern, überspringen ihn.
- **R6 Online stellen:** Am Ende jedes Laufs auf den Arbeitszweig pushen und per Pull Request in `main` übernehmen. Dann ist die neue Version auf GitHub Pages online, ohne dass der Nutzer etwas tun muss.
- **R7 Spielstände nie brechen:** Der Speicher-Key `skipper-sbfsee-v1` und die internen IDs bleiben. Neue Felder bekommen immer einen Standardwert. Entfallene Figuren werden still auf die verbliebenen umgestellt.
- **R8 Prüfungsinhalte:** nur aus den amtlichen Katalogen, fachlich korrekt.
  - Die Originale liegen im Ordner `quellen/`. Er ist in `.gitignore`, wird nie hochgeladen und fehlt deshalb in der Cloud.
  - Was Claude ohne `quellen/` prüfen musste, wird im Bericht markiert.
  - Die BSH-Übungskarte 49 nie abpausen.
- **R9 Schlüssel:** Anthropic- und ElevenLabs-Key nie ins Repo schreiben und nie ausgeben. In der Cloud nur als Secret der Umgebung.
- **R10 Feste Sätze:** Alles, was die Crew wiederholt sagt, ist ein fester Satz ohne Namen und kommt ins Stimmenpaket (§4). Neue feste Sätze stehen in `docs/feste-saetze.md`.
- **R11 Dateigröße:** Große neue Bereiche kommen in eigene, nachgeladene Dateien (wie `navi.js`, `toern.js`), Texte und Listen in `data/*.json`. Kleine Änderungen in `index.html` sind in Ordnung.
- **R12 Lizenzen:** Claude meldet jede Datei, deren Herkunft oder Lizenz fraglich ist (§5). Der Nutzer tauscht sie dann aus.
- **R13 Fernglas:** Es markiert nur Dinge mit Funktion: Niedergang, Steuerrad, Kartentisch, Spielekiste, Hocker, Telefon. Easter-Eggs nie.
- **R14 Bericht** (kurz, immer gleich):
  1. **Fertig und online:** was jetzt in der App neu ist.
  2. **Bitte am Handy testen:** konkrete Handgriffe.
  3. **Deine Entscheidung nötig:** mit Nummer.
  4. **Hinweise:** bewusst anders entschieden, Lizenzen, was du übersehen könntest.

## 3. Stil und Ton
- **Grafik:** warm, flach, gezeichnet, im Stil von Pettersson und Findus oder Janosch (nur der Stil, keine fremden Figuren). Szenen hängen von Tageszeit und Wetter ab.
- **Ton:** jugendfrei ab 12, aber derb und hart, plattdeutsch angehaucht. Keine sexuellen Anspielungen, kein Alkohol als Witz über Kinder, keine Beleidigungen von Gruppen.
- **Alle werden aufgezogen,** egal welcher Schein. SBF-Lernende sind „Badewannen-Kapitäne“. SKS-Lernende bekommen genauso Sprüche, die aber auf Augenhöhe.
- **Die Figuren:**
  - **Käpt'n Hinnerk:** trocken, kurz angebunden, grüßt mit „Moin“.
  - **Smilla:** frech und schnell.
  - **Klabauter:** wiederholt Wörter.
  - **Backbord:** spricht nicht, macht Unsinn.
  - **Harms:** streng und knurrig.

## 4. Stimmen und Kosten (wichtig)
**Grundsatz:** Jeder feste Satz wird genau einmal bei ElevenLabs erzeugt und liegt danach als MP3 in der App (`audio/stimmen/` mit `manifest.json`). Alle Nutzer hören diese Dateien. Bei 50 oder 5000 Nutzern kostet das nichts zusätzlich.

**So funktioniert es heute im Code:**
1. Die App schaut zuerst ins Stimmenpaket (`PACK.get`).
2. Dann in den Speicher des Geräts (IndexedDB `CLIPS`). Dort landet alles, was auf diesem Gerät schon einmal erzeugt wurde.
3. ElevenLabs fragt die App nur, wenn der Nutzer einen eigenen Schlüssel eingetragen hat.
4. Sonst spricht die Handystimme, und das kostet nichts.

**Folge:** Nutzer ohne Schlüssel hören echte Stimmen nur aus dem Stimmenpaket. Deshalb muss das Paket vollständig sein.

**Aufbau des Pakets:**
- **Teil 1, feste Sätze:** Begrüßungen, Moin-Bausteine, Einführungen, Kajüte, Eggs, Törn, Lektionen, Harms.
  - Mit 3 Figuren plus Harms sind das heute etwa 315 Sätze mit rund 21.000 Zeichen.
  - Wird erzeugt, sobald der Ton auf „ab 12“ umgestellt ist (V7). Sonst müsste man doppelt erzeugen.
- **Teil 2, Folgen (Kajütenfunk):** heute rund 56.000 Zeichen für SBF. Wird erst erzeugt, wenn der Nutzer die Folgen überarbeitet hat. Teil 1 wartet nicht darauf.
- **Nachlieferung:** Neue feste Sätze werden später gezielt nachgeliefert. Nur fehlende Sätze werden erzeugt, das Manifest wird zusammengeführt.

**Moin-Bausteine:**
- Jede Figur hat 5–6 feste Moin-Varianten, z. B. „Moin!“, „Moin, moin!“, „Mooooin!“, „Moin, Mooooooin!“, „Moooooooooin! Moin!“ und „Moin…“.
- Bei der Begrüßung spricht der Käpt'n fast immer, Smilla und Klabauter kommen nur manchmal dazu (je etwa 20 %).
- Die Kette besteht nur aus gespeicherten Clips und kostet nichts extra. Gezogene Varianten werden auf 0,8× gedehnt.

**Wege zum Erzeugen** (Entscheidung E5):
- **(a) In der Cloud durch Claude:**
  - Der Nutzer legt in den Umgebungseinstellungen ein Secret `ELEVENLABS_API_KEY` an und erlaubt die Domain `api.elevenlabs.io` (Network access).
  - Danach erzeugt Claude mit `tools/stimmenpaket.js` und legt das Paket ins Repo.
- **(b) Am Handy durch den Nutzer:** ZIP aus der App exportieren und als `stimmen.zip` ins Repo legen. `tools/stimmen-import.js` baut es ein.

**Qualität:** Das Modell „Multilingual v2“ spricht Deutsch in hoher Qualität. Vor der Erzeugung prüft Claude, ob ElevenLabs inzwischen ein besseres Modell für Deutsch anbietet (z. B. „v3“), und erzeugt zuerst drei Probesätze zum Anhören.

**Live-KI** (freies Gespräch, Erklärungen auf Nachfrage) lässt sich nicht vorab erzeugen. Sie bleibt hinter grauen Kostenknöpfen. Ein Tageslimit kommt später (E4).

## 5. Lizenzen (Prüfliste vor der Veröffentlichung)
- **L1 Musik und Geräusche in `audio/`** (30 MB, etwa 40 Dateien): von einer lizenzfreien Seite (Nutzer, 09.10.2026). Die Dateinamen (Künstler-Titel-Nummer) sprechen für Pixabay. Die Pixabay-Lizenz erlaubt kommerzielle Nutzung ohne Namensnennung. Freiwillige Nennung der Künstler unter „Über die App“, Liste in `docs/quellen-audio.md`.
- **L2 Bilder aus den amtlichen Fragenkatalogen** (`img/q/`, `img/b/`) und die Fragentexte: vermutlich als amtliche Werke frei nutzbar. Das ist aber nicht sicher. Vor der Veröffentlichung bei ELWIS/WSV die Nutzungsbedingungen prüfen und in der App eine Quellenangabe machen.
- **L3 Schriften Baloo 2 und Nunito:** frei (SIL Open Font License). Die Lizenzdatei muss mitgeliefert werden (`fonts/OFL.txt`).
- **L4 ElevenLabs-Stimmen:** bezahltes Abo vorhanden (Nutzer, 09.10.2026). Kommerzielle Nutzung ist damit erlaubt. Stimmen aus der „Voice Library“ können eigene Bedingungen haben. Welche Stimmen genutzt werden, steht im Manifest.
- **L5 App-Icon** (`icon-192/512.png`): von Claude erstellt, in Ordnung.
- **L6 JSZip** (von cdnjs, MIT-Lizenz) ist in Ordnung, Hinweis unter „Über die App“.
- **L7** Alle Zeichnungen sind selbst gezeichnete SVGs im Code, die Karte ist erfunden. Beides ist in Ordnung.

## 6. Fahrplan bis zur Veröffentlichung
Reihenfolge nach Wichtigkeit, jeder Block ist ein Lauf.

**Block A: Crew und Ton (zuerst, weil die Stimmen davon abhängen)**
- **V1 Drei Figuren:**
  - Hinnerk, Smilla und Klabauter, dazu Harms als Prüfer.
  - Ilse und Piet entfallen. Spielstände mit ihnen werden still umgestellt (R7). Die Crewwahl im Kennenlernen fällt weg.
- **V2 Bordkatze Backbord:** ohne Stimme. Sie taucht an Deck und in der Kajüte an wechselnden Stellen auf, schläft, jagt die Maus, sitzt auf dem Kartentisch und miaut beim Antippen. Ein paar ihrer Streiche sind Easter-Eggs.
- **V3 Ton ab 12:** alle festen Sätze, die Folgen, die KI-Leitplanken (`styleRules`, `TONE`, `TEASE`) und das Kennenlernen durchgehen. Anzüglichkeiten raus, derb und hart bleibt. Alle werden aufgezogen.
- **V4 Moin-Bausteine:** wie in §4 beschrieben.
- **V5 Schein-Einführung durch die Crew:** Beim Wählen eines Scheins erzählt die Crew wie im Gespräch:
  - was das für ein Schein ist und wofür man ihn braucht
  - wie die Prüfung abläuft (Theorie, Praxis, Zeit, Bestehensgrenze)
  - was man lernt und wie lange es etwa dauert
  - was einen an Bord erwartet

  Feste Sätze, überspringbar, ersetzt die heutigen Zwei-Satz-Einführungen je Schein.

**Block B: Stimmenpaket**
- **V6 Teil 1 erzeugen:** feste Sätze und Moin, mit Probe vorab (§4). Danach liegen die Stimmen für alle Nutzer in der App.
- **V7 Werkzeug „nur Fehlendes nachliefern“** prüfen und im Bericht die Zeichenzahl nennen.
- **V8 Teil 2 (Folgen):** erst nach der Überarbeitung durch den Nutzer.

**Block C: Boot und Spiele**
- **V9 Nur noch eine Bootsansicht:**
  - Die lange Ansicht entfällt. Steuerrad, Niedergang und die verbauten Ausrüstungsteile liegen in der einen Ansicht.
  - Die Eggs, die es nur in der langen Ansicht gab, ziehen um: Angel, Flaggen, Frachter, Nebelglocke, Kompass mit Messer, Rettungsring.
  - Manche Eggs erscheinen nur manchmal: die Angel bei ruhigem Wetter, der Frachter nachts.
  - Kompass mit Messer kommt an den Kartentisch, die Nebelglocke in die Kajüte.
- **V10 Steuerrad in der Bootsansicht von der Seite:** schmales Oval mit Säule.
- **V11 Bauteile-Spiel:** Jede Stelle des richtigen Bauteils zählt, z. B. das ganze Segel. Dafür bekommt jedes Bauteil eine eigene Trefferfläche statt eines kleinen Kreises.
- **V12 Knoten** (Vorschlag, Inhalte nach der amtlichen Prüfungsrichtlinie für die praktische Prüfung). Die Knoten sind selbst gezeichnet und animiert, Fotos braucht es nicht.
  - **Knotenbrett in der Kajüte:** Jeder Knoten wird Schritt für Schritt als Animation gezeigt, z. B. Achtknoten, Kreuzknoten, Palstek, Schotstek, Webeleinstek, Rundtörn mit zwei halben Schlägen und Belegen einer Klampe.
  - **Spiel „Knotenkunde“** in der Spielekiste mit drei Runden-Arten:
    1. Erkennen: Welcher Knoten ist das?
    2. Wofür: Für eine Lage den passenden Knoten wählen, z. B. „ein festes Auge, das sich nicht zuzieht“ → Palstek.
    3. Reihenfolge: die Schritte in die richtige Reihenfolge tippen.
  - Punkte, Trophäen und Crew-Rekord wie bei allen Spielen.
  - **Übung mit echtem Tau:** Die Crew stoppt die Zeit, du bewertest dich selbst.

**Block D: Törn**
- **V13 Karte im Törn:** Sie folgt dem Boot in der Mitte, bis man selbst schiebt. Dann bleibt sie stehen. Der Knopf „Zurück zum Boot“ holt sie wieder. Ein automatisches Zurückspringen gibt es nicht.
- **V14 Minispiele als Bonusrunden:**
  - Höchstens 1–2 pro Etappe, jeweils passend zur Lage:
    - Anlegen → Manöver
    - Nacht → Lichter
    - Nebel → Schallsignale
    - Tonnen → Slalom
    - Feuer → Leuchtfeuer
    - Motor → Motorkunde
    - Flaute → Fischfang
  - Kurzrunde von 30–60 Sekunden. Gutes Ergebnis = mehr Ertrag (Bordkasse, Proviant), schlechtes kostet kaum etwas.
  - Zählt nicht für Rekorde.
- **V15 Musik im ganzen Törn gesperrt:** auch in Minispielen, Ankreuz-Runde, Laden und Logbuch. Meer, Wind, Motor und Signale bleiben.
- **V16 Kleinere Reste** (Claude entscheidet): Standort per Landmarken-Peilung, Lagemeldung der Verkehrszentrale, eigene Geräusche für Wind und Alarm.

**Block E: Veröffentlichung**
- **V17 Lizenzen klären** (§5): Der Nutzer liefert die Herkunft von L1, L4 und L5. Claude ergänzt `fonts/OFL.txt` und eine Seite „Über die App“ mit Quellen.
- **V18 Rechtliches:** Datenschutzerklärung, Impressum (in Deutschland meist Pflicht) und eine Einwilligung vor der ersten KI-Nutzung. Konto-Löschung nur, falls es Konten gibt (E2).
- **V19 Katalogfehler beheben:**
  - SBF 279 (doppelte Antwort)
  - SBF 285 und Binnen 253 (angehängter PDF-Text)
  - SKS nav-92 (leere Antwort) und recht-23 (abgeschnittene Frage)
  - „Stand 2006“-Reste in SKS-Antworten

  Claude prüft gegen die ELWIS-Kataloge, so weit sie erreichbar sind.
- **V20 Letzter Feinschliff:** Ladezeit, Offline-Start, Zurück-Taste, und die Handy-Checkliste (§8) mit dem Nutzer durchgehen.

**Nach der Veröffentlichung:** Folgen für SKS und Binnen, Unter Deck im Schnitt, Funk und Pyro (sobald Kataloge da sind), Konten und KI-Tageslimit, Store-App (Capacitor).

## 7. Code-Karte
*Stand v4.42. Ändert sich mit Block C (eine Bootsansicht) und Block A (drei Figuren).*
- **KI und Kosten:**
  - KI-Schalter `S.cfg.ki` (Standard an), `kiOn()`, `applyKi()` setzt `body.noki` und `body.nodev`
  - Kostenknöpfe haben die Klasse `.ki` (grau („ausgegraut“) mit ✦) und verschwinden bei ausgeschalteter KI. Automatische KI-Aufrufe gibt es nicht.
  - `ai()` zählt `S.kiUse` {day, n}; `KI_LIMIT` (0 = aus) für das spätere Tageslimit
  - Sprech-Arten: `fixed` (fester Satz, kommt ins Paket), `story`, `live` (KI-Antwort), `local` (wechselnder App-Text, nie ElevenLabs)
  - Entwickler-Werkzeuge `.dev`, `devOn()` (an bei ElevenLabs-Schlüssel oder `S.cfg.dev`)
- **Einführungen (5.10):** `einfuehrung(id)` liest `INTROS` (`data/einfuehrungen.json`), merkt `S.intros[id]`, gibt ein Promise zurück (der Hocker wartet darauf)
- **Fragekarten:** `data/karten-sbf.json`, `karten-bin.json`, `karten-sks.json` ({k: {Schlüssel: {e, m, f}}}), Schlüssel `sbf:n`, `bin:n`, `sks:<id>`
  - `KARTEN`, `cardOf`, `cardHtml`, `localMn`, `localLesson`, `askCrewBox` (grauer Rückfrage-Kasten), `qContext`, `TUTOR` (Leitplanken), `readCls`
- **Stimmenpaket:** `PACK.voices` (Manifest legt die Stimmen fest), `VOX.voiceOf`, `packLines` (alle Crews), `packVoices`, `downloadPack` (ZIP-Teile unter 20 MB plus `geschichten.json`), `buildVoicePack`, `exportClips`
  - Werkzeuge: `tools/stimmen-import.js` (ZIPs aus `import/`), `tools/stimmenpaket.js` (direkt mit `ELEVENLABS_API_KEY`)
- **Offline:** Schriften in `fonts/`, `offlineStock()` (einmal pro Version), `sw.js` mit `MEDIEN` (Versionsname des Medien-Speichers)
- **Zurück-Taste:** `initBackKey`, `handleBack` (Reihenfolge `BACKS`), `guardBack`
- **Zuhören:** `AUD.hush` schaltet Musik und Geräusche beim Zuhören stumm
- **Navigationsschule** liegt in `navi.js` (nachgeladen über `loadNavi()`; `navSchool()` öffnet `NAV.hub`):
  - Daten: `data/karte.json` (erfundene Kliev-Mündung, Tonnen, Feuer, Mw, Ablenkungstabelle, Stromtabelle), `data/navi.json` (`fibel`, `lektionen` L1–L11)
  - Karte: `proj`/`unproj` (Mercator, Minuten ab 55°N/006°E), `NAV.mountChart` (Zoom, Lupe, Kursdreieck, Zirkel, Stift, Kreuz)
  - Rechnen: `kursDist`, `versegeln`, `kreuzpeilung`, `ablenkung`
  - Lernen: `NAV.fibel`/`term`/`linkTerms`, Aufgabengenerator `GEN` (inkl. `gesamt`; SKS: `versegelung`, `doppel`, `peilAbstand`, `sksGesamt` mit `need`), Folgefehler über `step.folge`, `mgAusMw`, `ABL_TAB`, `NAV.task` + `grade` (Toleranzen `TOL`), `NAV.multi`, `NAV.path`/`lesson`/`exercise`, `NAV.exam` (25 min)
  - Spielstand: `S.navi` {`fibel`, `lek[id]` {`serie`, `sterne`, `n`}, `pruef[]`}; `NAV.kennWorte` (Kennung in Worten)
- **Törn 2.0** liegt in `toern.js` (nachgeladen über `loadToern()` nach `navi.js`; das Steuer an Deck ruft `openToern()` → `TOERN.open`):
  - Daten: `data/toerns.json` (`stufen` mit `scheine`, `aufgaben`, `schaden`, `ohneTeil`, `empfohlen`; `orte`; 15 `toerns` mit `etappen[].wp`), `data/ereignisse.json` (`ereignisse` mit `ref` auf amtliche Fragen, `gen` Kartenaufgaben, `fahrzeuge` Lichter/Signalkörper, `tags`, `crew`), `data/ausruestung.json` (`start`, `teile`), `data/tags.json`, `data/sks-mc.json`
  - Kern ohne DOM `TOERN.core` (auch in Node): `tagWetter`, `bericht`, `entscheid`, `plan`, `genKandidaten`, `zeit`, `folgen`, `malus`, `sterne`, `simulate`
  - Oberfläche: `TOERN.open` (Törnwahl), `starten`, `weiter` (springt in die gespeicherte Phase), `aufwachen`, `wetterbericht`, `fahrt` (Canvas `draw`: Himmel, Land per Strahl `rayLand`, Tonnen mit Kennung `lightOn`, Schiffe `drawShip` mit Lichtern nach Lage, Nebel, Regen, Deck, Wanten als Peilmarke, Steuerrad, Verklicker), Mini-Karte über `NAV.mountChart`, `zeigeAufgabe`/`antwort` (Reaktionszeit, Signale tuten, Peilen, Fernglas), `frageAufgabe` (SBF, SKS-MC, „nur offen“), `genAufgabe` (Tonne, Kardinal, Feuer, Lichter, Signalkörper, Strom, Kurs selbst absetzen), `etappeEnde`/`nachbesprechung`, `seenot`, `laden` (Bootsladen), `logbuch`, `TOERN.mcRunde` (SKS-Ankreuzrunde)
  - Spielstand: `S.toern2` {`kasse`, `prov`, `sprit`, `teile[]`, `vorrat{}`, `log[]`, `seen{}`, `provDay`, `schnitt{}`, `lauf`: {`id`, `si`, `e`, `tag`, `phase`, `w`, `plan`, `t`, `i`, `card`, `zustand`, `laune`, `punkte`, `eRes[]`, `res[]`, `sterne[]`}}; Standard `null`. Der alte `S.toern` bleibt unangetastet, sein Logbuch zeigt `toernCard` mit an.
  - Am langen Boot zeigt `ausrArt()` verbaute Teile. `AUD.sfx`/`AUD.horn` können mit `pan` links/rechts klingen.
- **Dateien:**
  - `index.html` (Code und CSS, ~481 KB; große neue Bereiche in eigene Dateien, R11)
  - `sw.js` (Cache; `VERSION` immer gleich `__ver`)
  - `navi.js`, `toern.js` (nachgeladen), `data/einfuehrungen.json` (5.10)
  - `tests/smoke/rauchtest.js`, `.githooks/pre-commit` (Rauchtest vor jedem Commit)
  - `manifest.webmanifest`, `icon-192/512.png`
  - `data/`: `sbf.json`, `sks.json`, `binnen.json`, `nav.json`, `folgen.json`, `lexikon.json`
  - `img/q/` (SBF-Bilder), `img/b/` (Binnen-Bilder, auch SBF 16–30)
  - `audio/`
  - `audio/stimmen/` (Stimmenpaket mit `manifest.json`; legt auch die Stimmen fest, noch leer)
  - `docs/`: Konzepte, `archiv/` (alte Briefe), `toern2-plan.md`, `lauf3-plan.md`, `feste-saetze.md`
  - `tests/`: `smoke/rauchtest.js` (Rauchtest mit eigenem Server), `toern-daten.js`, `balancing.js`; `tools/`: `tag-fragen.js`, `sks-mc-pruefen.js`, `json-kompakt.js`
- **Start:**
  - `startApp` → `loadData` (alle `data/`-Dateien) → `boot` → `splash` → `runIntro` (Streit, `INTRO`) → `convoOnboarding` (Knöpfe plus Textfeld; `ONB`, `ONB2`, `ONB2_OPTS`, `NICKS`) → `keysStep` → `endIntro`
  - Flag `introV5` wird erst in `endIntro` gesetzt. `?neustart` setzt die Intro-Flags zurück, `S.reOnb` erzwingt neue Fragen.
- **Deck:**
  - `renderBoat` mit zwei Ebenen über `deckView`: `boatScene` (Übersicht = Übermenü, kein Wischen, Knopf „An Bord gehen“, darunter das Rennen `courseCard`) und `longBoatScene` (Nahansicht nur Deck, viewBox 0 30 1200 305, wischen; Steuerrad startet den Törn)
  - Hilfen: `ovToDetail`, `bindPano(pano, key, centerX)`
  - Eggs: `startEgg` mit Handlern je `data-egg`
  - Fernglas: `bindFernglas`, `GAME_KEYS`, `BOAT_HINTS` / `DETAIL_HINTS`
- **Kajüte:**
  - `renderCabin`, `cabinScene`, `CABIN_SPOTS` (`fn` = vom Fernglas markiert), `SPOT`, `TAP`
  - Erstbesuch: `cabinWelcome` (Texte `CABIN`, SKS-Quiz, `fahrplanSheet`)
  - Hocker: `bgSit`
  - Prüfer: `harmsKommt(via)` (Telefon `telefon` oder Crew-Menü „Hol Kapitän Harms“), Sätze `HARMS`, danach `examIntro('harms')`
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
  - `COURSES` (`sbf`, `sks`, `binnen`), `COURSES_SOON` (Funk, Pyro: ausgegraut), `useCourse`, `switchCourse`, `QN`, `TOPICS`
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

## 8. Status (von Claude gepflegt)

### Lauf 4 (ab 09.10.2026)
- [x] v4.43 V1 Drei Figuren: feste Crew Hinnerk, Smilla, Klabauter (+ Harms), `SPRECHER`, alte Spielstände still umgestellt, Stimmenpaket und Bestenliste nur noch mit diesen (`NPC_IDS`, Katze miaut)
- [x] v4.44 V3 Ton ab 12: KI-Leitplanke `TONE.erw` ohne Anzüglichkeiten, SBF und SKS werden beide aufgezogen, 5 feste Sätze entschärft (Liste in `docs/feste-saetze.md`)
- [x] v4.45 V4 Moin-Bausteine: `MOIN_BAU` je Figur, `moinKette` (Käpt'n ~90 %, Smilla/Klabauter je ~22 %), gezogene Moins überall gedehnt
- [x] v4.46 V5 Schein-Einführung: `schein_sbf/sks/binnen` (was, wofür, Prüfung, Lernstoff, Praxis), einmal beim Kajütenbesuch und beim Scheinwechsel, jederzeit über „Was erwartet mich …“ in der Schein-Auswahl; `einfuehrung(id, nochmal)`
- [x] v4.47 V2 Bordkatze Backbord: stumm, wechselnde Plätze in der Kajüte (`CAT_SPOTS`, `catPlace`), springt beim Antippen woanders hin; Eggs `katzewach`, `katzekarte`, `katzemaus` (32 Eggs). An Deck kommt sie mit V9.
- [ ] V6 Stimmenpaket Teil 1: Werkzeug fertig (`tools/stimmenpaket.js --teil1`, `--probe`, `--modelle`, nur fehlende Sätze), Trockenlauf 320 Sätze / 22.234 Zeichen. **Wartet auf Secret `ELEVENLABS_API_KEY` und Freigabe von `api.elevenlabs.io` (E5).**
- [x] v4.48 V15 Musik im ganzen Törn gesperrt: `window.TOERN_STILL` (gesetzt in `shell`/`TOERN.open`, gelöscht in `setTab`), `AUD.playMusic` spielt dann nichts
- [x] v4.49 V13 Karte im Törn: folgt dem Boot genau mittig (`ctl.center`), nach eigenem Schieben/Zoomen bleibt sie stehen, Knopf „⌖ Zurück zum Boot“
- [x] v4.50 V10 Steuerrad in der Bootsansicht von der Seite (schmales Oval auf der Säule, Griffe oben und unten)
- [x] v4.51 V11 Bauteile-Spiel: Trefferflächen je Bauteil (`PARTS[].f`, `partHit`: Vieleck, Linie, Kreis, Rechteck), bei Fehltipp „Das war: …“
- [x] v4.52 V9 Nur noch eine Bootsansicht: lange Ansicht (`longBoatScene`, `bindPano`, `ovToDetail`) entfernt; Rettungsring, Flaggen (Leine am Achterstag), Angel (nur bei ruhigem Wetter, 60 %), Frachter (nur nachts) und Ausrüstung (`ausrArt`) in der Übersicht; Nebelglocke, Kompass und Messer in der Kajüte; Seekrank-Egg: 7× schnell aufs Wasser tippen
### Jetzt dran
- Block A (V1–V5), danach Block B (V6, sobald E5 entschieden ist).

### Entscheidungen
- **E1 Altersfreigabe:** ab 12 (Nutzer, 09.10.2026). Ton siehe §3 und V3.
- **E2 KI-Funktionen bei der Veröffentlichung:** nur mit eigenem Schlüssel, sonst aus. Die Stimmen kommen aus dem Paket (Nutzer, 09.10.2026). Wunsch: auch andere Anbieter-Schlüssel (z. B. Gemini) zulassen.
- **E3 Veröffentlichung:** als etwas zum Verschicken mit eigenem Icon auf dem Handy. Weg: Installieren-Knopf in der App (Web-App mit Icon) und zusätzlich eine Android-Datei (APK), falls mit vertretbarem Aufwand machbar (Nutzer, 09.10.2026).
- **E4 KI-Tageslimit:** vorerst unbegrenzt (`KI_LIMIT` 0), ein Limit kommt später.
- **E5 Stimmenpaket, offen:**
  - **(a) Empfehlung:** Secret `ELEVENLABS_API_KEY` und Domain `api.elevenlabs.io` in der Cloud-Umgebung freigeben, dann erzeugt Claude das Paket.
  - **(b)** Export am Handy.
- **E6 Stimmenqualität:** hoch (Nutzer). Vor der Erzeugung Modellprüfung und drei Probesätze.
- **E7 „Weiter“-Knöpfe:** bleiben gelb-orange (Nutzer, 09.10.2026).
- **E8 Cloudflare-Worker:** gestrichen, Supabase übernimmt das bei Bedarf (Nutzer, 09.10.2026).
- **E9 Konten mit Supabase:** freigegeben (05.10.2026), aber erst nach der Veröffentlichung (siehe E2).
- **E10 Folgen:** Der Nutzer überarbeitet sie selbst, danach Stimmenpaket Teil 2.

### Handy-Checkliste (macht der Nutzer)
- Mikrofon im Gespräch, Zurück-Taste (App und Browser), Offline-Start, Lautstärke der Stimmen
- Moin-Varianten, Telefon und Harms, Lesbarkeit der Karte im Törn
- Einführungen, Minispiele im Törn (sobald gebaut)

### Hinweise und offene Kleinigkeiten
- Der Ordner `quellen/` fehlt in der Cloud. Die SKS-Kartenaufgabe (L11) stützt sich nur auf den SKS-Katalog in der App. Ein Abgleich mit den Original-Kartenaufgaben ist optional.
- `tools/stimmenpaket.js` ist noch nie mit echtem Schlüssel gelaufen (nur Trockenlauf).

### Erledigt (Kurzfassung, Details in `docs/archiv/claude-v3.md`)
- [x] Läufe 1–2 (v4.10–v4.23): Intro mit Streit, Fernglas, Spielekiste mit Trophäen, Easter-Eggs (29), SBF Binnen, Lexikon, Navigationsschule (Karte, Fibel, Lektionen 1–9, Prüfungsmodus)
- [x] Architektur-Lauf (v4.24–v4.32): KI-Schalter, graue Kostenknöpfe, Stimmenpaket-Technik, Offline, Zurück-Taste, Fragekarten
- [x] Törn 2.0 (v4.33–v4.35): Sicht vom Steuer, 15 Törns, Aufgaben, Wetter, Ausrüstung, SKS-Ankreuzfragen, Balancing, drei offene Törns in der Liste
- [x] Lauf 3 (v4.36–v4.42): Übersicht mit Rennen aller Scheine, gezogenes Moin, Einführungen, Navi-Prüfung mit SKS-Lektionen L10/L11, Telefon für Harms, Funk/Pyro ausgegraut, Rauchtest vor jedem Commit
- [x] v4.42: Brief neu gefasst (Version 4), alte Fassung archiviert
