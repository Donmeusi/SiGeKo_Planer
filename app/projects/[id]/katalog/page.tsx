"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Plus,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface CatalogItem {
  id: string;
  tradeCategory: string;
  activity: string;
  hazard: string;
  protectiveMeasure: string;
  isAnnex2: boolean;
  regulations: string | null;
}

export default function CatalogPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [transferringId, setTransferringId] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const loadItems = () => {
    setLoading(true);
    fetch("/api/catalog/hazards")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSeedCatalog = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/catalog/hazards", { method: "POST" });
      const data = await res.json();
      if (Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        loadItems();
      }
    } catch (e) {
      console.error("Failed to seed catalog", e);
    } finally {
      setSeeding(false);
    }
  };

  const categories = [
    "ALL",
    "Baustelleneinrichtung",
    "Erdarbeiten & Tiefbau",
    "Rohbau & Betonarbeiten",
    "Gerüstbau",
    "Dach & Fassade",
    "Ausbau & TGA",
    "Spezialarbeiten (Anhang II)",
  ];

  const filteredItems = items.filter((item) => {
    const matchCategory = selectedCategory === "ALL" || item.tradeCategory === selectedCategory;
    const matchSearch =
      !search ||
      item.activity.toLowerCase().includes(search.toLowerCase()) ||
      item.hazard.toLowerCase().includes(search.toLowerCase()) ||
      item.protectiveMeasure.toLowerCase().includes(search.toLowerCase()) ||
      (item.regulations && item.regulations.toLowerCase().includes(search.toLowerCase()));

    return matchCategory && matchSearch;
  });

  const handleTransferToSiGePlan = async (item: CatalogItem) => {
    setTransferringId(item.id);
    try {
      const res = await fetch(`/api/projects/${params.id}/sige-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: item.tradeCategory.includes("Tiefbau")
            ? "1. Baustelleneinrichtung & Erdarbeiten"
            : item.tradeCategory.includes("Rohbau")
            ? "2. Rohbauarbeiten"
            : item.tradeCategory.includes("Gerüst")
            ? "3. Fassade & Gerüstbau"
            : item.tradeCategory.includes("Dach")
            ? "4. Dachabdichtung"
            : "5. Ausbau & Haustechnik",
          trade: item.tradeCategory,
          activity: item.activity,
          hazards: item.hazard,
          isAnnex2SpecialHazard: item.isAnnex2,
          commonMeasures: item.protectiveMeasure,
          regulations: item.regulations,
          priority: item.isAnnex2 ? "HOCH" : "NORMAL",
        }),
      });

      if (res.ok) {
        setTransferSuccess(item.id);
        setTimeout(() => setTransferSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTransferringId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="title-xl">Standard-Gefährdungskatalog</h2>
            <span className="badge badge-amber">ASR, DGUV &amp; BaustellV</span>
          </div>
          <p className="text-secondary" style={{ marginTop: "4px" }}>
            Rechtssichere Bausteine für Gefährdungen, Kollektivschutzmaßnahmen und gesetzliche Regelwerke mit 1-Klick-Übernahme in den SiGe-Plan.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleSeedCatalog}
            disabled={seeding}
            className="btn btn-secondary"
            title="Standard-Katalog mit über 20 Gefährdungen und ASR/DGUV-Maßnahmen initialisieren"
          >
            <Sparkles size={14} color="var(--safety-amber)" className={seeding ? "animate-spin" : ""} />
            <span>{seeding ? "Wird geladen..." : "Standard-Katalog laden"}</span>
          </button>

          <button
            onClick={() => router.push(`/projects/${params.id}/sige-plan`)}
            className="btn btn-primary"
          >
            <span>Zum aktuellen SiGe-Plan</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Suche */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "36px" }}
              placeholder="Gefahr, Tätigkeit, DIN-Norm, DGUV oder ASR durchsuchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {loading ? "Lade..." : `${filteredItems.length} Vorlagen verfügbar`}
          </div>
        </div>

        {/* Kategorien-Pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
            >
              {cat === "ALL" ? "Alle Kategorien" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Katalog-Grid */}
      {loading ? (
        <div className="card text-center" style={{ padding: "48px 24px" }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 12px auto", color: "var(--brand-primary)" }} />
          <p className="text-secondary">Lade Gefährdungskataloge...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card text-center" style={{ padding: "48px 24px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--bg-input)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <BookOpen size={26} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
            {items.length === 0 ? "Keine Gefährdungskataloge in der Datenbank" : "Keine Einträge gefunden"}
          </h3>
          <p className="text-secondary" style={{ maxWidth: "480px", margin: "0 auto 20px auto", fontSize: "13px", lineHeight: "1.5" }}>
            {items.length === 0
              ? "Auf diesem Server sind noch keine Gefährdungsbausteine vorhanden. Klicken Sie auf den Button, um alle über 20 Standard-Gefährdungen (nach ASR, DGUV & BaustellV Anhang II) direkt zu laden."
              : "Für Ihre aktuellen Such- und Filterkriterien gibt es keine Treffer. Bitte Filter zurücksetzen oder Suchbegriff anpassen."}
          </p>
          {items.length === 0 ? (
            <button
              onClick={handleSeedCatalog}
              disabled={seeding}
              className="btn btn-primary"
              style={{ margin: "0 auto" }}
            >
              <Sparkles size={15} />
              <span>{seeding ? "Initialisiere Standard-Katalog..." : "Jetzt 20+ Standard-Gefährdungen einladen"}</span>
            </button>
          ) : (
            <button
              onClick={() => { setSelectedCategory("ALL"); setSearch(""); }}
              className="btn btn-secondary"
              style={{ margin: "0 auto" }}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderLeft: item.isAnnex2 ? "4px solid var(--hazard-red)" : "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span className="badge badge-blue">{item.tradeCategory}</span>
                  {item.isAnnex2 && (
                    <span className="badge badge-annex2">
                      Anhang II BaustellV
                    </span>
                  )}
                </div>

                <h3 style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--text-primary)", marginBottom: "8px" }}>
                  {item.activity}
                </h3>

                <div style={{ fontSize: "12.5px", color: "var(--hazard-red)", marginBottom: "8px", lineHeight: "1.45" }}>
                  <strong>Gefährdung:</strong> {item.hazard}
                </div>

                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.5" }}>
                  <strong>Schutzmaßnahme:</strong> {item.protectiveMeasure}
                </div>

                {item.regulations && (
                  <div
                    style={{
                      padding: "6px 8px",
                      background: "var(--bg-input)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "11px",
                      color: "var(--safety-amber)",
                      fontFamily: "var(--font-mono)",
                      marginBottom: "12px",
                    }}
                  >
                    Regelwerk: {item.regulations}
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                {transferSuccess === item.id ? (
                  <div style={{ color: "var(--success-emerald)", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <CheckCircle2 size={15} />
                    <span>In SiGe-Plan übernommen!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTransferToSiGePlan(item)}
                    disabled={transferringId === item.id}
                    className="btn btn-outline btn-sm"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Plus size={14} />
                    <span>{transferringId === item.id ? "Wird übertragen..." : "In Projekt-SiGe-Plan übernehmen"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
