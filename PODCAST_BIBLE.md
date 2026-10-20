# PODCAST_BIBLE.md – Regelwerk für den Kajütenfunk

> **Verbindliches Regelwerk für alle Podcastfolgen („Kajütenfunk“) der App Skipper.** Stand: 20.10.2026.
> Offene Fragen, Widersprüche, fehlende Informationen, unbestätigte Vorschläge und der Verlauf der Entscheidungen stehen in **`PODCAST_STATUS.md`**.
> Diese Datei enthält nur, was der Nutzer beschlossen hat, was aus bestehenden Projektregeln (CLAUDE.md) folgt, und prüfbare Kriterien, die Claude daraus abgeleitet hat. Abgeleitete Kriterien sind als solche gekennzeichnet.

---

## 0. Geltung und Umgang mit dieser Datei

- **G1** Vor jeder Arbeit an Podcastinhalten liest Claude diese Datei und wendet sie an. Das gilt für Konzept, Handlung, Skript, Fragenzuordnung, Ton, Aufnahme und Einbau. Bei Unklarheiten liest Claude zusätzlich `PODCAST_STATUS.md`.
- **G2** Die hier dokumentierten Entscheidungen sind die verbindliche Grundlage der Podcastproduktion. Claude ändert sie nicht stillschweigend. Änderungen schlägt Claude vor und trägt sie erst nach Bestätigung des Nutzers ein. *(Nutzer, 20.10.2026)*
- **G3** Offene Fragen aus `PODCAST_STATUS.md` entscheidet Claude nicht eigenmächtig. Was dort als offen oder als Vorschlag steht, ist **keine** Regel.
- **G4** Bei Widerspruch zu älteren Angaben über die Folgen in CLAUDE.md gilt diese Datei, weil sie die späteren Beschlüsse enthält. Betroffen sind §3 „keine sexuellen Anspielungen“ (nur für den Podcast), §4 „Teil 2“, V8, E10 und der Termin in §1. Alle übrigen Projektregeln aus CLAUDE.md gelten weiter, besonders R2, R7, R8, R9, R10, R12, E1 und E6.
- **G5** Eine spätere, ausdrücklich beschlossene Änderung ersetzt eine ältere Regel. Den Verlauf hält `PODCAST_STATUS.md` fest (Abschnitt 8).
- **G6** Die Vorschläge aus Claudes Nachricht vom 20.10.2026 nach der Bewertung der Varianten A/B/C sind vom Nutzer verworfen. Dazu gehören das große Rätsel, der Staffelplan mit 23 Folgen, die Verdächtigen, die Gastnamen und die Galionsfigur. Sie werden nicht verwendet, auch nicht in Teilen, außer der Nutzer fragt ausdrücklich danach.

### Legende
| Kennzeichen | Bedeutung |
|---|---|
| **PFLICHT** | Muss erfüllt sein. Eine Folge, die das verletzt, ist nicht fertig. |
| **BEVORZUGT** | So arbeiten, solange kein guter Grund dagegen spricht. Abweichungen nennt Claude im Bericht. |
| **OPTIONAL** | Erlaubt, aber nicht nötig. |
| **VERBOTEN** | Darf nicht vorkommen. |

| Quelle | Bedeutung |
|---|---|
| (N 05.10.), (N 09.10.), (N 10.10.) | Aussage des Nutzers an diesem Tag (2026), noch vor dem Podcast-Gespräch |
| (N 19.10.) | Auftrag des Nutzers zum Podcast, 19.10.2026 |
| (N 20.10. a) | Erste Antwort des Nutzers am 20.10.2026 (Geschichte statt Themen, Antworten 7–13) |
| (N 20.10. b) | Zweite Antwort des Nutzers am 20.10.2026 (Varianten A/B/C, Bayer, Ton) |
| (N 20.10. c) | Dokumentationsauftrag des Nutzers am 20.10.2026 |
| (CLAUDE.md …) | bestehende Projektregel |
| **abgeleitet** | Claude hat eine Nutzeraussage in ein prüfbares Kriterium übersetzt. Es gilt wie die Aussage selbst. Trifft es das Gemeinte nicht, gilt die Aussage, und das Kriterium wird nach Rückfrage korrigiert (siehe `PODCAST_STATUS.md`, O29). |

---

## 1. Grundidee und Ziel

- **P1 PFLICHT:** Der Kajütenfunk ist eine Reihe von Podcastfolgen. Käpt'n Hinnerk und „die beiden anderen“, Matrosin Smilla und Papagei Klabauter, unterhalten sich. *(N 19.10.)*
- **P2 PFLICHT:** Der Podcast soll einen echten Kurs ersetzen. Wörtlich: „ein echter sbf kurs dauert ja auch lange. der podcast soll einen solchen kurs ersetzen.“ *(N 19.10.)* Wie weit das für die Praxis gilt und wie der Hinweis in „Über die App“ lautet, ist offen (O12, O17).
- **P3 PFLICHT:** Es gibt mehrere Folgen, die aufeinander aufbauen und aufeinander abgestimmt sind. *(N 19.10.)*
- **P4 PFLICHT:** Über alle Folgen hinweg werden **alle Prüfungsfragen und die Praxis mindestens einmal** behandelt. *(N 19.10.)* Einzelheiten stehen in Abschnitt 4.
- **P5 PFLICHT:** Nicht trocken, sondern „wie wenn es drei seeleute miteinander besprechen unabhängig der prüfung“. Es soll wie ein Gespräch wirken, „mit geschichten, geplauder etc.“ *(N 19.10.)*
- **P6 PFLICHT:** Spannend, „fast wie eine ??? folge“ (gemeint ist das Hörspiel „Die drei ???“), „mit wirklich was zum mitdenken“. *(N 20.10. a)*
- **P7 PFLICHT:** Man lernt nebenbei etwas aus der Praxis, weil die Geschichten im Segel- und Bootsumfeld spielen. *(N 20.10. a)*
- **P8 PFLICHT:** Die Reihe wird **völlig neu** geschrieben. Die vorhandenen 25 Folgen und 20 Kurzgeschichten in `data/folgen.json` werden nicht überarbeitet, sondern ersetzt. *(N 20.10. a: „10 ja wird alles völlig neu“)*
- **P9 BEVORZUGT:** Qualität vor Tempo. Die Produktion „darf durchaus zeit in anspruch nehmen“ *(N 19.10.)*. Die Veröffentlichung der App ist ohnehin verschoben *(N 20.10. a)*.

## 2. Zielgruppe und gewünschte Wirkung

- **P10 PFLICHT:** Die Hörer sind Nutzer der App, die auf einen Bootsführerschein lernen. Die Crew und damit auch die Podcastfolgen behandeln den Schein, den man am Anfang angibt (Crew-Schein). Wörtlich: „den schein, den man am anfang angibt behandelt die crew. also die podcastfolgen, etc.“ *(N 10.10.)*
- **P11 PFLICHT:** Die Freigabe ist ab 12 Jahren *(CLAUDE.md E1)*. Witze wirken auf zwei Ebenen: Erwachsene verstehen die Anspielung, ein 12-Jähriger versteht etwas Harmloses *(N 20.10. a)*. Einzelheiten stehen in Abschnitt 8.
- **P12 PFLICHT (gewünschte Wirkung):**
  1. Kursersatz (P2).
  2. Spannung und Unterhaltung (P6).
  3. Mitdenken (P6, P32).
  4. Praxiswissen nebenbei (P7).
  5. Lernstand: Wer alle Folgen gehört hat, hat über die Fragen am Folgenende bereits einen Überblick, „was man eher weiß“ *(N 20.10. a)* (Abschnitt 10).

## 3. Umfang, Länge, Wortzahl

- **P13 PFLICHT:** Eine Folge dauert **25 Minuten**. *(N 20.10. a: „25 min folgen finde ich gut“)*
- **P14 Richtwert (abgeleitet aus Messung):** 25 Minuten entsprechen etwa **20.900 Zeichen** oder **3.350 Wörtern** gesprochenen Textes.
  - Grundlage ist das gemessene Sprechtempo des Stimmenpakets: im Schnitt 13,9 Zeichen pro Sekunde (Hinnerk 13,6, Smilla 15,5, Klabauter 10,6, Harms 13,6).
  - Dazu kommen 6,2 Zeichen pro Wort in den bisherigen Texten. Das ergibt etwa 134 Wörter pro Minute.
  - Nach dem ersten Tontest (P62) wird nachgemessen.
  - Die erlaubte Abweichung ist offen (O11). Offen ist auch, ob die Fragen am Ende in die 25 Minuten zählen (O10).
- **P15 Rahmen:** Für den Gesamtumfang nannte der Nutzer 4 bis 40 Stunden Redezeit („gesamt können wir denke ich zwischen 4-40h redezeit treffen“, *N 19.10.*). Die Zahl der Folgen und die Gesamtdauer sind offen (O2).

## 4. Inhalt, Abdeckung, Fakten und Quellen

- **P16 PFLICHT:** Jede Katalogfrage des behandelten Scheins kommt in mindestens einer Folge vor *(N 19.10.)*.
  - Bestand in der App: SBF See 285 Fragen (`data/sbf.json`), SBF Binnen 300 (`data/binnen.json`), SKS 638 Einträge (`data/sks.json`).
  - Welche Scheine eine Reihe bekommen und in welcher Reihenfolge, ist offen (O1).
- **P17 PFLICHT (abgeleitet aus P16 und P53):** Zu jeder Folge ist festgehalten, welche Katalogfragen sie behandelt (Fragen-IDs wie `sbf:120`).
  - Über alle Folgen zusammen ist jede Frage mindestens einmal zugeordnet.
  - Die Zuordnung ist maschinenlesbar, damit Abdeckung und Fragen am Folgenende geprüft werden können.
- **P18 PFLICHT (abgeleitet):** „Behandelt“ heißt: Der Inhalt der richtigen amtlichen Antwort wird in der Folge ausgesprochen und ist als richtig erkennbar. Er wird zum Beispiel von Smilla bestätigt oder steht unwidersprochen am Ende der Szene.
- **P19 PFLICHT:** Die Praxis wird mindestens einmal behandelt *(N 19.10.)*. Grundlage ist die Richtlinie zur praktischen Prüfung, besonders Anlage 4 (Praxisprotokoll) *(CLAUDE.md V24)*. Die Richtlinie liegt derzeit nur als Upload in der Cloud-Sitzung (F3).
- **P20 PFLICHT:** Es gibt eine Podcast-Folge zur praktischen Prüfung („es soll eine podcast-folge zur praktischen prüfung geben“, *N 10.10.*, CLAUDE.md V24). Wie sie in die neue Reihe passt, ist offen (O12, W5).
- **P21 PFLICHT:** Prüfungsinhalte stammen nur aus den amtlichen Katalogen und sind fachlich korrekt *(CLAUDE.md R8)*.
  - Arbeitsgrundlage sind die Katalogdaten der App in `data/*.json`. Die Originale liegen im Ordner `quellen/` und fehlen in der Cloud.
  - Was Claude ohne `quellen/` prüfen musste, wird im Bericht markiert *(R8)*.
- **P22 PFLICHT:** Smilla berichtigt das Kauderwelsch des Käpt'ns *(N 19.10.)*. Abgeleitet zusammen mit R8: Keine fachlich falsche, prüfungsrelevante Aussage bleibt am Ende einer Szene unberichtigt stehen.
- **P23 PFLICHT (abgeleitet aus R2 „nichts erfinden“, echten Orten und Meerjungfrauen-Garn):** Sachangaben über echte Orte, Regeln, Technik und Seemannschaft müssen stimmen. Erfundenes ist nur als Handlung der Geschichte oder als erkennbares Seemannsgarn erlaubt.
- **P24 PFLICHT:** Unsicherheit wird offen gesagt *(CLAUDE.md R2)*. Fakten, bei denen Claude unsicher ist, stehen im Bericht und werden im Skript nicht als sicher ausgegeben.
- **P25 BEVORZUGT:** Der Stoff für die Geschichten kommt aus dem Segel- und Bootsumfeld („gibt ja im segel/boot kontext genügend stoff“, *N 20.10. a*).

## 5. Grundstruktur der Reihe

- **P26 PFLICHT – Geschichte statt Themenreihe:** Der Nutzer bevorzugt die spannende Geschichte *(N 20.10. a)*. Wörtlich: „alle fragen zuerst auf den tisch werfen und eine tolle geschichte daraus machen. unabhängig von themenkategorien. alles kommt vor, wenn es gerade sinn macht.“ Die Variante, Themen gegliedert der Reihe nach abzuarbeiten, ist nicht gewählt.
- **P27 PFLICHT – Grundstruktur ist Variante C** („C ist ein sehr guter kompromiss“, *N 20.10. b*). So wurde C am 20.10. vorgestellt:
  - Jede Folge ist ein eigener Fall (Variante A) auf einer Etappe einer durchgehenden Reise (Variante B).
  - Über die ganze Staffel läuft ein großes Rätsel. Jede Folge liefert einen Hinweis darauf und endet mit einem kleinen Cliffhanger.
  - Das Staffelfinale „Prüfung bei Harms ist zugleich die Auflösung“ gehörte zur Beschreibung, ist aber nicht einzeln bestätigt (VS25, O4).
- **P28 BEVORZUGT – Aufbau eines Falls (Variante A, „A finde ich gut“, *N 20.10. b*):**
  1. Kaltstart mitten im Geschehen.
  2. Das Rätsel wird klar.
  3. Drei Stationen mit Hinweisen. Die Hinweise sind die Regeln, die man braucht.
  4. Eine falsche Fährte, oft Hinnerks Irrtum.
  5. Ein Wendepunkt.
  6. Eine faire Auflösung, die man selbst hätte finden können.

  Der Nutzer sagt selbst, dass A „nicht immer“ passt, vor allem bei trockenen Themen. Deshalb ist A bevorzugt und nicht Pflicht für jede Folge.
- **P29 BEVORZUGT – Reise (Variante B, „B finde ich auch sehr stark!“, *N 20.10. b*):** Eine durchgehende Fahrt, jede Folge ist eine Etappe. Spannung kommt aus Wetter, Zeit und Gefahr. Das Wissen braucht man, um durchzukommen.
- **P30 PFLICHT – Großes Rätsel:** Es gibt ein großes Rätsel über die Staffel („dass es eins gibt ist gut“, *N 20.10. b*).
  - Der Inhalt ist offen und muss besser sein als der Vorschlag „Lütt Deern“ („muss ein besseres sein“) (O4).
  - Die späteren Vorschläge vom 20.10. sind ebenfalls verworfen (G6).
- **P31 PFLICHT – Trockene Themen müssen auch vorkommen** („diese müssen eben auch mal rein“, *N 20.10. b*). Erlaubte Wege, alle **OPTIONAL** und vom Nutzer genannt:
  - ein paar ruhigere Folgen („ggf gibt es auch einfach ein paar langweilige folgen“),
  - ein Ausflug der drei, z. B. zum Zulassen des Bootes,
  - trockene Themen am Anfang der Reise,
  - bei schlechtem Wetter oder Flaute unter Deck über trockenere Themen plaudern.
- **P32 PFLICHT:** Jede Folge hat eine richtige Geschichte, „damit das wirklich sinn macht“ *(N 20.10. b)*. Abgeleitet: Das gilt auch für die ruhigeren Folgen aus P31, sie haben ebenfalls eine Handlung. Beides steht in derselben Nachricht.
- **P33 PFLICHT – Echte Orte:** Die Reise spielt an echten Orten (Antwort auf die Frage nach einer Reise als Rahmen: „7. falls es so ist, dann echte orte“, *N 20.10. a*). Für den SBF Binnen ist der Chiemsee genannt *(N 20.10. b)*. Ob die erfundene Übungskarte der App (Kliev-Mündung) eine Rolle spielt, ist offen (O25).

## 6. Aufbau und Dramaturgie einer Folge

- **P34 PFLICHT:** Jede Folge hat eine Geschichte (P32) mit Spannung wie bei „Die drei ???“ (P6). Abgeleitet aus „mit spannungskurven etc.“ *(N 20.10. a)*: Die Spannung steigt bis zu einer Auflösung an. Es ist kein gleichförmiges Gespräch.
- **P35 PFLICHT – Mitdenken (abgeleitet aus P6):** Jede Folge enthält mindestens ein Rätsel oder Problem, das der Hörer selbst lösen kann, bevor die Figuren es auflösen. Das nötige Wissen wurde vorher in derselben oder einer früheren Folge ausgesprochen.
- **P36 PFLICHT (aus Variante C, P27):** Jede Folge liefert einen Hinweis auf das große Rätsel und endet mit einem kleinen Cliffhanger.
- **P37 PFLICHT:** Nach der Erzählung kommen die Fragen am Folgenende (Abschnitt 10).
- **P38 Einleitung, Übergänge, Schluss:** Dafür gibt es außer P36 und P37 **noch keine beschlossenen Regeln**. Vorgeschlagen, aber nicht bestätigt sind unter anderem Kaltstart, Rückblick, Kapitel und Ausblick (VS2, VS5, VS20).
- **P39 BEVORZUGT:** Szenen im Stil der Referenzszene „Das Licht vor Fehmarn“ (Anhang A). Der Nutzer nannte sie „super“ *(N 20.10. b)*.

## 7. Figuren, Sprecher und Rollen

Grundlage sind die Figuren aus CLAUDE.md §3 und V1. Ilse und Piet gibt es nicht mehr.

- **P40 Rollenverteilung:** Der Nutzer findet sie grundsätzlich gut, sie „darf noch deutlich geschärft werden“ *(N 20.10. a)*. Die Schärfung ist offen (O5). Verbindlich ist bisher nur, was unten steht.
- **P41 Käpt'n Hinnerk:**
  - PFLICHT: Er erzählt viel Kauderwelsch, das Smilla berichtigt *(N 19.10.)*.
  - PFLICHT: Er irrt nicht immer („der kaptn irrt nicht immer“, *N 20.10. a*). Das ist die spätere Korrektur zu „viel Kauderwelsch“.
  - PFLICHT: Er erzählt auch von Meerjungfrauen und Ähnlichem, im doppeldeutigen Ton aus Abschnitt 8 *(N 20.10. b)*.
  - Aus CLAUDE.md §3: Käpt'n, grüßt mit „Moin“, trocken. Der Widerspruch „kurz angebunden“ gegenüber „erzählt viel“ ist offen (W2).
  - VERBOTEN (abgeleitet): Hinnerk liegt in jeder fachlichen Aussage falsch.
- **P42 Matrosin Smilla:**
  - PFLICHT: Sie weiß die Fakten, „man merkt, dass sie es drauf hat“ *(N 19.10.)*.
  - PFLICHT: Sie berichtigt Hinnerks Kauderwelsch (P22).
  - Aus CLAUDE.md §3: frech und schnell.
- **P43 Papagei Klabauter:**
  - PFLICHT: Er hat eine witzige Rolle und wiederholt wichtige Infos. Er macht entweder einen Witz oder sagt Wichtiges, Prüfungsrelevantes, und man merkt an ihm, welches von beiden *(N 19.10.)*.
  - Aus CLAUDE.md §3: Er wiederholt Wörter.
  - PFLICHT (abgeleitet): Jede Äußerung ist eindeutig Witz oder Wichtiges. Für „Wichtiges“ gibt es ein gleichbleibendes, hörbares Erkennungszeichen, in allen Folgen dasselbe. Welches Zeichen, ist offen (O6). In Anhang A sind es Schiffsglocke und „Krrah! Merken!“.
  - VERBOTEN (abgeleitet): Im Modus „Wichtiges“ wiederholt er etwas Falsches.
- **P44 Bordkatze Backbord:** PFLICHT: Sie spricht nicht *(CLAUDE.md V2, §3)*. OPTIONAL: Geräusche wie Miauen und Herumspringen, wie in Anhang A.
- **P45 Kapitän Harms** (Prüfer, interne ID `kroeger`): Laut CLAUDE.md §3 streng und knurrig. Seine Rolle im Podcast ist offen (O13).
- **P46 Gastrollen:** PFLICHT: Es gibt Gastrollen, dafür auch **zusätzliche eigene Stimmen** („gastrollen sind top“, „3. gerne zusätzlichen“, *N 20.10. b*). Der Nutzer hat diese Beispiele begrüßt: Hafenmeister, Funkstimme, Fischer. Figuren, Namen und Anzahl sind offen (O14).
- **P47 PFLICHT – Ein Bayer kommt vor,** „vor allem beim sbf binnen. (chiemsee)“ *(N 20.10. b)*. Ob er auch beim SBF See vorkommt und wie stark der Dialekt ist, ist offen (O14).
- **P48 Perspektive:** PFLICHT: Die drei unterhalten sich miteinander (P1, P5). Ob und wie sie den Hörer direkt ansprechen, ist offen (O7).
- **P49 Stimmen (abgeleitet aus CLAUDE.md §4 und P46):** Die festen Stimmen für hinnerk, smilla, klabauter und kroeger legt `audio/stimmen/manifest.json` fest. Gaststimmen kommen als weitere feste Stimmen dazu. Jede Figur behält in allen Folgen dieselbe Stimme.

## 8. Ton und Sprache

- **P50 PFLICHT:** „so derb wie geht“ *(N 20.10. a)*. Weiter gilt aus CLAUDE.md §3: derb und hart, plattdeutsch angehaucht.
- **P51 PFLICHT – doppeldeutige Witze:** „doppeldeutige witze die erwachsene verstehen! aber ein 12 jähriger vielleicht anders versteht! also sexuelle anspielungen, etc. aber eben doppeldeutig.“ *(N 20.10. a)* Bestätigt mit „ja genau der ton ist gut mit doppeldeutigen anspielungen“ *(N 20.10. b)*.
  - **Prüfregel (vorgeschlagen und bestätigt am 20.10.): „Harmlos vorgelesen, doppeldeutig gehört.“** Jede Anspielung hat eine vollständig harmlose wörtliche Lesart.
  - Muster aus Anhang A: „Was für ein Heck.“ – „Wir reden über ein Schiff.“ – „Ich auch.“
- **P52 OPTIONAL (als Teil der Tonregel vom 20.10. bestätigt):**
  - Seemannsflüche auf Plattdeutsch,
  - Beleidigungen unter den Dreien,
  - Garn aus der Hafenkneipe,
  - Wörter wie „Klookschieter“. Gefragt war am 19.10., ob das zu derb ist, die Antwort war „so derb wie geht“.
- **P53 PFLICHT:** Es soll wie ein Gespräch wirken, mit Geschichten und Geplauder *(N 19.10.)*. Wie viel Geplauder, ist offen (O3).
- **P54 Sprache:** Deutsch. Der Bayer spricht als Bayer (P47). Die genaue Dialektform ist offen (O14). Ob die Stimmen Platt- oder Bairisch-Färbung überzeugend sprechen, ist ungeprüft (F5).

## 9. Verboten

- **X1 VERBOTEN:** Trockenes Dozieren *(N 19.10.: „nicht so trocken“)*. Abgeleitet: Die bisherigen Folgen sind das Gegenbeispiel. Dort hält Hinnerk etwa 70 % des Textes als Vortrag, und auf eine Frage kommen etwa 7 Sekunden (`PODCAST_STATUS.md`, Abschnitt 7).
- **X2 VERBOTEN:** Ausdrückliche sexuelle Inhalte und Anspielungen ohne harmlose Lesart *(N 20.10. a: „aber eben doppeldeutig“)*.
- **X3 VERBOTEN:** Anspielungen auf Körper von Kindern, Drastisches und Alkohol als Witz über Kinder (Tonregel vom 20.10. und CLAUDE.md §3).
- **X4 VERBOTEN:** Beleidigungen von Gruppen *(CLAUDE.md §3)*. Wie das zu Witzen mit dem Bayern passt, ist offen (W8).
- **X5 VERBOTEN:** Unberichtigte fachliche Fehler (P22) und erfundene Sachangaben, die als Tatsache dargestellt werden (P23).
- **X6 VERBOTEN:** Klabauter ist mehrdeutig (Witz oder wichtig?), oder er sagt im Modus „Wichtiges“ etwas Falsches (P43).
- **X7 VERBOTEN:** Hinnerk irrt immer (P41).
- **X8 VERBOTEN (abgeleitet aus „fragen doch erst am ende je folge“, *N 20.10. a*):** Multiple-Choice-Fragen an den Hörer mitten in der Folge. Fragen, die sich die Figuren innerhalb der Geschichte stellen, sind erlaubt.
- **X9 VERBOTEN (abgeleitet aus P5 „unabhängig der prüfung“):** Die Figuren begründen Stoff mit der Prüfung, etwa „das kommt in der Prüfung dran“. Offen ist, wie sich das mit V24 und einer möglichen Harms-Folge verträgt (W5).
- **X10 VERBOTEN:** Der Name des Nutzers in Podcasttexten. Abgeleitet aus CLAUDE.md R10: Alles, was die Crew wiederholt sagt, ist ein fester Satz ohne Namen.
- **X11 VERBOTEN:** API-Schlüssel ins Repo schreiben oder ausgeben *(CLAUDE.md R9)*.
- **X12 VERBOTEN:** Podcastaudio pro Gerät oder bei jedem Abspielen neu erzeugen („kajütenfunk immer neu generieren wäre wahnsinn“, *N 05.10.*; „wir MÜSSEN es in die app legen“, *N 09.10.*).
- **X13 VERBOTEN:** Verworfene Ideen ohne neue Zustimmung wieder aufgreifen. Das betrifft das Rätsel „Lütt Deern“, die Vorschläge vom 20.10. (G6), die alte Themenreihe und die Zwischenfragen während der Folge (`PODCAST_STATUS.md`, Abschnitt 6).

## 10. Fragen am Ende jeder Folge und Lernfortschritt

- **P55 PFLICHT:** Fragen kommen erst am Ende jeder Folge („fragen doch erst am ende je folge“, *N 20.10. a*). Das ersetzt die ursprüngliche Idee vom 19.10., die Crew stelle ab und zu Zwischenfragen und das sei einstellbar. Ob es noch einen Schalter gibt, ist offen (O8).
- **P56 PFLICHT:** „dann klickt man alle als multible coice durch“ *(N 20.10. a)*. Abgeleitet: „alle“ heißt alle Katalogfragen, die in dieser Folge behandelt wurden (P17). Diese Deutung muss noch bestätigt werden (O9).
- **P57 PFLICHT:** Die Antworten werden für den Lernfortschritt gemerkt *(N 20.10. a)*. Ziel: „so könnte man theoretisch: erst alle folgen hören, dann hat die app schon einen überblick, was man eher weiß.“
- **P58 PFLICHT:** Die Fragen erscheinen wie in der Prüfung, also im amtlichen Wortlaut aus `data/*.json` und mit dem Originalbild, wenn die Frage eins hat. Das folgt aus dem Grundsatz des Nutzers: Grafiken „müssen genau wie in der prüfung aussehen“ und Signale werden gelernt, wie sie in der Prüfung abgefragt werden *(N 10.10.)*. Für SKS sind die Katalogfragen offene Fragen. Wie dort Multiple Choice entsteht, ist offen (O26).

## 11. Konsistenz und wiederkehrende Elemente

- **P59 PFLICHT (abgeleitet aus P3):** Die Folgen widersprechen sich nicht. Das gilt für Figuren, Orte, Reiseverlauf, Hinweise auf das große Rätsel und früher erklärte Fakten. Später darf vorausgesetzt werden, was früher erklärt wurde.
- **P60 PFLICHT:** Die Merkmale der Figuren (Abschnitt 7) und Klabauters Erkennungszeichen (P43) sind in allen Folgen gleich.
- **P61 Wiederkehrende Elemente, die beschlossen sind:**
  - das große Rätsel (P30),
  - Hinnerks Meerjungfrauen-Geschichten (P41),
  - der Bayer, vor allem beim Binnen (P47),
  - Gastrollen (P46),
  - die Fragen am Folgenende (P55).

  Weitere wiederkehrende Elemente sind nicht beschlossen. Rückblick, Merkheft und Running Gags sind Vorschläge.
- **P62 PFLICHT (abgeleitet aus P17, P56 und P59):** Zu jeder Folge wird festgehalten:
  - behandelte Fragen-IDs,
  - Praxisinhalte,
  - Ort und Etappe,
  - Hinweis auf das große Rätsel,
  - Gastfiguren,
  - offene Fäden für spätere Folgen.

## 12. Produktion (Text, Ton, Einbau)

- **P63 PFLICHT:** Zuerst reifen die Texte aus. ElevenLabs kommt erst, „wenn die folgen ausgereift sind“ *(N 20.10. a)*.
- **P64 PFLICHT:** Der erste Tontest umfasst **nur einen Teil einer Folge** („aber erstmal 'nur' einen teil einer folge als test“, *N 20.10. a*).
- **P65 PFLICHT:** Danach darf Claude den ElevenLabs-Schlüssel verwenden („du darfst es dann verwenden“, *N 20.10. a*).
  - Der Schlüssel liegt nur als Secret der Cloud-Umgebung vor und wird nie ins Repo geschrieben oder ausgegeben *(R9, CLAUDE.md E5 Weg a)*.
  - Das Secret richtet der Nutzer ein (F2).
- **P66 PFLICHT:** Jede Folge wird genau einmal erzeugt und liegt danach in der App, also im Repo, für alle Nutzer *(N 05.10., N 09.10., CLAUDE.md §4)*.
- **P67 PFLICHT:** Die Folgen laufen offline und ohne Claude, ElevenLabs oder Internet (`docs/konzept-architektur.md` §1.1, entschieden 05.10.: „Folgen … funktionieren offline und ohne Schlüssel“). Wie das bei der Datenmenge umgesetzt wird, ist offen (O21).
- **P68 PFLICHT:** Die Stimmen haben hohe Qualität *(CLAUDE.md E6)*. Vor der Erzeugung prüft Claude, ob ElevenLabs ein besseres Modell für Deutsch anbietet, und erzeugt zuerst Probesätze *(CLAUDE.md §4)*. Der Test aus P64 erfüllt diese Probe.
- **P69 PFLICHT:** Lizenzen von zusätzlichen Gaststimmen werden vor der Nutzung geprüft und gemeldet. Stimmen aus der Voice Library können eigene Bedingungen haben *(CLAUDE.md R12, L4)*.
- **P70 PFLICHT:** Spielstände dürfen nicht brechen *(CLAUDE.md R7)*. Der Hörstand der alten Folgen (`S.heard` mit IDs wie `sbf-01` und `s-01`) darf beim Ersetzen keine Fehler auslösen. Neue Felder bekommen einen Standardwert.
- **P71 PFLICHT:** Große neue Bereiche kommen in eigene, nachgeladene Dateien, Texte und Listen nach `data/*.json` *(CLAUDE.md R11)*.

## 13. Prüfliste je Folge

Vor „fertig“ prüft Claude jede Folge gegen diese Liste und nennt Abweichungen im Bericht.

| # | Prüfpunkt | Regel |
|---|---|---|
| 1 | Die Folge hat eine richtige Geschichte mit steigender Spannung bis zur Auflösung. | P32, P34 |
| 2 | Es gibt mindestens ein Rätsel zum Mitdenken, das mit vorher genanntem Wissen lösbar ist. | P35 |
| 3 | Es gibt einen Hinweis auf das große Rätsel und einen kleinen Cliffhanger am Ende. | P36 |
| 4 | Die Länge liegt um 25 Minuten (Richtwert etwa 20.900 Zeichen). | P13, P14 |
| 5 | Die behandelten Fragen-IDs sind vollständig erfasst, und jede wird im Sinn von P18 behandelt. | P17, P18 |
| 6 | Jeder fachliche Irrtum Hinnerks wird von Smilla berichtigt, und nichts Falsches bleibt stehen. | P22, X5 |
| 7 | Hinnerk irrt nicht in jeder Aussage. | P41, X7 |
| 8 | Smilla wirkt kompetent, ihre Fakten entsprechen dem Katalog. | P42, P21 |
| 9 | Jede Äußerung Klabauters ist eindeutig Witz oder Wichtiges, und das Wichtige stimmt. | P43, X6 |
| 10 | Jede doppeldeutige Anspielung ist harmlos lesbar. Nichts aus X2 bis X4 kommt vor. | P51, X2–X4 |
| 11 | Es gibt keine Fragen an den Hörer mitten in der Folge und kein „das kommt in der Prüfung“. | X8, X9 |
| 12 | Es kommen keine Namen des Nutzers vor. | X10 |
| 13 | Sachangaben über echte Orte stimmen, Erfundenes ist als Handlung oder Garn erkennbar. | P23 |
| 14 | Nichts widerspricht früheren Folgen, und die Folgenakte nach P62 ist aktualisiert. | P59, P62 |
| 15 | Ohne `quellen/` Geprüftes ist im Bericht markiert, Unsicheres ist benannt. | P21, P24 |
| 16 | Kein verworfener Vorschlag wird ohne neue Zustimmung verwendet. | G6, X13 |

---

## Anhang A – Referenzszene „Das Licht vor Fehmarn“

Status: Claude zeigte die Szene am 20.10.2026, der Nutzer bewertete sie als „die beispielinteraktion von dir ist super“ *(N 20.10. b)*. Sie dient als Maßstab für Ton, Figuren und Szenenbau (P39). Sie ist **kein fertiger Skripttext**. Vor einer Verwendung sind die Prüfhinweise darunter zu beachten.

> Nacht, drei Uhr, Fehmarnbelt. Die Segelyacht läuft leise, dazu Wellen und Wind.
>
> **Smilla:** Käpt'n, steuer ein bisschen nach Steuerbord. Da vorn ist ein Licht.
> **Hinnerk:** Das ist kein Licht, das ist die Lütt Deern. Das Geisterschiff. Wer nachts ein einzelnes weißes Licht sieht, ist so gut wie tot.
> **Smilla:** Käpt'n.
> **Hinnerk:** Was für ein Heck. Hörst du? Das hat Kurven.
> **Smilla:** Wir reden über ein Schiff.
> **Hinnerk:** Ich auch.
> *(Miau. Backbord springt aufs Kartenhaus.)*
> **Smilla:** Das Licht ist weiß und steht still im Bild. Und wir kommen näher. Das ist ein Hecklicht. Wir sehen das Schiff von hinten.
> **Klabauter:** Hecklicht! Hecklicht!
> **Smilla:** Und was nur Seitenlichter und ein Hecklicht trägt, ist ein Segler, ein Ruderboot oder ein geschlepptes Fahrzeug.
> **Hinnerk:** Ein Ruderboot. Um drei Uhr nachts im Belt. *(leise)* Das ist nicht gut.
> **Smilla:** Eben. Und wir holen auf. Wer sich einem Fahrzeug von hinten nähert, mehr als 22,5 Grad hinter seiner Querlinie, ist Überholer. Wir sind hier die Ausweichpflichtigen.
> **Hinnerk:** Quatsch. Der Kleinere weicht immer dem Größeren aus.
> **Smilla:** Und wenn der Kleinere vorn ist und wir ihn überholen?
> **Hinnerk:** Dann … nehmen wir Rücksicht.
> **Smilla:** Nein. Der Überholer weicht aus, egal wie groß er ist.
> **Klabauter:** *(Glocke)* Krrah! Merken! Der Überholer weicht aus! Immer!
> *(Das Licht vor ihnen erlischt. Stille. Nur das Wasser.)*
> **Hinnerk:** *(flüsternd)* Wer löscht nachts sein Licht, wenn er gefunden werden will?
> *(Ende des ersten Akts. Musik.)*

Behandelte Fragen: `sbf:81`, `sbf:113`, `sbf:137`.

**Was der Nutzer daran gelobt hat** (nur die Szene als Ganzes, nicht einzelne Mittel):
- die Anspielung mit harmloser Lesart,
- Smilla leitet aus Beobachtungen ab,
- Hinnerks gefühlte Regel wird berichtigt,
- Klabauter wiederholt Wichtiges mit Erkennungszeichen,
- Backbord als Geräusch,
- ein Cliffhanger am Aktende.

**Prüfhinweise vor einer Verwendung:**
1. **„Lütt Deern“** gehört zum verworfenen Rätselvorschlag (P30). Der Name darf so nicht übernommen werden.
2. **Die Schlussfolgerung „einzelnes weißes Licht, steht still, wir kommen näher, also Hecklicht“ ist fachlich nicht zwingend.** Ein Ankerlieger unter 50 m zeigt ebenfalls ein einzelnes weißes Rundumlicht (`sbf:114`), und auch bei ihm bleibt die Peilung beim Näherkommen gleich. Die Szene braucht einen weiteren Hinweis, der den Ankerlieger ausschließt, sonst verstößt sie gegen P21.
3. „Mehr als 22,5 Grad hinter seiner Querlinie“ gibt `sbf:81` sinngemäß wieder (amtlich: „mehr als 22,5° achterlicher als querab“). Im Skript den amtlichen Kern beibehalten.
4. Glocke und „Krrah! Merken!“ sind als Erkennungszeichen noch nicht beschlossen (O6).
