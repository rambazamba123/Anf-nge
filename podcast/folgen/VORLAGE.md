---
folge: 2-1
titel: Titel wie das, was passiert
status: vorlage
hoerreise: ja
machart: neu
---
# Vorlage für eine Folge der Hörreise, neue Machart (seit 16.11.2026). Diese Datei wird weder geprüft noch vertont.
# Kopieren als podcast/folgen/reise-<tag>-<n>.md, Kopf anpassen. Die alte Vorlage (Kajütenfunk, Fassung 5) liegt in podcast/archiv/VORLAGE-kajuetenfunk.md.
#
# ZUERST LESEN: podcast/schreibkarte.md (eine Seite), zwei, drei Beispiele aus podcast/dialog-beispiele.md, docs/geschichte-logbuch.md (Echos, offene Fäden).
# Muster zum Abgucken: podcast/skripte/gold-heck.md, gold-motor.md, gold-faehre.md.
# Nachschlagen: docs/reise.md §7 (HR-Regeln, neu HR56–HR60), docs/fehler-katalog.md Teil A.
#
# FOLGENBLATT (ausfüllen, bevor die erste Zeile Dialog steht)
# Wo und wann: Ort auf der Reisekarte (data/karte-brede.json), Tageszeit, Wetter. Schließt an welche Folge an, mit welchem Satz?
# Szene vor Stoff: Was passiert hier, auch wenn niemand etwas lernen müsste? Wer will was? Was geht schief, worüber lachen wir?
# Lernlast (HR56): je Frage ihr Gewicht. „Szene: 48“ (eigene Szene), „Bündel: 41 mit 46“ (ein Prinzip, mehrere Fragen), „nebenbei: 47“ (ein Satz).
#   „Was war neu?“ je Kapitel in EINEM Satz. Braucht ein Kapitel zwei Sätze, ist es zu voll: teilen.
# Fragen: Welche zwei, drei lohnen das Nachdenken? Welche davon ist ein echtes Entweder-oder (HR59)? Alles andere als [[STOFF]].
# Wer irrt: nicht immer Hinnerk. Der Irrtum ist am besten die Falle der amtlichen Frage.
# Zeigen, dann benennen: Was sieht oder hört man, bevor das Fachwort fällt?
# Luft: Welche zwei, drei Momente tragen keinen Stoff (Handgriff, Geräusch, Frotzelei, Blick aufs Wasser)?
# Karte (HR51): Orte, Tonnen, Kurse und Meilen wie auf der Reisekarte (node tools/karte-pruefen.js --tabelle). Bild: höchstens eine Animation je Fakt.
# Echos: Was aus früheren Folgen kommt hier in einem Satz wieder? Was legt diese Folge für später an? (danach ins Logbuch)
# Fachlich: Fragen nach data/sbf.json, Merksätze wie data/karten-sbf.json. Was nicht im Katalog steht, hier nennen (R8).
# KEIN Harms-Abschnitt: Harms fragt mit Abstand zurück, der Player stellt seine Runde zusammen (HR57).
#
# VOR DEM ABGEBEN
#   node tools/podcast-pruefen.js --entwurf <datei>   ·   node tools/dichte-messer.js <datei> (nur Hinweise: beheben oder hier begründen)
#   node tools/karte-pruefen.js   ·   Namen abdecken: Erkennt man am Satz, wer spricht?   ·   jede Szene einmal laut lesen

[[HEUTE: Was passiert (kein Fachwort) | Die eine Frage, um die es geht | Wozu man das morgen braucht]]

[[ABSCHNITT: Leise raus]]
[[SZENE: Kuttershaven, Bootstankstelle am Steg im Hafen, später Vormittag, Sonne, kaum Wind. Wer wo steht, was man sieht.]]
[[REVIER: hafen]]
[[AUDIO: Möwen]]
# Anfang hakt ein: jemand will etwas. Kein „Heute lernen wir“.
HAFENMEISTER: Zweiundvierzig Euro, Hinnerk. Ich hol den Quittungsblock. Und du bleibst, wo du bist.
HINNERK: Wo soll ich denn hin.
HINNERK: [[INTENTION: flüsternd]] Jetzt. Schnell.
SMILLA: Du haust ab. Wegen zweiundvierzig Euro Strom.
HINNERK: Ich leg ab. Dat is wat anderes.

[[ABSCHNITT: Das Heck will zu Paul]]
[[SZENE: Die Frieda setzt von der Tankstelle zurück, ihr Heck schwenkt nach Backbord auf Pauls Boot zu. Hafen von Kuttershaven, Sonne.]]
[[REVIER: hafen]]
[[STOFF: sbf:41, sbf:46]]
# Zeigen: erst passiert es.
HINNERK: Rückwärts. Kiek mol aufs Heck.
[[AUDIO: Motor]]
SMILLA: Äh. Käpt'n. Wir fahren schief.
HINNERK: Jo. Jeden Morgen.
# Luft: ein Lacher, bevor erklärt wird.
SMILLA: Darum hängt bei Paul dieser riesige Fender.
HINNERK: Da steht mein Name drauf. Find ich nich nett.
# Benennen: ein Bild, ein Satz, das Fachwort zuletzt und einmal.
[[ANIM: radeffekt]]
HINNERK: Dat macht der Propeller. Stell dir vor, der is 'n Rad, dat unten über'n Grund rollt.
SMILLA: Nur das Heck. Der Bug bleibt, wo er ist.
HINNERK: Nennt sich Radeffekt.

[[ABSCHNITT: Welche Seite?]]
[[SZENE: Die Frieda tuckert langsam durchs Hafenbecken von Kuttershaven, Sonne. Hinnerk am Außenborder, Smilla vorn bei dir. Hafen.]]
[[REVIER: hafen]]
[[STOFF: sbf:48]]
# Die Frage ergibt sich aus dem, was man eben gesehen hat. Beide Antworten stehen im Fragesatz (HR59).
SMILLA: Morgen legen wir an einer langen Pier an. Kurz davor gibt Hinnerk rückwärts. Und was macht das Heck dann?
HINNERK: Wat es immer macht.
[[AUDIO: Schiffsglocke]]
[[AUDIO: Schiffsglocke]]
SMILLA: Frage an dich. Beim Aufstoppen zieht das Heck nach links. An welcher Seite willst du dann die Pier haben: Backbord oder Steuerbord?
[[WAHL: sbf:48 | *Backbord | Steuerbord]]
[[DENKPAUSE: 6]]
# Vertiefung: nur wer falsch antwortet, hört sie. Herleiten, nicht wiederholen.
[[VERTIEFUNG: sbf:48]]
SMILLA: Denk an eben. Rückwärts zieht das Heck nach Backbord. Liegt die Pier links, zieht es dich genau dorthin. Liegt sie rechts, zieht es dich weg.
[[VERTIEFUNG: ende]]
# Auflösung: eine Figur, ein Satz. Dann Luft, kein zweites „Genau“.
HINNERK: Backbord. Dann zieht dich dat Heck von allein ran.
SMILLA: Und an Steuerbord hängst du einen Meter vor der Pier, und vorne fuchtelt einer mit der Leine.
HINNERK: Wie die vom Charter heute früh.

[[ABSCHNITT: Raus]]
[[SZENE: Kurz vor der Hafenausfahrt von Kuttershaven, Sonne. Hinnerk nimmt das Gas zurück. Hafen.]]
[[REVIER: hafen]]
# Ende lässt offen: Die nächste Folge nimmt den Satz auf.
HINNERK: Wart mal. Hörst du dat?
SMILLA: Was?
HINNERK: Da kommt wat Großes.
[[MITNEHMEN: Der eine Satz zum Prinzip | Wie es heißt | Was du damit tust]]
