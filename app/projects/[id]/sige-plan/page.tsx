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
} from "lucide-react";

interface SiGeEntry {
  id: string;
  projectId: string;
  phase: string;
  trade: string;
  activity: string;
  hazards: string;
  isAnnex2SpecialHazard: boolean;
  spatialTemporalOverlap: string | null;
  commonMeasures: string;
  responsibleCompany: string | null;
  regulations: string | null;
  priority: string;
  orderIndex: number;
}

interface CatalogItem {
  id: string;
  tradeCategory: string;
  activity: string;
  hazard: string;
  protectiveMeasure: string;
  isAnnex2: boolean;
  regulations: string | null;
}

export default function SiGePlanPage() {
  const params = useParams<{ id: string }>();
  const [entries, setEntries] = useState<SiGeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [selectedPhase, setSelectedPhase] = useState("ALL");
  const [onlyAnnex2, setOnlyAnnex2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCatalogDrawer, setShowCatalogDrawer] = useState(false);

  // Catalog State
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("ALL");
  const [addingFromCatalogId, setAddingFromCatalogId] = useState<string | null>(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEntries = () => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.sigePlanEntries) {
          setEntries(data.sigePlanEntries);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEntries();
  }, [params.id]);

  // Katalog laden
  const loadCatalog = () => {
    fetch("/api/catalog/hazards")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCatalogItems(data);
      });
  };

  const handleOpenCatalog = () => {
    setShowCatalogDrawer(true);
    if (catalogItems.length === 0) {
      loadCatalog();
    }
  };

  const handleAddFromCatalog = async (item: CatalogItem) => {
    setAddingFromCatalogId(item.id);
    try {
      const res = await fetch(`/api/projects/${params.id}/sige-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: item.tradeCategory.includes("Tiefbau")
            ? "1. Baustelleneinrichtung & Erdarbeiten"
            : item.tradeCategory.includes("Rohbau")
            ? "2. Rohbauarbeiten"
            : item.tradeCategory.includes("Gerüst")
            ? "3. Fassade & Gerüstbau"
            : item.tradeCategory.includes("Dach")
            ? "4. Dachabdichtung"
            : "5. Ausbau & Haustechnik",
          trade: item.tradeCategory,
          activity: item.activity,
          hazards: item.hazard,
          isAnnex2SpecialHazard: item.isAnnex2,
          commonMeasures: item.protectiveMeasure,
          regulations: item.regulations,
          priority: item.isAnnex2 ? "HOCH" : "NORMAL",
        }),
      });

      if (res.ok) {
        loadEntries();
        setShowCatalogDrawer(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingFromCatalogId(null);
    }
  };

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
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        // Reset
        setFormActivity("");
        setFormHazards("");
        setFormMeasures("");
        setFormOverlap("");
        setFormRegulations("");
        loadEntries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Diesen Eintrag wirklich aus dem SiGe-Plan entfernen?")) return;
    try {
      const res = await fetch(`/api/projects/${params.id}/sige-plan?entryId=${entryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEntries(entries.filter((e) => e.id !== entryId));
      }
    } catch (err) {
      console.error(err);
    }
  };

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
      {/* Header */}
      <div
        className="no-print"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="title-xl">Sicherheits- &amp; Gesundheitsschutzplan (SiGe-Plan)</h2>
            <span className="badge badge-amber">RAB 31 Standard</span>
          </div>
          <p className="text-secondary" style={{ marginTop: "4px" }}>
            Gewerkeübergreifende Koordination der Arbeitsabläufe, Schutzmaßnahmen und besonderen Gefahren gem. BaustellV Anhang II.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={handleOpenCatalog}
            className="btn btn-secondary"
            title="Standard-Gefährdungen aus dem Katalog übernehmen"
          >
            <BookOpen size={16} />
            <span>Katalog-Bibliothek</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Position anlegen</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-outline"
            title="SiGe-Plan im Querformat drucken / als PDF speichern"
          >
            <Printer size={16} />
            <span>Drucken / PDF</span>
          </button>
        </div>
      </div>

      {/* Filterleiste */}
      <div
        className="card no-print"
        style={{ padding: "14px 18px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "260px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "34px" }}
              placeholder="Gefährdung, Gewerk oder Maßnahme durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: "240px" }}
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
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
            <input
              type="checkbox"
              style={{ width: "16px", height: "16px", accentColor: "var(--hazard-red)" }}
              checked={onlyAnnex2}
              onChange={(e) => setOnlyAnnex2(e.target.checked)}
            />
            <span style={{ color: onlyAnnex2 ? "var(--hazard-red)" : "var(--text-secondary)", fontWeight: 500 }}>
              Nur Anhang II (Besondere Gefahren)
            </span>
          </label>

          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {filteredEntries.length} von {entries.length} Positionen
          </div>
        </div>
      </div>

      {/* SiGe-Plan Tabelle gem. RAB 31 Schema */}
      <div className="table-scroll-hint no-print">
        ← Tabelle seitlich wischen / scrollen →
      </div>
      <div className="table-container print-landscape">
        <table className="data-table" id="sige-plan-table">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>Bauphase &amp; Tätigkeit</th>
              <th style={{ width: "12%" }}>Gewerk / Firma</th>
              <th style={{ width: "22%" }}>Gefährdungen &amp; Risiken</th>
              <th style={{ width: "14%" }}>Räumliche/zeitliche Überschneidung</th>
              <th style={{ width: "23%" }}>Gemeinsame Schutzmaßnahmen (Kollektivschutz)</th>
              <th style={{ width: "10%" }}>Regelwerke</th>
              <th className="no-print" style={{ width: "4%", textAlign: "center" }}>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  Keine SiGe-Plan-Positionen gefunden. Fügen Sie Positionen über die Bibliothek oder manuell hinzu.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.id}>
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
                    <div style={{ fontWeight: 600 }}>{entry.trade}</div>
                    {entry.responsibleCompany && (
                      <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {entry.responsibleCompany}
                      </div>
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
                    <div style={{ fontSize: "13px", color: entry.isAnnex2SpecialHazard ? "#fecaca" : "var(--text-primary)", lineHeight: "1.45" }}>
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
                  </td>

                  {/* Regelwerke */}
                  <td style={{ fontSize: "11.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {entry.regulations || "—"}
                  </td>

                  {/* Aktionen */}
                  <td className="no-print" style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: "4px 6px", color: "var(--hazard-red)" }}
                      title="Position löschen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Katalog-Drawer (Rechte Seitenleiste zur 1-Klick-Übernahme) */}
      {showCatalogDrawer && (
        <div className="modal-overlay" onClick={() => setShowCatalogDrawer(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: "800px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BookOpen size={22} color="var(--safety-amber)" />
                <div>
                  <h3 className="title-md">Standard-Gefährdungskatalog (RAB 31)</h3>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Wählen Sie Gefährdungen aus, um sie mit 1 Klick in den SiGe-Plan zu übernehmen.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCatalogDrawer(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            {/* Katalog-Suche */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Katalog nach Stichwort oder Gewerk durchsuchen..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
              />
            </div>

            {/* Katalog-Liste */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "550px", overflowY: "auto" }}>
              {catalogItems
                .filter(
                  (item) =>
                    !catalogSearch ||
                    item.activity.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    item.hazard.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    item.tradeCategory.toLowerCase().includes(catalogSearch.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "14px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "14px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span className="badge badge-blue">{item.tradeCategory}</span>
                        {item.isAnnex2 && (
                          <span className="badge badge-annex2">Anhang II</span>
                        )}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--text-primary)" }}>
                        {item.activity}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        <strong>Gefahr:</strong> {item.hazard}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                        <strong>Maßnahme:</strong> {item.protectiveMeasure}
                      </div>
                      {item.regulations && (
                        <div style={{ fontSize: "11px", color: "var(--safety-amber)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                          Norm: {item.regulations}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddFromCatalog(item)}
                      disabled={addingFromCatalogId === item.id}
                      className="btn btn-primary btn-sm"
                      style={{ flexShrink: 0 }}
                    >
                      <Plus size={14} />
                      <span>{addingFromCatalogId === item.id ? "Wird übernommen..." : "Übernehmen"}</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Manuelle Position anlegen Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="title-md">Neue SiGe-Plan Position erstellen</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualEntry}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Bauphase *</label>
                  <select
                    className="form-select"
                    value={formPhase}
                    onChange={(e) => setFormPhase(e.target.value)}
                  >
                    <option value="1. Baustelleneinrichtung & Tiefbau">1. Baustelleneinrichtung &amp; Tiefbau</option>
                    <option value="2. Rohbauarbeiten">2. Rohbauarbeiten</option>
                    <option value="3. Fassade & Gerüst">3. Fassade &amp; Gerüst</option>
                    <option value="4. Dachabdichtung">4. Dachabdichtung</option>
                    <option value="5. Ausbau & Haustechnik">5. Ausbau &amp; Haustechnik</option>
                    <option value="6. Außenanlagen & Rückbau">6. Außenanlagen &amp; Rückbau</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Gewerk / Tätigkeit *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formTrade}
                    onChange={(e) => setFormTrade(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Konkreter Arbeitsablauf / Tätigkeit *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Deckenrandsicherung im 3. Obergeschoss anbringen"
                  className="form-input"
                  value={formActivity}
                  onChange={(e) => setFormActivity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gefährdungen &amp; Risiken *</label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="Welche Gefahren treten auf? (z.B. Absturz > 2m, herabfallende Teile)"
                  value={formHazards}
                  onChange={(e) => setFormHazards(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: "10px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    style={{ width: "16px", height: "16px", accentColor: "var(--hazard-red)" }}
                    checked={formIsAnnex2}
                    onChange={(e) => setFormIsAnnex2(e.target.checked)}
                  />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--hazard-red)" }}>
                    Besondere Gefahr gem. Anhang II BaustellV (z.B. Absturz &gt; 7m, Verschüttung, Gefahrstoffe)
                  </span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Gemeinsame Schutzmaßnahmen (Kollektivschutz) *</label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="Vorgaben für alle Gewerke (z.B. Dreiteiliger Seitenschutz, Helmpflicht, Schutzgerüst)"
                  value={formMeasures}
                  onChange={(e) => setFormMeasures(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Räumliche/zeitliche Überschneidungen</label>
                  <input
                    type="text"
                    placeholder="z.B. Zeitgleicher Kranbetrieb über Arbeitsbereich"
                    className="form-input"
                    value={formOverlap}
                    onChange={(e) => setFormOverlap(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Regelwerke (ASR, DGUV, DIN)</label>
                  <input
                    type="text"
                    placeholder="z.B. ASR A2.1, DGUV V 38"
                    className="form-input font-mono"
                    value={formRegulations}
                    onChange={(e) => setFormRegulations(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Wird gespeichert..." : "Position hinzufügen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
