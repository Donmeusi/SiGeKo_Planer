"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Edit2,
  ChevronRight,
  Info,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export interface GanttEntry {
  id: string;
  phase: string;
  trade: string;
  activity: string;
  hazards: string;
  isAnnex2SpecialHazard: boolean;
  spatialTemporalOverlap?: string | null;
  commonMeasures: string;
  responsibleCompany: string | null;
  regulations: string | null;
  priority: string;
  orderIndex: number;
  startDate?: string | null;
  endDate?: string | null;
  color?: string | null;
  progress?: number | null;
}

interface SiGeGanttViewProps {
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
  onSelectEntry?: (entry: GanttEntry) => void;
  // Optional sync scrolling
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  isSplitView?: boolean;
}

// Color palette mapping by trade / category
export function getTradeColor(trade: string, customColor?: string | null): string {
  if (customColor) return customColor;
  const t = (trade || "").toLowerCase();
  if (t.includes("vorbereitung")) return "#84cc16"; // Lime Green (Screenshot)
  if (t.includes("einrichtung")) return "#1d4ed8"; // Navy Blue (Screenshot)
  if (t.includes("erdarbeit") || t.includes("tiefbau")) return "#991b1b"; // Dark Red (Screenshot)
  if (t.includes("rohbau") || t.includes("massiv") || t.includes("beton")) return "#ea580c"; // Safety Orange
  if (t.includes("gerüst") || t.includes("fassade")) return "#0284c7"; // Tech Blue
  if (t.includes("dach")) return "#0d9488"; // Teal
  if (t.includes("ausbau") || t.includes("tga") || t.includes("elektro")) return "#10b981"; // Emerald
  return "#eab308"; // Amber
}

export function SiGeGanttView({
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
  scrollContainerRef,
  onScroll,
  isSplitView = false,
}: SiGeGanttViewProps) {
  const localScrollRef = useRef<HTMLDivElement>(null);
  const activeScrollRef = scrollContainerRef || localScrollRef;

  // Dragging state for resize or move
  const [dragging, setDragging] = useState<{
    entryId: string;
    type: "move" | "resize-left" | "resize-right";
    startX: number;
    initialStart: number;
    initialEnd: number;
  } | null>(null);

  const [dragPreviewDates, setDragPreviewDates] = useState<{
    entryId: string;
    start: Date;
    end: Date;
  } | null>(null);

  // 1. Calculate overall timeline boundaries
  const { timelineStart, timelineEnd, totalDays } = useMemo(() => {
    let minT = projectStart ? new Date(projectStart).getTime() : Date.now() - 30 * 86400000;
    let maxT = projectEnd ? new Date(projectEnd).getTime() : Date.now() + 270 * 86400000;

    entries.forEach((e) => {
      if (e.startDate) {
        const s = new Date(e.startDate).getTime();
        if (s < minT) minT = s;
      }
      if (e.endDate) {
        const en = new Date(e.endDate).getTime();
        if (en > maxT) maxT = en;
      }
    });

    // Pad to start of month and end of quarter/year for clean aesthetic
    const start = new Date(minT);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(maxT);
    end.setMonth(end.getMonth() + 2);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    const diffDays = Math.max(60, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      timelineStart: start,
      timelineEnd: end,
      totalDays: diffDays,
    };
  }, [entries, projectStart, projectEnd]);

  // Base day width based on scale and zoom
  const dayWidth = useMemo(() => {
    let base = 6;
    if (timeScale === "days") base = 32;
    if (timeScale === "weeks") base = 6.5;
    if (timeScale === "months") base = 2.2;
    if (timeScale === "years") base = 0.8;
    return base * zoomLevel;
  }, [timeScale, zoomLevel]);

  const totalWidth = totalDays * dayWidth;

  // Generate calendar columns & headers
  const { quarters, months, weeks, days } = useMemo(() => {
    const qList: { label: string; left: number; width: number }[] = [];
    const mList: { label: string; left: number; width: number }[] = [];
    const wList: { label: string; left: number; width: number; kw: number }[] = [];
    const dList: { label: string; left: number; width: number; isWeekend: boolean }[] = [];

    const curr = new Date(timelineStart);
    let dayIndex = 0;

    let currentMonth = -1;
    let monthStartDay = 0;
    let monthLabel = "";

    let currentQuarter = -1;
    let quarterStartDay = 0;
    let quarterLabel = "";

    // Week tracking
    let weekStartDay = 0;

    while (curr <= timelineEnd) {
      const d = curr.getDate();
      const m = curr.getMonth();
      const y = curr.getFullYear();
      const dayOfWeek = curr.getDay(); // 0 is Sun

      // Day
      if (timeScale === "days") {
        dList.push({
          label: `${d}`,
          left: dayIndex * dayWidth,
          width: dayWidth,
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        });
      }

      // Week check (Monday = 1)
      if (dayOfWeek === 1 || dayIndex === 0) {
        if (dayIndex > 0) {
          const wWidth = (dayIndex - weekStartDay) * dayWidth;
          const kwNum = Math.ceil((((curr.getTime() - new Date(y, 0, 1).getTime()) / 86400000) + 1) / 7);
          wList.push({
            label: `${kwNum}. KW`,
            left: weekStartDay * dayWidth,
            width: wWidth,
            kw: kwNum,
          });
        }
        weekStartDay = dayIndex;
      }

      // Month check
      if (m !== currentMonth) {
        if (currentMonth !== -1) {
          mList.push({
            label: monthLabel,
            left: monthStartDay * dayWidth,
            width: (dayIndex - monthStartDay) * dayWidth,
          });
        }
        currentMonth = m;
        monthStartDay = dayIndex;
        const monthNames = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        monthLabel = `${monthNames[m]} ${y}`;
      }

      // Quarter check
      const q = Math.floor(m / 3);
      if (q !== currentQuarter) {
        if (currentQuarter !== -1) {
          qList.push({
            label: quarterLabel,
            left: quarterStartDay * dayWidth,
            width: (dayIndex - quarterStartDay) * dayWidth,
          });
        }
        currentQuarter = q;
        quarterStartDay = dayIndex;
        quarterLabel = `${q + 1}. Q ${y}`;
      }

      curr.setDate(curr.getDate() + 1);
      dayIndex++;
    }

    // Flush remaining
    if (dayIndex > monthStartDay) {
      mList.push({
        label: monthLabel,
        left: monthStartDay * dayWidth,
        width: (dayIndex - monthStartDay) * dayWidth,
      });
    }
    if (dayIndex > quarterStartDay) {
      qList.push({
        label: quarterLabel,
        left: quarterStartDay * dayWidth,
        width: (dayIndex - quarterStartDay) * dayWidth,
      });
    }
    if (dayIndex > weekStartDay) {
      const kwNum = 52;
      wList.push({
        label: `${kwNum}. KW`,
        left: weekStartDay * dayWidth,
        width: (dayIndex - weekStartDay) * dayWidth,
        kw: kwNum,
      });
    }

    return { quarters: qList, months: mList, weeks: wList, days: dList };
  }, [timelineStart, timelineEnd, dayWidth, timeScale]);

  // Today marker offset
  const todayOffset = useMemo(() => {
    const today = new Date();
    const diff = Math.round((today.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    return diff * dayWidth;
  }, [timelineStart, dayWidth]);

  // Holiday / Sperrzeiten zones (as seen in screenshot: "Winterferien", "Sommerferien")
  const specialZones = useMemo(() => {
    const zones = [
      { name: "Winterferien / Schlechtwetter", startMonth: 1, startDay: 1, endMonth: 1, endDay: 18 },
      { name: "Osterpause", startMonth: 3, startDay: 28, endMonth: 4, endDay: 6 },
      { name: "Sommerferien", startMonth: 6, startDay: 15, endMonth: 7, endDay: 25 },
    ];

    const y = timelineStart.getFullYear();
    return zones.map((z) => {
      const zStart = new Date(y, z.startMonth, z.startDay);
      const zEnd = new Date(y, z.endMonth, z.endDay);
      const startDiff = Math.max(0, Math.round((zStart.getTime() - timelineStart.getTime()) / 86400000));
      const endDiff = Math.round((zEnd.getTime() - timelineStart.getTime()) / 86400000);
      const left = startDiff * dayWidth;
      const width = Math.max(20, (endDiff - startDiff) * dayWidth);
      return {
        name: z.name,
        left,
        width,
      };
    }).filter((z) => z.left >= 0 && z.left <= totalWidth);
  }, [timelineStart, dayWidth, totalWidth]);

  // Jump to date effect
  useEffect(() => {
    if (jumpDate && activeScrollRef.current) {
      const targetTime = new Date(jumpDate).getTime();
      const diff = Math.round((targetTime - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
      const targetX = diff * dayWidth - 150;
      activeScrollRef.current.scrollTo({ left: Math.max(0, targetX), behavior: "smooth" });
    }
  }, [jumpDate, timelineStart, dayWidth, activeScrollRef]);

  // Calculate position for an entry
  const getEntryBarCoords = (entry: GanttEntry, index: number) => {
    // If entry has explicit dates
    let sTime: number;
    let eTime: number;

    if (entry.startDate && entry.endDate) {
      sTime = new Date(entry.startDate).getTime();
      eTime = new Date(entry.endDate).getTime();
    } else {
      // Sensible sequential fallback based on orderIndex and phase
      const offsetDays = index * 12 + 7;
      const durationDays = 21 + (index % 3) * 7;
      sTime = timelineStart.getTime() + offsetDays * 86400000;
      eTime = sTime + durationDays * 86400000;
    }

    // Check if being dragged
    if (dragPreviewDates && dragPreviewDates.entryId === entry.id) {
      sTime = dragPreviewDates.start.getTime();
      eTime = dragPreviewDates.end.getTime();
    }

    const startDiffDays = Math.max(0, (sTime - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const durationDays = Math.max(2, (eTime - sTime) / (1000 * 60 * 60 * 24));

    const left = startDiffDays * dayWidth;
    const width = Math.max(24, durationDays * dayWidth);

    return { left, width, sDate: new Date(sTime), eDate: new Date(eTime) };
  };

  // Drag and drop handler
  const handleMouseDown = (
    e: React.MouseEvent,
    entryId: string,
    type: "move" | "resize-left" | "resize-right",
    initialStart: number,
    initialEnd: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setDragging({
      entryId,
      type,
      startX: e.clientX,
      initialStart,
      initialEnd,
    });
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragging.startX;
      const deltaDays = Math.round(deltaX / dayWidth);

      let newStart = dragging.initialStart;
      let newEnd = dragging.initialEnd;

      if (dragging.type === "move") {
        newStart += deltaDays * 86400000;
        newEnd += deltaDays * 86400000;
      } else if (dragging.type === "resize-left") {
        newStart += deltaDays * 86400000;
        if (newStart >= newEnd - 86400000) newStart = newEnd - 86400000;
      } else if (dragging.type === "resize-right") {
        newEnd += deltaDays * 86400000;
        if (newEnd <= newStart + 86400000) newEnd = newStart + 86400000;
      }

      setDragPreviewDates({
        entryId: dragging.entryId,
        start: new Date(newStart),
        end: new Date(newEnd),
      });
    };

    const handleMouseUp = async () => {
      if (dragPreviewDates) {
        const sISO = dragPreviewDates.start.toISOString();
        const eISO = dragPreviewDates.end.toISOString();
        await onUpdateDates(dragPreviewDates.entryId, sISO, eISO);
      }
      setDragging(null);
      setDragPreviewDates(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragPreviewDates, dayWidth, onUpdateDates]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-card)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 1. Mini-Übersichts-Zeitachse am oberen Rand ("Zeitachse" wie im Screenshot) */}
      {showMiniTimeline && (
        <div
          style={{
            height: "28px",
            backgroundColor: "var(--bg-canvas)",
            borderBottom: "1px solid var(--border-strong)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ position: "absolute", left: "10px", fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", zIndex: 2 }}>
            Zeitachse Gesamtprojekt
          </div>
          {/* Mini-Balken Vorschau */}
          <div style={{ width: "100%", height: "100%", position: "relative", opacity: 0.6 }}>
            {entries.map((entry, i) => {
              const { left, width } = getEntryBarCoords(entry, i);
              const miniLeft = (left / totalWidth) * 100;
              const miniWidth = Math.max(1, (width / totalWidth) * 100);
              const color = getTradeColor(entry.trade, entry.color);
              return (
                <div
                  key={entry.id}
                  style={{
                    position: "absolute",
                    left: `${miniLeft}%`,
                    width: `${miniWidth}%`,
                    top: `${(i % 5) * 4 + 4}px`,
                    height: "3px",
                    backgroundColor: color,
                    borderRadius: "1px",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Haupt-Gantt Canvas mit synchronem Scroll */}
      <div
        ref={activeScrollRef}
        onScroll={onScroll}
        style={{
          overflowX: "auto",
          overflowY: isSplitView ? "hidden" : "auto",
          maxHeight: isSplitView ? undefined : "650px",
          position: "relative",
        }}
      >
        <div style={{ width: `${Math.max(totalWidth, 1200)}px`, minHeight: "450px", position: "relative" }}>
          {/* Header 3-stufig: Quartale, Monate, KW/Tage */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              backgroundColor: "var(--bg-surface)",
              borderBottom: "1px solid var(--border-strong)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            {/* Level 1: Quartale */}
            <div style={{ display: "flex", height: "22px", borderBottom: "1px solid var(--border)" }}>
              {quarters.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: `${q.left}px`,
                    width: `${q.width}px`,
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-muted)",
                    borderRight: "1px solid var(--border-strong)",
                    lineHeight: "22px",
                  }}
                >
                  {q.label}
                </div>
              ))}
            </div>

            {/* Level 2: Monate */}
            <div style={{ display: "flex", height: "24px", borderBottom: "1px solid var(--border)" }}>
              {months.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: `${m.left}px`,
                    width: `${m.width}px`,
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    borderRight: "1px solid var(--border)",
                    lineHeight: "24px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Level 3: KW / Tage */}
            <div style={{ display: "flex", height: "22px" }}>
              {timeScale === "days"
                ? days.map((d, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: `${d.left}px`,
                        width: `${d.width}px`,
                        textAlign: "center",
                        fontSize: "10px",
                        fontWeight: 500,
                        color: d.isWeekend ? "var(--safety-amber)" : "var(--text-muted)",
                        backgroundColor: d.isWeekend ? "rgba(245, 158, 11, 0.05)" : "transparent",
                        borderRight: "1px solid rgba(255,255,255,0.05)",
                        lineHeight: "22px",
                      }}
                    >
                      {d.label}
                    </div>
                  ))
                : weeks.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: `${w.left}px`,
                        width: `${w.width}px`,
                        textAlign: "center",
                        fontSize: "10px",
                        fontWeight: 500,
                        color: "var(--text-muted)",
                        borderRight: "1px solid rgba(255,255,255,0.05)",
                        lineHeight: "22px",
                      }}
                    >
                      {w.label}
                    </div>
                  ))}
            </div>
          </div>

          {/* Hintergrund-Führungslinien & Sperrzeit-Zonen */}
          <div style={{ position: "absolute", top: "68px", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
            {/* Spezielle Zonen (Winterferien / Schlechtwetter) wie im Screenshot */}
            {specialZones.map((zone, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: `${zone.left}px`,
                  width: `${zone.width}px`,
                  top: 0,
                  bottom: 0,
                  backgroundColor: "rgba(234, 179, 8, 0.04)",
                  borderLeft: "1px dashed rgba(234, 179, 8, 0.2)",
                  borderRight: "1px dashed rgba(234, 179, 8, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: "10px",
                    color: "rgba(234, 179, 8, 0.4)",
                    letterSpacing: "2px",
                    fontWeight: 600,
                  }}
                >
                  {zone.name}
                </span>
              </div>
            ))}

            {/* Vertikale Führungslinien der Wochen/Monate */}
            {showBarGuidelines &&
              weeks.map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: `${w.left}px`,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    backgroundColor: "var(--border)",
                  }}
                />
              ))}

            {/* Rote "Heute"-Linie mit Tages-Badge wie im Screenshot */}
            {showTodayLine && todayOffset >= 0 && todayOffset <= totalWidth && (
              <div
                style={{
                  position: "absolute",
                  left: `${todayOffset}px`,
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  backgroundColor: "var(--hazard-red)",
                  boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
                  zIndex: 15,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "var(--hazard-red)",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Heute
                </div>
              </div>
            )}
          </div>

          {/* Gantt-Balken Zeilen */}
          <div style={{ paddingTop: "8px", paddingBottom: "24px" }}>
            {entries.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                Keine Gewerke / Positionen im SiGe-Plan vorhanden.
              </div>
            ) : (
              entries.map((entry, index) => {
                const { left, width, sDate, eDate } = getEntryBarCoords(entry, index);
                const color = getTradeColor(entry.trade, entry.color);
                const isAnnex2 = entry.isAnnex2SpecialHazard;
                const isDraggingThis = dragging?.entryId === entry.id;

                return (
                  <div
                    key={entry.id}
                    style={{
                      height: "46px",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {/* Horizontale Führungslinie */}
                    {showBarGuidelines && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: "50%",
                          height: "1px",
                          backgroundColor: "rgba(255,255,255,0.02)",
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    {/* Timeline Balken */}
                    <div
                      onClick={() => onSelectEntry && onSelectEntry(entry)}
                      onMouseDown={(e) =>
                        handleMouseDown(
                          e,
                          entry.id,
                          "move",
                          sDate.getTime(),
                          eDate.getTime()
                        )
                      }
                      style={{
                        position: "absolute",
                        left: `${left}px`,
                        width: `${width}px`,
                        height: "26px",
                        backgroundColor: color,
                        borderRadius: "3px",
                        boxShadow: isDraggingThis
                          ? "0 4px 14px rgba(0,0,0,0.6)"
                          : "0 2px 6px rgba(0,0,0,0.3)",
                        cursor: "grab",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 8px",
                        gap: "6px",
                        overflow: "hidden",
                        zIndex: isDraggingThis ? 10 : 5,
                        transition: isDraggingThis ? "none" : "box-shadow 0.15s ease",
                        border: isAnnex2
                          ? "2px solid var(--hazard-red)"
                          : "1px solid rgba(255,255,255,0.2)",
                      }}
                      title={`${entry.trade}: ${entry.activity}\nVon: ${sDate.toLocaleDateString("de-DE")} Bis: ${eDate.toLocaleDateString("de-DE")}\nSchutzmaßnahme: ${entry.commonMeasures}`}
                    >
                      {/* Resize Handle Links */}
                      <div
                        onMouseDown={(e) =>
                          handleMouseDown(
                            e,
                            entry.id,
                            "resize-left",
                            sDate.getTime(),
                            eDate.getTime()
                          )
                        }
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "8px",
                          cursor: "ew-resize",
                          backgroundColor: "rgba(0,0,0,0.2)",
                        }}
                        title="Startdatum anpassen"
                      />

                      {/* Inhalt des Balkens */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 600,
                          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                          pointerEvents: "none",
                        }}
                      >
                        {isAnnex2 && (
                          <AlertTriangle
                            size={12}
                            color="#fff"
                            style={{ filter: "drop-shadow(0 1px 1px #000)" }}
                          />
                        )}
                        <span style={{ fontWeight: 700 }}>{entry.trade}</span>
                        <span style={{ opacity: 0.9, fontWeight: 400 }}>– {entry.activity}</span>
                      </div>

                      {/* Resize Handle Rechts */}
                      <div
                        onMouseDown={(e) =>
                          handleMouseDown(
                            e,
                            entry.id,
                            "resize-right",
                            sDate.getTime(),
                            eDate.getTime()
                          )
                        }
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: "8px",
                          cursor: "ew-resize",
                          backgroundColor: "rgba(0,0,0,0.2)",
                        }}
                        title="Enddatum anpassen"
                      />
                    </div>

                    {/* Datumsvorschau beim Ziehen */}
                    {isDraggingThis && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${left}px`,
                          top: "-18px",
                          backgroundColor: "var(--bg-canvas)",
                          color: "var(--safety-amber)",
                          border: "1px solid var(--border-strong)",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          fontSize: "9px",
                          fontWeight: 600,
                          zIndex: 25,
                          pointerEvents: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sDate.toLocaleDateString("de-DE")} → {eDate.toLocaleDateString("de-DE")}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
