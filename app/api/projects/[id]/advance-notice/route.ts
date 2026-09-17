import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const maxWorkers = Number(body.maxWorkersSimultaneous) || 1;
    const totalDays = Number(body.estimatedTotalWorkDays) || 0;
    const hasSpecialRisks = Boolean(body.hasSpecialRisks);

    // Rechtliche Prüfung gem. § 2 BaustellV:
    // 1. Mehr als 20 Beschäftigte gleichzeitig und Dauer > 30 Tage (entspricht mind. ca. 600 Personentagen)
    // ODER 2. Umfang > 500 Personentage
    // ODER 3. Arbeiten nach Anhang II
    const noticeRequired = totalDays > 500 || maxWorkers > 20 || hasSpecialRisks;

    // 1. Vorankündigung speichern / aktualisieren
    const updated = await db.advanceNotice.upsert({
      where: { projectId: id },
      create: {
        projectId: id,
        authorityName: body.authorityName || "Zuständiges Gewerbeaufsichtsamt / Amt für Arbeitsschutz",
        authorityAddress: body.authorityAddress,
        noticeDate: body.noticeDate ? new Date(body.noticeDate) : new Date(),
        maxWorkersSimultaneous: maxWorkers,
        estimatedTotalWorkDays: totalDays,
        hasSpecialRisks,
        noticeRequired,
        submittedDate: body.submittedDate ? new Date(body.submittedDate) : null,
        status: body.status || "ENTWURF",
        notes: body.notes,
        annex2Activities: body.annex2Activities !== undefined ? body.annex2Activities : null,
        personDaysDetails: body.personDaysDetails !== undefined ? body.personDaysDetails : null,
      },
      update: {
        authorityName: body.authorityName,
        authorityAddress: body.authorityAddress,
        noticeDate: body.noticeDate ? new Date(body.noticeDate) : undefined,
        maxWorkersSimultaneous: maxWorkers,
        estimatedTotalWorkDays: totalDays,
        hasSpecialRisks,
        noticeRequired,
        submittedDate: body.submittedDate ? new Date(body.submittedDate) : null,
        status: body.status,
        notes: body.notes,
        annex2Activities: body.annex2Activities !== undefined ? body.annex2Activities : undefined,
        personDaysDetails: body.personDaysDetails !== undefined ? body.personDaysDetails : undefined,
      },
    });

    // 2. Projektstammdaten aktualisieren, falls im Formular mitübergeben
    if (
      body.name !== undefined ||
      body.location !== undefined ||
      body.description !== undefined ||
      body.clientName !== undefined ||
      body.clientAddress !== undefined ||
      body.siteManager !== undefined ||
      body.coordinatorName !== undefined ||
      body.coordinatorContact !== undefined ||
      body.plannedStart !== undefined ||
      body.plannedEnd !== undefined
    ) {
      await db.project.update({
        where: { id },
        data: {
          name: body.name || undefined,
          location: body.location || undefined,
          description: body.description !== undefined ? body.description : undefined,
          clientName: body.clientName || undefined,
          clientAddress: body.clientAddress !== undefined ? body.clientAddress : undefined,
          siteManager: body.siteManager !== undefined ? body.siteManager : undefined,
          coordinatorName: body.coordinatorName || undefined,
          coordinatorContact: body.coordinatorContact !== undefined ? body.coordinatorContact : undefined,
          plannedStart: body.plannedStart ? new Date(body.plannedStart) : undefined,
          plannedEnd: body.plannedEnd ? new Date(body.plannedEnd) : undefined,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/projects/[id]/advance-notice error:", error);
    return NextResponse.json({ error: "Fehler beim Speichern der Vorankündigung" }, { status: 500 });
  }
}
