# PODCAST_STATUS.md – Stand der Entscheidungen zum Kajütenfunk

> Begleitdatei zu **`PODCAST_BIBLE.md`**. Hier steht, was beschlossen, offen, widersprüchlich, fehlend oder nur vorgeschlagen ist. Stand: 20.10.2026, zwölfte Fassung.
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
- **Antworten des Nutzers auf die offenen Punkte (20.10. d)** und sein **Audio-Regelwerk „Sprechregie, Aussprache und Audioproduktion“ (AR)**. Das AR wurde kritisch geprüft und angepasst übernommen (Abschnitt 9).
- **Websuche am 20.10.2026** zu ElevenLabs: Eleven v4, Text-to-Dialogue-API und ihre Parameter. Die Seiten von elevenlabs.io sind aus der Cloud nicht direkt abrufbar (Adresse wird nicht aufgelöst). Die Angaben stammen deshalb aus Suchergebnissen mit Verweisen auf die offizielle Doku. Vor der Produktion erneut prüfen (F9).

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
| B33 | ~~Es gibt eine Podcastfolge zur praktischen Prüfung (V24).~~ **Aufgehoben durch B40.** | 10.10. | „es soll eine podcast-folge zur praktischen prüfung geben“ | P20 (entfällt) |
| B34 | Die Freigabe ist ab 12 (E1), der Ton jugendfrei, derb und hart (aufgelockert für den Podcast durch B19). | 09.10. | „kein fsk 18, alles jugendfrei. aber derb und hart.“ – „39. soll ab 12 sein.“ | P11 |
| B35 | Hohe Stimmqualität (E6). | 09.10. | „ich will hohe qualität“ | P68 |
| B36 | Prüfungsinhalte sehen wie in der Prüfung aus (Bilder kopiert, nicht nachgezeichnet). | 10.10. | „alle die in der prüfunk vorkommen müssen genau wie in der prüfung aussehen (nicht selbst gezeichnet, sondern kopiert)“ | P58 |
| B37 | Zuerst SBF See, danach Binnen als Zusatz, ca. 12–25 Folgen. | 20.10. d | „SBF see und dann noch zusatz: binnen. ca. 12-25 folgen.“ | P15, P16 |
| B38 | Die Crew spricht den Hörer neckend an, z. B. „hey Matrose“, „hey du“. Der Nutzer bittet um weitere Ideen. | 20.10. d | „crew spricht mich so an: hey martrose, hey du, was fällt dir noch ein, etwas neckend?“ | P48 |
| B39 | Die Fragen am Ende lassen sich überspringen, man geht gleich zur nächsten Folge. Der Schalter „nur zuhören“ bleibt. | 20.10. d | „ja man kann die fragen am ende überspringen und gleich zur nächsten folge gehen. ja der nur zuhören schalter bleibt.“ | P55 |
| B40 | V24 (eigene Folge zur praktischen Prüfung) entfällt. | 20.10. d | „V24 kommt weg.“ | P20 |
| B41 | Keine Witze über Bayern, sondern ein witziger Bayer. | 20.10. d | „keine bayern witze. ein witziger bayer.“ | P47, X4 |
| B42 | Das große Überthema denkt sich der Nutzer selbst aus, es bleibt ein offener Punkt. | 20.10. d | „großes rätsel: also großes überthema denke ich mir noch etwas aus. las das noch als offenen punkt.“ | P30, O4 |
| B43 | Das Audio-Regelwerk kritisch prüfen, nur Sinnvolles sinnvoll übernehmen. | 20.10. d | „schau dir das kritisch an, und übernehme nur das, was du als sinvoll erachtest. implementiere es sinvoll in die datei.“ | Bible §14, Status §9 |
| B44 | Anreden müssen geschlechtsneutral sein. „Matrose“ ist nicht neutral genug, „Moses“ entfällt. | 20.10. e | „stimmt matrose ist nicht neutral genug. gitb es gute genderneutrale anreden die necken?“ – „moses würde ich weglassen“ | P48 |
| B45 | Ein eigenes Ausspracheverzeichnis `pronunciation_dictionary.md`, nicht in der langen Regeldatei versteckt. | 20.10. e | „Ein eigenes pronunciation_dictionary.md mit allen geprüften nautischen Begriffen, Abkürzungen und Namen.“ | A17, A18 |
| B46 | Eine maschinenlesbare Konfiguration für Modell-ID, Voice-IDs, Wörterbuchversion und Chunking. | 20.10. e | „Dadurch vermeidest du, dass Claude bei jeder Folge andere Annahmen trifft.“ | A8 |
| B47 | Eine automatische Prüfung vor jeder Generierung: unbekannte Regiecodes, fehlende Voice-IDs, nicht freigegebene Aussprache. | 20.10. e | „Ein automatisierter Validierungsschritt vor jeder Generierung …“ | A32 |
| B48 | Zuerst nur eine kurze Testszene mit allen drei Figuren und schwierigen nautischen Begriffen. Wenn das funktioniert, dieselbe geprüfte Verarbeitung auf alle Folgen anwenden. | 20.10. e | „Lass Claude Opus zunächst nur eine kurze Testszene mit allen drei Figuren und einigen schwierigen nautischen Begriffen erzeugen.“ | A27 |
| B49 | Die Zahl der Folgen ergibt sich erst aus dem Aufbau der Geschichte. | 20.10. e | „die anzahl der folgen wird erst klar, wenn wir wissen wie die geschichte etc. aufgebaut ist.“ | P15 |
| B50 | Als Nächstes ein grober Leitfaden der Geschichte, zuerst nur SBF See. Binnen kommt eigens. | 20.10. e | „wir brauchen als nächstes einen groben leitfaden der Geschichte. erstmal nur SBF See, SBF Binnen kommt dann extra.“ | P16, VS30 |
| B52 | Der Leitfaden (VS30) ist im Grunde gut. Das Wort „Schlei“ gefällt dem Nutzer nicht. | 20.10. f | „1. im grunde gut, nur der begriff schlei finde ich nicht gut.“ | Leitfaden, O34 |
| B53 | Die Route darf dem verworfenen Plan ähneln (Ostsee, Kanal, Elbe, Helgoland, Watt). | 20.10. f | „verworfener plan route: ja so machen.“ | Leitfaden |
| B54 | Die neutralen Anreden aus VS27 sind alle angenommen. Klabauter bekommt zwei weitere. | 20.10. f | „2. alle gut. klabauter soll auch noch 2 weitere bekommen für die abwechslung.“ | P48, VS31 |
| B55 | Das Audio der Anreden wird einmal erzeugt und auch bei anderen Gelegenheiten in der App verwendet. | 20.10. f | „das audio für diese wird einmal erzeugt und dann auch bei anderen interkationen in der app verwendet.“ | P48, `docs/feste-saetze.md` |
| B56 | Der Bayer kommt schon bei SBF See vor. Er braucht einen besseren Namen, macht sich über sich selbst lustig und nimmt sich nicht so ernst. | 20.10. f | „4. soll hier schon vorkommen. braucht noch einen besseren namen. sollte sich über sich selbst lustig machen und sich nicht so ernst nehmen.“ | P47, O36 |
| B57 | Harms erklärt (ggf.) ganz am Anfang, wie er am Ende prüft und was man wissen muss. Sonst trifft man ihn, wenn es passt. Der Nutzer lädt dazu die Prüfungsordnung hoch. | 20.10. f | „5. ggf erklärt er ganz am anfang wie er am ende prüft, was man wissen muss etc. dazu lade ich noch die prüfungsordnung hoch, damit das genau passt. sonst trifft man ihn auch mal wenn es passt.“ | P45, X9, F3 |
| B58 | Die ElevenLabs-Seiten „Eleven v4“ und „Best practices“ dienen als Lernquelle für die spätere Skriptarbeit. | 20.10. f | „hier noch originalinfos von elevenlabs zum davon lernen für später zum perfekten skript erstellen“ | §14.13 |
| B59 | Überthema ist „Die Wette“ (VS35 Nr. 1): Harms wettet mit Hinnerk, dass er keine Saison ohne Regelverstoß schafft. | 20.10. g | „wir nehmen version 1.“ / „überthema 1“ | P30, O4 |
| B60 | Für Klabauter wird eine andere Nebengeschichte gesucht (nicht VS35 Nr. 2). | 20.10. g | „für klabauter überlegen wir nach einer anderen side-story.“ | O37 | ~~Welche Nebengeschichte bekommt Klabauter?~~ | **Erledigt durch B80:** die Petze (der Spion) und die Möwe „Pommes“. |
| B61 | Der Bayer heißt **Quirin**. Prinzip Grummel trifft Sonnenschein. Er kann schon segeln, aber nur auf dem Chiemsee und kleineren Seen; auf dem Meer wird er seekrank. Er nennt Hinnerk „Hinni“, das mag Hinnerk gar nicht. | 20.10. g | „der bayer ist quirin, das sonnenschein/grumpel prinzip finde ich gut … der bayer kann aber schon segeln. aber eben nur am chiemsee … am meer wird er seekrank... er nennt ihn hinni, finde ich super. hinnerik mag das garnicht.“ | P47, O36 |
| B62 | Smilla hat SBF See und SBF Binnen schon. So gibt es keinen Logikfehler, wenn sie Schiffsführerin wird. | 20.10. g | „oder hat smilla einfach schon den sbf binnen und see? ich denke schon. dann gibt es auch keinen logikfehler.“ | P42 |
| B63 | Heimathafen ist **Flensburg**. | 20.10. g | „flensburg ist gut.“ / „heimat flensburg“ | P33, O34 |
| B64 | Die Bootsnamen aus VS33 passen nicht. Gesucht ist ein Name, den der Käpt'n selbst ausgesucht hätte. | 20.10. g | „bootsnamen bitte nochmal überlegen. eher etwas, was der kapitän ausgesucht hätte.“ | O35, VS37 |
| B65 | Der Vorschlag zum Bayern (VS34: Bergführer, Einsatz ab Kieler Woche, Garn-Duell) ist angenommen, mit den Änderungen aus B61. | 20.10. g | „4. ja“ | P47 |
| B66 | Das Staffelfinale ist **keine** Prüfung. Die Prüfung ist die des Nutzers: Nach allen Folgen lernt man am Boot weiter und ruft Harms zur Probeprüfung, wenn man bereit ist. | 20.10. g | „5. nein das ist dann meine prüfung (die nutzerprüfung) man kann aber nach dem langen ausflug (nach allen folgen) eben am boot noch weiter lernen. und wenn man bereit ist, ihn zur probeprüfung rufen.“ | P45, O13 |
| B67 | Die zwei weiteren Klabauter-Anreden „Nesthocker! Nesthocker!“ und „Federlos! Federlos!“ sind angenommen. | 20.10. g | „6. passt.“ | P48, `docs/feste-saetze.md` |
| B68 | Großschreibung zur Betonung wird im Test ausprobiert (VS36). | 20.10. g | „7. ja mit aufnehmen. wird dann alles getestet.“ | A24 |
| B69 | Als Nächstes wird ein kleiner Ausschnitt gesprochen (Hörprobe, A27). Die ElevenLabs-Anbindung über das Handy ist vorhanden. | 20.10. g | „brauchst du für einen stimmtest noch etwas? über das handy ist ja die api angebunden. gerne will ich als nächsten schritt einen kleinen ausschnitt sprechen lassen“ | P64, `podcast/skripte/test-01.md` |
| B70 | Die Hörprobe wird neu geschrieben und nutzt alle Regie-Mittel, nicht nur Großschreibung: Flüstern, Lachen, Rufen, Pausen, Tempo, Geräusch usw. | 20.10. h | „schreibe die 2 min hörprobe nochmal besser. nicht nur dick gedruckte worte, sondern auch flüstern etc. alles was es so gibt mit einbauen.“ | A14, `podcast/skripte/test-01.md` |
| B71 | Klabauters Nebengeschichte: Claude schlägt drei Varianten vor. | 20.10. h | „die sidestory von klabauter denkst du dir selber 3 gute varianten aus.“ | O37, VS38 |
| B72 | Beim Bootsnamen gefällt „Gesine“ schon ganz gut. Gewünscht sind weitere Vorschläge, eher Frauennamen, aber auch anderes. | 20.10. h | „gesine finde ich schon ganz gut, aber bitte auc hier noch mehr vorschläge. eher ein frauenname, aber ggf auch etwas anderes.“ | O35, VS37 |
| B73 | Eleven v4 ist viel besser als v3. Alles wird mit v4 gemacht. | 20.10. i | „Das funktioniert. V4 ist viel besser als v3. Wir machen alles mit V4.“ | A9, `podcast/audio_config.json` |
| B74 | Nächstes Ziel ist das perfekte Skript: mit Stimmlagen, Emotionen, Flüstern usw. ein hörspielähnliches Erlebnis. | 20.10. i | „Wir brauchen das perfekte Skript. Das ist das nächste Ziel. Mit den neuen stimmlagen/Emotionen/flüstern etc. Können wir das ganze wirklich toll aufbauen und ein hörspielähnliches Erlebnis generieren.“ | VS39 |
| VS40 | **Klabauters Nebengeschichte, fünf Varianten** (B79, ersetzt VS38):<br>1. **Die Petze:** Er plappert alles nach und gefährdet so die Wette.<br>2. **Der erste ganze Satz:** Er kann nur wiederholen und will bis zum Herbst einen eigenen ganzen Satz sagen. In jeder Folge scheitert ein Versuch. Im Finale sagt er vor Harms seinen ersten ganzen Satz, und der ist die Wahrheit: „Smilla hat uns gerettet.“<br>3. **Das Klabauter-Patent:** Er hält sich für den Schiffsgeist aus der Sage, warnt ständig falsch und im Sturm einmal richtig.<br>4. **Die Möwe:** Er verliebt sich in eine Möwe, Backbord ist eifersüchtig.<br>5. **Das Diebesnest:** Er klaut Glänzendes (Hinnerks Lesebrille, den Schlüssel, Harms' Kugelschreiber). Jede Folge verschwindet etwas, das Nest wird im Finale gefunden.<br>**Empfehlung:** 1 und 2 verbunden. | 20.10. j | Angenommen: 1 und 4 (B80) |
| VS41 | **Bootsname, fünf Vorschläge** (B79): Gesine (Hinnerks Mutter), Wiebke (Ex-Frau), Telse (Wirtin), Frieda (Frieden an Bord), Swantje (Schwan); außer der Reihe „Ole Liebe“. Empfehlung: Gesine. Einzelheiten in Claudes Nachricht vom 20.10. j. | 20.10. j | Erledigt: Frieda (B81) |
| VS42 | **Logbuch statt Erzähler** (B77): Smilla führt das Logbuch. Jede Folge beginnt mit dem letzten Eintrag als Rückblick (30–45 Sekunden) und endet mit einem neuen Eintrag aus drei Merksätzen. Das Logbuch ist zugleich der Schiedsrichter der Wette: Harms liest es im Herbst. Hinnerk will Einträge schönen, Smilla bleibt ehrlich. | 20.10. j | Angenommen (B85) |
| VS43 | **Fragerunde mit Spracheingabe, Technik** (B84). Ja, das geht:<br>• **Spracherkennung des Browsers** (Web Speech API, in Chrome auf Android vorhanden): kostet keine Credits, braucht aber Internet (Chrome schickt die Sprache an Google). Ohne Internet bleibt Tippen.<br>• **Problem Echo:** Liest die Stimme „Antwort B“ vor, kann das Handy-Mikro das selbst hören. Lösung: Während des Vorlesens zählen nur die Funkwörter **Alfa, Bravo, Charlie, Delta** (die die Stimme nie sagt); nach dem Vorlesen auch A, B, C, D und „eins“ bis „vier“. Mit Kopfhörern gibt es das Problem nicht.<br>• Bei manchen Android-Geräten piept das System beim Start der Erkennung. Das wird im Test geprüft.<br>• **Vorleser:** Harms, der Prüfer.<br>• **Kosten:** Alle 285 Fragen mit Antworten einmal sprechen sind etwa 127.000 Zeichen. Die Aufnahmen sind feste Sätze (einmal erzeugt) und können auch in der normalen Lernrunde der App genutzt werden.<br>• Antworten werden gemischt wie in der App, die Reihenfolge der Vorlesung passt sich an (vorgelesene Teile einzeln aufnehmen). | 20.10. k | Teilweise angenommen: Harms liest (B94). Offen: Funkwörter Alfa bis Delta während des Vorlesens. |
| VS44 | **73 Bildfragen in der Fragerunde** (Tafelzeichen, Lichter, Tonnen). Vorschlag: Das Bild erscheint auf dem Bildschirm, und Harms sagt „Schau aufs Bild“. Im Auto-Modus oder bei ausgeschaltetem Bildschirm werden sie übersprungen und später in der App nachgeholt. Der amtliche Wortlaut wird nie verändert. | 20.10. k | Angenommen (B94) |
| VS45 | **Einsatz von Harms, wenn er die Wette verliert** (der Nutzer fragte nach Besserem als „Hinnerks Boot schrubben“):<br>1. **Ein Abend hinterm Tresen** (Empfehlung): Harms bedient einen ganzen Abend in Friedas Kneipe, mit Schürze, und muss jeden Gast mit „Jawoll, Käpt'n“ ansprechen. Das Finale spielt dann dort, und die erste Bestellung kommt von Smilla, die die Wette in Wahrheit gewonnen hat.<br>2. **Logbuch unterschreiben:** Harms schreibt ins Logbuch „Hinnerk ist der bessere Seemann“, und Frieda hängt die Seite gerahmt über den Tresen.<br>3. **Klabauter über den Winter:** Harms muss den Papagei den Winter über nehmen. Witz: Er bekommt seinen eigenen Spion, der jetzt alles über ihn ausplaudert.<br>4. **Hinnerks Boot schrubben** (Idee des Nutzers): einfach und gerecht, spiegelt Hinnerks Einsatz.<br>Kombinierbar: 1 als Hauptpreis, 3 als Schlusspointe. | 20.10. l | Wartet auf den Nutzer |
| B75 | Claude schreibt eine Liste der fehlenden Soundeffekte. Der Nutzer stellt sie bereit. | 20.10. i | „Schreibe nebenbei eine Liste mit Soundeffekten die noch fehlen. Ich Stelle diese dann bereit.“ | `podcast/soundeffekte.md`, O15 |
| B76 | Die Stimmen von Smilla und dem Käpt'n passen. Klabauter braucht eine andere. Kurze Vorstellungssätze je Figur; neue Stimmen sagen dabei ihren Namen; danach ordnet der Nutzer allen Figuren Stimmen zu. | 20.10. i | „Die Stimmen von smilla und kapitän passen. Aber der klabauter braucht eine andere. Schreibe kurze sätze … ich bin der kapitän hinnerik ich bin für x auf dem Boot zuständing. Dann alle anderen und alle die ihre Stimme neu vorstellen sagen den Namen der Stimme. Dann wähle ich alle charaktäre aus und ordne die Stimmen zu“ | P49, `podcast/casting.json`, `casting.js` |
| B77 | Kein Erzähler, außer Claude hält ihn für wichtig. Man soll der Geschichte gut folgen können, es soll nicht zu schnell gehen. | 20.10. j | „ich bin gegen den erzähler, außer du findest ihn wichtig. achte darauf, dass man der geschichte noch gut folgen kann. es sollte alles nicht zu schnell gehen.“ | O15, VS39 |
| B78 | Die Stimmen wählt der Nutzer später im Casting aus. Jetzt wird die Geschichte perfektioniert: didaktisch sinnvoll, alle Prüfungsfragen sinnvoll untergebracht, Spaß und Spannung, dramaturgisch und sprachlich ein Meisterwerk mit Anspielungen. Vorher fragt Claude die wichtigsten offenen Fragen, nach der Antwort beginnt das Layout der Geschichte. | 20.10. j | „das mit den stimmen funktioniert. ich werde sie im weiteren verlauf auswählen. jetzt gehts ums hörspiel … bevor du loslegst, frage mich zur story noch die wichitgesten offenen fragen … wenn ich darauf geantwortet habe, kannst du mit dem layout für die story anfangen“ | Leitfaden, VS40–VS42 |
| B79 | Je 5 Vorschläge für Klabauters Nebengeschichte und den Bootsnamen. | 20.10. j | „ja klabauters nebengeschichte und der bootsname: mache hier je 5 gute vorschläge.“ | VS40, VS41 |
| B80 | Klabauters Nebengeschichte: Varianten 1 (Petze) und 4 (Möwe). | 20.10. k | „Klabauter 1 und 4“ | P30, VS40 |
| B81 | Das Boot heißt Frieda. Frieda ist die Mutter von Hinnerk. | 20.10. k | „Bootsname Frieda ist die Mutter von hinnerk.“ | P30, O35 |
| B82 | Lieber mehr Folgen als gehetzt. | 20.10. k | „Lieber mehr folgen als zu gehezt!“ | P15, O2 |
| B83 | Die Fragen kommen nach der Folge und werden vorgelesen („Antwort A ist: …, B: …“). | 20.10. k | „Lieber nach der Folge die Fragen. Sie werden vorgelesen. Und die Antwort mit A ist: b : etc.“ | P55, O10 |
| B84 | Man kann jederzeit A, B, C oder D reinrufen; die Spracherkennung schickt es an die App, dann ein Geräusch für richtig oder falsch und die nächste Frage. Sprachfunktion abschaltbar (dann tippen). Auto-Modus: Folgen laufen durch. | 20.10. k | „Man kann jederzeit "reinrufen" a,b,c oder d. Die Spracherkennung erkennt es schickt die Info an die App. Dann ein geräusch für richtig oder flasch und die nächste Frage. Geht das technisch? Man kann auch die Sprachfunktion ausschalten und draufklicken. Bzw man kann den Auto Modus einschalten dann laufen die Folgen auch durch..“ | P55, VS43 |
| B85 | Logbuch statt Erzähler (VS42) ist angenommen. | 20.10. k | „3. Ja gute Idee.“ | P30, VS42 |
| B86 | Der Hörer wird am Ende der Folge gefragt und antwortet, sonst nicht direkt, und dann nur per Multiple Choice, damit keine Credits nötig sind. | 20.10. k | „4. Man wird schon gefragt, und antwortet darauf (am Ende der Folge etc. ) aber sonst nicht direkt. Und wenn dann nur multible choice samt es keine Credits braucht.“ | P48 |
| B87 | Hinnerk darf falsche Katalogantworten aussprechen. | 20.10. k | „5. Ja darf er.“ | P41, O28 |
| B88 | Es soll eine runde Sache werden, nicht wie abgearbeitete Themen. Trockene Themen sind ok, mit Rahmen in der Geschichte (z. B. Flaute, Crew an Deck mit Gesetzbuch). | 20.10. k | „7. Es geht darum, dass es gesamt eine runde Sache wird und sich nicht so anfühlt als ob die Themen abgearbeitet werden. (Manchmal ist es ok, es gibt eben auch trockene Themen) Dann heißt es in der Geschichte ggf so etwas wie: es ist Flaute die Crew sitzt an Deck und unterhält sich, mit einem Gesetzesbuch über die Gesetze) etc.“ | P30, P31 |
| B89 | Quirin lädt am Ende an den Chiemsee ein. | 20.10. k | „8 unbedingt.“ | P30, P47 |
| B90 | Der Nutzer steuert keine eigenen Witze bei; Claude soll nur die eigenen Texte verbessern. | 20.10. k | „9. Nur deine Texte verbessern.“ | O23 | ~~Was ist mit „ich will auch.“ gemeint?~~ | **Erledigt durch B90:** Der Nutzer steuert keine eigenen Witze bei. |
| B91 | Jetzt geht es um das große Ganze und das Konzept; dazu ein 2-minütiger Vorgeschmack auf eine Folge, der sich später noch ändern kann. | 20.10. k | „Es geht erstmal um das große ganze. Und mache eine 2 minütigen Vorgeschmack zu einer der folgen. Das kann sich später noch änder. Es geht jetzt erstmal um das Konzept“ | Leitfaden Fassung 2, `podcast/skripte/vorgeschmack-14.md` |
| B92 | Frieda ist Hinnerks Frau oder Freundin, nicht seine Mutter. Sie bleibt lieber an Land und betreibt in Flensburg eine Kneipe. | 20.10. l | „frieda soll die Frau oder freundin von hinnerik sein. sie bleibt aber lieber an land und betreibt in flensburg eine kneipe.“ | P30, ersetzt einen Teil von B81 |
| B93 | 22 Folgen passen. Claude kontrolliert Gesamtdauer und Dichte, damit es eine Geschichte bleibt. | 20.10. l | „22 folgen passen. aber kontrolliere nochmal: gesamtdauer und bekommt man so den inhalt gut und sinvoll unter, also frequenz, sodass es noch eine "geschichte" ist etc..“ | O2, Leitfaden §10 |
| B94 | Harms liest die Fragen in der Fragerunde. VS44 (Bildfragen) ist angenommen. | 20.10. l | „ja harms prüft die fragen. ja vs44 passt so.“ | P55, VS43, VS44 |
| B95 | Stimmenwünsche aus der ElevenLabs-Suche „Deutsch“: Hinnerk Bill (wie gehabt), Smilla Lily, Quirin George, Klabauter Wally, Wasserschutzpolizei Selena, Fischer Dr. von Quirky, Verkehrszentrale Mats, Hafenmeister Lucinda; Erzähler entfällt, Reserve Severin. | 20.10. l | „Hinnerik: wie gehabt bill - wise, mature, balancend, smilla: lily, velverty actres, quirin: george Klabauter: wally, wasserschutzupolizei: selena- deep charisma, fischer: dr. von quirky,, verkehrszentrale: mats- warm genuine, hafemseiter lucinda earthy, erzähler entflällt? fallls wir sie brauche: severin powerful“ | P49, `podcast/audio_config.json`, `podcast/casting.json` |
| B96 | Eine ganz kurze Geschichte bzw. ein Audio, in dem sich alle Figuren vorstellen. | 20.10. l | „mach eine ganz kurze geschichte zw ein audio in dem sich alle charaktäre kurz vorstellen.“ | `podcast/skripte/vorstellung.md` |
| B97 | Feste Stimmen (Voice-IDs): Klabauter aHb0rsWUX1Fsr1L8EX7f, Wasserschutzpolizei Selena 2aL479c8D3QMIPExj0tw, Fischer yjJ45q8TVCrtMhEKurxY, Hafenmeisterin Lucinda fs3nd19KF2GO2hLTzkBm, Erzähler ib8aaABAPZQpTo6hx8Jr, Verkehrszentrale 4FAKwoQRvqLfJJP6W6Qp. Dazu eine Hörprobe, in der sich alle Figuren nach Wichtigkeit vorstellen. | 20.10. m | „klabauter: aHb0rsWUX1Fsr1L8EX7f , wasserschutzpolizei: selena: 2aL479c8D3QMIPExj0tw , fischer: yjJ45q8TVCrtMhEKurxY , hafenmeisterin: fs3nd19KF2GO2hLTzkBm lucinda, erzähler: ib8aaABAPZQpTo6hx8Jr verkehrszentrale funk: 4FAKwoQRvqLfJJP6W6Qp erstelle jetzt eine hörprobe, in der sich alle charaktäre nach ihrer wichtigkeit vorstellen.“ | P49, `podcast/audio_config.json`, `podcast/skripte/vorstellung.md` |
| B98 | Das Skript der ersten Folge wird geschrieben. | 20.10. n | „schreibe nun das skript der ersten folge“ | `podcast/skripte/folge-01.md` |
| B51 | Die offiziellen Referenzen für die Technik: Audio-Tags, Text to Dialogue API, Text-to-Speech Best Practices, Aussprachewörterbücher. | 20.10. e | „Die offiziellen Referenzen für die technische Umsetzung sind …“ | Bible §14.13 |

## 2. Offene Fragen

| Nr | Frage | Stand und Vorschläge |
|---|---|---|
| O1 | ~~Welche Scheine, welche Reihenfolge?~~ | **Erledigt durch B37:** SBF See, danach Binnen als Zusatz. **Noch offen:** Gibt es später auch SKS-Folgen? Dazu gibt es keinen Beschluss. |
| O2 | ~~Wie viele Folgen genau?~~ | **Erledigt durch B93:** 22 Folgen, höchstens 14 Fragen je Folge, Dauer und Dichte geprüft (Leitfaden §10). |
| O3 | Wie viel Geplauder neben dem Stoff? | Stufen in VS4, nicht beantwortet. |
| O4 | ~~Was ist das große Rätsel beziehungsweise Überthema? Ist das Finale die Prüfung bei Harms?~~ | **Erledigt durch B59 und B66:** „Die Wette“; das Finale ist keine Prüfung. |
| O5 | Wie werden die Rollen geschärft? Wie oft irrt Hinnerk? | Der Nutzer will es „deutlich geschärft“. Vorschläge in VS3 und VS21. |
| O6 | Welches Erkennungszeichen hat Klabauter für „Wichtiges“? Gibt es ein Merkheft in der App? | Vorschlag: Schiffsglocke und „Krrah! Merken!“, höchstens acht Wörter, dazu ein Merkheft (VS3). In der gelobten Referenzszene verwendet, aber nicht einzeln bestätigt. |
| O7 | Welche neutralen, neckenden Anreden neben „hey du“? Wie oft und an welchen Stellen spricht die Crew den Hörer an? | Grundsatz erledigt durch B38 und B44 (neckend, geschlechtsneutral). Neue Ideen in VS27, Auswahl und Häufigkeit offen. |
| O8 | ~~Schalter und Überspringen~~ | **Erledigt durch B39.** Zu bestätigen bleibt die Deutung in P55: Mit „nur zuhören“ kommen keine Fragen am Ende, übersprungene Fragen zählen nicht als falsch. |
| O9 | Heißt „alle“ in B15 alle in der Folge behandelten Katalogfragen? | So in P56 gedeutet, bitte bestätigen. |
| O10 | ~~Zählen die Fragen am Ende in die 25 Minuten?~~ | **Erledigt durch B83:** Die Fragen kommen nach der Folge, als eigener Teil (etwa 6–8 Minuten). |
| O11 | Wie viel Abweichung von 25 Minuten ist erlaubt? | Offen. |
| O12 | Wie wird die Praxis in der Reihe behandelt? Gehört die Navigationsaufgabe des SBF See zu „alle Prüfungsfragen“? Wie weit ersetzt der Podcast den Kurs bei der Praxis? | Eine eigene Praxisfolge (V24) entfällt (B40). Vorschlag VS8: Knoten, Manöver und Navigation im Podcast erklären, üben im Knotenbrett, Manöverspiel und in der Navigationsschule. |
| O13 | ~~Welche Rolle hat Harms genau?~~ | **Erledigt durch B57, B59 und B66:** Prolog in Folge 1 mit der Wette und der Erklärung der Prüfung, später Kurzauftritte; geprüft wird erst der Nutzer in der App. Für den Prolog fehlt noch die Prüfungsordnung (F3). |
| O14 | Welche Gastfiguren, welche Namen, wie viele neue Stimmen? Kommt der Bayer auch beim SBF See vor? Wie stark ist sein Dialekt? | Begrüßte Beispiele: Hafenmeister, Funkstimme, Fischer. Der Bayer ist selbst witzig, keine Bayern-Witze (B41). Weiteres offen. |
| O15 | Gibt es einen Erzähler, oder nur Dialog mit Geräuschen? Gibt es Musik oder einen Jingle? | **Teilweise geregelt:** Geräusche liefert der Nutzer als Dateien (B75), Claude mischt sie dazu (Liste `podcast/soundeffekte.md`). Offen sind Erzähler und Titelmusik. Vorschlag in VS39. |
| O16 | Gibt es Regeln für Einleitung, Übergänge, Kapitel und Schluss außer Hinweis und Cliffhanger? | Vorschläge VS2, VS5, VS20. |
| O17 | Wie lautet der Hinweis in „Über die App“ (heute: „ersetzt keine Ausbildung“)? | Antwort vom 20.10.: „13. denk drüber nach.“ Formulierungen in VS9. |
| O18 | Was wird aus den KI-Knöpfen „Eigene Folge erzeugen“ und „Weiterreden“ und aus „Fragen dazu üben“ im Kajütenfunk? | Nicht besprochen. Am 05.10. hieß es, KI-Folgen müssen gespeichert werden (umgesetzt). |
| O19 | Zeigt die App während der Folge Bilder, etwa Lichter und Tonnen? | Vorschlag VS7. |
| O20 | Wie hängt der Podcast mit „Kurs für heute“ und dem Lernplan zusammen? | Vorschlag VS18. |
| O21 | Wo liegen die Audiodateien? Wie laufen alle Folgen offline (B31) bei mehreren hundert MB? Werden Folgen einzeln geladen? | Vorschlag VS12. Siehe W11. |
| O22 | Welches Abo, wie viele Credits im Monat? Welche Bitrate? | Die Modellwahl regelt jetzt A9 (Hörtest, Kandidaten Eleven v4 und v3, Dialog über Text to Dialogue). Credits und Bitrate sind offen (F1, VS12). Zusatz: Bei einem Drittanbieter sind für Eleven v4 40 $ pro Million Zeichen angegeben. Der Preis im ElevenLabs-Abo ist nicht geprüft. |
| O23 | Was ist mit „ich will auch.“ (20.10. b, direkt nach „der kapitän erzählt auch von meerjungfrauen etc.“) gemeint? | Unklar. Vielleicht: Der Nutzer will selbst Ideen oder Witze beisteuern, oder er will mehr solche Witze. Bitte klären. |
| O24 | Dürfen gute alte Kurzgeschichten als Hinnerks Garn wiederverwendet werden? | Am 19.10. gefragt. Die Antwort „ja wird alles völlig neu“ spricht eher dagegen. Bitte bestätigen. |
| O25 | Kommt die erfundene Übungskarte der App (Kliev-Mündung) neben den echten Orten vor? | Am 19.10. vorgeschlagen: echte Orte nur im Garn, Aufgaben im erfundenen Revier. Der Nutzer antwortete „dann echte orte“ (B14). Der Umgang mit der Karte ist offen. |
| O26 | Wie entsteht für SKS Multiple Choice, wenn die SKS-Katalogfragen offen gestellt sind? | `data/sks-mc.json` (aus dem Törn) gibt es bereits. Nicht besprochen. |
| O27 | Teilen sich SBF See und Binnen die Folgen zu den 72 Basisfragen? | Vorschlag vom 19.10. (VS1), nicht beantwortet. |
| O28 | ~~Darf Hinnerk falsche Katalogantworten aussprechen?~~ | **Erledigt durch B87:** ja, Smilla berichtigt in derselben Szene. |
| O29 | Stimmen die abgeleiteten Kriterien und Deutungen der Bible mit dem Gemeinten überein? | Bitte prüfen: P14, P17, P18, P22, P23, P32, P34, P35, P43, P56, P58, P59, P62, X1, X8, X9, X10. Dazu: P27/P36 übernehmen die Beschreibung von C wörtlich (Hinweis und Cliffhanger in jeder Folge), P52 deutet „ja genau“ als Zustimmung zu den derben Einzelheiten. |
| O30 | Passt die Form der Autorenskripte (A33)? Wie gibt der Nutzer Skripte frei (lesen, Handystimme, Stichprobe)? | Teilweise erledigt: Konfiguration in `podcast/audio_config.json` (B46), Verzeichnis in `podcast/pronunciation_dictionary.md` (B45). Die Skriptform `podcast/skripte/*.md` hat Claude für das Prüfwerkzeug festgelegt (A33), bitte bestätigen. Der Freigabeweg ist offen (VS14). |
| O31 | Wie viel hört der Nutzer selbst ab, bevor eine Folge freigegeben wird? | Claude kann Audio nicht hören (A30). Jede Folge ganz abzuhören wären bei 12–25 Folgen etwa 5 bis 10,5 Stunden. Vorschlag VS28: automatische Rückschrift als Hilfe. |
| O32 | ~~Gelten die Anreden auch für Hörerinnen?~~ | **Erledigt durch B44:** Alle Anreden sind geschlechtsneutral. |
| O34 | ~~Heimathafen~~ | **Erledigt durch B63:** Flensburg. Leitfaden angepasst. |
| O35 | ~~Wie heißt das Boot?~~ | **Erledigt durch B81:** Frieda, nach Hinnerks Mutter. |
| O36 | ~~Name, Charakter und Einsatz des Bayern~~ | **Erledigt durch B61 und B65:** Quirin. |
| O37 | Welche Nebengeschichte bekommt Klabauter? | Nicht seine Vergangenheit aus VS35 (B60). Fünf Vorschläge in VS40. |
| O38 | Bekommt Klabauter die neue Stimme auch in der App (Stimmenpaket)? | P49 verlangt dieselbe Stimme in Podcast und App. Dann müssten seine 53 festen Sätze neu erzeugt werden, etwa 1.100 Zeichen. Claudes Empfehlung: ja. |
| O33 | Wer prüft die Aussprache schwieriger Begriffe (Plattdeutsch, Bairisch, Fachwörter, Ortsnamen), wenn sie unklar ist? | A19 verlangt eine verlässliche Quelle. Claude kann Aussprache nur aus Wissen und Nachschlagen bestimmen, nicht anhören. |

## 3. Widersprüchliche Aussagen

| Nr | Widerspruch | Stand |
|---|---|---|
| W1 | CLAUDE.md §3 „Keine sexuellen Anspielungen“ und V3 „Anzüglichkeiten raus“ gegen B19 (doppeldeutige sexuelle Anspielungen). | **Für den Podcast gelöst:** B19 ist später und ausdrücklich. CLAUDE.md §3 hat einen Verweis bekommen. **Offen:** Gilt das auch für den Rest der App? Bisher nicht. |
| W2 | CLAUDE.md §3 beschreibt Hinnerk als „trocken, kurz angebunden“, B5 sagt „erzählt viel Kauderwelsch“. | Offen. Vorschlag vom 19.10.: trocken im Ton, beim Erzählen redselig. Gehört zu O5. |
| W3 | „viel Kauderwelsch“ (19.10.) gegen „der kaptn irrt nicht immer“ (20.10.). | Gelöst durch die spätere Aussage: Er irrt oft, aber nicht immer. Wie oft, ist offen (O5). |
| W4 | Zwischenfragen mit Einstellung (19.10.) gegen Fragen erst am Ende (20.10.). | Gelöst durch die spätere Aussage (B15). Der Schalter ist offen (O8). |
| W5 | „unabhängig der prüfung“ (B4) gegen ein mögliches Prüfungsfinale mit Harms (VS25). | **Weitgehend gelöst durch B57:** Harms darf am Anfang erklären, wie er prüft, und taucht auf, wenn es passt. Die drei reden untereinander weiter als Seeleute, nicht über die Prüfung (X9). Offen ist nur noch das Finale (O13). |
| W6 | CLAUDE.md E10, V8 und §4 „Teil 2“ (Nutzer überarbeitet die alten Folgen, danach Stimmen) gegen B17 (alles völlig neu). | Gelöst durch B17. CLAUDE.md verweist jetzt auf die Bible. |
| W7 | CLAUDE.md §1 (in etwa zwei Wochen bereit zur Veröffentlichung) gegen B18 (verschoben). | Gelöst. CLAUDE.md §1 hat einen Vermerk bekommen. Ein neuer Termin ist offen. |
| W8 | Bayer als Witzfigur (B24) gegen CLAUDE.md §3 „keine Beleidigungen von Gruppen“. | **Gelöst durch B41:** keine Bayern-Witze, der Bayer ist selbst witzig. |
| W9 | CLAUDE.md R10 (neue feste Sätze in `docs/feste-saetze.md` eintragen) gegen die Menge an Podcasttext (Tausende Zeilen). | Offen. Naheliegend wäre: Die Skripte selbst sind die Liste. Nicht beschlossen. |
| W10 | CLAUDE.md R3 (kleine Unklarheiten entscheidet Claude selbst) gegen den Auftrag vom 20.10. (offene Fragen nicht eigenmächtig entscheiden). | Offen. Bis zur Klärung entscheidet Claude beim Podcast keine Punkte aus Abschnitt 2 selbst. Handwerkliche Entscheidungen innerhalb eines Skripts (Wortwahl, Szenendetails) fallen darunter nur, wenn sie keine Regel und keine offene Frage berühren. |
| W11 | Alle Folgen offline (B31) gegen die Datenmenge (geschätzt 130–260 MB für 9 Stunden). | Offen (O21). |
| W12 | `docs/konzept-architektur.md` §1.6 sagt „Ton … ab 14“, CLAUDE.md E1 sagt „ab 12“. | E1 ist später und gilt. Das Konzeptdokument ist nicht geändert. |
| W13 | CLAUDE.md E5 stand auf „offen“, B16 erlaubt den Schlüssel für den Podcast. | Für den Podcast gelöst. CLAUDE.md E5 hat einen Vermerk bekommen. |
| W14 | CLAUDE.md „Nach der Veröffentlichung: Folgen für SKS und Binnen“ gegen B24 (Binnen am Chiemsee) und die verschobene Veröffentlichung. | **Gelöst durch B37:** Binnen kommt als Zusatz nach SBF See. CLAUDE.md ist angepasst, für SKS gibt es keinen Beschluss (O1). |
| W15 | Die gelobte Referenzszene (B25) verwendet den verworfenen Namen „Lütt Deern“ (B22). | In Anhang A der Bible vermerkt. |
| W16 | CLAUDE.md §4 nennt „Teil 2 rund 56.000 Zeichen“, gemessen sind heute 37.191 Zeichen (27.862 in Folgen und 9.329 in Kurzgeschichten, ohne eingesetzte Katalogantworten). | Durch B17 ohne Bedeutung, nur zur Information. |
| W17 | **Stoffdichte:** 12–25 Folgen zu je 25 Minuten gegen alle Fragen und Praxis (B3) als spannende Geschichte mit Geplauder (B4, B11). | **Entschärft durch B49 und B50:** Die Zahl ergibt sich aus der Geschichte, Binnen wird eigens geplant. Der Leitfaden für SBF See (VS30) kommt auf 16 Folgen mit 11 bis 23 Fragen, im Schnitt 18. Ob das in 25 Minuten mit Geschichte und Geplauder passt, zeigt erst das erste ausgeschriebene Skript. |
| W18 | Das AR spricht von „zwölf Folgen“, B37 von „ca. 12–25 Folgen“. | In der Bible auf „alle Folgen“ verallgemeinert. |
| W19 | Das AR sieht grundsätzlich nur drei Charakterstimmen vor, B23 verlangt Gastrollen mit eigenen Stimmen, dazu kommen Harms und der Bayer. | In A25 angepasst: Jede Figur, auch Gäste, hat eine feste Stimme. Laut Doku sind bis zu 10 Stimmen pro Anfrage möglich. |
| W20 | Das AR verlangt, Beiträge ohne Funktion zu streichen und Wiederholungen zu vermeiden. Gewollt sind aber Geplauder (B4) und Klabauters Wiederholungen (B6). | In A3 und A4 angepasst: Humor, Figur und Atmosphäre zählen als Funktion, Klabauters Wiederholungen und Rückgriffe sind erlaubt. |
| W21 | Das AR verlangt mehrfach, die Ausgabe „abzuhören“. Claude kann Audio nicht hören. | In A30 angepasst: Claude prüft automatisch, der Nutzer hört ab. Der Umfang ist offen (O31). |

## 4. Fehlende Informationen

| Nr | Was fehlt | Wer |
|---|---|---|
| F1 | Größe des ElevenLabs-Abos (Credits im Monat) | Nutzer |
| F2 | Secret `ELEVENLABS_API_KEY` und Freigabe von `api.elevenlabs.io` in der Cloud-Umgebung. Erst nötig, wenn die Folgen ausgereift sind (B16). | Nutzer |
| F3 | Prüfungsordnung beziehungsweise Richtlinie zur praktischen Prüfung. **Der Nutzer lädt sie hoch (B57).** Bisher liegt die Richtlinie nur als Upload dieser Cloud-Sitzung vor (`SpFV_richtlinien_praktische_prüfung.pdf`, hochgeladen am 10.10.), nicht im Repo und nicht in `quellen/`. In einer neuen Sitzung erneut hochladen oder lokal in `quellen/` legen. | Nutzer |
| F4 | Die Originalkataloge in `quellen/` fehlen in der Cloud. Prüfungen gegen die App-Daten werden markiert (R8). | – |
| F5 | Ob die Stimmen plattdeutsch oder bairisch gefärbten Text überzeugend sprechen, ist ungeprüft. | Test (P64) |
| F6 | Am 20.10. von Claude erbeten, noch nicht beantwortet: eigene Anekdoten, Hörspiele oder Podcasts, deren Ton dem Nutzer gefällt, das Heimatrevier. | Nutzer, freiwillig |
| F7 | Wie sich doppeldeutige Anspielungen auf die Altersfreigabe im Store auswirken (Fragebogen der Anbieter) | später beim Store-Eintrag |
| F8 | Lizenzbedingungen der zusätzlichen Gaststimmen (L4) | bei der Stimmenwahl |
| F9 | Laut Websuche zur v4-Doku (20.10.) gesichert: Die Modell-ID ist `eleven_v4`. Dazu: höchstens 10.000 Zeichen bei Text to Speech, nur die Einstellungen Stability und Similarity, kein SSML, Audio-Tags sind das Hauptmittel. **Noch zu bestätigen:** ob v4 Aussprachewörterbücher und IPA unterstützt (zwei Fassungen der Doku widersprechen sich); welche Tags auch v4 Turbo kann; ob es für den Dialog-Endpunkt Kontextparameter und Audioeffekte gibt; aktuelle Grenzen und Preise. Die Doku war am 20.10. aus der Cloud nicht direkt abrufbar. | Claude, sobald `api.elevenlabs.io` und die Doku erreichbar sind (F2) |

## 5. Vorschläge, die noch nicht bestätigt wurden

Alle hier aufgeführten Vorschläge stammen von Claude. Sie gelten nicht als Regel.

| Nr | Vorschlag | Datum | Stand |
|---|---|---|---|
| VS1 | **Umfangsschätzung:** etwa 1 Minute pro Frage im Gespräch. SBF See 9–10 h mit etwa 23 Folgen, Binnen-Zusatz etwa 10 Folgen (4–5 h), SKS etwa 15 h, zusammen etwa 30 h. SBF See zuerst, die Basis-Folgen gelten auch für Binnen. | 19.10. | Überholt durch B37 (ca. 12–25 Folgen, SBF See und Binnen). Der Themenplan ist verworfen (Abschnitt 6). Offen bleibt, ob die Basis-Folgen für Binnen mitgelten (O27). |
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
| VS27 | **Neckende, geschlechtsneutrale Anreden** neben „hey du“ (zweite Fassung nach B44). Diese Wörter werden für alle verwendet, egal welches grammatische Geschlecht sie haben.<br>Hinnerk: „Landratte“, „Schietbüdel“ (Plattdeutsch, liebevoll derb), „Dösbaddel“ (Plattdeutsch), „Kielschwein“ (ein Bauteil im Rumpf).<br>Smilla: „Frischling“, „Landei“, „Seegurke“, „Bordküken“.<br>Klabauter: „Grünschnabel! Grünschnabel!“ (ein Papagei, der andere Grünschnabel nennt).<br>Gestrichen: „Moses“ (B44), „Matrose“ (B44), „Badewannen-Kapitän“, „Sonntagssegler“, „Kapitän Ahnungslos“ und „Süßwassermatrose“ (nicht neutral). | 20.10. e | Vorschlag auf die Frage „gibt es gute genderneutrale anreden die necken?“ |
| VS28 | **Automatische Rückschrift:** Das fertige Audio wird per Spracherkennung zurück in Text verwandelt und mit dem Skript verglichen. Das findet fehlende oder verschluckte Wörter und hörbare Codes. Natürlichkeit und Betonung findet es nicht. | 20.10. d | Unbeantwortet (O31). Kostet je nach Dienst Credits oder braucht ein lokales Programm. |
| VS29 | **Ablage:** Autorenskripte, Konfiguration und Ausspracheverzeichnis in einem eigenen Ordner. Die fertigen Audiodateien getrennt vom Stimmenpaket. | 20.10. d | Mit B45 bis B47 umgesetzt als Ordner `podcast/`. Der Ort der Audiodateien ist offen (O21). |
| VS30 | **Leitfaden der Geschichte SBF See** in `podcast/leitfaden-sbf-see.md`.<br>Rahmen: eine Saison an der Schlei vom Einkranen bis zum Auskranen. Route Schlei, Kieler Bucht, Nord-Ostsee-Kanal, Elbe, Helgoland, Watt und zurück. 16 Folgen mit je einem Fall und Rätsel.<br>Figurenbögen: Hinnerks schlechte Nachtsicht bis zur Übergabe des Ruders, Smilla wird Schiffsführerin, Papagei gegen Katze.<br>Grober Stoffplan: alle 285 Fragen genau einmal zugeordnet, alle sechs Prüfungsmanöver und die Knoten verteilt. Das Überthema ist bewusst offen gelassen (B42). | 20.10. e | Entwurf, wartet auf den Nutzer |
| VS31 | **Zwei weitere Anreden für Klabauter** (B54): „Nesthocker! Nesthocker!“ (Vogelwort für Küken, die noch im Nest sitzen) und „Federlos! Federlos!“ (für einen Papagei sind Menschen federlos). Ersatz: „Plattfuß! Plattfuß!“. | 20.10. f | Angenommen (B67) |
| VS32 | **Heimathafen statt „Schlei“** (O34). Die Folgen 4, 5 und 16 bekommen dann eine neue Kulisse, der Stoff bleibt gleich.<br>(a) **Flensburg** (Empfehlung): Förde, alte Rumstadt. Das passt zu Hinnerks Rum-Garn, dazu der historische Hafen.<br>(b) **Eckernförde:** Bucht nahe Kiel, kurze Wege.<br>(c) **Kappeln behalten**, aber das Wort „Schlei“ nicht in Titel und Rahmen verwenden. | 20.10. f | Angenommen: (a) Flensburg (B63) |
| VS33 | **Bootsnamen** (O35):<br>„Kehrwieder“ (norddeutsch für „komm wieder“, passt zur Saison, die im Heimathafen endet; Empfehlung),<br>„Sturmfreie Bude“ (doppeldeutig: Kinder hören „kein Sturm“, Erwachsene etwas anderes),<br>„Klönschnack“ (plattdeutsch für gemütliches Gerede, passt zum Podcast),<br>„Seelenverkäufer“ (Seemannswort für ein klappriges Schiff; Hinnerk nennt sein Boot liebevoll so),<br>„Möwenschiet“ (derb). | 20.10. f | Abgelehnt (B64), neue Vorschläge in VS37 |
| VS34 | **Der Bayer und Harms** (O13, O36).<br>**Name:** „Korbinian“, kurz „Korbi“ (Empfehlung; „wie der Heilige, aber i bin's net“), „Quirin“ oder „Xaver“.<br>**Charakter:** Bergführer aus dem Chiemgau. Er kennt das Wetter am Berg und die Kletterknoten (Achtknoten und Palstek gibt es beim Klettern auch). Auf dem Wasser ist er ahnungslos und seekrank und lacht selbst am lautesten darüber. Keine Klischees wie Lederhose oder Weißwurst, der Humor kommt aus der Person (B41, B56).<br>**Einsatz:** Er kommt bei der Kieler Woche (Folge 6) als Mitsegler an Bord und bleibt bis zum Schluss. Im Sturm (Folge 15) glänzt er einmal: Sicherungsleinen und Einpicken kennt er vom Berg (`sbf:278`). In der Binnen-Staffel tauschen die Rollen, dann ist Hinnerk am Chiemsee der Ahnungslose.<br>**Verhältnis zu Hinnerk:** „Grummel trifft Sonnenschein“. Hinnerk findet ihn anstrengend, zu laut, zu fröhlich, er sagt „Hinni“. Der Bayer bewundert ihn und lässt sich nicht kränken. Dazu ein Garn-Duell Berg gegen See, Smilla berichtigt beide. Klabauter liebt ihn, Backbord ignoriert ihn. Alternative: alte Rivalen von früher.<br>**Harms:** Prolog in Folge 1: Er besucht die Werft als alter Bekannter Hinnerks und erklärt nach der Prüfungsordnung, was er am Ende prüft. Später Kurzauftritte, z. B. am Telefon. Folgerung aus dem Leitfaden: Damit Smilla Schiffsführerin werden darf, braucht sie bei einem Motor über 15 PS den Führerschein (`sbf:75`). Das Finale wäre dann ihre Prüfung bei Harms. | 20.10. f | Angenommen mit Änderungen (B61, B65, B66): Quirin statt Korbinian, kann auf Seen segeln, Finale ohne Prüfung |
| VS35 | **Überthema, vier Vorschläge** (O4):<br>1. **Die Wette** (Empfehlung): Harms wettet mit Hinnerk, dass er keine Saison ohne Regelverstoß schafft. Verliert Hinnerk, schleift er den ganzen Winter Harms' Boot. Jede Folge wird damit spannend, denn jeder Irrtum Hinnerks kann die Wette kosten, und Smilla rettet ihn. Die Hörer erkennen Verstöße oft zuerst (Mitdenken). Hinnerk verschweigt wegen der Wette auch seine schlechte Nachtsicht. Wendung im Finale: Hinnerk merkt, dass er nur dank Smilla gewonnen hat, und übergibt ihr das Ruder.<br>2. **Klabauters Vergangenheit:** Der Papagei sagt Sätze, die ihm niemand beigebracht hat, etwa einen Schiffsnamen oder die Kennung eines Leuchtfeuers. Mit Prüfungswissen entschlüsselt, führen sie die Reise entlang. Im Finale findet man seinen früheren Besitzer, vielleicht einen alten Leuchtturmwärter auf Helgoland oder Harms. Gut als warmer Nebenstrang zu 1.<br>3. **Die Flaschenpost:** Beim Einkranen fällt eine alte Flaschenpost aus einem Staufach, ein Brief mit Peilungen und Kennungen als Hinweisen. Am Ende stellt sich heraus: Der junge Hinnerk hat ihn geschrieben und sich nie getraut, ihn abzuschicken.<br>4. **Hinnerks letzte Saison:** Hinnerk verkündet, dass es seine letzte Saison ist und das Boot bekommt, wer es verdient. Wendung: Manche seiner „Irrtümer“ waren absichtliche Prüfungen, auch für dich als Hörer. | 20.10. f | Nr. 1 angenommen (B59), Nr. 2 nicht (B60) |
| VS36 | **Großschreibung zur Betonung:** Laut ElevenLabs-Doku kann Großschreibung ein Wort betonen. A24 verbietet das bisher (nach AR 10.3), und das Prüfwerkzeug meldet Wörter in Großbuchstaben als Abkürzung. Vorschlag: im Test (A27) ausprobieren und bei Erfolg sparsam erlauben, mit einer eigenen Ausnahme im Prüfwerkzeug. | 20.10. f | Angenommen für den Test (B68) |
| VS37 | **Bootsnamen, wie Hinnerk sie aussuchen würde** (O35, B64, B72). Jeder Name bringt eine Geschichte mit, die Hinnerk mal so, mal so erzählt.<br>**Frauennamen:**<br>„Gesine“ (gefällt dem Nutzer schon; nach seiner Mutter oder einer alten Liebe, Hinnerk erzählt beides),<br>„Wiebke“ (Empfehlung; friesisch; Hinnerk: „Meine Ex-Frau ist gegangen, das Boot ist geblieben. Also heißt das Boot wie sie.“ Doppeldeutig: „Die Einzige, die mich noch ans Ruder lässt.“),<br>„Meta“ (plattdeutscher Oma-Name nach seiner Großmutter; Quirin hält es für den Internetkonzern, Running Gag),<br>„Telse“ (nordfriesisch, selten; nach der Wirtin einer Flensburger Hafenkneipe, die ihn rausgeworfen hat),<br>„Frieda“ (soll Frieden an Bord bringen, was nie klappt),<br>„Swantje“ (norddeutsch, „kleiner Schwan“; Smilla: „Ein Schwan? Das Ding?“).<br>**Anderes:**<br>„Ole Liebe“ (plattdeutsch „alte Liebe“), „Dickkopp“ (Sturkopf wie er), „Rumtreiber“ (Rumstadt Flensburg).<br>Bewusst nicht: „Ilse“ (frühere Figur der App), „Lütt Deern“ (verworfen) und „Seute Deern“ (bekanntes echtes Museumsschiff). | 20.10. h | Wartet auf den Nutzer |
| VS38 | **Klabauters Nebengeschichte, drei Varianten** (O37, B71):<br>1. **Die Petze** (Empfehlung): Klabauter plappert alles nach und ist damit die größte Gefahr für die Wette. Was er aufschnappt, kann er Harms erzählen. Hinnerk versucht die ganze Saison, ihn zu bestechen (Kekse, Sonnenblumenkerne) und ihm Schweigen beizubringen, er lernt dabei immer die falschen Wörter. Hörer erkennen an seinem Geplapper, wo Hinnerk danebenlag. Im Finale steht er vor Harms, alle halten die Luft an, und er sagt nur den einen richtigen Satz, der Hinnerk rettet. Knüpft direkt an die Testszene an („Harms! Harms!“).<br>2. **Das Klabauter-Patent:** Klabauter hält sich für den echten Klabautermann, den Schiffsgeist aus der Seemannssage, der vor Gefahr warnt. Damit er sein „Patent“ behält, braucht er eine Heldentat pro Saison. Er warnt dauernd vor falschen Gefahren (die Katze, ein Fender, Quirins Lederschuhe). Im Herbststurm warnt er einmal wirklich, und keiner glaubt ihm erst. Verbindet Seemannsgarn (P34) mit einer echten Sicherheitslehre.<br>3. **Die Möwe von Helgoland:** Klabauter verliebt sich in eine Möwe, die das Boot von Flensburg an begleitet, und will ihr imponieren, indem er Fachwörter lernt. Backbord ist eifersüchtig und will die Möwe fressen. Auf Helgoland fliegt die Möwe weg, im Finale sitzt sie wieder auf dem Mast. Warm und komisch, doppeldeutig ohne Anzüglichkeit („Die hat einen Schnabel …“).<br>Kombinierbar: 1 als Hauptstrang, eine Prise von 2. | 20.10. h | Wartet auf den Nutzer |
| VS39 | **Bauplan fürs Hörspiel** (B74):<br>1. **Kaltstart:** Jede Folge beginnt mitten in einer Szene, in den ersten 30 Sekunden steht ein Haken (Fund, Streit, Geräusch). Danach Titelmusik.<br>2. **Szenen hörbar machen:** 6–9 Szenen pro Folge. Jede beginnt mit Atmo, damit der Ort in 3 Sekunden klar ist, und endet mit einem kurzen Übergang. Die Figuren sagen, was sie sehen („Da, unter der Cockpitbank“).<br>3. **Spannungsbogen:** Rätsel, falsche Spur (meist Hinnerk), Wendepunkt, Auflösung, am Ende ein Haken zur Wette.<br>4. **Regie gezielt:** höchstens ein Tag pro Beitrag, Flüstern und Rufen als Szenenmittel, Pausen vor Pointen, nie Effekte auf Prüfungsstoff (A14).<br>5. **Rhythmus:** kurze Wechsel; Erklärungen höchstens etwa 400 Zeichen am Stück, dann eine Reaktion.<br>6. **Kein Erzähler** (Vorschlag); die Orte kommen über Atmo und Dialog. Alternative: ein Satz Erzählstimme am Folgenanfang.<br>7. **Produktion:** Stimmen je Szene als Dialog-Anfrage, Geräusche als eigene Spur, Claude mischt mit ffmpeg zu einer fertigen MP3 je Folge (einmal erzeugt, X12).<br>8. **Nächster Test:** Folge 1, die ersten zwei Szenen ganz mit Geräuschen und Musik. | 20.10. i | Wartet auf den Nutzer |

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
- **Eigene Podcastfolge zur praktischen Prüfung (V24).** Entfällt (B40). Die Praxis wird trotzdem in der Reihe behandelt (P19).
- **Teile des Audio-Regelwerks, die nicht übernommen wurden.** Siehe Abschnitt 9.

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
| 20.10.2026 | Zweite Fassung mit den Antworten des Nutzers (B37–B43).<br>Geändert in der Bible: P15, P16, P20 (entfällt), P47, P48, P55, X4, X9, P61, P68 und die Prüfliste.<br>Neu ist Bible §14 „Sprechregie, Aussprache und Audioproduktion“ (A1–A31) aus dem Audio-Regelwerk des Nutzers. Es wurde kritisch geprüft und angepasst, die Abweichungen stehen in Abschnitt 9.<br>ElevenLabs-Angaben per Websuche geprüft.<br>App-Code ist nicht geändert. |
| 20.10.2026 | Dritte Fassung (B44–B51).<br>Neu angelegt:<br>• `podcast/audio_config.json` (A8),<br>• `podcast/pronunciation_dictionary.md` mit Version 1 und allen Einträgen auf `offen` (A17, A18),<br>• `tools/podcast-pruefen.js` (A32), mit Probeskripten getestet; die Entwurfsprüfung läuft im pre-commit,<br>• Skriptform festgelegt (A33),<br>• Leitfaden-Entwurf `podcast/leitfaden-sbf-see.md` (VS30).<br>In der Bible geändert: P15, P16, P48, A8, A18, A27, neu ist §14.13. App-Code ist nicht geändert. |
| 20.10.2026 | Zwölfte Fassung (B98): erster Entwurf Folge 1 „Die Spritztour“ (`podcast/skripte/folge-01.md`, 257 Beiträge, etwa 16.800 Zeichen, gut 20 Minuten Sprechtext, alle 14 Fragen der Folge). Neu in der Geschichte: Jonte ist Harms’ Neffe (Spion-Verdacht), der Fischer als Zeuge, Harms’ alte Regatta-Disqualifikation. Platzhalter für Harms’ Prüfungserklärung (F3), Harms’ Einsatz vertagt (VS45). |
| 20.10.2026 | Elfte Fassung (B97): Voice-IDs eingetragen (Quirin mit der Standardstimme George aus Claudes Wissen, unbestätigt; Frieda noch ohne Stimme), Hörprobe „Wer ist wer?“ nach Wichtigkeit. |
| 20.10.2026 | Zehnte Fassung (B92–B96): Frieda ist Hinnerks Frau oder Freundin mit Kneipe, 22 Folgen bestätigt und Dichte geprüft (höchstens 14 Fragen je Folge, Leitfaden §10), Harms liest die Fragen, Bildfragen angenommen, Stimmenwünsche in Konfiguration und Casting (IDs folgen aus dem Casting), Casting mit Namenssuche, Hörprobe nutzt Casting-Stimmen, Vorstellungsszene. Vorschlag VS45 (Einsatz von Harms). |
| 20.10.2026 | Neunte Fassung (B80–B91): Klabauter Petze und Möwe, Boot Frieda, mehr Folgen, Fragerunde nach der Folge mit Spracheingabe, Logbuch, Hörer antwortet nur per Multiple Choice, Hinnerk darf falsche Antworten sagen, runde Sache statt Abarbeiten, Chiemsee-Einladung. Leitfaden Fassung 2 (22 Folgen, alle 285 Fragen zugeordnet), Vorgeschmack Folge 14, Vorschläge VS43 und VS44. |
| 20.10.2026 | Achte Fassung (B77–B79): kein Erzähler, gut folgbar und nicht zu schnell; Vorschläge VS40 (Klabauter), VS41 (Bootsname), VS42 (Logbuch statt Erzähler); offene Story-Fragen an den Nutzer gestellt. |
| 20.10.2026 | Siebte Fassung (B73–B76): Eleven v4 gewählt (Konfiguration), Hörspiel als Ziel (Vorschlag VS39), Soundeffekt-Liste `podcast/soundeffekte.md`, Stimmen-Casting in der App (`casting.js`, `podcast/casting.json`, v4.76), neue Frage O38. |
| 20.10.2026 | Sechste Fassung (B70–B72): Hörprobe neu mit allen Regie-Mitteln (Tags für Absicht, Pausen, Tempo und ein Geräusch in `podcast/audio_config.json`, Prüfwerkzeug und `hoerprobe.js` setzen sie um, v4.74), neue Bootsnamen (VS37), drei Varianten für Klabauter (VS38). |
| 20.10.2026 | Fünfte Fassung (B59–B69): Die Wette, Quirin, Flensburg, Smilla mit beiden Scheinen, Finale ohne Prüfung, Klabauter-Anreden, Großschreibung im Test. O4, O13, O34, O36 erledigt, neu O37 und VS37. Leitfaden und Ausspracheverzeichnis (Version 2) angepasst. Hörprobe: Testskript `podcast/skripte/test-01.md` und Entwickler-Knopf in der App (`hoerprobe.js`, v4.73). |
| 20.10.2026 | Vierte Fassung (B52–B58): Leitfaden im Grunde angenommen, Route bestätigt, Anreden angenommen und Audio wird mehrfach genutzt (auch in `docs/feste-saetze.md` eingetragen), der Bayer schon bei SBF See, Harms erklärt am Anfang die Prüfung. Neue offene Punkte O34–O36, Vorschläge VS31–VS36. Erkenntnisse aus der v4-Doku in Bible §14.13, `eleven_v4` als bekannte Modell-ID in der Konfiguration (gewählt wird erst per Hörtest). App-Code ist nicht geändert. |

## 9. Audio-Regelwerk vom 20.10.: übernommen, angepasst, weggelassen

Der Nutzer hat das Regelwerk „Sprechregie, Aussprache und Audioproduktion“ geliefert, mit dem Auftrag, es kritisch zu prüfen und nur Sinnvolles zu übernehmen (B43). Ergebnis:

| AR-Abschnitt | Ergebnis | Begründung |
|---|---|---|
| 1 Rangfolge, 1.1 Schreiben fürs Ohr | übernommen (A1, A2) | passt zu B4 und R8 |
| 2.1 Drei Ebenen | übernommen (A5) | trennt Redaktion und Technik sauber, Ebene B entsteht durch ein Werkzeug |
| 2.2 Keine erfundenen Befehle | übernommen (A6) | entspricht R2 |
| 3 Konfiguration | übernommen (A8), angepasst | Schlüssel nur als Secret (R9). Voice-IDs für alle Figuren, nicht nur drei (W19) |
| 3.1 Modellstrategie v4/v3 | übernommen (A9), ersetzt für den Podcast die „drei Probesätze“ aus CLAUDE.md §4 | Eleven v4 gibt es laut Websuche seit Ende September oder Anfang Oktober 2026, die Dialog-Doku empfiehlt es. „v4 Turbo“ kann keinen Dialog. |
| 3.2 Text to Dialogue | übernommen (A10), ergänzt | Laut Doku bis zu 10 Stimmen pro Anfrage. Ohne Angabe nimmt der Endpunkt `eleven_v3`, deshalb das Modell immer setzen. |
| 3.3 etwa 2.000 Zeichen | übernommen (A11) | laut Doku eine weiche Grenze |
| 3.4 Kontinuität | übernommen (A12), korrigiert | „future_text“ ist für den Dialog-Endpunkt nicht belegt, `seed` laut Doku nur „best effort“ |
| 4 Interne Regiecodes | übernommen (A7), ergänzt | Kategorie `FRAGE` hinzugefügt, damit die Fragenzuordnung (P17) maschinenlesbar ist |
| 5 Audio-Tags | übernommen (A14) | Kandidatenliste bleibt experimentell bis zum Test |
| 6 Pausen | übernommen (A15) | SSML-Pausen bei v3 nicht unterstützt, bei v4 nicht bestätigt |
| 7 Aussprache | übernommen (A17–A21), angepasst | Statt YAML erst JSON (R11), nach Wunsch des Nutzers (B45) dann eine eigene Markdown-Datei mit Tabellen, die das Prüfwerkzeug liest. Plattdeutsch und Bairisch ergänzt. „Zwölf Folgen“ auf „alle Folgen“ verallgemeinert (W18). Unterstützung von Wörterbüchern und IPA bei v4 nicht bestätigt (F9). |
| 8 Zahlen, Abkürzungen, Prüfungswissen | übernommen (A22–A24) | Der AR-Punkt zu „gesprochenen Prüfungsfragen“ gilt hier für Kataloginhalte im Dialog. Die Fragen am Folgenende erscheinen als Text in der App (P58). |
| 9 Charakterprofile | übernommen (A25), angepasst | Das Profil-Raster ist übernommen. Die Inhalte gehören zur offenen Schärfung (O5), Claude setzt sie nicht eigenmächtig fest. Gäste haben auch feste Stimmen (W19). |
| 10.1 Jeder Beitrag mit Funktion | angepasst (A3) | Humor, Figur und Atmosphäre zählen als Funktion, sonst würde das gewollte Geplauder gestrichen (W20) |
| 10.2 Keine Wiederholungen | angepasst (A4) | Klabauters Wiederholungen und Rückgriffe sind gewollt (B6, W20) |
| 10.3, 10.4 Betonung, Fachwissen | übernommen (A24) | – |
| 11 Tempo und Laufzeit | übernommen (A15, A16) | P14 bleibt Richtwert fürs Schreiben, gemessen wird am Audio |
| 12 Geräusche | übernommen (A26) | `audio_effects` am 20.10. nicht in der Doku gefunden. Die Frage nach einem Erzähler bleibt offen (O15). |
| 13 Ablauf im Werkzeug | übernommen, in A5, A13 und A30 eingearbeitet | Ergänzt um A13: nur geänderte Abschnitte neu erzeugen, spart Credits |
| 14 Tests | übernommen (A27–A29) | Der Testumfang ist zugleich der „Teil einer Folge“ aus B16 |
| 15 Freigabe | übernommen (A31), angepasst (A30) | Claude kann nicht hören, das Abhören übernimmt der Nutzer (W21) |
| 16 Schlussregel | übernommen (A6) | – |
| Kopf: „Claude Opus“, „drei wiederkehrende Charaktere“, „zwölf Folgen“ | nicht übernommen | Kein Modellname in Projektdateien. Gäste, Harms und 12–25 Folgen sind beschlossen (W18, W19). |
| Beispiel-JSON mit `"model_id": "eleven_v4"` | nur als Schema verstanden, nicht übernommen | Die genaue Modell-ID ist nicht bestätigt (F9, A9) |
