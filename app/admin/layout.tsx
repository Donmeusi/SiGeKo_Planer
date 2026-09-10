import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin & System | SiGeKo-Planer",
  description: "Benutzerverwaltung und System-Updates für den SiGeKo-Planer.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Top Brand Bar */}
      <header
        style={{
          height: "52px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #f59e0b, #ea580c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b0f19",
            fontSize: "14px",
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          ⛑
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          SiGeKo-Planer
        </span>
        <span style={{ color: "var(--border)", margin: "0 4px" }}>/</span>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Admin &amp; System</span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Back to App */}
        <a
          href="/"
          className="admin-back-link"
        >
          ← Zurück zur App
        </a>
      </header>

      <style>{`
        .admin-back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
          padding: 5px 12px;
          border-radius: 7px;
          border: 1px solid var(--border);
          background: transparent;
          transition: color 0.15s, border-color 0.15s;
        }
        .admin-back-link:hover {
          color: var(--text-primary);
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div style={{ padding: "0 0 48px" }}>{children}</div>
    </div>
  );
}
