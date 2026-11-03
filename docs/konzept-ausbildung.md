# Konzept „Ausbildungstörn“: Lernen zuerst (03.11.2026)

> **Status: Vorschlag zur Wahl** (R3, R16). Nichts davon gilt, bis du es bestätigst. Deine Antworten: `docs/entscheidungen.md` (O147–O154).
> **Auftrag** (Nutzer, 03.11.2026): „Wir müssen das Konzept nochmal neu denken. Die Forschung sagt ganz klar, dass es keinen Sinn macht, zu viel Story einzubauen. Wirf die Story über den Haufen … wie man es am besten strukturieren könnte, damit der Lernerfolg im Vordergrund steht.“ Dazu deine Idee: Man lernt die Crew am Boot oder in der Bar kennen. Sie sucht einen Matrosen, weil Smilla zu einem bestimmten Zeitpunkt ersetzt werden muss. Man hat keine Erfahrung, also muss man schnell die Ausbildung machen. „Lass erstmal die Charakterinfos und die Handlung weg. Überlege, wie wir mit den jetzigen Tools (Bootfahren, Fragen, Zeichen, Minispiele …) einen richtigen Ausbildungstörn oder Ausbildungsausflüge machen können.“
> **Damit ruhen:** `docs/story-konzept-3.md`, `docs/story-konzept-2.md`, `docs/story-entwurf.md`, `docs/figuren-bibel-entwurf.md` (nur noch Ideensammlung für spätere Sätze der Crew).

## 1. Deine Idee, geprüft

**Mein Urteil: gut, genau richtig dosiert.** Die Idee liefert alles, was eine Geschichte für das Lernen leisten soll, und nichts darüber hinaus:

| Was die Idee leistet | Warum das zählt |
|---|---|
| **Ein echter Grund zu lernen:** Ohne Schein kein Platz an Bord. | Erwachsene lernen besser, wenn sie wissen, wozu (Q22). Hier ist das Wozu die Prüfung selbst, nichts Erfundenes. |
| **Ein Termin, der zählt** | Wenn Smillas letzter Tag **dein eigener Prüfungstermin** ist (aus „Scheine, Termine und Lernzeit“), ist der Countdown echt. Die App rechnet den Plan ohnehin schon danach (`ziele.js`). |
| **Die Crew wird zu Ausbildern** | Lernfiguren nützen über gute Erklärungen (Q9). Sie brauchen keine eigene Handlung, nur klare Rollen. |
| **Zugehörigkeit** | „Die brauchen mich“ ist der stärkste Motivator, den Erwachsene im Online-Lernen vermissen (Q27). |
| **Kein Nebenplot** | Stofffremde Geschichten kosten Lernleistung (Q7). Der Rahmen braucht über den ganzen Kurs vielleicht zehn Minuten. |

**Eine Schärfung:** Smilla geht nicht weg, weil etwas Dramatisches passiert. Sie heuert zum Saisonende auf einem großen Schiff an (schon in der Figurenbibel angelegt). Bis dahin bildet sie dich selbst aus. So bleibt sie die ganze Zeit als Ausbilderin dabei.

**Ehrlicher Hinweis:** In Deutschland braucht ein Mitfahrer an Bord keinen Schein. Den braucht, wer das Boot führt. Der Rahmen sollte deshalb sagen: „Wir brauchen jemanden, der das Boot **führen darf**, wenn Hinnerk nicht kann.“ Dann stimmt es auch fachlich.

## 2. Was die Forschung für den Aufbau verlangt (Kurzfassung)
Belege in `docs/recherche-app-konzept.md` §3 (Q1–Q27) und `story-konzept-3.md` §2.

| Regel | Wirkung | Wo sie im Aufbau steckt |
|---|---|---|
| **Abfragen statt nur hören** | einer der stärksten Effekte (Q1) | jede Ausfahrt endet mit Fragen, jeder Tag beginnt mit Wiederholung |
| **Verteilt wiederholen** | stark, auch bei Älteren (Q2, Q24) | tägliche „Wachübergabe“ mit fälligen Fragen nach Farben |
| **Erst fragen, dann erklären** | hilft auch bei falscher Antwort (Q3) | jede Ausfahrt beginnt mit einer Vorab-Frage |
| **Teile und Begriffe zuerst** | weniger Überforderung (Q4) | Modul 1 ist das Boot selbst |
| **Gemischt üben, was man unterscheiden muss** | g ≈ 0,42 (Q21) | Lichter, Tonnen, Signale immer gemischt, in Fahrt-Lagen und in den Fragen |
| **Aktiv: aufnehmen, anwenden, prüfen, nachdenken** | am stärksten mit allen Teilen zusammen (Q23) | die sechs Schritte jeder Ausfahrt (§4) |
| **Praxis verteilt, mit den Händen** | Verteilen d ≈ 0,46 (Vision §5) | Knoten und Navigation laufen als Spirale durch alle Module |
| **Kurze Happen mit Haltepunkten** | (Q25) | Ausfahrt 25–35 Minuten, nach jedem Schritt darf man aufhören |
| **Kleine echte Wahl** | (Q26) | die Crew empfiehlt, du wählst: weiter, wiederholen oder Praxis |
| **Wenig Story** | (Q7, Adams u. a. 2012) | Rahmen nur am Anfang, zur Halbzeit und am Ende; je Ausfahrt ein Satz Anlass |

## 3. Der Aufbau in vier Ebenen

```
AUSBILDUNG (bis zu deinem Prüfungstermin)
├── Anheuern (einmal, ~15 min): Kennenlernen, Ziele, Einstufung, Ausbildungsheft
├── MODULE 1–11 (wie in einer Bootsschule)
│     ├── Ausfahrten (je 25–35 min, sechs feste Schritte)
│     └── Abnahme (10 gemischte Fragen + Praxisaufgabe → Stempel im Ausbildungsheft)
├── Jeden Tag: Wachübergabe (5 min fällige Fragen) → Empfehlung der Crew
└── Prüfungsreife: Probeprüfungen, Generalprobe Praxis, Prüfungstag
```

### 3.1 Anheuern (einmal)
1. **Am Steg oder in der Bar:** Die Crew stellt sich in drei Sätzen vor und sucht jemanden, der das Boot führen darf. „Erfahrung? Keine? Macht nix. Wir bilden dich aus.“
2. **Fragen wie heute** (Schein, Termine, Minuten am Tag, Lernort, Starter-Set). Der Theorietermin wird **Smillas letzter Tag**. Ohne Termin schlägt die Crew sechs Wochen vor.
3. **Einstufung:** 15 gemischte Fragen in drei Minuten. Wer ein Modul schon kann, bekommt dort sofort den Stempel und spart Zeit.
4. **Das Ausbildungsheft** wird ausgehändigt (siehe 3.4). Danach kommt die erste Ausfahrt.

### 3.2 Module (Reihenfolge nach Lernlogik, nicht nach Katalognummern)

| Modul | Inhalt (Themen der App) | Typische Ausfahrten | Praxis-Spirale |
|---|---|---|---|
| **1 Das Boot** | Grundbegriffe (b1, Teil) | Rundgang an Bord, erster Motorstart, mit Hinnerk ablegen | Klampe belegen, Karte lesen (N0) |
| **2 Motor und Technik** | Motor, Tanken, Technik (b4) | Motor startet nicht, Warnlampen, Tanken | Achtknoten |
| **3 Hafen und Manöver** | Umwelt, Anlegen, Bootshandling (b3) | Ablegen, Anlegen längsseits, Wenden auf engem Raum | Palstek, Rundtörn; Manöverspiel |
| **4 Zeichen am Wasser** | Tafel- und Schifffahrtszeichen (b2), Betonnung (s6) | Fahrwasserfahrt durch die Tonnen | Position ablesen (N1); Seezeichen-Kurs |
| **5 Sicherheit** | Sicherheit an Bord und Notfall (b5) | Westen, Feuerlöscher, Mensch über Bord (Übung) | Webeleinstek |
| **Abnahme Basis** | 72 Basisfragen gemischt | Smilla: „Halbzeit.“ | gilt auch für Binnen |
| **6 Regeln auf See** | Recht (s1), Ausweichen (s4), Fahrwasser und Sondervorschriften (s5) | Begegnungen, Überholen, Kreuzen im Fahrwasser | Kurs ablesen (N2) |
| **7 Lichter und Schall** | Lichter und Signalkörper (s2), Schallsignale (s3) | Nachtfahrt, Nebelfahrt mit Horn | Kreuzknoten; Lichter-Spiel |
| **8 Navigation und Gezeiten** | Navigation und Gezeiten (s8) | Kartentisch-Tage, Törnplanung mit Tide | N3–N6 |
| **9 Wetter, Seemannschaft, Umwelt** | Naturschutz, Veröffentlichungen (s7), Seemannschaft und Wetter (s9) | Hafentag bei Sturm, Wetterbericht, Ankern | Stopperstek, Schotstek |
| **10 Notfall auf See** | Sicherheit und Notsignale (s10) | Mayday, Notsignale, Hilfe leisten | alle Knoten gemischt |
| **11 Prüfungsreife** | alles | Probeprüfungen, Schwachstellen, Generalprobe | alle Manöver und Knoten mit Stoppuhr; Kartenaufgabe im Prüfungsformat |
| **Binnen B1–B4** (eigener Kurs, danach oder allein) | Binnen-Fragen 73–253, Segeln freiwillig | Kanal, Schleuse, Strom, Brücken | Binnen-Manöver |

- **Warum diese Reihenfolge:** erst das, was man anfassen kann (Boot, Motor, Hafen), dann die Zeichen, dann die Regeln, die auf Zeichen aufbauen, dann Nacht und Nebel, dann die Navigation, die alles zusammenführt.
- **Die Spirale:** Navigation und Knoten kommen in jedem Modul ein Stück weiter, nicht als Block am Ende (Vision §5).
- **Grobe Länge** (Schätzung): SBF See etwa 40 Ausfahrten à 30 Minuten plus Wiederholung und Probeprüfungen, zusammen etwa 28–32 Stunden; Binnen etwa 10–12 Ausfahrten mehr.

### 3.3 Die Ausfahrt (Herzstück, 25–35 Minuten, sechs feste Schritte)

| Schritt | Was passiert | Werkzeug von heute | Dauer |
|---|---|---|---|
| 1. **Einweisung** | ein Satz Anlass („Heute holen wir Diesel in Klüverhafen“) und **eine Vorab-Frage** zum Thema, erst raten | Reise-Bühne (Crew-Runde), `SZENE.frage` | 1–2 min |
| 2. **Kurz erklärt** | das Wichtigste mit Bild oder Animation, die Crew erklärt das Warum | Animationen (`anim.js`), Radeffekt-Grafik, Seezeichen-Karten; im Auto oder unterwegs als Hörfassung (Kajütenfunk) | 4–8 min |
| 3. **Selbst machen** | das Thema als Lage, die du lösen musst: Tonne an der richtigen Seite passieren, ausweichen, Nebelsignal geben, anlegen, Motor starten | 3D-Welt (`welt.js` mit `welt-folge.js`), Manöverspiel, Minispiele | 5–10 min |
| 4. **Praxis-Station** (nicht in jeder Ausfahrt) | Knoten mit echtem Tau oder eine Navigationsaufgabe auf der Seekarte 7 | Knotenbrett, `navi7.js` | 3–6 min |
| 5. **Abfrage** | alle Fragen des Themas, 2 × 2, dazu zwei bis drei fällige ältere gemischt | Fragen-Engine mit Farben, Vorlesen, Zuruf | 5–8 min |
| 6. **Logbuch** | ein Satz zum Mitnehmen („Rot an Backbord, wenn du reinkommst“), Stempel-Fortschritt, was morgen kommt | Logbuch, Kuchen | 1 min |

- **Haltepunkte:** Nach jedem Schritt kann man aufhören. Die App merkt sich die Stelle (wie heute in der Reise).
- **Zwei Modi wie heute:** ✋ Selbst (alles mitmachen) und 🎧 Hören (Schritt 2 und 5 vorgelesen, Schritt 3 fährt Hinnerk).
- **Hinnerks Irrtümer** („🚩 Stimmt nicht!“) nur ab Modul 3 und nur bei Stoff, den man schon hatte (Fehler finden hilft erst mit Vorwissen).

### 3.4 Das Ausbildungsheft (der Fortschritt)
- Eine Seite wie ein echter Ausbildungsnachweis: Module als Zeilen, je Modul **Theorie** (Kuchen nach Farben), **Praxis** (Knoten, Manöver, Navigation) und **Stempel** der Abnahme.
- Oben der Countdown: „Noch 23 Tage bis zu deiner Prüfung, Smillas letzter Tag.“ Darunter: „Reicht die Zeit?“ wie heute aus `ziele.js`.
- Ersetzt „Meine Prüfungen“ nicht, sondern ist dessen neue Form.

### 3.5 Jeden Tag
1. **Wachübergabe** (5 Minuten): die fälligsten Fragen nach Farben, gemischt.
2. **Empfehlung der Crew** mit Grund: nächste Ausfahrt, erst wiederholen oder Praxis. Du wählst.
3. Wer nur fünf Minuten hat, macht nur die Wachübergabe. Das zählt.

### 3.6 Abnahmen und Prüfungen
- **Modul-Abnahme:** 10 Fragen aus dem Modul und 2 ältere, dazu eine Praxisaufgabe (ein Knoten, ein Manöver oder eine Kartenaufgabe). Ab 80 % gibt es den Stempel.
  - Nicht bestanden: Die Crew empfiehlt eine Nachschulung (die roten und orangen Fragen). Du darfst trotzdem weiter. Die Crew empfiehlt, du entscheidest (Vision Grundsatz 3).
- **Zwischenprüfung Basis** nach Modul 5: Harms prüft wie in der echten Prüfung, Basisteil.
- **Prüfungsreife:** Probeprüfungen im echten Format (30 Fragen, 60 Minuten), Kartenaufgabe auf Zeit, Knoten mit Stoppuhr, alle Manöver.
- **Prüfungstag:** Smilla übergibt dir die Wache. Die App fragt nach dem Ergebnis. Bei „bestanden“ kommt der letzte Logbucheintrag, bei „nicht bestanden“ ein Plan für den zweiten Versuch.

## 4. Die Werkzeuge, die es schon gibt, und wo sie hingehören

| Werkzeug (heute) | Rolle in der Ausbildung |
|---|---|
| 3D-Welt mit Motorstart, Pinne, Anlegen, Tonnen, Nebel und Horn, Nacht, Wetter, Autopilot | Schritt 3 „Selbst machen“, vor allem Module 1–3, 4, 6, 7, 10 |
| Testfolgen-Abspieler `welt-folge.js` | Ablauf jeder 3D-Lage (Drehbuch je Ausfahrt) |
| Reise-Bühne `reise.js` (Crew-Runde, Karte, Fahrt-Szene, Logbuch, Speicherpunkt) | Rahmen der Ausfahrt: Schritte 1, 5, 6 und der Ablauf; „Tag“ heißt künftig „Ausfahrt“ |
| Fragen-Engine (Farben, fällig, Easy/Tricky, 2 × 2, Vorlesen, Zuruf) | Schritt 5, Wachübergabe, Abnahmen |
| Seezeichen-Kurs mit blinkenden Kennungen | Modul 4 und 7, Schritt 2 |
| Animationen (13) und Radeffekt-Grafik | Schritt 2 |
| Knotenbrett mit Animation und Mitsprech-Satz | Praxis-Station, Spirale |
| Navigation auf Seekarte 7 (38 Aufgaben N0–N6) | Praxis-Station, Modul 8 |
| Manöverspiel (2D) | Modul 3 und Prüfungsreife |
| Minispiele (Bauteile, Lichter, Feuer, Motorkunde) | Übung in Schritt 3 oder als Bonus, gemischt üben |
| Kajütenfunk (Hörfolgen) | Hörfassung von Schritt 2 und 5 für unterwegs |
| Harms am Telefon (Prüfung) | Zwischenprüfung, Probeprüfungen |
| „Scheine, Termine und Lernzeit“ (`ziele.js`) | Countdown, „Reicht die Zeit?“, Tagesempfehlung |
| Frei üben | bleibt immer offen |

**Was neu gebaut werden müsste** (wenig):
- Ausbildungsheft (aus „Meine Prüfungen“)
- Modul-Abnahme (aus `runQuiz` mit Mischung)
- Einstufung (aus `runQuiz`)
- Reiseplan umbauen: `data/reise-plan.json` → Module und Ausfahrten (die 63 Tage liefern das Material)
- je Ausfahrt ein kurzes 3D-Drehbuch (`data/welt-folgen.json`)

## 5. Was mit dem Bisherigen passiert
- **Reise:** Technik bleibt, Begriffe werden „Ausbildung“, „Modul“ und „Ausfahrt“ (betrifft Texte in `VISION.md`, nur nach deinem Ja, R16).
- **Story-Entwürfe und Figurenbibel:** ruhen. Die Figuren behalten ihre bestätigten Grundzüge aus `podcast/figuren.md` und feste Lehrrollen: **Hinnerk** Praxis, **Smilla** Theorie und Warum, **Klabauter** Merksatz, **Harms** Prüfung. Sprüche gibt es nur kurz am Anfang oder Ende eines Schritts, nie in der Erklärung.
- **Kajütenfunk:** wird die Hörfassung der Ausfahrten statt einer eigenen Reihe. Die Probefolge bleibt als Muster für den Ton.

## 6. Vorgehen, wenn du zustimmst
1. Modul- und Ausfahrtenplan als Daten (`data/ausbildung.json`) aus dem Reiseplan bauen, mit Kursprüfung (jede Frage kommt vor, Spirale für Knoten und Navigation, Länge je Ausfahrt).
2. Anheuern, Einstufung und Ausbildungsheft bauen.
3. Modul 1 komplett (etwa drei bis vier Ausfahrten) mit 3D-Lagen, Fragen und Logbuch, zum Testen am Handy.
4. Danach Modul für Modul.
