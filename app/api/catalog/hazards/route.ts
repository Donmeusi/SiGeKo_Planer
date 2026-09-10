import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

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
