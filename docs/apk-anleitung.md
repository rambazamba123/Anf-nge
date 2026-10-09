# Skipper als Android-Datei (APK) zum Verschicken

Stand 09.10.2026 · gehört zu V18 in CLAUDE.md

**Vorweg:** Meist reicht der Link. Wer die Seite in Chrome öffnet, bekommt an Deck den Knopf „📲 App aufs Handy“ und hat danach ein Icon, genau wie bei einer normalen App. Die APK brauchst du nur, wenn du wirklich eine Datei verschicken willst.

## So baust du die APK (etwa 15 Minuten, kostenlos)
1. Öffne **https://www.pwabuilder.com** am Computer.
2. Gib die Adresse der App ein, z. B. `https://rambazamba123.github.io/Anf-nge/`. Nimm die Adresse, unter der die App bei dir läuft. Tippe auf **Start**.
3. PWABuilder prüft die App. Grüne Häkchen bei Manifest und Service Worker sind gut, Warnungen zu Kleinigkeiten kannst du ignorieren.
4. Tippe auf **Package For Stores** und dann bei **Android** auf **Generate Package**.
5. In den Optionen:
   - **Package ID:** etwas Eindeutiges, z. B. `de.skipper.lernen`. Später nicht mehr ändern.
   - **App name:** Skipper.
   - **Signing key:** „Create new“. Die Datei `signing.keystore` und die Passwörter aus der heruntergeladenen ZIP **gut aufheben**. Ohne sie kannst du später keine neue APK bauen, die sich über die alte installieren lässt.
6. **Download** drücken. In der ZIP liegt eine `.apk`-Datei zum Verschicken. Die `.aab`-Datei wäre für den Play Store.

## Was die Empfänger tun müssen
- Die APK öffnen. Android fragt, ob Installationen „aus unbekannten Quellen“ erlaubt werden sollen. Einmal erlauben, dann installieren.
- Danach liegt Skipper wie jede App auf dem Handy.

## Gut zu wissen
- **Updates:** Die APK lädt die App von deiner Adresse. Alles, was wir ändern, kommt also automatisch an. Eine neue APK brauchst du nur, wenn sich Name oder Icon ändern sollen.
- **Browserleiste:** Bei Apps auf einer GitHub-Pages-Unterseite (`…github.io/Anf-nge/`) zeigt die APK oben oft eine kleine Adressleiste. Ganz weg geht sie nur, wenn die Datei `.well-known/assetlinks.json` auf der Hauptadresse liegt (`…github.io/.well-known/`), also in einem eigenen Repository `rambazamba123.github.io`. Das richte ich auf Wunsch ein.
- **iPhone:** Für iPhones gibt es keine Datei zum Verschicken. Dort öffnet man den Link in Safari und wählt „Teilen → Zum Home-Bildschirm“.
