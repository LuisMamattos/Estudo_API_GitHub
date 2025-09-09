import { SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import Providers from "./providers"; ///////
import AppSideBar from "./side-bar";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AppSideBar />
            <main className="container mx-auto p-6">
              <SidebarTrigger className="" />
              <ModeToggle />

              <Suspense fallback={<div>Carregando...</div>}>
                {children}
              </Suspense>
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
