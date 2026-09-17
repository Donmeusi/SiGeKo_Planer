"use client";

import React from "react";
import {
  Table2,
  CalendarRange,
  Columns2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  BookOpen,
  Plus,
  Printer,
  Calendar,
  Layers,
  Clock,
  Compass,
} from "lucide-react";

export type SiGeViewMode = "table" | "gantt" | "split";
export type SiGeTimeScale = "days" | "weeks" | "months" | "years";

interface SiGePlanToolbarProps {
  viewMode: SiGeViewMode;
  onViewModeChange: (mode: SiGeViewMode) => void;
  timeScale: SiGeTimeScale;
  onTimeScaleChange: (scale: SiGeTimeScale) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  showTodayLine: boolean;
  onToggleTodayLine: () => void;
  showBarGuidelines: boolean;
  onToggleBarGuidelines: () => void;
  showMiniTimeline: boolean;
  onToggleMiniTimeline: () => void;
  jumpDate: string;
  onJumpDateChange: (date: string) => void;
  showCatalog: boolean;
  onToggleCatalog: () => void;
  onAddNewEntry: () => void;
  totalEntriesCount: number;
}

export function SiGePlanToolbar({
  viewMode,
  onViewModeChange,
  timeScale,
  onTimeScaleChange,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  showTodayLine,
  onToggleTodayLine,
  showBarGuidelines,
  onToggleBarGuidelines,
  showMiniTimeline,
  onToggleMiniTimeline,
  jumpDate,
  onJumpDateChange,
  showCatalog,
  onToggleCatalog,
  onAddNewEntry,
  totalEntriesCount,
}: SiGePlanToolbarProps) {
  return (
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
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-strong)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      {/* Linke Seite: Ansichten & Zeitskala */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
        {/* Ansichts-Modus (Tabelle / Ablaufplan / Split) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            SiGe-Plan Ansicht
          </span>
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--bg-surface)",
              padding: "2px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              title="Tabelle: Standard RAB 31 Schutzmaßnahmen-Matrix"
            >
              <Table2 size={15} />
              <span>Tabelle</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("gantt")}
              className={`btn btn-sm ${viewMode === "gantt" ? "btn-primary" : "btn-ghost"}`}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              title="Ablaufplan: Vollbild Gantt-Zeitstrahl"
            >
              <CalendarRange size={15} />
              <span>Ablaufplan</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("split")}
              className={`btn btn-sm ${viewMode === "split" ? "btn-primary" : "btn-ghost"}`}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              title="Tabelle / Ablaufplan: Synchronisierte Split-Ansicht (wie SiGe-Manager)"
            >
              <Columns2 size={15} />
              <span>Tabelle / Ablaufplan</span>
            </button>
          </div>
        </div>

        {/* Trenner */}
        {(viewMode === "gantt" || viewMode === "split") && (
          <div style={{ width: "1px", height: "36px", backgroundColor: "var(--border)" }} />
        )}

        {/* Zeitskala (Tage, Wochen, Monate, Jahre) */}
        {(viewMode === "gantt" || viewMode === "split") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Zeitskala
            </span>
            <div
              style={{
                display: "flex",
                backgroundColor: "var(--bg-surface)",
                padding: "2px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              {(["days", "weeks", "months", "years"] as SiGeTimeScale[]).map((scale) => {
                const labels: Record<SiGeTimeScale, string> = {
                  days: "Tage",
                  weeks: "Wochen (KW)",
                  months: "Monate",
                  years: "Jahre",
                };
                return (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => onTimeScaleChange(scale)}
                    className={`btn btn-sm ${timeScale === scale ? "btn-secondary" : "btn-ghost"}`}
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: timeScale === scale ? 600 : 400,
                    }}
                  >
                    {labels[scale]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Trenner */}
        {(viewMode === "gantt" || viewMode === "split") && (
          <div style={{ width: "1px", height: "36px", backgroundColor: "var(--border)" }} />
        )}

        {/* Zoom Controls */}
        {(viewMode === "gantt" || viewMode === "split") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Zoom ({Math.round(zoomLevel * 100)}%)
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                type="button"
                onClick={onZoomIn}
                className="btn btn-outline btn-sm"
                style={{ padding: "4px 8px" }}
                title="Hereinzoomen"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                onClick={onZoomOut}
                className="btn btn-outline btn-sm"
                style={{ padding: "4px 8px" }}
                title="Herauszoomen"
              >
                <ZoomOut size={14} />
              </button>
              <button
                type="button"
                onClick={onZoomFit}
                className="btn btn-outline btn-sm"
                style={{ padding: "4px 8px", fontSize: "11px" }}
                title="Automatisch anpassen (100%)"
              >
                <Maximize2 size={13} />
                <span>Fit</span>
              </button>
            </div>
          </div>
        )}

        {/* Hilfslinien Toggles */}
        {(viewMode === "gantt" || viewMode === "split") && (
          <>
            <div style={{ width: "1px", height: "36px", backgroundColor: "var(--border)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Hilfslinien
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={onToggleTodayLine}
                  className={`btn btn-sm ${showTodayLine ? "btn-secondary" : "btn-ghost"}`}
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    color: showTodayLine ? "var(--hazard-red)" : "var(--text-secondary)",
                    borderColor: showTodayLine ? "var(--hazard-red)" : undefined,
                  }}
                  title="Hilfslinie Heute ein-/ausblenden"
                >
                  <Clock size={13} />
                  <span>"Heute"</span>
                </button>
                <button
                  type="button"
                  onClick={onToggleBarGuidelines}
                  className={`btn btn-sm ${showBarGuidelines ? "btn-secondary" : "btn-ghost"}`}
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                  title="Führungslinien für Balken ein-/ausblenden"
                >
                  <Layers size={13} />
                  <span>Balken</span>
                </button>
                <button
                  type="button"
                  onClick={onToggleMiniTimeline}
                  className={`btn btn-sm ${showMiniTimeline ? "btn-secondary" : "btn-ghost"}`}
                  style={{ padding: "4px 8px", fontSize: "11px" }}
                  title="Mini-Gesamtzeitachse oben ein-/ausblenden"
                >
                  <Compass size={13} />
                  <span>Zeitachse</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rechte Seite: Schnellsprung, Katalog-Drawer, Neuer Eintrag, Drucken */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {(viewMode === "gantt" || viewMode === "split") && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={14} color="var(--text-muted)" />
            <input
              type="date"
              className="form-input"
              style={{ padding: "3px 8px", fontSize: "12px", width: "135px" }}
              value={jumpDate}
              onChange={(e) => onJumpDateChange(e.target.value)}
              title="Gehe zu Datum"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCatalog}
          className={`btn btn-sm ${showCatalog ? "btn-secondary" : "btn-outline"}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderColor: showCatalog ? "var(--safety-amber)" : undefined,
            color: showCatalog ? "var(--safety-amber)" : undefined,
          }}
          title="Gefährdungskatalog-Seitenleiste ein-/ausblenden"
        >
          <BookOpen size={14} />
          <span>Katalog</span>
        </button>

        <button
          type="button"
          onClick={onAddNewEntry}
          className="btn btn-primary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={14} />
          <span>Position</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="btn btn-outline btn-sm"
          title="SiGe-Plan drucken / als PDF speichern"
        >
          <Printer size={14} />
        </button>
      </div>
    </div>
  );
}
