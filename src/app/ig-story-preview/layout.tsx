import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export default function IgStoryLayout({ children }: { children: ReactNode }) {
  return <div className={inter.className}>{children}</div>;
}