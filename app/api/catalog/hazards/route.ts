import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { INITIAL_HAZARDS_CATALOG } from "@/lib/sample-catalog";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Prüfen, ob der Katalog in der Datenbank noch leer ist
    const totalCount = await db.hazardCatalogItem.count();
    if (totalCount === 0) {
      console.log("📦 [Gefährdungskatalog API] Tabelle ist leer. Initialisiere Standard-Katalog...");
      for (const item of INITIAL_HAZARDS_CATALOG) {
        await db.hazardCatalogItem.create({
          data: {
            tradeCategory: item.tradeCategory,
            activity: item.activity,
            hazard: item.hazard,
            protectiveMeasure: item.protectiveMeasure,
            isAnnex2: item.isAnnex2,
            regulations: item.regulations,
          },
        });
      }
      console.log("✓ [Gefährdungskatalog API] Standard-Katalog erfolgreich befüllt.");
    }

    const where: any = {};
    if (category && category !== "ALL") {
      where.tradeCategory = category;
    }
    if (search) {
      where.OR = [
        { activity: { contains: search } },
        { hazard: { contains: search } },
        { protectiveMeasure: { contains: search } },
        { tradeCategory: { contains: search } },
      ];
    }

    const items = await db.hazardCatalogItem.findMany({
      where,
      orderBy: { tradeCategory: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/catalog/hazards error:", error);
    return NextResponse.json({ error: "Fehler beim Laden des Katalogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const totalCount = await db.hazardCatalogItem.count();
    if (totalCount === 0) {
      for (const item of INITIAL_HAZARDS_CATALOG) {
        await db.hazardCatalogItem.create({
          data: {
            tradeCategory: item.tradeCategory,
            activity: item.activity,
            hazard: item.hazard,
            protectiveMeasure: item.protectiveMeasure,
            isAnnex2: item.isAnnex2,
            regulations: item.regulations,
          },
        });
      }
    }

    const allItems = await db.hazardCatalogItem.findMany({
      orderBy: { tradeCategory: "asc" },
    });

    return NextResponse.json({ success: true, count: allItems.length, items: allItems });
  } catch (error) {
    console.error("POST /api/catalog/hazards error:", error);
    return NextResponse.json({ error: "Fehler beim Initialisieren des Katalogs" }, { status: 500 });
  }
}

