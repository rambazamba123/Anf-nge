# Die Reise der Frieda: In sieben Tagen zum SBF See

> **Das ist das Fundament** für Geschichte, Lernaufbau, Hörreise und alle Folgen (Nutzer, 04.11.2026; Hörreise seit 07.11.2026, E25).
> **Status:** Geschichte, Hörreise und Regelwerk (Abschnitt 7) sind vom Nutzer gesetzt. Der Reiseplan (Abschnitt 8) ist ein Vorschlag zum Festschreiben. Was mit ★ markiert ist, ist mein Vorschlag und noch nicht bestätigt.
> **Werkzeuge:** Der Plan steht in `data/reiseplan.json`. `node tools/reiseplan.js` prüft ihn (auch die Regeln aus Abschnitt 7, soweit sie sich prüfen lassen) und schreibt die Tabelle in Abschnitt 8. Die Themenblöcke kommen aus `podcast/kursplan-sbf.json`.
> **Vor jeder Arbeit an Folgen** liest Claude Abschnitt 7, `docs/dialog-regeln.md` und `PODCAST_BIBLE.md` (R15).

## 1. Die Geschichte in Kürze
- **Ziel der Reise:** Wir bringen Smilla zu ihrem neuen Schiff. Das ist ein Segelschiff, auf dem Kapitän Harms Segelkurse gibt (die „Albertine“, liegt auf der Insel Harmsoog; Name bestätigt am 07.11.2026). Dort nimmt Harms auch dir die Prüfung ab und gibt dir den Schein.
- **Warum du gebraucht wirst:**
  - Beim Anheuern sagt man dir: Du musst die Prüfung bestehen, sonst muss Hinnerk allein heimfahren.
  - Später kommt dazu: Hinnerk sieht nachts schlecht. Er weiß es selbst und gibt es nicht zu, auch vor sich nicht. Darum will er „vor Dunkelheit ankern, immer“. Eigentlich dürfte er nachts gar nicht mehr fahren (Frage 2: körperliche Mängel). Das kommt an Tag 5 raus, und ab da gehst du die Nachtwachen.
- **Sieben Tage:**
  - Die Reise dauert sieben Reisetage. Wer frei hat und ein gutes Gedächtnis, kann sie in sieben echten Tagen durchspielen, sogar schneller.
  - Jeder Tag besteht aus mehreren Folgen und lässt sich jederzeit unterbrechen.
  - In der Praxis lernt man, so viel man will. Es darf auch mehrere Wochen dauern.
- **Bonus:**
  - **Folge 0 „Anheuern“** (Nutzer, 07.11.2026) ist der erste Start der App: Am Abend vor der Abfahrt kommst du an Bord, lernst Hinnerk, Smilla, Klabauter und Backbord kennen und machst mit der Crew die Grundeinstellungen. Harms wird nur erwähnt. Sie zählt nicht als erster Tag und wird später ausgearbeitet, zusammen mit dem geführten Rundgang durch die App (HR26).
  - Der Rückweg nach dem Ziel ist ebenfalls Bonus.
- **Die Crew wächst:**
  - Tag 1 morgens: Hinnerk, Smilla und du. Klabauter gehört zur Frieda, ist aber einfach abgehauen. Alle vermissen ihn; Hinnerk tut gleichgültig und legt trotzdem jeden Abend Zwieback raus.
  - Tag 1 abends: Im Schilfwinkel sitzt Klabauter plötzlich wieder auf dem Kajütdach, als wäre nichts gewesen.
  - Tag 2 abends: In Klüverhafen sitzt Quirin mit Seesack auf dem Steg. Er ist Binnenschiffer aus Bayern, kennt Boote, Motoren, Knoten und Schleusen besser als alle, aber die Regeln auf See nicht. Er will umsatteln, auf einen Job auf hoher See, und der SBF See ist der erste Schritt. Er hofft, dass sich die Seekrankheit gibt.
  - Tag 3: An der Schleuse ist Quirin der Experte, auf See ist er Anfänger wie du.
  - Tag 4: Beim Trockenfallen geht Quirin mit einer Wattführung zu Fuß nach Lüttoog, zu einem Probetag auf einem Versorgungsschiff. Im Inselhafen liegt Jasper, der Segler, der alles besser weiß. Er begleitet die Reise bis zu seiner Seenot an Tag 6.
  - **Quirin oder Jasper, nie beide zugleich** (Nutzer, 07.11.2026). So hat jeder Abschnitt seinen eigenen Gast, und die Crew bleibt höchstens zu viert im Gespräch.
  - Tag 7: Quirin kommt mit der Fähre zurück, Harms prüft euch beide.
- **Die alte Geschichte von der Elbe:** Hinnerk und Harms hatten 1991 im Nebel einen Zusammenstoß, Hinnerk mit seiner Fähre, Harms als Lotse auf einem Frachter. Im Nebel gibt es keinen, der Kurs halten darf; beide hätten ausweichen müssen. Jeder gibt bis heute dem anderen die Schuld. Im Lauf der Reise kommt heraus, dass beide schuld waren (erste Andeutung an Tag 1, Nebel-Folge an Tag 5, Aussprache an Tag 7).
- **Die Boote:** Hinnerks Motorboot heißt „Frieda“, die Miniatur auf deinem Tisch auch.
- **Ton:** gemütlich-komisch, ab 12 Jahren. Dazwischen echte Spannung: Wasserschutzpolizei, Nacht, Nebel, Sturm, Seenot.
- **Jede Folge endet mit einem Haken auf morgen:** ein Anruf, ein Wetterbericht, ein halber Satz.

**Spannungsbogen**
| Tag | Gefühl | Wendepunkt |
|---|---|---|
| 1 | Aufbruch, alles neu | Klabauter ist zurück, Harms ruft an: „Sieben Tage.“ |
| 2 | erste Erfolge | fremder Hafen; Quirin wartet am Steg |
| 3 | Gewusel mit Quirin | Schleuse, Quirin ist der Experte; Andeutung zum Wrack |
| 4 | Abenteuer | Wasserschutzpolizei; Quirin geht übers Watt, Jasper taucht auf; Nachtfahrt erzwungen |
| 5 | Ernst | Hinnerks Geheimnis, deine erste Wache |
| 6 | Höhepunkt | Sturm, Mensch über Bord, Mayday bei Jasper |
| 7 | Ankunft | du führst, Quirin kommt zurück, Harms prüft euch beide, Hinnerk und Harms reden über die Elbe, Abschied |

## 2. Figuren
Die Grundzüge sind bestätigt (`podcast/figuren.md`), die Sprechweisen regelt `docs/dialog-regeln.md`. Wer wann an Bord ist, steht in `data/reiseplan.json` `crew`.
| Figur | Rolle auf der Reise | Bogen |
|---|---|---|
| **Hinnerk** | Kapitän, Hände und Gefühl. Fährt schnell und „irgendwie“, hat Bauchregeln, die nie stehen bleiben, und raucht ab und zu Pfeife. | vom „Finger weg“ bis zum ersten „Skipper“ (Ende Tag 6); sein Geheimnis: Er sieht nachts schlecht |
| **Smilla** | Matrosin, Kopf und Regeln, fährt vorsichtig. Geht am Ziel auf Harms' Segelschiff. | von der Ungeduldigen zu der, die dir die Wache übergibt |
| **Klabauter** | Papagei der Frieda, beim Aufbruch abgehauen, Tag 1 abends wieder da. Krächzt und schreit statt zu reden, wenig, aber im richtigen Moment: warnt, petzt, wiederholt das Merkwort („Dreihundert! Dreihundert!“), Quizmaster. Höchstens drei Einwürfe je Folge. | bleibt, wie er ist |
| **Backbord** | Bordkatze, stumm, macht Unsinn | – |
| **Harms** | Prüfer, wartet am Ziel, ruft unterwegs an, Rivale von Hinnerk seit der Elbe. Prüft nur in der Fragerunde am Ende: ernst, Musik aus, zügig. | sagt am Ende einmal „Gut.“ |
| **Quirin** | Bayer, Binnenschiffer aus Kelheim, dein **Mitlernender**: Er kennt Boote, Motoren, Knoten und Schleusen, aber die Regeln auf See nicht. Will umsatteln auf einen Job auf hoher See. Steigt Tag 2 abends in Klüverhafen zu, geht an Tag 4 zu einem Probetag, kommt an Tag 7 zur Prüfung zurück. Fragt, was du fragen würdest, verwechselt Binnen und See, hilft dir bei Handgriffen. Auf offener See seekrank. | vom Seekranken zu einem, der aufs Meer will und es auch kann; später im Binnen-Teil der Experte |
| **Jasper** | Segler an seiner Boje vor Lüttoog, hat für alles eine einfache, falsche Regel („Ich sag immer Nord“). Gast von Tag 4 bis 6, nie zusammen mit Quirin. | vom Besserwisser zu „Ich weiß es nicht“ nach seiner Rettung (Tag 6) |
| **Hafenmeister, Wasserschutzpolizei** | Gäste an einzelnen Orten | – |

**Anreden wachsen mit** (höchstens drei je Folge, ohne Namen). Seit 07.11.2026 in drei Fassungen: Beim Kennenlernen wählst du „als Frau“, „als Mann“ oder „lieber neutral“ (`S.profile.anrede`, änderbar in den Einstellungen). Neutrale Anreden passen für alle; die anderen kommen nur in der gewählten Fassung.
| Stufe | neutral | als Frau | als Mann |
|---|---|---|---|
| Tag 1–2 (Passagier) | Landratte, Frischfisch, Bordküken, Seegurke | Deern („min Deern“), Leichtmatrosin | Jung („min Jung“), Leichtmatrose |
| Tag 3–4 (Ausguck, Rudergänger) | Frischling, Wattwurm, Ausguck | Matrosin | Matrose |
| Tag 5–6 (Wache) | Wasserratte, Nachteule, Sturmvogel | Seebärin, Steuerfrau | Seebär, Steuermann |
| Tag 6, Hinnerks leiser Satz nach dem Sturm | „Käpt'n.“ | „Skipperin.“ | „Skipper.“ |
| Tag 7 | Käpt'n | Skipperin | Skipper |

**Hinnerks Wörter statt „freigegeben“** (je mehrere Varianten, sie werden eingesprochen):
| Stufe im Heft | Hinnerk sagt zum Beispiel |
|---|---|
| neu | „Finger weg.“ · „Guck erst mal zu.“ |
| gehört | „Hast's gehört. Nu sitzt's noch nich.“ |
| geübt | „Wird langsam.“ · „Nochmal. Einmal is Glück.“ |
| freigegeben | „Dat gehört jetzt dir.“ · „Mach du man.“ · Er zündet sich wortlos die Pfeife an. |
| sicher | „Sitzt wie 'n Webeleinstek.“ · „Dat sitzt.“ |
| eingerostet | „Da is Rost dran. Zeig nochmal.“ |

## 3. Die Hörreise: so wird gelernt
**Grundidee (E25):** Die Reise ist vor allem eine **Hörreise**, gemacht für Auto, Gym und Spaziergang: ein Hörspiel, in dem du zum Schiffsführer ausgebildet wirst, mit Zwischenfragen wie im Kajütenfunk. Bilder und Animationen laufen mit, wenn man draufschauen kann. Was Hände oder Augen braucht (3D, Knoten mit Tau, Karte, Bildfragen), ist eine Aufgabe für später.

**Zwei Modi und ein Schalter:**
| Modus | so läuft es |
|---|---|
| 🎧 **Hörspiel** | Alles läuft durch, nichts wartet. Fragen kommen mit Glocke und kurzer Denkpause, danach die Lösung. Bilder erscheinen, wenn der Bildschirm an ist. Aufgaben macht die Crew; sie landen in der Etappe. |
| 🎙️ Schalter **Mitantworten** (nur im Hörspiel) | Bei eingeschaltetem Bildschirm antwortest du laut („A“, „B“, Alfa bis Delta, „gewusst“, „weiß nicht“). Kommt keine Antwort, läuft es weiter. |
| ✋ **Mitmachen** | Die Folge hält bei Fragen und Aufgaben an, du tippst. 3D, Knoten und Karte kommen direkt. Jede Aufgabe hat „Später“. |
- Wechseln geht jederzeit mit einem Knopf, auch mitten in der Folge. Voreinstellung nach dem Lernort aus dem Kennenlernen.
- Im Hörspiel muss man nie tippen (Handy beim Fahren nur per Stimme).
- **Was zählt:** Ohne Antwort zählt eine Frage als „gehört“. Eine richtige Antwort, gesprochen oder getippt, zählt fürs Wiederholen. Dunkelgrün wird eine Frage erst, wenn sie auch einmal in Prüfungsform (vier Antworten auf dem Bildschirm) sitzt.
- **Länge:** 7–15 Minuten, je nachdem, was die Folge braucht. Folgen laufen auf Wunsch hintereinander weiter wie ein Podcast.

**Übersicht und Etappen:**
- Eine schlichte, gut gezeichnete Karte der sieben Reisetage, die Frieda rückt vor. Jede Folge ist eine Station.
- Farben wie beim Fragenwissen: **grau** noch nicht gehört, **gelb** gehört, **hellgrün** die meisten Aufgaben der Folge gelöst, **dunkelgrün** alles gelöst, was zur Folge gehört. (Gelb statt Orange, weil Orange bei den Fragen „wackelt“ heißt.)
- **↻ Auffrischen:** Werden Fragen einer Station wieder fällig, zeigt sie eine kleine Zahl. Dunkelgrün bleibt nicht für immer.
- Station antippen: Kacheln mit Vorschaubild und Haken, zum Beispiel 🎧 Folge nochmal hören, ❓ Prüfungsfragen der Folge, 🖼️ Bilder und 🎞️ Animationen (etwa die Tide als Vorschau), ⛵ 3D-Aufgabe, 🪢 Knoten mit Tau, 🧭 Kartenaufgabe. Offene Aufgaben sieht man sofort.

**Vom Passagier zum Skipper:**
- Tag 1 nur zuhören, Ausguck und kleine Handgriffe.
- Tag 2 die ersten Minuten an der Pinne.
- Tag 3 selbst steuern im Kanal.
- Tag 4 selbst ankern.
- Tag 5 allein Wache.
- Tag 6 Kurs planen und im Sturm mit anpacken.
- Tag 7 führst du.
- Anfangs macht die Crew alles, auch das Anfunken der Häfen. Du hörst mit.

**Knoten:**
- Darüber geredet wird ab Tag 1, nämlich wann man welchen braucht.
- Gebunden wird ab Tag 2, erst die leichten, dann die schweren, so wie die Geschichte sie braucht:
  - Tag 2: Achtknoten, Klampe
  - Tag 3: Rundtörn, Webeleinstek
  - Tag 4: Palstek, Kreuzknoten
  - Tag 5: Stopperstek, Schotstek
- Ab Tag 5 kann man alle Knoten.

**Navigation:**
- N0 Karte lesen (Tag 2)
- N1–N2 Position, Kurs und Distanz (Tag 3)
- N3 Zeit, Fahrt und Tide (Tag 4)
- N4 Kompass, Peilung und Missweisung (Tag 5)
- N5 Strom und Koppelort (Tag 6)
- N6 Kreuzpeilung, alles gemischt (Tag 7)
- Bei zwei Dritteln der Reise sitzt das Wichtigste.

**Abwechslung:** Fahrtage, Hafen, Ankern, Schleuse, Nacht, Nebel, Sturm. Bewusst auch trockene Kajütenfolgen (Pauken mit der Crew) und Garn-Folgen (man lernt aus Hinnerks Geschichten).

**Ausbildungsheft:** Es misst, was du weißt, verstehst und kannst (`lern.js`). Die Geschichte richtet sich danach: Was freigegeben ist, darfst du; sonst macht es die Crew.

## 4. Die Kiste (Starter-Set)
Auf dem Tisch steht von Anfang an die **Miniatur-Frieda**. Es ist dasselbe Boot wie in der App. Die Spielverpackung hat Fächer, die man erst öffnet, wenn die Geschichte sie braucht: „Mach mal Fach zwei auf.“
| Tag | Fach | Inhalt (★ außer Tau, Ring, Klampe noch Vorschlag) | wofür |
|---|---|---|---|
| 2 | 1 | Tau, Mini-Klampe | Achtknoten, Klampe belegen |
| 3 | 2 | Ring, Kursdreieck, Zirkel, Übungskarte der Reise | Rundtörn, Webeleinstek, Navigation |
| 4 | 3 | dickes Tau, Mini-Anker | Palstek, Kreuzknoten, Schotstek; Ankern |
| 5 | 4 | Mini-Laternen zum Aufstecken | Lichterführung an der Miniatur-Frieda |
| 5 | 5 | Mini-Rettungsring | Mensch über Bord üben (5-7), im Sturm gebraucht (6-5) |
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

## 6. Aufgaben in 3D
- **Wann:** im Modus Mitmachen direkt in der Folge, sonst später über die Kachel ⛵ der Etappe. Jede 3D-Aufgabe dauert wenige Minuten und beginnt sofort in der Szene, ohne Schwenk über das Boot.
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
- **Pfeife:** Beim Tanken will Hinnerk sie aus Gewohnheit anzünden, Smilla nimmt ihm das Streichholz weg (N 07.11.). Sonst zündet er sie sich ab und zu an, mit Ton und Animation (Streichholz, Glut, Rauch). Er tut das in ruhigen Momenten und als stilles Lob. Nie verherrlicht; beim Tanken nimmt Smilla ihm das Streichholz weg.

## 7. Regelwerk der Folgen
Jede Rückmeldung des Nutzers zu den Folgen wird hier eine nummerierte Regel (**HR**, Hörreise) mit Datum. Claude ändert sie nicht stillschweigend. Was sich prüfen lässt, prüft ein Werkzeug (⚙). So muss der Nutzer nichts zweimal sagen.

### 7.1 Themenblöcke statt Einzelfragen
- **HR1 Blöcke zuerst** (N 07.11.): Gelernt wird in Themenblöcken. Jede Frage hat eine Heimat-Folge (Feld `fragen`); bei Bedarf darf sie in späteren Folgen wiederkommen (Feld `wieder`), wenn es die Geschichte verbessert und sehr gut passt (N 07.11.). ⚙ Das sind die Blöcke des Kursplans (`podcast/kursplan-sbf.json`, Fassung 5, schon mit K1 bestätigt). Eine Folge hat ein bis drei Blöcke, die zu ihrer Lage passen. ⚙
- **HR2 System oder Regel** (Konzept §6.1, N 22.10.):
  - **◼ System-Blöcke** (ein Prinzip trägt viele Fragen: Lichter, Tonnen, Tafeln, Motor) werden zusammen erklärt: erst das Prinzip, dann die Fragen gebündelt, viele davon nur kurz. Sie werden nie auf mehrere Folgen geteilt. ⚙
  - **▸ Regel-Blöcke** (eigenständige Regeln: Ausweichen, Verantwortung, Not) dürfen Regel für Regel in die Lagen wandern, in denen sie passieren. Beispiel: das Ankerverbot (Frage 171) beim Wrack, Baden und Wasserski im Kanal.
- **HR3 Vergleich:** Verwechselbares kommt nebeneinander, sobald beide Seiten bekannt sind, zum Beispiel Binnen gegen See mit Quirin oder alle Lichter am Ende von Tag 5.

### 7.2 Überblicke früh
- **HR4 Grundsatzerklärungen** (N 07.11.): Sie sind in die Geschichte eingebaut und sinnvoll verteilt, die meisten in den ersten drei Tagen. Sie geben den Überblick über ein Thema, ohne Einzelheiten („Es gibt vier Familien von Seezeichen …“). Später knüpfen die Einzelheiten daran an, so lernt es sich leichter.
  - Liste in `data/reiseplan.json` `ueberblicke`, im Plan mit 🧭 markiert.
  - Kein Block kommt vor seinem Überblick. ⚙
- **HR5 Form und Dichte** (N 07.11.): 1–2 Minuten, aus einer Lage heraus („Was sind das für Tonnen?“), mit einem Satz am Ende, den man behält. Nicht zu dicht: höchstens ein Überblick je Folge und höchstens drei je Tag. ⚙ Ein Überblick kommt erst, wenn die Geschichte ihn braucht, nicht auf Vorrat.

### 7.3 Ablauf: Muster statt Schema
- **HR6 Erst die Blöcke, dann der Ablauf** (N 07.11.): Für jede Folge wird das Ablaufmuster gewählt, das zu ihrer Lage und ihren Blöcken passt. Zwei Folgen hintereinander haben nie dasselbe Muster (Feld `muster`). ⚙
- **HR7 Gefragt wird, was zur Szene gehört** (N 07.11.): Mitten in einer Lage kommen nur Fragen zu dieser Lage. Fällige Wiederholungen anderer Themen kommen in die Fragerunde am Ende. Ein Rückgriff mitten in der Szene nur, wenn das alte Wissen hier gebraucht wird („Weißt du noch, die Westtonne?“).

| Muster | Ablauf | passt zu |
|---|---|---|
| `lage` Lage zuerst | mitten in der Situation → Problem → das Wissen wird gebraucht → Lösung → Frage dazu | Regel-Blöcke, Action (Polizei, Nebel, Sturm) |
| `system` System zuerst | Anlass → Prinzip → Fragen gebündelt → kurz anwenden | System-Blöcke in ruhigen Folgen (Kajüte, Kartentisch) |
| `raten` Erst raten | Vorab-Frage an dich → Geschichte → Auflösung mit Erklärung | wo das Bauchgefühl täuscht |
| `garn` Garn | eine Geschichte der Crew → die Regeln herausholen → „Stimmt das?“ | Garn-Folgen, Technik, Not |
| `streit` Streitgespräch | zwei aus der Crew sind uneins → du entscheidest → Auflösung | Regeln mit typischer Falle |
| `quiz` Quiz | Quirin oder Klabauter fragt ab, kleiner Wettstreit, viele kurze Fragen | Tafeln, Lichter, Wiederholungstage |
| `tun` Mitmachen | Aufgabe klar erklären → du machst sie (oder später) → was passiert ist und warum | Knoten, Manöver, Karte |
| `vergleich` Vergleich | zwei Ähnliche nebeneinander → Unterschiede → gemischt fragen | Binnen und See, Lichter, Schallsignale |

### 7.4 Erklären: nicht jede Frage gleich
- **HR8 Werkzeugkasten statt Schablone** (N 07.11.):
  - Die fünf Teile Kern, Warum, Bild im Kopf, Falle und Merksatz sind Werkzeuge.
  - Je Frage nimmt man nur, was sie braucht.
  - Jede Erklärung schafft Verständnis durch Zusammenhang und wiederholt nie nur die Antwort.
- **HR9 Tiefe nach Bedarf:** Schwerpunktfragen (im Kursplan `schwerpunkt`) werden ausführlich erklärt. Die anderen nimmt der Block kurz mit, oft in einem Satz, oft nur als Unterschied zur Nachbarfrage.
- **HR10 Abwechslung:**
  - Die Form wechselt und kommt nie zweimal hintereinander: Warum-Erklärung, Kopfkino, Vergleich, kleiner Versuch (Tide mit dem Teebecher), Garn, Streit, Falle (Quirin tappt rein), Ton-Labor (Signal hören), Merkwort (Klabauter), Zahlenspiel.
  - Auch wer erklärt, wechselt. Es ist nicht immer Smilla.
- **HR11 Dieselben Texte in „Frei üben“:**
  - Jede Frage bekommt ihre eigene Erklärung in der Form, die zu ihr passt (`data/karten-sbf.json`, Feld `e`).
  - Bei System-Blöcken gibt es zusätzlich „Das ganze System“ (der Kern des Blocks) zum Aufklappen.
  - Geschrieben wird kapitelweise.

### 7.5 Fragen im Hörspiel
- **HR12 Signal:** Schiffsglocke, zwei Schläge für „Frage an dich“, ein Schlag für die Auflösung. Den Prüfungswortlaut liest immer Harms.
- **HR13 Formen** (N 07.11.):
  - Zwischenfragen nie mit allen vier Katalogantworten.
  - Je Frage die sinnvollste Form: offen, entweder-oder (richtig gegen die gefährlichste Falle), teilweise aufzählen („Nenn drei …“), Lücke, „Hat er recht?“.
- **HR14 Antworten je Modus:**
  - Hörspiel: mitdenken. Denkpause immer 6 Sekunden, auch bei Entweder-oder (N 07.11., wie B152), dann die Lösung. ⚙
  - Mit „Mitantworten“: per Stimme.
  - Mitmachen: Knöpfe.
- **HR15 Wer irrt, wechselt** (N 07.11.):
  - Es irren alle mal (N 07.11.: „Es machen ja jetzt alle Fehler“): Hinnerk (Bauchregel, Gewohnheit, auch bei Sicherheit, etwa die Pfeife beim Tanken), Quirin (Binnen-Gewohnheit), Smilla (zu streng, falsches Revier, Hektik), Jasper und Gäste. Nur Klabauters Merkwort ist immer richtig (Bible X6).
  - Höchstens ein „Hat er recht?“ je Folge, und ungefähr jedes dritte Mal hat er recht.
  - Man darf nie einfach das Gegenteil von Hinnerk wählen können.
  - Jeder Irrtum wird in derselben Szene aufgelöst (E20).
- **HR16 Quirin als Mitlernender:**
  - Er kennt Boote und Handgriffe (Motor, Knoten, Schleuse) und hilft dir dabei, die Regeln auf See kennt er nicht.
  - Er fragt, was du fragen würdest, und tappt in typische Fallen (oft Binnen-Gewohnheiten), aber erst nachdem du selbst geantwortet hast.
  - Entscheiden musst immer du.

### 7.6 Fragerunde am Ende
- **HR17 Trocken lernen** (N 07.11.):
  - Die Abschluss-Abfrage ist das Lernen der amtlichen Fragen: die neuen Fragen der Folge plus fällige ältere, zusammengesetzt aus den Hörkarten.
  - Im Hörspiel vorgelesen mit den vier Antworten (Alfa bis Delta), mit Denkpause oder Antwort per Stimme.
  - Im Mitmachen zum Antippen.
- **HR27 Ähnliche Antworten zusammenlegen** (N 07.11.): Unterscheiden sich die vier amtlichen Antworten nur in einem Teil (Promille, Zahlen, ein Wort), liest Harms den gemeinsamen Teil einmal und dann nur die Unterschiede (Alfa: null Komma acht, Bravo: …). In der Geschichte davor erklärt die Crew genau diese Unterschiede, vor allem die Falle. So versteht man die Frage, statt vier lange Sätze zu vergleichen. Wo es sich anbietet, wird der Unterschied an etwas Bekanntes gehängt (Promille wie beim Autofahren).
- **HR18 Drei Rahmen, kurz gehalten** (N 07.11.):
  - „Harms ruft an“
  - „Logbuch schreiben“ (Smilla diktiert)
  - „Klabauter-Quiz“ (erst, wenn Klabauter an Bord ist)
  - Nie zweimal hintereinander derselbe (Feld `abfrage`). ⚙
  - **Wenn Harms prüft, ist es ernst** (N 07.11.): Musik und Atmo aus, nur die Schiffsglocke. Harms liest trocken und zügig, keine Witze, kein Plaudern, keine Erklärungen dazwischen. Harms prüft nur hier und an Tag 7, nie mitten in der Geschichte. Smilla oder Hinnerk dürfen erst danach wieder reden (ein kurzer Satz, dann Musik).

- **HR30 Fragerunde nach jeder Folge** (N 07.11.): Die Abschluss-Abfrage kommt am Ende jeder Folge, nicht am Ende des Tages. So liegen Erklärung und Abruf nah beieinander.
  - Wer im Hörspiel nicht antwortet oder Aufgaben aufschiebt, paukt nach: Die Fragen zählen nur als „gehört“, kommen in den nächsten Fragerunden als fällige wieder und stehen als Zahl ↻ an der Station.
  - Folgen mit Ernstfall und ohne neue Fragen fragen die Fragen aus `wieder` ab, dazu fällige ältere.

### 7.7 Bilder, Animationen, Aufgaben
- **HR19 Bilder laufen mit:** Bilder und Animationen erscheinen während der Geschichte (wie im Kajütenfunk). Gesprochen wird so, dass man sie nicht braucht.
- **HR20 Aufgaben:** Aufgaben mit Händen oder Augen (3D, Knoten, Karte, Bildfragen) laufen im Mitmachen direkt. Im Hörspiel macht sie die Crew, und sie landen in der Etappe (Abschnitt 3).

### 7.8 Crew und Gespräch
- **HR21 Die Crew wächst langsam** (N 07.11.): Hinnerk und Smilla von Anfang an; Klabauter ist einfach abgehauen, die Crew vermisst ihn, und er landet in 1-6 wieder an Bord; Quirin steigt in 2-7 zu. Wer noch nicht da ist, spricht nicht. ⚙ (`crew`, Feld `wer`)
  - **Quirin oder Jasper, nie beide zugleich** (N 07.11.): Quirin geht in 4-5 von Bord (Probetag auf einem Versorgungsschiff), Jasper ist von 4-6 bis 6-6 dabei, Quirin kommt in 7-3 zur Prüfung zurück. ⚙ (`crew`, Felder `bis` und `zurueck`)
  - Die Gäste von außen (Hafenmeisterin, Schleusenwärter, Polizei, Seenotretter, Harms am Telefon) reden aktiv mit und tragen ganze Szenen.
- **HR22 Stimmen je Szene:** höchstens drei.
  - **Klabauter schreit eher** (N 07.11.): er krächzt und kreischt, kurz und laut, nie in ganzen Sätzen. Im Kajütenfunk war er zu präsent: höchstens drei Einwürfe je Folge (etwa 5 % der Sätze), meist das Merkwort („Dreihundert! Dreihundert!“). Er ist das Salz, nicht die Suppe.
- **HR23 Natürliche Gespräche:** nach `docs/dialog-regeln.md`, mit Reinreden und Überlappen (dort §4).
- **HR24 Anrede nach Wahl** (N 07.11.): Beim Kennenlernen wählst du, wie die Crew dich anredet: als Frau, als Mann oder neutral (`S.profile.anrede`, Standard neutral). Stufen und Wörter stehen in Abschnitt 2 (Tabelle „Anreden“).
  - Im Skript: `{{anrede:w=min Deern|m=min Jung|n=Landratte}}`. Jede Variante wird vertont, gespielt wird nur die gewählte.
  - Die Anrede steht in einem kurzen eigenen Satz oder am Satzanfang („Min Deern, …“), damit nur dieser kurze Teil dreimal vertont werden muss und der Rest des Satzes für alle gleich bleibt.
  - Höchstens zwei Anreden je Szene; die meisten Sätze kommen ohne aus („du“ reicht).
- **HR25 Sprüchekiste statt Wiederholung** (N 07.11.): Erkennungssätze und Klassiker der Figuren stehen in `podcast/sprueche.json`, je Figur und Lage mit vielen Varianten und einem Budget (wie oft auf der ganzen Reise).
  - Ein Spruch kommt höchstens so oft, wie sein Budget erlaubt, und nie zweimal in derselben Folge. Dazwischen liegen mindestens zwei Folgen (`abstand`).
  - Ist ein Budget aufgebraucht, nimmt man eine andere Variante derselben Lage. Jede Lage hat genug Varianten für die ganze Reise.
  - Geschrieben wird Folge für Folge; jede neue Folge schöpft aus der Kiste und dem Erzählfundus (`podcast/wortschatz.md` §13), neue gute Sprüche kommen in die Kiste.
  - Im Skript steht ein Klassiker als `[[SPRUCH: id]]` vor dem Satz. `node tools/sprueche-pruefen.js` zählt sie in allen Folgen und meldet überzogene Budgets und zu kurze Abstände. ⚙
- **HR26 Wer man schon kennt, stellt sich nicht vor** (N 07.11.): Hinnerk, Smilla, Klabauter und Backbord lernst du in Folge 0 kennen. Ab 1-1 werden sie vorausgesetzt.
  - Wer neu dazukommt, stellt sich nie stumpf vor. Jede Figur hat ihren eigenen Auftritt in der Geschichte: erst zeigt sie, wie sie ist, den Namen erfährt man nebenbei. Harms: am Ende von 1-1 am Telefon („Harms.“). Quirin: fängt in 2-6 ungefragt deine Leine, in 2-7 fragt er, ob er mitdarf. Jasper: ruft dir in 4-6 von seiner Boje falsche Ratschläge zu. Gäste: kommen mit ihrem Anliegen (Strom nicht bezahlt, Kontrolle, Liegeplatz über Funk).
- **HR28 Ernstfall erst später** (N 07.11., Grundsatz): Gefahrenlagen (Gasgeruch, Feuer, Wassereinbruch, Mensch über Bord, Motor fällt aus, Nebel, Seenot) passieren nie in der Folge, in der das Thema erklärt wird.
  - In der Heimat-Folge wird es erklärt: ruhig, mit Prinzip, Garn, Übung oder Einweisung („Wenn's hier mal nach Gas riecht …“).
  - Frühestens zwei Folgen später passiert es überraschend, und du musst reagieren. Das ist zugleich die Wiederholung der Fragen (verteiltes Abrufen statt Wiederholen am Stück).
  - Im Plan: Feld `ernstfall` [{was, fragen}] in der späteren Folge, die Fragen stehen in `wieder`. ⚙
  - Erster Fall: Gas in 1-2 erklärt, Gasgeruch beim Kochen in 1-7.
  - Umgestellt am 07.11. (B173): Nebel erklärt in 4-5 (Hinnerks Garn vom Zusammenstoß mit Harms auf der Elbe 1991) und 4-6 (Klabauters Horn-Spiel „Wer tutet da?“), Ernstfall Nebelbank 5-6. Mensch über Bord geübt mit Oskar in 5-7, Ernstfall Smilla über Bord 6-5. Notsignale erklärt in 6-1, Ernstfall Jaspers Mayday 6-6. Die Sturmvorbereitung 6-4 bleibt Einweisung: Der Sturm zieht erst auf, er trifft in 6-5.
- **HR29 Wichtiges kommt öfter vor: der Dreiklang** (Nutzer 08.11., bestätigt und ausgeweitet; vorher Vorschlag vom 07.11.): Viele Themen hört man dreimal, jedes Mal anders, nie als Wiederholung am Stück.
  1. **Überblick:** das große Bild früh in der Geschichte (HR4, HR5, Feld `ueberblicke`).
  2. **Heimat-Folge:** dort wird das Thema erklärt und abgefragt (Feld `fragen`).
  3. **Wiedersehen:** mindestens zwei Folgen später kommt es überraschend als Handlung zurück, und du entscheidest selbst (Feld `lage` [{was, fragen}], wie der Ernstfall bei HR28). Danach gilt es als geübt.
  - **Nicht zu sparsam:** überall, wo es in die Geschichte passt, nicht nur bei Notfällen. Vor allem Schwerpunkt-Fragen, System-Blöcke, Fallen und alles, was man an Bord wirklich tut (Anlegen, Ausweichen, Tonnen, Lichter, Motor, Wetter).
  - **Nicht alle Fragen:** Reines Nachschlagewissen (wo etwas steht, welche Verordnung) kommt nur in der Fragerunde wieder, über die Lernkartei.
  - **Formen fürs Wiedersehen:** du entscheidest, du korrigierst jemanden, der irrt (Quirin, Jasper, Hinnerk), du erklärst es einem Neuen, ein Gast stellt die Frage, Klabauter schreit das Merkwort im falschen Moment.
  - **Kurz und in der Szene** (HR7): Ein Wiedersehen dauert selten länger als eine Minute. Es wird nicht neu erklärt, höchstens ein Satz Erinnerung („Weißt noch, in Kuttershaven?“), wenn du danebenliegst.
  - **Obergrenzen je Folge:** höchstens zwei Wiedersehen oder Ernstfälle und etwa acht wiederholte Fragen (Feld `wieder`), sonst verliert die Folge ihr eigenes Thema. `node tools/reiseplan.js --warn` meldet mehr sowie System-Blöcke, die nie wiederkommen. ⚙
  - Im Hörspiel-Modus zählt ein Wiedersehen ohne Antwort als „gehört“, im Mitmachen mit Antwort fürs Wiederholen (HR30).
  - **Im Skript:** Ein Wiedersehen ist eine kurze Szene mit `[[WAHL: sbf:n | … ]]` (Frage in eigener Form, HR13) und einer `[[VERTIEFUNG: sbf:n]]` von ein, zwei Sätzen („Weißt noch …“). Damit landet die Frage auch in der Fragerunde der Folge (HR30). Das Folgenblatt nennt sie unter „Wiedersehen“.
  - **Für die Geschichte:** Wiedersehen tragen die roten Fäden. Die Crew erinnert sich an Erlebtes (das Heck in Kuttershaven, Hinnerks Rempler), Running Gags bekommen Anlass, und man merkt, dass man besser wird: Was am Anfang erklärt werden musste, entscheidest du später allein.
  - Stand 08.11.: 22 Wiedersehen und 3 Ernstfälle im Plan, jeder System-Block kommt mindestens einmal wieder.

- **HR31 Quirin irrt, wo Binnen anders ist** (N 08.11., B175): Immer wenn eine Binnenregel von der Seeregel abweicht, macht Quirin genau diesen Fehler, überzeugt und aus Erfahrung („Is bei uns auf der Donau aa so“). Die Crew stellt es richtig und sagt dazu, dass er auf dem Fluss recht hätte. So lernt man den Binnenschein gleich mit.
  - Beispiel: Begegnung im engen Fahrwasser (Frage 36). Quirin: „Der gegen den Strom fährt, muss ausweichen.“ Auf See: Fahrt runter und genug Passierabstand.
  - Quirin ist von 2-7 bis 4-5 und ab 7-3 an Bord. In dieser Zeit wird jede passende Abweichung zu einem Wiedersehen der Form „Du korrigierst“ (Form W3, beschlossen 08.11., O171).
  - Fachlich: Die Binnenregel wird nur genannt, wenn sie belegt ist (R8, ohne `quellen/` markieren).
- **Formen fürs Wiedersehen W1–W9** (beschlossen 08.11., O171: „alle gut“; alle neun dürfen vorkommen, abwechselnd): Du entscheidest, die Crew fragt dich, du korrigierst, du erklärst einem Neuen, ein Gast fragt, du meldest als Ausguck, Wette in der Crew, Hinnerk macht etwas falsch, Klabauter fängt das Merkwort an. Hörprobe: Hocker → „🧪 Test: Wiedersehen W1–W9“ (`podcast/skripte/test-wiedersehen.md`). Bei „du erklärst“ (W4) wählst du die Erklärung; wählst du falsch, handelt der andere danach, es geht etwas schief, und die Crew erklärt es richtig (zählt als falsch).
- **HR32 Antworten kommen mit der Frage** (N 08.11., B177): Im Mitmach-Modus stehen die Antworten auf dem Bildschirm, sobald die Frage beginnt, auch wenn Harms noch vorliest. Wer es weiß, tippt sofort; die Stimme hört dann auf, Glocke und Denkpause entfallen. Die Reihenfolge bleibt wie im Skript, damit Alfa bis Delta zu dem passen, was Harms sagt (umgesetzt in `kurs.js` v5.48).
- **HR33 Die Frage steht immer da** (N 08.11., B177): Wer beim Zuhören nicht mitgekommen ist, muss die Frage lesen können, bevor er antwortet. Bei Harms steht der amtliche Wortlaut mit Bild, bei der Crew der Satz, mit dem sie fragt. Jede Antwort trägt ihr Funkwort (Alfa, Bravo …), und der Knopf „🎙️ Zuruf“ nimmt die Antwort per Stimme an, erst wenn die Frage zu Ende gesprochen ist.
- **HR34 Logik-Probe vor jeder Vertonung** (N 08.11., B177): Der Nutzer hörte Sätze, die keinen Sinn ergaben, besonders bei Hinnerk und der Hafenmeisterin. Vor jeder Vertonung liest Claude jede Folge Zeile für Zeile auf Logik: Passt die Antwort zur Frage davor? Stimmt der Satz mit der Szene (wer wo steht, was schon passiert ist, welche Tageszeit)? Wird ein Spruch nur benutzt, wenn sein Anlass da ist (zum Beispiel „Tonne zehn“ nur, wenn Smilla frech war)? Passt eine Anspielung zu einer früheren Folge wirklich? Schlusssätze von Harms passen zum Tag (kein „Morgen wieder“, wenn er am selben Tag noch einmal anruft). Gefundene Fehler aus der ersten Probe stehen in `PODCAST_STATUS.md` B177. Was eine Maschine finden kann, prüft seit v5.50 `node tools/logik-pruefen.js` vor jedem Commit (Figur nicht an Bord, Harms' „Morgen wieder“ am selben Tag, fast doppelte Sätze, Frage ohne Auflösung, Spruch ohne Anlass).
- **HR35 Die Figuren spielen mit** (N 08.11., B179): Die Gesichter auf der Bühne zeigen Gefühle: normal, froh, lacht, genervt, erschrocken, skeptisch, traurig, nachdenklich, seit v5.52 auch die sanfteren staunt, besorgt, grinst, zwinkert und zufrieden (Nutzer 08.11.: die großen Augen sind zu extrem für Alltagsprobleme; „erschrocken“ nur noch, wenn das Skript es ausdrücklich setzt). Die Laune einer Zeile kommt aus `[[GESICHT: laune]]` (nur für die App, geht nicht an ElevenLabs, ändert also keine Vertonung) oder aus der Regie-Marke `[[INTENTION: …]]` (lachend → lacht, genervt → genervt, aufgeregt → staunt …), sonst aus ein paar Wörtern („Schiet“ → genervt, „Richtig“ → froh). Die anderen reagieren mit: Lacht einer, grinsen alle; nach deiner Antwort freut sich die Crew oder schaut skeptisch. Beim Schreiben neuer Folgen setzt Claude `[[GESICHT]]` dort, wo das Gesicht etwas erzählt, was der Satz allein nicht zeigt.
- **HR36 Die Bühne zeigt, wer wo ist** (N 08.11., B180): Im Dunkelmodus (Nachtbühne, Standard für alle Folgen) stehen alle, die laut Reiseplan an Bord sind, als runde Gesichter auf dem Hintergrund, ohne Balken: in der Kajüte im Kreis um den Tisch, am Steg und in Fahrt an ihrem Platz im Boot (wer steuert, sitzt am Motor). Gäste stehen sichtbar außerhalb (Hilke auf dem Steg, Harms am Telefon in der Ecke). Den Ort liest die App aus `[[SZENE: …]]`. Immer nur eins im Vollbild: die Crew, solange geredet wird, die Animation (wer spricht, klein in der Ecke) oder die Frage. Kein Text zum Mitlesen im Dunkelmodus, oben nur Symbole (⏸ ⏹ ⛶ ⚙). Gewählt am 08.11. (B181): Kajüte im Lichtkegel mit etwas Perspektive, Tisch mit Kaffee in der Mitte und Bullauge mit Wetter wie in der App; Steg von der Seite mit dem Gast oben auf dem Steg; Fahrt von der Seite mit Hinnerk am Motor; Telefon mit Harms groß und der Crew klein in einer Reihe; Abend auf dem Kajütdach mit Mond; Besuch als zwei Boote nebeneinander; Schleuse von oben mit dem Wärter auf der Mauer. Hinnerks Pfeife geht nur mit dem Streichholz an und ist aus, sobald jemand weiterredet.
- **HR37 Glocke, Antwort, Rückmeldung** (N 08.11., B180): Die Schiffsglocke läutet genau einmal, wenn eine Frage kommt; doppelte Glocken im Skript spielt die App nur einmal, eine Glocke nach der Frage gar nicht. Dann die Frage, dann deine Antwort, dann ein Ton für richtig oder falsch, dann sagt einer aus der Crew (der, der gefragt hat) kurz, ob es stimmt (Sätze aus der Sprüchekiste, werden mit der Folge vertont). Bei falsch erklärt die Crew danach genauer (Vertiefung).
- **HR38 Antworten werden vorgelesen** (N 08.11., B181): Im Auto schaut niemand auf den Bildschirm. Vor jeder Wahl liest die Stimme alle Antworten mit Funkwort und kurz vor („Alfa: ab null Komma fünf. Bravo: ab null Komma acht.“), auch bei den Fragen der Crew, nicht nur bei Harms. Man darf antworten, sobald die Frage sichtbar ist: Der Zuruf hört sofort mit; solange die Stimme noch liest, zählt nur ein kurzer Zuruf („Alfa“), damit die vorgelesene Antwort aus dem Lautsprecher nichts auslöst. Im Auto hört das Mikrofon die Stimme mit; darum zählt während des Vorlesens auch ein Funkwort am Ende eines längeren erkannten Satzes. Ein erkannter Zuruf wirkt wie Antippen: Die Stimme hört auf, die Auflösung kommt. `podcast-pruefen.js` meldet eine Wahl ohne vorgelesene Antworten als Fehler.
- **HR39 Keine Frage hält die Folge an** (N 08.11., B182): Nach jeder Frage, auch nach einer zum Raten, sagt die App sofort, ob es stimmt (Ton, dann ein Satz der Crew); beim Raten zählt es weiter nicht. Kommt acht Sekunden nach dem Ende der Frage keine Antwort, tickt die Uhr; nach weiteren vier Sekunden geht es ohne Antwort weiter, mit der genaueren Erklärung (Vertiefung). Pause hält die Uhr an. Darum im Skript nach einer Ratefrage kein „Die Auflösung kommt gleich“.
- **HR40 Das Wetter gehört der Geschichte** (N 08.11., B182): Jede Folge hat ein Wetter (heute in `HOERREISE` in index.html, vierte Angabe; Szenen können es mit Wörtern wie Regen, Nebel, Sturm ändern). Das Bullauge in der Hörreise zeigt das Wetter der Geschichte. Das Wetter an Bord in der App richtet sich nach der nächsten Folge: meist gleich, öfter etwas schlechter, selten etwas besser, nie ganz anders.
- **HR41 Animationen nutzen, wo es eine gibt** (N 08.11., B182): Gibt es zu dem, worüber die Crew gerade redet, eine Animation, kommt sie ins Skript, aber nur, wenn sie genau das zeigt, worüber gerade geredet wird (Nutzer 08.11.: zwei unpassende in Folge 1 wieder entfernt) (`[[ANIM: id]]`, alle gebauten Animationen sind erlaubt, nicht nur die aus dem Kursplan). Animationen laufen im Dunkelmodus randlos über die ganze Breite.
- **HR42 Die Bühne steht still** (N 08.11., B183): Die Standardansicht des Players ist fest: ein Quadrat in der Mitte, der Hintergrund breiter als der Bildschirm und am Rand abgeschnitten (randlos). Kein Mitlesetext im Dunkelmodus, keine Wipp-Bewegung beim Sprechen, wer spricht, leuchtet nur. Gäste stehen mit ganzem Körper da, die Crew bleibt als Gesicht; Klabauter ist nur wenig größer als Backbord. Was die Szene beschreibt, steht im Bild (an der Tankstelle die Zapfsäule, Hilke daneben). Das Boot ist überall dasselbe wie in den Animationen (`boot.js`). Bedienung unten: ⛶, großer Knopf ▶/⏸, ⚙️; kein Stopp, „Szene wiederholen“ liegt hinter ⚙️. Fragen stehen groß auf dem dunklen Grund, darunter die Antworten als Karten. Prüfungsrelevantes zeigt ein rotes Ausrufezeichen, das beim ersten Mal erklärt wird (später in Folge 0).
- **HR43 Harms ruft selbst an** (N 08.11., B183): Niemand kündigt Harms an. Das Telefon klingelt, Harms spricht zuerst. Beim ersten Anruf stellt er sich vor (Name, Kapitän der Albertine, bildet aus und nimmt Prüfungen ab, ruft jeden Tag mit Fragen im Wortlaut an), später reicht „Harms.“ Ohne erzeugtes Geräusch klingelt der Player mit einem einfachen Ton.

### 7.9 So verbessern wir weiter
- Nach jedem Hören fragt Claude: „Was hat gestört, was war gut?“ Daraus wird eine neue Regel hier oder ein Beispiel in der Beispiel-Bibliothek (`docs/dialog-regeln.md` §2b).
- Was prüfbar ist, kommt in ein Werkzeug:
  - der Plan in `tools/reiseplan.js`
  - die Skripte in `tools/podcast-pruefen.js`
  - die 3D-Aufgaben in `tools/folgen-pruefen.js`
  - die Sprüche in `tools/sprueche-pruefen.js`
- Alle vier laufen vor jedem Commit.

### 7.10 Folgenblatt (Vorlage für jede Folge)
- **Kopf:** Folge, Titel, Tag, Ort und Szene(n), Tageszeit und Wetter, Revier (hörbar)
- **Blöcke:** welche Themenblöcke (◼ oder ▸), welche Fragen ausführlich, welche kurz
- **Überblick:** falls einer in dieser Folge kommt
- **Muster:** Ablaufmuster aus 7.3 und warum
- **Rolle:** zuhören, Ausguck, Handgriffe, mitmachen, selbst oder führen
- **Crew:** wer spricht (höchstens drei je Szene; Quirin oder Jasper), wer irrt, was Quirin fragt, Klabauters Einwürfe (höchstens drei), Anrede-Stellen (HR24), Klassiker aus der Sprüchekiste (HR25)
- **Ablauf:** Szenen in Reihenfolge, je Szene in einem Satz, was passiert, was du tust und was die Crew sagt; Zwischenfragen mit Form (HR13)
- **Bilder und Aufgaben:** was mitläuft, was in die Etappe wandert
- **Ernstfall:** welcher frühere Stoff hier überraschend passiert (HR28)
- **Wiedersehen:** welche früheren Fragen hier als Handlung mit eigener Entscheidung zurückkommen (HR29, Feld `lage`), und wer dabei irrt oder fragt
- **Fragerunde:** Rahmen (HR18), neue Fragen und fällige
- **Haken:** wie die Folge endet
- **Heft:** was sich ändern kann

## 8. Reiseplan (Vorschlag zum Festschreiben)
<!-- PLAN:START -->

### Tag 1: Leinen los
**Wo:** Kuttershaven → Fluss Brede → Ankerbucht Schilfwinkel · **Du:** Passagier: zuhören, Ausguck, kleine Handgriffe

**Geschichte:** Aufbruch zu Smillas neuem Schiff. Klabauter ist verschwunden, Hinnerk tut gelassen. Abends im Schilfwinkel landet er wieder auf dem Kajütdach. Harms ruft an: Prüfung in sieben Tagen, an Bord seines Segelschiffs Albertine. Hinnerk will „vor Dunkelheit ankern, immer“ (erste Spur seines Geheimnisses).

**Kiste:** Die Miniatur-Frieda steht schon auf dem Tisch; die Kiste bleibt zu. · **Haken:** Harms am Telefon: „Sieben Tage. Wer zu spät kommt, fährt allein heim.“

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 1-1 | 🌧️ | Erster Morgen | Kajüte, Kuttershaven | 👂 zuhören | Der Morgen nach dem Anheuern (Folge 0): Klabauter ist weg, Backbord frisst seinen Zwieback. Hafenkino: Ein Charterboot legt chaotisch an, vier Leute rufen, keiner ist Schiffsführer. Einer macht um halb neun ein Bier auf: Promille, aber auch körperliche Mängel (Hinnerk fällt Smilla ins Wort und bietet Kaffee an, erste Spur seines Geheimnisses). Ein Leih-Elektroboot ohne Schein: Hinnerk irrt. „Vor Dunkelwerden. Immer.“ Dann ruft Harms an und prüft zum ersten Mal. Skript: podcast/folgen/reise-1-1.md.<br>🧭 *Überblick: Wer an Bord das Sagen hat und welche Papiere man braucht* | 1-2,59<br>G1.1 ▸ |
| 1-2 | ⚓ | Gas, Sprit und Streichholz | Steg und Tankstelle Kuttershaven | ✋ Handgriffe | Tanken an der Bootstankstelle: Die Hafenmeisterin (Hilke) kommt wegen des unbezahlten Stroms. Hinnerk will an der Zapfsäule die Pfeife anzünden, Smilla nimmt ihm die Streichhölzer weg. Hilke erklärt, warum Dampf und Gas nach unten kriechen. Du reichst den Kanister und hältst den Lappen. Öl in der Bilge, die Gasflasche an Deck. Einweisung am Gashahn: Wenn's mal nach Gas riecht … (der Ernstfall kommt in 1-7). Logbuch mit Harms als Sprachnachricht. Skript: podcast/folgen/reise-1-2.md. | 43,49,62-66<br>G4.1 ◼ |
| 1-3 | ☀️ | Das Heck zieht weg | Hafenbecken und Ausfahrt | 👀 Ausguck | Erst raten: Wohin zieht das Heck, wenn Hinnerk rückwärts aus der Box fährt? Überblick „Wie ein Boot fährt“, während der Motor warm wird. Das Heck zieht nach Backbord: Radeffekt, Smilla irrt bei „rechtsdrehend“, darum legen wir links an. Ein Raser im Hafen, die Lieger knallen an die Stege. Die Fähre in der Brede: Außenborder gegen Ruder, dann Sog und Schwell. Harms ruft an. Skript: podcast/folgen/reise-1-3.md.<br>🧭 *Überblick: Wie ein Boot fährt: Antrieb, Ruder, Radeffekt, Sog* | 34,36-37,41,44-48,50-51,61<br>G2.1 ◼ G3.2 ◼ |
| 1-4 | ☀️ | Rechts halten | Fluss Brede | 👀 Ausguck | Erste Begegnung auf dem Fluss: Die Crew weicht aus und erklärt die zwei Grundregeln. Bordsprache: in Fahrt, Luv und Lee. Du sagst Boote an.<br>🔁 *Wiedersehen: Hinnerk geht ans Telefon und lässt die Pinne los. Wer führt jetzt das Boot? Smilla klärt es, du hörst mit.* | 3,6,8-9,14-15<br>↻ 1<br>G1.2 ◼ G5.2 ▸ |
| 1-5 | 🧶 | Garn: Der Motor, der kochte | Fluss Brede (Zeitraffer) | 👂 zuhören | Unterwegs erzählt Hinnerk, wie ihm einst der Motor heiß lief. Warnlampen, Öl in der Bilge, Kühlwasser. Smilla stellt seine Version richtig. | 42,52-57,60<br>↻ 43,49<br>G2.2 ◼ |
| 1-6 | 🌊 | Schilfwinkel | Ankerbucht Schilfwinkel | ✋ Handgriffe | Ankern vor Sonnenuntergang (Hinnerk besteht drauf). Wie man anlegt und ankert, Abstand zum Schilf, Brutplätze, woran man das Wetter sieht. In der Dämmerung landet ein Papagei auf dem Kajütdach: Klabauter. „Dat is der Klabautermann. Der bleibt.“<br>🔁 *Wiedersehen: Im engen Fluss liegen Boote am Ufer fest, und Hinnerk will mit voller Fahrt vorbei. Du sagst, was zu tun ist.* | 31-33,35,38-40,58,71<br>↻ 61<br>G3.1 ▸ G7.1 ▸ |
| 1-7 | 🌧️ | Erster Abend | Kajüte, Schilfwinkel | 👂 zuhören | Es wird dunkel, das Ankerlicht geht an: wozu Lichter da sind. Beim Kochen riecht es plötzlich nach Gas: Backbord hat sich am Kocher gewärmt, und du weißt aus 1-2, was zu tun ist. Danach zeigt Smilla den Feuerlöscher und die Westen. Harms ruft an, danach fragt Smilla, was zwischen den beiden ist. Hinnerk: „Wir hatten mal ’n Rempler. Auf der Elbe.“ Was nach einem Zusammenstoß zu tun ist, wann Notsignale erlaubt sind. Klabauter sitzt seit dem Schilfwinkel wieder auf dem Kajütdach.<br>🧭 *Überblick: Lichter: das System (wer bin ich, wohin fahre ich, was tue ich)*<br>🚨 *Ernstfall: Beim Kochen riecht es plötzlich nach Gas (Backbord am Kocher). Man muss reagieren: Hahn zu, lüften, keine Funken.*<br>🔁 *Wiedersehen: Nach dem Feierabendbier will Hinnerk „nur schnell“ umankern. Darf er das?* | 7,10-13,67-70,72<br>↻ 2,64<br>G4.2 ▸ G5.1 ◼ |

### Tag 2: Tonnen und dicke Pötte
**Wo:** Strom Elvmünde → Klüverhafen · **Du:** kleine Handgriffe, erste Minuten an der Pinne unter Aufsicht · **Knoten:** acht, klampe · **Navigation:** N0 Karte lesen

**Geschichte:** Auf dem großen Strom mit Frachtern. Abends ein fremder Hafen: Die Crew funkt den Hafenmeister an, du hörst mit. Hinnerk gibt Smilla in der Dämmerung das Steuer. Am Steg wartet Quirin und will mit.

**Kiste:** Fach 1: Tau und Mini-Klampe. · **Haken:** Quirin, mit Seesack auf dem Steg: „Morgen a Schleus’n? Do bin i dahoam.“

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 2-1 | 🌧️ | Die Kiste | Kajüte, Schilfwinkel | 🪢 mitmachen | Morgens die erste Kiste: Tau. Achtknoten am Leinenende, damit nichts ausrauscht. Smilla zeigt auf der Karte das Fahrwasser und erklärt, welche Familien von Seezeichen es gibt.<br>🧭 *Überblick: Seezeichen: die vier Familien und wie Feuer sprechen* | 156-157,190-194<br>S5.2 ◼ |
| 2-2 | ☀️ | Grün an Steuerbord | Tonnenkette in die Elvmünde | 👀 Ausguck | Du sagst jede Tonne an, Smilla steuert. Wer im Fahrwasser fährt, hält sich rechts. | 195-199<br>↻ 157<br>S5.3 ▸ |
| 2-3 | ☀️ | Dicke Pötte | Elvmünde, Fahrwasser | 🧭 kurz an die Pinne | Ein Frachter im engen Fahrwasser, eine Fähre quert. Was im Fahrwasser gilt: rechts halten, nicht behindern, richtig queren. Du darfst auf gerader Strecke kurz die Pinne halten, Hinnerk daneben.<br>🔁 *Wiedersehen: Ein Frachter überholt im engen Fahrwasser, die Frieda tanzt. Du entscheidest, wie weit ihr Platz macht und ob ihr Fahrt rausnehmt.* | 161,165-168,271<br>↻ 34,37<br>S6.1 ▸ |
| 2-4 | ☀️ | Wer muss weg? | Elvmünde | 👀 Ausguck | Wann wird es gefährlich? Peilung, die stehen bleibt, Ausguck, AIS. Dann die Rangfolge: wer manövrierunfähig ist, wer behindert ist, wer wem ausweicht. Echte Lagen auf dem Strom.<br>🧭 *Überblick: Ausweichen: das Prinzip (wer weicht, wer hält Kurs, Rangfolge)*<br>🔁 *Wiedersehen: Ein Motorboot kommt von Steuerbord auf Kollisionskurs. Hinnerk fragt nur: „Und?“ Du entscheidest.* | 82-83,125,128-132,272-273<br>↻ 14,15<br>S2.1 ◼ S2.3 ◼ |
| 2-5 | ⚓ | Hafenfunk | Einfahrt Klüverhafen | 👂 zuhören | Die Crew funkt den Hafenmeister an, du hörst mit. Ein Fischer gibt das Gefahrsignal, irgendwo läutet eine Glocke. Smilla ordnet die Schallsignale: kurz, lang, Manöver, Nebel, Warnung. Hinnerk legt mit Backbord an und erklärt, warum.<br>🧭 *Überblick: Schallsignale: kurz und lang, Manöver, Nebel, Warnung* | 122-124,141,162-164<br>↻ 161<br>S4.3 ◼ |
| 2-6 | ⚓ | Fest auf Klampe | Steg Klüverhafen | 🪢 mitmachen | Ein Fremder fängt deine Leine und belegt sie perfekt auf der Klampe, ungefragt; Hinnerk brummt (das ist Quirin, man erfährt es in 2-7). Danach belegst du selbst die Klampe an der Miniatur-Frieda und echt am Steg (Klampe aus Fach 1). Klabauter petzt jeden Fehler.<br>🔁 *Wiedersehen: Anlegen in Klüverhafen: Wind und Strom von vorn, der Platz ist an Backbord frei. Du sagst Hinnerk, wie er anlegen soll.* | –<br>↻ 35,40,48 |
| 2-7 | 🌧️ | Hafenabend | Kajüte, Klüverhafen | 👂 zuhören | In Klüverhafen sitzt ein Bayer auf dem Steg: Quirin, Binnenschiffer, kennt jedes Boot und jeden Knoten, aber die Regeln auf See nicht. Er will den SBF See und fragt, ob er mitdarf. Hinnerk brummt, Smilla sagt ja. Wiederholung des Tages mit Klabauter als Quizmaster, Quirin rät mit. | –<br>↻ 157,195,196,122,163 |

### Tag 3: Schleuse und Kanal
**Wo:** Schleuse Klappdörp → Kanal → Kanalhafen Moorende · **Du:** mitmachen: Leinen in der Schleuse, steuern im Kanal · **Knoten:** rundtoern, webelein · **Navigation:** N1 Position, N2 Kurs und Distanz

**Geschichte:** Quirin ist an Bord: Schleuse und Kanal sind sein Revier, da ist er plötzlich der Experte, auf See dagegen Anfänger wie du. Vor der Schleuse leuchten die Lichter rot: warten. In der Kammer führst du die Leine. Abends entscheidet Quirin, bis zur Prüfung zu bleiben.

**Kiste:** Fach 2: Ring, Kursdreieck, Zirkel und die Übungskarte der Reise. · **Haken:** Quirin erzählt vom alten Wrack im Watt, „da wo der Hinnerk damals…“. Hinnerk schweigt.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 3-1 | 🌧️ | Schilderwald | Kajüte, Klüverhafen | 👂 zuhören | Quirins erster Morgen an Bord. Tafelzeichen kennt er vom Fluss und fragt sie ab wie ein Quizmaster, dazu, wie lang ein kurzer und ein langer Ton sind. Trocken, aber laut.<br>🧭 *Überblick: Zeichen am Ufer: Verbot, Gebot, Hinweis, Sperrgebiet* | 4-5,16-20,22-27<br>↻ 141,163<br>G6.1 ◼ G6.2 ◼ |
| 3-2 | ☀️ | Rot über rot | Vor der Schleuse Klappdörp | 🪢 mitmachen | Die Schleusenlichter zeigen rot, du musst warten und das richtig entscheiden. Brücken, Schleusen und der große Kanal. Die Crew meldet sich per Funk an, Quirin weiß alles besser. | 21,28-30,173-176,178<br>G6.3 ▸ S6.5 ▸ |
| 3-3 | 🚧 | In der Kammer | Schleusenkammer Klappdörp | 🪢 mitmachen | Leinen führen, Rundtörn mit zwei halben Schlägen am Ring (Fach 2), Webeleinstek am Poller. Das Wasser steigt. | –<br>↻ 30 |
| 3-4 | ☀️ | Kanalfahrt | Kanal | ⛵ selbst | Du steuerst im Kanal: Badestellen und Tempo, Wasserski, Sperr- und Warngebiete. Quirin redet ununterbrochen.<br>🔁 *Wiedersehen: Im Kanal kommt ein großes Schiff entgegen, es wird eng. Du entscheidest, wie ihr begegnet.*<br>🔁 *Wiedersehen: Mitten im Kanal piept der Temperaturalarm. Du sagst, was jetzt zu tun ist und woran es liegen kann.* | 169-170,177,179-184,187-189<br>↻ 36,52,53<br>S6.2 ▸ S6.4 ◼ |
| 3-5 | ☀️ | Segler im Kanal | Kanal | ⛵ selbst | Ein Segler kreuzt, ein Schnellerer will überholen. Wer weicht wem aus, und wann musst du das Manöver des letzten Augenblicks fahren?<br>🔁 *Wiedersehen: Ein Segler mit eingeholten Segeln tuckert unter Motor vor euch her. Wer weicht wem aus?*<br>🔁 *Wiedersehen: Ein schnelles Motorboot will überholen, aber am Ufer steht ein Überholverbot. Was sagst du ihm?* | 79-81,126-127,135-137,139-140<br>↻ 6,7,4,5,17<br>S2.2 ▸ S2.4 ▸ |
| 3-6 | 🌧️ | Der Kartentisch | Kajüte, Kanalhafen Moorende | 🪢 mitmachen | Kursdreieck und Zirkel aus Fach 2: Position ablesen, Kurs und Distanz zum Watt messen. Quirin rechnet falsch, Smilla nicht.<br>🧭 *Überblick: Navigation: Karte, Kurs, Peilung, Gezeiten* | 231-232,234-239<br>S7.1 ◼ |
| 3-7 | ⚓ | Hafenkino Moorende | Kanalhafen Moorende | ⛵ selbst | Abends ist das Becken leer, Hinnerk lässt dich üben: Aufstoppen, Wenden auf engem Raum, Anlegen. Die Leute am Steg schauen zu.<br>🔁 *Wiedersehen: Rückwärts aus der Box zieht das Heck nach Backbord, genau wie in 1-3. Du entscheidest, an welcher Seite du anlegst.* | –<br>↻ 41,47,48 |
| 3-8 | 🌧️ | Ab morgen See | Kanalhafen Moorende | 👂 zuhören | Abends in Moorende: Ab morgen gelten andere Regeln als auf Quirins Flüssen. Welche Regeln wo gelten. Quirin erzählt, warum er hier ist: Er will umsatteln, auf einen Job auf hoher See, und der Seeschein ist der erste Schritt. Und er hofft, dass sich die Seekrankheit gibt. Dann seine Andeutung zum Wrack, „da wo der Hinnerk damals …“<br>🧭 *Überblick: Welche Regeln gelten wo: Binnen, Seeschifffahrtsstraße, offene See (mit Quirin)* | 73-74,152-153<br>S1.1 ◼ |

### Tag 4: Watt und Wrack
**Wo:** Wattenmeer Groter Sand → Wrackgebiet → Insel Lüttoog · **Du:** selbst steuern mit Aufsicht, ankern · **Knoten:** palstek, kreuz · **Navigation:** N3 Zeit, Fahrt, Tide

**Geschichte:** Ebbe und Flut bestimmen den Tag. Am Wrack will die müde Crew ankern, die Wasserschutzpolizei kommt. Beim Trockenfallen erzählt Hinnerk endlich vom Rempler mit Harms im Nebel, dann geht Quirin übers Watt zu seinem Probetag. Auf Lüttoog liegt Jasper.

**Kiste:** Fach 3: dickes Tau und Mini-Anker. · **Haken:** Die Tide zwingt zur Nachtfahrt. Hinnerk wird still.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 4-1 | 🌧️ | Ebbe und Flut | Kajüte, Moorende | 👂 zuhören | Smilla erklärt die Gezeiten mit dem Teebecher. Wann kommt man über den Priel? | 233,249-255<br>↻ 236<br>S7.4 ◼ |
| 4-2 | ☀️ | Pricken und Kardinäle | Priel im Groter Sand | ⛵ selbst | Du steuerst durch den Priel. Kardinaltonnen zeigen, wo das Wasser frei ist.<br>🔁 *Wiedersehen: Im Priel verwechselt Quirin Rot und Grün. Du sagst, an welcher Seite die Frieda bleibt.* | 200-207<br>↻ 157,195,196<br>S5.4 ◼ |
| 4-3 | ☀️ | Wrack und Wasserschutz | Wrackgebiet im Groter Sand | ⛵ selbst | Die Crew ist müde und will am Wrack ankern. Du entscheidest. Dann kommt die Wasserschutzpolizei: Ankerverbot, wer Schiffsführer ist, Papiere, das Anhaltesignal und wer sonst noch kontrollieren darf.<br>🔁 *Wiedersehen: Die Wasserschutzpolizei fragt: Wer ist hier Schiffsführer? Hinnerk zeigt auf dich.* | 151,154-155,171,185-186<br>↻ 1,2,200,202<br>S6.2 ▸ S6.3 ▸ |
| 4-4 | 🌊 | Seehundbank | Ankerplatz am Seehundsand | ⛵ selbst | Du ankerst selbst (Mini-Anker aus Fach 3). Nationalpark, Seehunde, Abstand halten.<br>🔁 *Wiedersehen: Am Seehundsand will Hinnerk für ein Foto näher ran. Du entscheidest.* | 216-219,225-230<br>↻ 32,33<br>S8.1 ▸ S8.2 ▸ |
| 4-5 | 🧶 | Trockengefallen | Trockenfallplatz | 🪢 mitmachen | Das Boot sitzt auf dem Sand, sechs Stunden Zeit, Tee. Hinnerk erzählt endlich vom Rempler mit Harms auf der Elbe: Nebel, zu schnell, kein Ausguck, und wer am Ende verantwortlich war. Daran hängen Fahrerlaubnis, Verantwortung, seemännische Sorgfalt, sichere Geschwindigkeit und was man bei verminderter Sicht tut. Palstek und Kreuzknoten mit dem dicken Tau. Quirin vergleicht alles mit dem Binnen und liegt manchmal richtig. Bei Niedrigwasser geht er mit einer Wattführung zu Fuß nach Lüttoog: Er hat einen Probetag auf einem Versorgungsschiff. „Wir sehn uns bei Harms.“ | 75-78,84,89-90,138,274<br>↻ 252,254<br>S1.2 ▸ S4.1 ▸ |
| 4-6 | ☀️ | Nach Lüttoog | Watt nach Lüttoog | ⛵ selbst | Wann kommt man an, wie schnell sind wir? Zeit und Fahrt rechnen, alles Bisherige angewendet. Unterwegs, noch voll vom Rempler-Garn, spielt Klabauter mit dem Horn „Wer tutet da?“: Nebelsignale in Fahrt, Smilla erklärt, Hinnerk rät mit. Beim Anlegen im Inselhafen ruft dir ein Segler von seiner Boje Ratschläge zu, alle falsch („Ganz einfach, Leute: …“); erst danach erfährt man seinen Namen: Jasper.<br>🔁 *Wiedersehen: Beim Anlegen in Lüttoog ruft Jasper lauter falsche Tipps. Du entscheidest, wem du glaubst.* | 116-121<br>↻ 35,40,48<br>S4.2 ◼ |

### Tag 5: Nacht und Nebel
**Wo:** Ansteuerung bei Nacht → Nebelbank · **Du:** Nachtwache allein · **Knoten:** stopper, schot · **Navigation:** N4 Kompass, Peilung, Missweisung

**Geschichte:** Nachtfahrt wegen der Tide. Hinnerk verwechselt Lichter, nicht aus Unwissen: Er sieht nachts schlecht. Das Geheimnis kommt raus. Ab jetzt gehst du die Nachtwache.

**Kiste:** Fach 4: Mini-Laternen zum Aufstecken. Fach 5: Mini-Rettungsring (am Abend, vor dem Sturm). · **Haken:** Der Wetterbericht: Sturmwarnung für morgen.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 5-1 | 🌧️ | Lichter I | Kajüte, Lüttoog | 🪢 mitmachen | Mini-Laternen aus Fach 4 auf die Miniatur-Frieda: Topplicht, Seitenlichter, Heck. Dann die Lichter der anderen. | 85-86,91-92,113,159-160<br>↻ 11,12<br>S3.1 ◼ |
| 5-2 | 🌧️ | Lichter II | Kajüte, Lüttoog | 👂 zuhören | Schlepper, Fischer und Tiefgangbehinderte: Lichter und Signalkörper. Jasper kommt zu Besuch und verwechselt alles mit voller Überzeugung. | 93-96,108-112,133-134<br>S3.3 ▸ S3.6 ▸ |
| 5-3 | 🌧️ | Lichter III | Kajüte, Lüttoog | 👂 zuhören | Manövrierunfähig, manövrierbehindert, Bagger: Lichter und Signalkörper. Trocken, Klabauter hilft. | 97-104,148-150<br>↻ 82,83<br>S3.4 ▸ S3.5 ◼ |
| 5-4 | 🌙 | Hinnerks Geheimnis | Ansteuerung bei Nacht | 🪢 mitmachen | Leuchtfeuer und Kennungen. Hinnerk liest ein Feuer falsch, Smilla übernimmt. Dann sagt er es: Er sieht nachts schlecht. | 208-215,220-224<br>↻ 198,199<br>S5.1 ◼ S5.5 ◼ |
| 5-5 | 🌙 | Deine Wache | Ansteuerung bei Nacht | ⛵ selbst | Du gehst allein Wache. Begegnungen bei Nacht, ein Ankerlieger und ein Schiff auf Grund, Peilung nehmen, Kompass und Missweisung, Seemeile und Knoten.<br>🔁 *Wiedersehen: Nachts allein am Ruder: Rot und Grün voraus, die Peilung steht. Du entscheidest, was du tust.* | 105-107,114-115,240-244,248<br>↻ 14,15,125,127,91,113<br>S3.2 ◼ S7.2 ◼ |
| 5-6 | 🌫️ | Nebelbank! | Nebelbank | ⛵ selbst | Mitten in der Wache zieht eine Nebelbank auf. Keiner erklärt mehr, du handelst: Fahrt runter, Nebelsignal, Ausguck nach vorn. Ein langer Ton vorlicher als querab: Was jetzt? Hinnerk sieht im Nebel genauso wenig wie nachts und gibt dir das Steuer.<br>🚨 *Ernstfall: Plötzlich Nebel. Du weißt aus 4-5 und 4-6, was zu tun ist: Fahrt runter, Signal geben, Ausguck, horchen. Irgendwo vorlicher tutet ein Frachter.* | –<br>↻ 84,116-118,138,271,274 |
| 5-7 | 🌧️ | Oskar geht baden | Kajüte, Ankerplatz | 🪢 mitmachen | Am Ankerplatz, der Wetterbericht kündigt Sturm an. Smilla macht die Sicherheitsrunde: Wie holt man jemanden aus dem Wasser, wie verhindert man, dass er reinfällt, was tun, wenn das Boot kentert. Erst mit dem Mini-Rettungsring an der Miniatur-Frieda, dann echt mit der Übungspuppe Oskar. Dazu Stopperstek an einer Leine unter Last und Schotstek für zwei verschieden dicke Leinen.<br>🧭 *Überblick: Wetter: Hoch, Tief, Wind und Warnungen* | 276-278<br>↻ 67,68<br>S9.4 ▸ |

### Tag 6: Raus auf See
**Wo:** Offene See: Verkehrstrennungsgebiet → Sturm · **Du:** Kurs planen und fahren, im Sturm mit anpacken · **Navigation:** N5 Strom, Koppelort

**Geschichte:** Der große Schlag übers offene Wasser. Du planst den Kurs. Der Sturm kommt früher als gedacht. Jaspers Boot gerät in Seenot.

**Kiste:** Kein neues Fach: Was ihr braucht, liegt seit gestern Abend bereit. · **Haken:** Hinnerk, nach dem Sturm, leise: „Skipper.“ Zum ersten Mal.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 6-1 | 🌧️ | Die Wetterkarte | Kajüte, Ankerplatz | 👂 zuhören | Hoch, Tief, Isobaren, Beaufort. Hinnerks Knie gegen den Wetterbericht. Danach packt Smilla die Notsignale aus der Backskiste: Rakete, Handfackel, Flaggen, das Nebelhorn im Dauerton, wer helfen muss und was man tut, wenn ein Wrack zum Hindernis wird. Klabauter will eine Rakete probieren und darf nicht. | 172,260,262-266,279-285<br>↻ 71,72,114<br>S9.1 ◼ S9.5 ◼ |
| 6-2 | 🌧️ | Kurs übers Wasser | Kartentisch | 🪢 mitmachen | Du planst den Schlag mit Strom und Koppelort. Dazu Sturm- und Starkwindwarnungen.<br>🔁 *Wiedersehen: Auf der Karte liegt ein militärisches Warngebiet auf eurem Kurs. Du entscheidest, ob und wie ihr durchfahrt.* | 245-247,261,267-270<br>↻ 8,9,240,241,183<br>S7.3 ▸ S9.2 ▸ |
| 6-3 | ☀️ | Querverkehr | Verkehrstrennungsgebiet | ⛵ selbst | Du querst das Verkehrstrennungsgebiet im rechten Winkel, große Schiffe überall.<br>🔁 *Wiedersehen: Ein Frachter kommt von Steuerbord, die Peilung steht. Ihr seid klein, er ist groß. Du entscheidest.*<br>🔁 *Wiedersehen: Vor dem Verkehrstrennungsgebiet arbeitet ein Bagger. Du entscheidest, an welcher Seite ihr vorbeifahrt.* | 87-88,142-147,158<br>↻ 73,125,148,150<br>S6.6 ◼ |
| 6-4 | ⛈️ | Sturm kommt | Offene See | 🪢 mitmachen | Westen an, Sicherheitsleinen, Luken zu, Fahrt anpassen. Steuern in den Wellen.<br>🔁 *Wiedersehen: Das Barometer fällt rasch. Hinnerk will den Schlag trotzdem zu Ende fahren. Du entscheidest mit.* | 256-259,275<br>↻ 263,268<br>S9.3 ▸ |
| 6-5 | ⛈️ | Mensch über Bord | Offene See | ⛵ selbst | Mitten im Sturm geht Smilla über Bord. Die Leine hält, aber holen musst du sie: Boot führen, Hilfsmittel, an Bord nehmen. Danach sitzt Smilla nass in der Kajüte und sagt nichts, zum ersten Mal.<br>🚨 *Ernstfall: Eine Welle, Smilla rutscht aus und geht über Bord. Die Sicherheitsleine hält sie längsseits, und ihr holt sie so, wie ihr es mit Oskar geübt habt.* | –<br>↻ 259,276,278 |
| 6-6 | ⛈️ | Mayday | Offene See | ⛵ selbst | Jasper funkt nicht, er schießt. Notsignale erkennen, hinfahren, helfen, Leinen mit dem Schotstek verbinden und schleppen. Jasper gibt zum ersten Mal zu, dass er falsch lag.<br>🚨 *Ernstfall: Eine rote Rakete, dann Dauerton: Jaspers Boot ist in Not und kentert fast. Du erkennst die Notsignale aus 6-1 und weißt aus 5-7, was beim Kentern zu tun ist.* | –<br>↻ 256-258,277,279,281,283 |

### Tag 7: Ankunft
**Wo:** Insel Harmsoog mit Harms' Segelschule · **Du:** du führst die Frieda · **Navigation:** N6 Kreuzpeilung, alles gemischt

**Geschichte:** Du führst den letzten Schlag, die Crew ist Passagier. Harms erwartet euch an seinem Segelschiff Albertine. Quirin kommt zurück, und Harms prüft euch beide, Theorie und Praxis. Dann Smillas Abschied.

**Kiste:** Fach 6: Skipperwimpel. · **Haken:** Bonus: Rückweg mit Hinnerk allein. Smilla winkt vom großen Schiff.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 7-1 | ☀️ | Der letzte Schlag | Vor Harmsoog | ⚓ du führst | Du planst und führst. Begegnungen, Tonnen, Strom, alles gemischt. Die Crew ist Passagier, Klabauter quatscht dazwischen.<br>🔁 *Wiedersehen: Du führst: vor dir eine Kardinaltonne, ein Segler von der Seite, Strom quer. Keiner sagt dir mehr, was richtig ist.* | –<br>↻ 129,157,201,209,245,88,221,223 |
| 7-2 | ⚓ | Einlaufen Harmsoog | Hafen Harmsoog | ⚓ du führst | Du läufst ein und legst neben Harms' Segelschiff an. Harms steht auf dem Steg und sagt nichts.<br>🔁 *Wiedersehen: Einlaufen bei Harms: Du legst selbst an, neben der Albertine, Wind von der Seite.* | –<br>↻ 35,40,48 |
| 7-3 | 📝 | Harms prüft: Theorie | An Bord des Segelschiffs | 📝 Prüfung | Quirin kommt mit der Fähre von seinem Probetag, grün im Gesicht, aber mit Neuigkeiten. Die große Probeprüfung für euch beide: 30 Fragen und eine Kartenaufgabe. Harms prüft, ohne Musik, ohne Witze, zügig. | – |
| 7-4 | 📝 | Harms prüft: Praxis | Hafenbecken Harmsoog | 📝 Prüfung | Alle Manöver und Knoten der Praxisprüfung. | – |
| 7-5 | 👋 | Wachübergabe | Steg Harmsoog | 👂 zuhören | Smilla übergibt dir die Wache und steigt um. Harms sagt einmal „Gut.“ | – |

**Bonus:** Folge 0: Anheuern: Erster Start der App (Nutzer, 07.11.2026): Am Abend vor der Abfahrt kommst du an Bord und lernst Hinnerk, Smilla, Klabauter und Backbord kennen. Die Grundeinstellungen machst du dabei mit der Crew (Name, Anrede, Prüfungstermin, Lernzeit, Lernort, Mikrofon, Übungsset). Harms wird nur erwähnt. Wird später ausgearbeitet, zusammen mit dem geführten Rundgang durch die App. · Rückweg (Bonus): Hinnerk und du allein, Wiederholung und Prüfungswoche.
<!-- PLAN:END -->

## 9. Offen
- **Nächste Schritte (Nutzer, 07.11.2026):** erst das Konzept gemeinsam schärfen; dann Technik-Probe am Handy (Hörspiel bei gesperrtem Bildschirm, Pausen, Mitantworten), Ablauf von Folge 4-3 als Hörspiel in zehn Punkten, Probe-Lesen mit der Gratis-Stimme, einmal echt vertonen.
- Die 3D-Probefolge 4-3 (v5.23, `r4-3`) bleibt als Muster für die 3D-Aufgaben.
- Ablaufmuster (`muster`) und Abschluss-Abfrage (`abfrage`) je Folge setzen, wenn die Folgenblätter entstehen (das Werkzeug prüft sie dann).
- Erklärungen je Frage nach Regel HR8–HR11 neu schreiben, kapitelweise.
- ★ Ortsnamen in Abschnitt 5. Bestätigt am 07.11.2026: Die Frieda heißt Frieda (Boot und Miniatur), Harms' Segelschiff heißt Albertine.
- Inhalt der Kiste ab Fach 3 (★ Vorschlag oben), sobald das Starter-Set feststeht.
- Tag 0 „Anheuern“ und Rückweg (Bonus) ausarbeiten.
- Übungskarte der Reise zeichnen (für N1–N6), passend zu den Orten.
- Kajütenfunk: Er ist jetzt die Hörreise (E25, F5 damit entschieden).
