# Dialog-Regeln: So redet die Crew wie echte Menschen (Entwurf, 03.11.2026)

> **Anlass:** Der Nutzer fand das Gespräch in Folge 1 „sehr unnatürlich“. Hier steht, was die Recherche dazu sagt, und als Regeln, nach denen ich ab jetzt schreibe. Zuerst angewendet in Folge 7 (3D-Test, `data/welt-folgen.json`, id `tag07`).
> **Güte der Quellen:** Es gibt dazu keine Studie, nur Erfahrungen aus Foren (Reddit), Blogs und Handbüchern für Spiele-Autoren. Die Tipps decken sich aber weitgehend. Quellen am Ende.

## 1. Was die Recherche sagt
- **„Klingt natürlich“ allein hilft nicht.** Man muss die Muster benennen, die man nicht will: zu förmlich, zu poetisch, zu ordentlich, jeder Satz vollständig.
- **Echte Menschen antworten nicht sauber.** Sie fallen sich ins Wort, brechen Sätze ab, antworten auf etwas anderes, als gefragt war, und wechseln das Thema.
- **Subtext:** Gefühle werden selten ausgesprochen. Wer stolz ist, sagt nicht „Ich bin stolz“, sondern brummt etwas Knappes.
- **Kein runder Schluss:** Endet eine Figur mit einem klugen Satz, kommt sofort eine Gegenrede, ein Augenrollen oder ein Themawechsel.
- **Kurze, gemischte Sätze und Umgangssprache:** „is“, „nich“, „'n“, „haste“. KI vermeidet so etwas von selbst und muss ausdrücklich darum gebeten werden.
- **Jede Figur hat ihre eigene Sprechweise.** Man soll am Satz erkennen, wer spricht, auch ohne Namen.
- **Spiele:** Antwortknöpfe sollen sich in der Haltung unterscheiden (frech, ehrlich, unsicher), nicht nur im Wortlaut. Jede Wahl braucht eine eigene, passende Reaktion. Scheinwahlen funktionieren, wenn die Ausrede glaubwürdig ist.
- **Laut-Lese-Probe:** Jede Szene einmal laut lesen, was holpert, umschreiben. Das gilt besonders, weil die Sätze später gesprochen werden.

## 2. Regeln für unsere Folgen
1. **Ein Satz, eine Absicht:** Jeder Satz tut etwas: fragen, necken, ablehnen, warnen, angeben. Kein Satz ist nur zum Informieren da.
2. **Wissen kommt als Antwort:** Erklärt wird, weil jemand fragt, etwas falsch macht oder streitet. Nie als Vortrag.
3. **Aber: Aufgaben werden klar erklärt.** (Nutzer, 03.11.2026) Bevor du etwas tun musst, sagt die Crew ausdrücklich: was das ist, warum, und was du jetzt tust. Nichts muss man sich aus dem Zusammenhang erschließen. Danach wird gesagt, was passiert ist und warum.
4. **Unterbrechen erlaubt:** Höchstens jeder vierte Satz darf abbrechen („Ich wollt grad …“ – „Weiß ich.“).
5. **Kein Echo der Frage:** Auf „Wann ist man in Fahrt?“ antwortet niemand mit „Man ist in Fahrt, wenn …“. Erst kommt eine Reaktion („Wieso fragst du mich das?“), dann die Sache.
6. **Sprechweisen:**
   - **Hinnerk:** höchstens etwa acht Wörter am Stück, Platt-Einsprengsel („nich“, „dat“, „Schiet“), lobt nie direkt.
   - **Smilla:** schnell, fragt zurück, frotzelt, kölsche Färbung selten („Jeck“), erklärt gern, wird dabei unterbrochen.
   - **Klabauter:** ein bis drei Wörter, doppelt, oft im falschen Moment.
   - **Gäste:** eigene Marotte, zum Beispiel sagt die Hafenmeisterin nie „bitte“.
7. **Necken in beide Richtungen:** Die Crew zieht dich auf, aber auch sich gegenseitig. Etwa jeder fünfte Satz ist ein kleiner Seitenhieb.
8. **Antwortknöpfe:** 2–3 Knöpfe in deinen Worten, unterscheidbar in der Haltung. Jede Reaktion passt genau zum Knopf (alle Varianten werden vertont).
9. **Scheinwahl:** Etwa zwei je Folge. Die „falsche“ Wahl bekommt eine glaubwürdige Ausrede, die selbst etwas lehrt (flach, Strom, Sperrgebiet).
10. **Gäste sind Personen:** Wer spricht, ist sichtbar da: auf dem Steg in 3D oder als Figur in der Kajüte.
11. **Laut lesen:** Jede Szene einmal laut gelesen, bevor sie ins Repo kommt.

## 2b. Zweite Recherche (03.11.2026): Hersteller und Foren
**Was sich durchsetzt** (mehrere Quellen unabhängig voneinander):
- **Beispiele schlagen Beschreibungen.**
  - Anthropic empfiehlt 3–5 gut gewählte Beispiele, die dem echten Fall nahekommen und sich untereinander unterscheiden, damit die KI kein ungewolltes Muster kopiert.
  - Für Dialoge heißt das: eine kleine **Beispiel-Bibliothek** mit 3–5 kurzen Szenen je Figurenpaar, die genau so klingen, wie wir es wollen. Sie kommt bei jeder neuen Folge in die Anfrage.
- **Sagen, was man will, und warum.**
  - Anthropic rät, zu sagen, was die KI tun soll, statt nur, was sie lassen soll. Außerdem soll man den Grund nennen (zum Beispiel: „Die Sätze werden später gesprochen, deshalb Umgangssprache“).
  - Der Stil der Anfrage färbt auf das Ergebnis ab. Wer locker fragt, bekommt lockerere Dialoge.
- **Eigene Sprechweise je Figur, sonst klingen alle gleich.**
  - In r/WritingWithAI wird beschrieben, dass eine KI eine „Standardstimme“ hat, die jede Figur übernimmt, wenn man nichts dagegen tut.
  - **Test:** Namen abdecken. Erkennt man noch, wer spricht? Dazu gehört ein Sprech-Steckbrief je Figur mit Lieblingswörtern, Satzlänge und verbotenen Wörtern.
- **Flicken statt neu würfeln.** Aus mehreren Fassungen die besten Zeilen nehmen, zusammensetzen und die KI nur noch gezielt nacharbeiten lassen. Rückmeldung konkret formulieren („Smilla klingt hier zu nett, mehr Spott, gleiche Aussage“).
- **Laut lesen** bleibt Pflicht, weil alles gesprochen wird.
- **ElevenLabs** (für die Vertonung):
  - Die Stimme muss schon zur Sprechweise passen; ein Audio-Tag rettet keine falsche Stimme.
  - Satzzeichen und klare Gefühlslage im Text steuern die Betonung stark. Tags wie [seufzt] stehen im Satz der Figur, die sie betrifft.
  - Sehr kurze Texte klingen eher uneinheitlich, deshalb lieber mehrere Sätze am Stück erzeugen. Bei Text to Dialogue höchstens etwa 2.000 Zeichen je Anfrage.
  - Für ausdrucksstarke Tags die Stabilität „Creative“ oder „Natural“ wählen.
  - Aktuell empfiehlt ElevenLabs Eleven v4 für Dialoge.
- **Für unsere Folgen neu:**
  - Beispiel-Bibliothek `podcast/dialog-beispiele.md`, wird angelegt, sobald du die Regeln freigegeben hast.
  - Sprech-Steckbrief je Figur in `podcast/figuren.md`.
  - Namen-abdecken-Test vor jeder Folge.

## 3. Vorlage, wenn eine KI Dialoge schreibt
> (Davor 3–5 Beispielszenen aus der Beispiel-Bibliothek in `<examples>`.) Schreib die Szene als Gespräch unter Leuten, die sich gut kennen und sich gern aufziehen. Die Sätze werden später von Stimmen gesprochen, deshalb Umgangssprache und kurze Sätze. Keine vollständigen Lehrbuchsätze. Mischt kurze und lange Sätze, nutzt Umgangssprache („is“, „nich“, „'n“). Figuren unterbrechen sich, antworten schief und sagen Gefühle nicht direkt. Keine Szene endet mit einem klugen Schlusssatz. Hinnerk spricht höchstens acht Wörter am Stück und lobt nie direkt; Smilla ist schnell und frotzelt; Klabauter sagt ein bis drei Wörter doppelt. Fachwissen kommt nur als Antwort auf eine Frage oder einen Fehler, aber Aufgaben für den Spieler werden klar und vollständig erklärt. Lies die Szene am Ende laut und schreib um, was holpert.

## Quellen
- Anthropic: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) (Beispiele, Begründung, positiv formulieren, Stil der Anfrage)
- ElevenLabs: [Prompting Eleven v3](https://elevenlabs.io/docs/best-practices/prompting), [Text to Dialogue](https://elevenlabs.io/docs/capabilities/text-to-dialogue) (nur über die Suche gelesen, die Seite selbst war aus der Cloud nicht erreichbar)
- Foren: [r/WritingWithAI, realistische Dialoge](https://redlib.ssps.io/r/WritingWithAI/comments/1lbx7pq/can_ai_help_with_writing_realistic_dialogue_any), [Writer's AI Companion: Dialogue](https://thewritersaicompanion.substack.com/p/crafting-engaging-dialogue-with-ai?r=2evdyf)
- OpenAI und andere: nur Sekundärquellen gefunden, z. B. [DataCamp zu Few-Shot](https://www.datacamp.com/tutorial/few-shot-prompting) (2–5 Beispiele)
- Reddit (Spiegel), Nutzer zu natürlichen Dialogen mit KI: [r/PromptEngineering](https://reddit.birdcat.cafe/r/PromptEngineering/comments/1kd9sh9/prompting_styles_that_lead_to_more_humanlike), [Snapshot 1](https://reddit.sentinel-team.org/posts/1tba8ea/snapshots/2026-05-16T00%3A35%3A41.464211Z), [r/WritingWithAI](https://lr.eu.psf.lt/r/WritingWithAI/s/DPvFuo2VZ9)
- Sprachausgabe: [LMNT, Prompt engineering](https://docs.lmnt.com/prompt-engineering/llm-prompting) (Umgangssprache, Zögern, laut lesen)
- Subtext und runde Schlüsse: [The „AI Dialogue“ Discovery](https://danguru.substack.com/p/the-ai-dialogue-discovery), [AI dialogue writing tips](https://ai-tools-ai-novel-writing-guide.pages.dev/tools/ai-dialogue-writing-tips), [naturalistic dialogue](https://jxnl.co/writing/2024/08/30/naturalistic-dialogue-ai/)
- Spiele mit Antwortknöpfen: [Branching conversation systems, key principles](https://www.gamedeveloper.com/design/branching-conversation-systems-and-the-working-writer-part-4-key-principles), [How to write dialogue trees](https://www.gameanalytics.com/blog/how-to-write-perfect-dialogue-trees-for-games)
