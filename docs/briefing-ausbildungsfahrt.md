# Briefing für eine andere KI: Die Ausbildungsfahrt in „Skipper“ (Stand 04.11.2026, v5.21)

> **Wozu dieser Text:** Du sollst dir das Projekt von außen ansehen und Vorschläge machen, damit es richtig gut wird. Hier steht, was das Ziel ist, wer mitspielt, was es heute schon gibt (3D, Kajüte, Karte …), wie es im Code gebaut ist und wo es noch hakt. Am Ende stehen Fragen, auf die wir Antworten suchen.
> **Wichtig:** Alles hier beschreibt den **Ist-Stand**. Vieles ist Rohbau (Platzhalter-Grafik, Gratis-Handystimme, Sätze im Entwurf). Bitte unterscheide in deinen Vorschlägen zwischen „Richtung/Konzept ändern“ und „Rohbau fertig machen“.
> Repo: `rambazamba123/Anf-nge`, läuft als Web-App auf GitHub Pages. Hauptgerät: Android-Handy mit Chrome im Hochformat (getestet in 400 × 860).

---

## 1. Das Ziel in einem Absatz
„Skipper“ ist eine kostenlose Lern-App für den **Sportbootführerschein See (SBF See)**, später auch Binnen und SKS. Statt Fragen stur zu pauken, heuert man als Neuling auf dem kleinen Motorboot **„Frieda“** an und macht eine **Ausbildungsfahrt** („Vom Landei zum Skipper“). Eine Crew aus drei Figuren bildet einen aus. Etwa **53 Tage** mit je rund **30 Minuten** (in 2–3 Teilen), Hafen zu Hafen, Tonne zu Tonne. Man **hört** zuerst, wie etwas geht, **handelt** dann selbst (steuern, ausweichen, anlegen, Knoten binden), bekommt sofort **Rückmeldung**, und abends kommen die **amtlichen Prüfungsfragen** zum Erlebten. Am Ende sitzen alle **285 amtlichen Fragen** des SBF See, die Navigationsaufgaben und die Praxis. Die App ist gratis; verkauft werden soll später ein **Starter-Set** (zwei kleine Übungsseile, ein kleines 3D-gedrucktes Boot mit Klampe und Ring, Kursdreieck, Zirkel), mit dem man nebenher echt übt.

### Der Rahmen der Geschichte
- **Smilla**, die Matrosin, hat ihren Traumjob auf einem großen Traditionssegler bekommen. Sie hört **eine Woche vor deinem Prüfungstermin** auf. Die Crew braucht also jemanden, der das Boot führen darf: dich.
- Ein **Countdown** zählt die Tage bis zu Smillas letztem Tag. Wer schneller lernt, ist früher durch und paukt danach trocken. Das ist gewollt.
- Am ersten Tag hilfst du zu früh mit der Vorleine, das Boot treibt quer und rumpelt ans Arbeitsboot der Hafenmeisterin. Hinnerk: „Regel eins: Du fasst nix an, was ich nicht freigegeben hab.“ Daraus entsteht das System **„Was ich an Bord darf“** (Freigaben).

### Feste Grundsätze (vom Nutzer entschieden)
1. **Keine Live-KI im Spiel.** Alles, was die Crew sagt, ist vorgeschrieben und wird einmal mit ElevenLabs eingesprochen. Alle Nutzer hören dieselben MP3-Dateien, das kostet bei 50 oder 5000 Nutzern gleich viel. Bis dahin spricht die kostenlose Handystimme.
2. **Kein Zeitdruck.** Nirgends entscheidet eine Uhr für dich (Ausnahme: Probeprüfung mit amtlicher Zeit).
3. **Gespräch statt Formular.** Die Crew fragt, du antwortest mit 2–4 Knöpfen, die sich in der Haltung unterscheiden (frech, ehrlich, unsicher). Jede Antwort hat ihre eigene Reaktion.
4. **Scheinwahlen** (etwa zwei je Folge): „Links rum oder rechts rum?“ Der Weg steht fest. Wählst du den anderen, findet die Crew einen glaubwürdigen Vorwand, der selbst etwas lehrt („Da liegt heut 'n Bagger“).
5. **Ehrliche Wahlen** mit echten Folgen gibt es daneben (Freigaben, Sicherheit).
6. **Hinnerks Bauchregeln** (falsche Faustregeln) bleiben **nie stehen**. Sie werden aufgelöst: Smilla widerspricht, ein kleiner harmloser Unfall zeigt den Fehler, oder du entscheidest selbst. Hinnerk irrt nie bei echter Sicherheit.
7. **Aufgaben werden klar erklärt.** Bevor du handeln musst, sagt die Crew ausdrücklich, was das ist, warum, und was du jetzt tust. Danach wird gesagt, was passiert ist und warum.
8. **Fragen kommen erst nach dem Erklären.** Während der Fahrt wird gehandelt, abends werden die amtlichen Fragen gestellt (2 × 2 Antwortknöpfe).
9. **Fahrten und Manöver in 3D, Gespräche in 2D** (Kajüte). Das 3D-Boot ist die Grundlage aller Aufgaben; feste Ansichten (Seite, Schnitt, Aufsicht) sind erlaubt, es bleibt aber dasselbe Boot.
10. **Hörmodus teilweise:** Erzählen, Erklären und Abendfragen gehen auch nur zum Hören (z. B. im Auto). Handlungen holt man am Handy nach. Freigaben gibt es nur durch eigenes Tun.
11. **Prüfungsinhalte nur aus den amtlichen Katalogen**, fachlich korrekt. Die echte Übungskarte 49 des BSH wird **nie** nachgebaut; wir haben eine eigene, erfundene **Seekarte 7**.
12. **Freigabe ab 12 Jahren**, Ton derb-herzlich, plattdeutsch angehaucht, keine sexuellen Anspielungen.

### Das Lernmodell
- **Vorher gehört, dann erlebt:** Bevor eine Situation kommt, hat die Crew sie schon einmal beschrieben (nicht unbedingt in derselben Folge).
- **Freigaben** „Was ich an Bord darf“: neu → geübt → **freigegeben** (zweimal hintereinander richtig) → eingerostet. Beispiele: Fender und Leinen, Klampe belegen, Motor starten, Ablegen/Anlegen (erst Becken, dann fremder Hafen), Steuern im Fahrwasser, Schleuse, Ankern, Kurs planen, Nacht- und Nebelwache, Mensch über Bord, jeder Knoten einzeln.
- **Überraschungen** nur bei Freigegebenem, höchstens eine je Folge.
- **Lernstand je Frage in Farben** (rot bis dunkelgrün, Serie richtiger Antworten an mehreren Tagen, Selbsteinschätzung „easy/tricky“), Wiederholung der wackligen Fragen morgens.
- **Tagesarten:** ☀️ Fahrtag · ⚓ Übungstag im Hafen · 🌧️ Schietwettertag in der Kajüte · 🌊 Flaute-/Ankertag · 🌙 Sonderfahrt (Nacht, Nebel, Sturm, Notfall) · 📞 Prüftag (Harms ruft an). Jede Folge beginnt mit dem Wetterbericht.
- **Kapitel** (Gesamtplan Fassung 4, `docs/gesamtplan.md`): 0 Anheuern (Kuttershaven) · 1 Das Boot (Hafenbecken) · 2 Auf die Elbe (Tonnen, Großschifffahrt, Klüverhafen) · 3 Nord-Ostsee-Kanal · 4 Ins Watt · 5–6 Wetter, Nacht, Nebel, besondere Gebiete · 7 Not an Bord · 8 Prüfungsreife · letzte Woche. Binnen wird eine eigene Reise. Jede der 285 Fragen ist einem Tag zugeordnet.
- **Optionaler Kenner-Test:** Wer schon gefahren ist, darf Kapitel überspringen (Vorschlag, nicht gebaut).

---

## 2. Die Figuren
| Figur | Wer | Sprechweise | Rolle |
|---|---|---|---|
| **Käpt'n Hinnerk** | 63, 38 Jahre Kapitän der Helgoland-Fähre, sieht nachts schlecht, alte Rivalität mit Harms | höchstens etwa acht Wörter am Stück, Platt („nich“, „dat“, „Schiet“), grüßt mit „Moin“, **lobt nie direkt** („Dor kannst nich meckern“) | Ausbilder für die Hände; führt Buch über deine Freigaben; „Ein Versuch.“; erzählt Garn; irrt mit Bauchregeln |
| **Smilla** | 24, aus Köln, alles selbst beigebracht, ist bei Harms einmal durchgefallen | schnell, fragt zurück, frotzelt, selten kölsch („Jeck“), erklärt gern und wird dabei unterbrochen | Ausbilderin für den Kopf: Abendfragen, das Warum; berichtigt Hinnerk; geht eine Woche vor deiner Prüfung |
| **Klabauter** | Hinnerks Papagei, seit 40 Jahren an Bord | ein bis drei Wörter, doppelt, oft im falschen Moment („Pinne! Pinne!“); Modus „Wichtig“ mit Schiffsglocke: „Krrah! Merken!“; Warnruf „Wahrschau!“ | das Gedächtnis; petzt Fehler, feiert Freigaben, streitet mit Katze und Möwen |
| **Backbord** | Bordkatze, **spricht nicht** | – | macht Unsinn: liegt auf der Seekarte, spielt mit Leinen, sitzt auf dem warmen Motor |
| **Kapitän Harms** | früherer Elblotse, Prüfer (interne ID `kroeger`) | streng, knurrig, heimlich nett | ruft am Kapitelende an (Abnahme), kommt zur großen Probeprüfung; sagt im ganzen Kurs genau einmal „Gut.“ |
| Gast: **Hafenmeisterin** | ihr Arbeitsboot rammst du am ersten Tag | sagt nie „bitte“ | gibt Aufträge (Ruderboot-Mission) |
| Gast: **Jasper** | Segler an einer Boje im Vorhafen | Stimme sucht der Nutzer noch aus | du bringst ihm ein Ersatzteil; später ist er in Not |
| Gast: **Quirin** | Binnen-Profi, sehr bayerisch | „Schuidl kenn i!“ | kommt im Kanal-Kapitel an Bord, Gastgeber der Binnen-Reise |

- **Anreden wachsen mit** (kein Name, geschlechtsneutral): Landratte, Landei, Grünschnabel → Kielschwein, Frischling → … → „Skipper“ (zum ersten Mal an Tag 48).
- **Begrüßung:** oft ein sehr langgezogenes „Mooooooin“, aus gespeicherten Bausteinen zusammengesetzt.
- **Dialog-Regeln** (`docs/dialog-regeln.md`, Entwurf, wartet auf Freigabe): Ein Satz, eine Absicht; Wissen kommt als Antwort auf eine Frage oder einen Fehler, nie als Vortrag; kein Echo der Frage; Unterbrechen erlaubt; Subtext statt ausgesprochener Gefühle; keine Szene endet mit klugem Schlusssatz; Necken in beide Richtungen; Namen-abdecken-Test; laut lesen.

### Kurzes Beispiel aus Folge 7 (so klingt es heute)
```
Klabauter: Moooooooin! Moin!
Hinnerk:   Moin.
Smilla:    Na? Ausgeschlafen, oder hat dich der Klabauter wieder um fünf geweckt?
  [Knöpfe] „Hellwach. Kann losgehen.“ → Smilla: „Hellwach. Hörst du das, Käpt'n?“ – Hinnerk: „Hör ich. Glauben tu ich's um zwölf.“
           „Ehrlich gesagt: nee.“      → Smilla: „Ehrlich. Mag ich.“ – Hinnerk: „Kaffee steht da. Frische Luft macht den Rest.“
           „Was steht denn an?“        → Smilla: „Direkt zur Sache. Käpt'n, erzähl.“
Hinnerk:   Heute geht's raus. Bis zur Ansteuerungstonne.
Smilla:    Moment. Raus raus? Mit Neuzugang an der Pinne?
Klabauter: Pinne! Pinne!
Hinnerk:   Möwen fliegen landeinwärts. Gibt Regen. Immer so.        ← Bauchregel
Smilla:    Ach ja? Und letzte Woche? Da sind die auch landeinwärts geflogen. Wegen der Pommesbude.
  [Knöpfe] „Auf die Möwen“ (falsch, mit Erklärung) / „Aufs Barometer und den Wetterbericht“ (richtig)
  → Gedächtnis merkt sich „moewen_regel“ (die Crew kann später darauf anspielen)
```

---

## 3. Was es heute gibt (genau)

### 3.1 App-Rahmen
- **Start:** kurzer Streit der Crew als Intro, dann Kennenlernen als Gespräch mit Knöpfen (Name optional, Termin, Lernzeit, Lernort, Übungsset, Bootserfahrung), danach „Rundgang 1“ durch die App.
- **Leiste unten:** Deck · Kajüte · Frei üben.
- **Deck:** gezeichnetes Boot (2D, flacher Stil à la Pettersson und Findus), „Kurs für heute“, Stand, versteckte Easter-Eggs.
- **Kajüte (2D):** gezeichnete Szene, alles zum Antippen: Seekarte an der Wand (Navigation), Manöverbrett, Knotenbrett, Bücher/Kartentisch („Meine Prüfungen“), Telefon (Harms prüft), **Hocker** (hier starten die Folgen), Bordkatze läuft herum. Die Szene hängt von Tageszeit und Wetter ab.
- **Frei üben:** alles einzeln: Fragen nach Thema, Probeprüfung, Navigation, Knoten, Manöver, Seezeichen-Kurs, Animationen, Lexikon, Geräusche, 3D-Welt zum freien Fahren, jede 3D-Folge einzeln.
- **Meine Prüfungen:** Kuchen-Diagramme je Theorie- und Praxisthema.
- **Einstellungen** mit eingeklappter „Werkstatt“ (KI-Schlüssel, Stimmen-Casting, Stimmenpaket-Werkzeuge; nur für Entwickler).

### 3.2 Die 3D-Welt (`welt.js`, three.js r160)
- **Boot:** Kajütboot „Frieda“ (Standard) oder offenes Boot; Spanten-Rumpf, Bullaugen, Reling, Tank mit Pumpball, Badeleiter, Fender, Flagge, Außenborder mit **Pinne**. Steuerrad gibt es, ist aber ein späteres Upgrade (aus).
- **Steuern:** ein Feld unten mit Pinne zum Ziehen und Gashebel. Pinne nach rechts = Bug nach links (wie echt).
- **Motorstart als Ablauf:** Quickstopp-Leine, Tankentlüftung, Pumpball, Choke, Neutral, Startleine/Starttaste; Fehler haben Folgen (passend zu amtlichen Fragen), Kontrollstrahl.
- **Physik:** Schub, Widerstand mit Verdränger-Buckel und Gleitfahrt (bis etwa 22 kn), Radeffekt, Wind, Wellen heben das Boot; **Zusammenstöße** mit Ruck, Ton und Vibration.
- **Wasser und Wetter:** Gerstner-Wellen (Windsee, Dünung, Kreuzsee, Kabbelwasser, Schwell, kombinierbar), Wind, Regen, Nebel/Sicht, Tageszeit mit Sternen und Lichtern nach Sektor, Kielwasser, Gischt, Schaum am Rumpf.
- **Revier heute:**
  - **Kuttershaven:** Hafen mit Molen, Stegen, Liegern, Häusern, Laternen, gelbes Arbeitsboot der Hafenmeisterin vor unserem Liegeplatz.
  - **Fahrwasser** mit roten und grünen Tonnen bis zur **Ansteuerungstonne**, Insel mit Leuchtturm, Schilfzone.
  - **Tonnenkette nach Norden**, **Wrack** mit Nord-, Ost-, Süd- und Westtonne, Einzelgefahrenstelle, gelbe Sonderzeichen (Sperrgebiet).
  - **Klüverhafen** (Nachbarhafen) mit Kaimauer, Molenköpfen, Steg, Liegern.
- **Autopilot** („Hinnerk übernimmt“): Wegplaner (Dijkstra über ein Wegnetz), kreuzt Tonnenlinien nur zwischen den Tonnen, langsam im Hafen, legt selbst an; **Zeitraffer** für lange Strecken. Man kann jederzeit selbst übernehmen.
- **Aufgaben in 3D:** Ziel anfahren (Ring mit Lichtsäule), Horn/Schallsignal geben, **Anlegen** (zählt im gelben Rechteck: langsam, parallel, nah), Motor starten, **Teile am 3D-Boot antippen** (Bug, Heck, Backbord, Klampe, Fender …), Boot treiben lassen (Unfall-Szene).
- **Tafel:** Frage, Wahl und Modell bedecken die ganze Szene, das Boot steht still.
- **Anzeigen:** Minikarte oben rechts (antippen = groß), Crew-Gesichter am Rand (Sprecher leuchtet), Sprechblase, Aufgabenzeile oben, kurze Notizen.
- **Figuren in 3D:** Gäste (Hafenmeisterin, Jasper) als einfache Figuren auf dem Steg. **Die Crew steht nicht im Boot**, sie ist nur als Gesichter am Rand da.
- **Tiere:** Katze (läuft an Bord), Möwen, Enten, Seehund.
- **Leistung:** flüssig am Handy (Nutzer), Qualität stellt sich selbst ein.

### 3.3 Die Kajüte als Szene in Folgen (2D)
- Dieselbe gezeichnete Kajüte wie im Spiel, über die 3D-Welt gelegt (3D pausiert). Die Crew sitzt in der Runde, der Sprecher leuchtet, Gäste stehen als ganze Figur mit im Bild. Gespräche, Wahl-Knöpfe, Fragen, Freigaben-Liste, Zettel und Logbuch erscheinen hier.

### 3.4 Weitere Bausteine
- **Seekarte 7** (`img/karte7.svg`, `navi7.js`, `data/navi7.json`): erfundene Karte mit Elbe-Tonnenkette, Priel, Türmen, Schleuse, Sperrgebiet, Gezeiten- und Stromtabelle, geeichtem Gitter. 38 Navigationsaufgaben in Stufen N0–N6 (Antippen, Position, Distanz, Kurs, Zeit, Missweisung, Kreuzpeilung, Strom, Koppeln, Tiefe mit Tide). Werkzeuge Zirkel und Kursdreieck. Lösungen rechnet die App aus den Kartendaten.
- **Alte Navigationsschule** (`navi.js`, Karte „Kliev“, Lektionen L0–L11, Probeprüfung): läuft noch daneben.
- **Knoten** (`knoten.js`): animierte Knoten (Palstek, Achtknoten, Kreuzknoten, Schotstek, Webeleinstek, Rundtörn, Klampe, Stopperstek, Slipstek), Hinnerk sagt die Schritte an, Merksprüche („Schlange, Teich, Baum“), Spiele. Gedacht mit echtem Übungsseil: „Hält er? Ehrlich.“
- **Manöverspiel** (`manoever.js`, 2D von oben): Anlegen, Ablegen, Wenden usw. mit Physik und Kommandos.
- **Erklär-Animationen** (`anim.js`, 2D): 13 Stück (Radeffekt, Anlegen, Peilung steht, Lichter, Schallsignale, Kardinalzeichen als Uhr, Ebbe/Flut, Hoch/Tief, Schleuse, Festmacher, Mayday, Echolot, steile See).
- **Quiz und Prüfung:** alle amtlichen Fragen SBF See, Binnen, SKS mit Bildern, Merksatz je Frage, Vorlesen und Antwort per Zuruf (Alfa–Delta), Farben, Probeprüfung.
- **Seezeichen-Kurs** (`seezeichen.js`), **Lexikon**, **Kajütenfunk-Player** (`kurs.js`, Hörfolgen aus Skripten, älterer Podcast-Ansatz).
- **2D-Reise-Bühne** (`reise.js`): ältere Variante für Tage auf der Seekarte und Folge 1 in 2D. Wird von der 3D-Welt abgelöst.
- **Stimmen:** Stimmenpaket mit 359 fertigen MP3-Sätzen (`audio/stimmen/`), sonst Handystimme je Figur. Für die Folgen gibt es noch **keine** eingesprochenen Sätze; Gäste sprechen vorerst mit Harms' Gratis-Stimme.

### 3.5 Die Folgen, die heute spielbar sind (alle in 3D, Start über den Hocker)
| Folge | Titel | Inhalt | Schritte |
|---|---|---|---|
| 1 | Mooooin, Landratte! | Zettel am Steg, Rundgang am 3D-Boot (Teile antippen), Vorleine zu früh → Boot treibt → Rums ans Arbeitsboot, Freigaben eingeführt, Fender-Aufgabe, Hafenmeisterin, Abendfragen 1–3, Logbuch, Countdown | 112 |
| 3 | Von Bug bis Heck | Schietwetter in der Kajüte, Ausrüstung, Westen, Klampe | 53 |
| 7 | Raus bis zur Ansteuerungstonne | Gespräch, Möwen-Bauchregel, Hafenmeisterin, Scheinwahl, Motor selbst starten, Fahrwasser selbst, Begegnung, Schilf, Anlegen selbst, Abendfragen | 97 |
| 11 | Nach Klüverhafen | Kartentisch, Tonnenkette, Wrack mit Kardinaltonnen, Sperrgebiet, Einzelgefahr | 62 |
| 15 | Zurück nach Kuttershaven | fremder Hafen, Schallsignale, Rückfahrt | 57 |
| – | Testfolge „Probefahrt“ | Technik-Test (Nebel, Horn, Knotenbrett, Modell) | 45 |

Die übrigen rund 48 Tage stehen nur als Plan in `docs/gesamtplan.md`.

### 3.6 Crew-Regisseur (neu in v5.21, `crew.js`)
- Die Crew plaudert untereinander an dafür vorgesehenen Stellen (Kajüte, Hafen, Zeitraffer-Fahrten), ohne dass du etwas tust, oder sie schweigt.
- **Gedächtnis** `S.crewMem`: Folgen schreiben Merkmale (z. B. `rums_arbeitsboot`, `weste89`, `moewen_regel`, `wrack_west`, `jasper_nord`). Gespräche können darauf anspielen („Weißt noch, das Arbeitsboot?“) oder auf Freigaben reagieren.
- **Regeln:** Ort, Bedingungen (`wenn`/`nicht`), Priorität (Erinnerung vor Plauderei), Obergrenze `max`, Pause bis zur Wiederholung, Varianten je Zeile, Schweige-Wahrscheinlichkeit je Ort (30–40 %).
- Heute 16 Gespräche in `data/crew-dialoge.json`. Unterbrechen bei Wichtigem und Plaudern beim freien Fahren fehlen noch.

---

## 4. Architektur und Code

### 4.1 Grundaufbau
- **Reine Web-App ohne Build-Schritt und ohne Framework.** Eine große `index.html` (~550 KB: Code, CSS, gezeichnete SVG-Figuren, Kern-Logik) plus **nachgeladene Dateien** für große Bereiche: `welt.js` (3D, ~176 KB), `welt-folge.js` (Folgen-Abspieler), `crew.js`, `navi.js`, `navi7.js`, `knoten.js`, `manoever.js`, `anim.js`, `reise.js`, `szene.js`, `kurs.js`, `toern.js` (alter Törn), `schein.js`, `seezeichen.js`, `ziele.js`.
- **Bibliothek:** nur `lib/three.min.js` (three.js r160) und JSZip.
- **Daten** in `data/*.json` (Fragenkataloge, Karten, Folgen-Drehbücher, Gespräche, Knoten, Navigation …).
- **Offline:** Service Worker `sw.js` cached alles; `VERSION` dort = `__ver` in `index.html` (heute 5.21).
- **Spielstand:** ein Objekt `S` in `localStorage` unter dem festen Schlüssel `skipper-sbfsee-v1`. Regel: alte Spielstände dürfen **nie** brechen; jedes neue Feld bekommt einen Standardwert. Wichtige Teile: `courses[id].qs` (Lernstand je Frage), `freigaben` {id: {n, frei, d}}, `folgen` {id: {i, fertig}} (Haltepunkt), `crewMem`, `cfg` (Einstellungen), `navi7`, `knoten`, `man`.
- **Tests:** Rauchtest (`tests/smoke/rauchtest.js`, Playwright mit eigenem Server) läuft vor jedem Commit; Prüfwerkzeuge in `tools/` (Reiseplan, Navigationsaufgaben, Knoten mathematisch, Podcast-Skripte). Folgen werden mit Playwright im Auto-Modus durchgespielt.
- **Veröffentlichung:** Arbeitszweig → Pull Request → `main` → GitHub Pages.

### 4.2 Wie eine Folge gebaut ist
Eine Folge ist ein **Drehbuch aus Schritten** in `data/welt-folgen.json`. `welt-folge.js` spielt sie Schritt für Schritt ab und ruft dafür die Schnittstelle der Welt `WELT.api` auf. Ein Autor braucht dafür keinen Code.

| Schritt | Bedeutung |
|---|---|
| `{wer, t}` | Figur spricht einen Satz (wartet aufs Ende) |
| `{szene: 'kajuete' \| 'welt'}` | 2D-Kajüte oder 3D-Welt |
| `{ort}`, `{wetter}`, `{kamera}` | Ort, Wetter, Blickwinkel setzen |
| `{auto: [[x, z, Kurs]], gas, raffer, plaudern}` | Hinnerk fährt per Autopilot (optional Zeitraffer, Crew plaudert dabei) |
| `{selbst: 'ziel' \| 'horn' \| 'anlegen' \| 'motor', aufgabe, hinweis}` | du machst es selbst; „Hinnerk übernimmt“ ist immer möglich |
| `{ziel: {x, z, r, name}}` | Zielring setzen |
| `{wahl: {t, opts: [{t, ok, info, dann: [Schritte]}]}, fragt}` | Gespräch, Scheinwahl oder Entscheidung; jede Antwort mit eigener Reaktion |
| `{frage: n}` | amtliche Frage n (zählt im Lernstand) |
| `{punkte: {ziel, teile, zeige, falsch}}` | Teile am 3D-Boot antippen |
| `{treibe: {x, z, h, sek, rums}}`, `{fest}` | Boot treiben lassen / an den Steg holen |
| `{gast: {wer, x, z} \| {wer, kajuete: true} \| {wer, weg: true}}` | Gast erscheint auf dem Steg oder in der Kajüte |
| `{freigabe: id, ok}`, `{freigaben: true}` | Freigabe zählen / Liste zeigen |
| `{aufgabe}`, `{notiz}`, `{zettel}`, `{logbuch}` | Texte und Bilder einblenden |
| `{knoten: id}`, `{modell}`, `{navi: id}` | Knotenbrett, Mitmachen am Übungsboot, Aufgabe auf der Seekarte 7 |
| `{ton: '▬'}`, `{warte: s}` | Schallsignal eines anderen Schiffs, Pause |
| `{merke: id}`, `{plaudern: ort}` | Crew-Gedächtnis schreiben, Crew von selbst reden lassen |
| `{halt: Text}` | Haltepunkt: weiter oder später genau hier weitermachen |
| `{teil: Name}`, `{ende: true}` | Abschnitt benennen, Folge beenden |

**Modus:** ✋ Selbst (du steuerst) oder 🎧 Auto (Hinnerk fährt alles, Fragen werden vorgelesen).

### 4.3 Stimmen-Pipeline (geplant und teils fertig)
- Jeder Satz wird einmal bei ElevenLabs erzeugt (Eleven v4, Text to Dialogue) und liegt als MP3 im Repo. Die App schaut erst ins Paket, dann in den Gerätespeicher, sonst Handystimme.
- Stimmen werden in der App gecastet (Werkstatt → „Stimmen-Casting“). Kosten werden vorher angezeigt und bestätigt.
- **Folge:** Jede Antwortvariante, jede Gesprächsvariante kostet Credits. Deshalb sparsam mit Varianten an Stellen, die oft kommen.

---

## 5. Was fehlt oder schwach ist (ehrlich)
1. **Grafik:** 3D schlicht (Platzhalter-Häuser, einfache Figuren), die Crew ist in 3D nur Gesicht am Rand. Grafische Vorgaben des Nutzers fehlen noch.
2. **Stimmen:** Folgen laufen mit der Handystimme; noch nichts eingesprochen. Jaspers Stimme ist offen.
3. **Inhalte:** nur 5 von ~53 Tagen gebaut, und das als Rohbau. Dialoge sind Entwurf.
4. **Orte:** Ruderboot, Nord-Ostsee-Kanal mit Schleuse, Watt mit Tide, Ankerbucht, Nacht- und Nebelfahrt mit Großschifffahrt fehlen in 3D.
5. **Begegnungen:** andere Schiffe fahren noch keine echten Ausweichregeln mit dir (Kollisionsverhütungsregeln, Lichter, Schallsignale als steuerbare Lage).
6. **Freigaben:** System steht, wird aber erst in wenigen Folgen genutzt; „eingerostet“ fehlt.
7. **Kein Prüfwerkzeug für Folgen** (z. B. „jede Frage einmal am Abend“, „nichts ohne Vorwissen“, „keine Aufgabe ohne Erklärung“).
8. **Zwei Welten parallel:** 2D-Reise (`reise.js`), alte Navigationsschule und alter Törn (`toern.js`) liegen noch neben der 3D-Ausbildungsfahrt; Aufräumen offen.
9. **Crew-Regisseur:** nur an festen Stellen; kein Unterbrechen/Fortsetzen; keine Reaktionen ohne Worte (Blicke, Klabauter plustert sich).
10. **Hörmodus** für 3D-Folgen nur als „Auto“, nicht als reines Hören ohne Bildschirm.
11. **Sehr große `index.html`**, kein Build-Schritt, kein Typsystem; alles hängt an globalen Objekten (`S`, `WELT`, `CREWDIR`, `AUD`, `VOX`).

---

## 6. Wo wir deine Sicht brauchen
Bitte schau mit frischen Augen drauf und mach **konkrete** Vorschläge (gern mit Beispiel, Begründung und grobem Aufwand). Besonders:

1. **Motivation und Bogen:** Trägt „Smilla geht, du übernimmst“ über 53 Tage? Was fehlt an Spannung, Belohnung, Fortschritts-Gefühl?
2. **Lernwirkung:** Ist „hören → handeln → Rückmeldung → abends amtliche Fragen“ gut? Wie stellen wir sicher, dass alle 285 Fragen wirklich sitzen, ohne dass es zum Fragen-Abhaken wird?
3. **Länge und Rhythmus:** 30 Minuten in 2–3 Teilen – zu lang fürs Handy? Wie viel Gespräch, wie viel Handeln je Teil?
4. **Dialoge:** Wirken die Figuren lebendig? Was würdest du an Sprechweisen, Witz, Subtext ändern (Beispiel oben, mehr in `data/welt-folgen.json`)?
5. **Spielmechanik in 3D:** Welche Aufgaben fühlen sich wie „Spiel“ an, welche wie „Formular“? Was fehlt (Begegnungen, Wetterumschwung, Fehlerfolgen, Belohnungen)?
6. **Crew-Regisseur:** Regeln sinnvoll? Wie viel Plauderei verträgt man, bevor sie nervt? Wie mit Credits pro Sprachaufnahme haushalten?
7. **Freigaben:** Gutes Bindeglied zwischen Geschichte und Lernen? Wie zeigen, ohne dass es eine Checkliste wird?
8. **Hörmodus:** Wie kann man sinnvoll im Auto lernen, wenn Handeln Teil des Konzepts ist?
9. **Architektur:** Ist die Schritt-Sprache für Folgen ausreichend und wartbar? Was würdest du ändern, ohne einen Build-Schritt einzuführen? Wie aufräumen (2D-Reise, alte Navigation, alter Törn)?
10. **Was würdest du streichen?** Was ist zu viel, zu kompliziert oder doppelt?

### Grenzen für Vorschläge
- Keine Live-KI für Crew-Texte (Kosten, Kontrolle). Alles vorgeschrieben und eingesprochen.
- Kein Zeitdruck, keine Uhr.
- Prüfungsinhalte nur aus den amtlichen Katalogen; Karte 49 nie nachbauen.
- Spielstände dürfen nicht brechen.
- Läuft auf einem durchschnittlichen Android-Handy im Browser, offline.
- Figuren und ihre bestätigten Eigenschaften (Abschnitt 2) bleiben; Änderungsideen dazu bitte als Vorschlag kennzeichnen.

---

## 7. Wo du mehr findest (im Repo)
- `VISION.md` – die Vision, Grundsätze, Plan H0–H10
- `docs/gesamtplan.md` – alle Kapitel und Tage mit Fragen, Crew, Anreden
- `docs/gesamtueberblick.md` – großer Überblick: Aufbau, 2D/3D, 3D-Revier, Folgen, was fehlt
- `docs/dialog-regeln.md` – Regeln für natürliche Dialoge (mit Quellen)
- `docs/crew-regisseur.md` – Crew-Regisseur
- `docs/folge-01-entwurf.md` – Ablauf der ersten Folge
- `docs/entscheidungen.md` – offene Entscheidungen des Nutzers
- `data/welt-folgen.json` – Drehbücher der 3D-Folgen; `data/crew-dialoge.json` – Plaudereien
- `welt.js`, `welt-folge.js`, `crew.js` – 3D-Welt, Folgen-Abspieler, Crew-Regisseur
- `CLAUDE.md` – Arbeitsregeln, Code-Karte (§7) und Status (§8)
