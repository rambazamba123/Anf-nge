# Wie es eine gute Geschichte wird (04.11.2026, zu v5.22)

> **Anlass:** Der Nutzer hat am 04.11.2026 gesagt: „Merze die Fehler aus und setze alle Vorschläge so um. Bevor du loslegst, denk selbst nochmal darüber nach, wie es wirklich eine gute Geschichte wird.“
> **Grundlage:** `docs/strategie-gutachten.md`, `docs/gesamtplan.md` (Fassung 4) und die bestätigten Figuren.
> **Was hier neu ist:** ein paar Vorschläge (★). Sie sind noch nicht beschlossen (R15, R16) und gelten erst nach deinem Ja.

## 1. Was eine gute Lerngeschichte braucht
Die Forschung warnt vor zu viel Geschichte, weil sie vom Lernen ablenkt. Gut ist eine Geschichte, die drei Dinge leistet:
1. **Ein Grund, heute weiterzumachen.** Die Frage dahinter: „Was passiert, wenn ich es nicht kann?“
2. **Gefühl ohne Ablenkung.** Die Geschichte läuft in den Pausen zwischen dem Lernen (Kajüte, Zeitraffer, Abend), nie mitten in einer Aufgabe.
3. **Fortschritt, den man spürt.** Die Figuren behandeln dich anders, je mehr du kannst.

Unsere Geschichte hat das schon zum großen Teil. Ihr fehlte bisher eine echte Verbindung zwischen **Können** und **Geschichte**. Die gibt es jetzt durch das Ausbildungsheft.

## 2. Die Kernfrage
**„Kannst du die Frieda führen, wenn Smilla geht?“**
- Smilla hat ihren Traumjob auf einem Traditionssegler und geht eine Woche vor deiner Prüfung (bestätigt).
- **★ Vorschlag: Warum es dich wirklich braucht.**
  - Hinnerk sieht nachts schlecht (bestätigt). Ohne eine zweite Person, die nachts Wache gehen kann, darf die Frieda nur tagsüber fahren.
  - Die Hafenmeisterin gibt die Aufträge (Ruderboot, Überführungen, Abschleppen) nur, wenn zwei an Bord sind, die das Boot führen können.
  - Hinnerk verschweigt das am Anfang. Smilla weiß es.
  - In Kapitel 4 (Nacht und Nebel) kommt es raus. Ab da gehst du die Nachtwachen.
  - Damit hat jede Freigabe ein Gewicht: Sie ist Hinnerks Vertrauen. Und Hinnerk muss lernen, loszulassen. Das ist sein Bogen.

## 3. Können treibt die Geschichte (neu im Code)
- **Was freigegeben ist, machst du. Was nicht, macht die Crew.** Der Schritt `wennFrei` in den Folgen setzt das um, zum Beispiel in Folge 4: Ist das Anlegen freigegeben, legst du an. Sonst sagt Hinnerk: „Anlegen mach ich. Noch nich freigegeben.“
- **Freigaben brauchen einen zweiten Tag.** Hinnerk: „Morgen nochmal. Einmal is Glück.“ Das ist Lernforschung (verteilter Nachweis) und Figur zugleich.
- **Die Crew merkt es.** Neue Freigabe: Hinnerk sagt „Dat kannst du ab jetzt.“ (er lobt nie direkt), und Klabauter kräht „Freigabe! Freigabe!“. Bei „sicher“ sagt Smilla etwas dazu.
- **Eingerostet:** Liegt eine Fertigkeit lange zurück, sagt die Crew „Länger her. Zeig erst nochmal.“ Das ist keine Strafe, und die Geschichte geht weiter.
- **Hörmodus:** Im Auto fährt Hinnerk, und die Aufgabe bleibt im Heft offen („Am Handy nachholen“).

## 4. Figuren: Bögen, kurz
| Figur | Anfang | Ende | Was den Bogen trägt |
|---|---|---|---|
| Hinnerk | traut dir nichts zu, fasst alles selbst an | sagt „Skipper“ (Tag 48) | Freigaben, seine Nachtblindheit, die Rivalität mit Harms |
| Smilla | ungeduldig, erklärt zu schnell | übergibt dir die Wache | ihr eigenes Durchfallen bei Harms (Tonne 10), ihr Abschied |
| Klabauter | Petze, Plappermaul | merkt sich deine Erfolge mit | Merksätze, Freigaben feiern, Fehler petzen |
| Harms | knurrt am Telefon | sagt einmal „Gut.“ | Abnahmen am Kapitelende |
| Du | Landratte, Passagier | Skipper | Anreden wachsen mit (Gesamtplan §5) |

## 5. Aufbau einer Folge (neu, als Baukasten)
Nicht jede Folge hat dieselben Schritte. Bausteine:
- Briefing in der Kajüte
- kurz erklärt
- vormachen (Hinnerk fährt)
- selbst machen (gemessen)
- Störung (neue Lage: warmer Motor, Seitenwind, Strom)
- Situationsfrage
- Abendfragen
- Logbuch
- Plaudern

**Beispiele:**
- **Folge 4 „Motor an!“:**
  - Erklären mit Checkliste
  - selbst starten (kalt)
  - Situationsfrage Kontrollstrahl
  - Störung: warm starten
  - Runde im Becken
  - Situationsfrage „blockierter Propeller“
  - Anlegen nur, wenn es freigegeben ist
  - Bauchregel „draufklopfen“ wird aufgelöst
  - 8 Abendfragen
- **Folge 6 „Übungstag im Becken“:**
  - Radeffekt erklärt und gefragt
  - Motor (zweiter Tag, zählt für die Freigabe)
  - Ablegen
  - Aufstoppen
  - Wenden auf engem Raum
  - „Oskar über Bord“: Die Katze schubst die Übungspuppe ins Wasser. „Oskar“ heißt die Flagge O, „Mann über Bord“.
  - Anlegen bei Seitenwind
  - 11 Abendfragen

## 6. Regeln, damit die Geschichte nicht stört
1. Höchstens etwa ein Fünftel der Zeit ist Geschichte. Der Rest ist Lernen.
2. Keine Geschichte während einer Selbst-Aufgabe. Die Crew reagiert nur auf das, was passiert.
3. Jeder Gag ist entweder ein Merksatz oder ein Grund, etwas zu tun.
4. Keine Regel als falsch hinstellen, auch nicht im Vorwand einer Scheinwahl (`tools/folgen-pruefen.js` sucht nach bekannten Fehlsätzen).
5. Nach einer Pause kommt eine kurze Rückblende. Nichts geht verloren.

## 7. Orte und 3D-Welt: noch zu entscheiden (F7)
Der Nutzer will die Orte und die 3D-Welt noch stark ausbauen, entweder als eine große Karte oder als viele Szenen. Die beiden Wege:
- **(a) Eine große, zusammenhängende Welt** aus der Seekarte 7 (Tonnen und Häfen aus `data/karte7.json`), mit Bereichen, die nachgeladen werden.
  - Vorteil: Karte und 3D zeigen dasselbe; Navigation und Fahrt passen zusammen.
  - Nachteil: mehr Arbeit, Leistung am Handy beachten.
- **(b) Viele kleine Szenen** (Hafen, Schleuse, Watt, Kanal), dazwischen Zeitraffer auf der Karte.
  - Vorteil: schnell zu bauen, jede Szene genau für ihr Lernziel.
  - Nachteil: Man reist nicht wirklich, und die Karte passt nur ungefähr.
- **★ Empfehlung: eine Mischform.** Eine Welt nach Seekarte 7 für alles, was gefahren und navigiert wird. Dazu Nahszenen für Kajüte, Schleuse und Steg, die man ohne Fahrt betritt.
- **Bis zur Entscheidung:** Die neuen Folgen spielen im vorhandenen Hafenbecken, damit sie bei beiden Wegen gültig bleiben.
