import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FloatingBookUs from "@/components/FloatingBookUs";

export const metadata: Metadata = {
  title: "Dynamic Groove Media",
  description: "Elevating moments through precision media & live broadcasting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">

        {/* Fixed Navigation */}
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        {/* Main Content Wrapper */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>

        {/* Floating CTA Buttons */}
        <FloatingBookUs />
        <WhatsAppFloat />

      </body>
    </html>
  );
}