import { SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import Providers from "./providers"; ///////
import { AppWindow } from "lucide-react";
import AppSideBar from "./side-bar";
import { Suspense } from "react";

export const metadata = {
  title: "GitHub Profiles",
  description: "Consulta de perfis do GitHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground ">
        <Providers>
          <AppSideBar />
          <main className="container mx-auto p-6">
            <SidebarTrigger className="z-99999" />

            <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
}
