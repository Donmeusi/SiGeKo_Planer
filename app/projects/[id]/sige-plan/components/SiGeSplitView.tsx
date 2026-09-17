"use client";

import React, { useRef, useState } from "react";
import {
  GanttEntry,
  SiGeGanttView,
  getTradeColor,
} from "./SiGeGanttView";
import {
  AlertTriangle,
  Info,
  Edit2,
  Trash2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface SiGeSplitViewProps {
  entries: GanttEntry[];
  projectStart?: string | null;
  projectEnd?: string | null;
  timeScale: "days" | "weeks" | "months" | "years";
  zoomLevel: number;
  showTodayLine: boolean;
  showBarGuidelines: boolean;
  showMiniTimeline: boolean;
  jumpDate?: string;
  onUpdateDates: (entryId: string, startDate: string, endDate: string) => Promise<void>;
  onSelectEntry: (entry: GanttEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export function SiGeSplitView({
  entries,
  projectStart,
  projectEnd,
  timeScale,
  zoomLevel,
  showTodayLine,
  showBarGuidelines,
  showMiniTimeline,
  jumpDate,
  onUpdateDates,
  onSelectEntry,
  onDeleteEntry,
}: SiGeSplitViewProps) {
  const [splitWidth, setSplitWidth] = useState(380); // Width of left table pane
  const leftTableRef = useRef<HTMLDivElement>(null);
  const rightGanttRef = useRef<HTMLDivElement>(null);

  // Synchronized vertical scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (leftTableRef.current && e.currentTarget !== leftTableRef.current) {
      leftTableRef.current.scrollTop = scrollTop;
    }
    if (rightGanttRef.current && e.currentTarget !== rightGanttRef.current) {
      rightGanttRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "var(--bg-card)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
        height: "650px",
      }}
    >
      {/* Linke Seite: Synchronisierte Gewerke-Tabelle (Nr, Info, Gewerk) wie im Screenshot */}
      <div
        style={{
          width: `${splitWidth}px`,
          minWidth: "260px",
          maxWidth: "550px",
          display: "flex",
          flexDirection: "column",
          borderRight: "2px solid var(--border-strong)",
          backgroundColor: "var(--bg-surface)",
          flexShrink: 0,
        }}
      >
        {/* Platzhalter-Header für Mini-Zeitachse falls aktiv */}
        {showMiniTimeline && (
          <div
            style={{
              height: "28px",
              backgroundColor: "var(--bg-canvas)",
              borderBottom: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              paddingLeft: "12px",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-muted)",
            }}
          >
            Ablauf-Gliederung
          </div>
        )}

        {/* Tabellen-Header (Höhe exakt 68px passend zum 3-stufigen Gantt-Header) */}
        <div
          style={{
            height: "68px",
            borderBottom: "1px solid var(--border-strong)",
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            backgroundColor: "var(--bg-muted)",
            fontSize: "11.5px",
            fontWeight: 700,
            color: "var(--text-secondary)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <div style={{ width: "36px", textAlign: "center", flexShrink: 0 }}>Nr</div>
          <div style={{ width: "44px", textAlign: "center", flexShrink: 0 }}>Info</div>
          <div style={{ flex: 1, paddingLeft: "8px" }}>Gewerk / Tätigkeit</div>
          <div style={{ width: "50px", textAlign: "center", flexShrink: 0 }}>Aktion</div>
        </div>

        {/* Scrollbarer Tabellen-Body */}
        <div
          ref={leftTableRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div style={{ paddingTop: "8px", paddingBottom: "24px" }}>
            {entries.length === 0 ? (
              <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                Keine Positionen.
              </div>
            ) : (
              entries.map((entry, index) => {
                const isAnnex2 = entry.isAnnex2SpecialHazard;
                const tradeColor = getTradeColor(entry.trade, entry.color);

                return (
                  <div
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    style={{
                      height: "46px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      transition: "background-color 0.12s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {/* Nr */}
                    <div
                      style={{
                        width: "36px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Info / Warning Icon */}
                    <div
                      style={{
                        width: "44px",
                        display: "flex",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isAnnex2 ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "22px",
                            height: "22px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                            color: "var(--hazard-red)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                          }}
                          title="Anhang II: Besondere Gefahr!"
                        >
                          <AlertTriangle size={13} />
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "22px",
                            height: "22px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(2, 132, 199, 0.15)",
                            color: "var(--tech-blue)",
                            border: "1px solid rgba(2, 132, 199, 0.3)",
                          }}
                          title="Standard-Gefahr (RAB 31)"
                        >
                          <Info size={13} />
                        </span>
                      )}
                    </div>

                    {/* Gewerk & Tätigkeit */}
                    <div style={{ flex: 1, minWidth: 0, paddingLeft: "8px" }}>
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
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {entry.trade}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {entry.activity}
                      </div>
                    </div>

                    {/* Aktionen */}
                    <div
                      style={{
                        width: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        flexShrink: 0,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectEntry(entry)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "3px 4px", color: "var(--text-muted)" }}
                        title="Bearbeiten"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "3px 4px", color: "var(--hazard-red)" }}
                        title="Löschen"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Rechte Seite: Gantt Zeitstrahl synchronisiert */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <SiGeGanttView
          entries={entries}
          projectStart={projectStart}
          projectEnd={projectEnd}
          timeScale={timeScale}
          zoomLevel={zoomLevel}
          showTodayLine={showTodayLine}
          showBarGuidelines={showBarGuidelines}
          showMiniTimeline={showMiniTimeline}
          jumpDate={jumpDate}
          onUpdateDates={onUpdateDates}
          onSelectEntry={onSelectEntry}
          scrollContainerRef={rightGanttRef}
          onScroll={handleScroll}
          isSplitView={true}
        />
      </div>
    </div>
  );
}
