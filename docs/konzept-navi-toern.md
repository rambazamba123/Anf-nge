# Konzept: Navigationsschule (5.5) und Törn-Light (5.6)
Entwurf zur Freigabe · Stand 04.10.2026 · Kartenentwurf: [karte-entwurf.svg](karte-entwurf.svg)

## 1. Die Karte „Kliev-Mündung“
- **Selbst gezeichnet und erfunden:** eine Nordsee-Flussmündung mit der Insel Smillaoog, dem Hafen Hinnerksiel, dem Fahrwasser „Klabautertief“, Watt, einer Sandbank mit Wrack und einem Verkehrstrennungsgebiet (VTG).
- **Geografie:** Das Gebiet liegt auf offener See, wo es in Wirklichkeit kein Land gibt: 55°10'–55°30' N, 6°20'–7°00' E. So kann niemand die Karte mit einer echten verwechseln.
- **Maßstab und Projektion:** wie die Prüfungskarte 1:100 000, in Mercatorprojektion. Eine Seemeile entspricht einer Bogenminute am Breitenrand.
- **Inhalt:**
  - Breiten- und Längenrand mit Minuten
  - Kompassrose mit Missweisung 3° E
  - Tiefen unter Kartennull
  - Lateraltonnen, Kardinaltonnen, Einzelgefahrenzeichen, Ansteuerungstonne
  - Leuchtturm mit Kennung und Sektoren
  - Gezeitenstromtabelle
- **Technik:** Die Karte ist ein SVG, das aus den Daten `data/karte.json` gebaut wird. Alle Objekte haben echte Koordinaten (Breite und Länge). Damit kann der Rechner jede Aufgabe exakt lösen und prüfen.
- **BSH-Karte 49:** Sie diente nur zum Verstehen von Maßstab, Aufgabentypen und Symbolik. Abgepaust und übernommen wurde nichts.

## 2. Datenmodell
| Datei / Feld | Inhalt |
|---|---|
| `data/karte.json` | `bounds`, `mw` (Missweisung), `land[]` und `watt[]` (Polygone in Breite/Länge), `tiefen[]`, `tonnen[]` (id, Typ, Farbe, Toppzeichen, Kennung, Position), `feuer[]` (Kennung, Höhe, Tragweite, Sektoren), `strom` (Tabelle je Stunde zu HW), `vtg[]` |
| `data/navi.json` | `fibel[]` (Begriff, Erklärung, Merkhilfe, Animationstyp), `lektionen[]` (id, Titel, Erklärsätze der Crew, Übungstypen), `deviation[]` (Ablenkungstabelle je MgK) |
| `S.navi` (neu, Standard `{}`) | `fibel: {Begriff: gesehen}`, `lek: {id: {sterne, serie}}`, `pruef: [{tag, punkte, fehler[]}]` |
| `S.toern` (neu, Standard `null`) | `etappe` (Start, Ziel, Route), `pos`, `zeit`, `proviant`, `sprit`, `laune`, `zustand`, `log[]` |

Die Navi- und Törn-Programmteile kommen in eine eigene Datei `navi.js`. Sie wird erst am Kartentisch nachgeladen, damit `index.html` (jetzt 447 KB) nicht weiter wächst.

## 3. Werkzeuge am Handy
- **Karte:** mit zwei Fingern zoomen, mit einem Finger verschieben. Eine Lupe zeigt die Minuten am Rand vergrößert.
- **Kursdreieck:** zum Verschieben ziehen, am Griff drehen. Die Gradzahl wird an der Kompassrose abgelesen, wie mit dem echten Dreieck.
- **Zirkel:** zwei Punkte setzen, dann zum Breitenrand ziehen und dort ablesen.
- **Bleistift:** Linien und Kreuze setzen, mit Rückgängig-Knopf. **Rechenblatt:** Felder für rwK, Mw, MgK, Abl., Distanz und Zeit.

## 4. Navi-Fibel, Lernpfad, Prüfungsmodus
- **Fibel:**
  - alle Begriffe aus 5.5, jeweils mit Erklärung, kleiner Animation auf der Karte und Merkhilfe
  - Begriffe sind überall antippbar
- **Lektionen 1–9:** jede gleich aufgebaut:
  1. Die Crew erklärt, mit festen Sätzen fürs Stimmenpaket.
  2. Geführte Übung.
  3. Freie Übung: Zufallsaufgaben zwischen zwei Tonnen der Karte.
  4. Meisterschaft: 3 Aufgaben in Folge richtig, dann gibt es einen Stern.
- **Aufgabengenerator:** Er wählt Start, Ziel, Fahrt, Uhrzeit, Ablenkung und Peilobjekte aus der Karte. Die Lösung rechnet er exakt (Mercator, Großkreis ist bei diesen Distanzen nicht nötig).
- **Prüfungsmodus:** 9 Teilaufgaben im Format der 15 amtlichen Aufgaben, umgesetzt auf unsere Karte. Ein Punkt je Teilaufgabe, bestanden ab 7 Punkten. Am Ende kommen Fehleranalyse und die Lektion, die man wiederholen sollte.
- **SKS-Stufe:**
  - Strom, Vorhaltewinkel und Gezeiten bekommen mehr Tiefe.
  - Dazu kommt die Kartenaufgabe mit 30 Punkten, bestanden ab 20.
  - Im SKS-Navigationskatalog kommen unter anderem Gezeiten (12 Fragen), Ablenkung (7) und GPS/Radar vor. Das Lernziel richtet sich danach.
- **Freischaltung:** Erst wenn die Lektionen 1–5 geschafft sind, darf man im Törn selbst Kurse absetzen.

## 5. Törn-Light
- **Start:** An Deck aufs Steuer tippen, dann „Tagesetappe starten oder fortsetzen?“.
- **Etappen:** Hinnerksiel ↔ Smillaoog ↔ Ansteuerung KL ↔ quer durchs VTG. Jede Etappe dauert 5–10 Minuten und läuft über die Schiffszeit.
- **Ansicht:**
  - Cockpit-Szene aus dem neuen langen Boot
  - kleine Karte mit dem Bootssymbol
  - Ablauf: Segel oder Motor wählen, dann fährt das Boot die Route.
- **Ressourcen:**
  - Proviant gibt es für jeden Lerntag.
  - Wer abbricht, verliert Proviant.
  - Dazu kommen Sprit (beim Motor), Crew-Laune und Bootszustand.
- **Ereignisse:** Sie richten sich nach dem Ort auf der Karte und nutzen die vorhandenen Spiele:

| Ereignis | Spiel |
|---|---|
| Anlegen | Manöver |
| Gegenverkehr | Ausweichregel wählen |
| Nacht | Lichter |
| Nebel | Schallsignale |
| Fahrwasser | Tonnen-Slalom |
| kein Kühlwasser | Motorkunde |
| Wasserschutzpolizei | 3 Prüfungsfragen |
| Mensch über Bord | Manöver |
| Böe | Reffen |
| VTG | rechtwinklig queren |
| Feuer | Kennung erkennen |

- **Am Ziel:** Logbucheintrag, Bewertung mit Sternen und ein Spruch der Crew.

## 6. Unteretappen für Lauf 2
1. **5.5a** Karte aus `karte.json`, Zoom, Lupe, Kursdreieck, Zirkel, Bleistift
2. **5.5b** Navi-Fibel
3. **5.5c** Lektionen 1–5 mit Generator
4. **5.5d** Lektionen 6–9 mit Strom, Wind und Gezeiten
5. **5.5e** Prüfungsmodus
6. **5.6a** Törn-Gerüst: Start am Steuer, Route, Cockpit-Ansicht
7. **5.6b** Ereignisse und Spiele
8. **5.6c** Ressourcen, Logbuch und Bewertung

## 7. Bitte entscheiden
1. **Toleranzen:** Der amtliche Bewertungsschlüssel nennt **keine** Toleranzen, nur „1 Punkt je richtige Antwort“. Mein Vorschlag:
   - Kurs und Peilung ±2°
   - Distanz ±0,2 sm
   - Position ±0,3'
   - Zeit ±2 Minuten

   Passt das, oder hast du Vorgaben aus deiner Schule?
2. **Zeitvorgabe:** Amtlich gelten 60 Minuten für den ganzen SBF-See-Bogen inklusive Navigation, es gibt keine eigene Zeit nur für die Navigationsaufgabe. Mein Vorschlag: Im Prüfungsmodus allein gibt es 25 Minuten (das ist eine Annahme), in der Probeprüfung wie amtlich 60 Minuten.
3. **Karte:** Ist der Entwurf so in Ordnung? Name, Gebiet und Inhalt kann ich noch ändern.
