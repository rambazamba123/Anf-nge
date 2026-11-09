# Deine Aufgaben

> **Wozu:** Hier steht alles, was nur du tun kannst. Claude schreibt die Liste fort: Neues kommt dazu, Erledigtes wird abgehakt (✓) und nach einiger Zeit gelöscht.
> **Spalte „Was Claude tun kann“:** Hier steht, was ich dir dabei abnehmen kann. Sag einfach „mach Aufgabe 3“.
> **Dateien hochladen geht immer so:** github.com → Repository → Ordner `import` → „Add file“ → „Upload files“ → „Commit changes“. Was privat bleiben soll (amtliche PDFs), gehört in `quellen/` auf deinem Rechner und wird nie hochgeladen.
> Stand: 08.11.2026

## Jetzt wichtig: Hörreise
| Nr. | Aufgabe | Was Claude tun kann |
|---|---|---|
| 1 | **Echtes Material sammeln:** Erlebtes vom Wasser, Sprüche echter Skipper, wie Leute im Hafen reden, Seemannsgarn. Am besten als Sprachnotiz, gern frei eingesprochene Szenen mit Freunden. | Ich mache dir eine Liste mit Fragen, die dir beim Erinnern hilft („Wann hattest du das letzte Mal Angst auf dem Wasser?“). Sprachnotizen lasse ich abtippen (ElevenLabs kann das) und baue sie ein, ohne den Klang glattzubügeln. |
| 2 | **`docs/reise.md` lesen**, vor allem Abschnitt 3 (Hörreise) und 7 (Regelwerk), und sagen, was nicht stimmt. | Ich kann dir eine kurze Fassung zum Durchlesen auf dem Handy schreiben. |
| 3 | **★-Punkte festlegen:** Ortsnamen (Kuttershaven, Brede, Elvmünde, Klappdörp, Moorende, Groter Sand, Lüttoog, Harmsoog), Inhalt der Kiste ab Fach 3. (✓ Harms hat kein Geheimnis, 07.11.) (✓ Albertine für Harms' Schiff, 07.11.) | Ich schlage zu jedem Punkt zwei, drei Varianten mit Begründung vor, du wählst nur noch. |
| 4 | **`docs/dialog-regeln.md` prüfen:** Klingen die Regeln so, wie du es dir vorstellst? | Ich schreibe dir drei kurze Beispielszenen nach den Regeln, an denen du sofort hörst, ob es passt. |
| 5 | **Stimmen:** Erst die aktuellen anhören: Einstellungen → „Ton, Schrift und Stimmen“ → „🎧 Stimmen der Crew anhören“ (kostet nichts). Dann für jede Rolle mit „Fehlt“ eine Stimme auf ElevenLabs suchen und mir die **Voice-ID im Chat schicken**: Jasper, Hafenmeister Klüverhafen, Schleusenwärter Klappdörp, Seenotretter. Passt Quirin (Alexander)? | Ich trage die IDs in `podcast/audio_config.json` und `podcast/casting.json` ein. Wenn du mir Merkmale nennst, suche ich Vorschläge aus der Bibliothek heraus. |
| 6 | ✓ Freisprechen im Auto geht (08.11., Folge 3). Noch offen: **Nach der Technik-Probe:** Am Handy testen, ob das Hörspiel bei gesperrtem Bildschirm weiterläuft, die Pausen stimmen und „Mitantworten“ dich versteht. | Ich baue die Probe und schreibe dir genau auf, was du antippen und worauf du achten sollst. |
| 7 | Falls noch nicht geschehen: **die gehörte Kajütenfunk-Probefolge als ZIP** hochladen (Hocker → Kajütenfunk → „📦 ZIP speichern“), damit sie fest in der App ist. | Den Einbau danach mache ich (`tools/kurs-import.js`). |

| 23 | ✓ Szenen gewählt (08.11.), eingebaut in v5.53. | – |
| 29 | **Entwürfe „Crew an Bord“ ansehen** (Artifact): K1 Körper an Deck hinter Bordwand und Reling, K2 in der Kajüte Gesichter in den Bullaugen plus Balken unten, K3 dasselbe in Fahrt. Antwort mit K1 bis K3. | Ich baue es danach in die Bühne ein; dann schaukelt die Crew garantiert mit, weil sie Teil der Bootszeichnung ist. |
| 27 | ✓ Pacing entschieden (09.11., HR46 ja), Kürzungen in v5.57 umgesetzt. Alter Text: **Pacing entscheiden:** `docs/geschichte-logbuch.md` §5 lesen (Bewertung und sechs kleine Kürzungen in 1-1 bis 1-3, dafür Echos in späteren Folgen). Antwort „HR46 ja“ oder was anders sein soll. Am besten vor dem nächsten Vertonen, weil die betroffenen Abschnitte ohnehin neu fällig sind. | Ich setze die Kürzungen und Echos um und trage HR46 fest ein. |
| 28 | **Neu vertonen:** Durch v5.56 haben sich in allen drei Folgen Sätze geändert (Funkwörter, Nachdenkfragen, Verabschiedung vor Harms, Anlegen). Die geänderten Abschnitte fehlen jetzt; ⚙️ → „Erzeugen“ zeigt sie. Die Kürzungen sind jetzt drin (v5.57), du kannst erzeugen. | Ich rechne dir vorher aus, was es ungefähr kostet. |
| 26 | **Überarbeitete Szenen ansehen:** Artifact „Szenen der Hörreise“: Wetter oben umschalten, je Ort „Passt so“ oder bei der Schleuse A, B oder C antippen, unten „Auswahl kopieren“ und mir schicken. | Ich baue alles ein (Landschaft und Verkehr in Fahrt, Harms im Handy, Polizei von der Seite, Ankerleine, Schleuse). |
| 24 | **Folge 2 und 3 vertonen und hören:** Hocker → Folge 2 oder 3 → ⚙️ → „🎙️ Folge 2 und 3 vertonen“ (jetzt mit den Sätzen der Crew nach deiner Antwort, ein paar hundert Credits mehr). Danach hören und mir sagen, was stört. Gefällt es: ⚙️ → „📦 ZIP speichern“ und in den Ordner `import` hochladen. | Ich baue das ZIP für alle ein (`tools/kurs-import.js`), dann hört jeder die echten Stimmen ohne Schlüssel. |
| 25 | **Aussprache und Regie-Töne freigeben:** Beim Hören von Folge 2 und 3 auf „Moin“, „Hinnerk“, „Harms“, „Smilla“, „Pütz“, „Radeffekt“ achten (A31) und auf Lachen, Schnauben, Möwen (Audio-Tags, A14). Schreib mir „klingt gut“ oder was falsch klingt. | Ich trage die Freigaben ein; falsch Gesprochenes kommt ins Ausspracheverzeichnis. Danach meldet das Prüfwerkzeug keine Fehler mehr. |
| 22 | **Animationen bewerten** (v5.29, 79 neue): Frei üben → „🎞️ Animationen“ → Filter „Neu“, je Animation ansehen und „✓ Passt“ oder „✏️ Ändern“ mit Notiz; am Ende „📋 Alle Bewertungen und Notizen kopieren“ und mir in den Chat schicken. (✓ HR29 bestätigt, 08.11.) | Ich arbeite die Notizen gesammelt ab und gleiche die fachlichen Punkte mit den Originalen ab, sobald `quellen/` da ist. |

| 20 | **Figurenkarten bewerten** (`podcast/figuren.md`, Fassung 2.1). ✓ F1–F7 entschieden (07.11.). Offen: F8 Stimmen (Aufgabe 5). Und: Reichen dir die Klassiker in der Sprüchekiste (`podcast/sprueche.json`, 521 Sprüche)? | Ich kann dir je Figur eine kurze Probeszene schreiben, die du mit der Gratis-Stimme anhörst. |

| 21 | **Folgen 1-1 bis 1-3 lesen oder anhören** (Skripte `podcast/folgen/reise-1-1.md`, `reise-1-2.md`, `reise-1-3.md`): Kajüte → Hocker → „🎧 Folge 1, 2 oder 3“ → „▶ Abspielen mit Gratis-Stimme“ (kostet nichts, klingt nur nach Handy) oder unten „Erzeugen“ (etwa 6.700, 9.500 und 11.700 Credits, abschnittsweise möglich), dann im Auto- und im interaktiven Modus hören. Sag mir, was stört und was gut ist. Titel von 1-1 noch offen. | Ich mache aus deiner Rückmeldung Regeln (`docs/reise.md` §7) und überarbeite die Folge. Wenn du lieber erst liest: Das Skript schicke ich dir als Datei. |

## Dateien liefern
| Nr. | Aufgabe | Was Claude tun kann |
|---|---|---|
| 8 | Fehlende Audiodateien (etwa 17, Pixabay), Liste in `podcast/soundeffekte.md`. | Ich schreibe dir die Liste mit Suchbegriffen für Pixabay, damit du schnell findest. Fehlendes kann ich notfalls mit ElevenLabs-Geräuschen erzeugen, wenn du das willst (kostet Credits). |
| 9 | Funk-Kataloge SRC und UBI. | Danach baue ich die Funkscheine ein. |
| 10 | Dokument mit allen Zeichen (B159). | Danach gleiche ich Tonnen, Tafeln und Lichter damit ab. |
| 11 | Fragenkatalog-PDFs (für die Bilder in Farbe, V32). | Danach übernehme ich die Bilder unverändert. |
| 12 | Prüfungsrichtlinie (PDF vom 10.10.) nach `quellen/`. | Danach prüfe ich Zahlen zur Prüfung (Anzahl, Zeit, Bestehensgrenze). |
| 13 | Quellen für Etappe 2 (V29), siehe `docs/quellen.md`. | Prüfen mit `node tools/quellen-check.js` und einbauen. |

## Vor der Veröffentlichung
| Nr. | Aufgabe | Was Claude tun kann |
|---|---|---|
| 14 | Name, Anschrift und E-Mail in `impressum.html` und `datenschutz.html` eintragen (gelb markiert). | Wenn du mir die Angaben schreibst, trage ich sie ein. |
| 15 | Nutzungsbedingungen der amtlichen Bilder und Fragen bei ELWIS prüfen (L2). | Ich suche die Stellen heraus und fasse sie zusammen; die Entscheidung bleibt bei dir (oder einem Anwalt). |
| 16 | Haftungstext anwaltlich prüfen lassen (E13). | Ich bereite eine Mappe mit allen Texten und offenen Fragen für den Anwalt vor. |
| 17 | Am Original prüfen: SBF-Frage 279 (die vierte Antwort fehlt) und SKS recht-23 (braucht die Abbildungen). | Sobald die PDFs in `quellen/` liegen, mache ich das selbst. |
| 18 | Handy-Checkliste durchgehen (`CLAUDE.md` §8). | Ich kann sie auf die Punkte kürzen, die nach dem Umbau noch zählen. |
| 19 | Neue feste Sätze nachliefern (Einstellungen → Stimmenpaket → „🎙️ Neue Sätze nachliefern“, ZIP hochladen). Wird unwichtiger, weil nach der Freigabe ohnehin alles mit Eleven v4 neu gesprochen wird. | Einbau mit `tools/stimmen-import.js`. Wenn du in der Cloud-Umgebung einen ElevenLabs-Schlüssel hinterlegst, kann ich das Stimmenpaket direkt erzeugen. |
