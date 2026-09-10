import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const item = await db.subsequentWork.create({
      data: {
        projectId: id,
        component: body.component,
        workType: body.workType,
        hazards: body.hazards,
        safetyMeasures: body.safetyMeasures,
        documentationLocation: body.documentationLocation,
        notes: body.notes,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST subsequentWork error:", error);
    return NextResponse.json({ error: "Fehler beim Anlegen des Eintrags" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id erforderlich" }, { status: 400 });
    }

    await db.subsequentWork.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE subsequentWork error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
