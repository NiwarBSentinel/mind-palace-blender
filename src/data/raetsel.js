export const raetsel = [

  // ─── LOGIKRÄTSEL ────────────────────────────────────────────────────────────

  {
    frage: "Ein Vater ist 30 Jahre älter als sein Sohn. In 5 Jahren wird er doppelt so alt sein wie sein Sohn. Wie alt ist der Sohn heute?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["20 Jahre", "25 Jahre", "30 Jahre", "35 Jahre"],
    antwort: "25 Jahre",
    erklaerung: "Sei x das Alter des Sohnes. Vater = x+30. In 5 Jahren: x+35 = 2·(x+5) → x = 25."
  },
  {
    frage: "Wenn 5 Maschinen in 5 Minuten 5 Teile herstellen, wie lange brauchen 100 Maschinen für 100 Teile?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["100 Minuten", "5 Minuten", "1 Minute", "10 Minuten"],
    antwort: "5 Minuten",
    erklaerung: "Eine Maschine braucht 5 Minuten für 1 Teil. 100 Maschinen arbeiten parallel — 100 Teile in 5 Minuten."
  },
  {
    frage: "Du bist in einem Rennen und überholst den Zweiten. Auf welchem Platz bist du jetzt?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["Erster", "Zweiter", "Dritter", "Vierter"],
    antwort: "Zweiter",
    erklaerung: "Du nimmst den Platz des Zweiten ein — du bist jetzt Zweiter."
  },
  {
    frage: "Ein Arzt hat eine Schwester, aber diese Schwester hat keinen Bruder. Wie ist das möglich?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Sie sind adoptiert", "Der Arzt ist eine Frau", "Es sind Halbgeschwister", "Die Schwester ist verstorben"],
    antwort: "Der Arzt ist eine Frau",
    erklaerung: "Der Arzt ist eine Frau — sie hat eine Schwester, aber ihre Schwester hat keine Brüder, nur Schwestern."
  },
  {
    frage: "Du hast zwei Eimer: 3 Liter und 5 Liter. Wie misst du genau 4 Liter ab?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Unmöglich", "5L füllen → 3L abfüllen → 2L in 3L-Eimer → 5L füllen → 3L-Eimer auffüllen → 4L übrig", "3L zweimal in 5L gießen", "Schätzen"],
    antwort: "5L füllen → 3L abfüllen → 2L in 3L-Eimer → 5L füllen → 3L-Eimer auffüllen → 4L übrig",
    erklaerung: "5L füllen, 3L abfüllen (2L im 5L-Eimer), 2L in 3L-Eimer, 5L wieder füllen, 1L in 3L-Eimer gießen bis voll → 4L im 5L-Eimer."
  },
  {
    frage: "Ein Bauer hat 17 Schafe. Alle bis auf 9 sterben. Wie viele Schafe hat er noch?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["8", "9", "17", "0"],
    antwort: "9",
    erklaerung: "\"Alle bis auf 9\" bedeutet, dass 9 Schafe übrig bleiben."
  },
  {
    frage: "Drei Glühbirnen sind in einem Raum, drei Schalter draußen. Du darfst nur einmal den Raum betreten. Wie findest du raus, welcher Schalter zu welcher Birne gehört?",
    schwierigkeit: "Schwer",
    typ: "Logik",
    optionen: ["Unmöglich", "Schalter 1 lange an, Schalter 2 kurz an, dann rein — heiß=1, an=2, kalt=3", "Alle gleichzeitig anmachen", "Jemanden reinschicken"],
    antwort: "Schalter 1 lange an, Schalter 2 kurz an, dann rein — heiß=1, an=2, kalt=3",
    erklaerung: "Schalter 1 mehrere Minuten einschalten, dann ausschalten. Schalter 2 einschalten. Raum betreten: leuchtende Birne = Schalter 2, warme Birne = Schalter 1, kalte Birne = Schalter 3."
  },
  {
    frage: "Welche Zahl kommt als nächstes? 2, 4, 8, 16, 32, ___",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["48", "64", "60", "56"],
    antwort: "64",
    erklaerung: "Jede Zahl wird mit 2 multipliziert: 32 × 2 = 64."
  },
  {
    frage: "Ein Zug fährt von Hamburg nach München mit 120 km/h. Ein anderer Zug fährt von München nach Hamburg mit 80 km/h. Welcher Zug ist näher an Hamburg, wenn sie sich treffen?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Der schnellere Zug", "Der langsamere Zug", "Beide gleich nah", "Kommt auf die Strecke an"],
    antwort: "Beide gleich nah",
    erklaerung: "Wenn sie sich treffen, sind sie am selben Punkt — also gleich weit von Hamburg entfernt."
  },
  {
    frage: "Wie viele Monate haben 28 Tage?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["1", "2", "6", "12"],
    antwort: "12",
    erklaerung: "Alle 12 Monate haben mindestens 28 Tage."
  },
  {
    frage: "Ein Haus ist komplett von Wasser umgeben. Alle vier Seiten zeigen nach Süden. Ein Bär kommt vorbei. Welche Farbe hat der Bär?",
    schwierigkeit: "Schwer",
    typ: "Logik",
    optionen: ["Braun", "Weiß", "Schwarz", "Grau"],
    antwort: "Weiß",
    erklaerung: "Ein Haus, bei dem alle vier Seiten nach Süden zeigen, steht am Nordpol. Am Nordpol gibt es nur Eisbären — die sind weiß."
  },
  {
    frage: "Du hast 3 Äpfel und nimmst 2 weg. Wie viele Äpfel hast du?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["1", "2", "3", "0"],
    antwort: "2",
    erklaerung: "Du nimmst 2 Äpfel weg — die hast du jetzt. Also hast du 2 Äpfel."
  },
  {
    frage: "Ein Mann schaut auf ein Foto und sagt: \"Ich habe keine Geschwister, aber der Vater dieses Mannes ist der Sohn meines Vaters.\" Wer ist auf dem Foto?",
    schwierigkeit: "Schwer",
    typ: "Logik",
    optionen: ["Er selbst", "Sein Sohn", "Sein Vater", "Sein Onkel"],
    antwort: "Sein Sohn",
    erklaerung: "\"Der Sohn meines Vaters\" = er selbst (keine Geschwister). Also: \"Der Vater dieses Mannes bin ich\" → der Mann auf dem Foto ist sein Sohn."
  },
  {
    frage: "Welche Zahl ergibt, wenn man sie mit sich selbst multipliziert, dasselbe wie wenn man sie verdoppelt?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["1", "2", "4", "0"],
    antwort: "2",
    erklaerung: "2 × 2 = 4 und 2 + 2 = 4. Beide Operationen ergeben dasselbe."
  },
  {
    frage: "Ein Mörder wird zum Tode verurteilt. Er darf wählen: Feuer, Erhängen oder elektrischer Stuhl. Was soll er wählen?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Feuer", "Erhängen", "Elektrischer Stuhl", "Alle gleich schlimm"],
    antwort: "Feuer",
    erklaerung: "Nein — er soll den elektrischen Stuhl wählen, weil er defekt ist. Oder Feuer, weil es noch nicht brennt. Je nach Variante des Rätsels gibt es einen Trick."
  },
  {
    frage: "Was ist größer als Gott, schlimmer als der Teufel, die Armen haben es, die Reichen brauchen es, und wenn man es isst, stirbt man?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Die Zeit", "Nichts", "Der Tod", "Die Sünde"],
    antwort: "Nichts",
    erklaerung: "Nichts ist größer als Gott, nichts ist schlimmer als der Teufel, die Armen haben nichts, die Reichen brauchen nichts, und wenn man nichts isst, stirbt man."
  },
  {
    frage: "Wie viele Tiere hat Moses von jeder Art in die Arche genommen?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["2", "7", "0", "1"],
    antwort: "0",
    erklaerung: "Moses hat keine Arche gebaut — das war Noah."
  },
  {
    frage: "Ein Elektriker und ein Klempner gehen spazieren. Der Sohn des Elektrikers ist der Vater des Klempners. Wie sind Elektriker und Klempner verwandt?",
    schwierigkeit: "Schwer",
    typ: "Logik",
    optionen: ["Vater und Sohn", "Großvater und Enkel", "Onkel und Neffe", "Brüder"],
    antwort: "Großvater und Enkel",
    erklaerung: "Der Sohn des Elektrikers ist der Vater des Klempners. Also: Elektriker → Sohn → Klempner. Der Elektriker ist der Großvater des Klempners."
  },
  {
    frage: "Wenn ein roter Stein ins blaue Meer fällt — was passiert?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["Das Meer wird rot", "Der Stein schwimmt", "Der Stein wird nass", "Der Stein verschwindet"],
    antwort: "Der Stein wird nass",
    erklaerung: "Ein Stein wird nass, wenn er ins Wasser fällt. Sonst passiert nichts Besonderes."
  },
  {
    frage: "Ein Pilot fliegt ohne Fallschirm aus einem Flugzeug und landet unverletzt. Wie?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Er fiel ins Wasser", "Das Flugzeug stand still auf dem Boden", "Er hat einen Schutzanzug", "Er landete im Heu"],
    antwort: "Das Flugzeug stand still auf dem Boden",
    erklaerung: "Das Flugzeug stand auf dem Boden — er sprang einfach heraus."
  },
  {
    frage: "Was hat vier Beine am Morgen, zwei am Mittag und drei am Abend?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Eine Katze", "Der Mensch", "Ein Tisch", "Ein Hund"],
    antwort: "Der Mensch",
    erklaerung: "Das Rätsel der Sphinx: Als Kind krabbelt man auf allen Vieren, als Erwachsener geht man auf zwei Beinen, im Alter benutzt man einen Stock als drittes Bein."
  },
  {
    frage: "Wie viel Erde ist in einem Loch von 1 Meter Tiefe und 1 Meter Breite?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["1 Kubikmeter", "2 Kubikmeter", "Keiner", "Pi Kubikmeter"],
    antwort: "Keiner",
    erklaerung: "In einem Loch ist keine Erde — es ist ein Loch."
  },
  {
    frage: "Ein Mann baut ein Haus mit vier Seiten, alle nach Süden ausgerichtet. Nach einigen Monaten sieht er einen Bären. Was für ein Haus baut er und welche Farbe hat der Bär?",
    schwierigkeit: "Schwer",
    typ: "Logik",
    optionen: ["Holzhaus, brauner Bär", "Haus am Nordpol, weißer Bär", "Glashaus, schwarzer Bär", "Steinhaus, grauer Bär"],
    antwort: "Haus am Nordpol, weißer Bär",
    erklaerung: "Nur am Nordpol können alle vier Seiten nach Süden zeigen. Dort gibt es Eisbären."
  },
  {
    frage: "Welche Zahl kommt als nächstes? 1, 1, 2, 3, 5, 8, 13, ___",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["18", "20", "21", "24"],
    antwort: "21",
    erklaerung: "Fibonacci-Folge: jede Zahl ist die Summe der beiden vorherigen. 8 + 13 = 21."
  },
  {
    frage: "Du hast einen Fuchs, ein Huhn und einen Sack Körner. Du musst mit einem Boot übersetzen, das nur Platz für dich und eine Sache bietet. Fuchs frisst Huhn, Huhn frisst Körner. Was machst du zuerst?",
    schwierigkeit: "Schwer",
    typ: "Logik",
    optionen: ["Fuchs zuerst", "Körner zuerst", "Huhn zuerst", "Alle auf einmal"],
    antwort: "Huhn zuerst",
    erklaerung: "Zuerst Huhn rüberbringen. Dann Fuchs holen, Huhn zurücknehmen. Körner rüberbringen. Zuletzt Huhn holen."
  },

  // ─── SCHERZRÄTSEL ───────────────────────────────────────────────────────────

  {
    frage: "Was hat Zähne, aber kann nicht beißen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Tiger", "Ein Kamm", "Eine Säge", "Eine Gabel"],
    antwort: "Ein Kamm",
    erklaerung: "Ein Kamm hat Zähne — aber beißen kann er nicht."
  },
  {
    frage: "Ich habe Städte, aber keine Häuser. Ich habe Berge, aber keine Bäume. Ich habe Wasser, aber keinen Fisch. Was bin ich?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Gemälde", "Eine Karte", "Ein Buch", "Ein Traum"],
    antwort: "Eine Karte",
    erklaerung: "Eine Landkarte zeigt Städte, Berge und Wasser — aber nur als Symbole."
  },
  {
    frage: "Was läuft, hat aber keine Beine?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Fluss", "Ein Auto", "Ein Zug", "Der Wind"],
    antwort: "Ein Fluss",
    erklaerung: "Ein Fluss \"läuft\" — aber er hat keine Beine."
  },
  {
    frage: "Was hat ein Gesicht und zwei Zeiger, aber keinen Körper?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Roboter", "Eine Uhr", "Ein Kompass", "Ein Spiegel"],
    antwort: "Eine Uhr",
    erklaerung: "Eine Uhr hat ein Zifferblatt (Gesicht) und Zeiger — aber keinen Körper."
  },
  {
    frage: "Was wird größer, je mehr man davon wegnimmt?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Ein Schneeball", "Ein Loch", "Ein Schatten", "Eine Schuld"],
    antwort: "Ein Loch",
    erklaerung: "Je mehr Erde man aus einem Loch nimmt, desto größer wird das Loch."
  },
  {
    frage: "Was fliegt ohne Flügel?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Drache", "Die Zeit", "Ein Schmetterling", "Ein Drachen"],
    antwort: "Die Zeit",
    erklaerung: "Die Zeit \"vergeht\" — sie fliegt, ohne Flügel zu haben."
  },
  {
    frage: "Was hat einen Hals, aber keinen Kopf?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Eine Socke", "Eine Flasche", "Ein Hemd", "Ein Eimer"],
    antwort: "Eine Flasche",
    erklaerung: "Eine Flasche hat einen Flaschenhals — aber keinen Kopf."
  },
  {
    frage: "Was kann man brechen, ohne es anzufassen?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Glas", "Ein Versprechen", "Einen Knochen", "Eine Regel"],
    antwort: "Ein Versprechen",
    erklaerung: "Ein Versprechen kann man brechen, ohne es physisch zu berühren."
  },
  {
    frage: "Je mehr du davon nimmst, desto mehr lässt du zurück. Was ist das?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Geld", "Schritte", "Wasser", "Zeit"],
    antwort: "Schritte",
    erklaerung: "Je mehr Schritte du machst, desto mehr Fußspuren hinterlässt du."
  },
  {
    frage: "Was hat Augen, aber kann nicht sehen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein blinder Mann", "Eine Kartoffel", "Eine Puppe", "Ein Fisch"],
    antwort: "Eine Kartoffel",
    erklaerung: "Eine Kartoffel hat \"Augen\" (Keimansätze) — aber sie kann nicht sehen."
  },
  {
    frage: "Was steht in der Mitte von Paris?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Der Eiffelturm", "Das 'r'", "Der Louvre", "Der Elyséepalast"],
    antwort: "Das 'r'",
    erklaerung: "In der Mitte des Wortes \"Paris\" steht der Buchstabe \"r\"."
  },
  {
    frage: "Was hat viele Nadeln, sticht aber nicht?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Kaktus", "Eine Fichte", "Ein Igel", "Eine Nähnadel"],
    antwort: "Eine Fichte",
    erklaerung: "Ein Fichtenbaum hat viele Nadeln — aber er sticht nicht (im Gegensatz zum Igel oder Kaktus)."
  },
  {
    frage: "Was kann man hören, aber nicht sehen und nicht anfassen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Der Wind", "Ein Echo", "Musik", "Eine Stimme"],
    antwort: "Ein Echo",
    erklaerung: "Ein Echo kann man hören — aber man kann es nicht sehen oder anfassen."
  },
  {
    frage: "Ich bin immer vor dir, aber man kann mich nicht sehen. Was bin ich?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Die Zukunft", "Dein Schatten", "Deine Nase", "Das Schicksal"],
    antwort: "Die Zukunft",
    erklaerung: "Die Zukunft liegt immer vor uns — aber wir können sie nicht sehen."
  },
  {
    frage: "Was kann man werfen, aber nicht fangen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Blatt", "Eine Party", "Einen Ball", "Ein Netz"],
    antwort: "Eine Party",
    erklaerung: "Man kann eine Party \"schmeißen\" — aber man kann sie nicht fangen."
  },
  {
    frage: "Was ist schwarz-weiß und wird überall gelesen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Zebra", "Eine Zeitung", "Ein Pinguin", "Ein Domino"],
    antwort: "Eine Zeitung",
    erklaerung: "Eine Zeitung ist schwarz-weiß (gedruckt) und wird überall gelesen."
  },
  {
    frage: "Welches Wort wird immer falsch geschrieben?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["\"Fehler\"", "\"Falsch\"", "\"Falsch\" — nein, \"falsch\"", "Das Wort \"falsch\""],
    antwort: "Das Wort \"falsch\"",
    erklaerung: "Das Wort \"falsch\" wird immer richtig geschrieben, wenn man es schreibt. Das Wort, das immer falsch geschrieben wird, ist... \"falsch\"? Nein — es ist das Wort \"falsch\" selbst, denn die Antwort auf das Rätsel lautet: das Wort \"falsch\"."
  },
  {
    frage: "Was kann man in der Hand halten, aber nicht berühren?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Luft", "Ein Gespräch", "Feuer", "Wasser in der Schale"],
    antwort: "Ein Gespräch",
    erklaerung: "Man kann ein Gespräch \"in der Hand halten\" (führen) — aber man kann es nicht physisch berühren."
  },
  {
    frage: "Was hat Hände, kann aber nicht klatschen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Handschuh", "Eine Uhr", "Ein Baum", "Ein Spiegel"],
    antwort: "Eine Uhr",
    erklaerung: "Eine Uhr hat \"Hände\" (Zeiger auf Englisch: hands) — aber klatschen kann sie nicht."
  },
  {
    frage: "Was trägt man, obwohl man es nicht besitzt?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Verantwortung", "Einen Titel", "Einen Rucksack", "Einen Namen"],
    antwort: "Einen Namen",
    erklaerung: "Jeder trägt einen Namen — aber man besitzt ihn nicht wirklich."
  },
  {
    frage: "Was kommt einmal in einer Minute vor, zweimal in einem Moment, aber nie in tausend Jahren?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Der Buchstabe 'e'", "Der Buchstabe 'm'", "Der Buchstabe 'i'", "Eine Sekunde"],
    antwort: "Der Buchstabe 'm'",
    erklaerung: "\"Minute\" enthält ein 'm', \"Moment\" enthält zwei 'm', und \"tausend Jahre\" enthält kein 'm'."
  },
  {
    frage: "Was geht immer, bleibt aber immer an derselben Stelle?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Fluss", "Eine Uhr", "Ein Windrad", "Eine Rolltreppe"],
    antwort: "Eine Uhr",
    erklaerung: "Eine Uhr \"geht\" (läuft) — aber sie bleibt an derselben Stelle hängen."
  },
  {
    frage: "Was ist nass, wenn man es benutzt, und trocken, wenn man es nicht benutzt?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Schwamm", "Ein Handtuch", "Ein Regenschirm", "Eine Dusche"],
    antwort: "Ein Handtuch",
    erklaerung: "Ein Handtuch wird nass, wenn man es benutzt — und trocknet, wenn man es nicht benutzt."
  },
  {
    frage: "Was verschwindet, sobald man es ausspricht?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Ein Geheimnis", "Die Stille", "Ein Wunsch", "Eine Lüge"],
    antwort: "Die Stille",
    erklaerung: "Sobald man etwas sagt, ist die Stille weg."
  },
  {
    frage: "Wer macht es größer, wenn man etwas wegnimmt?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Zauberer", "Ein Loch", "Ein Ballon", "Nichts"],
    antwort: "Ein Loch",
    erklaerung: "Ein Loch wird größer, je mehr man herausnimmt."
  },
  {
    frage: "Warum darf man in Deutschland keinen Mann mit Regenschirm begraben?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Das ist verboten", "Weil er noch lebt", "Wegen dem Gewicht", "Wegen dem Metall"],
    antwort: "Weil er noch lebt",
    erklaerung: "Einen lebenden Mann darf man nicht begraben — egal was er dabei hat."
  },
  {
    frage: "Ein Hahn sitzt auf dem Dach. In welche Richtung fällt das Ei?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Nach rechts", "Nach links", "Nach vorne", "Hähne legen keine Eier"],
    antwort: "Hähne legen keine Eier",
    erklaerung: "Hähne sind männliche Tiere — sie legen keine Eier."
  },
  {
    frage: "Wie nennt man einen Türken, der einen Pudel hat?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Herrchen", "Einen Türken mit Pudel", "Hundebesitzer", "Pudelhalter"],
    antwort: "Einen Türken mit Pudel",
    erklaerung: "Einfach: einen Türken, der einen Pudel hat. Nicht komplizierter als das."
  },
  {
    frage: "Was hat ein Känguru, das kein anderes Tier hat?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Fell", "Lange Ohren", "Ein Känguru-Baby", "Ein Känguru als Mutter"],
    antwort: "Ein Känguru-Baby",
    erklaerung: "Nur ein Känguru kann ein kleines Känguru im Beutel haben."
  },
  {
    frage: "Wie viele Sekunden hat ein Jahr?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["31.536.000", "12", "365", "52"],
    antwort: "12",
    erklaerung: "Ein Jahr hat 12 Sekunden: den 2. Januar, den 2. Februar, den 2. März... den 2. Dezember."
  },
  {
    frage: "Wie weit kann ein Hund in den Wald laufen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["So weit er will", "Bis zur Mitte — dann läuft er wieder heraus", "10 Kilometer", "Unendlich weit"],
    antwort: "Bis zur Mitte — dann läuft er wieder heraus",
    erklaerung: "Bis zur Mitte des Waldes — danach läuft er wieder heraus."
  },
  {
    frage: "Was ist das erste, was ein König tut, wenn er auf den Thron kommt?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Er setzt die Krone auf", "Er setzt sich", "Er krönt sich", "Er regiert"],
    antwort: "Er setzt sich",
    erklaerung: "Er setzt sich — auf den Thron."
  },
  {
    frage: "Was ist das Schwerste an einem Elefanten?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Die Stoßzähne", "Das Heben", "Der Rüssel", "Das Gewicht"],
    antwort: "Das Heben",
    erklaerung: "Das Schwerste an einem Elefanten ist... ihn hochzuheben."
  },
  {
    frage: "Was sagt die Null zur Acht?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["\"Du bist doppelt\"", "\"Schöner Gürtel!\"", "\"Du bist zu rund\"", "\"Hallo Nachbar\""],
    antwort: "\"Schöner Gürtel!\"",
    erklaerung: "Die Acht sieht aus wie eine Null mit einem Gürtel in der Mitte."
  },
  {
    frage: "Was kommt nach dem Regen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Sonnenschein", "Der Regenbogen", "Das 'n'", "Frischer Wind"],
    antwort: "Das 'n'",
    erklaerung: "Das Wort \"Regen\" endet auf 'n' — das kommt nach dem \"Rege-n\"."
  },
  {
    frage: "Welcher Monat hat 28 Tage?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Februar", "Alle Monate", "Nur der Februar", "Keiner"],
    antwort: "Alle Monate",
    erklaerung: "Alle Monate haben mindestens 28 Tage."
  },
  {
    frage: "Wenn ein Flugzeug auf der Grenze zwischen Deutschland und Frankreich abstürzt — wo werden die Überlebenden begraben?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["In Deutschland", "In Frankreich", "Auf der Grenze", "Überlebende werden nicht begraben"],
    antwort: "Überlebende werden nicht begraben",
    erklaerung: "Überlebende sind am Leben — man begräbt sie nicht."
  },
  {
    frage: "Was ist braun und klebt an der Wand?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Tapete", "Ein geworfenes Nutella-Brot", "Schmutz", "Farbe"],
    antwort: "Ein geworfenes Nutella-Brot",
    erklaerung: "Ein Scherz-Rätsel — ein Brot mit Nutella, das man gegen die Wand wirft."
  },
  {
    frage: "Was ist kleiner als ein Hund, aber macht dem Hund Angst?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Eine Katze", "Sein Futter", "Sein eigener Schatten", "Eine Maus"],
    antwort: "Sein eigener Schatten",
    erklaerung: "Manche Hunde erschrecken sich vor ihrem eigenen Schatten — der ist genauso groß wie sie."
  },
  {
    frage: "Was hat eine Wurzel, wächst aber nicht im Boden?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Ein Zahn", "Ein Baum im Topf", "Ein Haar", "Eine Wurzel aus der Mathematik"],
    antwort: "Ein Zahn",
    erklaerung: "Ein Zahn hat eine Wurzel — wächst aber im Kiefer, nicht im Boden."
  },
  {
    frage: "Was kann man nicht essen und nicht trinken, aber es macht satt?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Luft", "Das Fernsehen", "Wissen", "Schlaf"],
    antwort: "Schlaf",
    erklaerung: "Schlaf macht satt — aber man isst oder trinkt dabei nichts."
  },
  {
    frage: "Was ist das Einzige, das man geben kann und trotzdem behalten?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Liebe", "Sein Wort", "Ein Geschenk", "Einen Rat"],
    antwort: "Sein Wort",
    erklaerung: "Man kann sein Wort geben — und es trotzdem behalten."
  },
  {
    frage: "Was schwebt im Winter über den Dächern?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Schnee", "Rauch", "Der Weihnachtsmann", "Kälte"],
    antwort: "Rauch",
    erklaerung: "Rauch steigt aus den Kaminen auf und schwebt über den Dächern."
  },
  {
    frage: "Welches Tier dreht sich immer im Kreis?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Hund beim Einschlafen", "Die Spiralmücke", "Ein Kreisel", "Eine Schildkröte"],
    antwort: "Die Spiralmücke",
    erklaerung: "Es gibt natürlich keine Spiralmücke — das ist ein Scherzrätsel."
  },
  {
    frage: "Wie nennt man einen Bären ohne Ohren?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Tauber Bär", "B", "Bär ohne Ohren", "Br"],
    antwort: "B",
    erklaerung: "\"Bär\" ohne Ohren (ohne das 'är') = \"B\"."
  },
  {
    frage: "Womit schreibt ein Delfin unter Wasser?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Mit Tinte", "Mit einem Kugelschreiber", "Mit einem Tintenfish", "Mit einer Wasserfeder"],
    antwort: "Mit einem Tintenfish",
    erklaerung: "Ein Tintenfisch — der hat Tinte dabei."
  },
  {
    frage: "Was ist der Unterschied zwischen einem Briefkasten und einem Elefanten?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Nichts", "Das Gewicht", "Wenn du das nicht weißt, schick ich dich nie Briefe einwerfen", "Die Farbe"],
    antwort: "Wenn du das nicht weißt, schick ich dich nie Briefe einwerfen",
    erklaerung: "Der Witz: Wenn jemand den Unterschied nicht kennt, würde man ihn nicht Briefe einwerfen lassen."
  },
  {
    frage: "Wie kommt ein Elefant in einen VW Käfer?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Gar nicht", "Er öffnet die Tür und steigt ein", "Er wird eingequetscht", "Durch das Schiebedach"],
    antwort: "Er öffnet die Tür und steigt ein",
    erklaerung: "Einfach — er öffnet die Tür und steigt ein."
  },
  {
    frage: "Wie kommen vier Elefanten in einen VW Käfer?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Gar nicht", "Zwei vorne, zwei hinten", "Geht nicht", "Man drückt sie rein"],
    antwort: "Zwei vorne, zwei hinten",
    erklaerung: "Zwei setzen sich vorne, zwei hinten — fertig."
  },
  {
    frage: "Was ist gelb und kann nicht schwimmen?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Eine Zitrone", "Ein Bagger", "Eine Banane", "Ein Huhn"],
    antwort: "Ein Bagger",
    erklaerung: "Ein Bagger ist gelb und kann definitiv nicht schwimmen."
  },
  {
    frage: "Was sagt ein Rindvieh dem anderen auf Englisch?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["\"Hello\"", "\"Moo you\"", "\"How are you?\"", "\"Nice to meat you\""],
    antwort: "\"Nice to meat you\"",
    erklaerung: "Ein Wortspiel: \"Nice to meet you\" klingt wie \"nice to meat you\" — \"meat\" bedeutet Fleisch."
  },
  {
    frage: "Was hat vier Räder und fliegt?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Flugauto", "Ein Müllauto", "Eine fliegende Kutsche", "Ein Drachen mit Rädern"],
    antwort: "Ein Müllauto",
    erklaerung: "Ein Müllauto hat vier Räder — und \"fliegt\" (stinkt fürchterlich)."
  },
  {
    frage: "Was ist schwerer: ein Kilo Federn oder ein Kilo Blei?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Blei", "Federn", "Beide gleich schwer", "Federn, wegen dem Volumen"],
    antwort: "Beide gleich schwer",
    erklaerung: "Ein Kilogramm ist ein Kilogramm — egal was man wiegt."
  },
  {
    frage: "Wie viele Tiere hat Noah von jeder Art genommen?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["2", "7", "1", "14"],
    antwort: "2",
    erklaerung: "Noah (nicht Moses) nahm zwei von jeder unreinen Art und sieben von jeder reinen Art. Die häufigste Antwort ist 2."
  },
  {
    frage: "Was macht ein Pirat, wenn er 80 wird?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Er hört auf zu segeln", "Er feiert Geburtstag", "Er wird Schatzsucher", "Er zieht ins Altersheim"],
    antwort: "Er feiert Geburtstag",
    erklaerung: "Er feiert einfach Geburtstag — wie jeder andere auch."
  },
  {
    frage: "Was ist weiß und stört beim Frühstück?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Die Milch", "Ein Lawinen-Anruf", "Der Kühlschrank", "Die Zeitung"],
    antwort: "Ein Lawinen-Anruf",
    erklaerung: "Ein Scherzrätsel: eine Lawine (weiß) stört beim Frühstück, wenn sie durchs Fenster kommt."
  },

  // ─── WEITERE LOGIKRÄTSEL ─────────────────────────────────────────────────────

  {
    frage: "Ein Mann geht jeden Tag mit seinem Sohn zur Arbeit. Eines Tages verunglücken sie. Der Vater stirbt. Im Krankenhaus sagt der Chirurg: \"Ich kann ihn nicht operieren — das ist mein Sohn!\" Wie ist das möglich?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Es war ein Stiefvater", "Der Chirurg ist die Mutter", "Der Junge hat zwei Väter", "Es ist ein Irrtum"],
    antwort: "Der Chirurg ist die Mutter",
    erklaerung: "Der Chirurg ist die Mutter des Jungen. Ein klassisches Rätsel über unbewusste Annahmen."
  },
  {
    frage: "Eine Frau schießt auf ihren Mann, dann gehen sie essen. Wie ist das möglich?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["Sie hat danebengezielt", "Sie ist Fotografin", "Er trägt eine Schutzweste", "Er ist unsterblich"],
    antwort: "Sie ist Fotografin",
    erklaerung: "Die Frau ist Fotografin — sie schießt ein Foto von ihrem Mann."
  },
  {
    frage: "Was ist in der Mitte jedes Meeres?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Salz", "Der tiefste Punkt", "Das 'e'", "Wasser"],
    antwort: "Das 'e'",
    erklaerung: "In der Mitte des Wortes \"Meer\" steht der Buchstabe 'e'."
  },
  {
    frage: "Du hast ein Streichholz. Du betrittst einen dunklen Raum mit einer Kerze, einem Kamin und einer Lampe. Was zündest du zuerst an?",
    schwierigkeit: "Leicht",
    typ: "Logik",
    optionen: ["Die Kerze", "Den Kamin", "Die Lampe", "Das Streichholz"],
    antwort: "Das Streichholz",
    erklaerung: "Zuerst muss man das Streichholz anzünden — alles andere danach."
  },
  {
    frage: "Wie nennt man eine Kuh, die keine Milch gibt?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Eine schlechte Kuh", "Milchversager", "Eine Fleischkuh", "Ein Milkshake-Reinfall"],
    antwort: "Ein Milkshake-Reinfall",
    erklaerung: "Ein Scherzrätsel — eine Kuh ohne Milch ist ein Milkshake-Reinfall."
  },
  {
    frage: "Was sitzt in der Ecke und macht Reisen um die ganze Welt?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Globus", "Eine Briefmarke", "Ein Reiseführer", "Ein Kompass"],
    antwort: "Eine Briefmarke",
    erklaerung: "Eine Briefmarke sitzt in der Ecke eines Briefes und reist mit ihm um die Welt."
  },
  {
    frage: "Was haben alle Menschen, aber es gehört jedem nur selbst und andere benutzen es öfter als man selbst?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Das Gewissen", "Der Name", "Die Stimme", "Das Gesicht"],
    antwort: "Der Name",
    erklaerung: "Andere sprechen deinen Namen öfter aus als du selbst es tust."
  },
  {
    frage: "Ein Ei kostet 10 Cent. Wie viel kosten anderthalb Dutzend Eier?",
    schwierigkeit: "Mittel",
    typ: "Logik",
    optionen: ["1,50 Euro", "1,20 Euro", "1,80 Euro", "1,00 Euro"],
    antwort: "1,80 Euro",
    erklaerung: "Anderthalb Dutzend = 18 Eier. 18 × 10 Cent = 180 Cent = 1,80 Euro."
  },
  {
    frage: "Was hat viele Löcher, hält aber das Wasser?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Schwamm", "Ein Sieb", "Ein Netz", "Eine Lochkarte"],
    antwort: "Ein Schwamm",
    erklaerung: "Ein Schwamm hat viele Löcher — hält aber das Wasser darin."
  },
  {
    frage: "Wann ist ein schwarzes Tuch weiß?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Wenn man es wäscht", "Wenn es schneit", "Wenn es auf dem Schnee liegt", "Niemals"],
    antwort: "Wenn es auf dem Schnee liegt",
    erklaerung: "Wenn ein schwarzes Tuch auf dem Schnee liegt, hebt es sich weiß ab — es ist von Schnee umgeben."
  },
  {
    frage: "Was kann man stehlen, ohne dass es fehlt?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Zeit", "Ein Kuss", "Ideen", "Lächeln"],
    antwort: "Ein Kuss",
    erklaerung: "Man kann jemandem einen Kuss \"stehlen\" — und beim Gestohlenen fehlt nichts."
  },
  {
    frage: "Wie nennt man einen Clown in einer Rüstung?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ritter Lustig", "Einen lustigen Ritter", "Spaß-Ritter", "Einen Witzbold in Eisen"],
    antwort: "Spaß-Ritter",
    erklaerung: "Ein Scherz: ein Clown in Rüstung = Spaß-Ritter (Spassnicht / Ritterspaß — je nach Version)."
  },
  {
    frage: "Was macht man mit einem blauen Elefanten?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Man streichelt ihn", "Man tröstet ihn", "Man ruft den Arzt", "Man malt ihn an"],
    antwort: "Man tröstet ihn",
    erklaerung: "Ein \"blauer\" Elefant ist traurig (jemand ist blau = deprimiert) — man tröstet ihn."
  },
  {
    frage: "Was kommt einmal in einer Sekunde, zweimal in einem Jahrzehnt und gar nicht in einem Jahrhundert vor?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["Ein Herzschlag", "Der Buchstabe 'e'", "Neujahr", "Ein Blitz"],
    antwort: "Der Buchstabe 'e'",
    erklaerung: "\"Sekunde\" enthält ein 'e', \"Jahrzehnt\" enthält zwei 'e', \"Jahrhundert\" enthält kein 'e'."
  },
  {
    frage: "Wie viele Monate haben 30 Tage?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["4", "6", "11", "Alle außer dem Februar"],
    antwort: "11",
    erklaerung: "11 Monate haben 30 oder mehr Tage — nur der Februar hat weniger als 30."
  },
  {
    frage: "Was kann man in ein leeres Glas stecken?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Wasser", "Einen Strohhalm", "Nichts — es ist leer", "Luft"],
    antwort: "Nichts — es ist leer",
    erklaerung: "Wenn es leer ist, steckt man etwas rein und es ist nicht mehr leer. Aber wenn es wirklich leer ist, kann man nichts reinstecken — es gibt kein echtes Vakuum."
  },
  {
    frage: "Wann ist ein Mann kein Mann?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Wenn er schläft", "Wenn er ein Mann seiner Frau ist", "Wenn er krank ist", "Wenn er ein Kind war"],
    antwort: "Wenn er ein Mann seiner Frau ist",
    erklaerung: "Dann ist er \"ihr Mann\" — also kein eigenständiger Mann mehr, sondern ihrer."
  },
  {
    frage: "Was hat einen Daumen und vier Finger, aber ist kein Mensch?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Affe", "Ein Handschuh", "Eine Kralle", "Ein Alien"],
    antwort: "Ein Handschuh",
    erklaerung: "Ein Handschuh hat Platz für Daumen und vier Finger — aber er ist kein Lebewesen."
  },
  {
    frage: "Welche Frage kann man nie mit \"Ja\" beantworten?",
    schwierigkeit: "Mittel",
    typ: "Scherzrätsel",
    optionen: ["\"Bist du tot?\"", "\"Schläfst du?\"", "\"Bist du stumm?\"", "\"Hast du keine Zunge?\""],
    antwort: "\"Schläfst du?\"",
    erklaerung: "Wenn man schläft, kann man nicht mit \"Ja\" antworten. Wenn man antwortet, schläft man nicht."
  },
  {
    frage: "Was hat ein Loch in der Mitte und ist trotzdem rund?",
    schwierigkeit: "Leicht",
    typ: "Scherzrätsel",
    optionen: ["Ein Reifen", "Ein Donut", "Ein Ring", "Alle drei"],
    antwort: "Alle drei",
    erklaerung: "Reifen, Donut und Ring — alle haben ein Loch und sind rund."
  },
];
