import {
  ArrowRight,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { SITE, whatsappUrl } from "@/lib/site";
import { CVMockup } from "./CVMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-slate-200/30 blur-3xl" />
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-zinc-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700">
            <Sparkles className="h-4 w-4" />
            7 Template · Mode ATS · 100% Gratis
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            CV Profesional yang{" "}
            <span className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent">
              Bikin Kamu Diterima
            </span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-zinc-500">
            7 template modern, mode ATS, skor real-time, dan download PDF
            instan — semua di browser, tanpa login. Preview = hasil PDF,
            data cuma di perangkat kamu.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/builder"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-700 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-200 transition hover:bg-slate-800 sm:w-auto"
            >
              Mulai Buat CV Gratis
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-4 text-base font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Konsultasi CV
            </a>
          </div>

          <p className="mt-3 text-xs text-zinc-400">
            Konsultasi via WhatsApp:{" "}
            <a
              href={whatsappUrl()}
              className="font-medium text-emerald-600 hover:underline"
            >
              {SITE.whatsappDisplay}
            </a>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
            {[
              { icon: Zap, label: "PDF instan" },
              { icon: Shield, label: "Zero tracking" },
              { icon: Star, label: "ATS Score" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-zinc-500"
              >
                <Icon className="h-4 w-4 text-slate-600" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <CVMockup />
        </div>
      </div>
    </section>
  );
}