# Film-Regeln der Hörreise (Entwurf, 20.11.2026)

> Grundlage: E27 (Film aus der Grund-Szene, GL9) und die Rückmeldung des Nutzers zur Glasebenen-Kamera am 20.11.2026: „Die Aufsicht: das Boot muss Tiefenwirkung bekommen … das Wischen ist nicht gut. Rest super. Überlege, zu welcher Szene was passt. Zu viel Wechsel würde ich vermeiden. Hitchcock-Zoom ist gut … Ich will immer noch ein ruhiges Bühnenbild, meist von der Seite.“
> Ausprobieren: `docs/entwuerfe/glasebenen-kamera.html`, Knopf „Musterszene“ (zeigt jede Regel einmal mit ihrem Grund).

## Grundsatz
- **FK1 Die Seite ist die Heimat.** Totale oder Halbnah von der Seite, etwa drei Viertel der Zeit. Die Kamera atmet nur leicht, das Bild bleibt ruhig.
- **FK2 Jeder Wechsel hat einen Grund in der Geschichte.** Höchstens ein Blickwechsel je Kapitel (etwa ein bis zwei Minuten) und danach zurück zur Seite. Einstellungen im selben Blick (Zufahrt, Schärfe) dürfen öfter kommen.

## Welcher Übergang wann
| Nr. | Moment in der Geschichte | Kamera |
|---|---|---|
| FK3 | Eine Figur sagt etwas Wichtiges oder zeigt ein Gefühl | Kamerafahrt im selben Blick (Zufahrt auf Halbnah oder Nah), danach zurück zur Totale |
| FK4 | Die Crew zeigt auf etwas (Tonne, Fender, Zapfsäule) | Schärfenzieher: Schärfe dorthin legen, ohne Schnitt |
| FK5 | Lehrbild: Radeffekt, Ausweichen, Kurs, Abstand | Kranfahrt nach oben, danach Kranfahrt zurück. Von oben immer mit Tiefe (Höhenschichten: Kajüte, Köpfe und Mast neigen sich) |
| FK6 | Manöver oder Begegnung | Orbit: zum Heck („wohin fährt sie“), zum Bug („was kommt uns entgegen“), danach zurück zur Seite |
| FK7 | Du tust etwas (steuern, Ausguck, Aufgabe) | Über die Schulter |
| FK8 | Hinnerk erzählt von früher (Garn, Rückblende) | Atemzug hinein und wieder heraus |
| FK9 | Schreckmoment | Hitchcock-Zoom, höchstens einmal je Folge |
| FK10 | Ortswechsel oder Zeitsprung in der Folge | Nebelblende |
| FK11 | Anfang einer Folge (neues Bühnenbild) | Glasplatten |
| FK12 | Licht wechselt (Sonne geht unter, Licht an) | Lichtblende |

## Nicht
- **FK13** Kein Vordergrund-Wischer (Nutzer, 20.11.2026). Kein harter Schnitt, außer zum Vergleich.
- **FK14** Keine Wechsel nur, damit sich etwas bewegt. Wenn nichts passiert, bleibt das Bild stehen und die Welt lebt (Wellen, Möwen, Nebel).

## Licht und Glas
- **FK15** Das Licht folgt der Geschichte: Tageszeit und Wetter aus `[[SZENE]]` (Morgen, Mittag, Abend, Nebel, Nacht). Nachts stimmen die Lichter je Blick (Seite: rotes Seitenlicht und Topplicht; von achtern nur das Hecklicht; von vorn Rot rechts, Grün links, Topplicht oben).
- **FK16** Eine Glasart für alle Folgen (weich, klar, Papier oder Tusche; noch offen).

## Marke im Skript (Vorschlag)
`[[KAMERA: blick, einstellung, übergang]]`, zum Beispiel `[[KAMERA: oben, vogel, kran]]` oder `[[KAMERA: seite, halbnah, fahrt]]`. Ohne Marke beginnt jedes Kapitel mit `seite, totale`. Der Dichte-Messer zählt die Blickwechsel je Kapitel und gibt einen Hinweis, wenn es mehr als einer ist (FK2).
