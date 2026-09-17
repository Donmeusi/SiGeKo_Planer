import { redirect } from "next/navigation";
import { db, ensureDatabaseSchema } from "@/lib/db";
import Link from "next/link";
import { HardHat, Building, ArrowRight, ShieldCheck, FileText, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureDatabaseSchema();

  const projects = await db.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          contractors: true,
          sigePlanEntries: true,
          defects: true,
        },
      },
      advanceNotice: true,
    },
  });

  // Wenn bereits mindestens ein Projekt existiert, leiten wir direkt zum ersten weiter
  if (projects.length > 0) {
    redirect(`/projects/${projects[0].id}`);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div className="card" style={{ maxWidth: "600px", width: "100%", textAlign: "center", padding: "40px 30px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #f59e0b, #ea580c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b0f19",
            margin: "0 auto 20px",
            boxShadow: "var(--shadow-amber)",
          }}
        >
          <HardHat size={36} strokeWidth={2.4} />
        </div>

        <h1 className="title-xl" style={{ marginBottom: "8px" }}>
          Willkommen beim SiGeKo-Planer 2026
        </h1>
        <p className="text-secondary" style={{ marginBottom: "24px", lineHeight: "1.6" }}>
          Ihre digitale Fachanwendung für Sicherheits- und Gesundheitsschutzkoordination nach der Baustellenverordnung (BaustellV) und RAB 30, 31, 32.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", textAlign: "left", marginBottom: "30px" }}>
          <div className="card" style={{ background: "var(--bg-surface)", padding: "14px" }}>
            <FileText size={18} color="var(--safety-amber)" style={{ marginBottom: "6px" }} />
            <div style={{ fontWeight: 600, fontSize: "13px" }}>Vorankündigung § 2</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Schwellenwert-Berechnung &amp; amtlicher Aushang</div>
          </div>
          <div className="card" style={{ background: "var(--bg-surface)", padding: "14px" }}>
            <ShieldCheck size={18} color="var(--success-emerald)" style={{ marginBottom: "6px" }} />
            <div style={{ fontWeight: 600, fontSize: "13px" }}>SiGe-Plan (RAB 31)</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Tabellarische Matrix &amp; Gefährdungskatalog</div>
          </div>
        </div>

        <Link href="/projects/new" className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
          <span>Erstes Bauvorhaben anlegen</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
