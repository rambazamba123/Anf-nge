# Plan „Bord“: Deck und Kajüte in die App, dann Folgen 1-1 bis 1-3 als Film

Lauf 8, Stand 23.11.2026. Etappe A erledigt mit v5.82. Nach einem Abbruch hier weiterlesen; erledigte Punkte werden abgehakt (R4).
Grundlage: Rückmeldung des Nutzers zu v5.81 (E36 in `docs/entscheidungen.md`), `VISION.md`, `docs/spielkonzept.md` (SK9 Kajüte, SK14 Leiste), `docs/baukasten.md`, `docs/film-regeln.md`.

## 1. Was der Nutzer will (E36, geordnet)

| Nr. | Thema | Wunsch |
|---|---|---|
| BP1 | Deck | Im Vollbild in der App testen (auf der Klickseite war es zusammengeschoben). |
| BP2 | Deck | Das Schiffsrennen im neuen Zeichenstil. |
| BP3 | Kajüte | Mehr Tiefe beim Wischen: Dinge verschieben sich deutlich gegeneinander, mit Gegenständen ganz vorn (Stiefel usw.). |
| BP4 | Kajüte | Alle anklickbaren Dinge einbauen (Bücherregal usw.) und mit den echten Funktionen verbinden. |
| BP5 | Kajüte | Hocker: nicht auf den Hocker zoomen, sondern sich in die Runde setzen (Blick auf Tisch und Leute). |
| BP6 | Kajüte | Gemütlicheres Licht. |
| BP7 | Kajüte | Smillas Stift besser halten; Hinnerks Becher steht auf dem Tisch; ein Becher für Smilla und einer vor dem Hocker für dich. |
| BP8 | Figuren | Smilla etwas kleiner (an Deck wirkt sie schlaksig). |
| BP9 | Figuren | Hinnerk: einige Vorschläge zur Auswahl, ähnlich wie jetzt, aber süßer und mit anderem Bart. |
| BP10 | Figuren | Möwen im neuen Stil, ohne Umriss wie die Fabelwesen. |
| BP11 | Leben | Mäuse laufen ab und zu durchs Bild, mit Mauselöchern; angetippt flitzen sie weg. |
| BP12 | Leben | Fabelwesen nur vereinzelt: laufen durchs Bild, werfen etwas um, machen Faxen, fliehen angetippt so, wie es zu ihnen passt (richtig ausgebaut wird später). |
| BP13 | Leben | Klabauter und Backbord sind an Bord unterwegs; Backbord jagt die Mäuse; es ist etwas los, aber kein Gewusel. |
| BP14 | Folgen | Danach die Folgen 1-1 bis 1-3 neu, mit den neuen Regeln und der neuen Grafik. |
| BP15 | Grundlagen | Die Kajüte als Szenenbild für Folgen; das kommt in die Grundlagen. |
| BP16 | Kritik | Was fehlt, was ist schlecht, was passt nicht zusammen? (im Bericht und unten in §5) |

E34 (Mäuse als Extras im Aquarell) und E35 sind bestätigt.

## 2. Reihenfolge

### Etappe A: Einbau in die App (v5.82)
- [x] **A1 Figuren** (`figuren.js`): Smilla kleiner (Größe 88 → 82); neue Möwe im Aquarell ohne Umriss (sitzen, fliegen, laufen, picken); Bart- und Kopf-Varianten für Hinnerk. Die Varianten zeigt eine Entwurfsseite (`docs/entwuerfe/hinnerk-varianten.html`). In der App bleibt der jetzige Hinnerk, bis du wählst.
- [x] **A2 Kajüten-Bild** (`film.js`):
  - Tiefe beim Wischen etwa dreimal so stark wie in v5.81.
  - Neue Ebene ganz vorn mit Stiefeln, Seesack, Tauwerk, Eimer und Pfosten (dunkler und leicht unscharf).
  - Licht: Lampe als warmer Kreis über dem Tisch, Licht von den Bullaugen, dunklere Ecken; je nach Tageszeit (Tag, Abend, Nacht) und Wetter.
  - Am Tisch: drei Becher und Smillas Stift auf der Karte.
  - Mauselöcher.
- [x] **A3 `bord.js`** (neu, nachgeladen): Deck und Kajüte auf der Glasbühne, im Vollbild über der Leiste unten.
  - **Deck:** Die Frieda am Liegeplatz, die Crew an Bord. Unten, wie in der Klickseite, Zettel und Weiter nebeneinander, darunter das Rennen.
  - **Kajüte:** zum Wischen, mit Fernglas.
  - **Antippen:**
    - Ein Ding: die Kamera fährt heran, und dort liegt der Knopf zur echten Funktion (Tabelle unten).
    - Eine Person: sie spricht, und in der Sprechblase steht „Mit … reden ›“ (das bisherige Crew-Menü).
  - Werkstatt-Schalter „Altes Deck und alte Kajüte“ zum Vergleichen. Lädt die Glasbühne nicht, kommt automatisch die alte Ansicht.
- [x] **A4 Leben an Bord** (in `bord.js`): ein Taktgeber.
  - Höchstens ein Auftritt zugleich, dazwischen 15 bis 45 Sekunden Ruhe.
  - Beim Wischen, beim Heranfahren und im Hintergrund ruht alles.
  - Bei „Bewegung reduzieren“ gibt es nur ruhige Auftritte.
  - Die Auftritte:
    - **Mäuse:** von Loch zu Loch; angetippt ins nächste Loch oder aus dem Bild.
    - **Backbord:** schläft, putzt sich, wechselt den Platz; jagt manchmal eine Maus und sitzt dann vor dem Loch; angetippt miaut er und springt weg.
    - **Klabauter:** fliegt zwischen Sitzplätzen (Lampe, Regal, Kajütdach, Mast).
    - **Fabelwesen:** selten; ein Wesen läuft durch, stößt etwas an und schneidet eine Grimasse; angetippt flieht es: Wurm schlängelt, Quallchen schwebt, Sandkrümel hüpft, Muschelwicht klappt zu und rollt.
    - **Möwen an Deck:** sitzen auf Pfählen, fliegen auf.
- [x] **A5 Schiffsrennen** im Zeichenstil: Wasser als Aquarellband, deine Frieda aus der Werft und ein graues Prüfungsboot mit Bugwelle, Harms als kleine Figur am Ziel. Die Zahlen bleiben wie bisher.
- [x] **A6 Tests und Doku:** Rauchtest und Bühnentest auf das neue Deck, Leistung mit gedrosselter CPU, alte Spielstände, Fehlerkatalog, Code-Karte, Baukasten, `CLAUDE.md` §8.

**Dinge in der Kajüte und ihre Funktion** (SK9, R13; das Fernglas markiert nur diese):

| Ding | Heranfahren und Knopf | Funktion in der App |
|---|---|---|
| Knotenbrett | Brett füllt den Schirm, Knoten antippen: Animation | `knotenBrett()` (Knotenkunde) |
| Seekarte am Tisch | kippt in die Draufsicht | Reise der Hörreise (`hoerreiseWahl()`) |
| Seekarte an der Wand | Karte nah, Abendwache | `navSchool()`; Abendwache `naviFolgeOeffnen()` |
| Manöverbrett | Brett nah | `maneuverGame()` (Praxis) |
| Bücherregal | Bücher nah, Buch antippen | `meinePruefungen()` (Lernkartei, Prüfungen) |
| Telefon | Telefon nah | `harmsKommt()` (Harms prüft) |
| Hocker | **in die Runde setzen**: Blick auf Tisch und Leute | Hörreise: Folge, Start, Modus, Harms an/aus, andere Folge |
| Seekiste | Kiste nah | Frei üben (dort liegt auch die Spielekiste, M18) |
| Niedergang | Kamera fährt hinauf | an Deck |
| Glocke, Barometer, Funkgerät | kein Heranfahren | kleine Spielereien und Eier wie bisher (nicht im Fernglas) |

### Etappe B: Folgen 1-1 bis 1-3 als Film (v5.83)
- [x] **B1 Grundlagen** (v5.83: FK17 in `docs/film-regeln.md`, Hinweise in Schreibkarte und Vorlage, Logbuch): In `docs/film-regeln.md` kommt die Kajüte als Szenenbild dazu: welche Kamerablicke es gibt, wann man sie nutzt und dass sie dieselbe Kajüte wie in der App ist (Karte = Welt, HR50). Dazu `podcast/schreibkarte.md` und `podcast/folgen/VORLAGE.md` ergänzen.
- [x] **B2 Folgen** (v5.83: `podcast/folgen/film-1-1.md` bis `film-1-3.md`; 1-1 Kaffee, Stange, Barometer, Karte und Telefon in der Kajüte; 1-2 Gashahn an der Kombüse; 1-3 Kaffee holen und Manöverbrett): 1-1, 1-2 und 1-3 („Leise raus“, Fassung A als Vorbild) als Filmfassung schreiben, mit `[[ORT: kajuete]]`, Kamerablicken und den Regeln von Tag 1 (R15: Bible, Reise §7, Dialogregeln, Schreibkarte, Beispiele, Vorlage).
- [x] **B3 Lektorat** (HR61; 22.11.2026: 5 Fehler, rund 30 Hinweise, eingearbeitet in `docs/lektorat/film-1-1-bis-1-3.md`): `node tools/lektorat.js <folge> --bilder`, dann ein unabhängiger Unteragent; Befunde in `docs/lektorat/`.
- [x] **B4** Prüfwerkzeuge, Bühnentest, Doku, Version, Pull Request (v5.83; dabei behoben: Filmfolgen übernahmen das Tageslicht der App).

## 3. Was ich selbst entschieden habe (R3)
- **Tiefe physikalisch richtig:** Beim Wischen wandern nahe Dinge schneller als ferne, wie beim Blick aus dem Zugfenster. Du hast „langsamer“ geschrieben (in Anführungszeichen). Falls du es wirklich andersherum willst, ist das ein einziger Wert.
- **Deck am Liegeplatz** statt an der Tankstelle. Hilke und die Zapfsäule bleiben Teil der Geschichte (Folge „Tanken“), sonst hieße jeder Start der App „wir tanken gerade“.
- **Crew antippen:** Die Person spricht mit Mund und Kopfdrehen, und die Sprechblase führt ins bisherige Crew-Menü. So geht nichts verloren.
- **Hocker:** Die Kamera fährt auf Augenhöhe an den Tisch, die Crew schaut dich an, und vor dir steht dein Becher. Der Start der Hörreise liegt dann unten im Bild.
- **Seekiste** gilt als „Spielekiste“ aus R13 und führt zu Frei üben.
- **Mäuse und Fabelwesen** zählen nicht als Funktion und erscheinen deshalb nicht im Fernglas (R13).

## 4. Offen, aber nicht blockierend
- Welche Hinnerk-Variante? (Entwurfsseite)
- Stimmt die Richtung der Tiefe?
- Ab welchem Hörreise-Tag welche Extras frei werden (E29), ist weiter offen.

## 5. Kritik: was nicht zusammenpasst (BP16)
- **Zu viele Entwurfsstände:**
  - Es gibt sechs Menü- und Stil-Entwurfsseiten.
  - Nach dem Einbau sollten die überholten ins Archiv (`docs/entwuerfe/archiv/`), sonst testest du Altes.
- **Zwei Welten:**
  - Deck und Kajüte sind jetzt Glasbühne.
  - Frei üben, Meine Prüfungen, Knotenkunde, Navigationsschule und Einstellungen sind noch im alten Kartenstil.
  - Der Wechsel ist hart; ein gemeinsamer Rahmen für Kopfzeile, Zurück und Papierkarten fehlt.
- **Rennen und Zettel:**
  - Beide zeigen „wie weit bin ich“: das Rennen die Prüfungsreife, der Zettel die Tagesration, „Meine Prüfungen“ die Kuchen.
  - Drei Anzeigen für fast dasselbe; auf Dauer sollte eine führen.
- **Stimmen:** Die echten Stimmen sind alt (Klabauter noch mit alter Stimme, O38). Ohne Aufnahme bewegt sich der Mund nur im Takt, nicht zur Sprache.
- **Reisekarte:**
  - Sie ist noch ein Platzhalter („wird überarbeitet“).
  - Die Seekarte am Tisch zeigt sie trotzdem groß.
- **„Sieben Tage“:** Titel und Frist der Ausbildungsfahrt passen nicht mehr zu den Hörtagen (Etappe 5 Reiseplan steht aus).
- **Leistung am Handy:**
  - Gemessen ist nur im Rechner mit gedrosselter CPU.
  - Glasbühne, Unschärfe und Aquarell-Filter können auf älteren Android-Geräten ruckeln.
  - Der Handy-Test entscheidet, ob es eine „leichte“ Stufe braucht.
- **Auffindbarkeit:**
  - Ohne pulsierende Knöpfe weiß man anfangs nicht, was antippbar ist.
  - Das Fernglas hilft nur, wenn man es kennt.
  - Der Rundgang zeigt noch auf alte Stellen.
- **Ton (O43):** Ob die App die gestrichenen Tabus der Bible übernimmt, ist weiter offen.
