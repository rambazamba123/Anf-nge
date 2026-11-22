# Lektorat Folgen 1-1 bis 1-3 als Film (v5.83), Lauf am 22.11.2026

> Unabhängiger Lektor (Unteragent ohne Schreib-Kontext) mit `podcast/lektorat-auftrag.md`. Pakete aus `node tools/lektorat.js reise-1-1 | reise-1-2 | gold-1 --bilder`, dazu elf Standbilder der Filmbühne (`podcast/lektorat/pakete/bild-film-*.png`) und die Filmstreifen der Animationen „tanken“ und „gas“. Fachlich nur gegen die amtlichen Antworten im Paket geprüft, ohne `quellen/` (R8). Die Grenze 11,03 kW für Verbrennungsmotoren (1-1) steht nicht im Paket; der Lektor hält sie nach allgemeinem Wissen für richtig.
> **Urteil des Lektors:** Alle drei Folgen sind fachlich sauber, die Fragen decken sich mit den amtlichen Antworten, die Antwortknöpfe passen zur gesprochenen Frage. Die Schwächen lagen fast alle im Bild: Bild und gesprochener Text widersprachen sich.
> Zeichen: ✓ behoben · ✗ abgelehnt (mit Grund) · ○ offen, kommt später

## 1-1 „Erster Morgen“
| Zeile | Befund | Schwere | Entscheidung |
|---|---|---|---|
| Hafenkino (Kap. 2–5) | Charterboot, die vier, Bierdose und Leihboot sind nie im Bild. Die Kamera fuhr bei „der mit der Mütze“ auf die Frieda, wo Hinnerk mit Kapitänsmütze sitzt: Man konnte glauben, Hinnerk trinkt | Fehler | ✓ neues Bühnenbild `gegenueber`: Blick aus dem Cockpit über die Bordwand auf den Steg gegenüber, Charterboot mit vier Statisten (`figuren.js` charter1–4), einer mit **roter** Mütze („Der mit der roten Mütze?“). Bierdose (TU `dose`), Leihboot fährt vorbei (TU `eboot`), die vier gehen (TU `weg`). Kamera `charter` statt `liege` |
| Z.48 | „als unser Neuer an Bord kam“: fest männlich, obwohl Harms die Anrede-Varianten nutzt | Fehler | ✓ „Gestern Abend, als du an Bord kamst, hat unser Papagei da noch rumgekreischt.“ |
| Z.45/48 | Dass Klabauter ein Papagei ist, hört man nicht | Hinweis | ✓ mit derselben Änderung („unser Papagei“) |
| Z.185–189 | Anrufbeantworter weder zu hören noch zu sehen | Hinweis | ✓ Smilla: „Jetzt geht der Anrufbeantworter dran.“, Piep vor und nach Harms (`[[AUDIO: Piep]]`, Ton `piep` der App), kleiner Anrufbeantworter neben dem Telefon (`#fk-ab`) |
| Z.180–197 | Beim Klingeln war plötzlich die Runde am Tisch im Bild, obwohl niemand runterging und die Becher oben waren | Hinweis | ✓ Telefon klingelt in der leeren Kajüte (TU `leer`: Hinnerk, Smilla und Becher weg), die Kamera bleibt am Telefon, die beiden reden oben weiter |
| Z.58 ff. | Die Uhr zeigt die Uhrzeit des Geräts | Hinweis | ✓ im Film zeigt die Uhr die Zeit der Szene (`FILMB.uhr`, aus dem Licht der ersten Szene: morgens 8:10, vormittags 10:20 …); in der App weiter die echte Uhr |
| Z.63 | „Liegt ja direkt vor dir.“ – was, sagt keiner | Hinweis | ✓ „Die Karte liegt ja direkt vor dir.“ |
| Z.118 | „Hast du das gehört? Zisch.“ ohne Geräusch | Hinweis | ✓ „Guck mal, der mit der roten Mütze. Macht 'ne Dose auf.“ und die Dose im Bild |
| Z.69 | 7,2 sm bei 5 kn sind 1 h 26 min, nicht anderthalb Stunden | Hinweis | ✓ „in knapp anderthalb Stunden“ |
| Z.199 | Karte „Das nimmst du mit“ schreibt Zahlen als Wörter | Hinweis | ✓ Ziffern: „0,5 Promille“, „7,5 Kilowatt“ |
| Z.84 | „Hafenkino. Setz dich.“ passt nicht, Hinnerk sitzt schon | Hinweis | ✗ der Satz gilt dir (du stehst noch mit deinem Becher), nicht Smilla |

## 1-2 „Gas, Sprit und Streichholz“
| Zeile | Befund | Schwere | Entscheidung |
|---|---|---|---|
| Animation „tanken“ P2/P3 | Die Frieda wird halb durchsichtig, als löse sie sich auf | Fehler | ✓ Ursache: Namenskonflikt. `boot.js` nennt die Umrisslinien `.bl`, `anim2.js` lässt `.an .bl` blinken. Jedes Boot aus dem Baukasten blinkte in **allen** Animationen. Jetzt `.an .fr .bl{animation:none}` (Fehler-Katalog Teil C) |
| Animation „tanken“ | Frieda liegt mit Backbord am Steg, im Film und in 1-3 mit Steuerbord | Hinweis | ✓ Boot mit Bug links (`bugLinks`), Stutzen im Vorschiff |
| Z.66 → Z.75 | „Der Motor läuft noch“, aber in Kapitel 1 war kein Motor zu hören | Hinweis | ✓ Motor läuft ab dem ersten Bild (TU `motor`, Geräusch) |
| Z.97, Karte | „Beim Tanken ist alles aus. Motor, Schalter, Feuer.“ klingt nach „Schalter ausschalten“; amtlich „keine elektrischen Schalter betätigen“ | Hinweis | ✓ „Beim Tanken: Motor aus, keinen Schalter anfassen, kein Feuer.“, ebenso Vertiefung und Karte |
| Z.125–132 | Antwort auf Frage 63 vorher im Bild („Gas ist schwerer als Luft“) | Hinweis | ✓ Animation „gas“ erst nach der Frage; Hilkes Geschichte bleibt (Smilla: „Hilke hat's vorhin schon gesagt“, Wiederholung ist gewollt) |
| Z.127–130 | „WUMM!“ im Bild vor Smillas „Und?“ | Hinweis | ✓ Phase 1 (Explosion) entfällt in der Folge |
| Z.140 | Richtige Lagerung am explodierten Boot: Luke fehlt, Leitung aus dem leeren Schapp | Hinweis | ✓ Luke ist nach Phase 1 wieder da, in Phase 2 kommt die Leitung vom Gaskasten an Deck |
| Z.94/106 | Gelber Lappen noch im Bild, während gefragt wird, was man mit dem Öl macht | Hinweis | ✓ vorher Phase 4 „Bilge gucken“ (ohne Lappen) |
| Z.164 | „Es riecht hier unten nach Gas“ klingt echt, keiner reagiert | Hinweis | ✓ „Stell dir vor, es riecht hier unten nach Gas.“ (Ernstfall erst in 1-7, HR28) |
| Kombüse | Kessel dampft, obwohl der Kocher aus ist | Hinweis | ✓ TU `kessel=0` |
| Z.176–177 | „Backbord, geh vom Kocher runter“, aber Backbord sitzt vorn auf dem Teppich | Hinweis | ✓ Backbord sitzt auf dem kalten Kocher (TU `kk`), Kamera an die Kombüse, dann springt sie runter |
| Z.36–42 | Hilke steht schon an der Zapfsäule, bevor ihre Schritte kommen | Hinweis | ✓ Hilke kommt mit den Schritten herein |

## 1-3 „Leise raus“
| Zeile | Befund | Schwere | Entscheidung |
|---|---|---|---|
| Manöverbrett | Feld „Anlegen“ zeigt Anlegen mit Steuerbord, genau die falsche Antwort der Frage 48 | Fehler | ✓ Pier links, Boot kommt von rechts: Anlegen mit Backbord. Gilt auch für das Brett in der App |
| Z.46 | Hilke hält den Quittungsblock schon, während sie sagt, sie holt ihn | Fehler | ✓ Hilke ohne Block (TU `block=0`), mit Block erst, als sie winkend zurückkommt |
| Z.34 | „Heute an Bord“ verrät die Ratefrage („Was das Heck beim Rückwärtsfahren macht“) | Hinweis | ✓ „Rückwärts raus“. Der Kapiteltitel „Das Heck will zu Paul“ bleibt (sieht man nur, wenn man die Kapitelliste vorher öffnet) |
| Z.131 | „Da steht er.“ nach Harms' Unterbrechung unklar | Hinweis | ✓ „Da steht sein Kaffee.“ |
| Ende → 1-4 | „Dann warten wir“ dreimal über zwei Folgen | Hinweis | ✓ in 1-3 nur noch Hinnerks „Dann warten wir.“ |
| Z.98 | „Der Bug bleibt, wo er ist“ physikalisch ungenau | Hinweis | ✓ „Vor allem das Heck. Der Bug bewegt sich kaum.“ |
| Kalter Kaffee | Smillas Becher dampft neben dem kalten Kaffee; Smilla sitzt, statt am Brett zu stehen | Hinweis | ✓ kein Dampf (TU `dampf=0`); ✗ Smilla bleibt sitzen und zeigt vom Tisch aus (Szene angepasst), eine stehende Smilla gibt es in der Kajüte noch nicht |
| Z.168/176 | Du holst den Becher, aber Smilla sagt „Bitte sehr“ | Hinweis | ✓ „Bitte sehr“ gestrichen |

## Was daraus folgt
- Fehler-Katalog: blinkende Boote in Animationen (Teil C), Bild widerspricht dem Text (Teil B: Hafenkino ohne Charterboot, Hilke mit Block, Manöverbrett falsche Seite).
- Kein neues Werkzeug: Bild gegen Text prüft weiter das Lektorat mit Standbildern. Die Standbilder baut ein Notizskript; ein Werkzeug `tools/film-bilder.js` wäre der nächste Schritt (offen).
