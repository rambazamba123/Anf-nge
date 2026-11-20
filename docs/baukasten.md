# Baukasten: Boot und Figuren an einer Stelle (v5.72, 20.11.2026)

> Nutzer, 20.11.2026: „Figuren/Boot: austauschbar!!! Sodass das Boot, wenn es z. B. vom Nutzer die Farbe gewechselt bekommt, das überall übernommen wird. Oder das Boot Upgrades bekommen kann, die dann in allen Animationen sichtbar sind. Das muss von der Coding-Architektur passen. Sei ehrlich, ob das funktioniert.“ Dazu: Figuren detailreicher und passend zum Stil (Pettersson, Janosch), Bordkatze rot getigert, „keine Grenzen“; Auswahlmöglichkeiten.

## Die Antwort in einem Satz
Ja, das funktioniert. Es gilt aber nur für alles, was über die zwei Baukästen gezeichnet wird. Heute sind das Film, Deck, Werft und alle Animationen, die schon `boot.js` nutzen. Ältere Stellen ziehen nach und nach um (Liste unten).

## So ist es gebaut
| Was | Datei | Wie es überall wirkt |
|---|---|---|
| Boot (Frieda) | `boot.js` (`window.BOOT`) | Vier Ansichten: `seite`, `heck`, `oben` (auch mit Höhenschichten für den Film), `d34`. Farben als CSS-Variablen `--frieda-rumpf`, `-streifen`, `-unterwasser`, `-dach`, `-schrift` usw. |
| Ausbau | `boot.js` `UPS` | Jedes Teil ist in jeder Ansicht gezeichnet und steckt in `<g class="up up-NAME">`. Sichtbar wird es durch `<html data-up="steuerrad laternen …">`. Teile, die wegfallen (Pinne bei Steuerrad), stecken in `ohne-NAME`. Bühnen können für eigene Dinge `nur-NAME`/`nicht-NAME` nutzen (Hinnerk am Rad statt an der Pinne). |
| Name am Heck | `S.boat.name` | Wird beim Zeichnen eingesetzt (`BOOT.name()`), Standard FRIEDA. |
| Figuren | `figuren.js` (`window.FIGUREN`) | Menschen (Hinnerk, Smilla, Hilke, Harms) aus Teilen: Blick `seite`/`vorn`/`ruecken`, Posen `stehen`, `zeigen`, `winken`, `pinne`, `steuern`, `sitzen`, `hueften`, `block`, Launen. Backbord (rot getigert, Halsband rot und grün) mit `sitzen`, `laufen`, `strecken`, `liegen`, `putzen`, `springen`. Klabauter `sitzen`, `fliegen`. |
| Figurenfarben | CSS-Variablen `--hinnerk-jacke`, `--smilla-haar`, `--backbord-fell` … | Wirken sofort auf jede gezeichnete Figur. |
| Kleidung | `S.cfg.look.kleid` | Hut, Jacke, Haare, Fell; wirkt beim nächsten Zeichnen (Werft zeichnet ihre Vorschau neu, Bühnen beim nächsten Bühnenbild). |
| Zeichenstil | `<html data-stil>` = `feder` (Standard), `kreide`, `aquarell` | Strich, Krakel-Filter und Schraffur per CSS, sofort überall. Vorschauen können einen festen Stil haben (`o.stil`). |
| Speicher | `S.cfg.look = {stil, farben, up, kleid}` | Alles optional, ohne Feld gilt der Standard (R7). `lookAnwenden()` in `index.html` setzt alles beim Start auf `<html>`. |
| Auswahl | `werft.js` (`WERFT.oeffnen`) | Einstellungen → „⚓ Werft öffnen“ und der ⚓-Knopf an Deck. Seit v5.73 als Drehrad (siehe unten). |

**Regel für neue Zeichnungen:** Wer die Frieda oder eine Figur zeigt, holt sie aus `BOOT` bzw. `FIGUREN` und zeichnet sie nie selbst. Farben nie fest in die Zeichnung schreiben (außer bei fremden Booten über `o.farbe`). Schatten und Licht als halbdurchsichtige Schicht (`bsch`, `sch`) darüber, dann passen sie zu jeder Farbe.

## Plätze am Boot (v5.73)
> Nutzer, 20.11.2026: „Beim Standardboot Slots für spätere Upgrades wie Bordkanone … feste Plätze, die sich bestücken lassen. Die Plätze sind jetzt noch unsichtbar, aber schon eingebaut und nutzbar. So vermeiden wir, dass sich Animationen und Zusätze im Weg sind.“

| Platz | Seite | Heck | Oben | Schräg | Teile heute |
|---|---|---|---|---|---|
| `bug` Vorschiff | ✓ | – (verdeckt) | ✓ | ✓ | Anker, Bordkanone, Schiffsglocke |
| `dach` Kajütdach | ✓ | ✓ | ✓ | ✓ | Radar, Suchscheinwerfer, Kajak, Solarpaneel |
| `mast` Mast | ✓ | ✓ | ✓ | ✓ | Skipperwimpel, Funkantenne |
| `ueber` Über dem Cockpit | ✓ | ✓ | ✓ | ✓ | Sonnendach |
| `steuer` Steuerstand | ✓ | ✓ | ✓ | ✓ | Steuerrad (sonst Pinne) |
| `heck` Heckkorb | ✓ | ✓ | ✓ | ✓ | Heckflagge, Angelrute, Heckgrill |
| `spiegel` Spiegel | ✓ | ✓ | ✓ | ✓ | Badeleiter |
| `bordwand` Bordwand | ✓ | ✓ | ✓ | ✓ | Rettungsring, bunte Fender |

- Jeder Platz hat je Ansicht eine feste Stelle `[x, y]` und einen **Freiraum** (Kreis mit Radius `r`), den nur er belegt; in der Draufsicht dazu eine Höhe `hs` für die Höhenschichten.
- Ein Platz nimmt **höchstens ein Teil** auf (die Werft tauscht beim Wechsel). Teile liegen in `BOOT.TEILE` mit Zeichnung je Ansicht in Koordinaten um den Platz; fehlt die Schrägansicht, nimmt sie die Seitenansicht gespiegelt.
- **Neues Teil einbauen:** in `TEILE` eintragen (`platz`, `name`, `wann`, Zeichnungen `seite`, `heck`, `oben`), fertig. Werft, Film, Deck und Animationen zeigen es von selbst.
- **Neuer Platz:** in `PLAETZE` eintragen; `node tools/plaetze-pruefen.js` (läuft vor jedem Commit, wenn `boot.js` geändert ist) meldet Überschneidungen mit anderen Plätzen und mit den Crew-Stellen `BOOT.PLATZ`. Gewollte Überschneidungen stehen in `BOOT.ERLAUBT` (Steuermann am Steuerstand; von achtern verdeckt das Sonnendach Dach und Mast).
- **Für Animationen:** `BOOT.platz(blick, name)` gibt Stelle und Freiraum, `BOOT.belegt(name)` das eingebaute Teil. Wer etwas ans Boot hängt (Leine, Fender, Rauch, Wasserstrahl), nimmt einen Platz statt eigener Zahlen.
- Unsichtbar sind die Plätze immer; `<html data-plaetze>` zeigt alle (Werft: Knopf ◎), `<html data-platz-hl="bug">` nur einen (Werft beim Thema des Platzes).
- Laternen sind kein Platz: Sie sitzen an den gesetzlichen Stellen (Seitenlichter, Topplicht, Hecklicht) und heißen `AUSSTATTUNG`.

## Glas der Filmbühne (v5.73)
Eine Glasart besteht aus fünf Stellschrauben: Unschärfe nach Tiefe, Dunst in der Ferne, Kante jeder Platte (Filter je Ebene), Oberfläche (Papierflecken, Korn) und Farbton (Überzug); dazu Schatten der Platten. `film.js` `GLAS`, gewählt über `<html data-glas>` (`S.cfg.look.glas`, Standard `weich`, E27).
| Glas | Gedanke | Technik |
|---|---|---|
| Weich | Glasebenen wie bisher | Tiefenschärfe, Dunst, feines Korn |
| Klar | scharf und kräftig | wenig Unschärfe und Dunst, warmer Hauch |
| Aquarell | Lavur wie bei Nordqvist | Pigmentrand an jeder Platte (Erosion des Umrisses), leichtes Verlaufen, Papierflecken |
| Feder | Feder und Tusche | Tuschekontur um jede Platte (Dilatation mit Zittern), sepia |
| Buntstift | krakelig wie Janosch | Krakel-Verschiebung, Strichkorn quer, kräftigere Farben |
| Papiertheater | ausgeschnittene Kulissen | jede Platte wirft Schatten auf die dahinter |
Die Kanten-Filter wirken nur auf mittlere und vordere Platten (Rechenzeit). Auf älteren Handys bei Ruckeln „Weich“ oder „Klar“ nehmen.

## Werft mit Drehrad (v5.73)
> Nutzer, 20.11.2026: „das Bild im Auge behalten und ohne viel Scrollen die Einstellungen machen … mit einem Rad zum Drehen … mit Knopf zum Übernehmen“.
- Vollbild: oben die echte Filmbühne (Seite, Heck, Oben) oder die Crew; darunter die Zeile „Thema · Wahl“ mit ‹ ›; unten ein Steuerrad.
- Außen am Rad 24 Themen: Farbsatz, Rumpf, Streifen, Unterwasser, Kajütdach, Name, die acht Plätze, Laternen, sieben Kleidungsstücke, Zeichenstil, Glas. Innen die Wahl als Perlen (Farben als Farbtupfer, Teile als kleine Zeichnung).
- Drehen mit dem Finger (rastet ein, kurzes Ruckeln am Handy), Antippen oder Pfeile. Die Bühne springt zum passenden Blick und markiert den Platz.
- Alles wirkt sofort als Vorschau; „Übernehmen (n)“ speichert, „Verwerfen“ stellt zurück, ✕ fragt bei Änderungen nach.
- Farben aus einer festen Palette, die zum Stil passt (keine freie Farbwahl mehr): So bleibt jedes Boot im Bilderbuch-Stil.

## Was schon umgezogen ist (v5.72)
- Filmbühne (`film.js`): Frieda in allen Blicken, Hinnerk, Smilla, Hilke, Katze, Harms im Medaillon.
- Deck (`szenerie.js` `szene`): Frieda und Crew an Bord, antippbar wie bisher.
- Animationen in `anim-hoch.js` (rund 50 Stellen) und die Bühnen in `kurs.js` holen das Boot schon aus `boot.js`: Farbe und Ausbau sind dort sofort mit dabei.

## Was noch nicht umgezogen ist (ehrlich)
- **Gesichter in Menüs, Karten und Kajüte** (`ART` und `charSVG` in `index.html`, Kajüte in `szenerie.js`, Bühne B in `kurs.js`): noch die alten Köpfe. Nächster Schritt: `ART` holt sich Kopf und Schultern aus `FIGUREN` (Blick `vorn`), dann ziehen alle Menüs auf einmal mit.
- **Ältere Animationen** in `anim.js`, `anim2.js` bis `anim4.js` zeichnen eigene Boote und Figuren. Sie ziehen um, wenn sie ohnehin überarbeitet werden.
- **3D an Deck** (`welt.js`): Die Farbe lässt sich leicht übernehmen. Für den Ausbau braucht jedes Teil ein eigenes 3D-Modell, das ist eigene Arbeit.
- **Kleidung live:** Farben, Stil und Ausbau wirken sofort. Neue Kleidung erscheint erst beim nächsten Zeichnen einer Szene.
- **Ölzeug, Ringelpulli, Joppe** haben feste Farben; der Farbregler „Jacke“ wirkt nur bei den anderen Jacken.

## Offen (Entscheidung des Nutzers)
- Ausbau als Belohnung (SK12: Steuerrad nach Tag 3, Laternen nach Tag 5, Wimpel nach Tag 7) oder immer frei? Heute ist alles frei zum Ausprobieren.
- Welcher Zeichenstil ist der Standard (Feder, Kreide, Aquarell)?
- Welches Glas ist der Standard (heute Weich)? Welche Teile sollen später dazukommen, und welche als Belohnung?
- Eigene Farben: früher frei wählbar, seit v5.73 nur noch aus der Palette. Zurück zur freien Wahl?
