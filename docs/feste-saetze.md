# Feste Sätze fürs Stimmenpaket (Törn 2.0)

Stand v4.34 · Quelle: `data/ereignisse.json` → `crew`. Alle Sätze ohne Namen, damit sie für jede Crew passen (CLAUDE.md §2). Die App sammelt sie über `packLines` (`TOERN.LINES`), sobald der Törn einmal geladen war.

| Anlass | Rolle | Satz |
|---|---|---|
| wahrschau | Matrose/Matrosin | Wahrschau! Da vorn! |
| wahrschau | Käpt'n | Wahrschau! Augen auf! |
| wahrschau | Bordtier | Wahrschau! Wahrschau! |
| gut | Käpt'n | Sauber gemacht. So fährt ein Skipper. |
| gut | Matrose/Matrosin | Na bitte, geht doch! |
| gut | Bordtier | Richtig! Richtig! |
| schlecht | Käpt'n | Das war nix. Merk dir das. |
| schlecht | Matrose/Matrosin | Autsch. Das gibt Schrammen. |
| schlecht | Bordtier | Falsch! Falsch! |
| spaet | Käpt'n | Zu spät! Auf See wartet keiner. |
| spaet | Matrose/Matrosin | Hallo? Schläfst du am Ruder? |
| aufwachen | Käpt'n | Moin! Aufstehen, die Tide wartet nicht. |
| aufwachen | Matrose/Matrosin | Kaffee ist fertig. Ab an Deck. |
| ankunft | Käpt'n | Fest! Leinen sind belegt. Gut gemacht. |
| ankunft | Bordtier | Fest! Fest! |
| seenot | Käpt'n | Das war zu viel. Wir brauchen Hilfe. |
| seenot | Matrose/Matrosin | Und ich hab doch gesagt, wir hätten im Hafen bleiben sollen. |
| liegen | Käpt'n | Richtig. Bei dem Wetter bleibt ein guter Skipper im Hafen. |
| liegen | Matrose/Matrosin | Dann eben Karten spielen. |
| zuvorsichtig | Matrose/Matrosin | Bei dem Wetter im Hafen bleiben? Da segeln sogar die Möwen. |

Weitere Sprechtexte im Törn (Aufgaben, Seewetterbericht, Erklärungen) werden nicht vorgelesen. Sie wechseln je nach Lage und wären als feste Sätze zu viele.

## v4.38 – 5.10 Einführungen beim ersten Öffnen
Alle Sätze stehen in `data/einfuehrungen.json` (Kartentisch, Törn, Spielekiste, Lexikon, Probeprüfung, Hocker, SBF See, SKS, SBF Binnen) und werden von `packLines` mitgenommen. Neu ist außerdem das gezogene „Mooooooooin!“ (5.9, v4.37).

## v4.39 – 5.11 SKS-Stufe am Kartentisch
Neue Crew-Sätze der Lektionen L10 „SKS: Peilverfahren“ und L11 „SKS: Kartenaufgabe“ in `data/navi.json` (je 4 Sätze, über `packLines` erfasst).

## v4.40 – 5.12 Kapitän Harms holt ab
In `HARMS` (index.html): drei Sprüche für Kapitän Harms (`kroeger`) und je ein Satz für Käpt'n und Matrose/Matrosin, wenn sie ihn holen.

## v4.44 – V3 Ton ab 12
Geändert: Smilla „Berg- und Talfahrt … Achterbahn, ist aber nur der Rhein.“, „Der Tee ist heiß, der Käpt'n grantig …“, „Wie Seepocken am Rumpf …“; Hinnerk „Wie beim heißen Tee: Wer kippt, verbrennt sich das Maul.“; Folge Helgoland „Und einkaufen ist dort zollfrei …“. KI-Leitplanke `TONE.erw` auf „ab 12, derb, keine Anzüglichkeiten“.

## v4.45 – V4 Moin-Bausteine
`MOIN_BAU` (index.html): Hinnerk 8, Smilla 5, Klabauter 4 Varianten, dazu `MOIN_WEG` (2 Sätze nach längerer Abwesenheit). Die Kette `moinKette` setzt sie zufällig zusammen.

## v4.46 – V5 Schein-Einführung
`data/einfuehrungen.json`: `schein_sbf` (7 Sätze), `schein_sks` (6), `schein_binnen` (7). Zahlen aus den Prüfungsregeln im Code (`COURSES[...].exam`).

## v4.47 – V2 Bordkatze
Keine neuen Sätze (die Katze ist stumm).

## v4.54 – V12 Knoten
`data/einfuehrungen.json` → `knoten` (3 Sätze: Käpt'n, Matrosin, Papagei).

## Manöverspiel (v4.66)
Alle Sätze stehen in `data/manoever.json` (Vorführungen `demo[].sag`/`cmd`, Kommandos `richtig`/`warum`) und dazu drei Prüfer-Sätze in `manoever.js` („Ausreichend. Weiter.“, „Nicht ausreichend. Zweiter Versuch.“, „Nicht ausreichend. Das üben wir noch mal.“). `packLines` nimmt sie auf, sobald `buildVoicePack` die Daten geladen hat. Sätze mit Platzhaltern (`{kurs}`, `{peil}`) sind wechselnd und kommen nicht ins Paket. Bis zur Nachlieferung spricht die Handystimme.

## V26 Grundkurs Seezeichen (data/seezeichen.json, v4.69)

### Grundkurs Seezeichen
- K: Seezeichen sind die Verkehrsschilder auf dem Wasser. Wer sie nicht lesen kann, fährt irgendwann auf Grund.
- M: Keine Panik, das ist ein System. Wer das einmal kapiert hat, liest jede Tonne.
- T: Tonne! Tonne!
- K (Fahrwasser: Grün und Rot): Gedacht wird immer von See kommend, also in den Hafen hinein.
- M (Fahrwasser: Grün und Rot): Dann liegt Grün an Steuerbord, also rechts, und Rot an Backbord, links.
- K (Kardinalzeichen: die Himmelsrichtung): Kardinalzeichen sagen dir, auf welcher Seite der Gefahr das sichere Wasser liegt.
- M (Kardinalzeichen: die Himmelsrichtung): Die Nordtonne liegt nördlich der Gefahr. Also fährst du nördlich an ihr vorbei.
- T (Kardinalzeichen: die Himmelsrichtung): Norden! Norden!
- K (Einzelgefahr, Mitte und Sperrgebiet): Zwei schwarze Bälle heißt: Hier liegt eine einzelne Gefahr, rundherum ist Wasser.
- M (Einzelgefahr, Mitte und Sperrgebiet): Rot und weiß senkrecht gestreift ist das Gegenteil: Hier ist die Mitte, hier ist es sicher.
- K (Leuchtfeuer und Kennungen): Nachts siehst du keine Farben an der Tonne, nur ihr Licht. Darum hat jedes Feuer seinen eigenen Takt.
- T (Leuchtfeuer und Kennungen): Blink! Blink!

### Grundkurs Zeichen Binnen
- K: Auf Flüssen und Kanälen gelten eigene Zeichen. Das Prinzip ist ähnlich, aber die Blickrichtung ist eine andere.
- M: Hier zählt nicht von See kommend, sondern von der Quelle zur Mündung.
- K (Ufer, Fahrwasser und Fahrrinne): Rechts und links zählen auf Flüssen immer von der Quelle zur Mündung, also talwärts.
- M (Ufer, Fahrwasser und Fahrrinne): Bergfahrt heißt gegen den Strom, Richtung Quelle.
- K (Tonnen und Schwimmstangen): Rot begrenzt die Fahrrinne zum rechten Ufer, Grün zum linken. Talwärts gedacht.
- T (Tonnen und Schwimmstangen): Talwärts! Talwärts!
- K (Wasserstände und Ankern): Bei Hochwasser ist schnell Schluss mit Fahren. Achte auf die Hochwassermarken.

## V26 Navigationsschule Lektion 0 (data/navi.json, v4.70)
- K: Bevor wir rechnen, klären wir die Grundlagen. Ohne die hilft dir das schönste Kursdreieck nichts.
- K: Kurse zählen in Grad, rechts herum von Nord: 0 Grad ist Nord, 90 Ost, 180 Süd, 270 West.
- M: Und eine Minute Breite ist genau eine Seemeile. Darum misst du Distanzen immer am Breitenrand, links oder rechts.
- T: Eine Minute, eine Meile! Eine Minute, eine Meile!

Alle Sätze kommen über Einstellungen → Stimmenpaket → „🎙️ Neue Sätze nachliefern“ ins Paket.
