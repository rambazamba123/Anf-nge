# Törn 2.0 – Kurzplan mit Unteretappen
Stand 08.10.2026 (v4.34) · Konzept: CLAUDE.md §5.14 · Umsetzung in Lauf 4.

| Etappe | Inhalt | Stand |
|---|---|---|
| T1 | `data/tags.json`: Situations-Tags für alle 285 SBF- und 635 SKS-Fragen (`tools/tag-fragen.js`, Regeln nach Wortanfang) | ✔ 920 Fragen getaggt. 50er-Stichprobe 1: 7 Fehler (14 %), danach Regeln korrigiert. Neue 50er-Stichprobe 2: 5 Fehler (10 %), die systematischen davon ebenfalls korrigiert. |
| T2 | `data/sks-mc.json`: je SKS-Frage 1 richtige (amtlicher Kern) + 2 falsche („glaubwürdiger Humbug“), Prüfskript `tools/sks-mc-pruefen.js` | ✔ 613 als Multiple Choice, 22 „nur offen“ (davon 9 bildabhängig, kommen im Törn nicht vor). Von Hand geschrieben und gegen den Katalog geprüft. |
| T3 | `data/toerns.json` (5 Stufen, 15 Törns), `data/ereignisse.json` (38 Ereignisse + 7 Kartenaufgaben, je an eine amtliche Frage gekoppelt), `data/ausruestung.json` (9 Teile, 4 Vorräte) | ✔ `tests/toern-daten.js`: Schema, Orte, keine Route über Land. |
| T4 | `toern.js`: Kern ohne DOM (Wetter, Plan, Folgen, Simulation) und Oberfläche (Törnwahl, Aufwachen, Seewetterbericht, Sicht vom Steuer, Mini-Karte, Aufgaben mit Reaktionszeit, Signale tuten, Peilen, Fernglas, Pause, Nachbesprechung, Laden, Logbuch) | ✔ spielbar, Rauchtest fährt einen Landratte-Törn komplett. |
| T5 | SKS-MC in Lernrunden (Menü der Matrosin: „Ankreuz-Runde“) | ✔ |
| T6 | `tests/balancing.js` (40 / 70 / 95 % je Stufe, Grund- und volle Ausrüstung) | ✔ alle Ziele erreicht (Werte im Bericht). |
| T7 | Altes Törn-Gerüst aus `navi.js` entfernt, `S.toern2` neu (alter `S.toern` bleibt), Rauchtest `tests/smoke/rauchtest.js` | ✔ |

Regeln: Spielstand-Key bleibt `skipper-sbfsee-v1`; `S.toern2` ist anfangs `null` und wird beim ersten Öffnen angelegt. Funk und Pyro hängen später über `stufen[].scheine` und `data/tags.json` ein.
