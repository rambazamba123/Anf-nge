# Crew-Regisseur: lebendige Crew mit Gedächtnis (04.11.2026, v5.21)

> **Anlass:** Der Nutzer hat am 04.11.2026 den „Entwicklungsauftrag: Lebendige Crew, Dialogsteuerung und Crew-Gedächtnis“ eingebracht. Der Text endete nach „Mögliche Kontextinformationen:“. Was danach kommen sollte, fehlt noch.
> **Grundsatz aus dem Auftrag:** keine Live-KI, alles vorgeschrieben und eingesprochen. Figuren, Etappen und Lerninhalte bleiben, sie werden nur klüger zusammengesetzt.

## 1. Meine Einschätzung
| Punkt aus dem Auftrag | Einschätzung | Übernommen? |
|---|---|---|
| Crew redet auch untereinander, ohne dass du etwas tust | Sehr gut. Genau das fehlt, damit es sich wie ein Törn anfühlt. | ✓ Plaudern in Kajüte, Hafen und während der Fahrt |
| Nicht alles muss lehrreich sein, die Crew darf schweigen | Richtig, Pausen wirken echter als Dauerkommentar. | ✓ Schweigen mit Wahrscheinlichkeit je Ort |
| Erinnerungen an gemeinsame Erlebnisse | Stark für die Bindung und wiederholt nebenbei Gelerntes (Wrack westlich, Ankerverbot). | ✓ Gedächtnis mit Merkmalen aus den Folgen |
| Zentrale Steuerung, die entscheidet, wer wann was sagt | Ja, sonst wird es unübersichtlich. | ✓ `crew.js` |
| Varianten einer Aussage | Ja. Jede Variante kostet Sprachaufnahme, darum sparsam: 2–3 Varianten an Stellen, die oft kommen. | ✓ Varianten je Zeile möglich |
| Unterbrechen durch Wichtigeres, später fortsetzen | Sinnvoll, aber erst nötig, wenn die Crew auch beim freien Fahren redet. Heute plaudert sie nur an ruhigen Stellen. | ◐ Priorität ja, Unterbrechen/Fortsetzen später |
| Keine dynamische Text- oder Sprachgenerierung | Passt zum Stimmenpaket und zu E2. Die KI-Knöpfe in der Werkstatt bleiben davon getrennt. | ✓ |

**Was ich bewusst anders mache:**
- Kein Dauerreden: Die Crew plaudert nur an Stellen, die im Drehbuch dafür vorgesehen sind (Zeitraffer, Ankommen, Abend), nicht mitten in einer Aufgabe. Sonst lenkt sie vom Lernen ab.
- Jedes Gespräch hat eine Obergrenze. Alles wird eingesprochen und kostet Credits, und ein Witz nutzt sich ab.

## 2. So funktioniert es
- **Gedächtnis** (`S.crewMem`):
  - Folgen schreiben Merkmale, zum Beispiel `rums_arbeitsboot`, `weste89`, `moewen_regel`, `wrack_west`, `jasper_nord`, `jasper_ankern`.
  - Dazu zählen Freigaben (`frei:fender`) und fertige Folgen (`folge:tag07`).
  - Gemerkt wird auch, welches Gespräch wie oft kam.
- **Gespräche** stehen in `data/crew-dialoge.json`. Jedes Gespräch hat diese Angaben:
  - `ort`: kajuete, fahrt oder hafen.
  - `wenn` und `nicht`: Bedingungen aus dem Gedächtnis.
  - `prio`: Erinnerungen gehen vor Plauderei.
  - `max`: wie oft höchstens.
  - `pause`: wie viele Gelegenheiten bis zur Wiederholung.
  - `zeilen`: die Sätze, auf Wunsch mit Varianten.
- **Auswahl:**
  1. Passendes suchen.
  2. Das Höchstwichtige zuerst.
  3. Sonst Zufall, wobei Seltenes bevorzugt wird.
  4. Bei reiner Plauderei darf die Crew auch schweigen (Kajüte 30 %, Fahrt 35 %, Hafen 40 %).
- **Im Drehbuch:**
  - `{merke: 'merkmal'}` schreibt ins Gedächtnis.
  - `{plaudern: 'fahrt'}` lässt die Crew von selbst reden oder schweigen.
  - `{auto: …, plaudern: 'fahrt'}` lässt sie während der Fahrt reden.
- **Heute eingebaut:**
  - 16 Gespräche, davon 6 mit Erinnerungen und 2, die auf deine Freigaben reagieren.
  - Plauder-Stellen in den Folgen 1, 3, 7, 11 und 15.

## 3. Noch offen
1. **Rest deines Auftrags:** Der Text brach bei „Mögliche Kontextinformationen:“ ab. Schick den Rest, dann gleiche ich ab.
2. **Freies Fahren:** Auch außerhalb der Folgen plaudern lassen, mit Unterbrechen, wenn etwas Wichtiges passiert (Tonne, Hafen, Kollision), und später weitermachen.
3. **Reaktionen ohne Worte:** Die Crew schaut sich an, Klabauter plustert sich auf, Backbord macht Unsinn. Das braucht Animationen der Figuren.
4. **Stimmen:** Die Gespräche sind Entwurf nach `docs/dialog-regeln.md` und werden mit den Folgen eingesprochen. Mehr Gespräche schreibe ich, sobald du die Dialog-Regeln freigegeben hast.
