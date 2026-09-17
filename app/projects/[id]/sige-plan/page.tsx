"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ShieldAlert,
  Plus,
  Printer,
  Search,
  Filter,
  Trash2,
  Edit2,
  BookOpen,
  Check,
  AlertTriangle,
  Flame,
  HardHat,
  Calendar,
} from "lucide-react";
import {
  SiGePlanToolbar,
  SiGeViewMode,
  SiGeTimeScale,
} from "./components/SiGePlanToolbar";
import {
  SiGeGanttView,
  GanttEntry,
  getTradeColor,
} from "./components/SiGeGanttView";
import { SiGeSplitView } from "./components/SiGeSplitView";
import { SiGeCatalogSidebar } from "./components/SiGeCatalogSidebar";
import { SiGeEntryEditModal } from "./components/SiGeEntryEditModal";
import { CatalogItem } from "@/lib/sample-catalog";

interface ProjectData {
  id: string;
  name: string;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  sigePlanEntries: GanttEntry[];
}

export default function SiGePlanPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [entries, setEntries] = useState<GanttEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // View state (defaults to split view as shown in the screenshot)
  const [viewMode, setViewMode] = useState<SiGeViewMode>("split");
  const [timeScale, setTimeScale] = useState<SiGeTimeScale>("weeks");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showTodayLine, setShowTodayLine] = useState(true);
  const [showBarGuidelines, setShowBarGuidelines] = useState(true);
  const [showMiniTimeline, setShowMiniTimeline] = useState(true);
  const [jumpDate, setJumpDate] = useState("");
  const [showCatalogSidebar, setShowCatalogSidebar] = useState(false);

  // Filter
  const [selectedPhase, setSelectedPhase] = useState("ALL");
  const [onlyAnnex2, setOnlyAnnex2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals & Selection
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GanttEntry | null>(null);
  const [addingCatalogId, setAddingCatalogId] = useState<string | null>(null);

  // New Entry Form State
  const [formPhase, setFormPhase] = useState("2. Rohbauarbeiten");
  const [formTrade, setFormTrade] = useState("Rohbau & Massivbau");
  const [formActivity, setFormActivity] = useState("");
  const [formHazards, setFormHazards] = useState("");
  const [formIsAnnex2, setFormIsAnnex2] = useState(false);
  const [formOverlap, setFormOverlap] = useState("");
  const [formMeasures, setFormMeasures] = useState("");
  const [formResponsible, setFormResponsible] = useState("");
  const [formRegulations, setFormRegulations] = useState("");
  const [formPriority, setFormPriority] = useState("NORMAL");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProject = () => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProject(data);
          if (Array.isArray(data.sigePlanEntries)) {
            setEntries(data.sigePlanEntries);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProject();
  }, [params.id]);

  // Add position from Catalog sidebar
  const handleAddFromCatalog = async (item: CatalogItem) => {
    setAddingCatalogId(item.activity);
    try {
      // Determine default phase & approximate dates
      let phase = "2. Rohbauarbeiten";
      const catLower = item.tradeCategory.toLowerCase();
      if (catLower.includes("einrichtung") || catLower.includes("verkehr")) {
        phase = "1. Baustelleneinrichtung & Verkehrswege";
      } else if (catLower.includes("tiefbau") || catLower.includes("erdarbeit")) {
        phase = "1. Baustelleneinrichtung & Erdarbeiten";
      } else if (catLower.includes("gerüst") || catLower.includes("fassade")) {
        phase = "3. Fassade & Gerüstbau";
      } else if (catLower.includes("dach")) {
        phase = "4. Dacharbeiten";
      } else if (catLower.includes("ausbau") || catLower.includes("elektro")) {
        phase = "5. Ausbau & Haustechnik";
      }

      // Default start/end dates
      const baseStart = project?.plannedStart ? new Date(project.plannedStart) : new Date();
      const start = new Date(baseStart.getTime() + entries.length * 7 * 86400000);
      const end = new Date(start.getTime() + 21 * 86400000);

      const res = await fetch(`/api/projects/${params.id}/sige-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase,
          trade: item.tradeCategory,
          activity: item.activity,
          hazards: item.hazard,
          isAnnex2SpecialHazard: item.isAnnex2,
          commonMeasures: item.protectiveMeasure,
          regulations: item.regulations,
          priority: item.isAnnex2 ? "HOCH" : "NORMAL",
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          color: getTradeColor(item.tradeCategory, null),
        }),
      });

      if (res.ok) {
        loadProject();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingCatalogId(null);
    }
  };

  // Update entry dates from Gantt drag/resize
  const handleUpdateDates = async (entryId: string, startDate: string, endDate: string) => {
    try {
      // Optimistic local update
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, startDate, endDate } : e))
      );

      await fetch(`/api/projects/${params.id}/sige-plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId,
          startDate,
          endDate,
        }),
      });
    } catch (err) {
      console.error("Failed to update dates", err);
      loadProject();
    }
  };

  // Full entry edit from modal
  const handleSaveEntryDetails = async (
    updated: Partial<GanttEntry> & { entryId: string }
  ) => {
    try {
      const res = await fetch(`/api/projects/${params.id}/sige-plan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        loadProject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Manual entry create
  const handleCreateManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formActivity || !formHazards || !formMeasures) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${params.id}/sige-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: formPhase,
          trade: formTrade,
          activity: formActivity,
          hazards: formHazards,
          isAnnex2SpecialHazard: formIsAnnex2,
          spatialTemporalOverlap: formOverlap || null,
          commonMeasures: formMeasures,
          responsibleCompany: formResponsible || null,
          regulations: formRegulations || null,
          priority: formPriority,
          startDate: formStartDate ? new Date(formStartDate).toISOString() : null,
          endDate: formEndDate ? new Date(formEndDate).toISOString() : null,
          color: getTradeColor(formTrade, null),
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setFormActivity("");
        setFormHazards("");
        setFormMeasures("");
        setFormOverlap("");
        setFormRegulations("");
        setFormStartDate("");
        setFormEndDate("");
        loadProject();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const res = await fetch(`/api/projects/${params.id}/sige-plan?entryId=${entryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Zoom helpers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.5, prev - 0.25));
  const handleZoomFit = () => setZoomLevel(1.0);

  // Filter-Logik
  const filteredEntries = entries.filter((e) => {
    const matchesPhase = selectedPhase === "ALL" || e.phase === selectedPhase;
    const matchesAnnex2 = !onlyAnnex2 || e.isAnnex2SpecialHazard;
    const matchesSearch =
      !searchTerm ||
      e.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.hazards.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.commonMeasures.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPhase && matchesAnnex2 && matchesSearch;
  });

  const uniquePhases = Array.from(new Set(entries.map((e) => e.phase)));

  return (
    <div>
      {/* 1. Header (Seiten-Titel & Status) */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="title-xl">Sicherheits- &amp; Gesundheitsschutzplan (SiGe-Plan)</h2>
            <span className="badge badge-amber">RAB 31 Standard</span>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: "var(--bg-muted)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {viewMode === "split"
                ? "Ansicht: Tabelle / Ablaufplan (Split)"
                : viewMode === "gantt"
                ? "Ansicht: Ablaufplan (Gantt)"
                : "Ansicht: Tabelle (RAB 31)"}
            </span>
          </div>
          <p className="text-secondary" style={{ marginTop: "4px" }}>
            Gewerkeübergreifende Koordination der Arbeitsabläufe, Schutzmaßnahmen und besonderen Gefahren gem. BaustellV Anhang II.
          </p>
        </div>
      </div>

      {/* 2. SiGe-Plan Multi-View Toolbar (orientiert am Screenshot) */}
      <SiGePlanToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        timeScale={timeScale}
        onTimeScaleChange={setTimeScale}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomFit={handleZoomFit}
        showTodayLine={showTodayLine}
        onToggleTodayLine={() => setShowTodayLine(!showTodayLine)}
        showBarGuidelines={showBarGuidelines}
        onToggleBarGuidelines={() => setShowBarGuidelines(!showBarGuidelines)}
        showMiniTimeline={showMiniTimeline}
        onToggleMiniTimeline={() => setShowMiniTimeline(!showMiniTimeline)}
        jumpDate={jumpDate}
        onJumpDateChange={setJumpDate}
        showCatalog={showCatalogSidebar}
        onToggleCatalog={() => setShowCatalogSidebar(!showCatalogSidebar)}
        onAddNewEntry={() => setShowAddModal(true)}
        totalEntriesCount={filteredEntries.length}
      />

      {/* 3. Filterleiste (Durchsuchen & Phasenauswahl) */}
      <div
        className="card no-print"
        style={{
          padding: "10px 14px",
          marginBottom: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "32px", fontSize: "12px", padding: "6px 8px 6px 32px" }}
              placeholder="Gefährdung, Gewerk oder Maßnahme durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: "220px", fontSize: "12px", padding: "6px 8px" }}
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            <option value="ALL">Alle Bauphasen ({entries.length})</option>
            {uniquePhases.map((phase) => (
              <option key={phase} value={phase}>
                {phase}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px" }}>
            <input
              type="checkbox"
              style={{ width: "15px", height: "15px", accentColor: "var(--hazard-red)" }}
              checked={onlyAnnex2}
              onChange={(e) => setOnlyAnnex2(e.target.checked)}
            />
            <span style={{ color: onlyAnnex2 ? "var(--hazard-red)" : "var(--text-secondary)", fontWeight: 500 }}>
              Nur Anhang II (Besondere Gefahren)
            </span>
          </label>

          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {filteredEntries.length} von {entries.length} Positionen
          </div>
        </div>
      </div>

      {/* 4. Hauptarbeitsbereich (mit optionaler Katalog-Sidebar links) */}
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        {/* Dockbarer Gefährdungskatalog (Sidebar links) */}
        <SiGeCatalogSidebar
          isOpen={showCatalogSidebar}
          onClose={() => setShowCatalogSidebar(false)}
          onAddItem={handleAddFromCatalog}
          addingItemId={addingCatalogId}
        />

        {/* Ansichten-Inhalt */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* A: Split-Ansicht (Tabelle + Ablaufplan synchronisiert wie im Screenshot) */}
          {viewMode === "split" && (
            <SiGeSplitView
              entries={filteredEntries}
              projectStart={project?.plannedStart}
              projectEnd={project?.plannedEnd}
              timeScale={timeScale}
              zoomLevel={zoomLevel}
              showTodayLine={showTodayLine}
              showBarGuidelines={showBarGuidelines}
              showMiniTimeline={showMiniTimeline}
              jumpDate={jumpDate}
              onUpdateDates={handleUpdateDates}
              onSelectEntry={(entry) => setEditingEntry(entry)}
              onDeleteEntry={handleDeleteEntry}
            />
          )}

          {/* B: Vollbild Ablaufplan (Gantt) */}
          {viewMode === "gantt" && (
            <SiGeGanttView
              entries={filteredEntries}
              projectStart={project?.plannedStart}
              projectEnd={project?.plannedEnd}
              timeScale={timeScale}
              zoomLevel={zoomLevel}
              showTodayLine={showTodayLine}
              showBarGuidelines={showBarGuidelines}
              showMiniTimeline={showMiniTimeline}
              jumpDate={jumpDate}
              onUpdateDates={handleUpdateDates}
              onSelectEntry={(entry) => setEditingEntry(entry)}
              isSplitView={false}
            />
          )}

          {/* C: Reine Tabellenansicht (RAB 31) */}
          {viewMode === "table" && (
            <div>
              <div className="table-scroll-hint no-print">
                ← Tabelle seitlich wischen / scrollen →
              </div>
              <div className="table-container print-landscape">
                <table className="data-table" id="sige-plan-table">
                  <thead>
                    <tr>
                      <th style={{ width: "16%" }}>Bauphase &amp; Tätigkeit</th>
                      <th style={{ width: "14%" }}>Gewerk / Firma</th>
                      <th style={{ width: "14%" }}>Termine (Ablauf)</th>
                      <th style={{ width: "20%" }}>Gefährdungen &amp; Risiken</th>
                      <th style={{ width: "12%" }}>Überschneidung</th>
                      <th style={{ width: "20%" }}>Schutzmaßnahmen (Kollektivschutz)</th>
                      <th className="no-print" style={{ width: "4%", textAlign: "center" }}>Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                          Keine SiGe-Plan-Positionen gefunden. Nutzen Sie den Katalog oder legen Sie eine neue Position an.
                        </td>
                      </tr>
                    ) : (
                      filteredEntries.map((entry) => {
                        const tradeColor = getTradeColor(entry.trade, entry.color);
                        return (
                          <tr
                            key={entry.id}
                            onClick={() => setEditingEntry(entry)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* Phase & Tätigkeit */}
                            <td>
                              <div style={{ fontSize: "11px", color: "var(--safety-amber)", fontWeight: 600 }}>
                                {entry.phase}
                              </div>
                              <div style={{ fontWeight: 600, fontSize: "13px", marginTop: "2px", color: "var(--text-primary)" }}>
                                {entry.activity}
                              </div>
                            </td>

                            {/* Gewerk / Firma */}
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "2px",
                                    backgroundColor: tradeColor,
                                    flexShrink: 0,
                                  }}
                                />
                                <span style={{ fontWeight: 600 }}>{entry.trade}</span>
                              </div>
                              {entry.responsibleCompany && (
                                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                                  {entry.responsibleCompany}
                                </div>
                              )}
                            </td>

                            {/* Termine (Ablaufplan) */}
                            <td>
                              {entry.startDate && entry.endDate ? (
                                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                    {new Date(entry.startDate).toLocaleDateString("de-DE")}
                                  </div>
                                  <div>bis {new Date(entry.endDate).toLocaleDateString("de-DE")}</div>
                                </div>
                              ) : (
                                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
                                  Automatisch berechnet
                                </span>
                              )}
                            </td>

                            {/* Gefährdungen */}
                            <td>
                              {entry.isAnnex2SpecialHazard && (
                                <div style={{ marginBottom: "6px" }}>
                                  <span className="badge badge-annex2">
                                    ⚠️ ANHANG II: BESONDERE GEFAHR
                                  </span>
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: entry.isAnnex2SpecialHazard ? "#fecaca" : "var(--text-primary)",
                                  lineHeight: "1.45",
                                }}
                              >
                                {entry.hazards}
                              </div>
                            </td>

                            {/* Überschneidungen */}
                            <td style={{ fontSize: "12.5px", color: entry.spatialTemporalOverlap ? "var(--text-secondary)" : "var(--text-muted)" }}>
                              {entry.spatialTemporalOverlap || "Keine kritischen Überschneidungen"}
                            </td>

                            {/* Schutzmaßnahmen */}
                            <td>
                              <div style={{ fontSize: "13px", lineHeight: "1.45", color: "#f8fafc" }}>
                                {entry.commonMeasures}
                              </div>
                              {entry.regulations && (
                                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                                  {entry.regulations}
                                </div>
                              )}
                            </td>

                            {/* Aktionen */}
                            <td className="no-print" style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => setEditingEntry(entry)}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: "4px 6px" }}
                                  title="Bearbeiten"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("Diesen Eintrag wirklich entfernen?")) {
                                      handleDeleteEntry(entry.id);
                                    }
                                  }}
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: "4px 6px", color: "var(--hazard-red)" }}
                                  title="Position löschen"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Detail- & Bearbeitungs-Modal für Positionen */}
      <SiGeEntryEditModal
        entry={editingEntry}
        isOpen={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        onSave={handleSaveEntryDetails}
        onDelete={handleDeleteEntry}
      />

      {/* 6. Modal für neue manuelle Position */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: "700px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldAlert size={22} color="var(--safety-amber)" />
                <h3 className="title-md">Neue SiGe-Plan Position hinzufügen</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualEntry}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Phase & Gewerk */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Bauphase *</label>
                    <select
                      className="form-select"
                      value={formPhase}
                      onChange={(e) => setFormPhase(e.target.value)}
                      required
                    >
                      <option value="1. Baustelleneinrichtung &amp; Erdarbeiten">1. Baustelleneinrichtung &amp; Erdarbeiten</option>
                      <option value="2. Rohbauarbeiten">2. Rohbauarbeiten</option>
                      <option value="3. Fassade &amp; Gerüstbau">3. Fassade &amp; Gerüstbau</option>
                      <option value="4. Dacharbeiten">4. Dacharbeiten</option>
                      <option value="5. Ausbau &amp; Haustechnik">5. Ausbau &amp; Haustechnik</option>
                      <option value="6. Außenanlagen &amp; Rückbau">6. Außenanlagen &amp; Rückbau</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Gewerk / Branche *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="z.B. Stahlbetonbau, Tiefbau..."
                      value={formTrade}
                      onChange={(e) => setFormTrade(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Termine (Ablaufplan) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Beginn im Ablaufplan</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Ende im Ablaufplan</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tätigkeit */}
                <div>
                  <label className="form-label">Konkrete Tätigkeit / Arbeitsgang *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="z.B. Ausschalen von Deckenfeldern in 4m Höhe"
                    value={formActivity}
                    onChange={(e) => setFormActivity(e.target.value)}
                    required
                  />
                </div>

                {/* Gefährdungen & Anhang II Checkbox */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label className="form-label" style={{ margin: 0 }}>Gefährdungen &amp; Risiken *</label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px" }}>
                      <input
                        type="checkbox"
                        checked={formIsAnnex2}
                        onChange={(e) => setFormIsAnnex2(e.target.checked)}
                        style={{ accentColor: "var(--hazard-red)" }}
                      />
                      <span style={{ color: formIsAnnex2 ? "var(--hazard-red)" : "var(--text-muted)", fontWeight: formIsAnnex2 ? 600 : 400 }}>
                        ⚠️ BaustellV Anhang II (Besondere Gefahr)
                      </span>
                    </label>
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Beschreiben Sie Absturz-, Verschüttungs- oder Gesundheitsgefahren..."
                    value={formHazards}
                    onChange={(e) => setFormHazards(e.target.value)}
                    required
                  />
                </div>

                {/* Gemeinsame Schutzmaßnahmen */}
                <div>
                  <label className="form-label">Gemeinsame Schutzmaßnahmen (Kollektivschutz) *</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="z.B. Seitenschutz dreiteilig, Fanggerüst, Absperrung des Gefahrenbereichs..."
                    value={formMeasures}
                    onChange={(e) => setFormMeasures(e.target.value)}
                    required
                  />
                </div>

                {/* Überschneidung & Firma */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Räumlich/zeitliche Überschneidung</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="z.B. Gleichzeitige Elektroinstallation..."
                      value={formOverlap}
                      onChange={(e) => setFormOverlap(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Zuständige Firma</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="z.B. Musterbau GmbH"
                      value={formResponsible}
                      onChange={(e) => setFormResponsible(e.target.value)}
                    />
                  </div>
                </div>

                {/* Regelwerke */}
                <div>
                  <label className="form-label">Regelwerke / Vorschriften</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="z.B. DGUV Vorschrift 38, ASR A2.1, DIN EN 12811"
                    value={formRegulations}
                    onChange={(e) => setFormRegulations(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Wird angelegt..." : "Position anlegen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
