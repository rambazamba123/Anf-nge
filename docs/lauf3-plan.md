# Lauf 3 – Überblick und Unteretappen

Stand: 08.10.2026 · Grundlage: CLAUDE.md §5.4, 5.9–5.13, 5.15 (aus `CLAUDE-nachtrag-lauf3.md`)

## Entscheidungen (aus den Antworten des Nutzers)
- **Schwierigkeit kommt aus dem Schein**, nicht aus einer Stufe an der Frage. Tags haben also nur Thema und Art, keine Stufe.
- **Funk und Pyro später**, aber die Schein-Auswahl ist jetzt schon so gebaut, dass ein neuer Schein nur als Eintrag in `COURSES` plus Daten dazukommt.
- Schein-Auswahl beim Start (Kennenlernen) und im Menü.

## Was im Code schon da ist
- `COURSES` (index.html ~1884) ist schon ein Schein-Register (`sbf`, `sks`, `binnen`), `switchCourse` und `useCourse` gibt es.
- Deck: `renderBoat` (~3915), `boatScene` (~3640), `longBoatScene` (~3713).
- Kajüte: `renderCabin` (~2724). Navi: `navSchool` (~3964), `navi.js`.
- Einführung beim Start: `convoOnboarding` (~2545), Flag `introV5`.
- `index.html` hat 467 KB. Die Vorgabe „nicht weiter wachsen“ gilt also: neue Bereiche in eigene Dateien.

## Unteretappen (Reihenfolge wie im Nachtrag)
| Etappe | Inhalt | Blocker / Hinweis |
|---|---|---|
| L3a 5.9 Moin | „MOOOOIN“ mit langem O. ElevenLabs-Kürzung prüfen, Lösung wählen. Fester Satz fürs Paket | ElevenLabs ist hier gesperrt: Prüfung nur mit Freigabe oder vom Nutzer per Handy |
| L3b 5.4 zwei Ansichten | Übersicht ohne Wischen, mit Übermenü (Fortschritt pro Schein, Einstellungen, Konto, Schein wechseln), Knopf „An Bord gehen“. Detail startet zwischen Steuer und Kajüte, Steuer startet Törn | Ersetzt `boatScene`/`longBoatScene`; Hotspots und Eggs ziehen mit |
| L3c 5.10 Einführungen | Pro Funktion einmal kurze Crew-Einführung (≤ 30 s, überspringbar, feste Sätze). Pro Funktion ein Flag im Spielstand. „Einführungen erneut zeigen“ in den Einstellungen. Navi zuerst | Neue Datei `intro.js`; neues Feld mit Standardwert |
| L3d 5.11 Navi prüfen | Kritische Prüfung der Navi-Rechnungen nach Checkliste (Vorzeichen, Strom „wohin“, Distanz am Breitenrand usw.). SKS-Stufe: Doppelpeilung, Versegelungspeilung, Kartenaufgabe. Kartenbeschriftung bei kleinem Zoom lesbar | Fehlerliste für den Bericht. Umfang SKS nur aus `quellen/` (fehlt hier, siehe offen) |
| L3e 5.12 Prüfer holt ab | Tür-Zugang weg; Telefon/Funkgerät in der Kajüte bestellt Harms, dann Animation und Spruch; Fernglas markiert den neuen Zugang | Bestehender Prüfungsstart (`examIntro`/`startExam`) umhängen |
| L3f 5.13 Schein-Auswahl | Schein-Wahl beim Start und im Menü über `COURSES`. Funk und Pyro nur als Platzhalter („später“), ohne Inhalt. Tag-Feld `schein` vorbereiten | Keine Funk-/Pyro-Inhalte in diesem Lauf |
| L3g 5.15 Technik | Rauchtest als Skript in `tests/smoke` (klickt Kurse und Bereiche, meldet Konsolenfehler). Liste der festen Sätze pflegen | Playwright-Harness liegt im Scratchpad, muss ins Repo |

Danach Bericht (festes Format aus CLAUDE.md §7) und Push nach OK.

## Offene Punkte und Widersprüche
1. **Stimmenpaket:** Der Nachtrag sagt „am Ende eines Laufs einmal erzeugen“. CLAUDE.md §8 sagt: erst nach der Überarbeitung der Podcastfolgen. Ich folge CLAUDE.md, bis du etwas anderes sagst.
2. **Push:** Das Stop-Hook-Skript verlangt Push, CLAUDE.md verlangt Push erst nach OK. Ich committe lokal und pushe erst nach deinem OK, außer du sagst etwas anderes.
3. **§5.14 Törn 2.0:** Nachtrag und CLAUDE.md sind inhaltlich gleich. Ich behalte die ausführliche Fassung in CLAUDE.md.
4. **Kataloge:** `quellen/` fehlt in dieser Umgebung. SKS-Tiefe (5.11) und Funk/Pyro brauchen sie.
5. **ElevenLabs und GitHub Pages** sind von hier aus gesperrt. Tests mit echten Stimmen bleiben Handy-Checkliste.

## Abhängigkeiten
- L3b braucht L3c nicht, aber beide berühren den Start, deshalb L3b vor L3c.
- L3e hängt von L3b ab (Fernglas-Markierung).
- L3g kommt zuletzt, weil der Rauchtest alle Bereiche durchklickt.

## Stand nach Lauf 3 (08.10.2026, v4.35–v4.42)
Alle Unteretappen erledigt. Abweichungen vom Plan:
- L3c: statt `intro.js` liegen die Sätze in `data/einfuehrungen.json`, im Code nur die kleine Funktion `einfuehrung(id)` (spart eine nachgeladene Datei).
- L3d: `quellen/` fehlt in dieser Umgebung. Die SKS-Erweiterung stützt sich auf den SKS-Katalog in `data/sks.json` (nav-44, 48–50, 54, 55, 62, 103) und Standardverfahren der terrestrischen Navigation. Format der amtlichen SKS-Kartenaufgaben bitte gegen `quellen/` abgleichen.
- L3e: altes Telefon (Wunsch des Nutzers), das Funkgerät bleibt für die Folgen.
- L3g: Rauchtest läuft vor jedem Commit über `.githooks/pre-commit` (einmalig `git config core.hooksPath .githooks`). `stimmen.zip` im Repo-Ordner baut `tools/stimmen-import.js` mit ein.
- `index.html` ist in Lauf 3 um etwa 11 KB gewachsen (470 → 481 KB: Steuerrad, Rennen, Telefon, Einführungen). Größere Teile kamen in Daten-Dateien.
