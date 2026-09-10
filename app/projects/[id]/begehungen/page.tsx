"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ClipboardCheck,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Printer,
  Trash2,
  Check,
  Edit3,
  MapPin,
  Users,
  Layers,
  List,
  LayoutGrid,
} from "lucide-react";

interface Defect {
  id: string;
  inspectionId: string;
  description: string;
  location: string;
  severity: string;
  tradeAssigned: string | null;
  deadline: string | null;
  status: string;
  imageUrl: string | null;
  resolvedAt: string | null;
  resolutionNote: string | null;
  createdAt: string;
  inspection?: {
    id: string;
    date: string;
    inspector: string;
    overallImpression: string;
  };
}

interface Inspection {
  id: string;
  projectId: string;
  date: string;
  inspector: string;
  participants: string | null;
  weather: string | null;
  constructionProgress: string | null;
  overallImpression: string;
  summary: string | null;
  defects: Defect[];
}

interface Contractor {
  id: string;
  companyName: string;
  trade: string;
}

export default function InspectionsAndDefectsPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  // Active View Tab: 'inspections' (Ablauf) or 'all-defects' (Gesamt-Mängelliste)
  const [activeTab, setActiveTab] = useState<"inspections" | "all-defects">("inspections");

  // Display Mode for defects: 'list' (DEFAULT!) or 'cards'
  const [displayMode, setDisplayMode] = useState<"list" | "cards">("list");

  // Selected inspection for individual DIN A4 protocol printing
  const [selectedInspectionForPrint, setSelectedInspectionForPrint] = useState<Inspection | null>(null);

  // Filters for All-Defects view
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  // Modals
  const [showNewInspectionModal, setShowNewInspectionModal] = useState(false);
  const [showNewDefectModal, setShowNewDefectModal] = useState(false);
  const [showEditDefectModal, setShowEditDefectModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  // Selected entities for actions
  const [selectedInspectionForDefect, setSelectedInspectionForDefect] = useState<Inspection | null>(null);
  const [selectedDefectToEdit, setSelectedDefectToEdit] = useState<Defect | null>(null);
  const [selectedDefectToResolve, setSelectedDefectToResolve] = useState<Defect | null>(null);
  const [quickResolutionNote, setQuickResolutionNote] = useState("");

  // New Inspection Form State
  const [inspDate, setInspDate] = useState(new Date().toISOString().split("T")[0]);
  const [inspInspector, setInspInspector] = useState("SiGe-Koordinator (gem. RAB 30)");
  const [inspParticipants, setInspParticipants] = useState("");
  const [inspWeather, setInspWeather] = useState("Trocken, sonnig, ca. 20°C");
  const [inspProgress, setInspProgress] = useState("");
  const [inspImpression, setInspImpression] = useState("MAENGEL_FESTGESTELLT");
  const [inspSummary, setInspSummary] = useState("");

  // New Defect Form State
  const [defectDesc, setDefectDesc] = useState("");
  const [defectLocation, setDefectLocation] = useState("");
  const [defectSeverity, setDefectSeverity] = useState("MITTEL");
  const [defectTrade, setDefectTrade] = useState("");
  const [defectDeadline, setDefectDeadline] = useState("");
  const [defectTargetInspectionId, setDefectTargetInspectionId] = useState("");

  // Edit Defect Form State
  const [editDesc, setEditDesc] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSeverity, setEditSeverity] = useState("MITTEL");
  const [editTrade, setEditTrade] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editStatus, setEditStatus] = useState("OFFEN");
  const [editResolutionNote, setEditResolutionNote] = useState("");
  const [editInspectionId, setEditInspectionId] = useState("");

  const loadData = () => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setProject(data);
          setInspections(data.inspections || []);
          setDefects(data.defects || []);
          setContractors(data.contractors || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  // Open defect modal tied to a specific inspection
  const openNewDefectForInspection = (inspection: Inspection) => {
    setSelectedInspectionForDefect(inspection);
    setDefectTargetInspectionId(inspection.id);
    setDefectDesc("");
    setDefectLocation("");
    setDefectSeverity("MITTEL");
    setDefectTrade("");
    setDefectDeadline("");
    setShowNewDefectModal(true);
  };

  // Open edit modal for an existing defect
  const openEditModal = (defect: Defect) => {
    setSelectedDefectToEdit(defect);
    setEditDesc(defect.description);
    setEditLocation(defect.location || "");
    setEditSeverity(defect.severity || "MITTEL");
    setEditTrade(defect.tradeAssigned || "");
    setEditDeadline(defect.deadline ? new Date(defect.deadline).toISOString().split("T")[0] : "");
    setEditStatus(defect.status || "OFFEN");
    setEditResolutionNote(defect.resolutionNote || "");
    setEditInspectionId(defect.inspectionId);
    setShowEditDefectModal(true);
  };

  // Create new Inspection
  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/projects/${params.id}/inspections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: inspDate,
          inspector: inspInspector,
          participants: inspParticipants,
          weather: inspWeather,
          constructionProgress: inspProgress,
          overallImpression: inspImpression,
          summary: inspSummary,
        }),
      });

      if (res.ok) {
        setShowNewInspectionModal(false);
        setInspDate(new Date().toISOString().split("T")[0]);
        setInspParticipants("");
        setInspProgress("");
        setInspSummary("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create new Defect
  const handleCreateDefect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectDesc) return;
    try {
      const res = await fetch(`/api/projects/${params.id}/defects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: defectDesc,
          location: defectLocation,
          severity: defectSeverity,
          tradeAssigned: defectTrade,
          deadline: defectDeadline || null,
          inspectionId: defectTargetInspectionId || undefined,
        }),
      });

      if (res.ok) {
        setShowNewDefectModal(false);
        setDefectDesc("");
        setDefectLocation("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save changes to existing Defect
  const handleUpdateDefect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDefectToEdit) return;

    try {
      const res = await fetch(`/api/projects/${params.id}/defects`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defectId: selectedDefectToEdit.id,
          description: editDesc,
          location: editLocation,
          severity: editSeverity,
          tradeAssigned: editTrade || null,
          deadline: editDeadline || null,
          status: editStatus,
          resolutionNote: editStatus === "BEHOBEN" ? (editResolutionNote || "Vorschriftsmäßig behoben.") : null,
          inspectionId: editInspectionId || undefined,
        }),
      });

      if (res.ok) {
        setShowEditDefectModal(false);
        setSelectedDefectToEdit(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quick resolve defect
  const handleResolveDefect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDefectToResolve) return;

    try {
      const res = await fetch(`/api/projects/${params.id}/defects`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defectId: selectedDefectToResolve.id,
          status: "BEHOBEN",
          resolutionNote: quickResolutionNote || "Vorschriftsmäßig behoben und vor Ort abgenommen.",
        }),
      });

      if (res.ok) {
        setShowResolveModal(false);
        setSelectedDefectToResolve(null);
        setQuickResolutionNote("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete defect
  const handleDeleteDefect = async (defectId: string) => {
    if (!confirm("Möchten Sie diesen Mangel wirklich dauerhaft löschen?")) return;
    try {
      const res = await fetch(`/api/projects/${params.id}/defects?defectId=${defectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper: Find inspection metadata for a defect
  const getInspectionForDefect = (defect: Defect) => {
    if (defect.inspection) return defect.inspection;
    return inspections.find((i) => i.id === defect.inspectionId);
  };

  const filteredDefects = defects.filter((d) => {
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    const matchesSeverity = severityFilter === "ALL" || d.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const getImpressionBadge = (impression: string) => {
    switch (impression) {
      case "SEHR_GUT":
        return (
          <span className="badge-status-resolved">
            <CheckCircle2 size={12} />
            <span>Sehr gut</span>
          </span>
        );
      case "GUT":
        return (
          <span className="badge-status-resolved">
            <span className="badge-dot badge-dot-green" />
            <span>Gut</span>
          </span>
        );
      case "MAENGEL_FESTGESTELLT":
        return (
          <span className="badge-severity-medium">
            <span className="badge-dot badge-dot-amber" />
            <span>Mängel festgestellt</span>
          </span>
        );
      case "ERHEBLICHE_MAENGEL":
        return (
          <span className="badge-severity-imminent">
            <AlertTriangle size={12} />
            <span>Erhebliche Mängel</span>
          </span>
        );
      default:
        return <span className="badge badge-muted">{impression}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "GEFAHR_IM_VERZUG":
      case "GEFAHR_IN_VERZUG":
        return (
          <span className="badge-severity-imminent" title="Höchste Sicherheitsstufe - Sofortmaßnahme erforderlich!">
            <AlertTriangle size={12} />
            <span>Gefahr im Verzug</span>
          </span>
        );
      case "HOCH":
        return (
          <span className="badge-severity-high" title="Hohes Risiko - Beseitigungsfrist < 24h">
            <span className="badge-dot badge-dot-orange" />
            <span>Hoch</span>
          </span>
        );
      case "MITTEL":
        return (
          <span className="badge-severity-medium" title="Mittleres Risiko - Regelmäßige Beseitigung">
            <span className="badge-dot badge-dot-amber" />
            <span>Mittel</span>
          </span>
        );
      case "GERING":
        return (
          <span className="badge-severity-low" title="Geringes Risiko / Ordnung & Sauberkeit">
            <span className="badge-dot badge-dot-muted" />
            <span>Gering</span>
          </span>
        );
      default:
        return <span className="badge badge-muted">{severity}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BEHOBEN":
        return (
          <span className="badge-status-resolved" title="Mangel vorschriftsmäßig behoben und abgenommen">
            <CheckCircle2 size={12} />
            <span>Behoben</span>
          </span>
        );
      case "IN_BEARBEITUNG":
        return (
          <span className="badge-status-progress" title="Maßnahmen zur Mängelbeseitigung laufen aktiv">
            <span className="badge-dot badge-dot-blue" />
            <Clock size={11} style={{ opacity: 0.9 }} />
            <span>In Bearbeitung</span>
          </span>
        );
      case "OFFEN":
        return (
          <span className="badge-status-open" title="Mangel erfasst - Beseitigung steht noch aus">
            <span className="badge-dot badge-dot-red" />
            <span>Offen</span>
          </span>
        );
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  return (
    <div style={{ minWidth: 0 }}>
      <div className={selectedInspectionForPrint ? "no-print" : ""}>
        {/* ─── Header ────────────────────────────────────────────── */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 className="title-xl" style={{ margin: 0 }}>
                Baubegehungen &amp; Mängelmanagement
              </h1>
              <span className="badge badge-amber">RAB 30 Überwachung</span>
            </div>
            <p className="text-secondary" style={{ marginTop: "4px" }}>
              Baubegehung vor Ort anlegen, Mängel direkt zuordnen und Beseitigungsfristen rechtssicher überwachen.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setShowNewInspectionModal(true)}
              className="btn btn-primary"
            >
              <Calendar size={16} />
              <span>Neue Baubegehung anlegen</span>
            </button>
          </div>
        </div>

      {/* ─── Hauptansichts-Umschalter (Tabs) ───────────────────── */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("inspections")}
            className={`btn btn-sm ${activeTab === "inspections" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "13px", padding: "6px 14px" }}
          >
            <Calendar size={15} />
            <span>Baubegehungen &amp; Protokolle ({inspections.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("all-defects")}
            className={`btn btn-sm ${activeTab === "all-defects" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "13px", padding: "6px 14px" }}
          >
            <Layers size={15} />
            <span>Gesamte Mängelliste &amp; Fristen ({defects.length})</span>
          </button>
        </div>

        {/* Listen- vs. Kartenansicht Umschalter */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--bg-input)", padding: "3px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => setDisplayMode("list")}
            className={`btn btn-sm ${displayMode === "list" ? "btn-primary" : "btn-outline"}`}
            style={{ padding: "4px 8px", fontSize: "11.5px", border: "none" }}
            title="Mängelliste als Tabelle darstellen (Standard)"
          >
            <List size={14} />
            <span>Listenansicht</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode("cards")}
            className={`btn btn-sm ${displayMode === "cards" ? "btn-primary" : "btn-outline"}`}
            style={{ padding: "4px 8px", fontSize: "11.5px", border: "none" }}
            title="Mängel als Kacheln darstellen"
          >
            <LayoutGrid size={14} />
            <span>Kartenansicht</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* TAB 1: BAUBEGEHUNGEN MIT EINGEBETTETEN MÄNGELN (Ablauf)    */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === "inspections" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {inspections.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}
            >
              <ClipboardCheck size={40} color="var(--safety-amber)" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 600 }}>
                Noch keine Baubegehung angelegt
              </h3>
              <p style={{ fontSize: "12.5px", marginTop: "4px", maxWidth: "450px", margin: "4px auto 16px" }}>
                Starten Sie den Ablauf mit der Erfassung einer neuen Baubegehung. Im Anschluss können Sie direkt darunter Mängel erfassen.
              </p>
              <button
                type="button"
                onClick={() => setShowNewInspectionModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} />
                <span>Erste Baubegehung erfassen</span>
              </button>
            </div>
          ) : (
            inspections.map((insp) => {
              const inspDefects = defects.filter((d) => d.inspectionId === insp.id);
              const openCount = inspDefects.filter((d) => d.status !== "BEHOBEN").length;
              const resolvedCount = inspDefects.filter((d) => d.status === "BEHOBEN").length;

              return (
                <div
                  key={insp.id}
                  className="card"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-strong)",
                    padding: "20px",
                  }}
                >
                  {/* Begehung Kopfbereich */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "14px",
                      marginBottom: "14px",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                          Baubegehung vom {new Date(insp.date).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}
                        </h2>
                        {getImpressionBadge(insp.overallImpression)}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          marginTop: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span><strong>Prüfer:</strong> {insp.inspector}</span>
                        {insp.weather && (
                          <>
                            <span>•</span>
                            <span><strong>Wetter:</strong> {insp.weather}</span>
                          </>
                        )}
                        {insp.participants && (
                          <>
                            <span>•</span>
                            <span><strong>Teilnehmer:</strong> {insp.participants}</span>
                          </>
                        )}
                      </div>

                      {insp.constructionProgress && (
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                          <strong>Bautenstand:</strong> {insp.constructionProgress}
                        </div>
                      )}

                      {insp.summary && (
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", fontStyle: "italic" }}>
                          „{insp.summary}“
                        </div>
                      )}
                    </div>

                    {/* Aktionen direkt bei der Begehung */}
                    <div className="no-print" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedInspectionForPrint(insp)}
                        className="btn btn-outline btn-sm"
                        title="Diesen Begehungsbericht einzeln drucken / als PDF speichern"
                      >
                        <Printer size={14} />
                        <span>Protokoll drucken</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openNewDefectForInspection(insp)}
                        className="btn btn-primary btn-sm"
                        title="Mangel zu dieser spezifischen Baubegehung erfassen"
                      >
                        <Plus size={15} />
                        <span>+ Mangel erfassen</span>
                      </button>
                    </div>
                  </div>

                  {/* ─── Unterbereich: Festgestellte Mängel dieser Begehung ─── */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <AlertTriangle size={16} color="var(--safety-amber)" />
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                          Mängel dieser Begehung ({inspDefects.length})
                        </h3>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          ({openCount} offen, {resolvedCount} behoben)
                        </span>
                      </div>
                    </div>

                    {inspDefects.length === 0 ? (
                      <div
                        style={{
                          padding: "16px",
                          background: "var(--bg-input)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px dashed var(--border)",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Bei dieser Begehung wurden bislang keine Mängel dokumentiert.</span>
                        <button
                          type="button"
                          onClick={() => openNewDefectForInspection(insp)}
                          className="btn btn-outline btn-sm no-print"
                          style={{ fontSize: "11.5px", padding: "3px 8px" }}
                        >
                          <Plus size={13} />
                          <span>Ersten Mangel erfassen</span>
                        </button>
                      </div>
                    ) : displayMode === "list" ? (
                      /* ─── LISTENANSICHT (Standard für Begehungsmängel) ─── */
                      <div className="table-container" style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}>
                        <table className="data-table" style={{ fontSize: "12.5px" }}>
                          <thead>
                            <tr>
                              <th style={{ width: "160px" }}>Schweregrad</th>
                              <th>Mangel &amp; Ort</th>
                              <th style={{ width: "170px" }}>Gewerk / Firma</th>
                              <th style={{ width: "120px" }}>Frist</th>
                              <th style={{ width: "155px" }}>Status</th>
                              <th className="no-print" style={{ width: "130px", textAlign: "right" }}>Aktionen</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inspDefects.map((defect) => {
                              const isOverdue =
                                defect.status !== "BEHOBEN" &&
                                defect.deadline &&
                                new Date(defect.deadline) < new Date();

                              return (
                                <tr key={defect.id}>
                                  <td style={{ whiteSpace: "nowrap" }}>{getSeverityBadge(defect.severity)}</td>
                                  <td>
                                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                      {defect.description}
                                    </div>
                                    {defect.location && (
                                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                                        <MapPin size={11} />
                                        <span>{defect.location}</span>
                                      </div>
                                    )}
                                    {defect.resolutionNote && (
                                      <div style={{ fontSize: "11px", color: "#34d399", marginTop: "2px" }}>
                                        ✓ {defect.resolutionNote}
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <div style={{ color: defect.tradeAssigned ? "var(--text-secondary)" : "var(--text-muted)" }}>
                                      {defect.tradeAssigned || "—"}
                                    </div>
                                  </td>
                                  <td>
                                    {defect.deadline ? (
                                      <span
                                        style={{
                                          color: isOverdue ? "var(--hazard-red)" : "inherit",
                                          fontWeight: isOverdue ? 700 : 400,
                                        }}
                                      >
                                        {new Date(defect.deadline).toLocaleDateString("de-DE")}
                                        {isOverdue && <div style={{ fontSize: "10px", color: "var(--hazard-red)" }}>Fällig!</div>}
                                      </span>
                                    ) : (
                                      <span style={{ color: "var(--text-muted)" }}>—</span>
                                    )}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>{getStatusBadge(defect.status)}</td>
                                  <td className="no-print" style={{ textAlign: "right" }}>
                                    <div style={{ display: "inline-flex", gap: "4px" }}>
                                      <button
                                        type="button"
                                        onClick={() => openEditModal(defect)}
                                        className="btn btn-outline btn-sm"
                                        style={{ padding: "3px 6px" }}
                                        title="Mangel bearbeiten"
                                      >
                                        <Edit3 size={12} />
                                      </button>
                                      {defect.status !== "BEHOBEN" && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedDefectToResolve(defect);
                                            setShowResolveModal(true);
                                          }}
                                          className="btn btn-secondary btn-sm"
                                          style={{ padding: "3px 6px", color: "var(--success-emerald)" }}
                                          title="Als behoben markieren"
                                        >
                                          <Check size={12} />
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDefect(defect.id)}
                                        className="btn btn-outline btn-sm"
                                        style={{ padding: "3px 6px", color: "var(--hazard-red)" }}
                                        title="Löschen"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* ─── KARTENANSICHT (Optional) ─── */
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
                        {inspDefects.map((defect) => {
                          const isOverdue =
                            defect.status !== "BEHOBEN" &&
                            defect.deadline &&
                            new Date(defect.deadline) < new Date();

                          return (
                            <div
                              key={defect.id}
                              className="cockpit-defect-card"
                              style={{
                                margin: 0,
                                borderLeft: `4px solid ${
                                  defect.status === "BEHOBEN"
                                    ? "var(--success-emerald)"
                                    : defect.severity === "GEFAHR_IM_VERZUG"
                                    ? "var(--hazard-red)"
                                    : defect.severity === "HOCH"
                                    ? "var(--safety-orange)"
                                    : "var(--safety-amber)"
                                }`,
                              }}
                            >
                              <div className="cockpit-defect-header">
                                <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)", flex: 1, minWidth: 0 }}>
                                  {defect.description}
                                </span>
                                <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                                  {getSeverityBadge(defect.severity)}
                                  {getStatusBadge(defect.status)}
                                </div>
                              </div>

                              <div className="cockpit-meta-row" style={{ marginBottom: "8px" }}>
                                {defect.location && (
                                  <span className="cockpit-tag">
                                    <MapPin size={11} />
                                    <span>{defect.location}</span>
                                  </span>
                                )}
                                {defect.tradeAssigned && (
                                  <span className="cockpit-tag">
                                    <Users size={11} />
                                    <span>{defect.tradeAssigned}</span>
                                  </span>
                                )}
                                {defect.deadline && (
                                  <span
                                    className="cockpit-tag"
                                    style={{
                                      color: isOverdue ? "var(--hazard-red)" : "inherit",
                                      borderColor: isOverdue ? "rgba(239, 68, 68, 0.4)" : "var(--border)",
                                      background: isOverdue ? "var(--hazard-red-dim)" : "var(--bg-muted)",
                                      fontWeight: isOverdue ? 700 : 400,
                                    }}
                                  >
                                    <Clock size={11} />
                                    <span>Frist: {new Date(defect.deadline).toLocaleDateString("de-DE")} {isOverdue && "(Fällig!)"}</span>
                                  </span>
                                )}
                              </div>

                              {defect.resolutionNote && (
                                <div style={{ padding: "6px 8px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "var(--radius-sm)", fontSize: "11px", color: "#34d399", marginBottom: "8px" }}>
                                  <strong>Behebung:</strong> {defect.resolutionNote}
                                </div>
                              )}

                              <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "8px", marginTop: "8px" }}>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(defect)}
                                    className="btn btn-outline btn-sm"
                                    style={{ fontSize: "11px", padding: "3px 8px" }}
                                  >
                                    <Edit3 size={12} />
                                    <span>Bearbeiten</span>
                                  </button>
                                  {defect.status !== "BEHOBEN" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedDefectToResolve(defect);
                                        setShowResolveModal(true);
                                      }}
                                      className="btn btn-secondary btn-sm"
                                      style={{ fontSize: "11px", padding: "3px 8px", color: "var(--success-emerald)" }}
                                    >
                                      <Check size={12} />
                                      <span>Beheben</span>
                                    </button>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteDefect(defect.id)}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: "3px 6px", color: "var(--hazard-red)" }}
                                  title="Löschen"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* TAB 2: GESAMT-MÄNGELLISTE (Standardmäßig als Liste)       */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === "all-defects" && (
        <div>
          {/* Filter Bar */}
          <div
            className="card no-print"
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { label: `Alle (${defects.length})`, value: "ALL", dotClass: "" },
                { label: `Offen (${defects.filter((d) => d.status === "OFFEN").length})`, value: "OFFEN", dotClass: "badge-dot-red" },
                { label: `In Bearbeitung (${defects.filter((d) => d.status === "IN_BEARBEITUNG").length})`, value: "IN_BEARBEITUNG", dotClass: "badge-dot-blue" },
                { label: `Behoben (${defects.filter((d) => d.status === "BEHOBEN").length})`, value: "BEHOBEN", dotClass: "badge-dot-green" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`btn btn-sm ${statusFilter === tab.value ? "btn-primary" : "btn-secondary"}`}
                  style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {tab.dotClass && <span className={`badge-dot ${tab.dotClass}`} />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Schweregrad:</span>
              <select
                className="form-select"
                style={{ width: "160px", padding: "4px 8px", fontSize: "12px" }}
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="ALL">Alle Schweregrade</option>
                <option value="GEFAHR_IM_VERZUG">Gefahr im Verzug</option>
                <option value="HOCH">Hoch</option>
                <option value="MITTEL">Mittel</option>
                <option value="GERING">Gering</option>
              </select>
            </div>
          </div>

          {filteredDefects.length === 0 ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}
            >
              Keine Mängel für die aktuelle Filterauswahl vorhanden.
            </div>
          ) : displayMode === "list" ? (
            /* ─── STANDARDFORMAT: PROFESSIONELLE TABELLARISCHE MÄNGELLISTE ─── */
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "160px" }}>Schweregrad</th>
                    <th style={{ minWidth: "220px" }}>Mangel &amp; Ort</th>
                    <th style={{ width: "190px" }}>Baubegehung (Herkunft)</th>
                    <th style={{ width: "170px" }}>Gewerk / Firma</th>
                    <th style={{ width: "130px" }}>Beseitigungsfrist</th>
                    <th style={{ width: "155px" }}>Status</th>
                    <th className="no-print" style={{ width: "130px", textAlign: "right" }}>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDefects.map((defect) => {
                    const parentInspection = getInspectionForDefect(defect);
                    const isOverdue =
                      defect.status !== "BEHOBEN" &&
                      defect.deadline &&
                      new Date(defect.deadline) < new Date();

                    return (
                      <tr key={defect.id}>
                        <td style={{ whiteSpace: "nowrap" }}>{getSeverityBadge(defect.severity)}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)", wordBreak: "break-word" }}>
                            {defect.description}
                          </div>
                          {defect.location && (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                              <MapPin size={11} />
                              <span>{defect.location}</span>
                            </div>
                          )}
                          {defect.resolutionNote && (
                            <div style={{ fontSize: "11px", color: "#34d399", marginTop: "3px" }}>
                              ✓ {defect.resolutionNote}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--safety-amber)", fontWeight: 600, fontSize: "11.5px" }}>
                              <Calendar size={12} />
                              <span>{parentInspection?.date ? new Date(parentInspection.date).toLocaleDateString("de-DE") : "—"}</span>
                            </span>
                            {parentInspection?.inspector && (
                              <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                                {parentInspection.inspector}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ color: defect.tradeAssigned ? "var(--text-secondary)" : "var(--text-muted)" }}>
                            {defect.tradeAssigned || "—"}
                          </div>
                        </td>
                        <td>
                          {defect.deadline ? (
                            <span
                              style={{
                                color: isOverdue ? "var(--hazard-red)" : "inherit",
                                fontWeight: isOverdue ? 700 : 400,
                              }}
                            >
                              {new Date(defect.deadline).toLocaleDateString("de-DE")}
                              {isOverdue && <div style={{ fontSize: "10px", color: "var(--hazard-red)", fontWeight: 700 }}>ÜBERFÄLLIG!</div>}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>—</span>
                          )}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>{getStatusBadge(defect.status)}</td>
                        <td className="no-print" style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "4px" }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(defect)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: "4px 7px" }}
                              title="Mangel bearbeiten"
                            >
                              <Edit3 size={12} />
                            </button>
                            {defect.status !== "BEHOBEN" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDefectToResolve(defect);
                                  setShowResolveModal(true);
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: "4px 7px", color: "var(--success-emerald)" }}
                                title="Als behoben markieren"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteDefect(defect.id)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: "4px 7px", color: "var(--hazard-red)" }}
                              title="Löschen"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* ─── KARTENANSICHT (Alternativ) ─── */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "16px" }}>
              {filteredDefects.map((defect) => {
                const parentInspection = getInspectionForDefect(defect);
                const isOverdue =
                  defect.status !== "BEHOBEN" &&
                  defect.deadline &&
                  new Date(defect.deadline) < new Date();

                return (
                  <div
                    key={defect.id}
                    className="card"
                    style={{
                      borderLeft: `5px solid ${
                        defect.status === "BEHOBEN"
                          ? "var(--success-emerald)"
                          : defect.severity === "GEFAHR_IM_VERZUG"
                          ? "var(--hazard-red)"
                          : defect.severity === "HOCH"
                          ? "var(--safety-orange)"
                          : "var(--safety-amber)"
                      }`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {/* Zuordnungs-Banner */}
                      <div
                        style={{
                          padding: "6px 10px",
                          background: "var(--bg-input)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          marginBottom: "10px",
                          fontSize: "11.5px",
                          color: "var(--text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "6px",
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--safety-amber)", fontWeight: 600 }}>
                          <Calendar size={13} />
                          <span>
                            Begehung: {parentInspection?.date ? new Date(parentInspection.date).toLocaleDateString("de-DE") : "Nicht zugeordnet"}
                          </span>
                        </span>
                        {parentInspection?.inspector && (
                          <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                            {parentInspection.inspector}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                        <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-primary)", wordBreak: "break-word" }}>
                          {defect.description}
                        </div>
                        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                          {getSeverityBadge(defect.severity)}
                          {getStatusBadge(defect.status)}
                        </div>
                      </div>

                      <div className="cockpit-meta-row" style={{ marginBottom: "10px" }}>
                        {defect.location && (
                          <span className="cockpit-tag">
                            <MapPin size={11} />
                            <span>{defect.location}</span>
                          </span>
                        )}
                        {defect.tradeAssigned && (
                          <span className="cockpit-tag">
                            <Users size={11} />
                            <span>{defect.tradeAssigned}</span>
                          </span>
                        )}
                        {defect.deadline && (
                          <span
                            className="cockpit-tag"
                            style={{
                              color: isOverdue ? "var(--hazard-red)" : "inherit",
                              borderColor: isOverdue ? "rgba(239, 68, 68, 0.4)" : "var(--border)",
                              background: isOverdue ? "var(--hazard-red-dim)" : "var(--bg-muted)",
                              fontWeight: isOverdue ? 700 : 400,
                            }}
                          >
                            <Clock size={11} />
                            <span>Frist: {new Date(defect.deadline).toLocaleDateString("de-DE")} {isOverdue && "(Fällig!)"}</span>
                          </span>
                        )}
                      </div>

                      {defect.resolutionNote && (
                        <div
                          style={{
                            padding: "6px 8px",
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.25)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "11px",
                            color: "#34d399",
                            marginBottom: "10px",
                          }}
                        >
                          <strong>Erledigung:</strong> {defect.resolutionNote}
                        </div>
                      )}
                    </div>

                    <div
                      className="no-print"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(defect)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: "11.5px", padding: "4px 9px" }}
                        >
                          <Edit3 size={12} />
                          <span>Bearbeiten</span>
                        </button>

                        {defect.status !== "BEHOBEN" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDefectToResolve(defect);
                              setShowResolveModal(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: "11.5px", padding: "4px 9px", color: "var(--success-emerald)" }}
                          >
                            <Check size={12} />
                            <span>Beheben</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteDefect(defect.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: "var(--hazard-red)", padding: "4px 8px" }}
                        title="Mangel löschen"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 1: NEUE BAUBEGEHUNG ANLEGEN                          */}
      {/* ────────────────────────────────────────────────────────── */}
      {showNewInspectionModal && (
        <div className="modal-overlay" onClick={() => setShowNewInspectionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={20} color="var(--safety-amber)" />
                <h3 className="title-md">Neue Baustellenbegehung anlegen</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewInspectionModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInspection}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Datum der Begehung *</label>
                  <input
                    type="date"
                    required
                    className="form-input font-mono"
                    value={inspDate}
                    onChange={(e) => setInspDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prüfer / SiGe-Koordinator *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={inspInspector}
                    onChange={(e) => setInspInspector(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Witterung / Wetter</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="z.B. Sonnig, ca. 18°C, trocken"
                    value={inspWeather}
                    onChange={(e) => setInspWeather(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gesamteindruck der Sicherheit</label>
                  <select
                    className="form-select"
                    value={inspImpression}
                    onChange={(e) => setInspImpression(e.target.value)}
                  >
                    <option value="SEHR_GUT">Sehr gut (Vorbildlich)</option>
                    <option value="GUT">Gut (Keine gravierenden Mängel)</option>
                    <option value="MAENGEL_FESTGESTELLT">Mängel festgestellt (Nachbesserung nötig)</option>
                    <option value="ERHEBLICHE_MAENGEL">Erhebliche Mängel (Gefahr im Verzug)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Teilnehmer der Begehung (Bauleitung, Firmen)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="z.B. Hr. Schmidt (Bauleiter), Hr. Meyer (SiGeKo), Polier Fa. BauTech"
                  value={inspParticipants}
                  onChange={(e) => setInspParticipants(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bautenstand / Baufortschritt</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="z.B. Rohbau 2. OG abgeschlossen, Montage Fassadengerüst läuft"
                  value={inspProgress}
                  onChange={(e) => setInspProgress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Zusammenfassende Notizen / Feststellungen</label>
                <textarea
                  className="form-textarea"
                  placeholder="Allgemeine Anmerkungen zur Baustellensituation..."
                  value={inspSummary}
                  onChange={(e) => setInspSummary(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowNewInspectionModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  Baubegehung speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 2: MANGEL ZU EINER BEGEHUNG ERFASSEN                */}
      {/* ────────────────────────────────────────────────────────── */}
      {showNewDefectModal && (
        <div className="modal-overlay" onClick={() => setShowNewDefectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={20} color="var(--safety-amber)" />
                <h3 className="title-md">Sicherheitsmangel erfassen</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewDefectModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            {/* Banner: Bestätigung der Begehungs-Zuordnung */}
            <div
              style={{
                padding: "8px 12px",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "16px",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <strong>Zugeordnete Baubegehung:</strong>{" "}
              {selectedInspectionForDefect
                ? `Begehung vom ${new Date(selectedInspectionForDefect.date).toLocaleDateString("de-DE")} (Prüfer: ${selectedInspectionForDefect.inspector})`
                : "Aktuelle Baubegehung"}
            </div>

            <form onSubmit={handleCreateDefect}>
              <div className="form-group">
                <label className="form-label">Mangelbeschreibung (präzise Feststellung) *</label>
                <textarea
                  required
                  rows={3}
                  className="form-textarea"
                  placeholder="z.B. Fehlende Seitenschutzbretter am Fassadengerüst Achse 3-4 im 2. OG. Absturzgefahr > 4 m."
                  value={defectDesc}
                  onChange={(e) => setDefectDesc(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Genaue Ortsangabe / Bauteil *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="z.B. 2. OG, Treppenauge Achse B"
                    value={defectLocation}
                    onChange={(e) => setDefectLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Schweregrad / Risikostufe</label>
                  <select
                    className="form-select"
                    value={defectSeverity}
                    onChange={(e) => setDefectSeverity(e.target.value)}
                  >
                    <option value="GEFAHR_IM_VERZUG">Gefahr im Verzug (Sofortmaßnahme!)</option>
                    <option value="HOCH">Hoch (Frist &lt; 24h)</option>
                    <option value="MITTEL">Mittel (Reguläre Behebung)</option>
                    <option value="GERING">Gering (Hinweis / Ordnung)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Zuständiges Gewerk / Verursacher-Firma</label>
                  <input
                    type="text"
                    list="contractors-list"
                    className="form-input"
                    placeholder="z.B. Gerüstbau Mustermann GmbH"
                    value={defectTrade}
                    onChange={(e) => setDefectTrade(e.target.value)}
                  />
                  <datalist id="contractors-list">
                    {contractors.map((c) => (
                      <option key={c.id} value={`${c.trade} (${c.companyName})`} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label">Beseitigungsfrist</label>
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={defectDeadline}
                    onChange={(e) => setDefectDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowNewDefectModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  Mangel erfassen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 3: MANGEL BEARBEITEN                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      {showEditDefectModal && selectedDefectToEdit && (
        <div className="modal-overlay" onClick={() => setShowEditDefectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit3 size={20} color="var(--safety-amber)" />
                <h3 className="title-md">Sicherheitsmangel bearbeiten</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditDefectModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateDefect}>
              {/* Zuordnung zur Baubegehung verändern / prüfen */}
              <div className="form-group">
                <label className="form-label">Zugeordnete Baubegehung</label>
                <select
                  className="form-select"
                  value={editInspectionId}
                  onChange={(e) => setEditInspectionId(e.target.value)}
                >
                  {inspections.map((insp) => (
                    <option key={insp.id} value={insp.id}>
                      Begehung vom {new Date(insp.date).toLocaleDateString("de-DE")} (Prüfer: {insp.inspector})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mangelbeschreibung *</label>
                <textarea
                  required
                  rows={3}
                  className="form-textarea"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Ort / Bauteil *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Schweregrad</label>
                  <select
                    className="form-select"
                    value={editSeverity}
                    onChange={(e) => setEditSeverity(e.target.value)}
                  >
                    <option value="GEFAHR_IM_VERZUG">Gefahr im Verzug</option>
                    <option value="HOCH">Hoch</option>
                    <option value="MITTEL">Mittel</option>
                    <option value="GERING">Gering</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Zuständiges Gewerk / Firma</label>
                  <input
                    type="text"
                    list="edit-contractors-list"
                    className="form-input"
                    value={editTrade}
                    onChange={(e) => setEditTrade(e.target.value)}
                  />
                  <datalist id="edit-contractors-list">
                    {contractors.map((c) => (
                      <option key={c.id} value={`${c.trade} (${c.companyName})`} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label">Beseitigungsfrist</label>
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Status der Mängelbeseitigung</label>
                  <select
                    className="form-select"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="OFFEN">OFFEN</option>
                    <option value="IN_BEARBEITUNG">IN BEARBEITUNG</option>
                    <option value="BEHOBEN">BEHOBEN (Abgenommen)</option>
                  </select>
                </div>

                {editStatus === "BEHOBEN" && (
                  <div className="form-group">
                    <label className="form-label">Erledigungsvermerk / Abnahme</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="z.B. Vor Ort geprüft und freigegeben"
                      value={editResolutionNote}
                      onChange={(e) => setEditResolutionNote(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowEditDefectModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary">
                  Änderungen speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 4: SCHNELLE BEHEBUNG (RESOLUTION NOTE)               */}
      {/* ────────────────────────────────────────────────────────── */}
      {showResolveModal && selectedDefectToResolve && (
        <div className="modal-overlay" onClick={() => setShowResolveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={20} color="var(--success-emerald)" />
                <h3 className="title-md">Mangel als behoben abnehmen</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveDefect}>
              <div style={{ marginBottom: "14px", fontSize: "13px", color: "var(--text-secondary)" }}>
                <strong>Mangel:</strong> {selectedDefectToResolve.description}
              </div>

              <div className="form-group">
                <label className="form-label">Erledigungsvermerk / Abnahmenotiz</label>
                <textarea
                  className="form-textarea"
                  placeholder="z.B. Durch Polier ordnungsgemäß nachgerüstet und durch SiGeKo freigegeben."
                  value={quickResolutionNote}
                  onChange={(e) => setQuickResolutionNote(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: "var(--success-emerald)", borderColor: "var(--success-emerald)" }}>
                  Mangel als behoben bestätigen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL / DRUCKVORSCHAU: EINZELNES BEGEHUNGSPROTOKOLL        */}
      {/* ────────────────────────────────────────────────────────── */}
      {selectedInspectionForPrint && (() => {
        const printDefects =
          defects.filter((d) => d.inspectionId === selectedInspectionForPrint.id).length > 0
            ? defects.filter((d) => d.inspectionId === selectedInspectionForPrint.id)
            : selectedInspectionForPrint.defects || [];

        return (
          <div
            className="print-protocol-overlay"
            onClick={() => setSelectedInspectionForPrint(null)}
          >
            <div
              className="print-protocol-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toolbar oben (nur Bildschirm) */}
              <div
                className="no-print"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--bg-surface)",
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-lg)",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="badge badge-amber" style={{ fontSize: "11px" }}>RAB 30 Druckansicht</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    Begehungsprotokoll vom {new Date(selectedInspectionForPrint.date).toLocaleDateString("de-DE")}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    ({printDefects.length} Mängel dokumentiert)
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 600, padding: "6px 14px" }}
                  >
                    <Printer size={15} />
                    <span>Jetzt drucken / Als PDF speichern</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInspectionForPrint(null)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "6px 12px" }}
                  >
                    ✕ Schließen
                  </button>
                </div>
              </div>

              {/* Offizielles DIN-A4 Begehungsprotokoll */}
              <div className="protocol-sheet" id="single-inspection-report">
                {/* Dokumentenkopf */}
                <div
                  style={{
                    borderBottom: "2.5px solid #0f172a",
                    paddingBottom: "14px",
                    marginBottom: "18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#0f172a", lineHeight: 1.15 }}>
                      Baustellenbegehungsprotokoll
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "3px" }}>
                      Sicherheits- &amp; Gesundheitsschutzkoordination (BaustellV &amp; RAB 30)
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                      Dokumentation der periodischen Baustellenbegehung und Mängelüberwachung
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontSize: "10.5px", color: "#334155", lineHeight: 1.5, flexShrink: 0 }}>
                    <div><strong>Begehungsdatum:</strong> {new Date(selectedInspectionForPrint.date).toLocaleDateString("de-DE")}</div>
                    {project?.projectNumber && (
                      <div><strong>Projekt-Az:</strong> {project.projectNumber}</div>
                    )}
                    <div><strong>Druckdatum:</strong> {new Date().toLocaleDateString("de-DE")}</div>
                  </div>
                </div>

                {/* Stammdaten-Tabelle */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 1fr",
                    gap: "16px",
                    marginBottom: "18px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    padding: "12px 14px",
                    background: "#f8fafc",
                    fontSize: "11px",
                    lineHeight: 1.5,
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "5px" }}>
                      <span style={{ color: "#64748b", display: "inline-block", width: "105px" }}>Bauvorhaben:</span>
                      <strong style={{ color: "#0f172a" }}>{project?.name || "SiGeKo Bauprojekt"}</strong>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <span style={{ color: "#64748b", display: "inline-block", width: "105px" }}>Standort:</span>
                      <span style={{ color: "#0f172a" }}>{project?.location || "—"}</span>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <span style={{ color: "#64748b", display: "inline-block", width: "105px" }}>Bauherr:</span>
                      <span style={{ color: "#0f172a" }}>{project?.clientName || "—"}</span>
                    </div>
                    <div>
                      <span style={{ color: "#64748b", display: "inline-block", width: "105px" }}>Bauleitung:</span>
                      <span style={{ color: "#0f172a" }}>{project?.siteManager || "—"}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ marginBottom: "5px" }}>
                      <span style={{ color: "#64748b", display: "inline-block", width: "110px" }}>SiGe-Koordinator:</span>
                      <strong style={{ color: "#0f172a" }}>{selectedInspectionForPrint.inspector}</strong>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <span style={{ color: "#64748b", display: "inline-block", width: "110px" }}>Witterung:</span>
                      <span style={{ color: "#0f172a" }}>{selectedInspectionForPrint.weather || "—"}</span>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                      <span style={{ color: "#64748b", display: "inline-block", width: "110px" }}>Bautenstand:</span>
                      <span style={{ color: "#0f172a" }}>{selectedInspectionForPrint.constructionProgress || "—"}</span>
                    </div>
                    <div>
                      <span style={{ color: "#64748b", display: "inline-block", width: "110px" }}>Teilnehmer:</span>
                      <span style={{ color: "#0f172a" }}>{selectedInspectionForPrint.participants || "Keine gesonderten Teilnehmer vermerkt"}</span>
                    </div>
                  </div>
                </div>

                {/* Gesamteindruck & Feststellungen */}
                <div
                  style={{
                    marginBottom: "18px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    padding: "10px 14px",
                    background: "#ffffff",
                    fontSize: "11px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: selectedInspectionForPrint.summary ? "6px" : 0 }}>
                    <span style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "11px", color: "#0f172a", letterSpacing: "0.02em" }}>
                      Gesamteindruck der Arbeitssicherheit vor Ort:
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: "4px",
                        fontSize: "10.5px",
                        border: "1.5px solid #0f172a",
                        background:
                          selectedInspectionForPrint.overallImpression === "ERHEBLICHE_MAENGEL"
                            ? "#fee2e2"
                            : selectedInspectionForPrint.overallImpression === "MAENGEL_FESTGESTELLT"
                            ? "#fef3c7"
                            : "#d1fae5",
                        color:
                          selectedInspectionForPrint.overallImpression === "ERHEBLICHE_MAENGEL"
                            ? "#991b1b"
                            : selectedInspectionForPrint.overallImpression === "MAENGEL_FESTGESTELLT"
                            ? "#92400e"
                            : "#065f46",
                      }}
                    >
                      {selectedInspectionForPrint.overallImpression.replace(/_/g, " ")}
                    </span>
                  </div>
                  {selectedInspectionForPrint.summary && (
                    <div style={{ color: "#334155", fontStyle: "italic", marginTop: "6px", lineHeight: 1.45, borderTop: "1px dashed #e2e8f0", paddingTop: "6px" }}>
                      „{selectedInspectionForPrint.summary}“
                    </div>
                  )}
                </div>

                {/* Mängeltabelle dieser Begehung */}
                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1.5px solid #0f172a",
                      paddingBottom: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: "11.5px", textTransform: "uppercase", color: "#0f172a", letterSpacing: "0.03em" }}>
                      Festgestellte Sicherheitsmängel &amp; Beseitigungsauflagen ({printDefects.length})
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      Rechtliche Fristüberwachung gem. RAB 30
                    </span>
                  </div>

                  {printDefects.length === 0 ? (
                    <div style={{ padding: "16px", border: "1px dashed #cbd5e1", borderRadius: "4px", fontSize: "11px", color: "#475569", textAlign: "center", background: "#f8fafc" }}>
                      ✓ Bei dieser Baustellenbegehung wurden keine Sicherheitsmängel festgestellt. Alle geprüften Bereiche entsprachen den SiGe-Vorgaben.
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", borderBottom: "1.5px solid #0f172a" }}>
                          <th style={{ padding: "6px 8px", border: "1px solid #cbd5e1", width: "26px", textAlign: "center", color: "#0f172a", fontWeight: 700 }}>Nr.</th>
                          <th style={{ padding: "6px 8px", border: "1px solid #cbd5e1", width: "115px", color: "#0f172a", fontWeight: 700 }}>Schweregrad</th>
                          <th style={{ padding: "6px 8px", border: "1px solid #cbd5e1", color: "#0f172a", fontWeight: 700 }}>Mangel &amp; Ort</th>
                          <th style={{ padding: "6px 8px", border: "1px solid #cbd5e1", width: "140px", color: "#0f172a", fontWeight: 700 }}>Zuständiges Gewerk</th>
                          <th style={{ padding: "6px 8px", border: "1px solid #cbd5e1", width: "85px", color: "#0f172a", fontWeight: 700 }}>Frist</th>
                          <th style={{ padding: "6px 8px", border: "1px solid #cbd5e1", width: "80px", color: "#0f172a", fontWeight: 700 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {printDefects.map((def, idx) => {
                          const isOverdue =
                            def.status !== "BEHOBEN" &&
                            def.deadline &&
                            new Date(def.deadline) < new Date();

                          return (
                            <tr key={def.id} style={{ borderBottom: "1px solid #cbd5e1", pageBreakInside: "avoid" }}>
                              <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", textAlign: "center", fontWeight: 700 }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontWeight: 700 }}>
                                <span
                                  style={{
                                    color:
                                      def.severity === "GEFAHR_IM_VERZUG"
                                        ? "#b91c1c"
                                        : def.severity === "HOCH"
                                        ? "#ea580c"
                                        : "#92400e",
                                  }}
                                >
                                  {def.severity === "GEFAHR_IM_VERZUG" ? "⚠ Gefahr im Verzug" : def.severity.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1" }}>
                                <div style={{ fontWeight: 600, color: "#0f172a" }}>{def.description}</div>
                                {def.location && (
                                  <div style={{ fontSize: "9.5px", color: "#475569", marginTop: "2px" }}>
                                    Ort: {def.location}
                                  </div>
                                )}
                                {def.resolutionNote && (
                                  <div style={{ fontSize: "9.5px", color: "#059669", marginTop: "2px", fontWeight: 600 }}>
                                    ✓ Erledigt: {def.resolutionNote}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", color: "#334155" }}>
                                {def.tradeAssigned || "—"}
                              </td>
                              <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1", fontFamily: "monospace", fontSize: "10px" }}>
                                {def.deadline ? (
                                  <span style={{ color: isOverdue ? "#dc2626" : "inherit", fontWeight: isOverdue ? 800 : 400 }}>
                                    {new Date(def.deadline).toLocaleDateString("de-DE")}
                                    {isOverdue && <div style={{ fontSize: "8.5px", color: "#dc2626", fontWeight: 800 }}>ÜBERFÄLLIG!</div>}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td style={{ padding: "6px 8px", border: "1px solid #cbd5e1" }}>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "9.5px",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    border: "1px solid #cbd5e1",
                                    background:
                                      def.status === "BEHOBEN"
                                        ? "#d1fae5"
                                        : def.status === "IN_BEARBEITUNG"
                                        ? "#e0f2fe"
                                        : "#fee2e2",
                                    color:
                                      def.status === "BEHOBEN"
                                        ? "#065f46"
                                        : def.status === "IN_BEARBEITUNG"
                                        ? "#0369a1"
                                        : "#991b1b",
                                  }}
                                >
                                  {def.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Rechtliche Hinweise gem. BaustellV & ArbSchG */}
                <div
                  style={{
                    marginBottom: "28px",
                    padding: "8px 12px",
                    borderLeft: "3.5px solid #0f172a",
                    background: "#f8fafc",
                    fontSize: "9.5px",
                    color: "#475569",
                    lineHeight: 1.45,
                    pageBreakInside: "avoid",
                  }}
                >
                  <strong>Rechtlicher Hinweis &amp; Beseitigungsanordnung:</strong> Gemäß § 4 Baustellenverordnung (BaustellV) sowie § 4 Arbeitsschutzgesetz (ArbSchG) sind die festgestellten Mängel von den zuständigen Unternehmen innerhalb der festgesetzten Fristen fachgerecht zu beseitigen. Die Mängelbeseitigung ist der Bauleitung und dem SiGe-Koordinator schriftlich anzuzeigen. Bei Einstufung als „Gefahr im Verzug“ sind die Arbeiten im Gefahrenbereich mit sofortiger Wirkung einzustellen, bis wirksame Schutzmaßnahmen getroffen wurden.
                </div>

                {/* Unterschriftenblock */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "40px",
                    marginTop: "30px",
                    fontSize: "10.5px",
                    pageBreakInside: "avoid",
                  }}
                >
                  <div>
                    <div style={{ borderBottom: "1.5px solid #0f172a", height: "40px", marginBottom: "4px" }}></div>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Ort, Datum / Unterschrift SiGe-Koordinator</div>
                    <div style={{ fontSize: "9.5px", color: "#64748b" }}>({selectedInspectionForPrint.inspector})</div>
                  </div>

                  <div>
                    <div style={{ borderBottom: "1.5px solid #0f172a", height: "40px", marginBottom: "4px" }}></div>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Kenntnisnahme Bauleitung / Bauherr</div>
                    <div style={{ fontSize: "9.5px", color: "#64748b" }}>(Name in Druckbuchstaben, Datum &amp; Unterschrift)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
