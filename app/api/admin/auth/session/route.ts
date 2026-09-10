import { NextResponse } from "next/server";
import { getCurrentSession, ensureDefaultAdmin } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    // Make sure at least the initial admin account exists in DB
    await ensureDefaultAdmin();

    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
