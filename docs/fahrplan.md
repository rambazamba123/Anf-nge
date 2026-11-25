# Fahrplan bis zur fertigen App (Stand 25.11.2026, Vorschlag von Claude)

> Gesamtbild vom Stand v5.83 bis zur Veröffentlichung. Die Vision (`VISION.md` §12, H0–H10) bleibt der Anker. Dieser Fahrplan ordnet, was davon übrig ist, und ergänzt, was sich seitdem ergeben hat (Film, Glasbühne, Baukasten, Lektorat).
> Phasen **F0–F8**. Die Zahl der Läufe ist eine grobe Schätzung, kein Versprechen. Der Nutzer entscheidet die Reihenfolge, Claude pflegt die Datei.

## Wo wir stehen (v5.83)
- **Fertig:**
  - Fragen, Lernkartei und Probeprüfung für SBF See, SBF Binnen und SKS.
  - Knoten, Manöver, Navigationsschule, Reisekarte (Platzhalter).
  - Player mit Film, Hörreise Tag 1 (5 Folgen) und Navi-Folge 1.
  - Deck und Kajüte als Glasbühne, Werft, Figuren- und Boot-Baukasten.
  - Prüfwerkzeuge und Lektorat.
- **Reiseplan:** 7 Tage, 46 Folgen (`data/reiseplan.json`). Davon sind 5 geschrieben, rund 41 fehlen.
- **Noch nicht fest:** Stil (Figuren, Oberfläche), Reisekarte, Länge der Hörtage („sieben Tage“), Stimmen.

## F0 Lauf 8: Reparieren und Aufräumen (`docs/plan-lauf8.md`) · etwa 2–3 Läufe
- Player-Regeln PL1–PL4 für jedes Aussehen. Lektorat schneller.
- Hocker und Entwurfsseiten aufräumen, Zettel weg.
- Tag 1 nachschärfen: Harms ab 1-3, Pauls Fender, Hafenkino bewegt.
- Klabauter bis 1-6 ausblenden, Hinnerk mit Walross-Schnauzer, Punktaugen.

## F1 Stil festlegen („Stil-Freeze“) · etwa 2–3 Läufe
- Eine Klickseite als **Stilbuch** mit den Figuren in guter Qualität, Kajüte, Deck, einem Menü, einer Fragekarte, Leiste unten und Kopf.
- Du entscheidest einmal. Danach steht der Stil in `docs/stil.md` (neu), und alles Weitere richtet sich danach.
- **Meinung:** der wichtigste Schritt überhaupt. Seit v5.71 haben wir rund zwölfmal am Aussehen gedreht. Ohne Festlegung müsste jede neue Folge später grafisch nachgearbeitet werden.

## F2 Fundament für die Serie · etwa 3–4 Läufe
- **Reiseplan neu** (bisher „Etappe 5“): Folgen nach Lernlast und Hörtagen (20–40 Minuten) verteilen, Frist und Titel statt „sieben Tage“.
- **Reisekarte:** einfache Karte, beim Öffnen detailliert mit Stecknadeln (O183).
- **Navi-Runde:** runder Tisch, Hände aus der richtigen Richtung, dieselbe Kartenansicht in Folgen und Navi-Schule (O186).
- **Bühnenbilder je Revier, einmal gebaut und immer wieder benutzt:**
  - Fahrwasser, Fluss mit Schleuse, Watt, Ankerbucht, Brücke, offene See.
  - Nacht und Nebel jeweils über das Licht.
- Kajüte: Smilla steht auf, Platz für Gäste (O185).

## F3 Serie: Folgen Tag 2 bis 7 · etwa 8–12 Läufe
- **Je Hörtag ein Block:** Schreiben (Opus), Werkzeuge, Lektorat je Folge gleichzeitig, dann ein **Abnahmepaket** für dich: ein Tag zum Hören mit der Gratis-Stimme, ein Zettel mit Fragen. Dann korrigieren.
- Die Navi-Folgen (Abendwache) wachsen mit, nf2 ff.
- **Meinung:** Du solltest einen ganzen Tag am Stück hören statt einzelner Folgen. So merkst du Tempo, Wiederholungen und Spannungsbogen.

## F4 Lernen ohne Geschichte in einen Stil bringen · etwa 4–6 Läufe
- Frei üben, Meine Prüfungen (nur dort die genaue Übersicht, Kuchen oder Liste), Knotenkunde, Manöver, Navigationsschule, Einstellungen.
- Alles im festgelegten Stil, mit Leiste unten. In den Fokus-Bereichen ohne Leiste.
- Generalprobe: Harms prüft wie in der echten Prüfung.

## F5 Vertonung · etwa 2–3 Läufe plus Credits
- Zuerst **eine Szene** zur Probe (Credit-Deckel 25.000), dann je Hörtag.
- App-Stimmen neu mit Eleven v4, Klabauter mit neuer Stimme (O38, etwa 25.000 Zeichen).
- Dabei gelten die Notizen zum Mund, z. B. „Mooooin“ (P9).
- **Grobe Rechnung:** 7 Minuten Folge kosten etwa 6.300 Credits Sprache. 46 Folgen wären etwa 300.000 Credits. Vorher klären, welches Abo das deckt.

## F6 Starter-Set und Box (H9) · etwa 2 Läufe
- Anlegeaufgaben mit dem Modell, Knoten am Pier, QR-Codes, Freischaltcode (AE14).
- Hängt an der Herstellung der Box (AE10–AE13).

## F7 Testgruppe und Veröffentlichung · etwa 2 Läufe
- **Vorschlag:** Sobald Tag 1–3 stehen, testen 3–5 echte Lernende (Freunde, Familie).
- Rechtliches und Lizenzen nach `docs/am-ende-klaeren.md` (AE1–AE19), Handy-Checkliste, Installieren-Knopf, eventuell APK.
- **Fachliche Endprüfung mit `quellen/`:** einmal auf deinem Rechner, weil der Ordner in der Cloud fehlt (R8).

## F8 Später
- SBF Binnen und SKS als weitere Reiseabschnitte, mit dem Mast als Meilenstein (VISION §4.4).
- Funk (SRC/UBI) und Pyro (FKN), sobald die Kataloge da sind.

## Zusammen
Etwa 25–35 Läufe bis SBF See fertig und veröffentlicht. Die größten Unsicherheiten sind die Stil-Entscheidung (F1), deine Zeit zum Hören (F3) und die Credits (F5).
