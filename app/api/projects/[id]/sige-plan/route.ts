import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const entry = await db.siGePlanEntry.create({
      data: {
        projectId: id,
        phase: body.phase || "Allgemein",
        trade: body.trade || "Allgemeines Gewerk",
        activity: body.activity,
        hazards: body.hazards,
        isAnnex2SpecialHazard: Boolean(body.isAnnex2SpecialHazard),
        spatialTemporalOverlap: body.spatialTemporalOverlap,
        commonMeasures: body.commonMeasures,
        responsibleCompany: body.responsibleCompany,
        regulations: body.regulations,
        priority: body.priority || "NORMAL",
        orderIndex: Number(body.orderIndex) || 0,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects/[id]/sige-plan error:", error);
    return NextResponse.json({ error: "Fehler beim Anlegen des SiGe-Plan-Eintrags" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { entryId, ...data } = body;

    if (!entryId) {
      return NextResponse.json({ error: "entryId erforderlich" }, { status: 400 });
    }

    const updated = await db.siGePlanEntry.update({
      where: { id: entryId },
      data: {
        phase: data.phase,
        trade: data.trade,
        activity: data.activity,
        hazards: data.hazards,
        isAnnex2SpecialHazard: Boolean(data.isAnnex2SpecialHazard),
        spatialTemporalOverlap: data.spatialTemporalOverlap,
        commonMeasures: data.commonMeasures,
        responsibleCompany: data.responsibleCompany,
        regulations: data.regulations,
        priority: data.priority,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/projects/[id]/sige-plan error:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const entryId = searchParams.get("entryId");

    if (!entryId) {
      return NextResponse.json({ error: "entryId erforderlich" }, { status: 400 });
    }

    await db.siGePlanEntry.delete({
      where: { id: entryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id]/sige-plan error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
