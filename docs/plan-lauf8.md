# Plan Lauf 8: Aufräumen, Player-Regeln, Tag 1 nachschärfen, Gesamtkonzept (ab 22.11.2026)

> Grundlage: Rückmeldung des Nutzers vom 22.11.2026 nach dem Hörtest von v5.83. **Status (26.11.2026):** Der Nutzer hat am 25.11.2026 gesagt „Schreib den ersten Tag, so wie er jetzt sein soll, fertig“. Für O177–O179 und O181–O188 gelten seitdem Claudes Vorschläge aus dem Bericht vom 22.11.2026, bis der Nutzer etwas anderes sagt.
> **Erledigt in v5.84:** P1 (PL1–PL4 im Film, Bühnentest), P4 (Tag 1: Harms ab 1-3, Pauls Fender, neuer Witz, Klüverhafen als Vorstellung, 1-4/1-5 als Film und neu geordnet, Hafenkino bewegt), P5 (Klabauter), aus P3 die Standbilder (`tools/film-bilder.js`) und das Lektorat je Folge gleichzeitig ohne Code. Offen: P2, P6, P7, P8, P9, P10 (Rest).
> Nach einem Abbruch hier weiterlesen. Erledigtes wird abgehakt, Nummern bleiben.

## 1. Schon entschieden (Nutzer, 22.11.2026)
- **O172 ja:** Klabauter fehlt in der App-Kajüte, bis Folge 1-6 gehört ist. Eigene Ergänzung: Im Testmodus (E29) ist er da.
- **O173 ja:** Das Charterboot im Hafenkino manövriert sichtbar.
- **O175:** Hinnerk mit Walross-Schnauzer wird Standard.
- **Figuren:** Alle Menschen bekommen Punktaugen, Tiere behalten ihre Augen. Die Figuren müssen qualitativ besser werden, sonst sehen sie in der Kajüte nicht gut aus.
- **Einheitlich:** Grafisch muss alles zusammenpassen. Wenn der Stil feststeht, wird alles nachgezogen.
- **Leiste unten:** In den Menüs ist sie immer da. In den Fokus-Bereichen (Knoten üben, Navigation lernen, Hörreise, Manöver, Fragen) darf sie fehlen, dort ist Platz wertvoll.
- **Fortschritt:**
  - Es gibt zwei Anzeigen. Das Rennen sieht man beim Öffnen und weiß grob, wo man steht.
  - Die genaue Übersicht ist für alle, die es genau wissen wollen oder ohne Geschichte lernen. Es gibt sie nur an einer Stelle, eventuell umschaltbar zwischen Kuchen und Liste.
- **Karte:** Die einfache Karte wird gezeigt. Beim Öffnen wird sie detailliert, die Etappen haben Stecknadeln in den Farben des Lernstands. Alternative: von Anfang an die richtige Karte.
- **Stimmen vormerken:** Beim langen „Mooooin“ bleibt der Mund bei den o offen.
- **Navigation in der Kajüte:**
  - Runder Tisch um die Karte, die Hände kommen aus der Richtung der jeweiligen Person.
  - In den Folgen und in der Navi-Schule ist es dieselbe Karte und dieselbe Ansicht.
  - Anfangs navigiert die Crew, man schaut mit.
- **Kajüte:** Smilla kann aufstehen. Gäste holen sich einen Stuhl, oder es steht standardmäßig ein freier am Tisch.
- **Harms:**
  - Er tritt erst ab etwa Folge 3 auf, das ist am Anfang übersichtlicher.
  - Er fragt nicht mitten in der Folge ab, sondern an geeigneten Stellen oder am Anfang bzw. Ende.
- **1-3:**
  - „Dat wird teurer“ ist unlustig und wird umgeschrieben.
  - Die Szene an Pauls Boot wird neu gemacht. Die Frieda sieht aus, als fahre sie vor Pauls Boot her, statt den Fender zu berühren. Das Nachbarboot wird besser animiert.
- **Reihenfolge:** „Fähre kommt auf uns zu, danach einparken“ ergibt keinen Sinn. „Dicke Pötte“ kommt eventuell in die nächste Folge.
- **Player, Rückschritt:**
  - Bei Harms ist die Antwortseite unübersichtlich: zu große Schrift, die Szene klein oben, die Frage überall verteilt.
  - Animationen sind nicht mehr Vollbild.
  - **Die alte Abmachung gilt wieder: Vollbild, kein Text, unten nur ein ganz einfaches Menü.**
- **Aufräumen:**
  - Der Hocker zeigt nur noch die aktuellen Folgen, der Rest kommt ins Archiv.
  - Alte Entwurfsseiten kommen ins Archiv.
- **Lektorat:** Es dauerte zu lange. Es soll schneller und besser werden, mit einer Erklärung dazu.
- **Handy-Leistung:** Bisher läuft alles recht gut.

## 2. Befund: warum der Player zurückgefallen ist
Nichts wurde gelöscht. Die Filmfolgen laufen in einem eigenen Aussehen des Players (Design `f`, seit v5.71). Die Regeln „Animation im Vollbild, kein Text, Frage geordnet“ hatten wir für die Nachtbühne (Design `b`, v5.55 bis v5.58) gebaut. Das Filmaussehen hat sie nie bekommen:
- Bei einer Frage schrumpft die Bühne auf 300 Pixel und bleibt oben stehen (`#kursplayer.d-f.mitwahl #kges`).
- Animationen erscheinen unter der Bühne statt im Vollbild, denn die Vollbild-Regeln gibt es nur für `d-b.mitbild`.
- Harms' Fragen nehmen das Frage-Layout ohne die Anpassungen der Nachtbühne.
- **Lehre:** Die Regeln für den Player gehören an eine Stelle, die für jedes Aussehen gilt (siehe P1). Das Werkzeug prüft sie für jedes Aussehen.

## 3. Arbeitspakete (Reihenfolge) und Modelle
Die Modelle stehen unten in einer Tabelle. Grafik und Bild-Layout bleiben bei Opus: Sonnet-Animationen hat der Nutzer schon einmal verworfen (E34).

| # | Paket | Inhalt | Modell |
|---|---|---|---|
| **P1** | Player-Grundregeln wiederherstellen | Vollbild-Bühne, kein Text, einfache Leiste unten. Bei Fragen verschwindet die Szene, Frage und Antworten stehen geordnet in passender Schriftgröße, Harms als Medaillon. Animation im Vollbild. Gilt für alle Aussehen. Regeln als **PL1 ff.** in `docs/film-regeln.md` bzw. eigenem Abschnitt, Bühnentest prüft jedes Aussehen | Opus |
| **P2** | Aufräumen | Hocker zeigt nur aktuelle Folgen, das Archiv kommt an eine Stelle (O187). Entwurfsseiten nach `docs/entwuerfe/archiv/`. Veraltete Doku nach `docs/archiv/`, Verweise anpassen | Sonnet (Umzug), Haiku (Verweise prüfen) |
| **P3** | Lektorat schneller und besser | `tools/lektorat.js` macht zu jedem Kapitel automatisch Standbilder der Filmbühne. Je Folge ein eigener Lektor, alle gleichzeitig. Auftrag „kein Code lesen“. Nach Korrekturen nur geänderte Kapitel prüfen | Opus (Werkzeug), Sonnet (Lektoren) |
| **P4** | Tag 1 nachschärfen | Harms ab 1-3 (O177). Pauls Fender neu, Animation und Ersatz für „Dat wird teurer“ (O179). Reihenfolge Fähre/Einparken (O178). Hafenkino bewegt (O173). Danach Lektorat nach P3 | Opus |
| **P5** | Klabauter in der App bis 1-6 aus (O172) | Kajüte und Deck prüfen `S.hoerreise.gehoert`, im Testmodus ist er da | Sonnet |
| **P6** | Figuren | Hinnerk Walross als Standard, Punktaugen für alle Menschen (schnell). Dann Qualität deutlich anheben, zuerst als Probe mit Hinnerk und Smilla (O184) | Opus |
| **P7** | Gesamtkonzept Oberfläche | Klickseite mit Varianten: Rahmen, untere Leiste, Fokus-Bereiche ohne Leiste, Kopf, Karten im Glasstil, Fortschritt (Rennen plus eine genaue Übersicht, O182), Reisekarte mit Stecknadeln (O183). Erst Abstimmung, dann Einbau | Opus |
| **P8** | Kajüte erweitern | Smilla steht auf und zeigt, freier Stuhl für Gäste (O185). Runder Navi-Tisch mit Händen aus der richtigen Richtung, gleiche Kartenansicht in Folgen und Navi-Schule (O186) | Opus |
| **P9** | Stimmen vormerken | Mund bleibt bei langen Vokalen offen („Mooooin“). Gilt für die Lautstärke-Kopplung beim Vertonen, Eintrag in `docs/fehler-katalog.md` und `docs/feste-saetze.md` | Sonnet |
| **P10** | Doku festhalten | E37 in `docs/entscheidungen.md`, Player-Regeln, `CLAUDE.md` §8, Code-Karte, Fehler-Katalog (Rückschritt Player) | Sonnet |

Vorschlag für die Reihenfolge: P1 → P2 → P3 → P4 → P5 → P6 (schneller Teil) → P10. Danach P7 als Abstimmung mit dir, dann P6 (Qualität) und P8. P9 nebenbei.

## 4. Offene Fragen an den Nutzer
Die Fragen und meine Vorschläge stehen im Bericht vom 22.11.2026. Die Antworten kommen hier hinein.
- O177 Harms ab 1-3: Fällt auch der Anrufbeantworter in 1-1 weg?
- O178 Welche Stelle wirkt wie „Fähre, dann einparken“?
- O179 Pauls Fender: Wie soll die Szene aussehen?
- ~~O180~~ **Beantwortet (Nutzer, 25.11.2026):** „Der Film läuft durch, die Animationen kommen im Film vor, ohne Umschalten. Bei Fragen sieht man NUR die Frage, dann können wir den ganzen Platz für die Frage nutzen. Nur wenn eine Darstellung (Schild o. ä.) da ist, sieht man sie, fragenabhängig.“ Daraus werden die Regeln PL1–PL4 in P1:
  - **PL1:** Der Film läuft ohne Umschalten durch, es gibt kein Fenster neben oder unter der Szene.
  - **PL2:** Lehrbilder und Animationen sind Teil des Films. Sie laufen in der Bühne als Bild des Films, im Vollbild.
  - **PL3:** Bei einer Frage nutzt die Frage den ganzen Bildschirm, keine kleine Szene oben. Ein Bild gibt es nur, wenn die Frage eines braucht (Schild, Licht, Zeichen aus dem Katalog).
  - **PL4:** Kein Text im Bild (außer Stufe „Mitlesen“), unten nur eine einfache Leiste.
- O181 Leiste unten: welche Variante?
- O182 Fortschritt: **Der Zettel an Deck entfällt (Nutzer, 25.11.2026), Smillas Aufgaben genügen.** Offen bleibt: Liegt die genaue Übersicht nur unter „Meine Prüfungen“, umschaltbar zwischen Kuchen und Liste?
- O183 Reisekarte: einfach, dann detailliert mit Stecknadeln? Wer zeichnet?
- O184 Figuren-Qualität: Was stört am meisten?
- O185 Smilla aufstehen, freier Stuhl
- O186 Navi-Runde: Blick und Sitzordnung
- O187 Archiv: was bleibt im Hocker?
- O188 Lektorat neu: einverstanden?
