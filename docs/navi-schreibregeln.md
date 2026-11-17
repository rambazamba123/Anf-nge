# Schreibregeln für die Navi-Folgen und die Navigationsschule

> Stand 17.11.2026, Entwurf zum Testen (Plan `docs/plan-hoerspiel-neu.md`, Etappe 4). Gilt für die Texte in `data/navi-folgen.json` (Navi-Folge der Abendwache, HR52) und für neue oder überarbeitete Lektionstexte in `data/navi.json`. Didaktik dahinter: `docs/navigation-didaktik.md`. Für die Hörreise selbst gilt `podcast/schreibkarte.md`.
> Anlass: Tester fanden die App „etwas unübersichtlich“ und „manchmal zu schnell“. Bei der Navigation heißt das: zu viele Begriffe auf einmal, und man weiß nicht, wo man gerade ist.

**Leitbild:** Smilla sitzt abends mit dir am Kartentisch und plant die Etappe von morgen. Sie zeigt es einmal, dann machst du. Es ist ein Gespräch am Tisch, kein Lehrbuch.

## 1. Immer wissen, wo man ist
- Jede Navi-Folge besteht aus **Wachen** (zwei bis vier), jede Wache aus wenigen Schritten. Oben steht immer „Wache 2 von 3 · Schritt 2 von 4“.
- Eine Wache hat **ein** Ziel in einem Satz, den man hinterher selbst sagen kann („Ich kann den Kurs von Tonne zu Tonne ablesen.“).
- Am Ende jeder Wache: ein Satz, was jetzt sitzt, und die Wahl „weiter“ oder „für heute Schluss“ (die Stelle wird gemerkt).

## 2. Erst tun, dann der Begriff
- Reihenfolge je neuem Handgriff: **Smilla macht es vor** (mit Hand und Werkzeug auf der Karte) → **du machst dasselbe mit anderer Strecke** → erst dann fällt das Fachwort, einmal, mit dem Bild dazu.
- Ein neuer Begriff je Schritt. „Rechtweisender Kurs“ und „Missweisung“ nie im selben Schritt.
- Abkürzungen (rwK, MgK, Mw) erst, wenn das Wort dazu zweimal gefallen ist. In den ersten beiden Navi-Folgen steht das Wort immer daneben.

## 3. Kurze Sätze, eine Sache je Satz
- Ein Satz von Smilla: höchstens etwa fünfzehn Wörter, eine Handlung oder eine Beobachtung. Lieber drei kurze Sätze mit Pause als einer mit „und dann“.
- Zahlen kommen von der Karte (`{kurs}`, `{sm}`, `{min}`), nie ausgedacht, und immer mit Einheit gesprochen („zwei-vier-null Grad“, „sieben Komma zwei Meilen“).
- Anweisungen sagen, **wo** die Hand hin soll: „Mitte des Dreiecks auf Kuttershaven. Kante an den Strich nach Norden.“ Nicht: „Lege das Kursdreieck korrekt an.“
- Nach jeder Aufgabe ein Atemzug: ein Satz ohne Stoff („Passt. Hinnerk hätte geschätzt.“), dann erst der nächste Schritt.

## 4. Hilfe passt sich an, ohne zu bestrafen
- Wer einen Handgriff zweimal ohne Hilfe schafft, sieht das Vormachen nicht mehr (Stufe „sicher“). Wer hängt, bekommt den nächsten Tipp, nie eine Uhr.
- Ein Fehler wird erst gedeutet („Du hast unten gemessen, am Längenrand. Entfernung immer links oder rechts am Breitenrand.“), dann darf man noch einmal. Die Fehlerfahrt (Frieda fährt den falschen Kurs) ist ein Spaß, kein Urteil; der Text dazu bleibt freundlich.
- **Einstufung am Anfang** (geplant): drei kurze Aufgaben. Wer sie kann, überspringt die Wache und bekommt nur den Test.

## 5. Schritt-Zettel statt Rechenweg im Kopf
- Zu jeder mehrschrittigen Aufgabe gibt es einen **Zettel** mit den Schritten in Reihenfolge (geplant): „1 Linie ziehen · 2 Dreieck anlegen · 3 Kurs ablesen · 4 Distanz abgreifen“. Der laufende Schritt ist markiert. In der Stufe „sicher“ ist der Zettel zugeklappt.
- Derselbe Zettel mit denselben Wörtern in Navi-Folge, Navigationsschule und (später) als Karte in der Box.

## 6. Test mit Abstand
- Der Test einer Navi-Folge kommt **am nächsten Abend** vor der neuen Folge (geplant; heute direkt am Ende). So prüft er, was hängen geblieben ist, nicht, was man gerade eben getan hat. Das ist dieselbe Idee wie „Harms fragt zurück“ (HR57).
- Drei Aufgaben ohne Hilfe, bestanden ab zwei. Wer nicht besteht, bekommt eine Übungsrunde mit Vormachen, keinen Tadel.

## 7. Verbindung zur Geschichte
- Was du abends planst, fährt die Crew am Morgen (HR47, HR51): Die Zahlen aus der Navi-Folge tauchen in der Hörfolge wörtlich wieder auf.
- Die Navi-Folge erzählt nicht weiter. Ein, zwei Sätze Rahmen (Lampe an, Hinnerk schnarcht), dann Karte.

## 8. Vor dem Abgeben
- Jeden Satz laut lesen: Würde Smilla das so am Tisch sagen?
- Je Schritt prüfen: genau eine neue Sache? Ein Begriff? Sagt der Satz, wo die Hand hin soll?
- `node tools/karte-pruefen.js` (Zahlen passen zur Karte), danach die Folge einmal in der App durchspielen, auch mit absichtlichen Fehlern.
