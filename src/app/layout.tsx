import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | ShopSphere India",
    default: "ShopSphere - India's Premier Online Department Store",
  },
  description:
    "Shop high-quality headphones, smartwatches, handcrafted khadi, authentic Banarasi sarees, Ayurvedic beauty elixirs, and artisan home decor with Razorpay & Cash on Delivery across India.",
  keywords: [
    "ShopSphere",
    "Indian e-commerce",
    "buy sarees online",
    "noise cancelling headphones",
    "ayurvedic skincare",
    "handcrafted khadi",
    "home decor",
  ],
  authors: [{ name: "ShopSphere" }],
  creator: "ShopSphere India",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "ShopSphere",
    title: "ShopSphere - Modern Indian E-Commerce",
    description: "Curated lifestyle, fashion, electronics, and home essentials delivered across India.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
