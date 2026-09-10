export interface INQAChapter {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  legalReference: string;
  iconName: string;
  color: string;
}

export const INQA_CHAPTERS: INQAChapter[] = [
  {
    id: "KAPITEL_1_ALLGEMEIN",
    number: 1,
    title: "1. Allgemeine Informationen",
    shortTitle: "1. Allgemein & Organisation",
    description: "Geltungsbereich, Adressatenkreis, Projektorganisation, Bauleitung, SiGeKo und Mitwirkungspflichten.",
    legalReference: "BaustellV §§ 2, 3; § 8 ArbSchG; DGUV Vorschrift 1 § 6",
    iconName: "Building2",
    color: "#3b82f6",
  },
  {
    id: "KAPITEL_2_NOTFALL",
    number: 2,
    title: "2. Notfallmanagement",
    shortTitle: "2. Notfallmanagement",
    description: "Alarmierung, Notfallmeldekette, Lotsenpunkte für Rettungskräfte, Ersthelfer und Brandschutz.",
    legalReference: "ASR A4.3, ASR A2.2, DGUV Vorschrift 1 §§ 24–28",
    iconName: "PhoneCall",
    color: "#ef4444",
  },
  {
    id: "KAPITEL_3_VORGABEN",
    number: 3,
    title: "3. Allgemeine Regelungen sowie Vorgaben des Bauherren",
    shortTitle: "3. Bauherrenvorgaben & Verhalten",
    description: "Betriebszeiten, Anlieferungslogistik, Nachunternehmerpflichten, Zutritt, PSA, Ordnung & Rauch-/Alkoholverbot.",
    legalReference: "§§ 4, 15 ArbSchG; PSA-BV; ArbStättV § 5; DGUV Vorschrift 1 § 15",
    iconName: "HardHat",
    color: "#f59e0b",
  },
  {
    id: "KAPITEL_4_VERKEHR",
    number: 4,
    title: "4. Verkehrswege auf der Baustelle",
    shortTitle: "4. Baustellenverkehr & Wege",
    description: "Baustellenzufahrt, Geschwindigkeitsbegrenzung (10 km/h), Trennung Fuß-/Fahrverkehr, Einweiserpflicht & Winterdienst.",
    legalReference: "ASR A1.8, StVO, DGUV Vorschrift 38 §§ 7, 9",
    iconName: "Truck",
    color: "#10b981",
  },
  {
    id: "KAPITEL_5_MEDIEN",
    number: 5,
    title: "5. Anschlüsse und Verteilungen",
    shortTitle: "5. Anschlüsse & Abfall",
    description: "Baustromversorgung nach DGUV Vorschrift 3 mit RCD 30 mA, Trinkwasser, Schmutzwasser und GewAbfV-Abfalltrennung.",
    legalReference: "DIN VDE 0100-704, DGUV Vorschrift 3, GewAbfV, WHG",
    iconName: "Zap",
    color: "#6366f1",
  },
  {
    id: "KAPITEL_6_ARBEITSMITTEL",
    number: 6,
    title: "6. Arbeitsmittel mit Gefährdung mehrerer Unternehmen",
    shortTitle: "6. Maschinen, Gerüste & Krane",
    description: "Erdbaumaschinen-Sicherheitszone, Gerüstfreigabe & Umbauverbot, Bauaufzüge, Krane & Anschlägerprüfung.",
    legalReference: "BetrSichV, TRBS 2121 Teil 1, DGUV Vorschrift 52",
    iconName: "Wrench",
    color: "#8b5cf6",
  },
  {
    id: "KAPITEL_7_ABSTURZ",
    number: 7,
    title: "7. Gemeinsam genutzte Schutzeinrichtungen gegen Absturz",
    shortTitle: "7. Absturzsicherungen",
    description: "Zwangsläufig wirksamer dreiteiliger Seitenschutz, unverschiebbare Schachtabdeckungen, Wiederherstellungspflicht.",
    legalReference: "ASR A2.1, BaustellV Anh. II Nr. 1, DGUV Vorschrift 38 § 5",
    iconName: "ShieldAlert",
    color: "#ec4899",
  },
];

export interface DefaultINQARule {
  category: string;
  title: string;
  praxisProblem: string;
  content: string;
  isContractRelevant: boolean;
  isSiGePlanRelevant: boolean;
  actionStatus: string;
  orderIndex: number;
}

export const INQA_DEFAULT_RULES: DefaultINQARule[] = [
  // ─── KAPITEL 1: Allgemeine Informationen ──────────────────────────────
  {
    category: "KAPITEL_1_ALLGEMEIN",
    title: "1.1 Geltungsbereich und Adressatenkreis",
    praxisProblem:
      "Mangelnde Information und Unklarheit über Verantwortlichkeiten und Regeln führen zu Abstimmungsproblemen, Verzögerungen und gegenseitigen Gefährdungen.",
    content:
      "Diese Baustellenordnung ist für alle auf der Baustelle tätigen Unternehmen, deren Nachunternehmer, Leiharbeitnehmer, Lieferanten und Besucher rechtsverbindlich (§ 8 ArbSchG, BaustellV § 4). Jeder Auftragnehmer ist verpflichtet, seine Mitarbeiter und Nachunternehmer vor Aufnahme der Arbeiten nachweislich hierüber zu unterweisen.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 1,
  },
  {
    category: "KAPITEL_1_ALLGEMEIN",
    title: "1.2 Projektorganisation und Zuständigkeiten",
    praxisProblem:
      "Unklare Weisungsbefugnisse und fehlende Ansprechpartner bei Sicherheitsfragen, Unfällen und Störungen im Bauablauf.",
    content:
      "Die Projektorganisation und Ansprechpartner (Bauherr, Bauleitung, SiGe-Koordinator, Ersthelfer) sind verbindlich am Baustellenbrett ausgehängt. Den sicherheitstechnischen Anordnungen des SiGeKo und der Bauleitung ist unverzüglich Folge zu leisten.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 2,
  },
  {
    category: "KAPITEL_1_ALLGEMEIN",
    title: "1.3 Koordination nach BaustellV & Sicherheitsbesprechungen",
    praxisProblem:
      "Gegenseitige Gefährdungen durch unkoordinierte räumliche und zeitliche Überschneidungen verschiedener Gewerke ohne vorherige Absprache.",
    content:
      "Die am Bau beteiligten Unternehmen sind zur aktiven Abstimmung verpflichtet. Die benannten Sicherheitsbeauftragten der Gewerke haben an den regelmäßigen Sicherheitsbegehungen und Besprechungen des SiGeKo teilzunehmen. Arbeiten mit Schnittstellen zu Nachbargewerken dürfen erst nach Freigabe aufgenommen werden.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 3,
  },

  // ─── KAPITEL 2: Notfallmanagement ─────────────────────────────────────
  {
    category: "KAPITEL_2_NOTFALL",
    title: "2.1 Notrufkette und Alarmierung",
    praxisProblem:
      "Verzögerungen bei der Alarmierung im Notfall durch unklare Rufnummern, fehlende Standortangaben oder Panikreaktionen.",
    content:
      "Notruf 112 (Feuerwehr/Rettungsdienst) und 110 (Polizei). Bei Notrufen sind die 5 W-Fragen zu beantworten (Wo, Was, Wie viele, Welche Verletzungen, Warten auf Rückfragen). Jeder Notruf ist unverzüglich parallel an die Bauleitung / SiGeKo zu melden.",
    isContractRelevant: false,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 4,
  },
  {
    category: "KAPITEL_2_NOTFALL",
    title: "2.2 Erste Hilfe, Ersthelfer & Lotsenpunkt",
    praxisProblem:
      "Rettungskräfte finden die Unfallstelle auf dem weitläufigen Gelände nicht; fehlendes Verbandmaterial oder keine ausgebildeten Ersthelfer vor Ort.",
    content:
      "Bei jedem Rettungseinsatz ist sofort ein eingewiesener Lotse an das Haupttor (Lotsenpunkt Tor 1 / Nordzufahrt) abzustellen. Jedes Gewerk mit mehr als 2 Mitarbeitern benennt mind. einen betrieblichen Ersthelfer nach § 26 DGUV Vorschrift 1. Verbandkästen (DIN 13157) befinden sich im Bauleiterbüro und an den Etagenstationen (ASR A4.3).",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 5,
  },
  {
    category: "KAPITEL_2_NOTFALL",
    title: "2.3 Brand- und Explosionsschutz / Heißarbeiten",
    praxisProblem:
      "Brände durch Heißarbeiten (Schweißen, Trennschleifen, Dachabdichtungen) mit offener Flamme ohne ausreichende Löschmittel und Brandwache.",
    content:
      "Für Schweiß-, Brennschneid-, Trennschleif- und Dachflammarbeiten ist vor Beginn ein schriftlicher Feuererlaubnisschein durch die Bauleitung/SiGeKo einzuholen (ASR A2.2, DGUV Regel 100-500 Kap. 2.26). Mindestens 2 typgeprüfte Feuerlöscher sind bereitzuhalten. Nach Abschluss ist eine Brandwache von mind. 2 Stunden verpflichtend.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 6,
  },

  // ─── KAPITEL 3: Allgemeine Regelungen sowie Vorgaben des Bauherren ────
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.1 Betriebs- und Ruhezeiten",
    praxisProblem:
      "Überschreitung von Lärmrichtwerten, Ruhestörungen der Nachbarschaft und Verstöße gegen behördliche Arbeitszeitbeschränkungen.",
    content:
      "Reguläre Arbeitszeiten sind Montag bis Samstag von 07:00 bis 19:00 Uhr unter strikter Einhaltung der AVV Baulärm und des Landes-Immissionsschutzrechts. Sonn-, Feiertags- und Nachtarbeiten bedürfen der vorherigen behördlichen und bauherrenseitigen Genehmigung.",
    isContractRelevant: true,
    isSiGePlanRelevant: false,
    actionStatus: "GEREGELT",
    orderIndex: 7,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.2 An- und Abtransporte sowie Baustellenlogistik",
    praxisProblem:
      "Rückstau von Schwerlastern auf öffentliche Straßen, blockierte Rettungswege und unkoordinierte Materialanlieferungen.",
    content:
      "Lkw-Anlieferungen ab 7,5 t müssen mindestens 24 Stunden vorher bei der Baustellenlogistik angemeldet werden. Das Be- und Entladen darf nur in den zugewiesenen Logistikzonen erfolgen. Wartezeiten im öffentlichen Straßenraum sind verboten.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 8,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.3 Pflichten der Nachunternehmer & Baustellenanmeldung",
    praxisProblem:
      "Einsatz nicht angemeldeter Nachunternehmer und Leiharbeiter ohne Arbeitsschutzunterweisung und ohne Kenntnis der Baustellenordnung.",
    content:
      "Der Einsatz von Nachunternehmern bedarf der vorherigen schriftlichen Zustimmung des Bauherrn. Jeder Auftragnehmer haftet dafür, dass sämtliche Beschäftigte vor Arbeitsaufnahme nachweislich in die Baustellenordnung eingewiesen wurden.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 9,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.4 Zutrittskontrolle & Ausweispflicht",
    praxisProblem:
      "Unbefugte Personen auf der Baustelle, Gefährdung von Dritten, Diebstahl von Werkzeugen und Schwarzarbeitsrisiken.",
    content:
      "Unbefugten ist das Betreten der Baustelle strengstens verboten. Beschäftigte müssen ihren Baustellenausweis sowie einen amtlichen Lichtbildausweis ständig mitführen (SchwarzArbG). Besucher und Lieferanten haben sich im Bauleiterbüro anzumelden.",
    isContractRelevant: true,
    isSiGePlanRelevant: false,
    actionStatus: "GEREGELT",
    orderIndex: 10,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.5 Persönliche Schutzausrüstung (PSA-Tragepflicht)",
    praxisProblem:
      "Schwere Kopf- und Fußverletzungen sowie Anfahrrisiken durch Nichttragen der persönlichen Schutzausrüstung.",
    content:
      "Ab der Baustellengrenze gilt uneingeschränkte Tragepflicht für die Grund-PSA nach PSA-Benutzungsverordnung (PSA-BV): Schutzhelm (DIN EN 397), Sicherheitsschuhe S3 mit durchtrittsicherer Sohle und Warnweste/Warnkleidung (EN ISO 20471). Tätigkeitsbezogene PSA (Gehörschutz, Brille, Atemschutz) ist konsequent einzusetzen.",
    isContractRelevant: true,
    isSiGePlanRelevant: false,
    actionStatus: "GEREGELT",
    orderIndex: 11,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.6 Ordnung, Sauberkeit & Fluchtwege",
    praxisProblem:
      "Sturz- und Stolperunfälle durch herumliegende Materialien und Kabel sowie versperrte Rettungs- und Treppenwege.",
    content:
      "Flucht-, Rettungswege und Treppenräume sind permanent frei von Material, Kabeln und Schläuchen zu halten (ASR A1.8, ASR A2.3). Jeder Arbeitsplatz ist vor Verlassen am Schichtende besenrein und unfallfrei aufzuräumen.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 12,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.7 Sanitäreinrichtungen & Sozialräume",
    praxisProblem:
      "Verschmutzte Sanitäranlagen, mangelhafte Baustellenhygiene und unzulässiger Aufenthalt in Rohbauten.",
    content:
      "Bereitgestellte Sanitär- und Pausencontainer sind schonend zu behandeln und sauber zu hinterlassen (§ 3a ArbStättV). Essen, Trinken und Aufwärmen ist ausschließlich in den dafür ausgewiesenen Sozialräumen gestattet.",
    isContractRelevant: true,
    isSiGePlanRelevant: false,
    actionStatus: "GEREGELT",
    orderIndex: 13,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.8 Absolutes Rauch-, Alkohol- und Drogenverbot",
    praxisProblem:
      "Erhöhtes Unfallrisiko durch verminderte Reaktionsfähigkeit unter Alkoholeinfluss sowie Brandgefahr durch Zigarettenreste.",
    content:
      "Auf der gesamten Baustelle gilt striktes Alkohol- und Drogenverbot (§ 15 DGUV Vorschrift 1). Berauschte Personen werden des Geländes verwiesen. Rauchen ist im gesamten Rohbau, in Treppenhäusern und Containern untersagt (§ 5 ArbStättV) und nur in der markierten Raucherzone gestattet.",
    isContractRelevant: true,
    isSiGePlanRelevant: false,
    actionStatus: "GEREGELT",
    orderIndex: 14,
  },
  {
    category: "KAPITEL_3_VORGABEN",
    title: "3.9 Umweltschutz & Schutz der Nachbarschaft",
    praxisProblem:
      "Staubemissionen, Gewässerverschmutzung und Verschmutzung der öffentlichen Verkehrsstraßen durch Baufahrzeuge.",
    content:
      "Staubintensive Schneid- und Schleifarbeiten sind abzusaugen oder nass auszuführen. Verschmutzungen der öffentlichen Straße sind durch den Verursacher unverzüglich zu beseitigen. Die Reifenwaschanlage an der Ausfahrt ist verpflichtend zu nutzen.",
    isContractRelevant: true,
    isSiGePlanRelevant: false,
    actionStatus: "GEREGELT",
    orderIndex: 15,
  },

  // ─── KAPITEL 4: Verkehrswege auf der Baustelle ────────────────────────
  {
    category: "KAPITEL_4_VERKEHR",
    title: "4.1 Baustellenzufahrt und -abfahrt",
    praxisProblem:
      "Kollisionen im Einmündungsbereich zur öffentlichen Straße, unzureichende Sichtweiten und Gefährdung von Fußgängern auf Gehwegen.",
    content:
      "Die Zufahrt und Abfahrt darf ausschließlich über das beschilderte Haupttor erfolgen. Querungen des öffentlichen Gehwegs sind gemäß verkehrsrechtlicher Anordnung (RSA 21) lückenlos abzusichern.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 16,
  },
  {
    category: "KAPITEL_4_VERKEHR",
    title: "4.2 Verkehrswege für Fahrzeuge & Einweiserpflicht",
    praxisProblem:
      "Schwere Anfahrunfälle beim Rangieren und Rückwärtsfahren von Baustellen-Lkw und Erdbaumaschinen ohne Sichtkontakt.",
    content:
      "Auf dem Gelände gilt die StVO sinngemäß mit Höchstgeschwindigkeit 10 km/h (Schrittgeschwindigkeit). Baustellenfahrzeuge haben Vorrang. Das Rückwärtsfahren von Lkw ist nur mit unterwiesenem Einweiser gestattet (DGUV Regel 100-500 Kap. 2.12, DGUV Vorschrift 38 § 9).",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 17,
  },
  {
    category: "KAPITEL_4_VERKEHR",
    title: "4.3 Verkehrswege für Personen & Winterdienst",
    praxisProblem:
      "Fußgänger queren ungesichert den Fahrbereich schwerer Baumaschinen; Sturzunfälle durch Stolperstellen, Glätte und Dunkelheit.",
    content:
      "Strikte räumliche Trennung von Fahr- und Fußwegen (ASR A1.8, DGUV Vorschrift 38 § 7). Fußwege sind befestigt, ausgeleuchtet und frei von Hindernissen zu halten. Die Räum- und Streupflicht im Winter wird zentral organisiert.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 18,
  },

  // ─── KAPITEL 5: Anschlüsse und Verteilungen ───────────────────────────
  {
    category: "KAPITEL_5_MEDIEN",
    title: "5.1 Baustromversorgung nach DIN VDE 0100-704 & DGUV Vorschrift 3",
    praxisProblem:
      "Stromunfälle und Brände durch defekte Kabeltrommeln, fehlende RCD-Fehlerstromschützer und unzulässige private Mehrfachsteckdosen.",
    content:
      "Elektrische Energie darf ausschließlich an typgeprüften Baustromverteilern nach DIN VDE 0100-704 entnommen werden. Jeder Abgang muss über einen FI-Schutzschalter (RCD ≤ 30 mA) abgesichert sein. Alle Leitungen und Geräte müssen eine gültige Prüfplakette nach DGUV Vorschrift 3 aufweisen.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 19,
  },
  {
    category: "KAPITEL_5_MEDIEN",
    title: "5.2 Wasserversorgung und Schmutzwasserentsorgung",
    praxisProblem:
      "Verunreinigung des Grundwassers durch unkontrolliertes Einleiten von Zementschlämmen, Chemikalien oder Betonresten in die Kanalisation.",
    content:
      "Wasserentnahme nur an freigegebenen Zapfstellen mit Systemtrenner. Einleiten von Bauabwässern, Zementschlämmen oder Schadstoffen in Boden oder Kanalisation ist verboten (WHG). Betonkübel und -mischer dürfen nur auf dem ausgewiesenen Waschplatz gereinigt werden.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 20,
  },
  {
    category: "KAPITEL_5_MEDIEN",
    title: "5.3 Abfallerfassung und -entsorgung nach GewAbfV",
    praxisProblem:
      "Vermüllung der Baustelle, erhöhte Brandlasten und hohe Entsorgungskosten durch ungetrennte Abfallhaufen.",
    content:
      "Abfälle sind gemäß Gewerbeabfallverordnung (GewAbfV) getrennt in die bereitgestellten Container (Bauschutt, Holz, Metall, Mischabfall, Sonderabfälle) zu entsorgen. Wilde Ablagerungen werden kostenpflichtig zu Lasten des Verursachers beräumt.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 21,
  },

  // ─── KAPITEL 6: Arbeitsmittel mit Gefährdung mehrerer Unternehmen ────
  {
    category: "KAPITEL_6_ARBEITSMITTEL",
    title: "6.1 Erdbaumaschinen (Gefahrenbereich & Sichtverbindung)",
    praxisProblem:
      "Tödliche Quetsch- und Anfahrunfälle im Schwenkbereich von Baggern und Radladern durch fehlenden Blickkontakt.",
    content:
      "Der Gefahrbereich von Erdbaumaschinen darf grundsätzlich nicht betreten werden. Ist ein Betreten zwingend nötig, muss vorab eindeutiger Blickkontakt mit dem Maschinenführer hergestellt werden. Erdbaumaschinen dürfen nur von beauftragten Personen bedient werden.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 22,
  },
  {
    category: "KAPITEL_6_ARBEITSMITTEL",
    title: "6.2 Gerüste – Freigabe, Prüfung & striktes Umbauverbot",
    praxisProblem:
      "Gerüsteinsturz oder Absturz von Handwerkern durch eigenmächtiges Entfernen von Verankerungen, Geländern oder Belägen durch Folgegewerke.",
    content:
      "Gerüste dürfen erst nach Freigabe durch den Gerüstersteller (grünes Prüfschild nach TRBS 2121 Teil 1 / DIN EN 12811) betreten werden. Der Aufstieg erfolgt ausschließlich über Treppentürme. Eigenmächtige Veränderungen oder Demontagen durch Benutzer sind strengstens verboten.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 23,
  },
  {
    category: "KAPITEL_6_ARBEITSMITTEL",
    title: "6.3 Bauaufzüge, Transportbühnen & Arbeitsbühnen",
    praxisProblem:
      "Herabstürzende Materialien oder Personen durch unbefugte Bedienung, Überlastung und offengelassene Schachttüren.",
    content:
      "Bedienung von Bauaufzügen nur durch schriftlich beauftragte und unterwiesene Personen. Schachttüren und Ladestellenverriegelungen sind stets geschlossen zu halten. Mit Mängeln behaftete Hebezeuge sind sofort stillzulegen und der Bauleitung zu melden.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 24,
  },
  {
    category: "KAPITEL_6_ARBEITSMITTEL",
    title: "6.4 Krane, Lastanschläger & Schwenkbereichsüberschneidung",
    praxisProblem:
      "Herabstürzende Lasten, Kollision von Kranen bei überschneidenden Schwenkbereichen und Absturz von Fertigteilen.",
    content:
      "Kranbetrieb nur durch befähigte Kranführer. Lasten dürfen ausschließlich von nachweislich geschulten Anschlägern (DGUV Information 209-013) angeschlagen werden. Das Schwenken von Lasten über Personen ist verboten. Bei Überschneidung mehrerer Krane gelten strikte Vorfahrts- und Funkregeln.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 25,
  },

  // ─── KAPITEL 7: Gemeinsam genutzte Schutzeinrichtungen gegen Absturz ──
  {
    category: "KAPITEL_7_ABSTURZ",
    title: "7.1 Dreiteiliger Seitenschutz & Deckenöffnungen",
    praxisProblem:
      "Tödliche Absturzunfälle an offenen Deckenrändern, Treppenläufen, Balkonen und Installationsschächten.",
    content:
      "An allen Deckenkanten, Treppenläufen und Wandöffnungen mit Absturzhöhe ab 2,0 m ist lückenlos dreiteiliger Seitenschutz (Oberholm 1,00 m, Zwischenholm, Bordbrett 15 cm) anzubringen (ASR A2.1, DIN EN 13374, DGUV Vorschrift 38 § 5). Boden- und Deckenöffnungen sind unverschiebbar und trittsicher abzudecken.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 26,
  },
  {
    category: "KAPITEL_7_ABSTURZ",
    title: "7.2 Pflicht zur unverzüglichen Wiederherstellung entfernter Sicherungen",
    praxisProblem:
      "Seitenschutz oder Schachtabdeckungen werden für Materialandienungen geöffnet und danach nicht wieder geschlossen – akute Lebensgefahr für nachfolgende Arbeiter!",
    content:
      "Wird ein Seitenschutz für Materialandienung kurzzeitig geöffnet, ist die Stelle während der Arbeiten lückenlos durch Posten zu sichern. Sofort nach Beendigung des Vorgangs ist die Absturzsicherung vor Verlassen des Arbeitsplatzes vollständig und ordnungsgemäß wiederherzustellen.",
    isContractRelevant: true,
    isSiGePlanRelevant: true,
    actionStatus: "GEREGELT",
    orderIndex: 27,
  },
];

export function mapCategoryToINQA(cat: string): string {
  if (cat.startsWith("KAPITEL_")) return cat;
  switch (cat) {
    case "PSA":
      return "KAPITEL_3_VORGABEN";
    case "NOTFALL":
      return "KAPITEL_2_NOTFALL";
    case "ZUFAHRT":
      return "KAPITEL_4_VERKEHR";
    case "ORDNUNG":
    case "ORDNUNG_SAUBERKEIT":
      return "KAPITEL_3_VORGABEN";
    case "GERUEST":
    case "MASCHINEN":
      return "KAPITEL_6_ARBEITSMITTEL";
    case "ABSTURZ":
      return "KAPITEL_7_ABSTURZ";
    case "ALLGEMEIN":
    default:
      return "KAPITEL_1_ALLGEMEIN";
  }
}

export function getChapterMeta(categoryId: string): INQAChapter {
  const mapped = mapCategoryToINQA(categoryId);
  return (
    INQA_CHAPTERS.find((c) => c.id === mapped) || INQA_CHAPTERS[0]
  );
}
