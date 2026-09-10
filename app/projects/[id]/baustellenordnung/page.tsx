"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  PhoneCall,
  HardHat,
  Truck,
  Zap,
  Wrench,
  ShieldAlert,
  Plus,
  Printer,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Search,
  FileText,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileSignature,
  SlidersHorizontal,
  TableProperties,
} from "lucide-react";
import {
  INQA_CHAPTERS,
  INQAChapter,
  mapCategoryToINQA,
  getChapterMeta,
} from "@/lib/inqa-rules";

interface SiteRule {
  id: string;
  projectId: string;
  category: string;
  title: string;
  content: string;
  praxisProblem?: string | null;
  isContractRelevant?: boolean;
  isSiGePlanRelevant?: boolean;
  actionStatus?: string;
  orderIndex: number;
}

interface ProjectData {
  id: string;
  name: string;
  projectNumber?: string | null;
  location: string;
  clientName: string;
  clientContact?: string | null;
  coordinatorName: string;
  coordinatorContact?: string | null;
  siteManager?: string | null;
  siteRules?: SiteRule[];
}

export default function SiteRulesPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [rules, setRules] = useState<SiteRule[]>([]);
  const [loading, setLoading] = useState(true);

  // View state: 'CARDS' | 'TABLE'
  const [viewMode, setViewMode] = useState<"CARDS" | "TABLE">("CARDS");

  // Filter states
  const [selectedChapter, setSelectedChapter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterContractOnly, setFilterContractOnly] = useState(false);
  const [filterSiGeOnly, setFilterSiGeOnly] = useState(false);

  // Accordion collapsed state for chapters (key: chapterId, value: boolean)
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  // Emergency banner toggle (compact vs expanded)
  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [editingRule, setEditingRule] = useState<SiteRule | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState("KAPITEL_1_ALLGEMEIN");
  const [formTitle, setFormTitle] = useState("");
  const [formPraxisProblem, setFormPraxisProblem] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formIsContract, setFormIsContract] = useState(true);
  const [formIsSiGe, setFormIsSiGe] = useState(true);
  const [formActionStatus, setFormActionStatus] = useState("GEREGELT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = () => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setProject(data);
          setRules(data.siteRules || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  // Icon helper
  const renderChapterIcon = (iconName: string, size = 16, color = "currentColor") => {
    switch (iconName) {
      case "Building2":
        return <Building2 size={size} color={color} />;
      case "PhoneCall":
        return <PhoneCall size={size} color={color} />;
      case "HardHat":
        return <HardHat size={size} color={color} />;
      case "Truck":
        return <Truck size={size} color={color} />;
      case "Zap":
        return <Zap size={size} color={color} />;
      case "Wrench":
        return <Wrench size={size} color={color} />;
      case "ShieldAlert":
        return <ShieldAlert size={size} color={color} />;
      default:
        return <ShieldCheck size={size} color={color} />;
    }
  };

  // KPIs
  const stats = useMemo(() => {
    const total = rules.length;
    const contractCount = rules.filter((r) => r.isContractRelevant).length;
    const sigeCount = rules.filter((r) => r.isSiGePlanRelevant).length;
    const urgentCount = rules.filter((r) => r.actionStatus === "DRINGEND").length;
    return { total, contractCount, sigeCount, urgentCount };
  }, [rules]);

  // Toggle single accordion
  const toggleChapter = (chapId: string) => {
    setCollapsedChapters((prev) => ({
      ...prev,
      [chapId]: !prev[chapId],
    }));
  };

  // Expand / Collapse all
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    INQA_CHAPTERS.forEach((c) => (allExpanded[c.id] = false));
    setCollapsedChapters(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    INQA_CHAPTERS.forEach((c) => (allCollapsed[c.id] = true));
    setCollapsedChapters(allCollapsed);
  };

  // Add rule handler
  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${params.id}/site-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formCategory,
          title: formTitle,
          praxisProblem: formPraxisProblem,
          content: formContent,
          isContractRelevant: formIsContract,
          isSiGePlanRelevant: formIsSiGe,
          actionStatus: formActionStatus,
          orderIndex: rules.length + 1,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setFormTitle("");
        setFormPraxisProblem("");
        setFormContent("");
        showToast("Regel erfolgreich zur Baustellenordnung hinzugefügt.");
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const handleOpenEdit = (rule: SiteRule) => {
    setEditingRule(rule);
    setFormCategory(mapCategoryToINQA(rule.category));
    setFormTitle(rule.title);
    setFormPraxisProblem(rule.praxisProblem || "");
    setFormContent(rule.content);
    setFormIsContract(Boolean(rule.isContractRelevant));
    setFormIsSiGe(Boolean(rule.isSiGePlanRelevant));
    setFormActionStatus(rule.actionStatus || "GEREGELT");
    setShowEditModal(true);
  };

  // Update rule handler
  const handleUpdateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule || !formTitle || !formContent) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${params.id}/site-rules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRule.id,
          category: formCategory,
          title: formTitle,
          praxisProblem: formPraxisProblem,
          content: formContent,
          isContractRelevant: formIsContract,
          isSiGePlanRelevant: formIsSiGe,
          actionStatus: formActionStatus,
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingRule(null);
        showToast("Regelung erfolgreich aktualisiert.");
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete rule
  const handleDeleteRule = async (ruleId: string, ruleTitle: string) => {
    if (!confirm(`Möchten Sie die Regelung "${ruleTitle}" wirklich löschen?`)) return;
    try {
      const res = await fetch(`/api/projects/${params.id}/site-rules?ruleId=${ruleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRules(rules.filter((r) => r.id !== ruleId));
        showToast("Regelung gelöscht.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Seed / Reset rules
  const handleSeedRules = async (reset: boolean) => {
    setIsSeeding(true);
    try {
      const res = await fetch(`/api/projects/${params.id}/site-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: reset ? "reset_inqa" : "seed_inqa",
        }),
      });

      if (res.ok) {
        setShowSeedModal(false);
        showToast(
          reset
            ? "Vollständige Musterbaustellenordnung (22 Unterthemen) geladen."
            : "Musterregeln wurden ergänzt."
        );
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const chapterId = mapCategoryToINQA(rule.category);
      const matchesChapter = selectedChapter === "ALL" || chapterId === selectedChapter;
      const matchesContract = !filterContractOnly || rule.isContractRelevant;
      const matchesSiGe = !filterSiGeOnly || rule.isSiGePlanRelevant;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        rule.title.toLowerCase().includes(query) ||
        rule.content.toLowerCase().includes(query) ||
        (rule.praxisProblem && rule.praxisProblem.toLowerCase().includes(query));

      return matchesChapter && matchesContract && matchesSiGe && matchesSearch;
    });
  }, [rules, selectedChapter, filterContractOnly, filterSiGeOnly, searchQuery]);

  const getRulesForChapter = (chapterId: string) => {
    return filteredRules.filter((r) => mapCategoryToINQA(r.category) === chapterId);
  };

  return (
    <div style={{ maxWidth: "1320px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--success-emerald)",
            padding: "12px 18px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13.5px",
          }}
        >
          <CheckCircle2 size={18} color="var(--success-emerald)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. Header (Screen Only) ─────────────────────────────────── */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 className="title-xl" style={{ margin: 0, fontSize: "1.6rem" }}>
              Baustellenordnung
            </h1>
            <span
              className="badge"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.12)",
                color: "var(--safety-amber)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                fontSize: "11.5px",
              }}
            >
              BaustellV &amp; § 8 ArbSchG (Zusammenarbeit)
            </span>
          </div>
          <p className="text-secondary" style={{ marginTop: "4px", fontSize: "13px", maxWidth: "840px" }}>
            Strukturierte Erstellung und Verwaltung der verbindlichen Baustellenordnung nach dem 7-Kapitel-Themenkatalog
            zur Vermeidung von Praxisproblemen, Koordination von Schnittstellen und Aushang auf der Baustelle.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setFormCategory(selectedChapter !== "ALL" ? selectedChapter : "KAPITEL_1_ALLGEMEIN");
              setFormTitle("");
              setFormPraxisProblem("");
              setFormContent("");
              setFormIsContract(true);
              setFormIsSiGe(true);
              setFormActionStatus("GEREGELT");
              setShowAddModal(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ padding: "7px 14px" }}
            title="Neues Unterthema / Regelung erfassen"
          >
            <Plus size={15} />
            <span>Regelung erfassen</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSeedModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ padding: "7px 14px" }}
            title="Standardkatalog laden (22 Unterthemen)"
          >
            <Sparkles size={15} color="var(--safety-amber)" />
            <span>Musterregeln (22 Themen)</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-outline btn-sm"
            style={{ padding: "7px 14px" }}
            title="Aushang für den Baucontainer drucken oder als PDF speichern"
          >
            <Printer size={15} />
            <span>Aushang drucken / PDF</span>
          </button>
        </div>
      </div>

      {/* ─── 2. KPI / Status Dashboard ────────────────────────────── */}
      <div
        className="no-print"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {/* KPI 1: Gesamt-Unterthemen */}
        <div
          className="card"
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--tech-blue)",
              flexShrink: 0,
            }}
          >
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Leitfaden-Unterthemen
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {stats.total}{" "}
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>/ 22 im Katalog</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Im Bauvertrag zu regeln */}
        <div
          className="card"
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--safety-amber)",
              flexShrink: 0,
            }}
          >
            <FileSignature size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Im Bauvertrag zu regeln
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {stats.contractCount}{" "}
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>Klauseln</span>
            </div>
          </div>
        </div>

        {/* KPI 3: SiGePlan-Verknüpfung */}
        <div
          className="card"
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--success-emerald)",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              SiGePlan-Hinweise
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {stats.sigeCount}{" "}
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>Koordinierungspunkte</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Handlungsbedarf */}
        <div
          className="card"
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: stats.urgentCount > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
              border: stats.urgentCount > 0 ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: stats.urgentCount > 0 ? "var(--hazard-red)" : "var(--success-emerald)",
              flexShrink: 0,
            }}
          >
            {stats.urgentCount > 0 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Handlungsbedarf
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {stats.urgentCount === 0 ? (
                <span style={{ color: "var(--success-emerald)" }}>Vollständig</span>
              ) : (
                <span style={{ color: "var(--hazard-red)" }}>{stats.urgentCount} dringend</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. Kompakte Notfallorganisation (Screen & Print) ─────── */}
      <div
        className="card"
        style={{
          padding: "14px 18px",
          marginBottom: "20px",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {/* 112 */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--hazard-red)", fontWeight: 700, textTransform: "uppercase" }}>
                Feuerwehr / Rettung:
              </span>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--hazard-red)", fontFamily: "var(--font-mono)" }}>
                112
              </span>
            </div>

            <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.12)" }} />

            {/* 110 */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--tech-blue)", fontWeight: 700, textTransform: "uppercase" }}>
                Polizei:
              </span>
              <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--tech-blue)", fontFamily: "var(--font-mono)" }}>
                110
              </span>
            </div>

            <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.12)" }} />

            {/* Lotsenpunkt */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--safety-amber)", fontWeight: 700, textTransform: "uppercase" }}>
                Lotsenpunkt:
              </span>
              <strong style={{ fontSize: "12.5px", color: "var(--text-primary)" }}>Tor 1 / Zufahrt Nord</strong>
            </div>

            <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.12)" }} />

            {/* SiGeKo */}
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              SiGeKo: <strong style={{ color: "var(--text-primary)" }}>{project?.coordinatorName || "SiGeKo gem. BaustellV"}</strong>
              {project?.coordinatorContact && ` (${project.coordinatorContact})`}
            </div>
          </div>

          <div className="no-print">
            <button
              type="button"
              onClick={() => setShowEmergencyDetails(!showEmergencyDetails)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: "11.5px", padding: "3px 8px" }}
            >
              {showEmergencyDetails ? "Weniger Details" : "Ersthelfer & Kontakte"}
            </button>
          </div>
        </div>

        {/* Aufklappbare Notfall-Details */}
        {showEmergencyDetails && (
          <div
            className="no-print"
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              fontSize: "12px",
            }}
          >
            <div>
              <span style={{ color: "var(--text-muted)" }}>Bauleitung vor Ort:</span>
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{project?.siteManager || "Zentrale Bauleitung"}</div>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Erste-Hilfe-Station:</span>
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Bauleitercontainer (Verbandkasten DIN 13157)</div>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Giftnotrufzentrale:</span>
              <div style={{ fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>030 / 19240</div>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Berufsgenossenschaft:</span>
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>BG BAU Notfallhotline: 0800 3799100</div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 4. Filterleiste & Ansichtswechsel ─────────────────────── */}
      <div className="no-print" style={{ marginBottom: "18px" }}>
        {/* Top Control Bar: Search & View Switcher */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Quick Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* View Mode Toggle */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-card)",
                padding: "3px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("CARDS")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: viewMode === "CARDS" ? "var(--bg-surface)" : "transparent",
                  color: viewMode === "CARDS" ? "var(--safety-amber)" : "var(--text-muted)",
                  fontWeight: viewMode === "CARDS" ? 700 : 500,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <SlidersHorizontal size={13} />
                <span>Kapitel-Karten</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("TABLE")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: viewMode === "TABLE" ? "var(--bg-surface)" : "transparent",
                  color: viewMode === "TABLE" ? "var(--safety-amber)" : "var(--text-muted)",
                  fontWeight: viewMode === "TABLE" ? 700 : 500,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <TableProperties size={13} />
                <span>Kompakte Matrix</span>
              </button>
            </div>

            {/* Filter Toggle: Nur Bauvertrag */}
            <button
              type="button"
              onClick={() => setFilterContractOnly(!filterContractOnly)}
              style={{
                padding: "6px 10px",
                borderRadius: "var(--radius-md)",
                border: filterContractOnly ? "1px solid var(--safety-amber)" : "1px solid var(--border)",
                background: filterContractOnly ? "rgba(245, 158, 11, 0.12)" : "var(--bg-card)",
                color: filterContractOnly ? "var(--safety-amber)" : "var(--text-secondary)",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FileSignature size={13} />
              <span>Nur Bauvertrag ({stats.contractCount})</span>
            </button>

            {/* Filter Toggle: Nur SiGePlan */}
            <button
              type="button"
              onClick={() => setFilterSiGeOnly(!filterSiGeOnly)}
              style={{
                padding: "6px 10px",
                borderRadius: "var(--radius-md)",
                border: filterSiGeOnly ? "1px solid var(--success-emerald)" : "1px solid var(--border)",
                background: filterSiGeOnly ? "rgba(16, 185, 129, 0.12)" : "var(--bg-card)",
                color: filterSiGeOnly ? "var(--success-emerald)" : "var(--text-secondary)",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ShieldCheck size={13} />
              <span>Nur SiGePlan ({stats.sigeCount})</span>
            </button>

            {/* Accordion Controls (in Cards Mode) */}
            {viewMode === "CARDS" && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={expandAll}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: "11px", padding: "4px 8px" }}
                >
                  Alle aufklappen
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: "11px", padding: "4px 8px" }}
                >
                  Alle einklappen
                </button>
              </div>
            )}
          </div>

          {/* Search Field */}
          <div style={{ position: "relative", minWidth: "260px" }}>
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
              placeholder="Thema, Praxisproblem oder Regel durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "32px", height: "34px", fontSize: "12.5px" }}
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
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 7 Chapter Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedChapter("ALL")}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-md)",
              border: selectedChapter === "ALL" ? "1px solid var(--safety-amber)" : "1px solid var(--border)",
              background: selectedChapter === "ALL" ? "var(--bg-card)" : "var(--bg-surface)",
              color: selectedChapter === "ALL" ? "var(--safety-amber)" : "var(--text-secondary)",
              fontWeight: selectedChapter === "ALL" ? 700 : 500,
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <FileText size={13} />
            <span>Alle Kapitel</span>
            <span
              style={{
                fontSize: "10.5px",
                padding: "1px 5px",
                borderRadius: "10px",
                background: selectedChapter === "ALL" ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.06)",
              }}
            >
              {rules.length}
            </span>
          </button>

          {INQA_CHAPTERS.map((chap) => {
            const count = rules.filter((r) => mapCategoryToINQA(r.category) === chap.id).length;
            const isSelected = selectedChapter === chap.id;

            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => setSelectedChapter(chap.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? `1px solid ${chap.color}` : "1px solid var(--border)",
                  background: isSelected ? "var(--bg-card)" : "var(--bg-surface)",
                  color: isSelected ? chap.color : "var(--text-secondary)",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                {renderChapterIcon(chap.iconName, 13, isSelected ? chap.color : "var(--text-muted)")}
                <span>{chap.shortTitle}</span>
                <span
                  style={{
                    fontSize: "10.5px",
                    padding: "1px 5px",
                    borderRadius: "10px",
                    background: isSelected ? `${chap.color}22` : "rgba(255, 255, 255, 0.06)",
                    color: isSelected ? chap.color : "var(--text-muted)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Printable Document Header (Print Only) ───────────────── */}
      <div
        className="print-only"
        style={{
          display: "none",
          borderBottom: "2px solid #111827",
          paddingBottom: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "10pt", fontWeight: 800, letterSpacing: "0.08em", color: "#b45309" }}>
              ARBEITSSCHUTZ &amp; SICHERHEIT GEMÄSS BAUSTELLV
            </div>
            <h1 style={{ fontSize: "17pt", fontWeight: 900, margin: "3px 0", color: "#111827" }}>
              BAUSTELLENORDNUNG
            </h1>
            <div style={{ fontSize: "9.5pt", color: "#374151" }}>
              Verbindliche Arbeitsschutz- und Verhaltensordnung für alle am Bau Beteiligten
            </div>
          </div>

          <div style={{ textAlign: "right", fontSize: "9pt", color: "#4b5563" }}>
            <div><strong>Projekt-Nr.:</strong> {project?.projectNumber || "-"}</div>
            <div><strong>Stand:</strong> {new Date().toLocaleDateString("de-DE")}</div>
            <div><strong>Gültig für:</strong> Alle Unternehmen &amp; Beschäftigten</div>
          </div>
        </div>

        {/* Metadata in Print */}
        <div
          style={{
            marginTop: "10px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            padding: "8px 12px",
            fontSize: "9pt",
          }}
        >
          <div>
            <span style={{ color: "#6b7280" }}>Bauvorhaben:</span>
            <div style={{ fontWeight: 700, color: "#111827" }}>{project?.name || "Baustelle"}</div>
            <div style={{ color: "#4b5563" }}>{project?.location}</div>
          </div>
          <div>
            <span style={{ color: "#6b7280" }}>Bauherr:</span>
            <div style={{ fontWeight: 700, color: "#111827" }}>{project?.clientName || "-"}</div>
            <div style={{ color: "#4b5563" }}>{project?.clientContact || ""}</div>
          </div>
          <div>
            <span style={{ color: "#6b7280" }}>SiGe-Koordination (RAB 30):</span>
            <div style={{ fontWeight: 700, color: "#111827" }}>{project?.coordinatorName || "-"}</div>
            <div style={{ color: "#4b5563" }}>Bauleitung: {project?.siteManager || "-"}</div>
          </div>
        </div>
      </div>

      {/* ─── 5. Content Views: CARDS vs TABLE ──────────────────────── */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Lade Baustellenordnung...
        </div>
      ) : rules.length === 0 ? (
        /* Empty State */
        <div
          className="card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "var(--bg-surface)",
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(245, 158, 11, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <BookOpen size={28} color="var(--safety-amber)" />
          </div>
          <h3 className="title-md" style={{ marginBottom: "8px" }}>
            Noch keine Baustellenordnung hinterlegt
          </h3>
          <p className="text-secondary" style={{ maxWidth: "560px", margin: "0 auto 20px", fontSize: "13.5px" }}>
            Übernehmen Sie mit einem Klick den offiziellen <strong>Standard-Musterkatalog</strong>{" "}
            (22 praxisbewährte Unterthemen mit Praxisproblemen und Lösungen) oder legen Sie eigene Regelungen an.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleSeedRules(true)}
              className="btn btn-primary"
              disabled={isSeeding}
            >
              <Sparkles size={16} />
              <span>{isSeeding ? "Wird geladen..." : "Musterregeln einspielen (22 Themen)"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn btn-outline"
            >
              <Plus size={16} />
              <span>Eigene Regel anlegen</span>
            </button>
          </div>
        </div>
      ) : viewMode === "TABLE" ? (
        /* ─── Kompakte Matrix-Tabelle (Leitfaden-Prüfliste) ────────── */
        <div
          className="card"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-secondary)", width: "18%" }}>
                    Thema / Unterthema
                  </th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-secondary)", width: "30%" }}>
                    Praxisproblem (Warum diese Regel?)
                  </th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-secondary)", width: "32%" }}>
                    Verbindliche Regelung &amp; Lösung
                  </th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-secondary)", width: "10%", textAlign: "center" }}>
                    Kennzeichnung
                  </th>
                  <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-secondary)", width: "10%", textAlign: "right" }}>
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule, idx) => {
                  const chap = getChapterMeta(rule.category);
                  return (
                    <tr
                      key={rule.id}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                      }}
                    >
                      <td style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-mono)",
                              padding: "1px 5px",
                              borderRadius: "4px",
                              background: `${chap.color}18`,
                              color: chap.color,
                              fontWeight: 700,
                            }}
                          >
                            Kap. {chap.number}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{rule.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {chap.legalReference}
                        </div>
                      </td>

                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: "var(--safety-amber)", fontSize: "12px" }}>
                        {rule.praxisProblem ? (
                          <div style={{ background: "rgba(245, 158, 11, 0.06)", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(245, 158, 11, 0.18)" }}>
                            {rule.praxisProblem}
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Kein Praxisproblem hinterlegt</span>
                        )}
                      </td>

                      <td style={{ padding: "12px 14px", verticalAlign: "top", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {rule.content}
                      </td>

                      <td style={{ padding: "12px 14px", verticalAlign: "top", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                          {rule.isContractRelevant && (
                            <span
                              className="badge"
                              style={{
                                fontSize: "10px",
                                padding: "2px 6px",
                                background: "rgba(245, 158, 11, 0.12)",
                                color: "var(--safety-amber)",
                                border: "1px solid rgba(245, 158, 11, 0.3)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Bauvertrag
                            </span>
                          )}
                          {rule.isSiGePlanRelevant && (
                            <span
                              className="badge"
                              style={{
                                fontSize: "10px",
                                padding: "2px 6px",
                                background: "rgba(16, 185, 129, 0.12)",
                                color: "var(--success-emerald)",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              SiGePlan
                            </span>
                          )}
                          {!rule.isContractRelevant && !rule.isSiGePlanRelevant && (
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>–</span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: "12px 14px", verticalAlign: "top", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rule)}
                            className="btn btn-outline btn-sm"
                            title="Regelung bearbeiten"
                            style={{ padding: "2px 6px" }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRule(rule.id, rule.title)}
                            className="btn btn-outline btn-sm"
                            title="Regelung löschen"
                            style={{ padding: "2px 6px", color: "var(--hazard-red)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ─── Strukturierte Kapitelkarten mit Akkordeon ───────────── */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {INQA_CHAPTERS.filter((chap) => selectedChapter === "ALL" || selectedChapter === chap.id).map(
            (chap) => {
              const chapterRules = getRulesForChapter(chap.id);
              const isCollapsed = Boolean(collapsedChapters[chap.id]);

              if (searchQuery.trim() !== "" && chapterRules.length === 0) {
                return null;
              }

              return (
                <div
                  key={chap.id}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {/* Kapitel-Kopfzeile (Klickbar zum Auf-/Zuklappen) */}
                  <div
                    onClick={() => toggleChapter(chap.id)}
                    style={{
                      padding: "14px 18px",
                      background: "var(--bg-card)",
                      borderBottom: isCollapsed ? "none" : "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "7px",
                          background: `${chap.color}18`,
                          border: `1px solid ${chap.color}44`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {renderChapterIcon(chap.iconName, 16, chap.color)}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <h2
                            style={{
                              fontSize: "14.5px",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              margin: 0,
                            }}
                          >
                            {chap.title}
                          </h2>
                          <span
                            style={{
                              fontSize: "10.5px",
                              fontFamily: "var(--font-mono)",
                              padding: "2px 7px",
                              borderRadius: "4px",
                              background: "rgba(255, 255, 255, 0.05)",
                              color: "var(--text-secondary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {chap.legalReference}
                          </span>
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {chap.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="badge badge-neutral" style={{ fontSize: "11px", padding: "3px 8px" }}>
                        {chapterRules.length} {chapterRules.length === 1 ? "Thema" : "Themen"}
                      </span>

                      <div className="no-print" style={{ color: "var(--text-muted)" }}>
                        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Kapitel-Regeln (wenn nicht eingeklappt) */}
                  {!isCollapsed && (
                    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {chapterRules.length === 0 ? (
                        <div
                          style={{
                            padding: "20px",
                            textAlign: "center",
                            color: "var(--text-muted)",
                            fontSize: "12.5px",
                          }}
                        >
                          Keine spezifischen Regelungen für dieses Kapitel hinterlegt.
                        </div>
                      ) : (
                        chapterRules.map((rule, idx) => (
                          <div
                            key={rule.id}
                            style={{
                              padding: "14px 16px",
                              background: "var(--bg-canvas)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-md)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              transition: "border-color 0.15s ease",
                            }}
                          >
                            {/* Card Top: § / Title / Badges / Actions */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 700,
                                    color: chap.color,
                                    background: `${chap.color}15`,
                                    padding: "2px 7px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  § {chap.number}.{idx + 1}
                                </span>

                                <h3
                                  style={{
                                    fontSize: "13.5px",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    margin: 0,
                                  }}
                                >
                                  {rule.title}
                                </h3>

                                {/* Badges */}
                                {rule.isContractRelevant && (
                                  <span
                                    className="badge"
                                    style={{
                                      fontSize: "10px",
                                      padding: "2px 6px",
                                      background: "rgba(245, 158, 11, 0.12)",
                                      color: "var(--safety-amber)",
                                      border: "1px solid rgba(245, 158, 11, 0.3)",
                                    }}
                                  >
                                    📜 Im Bauvertrag
                                  </span>
                                )}

                                {rule.isSiGePlanRelevant && (
                                  <span
                                    className="badge"
                                    style={{
                                      fontSize: "10px",
                                      padding: "2px 6px",
                                      background: "rgba(16, 185, 129, 0.12)",
                                      color: "var(--success-emerald)",
                                      border: "1px solid rgba(16, 185, 129, 0.3)",
                                    }}
                                  >
                                    ⚠️ SiGePlan-Hinweis
                                  </span>
                                )}
                              </div>

                              {/* Card Actions (Screen Only) */}
                              <div className="no-print" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(rule)}
                                  className="btn btn-outline btn-sm"
                                  title="Bearbeiten"
                                  style={{ padding: "3px 8px", fontSize: "11.5px" }}
                                >
                                  <Edit3 size={12} />
                                  <span>Bearbeiten</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRule(rule.id, rule.title)}
                                  className="btn btn-outline btn-sm"
                                  title="Löschen"
                                  style={{
                                    padding: "3px 6px",
                                    color: "var(--hazard-red)",
                                    borderColor: "rgba(239, 68, 68, 0.3)",
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Praxisproblem (Warning box) */}
                            {rule.praxisProblem && (
                              <div
                                style={{
                                  padding: "8px 12px",
                                  background: "rgba(245, 158, 11, 0.05)",
                                  borderLeft: "3px solid var(--safety-amber)",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  color: "var(--safety-amber)",
                                  lineHeight: 1.45,
                                }}
                              >
                                <strong>Praxisproblem laut Leitfaden:</strong> {rule.praxisProblem}
                              </div>
                            )}

                            {/* Verbindliche Regelung */}
                            <div
                              style={{
                                fontSize: "12.5px",
                                color: "var(--text-secondary)",
                                lineHeight: "1.55",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {rule.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}

      {/* ─── 6. Unterschriftenzeile für DIN A4 Aushang (Print Only) ── */}
      <div
        className="print-only"
        style={{
          display: "none",
          marginTop: "24px",
          pageBreakInside: "avoid",
          borderTop: "2px solid #374151",
          paddingTop: "14px",
        }}
      >
        <div style={{ fontSize: "10pt", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>
          Kenntnisnahme &amp; Verpflichtungserklärung der bauausführenden Unternehmen
        </div>
        <div style={{ fontSize: "8.5pt", color: "#4b5563", marginBottom: "16px", lineHeight: 1.4 }}>
          Die unterzeichnenden Auftragnehmer und deren Nachunternehmer bestätigen den Erhalt dieser Baustellenordnung.
          Sie verpflichten sich gemäß § 8 ArbSchG und BaustellV § 4, deren Einhaltung durch alle eingesetzten Mitarbeiter
          und Nachunternehmer sicherzustellen.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <div style={{ borderTop: "1px solid #9ca3af", paddingTop: "6px", fontSize: "8.5pt" }}>
            <div style={{ color: "#6b7280" }}>Ort, Datum</div>
            <div style={{ fontWeight: 700, marginTop: "24px", color: "#111827" }}>
              Bauherr / Bevollmächtigte Bauleitung
            </div>
            <div style={{ fontSize: "7.5pt", color: "#6b7280" }}>(Unterschrift &amp; Stempel)</div>
          </div>

          <div style={{ borderTop: "1px solid #9ca3af", paddingTop: "6px", fontSize: "8.5pt" }}>
            <div style={{ color: "#6b7280" }}>Ort, Datum</div>
            <div style={{ fontWeight: 700, marginTop: "24px", color: "#111827" }}>
              SiGe-Koordinator (gem. BaustellV)
            </div>
            <div style={{ fontSize: "7.5pt", color: "#6b7280" }}>{project?.coordinatorName || "SiGeKo"}</div>
          </div>

          <div style={{ borderTop: "1px solid #9ca3af", paddingTop: "6px", fontSize: "8.5pt" }}>
            <div style={{ color: "#6b7280" }}>Ort, Datum</div>
            <div style={{ fontWeight: 700, marginTop: "24px", color: "#111827" }}>
              Auftragnehmer / Nachunternehmer
            </div>
            <div style={{ fontSize: "7.5pt", color: "#6b7280" }}>(Firma, Name Bauleiter, Unterschrift)</div>
          </div>
        </div>
      </div>

      {/* ─── Modal: Regelung erfassen ──────────────────────────────── */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "640px" }}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Plus size={18} color="var(--safety-amber)" />
                <h3 className="title-md" style={{ margin: 0 }}>
                  Neues Unterthema / Regelung erfassen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRule}>
              <div className="form-group">
                <label className="form-label">Themenkapitel *</label>
                <select
                  className="form-select"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {INQA_CHAPTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.legalReference})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {getChapterMeta(formCategory).description}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Unterthema / Titel der Regelung *</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. 4.2 Einweiserpflicht beim Rückwärtsfahren von Großfahrzeugen"
                  className="form-input"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Praxisproblem laut Leitfaden (Warum diese Regel nötig ist)</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  placeholder="z.B. Schwere Anfahrunfälle beim Rangieren im Baustellenverkehr durch fehlenden Sichtkontakt..."
                  value={formPraxisProblem}
                  onChange={(e) => setFormPraxisProblem(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Verbindliche Regelung &amp; Lösungsvorschlag *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Konkrete, verbindliche Handlungsanweisung für alle Unternehmen und Beschäftigten..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                />
              </div>

              {/* Kennzeichnung Checkboxen */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  padding: "10px 14px",
                  background: "var(--bg-canvas)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formIsContract}
                    onChange={(e) => setFormIsContract(e.target.checked)}
                  />
                  <span>📜 Im Bauvertrag regeln (Ausschreibungsrelevant)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formIsSiGe}
                    onChange={(e) => setFormIsSiGe(e.target.checked)}
                  />
                  <span>⚠️ Koordinierungshinweis gem. SiGePlan</span>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Wird gespeichert..." : "Regelung speichern"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Regelung bearbeiten ────────────────────────────── */}
      {showEditModal && editingRule && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "640px" }}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit3 size={18} color="var(--tech-blue)" />
                <h3 className="title-md" style={{ margin: 0 }}>
                  Regelung bearbeiten
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateRule}>
              <div className="form-group">
                <label className="form-label">Themenkapitel *</label>
                <select
                  className="form-select"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {INQA_CHAPTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.legalReference})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {getChapterMeta(formCategory).description}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Unterthema / Titel der Regelung *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Praxisproblem laut Leitfaden (Warum diese Regel nötig ist)</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={formPraxisProblem}
                  onChange={(e) => setFormPraxisProblem(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Verbindliche Regelung &amp; Lösungsvorschlag *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                />
              </div>

              {/* Kennzeichnung Checkboxen */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  padding: "10px 14px",
                  background: "var(--bg-canvas)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formIsContract}
                    onChange={(e) => setFormIsContract(e.target.checked)}
                  />
                  <span>📜 Im Bauvertrag regeln</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formIsSiGe}
                    onChange={(e) => setFormIsSiGe(e.target.checked)}
                  />
                  <span>⚠️ Koordinierungshinweis gem. SiGePlan</span>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Wird gespeichert..." : "Änderungen speichern"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: INQA Musterregeln einspielen (22 Themen) ───────── */}
      {showSeedModal && (
        <div className="modal-overlay" onClick={() => setShowSeedModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "580px" }}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={18} color="var(--safety-amber)" />
                <h3 className="title-md" style={{ margin: 0 }}>
                  Standard-Musterkatalog laden
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSeedModal(false)}
                className="btn btn-outline btn-sm"
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "18px" }}>
              <p style={{ marginBottom: "12px" }}>
                Möchten Sie den vollständigen Standardkatalog für die Baustellenordnung (22 praxisbewährte Unterthemen) laden?
              </p>
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--bg-canvas)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "14px",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                  Umfasst alle 22 praxisbewährten Unterthemen aus den 7 Kapiteln:
                </div>
                <ul style={{ paddingLeft: "18px", color: "var(--text-muted)", margin: 0 }}>
                  <li>1. Geltungsbereich, Projektorganisation &amp; BaustellV-Koordination</li>
                  <li>2. Notrufkette 112/110, Lotsenpunkt Tor 1, Ersthelfer &amp; Heißarbeiten-Freigabe</li>
                  <li>3. Betriebszeiten, Logistik, Nachunternehmer, Ausweise, PSA-Pflicht &amp; Verbote</li>
                  <li>4. Zufahrtsregelung, Schrittgeschwindigkeit (10 km/h), Trennung Fuß/Fahr &amp; Einweiser</li>
                  <li>5. Baustrom nach DGUV V3 mit RCD 30 mA, Trinkwasser, Abfalltrennung nach GewAbfV</li>
                  <li>6. Erdbaumaschinen-Sichtkontakt, Gerüstfreigabe &amp; Umbauverbot, Krane &amp; Anschläger</li>
                  <li>7. Dreiteiliger Seitenschutz ab 2 m, Schachtabdeckungen &amp; Wiederherstellungspflicht</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                borderTop: "1px solid var(--border)",
                paddingTop: "16px",
              }}
            >
              <button
                type="button"
                onClick={() => handleSeedRules(true)}
                disabled={isSeeding}
                className="btn btn-primary"
                style={{ justifyContent: "center" }}
              >
                <RotateCcw size={15} />
                <span>Vollständiger Reset auf 22 Standard-Themen</span>
              </button>

              <button
                type="button"
                onClick={() => handleSeedRules(false)}
                disabled={isSeeding}
                className="btn btn-outline"
                style={{ justifyContent: "center" }}
              >
                <Plus size={15} />
                <span>Musterregeln zu bestehenden Regeln hinzufügen</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSeedModal(false)}
                className="btn btn-secondary"
                style={{ justifyContent: "center", marginTop: "4px" }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
