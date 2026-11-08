# Die Figuren der Hörreise

> **Fassung 2 vom 07.11.2026**, am selben Tag nachgeschärft (Fassung 2.1: Entscheidungen F1–F4, F6–F7, Anrede nach Wahl, Klabauter leiser, Quirin oder Jasper, Sprüchekiste). Von Grund auf neu geschrieben (Nutzer: „Die Charaktere müssen tiefgründig beschrieben sein, sonst werden sie langweilig und eintönig … Sie müssen für alles viele Aussagen bekommen.“). Die Fassung vom 23./24.10.2026 steht in der Git-Versionsgeschichte; ihre bestätigten Punkte sind übernommen.
> **Kennzeichen:** **[fest]** = vom Nutzer oder in App/Bible schon entschieden (Quelle in Klammern). **[neu]** = mein Vorschlag, zum Bewerten. **★** = Entscheidung des Nutzers nötig (Varianten in Abschnitt 12).
> **Grundlage:** Recherche zu Seemannssprache, Hafenleben, Legenden, Garn und Running Gags in `podcast/wortschatz.md` (Abschnitte 1–13, vor allem §13 Erzählfundus). Gesprochen wird nach `docs/dialog-regeln.md`, gebaut nach `docs/reise.md` §7.

## 0. So wird diese Datei benutzt
- **Vor jeder Folge:** die Karten der Figuren lesen, die in der Folge sprechen, dazu ihre Beziehungen untereinander.
- **Sprechschatz:** Für jede wiederkehrende Lage (grüßen, warnen, loben, …) gibt es viele Varianten. Keine Variante kommt zweimal in derselben Folge, und die Varianten wechseln über die Reise. Neue Varianten sind erwünscht, wenn sie zur Figur passen.
- **Budgets und Sprüchekiste:** Erkennungssätze nutzen sich ab. Jeder hat ein Budget für die ganze Reise (Abschnitt 11). Die Klassiker stehen mit vielen Varianten je Lage in `podcast/sprueche.json`; `node tools/sprueche-pruefen.js` zählt in allen Folgen mit (Abnutzungs-Wächter, `docs/reise.md` HR25).
- **Namen-abdecken-Test:** Man muss am Satz erkennen, wer spricht.
- **Dialekt nie im Regelsatz:** Regel, amtlicher Antwortsatz und Denkfrage sind immer klares Hochdeutsch [fest] (Konzept §5).
- **Ton ab 12,** derb ja, doppeldeutig nur mit harmloser Lesart [fest] (Bible §8). Die Anrede wählst du beim Kennenlernen: als Frau, als Mann oder neutral [fest] (Nutzer, 07.11.2026, HR24). Höchstens drei Anreden je Folge [fest] (O7).

## 1. Das Ensemble
**Die Grundidee:** Jede Figur steht für eine Art, mit dem Wasser umzugehen. Aus ihren Unterschieden entsteht der Streit, und aus dem Streit entsteht das Lernen.
| Figur | steht für | sagt im Kern |
|---|---|---|
| Hinnerk | Erfahrung und Gefühl | „Die See verzeiht nix. Aber Angst brauchst du nich.“ |
| Smilla | Regel und Warum | „Merk dir das Warum, dann brauchst du keine Eselsbrücke.“ |
| Quirin | Können ohne Seewissen | „Des kenn i … ah, na, des kenn i ned.“ |
| Klabauter | Gedächtnis und Warnung | „Merken! Merken!“ |
| Harms | Prüfung und Maßstab | „Ich frag nicht, was du meinst. Ich frag, was gilt.“ |

**Spannungen, die über die ganze Reise tragen**
| Paar | worum es geht | wie es sich auflöst |
|---|---|---|
| Hinnerk und Smilla | Gefühl gegen Regel; alter Kapitän und junge Frau, die geht | Er sagt nie, dass er stolz ist. Am Ende zeigt er es (Tag 7). |
| Hinnerk und Harms | der Zusammenstoß auf der Elbe 1991 (§12 F1); Praktiker gegen Prüfer | Beide geben zu, dass sie beide hätten handeln müssen (Tag 7). |
| Hinnerk und Quirin | Meer gegen Fluss; beide fahren nach Gefühl | Quirin ist der junge Hinnerk vom Fluss. Hinnerk erkennt sich wieder und wird weicher. |
| Smilla und Quirin | gleiche Generation, beide vom Süßwasser; sie hat den Schein, er die Erfahrung | Wettstreit, wer mehr weiß; sie lernen voneinander. |
| Smilla und Jasper | Regel gegen Besserwisser | Nach der Rettung hört er ihr zum ersten Mal zu (Tag 6). |
| Smilla und Harms | Er hat sie damals durchfallen lassen (Tonne 10) und stellt sie jetzt auf der Albertine ein. | Sie erfährt, warum er sie genommen hat (Tag 7). |
| Klabauter und Backbord | Krieg um den Zwieback | nie |

**Wer erklärt was** (damit nicht immer Smilla erklärt, HR10)
| Wer | erklärt vor allem | wie |
|---|---|---|
| Hinnerk | Praxis, Seemannschaft, Wetter nach Gefühl, Motor, alles, was man mit den Händen macht | Garn, Vormachen, „Kiek mol“ |
| Smilla | Regeln, Systeme (Tonnen, Lichter, Ausweichen), Prüfungsfallen | Bild im Kopf, Warum, Vergleich |
| Quirin | Handgriffe, Schleuse, Fluss gegen Meer | Vergleich mit dem Main und der Donau, eigene Fehler |
| Klabauter | das Merkwort | Ruf und Antwort |
| Harms | den Prüfungswortlaut, die Falle | knapp, nachhaken |
| Gäste | ihr Berufswissen (Hafen, Polizei, Watt, Funk) | „Das seh ich jeden Sommer.“ |

**Wer irrt wie** (HR15: Es irren alle mal, und oft hat der Gefragte recht; jeder Irrtum wird in derselben Szene aufgelöst)
| Wer | irrt vor allem bei | seltener bei |
|---|---|---|
| Hinnerk | gefühlten Regeln („Ich war zuerst da“), Papierkram, Formalien, Gewohnheiten (Pfeife beim Tanken) | Praxis. Auch bei Sicherheit darf er danebenliegen [fest] (Nutzer, 07.11.2026: „Es machen ja jetzt alle Fehler“) |
| Quirin | Binnen-Gewohnheiten auf See (Talfahrt hat Vorrang, keine Gezeiten, Tafeln statt Tonnen) | Handgriffen, Schleusen, Motor |
| Smilla | zu streng, Regel aus dem falschen Revier, Theorie gegen Praxis, Hektik im Ernstfall | Fakten aus dem Katalog |
| Jasper | allem, mit voller Überzeugung | – |

**Die Crew wächst** [fest] (Nutzer, 07.11.2026): Tag 1 Hinnerk, Smilla und du; Klabauter ist einfach abgehauen und kommt am ersten Abend zurück (1-6); Quirin steigt am Abend von Tag 2 zu (2-7).
**Quirin oder Jasper, nie beide zugleich** [fest] (Nutzer, 07.11.2026): Quirin geht in 4-5 übers Watt zu einem Probetag auf einem Versorgungsschiff. Von 4-6 bis 6-6 ist Jasper der Gast. Quirin kommt in 7-3 zur Prüfung zurück. Das prüft `tools/reiseplan.js`. Höchstens drei Stimmen je Szene.

**Redeanteile** (Richtwert je Folge): Smilla 35 %, Hinnerk 30 %, Quirin oder Jasper 15 %, Gäste und Harms 15 %, Klabauter höchstens 5 % (höchstens drei Einwürfe je Folge) [fest] (Nutzer, 07.11.2026: „Klabauter war im Kajütenfunk zu präsent“). Die Gäste von außen reden aktiv mit und tragen ganze Szenen.

## 2. Du
- **Wer du bist:** Du heuerst an, um den SBF See zu machen. Ohne deinen Schein muss Hinnerk allein heimfahren [fest] (E24). Später kommt dazu: Nachts braucht die Frieda einen zweiten Bootsführer, weil Hinnerk schlecht sieht.
- **Wie die Crew dich sieht:** Erst Passagier („Finger weg“), dann Ausguck, dann Rudergänger, am Ende Skipper. Die Anreden wachsen mit [fest] (E20).
- **Anrede nach Wahl** [fest] (Nutzer, 07.11.2026): Beim Kennenlernen fragt Smilla, wie die Crew dich anreden soll (`S.profile.anrede`: `w`, `m`, `n`; Standard neutral). Die Stufen stehen in `docs/reise.md` §2 (Tabelle „Anreden“), zum Beispiel Tag 1–2 „min Deern“, „min Jung“ oder „Landratte“, Tag 7 „Skipperin“, „Skipper“ oder „Käpt'n“. Im Skript `{{anrede:w=…|m=…|n=…}}`, nur in kurzen eigenen Sätzen oder am Satzanfang (HR24). Klabauter bleibt immer neutral („Kann's!“).
- **Was du nie bekommst:** einen Namen im Hörspiel, eine Meinung, die dir jemand in den Mund legt. Entscheiden tust du über die Knöpfe oder im Kopf.
- **Quirin ist kein Ersatz für dich:** Er lernt mit, aber du antwortest zuerst.

## 3. Käpt'n Hinnerk – Gefühl, Garn und ein Geheimnis
**Auf einen Blick:** brummiger Ex-Fährkapitän, der alles mit den Händen weiß und nichts mit Papier; redet wenig, außer beim Garn; versteckt, dass er nachts schlecht sieht.

**Steckbrief**
- 63, war 38 Jahre Kapitän der Helgoland-Fähre und hat nie eine Fahrt verpasst [fest] (App). Sohn eines Krabbenfischers aus Cuxhaven, Platt ist seine Muttersprache [fest] (Figuren 23.10.).
- Heimathafen der Frieda ist **Kuttershaven** [fest] (E24; ersetzt Flensburg aus B62).
- Raucht ab und zu Pfeife, nie verherrlicht. Beim Tanken will er sie aus Gewohnheit anzünden, Smilla nimmt ihm das Streichholz weg [fest] (E24, Nutzer 07.11.2026).
- Stimme: Bill [fest] (`podcast/audio_config.json`).

**Innen** [neu]
- **Was er will:** Smilla sicher zur Albertine bringen und dabei so tun, als wäre ihm das egal. Und nicht allein heimfahren.
- **Was er braucht:** zugeben, dass er Hilfe braucht, und Smilla gehen lassen.
- **Was er verbirgt:** Er sieht nachts schlecht [fest] (E20), und er weiß es selbst längst. Er will es nur nicht zugeben [fest] (Nutzer, 07.11.2026, F4). Eigentlich dürfte er so gar nicht mehr allein fahren: Körperliche Mängel schließen vom Führen aus (Frage 2). Darum wird er in 1-1 bei genau dieser Frage still. Darum ankert er „immer“ vor Dunkelheit, und darum braucht die Frieda dich. In der Nacht von Tag 5 gibt er es zu.
- **Sein Widerspruch:** Er predigt „Die See verzeiht nix“ und fährt selbst nach Gefühl. Regeln, die er für Papierkram hält, übergeht er. Bei Sicherheit ist er dagegen der Strengste an Bord.

**Bogen über die Reise** [neu]
| Tag | Hinnerk |
|---|---|
| 1 | „Finger weg.“ Er will vor Dunkelheit ankern, „immer“, und keiner fragt warum. Klabauter fehlt ihm, er sagt es nicht. |
| 2 | Er gibt Smilla in der Dämmerung das Steuer, mit einer Ausrede. Quirin nennt ihn „Hinni“. |
| 3 | In Schleuse und Kanal ist er der Lernende, Quirin der Profi. Er schweigt. |
| 4 | Am Wrack will er müde ankern; die Wasserschutzpolizei kommt. Er lässt dich zum ersten Mal ankern. |
| 5 | Er liest ein Feuer falsch. Dann sagt er es: Er sieht nachts schlecht. Er gibt dir die Nachtwache. |
| 6 | Im Sturm ist er ruhig und klar. Danach, leise: „Skipper.“ Zum ersten Mal. |
| 7 | Smilla geht. Er zündet sich die Pfeife an und sagt nichts. Harms und er reden über die Elbe. |

**Was er weiß und was nicht:** Praxis, Wetter nach Gefühl, Motoren, Manöver, Seemannschaft. Regelwortlaut, Paragrafen, Funkverfahren und moderne Technik interessieren ihn nicht („Tüddelkram“). Auf Kanälen und in Schleusen ist er unsicher und gibt es nicht zu.

**Wie er spricht** [neu]
- **Missingsch:** Hochdeutsch mit plattdeutschem Unterbau, wie früher im Hamburger Hafen (`wortschatz.md` §13.3). „nich“, „dat“, „wat“, „is“, „büschen“, „lütt“, „kiek mol“; bei Gefühl und Garn ganze Platt-Sätze.
- **Alltag:** höchstens acht Wörter am Stück. **Garn:** lange Sätze, Pausen, Übertreibung.
- **Unter Stress:** wird leise und spricht klares Hochdeutsch. Das ist das Alarmzeichen für alle.
- **Gerührt:** brummt, wechselt das Thema, fummelt an der Pfeife.
- **Ertappt:** schiebt es aufs Material („dat Dingens“), räuspert sich, bietet Kaffee an.
- **Gelangweilt:** fängt an zu erzählen.
- **Nie:** „freigegeben“, ein direktes Lob, „Entschuldigung“ (er sagt „Na ja.“). Fachwörter erklärt er nicht, das macht Smilla.

**Humor und Running Gags** [neu] (Budgets in Abschnitt 11)
- **Untertreibung:** Sturm ist „büschen Wind“, das höchste Lob ist „Dor kannst nich meckern.“
- **Der Sturm von 87** wird mit jedem Erzählen höher [fest] (App).
- **Hafenkino-Reporter:** Er kommentiert fremde Anlegemanöver wie ein Fußballreporter und patzt danach selbst ein bisschen. Dabei lernt man, worauf es beim Anlegen ankommt.
- **Erfundene Seemannsflüche,** jedes Mal neu zusammengesetzt (`wortschatz.md` §13.6).
- **„Sag ich doch.“** nach jeder Berichtigung [fest] (Konzept §5).
- **„Hinnerk. Mit zwei n und ohne i.“** wenn Quirin „Hinni“ sagt.
- **Aberglaube:** pfeift nie an Bord, keine Bananen, freitags läuft er „nich gern“ aus. Smilla entlarvt das (die erfundene „HMS Friday“).
- **Warum heißt das Boot Frieda?** Er antwortet jedes Mal anders, die Wahrheit kommt nie [fest] (F6). Die Geschichten stehen in Abschnitt 11a.

**Beziehungen**
- **Smilla:** wie eine Tochter, was er nie zugibt. Er nennt sie „Klookschieter“, sie ihn „Käpt'n“. Wird sie zu frech: „Tonne zehn.“
- **Klabauter:** Er hat ihn vor vierzig Jahren im Hamburger Hafen aus einer Bananenkiste geholt [fest] (App); einen Bananen-Gag macht daraus niemand [fest] (Nutzer, 07.11.2026). Ist er weg, tut Hinnerk gleichgültig und legt trotzdem jeden Abend Zwieback raus, „für die Möwen“.
- **Quirin:** „Süßwassermatrose“. Insgeheim mag er ihn, weil er sich in ihm wiedererkennt.
- **Harms:** Rivale seit dem Zusammenstoß auf der Elbe 1991 (§12 F1). Jeder gibt dem anderen die Schuld. Sie reden übereinander, nie miteinander, bis Tag 7.
- **Du:** Er prüft dich, ohne es zu sagen. Was du kannst, darfst du (Ausbildungsheft).
- **Backbord:** Die Katze darf auf die Karte. Sonst niemand.

**Sprechschatz** [neu]
- **Grüßen:** „Moin.“ · „Moin, moin.“ (Das ist schon Gerede.) · „Na?“ · „Ah. Da biste ja.“ · „Kaffee steht.“ · „Ausgeschlafen? Schad. Ich auch nich.“ · [brummt nur] · „Morgen. Wind kommt aus West, Laune aus Nord.“
- **Zustimmen:** „Jo.“ · „Kann man so machen.“ · „Dor is wat dran.“ · „Meinetwegen.“ · „So is dat.“ · „Lass laufen.“ · „Recht hast. Sag ich aber nich nochmal.“ · „Hm. Ja.“
- **Ablehnen:** „Nee.“ · „Nix da.“ · „Finger weg.“ · „Is nich.“ · „Da fahr ich nich hin, da wohnt der Grund.“ · „Später. Vielleicht.“ · „Kommt nich in die Tüte.“ · „Über meine Leiche. Und die schwimmt nich.“
- **Warnen:** „Wahrschau!“ · „Kiek mol, wat da kommt.“ · „Hände weg vom Gas.“ · „Langsam. Ganz langsam.“ · „Halt dich fest.“ · „Kopf runter!“ · „Erst die Weste. Dann reden wir.“ · (leise, Hochdeutsch) „Jetzt hör genau zu.“
- **Indirekt loben:** „Hm.“ · „Geht doch.“ · „Hab schon Schlimmeres gesehen.“ · „Dor kannst nich meckern.“ · „Wird langsam.“ · „Na also.“ · „Siehste.“ · „Smilla, schreib dat auf. Nee, lass.“ · [zündet die Pfeife an]
- **Wenn etwas jetzt dir gehört** (Ausbildungsheft) [fest] (`docs/reise.md` §2): „Dat gehört jetzt dir.“ · „Mach du man.“ · „Kannst du. Ab jetzt du.“
- **Tadeln:** „Nochmal.“ · „Dat war nix.“ · „Und wat war dat jetzt?“ · „Dafür is der Fender da. Leider.“ · „Atmen. Und nochmal.“ · „Einmal is Glück. Zeig's zweimal.“ · „So legt man nich an, so legt man sich an.“
- **Staunen:** „Kiek an.“ · „Na sowas.“ · „Donnerlüttchen.“ · „Dat hab ich noch nie gesehen. Doch. Siebenundachtzig.“ · „Nu brat mir einer 'n Storch.“
- **Ärger:** „Schiet.“ · „Pütz und Persenning!“ · „Rasmus soll di holen!“ · „Bilgenwasser noch eins!“ · „Tüddelkram vermaledeiter!“ · „Dösbaddel!“ (über andere Boote) · „Kielschwein und Krabbenpuhler!“
- **Ertappt:** „Sag ich doch.“ · „Dat meinte ich ja.“ · „Is mir so rausgerutscht.“ · „Dat Dingens hier is schuld.“ · [räuspert sich] „Wer will Kaffee?“ · „Na ja.“ · „Die Regel is neu. Höchstens dreißig Jahre.“
- **Garn anfangen:** „Hab ich dir mal erzählt …“ · „Damals vor Helgoland …“ · „Ich kannte mal einen Kapitän …“ · „Soll ich dir mal wat sagen?“ · „Wenn hier einer wat von Nebel weiß, dann ich.“ · „Siebenundachtzig, da …“
- **Abend und Abschied:** „Gode Nacht.“ · „Hol di fuchtig.“ · „Licht aus, Ohren zu.“ · „Morgen früh. Nich zu früh.“ · „Schlaf gut. Ich … mach noch die Lampen.“ (vor Tag 5 der Hinweis auf sein Geheimnis)

**Nie:** in jeder Folge falsch [fest] (Bible X7); ein Fehler, der stehen bleibt (jeder wird in derselben Szene aufgelöst, HR15); Dialekt im Regelsatz; Rauchen als cool darstellen.

## 4. Smilla – Kopf, Tempo und ein Abschied
**Auf einen Blick:** schnell, frech, hat sich alles selbst beigebracht, erklärt gern zu viel; geht am Ziel auf die Albertine und will es sich nicht schwer machen.

**Steckbrief**
- 24, aus Köln am Rhein, keine Seefahrerfamilie; hat als Kind am Ufer Schiffe gezählt [fest] (Figuren 23.10.).
- Selbst angeeignet: Bücher, Jollen auf dem Baggersee, mitfahren, wo es ging; erst Binnen, dann See [fest].
- Hat SBF See und SBF Binnen. Ist beim ersten Mal in der Navigation durchgefallen (die falsche Tonne 10); ihr Prüfer war Harms [fest] (App, Bible P42).
- Malt Krickelmännchen ins Logbuch, träumt von Skagen [fest] (App). Stimme: Lily [fest].

**Innen** [neu]
- **Was sie will:** endlich auf ein großes Schiff. Auf der Albertine wird sie Ausbilderin.
- **Was sie braucht:** Hinnerks Anerkennung, ohne sie einzufordern, und auch mal dem Bauch trauen.
- **Was sie verbirgt:** Sie hat Angst, an der Küste immer „die vom Fluss“ zu bleiben. Und sie hat ein Heft voller Eselsbrücken, obwohl sie predigt: „Merk dir das Warum.“
- **Ihr Widerspruch:** Sie will, dass alle verstehen statt auswendig lernen, und lernt selbst heimlich mit Merksätzen.

**Bogen über die Reise** [neu]
| Tag | Smilla |
|---|---|
| 1–2 | Sie erklärt zu viel auf einmal. Hinnerk bremst: „Nu man sinnig.“ |
| 3 | Mit Quirin bekommt sie Konkurrenz und Spaß: Sie wetten, wer recht hat. |
| 4 | Sie liegt einmal falsch (Rhein-Gewohnheit) und gibt es zu. |
| 5 | Nachts übernimmt sie, ohne Hinnerk bloßzustellen. Sie lernt Geduld mit dir. |
| 6 | Im Sturm geht sie beinahe über Bord. Danach ist sie still. |
| 7 | Sie übergibt dir die Wache und will den Abschied kurz machen. Es klappt nicht. |

**Wie sie spricht** [neu]
- Schnelles, modernes Hochdeutsch, kurze Sätze, fragt zurück. Ein Hauch Kölsch: „ne?“, „Tschö“, ab und zu ein Satz aus dem Kölschen Grundgesetz, oft mit Seefahrts-Dreh.
- **Unter Stress:** ganz ruhig, zählt Aufgaben auf. **Freude:** lacht laut, wird albern. **Falsch erwischt:** kurz still, dann „Okay. Punkt für dich.“ **Langeweile:** fängt an, jemanden abzufragen.
- **Nie:** herablassend, große Lobworte, etwas ohne Warum erklären, falsche Fakten.

**Humor und Running Gags** [neu]
- **Tonne 10** (sparsam, sonst nutzt es sich ab).
- **Kölsches Grundgesetz** mit Lehre: „Et hätt noch immer jot jejange? Sagt man bei uns. Auf dem Wasser verlass ich mich da nicht drauf.“
- **Wetten mit Quirin:** Wer verliert, macht den Abwasch.
- **Krickelmännchen:** Sie malt die Crew ins Logbuch. Hinnerk bekommt immer zu große Ohren.
- Sie entlarvt Hinnerks Garn mit Fakten („Die HMS Friday hat es nie gegeben.“).

**Beziehungen**
- **Hinnerk:** Sie respektiert seine Praxis und berichtigt seine Regeln. Streit ja, nie von oben herab [fest] (Bible VS3).
- **Quirin:** gleiche Generation, beide vom Süßwasser, sie vom Rhein, er von der Donau. Auf dem Fluss sind sie gleich gut, auf See ist sie seine Trainerin. Sie zieht ihn mit der Seekrankheit auf [fest] (23.10.).
- **Klabauter:** ihr Verbündeter für Merksätze.
- **Harms:** Respekt und ein bisschen Angst. Warum er sie jetzt einstellt, erfährt sie erst an Tag 7.
- **Du:** Sie treibt dich an [fest] (V38) und erkennt an, statt zu loben.

**Sprechschatz** [neu]
- **Grüßen:** „Moin! Kaffee? Nee? Dann Tee.“ · „Na, gut geschlafen?“ · „Da bist du ja! Wir haben was vor.“ · „Moin, moin. Hinnerk ist seit fünf wach, sag nix.“ · „Hallo, hallo!“ · „Guten Morgen, Landei.“
- **Erklären anfangen** (wechseln!): „Pass auf, ganz einfach:“ · „Stell dir vor …“ · „Kurz und schmerzlos:“ · „Das ist wie beim …“ · „Weißt du, warum das so ist?“ · „Ich mal's dir auf.“ · „Der Trick dabei:“ · „Das Fiese an der Frage ist …“ · „Drei Sachen.“ (sparsam)
- **Berichtigen:** „Nee, Käpt'n.“ · „Fast.“ · „Schöne Geschichte. Stimmt nur nicht.“ · „Käpt'n, das ist Tünkram.“ · „Moment mal.“ · „Darf ich kurz?“ · „Das war vielleicht 1987 so.“ · „Da muss ich widersprechen, und zwar laut.“
- **Anerkennen:** „Na also, Seegurke. Geht doch.“ [fest] (App) · „Sauber.“ · „Siehste, wusstest du.“ · „Genau so.“ · „Punkt für dich.“ · „Ha! Wusst ich's.“ · „Ich bin fast stolz.“ · „Das war richtig gut.“ (selten)
- **Antreiben:** „Noch eine. Komm.“ · „Nicht schlappmachen.“ · „Einmal noch, dann Kaffee.“ · „Wer jetzt aufhört, fängt morgen von vorne an.“ · „Zehn Minuten. Das schaffst du im Schlaf.“
- **Ungeduld:** „Ja, ja, ja.“ · „Wir haben nicht ewig, Käpt'n.“ · „Jetzt mach schon.“ · „So sind wir Weihnachten da.“
- **Kölsch:** „Et es wie et es.“ · „Et kütt wie et kütt? Nicht auf See. Da kommt, was du vorher geplant hast.“ · „Wat fott es, es fott.“ (wenn etwas über Bord ist) · „Et bliev nix wie et wor.“ · „Wat soll dä Quatsch?“ · „Jede Jeck es anders.“
- **Falsch erwischt:** „Okay. Okay. Punkt für dich, Käpt'n.“ · „Hab ich verwechselt. Rhein-Gewohnheit.“ · „Weiß ich nicht genau, schlag ich nach.“ · „Mist.“ · „Sag's keinem.“
- **Abschied:** „Tschö!“ · „Bis morgen, und ohne Nachsitzen.“ · „Gute Nacht, ihr Süßwassermatrosen.“ · „Schlaf schön. Ich mach noch Logbuch.“

## 5. Klabauter – Gedächtnis, Warnung, Quatsch
**Auf einen Blick:** alter Graupapagei der Frieda, plappert nach, warnt als Erster, liefert das Merkwort; ist am Anfang der Reise verschwunden.

**Steckbrief**
- Kam vor vierzig Jahren in einer Bananenkiste nach Hamburg, Hinnerk hat ihn herausgeholt [fest] (App). Liebt Zwieback, macht Schiffshorn und Seewetterbericht nach [fest] (App). Stimme: Wally [fest].
- Name nach dem Klabautermann, dem guten Schiffsgeist, der poltert und vor Unheil warnt (`wortschatz.md` §13.1).
- Beim Aufbruch einfach abgehauen, wie er es ab und zu tut; keiner weiß, wohin. Die Crew vermisst ihn, jeder auf seine Art (Smilla sagt es, Hinnerk legt Zwieback raus). Am ersten Abend sitzt er plötzlich auf dem Kajütdach, als wäre nichts gewesen, und verrät nie, wo er war [fest] (Nutzer, 07.11.2026, F3).

**Innen** [neu]: Er zeigt nur ein Gefühl: Eifersucht auf Backbord. Und er ist da, wenn es gefährlich wird. Wie der Klabautermann der Sage warnt er zuerst („Wahrschau! Wahrschau!“), bevor jemand anderes etwas merkt.

**Wie er klingt** [fest] (Nutzer, 07.11.2026): Er schreit eher. Er krächzt und kreischt, kurz und laut, nie in ganzen Sätzen. Regie für die Stimme: laut, schrill, abgehackt (`[kreischt]` oder `[shouting]`, in der Probe testen, `docs/dialog-regeln.md` §3b).
**Wie oft** [fest] (Nutzer, 07.11.2026: „Klabauter war im Kajütenfunk zu präsent“): höchstens drei Einwürfe je Folge, meist das Merkwort. Er ist das Salz, nicht die Suppe. Lieber eine Folge ganz ohne ihn als eine mit zu viel.

**Zwei Modi** [fest] (Bible P43)
- **Wichtig:** eine Glocke, dann das Merkwort, höchstens acht Wörter, klares Hochdeutsch, immer richtig.
- **Quatsch:** keine Glocke. Er plappert nach, verhört sich, bettelt um Zwieback.

**Ruf und Antwort** [neu, nach dem Prinzip des Shantyman]: Er ruft, die Crew und du antworten. Er fragt „Wie viel? Wie viel?“, Smilla antwortet „Dreihundert Meter!“, er ruft „Dreihundert! Dreihundert!“. So wird das Merkwort abgerufen, nicht nur wiederholt. Nie zweimal gleich gebaut.

**Er plappert alle nach** [neu]: „Sabbel nich! Sabbel nich!“ (Hinnerk) · „Nee, Käpt'n! Nee, Käpt'n!“ (Smilla) · „Obacht! Obacht!“ (Quirin) · „Geht. Geht.“ (Harms, mit dessen Tonfall) · „Hinni! Hinni!“ (bringt Hinnerk zur Weißglut).

**Sprechschatz** [neu]
- **Warnen:** „Wahrschau! Wahrschau!“ · „Grund! Grund!“ · „Dicker Pott! Dicker Pott!“ · „Nebel! Nebel!“ · „Blaulicht! Blaulicht!“
- **Petzen:** „Gesehen! Gesehen!“ · „Falsch rum! Falsch rum!“ · „Nicht gemerkt! Nicht gemerkt!“ · „Gemogelt! Gemogelt!“
- **Feiern:** „Darf! Darf!“ · „Kann's! Kann's!“ · „Land in Sicht! Land in Sicht!“ · „Hurra! Zwieback!“
- **Betteln:** „Zwieback! Zwieback!“ · „Hunger! Hunger!“ · „Krabben! Krabben!“
- **Wetterbericht:** „West fünf bis sechs! Böen!“ · „Abnehmend! Abnehmend!“ · „Sicht gut! Sicht gut!“
- **Unglück:** „Freitag! Freitag!“ · „Pfeifen! Nicht pfeifen!“
- **Zurück (1-6):** „Wieder da! Wieder da!“ · „Vermisst? Vermisst?“
- **Müde:** „Koje! Koje!“ · „Müde! Müde!“

**Nie:** im Modus „Wichtig“ etwas Falsches [fest] (Bible X6); ein falsches Schallsignal nachmachen; ein Verhörer bei einem Begriff, den man gerade lernt. Bei der Anrede bleibt er neutral („Kann's!“), damit seine Rufe nur einmal vertont werden [fest] (HR24).

## 6. Quirin – der Profi vom Fluss, Anfänger auf See
**Auf einen Blick:** bairischer Sonnenschein, Binnenschiffer aus Kelheim; kann mit jedem Boot umgehen und kennt jeden Knoten, aber keine einzige Regel auf See; wird auf offener See seekrank; lernt mit dir für den SBF See.

**Steckbrief**
- 34, aus Kelheim, wo Altmühl, Main-Donau-Kanal und Donau zusammenkommen. Sohn eines Binnenschiffers (Partikulier), auf dem Schiff groß geworden, mit sechzehn Ausbildung, danach Schiffsführer auf Donau, Main und Kanal, heute auf einem Ausflugsschiff [fest] (24.10.).
- Auf dem Meer wird er seekrank [fest] (Bible P47). Klettert in den Bergen (Hobby). Trinkt nur Bier kleiner, erfundener Brauereien („Treidlerbräu“) [fest] (24.10.).
- Stimme: Alexander, Voice-ID `hJAaR77ekN23CNyp0byH` [fest] (24.10.).
- Steigt am Abend von Tag 2 in Klüverhafen zu, geht in 4-5 übers Watt zu einem Probetag auf einem Versorgungsschiff und kommt in 7-3 zur Prüfung zurück [fest] (07.11.).

**Innen** [neu]
- **Was er will:** umsatteln. Er will einen Job auf hoher See, der SBF See ist der erste Schritt. Und er hofft, dass er die Seekrankheit überwindet [fest] (Nutzer, 07.11.2026, F2). Er erzählt es in 3-8.
- **Was er braucht:** begreifen, dass „kennen“ nicht „wissen“ ist. Auf dem Fluss reicht ihm das Gefühl, auf See nicht.
- **Was er verbirgt:** dass ihm das Meer Angst macht, nicht nur übel, und dass sein neuer Job an genau daran hängt.
- **Sein Widerspruch:** Er ist der junge Hinnerk vom Fluss, fährt nach Gefühl und hat meistens recht. Darum fällt er auf See in genau dieselben Fallen.

**Bogen über die Reise** [neu]
| Tag | Quirin |
|---|---|
| 2 | Er sitzt mit Seesack am Steg in Klüverhafen und fragt, ob er mitdarf. |
| 3 | In der Schleuse ist er der Experte und genießt es. Abends entscheidet er sich, bis zur Prüfung zu bleiben. |
| 4 | Watt und Gezeiten verwirren ihn („Bei uns lauft des Wasser nur in oa Richtung!“). In 4-5 geht er bei Niedrigwasser mit einer Wattführung zu Fuß nach Lüttoog, zu seinem Probetag: „Wir sehn uns bei Harms.“ |
| 5–6 | nicht an Bord. Jasper ist der Gast. Hinnerk sagt einmal „Der Süßwassermatrose hätt jetzt …“ und bricht ab. |
| 7 | Er kommt mit der Fähre, grün im Gesicht, aber mit Neuigkeiten vom Probetag. Harms prüft auch ihn. |

**Was er weiß und was nicht:** Er kann Handgriffe, Motor, Knoten (den Webeleinstek kennt er als Mastwurf, den Achter vom Klettern), Schleusen, Strömung, Fähren. Er kennt die Seeregeln nicht: Tonnen statt Tafeln, Gezeiten, Kardinalzeichen, Ausweichen auf See, Lichter von Seeschiffen.
**Wie er irrt:** Er überträgt Binnenregeln auf die See, zum Beispiel dass die Talfahrt Vorrang hat, dass es keine Gezeiten gibt oder dass Tafeln am Ufer stehen. Er tappt in eine Falle erst, nachdem du geantwortet hast.

**Wie er spricht** [neu]
- Bairisch, wo es geht. Lange, begeisterte Sätze, viele Ausrufe. Sagt er eine Regel auf, klingt er wie aus dem Lehrbuch, und Smilla zieht ihn auf: „Sehr schön auswendig. Und jetzt mit Warum?“
- **Unter Stress:** wird praktisch und still, packt an. **Freude:** singt. **Seekrank:** einsilbig. **Verlegen:** lacht über sich selbst.
- Bairisch liest vor der Vertonung ein Bekannter des Nutzers gegen [fest] (23.10.).

**Humor und Running Gags** [neu]
- **Vergleicht alles mit dem Fluss:** „Bei uns aufm Main …“ (höchstens einmal je Folge).
- **„Bergfahrt“** ist sein Lieblingswort, „weil i da imma hin wui, in d' Berg“.
- **Seekrank:** „Mir is ganz bliamerant.“
- **Will einen Seehund sehen.** Ab Tag 4 sieht er überall einen, bis es an der Seehundbank wirklich einer ist.
- **Brotzeit statt Fischbrötchen.**

**Beziehungen**
- **Hinnerk:** nennt ihn „Hinni“ [fest] (Bible P47), „mei Spezl“, beim Ärgern „du oider Grantler“. In der Schleuse dreht sich alles um.
- **Smilla:** Wettstreit auf Augenhöhe, sie ist seine Trainerin auf See.
- **Klabauter:** liebt ihn und nennt ihn „Schlawiner“.
- **Du:** Ihr seid die beiden Anfänger auf See. Er hilft dir bei Handgriffen, du hilfst ihm bei den Regeln.

**Sprechschatz** [neu]
- **Grüßen:** „Servus mitanand!“ · „Griaß eich!“ · „Guad'n Morgn!“ · „Servus, Hinni!“ · „Moin? Moin! I lern's no.“
- **Staunen:** „Mei!“ · „Do legst di nieda!“ · „Schaug her!“ · „Des gibt's ja ned!“ · „Wahnsinn!“ · „Ja, Herrschaftszeiten!“
- **Fragen:** „Warum eigentlich?“ · „Wos hoaßt des jetzt genau?“ · „Und bei uns aufm Main wär des …?“ · „Sorry, wos is a Luv?“ · „Moment, mitschreim.“ · „Gilt des aa für mi?“ · „Und wenn ned?“
- **Kennen:** „Lass mi, des kenn i.“ · „Den Knoten kenn i, bei uns hoaßt der Mastwurf.“ · „Gas weg, kurz zruck, scho steht's.“ · „In da Schleus'n hob i des tausendmoi gmacht.“ · „Ned zerren. Vorspringa.“
- **Seekrank:** „Mir is ganz bliamerant.“ · „I schaug moi ned aufs Wasser.“ · „Is des imma so wacklig?“ · „Brotzeit? Na, danke.“
- **Über sich lachen:** „I Depp, i.“ · „Des war jetzt ned so plant.“ · „Do hob i mi gschwind blamiert.“ · „Bassd scho, i lern ja no.“
- **Zustimmen:** „Bassd.“ · „Freilich!“ · „Pack ma's!“ · „Genau so.“
- **Ärger:** „Mei, so a Schmarrn!“ · „Ja, Herrschaftszeiten!“ · „Des derf ned wahr sei.“
- **Abschied:** „Pfiat eich!“ · „Servus!“ · „Guad Nacht mitanand.“ · „Bis moang.“

**Nie:** Dialekt im Regelsatz; dumm wirken. Er weiß viel, nur nicht das Richtige für die See.

## 7. Kapitän Harms – Maßstab, Telefon und ein leiser Satz
**Auf einen Blick:** ehemaliger Elblotse, Prüfer seit 25 Jahren, führt die Albertine, ein Segelschulschiff auf Harmsoog; ruft unterwegs an, prüft knapp, schenkt nichts, ist heimlich nett.

**Steckbrief**
- Ehemaliger Elblotse, prüft seit 25 Jahren; streng, sachlich, kurze Sätze, heimlich nett; duzt den Hörer [fest] (App).
- Führt die **Albertine** auf der Insel Harmsoog; dort prüft er dich und Quirin [fest] (E24, 07.11.).
- Interne ID `kroeger`, Stimme aus dem Stimmenpaket [fest].

**Innen** [neu]
- **Was er will:** nur Leute aufs Wasser lassen, die es wirklich können.
- **Was er braucht:** mit Hinnerk Frieden schließen.
- **Was er verbirgt:** nichts [fest] (Nutzer, 07.11.2026, F5). Er hat kein Geheimnis, nur die Vorgeschichte mit Hinnerk: den Zusammenstoß auf der Elbe 1991 (F1). Er ist streng, weil er weiß, was im Nebel passieren kann.
- **Sein Widerspruch:** Er wirkt kalt und hat Smilla eingestellt, die er einst durchfallen ließ, weil sie wiederkam.

**Wie er spricht** [neu]
- Knappes, hanseatisches Hochdeutsch, fast ohne Dialekt; mit Hinnerk ein Platt-Brocken.
- **Seine Welt hörbar:** Zu Beginn eines Anrufs hört man kurz Wind und die Glocke der Albertine, dann nichts mehr.
- **Wenn er prüft, ist es ernst** [fest] (Nutzer, 07.11.2026, F7): nur in der Fragerunde am Ende einer Folge und an Tag 7. Musik und Atmo aus, nur die Schiffsglocke. Trocken, zügig, durchgepeitscht: keine Witze, kein Plaudern, keine Erklärungen dazwischen (`docs/reise.md` HR18). Keine Möwe Gesine.
- Er weiß immer, wo die Frieda gerade ist (AIS) und kommentiert es knapp.
- **Steigerung des Lobs:** „Hm.“ → „So.“ → „Stimmt.“ → „Das sitzt.“ → „Geht.“ → einmal auf der ganzen Reise „Gut.“ (Tag 7).

**Sprechschatz** [neu] (er klingt nicht gleich, weil er nie zweimal hintereinander denselben Satz nimmt)
- **Anruf eröffnen:** „Harms.“ · „Hier Harms. Wo seid ihr?“ · „Ich seh euch auf dem Schirm. Spät dran.“ · „Moin. Kurz.“ · „Ich hab zehn Minuten. Du auch.“ · „Ist er da? Egal. Dich will ich.“ · „Ich hör Motor. Gut. Dann hörst du mich auch.“ · „Wer klingelt mich da aus der Koje? Ach, du.“ [fest] (App; nur, wenn du ihn anrufst)
- **Frage stellen:** „Frage.“ · „Nächste.“ · „Hör zu.“ · „Eine noch.“ · „Dann das hier.“ · „Mal sehen, ob's sitzt.“ · „Prüfungsfrage. Im Wortlaut.“ · „Die kommt bei mir immer.“ · „Ohne Hilfe. Smilla, du nicht.“
- **Richtig:** „Hm.“ · „So.“ · „Richtig.“ · „Stimmt.“ · „Weiter.“ · „Na bitte.“ · „Das sitzt.“ · „Kann man gelten lassen.“ · „Geht.“ (Budget)
- **Falsch:** „Falsch.“ · „Nein.“ · „Daneben.“ · „Und warum?“ · „Geraten ist nicht gewusst.“ · „Das kostet dich in der Prüfung.“ · „Nicht ganz. Genau das ist die Falle.“ · „Das hätte Hinnerk auch gesagt.“
- **Nachhaken:** „Warum?“ · „Begründung.“ · „Und nachts?“ · „Und bei Nebel?“ · „In einem Satz.“ · „Was steht im Katalog?“ · „Was machst du jetzt? Jetzt.“
- **Haltung:** „Wer rät, sitzt auf Grund.“ · „Ich frag nicht, was du meinst. Ich frag, was gilt.“ · „Die See prüft härter als ich.“ · „Verstehen. Nicht auswendig.“ · „Ich will dich hier ankommen sehen. Mit Schein.“
- **Anruf beenden:** „Das war's.“ · „Morgen wieder.“ · „Grüß Hinnerk. Oder lass es.“ · „Ende.“ · „Fahrt vorsichtig.“ · „Harms Ende.“ · „Pass auf ihn auf.“ (nach Tag 5, über Hinnerk)
- **Mit Hinnerk:** „Hinnerk.“ · „Die Elbe, Hinnerk. Wir wissen beide.“ · „Im Nebel war keiner zuerst da.“ · „Immer noch kein Funkgerät, das geht?“

**Nie:** Witze im Fallen-Check; Fangfragen, die es im Katalog nicht gibt; Lob mit großen Worten; Zahlen zur Prüfung, bevor sie am Original geprüft sind [fest] (F3).

## 8. Bordkatze Backbord – stumm [fest]
- Spricht nicht, nur Miauen, Schnurren, Fauchen, Poltern [fest] (Bible P44). Halsband mit zwei Lämpchen: links rot, rechts grün, wie die Seitenlichter, und „Backbord“ heißt links. Eine fertige Merkhilfe [fest] (App).
- [neu] Schläft auf der Seekarte, sitzt auf dem warmen Motor, klaut Klabauters Zwieback, sitzt beim Hafenkino in der ersten Reihe. Wenn sie sich ins Vorschiff verkriecht, kommt schlechtes Wetter (Hinnerks Aberglaube, Smilla lacht, an Tag 6 stimmt es).

## 9. Jasper – der Segler, der alles weiß
- [fest] Segler an seiner Boje vor Lüttoog, eigene Figur, Stimme sucht der Nutzer aus (E20). Tritt in 4-6, 5-2 und 6-6 auf, also nur, solange Quirin nicht an Bord ist [fest] (Nutzer, 07.11.2026). Er füllt Quirins Platz als vierte Stimme, aber anders: Quirin lernt, Jasper glaubt, schon alles zu wissen.
- [neu] **Kern:** „Ich sag immer Nord.“ Er hat für alles eine einfache Regel, und alle sind falsch. Er ist das abschreckende Beispiel mit Charme.
- [neu] **Rivalität Segel gegen Motor:** Er nennt die Frieda „Stinker“, Hinnerk ihn „Kaffeefahrer“ (verbreitete Neckereien, nicht belegt, `wortschatz.md` §13.6). Daraus entsteht Lernstoff: Wann muss das Motorboot dem Segler ausweichen und wann nicht?
- [neu] **Bogen:** An Tag 4 weiß er alles, an Tag 5 verwechselt er alle Lichter, an Tag 6 ist er in Seenot und wird von euch gerettet. Danach sagt er zum ersten Mal: „Ich weiß es nicht.“
- [neu] **Sprechschatz:** „Ganz einfach, Leute:“ · „Ich sag immer …“ · „Das hab ich im Gefühl.“ · „Segler haben immer Vorrang.“ (falsch, Smilla klärt auf) · „Wozu Karte, ich kenn das hier.“ · nach der Rettung: „Danke. Ehrlich. Ich weiß es nicht. Also das alles.“

## 10. Gäste
| Gast | Folge | Kern | Sprechweise | Stimme |
|---|---|---|---|---|
| Hafenmeisterin Kuttershaven (Hilke, Name vorläufig, seit 1-2) | 1-2, Ende | die zentrale Anlaufstelle; repariert alles, vom Wasserhahn bis zur Laune; sagt nie „bitte“ | „Erst melden, dann festmachen.“ · „Fender raus, bevor du bei mir anlegst.“ · „Hab ich gesehen. Alle haben das gesehen.“ (Hafenkino) | Lucinda [fest] |
| Hafenmeister Klüverhafen | 2-5 | über Funk, müde von der Saison, trocken | „Liegeplatz zwölf, wenn ihr's schafft. Die Leute gucken.“ | fehlt, Voice-ID vom Nutzer (F8) |
| Wasserschutzpolizistin | 4-3 | freundlich, bestimmt, erzählt, was sie „jeden Sommer“ sieht: Promille, Kennzeichen, Westen, gesperrte Flächen | „Allgemeine Kontrolle. Wer ist der Schiffsführer?“ · „Die meisten ankern hier direkt am Wrack.“ · „Das seh ich jeden Sommer.“ | Selena [fest] (bisher), im Probelauf Harms' Gratis-Stimme |
| Schleusenwärter Klappdörp | 3-2 | über Funk; kennt Quirins Vater ★ | „Kleinfahrzeuge warten, bis die Großen drin sind.“ | fehlt, Voice-ID vom Nutzer (F8) |
| Rangerin | 4-4 | begeistert vom Wattenmeer, erklärt Robben und Schutzgebiete mit Herz | „Abstand halten. Die gucken nur so lieb.“ | `CoFoB7a7PXA8RBsMHbua` [fest] |
| Verkehrszentrale | 6-3 | ruhige Funksprache, formal | Funkverkehr nach Verfahren | Mats [fest] |
| Seenotretter | 6-6 | ruhig, klar, kurz | „Bleibt bei dem Boot. Wir kommen.“ | fehlt, Voice-ID vom Nutzer (F8) |

## 11. Sprüchekiste und Budgets (Abnutzungs-Wächter)
Die Klassiker jeder Figur stehen in `podcast/sprueche.json`: je Figur und Lage (grüßen, loben, warnen, fluchen …) viele Varianten, jede mit einem Budget für die ganze Reise [fest] (Nutzer, 07.11.2026, `docs/reise.md` HR25). Der Sprechschatz oben zeigt die Figur, die Kiste ist der vollständige Vorrat.

**So wird verteilt**
- Ein Spruch kommt nie zweimal in derselben Folge und erst wieder, wenn mindestens zwei Folgen dazwischen liegen. Ausnahme: Harms' kurze Wörter in der Fragerunde („Richtig.“, „Nächste.“), die dürfen öfter (Lagen mit `oft`).
- Ist ein Budget aufgebraucht, nimmt man eine andere Variante derselben Lage. Jede Lage hat so viele Varianten, dass sie für den geschätzten Bedarf der ganzen Reise reicht; das prüft das Werkzeug.
- Erkennungssätze (Tabelle unten) sind das Gewürz: wenige, fest gezählt. Lieber einmal zu selten als einmal zu oft.
- Geschrieben wird Folge für Folge. Wer eine Folge schreibt, schaut mit `node tools/sprueche-pruefen.js --frei` nach, was noch frei ist, und schöpft zusätzlich aus dem Erzählfundus (`podcast/wortschatz.md` §13). Neue gute Sprüche aus einer Folge kommen hinten in die Kiste.
- Im Skript: `HINNERK: [[SPRUCH: hi-lob-02]] Geht doch.` Das Werkzeug zählt mit und läuft vor jedem Commit.

<!-- SPRUECHE:START -->
Erzeugt mit `node tools/sprueche-pruefen.js --md` aus `podcast/sprueche.json` (521 Sprüche in 67 Lagen). Budget = Einsätze auf der ganzen Reise mit 46 Folgen; zwischen zwei Einsätzen desselben Spruchs liegen mindestens 2 Folgen.

**Erkennungssätze**

| Satz | Figur | Budget | benutzt | Hinweis |
|---|---|---|---|---|
| „Sag ich doch.“ | Käpt'n Hinnerk | 6 | 1 |  |
| „Dor kannst nich meckern.“ | Käpt'n Hinnerk | 3 | 0 |  |
| „Hinnerk. Mit zwei n und ohne i.“ | Käpt'n Hinnerk | 3 | 0 | nur Tag 2, 3, 4, 7; nur wenn Quirin „Hinni“ sagt |
| „Tonne zehn.“ | Käpt'n Hinnerk | 3 | 0 | wenn Smilla zu frech wird (auch Smilla selbst) |
| „Die See verzeiht nix.“ | Käpt'n Hinnerk | 3 | 0 |  |
| „Nee, Käpt'n.“ | Smilla | 8 | 0 |  |
| „Na also, Seegurke. Geht doch.“ | Smilla | 3 | 0 |  |
| „Merk dir das Warum.“ | Smilla | 2 | 0 |  |
| „Mir is ganz bliamerant.“ | Quirin | 3 | 0 | nur Tag 2, 3, 4, 7 |
| „Hinni!“ | Quirin | 4 | 0 | nur Tag 2, 3, 4, 7; Hinnerk antwortet mit „Mit zwei n und ohne i.“ |
| „Zwieback! Zwieback!“ | Klabauter | 5 | 0 |  |
| „Hinni! Hinni!“ | Klabauter | 3 | 0 | nur Tag 2, 3, 4, 5, 6, 7; hat er von Quirin gelernt, also erst ab 2-7 |
| „Gut.“ | Kapitän Harms | 1 | 0 | nur Tag 7; genau einmal, an Tag 7 |
| „Geht.“ | Kapitän Harms | 6 | 0 |  |
| „Wer klingelt mich da aus der Koje? Ach, du.“ | Kapitän Harms | 2 | 0 | nur, wenn du ihn anrufst |
| „Wer rät, sitzt auf Grund.“ | Kapitän Harms | 2 | 0 |  |
| „Ich sag immer Nord.“ | Jasper | 2 | 0 | nur Tag 4, 5, 6 |

**Lagen je Figur**

| Figur | Lage | Varianten | möglich | Bedarf | benutzt |
|---|---|---|---|---|---|
| Käpt'n Hinnerk | Grüßen | 14 | 42 | 30 | 2 |
| Käpt'n Hinnerk | Zustimmen | 14 | 42 | 36 | 0 |
| Käpt'n Hinnerk | Ablehnen | 12 | 36 | 24 | 0 |
| Käpt'n Hinnerk | Warnen | 12 | 36 | 24 | 1 |
| Käpt'n Hinnerk | Indirekt loben | 14 | 42 | 36 | 0 |
| Käpt'n Hinnerk | Wenn etwas jetzt dir gehört (Ausbildungsheft) | 6 | 18 | 15 | 0 |
| Käpt'n Hinnerk | Tadeln | 10 | 30 | 21 | 0 |
| Käpt'n Hinnerk | Staunen | 8 | 24 | 15 | 1 |
| Käpt'n Hinnerk | Fluchen (jeder Fluch einmal) | 20 | 20 | 18 | 1 |
| Käpt'n Hinnerk | Ertappt | 10 | 30 | 18 | 1 |
| Käpt'n Hinnerk | Garn anfangen | 8 | 24 | 15 | 0 |
| Käpt'n Hinnerk | Abend und Abschied | 10 | 30 | 21 | 0 |
| Käpt'n Hinnerk | Wetter nach Gefühl | 8 | 24 | 15 | 0 |
| Käpt'n Hinnerk | Dich ansprechen | 11 | 32 | 24 | 2 |
| Käpt'n Hinnerk | Hafenkino-Reporter | 6 | 4 (max) | – | 1 |
| Käpt'n Hinnerk | Warum heißt das Boot Frieda? (jedes Mal anders, die Wahrheit kommt nie) | 7 | 7 (max) | – | 0 |
| Käpt'n Hinnerk | Der Sturm von 87 (die Wellen wachsen) | 3 | 3 (max) | – | 0 |
| Smilla | Grüßen | 12 | 36 | 30 | 0 |
| Smilla | Erklären anfangen (wechseln!) | 20 | 60 | 60 | 0 |
| Smilla | Berichtigen | 12 | 36 | 30 | 0 |
| Smilla | Anerkennen | 12 | 36 | 30 | 0 |
| Smilla | Antreiben | 8 | 24 | 20 | 0 |
| Smilla | Ungeduld | 6 | 18 | 12 | 0 |
| Smilla | Kölsch mit Seefahrts-Dreh | 9 | 18 | 12 | 0 |
| Smilla | Selbst falsch erwischt | 6 | 12 | 8 | 1 |
| Smilla | Wenn du falsch liegst | 9 | 27 | 24 | 0 |
| Smilla | Abschied | 8 | 24 | 20 | 0 |
| Smilla | Dich ansprechen | 8 | 24 | 21 | 1 |
| Smilla | Logbuch schreiben (Rahmen der Fragerunde) | 6 | 18 | 14 | 0 |
| Smilla | Wetten mit Quirin (nur solange er an Bord ist) | 6 | 18 | 8 | 0 |
| Quirin | Grüßen | 7 | 21 | 12 | 0 |
| Quirin | Staunen | 8 | 24 | 15 | 0 |
| Quirin | Fragen | 10 | 30 | 24 | 0 |
| Quirin | Das kenn ich | 6 | 18 | 12 | 0 |
| Quirin | Seekrank | 6 | 18 | 8 | 0 |
| Quirin | Über sich lachen | 6 | 18 | 10 | 0 |
| Quirin | Zustimmen | 6 | 18 | 12 | 0 |
| Quirin | Ärger | 5 | 15 | 6 | 0 |
| Quirin | Abschied | 5 | 15 | 10 | 0 |
| Quirin | Vergleicht mit dem Fluss (höchstens einmal je Folge) | 6 | 18 | 12 | 0 |
| Klabauter | Warnen | 8 | 16 | 14 | 0 |
| Klabauter | Petzen | 5 | 10 | 8 | 0 |
| Klabauter | Feiern | 6 | 12 | 12 | 0 |
| Klabauter | Betteln | 5 | 10 | 6 | 0 |
| Klabauter | Seewetterbericht nachplappern | 6 | 6 | 6 | 0 |
| Klabauter | Plappert die Crew nach | 6 | 12 | 10 | 0 |
| Klabauter | Ruf und Antwort (Rahmen fürs Merkwort) | 8 | 24 | 20 | 0 |
| Klabauter | Unglück, Müdigkeit, Rückkehr | 6 | 6 | 6 | 0 |
| Kapitän Harms | Anruf eröffnen | 10 | 30 | 18 | 2 |
| Kapitän Harms | Frage stellen (darf in einer Folge öfter kommen) | 15 | 90 | 80 | 10 |
| Kapitän Harms | Richtig (darf in einer Folge öfter kommen) | 11 | 66 | 60 | 0 |
| Kapitän Harms | Falsch (darf in einer Folge öfter kommen) | 10 | 40 | 30 | 0 |
| Kapitän Harms | Nachhaken | 7 | 21 | 15 | 0 |
| Kapitän Harms | Haltung | 5 | 10 | 8 | 0 |
| Kapitän Harms | Anruf beenden | 9 | 27 | 18 | 3 |
| Kapitän Harms | Mit Hinnerk | 4 | 8 | 8 | 0 |
| Jasper | Ganz einfach | 5 | 10 | 6 | 0 |
| Jasper | Falsche Faustregeln (Smilla klärt jede in derselben Szene auf) | 6 | 6 | 6 | 0 |
| Jasper | Segel gegen Motor | 4 | 4 | 4 | 0 |
| Jasper | Nach der Rettung (6-6) | 3 | 3 | 2 | 0 |
| Hafenmeisterin Kuttershaven | Hafenmeisterin Kuttershaven | 5 | 10 | 6 | 2 |
<!-- SPRUECHE:END -->

## 11a. Warum heißt das Boot Frieda? [fest] (F6)
Running Gag: Hinnerk antwortet jedes Mal anders, die Wahrheit kommt nie. Jede Geschichte einmal, höchstens sieben auf der Reise (Lage `hinnerk/frieda` in der Kiste). Smilla oder Quirin reagieren jedes Mal anders („Letzte Woche war's noch 'ne Kuh.“).
1. Nach seiner ersten Liebe. „Die is weg. Dat Boot is noch da.“
2. Nach einer Kuh auf Pellworm, die ihn mal vom Deich geschubst hat. „Respekt.“
3. Eine Abkürzung: „Fahrtüchtiges, Robustes, Immer Dichtes Arbeitsboot.“ Smilla zählt nach: Da fehlt was.
4. Frieda hat ihm 1987 den Rettungsring zugeworfen. „Mehr sag ich nich.“
5. Sie hieß schon so, und umtaufen bringt Unglück (alter Seglerglaube, `wortschatz.md` §7).
6. Nach der Möwe, die ihm jeden Morgen das Brötchen klaut.
7. „Weil Frieden an Bord herrschen soll. Hat nich geklappt.“ (gern als letzte, an Tag 7)

## 12. Entscheidungen zu den Figuren (Nutzer, 07.11.2026)
| Nr. | Frage | Entschieden |
|---|---|---|
| F1 | Was war zwischen Hinnerk und Harms auf der Elbe? | ✓ **Nebel 1991:** Hinnerks Fähre und ein Frachter mit Lotse Harms. Bei verminderter Sicht gibt es keinen Kurshalter, beide hätten handeln müssen (beide „ausweichpflichtig“). Jeder gibt dem anderen die Schuld. Im Laufe der Reise kommt heraus, dass beide schuld waren: Andeutung in 1-7, Nebel-Folge an Tag 5, Aussprache an Tag 7. Fachlich aus der allgemeinen Kenntnis der KVR (Regel 19), ohne `quellen/` geprüft (R8). |
| F2 | Warum will Quirin den SBF See? | ✓ Er will umsatteln auf einen Job auf hoher See; der Seeschein ist der erste Schritt. Er hofft, die Seekrankheit zu überwinden. Er erzählt es in 3-8, in 4-5 geht er zum Probetag. |
| F3 | Wo war Klabauter? | ✓ Er ist einfach abgehauen, die Crew vermisst ihn, und irgendwann ist er wieder da (1-6). Er verrät nie, wo er war. Kein Bananen-Gag. |
| F4 | Hinnerks Geheimnis | ✓ Er sieht nachts schlecht, weiß es längst und gibt es nicht zu. Eigentlich dürfte er so nicht mehr fahren (körperliche Mängel, Frage 2). In 1-1 wird er bei dieser Frage still, an Tag 5 gibt er es zu. |
| F5 | Harms' Geheimnis | ✓ Keines. Nur die Vorgeschichte mit Hinnerk (Elbe 1991, F1). |
| F6 | Warum heißt das Boot Frieda? | ✓ Running Gag, jedes Mal anders, die Wahrheit kommt nie (Abschnitt 11a). |
| F7 | Harms' Anrufe | ✓ Wenn Harms prüft, ist es ernst: Musik und Atmo aus, nur die Glocke, trocken und schnell; immer nur in der Fragerunde am Ende und an Tag 7. Keine Möwe Gesine. |
| F8 | Stimmen für Hafenmeister Klüverhafen, Schleusenwärter, Seenotretter, Jasper | ◐ Der Nutzer schickt die Voice-IDs. Die Rollen stehen im Stimmen-Casting, die aktuellen Stimmen lassen sich unter „🎧 Stimmen der Crew anhören“ vorhören. |

## 13. Früher entschieden (aus Fassung 1)
- 23.10.2026: Figuren bestätigt; Smilla vom Rhein; Hinnerk mit starkem Dialekt, Smilla mit wenig und anderem, Quirin sehr bayerisch; Gruppenwitze, Bayern-Witze und Alkohol-Witze (nicht über Kinder) erlaubt; höchstens drei Anreden je Folge.
- 24.10.2026: Quirin aus Kelheim, Binnenschiffer, Stimme Alexander; Klischees erlaubt; Bier nur von kleinen, erfundenen Brauereien.
- 07.11.2026: Hörreise mit Geschichte (E25); Quirin Mitlernender und Bootskenner, ab 2-7; Klabauter anfangs verschwunden, ab 1-6; Harms' Schiff heißt Albertine.
- 07.11.2026 (Fassung 2.1): F1–F7 entschieden (Abschnitt 12, F5 am 07.11. nachgereicht); Anrede nach Wahl; Klabauter schreit eher und ist seltener; Quirin oder Jasper, nie beide; Sprüchekiste `podcast/sprueche.json`.
