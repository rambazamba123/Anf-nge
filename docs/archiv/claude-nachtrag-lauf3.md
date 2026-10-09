# Nachtrag zu CLAUDE.md – Lauf 3 und Törn 2.0
*In CLAUDE.md einarbeiten:*
- §4 (Code-Karte) und §8 (Status) bleiben, wie Claude Code sie gepflegt hat.
- Die Abschnitte unten werden ergänzt oder ersetzt, wie jeweils angegeben.

## §5.4 Bootsansichten (ERSETZT das bisherige 5.4)
**Übersicht (herausgezoomt):**
- Das ganze Boot auf einen Blick. Man kann nicht wischen oder verschieben, Details gibt es wenige.
- Das ist das „Übermenü“: Lernfortschritt pro Schein, Einstellungen, Account- und Schlüssel-Infos, Schein wechseln.
- Ein klarer Weg „An Bord gehen“ führt in die Detailansicht, zusätzlich geht es per Antippen.

**Detailansicht (herangezoomt):**
- Ein deutlich kleinerer Ausschnitt: Man sieht praktisch nur das Deck, höchstens etwas Reling, das Meer unten nicht.
- Wischbar ist nur waagerecht, über das lange Boot.
- Die Ansicht startet zwischen Steuerrad und Kajüteneingang.
- Das Steuerrad startet den Törn (siehe 5.14).
- Alles andere ist sinnvoll über das Boot verteilt: Niedergang, Mast, Bug, Motor, Aufgaben und Easter-Eggs.

## §5.9 Begrüßungs-Moin
- Ein richtig gezogenes „MOOOOOOOOIN“: Das O soll 2 bis 3 Sekunden klingen.
- Prüfen, ob ElevenLabs lange Vokale kürzt. Wenn ja, eine Lösung finden, zum Beispiel eine andere Schreibweise, langsamere Wiedergabe nur dieses Clips oder einen eigenen Clip.
- Der Satz kommt als fester Satz ins Stimmenpaket.

## §5.10 Einführung beim ersten Öffnen
- Jede Funktion bekommt beim ersten Öffnen eine kurze Einführung durch die Crew: Navigationsschule, Törn, Spielekiste, Lexikon, Prüfung, Hocker und jeder Schein.
- Die Einführung dauert höchstens etwa 30 Sekunden, lässt sich überspringen und besteht aus festen Sätzen.
- Im Spielstand wird pro Funktion gemerkt, ob sie schon lief.
- In den Einstellungen gibt es „Einführungen erneut zeigen“.
- Die Navigationsschule kommt zuerst dran.

## §5.11 Navigationsschule prüfen und ergänzen
- **Kritisch durchgehen wie ein strenger Prüfer.** Prüfpunkte:
  - Rechnungen
  - Vorzeichen bei Missweisung und Deviation
  - Strom und Wind: „wohin“ statt „woher“
  - Ablesung am Kursdreieck
  - Distanz nur am Breitenrand
  - Bedienbarkeit am Handy

  Gefundene Fehler beheben und im Bericht auflisten.
- **Lesbarkeit:** Die Kartenbeschriftung muss auch bei kleinem Zoom lesbar sein.
- **SKS-Tiefe:** Doppelpeilung, Versegelungspeilung und eine Kartenaufgabe im SKS-Stil ergänzen.
- **Toleranz:** Die ±10° bei kleinen Besteckversetzungen bleiben vorerst.

## §5.12 Prüfer holt einen ab
- Der Zugang über die Tür passt nicht und fällt weg.
- Neu: Man bestellt Kapitän Harms per Telefon oder Funkgerät in der Kajüte. Alternativ bittet man Smilla oder den Käpt'n, ihn zu holen.
- Harms kommt kurz herein, mit Animation und einem Spruch, und holt einen zur Prüfungssimulation ab.
- Das Fernglas markiert den neuen Zugang.

## §5.13 Funk und Pyro als eigene Scheine
- **Vorbereitung:** Zuerst prüfen, was in `quellen/` liegt, zum Beispiel SRC, UBI oder FKN.
- **Jeder Schein wird ein eigener Kurs** wie SBF, SKS und Binnen:
  - Katalog und Themen
  - Lernrunden
  - Probeprüfung nach amtlicher Regel
  - Lexikon-Einträge
  - Auswahl beim Kennenlernen und unter „Schein wechseln“
- **Übungen Funk:**
  - Buchstabiertafel
  - MAYDAY-, PAN-PAN- und SÉCURITÉ-Meldungen zusammensetzen
  - Kanäle und DSC
  - englische Standardsätze, nur soweit die Unterlagen das hergeben
- **Übungen Pyro:** Signalmittel erkennen und richtig handhaben.
- **Daten:** in `data/*.json`, nur bei Bedarf laden.

## §5.14 Törn 2.0 (ERSETZT 5.6) – Konzept vom Nutzer freigegeben, Umsetzung in Lauf 4
**Problem heute:** Man schaut dem Boot beim Fahren zu, Aufgaben kommen selten. Langweilig.

**1. Törnauswahl (Steuerrad antippen)**
- Mehrere Törns zur Auswahl, **alle sofort wählbar** (keine Sperren).
- Pro Törn: Name, Schwierigkeit, Anzahl Etappen und ungefähre Dauer, empfohlene Ausrüstung, **empfohlene Scheine** (zeigt, welches Wissen nötig ist).
- Schwierigkeitsstufen: **Landratte → Leichtmatrose → Seebär → Kap-Hoornier → Klabautermann**.
- Ziel: Ein Anfänger schafft realistisch nur die leichten Törns.

**2. Start:** Bildschirm wird langsam schwarz und wieder hell, man „wacht an Bord auf“ (ab dem zweiten Mal überspringbar).

**3. Fahrt**
- Oben: Blick des Kapitäns nach vorn (Bug, Vorsegel, Horizont). Tonnen, Feuer, Schiffe, Küste tauchen auf. Tag/Nacht und Wetter sichtbar.
- Unten: Karte wie bisher.
- Anzeige: geschätzte Restzeit, aktuelles Wetter, Wetterprognose.
- **Etappen à 5–8 Minuten** mit hoher Aufgabendichte, keine Leerlaufstrecken. Lange Törns = mehrere Etappen über mehrere Tage, Spielstand zwischen den Etappen gespeichert. App schließen = Pause.
- Erste Aufgabe jedes Törns: Seewetterbericht lesen und entscheiden, ob man ausläuft. Bei Schietwetter liegen bleiben ist richtig und gibt Punkte.

**4. Aufgaben**
- **Zufällig**, aber passend zur Art der Überfahrt (Küste, Fluss, offene See, Nacht) und zum Wetter.
- **Quelle: alle Prüfungsfragen aller Scheine** (SBF See, SKS, Binnen, Funk, Pyro), zusätzlich Handlungsaufgaben.
- Mischung etwa 60 % Handlungen, 40 % Fragen. Handlungen z. B.: Ruder legen, richtiges Schallsignal tuten, Tonne antippen, Funkmeldung zusammensetzen, reffen, Motor-Checkliste.
- **Reaktionszeit hängt von der Aufgabe ab, nicht von der Stufe:** Motorausfall im Fahrwasser = sehr wenig Zeit; Schiff kreuzt am Horizont = mehr Zeit.
- Schwierigkeit steigt über: Nacht und Nebel, kombinierte Ereignisse, keine Hilfen, strengere Folgen.

**5. Wetter wechselt während des Törns** und bringt eigene Aufgaben: Flaute (Motor oder warten, Sprit), Starkwind (reffen), hoher Seegang (Kurs zur Welle, Sicherheit), Nebel (Signale, Radar), Gewitter, Böen. Wind wechselt täglich.

**6. Folgen und Ressourcen**
- Bootszustand = Leben. Schwere Fehler: Seenot, Abschleppen, Abbruch mit Verlust von Proviant und Bordkasse.
- Proviant durch Lernen, Abbruch kostet Proviant. Sprit, Crew-Laune.

**7. Ausrüstung**
- Bordkasse (durch Lernen und Törns) zum Kaufen.
- **Fundstücke:** Unterwegs sammelt man manchmal Gegenstände ein. Sie werden **am Boot verbaut** (z. B. Radarreflektor, UKW-Funk, Reffanlage, Plotter, Autopilot, Rettungsinsel) oder sind **Verbrauchsgüter** (z. B. Signalmittel, Ersatz-Impeller, Diesel, Proviant).
- Verbaute Gegenstände sind in der **langen Detailansicht des Bootes sichtbar**.
- Ausrüstung macht bestimmte Ereignisse leichter oder überhaupt lösbar.

**8. Reviere**
- Zuerst nur das eigene Revier (Kliev-Mündung, ggf. erweitert um Küste und offene See).
- **Später echte Reviere** (z. B. Ostsee, Mittelmeer Athen–Istanbul) als Pakete mit **sehr groben**, selbst gezeichneten Karten.

**9. Törn-Namen im eigenen Revier (Vorschlag, Claude Code darf ergänzen):**
- Landratte: „Einmal um die Ansteuerungstonne“, „Kaffee im Nachbarhafen“, „Fischbrötchen-Fahrt“
- Leichtmatrose: „Zum Leuchtturmwirt“, „Abendrot vor Kliev“, „Mit der Tide ins Watt“
- Seebär: „Nachtfahrt nach Süderoog“, „Quer übers Fahrwasser“, „Nebel über der Barre“
- Kap-Hoornier: „Rund um die Inseln“, „Gegen Wind und Tide“, „Drei Tage Nordsee“
- Klabautermann: „Herbststurm-Überführung“, „Die Große Runde“, „Nacht, Nebel, Nordwest 7“
- Spätere Reviere: „Bummeln nach Bornholm“, „Von Athen nach Istanbul“

## §5.15 Technik
- **Rauchtest-Skript im Repo** (`tests/smoke`):
  - klickt alle Kurse und Hauptbereiche durch
  - meldet Fehler in der Konsole
  - läuft vor jedem Commit
- **Dateigröße:** `index.html` darf nicht weiter wachsen. Neue Bereiche kommen in eigene Dateien, die bei Bedarf geladen werden, so wie `navi.js`.
- **Feste Sätze:** Eine Liste aller neuen festen Sätze pflegen. Am Ende eines Laufs erzeugt der Nutzer das Stimmenpaket einmal. Liegt eine `stimmen.zip` im Repo-Ordner, wird sie nach `audio/stimmen/` eingebaut.

## §7 Läufe (ergänzen)
- **Lauf 3 (am Stück):** 5.9 → 5.4 neu → 5.10 → 5.11 → 5.12 → 5.13 → 5.15
- **Lauf 4 (am Stück):** Törn 2.0 (5.14), Konzept ist freigegeben. Zuerst Kurzplan mit Unteretappen in docs/, dann umsetzen.

## §8 Status (ergänzen)
- [ ] 5.9 Moin
- [ ] 5.4 zwei Ansichten
- [ ] 5.10 Einführungen
- [ ] 5.11 Navi-Prüfung und SKS-Navi
- [ ] 5.12 Prüfer holt ab
- [ ] 5.13 Funk und Pyro
- [ ] 5.15 Technik
- [x] Freigabe Konzept Törn 2.0
- [ ] 5.14 Törn 2.0
