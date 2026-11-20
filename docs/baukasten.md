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
| Auswahl | `werft.js` (`WERFT.oeffnen`) | Einstellungen → „⚓ Werft öffnen“ und der ⚓-Knopf an Deck. Reiter Boot (Farben, eigene Farben, Name, Ausbau), Crew (Kleidung, Farben), Stil. |

**Regel für neue Zeichnungen:** Wer die Frieda oder eine Figur zeigt, holt sie aus `BOOT` bzw. `FIGUREN` und zeichnet sie nie selbst. Farben nie fest in die Zeichnung schreiben (außer bei fremden Booten über `o.farbe`). Schatten und Licht als halbdurchsichtige Schicht (`bsch`, `sch`) darüber, dann passen sie zu jeder Farbe.

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
