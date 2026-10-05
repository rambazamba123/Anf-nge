# Konzept: Architektur, KI-Kosten, Offline und Konten
Stand 05.10.2026 · gilt zusammen mit CLAUDE.md · Grundlage: Architektur-Review vom 05.10.2026 und deine Antworten

## 1. Grundsätze (entschieden)
1. **Die Lern-App läuft ohne KI.** Lernen, Prüfen, Erklärungen, Lexikon, Folgen, Spiele, Navi und Törn funktionieren offline und ohne Schlüssel.
2. **Kosten entstehen nur über graue Kostenknöpfe.** Jeder Knopf, der Claude oder eine neue ElevenLabs-Aufnahme auslösen kann, ist grau wie ausgegraut (`.btn.ki`). Automatische KI-Aufrufe gibt es nicht mehr.
3. **KI-Schalter:** Beim Start und in den Einstellungen kann man die KI-Funktionen ein- oder ausschalten (`S.cfg.ki`). Wenn sie aus sind, verschwinden alle grauen Kostenknöpfe, und es entstehen keine Kosten.
4. **Fester Text wird einmal erzeugt.**
   - Ablauf: einmal mit ElevenLabs sprechen lassen, als MP3 ins Repo (`audio/stimmen/`) legen, ab dann hören es alle gratis und offline.
   - Die Stimmen gibt die App vor (`voices` im Stimmenpaket), nicht jeder Nutzer selbst.
5. **Fachwissen kommt aus unseren Daten.**
   - Zu jeder Katalogfrage gibt es eine Karte mit Erklärung, Merktipp und typischem Fehler (`data/karten.json`). Sie wird einmal erstellt.
   - Claude erklärt nur auf Grundlage dieser Karte und des Katalogs.
6. **Ton:** Der Ton bleibt wie bisher. Er ist für Jugendliche ab 14 in Ordnung (deine Entscheidung vom 05.10.2026).
7. **Schlüssel:** Für die Testphase bleiben die Schlüssel im Browser. Vor der Veröffentlichung kommen sie auf den Server (Abschnitt 5).

## 2. Wo KI bleibt und was lokal wird
| Funktion | bisher | neu |
|---|---|---|
| „Warum?“ nach einer Frage | Claude, jedes Mal neu | Karte aus `karten.json` (offline); grauer Kostenknopf „Crew fragen“ für Rückfragen |
| Merkspruch | Claude, pro Gerät gespeichert | Merktipp der Karte, Lexikon-Merkhilfe; grauer Kostenknopf nur, wenn beides fehlt |
| Lektion je Thema | Claude automatisch beim Öffnen | Katalogantworten und Karten des Themas; grauer Kostenknopf „Crew erzählt es“ (Ergebnis wird gespeichert) |
| Kapitel-Erklärung nach dem Raten | Claude automatisch | Karten der falsch geratenen Fragen; grauer Kostenknopf für die Erzählung und die Verständnisfrage |
| Kennenlernen, freie Antwort | Claude plus Live-Stimme | feste Antworten (`ONB_FREE`) |
| Lernstrategie | Claude | lokal aus dem Lernplan (`computePlan`) |
| Seemannsgarn | Claude | feste Shorts aus `folgen.json` |
| Kajütenfunk, neue Folge | Claude, Folge nur pro Gerät | grauer Kostenknopf; Folge wird dauerhaft gespeichert und kann ins Repo exportiert werden, sodass alle sie bekommen |
| Folgen und feste Sätze | ElevenLabs pro Gerät | Stimmenpaket im Repo; fehlt ein Satz, entsteht er einmal und wird exportiert |
| Gespräch (Klönschnack) | Claude plus Live-Stimme | bleibt, Einstieg ist ein grauer Kostenknopf |
| SKS-Freitext bewerten | Claude automatisch, sonst selbst bewerten | Wahl: selbst bewerten (Standard) oder grauer Kostenknopf „Harms korrigiert“ |
| Vorlesen dynamischer Antworten | automatisch | nur auf Knopfdruck |

## 3. Stimmenpaket (Ablauf)
1. Die App kennt alle festen Sätze (`packLines`): Intro, Kennenlernen, Kajüte, Eggs, Sprüche, Navi-Lektionen, Törn, Folgen und Shorts.
2. Du tippst in den Einstellungen unter „Entwickler“ auf **„Stimmenpaket erzeugen“**.
   - Fehlende Sätze werden mit den festen Stimmen erzeugt, und zwar für beide Figuren jeder Rolle.
   - Dazu kommt alles, was dein Handy schon gesprochen hat.
   - Die App lädt `stimmen.zip` herunter.
3. Die ZIP lädst du auf GitHub in den Ordner `import/` hoch. Ich entpacke sie mit `tools/stimmen-import.js` nach `audio/stimmen/`, führe das Manifest zusammen und committe.
4. Danach spielt jedes Gerät diese Sätze gratis und offline ab.

## 4. Offline
- Seite, Daten und `navi.js` werden bei der Installation gespeichert (wie bisher).
- **Neu:** Schriften liegen lokal in `fonts/`, Google wird nicht mehr abgefragt.
- **Neu:** Nach dem Start lädt die App im Hintergrund alle Fragebilder, die Geräusche und das Stimmenpaket in den Speicher („Offline-Vorrat“, einmal pro Version).
- **Neu:** Der Medien-Speicher hat eine Versionsnummer (`MEDIEN` in `sw.js`). Wird ein Bild oder Ton unter gleichem Namen ersetzt, zählt man sie hoch.

## 5. Konten und Server (Plan, wartet auf Entscheidung)
- **Ziel:**
  - Konto mit E-Mail-Anmeldung, später auch Apple und Google.
  - Der Lernstand `S` wird mit dem Konto synchronisiert.
  - KI-Aufrufe laufen über einen Server mit Tageslimit pro Konto.
- **Empfehlung: Supabase**
  - Bringt in einem Dienst mit: Anmeldung, Datenbank für den Lernstand (eine Zeile pro Konto mit dem Spielstand als JSON) und „Edge Functions“ als KI-Weiterleitung, mit den Schlüsseln als Geheimnis auf dem Server.
  - Der Gratis-Tarif reicht für den Test.
  - Nachteil: Gratis-Projekte werden nach längerer Inaktivität pausiert. Das bitte vor dem Anlegen in den aktuellen Bedingungen nachsehen.
- **Ablauf im Code:**
  - Ein Modul `KONTO` mit Anmelden, Abmelden und Konto löschen (Pflicht im App Store).
  - `save()` schreibt weiter lokal und schickt zusätzlich eine verzögerte Kopie an den Server.
  - Beim Start gewinnt der neuere Stand (`S.updatedAt`).
- **Tageslimit:**
  - Der Server zählt die Kosten-Aktionen pro Konto und Tag.
  - In der App gibt es schon heute einen Zähler (`S.kiUse`) und eine Grenze `KI_LIMIT`, die noch ausgeschaltet ist.
- **Datenschutz:** Datenschutzerklärung, Einwilligung beim KI-Schalter, Löschen des Kontos löscht alle Daten.

## 6. Store-Apps (später)
- **Capacitor** für iOS und Android, der Web-Code bleibt.
- **Vorbereitungen:**
  - Zurück-Taste (neu umgesetzt, Abschnitt 7)
  - Spracherkennung über ein natives Plugin
  - Sicherung über Teilen statt Download
- **Käufe (Skins):**
  - Store-Kauf über `cordova-plugin-purchase`, also ohne zusätzlichen Dienst.
  - Freischaltung im Konto und per „Käufe wiederherstellen“.
  - Die bisherigen Farben bleiben gratis.
  - Register `SKINS` mit Produkt-IDs wie `skin_nordsee`.

## 7. Aktionsplan
| Etappe | Inhalt | Stand |
|---|---|---|
| A1 | KI-Schalter, graue Kostenknöpfe, keine automatischen KI-Aufrufe, Tageszähler | jetzt |
| A2 | `data/karten.json` mit Erklärung und Merktipp je Frage, „Warum?“ und Merkspruch lokal | jetzt (SBF, Binnen, SKS nacheinander) |
| A3 | Stimmenpaket: feste Stimmen, Paket erzeugen, Import-Skript, KI-Folgen dauerhaft speichern | jetzt |
| A4 | Offline: lokale Schriften, Offline-Vorrat, versionierter Medien-Speicher | jetzt |
| A5 | Zurück-Taste; Gespräch: Musik und Geräusche beim Zuhören stumm, ruhigerer Mikrofonstart | jetzt |
| A6 | Konten und Server (Supabase), KI-Weiterleitung, Tageslimit | nach deiner Entscheidung |
| A7 | Folgen für SKS und Binnen, danach das Stimmenpaket ergänzen | danach |
| A8 | Capacitor, Datenschutz, Store-Einträge, Skins mit Käufen | danach |
| A9 | Unter Deck im Schnitt; Funk und Pyro, wenn die Kataloge da sind | später |
