---
folge: S2.2
titel: Begegnen, Kreuzen, Überholen, Segeln
status: vorlage
---
# Vorlage für ein Folgenskript des Hörkurses (docs/konzept-kajuetenfunk.md, Fassung 5: Bauplan §7, Rahmen §6, Skriptform Anhang A, Ablaufplan Anhang C).
# Kopieren als podcast/folgen/<Folge>.md, Punkt durch Bindestrich ersetzt (S2.2 → S2-2.md), Kopf anpassen, dann schreiben.
# Prüfen beim Schreiben: node tools/podcast-pruefen.js --entwurf podcast/folgen/S2-2.md
# Diese Datei selbst wird weder geprüft noch vertont. Gezeigt sind ein Teil des Einstiegs, eine Regel mit Antwortknöpfen und Vertiefung,
# der Fallen-Check, der Abschluss und eine Hörkarte; alles andere folgt demselben Muster.
# Rahmen dieser Folge laut Kursplan: Törn (Kieler Woche, drei Begegnungen). Jede Folge hat ihren eigenen Rahmen, kein Schema F (Konzept §6.2).
# Regeln: Zahlen in Worten, Abkürzungen ausgeschrieben, höchstens drei Stimmen je Szene, jede Szene mit Revier, und das Revier wird ausgesprochen.
# Antwortknöpfe: erst die Frage sprechen, dann [[WAHL: sbf:123 | … | *…]], direkt danach [[DENKPAUSE: 5]]. Die Antwort zählt in der Statistik.
# Wer falsch antwortet, hört im interaktiven Modus die Vertiefung ([[VERTIEFUNG: sbf:123]] … [[VERTIEFUNG: ende]]); im Auto-Modus fällt sie weg.
# Hörreise (07.11.2026): Klassiker der Figuren aus podcast/sprueche.json mit [[SPRUCH: id]] im Satz der Figur (gezählt, docs/reise.md HR25);
# Anrede nach Wahl als {{anrede:w=min Deern|m=min Jung|n=Landratte}}, nur kurz und am Satzanfang (HR24).
# Denkpausen: 3 s erinnern, 5 s entscheiden, 6 s Kernsätze. Danach sagt die Folge immer die Lösung, auch im Auto-Modus.
# Hörreise, Dichte (docs/reise.md HR46): je Fakt Anlass → Frage → kurze Auflösung → höchstens ein Merksatz. Kein zweites „Genau, …“, die Antwort nie direkt vor der Frage.
#   Statt Wiederholung in derselben Folge ein Echo ein bis drei Folgen später (ein Satz am selben Bild). Vorher und nachher docs/geschichte-logbuch.md lesen und fortschreiben.
# Hörreise ab 15.11.2026 (docs/reise.md HR50–HR55):
#   Karte = Welt (HR51): Jeder Ort, jede Tonne, jede Richtung und jede Meile steht so auf der Reisekarte (data/karte-brede.json). Strecken und Fahrzeiten: node tools/karte-pruefen.js --tabelle.
#     Frieda läuft etwa fünf Knoten. Gezeiten aus „gezeiten“ (Hochwasser Tag 1 um elf, jeden Tag gut fünfzig Minuten später). Seezeichen heißen wie auf der Karte („Ka eins“, „E vier“).
#   Nichts nur im Anruf (HR50): Was die Geschichte braucht, passiert in der Geschichte; Harms am Ende ist abschaltbar.
#   Keine Stelle wartet auf Tippen oder Messen (HR20): Die Crew macht es laut denkend, geübt wird in der Abendwache (HR52). Navigation in der Folge: Zahlen von der Karte, kein „Mach mal, ich warte“.
#   Hinnerks Geheimnis (HR53): höchstens eine Spur je Tag (Piepen, „Batterie“, Entfernung „aus dem Bauch“), nie im Mittelpunkt; im Logbuch eintragen.
#   Erste Zeile einer Tagesfolge ist ein Moin aus der Kiste; [[SZENE]] nennt Ort, Tageszeit und Wetter (Stimmung der App); eigene Antworten der Crew höchstens fünf Wörter (HR55).
# Vor dem Abgeben: docs/fehler-katalog.md Teil A durchgehen, node tools/karte-pruefen.js laufen lassen.

[[ABSCHNITT: Einstieg]]
[[SZENE: Kieler Förde zur Kieler Woche, am Rand der Regattabahnen. Hinnerk am Ruder, ein anderes Segelboot kommt näher.]]
[[REVIER: frei]]
[[BAUSTEIN: streit]]
HINNERK: Moin. Kiek mol, wie viel Tuch heute auf der Förde is. Und wir sind weit weg vom Fahrwasser, da haben wir unsere Ruhe.
SMILLA: Ruhe? Da kommt einer, Käpt'n. Wir haben beide den Wind von Steuerbord.
HINNERK: Wer muss jetzt weg, der oder wir?
[[VORAB: sbf:126]]
SMILLA: Zwei Segler, Wind von derselben Seite. Wer muss ausweichen? Tipp mal. Die Auflösung kommt.
[[WAHL: der Kleinere | der Leewärtige | *der Luvwärtige]]
[[DENKPAUSE: 5]]
# Vorab-Frage: Im interaktiven Modus zeigt die App die Knöpfe ohne richtig oder falsch und merkt sich den Tipp. Der Tipp zählt nicht in der Statistik.

[[SZENE: Cockpit, Harms ist am Telefon zugeschaltet.]]
[[REVIER: frei]]
[[RUECKBLICK: sbf:125]]
HARMS: Moin. Ihr seid auf freier See, also frag ich. Woran erkennst du, dass es mit einem anderen Schiff eng wird?
[[DENKPAUSE: 3]]
HARMS: Der Abstand wird kleiner, und die Peilung ändert sich nicht.
# zweite Rückblick-Frage aus einer anderen früheren Folge, zum Beispiel sbf:15 aus G5.2, nach demselben Muster
SMILLA: Heute drei Begegnungen auf freier See: entgegen, überholen und Segler unter sich.

[[ABSCHNITT: Überholen]]
[[SZENE: Unter Motor, ein langsames Motorboot fährt vor uns her.]]
[[REVIER: frei]]
SMILLA: Wir sind immer noch weit weg vom Fahrwasser. Vor uns tuckert ein Motorboot, und wir sind schneller.
[[IRRTUM: sbf:137]]
HINNERK: Wir segeln, der hat 'n Motor. Also muss der aus'm Weg.
[[BERICHTIGUNG: sbf:137]]
SMILLA: Nee, Käpt'n. Wer überholt, weicht aus, immer. Ob Segel oder Motor, ist dabei egal. Der Vordere sieht dich ja nicht kommen.
HINNERK: Sag ich doch. Wir weichen aus.
[[ANIM: begegnung, ueberholen]]
SMILLA: Überholer bist du, wenn du von hinten kommst, aus dem Bereich, in dem man nachts nur sein Hecklicht sieht.
[[KATALOG: sbf:81]]
SMILLA: Im Katalog heißt das: Wenn es sich einem anderen Fahrzeug aus einer Richtung von mehr als zweiundzwanzigeinhalb Grad achterlicher als querab, also aus dem Bereich des Hecklichtes, nähert.
[[KATALOG: sbf:137]]
SMILLA: Und was muss es tun? Es hat dem zu überholenden Fahrzeug auszuweichen.
[[MERKHILFE: gilt beim Überholen]]
KLABAUTER: [[AUDIO: Schiffsglocke]] Krrah! Merken! Heck gesehen? Du weichst aus!
SMILLA: Du segelst und holst ein langsames Motorboot von hinten ein. Wer weicht aus?
[[WAHL: sbf:137 | *du | das Motorboot]]
[[DENKPAUSE: 5]]
[[VERTIEFUNG: sbf:137]]
SMILLA: Stell dir vor, du fährst Fahrrad und holst einen Fußgänger ein. Der guckt nach vorn, nicht nach hinten. Du siehst ihn, er sieht dich nicht. Darum fährst du um ihn herum. Auf dem Wasser genauso: Segel oder Motor zählt hier nicht, nur wer von hinten kommt.
[[VERTIEFUNG: ende]]
SMILLA: Du. Wer das Heck sieht, hat die Arbeit.

[[ABSCHNITT: Fallen und Abschluss]]
[[SZENE: Harms prüft den Hörer, am Telefon im Cockpit.]]
[[REVIER: frei]]
HARMS: Ihr seid immer noch auf freier See. Jetzt frag ich dich.
[[FALLE: sbf:81]]
HARMS: Stimmt's? Überholer ist, wer sich einem anderen Fahrzeug aus einer Richtung von mehr als hundertzwölfeinhalb Grad achterlicher als querab nähert, im Bereich der Seitenlichter.
[[DENKPAUSE: 3]]
HARMS: Falsch. Zweiundzwanzigeinhalb Grad, im Bereich des Hecklichtes.
SMILLA: Nenn die drei Fälle von heute. Laut, wenn keiner zuhört.
[[DENKPAUSE: 6]]
KLABAUTER: [[AUDIO: Schiffsglocke]] Krrah! Merken! Entgegen: beide Steuerbord! Überholer weicht immer! Lee vor Luv!

# Hörkarten: nach der Folge, eine je Frage der Folge, höchstens zwei Stimmen, etwa 20 bis 25 Sekunden. Der Merksatz ist derselbe wie in der App (data/karten-sbf.json).
[[HOERKARTE: sbf:137]]
SMILLA: Du überholst ein anderes Boot. Was musst du tun?
[[DENKPAUSE: 3]]
[[KATALOG: sbf:137]]
SMILLA: Es hat dem zu überholenden Fahrzeug auszuweichen. Immer, auch als Segler gegenüber einem Motorboot, denn der Vordere sieht dich nicht kommen.
KLABAUTER: Heck gesehen? Du weichst aus!
