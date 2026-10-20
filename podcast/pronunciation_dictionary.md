# Ausspracheverzeichnis Kajütenfunk

Version: 2

Zentrales Verzeichnis für alle Folgen (PODCAST_BIBLE.md A17–A21). `tools/podcast-pruefen.js` liest die Tabellen.

**So ist es aufgebaut**
- Jede Zeile hat fünf Spalten: **Begriff** (so, wie er im Skript steht), **Gesprochen** (gewünschte Lesung), **Methode**, **Status** und **Notiz**.
- **Methode:**
  - `literal`: Die Stimme spricht die Originalschreibweise schon richtig.
  - `alias`: Für die Audioeingabe wird eine Ersatzschreibweise eingesetzt.
  - `dictionary`: Eintrag in einem ElevenLabs-Aussprachewörterbuch.
  - `native_ipa`: IPA, nur wenn es das Modell dokumentiert unterstützt.
  - `manual_review`: Die richtige Lesung ist noch unklar und muss geklärt werden.
- **Status:**
  - `offen`: Die Lesung ist ein Vorschlag, aber noch nicht getestet.
  - `geprüft`: Im Test mit der Zielstimme ist es richtig.
  - `freigegeben`: Gilt für alle Folgen.
- **Was die Prüfung meldet:** Vor einer Generierung meldet `tools/podcast-pruefen.js` jeden Begriff im Text, der nicht `freigegeben` ist, als Fehler. Beim Schreiben (`--entwurf`) ist es nur eine Warnung.
- **Schreibweise bleibt:** Die fachliche Schreibweise im Skript ändert sich nie (A20). Ersatzschreibweisen gelten nur für die Audioeingabe.
- **Stand:** Alle Einträge sind Vorschläge von Claude vom 20.10.2026 und stehen auf `offen`. Kein Eintrag ist mit einer echten Stimme geprüft. Wer die Lesung freigibt, entscheidet der Nutzer (`PODCAST_STATUS.md` O31, O33).

## Abkürzungen (aus dem SBF-See-Katalog)

| Begriff | Gesprochen | Methode | Status | Notiz |
|---|---|---|---|---|
| KVR | Ka-Vau-Er | alias | offen | Kollisionsverhütungsregeln; im Gespräch meist buchstabiert |
| SeeSchStrO | Seeschifffahrtsstraßen-Ordnung | alias | offen | ausgeschrieben; die Abkürzung spricht niemand |
| EmsSchO | Schifffahrtsordnung Emsmündung | alias | offen | ausgeschrieben |
| NordSBefV | Nordsee-Befahrensverordnung | alias | offen | ausgeschrieben |
| GDWS | Generaldirektion Wasserstraßen und Schifffahrt | alias | offen | ausgeschrieben; im Dialog besser umschreiben |
| BSH | Be-Es-Ha | alias | offen | Bundesamt für Seeschifffahrt und Hydrographie |
| NOK | Nord-Ostsee-Kanal | alias | offen | im Gespräch ausgeschrieben |
| NfS | Nachrichten für Seefahrer | alias | offen | ausgeschrieben |
| BfS | Bekanntmachungen für Seefahrer | alias | offen | ausgeschrieben |
| AIS | A-I-Es | alias | offen | Automatisches Identifikationssystem; buchstabiert |
| UKW | U-Ka-We | alias | offen | buchstabiert |
| DSC | De-Es-Ze | alias | offen | kommt im SBF-See-Katalog nur in falschen Antworten vor |
| EPIRB | ? | manual_review | offen | Seenotfunkbake; ob buchstabiert oder als Wort gesprochen, ist zu klären |
| MAYDAY | Mäidäi | alias | offen | englisches Notrufwort |
| NC | En-Ze | alias | offen | Flaggensignal „Fahrzeug in Seenot“; klären, ob die Figuren „November Charlie“ sagen |
| INT1 | ? | manual_review | offen | Verzeichnis der Kartenzeichen („INT 1 / Karte 1“); Lesung klären |
| TÜV | Tüff | alias | offen | nur in falschen Antworten |
| hPa | Hektopascal | alias | offen | Einheit des Luftdrucks |
| Bft. | Windstärke | alias | offen | „Bft. 3“ wird „Windstärke drei“ |
| sm | Seemeilen | alias | offen | Einzahl „Seemeile“, je nach Zahl |
| kn | Knoten | alias | offen | Geschwindigkeit |
| km/h | Kilometer pro Stunde | alias | offen |  |
| kW | Kilowatt | alias | offen |  |
| Fl. | ? | manual_review | offen | Blitzfeuer in einer Kennung, z. B. „Fl. (2)“; gesprochene Form im Dialog klären |
| Oc | ? | manual_review | offen | unterbrochenes Feuer in einer Kennung, z. B. „Oc (2) R.“ |
| Whis. | Heultonne | alias | offen | Zusatz in einer Kennung |

## Fachbegriffe

| Begriff | Gesprochen | Methode | Status | Notiz |
|---|---|---|---|---|
| Luv | Luhf | alias | offen | langes u, v wie f; Stimmen sprechen es oft mit w |
| luvwärtige | luhfwärtige | alias | offen | wie Luv |
| Lee | Lee | literal | offen | langes e, nicht englisch „Li“ |
| Pütz | Pütz | literal | offen | Eimer an Bord |
| Seegat | Seegat | literal | offen | Mehrzahl im Katalog „Seegaten“ |
| Seegaten | Seegaten | literal | offen |  |
| Talje | Talje | literal | offen | Flaschenzug |
| Palstek | ? | manual_review | offen | Lesung von „-stek“ klären (vermutlich langes e) |
| Schotstek | ? | manual_review | offen | wie Palstek |
| Stopperstek | ? | manual_review | offen | wie Palstek |
| Webeleinstek | ? | manual_review | offen | wie Palstek |
| Rundtörn | Rundtörn | literal | offen |  |
| Spring | Spring | literal | offen | Festmacherleine; deutsch gesprochen, nicht englisch |
| Impeller | Impeller | literal | offen | Pumpenrad der Kühlwasserpumpe |
| Antifouling | Antifauling | alias | offen | englisches Lehnwort |
| Quickstopp | Kwickstopp | alias | offen |  |
| Radeffekt | Rad-Effekt | alias | offen | nicht „Ra-deffekt“ |
| Deviation | Deviation | literal | offen | Ablenkung des Kompasses |
| Wahrschau | Wahrschau | literal | offen | Warnruf an Bord |
| Beaufort | ? | manual_review | offen | Lesung klären |
| Trawler | Trohler | alias | offen | englisches Lehnwort |
| Rhombus | Rhombus | literal | offen | Signalkörper |
| Isobaren | Isobaren | literal | offen |  |
| Dreifarbenlaterne | Dreifarbenlaterne | literal | offen | in der Testszene |
| Achterstag | Achterstag | literal | offen | in der Testszene |

## Namen der Figuren

| Begriff | Gesprochen | Methode | Status | Notiz |
|---|---|---|---|---|
| Hinnerk | Hinnerk | literal | offen |  |
| Smilla | Smilla | literal | offen |  |
| Klabauter | Klabauter | literal | offen |  |
| Harms | Harms | literal | offen |  |
| Quirin | Quirin | literal | offen | der Bayer |
| Hinni | Hinni | literal | offen | so nennt Quirin den Käpt'n |

## Orte

Hier stehen nur Orte, die im Leitfaden vorkommen oder bekannte Stolperstellen sind.

| Begriff | Gesprochen | Methode | Status | Notiz |
|---|---|---|---|---|
| Cuxhaven | Kuxhafen | alias | offen | v wie f |
| Laboe | Laböh | alias | offen | oe wie ö |
| Büsum | Büsum | literal | offen |  |
| Flensburg | Flensburg | literal | offen | Heimathafen |
| Holtenau | Holtenau | literal | offen |  |
| Brunsbüttel | Brunsbüttel | literal | offen |  |
| Helgoland | Helgoland | literal | offen |  |

## Plattdeutsch und Seemannssprache der Figuren

| Begriff | Gesprochen | Methode | Status | Notiz |
|---|---|---|---|---|
| Moin | Moin | literal | offen | darf gedehnt werden (Mooooin) |
| Schietbüdel | Schietbüdel | literal | offen | Plattdeutsch, liebevoll derb |
| Dösbaddel | Dösbaddel | literal | offen | Plattdeutsch für Dummkopf |
| Tüdelkram | Tüdelkram | literal | offen |  |
| Klookschieter | Klookschieter | literal | offen | Plattdeutsch für Besserwisser |
