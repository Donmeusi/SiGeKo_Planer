"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Users, Plus, Phone, Mail, Calendar, Trash2, Building, HardHat } from "lucide-react";

interface Contractor {
  id: string;
  projectId: string;
  companyName: string;
  trade: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  workerCount: number;
  startDate: string | null;
  endDate: string | null;
  isSubcontractor: boolean;
  mainContractor: string | null;
}

export default function ContractorsPage() {
  const params = useParams<{ id: string }>();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [trade, setTrade] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [workerCount, setWorkerCount] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubcontractor, setIsSubcontractor] = useState(false);
  const [mainContractor, setMainContractor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.contractors) {
          setContractors(data.contractors);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleAddContractor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !trade) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${params.id}/contractors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          trade,
          contactPerson: contactPerson || null,
          phone: phone || null,
          email: email || null,
          workerCount,
          startDate: startDate || null,
          endDate: endDate || null,
          isSubcontractor,
          mainContractor: mainContractor || null,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setCompanyName("");
        setTrade("");
        setContactPerson("");
        setPhone("");
        setEmail("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Unternehmen wirklich aus dem Projekt entfernen?")) return;
    try {
      const res = await fetch(`/api/projects/${params.id}/contractors?contractorId=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setContractors(contractors.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalWorkers = contractors.reduce((sum, c) => sum + c.workerCount, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className="title-xl">Beteiligte Gewerke &amp; Unternehmen</h2>
            <span className="badge badge-amber">{contractors.length} Firmen</span>
          </div>
          <p className="text-secondary" style={{ marginTop: "4px" }}>
            Verzeichnis aller beauftragten Arbeitgeber, Nachunternehmer und deren Beschäftigtenstärken für die Baustellenkoordination.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Unternehmen hinzufügen</span>
        </button>
      </div>

      {/* Info Stats */}
      <div className="stats-grid" style={{ marginBottom: "20px" }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Building size={22} />
          </div>
          <div>
            <div className="stat-value">{contractors.length}</div>
            <div className="stat-label">Beauftragte Unternehmen</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <HardHat size={22} />
          </div>
          <div>
            <div className="stat-value">~{totalWorkers}</div>
            <div className="stat-label">Beschäftigte gesamt</div>
          </div>
        </div>
      </div>

      {/* Tabelle */}
      <div className="table-scroll-hint no-print">
        ← Tabelle seitlich wischen / scrollen →
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Firma / Auftragnehmer</th>
              <th style={{ width: "20%" }}>Gewerk / Tätigkeitsbereich</th>
              <th style={{ width: "20%" }}>Ansprechpartner &amp; Kontakt</th>
              <th style={{ width: "10%" }}>Mitarbeiter</th>
              <th style={{ width: "20%" }}>Einsatzzeitraum</th>
              <th style={{ width: "5%", textAlign: "center" }}>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {contractors.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  Noch keine Unternehmen erfasst. Fügen Sie die beauftragten Firmen hinzu.
                </td>
              </tr>
            ) : (
              contractors.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{c.companyName}</div>
                    {c.isSubcontractor && (
                      <div style={{ fontSize: "11px", color: "var(--safety-amber)", marginTop: "2px" }}>
                        Nachunternehmer von: {c.mainContractor || "Generalunternehmer"}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-blue">{c.trade}</span>
                  </td>
                  <td>
                    {c.contactPerson && <div style={{ fontWeight: 500 }}>{c.contactPerson}</div>}
                    {c.phone && (
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <Phone size={12} /> {c.phone}
                      </div>
                    )}
                    {c.email && (
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Mail size={12} /> {c.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{c.workerCount}</span> Pers.
                  </td>
                  <td>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      {c.startDate ? new Date(c.startDate).toLocaleDateString("de-DE") : "Beginn"} –{" "}
                      {c.endDate ? new Date(c.endDate).toLocaleDateString("de-DE") : "Ende"}
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: "var(--hazard-red)", padding: "4px 6px" }}
                      title="Firma löschen"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Neues Gewerk */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="title-md">Unternehmen / Gewerk erfassen</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <form onSubmit={handleAddContractor}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Firmenname *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Nordbau Generalbau AG"
                    className="form-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gewerk / Gewerkegruppe *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Rohbau, Gerüstbau, Dach"
                    className="form-input"
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Ansprechpartner / Bauleiter vor Ort</label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="form-input"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Geschätzte Mitarbeiterzahl</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input font-mono"
                    value={workerCount}
                    onChange={(e) => setWorkerCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Telefonnummer</label>
                  <input
                    type="text"
                    placeholder="0171-..."
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">E-Mail</label>
                  <input
                    type="email"
                    placeholder="kontakt@firma.de"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Einsatzbeginn</label>
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Voraussichtliches Einsatzende</label>
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: "10px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    style={{ width: "16px", height: "16px", accentColor: "var(--safety-amber)" }}
                    checked={isSubcontractor}
                    onChange={(e) => setIsSubcontractor(e.target.checked)}
                  />
                  <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                    Es handelt sich um einen Nachunternehmer (Subunternehmen)
                  </span>
                </label>
              </div>

              {isSubcontractor && (
                <div className="form-group">
                  <label className="form-label">Hauptauftragnehmer (Nachunternehmer von:)</label>
                  <input
                    type="text"
                    placeholder="Name des beauftragenden Hauptunternehmens"
                    className="form-input"
                    value={mainContractor}
                    onChange={(e) => setMainContractor(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Abbrechen
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? "Wird gespeichert..." : "Unternehmen anlegen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
