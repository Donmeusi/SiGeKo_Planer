"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  MapPin,
  ExternalLink,
  Check,
  Phone,
  Mail,
  Info,
  Search,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Globe,
} from "lucide-react";
import {
  GERMAN_BUNDESLAENDER_AUTHORITIES,
  BundeslandInfo,
  AuthorityInfo,
  detectStateFromLocation,
} from "@/lib/german-authorities";

interface AuthoritySelectorProps {
  projectLocation?: string;
  currentAuthorityName?: string;
  onSelectAuthority: (auth: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    onlinePortalUrl?: string;
    portalName?: string;
  }) => void;
}

export function AuthoritySelector({
  projectLocation = "",
  currentAuthorityName = "",
  onSelectAuthority,
}: AuthoritySelectorProps) {
  // Erkennung aus dem Projektstandort
  const detected = useMemo(() => {
    return detectStateFromLocation(projectLocation);
  }, [projectLocation]);

  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [selectedAuthId, setSelectedAuthId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Automatische Vorauswahl bei Vorhandensein von detected.stateId, falls noch nichts gewählt
  useEffect(() => {
    if (detected.stateId && !selectedStateId) {
      setSelectedStateId(detected.stateId);
      const stateObj = GERMAN_BUNDESLAENDER_AUTHORITIES.find(
        (b) => b.id === detected.stateId
      );
      if (stateObj && stateObj.authorities.length > 0) {
        setSelectedAuthId(stateObj.authorities[0].id);
      }
    }
  }, [detected.stateId, selectedStateId]);

  // Aktuell ausgewähltes Bundesland
  const currentState = useMemo(() => {
    return (
      GERMAN_BUNDESLAENDER_AUTHORITIES.find((b) => b.id === selectedStateId) ||
      null
    );
  }, [selectedStateId]);

  // Gefilterte Behördenliste basierend auf Suchbegriff
  const filteredAuthorities = useMemo(() => {
    if (!currentState) return [];
    if (!searchTerm.trim()) return currentState.authorities;

    const term = searchTerm.toLowerCase().trim();
    return currentState.authorities.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.city.toLowerCase().includes(term) ||
        a.postalCode.includes(term) ||
        a.regionCoverage.toLowerCase().includes(term) ||
        a.shortName.toLowerCase().includes(term)
    );
  }, [currentState, searchTerm]);

  // Aktuell ausgewählte Behörde
  const currentAuthority = useMemo(() => {
    if (!currentState) return null;
    return (
      currentState.authorities.find((a) => a.id === selectedAuthId) ||
      filteredAuthorities[0] ||
      null
    );
  }, [currentState, selectedAuthId, filteredAuthorities]);

  // Wenn Bundesland wechselt, die erste Behörde vorselektieren
  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    setSearchTerm("");
    const stateObj = GERMAN_BUNDESLAENDER_AUTHORITIES.find(
      (b) => b.id === stateId
    );
    if (stateObj && stateObj.authorities.length > 0) {
      setSelectedAuthId(stateObj.authorities[0].id);
    } else {
      setSelectedAuthId("");
    }
  };

  const handleApply = () => {
    if (!currentAuthority) return;

    onSelectAuthority({
      name: currentAuthority.name,
      address: currentAuthority.address,
      phone: currentAuthority.phone,
      email: currentAuthority.email,
      onlinePortalUrl: currentAuthority.onlinePortalUrl,
      portalName: currentAuthority.portalName,
    });

    setAppliedNotice(true);
    setTimeout(() => {
      setAppliedNotice(false);
    }, 3000);
  };

  const isCurrentMatching =
    currentAuthority &&
    currentAuthorityName &&
    currentAuthorityName.trim().toLowerCase() ===
      currentAuthority.name.trim().toLowerCase();

  return (
    <div
      className="card"
      style={{
        padding: "16px",
        marginBottom: "20px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          paddingBottom: "10px",
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div
            style={{
              padding: "6px",
              borderRadius: "6px",
              background: "rgba(217, 119, 6, 0.12)",
              color: "var(--safety-amber)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 size={18} />
          </div>
          <div>
            <h4
              className="title-md"
              style={{ fontSize: "13.5px", margin: 0, fontWeight: 600 }}
            >
              Zuständige Arbeitsschutz- &amp; Gewerbeaufsichtsbehörde
            </h4>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Föderale Zuständigkeiten nach § 2 BaustellV für alle 16
              Bundesländer
            </div>
          </div>
        </div>

        {/* Automatische Bauort-Erkennung */}
        {detected.stateId && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 9px",
              borderRadius: "5px",
              background:
                selectedStateId === detected.stateId
                  ? "rgba(16, 185, 129, 0.12)"
                  : "rgba(217, 119, 6, 0.12)",
              border: `1px solid ${
                selectedStateId === detected.stateId
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(217, 119, 6, 0.3)"
              }`,
              fontSize: "11px",
              cursor: "pointer",
            }}
            onClick={() => handleStateChange(detected.stateId!)}
            title="Klicken, um erkanntes Bundesland zu aktivieren"
          >
            <Sparkles
              size={13}
              color={
                selectedStateId === detected.stateId
                  ? "var(--success-emerald)"
                  : "var(--safety-amber)"
              }
            />
            <span style={{ fontWeight: 500 }}>
              Bauort-Erkennung:{" "}
              <strong>
                {
                  GERMAN_BUNDESLAENDER_AUTHORITIES.find(
                    (b) => b.id === detected.stateId
                  )?.name
                }
              </strong>
            </span>
            {selectedStateId !== detected.stateId && (
              <span
                style={{
                  textDecoration: "underline",
                  color: "var(--safety-amber)",
                }}
              >
                (Aktivieren)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Auswahlleiste: Bundesland & Regionalbehörde */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        {/* 1. Bundesland Dropdown */}
        <div className="form-group" style={{ margin: 0 }}>
          <label
            className="form-label"
            style={{
              fontSize: "11.5px",
              marginBottom: "4px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>1. Bundesland wählen ({GERMAN_BUNDESLAENDER_AUTHORITIES.length})</span>
          </label>
          <select
            className="form-select"
            style={{ fontSize: "12.5px" }}
            value={selectedStateId}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <option value="">-- Bundesland auswählen --</option>
            {GERMAN_BUNDESLAENDER_AUTHORITIES.map((b: BundeslandInfo) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.authorities.length}{" "}
                {b.authorities.length === 1 ? "Behörde" : "Bezirke"})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Zuständige Regionalbehörde / Aufsichtsamt */}
        <div className="form-group" style={{ margin: 0 }}>
          <label
            className="form-label"
            style={{
              fontSize: "11.5px",
              marginBottom: "4px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>2. Regionale Dienststelle / Aufsichtsamt</span>
            {currentState && (
              <span style={{ color: "var(--text-muted)" }}>
                {filteredAuthorities.length} Dienststelle(n)
              </span>
            )}
          </label>
          <select
            className="form-select"
            style={{ fontSize: "12.5px" }}
            disabled={!selectedStateId || filteredAuthorities.length === 0}
            value={currentAuthority?.id || ""}
            onChange={(e) => setSelectedAuthId(e.target.value)}
          >
            {!selectedStateId ? (
              <option value="">Zuerst Bundesland wählen...</option>
            ) : filteredAuthorities.length === 0 ? (
              <option value="">Keine passende Dienststelle gefunden</option>
            ) : (
              filteredAuthorities.map((auth) => (
                <option key={auth.id} value={auth.id}>
                  {auth.city} – {auth.shortName}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Detail-Box der ausgewählten Behörde */}
      {currentAuthority ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "14px",
            marginTop: "10px",
          }}
        >
          {/* Titel & Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{currentAuthority.name}</span>
                {isCurrentMatching && (
                  <span
                    className="badge badge-green"
                    style={{ fontSize: "10px", padding: "2px 6px" }}
                  >
                    Aktuell im Formular eingetragen
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "var(--text-secondary)",
                  marginTop: "2px",
                }}
              >
                {currentAuthority.department}
              </div>
            </div>

            {/* Aktion: In Formular übernehmen */}
            <button
              type="button"
              onClick={handleApply}
              className={`btn btn-sm ${
                appliedNotice ? "btn-secondary" : "btn-primary"
              }`}
              style={{
                fontSize: "12px",
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {appliedNotice ? (
                <>
                  <CheckCircle2 size={15} color="var(--success-emerald)" />
                  <span style={{ color: "var(--success-emerald)" }}>
                    Übernommen!
                  </span>
                </>
              ) : (
                <>
                  <Check size={15} />
                  <span>In Vorankündigung übernehmen</span>
                </>
              )}
            </button>
          </div>

          {/* Adress- & Kontaktdaten-Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              fontSize: "11.5px",
              paddingTop: "8px",
              borderTop: "1px dashed var(--border)",
              marginTop: "8px",
            }}
          >
            {/* Postanschrift */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <MapPin
                size={14}
                color="var(--safety-amber)"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>
                  Anschrift für Postversand / Vorankündigung:
                </span>
                <span style={{ fontWeight: 500 }}>
                  {currentAuthority.address}
                </span>
              </div>
            </div>

            {/* Telefon & E-Mail */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {currentAuthority.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={13} color="var(--text-muted)" />
                  <a
                    href={`tel:${currentAuthority.phone.replace(/[^0-9+]/g, "")}`}
                    style={{
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    {currentAuthority.phone}
                  </a>
                </div>
              )}
              {currentAuthority.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={13} color="var(--text-muted)" />
                  <a
                    href={`mailto:${currentAuthority.email}`}
                    style={{
                      color: "var(--text-secondary)",
                      textDecoration: "underline",
                    }}
                  >
                    {currentAuthority.email}
                  </a>
                </div>
              )}
            </div>

            {/* Online-Meldungsportal (falls vorhanden) */}
            {currentAuthority.onlinePortalUrl && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <Globe
                  size={14}
                  color="var(--tech-blue)"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block" }}>
                    Online-Vorankündigung:
                  </span>
                  <a
                    href={currentAuthority.onlinePortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--tech-blue)",
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      textDecoration: "underline",
                    }}
                  >
                    <span>
                      {currentAuthority.portalName || "Offizielles Online-Portal"}
                    </span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Zuständigkeitsbereich / Bezirke */}
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              background: "var(--bg-muted)",
              padding: "6px 10px",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>
              Örtliche Zuständigkeit:
            </strong>{" "}
            {currentAuthority.regionCoverage}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "12px",
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-muted)",
            background: "var(--bg-card)",
            borderRadius: "6px",
          }}
        >
          Bitte wählen Sie oben ein Bundesland aus, um die zuständige Behörde
          einzusehen und direkt in die Vorankündigung zu übernehmen.
        </div>
      )}
    </div>
  );
}
