import { PrismaClient } from "@prisma/client";
import { INITIAL_HAZARDS_CATALOG } from "../lib/sample-catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starte Datenbank-Seeding für SiGeKo_Planer...");

  // 1. Katalog-Einträge leeren und neu befüllen
  await prisma.hazardCatalogItem.deleteMany({});
  for (const item of INITIAL_HAZARDS_CATALOG) {
    await prisma.hazardCatalogItem.create({
      data: item,
    });
  }
  console.log(`✓ ${INITIAL_HAZARDS_CATALOG.length} Standard-Gefährdungskatalogeinträge angelegt.`);

  // 2. Projekte leeren und neu anlegen
  await prisma.project.deleteMany({});
    // Muster-Projekt anlegen
    const project = await prisma.project.create({
      data: {
        projectNumber: "SIGE-2026-001",
        name: "Neubau Wohn- und Geschäftsquartier 'Am Stadtpark'",
        description: "Errichtung eines 5-geschossigen Wohn- und Geschäftshauses mit Tiefgarage und 36 Wohneinheiten.",
        location: "Stadtparkallee 14-16, 10115 Berlin",
        clientName: "Stadtpark Quartier Projektentwicklungs GmbH",
        clientAddress: "Friedrichstraße 200, 10117 Berlin",
        clientContact: "Frau Dipl.-Kfm. Sabine Becker (Tel: 030-889920-10)",
        coordinatorName: "Dipl.-Ing. Christian Meyer (SiGeKo)",
        coordinatorCert: "Zertifiziert nach RAB 30 Anlagen B & C (Arbeitsschutzfachliche Kenntnisse & SiGe-Koordination)",
        coordinatorContact: "meyer@sigeko-ingenieure.de | 0171-5544332",
        siteManager: "Herr Bauing. Markus Weber (Bau AG)",
        plannedStart: new Date("2026-04-01"),
        plannedEnd: new Date("2027-11-30"),
        status: "AUSFUEHRUNG",
      },
    });

    console.log(`✓ Muster-Projekt erstellt: ${project.name}`);

    // Gewerke / Unternehmen anlegen
    const c1 = await prisma.contractor.create({
      data: {
        projectId: project.id,
        companyName: "Nordbau Generalbau AG",
        trade: "Rohbau & Massivbau",
        contactPerson: "Markus Weber",
        phone: "0172-1234567",
        email: "weber@nordbau-ag.de",
        workerCount: 22,
        startDate: new Date("2026-04-15"),
        endDate: new Date("2026-12-20"),
      },
    });

    const c2 = await prisma.contractor.create({
      data: {
        projectId: project.id,
        companyName: "Meister-Gerüstbau GmbH & Co. KG",
        trade: "Fassaden- & Schutzgerüst",
        contactPerson: "Klaus Gerüstner",
        phone: "030-998877",
        email: "info@meister-geruestbau.de",
        workerCount: 6,
        startDate: new Date("2026-05-01"),
        endDate: new Date("2027-08-30"),
      },
    });

    const c3 = await prisma.contractor.create({
      data: {
        projectId: project.id,
        companyName: "Dach & Wand Meisterbetrieb GmbH",
        trade: "Dachabdichtung & Spengler",
        contactPerson: "Thomas Decker",
        phone: "0170-4455667",
        email: "decker@dachundwand.de",
        workerCount: 8,
        startDate: new Date("2026-09-01"),
        endDate: new Date("2027-02-28"),
      },
    });

    const c4 = await prisma.contractor.create({
      data: {
        projectId: project.id,
        companyName: "Elektro-Tec Starkstromanlagen GmbH",
        trade: "Baustrom & Elektroinstallation",
        contactPerson: "Jens Volt",
        phone: "030-11223344",
        email: "baustrom@elektro-tec.de",
        workerCount: 4,
        startDate: new Date("2026-04-01"),
        endDate: new Date("2027-11-15"),
      },
    });

    // Vorankündigung nach § 2 BaustellV
    await prisma.advanceNotice.create({
      data: {
        projectId: project.id,
        authorityName: "Landesamt für Arbeitsschutz, Gesundheitsschutz und technische Sicherheit Berlin (LAGetSi)",
        authorityAddress: "Turmstraße 21, 10559 Berlin",
        noticeDate: new Date("2026-03-15"),
        maxWorkersSimultaneous: 42,
        estimatedTotalWorkDays: 14500,
        hasSpecialRisks: true,
        noticeRequired: true,
        submittedDate: new Date("2026-03-18"),
        status: "AUSGEHAENGT",
        notes: "Vorankündigung formgerecht übermittelt und wetterfest am Hauptzugangstor der Baustelle ausgehängt.",
      },
    });

    // SiGe-Plan Einträge nach RAB 31
    const sigeEntries = [
      {
        projectId: project.id,
        phase: "1. Baustelleneinrichtung & Tiefbau",
        trade: "Erdarbeiten & Verbau",
        activity: "Baugrubenaushub (Tiefe bis 4,80 m) und Trägerbohlverbau",
        hazards: "Verschüttung von Personen bei Böschungsrutschung, Einbruch von Baumaschinen am Grabenrand.",
        isAnnex2SpecialHazard: true,
        spatialTemporalOverlap: "Kollision von Baggern und Muldenkippern im Bereich der Ausfahrt Stadtparkallee.",
        commonMeasures: "Trägerbohlverbau nach statischer Berechnung. Freihalten eines 1,00 m breiten Schutzstreifens am Rand. Einweisung durch Bauleiter.",
        responsibleCompany: "Nordbau AG / Tiefbau Schulz",
        regulations: "DIN 4124, DGUV Regel 101-038, BaustellV Anhang II Nr. 1",
        priority: "HOCH",
        orderIndex: 1,
      },
      {
        projectId: project.id,
        phase: "2. Rohbauarbeiten",
        trade: "Rohbau / Betonbau",
        activity: "Verlegung von Filigrandecken und Ortbeton im 2. und 3. Obergeschoss",
        hazards: "Absturz von Personen an ungesicherten Deckenrändern (> 2,00 m) und in Deckendurchbrüchen.",
        isAnnex2SpecialHazard: false,
        spatialTemporalOverlap: "Gerüstbau und Betonarbeiten finden zeitgleich an der Nordfassade statt.",
        commonMeasures: "Dreiteiliger Seitenschutz an Deckenrändern. Sofortige, trittfeste Abdeckung und Kennzeichnung aller Deckendurchbrüche. Schutzhelmpflicht für alle Gewerke.",
        responsibleCompany: "Nordbau Generalbau AG",
        regulations: "ASR A2.1, DGUV Vorschrift 38 § 5",
        priority: "NORMAL",
        orderIndex: 2,
      },
      {
        projectId: project.id,
        phase: "2. Rohbauarbeiten",
        trade: "Kranbetrieb & Hebezeuge",
        activity: "Turmdrehkran Potain MDT 219 (Ausladung 60 m, Hakenhöhe 38 m)",
        hazards: "Kollision mit Gebäudeteilen, Abstürzende Lasten im Schwenkbereich über Arbeitsplätzen.",
        isAnnex2SpecialHazard: false,
        spatialTemporalOverlap: "Kranschwenkbereich überdeckt gesamten Rohbau und Zufahrtsbereich.",
        commonMeasures: "Überflug von Aufenthaltscontainern und öffentlichem Gehweg elektronisch verriegelt. Anschläger nur mit Befähigungsnachweis. Funkkommunikation.",
        responsibleCompany: "Nordbau Generalbau AG (Kranführer)",
        regulations: "BetrSichV, DGUV Vorschrift 52, DGUV Information 209-013",
        priority: "HOCH",
        orderIndex: 3,
      },
      {
        projectId: project.id,
        phase: "3. Fassade & Gerüst",
        trade: "Gerüstbau",
        activity: "Aufbau des Fassadengerüsts bis 18 m Höhe",
        hazards: "Absturz von Gerüstbauern bei Montage. Absturz von Werkzeugen auf darunterliegende Verkehrswege.",
        isAnnex2SpecialHazard: true, // Absturz > 7m Anhang II Nr. 1
        spatialTemporalOverlap: "Verkehrsweg am Haupteingang verläuft unter Gerüstaufbau.",
        commonMeasures: "Montagesicherungsgeländer (MSG) in oberster Gerüstlage. Passantenschutz-Tunnel / Schutzdach am Haupteingang errichten. Freigabeprüfung nach TRBS 2121.",
        responsibleCompany: "Meister-Gerüstbau GmbH",
        regulations: "TRBS 2121 Teil 1, BaustellV Anhang II Nr. 1",
        priority: "HOCH",
        orderIndex: 4,
      },
      {
        projectId: project.id,
        phase: "4. Dachabdichtung",
        trade: "Dachdecker & Klempner",
        activity: "Verlegung von Dampfsperre und Bitumenbahnen mit Schweißbrenner auf Flachdach",
        hazards: "Brandgefahr durch offene Flamme, Entzündung von Dämmstoffen, Absturz an der Attikakante.",
        isAnnex2SpecialHazard: true, // Absturz > 7m
        spatialTemporalOverlap: "Unterhalb der Dacharbeiten finden Rohinstallationen im Dachgeschoss statt.",
        commonMeasures: "Feuererlaubnisschein durch SiGeKo/Bauleiter erforderlich. Bereitstellung von 2x 6kg ABC-Pulverlöschern direkt auf dem Dach. Brandwache 2 Stunden nach Flammarbeiten.",
        responsibleCompany: "Dach & Wand Meisterbetrieb GmbH",
        regulations: "ASR A2.2, DGUV Regel 100-500 Kap. 2.26, VdS 2047, BaustellV Anhang II",
        priority: "HOCH",
        orderIndex: 5,
      },
    ];

    for (const entry of sigeEntries) {
      await prisma.siGePlanEntry.create({ data: entry });
    }

    // Baustellenordnung anlegen
    const rules = [
      {
        projectId: project.id,
        category: "PSA",
        title: "Persönliche Schutzausrüstung (PSA-Pflicht)",
        content: "Auf der gesamten Baustelle gilt ab Betreten Helmpflicht (DIN EN 397) und Sicherheitsschuhe S3. Bei Lärmarbeiten (>85 dB(A)) Gehörschutz tragen.",
        orderIndex: 1,
      },
      {
        projectId: project.id,
        category: "NOTFALL",
        title: "Notfallkette & Erste Hilfe",
        content: "Notruf 112. Rettungspunkt Baustelle: 'Notfalltreffpunkt Tor 1, Stadtparkallee'. Verbandkasten Typ C und Augenspülflasche im Bauleitercontainer.",
        orderIndex: 2,
      },
      {
        projectId: project.id,
        category: "ORDNUNG_SAUBERKEIT",
        title: "Tägliche Beräumung & Fluchtwege",
        content: "Flucht- und Rettungswege sowie Treppenhäuser sind zu jedem Zeitpunkt absolut freizuhalten. Arbeitsstellen sind vor Feierabend besenrein zu hinterlassen.",
        orderIndex: 3,
      },
      {
        projectId: project.id,
        category: "ALLGEMEIN",
        title: "Alkohol- und Drogenverbot / Rauchverbot",
        content: "Auf der gesamten Baustelle gilt striktes Alkohol- und Drogenverbot. Rauchen ist ausschließlich in der ausgewiesenen Raucherzone bei Baucontainer 3 gestattet.",
        orderIndex: 4,
      },
      {
        projectId: project.id,
        category: "ZUFAHRT",
        title: "Zufahrts- und Parkordnung",
        content: "Geschwindigkeit max. 10 km/h. LKW-Anlieferungen müssen 24h vorher beim SiGeKo/Logistikkoordinator angemeldet werden. Parken nur auf ausgewiesenen Stellplätzen.",
        orderIndex: 5,
      },
    ];

    for (const rule of rules) {
      await prisma.siteRule.create({ data: rule });
    }

    // Unterlage für spätere Arbeiten nach RAB 32
    const subsequent = [
      {
        projectId: project.id,
        component: "Flachdach (Hauptdach)",
        workType: "Regelmäßige Dachinspektion, Reinigung der Dachabläufe und Wartung der Photovoltaikanlage",
        hazards: "Absturz von Personen über die Attikakante (Höhe 16,50 m).",
        safetyMeasures: "Permanentes Seilsicherungssystem (Sekuranten / Anschlagpunkte nach DIN EN 795 Typ C) entlang der Dachfläche installiert. Anschlagöse am Dachausstieg vorhanden.",
        documentationLocation: "Revisionsordner Haustechnik / SiGe-Akte bei Hausverwaltung",
        notes: "Jährliche Prüfung der Anschlageinrichtungen durch Sachkundigen gem. DGUV Grundsatz 312-906.",
      },
      {
        projectId: project.id,
        component: "Glasfassade Atrium / Treppenhaus",
        workType: "Fenster- und Fassadenreinigung",
        hazards: "Absturz bei Arbeiten in Höhen über 8,00 m.",
        safetyMeasures: "Fassadenbefahranlage oder zugelassene Hubarbeitsbühne über befestigten Innenhof-Zufahrtsweg. Bodenseitige Lastverteilerplatten vorhalten.",
        documentationLocation: "Betriebsanleitung Befahranlage Ordner C4",
        notes: "Wartungsvertrag für Hebebühne zwingend erforderlich.",
      },
    ];

    for (const sub of subsequent) {
      await prisma.subsequentWork.create({ data: sub });
    }

    // Baubegehung und Mängel erfassen
    const inspection = await prisma.siteInspection.create({
      data: {
        projectId: project.id,
        date: new Date("2026-06-12T10:00:00Z"),
        inspector: "Dipl.-Ing. Christian Meyer (SiGeKo)",
        participants: "Herr Weber (Bau AG), Herr Decker (Dachdecker)",
        weather: "Sonnig, 22°C, windstill",
        constructionProgress: "Rohbau 2. OG fertiggestellt, Schalung 3. OG in Vorbereitung. Gerüst steht bis Lage 4.",
        overallImpression: "MAENGEL_FESTGESTELLT",
        summary: "Grundsätzlich geordnete Baustelle, jedoch Nachlässigkeiten bei Deckenrandabsicherungen und Baustromverteilern festgestellt.",
      },
    });

    await prisma.inspectionDefect.create({
      data: {
        inspectionId: inspection.id,
        projectId: project.id,
        description: "Fehlender dreiteiliger Seitenschutz an der Deckenkante Südwest im 2. OG.",
        location: "2. Obergeschoss, Deckenkante Südwest (Achse D/4-6)",
        severity: "HOCH",
        tradeAssigned: "Nordbau Generalbau AG",
        deadline: new Date("2026-06-14T16:00:00Z"),
        status: "IN_BEARBEITUNG",
      },
    });

    await prisma.inspectionDefect.create({
      data: {
        inspectionId: inspection.id,
        projectId: project.id,
        description: "Baustromverteiler Schrank BV-2 nicht verschlossen, Verlängerungskabel über Fahrweg ungeschützt verlegt.",
        location: "Zufahrtsbereich Tor 1 neben Containeranlage",
        severity: "MITTEL",
        tradeAssigned: "Elektro-Tec Starkstromanlagen GmbH",
        deadline: new Date("2026-06-13T12:00:00Z"),
        status: "BEHOBEN",
        resolvedAt: new Date("2026-06-13T11:30:00Z"),
        resolutionNote: "Kabelschutzbrücke montiert und Verteilerschrank mit Vorhängeschloss gesichert.",
      },
    });

    await prisma.inspectionDefect.create({
      data: {
        inspectionId: inspection.id,
        projectId: project.id,
        description: "Durchtrittschutz an Deckenöffnung (Installationsschacht) lose und nicht gegen Verrutschen gesichert.",
        location: "2. Obergeschoss, Schacht Treppenhaus B",
        severity: "GEFAHR_IM_VERZUG",
        tradeAssigned: "Nordbau Generalbau AG",
        deadline: new Date("2026-06-12T14:00:00Z"),
        status: "BEHOBEN",
        resolvedAt: new Date("2026-06-12T13:45:00Z"),
        resolutionNote: "Sofort vor Ort durch Bauleiter fest mit Kanthölzern verschraubt und mit Signalstreifen markiert.",
      },
    });

    console.log(`✓ Begehungsprotokoll und Mängel angelegt.`);

  console.log("🎉 Seeding erfolgreich abgeschlossen!");
}

main()
  .catch((e) => {
    console.error("❌ Fehler beim Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
