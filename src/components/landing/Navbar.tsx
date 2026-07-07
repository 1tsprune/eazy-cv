import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { SITE, whatsappUrl } from "@/lib/site";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            CV
          </span>
          <span className="text-lg font-bold text-zinc-900">Eazy CV</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/docs"
            className="hidden text-sm font-medium text-zinc-500 transition hover:text-zinc-900 sm:block"
          >
            Docs
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-sm font-medium text-emerald-600 transition hover:text-emerald-800 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden md:inline">{SITE.whatsappDisplay}</span>
            <span className="md:hidden">Konsultasi</span>
          </a>
          <Link
            href="/builder"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Buat CV
          </Link>
        </div>
      </div>
    </nav>
  );
}