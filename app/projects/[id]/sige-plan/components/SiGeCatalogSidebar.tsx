"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  AlertTriangle,
  HardHat,
  Building,
  Shovel,
  Wrench,
  Zap,
  X,
  Check,
} from "lucide-react";
import { INITIAL_HAZARDS_CATALOG, CatalogItem } from "@/lib/sample-catalog";

interface SiGeCatalogSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: CatalogItem) => Promise<void>;
  addingItemId: string | null;
}

export function SiGeCatalogSidebar({
  isOpen,
  onClose,
  onAddItem,
  addingItemId,
}: SiGeCatalogSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "Tiefbau & Erdarbeiten": true,
    "Baustelleneinrichtung": true,
    "Rohbau & Gerüstbau": true,
  });

  if (!isOpen) return null;

  // Group items by category
  const categories = [
    {
      id: "Baustelleneinrichtung",
      title: "Baustelleneinrichtung & Verkehr",
      icon: HardHat,
      color: "#84cc16",
      items: INITIAL_HAZARDS_CATALOG.filter(
        (i) => i.tradeCategory.toLowerCase().includes("einrichtung") || i.tradeCategory.toLowerCase().includes("verkehr")
      ),
    },
    {
      id: "Tiefbau & Erdarbeiten",
      title: "Tiefbau & Erdarbeiten",
      icon: Shovel,
      color: "#ef4444",
      items: INITIAL_HAZARDS_CATALOG.filter(
        (i) => i.tradeCategory.toLowerCase().includes("tiefbau") || i.tradeCategory.toLowerCase().includes("erdarbeit")
      ),
    },
    {
      id: "Rohbau & Gerüstbau",
      title: "Rohbau & Gerüstbau",
      icon: Building,
      color: "#f59e0b",
      items: INITIAL_HAZARDS_CATALOG.filter(
        (i) =>
          i.tradeCategory.toLowerCase().includes("rohbau") ||
          i.tradeCategory.toLowerCase().includes("gerüst") ||
          i.tradeCategory.toLowerCase().includes("beton")
      ),
    },
    {
      id: "Dach & Fassade",
      title: "Dach-, Holzbau & Fassade",
      icon: Wrench,
      color: "#0284c7",
      items: INITIAL_HAZARDS_CATALOG.filter(
        (i) =>
          i.tradeCategory.toLowerCase().includes("dach") ||
          i.tradeCategory.toLowerCase().includes("fassade") ||
          i.tradeCategory.toLowerCase().includes("holz")
      ),
    },
    {
      id: "Ausbau & Haustechnik",
      title: "Ausbau, TGA & Elektro",
      icon: Zap,
      color: "#10b981",
      items: INITIAL_HAZARDS_CATALOG.filter(
        (i) =>
          i.tradeCategory.toLowerCase().includes("ausbau") ||
          i.tradeCategory.toLowerCase().includes("elektro") ||
          i.tradeCategory.toLowerCase().includes("technik") ||
          (!i.tradeCategory.toLowerCase().includes("einrichtung") &&
            !i.tradeCategory.toLowerCase().includes("tiefbau") &&
            !i.tradeCategory.toLowerCase().includes("rohbau") &&
            !i.tradeCategory.toLowerCase().includes("dach"))
      ),
    },
  ];

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const filteredCategories = categories.map((cat) => {
    if (!searchTerm.trim()) return cat;
    const term = searchTerm.toLowerCase();
    const filteredItems = cat.items.filter(
      (item) =>
        item.activity.toLowerCase().includes(term) ||
        item.hazard.toLowerCase().includes(term) ||
        item.protectiveMeasure.toLowerCase().includes(term)
    );
    return {
      ...cat,
      items: filteredItems,
    };
  }).filter((cat) => !searchTerm.trim() || cat.items.length > 0);

  return (
    <aside
      className="no-print"
      style={{
        width: "320px",
        minWidth: "320px",
        height: "calc(100vh - 220px)",
        minHeight: "560px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <HardHat size={16} color="var(--safety-amber)" />
          <span style={{ fontWeight: 600, fontSize: "13px" }}>Gefährdungskatalog</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{ padding: "2px 6px" }}
          title="Schließen"
        >
          <X size={14} />
        </button>
      </div>

      {/* Suche */}
      <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "relative" }}>
          <Search
            size={14}
            color="var(--text-muted)"
            style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "30px", fontSize: "12px", padding: "6px 8px 6px 30px" }}
            placeholder="Katalog durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Katalogbaum */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {filteredCategories.map((cat) => {
          const isOpenCategory = openCategories[cat.id] ?? true;
          const Icon = cat.icon;

          return (
            <div key={cat.id} style={{ marginBottom: "6px" }}>
              {/* Kategorie-Kopf */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-muted)",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icon size={14} color={cat.color} />
                  <span>{cat.title}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      padding: "1px 5px",
                      borderRadius: "10px",
                    }}
                  >
                    {cat.items.length}
                  </span>
                </div>
                {isOpenCategory ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {/* Items */}
              {isOpenCategory && (
                <div style={{ marginTop: "4px", paddingLeft: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {cat.items.map((item, idx) => {
                    const isAdding = addingItemId === `${cat.id}-${idx}`;
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          transition: "border-color 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                          <span style={{ fontWeight: 600, fontSize: "11.5px", color: "var(--text-primary)", lineHeight: 1.3 }}>
                            {item.activity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddItem(item)}
                            disabled={isAdding}
                            className="btn btn-primary btn-sm"
                            style={{
                              padding: "2px 6px",
                              fontSize: "11px",
                              height: "22px",
                              minWidth: "22px",
                              flexShrink: 0,
                            }}
                            title="In SiGe-Plan übernehmen"
                          >
                            {isAdding ? <Check size={12} /> : <Plus size={12} />}
                          </button>
                        </div>

                        {item.isAnnex2 && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertTriangle size={10} color="var(--hazard-red)" />
                            <span style={{ fontSize: "9.5px", color: "var(--hazard-red)", fontWeight: 700 }}>
                              ANHANG II (BESONDERE GEFAHR)
                            </span>
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: "10.5px",
                            color: "var(--text-secondary)",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.35,
                          }}
                        >
                          {item.hazard}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div
        style={{
          padding: "8px 12px",
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg-surface)",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        Klick auf <strong style={{ color: "var(--safety-amber)" }}>+</strong> übernimmt Position in den Plan.
      </div>
    </aside>
  );
}
