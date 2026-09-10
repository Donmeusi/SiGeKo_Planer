import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmelden | SiGeKo-Planer",
  description: "Bitte melden Sie sich an, um den SiGeKo-Planer zu nutzen.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
