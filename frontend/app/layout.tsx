import "./globals.css";
import { TranslationProvider } from "@/components/translation-provider";
import { Header } from "@/components/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>
          <Header />
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </TranslationProvider>
      </body>
    </html>
  );
}
