import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            contractors: true,
            sigePlanEntries: true,
            defects: true,
            inspections: true,
          },
        },
        advanceNotice: {
          select: {
            status: true,
            noticeRequired: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Projekte" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, projectNumber, location, clientName, coordinatorName, description, status } = body;

    if (!name || !location || !clientName || !coordinatorName) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        name,
        projectNumber,
        location,
        clientName,
        coordinatorName,
        description,
        status: status || "PLANUNG",
        advanceNotice: {
          create: {
            authorityName: "Zuständiges Gewerbeaufsichtsamt / Amt für Arbeitsschutz",
            noticeDate: new Date(),
            status: "ENTWURF",
          },
        },
        siteRules: {
          createMany: {
            data: [
              {
                category: "PSA",
                title: "Persönliche Schutzausrüstung (PSA)",
                content: "Helmpflicht (DIN EN 397) und Sicherheitsschuhe S3 auf der gesamten Baustelle ab Zutritt.",
                orderIndex: 1,
              },
              {
                category: "NOTFALL",
                title: "Notfallkette & Meldeweg",
                content: "Notruf 112. Erste-Hilfe-Kasten im SiGeKo-/Bauleitercontainer. Rettungstreffpunkt Haupttor.",
                orderIndex: 2,
              },
              {
                category: "ORDNUNG",
                title: "Flucht- und Rettungswege",
                content: "Alle Durchgänge, Treppenräume und Rettungswege sind zu jeder Zeit freizuhalten.",
                orderIndex: 3,
              },
            ],
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen des Projekts" }, { status: 500 });
  }
}
