import { NextResponse } from "next/server";
import { getCurrentSession, hashPassword } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Zugriff verweigert. Administratorrechte erforderlich." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { username, name, email, password, role, isActive } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 });
    }

    // Protection: If demoting or deactivating an admin, ensure there is at least one other active admin
    if (existingUser.role === "ADMIN" && (role !== "ADMIN" || isActive === false)) {
      const otherAdmins = await prisma.user.count({
        where: {
          role: "ADMIN",
          isActive: true,
          id: { not: id },
        },
      });

      if (otherAdmins === 0) {
        return NextResponse.json(
          { error: "Der letzte aktive Administrator kann weder deaktiviert noch auf eine andere Rolle zurückgestuft werden." },
          { status: 400 }
        );
      }
    }

    const updateData: {
      username?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      isActive?: boolean;
      passwordHash?: string;
    } = {};

    if (username && username.trim().length >= 3) {
      // check unique
      const duplicate = await prisma.user.findFirst({
        where: {
          username: username.trim(),
          id: { not: id },
        },
      });
      if (duplicate) {
        return NextResponse.json({ error: "Dieser Benutzername ist bereits vergeben." }, { status: 409 });
      }
      updateData.username = username.trim();
    }

    if (name !== undefined) updateData.name = name?.trim() || null;
    if (email !== undefined) updateData.email = email?.trim() || null;
    if (role && ["ADMIN", "SIGEKO", "LESER"].includes(role)) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (password && password.length >= 6) {
      updateData.passwordHash = hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Benutzers." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Zugriff verweigert. Administratorrechte erforderlich." }, { status: 403 });
    }

    const { id } = await params;
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 });
    }

    // Protection: Never delete the last active admin
    if (targetUser.role === "ADMIN") {
      const otherAdmins = await prisma.user.count({
        where: {
          role: "ADMIN",
          isActive: true,
          id: { not: id },
        },
      });

      if (otherAdmins === 0) {
        return NextResponse.json(
          { error: "Der letzte aktive Administrator kann nicht gelöscht werden." },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen des Benutzers." }, { status: 500 });
  }
}
