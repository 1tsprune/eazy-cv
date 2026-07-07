import { MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

export function ConsultationCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-10 text-center text-white shadow-2xl shadow-emerald-300/30 sm:p-14">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Phone className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Butuh Bantuan Profesional?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-emerald-50">
              Eazy CV gratis untuk semua orang. Tapi kalau kamu mau konsultasi
              lebih dalam soal CV, strategi ATS, atau review CV kamu — hubungi
              kami langsung via WhatsApp. Gratis konsultasi awal.
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-xl transition hover:scale-105 hover:bg-emerald-50"
            >
              <MessageCircle className="h-5 w-5" />
              {SITE.whatsappDisplay}
            </a>
            <p className="mt-4 text-sm text-emerald-100/80">
              Respon cepat · Bahasa Indonesia · Tips karir & ATS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}