# Figuren schärfen: Entwurf mit Varianten (29.10.2026)

> **Status: Vorschlag. Nichts davon gilt, bis du es bestätigst** (R15, B164). `podcast/figuren.md` bleibt unverändert, bis du dich entschieden hast. Dann wandert das Gewählte dorthin.
> Anlass: Du willst Figuren, die sich über die Geschichte hin entwickeln, statt immer denselben Jux zu machen, und die das Lernen unterstützen statt behindern.

## 1. Wie man es mit einer KI am besten macht (Recherche, Stand 29.10.2026)

Was die Recherche und meine Erfahrung hergeben. Quellenlage ist dünn, vieles sind Vorabdrucke; die Belege sind **vorläufig**:

1. **Das Problem ist Gedächtnis, nicht Einfallsreichtum.** Eine KI vergisst über lange Texte, was früher passiert ist, und fällt auf Standard-Witze zurück. Aktuelle Arbeiten lösen das mit einem **ausdrücklichen, laufend gepflegten Zustandsspeicher** (Figuren, Wissen, Beziehungen) statt mit „die KI wird sich schon erinnern“ ([NstAgent](https://arxiv.org/pdf/2503.23512v1), [Wissensgraph für lange Geschichten, ICCC26](https://computationalcreativity.net/iccc26/papers/ICCC26_paper_39.pdf)). Ein Praxisbericht arbeitet mit einer versionierten „Story Bible“ als JSON-Datei, die nach jedem Kapitel aktualisiert wird ([Using Claude for Long-Form Fiction](https://yourcreativeedge.substack.com/p/using-claude-for-long-form-fiction), Erfahrungsbericht, nicht geprüft).
2. **Figurenbogen über Wunsch, Bedürfnis, Irrglaube.** Eine Figur will etwas (Wunsch) und braucht etwas anderes (Bedürfnis); in dieser Lücke liegt die Entwicklung. Dazu ein falscher Glaubenssatz („Lüge“) und ein Ursprung dafür („Wunde“) ([Beispiel aus dem Drehbuchbereich](https://nofilmschool.com/character-wound-and-misbelief), [Want vs. Need](https://alamrafiul.com/blogs/want-vs-need-blind-spot/)). Wichtig für Ensemble: jede Figur erkundet eine andere Kombination.
3. **Humor in Lernfiguren hilft, wenn er freundlich ist.** Erste Studien sehen mehr Motivation und gute Stimmung, ohne dass der Lerneffekt leidet ([Preprint](https://www.researchsquare.com/article/rs-8627679/latest.pdf)). Es gibt unterschiedliche Humorstile (verbindend gegen sich selbst herabsetzend, [Ceha et al.](https://ar5iv.arxiv.org/html/2108.11259)); welcher besser wirkt, habe ich nicht gefunden. **Grenze meiner Recherche:** Zu komischen Figuren in Lern-Podcasts gibt es nichts Belastbares.
4. **Running Gags** habe ich nicht belegen können; was folgt, ist handwerkliche Erfahrung (also Vorschlag, kein Beleg).

**Daraus mein Arbeitsverfahren** (ich schlage vor, es genau so zu machen):
- **Figurenbibel als Datei im Repo** (`podcast/figuren-bibel.json` oder `.md`): je Figur Wunsch, Bedürfnis, Irrglaube, Wunde, Stärken, Schwächen, Sprechweise, Tabus, **aktueller Zustand je Akt**.
- **Beziehungsmatrix:** wer will was von wem, welcher Konflikt, welche gemeinsame Geschichte.
- **Gag-Budget:** jede Wiederholung ist eine Zeile mit Zähler und Obergrenze (siehe 6).
- **Kontinuitätsprotokoll:** nach jedem Tag ein kurzer Eintrag „Was ist passiert, was hat wer gelernt, wer weiß was“. Der nächste Tag liest ihn zuerst.
- **Kritikdurchgang:** nach jedem Text prüfe ich ihn gegen Bibel, Protokoll und Gag-Budget. Du bekommst nur, was besteht.
- **Du bist die Quelle für die Grundentscheidungen** (Wunde, Geheimnis, Bogen). Ich entwerfe Varianten, du wählst und mischst.

## 2. Was fürs Lernen gut ist und was hinderlich

**Gut, behalten**
- **Zwei verschiedene Wege zur Wahrheit:** Hinnerk (Gefühl und Erfahrung) und Smilla (Regel und Warum). Der Hörer sieht, dass beides zur Antwort führt und wo das Gefühl trügt. Das ist didaktisch stark: *Fehlvorstellungen sichtbar machen und berichtigen*.
- **Smilla stellt die Fragen des Hörers** und gibt zu, wenn sie etwas nachschlagen muss.
- **Klabauter als Merkanker** (kurz, wiederholt, immer richtig im Modus „Wichtig“).
- **Harms als Spannung vor der Prüfung.**

**Hinderlich, ändern**
1. **Hinnerk als „dumm“** (dein Hinweis): Wer Hinnerk für dumm hält, lernt von ihm nicht und glaubt seinen richtigen Sätzen weniger. Lösung: Seine Fehler müssen **klug und nachvollziehbar** sein (siehe 3).
2. **Immer derselbe Ablauf:** Hinnerk irrt, Smilla korrigiert, „Sag ich doch“. Beim fünften Mal ist es Fließband. Lösung: Fehlertypen und Rollen wechseln (siehe 3.4), gelegentlich irrt **Smilla** oder die **Regel hat eine Ausnahme**.
3. **Dialekt als Dauerwitz:** Platt und Kölsch sind Farbe, nicht Pointe. Regel und Antwort bleiben Hochdeutsch (gilt schon).
4. **Zu viele Gags pro Minute:** Jeder Witz lenkt von der Lektion ab. Faustregel: höchstens ein Gag-Moment je Minute Lernstoff, und **nie** mitten im Antwortsatz.
5. **Alle Figuren erklären:** Wenn jede Figur lehrt, weiß der Hörer nicht, wem er glauben soll. Lösung: **feste Lehrrollen** (Smilla erklärt das Warum, Hinnerk zeigt die Praxis, Klabauter sichert, Harms prüft).
6. **Ernst überall oder nirgends:** Ernst nur, wo es um Sicherheit geht (dein Wunsch). Dort verstummen Gags, damit der Hörer die Veränderung hört: „Jetzt red ich mal Hochdeutsch.“

## 3. Hinnerk: Gefühl gegen Regel, aber klug

**Das alte Konzept (von dir bestätigt):** Hinnerk hält oft das Gefühlte für richtig und irrt dabei; Smilla kennt die Regeln. Das bleibt der Kern. Nur **warum** er irrt, wird besser.

### 3.1 Drei Fehlertypen (statt „einfach falsch“)
1. **Erfahrungsfalle:** Etwas stimmt auf der Fähre oder früher, aber nicht für Sportboote. („Wir hatten Vorfahrt, wir waren die Fähre.“) → Der Hörer lernt, dass **Regeln vom Fahrzeug abhängen**, nicht vom Gefühl.
2. **Veraltete Regel:** Er lernte es vor Jahrzehnten, es hat sich geändert. („Das hieß früher …“) → Die Regel von heute wird ausdrücklich genannt.
3. **Übertragungsfehler:** Richtige Regel, falsche Lage. („Rot rechts, immer.“ Stimmt beim Einlaufen, nicht beim Auslaufen.) → Der Hörer sieht, **wo** die Regel gilt.

Nie Fehler bei **Praxis und Sicherheit** (bleibt, Bible P41).

### 3.2 Drei Varianten für seinen Bogen (du wählst oder mischst)

**Variante A: „Der Veteran mit der Lücke“** (am nächsten am heutigen Stand)
- *Wunsch:* Anerkennung als echter Kapitän, auch an Land.
- *Bedürfnis:* zugeben, dass Erfahrung und Regel zusammen besser sind als Erfahrung allein.
- *Irrglaube:* „Wer 38 Jahre gefahren ist, braucht keine Regel nachzuschlagen.“
- *Bogen über die Akte:* Anfang überzeugt (Akt 1), erste Überraschung (Akt 2: er verliert die Wette gegen die Karte), schlägt heimlich nach (Akt 3), gibt zum ersten Mal offen zu „Hast recht“ (Akt 4), erklärt am Ende etwas **mit** Regel und Gefühl (Akt 6–8).
- *Vorteil:* leicht umzusetzen, tut dem Lernen gut. *Risiko:* wirkt harmlos, wenn nichts auf dem Spiel steht.

**Variante B: „Der Gefühlsnavigator mit Wunde“**
- *Wunde:* Im großen Sturm von 87 hat ihn sein Gefühl gerettet, aber ein Kollege ist umgekommen, weil er ihm vertraute (angedeutet, nie ausgesprochen). Seitdem **muss** er sich auf sein Gefühl verlassen können, sonst wäre das Unglück sinnlos gewesen. Deshalb irrt er hartnäckig.
- *Bedürfnis:* sich verzeihen und sich auf Regeln stützen dürfen, ohne seine Erfahrung zu verraten.
- *Bogen:* Der „große Sturm von 87“ wächst mit jedem Erzählen, der Hörer ahnt, dass etwas fehlt (Akt 1–3). Erst in **Akt 6 (Not an Bord)** erzählt er ihn zum ersten Mal ruhig und ohne Übertreibung. Das ist der **ernste** Moment, der das Mensch-über-Bord-Thema trägt.
- *Vorteil:* Tiefe, passt zu Sicherheit und Seenot. *Risiko:* Ernst nur sparsam, sonst kippt der Ton. Braucht deine Freigabe (Thema Verlust).

**Variante C: „Der Lehrer, der selbst lernt“**
- *Wunsch:* Smilla zum Schein bringen, damit sie „sein Werk“ ist.
- *Bedürfnis:* loslassen; sie braucht ihn bald nicht mehr.
- *Irrglaube:* „Ich muss immer der Wissende sein.“
- *Bogen:* anfangs der große Lehrer, dann merkt er, dass Smilla schneller wird. In Akt 7 (Binnen) ist **er** der Unwissende (Schleuse, Fluss) und lernt von Quirin; das dreht die Rollen um.
- *Vorteil:* nutzt die vorhandene Binnen-Lücke (er ist dort ungeübt). *Risiko:* Smilla muss ihn dabei nie vorführen.

**Meine Empfehlung:** A als Grundton, **B als einen einzigen ernsten Höhepunkt** in Akt 6, C in Akt 7. So hat er genug Tiefe, und die Geschichte bleibt leicht.

### 3.3 Sprachliche Veränderung als Signal
Wenn er Fortschritt macht, ändert sich **seine Sprechweise** hörbar: Er sagt „Hast recht“ statt „Sag ich doch“. Ab Akt 5 kommt „Sag ich doch“ nur noch ironisch („Sag ich doch. Diesmal wirklich.“). So spürt der Hörer die Entwicklung, ohne dass jemand sie erklärt.

### 3.4 Wechsel im Ablauf
Nicht jedes Mal **Hinnerk irrt, Smilla berichtigt**. Muster, die sich abwechseln:
- Hinnerk hat recht, Smilla zweifelt und rechnet nach („Käpt'n, das stimmt wirklich.“).
- Beide liegen halb richtig, der Katalog klärt.
- Smilla irrt (Prüfungsfalle Tonne 10), Hinnerk bleibt still und hilft ihr anders.
- Das Gefühl hat eine **Ausnahme** („Meistens stimmt es, außer hier.“).

## 4. Smilla: die Regel mit Haken

**Heute:** frech, schnell, Köln am Rhein, hat beide Scheine, ist einmal bei Tonne 10 durchgefallen, erklärt genau, berichtigt Hinnerk.

**Das Risiko:** Wenn sie nie irrt, ist sie unsympathisch („Besserwisserin“) und der Hörer fühlt sich klein. Gerade Lern-Figuren wirken freundlicher, wenn sie sich auch selbst auf die Schippe nehmen (Humor gegen sich selbst, verbindend; belegt ist das nur schwach, siehe oben).

**Drei Varianten**
- **A „Die Bessere, die zuhört“:** Wunsch Skagen, Bedürfnis Geduld. Irrglaube: „Wer es weiß, muss es sofort sagen.“ Entwicklung: lernt, dem Hörer **Zeit zum Überlegen** zu geben (passt zur Denkpause 6 s) und Hinnerks Gefühl als Datenquelle zu nehmen („Spürst du Strom? Dann rechnen wir’s nach.“).
- **B „Die mit der Prüfungsangst“** (baut auf Tonne 10): Ihre Wunde ist das Durchfallen. Sie erklärt so genau, weil sie nie wieder scheitern will. Entwicklung: Vor der Probeprüfung (Akt 8) zeigt sie, dass auch sie Angst hat; Hinnerk beruhigt sie auf seine Art. Das hilft dem Hörer **ganz direkt** vor seiner eigenen Prüfung. Ernst, aber warm.
- **C „Die Fernwehtochter“:** Wunsch: raus aus dem Fluss aufs Meer, dem Rhein folgen bis Rotterdam und weiter (ihre Kindheitsgeschichte). Bedürfnis: ankommen. Entwicklung über die **Orte** der Reise (Elbe, Watt, Helgoland, Binnen). In Akt 7 (Binnen) ist sie wieder an Flüssen zu Hause.
- **Empfehlung:** B als Kern (sehr nützlich fürs Lernen), C als Ortsfarbe.

## 5. Klabauter, Harms, Quirin (kurz)

**Klabauter**
- *Variante A „Das Gedächtnis“ (heute):* Merksatz-Anker plus Quatsch. *Verbesserung:* Modus „Wichtig“ nur noch für **einen** Satz pro Folge, damit er seine Wirkung behält. Quatsch-Modus mit **Entwicklung**: er lernt Wörter nach, die ihm Hinnerk nicht beibringen wollte (und die stimmen zum Thema der Folge).
- *Variante B „Der Warnruf“:* Er klopft wie der Schiffsgeist **vor Gefahr**: Wenn er „Krrah!“ ruft, kommt sofort die Gefahr-Regel. Das passt zu seinem Namen und macht ihn zum Hörer-Signal („Jetzt aufpassen“).
- *Empfehlung:* A und B kombinieren. Aufhören mit dem Nachplappern **aller** Sätze.

**Harms**
- Rolle: streng, knurrig, alter Rivale von Hinnerk (Elblotse gegen Fährkapitän). *Vorschlag Bogen:* anfangs nur Prüfer, dann zeigt sich: Er hat Smilla damals **durchfallen lassen und ärgert sich noch**; in Akt 8 lässt er sie nicht durchfallen, sondern bringt sie an ihre Grenze und sagt am Ende nur „Bestanden.“. Dein Ton: streng, aber nie gemein.
- *Rivalität mit Hinnerk:* Eine Geschichte, **zwei Erzählungen**, die sich in jedem Akt ein Stück annähern; am Ende erkennt man, dass beide halb recht haben.

**Quirin**
- Heute sehr gut (Profi, Sonnenschein, Binnen). *Vorschlag:* Er bekommt **eine kleine Schwäche am Wasser**, die nichts mit Seekrankheit zu tun hat: Er ist Perfektionist bei Papier (Wasserstraßenregeln) und lässt sich von Smilla bei Praxis beibringen, locker zu bleiben. Dann sind beide ausgeglichen. So haben auch die gegenseitigen Frotzeleien („Fischkopp“, „Preiß“) einen Grund und nutzen sich nicht ab.

## 6. Gag-Verwaltung (Wiederholung ohne Fließband)

| Gag | Grenze | Variation |
|---|---|---|
| „Sag ich doch“ (Hinnerk) | höchstens 1× je 3 Folgen, ab Akt 5 ironisch | siehe 3.3 |
| „Hinni!“ (Klabauter) | höchstens 1× je Akt | Hinnerks Antwort wechselt („Hinnerk. Mit zwei n.“ → …) |
| Tonne 10 (Smilla) | höchstens 1× je Akt | Auflösung in Akt 8 |
| Zwieback und Banane (Klabauter) | höchstens 1× je 2 Folgen | wechselt Ziel (Katze, Harms, Gast) |
| großer Sturm von 87 | wächst nur in Akt 1–5, danach ernst in Akt 6 | siehe 3.2 B |
| „Süßwassermatrose“ / „Fischkopp“ | höchstens 1× je Akt | Konter wechselt |
| Seemannswitz aus dem Wortschatz (Abschnitt 12) | höchstens 1 je Folge, jeder Witz nur 1× | wird variiert oder gestrichen |

**Regeln:**
1. Ein Gag kehrt erst nach einer **Veränderung** zurück (etwas ist anders: Ort, Figurenzustand, Pointe).
2. **Nie in Sicherheits- und Seenot-Passagen.**
3. **Nie im Antwortsatz.**
4. Das Gag-Budget führe ich im Kontinuitätsprotokoll; wenn eine Grenze erreicht ist, schreibe ich neu.

## 7. Beziehungsmatrix (Entwurf)

| | Hinnerk | Smilla | Klabauter | Harms | Quirin |
|---|---|---|---|---|---|
| **Hinnerk** | – | Ziehvater/Tochter: Er will sie schützen, sie will, dass er lernt | 40 Jahre Freunde, der Papagei hat ihn geprägt | alte Rivalen, jeder erzählt die Begegnung anders | „Grummel trifft Sonnenschein“ |
| **Smilla** | braucht seine Erfahrung | – | Verbündete bei Merksätzen | Prüfungsangst, Respekt | Kollegen am Süßwasser |
| **Klabauter** | nervt ihn zuverlässig | Partner im Merken | – | verbittet sich Federn | plappert sein Bairisch nach |
| **Harms** | misstraut ihm freundlich | war ihr Prüfer | strenger Blick | – | professionell |
| **Quirin** | respektiert, necken | Freund | mag ihn | Respekt vor dem Prüfer | – |

## 8. Entwicklung über die Akte (Entwurf)

| Akt | Hinnerk | Smilla | Klabauter | Harms |
|---|---|---|---|---|
| 1 Ablegen | überzeugt, Gefühl | frisch, zeigt, wie es geht | Merksätze, Quatsch | am Telefon, streng |
| 2 Fahrwasser | verliert Wette gegen die Karte | lacht, ist zu schnell, wird gebremst | lernt neues Wort | schickt Aufgabe |
| 3 Regeln, Nacht, Nebel | schlägt heimlich nach | erste Zweifel („Wann habe ich das gelernt?“) | warnt im Nebel („Krrah!“) | Rivalen-Anekdote 1 |
| 4 Wasser, Wind, Wetter | „Hast recht.“ (erstes Mal) | Hinnerk-Gefühl wird Datenquelle | Wetterbericht nachgeplappert, richtig | Rivalen-Anekdote 2 |
| 5 Besondere Gebiete | erklärt Regel und Gefühl | freier, entspannter | ist stolz | zeigt Humor |
| 6 Not an Bord | **Sturm von 87 ruhig erzählt** | hört zu, tröstet | schweigt zum ersten Mal | respektvoll |
| 7 Binnen | ist Passagier, lernt von Quirin | zu Hause, Fluss | plappert Bairisch | – |
| 8 Prüfungsreife | gelassen, „Ich bin stolz.“ | Prüfungsangst, wird beruhigt | letzter Merksatz | „Bestanden.“ |

## 9. Meine Fragen an dich (die wichtigsten zuerst)

1. **Hinnerk: A, B, C oder Mix?** Insbesondere: Darf er eine **Wunde** haben (Variante B, Verlust im Sturm 87, nur einmal in Akt 6 ernst) oder soll es durchgehend leicht bleiben?
2. **Smilla: B (Prüfungsangst) als Kern?** Das hilft Lernenden direkt, ist aber ernst.
3. **Klabauter: Warnruf („Krrah!“ = Gefahr) zusätzlich zum Merksatz?**
4. **Harms: Er ließ Smilla damals durchfallen, will dich aber diesmal bestehen lassen. Passt das?**
5. **Quirin: Perfektionist bei Papier, locker bei Praxis?**
6. **Gag-Budget:** Gefällt dir die Begrenzung („höchstens ein Gag-Moment je Minute Lernstoff“, Obergrenzen oben)?
7. **Welche Gags sind dir heilig, welche nerven?** (Zwieback, Tonne 10, „Hinni“, Sturm 87 …)
8. **Weitere Figuren?** Gäste (Polizistin, Fischer, Rangerin) sind schon im Kursplan. Sollen **wiederkehrende Nebenfiguren** in den Akten dazu (zum Beispiel ein Hafenmeister, eine Funkerin)?
9. **Orte:** Dürfen Figuren an den Orten der Reise ein Eigenleben haben (zum Beispiel Hinnerk kennt jeden Hafenmeister)?

## 10. Nächste Schritte nach deinen Antworten

1. Figurenbibel als Datei anlegen (aus `figuren.md` plus deinen Entscheidungen).
2. Beziehungsmatrix, Gag-Budget und Entwicklungsbögen festschreiben.
3. Kontinuitätsprotokoll anlegen (ein Eintrag je Tag).
4. Erst dann Folgen und Tage schreiben (R15, B164).
