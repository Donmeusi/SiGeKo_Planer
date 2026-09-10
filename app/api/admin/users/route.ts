import { NextResponse } from "next/server";
import { getCurrentSession, hashPassword, ensureDefaultAdmin } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    await ensureDefaultAdmin();
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Zugriff verweigert. Administratorrechte erforderlich." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Benutzerliste." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Zugriff verweigert. Administratorrechte erforderlich." }, { status: 403 });
    }

    const body = await req.json();
    const { username, name, email, password, role = "SIGEKO", isActive = true } = body;

    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { error: "Der Benutzername muss mindestens 3 Zeichen lang sein." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Das Passwort muss mindestens 6 Zeichen lang sein." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const cleanEmail = email?.trim() || null;

    // Check duplicate username or email
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.username.toLowerCase() === cleanUsername.toLowerCase()) {
        return NextResponse.json({ error: "Dieser Benutzername ist bereits vergeben." }, { status: 409 });
      }
      return NextResponse.json({ error: "Diese E-Mail-Adresse wird bereits verwendet." }, { status: 409 });
    }

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        name: name?.trim() || null,
        email: cleanEmail,
        passwordHash: hashPassword(password),
        role: ["ADMIN", "SIGEKO", "LESER"].includes(role) ? role : "SIGEKO",
        isActive: Boolean(isActive),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Fehler beim Anlegen des Benutzers." }, { status: 500 });
  }
}
