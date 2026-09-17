# SiGeKo-Planer

> **Professionelle Web-Software für Sicherheits- und Gesundheitsschutzkoordination auf Baustellen gemäß Baustellenverordnung (BaustellV) und RAB 30 / 31 / 32.**

Der **SiGeKo-Planer** ist eine spezialisierte Anwendung für Sicherheits- und Gesundheitsschutzkoordinatoren (SiGeKo), Bauleiter, Projektsteuerer und Bauherren. Die Anwendung digitalisiert und strukturiert den gesamten gesetzlichen Koordinatorprozess von der Planungsphase bis zur Fertigstellung und Unterlage für spätere Arbeiten.

---

## 🚀 Kernmodule & Funktionen

### 1. 📊 Baustellen-Cockpit & Projektverwaltung
- Zentrale Projektstammdaten (Bauherr, SiGe-Koordinator mit RAB 30 Qualifikation, Bauleitung, Standort, Bauzeiten).
- Executive Dashboard mit Kennzahlen, aktiven Gewerken, offenen Mängeln und Sicherheitsstatus.
- Gewerke- und Auftragnehmerverwaltung mit Nachunternehmerketten, Kontakten und Beschäftigtenzahlen.

### 2. 📋 Vorankündigung nach § 2 BaustellV & Behörden-Finder
- Automatische behördliche Prüflogik zur Ermittlung der gesetzlichen Vorankündigungspflicht:
  - Dauer der Arbeiten > 30 Arbeitstage und mehr als 20 Beschäftigte gleichzeitig
  - Gesamter Arbeitsumfang > 500 Personentage
  - Ausführung besonders gefährlicher Arbeiten nach Anhang II BaustellV
- **Integrierter Behörden-Finder für alle 16 Bundesländer:**
  - 2-stufiges Auswahlmenü zur direkten Übernahme der zuständigen Gewerbeaufsichtsämter, Regierungspräsidien und Landesämter für Arbeitsschutz.
  - Automatische Bauort-Erkennung via Postleitzahl oder Städtenamen des Bauvorhabens.
  - Postanschriften, Telefon, E-Mail und direkte Links zu den offiziellen Landes-Meldungsportalen (Service-BW, BayernPortal, WSP.NRW, Amt24 Sachsen etc.).
- Erstellung, Verwaltung und behördenkonformer DIN A4 Druck zur Übermittlung an die Behörde und als Baustellenaushang.

### 3. 🛡️ Sicherheits- und Gesundheitsschutzplan (SiGe-Plan) nach RAB 31
- Strukturierung nach Bauphasen und Gewerken.
- Erfassung räumlicher und zeitlicher Überschneidungen und gegenseitiger Gefährdungen.
- Zuweisung koordinierter, gemeinsamer Schutzmaßnahmen und Verantwortlichkeiten.
- Kennzeichnung von Arbeiten mit besonderen Gefahren nach **Anhang II BaustellV**.
- **4 umschaltbare Ansichtsmodi:**
  - *Praxis-Matrix (Kompakt)*: Praxisbewährte tabellarische Übersicht für schnelle Baustellenbesprechungen.
  - *Phasen-Akkordeon (Karten)*: Strukturierte Detailkarten je Bauabschnitt mit Aufklappfunktion.
  - *Druckansicht (DIN A4 Landscape)*: Perfekt proportionierte Querformat-Druckausgabe für Bauherren und Behörden.
  - *Anhang II Express-Filter*: Gezielte Filterung auf Arbeiten mit besonderen Gefährdungen.
- Filterbar nach Phase, Priorität, Gewerk und Anhang II.

### 4. 🔍 Baubegehungen & Mängelmanagement
- Dokumentation von Baustellenbegehungen (Datum, SiGeKo, Teilnehmer, Wetter, Baufortschritt, Gesamteindruck).
- Hierarchische Zuordnung von Mängeln direkt zur jeweiligen Baubegehung.
- Detailliertes Mängel-Tracking:
  - Schweregrad (Gefahr im Verzug, Hoch, Mittel, Gering)
  - Ortsangabe und zuständiges Gewerk
  - Fristensetzung und Behebungsstatus (Offen, In Bearbeitung, Behoben)
- Separater Einzelausdruck von offiziellen **Baubegehungsprotokollen** für die Gewerke.
- Gesamte filterbare Mängelliste mit Fristenüberwachung.

### 5. 📜 Baustellenordnung
- Vollständige Strukturierung in **7 Kernkapitel** mit **22 praxisorientierten Unterthemen**:
  1. *Allgemeine Informationen* (Geltungsbereich, Projektorganisation, BaustellV-Koordination)
  2. *Notfallmanagement* (Notrufkette 112/110, Lotsenpunkt Tor 1, Ersthelfer, Brandwache & Heißarbeiten)
  3. *Allgemeine Regelungen sowie Vorgaben des Bauherren* (Betriebszeiten, Logistik, Nachunternehmer, Zutrittskontrolle, PSA-Pflicht, Ordnung & Sauberkeit, Sozialräume, Rauch-/Alkoholverbot, Umweltschutz)
  4. *Verkehrswege auf der Baustelle* (Zufahrten, 10 km/h, Trennung Fuß-/Fahrverkehr, Einweiserpflicht, Winterdienst)
  5. *Anschlüsse und Verteilungen* (Baustrom nach DGUV V3 mit RCD 30 mA, Trinkwasser/Abwasser, Gewerbeabfalltrennung)
  6. *Arbeitsmittel mit Gefährdung mehrerer Unternehmen* (Erdbaumaschinen, Gerüstfreigabeschein TRBS 2121, Bauaufzüge, Krane & Anschläger)
  7. *Gemeinsam genutzte Schutzeinrichtungen gegen Absturz* (Dreiteiliger Seitenschutz ab 2 m, Schachtabdeckungen, Wiederherstellungspflicht)
- Jedes Thema enthält das konkrete **Praxisproblem** und die verbindliche **Handlungsanweisung**.
- Kennzeichnung ausschreibungsrelevanter Klauseln (**`Im Bauvertrag regeln`**) und Schnittstellen zum SiGe-Plan (**`SiGePlan-Hinweis`**).
- Modernes **Executive KPI-Dashboard** und umschaltbare Ansichten (Kapitel-Akkordeon vs. kompakte Matrix-Tabelle).
- Amtlicher DIN A4 Baustellen-Aushang mit Verpflichtungs- und Unterschriftenblock für Bauherr, SiGeKo und Nachunternehmer.

### 6. 🔧 Unterlage für spätere Arbeiten nach RAB 32
- Strukturierte Erfassung von sicherheitsrelevanten Merkmalen für spätere Wartungs-, Inspektions- und Instandhaltungsarbeiten (z. B. Dachanschlagpunkte, Fassadenbefahranlagen, Steigleitern).
- Verortung von Revisionsunterlagen und Prüfpflichten für den späteren Gebäudebetreiber.

### 7. 📚 Gefährdungskatalog & Rechtskonformität
- Zentraler Katalog typischer Gefährdungen und Schutzmaßnahmen nach Gewerken.
- 100% verifizierte Rechtsgrundlagen auf aktuellem Stand:
  - **Baustellenverordnung (BaustellV)** & **RAB 30 / 31 / 32**
  - **Arbeitsschutzgesetz (ArbSchG)**, insb. **§ 8 (Zusammenarbeit mehrerer Arbeitgeber)**
  - **Arbeitsstättenverordnung (ArbStättV)** & **ASR** (ASR A1.8, ASR A2.1, ASR A2.2, ASR A4.3)
  - **Betriebssicherheitsverordnung (BetrSichV)** & **TRBS 2121** (Gerüste)
  - Aktuelle **DGUV-Vorschriften** (DGUV Vorschrift 1, DGUV Vorschrift 3, DGUV Vorschrift 38 Fassung 2020, DGUV Vorschrift 52)
  - **DIN-Normen** (DIN 4124 Baugruben, DIN VDE 0100-704 Baustrom, DIN EN 13374 Seitenschutz)

---

## 🛠️ Technologie-Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **UI-Bibliothek:** [React 19](https://react.dev/)
- **Typisierung:** [TypeScript 5](https://www.typescriptlang.org/)
- **Datenbank & ORM:** [SQLite](https://www.sqlite.org/) via [Prisma ORM 6](https://www.prisma.io/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Ergonomisches Vanilla CSS Design System mit 5 Farbwelten (Architektur Dunkel, Architektur Hell, Baustellen Slate, Nordic Blue, Warmes Holz), Theme-Switcher mit `localStorage`-Persistierung und maßgeschneiderten Print-Stylesheets für DIN A4 Portrait & Landscape.

---

## 🐳 Docker & Container-Betrieb

Der **SiGeKo-Planer** ist vollständig containerisiert und sofort einsatzbereit für Docker und Docker Compose. Das Image basiert auf einem Multi-Stage Alpine-Build mit Next.js Standalone-Optimierung (Image-Größe < 180 MB) und führt die Anwendung sicher unter einem unprivilegierten Non-Root-Benutzer (`nextjs`) aus.

### 1. Schnellstart mit Docker Compose (Empfohlen)

Das Repository enthält eine vorkonfigurierte [`docker-compose.yml`](file:///c:/Users/chris/Desktop/Codes/SiGeKo_Planer/docker-compose.yml) mit persistentem Datenbank-Volume und automatischem Healthcheck:

```bash
# Repository klonen
git clone https://github.com/Donmeusi/SiGeKo_Planer.git
cd SiGeKo_Planer

# Container im Hintergrund starten
docker compose up -d
```

Die Anwendung ist anschließend sofort im Browser erreichbar unter:  
👉 **[http://localhost:3000](http://localhost:3000)**

#### Nützliche Docker Compose Befehle:
```bash
# Live-Logs des Containers ansehen
docker compose logs -f

# Container stoppen
docker compose stop

# Container beenden (Datenbank bleibt im Volume erhalten)
docker compose down

# Container nach Updates neu bauen und starten
docker compose up -d --build
```

#### 🔄 Updates einspielen (Docker):
Wenn neue Funktionen oder Fehlerkorrekturen im Repository bereitstehen:
```bash
# 1. Neueste Änderungen aus dem Branch abrufen (z. B. beta oder main)
git pull origin beta

# 2. Container neu kompilieren und unterbrechungsarm neu starten
docker compose up -d --build
```
> **100% Datensicherheit:** Alle Projektdaten und die SQLite-Datenbank liegen im persistenten Docker-Volume `sigeko_planer_data` und bleiben bei jedem Update/Rebuild vollständig erhalten.

---

### 2. Manueller Betrieb mit Docker CLI

Alternativ kann das Image direkt mit der Docker CLI gebaut und ausgeführt werden:

```bash
# 1. Docker-Image bauen
docker build -t sigeko-planer .

# 2. Persistentes Volume für die SQLite-Datenbank erstellen
docker volume create sigeko_planer_data

# 3. Container starten
docker run -d \
  --name sigeko-planer \
  -p 3000:3000 \
  -v sigeko_planer_data:/app/prisma \
  --restart unless-stopped \
  sigeko-planer:latest
```

---

### 3. Konfigurations- & Umgebungsvariablen

Die folgenden Umgebungsvariablen können über die `docker-compose.yml` oder beim `docker run`-Befehl übergeben werden:

| Variable | Standardwert | Beschreibung |
|---|---|---|
| `PORT` | `3000` | Port, auf dem der Next.js Server lauscht. |
| `DATABASE_URL` | `file:/app/prisma/dev.db` | Pfad zur SQLite-Datenbankdatei im Container. |
| `SEED_DATABASE` | `false` | Auf `true` setzen, um beim ersten Start das Muster-Bauvorhaben mit SiGe-Plan & Begehungen zu laden. |
| `NODE_ENV` | `production` | Produktionsmodus für maximale Performance. |

> [!TIP]
> **Musterdaten beim ersten Start:** Setzen Sie in der `docker-compose.yml` die Variable `SEED_DATABASE=true`, wenn Sie die Anwendung direkt mit einem vollumfänglichen Muster-Projekt testen möchten.

---

### 4. Daten-Persistenz & Datensicherung (Backup)

Alle Projekte, Begehungen, SiGe-Pläne, Gewerke und Benutzerdaten werden in der SQLite-Datenbank `dev.db` im Pfad `/app/prisma` gespeichert.

- **Persistenz:** Durch das gemountete Docker-Volume (`sigeko_planer_data`) bleiben alle Daten bei Container-Updates, Reboots oder Neuerstellungen vollständig erhalten.
- **Backup der Datenbank:**
  ```bash
  # Datenbank direkt aus dem laufenden Container auf den Host kopieren
  docker cp sigeko-planer:/app/prisma/dev.db ./backup_dev_$(date +%Y%m%d).db
  ```

---

## 💻 Lokale Installation & Betrieb (ohne Docker)

### Voraussetzungen
- [Node.js](https://nodejs.org/) (Version 18 oder neuer)
- npm, pnpm oder yarn

### 1. Repository klonen & Abhängigkeiten installieren
```bash
git clone https://github.com/Donmeusi/SiGeKo_Planer.git
cd SiGeKo_Planer
npm install
```

### 2. Datenbank einrichten
Die Anwendung verwendet eine lokale SQLite-Datenbank (`dev.db`). Das Schema wird mit Prisma synchronisiert:
```bash
npm run db:push
```

### 3. Beispieldaten laden (Seed)
Lädt ein vollumfängliches Muster-Bauvorhaben (*„Neubau Büro- und Geschäftshaus Quartier am Stadtpark“*) mit SiGe-Plan, Baubegehungen, Gewerken und Baustellenordnung:
```bash
npm run db:seed
```

### 4. Entwicklungsserver starten
```bash
npm run dev
```
Die Anwendung ist anschließend im Browser erreichbar unter:  
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🖨️ Druck- & PDF-Erstellung

Alle relevanten Dokumente der Anwendung sind mit print-spezifischen CSS-Regeln ausgestattet (`@media print` und `@page { margin: 0; size: A4; }`):
- Sauberes Druckbild ohne Browser-Kopf- und Fußzeilen (keine URL, kein Druckdatum in den Rändern).
- Automatische Ausblendung von Navigation, Schaltflächen und Modalen.
- DIN A4 Portrait für Vorankündigung, Begehungsprotokolle und Baustellenordnung-Aushang.
- DIN A4 Landscape für den tabellarischen SiGe-Plan.
- Direkter PDF-Export über den System-Druckdialog des Browsers (*„Als PDF speichern“*).

---

## 📄 Lizenz & Rechtliche Hinweise

Dieses Projekt dient der praktischen Unterstützung bei der Sicherheits- und Gesundheitsschutzkoordination. Die Einhaltung der gesetzlichen Pflichten nach der Baustellenverordnung obliegt dem jeweiligen Bauherrn bzw. dem schriftlich beauftragten Koordinator.
