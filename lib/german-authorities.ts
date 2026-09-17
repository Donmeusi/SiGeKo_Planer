/**
 * Datenbank der zuständigen Arbeitsschutz- und Gewerbeaufsichtsbehörden
 * in allen 16 deutschen Bundesländern für die Vorankündigung gem. § 2 BaustellV.
 */

export interface AuthorityInfo {
  id: string;
  name: string;
  shortName: string;
  department: string;
  address: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
  onlinePortalUrl?: string;
  portalName?: string;
  regionCoverage: string;
}

export interface BundeslandInfo {
  id: string;
  name: string;
  code: string;
  authorities: AuthorityInfo[];
}

export const GERMAN_BUNDESLAENDER_AUTHORITIES: BundeslandInfo[] = [
  // ─── 1. Baden-Württemberg ──────────────────────────────────────────
  {
    id: "BW",
    name: "Baden-Württemberg",
    code: "DE-BW",
    authorities: [
      {
        id: "bw-stuttgart",
        name: "Regierungspräsidium Stuttgart – Abteilung 5: Umwelt und Arbeitsschutz",
        shortName: "RP Stuttgart (Abt. 5 Arbeitsschutz)",
        department: "Referat 54.1 – Baustellenüberwachung und Arbeitszeitschutz",
        address: "Ruppmannstraße 21, 70565 Stuttgart",
        postalCode: "70565",
        city: "Stuttgart",
        phone: "+49 711 904-0",
        email: "abteilung5@rps.bwl.de",
        onlinePortalUrl: "https://www.service-bw.de/leistung/-/sbw/Baustelle++Vorankuendigung+uebermitteln-1491-leistung-0",
        portalName: "Service-BW Online-Portal",
        regionCoverage: "Stadtkreis Stuttgart, Landkreise Böblingen, Esslingen, Göppingen, Ludwigsburg, Rems-Murr-Kreis, Heilbronn, Schwäbisch Hall, Main-Tauber",
      },
      {
        id: "bw-karlsruhe",
        name: "Regierungspräsidium Karlsruhe – Abteilung 5: Umwelt und Arbeitsschutz",
        shortName: "RP Karlsruhe (Abt. 5 Arbeitsschutz)",
        department: "Referat 54 – Betrieblicher Arbeitsschutz",
        address: "Markgrafenstraße 46, 76133 Karlsruhe",
        postalCode: "76133",
        city: "Karlsruhe",
        phone: "+49 721 926-0",
        email: "abteilung5@rpk.bwl.de",
        onlinePortalUrl: "https://www.service-bw.de/leistung/-/sbw/Baustelle++Vorankuendigung+uebermitteln-1491-leistung-0",
        portalName: "Service-BW Online-Portal",
        regionCoverage: "Stadtkreise Karlsruhe, Baden-Baden, Heidelberg, Mannheim; Landkreise Karlsruhe, Rastatt, Rhein-Neckar-Kreis, Neckar-Odenwald, Calw, Enzkreis, Freudenstadt",
      },
      {
        id: "bw-freiburg",
        name: "Regierungspräsidium Freiburg – Abteilung 5: Umwelt und Arbeitsschutz",
        shortName: "RP Freiburg (Abt. 5 Arbeitsschutz)",
        department: "Referat 54 – Arbeitsschutz",
        address: "Bissierstraße 7, 79114 Freiburg i. Br.",
        postalCode: "79114",
        city: "Freiburg im Breisgau",
        phone: "+49 761 208-0",
        email: "abteilung5@rpf.bwl.de",
        onlinePortalUrl: "https://www.service-bw.de/leistung/-/sbw/Baustelle++Vorankuendigung+uebermitteln-1491-leistung-0",
        portalName: "Service-BW Online-Portal",
        regionCoverage: "Stadtkreis Freiburg; Landkreise Breisgau-Hochschwarzwald, Emmendingen, Ortenaukreis, Rottweil, Schwarzwald-Baar, Tuttlingen, Konstanz, Lörrach, Waldshut",
      },
      {
        id: "bw-tuebingen",
        name: "Regierungspräsidium Tübingen – Abteilung 5: Umwelt und Arbeitsschutz",
        shortName: "RP Tübingen (Abt. 5 Arbeitsschutz)",
        department: "Referat 54 – Betrieblicher Arbeitsschutz",
        address: "Konrad-Adenauer-Straße 20, 72072 Tübingen",
        postalCode: "72072",
        city: "Tübingen",
        phone: "+49 7071 757-0",
        email: "abteilung5@rpt.bwl.de",
        onlinePortalUrl: "https://www.service-bw.de/leistung/-/sbw/Baustelle++Vorankuendigung+uebermitteln-1491-leistung-0",
        portalName: "Service-BW Online-Portal",
        regionCoverage: "Stadtkreis Ulm; Landkreise Tübingen, Reutlingen, Zollernalbkreis, Alb-Donau-Kreis, Biberach, Bodenseekreis, Ravensburg, Sigmaringen",
      },
    ],
  },

  // ─── 2. Bayern ─────────────────────────────────────────────────────
  {
    id: "BY",
    name: "Bayern",
    code: "DE-BY",
    authorities: [
      {
        id: "by-muenchen",
        name: "Regierung von Oberbayern – Gewerbeaufsichtsamt München",
        shortName: "GAA München (Oberbayern)",
        department: "Dezernat 3 – Baustellen & Technischer Arbeitsschutz",
        address: "Heßstraße 130, 80797 München",
        postalCode: "80797",
        city: "München",
        phone: "+49 89 2176-0",
        email: "gaa@reg-ob.bayern.de",
        onlinePortalUrl: "https://www.verwaltungsservice.bayern.de/dokumente/leistung/34559560124",
        portalName: "BayernPortal – Vorankündigung Baustelle",
        regionCoverage: "Landeshauptstadt München; Landkreise München, Dachau, Ebersberg, Erding, Freising, Fürstenfeldbruck, Landsberg am Lech, Starnberg, Miesbach, Bad Tölz, Garmisch-Partenkirchen, Weilheim-Schongau, Rosenheim, Berchtesgadener Land, Traunstein, Altötting, Mühldorf, Eichstätt, Neuburg-Schrobenhausen, Pfaffenhofen, Ingolstadt",
      },
      {
        id: "by-nuernberg",
        name: "Regierung von Mittelfranken – Gewerbeaufsichtsamt Nürnberg",
        shortName: "GAA Nürnberg (Mittelfranken)",
        department: "Dezernat 3 – Baustellen- & Arbeitssicherheit",
        address: "Roonstraße 20, 90429 Nürnberg",
        postalCode: "90429",
        city: "Nürnberg",
        phone: "+49 911 928-0",
        email: "gaa@reg-mfr.bayern.de",
        onlinePortalUrl: "https://www.verwaltungsservice.bayern.de/dokumente/leistung/34559560124",
        portalName: "BayernPortal",
        regionCoverage: "Städte Nürnberg, Fürth, Erlangen, Schwabach, Ansbach; Landkreise Nürnberger Land, Fürth, Erlangen-Höchstadt, Roth, Weißenburg-Gunzenhausen, Ansbach, Neustadt a.d.Aisch-Bad Windsheim",
      },
      {
        id: "by-augsburg",
        name: "Regierung von Schwaben – Gewerbeaufsichtsamt Augsburg",
        shortName: "GAA Augsburg (Schwaben)",
        department: "Dezernat Baustellensicherheit",
        address: "Morellstraße 30 d, 86159 Augsburg",
        postalCode: "86159",
        city: "Augsburg",
        phone: "+49 821 327-01",
        email: "gaa@reg-schw.bayern.de",
        onlinePortalUrl: "https://www.verwaltungsservice.bayern.de/dokumente/leistung/34559560124",
        portalName: "BayernPortal",
        regionCoverage: "Städte Augsburg, Kaufbeuren, Kempten, Memmingen; Landkreise Aichach-Friedberg, Augsburg, Dillingen, Donau-Ries, Günzburg, Lindau, Neu-Ulm, Oberallgäu, Ostallgäu, Unterallgäu",
      },
      {
        id: "by-wuerzburg",
        name: "Regierung von Unterfranken – Gewerbeaufsichtsamt Würzburg",
        shortName: "GAA Würzburg (Unterfranken)",
        department: "Dezernat Arbeitsschutz",
        address: "Georg-Eydel-Straße 13, 97082 Würzburg",
        postalCode: "97082",
        city: "Würzburg",
        phone: "+49 931 380-00",
        email: "gaa@reg-ufr.bayern.de",
        onlinePortalUrl: "https://www.verwaltungsservice.bayern.de/dokumente/leistung/34559560124",
        portalName: "BayernPortal",
        regionCoverage: "Städte Aschaffenburg, Schweinfurt, Würzburg; Landkreise Aschaffenburg, Bad Kissingen, Haßberge, Kitzingen, Main-Spessart, Miltenberg, Rhön-Grabfeld, Schweinfurt, Würzburg",
      },
      {
        id: "by-regensburg",
        name: "Regierung der Oberpfalz – Gewerbeaufsichtsamt Regensburg",
        shortName: "GAA Regensburg (Oberpfalz)",
        department: "Dezernat Baustellenschutz",
        address: "Bertoldstraße 2, 93047 Regensburg",
        postalCode: "93047",
        city: "Regensburg",
        phone: "+49 941 5680-0",
        email: "gaa@reg-opf.bayern.de",
        onlinePortalUrl: "https://www.verwaltungsservice.bayern.de/dokumente/leistung/34559560124",
        portalName: "BayernPortal",
        regionCoverage: "Städte Regensburg, Amberg, Weiden; Landkreise Amberg-Sulzbach, Cham, Neumarkt i.d.OPf., Neustadt a.d.Waldnaab, Regensburg, Schwandorf, Tirschenreuth",
      },
      {
        id: "by-landshut",
        name: "Regierung von Niederbayern – Gewerbeaufsichtsamt Landshut",
        shortName: "GAA Landshut (Niederbayern)",
        department: "Dezernat Arbeitsschutz",
        address: "Gestütstraße 10, 84028 Landshut",
        postalCode: "84028",
        city: "Landshut",
        phone: "+49 871 808-01",
        email: "gaa@reg-ndb.bayern.de",
        onlinePortalUrl: "https://www.verwaltungsservice.bayern.de/dokumente/leistung/34559560124",
        portalName: "BayernPortal",
        regionCoverage: "Städte Landshut, Passau, Straubing; Landkreise Deggendorf, Dingolfing-Landau, Freyung-Grafenau, Kelheim, Landshut, Passau, Regen, Rottal-Inn, Straubing-Bogen",
      },
      {
        id: "by-coburg",
        name: "Regierung von Oberfranken – Gewerbeaufsichtsamt Coburg",
        shortName: "GAA Coburg (Oberfranken)",
        department: "Dezernat Baustellenüberwachung",
        address: "Oberer Bürglaß 34-36, 96450 Coburg",
        postalCode: "96450",
        city: "Coburg",
        phone: "+49 9561 7419-0",
        email: "gaa@reg-ofr.bayern.de",
        onlinePortalUrl: "https://www.verwaltungsservice.bayern.de/dokumente/leistung/34559560124",
        portalName: "BayernPortal",
        regionCoverage: "Städte Bamberg, Bayreuth, Coburg, Hof; Landkreise Bamberg, Bayreuth, Coburg, Forchheim, Hof, Kronach, Kulmbach, Lichtenfels, Wunsiedel i.Fichtelgebirge",
      },
    ],
  },

  // ─── 3. Berlin ─────────────────────────────────────────────────────
  {
    id: "BE",
    name: "Berlin",
    code: "DE-BE",
    authorities: [
      {
        id: "be-lagetsi",
        name: "LAGetSi – Landesamt für Arbeitsschutz, Gesundheitsschutz und technische Sicherheit Berlin",
        shortName: "LAGetSi Berlin",
        department: "Referat III B – Baustellen und Bauarbeitsschutz",
        address: "Turmstraße 21, Haus M, 10559 Berlin",
        postalCode: "10559",
        city: "Berlin",
        phone: "+49 30 902545-0",
        email: "post@lagetsi.berlin.de",
        onlinePortalUrl: "https://service.berlin.de/dienstleistung/326857/",
        portalName: "Serviceportal Berlin – Vorankündigung Baustelle",
        regionCoverage: "Gesamtes Landesgebiet Berlin (alle 12 Bezirke: Mitte, Friedrichshain-Kreuzberg, Pankow, Charlottenburg-Wilmersdorf, Spandau, Steglitz-Zehlendorf, Tempelhof-Schöneberg, Neukölln, Treptow-Köpenick, Marzahn-Hellersdorf, Lichtenberg, Reinickendorf)",
      },
    ],
  },

  // ─── 4. Brandenburg ────────────────────────────────────────────────
  {
    id: "BB",
    name: "Brandenburg",
    code: "DE-BB",
    authorities: [
      {
        id: "bb-potsdam",
        name: "LAVG – Landesamt für Arbeitsschutz, Verbraucherschutz und Gesundheit Brandenburg (Regionalbereich West)",
        shortName: "LAVG Potsdam (Bereich West)",
        department: "Abteilung Arbeitsschutz – Dezernat AS 1",
        address: "Horstweg 57, 14478 Potsdam",
        postalCode: "14478",
        city: "Potsdam",
        phone: "+49 331 8683-0",
        email: "poststelle@lavg.brandenburg.de",
        onlinePortalUrl: "https://service.brandenburg.de/service/de/adressen/weitere-verzeichnisse/behoerdenverzeichnis/landesamt-fuer-arbeitsschutz-verbraucherschutz-und-gesundheit-lavg~12967",
        portalName: "Serviceportal Brandenburg",
        regionCoverage: "Potsdam, Brandenburg an der Havel; Landkreise Havelland, Potsdam-Mittelmark, Teltow-Fläming",
      },
      {
        id: "bb-cottbus",
        name: "LAVG Brandenburg – Regionalbereich Süd",
        shortName: "LAVG Cottbus (Bereich Süd)",
        department: "Dezernat Arbeitsschutz Süd",
        address: "Vom-Stein-Straße 30, 03050 Cottbus",
        postalCode: "03050",
        city: "Cottbus",
        phone: "+49 355 4991-0",
        email: "poststelle@lavg.brandenburg.de",
        regionCoverage: "Stadt Cottbus; Landkreise Dahme-Spreewald, Elbe-Elster, Oberspreewald-Lausitz, Spree-Neiße",
      },
      {
        id: "bb-frankfurt",
        name: "LAVG Brandenburg – Regionalbereich Ost",
        shortName: "LAVG Frankfurt/Oder (Bereich Ost)",
        department: "Dezernat Arbeitsschutz Ost",
        address: "Müllroser Chaussee 50, 15236 Frankfurt (Oder)",
        postalCode: "15236",
        city: "Frankfurt (Oder)",
        phone: "+49 335 5582-0",
        email: "poststelle@lavg.brandenburg.de",
        regionCoverage: "Stadt Frankfurt (Oder); Landkreise Barnim, Märkisch-Oderland, Oder-Spree, Uckermark",
      },
    ],
  },

  // ─── 5. Bremen ─────────────────────────────────────────────────────
  {
    id: "HB",
    name: "Bremen",
    code: "DE-HB",
    authorities: [
      {
        id: "hb-bremen",
        name: "Gewerbeaufsicht des Landes Bremen – Dienstsitz Bremen",
        shortName: "Gewerbeaufsicht Bremen",
        department: "Fachbereich 2 – Technischer Arbeitsschutz & Baustellen",
        address: "Lange Straße 119, 28195 Bremen",
        postalCode: "28195",
        city: "Bremen",
        phone: "+49 421 361-6260",
        email: "office@gewerbeaufsicht.bremen.de",
        onlinePortalUrl: "https://www.service.bremen.de/dienstleistungen/vorankuendigung-fuer-baustellen-uebermitteln-13936",
        portalName: "BürgerService Bremen",
        regionCoverage: "Stadtgemeinde Bremen",
      },
      {
        id: "hb-bremerhaven",
        name: "Gewerbeaufsicht des Landes Bremen – Dienstsitz Bremerhaven",
        shortName: "Gewerbeaufsicht Bremerhaven",
        department: "Fachbereich Arbeitsschutz Bremerhaven",
        address: "Kaiserstraße 30, 27568 Bremerhaven",
        postalCode: "27568",
        city: "Bremerhaven",
        phone: "+49 471 596-13200",
        email: "office-bhv@gewerbeaufsicht.bremen.de",
        regionCoverage: "Stadtgemeinde Bremerhaven und Überseehafengebiet",
      },
    ],
  },

  // ─── 6. Hamburg ────────────────────────────────────────────────────
  {
    id: "HH",
    name: "Hamburg",
    code: "DE-HH",
    authorities: [
      {
        id: "hh-arbeitsschutz",
        name: "Amt für Arbeitsschutz – Behörde für Justiz und Verbraucherschutz Hamburg",
        shortName: "Amt für Arbeitsschutz Hamburg",
        department: "Abteilung AS 2 – Technischer Arbeitsschutz und Baustellen",
        address: "Billstraße 80, 20539 Hamburg",
        postalCode: "20539",
        city: "Hamburg",
        phone: "+49 40 42837-0",
        email: "arbeitsschutz@justiz.hamburg.de",
        onlinePortalUrl: "https://www.hamburg.de/service/entry/10311227/",
        portalName: "Hamburg Serviceportal – Vorankündigung Baustelle",
        regionCoverage: "Freie und Hansestadt Hamburg (alle 7 Bezirke: Hamburg-Mitte, Altona, Eimsbüttel, Hamburg-Nord, Wandsbek, Bergedorf, Harburg)",
      },
    ],
  },

  // ─── 7. Hessen ─────────────────────────────────────────────────────
  {
    id: "HE",
    name: "Hessen",
    code: "DE-HE",
    authorities: [
      {
        id: "he-darmstadt",
        name: "Regierungspräsidium Darmstadt – Abteilung Arbeitsschutz",
        shortName: "RP Darmstadt (Arbeitsschutz)",
        department: "Dezernat 25.1 – Baustellen & Bauarbeitsschutz",
        address: "Wilhelminenstraße 1-3, 64283 Darmstadt",
        postalCode: "64283",
        city: "Darmstadt",
        phone: "+49 6151 12-0",
        email: "arbeitsschutz-darmstadt@rpda.hessen.de",
        onlinePortalUrl: "https://verwaltungsportal.hessen.de/leistung?leistung_id=L100001_114522956",
        portalName: "Verwaltungsportal Hessen",
        regionCoverage: "Frankfurt am Main, Wiesbaden, Darmstadt, Offenbach; Landkreise Bergstraße, Darmstadt-Dieburg, Groß-Gerau, Hochtaunuskreis, Main-Kinzig, Main-Taunus, Odenwald, Offenbach, Rheingau-Taunus, Wetterau",
      },
      {
        id: "he-giessen",
        name: "Regierungspräsidium Gießen – Abteilung Arbeitsschutz",
        shortName: "RP Gießen (Arbeitsschutz)",
        department: "Dezernat 25 – Baustellenüberwachung",
        address: "Südanlage 17, 35390 Gießen",
        postalCode: "35390",
        city: "Gießen",
        phone: "+49 641 303-0",
        email: "arbeitsschutz@rpgi.hessen.de",
        onlinePortalUrl: "https://verwaltungsportal.hessen.de",
        portalName: "Verwaltungsportal Hessen",
        regionCoverage: "Landkreise Gießen, Lahn-Dill-Kreis, Limburg-Weilburg, Marburg-Biedenkopf, Vogelsbergkreis",
      },
      {
        id: "he-kassel",
        name: "Regierungspräsidium Kassel – Abteilung Arbeitsschutz",
        shortName: "RP Kassel (Arbeitsschutz)",
        department: "Dezernat 25 – Baustellen",
        address: "Am Alten Stadtschloss 1, 34117 Kassel",
        postalCode: "34117",
        city: "Kassel",
        phone: "+49 561 106-0",
        email: "arbeitsschutz@rpks.hessen.de",
        onlinePortalUrl: "https://verwaltungsportal.hessen.de",
        portalName: "Verwaltungsportal Hessen",
        regionCoverage: "Stadt Kassel; Landkreise Fulda, Hersfeld-Rotenburg, Kassel, Schwalm-Eder, Waldeck-Frankenberg, Werra-Meißner",
      },
    ],
  },

  // ─── 8. Mecklenburg-Vorpommern ─────────────────────────────────────
  {
    id: "MV",
    name: "Mecklenburg-Vorpommern",
    code: "DE-MV",
    authorities: [
      {
        id: "mv-rostock",
        name: "LAGuS – Landesamt für Gesundheit und Soziales MV (Abteilung Arbeitsschutz)",
        shortName: "LAGuS MV (Rostock)",
        department: "Dezernat Technischer Arbeitsschutz / Baustellen",
        address: "Erich-Schlesinger-Straße 35, 18059 Rostock",
        postalCode: "18059",
        city: "Rostock",
        phone: "+49 381 331-59000",
        email: "arbeitsschutz@lagus.mv-regierung.de",
        onlinePortalUrl: "https://www.lagus.mv-regierung.de/Arbeitsschutz/",
        portalName: "LAGuS Portal MV",
        regionCoverage: "Hansestadt Rostock, Landeshauptstadt Schwerin; Landkreise Rostock, Ludwigslust-Parchim, Nordwestmecklenburg, Vorpommern-Rügen, Vorpommern-Greifswald, Mecklenburgische Seenplatte",
      },
    ],
  },

  // ─── 9. Niedersachsen ──────────────────────────────────────────────
  {
    id: "NI",
    name: "Niedersachsen",
    code: "DE-NI",
    authorities: [
      {
        id: "ni-hannover",
        name: "Staatliches Gewerbeaufsichtsamt Hannover",
        shortName: "GAA Hannover",
        department: "Dezernat 3 – Baustellen & technischer Arbeitsschutz",
        address: "Am Listholze 74, 30177 Hannover",
        postalCode: "30177",
        city: "Hannover",
        phone: "+49 511 9096-0",
        email: "poststelle@gaa-h.niedersachsen.de",
        onlinePortalUrl: "https://service.niedersachsen.de/detail?pstId=8665977",
        portalName: "Serviceportal Niedersachsen",
        regionCoverage: "Region Hannover, Landkreise Diepholz, Nienburg, Schaumburg",
      },
      {
        id: "ni-braunschweig",
        name: "Staatliches Gewerbeaufsichtsamt Braunschweig",
        shortName: "GAA Braunschweig",
        department: "Dezernat Baustellensicherheit",
        address: "Ludwig-Winter-Straße 2, 38120 Braunschweig",
        postalCode: "38120",
        city: "Braunschweig",
        phone: "+49 531 8888-0",
        email: "poststelle@gaa-bs.niedersachsen.de",
        regionCoverage: "Städte Braunschweig, Salzgitter, Wolfsburg; Landkreise Gifhorn, Goslar, Helmstedt, Peine, Wolfenbüttel",
      },
      {
        id: "ni-oldenburg",
        name: "Staatliches Gewerbeaufsichtsamt Oldenburg",
        shortName: "GAA Oldenburg",
        department: "Dezernat Baustellen",
        address: "Theodor-Tantzen-Platz 8, 26122 Oldenburg",
        postalCode: "26122",
        city: "Oldenburg",
        phone: "+49 441 799-0",
        email: "poststelle@gaa-ol.niedersachsen.de",
        regionCoverage: "Städte Oldenburg, Delmenhorst, Wilhelmshaven; Landkreise Ammerland, Cloppenburg, Friesland, Oldenburg, Vechta, Wesermarsch",
      },
      {
        id: "ni-osnabrueck",
        name: "Staatliches Gewerbeaufsichtsamt Osnabrück",
        shortName: "GAA Osnabrück",
        department: "Dezernat Arbeitsschutz",
        address: "Johann-Domann-Straße 10, 49080 Osnabrück",
        postalCode: "49080",
        city: "Osnabrück",
        phone: "+49 541 503-0",
        email: "poststelle@gaa-os.niedersachsen.de",
        regionCoverage: "Stadt Osnabrück; Landkreise Emsland, Grafschaft Bentheim, Osnabrück",
      },
      {
        id: "ni-lueneburg",
        name: "Staatliches Gewerbeaufsichtsamt Lüneburg",
        shortName: "GAA Lüneburg",
        department: "Dezernat Baustellensicherheit",
        address: "Auf der Hude 2, 21339 Lüneburg",
        postalCode: "21339",
        city: "Lüneburg",
        phone: "+49 4131 15-1400",
        email: "poststelle@gaa-lg.niedersachsen.de",
        regionCoverage: "Landkreise Harburg, Lüchow-Dannenberg, Lüneburg, Uelzen",
      },
    ],
  },

  // ─── 10. Nordrhein-Westfalen (NRW) ─────────────────────────────────
  {
    id: "NW",
    name: "Nordrhein-Westfalen",
    code: "DE-NW",
    authorities: [
      {
        id: "nw-duesseldorf",
        name: "Bezirksregierung Düsseldorf – Dezernat 56: Betrieblicher Arbeitsschutz",
        shortName: "Bezirksregierung Düsseldorf (Dez. 56)",
        department: "Dezernat 56 – Baustellenüberwachung",
        address: "Am Bonneshof 35, 40474 Düsseldorf",
        postalCode: "40474",
        city: "Düsseldorf",
        phone: "+49 211 475-0",
        email: "poststelle@brd.nrw.de",
        onlinePortalUrl: "https://service.wirtschaft.nrw/online-antraege/vorankuendigung-einer-baustelle-gemaess-ss-2-der-baustellenverordnung",
        portalName: "Wirtschafts-Service-Portal NRW",
        regionCoverage: "Städte Düsseldorf, Duisburg, Essen, Krefeld, Mönchengladbach, Mülheim an der Ruhr, Oberhausen, Remscheid, Solingen, Wuppertal; Kreise Kleve, Mettmann, Rhein-Kreis Neuss, Viersen, Wesel",
      },
      {
        id: "nw-koeln",
        name: "Bezirksregierung Köln – Dezernat 56: Betrieblicher Arbeitsschutz",
        shortName: "Bezirksregierung Köln (Dez. 56)",
        department: "Dezernat 56 – Baustellen- & Technischer Arbeitsschutz",
        address: "Zeughausstraße 2-10, 50667 Köln",
        postalCode: "50667",
        city: "Köln",
        phone: "+49 221 147-0",
        email: "poststelle@bezreg-koeln.nrw.de",
        onlinePortalUrl: "https://service.wirtschaft.nrw/online-antraege/vorankuendigung-einer-baustelle-gemaess-ss-2-der-baustellenverordnung",
        portalName: "Wirtschafts-Service-Portal NRW",
        regionCoverage: "Städte Köln, Bonn, Aachen, Leverkusen; Kreise Aachen (Städteregion), Düren, Euskirchen, Heinsberg, Oberbergischer Kreis, Rhein-Erft-Kreis, Rhein-Sieg-Kreis, Rheinisch-Bergischer Kreis",
      },
      {
        id: "nw-muenster",
        name: "Bezirksregierung Münster – Dezernat 56: Betrieblicher Arbeitsschutz",
        shortName: "Bezirksregierung Münster (Dez. 56)",
        department: "Dezernat 56 – Arbeitsschutz auf Baustellen",
        address: "Domplatz 1-3, 48143 Münster",
        postalCode: "48143",
        city: "Münster",
        phone: "+49 251 411-0",
        email: "poststelle@brms.nrw.de",
        onlinePortalUrl: "https://service.wirtschaft.nrw/online-antraege/vorankuendigung-einer-baustelle-gemaess-ss-2-der-baustellenverordnung",
        portalName: "Wirtschafts-Service-Portal NRW",
        regionCoverage: "Städte Münster, Bottrop, Gelsenkirchen; Kreise Borken, Coesfeld, Recklinghausen, Steinfurt, Warendorf",
      },
      {
        id: "nw-arnsberg",
        name: "Bezirksregierung Arnsberg – Dezernat 56: Betrieblicher Arbeitsschutz",
        shortName: "Bezirksregierung Arnsberg (Dez. 56)",
        department: "Dezernat 56 – Betrieblicher Arbeitsschutz",
        address: "Seibertzstraße 1, 59821 Arnsberg",
        postalCode: "59821",
        city: "Arnsberg",
        phone: "+49 2931 82-0",
        email: "poststelle@bra.nrw.de",
        onlinePortalUrl: "https://service.wirtschaft.nrw/online-antraege/vorankuendigung-einer-baustelle-gemaess-ss-2-der-baustellenverordnung",
        portalName: "Wirtschafts-Service-Portal NRW",
        regionCoverage: "Städte Bochum, Dortmund, Hagen, Hamm, Herne; Ennepe-Ruhr-Kreis, Hochsauerlandkreis, Märkischer Kreis, Kreis Olpe, Kreis Siegen-Wittgenstein, Kreis Soest, Kreis Unna",
      },
      {
        id: "nw-detmold",
        name: "Bezirksregierung Detmold – Dezernat 56: Betrieblicher Arbeitsschutz",
        shortName: "Bezirksregierung Detmold (Dez. 56)",
        department: "Dezernat 56 – Arbeitsschutz",
        address: "Leopoldstraße 15, 32756 Detmold",
        postalCode: "32756",
        city: "Detmold",
        phone: "+49 5231 71-0",
        email: "poststelle@bezreg-detmold.nrw.de",
        onlinePortalUrl: "https://service.wirtschaft.nrw/online-antraege/vorankuendigung-einer-baustelle-gemaess-ss-2-der-baustellenverordnung",
        portalName: "Wirtschafts-Service-Portal NRW",
        regionCoverage: "Stadt Bielefeld; Kreise Gütersloh, Herford, Höxter, Lippe, Minden-Lübbecke, Paderborn",
      },
    ],
  },

  // ─── 11. Rheinland-Pfalz ───────────────────────────────────────────
  {
    id: "RP",
    name: "Rheinland-Pfalz",
    code: "DE-RP",
    authorities: [
      {
        id: "rp-sgd-nord",
        name: "Struktur- und Genehmigungsdirektion Nord (SGD Nord) – Gewerbeaufsicht",
        shortName: "SGD Nord (Koblenz)",
        department: "Abteilung 4 – Gewerbeaufsicht / Baustellen",
        address: "Stresemannstraße 3-5, 56068 Koblenz",
        postalCode: "56068",
        city: "Koblenz",
        phone: "+49 261 120-0",
        email: "poststelle@sgdnord.rlp.de",
        onlinePortalUrl: "https://sgdnord.rlp.de/themen/arbeitsschutz/baustellensicherheit",
        portalName: "SGD Nord Portal",
        regionCoverage: "Städte Koblenz, Trier; Landkreise Ahrweiler, Altenkirchen, Bad Kreuznach, Birkenfeld, Cochem-Zell, Mayen-Koblenz, Neuwied, Rhein-Hunsrück, Rhein-Lahn, Westerwaldkreis, Bernkastel-Wittlich, Eifelkreis Bitburg-Prüm, Vulkaneifel, Trier-Saarburg",
      },
      {
        id: "rp-sgd-sued",
        name: "Struktur- und Genehmigungsdirektion Süd (SGD Süd) – Gewerbeaufsicht",
        shortName: "SGD Süd (Neustadt an der Weinstraße)",
        department: "Abteilung 3 – Gewerbeaufsicht",
        address: "Friedrich-Ebert-Straße 14, 67433 Neustadt an der Weinstraße",
        postalCode: "67433",
        city: "Neustadt an der Weinstraße",
        phone: "+49 6321 99-0",
        email: "poststelle@sgdsued.rlp.de",
        regionCoverage: "Städte Mainz, Ludwigshafen, Kaiserslautern, Worms, Speyer, Neustadt, Frankenthal, Pirmasens, Landau, Zweibrücken; Landkreise Mainz-Bingen, Alzey-Worms, Bad Dürkheim, Germersheim, Kaiserslautern, Kusel, Südliche Weinstraße, Rhein-Pfalz-Kreis, Südwestpfalz, Donnersbergkreis",
      },
    ],
  },

  // ─── 12. Saarland ──────────────────────────────────────────────────
  {
    id: "SL",
    name: "Saarland",
    code: "DE-SL",
    authorities: [
      {
        id: "sl-lua",
        name: "Landesamt für Umwelt- und Arbeitsschutz Saarland (LUA)",
        shortName: "LUA Saarland",
        department: "Geschäftsbereich 3 – Arbeitsschutz & Produktsicherheit",
        address: "Don-Bosco-Straße 1, 66119 Saarbrücken",
        postalCode: "66119",
        city: "Saarbrücken",
        phone: "+49 681 8500-0",
        email: "poststelle@lua.saarland.de",
        onlinePortalUrl: "https://www.saarland.de/lua/DE/themen/arbeitsschutz/arbeitsschutz_node.html",
        portalName: "LUA Saarland Portal",
        regionCoverage: "Gesamtes Saarland (Regionalverband Saarbrücken; Landkreise Merzig-Wadern, Neunkirchen, Saarlouis, Saarpfalz-Kreis, St. Wendel)",
      },
    ],
  },

  // ─── 13. Sachsen ───────────────────────────────────────────────────
  {
    id: "SN",
    name: "Sachsen",
    code: "DE-SN",
    authorities: [
      {
        id: "sn-dresden",
        name: "Landesdirektion Sachsen – Dienststelle Dresden (Referat Arbeitsschutz)",
        shortName: "Landesdirektion Sachsen (Dresden)",
        department: "Referat 53 – Technischer Arbeitsschutz & Baustellen",
        address: "Stauffenbergallee 2, 01099 Dresden",
        postalCode: "01099",
        city: "Dresden",
        phone: "+49 351 825-0",
        email: "post@lds.sachsen.de",
        onlinePortalUrl: "https://amt24.sachsen.de/leistung/-/sbw/Baustelle+vorankuendigen-6001097-leistung-0",
        portalName: "Amt24 Sachsen – Vorankündigung Baustelle",
        regionCoverage: "Landeshauptstadt Dresden; Landkreise Bautzen, Görlitz, Meißen, Sächsische Schweiz-Osterzgebirge",
      },
      {
        id: "sn-leipzig",
        name: "Landesdirektion Sachsen – Dienststelle Leipzig",
        shortName: "Landesdirektion Sachsen (Leipzig)",
        department: "Referat 53 – Arbeitsschutz",
        address: "Braustraße 2, 04107 Leipzig",
        postalCode: "04107",
        city: "Leipzig",
        phone: "+49 341 977-0",
        email: "post@lds.sachsen.de",
        onlinePortalUrl: "https://amt24.sachsen.de",
        portalName: "Amt24 Sachsen",
        regionCoverage: "Stadt Leipzig; Landkreise Leipzig, Nordsachsen",
      },
      {
        id: "sn-chemnitz",
        name: "Landesdirektion Sachsen – Dienststelle Chemnitz",
        shortName: "Landesdirektion Sachsen (Chemnitz)",
        department: "Referat 53 – Arbeitsschutz",
        address: "Altchemnitzer Straße 41, 09120 Chemnitz",
        postalCode: "09120",
        city: "Chemnitz",
        phone: "+49 371 532-0",
        email: "post@lds.sachsen.de",
        onlinePortalUrl: "https://amt24.sachsen.de",
        portalName: "Amt24 Sachsen",
        regionCoverage: "Stadt Chemnitz; Erzgebirgskreis, Mittelsachsen, Vogtlandkreis, Zwickau",
      },
    ],
  },

  // ─── 14. Sachsen-Anhalt ────────────────────────────────────────────
  {
    id: "ST",
    name: "Sachsen-Anhalt",
    code: "DE-ST",
    authorities: [
      {
        id: "st-lav-magdeburg",
        name: "Landesamt für Verbraucherschutz Sachsen-Anhalt – Fachbereich Arbeitsschutz (Nord)",
        shortName: "LAV Sachsen-Anhalt (Magdeburg)",
        department: "Dezernat 52 – Technischer Arbeitsschutz",
        address: "Große Steinernetischstraße 4, 39104 Magdeburg",
        postalCode: "39104",
        city: "Magdeburg",
        phone: "+49 391 2564-0",
        email: "poststelle@lav.ms.sachsen-anhalt.de",
        onlinePortalUrl: "https://buerger.sachsen-anhalt.de/detail?pstId=8665977",
        portalName: "Bürgerportal Sachsen-Anhalt",
        regionCoverage: "Landeshauptstadt Magdeburg; Landkreise Börde, Jerichower Land, Stendal, Altmarkkreis Salzwedel, Harz",
      },
      {
        id: "st-lav-dessau",
        name: "Landesamt für Verbraucherschutz Sachsen-Anhalt – Fachbereich Arbeitsschutz (Süd/Ost)",
        shortName: "LAV Sachsen-Anhalt (Dessau-Roßlau / Halle)",
        department: "Dezernat 53 – Baustellensicherheit",
        address: "Kühnauer Straße 161, 06846 Dessau-Roßlau",
        postalCode: "06846",
        city: "Dessau-Roßlau",
        phone: "+49 340 6501-0",
        email: "poststelle@lav.ms.sachsen-anhalt.de",
        regionCoverage: "Städte Dessau-Roßlau, Halle (Saale); Landkreise Anhalt-Bitterfeld, Wittenberg, Saalekreis, Burgenlandkreis, Mansfeld-Südharz",
      },
    ],
  },

  // ─── 15. Schleswig-Holstein ────────────────────────────────────────
  {
    id: "SH",
    name: "Schleswig-Holstein",
    code: "DE-SH",
    authorities: [
      {
        id: "sh-kiel",
        name: "Staatliche Arbeitsschutzbehörde bei der Unfallkasse Nord (StArb-UK Nord)",
        shortName: "StArb-UK Nord (Kiel)",
        department: "Abteilung 2 – Technischer Arbeitsschutz & Baustellen",
        address: "Seekoppelweg 5 a, 24113 Kiel",
        postalCode: "24113",
        city: "Kiel",
        phone: "+49 431 6407-0",
        email: "poststelle-kiel@uk-nord.de",
        onlinePortalUrl: "https://serviceportal.schleswig-holstein.de/Verwaltungsportal/Service/Entry/BAUSTELLE",
        portalName: "Serviceportal Schleswig-Holstein",
        regionCoverage: "Gesamtes Land Schleswig-Holstein (Kiel, Lübeck, Flensburg, Neumünster; Kreise Dithmarschen, Herzogtum Lauenburg, Nordfriesland, Ostholstein, Pinneberg, Plön, Rendsburg-Eckernförde, Schleswig-Flensburg, Segeberg, Steinburg, Stormarn)",
      },
    ],
  },

  // ─── 16. Thüringen ─────────────────────────────────────────────────
  {
    id: "TH",
    name: "Thüringen",
    code: "DE-TH",
    authorities: [
      {
        id: "th-erfurt",
        name: "Thüringer Landesamt für Verbraucherschutz (TLV) – Abteilung Arbeitsschutz (Regionalinspektion Mittelthüringen)",
        shortName: "TLV Thüringen (Erfurt)",
        department: "Dezernat 22 – Baustellen- & Technischer Arbeitsschutz",
        address: "Tennstedter Straße 8/9, 99084 Erfurt",
        postalCode: "99084",
        city: "Erfurt",
        phone: "+49 361 57-3811111",
        email: "poststelle@tlv.thueringen.de",
        onlinePortalUrl: "https://service.thueringen.de/detail?pstId=8665977",
        portalName: "Thüringer Serviceportal",
        regionCoverage: "Landeshauptstadt Erfurt, Stadt Weimar; Landkreise Gotha, Ilm-Kreis, Sömmerda, Weimarer Land, Kyffhäuserkreis, Unstrut-Hainich",
      },
      {
        id: "th-gera",
        name: "Thüringer Landesamt für Verbraucherschutz – Regionalinspektion Ostthüringen",
        shortName: "TLV Thüringen (Gera)",
        department: "Dezernat 23 – Arbeitsschutz Ost",
        address: "Hermann-Drechsler-Straße 1, 07548 Gera",
        postalCode: "07548",
        city: "Gera",
        phone: "+49 361 57-3811300",
        email: "poststelle@tlv.thueringen.de",
        regionCoverage: "Städte Gera, Jena; Landkreise Altenburger Land, Greiz, Saale-Holzland-Kreis, Saale-Orla-Kreis, Saalfeld-Rudolstadt",
      },
      {
        id: "th-suhl",
        name: "Thüringer Landesamt für Verbraucherschutz – Regionalinspektion Südthüringen",
        shortName: "TLV Thüringen (Suhl)",
        department: "Dezernat 24 – Arbeitsschutz Süd",
        address: "Werrahof 1, 98527 Suhl",
        postalCode: "98527",
        city: "Suhl",
        phone: "+49 361 57-3811400",
        email: "poststelle@tlv.thueringen.de",
        regionCoverage: "Stadt Suhl, Eisenach; Landkreise Hildburghausen, Schmalkalden-Meiningen, Sonneberg, Wartburgkreis",
      },
    ],
  },
];

/**
 * Erkennt anhand der Standort-Angabe (PLZ oder Städtenamen)
 * das passende Bundesland und ggf. die Behörde.
 */
export function detectStateFromLocation(locationStr: string): {
  stateId?: string;
  authorityId?: string;
} {
  if (!locationStr) return {};
  const lower = locationStr.toLowerCase();

  // PLZ-Prüfung (2-stellig)
  const plzMatch = locationStr.match(/\b([0-9]{5})\b/);
  if (plzMatch) {
    const plz2 = plzMatch[1].substring(0, 2);
    const num = parseInt(plz2, 10);

    // Grobe Zuordnung über Leitbereiche der Deutschen Post
    if (num >= 10 && num <= 14) return { stateId: "BE" }; // Berlin & z.T. Brandenburg
    if (num >= 20 && num <= 22) return { stateId: "HH" }; // Hamburg
    if (num >= 26 && num <= 28) return { stateId: "HB" }; // Bremen / Oldenburg
    if (num >= 66 && num <= 66) return { stateId: "SL" }; // Saarland
    if (num >= 40 && num <= 59) return { stateId: "NW" }; // NRW
    if (num >= 80 && num <= 89) return { stateId: "BY" }; // München / Bayern Süd
    if (num >= 90 && num <= 96) return { stateId: "BY" }; // Franken / Bayern Nord
    if (num >= 70 && num <= 79) return { stateId: "BW" }; // Baden-Württemberg
    if (num >= 60 && num <= 65) return { stateId: "HE" }; // Hessen (Rhein-Main)
    if (num >= 30 && num <= 31) return { stateId: "NI" }; // Hannover
    if (num >= 1 && num <= 4) return { stateId: "SN" };   // Dresden / Leipzig
    if (num >= 6 && num <= 9) return { stateId: "ST" };   // Halle / Sachsen-Anhalt
    if (num >= 98 && num <= 99) return { stateId: "TH" }; // Thüringen
    if (num >= 23 && num <= 25) return { stateId: "SH" }; // Schleswig-Holstein
    if (num >= 17 && num <= 19) return { stateId: "MV" }; // Mecklenburg-Vorpommern
  }

  // Städtenamen-Fallback
  if (lower.includes("münchen") || lower.includes("nürnberg") || lower.includes("augsburg") || lower.includes("regensburg") || lower.includes("würzburg")) return { stateId: "BY" };
  if (lower.includes("berlin")) return { stateId: "BE" };
  if (lower.includes("hamburg")) return { stateId: "HH" };
  if (lower.includes("köln") || lower.includes("düsseldorf") || lower.includes("dortmund") || lower.includes("essen") || lower.includes("münster") || lower.includes("bonn") || lower.includes("aachen")) return { stateId: "NW" };
  if (lower.includes("stuttgart") || lower.includes("karlsruhe") || lower.includes("freiburg") || lower.includes("mannheim") || lower.includes("heidelberg") || lower.includes("ulm")) return { stateId: "BW" };
  if (lower.includes("frankfurt") || lower.includes("wiesbaden") || lower.includes("kassel") || lower.includes("darmstadt")) return { stateId: "HE" };
  if (lower.includes("hannover") || lower.includes("braunschweig") || lower.includes("osnabrück") || lower.includes("oldenburg")) return { stateId: "NI" };
  if (lower.includes("dresden") || lower.includes("leipzig") || lower.includes("chemnitz")) return { stateId: "SN" };
  if (lower.includes("bremen") || lower.includes("bremerhaven")) return { stateId: "HB" };
  if (lower.includes("potsdam") || lower.includes("cottbus")) return { stateId: "BB" };
  if (lower.includes("kiel") || lower.includes("lübeck") || lower.includes("flensburg")) return { stateId: "SH" };
  if (lower.includes("erfurt") || lower.includes("jena") || lower.includes("weimar") || lower.includes("gera")) return { stateId: "TH" };
  if (lower.includes("magdeburg") || lower.includes("halle")) return { stateId: "ST" };
  if (lower.includes("rostock") || lower.includes("schwerin")) return { stateId: "MV" };
  if (lower.includes("mainz") || lower.includes("koblenz") || lower.includes("trier") || lower.includes("kaiserslautern")) return { stateId: "RP" };
  if (lower.includes("saarbrücken")) return { stateId: "SL" };

  return {};
}
