# Umbau aller Animationen auf Hochformat (Arbeitsplan, ab 08.11.2026)

> **Zweck:** Damit nichts verloren geht, wenn eine Sitzung abbricht. Wer weitermacht, liest diese Datei zuerst und arbeitet die Liste in §4 von oben nach unten ab. Nach jeder fertigen Gruppe: Status hier abhaken, committen, pushen (R4, R6).

## 1. Entscheidungen des Nutzers (08.11.2026)
- **O168 Hochformat für alle:** „Auf jeden Fall alles auf Hochformat umstellen.“ Bühne 400 × 500 (`vb: [400, 500]` in `ANIM.szene`), wie im Test `anim-test.js` (T1–T3 H).
- **O169 Unser Boot aus `boot.js`:** eine Datei für alle Ansichten (`BOOT.oben`, `BOOT.seite`, Antrieb `'aussen'` oder `'einbau'`). „Nur in Situationen wird es extra angepasst. Bsp. beim festen Motor anstatt Außenborder.“ Alle Animationen holen das Boot von dort.
- **O170 Marke oben rechts je Phase:** „📋 Prüfung“ oder „💡 Wissen“ (`marke: true`, Feld `pr` je Phase). Grundwissen wie Bug/Heck zählt als Prüfungsstoff.
- **Standard:** Animationen laufen beim Öffnen von selbst durch, mit Vorlesen (umgesetzt v5.30).
- **Allgemein (Nutzer):** Schrift meist zu klein → mindestens 16 px, Überschrift 20 px (`gross: true`). Animationen zu klein → näher ranzoomen, Platz nutzen. Oft kleine Logikfehler → jede Phase als Bild ansehen und prüfen. Wo der Radeffekt wichtig ist: auch von oben zeigen, wo das Wasser am Heck anprallt (Markierung wie `prall` in `anim-test.js`).

## 2. Arbeitsweise
1. Animation im Hochformat neu anordnen (meist in `anim2.js`/`anim3.js`/`anim4.js`; die alten in `anim.js` als `ANIM.szene` neu bauen).
2. Bilder aller Phasen erzeugen: `node tools/anim-bilder.js <datei.png> <von> <bis> [id-Anfang]` (Server vorher: `python3 -m http.server 8765` im Repo). Bild ansehen, Logik prüfen (Seiten, Richtungen, Radeffekt, Lichter, Texte überdecken nichts, nichts ragt aus dem Bild).
3. Fachlich nur nach `data/sbf.json` und den Katalogantworten (R8), ohne `quellen/` markieren.
4. Status in §4 abhaken, Version hochzählen, committen, pushen.

## 3. Kommentare des Nutzers (wörtlich, 08.11.2026)
- **A1.1 Das Boot und seine Seiten (boot):** „Backbord und Steuerbord passt, aber querab soll einen eigenen Pfeil bekommen und auch da der Text hinkommen. Achteraus soll ebenfalls genau da stehen von wo man es sieht und eigener Pfeil. Bei Mittschiff ist eine strichlierte Querlinie im Schiff. Die Linie ist horizontal. Wenn ich es richtig verstehe, soll die Linie eigentlich vertikal sein? Prüfe das. Bei Bug und Heck kannst du die Pfeile wegtun, sind hier ja nicht relevant. Bessere Eselsbrücke Backbord: die linke ist rot.“ → im Test T1 umgesetzt.
- **A1.2 Radeffekt (rad):** „Den halbrunden Pfeil auf jeweils die Hälfte der rechten bzw. linken Seite des Bugs richten. Denn da prallt der relevante Strom auf.“ (gemeint: Heck/Rumpf unten, wo der Strom aufprallt)
- **A1.3 Radeffekt von oben: Anlegeseite (radoben):** „Die Animation beim Hinziehen ist nicht sehr glücklich. In Wirklichkeit fahren wir spitz an, legen dann rückwärts ein. Und ziehen beim Abbremsen nach links. Bitte bedenken.“ → im Test T2 umgesetzt.
- **A1.5 Die vier Kreisläufe des Motors (motor):** „Die einzelnen Ströme von den Farben und Darstellung mehr so wie die echte Flüssigkeit/Gas. Insgesamt mehr zeigen, Wasser, Boot. Etwas detaillierter alles.“
- **A1.7 Gas sinkt in die Bilge (gas):** „Bessere Explosion! Schöneres Gas, Strich bei Bilge strichliert weglassen, hat hier keine Funktion. Eher eine schematische Kajüte oder so zeichnen.“
- **A1.8 Tanken ohne Knall (tanken):** „Tanksäule weniger kleine Symbole, mehr als großes erkennbar als Zapfsäule. Schlauch als Schlauch zeichnen. Gesamt die Animation größer?“
- **A2.1 Anlegen mit Backbord (anlegen):** „Der Rückwärtsgang setzt den Radeffekt beim Anlegen an Backbord mit rechtsdrehendem Motor. Er kommt hier gar nicht vor. Einbauen!“
- **A2.3 Ankern (ankern):** „Anker muss schon in den Boden gehen, sich beim Eingraben-Schritt auch eingraben. Wind mit darstellen. Auch hier größere Animation, da viel Platz verloren geht.“ → im Test T3 umgesetzt.
- **A2.4 Sog und Schwell großer Schiffe (sog):** „Schönere Wellen.“
- **A2.5 Wenden auf engem Raum (wenden):** „Auch etwas größer. Hier und bei allen Animationen, wo der Radeffekt wichtig ist: auch von oben gesehen durch Animation zeigen, wo das Wasser vom Radeffekt anprallt. Also am Heck an der Seite des Anpralls etwas markieren/animieren.“
- **A2.6 Aufstoppen (aufstoppen):** „Ranzoomen.“
- **A4.2 Begegnung: die Peilung bleibt stehen (begegnung):** „Bei diesen Aufsichten, auch beim Anlegen etc.: näher ranzoomen bzw. so umgestalten, dass man noch alles sieht, aber näher dran. Schrift auch größer. Peilung hier genauer beschreiben bzw. sagen, was die Peilung aktuell ist.“
- **A5.1 Lichterkarussell (lichter):** „Schrift größer, wie bei vielen. Eine 2. Ansicht daneben, bei der sich das beleuchtete Boot mitdreht und man sieht die Beleuchtung, dann versteht man es noch besser.“
- **A6.1 Schallsignale sichtbar (schall):** „Sind das alle prüfungsrelevanten? Geräusch nicht gehört.“ → Nein. Ergänzen: Dauer kurz (etwa 1 s, Frage 4) und lang (4–6 s, Frage 5), ein langer Ton beim Einlaufen (161), mindestens fünf kurze (140), kurz-lang-kurz Ankerlieger (141, 124), Gefahr- und Warnsignal lang+vier kurz zweimal (162, 163, 164), vier kurze Brücke/Schleuse nicht geöffnet (178), kurz-lang-kurz-kurz Polizei Anhalten (186), zweimal drei lange Sperrung (188), Bleib-weg-Signal (16, Bild `img/b/b16.png` prüfen), Nebelsignale (116–121), Notsignal Dauerton (281). Ton: prüfen, warum `AUD.horn` nicht klingt.
- **A7.3 Kardinalzeichen als Uhr (kardinal):** „Immer an der gleichen Stelle am Rand: Markierung prüfungsrelevant und nicht prüfungsrelevant.“ → Marke O170.
- **A7.8 Schleuse: Talfahrt (schleuse):** „Das Schiff steht vor der Ampel. Ändern, falls das nicht so sein sollte. Was ist der helle Strich zwischen Boot und Schleuse?“ → Warten vor dem Signal ist richtig; hellen Strich prüfen und entfernen, wenn ohne Bedeutung.
- **A8.6 Ebbe und Flut (gezeiten):** „Das Boot ist teilweise nicht sichtbar, das stört. … Füge noch eine Stelle mit Steinen am Grund hinzu und von der Oberfläche mitwandernd oder die Höhen und Tiefen bei Ebbe und Flut markiert (so dass man versteht, dass dann z. B. 3 m steht, wenn die Oberfläche bei Ebbe bei 3 m ist).“
- **Alle Animationen:** „automatische Einstellung ist die, bei dem alles nacheinander durchläuft. Animiere unser Boot einmal ordentlich in allen Ansichten, die benötigt werden. Ggf. ein Mini auch in 3D, gib dir hier Mühe und integriere es dann. Es soll so gebaut sein, dass man die Elemente modular und einfach austauschen kann.“ → `boot.js` (2D-Ansichten), 3D-Boot als eigene drehbare Ansicht (O169), nicht in jeder Animation.
- **A9.1 Warum der Wind weht (wetter):** „Stark. Auch hier Schrift größer.“
- **B1.6 Festmacher und Springs (festmacher):** Frage zum Rundtörn (zweiter halber Schlag „in die gleiche Richtung“): richtig, beide Schläge ergeben zusammen einen Webeleinstek um die stehende Part. Kommentarfeld fürs Knotenbrett nachrüsten.

## 4. Liste (Status: ○ offen, ✓ im Hochformat fertig)
Reihenfolge: zuerst die kommentierten, dann Prüfungsstoff (A), dann Zusatz (B). Test-Animationen (`anim-test.js`) werden übernommen und dann gelöscht.

| Nr. | id | Datei | Status |
|---|---|---|---|
| A1.1 | boot | anim-hoch | ✓ v5.32 |
| A1.1b | wind | anim2 | ○ |
| A1.2 | rad | anim-hoch | ✓ v5.37 (eigene Zeichnung statt reise.js; Bogen trifft die Rumpfhälfte, Drehpfeil, Heck weicht aus) |
| A1.3 | radoben | anim-hoch | ✓ v5.32 |
| A1.4 | ruder | anim.js | ○ |
| A1.5 | motor | anim-hoch | ✓ v5.37 (Einbaumotor im Schnitt mit Boot und Wasser, Flüssigkeiten fließen, Warnleuchten nach Frage 52–55, Phase 5 nach Frage 60) |
| A1.7 | gas | anim-hoch | ✓ v5.35 (Kajüte im Schnitt, große Explosion mit Rauch, keine Strichlinie, Phase 3 Gasgeruch nach Frage 64) |
| A1.8 | tanken | anim-hoch | ✓ v5.35 (große Zapfsäule mit Anzeige, echter Schlauch, Liste nach Frage 49 und 43) |
| A2.1 | anlegen | anim-hoch | ✓ v5.32 (Rückwärts mit Radeffekt) |
| A2.2 | ablegen | anim2 | ○ |
| A2.3 | ankern | anim-hoch | ✓ v5.32 |
| A2.4 | sog | anim-hoch | ✓ v5.35 (Kelvin-Wellen, Boot schaukelt an der Welle, Phase 3 zu schnell / langsam an Liegern) |
| A2.5 | wenden | anim-hoch | ✓ v5.32 (Anprall markiert) |
| A2.6 | aufstoppen | anim-hoch | ✓ v5.32 |
| A2.7 | mob | anim2 | ○ |
| A3.2 | knotenpraxis | anim2 | ○ |
| A4.1 | grundregeln | anim2 | ○ |
| A4.2 | begegnung | anim-hoch | ✓ v5.32 (Peilung live, genau 27°) |
| A4.3 | rangleiter | anim2 | ○ |
| A4.4 | kurshalter | anim2 | ○ |
| A4.5 | revierkarte | anim2 | ○ |
| A4.6 | vtg | anim2 | ○ |
| A4.7 | fahrwasser | anim2 | ○ |
| A4.8 | segler | anim2 | ○ |
| A5.1 | lichter | anim-hoch | ✓ v5.36 (zweite Ansicht: so siehst du das Boot, es dreht sich mit; Fehler behoben: von vorn fehlte Rot) |
| A5.2 | lichtertafel | anim-hoch | ✓ v5.40 (Nacht oben, Tag unten, Schiffe größer) |
| A5.3–A5.6 | schlepp, manunf, fischer, anker | anim-hoch | ✓ v5.40 (Bagger mit zwei Rot/zwei Grün nachts, Schlepp mit Übersicht der Topplichter) |
| A6.1 | schall | anim-hoch | ✓ v5.33 (alle 13 Signale des SBF-See-Katalogs, Horn nach dem Vorlesen) |
| A6.2, A6.3 | nebel, glocke | anim-hoch | ✓ v5.41 |
| A7.3 | kardinal | anim-hoch | ✓ v5.36 (Marke, sicherer Sektor grün, Uhr klein unten) |
| A7.1–A7.7 | lateral, kennung, sonderzeichen, sektorenfeuer, tafeln, bruecke | anim-hoch | ✓ v5.41 (Kennungen als Taktbalken über 12 s mit laufendem Zeiger) |
| A7.8 | schleuse | anim-hoch | ✓ v5.34 (heller Strich war eine Lücke im Wasser; Drempel, Leine nachlassen, Rot+Grün nach Binnen 117/119) |
| A8.6 | gezeiten | anim-hoch | ✓ v5.34 (Boot immer sichtbar, Steine mit Kartentiefe, Pegel, Rechnung Wassertiefe, Begriffe nach SBF 249–255) |
| A8.3–A8.8 | missweisung, peilung, koppel, tidenstrom, seemeile | anim-hoch | ✓ v5.42 (Peilung: an der Linie steht jetzt die Peilung vom Boot, vorher die Gegenpeilung 210°) |
| A9.1 | wetter | anim-hoch | ✓ v5.36 (Hoch über Tief, Schrift groß) |
| A9.2–A9.10 | wetterkarte, beaufort, schwerwetter, notsignale, sicherheit, feuer, umwelt, nationalpark, baden | anim-hoch | ✓ v5.43 (Wetterkarte: Windpfeile waren verkehrt herum, berichtigt) |
| A10.1–A10.7 | bergtal, faehre, wehr, binnenschall, wasserski, segeln | anim3 | ○ |
| B1–B4 | festmacher, mayday, echolot, steilesee (anim.js) und alle aus anim4 | anim4 | ○ |

## 5. Stand der Sitzungen
- 08.11.2026: Plan angelegt. Zuerst wird die Gratis-Stimme der Testfolgen repariert (Nutzer: „Es läuft blitzschnell alles durch, man hört nichts außer der Glocke“), dann die Animationen.
- v5.31: Gratis-Stimme repariert (`playPhone`: kein `cancel()` direkt vor `speak()`, zweiter Versuch mit Standardstimme, `phoneUnlock` beim Klick; bleibt sie stumm, wartet der Player die Lesezeit ab und zeigt den Text). Nächster Schritt: Animationen ab §4 oben.
- v5.32: Neue Datei `anim-hoch.js` (ersetzt alte Fassungen gleicher id, `neuId` in `ANIM.szene`); erster Stapel fertig: boot, radoben, anlegen, ankern, wenden, aufstoppen, begegnung. Bilder geprüft (`BREITE=400 node tools/anim-bilder.js bild.png 0 20 hoch`), Logik: Radeffekt rückwärts immer Heck nach Backbord, Anprall Steuerbord am Heck; Begegnung mit gleichbleibender Peilung 27°, Ausweichen hinter dem Heck. Zu lange Überschriften werden automatisch schmaler. Nächster Stapel: motor, gas, tanken, sog, lichter, schall, kardinal, schleuse, gezeiten, wetter, rad.
- v5.33: Horn repariert: Der Auto-Start per Timer galt nicht als Antippen, darum gab der Browser den Ton nicht frei. Jetzt gibt `A.spiele` Ton und Handystimme beim Antippen frei, und eine Phase kann mit `nach(svg)` nach dem Vorlesen einen eigenen Ton spielen (Auto-Lauf wartet darauf, `svg.__ton` wird beim Weiterschalten gestoppt). Schallsignale neu im Hochformat mit allen Signalen des Katalogs (Fragen 4, 5, 16, 124, 139–141, 161–164, 178, 186, 188, 279, 281, 282) plus Kursänderung als Wissen; Test: Horn klingt im Auto-Lauf.
- v5.34: Hilfsfunktion `roh(id, o)` in `anim-hoch.js` für eigene Zeichnungen mit `tick` im selben Rahmen (Überschrift, Unterzeile, Marke). Ebbe und Flut sowie Schleuse neu im Hochformat. Überschriften jetzt wirklich groß (die CSS-Regel `.an .t.cap{font-size:15px}` hat `gross` überstimmt, entfernt).
- v5.35: Gas, Tanken, Sog im Hochformat (Phasen 0–2 bzw. 0–3 wie von der Hörreise genutzt, Neues nur angehängt). Bilder-Werkzeug mit `ZEIT=ms` (Moment im Ablauf, z. B. Explosion bei 1900).
- v5.36: Lichterkarussell, Kardinalzeichen, Wetter im Hochformat; Hilfsfunktion `fit(e, max)` macht zu lange Texte schmaler. Nächster Stapel: motor, rad, dann die übrigen A-Animationen der Reihe nach.
- v5.37: Motor und Radeffekt neu im Hochformat. Damit sind alle vom Nutzer kommentierten Animationen umgebaut (außer B1.6 Knotenbrett-Kommentarfeld). Nächster Schritt: die übrigen A-Animationen der Reihe nach (wind, ruder, ablegen, mob, knotenpraxis, grundregeln, rangleiter, kurshalter, revierkarte, vtg, fahrwasser, segler, lichtertafel …).
- v5.38: Alle übrigen Animationen laufen jetzt im Hochformat-Rahmen 400 × 500 (`ANIM.szene` ohne `vb`: oben große Überschrift und Marke, Mitte die alte Szene, unten der Satz der Crew in bis zu drei Zeilen; alte eigene Zeichnungen aus anim.js mit Titel oben). Alle 70 übrigen Animationen als Bilder durchgesehen: fachlich in Ordnung bis auf **Ablegen** (die „Vorspring“ lief vom Bug nach vorn wie eine Vorleine, jetzt vom Bug schräg nach achtern an Land, berichtigt). Binnen-Schallsignale um „fünf kurze: Überholen nicht möglich“ (Binnen 161) ergänzt, mit Horn (v5.39). Weiter: die Szenen einzeln für das Hochformat neu zeichnen (größer, Boot aus boot.js), Reihenfolge wie §4.
- v5.40: O171 alle Wiedersehen-Formen gut (B176). Übrige Animationen werden in `anim-hoch.js` neu gezeichnet: Hilfe `neu(id, o)` übernimmt Titel und Texte der alten Fassung, `ph` ändert einzelne Phasen; `anim3.js` gibt die Fahrzeuge als `ANIM.fz` frei. Stapel A5 fertig. Bilder-Werkzeug: Filter `=id1,id2` für genaue ids.
- v5.41: A6 und A7 neu gezeichnet (Nebel, Glocke, Lateral, Kennungen mit Taktbalken, Sonderzeichen, Leit-/Richt-/Quermarkenfeuer, Tafeln, Brücke mit 40 px je Meter).
- v5.42: A8 neu gezeichnet. Fachlich berichtigt: An der Standlinie stand die Gegenpeilung (vom Leuchtturm zum Boot), jetzt die gemessene Peilung vom Boot (023° und 335°, Schnittwinkel 48°). Koppelort genau 051° und 6 sm, Strom 2 kn genau Südost.
- v5.43: A9 neu gezeichnet. **Fachfehler berichtigt:** In der Wetterkarte drehte der Wind ums Tief im Uhrzeigersinn nach außen und ums Hoch gegen den Uhrzeigersinn nach innen; jetzt richtig (Tief gegen den Uhrzeigersinn hinein, Hoch mit ihm hinaus, Pfeile berechnet). Wartung von Westen und Rettungsinseln steht nicht im Katalog: Phase als Wissen markiert, ohne feste Frist. Abgeglichen mit SBF 68, 69, 256–258, 261, 263, 267–270, 275.
