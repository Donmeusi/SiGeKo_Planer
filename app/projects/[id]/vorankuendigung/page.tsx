"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Save,
  Building,
  Calendar,
  Users,
  ShieldAlert,
  Info,
  MapPin,
  UserCheck,
  Building2,
  Clock,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { AuthoritySelector } from "./components/AuthoritySelector";

interface AdvanceNoticeData {
  id?: string;
  projectId: string;
  authorityName: string;
  authorityAddress: string | null;
  noticeDate: string;
  maxWorkersSimultaneous: number;
  estimatedTotalWorkDays: number;
  hasSpecialRisks: boolean;
  noticeRequired: boolean;
  submittedDate: string | null;
  status: string;
  notes: string | null;
}

interface ProjectData {
  id: string;
  name: string;
  projectNumber: string | null;
  description: string | null;
  location: string;
  clientName: string;
  clientAddress: string | null;
  coordinatorName: string;
  coordinatorContact: string | null;
  coordinatorCert: string | null;
  siteManager: string | null;
  plannedStart: string | null;
  plannedEnd: string | null;
  contractors: any[];
  advanceNotice: AdvanceNoticeData | null;
}

export default function AdvanceNoticePage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Formular-State: Behörde & Schwellenwerte
  const [authorityName, setAuthorityName] = useState("");
  const [authorityAddress, setAuthorityAddress] = useState("");
  const [maxWorkers, setMaxWorkers] = useState(1);
  const [totalWorkDays, setTotalWorkDays] = useState(0);
  const [hasSpecialRisks, setHasSpecialRisks] = useState(false);
  const [status, setStatus] = useState("ENTWURF");
  const [submittedDate, setSubmittedDate] = useState("");
  const [notes, setNotes] = useState("");

  // Formular-State: Baustelle & Bauherr
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Formular-State: Beteiligte & Koordinator
  const [siteManager, setSiteManager] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorContact, setCoordinatorContact] = useState("");

  // Formular-State: Termine
  const [plannedStart, setPlannedStart] = useState("");
  const [plannedEnd, setPlannedEnd] = useState("");

  // Aktiver Bearbeitungs-Tab
  const [activeTab, setActiveTab] = useState<"authority" | "site" | "parties" | "dates">("authority");

  const loadData = () => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data: ProjectData) => {
        if (data?.id) {
          setProject(data);
          setName(data.name || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setClientName(data.clientName || "");
          setClientAddress(data.clientAddress || "");
          setSiteManager(data.siteManager || "");
          setCoordinatorName(data.coordinatorName || "");
          setCoordinatorContact(data.coordinatorContact || "");
          setPlannedStart(
            data.plannedStart ? new Date(data.plannedStart).toISOString().split("T")[0] : ""
          );
          setPlannedEnd(
            data.plannedEnd ? new Date(data.plannedEnd).toISOString().split("T")[0] : ""
          );

          if (data.advanceNotice) {
            setAuthorityName(data.advanceNotice.authorityName || "");
            setAuthorityAddress(data.advanceNotice.authorityAddress || "");
            setMaxWorkers(data.advanceNotice.maxWorkersSimultaneous || 1);
            setTotalWorkDays(data.advanceNotice.estimatedTotalWorkDays || 0);
            setHasSpecialRisks(Boolean(data.advanceNotice.hasSpecialRisks));
            setStatus(data.advanceNotice.status || "ENTWURF");
            setSubmittedDate(
              data.advanceNotice.submittedDate
                ? new Date(data.advanceNotice.submittedDate).toISOString().split("T")[0]
                : ""
            );
            setNotes(data.advanceNotice.notes || "");
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  // Automatische Kriterienprüfung gem. § 2 BaustellV
  const isCriteria1 = maxWorkers > 20; // Mehr als 20 gleichzeitig
  const isCriteria2 = totalWorkDays > 500; // Mehr als 500 Personentage
  const isCriteria3 = hasSpecialRisks; // Arbeiten mit besonderen Gefahren (Anhang II)
  const isNoticeRequired = isCriteria1 || isCriteria2 || isCriteria3;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/projects/${params.id}/advance-notice`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Vorankündigung
          authorityName,
          authorityAddress,
          maxWorkersSimultaneous: maxWorkers,
          estimatedTotalWorkDays: totalWorkDays,
          hasSpecialRisks,
          status,
          submittedDate: submittedDate || null,
          notes,
          // Projektstammdaten (Anhang I BaustellV)
          name,
          location,
          description,
          clientName,
          clientAddress,
          siteManager,
          coordinatorName,
          coordinatorContact,
          plannedStart: plannedStart || null,
          plannedEnd: plannedEnd || null,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        loadData();
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", color: "var(--text-muted)" }}>Lade Vorankündigung...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div
        className="no-print"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="title-xl">Vorankündigung</h2>
            <span className="badge badge-amber">§ 2 BaustellV &amp; Anhang I</span>
          </div>
          <p className="text-secondary" style={{ marginTop: "4px" }}>
            Bearbeiten Sie alle behördlich vorgeschriebenen Angaben nach Anhang I der Baustellenverordnung mit Live-Aushangvorschau.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-primary"
            title="Offizielle Druckversion für den Baustellenaushang (PDF)"
          >
            <Printer size={16} />
            <span>Aushang drucken / PDF</span>
          </button>
        </div>
      </div>

      {/* Gesetzliche Schwellenwert-Ampel (§ 2 Abs. 1 BaustellV) */}
      <div
        className="card no-print"
        style={{
          background: isNoticeRequired ? "rgba(245, 158, 11, 0.05)" : "rgba(16, 185, 129, 0.05)",
          borderColor: isNoticeRequired ? "var(--safety-amber)" : "var(--success-emerald)",
          marginBottom: "20px",
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isNoticeRequired ? (
              <AlertTriangle size={22} color="var(--safety-amber)" />
            ) : (
              <CheckCircle2 size={22} color="var(--success-emerald)" />
            )}
            <div>
              <h3 className="title-md" style={{ fontSize: "14px" }}>
                {isNoticeRequired
                  ? "Gesetzliche Vorankündigungspflicht besteht"
                  : "Keine Vorankündigungspflicht (Freiwillige Anzeige)"}
              </h3>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                Prüfung nach § 2 Abs. 1 Satz 1 und Satz 2 Baustellenverordnung
              </div>
            </div>
          </div>
          <span className={`badge ${isNoticeRequired ? "badge-amber" : "badge-green"}`}>
            {isNoticeRequired ? "Pflicht" : "Optional"}
          </span>
        </div>

        {/* Die 3 gesetzlichen Kriterien */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          <div
            style={{
              padding: "8px 12px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${isCriteria1 ? "var(--safety-amber)" : "var(--border)"}`,
            }}
          >
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>KRITERIUM 1</div>
            <div style={{ fontWeight: 600, fontSize: "12.5px" }}>&gt; 20 Beschäftigte zeitgleich</div>
            <div style={{ fontSize: "11.5px", color: isCriteria1 ? "var(--safety-amber)" : "var(--text-secondary)" }}>
              {isCriteria1 ? `Erfüllt (${maxWorkers} Pers.)` : `Nicht erfüllt (${maxWorkers} Pers.)`}
            </div>
          </div>

          <div
            style={{
              padding: "8px 12px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${isCriteria2 ? "var(--safety-amber)" : "var(--border)"}`,
            }}
          >
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>KRITERIUM 2</div>
            <div style={{ fontWeight: 600, fontSize: "12.5px" }}>&gt; 500 Personentage</div>
            <div style={{ fontSize: "11.5px", color: isCriteria2 ? "var(--safety-amber)" : "var(--text-secondary)" }}>
              {isCriteria2
                ? `Erfüllt (${totalWorkDays.toLocaleString("de-DE")} PT)`
                : `Nicht erfüllt (${totalWorkDays.toLocaleString("de-DE")} PT)`}
            </div>
          </div>

          <div
            style={{
              padding: "8px 12px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${isCriteria3 ? "var(--hazard-red)" : "var(--border)"}`,
            }}
          >
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>KRITERIUM 3</div>
            <div style={{ fontWeight: 600, fontSize: "12.5px" }}>Arbeiten nach Anhang II</div>
            <div style={{ fontSize: "11.5px", color: isCriteria3 ? "var(--hazard-red)" : "var(--text-secondary)" }}>
              {isCriteria3 ? "Besondere Gefahren vorhanden" : "Keine Anhang II Arbeiten"}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Vollständiges Bearbeitungsformular & Amtliche Aushang-Vorschau */}
      <div className="grid-two-col notice">
        {/* Linke Spalte: Bearbeitungsformular */}
        <div className="card no-print">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Edit3 size={18} color="var(--safety-amber)" />
              <h3 className="title-md">Vorankündigung bearbeiten</h3>
            </div>
            {savedSuccess && (
              <span style={{ color: "var(--success-emerald)", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px", fontWeight: 600 }}>
                <CheckCircle2 size={15} />
                <span>Gespeichert!</span>
              </span>
            )}
          </div>

          {/* Formular-Bereich-Tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[
              { id: "authority", label: "1. Behörde & Fristen" },
              { id: "site", label: "2. Baustelle & Bauherr" },
              { id: "parties", label: "3. Koordinator & Planer" },
              { id: "dates", label: "4. Termine & Zeiten" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn btn-sm ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "11.5px", padding: "4px 10px" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave}>
            {/* TAB 1: Behörde & Schwellenwerte */}
            {activeTab === "authority" && (
              <div>
                {/* 2-stufiges Behörden-Auswahlmenü pro Bundesland (§ 2 BaustellV) */}
                <AuthoritySelector
                  projectLocation={location}
                  currentAuthorityName={authorityName}
                  onSelectAuthority={(auth) => {
                    setAuthorityName(auth.name);
                    setAuthorityAddress(auth.address);
                  }}
                />

                <div className="form-group">
                  <label className="form-label">Zuständige Behörde (Gewerbeaufsichtsamt / LAGetSi) *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={authorityName}
                    onChange={(e) => setAuthorityName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Anschrift der Behörde</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Straße, PLZ, Ort"
                    value={authorityAddress}
                    onChange={(e) => setAuthorityAddress(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Max. Beschäftigte gleichzeitig *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="form-input font-mono"
                      value={maxWorkers}
                      onChange={(e) => setMaxWorkers(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Personentage gesamt *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      className="form-input font-mono"
                      value={totalWorkDays}
                      onChange={(e) => setTotalWorkDays(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: "14px 0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      style={{ width: "16px", height: "16px", accentColor: "var(--hazard-red)" }}
                      checked={hasSpecialRisks}
                      onChange={(e) => setHasSpecialRisks(e.target.checked)}
                    />
                    <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text-primary)" }}>
                      Auf der Baustelle fallen Arbeiten mit besonderen Gefahren (Anhang II BaustellV) an
                    </span>
                  </label>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Bearbeitungsstatus</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="ENTWURF">ENTWURF</option>
                      <option value="EINGEREICHT">EINGEREICHT</option>
                      <option value="AUSGEHAENGT">AUSGEHAENGT (Baustelle)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Einreichungsdatum bei Behörde</label>
                    <input
                      type="date"
                      className="form-input font-mono"
                      value={submittedDate}
                      onChange={(e) => setSubmittedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Aushangort / Ergänzende Hinweise</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="z.B. Wetterfest am Bauzaun Tor 1 angebracht"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Baustelle & Bauherr (Anhang I Nr. 1-3) */}
            {activeTab === "site" && (
              <div>
                <div className="form-group">
                  <label className="form-label">1. Bezeichnung der Baustelle *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">1. Genaue Lage der Baustelle (Standort / Adresse) *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">3. Art des Bauvorhabens (Beschreibung) *</label>
                  <textarea
                    required
                    className="form-textarea"
                    placeholder="z.B. Errichtung eines 5-geschossigen Wohn- und Geschäftshauses..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">2. Name des Bauherrn *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">2. Anschrift des Bauherrn</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Straße, Hausnr., PLZ, Ort"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Beteiligte & Koordinator (Anhang I Nr. 4-6) */}
            {activeTab === "parties" && (
              <div>
                <div className="form-group">
                  <label className="form-label">4. Verantwortlicher Planer *</label>
                  <input
                    type="text"
                    required
                    placeholder="Name / Architekturbüro"
                    className="form-input"
                    value={siteManager}
                    onChange={(e) => setSiteManager(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">5. &amp; 6. SiGe-Koordinator (gem. RAB 30) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Name des Koordinators"
                    className="form-input"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kontaktdaten des Koordinators (Telefon / E-Mail)</label>
                  <input
                    type="text"
                    placeholder="z.B. 0171-1234567 | meyer@sigeko.de"
                    className="form-input"
                    value={coordinatorContact}
                    onChange={(e) => setCoordinatorContact(e.target.value)}
                  />
                </div>

                <div style={{ padding: "10px 12px", background: "var(--bg-input)", borderRadius: "var(--radius-sm)", fontSize: "11.5px", color: "var(--text-muted)", marginTop: "12px" }}>
                  <strong>Hinweis zur Beauftragung:</strong> Sind mehrere Arbeitgeber auf der Baustelle tätig, ist nach § 3 Abs. 1 BaustellV zwingend ein geeigneter Koordinator (RAB 30) für die Planung und Ausführung zu bestellen.
                </div>
              </div>
            )}

            {/* TAB 4: Termine & Zeiten (Anhang I Nr. 7-8) */}
            {activeTab === "dates" && (
              <div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">7. Voraussichtlicher Beginn der Arbeiten</label>
                    <input
                      type="date"
                      className="form-input font-mono"
                      value={plannedStart}
                      onChange={(e) => setPlannedStart(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">8. Voraussichtliches Bauende / Dauer</label>
                    <input
                      type="date"
                      className="form-input font-mono"
                      value={plannedEnd}
                      onChange={(e) => setPlannedEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ padding: "12px", background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "var(--radius-sm)", fontSize: "12px", color: "var(--text-secondary)", marginTop: "12px" }}>
                  <strong>Fristenvorgabe:</strong> Die Vorankündigung muss der zuständigen Behörde spätestens <strong>zwei Wochen vor Beginn</strong> der Arbeiten übermittelt werden (§ 2 Abs. 1 BaustellV).
                </div>
              </div>
            )}

            {/* Speichern Button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                Aktualisiert Projekt &amp; amtliche Vorankündigung live
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary">
                <Save size={15} />
                <span>{saving ? "Wird gespeichert..." : "Änderungen speichern"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Rechte Spalte / Druckansicht: Amtlicher Aushang gem. Anhang I BaustellV */}
        <div
          className="card"
          id="official-notice-sheet"
          style={{
            background: "#fff",
            color: "#111827",
            border: "2px solid #334155",
            padding: "26px",
            fontFamily: "var(--font-sans)",
          }}
        >
          {/* Amtlicher Briefkopf */}
          <div style={{ borderBottom: "2px solid #111827", paddingBottom: "12px", marginBottom: "16px" }}>
            <div style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#475569" }}>
              Amtliche Bekanntmachung gem. § 2 Abs. 2 Baustellenverordnung (BaustellV)
            </div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
              VORANKÜNDIGUNG
            </h1>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>
              Muster nach Anhang I der Baustellenverordnung
            </div>
          </div>

          {/* Tabellarische Daten nach Anhang I */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", lineHeight: "1.5" }}>
            <tbody>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, width: "35%", color: "#334155", verticalAlign: "top" }}>1. Lage der Baustelle:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  <strong>{name || project?.name}</strong><br />
                  {location || project?.location}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>2. Name &amp; Anschrift des Bauherrn:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {clientName || project?.clientName}<br />
                  {clientAddress || project?.clientAddress || "—"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>3. Art des Bauvorhabens:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {description || project?.description || "Hochbau / Wohn- und Gewerbebau"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>4. Verantwortlicher Planer:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {siteManager || project?.siteManager || "Architektur- & Planungsbüro"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>5. Koordinator (Planungsphase):</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {coordinatorName || project?.coordinatorName} (SiGeKo gem. RAB 30)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>6. Koordinator (Ausführungsphase):</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {coordinatorName || project?.coordinatorName} (SiGeKo gem. RAB 30)<br />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {coordinatorContact || project?.coordinatorContact}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>7. Voraussichtlicher Beginn:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {plannedStart
                    ? new Date(plannedStart).toLocaleDateString("de-DE")
                    : project?.plannedStart
                    ? new Date(project.plannedStart).toLocaleDateString("de-DE")
                    : "Gemäß Bauzeitenplan"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>8. Voraussichtliche Dauer:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {plannedEnd
                    ? `Bis ca. ${new Date(plannedEnd).toLocaleDateString("de-DE")}`
                    : project?.plannedEnd
                    ? `Bis ca. ${new Date(project.plannedEnd).toLocaleDateString("de-DE")}`
                    : "Gemäß Bauzeitenplan"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>9. Voraussichtliche Höchstzahl:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {maxWorkers} Beschäftigte gleichzeitig auf der Baustelle
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>10. Zahl der Arbeitgeber:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  Voraussichtlich {project?.contractors.length || 1} Unternehmen / Gewerke
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: 700, color: "#334155", verticalAlign: "top" }}>11. Bereits benannte Unternehmen:</td>
                <td style={{ padding: "6px 0", color: "#0f172a" }}>
                  {project?.contractors && project.contractors.length > 0
                    ? project.contractors.map((c) => c.companyName).join(", ")
                    : "Noch nicht vollständig benannt"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Behördenvermerk Footer */}
          <div style={{ marginTop: "20px", paddingTop: "12px", borderTop: "1px dashed #94a3b8", fontSize: "11px", color: "#475569" }}>
            <div><strong>Zuständige Behörde:</strong> {authorityName}</div>
            {submittedDate && <div><strong>Übermittelt am:</strong> {new Date(submittedDate).toLocaleDateString("de-DE")}</div>}
            <div style={{ marginTop: "4px", fontStyle: "italic" }}>
              Hinweis: Dieser Aushang ist gem. § 2 Abs. 2 BaustellV während der gesamten Bauzeit gut sichtbar und wettergeschützt auf der Baustelle anzubringen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
