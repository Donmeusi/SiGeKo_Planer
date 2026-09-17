"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Search,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  ListFilter,
} from "lucide-react";
import {
  ANNEX_2_REGULATIONS,
  Annex2RegulationItem,
  parseAnnex2Selection,
} from "@/lib/annex2-regulations";

interface Annex2SelectorProps {
  initialSelection: string[];
  hasSpecialRisks: boolean;
  onSelectionChange: (selectedIds: string[], hasRisks: boolean) => void;
}

export function Annex2Selector({
  initialSelection = [],
  hasSpecialRisks,
  onSelectionChange,
}: Annex2SelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelection);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Synchronisieren, falls Parent ändert
  React.useEffect(() => {
    setSelectedIds(initialSelection);
  }, [initialSelection]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return ANNEX_2_REGULATIONS;
    const q = searchQuery.toLowerCase();
    return ANNEX_2_REGULATIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.legalText.toLowerCase().includes(q) ||
        item.praxisExamples.some((ex) => ex.toLowerCase().includes(q)) ||
        item.relevantTrades.some((tr) => tr.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleToggleItem = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    setSelectedIds(next);
    onSelectionChange(next, next.length > 0);
  };

  const handleSelectCommon = () => {
    // Häufigste Hochbau-Risiken: Nr. 1 (Absturz > 5m / Graben), Nr. 2 (Asbest/KMF/Staub), Nr. 10 (Fertigteilmontage)
    const commonIds = ["annex2-1", "annex2-2", "annex2-10"];
    const merged = Array.from(new Set([...selectedIds, ...commonIds]));
    setSelectedIds(merged);
    onSelectionChange(merged, true);
  };

  const handleClearAll = () => {
    setSelectedIds([]);
    onSelectionChange([], false);
  };

  const selectedCount = selectedIds.length;
  const isTriggered = selectedCount > 0 || hasSpecialRisks;

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${isTriggered ? "rgba(239, 68, 68, 0.4)" : "var(--border)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "16px",
      }}
    >
      {/* Header / Click-to-toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          background: isTriggered ? "rgba(239, 68, 68, 0.05)" : "transparent",
          transition: "background 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: isTriggered ? "rgba(239, 68, 68, 0.15)" : "var(--bg-muted)",
              color: isTriggered ? "var(--hazard-red)" : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldAlert size={17} />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              Besonders gefährliche Arbeiten nach Anhang II BaustellV (Kriterium 3)
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Gesetzlicher 10-Punkte-Katalog für Vorankündigungs- &amp; SiGe-Plan-Pflicht
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              padding: "2px 10px",
              borderRadius: "4px",
              background: isTriggered ? "rgba(239, 68, 68, 0.15)" : "var(--bg-muted)",
              color: isTriggered ? "var(--hazard-red)" : "var(--text-muted)",
            }}
          >
            {selectedCount === 0 ? "Keine ausgewählt" : `${selectedCount} ausgewählt`}
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Ausgewählte Badges in der Kopfzeile bei geschlossenem Zustand */}
      {!isOpen && selectedCount > 0 && (
        <div
          style={{
            padding: "8px 16px 12px 16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            borderTop: "1px dashed rgba(239, 68, 68, 0.2)",
          }}
        >
          {selectedIds.map((id) => {
            const item = ANNEX_2_REGULATIONS.find((r) => r.id === id);
            if (!item) return null;
            return (
              <span
                key={id}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "var(--hazard-red)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                }}
              >
                Nr. {item.number}: {item.shortLabel}
              </span>
            );
          })}
        </div>
      )}

      {/* Aufklappbarer Auswahlbereich */}
      {isOpen && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          {/* Hinweisbox BaustellV */}
          <div
            style={{
              padding: "10px 12px",
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: "6px",
              fontSize: "11.5px",
              color: "var(--text-secondary)",
              marginBottom: "14px",
              lineHeight: "1.5",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Rechtliche Bedeutung gem. § 2 BaustellV:</strong> Fällt auf der Baustelle auch nur <em>eine</em> der nachfolgenden Tätigkeiten an, besteht <strong>unabhängig von Beschäftigtenzahl und Dauer</strong> stets die Pflicht zur <strong>Vorankündigung</strong> und zur Erstellung eines <strong>SiGe-Plans</strong>.
          </div>

          {/* Schnellfilter & Aktionen */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Gefahr, Gewerk oder Stichwort suchen (z. B. Absturz, Asbest, Kran)..."
                className="form-input"
                style={{ paddingLeft: "30px", fontSize: "12px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={handleSelectCommon}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "11px", gap: "4px" }}
                title="Wählt Nr. 1 (Absturz >5m/Gräben), Nr. 2 (Gefahrstoffe/KMR) und Nr. 10 (Fertigteilmontage)"
              >
                <Sparkles size={12} color="var(--safety-amber)" />
                <span>Typische Hochbau-Gefahren wählen</span>
              </button>

              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "11px", color: "var(--hazard-red)" }}
                >
                  Alle abwählen
                </button>
              )}
            </div>
          </div>

          {/* Liste der 10 Anhang II Ziffern */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredItems.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              const isExpanded = expandedDetailsId === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    border: `1px solid ${isChecked ? "rgba(239, 68, 68, 0.4)" : "var(--border)"}`,
                    background: isChecked ? "rgba(239, 68, 68, 0.04)" : "var(--bg-card)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <input
                      type="checkbox"
                      id={`annex2-chk-${item.id}`}
                      checked={isChecked}
                      onChange={() => handleToggleItem(item.id)}
                      style={{
                        width: "17px",
                        height: "17px",
                        marginTop: "2px",
                        accentColor: "var(--hazard-red)",
                        cursor: "pointer",
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                        <label
                          htmlFor={`annex2-chk-${item.id}`}
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 700,
                            color: isChecked ? "var(--hazard-red)" : "var(--text-primary)",
                            cursor: "pointer",
                          }}
                        >
                          {item.title}
                        </label>

                        <button
                          type="button"
                          onClick={() => setExpandedDetailsId(isExpanded ? null : item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>{isExpanded ? "Weniger Details" : "Beispiele & Gewerke"}</span>
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>

                      {/* Gesetzestext */}
                      <p
                        style={{
                          fontSize: "11.5px",
                          color: "var(--text-secondary)",
                          fontStyle: "italic",
                          margin: "4px 0 0 0",
                          lineHeight: "1.4",
                        }}
                      >
                        &bdquo;{item.legalText}&ldquo;
                      </p>

                      {/* Details / Praxisbeispiele */}
                      {isExpanded && (
                        <div
                          style={{
                            marginTop: "10px",
                            paddingTop: "10px",
                            borderTop: "1px dashed var(--border)",
                          }}
                        >
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
                            Typische Praxisbeispiele:
                          </div>
                          <ul style={{ margin: "0 0 8px 16px", padding: 0, fontSize: "11.5px", color: "var(--text-secondary)" }}>
                            {item.praxisExamples.map((ex, i) => (
                              <li key={i} style={{ marginBottom: "2px" }}>
                                {ex}
                              </li>
                            ))}
                          </ul>

                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ fontSize: "10.5px", color: "var(--text-muted)", fontWeight: 600 }}>
                              Betroffene Gewerke:
                            </span>
                            {item.relevantTrades.map((tr, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: "10px",
                                  padding: "1px 6px",
                                  borderRadius: "3px",
                                  background: "var(--bg-muted)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                {tr}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fußzeile mit Zusammenfassung */}
          <div
            style={{
              marginTop: "14px",
              padding: "10px 14px",
              background: isTriggered ? "rgba(239, 68, 68, 0.08)" : "var(--bg-secondary)",
              border: `1px solid ${isTriggered ? "rgba(239, 68, 68, 0.25)" : "var(--border)"}`,
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "12px", color: isTriggered ? "var(--hazard-red)" : "var(--text-secondary)" }}>
              {isTriggered ? (
                <strong>
                  🚨 {selectedCount} gefährliche Tätigkeiten gewählt: Kriterium 3 ist ERFÜLLT!
                </strong>
              ) : (
                <span>Keine Arbeiten nach Anhang II gewählt (Kriterium 3 nicht erfüllt).</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-primary btn-sm"
              style={{ fontSize: "11.5px", padding: "4px 12px" }}
            >
              Auswahl bestätigen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
