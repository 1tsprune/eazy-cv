import { MessageCircle } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

interface Props {
  variant?: "subtle" | "prominent";
}

export function ConsultationBanner({ variant = "subtle" }: Props) {
  if (variant === "prominent") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-xl shadow-emerald-200">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold">Butuh bantuan review CV?</p>
            <p className="mt-1 text-sm text-emerald-100">
              Konsultasi gratis soal CV, ATS, dan strategi lamaran kerja.
              Hubungi kami via WhatsApp.
            </p>
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            <MessageCircle className="h-4 w-4" />
            {SITE.whatsappDisplay}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 sm:flex-row">
      <p className="text-center text-xs text-emerald-800 sm:text-left">
        <MessageCircle className="mr-1 inline h-3.5 w-3.5" />
        Mau konsultasi lebih soal CV? Hubungi{" "}
        <strong>{SITE.whatsappDisplay}</strong>
      </p>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg bg-[#25D366] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#20BD5A]"
      >
        Chat WhatsApp
      </a>
    </div>
  );
}