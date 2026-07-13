import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import InteractiveBackground from "@/components/InteractiveBackground";
import PWAInstallButton from "@/components/PWAInstallButton";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "إخلاص بوعلام - معلمة اللغة العربية",
  description:
    "بورتفوليو المعلمة إخلاص بوعلام - معلمة اللغة العربية للمرحلة الابتدائية، مدققة لغوية، وكاتبة أدبية",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "إخلاص",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#6c63ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        <InteractiveBackground />
        <div className="app-layout">
          <Navigation />
          <main className="page-main">{children}</main>
        </div>
        <PWAInstallButton />
      </body>
    </html>
  );
}
