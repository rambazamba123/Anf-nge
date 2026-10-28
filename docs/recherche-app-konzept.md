# Recherche: Ziele, Aufbau und Lernforschung für Skipper

Stand 27.10.2026. Auftrag des Nutzers vom 27.10.2026:
- den ganzen Verlauf, das Repo und die frühen Dateien lesen
- die Ziele der App und jeder Funktion herausfiltern
- den heutigen Aufbau damit abgleichen
- grundsätzliche Verbesserungen und frühe Weichen finden
- mehrere Konzepte vorschlagen, möglichst wissenschaftlich belegt

**Grundlage:**
- 77 Nachrichten des Nutzers vom 05.10. bis 27.10.2026
- die ersten Fassungen von `CLAUDE.md` (04.10.) und `docs/archiv/claude-v3.md`
- `docs/konzept-architektur.md` (05.10.) und `docs/archiv/claude-nachtrag-lauf3.md`
- der Code in v4.94 und die Bildschirmfotos des Rauchtests
- Websuche nach Studien (Liste der Quellen ganz unten)

Nichts davon ist schon beschlossen. Die Nummern dienen zum Kommentieren:
- **Z** = Ziel
- **U** = Unstimmigkeit
- **Q** = Befund aus der Forschung
- **N** = Weiche (früh stellen)
- **O** = offene Frage

## 0. Kurzfassung

1. Die App hat sich vom Fragen-Trainer mit Boot zum **Kurs-Ersatz mit Crew** entwickelt. Der Aufbau ist mitgewachsen, aber nicht neu geordnet worden. Es gibt heute zu viele gleichrangige Einstiege (U1).
2. Die Lernlogik passt sehr gut zur Forschung: Abrufen, verteilt wiederholen, kleine Happen, Farben, Vorab-Fragen. Hier muss man wenig ändern, nur fein schleifen (Q1–Q3, N7).
3. Die Vision „Boot erleben, Crew kennenlernen, dann lernen“ ist wissenschaftlich gut gedeckt. Erst die Teile des Bootes kennen, dann die Abläufe: Das ist das Vorwissens-Prinzip (Q4). Warm und süß gestaltete Lernbilder verbessern das Behalten messbar (Q10).
4. Geschichten helfen nur, wenn sie den Stoff tragen. Ausschmückungen ohne Bezug zum Stoff schaden messbar (Q7). Der Schwenk von der Geschichte zum Coaching (E12) und die Zusatzfolgen für Garn (B156) sind deshalb richtig.
5. Die größte Gefahr für doppelte Arbeit: drei Abspiel-Systeme und Inhalte, die an mehreren Stellen gepflegt werden. Die beiden wichtigsten Weichen sind deshalb ein **Szenen-Player für alles Gesprochene** (N1) und **eine gemeinsame Wissensbasis je Schein** (N2).
6. Vier Konzepte (A–D) stehen in Abschnitt 5. Empfehlung: D sofort (aufräumen), danach A, B und C kombiniert in Stufen.
7. Prüfauftrag O58: Die weiße Tafel mit rotem Rand und schwarzem Punkt heißt „Gebot, Schallsignal zu geben“. Das steht in der Seeschifffahrtsstraßen-Ordnung, Anlage I, Zeichen A.12, und in der Binnenschifffahrtsstraßen-Ordnung, Anlage 7, Zeichen B.7. Der Satz in der Probefolge stimmt also. Claudes Einwand vom 25.10. war falsch.

## 1. Ziele aus dem Verlauf

| Nr | Ziel | Wann und wie gesagt |
|---|---|---|
| Z1 | Vorbereitung auf die Bootsscheine SBF See, SBF Binnen, SKS, SRC/UBI und FKN bis zur Prüfungsreife | seit 04.10.; Liste der Scheine bestätigt am 27.10. |
| Z2 | Der Kajütenfunk ersetzt den Kurs, „wie ein perfekter Theoriekurs“. Er erklärt auch Grundwissen über Seemannschaft und Segeln. | 19.10. („soll einen solchen Kurs ersetzen“), 22.10., 27.10. |
| Z3 | Es soll sich nicht wie eine Lern-App anfühlen. Man steigt in ein Boot ein, erkundet es und sieht genau, wie es aufgebaut ist. | 04.10. („Erkunden wie bei Moorhuhn“, „Unter Deck im Schnitt“), Vision 27.10. |
| Z4 | Die Crew ist ein Coaching-Team, man lernt mit ihr. Es soll sich wie ein Gespräch anfühlen, mit derbem und doppeldeutigem Humor (ab 12). | 22.10., 27.10. |
| Z5 | Die Crew findet am Anfang heraus, wie man lernen will. Das Lernen richtet sich nach Schein, Termin und Zeit. | V42 (23.10.), Vision 27.10. |
| Z6 | So schnell wie möglich und effizient durch die Prüfung, in kleinen Happen | 22.10. |
| Z7 | Prüfungstreue: nur amtliche Inhalte, Bilder genau wie in der Prüfung, Signale im Prüfungsformat | 04.10., 10.10. |
| Z8 | Offline nutzbar, kaum laufende Kosten. Alles Feste wird einmal erzeugt, die KI ist nur Zusatz. | 05.10. |
| Z9 | Wartungsarm, kein Umbau auf ein anderes Framework | 05.10. |
| Z10 | Übersichtlich, aufgeräumt, weniger Untermenüs | 10.10., 27.10. |
| Z11 | Warm, flach, gezeichnet, freundlich und „süß“ (Pettersson und Findus, Janosch) | 04.10., 27.10. |
| Z12 | Fertig ist die App mit Podcast-Folgen, Manöver- und Knotenspiel und den Fragen. | 27.10. |
| Z13 | Zielgruppe ab 12 Jahren bis ins hohe Alter | 27.10. |
| Z14 | Geld: am 05.10. „kostenlos, kosmetische Skins kaufbar“; am 27.10. „Bezahl-App“ | Widerspruch, siehe O72 |

**Ziele je Bereich**

| Bereich | Ziel laut Nutzer | Heute im Code | Abstand |
|---|---|---|---|
| Start und Kennenlernen | Crew kennenlernen, Schein, Termine und Zeit wählen; die Crew findet heraus, wie man lernen will | Streit-Intro, Gespräch mit Knöpfen, V42 | Vorwissen und Lernweise werden nicht erfragt (N8) |
| Deck und Boot | Startpunkt, Boot erleben und erkunden, Eggs | Ein Boot mit Eggs, darunter Kurs für heute, Rennen und Countdown | Erkunden ist heute vor allem Easter-Egg-Suche, das Boot erklärt sich nicht selbst |
| Kajüte | Alles zum Lernen hängt im Raum und lässt sich antippen | Lernwand mit Karte, Manöverbrett, Knotenbrett, Bücher, Telefon, Hocker | passt; aber Einführungen kommen als lange Textkästen |
| Kajütenfunk | Kurs-Ersatz zum Hören, Auto- und interaktiver Modus, alle Fragen mindestens einmal, Fragerunde am Ende | Probefolge, Player mit Erzeugen, Auto/Interaktiv, Vertiefung | Probehören mit Gratis-Stimme fehlt (N3); Fragerunde, Hörkarten und Nachhilfe-Folge noch nicht gebaut |
| Theorie-Fragen | Amtlich, Farben, Easy/Tricky, Happen zu 8, Merksätze | gebaut (V35–V38) | Feinschliff (N7) |
| Navigation | Basics für Anfänger, macht Spaß, realistisch; neu: Audio in Häppchen zum Mitmachen, kleine Animationen, reduzierte Übungskarte | Lernpfad mit 12 Lektionen, Werkzeugkunde, Arbeitsblatt, volle Karte | Zu viele Werkzeuge auf einmal, Anleitung nur als Text (Q5, N1) |
| Manöver | Nach der Prüfungsrichtlinie, Vorführung, Kommandos, Ein-Finger-Steuerung | gebaut (V23, V39) | passt |
| Knoten | Echte Tau-Animation, Brett, Spiel, Übung mit echtem Tau | gebaut (V12, V25) | passt; Ansicht „aus meiner Sicht“ wäre ein Gewinn (Q11) |
| Zeichen und Lexikon | Alle Zeichen in Originalgrafik (04.10.); neu: Dokument mit allen Zeichen, im Kurs gezeigt, prüfungsrelevant markiert | Lexikon, Seezeichen-Kurs, Katalogbilder | Zeichen liegen an mehreren Stellen, eine gemeinsame Liste fehlt (N2) |
| Törn | Wissen anwenden, Spaß, Bonusrunden; ausdrücklich nicht mit dem Kurs vermischt (10.10.) | Törn 2.0, 100 KB Code | steht nicht mehr in der Fertig-Definition (O74) |
| Spielekiste | Nur Spaß, Rekorde nur dort | gebaut | passt |
| Harms | Probeprüfung am Telefon | gebaut | passt |
| Einstellungen | neu: Seite „Geräusche“ (anhören, grün = benutzt mit Zweck, rot = unbenutzt) | lange Liste mit KI-Schlüsseln und Entwickler-Werkzeugen | Für Laien zu technisch; Entwickler-Teil abtrennen |

## 2. Abgleich: Was gut passt und wo es hakt

**Was schon gut passt:**
- Lernlogik: Farben, Phasen, Happen zu 8, Easy/Tricky, Kurs für heute, Termine (V42).
- Kajüte als Lernraum.
- Gestaltung im warmen, gezeichneten Stil.
- Knoten-Animationen und Manöverspiel nach der Richtlinie.
- Offline-Prinzip und Stimmenpaket.
- Im interaktiven Kajütenfunk unterbrechen Fragen das Zuhören. Das hilft nachweislich gegen Abschweifen (Q13).

**Unstimmigkeiten:**

| Nr | Was hakt | Folge |
|---|---|---|
| U1 | Es gibt viele gleichrangige Einstiege: Kurs für heute an Deck, Kajüte mit 11 Stellen, Meine Prüfungen (dreimal erreichbar), Navigationsschule mit 6 Menüpunkten, Seezeichen-Kurs, Kajütenfunk am Hocker, Logbuch, Spielekiste, Törn am Steuer, Lexikon, Einstellungen. | Neue Nutzer wissen nicht, was zuerst kommt (Z10). |
| U2 | Der Kajütenfunk soll den Kurs ersetzen, aber Navigation, Knoten, Manöver und Seezeichen haben jeweils eigene Lektionen. Es fehlt ein roter Faden, in den alles eingehängt ist. | Doppelte Erklärungen, Lücken zwischen Hören und Üben |
| U3 | Wissen wird mehrfach gepflegt: Merksätze stehen in `karten-sbf.json` und in den Folgenskripten. Zeichen stehen im Lexikon, in `seezeichen.json` und in den Katalogbildern. Dazu kommen Begriffe in Navi-Fibel, Lexikon und Wortschatz. | Mit SKS, Funk und Pyro vervielfacht sich die Pflege. |
| U4 | Es gibt drei Systeme zum Sprechen: feste Sätze (Stimmenpaket), Kajütenfunk-Player (Text to Dialogue) und Hörprobe/Casting. Die Einführungen der Crew sind Textkästen. Die Navi-Anleitung soll Audio bekommen. | Ohne Entscheidung entsteht für die Navi-Anleitung ein viertes System. |
| U5 | Fortschritt wird mehrfach angezeigt: Rennen, Theorie in Prozent, Kuchen, Kapitel im Logbuch, Phase x von 3, Happen-Punkte, Countdown. | Zu viele Zahlen, wenig Gefühl von „Ich komme voran“ |
| U6 | Die Zielgruppe reicht bis ins hohe Alter, aber Erklärtexte sind klein (Klasse `.small` = 0,9 rem, etwa 14 px), und Karte und Zirkel verlangen feine Gesten. | Ältere Nutzer scheitern an der Bedienung, nicht am Stoff (Q18). |
| U7 | Der Kajütenfunk wird etwa 560 MB groß (Konzept §17), dazu kommen SKS, Funk und Pyro. Alles liegt im Git-Repo, jede Neuvertonung bleibt dauerhaft in der Versionsgeschichte. | Das Repo wird schwer, GitHub Pages hat Grenzen (N4). |
| U8 | Geld: kostenlos mit Skins (05.10.) oder Bezahl-App (27.10.). Dazu ist das Repo öffentlich. | Das entscheidet über Konten, Freischaltung und Store-Weg (N5). |
| U9 | Die Einstellungen mischen Nutzer-Dinge mit Entwickler-Werkzeugen (KI-Schlüssel, Stimmenpaket, Casting, Hörprobe). | unübersichtlich für normale Nutzer |
| U10 | „Falsch + Easy“ zählt heute als Vertipper, nicht als Fehler. Die Forschung zeigt: Sichere Irrtümer sind oft echte Irrtümer und lassen sich mit Rückmeldung besonders gut korrigieren (Q14). | Echte Wissenslücken bleiben unentdeckt (N7). |

## 3. Was die Forschung sagt

Bei jeder Studie steht die Herkunft. Wo nur eine Zusammenfassung zugänglich war, steht das dabei. Effektgrößen sind Richtwerte: d oder g = 0,2 heißt klein, 0,5 mittel, 0,8 groß.

| Nr | Befund | Beleg | Was das für Skipper heißt |
|---|---|---|---|
| Q1 | Selbst abfragen und verteilt wiederholen sind die zwei Lerntechniken mit dem höchsten Nutzen, über alle Altersgruppen. Wiederlesen, Markieren und Zusammenfassen bringen wenig. | Dunlosky et al. 2013 | Die Fragen-Engine ist der Kern. Hören allein reicht nicht, jede Folge braucht Abruf. |
| Q2 | Der beste Abstand zwischen Wiederholungen hängt davon ab, wie lange man das Wissen braucht: etwa 20–40 % der Zeit bis zum Test bei einer Woche, 5–10 % bei einem Jahr. | Cepeda et al. 2008 | Wiederholungsabstände am Prüfungstermin ausrichten, der aus V42 bekannt ist (N7). |
| Q3 | Wer vor dem Lernen eine Frage zu beantworten versucht, lernt danach besser, auch wenn die Antwort falsch war. | Richland, Kornell & Kao 2009; Übersicht Pan & Carpenter 2023 (nur Titel geprüft) | Vorab-Fragen im Kajütenfunk sind richtig; dazu eine Einstufung beim Kennenlernen (N8). |
| Q4 | Wer die Teile und Begriffe eines Systems vorher kennt, versteht danach die Abläufe besser (Vorwissens-Prinzip). Mittlerer Effekt laut Mayer etwa d = 0,85. | Mayer, Mathias & Wetzell 2002; Mayer, Multimedia Learning | Erst das Boot kennenlernen (Teile, Orte, Begriffe), dann Regeln und Manöver. Das Bauteile-Spiel gehört an den Anfang, nicht nur in die Spielekiste. |
| Q5 | Komplexes lernt man besser, wenn man die Teile erst einzeln und dann zusammen übt. Oberflächen, die für Anfänger Funktionen sperren, verkürzen die Lernzeit um 21–26 %, und man lernt mehr. | Pollock, Chandler & Sweller 2002; Carroll & Carrithers 1984 (Zahlen laut Nielsen) | Bestätigt die Idee des Nutzers für die Navigation: erst eine Mini-Karte mit einer Tonne und einem Werkzeug, Werkzeuge nach und nach freischalten. |
| Q6 | Freies Entdecken ohne Hilfe lernt schlechter als Erklären (d = −0,38). Geführtes Entdecken mit Rückmeldung und Beispielen lernt besser (d = +0,30). | Alfieri et al. 2011 | Das Boot erkunden als geführte Erkundung: Die Crew zeigt und fragt, man tippt mit. Eggs bleiben Bonus. |
| Q7 | Spiele mit Geschichte lehrten in Versuchen schlechter als gleich gute Folien (Behalten d = 1,37). Interessante, aber stofffremde Ausschmückungen schaden (g = −0,33). | Adams et al. 2012; Rey 2012; Sundararajan & Adesope 2020 | Geschichte und Witz eng am Stoff. Garn ohne Lernbezug gehört in die Zusatzfolgen (B156). Der Schwenk zum Coaching war richtig. |
| Q8 | Persönliche Ansprache („du“, „ich“) wirkt freundlicher und hilft beim Verstehen. | Ginns, Martin & Marsh 2013; Mayer | Die Crew spricht den Lernenden direkt an. Das ist schon so. |
| Q9 | Lernfiguren (Agenten) haben einen kleinen, aber echten Nutzen (g etwa 0,2–0,4). | Schroeder, Adesope & Gilbert 2013; zwei Meta-Analysen von 2021 | Die Crew lohnt sich. Der Nutzen kommt aber aus guten Erklärungen, nicht aus den Figuren allein. Die Figuren dürfen nicht vom Stoff ablenken. |
| Q10 | Freundliche Farben und runde, gesichtsartige Formen in Lernbildern verbessern Behalten, Verstehen und Lust am Lernen (etwa d 0,3–0,4). | Brom, Stárková & D'Mello 2018 (Zahlen aus einer Zweitquelle); Wong & Adesope 2021 | „Warm und süß“ ist belegt. Den Stil bis in die Menüs tragen (N6). |
| Q11 | Bei Handgriffen wie Knoten lernt man aus Animationen mehr als aus Einzelbildern. Videos aus der eigenen Sicht (Ich-Perspektive) lehren genauer als Videos von außen. | Ayres et al. 2009 (Knoten); Fiorella et al. 2017 | Die Knoten-Animationen sind der richtige Weg. Neu wäre: Knoten zusätzlich „aus meiner Sicht“ zeigen. |
| Q12 | Gedankliches Üben verbessert die Leistung, aber nur wenig (neuere Auswertung r = 0,13). | Driskell, Copper & Moran 1994 und Nachfolgestudie | Manöver-Vorführung und Kopfkino bereiten vor, ersetzen aber keine Praxis. Das sagt die Crew ehrlich. |
| Q13 | Beim Zuhören schweift man öfter ab als beim Lesen und behält weniger. Eingestreute Fragen halbieren das Abschweifen und verbessern das Lernen. | Varao Sousa, Carriere & Smilek 2013; Szpunar, Khan & Schacter 2013 | Jede Folge braucht alle zwei bis drei Minuten eine aktive Stelle. Ansagen wie „Aufgepasst, Prüfungsstoff!“ (B153) lenken die Aufmerksamkeit. |
| Q14 | Irrtümer, bei denen man sich sicher war, werden nach einer Rückmeldung besonders gut korrigiert (Hyperkorrektur). | Butterfield & Metcalfe 2001, vielfach bestätigt | „Falsch + Easy“ als Fehler zählen und besonders deutlich auflösen (N7). |
| Q15 | Für Lernstile („visuell“, „auditiv“) gibt es keinen Beleg: Unterricht passend zum Lerntyp verbessert das Lernen nicht. | Pashler et al. 2008 | „Die Crew findet heraus, wie man lernen will“ meint deshalb Ziel, Zeit, Vorwissen, Lernort (unterwegs hören oder am Tisch üben) und Ton. Gemischt aus Hören, Sehen und Tun wird für alle. |
| Q16 | Lernspiele lehren etwas besser als normaler Unterricht (d = 0,29). Sie wirken stärker zusammen mit Erklärung und über mehrere Sitzungen, motivieren aber nicht automatisch mehr. Spielelemente wie Punkte wirken klein bis mittel. | Wouters et al. 2013; Sailer & Homner 2020 | Spiele direkt an die passende Erklärung koppeln, zum Beispiel Lichterspiel nach der Lichter-Folge. Rekorde und Trophäen sind Würze, nicht Motor. |
| Q17 | Schritt-für-Schritt-Rückmeldung am Rechner wirkt fast so gut wie Einzelunterricht durch einen Menschen (d = 0,76 gegen 0,79). | VanLehn 2011 | Die Navigation mit Rückmeldung je Teilschritt ist richtig. Die Live-KI ist ein Zusatz, nicht nötig. |
| Q18 | Ältere Menschen treffen kleine Tippflächen viel seltener (bei 4,9 mm etwa 62 % Fehler, Jüngere etwa 25 %). | Sultana & Moffatt 2019 (Zusammenfassung); WCAG 2.2 | Tippflächen etwa 10 mm und größer, Schalter für große Schrift, keine Präzisionsgesten nötig (N6). |
| Q19 | Moderne künstliche Stimmen lehren etwa so gut wie menschliche. Alte, roboterhafte Stimmen schneiden schlechter ab. | Craig & Schroeder 2017 (Zweitquellen) | Die Gratis-Handystimme taugt zum Probehören. Für alle Lernenden die gute Stimme (v4). |
| Q20 | Wissen an Orte zu hängen (Loci-Methode) hilft beim Behalten (g = 0,65), allerdings mit Bias-Risiko in den Studien. | Twomey & Kroneisen 2021 | Eine schwache, aber passende Stütze dafür, Themen an Orte im Boot zu hängen (Konzept B). |
| Q21 | Vermischtes Üben hilft beim Unterscheiden ähnlicher Dinge (g = 0,42), besonders bei Bildern. | Brunmair & Richter 2019 | Lichter, Tonnen, Tafeln und Signale gemischt abfragen, nicht blockweise. Die Fragerunde mischt auch frühere Folgen. |

## 4. Prüfauftrag O58: Tafel mit schwarzem Punkt

- **Seeschifffahrtsstraßen-Ordnung, Anlage I, A.12 „Abgabe von Schallsignalen“:**
  - Wortlaut: „Gebot, an dieser Stelle das in der zusätzlichen Tafel angegebene Schallsignal zu geben: quadratische weiße Tafel mit rotem Rand und einem schwarzen Punkt.“
  - Dort steht auch A.7 (Haltegebot vor beweglichen Brücken, Sperrwerken und Schleusen): „quadratische weiße Tafel mit rotem Rand und einem waagerechten schwarzen Strich“.
- **Binnenschifffahrtsstraßen-Ordnung, Anlage 7, B.7 „Gebot, Schallzeichen zu geben“:**
  - amtliche Abbildung: weiße Tafel, roter Rand, schwarzer Punkt
  - B.5 (Haltegebot) ist dieselbe Tafel mit schwarzem Balken.
- **Grundregel (SeeSchStrO, Anlage I, b):**
  - Gebotszeichen: „rechteckige weiße Tafeln mit rotem Rand und schwarzem Symbol im weißen Mittelfeld“.
  - Verbotszeichen haben zusätzlich einen roten Schrägstrich.
  - Warn- und Hinweiszeichen sind „meistens blau“.
  - Diese Grundregel gehört an den Anfang des Zeichen-Themas.
- **Ergebnis:** Der Satz in der Probefolge („Ein schwarzer Punkt hieße: Schallsignal geben“) ist richtig und bleibt (B150).
- **Geprüft:** am Gesetzestext über den Spiegel von gesetze-im-internet.de im Projekt „bundestag/gesetze“ auf GitHub, nicht am ELWIS-Original in `quellen/` (R8).

## 5. Vier Konzepte

### Konzept A „Ausbildungstörn“: die Zeit ist das Rückgrat
- **Idee:**
  - Der Kurs ist eine Reise in Seetagen, ein Seetag ist eine Sitzung nach der eigenen Lernzeit.
  - Ablauf eines Seetags: Morgenrunde (Wiederholen, 5 Minuten), Kajütenfunk-Folge, passende Station (Knoten, Karte, Manöver, Lichterspiel), Abendrunde (die Fragen der Folge als Multiple Choice), Logbuch.
  - Die Reihenfolge kommt aus dem Kursplan, das Tempo aus dem Prüfungstermin.
- **Auf dem Bildschirm:** ein Knopf „Seetag 7: Lichter bei Nacht“, sonst nichts Nötiges.
- **Belege:** Q1, Q2, Q13, Q16. Erklärung, Übung und Abruf liegen am selben Tag.
- **Stärke:** Das ist am nächsten an einem echten Kurs (Z2) und am leichtesten zu verstehen.
- **Schwäche:** Der Weg ist fest vorgegeben, Erfahrene langweilen sich. Abhilfe: Einstufung (N8) und Seetage überspringen.
- **Umbau: mittel.** Kursplan, Stationen und Kurs für heute gibt es schon. Neu ist die Klammer „Seetag“ mit fester Kopplung Folge → Station → Fragen.

### Konzept B „Das Boot ist der Lehrplan“: der Raum ist das Rückgrat
- **Idee:** Jedes Thema wohnt an einem Ort im Boot, gezeigt als Boot im Schnitt (Wunsch seit 04.10.):
  - Mast und Topp: Lichter, Signalkörper
  - Bug: Anker, Ankerlieger
  - Steuerstand: Ausweichregeln, Manöver
  - Kartentisch: Navigation, Gezeiten
  - Funkecke: SRC/UBI
  - Heck mit Rettungsmitteln: Pyro, Seenot
  - Maschinenraum: Motor, Tanken
  - Knotenbrett: Knoten
  - Bücherbord: Recht, Umwelt
- **Ablauf:** Die Crew führt durch das Boot. Erst Teile und Begriffe, dann öffnet jeder Ort seine Folge, Fragen und sein Spiel. Den Fortschritt sieht man am Boot selbst: Lampen gehen an, Leinen liegen ordentlich aufgeschossen.
- **Belege:** Q4, Q6, Q10, Q20.
- **Stärke:** Das ist am nächsten an der Vision (Z3, Z11), und man versteht das echte Boot. Neue Scheine bekommen neue Orte, zum Beispiel die Funkecke.
- **Schwäche:** Aufbauende Themen brauchen trotzdem eine Reihenfolge, die Crew muss den Weg vorschlagen. Das Schnitt-Boot ist viel Zeichenarbeit.
- **Umbau: groß bei der Grafik, mittel im Code.** Das Prinzip der Kajüten-Stationen wird auf das ganze Boot übertragen.

### Konzept C „Gespräch mit der Crew“: der Dialog ist das Rückgrat
- **Idee:**
  - Die App ist ein Gespräch. Beim Öffnen begrüßt die Crew, sagt, was heute dran ist, und man antwortet mit Knöpfen wie im Kennenlernen.
  - Der Stoff kommt als Szene (Ton und Text). Werkzeuge öffnen sich mitten im Gespräch (Karte, Knoten, Frage) und schließen danach wieder.
  - Menüs werden zu Bitten an die Crew: „Ich will Knoten üben.“
- **Belege:** Q8, Q9, Q13, Q17.
- **Stärke:** Das ist am nächsten an „Gespräch mit der Crew“ (Z4). Die Navi-Anleitung zum Mitmachen ergibt sich von selbst.
- **Schwächen:**
  - Für schnelles Pauken ist es langsamer, es braucht einen Schnellweg „nur Fragen“.
  - Mehr Ton heißt mehr Credits.
  - Es darf kein Chatbot-Gefühl entstehen (05.10.), also feste, gut geschriebene Szenen statt KI.
- **Umbau: mittel bis groß.** Es braucht den Szenen-Player (N1).

### Konzept D „Kurs und Hafen“: Aufräumen ist das Rückgrat
- **Idee:**
  - Es gibt zwei klar getrennte Welten. Der „Kurs“ ist geführt: ein Knopf, alles Prüfungsrelevante in Reihenfolge, Fortschritt in Prozent. Der „Hafen“ ist frei: Boot erkunden, Eggs, Törn, Spielekiste, Lexikon.
  - Auf dem Startbildschirm ist das Boot mit genau zwei großen Wegen.
  - Einstellungen und Entwickler-Werkzeuge liegen hinter dem Zahnrad.
- **Belege:** Q5 (weniger Auswahl am Anfang).
- **Stärke:** schnell gemacht und sofort übersichtlicher (Z10).
- **Schwäche:** Das Erlebnis ist weniger aus einem Guss. Der Kurs bleibt „App“, das Boot bleibt „Spiel“.
- **Umbau: klein.**

### Empfehlung
- **D sofort**, weil es billig ist und das Aufräumen ohnehin nötig ist.
- **Danach in Stufen A + B + C:**
  - Das Rückgrat sind die Seetage (A).
  - Jeder Seetag spielt an einem Ort des Bootes, und das Boot zeigt den Fortschritt (B).
  - Jeder Seetag ist eine Szene mit der Crew, in der sich die Werkzeuge öffnen (C).
- **So sieht die Vision dann aus:**
  1. Einsteigen.
  2. Die Crew kennenlernen und eine kurze Einstufung machen.
  3. Seetag 0 „Das Boot“ (Vorwissen, Q4).
  4. Seetag für Seetag bis zur Prüfungsreife, im Hafen frei spielen.

## 6. Weichen, die man früh stellen sollte

| Nr | Weiche | Warum früh |
|---|---|---|
| N1 | **Ein Szenen-Format und ein Player** für alles Gesprochene: Kajütenfunk, Einführungen der Crew, Navi-Anleitung, Manöver-Einweisung, Kennenlernen. Grundlage sind die Folgenskripte. Dazu kommen Befehle wie „zeige Bild“, „öffne Zirkel“ und „warte, bis getippt“. | Sonst entsteht für die Navi-Anleitung ein viertes System (U4). |
| N2 | **Eine Wissensbasis je Schein.** Sie verbindet Thema, Baustein, amtliche Fragen, Zeichen-Bild, Merksatz, Erklärung, Lexikon-Eintrag, Folge mit Stelle und Station. Darin steckt der **Zeichen-Atlas** mit allen Zeichen aus dem Dokument des Nutzers, mit „prüfungsrelevant ja/nein“ und Schein. Alle Bereiche lesen aus dieser einen Quelle. | Vor SKS, Funk, Pyro und vor dem Schreiben aller Folgen (U3). |
| N3 | **Probehören mit Gratis-Stimme im Player.** Jede Folge lässt sich ohne Credits vorlesen (Handystimme). | Der Nutzer will alle Folgen erst so prüfen (B147). Dafür muss das stehen, bevor die Folgen kommen. |
| N4 | **Ablage der Tondateien:** nicht dauerhaft ins Git-Repo, sondern zum Beispiel als Dateien in GitHub-„Releases“ oder bei einem Speicher-Dienst. Folgen werden einzeln geladen, die Namen bleiben fest. | Vor der ersten echten Vertonung (U7). |
| N5 | **Geldmodell klären** (O72). Davon hängen ab: Konten, Freischaltung, Store-Weg, öffentliches oder privates Repo. | Prägt die Technik dahinter, nur die Entscheidung ist jetzt nötig. |
| N6 | **Gestaltungsregeln für die ganze App:** Schriftgrößen mit Schalter „Große Schrift“, Tippflächen ab etwa 10 mm, Farben, Figuren-Bausteine. Menüs werden zu Gegenständen an Bord (Logbuch als Buch, Prüfungen als Mappe). | Vor dem Umbau der Bildschirme (U5, U6, Q10, Q18). |
| N7 | **Feinschliff der Fragen-Engine:** „Falsch + Easy“ zählt als Fehler (Q14). Ähnliche Themen werden gemischt abgefragt (Q21). Der Abstand der Wiederholungen richtet sich nach dem Prüfungstermin (Q2). | Jetzt, solange es wenige Spielstände gibt (R7 bleibt gewahrt). |
| N8 | **Einstufung im Kennenlernen:** 10–15 gemischte Fragen, etwa drei Minuten. Die Crew weiß dann, wo man steht, Erfahrene überspringen Seetage. Die Vorab-Fragen fördern zugleich das Lernen (Q3). | Prägt den Kurs-Ablauf (Konzept A). |
| N9 | **Crew-Texte der App** überarbeiten (neuer Ton, W1 doppeldeutig) und mit der Neuvertonung in v4 (O38) **in einem Durchgang** vertonen, vorher mit der Gratis-Stimme prüfen (B163). | Credits nur einmal ausgeben |
| N10 | **Fachliche Abnahme** durch eine Segellehrerin, einen Segellehrer oder einen Prüfer vor der Veröffentlichung | Der Kurs ersetzt einen Kurs (Z2), es geht um Haftung (E13) und Vertrauen. |

## 7. Wenn Geld keine Rolle spielt
- **Illustration und Animation:** eine Illustratorin oder ein Animator für die Figuren, die Katze und die Zigarre, zum Beispiel mit Rive (interaktive Figuren). Claude kann Zeichnungen und Animationen im Code bauen. Lebendige Figuren-Animation auf Profi-Niveau bleibt eine Grenze.
- **Fachlektorat:** durch einen Prüfer oder eine Segelschule (N10).
- **Tests mit echten Lernenden:** fünf Leute je Runde, beobachten, wo sie hängen bleiben.
- **Barrierefreiheit:** Prüfung für Ältere und Menschen mit Sehschwäche.
- **Segelschulen als Partner:** für die Praxis auf dem Wasser, die keine App ersetzt (Q12).

## 8. Offene Fragen
- **O71 Konzept:** A, B, C, D oder die Empfehlung, also D sofort und dann A + B + C in Stufen?
- **O72 Geld:** „kostenlos mit kosmetischen Käufen (Skins)“ (05.10.) oder „Bezahl-App“ (27.10.)? Und soll das Repo privat werden (heute öffentlich, der Code ist für alle sichtbar)?
- **O73 Weichen:** N1–N10 alle freigeben oder nur einzelne?
- **O74 Törn:** Er steht nicht in der Fertig-Definition. Bleibt er im Hafen, wie er ist, oder wird er Teil der Seetage?
- **O75 „Falsch + Easy“:** künftig als Fehler zählen (N7)?
- **O76 Gratis-Stimmen:** Ist die Handystimme gemeint (kostenlos, klingt künstlich) oder etwas anderes?

**Antworten (27. und 28.10.2026):** stehen in `VISION.md` §13. Die Richtung ist: Kern behalten, dünne Reise, aufräumen, App gratis plus Starter-Set; offen ist noch O88–O92 in `VISION.md` §14.

## 9. Neue Vorgaben vom 25.–27.10.2026 (nicht Podcast)
Sie kommen im nächsten Schritt in `CLAUDE.md`. Die Beschlüsse zum Podcast stehen in `PODCAST_STATUS.md` als B141–B163.
- **Ziel und Zielgruppe:** Vorbereitung auf alle Bootsscheine, ab 12 bis ins hohe Alter. Kajütenfunk und App sind gleich wichtig, der Kajütenfunk ist ein Teil der App und ersetzt den Kurs.
- **Fertig ist die App mit:** Podcast-Folgen, Manöverspiel, Knotenspiel und den Fragen.
- **Die ganze App** wird übersichtlicher, mit weniger Unterpunkten und Untermenüs. Geändert wird nur in Absprache (O63).
- **Geräusche:** Alle Audiodateien sind von Pixabay. Unbenutzte Dateien nur nach Rückfrage weglassen.
- **Neue Seite in den Einstellungen „Geräusche“:** jedes Geräusch anhören; grün = benutzt (mit Zweck), rot = unbenutzt.
- **Hinnerk** stopft und zündet ab und zu seine Zigarre, in der Kajüte, als Animation und im Podcast, mit neuen Rauch- und Feuerzeug-Geräuschen.
- **Die Katze** wird besser animiert und läuft manchmal süß herum, mit neuen Katzen-Geräuschen.
- **Navigation:** ein neues Konzept gemeinsam erarbeiten. Dazu gehören Crew-Audio in kleinen Häppchen zum Mitmachen, kleine Animationen für den nächsten Schritt und eine reduzierte Übungskarte. Der Nutzer schaut sich das Werkzeug noch an.
- **Funkscheine (SRC/UBI):** Die Unterlagen hat der Nutzer hochgeladen. Im Repo und in der Cloud-Sitzung sind sie nicht angekommen (Stand 27.10., letzter Push auf GitHub am 24.10.).
- **Stimmen:** Alles Neue in der App spricht vorerst die Gratis-Stimme. Neue feste Sätze werden gebündelt.
- **Arbeitsweise:** Vor jeder Änderung stimmt sich Claude mit dem Nutzer ab. Aufräumen ist erlaubt (O48).

## Quellen
- Dunlosky et al. 2013, Psychological Science in the Public Interest 14(1): [APS-Pressemitteilung](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html)
- Cepeda, Vul, Rohrer, Wixted & Pashler 2008, Psychological Science: [PubMed](https://pubmed.ncbi.nlm.nih.gov/19076480/)
- Richland, Kornell & Kao 2009 und Pan & Carpenter 2023: [Übersicht Pretesting-Effekt](https://learning.subwiki.org/wiki/Pretesting_effect), [Studie 2025 mit Literatur](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12292081/)
- Mayer, Mathias & Wetzell 2002 und Vorwissens-Prinzip: [Cambridge, Pretraining Principle](https://www.cambridge.org/core/books/abs/multimedia-learning/pretraining-principle/01791D57F5D4164251269E6DF56A8BF1)
- Pollock, Chandler & Sweller 2002, Learning and Instruction: [UOW](https://ro.uow.edu.au/edupapers/145)
- Carroll & Carrithers 1984: [Nielsen Norman Group](https://www.nngroup.com/articles/training-wheels-user-interface/), [ACM](https://cacmb4.acm.org/magazines/1984/8/10472-training-wheels-in-a-user-interface)
- Alfieri et al. 2011: [Volltext (PDF)](https://www.fisme.science.uu.nl/publicaties/literatuur/2011_alfieri_discovery_learning.pdf)
- Adams et al. 2012: [Volltext (PDF)](https://tecfa.unige.ch/tecfa/maltt/VIP/Ressources/Articles/AdamsMayer_NarrativeGames.pdf)
- Rey 2012; Sundararajan & Adesope 2020: [WSU-Pressemitteilung](https://news.wsu.edu/press-release/2020/03/19/seductive-details-inhibit-learning), [WSU-Eintrag](https://rex.libraries.wsu.edu/esploro/outputs/journalArticle/Keep-it-Coherent-A-Meta-Analysis-of/99900601155501842)
- Ginns, Martin & Marsh 2013: [Western Sydney University](https://researchers.westernsydney.edu.au/en/publications/designing-instructional-text-in-a-conversational-style-a-meta-ana/)
- Schroeder, Adesope & Gilbert 2013: [WSU](https://rex.libraries.wsu.edu/esploro/outputs/journalArticle/How-Effective-are-Pedagogical-Agents-for/99900601056901842); Meta-Analyse 2021: [SAGE](https://journals.sagepub.com/doi/ref/10.1177/07356331211041701), [Erasmus](https://repub.eur.nl/pub/133141)
- Brom, Stárková & D'Mello 2018: [Manuskript (PDF)](https://artemis.ms.mff.cuni.cz/main/papers/emodesign_manuscript_1rev_180928_FINAL_norev.pdf); Wong & Adesope 2021: [NYU-Zusammenfassung](https://ifp.nyu.edu/2020/journal-article-abstracts/s10648-020-09545-x/)
- Ayres, Marcus, Chan & Qian 2009: [UNSW](https://unsworks.unsw.edu.au/entities/publication/0521d63d-cddf-4aea-9884-89275c9adf23)
- Fiorella, van Gog, Hoogerheide & Mayer 2017: [Utrecht (PDF)](https://dspace.library.uu.nl/bitstream/handle/1874/356693/video.pdf?sequence=1)
- Driskell, Copper & Moran 1994 und Nachfolgestudie: [University of Limerick](https://pure.ul.ie/en/publications/does-mental-practice-still-enhance-performance-a-24-year-follow-u/)
- Varao Sousa, Carriere & Smilek 2013: [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3842750/)
- Szpunar, Khan & Schacter 2013, PNAS: [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/)
- Butterfield & Metcalfe 2001: [Duke](https://dukespace.lib.duke.edu/items/d6ab09ca-f55c-4efb-9d32-2788bc5838b2), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4084803)
- Pashler, McDaniel, Rohrer & Bjork 2008: [USF](https://digitalcommons.usf.edu/psy_facpub/1765/)
- Wouters et al. 2013: [Universität Utrecht](https://research-portal.uu.nl/en/publications/a-meta-analysis-of-the-cognitive-and-motivational-effects-of-seri/); Sailer & Homner 2020: [Uni Augsburg](https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056)
- VanLehn 2011: [Folien des Autors (PDF)](https://quality.mit.edu/files/2012/01/Quality-Symposium-Kurt-VanLehn.pdf)
- Sultana & Moffatt 2019: [Zusammenfassung](https://a11y-paradise.onrender.com/reviews/69cd49cca2b3ddc6f03b373e); Franz & Wobbrock 2019: [PDF](https://faculty.washington.edu/wobbrock/pubs/assets-19.06.pdf)
- Craig & Schroeder 2017: [Übersichtsartikel](https://www.doi.org/10.1007/s10639-022-11255-6)
- Twomey & Kroneisen 2021: [SAGE](https://journals.sagepub.com/doi/10.1177/1747021821993457)
- Brunmair & Richter 2019: [Preprint (PDF)](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)
- SeeSchStrO Anlage I und BinSchStrO Anlage 7: [gesetze-im-internet.de, BinSchStrO Anlage 7](https://www.gesetze-im-internet.de/binschstro_2012/anlage_7.html); gelesen über den Spiegel [bundestag/gesetze](https://github.com/bundestag/gesetze)
