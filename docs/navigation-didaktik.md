# Navigation lehren: Deep Dive und Bauplan (v5.64, 14.11.2026)

> Auftrag des Nutzers (14.11.2026): Navigation nicht stumpf auswendig lernen, sondern Schritt für Schritt. Am Anfang bekommt man die Grundbegriffe nebenbei in der Geschichte mit und hört, wie die Crew navigiert. Ab einer Folge werden konkrete Techniken erklärt. Parallel tauchen in den täglichen Aufgaben Übungen auf, die direkt an die richtige Stelle der Navigationsschule springen. Zuerst wird die Navigationsschule perfektioniert, die Karte kommt später (vorerst die einfache Kliev-Karte).
> Dieses Dokument ist der Plan. Was davon schon in der App steckt, steht in §5.

## 1. Was die Forschung sagt (kurz, mit Quelle)
| Nr. | Befund | Was es für Skipper heißt |
|---|---|---|
| N-F1 | **Vorgerechnete Beispiele zuerst, dann Lückenaufgaben, dann allein** (Renkl, Atkinson u. a. 2002–2003). Beim **Rückwärts-Ausblenden** fehlt zuerst nur der letzte Schritt, dann die letzten zwei, bis man alles selbst macht. Angepasstes Ausblenden wirkt noch besser als ein fester Plan (Salden u. a. 2009). | Jede Lektion: Beispiel → Lückenaufgabe → allein. Die Lücke wächst mit deinem Erfolg. |
| N-F2 | **Ganze Aufgaben früh, Teilübungen nur für Routinen** (4C/ID, van Merriënboer, Clark, de Croock 2002). Teilübungen (z. B. Rechnen mit Missweisung) sollen innerhalb ganzer Aufgaben stehen, nicht nur isoliert. | Nicht erst in Lektion 9 die erste Gesamtaufgabe. Kleine Gesamtaufgaben wachsen mit: Kurs messen → Kompasskurs → Fahrzeit. |
| N-F3 | **Gemischtes Üben** schlägt Blöcke gleicher Aufgaben deutlich (Rohrer und Taylor 2007, Rohrer u. a. 2014: 72 % gegen 38 %), weil man lernt, **welche Aufgabe welches Verfahren braucht**. Zum ersten Lernen ist ein kurzer Block in Ordnung. | Erst ein Block in der Lektion, danach „Gemischt wiederholen“ und gemischte Happen. |
| N-F4 | **Gezieltes Feedback** wirkt mehr als nur „richtig oder falsch“: sagen, welcher Fehler wahrscheinlich passiert ist. | Fehlerdiagnose: Gegenkurs abgelesen, am falschen Rand gemessen, Vorzeichen vertauscht, Stunden statt Minuten. |
| N-F5 | **Selbsterklären**: Wer begründet, warum ein Schritt so ist, behält ihn besser und überträgt ihn eher. | Nach jedem Beispiel eine kurze „Warum eigentlich?“-Frage. |
| N-F6 | **Abrufen mit Abstand** (wie die Lernkartei bei den Fragen): Wiederholen nach Tagen, nicht sofort. | Navigationsaufgaben kommen nach 1, 3 und 7 Tagen als Happen wieder (wie die Knoten, V5). |
| N-F7 | **Konkret vor abstrakt**, erst das Bild, dann die Formel; zuhören, wie ein Könner laut denkt (kognitive Meisterlehre). | Die Crew navigiert in den Folgen laut denkend (HR47), bevor du selbst rechnest. |

Quellen: [Renkl und Atkinson, Überblick zum Ausblenden](https://faculty.engineering.asu.edu/mre/wp-content/uploads/sites/31/2020/02/Exp_Rev_LI06.pdf) · [Ausblenden, Zusammenfassung](https://www.structural-learning.com/post/worked-examples) · [4C/ID, Blueprints for complex learning](https://elearn.uni-sofia.bg/mod/resource/view.php?id=26900) · [4C/ID, Überblick](https://edutechwiki.unige.ch/en/4C-ID) · [Rohrer u. a. 2014, Psychonomic Bulletin & Review](https://link.springer.com/article/10.3758/s13423-014-0588-3) · [Interleaving, Zusammenfassung](https://www.scientificamerican.com/article/the-interleaving-effect-mixing-it-up-boosts-learning/). Die Studien betreffen Mathematik und Statistik; dass sie für Kartenarbeit gelten, ist eine plausible Übertragung, kein eigener Nachweis.

## 2. Typische Fehler beim Navigieren (und wie die App sie erkennt)
| Fehler | Erkennung (`diagnose` in `navi.js`) | Rückmeldung |
|---|---|---|
| Dreieck verkehrt herum, **Gegenkurs** abgelesen | Antwort liegt 180° neben der Lösung | „Das ist genau der Gegenkurs …“ |
| Distanz am **oberen Rand** (Länge) gemessen | Antwort × cos(Breite) ≈ Lösung | „Seemeilen nur am seitlichen Breitenrand“ |
| **Vorzeichen** von Mw oder Abl. vertauscht | eigene Prüfung im Aufgabentyp (`diag`) | „Von der Karte zum Kompass ziehst du ab“ |
| Mw als W statt E | Antwort = −Lösung | „E heißt plus, W heißt minus“ |
| **Stunden statt Minuten** | Antwort × 60 ≈ Lösung | „Mal 60, dann hast du Minuten“ |
| Missweisung **nicht aufs Jahr** umgerechnet | (noch nicht; braucht Aufgaben mit Jahresänderung, kommt mit der neuen Karte) | |

## 3. Der Weg durch die Reise (drei Phasen)
1. **Nebenbei (Tag 1 bis Mitte Tag 2):** Grundbegriffe fallen in der Geschichte, ohne Unterricht: Himmelsrichtung und Grad („Nordost, null-vier-fünf“), Seemeile und Knoten („sechs Knoten, in zehn Minuten eine Meile“), Steuerbord und Backbord, Kartennull („auf der Karte steht eins Komma acht, heute haben wir mehr“). Smilla plant laut, Hinnerk schätzt. Abends (Abendwache, V1) gibt es höchstens kleine Grundlagen-Übungen (Lektion 0, Werkzeugkunde).
2. **Konkret (ab 2-1):** Eine Folge erklärt je eine Technik, so wie sie gerade gebraucht wird (Position ablesen, Kurs messen, Kompasskurs …). Abends springt die passende Abendaufgabe in die Navigationsschule: Erklärung (falls neu) → vorgerechnetes Beispiel → Lückenaufgabe → allein. Die Etappe von morgen vorplanen ist die wichtigste Abendaufgabe (V3).
3. **Selbst (ab Tag 4):** Du planst die Etappen allein, die Crew prüft morgens („Dein Kurs passt“ oder „Dann mach ich's halt“). Gemischte Wiederholung über die Happen, ab Tag 6 die Prüfungsaufgaben (Seekarte 7, später Übungskarte 49 nach AE-Liste).

## 4. Sprungmarken: wie Geschichte und Aufgaben in die Schule springen
- **Fertigkeiten** (`data/navi.json` → `fertigkeiten`, 25 Stück): feste Namen wie `kurs-messen`, `kompasskurs`, `fahrzeit`, `koppelort`. Jede gehört zu einer Lektion und einem Aufgabentyp. Diese Namen benutzen Reiseplan, Happen und Folgen; ändert sich die Schule, bleiben die Namen.
- **Aufruf aus der App:** `naviUeben('kurs-messen', {n: 3, zurueck})` = kurze Runde mit drei Aufgaben, danach zurück dorthin, wo man herkam; Ergebnis `{richtig, von}`. `naviOeffne('L3:bsp')` = direkt an einen Schritt (Lektion, `:erkl`, `:bsp`, `:guided`, `:free`, `:master`, `werkzeug`, `pfad`).
- **Geführt oder frei:** Eine Runde ist geführt (mit Hilfe und Vorgaben), solange die Lektion noch keine freie Übung hat, sonst frei.
- **Nächster Schritt (mit der Abendwache):** `data/reiseplan.json` bekommt je Tag `abend: [{fertigkeit, n}]`; `tools/reiseplan.js` prüft, dass jede Fertigkeit vorher in einer Folge vorkam (V8). Die Happen ziehen fällige Fertigkeiten wie fällige Fragen.

## 5. Was jetzt in der App steckt (v5.64)
- **Lückenaufgabe** in der geführten Übung: Bei Aufgaben mit mehreren Antwortfeldern sind die ersten Teile vorgegeben, du rechnest den letzten. Mit jeder richtigen geführten Aufgabe wird eine Vorgabe weniger (`S.navi.lek[id].fade`, Standard 0).
- **Fehlerdiagnose** bei falschen Antworten (Tabelle §2), sichtbar als „🔎 …“ unter der Antwort.
- **„Warum eigentlich?“** nach jedem vorgerechneten Beispiel (zwölf Fragen in `data/navi.json` `lektionen[].warum`; ohne `quellen/` geprüft, R8).
- **Gemischt wiederholen** im Menü der Navigationsschule: fünf Aufgaben aus allen Lektionen, die man schon geführt geübt hat.
- **Sprungmarken** `NAV.ueben`, `NAV.oeffne`, `NAV.fertigkeit` und in index.html `naviUeben`, `naviOeffne`.

## 6. Was noch fehlt (Vorschlag, in dieser Reihenfolge)
1. **Kleine Gesamtaufgaben** schon ab Lektion 3 (Kurs messen + Kompasskurs), ab Lektion 5 mit Fahrzeit (N-F2).
2. **Abstand-Wiederholung** je Fertigkeit (Stand `S.navi.ft[id]` {n, ok, d}), Happen ziehen fällige (N-F6).
3. **Angepasstes Ausblenden** je Aufgabentyp statt je Lektion (N-F1, Salden).
4. **Neue kleine Karte** (Kartenauftrag `docs/spielkonzept.md` §3a): Aufgaben auf derselben Karte wie die Reise, dann „Etappe von morgen vorplanen“ mit echten Orten der Geschichte.
5. **Laut denken in den Folgen** als feste Bausteine (Smilla misst, Hinnerk schätzt; HR47).

## 7. Offene Fragen an den Nutzer
- **N1** Soll die Lückenaufgabe ein eigener sechster Schritt im Lernpfad sein (sichtbar) oder wie jetzt still in der geführten Übung stecken?
- **N2** Gemischt wiederholen: fünf Aufgaben, oder lieber drei als Happen-Größe?
- **N3** Ab wann darf Harms am Ende Navigationsfragen stellen (V7: ab Tag 4)?
