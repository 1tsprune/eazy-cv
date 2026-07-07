import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { APP, SITE_URL, SOCIAL } from "@/lib/config";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const siteTitle = `${APP.name} — Bikin CV Gratis, No Ribet`;
const siteDescription =
  "Bikin CV + preview langsung + cek skor ATS. Gratis tanpa login. Data cuma di browser kamu.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: [
      { url: "/brand/logo-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/brand/og-icon.png", width: 512, height: 512, alt: APP.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/brand/og-icon.png"],
    site: SOCIAL.twitter.handle,
    creator: SOCIAL.twitter.handle,
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