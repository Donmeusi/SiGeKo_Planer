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
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        color: body.color || null,
        progress: body.progress !== undefined ? Number(body.progress) : 0,
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

    const updateData: any = {};
    if (data.phase !== undefined) updateData.phase = data.phase;
    if (data.trade !== undefined) updateData.trade = data.trade;
    if (data.activity !== undefined) updateData.activity = data.activity;
    if (data.hazards !== undefined) updateData.hazards = data.hazards;
    if (data.isAnnex2SpecialHazard !== undefined) updateData.isAnnex2SpecialHazard = Boolean(data.isAnnex2SpecialHazard);
    if (data.spatialTemporalOverlap !== undefined) updateData.spatialTemporalOverlap = data.spatialTemporalOverlap;
    if (data.commonMeasures !== undefined) updateData.commonMeasures = data.commonMeasures;
    if (data.responsibleCompany !== undefined) updateData.responsibleCompany = data.responsibleCompany;
    if (data.regulations !== undefined) updateData.regulations = data.regulations;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.orderIndex !== undefined) updateData.orderIndex = Number(data.orderIndex);
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.progress !== undefined) updateData.progress = Number(data.progress);

    const updated = await db.siGePlanEntry.update({
      where: { id: entryId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/projects/[id]/sige-plan error:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(req, { params });
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
