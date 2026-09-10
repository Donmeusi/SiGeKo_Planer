"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  BookOpen,
  ClipboardCheck,
  ScrollText,
  Building2,
  Users,
  HardHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ProjectSummary {
  id: string;
  name: string;
  projectNumber: string | null;
  status: string;
}

interface SidebarProps {
  currentProjectId: string;
  allProjects?: ProjectSummary[];
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  currentProjectId,
  allProjects = [],
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [projectList, setProjectList] = useState<ProjectSummary[]>(allProjects);
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sigeko_sidebar_collapsed");
      if (saved === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sigeko_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (allProjects.length === 0) {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProjectList(data);
        })
        .catch(() => {});
    } else {
      setProjectList(allProjects);
    }
  }, [allProjects]);

  const currentProject = projectList.find((p) => p.id === currentProjectId) || projectList[0];

  const navItems = [
    {
      label: "Baustellen-Cockpit",
      href: currentProjectId ? `/projects/${currentProjectId}` : "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Vorankündigung",
      href: currentProjectId ? `/projects/${currentProjectId}/vorankuendigung` : "/vorankuendigung",
      icon: FileText,
      badge: "§ 2",
    },
    {
      label: "SiGe-Plan (RAB 31)",
      href: currentProjectId ? `/projects/${currentProjectId}/sige-plan` : "/sige-plan",
      icon: ShieldAlert,
      badge: "Kern",
    },
    {
      label: "Gefährdungskatalog",
      href: currentProjectId ? `/projects/${currentProjectId}/katalog` : "/katalog",
      icon: BookOpen,
      badge: "ASR",
    },
    {
      label: "Begehung & Mängel",
      href: currentProjectId ? `/projects/${currentProjectId}/begehungen` : "/begehungen",
      icon: ClipboardCheck,
      badge: null,
    },
    {
      label: "Baustellenordnung",
      href: currentProjectId ? `/projects/${currentProjectId}/baustellenordnung` : "/baustellenordnung",
      icon: ScrollText,
      badge: null,
    },
    {
      label: "Unterlage (RAB 32)",
      href: currentProjectId ? `/projects/${currentProjectId}/unterlage` : "/unterlage",
      icon: Building2,
      badge: null,
    },
    {
      label: "Gewerke & Firmen",
      href: currentProjectId ? `/projects/${currentProjectId}/gewerke` : "/gewerke",
      icon: Users,
      badge: null,
    },
  ];

  return (
    <aside
      className={`sidebar no-print ${mobileOpen ? "sidebar-mobile-open" : ""} ${
        isCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Brand Header */}
      {!isCollapsed ? (
        <div
          style={{
            padding: "12px 12px 10px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0b0f19",
                boxShadow: "0 0 10px rgba(245, 158, 11, 0.3)",
                flexShrink: 0,
              }}
            >
              <HardHat size={17} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "13px",
                  letterSpacing: "-0.02em",
                  color: "#f8fafc",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                SiGeKo-Planer
              </div>
              <div
                style={{
                  fontSize: "9.5px",
                  color: "var(--safety-amber)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                BaustellV &amp; RAB 30
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <button
              type="button"
              onClick={toggleCollapse}
              className="btn btn-outline btn-sm sidebar-collapse-btn"
              style={{ padding: "4px 6px", color: "var(--text-muted)" }}
              title="Seitenleiste einklappen"
              aria-label="Seitenleiste einklappen"
            >
              <ChevronLeft size={15} />
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-sm mobile-close-btn"
                style={{ padding: "4px 6px" }}
                title="Menü schließen"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "12px 0 10px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #f59e0b, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b0f19",
              boxShadow: "0 0 10px rgba(245, 158, 11, 0.3)",
            }}
            title="SiGeKo-Planer (BaustellV & RAB 30)"
          >
            <HardHat size={17} strokeWidth={2.4} />
          </div>

          <button
            type="button"
            onClick={toggleCollapse}
            className="btn btn-outline btn-sm sidebar-collapse-btn"
            style={{ padding: "4px", color: "var(--text-muted)" }}
            title="Seitenleiste ausklappen"
            aria-label="Seitenleiste ausklappen"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Project Selector Box */}
      {!isCollapsed ? (
        <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)" }}>
          <div
            style={{
              fontSize: "9.5px",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "4px",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            Bauvorhaben
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProjectSelect(!showProjectSelect)}
              type="button"
              className="card"
              style={{
                width: "100%",
                padding: "6px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--bg-input)",
                borderColor: showProjectSelect ? "var(--safety-amber)" : "var(--border-strong)",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div style={{ minWidth: 0, flex: 1, marginRight: "6px" }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "#f8fafc",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {currentProject?.name || "Kein Projekt"}
                </div>
                {currentProject?.projectNumber && (
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {currentProject.projectNumber}
                  </div>
                )}
              </div>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {showProjectSelect && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: "4px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 60,
                  maxHeight: "220px",
                  overflowY: "auto",
                  padding: "4px",
                }}
              >
                {projectList.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowProjectSelect(false);
                      router.push(`/projects/${p.id}`);
                    }}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: p.id === currentProjectId ? "var(--safety-amber)" : "var(--text-primary)",
                      background: p.id === currentProjectId ? "var(--safety-amber-dim)" : "transparent",
                      fontWeight: p.id === currentProjectId ? 600 : 400,
                    }}
                  >
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    {p.projectNumber && (
                      <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{p.projectNumber}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "8px 0",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <button
            onClick={() => setShowProjectSelect(!showProjectSelect)}
            type="button"
            className="btn btn-outline"
            title={`Aktives Projekt: ${currentProject?.name || "Kein Projekt"}`}
            style={{
              width: "32px",
              height: "32px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-sm)",
              borderColor: showProjectSelect ? "var(--safety-amber)" : "var(--border-strong)",
              background: "var(--bg-input)",
            }}
          >
            <Building2 size={15} color="var(--safety-amber)" />
          </button>

          {showProjectSelect && (
            <div
              style={{
                position: "fixed",
                top: "60px",
                left: "66px",
                width: "220px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 60,
                maxHeight: "220px",
                overflowY: "auto",
                padding: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  padding: "4px 8px",
                  fontWeight: 600,
                }}
              >
                Projekt wechseln
              </div>
              {projectList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setShowProjectSelect(false);
                    router.push(`/projects/${p.id}`);
                  }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: p.id === currentProjectId ? "var(--safety-amber)" : "var(--text-primary)",
                    background: p.id === currentProjectId ? "var(--safety-amber-dim)" : "transparent",
                    fontWeight: p.id === currentProjectId ? 600 : 400,
                  }}
                >
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.name}
                  </div>
                  {p.projectNumber && (
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{p.projectNumber}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: "8px 0", display: "flex", flexDirection: "column", gap: "1px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => onClose?.()}
              className={`nav-item ${isActive ? "active" : ""}`}
              id={`nav-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              title={item.label + (item.badge ? ` (${item.badge})` : "")}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!isCollapsed && (
                <>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: "9.5px",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        background: isActive ? "rgba(245, 158, 11, 0.25)" : "rgba(255,255,255,0.08)",
                        color: isActive ? "var(--safety-amber)" : "var(--text-muted)",
                        fontWeight: 600,
                        lineHeight: "1.3",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Info & RAB 30 Badge + Collapse Footer */}
      {!isCollapsed ? (
        <div
          style={{
            padding: "8px 10px",
            borderTop: "1px solid var(--border)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "var(--bg-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--safety-amber)",
                flexShrink: 0,
              }}
            >
              <ShieldAlert size={12} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#f8fafc",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                SiGeKo Fachprofil
              </div>
              <div style={{ fontSize: "9.5px", color: "var(--success-emerald)", fontWeight: 500 }}>
                ✓ RAB 30 konform
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleCollapse}
            className="sidebar-collapse-footer-btn"
            title="Seitenleiste einklappen"
            style={{
              width: "100%",
              padding: "5px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              background: "transparent",
              border: "none",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "11px",
              marginTop: "4px",
            }}
          >
            <ChevronLeft size={13} />
            <span>Einklappen</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: "8px 0",
            borderTop: "1px solid var(--border)",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "var(--bg-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--safety-amber)",
            }}
            title="SiGeKo Fachprofil: RAB 30 konform"
          >
            <ShieldAlert size={12} />
          </div>

          <button
            type="button"
            onClick={toggleCollapse}
            className="sidebar-collapse-footer-btn"
            title="Seitenleiste ausklappen"
            style={{
              width: "100%",
              padding: "4px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </aside>
  );
}
