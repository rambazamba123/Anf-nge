# Fehlerkatalog: was schon einmal schiefging

> Nutzer 09.11.2026: „Merke dir das so vor, dass du die gleichen Fehler nächstes Mal selbst findest.“
> Claude geht diesen Katalog **vor jedem Bericht** durch (R17 in `CLAUDE.md`): Teil A, bevor eine Folge abgegeben wird, Teil B bis E, wenn Player, Animationen oder Code geändert wurden.
> Jeder neue Fehler, den der Nutzer findet, kommt hier hinein: was passiert ist, woran man es erkennt, wie man es prüft. Was sich automatisch prüfen lässt, kommt in ein Werkzeug (⚙), sonst ist es ein Handgriff (✋).

## Werkzeuge
- ⚙ `node tools/podcast-pruefen.js <folge>`: Skripte (HR38 Funkwörter, HR44 Nachdenkfragen, HR46 Dichte, Logbuch, Länge). Läuft im pre-commit.
- ⚙ `node tools/logik-pruefen.js`: Figur nicht an Bord, „Morgen wieder“, fast doppelte Sätze, Spruch ohne Anlass. Läuft im pre-commit.
- ⚙ `node tests/buehne-pruefen.js` (vorher `python3 -m http.server 8765`): Bühne der Hörreise am Handy-Maß. **Nach jeder Änderung an `kurs.js`, am Player-CSS oder an Folgen von Hand laufen lassen** (dauert etwa zwei Minuten, darum nicht im pre-commit).
- ⚙ `BREITE=320 ZEIT=4000 node tools/anim-bilder.js bild.png 0 9 =<id>`: alle Phasen einer Animation als Kontaktabzug. Nach jeder Änderung an einer Animation ansehen.
- ⚙ `node --check <datei>.js` nach jeder Bearbeitung mit Python oder sed (v5.55, v5.56: kaputte Zeile nach mehrzeiligem Ersetzen).

## Teil A: Folgen schreiben
| Fehler (Version) | Woran erkennen | Prüfen |
|---|---|---|
| Fakt fünf- bis siebenmal in wenigen Minuten (v5.56) | zweites „Genau, …“, zwei Merksätze in einer Szene, Auflösung und Merksatz fast gleich | ⚙ HR46; ✋ je Fakt zählen und im Logbuch eintragen |
| Antwort steht direkt vor der Frage (1-2 Gashahn, 1-3 Backbord) | Figur erklärt, dann „Frage an dich“ zum selben | ⚙ HR46 „Frage verraten“ (nur bei Antwortknöpfen); ✋ bei Nachdenkfragen selbst lesen |
| Funkwörter bei Fragen ohne Antwortknöpfe (v5.56) | „Alfa:“ vor einer Denkpause ohne Wahl | ⚙ HR44 |
| Antworten nicht vorgelesen (v5.53) | Wahl ohne „Alfa: … Bravo: …“ im Satz davor | ⚙ HR38 |
| Satz ergibt keinen Sinn, Figur nicht an Bord, „Morgen wieder“ vor dem nächsten Anruf (v5.48) | Logik-Probe | ⚙ logik-pruefen; ✋ jede Folge einmal laut lesen |
| Jemand kündigt Harms an, statt dass er selbst anruft (v5.55); Smilla nennt seinen Namen vor seiner Vorstellung (v5.56) | Name „Harms“ vor seiner ersten Zeile | ✋ |
| Animation passt nicht genau zum Gesagten (v5.55, zwei in 1-1) | Bild zeigt etwas anderes als der Satz daneben | ✋ HR41 |
| Überblick-Animationen ohne Bezug am Anfang (v5.56, 1-3) | Animation zu „Erstens, Zweitens“ | ✋ erst zeigen, wenn es konkret wird |
| Animation nur mit `[[ANIM: id]]` aufgerufen, blieb im ersten Bild (v5.56) | keine Phasen im Skript | ⚙ Player läuft jetzt selbst durch; ✋ besser Phasen an die passenden Sätze setzen |
| Ernstfall in derselben Folge, die ihn erklärt (v5.27) | Gefahr passiert direkt nach der Erklärung | ⚙ reiseplan (`ernstfall`, HR28) |
| Gast stellt sich nicht vor, Bekannte stellen sich neu vor (v5.25) | Vorstellungssätze | ✋ HR26 |
| Wetter aus der App statt aus der Geschichte (v5.54) | Szene ohne Wetterwort | ✋ Wetter in `HOERREISE` und im Szenentext |
| Story-Logbuch nicht fortgeschrieben | Folge fehlt dort | ⚙ podcast-pruefen bricht ab |

## Teil B: Player und Bühne (`kurs.js`, CSS)
| Fehler (Version) | Ursache | Prüfen |
|---|---|---|
| Bühne rutscht beim Sprechen (v5.54) | Mitlesetext schob das Layout | ⚙ buehne-pruefen (Sprung) |
| Gesicht wippt beim Sprechen (v5.55) | Animation `talkbob` aus index.html wirkte auch im Player | ⚙ buehne-pruefen; ✋ bei neuen CSS-Regeln für `.talking` nach Bewegung suchen |
| Gesichter stehen still, das Boot schaukelt darunter, wirkt wie Springen (v5.56) | nur der Hintergrund schaukelte | ✋ alles, was zum Boot gehört, schaukelt mit (`.kbord`) |
| Sprecher springt nach oben, aber erst, nachdem in der Folge eine Animation lief (v5.58, Pixel) | `anim.js` setzt global `.an{height:100%}`, der Sprecher hieß auch `.an` | ⚙ buehne-pruefen lädt vorher eine Animation; ✋ keine kurzen, allgemeinen Klassennamen (`an`, `ok`, `t`), Regeln aus nachgeladenen Dateien immer auf ihr eigenes Element beschränken (`svg.an`) |
| Test grün, Handy zeigt den Fehler (v5.56 → v5.58) | Test stieg mitten in der Folge ein, ohne den Zustand davor (geladene Animation) | ✋ Tests so starten, wie der Nutzer hört: Abschnitte davor oder ihre Nebenwirkungen mitnehmen |
| Lange Frage oben abgeschnitten (v5.56) | `justify-content: center` in einem Flex-Kasten, der überläuft | ⚙ buehne-pruefen; ✋ immer `safe center` |
| `position: fixed` landet falsch (v5.56) | ein Vorfahr hat `transform` | ✋ bei fixed-Elementen alle Vorfahren ohne transform halten (mitbild: `.kbord` ohne Animation) |
| Alter Gast blieb nach Ortswechsel stehen (v5.55) | `dataset.gast` nicht zurückgesetzt | ✋ beim Szenenwechsel alle Zustände der Bühne zurücksetzen |
| Hinnerk qualmte ständig (v5.53) | Keyframes setzen `opacity` wieder hoch | ✋ „aus“ mit `animation: none` erzwingen |
| Telefon stumm mit Gratis-Stimme (v5.55) | Geräusch nicht erzeugt | ✋ jedes erzeugte Geräusch braucht einen Ersatz ohne Credits |
| Antworten erst nach dem Vorlesen bedienbar (v5.48, v5.53, v5.56) | Zuruf und Knöpfe an das Ende der Stimme gebunden | ⚙ buehne-pruefen prüft die Harms-Frage; ✋ Zuruf ab sichtbarer Frage |
| Mikrofon während der Stimme verschlechtert den Ton (v5.55) | Android schaltet beim offenen Mikrofon auf Sprechqualität | ✋ Schalter `zurufFrueh` lassen, Hinweis bleibt |
| Lautsprecher-„Alfa“ zählte als Antwort (v5.54) | Erkennung hört die eigene Stimme | ✋ während die Stimme läuft, nur kurze fertige Zurufe (szene.js) |
| Harms-Fragen im Auto-Modus nur Denkpause (v5.56) | `interaktiv` steuerte alle Wahlen | ⚙ buehne-pruefen (Harms-Frage) |
| Smoke-Test suchte entfernten Knopf (v5.55) | ID umbenannt | ✋ bei entfernten IDs `tests/smoke/rauchtest.js` durchsuchen |
| Reinreden ging nicht, sobald die Frage dastand (v5.56–v5.58) | Das Mikrofon hört die Stimme mit; der Filter ließ während des Vorlesens nur ganz kurze, fertige Zurufe durch, im Gemisch aus Lautsprecher und eigener Stimme kam das fast nie vor | ⚙ `node tests/zuruf-pruefen.js` (im pre-commit bei `szene.js`); seit v5.61 endgültig gelöst: ausgelöst nur mit A–D, die Stimme liest mit Funkwörtern (HR49); ✋ am Handy prüfen, was „🎙️ gehört: …“ anzeigt |
| Sprecher während einer Animation unsichtbar (v5.58 → v5.59) | Klasse `an` in `ksp` umbenannt, die Regel `.kpl:not(.an)` übersehen | ⚙ buehne-pruefen prüft das Gesicht in der Animation; ✋ bei jeder Umbenennung alle Dateien durchsuchen, auch CSS in Zeichenketten |
| Figuren im SVG um eine halbe Bühne verschoben (v5.59 beim Bau) | CSS für die HTML-Gesichter (`.kpl{transform:translate(-50%,-50%)}`) traf auch das SVG-Element gleicher Klasse | ✋ SVG-Teile nie mit einer Klasse versehen, die für HTML gestylt ist, ohne `g.kpl{transform:none}` |
| `charSVG` fing mit `class="ch "` an (Leerzeichen), Ersetzen griff nicht (v5.59 beim Bau) | Text-Ersetzen auf festen Wortlaut | ✋ Markup mit regulären Ausdrücken anpassen, Ergebnis im Bild prüfen |
| Tisch, Bullaugen und Knotenbrett der neuen Kajüte unsichtbar (v5.62 beim Bau) | Die Klasse `.hs` gab es in index.html schon (Hinweis-Schild, `position:absolute`, `transform`); sie traf die SVG-Gruppen | ⚙ Rauchtest prüft `[data-spot]` in der Kajüte; ✋ neue Klassen vorher mit `grep` in index.html suchen (jetzt `.szh`) |
| Wasser hinter dem Boot fast unsichtbar, Wellen „blass“ (Leitfaden Fassung 4.1) | Die vorderste Welle war bis zum unteren Rand gefüllt und deckte alle Reihen dahinter ab | ✋ vordere Wellen nur als schmaler Streifen oder nach unten auslaufend (`auslauf` in `szenerie.js`), im Bild prüfen |
| Wellen ruckelten, Regen fiel nicht (Leitfaden) | Muster wanderte nicht genau um seine eigene Länge; Regen sprang nur hin und her | ✋ Wiederholung genau P und Weg genau P; Regen als doppeltes Muster, das genau eine Bildhöhe rutscht |
| Telefon in der neuen Kajüte „ging nicht“ (v5.62) | Harms kommt erst nach etwa sechs Sekunden Tuten; die Wackel-Anzeige suchte das alte Telefon `.scene.cabin .phone` | ✋ jede Aktion braucht sofort eine sichtbare Rückmeldung; Selektoren beim Umbau mit umstellen |
| Neue Version kam am Handy nicht an | `__ver`/`VERSION` nicht erhöht | ✋ R4, beide gleich |

## Teil C: Animationen
| Fehler (Version) | Ursache | Prüfen |
|---|---|---|
| Lappen schaukelte nicht mit dem Boot (v5.56) | Teile absolut gezeichnet, das Boot bewegt | ✋ alles, was am Boot hängt, aus der Bootslage berechnen; Kontaktabzug |
| Propeller drehte nicht um die eigene Achse (v5.08) | `transform-box` falsch | ✋ Drehpunkte in SVG mit `view-box` und Koordinaten setzen |
| Anzeige-Text zu breit nach Vergrößerung (v5.56 Zapfsäule) | `schriftGross` vergrößert Texte | ✋ Kontaktabzug bei 320 px Breite |
| Horn und Vorlesen stumm (v5.12, v5.33) | `window.VOX` leer (const), Ton vor der ersten Berührung gesperrt | ✋ Ton erst nach Tippen freigeben, Objekte nicht über `window.` suchen |
| Nicht in jeder Grafik dasselbe Boot (Nutzer 10.11.2026) | `boot.js` hat nur „von oben“ und „von der Seite“; Ansichten von hinten, im Schnitt und nah habe ich je Animation selbst gezeichnet; ältere Seitenansichten benutzen noch den allgemeinen Rumpf `B.seite` aus `anim2.js`; kein Werkzeug prüft es | ✋ jede neue Animation nimmt das Boot aus `boot.js`; fehlt eine Ansicht, kommt sie dort dazu, nicht in die Animation (Vorschlag: Werkzeug, das eigene Boote meldet) |
| Windpfeile verkehrt (v5.43), Verkehrstrennungsgebiet wie Linksverkehr (v5.45), Achterspring und Vorspring falsch (v5.38, v5.46), Gegenpeilung statt Peilung (v5.42) | Richtung nicht gegen die Regel geprüft | ✋ jede Richtung, Seite und Leine im Kontaktabzug gegen die amtliche Antwort prüfen |

## Teil D: 3D-Welt
| Fehler (Version) | Ursache | Prüfen |
|---|---|---|
| Wasser im Boot (v5.15, v5.16) | Deck von oben unsichtbar (Rückseite), Wellen ohne Verdrängung | ✋ Boot von oben und im Sturm ansehen |
| Autopilot an den Steinen und quer über Tonnenlinien (v5.14, v5.17) | Wegplaner ohne Hindernisse und Tore | ⚙ `tests/welt-folgen.js` |
| Beendete Folge lief weiter (v5.14) | alter Lauf nicht gestoppt | ✋ Laufnummer prüfen |

## Teil E: Arbeitsweise
- Vor dem Commit `node --check` auf jede geänderte JS-Datei; nach mehrzeiligem Ersetzen die Stelle ansehen.
- Shell-Befehle mit Platzhaltern wie `h*.png` werden manchmal geblockt: Dateien lieber mit dem Werkzeug schreiben.
- Was der Nutzer meldet und ich nicht nachstellen kann: messen (Position, Zeit), mehrere Ursachen ausschließen, dann die wahrscheinlichste beheben und offen sagen, dass es eine Vermutung ist (v5.56 „Springen“).
- Änderungen an Sätzen machen vertonte Abschnitte ungültig: Kürzungen sammeln und zusammen mit anderen Änderungen machen, dem Nutzer sagen, welche Abschnitte neu fällig sind.
