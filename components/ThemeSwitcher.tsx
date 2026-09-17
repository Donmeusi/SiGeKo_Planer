"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, THEME_OPTIONS, ThemeMode } from "@/lib/ThemeContext";
import {
  Sun,
  Moon,
  Palette,
  Check,
  Compass,
  Layers,
} from "lucide-react";

interface ThemeSwitcherProps {
  variant?: "topbar" | "sidebar";
  showLabel?: boolean;
}

export default function ThemeSwitcher({ variant = "topbar", showLabel = false }: ThemeSwitcherProps) {
  const { theme, setTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentThemeObj = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  const getThemeIcon = (id: ThemeMode) => {
    switch (id) {
      case "light":
        return <Sun size={15} color="#ea580c" />;
      case "dark":
        return <Moon size={15} color="#f59e0b" />;
      case "slate":
        return <Layers size={15} color="#10b981" />;
      case "sand":
        return <Sun size={15} color="#c2410c" />;
      case "blueprint":
        return <Compass size={15} color="#38bdf8" />;
      default:
        return <Palette size={15} />;
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-sm"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: showLabel ? "5px 10px" : "6px",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
        title={`Farbschema: ${currentThemeObj.name}`}
        aria-label="Farbschema wechseln"
      >
        {getThemeIcon(theme)}
        {showLabel && (
          <span style={{ fontSize: "12px", fontWeight: 500 }}>
            {currentThemeObj.shortName}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: variant === "topbar" ? 0 : "auto",
            left: variant === "sidebar" ? 0 : "auto",
            width: "240px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "6px",
            zIndex: 1000,
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <div
            style={{
              padding: "6px 8px 4px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--border)",
              marginBottom: "4px",
            }}
          >
            Farbschema wählen
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {THEME_OPTIONS.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: isSelected ? "var(--bg-muted)" : "transparent",
                    border: isSelected ? "1px solid var(--border)" : "1px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {/* Swatch preview */}
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: opt.previewBg,
                      border: "2px solid var(--border)",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: opt.previewAccent,
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "var(--safety-amber)" : "var(--text-primary)",
                      }}
                    >
                      {opt.name}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {opt.description}
                    </div>
                  </div>

                  {/* Checkmark */}
                  {isSelected && (
                    <Check size={14} color="var(--safety-amber)" style={{ flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
