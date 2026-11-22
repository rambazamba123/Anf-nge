# Skipper – Projekt-Brief für Claude Code (Version 6, 17.11.2026)

> **Der Code ist die Wahrheit.** Widersprechen sich Brief und Code, gilt der Code, und der Widerspruch kommt in den Bericht. Die Code-Karte (`docs/code-karte.md`) und Abschnitt 8 (Status) pflegt Claude am Ende jedes Laufs. Nach einem Abbruch geht es immer mit Abschnitt 8 weiter.
> Ältere Fassungen: `docs/archiv/claude-v3.md` (Konzepte Navigationsschule, Törn 2.0, Läufe 1–3) und `docs/archiv/claude-v4-status.md` (alter Fahrplan V1–V42, Status der Läufe 4–5).
> **Nummern zum Kommentieren:** Regeln `R1…`, Vorhaben `V1…`, Lizenzpunkte `L1…`, Entscheidungen `E1…`. Die Nummern bleiben fest, Erledigtes wird abgehakt und nicht neu nummeriert.

## 1. Worum es geht
> **Anker seit 28.10.2026: `VISION.md`.** Skipper ist eine Reise mit einer Crew, die dich zum Bootsführerschein bringt. Etappe für Etappe am Kartentisch geplant, mit Kajütenfunk, Fahrt-Szenen, Knoten mit echtem Tau und Navigation auf der echten Karte; die Crew ist bei allem dabei (feste Sätze, Multiple Choice, vorgefertigte Töne), empfiehlt, und du entscheidest mit. „Frei üben“ geht immer. App gratis, Starter-Set im Buchhandel. Die Vision gilt vor den älteren Angaben in §1 (R16). Plan H0–H10 in §6, Aufräumliste in `docs/aufraeumen.md`. **Seit 10.11.2026:** Gesamtkonzept mit Box (Pier, Modell, Leinen, Seekarte), Reisekarte, Kajüte (Hörreise, Lernkartei, Knotenkunde, Navigationsschule, Praxis in 3D) und Deck (Spaßabteilung) in `docs/spielkonzept.md` (Entwurf, SK1–SK17); Liste für ganz am Ende `docs/am-ende-klaeren.md` (AE1…).

„Skipper“ ist eine Lern-App für Bootsführerscheine: SBF See, SKS und SBF Binnen sind drin. Funk (SRC/UBI) und Pyrotechnik (FKN) kommen, wenn der Nutzer die Kataloge liefert.

Man lernt an Bord des Motorboots „Frieda“ (Ausbildungsfahrt in sieben Tagen, `docs/reise.md`) mit drei Crew-Figuren: **Käpt'n Hinnerk**, **Matrosin Smilla** und **Papagei Klabauter**. Dazu kommt **Bordkatze Backbord** ohne Stimme, die überall herumläuft und Unsinn macht. Geprüft wird von **Kapitän Harms** (interne ID `kroeger`).

Die App läuft als Web-App auf GitHub Pages. Hauptgerät ist Android mit Chrome im Hochformat.

**Lernen in der Kajüte** (Nutzer, 22.10.2026): Alles, was man zum Lernen braucht, hängt in der Kajüte und lässt sich antippen: Seekarte an der Wand (Navigation), Manöverbrett (Manöver), Knotenbrett (Knoten), Bücher und Kartentisch (Meine Prüfungen), Telefon (Harms prüft). Den Fortschritt je Thema zeigt die Übersicht „Meine Prüfungen“, nicht die Kajüte.
**Hörreise** (Nutzer, 07.11.2026, E25): Der Kajütenfunk ist jetzt die Hörreise, ein Hörspiel mit Geschichte und Zwischenfragen zum Hören im Auto oder im Gym, mit Bildern und Animationen und Aufgaben für später (`docs/reise.md` §3, §7). Früher (22.10.2026): Coaching ohne Geschichte. Das finale Konzept (Fassung 5) gilt seit dem Startschuss am 24.10.2026 (V41, K1). Eine Probefolge (Anfang von G6.3 mit Quirin, in echter Dichte etwa sieben Minuten) erzeugt der Nutzer in der App und hört sie über den Hocker in der Kajüte. Geschrieben wird mit maximalem Aufwand im Chat, die App vertont nur (B138).

**Ziel:** Freigabe ab 12 Jahren. Veröffentlichung verschoben (Nutzer, 20.10.2026), ein neuer Termin ist offen. Bis dahin der Umbau nach `VISION.md`.

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
- **R13 Fernglas:** Es markiert nur Dinge mit Funktion: Niedergang, Steuerrad, Kartentisch, Spielekiste, Hocker, Telefon, Seekarte, Manöverbrett, Knotenbrett. Easter-Eggs nie.
- **R14 Bericht** (kurz, immer gleich):
  1. **Fertig und online:** was jetzt in der App neu ist.
  2. **Bitte am Handy testen:** konkrete Handgriffe.
  3. **Deine Entscheidung nötig:** mit Nummer. Zu jeder Nummer (V…, O…, K…, X…, E…) steht immer kurz dabei, was gemeint ist, mindestens ein Stichpunkt oder Beispiel (Nutzer, 24.10.2026).
  4. **Hinweise:** bewusst anders entschieden, Lizenzen, was du übersehen könntest.
- **R15 Podcast (Kajütenfunk):** Vor jeder Arbeit an Podcastinhalten liest Claude `PODCAST_BIBLE.md` und wendet sie an, bei Bedarf auch `PODCAST_STATUS.md`.
  - Die Bible ist das verbindliche Regelwerk für die Folgen. Sie geht älteren Angaben zu den Folgen in dieser Datei vor.
  - Dort dokumentierte Entscheidungen ändert Claude nie stillschweigend: erst vorschlagen, dann die Bestätigung des Nutzers einholen, dann eintragen.
  - Offene Fragen aus `PODCAST_STATUS.md` entscheidet Claude nicht selbst (R3 gilt dafür nicht).
  - Seit 07.11.2026 ist der Kajütenfunk die Hörreise (E25, Bible G8). Vor jeder Arbeit an Folgen liest Claude zusätzlich `docs/reise.md` §7 (Regelwerk HR1 ff.) und `docs/dialog-regeln.md`. Jede neue Rückmeldung des Nutzers zu Folgen wird dort eine nummerierte Regel; was prüfbar ist, kommt in `tools/reiseplan.js`, `tools/podcast-pruefen.js` oder `tools/folgen-pruefen.js`.
  - Seit 16.11.2026 (E26): **Wir machen ein Hörspiel.** Beim Schreiben liegt `podcast/schreibkarte.md` offen (eine Seite), dazu `podcast/dialog-beispiele.md` und die Vorlage `podcast/folgen/VORLAGE.md`; die HR-Regeln sind Nachschlagewerk und Prüfliste (neu HR56–HR60). `node tools/dichte-messer.js` zeigt Hinweise, keine Verbote.
  - Vorher galt das Coaching-Konzept (E12, `docs/konzept-kajuetenfunk.md` Fassung 5); daraus gelten Lehrformen, Bündeln, Themenblöcke, Merksätze und Hörkarten weiter.
- **R17 Fehler nicht zweimal** (Nutzer, 09.11.2026): Vor jedem Bericht geht Claude `docs/fehler-katalog.md` durch (Teil A bei Folgen, Teil B bis E bei Code) und lässt die dort genannten Werkzeuge laufen, nach Änderungen an der Hörreise auch `node tests/buehne-pruefen.js`. Neue oder geänderte Folgen und Animationen gehen vorher ans **Lektorat** (HR61): `node tools/lektorat.js <folge> --bilder`, dann ein unabhängiger Unteragent mit `podcast/lektorat-auftrag.md`; Befunde und Entscheidungen in `docs/lektorat/<folge>.md`. Jeder neue Fehler, den der Nutzer findet, kommt dort hinein, mit Ursache und Prüfung; was prüfbar ist, wird ein Werkzeug.
- **R16 Vision:** Vor jeder größeren Arbeit liest Claude `VISION.md` (Anker seit 28.10.2026) und `docs/spielkonzept.md` (Box, Karte, Kajüte, Deck; seit 10.11.2026) und baut nach ihrem Plan (H0–H10). Die Vision ändert Claude nie stillschweigend: vorschlagen, bestätigen lassen, eintragen. Was der Code heute kann, steht weiter in §7.

## 3. Stil und Ton
- **Grafik:** warm, flach, gezeichnet, im Stil von Pettersson und Findus oder Janosch (nur der Stil, keine fremden Figuren). Szenen hängen von Tageszeit und Wetter ab.
- **Ton:** jugendfrei ab 12, aber derb und hart, plattdeutsch angehaucht. Keine sexuellen Anspielungen, kein Alkohol als Witz über Kinder, keine Beleidigungen von Gruppen. **Ausnahme Podcast:** doppeldeutige Anspielungen nach `PODCAST_BIBLE.md` §8 (Nutzer, 20.10.2026). Dort hat der Nutzer am 23.10.2026 außerdem „keine Beleidigungen von Gruppen“, „keine Witze über Bayern“ und „kein Alkohol als Witz über Kinder“ gestrichen (Bible X3, X4). Anspielungen auf Kinder bleiben verboten. Ob die App (`TONE`, `styleRules`) nachzieht, ist offen (O43).
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
- **Teil 2, Kajütenfunk (V41):** Coaching-Folgen, die Fragerunde liest Harms, dazu Hörkarten zu jeder Frage und Vertiefungen nach falschen Antworten. Alles wird einmal erzeugt und liegt in der App. Zuerst kommt eine Probefolge (etwa 7 Minuten, rund 6.300 Credits Sprache und 800 Credits Geräusche), die der Nutzer in der App erzeugt (`kurs.js`, Konzept Anhang H): erst die Geräusche, dann die Sprache Abschnitt für Abschnitt; der letzte Abschnitt kann wegfallen (B140). Wie die Folgen technisch aufgeteilt werden, regelt das Konzept (`docs/konzept-kajuetenfunk.md`, §17).
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

**Qualität:** Das Modell „Multilingual v2“ spricht Deutsch in hoher Qualität. Vor der Erzeugung prüft Claude, ob ElevenLabs inzwischen ein besseres Modell für Deutsch anbietet (z. B. „v3“), und erzeugt zuerst drei Probesätze zum Anhören. Für den Podcast gilt stattdessen `PODCAST_BIBLE.md` §14. Nach der Freigabe des Kurses werden alle App-Stimmen mit Eleven v4 neu gesprochen, Klabauter mit seiner neuen Stimme (O38, Nutzer 23.10.2026; etwa 25.000 Zeichen).

**Live-KI** (freies Gespräch, Erklärungen auf Nachfrage) lässt sich nicht vorab erzeugen. Sie bleibt hinter grauen Kostenknöpfen. Ein Tageslimit kommt später (E4).

## 5. Lizenzen (Prüfliste vor der Veröffentlichung)
- **L1 Musik und Geräusche in `audio/`** (30 MB, etwa 40 Dateien): von einer lizenzfreien Seite (Nutzer, 09.10.2026). Die Dateinamen (Künstler-Titel-Nummer) sprechen für Pixabay. Die Pixabay-Lizenz erlaubt kommerzielle Nutzung ohne Namensnennung. Freiwillige Nennung der Künstler unter „Über die App“, Liste in `docs/quellen-audio.md`.
- **L2 Bilder aus den amtlichen Fragenkatalogen** (`img/q/`, `img/b/`) und die Fragentexte: vermutlich als amtliche Werke frei nutzbar. Das ist aber nicht sicher. Vor der Veröffentlichung bei ELWIS/WSV die Nutzungsbedingungen prüfen und in der App eine Quellenangabe machen.
- **L3 Schriften Baloo 2 und Nunito:** frei (SIL Open Font License). Die Lizenzdatei muss mitgeliefert werden (`fonts/OFL.txt`).
- **L4 ElevenLabs-Stimmen:** bezahltes Abo vorhanden (Nutzer, 09.10.2026). Kommerzielle Nutzung ist damit erlaubt. Stimmen aus der „Voice Library“ können eigene Bedingungen haben. Welche Stimmen genutzt werden, steht im Manifest.
- **L5 App-Icon** (`icon-192/512.png`): von Claude erstellt, in Ordnung.
- **L6 JSZip** (von cdnjs, MIT-Lizenz) ist in Ordnung, Hinweis unter „Über die App“.
- **L7** Alle Zeichnungen sind selbst gezeichnete SVGs im Code, die Karte ist erfunden. Beides ist in Ordnung.

## 6. Plan (aus `VISION.md` §12)
Der alte Fahrplan (Blöcke A–F, V1–V42) liegt in `docs/archiv/claude-v4-status.md`. Noch offen daraus: **V18** ◐ Rechtliches (Platzhalter im Impressum, anwaltliche Prüfung), **V20** ◐ Feinschliff und Handy-Checkliste, **V29** Etappe 2 mit Quellen, **V32** Katalogbilder in Farbe, **V41** Kajütenfunk (Folgen erst mit Story und Figuren, H10).

- ✓ **H0** Vision freigegeben (28.10.2026, Antworten O88–O92)
- ✓ **H1** Fundament: Rettungsboot `/alt/`, `CLAUDE.md` neu geordnet, Aufräumliste `docs/aufraeumen.md`
- ✓ **H2** Szenen-Player und Gratis-Stimme (v4.96); Kajütenfunk: sechs Sekunden, Bilder früher, Fragerunde, Ansage; jede Frage vorgelesen, Zuruf Alfa bis Delta
- ✓ **H3** Probe-Etappe zum Durchspielen (v4.97, wartet auf den Handy-Test des Nutzers)
- ◐ **H4** Aufräumen nach `docs/aufraeumen.md` (v4.98: Leiste, Frei üben, Kajüte, Crew-Menüs, Einstellungen mit Werkstatt, große Schrift, Geräusche; offen: Kennenlernen ohne Schlüssel (H5), Törn (H7), alter Funk-Bereich)
- ✓ **H5** Ankommen (v4.99: Kennenlernen ohne Schlüssel, Lernort und Übungsset, Rundgang 1)
- ◐ **H6** Lernen mit der Crew (v5.00: Smilla begleitet die Navigation, Hinnerk sagt die Knotenschritte an; v5.05: Verteilungsplan der Navigation in Stufen und Grafik-Schritt; offen: Navigation auf der Seekarte 7 mit Zirkel, der die Länge abzählt, Manöver-Einweisung als Szene, mehr Steuerszenen)
- **H7** Fahrt-Szenen (Törn umbauen, von hinten aufs Boot)
- **H8** Boot im Detail (Nahansicht, Rundgang 2, Schnitt)
- ◐ **H9** Starter-Set in der App (v5.01: Seite „Was du zum Üben brauchst“; offen: Aufgaben für Karte 49 nach O87, QR-Codes)
- **H10** Inhalte, sobald der Nutzer liefert (Story, Figuren, Folgen)

## 7. Code-Karte
Die ausführliche Karte liegt seit 17.11.2026 in **`docs/code-karte.md`** (GL7). Vor Arbeit an einem Bereich dort den passenden Eintrag suchen; am Ende jedes Laufs pflegt Claude sie mit. Hier nur der Wegweiser:
- **App:** `index.html` (Code und CSS, groß; Start `startApp` → `boot`, Spielstand `S`, Key `skipper-sbfsee-v1`, Version `window.__ver` = `VERSION` in `sw.js`), nachgeladene Bereiche über `nachladen(datei)`.
- **Deck und Kajüte:** `deck.js` (Deck, Happen, Statistik, Kajüte, Kajütenfunk-Start), `szenerie.js` (Zeichnungen, Stimmungen).
- **Hörreise:** `kurs.js` (Player: Zerlegen, Abspielen, Fragen, Zuruf, Bühne, Kapitel, Karten, „Harms fragt zurück“), `szene.js` (Vorlesen, Zuruf), Skripte `podcast/folgen/reise-*.md` und `podcast/skripte/gold-*.md`, Liste `HOERREISE` in `index.html`, `FOLGEN` in `kurs.js`.
- **Navigation:** `navifolge.js` + `data/navi-folgen.json` (Navi-Folge am Kartentisch), `brede.js` + `data/karte-brede.json` (Reisekarte), `navi.js` (bisherige Navigationsschule), `navi7.js` (Seekarte 7, nur noch unter „Alte Folgen und Tests“).
- **Lernen:** Fragen und Lernkartei in `index.html` (`runQuiz`, `record`, `farbe`, `todayPath`), `lern.js` (Ausbildungsheft), `schein.js`, `ziele.js`, `seezeichen.js`, `knoten.js`, `manoever.js`.
- **Animationen:** `anim.js`, `anim2.js`–`anim4.js`, `anim-hoch.js`, `boot.js`.
- **Ältere Bereiche:** `welt.js` + `welt-folge.js` (3D), `reise.js`, `toern.js`, `crew.js`, `casting.js`, `hoerprobe.js`.
- **Daten:** `data/*.json` (Kataloge `sbf.json`, `binnen.json`, `sks.json`; Karten, Reiseplan, Schlagworte, Kompetenzen).
- **Werkzeuge und Tests:** `tools/` (`podcast-pruefen.js`, `dichte-messer.js`, `logik-pruefen.js`, `sprueche-pruefen.js`, `reiseplan.js`, `karte-pruefen.js`, `kursplan-pruefen.js` …), `tests/smoke/rauchtest.js` (pre-commit), `tests/buehne-pruefen.js`, `tests/zuruf-pruefen.js`.
- **Regelwerke der Folgen:** `podcast/schreibkarte.md` (eine Seite, beim Schreiben), `podcast/dialog-beispiele.md`, `podcast/folgen/VORLAGE.md`, `docs/reise.md` §7 (HR-Regeln), `PODCAST_BIBLE.md`, `PODCAST_STATUS.md`, `podcast/figuren.md`, `podcast/wortschatz.md`, `podcast/sprueche.json`, `docs/geschichte-logbuch.md`, `docs/fehler-katalog.md`, `docs/navi-schreibregeln.md`.

## 8. Status (von Claude gepflegt)
Ältere Einträge: `docs/archiv/claude-v5-status.md` (Lauf 6 bis v5.65), `docs/archiv/claude-v4-status.md`, `docs/archiv/claude-v3.md`. Alle Entscheidungen E1–E28 im Wortlaut: `docs/entscheidungen.md`.

### Lauf 7: Hörspiel neu denken (ab 16.11.2026)
Plan, Befund und Stand: **`docs/plan-hoerspiel-neu.md`** (nach einem Abbruch dort weiterlesen).
- [x] v5.65 (15.11.2026) Karte = Welt: Reisekarte Brede-Bucht, HR50–HR55, Navi-Folge 1 am Kartentisch, Folgen 1-1 bis 1-3 überarbeitet (Einzelheiten im Archiv)
- [x] v5.66 (17.11.2026) Neue Machart der Hörreise (GL1–GL8, E26): Schreibkarte, Dichte-Messer (nur Hinweise), drei Gold-Folgen statt der alten 1-3 (`gold-1` „Das Heck will zu Paul“, `gold-2` „Ohne Gas kein Ruder“, `gold-3` „Dicke Pötte“; in der App Folge 1-3 bis 1-5), natürliche Entweder-oder-Fragen (`machart: neu`), `[[STOFF]]`, `[[HEUTE]]`, `[[MITNEHMEN]]`; Folge 0 ins Archiv; alte 1-3 unter „Alte Folgen und Tests“
- [x] v5.67 (17.11.2026) Player und Übersicht: Atempausen in drei Stufen (`S.cfg.kurs.ruhe`, Standard normal), Kapitelpunkte mit Liste und eingeblendetem Titel, Karten „Heute an Bord“ und „Das nimmst du mit“, das Ende als Blatt über der Bühne (`#kblatt`; war in der Nachtbühne unsichtbar), „Harms fragt zurück“ (`harmsRunde`, `harmsStart`, `S.hoerreise.stoff`; null bis fünf Fragen früherer Folgen, Gratis-Stimme), Rückmeldung der Tester (`S.hoerreise.rueck`, „Wie war das Tempo?“, „Hier war's zu schnell“, „Rückmeldungen kopieren“), Antwortwort per Zuruf bei Entweder-oder-Fragen (`szene.js` `antwortWorte`, `wortImText`); Deck mit „Weiter mit der Crew: Folge …“ und „Abendwache offen“; „Frei üben“ in sechs Kacheln; Seekarte 7 unter „Alte Folgen und Tests“; bisherige Navigationsschule eingeklappt unter der Navi-Folge. Grundlagen: HR56–HR60, neue Vorlage, Beispiel-Bibliothek, Navi-Schreibregeln, `CLAUDE.md` verschlankt (Code-Karte, alter Status und Entscheidungen ausgelagert)
- [x] v5.68 (17.11.2026) Navi-Folge 1 nach `docs/navi-schreibregeln.md`: drei Wachen mit Anzeige „Wache 2 von 3 · Schritt 2 von 4“, nach jeder Wache weiter oder Schluss (Stelle gemerkt), Schritt-Zettel, Einstufung „Ich kann das schon“, Test erst am nächsten Abend (Startbild und Deck bieten ihn an), Texte in kurzen Sätzen
- [x] v5.69 (17.11.2026) Folgen 1-1 und 1-2 auf die neue Machart umgestellt: ohne Harms-Abschnitt, Fragen als natürliches Entweder-oder, kein Aufzählungs-Vortrag, Karten „Heute“ und „Mitnehmen“, stille Fragen als `[[STOFF]]`; 1-1 ohne Bezug auf die gestrichene Folge 0 (du bist gestern Abend an Bord gekommen), Harms kündigt in der Sprachnachricht an, dass er zwischendurch abfragt. Damit ist Tag 1 (1-1 bis 1-5) durchgehend neue Machart. Bühnentest auf die alte 1-3 umgestellt und um zwei Prüfungen für „Harms fragt zurück“ ergänzt
- [x] v5.70 (19.11.2026) Rückmeldungen des Nutzers und Lektorat: Animation „sog“ als eine Vorbeifahrt (Fähre kommt entgegen, Bugwelle, Sog, Heckwelle; Lieger im Wasser am Steg, zu schnell und langsam getrennt), Handystimme liest keine Anführungszeichen und Zeichen-Reste mehr vor (`sprechbar()` in index.html), **Lektorat** als zweiter, unabhängiger Lauf (HR61: `tools/lektorat.js`, `podcast/lektorat-auftrag.md`, Befunde in `docs/lektorat/`); zwei Läufe über Tag 1 mit zusammen 13 Fehlern und rund 55 Hinweisen, eingearbeitet (`docs/lektorat/tag-1.md`); gold-1 heißt jetzt „Leise raus“, gold-2 „Warten auf die Fähre“; sog mit Phase 4 (Raser, zu schnell) und 5 (Frieda langsam); Mechanik-Prüfung meldet zwei Bild-Zeilen hintereinander; Gas, Tanken und Radeffekt-Bild nach dem Lektorat überarbeitet; `[[ANIM: id, 0]]` hält eine Phase fest
- [x] v5.71 (20.11.2026) Filmprobe in der App (E27): Filmbühne `film.js` (Glasebenen weich, vier Bühnenbilder, zehn Übergänge, Harms-Medaillon, Einfrieren), Player-Aussehen „🎬 Film“ mit Marken `[[ORT]]`, `[[KAMERA]]`, `[[TU]]`, `[[VERTIGO]]`, `[[HARMS]]`, `[[KISTE]]`, Startblatt mit Stufen und Harms an/aus; eine Folge „Leise raus“ in drei Fassungen (A Hafenkomödie, B Der Fender, C Du bist Ausguck; `podcast/skripte/film-leise-raus-*.md`), Lektorat; FK5 neu (Lehrbild aus dem Blick, in dem es Sinn ergibt)
- [x] v5.72 (20.11.2026) Baukasten für Boot und Crew (`docs/baukasten.md`): Frieda in vier Ansichten aus `boot.js` mit Farben und sieben Ausbauten, die überall gelten; Crew neu und detailreicher gezeichnet in `figuren.js` (Hinnerk, Smilla, Hilke, Harms, Klabauter, Backbord rot getigert mit sechs Posen; Kleidung zum Wechseln; drei Zeichenstile Feder, Kreide, Aquarell); **Werft** (Einstellungen und ⚓ an Deck) zum Auswählen; Film und Deck nutzen beides; Notiz-Knopf ✏️ im Player; Bühnenbild Motor von achtern
- [x] v5.73 (20.11.2026) Großer Lauf Baukasten: acht feste **Plätze** am Boot (Vorschiff, Kajütdach, Mast, über dem Cockpit, Steuerstand, Heckkorb, Spiegel, Bordwand) in allen Ansichten, unsichtbar eingebaut, je ein Teil (17 Teile, u. a. Bordkanone, Anker, Glocke, Kajak, Solarpaneel, Antenne, Angel, Grill, Badeleiter), Prüfwerkzeug `tools/plaetze-pruefen.js`; sechs **Glasarten** der Filmbühne (Weich, Klar, Aquarell, Feder, Buntstift, Papiertheater); **Werft als Drehrad** (Bild bleibt oben, außen Thema, innen Wahl, Übernehmen/Verwerfen); Bühnentest um die Werft erweitert
- [x] v5.74 (20.11.2026) Werft: Knopf 📋 kopiert die Einstellungen (Name, Stil, Glas, Farben, Plätze, Laternen, Kleidung, Rohdaten) als Text, den der Nutzer in den Chat einfügt (`WERFT.exportText`)
- [x] v5.75 (21.11.2026) Figuren-Motor und Entwurfsseiten: Körperbau (6 Typen, „süßer“), Augen (5), neun Zeichenstile (Aquarell ohne Strich, Feder/Kreide mit Strich u. a.) in `figuren.js` und `boot.js`; Werft mit Themen Körperbau, Augen, Testmodus; Extras des Bootes mit `tag` (Freischaltung über die Hörreise-Tage, Testmodus Standard an, E29); Entwurfsseiten `docs/entwuerfe/figuren-atelier.html` und `docs/entwuerfe/menues-glas.html` (Menüs und Kajüte im Glasplatten-Stil, Varianten A1–A3, B1–B2, C, D, E)
- [x] v5.76 (22.11.2026) Werft-Rad verschlankt (einfach: Glasplatten-Stil, Machart, Zeichenstil, Körperbau, Augen; „Mehr“ zeigt alles), neun neue Glasplatten-Stile in der Filmbühne (Öl auf Glas, Nebel, Schattentheater, Laterna magica, Bleiglas, Cyanotypie, Delfter Kacheln, Riso, Seemannsgravur; zusammen 15), Machart der Figuren (Papier am Stab, Knete, Filz, Strick, Schattenfigur); Entwurfsseite `docs/entwuerfe/glas-stile.html` mit 13 Stilrichtungen nach Künstlern (Hafen, Kajüte, eigener Übergang) und acht Figuren-Konzepten (u. a. Holzspielzeug, Tier-Crew, Bojen-Crew), E30
- [x] v5.77 (22.11.2026) Stile aus v5.76 verworfen (E31) und entfernt; Figuren: Feder fein, Feder laviert, Aquarell nass, Aquarell mit Bleistift und Blick von oben (`figuren-winkel.html`); Glasbühne mit Licht (Morgendunst, Abendgold, Nacht, Nebel, Regen) und Atmosphäre vor den Platten (Lichtbahnen, Bokeh, Spiegelung, Tropfen …) in `film.js`, Vollbild-Seite `glasbuehne.html` mit zwölf Varianten; Werft-Rad: Glasart, Licht, Zeichenstil, Körperbau, Augen, Mehr
- [x] v5.78 (22.11.2026) Feder laviert und Körperbau je Figur als Standard (E32); alle übrigen Figuren (Quirin, Jasper, Hafenmeister, Polizistin, Schleusenwärter, Rangerin, Seenotretter, Mats); Smilla attraktiver (jugendfrei); acht Gangarten; Frieda von achtern in allen Ansichten dieselbe Zeichnung, Rumpf unter Wasser passend; Kajüte als Glasbühne mit Kamerafahrten; Klick-Prototyp aller Menüs `app-laviert.html`, Gangarten `figuren-gang.html`
- [x] v5.79 (23.11.2026) Gang je Figur, Polizist, Polizistin, Hafenmeister und Quirin umgefärbt, Aufsicht schmaler, Klabauter mit Flügelschlag, Backbord mit echten Beinen und sechs Gangarten; Mäusefamilie und vier Fabelwesen; Kajüte der Glasbühne wie die Kajüte der App; Menü-Stile `menue-stile.html` (fünf Stile, Deck und Kajüte wie heute, Heranfahren mit Einzelheiten), E33

- [x] v5.80 (23.11.2026) Menüs im Standard-Glas (E34): Kajüte im Hochformat bildschirmfüllend (alles Wichtige im sichtbaren Band, Knotenbrett hochkant zwischen den Bullaugen, Gardinen, Flamme und Lichtschein bewegen sich), Knotenbilder aus den Endbildern der Knoten-Animationen im Stil „Feder laviert“ (`KNOTEN.endbild`), Kamera im Hochformat korrigiert (`K` mit Höhe), Entwurf `docs/entwuerfe/menue-standard.html` (Deck mit Zettel und Weiter nebeneinander auf einem Bildschirm, Kajüte mit Fernglas, Knotenbrett fast Vollbild mit Überblendung und Knoten-Animation, Seekarte kippt in die Draufsicht); Backbord läuft neu (Beine mit Gelenk, Beinfolge je Gangart, Schwanz, Sprung ohne Posenwechsel); Fabelwesen süßer und im Aquarell ohne Umriss, drei neue (Knotenwurm, Sandkrümel, Quallchen), Grüppchen (`FIGUREN.gruppe`); Mäuse ebenfalls Aquarell
- [x] v5.81 (23.11.2026) Kajüte und Sprechen (E35): Kajüte wieder zum Wischen in der alten Aufteilung (Kombüse, Koje und Bücher links, Tischrunde unter Knotenbrett und Lampe in der Mitte, Navigationsecke und Niedergang rechts), beim Wischen leichte Tiefe, sonst fast alles klar (Personen scharf); Hinnerk und Smilla größer direkt am Tisch, Hände auf dem Tisch; Heranfahren näher (Knotenbrett: Filz füllt die Breite), Namen auf Messingschildern mit passender Schrift; Seekarte am Tisch hochkant und groß von oben; Sprechen: Mund geht auf (echte Stimmen, Mund folgt der Lautstärke), an Deck dreht der Sprecher den Kopf her, Medaillon beim Heranfahren; Knotenwurm mit echtem Achtknoten; Klickseite `docs/entwuerfe/menue-standard.html` neu
- [x] v5.82 (23.11.2026) Deck und Kajüte in der App (E36, Plan `docs/plan-bord.md`):
  - `bord.js` bringt die Glasbühne in die App.
    - Deck am Liegeplatz, Zettel und Weiter nebeneinander, Schiffsrennen im Zeichenstil.
    - Kajüte zum Wischen mit deutlich mehr Tiefe und einer Ebene ganz vorn (Stiefel, Kiste, Seesack, Laterne, Pfosten).
    - Alle Dinge sind mit den echten Funktionen verbunden. Hocker = in die Runde setzen, mit dem Start der Hörreise. Seekiste = Spielekiste und Frei üben.
  - Gemütlicheres Licht je Tageszeit, drei Becher am Tisch, Smillas Stift unter der Hand, Smilla kleiner (82).
  - Leben an Bord mit einem Taktgeber:
    - Mäuse mit Mauselöchern oder vorn über den Teppich; Backbord jagt sie.
    - Klabauter fliegt, Fabelwesen vereinzelt, Möwen im neuen Stil.
  - Hinnerk zur Auswahl: sieben Varianten (`docs/entwuerfe/hinnerk-varianten.html`, Werft → Hinnerk).
  - Leichte Stufe: Die Bühne misst selbst, ob das Wischen ruckelt.
  - Werkstatt-Schalter für das alte Bild.
  - Rauch- und Bühnentest auf die App umgestellt.

### Jetzt dran
- **Hörtest Tag 1 (Nutzer):** Folge 1-1 bis 1-5 mit der Gratis-Stimme hören und sehen (seit v5.83 laufen 1-1 bis 1-3 als Film mit der Kajüte als Szenenbild; die Fassungen ohne Film liegen unter „Alte Folgen und Tests“), zum Vergleich die alte 1-3, danach die Abendwache (Navi-Folge 1) und am nächsten Tag deren Test. Am Ende jeder Folge „Wie war das Tempo?“ antippen. Danach entscheidet der Nutzer über die Machart (GL4, Harms fragt zurück, Länge), dann wird **eine Szene** vertont (nicht vorher, T5: Credit-Deckel 25.000).
- **Etappe 5 Reiseplan und Serie** (erst nach dem Hörtest): `data/reiseplan.json` nach Lernlast und Hörtagen neu verteilen, Frist und Titel („sieben Tage“) anpassen, dann Folgen in Serie. Weitere Navi-Folgen (nf2 ff.) entstehen mit dem neuen Plan.
- **Deck und Kajüte testen (Nutzer, ab v5.82):** in der App am Handy wischen, Dinge antippen, in die Runde setzen, auf Mäuse und Möwen achten; ruckelt es, Werkstatt → „Deck und Kajüte: Alt“ und Bescheid geben. Hinnerk-Variante wählen (`docs/entwuerfe/hinnerk-varianten.html` oder Werft → Hinnerk).
- **Atelier und Menüs wählen (Nutzer, 21.11.2026):** `docs/entwuerfe/figuren-atelier.html` (Körperbau × Stil, ♥ Favoriten, „Auswahl kopieren“) und `docs/entwuerfe/menues-glas.html` (Glasart und Tageszeit oben); sagen, welche Figuren-Typen und -Stile, welche Menüs (A1–A3, B1/B2, C, D, E) in die App sollen, welche Teile nach welchem Tag frei werden (E29), Standard-Stil und Standard-Glas.
- **Werft und neue Figuren testen (Nutzer):** Deck → ⚓ (Drehrad): Farben, Name, Plätze bestücken, Kleidung, Stil und Glas ausprobieren und sagen, welcher Stil und welches Glas Standard werden; dann Kajüte, Menüs und alte Animationen nach `docs/baukasten.md` umziehen. Notizen zu Folgen mit ✏️ im Player schreiben und mit ⚙️ → „Rückmeldungen kopieren“ schicken.
- **Filmprobe:** Fassung A gewählt (20.11.2026) und seit v5.83 Grundlage der Folge 1-3; Gespräche schreibt der Nutzer selbst um (Notizen ✏️). B und C bleiben unter „🎬 Filmprobe“ zum Vergleich. Als Nächstes 1-4 und 1-5 (gold-2, gold-3) als Film und weitere Bühnenbilder.
- **Film und Ebenen (E27, GL9–GL13, 20.11.2026):** Bilder als Film aus der Grund-Szene (2D zuerst), Grundfassung fürs Auto mit Denkfragen, drei Stufen (nur hören, mitsprechen, mit Händen) und Schalter Harms (Rückblick und Unterbrechung), Kiste am Rand. **Filmproben zum Testen:** `docs/entwuerfe/film-varianten.html` (vier Bühnen) und `docs/entwuerfe/glasebenen-kamera.html` (Glasebenen vertieft: fünf Blicke, Einstellungen, neun Übergänge, Musterszene, Nähe, Licht, Glas; Aufsicht mit Höhenschichten; 20.11.2026). **Film-Regeln** (welcher Wechsel wann, ruhig und meist von der Seite): `docs/film-regeln.md` (FK1–FK17, Entwurf). Eingebaut (v5.71 Player, v5.83 Tag 1 als Film, FK17 Kajüte als Szenenbild).
- **Offen aus E26:** Wo Kennenlernen und Kiste erklärt werden, seit Folge 0 entfällt. Reisekarte Brede-Bucht wird noch überarbeitet (Nutzer).
- **Animationen:** alle im Hochformat neu gezeichnet (`docs/animationen-umbau.md`); neue Bewertungen des Nutzers einarbeiten, sobald sie da sind.
- **Aufgaben für den Nutzer:** `docs/aufgaben-nutzer.md` (Dateien, Stimmen, Impressum, Kataloge, Handy-Tests). Weiter offen: V18 Rechtliches, V20 Handy-Checkliste, V29 Quellen, V32 Katalogbilder, Funk-Kataloge, 12 Sätze fürs Stimmenpaket („Neue Sätze nachliefern“), SBF 279 und SKS recht-23 am Original prüfen.

### Entscheidungen (Kurzfassung; Wortlaut in `docs/entscheidungen.md`)
- **E1** Freigabe ab 12. **E2** KI nur mit eigenem Schlüssel, Stimmen aus dem Paket. **E3** Web-App mit Icon, APK wenn machbar. **E4** KI-Tageslimit später. **E5/E6** Stimmenpaket über die Cloud, hohe Qualität, erst Probesätze. **E7** „Weiter“-Knöpfe gelb-orange. **E9** Konten erst nach der Veröffentlichung.
- **E11/E23** Farben des Lernstands; Dunkelgrün erst bei einer Serie über mindestens eine Woche; Ausbildungsheft mit drei Dimensionen ist das Rückgrat.
- **E13** Haftungsausschluss in „Über die App“ und im Impressum, immer beide zusammen ändern.
- **E15/E16** Skipper ist eine Reise mit der Crew, App gratis, Starter-Set im Handel; Reihenfolge Basis, See, Binnen.
- **E19/E22** In 3D zuerst nur die Pinne; Fahrten und Manöver in 3D, Gespräche in 2D.
- **E21** Kein Zeitdruck, keine Uhr entscheidet (Ausnahme Probeprüfung); Scheinwahlen; das Boot heißt Frieda.
- **E24/E25** Lineare Ausbildungsfahrt als Hörreise (Auto, Gym): Hörspiel mit Zwischenfragen, Bilder laufen mit, Aufgaben für später; Crew wächst (Klabauter ab 1-6, Quirin, Jasper); Ernstfälle erst später (HR28), Wiedersehen (HR29).
- **E26** (16.11.2026) Hörspiel neu denken: Lernlast statt starrer Zahlen, Hörtage von 20 bis 40 Minuten, Harms fragt zurück, keine Redeanteil-Quote, eine Karte, Folge 0 entfällt.
- **E27** (20.11.2026) Film und Ebenen: Bilder als Film aus der Grund-Szene (2D zuerst), Grundfassung fürs Auto, drei Stufen plus Schalter Harms, Harms erzählt „Was bisher geschah“ und hält für Prüfungsfragen an, Kiste am Rand.
- **E36** (23.11.2026) Deck im Vollbild in der App, Rennen im Stil; Kajüte mit mehr Tiefe und Dingen vorn, alles anklickbar, Hocker = in die Runde setzen, Licht gemütlicher, Becher, Smilla kleiner; Hinnerk zur Auswahl; Mäuse mit Löchern, Fabelwesen vereinzelt, Klabauter und Backbord unterwegs, Möwen im neuen Stil; danach Folgen 1-1 bis 1-3 neu mit der Kajüte als Szenenbild.
- **E35** (23.11.2026) Kajüte wieder zum Wischen (alte Aufteilung, verbessert), Personen nah am Tisch, weniger Tiefe (Personen scharf), näher heranfahren, Schrift passt auf Schilder, Knotenwurm mit Achtknoten, beim Sprechen Kopf her und Mund bewegt sich.
- **E34** (23.11.2026) Standard-Glas; Kajüte bildschirmfüllend; Seekarte kippt beim Heranfahren in die Draufsicht, Knotenbrett fast Vollbild mit Überblendung; Knotenbilder aus dem Knotenkurs; Deck auf einen Bildschirm; Sonnet-Animationen gelten nicht; Backbord überarbeiten; Fabelwesen in Gruppen, süßer, Aquarell ohne Umriss (alles Umrandete spielt mit).
- **E33** (23.11.2026) Gangarten fest, Polizist dazu, Farben unterscheidbar, Mäuse und Fabelwesen; Menü wie das alte mit alten Symbolen, Heranfahren bleibt stehen, Menü-Stile zur Wahl.
- **E32** (22.11.2026) Feder laviert und Körperbau je Figur als Standard; alle Figuren im selben Stil; Smilla attraktiver, jugendfrei; ein Heck für alle Ansichten; Menüs und Kajüte zum Durchklicken; Gangarten zur Auswahl.
- **E31** (22.11.2026) Neue Stile verworfen; Feder/Aquarell weiterentwickeln (alle Winkel); weiche Glasbühne ausarbeiten, Vollbild-Varianten.
- **E30** (22.11.2026) Rad zuerst nur Figuren und Glasplatten-Stile, Rest hinter „Mehr“; Glasplatten bleiben, Stilrichtungen nach Künstlern als Grundkonzepte erkunden, Figuren neu denken.
- **E29** (21.11.2026) Standardschiff ohne Extras, Extras mit Hörreise-Tagen (Testmodus an, bis der Nutzer die Tage festlegt); Figuren-Varianten und Menüs im Glasplatten-Stil zur Auswahl.
- **E28** (20.11.2026) Filmprobe A trägt am besten, Gespräche passt der Nutzer selbst an (Notizen ✏️); Glasebenen weich; Boot und Figuren austauschbar über den Baukasten (`docs/baukasten.md`, Werft); Backbord rot getigert.

### Handy-Checkliste (macht der Nutzer)
- Mikrofon im Gespräch, Zurück-Taste (App und Browser), Offline-Start, Lautstärke der Stimmen
- Moin-Ketten (Käpt'n fast immer, andere manchmal), Telefon und Harms, Karte im Törn mit „Zurück zum Boot“
- Bonusrunden im Törn, Knotenbrett und Knotenkunde, Bauteile-Spiel (ganze Flächen), Bordkatze in der Kajüte
- Navigation: Zirkel an den Griffen verstellen, am Gelenk an den Breitenrand ziehen, Ablese-Fenster, Zahlentasten, ↶ ↷, Rechenblatt mit übernommenen Werten
- Installieren-Knopf (Android) bzw. „Zum Home-Bildschirm“ (iPhone), Einwilligung beim ersten KI-Gespräch
- v4.91: Hocker → Kajütenfunk: „Stimmen prüfen“ (Quirin = Alexander?), Geräusche erzeugen, anhören und herunterladen, Abschnitte einzeln erzeugen, Abspielen endet vor einem fehlenden Abschnitt, Tipp der Vorab-Frage bei der Auflösung, Frage 30 mit den amtlichen Antworten
- v4.90: Einstellungen → „🎯 Scheine, Termine und Lernzeit“: zwei Scheine wählen, Termine eintragen, Minuten wählen, Speichern, Crew hören; danach Kurs für heute ansehen
- v4.89: Hocker → Kajütenfunk: Probefolge erzeugen und hören (Auto und interaktiv, falsche Antwort → Vertiefung, Bilder, Signal, Pause, Zurück)
- v4.88: Einstellungen → „Über die App“: Karte „Wichtiger Hinweis und Haftung“ lesen, Links (auch nachts) antippen; Impressum unten mit Haftungsausschluss
- Lauf 5: Easy/Tricky nach Antworten, Kuchen in „Meine Prüfungen“ und an Deck, Kurs für heute in Happen (Phase antippen), Smilla nach dem Nachsitzen, Lernwand in der Kajüte, Manöver (Pause, 🔍, ⛶ Vollbild, Einweisung), Werkzeugkunde und „?“ in der Karte

### Hinweise und offene Kleinigkeiten
- Der Ordner `quellen/` fehlt in der Cloud. Die SKS-Kartenaufgabe (L11) stützt sich nur auf den SKS-Katalog in der App. Ein Abgleich mit den Original-Kartenaufgaben ist optional.
- `tools/stimmenpaket.js` ist noch nie mit echtem Schlüssel gelaufen (nur Trockenlauf).
- Die 285 Merksätze für SBF See sind ohne `quellen/` geprüft: gegen die richtige Antwort und die Fallen in den App-Daten und gegen verbreitete Eselsbrücken aus der Websuche (R59). Fachlich falsch darf keiner sein; wer einen findet, meldet ihn.
- Der Haftungstext ist keine Rechtsberatung (E13).

### Erledigt (Kurzfassung)
- [x] Läufe 1–3 (v4.10–v4.42): Details in `docs/archiv/claude-v3.md`
- [x] Läufe 4–5 (v4.43–v4.95): Crew, Stimmenpaket, Knoten, Manöver, Navigation, Farben, Kajütenfunk-Player, Ziele, Grundsatz-Recherche, Vision; Details in `docs/archiv/claude-v4-status.md`
