# Törn 2.0 – Kurzplan mit Unteretappen
Stand 08.10.2026 · Konzept: CLAUDE.md §5.14 · Umsetzung in einem Lauf (Lauf 4), pro Unteretappe testen, committen, abhaken.

| Etappe | Inhalt | Ergebnis (Prüfung) |
|---|---|---|
| T1 | `data/tags.json`: Situations-Tags für alle 285 SBF- und 635 SKS-Fragen (automatisch über Themen und Stichwörter) | Tags vorhanden; 50 Stichproben von Hand, Fehlerquote im Bericht |
| T2 | `data/sks-mc.json`: pro SKS-Frage 1 richtige (gekürzt, amtlicher Kern) + 2 „glaubwürdiger Humbug“-Antworten | 635 Einträge; Skript prüft Format, Länge, Dubletten; Kennzeichen „nur offen“ gezählt |
| T3 | `data/ausruestung.json`, `data/toerns.json`, `data/ereignisse.json` (alle 5 Stufen, 10 Törns, Ereignisse datengetrieben) | Schema-Check per Skript |
| T4 | `toern.js` (Kernlogik ohne DOM, testbar) + Oberfläche: Törnwahl, Start-Übergang, Wetter-Tagesaufgabe, Fahrt-Ansicht (Canvas), Mini-Karte, Aufgaben mit Reaktionszeit, Pause/Fortsetzen, Nachbesprechung, Logbuch, Bordkasse/Ausrüstung | Spielbar durch einen Landratte-Törn |
| T5 | SKS-MC in Lernrunden nutzbar machen (MC-Runde im SKS-Kurs) | Button in der SKS-Lernrunde |
| T6 | Balancing-Skript (`tests/balancing.js`, lädt `toern.js` in Node): Trefferquote 40 / 70 / 95 % je Stufe | Werte im Bericht, Ziele aus §5.14 geprüft |
| T7 | Altes Törn-Gerüst aus `navi.js` entfernen, `S.toern2` neu (alte `S.toern` bleibt unangetastet), §4/§8 aktualisieren, Rauchtest erweitern | Konsole ohne Fehler, alte Spielstände laden |

Regeln: Spielstand-Key bleibt `skipper-sbfsee-v1`; neues Feld `S.toern2` mit Standardwert `null`. Funk und Pyro sind nicht Teil dieses Laufs.
Lauf 3 (Nachtrag) ist nicht enthalten, weil die Datei fehlt (siehe CLAUDE.md §8).
