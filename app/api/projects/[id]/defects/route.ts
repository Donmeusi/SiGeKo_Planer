import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    let inspectionId = body.inspectionId;

    // Wenn keine Begehungs-ID mitgegeben wurde, weisen wir die neueste zu oder legen eine an
    if (!inspectionId) {
      let latestInspection = await db.siteInspection.findFirst({
        where: { projectId: id },
        orderBy: { date: "desc" },
      });

      if (!latestInspection) {
        latestInspection = await db.siteInspection.create({
          data: {
            projectId: id,
            inspector: "SiGe-Koordinator",
            date: new Date(),
            overallImpression: "MAENGEL_FESTGESTELLT",
          },
        });
      }
      inspectionId = latestInspection.id;
    }

    const defect = await db.inspectionDefect.create({
      data: {
        projectId: id,
        inspectionId,
        description: body.description,
        location: body.location || "Baustelle",
        severity: body.severity || "MITTEL",
        tradeAssigned: body.tradeAssigned,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        status: body.status || "OFFEN",
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(defect, { status: 201 });
  } catch (error) {
    console.error("POST defect error:", error);
    return NextResponse.json({ error: "Fehler beim Erfassen des Mangels" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { defectId, ...data } = body;

    if (!defectId) {
      return NextResponse.json({ error: "defectId erforderlich" }, { status: 400 });
    }

    const updated = await db.inspectionDefect.update({
      where: { id: defectId },
      data: {
        status: data.status,
        resolutionNote: data.status === "BEHOBEN" ? data.resolutionNote : null,
        resolvedAt: data.status === "BEHOBEN" ? (data.resolvedAt ? new Date(data.resolvedAt) : new Date()) : null,
        tradeAssigned: data.tradeAssigned !== undefined ? data.tradeAssigned : undefined,
        deadline: data.deadline ? new Date(data.deadline) : data.deadline === null ? null : undefined,
        severity: data.severity,
        description: data.description,
        location: data.location,
        inspectionId: data.inspectionId || undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT defect error:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const defectId = searchParams.get("defectId");

    if (!defectId) {
      return NextResponse.json({ error: "defectId erforderlich" }, { status: 400 });
    }

    await db.inspectionDefect.delete({
      where: { id: defectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE defect error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
