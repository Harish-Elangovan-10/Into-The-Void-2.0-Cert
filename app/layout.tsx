import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Into the Void 2.0 - Certificates",
  description: "Official certificate portal for Into the Void 2.0 by ExploitX.",
  icons: {
    icon: "./logo_exploitx.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#05060A]`}>
        {/* Background Grids */}
        <div className="fixed inset-0 grid-overlay z-0 pointer-events-none" />

        {/* Starfield simulation from landing page */}
        <div
          className="fixed inset-0 z-0 pointer-events-none opacity-40"
          style={{
            background: `
              radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1.2px 1.2px at 30% 65%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 70% 40%, rgba(123,97,255,0.4) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 15% 85%, rgba(77,168,255,0.3) 0%, transparent 100%),
              radial-gradient(1.2px 1.2px at 90% 15%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 60% 75%, rgba(168,85,247,0.3) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 45% 90%, rgba(123,97,255,0.5) 0%, transparent 100%)
            `
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
