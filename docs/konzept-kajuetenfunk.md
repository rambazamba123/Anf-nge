# Kajütenfunk – der Hörkurs zum Sportbootführerschein

**Finales Konzept, Fassung 5** · Stand: 23.10.2026 · Status: deine Korrekturen vom 23.10.2026 sind eingearbeitet; wartet auf deinen Startschuss für die Probefolge (§21)

> **Wozu diese Datei:** Sie beschreibt den ganzen Hörkurs so genau, dass danach jede Folge geschrieben werden kann. Wer eine Folge schreibt, liest zuerst den Bauplan (§7), den Rahmen der Folge (§6.2), den Steckbrief der Folge (§14), die Figuren (`podcast/figuren.md`) und die Vorlage (`podcast/folgen/VORLAGE.md`).
>
> **Was dazugehört:**
> - Kursplan als Daten: `podcast/kursplan-sbf.json` (Teile, Kapitel, Folgen, Fragen, Schwerpunkte, Rahmen, Lage, Bausteine, Gäste, Reviere, Animationen, Recherche)
> - Recherche-Dossier: `docs/recherche-kajuetenfunk.md` (R1–R64 mit Quelle und Güte)
> - Figuren: `podcast/figuren.md` (von dir am 23.10.2026 bestätigt, mit deinen Korrekturen zu Quirin), Wortschatz: `podcast/wortschatz.md` (mit doppeldeutigen Seemannsbegriffen)
> - Merksätze: zu jeder SBF-See-Frage einer, in `data/karten-sbf.json` (Feld `m`), in der App und im Kurs derselbe
> - alle Fragen je Folge mit allen vier amtlichen Antworten und dem Merksatz: `docs/kurs-fragen-sbf.md`
> - Prüfwerkzeuge: `tools/kursplan-pruefen.js` (Kursplan) und `tools/podcast-pruefen.js` (Skripte)
>
> **Erzeugte Abschnitte:** §4.3, §11.2, §13 und §14 kommen aus dem Kursplan (`node tools/kursplan-pruefen.js --konzept`). Sie werden nicht von Hand geändert, sondern über die JSON-Datei.
>
> **Regelwerk:** `PODCAST_BIBLE.md` und `PODCAST_STATUS.md` sind an deine Entscheidungen vom 23.10.2026 angepasst (Bible dritte Fassung, Entwurf). Mit deinem Startschuss gilt sie ganz (K1). Was sich gegenüber der Bible ändert, steht in §2.3.
>
> **Vorgänger:** Fassung 3 liegt in `docs/archiv/konzept-kajuetenfunk-fassung3.md`, Fassung 4 in der Versionsgeschichte, die Geschichte in `podcast/archiv/`. Was aus Fassung 3 wurde, zeigt Anhang F, was sich in Fassung 5 geändert hat, Anhang G.

## Inhalt

0. Das Wichtigste auf einer Seite
1. Ziel, Versprechen und Grenzen
2. Alle Vorgaben auf einen Blick
3. Gesamtaufbau
4. Länge: warum etwa 14 Stunden
5. Didaktik: wie der Kurs lehrt
6. Folgenformen und Rahmen: Abwechslung statt Schema
7. Bauplan einer Folge
8. Baukasten, Gäste und Harms
9. Figuren, Sprache und Humor
10. Hören und Sehen: Auto-Modus und interaktiver Modus
11. Animationen
12. Lernkreislauf mit der App
13. Kursplan (erzeugt)
14. Folgen-Steckbriefe (erzeugt)
15. Recherche, Fakten und Fallen
16. Herstellung und Qualitätssicherung
17. Technik
18. Umfang und Kosten
19. Ausblick: Teil B (Binnen) und später
20. Fahrplan
21. Offene Punkte und deine Entscheidungen

Anhang A: Skriptform · Anhang B: Ablaufplan G3.1 · Anhang C: Ablaufplan S2.2 · Anhang D: Ablaufplan S3.1 · Anhang E: Quellen · Anhang F: Was aus Fassung 3 wurde · Anhang G: Was sich in Fassung 5 geändert hat · Anhang H: Plan der Probefolge

---

## 0. Das Wichtigste auf einer Seite

- **Was:** Ein Theoriekurs zum Hören für den Sportbootführerschein, „wirklich wie guter Unterricht“. Die Crew ist dein Coaching-Team:
  - Smilla erklärt,
  - Hinnerk bringt die Praxis,
  - Klabauter liefert die Merksätze,
  - Harms prüft,
  - Quirin, der Binnen-Profi aus Bayern, kommt in Teil G und S zweimal zu Besuch und ist in Teil B dabei.

  Es gibt keine durchgehende Geschichte. Jede Folge ist aber ein kleines Hörspiel an einem echten Ort, mit eigenem **Rahmen**: Hörspiel-Fall, Törn mit Stationen, Unterricht, Garn-Abend, Duell oder Besuch. So läuft keine Folge nach Schema F (§6).
- **Umfang:** 60 Folgen, zusammen knapp 14 Stunden.
  - **Teil G Grundkurs:** 16 Folgen, 3 h 38 min, die 72 Basisfragen. Gilt für SBF See und SBF Binnen.
  - **Teil S See:** 44 Folgen, 10 h 21 min, die 213 See-Fragen, dazu Praxis und Prüfungsreife.
  - **Teil B Binnen:** kommt später, grob 35 Folgen und 8 Stunden.
- **Eine Folge:** 12–15 Minuten, aufgeteilt in drei bis vier Abschnitte von 3–5 Minuten.
  - **Pflicht ist nur, was das Lernen sichert:** hörbares Revier, jede Frage mit Katalogsatz, Abruf aus früheren Folgen, echte Fallen, Kernsätze am Ende. Wie und in welcher Reihenfolge, bestimmt der Rahmen.
  - Der **Kern** in einer von zwei Formen: „System zuerst“ (erst das Prinzip, dann gebündelt die Fragen) oder „Regel für Regel“.
  - Dazu **ein Baustein** aus sieben: Garn, Stichprobe, Fehler-Detektiv, Ton-Labor, Gast, Streitgespräch, Kopfkino.
- **Jede der 285 Fragen** steht in genau einer Folge und wird dort mit dem amtlichen Antwortsatz behandelt. Knapp die Hälfte (131) wird ausführlich erklärt, der Rest kurz mitgenommen.
- **Merksätze:** Zu jeder der 285 Fragen gibt es einen Merksatz, in der App und im Kurs derselbe (§5.6).
- **Zwei Modi, eine Tonspur:**
  - Im **Auto-Modus** läuft alles durch, auch mit ausgeschaltetem Bildschirm. Denkpausen sind kurz (3–6 Sekunden), danach kommt immer die Lösung.
  - Im **interaktiven Modus** hält die App an den Entscheidungsfragen an und zeigt Antwortknöpfe, Bilder und später Animationen. Die Antworten zählen in der Statistik. Wer falsch antwortet, hört eine Vertiefung.
- **Nach jeder Folge** liest Harms die Fragen der Folge im amtlichen Wortlaut vor (Fragerunde). Antworten per Tippen oder per Zuruf mit den Funkwörtern Alfa bis Delta.
- **Zu jeder Frage gibt es eine Hörkarte** (20–25 Sekunden). Daraus entstehen die persönliche Nachhilfe-Folge und eine Schnellspur von etwa zwei Stunden.
- **Das Revier hört man:** Jede Szene sagt, wo man ist (freie See, Fahrwasser, Hafen …), und klingt auch so. Die Regel passt immer zum Revier.
- **Animationen:** 28 Themen, 13 davon mit Vorrang, zum Beispiel „Begegnung von oben“, „Lichterkarussell“ und „Kardinalzeichen als Uhr“.
- **Qualität:**
  - Prüfungsstoff nur aus dem Katalog, Praxis und Anekdoten aus der Recherche mit Quellen.
  - Zwei Prüfwerkzeuge.
  - Erst verfeinern wir selbst, dann liest jemand gegen (K2).
- **Kosten:** etwa 910.000 Zeichen bei ElevenLabs (mit Vertiefungen), mit Puffer 1,2 bis 1,45 Millionen. Audio etwa 560 MB bei 64 kbit/s.
- **Nächste Schritte:**
  1. dein Startschuss (K1),
  2. die Probefolge: ein Ausschnitt vom Anfang der Folge G6.3 (Vorschlag), etwa 7 Minuten, höchstens etwa 6.000 Credits, anklickbar über den Hocker in der Kajüte (Anhang H),
  3. du hörst, wir verfeinern Konzept, Vorlage und Figuren,
  4. Teil G schreiben.

---

## 1. Ziel, Versprechen und Grenzen

### 1.1 Ziel

Deine Vorgaben:
- „Ein perfekter Theoriekurs zum Hören: smooth, lehrreich, didaktisch top, mit guter Heranführung.“ (V41, 22.10.2026)
- „Es soll ja wirklich wie guter Unterricht sein. Mit dem gesamten Wissen aus der Recherche.“ (23.10.2026)
- Die drei sind dein persönliches Coaching-Team und bringen dich so schnell wie möglich und mit Humor durch die Prüfung (CLAUDE.md §1).

Daraus folgt: Wer den Kurs hört und die Fragerunden macht, soll
1. jede der 285 Katalogfragen sicher beantworten,
2. verstehen, warum die Antwort so ist (dann hält das Wissen auch unter Prüfungsdruck),
3. die typischen Fallen kennen,
4. wissen, was eine Regel an Bord bedeutet,
5. vorbereitet sein auf die praktische Prüfung und die Kartenaufgabe (geübt wird in der App).

### 1.2 Das Versprechen an den Hörer

So sagt es die Crew in G0, und so steht es in der App:
> „Hör zu, denk mit, antworte laut. Du musst nichts auswendig pauken, was du nicht verstanden hast. Nach jeder Folge fragt Harms nach, und die App merkt sich, was noch wackelt.“

### 1.3 Grenzen (immer ehrlich sagen)

- Der Kurs ersetzt keine praktische Ausbildung auf dem Wasser. Der Haftungsausschluss steht seit v4.88 in „Über die App“ und im Impressum (O17, entschieden am 23.10.2026): Man lernt hier nicht sicher alles richtig, man soll sich zusätzlich in den amtlichen Veröffentlichungen belesen, und die Haftung ist ausgeschlossen, soweit das Gesetz es erlaubt.
- Die Kartenaufgabe wird erklärt (S7.3). Geübt wird sie in der Navigationsschule der App.
- Knoten und Manöver werden erklärt (S10). Geübt wird im Knotenbrett, mit echtem Tau und im Manöverspiel.
- Prüfungsinhalte kommen nur aus dem amtlichen Katalog (R8). Praxis und Anekdoten sind Ergänzung und haben eine Quelle (§15).
- Die Karte der App ist erfunden und nicht zur Navigation gedacht.

### 1.4 Für wen

- **Alter:** ab 12 Jahren (E1).
- **Vorwissen:** keines. Jedes Fachwort wird beim ersten Auftreten erklärt.
- **Wo:** Gelernt wird in der App (K7). Der Kurs ist zum Hören gemacht:
  - Auto-Modus für unterwegs (Kopfhörer, Bluetooth im Auto),
  - interaktiver Modus am Handy.
- **Reihenfolge der Scheine:** Teil G gilt für alle. Danach kommen die Teile für deine Scheine, in der Reihenfolge deiner Prüfungstermine (§3.5). Teil B (Binnen) entsteht nach Teil S (K5, K9).

---

## 2. Alle Vorgaben auf einen Blick

### 2.1 Deine Entscheidungen

| Nr. | Entscheidung | Datum | wo im Konzept |
|---|---|---|---|
| E12 | Kajütenfunk als Coaching, keine durchgehende Geschichte, Gäste möglich (nicht alle) | 22.10. | §1, §8 |
| V41 | Jedes Thema beginnt mit einem Überblick. Die aufeinander aufbauende Reihenfolge des Stoffplans bleibt. Die Nachhilfe-Folge aus den eigenen Wackelkandidaten kommt dazu, ohne dass die Folgen abgehackt wirken. | 22.10. | §3, §7.3, §12.4 |
| K2 | Erst verfeinern wir selbst, dann liest jemand gegen. | 22./23.10. | §16.4 |
| K3 | So viele Zeichen wie nötig, auch über mehrere Sitzungen. | 22./23.10. | §18 |
| K4 | Audio erst im Repo und in der App, getestet nur von dir. Server oder Cloud vielleicht später. | 22./23.10. | §17.4 |
| K5, K9 | Drei Blöcke: Grundkurs (Basisfragen 1–72), See, später Binnen (mit Quirin). | 22./23.10. | §3 |
| K6 | Jetzt kein Hörtest. Die Probe besteht aus Skripten zum Lesen. | 22./23.10. | §20 |
| K7 | Gelernt wird nur in der App, gemacht zum Hören, mit Auto-Modus und interaktivem Modus. | 22./23.10. | §10, §12 |
| K8 | Die Geschichte kommt ins Archiv (Leitfaden, Folge 1, Vorgeschmack, Frieda, Jonte). | 22./23.10. | erledigt, `podcast/archiv/` |
| K10 | Im interaktiven Modus hält die App an den Entscheidungs-Denkpausen an und zeigt Antwortknöpfe. | 23.10. | §10.2 |
| K11 | Die Figuren schlägt Claude vor. Hinnerk mit stärkerem Dialekt, Smilla mit weniger und einem anderen. | 23.10. | §9, `podcast/figuren.md` |
| K12 | Quirin sehr bayerisch. | 23.10. | §9 |
| – | Nicht jede Frage im Detail erklären. Manchmal erst alle Grundlagen, dann gebündelt zu den Fragen. | 22.10. | §5.3, §6 |
| – | Das Revier muss aus dem Audio kommen. Es bleibt ein Hörspiel, nur konzentriert auf den Stoff. | 22.10. | §10.3 |
| – | Im interaktiven Modus Bilder und Animationen. Die Themen schlägt Claude vor. | 22.10. | §11 |
| – | Denkpausen und die Rangerin sind gut. | 22.10. | §5.4, §8.2 |
| – | Vor dem ersten Skript in guten Quellen recherchieren: Praxis, wichtige Punkte, Anekdoten. | 22.10. | §15, Dossier |
| – | Figuren: „Passt alles so.“ Aber Smilla ist nicht vom Meer: Sie kommt von einem großen Fluss, hat sich alles selbst angeeignet und davon geträumt, von dort aufs Meer zu fahren. | 23.10. | §9, `podcast/figuren.md` |
| – | Die Stimmen überarbeitest du selbst. Das Bairische prüft ein Bekannter von dir. | 23.10. | §16.4 |
| – | Sechs Stunden sind zu wenig, es soll „wirklich wie guter Unterricht“ sein. | 23.10. | §4 |
| – | Auch im Auto-Modus gibt es Denkpausen, nicht zu lang, danach wird die Lösung gesagt. Im interaktiven Modus wird tiefer erklärt, wenn man falsch antwortet. | 23.10. | §5.4, §10.2 |
| – (X8) | Die Antworten zählen wie Fragen in der Statistik. | 23.10. | §10.2, §12.6 |
| – | Szenarien dürfen beschrieben werden (Motorproblem, Segeln, Ausweichen, die Crew diskutiert); wie ein Hörspiel, wo es passt. | 23.10. | §6.2, §10.3 |
| – | Nicht monoton nach demselben Schema, sondern abwechslungsreich und zu den Fragen passend: Themen gebündelt, mal mehr Vorgeschichte, Fragen zusammengefasst, Anekdoten der Crew. | 23.10. | §6, §7, §9.6 |
| – | Quirin irrt nicht immer: Auf den Binnengewässern ist er „super Profi“. Er kommt nur für die Binnenfragen dazu und ein- oder zweimal davor zu Besuch. | 23.10. | §9, `podcast/figuren.md` |
| – | Merkhilfen ausbauen: wirklich passend, sinnvoll und mehr; Wissen aus Literatur und Internet; Merksätze für jede Frage, auch für die App. | 23.10. | §5.6, `data/karten-sbf.json` |
| – | Ton: derb aus der Bible plus die Sprüche aus der Seemannssprache; seemännische Begriffe auf Doppeldeutigkeit prüfen und den Figuren zuweisen. | 23.10. | §9.5, `podcast/wortschatz.md` §11 |
| – (X3, X4) | Komplett gestrichen: „keine Gruppenbeleidigung“, „keine Witze über Bayern“, „kein Alkohol als Witz über Kinder“. | 23.10. | §9.5 |
| – (§3.5) | Am Anfang (in den Einstellungen änderbar) wählt man den Schein oder die Scheine, ihre Termine (Theorie und Praxis, Binnen und See, getrennt) und die tägliche Lernzeit. Danach richten sich Kurs und Empfehlung. | 23.10. | §3.5 |
| – (P30) | Der Chiemsee ist keine Schifffahrtsstraße, also eher die Donau. Gern ein Bayer für Binnen, andere Vorschläge sind auch gut. | 23.10. | §19.1 |
| O7 | höchstens drei Anreden je Folge | 23.10. | §9.4 |
| O15 | Erkennungston, und zwar bei richtiger Antwort | 23.10. | §10.6 |
| VS43 | Funkwörter Alfa bis Delta in der Fragerunde; du testest die Funktion | 23.10. | §12.2 |
| O17 | Haftungsausschluss in „Über die App“: man lernt hier nicht sicher alles richtig, soll sich in den Veröffentlichungen belesen, keine Haftung | 23.10. | erledigt in v4.88 (§1.3) |
| O22, F1 | Abo, Credits und Bitrate bleiben vorerst, wie sie sind. | 23.10. | §17.3, §18 |
| O38 | Klabauters neue Stimme auch in der App, aber erst nach der Freigabe. Alle App-Stimmen werden dann mit v4 neu gesprochen. | 23.10. | §18 |
| O33 | Schwierige Aussprache prüfst du. | 23.10. | §16.5 |
| – | Probefolge nach deinem Startschuss: Ausschnitt mit dem Anfang einer Folge, 5–10 Minuten, höchstens etwa 6.000 Credits, alles Testenswerte drin; Geräusche dürfen fehlen; Animationen kommen später; anklickbar über den Stuhl in der Kajüte. | 23.10. | Anhang H |

### 2.2 Was weiter gilt

- **Aus CLAUDE.md:**
  - R7 Spielstände nie brechen,
  - R8 nur Katalog und fachlich korrekt, ohne `quellen/` Geprüftes markieren,
  - R9 Schlüssel nie ins Repo,
  - R10 feste Sätze ins Stimmenpaket,
  - R11 große Bereiche in eigene Dateien,
  - R12 Lizenzen melden,
  - E1 ab 12,
  - E6 hohe Stimmqualität.
- **Aus der Bible:**
  - §8 Ton: derb, plattdeutsch angehaucht, doppeldeutig nur mit harmloser Lesart,
  - §9 Verbote X1, X2, X3 (ohne den Alkohol-Teil), X5–X7 und X10–X13; X4 ist gestrichen (§9.5),
  - §12 Produktion: erst reife Texte, dann Stimmen; jede Folge einmal erzeugen; offline (P63–P71),
  - §14 Sprechregie, Aussprache und Audio (A1–A33),
  - P41–P49 zu den Figuren, soweit unten nichts geändert ist, und P48 zu den Anreden.

### 2.3 Was sich gegenüber der Bible ändert

Was du am 23.10.2026 ausdrücklich entschieden hast, steht schon in der Bible (dritte Fassung, Entwurf). Den Rest bestätigst du mit dem Startschuss (K1).

| Bible | bisher | neu | Grund |
|---|---|---|---|
| P1, P5, P26–P36, P39 | Geschichte (Variante C), großes Rätsel „Die Wette“, Reise, Hinweis und Cliffhanger in jeder Folge | Hörkurs im Coaching-Stil. Jede Folge ist ein konzentriertes Hörspiel an einem echten Ort, ohne Fortsetzungshandlung. Spannung kommt aus Kaltstart-Lagen, Vorab-Fragen, Fallen und Garn. | E12, K8 |
| P13–P15, A16 | 25 Minuten je Folge; 12–25, zuletzt 22 Folgen | 12–15 Minuten (höchstens 17), 60 Folgen für G und S, zusammen knapp 14 Stunden | dein Wunsch vom 23.10., R53 |
| P30 | Boot „Frieda“, Frieda mit Kneipe, Klabauter als Petze und verliebt in eine Möwe, Logbuch als Schiedsrichter, Quirins Einladung an den Chiemsee | entfällt mit der Geschichte. Quirins Einladung bleibt als Karte, die Smilla am Ende von S11.5 vorliest, und führt nach Bayern; wohin genau, hängt am Revier für Teil B (§19.1). Ein Bootsname ist nicht nötig. | K8, dein Hinweis vom 23.10. |
| P47 | Quirin, Bergführer aus dem Chiemgau, segelt nur auf Seen, keine Witze über Bayern, kommt auch bei SBF See vor | Er bleibt Bergführer aus dem Chiemgau und auf dem Meer seekrank, ist aber auf Binnengewässern ein Profi. Bei SBF See kommt er zweimal zu Besuch (G6.3, S6.5), in Teil B ist er Hauptfigur. Witze über Bayern sind erlaubt. | 23.10. |
| X3, X4 | keine Beleidigungen von Gruppen, keine Witze über Bayern, kein Alkohol als Witz über Kinder | gestrichen; weiter verboten bleiben Anspielungen auf Körper von Kindern und Drastisches (X3 Rest) | 23.10. |
| P48, O7 | Häufigkeit der Anreden offen | höchstens drei je Folge | 23.10. |
| P38 | keine Regeln für Einleitung und Schluss | fester Bauplan (§7) | |
| P45 | Harms im Prolog mit der Wette | Harms erklärt in G0 die Prüfung (sobald F3 da ist) und prüft in Stichprobe, Fallen-Check, Fragerunde und Generalprobe. | E12 |
| P55, P56 | Fragen am Folgenende, vorgelesen, alle Fragen der Folge | bleibt, als „Fragerunde bei Harms“ (§12.2). Im Auto-Modus wird sie übersprungen und im „Kurs für heute“ nachgeholt. | K7 |
| X8 | keine Multiple-Choice-Fragen mitten in der Folge | Im interaktiven Modus gibt es Antwortknöpfe an den Entscheidungs-Denkpausen; die Antworten zählen in der Statistik wie Quizantworten. Im Auto-Modus bleibt nur die kurze Denkpause, danach die Lösung. | K10, 23.10. |
| X9 | Stoff nie mit der Prüfung begründen | Prüfungsbezug ist erwünscht („Im Katalog heißt das …“, Fallen-Check, „was Harms gern fragt“). Zuerst kommt aber immer das echte Warum an Bord, dann der Katalogsatz. | E12 |
| O6 | Klabauters Merk-Zeichen offen | ein einzelner Schlag der Schiffsglocke und „Krrah! Merken!“ | „Passt alles so“ (23.10.) |
| O5, A25 | Rollen schärfen | `podcast/figuren.md` | bestätigt 23.10. |
| O14 | Gäste offen | fünf Gäste (§8.2) | E12 |
| O12, O19, O20, O27 | Praxis, Bilder, „Kurs für heute“, Basisfragen offen | §3, §10–§12 | K5, K7, K9 |
| A33 | Skripte in `podcast/skripte/` | Folgenskripte in `podcast/folgen/` mit Kopf `folge: S2.2`, Skriptform in Anhang A | |

### 2.4 Kleine Entscheidungen von Claude in dieser Fassung

Nach R3 von Claude entschieden. Mit K1 bestätigst oder änderst du sie.
1. **Fragerunde mit allen Fragen der Folge** direkt nach dem Hören, statt „Hälfte jetzt, Hälfte morgen“ wie in Fassung 3.
   - Grund: Eine Folge mit Katalogfragen hat jetzt im Schnitt nur fünf bis sechs davon.
   - Das verteilte Wiederholen übernimmt am nächsten Tag die Lernkartei im „Kurs für heute“.
2. **Antwortknöpfe zählen in der Statistik** (deine Entscheidung zu X8; in Fassung 4 hatte Claude das Gegenteil vorgeschlagen). Wie genau, hat Claude entschieden:
   - Jeder Antwortknopf trägt die Nummer seiner Katalogfrage (`[[WAHL: sbf:137 | …]]`). Eine Antwort zählt wie eine Quizantwort auf diese Frage: Farbe, Serie, Fehler (V35).
   - Der Tipp bei der Vorab-Frage zählt nicht, denn da hat man den Stoff noch nicht gehört. Raten vorher hilft beim Lernen, auch wenn es falsch ist (R51).
   - Easy und Tricky (V36) gibt es nach Antwortknöpfen nicht, damit die Folge im Fluss bleibt; die Einschätzung kommt in der Fragerunde.
   - Dunkelgrün braucht weiter richtige Antworten an mindestens zwei Tagen (E11). Folge und Fragerunde am selben Tag reichen dafür also nicht.
3. **Der Überblick über ein Kapitel** steht am Anfang seiner ersten Folge, statt in einer eigenen Auftaktfolge.
4. **Hörkarten** werden mit der Folge geschrieben, im selben Skript.
5. **Jeder Abschnitt ist eine eigene MP3.** Nach Korrekturen wird nur der geänderte Abschnitt neu erzeugt (A13).
6. **Klabauters Merk-Glocke ist ein einzelner heller Schlag.** So verwechselt man sie nicht mit dem Glockensignal des Ankerliegers (rasches Läuten, etwa fünf Sekunden).
7. **Smilla kommt aus Köln am Rhein**, zu deinem Wunsch „großer Fluss“, mit einem Hauch Rheinisch.
8. **Teil G sagt nur, was für See und Binnen gilt.** Besonderheiten kommen in Teil S oder B.
9. **Audio für den Start mit 64 kbit/s Mono** (§17.3).

Neu in Fassung 5 (zu deinen Hinweisen vom 23.10.2026):

10. **Denkpausen 3, 5 und 6 Sekunden** statt 4, 6 und 8: 3 zum Erinnern, 5 zum Entscheiden, 6 für die Kernsätze am Ende. Darunter läuft auf Wunsch ein leises Ticken, damit die Stille nicht wie eine Störung wirkt. Danach kommt immer die Lösung (§5.4).
11. **Vertiefung** nach einer falschen Antwort: ein eigener Clip von 20–40 Sekunden, der es anders erklärt als der Haupttext (anderes Bild, mehr Warum). Gibt es nur im interaktiven Modus. Für Fragen aus früheren Folgen spielt die App deren Hörkarte (§10.2).
12. **Merkhilfen:** bis zu sechs je Folge statt drei. Klabauters Glocke kommt höchstens dreimal je Folge, bei den wichtigsten Merksätzen und im Abschluss, damit sie ihr Gewicht behält; die übrigen Merkhilfen sprechen Smilla und Hinnerk (§5.6).
13. **Rahmen je Folge:** sechs Rahmen, im Kursplan festgelegt, nie zweimal derselbe hintereinander; dazu eine Lage je Folge (§6.2).
14. **Quirins Besuche:** G6.3 (Brücken und Schleusen) und S6.5 (Nord-Ostsee-Kanal), weil er dort Profi ist. Seine Einladung nach Bayern kommt als Karte am Ende von S11.5 (§9.1).
15. **Erkennungston:** So verstehe ich deine Antwort zu O15: Jede Folge beginnt mit einem kurzen Erkennungston, und derselbe Ton erklingt, wenn du richtig antwortest. Falls du es anders meinst, sag Bescheid (§10.6).
16. **Ton:** Die gestrichenen Verbote sind raus. Weiter nie: Anspielungen auf Körper von Kindern und Anspielungen, die den Hörer selbst meinen (§9.5).

---

## 3. Gesamtaufbau

### 3.1 Drei Teile

| Teil | für | Fragen | Folgen | Dauer | Stand |
|---|---|---|---|---|---|
| G Grundkurs | SBF See und SBF Binnen | Basisfragen 1–72 | 16 | 3 h 38 min | geplant (§13) |
| S See | SBF See | See-Fragen 73–285 | 44 | 10 h 21 min | geplant (§13) |
| B Binnen | SBF Binnen | 181 Binnen- und 47 Segelfragen aus dem Binnen-Katalog | etwa 35 | etwa 8 h | später (§19), mit Quirin |

- **Teil G** enthält genau die 72 Basisfragen. Sie sind im See- und im Binnen-Katalog wortgleich (R3, in den App-Daten geprüft).
- **Regel für Teil G:** Er sagt nur, was auf See und auf Binnengewässern gilt.
  - Wo sich See und Binnen unterscheiden, kommt das in Teil S oder B, höchstens mit einem Satz wie: „Auf See und auf dem Fluss gibt es dazu noch eigene Regeln, die kommen später.“
  - Die Reviere in Teil G sind gemischt: Hafen, Fluss, Binnensee, Schleuse, Kanal, Küste.
- **Teil S** baut auf G auf und setzt dessen Begriffe voraus.

### 3.2 Kapitel, Folgen, Abschnitte

- **Kapitel** = ein Thema, zum Beispiel S3 „Lichter und Signalkörper“. Teil G hat 9 Kapitel (G0–G8), Teil S 11 (S1–S11).
- **Folge** = eine Unterrichtsstunde von 12–15 Minuten (höchstens 17) mit fester Klammer (§7).
- **Abschnitt** = 3–5 Minuten. Jeder Abschnitt ist eine Kapitelmarke im Player und eine eigene Audiodatei. Eine Folge hat drei oder vier Abschnitte.
- **Kapitelüberblick:** Die erste Folge jedes Kapitels beginnt mit einem Überblick von 60–90 Sekunden (§7.3). So beginnt jedes Thema mit einem Überblick (V41).
- **Kapitel-Check:** Nach der letzten Folge eines Kapitels bietet die App den Kapitel-Check bei Harms an: alle Fragen des Kapitels gemischt, am Bildschirm (§12.6).

### 3.3 Reihenfolge und roter Faden

Der Stoff baut aufeinander auf. Die Reihenfolge folgt drei Regeln:
1. **Begriffe vor Regeln.** G1.2 „Die Sprache an Bord“ (in Fahrt, Luv, Lee, Maschinenfahrzeug) ist das Vortraining für alles Weitere (R49).
2. **Erst erkennen, dann handeln.** Erst wer da kommt, dann wer ausweicht.
3. **Vom Einfachen zum Besonderen.** Erst die Grundregel, dann die Rangfolge, dann die Sonderfälle. Erst die freie See, dann das Fahrwasser, dann besondere Gebiete.

**Teil G:**
- G1 wer das Boot führt und welche Wörter man braucht,
- G2 Boot und Motor,
- G3 manövrieren,
- G4 Sicherheit an Bord,
- G5 Lichter und die zwei Grundregeln beim Ausweichen,
- G6 Zeichen am Ufer,
- G7 Natur und Wetter,
- G8 Grundkurs-Check.

**Teil S:**
- S1 welche Regeln wo gelten,
- S2 Ausweichen,
- S3 Lichter und Signalkörper,
- S4 Nebel und Schallsignale,
- S5 Tonnen und Feuer,
- S6 Fahrwasser und besondere Gebiete,
- S7 Navigation und Gezeiten,
- S8 Natur auf See,
- S9 Wetter, Seemannschaft und Seenot,
- S10 Praxis,
- S11 Prüfungsreife.

**Warum diese Reihenfolge in Teil S:**
- **S2 vor S3:** Zum Ausweichen reicht anfangs „Segler oder Motorboot“. Die Rangfolge am Ende von S2 macht neugierig auf die Lichter, an denen man die Fahrzeuge erkennt (S3).
- **S4 nach S3:** Die Schallsignale bei Nebel gehören zu denselben Fahrzeugarten wie die Lichter.
- **S5 vor S6:** Erst wer Fahrwasser und Tonnen erkennt, versteht die Regeln im Fahrwasser.
- **S7 nach S5:** Seekarte und Navigation brauchen Tonnen und Feuer.
- **S9 spät:** Wetter und Seenot fassen vieles zusammen: Lichter, Signale, Seemannschaft.
- **S10 und S11 am Ende:** die Praxis und die großen Verwechslungen über Kapitelgrenzen hinweg.

### 3.4 Was es außer den Folgen gibt

| Baustein | was | Länge | Abschnitt |
|---|---|---|---|
| Fragerunde bei Harms | nach jeder Folge alle Fragen der Folge im amtlichen Wortlaut, vorgelesen | 2–5 min | §12.2 |
| Hörkarte | zu jeder Frage: Fragehinweis, Denkpause, Antwort mit Warum, Falle | 20–25 s | §12.3 |
| Nachhilfe-Folge | persönlich, aus den Hörkarten deiner Wackelkandidaten, mit festen Überleitungen | bis 12 min | §12.4 |
| Schnellspur | alle Hörkarten in der Reihenfolge des Kurses, je Kapitel ein kurzer Rahmen | etwa 2 h | §12.5 |
| Kapitel-Check | am Bildschirm, alle Fragen des Kapitels gemischt | 5–10 min | §12.6 |

### 3.5 Deine Scheine, deine Termine, deine Zeit

Dein Wunsch vom 23.10.2026: Ganz am Anfang wählt man die Scheine, ihre Termine und die tägliche Lernzeit, und danach richten sich Kurs und Empfehlung. Das ersetzt den „Crew-Schein“ aus Fassung 4.

**Was man angibt** (im Kennenlernen; jederzeit änderbar in den Einstellungen):

| Angabe | Auswahl | Beispiel |
|---|---|---|
| Scheine | einer oder mehrere: SBF See, SBF Binnen (Motor; Segeln als Zusatz), später SKS | See und Binnen |
| Termin Theorie | je Schein ein Datum, oder „weiß ich noch nicht“ | See: 12.12., Binnen: noch offen |
| Termin Praxis | je Schein getrennt, oder „weiß ich noch nicht“ | See: 20.12. |
| Lernzeit | Minuten pro Tag (15, 30, 45, 60 oder frei) | 30 Minuten |

**Was die App daraus macht:**
1. **Reihenfolge der Teile:** Teil G immer zuerst und nur einmal, denn die Basisfragen gelten für beide Scheine. Danach der Teil für den Schein mit dem frühesten Theorietermin. Ohne Termine: See vor Binnen (Teil B entsteht erst nach Teil S).
2. **Tagespensum:** aus der Lernzeit und den Tagen bis zum Theorietermin. Eine Folge mit Fragerunde dauert etwa 17–20 Minuten; der Rest der Zeit geht an den „Kurs für heute“ (Wiederholen, Praxis).
3. **Reicht die Zeit?** Die App rechnet nach und sagt es ehrlich, zum Beispiel: „Bis zur Prüfung sind es 18 Tage, bei 30 Minuten am Tag schaffst du Teil S nicht ganz. Nimm die Schnellspur dazu oder plane 45 Minuten.“
4. **Praxis vor dem Praxistermin:** In den zwei Wochen vor dem Praxistermin bekommen Knoten, Manöver und S10 mehr Gewicht im „Kurs für heute“.
5. **Mehrere Scheine:** Die Basisfragen zählen für beide (das macht die App schon, V26). Die Termine bestimmen, welcher Schein gerade vorn liegt.

**Drei Wege, die die App vorschlägt:**
- **Gründlich (Standard):** jeden Tag die Folgen laut Pensum mit Fragerunde, dazu der „Kurs für heute“.
- **Schnell** (wenn die Zeit knapp ist): Folgen im Auto-Modus am Stück, Fragerunden und Kapitel-Checks in der App, vor der Prüfung die Schnellspur.
- **Nachsitzen:** nur die Nachhilfe-Folge und „Im Kurs nachhören“ bei Fehlern.

**In der App heute:** Es gibt schon Scheine (`S.course`, `S.crewSchein`), ein Prüfungsdatum je Schein und die Lernzeit (Einstellungen, Kennenlernen). Neu wären die getrennten Termine für Theorie und Praxis, mehrere Scheine auf einmal im Kennenlernen und die Rechnung „Reicht die Zeit?“. Vorschlag: als eigenes Vorhaben V42 in der App umsetzen, mit neuem Feld `S.ziele` und Standardwert aus den alten Angaben (R7). Wann, entscheidest du (§21).

---

## 4. Länge: warum etwa 14 Stunden

### 4.1 Die Rechnung

- Fassung 3 hatte gut 7 Stunden für 285 Fragen, also etwa 1,5 Minuten je Frage. Du hast zu Recht gesagt: Das reicht nicht für guten Unterricht.
- Seit Fassung 4 sind es 13 h 59 min für dieselben Fragen, im Schnitt 2,9 Minuten je Frage (§4.3). Darin stecken Erklärung, Beispiel, Abruf, Fallen, Praxis und Recherche.
- Je Thema heißt das 40–90 Minuten statt 45. Zum Beispiel:
  - Lichter und Signalkörper: 86 Minuten,
  - Fahrwasser und besondere Gebiete: 84 Minuten,
  - Tonnen und Feuer: 72 Minuten.

### 4.2 Vergleich und Begründung

- **Präsenzkurse:** Kurse an Hochschulen für die SBF-Theorie laufen über 4–8 Abende zu je etwa 2 Stunden, also 8–16 Stunden, dazu kommt Lernen zu Hause (R8). 14 Stunden Hörkurs liegen in diesem Rahmen.
- **Selbstlerner:** Ein Bericht nennt 45–60 Minuten täglich über drei Wochen (R8).
- **Länge einer Folge:** Für Lern-Podcasts gelten 10–15 Minuten als gute Länge, die Aufmerksamkeit lässt nach etwa 10 Minuten nach (R53). Deshalb gibt es viele kurze Folgen statt weniger langer, und Abschnitte von 3–5 Minuten (Segmentierung, R49).
- **Kein Füllstoff (A4):** Jede Minute hat eine Aufgabe: erklären, abrufen, anwenden oder eine Falle zeigen. Auch das Garn trägt Stoff.

### 4.3 Umfang je Kapitel (erzeugt)

<!-- UMFANG:START (erzeugt aus podcast/kursplan-sbf.json mit node tools/kursplan-pruefen.js --konzept; nicht von Hand ändern) -->

| Kapitel | Thema | Folgen | Minuten | Fragen | davon Bild/Ton | Minuten je Frage |
|---|---|---|---|---|---|---|
| G0 | Willkommen an Bord | 1 | 10 | – | – | – |
| G1 | An Bord: wer führt, wer spricht wie | 2 | 27 | 7 | 0 | 3,9 |
| G2 | Boot, Antrieb und Motor | 2 | 30 | 16 | 0 | 1,9 |
| G3 | Manövrieren | 2 | 27 | 7 | 0 | 3,9 |
| G4 | Sicherheit an Bord | 2 | 30 | 12 | 0 | 2,5 |
| G5 | Grundregeln unterwegs | 2 | 28 | 7 | 0 | 4,0 |
| G6 | Zeichen am Ufer | 3 | 39 | 17 | 15 | 2,3 |
| G7 | Natur und Wetter | 1 | 15 | 6 | 0 | 2,5 |
| G8 | Grundkurs-Check | 1 | 12 | – | – | – |
| **Teil G** | **Grundkurs** | **16** | **218** | **72** | **15** | **3,0** |
| S1 | Recht auf See | 2 | 28 | 10 | 0 | 2,8 |
| S2 | Ausweichen auf See | 4 | 58 | 20 | 1 | 2,9 |
| S3 | Lichter und Signalkörper | 6 | 86 | 34 | 24 | 2,5 |
| S4 | Hören statt sehen | 3 | 42 | 16 | 4 | 2,6 |
| S5 | Tonnen und Feuer | 5 | 72 | 33 | 16 | 2,2 |
| S6 | Fahrwasser und besondere Gebiete | 6 | 84 | 38 | 14 | 2,2 |
| S7 | Navigation und Gezeiten | 4 | 58 | 25 | 0 | 2,3 |
| S8 | Natur auf See | 2 | 26 | 10 | 0 | 2,6 |
| S9 | Wetter, Seemannschaft und Seenot | 5 | 71 | 27 | 6 | 2,6 |
| S10 | Die praktische Prüfung | 2 | 28 | – | – | – |
| S11 | Prüfungsreife | 5 | 68 | – | – | – |
| **Teil S** | **See** | **44** | **621** | **213** | **65** | **2,9** |
| **zusammen** | **Kurs SBF See (ohne Binnen)** | **60** | **839** | **285** | **80** | **2,9** |

<!-- UMFANG:END -->

### 4.4 Tagespensum

- Eine Folge mit Fragerunde dauert etwa 17–20 Minuten. Zwei Folgen am Tag plus „Kurs für heute“ sind etwa 45 Minuten.
- Teil G: 16 Folgen in etwa 8 Tagen. Teil S: 44 Folgen in etwa 22 Tagen.
- Mit Wiederholungstagen sind es etwa fünf Wochen bis zur Prüfungsreife.
- Das tatsächliche Pensum rechnet die App aus deiner Lernzeit und deinen Terminen (§3.5).

---

## 5. Didaktik: wie der Kurs lehrt

### 5.1 Grundsätze aus der Lernforschung

| Befund | so im Kurs | Recherche |
|---|---|---|
| Abfragen wirkt stärker als Wiederlesen, verteilt über mehrere Tage noch mehr. | Denkpausen, Rückblick aus zwei früheren Folgen, Fallen-Check, Abschluss als Abruf, Fragerunde, „Kurs für heute“ am nächsten Tag | R48 |
| Verschachteltes Üben hilft bei Dingen, die man leicht verwechselt. | Die Anwendung mischt früheren Stoff ein. Vergleichsfolgen G8 und S11. | R48, R52 |
| Warum-Fragen helfen beim Behalten. | jede Regel mit Warum | R48 |
| Kurze Abschnitte, die man selbst steuert, helfen. | Folgen von 12–15 Minuten, Abschnitte von 3–5 Minuten, der interaktive Modus hält an | R49, R53 |
| Wichtiges hervorheben hilft. | Landkarte am Anfang, „Im Katalog heißt das …“, Klabauters Glocke | R49 |
| Begriffe vorab kennen hilft. | G1.2 als Vortraining, neue Begriffe beim ersten Auftreten erklärt | R49 |
| Gesprächston und menschliche Stimme helfen. | Dialog statt Vortrag, Du-Anrede, echte Stimmen | R49 |
| Bild und gesprochenes Wort zusammen, ohne viel Text, helfen. | Animationen zum gesprochenen Wort, beim Mitlesen nur Stichworte | R49 |
| Einen Irrtum nennen und sofort widerlegen hilft. | Irrtum und Berichtigung innerhalb von 20 Sekunden | R50 |
| Vorab-Fragen helfen, auch wenn man falsch rät. | Vorab-Frage im Kaltstart | R51 |

### 5.2 Gedanken statt Fragen

Der Kurs lehrt Gedanken, nicht 285 einzelne Fragen. Jede Frage hängt an einem Gedanken. Wer den Gedanken hat, muss die Frage nur noch wiedererkennen. Beispiele:
- „Lichter sind Sätze: Wer bin ich, wohin fahre ich, was tue ich gerade?“ trägt über 40 Fragen.
- „Wer weniger kann, hat Vorrang“ trägt die Rangfolge.
- „Erst schauen, was länger ist: Licht oder Dunkel“ trägt alle Kennungen der Feuer.
- „Ein Kardinalzeichen ist eine Uhr“ trägt acht Fragen.

### 5.3 Tiefe je Frage

| Stufe | Bedeutung | wie | im Kursplan |
|---|---|---|---|
| ausführlich (Schwerpunkt) | Die Frage trägt einen Gedanken oder ist eine bekannte Falle. | eigener Schritt oder fester Teil des Systems: Regel, Warum, Bild im Kopf, Katalogsatz, Denkfrage | `schwerpunkt` |
| kurz mitnehmen | Die Antwort folgt aus dem Gedanken. | ein bis drei Sätze plus Katalogsatz, oft in der Anwendung | übrige Fragen |
| Fragenstrecke | Fundstellen, Begriffe, Bilder einer Familie | nacheinander: kurze Frage, Denkpause von 3 Sekunden, Katalogsatz, Merksatz | übrige Fragen in „System zuerst“ |

**Pflicht für jede Frage:** Der Inhalt der richtigen amtlichen Antwort wird ausgesprochen und ist als richtig erkennbar (Bible P18). Am besten mit „Im Katalog heißt das: …“. Im Skript steht davor `[[KATALOG: sbf:n]]`. Der Satz danach gibt die amtliche Antwort fast wörtlich wieder; das Werkzeug verlangt mindestens 80 % ihrer Wörter.

### 5.4 Abrufen: Denkpausen und Fragen an den Hörer

- **Drei Längen, bewusst kurz** (dein Wunsch: „Nicht zu lange“):
  - 3 Sekunden zum Erinnern (Rückblick, Fallen-Check, Fragenstrecke),
  - 5 Sekunden zum Entscheiden („Was tust du?“),
  - 6 Sekunden im Abschluss (Kernsätze selbst nennen).
- **Signal:** Vor jeder Denkpause kommt ein leiser Ton („jetzt du“), darunter auf Wunsch ein leises Ticken. Die Stille steht in der MP3, damit der Auto-Modus auch bei ausgeschaltetem Bildschirm funktioniert.
- **Danach immer die Lösung,** auch im Auto-Modus: kurz, in einem Satz, oft mit dem Merksatz. Wer unterwegs nicht mitdenken kann, verliert nichts.
- **Interaktiv:** An den 5-Sekunden-Pausen hält die App an und zeigt Antwortknöpfe (§10.2). Wer falsch antwortet, hört vor der Lösung die Vertiefung.
- **Pro Folge** etwa 8–12 Denkpausen, davon 3–6 Entscheidungen.
- **Vorab-Frage:** im Kaltstart, nur getippt. Die Auflösung kommt später in derselben Folge.
- **Rückblick:** zwei Fragen aus zwei früheren Folgen, eine von kurz davor, eine von länger her.
- **Abschluss:** Der Hörer nennt die Kernsätze selbst, dann bestätigt Klabauter.

### 5.5 Irrtum und Berichtigung

- Ein Irrtum kommt nur, wo es eine echte, verbreitete Fehlvorstellung gibt (Fallen in §15.2).
- **Wer irrt:**
  - Hinnerk irrt nur bei gefühlten Regeln („Ich war zuerst da“), nie bei Praxis und Sicherheit, etwa in jeder zweiten Folge.
  - Quirin irrt nicht (dein Hinweis vom 23.10.2026). Auf See ist er vorsichtig und fragt, auf dem Fluss ist er Profi.
  - Smilla erzählt ihre eigenen Fehler von früher („Genau darüber bin ich damals gestolpert“). Das ist kein Irrtum in der Szene, sondern eine Geschichte mit Lehre.
  - Oft irrt niemand: Smilla nennt die verbreitete Fehlvorstellung selbst („Viele denken jetzt …“) und widerlegt sie sofort.
- **Die Berichtigung**
  - folgt innerhalb von 20 Sekunden,
  - nennt das Warum,
  - ist mindestens so einprägsam wie der Irrtum.

  Danach sagt der, der geirrt hat, die richtige Fassung selbst („Sag ich doch.“).
- Klabauter wiederholt nie einen Irrtum.
- Im Skript: `[[IRRTUM: sbf:15]]` … `[[BERICHTIGUNG: sbf:15]]`. Das Werkzeug misst den Abstand.

### 5.6 Merkhilfen

Dein Auftrag vom 23.10.2026: „Die Merkhilfen müssen ausgebaut werden. Sie müssen wirklich sehr gut passen und Sinn machen. Und mehr sein.“

- **Ein Merksatz für jede Frage.** Alle 285 Merksätze der SBF-See-Fragen sind überarbeitet und stehen in `data/karten-sbf.json` (Feld `m`). Die App zeigt sie nach jeder Antwort (💡) und liest sie vor; der Kurs benutzt dieselben Sätze, in der Folge, in der Vertiefung und auf der Hörkarte. So hört und liest man überall dasselbe. Die Fragenliste `docs/kurs-fragen-sbf.md` zeigt zu jeder Frage den Merksatz.
- **Was einen guten Merksatz ausmacht:**
  - ein Bild, ein Klang oder eine Logik, keine bloße Wiederholung der Antwort;
  - er trennt die richtige Antwort von der Falle (zum Beispiel „Bestimmt, nicht gewählt“ bei Frage 1);
  - er stimmt fachlich, ist eindeutig und lässt sich nicht mit einer anderen Regel verwechseln;
  - er hat einen Geltungsbereich, wo es darauf ankommt („Draußen gilt …“).
- **Systeme, die viele Fragen tragen** (Beispiele):
  - **Rangfolge:** „Unser Boot fährt schön“ – manövrierUnfähig, manövrierBehindert, Fischer, Segler; das Motorboot weicht allen aus (Fragen 128–132).
  - **Schallsignale zum Mitsprechen:** lang-kurz-kurz klingt wie „Iiich kann nicht“, lang-kurz-kurz-kurz wie „Iiich häng hinten“, kurz-lang-kurz wie „Hier liiieg ich!“, ein Langer wie „Faaahrt!“, zwei Lange wie „Steeeh – stiiill“, kurz-lang immer wieder wie „Bleib – weeeg!“, ein Langer und vier Kurze wie „Aaachtung, Gefahr hier!“.
  - **Lichter:** „Rot über Rot – Ruder tot“ (manövrierunfähig), „Rot über Weiß – Fischers Fleiß“, „Grün über Weiß wie Gras über Schnee“ (Trawler), Rot-Weiß-Rot wie das Absperrband einer Baustelle (manövrierbehindert), ein Zylinder wie eine volle Dose (tiefgangbehindert), Anker plus Rot über Rot ist ein Grundsitzer.
  - **Bagger:** „Bälle sind die Barriere, Rauten die Route.“
  - **Kardinalzeichen:** der Uhr-Trick (Ost 3, Süd 6, West 9, Nord ohne Pause), die Spitzen zeigen, wo das Schwarze ist.
  - **Tonnen:** grün, spitz und ungerade (Steuerbord) gegen rot, stumpf und gerade (Backbord); „Backbord wie Baum“ bei den Pricken.
  - **Wetter:** „6 und 7: Starkwind. 8 heißt: Achtung, Sturm.“, „Fünf ist frisch“.
  - **Notsignale:** „Feuer rot, Rauch orange“.
- **Wie viele in einer Folge:** so viele, wie wirklich helfen, höchstens sechs (das Werkzeug zählt `[[MERKHILFE]]`). Klabauters Glocke kommt höchstens dreimal je Folge, bei den wichtigsten Merksätzen und im Abschluss; die übrigen sprechen Smilla („Bild im Kopf“) und Hinnerk (Sprüche).
- **Nicht verwenden:**
  - „Rot vor Grün …“: mehrdeutig (R46).
  - „Rot über Rot, Schiff in Not“: falsch, gemeint ist manövrierunfähig, nicht Seenot (R47); nur als Falle.
  - „Rot über Rot, der Käpt'n ist tot“: makaber und ungenau; ersetzt durch „Ruder tot“.
- **Quellen:** Bekannte Eselsbrücken (Uhr-Trick, Rot über Weiß, Luv und Lee, „Willst du spucken in See, spuck nach Lee“) sind in Lernhilfen verbreitet; eine einzelne Quelle je Spruch gibt es meist nicht. Die meisten Merksätze hat Claude neu formuliert und gegen den Katalog geprüft (R59). Binnen- und SKS-Merksätze folgen.

### 5.7 Sprache

- **Fürs Ohr schreiben (A2):** kurze Sätze, ein Gedanke pro Satz, schwierige Inhalte auf mehrere Beiträge verteilt.
- **Fachbegriffe:** beim ersten Auftreten erklären, danach immer derselbe Begriff. Also nicht abwechselnd „Steuerbord“ und „rechts“, außer zur Erklärung.
- **Katalogsatz** wörtlich oder fast wörtlich. Regeln in klarem Hochdeutsch (Dialekt nie im Regelsatz, §9.2).
- **Zahlen in Worten, Abkürzungen ausgeschrieben:** „Kollisionsverhütungsregeln“ statt „KVR“, beim ersten Mal beides.

### 5.8 Prüfungsbezug

- Coaching heißt: Die Crew bereitet dich auf die Prüfung vor. Sätze wie „Im Katalog heißt das …“, „Da fallen viele rein“ oder „Harms fragt das gern so“ sind erwünscht.
- Zuerst kommt aber immer das echte Warum an Bord. „Weil es in der Prüfung drankommt“ ist nie die Begründung.
- Zahlen zur Prüfung (Anzahl der Fragen, Bestehensgrenzen, Zeit) kommen erst, wenn sie am Original geprüft sind (R1, F3).

---

## 6. Folgenformen und Rahmen: Abwechslung statt Schema

Dein Hinweis vom 23.10.2026: „Wichtig ist schon, dass es nicht monoton nach dem selben Schema immer wieder abläuft. Frage, Falle, etc. Sondern abwechslungsreich, wie gesagt nach Bedarf und zu den Fragen passend. Themen gebündelt, manchmal ist mehr Vorgeschichte besser etc. Fragen zusammengefasst und so weiter, Anekdoten der Crew.“

Darum hat jede Folge zwei Merkmale: eine **Form** (wie der Stoff gelehrt wird, §6.1) und einen **Rahmen** (wie die Folge erzählt wird, §6.2). Beide stehen im Kursplan.

### 6.1 Formen (der Lehrkern)

| Form | Kern der Folge | wann | Folgen |
|---|---|---|---|
| System zuerst (`system`) | erst das System (3–5 min), dann Anwenden (1–2 min), dann die Fragenstrecke (2–4 min) | viele ähnliche Fragen mit einem gemeinsamen Prinzip: Lichter, Tonnen, Kennungen, Tafeln, Motor | 27 |
| Regel für Regel (`regel`) | zwei bis vier Regeln nacheinander, jede mit Lage, Regel, Warum, Bild, Katalogsatz und Denkfrage; dann Anwenden mit allen Regeln gemischt | wenige, eigenständige Regeln: Ausweichen, Verantwortung, Seenot, Anlegen | 23 |
| Einführung (`einfuehrung`) | die Crew stellt sich vor, so funktioniert der Kurs, die Prüfung (nach F3) | G0 | 1 |
| Praxis (`praxis`) | was verlangt wird, wie man es macht, worauf der Prüfer achtet; geübt wird in der App | S10.1 Knoten, S10.2 Manöver | 2 |
| Kartenaufgabe (`kartenaufgabe`) | Begriffe (Koppelort, Versetzung), Ablauf der Kartenaufgabe, Denkweise, typische Fehler, Übergang in die Navigationsschule | S7.3 | 1 |
| Vergleich (`vergleich`) | keine neuen Fragen; Verwechselbares nebeneinander, gemischt abgefragt, mit Bezug auf frühere Fragen | G8, S11.1–S11.5 | 6 |

Die Zahlen in der letzten Spalte stammen aus dem Kursplan vom 23.10.2026. Die gültige Zuordnung steht in §13.

### 6.2 Rahmen (die Dramaturgie)

| Rahmen | so läuft die Folge | Einstieg | Beispiel | Folgen |
|---|---|---|---|---|
| Hörspiel (`hoerspiel`) | Eine Lage mit Problem: Der Motor wird heiß, Nebel zieht auf, einer kommt zu nah. Die Crew muss handeln und streitet darüber; den Stoff braucht man, um das Problem zu lösen. Mehr Vorgeschichte, Spannung bis zur Lösung. | mitten in der Lage | G2.2: Vor Laboe wird der Motor heiß, die Ladelampe geht nicht aus. | 15 |
| Törn (`toern`) | Eine Fahrt mit drei bis vier Stationen, an jeder eine Regel oder ein Zeichen. Gut für „Regel für Regel“. | Ablegen oder unterwegs | S2.2: Kieler Woche, drei Begegnungen, drei Regeln. | 12 |
| Unterricht (`unterricht`) | Ruhig am Kartentisch, in der Kajüte oder am Steg. Smilla baut ein System auf, die anderen fragen und frotzeln. Gut für „System zuerst“ und Fundstellen. | eine Frage, ein Gegenstand auf dem Tisch | S5.4: eine Untiefe auf der Karte und vier Tonnen wie eine Uhr. | 8 |
| Garn-Abend (`garnabend`) | Eine Geschichte der Crew trägt die Folge: wahr mit Quelle oder erkennbar Garn. Die Regeln stecken in der Geschichte und werden danach herausgeholt. | „Hab ich dir mal erzählt …“ | S7.3: Smilla erzählt, wie sie an Tonne zehn gescheitert ist. | 9 |
| Duell (`duell`) | Wettstreit oder Quiz: Hinnerk gegen Smilla, Harms als Schiedsrichter, der Hörer spielt mit und zählt Punkte. Viel Abruf, viele Antwortknöpfe. | eine Wette | G5.2: Wer muss ausweichen? Der Hörer ist Schiedsrichter. | 9 |
| Besuch (`besuch`) | Ein Gast an Bord oder am Funk, im Gespräch mit der Crew: Polizistin, Hafenmeisterin, Fischer, Verkehrszentrale, Rangerin, Quirin. | der Gast kommt an | G1.1: Kontrolle am Steg durch die Wasserschutzpolizei. | 7 |

- Zu jeder Folge steht im Kursplan eine **Lage**: ein Satz, worum es in der Folge geht (Steckbriefe, §14).
- Zwei Folgen hintereinander haben nie denselben Rahmen; das prüft `tools/kursplan-pruefen.js`.

### 6.3 Kein Schema F

- **Fest ist nur, was das Lernen sichert** (§7.1): hörbares Revier, jede Frage mit Katalogsatz, Abruf aus früheren Folgen, echte Fallen, Kernsätze am Ende, Merksätze, Hörkarten.
- **Frei ist alles andere:** Reihenfolge, ob es einen Kaltstart gibt, wie lang die Vorgeschichte ist, wer fragt, wie der Fallen-Check klingt.
- **Fragen bündeln:** Wo mehrere Fragen an einem Gedanken hängen, kommen sie zusammen (Fragenstrecke, Duell-Runde, „Bücherkiste“ für Fundstellen). Wo eine Frage eine Geschichte braucht, bekommt sie Zeit.
- **Formeln sparsam:** Feste Sätze wie „Stimmt's?“, „Heute drei Dinge“ oder „Krrah! Merken!“ geben Halt, aber nicht in jeder Folge an derselben Stelle. Die Landkarte darf im Hörspiel wegfallen, wenn die Lage selbst sagt, worum es geht.
- **Anekdoten der Crew** (§9.6) gehören in jede Folge, mindestens eine kurze.

---

## 7. Bauplan einer Folge

### 7.1 Überblick

Die Tabelle zeigt die Teile einer Folge und was davon Pflicht ist. Reihenfolge und Form bestimmt der Rahmen (§6.2); die Zeiten sind Richtwerte.

| Teil | Dauer | Inhalt | Wer | Pflicht |
|---|---|---|---|---|
| 1 Kaltstart | 0:45–1:15 | Szene mit hörbarem Revier, eine Lage, daraus die Vorab-Frage (nur getippt, Auflösung später) | Hinnerk, Smilla oder Gast | bei Hörspiel und Törn; sonst frei |
| 2 Begrüßung und Rückblick | 0:45–1:00 | „Moin“, zwei Abruffragen aus zwei früheren Folgen; im Duell als Quizrunde, im Hörspiel als „Weißt du noch?“ in der Handlung | Smilla, Hinnerk oder Harms | Abruf ab G1.2 ja, Form frei |
| (Kapitelüberblick) | 1:00–1:30 | nur in der ersten Folge eines Kapitels (§7.3) | Hinnerk, Smilla, Klabauter, kurz Harms | erste Folge |
| 3 Landkarte | 0:15–0:30 | „Heute drei Dinge: …“ | Smilla | kurz; im Hörspiel kann die Lage sie ersetzen |
| 4 Kern | 7–9 min | Form „System zuerst“ (§7.4) oder „Regel für Regel“ (§7.5) | alle | ja |
| 5 Baustein | 1–2 min | einer aus sieben, laut Kursplan (§8) | je nach Baustein | ja |
| 6 Fallen-Check | 0:45–1:15 | zwei bis drei amtliche Falschantworten; als „Stimmt's?“ von Harms, im Duell gegenseitig, im Garn-Abend in der Geschichte versteckt | Harms, Hinnerk und Smilla | ja, Form frei |
| 7 Abschluss | 1:00–1:30 | Kernsätze selbst nennen, Klabauter bestätigt, was das an Bord heißt, Ausblick | Smilla, Klabauter, Hinnerk | ja |
| danach: Fragerunde | 2–5 min | eigene Audiodateien (§12.2) | Harms | ja |

**Typische Abschnitte (Kapitelmarken):**
1. „Einstieg“: Kaltstart oder Lage, Begrüßung, Rückblick, gegebenenfalls Kapitelüberblick, Landkarte (3–4 min).
2. und 3. der Kern mit dem Baustein (je 3–5 min).
4. „Fallen und Abschluss“ (2–3 min).

Die Kapitelmarken heißen nach Inhalt, nicht nach Schema („Der Motor wird heiß“ statt „Kern 1“).

### 7.2 Kaltstart mit Vorab-Frage

- Er beginnt mitten in einer Lage, mit Geräusch und einem Satz, der das Revier nennt (§10.3).
- Die Lage führt zu einer echten Frage aus dieser Folge: „Wer muss hier ausweichen? Tipp mal. Die Auflösung kommt.“
  - Im Skript: `[[VORAB: sbf:n]]` und eine Denkpause.
  - Im interaktiven Modus gibt es dazu Knöpfe (`[[WAHL]]`, dann 5 Sekunden), aber ohne richtig oder falsch. Die App merkt sich den Tipp und zeigt ihn bei der Auflösung. Der Tipp zählt nicht in der Statistik.
- Im Kaltstart gibt es keine Auflösung. Sie kommt im Kern oder in der Anwendung, mit Rückbezug: „Weißt du noch, das Motorboot von vorhin?“
- Eine Figur darf im Kaltstart nichts Falsches behaupten, das erst Minuten später berichtigt wird. Sie fragt („Wer muss jetzt weg, der oder wir?“), statt zu irren.
- Humor ist erlaubt: Hinnerk, Klabauter, Backbord, bei seinen Besuchen Quirin.

### 7.3 Begrüßung, Kapitelüberblick, Rückblick, Landkarte

- **Begrüßung:** kurz und nicht immer gleich. Hinnerk sagt „Moin.“, mal mit einer Anrede an den Hörer (höchstens drei Anreden je Folge, O7). Im Hörspiel kann die Begrüßung in der Handlung stecken.
- **Rückblick:**
  - zwei Fragen aus zwei früheren Folgen, je 3 Sekunden Denkpause, dann die Antwort in einem Satz;
  - es fragen im Wechsel Smilla, Hinnerk oder Harms; im Duell ist der Rückblick eine schnelle Quizrunde;
  - ab G2.1; in G1.2 gibt es nur eine Frage, aus G1.1;
  - mindestens eine Frage stammt aus einem früheren Kapitel (verteiltes Lernen).
- **Kapitelüberblick** (nur in der ersten Folge eines Kapitels, 60–90 Sekunden):
  1. warum das Thema an Bord zählt (Hinnerk, ein bis zwei Sätze),
  2. das Denkmodell in einem Satz (Smilla), Klabauter wiederholt es mit Glocke,
  3. die Folgen des Kapitels in einem Satz,
  4. was Harms gern fragt (typische Fallen, ohne Zahlen, bis F3 geklärt ist),
  5. das Ziel: „Am Ende des Kapitels kannst du …“

  In S1.1 kommt zusätzlich ein kurzer Überblick über Teil S dazu: „Jetzt geht's auf See: Gezeiten, Fahrwasser, Tonnen, Seekarte.“
- **Landkarte:** „Heute drei Dinge: …“, höchstens vier Punkte.

### 7.4 Kern in der Form „System zuerst“

1. **Das System** (3–5 Minuten, ein bis zwei Abschnitte):
   - das Prinzip Schritt für Schritt, mit einem Bild im Kopf (im interaktiven Modus mit Animation);
   - die Schwerpunktfragen werden hier ausführlich behandelt, jede mit Katalogsatz;
   - wo es eine echte Falle gibt: Irrtum und Berichtigung;
   - Merkhilfen nach Bedarf (§5.6).
2. **Anwenden** (1–2 Minuten):
   - zwei bis drei Fälle, jeweils eine Entscheidung mit 5 Sekunden (`[[WAHL]]` mit Fragen-ID, dazu die Vertiefung);
   - ein Fall mischt früheren Stoff ein (verschachteln);
   - hier wird die Vorab-Frage aufgelöst, wenn das nicht schon im System passiert ist.
3. **Fragenstrecke** (2–4 Minuten), die übrigen Fragen der Folge gebündelt:
   - Smilla nennt die Frage kurz und verständlich, dann 3 Sekunden Pause, dann der Katalogsatz, höchstens ein Satz Warum und der Merksatz.
   - Bei Bildfragen beschreibt Smilla das Bild in Worten („zwei rote Rundumlichter übereinander“). Im interaktiven Modus zeigt die App das Katalogbild.
   - Die Strecke darf anders klingen: als Schnellrunde im Duell, als „Bücherkiste“ am Kartentisch, als Funkverkehr mit der Verkehrszentrale.

### 7.5 Kern in der Form „Regel für Regel“

Für jede Regel (zwei bis vier Regeln, je 2–3 Minuten):
1. **Lage:** eine kurze Szene im passenden Revier.
2. **Regel:** ein klarer Satz auf Hochdeutsch.
3. **Warum:** der Grund an Bord.
4. **Bild im Kopf.**
5. **Irrtum und Berichtigung,** wo es eine echte Falle gibt (höchstens 20 Sekunden Abstand).
6. **Katalogsatz:** „Im Katalog heißt das: …“
7. **Denkfrage** (3 Sekunden) oder **Entscheidung** (5 Sekunden mit `[[WAHL]]` und Vertiefung).

Danach kommt **Anwenden** (1–2 Minuten): die Regeln der Folge gemischt, mit Entscheidungen von 5 Sekunden. Die sieben Schritte sind eine Checkliste, keine feste Reihenfolge: Im Hörspiel kommt das Warum oft vor der Regel, im Garn-Abend steckt die Lage in der Geschichte.

### 7.6 Baustein

- Welcher Baustein dran ist, steht im Kursplan. Wo er in der Folge steht, ist frei, meist zwischen System und Anwendung oder zwischen zwei Regeln.
- Einzelheiten in §8.

### 7.7 Fallen-Check

- Zwei bis drei Behauptungen. Jede ist eine echte amtliche Falschantwort aus dem Katalog.
  - Im Skript: `[[FALLE: sbf:n]]`. Die Behauptung zitiert die Falschantwort fast wörtlich; das Werkzeug verlangt mindestens 80 % ihrer Wörter. In den Ablaufplänen (Anhang B–D) steht sie gekürzt.
  - Alle Falschantworten stehen in `docs/kurs-fragen-sbf.md`.
- Form: „Stimmt's? …“, 3 Sekunden Pause, dann „Falsch. …“ mit der richtigen Fassung und einem Halbsatz Warum.
- Meist spricht Harms. Im Duell stellen sich Hinnerk und Smilla die Fallen gegenseitig, im Garn-Abend steckt eine Falle in der Geschichte („Und dann hat der Skipper gesagt …“), und der Hörer soll sie finden.
- Im Fallen-Check selbst gibt es keine Witze.

### 7.8 Abschluss

1. Smilla: „Nenn die Regeln von heute. Laut, wenn keiner zuhört.“ Dann 6 Sekunden Pause. Die Aufforderung klingt jedes Mal ein bisschen anders.
2. Klabauter: ein Glockenschlag, „Krrah! Merken!“, dann zwei bis vier Kernsätze, jeder höchstens acht Wörter.
3. Hinnerk: was das an Bord heißt, in einem Praxissatz.
4. Ausblick: eine Neugierfrage zur nächsten Folge.
5. Danach spielt die App einen festen Satz je nach Modus (R10):
   - interaktiv: „Und jetzt fragt Harms.“, dann die Fragerunde,
   - Auto-Modus: „Harms' Fragen warten in der App auf dich.“, dann die nächste Folge.

### 7.9 Abschnitte und Kapitelmarken

- `[[ABSCHNITT: Titel]]` beginnt einen Abschnitt. Der Titel ist die Kapitelmarke im Player.
- Abschnitte dauern 3–5 Minuten, eine Folge hat drei bis vier. Geschnitten wird nie mitten in einer Szene.
- Jeder Abschnitt wird einzeln erzeugt und gespeichert (A13).

### 7.10 Sonderformen

- **G0 Einführung** (10 Minuten, keine Katalogfragen):
  - Hörspiel im Heimathafen Flensburg, am Steg: Hinnerk sucht den Zündschlüssel (Lage im Kursplan);
  - die Crew stellt sich vor (Hinnerk, Smilla, Klabauter mit Glocke, Backbord, Harms am Telefon); Quirin wird als Besuch angekündigt („Der Bayer kommt, wenn's an die Schleusen geht“);
  - wie man mit dem Kurs lernt: die beiden Modi, Denkpausen, Fragerunde, Nachhilfe, Schnellspur;
  - woran man Garn und woran man Merksätze erkennt;
  - Harms erklärt die Prüfung (wartet auf F3 und SpFV Anlage 3);
  - ein ehrlicher Hinweis auf die Grenzen (§1.3).
- **S10 Praxis:** was in der praktischen Prüfung verlangt wird (nach der Prüfungsrichtlinie), der Ablauf, die Kommandos, worauf der Prüfer achtet, und wo man in der App übt. Ohne Richtlinie gibt es keine Zahlen.
- **S7.3 Kartenaufgabe:** die Begriffe, der Ablauf der Kartenaufgabe, die Denkweise in Schritten, typische Fehler (Tonne 10), danach der Übergang in die Navigationsschule.
- **Vergleich (G8, S11):**
  - keine neuen Fragen; Ähnliches steht direkt nebeneinander und wird gemischt abgefragt, mit vielen Entscheidungen von 5 Sekunden;
  - S11.5 ist die Generalprobe: Harms fragt quer durch den Kurs wie in der Prüfung. Danach kommen Tipps für den Prüfungstag (nach dem Original), und Smilla liest eine Karte von Quirin vor: die Einladung nach Bayern, als Brücke zu Teil B.

---

## 8. Baukasten, Gäste und Harms

### 8.1 Sieben Bausteine

| Baustein | Dauer | Ablauf | Wer | passt zu |
|---|---|---|---|---|
| Garn | 60–90 s | Hinnerk erzählt eine wahre Geschichte (mit Quelle aus dem Dossier) oder klar erkennbares Seemannsgarn, das den Stoff trägt. Smilla ordnet ein. Auch Smilla (Rhein, Tonne 10) und bei seinen Besuchen Quirin (Donau, Schleusen) erzählen. | Hinnerk, Smilla, Quirin | Seenotretter, Kanal, Beaufort, SOS |
| Stichprobe | 30–60 s | Harms ruft an oder sitzt dabei, stellt eine harte Prüfungsfrage, knurrige Auflösung. | Harms | Fundstellen, Zahlen, Kapitelenden |
| Fehler-Detektiv | 60–90 s | Hinnerk erzählt eine kurze Fahrt mit zwei bis drei Fehlern. Der Hörer zählt mit (6 Sekunden), dann die Auflösung. | Hinnerk, Smilla | Regeln mit klaren Pflichten |
| Ton-Labor | 60–120 s | echte Signale hören, benennen, vergleichen. Die App zeigt ● und ▬. | Smilla, Klabauter | Schallsignale, Kennungen |
| Gast | 2–3 min | eine Fachperson an Bord oder am Funk erklärt aus der Praxis | Gast, Smilla | §8.2 |
| Streitgespräch | 60–90 s | Zwei Figuren vertreten zwei Fälle, die man verwechselt. Der Hörer entscheidet. | Hinnerk und Smilla | Ausweichregeln, Lichter, Fahrwasser |
| Kopfkino | 60–90 s | geführte Vorstellung: „Du stehst am Ruder, es ist Nacht …“ | Smilla oder Hinnerk | Lichter, Manöver, Nebel, Peilung |

- Derselbe Baustein kommt nie zweimal hintereinander. Das prüft das Werkzeug.
- Garn ist immer erkennbar: entweder wahr mit Quelle oder als Garn markiert (Bible P23).

### 8.2 Gäste

| Gast (ID) | Folge | Stimme | Rolle |
|---|---|---|---|
| Wasserschutzpolizistin (`POLIZEI`) | G1.1, S6.3 | Selena | Kontrollen, Verantwortung, Anhalten |
| Hafenmeisterin (`HAFENMEISTER`) | G3.1 | Lucinda | Anlegen, Ankern, Hafenalltag |
| Fischer (`FISCHER`) | S3.6 | Dr. von Quirky | Lichter der Fischer, Stellnetze; spricht Platt, Smilla übersetzt |
| Verkehrszentrale (`FUNK`) | S6.6 | Mats | Funk, Verkehrstrennungsgebiet |
| Rangerin (`RANGERIN`) | S8.1 | noch offen | Wattenmeer, Seehunde, Schutzgebiete |
| Quirin zu Besuch (`QUIRIN`) | G6.3, S6.5 | George (unbestätigt) | Schleusen-Profi von Donau und Main-Donau-Kanal; in Teil B Hauptfigur |

- Fachlich sagen Gäste nur, was Katalog und Dossier tragen.
- Gäste sprechen Hochdeutsch, außer dem Fischer.
- Auch mit Gast gilt: höchstens drei Stimmen je Szene.
- Die Stimmen wählst du (Casting in der App).

### 8.3 Harms

Harms ist der Prüfer, nicht der Lehrer. Er kommt vor:
- im Baustein Stichprobe,
- im Fallen-Check (im Duell als Schiedsrichter),
- kurz im Kapitelüberblick („was ich gern frage“),
- in der Fragerunde nach jeder Folge,
- in G8 und in der Generalprobe S11.5,
- in G0, wenn er die Prüfung erklärt (nach F3).

Ziel: In mindestens jeder zweiten Folge ist er zu hören. Running Gag: Einmal im ganzen Kurs sagt er „Gut.“, in S11.5.

---

## 9. Figuren, Sprache und Humor

Die Figuren sind in `podcast/figuren.md` genau beschrieben (Steckbrief, Rolle, Haltung, Sprechweise, Humor, Schwächen, Beziehungen, Verbote, typische Sätze). Wörter und Sprüche stehen mit Quelle in `podcast/wortschatz.md`. Hier steht nur, was für das Schreiben jeder Folge gilt.

### 9.1 Wer macht was

| Figur | Rolle | Redeanteil |
|---|---|---|
| Smilla | führt durch den Unterricht, erklärt genau, berichtigt, übersetzt Platt und Bairisch, spricht die Fragen des Hörers aus | etwa 45 % |
| Hinnerk | Praxis, Seemannschaft, Wetter, Garn; irrt nur bei gefühlten Regeln; auf Binnengewässern fragt er | etwa 30 % |
| Klabauter | Merksätze und Kernsätze (mit Glocke), sonst Quatsch | etwa 10 % |
| Harms oder Gast | Prüfer bzw. Fachperson | etwa 15 % |
| Quirin | in Teil G und S nur zu Besuch (G6.3, S6.5) als Schleusen-Profi; in Teil B Hauptfigur, der Binnen-Profi | bei Besuchen wie ein Gast |
| Backbord | stumm, nur Geräusche | – |

- In G2, G4 und S9 (Praxis-Themen) erklärt Hinnerk mehr, und Smilla fragt nach.
- **Ohne Mitlerner:** Die Fragen des Hörers spricht Smilla aus („Du fragst dich jetzt bestimmt …“), Hinnerk liefert die gefühlten Irrtümer, Smilla erzählt eigene Fehler von früher, Gäste bringen Fragen aus der Praxis mit (`podcast/figuren.md`).

### 9.2 Dialekt

| Figur | Sprache |
|---|---|
| Hinnerk | stark norddeutsch mit Platt-Brocken, im Garn ganze Sätze auf Platt |
| Smilla | Hochdeutsch mit einem Hauch Rheinisch („ne?“, „Tschö!“, Kölsches Grundgesetz) |
| Quirin | sehr bayerisch |
| Harms | knappes hanseatisches Hochdeutsch |

- **Regel:** Regel, Katalogsatz und Denkfrage sind immer klares Hochdeutsch.
- Wenn Hinnerk plötzlich Hochdeutsch spricht, wird es ernst.
- Smilla übersetzt nebenbei: „Für alle ohne Platt: …“
- Platt, Kölsch und Bairisch werden vor der Vertonung gegengelesen. Das Bairische prüft dein Bekannter.

### 9.3 Klabauters Merk-Zeichen

- **Modus „Wichtig“:**
  - ein einzelner heller Glockenschlag, dann „Krrah! Merken!“,
  - dann der Satz: höchstens acht Wörter, klares Hochdeutsch, immer richtig.
- **Modus „Quatsch“:** ohne Glocke.
- Die Merk-Glocke ist nie ein Prüfungssignal. Wo Glockensignale Stoff sind (S4.3, S11.1), kündigt Smilla das Ton-Labor an. Das Prüfungssignal klingt dann deutlich anders (rasches Läuten).

### 9.4 Anrede des Hörers

- Die Crew sagt „du“: neckend, geschlechtsneutral und nur mit den beschlossenen Anreden (Bible P48):
  - Hinnerk: „Landratte“, „Schietbüdel“, „Dösbaddel“, „Kielschwein“,
  - Smilla: „Frischling“, „Landei“, „Seegurke“, „Bordküken“,
  - Klabauter: „Grünschnabel! Grünschnabel!“, „Nesthocker! Nesthocker!“, „Federlos! Federlos!“.
- Nie der Name des Nutzers (X10).
- Höchstens drei Anreden je Folge (O7, entschieden am 23.10.2026).

### 9.5 Humor

- **Ja:** im Kaltstart, im Garn, in Übergängen, in Merkhilfen, in Hinnerks Irrtum, in Backbords Streichen und in Quirins Selbstironie.
- **Nie:** im Regelsatz, im Katalogsatz, in Denkpausen und im Fallen-Check.
- **Ton** (Bible §8, dein Wunsch vom 23.10.2026): derb wie in der Bible, verbunden mit den Sprüchen und Wörtern der Seemannssprache aus `podcast/wortschatz.md`.
  - **Doppeldeutig** mit harmloser Lesart: „harmlos vorgelesen, doppeldeutig gehört“ (P51). Seemännische Begriffe mit zweiter Lesart sind geprüft und den Figuren zugeordnet (`podcast/wortschatz.md`, Abschnitt 11): Hinnerk etwa „Lümmelbeschlag“, „steife Brise“, „Was für ein Heck“; Smilla „Hand gegen Koje“, „ablegen und anlegen“; Klabauter „Fock! Fock!“; Quirin in Teil B „Mast legen“, „Oberwasser haben“. Höchstens zwei solche Stellen je Folge.
  - **Necken über Gruppen ist erlaubt:** Bayern, Nordlichter, Rheinländer, Segler, Motorbootfahrer, Landratten. Die Regeln „keine Gruppenbeleidigung“, „keine Witze über Bayern“ und „kein Alkohol als Witz über Kinder“ hast du gestrichen.
  - **Alkohol darf Witz sein** (Rum, Rasmus, Schlagseite). Die Promille-Regel selbst bleibt ernst (Frage 2).

**Was mit „Verbote“ gemeint ist** (deine Frage vom 23.10.2026): Die Bible hat in §9 eine Liste von Dingen, die in keiner Folge vorkommen dürfen (X1–X13). So sieht sie jetzt aus:

| Nr. | Verbot | einfach gesagt | Stand |
|---|---|---|---|
| X1 | trockenes Dozieren | kein langer Vortrag am Stück | gilt |
| X2 | sexuelle Inhalte ohne harmlose Lesart | Anspielungen ja, aber ein Kind muss etwas Harmloses hören können | gilt |
| X3 | Anspielungen auf Körper von Kindern, Drastisches, Alkohol als Witz über Kinder | Kinder sind nie Ziel einer Anspielung; nichts Ekliges oder Brutales | gilt, ohne den Alkohol-Teil (gestrichen) |
| X4 | Beleidigungen von Gruppen, Witze über Bayern | | **gestrichen** am 23.10.2026 |
| X5 | Fachfehler ohne Berichtigung, Erfundenes als Tatsache | jeder Irrtum wird berichtigt, Garn ist als Garn erkennbar | gilt |
| X6 | Klabauter unklar oder falsch im Modus „Wichtig“ | nach der Glocke stimmt immer alles | gilt |
| X7 | Hinnerk irrt immer | er irrt nur manchmal und nie bei Praxis und Sicherheit | gilt |
| X8 | Multiple-Choice-Fragen mitten in der Folge | | **geändert:** Antwortknöpfe im interaktiven Modus, sie zählen in der Statistik |
| X9 | Stoff mit der Prüfung begründen | | **geändert:** Prüfungsbezug erwünscht, aber zuerst das Warum an Bord |
| X10 | Name des Nutzers im Podcast | feste Sätze ohne Namen | gilt |
| X11 | Schlüssel ins Repo | Sicherheit | gilt |
| X12 | Audio bei jedem Abspielen neu erzeugen | alles wird einmal erzeugt und liegt in der App | gilt |
| X13 | Verworfenes ohne Zustimmung wieder aufgreifen | | gilt |

Claudes Empfehlung: X2 und X3 (ohne Alkohol-Teil) unbedingt behalten, denn die App ist ab 12 freigegeben, und in einem App-Store kann eine Anspielung auf Kinder die Freigabe kosten. Dazu kommt eine Regel, die aus X2 und X3 folgt: Eine Anspielung meint nie den Hörer selbst, denn er kann zwölf sein. Wie die Altersfreigabe im Store genau ausfällt, prüfen wir vor der Veröffentlichung (Status F7). Die Leitplanken der Live-KI in der App (`TONE`, `styleRules`) bleiben vorerst unverändert; das ist eine eigene Entscheidung.

- **Running Gags** sparsam, höchstens einer je Folge:
  - Hinnerk: „Sag ich doch.“ und „Tonne zehn.“
  - „Hinnerk. Mit zwei n und ohne i.“
  - der Zwieback-Krieg zwischen Klabauter und Backbord,
  - Quirins Seekrankheit (bei seinen Besuchen), Hinnerk vor der Schleuse,
  - Harms' „Geht.“

### 9.6 Hörspiel-Szenen und Anekdoten der Crew

- **Szenarien** dürfen ausführlich beschrieben werden, wie im Hörspiel: Der Motor stottert, die Crew segelt und muss ausweichen, alle reden durcheinander und streiten, was jetzt gilt. Wichtig ist nur: Am Ende der Szene ist klar, was richtig ist, und das Revier ist zu hören (§10.3).
- **Anekdoten** gehören in jede Folge, mindestens eine kurze. Vorrat, aus dem die Skripte schöpfen (jede wahr mit Quelle oder als Garn erkennbar, Bible P23):

| Figur | Stoff für Anekdoten | passt zu |
|---|---|---|
| Hinnerk | 38 Jahre Helgoland-Fähre: Nebel, Sturm von 87, Passagiere, die seekrank wurden, Begegnungen mit Frachtern, sein Krabbenfischer-Vater in Cuxhaven | Nebel, Lichter, Ausweichen, Wetter, Seemannschaft |
| Smilla | Kindheit am Rhein (Schubverbände, Sog, Schleusen), selbst angeeignet „Hand gegen Koje“, Tonne 10 bei der Prüfung, ihr Traum von Skagen | Sog und Schwell, Kartenaufgabe, Prüfungsfallen |
| Quirin | Donau und Main-Donau-Kanal mit seinem Boot, Schleusen, Bergfahrt und Talfahrt, der Berg als Vergleich (Seilschaft, Wetterumschwung) | Schleusen, Brücken, Teil B |
| Harms | 25 Jahre Prüfer, ehemaliger Elblotse, die Begegnung mit Hinnerk auf der Elbe (jeder erzählt sie anders) | Stichprobe, Fallen, Elbe |
| Klabauter | 40 Jahre Papagei, kam in einer Bananenkiste, Krieg mit Backbord um den Zwieback | Quatsch zwischen zwei Regeln |
| Gäste | Polizistin: echte Kontrollen; Hafenmeisterin: Anleger, die schiefgingen; Fischer: Netze und Nächte; Rangerin: Seehunde | ihre Folgen |

Wahre Geschichten mit Zahlen (etwa Einsätze der Seenotretter) kommen nur mit Quelle aus dem Dossier und mit Jahr (§15.1).

---

## 10. Hören und Sehen: Auto-Modus und interaktiver Modus

### 10.1 Eine Tonspur, zwei Modi

| | Auto-Modus | interaktiver Modus |
|---|---|---|
| für | unterwegs, Kopfhörer, Auto über Bluetooth, Bildschirm aus | am Handy, Bildschirm an |
| Denkpausen | kurz (3, 5, 6 Sekunden), laufen durch (die Stille steht in der MP3); danach kommt die Lösung | 3 und 6 Sekunden laufen durch; an den 5-Sekunden-Pausen hält die App an und zeigt Knöpfe |
| Antworten | keine | zählen in der Statistik (Farbe, Serie); falsch: erst die Vertiefung, dann die Lösung |
| Bilder und Animationen | keine | zum Ton (§11; Animationen kommen später) |
| Fragerunde | wird übersprungen und kommt in den „Kurs für heute“ | direkt nach der Folge |
| Bildfragen | in der Folge in Worten beschrieben | dazu das Katalogbild auf dem Bildschirm |
| Steuerung | Sperrbildschirm, Lenkradtasten (Media Session) | Knöpfe, Kapitelmarken, Tempo |

- Die Folge muss ohne Bildschirm voll verständlich sein. In der Folge heißt es deshalb nie „schau aufs Bild“. Das sagt nur Harms in der Fragerunde bei Bildfragen (VS44).
- Android Auto zeigt keine Web-Apps. Im Auto geht es über Bluetooth und den Sperrbildschirm.

### 10.2 Antwortknöpfe (K10)

- **Im Skript:** Erst wird die Frage gesprochen. Dann folgt `[[WAHL: sbf:n | …]]` und direkt danach die Entscheidungs-Denkpause `[[DENKPAUSE: 5]]`.
  - **Die Fragen-ID ist Pflicht** (`sbf:n`), denn die Antwort zählt in der Statistik (deine Entscheidung vom 23.10.2026).
  - Danach zwei bis vier Antworten, kurz (höchstens etwa sechs Wörter), genau eine richtig und mit `*` markiert: `[[WAHL: sbf:137 | *du | das Motorboot]]`.
  - Oder nur die Katalogfrage, `[[WAHL: sbf:15]]`. Dann zeigt die App deren vier amtliche Antworten.
  - Jede 5-Sekunden-Pause hat Knöpfe, sonst warnt das Werkzeug.
- **Vertiefung** (dein Wunsch: „Beim interaktiven Modus wird tiefer erklärt, wenn man falsch antwortet“):
  - Im Skript direkt nach der Denkpause: `[[VERTIEFUNG: sbf:137]]`, die Sätze, dann `[[VERTIEFUNG: ende]]`.
  - 20–40 Sekunden (höchstens etwa 600 Zeichen), höchstens zwei Stimmen, meist Smilla.
  - Sie erklärt es **anders** als der Haupttext: ein neues Bild, mehr Warum, die typische Verwechslung. Nicht nur lauter wiederholen.
  - Eigener Clip, nur im interaktiven Modus und nur nach einer falschen Antwort. Im Auto-Modus und bei richtiger Antwort fällt sie weg.
  - Pflicht für jede Wahl zu einer Frage dieser Folge. Bei Fragen früherer Folgen spielt die App deren Hörkarte.
- **Ablauf interaktiv:**
  1. Die App hält an und zeigt die Knöpfe. Sie wartet, bis man antwortet oder „Weiter“ tippt.
  2. Richtig: der Erkennungston (§10.6), weiter geht's. Falsch: ein dunkler Ton, dann die Vertiefung.
  3. Dann läuft die Folge weiter und sagt die Lösung auch hörbar.
- **Vorab-Frage:** Knöpfe ohne richtig oder falsch. Die App merkt sich den Tipp und zeigt ihn bei der Auflösung. Der Tipp zählt nicht in der Statistik.
- **Menge:** drei bis sechs Entscheidungen je Folge, nie zwei direkt hintereinander ohne Erklärung dazwischen.
- **Wertung:** wie eine Quizantwort auf die Frage mit der ID: Farbe und Serie (V35). Easy und Tricky gibt es hier nicht, sondern erst in der Fragerunde (§2.4).
- **Im Auto-Modus** bleiben nur die 5 Sekunden Stille, danach die Lösung.

### 10.3 Das Revier hören

- In jeder Szene nennt eine Figur in den ersten Sätzen beiläufig, wo man ist. Die Geräusche passen dazu. Das Werkzeug warnt, wenn das Revier im Text fehlt.
- **Szenarien beschreiben ist ausdrücklich erwünscht** (dein Hinweis vom 23.10.2026): Was passiert gerade, wer ist am Ruder, was ist das Problem? Die Figuren sagen es im Gespräch („Der Motor stottert, und vor uns liegt das Fahrwasser“), nicht als Erzähler. So entsteht das Hörspiel, und das Revier ist klar.
- Die Regel muss zum Revier passen:
  - Kollisionsverhütungsregeln im freien Seeraum und außerhalb des Fahrwassers,
  - Seeschifffahrtsstraßen-Ordnung im Fahrwasser der Seeschifffahrtsstraßen (sie geht vor, Frage 74),
  - Regel 10 im Verkehrstrennungsgebiet, Sondervorschriften im Nord-Ostsee-Kanal,
  - Binnenregeln erst in Teil B.

| Revier (Code) | so klingt es im Satz | Geräusche | was dort gilt |
|---|---|---|---|
| freie See (`frei`) | „Wir sind mitten in der Kieler Bucht, weit weg vom Fahrwasser.“ | Wellen, Wind, Takelage | Kollisionsverhütungsregeln |
| Fahrwasser (`fahrwasser`) | „Wir sind im Fahrwasser, rechts die grünen Tonnen.“ | Motor, ein Schiffsdiesel in der Ferne | Seeschifffahrtsstraßen-Ordnung, Vorfahrt der Schiffe, die dem Fahrwasser folgen |
| Verkehrstrennungsgebiet (`vtg`) | „Vor uns das Verkehrstrennungsgebiet, der Einbahnweg.“ | ein großer Frachter, Funk der Verkehrszentrale | Regel 10 der Kollisionsverhütungsregeln |
| Nord-Ostsee-Kanal (`nok`) | „Wir sind im Nord-Ostsee-Kanal.“ | Schleuse, Funk | Sondervorschriften für den Kanal |
| Hafen (`hafen`) | „Wir liegen im Stadthafen, am Steg.“ | Möwen, klappernde Fallen, quietschende Fender | Hafen, Manövrieren |
| Watt (`watt`) | „Wattenmeer, das Wasser läuft ab.“ | Wattvögel, Rinnsale | Nationalpark, Befahrensregeln |
| Schleuse (`schleuse`) | „Wir warten vor der Schleuse.“ | Wasserrauschen, Schleusentor | Lichter und Tafeln an Schleusen |
| an Land (`an Land`) | „In der Kajüte, am Kartentisch.“ oder Harms am Telefon | Uhr, Kocher, Telefon | – |
| Fluss (`fluss`) | „Auf dem Rhein bei Köln.“ oder bei Quirins Besuch „auf der Donau bei Kelheim“ | Binnenschiff, Strömung | in Teil G nur Allgemeines, Binnenregeln erst in Teil B |
| Binnensee (`binnensee`) | „Am Schilfufer eines Sees.“ | Schilf, Enten, Stille | in Teil G nur Allgemeines |

- Signaltöne sind nie Kulisse: keine Nebelhörner und keine Heultonnen im Hintergrund.

### 10.4 Bilder während der Folge

- Im interaktiven Modus zeigt die App bei `[[BILD: sbf:n]]` das Katalogbild unverändert (Bible P58) und bei `[[ANIM: id, schritt]]` eine Animation.
- Der gesprochene Satz muss trotzdem ohne Bild verständlich sein. Bildfragen werden deshalb immer auch in Worten beschrieben.

### 10.5 Signale und Töne

- Prüfungssignale entstehen im Code mit genauer Dauer: kurz etwa 1 Sekunde, lang 4–6 Sekunden (wir nehmen 5; Fragen 4 und 5). Zwischen den Tönen liegt etwa eine Sekunde (das ist unsere Darstellung, keine Katalogaussage).
- Die App zeigt die Zeichen dazu (● ▬), wie im Katalog.
- Smilla nennt jedes Signal einmal in Worten („kurz, lang, kurz“), weil die Prüfung Zeichen zeigt und keine Töne.
- Klabauters Merk-Glocke, der Ton vor Denkpausen und die Töne für richtig und falsch klingen deutlich anders als jedes Prüfungssignal.
- Hornklänge aus Geräusch-Bibliotheken werden nie für Prüfungssignale verwendet.

### 10.6 Geräusche und Musik

- Die Geräusche lieferst du (B75), Claude mischt sie dazu. Sparsam und mit Zweck (A26).
- Nie unter Erklärungen: kurz am Anfang einer Szene, dann leise oder weg.
- **Erkennungston** (O15, deine Antwort vom 23.10.2026: „Titelmusik oder Erkennungston, (bei Frage richtig? Dann erkennungston)“). So setzt Claude es um, bitte bestätigen:
  - Jede Folge beginnt mit einem kurzen Erkennungston (höchstens 5 Sekunden, nie unter Sprache), keine lange Titelmusik.
  - Derselbe Ton, kurz, erklingt bei jeder richtigen Antwort (Antwortknöpfe, Fragerunde). So verbindet man den Kurs mit dem Gefühl „richtig“.
  - Bei falscher Antwort kommt ein anderer, dunkler Ton, nie ein Prüfungssignal.
  - Den Ton lieferst du oder wir nehmen einen lizenzfreien (L1). Für die Probefolge darf er fehlen.
- Die Liste `podcast/soundeffekte.md` ist für den Kurs gekürzt (23.10.2026): die Töne des Kurses, eine Atmo je Revier und wenige Einzelgeräusche. Am wichtigsten sind ein eigener Erkennungston, Hafen und Kajüte; alles andere hat einen Ersatz aus `audio/`. Die alte Liste der Geschichte liegt im Archiv.

### 10.7 Mitlesen

- Im interaktiven Modus auf Wunsch Stichworte je Abschnitt (Landkarte, Kernsätze), nicht der ganze Text. Gleichzeitig lesen und hören lenkt ab (R49). Standard: aus.

---

## 11. Animationen

### 11.1 Grundsätze

- **Zeitpunkt:** Die Animationen kommen nach der Probefolge (dein Hinweis vom 23.10.2026). Die Probefolge zeigt im interaktiven Modus nur Katalogbilder und Antwortknöpfe.
- Bild und gesprochenes Wort kommen zusammen, mit wenig Text auf dem Bild (R49).
- Der Stil ist der der App: flach, warm, gezeichnet, mit Tag und Nacht.
- Eine Animation ergänzt den Ton. Zum Verstehen ist sie nie nötig, denn im Auto-Modus gibt es sie nicht.
- Katalogbilder bleiben unverändert (Bible P58). Sie werden höchstens vergrößert oder nebeneinandergestellt.
- **Steuerung:** `[[ANIM: id, schritt]]` im Skript. Die App spielt den genannten Schritt, sobald die Stelle im Ton erreicht ist.
- **Reihenfolge beim Bauen:**
  - zuerst, was mehrere Folgen brauchen (Priorität 1);
  - möglichst auf vorhandenem Code: Schiffe aus dem Törn, Seezeichen-Kurs, Karte der Navigationsschule, Knoten, Manöver.
- Player und Animationen kommen in eine eigene, nachgeladene Datei, zum Beispiel `kurs.js` (R11).

### 11.2 Katalog (erzeugt)

<!-- ANIMATIONEN:START (erzeugt aus podcast/kursplan-sbf.json mit node tools/kursplan-pruefen.js --konzept; nicht von Hand ändern) -->

| ID | Animation | zeigt | baut auf | Prio | in Folgen |
|---|---|---|---|---|---|
| `boot` | Das Boot und seine Seiten | Bug, Heck, Backbord, Steuerbord, achtern, mittschiffs | neu (SVG im Stil der App) | 1 | G1.2 |
| `wind` | Wind und Segel | Luv und Lee, Wind von Backbord oder Steuerbord, Lee vor Luv | neu (SVG) | 1 | G1.2, S2.2 |
| `lichterkarussell` | Lichterkarussell | ein Schiff dreht sich; je nach Blickwinkel sieht man Topplicht, Seitenlichter, Hecklicht | Schiffe mit Lichtern aus dem Törn (toern.js, drawShip) | 1 | G5.1, G8, S3.1 |
| `lichtertafel` | Lichter und Signalkörper je Fahrzeug | Nachtbild und Tagbild umschaltbar, dazu das Katalogbild; auch Signalmasten, Flaggen und Tonnen bei Sperrungen | Katalogbilder (img/q) und drawShip | 1 | S3.2, S3.3, S3.4, S3.5, S3.6, S6.3, S6.4, S11.2 |
| `begegnung` | Begegnung von oben | zwei Fahrzeuge, die Peilung bleibt stehen, wer ausweicht, Überholsektor; bei Nebel der Bereich vorlicher als querab | neu (Canvas) | 1 | G5.2, S2.1, S2.2, S2.4, S4.1, S6.1, S11.3 |
| `schallleiste` | Schallsignale sichtbar | ● und ▬ laufen mit dem Ton mit | neu (einfach), Zeichen wie in den Katalogfragen | 1 | G6.2, S2.4, S4.2, S4.3, S6.3, S6.4, S9.5, S11.1 |
| `kennung` | Feuer im Takt | Blink, Blitz, Funkel, unterbrochen, Gleichtakt in echter Taktung | blinkende Kennungen des Seezeichen-Kurses (seezeichen.js, takt) | 1 | S5.1, S5.3, S5.5 |
| `lateral` | Fahrwasser von See kommend | rote und grüne Tonnen, Nummern, Abzweigungen, Mitte | Seezeichen-Kurs und Karte der Navigationsschule | 1 | S5.2, S5.3, S6.1 |
| `kardinal` | Kardinalzeichen als Uhr | Gefahrenstelle mit vier Tonnen, Toppzeichen, Blitze wie Uhrzeiten | neu und Katalogbilder | 1 | S5.4 |
| `tafeln` | Tafelzeichen nach Familien | Verbot, Gebot, Hinweis nebeneinander, Katalogbild groß | Katalogbilder (img/b, img/q) | 1 | G6.1, G6.2, G6.3, G8, S6.2, S6.5 |
| `karte` | Auf der Seekarte | Peilung, Standlinie, Koppelort, Versetzung | Karte der Navigationsschule (NAV.mountChart) | 1 | S7.1, S7.2, S7.3 |
| `knoten` | Prüfungsknoten | Tau-Animationen der Knoten | vorhanden (knoten.js) | 1 | S10.1 |
| `manoever` | Prüfungsmanöver | Vorführung je Manöver | vorhanden (manoever.js) | 1 | S10.2 |
| `radeffekt` | Radeffekt | das Heck versetzt bei Rückwärtsfahrt, Anlegen an Backbord | Fahrphysik des Manöverspiels (manoever.js) | 2 | G2.1 |
| `anlegen` | Anlegen | spitzer Anlaufwinkel, gegen Wind oder Strom, Leinen | Vorführung des Manöverspiels (manoever.js, demo) | 2 | G3.1 |
| `sog` | Sog und Schwell | Bug- und Heckwelle, Sog eines großen Schiffs, kleines Boot daneben | neu (Canvas) | 2 | G3.2 |
| `rangleiter` | Die Rangfolge | Leiter von manövrierunfähig bis Maschinenfahrzeug | neu (SVG) | 2 | S2.3 |
| `sektorenfeuer` | Leit-, Richt- und Quermarkenfeuer | weißer Leitsektor, Richtfeuer in Deckung, Ankündigungssektor | Feuer der erfundenen Übungskarte (data/karte.json) | 2 | S5.5 |
| `vtg` | Verkehrstrennungsgebiet | Einbahnwege, Trennzone, Queren im rechten Winkel, Küstenverkehrszone | Karte der Navigationsschule | 2 | S6.6, S11.3 |
| `revierkarte` | Wo gilt was? | Hohe See, Seeschifffahrtsstraße, Fahrwasser, Verkehrstrennungsgebiet: welche Regeln wo gelten | Karte der Navigationsschule | 2 | S1.1, S6.1, S11.3 |
| `gezeiten` | Ebbe und Flut | Wasserstandskurve, Hoch- und Niedrigwasser, Tidenhub | neu (Canvas) | 2 | S7.4 |
| `wetterkarte` | Wetterkarte | Hoch und Tief, Isobaren, Wind, Fronten | neu (SVG) und Katalogbilder | 2 | S9.1 |
| `mob` | Mensch über Bord | Manöver und Bergung | Vorführung des Manöverspiels (manoever.js) | 2 | S9.4 |
| `notsignale` | Notsignale | Rakete, Flagge mit Ball, NC, SOS, Dauerton | Katalogbilder und Schallleiste | 2 | S9.5 |
| `motor` | Die vier Kreisläufe des Motors | Kühlwasser (Seeventil, Filter, Impeller, Auspuff), Öl, Strom, Kraftstoff | neu (Schema) | 3 | G2.2 |
| `gas` | Gas sinkt nach unten | Gas und Benzindampf sammeln sich in der Bilge | neu (Schema) | 3 | G4.1 |
| `wetter` | Warum der Wind weht | Luftdruckunterschied, Wind vom Hoch zum Tief | neu (Schema) | 3 | G7.1 |
| `beaufort` | Beaufort-Skala | Windstärken mit Seegang, Warnschwellen 6–7 und ab 8 | neu (Tafel) | 3 | S9.2 |

**Zusammen:** 28 Animationen, davon Priorität 1: 13; 51 von 60 Folgen haben mindestens eine.

<!-- ANIMATIONEN:END -->

### 11.3 Die wichtigsten Animationen

Die Schritt-Namen sind ein Vorschlag. Endgültig legt sie fest, wer die Animation baut, und sie kommen dann in den Kursplan.

| Animation | was man sieht | Schritte (Vorschlag) |
|---|---|---|
| `begegnung` | zwei Boote von oben mit Kurslinien; ein Peilstrahl, der stehen bleibt, während der Abstand schrumpft; die Sektoren (Überholsektor ab 22,5° achterlicher als querab; bei Nebel „vorlicher als querab“) | `peilung`, `entgegen`, `kreuzen`, `ueberholen`, `segler-lee`, `segler-backbord`, `kurshalter`, `nebel` |
| `lichterkarussell` | ein Schiff dreht sich einmal um sich selbst; je nach Blickwinkel sieht man Topplicht, Seitenlichter oder Hecklicht; die Sektoren als Tortenstücke | `motor`, `motor50`, `segler`, `dreifarben`, `motorsegler` |
| `lichtertafel` | eine Fahrzeugart nach der anderen, Nacht- und Tagbild umschaltbar, daneben das Katalogbild | `anker`, `grund`, `schlepp`, `mu`, `mb`, `bagger`, `tiefgang`, `trawler`, `fischer`, `gefahrgut`, `behoerde`, `signalmast` |
| `schallleiste` | ● und ▬ laufen mit dem Ton mit | ein Schritt je Signal |
| `kennung` | Feuer im echten Takt: Blink (mindestens 2 s), Blitz (unter 2 s), Funkel, unterbrochen, Gleichtakt; darunter eine Zeitleiste mit der Wiederkehr | `blink`, `blitz`, `funkel`, `unterbrochen`, `gleichtakt`, `wiederkehr` |
| `lateral` | ein Fahrwasser von See kommend: rote Tonnen links, grüne rechts, Nummern, Abzweigung, Mitte | `vonsee`, `nummern`, `abzweig`, `mitte` |
| `kardinal` | eine Gefahrenstelle mit vier Kardinaltonnen wie eine Uhr, Toppzeichen und Blitze | `nord`, `ost`, `sued`, `west`, `uhr` |
| `tafeln` | Tafelzeichen nach Familien (Verbot, Gebot, Hinweis), das Katalogbild groß | `verbot`, `gebot`, `hinweis`, `schleuse` |
| `karte` | Karte der Navigationsschule mit Peilung, Standlinie, Koppelort, Versetzung | `peilung`, `standlinie`, `koppelort`, `versetzung` |
| `boot`, `wind` | Grundbegriffe am Boot: Bug, Heck, Backbord, Steuerbord; Luv und Lee | `seiten`, `luv-lee`, `windseite` |
| `knoten`, `manoever` | gibt es schon in der App (Knotenbrett, Manöverspiel) | wie dort |

---

## 12. Lernkreislauf mit der App

### 12.1 Der Weg eines Lernenden

1. Der „Kurs für heute“ schlägt die nächste Folge vor (Happen „🎧 Kajütenfunk“, V37).
2. Folge hören, im Auto-Modus oder interaktiv. Ein Abschnitt gilt als gehört, wenn 80 % davon gelaufen sind.
3. Fragerunde bei Harms: alle Fragen der Folge (interaktiv direkt danach, im Auto-Modus später).
4. Am nächsten Tag bringt der „Kurs für heute“ die Fragen der gehörten Folgen zurück, die wackligsten zuerst (V37).
5. Bei einem Fehler spielt „🎧 Erklärung hören“ die Hörkarte. „Im Kurs nachhören“ springt an die Stelle der Folge, an der die Frage erklärt wird.
6. Am Ende eines Kapitels: Kapitel-Check bei Harms am Bildschirm. Unter 80 % schlägt die App die Nachhilfe-Folge vor.
7. Nachhilfe-Folge nach Bedarf.
8. Prüfungsreife (V37): Teil S11, die Schnellspur und die Probeprüfung am Telefon bei Harms, sobald die Prüfungsreife bei 80 % liegt.

### 12.2 Fragerunde bei Harms

- **Inhalt:** alle Katalogfragen der Folge im amtlichen Wortlaut, mit Originalbild (Bible P58).
- **Vorlesen:** Harms liest Frage und Antworten vor (B94).
  - Die Frage und jede Antwort sind eigene Aufnahmen. Dazu kommen feste Clips „Antwort A“ bis „Antwort D“. So kann die App die Antworten mischen wie im Quiz (VS43).
  - Die Sprechfassung schreibt Abkürzungen und Zahlen aus. Auf dem Bildschirm steht der amtliche Wortlaut (A20).
- **Antworten:** per Tippen oder per Zuruf über die Spracherkennung (VS43, entschieden am 23.10.2026). Während Harms vorliest, zählen nur die Funkwörter Alfa, Bravo, Charlie und Delta, danach auch A, B, C und D. So löst Harms' eigenes „Antwort A“ nichts aus. Du testest die Funktion am Handy.
- **Bildfragen:** Harms sagt „Schau aufs Bild“, die App zeigt es (VS44). Im Auto-Modus werden sie übersprungen.
- Nach jeder Antwort kommt ein Ton für richtig oder falsch, bei „falsch“ auf Wunsch die Hörkarte.
- Überspringen geht. Übersprungene Fragen zählen nicht als falsch (P55).
- **Wertung** wie im Quiz der App: Farben (V35), Easy und Tricky (V36).
- **Umfang:** 285 Fragen, etwa 129.000 Zeichen. Einmal erzeugt, lässt sich das Vorlesen auch im normalen Quiz der App nutzen.

### 12.3 Hörkarten

- Zu jeder Frage gibt es eine Hörkarte:
  - 20–25 Sekunden (höchstens etwa 450 Zeichen),
  - höchstens zwei Stimmen: Smilla, dazu Klabauter oder Hinnerk.
- **Aufbau:**
  1. ein Fragehinweis, den man ohne Bildschirm versteht („Zwei rote Rundumlichter übereinander: Wer ist das?“),
  2. 3 Sekunden Pause,
  3. die Antwort mit Katalogsatz,
  4. ein Satz Warum,
  5. der Merksatz der App (`data/karten-sbf.json`) oder eine Falle, dieselbe wie in der Folge.
- Hörkarten werden mit der Folge geschrieben, im selben Skript nach der Folge (`[[HOERKARTE: sbf:n]]`, Anhang A).
- **Einsatz:** „🎧 Erklärung hören“ nach einer falschen Antwort, Nachhilfe-Folge, Schnellspur.

### 12.4 Nachhilfe-Folge

- **Persönlich:** die Hörkarten deiner roten, orangen und „Tricky“-Fragen, höchstens etwa 25 Karten (etwa 12 Minuten).
- **Damit sie nicht abgehackt wirkt (V41):**
  - Die Karten stehen in der Reihenfolge des Kurses, nach Kapiteln gruppiert.
  - Feste Überleitungen (feste Sätze, R10):
    - am Anfang: „Moin. Nachsitzen. Heute deine Wackelkandidaten.“,
    - beim Kapitelwechsel: „Jetzt die Lichter.“,
    - in der Mitte Klabauter: „Halbzeit! Halbzeit!“,
    - am Schluss Smillas Antreiben (V38).
  - Nach je drei bis vier Karten eine kurze Atempause mit Überleitung.
  - Die Denkpause jeder Karte bleibt.
- Die Überleitungen sind etwa 40 feste Sätze, einmal erzeugt.

### 12.5 Schnellspur

- Alle 285 Hörkarten in der Reihenfolge des Kurses. Jedes Kapitel bekommt einen kurzen Rahmen: den Kapitelüberblick in drei Sätzen (feste Sätze).
- Etwa zwei Stunden.
- Für die Wiederholung vor der Prüfung und für alle, die es eilig haben („so schnell wie möglich durch die Prüfung“).

### 12.6 Einbindung in die App

- **„Kurs für heute“ (V37):** Im Rundgang gibt es den Happen „🎧 Nächste Folge“. In den Phasen Festigen und Prüfungsreife schlägt die App die Nachhilfe-Folge oder die Schnellspur vor.
- **„Meine Prüfungen“:** je Kapitel „gehört“ und der Kapitel-Check.
- **Lernstand:** ein neues Feld `S.kurs` mit dem Standard `{}` (R7), zum Beispiel `{modus, gehoert: {folge: [Abschnitte]}, tipp: {}}`. Antworten auf Antwortknöpfe laufen über dieselbe Funktion wie Quizantworten (`record`), damit Farben und Serien stimmen; der Tipp der Vorab-Frage steht nur in `S.kurs.tipp`.
- **Ziele (V42, §3.5):** ein neues Feld `S.ziele` mit Scheinen, Theorie- und Praxisterminen; Standardwert aus den alten Angaben (Prüfungsdatum je Schein, Lernzeit), damit alte Spielstände ohne Fehler laden (R7).
- **Alte Folgen** (`EPISODES`, `S.heard`) bleiben lesbar, bis der Kurs sie ersetzt (P70).

---

## 13. Kursplan (erzeugt)

So liest man die Tabellen:
- **Form:** siehe §6.
- **Fragen:** Nummern im SBF-See-Katalog. Teil G sind die Basisfragen, die auch für Binnen gelten.
- **Bild/Ton:** wie viele dieser Fragen ein Bild oder eine Tonfolge haben.
- **Revier:** das Revier der Hauptszene (§10.3).
- **Min.:** geplante Dauer der Folge.

<!-- KURSPLAN:START (erzeugt aus podcast/kursplan-sbf.json mit node tools/kursplan-pruefen.js --konzept; nicht von Hand ändern) -->

### Teil G: Grundkurs (für SBF See und SBF Binnen; 16 Folgen, 3 h 38 min)

**G0 Willkommen an Bord** – Wie der Kurs funktioniert und wer an Bord ist.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G0 | Leinen los: So funktioniert dein Kurs | Einführung | Hörspiel | – | – | Garn | hafen | 10 |

**G1 An Bord: wer führt, wer spricht wie** – Wer ein Boot führen darf, wer verantwortlich ist und welche Wörter man an Bord braucht.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G1.1 | Wer führt das Boot? | Regel für Regel | Besuch | 1, 2, 59 | 0 | Gast (Wasserschutzpolizistin) | hafen | 13 |
| G1.2 | Die Sprache an Bord | System zuerst | Törn | 3, 6, 8, 9 | 0 | Kopfkino | frei | 14 |

**G2 Boot, Antrieb und Motor** – Wie ein Boot sich bewegt und lenkt, und wie man den Motor behandelt, damit er nicht streikt.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G2.1 | Propeller, Ruder und Radeffekt | System zuerst | Duell | 41, 44–48, 50, 51 | 0 | Fehler-Detektiv | hafen | 15 |
| G2.2 | Den Motor im Blick | System zuerst | Hörspiel | 42, 52–57, 60 | 0 | Garn | frei | 15 |

**G3 Manövrieren** – Anlegen, Ankern und was passiert, wenn große Schiffe vorbeikommen.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G3.1 | Anlegen und Ankern | Regel für Regel | Besuch | 35, 39, 40 | 0 | Gast (Hafenmeisterin) | hafen | 14 |
| G3.2 | Große Schiffe, kleine Boote | System zuerst | Garn-Abend | 34, 36, 37, 61 | 0 | Kopfkino | fluss | 13 |

**G4 Sicherheit an Bord** – Was an Bord brennen oder explodieren kann, wie man es verhindert und was im Ernstfall zählt.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G4.1 | Sprit und Gas: was sich in der Bilge sammelt | System zuerst | Hörspiel | 43, 49, 62–66 | 0 | Stichprobe | hafen | 15 |
| G4.2 | Feuer, Westen und der Ernstfall | Regel für Regel | Törn | 67–70, 72 | 0 | Garn | frei | 15 |

**G5 Grundregeln unterwegs** – Wie Schiffe nachts zeigen, wer sie sind, und die zwei Ausweichregeln, die für alle gelten.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G5.1 | Lichter: Wer bin ich, wohin fahre ich? | System zuerst | Hörspiel | 7, 10–13 | 0 | Kopfkino | frei | 15 |
| G5.2 | Wer weicht aus? Die zwei Grundregeln | Regel für Regel | Duell | 14, 15 | 0 | Streitgespräch | frei | 13 |

**G6 Zeichen am Ufer** – Tafeln, Lichter und Töne, mit denen die Wasserstraße zu dir spricht.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G6.1 | Verbote: was die roten Tafeln sagen | System zuerst | Törn | 17–19, 22, 23, 27 | 6 | Fehler-Detektiv | fahrwasser | 13 |
| G6.2 | Gebote, Hinweise und die Länge eines Tons | System zuerst | Unterricht | 4, 5, 16, 20, 24–26 | 5 | Ton-Labor | fahrwasser | 14 |
| G6.3 | Brücken und Schleusen | Regel für Regel | Besuch | 21, 28–30 | 4 | Kopfkino (Quirin zu Besuch (Binnen-Profi, Hauptfigur erst in Teil B)) | schleuse | 12 |

**G7 Natur und Wetter** – Rücksicht auf Tiere und Pflanzen, und warum man das Wetter vor jeder Fahrt prüft.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G7.1 | Natur schützen, Wetter lesen | Regel für Regel | Garn-Abend | 31–33, 38, 58, 71 | 0 | Garn | binnensee | 15 |

**G8 Grundkurs-Check** – Alles aus dem Grundkurs, gemischt und im Vergleich.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| G8 | Grundkurs-Check mit Harms | Vergleich | Duell | Bezug: 28 Fragen | – | Stichprobe | an Land | 12 |

### Teil S: See (für SBF See; 44 Folgen, 10 h 21 min)

**S1 Recht auf See** – Welche Regeln auf See gelten, wer verantwortlich ist und was Sorgfalt heißt.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S1.1 | Welche Regeln gelten wo? | System zuerst | Törn | 73, 74, 152, 153 | 0 | Garn | fahrwasser | 13 |
| S1.2 | Fahrerlaubnis, Verantwortung, Sorgfalt | Regel für Regel | Unterricht | 75–78, 89, 90 | 0 | Stichprobe | hafen | 15 |

**S2 Ausweichen auf See** – Woran man Kollisionsgefahr erkennt, wer ausweicht, wer Kurs hält und was im letzten Augenblick zu tun ist.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S2.1 | Wann wird es gefährlich? Peilung, Ausguck, AIS | System zuerst | Hörspiel | 125, 272, 273 | 0 | Kopfkino | frei | 13 |
| S2.2 | Begegnen, Kreuzen, Überholen, Segeln | Regel für Regel | Törn | 81, 126, 127, 137 | 0 | Streitgespräch | frei | 15 |
| S2.3 | Wer hat Vorrang? Die Rangfolge | System zuerst | Unterricht | 82, 83, 128–132 | 0 | Fehler-Detektiv | frei | 15 |
| S2.4 | Kurshalter und der letzte Augenblick | Regel für Regel | Hörspiel | 79, 80, 135, 136, 139, 140 | 1 | Ton-Labor | frei | 15 |

**S3 Lichter und Signalkörper** – Wer nachts und tagsüber welche Zeichen führt und was sie über die Lage verraten.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S3.1 | Das Lichtersystem | System zuerst | Törn | 85, 86, 91, 92, 113, 159, 160 | 2 | Kopfkino | frei | 15 |
| S3.2 | Vor Anker und auf Grund | System zuerst | Hörspiel | 105–107, 114, 115 | 4 | Stichprobe | frei | 14 |
| S3.3 | Schlepper und Schleppverbände | Regel für Regel | Garn-Abend | 93–96 | 2 | Garn | fahrwasser | 13 |
| S3.4 | Manövrierunfähig | Regel für Regel | Hörspiel | 97–101 | 3 | Fehler-Detektiv | frei | 14 |
| S3.5 | Manövrierbehindert und Bagger | System zuerst | Duell | 102–104, 148–150 | 6 | Streitgespräch | fahrwasser | 15 |
| S3.6 | Tiefgangbehinderte und Fischer | Regel für Regel | Besuch | 108–112, 133, 134 | 7 | Gast (Fischer) | frei | 15 |

**S4 Hören statt sehen** – Was bei Nebel gilt und wie man Fahrzeuge an ihren Tönen erkennt.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S4.1 | Nebel: langsam, horchen, Ausguck | Regel für Regel | Hörspiel | 84, 138, 274 | 0 | Kopfkino | frei | 13 |
| S4.2 | Wer tutet da? Nebelsignale in Fahrt | System zuerst | Duell | 116–121 | 0 | Ton-Labor | frei | 15 |
| S4.3 | Glocke, Gong und Warnsignale | System zuerst | Garn-Abend | 122–124, 141, 162–164 | 4 | Stichprobe | frei | 14 |

**S5 Tonnen und Feuer** – Wie Leuchtfeuer sprechen und wie Tonnen den Weg zeigen.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S5.1 | Wie Feuer sprechen: Kennungen | System zuerst | Unterricht | 215, 220–224 | 0 | Kopfkino | frei | 14 |
| S5.2 | Das Fahrwasser und seine Seiten | System zuerst | Törn | 156, 157, 190–194 | 5 | Streitgespräch | fahrwasser | 15 |
| S5.3 | Abzweigungen und Leuchttonnen | Regel für Regel | Hörspiel | 195–199 | 2 | Stichprobe | fahrwasser | 13 |
| S5.4 | Kardinalzeichen: die Uhr im Wasser | System zuerst | Unterricht | 200–207 | 8 | Garn | frei | 15 |
| S5.5 | Einzelgefahr, Leit-, Richt- und Quermarkenfeuer | System zuerst | Törn | 208–214 | 1 | Fehler-Detektiv | fahrwasser | 15 |

**S6 Fahrwasser und besondere Gebiete** – Was im Fahrwasser anders ist, wo man nicht hin darf und wie Kanal und Verkehrstrennungsgebiet funktionieren.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S6.1 | Regeln im Fahrwasser | Regel für Regel | Duell | 161, 165–168, 271 | 0 | Streitgespräch | fahrwasser | 15 |
| S6.2 | Baden, Wasserski und Ankerverbot | Regel für Regel | Hörspiel | 169–171, 179–182 | 3 | Kopfkino | frei | 14 |
| S6.3 | Behörden und Gefahrgut: wer da kommt | Regel für Regel | Besuch | 151, 154, 155, 185, 186 | 4 | Gast (Wasserschutzpolizistin) | fahrwasser | 13 |
| S6.4 | Gesperrt! Sperr- und Warngebiete | System zuerst | Hörspiel | 177, 183, 184, 187–189 | 5 | Fehler-Detektiv | frei | 13 |
| S6.5 | Der Nord-Ostsee-Kanal, Brücken und Schleusen | Regel für Regel | Garn-Abend | 173–176, 178 | 2 | Garn (Quirin zu Besuch (Binnen-Profi, Hauptfigur erst in Teil B)) | nok | 13 |
| S6.6 | Verkehrstrennungsgebiete und Verkehrszentralen | System zuerst | Besuch | 87, 88, 142–147, 158 | 0 | Gast (Verkehrszentrale) | vtg | 16 |

**S7 Navigation und Gezeiten** – Seekarte, Kompass, Peilung, Koppeln, Gezeiten und wie die Kartenaufgabe der Prüfung abläuft.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S7.1 | Seekarte und nautische Bücher | System zuerst | Unterricht | 231, 232, 234–239 | 0 | Stichprobe | an Land | 14 |
| S7.2 | Seemeile, Knoten, Kompass, Peilung | System zuerst | Törn | 240–244, 248 | 0 | Kopfkino | frei | 14 |
| S7.3 | Koppeln, Versetzung und die Kartenaufgabe | Kartenaufgabe | Garn-Abend | 245–247 | 0 | Fehler-Detektiv | an Land | 15 |
| S7.4 | Ebbe und Flut | System zuerst | Hörspiel | 233, 249–255 | 0 | Garn | watt | 15 |

**S8 Natur auf See** – Nationalpark Wattenmeer, Schutzgebiete und was man für saubere Gewässer tut.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S8.1 | Wattenmeer und Nationalparks | Regel für Regel | Besuch | 216–219, 225 | 0 | Gast (Rangerin im Nationalpark) | watt | 14 |
| S8.2 | Befahrensregeln und saubere See | Regel für Regel | Törn | 226–230 | 0 | Stichprobe | frei | 12 |

**S9 Wetter, Seemannschaft und Seenot** – Wetter lesen, schweres Wetter vorbereiten, Mensch über Bord und was in Seenot zählt.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S9.1 | Hoch, Tief und die Wetterkarte | System zuerst | Hörspiel | 260, 262–266 | 3 | Kopfkino | frei | 14 |
| S9.2 | Wind in Zahlen: Beaufort und Warnungen | Regel für Regel | Unterricht | 261, 267–270 | 0 | Garn | hafen | 14 |
| S9.3 | Schweres Wetter und Schleppen | Regel für Regel | Garn-Abend | 256–259, 275 | 0 | Fehler-Detektiv | frei | 14 |
| S9.4 | Mensch über Bord und Kentern | Regel für Regel | Hörspiel | 276–278 | 0 | Kopfkino | frei | 14 |
| S9.5 | Seenot: Notsignale und Pflichten | System zuerst | Garn-Abend | 172, 279–285 | 3 | Garn | frei | 15 |

**S10 Die praktische Prüfung** – Knoten und Manöver, wie sie in der Prüfung verlangt werden, mit der App zum Üben.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S10.1 | Knoten für die Prüfung | Praxis | Unterricht | – | – | Kopfkino | hafen | 13 |
| S10.2 | Manöver für die Prüfung | Praxis | Törn | – | – | Stichprobe | hafen | 15 |

**S11 Prüfungsreife** – Was man verwechselt, im direkten Vergleich, und eine Generalprobe mit Harms.

| Folge | Titel | Form | Rahmen | Fragen | Bild/Ton | Baustein | Revier | Min. |
|---|---|---|---|---|---|---|---|---|
| S11.1 | Hörprüfung: alle Schallsignale | Vergleich | Duell | Bezug: 24 Fragen | – | Ton-Labor | frei | 14 |
| S11.2 | Lichter und Signalkörper im Vergleich | Vergleich | Törn | Bezug: 33 Fragen | – | Kopfkino | frei | 14 |
| S11.3 | Wer weicht wo aus? | Vergleich | Duell | Bezug: 22 Fragen | – | Streitgespräch | frei | 13 |
| S11.4 | Zahlen, Fristen, Behörden | Vergleich | Garn-Abend | Bezug: 24 Fragen | – | Fehler-Detektiv | an Land | 12 |
| S11.5 | Generalprobe mit Harms | Vergleich | Duell | Bezug: 20 Fragen | – | Stichprobe | an Land | 15 |

**Zusammen:** 60 Folgen, 13 h 59 min; 285 von 285 Katalogfragen. **Rahmen:** Hörspiel 15, Törn 12, Unterricht 8, Garn-Abend 9, Duell 9, Besuch 7.

<!-- KURSPLAN:END -->

---

## 14. Folgen-Steckbriefe (erzeugt)

Je Folge stehen hier:
- die Fragen (Kurzform → Kern der amtlichen Antwort),
- welche davon ausführlich erklärt werden (Schwerpunkt),
- Baustein, Revier und Szene,
- die Animationen für den interaktiven Modus,
- „Praxis und Hintergrund“ aus der Recherche,
- die Recherche-Nummern,
- und was noch fehlt („Wartet auf“).

Den vollen Wortlaut aller Fragen mit allen vier amtlichen Antworten enthält `docs/kurs-fragen-sbf.md`.

<!-- STECKBRIEFE:START (erzeugt aus podcast/kursplan-sbf.json mit node tools/kursplan-pruefen.js --konzept; nicht von Hand ändern) -->

### Teil G: Grundkurs

#### Kapitel G0: Willkommen an Bord

*Kapitelüberblick (Anfang der ersten Folge):* Wie der Kurs funktioniert und wer an Bord ist.

**G0 Leinen los: So funktioniert dein Kurs** · Einführung · Hörspiel · 10 min
- **Lage:** Erster Morgen in Flensburg: Hinnerk sucht den Zündschlüssel, Klabauter hat ihn im Zwieback versteckt. Beim Suchen stellt sich die Crew vor.
- **Baustein:** Garn · **Revier:** hafen · **Szene:** Heimathafen Flensburg, am Steg
- **Praxis und Hintergrund:** Die Crew stellt sich vor. Wie man mit dem Kurs lernt: Auto- und interaktiver Modus, Denkpausen, Fragen nach jeder Folge, Nachhilfe, Schnellspur. Woran man Garn erkennt und woran einen Merksatz (Klabauters Glocke). Harms erklärt die Prüfung, sobald der Ablauf am Original geprüft ist. Der Kurs ersetzt keine praktische Ausbildung.
- **Recherche:** R1, R2, R3, R48
- **Wartet auf:** Prüfungsablauf am Original (SpFV Anlage 3, F3)

#### Kapitel G1: An Bord: wer führt, wer spricht wie

*Kapitelüberblick (Anfang der ersten Folge):* Wer ein Boot führen darf, wer verantwortlich ist und welche Wörter man an Bord braucht.

**G1.1 Wer führt das Boot?** · Regel für Regel · Besuch · 13 min
- **Lage:** Die Wasserschutzpolizei kontrolliert am Steg: Wer ist hier eigentlich der Schiffsführer?
- **Fragen (3):** 1 Was ist zu tun, wenn vor Antritt der Fahrt nicht …? → Der verantwortliche Schiffsführer muss bestimmt werden · 2 In welchen Fällen darf weder ein Sportboot geführt noch …? → Wenn man infolge körperlicher oder geistiger Mängel … · 59 Unter welchen Voraussetzungen darf ein Sportboot mit …? → Die Antriebsleistung beträgt höchstens 7,5 Kilowatt …
- **Ausführlich erklären:** 2; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Gast mit Wasserschutzpolizistin (POLIZEI) · **Revier:** hafen · **Szene:** Kontrolle am Steg
- **Praxis und Hintergrund:** Vor dem Ablegen den Schiffsführer festlegen. Nüchtern fahren (Promillegrenze am Original prüfen). Papiere griffbereit, Rettungswesten an Bord und tragen. Die Polizistin erzählt, was bei Kontrollen auffällt.
- **Recherche:** R14, R15, R16

**G1.2 Die Sprache an Bord** · System zuerst · Törn · 14 min
- **Lage:** Erste Ausfahrt auf der Flensburger Förde: Smilla zeigt alles am Boot, Hinnerk fragt die Wörter ab.
- **Fragen (4):** 3 Wann ist ein Fahrzeug in Fahrt? → Wenn es weder vor Anker liegt noch an Land … · 6 Wann gilt ein Fahrzeug unter Segel als Maschinenfahrzeug? → Wenn es gleichzeitig mit Maschinenkraft fährt · 8 Welche Seite wird als Luvseite bezeichnet? → Die dem Wind zugekehrte Seite · 9 Welche Seite wird als Leeseite bezeichnet? → Die dem Wind abgewandte Seite
- **Ausführlich erklären:** 3, 6, 8; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Flensburger Förde
- **Bild und Animation (interaktiv):** Das Boot und seine Seiten, Wind und Segel
- **Praxis und Hintergrund:** Vortraining für den ganzen Kurs: Bug, Heck, Backbord, Steuerbord, achtern, Luv und Lee. Backbord ist rot wie Portwein; Luv ist, wo die Luft herkommt. Ein Segelboot mit laufendem Motor ist ein Maschinenfahrzeug.
- **Recherche:** R41, R42, R49

#### Kapitel G2: Boot, Antrieb und Motor

*Kapitelüberblick (Anfang der ersten Folge):* Wie ein Boot sich bewegt und lenkt, und wie man den Motor behandelt, damit er nicht streikt.

**G2.1 Propeller, Ruder und Radeffekt** · System zuerst · Duell · 15 min
- **Lage:** Anlege-Wettstreit im Hafenbecken an der Schlei: Hinnerk gegen Smilla, und der Radeffekt spielt mit.
- **Fragen (8):** 41 Wie verhält sich im Allgemeinen das Schiff im …? → Das Heck dreht nach Backbord · 44 Was ist unter einem rechtsdrehenden Propeller zu verstehen? → Von achtern gesehen in Vorausfahrt Drehung des … · 45 Was ist unter einem linksdrehenden Propeller zu verstehen? → Von achtern gesehen in Vorausfahrt Drehung des … · 46 Was ist unter der indirekten Ruderwirkung (Radeffekt) des …? → Das seitliche Versetzen des Hecks · 47 Weshalb ist die Kenntnis der Propellerdrehrichtung von …? → Sie hilft beim Manövrieren · 48 Welche Anlegeseite ist mit rechtsdrehendem Propeller …? → Die Backbordseite - der Radeffekt zieht das Fahrzeug … · 50 Wodurch wird bei einem Fahrzeug mit Außenbordmotor und …? → Durch Schraubenstrom und Richtung des Propellers · 51 Weshalb setzt bei einem Fahrzeug mit Einbaumaschine und …? → Weil sie erst mit Anströmung des Ruderblattes einsetzt
- **Ausführlich erklären:** 41, 46, 48; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** hafen · **Szene:** Hafenbecken an der Schlei
- **Bild und Animation (interaktiv):** Radeffekt
- **Praxis und Hintergrund:** Den Radeffekt am eigenen Boot testen: aus dem Stand kräftig rückwärts. Ein rechtsdrehender Propeller versetzt das Heck rückwärts nach Backbord, daher Anlegen an Backbord. Außenborder lenken über den Schraubenstrom; bei starrer Welle wirkt das Ruder rückwärts erst mit Anströmung.
- **Recherche:** R21

**G2.2 Den Motor im Blick** · System zuerst · Hörspiel · 15 min
- **Lage:** Vor Laboe wird der Motor heiß und die Ladelampe geht nicht aus: Die Crew sucht den Fehler, Kreislauf für Kreislauf.
- **Fragen (8):** 42 Was bewirkt der Quickstopp? → Unterbrechung von Zündkontakt bzw. Kraftstoffzufuhr · 52 Während der Fahrt sollte die Maschinenanlage ständig …? → Motortemperatur, Öldruck, Ladekontrolle · 53 Die Temperatur der Antriebsmaschine überschreitet die …? → Defektes Thermostat, defekte Impellerpumpe, … · 54 Die Ladekontrolllampe erlischt nach dem Starten nicht. Was …? → Lichtmaschine bzw. Regler der Lichtmaschine defekt · 55 Die Ölkontrollleuchte leuchtet nach dem Starten weiter. …? → Druckschalter bzw. Öldruckpumpe defekt · 56 Der Motor ist gestartet worden. Was kann die Ursache sein, …? → Blockierter Propeller · 57 Ein Außenborder mit gefülltem Tank bleibt während der …? → Belüftungsschraube geschlossen; verstopfte … · 60 Welche Vorkehrungen sind für das längere Verlassen des …? → Alle Seeventile schließen und den Hauptschalter des …
- **Ausführlich erklären:** 52, 53, 57; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** frei · **Szene:** Ostsee vor Laboe
- **Bild und Animation (interaktiv):** Die vier Kreisläufe des Motors
- **Praxis und Hintergrund:** Vier Kreisläufe: Kühlwasser, Öl, Strom, Kraftstoff. Nach dem Start Kühlwasser am Auspuff prüfen; Seewasserfilter und Impeller kennen; die Quickstopp-Leine anlegen. Motorprobleme sind der häufigste Grund, warum die Seenotretter zu Wassersportlern fahren. Beim Verlassen Seeventile zu, Hauptschalter aus.
- **Recherche:** R9, R22

#### Kapitel G3: Manövrieren

*Kapitelüberblick (Anfang der ersten Folge):* Anlegen, Ankern und was passiert, wenn große Schiffe vorbeikommen.

**G3.1 Anlegen und Ankern** · Regel für Regel · Besuch · 14 min
- **Lage:** Die Hafenmeisterin von Eckernförde schaut beim Anlegen zu und gibt Tipps.
- **Fragen (3):** 35 Warum soll man möglichst gegen Strom und Wind anlegen? → Weil sich das Fahrzeug dabei sicherer manövrieren lässt · 39 Woran kann man erkennen, ob der Anker hält? → Wenn beim Handauflegen auf die Ankerkette oder -leine … · 40 Welches ist der günstigste Anlaufwinkel beim Anlegen? → Ein möglichst spitzer Winkel
- **Ausführlich erklären:** 35, 40; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Gast mit Hafenmeisterin (HAFENMEISTER) · **Revier:** hafen · **Szene:** Stadthafen Eckernförde
- **Bild und Animation (interaktiv):** Anlegen
- **Praxis und Hintergrund:** Fender und Leinen klar, bevor man in den Hafen fährt. Gegen Wind oder Strom und in spitzem Winkel anlegen, den Radeffekt nutzen. Ankern: als grobe Regel drei- bis fünfmal so viel Kette wie Wassertiefe, bei Wind mehr; Hand auf die Kette: ruckt sie nicht, hält der Anker.
- **Recherche:** R21, R24

**G3.2 Große Schiffe, kleine Boote** · System zuerst · Garn-Abend · 13 min
- **Lage:** Smilla erzählt vom Rhein bei Köln: wie sie als Kind den Sog eines Schubverbands erlebt hat.
- **Fragen (4):** 34 Warum soll ein kleines Fahrzeug nicht dicht an ein großes …? → Es kann durch dessen Bug- oder Heckwelle kentern oder … · 36 Wie verhält man sich beim Begegnen mit anderen Fahrzeugen …? → Geschwindigkeit herabsetzen und ausreichenden … · 37 Welche Gefahren können entstehen, wenn ein kleines von …? → Das kleinere Fahrzeug kann durch Stau, Sog oder … · 61 Wie ist ein enges Gewässer zu befahren, wenn man sich am …? → Verringerung der Geschwindigkeit, um schädlichen Sog …
- **Ausführlich erklären:** 34, 37; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** fluss · **Szene:** Rhein bei Köln (Smillas Heimat)
- **Bild und Animation (interaktiv):** Sog und Schwell
- **Praxis und Hintergrund:** Bug- und Heckwelle, Sog und Stau großer Schiffe. Abstand halten, in engem Fahrwasser langsam begegnen, langsam an festgemachten Booten vorbei. Smilla kennt das vom Rhein, der verkehrsreichsten Binnenwasserstraße Europas.
- **Recherche:** R40

#### Kapitel G4: Sicherheit an Bord

*Kapitelüberblick (Anfang der ersten Folge):* Was an Bord brennen oder explodieren kann, wie man es verhindert und was im Ernstfall zählt.

**G4.1 Sprit und Gas: was sich in der Bilge sammelt** · System zuerst · Hörspiel · 15 min
- **Lage:** An der Bootstankstelle riecht es nach Gas: Was tun, bevor jemand einen Schalter drückt?
- **Fragen (7):** 43 Was ist zu unternehmen, wenn Treibstoff oder Öl in die …? → Mit Lappen aufnehmen und umweltgerecht entsorgen · 49 Was muss beim Tanken beachtet werden? → Motor abstellen, keine elektrischen Schalter … · 62 Wo sollen die Gasbehälter einer Flüssiggasanlage gelagert …? → Möglichst an Deck, geschützt vor Sonneneinstrahlung, … · 63 Warum sind die Flüssiggase Propan und Butan an Bord …? → Beide Gase sind schwerer als Luft und bilden mit Luft … · 64 Was ist zu tun, wenn Flüssiggas in das Innere des Bootes …? → Gaszuführung absperren und für Lüftung sorgen. … · 65 Was ist vor Inbetriebnahme einer Flüssiggasanlage zu prüfen? → Die Anlage muss abgenommen sein, Leitungen und … · 66 Was ist zu beachten, wenn eine Flüssiggasanlage außer …? → Haupthahn und Absperrventile sind zu schließen
- **Ausführlich erklären:** 49, 63, 64; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Stichprobe · **Revier:** hafen · **Szene:** Bootstankstelle
- **Bild und Animation (interaktiv):** Gas sinkt nach unten
- **Praxis und Hintergrund:** Gas und Benzindämpfe sind schwerer als Luft und sammeln sich unten im Boot; schon wenige Prozent in der Luft sind explosionsfähig. Beim Tanken Motor aus, keine Schalter, Luken zu. Gasflaschen an Deck. Bei Gasgeruch Hahn zu und lüften. Öl in der Bilge mit Lappen aufnehmen und an Land entsorgen.
- **Recherche:** R23

**G4.2 Feuer, Westen und der Ernstfall** · Regel für Regel · Törn · 15 min
- **Lage:** Sicherheitseinweisung vor dem Ablegen, dann draußen in der Kieler Bucht eine Feuerübung.
- **Fragen (5):** 67 Wie oft muss man aufblasbare Rettungsmittel warten lassen? → Entsprechend der Herstellerangabe, mindestens alle 2 … · 68 Welcher Feuerlöscher ist für Sportboote zweckmäßig und wie …? → ABC-Pulver- und Schaumlöscher, mindestens alle 2 Jahre · 69 Welche Maßnahmen muss man ergreifen, um einen Brand mit …? → Luftzufuhr verhindern, Feuerlöscher erst am Brandherd … · 70 Wie hat man sich nach einem Zusammenstoß zu verhalten? → Hilfe leisten und so lange am Unfallort bleiben, bis … · 72 In welcher Situation dürfen Notsignale gegeben werden? → Wenn Gefahr für Leib oder Leben von Personen besteht …
- **Ausführlich erklären:** 69, 70, 72; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** frei · **Szene:** Kieler Bucht
- **Praxis und Hintergrund:** Rettungsweste tragen, nicht nur an Bord haben: Der Kälteschock in der ersten Minute ist die größte Gefahr. Hilfe rufen: Kanal 16 (mit Funkzeugnis) oder 124 124 per Handy in Küstennähe. Hinnerks Geschichte: wie die Seenotretter nach dem Untergang der Bark „Johanne“ entstanden.
- **Recherche:** R10, R11, R12, R13, R14

#### Kapitel G5: Grundregeln unterwegs

*Kapitelüberblick (Anfang der ersten Folge):* Wie Schiffe nachts zeigen, wer sie sind, und die zwei Ausweichregeln, die für alle gelten.

**G5.1 Lichter: Wer bin ich, wohin fahre ich?** · System zuerst · Hörspiel · 15 min
- **Lage:** Nachts vor Fehmarn taucht ein Licht auf: Was ist das, und wohin fährt es?
- **Fragen (5):** 7 Welches Signal führt ein Fahrzeug unter Segel, das als …? → Einen schwarzen Kegel, Spitze unten · 10 Wann müssen die Lichter von Fahrzeugen geführt oder …? → Von Sonnenuntergang bis Sonnenaufgang und bei … · 11 Wozu dient die Lichterführung? → Sie zeigt Fahrtrichtung und Lage eines Fahrzeugs an · 12 Was für eine Laterne kann ein Segelfahrzeug von weniger …? → Eine Dreifarbenlaterne an oder nahe der Mastspitze · 13 Welche Lichter muss ein Fahrzeug unter Segel, das …? → Die für ein Maschinenfahrzeug vorgeschriebenen Lichter
- **Ausführlich erklären:** 11, 12, 13; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Nachts vor Fehmarn
- **Bild und Animation (interaktiv):** Lichterkarussell
- **Praxis und Hintergrund:** Rot links, grün rechts, weiß hinten und bei Maschine oben: Aus den Farben liest man Richtung und Art des Fahrzeugs. Backbords Halsband mit rotem und grünem Lämpchen als Merkhilfe. Motor an heißt Maschinenfahrzeug, auch unter Segeln: Dreifarbenlaterne aus, am Tag Kegel Spitze unten.
- **Recherche:** R41

**G5.2 Wer weicht aus? Die zwei Grundregeln** · Regel für Regel · Duell · 13 min
- **Lage:** Hinnerk und Smilla streiten, wer ausweichen muss; der Hörer ist Schiedsrichter.
- **Fragen (2):** 14 Wie weichen zwei Motorboote aus, die sich auf …? → Jedes Fahrzeug muss seinen Kurs nach Steuerbord ändern · 15 Zwei Motorboote nähern sich auf kreuzenden Kursen. Es …? → Dasjenige Fahrzeug muss ausweichen, welches das …
- **Ausführlich erklären:** 14, 15; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Streitgespräch · **Revier:** frei · **Szene:** Kieler Förde, außerhalb des Fahrwassers
- **Bild und Animation (interaktiv):** Begegnung von oben
- **Praxis und Hintergrund:** Entgegen: beide nach Steuerbord. Kreuzen: Wer den anderen rechts hat, weicht aus. Früh und deutlich ausweichen, hinter dem Heck vorbei. Merkhilfe mit Geltungsbereich: Siehst du Rot, musst du handeln (kreuzende Maschinenfahrzeuge).
- **Recherche:** R43

#### Kapitel G6: Zeichen am Ufer

*Kapitelüberblick (Anfang der ersten Folge):* Tafeln, Lichter und Töne, mit denen die Wasserstraße zu dir spricht.

**G6.1 Verbote: was die roten Tafeln sagen** · System zuerst · Törn · 13 min
- **Lage:** Fahrt durch einen Kanal mit Engstelle: Tafel für Tafel, was hier verboten ist.
- **Fragen (6):** 17 [Bild] → Überholverbot · 18 [Bild] → Begegnungsverbot an einer Engstelle · 19 [Bild] → Sog und Wellenschlag vermeiden · 22 [Bild] → Ankern verboten für alle Fahrzeuge · 23 [Bild] → Festmache- und Liegeverbot · 27 [Bild] → Verbot der Durchfahrt und Sperrung der Schifffahrt
- **Ausführlich erklären:** 17, 19, 27; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** fahrwasser · **Szene:** Kanal mit Engstelle
- **Bild und Animation (interaktiv):** Tafelzeichen nach Familien
- **Praxis und Hintergrund:** Die Logik der Tafeln: weiße Tafel mit rotem Rand und rotem Schrägstrich verbietet (Überholen, Begegnen, Sog und Wellenschlag, Ankern, Festmachen und Liegen). Die Ausnahme ist die rote Tafel mit weißem Querbalken: Durchfahrt verboten, die Schifffahrt ist gesperrt. Wer die Logik kennt, muss nicht jede Tafel einzeln pauken.
- **Recherche:** R29

**G6.2 Gebote, Hinweise und die Länge eines Tons** · System zuerst · Unterricht · 14 min
- **Lage:** Am Flussabschnitt mit vielen Tafeln: Smilla erklärt Gebote und Hinweise, mit dem Horn üben alle den langen Ton.
- **Fragen (7):** 4 Wie lang ist die Dauer eines kurzen Tons (●)? → Etwa 1 Sekunde · 5 Wie lang ist die Dauer eines langen Tons (▬)? → Etwa 4 - 6 Sekunden · 16 [Bild] → Bleib-weg-Signal, Gefahrenbereich sofort verlassen · 20 [Bild] → Mindestabstand in Metern, der in der nachfolgenden … · 24 [Bild] → Abgabe eines langen Tons · 25 [Bild] → Wasserflächen, auf denen mit Wasserski oder … · 26 [Bild] → Ende einer Gebots- oder Verbotsstrecke
- **Ausführlich erklären:** 4, 5, 16, 24; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Ton-Labor · **Revier:** fahrwasser · **Szene:** Flussabschnitt mit Tafeln
- **Bild und Animation (interaktiv):** Tafelzeichen nach Familien, Schallsignale sichtbar
- **Praxis und Hintergrund:** Kurz ist etwa eine Sekunde, lang vier bis sechs. Gebote haben einen roten Rand ohne Schrägstrich: Schallzeichen geben (ein langer Ton), Mindestabstand in Metern einhalten. Das Bleib-weg-Signal (im Katalogbild kurz, lang, fünfmal) heißt: sofort den Gefahrenbereich verlassen. Blaue Tafeln weisen hin: Flächen für Wasserski und Wassermotorräder; blau mit weißem Schrägstrich ist das Ende einer Gebots- oder Verbotsstrecke.
- **Recherche:** R29

**G6.3 Brücken und Schleusen** · Regel für Regel · Besuch · 12 min
- **Lage:** Quirin kommt zu Besuch und wartet mit der Crew vor einer Schleuse. Hier ist er zu Hause, Hinnerk nicht.
- **Fragen (4):** 21 [Bild] → Haltegebot vor beweglichen Brücken, Sperrwerken und … · 28 [Bild] → Brücke, Sperrwerk oder Schleuse geschlossen · 29 [Bild] → Anlage dauerhaft gesperrt · 30 [Bild] → Einfahrt frei, Gegenverkehr gesperrt
- **Ausführlich erklären:** 21, 30; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino mit Quirin zu Besuch (Binnen-Profi, Hauptfigur erst in Teil B) (QUIRIN) · **Revier:** schleuse · **Szene:** Schleuse am Kanal
- **Bild und Animation (interaktiv):** Tafelzeichen nach Familien
- **Praxis und Hintergrund:** Vor beweglichen Brücken, Sperrwerken und Schleusen am Haltegebot warten, die Lichter vor der Schleuse lesen, Fender und Leinen vorher klar. Quirin ist zu Besuch und kennt Schleusen von Donau und Main-Donau-Kanal (dort fährt er sein Boot), Smilla vom Rhein; Hinnerk ist auf Binnengewässern ungeübt und fragt.
- **Recherche:** R40

#### Kapitel G7: Natur und Wetter

*Kapitelüberblick (Anfang der ersten Folge):* Rücksicht auf Tiere und Pflanzen, und warum man das Wetter vor jeder Fahrt prüft.

**G7.1 Natur schützen, Wetter lesen** · Regel für Regel · Garn-Abend · 15 min
- **Lage:** Am Schilfufer eines Sees erzählt Hinnerk seine Wetterregeln, Smilla prüft, was davon stimmt.
- **Fragen (6):** 31 Welches Merkblatt enthält Hinweise für das Verhalten zum …? → Die 10 goldenen Regeln für Wassersportler · 32 Wie kann mitgeholfen werden, die Lebensmöglichkeiten der …? → Durch umweltbewusstes Verhalten und Beachtung der … · 33 Warum sollte man sich von Schilf- und Röhrichtzonen sowie …? → Weil diese Zonen vielfach Rast- und Brutplätze … · 38 Wo finden Sie Informationen über umweltfreundliche Farben, …? → Beim Umweltbundesamt · 58 Welche Veröffentlichungen enthalten wichtige Regeln und …? → Nautische Publikationen wie „Sicherheit auf dem … · 71 Welche Faktoren sind hauptsächlich für das …? → Luftdruckänderung, Luftfeuchtigkeit und Temperatur
- **Ausführlich erklären:** 33, 71; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** binnensee · **Szene:** Schilfufer an einem See
- **Bild und Animation (interaktiv):** Warum der Wind weht
- **Praxis und Hintergrund:** Schilf und Röhricht sind Brut- und Rastplätze: weit weg bleiben. Die „10 goldenen Regeln“ für Wassersportler. Wetter entsteht aus Luftdruck, Feuchte und Temperatur; vor jeder Fahrt den Wetterbericht prüfen, bei Gewitter früh in den Hafen. Abendrot und Morgenrot sind nur Faustregeln.
- **Recherche:** R19, R38

#### Kapitel G8: Grundkurs-Check

*Kapitelüberblick (Anfang der ersten Folge):* Alles aus dem Grundkurs, gemischt und im Vergleich.

**G8 Grundkurs-Check mit Harms** · Vergleich · Duell · 12 min
- **Lage:** Harms ruft an: Grundkurs-Check. Hinnerk und Smilla raten mit, wer mehr weiß.
- **Bezug (Wiederholung):** 2, 4–6, 10, 12–17, 21, 27, 30, 33–35, 40, 41, 46, 48, 49, 63, 64, 68, 69, 71, 72
- **Baustein:** Stichprobe · **Revier:** an Land · **Szene:** Harms am Telefon
- **Bild und Animation (interaktiv):** Tafelzeichen nach Familien, Lichterkarussell
- **Praxis und Hintergrund:** Verschachtelt üben: ähnliche Fragen aus allen Kapiteln direkt nacheinander. Danach sitzen die Basisfragen der Prüfung.
- **Recherche:** R1, R52

### Teil S: See

#### Kapitel S1: Recht auf See

*Kapitelüberblick (Anfang der ersten Folge):* Welche Regeln auf See gelten, wer verantwortlich ist und was Sorgfalt heißt.

**S1.1 Welche Regeln gelten wo?** · System zuerst · Törn · 13 min
- **Lage:** Ansteuerung der Kieler Förde: Von der freien See ins Fahrwasser wechseln mit dem Revier auch die Regeln.
- **Fragen (4):** 73 Wo gelten die Kollisionsverhütungsregeln (KVR)? → Auf der Hohen See und auf den mit dieser … · 74 Was gilt, wenn eine Bestimmung der …? → Die Vorschrift der Seeschifffahrtsstraßen-Ordnung · 152 Wo ist festgelegt, welche Wasserflächen …? → Seeschifffahrtsstraßen-Ordnung und … · 153 Welche örtlichen Sondervorschriften zusätzlich zur …? → Die Bekanntmachungen der Generaldirektion …
- **Ausführlich erklären:** 73, 74; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** fahrwasser · **Szene:** Ansteuerung Kieler Förde
- **Bild und Animation (interaktiv):** Wo gilt was?
- **Praxis und Hintergrund:** Auf der Hohen See und den angrenzenden Gewässern gelten die Kollisionsverhütungsregeln, auf den Seeschifffahrtsstraßen geht die SeeSchStrO vor. Örtliche Sonderregeln stehen in Bekanntmachungen. Hinnerk erzählt, seit wann es die internationalen Regeln gibt.
- **Recherche:** R26

**S1.2 Fahrerlaubnis, Verantwortung, Sorgfalt** · Regel für Regel · Unterricht · 15 min
- **Lage:** Vor dem Ablegen in Flensburg: Papiere, Verantwortung und was ein guter Seemann zusätzlich tut.
- **Fragen (6):** 75 Welche Sportboote sind von der Fahrerlaubnispflicht auf …? → Sportboote ohne Antriebsmaschine oder solche mit … · 76 Wer ist für die Befolgung der Verkehrsvorschriften …? → Der Fahrzeugführer oder sein Stellvertreter · 77 Was bedeutet "seemännische Sorgfaltspflicht"? → Die Verpflichtung zur Beachtung von … · 78 Welche Sicherheitsmaßnahmen hat der Fahrzeugführer im …? → Der Fahrzeugführer hat die Besatzungsmitglieder und … · 89 Was bedeutet "in Sicht befindlich"? → Wenn jedes Fahrzeug vom anderen optisch wahrgenommen … · 90 Was bedeutet sichere Geschwindigkeit? → Die Geschwindigkeit muss der Verkehrslage, den Sicht- …
- **Ausführlich erklären:** 77, 78, 90; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Stichprobe · **Revier:** hafen · **Szene:** Vor dem Ablegen in Flensburg
- **Praxis und Hintergrund:** Sicherheitseinweisung vor jeder Fahrt: Westen, Feuerlöscher, Notsignale, Ablauf bei Mensch über Bord. Sichere Geschwindigkeit heißt: anhalten können, bevor es eng wird.
- **Recherche:** R14, R16

#### Kapitel S2: Ausweichen auf See

*Kapitelüberblick (Anfang der ersten Folge):* Woran man Kollisionsgefahr erkennt, wer ausweicht, wer Kurs hält und was im letzten Augenblick zu tun ist.

**S2.1 Wann wird es gefährlich? Peilung, Ausguck, AIS** · System zuerst · Hörspiel · 13 min
- **Lage:** Ein Frachter in der Kieler Bucht: Die Peilung steht, der Abstand schrumpft.
- **Fragen (3):** 125 Woran kann man feststellen, ob die Möglichkeit der Gefahr …? → Wenn sich der Abstand zum anderen Fahrzeug verringert … · 272 Wozu dient primär das Automatische Identifikationssystem …? → Der Kollisionsverhütung · 273 Welche Informationen können über das Automatische …? → Schiffsdaten (statisch und dynamisch), reisebezogene …
- **Ausführlich erklären:** 125; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Kieler Bucht
- **Bild und Animation (interaktiv):** Begegnung von oben
- **Praxis und Hintergrund:** Bleibt die Peilung stehen und wird der Abstand kleiner, droht ein Zusammenstoß. Peilen mit dem Handpeilkompass oder über eine feste Marke an Bord, etwa eine Want. AIS hilft, ersetzt aber nicht den Blick nach draußen.

**S2.2 Begegnen, Kreuzen, Überholen, Segeln** · Regel für Regel · Törn · 15 min
- **Lage:** Kieler Woche: viele Segel, drei Begegnungen, drei Regeln.
- **Fragen (4):** 81 Wann gilt ein Fahrzeug als überholendes Fahrzeug? → Wenn es sich einem anderen Fahrzeug aus einer … · 126 Zwei in Sicht befindliche Segelfahrzeuge nähern sich im …? → Das luvwärtige Fahrzeug dem leewärtigen Fahrzeug · 127 Wie müssen sich zwei in Sicht befindliche …? → Jedes Fahrzeug muss seinen Kurs nach Steuerbord ändern · 137 Wie hat sich ein überholendes Fahrzeug zu verhalten? → Es hat dem zu überholenden Fahrzeug auszuweichen
- **Ausführlich erklären:** 81, 126, 137; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Streitgespräch · **Revier:** frei · **Szene:** Kieler Förde zur Kieler Woche
- **Bild und Animation (interaktiv):** Begegnung von oben, Wind und Segel
- **Praxis und Hintergrund:** Der Überholer weicht immer aus, auch der Segler gegenüber dem Motorboot. Lee vor Luv, weil das luvwärtige Boot dem anderen sonst den Wind aus den Segeln nimmt. Wind von verschiedenen Seiten: Wer den Wind von Backbord hat, weicht aus.
- **Recherche:** R39, R42

**S2.3 Wer hat Vorrang? Die Rangfolge** · System zuerst · Unterricht · 15 min
- **Lage:** Am Kartentisch baut Smilla die Rangfolge auf: „Unser Boot fährt schön“.
- **Fragen (7):** 82 Wann ist ein Fahrzeug manövrierunfähig? → Wenn es wegen außergewöhnlicher Umstände, z. B. … · 83 Wann ist ein Fahrzeug manövrierbehindert? → Wenn es wegen der Art seines Einsatzes behindert ist … · 128 Wie hat sich ein Maschinenfahrzeug im freien Seeraum oder …? → Das Maschinenfahrzeug muss ausweichen · 129 Wie hat sich ein Maschinenfahrzeug im freien Seeraum oder …? → Das Maschinenfahrzeug muss ausweichen · 130 Wie hat sich ein Maschinenfahrzeug im freien Seeraum oder …? → Das Maschinenfahrzeug muss ausweichen · 131 Wie hat sich ein Maschinenfahrzeug im freien Seeraum oder …? → Das Maschinenfahrzeug muss ausweichen · 132 Wie hat sich ein Segelfahrzeug im freien Seeraum oder …? → Das Segelfahrzeug muss ausweichen
- **Ausführlich erklären:** 82, 83, 132; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** frei · **Szene:** Ostsee vor der Kieler Förde
- **Bild und Animation (interaktiv):** Die Rangfolge
- **Praxis und Hintergrund:** Je weniger ein Fahrzeug ausweichen kann, desto weiter oben steht es: manövrierunfähig, manövrierbehindert, fischend, Segler, Maschinenfahrzeug; die Durchfahrt Tiefgangbehinderter darf man nicht behindern. Gilt im freien Seeraum und außerhalb des Fahrwassers.

**S2.4 Kurshalter und der letzte Augenblick** · Regel für Regel · Hörspiel · 15 min
- **Lage:** Westliche Ostsee: Der Ausweichpflichtige reagiert nicht. Fünf kurze Töne, dann der letzte Augenblick.
- **Fragen (6):** 79 Was bedeutet das "Manöver des letzten Augenblicks"? → Ausweichmanöver des Kurshalters · 80 Wann ist das "Manöver des letzten Augenblicks" durchzuführen? → Es muss durchgeführt werden, wenn ein Zusammenstoß … · 135 Wie verhält sich der Kurshaltepflichtige vor Einleitung …? → Kurs und Geschwindigkeit zunächst beibehalten und dem … · 136 Wie muss sich ein Ausweichpflichtiger gegenüber einem …? → Das Ausweichmanöver muss frühzeitig, durchgreifend … · 139 Wie verhält man sich als Kurshalter, wenn man feststellt, …? → Man gibt mindestens fünf kurze Töne mit der Pfeife ab … · 140 [Ton mindestens ● ● ● ● ●] → Ein ausweichpflichtiges Fahrzeug wird auf seine …
- **Ausführlich erklären:** 135, 136, 139; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Ton-Labor · **Revier:** frei · **Szene:** Westliche Ostsee
- **Bild und Animation (interaktiv):** Begegnung von oben, Schallsignale sichtbar
- **Praxis und Hintergrund:** Der Ausweichpflichtige handelt früh, durchgreifend und klar erkennbar. Der Kurshalter hält erst Kurs und Fahrt, warnt mit mindestens fünf kurzen Tönen und weicht im letzten Augenblick selbst aus.

#### Kapitel S3: Lichter und Signalkörper

*Kapitelüberblick (Anfang der ersten Folge):* Wer nachts und tagsüber welche Zeichen führt und was sie über die Lage verraten.

**S3.1 Das Lichtersystem** · System zuerst · Törn · 15 min
- **Lage:** Nachtfahrt in der Lübecker Bucht: Licht für Licht das System.
- **Fragen (7):** 85 Welche Vorschriften regeln die Ausrüstung, Anordnung und …? → Die Kollisionsverhütungsregeln (KVR), die … · 86 Welche Positionslaternen und Schallsignalanlagen dürfen …? → Solche, deren Baumuster vom Bundesamt für … · 91 [Bild] → Maschinenfahrzeug in Fahrt von weniger als 50 m Länge · 92 [Bild] → Maschinenfahrzeug in Fahrt von 50 und mehr Meter Länge · 113 Welche Fahrzeuge führen nur Seitenlichter rot und grün und …? → Segelfahrzeuge, Ruderboote und geschleppte Fahrzeuge · 159 Welches Licht muss ein Fahrzeug unter Segel von weniger …? → Ein weißes Rundumlicht · 160 Wann darf ein Maschinenfahrzeug von weniger als 7 m Länge …? → Es darf in der Zeit, in der die Lichterführung …
- **Ausführlich erklären:** 91, 92, 113; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Nachts in der Lübecker Bucht
- **Bild und Animation (interaktiv):** Lichterkarussell
- **Praxis und Hintergrund:** Topplicht, Seitenlichter und Hecklicht decken zusammen den ganzen Kreis ab (Sektoren nach KVR Regel 21, am Original prüfen). Ab 50 Meter Länge ein zweites Topplicht. Wer nur Seitenlichter und Hecklicht zeigt, ist Segler, Ruderboot oder geschleppt.
- **Recherche:** R26

**S3.2 Vor Anker und auf Grund** · System zuerst · Hörspiel · 14 min
- **Lage:** Abends vor Anker bei Heiligenhafen: Ein Schiff in der Nähe zeigt seltsame Lichter. Sitzt es fest?
- **Fragen (5):** 105 [Bild] → Ein Grundsitzer von weniger als 50 m Länge · 106 [Bild] → Ein Grundsitzer · 107 [Bild] → Ein Grundsitzer von 50 und mehr Meter Länge · 114 Was für ein Licht muss ein Ankerlieger von weniger als 50 …? → Ein weißes Rundumlicht an gut sichtbarer Stelle · 115 [Bild] → Ein vor Anker liegendes Fahrzeug von 100 und mehr …
- **Ausführlich erklären:** 105, 114; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Stichprobe · **Revier:** frei · **Szene:** Ankerplatz vor Heiligenhafen
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug
- **Praxis und Hintergrund:** Ankerlieger zeigen ein weißes Rundumlicht, große mehr; Grundsitzer zusätzlich zwei rote Rundumlichter, am Tag drei Bälle. Grundberührung ist der zweithäufigste Grund für Einsätze der Seenotretter bei Wassersportlern.
- **Recherche:** R9

**S3.3 Schlepper und Schleppverbände** · Regel für Regel · Garn-Abend · 13 min
- **Lage:** Hinnerk erzählt von Schleppern und Schleppverbänden auf der Elbe vor Brunsbüttel.
- **Fragen (4):** 93 [Bild] → Manövrierbehinderter Schleppverband in Fahrt von 200 … · 94 [Bild] → Manövrierbehinderter Schleppverband in Fahrt von mehr … · 95 Welche Lichter führen geschleppte Fahrzeuge? → Seitenlichter rot und grün und ein weißes Hecklicht · 96 Was bedeutet es, wenn jedes Fahrzeug eines …? → Schleppverband von mehr als 200 m Länge
- **Ausführlich erklären:** 93, 96; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** fahrwasser · **Szene:** Elbe vor Brunsbüttel
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug
- **Praxis und Hintergrund:** Lange Schleppverbände sind schwer zu erkennen und nicht wendig: nie zwischen Schlepper und Anhang durchfahren. Hinnerk erzählt aus 38 Jahren Fähre.
- **Recherche:** R35

**S3.4 Manövrierunfähig** · Regel für Regel · Hörspiel · 14 min
- **Lage:** Nachts in der Kadetrinne: Ein Frachter zeigt Rot über Rot.
- **Fragen (5):** 97 [Bild] → Ein manövrierunfähiges Fahrzeug in Fahrt · 98 [Bild] → Ein manövrierunfähiges Fahrzeug mit Fahrt durch das … · 99 [Bild] → Ein manövrierunfähiges Fahrzeug · 100 Welche Lichter führen manövrierunfähige Fahrzeuge von 12 …? → Zwei rote Rundumlichter senkrecht übereinander · 101 Welche Lichter führen manövrierunfähige Fahrzeuge von 12 …? → Zwei rote Rundumlichter senkrecht übereinander und …
- **Ausführlich erklären:** 100, 101; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** frei · **Szene:** Nachts in der Kadetrinne
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug
- **Praxis und Hintergrund:** Zwei rote Rundumlichter übereinander heißen manövrierunfähig, nicht Seenot (verbreitete Falle). Macht es Fahrt durchs Wasser, kommen Seitenlichter und Hecklicht dazu; am Tag zwei Bälle.
- **Recherche:** R47

**S3.5 Manövrierbehindert und Bagger** · System zuerst · Duell · 15 min
- **Lage:** Am Baggerschiff in der Elbe: Hinnerk und Smilla wetten, an welcher Seite es vorbeigeht.
- **Fragen (6):** 102 [Bild] → Ein manövrierbehindertes Fahrzeug in Fahrt · 103 [Bild] → Ein manövrierbehindertes Fahrzeug mit Fahrt durch das … · 104 [Bild] → Ein manövrierbehindertes Fahrzeug · 148 [Bild] → Ein manövrierbehindertes Fahrzeug, das baggert oder … · 149 [Bild] → Ein manövrierbehindertes Fahrzeug mit Fahrt durchs … · 150 [Bild] → Ein manövrierbehindertes Fahrzeug ohne Fahrt durchs …
- **Ausführlich erklären:** 102, 148; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Streitgespräch · **Revier:** fahrwasser · **Szene:** Baggerschiff in der Elbe
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug
- **Praxis und Hintergrund:** Rot-weiß-rot heißt manövrierbehindert, am Tag Ball, Rhombus, Ball. Bei Baggern zeigen zwei rote Lichter oder Bälle die Seite mit dem Hindernis, zwei grüne Lichter oder Rhomben die Seite, an der man vorbeifahren darf.

**S3.6 Tiefgangbehinderte und Fischer** · Regel für Regel · Besuch · 15 min
- **Lage:** Ein Fischer vor Fehmarn erzählt auf Platt, warum er nicht einfach ausweichen kann.
- **Fragen (7):** 108 [Bild] → Ein tiefgangbehindertes Fahrzeug von 50 und mehr … · 109 [Bild] → Ein tiefgangbehindertes Fahrzeug in Fahrt · 110 [Bild] → Ein fischender Trawler (Fischereifahrzeug) mit Fahrt … · 111 [Bild] → Ein fischendes Fahrzeug in Fahrt oder vor Anker, das … · 112 [Bild] → Ein fischendes Fahrzeug in Fahrt oder vor Anker · 133 [Bild] → Die sichere Durchfahrt des Fahrzeugs darf nicht … · 134 [Bild] → Die sichere Durchfahrt des Fahrzeugs darf nicht …
- **Ausführlich erklären:** 110, 111, 133; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Gast mit Fischer (FISCHER) · **Revier:** frei · **Szene:** Ostsee vor Fehmarn
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug
- **Praxis und Hintergrund:** Trawler: grün über weiß; andere Fischer: rot über weiß; am Tag zwei Kegel Spitze an Spitze. Tiefgangbehinderte: drei rote Rundumlichter, am Tag ein Zylinder; ihre Durchfahrt nicht behindern. Der Fischer erklärt Stellnetze und Fähnchen in der Ostsee.
- **Recherche:** R25

#### Kapitel S4: Hören statt sehen

*Kapitelüberblick (Anfang der ersten Folge):* Was bei Nebel gilt und wie man Fahrzeuge an ihren Tönen erkennt.

**S4.1 Nebel: langsam, horchen, Ausguck** · Regel für Regel · Hörspiel · 13 min
- **Lage:** Vor der Elbmündung zieht Nebel auf: Was jetzt zu tun ist.
- **Fragen (3):** 84 Welche besonderen Maßnahmen sind bei verminderter Sicht zu …? → Es muss mit sicherer, den verminderten … · 138 Wie hat man sich zu verhalten, wenn man bei verminderter …? → Es ist ebenfalls ein Schallsignal abzugeben und die … · 274 Welche Sicherheitsmaßnahmen sind an Bord aufgrund der …? → Insbesondere alle Navigationsanlagen sorgfältig …
- **Ausführlich erklären:** 84, 138; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Nebel vor der Elbmündung
- **Bild und Animation (interaktiv):** Begegnung von oben
- **Praxis und Hintergrund:** Sichere Geschwindigkeit, Ausguck mit Augen und Ohren, Lichter an. Hört man ein Signal anscheinend vorlicher als querab, selbst ein Signal geben und die Fahrt auf das Mindeste verringern.

**S4.2 Wer tutet da? Nebelsignale in Fahrt** · System zuerst · Duell · 15 min
- **Lage:** Nebel in der Deutschen Bucht: Wer tutet da? Ratespiel mit allen Signalen in Fahrt.
- **Fragen (6):** 116 Sie hören bei verminderter Sicht mindestens alle zwei …? → Ein Maschinenfahrzeug, das Fahrt durchs Wasser macht · 117 Sie hören bei verminderter Sicht mindestens alle zwei …? → Ein Maschinenfahrzeug in Fahrt, das seine Maschine … · 118 Welche Fahrzeuge geben bei verminderter Sicht mindestens …? → Ein manövrierunfähiges Fahrzeug in Fahrt, ein … · 119 Welches Fahrzeug gibt bei verminderter Sicht - im …? → Ein geschlepptes Fahrzeug oder das letzte bemannte … · 120 Was für ein Schallsignal muss ein Segelfahrzeug in Fahrt …? → Mindestens alle zwei Minuten drei aufeinander … · 121 Welches Schallsignal muss ein Fahrzeug in Fahrt von …? → Mindestens alle zwei Minuten ein kräftiges …
- **Ausführlich erklären:** 116, 117, 118, 120; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Ton-Labor · **Revier:** frei · **Szene:** Nebel in der Deutschen Bucht
- **Bild und Animation (interaktiv):** Schallsignale sichtbar
- **Praxis und Hintergrund:** Ein langer Ton: Maschinenfahrzeug mit Fahrt durchs Wasser; zwei lange: gestoppt. Lang, kurz, kurz: die Eingeschränkten (Segler, Fischer, manövrierunfähig, manövrierbehindert, tiefgangbehindert, Schlepper). Eine häufige Prüfungsfalle.
- **Recherche:** R5, R44

**S4.3 Glocke, Gong und Warnsignale** · System zuerst · Garn-Abend · 14 min
- **Lage:** Am Ankerplatz im Nebel hört man nur Glocken. Hinnerk erzählt von der Helgoland-Fähre im Nebel.
- **Fragen (7):** 122 [Bild] → Ein Fahrzeug vor Anker von weniger als 100 m Länge · 123 [Bild] → Ein Fahrzeug vor Anker von 100 und mehr Meter Länge · 124 Welches zusätzliche Schallsignal darf jeder Ankerlieger …? → Mit der Pfeife kurz, lang, kurz · 141 [Ton ● ▬ ●] → Ein Ankerlieger macht ein sich näherndes Fahrzeug auf … · 162 [Ton ▬ ● ● ● ● / ▬ ● ● ● ●] → Allgemeines "Gefahr- und Warnsignal" · 163 Wie lautet das "allgemeine Gefahr- und Warnsignal"? → Zwei Gruppen von je einem langen und vier kurzen Tönen · 164 Wann ist das "allgemeine Gefahr- und Warnsignal" zu geben? → Wenn ein Fahrzeug ein anderes Fahrzeug gefährdet oder …
- **Ausführlich erklären:** 122, 163, 164; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Stichprobe · **Revier:** frei · **Szene:** Ankerplatz im Nebel
- **Bild und Animation (interaktiv):** Schallsignale sichtbar
- **Praxis und Hintergrund:** Ankerlieger läuten die Glocke, große zusätzlich den Gong; ein Ankerlieger darf mit kurz, lang, kurz warnen. Das allgemeine Gefahr- und Warnsignal: zwei Gruppen aus je einem langen und vier kurzen Tönen.

#### Kapitel S5: Tonnen und Feuer

*Kapitelüberblick (Anfang der ersten Folge):* Wie Leuchtfeuer sprechen und wie Tonnen den Weg zeigen.

**S5.1 Wie Feuer sprechen: Kennungen** · System zuerst · Unterricht · 14 min
- **Lage:** In der Kajüte mit dem Leuchtfeuerverzeichnis: wie Feuer sprechen.
- **Fragen (6):** 215 Was versteht man unter einem unterbrochenen Feuer? → Die Lichterscheinung ist stets länger als die … · 220 Was versteht man unter einem Blinkfeuer? → Lichterscheinung kürzer als Verdunkelung, Blink … · 221 Was versteht man unter einem Blitzfeuer? → Lichterscheinung kürzer als Verdunkelung, Blitz … · 222 Was versteht man unter einem Funkelfeuer? → 50 bis 60 aufeinanderfolgende Lichterscheinungen pro … · 223 Was versteht man unter einem Gleichtaktfeuer? → Lichterscheinung und Verdunkelung von gleicher Länge · 224 Was versteht man unter der Wiederkehr eines Leuchtfeuers? → Zeitraum vom Einsetzen der Taktkennung bis zum …
- **Ausführlich erklären:** 215, 220, 221; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Nachts vor der Küste
- **Bild und Animation (interaktiv):** Feuer im Takt
- **Praxis und Hintergrund:** Erst schauen, was länger ist: Licht oder Dunkel. Unterbrochen: Licht länger. Blink und Blitz: Licht kürzer (Blink mindestens zwei Sekunden, Blitz kürzer). Gleichtakt: gleich lang. Das Blinkfeuer ist eine der häufigsten Prüfungsfallen.
- **Recherche:** R5

**S5.2 Das Fahrwasser und seine Seiten** · System zuerst · Törn · 15 min
- **Lage:** Heimfahrt in die Flensburger Förde: Tonne für Tonne, von See kommend.
- **Fragen (7):** 156 Was sind Fahrwasser im Sinne der …? → Es sind Wasserflächen, die durchgehend durch … · 157 Welches ist - außer in Wattgebieten - die Steuerbordseite …? → Es ist die Seite, die ein von See kommendes Schiff an … · 190 [Bild] → Kennzeichnung der Mitte von Schifffahrtswegen · 191 [Bild] → Die Steuerbordseite des Fahrwassers · 192 [Bild] → Die Backbordseite des Fahrwassers · 193 [Bild] → Die Steuerbordseite des Fahrwassers · 194 [Bild] → Die Backbordseite des Fahrwassers
- **Ausführlich erklären:** 157, 191, 192; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Streitgespräch · **Revier:** fahrwasser · **Szene:** Einfahrt in die Flensburger Förde
- **Bild und Animation (interaktiv):** Fahrwasser von See kommend
- **Praxis und Hintergrund:** Von See kommend: rot an Backbord, grün an Steuerbord, ungerade Nummern an Steuerbord. In anderen Teilen der Welt ist es umgekehrt. Die Mitte von Schifffahrtswegen zeigt eine rot-weiße Tonne.
- **Recherche:** R30

**S5.3 Abzweigungen und Leuchttonnen** · Regel für Regel · Hörspiel · 13 min
- **Lage:** Nachts an einer Abzweigung in der Kieler Förde: Welche Tonne gilt für welches Fahrwasser?
- **Fragen (5):** 195 [Bild] → Steuerbordseite des durchgehenden … · 196 [Bild] → Backbordseite des durchgehenden Fahrwassers, … · 197 Welche Bedeutung hat folgende Kennung: "Oc (2) R. Whis."? → Unterbrochen (2) rot, Heultonne · 198 Welche Kennung und Farbe haben die Feuer der Leuchttonnen …? → Grünes Blitzfeuer, Funkelfeuer oder unterbrochenes … · 199 Welche Kennung und Farbe haben die Feuer der Leuchttonnen …? → Rotes Blitzfeuer, Funkelfeuer oder unterbrochenes …
- **Ausführlich erklären:** 195, 198; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Stichprobe · **Revier:** fahrwasser · **Szene:** Abzweigung in der Kieler Förde
- **Bild und Animation (interaktiv):** Fahrwasser von See kommend, Feuer im Takt
- **Praxis und Hintergrund:** Die Grundfarbe zeigt das durchgehende Fahrwasser, der Streifen das abzweigende. Leuchttonnen tragen die Farbe ihrer Seite; Kennungen wie „Oc (2) R“ liest man Stück für Stück.
- **Recherche:** R30

**S5.4 Kardinalzeichen: die Uhr im Wasser** · System zuerst · Unterricht · 15 min
- **Lage:** Am Kartentisch: eine Untiefe auf der Karte und vier Tonnen wie eine Uhr.
- **Fragen (8):** 200 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, … · 201 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, … · 202 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, … · 203 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, … · 204 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, die … · 205 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, die … · 206 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, … · 207 [Bild] → Kennzeichnung einer allgemeinen Gefahrenstelle, …
- **Ausführlich erklären:** 200, 204, 206, 207; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** frei · **Szene:** Untiefe vor der Küste
- **Bild und Animation (interaktiv):** Kardinalzeichen als Uhr
- **Praxis und Hintergrund:** Ein Kardinalzeichen nennt die Seite, an der man vorbeifährt. Toppzeichen: Nord Spitzen oben, Süd unten, Ost Basis an Basis, West Spitze an Spitze. Feuer wie eine Uhr: Ost drei, Süd sechs plus ein langer, West neun Blitze, Nord ohne Pause. Süd und West werden oft verwechselt.
- **Recherche:** R31, R45

**S5.5 Einzelgefahr, Leit-, Richt- und Quermarkenfeuer** · System zuerst · Törn · 15 min
- **Lage:** Nachts in die Schlei: Leitfeuer, Richtfeuer und Quermarke als Stationen.
- **Fragen (7):** 208 [Bild] → Eine Einzelgefahrenstelle, die an allen Seiten … · 209 Welche Bedeutung hat das Feuer einer Leuchttonne mit …? → Eine Einzelgefahrenstelle, die an allen Seiten … · 210 Was versteht man unter einem Leitfeuer? → Sektorenfeuer, das ein Fahrwasser bezeichnet · 211 Wie navigiert man mittels eines Leitfeuers? → In Fahrtrichtung an der rechten Seite des weißen … · 212 Was versteht man unter einem Richtfeuer? → Ober- und Unterfeuer, die in Deckung zu bringen sind · 213 Was versteht man unter einem Quermarkenfeuer? → Sektorenfeuer, das auf eine Kursänderung im … · 214 Wie navigiert man mittels eines Quermarkenfeuers? → Beim Übergang vom Ankündigungssektor in den …
- **Ausführlich erklären:** 208, 211, 212; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** fahrwasser · **Szene:** Nachts in der Einfahrt zur Schlei
- **Bild und Animation (interaktiv):** Leit-, Richt- und Quermarkenfeuer, Feuer im Takt
- **Praxis und Hintergrund:** Einzelgefahr: rundum passierbar, Blitze in Zweiergruppen. Leitfeuer: in Fahrtrichtung an der rechten Seite des weißen Sektors bleiben. Richtfeuer: Ober- und Unterfeuer in Deckung bringen. Quermarkenfeuer kündigen die Kursänderung an.

#### Kapitel S6: Fahrwasser und besondere Gebiete

*Kapitelüberblick (Anfang der ersten Folge):* Was im Fahrwasser anders ist, wo man nicht hin darf und wie Kanal und Verkehrstrennungsgebiet funktionieren.

**S6.1 Regeln im Fahrwasser** · Regel für Regel · Duell · 15 min
- **Lage:** Im Fahrwasser der Kieler Förde streiten Hinnerk und Smilla, wer hier Vorfahrt hat.
- **Fragen (6):** 161 Welches Schallsignal ist beim Einlaufen in Fahrwasser und …? → Ein langer Ton · 165 Wie haben sich Fahrzeuge zu verhalten, die in ein …? → Sie haben die Vorfahrt der dem Fahrwasserverlauf … · 166 Wie haben Segelfahrzeuge im Fahrwasser, die nicht deutlich …? → Sie haben untereinander nach den Regeln der KVR … · 167 Welche Ausweichregeln gelten außerhalb des Fahrwassers? → Die Regeln der KVR · 168 Wo ist das Überholen verboten? → An Engstellen, unübersichtlichen Krümmungen, in … · 271 Wie hat man seine Fahrweise im Fahrwasser bei verminderter …? → Das Fahrwasser verlassen und wenn möglich, …
- **Ausführlich erklären:** 165, 167, 271; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Streitgespräch · **Revier:** fahrwasser · **Szene:** Fahrwasser der Kieler Förde
- **Bild und Animation (interaktiv):** Fahrwasser von See kommend, Begegnung von oben, Wo gilt was?
- **Praxis und Hintergrund:** Wer dem Fahrwasser folgt, hat Vorfahrt vor allen, die einlaufen, queren oder wenden. Außerhalb des Fahrwassers gelten die KVR. Bei verminderter Sicht ohne Ortungsgerät (Radar): das Fahrwasser verlassen, möglichst ins flache Wasser und ankern; geht das nicht, im Fahrwasser äußerst rechts halten.

**S6.2 Baden, Wasserski und Ankerverbot** · Regel für Regel · Hörspiel · 14 min
- **Lage:** Am Badestrand: Wasserski, Badegäste und die Suche nach einem erlaubten Ankerplatz.
- **Fragen (7):** 169 Wo darf Wasserski gelaufen, Wassermotorrad gefahren oder …? → Außerhalb des Fahrwassers, wenn es nicht von der … · 170 Wie haben sich Führer von Zugbooten der Wasserskiläufer …? → Sie haben auszuweichen · 171 Wo ist das Ankern verboten? → Im Fahrwasser, an Engstellen und in unübersichtlichen … · 179 [Bild] → Geschwindigkeit von 8 km/h Fahrt durch das Wasser, … · 180 [Bild] → Gesperrt für alle Maschinenfahrzeuge und … · 181 Welche Höchstgeschwindigkeit darf vor Stellen mit …? → 4,3 Knoten · 182 [Bild] → Kennzeichnung von besonderen Gebieten und Stellen
- **Ausführlich erklären:** 171, 181; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Badestrand an der Ostsee
- **Bild und Animation (interaktiv):** Tafelzeichen nach Familien
- **Praxis und Hintergrund:** Vor Badestellen außerhalb des Fahrwassers höchstens 4,3 Knoten. Im Fahrwasser, an Engstellen und in Kurven nicht ankern. Wasserski und Wassermotorräder nur außerhalb des Fahrwassers und nicht, wo es verboten ist.

**S6.3 Behörden und Gefahrgut: wer da kommt** · Regel für Regel · Besuch · 13 min
- **Lage:** Die Wasserschutzpolizei auf der Elbe: wer da mit Blaulicht kommt und was ein Gefahrgutschiff zeigt.
- **Fragen (5):** 151 [Bild] → Fahrzeug mit gefährlichen Gütern, Abstand halten, … · 154 [Bild] → Fahrzeug des öffentlichen Dienstes im Einsatz. Es … · 155 Wer gibt das Sichtzeichen "Leuchtkugeln mit weißen …? → Fahrzeug der Bundeswehr, der Bundespolizei oder … · 185 [Bild] → Anhalten · 186 [Ton ● ▬ ● ●] → Polizeifahrzeug fordert zum Anhalten auf
- **Ausführlich erklären:** 154, 186; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Gast mit Wasserschutzpolizistin (POLIZEI) · **Revier:** fahrwasser · **Szene:** Elbe, Polizeiboot im Einsatz
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug, Schallsignale sichtbar
- **Praxis und Hintergrund:** Fahrzeuge mit gefährlicher Ladung zeigen am Tag eine rote Flagge, nachts ein rotes Rundumlicht: Abstand halten, kein Rauchen, kein offenes Feuer. Fahrzeuge des öffentlichen Dienstes im Einsatz zeigen ein blaues Funkellicht und dürfen von den Verkehrsvorschriften abweichen. Zweimal L heißt Anhalten: die gelb-schwarze Flagge L und der Ton kurz, lang, kurz, kurz (Morse-L) vom Polizeiboot. Sofort folgen.
- **Recherche:** R16

**S6.4 Gesperrt! Sperr- und Warngebiete** · System zuerst · Hörspiel · 13 min
- **Lage:** Vor der Küste steigen weiße Sterne auf: ein Schießgebiet.
- **Fragen (6):** 177 [Bild] → Schutzbedürftige Anlage · 183 Woran ist ein militärisches Warngebiet zu erkennen, das …? → An bestimmten Tag- und Nachtsignalen, die nach der … · 184 [Bild] → Sperrgebiet · 187 [Bild] → Dauernde Sperrung der Seeschifffahrtsstraße. … · 188 [Ton ▬ ▬ ▬ / ▬ ▬ ▬] → Sperrung der Seeschifffahrtsstraße, Weiterfahrt … · 189 [Bild] → Außergewöhnliche Schifffahrtsbehinderung
- **Ausführlich erklären:** 187, 188; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** frei · **Szene:** Schießgebiet vor der Küste
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug, Schallsignale sichtbar
- **Praxis und Hintergrund:** Sperrungen und Behinderungen zeigt ein Signalmast: am Tag Signalkörper, nachts Lichter (Katalogbilder nebeneinander). Sperrgebiete tragen gelbe Tonnen mit rotem Band und der Aufschrift Sperrgebiet, gelbe Zeichen allein kennzeichnen besondere Gebiete. Militärische Warngebiete erkennt man an Tag- und Nachtsignalen. Bei Sperrung ist die Weiterfahrt verboten, auch wenn man sie nur hört: zwei Gruppen aus je drei langen Tönen.

**S6.5 Der Nord-Ostsee-Kanal, Brücken und Schleusen** · Regel für Regel · Garn-Abend · 13 min
- **Lage:** Quirin kommt zu Besuch an die Schleuse Kiel-Holtenau und erzählt von den Schleusen an Donau und Main-Donau-Kanal.
- **Fragen (5):** 173 Bei welchem Signal dürfen Sportfahrzeuge in die Schleusen …? → Wenn ein weißes unterbrochenes Licht gezeigt wird · 174 Wo findet man Regeln für das Durchfahren des …? → Ergänzende Vorschriften für den NOK in der … · 175 Was bedeuten im Nord-Ostsee-Kanal an einem …? → Ausfahren für alle Fahrzeuge verboten; Aufhebung des … · 176 [Bild] → Die Geschwindigkeit durch das Wasser in km/h, auf dem … · 178 [Ton ● ● ● ●] → Brücke, Sperrwerk, Schleuse kann vorübergehend nicht …
- **Ausführlich erklären:** 173, 176; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn mit Quirin zu Besuch (Binnen-Profi, Hauptfigur erst in Teil B) (QUIRIN) · **Revier:** nok · **Szene:** Schleuse Kiel-Holtenau
- **Bild und Animation (interaktiv):** Tafelzeichen nach Familien
- **Praxis und Hintergrund:** Sportboote fahren nur zur Durchfahrt, nur tagsüber und bei guter Sicht durch den Kanal; Segeln ist verboten. In die Schleuse erst bei weißem unterbrochenem Licht. Hinnerks Garn: der Kanal seit 1895, die meistbefahrene künstliche Wasserstraße der Welt. Quirin ist zu Besuch und kennt sich mit Schleusen aus.
- **Recherche:** R28

**S6.6 Verkehrstrennungsgebiete und Verkehrszentralen** · System zuerst · Besuch · 16 min
- **Lage:** Die Verkehrszentrale am Funk: wie man ein Verkehrstrennungsgebiet befährt und quert.
- **Fragen (9):** 87 Was sind "Verkehrstrennungsgebiete"? → Es sind bekannt gemachte Schifffahrtswege, die durch … · 88 Wie sind Verkehrstrennungsgebiete zu befahren? → Sie dürfen jeweils nur in der allgemeinen … · 142 Was ist bei der Benutzung eines Verkehrstrennungsgebietes …? → Auf dem entsprechenden Einbahnweg in der allgemeinen … · 143 Was ist hinsichtlich des Querens eines …? → Das Queren ist möglichst zu vermeiden. Falls gequert … · 144 In welcher Vorschrift findet man die Regeln zum Befahren …? → In den Kollisionsverhütungsregeln · 145 Wie hat sich ein Maschinenfahrzeug bei Kollisionsgefahr in …? → Es muss dem anderen Fahrzeug ausweichen · 146 Wie hat sich ein Segelfahrzeug beim Queren eines …? → Es darf die sichere Durchfahrt des Maschinenfahrzeugs … · 147 Wie haben sich Fahrzeuge von weniger als 20 m Länge oder …? → Sie dürfen die sichere Durchfahrt eines dem … · 158 Welche verkehrsrechtliche Verpflichtung hat ein …? → Er ist verpflichtet, die von der Verkehrszentrale …
- **Ausführlich erklären:** 88, 143, 147; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Gast mit Verkehrszentrale (FUNK) · **Revier:** vtg · **Szene:** Verkehrstrennungsgebiet vor der Kieler Förde
- **Bild und Animation (interaktiv):** Verkehrstrennungsgebiet
- **Praxis und Hintergrund:** Einbahnwege wie auf der Autobahn. Queren möglichst vermeiden, sonst mit der Kielrichtung im rechten Winkel, ohne Vorhalten. Kleine Fahrzeuge und Segler dürfen die Durchfahrt nicht behindern. Die Verkehrszentrale gibt Informationen, die man beachten muss.
- **Recherche:** R26, R27, R12

#### Kapitel S7: Navigation und Gezeiten

*Kapitelüberblick (Anfang der ersten Folge):* Seekarte, Kompass, Peilung, Koppeln, Gezeiten und wie die Kartenaufgabe der Prüfung abläuft.

**S7.1 Seekarte und nautische Bücher** · System zuerst · Unterricht · 14 min
- **Lage:** Am Kartentisch: Seekarte, Karte 1 und die Bücherkiste des Skippers.
- **Fragen (8):** 231 Welche amtlichen nautischen Veröffentlichungen geben …? → Seekarten, Leuchtfeuerverzeichnis, Seehandbücher, … · 232 Welche Angaben enthalten die Nachrichten für Seefahrer …? → Sie enthalten alle Veränderungen hinsichtlich … · 234 Wo findet man Angaben über Küsten-, Häfen- und …? → In den See- und Hafenhandbüchern · 235 Wovon sollte man sich vor Gebrauch einer Seekarte überzeugen? → Dass die Karte auf den neuesten Stand berichtigt ist · 236 In welchen Maßeinheiten werden in deutschen Seekarten die …? → In Meter und Dezimeter · 237 Wo findet man Bedeutungen und Erläuterungen zu Zeichen, …? → In der INT1/Karte 1 · 238 Wo findet man die für die Navigation wichtigen …? → Leuchtfeuerverzeichnis, Seehandbuch, Seekarten · 239 Wo entnimmt man in der Seekarte die Seemeilen? → Am rechten oder linken Kartenrand in Höhe des …
- **Ausführlich erklären:** 232, 235, 239; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Stichprobe · **Revier:** an Land · **Szene:** Kartentisch in der Kajüte
- **Bild und Animation (interaktiv):** Auf der Seekarte
- **Praxis und Hintergrund:** Nur eine berichtigte Karte ist eine gute Karte: Berichtigungen erscheinen wöchentlich. Tiefen in Meter und Dezimeter; Seemeilen am Seitenrand in Höhe des Standorts abgreifen; die Zeichen erklärt die Karte 1.
- **Recherche:** R32

**S7.2 Seemeile, Knoten, Kompass, Peilung** · System zuerst · Törn · 14 min
- **Lage:** Auf der Flensburger Förde: peilen, Distanz abgreifen, Kurs fahren.
- **Fragen (6):** 240 Was versteht man unter einer Seemeile und wie lang ist …? → Die Länge einer Bogenminute auf einem größten Kreis … · 241 Was versteht man unter dem Geschwindigkeitsbegriff "Knoten"? → Das sind die in einer Stunde zurückgelegten Seemeilen · 242 Woraus entnimmt man die Magnetkompassablenkung? → Aus der für das betreffende Schiff aufgestellten … · 243 Was versteht man in der terrestrischen Navigation unter …? → Das Feststellen der Richtung eines bekannten … · 244 Wie erhält man eine Standlinie? → Durch die Peilung eines bekannten feststehenden … · 248 Was ist bei der Aufstellung eines Magnetkompasses an Bord …? → Der Steuerstrich muss parallel zur Kiellinie …
- **Ausführlich erklären:** 240, 243, 244; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Peilung auf der Flensburger Förde
- **Bild und Animation (interaktiv):** Auf der Seekarte
- **Praxis und Hintergrund:** Eine Seemeile ist eine Bogenminute, 1852 Meter; ein Knoten ist eine Seemeile pro Stunde. Die Ablenkung steht in der Deviationstabelle des eigenen Schiffs. Eine Peilung ergibt eine Standlinie, zwei ergeben den Ort. Verweis auf die Navigationsschule der App.

**S7.3 Koppeln, Versetzung und die Kartenaufgabe** · Kartenaufgabe · Garn-Abend · 15 min
- **Lage:** Smilla erzählt, wie sie bei der Kartenaufgabe an Tonne zehn gescheitert ist, und wie man es richtig macht.
- **Fragen (3):** 245 Was versteht man unter Stromversetzung? → Die Versetzung des Schiffes über Grund in Richtung … · 246 Was versteht man unter Windversetzung? → Die Versetzung des Schiffes über Grund in Richtung … · 247 Was versteht man unter einem Koppelort? → Schiffsort, der unter Berücksichtigung der …
- **Ausführlich erklären:** 245, 247; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** an Land · **Szene:** Kartentisch, dann Prüfungsraum
- **Bild und Animation (interaktiv):** Auf der Seekarte
- **Praxis und Hintergrund:** Koppelort aus Kurs und Distanz; Strom und Wind versetzen. Die Kartenaufgabe der Prüfung: Teilaufgaben, Bestehensgrenze und erlaubte Hilfsmittel nach dem Original. Typischer Fehler: die falsche Tonne 10, genau Smillas Fehler.
- **Recherche:** R1, R2, R6
- **Wartet auf:** Prüfungsablauf am Original (SpFV Anlage 3)

**S7.4 Ebbe und Flut** · System zuerst · Hörspiel · 15 min
- **Lage:** Im Wattfahrwasser vor Büsum läuft das Wasser ab: Wann ist Niedrigwasser, wann kommt es wieder?
- **Fragen (8):** 233 Welchen Effekt können Wind und gegenläufiger Tidenstrom im …? → Steile und aufbäumende Seen (Brecher) · 249 Was versteht man unter Ebbe? → Das Fallen des Wassers vom Hochwasser zum folgenden … · 250 Was versteht man unter Flut? → Das Steigen des Wassers vom Niedrigwasser zum … · 251 Was versteht man unter einer Tide? → Der Zeitraum zwischen einem Niedrigwasser und dem … · 252 Was versteht man unter einem Niedrigwasser? → Eintritt des niedrigsten Wasserstands beim Übergang … · 253 Was versteht man unter einem Hochwasser? → Eintritt des höchsten Wasserstands beim Übergang vom … · 254 Was versteht man unter "Tidenhub"? → Unterschied zwischen den Höhen des Hoch- und des … · 255 Wo sind für einen bestimmten Ort die Angaben über Hoch- …? → In den Gezeitentafeln oder dem Gezeitenkalender des …
- **Ausführlich erklären:** 233, 254, 255; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** watt · **Szene:** Wattfahrwasser vor Büsum
- **Bild und Animation (interaktiv):** Ebbe und Flut
- **Praxis und Hintergrund:** Nordsee zwei bis vier Meter Tidenhub, Ostsee nur Zentimeter. Hoch- und Niedrigwasserzeiten stehen in den Gezeitentafeln. Wind gegen Strom im Seegat macht steile Brecher. Hinnerks Garn: einmal trockengefallen.
- **Recherche:** R33, R9

#### Kapitel S8: Natur auf See

*Kapitelüberblick (Anfang der ersten Folge):* Nationalpark Wattenmeer, Schutzgebiete und was man für saubere Gewässer tut.

**S8.1 Wattenmeer und Nationalparks** · Regel für Regel · Besuch · 14 min
- **Lage:** Die Rangerin an der Seehundbank vor Amrum.
- **Fragen (5):** 216 Wo findet man die Grenzen der Naturschutzgebiete auf See? → In Seekarten und Sportschifffahrtskarten des … · 217 Wo findet man auszugsweise Hinweise zu …? → In Seekarten und Sportschifffahrtskarten des … · 218 Weshalb sollte das Anlaufen von Seehundbänken im Bereich …? → Die Tiere sollen nicht gestört oder vertrieben werden · 219 Welcher Abstand sollte gemäß den "10 Goldenen Regeln" für …? → 300 m bis 500 m · 225 Wie hat man sich beim Befahren von Naturschutzgebieten und …? → Befahrensregelungen beachten
- **Ausführlich erklären:** 218, 219; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Gast mit Rangerin im Nationalpark (RANGERIN) · **Revier:** watt · **Szene:** Seehundbank vor Amrum
- **Praxis und Hintergrund:** Seehundbänke meiden; die Nationalparks empfehlen 500 Meter Abstand, der Katalog nennt 300 bis 500 Meter. Grenzen und Befahrensregeln stehen in Seekarten und Sportschifffahrtskarten.
- **Recherche:** R34

**S8.2 Befahrensregeln und saubere See** · Regel für Regel · Törn · 12 min
- **Lage:** Nordsee vor Sylt: Nationalpark, Schnellfahrkorridor und der Müll an Bord.
- **Fragen (5):** 226 Welche Sondervorschriften enthalten die örtlichen …? → Befahrensverbote, Befahrensbeschränkungen, … · 227 Welche Verkehre können in einer ausgewiesenen …? → Bestimmte Wassersportgeräte · 228 Was verstehen Sie gemäß Nordsee-Befahrens-Verordnung …? → Ausgewiesene Wasserflächen für den gewerblichen Verkehr · 229 Wie hoch, soweit die Nordsee-Befahrens-Verordnung …? → 12 Knoten über Grund · 230 Welche Verpflichtung hat man als Bootsführer, um einen …? → Sämtliche Abfälle einschließlich Öle und …
- **Ausführlich erklären:** 229, 230; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Stichprobe · **Revier:** frei · **Szene:** Nordsee vor Sylt
- **Praxis und Hintergrund:** In den Nationalparks gelten Befahrensverbote, Beschränkungen und Höchstgeschwindigkeiten; Schnellfahrkorridore sind für den gewerblichen Verkehr. Alle Abfälle, auch Öl, an Bord sammeln und an Land entsorgen.
- **Recherche:** R34

#### Kapitel S9: Wetter, Seemannschaft und Seenot

*Kapitelüberblick (Anfang der ersten Folge):* Wetter lesen, schweres Wetter vorbereiten, Mensch über Bord und was in Seenot zählt.

**S9.1 Hoch, Tief und die Wetterkarte** · System zuerst · Hörspiel · 14 min
- **Lage:** Das Barometer fällt: Was sagt die Wetterkarte?
- **Fragen (6):** 260 [Bild] → Wind aus Richtung Nordwest; Stärke: Bft. 3; wolkenlos · 262 Wie werden Orte gleichen Luftdrucks in der Wetterkarte …? → Durch Isobaren und in Hektopascal · 263 Womit muss bei rasch fallendem Luftdruck gerechnet werden? → Mit Starkwind oder Sturm · 264 Was bedeuten die in der Wetterkarte abgebildeten Isobaren? → Orte gleichen Luftdrucks · 265 [Bild] → Abbildung eines Hochdruckgebietes auf der … · 266 [Bild] → Abbildung eines Tiefdruckgebietes auf der …
- **Ausführlich erklären:** 263, 264, 266; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Das Barometer fällt, Ostsee
- **Bild und Animation (interaktiv):** Wetterkarte
- **Praxis und Hintergrund:** Isobaren verbinden Orte gleichen Luftdrucks; je enger sie liegen, desto mehr Wind. Rasch fallender Luftdruck kündigt Starkwind oder Sturm an. Abendrot ist nur eine Faustregel.
- **Recherche:** R38

**S9.2 Wind in Zahlen: Beaufort und Warnungen** · Regel für Regel · Unterricht · 14 min
- **Lage:** Im Hafen beim Seewetterbericht: Beaufort und die Warnungen.
- **Fragen (5):** 261 Welche Angaben liefert die Beaufort-Skala? → Windstärken von 0 bis 12 und die Auswirkungen auf die … · 267 Für welche Windstärken wird eine Starkwindwarnung …? → Windstärke 6 und 7 der Beaufortskala · 268 Für welche Windstärken wird eine Sturmwarnung herausgegeben? → Windstärke 8 und mehr der Beaufortskala · 269 Was ist in amtlichen Wetterberichten unter "frischem Wind" …? → Windstärke 5 der Beaufortskala · 270 Was ist in amtlichen Wetterberichten unter "schwerem …? → Windstärken 10, 11 und 12 der Beaufortskala
- **Ausführlich erklären:** 267, 268; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** hafen · **Szene:** Seewetterbericht im Hafen
- **Bild und Animation (interaktiv):** Beaufort-Skala
- **Praxis und Hintergrund:** Starkwindwarnung bei 6 und 7, Sturmwarnung ab 8: die am häufigsten falsch beantwortete Frage des SBF See. Frischer Wind ist 5. Hinnerk erzählt, wie Beaufort seine Skala an den Segeln seines Schiffes maß. Bei Gewitter früh in den Hafen.
- **Recherche:** R5, R36, R19

**S9.3 Schweres Wetter und Schleppen** · Regel für Regel · Garn-Abend · 14 min
- **Lage:** Hinnerk erzählt vom Schleppen bei Starkwind und was er dabei gelernt hat.
- **Fragen (5):** 256 Wie lang sollte eine Schleppleine bei starkem Seegang sein? → Mindestens zwei- oder dreifache Wellenlänge · 257 Was ist zu beachten, wenn ein Sportboot geschleppt werden …? → Die Schleppleine ist den Seegangsverhältnissen … · 258 Womit kann ein steuerunfähiges Sportboot mit dem Bug in …? → Mit dem Treibanker oder anderen geeigneten … · 259 Warum sollte bei starkem Seegang die Fahrt vermindert werden? → Um Schäden durch Seeschlag zu vermeiden · 275 Welche Sicherheitsmaßnahmen sind auf See vor Eintritt von …? → Verschlusszustand herbeiführen, lose Gegenstände …
- **Ausführlich erklären:** 275, 259; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Fehler-Detektiv · **Revier:** frei · **Szene:** Starkwind in der Kieler Bucht
- **Praxis und Hintergrund:** Vor schwerem Wetter: Luken zu, lose Teile festzurren, Westen und Lifebelts an. Bei starkem Seegang Fahrt verringern. Die Schleppleine lang genug und dem Seegang angepasst.
- **Recherche:** R14

**S9.4 Mensch über Bord und Kentern** · Regel für Regel · Hörspiel · 14 min
- **Lage:** Ostsee bei frischem Wind: Mensch-über-Bord-Übung mit einem Fender, dann die Frage, was beim Kentern zählt.
- **Fragen (3):** 276 Mit welchen Hilfsmitteln kann eine im Wasser treibende …? → Leinenverbindung, Rettungsschlaufe, Bergenetz, Talje, … · 277 Was ist zu tun, wenn das Fahrzeug gekentert ist? → Möglichst am Fahrzeug bleiben und die Besatzung … · 278 Wie verhindert man das Überbordfallen von Personen bei …? → Sicherheitsleinen bzw. -gurte spannen, …
- **Ausführlich erklären:** 276, 277, 278; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Ostsee bei frischem Wind
- **Bild und Animation (interaktiv):** Mensch über Bord
- **Praxis und Hintergrund:** Lifebelt und Sicherheitsleine verhindern das Überbordfallen. Die Bergung ist oft schwerer als das Ansteuern, deshalb Bergehilfen an Bord und üben. Kälteschock in der ersten Minute. Gekentert: am Boot bleiben.
- **Recherche:** R13, R17, R18

**S9.5 Seenot: Notsignale und Pflichten** · System zuerst · Garn-Abend · 15 min
- **Lage:** Wahre Einsätze der Seenotretter (mit Quelle): Notsignale und was jeder tun muss.
- **Fragen (8):** 172 Was ist zu unternehmen, um die Schifffahrt zu warnen, wenn …? → Man informiert die Schifffahrtspolizeibehörde und … · 279 Welche Notsignale können gegeben werden? → Leuchtrakete mit rotem Leuchtstern oder rot brennende … · 280 Was bedeutet das Flaggensignal "NC" auf einem Fahrzeug? → Fahrzeug in Seenot · 281 Was bedeutet anhaltendes Ertönen eines Nebelsignalgerätes …? → Fahrzeug in Seenot · 282 [Ton ● ● ● ▬ ▬ ▬ ● ● ●] → Seenotsignal · 283 Was bedeutet eine Leuchtrakete mit einem roten Stern? → Seenotfall · 284 [Bild] → Fahrzeug in Seenot · 285 [Bild] → Fahrzeug in Seenot
- **Ausführlich erklären:** 279, 282, 172; die übrigen kurz mitnehmen oder in der Fragenstrecke nennen.
- **Baustein:** Garn · **Revier:** frei · **Szene:** Seenotfall vor Rügen
- **Bild und Animation (interaktiv):** Notsignale, Schallsignale sichtbar
- **Praxis und Hintergrund:** Notsignale nur bei Gefahr für Leib und Leben: rote Leuchtrakete, SOS, NC, Dauerton, Flagge mit Ball. Hilfe: Kanal 16, in Küstennähe 124 124. Hinnerks Garn: wie SOS 1906 in Berlin entstand.
- **Recherche:** R10, R11, R37

#### Kapitel S10: Die praktische Prüfung

*Kapitelüberblick (Anfang der ersten Folge):* Knoten und Manöver, wie sie in der Prüfung verlangt werden, mit der App zum Üben.

**S10.1 Knoten für die Prüfung** · Praxis · Unterricht · 13 min
- **Lage:** Am Steg: die Prüfungsknoten, mit echtem Tau.
- **Baustein:** Kopfkino · **Revier:** hafen · **Szene:** Am Steg
- **Bild und Animation (interaktiv):** Prüfungsknoten
- **Praxis und Hintergrund:** Die Prüfungsknoten mit ihrer Verwendung; jeder Knoten im Knotenbrett der App. Welche und wie viele abgefragt werden, steht in der Prüfungsrichtlinie.
- **Recherche:** R7
- **Wartet auf:** Prüfungsrichtlinie in quellen/ (G2)

**S10.2 Manöver für die Prüfung** · Praxis · Törn · 15 min
- **Lage:** Prüfungsfahrt im Hafen: Ablegen, Mensch über Bord, Anlegen.
- **Baustein:** Stichprobe · **Revier:** hafen · **Szene:** Prüfungsboot im Hafen
- **Bild und Animation (interaktiv):** Prüfungsmanöver
- **Praxis und Hintergrund:** Ablegen, Anlegen, Mensch über Bord, Steuern nach Kompass, Peilen, Aufstoppen, Wenden auf engem Raum: Kommandos und worauf der Prüfer achtet. Üben im Manöverspiel der App.
- **Recherche:** R7, R17
- **Wartet auf:** Prüfungsrichtlinie in quellen/ (G2)

#### Kapitel S11: Prüfungsreife

*Kapitelüberblick (Anfang der ersten Folge):* Was man verwechselt, im direkten Vergleich, und eine Generalprobe mit Harms.

**S11.1 Hörprüfung: alle Schallsignale** · Vergleich · Duell · 14 min
- **Lage:** Hörprüfung im Nebel: alle Signale durcheinander. Wer erkennt mehr, Hinnerk oder Smilla?
- **Bezug (Wiederholung):** 4, 5, 16, 116–124, 139–141, 161–164, 178, 186, 188, 281, 282
- **Baustein:** Ton-Labor · **Revier:** frei · **Szene:** Nebel, alles durcheinander
- **Bild und Animation (interaktiv):** Schallsignale sichtbar
- **Praxis und Hintergrund:** Alle Töne nacheinander und gemischt: erst hören, dann benennen.
- **Recherche:** R44, R52

**S11.2 Lichter und Signalkörper im Vergleich** · Vergleich · Törn · 14 min
- **Lage:** Nachtfahrt mit allen Lichtern des Kurses.
- **Bezug (Wiederholung):** 7, 10, 12, 13, 91–115, 148–150, 159
- **Baustein:** Kopfkino · **Revier:** frei · **Szene:** Nachtfahrt
- **Bild und Animation (interaktiv):** Lichter und Signalkörper je Fahrzeug
- **Praxis und Hintergrund:** Ähnliche Bilder direkt nebeneinander: zwei rote, rot-weiß-rot, drei rote, grün über weiß, rot über weiß.
- **Recherche:** R47, R52

**S11.3 Wer weicht wo aus?** · Vergleich · Duell · 13 min
- **Lage:** Wer weicht wo aus? Freie See, Fahrwasser, Verkehrstrennungsgebiet, quer durcheinander.
- **Bezug (Wiederholung):** 14, 15, 81, 125–132, 135–137, 142, 143, 145–147, 165–167
- **Baustein:** Streitgespräch · **Revier:** frei · **Szene:** Freie See, Fahrwasser, Verkehrstrennungsgebiet
- **Bild und Animation (interaktiv):** Begegnung von oben, Verkehrstrennungsgebiet, Wo gilt was?
- **Praxis und Hintergrund:** Dieselbe Begegnung in drei Revieren: freie See (KVR), Fahrwasser (Vorfahrt der Fahrwasserfolger), Verkehrstrennungsgebiet (Durchfahrt nicht behindern).
- **Recherche:** R52

**S11.4 Zahlen, Fristen, Behörden** · Vergleich · Garn-Abend · 12 min
- **Lage:** Hinnerk erzählt eine Geschichte voller falscher Zahlen; der Hörer findet sie.
- **Bezug (Wiederholung):** 5, 59, 67, 68, 75, 152, 153, 160, 176, 179, 181, 219, 229, 231, 232, 236, 240, 241, 255, 261, 267–270
- **Baustein:** Fehler-Detektiv · **Revier:** an Land · **Szene:** Kajüte, Hinnerks Zahlensalat
- **Praxis und Hintergrund:** Alle Zahlen und Zuständigkeiten, die man leicht verwechselt: Hinnerk bringt sie durcheinander, der Hörer berichtigt.
- **Recherche:** R5, R52

**S11.5 Generalprobe mit Harms** · Vergleich · Duell · 15 min
- **Lage:** Generalprobe: Harms prüft quer durch den Kurs.
- **Bezug (Wiederholung):** 1, 14, 63, 72, 81, 92, 100, 120, 157, 163, 181, 200, 212, 221, 235, 247, 254, 263, 267, 279
- **Baustein:** Stichprobe · **Revier:** an Land · **Szene:** Prüfungsraum
- **Praxis und Hintergrund:** Harms fragt quer durch den Kurs wie in der Prüfung. Danach: was am Prüfungstag zu tun ist (nach dem Original). Hinweis auf Probeprüfung und Kartenaufgabe in der App. Zum Schluss liest Smilla eine Karte von Quirin vor: die Einladung nach Bayern, als Brücke zu Teil B (Revier noch offen).
- **Recherche:** R1, R2
- **Wartet auf:** Prüfungsablauf am Original (F3)

<!-- STECKBRIEFE:END -->

---

## 15. Recherche, Fakten und Fallen

### 15.1 Wie Recherche in die Folgen kommt

- Das Dossier `docs/recherche-kajuetenfunk.md` hat 58 Einträge (R1–R58) mit Quelle und Güte:
  - **A:** amtlich (Gesetz, Behörde),
  - **B:** Fachpresse, Verband, Forschung,
  - **C:** Ratgeber, nur als Hinweis.
- **Prüfungsstoff kommt nur aus dem Katalog** (R8). Die Recherche liefert Praxis, Hintergrund, Anekdoten und Fallen.
- **„Am Original prüfen“:** Solche Angaben kommen erst nach der Prüfung am Original ins Skript (§15.3).
- **Anekdoten** sind entweder wahr und belegt (Güte A oder B) oder klar als Garn markiert (Bible P23). Zahlen immer mit Jahr, zum Beispiel: „2025 fuhren die Seenotretter …“.
- **Vor jeder Folge** liest der Autor die Einträge aus dem Steckbrief und sucht bei Bedarf weiter. Gute Quellen: Gesetze im Internet, ELWIS, BSH, DGzRS, DLRG, YACHT.

### 15.2 Die großen Fallen

Aus dem Katalog (richtige und amtliche Falschantworten) und der Recherche (R5, R6, R46, R47). Jede Falle kommt in ihrer Folge in den Fallen-Check oder als Irrtum mit Berichtigung.

| Falle | richtig laut Katalog | Folge |
|---|---|---|
| Starkwindwarnung bei 7 bis 8 | Starkwind 6 und 7, Sturm ab 8 (die am häufigsten falsch beantwortete Frage, R5) | S9.2 |
| Blinkfeuer: Licht länger als Dunkel | Licht kürzer als Dunkel; Blink mindestens 2 s, Blitz unter 2 s | S5.1 |
| Unterbrochenes Feuer: Licht kürzer | Licht stets länger als die Verdunkelung | S5.1 |
| „Lang, kurz, kurz“ und „lang, kurz, kurz, kurz“ verwechselt | lang, kurz, kurz: die Eingeschränkten (u. a. Segler, Fischer, manövrierunfähig); lang, kurz, kurz, kurz: das geschleppte Fahrzeug | S4.2 |
| „Kurz, lang, kurz“ für Eingeschränkte | kurz, lang, kurz: Der Ankerlieger warnt ein Fahrzeug, das sich nähert | S4.3 |
| Zwei rote Rundumlichter heißen Seenot | manövrierunfähig (R47) | S3.4 |
| Rot-Weiß-Rot und drei Rote verwechselt | Rot-Weiß-Rot: manövrierbehindert; drei Rote: tiefgangbehindert | S3.5, S3.6, S11.2 |
| Kardinalzeichen Süd und West verwechselt | Süd: sechs Blitze und ein langer, Toppzeichen Spitzen unten; West: neun Blitze, Spitze an Spitze (R31) | S5.4 |
| Überholer im Bereich der Seitenlichter (112,5°) | aus mehr als 22,5° achterlicher als querab (Bereich des Hecklichts), und zwar „nähert“, nicht „befindet“ | S2.2 |
| Bei Wind von derselben Seite weicht aus, wer den Wind von Backbord hat | der Luvwärtige dem Leewärtigen | S2.2 |
| Rechtsdrehender Propeller: Heck rückwärts nach Steuerbord | nach Backbord; Anlegen an Backbord | G2.1 |
| Quickstopp wie das gleichnamige Rettungsmanöver | Unterbrechung von Zündkontakt bzw. Kraftstoffzufuhr (R17: Das Mensch-über-Bord-Manöver heißt auch so) | G2.2 |
| Flüssiggas leichter als Luft | schwerer als Luft, sammelt sich unten | G4.1 |
| Feuerlöscher jährlich prüfen | ABC-Pulver- und Schaumlöscher, mindestens alle 2 Jahre | G4.2 |
| Manöver des letzten Augenblicks macht der Ausweichpflichtige | der Kurshalter | S2.4 |
| Kurshalter ändert schon mal den Kurs | Kurs und Geschwindigkeit zunächst beibehalten | S2.4 |
| 12 Knoten im Nationalpark durchs Wasser | 12 Knoten über Grund | S8.2 |
| Schnellfahrkorridore für Sportboote | für den gewerblichen Verkehr | S8.2 |
| 8 Seemeilen pro Stunde vor Badestellen | 8 km/h durchs Wasser im Bereich von 500 m vor dem Ufer (Sichtzeichen); vor erkennbarem Badebetrieb außerhalb des Fahrwassers höchstens 4,3 Knoten (derselbe Wert) | S6.2 |
| Die Zahl auf der Geschwindigkeitstafel nennt Knoten | km/h; durchs Wasser, auf dem Nord-Ostsee-Kanal über Grund | S6.5 |
| Seemeilen am oberen Kartenrand | am rechten oder linken Kartenrand in Höhe des Standorts | S7.1 |
| Tiefen in Meter und Zentimeter | Meter und Dezimeter | S7.1 |
| Tide von Hochwasser zu Hochwasser | von Niedrigwasser zu Niedrigwasser | S7.4 |
| Steuerbordseite des Fahrwassers mit roten Tonnen | die Seite, die ein von See kommendes Schiff an seiner Steuerbordseite hat (grün) | S5.2 |
| bei Nebel ohne Radar zügig weiterfahren | das Fahrwasser verlassen, ins flache Wasser und ankern; sonst äußerst rechts halten | S6.1 |
| die falsche Tonne 10 in der Kartenaufgabe | genau lesen, welche gemeint ist (R6, Smillas Geschichte) | S7.3 |

### 15.3 Was noch am Original geprüft werden muss

| Angabe | warum offen | betrifft |
|---|---|---|
| Ablauf der Theorieprüfung, Bestehensgrenzen, Zeit (R1) | Quellen widersprechen sich teilweise; SpFV Anlage 3 am Original lesen | G0, S7.3, S11.5 |
| Prüfungsrichtlinie für die Praxis (R7, F3) | liegt nicht in `quellen/` | S10.1, S10.2 |
| Promillegrenze (R15) | nur Fachpresse, Gesetz nicht direkt gelesen | G1.1 |
| Sektoren der Lichter (KVR Regel 21) | Gesetz in der Cloud nicht direkt lesbar | S3.1 |
| SBF-Frage 279 (eine Antwort fehlt in den App-Daten) | bekannter Katalogfehler | S9.5 |
| Basisfragen entfallen beim zweiten Schein (R3) | nur Ratgeber | G0 |
| Welche Verkehrsordnung auf Donau und Main-Donau-Kanal gilt (R60, R61) | Auf der Donau gilt die Donauschifffahrtspolizeiverordnung; ein Entwurf von 2024 will sie in die Binnenschifffahrtsstraßen-Ordnung einfügen, ob er gilt, ist offen | Teil B, Quirins Garn |
| Merksätze der App (R59) | von Claude formuliert und gegen die App-Daten geprüft, nicht gegen das Original | alle Folgen |

---

## 16. Herstellung und Qualitätssicherung

### 16.1 Prüfweg je Folge

| Schritt | was | wer |
|---|---|---|
| 1 | Recherche: Einträge aus dem Steckbrief lesen, bei Bedarf neue ins Dossier | Claude |
| 2 | Ablaufplan als Tabelle (wie Anhang B–D) | Claude |
| 3 | Skript nach `podcast/folgen/VORLAGE.md`, mit Hörkarten | Claude |
| 4 | beim Schreiben: `node tools/podcast-pruefen.js --entwurf podcast/folgen/S2-2.md` | Claude |
| 5 | fachliche Selbstprüfung gegen alle vier amtlichen Antworten (`docs/kurs-fragen-sbf.md`) und das Dossier | Claude |
| 6 | lesen und verfeinern (K2, erster Teil) | du und Claude |
| 7 | Gegenlesen durch jemanden mit Ausbildungserfahrung (K2, zweiter Teil); Bairisch prüft dein Bekannter, Platt und Kölsch nach Möglichkeit ebenso | Gegenleser |
| 8 | Freigabe des Skripts (`status: freigegeben` im Kopf) | du |
| 9 | später: Vertonung je Abschnitt, Rückprüfung, Abhören (§16.5) | Claude und du |

### 16.2 Was die Werkzeuge prüfen

**`tools/kursplan-pruefen.js` (Kursplan):**
- jede Frage in genau einer Folge; Teil G enthält genau die Fragen 1–72;
- die Schwerpunkte gehören zur Folge;
- Form, Rahmen, Baustein, Gast, Revier, Animationen und Recherche-Nummern gibt es; Baustein und Rahmen wechseln von Folge zu Folge; jede Folge hat eine Lage;
- die Länge liegt im Rahmen; Vergleichsfolgen beziehen sich nur auf früheren Stoff;
- die erzeugten Abschnitte im Konzept sind aktuell.

**`tools/podcast-pruefen.js` (Folgenskripte):**
- jede Frage der Folge hat ihren Katalogsatz;
- Fallen sind echte amtliche Falschantworten;
- jeder Irrtum ist innerhalb von 20 Sekunden berichtigt;
- jede Szene hat ihr Revier, und es wird ausgesprochen;
- Denkpausen von 3, 5 oder 6 Sekunden; jede Wahl hat 5 Sekunden, jede 5-Sekunden-Pause hat eine Wahl;
- jede Wahl trägt eine Fragen-ID (außer nach der Vorab-Frage), und jede Wahl zu einer Frage der Folge hat eine Vertiefung (höchstens etwa 600 Zeichen, zwei Stimmen);
- die Animationen gibt es;
- höchstens sechs Merkhilfen je Folge und höchstens drei Stimmen je Szene;
- der Rückblick ruft mindestens zwei frühere Folgen ab;
- Zahlen in Worten;
- Baustein und Dauer laut Kursplan;
- zu jeder Frage eine Hörkarte mit Katalogsatz, höchstens zwei Stimmen, höchstens etwa 450 Zeichen;
- dazu alles aus Bible A32: Codes, Sprecher, Aussprache, Abkürzungen, Länge der Beiträge.

### 16.3 Prüfliste vor der Freigabe eines Skripts

(✱ = prüft das Werkzeug)
- [ ] ✱ Jede Frage der Folge hat ihren Katalogsatz, die amtliche Antwort ist klar als richtig erkennbar.
- [ ] Keine Aussage widerspricht dem Katalog oder einer seiner richtigen Antworten.
- [ ] Die Schwerpunktfragen sind ausführlich erklärt, mit Warum.
- [ ] ✱ Jede Szene hat ihr Revier, man hört es, und die Regel passt dazu.
- [ ] ✱ Die Fallen sind echte amtliche Falschantworten.
- [ ] ✱ Jeder Irrtum ist innerhalb von 20 Sekunden berichtigt.
- [ ] ✱ Höchstens sechs Merkhilfen, jede passend zum Merksatz der App und mit Geltungsbereich; höchstens drei Stimmen je Szene.
- [ ] ✱ Denkpausen von 3, 5 oder 6 Sekunden, danach die Lösung; jede Entscheidung hat Antwortknöpfe mit Fragen-ID und eine Vertiefung.
- [ ] Die Folge passt zu ihrem Rahmen und klingt nicht nach Schema F; mindestens eine Anekdote der Crew.
- [ ] Die Folge ist ohne Bildschirm voll verständlich.
- [ ] Neue Fachbegriffe sind beim ersten Auftreten erklärt.
- [ ] ✱ Zahlen stehen in Worten, Abkürzungen sind ausgeschrieben.
- [ ] Kein Witz im Regelsatz, im Katalogsatz, in einer Denkpause oder im Fallen-Check. Doppeldeutiges ist harmlos lesbar, höchstens zwei Stellen, nie auf Kinder oder den Hörer bezogen.
- [ ] ✱ Der Rückblick ruft Stoff aus mindestens zwei früheren Folgen ab.
- [ ] ✱ Baustein und Dauer passen zum Kursplan.
- [ ] Aussagen zu Praxis und Garn haben eine Quelle oder sind als Hinnerks Meinung oder als Garn erkennbar.
- [ ] ✱ Zu jeder Frage gibt es eine Hörkarte.
- [ ] Was ohne `quellen/` geprüft wurde, ist im Bericht markiert.

### 16.4 Gegenlesen (K2)

- **Erst verfeinern wir selbst:** Claude schreibt, du liest und änderst, Claude arbeitet ein.
- **Dann liest jemand gegen:** am besten jemand mit SBF-Ausbildungserfahrung, vor dem Vertonen. Gelesen wird gegen `docs/kurs-fragen-sbf.md`.
- **Dialekte:** Das Bairische prüft dein Bekannter. Für Platt und Kölsch wäre jemand gut, der die Sprache spricht.
- **Stimmen:** Die überarbeitest du selbst. Die Rangerin hat noch keine Stimme, Quirins Stimme ist unbestätigt.

### 16.5 Später beim Vertonen

- Vertont wird erst, wenn die Skripte reif sind (P63), zuerst ein Abschnitt als Test (A27), dann die Folge.
- **Technik:** Eleven v4, Text to Dialogue mit Zeitmarken (R54), höchstens etwa 2.000 Zeichen je Anfrage (A11).
- **Danach prüft ein Werkzeug automatisch:**
  - Vollständigkeit und Dauer,
  - Stimmen,
  - keine Codes in der Eingabe an ElevenLabs,
  - Pausenlängen und Signaldauer,
  - Lautheit;
  - und per Spracherkennung, ob der Text dem Skript entspricht (§17.5).
- **Du hörst ab** (A30): Aussprache, Natürlichkeit, Übergänge. Schwierige Aussprache prüfst du selbst (O33, entschieden am 23.10.2026). Freigegeben wird nach A31.

---

## 17. Technik

### 17.1 Dateien

| was | wo | Format |
|---|---|---|
| Folgenskript | `podcast/folgen/G3-1.md` | Markdown nach Anhang A |
| Abschnitt einer Folge | `audio/kurs/G3.1/1.mp3`, `2.mp3` … | MP3, Mono |
| Ablaufdatei je Folge | `audio/kurs/G3.1.json` | Abschnitte und Dauer; Marken für Wahl, Animation, Bild, Denkpause und je Frage die Stelle für „Im Kurs nachhören“; Stichworte zum Mitlesen |
| Fragerunde | `audio/kurs/fragen/sbf-120.mp3` (Frage), `sbf-120-1.mp3` bis `-4.mp3` (Antworten) | MP3 |
| Hörkarten | `audio/kurs/karten/sbf-120.mp3` | MP3 |
| Vertiefungen | `audio/kurs/G3.1/v-sbf-40.mp3` | MP3, nur interaktiv nach falscher Antwort |
| Probefolge | `audio/kurs/probe/` mit Abschnitten und Ablaufdatei wie oben | MP3 (Anhang H) |
| feste Sätze (Überleitungen, Rahmen, „Antwort A“ …) | `audio/stimmen/` (Stimmenpaket) | MP3 mit `manifest.json` |
| Verzeichnis | `audio/kurs/manifest.json` | Version und Prüfsumme je Datei, Skriptversion |

### 17.2 Player

- **Media Session:** Titel, Kapitelmarken, Sperrbildschirm, Bluetooth-Tasten (vor und zurück springen je Abschnitt).
- **Tempo** 0,8–1,5 bei gleicher Tonhöhe, „10 Sekunden zurück“, „Abschnitt zurück“.
- **Interaktiv:** hält an den Wahl-Marken an (nur bei eingeschaltetem Bildschirm), zeigt die Knöpfe, spielt nach falscher Antwort die Vertiefung und startet Animationen an den Animations-Marken.
- **Auto:** spielt durch. Die Pausen stehen in der Datei, denn Chrome drosselt Zeitgeber, wenn der Bildschirm aus ist.
- Danach kommt die Fragerunde (interaktiv) oder die nächste Folge (Auto).
- Eigene Datei, nachgeladen (R11).

### 17.3 Offline und Speicher

- Folgen werden einzeln geladen. Mit „Kapitel offline speichern“ holt man ein ganzes Kapitel aufs Handy.
- Der Service Worker unterstützt Bereichsanfragen zum Spulen. Die App bittet um dauerhaften Speicher (`navigator.storage.persist()`).
- **Größe bei 64 kbit/s Mono:**
  - Folgen etwa 400 MB,
  - Fragerunde etwa 75 MB,
  - Hörkarten etwa 50 MB,
  - Vertiefungen etwa 35 MB,
  - zusammen etwa 560 MB.

  Bei 32 kbit/s ist es etwa die Hälfte. Ob das gut genug klingt, entscheidet später dein Ohr.
- ElevenLabs liefert MP3 mit 32, 64, 96, 128 oder 192 kbit/s (R54). Andere Formate prüft Claude vor der Produktion.

### 17.4 Hosting (K4)

- Das Audio liegt zuerst im Repo und in der App.
- **GitHub-Grenzen (R56):**
  - das Repo möglichst unter 1 GB,
  - die Seite höchstens 1 GB,
  - eine Datei höchstens 100 MiB.

  Heute ist das Repo etwa 0,1 GB groß.
- **Damit es reicht:**
  - Abschnitte statt ganzer Folgen, damit nur Geändertes neu dazukommt;
  - erst Teil G (etwa 130 MB mit Fragerunde und Hörkarten), dann Teil S Kapitel für Kapitel.
- Wird das Repo zu groß (ab etwa 0,8 GB), kommt das Audio in ein eigenes Repository ohne Verlauf oder auf einen anderen Speicher, und die App lädt es von dort. Das entscheiden wir dann.

### 17.5 Herstellungskette

1. Aus dem Skript (Ebene A) macht ein Werkzeug die Ebene B: Stimmen, Tags, Aussprache, Aufteilung in Anfragen (A5).
2. ElevenLabs Text to Dialogue mit Zeitmarken (R54), je Abschnitt.
3. Ein Werkzeug fügt Denkpausen (Stille mit Signalton), Prüfungssignale (im Code erzeugt) und Geräusche ein. Es berechnet die Marken für Wahl, Animation, Bild und „Im Kurs nachhören“.
4. Lautheitsausgleich, MP3, Ablaufdatei, Verzeichnis.
5. **Rückprüfung:** Spracherkennung gegen das Skript. Fehlen Wörter oder sind sie vertauscht? Besonders bei Zahlen, Verneinungen und Steuerbord oder Backbord.
6. Dein Abhören, dann die Freigabe (A31).

Die Werkzeuge dafür (zum Beispiel `tools/kurs-erzeugen.js`) entstehen, wenn die ersten Skripte freigegeben sind.

---

## 18. Umfang und Kosten

| Teil | Menge | Zeichen (geschätzt) |
|---|---|---|
| Folgen | 60 Folgen, 13 h 59 min, davon etwa 88 % Sprechzeit (der Rest sind Pausen, Signale, Geräusche) | etwa 615.000 |
| Fragerunde | 285 Fragen mit je vier Antworten, gelesen von Harms | etwa 129.000 |
| Hörkarten | 285 Karten zu etwa 300 Zeichen | etwa 86.000 |
| Vertiefungen | etwa 175 Clips zu etwa 400 Zeichen (drei bis vier je Folge mit Katalogfragen) | etwa 70.000 |
| feste Sätze | Überleitungen, Rahmen, „Antwort A“ usw., etwa 150 Sätze | etwa 10.000 |
| **zusammen** | | **etwa 910.000** |
| mit Puffer für Neuerzeugungen (30–60 %) | | 1,2 bis 1,45 Millionen |
| Probefolge (vorab) | ein Ausschnitt von etwa 7 Minuten mit Vertiefung (Anhang H) | höchstens etwa 6.000 |
| App-Stimmen neu mit v4 (O38) | alle festen Sätze des Stimmenpakets nach der Freigabe, mit Klabauters neuer Stimme | etwa 25.000 |

- **Teil G allein** braucht etwa 215.000 Zeichen (Folgen etwa 160.000, Fragerunde etwa 28.000, Hörkarten etwa 22.000, dazu feste Sätze).
- **Sprechtempo:** Grundlage ist das gemessene Tempo des Stimmenpakets, 13,9 Zeichen pro Sekunde (Bible P14). Nach dem ersten Testabschnitt messen wir nach.
- **Preise:** Die Angaben zu den Abos widersprechen sich (R55). Vor dem Start prüft Claude die offizielle Preisseite und misst mit der Probefolge, ob Regieanweisungen als Zeichen zählen (F9). Abo, Credits und Bitrate bleiben vorerst, wie sie sind (O22, F1, entschieden am 23.10.2026).
- Nach K3 erzeugen wir so viel wie nötig, auch über mehrere Monate verteilt.

---

## 19. Ausblick: Teil B (Binnen) und später

### 19.1 Teil B Binnen

- **Stoff:** die 181 Binnen- und 47 Segelfragen aus dem Binnen-Katalog (R4). Die 72 Basisfragen hat Teil G schon.
- **Grobe Schätzung:** 35 Folgen, etwa 8 Stunden, nach demselben Bauplan.
- **Figuren:** Quirin ist der Binnen-Profi und Hauptfigur neben Smilla (sie kennt den Rhein). Hinnerk ist auf Flüssen und in Schleusen ungeübt und fragt nach. Am Ende von S11.5 lädt Quirin per Karte nach Bayern ein.
- **Das Revier** (dein Hinweis vom 23.10.2026: Der Chiemsee ist keine Schifffahrtsstraße, „Dann die Donau? Hätte gerne einen Bayern für die Binnen. Aber andere Vorschläge wären auch ok.“). Was gilt wo:
  - Der Sportbootführerschein Binnen gilt auf den Bundeswasserstraßen im Binnenbereich (Binnen-Frage 74).
  - Die Regeln, die der Katalog meistens abfragt, stehen in der Binnenschifffahrtsstraßen-Ordnung. Sie gilt auf den Bundeswasserstraßen **außer** Rhein, Mosel und Donau (R60).
  - Auf der Donau von Kelheim bis Jochenstein gilt die Donauschifffahrtspolizeiverordnung (Binnen-Frage 85, R61). Ein Entwurf von 2024 will die Donauregeln als eigenes Kapitel in die Binnenschifffahrtsstraßen-Ordnung holen; ob er in Kraft ist, prüft Claude vor dem Schreiben.
  - Der Chiemsee ist ein Landesgewässer, dort gilt die bayerische Schifffahrtsordnung (R62). Das passt genau zu Binnen-Frage 231 über Landesgewässer, aber nicht zu den übrigen Regeln.
- **Vorschlag: Main-Donau-Kanal mit Altmühltal, Ausflüge an Donau und Chiemsee.**
  - Der Main-Donau-Kanal ist 171 km lang, führt von Bamberg nach Kelheim und hat 16 Schleusen (R63). Dort gilt die Binnenschifffahrtsstraßen-Ordnung, er liegt ganz in Bayern, und es gibt Schleusen, Brücken, Berufsschifffahrt und Fahrgastschiffe. Quirins Boot liegt in Kelheim.
  - Für die Regeln der Donau (Frage 85) eine Fahrt ab Kelheim donauabwärts, für Landesgewässer (Frage 231) ein Abstecher an den Chiemsee, für Rheinregeln (Fragen 79, 84, 228) ein Besuch bei Smilla in Köln.
  - **Andere Möglichkeiten:** der Main (Würzburg, Bamberg), ebenfalls Binnenschifffahrtsstraßen-Ordnung und Bayern; oder Berlin und Brandenburg, wo auch Segeln eine Fahrerlaubnis braucht (Binnen-Frage 226), aber ohne Bayern.
- **Segelfragen** gelten als die schwersten (R5). Sie bekommen ein eigenes Kapitel mit viel Animation (`wind`).
- Geplant wird Teil B, wenn Teil S steht (Bible P16). Das Revier entscheidest du vorher (§21).

### 19.2 Später

- **SKS-Folgen:** Dazu gibt es keinen Beschluss (O1).
- **Funk (SRC/UBI) und Pyrotechnik:** wenn die Kataloge in `quellen/` liegen.

---

## 20. Fahrplan

1. **Erledigt am 23.10.2026:** deine Korrekturen in Konzept, Kursplan, Figuren, Wortschatz, Bible, Status und Werkzeugen; 285 neue Merksätze; Haftungsausschluss in der App (v4.88); Geräuschliste für den Kurs gekürzt.
2. **Dein Startschuss (K1)** mit den Antworten auf die offenen Fragen (§21).
3. **Probefolge** (Anhang H): Skript schreiben und prüfen, vertonen (Eleven v4, höchstens etwa 6.000 Credits), Abschnitte und Ablaufdatei bauen, ein einfacher Player über den Hocker in der Kajüte. Dafür brauchen wir den ElevenLabs-Schlüssel als Secret der Cloud-Umgebung und die Freigabe der Domain `api.elevenlabs.io` (E5, F2).
4. **Du hörst,** wir verfeinern Konzept, Vorlage, Figuren, Sprechregie und Aussprache.
5. **Teil G schreiben,** in der Reihenfolge des Kurses (die Rückblicke brauchen die früheren Folgen), mit Hörkarten und Vertiefungen.
6. **Gegenlesen** (K2).
7. **Parallel in der App:** Player mit beiden Modi, Fragerunde mit Spracherkennung, Antwortknöpfe mit Statistik, V42 (Scheine, Termine, Lernzeit), danach Animationen mit Vorrang.
8. **Teil S schreiben,** Kapitel für Kapitel. Die drei Ablaufpläne in Anhang B bis D sind schon auf Fassung 5 umgestellt.
9. **App-Stimmen neu mit v4** nach der Freigabe (O38).
10. **Teil B planen,** sobald das Revier entschieden ist; Merksätze für die Binnen- und SKS-Fragen.

---

## 21. Offene Punkte und deine Entscheidungen

**Für die Probefolge wichtig (bitte mit dem Startschuss beantworten):**
- **K1 Startschuss** für Fassung 5, zusammen mit den Bible-Änderungen in §2.3 und den kleinen Entscheidungen in §2.4.
- **Welche Folge:** Vorschlag ist der Anfang von G6.3 „Brücken und Schleusen“ mit Quirins erstem Besuch (Anhang H). Darin kommt alles vor, was getestet werden muss: alle Stimmen mit ihren Dialekten, ein Hörspiel vor der Schleuse, ein Schallsignal, Antwortknöpfe mit Vertiefung, Katalogsätze, Merksätze, eine Falle, ein doppeldeutiger Witz. Oder lieber eine See-Folge ohne Quirin?
- **Quirins Herkunft** (Status O39): Vorschlag A (Bergführer aus dem Chiemgau, fährt seit seiner Jugend sein Boot auf Donau und Main-Donau-Kanal, Boot in Kelheim) oder B (aus Kelheim, Sohn eines Binnenschiffers, später Bergführer)?
- **ElevenLabs in der Cloud** (E5, F2): Für die Vertonung brauche ich deinen Schlüssel als Secret der Cloud-Umgebung (`ELEVENLABS_API_KEY`) und die Freigabe der Domain `api.elevenlabs.io` unter „Network access“. Das stellst du in den Umgebungseinstellungen ein; es wirkt erst in einer neuen Sitzung. Den Schlüssel bitte nie in den Chat schreiben.
- **Stimmen für die Probe:** Hinnerk (Bill), Smilla (Lily), Klabauter (Wally), Harms (Stimme aus dem Stimmenpaket), Quirin (George, unbestätigt). Passt das, oder hast du im Casting schon andere gewählt?

**Später, nicht für die Probe:**
- O15: Erkennungston am Folgenanfang und bei richtiger Antwort, so richtig verstanden (§10.6)?
- Revier für Teil B: Main-Donau-Kanal mit Ausflügen an Donau und Chiemsee (§19.1)?
- O40: Dürfen nach dem Streichen der Bayern-Regel auch die Klischees Lederhose, Weißwurst und Bier vorkommen?
- V42 (Scheine, Termine, Lernzeit in der App, §3.5): vor oder nach dem Player bauen?
- Die Leitplanken der Live-KI in der App (`TONE`) folgen noch der alten Tonregel. Sollen sie zum neuen Ton passen?

**Fehlende Quellen:**
- F3 Prüfungsordnung und Prüfungsrichtlinie (bitte in `quellen/`),
- SpFV Anlage 3 am Original,
- Promillegrenze,
- SBF-Frage 279.

**Stimmen:** Die Rangerin hat noch keine Stimme, Quirins Stimme (George) ist unbestätigt. Die Stimmen überarbeitest du selbst.

---

## Anhang A: Skriptform

Folgenskripte liegen in `podcast/folgen/` (Datei `S2-2.md` für Folge S2.2, Vorlage `podcast/folgen/VORLAGE.md`).
- **Kopf** zwischen zwei `---`-Zeilen:
  - `folge: S2.2`,
  - `titel: …`,
  - `status: entwurf | geprüft | freigegeben`.
- **Danach** ist jede Zeile eines von:
  - eine Sprecherzeile `FIGUR: Text` (Figuren-IDs aus `podcast/audio_config.json`: `HINNERK`, `SMILLA`, `QUIRIN`, `KLABAUTER`, `HARMS` und die Gäste),
  - ein Regiecode allein auf der Zeile,
  - ein Kommentar (`#`).
- Regiecodes dürfen auch in einer Sprecherzeile stehen.

| Code | Bedeutung |
|---|---|
| `[[ABSCHNITT: Titel]]` | neuer Abschnitt = Kapitelmarke und eigene Audiodatei; beginnt eine neue Szene |
| `[[SZENE: Ort, Lage]]` | neue Szene (erzeugt keine Geräusche) |
| `[[REVIER: frei \| fahrwasser \| vtg \| nok \| hafen \| watt \| schleuse \| an Land \| fluss \| binnensee]]` | Pflicht in jeder Szene; das Revier muss im Text auch ausgesprochen werden |
| `[[BAUSTEIN: garn \| stichprobe \| detektiv \| tonlabor \| gast \| streit \| kopfkino]]` | der Baustein laut Kursplan |
| `[[VORAB: sbf:15]]` | Vorab-Frage im Kaltstart |
| `[[RUECKBLICK: sbf:125]]` | Abruf einer Frage aus einer früheren Folge |
| `[[KATALOG: sbf:14]]` | Der nächste Satz enthält die amtliche richtige Antwort. |
| `[[FALLE: sbf:14]]` | Der nächste Satz zitiert eine amtliche Falschantwort. |
| `[[IRRTUM: sbf:15]]` … `[[BERICHTIGUNG: sbf:15]]` | Irrtum und Berichtigung, höchstens 20 Sekunden auseinander |
| `[[DENKPAUSE: 3 \| 5 \| 6]]` | Stille in Sekunden mit Signalton; 3 erinnern, 5 entscheiden (mit Knöpfen), 6 Kernsätze; danach die Lösung |
| `[[WAHL: sbf:15 \| Antwort \| *richtige Antwort]]` oder `[[WAHL: sbf:15]]` | Antwortknöpfe im interaktiven Modus; die Fragen-ID ist Pflicht (zählt in der Statistik), nur nach `[[VORAB]]` darf sie fehlen; steht nach der gesprochenen Frage, direkt danach `[[DENKPAUSE: 5]]` |
| `[[VERTIEFUNG: sbf:15]]` … `[[VERTIEFUNG: ende]]` | tiefere Erklärung als eigener Clip, nur interaktiv nach falscher Antwort; höchstens etwa 600 Zeichen und zwei Stimmen; Pflicht nach jeder Wahl zu einer Frage der Folge |
| `[[ANIM: id, schritt]]` | Animation im interaktiven Modus (IDs in §11.2) |
| `[[BILD: sbf:91]]` | die App zeigt das Katalogbild (interaktiv) |
| `[[SIGNAL: ● ▬ ●]]` | Signal, im Code erzeugt; die App zeigt die Zeichen |
| `[[MERKHILFE: gilt beim Kreuzen]]` | Merkhilfe mit Geltungsbereich, höchstens sechs je Folge; am besten der Merksatz der App |
| `[[HOERKARTE: sbf:15]]` | Beginn der Hörkarte zu dieser Frage; steht nach der Folge, eine je Frage |
| `[[FRAGE: sbf:15]]` | Zuordnung einer Frage ohne Katalogsatz (Bible A7) |

- Dazu gelten die Codes aus Bible §14: `INTENTION`, `PAUSE`, `TEMPO`, `PRON`, `AUDIO`, `BETONUNG`, `FIGUR`, `PRUEFUNG`.
- `[[SCHRITT]]` aus Fassung 3 gilt weiter wie `[[ABSCHNITT]]`, wird aber nicht mehr verwendet.
- Prüfen beim Schreiben: `node tools/podcast-pruefen.js --entwurf podcast/folgen/S2-2.md`.

---

## Anhang B: Ablaufplan G3.1 „Anlegen und Ankern“

**Rahmen:**
- Teil G, Kapitel G3, erste Folge (mit Kapitelüberblick).
- Form „Regel für Regel“, Rahmen Besuch, 14 Minuten, Baustein Gast mit der Hafenmeisterin.
- Revier: Hafen (Stadthafen Eckernförde); eine Szene vor Anker (freie See).

**Fragen:** 35, 39, 40. Ausführlich: 35 und 40.

**Vorausgesetzt:**
- Radeffekt und Anlegeseite (G2.1, Fragen 41 und 48),
- „in Fahrt“ (G1.2, Frage 3).

**Animation:** `anlegen`. **Recherche:** R21 (Radeffekt), R24 (Ankern).

| Zeit | Abschnitt, Teil | Inhalt | Pause, Knöpfe |
|---|---|---|---|
| 0:00–1:00 | 1 Einstieg: Kaltstart | Stadthafen Eckernförde, Möwen, Fender. Ein Charterboot will mit Rückenwind schnell in die Box. Vom Steg ruft die Hafenmeisterin: „Nicht so!“ Hinnerk brummt: „Kiek mol. Gleich gibt's Kleinholz.“ **Vorab-Frage:** Warum legt man möglichst gegen Wind und Strom an? | Wahl ohne Auswertung (`[[VORAB: sbf:35]]`): „weil es schneller geht \| *weil man das Boot sicherer manövrieren kann \| weil man Sprit spart“, 5 s |
| 1:00–1:45 | Begrüßung, Rückblick | Hinnerk: „Moin.“ Smilla fragt: (1) Rechtsdrehender Propeller, Rückwärtsgang: Wohin geht das Heck? (Frage 41, G2.1) (2) Wann ist ein Boot „in Fahrt“? (Frage 3, G1.2) | je 3 s, dann die Antwort in einem Satz mit Merksatz („Rechtsdreher legt links an“) |
| 1:45–3:00 | Kapitelüberblick G3 | Hinnerk: „Am Steg guckt jeder zu. Da zeigt sich, wer sein Boot im Griff hat.“ Smilla, Denkmodell: „Langsam, mit Plan und gegen die Kraft, die dich schiebt.“ Klabauter (Glocke): „Langsam ran! Langsam!“ Die zwei Folgen des Kapitels. Harms am Telefon: „Beim Winkel sagen die meisten neunzig Grad.“ Ziel: sicher anlegen, prüfen, ob der Anker hält, und großen Schiffen nicht zu nah kommen. | – |
| 3:00–3:15 | Landkarte | „Heute drei Dinge: gegen Wind und Strom, der spitze Winkel und die Frage, ob der Anker hält.“ | – |
| 3:15–6:00 | 2 Regel 1: gegen Wind und Strom (35) | Die Hafenmeisterin am Steg erklärt und nennt, was viele denken: „Mit Rückenwind geht's schneller.“ Schneller ja, sicherer nein (kein Irrtum einer Figur, sondern eine genannte Fehlvorstellung, §5.5). **Warum:** Gegen Strom oder Wind hast du Fahrt durchs Wasser und damit Ruderwirkung, kommst über Grund aber nur langsam voran; Wind und Strom bremsen für dich. Mit Rückenwind musst du schneller sein oder kräftig rückwärts aufstoppen. **Bild:** „Gegenwind ist deine Bremse.“ **Katalogsatz:** „Weil sich das Fahrzeug dabei sicherer manövrieren lässt.“ *(Die Praxisbegründung vor dem Skript mit Quelle belegen und ins Dossier aufnehmen.)* | Wahl (`sbf:35`): „Steg A mit Wind von hinten oder Steg B mit Wind von vorn: Wo legst du an? \| *Steg B, gegen den Wind \| Steg A, mit Rückenwind“, 5 s; Vertiefung: Smilla mit dem Bild vom Bergabfahren mit dem Fahrrad (Rückenwind schiebt, du musst kräftig bremsen) |
| 6:00–8:00 | Regel 2: der spitze Winkel (40), Bezug auf Frage 48 | Die Hafenmeisterin: flach anlaufen, fast parallel zum Steg, langsam. **Warum:** Der Bug trifft den Steg nicht, kleine Korrekturen reichen, ein kurzer Rückwärtsgang stoppt auf. Mit rechtsdrehendem Propeller zieht der Radeffekt beim Aufstoppen das Heck nach Backbord an den Steg, darum Backbordseite (Rückbezug G2.1). **Bild:** wie beim Einparken, schräg und langsam, nicht frontal. **Merkhilfe** (gilt beim Anlegen, Merksatz der App): „Anlegen wie eine Landung: flach und spitz heran, nicht im rechten Winkel wie ein Rammbock.“ Klabauter mit Glocke: „Spitz ran! Wie eine Landung!“ **Katalogsatz:** „Ein möglichst spitzer Winkel.“ | Animation `anlegen` (Schritte: Winkel, Aufstoppen, Radeffekt); Wahl (`sbf:40`): „Wie läufst du den Steg an? \| *flach, im spitzen Winkel \| im rechten Winkel \| möglichst stumpf“, 5 s; Vertiefung: Warum beim rechten Winkel der Bug zuerst trifft und kein Aufstoppen mehr hilft |
| 8:00–9:45 | 3 Baustein Gast | Die Hafenmeisterin erzählt aus ihrem Hafen: Fender raus und Leinen klar, bevor man einläuft; jeder an Bord weiß, wer welche Leine nimmt; nie Hand oder Fuß zwischen Boot und Steg. *(Praxis vor dem Skript mit Quelle belegen.)* | – |
| 9:45–11:45 | Regel 3: Hält der Anker? (39) | Szenenwechsel: abends vor Anker in der Eckernförder Bucht, weit weg vom Fahrwasser (Revier `frei`). Hinnerk erklärt: Hand auf die Kette; ruckt sie nicht und bleibt die Ankerpeilung gleich, hält der Anker. Die Ankerpeilung ist die Richtung zu einer festen Marke an Land, etwa einem Kirchturm. Dass sich das Boot am Anker hin und her dreht (schwojt), ist normal. Praxis (R24): als grobe Regel drei- bis fünfmal so viel Kette wie Wassertiefe, mit Leine und bei viel Wind mehr. **Katalogsatz:** „Wenn beim Handauflegen auf die Ankerkette oder -leine kein Rucken zu verspüren ist und sich die Ankerpeilung nicht ändert.“ | Denkfrage: „Die Kette ruckt. Was heißt das?“ 3 s, dann: Der Anker rutscht über den Grund. Danach Wahl (`sbf:39`) mit Vertiefung, 5 s |
| 11:45–12:45 | 4 Fallen-Check (Harms am Telefon) | **Falle** (40): „Stimmt's? Der günstigste Anlaufwinkel liegt bei neunzig bis hundert Grad.“ Falsch: möglichst spitz. **Falle** (35): „Stimmt's? Man legt gegen Wind und Strom an, weil dadurch Sog und Wellenschlag vermieden werden.“ Falsch: weil man sicherer manövriert. **Falle** (39): „Stimmt's? Der Anker hält, wenn die Kette nicht ruckt und das Fahrzeug nicht schwojt.“ Falsch: Schwojen tut jedes Boot; es kommt auf die Ankerpeilung an. | je 3 s |
| 12:45–14:00 | Abschluss | Smilla: „Nenn die drei Regeln von heute.“ Klabauter (Glocke): „Gegen Wind und Strom! Spitz ran! Kette ruhig, Peilung steht!“ Hinnerk: „Lieber zweimal anlaufen als einmal krachen.“ Ausblick: „Und was passiert, wenn ein Frachter an dir vorbeirauscht? Nächstes Mal erzählt Smilla vom Rhein.“ | 6 s |

**Hörkarten:** 35, 39, 40.

---

## Anhang C: Ablaufplan S2.2 „Begegnen, Kreuzen, Überholen, Segeln“

**Rahmen:**
- Teil S, Kapitel S2, zweite Folge.
- Form „Regel für Regel“, Rahmen Törn (drei Begegnungen), 15 Minuten, Baustein Streitgespräch.
- Revier: freie See (Kieler Förde zur Kieler Woche, am Rand der Regattabahnen, weit weg vom Fahrwasser).

**Fragen:** 81, 126, 127, 137. Ausführlich: 81, 126, 137. Frage 127 ist die See-Fassung von Frage 14 und wird kurz mitgenommen.

**Vorausgesetzt:**
- Luv und Lee (G1.2),
- die zwei Grundregeln (G5.2, Fragen 14 und 15),
- die stehende Peilung (S2.1, Frage 125),
- die Grundlichter (G5.1).

**Animationen:** `begegnung`, `wind`. **Recherche:** R39 (Kieler Woche), R42 (Lee vor Luv).

| Zeit | Abschnitt, Teil | Inhalt | Pause, Knöpfe |
|---|---|---|---|
| 0:00–1:00 | 1 Einstieg: Kaltstart | Kieler Woche, viele Segel, „wir sind am Rand der Regattabahnen, weit weg vom Fahrwasser“. Hinnerk am Ruder, ein anderes Segelboot kommt näher, beide haben den Wind von Steuerbord. Hinnerk: „Wer muss jetzt weg, der oder wir?“ **Vorab-Frage:** Zwei Segler, Wind von derselben Seite: Wer muss ausweichen? | Wahl ohne Auswertung (`[[VORAB: sbf:126]]`): „der Kleinere \| der Leewärtige \| *der Luvwärtige“, 5 s |
| 1:00–1:45 | Begrüßung, Rückblick | Harms fragt: (1) Woran erkennst du, dass es eng wird? (Frage 125, S2.1) (2) Zwei Motorboote kreuzen: Wer weicht aus? (Frage 15, G5.2) | je 3 s |
| 1:45–2:05 | Landkarte | „Heute drei Fälle für die freie See: entgegen, überholen und Segler unter sich.“ | – |
| 2:05–4:00 | 2 Regel 1: entgegen (127, Bezug 14) | Unter Motor auf dem Weg zur Regattabahn kommt ein Motorboot genau entgegen. **Regel:** beide nach Steuerbord, Backbord an Backbord vorbei. **Warum:** Keiner muss raten, was der andere tut. **Bild:** zwei Fußgänger auf einem schmalen Weg, beide weichen nach rechts aus. **Katalogsatz** (127): „Jedes Fahrzeug muss seinen Kurs nach Steuerbord ändern.“ Hinweis: Das gilt für Maschinenfahrzeuge; Segler unter sich kommen in Regel 3. | Animation `begegnung, entgegen` (später); Wahl (`sbf:127`): „Nachts siehst du vor dir Rot und Grün nebeneinander und Weiß darüber. Was tust du? \| *nach Steuerbord ausweichen \| nach Backbord ausweichen \| Kurs halten“, 5 s; Vertiefung: „Rot an Rot“ |
| 4:00–6:30 | Regel 2: überholen (81, 137) | Ein langsames Motorboot vor uns. **Regel:** Überholer ist, wer sich aus mehr als zweiundzwanzigeinhalb Grad achterlicher als querab nähert, also aus dem Bereich, in dem man nachts nur das Hecklicht sieht. Der Überholer weicht aus, immer, auch ein Segler gegenüber einem Motorboot. **Irrtum** (Hinnerk, gefühlte Regel): „Wir segeln, der hat 'n Motor. Also muss der aus'm Weg.“ **Berichtigung** (Smilla, unter 20 s): Überholer weicht immer aus, egal ob Segel oder Motor. **Warum:** Der Vordere sieht dich nicht kommen, du hast alles im Blick. **Bild:** „Wer das Heck sieht, hat die Arbeit.“ **Merkhilfe** (gilt beim Überholen), Klabauter mit Glocke: „Heck gesehen? Du weichst aus!“ **Katalogsätze** 81 und 137. | Animation `begegnung, ueberholen` (später); Wahl (`sbf:137`): „Du segelst und holst ein langsames Motorboot von hinten ein. Wer weicht aus? \| *du \| das Motorboot“, 5 s; Vertiefung: Fahrrad und Fußgänger (wie in der Vorlage) |
| 6:30–8:30 | 3 Regel 3: Segler unter sich (126) | Zurück zur Lage aus dem Kaltstart. **Regel:** Haben beide den Wind von derselben Seite, weicht der Luvwärtige dem Leewärtigen aus. **Warum:** Der in Luv kann leichter abfallen, und er würde dem anderen sonst den Wind wegnehmen (R42; vor dem Skript fachlich gegenlesen). **Bild:** Luv ist, wo die Luft herkommt. **Merksatz der App:** „Luv weicht Lee, sonst tut's weh: Das luvwärtige Boot, das dem anderen den Wind wegnehmen könnte, weicht aus.“ Auflösung der Vorab-Frage. **Katalogsatz:** „Das luvwärtige Fahrzeug dem leewärtigen Fahrzeug.“ | Animation `wind, luv-lee` (später); Wahl (`sbf:126`) mit Vertiefung, 5 s |
| 8:30–10:00 | Baustein Streitgespräch | Hinnerk: „Wer den Wind von Backbord hat, weicht aus!“ Smilla: „Lee vor Luv!“ Beide haben recht, für verschiedene Fälle: Wind von verschiedenen Seiten heißt, wer ihn von Backbord hat, weicht aus (Kollisionsverhütungsregeln, Regel 12). Wind von derselben Seite heißt Lee vor Luv; das fragt der Katalog. Smilla: „Lies genau, welche Seite.“ | zwei Wahlen: „Beide haben den Wind von Steuerbord, du bist in Luv. Wer weicht aus? \| *du \| der andere“ und „Du hast den Wind von Backbord, der andere von Steuerbord. Wer weicht aus? \| *du \| der andere“, je 5 s; die erste mit `sbf:126`, die zweite als Denkfrage (3 s), weil der Katalog diesen Fall nicht fragt |
| 10:00–11:30 | Anwenden | Drei kurze Fälle mit Geräusch: (1) Unter Motor kreuzt ein Motorboot von Backbord; du hältst Kurs (was das genau heißt, kommt in S2.4). (2) Du überholst unter Motor einen Segler: Du weichst aus. (3) Ein Segler kommt von achtern, schneller als du: Er ist Überholer und weicht aus. | je Wahl mit 5 s und Fragen-ID |
| 11:30–12:45 | 4 Fallen-Check (Harms am Telefon) | **Falle** (81): „Stimmt's? Überholer ist, wer sich aus mehr als hundertzwölfeinhalb Grad achterlicher als querab nähert, im Bereich der Seitenlichter.“ Falsch: zweiundzwanzigeinhalb Grad, Bereich des Hecklichts. **Falle** (126): „Stimmt's? Bei Wind von derselben Seite weicht aus, wer den Wind von Backbord hat.“ Falsch: Luv weicht Lee. **Falle** (137): „Stimmt's? Wer überholen will, gibt vorher ein Schallsignal und wartet auf Zustimmung.“ Falsch: Er hat dem anderen auszuweichen. | je 3 s |
| 12:45–14:15 | Abschluss | Smilla: „Nenn die drei Fälle.“ Klabauter (Glocke): „Entgegen: beide Steuerbord! Überholer weicht immer! Lee vor Luv!“ Hinnerk: „Und weich früh und deutlich aus, dann weiß der andere Bescheid.“ Ausblick: „Und wenn ein Fischer kommt, der gar nicht ausweichen kann? Nächstes Mal: Wer hat Vorrang?“ | 6 s |
| 14:15–15:00 | Puffer | Übergänge, Geräusche | – |

**Hörkarten:** 81, 126, 127, 137.

---

## Anhang D: Ablaufplan S3.1 „Das Lichtersystem“

**Rahmen:**
- Teil S, Kapitel S3, erste Folge (mit Kapitelüberblick).
- Form „System zuerst“, Rahmen Törn (Nachtfahrt, Licht für Licht), 15 Minuten, Baustein Kopfkino.
- Revier: freie See, nachts in der Lübecker Bucht, weit weg vom Fahrwasser.

**Fragen:** 85, 86, 91, 92, 113, 159, 160. Ausführlich: 91, 92, 113.

**Vorausgesetzt:**
- G5.1 (wann Lichter geführt werden, wozu sie dienen, Dreifarbenlaterne, motorender Segler),
- S2.2 (Überholsektor 22,5°).

**Animation:** `lichterkarussell`. **Recherche:** R26; die Sektoren aus KVR Regel 21 vor dem Skript am Original prüfen.

| Zeit | Abschnitt, Teil | Inhalt | Pause, Knöpfe |
|---|---|---|---|
| 0:00–1:00 | 1 Einstieg: Kaltstart | Nacht, Lübecker Bucht, „weit draußen, kein Fahrwasser in der Nähe“, leises Wasser. Vor uns zwei weiße Lichter übereinander, das hintere höher, darunter ein grünes. Hinnerk, leise: „Kiek mol. Wat is dat?“ **Vorab-Frage:** Was für ein Schiff? | Wahl ohne Auswertung (`[[VORAB: sbf:92]]`): „ein Segler \| *ein Maschinenfahrzeug über fünfzig Meter \| ein Ankerlieger“, 5 s |
| 1:00–1:45 | Begrüßung, Rückblick | Smilla fragt: (1) Wozu dient die Lichterführung? (Frage 11, G5.1) (2) Wann ist man Überholer? (Frage 81, S2.2) | je 3 s |
| 1:45–3:15 | Kapitelüberblick S3 | Hinnerk: „Nachts siehst du kein Schiff. Du siehst nur Lichter. Und die müssen dir alles sagen.“ Smilla, Denkmodell: „Lichter sind Sätze: Wer bin ich, wohin fahre ich, was tue ich gerade?“ Klabauter (Glocke): „Wer bin ich? Wohin? Was tu ich?“ Die sechs Folgen des Kapitels. Harms: „Ich zeig dir Bilder. Viele verwechseln zwei Rote mit Rot-Weiß-Rot.“ Ziel: jedes Fahrzeug aus dem Katalog an Lichtern und Signalkörpern erkennen. | – |
| 3:15–3:35 | Landkarte | „Heute drei Dinge: die vier Grundlichter, wie man daraus die Richtung liest, und wer nur Seitenlichter und Hecklicht zeigt.“ | – |
| 3:35–7:30 | 2 Das System | **Die Grundlichter:** Topplicht weiß, vorn oben, nach vorn und zu den Seiten; Seitenlichter, Steuerbord grün und Backbord rot; Hecklicht weiß nach achtern. Zusammen decken sie den ganzen Kreis ab. Der Bereich des Hecklichts ist genau der Überholsektor aus S2.2. **Baustein Kopfkino:** „Stell dir vor, ein Schiff dreht sich vor dir einmal um sich selbst …“ **Richtung lesen:** Rot und Grün zugleich, dann kommt es genau auf dich zu; nur Grün, dann fährt es von links nach rechts; nur Rot, von rechts nach links; nur das weiße Hecklicht, dann fährt es von dir weg. Backbords Halsband als Merkhilfe (links rot, rechts grün). **Länge:** unter fünfzig Metern ein Topplicht, ab fünfzig Metern ein zweites, achterlicher und höher (91, 92 mit Bild und Katalogsatz). Kleinere dürfen auch zwei führen; im Katalog gilt: Zwei Topplichter muss ein Fahrzeug ab fünfzig Metern führen. Smilla erzählt ihren eigenen Fehler: „Bei meinem ersten Nachttörn dachte ich: zwei Weiße übereinander, das ist ein Segler mit Laterne. Falsch.“ Zwei Topplichter zeigt ein Maschinenfahrzeug ab fünfzig Metern; ein Segler hat kein Topplicht. **Ohne Topplicht** (113): Segler, Ruderboote und geschleppte Fahrzeuge. **Merkhilfe** (gilt für Seitenlichter und Hecklicht ohne Topplicht, Merksatz der App): „Kein Motor, kein Topplicht: Segler, Ruderboote und Geschleppte fahren nur mit Seitenlichtern und Hecklicht.“ Klabauter mit Glocke: „Kein Motor? Kein Topplicht!“ | Animation `lichterkarussell` (Schritte: motor, motor50, segler); `[[BILD: sbf:91]]`, `[[BILD: sbf:92]]` |
| 7:30–9:00 | Anwenden | Drei Lichterbilder in Worten: (1) Rot und Grün nebeneinander, Weiß darüber: ein Maschinenfahrzeug unter fünfzig Metern, kommt auf dich zu; was tust du? Beide nach Steuerbord (Rückbezug S2.2). (2) Nur ein rotes Licht: ein Segler, Ruderboot oder Anhang, fährt von rechts nach links. (3) Auflösung der Vorab-Frage: zwei Weiße und Grün, ein Maschinenfahrzeug ab fünfzig Metern, fährt von links nach rechts. | Wahlen mit 5 s, Fragen-ID und Vertiefung, zum Beispiel (`sbf:91`): „Rot und Grün nebeneinander, Weiß darüber \| *kommt auf mich zu \| fährt von mir weg \| fährt quer“ |
| 9:00–11:30 | 3 Fragenstrecke | Smilla nennt die Fragen kurz, dann 3 s, dann der Katalogsatz und der Merksatz: (85) welche Vorschriften Lichter und Signale regeln; (86) welche Laternen auf deutschen Sportbooten erlaubt sind (Baumuster vom Bundesamt für Seeschifffahrt und Hydrographie zugelassen oder gleichwertige EU-Zulassung; Hinnerk: „Also nicht die Funzel aus dem Baumarkt.“); (159) der kleine Segler oder das Ruderboot, das die Lichter nicht führen kann: ein weißes Rundumlicht; (160) das Motorboot unter sieben Metern ohne Lichter darf nicht fahren, solange Lichter vorgeschrieben sind, außer im Notstand. | je 3 s |
| 11:30–12:45 | 4 Fallen-Check (Harms) | **Falle** (113): „Stimmt's? Nur Seitenlichter und Hecklicht führen Segler, Ruderboote und Maschinenfahrzeuge unter fünfzig Metern.“ Falsch: Segler, Ruderboote, geschleppte Fahrzeuge; Maschinenfahrzeuge haben immer ein Topplicht. **Falle** (159): „Stimmt's? Der kleine Segler, der die Lichter nicht führen kann, zeigt eine Dreifarbenlaterne.“ Falsch: ein weißes Rundumlicht. **Falle** (160): „Stimmt's? Das kleine Motorboot ohne Lichter darf zwischen Sonnenaufgang und Sonnenuntergang nicht fahren.“ Falsch: Es darf nicht fahren, solange Lichter vorgeschrieben sind, also nachts und bei verminderter Sicht. | je 3 s |
| 12:45–14:15 | Abschluss | Smilla: „Nenn die Grundlichter und was sie dir verraten.“ Klabauter (Glocke): „Rot links, Grün rechts! Weiß oben, Weiß hinten! Zwei Topplichter: fünfzig Meter plus!“ Hinnerk: „Siehst du nachts ein Licht, frag erst: wer? Dann: wohin?“ Ausblick: „Und wenn einer nur ein weißes Licht zeigt und sich nicht bewegt? Nächstes Mal: vor Anker und auf Grund.“ | 6 s |
| 14:15–15:00 | Puffer | Übergänge, Geräusche | – |

**Hörkarten:** 85, 86, 91, 92, 113, 159, 160. Beispiel für Frage 113:
- SMILLA: Seitenlichter rot und grün, ein weißes Hecklicht, aber kein Topplicht. Wer führt nur diese Lichter?
- *(Denkpause, 3 s)*
- SMILLA: Segelfahrzeuge, Ruderboote und geschleppte Fahrzeuge. Kein Topplicht heißt: Hier treibt gerade keine Maschine das Boot an.
- KLABAUTER: Kein Motor? Kein Topplicht!

---

## Anhang E: Quellen

Alle Quellen mit Nummer, Güte und Einsatz stehen im Dossier `docs/recherche-kajuetenfunk.md`. Die wichtigsten für dieses Konzept:
- **Amtlich:**
  - [Sportbootführerscheinverordnung, Anlage 3](https://www.gesetze-im-internet.de/spfv/anlage_3.html) (R2),
  - [Kollisionsverhütungsregeln, Regel 10](https://www.gesetze-im-internet.de/seestro_1972/regel_10.html) und [Regel 35](https://www.gesetze-im-internet.de/seestro_1972/regel_35.html) (R27, R44),
  - [Seeschifffahrtsstraßen-Ordnung, Anlage I](https://www.gesetze-im-internet.de/seeschstro_1971/anlage_i.html) (R29),
  - [IMO zu den Kollisionsverhütungsregeln](https://www.imo.org/en/About/Conventions/Pages/COLREG.aspx) (R26),
  - [Nationalpark Wattenmeer, Faltblatt Wassersport 2025](https://www.nationalpark-wattenmeer.de/wp-content/uploads/2025/12/Wassersport-Folder-2025.pdf) (R34).
- **Lernforschung:**
  - [Dunlosky u. a. 2013](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html) (R48),
  - [Mayer, Multimedia-Prinzipien](https://ugc.futurelearn.com/uploads/files/7d/d6/7dd6188d-c343-4311-b064-ac98d2c95abc/Multimedia_Principles._R._E._Mayer__2020.pdf) (R49),
  - [Meta-Analyse zu Widerlegungstexten](https://link.springer.com/article/10.1007/s10648-021-09656-z) (R50),
  - [Richland, Kornell, Kao zu Vorab-Fragen](https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf) (R51),
  - [Brunmair und Richter 2019 zum verschachtelten Lernen](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf) (R52),
  - [BMC Medical Education 2017 zur Länge von Lern-Podcasts](https://link.springer.com/article/10.1186/s12909-017-1001-5) (R53).
- **Prüfung und Praxis:**
  - [bootspruefung.de, schwierigste Prüfungsfragen 2024](https://www.bootspruefung.de/assets/reports/sportbootfuehrerschein-schwierigste-pruefungsfragen-jan-2024.pdf) (R5),
  - [YACHT zu schweren Prüfungsfragen](https://www.yacht.de/segelwissen/fuehrerschein/ausbildung-segelschein-diese-pruefungsfragen-haben-es-in-sich/) (R5),
  - [YACHT zum Radeffekt](https://www.yacht.de/segelwissen/manoever/seemannschaft-hafenmanoever-mit-dem-radeffekt/) (R21),
  - [YACHT, DGzRS-Bilanz 2025](https://www.yacht.de/special/seenot/dgzrs-bilanz-2025-haeufigste-pannen-bei-seglern/) (R9).
- **Technik:**
  - [ElevenLabs Text to Dialogue mit Zeitmarken](https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert-with-timestamps.md) (R54),
  - [GitHub Pages, Grenzen](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) (R56).
- **Neu in Fassung 5** (R59–R64):
  - Binnenschifffahrtsstraßen-Ordnung gilt nicht auf Rhein, Mosel und Donau; Entwurf 2024 zur Donau: [EU-Notifizierung (TRIS)](https://technical-regulation-information-system.ec.europa.eu/en/notification/25690/text/I/DE), [buzer.de](https://www.buzer.de/gesetz/5758/index.htm) (R60),
  - Donauschifffahrtspolizeiverordnung Kelheim bis Jochenstein: [Donaukommission](https://danubecommission.org/uploads/doc/publication/Lokale_Schifff_Reg/Lokale%20Schifffahrtsregeln%20DE%202006.pdf), [umwelt-online](https://umwelt-online.de/recht/gefahr.gut/binsch/donauschpv/donauschpv1.htm) (R61),
  - Chiemsee als Landesgewässer mit bayerischer Schifffahrtsordnung: [Bayerische Polizei](https://www.polizei.bayern.de/mam/wir-uber-uns/bayer_schifffahrtsordnung.pdf), [Bayerisches Verkehrsministerium](https://stmb.bayern.de/vum/wasser/personenschifffahrt/index.php) (R62),
  - Main-Donau-Kanal, 171 km, 16 Schleusen: [Britannica](https://www.britannica.com/print/article/358596), [Structurae](https://structurae.net/de/bauwerke/10000147) (R63),
  - Haftungsausschluss, Grenzen nach § 309 Nr. 7 BGB: [IT-Recht Kanzlei](https://www.it-recht-kanzlei.de/agb-haftungsausschluss-haftungsbegrenzung-wirksam.html), [Händlerbund](https://ohn.haendlerbund.de/recht/abmahnungen/131393-rechtswidrige-agb-klausel-wir-uebernehmen-keinerlei-haftung) (R64),
  - Lümmelbeschlag: [YACHT](https://www.yacht.de/diy/lifehacks/lesertipp-der-woche-zusaetzliche-baumsicherung-beim-luemmelbeschlag-bruch/) (Wortschatz).

Recherchiert wurde am 23.10.2026 per Websuche. Webseiten direkt zu öffnen war in der Cloud gesperrt. Was „am Original prüfen“ trägt, ist deshalb noch nicht bestätigt (§15.3).

---

## Anhang F: Was aus Fassung 3 wurde

| Fassung 3 | Fassung 4 | Grund |
|---|---|---|
| Lektion 0 und Kapitel 1–9, 39 Lektionen, etwa 7,3 Stunden | Teil G (16 Folgen) und Teil S (44 Folgen), knapp 14 Stunden | dein Wunsch nach „wirklich gutem Unterricht“, K5/K9 |
| eigener Kapitel-Auftakt von 3–4 Minuten | Kapitelüberblick am Anfang der ersten Folge eines Kapitels | weniger Leerlauf; V41 |
| jede Frage einzeln im Kern | zwei Kernformen, Schwerpunkt oder Fragenstrecke | dein Hinweis vom 22.10. |
| Revier-Angabe im Skript | Revier muss man hören (Satz und Geräusch), das Werkzeug warnt | dein Hinweis vom 22.10. |
| „unterwegs über Bluetooth“ mit freier Abrufrunde | Auto-Modus und interaktiver Modus mit Antwortknöpfen und Animationen | K7, K10 |
| Fragen zur Lektion: die Hälfte sofort, die Hälfte am nächsten Tag | Fragerunde bei Harms mit allen Fragen der Folge, Wiederholung am nächsten Tag über die Lernkartei | weniger Fragen je Folge (§2.4) |
| Hörkarten als eigenes Projekt | Hörkarten mit der Folge geschrieben, dazu Schnellspur | einheitlich, weniger Widersprüche |
| Audio getrennt hosten | erst im Repo und in der App | K4 |
| Lektionsskripte in `podcast/lektionen/`, Kopf `lektion:` | Folgenskripte in `podcast/folgen/`, Kopf `folge:` | neue Gliederung |
| Gäste Polizei 1.1, Hafenmeisterin 2.4, Fischer 4.4, Verkehrszentrale 6.4, Rangerin 7.4 | Polizei G1.1 und S6.3, Hafenmeisterin G3.1, Fischer S3.6, Verkehrszentrale S6.6, Rangerin S8.1 | neuer Kursplan |
| Geschichte, Frieda, Jonte als Material | im Archiv | K8 |
| Bleibt gleich: Katalogsatz, Fallen-Check mit echten Falschantworten, Denkpausen 4/6/8, Irrtum mit Berichtigung in 20 Sekunden, höchstens drei Merkhilfen und drei Stimmen je Szene, Baukasten mit sieben Bausteinen, Rangerin, Prüfweg, Signale im Code | | |

---

## Anhang G: Was sich in Fassung 5 geändert hat

| Fassung 4 | Fassung 5 | Grund |
|---|---|---|
| Quirin lernt mit und irrt wie ein Anfänger | Quirin ist Binnen-Profi; in Teil G und S zweimal zu Besuch (G6.3, S6.5), in Teil B Hauptfigur; die Fragen des Hörers verteilen sich auf Smilla, Hinnerk und die Gäste | dein Hinweis vom 23.10. |
| feste Klammer in jeder Folge | Pflicht ist nur, was das Lernen sichert; dazu sechs Rahmen (Hörspiel, Törn, Unterricht, Garn-Abend, Duell, Besuch) und eine Lage je Folge im Kursplan | „nicht monoton nach demselben Schema“ |
| Denkpausen 4, 6, 8 Sekunden | 3, 5, 6 Sekunden, danach immer die Lösung, auf Wunsch mit leisem Ticken | „Nicht zu lange“ |
| Antwortknöpfe ändern die Farben nicht | Antwortknöpfe tragen die Fragen-ID und zählen in der Statistik; der Vorab-Tipp zählt nicht | deine Entscheidung zu X8 |
| keine Vertiefung | Vertiefung als eigener Clip nach falscher Antwort, nur interaktiv | „tiefer erklärt, wenn man falsch antwortet“ |
| höchstens drei Merkhilfen, kurze Liste freigegebener Eselsbrücken | ein überarbeiteter Merksatz für jede der 285 Fragen, in App und Kurs gleich; bis zu sechs je Folge | „Merkhilfen ausbauen … für jede Frage“ |
| Ton: keine Gruppenbeleidigung, keine Bayern-Witze, kein Alkohol als Witz | gestrichen; doppeldeutige Seemannsbegriffe den Figuren zugeordnet; Erklärung aller Verbote (§9.5) | deine Entscheidung |
| Crew-Schein | Scheine, Termine für Theorie und Praxis und Lernzeit bestimmen Reihenfolge und Pensum (§3.5, V42) | dein Wunsch zu §3.5 |
| Chiemsee als Binnen-Revier | Vorschlag Main-Donau-Kanal, Ausflüge an Donau und Chiemsee (§19.1) | Chiemsee ist keine Schifffahrtsstraße |
| O7, O15, VS43, O17, O22, O38, O33 offen | entschieden (§2.1); Haftungsausschluss in der App | deine Antworten |
| drei Probe-Skripte zum Lesen als nächster Schritt | eine vertonte Probefolge als Ausschnitt (Anhang H), die drei Ablaufpläne sind auf Fassung 5 umgestellt | dein Auftrag |

---

## Anhang H: Plan der Probefolge

**Was du dir gewünscht hast:** ein Ausschnitt mit dem Anfang einer Beispielfolge, eine repräsentative Stelle, in der alles vorkommt, was getestet werden muss, etwa 5 bis 10 Minuten, höchstens etwa 6.000 ElevenLabs-Credits, fehlende Geräusche sind in Ordnung, Animationen kommen später, anklickbar über den Stuhl in der Kajüte. Erst nach deinem Startschuss.

**Vorschlag: der Anfang von G6.3 „Brücken und Schleusen“**, etwa 7 Minuten.
- **Warum diese Folge:** Sie hat alle Stimmen mit allen Dialekten (Quirin ist zu Besuch), ein echtes Hörspiel vor einer Schleuse, Katalogbilder (Tafel und Schleusenlichter) und im Rückblick ein Schallsignal aus dem Code. Antwortknöpfe, Vertiefung, Merksätze, Katalogsätze, Falle, Garn und ein doppeldeutiger Witz passen hinein. Und Quirins Bairisch kann dein Bekannter gleich mitprüfen.
- **Rahmen:** Teil G, Kapitel G6, Form „Regel für Regel“, Rahmen Besuch, Baustein Kopfkino, Revier Schleuse. Fragen 21, 28, 29, 30.
- **Ort:** vor einer Schleuse am Main-Donau-Kanal bei Kelheim, in Quirins Revier. Die Crew ist bei ihm zu Besuch.

| Zeit | Abschnitt, Teil | Inhalt | getestet wird |
|---|---|---|---|
| 0:00–0:05 | Erkennungston | kurz, falls du einen lieferst; sonst zwei Schläge der Schiffsglocke aus `audio/` (Klabauters Merk-Zeichen ist ein einzelner Schlag) | Erkennungston (O15) |
| 0:05–1:15 | 1 Einstieg: Hörspiel | Motor im Leerlauf, Wasser rauscht am Schleusentor. Hinnerk am Ruder, auf dem Kanal sichtlich unwohl: „Zwei rote Lampen nebeneinander. Und nu? Auf See hab ich so wat nich.“ Quirin, gut gelaunt: „Servus, Hinni. Do wartst.“ – „Hinnerk. Mit zwei n.“ **Vorab-Frage:** Zwei rote Lichter nebeneinander vor der Schleuse: Was heißt das? | Hörspiel, Revier hörbar, Platt und Bairisch, v4-Emotionen, Vorab-Knöpfe (5 s, zählen nicht) |
| 1:15–2:00 | Begrüßung, Rückblick | Harms ruft an und fragt: (1) ein Schallsignal aus dem Code, kurz-lang immer wieder (Frage 16, G6.2): „Bleib – weeeg!“; (2) Wann müssen die Lichter geführt werden? (Frage 10, G5.1). Je 3 s, dann die Antwort mit Merksatz. | Signal aus dem Code, Harms' Stimme, Denkpausen mit Ticken |
| 2:00–2:15 | Landkarte | Smilla: „Heute zwei Dinge: das Haltegebot und die Lichter vor der Schleuse.“ | Smillas Kölsch-Hauch |
| 2:15–4:15 | 2 Regel 1: Haltegebot (21) | Quirin zeigt auf die Tafel am Ufer: weiß, rot umrandet, ein schwarzer Balken. Warum man vor beweglichen Brücken, Sperrwerken und Schleusen hält. Merksatz der App: die Haltelinie an der Ampel. Katalogsatz. Hinnerk fragt: „Und wenn keiner kommt?“ Quirin: „Dann wartst trotzdem.“ **Antwortknöpfe** (`sbf:21`) mit Vertiefung. | Katalogbild, Antwortknöpfe mit Statistik, Vertiefung, Merksatz |
| 4:15–4:45 | Zwischenspiel | Klabauter im Quatsch-Modus („Hinni! Hinni!“, Zwieback), Backbord maunzt auf dem Kajütdach. | Klabauters zwei Modi, Geräusche |
| 4:45–6:45 | 3 Regel 2: Lichter vor der Schleuse (28, 29, 30) | Kopfkino mit Smilla: Nebeneinander wie eine Schranke (gerade zu), übereinander wie eine Mauer (dauerhaft gesperrt), zwei Grüne (Einfahrt frei, Gegenverkehr gesperrt). Quirins kurzes Garn von einem langen Warten an einer Schleuse. Ein Ausflugsschiff kommt aus der Kammer; Hinnerk: „Wat für 'n Heck.“ Smilla: „Wir reden über ein Schiff, Käpt'n.“ – „Ich auch.“ Auflösung der Vorab-Frage. Klabauter mit Glocke: „Nebeneinander: Schranke! Übereinander: Mauer!“ **Antwortknöpfe** (`sbf:29`) mit Vertiefung. | Kopfkino, Garn, doppeldeutiger Witz, Glocke, Katalogbilder |
| 6:45–7:15 | Falle | Harms: „Stimmt's? Zwei rote Lichter übereinander heißen: Brücke, Sperrwerk oder Schleuse geschlossen.“ 3 s. „Falsch. Übereinander heißt: Anlage dauerhaft gesperrt.“ | echte amtliche Falschantwort |
| 7:15–7:45 | kurzer Abschluss | Smilla: „Nenn die drei Lichter.“ 6 s. Klabauter mit Glocke, Hinnerk mit einem Praxissatz. | Abschluss, 6-Sekunden-Pause |
| danach | Hörkarte zu Frage 30 | eigener Clip, 20–25 s | Hörkarte |

- **Länge und Kosten:** etwa 5.000 bis 5.500 Zeichen Sprechtext (mit zwei Vertiefungen und einer Hörkarte). Ein Credit entspricht bei Eleven v4 etwa einem Zeichen; das prüfe ich vor dem Start auf der Preisseite. Ziel: höchstens 6.000 Credits, mit Reserve für eine Wiederholung einzelner Stellen. Über 6.000 gehe ich nicht ohne deine Zustimmung.
- **Geräusche:** aus `audio/` (Motor, Wellen, Möwe, Glocke, Katze, Papagei, richtig, falsch; Lizenz L1). Ein Schleusentor gibt es nicht, es darf fehlen.
- **Nicht dabei:** Animationen (kommen später), Titelmusik, die volle Fragerunde.

**So entsteht sie:**
1. Skript `podcast/folgen/G6-3.md` mit Kopf `status: probe`, geprüft mit `tools/podcast-pruefen.js`.
2. Ein Werkzeug `tools/kurs-erzeugen.js`: Text to Dialogue mit Eleven v4 und Zeitmarken, je Abschnitt; Denkpausen, Ticken und Schallsignale baut `ffmpeg` ein (ist im Container vorhanden); Lautheit angleichen; MP3 mit 64 kbit/s Mono; Ablaufdatei mit Marken für Antwortknöpfe, Vertiefungen und Bilder.
3. Dateien nach `audio/kurs/probe/`.
4. In der App ein einfacher Player in eigener Datei (`kurs.js`, R11): Abschnitte als Kapitel, Auto- und interaktiver Modus, Antwortknöpfe, Vertiefung, Katalogbilder, Tempo. Erreichbar über den Hocker in der Kajüte („🎧 Kajütenfunk: Probefolge“).
5. Rauchtest, dann veröffentlichen. Du hörst am Handy, in beiden Modi.

**Was du dafür tun musst:**
- den Startschuss geben (§21),
- in den Umgebungseinstellungen das Secret `ELEVENLABS_API_KEY` anlegen und die Domain `api.elevenlabs.io` erlauben; danach eine neue Sitzung starten,
- auf Wunsch einen Erkennungston liefern.
