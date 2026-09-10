"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, LogIn, AlertCircle, HardHat } from "lucide-react";

interface Props {
  onSuccess: (user: { username: string; name: string | null; role: string }) => void;
}

export default function AdminLoginModal({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Anmeldung fehlgeschlagen.");
        return;
      }
      onSuccess(data.user);
    } catch {
      setError("Netzwerkfehler bei der Anmeldung. Bitte prüfen Sie die Verbindung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,12,22,0.85)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f59e0b, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 0 20px rgba(245,158,11,0.35)",
            }}
          >
            <HardHat size={28} color="#0b0f19" />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            SiGeKo Admin
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Bitte melden Sie sich mit Ihren Zugangsdaten an.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "10px",
              padding: "4px 10px",
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: "6px",
              fontSize: "11px",
              color: "var(--safety-amber, #f59e0b)",
              fontWeight: 600,
            }}
          >
            <Shield size={11} />
            Standard-Login: admin / admin123
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Benutzername oder E-Mail
            </label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="z. B. admin"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Passwort
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 42px 10px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
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
                marginBottom: "16px",
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading || !username.trim() || !password}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "8px",
              background:
                loading || !username.trim() || !password
                  ? "var(--bg-muted)"
                  : "linear-gradient(135deg, #f59e0b, #ea580c)",
              border: "none",
              color: loading || !username.trim() || !password ? "var(--text-muted)" : "#0b0f19",
              fontWeight: 700,
              fontSize: "14px",
              cursor:
                loading || !username.trim() || !password ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <LogIn size={16} />
            {loading ? "Wird angemeldet..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
