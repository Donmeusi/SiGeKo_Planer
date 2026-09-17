"use client";

import React, { useState, useEffect } from "react";
import { GanttEntry, getTradeColor } from "./SiGeGanttView";
import {
  X,
  Calendar,
  AlertTriangle,
  Shield,
  Save,
  Trash2,
  Palette,
} from "lucide-react";

interface SiGeEntryEditModalProps {
  entry: GanttEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<GanttEntry> & { entryId: string }) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
}

export function SiGeEntryEditModal({
  entry,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: SiGeEntryEditModalProps) {
  const [phase, setPhase] = useState("");
  const [trade, setTrade] = useState("");
  const [activity, setActivity] = useState("");
  const [hazards, setHazards] = useState("");
  const [isAnnex2, setIsAnnex2] = useState(false);
  const [overlap, setOverlap] = useState("");
  const [measures, setMeasures] = useState("");
  const [responsible, setResponsible] = useState("");
  const [regulations, setRegulations] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [color, setColor] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setPhase(entry.phase || "");
      setTrade(entry.trade || "");
      setActivity(entry.activity || "");
      setHazards(entry.hazards || "");
      setIsAnnex2(entry.isAnnex2SpecialHazard || false);
      setOverlap(entry.spatialTemporalOverlap || "");
      setMeasures(entry.commonMeasures || "");
      setResponsible(entry.responsibleCompany || "");
      setRegulations(entry.regulations || "");
      setStartDate(entry.startDate ? entry.startDate.split("T")[0] : "");
      setEndDate(entry.endDate ? entry.endDate.split("T")[0] : "");
      setColor(entry.color || getTradeColor(entry.trade, null));
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        entryId: entry.id,
        phase,
        trade,
        activity,
        hazards,
        isAnnex2SpecialHazard: isAnnex2,
        spatialTemporalOverlap: overlap || null,
        commonMeasures: measures,
        responsibleCompany: responsible || null,
        regulations: regulations || null,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        color: color || null,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const colorPresets = [
    { label: "Vorbereitung (Grün)", val: "#84cc16" },
    { label: "Einrichtung (Blau)", val: "#1d4ed8" },
    { label: "Erdarbeiten (Rot)", val: "#991b1b" },
    { label: "Rohbau (Orange)", val: "#ea580c" },
    { label: "Gerüst / Fassade (Cyan)", val: "#0284c7" },
    { label: "Dach (Teal)", val: "#0d9488" },
    { label: "Ausbau (Smaragd)", val: "#10b981" },
    { label: "Sicherheits-Amber", val: "#f59e0b" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Shield size={20} color="var(--safety-amber)" />
            <div>
              <h3 className="title-md">SiGe-Plan Position bearbeiten</h3>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Termine, Gewerke, Gefährdungen &amp; Schutzmaßnahmen anpassen
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Termine & Farbe im Ablaufplan */}
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-muted)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--safety-amber)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={14} />
              <span>Ablaufplan-Termine &amp; Balkenfarbe</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label className="form-label">Beginn (Datum)</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Ende (Datum)</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Farbpalette */}
            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Palette size={13} />
                <span>Balkenfarbe im Ablaufplan</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                {colorPresets.map((c) => (
                  <button
                    key={c.val}
                    type="button"
                    onClick={() => setColor(c.val)}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      backgroundColor: c.val,
                      border: color === c.val ? "2px solid #ffffff" : "1px solid rgba(0,0,0,0.3)",
                      boxShadow: color === c.val ? "0 0 6px rgba(255,255,255,0.8)" : "none",
                      cursor: "pointer",
                    }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gewerk & Tätigkeit */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="form-label">Gewerk / Kategorie</label>
              <input
                type="text"
                className="form-input"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Tätigkeit / Arbeitsgang</label>
              <input
                type="text"
                className="form-input"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phase & Firma */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="form-label">Bauphase</label>
              <input
                type="text"
                className="form-input"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Verantwortliche Firma</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. Schmidt Bau GmbH"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
              />
            </div>
          </div>

          {/* Gefährdungen & Anhang II */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label className="form-label" style={{ margin: 0 }}>Gefährdungen &amp; Risiken</label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11px" }}>
                <input
                  type="checkbox"
                  checked={isAnnex2}
                  onChange={(e) => setIsAnnex2(e.target.checked)}
                  style={{ accentColor: "var(--hazard-red)" }}
                />
                <span style={{ color: isAnnex2 ? "var(--hazard-red)" : "var(--text-muted)", fontWeight: isAnnex2 ? 700 : 400 }}>
                  ⚠️ Anhang II Besondere Gefahr
                </span>
              </label>
            </div>
            <textarea
              className="form-textarea"
              rows={2}
              value={hazards}
              onChange={(e) => setHazards(e.target.value)}
              required
            />
          </div>

          {/* Schutzmaßnahmen */}
          <div>
            <label className="form-label">Gemeinsame Schutzmaßnahmen (Kollektivschutz)</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={measures}
              onChange={(e) => setMeasures(e.target.value)}
              required
            />
          </div>

          {/* Überschneidungen & Regelwerke */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="form-label">Räumlich/zeitliche Überschneidung</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. Mit nachfolgendem Ausbau..."
                value={overlap}
                onChange={(e) => setOverlap(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Regelwerke / Vorschriften</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. DGUV V 38, ASR A2.1"
                value={regulations}
                onChange={(e) => setRegulations(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <button
              type="button"
              onClick={async () => {
                if (confirm("Position wirklich löschen?")) {
                  await onDelete(entry.id);
                  onClose();
                }
              }}
              className="btn btn-outline"
              style={{ color: "var(--hazard-red)" }}
            >
              <Trash2 size={14} />
              <span>Position löschen</span>
            </button>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={onClose} className="btn btn-outline">
                Abbrechen
              </button>
              <button type="submit" disabled={isSaving} className="btn btn-primary">
                <Save size={14} />
                <span>{isSaving ? "Speichert..." : "Änderungen speichern"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
