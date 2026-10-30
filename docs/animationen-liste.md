# Animationen: alles, was sich zeichnen lässt (Liste vom 30.10.2026)

> Grundsatz (Nutzer, 29.10.2026): Alles Gesprochene versteht man auch ohne Bild, die Grafik erklärt zusätzlich. Wo sich etwas zeichnen lässt, kommt eine Animation dazu.
> **Teil A Prüfungsstoff:** kommt in den Prüfungsfragen vor (Folge-Nummern aus `podcast/kursplan-sbf.json`). **Teil B Zusatz:** seemännisches Wissen für Motorboote, das nicht geprüft wird, aber an Bord wichtig ist.
> Status: ✓ gebaut · ◐ teilweise (Baustein da) · ○ offen. Priorität 1 = zuerst, 3 = später. Alle Bilder entstehen als SVG oder Canvas im Stil der App (warm, flach, gezeichnet, R-Stil §3). Tag in der Reise: Wo sie laufen soll (`docs/reise-konzept.md`).

## Teil A: Prüfungsstoff

### A1 Boot, Antrieb, Motor (Grundkurs G2, G3, G4)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A1.1 | Das Boot und seine Seiten | Bug, Heck, Backbord (rot), Steuerbord (grün), achtern, querab, mittschiffs | G1.2 | ○ (Rundgang 2 H8) | 1 |
| A1.2 | Radeffekt | Heckansicht, Strömungspfeil nach oben gegen den Rumpf, Heck weicht aus, rückwärts spiegelverkehrt | G2.1 | ✓ v5.09 | – |
| A1.3 | Radeffekt von oben beim Ablegen und Anlegen | Draufsicht mit den Pfeilen aus A1.2, Anlegen mit Backbord, Gegenlenken | G2.1, G3.1 | ◐ (Manöverspiel `demo`) | 2 |
| A1.4 | Ruder und Schraubenstrahl | Ruder wirkt nur im Wasserstrahl, rückwärts erst spät, Kuppeln im Stand | G2.1 | ○ | 2 |
| A1.5 | Die vier Kreisläufe des Motors | Kühlwasser (Seeventil, Filter, Impeller, Auspuff), Öl, Strom, Kraftstoff; Alarmleuchten | G2.2 | ○ | 3 |
| A1.6 | Außenborder ohne Ruder | Schub schwenkt mit dem Motor, Lenken über den Schraubenstrom | G2.1 | ◐ (Minispiel Motorkunde) | 3 |
| A1.7 | Gas und Benzindampf in der Bilge | Gas sinkt nach unten, Lüften vor dem Start, Funkenfreiheit | G4.1 | ○ | 3 |
| A1.8 | Tanken und Rauchen | Bilge lüften, Gas aus, Tank außen, kein Funke | G4.1 | ○ | 3 |

### A2 Anlegen, Ankern, Manöver (G3, S10)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A2.1 | Anlegen | Spitzer Anlaufwinkel, Fahrt rausnehmen, Wind und Strom von vorn, Leinen ausbringen | G3.1 | ◐ (`manoever.js` demo) | 2 |
| A2.2 | Ablegen mit Wind und Strom | Wind aus verschiedenen Richtungen, Heck oder Bug zuerst | S10.2 | ◐ | 2 |
| A2.3 | Ankern | Anker werfen, Kettenlänge, Schwojen, Ankerwache; Ankersignal | G3.1, S3.2 | ○ | 2 |
| A2.4 | Sog und Schwell | Bug- und Heckwelle, Sog eines großen Schiffs, kleines Boot daneben, Fahrt rausnehmen | G3.2 | ○ | 2 |
| A2.5 | Wenden auf engem Raum | Drehen um den Stand, Radeffekt nutzen, Kommandos | S10.2 | ◐ | 2 |
| A2.6 | Aufstoppen | Kursgerechtes Aufstoppen, Auslaufstrecke | S10.2 | ◐ | 3 |
| A2.7 | Mensch über Bord | Kurzdreh, Williamson-Kurve, Anfahrt von Luv, Bergung | G4.2, S9.4 | ◐ (Manöverspiel MOB) | 2 |

### A3 Knoten (G1.2, S10.1)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A3.1 | Palstek, Achtknoten, Kreuzknoten, Schotstek, Webeleinstek, Webeleinstek auf Slip, Rundtörn mit zwei halben Schlägen, Stopperstek, Klampe | Tau-Animationen aller Prüfungsknoten | G1.2, S10.1 | ✓ (`knoten.js`) | – |
| A3.2 | Knoten in der Anwendung | Palstek an Poller, Rundtörn am Ring, Webeleinstek an der Reling, Stopper unter Last | S10.1 | ◐ | 3 |

### A4 Ausweichen und Verkehr (G5, S2, S6)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A4.1 | Zwei Grundregeln | Rechts vor Links, Maschine weicht Segler aus, mit Pfeilen | G5.2 | ○ | 1 |
| A4.2 | Begegnung von oben | Peilung bleibt stehen = Kollisionskurs, wer ausweicht, Überholsektor, Kursänderung früh und deutlich | S2.1, S2.2 | ○ | 1 |
| A4.3 | Die Rangfolge | Leiter von manövrierunfähig bis Maschinenfahrzeug, mit Bildern | S2.3 | ○ | 2 |
| A4.4 | Kurshalter und letzter Augenblick | Wer ausweicht, wer Kurs hält, wann der Kurshalter eingreifen muss | S2.4 | ○ | 2 |
| A4.5 | Wo gilt was? | Hohe See, Seeschifffahrtsstraße, Fahrwasser, Verkehrstrennungsgebiet | S1.1 | ○ | 2 |
| A4.6 | Verkehrstrennungsgebiet | Einbahnwege, Trennzone, Queren im rechten Winkel, Küstenverkehrszone | S6.6 | ○ | 2 |
| A4.7 | Rechts halten im Fahrwasser | Nicht queren ohne Not, Ankerverbot, Begegnung mit Tiefgängern | S6.1 | ○ | 2 |
| A4.8 | Segler und Motorboot | Wer weicht aus, Windseite, Segler mit laufendem Motor gilt als Maschinenfahrzeug | S2.2 | ○ | 2 |

### A5 Lichter und Signalkörper (G5.1, S3)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A5.1 | Lichterkarussell | Ein Schiff dreht sich: Topplicht, Seitenlichter, Hecklicht je nach Blickwinkel, Sektoren | G5.1, S3.1 | ◐ (`drawShip` im Törn) | 1 |
| A5.2 | Lichter und Signalkörper je Fahrzeug | Nachtbild und Tagbild umschaltbar plus Katalogbild: Maschinenfahrzeug, Segler, Schlepper, Fischer, Tiefgang, Manövrierbehinderte, Ankerlieger, Grund | S3.1 bis S3.6 | ◐ | 1 |
| A5.3 | Schleppverband | Länge der Schleppe, Lichter und Zeichen | S3.3 | ○ | 2 |
| A5.4 | Manövrierunfähig und manövrierbehindert | Zwei rote Lichter, zwei Bälle; Bagger mit roten und grünen Lichtern | S3.4, S3.5 | ○ | 2 |
| A5.5 | Fischer und Tiefgänger | Trawler, Netze, Kegel, Zylinder | S3.6 | ○ | 2 |
| A5.6 | Vor Anker und auf Grund | Ankerlicht, Ball, drei Bälle | S3.2 | ○ | 2 |

### A6 Schallsignale und Nebel (G6, S4, S11.1)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A6.1 | Schallsignale sichtbar | ● und ▬ laufen mit dem Ton mit (kurz, lang), Manöversignale, Warnsignal, Nebelsignale | S4.1 bis S4.3 | ○ | 1 |
| A6.2 | Nebel von oben | Wer tutet da: Bereich vorlicher als querab, Fahrt, Ausguck | S4.1, S4.2 | ○ | 2 |
| A6.3 | Glocke und Gong | Ankerlieger im Nebel, Schiff auf Grund | S4.3 | ○ | 2 |

### A7 Zeichen, Tonnen, Feuer, Tafeln (G6, S5)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A7.1 | Fahrwasser von See kommend | Rot an Backbord (beim Einlaufen), grün an Steuerbord, Nummern, Mitte, Abzweigung | S5.2, S5.3 | ◐ (Seekarte 7) | 1 |
| A7.2 | Feuer im Takt | Blink, Blitz, Funkel, unterbrochen, Gleichtakt in echter Taktung | S5.1 | ◐ (`seezeichen.js`, `takt`) | 1 |
| A7.3 | Kardinalzeichen als Uhr | Vier Tonnen um die Gefahr, Toppzeichen, Blitze wie Uhrzeiten (3, 6, 9, 12), Vorbeifahren | S5.4 | ○ | 1 |
| A7.4 | Einzelgefahrzeichen, Sonderzeichen, Mitte | Rot-schwarz mit zwei Bällen, gelb, rot-weiß senkrecht | S5.5 | ○ | 2 |
| A7.5 | Leit-, Richt- und Quermarkenfeuer | Weißer Leitsektor, Richtfeuer in Deckung, Ankündigungssektor | S5.5 | ○ | 2 |
| A7.6 | Tafelzeichen nach Familien | Verbot (rot), Gebot (blau), Hinweis, Zusatz; Katalogbild groß | G6.1, G6.2 | ○ | 1 |
| A7.7 | Brücken und Durchfahrtshöhen | Mast, Durchfahrtshöhe, Wasserstand, Signalfarben | G6.3 | ○ | 2 |
| A7.8 | Schleusenablauf | Einfahren, festmachen, Füllen und Leeren, Drempel, Oberwasser und Unterwasser, Ampeln | G6.3 | ○ | 1 |

### A8 Navigation (S7, später N0 bis N6)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A8.1 | Seekarte lesen | Kartentitel, Tiefen, Tonnen, Kennungen, Legende | S7.1 | ✓ (Navigation auf Seekarte 7) | – |
| A8.2 | Kurs und Distanz | Dreieck, Zirkel, Breitenrand 1′ = 1 sm | S7.2 | ✓ | – |
| A8.3 | Missweisung und Ablenkung | rwK, mwK, MgK als Pfeile an der Kompassrose | S7.2 | ○ | 1 |
| A8.4 | Peilung und Standlinie | Konstante Peilung, Kreuzpeilung, Schnittwinkel | S2.1, S7.1 | ◐ (Aufgabe N5) | 1 |
| A8.5 | Koppelort und Versetzung | Strom abtragen, Besteckort, Vorhaltewinkel | S7.3 | ◐ (Aufgabe N6) | 1 |
| A8.6 | Ebbe und Flut | Wasserstandskurve, HW und NW, Tidenhub, Wassertiefe = Kartentiefe + Höhe | S7.4 | ○ | 2 |
| A8.7 | Stromrichtung bei Tide | Ebbstrom, Flutstrom, Stromstille, Strom gegen Wind (steile See) | S7.4 | ○ | 2 |
| A8.8 | Seemeile und Knoten | 1′ Breite = 1 sm, Log, Fahrt über Grund | S7.2 | ○ | 3 |

### A9 Wetter, Natur, Sicherheit (G7, S8, S9)
| Nr. | Animation | Zeigt | Folge | Status | Prio |
|---|---|---|---|---|---|
| A9.1 | Warum der Wind weht | Luftdruckunterschied, Wind vom Hoch zum Tief, Drehsinn (gegen den Uhrzeigersinn ums Tief) | G7.1, S9.1 | ○ | 2 |
| A9.2 | Wetterkarte | Hoch und Tief, Isobaren, Fronten, Warmfront, Kaltfront, Wind vorhersagen | S9.1 | ○ | 2 |
| A9.3 | Beaufort | Windstärken mit Seegang, Warnschwellen 6 bis 7 und ab 8, Sturmwarnung | S9.2 | ○ | 3 |
| A9.4 | Schweres Wetter und Schleppen | Wellen von achtern, Bug in die Welle, Schleppleine, Schleppverband im Seegang | S9.3 | ○ | 3 |
| A9.5 | Notsignale | Rakete, Fallschirmrakete, Rauchsignal, Flagge mit Ball, SOS, Funkalarm, Winken | S9.5 | ○ | 2 |
| A9.6 | Rettungsweste und Sicherheit an Bord | Weste anlegen, Lifebelt, Feuerlöscher, Leckabwehr | G4.2 | ○ | 2 |
| A9.7 | Feuer an Bord | Löschen mit dem Pulverlöscher, Sprit und Gas, Motorraum | G4.2 | ○ | 3 |
| A9.8 | Umwelt | Nichts über Bord (Öl, Müll), Fäkalien, Schutzzonen, Seehunde, Abstände | G7.1, S8.2 | ○ | 3 |
| A9.9 | Nationalpark und Wattenmeer | Schutzzonen, Seehundbänke, Ruhezonen, Geschwindigkeit | S8.1 | ○ | 3 |
| A9.10 | Baden, Wasserski, Ankerverbot | Abstände, Flaggen, Verhalten vor dem Strand | S6.2 | ○ | 3 |

### A10 Binnen (nur SBF Binnen, Akt 7)
| Nr. | Animation | Zeigt | Status | Prio |
|---|---|---|---|---|
| A10.1 | Berg- und Talfahrt | Strömung, Richtung, wer Vorrang hat, Ausweichen nach rechts, Wechsel der Seite mit Zeichen | ○ | 1 |
| A10.2 | Schleuse Binnen | Wehr, Kammer, Tore, Ampeln, Oberwasser, Drempel (verstärkt A7.8) | ○ | 1 |
| A10.3 | Schubverband und Fähre | Lichter, Signalkörper, Fähre (Seil, Kette), Abstand | ○ | 2 |
| A10.4 | Brücke und Wehr | Durchfahrtshöhe, Strömung am Wehr, Sperrzeichen | ○ | 2 |
| A10.5 | Binnenschallsignale | Anders als See (Signal vor Schleuse, Brücke, Hafen), Hören-Spiel | ○ | 2 |
| A10.6 | Wasserski und Sportboote auf dem Fluss | Kennzeichen, Abstände, Geschwindigkeit | ○ | 3 |
| A10.7 | Segeln (freiwillig) | Wind, Segelstellungen, Wende, Halse, Trimm, Kentern | ○ | 3 |

## Teil B: Zusatz (nicht geprüft, aber nützlich für Motorboote)

### B1 Handling und Seemannschaft
| Nr. | Animation | Zeigt | Status | Prio |
|---|---|---|---|---|
| B1.1 | Verdränger oder Gleiter | Bugwelle, Rumpfgeschwindigkeit, wann das Boot gleitet, Wellenbild | ○ | 2 |
| B1.2 | Trimm und Trimmklappen | Bug oben und unten, Gleitwinkel, Verbrauch | ○ | 3 |
| B1.3 | Pivotpunkt | Wo sich das Boot dreht, warum das Heck ausschwenkt, Drehen auf der Stelle mit Doppelmotor | ○ | 2 |
| B1.4 | Wind und Abdrift beim Manövrieren | Boot treibt ab, Bug fällt ab, Wind von vorn und von achtern, Fahrt über Grund | ○ | 1 |
| B1.5 | Strömung im Hafen | Anlegen gegen den Strom, Strom im Hafenbecken, Prallstrom an Pfählen | ○ | 2 |
| B1.6 | Spring und Festmacher | Vorleine, Achterleine, Vorspring, Achterspring, Bugleine, wo welche Leine hält und wozu | ○ | 1 |
| B1.7 | Fender | Wo hängen sie, Höhe, Fenderbrett, Querstabil | ○ | 3 |
| B1.8 | Ablegen mit Spring | Eindampfen in die Vorspring, Heck dreht ab | ○ | 2 |
| B1.9 | Ankern in der Praxis | Ankerkette und Leine, Scope (Verhältnis Kette zu Tiefe), Einfahren, Ausbrechen, Ankerpeilung | ○ | 1 |
| B1.10 | Ankerwache | Wann das Boot driftet, Peilung auf zwei Landmarken, Alarm am Plotter | ○ | 3 |
| B1.11 | Schleppen | Schlepper am Haken, Schleppleine anbinden, Fahrt, Leinen im Seegang | ○ | 3 |
| B1.12 | Rückwärts fahren | Boot gehorcht anders, Ruder, Radeffekt, Schub | ○ | 2 |

### B2 Sicherheit und Ausrüstung
| Nr. | Animation | Zeigt | Status | Prio |
|---|---|---|---|---|
| B2.1 | Weste anlegen und prüfen | Feststoff und Automatik, Schrittgurt, Lifebelt, Leuchte | ○ | 2 |
| B2.2 | Rettungsinsel | Auslösen, Aufblasen, Einsteigen, Abstand zum Boot | ○ | 3 |
| B2.3 | Pyrotechnik | Handfackel, Fallschirmrakete, Rauchtopf, Richtung, Abstand, Wind | ○ | 3 |
| B2.4 | Funkalarm im Notfall | Mayday-Ablauf (Wer, wo, was, wie viele, Hilfe), DSC-Knopf, Reihenfolge | ○ | 2 |
| B2.5 | Leckabwehr | Wassereinbruch, Lenzpumpe, Holzpfropfen, Kurs zum Land, Notruf | ○ | 2 |
| B2.6 | Grundberührung | Rückwärts raus oder Anker auslegen, Tide beachten, Schäden prüfen | ○ | 2 |
| B2.7 | Hitze, Kälte, Seekrankheit | Verhalten, Horizont, Trinken, Anzeichen | ○ | 3 |
| B2.8 | Mensch über Bord, Rückholung | Bergen mit Leiter, Gurt, Fall, Winde, Bergegurt | ○ | 3 |

### B3 Technik und Pflege
| Nr. | Animation | Zeigt | Status | Prio |
|---|---|---|---|---|
| B3.1 | Motorcheck vor der Fahrt | Öl, Kühlwasser, Keilriemen, Impeller, Seeventil, Bilge, Batterie | ○ | 2 |
| B3.2 | Wenn der Motor stottert | Kraftstofffilter, Wasser im Diesel, Luft ziehen, Impeller defekt, Überhitzung | ○ | 3 |
| B3.3 | Batterie und Strom | Starter, Verbraucherbatterie, Trennschalter, Ladung | ○ | 3 |
| B3.4 | Echolot, GPS und Kartenplotter | Was sie anzeigen, wie sie lügen können, Kontrolle mit Papierkarte | ○ | 2 |
| B3.5 | Kompass und Ablenkung an Bord | Magnete und Eisen stören, Kompensation, Peilkompass | ○ | 3 |
| B3.6 | Winterlager | Wasser ablassen, Frostschutz, Motor einmotten | ○ | 3 |

### B4 Revier und Planung
| Nr. | Animation | Zeigt | Status | Prio |
|---|---|---|---|---|
| B4.1 | Törnplanung | Karte, Wetter, Tide, Hafen, Zeitplan, Reserven | ○ | 2 |
| B4.2 | Hafenregeln | Einfahrt, Vorfahrt im Hafen, Gästeplatz, Liegegeld, Schwell | ○ | 3 |
| B4.3 | Wattfahren | Fahrwasser, Prickenwege, trockenfallen, Steigung | ○ | 2 |
| B4.4 | Wellen und Strom gegeneinander | Strom gegen Wind, steile See, Barre, Einfahrt | ○ | 2 |
| B4.5 | Nachtfahrt | Dunkelheit, Feuer lesen, Lichter im Hafen, Beleuchtung, Ausguck | ○ | 2 |
| B4.6 | Sichtweiten | Tragweite der Feuer, Erdkrümmung, wann man etwas sieht | ○ | 3 |

## Vorschlag für die Reihenfolge
1. **Zuerst (Prio 1, Prüfung):** A1.1 Boot und Seiten, A4.1/A4.2 Ausweichen, A5.1/A5.2 Lichter, A6.1 Schallleiste, A7.1 bis A7.3 Tonnen und Kardinal, A7.6 Tafeln, A7.8 Schleuse, A8.3 bis A8.5 Navigation, A10.1/A10.2 Binnen.
2. **Dann (Prio 2, Prüfung):** Anlegen, Ankern, Sog, Rangfolge, VTG, Nebel, Gezeiten, Wetter, Notsignale, Sicherheit.
3. **Parallel Zusatz Prio 1:** B1.4 Wind und Abdrift, B1.6 Spring und Festmacher, B1.9 Ankern in der Praxis. Diese passen zu Manövern und Anlegen, die Motorboote jeden Tag brauchen.
4. **Später:** Alles mit Prio 3.

**Technik:** Jede Animation wird ein Reise-Schritt `{ansicht: 'grafik', bild: '...'}` mit Phasen `{grafik: n}` (`GRAFIK` in `reise.js`, Vorbild: Radeffekt), damit dieselbe Animation in der Reise, im Kajütenfunk (`[[ANIM]]`) und unter „Frei üben“ läuft. Pro Animation ein Skript mit den gesprochenen Sätzen je Phase (verständlich auch ohne Bild).
