"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  Plus,
  Printer,
  Trash2,
  ShieldCheck,
  FileCheck,
  FolderOpen,
  Info,
} from "lucide-react";

interface SubsequentWorkItem {
  id: string;
  projectId: string;
  component: string;
  workType: string;
  hazards: string;
  safetyMeasures: string;
  documentationLocation: string | null;
  notes: string | null;
}

export default function SubsequentWorkPage() {
  const params = useParams<{ id: string }>();
  const [items, setItems] = useState<SubsequentWorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [component, setComponent] = useState("");
  const [workType, setWorkType] = useState("");
  const [hazards, setHazards] = useState("");
  const [safetyMeasures, setSafetyMeasures] = useState("");
  const [docLocation, setDocLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setItems(data.subsequentWorks || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!component || !workType || !safetyMeasures) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${params.id}/subsequent-work`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component,
          workType,
          hazards,
          safetyMeasures,
          documentationLocation: docLocation || null,
          notes: notes || null,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setComponent("");
        setWorkType("");
        setHazards("");
        setSafetyMeasures("");
        setDocLocation("");
        setNotes("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Eintrag wirklich entfernen?")) return;
    try {
      const res = await fetch(`/api/projects/${params.id}/subsequent-work?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        className="no-print"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="title-xl">Unterlage für spätere Arbeiten</h2>
            <span className="badge badge-amber">RAB 32 Standard</span>
          </div>
          <p className="text-secondary" style={{ marginTop: "4px" }}>
            Dokumentation sicherheitsrelevanter Einrichtungen für künftige Wartungs-, Inspektions- und Instandsetzungsarbeiten am Bauwerk gem. § 3 Abs. 2 Nr. 3 BaustellV.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Bauteil erfassen</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-outline"
            title="Dossier für die Übergabe an den Bauherrn drucken / als PDF speichern"
          >
            <Printer size={16} />
            <span>Unterlage drucken / PDF</span>
          </button>
        </div>
      </div>

      {/* Info-Box RAB 32 */}
      <div
        className="card no-print"
        style={{
          background: "rgba(2, 132, 199, 0.05)",
          borderColor: "rgba(2, 132, 199, 0.3)",
          marginBottom: "20px",
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        <Info size={22} color="var(--tech-blue)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
          <strong>Zweck nach RAB 32:</strong> Die Unterlage stellt sicher, dass bei späteren Arbeiten (Dachwartung, Fensterreinigung, PV-Wartung, Schornsteinfeger) die erforderlichen Sicherheitsvorkehrungen (z. B. Anschlagpunkte, Steigleitern) von Beginn an baulich berücksichtigt und nach Fertigstellung an den Bauherrn übergeben werden.
        </div>
      </div>

      {/* Tabelle / Karten der Bauteile */}
      <div className="table-scroll-hint no-print">
        ← Tabelle seitlich wischen / scrollen →
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Bauteil / Anlage</th>
              <th style={{ width: "20%" }}>Art der späteren Arbeit</th>
              <th style={{ width: "20%" }}>Gefährdungen</th>
              <th style={{ width: "25%" }}>Vorgesehene Sicherheitseinrichtungen</th>
              <th style={{ width: "15%" }}>Nachweise / Prüfbuch</th>
              <th className="no-print" style={{ width: "4%", textAlign: "center" }}>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  Keine Bauteile erfasst. Erfassen Sie sicherheitsrelevante Anlagen nach RAB 32.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{item.component}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item.workType}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", color: "var(--hazard-red)" }}>{item.hazards}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: "1.45" }}>
                      {item.safetyMeasures}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      {item.documentationLocation || "—"}
                    </div>
                    {item.notes && (
                      <div style={{ fontSize: "11px", color: "var(--safety-amber)", marginTop: "3px" }}>
                        {item.notes}
                      </div>
                    )}
                  </td>
                  <td className="no-print" style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: "var(--hazard-red)", padding: "4px 6px" }}
                      title="Eintrag löschen"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Neues Bauteil */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="title-md">Sicherheitsrelevantes Bauteil erfassen (RAB 32)</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <form onSubmit={handleAddItem}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Bauteil / Bereich *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Flachdach, Glasfassade, Lichtschacht"
                    className="form-input"
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Art der späteren Arbeit *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Wartung Photovoltaik, Dachinspektion"
                    className="form-input"
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mögliche Gefährdungen *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Absturz über Dachkante (Höhe 14m), Durchsturz"
                  className="form-input"
                  value={hazards}
                  onChange={(e) => setHazards(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vorgesehene Sicherheitseinrichtungen &amp; Maßnahmen *</label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="z.B. Permanentes Seilsicherungssystem (Sekuranten EN 795 Typ C), Anschlagösen, ortsfeste Steigleiter mit Rückenschutz"
                  value={safetyMeasures}
                  onChange={(e) => setSafetyMeasures(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Aufbewahrungsort der Unterlagen</label>
                  <input
                    type="text"
                    placeholder="z.B. Revisionsordner Haustechnik / Hausverwaltung"
                    className="form-input"
                    value={docLocation}
                    onChange={(e) => setDocLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prüffristen / Besondere Hinweise</label>
                  <input
                    type="text"
                    placeholder="z.B. Jährliche Prüfung durch Sachkundigen nach DGUV 312-906"
                    className="form-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Abbrechen
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? "Wird gespeichert..." : "Bauteil hinzufügen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
