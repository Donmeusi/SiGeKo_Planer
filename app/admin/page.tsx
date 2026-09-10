"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Key,
  CheckCircle,
  AlertCircle,
  XCircle,
  CloudDownload,
  GitBranch,
  Terminal,
  RefreshCw,
  UserCheck,
  UserX,
  HardHat,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */
interface AdminUser {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface CurrentSession {
  id: string;
  username: string;
  name: string | null;
  role: string;
}

type ModalMode = "create" | "edit" | "changePassword" | "delete" | null;

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  SIGEKO: "SiGeKo-Planer",
  LESER: "Lesezugriff",
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
  SIGEKO: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
  LESER: { bg: "rgba(100,116,139,0.15)", color: "#94a3b8" },
};

/* ─── Small helper: Toast ────────────────────────────────────── */
function Toast({ msg, type }: { msg: string; type: "success" | "error" | "" }) {
  if (!msg) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 10000,
        padding: "12px 20px",
        borderRadius: "10px",
        background: type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${type === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
        color: type === "success" ? "#22c55e" : "#ef4444",
        fontSize: "13px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
        maxWidth: "360px",
      }}
    >
      {type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
      {msg}
    </div>
  );
}

/* ─── Main page component ────────────────────────────────────── */
export default function AdminPage() {
  const [session, setSession] = useState<CurrentSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "system">("users");

  const router = useRouter();

  // Check session on mount
  useEffect(() => {
    fetch("/api/admin/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) setSession(d.user);
        setSessionLoading(false);
      })
      .catch(() => setSessionLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (sessionLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          color: "var(--text-muted)",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <RefreshCw size={24} style={{ animation: "spin 1s linear infinite" }} />
        <span>Sitzung wird überprüft…</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text-muted)" }}>
        <RefreshCw size={20} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 20px" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "28px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f59e0b, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(245,158,11,0.3)",
            }}
          >
            <Shield size={22} color="#0b0f19" />
          </div>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Admin & System
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "3px 0 0" }}>
              Angemeldet als{" "}
              <strong style={{ color: "var(--text-secondary)" }}>
                {session.name || session.username}
              </strong>{" "}
              •{" "}
              <span
                style={{
                  ...ROLE_COLORS[session.role],
                  padding: "1px 7px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {ROLE_LABELS[session.role] || session.role}
              </span>
            </p>
          </div>
        </div>
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--bg-surface)",
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <LogOut size={15} />
          Abmelden
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          background: "var(--bg-surface)",
          padding: "4px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          width: "fit-content",
        }}
      >
        {([
          { key: "users", label: "Benutzerverwaltung", icon: Users },
          { key: "system", label: "System & Updates", icon: CloudDownload },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`admin-tab-${key}`}
            onClick={() => setActiveTab(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "7px",
              border: "none",
              background:
                activeTab === key
                  ? "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(234,88,12,0.15))"
                  : "transparent",
              color: activeTab === key ? "var(--safety-amber, #f59e0b)" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: activeTab === key ? 700 : 500,
              cursor: "pointer",
              borderBottom: activeTab === key ? "2px solid var(--safety-amber, #f59e0b)" : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "users" && <UserManagementPanel currentUserId={session.id} />}
      {activeTab === "system" && <SystemUpdatePanel />}
    </div>
  );
}

/* ─── User Management Panel ──────────────────────────────────── */
function UserManagementPanel({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "" }>({ msg: "", type: "" });

  // Form state
  const [fUsername, setFUsername] = useState("");
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [fConfirm, setFConfirm] = useState("");
  const [fRole, setFRole] = useState("SIGEKO");
  const [fActive, setFActive] = useState(true);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const closeModal = () => {
    setModal(null); setSelected(null);
    setFUsername(""); setFName(""); setFEmail(""); setFPassword(""); setFConfirm("");
    setFRole("SIGEKO"); setFActive(true); setFormError("");
  };

  const openCreate = () => { closeModal(); setModal("create"); };
  const openEdit = (u: AdminUser) => {
    closeModal(); setSelected(u);
    setFUsername(u.username); setFName(u.name || ""); setFEmail(u.email || "");
    setFRole(u.role); setFActive(u.isActive);
    setModal("edit");
  };
  const openChangePassword = (u: AdminUser) => { closeModal(); setSelected(u); setModal("changePassword"); };
  const openDelete = (u: AdminUser) => { closeModal(); setSelected(u); setModal("delete"); };

  const handleCreate = async () => {
    setFormError("");
    if (fUsername.trim().length < 3) { setFormError("Benutzername: Mindestens 3 Zeichen."); return; }
    if (fPassword.length < 6) { setFormError("Passwort: Mindestens 6 Zeichen."); return; }
    if (fPassword !== fConfirm) { setFormError("Passwörter stimmen nicht überein."); return; }
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fUsername.trim(), name: fName.trim() || null, email: fEmail.trim() || null, password: fPassword, role: fRole, isActive: fActive }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) { closeModal(); fetchUsers(); showToast("✅ Benutzer erfolgreich angelegt.", "success"); }
    else setFormError(data.error || "Fehler beim Anlegen.");
  };

  const handleEdit = async () => {
    if (!selected) return;
    setFormError("");
    setSaving(true);
    const res = await fetch(`/api/admin/users/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fUsername.trim(), name: fName.trim() || null, email: fEmail.trim() || null, role: fRole, isActive: fActive }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) { closeModal(); fetchUsers(); showToast("✅ Benutzer aktualisiert.", "success"); }
    else setFormError(data.error || "Fehler beim Aktualisieren.");
  };

  const handleChangePassword = async () => {
    if (!selected) return;
    setFormError("");
    if (fPassword.length < 6) { setFormError("Neues Passwort: Mindestens 6 Zeichen."); return; }
    if (fPassword !== fConfirm) { setFormError("Passwörter stimmen nicht überein."); return; }
    setSaving(true);
    const res = await fetch(`/api/admin/users/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: fPassword }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) { closeModal(); showToast("✅ Passwort geändert.", "success"); }
    else setFormError(data.error || "Fehler beim Passwort-Reset.");
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/admin/users/${selected.id}`, { method: "DELETE" });
    const data = await res.json();
    setSaving(false);
    if (data.success) { closeModal(); fetchUsers(); showToast("🗑️ Benutzer gelöscht.", "success"); }
    else { setFormError(data.error || "Fehler beim Löschen."); showToast(data.error || "Fehler beim Löschen.", "error"); }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN" && u.isActive).length,
    sigekos: users.filter((u) => u.role === "SIGEKO").length,
    inactive: users.filter((u) => !u.isActive).length,
  };

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} />

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Benutzer gesamt", value: stats.total, color: "var(--text-primary)", icon: Users },
          { label: "Aktive Admins", value: stats.admins, color: "#ef4444", icon: Shield },
          { label: "SiGeKo-Planer", value: stats.sigekos, color: "#f59e0b", icon: HardHat },
          { label: "Deaktiviert", value: stats.inactive, color: "var(--text-muted)", icon: UserX },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--bg-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                flexShrink: 0,
              }}
            >
              <Icon size={16} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          Alle Benutzer ({users.length})
        </h2>
        <button
          id="add-user-btn"
          onClick={openCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #f59e0b, #ea580c)",
            color: "#0b0f19",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          Benutzer anlegen
        </button>
      </div>

      {/* User table */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            <RefreshCw size={20} style={{ animation: "spin 1s linear infinite", marginBottom: "8px" }} />
            <div>Benutzer werden geladen…</div>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            Noch keine Benutzer angelegt.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                {["Benutzer", "Rolle", "E-Mail", "Status", "Letzter Login", "Aktionen"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: idx < users.length - 1 ? "1px solid var(--border)" : "none",
                    background: "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover, rgba(255,255,255,0.02))")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {u.name || u.username}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      @{u.username}
                      {u.id === currentUserId && (
                        <span style={{ marginLeft: "6px", color: "var(--safety-amber, #f59e0b)", fontWeight: 700 }}>
                          (Sie)
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        ...ROLE_COLORS[u.role],
                        padding: "2px 8px",
                        borderRadius: "5px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: "12px" }}>
                    {u.email || "—"}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {u.isActive ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#22c55e", fontSize: "12px" }}>
                        <UserCheck size={13} /> Aktiv
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#ef4444", fontSize: "12px" }}>
                        <UserX size={13} /> Deaktiviert
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: "12px" }}>
                    {u.lastLogin
                      ? new Date(u.lastLogin).toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Noch nie"}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        title="Bearbeiten"
                        onClick={() => openEdit(u)}
                        style={actionBtnStyle}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        title="Passwort ändern"
                        onClick={() => openChangePassword(u)}
                        style={actionBtnStyle}
                      >
                        <Key size={13} />
                      </button>
                      <button
                        title="Benutzer löschen"
                        onClick={() => openDelete(u)}
                        disabled={u.role === "ADMIN" && stats.admins <= 1}
                        style={{
                          ...actionBtnStyle,
                          color: "#ef4444",
                          opacity: u.role === "ADMIN" && stats.admins <= 1 ? 0.3 : 1,
                          cursor: u.role === "ADMIN" && stats.admins <= 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(8,12,22,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "28px",
              width: "100%",
              maxWidth: "440px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}
          >
            {/* Create / Edit */}
            {(modal === "create" || modal === "edit") && (
              <>
                <h3 style={modalTitleStyle}>
                  {modal === "create" ? "Neuen Benutzer anlegen" : `Benutzer bearbeiten: ${selected?.username}`}
                </h3>

                <FieldGroup label="Benutzername *">
                  <input style={inputStyle} value={fUsername} onChange={(e) => setFUsername(e.target.value)} placeholder="min. 3 Zeichen" />
                </FieldGroup>
                <FieldGroup label="Vollständiger Name">
                  <input style={inputStyle} value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Max Mustermann" />
                </FieldGroup>
                <FieldGroup label="E-Mail (optional)">
                  <input type="email" style={inputStyle} value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="benutzer@firma.de" />
                </FieldGroup>
                <FieldGroup label="Rolle">
                  <select style={inputStyle} value={fRole} onChange={(e) => setFRole(e.target.value)}>
                    <option value="ADMIN">Administrator (voller Systemzugriff)</option>
                    <option value="SIGEKO">SiGeKo-Planer (voller Projektzugriff)</option>
                    <option value="LESER">Lesezugriff (nur Ansicht & Druck)</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="Status">
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input type="checkbox" checked={fActive} onChange={(e) => setFActive(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Konto aktiv (Benutzer kann sich anmelden)</span>
                  </label>
                </FieldGroup>
                {modal === "create" && (
                  <>
                    <FieldGroup label="Passwort * (min. 6 Zeichen)">
                      <input type="password" style={inputStyle} value={fPassword} onChange={(e) => setFPassword(e.target.value)} placeholder="••••••••" />
                    </FieldGroup>
                    <FieldGroup label="Passwort bestätigen *">
                      <input type="password" style={inputStyle} value={fConfirm} onChange={(e) => setFConfirm(e.target.value)} placeholder="••••••••" />
                    </FieldGroup>
                  </>
                )}
                {formError && <ErrorBox msg={formError} />}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button onClick={closeModal} style={btnSecStyle}>Abbrechen</button>
                  <button
                    id={modal === "create" ? "modal-create-user-btn" : "modal-edit-user-btn"}
                    onClick={modal === "create" ? handleCreate : handleEdit}
                    disabled={saving}
                    style={btnPrimStyle}
                  >
                    {saving ? "Wird gespeichert…" : modal === "create" ? "Benutzer anlegen" : "Speichern"}
                  </button>
                </div>
              </>
            )}

            {/* Change Password */}
            {modal === "changePassword" && (
              <>
                <h3 style={modalTitleStyle}>Passwort ändern: {selected?.username}</h3>
                <FieldGroup label="Neues Passwort * (min. 6 Zeichen)">
                  <input type="password" style={inputStyle} value={fPassword} onChange={(e) => setFPassword(e.target.value)} placeholder="••••••••" />
                </FieldGroup>
                <FieldGroup label="Passwort bestätigen *">
                  <input type="password" style={inputStyle} value={fConfirm} onChange={(e) => setFConfirm(e.target.value)} placeholder="••••••••" />
                </FieldGroup>
                {formError && <ErrorBox msg={formError} />}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button onClick={closeModal} style={btnSecStyle}>Abbrechen</button>
                  <button id="modal-change-password-btn" onClick={handleChangePassword} disabled={saving} style={btnPrimStyle}>
                    {saving ? "Wird gespeichert…" : "Passwort ändern"}
                  </button>
                </div>
              </>
            )}

            {/* Delete */}
            {modal === "delete" && (
              <>
                <h3 style={{ ...modalTitleStyle, color: "#ef4444" }}>Benutzer löschen?</h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 20px" }}>
                  Soll der Benutzer <strong style={{ color: "var(--text-primary)" }}>{selected?.username}</strong> ({ROLE_LABELS[selected?.role || ""] || selected?.role}) wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                {formError && <ErrorBox msg={formError} />}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={closeModal} style={btnSecStyle}>Abbrechen</button>
                  <button
                    id="modal-delete-user-btn"
                    onClick={handleDelete}
                    disabled={saving}
                    style={{ ...btnPrimStyle, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
                  >
                    {saving ? "Wird gelöscht…" : "Endgültig löschen"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── System Update Panel ────────────────────────────────────── */
function SystemUpdatePanel() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/Donmeusi/SiGeKo_Planer.git");
  const [currentBranch, setCurrentBranch] = useState("beta");
  const [targetBranch, setTargetBranch] = useState("beta");
  const [localCommit, setLocalCommit] = useState("—");
  const [remoteCommit, setRemoteCommit] = useState("—");
  const [updatesAvailable, setUpdatesAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchVersionInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/update");
      const data = await res.json();
      if (!data.error) {
        setCurrentBranch(data.currentBranch || "beta");
        setTargetBranch(data.currentBranch || "beta");
        setLocalCommit(data.localCommit || "—");
        setRemoteCommit(data.remoteCommit || "—");
        setRepoUrl(data.remoteUrl || "https://github.com/Donmeusi/SiGeKo_Planer.git");
        setUpdatesAvailable(Boolean(data.updatesAvailable));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchVersionInfo(); }, []);

  const handleDoUpdate = async () => {
    if (!confirm(`Update / Kanal-Wechsel auf '${targetBranch}' jetzt durchführen?`)) return;
    setUpdating(true);
    setLogs(["Update wird initialisiert…"]);
    try {
      const res = await fetch("/api/system/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetBranch, repoUrl }),
      });
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
      if (data.success) {
        setCurrentBranch(data.currentBranch);
        setLocalCommit(data.updatedCommit);
        setUpdatesAvailable(false);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setLogs((prev) => [...prev, `Fehler: ${msg}`]);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      {/* Repository Section */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ ...sectionTitleStyle, display: "flex", alignItems: "center", gap: "8px" }}>
          <GitBranch size={16} style={{ color: "#F1502F" }} /> Repository-Konfiguration
        </h2>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
          Quell-URL für automatische System-Updates.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <label style={labelStyle}>Git Repository URL</label>
            <input
              id="system-repo-url"
              type="text"
              style={inputStyle}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/Donmeusi/SiGeKo_Planer.git"
            />
          </div>
          <button onClick={fetchVersionInfo} style={{ ...btnSecStyle, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={13} />
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Version Info */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ ...sectionTitleStyle, display: "flex", alignItems: "center", gap: "8px" }}>
          <CloudDownload size={16} style={{ color: "#22c55e" }} /> Versionsprüfung & Update-Kanal
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          {[
            { label: "Installierte Version (Lokal)", value: loading ? "Wird geladen…" : localCommit },
            { label: "Neueste Version (Remote)", value: loading ? "Wird geladen…" : remoteCommit },
            { label: "Aktueller Kanal", value: null, branch: currentBranch },
          ].map(({ label, value, branch }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>{label}</div>
              {branch ? (
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: branch === "main" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                    color: branch === "main" ? "#22c55e" : "#f59e0b",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  {branch.toUpperCase()}
                </span>
              ) : (
                <code style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", background: "var(--bg-muted)", padding: "2px 8px", borderRadius: "4px" }}>
                  {value}
                </code>
              )}
            </div>
          ))}
        </div>

        {/* Status badge */}
        {updatesAvailable ? (
          <div style={statusBadge("#22c55e")}>
            <CheckCircle size={15} /> Neues Update auf dem Kanal &apos;{targetBranch}&apos; verfügbar!
          </div>
        ) : (
          <div style={statusBadge("var(--text-secondary)")}>
            <CheckCircle size={15} style={{ color: "#22c55e" }} />
            Ihr System ist auf dem neuesten Stand (Kanal: {currentBranch}).
          </div>
        )}

        {/* Channel select */}
        <div style={{ marginTop: "16px" }}>
          <label style={labelStyle}>Update-Kanal (Branch) wählen</label>
          <select
            id="system-branch-select"
            style={{ ...inputStyle, maxWidth: "300px" }}
            value={targetBranch}
            onChange={(e) => setTargetBranch(e.target.value)}
          >
            <option value="main">Stable (main) – getestete Releases</option>
            <option value="beta">Beta (beta) – neueste Features</option>
          </select>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
            Aktueller Kanal: <strong>{currentBranch}</strong>. Ein Kanalwechsel erfolgt automatisch beim nächsten Update.
          </p>
        </div>

        {/* Execute button */}
        <button
          id="system-update-btn"
          onClick={handleDoUpdate}
          disabled={updating || loading}
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: updating || loading ? "var(--bg-muted)" : "linear-gradient(135deg, #f59e0b, #ea580c)",
            color: updating || loading ? "var(--text-muted)" : "#0b0f19",
            fontWeight: 700,
            fontSize: "14px",
            cursor: updating || loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          <CloudDownload size={16} />
          {updating ? "Update wird durchgeführt…" : "Update / Kanal-Wechsel durchführen"}
        </button>
      </div>

      {/* Console log */}
      {logs.length > 0 && (
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(0,0,0,0.3)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--text-secondary)",
            }}
          >
            <Terminal size={14} style={{ color: "#22c55e" }} />
            Konsolen-Ausgabe
          </div>
          <pre
            id="system-update-log"
            style={{
              margin: 0,
              padding: "16px",
              fontFamily: "'Fira Code', 'Consolas', monospace",
              fontSize: "12px",
              color: "#22c55e",
              lineHeight: 1.7,
              maxHeight: "300px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {logs.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ─── Shared small components ────────────────────────────────── */
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "8px",
        color: "#ef4444",
        fontSize: "13px",
        marginBottom: "12px",
      }}
    >
      <AlertCircle size={14} />
      {msg}
    </div>
  );
}

/* ─── Shared style constants ─────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg-surface)",
  color: "var(--text-primary)",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--text-muted)",
  marginBottom: "5px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "var(--text-primary)",
  margin: "0 0 20px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--text-primary)",
  margin: "0 0 8px",
};

const btnPrimStyle: React.CSSProperties = {
  flex: 1,
  padding: "9px 16px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #f59e0b, #ea580c)",
  color: "#0b0f19",
  fontWeight: 700,
  fontSize: "13px",
  cursor: "pointer",
};

const btnSecStyle: React.CSSProperties = {
  flex: 1,
  padding: "9px 16px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg-surface)",
  color: "var(--text-secondary)",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "5px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  background: "var(--bg-surface)",
  color: "var(--text-secondary)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function statusBadge(color: string): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    background: color === "#22c55e" ? "rgba(34,197,94,0.08)" : "var(--bg-surface)",
    border: `1px solid ${color === "#22c55e" ? "rgba(34,197,94,0.25)" : "var(--border)"}`,
    borderRadius: "8px",
    color,
    fontSize: "13px",
    fontWeight: 500,
  };
}
