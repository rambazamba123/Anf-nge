# Skipper – Projekt-Brief für Claude Code (Version 5, 28.10.2026)

> **Der Code ist die Wahrheit.** Widersprechen sich Brief und Code, gilt der Code, und der Widerspruch kommt in den Bericht. Abschnitt 7 (Code-Karte) und 8 (Status) pflegt Claude am Ende jedes Laufs. Nach einem Abbruch geht es immer mit Abschnitt 8 weiter.
> Ältere Fassungen: `docs/archiv/claude-v3.md` (Konzepte Navigationsschule, Törn 2.0, Läufe 1–3) und `docs/archiv/claude-v4-status.md` (alter Fahrplan V1–V42, Status der Läufe 4–5).
> **Nummern zum Kommentieren:** Regeln `R1…`, Vorhaben `V1…`, Lizenzpunkte `L1…`, Entscheidungen `E1…`. Die Nummern bleiben fest, Erledigtes wird abgehakt und nicht neu nummeriert.

## 1. Worum es geht
> **Anker seit 28.10.2026: `VISION.md`.** Skipper ist eine Reise mit einer Crew, die dich zum Bootsführerschein bringt. Etappe für Etappe am Kartentisch geplant, mit Kajütenfunk, Fahrt-Szenen, Knoten mit echtem Tau und Navigation auf der echten Karte; die Crew ist bei allem dabei (feste Sätze, Multiple Choice, vorgefertigte Töne), empfiehlt, und du entscheidest mit. „Frei üben“ geht immer. App gratis, Starter-Set im Buchhandel. Die Vision gilt vor den älteren Angaben in §1 (R16). Plan H0–H10 in §6, Aufräumliste in `docs/aufraeumen.md`.

„Skipper“ ist eine Lern-App für Bootsführerscheine: SBF See, SKS und SBF Binnen sind drin. Funk (SRC/UBI) und Pyrotechnik (FKN) kommen, wenn der Nutzer die Kataloge liefert.

Man lernt an Bord einer Segelyacht mit drei Crew-Figuren: **Käpt'n Hinnerk**, **Matrosin Smilla** und **Papagei Klabauter**. Dazu kommt **Bordkatze Backbord** ohne Stimme, die überall herumläuft und Unsinn macht. Geprüft wird von **Kapitän Harms** (interne ID `kroeger`).

Die App läuft als Web-App auf GitHub Pages. Hauptgerät ist Android mit Chrome im Hochformat.

**Lernen in der Kajüte** (Nutzer, 22.10.2026): Alles, was man zum Lernen braucht, hängt in der Kajüte und lässt sich antippen: Seekarte an der Wand (Navigation), Manöverbrett (Manöver), Knotenbrett (Knoten), Bücher und Kartentisch (Meine Prüfungen), Telefon (Harms prüft). Den Fortschritt je Thema zeigt die Übersicht „Meine Prüfungen“, nicht die Kajüte.
**Kajütenfunk** (Nutzer, 22.10.2026): Die drei sind dein persönliches Coaching-Team und bringen dich so schnell wie möglich und mit Humor durch die Prüfung. Eine durchgehende Geschichte gibt es nicht mehr, aber jede Folge ist ein kleines Hörspiel mit eigenem Rahmen. Das finale Konzept (Fassung 5) gilt seit dem Startschuss am 24.10.2026 (V41, K1). Eine Probefolge (Anfang von G6.3 mit Quirin, in echter Dichte etwa sieben Minuten) erzeugt der Nutzer in der App und hört sie über den Hocker in der Kajüte. Geschrieben wird mit maximalem Aufwand im Chat, die App vertont nur (B138).

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
  - Seit 22.10.2026 gilt das Coaching-Konzept (V41) statt der Geschichte. Die Bible gilt in der dritten Fassung seit dem Startschuss (K1, 24.10.2026), zusammen mit dem Konzept (`docs/konzept-kajuetenfunk.md`, Fassung 5). Die Regeln zur Geschichte sind als „Entfällt (E12)“ markiert.
- **R16 Vision:** Vor jeder größeren Arbeit liest Claude `VISION.md` (Anker seit 28.10.2026) und baut nach ihrem Plan (H0–H10). Die Vision ändert Claude nie stillschweigend: vorschlagen, bestätigen lassen, eintragen. Was der Code heute kann, steht weiter in §7.

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
- ◐ **H6** Lernen mit der Crew (v5.00: Smilla begleitet die Navigation, Hinnerk sagt die Knotenschritte an; offen: Navigation neu mit dem Input des Nutzers, Manöver-Einweisung als Szene, Verteilungsplan)
- **H7** Fahrt-Szenen (Törn umbauen, von hinten aufs Boot)
- **H8** Boot im Detail (Nahansicht, Rundgang 2, Schnitt)
- ◐ **H9** Starter-Set in der App (v5.01: Seite „Was du zum Üben brauchst“; offen: Aufgaben für Karte 49 nach O87, QR-Codes)
- **H10** Inhalte, sobald der Nutzer liefert (Story, Figuren, Folgen)

## 7. Code-Karte
*Stand v4.95 (Lauf 5). ✓ = erledigt, ◐ = teilweise, ⏳ = wartet (siehe §8).*
- **KI und Kosten:**
  - KI-Schalter `S.cfg.ki` (Standard an), `kiOn()`, `applyKi()` setzt `body.noki` und `body.nodev`
  - Kostenknöpfe haben die Klasse `.ki` (grau („ausgegraut“) mit ✦) und verschwinden bei ausgeschalteter KI. Automatische KI-Aufrufe gibt es nicht.
  - `ai()` zählt `S.kiUse` {day, n}; `KI_LIMIT` (0 = aus) für das spätere Tageslimit
  - Sprech-Arten: `fixed` (fester Satz, kommt ins Paket), `story`, `live` (KI-Antwort), `local` (wechselnder App-Text, nie ElevenLabs)
  - Entwickler-Werkzeuge `.dev`, `devOn()` (an bei ElevenLabs-Schlüssel oder `S.cfg.dev`)
- **Crew (V1):** feste Sprecher `SPRECHER` (hinnerk, smilla, klabauter, kroeger), `ROLE_OPTIONS` je eine Figur, alte Spielstände werden in `load()` umgestellt; Bestenliste `NPC_IDS`. Bordkatze stumm: `CAT_SPOTS`, `catPlace`, `catChase` (Kajüte)
- **Begrüßung (V4):** `MOIN_BAU` je Figur, `MOIN_WEG`, `moinKette(gap)`; gezogene Moins (`/mo{4,}in/`) werden in `playBlob` gedehnt
- **Einwilligung (V18):** `kiEinwilligung()` vor der ersten KI- oder ElevenLabs-Nutzung, `S.kiOk`; ohne sie `no_consent` bzw. Handystimme. Seiten `datenschutz.html`, `impressum.html` (Platzhalter!)
- **KI-Anbieter (V21):** ein Schlüsselfeld, `kiAnbieter()` erkennt sk-ant-/AIza/sk-, `aiAndere()` für Gemini und OpenAI (`ANDERE_MODELLE`)
- **Einführungen (5.10):** `einfuehrung(id)` liest `INTROS` (`data/einfuehrungen.json`), merkt `S.intros[id]`, gibt ein Promise zurück (der Hocker wartet darauf)
- **Fragekarten:** `data/karten-sbf.json`, `karten-bin.json`, `karten-sks.json` ({k: {Schlüssel: {e, m, f}}}), Schlüssel `sbf:n`, `bin:n`, `sks:<id>`; `m` ist der Merksatz, für SBF See seit 23.10.2026 zu jeder Frage neu und derselbe wie im Kajütenfunk (Binnen-Fragen 1–72 nutzen die `sbf:`-Karten)
  - `KARTEN`, `cardOf`, `cardHtml`, `localMn`, `localLesson`, `askCrewBox` (grauer Rückfrage-Kasten), `qContext`, `TUTOR` (Leitplanken), `readCls`
- **Stimmenpaket:** `PACK.voices` (Manifest legt die Stimmen fest), `VOX.voiceOf`, `packLines` (alle Crews), `packVoices`, `downloadPack` (ZIP-Teile unter 20 MB plus `geschichten.json`), `buildVoicePack`, `exportClips`
  - Werkzeuge: `tools/stimmen-import.js` (ZIPs aus `import/`), `tools/stimmenpaket.js` (direkt mit `ELEVENLABS_API_KEY`)
- **Offline:** Schriften in `fonts/`, `offlineStock()` (einmal pro Version), `sw.js` mit `MEDIEN` (Versionsname des Medien-Speichers)
- **Zurück-Taste:** `initBackKey`, `handleBack` (Reihenfolge `BACKS`), `guardBack`
- **Reise (Tag auf See, O93–O100):** `reise.js` (nachgeladen über `reiseOeffnen()` nach `szene.js`; Deck `#toreise`, Kajüte Spot `tisch`): Kartentisch `REISE.oeffnen` (Seekarte 7 als Bild `img/karte7.webp` mit SVG-Ausschnitt `karte(t, box)`, Koordinaten in PDF-Punkten, Route und Boot; drei Felder `.rfeld` Morgens/Unterwegs/Abends; Modus „Mitmachen“/„Nur hören“), `REISE.phase(ph)` spielt die Schritte aus `data/reise.json` `tage[].phasen` (Satz `{wer, t, auto}`, `wahl`, `frage` (Zahl oder `faellig`), `navi` (Aufgabe auf der Karte mit `ziel`, `radius`, `hilfe`, `auto`), `mini` (Minispiel über `BONUS`, Liste `minis`), `knoten` (`KNOTEN.zeige`, Knopf „⛵ Weiter in der Geschichte“), `logbuch`); Bühne `buehne` (Karte morgens, sonst Fahrt-Canvas `fahrtBild` mit `zeichne`); Automodus: Wahl nimmt die Empfehlung, Fragen werden vorgelesen, sechs Sekunden Denkpause, dann die Lösung, Minispiele entfallen, der ganze Tag läuft durch; Speicherpunkt `S.reise.pos` {`tag`, `phase`, `i`}, `fertig` {'tag:phase'}, `modus`, `wahl`, `log[]` (Standard beim ersten Öffnen, R7); `REISE.stopLauf`. Reiseplan aller Tage `data/reise-plan.json`, Übersicht `docs/reise-konzept.md` (`node tools/reise-plan.js`, `--check` im pre-commit)
- **Zuhören:** `AUD.hush` schaltet Musik und Geräusche beim Zuhören stumm
- **Szenen und Vorlesen (H2):** `szene.js` (nachgeladen über `nachladen('szene.js')`): `SZENE.spiele(schritte, {box, aktionen, frage})` mit Schritten `{wer, t}` (fester Satz), `{bild}`, `{wahl, id, opts: [{t, wert, ok, empfohlen, dann}]}`, `{knopf}`, `{pause}`, `{aktion}`, `{frage: n}`; Ergebnis `{ende, wahlen}`; `SZENE.frage(q, order, {wer, onPick})` liest vor (Art `local`, nie ElevenLabs) und hört auf Zuruf (`deute`: Funkwörter immer, Buchstaben erst nach dem Vorlesen); `SZENE.stop` (in `stopAll`). Quiz: `S.cfg.vorlesen` (Standard an), `S.cfg.zuruf` (Standard aus), Knöpfe `#vlon`/`#zron`, Anzeige `#zurufinfo`. Handystimme je Figur: `phoneVoiceOf(cid)` (Wahl in `S.cfg.handy` {cid: voiceURI}, sonst je Figur eine andere deutsche Stimme), `VOX.phoneVoices`, `VOX.phoneTest`, Karte `#handyst` in den Einstellungen
- **Navigationsschule** liegt in `navi.js` (nachgeladen über `loadNavi()`; `navSchool()` öffnet `NAV.hub`):
  - Daten: `data/karte.json` (erfundene Kliev-Mündung, Tonnen, Feuer, Mw, Ablenkungstabelle, Stromtabelle), `data/navi.json` (`fibel`, `lektionen` L1–L11)
  - Karte: `proj`/`unproj` (Mercator, Minuten ab 55°N/006°E), `NAV.mountChart` (Zoom, Lupe, Kursdreieck, Zirkel, Stift, Kreuz)
  - Karte (V30): Werkzeugleiste unten mit ↶ ↷ (`st.undo`/`st.redo`, Stand aus Linien, Kreuzen, Zirkel und Dreieck), `snap` (Tonnen, Kreuze, Linienenden, Schnittpunkte `schnitt`), Zirkel `zGeo` (Gelenk seitlich, Griffe `zgrip`), `snapTip` und `randXs` (Breitenrand), `zAmRand` (am Rand senkrecht), `ctl.zirkelAnRand()` (nur mit `opt.hilfen`), Ablese-Fenster `ablese`/`lineal`, Knöpfe in der Karte `kontext` (`.nctx`), `ctl.zustand()`/`uebernehmen()` für die nächste Teilaufgabe, ResizeObserver hält die Mitte
  - Rechnen: `kursDist`, `versegeln`, `kreuzpeilung`, `ablenkung`
  - Werkzeugkunde (V40): `NAV.werkzeugkunde(danach)` (acht Schritte, geprüft über Ereignisse der Karte, `S.navi.werkzeug`), im Lernpfad zwischen L0 und L1 (`wkEintrag`, `wkZuerst`), Hinweis in `NAV.lesson`; Knopf „?“ in der Werkzeugleiste (`werkzeugHilfe`, `WERKZEUGE`; aus mit `opt.hilfeKnopf: false`)
  - Lernpfad (V28): `NAV.path`, `NAV.lesson` mit `SCHRITTE` (erkl, bsp, gef, frei, sterne in `S.navi.lek[id]`), `NAV.erklaerung` (Crew, `begriffe` als Fibel-Karten, L1 verweist auf den Seezeichen-Kurs), `NAV.beispiel` (vorgerechnet mit `soll`), Lektion `L0` Grundlagen (`GEN.richtung`, `gegenkurs`, `minSm`, `tiefe`); Hilfe in drei Stufen `hilfeStufen` (Tipp, Rechenweg, Lösung)
  - Aufgabe (V30): `NAV.task` baut `.nt2` (oben `.ntbar` mit `opts.meta()`, Lage `opts.scen` und Tabellen als Überblendung `#xover`; Mitte Karte; unten `.ntsheet` mit Reitern Antwort `#xform`, Rechenblatt `rechenblattHTML(blatt, peil)`, Hilfe `#xhints`), eigene Zahlentasten `zahlenTasten` (`#nkeys`, Felder mit `data-kp`), Blatt `{v, q}` (`neuesBlatt`, `fuelleGeg` aus `task.geg`, Peilaufgaben `task.peil`, Werte aus früheren Teilen über `BLATT_KEY`), `opts.bisher`, Messwerte `messChips`/`pin`; `NAV.multi` reicht `blatt`, `bisher` und `keep` weiter
  - Lernen: `NAV.fibel`/`term`/`linkTerms`, Aufgabengenerator `GEN` (inkl. `gesamt`; SKS: `versegelung`, `doppel`, `peilAbstand`, `sksGesamt` mit `need`), Folgefehler über `step.folge`, `mgAusMw`, `ABL_TAB`, `NAV.task` + `grade` (Toleranzen `TOL`), `NAV.multi`, `NAV.path`/`lesson`/`exercise`, `NAV.exam` (25 min)
  - Spielstand: `S.navi` {`fibel`, `lek[id]` {`serie`, `sterne`, `n`}, `pruef[]`}; `NAV.kennWorte` (Kennung in Worten)
- **Törn 2.0** liegt in `toern.js` (nachgeladen über `loadToern()` nach `navi.js`; das Steuer an Deck ruft `openToern()` → `TOERN.open`):
  - Daten: `data/toerns.json` (`stufen` mit `scheine`, `aufgaben`, `schaden`, `ohneTeil`, `empfohlen`; `orte`; 15 `toerns` mit `etappen[].wp`), `data/ereignisse.json` (`ereignisse` mit `ref` auf amtliche Fragen, `gen` Kartenaufgaben, `fahrzeuge` Lichter/Signalkörper, `tags`, `crew`), `data/ausruestung.json` (`start`, `teile`), `data/tags.json`, `data/sks-mc.json`
  - Kern ohne DOM `TOERN.core` (auch in Node): `tagWetter`, `bericht`, `entscheid`, `plan`, `genKandidaten`, `zeit`, `folgen`, `malus`, `sterne`, `simulate`
  - Oberfläche: `TOERN.open` (Törnwahl), `starten`, `weiter` (springt in die gespeicherte Phase), `aufwachen`, `wetterbericht`, `fahrt` (Canvas `draw`: Himmel, Land per Strahl `rayLand`, Tonnen mit Kennung `lightOn`, Schiffe `drawShip` mit Lichtern nach Lage, Nebel, Regen, Deck, Wanten als Peilmarke, Steuerrad, Verklicker), Mini-Karte über `NAV.mountChart`, `zeigeAufgabe`/`antwort` (Reaktionszeit, Signale tuten, Peilen, Fernglas), `frageAufgabe` (SBF, SKS-MC, „nur offen“), `genAufgabe` (Tonne, Kardinal, Feuer, Lichter, Signalkörper, Strom, Kurs selbst absetzen), `etappeEnde`/`nachbesprechung`, `seenot`, `laden` (Bootsladen), `logbuch`, `TOERN.mcRunde` (SKS-Ankreuzrunde)
  - Spielstand: `S.toern2` {`kasse`, `prov`, `sprit`, `teile[]`, `vorrat{}`, `log[]`, `seen{}`, `provDay`, `schnitt{}`, `lauf`: {`id`, `si`, `e`, `tag`, `phase`, `w`, `plan`, `t`, `i`, `card`, `zustand`, `laune`, `punkte`, `eRes[]`, `res[]`, `sterne[]`}}; Standard `null`. Der alte `S.toern` bleibt unangetastet, sein Logbuch zeigt `toernCard` mit an.
  - Am langen Boot zeigt `ausrArt()` verbaute Teile. `AUD.sfx`/`AUD.horn` können mit `pan` links/rechts klingen.
- **Dateien:**
  - `index.html` (Code und CSS, ~514 KB; große neue Bereiche in eigene Dateien, R11)
  - `sw.js` (Cache; `VERSION` immer gleich `__ver`)
  - `navi.js`, `toern.js`, `knoten.js` (nachgeladen), `data/einfuehrungen.json` (5.10, Schein-Einführungen `schein_*`, Knotenbrett), `data/knoten.json`
  - `datenschutz.html`, `impressum.html`, `fonts/OFL-*.txt`; Über die App: `renderSources` (Einstellungen) mit der Karte „Wichtiger Hinweis und Haftung“ (`#haftung`); derselbe Text steht im Impressum (`impressum.html#haftung`), immer beide zusammen ändern. Links in Texten haben die Farbe `--link` (hell und nachts lesbar).
  - Musik im Törn gesperrt über `window.TOERN_STILL` (V15); Törn-Karte `ctl.center`, Knopf „Zurück zum Boot“ (V13)
  - `tests/smoke/rauchtest.js`, `.githooks/pre-commit` (Rauchtest vor jedem Commit)
  - `manifest.webmanifest`, `icon-192/512.png`, `.nojekyll` (GitHub Pages liefert alle Dateien unverändert aus, auch `.md`)
  - `data/`: `sbf.json`, `sks.json`, `binnen.json`, `nav.json`, `folgen.json`, `lexikon.json`
  - `img/q/` (SBF-Bilder), `img/b/` (Binnen-Bilder, auch SBF 16–30)
  - `audio/`
  - `audio/stimmen/` (Stimmenpaket mit `manifest.json`: 359 Sätze, 18 MB, Teil 1 vollständig; legt die Stimmen fest)
  - `PODCAST_BIBLE.md` (Regelwerk Kajütenfunk) und `PODCAST_STATUS.md` (Entscheidungen, offene Fragen), siehe R15
  - `podcast/`: `audio_config.json` (Modell, Voice-IDs, Wörterbuchversion, Chunking, `lektion_regeln` für Folgenskripte), `pronunciation_dictionary.md` (Ausspracheverzeichnis), `skripte/` (Hörproben `test-01.md` und `vorstellung.md`), `folgen/` (Folgenskripte des Hörkurses, Kopf `folge: S2.2`, Datei `S2-2.md`; `VORLAGE.md`; Probefolge `probe-G6-3.md` mit `status: probe`), `geraeusche.json` (Geräusche zum Erzeugen: Name, Prompt, Sekunden, Schleife, Revier; `datei` für fertige Dateien in `geraeusche/`), `archiv/` (Geschichte: Leitfaden, Folge 1, Vorgeschmack; wird nicht geprüft)
  - `casting.js` (nachgeladen, Entwickler): Karte „🎭 Stimmen-Casting“, `CASTING.oeffnen` (Rollen aus `podcast/casting.json`, Probe je Rolle und Stimme über Text to Dialogue mit `eleven_v4`, Vorstellungsrunde, Bibliothek `/v1/shared-voices` mit Hörbeispiel und `/v1/voices/add`, Zuordnung in `S.cfg.casting` mit `cfg` = Konfigurations-ID zur Zeit der Wahl: Die Wahl auf dem Gerät gilt nur, solange die Konfiguration gleich bleibt, sonst gewinnt die neuere Konfiguration (`gilt`, ebenso in `kurs.js` und `hoerprobe.js`); „🆔 Stimme per ID eintragen“; Text zum Kopieren); `podcast/soundeffekte.md` (Geräusche, die der Nutzer liefert; seit 23.10.2026 für den Kurs gekürzt: Töne des Kurses, eine Atmo je Revier, wenige Einzelgeräusche; die alte Liste liegt in `podcast/archiv/soundeffekte-geschichte.md`)
  - `kurs.js` (nachgeladen über `nachladen('kurs.js')`, V41): Kajütenfunk-Player `KURS.oeffnen('probe')`, erreichbar über den Hocker (`hockerWahl`: „🎧 Kajütenfunk: Probefolge“ oder „💬 Der Crew zuhören“ → `bgSit`). `nachladen(datei)` und `castingOeffnen()` in index.html.
    - Zerlegen: `zerlege(txt, cfg, ger)` macht aus einem Folgenskript einen Ablauf (`abschnitt`, `revier`, `rede` mit Text-to-Dialogue-`inputs`, `pause`, `wahl`, `bild`, `tipp`, `signal`, `ton`; `bereich` für Vertiefung und Hörkarte; `ab` = Abschnittsnummer). `tipp` steht beim ersten `[[KATALOG]]` einer Vorab-Frage. `laden` liefert dazu `abschnitte` (Dauer `sek`, `zeichen`).
    - Erzeugen (v4.91, B139): erst `stimmenPruefen` (kostenlos, `GET /v1/voices/{id}`, zeigt die Namen; läuft vor jeder Sprache von selbst und bricht bei fehlender Stimme ohne Credits ab), dann `erzeugen(st, info, {sfx: true})` für die Geräusche und `erzeugen(st, info, {ab})` für die Sprache je Abschnitt (Eleven v4, `mp3_44100_64`, Kosten vorher bestätigen, nur fehlende Teile; Stimmen aus der Konfiguration, darüber `S.cfg.casting`). Gespeichert in `CLIPS` unter `kurs:<hash>` bzw. `sfx:<hash>` (Meta ohne `cid`, also nicht im Stimmenpaket-Export). `bestand` liefert `abOffen` je Abschnitt.
    - Geräusche: `podcast/geraeusche.json` (`sfx`, erzeugt über `/v1/sound-generation` mit `eleven_text_to_sound_v2`, etwa 20 Credits je Sekunde `sfxKosten`; `[[AUDIO: Name]]`, `parallel` läuft unter dem Gespräch, Atmo je `revier` in Schleife `atmoA`, unter Sprache leiser `duckAtmo`). Feld `datei` = fertige Datei im Repo (`podcast/geraeusche/`), hat Vorrang. Einzeln anhören und herunterladen (`runter`), alle als ZIP `sfxZip` (`geraeusche-<folge>.zip`). Sonst Revier-Geräusche der App `ATMO` und App-Töne `TOENE` (Schiffsglocke, Schritte …).
    - Abspielen: Auto (Denkpausen mit `AUD.ticks`, keine Knöpfe) oder interaktiv (Knöpfe bei `[[WAHL]]`, ohne eigene Antworten die vier amtlichen über `frage`; `zaehle` → `record` für SBF und Binnen-Basisfragen; `richtig`/`falsch`; Vertiefung nur nach falscher Antwort; Tipp der Vorab-Frage bei der Auflösung `tipp`). Kein Ton am Anfang (O15), ein neues Revier läuft erst 1,5 s allein. Das Abspielen endet vor dem ersten Abschnitt ohne Sprache (`me.ende`, B140). Denkpausen mindestens `DENK_MIN` = 6 s (B152), Bild 2 s vor Satzende (`rede(…, vorBild)`, `me.bildDa`, B158), am Ende Knopf „📝 Fragerunde“ (`folgenFragen`, `fragerundeKnopf` → `runQuiz`, B157). Bilder aus `DATA`, Signale `AUD.horn`, Einstellungen `S.cfg.kurs` {`modus`, `tempo`, `mitlesen`, `ticken`}.
    - Für alle: „📦 ZIP speichern“ (auch mit einem Teil der Abschnitte) → `tools/kurs-import.js` → `audio/kurs/<folge>/` mit `ablauf.json` (legt die Stimmen fest), Verzeichnis `audio/kurs/index.json`; `geraeusche-*.zip` → `podcast/geraeusche/` und `datei` in `podcast/geraeusche.json`.
  - `ziele.js` (V42, nachgeladen über `zieleOeffnen()`; Einstellungen „🎯 Scheine, Termine und Lernzeit“, Karte an Deck ohne Termin, Kennenlernen über `ZIELE.imGespraech`, ohne Netz die alten Fragen): `normal()` (Standard für `S.ziele` {`v`, `scheine`: {id: {`theorie`, `praxis`}}, `minuten`} aus den alten Angaben), `lage()` (Bedarf in Stunden aus `data/ziele.json` `bedarf`, minus Prüfungsreife; der Reihe nach bis zum Theorietermin; `ok`/`knapp`/`nein`/`offen`, nötige Minuten), `kommentar()` (feste Bausteine `ZIEL_TEXTE`: `kommentar`, `soLernst`, `mehrere`, `reicht`, `empfehlung`, `praxis`, `abschluss`; im Stimmenpaket über `packLines`), `anwenden()` (Termine in `S.courses[id].exam`, `S.profile`, aktiver Schein ist der mit dem nächsten Theorietermin), `seite()`. Im Kurs für heute `praxisBald()` (drei Wochen vor dem Praxistermin ein zweiter Praxis-Happen `praxis2`, `praxisHappen(versatz)`)
  - `hoerprobe.js` (nachgeladen, Entwickler): Karte „🎧 Podcast-Hörprobe“ in den Einstellungen spricht `podcast/skripte/test-01.md` über ElevenLabs Text to Dialogue mit dem Schlüssel auf dem Gerät (`HOERPROBE.zerlege`, `erzeuge`; Eleven v4 oder v3), Ergebnis anhören und als MP3 speichern
  - `docs/konzept-kajuetenfunk.md` (V41, finales Konzept Fassung 5: Teile G/S/B, Kapitel, Folgen, Abschnitte; Scheine, Termine und Lernzeit §3.5 (V42); Länge; Didaktik mit Merksätzen §5.6; Rahmen je Folge §6; sechs Folgenformen; Bauplan einer Folge; Baukasten, Gäste, Harms; Figuren; Auto- und interaktiver Modus mit Antwortknöpfen; hörbares Revier; Animationen; Fragerunde, Hörkarten, Nachhilfe-Folge, Schnellspur; Fallen; Prüfweg; Technik; Kosten; Ablaufpläne G3.1, S2.2, S3.1; Änderungen Fassung 5 in Anhang G, Probefolge in Anhang H. Die Abschnitte Umfang, Kursplan, Animationen und Steckbriefe erzeugt `node tools/kursplan-pruefen.js --konzept` zwischen `<!-- NAME:START -->` und `<!-- NAME:END -->`), Fassung 3 in `docs/archiv/konzept-kajuetenfunk-fassung3.md`, Fassung 4 in der Versionsgeschichte; `podcast/kursplan-sbf.json` (Fassung 5: `teile` → `kapitel` (`ueberblick`) → `folgen` mit `fragen`, `schwerpunkt`, `form`, `minuten`, `baustein`, `rahmen`, `lage`, `gast`, `revier`, `ort`, `animation`, `praxis`, `recherche`, `bezug`, `braucht`, `besuch_hinweis`; dazu `formen`, `bausteine`, `gaeste` (mit `QUIRIN`), `rahmen`, `reviere`, `animationen` mit `prio`, `laenge`), `docs/recherche-kajuetenfunk.md` (Recherche-Dossier R1–R64 mit Quelle und Güte A/B/C), `docs/kurs-fragen-sbf.md` (alle Fragen je Folge mit allen amtlichen Antworten und dem Merksatz 💡, erzeugt mit `--fragen`), `podcast/figuren.md` (Figurenprofile, vom Nutzer bestätigt; Smilla aus Köln am Rhein, Quirin als Binnen-Profi mit Herkunft A oder B, O39), `podcast/wortschatz.md` (gemeinsamer Wortschatz: Grüße, Kommandos, Bordwörter, Redewendungen, Platt, Kölsch, Bairisch, Aberglaube, Wetterregeln, Klabauter; Abschnitt 11 doppeldeutige Seemannsbegriffe mit Figur; mit Figur, Hinweis und Quelle), `docs/pruefauftrag-kajuetenfunk.md` (Prüfauftrag zu Fassung 2, Bericht ist eingearbeitet), `docs/entwurf-lauf5.md` (Lauf 5, Einzelheiten B1–B6)
  - `docs/`: Konzepte, `archiv/` (alte Briefe), `apk-anleitung.md`, `quellen-audio.md`, `toern2-plan.md`, `lauf3-plan.md`, `feste-saetze.md`
  - `tests/`: `smoke/rauchtest.js` (Rauchtest mit eigenem Server), `toern-daten.js`, `balancing.js`; `tools/`: `tag-fragen.js`, `sks-mc-pruefen.js`, `json-kompakt.js`, `knoten-pruefen.js` (Jones-Polynom: Kreuzknoten oder Altweiberknoten), `podcast-pruefen.js` (prüft Podcast-Skripte in `podcast/skripte/` und `podcast/folgen/` vor jeder Generierung, `--entwurf` beim Schreiben; Folgenskripte mit Kopf `folge:` zusätzlich nach `lektion_regeln` in `podcast/audio_config.json`: Katalogsatz `[[KATALOG]]` enthält die amtliche Antwort, `[[FALLE]]` zitiert eine amtliche Falschantwort, `[[IRRTUM]]`/`[[BERICHTIGUNG]]` höchstens 20 s, `[[REVIER]]` je Szene und ausgesprochen (`REVIER_WORTE`), `[[DENKPAUSE]]` 3/5/6, `[[WAHL: sbf:n | … | *richtig]]` mit 5 s (ohne Fragennummer nur nach `[[VORAB]]`), `[[VERTIEFUNG: sbf:n]] … [[VERTIEFUNG: ende]]` Pflicht zu jeder Wahl auf eine Frage der Folge (höchstens 600 Zeichen, zählt nicht zur Länge), `[[ANIM]]` aus dem Kursplan, höchstens sechs Merkhilfen und drei Stimmen je Szene, `[[RUECKBLICK]]` aus mindestens zwei früheren Folgen, keine Ziffern, Baustein und Dauer laut Kursplan, `[[HOERKARTE]]` je Frage mit Katalogsatz; Kopf `status: probe` macht fehlende Teile der vollen Folge zu Warnungen; läuft im pre-commit, wenn `podcast/` geändert ist), `kurs-import.js` (Kajütenfunk-ZIP aus der App nach `audio/kurs/`, Geräusche-ZIP nach `podcast/geraeusche/`), `kursplan-pruefen.js` (jede Frage genau einmal, Teil G = Fragen 1–72, Baustein wechselt, Rahmen (`RAHMEN`, nie zweimal derselbe hintereinander, Besuch nur mit Gast), Lage, Gast, Revier, Animationen, Recherche-Nummern, Vergleichsfolgen nur mit früherem Stoff, erzeugte Abschnitte im Konzept aktuell; `--md`, `--umfang`, `--animationen`, `--steckbriefe`, `--fragen`, `--konzept`; im pre-commit bei `podcast/`)
- **Start:**
  - `startApp` → `loadData` (alle `data/`-Dateien) → `boot` → `splash` → `runIntro` (Streit, `INTRO`) → `convoOnboarding` (Knöpfe plus Textfeld; `ONB`, `ONB2`, `ONB2_OPTS`, `NICKS`) → `keysStep` → `endIntro`
  - Flag `introV5` wird erst in `endIntro` gesetzt. `?neustart` setzt die Intro-Flags zurück, `S.reOnb` erzwingt neue Fragen.
- **Deck:**
  - `renderBoat` zeigt nur noch eine Ansicht (V9): `boatScene` mit Steuerrad von der Seite (Törn), Niedergang, Eggs (Ring, Flaggen an `#flagline`, Angel nur bei ruhigem Wetter, Frachter nur nachts), Ausrüstung `ausrArt()`, darunter das Rennen `courseCard`. Seekrank-Egg: 7× schnell aufs Wasser tippen. Die lange Ansicht ist entfernt.
  - Eggs: `startEgg` mit Handlern je `data-egg`
  - Fernglas: `bindFernglas`, `GAME_KEYS`, `BOAT_HINTS` / `DETAIL_HINTS`
- **Kajüte:**
  - `renderCabin`, `cabinScene`, `CABIN_SPOTS` (`fn` = vom Fernglas markiert), `SPOT`, `TAP`
  - Erstbesuch: `cabinWelcome` (Texte `CABIN`, SKS-Quiz, `fahrplanSheet`)
  - Hocker: `bgSit`
  - Nebelglocke, Handpeilkompass und Bordmesser (Deviation-Egg) als `data-tap` in `cabinScene`, rufen `startEgg`
  - Knotenbrett: Spot `knoten` → `knotenBrett()`
  - Lernstationen (V34): `lernWand()` in `cabinScene` zeichnet Knotenbrett (`.hang2`, großer Knoten, gelernte Knoten ab `knotenWert` ≥ 0,5 an Haken), Seekarte (`.wandkarte`, Kurslinie wächst mit den Lektionen mit Stern) und Manöverbrett (`.manbrett`, Spielfigur rückt je Manöver mit `ok`); Spots `karte` → `navSchool`, `manoever` → `maneuverGame`, `tisch` und `buecher` → `meinePruefungen`; keine Ringe in der Kajüte
  - Prüfer: `harmsKommt(via)` (Telefon `telefon` oder Crew-Menü „Hol Kapitän Harms“), Sätze `HARMS`, danach `examIntro('harms')`
- **Easter-Eggs:**
  - Register `EGGS`, Fund melden mit `foundEgg(id)` → `S.eggs`, Anzeige `eggCard`
  - Sätze `EGG_LINES` (über `sayEgg`), `FLAG_ART`, `glasenNow`, `wxOverride`
- **Spiele:**
  - `GAMES`, `gamesHub` (Raster, `GAME_ART`), `gameShell`, `gameOver`
  - Bauteile-Spiel: Trefferflächen `PARTS[].f`, `partHit` (V11)
  - Knoten (V12): `knoten.js` (`loadKnoten`, `KNOTEN.brett/zeige/ueben/spiel`), Daten `data/knoten.json`, Bestzeiten `S.knoten`
  - Knoten-Animationen in `knoten.js`: gemeinsames Werkzeug (`spline`, `strang`, `spitze`, `STIL`, `posen`, `mitRest`, `knotenAnim(def)`: Seile mit Stützpunkten [x, y, Stück], Ebenen `z` je Stück für über/unter, Requisiten `obj` mit Ebene, Phasen mit Schritt `st`), Verzeichnis `ANIM` (Feld `anim` in `data/knoten.json`): `PAL` (Palstek, eigenes Auge gleicht die Länge aus), `ACHT` (Block), `KREUZ` (v4.72: gelb von links, blau von rechts; rechts über links und umeinander, links über rechts und umeinander, festziehen; fertig zwei ineinandergreifende Buchten mit sechs Kreuzungen, in der Mitte Blau oben, an den Seiten Gelb; mathematisch geprüft mit `tools/knoten-pruefen.js`, läuft vor jedem Commit, wenn `knoten.js` geändert ist), `SCHOT` (aus der Palstek-Geometrie, von hinten), `WEBE` (Reling), `RUND` (Festmacherring), `KLAMPE` (von oben), `STOPPER` (an einer Leine unter Last, Zug von rechts, zwei Törns über den stehenden Part, halber Schlag auf der anderen Seite), `SLIP` (Webeleinstek auf Slip: Posen `PRE` Ende hängt, `KB` Bucht liegt bereit, `LOOSE` Bucht durchgesteckt; letzter Schritt Lösen); verwandte Knoten (Feld `verwandt`) stehen im Spiel nie zusammen zur Wahl; `spieler(canvas, A, {von, bis})`; Spielrunde `schritt` („Was passiert hier?“, alle Knoten), Test-Aufruf `KNOTEN.spiel(['schritt'])`; alter Eintrag `palstek-anim` wird in `palstek` übernommen (`altPalstek`)
  - Ordnung (V26): Deck `renderBoat` mit `#kursheute` (nächster Schritt aus `todayPath`) und `standKarte`; `lernHeim` ('deck' | 'pruef') leitet `setTab('cabin')` nach dem Lernen zurück, `heimText()` beschriftet den Knopf; `S.crewSchein` (Standard `S.course`, `switchCourse` setzt ihn, `setTab` aktiviert ihn an Bord über `scheinAktiv`), `S.lernSchein`, `S.scheine[id].ok`. Wertung: `fortschritt(id)` mit `fragenStand` (Prüfungsreife nach Farben, `sicher` = grün, `f` = Farbverteilung; Binnen ohne Segeln bis Frage 253), `naviStand` (`NAVI_LEKTIONEN`), `praxisStand` (`MAN_IDS`, `KNOTEN_IDS`, `knotenWert`: Knotenkunde `S.knoten[id].kk` ≥ 3 halb, echtes Tau halb); das Rennen `courseCard` zeigt die Theorie. Bausteine: `basisTeilen()` in `save()` gibt Basisfragen 1–72 und Kapitel b1–b5 an den Partner-Schein, `basisZusammen()` führt alte Stände einmal zusammen (`S.basisV1`). Spielekiste ohne `PRUEF_UEBUNGEN`. „Meine Prüfungen“ in `schein.js` (`meinePruefungen(id)` → `SCHEIN.seite`, `themen`; Spot Bücher/Kartentisch und Käpt'n-Menü `pruef`; Kuchen je Theorie- und Praxisthema, lokale Scheinfarbe heißt `scheinFarbe`).
  - Grundkurs Seezeichen (V27): `seezeichen.js` + `data/seezeichen.json` (`loadSeezeichen`, `seezeichenKurs(art)`, `SEEZ.kurs/lektion`): Karten mit Originalbild und amtlicher Antwort (`q`), Merkhilfe, blinkende Kennungen (`takt`), Prüfungsfragen je Lektion (zählen für SBF See bzw. Binnen), Stand `S.seez[art][lektion]`; im `todayPath` vor dem Thema `SZ_THEMA`.
  - Manöverspiel (V23): `manoever.js` (nachgeladen über `loadManoever`, `maneuverGame()` startet es), Texte `data/manoever.json` (`window.MAN_DATA`): `MANOEVER.spiel` (Übersicht, Steuerart `S.cfg.steuer` 'pinne'/'rad'), `vorher`, `fahren(id, versuch)` (Physik `fahre`: Schub-Lenkung, Radeffekt, Wind; Steuerfeld `steuerfeld`; Kommandos `G.frage` mit `nachFrage`; Regeln je Manöver; Bewertung bis 1 Fehler ausreichend), `demo(id, ab)` (Schlüsselbilder `bahn`); V39: Stillstand bei Kommandos (`G.offen`), Kamera mit `ZOOM` und Ansicht `V` (Welt W × H bleibt fest), Zielpfeil am Rand, 🔍 `S.cfg.manZoom`, ⛶ `S.cfg.manVoll` mit `vollAn`/`vollAus` (`body.mvoll`, `setTab` beendet es), Einweisung `MN.vorher` aus `ziel`, `demo[].sag`, `kommandos`, `pruefer` (Vorlesen; Sätze in `packLines`); Spielstand `S.man[id]` {`ok`, `seen`, `nok` Fehlversuche}; in der Törn-Bonusrunde nur Anlegen ohne Abfragen
  - Bonusrunden im Törn (V14): `BONUS`, `bonusRunden`, `bonusZeit`, `bonusEnde` (index.html) kürzen Spiele und leiten Punkte an `toern.js` (`MINIS`, `miniEinbauen`, `miniAufgabe`, `bonusZurueck`) statt in Rekorde
  - Punkte immer über `recordScore(key, wert)`: Trophäen `TROPHY`, Crew-Rekorde `NPC_BEST`, Sprüche `OVERTAKE`, Rang `rankInfo`, `leaderSheet`, `trophyCard`
- **Lernen und Prüfung:**
  - Farben je Frage (V35): `farbe(s)` aus `FARBEN` (dunkelgruen, hellgruen, gelb, orange, rot, grau), `serieVon`/`tageVon` leiten alte Stände aus `b` und `w` ab, `serieSetzen` in `record`, `fehlerMerken` (Prüfung, Törn), `sitzt` (hell- oder dunkelgrün), `farbStand(list)` mit Prüfungsreife (`reife`), `kuchen(z, size, txt)`, `farbLegende`, `topicStats` liefert `f`, `praxisFarben` für Navigation, Manöver, Knoten. Neue Felder in `S.qs[n]`: `r` Serie, `l` letzte richtig, `tg`/`td` Tage, `t` Tricky, `pr` Vertippt wartet auf Bestätigung (alle optional, R7)
  - Easy/Tricky (V36): Chips `[data-et]` in `runQuiz` `answer()`, `selbstEinschaetzung(n, ok, vor, nach, wahl)`; eine Wiederholung mit `pr` wird gezählt
  - Phasen und Tagespfad (V37): `lernPhase()` (rundgang, festigen, reife), `phasenSheet`, `BLOCK` = 8, `faellig()` (Wackligste zuerst), `wackelig()`, `todayPath()` mit Happen `review`, `unit`, `review2`, `praxis`, `extra` (Namen erledigter Happen in `S.path.lab`), `praxisHappen()` (`KNOTEN_NAMEN`, `MAN_NAMEN`), `reviewSession` mit „Noch ein Block“ (`opts.mehr`), `recommendNext` je Phase
  - Smilla treibt an (V38): `LINES.smilla.treiben`/`treibenNoch`, `LINES.klabauter.nachsitzen`, in `finish()` nach Wiederholungen (`nachOk`, `nachNo`)
  - `runQuiz` (Option `scoreKey`), `examIntro` / `startExam` (beliebig viele Teile aus `COURSE.exam.parts`), `startExamOpen` (SKS)
  - Plan: `computePlan`, `fahrplan`
- **Kurse:**
  - `COURSES` (`sbf`, `sks`, `binnen`), `COURSES_SOON` (Funk, Pyro: ausgegraut), `useCourse`, `switchCourse`, `QN`, `TOPICS`
  - Themen: `SBF_TOPICS`, `BIN_TOPICS`, `SKS_TOPICS`
  - Binnen-Prüfung: `BIN_EXAM.motor` / `.segel`, Wahl über `S.binSegel`
- **Lexikon:** `LEX` (aus `lexikon.json`), `lexEntries`, `renderLexikon` (Kategorien, Suche), `lexSheet`, `lexOf(q)` (Knopf in der Lernrunde nach dem Antworten), `sksRelated`
- **Folgen:** `EPISODES`, `SHORTS`, `playEpisode`, `epFill`, `showStory` (alter Stand, wird durch V33 ersetzt; Ausgangslage in `PODCAST_STATUS.md` §7)
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

### Lauf 6: Vision (ab 28.10.2026)
- [x] H1 Fundament: alte Version 4.95 spielbar unter `/alt/` (Werkzeug `tools/alt-version.js`, gebaut aus Commit `c0f7068`; Töne kommen aus `../audio/`, eigener Service Worker, gleicher Spielstand → R7 streng); `CLAUDE.md` Version 5 (Erledigtes nach `docs/archiv/claude-v4-status.md`); Aufräumliste `docs/aufraeumen.md`; Vision mit den Antworten O88–O92. Die Git-Marke `v4.95-stabil` ließ sich nicht hochladen (nur der Arbeitszweig ist erlaubt).
- [x] v4.96 H2 Szenen-Player und Gratis-Stimme: `szene.js` (`SZENE.spiele` für alles Gesprochene der Reise mit Bild, Wahl mit Empfehlung, Knopf, Pause, Aktion, amtlicher Frage; `SZENE.frage` liest Frage und Antworten mit der Handystimme vor, Zuruf: beim Vorlesen nur Alfa bis Delta, danach auch A bis D); im Quiz Knöpfe „🔊 Vorlesen“ (Standard an) und „🎙️ Zuruf“ (Standard aus), Antworten mit A–D; Einstellungen „🗣️ Gratis-Stimme je Figur“ (eigene Handystimme je Figur, Probe); Kajütenfunk: Denkpausen mindestens 6 s (B152), Bild 2 s vor dem Ende des Satzes davor (B158), am Ende „📝 Fragerunde“ mit allen Fragen der Folge (B157). Piper ließ sich hier nicht testen (Server gesperrt).
- [x] v4.97 H3 Probe-Etappe: `reise.js` + `data/reise.json` (Sätze der Crew sind Platzhalter, B164). Kartentisch von oben (Schlei schematisch, Boot als Spielfigur, die Sicht kippt beim Hinsetzen), Etappe Arnis → Kappeln mit sieben Teilen (Tagesbesprechung mit Empfehlung und Wahl, Törnplanung mit Kartenfrage, Kajütenfunk, Fahrt, Knoten-Station, Abendrunde mit drei amtlichen Fragen, Logbuch), jeder Teil einzeln spielbar und abgehakt; Fahrt-Szene von hinten auf das eigene Motorboot (Wellenreihen, Schaukeln nach Wetter, Gischt, Regen, Nebel, Tageszeit, Windmühle am Ufer, rote Tonne mit Frage, 2×, überspringbar); Wege: an Deck „🧭 Mit der Crew weiter“, in der Kajüte der Kartentisch (bisher Meine Prüfungen, die Bücher bleiben); Rauchtest `03f-reise`
- [x] v4.98 H4 Aufräumen (Teil 1, `docs/aufraeumen.md`): Leiste unten „Deck · Kajüte · Frei üben“ (nur auf den drei Hauptseiten, `body.mittabs`), neue Seite „Frei üben“ (`renderFrei`: Fragen, Praxis, Nachschlagen und Hören, Prüfung und Spaß; zurück über `lernHeim = 'frei'`), Kajüte ohne die doppelten Knöpfe unter der Szene (Hinweis `.kajhinweis`), Crew-Menüs mit je zwei Aktionen und einem festen Satz beim Antippen, Deck ohne das Rennen, Einstellungen neu gruppiert (`groupSettings`) mit eingeklappter „🔧 Werkstatt“ (KI, Schlüssel, Klönen, Stimmen, Casting, Hörprobe, Stimmenpaket, Zuhören, Crew-Charakter, Protokoll, Selbsttest), Schrift „Groß“ (`S.cfg.gross`, `body.gross`), Seite „Geräusche“ (`geraeuscheSeite`, Daten aus `node tools/geraeusche-liste.js` → `data/geraeusche-app.json`)
- [x] v4.99 H5 Ankommen: Kennenlernen fragt keine KI-Schlüssel mehr (die liegen in der Werkstatt), neu Lernort (`prof.lernort`; im Auto läuft der Kajütenfunk im Auto-Modus) und Übungsset (`prof.set`); danach Rundgang 1 „Willkommen an Bord“ (`rundgangStarten` → `REISE.rundgang1`, Sätze in `data/reise.json` `rundgang1`, Platzhalter): Fenster unten, die Crew zeigt Reise-Knopf, Stand, Kajüte, Fernglas und Frei üben, der gemeinte Ort blinkt (`.rgblink`); ersetzt die alte Tour; jederzeit in den Einstellungen „Rundgang an Bord“; `SZENE.schutz` hält die Szene beim Wechsel der Seite am Leben; Rauchtest `03g-rundgang`. Einstufung: bleibt die Frage nach der Bootserfahrung (`prof.exp`)
- [x] v5.00 H6 Teil 1: Smilla begleitet jede Navigationsaufgabe außerhalb der Prüfung (`NAVI_CREW`, `smillaSagt` in `navi.js`: Satz beim Start, liest jede Hilfestufe vor, Rückmeldung nach „Prüfen“; aus mit `S.cfg.naviCrew`); Hinnerk sagt beim Knotenbrett jeden Schritt der Animation an (`ansagen` in `KN.zeige`, aus mit `S.cfg.knotenStimme`); beide Schalter in den Einstellungen unter Ton. Alles mit der Gratis-Stimme, Sätze sind Platzhalter
- [x] v5.01 H9 Teil 1: unter „Frei üben“ die Seite „🧰 Was du zum Üben brauchst“ (`uebungsListe`: Leinen, etwas zum Festmachen, Übungskarte 49, Kursdreieck, Zirkel, Bleistift)
- [x] Reise-Konzept (29.10.2026, O93–O100): Kajütenfunk und Reise sind eins (ein Tag = eine Folge); `docs/reise-konzept.md` mit 50 Tagen, allen 285 Fragen (Lektion, Fahrt oder Lage), Seemannswissen, Navigation als Leiter (ab Tag 20 täglich voll), Knoten und Manöver, wenn man sie braucht, Geschichte als Vorschlag und Prüfung der Seekarte 7 (Vorschläge 1–9); Daten `data/reise-plan.json`, Werkzeug `tools/reise-plan.js`; B165
- [x] v5.02 Probetag neu (Tag 2 „Erste Meilen über die Elbe“, Kuttershaven → Klüverhafen auf der Seekarte 7): Tisch antippen, die Karte kippt ins Bild, nur drei Felder; jede Aufgabe bleibt in der Geschichte (Navigationsaufgabe direkt auf der Karte, Minispiele Motorkunde und Anlegen, Palstek), Speicherpunkt an der genauen Stelle, Automodus „Nur hören“ spielt den ganzen Tag durch; alle acht Fragen von G2.1 (Propeller, Radeffekt) im Tag; Rauchtest `03f-reise` neu

### Jetzt dran
- **Probetag am Handy testen (Nutzer):** Deck → „🧭 Mit der Crew weiter“ oder Kajüte → Kartentisch; Tag 2 einmal mitmachen und einmal „Nur hören“. Dazu `docs/reise-konzept.md` prüfen und O101–O104 beantworten.
- **Vision-Lauf (Nutzer, 28.10.2026):** `VISION.md` ist der Anker. Reihenfolge H1 → H9 (§6), nach jedem Schritt veröffentlichen und gleich weiter. Story, Figuren und Folgen erst mit dem Input des Nutzers (H10, O52, B164).
- **Dateien fehlen noch:** Audiodateien (Pixabay, etwa 15 plus 2), Funk-Unterlagen (SRC/UBI), Dokument mit allen Zeichen (B159). Stand 27.10.: nichts davon auf GitHub angekommen (letzter Push 24.10.). Weg: github.com → Ordner `import` → „Add file“ → „Upload files“ → „Commit changes“.
- **V41 Kajütenfunk, Probefolge erzeugen und hören** (Nutzer, ElevenLabs-Schlüssel auf dem Handy). Alles unter Kajüte → Hocker → „🎧 Kajütenfunk: Probefolge“ → Karte „Erzeugen“:
  1. „🔎 Stimmen prüfen“ (kostenlos). Bei Quirin muss „Alexander“ stehen. Wenn nicht: „🎭 Stimmen-Casting“ → Quirin → Alexander „holen“ und „nehmen“.
  2. „🔊 Geräusche erzeugen“ (etwa 800 Credits), mit ▶ anhören, mit ⬇ herunterladen (einzeln oder „Alle als ZIP“). Sollen sie für alle ins Repo: `geraeusche-probe.zip` in den Ordner `import` hochladen, dann `node tools/kurs-import.js`.
  3. Sprache Abschnitt für Abschnitt: 1–3 und die Hörkarte (zusammen etwa 4.960 Credits), Abschnitt 4 „Harms ruft an“ nach Wunsch (etwa 1.340). Das Abspielen endet vor dem ersten fehlenden Abschnitt.
  4. Hören im Auto- und im interaktiven Modus, Rückmeldung an Claude. Wenn sie gefällt: „📦 ZIP speichern“ und in den Ordner `import` hochladen, dann baut Claude sie für alle ein (`tools/kurs-import.js`).
  - **Danach:** Rhythmus, Dichte, Konzept, Vorlage, Figuren und Sprechregie nach dem Hören feinjustieren, dann Teil G schreiben.
  - **Offen:** O43 (Ton der Live-KI) ist vertagt.
- **Funkscheine (SRC/UBI):** Die Kataloge sind laut Nutzer da (22.10.2026), im Repo und in der Cloud-Sitzung aber nicht zu finden. Bitte nach `quellen/` (bleibt privat) oder `import/` legen.
- **Lauf 5 am Handy testen** (siehe Handy-Checkliste). Die 12 Sätze von Smilla und Klabauter (V38) sowie Aufgaben und Prüfpunkte der Manöver (V39) fehlen noch im Stimmenpaket: „🎙️ Neue Sätze nachliefern“.
- **V32 Katalogbilder in Farbe:** sobald der Nutzer die Fragenkatalog-PDFs schickt; die Bilder werden aus den Originalen übernommen, nicht verändert.
- **V29 Etappe 2:** sobald die Quellen in `quellen/` liegen (`node tools/quellen-check.js`), siehe `docs/quellen.md`.
- **Stimmen nachliefern** (Nutzer, am Handy): Einstellungen → Stimmenpaket → „🎙️ Neue Sätze nachliefern“, ZIP in den Ordner `import` hochladen.
- **Vom Nutzer auszufüllen:** Name, Anschrift und E-Mail in `impressum.html` und `datenschutz.html` (gelb markierte Platzhalter).
- **Am Original prüfen** (ELWIS war gesperrt): SBF 279 (jetzt 3 Antworten, die 4. fehlte), SKS recht-23 (braucht die Abbildungen, ausgeblendet).
- **Kajütenfunk, Stimmen:** Der Nutzer überarbeitet die Stimmen selbst (Einstellungen → „🎭 Stimmen-Casting“). Die Rangerin spricht mit `CoFoB7a7PXA8RBsMHbua` (27.10.2026). Quirin spricht mit Alexander (ID seit 24.10.2026 in der Konfiguration). Das Bairische prüft ein Bekannter des Nutzers. Entschieden am 23.10.2026: Funkwörter ja (VS43), Klabauters Stimme auch in der App und alle App-Stimmen nach der Freigabe neu mit v4 (O38), schwierige Aussprache prüft der Nutzer (O33). Offen: Prüfungsordnung für Harms (F3). Geräusche: Die gekürzte Liste `podcast/soundeffekte.md` nennt, was fehlt; am wichtigsten sind ein eigener Erkennungston sowie Hafen und Kajüte.
- V20: Handy-Checkliste mit dem Nutzer.
- Die Prüfungsrichtlinie (PDF vom Nutzer, 10.10.2026) bitte zusätzlich in `quellen/` ablegen; in der Cloud lag sie nur als Upload vor.

### Entscheidungen
- **E1 Altersfreigabe:** ab 12 (Nutzer, 09.10.2026). Ton siehe §3 und V3.
- **E2 KI-Funktionen bei der Veröffentlichung:** nur mit eigenem Schlüssel, sonst aus. Die Stimmen kommen aus dem Paket (Nutzer, 09.10.2026). Wunsch: auch andere Anbieter-Schlüssel (z. B. Gemini) zulassen.
- **E3 Veröffentlichung:** als etwas zum Verschicken mit eigenem Icon auf dem Handy. Weg: Installieren-Knopf in der App (Web-App mit Icon) und zusätzlich eine Android-Datei (APK), falls mit vertretbarem Aufwand machbar (Nutzer, 09.10.2026).
- **E4 KI-Tageslimit:** vorerst unbegrenzt (`KI_LIMIT` 0), ein Limit kommt später.
- **E5 Stimmenpaket, offen:**
  - **(a) Empfehlung:** Secret `ELEVENLABS_API_KEY` und Domain `api.elevenlabs.io` in der Cloud-Umgebung freigeben, dann erzeugt Claude das Paket.
  - **(b)** Export am Handy.
  - **Für den Podcast entschieden:** (a), sobald die Folgen ausgereift sind, zuerst nur ein Teil einer Folge als Test (Nutzer, 20.10.2026, `PODCAST_STATUS.md` B16).
- **E6 Stimmenqualität:** hoch (Nutzer). Vor der Erzeugung Modellprüfung und drei Probesätze. Für den Podcast gilt stattdessen `PODCAST_BIBLE.md` §14: Hörtest mit Testszene, Kandidaten Eleven v4 und v3.
- **E7 „Weiter“-Knöpfe:** bleiben gelb-orange (Nutzer, 09.10.2026).
- **E8 Cloudflare-Worker:** gestrichen, Supabase übernimmt das bei Bedarf (Nutzer, 09.10.2026).
- **E9 Konten mit Supabase:** freigegeben (05.10.2026), aber erst nach der Veröffentlichung (siehe E2).
- **E11 Farben für den Lernstand** (Nutzer, 22.10.2026): Rot ab 3 Fehlern, Dunkelgrün ab 4 richtig in Folge an mindestens 2 Tagen. Die Selbsteinschätzung Easy/Tricky wiegt schwerer als der Klick.
- **E12 Kajütenfunk als Coaching** (Nutzer, 22.10.2026): keine durchgehende Geschichte, Crew als Coaching-Team, Gäste möglich (nicht alle). Folgenlänge laut Konzept Fassung 5: 12–15 Minuten, mit K1 zu bestätigen.
- **E13 Haftungsausschluss** (Nutzer, 23.10.2026, O17): in „Über die App“ und im Impressum. Man lernt hier nicht sicher alles richtig, soll in den amtlichen Veröffentlichungen nachlesen, und die Haftung ist ausgeschlossen, soweit das Gesetz es erlaubt. Ganz ausschließen lässt sie sich nicht (Vorsatz, grobe Fahrlässigkeit, Leben und Gesundheit, Produkthaftung; Recherche R64). Vor der Veröffentlichung anwaltlich prüfen lassen.
- **E14 Startschuss Kajütenfunk** (Nutzer, 24.10.2026): „K1 ok“. Konzept Fassung 5 und Bible dritte Fassung gelten. Die Probefolge wird in der App erzeugt.
- **E15 Neue Richtung** (Nutzer, 27.–28.10.2026): Skipper wird eine Reise mit der Crew (Kern behalten, dünne Reise auf dem Kartentisch, aufräumen), die App ist gratis, verkauft wird ein Starter-Set; der Törn als eigener Bereich entfällt und wird Teil der Reise (Fahrt-Szenen); Navigation und Knoten früh und verteilt. Einzelheiten und alle Entscheidungen: `VISION.md` §13.
- **E10 Folgen:** Ersetzt (Nutzer, 20.10.2026): Die Folgen werden völlig neu geschrieben, siehe `PODCAST_BIBLE.md` (V33). Früher galt: Der Nutzer überarbeitet sie selbst, danach kommt Stimmenpaket Teil 2.

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
