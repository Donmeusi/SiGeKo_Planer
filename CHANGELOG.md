# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/) und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

---

## [0.4.0] - 2026-09-17

### Hinzugefügt
- **Behördendatenbank für alle 16 Bundesländer (§ 2 BaustellV):**
  - Vollständige bundesweite Datenbank aller zuständigen Arbeitsschutz- und Gewerbeaufsichtsbehörden, Regierungspräsidien, Bezirksregierungen und Landesämter für Arbeitsschutz (`lib/german-authorities.ts`).
  - Genaue Anschriften, Telefon, E-Mail, regionale Zuständigkeiten und Direktlinks zu den offiziellen Online-Meldungsportalen (Service-BW, BayernPortal, WSP.NRW, Amt24 Sachsen etc.).
- **Interaktiver Behörden-Finder & Auswahlmenü in der Vorankündigung:**
  - Neues 2-stufiges Auswahlmenü (`AuthoritySelector.tsx`): Bundesland ➔ Regionale Dienststelle / Aufsichtsamt.
  - Automatische Standort-Erkennung anhand von PLZ oder Städtenamen des Bauvorhabens mit 1-Klick-Aktivierungschip.
  - 1-Klick-Übernahme von Behördenname und Anschrift direkt in das Vorankündigungsformular und den druckfertigen Baustellenaushang.
- **Sicherheits- und Gesundheitsschutzplan (SiGe-Plan) nach RAB 31 – Multiansichten:**
  - 4 umschaltbare Ansichtsmodi: *Praxis-Matrix (Kompakt)*, *Phasen-Akkordeon (Karten)*, *Druckansicht (Querformat / DIN A4 Landscape)* und *Anhang II Express-Filter*.
  - Schnelle Filterung nach Bauphase, Gewerk, Priorität und Anhang II (besondere Gefahren).
- **Multi-Theme-System (5 Farbwelten & Hell/Dunkel):**
  - Schneller Farbschema-Umschalter oben rechts in der Kopfzeile (`TopBar.tsx`) mit Live-Vorschau und `localStorage`-Persistierung.
  - 5 ergonomische Themes: *Architektur Dunkel*, *Architektur Hell*, *Baustellen Slate* (Smaragdgrün & Zink), *Nordic Blue* (Ozeanblau & Schiefer) und *Warmes Holz / Sepia*.
- **Vollständige Docker- & Container-Unterstützung:**
  - Multi-Stage Alpine `Dockerfile` mit Next.js 15 Standalone-Optimierung (< 180 MB Image-Größe) und unprivilegiertem Non-Root-User `nextjs`.
  - Vorkonfigurierte `docker-compose.yml` mit persistentem Volume für die SQLite-Datenbank (`sigeko_data`) und automatischem Healthcheck.
  - Automatisches Initialisierungs-Skript (`docker-entrypoint.sh`) für schema push und optionales Laden von Musterdaten (`SEED_DATABASE=true`).
  - Ausführliche Docker-Dokumentation und Backup-Anleitung in der `README.md`.

### Geändert & Optimiert
- **Workflow-Optimierung der Hauptnavigation (`Sidebar.tsx`):**
  - Reorganisation der Menüpunkte nach dem realen, chronologischen Arbeitsablauf des SiGeKos:
    1. *Projekt & Basis* (Cockpit, Gewerke & Firmen)
    2. *Planung vor Baubeginn* (Vorankündigung, SiGe-Plan, Baustellenordnung)
    3. *Ausführung auf der Baustelle* (Begehungen & Mängel)
    4. *Abschluss & spätere Arbeiten* (Unterlage nach RAB 32)
    5. *Bibliothek & System* (Gefährdungskatalog, Admin)
  - Theme-Auswahl aus dem Seitenmenü entfernt und ergonomisch in die TopBar verlagert.
- **Bereinigung Vorankündigung:**
  - Entfernung des Hinweises zu Browser-Kopf- und Fußzeilen im Kopfbereich für ein aufgeräumtes Erscheinungsbild.

---

### Hinzugefügt
- **Baustellenordnung nach 7-Kapitel-Themenkatalog:**
  - Vollständige Implementierung aller 22 praxisorientierten Unterthemen aus den 7 Kernkapiteln (Allgemein, Notfall, Vorgaben/Verhalten, Verkehr, Anschlüsse/Medien, Arbeitsmittel/Maschinen, Absturzsicherungen).
  - Jedes Thema enthält eine konkrete Beschreibung des Praxisproblems (*„Warum diese Regelung?“*) sowie verbindliche Handlungsanweisungen.
  - Kennzeichnung ausschreibungsrelevanter Punkte mit dem Badge **`📜 Im Bauvertrag regeln`**.
  - Kennzeichnung von Schnittstellen zum SiGe-Plan mit dem Badge **`⚠️ SiGePlan-Hinweis`**.
  - 1-Klick-Übernahme des 22-Themen-Standardkatalogs über die Schaltfläche **`Musterregeln (22 Themen)`**.
- **Neues Executive KPI-Dashboard in der Baustellenordnung:**
  - Kacheln für Gesamtanzahl der Unterthemen, vertragsrelevante Klauseln, SiGePlan-Verknüpfungen und Handlungsbedarfe.
- **Umschaltbare Ansichten (View Switcher):**
  - *Kapitel-Karten (Akkordeon-Modus)*: Ein- und Ausklappen einzelner Kapitel mit „Alle aufklappen“ / „Alle einklappen“.
  - *Kompakte Matrix (Tabellarische Prüfliste)*: Übersichtliche Tabellendarstellung aller 22 Unterthemen für effiziente Prüfungen.
- **Kompakte Notfallorganisation:**
  - Platzsparendes Notfallband mit 112, 110, Lotsenpunkt Tor 1 und Kontakten.
  - Ausklappbare Detailansicht für Giftnotruf, BG BAU Notfallhotline und Verbandkasten-Standorte.
- **Amtlicher DIN A4 Baustellen-Aushang:**
  - Druckoptimierte Ansicht für das Baustellenbrett / den Bauzaun mit formeller Verpflichtungs- und Unterschriftenzeile für Bauherr, SiGeKo und Nachunternehmer.
- **Mängelbearbeitung & Einzelausdruck von Baubegehungsprotokollen:**
  - Jeder Mangel kann nun vollständig editiert werden (Ort, Beschreibung, Frist, Status, Erledigungsvermerk).
  - Protokolle einzelner Baubegehungen können separat als DIN A4 Protokoll gedruckt werden.
  - Druck-Schaltfläche aus dem globalen Seitenkopf entfernt, um gezieltes Drucken pro Begehung zu ermöglichen.

### Geändert & Bereinigt
- **Vollständige Rechtsprüfung & Bereinigung aller Rechtsverweise:**
  - Streichung veralteter Normen (insb. DGUV Vorschrift 6, die 2015 außer Kraft getreten ist).
  - Umstellung des Zusammenarbeit-Verweises auf das primäre Bundesrecht: **`BaustellV & § 8 ArbSchG (Zusammenarbeit mehrerer Arbeitgeber)`** sowie DGUV Vorschrift 1 § 6.
  - Harmonisierung aller Paragrafen der novellierten DGUV Vorschrift 38 (Fassung 2020): Absturz ist § 5, geneigte Flächen ist § 6, Verkehrswege ist § 7, Baustellenverkehr ist § 9.
  - Verweise im Gefährdungskatalog (`sample-catalog.ts`) und in den Beispieldaten (`seed.ts`) auf den aktuellen Stand gebracht.
- **Entfernung externer Verbandshinweise:**
  - Sämtliche Erwähnungen und Badges zu *„Praxishilfe Offensive Gutes Bauen (INQA)“* aus der Benutzeroberfläche und den Druckvorlagen entfernt.
- **Layout & Responsivität:**
  - Einklappbare Seitenleiste (Sidebar) für mehr Arbeitsfläche.
  - Baustellen-Cockpit optisch entschlackt und gegen Textumbrüche auf kleineren Viewports optimiert.
  - Druckstylesheets überarbeitet (`@page { margin: 0; }`), um das Einblenden von Browser-Kopf- und Fußzeilen (URLs, Dateipfade) im PDF-Export zu unterbinden.

---

## [0.2.0] - 2026-09-08

### Hinzugefügt
- **Baubegehungen & Mängelmanagement:**
  - Neues Modul zur Erfassung von Vor-Ort-Begehungen mit Gesamteindruck (Gut, Mängel, Gefahr im Verzug).
  - Mängelliste mit Schweregrad, Fotoupload-Vorbereitung und Zuständigkeit.
- **Unterlage für spätere Arbeiten nach RAB 32:**
  - Bauteilbezogene Sicherheitsmaßnahmen und Verortung von Revisionsunterlagen.
- **Gefährdungskatalog nach Gewerken:**
  - Vorkonfigurierte Katalogeinträge mit Filter nach Anhang II BaustellV.

---

## [0.1.0] - 2026-09-01

### Hinzugefügt
- **Initiales Release des SiGeKo-Planers:**
  - Projektverwaltung mit Bauherren-, SiGeKo- und Bauleiterstammdaten.
  - Gesetzliche Vorankündigung nach § 2 BaustellV mit automatischer Kriterienprüfung.
  - SiGe-Plan-Editor nach RAB 31 mit Bauphasen, räumlich-zeitlichen Überschneidungen und gemeinsamen Schutzmaßnahmen.
  - Gewerke- und Firmenverwaltung.
  - SQLite-Datenbankanbindung mit Prisma ORM.
