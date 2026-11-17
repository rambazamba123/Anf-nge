# Schreibkarte der Hörreise

> Eine Seite, die beim Schreiben jeder Folge offen liegt (Nutzer, 16.11.2026: „Stell dir vor, wir würden ein Hörspiel machen!“). Die HR-Regeln in `docs/reise.md` §7 sind das Nachschlagewerk und die Prüfliste danach. **Fachlich falsch geht nie. Unter allem, was richtig ist, entscheidet das Ohr.** Widerspricht eine Regel dem Ohr, gilt das Ohr, und der Widerspruch kommt in den Bericht.

**Leitbild:** Wir machen ein Hörspiel an Bord der Frieda. Wer zuhört, lernt dabei für den Bootsführerschein. Nicht umgekehrt.

## So entsteht eine Folge
1. **Szene vor Stoff.** Erst die Szene: Wo sind wir, wer will gerade was, was geht schief, worüber lachen wir? Erst danach: Welche zwei, drei Dinge aus dem Katalog passieren hier von selbst?
2. **Zeigen, dann benennen.** Erst passiert es (das Heck zieht weg), dann wundert sich jemand, dann ein Satz Erklärung. Das Fachwort kommt zuletzt und einmal.
3. **Gewicht statt Stoppuhr.** Eine wichtige Frage bekommt ihre eigene Szene. Ein Bündel bekommt sein Prinzip gründlich und den Rest als kurze Anwendungsfälle. Nachschlagewissen bekommt einen Satz. Probe: Könnte jemand im Auto nach der Szene in einem Satz sagen, was neu war?
4. **Luft.** Nach jeder Auflösung passiert etwas ohne neuen Stoff: ein Handgriff, ein Geräusch, eine Frotzelei, ein Blick aufs Wasser. Stille ist erlaubt (`[[AUDIO: …]]`, `[[PAUSE: …]]`).
5. **Niemand hält Vorträge.** Keine Aufzählungen („Erstens, zweitens“), keine Erklär-Ketten einer Figur. Wissen kommt, weil etwas passiert, jemand fragt, jemand sich irrt oder zwei sich streiten.
6. **Figuren wollen etwas.** Hinnerk will seine Ruhe und seinen Kaffee, Smilla will los, Hilke will ihr Geld. Aus kleinen Wünschen entsteht das Gespräch. Wer wie viel redet, entscheidet die Szene, keine Quote.
7. **Du bist dabei.** Die Crew spricht dich an, gibt dir eine Rolle (Ausguck, Lappen halten) und traut dir etwas zu. Eine Frage mit Glocke nur dort, wo das Nachdenken lohnt.
8. **Fragen klingen wie Fragen.** „Backbord oder Steuerbord?“ statt Formular. Amtsdeutsch spricht nur Harms; die Crew sagt es in eigenen Worten, aber richtig.
9. **Sprechbar.** Kurze Sätze, Umgangssprache, halbe Sätze, Unterbrechungen. Hinnerk knapp und platt, Smilla schnell und direkt, jeder Gast mit einer Eigenheit. Jede Szene einmal laut lesen.
10. **Anfang hakt ein, Ende lässt offen.** Kein „Heute lernen wir“. Die Orientierung steht auf dem Bildschirm (`[[HEUTE: … | … | …]]` am Anfang, `[[MITNEHMEN: … | … | …]]` am Ende), nicht im Dialog.

## Vor dem Abgeben
- **Namen abdecken:** Erkennt man am Satz, wer spricht?
- **„Was war neu?“** je Szene in einem Satz beantworten. Geht es nicht, ist sie zu voll.
- `node tools/dichte-messer.js <datei>` ansehen (Hinweise, keine Verbote) und Abweichungen im Folgenblatt begründen.
- `docs/fehler-katalog.md` Teil A, `node tools/podcast-pruefen.js --entwurf`, `node tools/karte-pruefen.js`.
- Story-Logbuch `docs/geschichte-logbuch.md` vorher lesen, nachher fortschreiben.

## Regie-Marken der neuen Machart
`[[ABSCHNITT: Titel]]` = Kapitel · `[[SZENE: Ort, Tageszeit, Wetter, wer wo ist]]` · `[[REVIER: …]]` · `[[AUDIO: …]]` · `[[HEUTE: a | b | c]]` und `[[MITNEHMEN: a | b | c]]` (nur Bildschirm) · `[[STOFF: sbf:41, sbf:46]]` (diese Szene behandelt diese Fragen; kein Wortlaut nötig) · `[[WAHL: sbf:n | Antwort | *richtige Antwort]]` mit `[[DENKPAUSE: 6]]` und `[[VERTIEFUNG: sbf:n]] … [[VERTIEFUNG: ende]]` · `[[ANIM: id, phase]]` (höchstens eine je Fakt) · `[[SPRUCH: id]]` · `[[GESICHT: laune]]` · `{{anrede:w=…|m=…|n=…}}`.
Kein Harms-Abschnitt im Skript: Harms fragt mit Abstand zurück, der Player setzt seine Runde zusammen (HR57).

Vorbilder: `podcast/dialog-beispiele.md`. Vorlage: `podcast/folgen/VORLAGE.md`.
