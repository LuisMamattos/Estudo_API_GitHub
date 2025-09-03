import "./globals.css";
import Providers from "./providers"; ///////

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
      <body className="bg-background text-foreground">
        <Providers>
          <main className="container mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
