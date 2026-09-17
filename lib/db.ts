import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  schemaPromise?: Promise<void>;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Automatisches Schema-Self-Healing:
 * Stellt sicher, dass neue Spalten und Tabellen in bestehenden SQLite-Datenbanken
 * (z. B. auf persistenten Docker-Volumes) sofort existieren, selbst wenn kein
 * 'prisma db push' ausgeführt wurde. Verhindert fatale Server-Exceptions (Digest Errors).
 */
export async function ensureDatabaseSchema(): Promise<void> {
  if (globalForPrisma.schemaPromise) {
    return globalForPrisma.schemaPromise;
  }

  globalForPrisma.schemaPromise = (async () => {
    try {
      // 1. Prüfen ob AdvanceNotice Tabelle existiert
      const tables: any[] = await db.$queryRawUnsafe(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='AdvanceNotice'`
      );
      if (!tables || tables.length === 0) return;

      // 2. Vorhandene Spalten abfragen
      const columns: any[] = await db.$queryRawUnsafe(`PRAGMA table_info("AdvanceNotice")`);
      const existingCols = new Set(columns.map((c: any) => c.name));

      // 3. Fehlende Spalten per ALTER TABLE hinzufügen (idempotent)
      if (!existingCols.has("annex2Activities")) {
        console.log("🛠️ [DB-Migration] Ergänze Spalte 'annex2Activities' in AdvanceNotice...");
        await db.$executeRawUnsafe(`ALTER TABLE "AdvanceNotice" ADD COLUMN "annex2Activities" TEXT`);
      }

      if (!existingCols.has("personDaysDetails")) {
        console.log("🛠️ [DB-Migration] Ergänze Spalte 'personDaysDetails' in AdvanceNotice...");
        await db.$executeRawUnsafe(`ALTER TABLE "AdvanceNotice" ADD COLUMN "personDaysDetails" TEXT`);
      }
    } catch (err) {
      console.warn("⚠️ [DB-Migration] Hinweis zur Schema-Prüfung:", err);
    }
  })();

  return globalForPrisma.schemaPromise;
}

// Sofort beim Modul-Import im Hintergrund triggern
ensureDatabaseSchema().catch(() => {});

