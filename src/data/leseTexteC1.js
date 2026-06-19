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
  },
]
