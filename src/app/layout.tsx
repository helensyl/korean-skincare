import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond, Bodoni_Moda } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Olive Pick — Build Your Skincare Routine",
  description: "Discover, build and analyse your K-beauty skincare routine with Olive Pick",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
