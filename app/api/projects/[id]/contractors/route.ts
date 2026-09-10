import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const contractor = await db.contractor.create({
      data: {
        projectId: id,
        companyName: body.companyName,
        trade: body.trade,
        contactPerson: body.contactPerson,
        phone: body.phone,
        email: body.email,
        workerCount: Number(body.workerCount) || 1,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        isSubcontractor: Boolean(body.isSubcontractor),
        mainContractor: body.mainContractor,
      },
    });

    return NextResponse.json(contractor, { status: 201 });
  } catch (error) {
    console.error("POST contractor error:", error);
    return NextResponse.json({ error: "Fehler beim Anlegen des Gewerkes" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contractorId = searchParams.get("contractorId");

    if (!contractorId) {
      return NextResponse.json({ error: "contractorId erforderlich" }, { status: 400 });
    }

    await db.contractor.delete({
      where: { id: contractorId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE contractor error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
