import type { Metadata, Viewport } from "next";
import { Inter, Cairo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";

export const metadata: Metadata = {
  title: "JUSTIVIA (جوستيفيا) - Algerian Legal Intelligence",
  description: "The definitive AI-powered legal intelligence platform for Algeria.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JUSTIVIA",
  },
};

export const viewport: Viewport = {
  themeColor: "#C41E2A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cairo.variable} ${plexMono.variable} font-inter min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider attribute="data-theme" defaultTheme="night" themes={['light', 'dark', 'night']} enableSystem={false} enableColorScheme={false} disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              <Navbar />
              <main className="flex-grow flex flex-col relative">
                {children}
              </main>
              <Footer />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
