import { notFound } from "next/navigation";
import { db, ensureDatabaseSchema } from "@/lib/db";
import AppShell from "@/components/AppShell";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  await ensureDatabaseSchema();
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
  });

  const allProjects = await db.project.findMany({
    select: { id: true, name: true, projectNumber: true, status: true },
    orderBy: { updatedAt: "desc" },
  });

  if (!project) {
    notFound();
  }

  return (
    <AppShell project={project} allProjects={allProjects}>
      {children}
    </AppShell>
  );
}
