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

## Lob und Tagespensum (index.html, v4.71)
- M (Lob, alles richtig): Alles richtig! Da staunt sogar der Käpt'n.
- K (Pensum geschafft, Neues empfohlen): Pensum geschafft. Wenn du noch Lust hast, nimm ruhig was Neues dazu.
- K (Pensum geschafft, Festigen empfohlen): Für heute hast du dein Pensum geschafft. Wenn du noch Lust hast, festigen wir, was noch wackelt.

Alle Sätze kommen über Einstellungen → Stimmenpaket → „🎙️ Neue Sätze nachliefern“ ins Paket.

## Geplant: neckende Anreden (Kajütenfunk V33 und App, noch nicht im Code)

Vom Nutzer am 20.10.2026 beschlossen (`PODCAST_STATUS.md` B54, B55). Alle Anreden sind geschlechtsneutral. Das Audio wird einmal erzeugt und im Podcast und bei anderen Gelegenheiten in der App verwendet. Die genaue Satzform (z. B. „Hey, Landratte!“) wird beim Einbau festgelegt.

| Figur | Anrede | Status |
|---|---|---|
| alle | Hey du! | beschlossen |
| Käpt'n | Landratte | beschlossen |
| Käpt'n | Schietbüdel | beschlossen |
| Käpt'n | Dösbaddel | beschlossen |
| Käpt'n | Kielschwein | beschlossen |
| Matrosin | Frischling | beschlossen |
| Matrosin | Landei | beschlossen |
| Matrosin | Seegurke | beschlossen |
| Matrosin | Bordküken | beschlossen |
| Bordtier | Grünschnabel! Grünschnabel! | beschlossen |
| Bordtier | „Nesthocker! Nesthocker!“ und „Federlos! Federlos!“ | beschlossen (B67) |

## v4.82 – V38 Smilla treibt an (nach der Wiederholung der eigenen Fehler)

Im Code: `LINES.smilla.treiben`, `LINES.smilla.treibenNoch`, `LINES.klabauter.nachsitzen`. Sie kommen nur, wenn in einer Lernrunde falsche Fragen am Ende noch einmal drankamen. In anderen Runden bleibt das bisherige Lob (`praise`). Fehlen im Stimmenpaket: über „🎙️ Neue Sätze nachliefern“ erzeugen.

| Anlass | Figur | Satz |
|---|---|---|
| alles korrigiert | Smilla | Na also, Seegurke. Geht doch. Aber dass du zwei Anläufe brauchst, schreib ich mir auf. |
| alles korrigiert | Smilla | Jetzt sitzt es. Morgen will ich das ohne Nachsitzen sehen, du Badewannen-Kapitän. |
| alles korrigiert | Smilla | Nicht schlecht für ein Landei. Aber nicht schlecht besteht keine Prüfung. |
| alles korrigiert | Smilla | Na, Planktonhirn, hat's geklickt? Dann halt es auch über Nacht fest. |
| noch Fehler | Smilla | Immer noch daneben. Das ist kein Segeln, das ist Treibenlassen. Nochmal! |
| noch Fehler | Smilla | Hafenbecken-Admiral! Fehler wiederholen ist Pflicht, nicht Kür. Weiter! |
| noch Fehler | Smilla | Du segelst wie eine Bilgenratte im Waschgang. Konzentrier dich! |
| noch Fehler | Smilla | So kommst du nicht mal aus dem Hafen, Bordküken. Noch eine Runde. |
| danach (etwa jedes dritte Mal) | Klabauter | Nachsitzen! Nachsitzen! |
| danach | Klabauter | Landei! Landei! |
| danach | Klabauter | Zwieback erst morgen! Morgen! |
| danach | Klabauter | Nochmal! Nochmal! |

## v4.84 – V39 Einweisung im Manöverspiel (Vorlesen)

Der Knopf „🔊 Vorlesen“ in der Einweisung lässt den Käpt'n die Aufgabe (`ziel`) und Kapitän Harms die Prüfpunkte (`pruefer`) sprechen. Die Texte stehen in `data/manoever.json` und werden nicht doppelt gepflegt. `packLines` sammelt sie, sobald das Manöverspiel geladen ist: 6 Aufgaben und 29 Prüfpunkte, zusammen etwa 1834 Zeichen. Sie fehlen noch im Stimmenpaket.

## v4.90 – V42 Scheine, Termine, Lernzeit

Die Crew kommentiert die Wahl in „🎯 Scheine und Termine“ und im Kennenlernen. Die Bausteine stehen in `data/ziele.json` und setzen sich je nach Lage zusammen (`ziele.js`, `kommentar`). Sie sind im Stimmenpaket (`packLines`) und fehlen dort noch, bis sie nachgeliefert werden.

| Wann | Wer | Satz |
|---|---|---|
| Kommentar 15 Minuten | Hinnerk | Eine Viertelstunde. Kurz, aber jeden Tag. Dat geiht. |
| Kommentar 15 Minuten | Smilla | Eine Viertelstunde? Sportlich. Dann aber wirklich jeden Tag, keine Ausreden. |
| Kommentar 30 Minuten | Hinnerk | Eine halbe Stunde am Tag. Damit kommst du gut vorwärts. |
| Kommentar 30 Minuten | Smilla | Halbe Stunde. Das ist ein ehrliches Pensum. Gefällt mir. |
| Kommentar 45 Minuten | Hinnerk | Dreiviertelstunde. Da hat jemand Wind in den Segeln. |
| Kommentar 45 Minuten | Smilla | Dreiviertelstunde am Tag. Damit schaffst du richtig was. |
| Kommentar 60 Minuten | Hinnerk | Eine Stunde am Tag. Respekt. Halt das mal durch. |
| Kommentar 60 Minuten | Smilla | Eine ganze Stunde? Dann machen wir richtig Strecke. |
| Kommentar 90 Minuten | Hinnerk | Anderthalb Stunden. Du willst es wissen, wa? |
| Kommentar 90 Minuten | Smilla | Anderthalb Stunden am Tag. Pass auf, dass dein Kopf nicht überläuft. Pausen gehören dazu. |
| So lernst du, 15 Minuten | Smilla | So lernst du: jeden Tag ein kurzer Happen. Mal eine Folge Kajütenfunk, mal ein Block Fragen. Wiederholen geht immer vor. |
| So lernst du, 30 Minuten | Smilla | So lernst du: eine Folge Kajütenfunk mit Fragerunde, dazu ein Block Wiederholen. Das ist dein Kurs für heute. |
| So lernst du, 45 Minuten | Smilla | So lernst du: eine Folge mit Fragerunde, ein Block Wiederholen und ein Happen Praxis. Knoten, Manöver oder Seekarte. |
| So lernst du, 60 Minuten | Smilla | So lernst du: zwei Folgen oder eine Folge und Praxis, dazu Wiederholen. Vor der Prüfung kommen Probeprüfungen bei Harms dazu. |
| So lernst du, 90 Minuten | Smilla | So lernst du: Folgen, Wiederholen, Praxis und Navigation an jedem Tag. Und regelmäßig eine Probeprüfung bei Harms. |
| mehrere Scheine | Smilla | Mehrere Scheine auf einmal? Gut. Die Basisfragen gelten für See und Binnen, die lernst du nur einmal. Wir fangen mit dem Schein an, dessen Prüfung zuerst kommt. |
| reicht es: ok | Hinnerk | Reicht dicke. Du hast sogar Luft für Probeprüfungen. |
| reicht es: ok | Smilla | Das reicht locker. Wenn du dranbleibst, gehst du entspannt in die Prüfung. |
| reicht es: knapp | Smilla | Das wird knapp. Machbar, aber nur, wenn du keinen Tag auslässt. |
| reicht es: knapp | Hinnerk | Knapp. Wie Anlegen bei Seitenwind. Geht, aber nur mit Konzentration. |
| reicht es: nein | Smilla | Ehrlich gesagt: Das reicht nicht. Mit dieser Zeit schaffst du nicht alles bis zur Prüfung. |
| reicht es: nein | Hinnerk | Dat langt nich. Da müssen wir was ändern. |
| reicht es: offen | Smilla | Noch kein Termin? Auch gut. Dann lernen wir in Ruhe. Sobald du einen Termin hast, trägst du ihn ein, und ich rechne nach. |
| Empfehlung: mehrZeit | Smilla | Mein Tipp: Nimm eine Viertelstunde am Tag dazu. Das macht am Ende den Unterschied. |
| Empfehlung: auto | Hinnerk | Oder hör den Kajütenfunk unterwegs. Im Auto oder beim Spazierengehen zählt jede Folge mit. |
| Empfehlung: wackel | Smilla | Und kurz vor der Prüfung nur noch deine Wackelkandidaten. Rot und Orange zuerst. |
| Empfehlung: termin | Smilla | Wenn es geht, schieb den Termin ein paar Wochen nach hinten. Lieber einmal bestehen als zweimal hingehen. |
| Praxis: bald | Hinnerk | Die Praxisprüfung kommt bald. Dann nehmen wir Knoten und Manöver jeden Tag mit dazu. |
| Praxis: offen | Hinnerk | Für die Praxis hast du noch keinen Termin. Kein Problem, Knoten üben wir trotzdem nebenbei. |
| Abschluss | Klabauter | Leinen los! Leinen los! |
| Abschluss | Klabauter | Kurs steht! Kurs steht! |

## Neu in v4.97–v4.99 (Vision H3 und H5, Platzhalter)
Die Sätze der Probe-Etappe (`data/reise.json` → `etappen[].szenen`) und von Rundgang 1 (`data/reise.json` → `rundgang1`) sind **Platzhalter**. Sie werden mit Story und Figuren neu geschrieben (B164, H10) und laufen bis dahin mit der Gratis-Stimme (Art `local`, nicht im Stimmenpaket).
Neue feste Sätze im Kennenlernen (`ONB` in `index.html`, kommen ins Stimmenpaket):
- Smilla: „Wo lernst du meistens? Zu Hause, unterwegs oder im Auto, wo du nur zuhören kannst?“
- Käpt'n: „Hast du ein Übungsset mit Leinen und Übungskarte? Dann binden wir die Knoten mit echtem Tau.“
