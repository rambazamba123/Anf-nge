# Soundeffekte für den Kajütenfunk

Stand: 23.10.2026, gekürzt für den Hörkurs (Konzept `docs/konzept-kajuetenfunk.md` §10.5 und §10.6). Die lange Liste für die frühere Geschichte liegt in `podcast/archiv/soundeffekte-geschichte.md`. Der Nutzer stellt die Geräusche bereit (`PODCAST_STATUS.md` B75). Claude mischt sie zu den Stimmen dazu.

## Neu am 24.10.2026: Geräusche erzeugt die App

Du musst Geräusche nicht mehr selbst suchen. Die App erzeugt sie mit ElevenLabs Sound Effects zusammen mit der Folge (Liste mit Beschreibung, Länge und Schleife in `podcast/geraeusche.json`). Für die Probefolge: Schleusen-Atmo, Schleusentor, Ausflugsschiff, Telefon und Flügelschlag, zusammen etwa 800 Credits. Eigene Dateien aus der Liste unten gehen weiterhin und haben Vorrang, wenn du welche lieferst. Am Anfang einer Folge kommt kein Erkennungston (O15).

## Grundsätze
- **Wenig, mit Zweck:** Ein Geräusch sagt, wo wir sind (Revier), oder es gibt dem Hörer ein Zeichen (richtig, falsch, nachdenken).
- **Nie unter Erklärungen:** kurz am Anfang einer Szene, dann leise oder weg.
- **Prüfungssignale kommen aus dem Code,** mit genauer Dauer (kurz etwa 1 s, lang 5 s). Hörner aus Geräusch-Bibliotheken nie dafür nehmen (§10.5).
- **Die Töne des Kurses** (Erkennungston, falsch, Ticken, Merk-Glocke) klingen deutlich anders als jedes Prüfungssignal: kein Horn, keine Pfeife.
- **Probefolge:** Was schon in `audio/` liegt, reicht. Fehlende Geräusche dürfen fehlen.

## So lieferst du
- **Format:** MP3, gern 44,1 kHz. Kein Hall, keine Musik darunter.
- **Länge:**
  - **Atmo** (Hintergrund) 1–3 Minuten. Sie soll sich schleifen lassen: Anfang und Ende ohne harten Schnitt.
  - **Einzelgeräusche** sind kurz. Davor und danach so wenig Stille wie möglich.
- **Dateiname:** genau die ID aus der Tabelle, z. B. `atmo-hafen.mp3`.
- **Ablage:** auf GitHub in den Ordner `import` hochladen. Claude räumt sie nach `podcast/geraeusche/` und prüft sie. Das ist Rohmaterial zum Mischen; in der App landen nur die fertigen Folgen.
- **Lizenz** (CLAUDE.md R12): nur Geräusche, die du nutzen darfst, z. B. von Pixabay (frei, auch kommerziell) oder selbst aufgenommen. Schreib mir die Quelle dazu, dann kommt sie unter „Über die App“.
- **Priorität:** **A** = für die Probefolge und den Grundkurs (Teil G), **B** = für Teil S, **C** = später oder nur, wenn es leicht zu finden ist.

## Die Töne des Kurses

| ID | Was | Bis dahin (aus `audio/`) | Prio |
|---|---|---|---|
| `kennung` | Erkennungston am Anfang jeder Folge, 2–5 s, maritim und frech. Dazu eine Kurzfassung unter 1 s, die bei jeder richtigen Antwort erklingt (O15) | Anfang: zwei Schläge `glocke.mp3` wie beim Glasen; richtig: `richtig.mp3` (0,4 s) | A |
| `falsch-dunkel` | dunkler, weicher Ton bei falscher Antwort, unter 1 s, kein Hupen | `falsch.mp3` (1,8 s) | A |
| `ticken` | leises Ticken in den Denkpausen (3, 5 oder 6 s) | Ausschnitt aus `uhr.mp3` | A |
| `uebergang` | kurzer Übergang zwischen zwei Abschnitten, 1–3 s | ohne | B |
| `abspann` | Ausklang am Ende der Folge, höchstens 10 s | ohne | C |

- Klabauters Merk-Glocke ist ein einzelner Schlag von `glocke.mp3` (O6). Darum hat der Ersatz-Erkennungston zwei Schläge.
- Lange Titelmusik gibt es nicht (O15). Die Musik in `audio/` bleibt der App vorbehalten.

## Atmo je Revier

Eine Atmo je Revier reicht. Sie läuft am Anfang einer Szene kurz an und wird dann leise. Länge 1–3 Minuten, schleifbar: Anfang und Ende ohne harten Schnitt.

| Revier im Kursplan | Folgen | Was man hört | Schon da (`audio/`) | Fehlt noch | Prio |
|---|---|---|---|---|---|
| `frei` | 29 | Wasser am Rumpf, Wind, Segel | `wellen.mp3`, `wind.mp3`, `wind-leise.mp3`, `segel.mp3` | – | – |
| `fahrwasser` | 10 | dazu ein großes Schiff in der Nähe | `wellen.mp3`, `motorboot.mp3` | `grossschiff`: tiefes Maschinenbrummen, kommt näher und zieht vorbei | B |
| `hafen` | 9 | Fallen klappern am Mast, Wasser plätschert, Möwen | `moewe.mp3` | `atmo-hafen` | A |
| `an Land` | 5 | Kajüte und Kartentisch: Holz knarzt, Wasser gluckert, Papier raschelt | `blaettern.mp3`, `bleistift.mp3`, `buch-auf.mp3` | `atmo-kajuete` | A |
| `schleuse` | 1 (G6.3, Probefolge) | Motor im Leerlauf, Wasser rauscht am Tor | `motor-lauf.mp3` | `schleusentor`: Tor bewegt sich, Wasser rauscht | B, darf in der Probe fehlen |
| `nok` | 1 (S6.5) | Schleuse Kiel-Holtenau, große Schiffsmotoren | `motor-lauf.mp3` | wie `schleuse` und `grossschiff` | – |
| `vtg` | 1 (S6.6) | Funk, ein großes Schiff | `funk-rauschen.mp3` | `funk-klick` (unten) | B |
| `fluss` | 1 (G3.2) | Strömung, ein Schubverband zieht vorbei | `wellen.mp3` | wie `grossschiff` | – |
| `watt` | 2 | Knistern und Blubbern im Schlick, Austernfischer | – | `atmo-watt` | C |
| `binnensee` | 1 (G7.1) | Schilf raschelt, Wasservögel | – | `atmo-schilf` | C |

## Einzelgeräusche (nur wo sie etwas erzählen)

| ID | Was | Wo | Schon da (`audio/`) | Prio |
|---|---|---|---|---|
| – | Motor starten und laufen | Hörspiel-Fälle | `motor-start.mp3`, `motor-lauf.mp3` | – |
| `motor-stottern` | Motor stottert und geht aus | Hörspiel-Fälle („Motor stottert“) | – | B |
| – | Ankerkette | Ankern | `anker.mp3` | – |
| – | Bordkatze Backbord, Papagei Klabauter | überall | `katze.mp3`, `katze2.mp3`, `katze3.mp3`, `schnurren.mp3`, `papagei.mp3` | – |
| `papagei-fluegel` | Flügelschlag, Klabauter landet | oft | – | B |
| – | Schritte, Tür, Klopfen | Kajüte | `schritte.mp3`, `tuer-auf.mp3`, `klopfen.mp3` | – |
| – | Gaswarner piept | G4.1 (Bootstankstelle) | `piep.mp3` | – |
| `telefon` | altes Telefon klingelt kurz, höchstens 2 s (Harms ruft an), nicht in jeder Folge | Rückblick, Fallen-Check | – | B |
| `funk-klick` | Sprechtaste am Funkgerät: Klick und kurzes Rauschen | Verkehrszentrale (S6.6), Notfall | `funk-rauschen.mp3` | B |
| `platsch` | Rettungsring oder Mensch fällt ins Wasser | Mensch über Bord (S10.2) | – | B |
| `megafon-klick` | Megafon an und aus | Wasserschutzpolizei (G1.1) | `motorboot.mp3` für die Anfahrt | C |
| `winsch` | Winsch mit Ratsche | Segeln | – | C |
| `rakete` | Leuchtrakete: Zischen, Knall | Notsignale | – | C |

Was hier nicht steht, braucht der Kurs vorerst nicht. Ideen aus der alten Liste dürfen zurückkommen, wenn eine Folge sie wirklich braucht.

**Kurz gesagt, das Wichtigste zuerst:** `kennung` (falls du einen eigenen Ton willst), `atmo-hafen`, `atmo-kajuete`. Alles andere hat einen Ersatz oder kann warten.
