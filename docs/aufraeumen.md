# Aufräumliste (VISION.md H1, Stand 28.10.2026)

> Für jedes Menü: was **bleibt**, was **zusammengelegt** wird und was **wegfällt**. Grundlage sind `VISION.md` §8 (M1–M23) und §11 und der Code von v4.95.
> Der Nutzer hat am 28.10.2026 alle Vorschläge angenommen, die er nicht ausdrücklich geändert hat. Umgesetzt wird das in H4 (Aufräumen), H5 (Ankommen) und H7 (Fahrt-Szenen).
> **Stand v4.98:** umgesetzt sind Leiste, Frei üben, Kajüte, Crew-Menüs, Einstellungen mit Werkstatt, große Schrift und die Seite „Geräusche“. Noch offen: Fortschrittsbild an Deck (das Rennen ist weg, die Logbuch-Karte bleibt), Kennenlernen (H5), Törn (H7), Logbuch ohne alte Teile, alter Funk-Bereich. Spielstände bleiben lesbar (R7): Entfernte Bereiche lassen ihre Daten im Spielstand stehen.

## Leiste unten (O90)
| Heute | Künftig |
|---|---|
| Deck · Kajüte · Logbuch | **Deck · Kajüte · Frei üben** |
| Logbuch als eigener Reiter | wandert in die Kajüte (Logbuch auf dem Kartentisch) |

## Deck (`renderBoat`, M3)
- **Bleibt:** Boot, Begrüßung (Moin-Kette), Katze, Eggs, Fernglas, „App aufs Handy“ (nur wenn möglich).
- **Zusammengelegt:** Rennen (`courseCard`), Prozent, Phase (`#phase`), Logbuch-Aufschlüsselung (`standKarte`) und Countdown werden **ein** Fortschrittsbild.
- **Neu:** zwei Wege: „Mit der Crew weiter“ (Reise) und „Frei üben“.
- **Fällt weg:** „⛵ Kurs für heute“ als Liste an Deck; er wird zur Tagesbesprechung am Kartentisch (die Happen aus `todayPath` bleiben als Grundlage).

## Kajüte (`renderCabin`, M6)
- **Bleibt:** Lernwand (Seekarte, Manöverbrett, Knotenbrett), Bücher → Meine Prüfungen, Telefon → Harms, Hocker → Kajütenfunk, Kiste → Einstellungen, Katze, Eggs.
- **Neu:** Stuhl am Kartentisch → Reise (Sicht von oben); Logbuch auf dem Tisch.
- **Fällt weg** (unter der Szene):
  - Karte „Meine Prüfungen“ (doppelt zu Büchern und Kartentisch)
  - Knöpfe „Mit der Crew reden“ (KI, kommt in die Werkstatt) und „Probeprüfung“ (doppelt zum Telefon)
  - „🎲 Spielekiste“ (kommt unter „Frei üben“)
  - Kleine Links „Lexikon · Kajütenfunk · Kapitel · Logbuch“ (alle über Gegenstände oder „Frei üben“ erreichbar)
  - Karte „Wann ist deine Prüfung?“ (kommt ins Kennenlernen; in den Einstellungen bleibt sie änderbar)
  - Altersfrage (kommt ins Kennenlernen)

## Crew antippen (`charMenu`, M20)
Je Figur ein kurzer fester Satz und höchstens zwei Aktionen.

| Figur | Bleibt | Fällt weg oder wandert |
|---|---|---|
| Käpt'n | „Was als Nächstes?“ (Empfehlung), „Erzähl mal was“ | Meine Prüfungen (→ Bücher), Wie lerne ich am besten (→ Tagesbesprechung), Erklär mir ein Kapitel (→ Frei üben), Einfach klönen (→ Werkstatt), Hol Harms (→ Telefon) |
| Smilla | „Frag mich ab“, „Meine Wackelkandidaten“ bzw. „Prüfungsfallen“ | Ankreuz-Runde SKS (→ Frei üben), Kajütengeschichte (→ Hocker), Hol Harms (→ Telefon), Sag was (→ fester Satz beim Antippen) |
| Klabauter | „Merksprüche“, „Schallsignale üben“ | Sag was (→ fester Satz beim Antippen) |

## Frei üben (neu, O90)
Alles, was man ohne Reise jederzeit machen kann, an **einer** Stelle:
- Fragen nach Thema (heute Bücherregal „Kapitel“ und „Erklär mir ein Kapitel“, zusammengelegt)
- Wiederholen, Fallen und Wackelkandidaten
- Navigation (mit Crew-Begleitung, M11), Knoten, Manöver
- Zeichen und Begriffe (Seezeichen-Kurs + Lexikon + Zeichen-Atlas werden eins, M16)
- Kajütenfunk: alle Folgen einzeln
- Probeprüfung (öffnet Harms)
- Spielekiste (nur Spaß, Rekorde nur hier, M18)
- SKS-Ankreuzrunde

## Einstellungen (`renderSettings`, M21)
- **Oben, für alle:** Scheine, Termine und Lernzeit · Ton, Musik und Lautstärke (heute „Musik und Geräusche“, „Ton und Wetter“) · große Schrift (neu) · Kajütenfunk-Modus · Seite „Geräusche“ (neu: anhören, grün benutzt, rot unbenutzt) · Rundgänge wiederholen (neu) · Sicherung · Über die App, Haftung, Datenschutz, Impressum · App installieren · Boot-Look und Name am Heck.
- **Unten eingeklappt „Werkstatt“:** KI-Schalter und Schlüssel, Modell, ElevenLabs-Schlüssel, Stimmenqualität und Tageslimit, gespeicherte Sätze, Spracherkennung und Redepause, Stimmenpaket, Casting, Podcast-Hörprobe, Kajütenfunk erzeugen, Gratis-Vorschau, Protokoll.
- **Fällt weg:** „Geschichte von …“ je Crew-Rolle (Rollenwahl gibt es seit V1 nicht mehr), „Kommentare der Crew beim Lernen“ wird Teil von „Ton“.

## Kennenlernen (`convoOnboarding`, M2, H5)
- **Bleibt:** Crew stellt sich vor, Scheine, Einführung je Schein, Termine, Lernzeit, Crew-Kommentar.
- **Neu:** Lernort, Starter-Set ja oder nein, Einstufung, Altersgruppe.
- **Fällt weg:** Schlüssel-Schritt `keysStep` (→ Werkstatt).

## Törn (`toern.js`, M10, H7)
- **Bleibt als Technik:** Sicht vom Steuer, Tonnen mit Kennung, Lichter, Schiffe, Nebel, Wetter, Kartenaufgaben, Bonusrunden.
- **Neu:** Fahrt-Szene von hinten auf das eigene Boot, einfach animiert.
- **Fällt weg:** Törnliste, Bordkasse, Proviant, Laden, Ausrüstung, Sterne (O89). Das Steuer an Deck öffnet künftig die nächste Fahrt-Szene der Reise.

## Logbuch (Reiter `log`)
- **Bleibt:** Lernstand, Trophäen, Eggs, Probeprüfungen.
- **Fällt weg:** Törn-Logbuch (alt) und Eigene Folgen (KI-Folgen, alter Stand).

## Alter Kajütenfunk-Bereich (`funk`, `EPISODES`, `SHORTS`)
- **Fällt weg** nach H2: Der neue Player (`kurs.js`) übernimmt. „Erzähl mal was“ (Garn) bleibt als kurzer Clip beim Käpt'n.
