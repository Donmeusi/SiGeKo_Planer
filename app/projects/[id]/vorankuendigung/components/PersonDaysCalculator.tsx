"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  Calendar,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface TradeWorkloadRow {
  id: string;
  name: string;
  days: number;
  workers: number;
}

interface PersonDaysCalculatorProps {
  initialTotalDays: number;
  initialMaxWorkers?: number;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  contractors?: Array<{ companyName: string; trade: string; workerCount?: number }>;
  onApplyResults: (calculatedDays: number, calculatedMaxWorkers?: number, detailsJson?: string) => void;
}

export function PersonDaysCalculator({
  initialTotalDays,
  initialMaxWorkers = 1,
  plannedStart,
  plannedEnd,
  contractors = [],
  onApplyResults,
}: PersonDaysCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [calcMode, setCalcMode] = useState<"quick" | "trades">("quick");

  // Schnellrechner State
  const [startDate, setStartDate] = useState(plannedStart || "");
  const [endDate, setEndDate] = useState(plannedEnd || "");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<5 | 6>(5);
  const [manualNetWorkDays, setManualNetWorkDays] = useState<number>(0);
  const [useAutoDays, setUseAutoDays] = useState(true);
  const [avgDailyWorkers, setAvgDailyWorkers] = useState<number>(initialMaxWorkers || 4);

  // Gewerke-Tabelle State
  const [tradeRows, setTradeRows] = useState<TradeWorkloadRow[]>([
    { id: "row-1", name: "Erd- & Verbauarbeiten", days: 15, workers: 3 },
    { id: "row-2", name: "Rohbau & Stahlbeton", days: 45, workers: 8 },
    { id: "row-3", name: "Dach & Fassade", days: 25, workers: 4 },
    { id: "row-4", name: "TGA & Ausbau", days: 30, workers: 5 },
  ]);

  // Automatische Netto-Arbeitstageberechnung anhand von Start- und Enddatum
  const calculatedCalendarWorkDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) return 0;

      let count = 0;
      const cur = new Date(start);
      while (cur <= end) {
        const dayOfWeek = cur.getDay(); // 0 = So, 6 = Sa
        if (workDaysPerWeek === 5) {
          if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        } else {
          if (dayOfWeek !== 0) count++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      return count;
    } catch {
      return 0;
    }
  }, [startDate, endDate, workDaysPerWeek]);

  // Synchronisiere initial Start/Ende falls vorhanden
  useEffect(() => {
    if (plannedStart && !startDate) setStartDate(plannedStart);
    if (plannedEnd && !endDate) setEndDate(plannedEnd);
  }, [plannedStart, plannedEnd]);

  // Effektive Netto-Arbeitstage
  const effectiveWorkDays = useAutoDays ? calculatedCalendarWorkDays : manualNetWorkDays;

  // Gesamtergebnis im Schnellrechner
  const quickPersonDays = Math.max(0, effectiveWorkDays * avgDailyWorkers);

  // Gesamtergebnis in der Gewerke-Tabelle
  const tradePersonDays = useMemo(() => {
    return tradeRows.reduce((sum, r) => sum + (Number(r.days) || 0) * (Number(r.workers) || 0), 0);
  }, [tradeRows]);

  const maxWorkersInTrades = useMemo(() => {
    return tradeRows.reduce((max, r) => Math.max(max, Number(r.workers) || 0), 1);
  }, [tradeRows]);

  // Aktives Gesamtergebnis
  const currentTotalPersonDays = calcMode === "quick" ? quickPersonDays : tradePersonDays;
  const isThresholdExceeded = currentTotalPersonDays > 500;

  // Gewerke aus Projekt importieren
  const handleImportContractors = () => {
    if (!contractors || contractors.length === 0) return;
    const imported: TradeWorkloadRow[] = contractors.map((c, idx) => ({
      id: `imported-${idx}-${Date.now()}`,
      name: `${c.trade || "Gewerk"} (${c.companyName || "Firma"})`,
      days: 20,
      workers: c.workerCount || 3,
    }));
    setTradeRows(imported);
    setCalcMode("trades");
  };

  const handleAddTradeRow = () => {
    setTradeRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        name: "Neues Gewerk / Phase",
        days: 10,
        workers: 2,
      },
    ]);
  };

  const handleRemoveTradeRow = (id: string) => {
    setTradeRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateTradeRow = (id: string, field: keyof TradeWorkloadRow, value: any) => {
    setTradeRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleApply = () => {
    const details =
      calcMode === "quick"
        ? JSON.stringify({
            mode: "quick",
            startDate,
            endDate,
            effectiveWorkDays,
            avgDailyWorkers,
            totalPersonDays: quickPersonDays,
          })
        : JSON.stringify({
            mode: "trades",
            rows: tradeRows,
            totalPersonDays: tradePersonDays,
            maxWorkers: maxWorkersInTrades,
          });

    const maxWorkersToApply = calcMode === "trades" ? maxWorkersInTrades : undefined;
    onApplyResults(currentTotalPersonDays, maxWorkersToApply, details);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      {/* Header / Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          background: isOpen ? "var(--bg-secondary)" : "transparent",
          transition: "background 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(245, 158, 11, 0.15)",
              color: "var(--safety-amber)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calculator size={17} />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              Personentage-Berechnungsmodul (Kriterium 2)
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Rechner nach § 2 Abs. 1 BaustellV &amp; RAB 10 (Schwellenwert: 500 PT)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              background: isThresholdExceeded ? "rgba(245, 158, 11, 0.15)" : "rgba(34, 197, 94, 0.15)",
              color: isThresholdExceeded ? "var(--safety-amber)" : "var(--success-emerald)",
            }}
          >
            {currentTotalPersonDays.toLocaleString("de-DE")} PT
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Ausklappbarer Rechner */}
      {isOpen && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          {/* Modus-Umschalter */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => setCalcMode("quick")}
              className={`btn btn-sm ${calcMode === "quick" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "11.5px", padding: "5px 12px" }}
            >
              Schnellberechnung (Bauzeit &times; &Oslash; Arbeiter)
            </button>
            <button
              type="button"
              onClick={() => setCalcMode("trades")}
              className={`btn btn-sm ${calcMode === "trades" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "11.5px", padding: "5px 12px" }}
            >
              Gewerke- &amp; Phasenaufstellung (Detailliert)
            </button>
          </div>

          {/* MODUS 1: Schnellberechnung */}
          {calcMode === "quick" && (
            <div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "11px" }}>
                    Geplanter Baubeginn
                  </label>
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "11px" }}>
                    Voraussichtliches Bauende
                  </label>
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: "10px" }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "11px" }}>
                    Arbeitswoche &amp; Netto-Tage
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <select
                      className="form-select"
                      style={{ flex: 1 }}
                      value={workDaysPerWeek}
                      onChange={(e) => setWorkDaysPerWeek(Number(e.target.value) as 5 | 6)}
                    >
                      <option value={5}>5-Tage-Woche (Mo-Fr)</option>
                      <option value={6}>6-Tage-Woche (Mo-Sa)</option>
                    </select>
                    <input
                      type="number"
                      title="Netto-Arbeitstage"
                      className="form-input font-mono"
                      style={{ width: "90px" }}
                      value={effectiveWorkDays}
                      onChange={(e) => {
                        setUseAutoDays(false);
                        setManualNetWorkDays(parseInt(e.target.value) || 0);
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                    {useAutoDays ? `${calculatedCalendarWorkDays} Netto-Arbeitstage berechnet` : "Manuell überschrieben"}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "11px" }}>
                    &Oslash; Beschäftigte pro Arbeitstag
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-input font-mono"
                    value={avgDailyWorkers}
                    onChange={(e) => setAvgDailyWorkers(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Durchschnittliche gleichzeitige Personen auf der Baustelle
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODUS 2: Gewerke- & Phasenaufstellung */}
          {calcMode === "trades" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Gewerke, Bauabschnitte oder Subunternehmen erfassen:
                </div>
                {contractors && contractors.length > 0 && (
                  <button
                    type="button"
                    onClick={handleImportContractors}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "11px", gap: "4px" }}
                  >
                    <Download size={13} />
                    <span>{contractors.length} Firmen aus Projekt importieren</span>
                  </button>
                )}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                      <th style={{ padding: "6px 8px", color: "var(--text-muted)" }}>Gewerk / Bauabschnitt</th>
                      <th style={{ padding: "6px 8px", width: "100px", color: "var(--text-muted)" }}>Dauer (Tage)</th>
                      <th style={{ padding: "6px 8px", width: "100px", color: "var(--text-muted)" }}>&Oslash; Arbeiter</th>
                      <th style={{ padding: "6px 8px", width: "110px", color: "var(--text-muted)" }}>Personentage</th>
                      <th style={{ width: "40px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeRows.map((row) => {
                      const rowPT = (Number(row.days) || 0) * (Number(row.workers) || 0);
                      return (
                        <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "6px 8px" }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: "4px 8px", fontSize: "12px" }}
                              value={row.name}
                              onChange={(e) => handleUpdateTradeRow(row.id, "name", e.target.value)}
                            />
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            <input
                              type="number"
                              min="0"
                              className="form-input font-mono"
                              style={{ padding: "4px 8px", fontSize: "12px" }}
                              value={row.days}
                              onChange={(e) => handleUpdateTradeRow(row.id, "days", parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            <input
                              type="number"
                              min="1"
                              className="form-input font-mono"
                              style={{ padding: "4px 8px", fontSize: "12px" }}
                              value={row.workers}
                              onChange={(e) => handleUpdateTradeRow(row.id, "workers", parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td style={{ padding: "6px 8px", fontWeight: 600, color: "var(--text-primary)" }}>
                            {rowPT.toLocaleString("de-DE")} PT
                          </td>
                          <td style={{ padding: "6px 8px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveTradeRow(row.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--hazard-red)",
                                cursor: "pointer",
                                opacity: 0.7,
                              }}
                              title="Zeile entfernen"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={handleAddTradeRow}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "11px", gap: "4px" }}
                >
                  <Plus size={13} />
                  <span>Gewerk hinzufügen</span>
                </button>
              </div>
            </div>
          )}

          {/* Zusammenfassung & Schwellenwert-Auswertung (§ 2 BaustellV) */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: isThresholdExceeded ? "rgba(245, 158, 11, 0.08)" : "rgba(34, 197, 94, 0.08)",
              border: `1px solid ${isThresholdExceeded ? "rgba(245, 158, 11, 0.3)" : "rgba(34, 197, 94, 0.3)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isThresholdExceeded ? (
                <AlertTriangle size={22} color="var(--safety-amber)" style={{ flexShrink: 0 }} />
              ) : (
                <CheckCircle2 size={22} color="var(--success-emerald)" style={{ flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Berechneter Gesamtumfang:{" "}
                  <span style={{ color: isThresholdExceeded ? "var(--safety-amber)" : "var(--success-emerald)" }}>
                    {currentTotalPersonDays.toLocaleString("de-DE")} Personentage
                  </span>
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                  {isThresholdExceeded
                    ? "🚨 Schwellenwert überschritten (> 500 PT) → Kriterium 2 ERFÜLLT (Vorankündigungspflicht gem. § 2 Abs. 1 BaustellV)"
                    : "✓ Unter Schwellenwert (≤ 500 PT) → Kriterium 2 nicht erfüllt (allein dadurch keine Pflicht)"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="btn btn-primary btn-sm"
              style={{ gap: "6px", fontSize: "12px", fontWeight: 700 }}
            >
              <Sparkles size={14} />
              <span>In Vorankündigung übernehmen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
