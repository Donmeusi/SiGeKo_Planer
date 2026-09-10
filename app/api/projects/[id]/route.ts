import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await db.project.findUnique({
      where: { id },
      include: {
        contractors: { orderBy: { createdAt: "asc" } },
        advanceNotice: true,
        sigePlanEntries: { orderBy: { orderIndex: "asc" } },
        inspections: {
          orderBy: { date: "desc" },
          include: { defects: true },
        },
        siteRules: { orderBy: { orderIndex: "asc" } },
        subsequentWorks: { orderBy: { createdAt: "asc" } },
        defects: {
          orderBy: { createdAt: "desc" },
          include: {
            inspection: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Projekt nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Fehler beim Laden des Projekts" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await db.project.update({
      where: { id },
      data: {
        name: body.name,
        projectNumber: body.projectNumber,
        description: body.description,
        location: body.location,
        clientName: body.clientName,
        clientAddress: body.clientAddress,
        clientContact: body.clientContact,
        coordinatorName: body.coordinatorName,
        coordinatorCert: body.coordinatorCert,
        coordinatorContact: body.coordinatorContact,
        siteManager: body.siteManager,
        plannedStart: body.plannedStart ? new Date(body.plannedStart) : undefined,
        plannedEnd: body.plannedEnd ? new Date(body.plannedEnd) : undefined,
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
