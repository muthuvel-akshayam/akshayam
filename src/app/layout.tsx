import type { Metadata } from "next";
import { Geist, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSerifTamil = Noto_Serif_Tamil({
  variable: "--font-noto-serif-tamil",
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import { LanguageProvider } from "@/frontend/context/LanguageContext";

export const metadata: Metadata = {
  title: "அக்‌ஷயம் | Akshayam Matrimony",
  description: "ஜாதகம் முதல் பந்தி வரை - திருமணத் தகவல் மையம்",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ta"
      className={`${geistSans.variable} ${notoSerifTamil.variable} h-full w-full max-w-full overflow-x-hidden antialiased`}
    >
      <body className="min-h-full w-full max-w-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
