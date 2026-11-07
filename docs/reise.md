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
  - Tag 0 „Anheuern“ zählt nicht als erster Tag. Er wird gesondert ausgearbeitet, „etwas richtig Gutes“.
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
- **Pfeife:** Hinnerk zündet sie sich ab und zu an, mit Ton und Animation (Streichholz, Glut, Rauch). Er tut das in ruhigen Momenten und als stilles Lob. Nie verherrlicht; beim Tanken nimmt Smilla ihm das Streichholz weg.

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
  - Hörspiel: mitdenken. Denkpause 6 Sekunden bei offenen Fragen, 4 bei Entweder-oder, dann die Lösung.
  - Mit „Mitantworten“: per Stimme.
  - Mitmachen: Knöpfe.
- **HR15 Wer irrt, wechselt** (N 07.11.):
  - Es irren Hinnerk (Bauchregel, praktisch oft sinnvoll, formal falsch), Quirin (Binnen-Gewohnheit), selten Smilla (zu streng oder das falsche Revier) und Gäste.
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
- **HR18 Drei Rahmen, kurz gehalten** (N 07.11.):
  - „Harms ruft an“
  - „Logbuch schreiben“ (Smilla diktiert)
  - „Klabauter-Quiz“ (erst, wenn Klabauter an Bord ist)
  - Nie zweimal hintereinander derselbe (Feld `abfrage`). ⚙
  - **Wenn Harms prüft, ist es ernst** (N 07.11.): Musik und Atmo aus, nur die Schiffsglocke. Harms liest trocken und zügig, keine Witze, kein Plaudern, keine Erklärungen dazwischen. Harms prüft nur hier und an Tag 7, nie mitten in der Geschichte. Smilla oder Hinnerk dürfen erst danach wieder reden (ein kurzer Satz, dann Musik).

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
| 1-1 | 🌧️ | Ankommen | Kajüte, Kuttershaven | 👂 zuhören | Kurz und gemütlich: Du kommst in Kuttershaven an, mitten hinein in eine Lage (Ideen in Besprechung). Wer an Bord das Sagen hat und wer überhaupt nicht fahren darf: Alkohol, aber auch körperliche Mängel (Hinnerk wird still, erste Spur seines Geheimnisses). Ein E-Boot ohne Schein. Klabauter fehlt. Harms ruft an.<br>🧭 *Überblick: Wer an Bord das Sagen hat und welche Papiere man braucht* | 1-2,59<br>G1.1 ▸ |
| 1-2 | ⚓ | Gas, Sprit und Streichholz | Steg und Tankstelle Kuttershaven | ✋ Handgriffe | Crew tankt und startet den Motor, du reichst den Kanister. Hinnerk will sich beim Tanken die Pfeife anzünden, Smilla nimmt ihm das Streichholz weg. | 43,49,62-66<br>G4.1 ◼ |
| 1-3 | ☀️ | Das Heck zieht weg | Hafenbecken und Ausfahrt | 👀 Ausguck | Hinnerk legt ab, rückwärts zieht das Heck nach Backbord. Die Fähre kommt mit Schwell, Smilla erklärt Sog und Abstand zu großen Schiffen.<br>🧭 *Überblick: Wie ein Boot fährt: Antrieb, Ruder, Radeffekt, Sog* | 34,36-37,41,44-48,50-51,61<br>G2.1 ◼ G3.2 ◼ |
| 1-4 | ☀️ | Rechts halten | Fluss Brede | 👀 Ausguck | Erste Begegnung auf dem Fluss: Die Crew weicht aus und erklärt die zwei Grundregeln. Bordsprache: in Fahrt, Luv und Lee. Du sagst Boote an. | 3,6,8-9,14-15<br>G1.2 ◼ G5.2 ▸ |
| 1-5 | 🧶 | Garn: Der Motor, der kochte | Fluss Brede (Zeitraffer) | 👂 zuhören | Unterwegs erzählt Hinnerk, wie ihm einst der Motor heiß lief. Warnlampen, Öl in der Bilge, Kühlwasser. Smilla stellt seine Version richtig. | 42,52-57,60<br>G2.2 ◼ |
| 1-6 | 🌊 | Schilfwinkel | Ankerbucht Schilfwinkel | ✋ Handgriffe | Ankern vor Sonnenuntergang (Hinnerk besteht drauf). Wie man anlegt und ankert, Abstand zum Schilf, Brutplätze, woran man das Wetter sieht. In der Dämmerung landet ein Papagei auf dem Kajütdach: Klabauter. „Dat is der Klabautermann. Der bleibt.“ | 31-33,35,38-40,58,71<br>G3.1 ▸ G7.1 ▸ |
| 1-7 | 🌧️ | Erster Abend | Kajüte, Schilfwinkel | 👂 zuhören | Es wird dunkel, das Ankerlicht geht an: wozu Lichter da sind. Beim Kochen zeigt Smilla den Feuerlöscher und die Westen. Harms ruft an, danach fragt Smilla, was zwischen den beiden ist. Hinnerk: „Wir hatten mal ’n Rempler. Auf der Elbe.“ Was nach einem Zusammenstoß zu tun ist, wann Notsignale erlaubt sind. Klabauter sitzt seit dem Schilfwinkel wieder auf dem Kajütdach.<br>🧭 *Überblick: Lichter: das System (wer bin ich, wohin fahre ich, was tue ich)* | 7,10-13,67-70,72<br>G4.2 ▸ G5.1 ◼ |

### Tag 2: Tonnen und dicke Pötte
**Wo:** Strom Elvmünde → Klüverhafen · **Du:** kleine Handgriffe, erste Minuten an der Pinne unter Aufsicht · **Knoten:** acht, klampe · **Navigation:** N0 Karte lesen

**Geschichte:** Auf dem großen Strom mit Frachtern. Abends ein fremder Hafen: Die Crew funkt den Hafenmeister an, du hörst mit. Hinnerk gibt Smilla in der Dämmerung das Steuer. Am Steg wartet Quirin und will mit.

**Kiste:** Fach 1: Tau und Mini-Klampe. · **Haken:** Quirin, mit Seesack auf dem Steg: „Morgen a Schleus’n? Do bin i dahoam.“

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 2-1 | 🌧️ | Die Kiste | Kajüte, Schilfwinkel | 🪢 mitmachen | Morgens die erste Kiste: Tau. Achtknoten am Leinenende, damit nichts ausrauscht. Smilla zeigt auf der Karte das Fahrwasser und erklärt, welche Familien von Seezeichen es gibt.<br>🧭 *Überblick: Seezeichen: die vier Familien und wie Feuer sprechen* | 156-157,190-194<br>S5.2 ◼ |
| 2-2 | ☀️ | Grün an Steuerbord | Tonnenkette in die Elvmünde | 👀 Ausguck | Du sagst jede Tonne an, Smilla steuert. Wer im Fahrwasser fährt, hält sich rechts. | 195-199<br>S5.3 ▸ |
| 2-3 | ☀️ | Dicke Pötte | Elvmünde, Fahrwasser | 🧭 kurz an die Pinne | Ein Frachter im engen Fahrwasser, eine Fähre quert. Was im Fahrwasser gilt: rechts halten, nicht behindern, richtig queren. Du darfst auf gerader Strecke kurz die Pinne halten, Hinnerk daneben. | 161,165-168,271<br>S6.1 ▸ |
| 2-4 | ☀️ | Wer muss weg? | Elvmünde | 👀 Ausguck | Wann wird es gefährlich? Peilung, die stehen bleibt, Ausguck, AIS. Dann die Rangfolge: wer manövrierunfähig ist, wer behindert ist, wer wem ausweicht. Echte Lagen auf dem Strom.<br>🧭 *Überblick: Ausweichen: das Prinzip (wer weicht, wer hält Kurs, Rangfolge)* | 82-83,125,128-132,272-273<br>S2.1 ◼ S2.3 ◼ |
| 2-5 | ⚓ | Hafenfunk | Einfahrt Klüverhafen | 👂 zuhören | Die Crew funkt den Hafenmeister an, du hörst mit. Ein Fischer gibt das Gefahrsignal, irgendwo läutet eine Glocke. Smilla ordnet die Schallsignale: kurz, lang, Manöver, Nebel, Warnung. Hinnerk legt mit Backbord an und erklärt, warum.<br>🧭 *Überblick: Schallsignale: kurz und lang, Manöver, Nebel, Warnung* | 122-124,141,162-164<br>S4.3 ◼ |
| 2-6 | ⚓ | Fest auf Klampe | Steg Klüverhafen | 🪢 mitmachen | Du belegst die Klampe an der Miniatur-Frieda, dann echt am Steg (Klampe aus Fach 1). Klabauter petzt jeden Fehler. | – |
| 2-7 | 🌧️ | Hafenabend | Kajüte, Klüverhafen | 👂 zuhören | In Klüverhafen sitzt ein Bayer auf dem Steg: Quirin, Binnenschiffer, kennt jedes Boot und jeden Knoten, aber die Regeln auf See nicht. Er will den SBF See und fragt, ob er mitdarf. Hinnerk brummt, Smilla sagt ja. Wiederholung des Tages mit Klabauter als Quizmaster, Quirin rät mit. | – |

### Tag 3: Schleuse und Kanal
**Wo:** Schleuse Klappdörp → Kanal → Kanalhafen Moorende · **Du:** mitmachen: Leinen in der Schleuse, steuern im Kanal · **Knoten:** rundtoern, webelein · **Navigation:** N1 Position, N2 Kurs und Distanz

**Geschichte:** Quirin ist an Bord: Schleuse und Kanal sind sein Revier, da ist er plötzlich der Experte, auf See dagegen Anfänger wie du. Vor der Schleuse leuchten die Lichter rot: warten. In der Kammer führst du die Leine. Abends entscheidet Quirin, bis zur Prüfung zu bleiben.

**Kiste:** Fach 2: Ring, Kursdreieck, Zirkel und die Übungskarte der Reise. · **Haken:** Quirin erzählt vom alten Wrack im Watt, „da wo der Hinnerk damals…“. Hinnerk schweigt.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 3-1 | 🌧️ | Schilderwald | Kajüte, Klüverhafen | 👂 zuhören | Quirins erster Morgen an Bord. Tafelzeichen kennt er vom Fluss und fragt sie ab wie ein Quizmaster, dazu, wie lang ein kurzer und ein langer Ton sind. Trocken, aber laut.<br>🧭 *Überblick: Zeichen am Ufer: Verbot, Gebot, Hinweis, Sperrgebiet* | 4-5,16-20,22-27<br>G6.1 ◼ G6.2 ◼ |
| 3-2 | ☀️ | Rot über rot | Vor der Schleuse Klappdörp | 🪢 mitmachen | Die Schleusenlichter zeigen rot, du musst warten und das richtig entscheiden. Brücken, Schleusen und der große Kanal. Die Crew meldet sich per Funk an, Quirin weiß alles besser. | 21,28-30,173-176,178<br>G6.3 ▸ S6.5 ▸ |
| 3-3 | 🚧 | In der Kammer | Schleusenkammer Klappdörp | 🪢 mitmachen | Leinen führen, Rundtörn mit zwei halben Schlägen am Ring (Fach 2), Webeleinstek am Poller. Das Wasser steigt. | – |
| 3-4 | ☀️ | Kanalfahrt | Kanal | ⛵ selbst | Du steuerst im Kanal: Badestellen und Tempo, Wasserski, Sperr- und Warngebiete. Quirin redet ununterbrochen. | 169-170,177,179-184,187-189<br>S6.2 ▸ S6.4 ◼ |
| 3-5 | ☀️ | Segler im Kanal | Kanal | ⛵ selbst | Ein Segler kreuzt, ein Schnellerer will überholen. Wer weicht wem aus, und wann musst du das Manöver des letzten Augenblicks fahren? | 79-81,126-127,135-137,139-140<br>S2.2 ▸ S2.4 ▸ |
| 3-6 | 🌧️ | Der Kartentisch | Kajüte, Kanalhafen Moorende | 🪢 mitmachen | Kursdreieck und Zirkel aus Fach 2: Position ablesen, Kurs und Distanz zum Watt messen. Quirin rechnet falsch, Smilla nicht.<br>🧭 *Überblick: Navigation: Karte, Kurs, Peilung, Gezeiten* | 231-232,234-239<br>S7.1 ◼ |
| 3-7 | ⚓ | Hafenkino Moorende | Kanalhafen Moorende | ⛵ selbst | Abends ist das Becken leer, Hinnerk lässt dich üben: Aufstoppen, Wenden auf engem Raum, Anlegen. Die Leute am Steg schauen zu. | – |
| 3-8 | 🌧️ | Ab morgen See | Kanalhafen Moorende | 👂 zuhören | Abends in Moorende: Ab morgen gelten andere Regeln als auf Quirins Flüssen. Welche Regeln wo gelten. Quirin erzählt, warum er hier ist: Er will umsatteln, auf einen Job auf hoher See, und der Seeschein ist der erste Schritt. Und er hofft, dass sich die Seekrankheit gibt. Dann seine Andeutung zum Wrack, „da wo der Hinnerk damals …“<br>🧭 *Überblick: Welche Regeln gelten wo: Binnen, Seeschifffahrtsstraße, offene See (mit Quirin)* | 73-74,152-153<br>S1.1 ◼ |

### Tag 4: Watt und Wrack
**Wo:** Wattenmeer Groter Sand → Wrackgebiet → Insel Lüttoog · **Du:** selbst steuern mit Aufsicht, ankern · **Knoten:** palstek, kreuz · **Navigation:** N3 Zeit, Fahrt, Tide

**Geschichte:** Ebbe und Flut bestimmen den Tag. Am Wrack will die müde Crew ankern, die Wasserschutzpolizei kommt. Beim Trockenfallen paukt man Recht, dann geht Quirin übers Watt zu seinem Probetag. Auf Lüttoog liegt Jasper.

**Kiste:** Fach 3: dickes Tau und Mini-Anker. · **Haken:** Die Tide zwingt zur Nachtfahrt. Hinnerk wird still.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 4-1 | 🌧️ | Ebbe und Flut | Kajüte, Moorende | 👂 zuhören | Smilla erklärt die Gezeiten mit dem Teebecher. Wann kommt man über den Priel? | 233,249-255<br>S7.4 ◼ |
| 4-2 | ☀️ | Pricken und Kardinäle | Priel im Groter Sand | ⛵ selbst | Du steuerst durch den Priel. Kardinaltonnen zeigen, wo das Wasser frei ist. | 200-207<br>S5.4 ◼ |
| 4-3 | ☀️ | Wrack und Wasserschutz | Wrackgebiet im Groter Sand | ⛵ selbst | Die Crew ist müde und will am Wrack ankern. Du entscheidest. Dann kommt die Wasserschutzpolizei: Ankerverbot, wer Schiffsführer ist, Papiere, das Anhaltesignal und wer sonst noch kontrollieren darf. | 151,154-155,171,185-186<br>S6.2 ▸ S6.3 ▸ |
| 4-4 | 🌊 | Seehundbank | Ankerplatz am Seehundsand | ⛵ selbst | Du ankerst selbst (Mini-Anker aus Fach 3). Nationalpark, Seehunde, Abstand halten. | 216-219,225-230<br>S8.1 ▸ S8.2 ▸ |
| 4-5 | 🧶 | Trockengefallen | Trockenfallplatz | 🪢 mitmachen | Das Boot sitzt auf dem Sand, sechs Stunden Zeit: Fahrerlaubnis, Verantwortung und Sorgfalt mit Tee, Hinnerks Garn. Palstek und Kreuzknoten mit dem dicken Tau. Quirin vergleicht alles mit dem Binnen und liegt manchmal richtig. Bei Niedrigwasser geht er mit einer Wattführung zu Fuß nach Lüttoog: Er hat einen Probetag auf einem Versorgungsschiff. „Wir sehn uns bei Harms.“ | 75-78,89-90<br>S1.2 ▸ |
| 4-6 | ☀️ | Nach Lüttoog | Watt nach Lüttoog | ⛵ selbst | Wann kommt man an, wie schnell sind wir? Zeit und Fahrt rechnen, alles Bisherige angewendet. Im Inselhafen liegt Jasper an seiner Boje und weiß alles besser. | – |

### Tag 5: Nacht und Nebel
**Wo:** Ansteuerung bei Nacht → Nebelbank · **Du:** Nachtwache allein · **Knoten:** stopper, schot · **Navigation:** N4 Kompass, Peilung, Missweisung

**Geschichte:** Nachtfahrt wegen der Tide. Hinnerk verwechselt Lichter, nicht aus Unwissen: Er sieht nachts schlecht. Das Geheimnis kommt raus. Ab jetzt gehst du die Nachtwache.

**Kiste:** Fach 4: Mini-Laternen zum Aufstecken. · **Haken:** Der Wetterbericht: Sturmwarnung für morgen.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 5-1 | 🌧️ | Lichter I | Kajüte, Lüttoog | 🪢 mitmachen | Mini-Laternen aus Fach 4 auf die Miniatur-Frieda: Topplicht, Seitenlichter, Heck. Dann die Lichter der anderen. | 85-86,91-92,113,159-160<br>S3.1 ◼ |
| 5-2 | 🌧️ | Lichter II | Kajüte, Lüttoog | 👂 zuhören | Schlepper, Fischer und Tiefgangbehinderte: Lichter und Signalkörper. Jasper kommt zu Besuch und verwechselt alles mit voller Überzeugung. | 93-96,108-112,133-134<br>S3.3 ▸ S3.6 ▸ |
| 5-3 | 🌧️ | Lichter III | Kajüte, Lüttoog | 👂 zuhören | Manövrierunfähig, manövrierbehindert, Bagger: Lichter und Signalkörper. Trocken, Klabauter hilft. | 97-104,148-150<br>S3.4 ▸ S3.5 ◼ |
| 5-4 | 🌙 | Hinnerks Geheimnis | Ansteuerung bei Nacht | 🪢 mitmachen | Leuchtfeuer und Kennungen. Hinnerk liest ein Feuer falsch, Smilla übernimmt. Dann sagt er es: Er sieht nachts schlecht. | 208-215,220-224<br>S5.1 ◼ S5.5 ◼ |
| 5-5 | 🌙 | Deine Wache | Ansteuerung bei Nacht | ⛵ selbst | Du gehst allein Wache. Begegnungen bei Nacht, ein Ankerlieger und ein Schiff auf Grund, Peilung nehmen, Kompass und Missweisung, Seemeile und Knoten. | 105-107,114-115,240-244,248<br>S3.2 ◼ S7.2 ◼ |
| 5-6 | 🌫️ | Nebelbank! | Nebelbank | ⛵ selbst | Plötzlich Nebel. Fahrt runter, Signal geben, Ausguck. Ein Frachter tutet irgendwo. | 84,116-121,138,274<br>S4.1 ▸ S4.2 ◼ |
| 5-7 | 🌧️ | Leinen unter Last | Kajüte, Ankerplatz | 🪢 mitmachen | Stopperstek an einer Leine unter Last, Schotstek für zwei verschieden dicke Leinen. Der Wetterbericht kündigt Sturm an.<br>🧭 *Überblick: Wetter: Hoch, Tief, Wind und Warnungen* | – |

### Tag 6: Raus auf See
**Wo:** Offene See: Verkehrstrennungsgebiet → Sturm · **Du:** Kurs planen und fahren, im Sturm mit anpacken · **Navigation:** N5 Strom, Koppelort

**Geschichte:** Der große Schlag übers offene Wasser. Du planst den Kurs. Der Sturm kommt früher als gedacht. Jaspers Boot gerät in Seenot.

**Kiste:** Fach 5: Mini-Rettungsring. · **Haken:** Hinnerk, nach dem Sturm, leise: „Skipper.“ Zum ersten Mal.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 6-1 | 🌧️ | Die Wetterkarte | Kajüte, Ankerplatz | 👂 zuhören | Hoch, Tief, Isobaren, Beaufort. Hinnerks Knie gegen den Wetterbericht. | 260,262-266<br>S9.1 ◼ |
| 6-2 | 🌧️ | Kurs übers Wasser | Kartentisch | 🪢 mitmachen | Du planst den Schlag mit Strom und Koppelort. Dazu Sturm- und Starkwindwarnungen. | 245-247,261,267-270<br>S7.3 ▸ S9.2 ▸ |
| 6-3 | ☀️ | Querverkehr | Verkehrstrennungsgebiet | ⛵ selbst | Du querst das Verkehrstrennungsgebiet im rechten Winkel, große Schiffe überall. | 87-88,142-147,158<br>S6.6 ◼ |
| 6-4 | ⛈️ | Sturm kommt | Offene See | 🪢 mitmachen | Westen an, Sicherheitsleinen, Luken zu, Fahrt anpassen. Steuern in den Wellen. | 256-259,275<br>S9.3 ▸ |
| 6-5 | ⛈️ | Mensch über Bord | Offene See | ⛵ selbst | Smilla geht beinahe über Bord. Ihr übt es danach mit dem Mini-Rettungsring, dann echt mit der Puppe. | 276-278<br>S9.4 ▸ |
| 6-6 | ⛈️ | Mayday | Offene See | ⛵ selbst | Jaspers Boot ist in Not: Notsignale, Schleppen mit dem Schotstek, was tun, wenn ein Boot kentert. | 172,279-285<br>S9.5 ◼ |

### Tag 7: Ankunft
**Wo:** Insel Harmsoog mit Harms' Segelschule · **Du:** du führst die Frieda · **Navigation:** N6 Kreuzpeilung, alles gemischt

**Geschichte:** Du führst den letzten Schlag, die Crew ist Passagier. Harms erwartet euch an seinem Segelschiff Albertine. Quirin kommt zurück, und Harms prüft euch beide, Theorie und Praxis. Dann Smillas Abschied.

**Kiste:** Fach 6: Skipperwimpel. · **Haken:** Bonus: Rückweg mit Hinnerk allein. Smilla winkt vom großen Schiff.

| Folge | | Titel | Ort | Du | Was passiert | Fragen · Blöcke |
|---|---|---|---|---|---|---|
| 7-1 | ☀️ | Der letzte Schlag | Vor Harmsoog | ⚓ du führst | Du planst und führst. Begegnungen, Tonnen, Strom, alles gemischt. Die Crew ist Passagier, Klabauter quatscht dazwischen. | – |
| 7-2 | ⚓ | Einlaufen Harmsoog | Hafen Harmsoog | ⚓ du führst | Du läufst ein und legst neben Harms' Segelschiff an. Harms steht auf dem Steg und sagt nichts. | – |
| 7-3 | 📝 | Harms prüft: Theorie | An Bord des Segelschiffs | 📝 Prüfung | Quirin kommt mit der Fähre von seinem Probetag, grün im Gesicht, aber mit Neuigkeiten. Die große Probeprüfung für euch beide: 30 Fragen und eine Kartenaufgabe. Harms prüft, ohne Musik, ohne Witze, zügig. | – |
| 7-4 | 📝 | Harms prüft: Praxis | Hafenbecken Harmsoog | 📝 Prüfung | Alle Manöver und Knoten der Praxisprüfung. | – |
| 7-5 | 👋 | Wachübergabe | Steg Harmsoog | 👂 zuhören | Smilla übergibt dir die Wache und steigt um. Harms sagt einmal „Gut.“ | – |

**Bonus:** Anheuern (Bonus): Wie du an Bord kommst. Wird gesondert ausgearbeitet. · Rückweg (Bonus): Hinnerk und du allein, Wiederholung und Prüfungswoche.
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
