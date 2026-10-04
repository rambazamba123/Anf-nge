# Skipper – Projekt-Brief für Claude Code
Stand: App v4.4, 04.10.2026. Diese Datei liegt im Hauptordner des Repos. Claude Code liest sie automatisch.

## 1. Worum es geht
„Skipper“ ist eine Lern-App für Bootsführerscheine:
- SBF See (fertig)
- SKS (Katalog drin, Kajüten-Folgen fehlen)
- SBF Binnen (fehlt)
- später Funk (SRC/UBI) und Pyrotechnik (FKN)

Man lernt an Bord einer Segelyacht. Die Crew besteht aus Käpt'n, Matrosin und Papagei, geprüft wird von Kapitän Harms. Beim Start wird gefragt, für welchen Schein man lernt.

Die App läuft als eigene Web-App auf GitHub Pages, nicht als Claude-Artefakt, weil Artefakte kein Mikrofon und keine eigene Sprachausgabe erlauben. Hauptgerät ist Android mit Chrome im Hochformat, langfristig sollen alle Plattformen laufen.

Nutzer sind im Moment nur ich. Später testen Freunde, gern auch mit meinen Keys. Einen echten Prüfungstermin gibt es nicht: Es geht um die App selbst.

**Wann ist die App fertig?**
- Erkunden wie bei Moorhuhn: ein langes Boot, herangezoomt, das Sichtfenster lässt sich nur waagerecht wischen.
- Viele Easter-Eggs, auch raffinierte, bei denen man erst herausfinden muss, was zu tun ist.
- Unter Deck im Schnitt.
- Ein Lexikon mit allen Zeichen, Lichtern, Tonnen und Symbolen in Originalgrafik aus der Prüfung.
- Ein richtig gutes, realistisches Navigationsspiel und ein digitaler Törn.
- Scoring für alle Spiele.
- Texte und Audios werden gespeichert, damit kaum Tokens oder Credits verbraucht werden.

## 2. Arbeitsregeln (immer)
- **Antworten:** kurz, auf Deutsch, laienverständlich. Ich bin GitHub-Anfänger.
- **Fragen:** Bei Unklarheit erst fragen. Nichts erfinden, Unsicherheit offen sagen. Sag mir, wenn ich etwas übersehe, und sei kreativ.
- **Prüfungsinhalte:** nur aus den amtlichen Katalogen (ELWIS). Fachlich muss alles korrekt sein.
- **Planen:** Erst einen kurzen Plan zeigen, dann umsetzen. Eine Etappe nach der anderen, nicht alles auf einmal.
- **Editieren:** Gezielt editieren, nie die ganze `index.html` neu schreiben. Die Datei ist groß, also mit Suchen und Ersetzen arbeiten.
- **Testen:** Nach jeder Etappe testen. Lokal läuft ein Server mit `python -m http.server`, bitte nicht per `file://` öffnen. Wenn möglich mit Playwright-Screenshots im Hochformat (400×860), sonst mir sagen, was ich im Browser prüfen soll. Die JS-Konsole muss frei von Fehlern sein.
- **Version und Sicherung:** `__ver` in `index.html` hochzählen, dazu immer gleich `VERSION` in `sw.js` (sonst erscheint am Handy kein „Jetzt laden“). Nach jeder Etappe einen Git-Commit mit klarer Nachricht machen.
- **Spielstände nie brechen:** Speicher-Key `skipper-sbfsee-v1`. Interne IDs bleiben, z. B. heißt der Prüfer intern weiter `kroeger`. Neue Felder immer mit Standardwert.
- **Schlüssel:** Keys (Anthropic, ElevenLabs) liegen nur im Browser. Nie ins Repo schreiben, nie ausgeben.
- **ELWIS-PDFs:** liegen in `quellen/` und stehen in `.gitignore`, sie werden nicht veröffentlicht. Für Bilder in der App die Originalgrafiken ausschneiden und in `img/` ablegen.

## 3. Stil und Ton
- **Grafik:** warm, flach, gezeichnet, im Stil von Pettersson und Findus oder Janosch. Wenige Details, kein Kitsch. Die Szenen bauen sich aus Tageszeit und Wetter auf.
- **Crew:** witzig, herzlich, plattdeutsch angehaucht. Der Papagei wiederholt Schlagworte.
- **Rangordnung:** SBF-Lernende werden liebevoll aufgezogen und nicht ganz ernst genommen („Badewannen-Kapitän“, „Gummiente“). SKS-Lernende bekommen spürbar mehr Respekt, fast wie unter Kollegen. Das steuert `styleRules()`.
- **Frechheit:** immer FSK 18 (seit v4.8, keine Altersfrage mehr): derber Seemannssprech, viele doppeldeutige Witze, Metaphern aus der Seefahrt. `ageGroup()` liefert immer `erw` (`TONE.erw`, `TEASE`).

## 4. Architektur
```
index.html          gesamter Code und CSS  ~385 KB
data/sbf.json       SBF-See-Katalog (DATA), seit v4.6 ausgelagert
data/sks.json       SKS-Katalog (SKS_DATA)
data/nav.json       die 15 Navigationsaufgaben (NAV_TASKS)
data/folgen.json    Kajütenfunk-Folgen und Kurzgeschichten ({episodes, shorts})
                    → alle vier lädt loadData() beim Start (startApp), danach boot()
img/q/*.jpg|png     Original-Katalogbilder (seit v4.4 ausgelagert)
manifest.webmanifest, icon-192.png, icon-512.png   installierbare App
audio/*.mp3         Musik und Geräusche
audio/stimmen/      Stimmenpaket: fertige Crew-Sätze + manifest.json
sw.js               Service Worker (Update-Hinweis)
quellen/            ELWIS-PDFs, nur lokal (.gitignore)
```

**Code-Landkarte (Funktionsnamen in `index.html`):**
- **Start:** `boot` → `splash` → `runIntro` (Streit am Steg, Text in `INTRO`) → `convoOnboarding` (Auswahlknöpfe plus eigenes Textfeld; feste Sätze in `ONB`, `ONB2`, `ONB2_OPTS`, Namensvorschläge `NICKS`; eigener Text → Claude-Antwort, sonst `ONB_FREE`) → `keysStep` → `endIntro`. Das alte Formular `onboardingForm` ist nur Notlösung.
- **Erstes Mal in der Kajüte:** `cabinWelcome` (Sätze in `CABIN`): Lernplan erklären, bei SKS 5 SBF-Fragen mit Crew-Urteil, Zusammenfassung aus Bausteinen, dann `fahrplanSheet` (`fahrplan()`). Flag `S.cabinWelcome`.
- **Steckbrief:** `S.profile.facts` (max. `FACTS_MAX`), ergänzt über `addFact` (Kennenlernen und `F:`-Zeilen im Gespräch), in den Einstellungen einzeln löschbar; „Kennenlernen neu starten“ setzt `introDone`/`cabinWelcome` zurück.
- **Deck:**
  - `renderBoat`, `boatScene` (SVG, viewBox `0 40 400 380`, im `.pano`-Scroller), `bindPano`
  - Hotspots: `BOAT_HINTS`, `startEgg`, `kisteHint`, Fernglas mit `GAME_KEYS`, `EGG_LABELS`
  - Boot-Look: `LOOK`, `boatLook()`, gespeichert in `S.boat`
- **Kajüte:**
  - `renderCabin`, `cabinScene`; Klickflächen in `CABIN_SPOTS`, Aktionen in `SPOT`, kleine Animationen in `TAP`
  - Hocker: `bgSit`, `bgStop`, `bgPick` (Hintergrund-Gerede, `S.bgHeard`, Stimme gedämpft über `window.VOXDIM`)
  - Lexikon: `renderLexikon`
- **Spiele:**
  - Liste und Rekorde: `GAMES`, `gamesHub`, `gameScore`, `best()`, `S.best`; Gerüst: `gameShell`, `canvasGame`, `gameOver`
  - Einzelspiele: `hornQuiz` (`SIG_QS`), `lightsGame` (`LIGHTS`), `lighthouseGame`, `buoyGame`, `maneuverGame` (`MANEUVERS`; Motor an/aus, Gashebel stufenlos), `navGame` (`S.nav`), `motorGame`, `partsGame`, `fishGame`, `trapRound`
- **Folgen:** `EPISODES.sbf` (25 Folgen, `EPISODES.sks` ist leer), `SHORTS` (20 Stück), `playEpisode`, `epFill` (setzt `{A:n}` und `{Q:n}` ein), `showStory`
- **Stimme:**
  - `VOX` mit `say`, `lines`, `clip`, `ensureVoices`, `listen`
  - Zwischenspeicher: `CLIPS` (IndexedDB)
  - Stimmenpaket: `PACK` (lädt `audio/stimmen/manifest.json`), `packLines`, `buildVoicePack` (nur fehlende feste Sätze), `exportClips` (neue Aufnahmen aus dem Gerät als ZIP), `pclean`
  - Jede ElevenLabs-Aufnahme wird mit Figur und Text in `CLIPS` (IndexedDB `skipper-audio` v2, Stores `clips` und `meta`) gespeichert
  - Geräusche und Musik: `AUD` mit `sfx`, `loop`, `playMusic`, `weather`
- **Zeit:**
  - `SHIP_DAY_MS` (50 Minuten = 1 Tag), `shipHour`, `dayPart`, `tickDay` (Farben wechseln live)
  - Aussehen: `palette`, `styleVars`, `weatherToday`
  - Einstellung `S.cfg.cycle` mit „schnell“ oder „echt“
- **Kurse:** `COURSES` (sbf/sks), `useCourse`, `QN`, `TOPICS`, `topicOf`, `ansText` (bei SBF ist `a[0]` richtig)
- **Crew:** `CREW`, `ROLE_OPTIONS`, `cid(role)`, `nameOf`, `styleRules`
- **Sonstiges:** `renderSettings` (Einstellungen), `LOG.add` (Protokoll)

**Stimmenpaket-Prinzip:** Feste Sätze enthalten keine Namen und werden einmal mit ElevenLabs erzeugt. Sie liegen dann als MP3 in `audio/stimmen/`. `clip()` schaut zuerst ins Paket, dann in IndexedDB und erst danach bei ElevenLabs. Alles, was oft wiederholt wird, muss so gespeichert werden.

## 5. Fertig (v4.3 und v4.4)
- Panorama-Deck. Es nutzt allerdings noch die alte, kurze Bootszeichnung.
- Spielekiste mit Rekorden. Deck-Objekte wackeln oder tönen nur noch.
- Manöver mit Motor an/aus, Startsperre und stufenlosem Gashebel.
- Prüfer heißt jetzt Kapitän Harms.
- Längeres „Moooin“.
- Tag und Nacht in 50 Minuten.
- Kennenlernen als witziges Auswahl-Gespräch.
- Stimmenpaket-Generator.
- Hocker in der Kajüte startet das Hintergrund-Gerede.
- Lexikon aus den 58 SBF-Bildfragen (206/207 seit v4.9 mit Kennung).
- Pinsel: Name, Rumpf, Streifen, Segel.
- Bilder ausgelagert.

## 6. Etappen (Reihenfolge, je mit Abnahme)
**E0 Start-Check.** `git status` prüfen, `__ver` prüfen (soll 4.4 sein, `img/q/` vorhanden), lokalen Server starten und einen Rauchtest machen. Fehlt Git, mir Schritt für Schritt helfen, z. B. mit GitHub Desktop.

**E1 Kataloge auslagern.**
- Ziel: `DATA` → `data/sbf.json`, `SKS_DATA` → `data/sks.json`, beim Start mit `fetch` laden und einen Ladebildschirm zeigen.
- Abnahme: `index.html` deutlich unter 400 KB, alle Funktionen laufen weiter.

**E2 Navigation, das Herzstück.**
- Kartentisch mit einer selbst gezeichneten Übungskarte. Keine BSH-Karte, wegen der Rechte.
- Werkzeuge:
  - Kursdreieck und Anlegen eines Kurses
  - Zirkel für Distanzen am Breitengrad-Rand
  - Peilung und Kreuzpeilung
  - Missweisung und Deviation (rwK → mwK → MgK)
  - Strom- und Windversatz, Koppelort, Gezeiten
- Inhalte: die 15 amtlichen Navigationsaufgaben aus `quellen/` als Aufgabentypen. Bewertung nach dem amtlichen Bewertungsschlüssel, mit Toleranzen.
- Abnahme: Ich löse eine Aufgabe komplett am Handy, und es fühlt sich echt an.

**E3 Törn-Light.**
- Auf derselben Karte gibt es Etappen von Hafen zu Hafen.
- Ablegen, Motor oder Segel, Kurs halten.
- Ereignisse unterwegs: Tonne, Feuer, Nebel, Verkehrstrennungsgebiet, Mensch über Bord.
- Dabei kommen Prüfungsfragen, Nacht und Wetter laufen über die Schiffszeit, das Logbuch füllt sich.
- Zuerst ein Konzept auf einer Seite, das ich freigebe.

**E4 Langes Panorama-Boot.**
- Das Boot wird neu als lange Zeichnung gebaut, etwa 3 Bildschirmbreiten, im Stil aus Abschnitt 3.
- Bug, Mast, Cockpit, Pinne, Motor und Niedergang liegen nebeneinander.
- Nur die wichtigsten Dinge sind beschriftet.

**E5 Unter Deck im Schnitt.**
- Räume: Maschinenraum, Kojen (Hinlegen startet ebenfalls das Gerede), Funkecke, Kombüse, Navi-Tisch.
- Vorschlag, bitte bestätigen: Die Spielekiste bleibt die zentrale Liste. Die Räume sind zusätzliche Eingänge, z. B. Navi-Tisch → Kartentisch, Funkecke → Schallsignale, Maschinenraum → Motorkunde.

**E6 Easter-Eggs.**
- Ziel: mindestens 10 neue, ein Teil davon raffiniert und nur in mehreren Schritten zu entdecken.
- Ideen:
  - Kompass, dazu ein Messer auf den Tisch legen → die Nadel springt (Deviation)
  - Seewasserfilter mit Krabbe
  - Barometer fällt → Wetter schlägt um
  - Nebelglocke, die antwortet
  - Nachts Möwe und Frachter mit Lichterführung
  - Schlingerleiste in der Kombüse
  - Angel mit Flaschenpost
  - Glasen zur Schiffszeit
  - Signalflaggen buchstabieren den Namen
- Gefundene Eggs zählen als Sammlung im Logbuch.

**E7 Lexikon komplett.**
- Inhalte: alle Lichter, Signalkörper, Tonnen und Betonnung, Schallsignale (mit Ton), Flaggen, Tafelzeichen und Kartensymbole.
- Quelle: Originalgrafiken aus den ELWIS-PDFs, nach Thema sortiert, mit Suche.
- Querverweise: Lexikon → passende Fragen und umgekehrt.

**E8 SBF Binnen.**
- Katalog aus `quellen/Fragenkatalog_Binnen.pdf` übernehmen, mit Bildern.
- Den Kurs in `COURSES` anlegen.
- Prüfungsmodus nach amtlicher Regel.

**E9 Folgen ergänzen.** Kajüten-Folgen für SKS und Binnen im Stil der SBF-Folgen schreiben, mit Quiz-Stopps und `{A:n}`-Platzhaltern.

**E10 Scoring einheitlich.** Jedes Spiel speichert einen Rekord, auch Horn-Quiz und Prüfungsfallen. Die Rekorde stehen in der Spielekiste und im Logbuch.

**E11 Ausblick.** Funk (SRC/UBI) und Pyrotechnik (FKN) als weitere Kurse.

## 7. Offene Entscheidungen (mich fragen, wenn es so weit ist)
- Cloudflare-Worker als Vermittler, damit Tester ohne eigene Keys auskommen: ja oder nein? Bis dahin bleiben die Keys im Browser.
- E5: Spiele in den Räumen oder nur in der Spielekiste? Mein Wunsch war „alle an einem Ort“, der Vorschlag oben verbindet beides.
- Für das Knotenbrett fehlen noch Fotos.

## 8. Upload zu GitHub
Am liebsten macht Claude Code `git add`, `commit` und `push` für mich und erklärt dabei kurz, was passiert. Ohne Git lade ich auf github.com hoch (Add file → Upload files), und zwar alle geänderten Dateien und Ordner. Danach 1–2 Minuten warten und in der App auf „Jetzt laden“ tippen.
