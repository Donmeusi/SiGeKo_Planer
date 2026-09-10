import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { INQA_DEFAULT_RULES } from "@/lib/inqa-rules";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Batch Action: INQA Standardregeln einspielen / zurücksetzen
    if (body.action === "seed_inqa" || body.action === "reset_inqa") {
      if (body.action === "reset_inqa") {
        await db.siteRule.deleteMany({
          where: { projectId: id },
        });
      }

      const created = [];
      for (const rule of INQA_DEFAULT_RULES) {
        const item = await db.siteRule.create({
          data: {
            projectId: id,
            category: rule.category,
            title: rule.title,
            praxisProblem: rule.praxisProblem,
            content: rule.content,
            isContractRelevant: rule.isContractRelevant,
            isSiGePlanRelevant: rule.isSiGePlanRelevant,
            actionStatus: rule.actionStatus,
            orderIndex: rule.orderIndex,
          },
        });
        created.push(item);
      }

      return NextResponse.json({ success: true, count: created.length, rules: created }, { status: 201 });
    }

    // Einzelne Regel erstellen
    const rule = await db.siteRule.create({
      data: {
        projectId: id,
        category: body.category || "KAPITEL_1_ALLGEMEIN",
        title: body.title,
        praxisProblem: body.praxisProblem || null,
        content: body.content,
        isContractRelevant: Boolean(body.isContractRelevant),
        isSiGePlanRelevant: Boolean(body.isSiGePlanRelevant),
        actionStatus: body.actionStatus || "GEREGELT",
        orderIndex: Number(body.orderIndex) || 0,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("POST siteRule error:", error);
    return NextResponse.json({ error: "Fehler beim Anlegen der Regel" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { id, title, content, category, praxisProblem, isContractRelevant, isSiGePlanRelevant, actionStatus, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: "Regel-ID erforderlich" }, { status: 400 });
    }

    const updated = await db.siteRule.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        category: category !== undefined ? category : undefined,
        praxisProblem: praxisProblem !== undefined ? praxisProblem : undefined,
        isContractRelevant: isContractRelevant !== undefined ? Boolean(isContractRelevant) : undefined,
        isSiGePlanRelevant: isSiGePlanRelevant !== undefined ? Boolean(isSiGePlanRelevant) : undefined,
        actionStatus: actionStatus !== undefined ? actionStatus : undefined,
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT siteRule error:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren der Regel" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ruleId = searchParams.get("ruleId");

    if (!ruleId) {
      return NextResponse.json({ error: "ruleId erforderlich" }, { status: 400 });
    }

    await db.siteRule.delete({
      where: { id: ruleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE siteRule error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
