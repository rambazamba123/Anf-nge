# Die Reise der Frieda: In sieben Tagen zum SBF See

> **Das ist das Fundament** für Geschichte, Orte, Lernaufbau und alle Folgen (Nutzer, 04.11.2026). Es ersetzt `gesamtplan.md`, `konzept-ausbildung.md`, `geschichte-neu.md`, `reise-konzept.md` und die Story-Entwürfe (aufgeräumt am 04.11.2026, alte Fassungen stehen in der Git-Versionsgeschichte).
> **Status:** Geschichte und Aufbau sind vom Nutzer gesetzt. Der Reiseplan (Abschnitt 8) ist ein Vorschlag zum Festschreiben. Was mit ★ markiert ist, ist mein Vorschlag und noch nicht bestätigt.
> **Werkzeuge:** Der Plan steht in `data/reiseplan.json`. `node tools/reiseplan.js` prüft ihn und schreibt die Tabelle in Abschnitt 8. Die Folgen selbst liegen in `data/welt-folgen.json`, geprüft von `tools/folgen-pruefen.js`.

## 1. Die Geschichte in Kürze
- **Ziel der Reise:** Wir bringen Smilla zu ihrem neuen Schiff. Das ist ein Segelschiff, auf dem Kapitän Harms Segelkurse gibt (★ Name „Albertine“, liegt auf der Insel Harmsoog). Dort nimmt Harms auch dir die Prüfung ab und gibt dir den Schein.
- **Warum du gebraucht wirst:**
  - Beim Anheuern sagt man dir: Du musst die Prüfung bestehen, sonst muss Hinnerk allein heimfahren.
  - Später kommt dazu: Hinnerk sieht nachts schlecht. Ohne zweiten Bootsführer darf die Frieda nachts nicht fahren.
- **Sieben Tage:**
  - Die Reise dauert sieben Reisetage. Wer frei hat und ein gutes Gedächtnis, kann sie in sieben echten Tagen durchspielen, sogar schneller.
  - Jeder Tag besteht aus mehreren Folgen und lässt sich jederzeit unterbrechen.
  - In der Praxis lernt man, so viel man will. Es darf auch mehrere Wochen dauern.
- **Bonus:**
  - Tag 0 „Anheuern“ zählt nicht als erster Tag. Er wird gesondert ausgearbeitet, „etwas richtig Gutes“.
  - Der Rückweg nach dem Ziel ist ebenfalls Bonus.
- **Ton:** gemütlich-komisch, ab 12 Jahren. Dazwischen echte Spannung: Wasserschutzpolizei, Nacht, Nebel, Sturm, Seenot.
- **Jede Folge endet mit einem Haken auf morgen:** ein Anruf, ein Wetterbericht, ein halber Satz.

**Spannungsbogen**
| Tag | Gefühl | Wendepunkt |
|---|---|---|
| 1 | Aufbruch, alles neu | Harms ruft an: „Sieben Tage.“ |
| 2 | erste Erfolge | fremder Hafen, Quirin meldet sich |
| 3 | Gewusel, Quirin | Schleuse; Andeutung zum Wrack |
| 4 | Abenteuer | Wasserschutzpolizei; Nachtfahrt erzwungen |
| 5 | Ernst | Hinnerks Geheimnis, deine erste Wache |
| 6 | Höhepunkt | Sturm, Mensch über Bord, Mayday bei Jasper |
| 7 | Ankunft | du führst, Harms prüft, Abschied |

## 2. Figuren
Die Grundzüge sind bestätigt (`podcast/figuren.md`), die Sprechweisen regelt `docs/dialog-regeln.md`.
| Figur | Rolle auf der Reise | Bogen |
|---|---|---|
| **Hinnerk** | Kapitän, Hände und Gefühl. Fährt schnell und „irgendwie“, hat Bauchregeln, die nie stehen bleiben, und raucht ab und zu Pfeife. | vom „Finger weg“ bis zum ersten „Skipper“ (Ende Tag 6); sein Geheimnis: Er sieht nachts schlecht |
| **Smilla** | Matrosin, Kopf und Regeln, fährt vorsichtig. Geht am Ziel auf Harms' Segelschiff. | von der Ungeduldigen zu der, die dir die Wache übergibt |
| **Klabauter** | Papagei, Gedächtnis und Petze, feiert Fortschritte | bleibt, wie er ist |
| **Backbord** | Bordkatze, stumm, macht Unsinn | – |
| **Harms** | Prüfer, wartet am Ziel, ruft unterwegs an, Rivale von Hinnerk | sagt am Ende einmal „Gut.“ |
| **Quirin** | Gast an Tag 3 (Schleuse, Kanal), Bayer, Quizmaster bei den Tafelzeichen | – |
| **Jasper** | Segler, glaubt immer, alles zu wissen („Ich sag immer Nord“) | Lüttoog (Tag 4/5), Seenot (Tag 6) |
| **Hafenmeister, Wasserschutzpolizei** | Gäste an einzelnen Orten | – |

**Anreden wachsen mit** (höchstens drei je Folge, ohne Namen, geschlechtsneutral):
- Tag 1–2: Landratte, Landei, Grünschnabel
- Tag 3–4: Frischling, Kielschwein, Federlos
- Tag 5–6: Wasserratte, Kompassnadel, Sturmvogel
- Tag 7: Skipper

**Hinnerks Wörter statt „freigegeben“** (je mehrere Varianten, sie werden eingesprochen):
| Stufe im Heft | Hinnerk sagt zum Beispiel |
|---|---|
| neu | „Finger weg.“ · „Guck erst mal zu.“ |
| gehört | „Hast's gehört. Nu sitzt's noch nich.“ |
| geübt | „Wird langsam.“ · „Nochmal. Einmal is Glück.“ |
| freigegeben | „Dat gehört jetzt dir.“ · „Mach du man.“ · Er zündet sich wortlos die Pfeife an. |
| sicher | „Sitzt wie 'n Webeleinstek.“ |
| eingerostet | „Da is Rost dran. Zeig nochmal.“ |

## 3. Wie gelernt wird
- **Vom Passagier zum Skipper:**
  - Tag 1 nur zuhören, Ausguck und kleine Handgriffe.
  - Tag 2 die ersten Minuten an der Pinne.
  - Tag 3 selbst steuern im Kanal.
  - Tag 4 selbst ankern.
  - Tag 5 allein Wache.
  - Tag 6 Kurs planen und im Sturm mit anpacken.
  - Tag 7 führst du.
  - Anfangs macht die Crew alles, auch das Anfunken der Häfen. Du hörst mit.
- **Erst hören, dann erleben, abends abfragen:**
  - Was du tun musst, hast du vorher gehört, oft schon an einem früheren Tag.
  - Die amtlichen Fragen kommen am Ende der Folge, 2 × 2.
  - Das Prüfwerkzeug sorgt dafür, dass nichts angewendet wird, was nicht vorher eingeführt wurde.
- **Knoten:**
  - Darüber geredet wird ab Tag 1, nämlich wann man welchen braucht.
  - Gebunden wird ab Tag 2, erst die leichten, dann die schweren, so wie die Geschichte sie braucht:
    - Tag 2: Achtknoten, Klampe
    - Tag 3: Rundtörn, Webeleinstek
    - Tag 4: Palstek, Kreuzknoten
    - Tag 5: Stopperstek, Schotstek
  - Ab Tag 5 kann man alle Knoten.
- **Navigation:**
  - N0 Karte lesen (Tag 2)
  - N1–N2 Position, Kurs und Distanz (Tag 3)
  - N3 Zeit, Fahrt und Tide (Tag 4)
  - N4 Kompass, Peilung und Missweisung (Tag 5)
  - N5 Strom und Koppelort (Tag 6)
  - N6 Kreuzpeilung, alles gemischt (Tag 7)
  - Bei zwei Dritteln der Reise sitzt das Wichtigste.
- **Abwechslung:**
  - Fahrtage, Hafen, Ankern, Schleuse, Nacht, Nebel, Sturm.
  - Bewusst auch trockene Kajütenfolgen: Pauken mit der Crew.
  - Garn-Folgen: Man lernt aus Hinnerks Geschichten.
- **Ausbildungsheft:**
  - Es misst, was du weißt, verstehst und kannst (`lern.js`).
  - Die Geschichte richtet sich danach. Was freigegeben ist, darfst du; sonst macht es die Crew.

## 4. Die Kiste (Starter-Set)
Auf dem Tisch steht von Anfang an die **Miniatur-Frieda**. Es ist dasselbe Boot wie in der App. Die Spielverpackung hat Fächer, die man erst öffnet, wenn die Geschichte sie braucht: „Mach mal Fach zwei auf.“
| Tag | Fach | Inhalt (★ außer Tau, Ring, Klampe noch Vorschlag) | wofür |
|---|---|---|---|
| 2 | 1 | Tau, Mini-Klampe | Achtknoten, Klampe belegen |
| 3 | 2 | Ring, Kursdreieck, Zirkel, Übungskarte der Reise | Rundtörn, Webeleinstek, Navigation |
| 4 | 3 | dickes Tau, Mini-Anker | Palstek, Kreuzknoten, Schotstek; Ankern |
| 5 | 4 | Mini-Laternen zum Aufstecken | Lichterführung an der Miniatur-Frieda |
| 6 | 5 | Mini-Rettungsring | Mensch über Bord |
| 7 | 6 | Skipperwimpel | Abschluss |

Jede Übung hat zwei Wege: virtuell in der App und echt mit der Kiste („Hält er? Ehrlich.“). Beide zählen im Heft getrennt.

## 5. Orte und Szenen (erfunden, nach Kapiteln)
Wir bauen keine freie Welt, sondern **kleine Szenen**, die stark voneinander abweichen dürfen. Gebaut wird nur, was die Folgen brauchen. Zwischen den Szenen fährt die Frieda auf einer kleinen Übersichtskarte weiter (Zeitraffer), oder es kommt ein Schnitt in die Kajüte.
| Tag | Ort | Ausschnitte, die wir bauen | eigener Look |
|---|---|---|---|
| 1 | **Kuttershaven** (Heimathafen) | Steg mit Tankstelle, Hafenbecken, Ausfahrt mit Fähre | gibt es schon (wird aufgehübscht) |
| 1 | **Fluss Brede, Ankerbucht Schilfwinkel** | Flussstrecke mit Tonnen, Schilfufer, Ankerbucht | grün, Schilf, Abendlicht |
| 2 | **Strom Elvmünde, Klüverhafen** | breites Fahrwasser mit Frachter und Bagger, fremde Hafeneinfahrt, Steg | weit, grau-blau, Industrieufer |
| 3 | **Schleuse Klappdörp, Kanal, Moorende** | Schleuse mit Signallichtern und Kammer, Kanalstrecke mit Tafelzeichen, Kanalhafen | Beton, Mauern, Moor |
| 4 | **Groter Sand, Wrackgebiet, Lüttoog** | Priel mit Pricken, Wrack mit Kardinaltonnen, Seehundsand, Trockenfallplatz, Inselhafen | Watt, Sand, weiter Himmel |
| 5 | **Ansteuerung bei Nacht, Nebelbank** | Leuchtturm, Leit- und Richtfeuer, Fischer, Frachter im Nebel | Nacht, Lichter, Nebel |
| 6 | **Offene See** | Verkehrstrennungsgebiet, Sturm mit hohen Wellen | weit, grau, Gischt |
| 7 | **Harmsoog** | Hafen mit Harms' Segelschiff, Prüfungsbecken | festlich, Wimpel |

Die Kajüte bleibt 2D. Nahansichten (Motor, Klampe, Leinen) werden in 3D gebaut. Die alte Seekarte 7 bleibt für „Frei üben“. Die Navigation der Reise läuft auf der Übungskarte der Reise (★ wird nach Abschnitt 5 neu gezeichnet).

## 6. Bedienung in den Folgen
- **Start in der Kajüte:** Jede Folge beginnt in der Kajüte, ohne Schwenk über das Boot.
- **Steuer abgeben, ohne Anleitung, zum Selbstentdecken:**
  - Tippst du auf Hinnerks Gesicht, übernimmt er. Er fährt schnell und „irgendwie“, aber nie gefährlich. Smilla meckert darüber, und das lehrt.
  - Tippst du auf Smilla, fährt sie vorsichtig und nach Regeln.
  - Wer fährt, bekommt ein kleines Steuersymbol.
  - Tippst du auf Klabauter, kommt ein Spruch, dass er nicht fahren darf.
  - Anfangs fährt die Crew ohnehin selbst. Später kannst du so die Arbeit loswerden; das kostet dann aber den Nachweis im Heft.
- **Wenig auf dem Bildschirm:**
  - Die Minikarte erscheint nur in Folgen, die sie brauchen.
  - Kein Roboter-Knopf mehr.
  - Die Aufgabe steht in einer kleinen Zeile.
- **Pfeife:** Hinnerk zündet sie sich ab und zu an, mit Ton und Animation (Streichholz, Glut, Rauch). Er tut das in ruhigen Momenten und als stilles Lob. Nie verherrlicht; beim Tanken nimmt Smilla ihm das Streichholz weg.

## 7. Folgenblatt (Vorlage für jede Folge)
- **Kopf:** Folge, Titel, Tag, Ort und Szene(n), Tageszeit und Wetter
- **Rolle:** zuhören, Ausguck, Handgriffe, mitmachen, selbst oder führen
- **Vorher gehört:** was aus früheren Folgen hier angewendet wird
- **Ablauf:** Szenen in Reihenfolge, je Szene in einem Satz, was passiert, was du tust und was die Crew sagt
- **Lernstoff:** Kompetenzen, Knoten, Navigation, Fach der Kiste
- **Abends:** amtliche Fragen, dazu ein bis drei ältere zur Wiederholung
- **Haken:** wie die Folge endet
- **Heft:** was sich ändern kann

## 8. Reiseplan (Vorschlag zum Festschreiben)
<!-- PLAN:START -->

### Tag 1: Leinen los
**Wo:** Kuttershaven → Fluss Brede → Ankerbucht Schilfwinkel · **Du:** Passagier: zuhören, Ausguck, kleine Handgriffe

**Geschichte:** Aufbruch zu Smillas neuem Schiff. Harms ruft an: Prüfung in sieben Tagen, an Bord seines Segelschiffs. Hinnerk will „vor Dunkelheit ankern, immer“ (erste Spur seines Geheimnisses).

**Kiste:** Die Miniatur-Frieda steht schon auf dem Tisch; die Kiste bleibt zu. · **Haken:** Harms am Telefon: „Sieben Tage. Wer zu spät kommt, fährt allein heim.“

| Folge | | Titel | Ort | Du | Was passiert | Fragen |
|---|---|---|---|---|---|---|
| 1-1 | 🌧️ | Wer hier was zu sagen hat | Kajüte, Kuttershaven | 👂 zuhören | Morgenbesprechung: Ziel der Reise, wer Schiffsführer ist, Westen und Feuerlöscher. Hinnerks Bauchregel „In Fahrt is man, wenn der Motor läuft“. | 1-3,67-69 |
| 1-2 | ⚓ | Gas, Sprit und Streichholz | Steg und Tankstelle Kuttershaven | ✋ Handgriffe | Crew tankt und startet den Motor, du reichst den Kanister. Hinnerk will sich beim Tanken die Pfeife anzünden, Smilla nimmt ihm das Streichholz weg. | 62-66,42,49 |
| 1-3 | ☀️ | Das Heck zieht weg | Hafenbecken und Ausfahrt | 👀 Ausguck | Hinnerk legt ab, rückwärts zieht das Heck nach Backbord. Die Fähre kommt mit Schwell, Smilla erklärt Sog und Abstand. | 41,44-47,50,51,34,36,37,61 |
| 1-4 | ☀️ | Rechts halten | Fluss Brede | 👀 Ausguck | Erste Begegnung auf dem Fluss, die Crew weicht aus und erklärt. Kurze und lange Töne, Luv und Lee. Du sagst Boote an. | 4-9,14,15,125,136 |
| 1-5 | 🧶 | Garn: Der Motor, der kochte | Fluss Brede (Zeitraffer) | 👂 zuhören | Unterwegs erzählt Hinnerk, wie ihm einst der Motor heiß lief. Warnlampen, Öl in der Bilge, Kühlwasser. Smilla stellt seine Version richtig. | 43,52-57,60 |
| 1-6 | 🌊 | Schilfwinkel | Ankerbucht Schilfwinkel | ✋ Handgriffe | Ankern vor Sonnenuntergang (Hinnerk besteht drauf). Abstand zum Schilf, Brutplätze, woran man sieht, dass der Anker hält. | 31-33,38,58,39 |
| 1-7 | 🌧️ | Erster Abend | Kajüte, Schilfwinkel | 👂 zuhören | Was tun nach einem Zusammenstoß, wann Notsignale erlaubt sind, was das Wetter macht. Smilla erzählt, welche Knoten man an Bord wofür braucht (noch ohne Tau). Harms ruft an. | 70-72 |

### Tag 2: Tonnen und dicke Pötte
**Wo:** Strom Elvmünde → Klüverhafen · **Du:** kleine Handgriffe, erste Minuten an der Pinne unter Aufsicht · **Knoten:** acht, klampe · **Navigation:** N0 Karte lesen

**Geschichte:** Auf dem großen Strom mit Frachtern. Abends ein fremder Hafen: Die Crew funkt den Hafenmeister an, du hörst mit. Hinnerk gibt Smilla in der Dämmerung das Steuer.

**Kiste:** Fach 1: Tau und Mini-Klampe. · **Haken:** Quirin meldet sich per Funk: Er wartet an der Schleuse und will mit.

| Folge | | Titel | Ort | Du | Was passiert | Fragen |
|---|---|---|---|---|---|---|
| 2-1 | 🌧️ | Die Kiste | Kajüte, Schilfwinkel | 🪢 mitmachen | Morgens die erste Kiste: Tau. Achtknoten am Leinenende, damit nichts ausrauscht. Smilla zeigt auf der Karte das Fahrwasser und die Tonnen. | 190-196,198,199 |
| 2-2 | ☀️ | Grün an Steuerbord | Tonnenkette in die Elvmünde | 👀 Ausguck | Du sagst jede Tonne an, Smilla steuert. Wer im Fahrwasser fährt, hält sich rechts. | 156,157 |
| 2-3 | ☀️ | Dicke Pötte | Elvmünde, Fahrwasser | 🧭 kurz an die Pinne | Ein Frachter im engen Fahrwasser, ein Bagger, eine Fähre. Du darfst auf gerader Strecke kurz die Pinne halten, Hinnerk daneben. | 148-151,154,155,177,179,187,189,165-168,172,181 |
| 2-4 | ☀️ | Wer muss weg? | Elvmünde | 👀 Ausguck | Begriffe der Ausweichregeln an echten Lagen: Wer ist manövrierunfähig, was ist sichere Geschwindigkeit, was heißt „in Sicht“. | 79-83,89,90 |
| 2-5 | ⚓ | Hafenfunk | Einfahrt Klüverhafen | 👂 zuhören | Die Crew funkt den Hafenmeister an, du hörst mit. Langer Ton beim Einlaufen, Gefahrsignal von einem Fischer. Hinnerk legt mit Backbord an und erklärt, warum. | 16,140,141,161-164,178,186,188,35,40,48 |
| 2-6 | ⚓ | Fest auf Klampe | Steg Klüverhafen | 🪢 mitmachen | Du belegst die Klampe an der Miniatur-Frieda, dann echt am Steg (Klampe aus Fach 1). Klabauter petzt jeden Fehler. | – |
| 2-7 | 🌧️ | Hafenabend | Kajüte, Klüverhafen | 👂 zuhören | Wiederholung des Tages mit Klabauter als Quizmaster. Funkspruch von Quirin. | – |

### Tag 3: Schleuse und Kanal
**Wo:** Schleuse Klappdörp → Kanal → Kanalhafen Moorende · **Du:** mitmachen: Leinen in der Schleuse, steuern im Kanal · **Knoten:** rundtoern, webelein · **Navigation:** N1 Position, N2 Kurs und Distanz

**Geschichte:** Quirin kommt an Bord („Schuidl kenn i!“) und bringt Leben in die Kajüte. Vor der Schleuse leuchten die Lichter rot: warten. In der Kammer führst du die Leine.

**Kiste:** Fach 2: Ring, Kursdreieck, Zirkel und die Übungskarte der Reise. · **Haken:** Quirin erzählt vom alten Wrack im Watt, „da wo der Hinnerk damals…“. Hinnerk schweigt.

| Folge | | Titel | Ort | Du | Was passiert | Fragen |
|---|---|---|---|---|---|---|
| 3-1 | 🌧️ | Schilderwald | Kajüte, Klüverhafen | 👂 zuhören | Quirin kommt an Bord und fragt Tafelzeichen ab wie ein Quizmaster. Trocken, aber laut. | 17-29,176 |
| 3-2 | ☀️ | Rot über rot | Vor der Schleuse Klappdörp | 🪢 mitmachen | Die Schleusenlichter zeigen rot, du musst warten und das richtig entscheiden. Die Crew meldet sich per Funk an. | 30,173-175 |
| 3-3 | 🚧 | In der Kammer | Schleusenkammer Klappdörp | 🪢 mitmachen | Leinen führen, Rundtörn mit zwei halben Schlägen am Ring (Fach 2), Webeleinstek am Poller. Das Wasser steigt. | – |
| 3-4 | ☀️ | Kanalfahrt | Kanal | ⛵ selbst | Du steuerst im Kanal: Ausweichstellen, Badestellen, Sperrgebiet. Quirin redet ununterbrochen. | 169,170,180,182-185 |
| 3-5 | ☀️ | Segler im Kanal | Kanal | ⛵ selbst | Ein Segler kreuzt, ein Schnellerer will überholen. Wer weicht wem aus, und wann musst du das Manöver des letzten Augenblicks fahren? | 126-135,137,139 |
| 3-6 | 🌧️ | Der Kartentisch | Kajüte, Kanalhafen Moorende | 🪢 mitmachen | Kursdreieck und Zirkel aus Fach 2: Position ablesen, Kurs und Distanz zum Watt messen. Quirin rechnet falsch, Smilla nicht. | 236,239-241 |
| 3-7 | ⚓ | Hafenkino Moorende | Kanalhafen Moorende | ⛵ selbst | Abends ist das Becken leer, Hinnerk lässt dich üben: Aufstoppen, Wenden auf engem Raum, Anlegen. Die Leute am Steg schauen zu. | – |
| 3-8 | 🌧️ | Quirins Abschied | Kanalhafen Moorende | 👂 zuhören | Quirin geht von Bord. Abends Wiederholung, und die Geschichte vom Wrack. | – |

### Tag 4: Watt und Wrack
**Wo:** Wattenmeer Groter Sand → Wrackgebiet → Insel Lüttoog · **Du:** selbst steuern mit Aufsicht, ankern · **Knoten:** palstek, kreuz · **Navigation:** N3 Zeit, Fahrt, Tide

**Geschichte:** Ebbe und Flut bestimmen den Tag. Am Wrack will die müde Crew ankern, die Wasserschutzpolizei kommt. Beim Trockenfallen paukt man Recht. Auf Lüttoog liegt Jasper.

**Kiste:** Fach 3: dickes Tau und Mini-Anker. · **Haken:** Die Tide zwingt zur Nachtfahrt. Hinnerk wird still.

| Folge | | Titel | Ort | Du | Was passiert | Fragen |
|---|---|---|---|---|---|---|
| 4-1 | 🌧️ | Ebbe und Flut | Kajüte, Moorende | 👂 zuhören | Smilla erklärt die Gezeiten mit dem Teebecher. Wann kommt man über den Priel? | 233,249-255 |
| 4-2 | ☀️ | Pricken und Kardinäle | Priel im Groter Sand | ⛵ selbst | Du steuerst durch den Priel. Kardinaltonnen zeigen, wo das Wasser frei ist. | 200-203,208 |
| 4-3 | ☀️ | Wrack und Wasserschutz | Wrackgebiet im Groter Sand | ⛵ selbst | Die Crew ist müde und will am Wrack ankern. Du entscheidest. Dann kommt die Wasserschutzpolizei: Ankerverbot, wer ist Schiffsführer, Papiere. | 171 |
| 4-4 | 🌊 | Seehundbank | Ankerplatz am Seehundsand | ⛵ selbst | Du ankerst selbst (Mini-Anker aus Fach 3). Nationalpark, Seehunde, Abstand halten. | 216-219,225-230 |
| 4-5 | 🧶 | Trockengefallen | Trockenfallplatz | 🪢 mitmachen | Das Boot sitzt auf dem Sand, sechs Stunden Zeit: Paragrafen mit Tee, Hinnerks Garn. Palstek und Kreuzknoten mit dem dicken Tau. | 59,73-78,85,86,152,153,158,160 |
| 4-6 | ☀️ | Nach Lüttoog | Watt nach Lüttoog | ⛵ selbst | Wann kommt man an, wie schnell sind wir? Zeit und Fahrt rechnen. Im Inselhafen liegt Jasper. | 231,232,234,235,237,238 |

### Tag 5: Nacht und Nebel
**Wo:** Ansteuerung bei Nacht → Nebelbank · **Du:** Nachtwache allein · **Knoten:** stopper, schot · **Navigation:** N4 Kompass, Peilung, Missweisung

**Geschichte:** Nachtfahrt wegen der Tide. Hinnerk verwechselt Lichter, nicht aus Unwissen: Er sieht nachts schlecht. Das Geheimnis kommt raus. Ab jetzt gehst du die Nachtwache.

**Kiste:** Fach 4: Mini-Laternen zum Aufstecken. · **Haken:** Der Wetterbericht: Sturmwarnung für morgen.

| Folge | | Titel | Ort | Du | Was passiert | Fragen |
|---|---|---|---|---|---|---|
| 5-1 | 🌧️ | Lichter I | Kajüte, Lüttoog | 🪢 mitmachen | Mini-Laternen aus Fach 4 auf die Miniatur-Frieda: Topplicht, Seitenlichter, Heck. Dann die Lichter der anderen. | 10-13,91-94,113,114,159 |
| 5-2 | 🌧️ | Lichter II | Kajüte, Lüttoog | 👂 zuhören | Schlepper und Fischer. Jasper kommt zu Besuch und verwechselt alles. | 95-99,102-105 |
| 5-3 | 🌧️ | Lichter III | Kajüte, Lüttoog | 👂 zuhören | Manövrierunfähig, manövrierbehindert, tiefgangbehindert, Lotse. Trocken, Klabauter hilft. | 100,101,106-112,115 |
| 5-4 | 🌙 | Hinnerks Geheimnis | Ansteuerung bei Nacht | 🪢 mitmachen | Leuchtfeuer und Kennungen. Hinnerk liest ein Feuer falsch, Smilla übernimmt. Dann sagt er es: Er sieht nachts schlecht. | 197,204-207,209-215,220-224 |
| 5-5 | 🌙 | Deine Wache | Ansteuerung bei Nacht | ⛵ selbst | Du gehst allein Wache. Begegnungen bei Nacht, Peilung nehmen, Kompass und Missweisung, AIS. | 242-244,248,272,273 |
| 5-6 | 🌫️ | Nebelbank! | Nebelbank | ⛵ selbst | Plötzlich Nebel. Fahrt runter, Signal geben, Ausguck. Ein Frachter tutet irgendwo. | 84,116-124,138,271 |
| 5-7 | 🌧️ | Leinen unter Last | Kajüte, Ankerplatz | 🪢 mitmachen | Stopperstek an einer Leine unter Last, Schotstek für zwei verschieden dicke Leinen. Der Wetterbericht kündigt Sturm an. | – |

### Tag 6: Raus auf See
**Wo:** Offene See: Verkehrstrennungsgebiet → Sturm · **Du:** Kurs planen und fahren, im Sturm mit anpacken · **Navigation:** N5 Strom, Koppelort

**Geschichte:** Der große Schlag übers offene Wasser. Du planst den Kurs. Der Sturm kommt früher als gedacht. Jaspers Boot gerät in Seenot.

**Kiste:** Fach 5: Mini-Rettungsring. · **Haken:** Hinnerk, nach dem Sturm, leise: „Skipper.“ Zum ersten Mal.

| Folge | | Titel | Ort | Du | Was passiert | Fragen |
|---|---|---|---|---|---|---|
| 6-1 | 🌧️ | Die Wetterkarte | Kajüte, Ankerplatz | 👂 zuhören | Hoch, Tief, Isobaren, Beaufort. Hinnerks Knie gegen den Wetterbericht. | 260-266 |
| 6-2 | 🌧️ | Kurs übers Wasser | Kartentisch | 🪢 mitmachen | Du planst den Schlag mit Strom und Koppelort. Dazu Sturm- und Starkwindwarnungen. | 245-247,267-270 |
| 6-3 | ☀️ | Querverkehr | Verkehrstrennungsgebiet | ⛵ selbst | Du querst das Verkehrstrennungsgebiet im rechten Winkel, große Schiffe überall. | 87,88,142-147 |
| 6-4 | ⛈️ | Sturm kommt | Offene See | 🪢 mitmachen | Westen an, Sicherheitsleinen, Luken zu, Fahrt anpassen. Steuern in den Wellen. | 256,258,259,274,275,278 |
| 6-5 | ⛈️ | Mensch über Bord | Offene See | ⛵ selbst | Smilla geht beinahe über Bord. Ihr übt es danach mit dem Mini-Rettungsring, dann echt mit der Puppe. | 276 |
| 6-6 | ⛈️ | Mayday | Offene See | ⛵ selbst | Jaspers Boot ist in Not: Notsignale, Schleppen mit dem Schotstek, was tun, wenn ein Boot kentert. | 257,277,279-285 |

### Tag 7: Ankunft
**Wo:** Insel Harmsoog mit Harms' Segelschule · **Du:** du führst die Frieda · **Navigation:** N6 Kreuzpeilung, alles gemischt

**Geschichte:** Du führst den letzten Schlag, die Crew ist Passagier. Harms erwartet euch an seinem Segelschiff. Theorie und Praxis. Dann Smillas Abschied.

**Kiste:** Fach 6: Skipperwimpel. · **Haken:** Bonus: Rückweg mit Hinnerk allein. Smilla winkt vom großen Schiff.

| Folge | | Titel | Ort | Du | Was passiert | Fragen |
|---|---|---|---|---|---|---|
| 7-1 | ☀️ | Der letzte Schlag | Vor Harmsoog | ⚓ du führst | Du planst und führst. Begegnungen, Tonnen, Strom, alles gemischt. Die Crew ist Passagier, Klabauter quatscht dazwischen. | – |
| 7-2 | ⚓ | Einlaufen Harmsoog | Hafen Harmsoog | ⚓ du führst | Du läufst ein und legst neben Harms' Segelschiff an. Harms steht auf dem Steg und sagt nichts. | – |
| 7-3 | 📝 | Harms prüft: Theorie | An Bord des Segelschiffs | 📝 Prüfung | Die große Probeprüfung: 30 Fragen und eine Kartenaufgabe. | – |
| 7-4 | 📝 | Harms prüft: Praxis | Hafenbecken Harmsoog | 📝 Prüfung | Alle Manöver und Knoten der Praxisprüfung. | – |
| 7-5 | 👋 | Wachübergabe | Steg Harmsoog | 👂 zuhören | Smilla übergibt dir die Wache und steigt um. Harms sagt einmal „Gut.“ | – |

**Bonus:** Anheuern (Bonus): Wie du an Bord kommst. Wird gesondert ausgearbeitet. · Rückweg (Bonus): Hinnerk und du allein, Wiederholung und Prüfungswoche.
<!-- PLAN:END -->

## 9. Offen
- ★ Name von Harms' Segelschiff (Vorschlag „Albertine“) und die Ortsnamen in Abschnitt 5.
- Inhalt der Kiste ab Fach 3 (★ Vorschlag oben), sobald das Starter-Set feststeht.
- Tag 0 „Anheuern“ und Rückweg (Bonus) ausarbeiten.
- Übungskarte der Reise zeichnen (für N1–N6), passend zu den Orten.
- Kajütenfunk (Hörmodus): Er wird zur Hörfassung der Folgen (F5 offen).
