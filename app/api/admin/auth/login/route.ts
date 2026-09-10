import { NextResponse } from "next/server";
import { verifyPassword, signSessionToken, setSessionCookie, ensureDefaultAdmin } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await ensureDefaultAdmin();

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Benutzername und Passwort sind erforderlich." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: username.trim().toLowerCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Dieser Benutzeraccount ist deaktiviert. Bitte kontaktieren Sie die Administration." },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten." },
        { status: 401 }
      );
    }

    // Update lastLogin timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Create signed token & set cookie
    const token = signSessionToken({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Interner Fehler bei der Anmeldung." },
      { status: 500 }
    );
  }
}
