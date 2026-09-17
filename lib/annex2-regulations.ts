/**
 * Anhang II der Baustellenverordnung (BaustellV)
 * 
 * Verzeichnis der Arbeiten, bei deren Ausführung Beschäftigte besonders gefährlichen
 * Arbeiten ausgesetzt sind, für die nach § 2 Abs. 1 Satz 2 BaustellV eine Vorankündigung
 * erforderlich ist sowie nach § 2 Abs. 3 ein Sicherheits- und Gesundheitsschutzplan (SiGe-Plan)
 * zu erstellen ist.
 */

export interface Annex2RegulationItem {
  id: string;
  number: number;
  title: string;
  shortLabel: string;
  legalText: string;
  description: string;
  praxisExamples: string[];
  relevantTrades: string[];
  hazardKeywords: string[];
}

export const ANNEX_2_REGULATIONS: Annex2RegulationItem[] = [
  {
    id: "annex2-1",
    number: 1,
    title: "Nr. 1: Absturzgefahr (> 5 m) & Verschüttung (Baugruben / Gräben)",
    shortLabel: "Absturz > 5 m / Verschüttungsgefahr",
    legalText:
      "Arbeiten, bei denen die Beschäftigten der Gefahr des Versinkens oder des Verschüttetwerdens in Baugruben oder Gräben oder des Absturzes aus einer Höhe von mehr als 5 Metern ausgesetzt sind.",
    description:
      "Besonders gefährliche Arbeiten bei großen Absturzhöhen ab 5 m (z. B. auf Dächern, Deckenschalungen, Gerüsten) sowie Erdarbeiten in unverbauten oder tieferen Baugruben und Leitungsgräben.",
    praxisExamples: [
      "Arbeiten auf Hallendächern, Flachdächern oder Steildächern mit Absturzhöhe > 5 m",
      "Aufbau und Ausschalen von Decken und Wänden in Obergeschossen (> 5 m)",
      "Montage und Umbau von Arbeits- und Schutzgerüsten über 5 m Höhe",
      "Aushub- und Verlegearbeiten in Rohr- und Baugruben mit Tiefe > 1,25 m / Böschungsrutschgefahr",
      "Fassaden- und Balkonmontagen in oberen Stockwerken",
    ],
    relevantTrades: ["Rohbau / Stahlbeton", "Dachdecker & Zimmerer", "Gerüstbau", "Tiefbau & Erdarbeiten", "Fassadenbau"],
    hazardKeywords: ["Absturz", "Baugrube", "Verschüttung", "Graben", "Gerüst", "Dach"],
  },
  {
    id: "annex2-2",
    number: 2,
    title: "Nr. 2: Gefahrstoffe (KMR, toxisch, explosiv) & Biostoffe (Gruppe 3/4)",
    shortLabel: "Gefahrstoffe (Asbest, PAK, KMR) / Biostoffe",
    legalText:
      "Arbeiten, bei denen die Beschäftigten explosionsgefährlichen, hochentzündlichen, krebserzeugenden (Kategorie 1A oder 1B), erbgutverändernden, fruchtbarkeitsgefährdenden oder sehr giftigen Stoffen oder Zubereitungen im Sinne der Gefahrstoffverordnung oder biologischen Arbeitsstoffen der Risikogruppe 3 oder 4 im Sinne der Biostoffverordnung ausgesetzt sind.",
    description:
      "Sanierungs-, Abbruch- oder Entkernungsarbeiten mit Freisetzung hochtoxischer oder krebserzeugender Gefahrstoffe sowie Arbeiten in mit biologischen Krankheitserregern belasteten Bereichen.",
    praxisExamples: [
      "Demontage von schwach oder fest gebundenem Asbest (TRGS 519 / ASI-Arbeiten)",
      "Entfernung alter künstlicher Mineralfasern (KMF nach TRGS 521 / Altwolle)",
      "Rückbau von teer- und PAK-haltigen Parkettklebern, Dachbahnen oder Asphalt (TRGS 551)",
      "Arbeiten in kontaminierten Bereichen, Deponien oder Altlasten (DGUV Regel 101-004 / BGR 128)",
      "Schimmelpilzsanierung mit hoher Sporenkonzentration (Risikogruppe 3)",
      "Entfernung alter bleihaltiger Anstriche oder PCB-haltiger Fugendichtstoffe",
    ],
    relevantTrades: ["Schadstoffsanierung", "Abbruch & Entkernung", "Bautenschutz", "Trockenbau", "Maler & Lackierer"],
    hazardKeywords: ["Asbest", "KMF", "PAK", "Schimmel", "Altlasten", "Gefahrstoff", "Bleifarben"],
  },
  {
    id: "annex2-3",
    number: 3,
    title: "Nr. 3: Arbeiten mit ionisierender Strahlung",
    shortLabel: "Ionisierende Strahlung / Radiologie",
    legalText:
      "Arbeiten mit ionisierenden Strahlen, die die Festlegung von Kontroll- oder Überwachungsbereichen nach der Strahlenschutzverordnung erfordern.",
    description:
      "Umgang mit radioaktiven Prüfstrahlern oder Röntgenanlagen auf der Baustelle, z. B. im Rahmen von Schweißnaht- oder Materialprüfungen im Industrie- und Rohrleitungsbau.",
    praxisExamples: [
      "Zerstörungsfreie Schweißnahtprüfung mittels Gammastrahler (Isotopenprüfung z. B. Iridium-192)",
      "Durchstrahlungsprüfung von hochbelasteten Stahlbaukonstruktionen oder Gasleitungen",
      "Einsatz radiometrischer Dichte- und Feuchtemesssonden im Erdbau",
    ],
    relevantTrades: ["Qualitätssicherung / Werkstoffprüfung", "Rohrleitungsbau", "Industrie- & Anlagenbau"],
    hazardKeywords: ["Strahlung", "Röntgen", "Gammastrahler", "Prüfstrahler", "Strahlenschutz"],
  },
  {
    id: "annex2-4",
    number: 4,
    title: "Nr. 4: Arbeiten nahe Hochspannungsleitungen & unter Spannung",
    shortLabel: "Hochspannungsleitungen (< 5 m) / Arbeiten unter Spannung",
    legalText:
      "Arbeiten in einer Entfernung von weniger als 5 Metern von Hochspannungsleitungen oder Arbeiten an unter Spannung stehenden elektrischen Anlagen.",
    description:
      "Gefahr des elektrischen Schlages oder Lichtbogenbildung durch Annäherung von Baumaschinen oder Gerüsten an Freileitungen sowie direkte Arbeiten an spannungsführenden Verteilungen.",
    praxisExamples: [
      "Kran-, Bagger- oder Betonpumpeneinsatz im Schutzstreifen von Freileitungen (< 5 m Sicherheitsabstand)",
      "Gerüsterstellung in der Nähe von ungeschützten elektrischen Oberleitungen",
      "Erneuerung oder Umbau von Hauptverteilungen unter Spannung (AuS nach DGUV Vorschrift 3)",
      "Erdarbeiten im Bereich nicht freigeschalteter Hochspannungskabel-Trassen",
    ],
    relevantTrades: ["Elektroinstallation", "Tiefbau", "Kran- & Hebetechnik", "Gerüstbau"],
    hazardKeywords: ["Hochspannung", "Freileitung", "Lichtbogen", "Stromschlag", "Kran", "AuS"],
  },
  {
    id: "annex2-5",
    number: 5,
    title: "Nr. 5: Gefahr des Ertrinkens",
    shortLabel: "Gefahr des Ertrinkens / Arbeiten am Wasser",
    legalText:
      "Arbeiten, bei denen die Gefahr des Ertrinkens besteht.",
    description:
      "Baumaßnahmen unmittelbar an, auf oder über fließenden oder stehenden Gewässern sowie in gefüllten oder gefluteten Becken.",
    praxisExamples: [
      "Brückenbau-, Instandsetzungs- oder Abbrucharbeiten über Flüssen oder Schifffahrtswegen",
      "Arbeiten an Hafenanlagen, Kaimauern, Schleusen oder Wehren",
      "Einbringen von Spundwänden oder Pfählen vom Ponton/Schiff aus",
      "Bau- und Sanierungsarbeiten an Klärbecken, Hochwasserrückhaltebecken oder Talsperren",
    ],
    relevantTrades: ["Wasserbau", "Brückenbau", "Tiefbau", "Spezialtiefbau"],
    hazardKeywords: ["Ertrinken", "Gewässer", "Wasserbau", "Brücke", "Ponton", "Kaimauer"],
  },
  {
    id: "annex2-6",
    number: 6,
    title: "Nr. 6: Brunnen, Schächte & unterirdische Hohlräume",
    shortLabel: "Brunnen, Schächte & unterirdische Hohlräume",
    legalText:
      "Arbeiten in Brunnen, Schächten und unterirdischen Hohlräumen.",
    description:
      "Tätigkeiten in beengten, tiefen oder unterirdischen Räumen mit Erstickungs-, Vergiftungs- (Gasansammlung) oder Einsturzgefahren.",
    praxisExamples: [
      "Tunnel-, Stollen- und bergmännische Vortriebsarbeiten",
      "Einsteigen und Arbeiten in Revisions-, Abwasser- und Tiefenschächten (> 1,25 m)",
      "Inspektion und Sanierung von Fernwärmekanälen oder unterirdischen Leitungstrassen",
      "Bohrbrunnenbau und Arbeiten in Sickerschächten",
    ],
    relevantTrades: ["Kanal- & Rohrleitungsbau", "Tunnelbau", "Spezialtiefbau", "Brunnenbau"],
    hazardKeywords: ["Schacht", "Kanal", "Tunnel", "Hohlraum", "Gase", "Erstickung"],
  },
  {
    id: "annex2-7",
    number: 7,
    title: "Nr. 7: Taucherarbeiten",
    shortLabel: "Taucherarbeiten / Unterwassereinsatz",
    legalText:
      "Arbeiten mit Tauchgeräten.",
    description:
      "Unterwasser-Montage-, Inspektions- und Schneidarbeiten durch geprüfte Berufstaucher mit autonomem oder schlauchversorgtem Tauchgerät.",
    praxisExamples: [
      "Unterwasser-Betonierarbeiten und Fundamentsetzungen",
      "Unterwasserschweißen oder thermisches Trennen von Spundwandelementen",
      "Inspektion von Dükerleitungen, Talsperren-Grundablässen oder Schleusentoren",
      "Bergen von Hindernissen im Schifffahrtskanal",
    ],
    relevantTrades: ["Berufstaucherei", "Wasserbau & Spezialbau"],
    hazardKeywords: ["Tauchen", "Tauchgerät", "Unterwasser", "Druck", "Berufstaucher"],
  },
  {
    id: "annex2-8",
    number: 8,
    title: "Nr. 8: Arbeiten in Druckluft",
    shortLabel: "Druckluftarbeiten / Caissonbetrieb",
    legalText:
      "Arbeiten in Druckluft.",
    description:
      "Spezialtiefbau unter Überdruck zur Verdrängung von Grundwasser, z. B. in Druckluftsenkkästen oder Druckluft-Tunnelvortrieben (Druckluftverordnung).",
    praxisExamples: [
      "Aushub- und Gründungsarbeiten in Caissons (Überdruck-Senkkästen)",
      "Wartung und Schneidradwechsel bei Druckluftbeaufschlagung in Tunnelbohrmaschinen (TBM)",
      "Pfeilergründungen im Grundwasserbereich unter Überdruck",
    ],
    relevantTrades: ["Spezialtiefbau", "Tunnelbau / Maschineller Vortrieb"],
    hazardKeywords: ["Druckluft", "Caisson", "Überdruck", "Dekompression"],
  },
  {
    id: "annex2-9",
    number: 9,
    title: "Nr. 9: Einsatz von Sprengstoff",
    shortLabel: "Sprengarbeiten / Sprengstoffeinsatz",
    legalText:
      "Arbeiten, bei denen Sprengstoff eingesetzt wird.",
    description:
      "Gezielte Sprengungen zum Abbruch von Bauwerken oder zur Gewinnung/Lockerung von Felsgestein durch befähigte Sprengberechtigte gem. Sprengstoffgesetz.",
    praxisExamples: [
      "Sprengabbruch von Schornsteinen, Brückenüberbauten oder Hochbauten",
      "Felssprengungen für Straßen-, Trassen- oder Baugrubenaushub",
      "Unterwassersprengungen zur Vertiefung von Fahrrinnen",
    ],
    relevantTrades: ["Sprengtechnik & Spezialabbruch", "Fels- & Erdbau"],
    hazardKeywords: ["Sprengung", "Sprengstoff", "Sprengmeister", "Explosion", "Abbruch"],
  },
  {
    id: "annex2-10",
    number: 10,
    title: "Nr. 10: Montage / Demontage schwerer Fertigbauteile",
    shortLabel: "Montage schwerer Fertigbauteile",
    legalText:
      "Aufbau oder Abbau von massiven Fertigbauteilen, deren Gewicht oder Abmessungen besondere Maßnahmen erfordern.",
    description:
      "Heben, Transportieren und Einpassen schwerer vorgefertigter Betonteile, Stahlfachwerke oder Holzbauelemente mit Krananlagen, bei denen Einsturz-, Kipp- oder Quetschgefahr besteht.",
    praxisExamples: [
      "Montage von Spannbetonbindern, Fertigteilstützen und weitgespannten Deckenplatten",
      "Einheben vorgefertigter Stahl- oder Brettschichtholzbinder im Hallenbau",
      "Montage massiver Betonfertigteiltreppen und schwerer Architekturbeton-Fassadenelemente",
      "Aufbau vorgefertigter Raumzellen oder modularer Stahlbetonbauten mit Mobilkranen",
    ],
    relevantTrades: ["Fertigteilmontage", "Stahlbau & Hallenbau", "Holzbau / Ingenieurholzbau", "Kran- & Schwerlastlogistik"],
    hazardKeywords: ["Fertigteil", "Betonteil", "Binder", "Kranmontage", "Stahlbau", "Schwerlast"],
  },
];

/**
 * Hilfsfunktion zum Prüfen und Filtern von Anhang II Einträgen
 */
export function getAnnex2ItemById(id: string): Annex2RegulationItem | undefined {
  return ANNEX_2_REGULATIONS.find((item) => item.id === id);
}

export function parseAnnex2Selection(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fallback falls komma-separiert
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}
