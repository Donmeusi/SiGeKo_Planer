import { notFound } from "next/navigation";
import { db, ensureDatabaseSchema } from "@/lib/db";
import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ClipboardCheck,
  Calendar,
  Building2,
  UserCheck,
  HardHat,
  AlertCircle,
  ExternalLink,
  MapPin,
  Check,
  Info,
} from "lucide-react";

export default async function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureDatabaseSchema();
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      contractors: true,
      advanceNotice: true,
      sigePlanEntries: true,
      inspections: {
        orderBy: { date: "desc" },
        take: 3,
        include: { defects: true },
      },
      defects: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) notFound();

  // Mängel-Berechnung
  const totalDefects = project.defects.length;
  const openDefects = project.defects.filter((d) => d.status !== "BEHOBEN");
  const urgentDefects = project.defects.filter(
    (d) => d.status !== "BEHOBEN" && (d.severity === "GEFAHR_IM_VERZUG" || d.severity === "HOCH")
  );
  const resolvedDefects = project.defects.filter((d) => d.status === "BEHOBEN");

  // Anhang II Gefahren
  const annex2Entries = project.sigePlanEntries.filter((e) => e.isAnnex2SpecialHazard);
  const annex2Count = annex2Entries.length;

  // Gesamtarbeiterzahl
  const totalWorkers = project.contractors.reduce((sum, c) => sum + c.workerCount, 0);

  // Vorankündigungs-Daten
  const maxWorkers = project.advanceNotice?.maxWorkersSimultaneous || 1;
  const totalDays = project.advanceNotice?.estimatedTotalWorkDays || 0;
  const hasSpecialRisks = Boolean(project.advanceNotice?.hasSpecialRisks || annex2Count > 0);
  const isNoticeRequired = totalDays > 500 || maxWorkers > 20 || hasSpecialRisks;

  // Gesamt-Sicherheitsstatus (Ampelsystem)
  let safetyStatus = {
    label: "Sicherheit konform",
    badgeClass: "badge-green",
    dotColor: "#10b981",
    subtitle: "Alle Auflagen erfüllt • Vorankündigung geregelt",
  };

  if (urgentDefects.length > 0) {
    safetyStatus = {
      label: "Gefahr im Verzug / Hohe Dringlichkeit",
      badgeClass: "badge-red",
      dotColor: "#ef4444",
      subtitle: `${urgentDefects.length} akute Sicherheitsmängel erfordern sofortiges Eingreifen!`,
    };
  } else if (openDefects.length > 0 || project.advanceNotice?.status === "ENTWURF") {
    safetyStatus = {
      label: "Auflagen offen",
      badgeClass: "badge-amber",
      dotColor: "#f59e0b",
      subtitle: `${openDefects.length} offene Mängel zur Behebung vorgemerkt`,
    };
  }

  return (
    <div style={{ minWidth: 0, maxWidth: "100%" }}>
      {/* ─── Hero / Projekt-Kopfzeile ──────────────────────────────── */}
      <div className="cockpit-hero">
        <div style={{ minWidth: 0, flex: "1 1 340px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
            <h1
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {project.name}
            </h1>

            {/* Sicherheitsampel Pill */}
            <span
              className={`badge ${safetyStatus.badgeClass}`}
              style={{ fontSize: "11.5px", padding: "3px 9px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: safetyStatus.dotColor,
                  boxShadow: `0 0 8px ${safetyStatus.dotColor}`,
                }}
              />
              <span>{safetyStatus.label}</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px 12px",
              flexWrap: "wrap",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            {project.projectNumber && (
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                Az: {project.projectNumber}
              </span>
            )}
            {project.projectNumber && <span>•</span>}
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={13} color="var(--text-muted)" />
              <span>{project.location}</span>
            </span>
            {project.plannedStart && (
              <>
                <span>•</span>
                <span>
                  Laufzeit: {new Date(project.plannedStart).toLocaleDateString("de-DE")}
                  {project.plannedEnd && ` – ${new Date(project.plannedEnd).toLocaleDateString("de-DE")}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
          <Link href={`/projects/${project.id}/sige-plan`} className="btn btn-primary btn-sm">
            <ShieldAlert size={14} />
            <span>SiGe-Plan öffnen</span>
          </Link>
          <Link href={`/projects/${project.id}/begehungen`} className="btn btn-secondary btn-sm">
            <ClipboardCheck size={14} />
            <span>Begehung starten</span>
          </Link>
          <Link href={`/projects/${project.id}/vorankuendigung`} className="btn btn-outline btn-sm">
            <FileText size={14} />
            <span>Vorankündigung</span>
          </Link>
        </div>
      </div>

      {/* ─── Harmonisierte KPI-Kacheln ────────────────────────────── */}
      <div className="cockpit-kpi-grid">
        {/* Kachel 1: Mängel */}
        <div className="cockpit-kpi-card">
          <div
            className={`stat-icon ${
              urgentDefects.length > 0 ? "red" : openDefects.length > 0 ? "amber" : "green"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            <AlertTriangle size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "1.45rem",
                fontWeight: 700,
                lineHeight: 1.1,
                color: urgentDefects.length > 0 ? "var(--hazard-red)" : "var(--text-primary)",
              }}
            >
              {openDefects.length}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginTop: "2px" }}>
              Offene Mängel
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {urgentDefects.length > 0
                ? `${urgentDefects.length}x Gefahr im Verzug!`
                : openDefects.length === 0
                ? "Keine Mängel anhängig"
                : `${resolvedDefects.length} behoben`}
            </div>
          </div>
        </div>

        {/* Kachel 2: Vorankündigung */}
        <div className="cockpit-kpi-card">
          <div
            className={`stat-icon ${
              project.advanceNotice?.status === "AUSGEHAENGT"
                ? "green"
                : project.advanceNotice?.status === "EINGEREICHT"
                ? "blue"
                : "amber"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            <FileText size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {project.advanceNotice?.status || "ENTWURF"}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginTop: "2px" }}>
              Vorankündigung (§ 2)
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>
              {isNoticeRequired ? "Gesetzlich meldepflichtig" : "Freiwilliger Aushang"}
            </div>
          </div>
        </div>

        {/* Kachel 3: SiGe-Plan & Anhang II */}
        <div className="cockpit-kpi-card">
          <div
            className={`stat-icon ${annex2Count > 0 ? "red" : "amber"}`}
            style={{ width: "40px", height: "40px" }}
          >
            <ShieldAlert size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, lineHeight: 1.1, color: "var(--text-primary)" }}>
              {project.sigePlanEntries.length}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginTop: "2px" }}>
              SiGe-Positionen
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {annex2Count > 0 ? `${annex2Count}x Besondere Gefahren (Anl. II)` : "Allgemeine Maßnahmen"}
            </div>
          </div>
        </div>

        {/* Kachel 4: Beteiligte Gewerke */}
        <div className="cockpit-kpi-card">
          <div className="stat-icon blue" style={{ width: "40px", height: "40px" }}>
            <Users size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "1.45rem", fontWeight: 700, lineHeight: 1.1, color: "var(--text-primary)" }}>
              {project.contractors.length}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginTop: "2px" }}>
              Erfasste Gewerke
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              ~{totalWorkers} Arbeitskräfte erfasst
            </div>
          </div>
        </div>
      </div>

      {/* ─── Zweispaltiges Haupt-Dashboard ─────────────────────────── */}
      <div className="grid-two-col dashboard">
        {/* ─── Linke Spalte: Akute Mängel & SiGe-Risiken ──────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: 0 }}>
          {/* Card: Sicherheitsmängel & Fristen */}
          <div className="card" style={{ minWidth: 0 }}>
            <div className="card-header" style={{ flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <AlertCircle
                  size={18}
                  color={urgentDefects.length > 0 ? "var(--hazard-red)" : "var(--safety-amber)"}
                  style={{ flexShrink: 0 }}
                />
                <h2 className="title-md" style={{ margin: 0, fontSize: "1.05rem" }}>
                  Sicherheitsmängel &amp; Fristenüberwachung
                </h2>
              </div>
              <Link
                href={`/projects/${project.id}/begehungen`}
                className="text-secondary"
                style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}
              >
                <span>Alle {totalDefects} anzeigen</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            {openDefects.length === 0 ? (
              <div
                style={{
                  padding: "26px 16px",
                  textAlign: "center",
                  background: "var(--bg-input)",
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--border)",
                }}
              >
                <CheckCircle2 size={32} color="var(--success-emerald)" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "13px" }}>
                  Keine offenen Mängel registriert
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Alle erfassten Sicherheits- und Gesundheitsschutzauflagen sind behoben.
                </div>
              </div>
            ) : (
              <div>
                {openDefects.slice(0, 4).map((defect) => {
                  const isOverdue = defect.deadline && new Date(defect.deadline) < new Date();
                  const isUrgent = defect.severity === "GEFAHR_IM_VERZUG" || defect.severity === "HOCH";

                  return (
                    <div
                      key={defect.id}
                      className="cockpit-defect-card"
                      style={{
                        borderLeft: `4px solid ${
                          defect.severity === "GEFAHR_IM_VERZUG"
                            ? "var(--hazard-red)"
                            : defect.severity === "HOCH"
                            ? "var(--safety-orange)"
                            : "var(--safety-amber)"
                        }`,
                      }}
                    >
                      <div className="cockpit-defect-header">
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "12.5px",
                            color: "var(--text-primary)",
                            flex: 1,
                            minWidth: "160px",
                          }}
                        >
                          {defect.description}
                        </span>
                        {defect.severity === "GEFAHR_IM_VERZUG" || defect.severity === "GEFAHR_IN_VERZUG" ? (
                          <span className="badge-severity-imminent" style={{ fontSize: "10.5px", padding: "2px 7px" }}>
                            <AlertTriangle size={11} />
                            <span>Gefahr im Verzug</span>
                          </span>
                        ) : defect.severity === "HOCH" ? (
                          <span className="badge-severity-high" style={{ fontSize: "10.5px", padding: "2px 7px" }}>
                            <span className="badge-dot badge-dot-orange" />
                            <span>Hoch</span>
                          </span>
                        ) : defect.severity === "MITTEL" ? (
                          <span className="badge-severity-medium" style={{ fontSize: "10.5px", padding: "2px 7px" }}>
                            <span className="badge-dot badge-dot-amber" />
                            <span>Mittel</span>
                          </span>
                        ) : (
                          <span className="badge-severity-low" style={{ fontSize: "10.5px", padding: "2px 7px" }}>
                            <span className="badge-dot badge-dot-muted" />
                            <span>Gering</span>
                          </span>
                        )}
                      </div>

                      <div className="cockpit-meta-row">
                        {defect.location && (
                          <span className="cockpit-tag">
                            <MapPin size={11} />
                            <span>{defect.location}</span>
                          </span>
                        )}
                        {defect.tradeAssigned && (
                          <span className="cockpit-tag">
                            <Users size={11} />
                            <span>{defect.tradeAssigned}</span>
                          </span>
                        )}
                        {defect.deadline && (
                          <span
                            className="cockpit-tag"
                            style={{
                              color: isOverdue ? "var(--hazard-red)" : isUrgent ? "var(--safety-amber)" : "inherit",
                              borderColor: isOverdue ? "rgba(239, 68, 68, 0.4)" : "var(--border)",
                              background: isOverdue ? "var(--hazard-red-dim)" : "var(--bg-muted)",
                            }}
                          >
                            <Clock size={11} />
                            <span>
                              {isOverdue ? "Frist abgelaufen: " : "Frist: "}
                              {new Date(defect.deadline).toLocaleDateString("de-DE")}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {openDefects.length > 4 && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <Link
                      href={`/projects/${project.id}/begehungen`}
                      style={{ fontSize: "11.5px", color: "var(--safety-amber)", fontWeight: 500 }}
                    >
                      + {openDefects.length - 4} weitere offene Mängel in der Begehungsliste
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card: Besondere Gefahren (Anhang II BaustellV) */}
          <div className="card" style={{ minWidth: 0 }}>
            <div className="card-header" style={{ flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <ShieldAlert size={18} color="var(--hazard-red)" style={{ flexShrink: 0 }} />
                <h2 className="title-md" style={{ margin: 0, fontSize: "1.05rem" }}>
                  Schwerpunkte nach Anhang II BaustellV
                </h2>
              </div>
              <span className="badge badge-annex2" style={{ fontSize: "10.5px" }}>
                {annex2Count} Gefahren erfasst
              </span>
            </div>

            {annex2Entries.length === 0 ? (
              <div style={{ fontSize: "12px", color: "var(--text-muted)", padding: "8px 0" }}>
                Derzeit sind im Sicherheits- und Gesundheitsschutzplan keine Arbeiten nach Anhang II BaustellV (besonders gefährliche Arbeiten wie Absturzgefahr &gt; 5 m, Asbest, Gräben &gt; 5 m) gesondert ausgewiesen.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {annex2Entries.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px 12px",
                      background: "rgba(239, 68, 68, 0.04)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      minWidth: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
                      <strong style={{ color: "var(--hazard-red)" }}>{item.activity}</strong>
                      <span className="cockpit-tag" style={{ fontSize: "10px", flexShrink: 0 }}>
                        {item.trade}
                      </span>
                    </div>
                    <div style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
                      <strong>Gefahr:</strong> {item.hazards}
                    </div>
                    {item.commonMeasures && (
                      <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                        <span style={{ color: "var(--safety-amber)", fontWeight: 500 }}>Schutzmaßnahme:</span> {item.commonMeasures}
                      </div>
                    )}
                  </div>
                ))}

                <Link
                  href={`/projects/${project.id}/sige-plan`}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: "6px", width: "100%", justifyContent: "center" }}
                >
                  <span>Gesamten SiGe-Plan &amp; Anhang-II-Maßnahmen öffnen</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ─── Rechte Spalte: Behörde, Beteiligte & Begehung ──────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: 0 }}>
          {/* Card: Vorankündigung Statusbox */}
          <div className="card" style={{ background: "rgba(245, 158, 11, 0.03)", borderColor: "rgba(245, 158, 11, 0.25)", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={17} color="var(--safety-amber)" />
                <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>
                  Vorankündigung (§ 2 BaustellV)
                </span>
              </div>
              <span className={`badge ${isNoticeRequired ? "badge-amber" : "badge-green"}`}>
                {isNoticeRequired ? "Meldepflichtig" : "Freiwillig"}
              </span>
            </div>

            {/* Kriterien-Prüfleiste */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Max. Beschäftigte gleichzeitig:</span>
                  <span style={{ fontWeight: 600, color: maxWorkers > 20 ? "var(--hazard-red)" : "var(--text-primary)" }}>
                    {maxWorkers} {maxWorkers > 20 ? "(> 20 Pers.)" : "Pers."}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Geschätzter Gesamtaufwand:</span>
                  <span style={{ fontWeight: 600, color: totalDays > 500 ? "var(--hazard-red)" : "var(--text-primary)" }}>
                    {totalDays} {totalDays > 500 ? "(> 500 PT)" : "PT"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Arbeiten mit bes. Gefahren:</span>
                  <span style={{ fontWeight: 600, color: hasSpecialRisks ? "var(--hazard-red)" : "var(--text-primary)" }}>
                    {hasSpecialRisks ? "Vorhanden (Anhang II)" : "Keine"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "12px", wordBreak: "break-word" }}>
              <div><strong>Zuständige Behörde:</strong></div>
              <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                {project.advanceNotice?.authorityName || "Zuständiges Gewerbeaufsichtsamt"}
              </div>
            </div>

            <Link href={`/projects/${project.id}/vorankuendigung`} className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
              <span>Amtliches Formular &amp; Aushang</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          {/* Card: Beteiligte & SiGeKo Profil nach RAB 30 */}
          <div className="card" style={{ minWidth: 0 }}>
            <div className="card-header" style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <UserCheck size={18} color="var(--success-emerald)" />
                <h2 className="title-md" style={{ margin: 0, fontSize: "1.05rem" }}>
                  Beteiligte &amp; Koordinator (RAB 30)
                </h2>
              </div>
            </div>

            <div className="meta-table">
              <span className="meta-label">SiGe-Koordinator:</span>
              <div className="meta-value">
                <strong style={{ color: "var(--text-primary)" }}>{project.coordinatorName}</strong>
                <div style={{ fontSize: "11px", color: "var(--safety-amber)", marginTop: "1px" }}>
                  {project.coordinatorCert || "Qualifikation gem. RAB 30 Anlagen B & C"}
                </div>
                {project.coordinatorContact && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {project.coordinatorContact}
                  </div>
                )}
              </div>

              <span className="meta-label">Bauherr:</span>
              <div className="meta-value">
                <div>{project.clientName}</div>
                {project.clientAddress && (
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{project.clientAddress}</div>
                )}
              </div>

              {project.siteManager && (
                <>
                  <span className="meta-label">Bauleitung:</span>
                  <div className="meta-value">{project.siteManager}</div>
                </>
              )}

              <span className="meta-label">Standort:</span>
              <div className="meta-value">{project.location}</div>
            </div>
          </div>

          {/* Card: Letzte Baustellenbegehung */}
          <div className="card" style={{ minWidth: 0 }}>
            <div className="card-header" style={{ flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={17} color="var(--tech-blue)" />
                <h2 className="title-md" style={{ margin: 0, fontSize: "1.05rem" }}>
                  Letzte Baustellenbegehung
                </h2>
              </div>
              <Link href={`/projects/${project.id}/begehungen`} className="btn btn-outline btn-sm">
                <span>Alle Protokolle</span>
              </Link>
            </div>

            {project.inspections.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: "12px", padding: "8px 0" }}>
                Noch keine Begehung dokumentiert. Erfassen Sie Ihre erste Baustellenbegehung nach RAB 30.
              </div>
            ) : (
              <div>
                {project.inspections.slice(0, 2).map((insp) => (
                  <div
                    key={insp.id}
                    style={{
                      padding: "10px 12px",
                      background: "var(--bg-input)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      marginBottom: "8px",
                      fontSize: "12px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "8px",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <strong style={{ color: "var(--text-primary)" }}>
                          Begehung vom {new Date(insp.date).toLocaleDateString("de-DE")}
                        </strong>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          Prüfer: {insp.inspector}
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          insp.overallImpression === "GUT" || insp.overallImpression === "SEHR_GUT"
                            ? "badge-green"
                            : "badge-amber"
                        }`}
                        style={{ fontSize: "10.5px" }}
                      >
                        {insp.overallImpression.replace(/_/g, " ")}
                      </span>
                    </div>

                    {insp.constructionProgress && (
                      <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "4px", wordBreak: "break-word" }}>
                        <span style={{ color: "var(--text-muted)" }}>Baufortschritt:</span> {insp.constructionProgress}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
