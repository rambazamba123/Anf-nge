# Deine Aufgaben

> **Wozu:** Hier steht alles, was nur du tun kannst. Claude schreibt die Liste fort: Neues kommt dazu, Erledigtes wird abgehakt (✓) und nach einiger Zeit gelöscht.
> **Spalte „Was Claude tun kann“:** Hier steht, was ich dir dabei abnehmen kann. Sag einfach „mach Aufgabe 3“.
> **Dateien hochladen geht immer so:** github.com → Repository → Ordner `import` → „Add file“ → „Upload files“ → „Commit changes“. Was privat bleiben soll (amtliche PDFs), gehört in `quellen/` auf deinem Rechner und wird nie hochgeladen.
> Stand: 07.11.2026

## Jetzt wichtig: Hörreise
| Nr. | Aufgabe | Was Claude tun kann |
|---|---|---|
| 1 | **Echtes Material sammeln:** Erlebtes vom Wasser, Sprüche echter Skipper, wie Leute im Hafen reden, Seemannsgarn. Am besten als Sprachnotiz, gern frei eingesprochene Szenen mit Freunden. | Ich mache dir eine Liste mit Fragen, die dir beim Erinnern hilft („Wann hattest du das letzte Mal Angst auf dem Wasser?“). Sprachnotizen lasse ich abtippen (ElevenLabs kann das) und baue sie ein, ohne den Klang glattzubügeln. |
| 2 | **`docs/reise.md` lesen**, vor allem Abschnitt 3 (Hörreise) und 7 (Regelwerk), und sagen, was nicht stimmt. | Ich kann dir eine kurze Fassung zum Durchlesen auf dem Handy schreiben. |
| 3 | **★-Punkte festlegen:** Ortsnamen (Kuttershaven, Brede, Elvmünde, Klappdörp, Moorende, Groter Sand, Lüttoog, Harmsoog), Inhalt der Kiste ab Fach 3. (✓ Albertine für Harms' Schiff, 07.11.) | Ich schlage zu jedem Punkt zwei, drei Varianten mit Begründung vor, du wählst nur noch. |
| 4 | **`docs/dialog-regeln.md` prüfen:** Klingen die Regeln so, wie du es dir vorstellst? | Ich schreibe dir drei kurze Beispielszenen nach den Regeln, an denen du sofort hörst, ob es passt. |
| 5 | **Stimmen:** Jaspers Stimme aussuchen; Quirins Stimme passt (Alexander)? Werkstatt → „🎭 Stimmen-Casting“. | Ich kann Vorschläge aus der ElevenLabs-Bibliothek heraussuchen, wenn du mir Merkmale nennst. Anhören und wählen musst du. |
| 6 | **Nach der Technik-Probe:** Am Handy testen, ob das Hörspiel bei gesperrtem Bildschirm weiterläuft, die Pausen stimmen und „Mitantworten“ dich versteht. | Ich baue die Probe und schreibe dir genau auf, was du antippen und worauf du achten sollst. |
| 7 | Falls noch nicht geschehen: **die gehörte Kajütenfunk-Probefolge als ZIP** hochladen (Hocker → Kajütenfunk → „📦 ZIP speichern“), damit sie fest in der App ist. | Den Einbau danach mache ich (`tools/kurs-import.js`). |

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
