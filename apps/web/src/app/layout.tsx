import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bitácora de Asados",
  description: "Registro personal y mobile-first para cursos y técnicas de asados",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Asados",
  },
};

export const viewport: Viewport = {
  themeColor: "#c73d09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-[#12100f] text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
