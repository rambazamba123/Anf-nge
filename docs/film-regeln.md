# Film-Regeln der Hörreise (Entwurf, 20.11.2026)

> Grundlage: E27 (Film aus der Grund-Szene, GL9) und die Rückmeldung des Nutzers zur Glasebenen-Kamera am 20.11.2026: „Die Aufsicht: das Boot muss Tiefenwirkung bekommen … das Wischen ist nicht gut. Rest super. Überlege, zu welcher Szene was passt. Zu viel Wechsel würde ich vermeiden. Hitchcock-Zoom ist gut … Ich will immer noch ein ruhiges Bühnenbild, meist von der Seite.“
> Ausprobieren: `docs/entwuerfe/glasebenen-kamera.html`, Knopf „Musterszene“ (zeigt jede Regel einmal mit ihrem Grund).

## Grundsatz
- **FK1 Die Seite ist die Heimat.** Totale oder Halbnah von der Seite, etwa drei Viertel der Zeit. Die Kamera atmet nur leicht, das Bild bleibt ruhig.
- **FK2 Jeder Wechsel hat einen Grund in der Geschichte.** Höchstens ein Blickwechsel je Kapitel (etwa ein bis zwei Minuten) und danach zurück zur Seite. Einstellungen im selben Blick (Zufahrt, Schärfe) dürfen öfter kommen.

## Welcher Übergang wann
| Nr. | Moment in der Geschichte | Kamera |
|---|---|---|
| FK3 | Eine Figur sagt etwas Wichtiges oder zeigt ein Gefühl | Kamerafahrt im selben Blick (Zufahrt auf Halbnah oder Nah), danach zurück zur Totale |
| FK4 | Die Crew zeigt auf etwas (Tonne, Fender, Zapfsäule) | Schärfenzieher: Schärfe dorthin legen, ohne Schnitt |
| FK5 | Lehrbild: Radeffekt, Ausweichen, Kurs, Abstand | **Aus dem Blick, in dem die Sache Sinn ergibt** (Nutzer, 20.11.2026: „Lehrbild je nachdem, was gebraucht wird … die Perspektive, aus der auch die Animation Sinn machen würde“). Radeffekt und „Rad am Grund“: von achtern, abgetaucht unter die Wasserlinie (Übergang *tauchen*), danach wieder auftauchen. Anlegeseite, Ausweichen, Kurs, Abstand: von oben (Kranfahrt nach oben und zurück, immer mit Tiefe: Kajüte, Köpfe und Mast neigen sich). Seitenlichter, Schallsignal, Tiefgang: von der Seite. Nie ein Blick, aus dem man das Gezeigte nicht sieht (beim Radeffekt von oben sieht man das Rad nicht) |
| FK6 | Manöver oder Begegnung | Orbit: zum Heck („wohin fährt sie“), zum Bug („was kommt uns entgegen“), danach zurück zur Seite |
| FK7 | Du tust etwas (steuern, Ausguck, Aufgabe) | Über die Schulter |
| FK8 | Hinnerk erzählt von früher (Garn, Rückblende) | Atemzug hinein und wieder heraus |
| FK9 | Schreckmoment | Hitchcock-Zoom, höchstens einmal je Folge |
| FK10 | Ortswechsel oder Zeitsprung in der Folge | Nebelblende |
| FK11 | Anfang einer Folge (neues Bühnenbild) | Glasplatten |
| FK12 | Licht wechselt (Sonne geht unter, Licht an) | Lichtblende |

## Die Kajüte als Szenenbild (Nutzer, 22.11.2026: „Wir nutzen die Kajüte als Szenenbild mit. Das muss in die Grundlagen.“)
- **FK17 Dieselbe Kajüte wie in der App.** Wer die Folge hört, kennt den Raum vom Wischen: Tisch mit Hinnerk und Smilla, dein Hocker mit deinem Becher, Knotenbrett, Manöverbrett, Seekarte, Telefon, Kombüse, Niedergang. Darum spielen Gespräche am Tisch, Erklärungen an den Brettern und Anrufe von Harms dort und nicht an einem erfundenen Ort.
  - **Wann:** Ruhe vor oder nach einer Fahrt (Kaffee, Abend, Regen), Erklärungen an einem Brett (Manöver, Knoten, Karte), Kombüse (Gas, Kochen), Telefon (Harms ruft an). Unterwegs nur kurz und mit Grund (etwas holen, Hinnerk bleibt oben am Ruder).
  - **Marke:** `[[ORT: kajuete, nebel, innen]]` (als erstes Bild der Folge mit Glasplatten, FK11), danach Blicke mit `[[KAMERA: innen, …, fahrt]]`: `totale`, `runde` (am Tisch, du sitzt auf dem Hocker), `crew` (Hinnerk und Smilla halbnah), `karte` (Seekarte am Tisch), `stange` (Klabauters Stange mit Schälchen), `baro` (Uhr und Barometer), `telefon`, `kombuese` (Herd, Drehknöpfe, Gashahn mit rotem Hebel), `knoten`, `manoever`, `navi` (Kartentisch), `buch`, `tuer` (Niedergang), `hocker`.
  - **Wer da ist:** Klabauter ist bis zu seiner Rückkehr in 1-6 ausgeblendet (`[[TU: klab=0/10]]` direkt nach dem ORT). Steht Hinnerk in der Geschichte oben am Ruder, wird er ausgeblendet (`[[TU: hin=0/10]]`); sein Becher bleibt stehen und dampft nicht mehr. Gäste sitzen (noch) nicht am Tisch, sie rufen von oben oder kommen per Telefon.
  - **Harms:** Das rote Telefon ist seine Leitung, wie in der App (dort ruft man ihn zur Probeprüfung). Geht keiner ran, spricht er auf den Anrufbeantworter.
  - **Vom Brett in die Aufsicht:** Manöverbrett und Seekarte zeigen die Aufsicht schon. Von dort geht es mit einer Nebelblende in die Ansicht von oben (FK5), nicht mit einer Kranfahrt aus der Kajüte.
  - **Licht:** wie draußen (FK15), die Lampe brennt immer. Karte = Welt (HR50): Was auf der Seekarte am Tisch liegt, ist die Reisekarte.

## Player (Nutzer, 25.11.2026: „Der Film läuft durch, die Animationen kommen im Film vor, ohne Umschalten. Bei Fragen sieht man NUR die Frage.“)
Gilt für jedes Aussehen des Players, nicht nur für den Film (seit v5.84; vorher hatte nur die Nachtbühne diese Regeln, `docs/plan-lauf8.md` §2).
- **PL1** Der Film läuft ohne Umschalten durch. Kein Fenster neben oder unter der Szene.
- **PL2** Lehrbilder und Animationen sind Teil des Films: Sie erscheinen im selben Rahmen wie die Szene, gleich groß (4:5), und danach geht der Film dort weiter.
- **PL3** Bei einer Frage zeigt der Bildschirm nur die Frage, auf dem ganzen Platz. Ein Bild gibt es nur, wenn die Frage eines braucht (Schild, Licht, Zeichen aus dem Katalog).
- **PL4** Kein Text im Bild (außer in der Stufe „Mitlesen“), unten nur die einfache Leiste. Ausnahme: Beschriftungen in Lehrbildern (z. B. „von achtern gesehen“), aber nie vor der Frage, deren Antwort sie verraten.
- Geprüft: `node tests/buehne-pruefen.js` (Animation im Filmrahmen, Szene bei Fragen ausgeblendet). Standbilder je Folge: `node tools/film-bilder.js <folgen-id>`.

## Harms im Film (Nutzer, 22.11.2026: „erst ab Folge 3 oder so“, „nicht während der Folge einfach abfragen, sondern an geeigneten Stellen oder am Anfang/Ende“)
- **FK18** Harms tritt in Tag 1 erst in 1-3 auf (Anruf in der Kajüte). Seine Rückfragen kommen am Anfang, am Ende oder an einer Stelle, an der die Geschichte ohnehin Pause macht (Anruf, Warten), nie mitten in einer Szene. Eine Folge hat höchstens einen Harms-Teil vorn und einen hinten.

## Nicht
- **FK13** Kein Vordergrund-Wischer (Nutzer, 20.11.2026). Kein harter Schnitt, außer zum Vergleich.
- **FK14** Keine Wechsel nur, damit sich etwas bewegt. Wenn nichts passiert, bleibt das Bild stehen und die Welt lebt (Wellen, Möwen, Nebel).

## Licht und Glas
- **FK15** Das Licht folgt der Geschichte: Tageszeit und Wetter aus `[[SZENE]]` (Morgen, Mittag, Abend, Nebel, Nacht). Nachts stimmen die Lichter je Blick (Seite: rotes Seitenlicht und Topplicht; von achtern nur das Hecklicht; von vorn Rot rechts, Grün links, Topplicht oben).
- **FK16** Eine Glasart für alle Folgen: **weich** (Nutzer, 20.11.2026). Seit v5.73 gibt es sechs Glasarten zur Auswahl in der Werft (Weich, Klar, Aquarell, Feder, Buntstift, Papiertheater; `docs/baukasten.md`); die Standardwahl bleibt Weich, bis der Nutzer anders entscheidet.

## Marken im Skript (seit v5.71, `film.js`)
- `[[ORT: name, übergang, blick]]` neues Bühnenbild (`tankstelle`, `becken`, `kluever`, `ausfahrt`, seit v5.72 `motor` mit Blick `heck`: Außenborder von achtern, `[[TU: dreh=1, pfeil=1]]` zeigt „voraus: im Uhrzeigersinn“, `dreh=-1` „zurück“; seit v5.83 `kajuete` mit Blick `innen` (FK17) und `liegeplatz` mit Blick `seite`, die Frieda am Liegeplatz in Kuttershaven). Boot und Figuren kommen aus dem Baukasten (`docs/baukasten.md`). Das erste ORT einer Folge kommt immer mit Glasplatten (FK11).
- `[[KAMERA: blick, einstellung, übergang]]` im selben Ort, z. B. `[[KAMERA: heck, totale, orbit]]`, `[[KAMERA: seite, hilke, schaerfe]]`, `[[KAMERA: schnitt, totale, tauchen]]`. Übergänge: `fahrt`, `schaerfe`, `orbit`, `kran`, `tauchen`, `atem`, `nebel`, `licht`, `platten`, `schnitt`.
- `[[TU: name=wert/ms, …]]` Handlung im Bild (z. B. `p=.7/5000` Frieda fährt zurück, `fender=1/600`; in der Kajüte `klab=0` Klabauter weg, `hin=0` Hinnerk oben am Ruder). Ein TU nur mit Sprüngen (0 bis 10 ms) direkt nach ORT oder KAMERA gilt genau im Moment des Bildwechsels, man sieht den Sprung nicht.
- v5.84 neue TU: `rums` (Stoß an Pauls Fender: Fender flach, beide Boote schaukeln; Tankstelle von achtern, Pauls Boot liegt jetzt neben der Frieda), `ch` und `krach` (Hafenkino: Charterboot fährt ein, 0 = draußen, 1 = am Steg; Rumms gegen den Steg), `traum` (Vorstellung: Sepia und heller Rand, z. B. Klüverhafen vom Manöverbrett), `schwell` (die Frieda schaukelt an der Ausfahrt), `faehre=-1` (keine Fähre im Bild).
- `[[VERTIGO: an]]` Hitchcock-Zoom (FK9).
- `[[HARMS: anfang]] … [[HARMS: ende]]` Harms von außen (Rückblick „Was bisher geschah“); `[[HARMS: frage]]` hält den Film an (Bild friert ein) und stellt bis zu zwei Fragen früherer Folgen; `[[HARMS: anruf]]` dasselbe am Telefon in der Geschichte. Mit „Harms aus“ entfällt alles davon.
- `[[KISTE: Aufgabe]]` nur in der Stufe „Mit Händen“: Bild friert ein, Karte mit der Aufgabe, Erledigt oder Später.

Ohne Marke bleibt der Blick, wie er ist. Der Dichte-Messer soll später die Blickwechsel je Kapitel zählen (FK2; noch nicht gebaut).

## Proben (v5.71)
Drei Fassungen derselben Folge „Leise raus“ in `podcast/skripte/film-leise-raus-a.md`, `-b.md`, `-c.md` (in der App unter Hocker → Kajütenfunk → „Filmprobe“):
- **A Hafenkomödie:** geradeaus erzählt; Harms erzählt am Anfang, was bisher geschah, und hält einmal an.
- **B Der Fender:** beginnt mit dem Rumms an Pauls Fender, Harms spult zehn Minuten zurück; die Ratefrage wird zum Rätsel „Warum ist das passiert?“; Kapitel 2 landet wieder im selben Bild.
- **C Du bist Ausguck:** du hast einen Posten, jede Frage ist deine Meldung; Harms ruft in der Geschichte an.
