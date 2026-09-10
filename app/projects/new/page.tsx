"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, ArrowLeft, Save, HardHat } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [projectNumber, setProjectNumber] = useState(
    `SIGE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("Dipl.-Ing. SiGe-Koordinator");
  const [coordinatorCert, setCoordinatorCert] = useState(
    "Zertifiziert nach RAB 30 Anlagen B & C"
  );
  const [siteManager, setSiteManager] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !clientName || !coordinatorName) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          projectNumber,
          location,
          description,
          clientName,
          clientAddress,
          coordinatorName,
          coordinatorCert,
          siteManager,
          status: "PLANUNG",
        }),
      });

      const data = await res.json();
      if (data?.id) {
        router.push(`/projects/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" className="btn btn-outline btn-sm" style={{ display: "inline-flex", gap: "6px" }}>
          <ArrowLeft size={14} />
          <span>Zurück zur Übersicht</span>
        </Link>
      </div>

      <div className="card" style={{ padding: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f59e0b, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b0f19",
            }}
          >
            <Building size={24} />
          </div>
          <div>
            <h1 className="title-lg">Neues Bauvorhaben erfassen</h1>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              Stammdaten gem. Baustellenverordnung (BaustellV) und RAB 30
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Bezeichnung des Bauvorhabens *</label>
            <input
              type="text"
              required
              placeholder="z.B. Neubau Wohn- und Geschäftshaus Am Stadtpark"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Projektnummer / Aktenzeichen</label>
              <input
                type="text"
                className="form-input font-mono"
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Baustellenadresse (Standort) *</label>
              <input
                type="text"
                required
                placeholder="Straße, Hausnummer, PLZ, Ort"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Art des Bauvorhabens / Beschreibung</label>
            <textarea
              className="form-textarea"
              placeholder="z.B. 4-geschossiger Massivbau mit Tiefgarage, 24 WE..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Bauherr (Auftraggeber) *</label>
              <input
                type="text"
                required
                placeholder="Name oder Firma des Bauherrn"
                className="form-input"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Anschrift des Bauherrn</label>
              <input
                type="text"
                placeholder="Straße, PLZ, Ort"
                className="form-input"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">SiGe-Koordinator (gem. RAB 30) *</label>
              <input
                type="text"
                required
                className="form-input"
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Qualifikationsnachweis des Koordinators</label>
              <input
                type="text"
                className="form-input"
                value={coordinatorCert}
                onChange={(e) => setCoordinatorCert(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Verantwortlicher Bauleiter / Planer</label>
            <input
              type="text"
              placeholder="Name des Bauleiters"
              className="form-input"
              value={siteManager}
              onChange={(e) => setSiteManager(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn btn-secondary"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{isSubmitting ? "Wird angelegt..." : "Projekt anlegen & starten"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
