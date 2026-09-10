import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiGeKo-Planer | Software für Sicherheits- & Gesundheitsschutzkoordination (BaustellV & RAB 30)",
  description:
    "Digitale Arbeitsplattform für SiGe-Koordinatoren nach Baustellenverordnung (BaustellV): Vorankündigung nach § 2, SiGe-Plan nach RAB 31 mit Gefährdungskatalog, Baustellenordnung, Unterlage nach RAB 32 und digitales Mängelmanagement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
