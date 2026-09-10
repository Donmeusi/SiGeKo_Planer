import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inspections = await db.siteInspection.findMany({
      where: { projectId: id },
      orderBy: { date: "desc" },
      include: {
        defects: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(inspections);
  } catch (error) {
    console.error("GET inspections error:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Begehungen" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const inspection = await db.siteInspection.create({
      data: {
        projectId: id,
        date: body.date ? new Date(body.date) : new Date(),
        inspector: body.inspector || "SiGe-Koordinator",
        participants: body.participants,
        weather: body.weather,
        constructionProgress: body.constructionProgress,
        overallImpression: body.overallImpression || "GUT",
        summary: body.summary,
      },
    });

    return NextResponse.json(inspection, { status: 201 });
  } catch (error) {
    console.error("POST inspections error:", error);
    return NextResponse.json({ error: "Fehler beim Anlegen der Begehung" }, { status: 500 });
  }
}
