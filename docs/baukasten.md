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
- **📋 Kopieren** (oben rechts): legt alle Einstellungen als Text in die Zwischenablage (lesbare Zeilen plus Rohdaten als JSON), auch mit noch nicht übernommenen Änderungen. Zum Einfügen in den Chat, damit Claude sieht, was eingestellt ist. Ohne Zwischenablage zeigt die Werft den Text zum Markieren. Die Einstellungen liegen nur auf dem Gerät; Claude sieht sie nur so.
- Farben aus einer festen Palette, die zum Stil passt (keine freie Farbwahl mehr): So bleibt jedes Boot im Bilderbuch-Stil.

## Korrekturen, Mäuse, Fabelwesen, Menü-Stile (v5.79)
> Nutzer, 23.11.2026: Gangarten wie voreingestellt; Polizistin bekommt einen Kollegen (schwarze Hautfarbe) und mehr Rundungen; Hafenmeister zu ähnlich gefärbt; Quirin freundlicher; Backbord flackert beim Hüpfen; Aufsicht von Smilla, Quirin, Hafenmeister zu dick; Klabauter mit Flügelschlag; mehr Gangarten für Backbord; Mäusefamilie; süße Fantasietiere; Menü wie das alte, alte Symbole, Deck und Kajüte wie heute, Heranfahren bleibt stehen und zeigt Einzelheiten, mehrere Stile.
- **Gang je Figur:** `FIG[].gangStd` (Hinnerk Seemannsgang, Smilla flott, Harms Marsch …).
- **Polizist** (`polizist`) als Kollege; **Polizistin** mit `rund: 1` (Taille, Hüfte, Brust dezent; jugendfrei, App ab 12).
- **Hafenmeister:** grüne Jacke und gelbe Warnweste; **Quirin:** senffarbener Fleece, hellblaue Mütze.
- **Aufsicht schmaler** (`menschOben`: Schulterbreite ohne vollen Körperbau-Faktor).
- **Klabauter** im Flug mit `o.schlag` (Flügelschlag). **Backbord:** echte Beinbewegung im Gang (`KATZE_GANG`: Schleichen, Traben, Rennen, Stolzieren, Springen, Tapsen); das Flackern kam von Posenwechseln.
- **Mäusefamilie** (`tier: 'maus'`: mausvater, mausmutter, mauskind, mausbaby; Posen sitzen, laufen, schnuppern, putzen, springen; Mütze, Kopftuch, Schal, Schleife).
- **Fabelwesen** (`tier: 'fabel'`, eigene Erfindungen nach Sagen der Nordsee): Muschelwicht (krabbelt mit Schneckenhaus, rote Zipfelmütze wie ein Nis Puk), Nebelpuschel (wabert), Tangschrat (schlurft), Leuchtfloh (flattert und leuchtet).
- **Kajüte der Glasbühne** neu angeordnet wie die Kajüte der App (Bullaugen mit karierten Gardinen, Wimpel, Knotenbrett in der Mitte, Lampe über dem runden Tisch, Hinnerk und Smilla auf der Bank, Hocker auf dem Teppich). Kameraziele `EINST.innen`: knoten, karte, telefon, manoever, buch, hocker, klabauter, crew, katze.
- **Licht „Blaue Stunde“** (`LICHT.blau`) für den Skagen-Stil.
- **Entwurfsseite** `docs/entwuerfe/menue-stile.html`: fünf Stile (Standard Glasbühne, Skagen-Abend, Larsson-Stube, Hammershøi-Stille, Bilderbuch), Deck wie heute (Boot, „Heute auf dem Zettel“ neben „Weiter mit der Crew“, Schiffsrennen, alte Leiste), Kajüte mit alten Symbolen; Antippen fährt heran, das Bild bleibt, Einzelheiten erscheinen darauf, „‹ Kajüte“ fährt zurück.

## Feder laviert als Standard, alle Figuren, Gangarten, Kajüte als Glasbühne (v5.78)
> Nutzer, 22.11.2026: Favoriten alle „Feder laviert“, Körperbau Hinnerk/Smilla/Hilke/Klabauter kräftig, Harms schlaksig, Backbord klassisch; „Smilla etwas sexier, und wir brauchen alle anderen Charaktere … Boot von achtern und von hinten zu unterschiedlich … alle Menüpunkte und die Kajüte zum Durchklicken … Figuren animiert, verschiedene Geh-Stile“.
- **Standard:** Zeichenstil `laviert` (index.html `lookAnwenden`, Werft), Körperbau je Figur `FIG[].typStd` (greift, solange der Nutzer nichts anderes gewählt hat; Werft „Körperbau: alle“ hat „Standard je Figur“). `LOOK_STIL` kennt jetzt alle 13 Stile (vorher nur drei: andere fielen still auf Feder zurück).
- **Neue Figuren** (alle Blicke inkl. oben, Standard kräftig): Quirin, Jasper, Hafenmeister Klüverhafen, Wasserschutzpolizistin, Schleusenwärter Klappdörp, Rangerin, Seenotretter, Mats (Verkehrszentrale). Gebaut aus allgemeinen Teilen: `frisur` (kurz, scheitel, locken, pferd), Hüte über `hutGen` (schiffer, cap, polizei, helm, ranger, sonnenbrille, headset), Bart `schnauz`, Jacken über `FIG[].jacke` (fleece, segel, hemd, overall, ranger, arbeit, uniform), Westen `warn`/`rettung`.
- **Smilla:** etwas schmalere Taille, Wimpern, Lippen, lose Strähne; jugendfrei (App ab 12, §3).
- **Gangarten** (`FIGUREN.GANG`, `figur(id, {blick: 'seite', gang: {art, t}})`): Normal, Seemannsgang, Flott, Schlendern, Stapfen, Marsch, Hüpfen, Schleichen; Beine mit Knie, Armschwung, Vorlage, Boden wird gehalten. Tiere auf der Seite `figuren-gang.html` mit Posen und Wippen.
- **Heck einheitlich:** `BOOT.heck({unterWasser, ohneSchraube})` zeichnet den Rumpf unter Wasser, Kiel, Schaft und Schraube passend weiter; Filmbühne nutzt dieselbe Zeichnung für „von achtern“, „Motor von achtern“ und „Schnitt an der Wasserlinie“ (keine eigene Ellipse und kein eigener Schaft mehr).
- **Kajüte als Glasbühne** (`film.js` `ORTE.kajuete.innen`, `EINST.innen`: totale, karte, manoever, knoten, regal, klabauter, tisch, telefon, hocker, katze).
- **Entwurfsseiten:** `app-laviert.html` (alle Menüs zum Durchklicken), `figuren-gang.html` (Gangarten wählen), `figuren-winkel.html` (jetzt mit allen 14 Figuren), `glasbuehne.html` (zwei Kajüten-Varianten dazu).

## Feder und Aquarell weiter, vier Winkel, Licht der Glasbühne (v5.77)
> Nutzer, 22.11.2026: „Die neuen Stile sucks. Figuren: alter Feder/Aquarell-Stil ist gut, diese weiterentwickeln, aus verschiedenen Winkeln (Seite, hinten, vorn, oben) … die Glasplatten sind super, Vollbild, mehrere Varianten durchklicken, besser ausarbeiten.“
- **Verworfen (E31):** die neun Stilrichtungen aus v5.76 (Öl, Nebel, Schattentheater, Laterna, Bleiglas, Cyanotypie, Delft, Riso, Gravur) und die Macharten (Papier, Knete, Filz, Strick, Schatten). Code und Entwurfsseite sind entfernt; alte Spielstände mit diesen Werten fallen still auf Weich bzw. gezeichnet zurück.
- **Figuren:** vier neue Spielarten von Feder und Aquarell in `STILE`: Feder fein, Feder laviert (Sepia mit Lavur, Filter `cr-lavur`), Aquarell nass (`cr-nass`), Aquarell mit Bleistift. **Blick von oben** (`figur(id, {blick: 'oben'})`: `menschOben`, `katzeOben`, `papageiOben`), passend zur Aufsicht aufs Boot. Entwurfsseite `docs/entwuerfe/figuren-winkel.html` (alle Figuren Seite, hinten, vorn, oben; sechs Stile im Vergleich).
- **Licht der Glasbühne** (`film.js` `LICHT`, `FILMB.licht(name)` vor `mount`): Später Vormittag, Morgendunst, Abendgold, Nacht im Hafen, Nebelbank, Regen. Jedes Licht = Farben (überschreibt `P`), Filter über die Welt und **Atmosphäre vor den Platten** (`FILMB.atmo([...])`): Lichtbahnen, Bokeh-Staub, Spiegelung auf der vordersten Scheibe, Sterne, warme Fenster, ziehende Nebelbänke, Regen, Tropfen auf der Scheibe.
- **Werft:** Rad einfach = Glasplatten-Stil (6), Licht (Vorschau), Zeichenstil, Körperbau, Augen, Mehr. Beim Schließen der Werft fällt das Licht wieder auf Vormittag; in der Hörreise soll später die Szene das Licht bestimmen (Marke `[[LICHT: …]]`, noch nicht gebaut).
- **Vollbild-Seite** `docs/entwuerfe/glasbuehne.html`: zwölf Varianten der echten Filmbühne mit Licht, Atmosphäre und Kamerafahrt (Wischen oder ‹ ›, Tippen blendet die Bedienung aus, ⤢ füllt den Schirm, ♥ und Liste mit „Auswahl kopieren“).

## Körperbau, Augen, neun Stile, Freischaltung (v5.75)
> Nutzer, 21.11.2026: „mehrere Varianten, süßer etc.“, „einmal Aquarell und einmal mit Strich außenrum“, „Standard-Schiff ohne den Schnickschnack, Extras kommen mit der Zeit dazu“.
- **Körperbau** (`FIGUREN.TYPEN`): Klassisch, Süß, Püppchen, Kugelrund, Schlaksig, Kräftig (Kopfgröße, Körperbreite und -höhe, Wangen, Standard-Augen). Gilt für alle Figuren (`S.cfg.look.typAlle`) oder je Figur (`typ[figur]`); Katze und Papagei skalieren Kopf und Augen mit.
- **Augen** (`AUGEN`): Punkt, Glanzlicht, Groß und glänzend, Kulleraugen, Zufriedener Strich; `S.cfg.look.auge` überschreibt die Art des Körperbaus.
- **Neun Zeichenstile** (`STILE`): Feder und Kreide (Strich außenrum), Aquarell und Pastell (ohne Strich), Flach, Linolschnitt, Tusche, Bleistift, Scherenschnitt. Boot (`boot.js`) zieht mit.
- **Werft:** neue Themen „Körperbau: alle“, „Körperbau: je Figur“ (sechs), „Augen“ und „Testmodus“; Köpfe als Perlen im Rad.
- **Freischaltung:** jedes Teil in `BOOT.TEILE` hat `tag` (Tag der Hörreise, ab dem es frei ist) und `wann` („nach Tag N“); Laternen Tag 5. Frei ist, was `erreichterTag()` (höchster gehörter Tag in `S.hoerreise.gehoert`) erreicht. Gesperrtes zeigt 🔒 und sagt, wann es kommt. **Testmodus** (`S.cfg.look.test`, Standard **an**) macht alles frei, bis der Nutzer die Tage festlegt; das Standardschiff hat ohne Extras zu starten.
- **Entwurfsseiten zum Auswählen:** `docs/entwuerfe/figuren-atelier.html` (alle Körperbauten × alle Stile, Aquarell gegen Strich, Augen, Kleidung, ganze Crew, ♥ und „Auswahl kopieren“) und `docs/entwuerfe/menues-glas.html` (Deck A1–A3, Kajüte B1/B2, Frei üben, Frage, Hörreise-Karte im Glasplatten-Stil, mit Glasart und Tageszeit). Beide laden die echten Skripte (`figuren.js`, `boot.js`, `szenerie.js`).

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
- Welches Teil kommt nach welchem Tag? Heute stehen Vorschläge in `TEILE[].tag`, der Testmodus macht alles frei, bis der Nutzer entschieden hat.
- Welcher Zeichenstil ist der Standard (Feder, Kreide, Aquarell)?
- Welches Glas ist der Standard (heute Weich)? Welche Teile sollen später dazukommen, und welche als Belohnung?
- Eigene Farben: früher frei wählbar, seit v5.73 nur noch aus der Palette. Zurück zur freien Wahl?
