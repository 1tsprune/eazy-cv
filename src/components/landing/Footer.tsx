import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { SITE, whatsappUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-900 py-14 text-zinc-400">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold text-white">
                CV
              </span>
              <span className="text-lg font-bold text-white">Eazy CV</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              CV builder terbaik yang pernah ada. Gratis, tanpa login, 100% di
              browser kamu.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Navigasi</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/builder" className="hover:text-white">
                  Buat CV
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white">
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Konsultasi CV</h4>
            <p className="mt-3 text-sm leading-relaxed">
              Mau konsultasi lebih soal CV, ATS, atau review CV kamu?
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20BD5A]"
            >
              <MessageCircle className="h-4 w-4" />
              {SITE.whatsappDisplay}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs">
          © 2026 Eazy CV · 100% gratis · Tanpa login · Data tetap di browser
          kamu
        </div>
      </div>
    </footer>
  );
}