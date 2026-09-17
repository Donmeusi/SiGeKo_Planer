"use client";

import { Plus, AlertTriangle, MapPin, Building, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface TopBarProps {
  projectName?: string;
  projectNumber?: string | null;
  location?: string;
  status?: string;
  projectId?: string;
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export default function TopBar({
  projectName,
  projectNumber,
  location,
  status = "AUSFUEHRUNG",
  projectId,
  onToggleMobileMenu,
  mobileMenuOpen = false,
}: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isCockpit =
    pathname === `/projects/${projectId}` ||
    pathname === `/projects/${projectId}/` ||
    pathname === "/";

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showDefectModal, setShowDefectModal] = useState(false);

  // Form states for quick project creation
  const [pName, setPName] = useState("");
  const [pNumber, setPNumber] = useState("");
  const [pLocation, setPLocation] = useState("");
  const [pClient, setPClient] = useState("");
  const [pCoordinator, setPCoordinator] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pLocation || !pClient || !pCoordinator) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pName,
          projectNumber: pNumber || `SIGE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
          location: pLocation,
          clientName: pClient,
          coordinatorName: pCoordinator,
          status: "PLANUNG",
        }),
      });
      const data = await res.json();
      if (data?.id) {
        setShowNewProjectModal(false);
        router.push(`/projects/${data.id}`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "PLANUNG":
        return <span className="badge badge-blue">Planungsphase (RAB 30)</span>;
      case "AUSFUEHRUNG":
        return <span className="badge badge-amber">In Ausführung</span>;
      case "ABGESCHLOSSEN":
        return <span className="badge badge-green">Fertiggestellt</span>;
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  return (
    <header className="top-bar no-print">
      {/* Mobile Menu Hamburger + Project Meta Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="btn btn-outline btn-icon mobile-only-inline-flex"
            style={{ padding: "8px" }}
            title={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-label="Navigation umschalten"
          >
            <Menu size={18} />
          </button>
        )}

        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1
              style={{
                fontSize: "14.5px",
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "350px",
              }}
            >
              {projectName || "SiGeKo-Planer Übersicht"}
            </h1>
            {getStatusBadge()}
          </div>
          {location && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              <MapPin size={12} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{location}</span>
              {projectNumber && <span className="hidden-mobile">• Az: {projectNumber}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <ThemeSwitcher variant="topbar" showLabel={true} />

        {isCockpit && (
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="btn btn-secondary btn-sm"
            id="btn-new-project"
          >
            <Plus size={15} />
            <span className="btn-text-desktop">Neues Bauprojekt</span>
          </button>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="modal-overlay" onClick={() => setShowNewProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Building size={20} color="var(--safety-amber)" />
                <h3 className="title-md">Neues Bauvorhaben erfassen</h3>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Bezeichnung des Bauvorhabens *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Neubau Wohn- und Geschäftshaus Am Kirchplatz"
                  className="form-input"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Projektnummer / Aktenzeichen</label>
                  <input
                    type="text"
                    placeholder="z.B. SIGE-2026-042"
                    className="form-input font-mono"
                    value={pNumber}
                    onChange={(e) => setPNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Baustellenadresse (Standort) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Straße, PLZ, Ort"
                    className="form-input"
                    value={pLocation}
                    onChange={(e) => setPLocation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Bauherr (Auftraggeber) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Firma oder Name des Bauherrn"
                    className="form-input"
                    value={pClient}
                    onChange={(e) => setPClient(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SiGe-Koordinator (gem. RAB 30) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Name des Koordinators"
                    className="form-input"
                    value={pCoordinator}
                    onChange={(e) => setPCoordinator(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Wird angelegt..." : "Bauvorhaben anlegen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
