# PODCAST_STATUS.md – Stand der Entscheidungen zum Kajütenfunk

> Begleitdatei zu **`PODCAST_BIBLE.md`**. Hier steht, was beschlossen, offen, widersprüchlich, fehlend oder nur vorgeschlagen ist. Stand: 20.10.2026.
> **Was hier als offen (O), Widerspruch (W) oder Vorschlag (VS) steht, ist keine Regel.** Claude entscheidet es nicht eigenmächtig, sondern fragt den Nutzer. Beschlossenes wird in die Bible übernommen.

---

## 0. Ausgewertete Quellen

- **Podcast-Gespräch vom 19. bis 20.10.2026:** vollständig im Wortlaut ausgewertet. Es besteht aus dem Auftrag des Nutzers (19.10.), Claudes erster Einschätzung, der Antwort des Nutzers (20.10. a), Claudes Varianten A–D mit Beispielszene, der zweiten Antwort des Nutzers (20.10. b) und dem Dokumentationsauftrag (20.10. c).
- **Ausgenommen auf Wunsch des Nutzers:** Claudes Nachricht vom 20.10. nach der A/B/C-Bewertung. Ihre Vorschläge sind verworfen (Abschnitt 6).
- **Frühere Sitzungsteile (05.–19.10.2026):** Alle Nachrichten des Nutzers im Sitzungsprotokoll wurden nach Aussagen zu Folgen, Podcast, Kajütenfunk, Stimmen und Ton durchsucht. Claudes eigene frühere Antworten wurden nach „Kajütenfunk“ und „Podcast“ durchsucht. Gelesen sind nur die Treffer, nicht die ganzen Antworten.
- **Projektdateien:**
  - `CLAUDE.md`,
  - `docs/konzept-architektur.md`, `docs/feste-saetze.md`, `docs/quellen.md`, `docs/lauf3-plan.md`, `docs/archiv/claude-v3.md`,
  - `data/folgen.json`, `data/sbf.json`, `data/binnen.json`, `data/sks.json`,
  - `audio/stimmen/manifest.json` mit Messung der Sprechdauer,
  - der Kajütenfunk-Code in `index.html` (`renderFunk`, `showStory`, `playEpisode`).

## 1. Endgültig beschlossene Entscheidungen

| Nr | Entscheidung | Datum | Wortlaut des Nutzers (Auszug) | Bible |
|---|---|---|---|---|
| B1 | Podcastreihe „Kajütenfunk“: Der Käpt'n und die beiden anderen unterhalten sich. | 19.10. | „die "podcastfolgen" kajütenfunk … der kapitän und die beiden anderen unterhalten sich“ | P1 |
| B2 | Mehrere Folgen, die aufeinander aufbauen und abgestimmt sind. | 19.10. | „mehrere Folgen, die aufeinander aufbauen und abgestimmt sind“ | P3 |
| B3 | Alle Prüfungsfragen und die Praxis werden mindestens einmal behandelt. | 19.10. | „während allen folgen des podcasts werden alle prüfungsfragen und die praxis mindestens einmal behandelt“ | P4, P16, P19 |
| B4 | Nicht trocken, wie drei Seeleute, unabhängig von der Prüfung, wie ein Gespräch mit Geschichten und Geplauder. | 19.10. | „aber nicht so trocken, sondern wie wenn es drei seeleute miteinander besprechen unabhängig der prüfung … mit geschichten, geplauder etc.“ | P5, P53 |
| B5 | Hinnerk erzählt viel Kauderwelsch, Smilla berichtigt und weiß die Fakten. | 19.10. | „der kapitän erzählt viel kauderwelsch, der von der matrosin berichtigt wird. sie weiß die fakten und man merkt, dass sie es drauf hat.“ | P22, P41, P42 |
| B6 | Klabauter macht entweder einen Witz oder sagt Wichtiges, und man merkt es an ihm. | 19.10. | „der papagei hat seine witzige rolle und wiederholt wichtige infos und dinge. (er macht entweder einen witz, oder sagt wichtiges, was prüfungsrelevant ist, merkt man an ihm)“ | P43 |
| B7 | Der Podcast soll einen echten Kurs ersetzen. | 19.10. | „der podcast soll einen solchen kurs ersetzen“ | P2 |
| B8 | Rahmen für den Gesamtumfang: 4 bis 40 Stunden. Der Nutzer formulierte vorsichtig („denke ich“). | 19.10. | „gesamt können wir denke ich zwischen 4-40h redezeit treffen“ | P15 |
| B9 | Es darf Zeit brauchen. Vor dem Loslegen wird alles gründlich besprochen. | 19.10. | „darf durchaus zeit in anspruch nehmen … bevor du loslegst will ich sehr tief mit dir besprechen“ | P9 |
| B10 | Die Folgen dauern 25 Minuten. | 20.10. a | „25 min folgen finde ich gut“ | P13 |
| B11 | Eine spannende Geschichte statt einer Themenreihe. Alles kommt vor, wenn es gerade Sinn macht. | 20.10. a | „bevorzugt: spannende geschichte“ | P26 |
| B12 | Spannend wie „Die drei ???“, mit etwas zum Mitdenken. Praxis lernt man nebenbei. | 20.10. a | „es soll fast wie eine ??? folge sein also spannend, mit wirklich was zum mitdenken … außerdem lernt man dann gleich etwas mit aus der "praxis"“ | P6, P7 |
| B13 | Die Rollenverteilung ist grundsätzlich gut, wird aber geschärft. Der Käpt'n irrt nicht immer. | 20.10. a | „die Rollenverteilung ist auch gut, aber darf noch deutlich geschärft werden. der kaptn irrt nicht immer.“ | P40, P41 |
| B14 | Echte Orte, wenn es eine Reise als Rahmen gibt (das ist mit B20 der Fall). | 20.10. a | „7. falls es so ist, dann echte orte.“ | P33 |
| B15 | Fragen erst am Ende jeder Folge, alle als Multiple Choice, mit Lernfortschritt. | 20.10. a | „8. fragen doch erst am ende je folge. dann klickt man alle als multible coice durch. das wird auch gemerkt für den lernfortschritt. so könnte man theoretisch: erst alle folgen hören, dann hat die app schon einen überblick, was man eher weiß.“ | P55–P57 |
| B16 | ElevenLabs erst, wenn die Folgen ausgereift sind. Dann darf Claude den Schlüssel verwenden, zuerst nur für einen Teil einer Folge als Test. | 20.10. a | „9. das kommt erst, wenn die folgen ausgereift sind. du darfst es dann verwenden. aber erstmal "nur" einen teil einer folge als test.“ | P63–P65 |
| B17 | Alles wird völlig neu geschrieben, die alten Folgen und Kurzgeschichten werden ersetzt. | 20.10. a | „10 ja wird alles völlig neu.“ | P8 |
| B18 | Die Veröffentlichung der App ist verschoben. | 20.10. a | „11. veröfffentlichung ist erstmal verschoben.“ | P9 |
| B19 | So derb wie möglich, mit doppeldeutigen, auch sexuellen Anspielungen, die ein 12-Jähriger harmlos versteht. | 20.10. a, bestätigt 20.10. b | „12. so derb wie geht. und wichtig: doppeldeutige witze die erwachsene verstehen! aber ein 12 jähriger vielleicht anders versteht! also sexuelle anspielungen, etc. aber eben doppeldeutig.“ – „2. ja genau der ton ist gut mit doppeldeutigen anspielungen.“ | P50–P52 |
| B20 | Die Grundstruktur ist Variante C (Fall pro Folge auf einer Reise, dazu ein großes Rätsel). A und B werden positiv bewertet. | 20.10. b | „A finde ich gut. passt aber, wie du sagst, nicht immer dazu … B finde ich auch sehr stark! … C ist ein sehr guter kompromiss.“ | P27–P29 |
| B21 | Trockene Themen müssen auch vorkommen: in ruhigeren Folgen, auf einem Ausflug (z. B. Zulassung des Bootes), am Anfang, bei Schlechtwetter oder Flaute unter Deck. | 20.10. b | „aber diese müssen eben auch mal rein. ggf gibt es auch einfach ein paar langweilige folgen. oder einen ausflug der drei zum zulassen des bootes etc. … dann kann man auch langweilige themen anfangs anstellen, oder mal bei schlechtem wetter oder bei einer flaute unter der kajüte über trockenere themen plaudern.“ | P31 |
| B22 | Es gibt ein großes Rätsel, es muss aber besser sein als der Vorschlag „Lütt Deern“. | 20.10. b | „großes rätsel: mhmm weiß nicht. dass es eins gibt ist gut, aber muss ein besseres sein.“ | P30 |
| B23 | Gastrollen mit zusätzlichen Stimmen. | 20.10. b | „gastrollen sind top … 3. gerne zusätzlichen.“ | P46 |
| B24 | Ein Bayer kommt vor, vor allem beim SBF Binnen (Chiemsee). | 20.10. b | „es soll auch ein bayer vorkommen. vor allem beim sbf binnen. (chiemsee).“ | P47 |
| B25 | Die Beispielszene „Das Licht vor Fehmarn“ ist die Referenz. | 20.10. b | „die beispielinteraktion von dir ist super.“ | P39, Anhang A |
| B26 | Jede Folge hat eine richtige Geschichte. | 20.10. b | „jetzt brauchen wir aber noch je folge eine richtige geschichte, damit das wirklich sinn macht.“ | P32 |
| B27 | Hinnerk erzählt auch von Meerjungfrauen und Ähnlichem, doppeldeutig. | 20.10. b | „zu dem doppeldeutigen: ja genau. der kapitän erzählt auch von meerjungfrauen etc.“ | P41 |
| B28 | Claudes Vorschläge nach der A/B/C-Bewertung sind verworfen. | 20.10. c | „lass dabei deine vorschläge aus der letzten nachricht weg. also die themen, folgen etc. … nicht besonders gut.“ | G6 |
| B29 | Die Doku ist verbindlich. Änderungen nur nach Vorschlag und Bestätigung. | 20.10. c | „Ändere sie nicht stillschweigend. Schlage Änderungen vor und hole meine Bestätigung ein“ | G2 |
| B30 | Die Folgen werden einmal erzeugt und in die App gelegt, nicht pro Gerät neu. | 05.10., 09.10. | „kajütenfunk immer neu generieren wäre wahnsinn“ – „wir MÜSSEN es in die app legen“ | P66, X12 |
| B31 | Die Folgen laufen offline und ohne KI-Schlüssel. | 05.10. | `docs/konzept-architektur.md` §1.1 (entschieden): „Lernen, Prüfen, Erklärungen, Lexikon, Folgen … funktionieren offline und ohne Schlüssel.“ | P67 |
| B32 | Die Crew und die Podcastfolgen behandeln den Schein, den man am Anfang angibt. | 10.10. | „den schein, den man am anfang angibt behandelt die crew. also die podcastfolgen, etc.“ | P10 |
| B33 | Es gibt eine Podcastfolge zur praktischen Prüfung (V24). | 10.10. | „es soll eine podcast-folge zur praktischen prüfung geben“ | P20 |
| B34 | Die Freigabe ist ab 12 (E1), der Ton jugendfrei, derb und hart (aufgelockert für den Podcast durch B19). | 09.10. | „kein fsk 18, alles jugendfrei. aber derb und hart.“ – „39. soll ab 12 sein.“ | P11 |
| B35 | Hohe Stimmqualität (E6). | 09.10. | „ich will hohe qualität“ | P68 |
| B36 | Prüfungsinhalte sehen wie in der Prüfung aus (Bilder kopiert, nicht nachgezeichnet). | 10.10. | „alle die in der prüfunk vorkommen müssen genau wie in der prüfung aussehen (nicht selbst gezeichnet, sondern kopiert)“ | P58 |

## 2. Offene Fragen

| Nr | Frage | Stand und Vorschläge |
|---|---|---|
| O1 | Welche Scheine bekommen eine Reihe, und in welcher Reihenfolge (SBF See, SBF Binnen, SKS)? | Am 19.10. nicht beantwortet. Vorschlag VS1: SBF See zuerst. B24 (Bayer beim Binnen am Chiemsee) setzt eine Binnen-Reihe voraus. |
| O2 | Wie viele Folgen, welche Gesamtdauer innerhalb von 4–40 h? | Nur Schätzungen (VS1). |
| O3 | Wie viel Geplauder neben dem Stoff? | Stufen in VS4, nicht beantwortet. |
| O4 | Was ist das große Rätsel? Ist das Finale die Prüfung bei Harms als Auflösung? | „Lütt Deern“ ist verworfen, ebenso die Vorschläge vom 20.10. Das Finale stand in der Beschreibung von C (VS25), ist aber nicht einzeln bestätigt. |
| O5 | Wie werden die Rollen geschärft? Wie oft irrt Hinnerk? | Der Nutzer will es „deutlich geschärft“. Vorschläge in VS3 und VS21. |
| O6 | Welches Erkennungszeichen hat Klabauter für „Wichtiges“? Gibt es ein Merkheft in der App? | Vorschlag: Schiffsglocke und „Krrah! Merken!“, höchstens acht Wörter, dazu ein Merkheft (VS3). In der gelobten Referenzszene verwendet, aber nicht einzeln bestätigt. |
| O7 | Spricht die Crew den Hörer an, und wie („Neuer“, „Moses“, „Badewannen-Kapitän“)? | Am 19.10. gefragt, nicht beantwortet. |
| O8 | Gibt es noch einen Schalter „nur zuhören“ oder „mit Fragen“? Kann man die Fragen am Ende überspringen, und was zählt dann? | Die Zwischenfragen samt Einstellung vom 19.10. sind durch B15 ersetzt. Ob die Wahl bleibt, ist offen. Vorschlag VS18: Übersprungene Fragen zählen als „noch nicht gehört“. |
| O9 | Heißt „alle“ in B15 alle in der Folge behandelten Katalogfragen? | So in P56 gedeutet, bitte bestätigen. |
| O10 | Zählen die Fragen am Ende in die 25 Minuten? | Offen. |
| O11 | Wie viel Abweichung von 25 Minuten ist erlaubt? | Offen. |
| O12 | Wie wird die Praxis behandelt? Ist V24 eine eigene Folge oder auf mehrere verteilt? Gehört die Navigationsaufgabe des SBF See zu „alle Prüfungsfragen“? Wie weit ersetzt der Podcast den Kurs bei der Praxis? | Vorschlag VS8: Knoten, Manöver und Navigation im Podcast erklären, üben im Knotenbrett, Manöverspiel und in der Navigationsschule. |
| O13 | Welche Rolle hat Harms im Podcast? | Vorschlag VS3: in den Prüfungsfolgen am Ende. VS25: das Finale. |
| O14 | Welche Gastfiguren, welche Namen, wie viele neue Stimmen? Kommt der Bayer auch beim SBF See vor? Wie stark ist sein Dialekt? | Begrüßte Beispiele: Hafenmeister, Funkstimme, Fischer. Weiteres offen. |
| O15 | Wie werden Szenen hörbar? Nur Dialog mit Geräuschen, oder ein Erzähler? Gibt es Musik, Jingle oder Hintergrundgeräusche? | Die Beispielszenen nutzen Regieanweisungen (Geräusche, „Musik“). Beschlossen ist nichts. |
| O16 | Gibt es Regeln für Einleitung, Übergänge, Kapitel und Schluss außer Hinweis und Cliffhanger? | Vorschläge VS2, VS5, VS20. |
| O17 | Wie lautet der Hinweis in „Über die App“ (heute: „ersetzt keine Ausbildung“)? | Antwort vom 20.10.: „13. denk drüber nach.“ Formulierungen in VS9. |
| O18 | Was wird aus den KI-Knöpfen „Eigene Folge erzeugen“ und „Weiterreden“ und aus „Fragen dazu üben“ im Kajütenfunk? | Nicht besprochen. Am 05.10. hieß es, KI-Folgen müssen gespeichert werden (umgesetzt). |
| O19 | Zeigt die App während der Folge Bilder, etwa Lichter und Tonnen? | Vorschlag VS7. |
| O20 | Wie hängt der Podcast mit „Kurs für heute“ und dem Lernplan zusammen? | Vorschlag VS18. |
| O21 | Wo liegen die Audiodateien? Wie laufen alle Folgen offline (B31) bei mehreren hundert MB? Werden Folgen einzeln geladen? | Vorschlag VS12. Siehe W11. |
| O22 | Welches Abo, wie viele Credits im Monat? Einzelsätze mit dem bisherigen Modell oder ganze Dialoge mit einem neueren Modell? Welche Bitrate? | Am 19.10. gefragt, Antwort nur B16. Vorschläge VS11 und VS12. |
| O23 | Was ist mit „ich will auch.“ (20.10. b, direkt nach „der kapitän erzählt auch von meerjungfrauen etc.“) gemeint? | Unklar. Vielleicht: Der Nutzer will selbst Ideen oder Witze beisteuern, oder er will mehr solche Witze. Bitte klären. |
| O24 | Dürfen gute alte Kurzgeschichten als Hinnerks Garn wiederverwendet werden? | Am 19.10. gefragt. Die Antwort „ja wird alles völlig neu“ spricht eher dagegen. Bitte bestätigen. |
| O25 | Kommt die erfundene Übungskarte der App (Kliev-Mündung) neben den echten Orten vor? | Am 19.10. vorgeschlagen: echte Orte nur im Garn, Aufgaben im erfundenen Revier. Der Nutzer antwortete „dann echte orte“ (B14). Der Umgang mit der Karte ist offen. |
| O26 | Wie entsteht für SKS Multiple Choice, wenn die SKS-Katalogfragen offen gestellt sind? | `data/sks-mc.json` (aus dem Törn) gibt es bereits. Nicht besprochen. |
| O27 | Teilen sich SBF See und Binnen die Folgen zu den 72 Basisfragen? | Vorschlag vom 19.10. (VS1), nicht beantwortet. |
| O28 | Wie werden Hinnerks Irrtümer gebaut? Darf er falsche Katalogantworten aussprechen? Gilt bei Sicherheitsthemen nur offensichtlicher Unsinn? | Vorschlag VS6, nicht beantwortet. |
| O29 | Stimmen die abgeleiteten Kriterien und Deutungen der Bible mit dem Gemeinten überein? | Bitte prüfen: P14, P17, P18, P22, P23, P32, P34, P35, P43, P56, P58, P59, P62, X1, X8, X9, X10. Dazu: P27/P36 übernehmen die Beschreibung von C wörtlich (Hinweis und Cliffhanger in jeder Folge), P52 deutet „ja genau“ als Zustimmung zu den derben Einzelheiten. |
| O30 | Wo liegen die Skripte, in welchem Format, und wie gibt der Nutzer sie frei (lesen, Handystimme, Stichprobe)? | Vorschlag VS14. |

## 3. Widersprüchliche Aussagen

| Nr | Widerspruch | Stand |
|---|---|---|
| W1 | CLAUDE.md §3 „Keine sexuellen Anspielungen“ und V3 „Anzüglichkeiten raus“ gegen B19 (doppeldeutige sexuelle Anspielungen). | **Für den Podcast gelöst:** B19 ist später und ausdrücklich. CLAUDE.md §3 hat einen Verweis bekommen. **Offen:** Gilt das auch für den Rest der App? Bisher nicht. |
| W2 | CLAUDE.md §3 beschreibt Hinnerk als „trocken, kurz angebunden“, B5 sagt „erzählt viel Kauderwelsch“. | Offen. Vorschlag vom 19.10.: trocken im Ton, beim Erzählen redselig. Gehört zu O5. |
| W3 | „viel Kauderwelsch“ (19.10.) gegen „der kaptn irrt nicht immer“ (20.10.). | Gelöst durch die spätere Aussage: Er irrt oft, aber nicht immer. Wie oft, ist offen (O5). |
| W4 | Zwischenfragen mit Einstellung (19.10.) gegen Fragen erst am Ende (20.10.). | Gelöst durch die spätere Aussage (B15). Der Schalter ist offen (O8). |
| W5 | „unabhängig der prüfung“ (B4) gegen eine Podcastfolge zur praktischen Prüfung (B33) und ein mögliches Prüfungsfinale mit Harms (VS25). | Offen. Wie dürfen Prüfung und Prüfer in der Geschichte vorkommen? |
| W6 | CLAUDE.md E10, V8 und §4 „Teil 2“ (Nutzer überarbeitet die alten Folgen, danach Stimmen) gegen B17 (alles völlig neu). | Gelöst durch B17. CLAUDE.md verweist jetzt auf die Bible. |
| W7 | CLAUDE.md §1 (in etwa zwei Wochen bereit zur Veröffentlichung) gegen B18 (verschoben). | Gelöst. CLAUDE.md §1 hat einen Vermerk bekommen. Ein neuer Termin ist offen. |
| W8 | Bayer als Witzfigur (B24) gegen CLAUDE.md §3 „keine Beleidigungen von Gruppen“. | Offen. Zum Beispiel: Wird die Figur aufgezogen und nicht „die Bayern“? Nicht besprochen. |
| W9 | CLAUDE.md R10 (neue feste Sätze in `docs/feste-saetze.md` eintragen) gegen die Menge an Podcasttext (Tausende Zeilen). | Offen. Naheliegend wäre: Die Skripte selbst sind die Liste. Nicht beschlossen. |
| W10 | CLAUDE.md R3 (kleine Unklarheiten entscheidet Claude selbst) gegen den Auftrag vom 20.10. (offene Fragen nicht eigenmächtig entscheiden). | Offen. Bis zur Klärung entscheidet Claude beim Podcast keine Punkte aus Abschnitt 2 selbst. Handwerkliche Entscheidungen innerhalb eines Skripts (Wortwahl, Szenendetails) fallen darunter nur, wenn sie keine Regel und keine offene Frage berühren. |
| W11 | Alle Folgen offline (B31) gegen die Datenmenge (geschätzt 130–260 MB für 9 Stunden). | Offen (O21). |
| W12 | `docs/konzept-architektur.md` §1.6 sagt „Ton … ab 14“, CLAUDE.md E1 sagt „ab 12“. | E1 ist später und gilt. Das Konzeptdokument ist nicht geändert. |
| W13 | CLAUDE.md E5 stand auf „offen“, B16 erlaubt den Schlüssel für den Podcast. | Für den Podcast gelöst. CLAUDE.md E5 hat einen Vermerk bekommen. |
| W14 | CLAUDE.md „Nach der Veröffentlichung: Folgen für SKS und Binnen“ gegen B24 (Binnen am Chiemsee) und die verschobene Veröffentlichung. | Die Reihenfolge ist offen (O1). |
| W15 | Die gelobte Referenzszene (B25) verwendet den verworfenen Namen „Lütt Deern“ (B22). | In Anhang A der Bible vermerkt. |
| W16 | CLAUDE.md §4 nennt „Teil 2 rund 56.000 Zeichen“, gemessen sind heute 37.191 Zeichen (27.862 in Folgen und 9.329 in Kurzgeschichten, ohne eingesetzte Katalogantworten). | Durch B17 ohne Bedeutung, nur zur Information. |

## 4. Fehlende Informationen

| Nr | Was fehlt | Wer |
|---|---|---|
| F1 | Größe des ElevenLabs-Abos (Credits im Monat) | Nutzer |
| F2 | Secret `ELEVENLABS_API_KEY` und Freigabe von `api.elevenlabs.io` in der Cloud-Umgebung. Erst nötig, wenn die Folgen ausgereift sind (B16). | Nutzer |
| F3 | Richtlinie zur praktischen Prüfung. Sie liegt nur als Upload dieser Cloud-Sitzung vor (`SpFV_richtlinien_praktische_prüfung.pdf`, hochgeladen am 10.10.), nicht im Repo und nicht in `quellen/`. In einer neuen Sitzung erneut hochladen oder lokal in `quellen/` legen. | Nutzer |
| F4 | Die Originalkataloge in `quellen/` fehlen in der Cloud. Prüfungen gegen die App-Daten werden markiert (R8). | – |
| F5 | Ob die Stimmen plattdeutsch oder bairisch gefärbten Text überzeugend sprechen, ist ungeprüft. | Test (P64) |
| F6 | Am 20.10. von Claude erbeten, noch nicht beantwortet: eigene Anekdoten, Hörspiele oder Podcasts, deren Ton dem Nutzer gefällt, das Heimatrevier. | Nutzer, freiwillig |
| F7 | Wie sich doppeldeutige Anspielungen auf die Altersfreigabe im Store auswirken (Fragebogen der Anbieter) | später beim Store-Eintrag |
| F8 | Lizenzbedingungen der zusätzlichen Gaststimmen (L4) | bei der Stimmenwahl |

## 5. Vorschläge, die noch nicht bestätigt wurden

Alle hier aufgeführten Vorschläge stammen von Claude. Sie gelten nicht als Regel.

| Nr | Vorschlag | Datum | Stand |
|---|---|---|---|
| VS1 | **Umfangsschätzung:** etwa 1 Minute pro Frage im Gespräch. SBF See 9–10 h mit etwa 23 Folgen, Binnen-Zusatz etwa 10 Folgen (4–5 h), SKS etwa 15 h, zusammen etwa 30 h. SBF See zuerst, die Basis-Folgen gelten auch für Binnen. | 19.10. | Unbeantwortet. Der dazugehörige Themenplan ist verworfen (Abschnitt 6). |
| VS2 | 4–5 Kapitel pro Folge, damit man unterbrechen kann. | 19.10. | Unbeantwortet |
| VS3 | **Figurendetails** (siehe Liste unter der Tabelle) | 19.10. | Grundsätzlich gut befunden („Rollenverteilung ist auch gut“), Details unbestätigt, Schärfung gewünscht |
| VS4 | **Geplauder-Stufen:** kompakt etwa 15 % (rund 7 h), ausgewogen etwa 30 % (rund 9 h, damals empfohlen), gemütlich etwa 45 % (rund 12 h). Auch Geplauder soll möglichst etwas zeigen. Reines Geplauder höchstens 1–2 Minuten pro Kapitel. | 19.10. | Unbeantwortet |
| VS5 | **Aufeinander aufbauen:** Am Anfang eine Minute „Was war letztes Mal“, in der Klabauter die Merksätze aufsagt. Wichtiges kommt später noch zweimal kurz vor. Am Ende ein Ausblick. | 19.10. | Unbeantwortet |
| VS6 | **Irrtümer:** Hinnerk spricht typische falsche Katalogantworten aus („Hinnerk-Trick“). Smilla korrigiert sofort, das Richtige kommt zuletzt, die Glocke gibt es nur beim Richtigen. Bei Notfällen und Sicherheit (Notsignale, Mensch über Bord, Alkohol) nur offensichtlicher Unsinn. | 19.10. | Unbeantwortet |
| VS7 | Die App zeigt das passende Katalogbild, während darüber gesprochen wird. Die Crew beschreibt es trotzdem so, dass es ohne Bildschirm verständlich ist. | 19.10. | Unbeantwortet |
| VS8 | Navigation, Knoten und Manöver: Begriffe, Merkhilfen und worauf der Prüfer achtet, im Podcast. Geübt wird in Navigationsschule, Knotenbrett und Manöverspiel. Nach der Folge zeigt die App „Passend dazu“. | 19.10. | Unbeantwortet |
| VS9 | Hinweis in „Über die App“: „ersetzt keine praktische Ausbildung auf dem Wasser“ (19.10.) oder „bereitet die Theorie vollständig vor; die Praxis braucht Wasser“ (20.10. a). | 19./20.10. | Nutzer: „denk drüber nach“ (O17) |
| VS10 | Ein Prüfwerkzeug stellt sicher, dass alle Fragen vorkommen. Jede Stelle im Skript trägt die Nummern der Fragen, die sie behandelt. | 19.10., 20.10. a | Unbeantwortet. Die Zuordnung selbst ist über P17 Pflicht. |
| VS11 | **Kosten und Klang:** Für SBF See etwa 500.000 Zeichen plus 15 % Nachbesserungen. Erzeugung über Weg E5 a. Ein neueres ElevenLabs-Modell kann ganze Dialoge mit Lachen und Ins-Wort-Fallen erzeugen; beide Techniken werden in einer Probe verglichen. | 19.10. | Teilweise überholt durch B16. Die Technikwahl ist offen (O22). |
| VS12 | **Speicher:** In der Qualität des Stimmenpakets (64 kbit/s) wären 9 Stunden etwa 260 MB, für Sprache reicht etwa die Hälfte. Folgen einzeln laden oder „offline speichern“. GitHub Pages erlaubt etwa 1 GB pro Seite und etwa 100 GB Datenverkehr im Monat. Später eigener Speicher (Supabase, E9). | 19.10. | Unbeantwortet (O21) |
| VS13 | **Abspieler:** Pause, 15 Sekunden zurück, Tempo bis 1,5×, Kapitel, Weiterhören, Steuerung vom Sperrbildschirm und im Auto, Text zum Mitlesen. „Kurs für heute“ schlägt die nächste Folge vor. | 19.10. | Unbeantwortet |
| VS14 | **Vorgehen:** Zuerst Serienbibel und Stoffplan, dann eine Probe von Folge 1, danach 3–4 Folgen pro Lauf. Jede Folge vorab kostenlos mit der Handystimme hören oder lesen, bevor Credits ausgegeben werden. | 19.10. | Teilweise überholt durch B16 (Test nur mit einem Teil einer Folge) |
| VS15 | App mit der ersten Folge veröffentlichen, den Rest nachliefern. | 19.10. | Überholt durch B18 (Veröffentlichung verschoben) |
| VS16 | Mechanik der Zwischenfragen (nach jedem Kapitel 1–2 Fragen, nach 20 Sekunden ohne Antwort löst Hinnerk auf) | 19.10. | Überholt durch B15 |
| VS17 | **Geschichte mit Gerüst:** Grundlagen kommen vor dem, was darauf aufbaut (etwa „Maschinenfahrzeug“ vor den Ausweichregeln). Eine Übersicht in der App, wo welches Thema vorkommt („Lichter: Folge 6, Kapitel 2“), und welche Fragen man schon gehört hat. | 20.10. a | Unbeantwortet |
| VS18 | „Der Podcast führt, die App folgt“: Gerade gehörte Fragen schlägt „Kurs für heute“ zuerst zum Festigen vor. Die Fragen am Ende heißen „die Beweisaufnahme“. Übersprungene Folgen zählen als „noch nicht gehört“, nicht als falsch. | 20.10. a | Unbeantwortet |
| VS19 | **Variante D „Das Seeamt“:** Harms verhört Hinnerk und Smilla nach einem Unfall, jede Folge ist eine Rückblende. Staffelfrage: Wer war schuld? | 20.10. a | Vom Nutzer nicht kommentiert, nicht gewählt |
| VS20 | **Spannungswerkzeuge:** Kaltstart in den ersten zwei Minuten, eine laufende Uhr (Nebel, Flut, Fähre), Fair Play, falsche Fährte, Klabauter als Zufallstreffer (sein Nachgeplapper ist manchmal der Lösungshinweis), Ruhepunkt nach der Spannung, Rückgriffe auf frühere Hinweise, Cliffhanger. | 20.10. a | Unbeantwortet. Cliffhanger und Hinweis sind über C beschlossen (P36). |
| VS21 | **Rollen schärfer:** Hinnerk ist „der Bauch“ und kennt das Meer, nicht den Paragrafen. Sein Bluff ist erkennbar („Früher …“, erfundene Wörter). In Praxis und Sicherheit hat er immer recht, er irrt nur bei gefühlten Regeln. Smilla ist „der Kopf“ und die Ermittlerin; sie ordnet Hinweise und nennt Regel und Warum, ihre Schwäche ist die Praxis. Klabauter ist Gedächtnis und Wildcard. | 20.10. a | Unbeantwortet (O5) |
| VS22 | **Unterlagen:** Für die Theorie braucht es keine, für die Praxis die Richtlinie. Freiwillig: Anekdoten, Lieblingshörspiele, Heimatrevier. | 20.10. a | Unbeantwortet (F3, F6) |
| VS23 | Hinweis: Doppeldeutige Anspielungen müssen beim Store-Eintrag ehrlich angegeben werden. Bei milder Form bleibt es voraussichtlich bei „ab 12“. | 20.10. a | Hinweis, siehe F7 |
| VS24 | **Beispielszene „Nebel“** (Text unten) | 19.10. | Vom Nutzer nicht ausdrücklich bewertet |
| VS25 | **Staffelfinale:** Die Prüfung mit Harms ist zugleich die Auflösung des großen Rätsels. | 20.10. a | Gehörte zur Beschreibung von C, nicht einzeln bestätigt (O4, W5) |
| VS26 | **Probe:** Die erste Szene (Kaltstart und erster Akt, etwa 4 Minuten) wird ausformuliert und mit der kostenlosen Handystimme angehört. | 20.10. a | Unbeantwortet. B16 regelt nur den ElevenLabs-Test. |

**VS3 im Einzelnen (Figurenvorschlag vom 19.10.):**
- **Hinnerk („kennt das Meer“):**
  - trocken im Ton, beim Erzählen Seemannsgarn,
  - sein Kauderwelsch nach Mustern: maßlos übertriebenes Garn, gefühlte Regeln (= typische falsche Katalogantworten), eigene Wörter („das rote Dingens“, „Tüdelkram“), Aberglaube (nicht pfeifen, keine Bananen, freitags nicht auslaufen),
  - bei der Praxis hat er recht,
  - etwa ein Irrtum alle 3–5 Minuten, Redeanteil etwa 35 %.
- **Smilla („weiß es genau“):**
  - frech, korrigiert mit Witz und nicht von oben herab,
  - ihre Korrektur ist die amtliche Antwort in Alltagssprache plus ein kurzes Warum,
  - Schwächen: wenig Praxis, ungeduldig, bei Seegang grün im Gesicht,
  - Redeanteil etwa 45 %.
- **Klabauter:**
  - Modus „Merken“: Schiffsglocke (Geräusch aus der App) plus „Krrah! Merken!“ plus Kern in höchstens acht Wörtern, nur Richtiges, jeder Merksatz landet im „Merkheft“ der App,
  - Modus „Quatsch“: ohne Glocke, verhört sich, bettelt um Kekse, ärgert die Katze,
  - 6–10 Merksätze und 4–6 Witze pro Folge, Redeanteil etwa 15 %.
- **Weitere Figuren und Hörer:**
  - Backbord: nur Geräusche.
  - Harms: in den Prüfungsfolgen am Ende.
  - Der Hörer ist „der Neue an Bord“: Beim Zuhören reden die drei miteinander, bei Zwischenfragen wenden sie sich an ihn (durch B15 überholt).
- **Durchgehende kleine Geschichte:** Beispiel: Smilla lernt heimlich für ihren Skipperschein, Hinnerk sucht seine Lieblingsmütze, die Katze hat sie.

**VS24 Beispielszene „Nebel“ (19.10., Fragen `sbf:4`, `sbf:5`, `sbf:120`), unbewertet:**

> *(Nebel. Irgendwo tutet ein Frachter.)*
> **Hinnerk:** Hörst du das? Der Frachter tutet, weil er Hunger hat.
> **Smilla:** Der tutet, weil Nebel ist, Käpt'n.
> **Hinnerk:** Sag ich doch. Im Nebel kriegt jeder Hunger. Wir tuten jetzt auch: lang, lang, kurz. Weiß jedes Kind.
> **Smilla:** Lang, lang, kurz heißt was ganz anderes, das kommt beim Überholen. Wir segeln und sind über zwölf Meter lang. Also lang, kurz, kurz. Mindestens alle zwei Minuten.
> **Klabauter:** *(Glocke)* Krrah! Merken! Segler im Nebel: lang, kurz, kurz! Alle zwei Minuten!
> **Hinnerk:** Klookschieter. Und wie lang ist lang? So lang, wie ich die Luft anhalten kann?
> **Smilla:** Dann wär's ein Dauerton. Ein langer Ton dauert vier bis sechs Sekunden, ein kurzer etwa eine.
> **Klabauter:** *(Glocke)* Krrah! Kurz: eine Sekunde. Lang: vier bis sechs!
> **Hinnerk:** Dreiundachtzig vor Helgoland hab ich mal einen langen Ton gegeben, der ging zwanzig Minuten. Die Möwen da sind heute noch taub.
> **Klabauter:** Taube Möwen! Taube Möwen!
> **Smilla:** Und danach hat der Hafenmeister dir das Horn weggenommen.
> *(Miau. Es poltert.)*
> **Hinnerk:** Backbord! Runter vom Signalhorn!
> *(Nur mit Zwischenfragen:)* **Smilla:** Na, Neuer? Welches Signal gibt ein Segler ab zwölf Meter im Nebel? *(Frage 120 erscheint auf dem Bildschirm.)*

**Prüfhinweise zu VS24:**
- Die Zwischenfrage am Ende ist durch B15 überholt.
- „Lang, lang, kurz … das kommt beim Überholen“ ist durch den SBF-See-Katalog nicht gedeckt, er enthält dieses Signal nicht als richtige Antwort. Vor einer Verwendung gegen die Vorschriften prüfen oder streichen (R8).

## 6. Verworfen oder überholt

Diese Punkte nicht ohne neue Zustimmung des Nutzers wieder aufgreifen.

- **Themenreihe** (19.10.): Folgen nach Katalogthemen in Reihenfolge, mit einer Tabelle von 23 Folgen in Abschnitten von „Leinen los“ bis „Harms kommt an Bord“. Verworfen zugunsten der Geschichte (B11).
- **Zwischenfragen während der Folge** und die Einstellung „einfach reden oder Zwischenfragen“ (Nutzer, 19.10.) samt Mechanik (VS16). Ersetzt durch die Fragen am Ende (B15). Ob die Wahl in anderer Form bleibt, ist offen (O8).
- **Großes Rätsel „Lütt Deern“** (Hinnerks vor Jahren verschwundenes Boot, 20.10. a). „muss ein besseres sein“ (B22).
- **Alle Vorschläge aus Claudes Nachricht vom 20.10. nach der A/B/C-Bewertung**, also das konkrete große Rätsel, der Staffelplan, die Folgentitel, die Verdächtigen, die Gastnamen, die Galionsfigur und das Story-Karten-Beispiel. Vom Nutzer verworfen (B28), deshalb hier nicht wiedergegeben.
- **Die alten Folgen und Kurzgeschichten** in `data/folgen.json`. Werden ersetzt (B17).
- **E10** (der Nutzer überarbeitet die alten Folgen selbst) und **V8** in der alten Form (Stimmen Teil 2 nach dieser Überarbeitung). Ersetzt durch B16 und B17.
- **Veröffentlichung mit der ersten Folge** (VS15). Überholt durch B18.

## 7. Ausgangslage im Code (unverändert, nur zur Information)

- **`data/folgen.json`:**
  - `episodes.sbf` hat 25 Folgen (`sbf-01` bis `sbf-25`) mit 27.862 Zeichen, nach Messung etwa 33 Minuten Sprechzeit.
  - Davon spricht Hinnerk 70 %, Smilla 26 % und Klabauter 4 %.
  - Zusammen decken sie 270 der 285 SBF-Fragen ab, die Basisfragen 16–30 fehlen.
  - `episodes.sks` ist leer, Binnen-Folgen gibt es nicht.
  - `shorts` sind 20 Kurzgeschichten (`s-01` usw.) mit 9.329 Zeichen, etwa 11 Minuten.
  - Aufbau einer Zeile: `{s: 'K'|'M'|'T', t}`, Stopp-Fragen als `{s: 'Q', n}`, Platzhalter `{A:n}` und `{Q:n}` (`epFill`).
- **`index.html`:**
  - `renderFunk` ist der Bildschirm „Kajütenfunk“, dazu `playEpisode`, `playShort` und `showStory`.
  - `showStory` liest Zeile für Zeile über `VOX.lines` vor. Stopp-Fragen (`askStop`) speichern das Ergebnis über `record`/`recordQ`.
  - Weitere Bausteine: Hörstand in `S.heard[id]`, Stimmwahl `S.cfg.funkVoice` ('phone' oder 'eleven'), „Fragen dazu üben“, KI-Knöpfe „Weiterreden“ und „Eigene Folge erzeugen“ (`makeStory`, `S.stories`).
- **Stimmenpaket `audio/stimmen/`:**
  - 359 Sätze, 18 MB, MP3 mit 64 kbit/s, mono, 44,1 kHz.
  - Stimmen für hinnerk, smilla, klabauter und kroeger in `manifest.json`.
- **Messwerte (für P14):**
  - Sprechtempo 13,9 Zeichen pro Sekunde (Hinnerk 13,6, Smilla 15,5, Klabauter 10,6, Harms 13,6).
  - 6,2 Zeichen pro Wort, etwa 134 Wörter pro Minute.
  - 25 Minuten entsprechen etwa 20.900 Zeichen oder 3.350 Wörtern.

## 8. Änderungsprotokoll

| Datum | Änderung |
|---|---|
| 20.10.2026 | Bible und Status erstmals angelegt aus dem Podcast-Gespräch vom 19.–20.10.2026, früheren Aussagen des Nutzers (05.–10.10.) und den Projektdateien. Die Vorschläge aus Claudes Nachricht vom 20.10. nach der A/B/C-Bewertung wurden auf Wunsch des Nutzers weggelassen. App-Code ist nicht geändert. |
