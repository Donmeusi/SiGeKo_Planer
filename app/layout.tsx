import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";

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
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('sigeko_theme');
                if (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
