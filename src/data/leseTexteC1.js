// Goethe-Zertifikat C1 — Leseverstehen (statische Übungssätze)
//
// Jeder Übungssatz besteht aus 4 Teilen, die dem Prüfungsformat nachempfunden sind:
//   Teil 1 — Lückentext:   Text mit Lücken, je 3 Optionen (Wortschatz/Grammatik/Konnektoren)
//   Teil 2 — Multiple Choice: längerer Text + Verständnisfragen (je 3 Optionen)
//   Teil 3 — Zuordnung:    Personen mit Bedürfnissen zu Anzeigen/Angeboten zuordnen
//   Teil 4 — Meinungen:    Standpunkt einer Aussage erkennen (positiv/negativ/neutral)
//
// "richtig" / "loesung" speichert jeweils den Index (0-basiert) der korrekten Antwort.

export const LESEN_C1 = [
  {
    id: 'set1',
    titel: 'Übungssatz 1',
    thema: 'Arbeitswelt & Homeoffice',

    teil1: {
      anleitung:
        'Lesen Sie den Text und entscheiden Sie, welches Wort (a, b oder c) in jede Lücke passt.',
      // Der Text enthält Platzhalter {1} … {n}, die im UI durch die gewählte Option ersetzt werden.
      text:
        'Seit der Pandemie hat sich die Arbeitswelt grundlegend verändert. Das Homeoffice, das zuvor eher die {1} war, ist für viele zur Selbstverständlichkeit geworden. {2} die anfängliche Skepsis mancher Arbeitgeber zeigen heutige Studien, dass die Produktivität keineswegs {3}. Im Gegenteil: Wer die Fahrt ins Büro spart, gewinnt Zeit, {4} sich häufig in größeres Engagement übersetzt. Allerdings darf man die Schattenseiten nicht {5}. Die Grenze zwischen Beruf und Privatleben verschwimmt, und nicht selten {6} Beschäftigte über das Gefühl, ständig erreichbar sein zu müssen. Unternehmen sind daher gut beraten, klare Regeln {7}, anstatt die Verantwortung allein den Mitarbeitenden zu {8}.',
      luecken: [
        { nr: 1, optionen: ['Ausnahme', 'Gewohnheit', 'Mehrheit'], richtig: 0 },
        { nr: 2, optionen: ['Wegen', 'Trotz', 'Dank'], richtig: 1 },
        { nr: 3, optionen: ['gelitten hat', 'gestiegen ist', 'verschwunden ist'], richtig: 0 },
        { nr: 4, optionen: ['das', 'was', 'wie'], richtig: 1 },
        { nr: 5, optionen: ['übersehen', 'übertreiben', 'überholen'], richtig: 0 },
        { nr: 6, optionen: ['freuen', 'klagen', 'staunen'], richtig: 1 },
        { nr: 7, optionen: ['aufzustellen', 'einzuhalten', 'abzuschaffen'], richtig: 0 },
        { nr: 8, optionen: ['überlassen', 'verbieten', 'erlauben'], richtig: 0 },
      ],
    },

    teil2: {
      anleitung:
        'Lesen Sie den Text und beantworten Sie die Fragen. Wählen Sie jeweils die richtige Antwort (a, b oder c).',
      text:
        'Die Vier-Tage-Woche ist längst kein utopisches Konzept mehr. In mehreren europäischen Ländern haben Unternehmen sie erprobt – mit bemerkenswerten Ergebnissen. In einem groß angelegten britischen Pilotprojekt nahmen rund sechzig Firmen teil. Die Beschäftigten arbeiteten einen Tag weniger pro Woche, erhielten aber den vollen Lohn. Erwartungsgemäß befürchteten viele Geschäftsführer Einbußen bei der Leistung.\n\nDoch die Zahlen sprachen eine andere Sprache. Der Umsatz blieb in den meisten Betrieben stabil, in einigen stieg er sogar leicht an. Vor allem aber sank die Zahl der Krankmeldungen deutlich, und die Mitarbeiterzufriedenheit erreichte Höchstwerte. Nach Abschluss des Versuchs entschied sich die überwältigende Mehrheit der teilnehmenden Unternehmen, das Modell dauerhaft beizubehalten.\n\nKritiker geben allerdings zu bedenken, dass sich die Erkenntnisse nicht ohne Weiteres auf alle Branchen übertragen lassen. Wo Schichtbetrieb oder ständige Kundenpräsenz erforderlich sind – etwa in Krankenhäusern oder im Einzelhandel – stößt das Modell an praktische Grenzen. Befürworter halten dem entgegen, dass gerade in solchen Bereichen flexible Lösungen den größten Nutzen bringen könnten, sofern man bereit sei, neue Wege zu gehen.',
      fragen: [
        {
          frage: 'Was war die zentrale Bedingung im britischen Pilotprojekt?',
          optionen: [
            'Die Beschäftigten arbeiteten weniger, bekamen aber weiterhin den vollen Lohn.',
            'Die Beschäftigten erhielten für den freien Tag eine Lohnkürzung.',
            'Die Beschäftigten mussten die fehlende Zeit am Wochenende nachholen.',
          ],
          richtig: 0,
        },
        {
          frage: 'Wie entwickelte sich die Leistung der Unternehmen?',
          optionen: [
            'Der Umsatz brach in den meisten Betrieben ein.',
            'Der Umsatz blieb überwiegend stabil oder stieg sogar leicht.',
            'Der Umsatz schwankte unvorhersehbar.',
          ],
          richtig: 1,
        },
        {
          frage: 'Wie reagierten die teilnehmenden Firmen nach dem Versuch?',
          optionen: [
            'Die meisten kehrten zur Fünf-Tage-Woche zurück.',
            'Nur wenige Firmen behielten das Modell bei.',
            'Die große Mehrheit behielt das Modell dauerhaft bei.',
          ],
          richtig: 2,
        },
        {
          frage: 'Welchen Einwand bringen Kritiker vor?',
          optionen: [
            'Das Modell sei für die Beschäftigten zu anstrengend.',
            'Die Ergebnisse ließen sich nicht auf jede Branche übertragen.',
            'Die Mitarbeiterzufriedenheit sei in Wahrheit gesunken.',
          ],
          richtig: 1,
        },
        {
          frage: 'Wie argumentieren die Befürworter gegenüber den Kritikern?',
          optionen: [
            'Gerade in schwierigen Branchen könne flexibles Arbeiten besonders nützen.',
            'Die genannten Branchen seien ohnehin nicht relevant.',
            'Man solle das Modell nur in Krankenhäusern einführen.',
          ],
          richtig: 0,
        },
      ],
    },

    teil3: {
      anleitung:
        'Vier Personen suchen ein passendes Weiterbildungsangebot. Ordnen Sie jeder Person die am besten passende Anzeige zu. Eine Anzeige bleibt übrig.',
      personen: [
        {
          id: 'a',
          name: 'Person A',
          beschreibung:
            'Eine Berufstätige möchte sich neben dem Job abends weiterbilden und sucht einen Kurs, der sich flexibel in ihren Alltag einfügt und ortsunabhängig ist.',
        },
        {
          id: 'b',
          name: 'Person B',
          beschreibung:
            'Ein angehender Gründer braucht praxisnahes Wissen über Finanzen und Steuern und legt Wert auf den direkten Austausch mit erfahrenen Unternehmern.',
        },
        {
          id: 'c',
          name: 'Person C',
          beschreibung:
            'Eine Akademikerin will ihre Englischkenntnisse für internationale Verhandlungen verbessern und bevorzugt ein intensives Format in kleiner Gruppe.',
        },
        {
          id: 'd',
          name: 'Person D',
          beschreibung:
            'Ein Rentner interessiert sich aus reiner Neugier für Kunstgeschichte und sucht ein entspanntes Angebot ohne Prüfungsdruck, gern tagsüber.',
        },
      ],
      anzeigen: [
        {
          id: 0,
          titel: 'Online-Abendakademie',
          text:
            'Berufsbegleitende Kurse, die Sie bequem von zu Hause aus belegen – jeden Abend live per Videokonferenz. Alle Aufzeichnungen stehen dauerhaft zur Verfügung.',
        },
        {
          id: 1,
          titel: 'Gründer-Werkstatt',
          text:
            'Kompaktseminar zu Buchhaltung, Steuern und Finanzierung. Erfahrene Unternehmerinnen und Unternehmer beantworten Ihre Fragen im persönlichen Gespräch.',
        },
        {
          id: 2,
          titel: 'Business English Intensiv',
          text:
            'Verhandlungssicheres Englisch in Kleingruppen von maximal sechs Personen. Praxisnahe Rollenspiele und individuelles Feedback an einem Wochenende.',
        },
        {
          id: 3,
          titel: 'Kunst am Vormittag',
          text:
            'Eine entspannte Reise durch die Epochen der Malerei – ganz ohne Prüfungen. Donnerstagvormittags bei Kaffee und anregenden Gesprächen.',
        },
        {
          id: 4,
          titel: 'Programmieren für Profis',
          text:
            'Vertiefungskurs für erfahrene Entwickler. Ganztägige Präsenzschulung mit anspruchsvollem Abschlusstest und Zertifikat.',
        },
      ],
      // Person-ID → richtige Anzeigen-ID
      loesung: { a: 0, b: 1, c: 2, d: 3 },
    },

    teil4: {
      anleitung:
        'Lesen Sie die Leserkommentare zum Thema „Dienstreisen abschaffen?“. Äußert sich die Person eher positiv, negativ oder neutral gegenüber Dienstreisen?',
      aussagen: [
        {
          person: 'Markus, 41',
          text:
            'Nichts ersetzt das persönliche Treffen. Verträge, die ich am Verhandlungstisch geschlossen habe, wären per Video nie zustande gekommen. Dienstreisen sind und bleiben unverzichtbar.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
        {
          person: 'Lena, 29',
          text:
            'Ständig im Flugzeug, nie zu Hause, dazu die enorme Klimabelastung – ich verstehe nicht, warum man dafür nicht längst auf Videokonferenzen umgestiegen ist. Für mich pure Zeit- und Ressourcenverschwendung.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 1,
        },
        {
          person: 'Dr. Hoffmann',
          text:
            'Ob Dienstreisen sinnvoll sind, hängt stark vom Einzelfall ab. Manche Termine erfordern Präsenz, andere lassen sich problemlos digital erledigen. Pauschale Urteile führen hier nicht weiter.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 2,
        },
        {
          person: 'Sandra, 36',
          text:
            'Ehrlich gesagt freue ich mich auf jede Reise. Neue Städte, interessante Kollegen, ein Tapetenwechsel – das motiviert mich ungemein und bringt frische Ideen für die Arbeit.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
      ],
    },

    teil5: {
      anleitung:
        'Lesen Sie den literarischen Text und beantworten Sie die Fragen zu Inhalt, Stimmung und Stil.',
      text:
        'Die Dämmerung senkte sich über die stille Landschaft, und mit ihr kam jene wehmütige Gewissheit, dass auch dieser Tag nun unwiederbringlich verloren war. Die Bäume, die am Morgen noch in vollem Saft gestanden hatten, verschwammen zu bloßen Schatten ihrer selbst. Ein letzter Vogel erhob seine Stimme, als wollte er gegen das nahende Schweigen aufbegehren, doch verklang sein Lied ungehört im weiten Rund. Der alte Mann am Fenster sah dem Verlöschen des Lichts entgegen, ohne Bitterkeit, ja beinahe mit Dankbarkeit – denn wer das Vergehen zu lieben gelernt hat, den schreckt kein Abend mehr.',
      fragen: [
        {
          frage: 'Welche Stimmung prägt den Text vor allem?',
          optionen: ['Ausgelassene Heiterkeit', 'Wehmütige Gelassenheit', 'Panische Angst'],
          richtig: 1,
        },
        {
          frage: 'Wofür steht die Dämmerung im Text sinnbildlich?',
          optionen: ['Für den Beginn von etwas Neuem', 'Für das Vergehen und das Ende', 'Für unbeschwerte Lebensfreude'],
          richtig: 1,
        },
        {
          frage: 'Was bedeutet die Wendung „gegen das nahende Schweigen aufbegehren“?',
          optionen: ['Sich gegen das Verstummen aufzulehnen', 'Endlich Ruhe zu finden', 'Aus Freude laut zu singen'],
          richtig: 0,
        },
        {
          frage: 'Wie ist die Haltung des alten Mannes gegenüber dem Vergehen zu verstehen?',
          optionen: ['Er fürchtet sich und wehrt sich dagegen.', 'Er nimmt es versöhnt, fast dankbar an.', 'Es lässt ihn völlig gleichgültig.'],
          richtig: 1,
        },
      ],
    },
  },

  {
    id: 'set2',
    titel: 'Übungssatz 2',
    thema: 'Stadt, Umwelt & Mobilität',

    teil1: {
      anleitung:
        'Lesen Sie den Text und entscheiden Sie, welches Wort (a, b oder c) in jede Lücke passt.',
      text:
        'Immer mehr Städte erklären dem Autoverkehr den Kampf. Was zunächst auf Widerstand stieß, findet {1} wachsenden Zuspruch. Denn breite Straßen, die einst als Zeichen des Fortschritts {2}, gelten heute vielen als Lärmquelle und Platzverschwendung. Stattdessen entstehen Radwege und Grünflächen, {3} die Aufenthaltsqualität spürbar erhöhen. Kritiker {4} ein, dass der Handel unter der Sperrung der Innenstädte leide. Untersuchungen widerlegen diese Sorge jedoch weitgehend: Wo Menschen sich gern aufhalten, wird {5} auch mehr eingekauft. {6} bleibt die Frage, wie ältere oder mobilitätseingeschränkte Menschen weiterhin gut ans Ziel kommen. Eine durchdachte Verkehrsplanung muss diese Gruppen {7} berücksichtigen, damit die autofreie Stadt nicht zum Privileg weniger {8}.',
      luecken: [
        { nr: 1, optionen: ['kaum', 'zunehmend', 'niemals'], richtig: 1 },
        { nr: 2, optionen: ['galten', 'gelten', 'gölten'], richtig: 0 },
        { nr: 3, optionen: ['die', 'denen', 'deren'], richtig: 0 },
        { nr: 4, optionen: ['wenden', 'werfen', 'wandeln'], richtig: 0 },
        { nr: 5, optionen: ['kaum', 'letztlich', 'angeblich'], richtig: 1 },
        { nr: 6, optionen: ['Deshalb', 'Dennoch', 'Demnach'], richtig: 1 },
        { nr: 7, optionen: ['ausdrücklich', 'zufällig', 'widerwillig'], richtig: 0 },
        { nr: 8, optionen: ['wird', 'werde', 'würde'], richtig: 0 },
      ],
    },

    teil2: {
      anleitung:
        'Lesen Sie den Text und beantworten Sie die Fragen. Wählen Sie jeweils die richtige Antwort (a, b oder c).',
      text:
        'Urban Gardening – das gemeinschaftliche Gärtnern in der Stadt – hat sich von einer Nischenbewegung zu einem festen Bestandteil vieler Metropolen entwickelt. Auf Brachflächen, Dächern und in Hinterhöfen pflanzen Anwohnerinnen und Anwohner Gemüse, Kräuter und Blumen. Was als Reaktion auf fehlende Grünflächen begann, erfüllt heute weit mehr als nur ökologische Zwecke.\n\nFachleute betonen vor allem die soziale Dimension. In den Gärten treffen Menschen unterschiedlichster Herkunft und Generationen aufeinander, die sich sonst kaum begegnen würden. Gemeinsames Säen und Ernten schafft Kontakte und stärkt das Zusammengehörigkeitsgefühl in einem Viertel. Studien zeigen zudem, dass die Beteiligten ihre Umgebung als sicherer und lebenswerter wahrnehmen.\n\nNicht zu unterschätzen ist auch der Bildungsaspekt. Besonders Kinder, die in der Stadt aufwachsen, erleben hier unmittelbar, woher Lebensmittel stammen und wie viel Geduld ihr Anbau erfordert. Manche Schulen haben das Potenzial erkannt und betreiben eigene Beete als lebendiges Klassenzimmer. Kritisch angemerkt wird gelegentlich, dass solche Projekte ohne dauerhafte Unterstützung der Kommunen rasch wieder verschwinden. Engagement allein, so die Mahnung, genüge auf lange Sicht nicht.',
      fragen: [
        {
          frage: 'Wie hat sich Urban Gardening laut Text entwickelt?',
          optionen: [
            'Es ist eine Randerscheinung geblieben.',
            'Es wurde von einer Nischenbewegung zu einem festen Bestandteil vieler Städte.',
            'Es ist nach kurzer Zeit wieder verschwunden.',
          ],
          richtig: 1,
        },
        {
          frage: 'Welchen Aspekt heben Fachleute besonders hervor?',
          optionen: [
            'Den finanziellen Gewinn für die Teilnehmer.',
            'Die soziale Wirkung auf das Zusammenleben im Viertel.',
            'Die Möglichkeit, sich vollständig selbst zu versorgen.',
          ],
          richtig: 1,
        },
        {
          frage: 'Was lernen Kinder dem Text zufolge in den Gärten?',
          optionen: [
            'Wie man Gärten kommerziell betreibt.',
            'Woher Lebensmittel kommen und wie aufwendig ihr Anbau ist.',
            'Wie man ohne Geduld schnelle Ergebnisse erzielt.',
          ],
          richtig: 1,
        },
        {
          frage: 'Welche kritische Anmerkung wird gemacht?',
          optionen: [
            'Ohne dauerhafte Unterstützung der Kommunen verschwinden die Projekte oft wieder.',
            'Die Gärten ziehen zu viele Touristen an.',
            'Die geernteten Lebensmittel seien von schlechter Qualität.',
          ],
          richtig: 0,
        },
      ],
    },

    teil3: {
      anleitung:
        'Vier Personen suchen ein passendes Freizeit- oder Wohnangebot. Ordnen Sie jeder Person die am besten passende Anzeige zu. Eine Anzeige bleibt übrig.',
      personen: [
        {
          id: 'a',
          name: 'Person A',
          beschreibung:
            'Eine junge Familie sucht eine Wohnung im Grünen mit guter Anbindung an öffentliche Verkehrsmittel, da sie bewusst auf ein eigenes Auto verzichten möchte.',
        },
        {
          id: 'b',
          name: 'Person B',
          beschreibung:
            'Ein Student mit kleinem Budget sucht ein günstiges Zimmer auf Zeit und legt Wert auf Gesellschaft und gemeinsame Aktivitäten.',
        },
        {
          id: 'c',
          name: 'Person C',
          beschreibung:
            'Ein Ehepaar im Ruhestand möchte sich ehrenamtlich engagieren und dabei im Freien aktiv sein, ohne sich langfristig zu verpflichten.',
        },
        {
          id: 'd',
          name: 'Person D',
          beschreibung:
            'Eine Sportbegeisterte sucht eine Gruppe, mit der sie regelmäßig draußen trainieren kann, am liebsten frühmorgens vor der Arbeit.',
        },
      ],
      anzeigen: [
        {
          id: 0,
          titel: 'Familienidyll am Stadtrand',
          text:
            'Helle 4-Zimmer-Wohnung mit Garten in ruhiger Lage. Die S-Bahn-Station ist in fünf Minuten zu Fuß erreichbar – ein Auto brauchen Sie hier nicht.',
        },
        {
          id: 1,
          titel: 'WG-Zimmer auf Zeit',
          text:
            'Möbliertes Zimmer in lebendiger Wohngemeinschaft, günstig und flexibel. Wir kochen oft zusammen und unternehmen am Wochenende gern etwas.',
        },
        {
          id: 2,
          titel: 'Stadtgärtner gesucht',
          text:
            'Unser Gemeinschaftsgarten freut sich über helfende Hände. Kommen Sie vorbei, wann immer Sie Zeit haben – ganz unverbindlich, an der frischen Luft.',
        },
        {
          id: 3,
          titel: 'Lauftreff im Morgengrauen',
          text:
            'Jeden Werktag um 6 Uhr starten wir gemeinsam in den Tag. Alle Niveaus willkommen – die perfekte Portion Bewegung, bevor das Büro ruft.',
        },
        {
          id: 4,
          titel: 'Luxus-Loft im Zentrum',
          text:
            'Exklusives Penthouse mit Dachterrasse mitten in der City. Tiefgaragenstellplatz inklusive. Für Anspruchsvolle mit entsprechendem Budget.',
        },
      ],
      loesung: { a: 0, b: 1, c: 2, d: 3 },
    },

    teil4: {
      anleitung:
        'Lesen Sie die Leserkommentare zum Thema „Kostenloser öffentlicher Nahverkehr“. Äußert sich die Person eher positiv, negativ oder neutral?',
      aussagen: [
        {
          person: 'Thomas, 52',
          text:
            'Endlich ein Schritt in die richtige Richtung! Wenn Bus und Bahn nichts kosten, lassen viele endlich das Auto stehen. Davon profitieren am Ende alle – die Luft, die Straßen und das Klima.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
        {
          person: 'Petra, 47',
          text:
            'Schön und gut, aber wer soll das bezahlen? Am Ende landet die Rechnung doch wieder beim Steuerzahler, und die Qualität der Verbindungen leidet, weil das Geld für den Ausbau fehlt.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 1,
        },
        {
          person: 'Jonas, 24',
          text:
            'Ich sehe Vor- und Nachteile. Einerseits ist es gerecht und umweltfreundlich, andererseits muss die Finanzierung wirklich solide durchdacht sein. Ohne genaue Zahlen kann ich mir kein Urteil bilden.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 2,
        },
        {
          person: 'Aylin, 33',
          text:
            'Ein kostenloser Nahverkehr klingt verlockend, doch ich fürchte überfüllte Bahnen und einen Verfall der Infrastruktur. Lieber zahle ich einen fairen Preis und bekomme dafür einen verlässlichen Service.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 1,
        },
      ],
    },

    teil5: {
      anleitung:
        'Lesen Sie den literarischen Text und beantworten Sie die Fragen zu Inhalt, Stimmung und Stil.',
      text:
        'Wer die Stadt nur bei Tage kennt, der kennt sie nicht. Erst wenn die Lichter der Geschäfte erloschen sind und der Lärm sich gelegt hat, tritt ihr wahres Gesicht hervor. Dann hallen die Schritte des einsamen Wanderers von den Fassaden wider, und die Häuser, tagsüber gleichgültige Zeugen des Treibens, scheinen sich herabzuneigen, als wollten sie ihm ihre Geheimnisse anvertrauen. In solchen Stunden gehört die Stadt niemandem – und gerade darum jedem, der bereit ist, ihr zuzuhören.',
      fragen: [
        {
          frage: 'Was behauptet der Erzähler über die Stadt?',
          optionen: ['Man kenne sie erst wirklich bei Nacht.', 'Sie sei tagsüber am schönsten.', 'Sie sei nachts vor allem gefährlich.'],
          richtig: 0,
        },
        {
          frage: 'Welches Stilmittel kennzeichnet „die Häuser … scheinen sich herabzuneigen, als wollten sie ihm ihre Geheimnisse anvertrauen“?',
          optionen: ['Ironie', 'Personifikation', 'Untertreibung'],
          richtig: 1,
        },
        {
          frage: 'Wie ist der Schluss „gehört die Stadt niemandem – und gerade darum jedem“ zu verstehen?',
          optionen: ['Die Stadt gehört nur den Reichen.', 'Wer sich auf sie einlässt, dem öffnet sie sich.', 'Nachts bleibt die Stadt verschlossen.'],
          richtig: 1,
        },
        {
          frage: 'Welche Haltung nimmt der Erzähler gegenüber der nächtlichen Stadt ein?',
          optionen: ['Eine distanziert-ablehnende.', 'Eine ehrfürchtig-zugewandte.', 'Eine spöttisch-belustigte.'],
          richtig: 1,
        },
      ],
    },
  },

  {
    id: 'set3',
    titel: 'Übungssatz 3',
    thema: 'Künstliche Intelligenz & Digitalisierung',

    teil1: {
      anleitung:
        'Lesen Sie den Text und entscheiden Sie, welches Wort (a, b oder c) in jede Lücke passt.',
      text:
        'Künstliche Intelligenz ist längst Teil unseres Alltags, auch wenn wir es nicht immer {1}. Ob bei der Suche im Internet oder bei Empfehlungen im Online-Shop – Algorithmen treffen {2} Entscheidungen, die uns Zeit ersparen. {3} aller Vorteile wächst jedoch die Sorge, dass der Mensch die Kontrolle verliert. Fachleute fordern deshalb klare Regeln, {4} der Einsatz solcher Systeme transparent bleibt. Besonders heikel ist die Frage, wer {5}, wenn eine Maschine einen Fehler macht. Solange das ungeklärt ist, {6} viele Menschen der Technik mit Misstrauen. Dennoch lässt sich der Fortschritt kaum {7}. Entscheidend wird sein, ob es gelingt, die Chancen zu nutzen, {8} die Risiken aus den Augen zu verlieren.',
      luecken: [
        { nr: 1, optionen: ['bemerken', 'vergessen', 'verlieren'], richtig: 0 },
        { nr: 2, optionen: ['eigenständig', 'niemals', 'widerwillig'], richtig: 0 },
        { nr: 3, optionen: ['Wegen', 'Trotz', 'Dank'], richtig: 1 },
        { nr: 4, optionen: ['damit', 'weil', 'obwohl'], richtig: 0 },
        { nr: 5, optionen: ['haftet', 'profitiert', 'gewinnt'], richtig: 0 },
        { nr: 6, optionen: ['begegnen', 'begegnet', 'begegnete'], richtig: 0 },
        { nr: 7, optionen: ['aufhalten', 'beschleunigen', 'fördern'], richtig: 0 },
        { nr: 8, optionen: ['ohne', 'statt', 'um'], richtig: 0 },
      ],
    },

    teil2: {
      anleitung:
        'Lesen Sie den Text und beantworten Sie die Fragen. Wählen Sie jeweils die richtige Antwort (a, b oder c).',
      text:
        'Die Telemedizin – also die ärztliche Behandlung über digitale Kanäle – hat in den vergangenen Jahren einen enormen Aufschwung erlebt. Patientinnen und Patienten können heute per Videosprechstunde mit ihrem Arzt sprechen, ohne das Haus zu verlassen. Gerade für Menschen in ländlichen Regionen, wo der nächste Facharzt oft weit entfernt ist, bedeutet das eine spürbare Erleichterung.\n\nAuch das Gesundheitssystem profitiert. Wartezimmer leeren sich, Ansteckungen werden vermieden, und Ärzte können ihre Zeit effizienter einteilen. Bei chronisch Kranken, die regelmäßig betreut werden müssen, ersetzt die digitale Sprechstunde manchen unnötigen Weg in die Praxis.\n\nDoch es gibt auch Grenzen. Eine körperliche Untersuchung lässt sich nun einmal nicht über den Bildschirm durchführen, und nicht jede Diagnose kann aus der Ferne gestellt werden. Hinzu kommt, dass ältere Menschen mit der Technik mitunter überfordert sind. Datenschützer wiederum mahnen, dass sensible Gesundheitsdaten besonders sorgfältig geschützt werden müssen. Die Telemedizin, so der Tenor der Fachleute, sei eine wertvolle Ergänzung – ein vollständiger Ersatz für den persönlichen Arztbesuch werde sie jedoch nie sein.',
      fragen: [
        {
          frage: 'Für wen ist die Telemedizin laut Text besonders hilfreich?',
          optionen: [
            'Für Menschen in ländlichen Regionen mit weiten Wegen zum Arzt.',
            'Für junge, technikbegeisterte Großstädter.',
            'Für Ärzte, die weniger arbeiten möchten.',
          ],
          richtig: 0,
        },
        {
          frage: 'Wie profitiert das Gesundheitssystem?',
          optionen: [
            'Die Behandlung wird grundsätzlich teurer.',
            'Wartezimmer leeren sich und Ansteckungen werden vermieden.',
            'Ärzte tragen weniger Verantwortung.',
          ],
          richtig: 1,
        },
        {
          frage: 'Welche Grenze der Telemedizin nennt der Text?',
          optionen: [
            'Videosprechstunden sind technisch unmöglich.',
            'Eine körperliche Untersuchung ist über den Bildschirm nicht möglich.',
            'Chronisch Kranke dürfen nicht teilnehmen.',
          ],
          richtig: 1,
        },
        {
          frage: 'Was mahnen Datenschützer an?',
          optionen: [
            'Gesundheitsdaten müssten besonders sorgfältig geschützt werden.',
            'Die Technik sei viel zu billig.',
            'Ärzte sollten mehr Daten sammeln.',
          ],
          richtig: 0,
        },
        {
          frage: 'Wie bewerten Fachleute die Telemedizin insgesamt?',
          optionen: [
            'Als vollständigen Ersatz für den Arztbesuch.',
            'Als wertvolle Ergänzung, aber keinen vollständigen Ersatz.',
            'Als überflüssig und gefährlich.',
          ],
          richtig: 1,
        },
      ],
    },

    teil3: {
      anleitung:
        'Vier Personen suchen eine passende Kultur- oder Freizeitveranstaltung. Ordnen Sie jeder Person die am besten passende Anzeige zu. Eine Anzeige bleibt übrig.',
      personen: [
        {
          id: 'a',
          name: 'Person A',
          beschreibung:
            'Eine Mutter sucht eine Veranstaltung, bei der ihre kleinen Kinder am Wochenende kreativ werden und basteln können.',
        },
        {
          id: 'b',
          name: 'Person B',
          beschreibung:
            'Ein Filmliebhaber möchte anspruchsvolle europäische Filme sehen und sich anschließend mit anderen darüber austauschen.',
        },
        {
          id: 'c',
          name: 'Person C',
          beschreibung:
            'Ein Hobbykoch will seine Fähigkeiten verbessern und exotische Küchen aus aller Welt kennenlernen.',
        },
        {
          id: 'd',
          name: 'Person D',
          beschreibung:
            'Eine Seniorin interessiert sich für Literatur und sucht einen geselligen Austausch über Bücher am Nachmittag.',
        },
      ],
      anzeigen: [
        {
          id: 0,
          titel: 'Familien-Kreativwerkstatt',
          text:
            'Samstags basteln, malen und gestalten Kinder ab vier Jahren nach Herzenslust – Material und Betreuung inklusive.',
        },
        {
          id: 1,
          titel: 'Filmclub Europa',
          text:
            'Wir zeigen preisgekrönte Filme aus ganz Europa und diskutieren anschließend gemeinsam bei einem Glas Wein.',
        },
        {
          id: 2,
          titel: 'Kochkurs „Aromen der Welt“',
          text:
            'Lernen Sie Gerichte aus Asien, Afrika und Lateinamerika kennen und erweitern Sie Ihr Repertoire am Herd.',
        },
        {
          id: 3,
          titel: 'Lesekreis am Nachmittag',
          text:
            'Bei Kaffee und Kuchen besprechen wir gemeinsam aktuelle Romane – in geselliger, offener Runde.',
        },
        {
          id: 4,
          titel: 'Marathon-Trainingsgruppe',
          text:
            'Ambitioniertes Lauftraining zur Vorbereitung auf den nächsten Stadtmarathon. Nur für Geübte.',
        },
      ],
      loesung: { a: 0, b: 1, c: 2, d: 3 },
    },

    teil4: {
      anleitung:
        'Lesen Sie die Leserkommentare zum Thema „Soziale Medien“. Äußert sich die Person eher positiv, negativ oder neutral?',
      aussagen: [
        {
          person: 'Tobias, 28',
          text:
            'Ohne soziale Medien wüsste ich gar nicht, was in der Welt passiert. Ich bleibe mit Freunden in Kontakt und finde Gleichgesinnte – ich möchte sie nicht mehr missen.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
        {
          person: 'Renate, 55',
          text:
            'Dieser ständige Vergleich mit anderen, die Flut an Falschnachrichten, die verlorene Zeit – ich habe meine Konten gelöscht und fühle mich seitdem deutlich freier.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 1,
        },
        {
          person: 'Karim, 34',
          text:
            'Soziale Medien sind weder gut noch schlecht – es kommt darauf an, wie man sie nutzt. Wer bewusst damit umgeht, zieht Nutzen daraus, andere verlieren sich darin.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 2,
        },
        {
          person: 'Nina, 39',
          text:
            'Für mein kleines Unternehmen sind die sozialen Netzwerke ein Segen. Ohne sie hätte ich nie so viele Kunden erreicht – die Werbung kostet fast nichts und wirkt.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
      ],
    },

    teil5: {
      anleitung:
        'Lesen Sie den literarischen Text und beantworten Sie die Fragen zu Inhalt, Stimmung und Stil.',
      text:
        'Es gab eine Zeit, da musste der Mensch warten lernen. Der Brief, einmal abgeschickt, reiste Tage, und in diesen Tagen wuchs die Erwartung zu einer eigenen, kostbaren Empfindung heran. Heute ist die Antwort da, ehe die Frage recht verklungen ist, und mit der Geschwindigkeit ist uns etwas abhandengekommen, das wir lange für selbstverständlich hielten: die Fähigkeit, uns zu sehnen. Wer alles sogleich erhält, verlernt das Verlangen – und mit ihm vielleicht auch ein Stück jener leisen Poesie, die nur dem Wartenden sich offenbart.',
      fragen: [
        {
          frage: 'Was beklagt der Erzähler an der Gegenwart?',
          optionen: ['Dass Briefe zu teuer geworden sind.', 'Dass mit dem Tempo die Fähigkeit zur Sehnsucht verloren geht.', 'Dass niemand mehr Fragen stellt.'],
          richtig: 1,
        },
        {
          frage: 'Welche Bedeutung hatte das Warten in früherer Zeit laut Text?',
          optionen: ['Es war eine lästige Pflicht.', 'Es ließ die Erwartung zu einer kostbaren Empfindung werden.', 'Es war vor allem gefährlich.'],
          richtig: 1,
        },
        {
          frage: 'Was meint „jene leise Poesie, die nur dem Wartenden sich offenbart“?',
          optionen: ['Gedichte, die vom Warten handeln.', 'Eine feine Schönheit, die sich erst durch Geduld erschließt.', 'Die Langeweile des Alltags.'],
          richtig: 1,
        },
        {
          frage: 'Welcher Grundgedanke trägt den Text?',
          optionen: ['Fortschritt bringt ausschließlich Gewinn.', 'Mit jedem Gewinn an Tempo geht auch etwas verloren.', 'Die Vergangenheit war in allem besser.'],
          richtig: 1,
        },
      ],
    },
  },

  {
    id: 'set4',
    titel: 'Übungssatz 4',
    thema: 'Bildung & lebenslanges Lernen',

    teil1: {
      anleitung:
        'Lesen Sie den Text und entscheiden Sie, welches Wort (a, b oder c) in jede Lücke passt.',
      text:
        'Lebenslanges Lernen ist in einer sich rasch wandelnden Arbeitswelt {1} geworden. Wer heute einen Beruf erlernt, kann nicht {2} davon ausgehen, dieses Wissen ein Leben lang anwenden zu können. Technologien veralten, ganze Branchen verändern sich. {3} ist die Bereitschaft, sich immer wieder Neues anzueignen, zu einer Schlüsselkompetenz geworden. Viele Unternehmen {4} ihren Mitarbeitenden inzwischen regelmäßige Weiterbildungen an, {5} sie wissen, dass gut geschultes Personal ihr wertvollstes Kapital ist. Wer aus eigenem Antrieb dazulernt, erhöht nicht nur seine Chancen auf dem Arbeitsmarkt, {6} bleibt auch geistig beweglich. Kritiker warnen allerdings {7} einem zu großen Druck. Entscheidend sei, dass das Lernen Freude {8} und nicht zur bloßen Pflicht verkommt.',
      luecken: [
        { nr: 1, optionen: ['unverzichtbar', 'überflüssig', 'freiwillig'], richtig: 0 },
        { nr: 2, optionen: ['mehr', 'immer', 'länger'], richtig: 0 },
        { nr: 3, optionen: ['Trotzdem', 'Deshalb', 'Dennoch'], richtig: 1 },
        { nr: 4, optionen: ['bieten', 'bietet', 'boten'], richtig: 0 },
        { nr: 5, optionen: ['weil', 'obwohl', 'damit'], richtig: 0 },
        { nr: 6, optionen: ['sondern', 'aber', 'denn'], richtig: 0 },
        { nr: 7, optionen: ['vor', 'über', 'an'], richtig: 0 },
        { nr: 8, optionen: ['bereitet', 'bereiten', 'bereitete'], richtig: 0 },
      ],
    },

    teil2: {
      anleitung:
        'Lesen Sie den Text und beantworten Sie die Fragen. Wählen Sie jeweils die richtige Antwort (a, b oder c).',
      text:
        'Kinder, die mit zwei oder mehr Sprachen aufwachsen, galten lange als benachteiligt. Man fürchtete, sie würden keine der Sprachen richtig beherrschen und in der Schule den Anschluss verlieren. Die moderne Forschung zeichnet ein ganz anderes Bild.\n\nTatsächlich entwickeln mehrsprachige Kinder oft besondere geistige Fähigkeiten. Weil sie ständig zwischen den Sprachen wechseln, trainieren sie unbewusst ihre Konzentration und lernen, Wichtiges von Unwichtigem zu unterscheiden. Manche Studien deuten sogar darauf hin, dass diese Fähigkeiten im Alter vor dem geistigen Abbau schützen können.\n\nAllerdings stellt sich der Erfolg nicht von allein ein. Damit ein Kind eine Sprache wirklich verinnerlicht, muss es ihr regelmäßig und in vielfältigen Situationen begegnen. Gelegentliche Berührung genügt nicht. Fachleute raten Eltern daher, konsequent zu bleiben und jede Sprache mit festen Bezugspersonen oder Anlässen zu verbinden. Wird die Mehrsprachigkeit so gefördert, ist sie kein Hindernis, sondern ein Geschenk fürs ganze Leben.',
      fragen: [
        {
          frage: 'Wie wurden mehrsprachige Kinder früher häufig eingeschätzt?',
          optionen: ['Als benachteiligt.', 'Als besonders begabt.', 'Als völlig unauffällig.'],
          richtig: 0,
        },
        {
          frage: 'Welchen geistigen Vorteil nennt der Text?',
          optionen: [
            'Sie brauchen weniger Schlaf.',
            'Sie trainieren Konzentration und das Unterscheiden von Wichtigem und Unwichtigem.',
            'Sie lernen automatisch schneller rechnen.',
          ],
          richtig: 1,
        },
        {
          frage: 'Was können mehrsprachige Fähigkeiten im Alter bewirken?',
          optionen: [
            'Sie beschleunigen den geistigen Abbau.',
            'Sie haben keinerlei Wirkung.',
            'Sie können vor dem geistigen Abbau schützen.',
          ],
          richtig: 2,
        },
        {
          frage: 'Was ist nötig, damit ein Kind eine Sprache verinnerlicht?',
          optionen: [
            'Gelegentlicher Kontakt reicht aus.',
            'Regelmäßige Begegnung in vielfältigen Situationen.',
            'Ein einmaliger, teurer Sprachkurs.',
          ],
          richtig: 1,
        },
        {
          frage: 'Zu welchem Schluss kommt der Text?',
          optionen: [
            'Mehrsprachigkeit ist ein Hindernis.',
            'Bei guter Förderung ist Mehrsprachigkeit ein Geschenk fürs Leben.',
            'Eltern sollten mit dem Kind nur eine Sprache sprechen.',
          ],
          richtig: 1,
        },
      ],
    },

    teil3: {
      anleitung:
        'Vier Personen suchen ein passendes Lern- oder Bildungsangebot. Ordnen Sie jeder Person die am besten passende Anzeige zu. Eine Anzeige bleibt übrig.',
      personen: [
        {
          id: 'a',
          name: 'Person A',
          beschreibung:
            'Eine Schülerin hat Schwierigkeiten in Mathematik und sucht geduldige Einzelnachhilfe am Nachmittag.',
        },
        {
          id: 'b',
          name: 'Person B',
          beschreibung:
            'Ein Berufstätiger möchte berufsbegleitend einen Hochschulabschluss nachholen, und zwar ortsunabhängig.',
        },
        {
          id: 'c',
          name: 'Person C',
          beschreibung:
            'Ein Vater will mit seinem Kind spielerisch das Lesen üben und sucht passende Materialien.',
        },
        {
          id: 'd',
          name: 'Person D',
          beschreibung:
            'Eine Studentin sucht eine ruhige Umgebung zum konzentrierten Lernen außerhalb ihrer Wohnung.',
        },
      ],
      anzeigen: [
        {
          id: 0,
          titel: 'Mathe-Nachhilfe individuell',
          text:
            'Geduldige Einzelbetreuung am Nachmittag, ganz abgestimmt auf das Tempo Ihres Kindes.',
        },
        {
          id: 1,
          titel: 'Fernstudium Bachelor',
          text:
            'Studieren Sie berufsbegleitend und vollständig online – im eigenen Tempo und von überall aus.',
        },
        {
          id: 2,
          titel: 'Lesespaß für Kinder',
          text:
            'Bunte Übungshefte und Spiele, mit denen das Lesenlernen zum Vergnügen für die ganze Familie wird.',
        },
        {
          id: 3,
          titel: 'Lernort Bibliothek',
          text:
            'Ruhige Arbeitsplätze, schnelles WLAN und lange Öffnungszeiten zum konzentrierten Studieren.',
        },
        {
          id: 4,
          titel: 'Tanzkurs für Anfänger',
          text:
            'Lernen Sie die Grundschritte von Walzer bis Salsa – Schwung und gute Laune garantiert.',
        },
      ],
      loesung: { a: 0, b: 1, c: 2, d: 3 },
    },

    teil4: {
      anleitung:
        'Lesen Sie die Leserkommentare zum Thema „Hausaufgaben abschaffen?“. Äußert sich die Person eher positiv, negativ oder neutral gegenüber Hausaufgaben?',
      aussagen: [
        {
          person: 'Frau Berger, Lehrerin',
          text:
            'Ohne Hausaufgaben fehlt den Kindern die nötige Übung. Was im Unterricht beginnt, muss zu Hause vertieft werden – anders festigt sich kein Wissen.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
        {
          person: 'Jan, Vater',
          text:
            'Jeden Nachmittag Streit, Tränen, kein Feierabend für die ganze Familie. Hausaufgaben rauben den Kindern die Kindheit – ich wäre froh, wenn sie endlich abgeschafft würden.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 1,
        },
        {
          person: 'Frau Dr. Klein',
          text:
            'Ob Hausaufgaben sinnvoll sind, hängt von ihrer Gestaltung ab. Sinnlose Wiederholung schadet, durchdachte Aufgaben können nützen. Pauschale Antworten gibt es nicht.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 2,
        },
        {
          person: 'Murat, Schüler',
          text:
            'Ehrlich? Ich finde Hausaufgaben gut. Wenn ich sie allein schaffe, weiß ich, dass ich den Stoff verstanden habe – das gibt mir Sicherheit für die Prüfung.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
      ],
    },

    teil5: {
      anleitung:
        'Lesen Sie den literarischen Text und beantworten Sie die Fragen zu Inhalt, Stimmung und Stil.',
      text:
        'In den Büchern seiner Kindheit hatte er Welten betreten, die wirklicher waren als die Straße vor seinem Fenster. Jede zerlesene Seite trug den Geruch jener Nachmittage, an denen die Zeit stillzustehen schien. Später, als die Pflichten ihn einholten, blieben die Bücher ungelesen im Regal – stumme Vorwürfe und geduldige Freunde zugleich. Und doch wusste er: Sie würden warten. Denn ein wahres Buch verliert nie die Geduld mit seinem Leser; es altert mit ihm und schenkt ihm bei jeder Wiederkehr einen anderen Sinn.',
      fragen: [
        {
          frage: 'Welche Rolle spielten Bücher in der Kindheit des Mannes?',
          optionen: ['Sie langweilten ihn meist.', 'Sie eröffneten ihm Welten, die ihm wirklicher schienen als die Realität.', 'Er las sie nur auf Druck.'],
          richtig: 1,
        },
        {
          frage: 'Was bedeutet die Wendung „stumme Vorwürfe und geduldige Freunde zugleich“?',
          optionen: ['Die Bücher mahnen ihn und bleiben ihm doch treu.', 'Die Bücher sind längst zerstört.', 'Die Bücher sprechen wirklich mit ihm.'],
          richtig: 0,
        },
        {
          frage: 'Welche Aussage über „ein wahres Buch“ trifft der Text?',
          optionen: ['Es ist nach einmaligem Lesen wertlos.', 'Es schenkt bei jedem Wiederlesen einen neuen Sinn.', 'Es eignet sich nur für Kinder.'],
          richtig: 1,
        },
        {
          frage: 'Welches Lebensgefühl spricht aus dem Text?',
          optionen: ['Verachtung für die Vergangenheit.', 'Eine nachdenkliche Verbundenheit mit dem Lesen.', 'Gleichgültigkeit gegenüber Büchern.'],
          richtig: 1,
        },
      ],
    },
  },

  {
    id: 'set5',
    titel: 'Übungssatz 5',
    thema: 'Gesundheit & Ernährung',

    teil1: {
      anleitung:
        'Lesen Sie den Text und entscheiden Sie, welches Wort (a, b oder c) in jede Lücke passt.',
      text:
        'Gesunde Ernährung ist in aller Munde – im wörtlichen wie im übertragenen Sinne. Kaum ein Tag vergeht, {1} nicht eine neue Diät oder ein angebliches Superfood beworben wird. Verbraucher sind dadurch oft mehr verwirrt {2} informiert. Was gestern noch als gesund galt, wird heute verteufelt. Ernährungsfachleute raten {3}, sich von solchen Moden nicht verunsichern zu lassen. Statt einzelner Wundermittel komme es {4} eine ausgewogene Mischung an. Wer sich {5} an diese einfachen Grundsätze hält, tut bereits viel für seine Gesundheit. {6} sollte man nicht vergessen, dass auch der Genuss seinen Platz hat. Eine Ernährung, die nur aus Verboten besteht, lässt sich auf Dauer kaum {7}. Entscheidend ist das richtige Maß – und die Freude {8} Essen.',
      luecken: [
        { nr: 1, optionen: ['an dem', 'wenn', 'dass'], richtig: 0 },
        { nr: 2, optionen: ['als', 'wie', 'denn'], richtig: 0 },
        { nr: 3, optionen: ['deshalb', 'dennoch', 'trotzdem'], richtig: 0 },
        { nr: 4, optionen: ['auf', 'an', 'über'], richtig: 0 },
        { nr: 5, optionen: ['bereits', 'kaum', 'niemals'], richtig: 0 },
        { nr: 6, optionen: ['Allerdings', 'Deswegen', 'Folglich'], richtig: 0 },
        { nr: 7, optionen: ['durchhalten', 'aufgeben', 'vergessen'], richtig: 0 },
        { nr: 8, optionen: ['am', 'auf', 'beim'], richtig: 0 },
      ],
    },

    teil2: {
      anleitung:
        'Lesen Sie den Text und beantworten Sie die Fragen. Wählen Sie jeweils die richtige Antwort (a, b oder c).',
      text:
        'Schlaf gilt vielen als verlorene Zeit – Stunden, in denen man scheinbar nichts leistet. Die Wissenschaft sieht das völlig anders. Während wir schlafen, laufen im Körper und im Gehirn lebenswichtige Prozesse ab, die sich durch nichts ersetzen lassen.\n\nSo verarbeitet das Gehirn nachts die Eindrücke des Tages. Was wir gelernt haben, wird sortiert und im Langzeitgedächtnis verankert. Wer vor einer Prüfung die Nacht durchmacht, schadet sich daher meist mehr, als er nützt. Auch das Immunsystem arbeitet im Schlaf auf Hochtouren und wehrt Krankheitserreger ab.\n\nDauerhafter Schlafmangel bleibt nicht ohne Folgen. Die Konzentration lässt nach, die Stimmung leidet, und das Risiko für ernsthafte Erkrankungen steigt. Dennoch betrachten viele Menschen ausreichenden Schlaf noch immer als Luxus statt als Notwendigkeit. Fachleute appellieren, dem Schlaf denselben Stellenwert einzuräumen wie gesunder Ernährung und Bewegung. Wer gut schläft, lebe nicht nur länger, sondern auch zufriedener.',
      fragen: [
        {
          frage: 'Wie betrachten viele Menschen den Schlaf?',
          optionen: ['Als verlorene Zeit.', 'Als die wichtigste Tätigkeit überhaupt.', 'Als reines Vergnügen.'],
          richtig: 0,
        },
        {
          frage: 'Was geschieht laut Text nachts im Gehirn?',
          optionen: [
            'Es schaltet vollständig ab.',
            'Es verarbeitet die Eindrücke des Tages und verankert Gelerntes.',
            'Es vergisst alles zuvor Gelernte.',
          ],
          richtig: 1,
        },
        {
          frage: 'Warum schadet das Durchmachen der Nacht vor einer Prüfung?',
          optionen: [
            'Weil man dann zu früh aufwacht.',
            'Weil das Gehirn das Gelernte nicht im Gedächtnis verankern kann.',
            'Weil man davon sofort krank wird.',
          ],
          richtig: 1,
        },
        {
          frage: 'Welche Folge hat dauerhafter Schlafmangel?',
          optionen: [
            'Die Konzentration verbessert sich.',
            'Das Risiko für ernsthafte Erkrankungen steigt.',
            'Die Stimmung wird dauerhaft besser.',
          ],
          richtig: 1,
        },
        {
          frage: 'Wozu appellieren die Fachleute?',
          optionen: [
            'Schlaf als Luxus zu betrachten.',
            'Dem Schlaf denselben Stellenwert wie Ernährung und Bewegung zu geben.',
            'Weniger zu schlafen, um mehr zu leisten.',
          ],
          richtig: 1,
        },
      ],
    },

    teil3: {
      anleitung:
        'Vier Personen suchen ein passendes Gesundheits- oder Bewegungsangebot. Ordnen Sie jeder Person die am besten passende Anzeige zu. Eine Anzeige bleibt übrig.',
      personen: [
        {
          id: 'a',
          name: 'Person A',
          beschreibung:
            'Ein gestresster Manager sucht eine Methode, um abzuschalten und im Alltag zur Ruhe zu kommen.',
        },
        {
          id: 'b',
          name: 'Person B',
          beschreibung:
            'Eine junge Frau möchte ihre Ausdauer verbessern und sucht ein Training an der frischen Luft.',
        },
        {
          id: 'c',
          name: 'Person C',
          beschreibung:
            'Ein älterer Herr hat Rückenschmerzen und sucht ein schonendes, gelenkfreundliches Bewegungsangebot.',
        },
        {
          id: 'd',
          name: 'Person D',
          beschreibung:
            'Eine Berufstätige will sich gesünder ernähren, weiß aber nicht recht, wie sie anfangen soll.',
        },
      ],
      anzeigen: [
        {
          id: 0,
          titel: 'Achtsamkeit & Meditation',
          text:
            'Lernen Sie, im Alltag innezuhalten und dem Stress gelassen zu begegnen – in ruhiger Atmosphäre.',
        },
        {
          id: 1,
          titel: 'Lauftreff im Park',
          text:
            'Gemeinsam die Ausdauer steigern – an der frischen Luft und für jedes Niveau geeignet.',
        },
        {
          id: 2,
          titel: 'Wassergymnastik',
          text:
            'Schonendes Training im warmen Becken, ideal bei Rücken- und Gelenkbeschwerden.',
        },
        {
          id: 3,
          titel: 'Ernährungsberatung',
          text:
            'Individuelle Beratung und alltagstaugliche Pläne für einen gesunden, machbaren Start.',
        },
        {
          id: 4,
          titel: 'Krafttraining für Profis',
          text:
            'Intensives Muskelaufbauprogramm an modernen Geräten – für erfahrene Sportler.',
        },
      ],
      loesung: { a: 0, b: 1, c: 2, d: 3 },
    },

    teil4: {
      anleitung:
        'Lesen Sie die Leserkommentare zum Thema „Weniger Fleisch essen?“. Äußert sich die Person eher positiv, negativ oder neutral gegenüber dem Verzicht auf Fleisch?',
      aussagen: [
        {
          person: 'Stefan, 40',
          text:
            'Weniger Fleisch zu essen war die beste Entscheidung. Ich fühle mich fitter, mein Gewissen ist ruhiger, und die pflanzliche Küche ist überraschend vielfältig.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
        {
          person: 'Gerda, 63',
          text:
            'Mir soll niemand vorschreiben, was auf meinen Teller kommt. Ein gutes Stück Fleisch gehört für mich dazu, und diese ewige Bevormundung geht mir gehörig auf die Nerven.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 1,
        },
        {
          person: 'Yusuf, 31',
          text:
            'Ich sehe beide Seiten. Der Umwelt zuliebe weniger Fleisch zu essen ist vernünftig, doch ein generelles Verbot halte ich für übertrieben. Jeder sollte selbst entscheiden.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 2,
        },
        {
          person: 'Lara, 26',
          text:
            'Seit ich weiß, unter welchen Bedingungen viele Tiere gehalten werden, bringe ich kaum noch Fleisch über die Lippen. Für mich ist der Verzicht eine Frage des Anstands.',
          optionen: ['positiv', 'negativ', 'neutral'],
          richtig: 0,
        },
      ],
    },

    teil5: {
      anleitung:
        'Lesen Sie den literarischen Text und beantworten Sie die Fragen zu Inhalt, Stimmung und Stil.',
      text:
        'Das Meer kennt keine Eile. Welle um Welle trägt es an den Strand, gleichmütig, seit Anbeginn, und nimmt zurück, was es gegeben hat. Wer lange genug am Ufer steht, dem teilt sich etwas von dieser Ruhe mit; die kleinen Sorgen des Tages lösen sich auf wie Schaum im Sand. Vielleicht ist es dies, was den Menschen immer wieder ans Wasser zieht: nicht die Weite allein, sondern die stille Lehre, dass auch das Unruhigste einem verborgenen Maß gehorcht.',
      fragen: [
        {
          frage: 'Welche Eigenschaft des Meeres hebt der Text hervor?',
          optionen: ['Seine Gefährlichkeit.', 'Seine gleichmütige Ruhe.', 'Seine Lautstärke.'],
          richtig: 1,
        },
        {
          frage: 'Was geschieht laut Text mit den „kleinen Sorgen des Tages“?',
          optionen: ['Sie verstärken sich.', 'Sie lösen sich auf wie Schaum im Sand.', 'Sie bleiben unverändert.'],
          richtig: 1,
        },
        {
          frage: 'Welches Stilmittel ist „die kleinen Sorgen … lösen sich auf wie Schaum im Sand“?',
          optionen: ['Ein Vergleich.', 'Eine rhetorische Frage.', 'Eine Übertreibung.'],
          richtig: 0,
        },
        {
          frage: 'Worin besteht die „stille Lehre“ des Meeres?',
          optionen: ['Dass alles dem Zufall überlassen ist.', 'Dass selbst das Unruhigste einem verborgenen Maß folgt.', 'Dass man das Meer fürchten soll.'],
          richtig: 1,
        },
      ],
    },
  },
]
