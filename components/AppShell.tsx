"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

interface AppShellProps {
  project: {
    id: string;
    name: string;
    projectNumber: string | null;
    location: string;
    status: string;
  };
  allProjects: {
    id: string;
    name: string;
    projectNumber: string | null;
    status: string;
  }[];
  children: React.ReactNode;
}

export default function AppShell({
  project,
  allProjects,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Suppress document.title during printing to prevent browser-inserted header titles
  useEffect(() => {
    let originalTitle = "";

    const handleBeforePrint = () => {
      originalTitle = document.title;
      document.title = "";
    };

    const handleAfterPrint = () => {
      if (originalTitle) {
        document.title = originalTitle;
      }
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle support */}
      <Sidebar
        currentProjectId={project.id}
        allProjects={allProjects}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <TopBar
          projectName={project.name}
          projectNumber={project.projectNumber}
          location={project.location}
          status={project.status}
          projectId={project.id}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
