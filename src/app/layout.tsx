// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import AuthProvider from "@/components/providers/AuthProvider";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kalender Toptan",
    default:
      "Kalender Toptan | Gaziantep Toptan Gıda, Toptan Alışveriş, Toptan Satış",
  },
  description:
    "Kalender Toptan - 1962'den beri Türkiye'nin güvenilir toptan adresi. Türkiye genelinde toptan gıda, toptan alışveriş, toptan satış hizmeti. En uygun fiyatlarla kaliteli ürünler.",
  keywords: [
    "toptan",
    "toptan gıda",
    "toptan alışveriş",
    "toptan satış",
    "toptan alım satım",
    "toptan satış",
    "kalender",
    "kalender toptan",
    "toptan market",
    "toptan ürün",
    "toptan alışveriş",
    "toptan gıda",
    "doğu anadolu toptan",
    "güneydoğu anadolu toptan",
  ],
  openGraph: {
    title: "Kalender Toptan | Türkiye'nin Toptan Adresi",
    description:
      "1962'den beri Türkiye'nin güvenilir toptan adresi. Türkiye genelinde hizmet.",
    url: process.env.NEXTAUTH_URL || "https://www.kalenderltd.com",
    siteName: "Kalender Toptan",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalender Toptan | Türkiye'nin Toptan Adresi",
    description:
      "1962'den beri Türkiye'nin güvenilir toptan adresi. En uygun fiyatlarla kaliteli ürünler.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. <html>'e h-full eklendi
    <html lang="tr" className="h-full">
      <body
        // 3. <body>'ye "Sticky Footer" için flex sınıfları eklendi
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
