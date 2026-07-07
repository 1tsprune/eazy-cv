import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { APP } from "@/lib/config";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: `${APP.name} — Bikin CV Gratis, No Ribet`,
  description:
    "Bikin CV + preview langsung + cek skor ATS. Gratis tanpa login. Data cuma di browser kamu.",
  icons: {
    icon: [
      { url: "/brand/logo-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: `${APP.name} — Bikin CV Gratis, No Ribet`,
    description:
      "Bikin CV + preview langsung + cek skor ATS. Gratis tanpa login. Data cuma di browser kamu.",
    images: [{ url: "/brand/og-icon.png", width: 512, height: 512, alt: APP.name }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}