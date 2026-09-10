export interface CatalogItem {
  tradeCategory: string;
  activity: string;
  hazard: string;
  protectiveMeasure: string;
  isAnnex2: boolean;
  regulations: string;
}

export const INITIAL_HAZARDS_CATALOG: CatalogItem[] = [
  // ─── 1. Baustelleneinrichtung & Verkehrswege ──────────────────────────────
  {
    tradeCategory: "Baustelleneinrichtung",
    activity: "Einrichtung von Verkehrs- und Fluchtwegen",
    hazard: "Anfahren von Personen durch Baustellenverkehr, Stolper- und Rutschgefahr",
    protectiveMeasure: "Klare Trennung von Fußgänger- und Fahrzeugverkehr, ausreichende Beleuchtung (>50 Lux), ebene und befestigte Gehwege, Geschwindigkeitsbegrenzung (10 km/h).",
    isAnnex2: false,
    regulations: "ASR A1.8, ASR A3.4, DGUV Vorschrift 38 § 7",
  },
  {
    tradeCategory: "Baustelleneinrichtung",
    activity: "Aufstellung von Bauzäunen und Absperrung zum öffentlichen Verkehrsraum",
    hazard: "Unbefugtes Betreten, Absturz von Passanten in Baugruben",
    protectiveMeasure: "Lückenlose, standfeste Einzäunung (mind. 2,00 m Höhe), sichtbare Beschilderung 'Baustelle - Betreten verboten', Baugrubenränder mit mind. 1,00 m Schutzabstand sichern.",
    isAnnex2: false,
    regulations: "RSA 21, DGUV Vorschrift 38 § 5",
  },
  {
    tradeCategory: "Baustelleneinrichtung",
    activity: "Aufstellung und Betrieb des Baustromverteilers",
    hazard: "Elektrischer Schlag, Überlastung, Feuchtigkeitsschäden",
    protectiveMeasure: "Verwendung zugelassener Baustromverteiler mit RCD (Fehlerstrom-Schutzeinrichtung Typ B bzw. Typ A 30mA), regelmäßige DGUV V3 Prüfung, Verlegung von Kabeln geschützt vor Überfahren.",
    isAnnex2: false,
    regulations: "DGUV Information 203-006, DIN VDE 0100-704",
  },

  // ─── 2. Abbruch- & Erdarbeiten ─────────────────────────────────────────────
  {
    tradeCategory: "Erdarbeiten & Tiefbau",
    activity: "Aushub von Baugruben und Gräben",
    hazard: "Einsturz von Böschungen, Verschüttung von Personen",
    protectiveMeasure: "Abböschung nach DIN 4124 einhalten (je nach Bodenart 45° bis 60°) oder lückenlosen Verbau einsetzen. Schutzstreifen von mind. 0,60 m an Grabenrändern freihalten.",
    isAnnex2: true, // Bei > 5m Verschüttungsgefahr gem. Anhang II
    regulations: "DIN 4124, DGUV Regel 101-038, BaustellV Anhang II Nr. 1",
  },
  {
    tradeCategory: "Erdarbeiten & Tiefbau",
    activity: "Baggerarbeiten im Bereich erdverlegter Versorgungsleitungen",
    hazard: "Abriss von Gasleitungen, Stromschlag bei Erdkabeln, Wasserrohrbruch",
    protectiveMeasure: "Leitungsauskunft bei Versorgungsträgern vor Beginn einholen, Leitungen durch Handschachtung freilegen, Sicherheitsabstände für Baumaschinen einhalten.",
    isAnnex2: true,
    regulations: "DIN 4124, DGUV Regel 101-038, DVGW GW 315",
  },
  {
    tradeCategory: "Erdarbeiten & Tiefbau",
    activity: "Arbeiten im Grundwasserbereich / Wasserhaltung",
    hazard: "Ertrinkungsgefahr, Unterspülung von Verbau und Nachbarbauwerken",
    protectiveMeasure: "Zuverlässige Hebe- und Lenzsysteme mit Notstrom, Rettungsringe vorhalten, ständige Überwachung des Grundwasserspiegels.",
    isAnnex2: true, // Ertrinken gem. Anhang II Nr. 4
    regulations: "BaustellV Anhang II Nr. 4, DGUV Regel 101-038",
  },

  // ─── 3. Rohbau & Massivbau ────────────────────────────────────────────────
  {
    tradeCategory: "Rohbau & Betonarbeiten",
    activity: "Arbeiten an Deckenkanten, Wandöffnungen und Treppenläufen",
    hazard: "Absturz von Personen aus Höhen > 2,00 m bzw. Treppenöffnungen",
    protectiveMeasure: "Dreiteiliger Seitenschutz (Geländerholm 1,00 m, Zwischenholm, Bordbrett 15 cm) oder temporäre Deckenrandgeländer; Deckenöffnungen unverrückbar und tragfähig abdecken.",
    isAnnex2: false,
    regulations: "ASR A2.1, DIN EN 13374, DGUV Vorschrift 38 § 5",
  },
  {
    tradeCategory: "Rohbau & Betonarbeiten",
    activity: "Ein- und Ausschalungsarbeiten von Geschossdecken",
    hazard: "Einsturz der Schalung während des Betonierens, herabfallende Schalungsträger beim Ausschalen",
    protectiveMeasure: "Schalungsplanung mit Typenstatik beachten, Aussteifungen und Stützenabstände exakt einhalten, Ausschalbereich absperren, Betondruckfestigkeit vor Ausschalen prüfen.",
    isAnnex2: false,
    regulations: "DIN EN 12812, DGUV Information 201-011",
  },
  {
    tradeCategory: "Rohbau & Betonarbeiten",
    activity: "Kranbetrieb und Transport von Fertigteilen / Betonkübeln",
    hazard: "Abstürzende Lasten, Kollision mit Gerüsten oder Hochspannungsleitungen",
    protectiveMeasure: "Schwenkbereich absichern, Anschläger mit Qualifikationsnachweis, Sichtkontakt Kranführer-Anschläger (oder Sprechfunk), Aufenthalt unter schwebenden Lasten strikt untersagen.",
    isAnnex2: true, // Montage schwerer Fertigteile gem. Anhang II Nr. 9
    regulations: "BetrSichV, DGUV Vorschrift 52, DGUV Information 209-013, BaustellV Anhang II Nr. 9",
  },

  // ─── 4. Gerüstbau ─────────────────────────────────────────────────────────
  {
    tradeCategory: "Gerüstbau",
    activity: "Auf-, Um- und Abbau von Fassadengerüsten",
    hazard: "Absturz von Gerüstmonteuren während der Montage",
    protectiveMeasure: "Verwendung von vorlaufendem Geländer (MSG) oder PSAgA mit geeignetem Anschlagpunkt am Gerüst, Freigabeprüfung nach TRBS 2121 Teil 1 mit Gerüstkennzeichnung (Prüfprotokoll).",
    isAnnex2: true, // Absturzhöhe > 7m gem. Anhang II Nr. 1
    regulations: "TRBS 2121 Teil 1, DIN EN 12811, BaustellV Anhang II Nr. 1",
  },
  {
    tradeCategory: "Gerüstbau",
    activity: "Nutzung des Arbeits- und Schutzgerüsts durch Folgegewerke",
    hazard: "Eigenmächtige Demontage von Verankerungen oder Seitenschutz, Überlastung der Gerüstlagen",
    protectiveMeasure: "Tägliche Sichtprüfung vor Arbeitsaufnahme, Überlastung vermeiden (Lastklasse beachten), eigenmächtige Änderungen strengstens untersagen, Mängel sofort an SiGeKo/Gerüstbauer melden.",
    isAnnex2: false,
    regulations: "DGUV Information 201-011, BetrSichV § 14",
  },

  // ─── 5. Dach- & Fassadenarbeiten ──────────────────────────────────────────
  {
    tradeCategory: "Dach & Fassade",
    activity: "Arbeiten auf geneigten Dächern und Flachdächern",
    hazard: "Absturz über die Traufkante, Durchsturz durch nicht tragfähige Bauteile (z. B. Lichtplatten)",
    protectiveMeasure: "Dachfanggerüste oder Schutzblenden an der Traufe, Verlegegurte/Laufbohlen auf nicht tragfähigen Dachelementen, dauerhafte Anschlageinrichtungen (Sekuranten).",
    isAnnex2: true, // Absturz > 7m Anhang II Nr. 1
    regulations: "ASR A2.1, DGUV Vorschrift 38 § 6, BaustellV Anhang II Nr. 1",
  },
  {
    tradeCategory: "Dach & Fassade",
    activity: "Schweißarbeiten / Heißbitumenarbeiten bei der Dachabdichtung",
    hazard: "Brandgefahr, Verbrennungen, Freisetzung toxischer Dämpfe",
    protectiveMeasure: "Heißarbeitserlaubnisschein (Schweißerlaubnis) einholen, Pulver- und Schaumlöscher (mind. 2x 6kg) direkt an der Arbeitsstelle, 2 Stunden Brandwache nach Arbeitsende.",
    isAnnex2: false,
    regulations: "ASR A2.2, DGUV Regel 100-500 Kap. 2.26, VdS 2047",
  },

  // ─── 6. Ausbau, Haustechnik & Malerarbeiten ───────────────────────────────
  {
    tradeCategory: "Ausbau & TGA",
    activity: "Montage von Rohrleitungen und Lüftungskanälen in Steigschächten",
    hazard: "Absturz in offene Installations- und Aufzugsschächte",
    protectiveMeasure: "Schächte geschossweise mit tragfähigen Bohlen dicht schließen, Schachtöffnungen mit abschließbaren Türen oder verankerter Absturzsicherung versehen.",
    isAnnex2: true, // Brunnen/Schächte gem. Anhang II Nr. 5
    regulations: "BaustellV Anhang II Nr. 5, DGUV Regel 103-003",
  },
  {
    tradeCategory: "Ausbau & TGA",
    activity: "Maler- und Beschichtungsarbeiten mit lösemittelhaltigen Stoffen",
    hazard: "Einatmen toxischer Lösemitteldämpfe, Brand- und Explosionsgefahr in geschlossenen Räumen",
    protectiveMeasure: "Zwangslüftung (technische Lüftung) sicherstellen, Atemschutz (Kombinationsfilter A2P2), Zündquellen fernhalten (Ex-geschützte Lampen), Sicherheitsdatenblätter bereithalten.",
    isAnnex2: true, // Gefährliche Stoffe Anhang II Nr. 2
    regulations: "TRGS 500, TRGS 507, BaustellV Anhang II Nr. 2",
  },
  {
    tradeCategory: "Ausbau & TGA",
    activity: "Schleif- und Fräsarbeiten im Trockenbau und Estrich",
    hazard: "Hohe Staubbelastung (Quarzfeinstaub), Gehörschäden durch Lärm",
    protectiveMeasure: "Verwendung von Werkzeugen mit integrierter Staubabsaugung (Entstauber Klasse M oder H), PSA (Partikelmaske FFP2/FFP3, Gehörschutz ab 85 dB(A)).",
    isAnnex2: false,
    regulations: "TRGS 504, TRGS 559, LärmVibrationsArbSchV",
  },

  // ─── 7. Besondere Gefahren nach Anhang II BaustellV ──────────────────────
  {
    tradeCategory: "Spezialarbeiten (Anhang II)",
    activity: "Arbeiten in der Nähe von elektrischen Freileitungen",
    hazard: "Lichtbogenüberschlag, tödlicher Stromunfall von Kran- und Gerüstbauteilen",
    protectiveMeasure: "Freischaltung und Erdung durch Netzbetreiber beantragen. Falls nicht möglich: Sicherheitsabstände einhalten (bis 1 kV: 1,0 m; 1-110 kV: 3,0 m; >110 kV: 5,0 m) und Schwenkbegrenzer für Krane aktivieren.",
    isAnnex2: true, // Anhang II Nr. 3
    regulations: "DGUV Vorschrift 3, DIN VDE 0105-100, BaustellV Anhang II Nr. 3",
  },
  {
    tradeCategory: "Spezialarbeiten (Anhang II)",
    activity: "Sanierungsarbeiten mit asbesthaltigen Baustoffen oder KMF",
    hazard: "Freisetzung krebserzeugender Asbestfasern, Lungenkrebs, Asbestose",
    protectiveMeasure: "Anzeige bei der Gewerbeaufsichtsbehörde (7 Tage vorab), Sachkundenachweis gem. TRGS 519 (Anlage 3/4), Einhausung mit Unterdruckhaltung, Personen-Dekontaminationsschleuse.",
    isAnnex2: true, // Anhang II Nr. 2
    regulations: "GefStoffV, TRGS 519, BaustellV Anhang II Nr. 2",
  },
];
