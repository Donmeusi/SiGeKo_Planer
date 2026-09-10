"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HardHat, Eye, EyeOff, LogIn, AlertCircle, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, go to destination
  useEffect(() => {
    fetch("/api/admin/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace(redirectTo);
      })
      .catch(() => {});
  }, [redirectTo, router]);

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

      // Redirect to original destination or home
      router.replace(redirectTo);
    } catch {
      setError("Netzwerkfehler. Bitte prüfen Sie die Verbindung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-canvas, #090d16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #f59e0b, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 32px rgba(245,158,11,0.4), 0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <HardHat size={32} color="#0b0f19" />
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#f8fafc",
              margin: "0 0 8px",
              letterSpacing: "-0.03em",
            }}
          >
            SiGeKo-Planer
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Sicherheits- & Gesundheitsschutzkoordination
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "12px",
              padding: "5px 12px",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(245,158,11,0.85)",
            }}
          >
            <ShieldAlert size={11} />
            BaustellV · RAB 30 · RAB 31 · RAB 32
          </div>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "36px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#f8fafc",
              margin: "0 0 6px",
            }}
          >
            Anmelden
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 24px" }}>
            Bitte melden Sie sich mit Ihren Zugangsdaten an, um fortzufahren.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Benutzername</label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Benutzername eingeben"
                disabled={loading}
                style={inputStyle}
                required
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Passwort</label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 14px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "10px",
                  color: "#ef4444",
                  fontSize: "13px",
                  marginBottom: "16px",
                  animation: "shake 0.3s ease-in-out",
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading || !username.trim() || !password}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background:
                  loading || !username.trim() || !password
                    ? "rgba(255,255,255,0.06)"
                    : "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                color:
                  loading || !username.trim() || !password ? "#475569" : "#0b0f19",
                fontWeight: 700,
                fontSize: "14px",
                cursor:
                  loading || !username.trim() || !password ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                boxShadow:
                  loading || !username.trim() || !password
                    ? "none"
                    : "0 4px 16px rgba(245,158,11,0.35)",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(0,0,0,0.3)",
                      borderTopColor: "#0b0f19",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Wird angemeldet…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Anmelden
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#334155",
            marginTop: "24px",
          }}
        >
          SiGeKo-Planer · gemäß BaustellV & RAB 30
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(9,13,22,0.8)",
  color: "#f8fafc",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#64748b",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#090d16" }} />}>
      <LoginForm />
    </Suspense>
  );
}
