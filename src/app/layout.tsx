import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import InteractiveBackground from "@/components/InteractiveBackground";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "إخلاص بوعلام - معلمة اللغة العربية",
  description: "بورتفوليو المعلمة إخلاص بوعلام - معلمة اللغة العربية للمرحلة الابتدائية، مدققة لغوية، وكاتبة أدبية",
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
          <main className="page-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
