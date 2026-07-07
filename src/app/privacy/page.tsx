import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-slate-700 hover:text-slate-900"
        >
          ← Kembali ke Home
        </Link>
        <h1 className="mt-6 text-4xl font-bold text-zinc-900">
          Kebijakan Privasi
        </h1>
        <p className="mt-4 text-sm text-zinc-400">
          Terakhir diperbarui: Juli 2026
        </p>

        <section className="mt-12 space-y-8 text-sm leading-relaxed text-zinc-600">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Ringkasan
            </h2>
            <p className="mt-3">
              Eazy CV tidak mengumpulkan, menyimpan, atau memproses data pribadi
              kamu di server manapun. Seluruh aplikasi berjalan di browser
              kamu secara lokal.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Data yang Disimpan
            </h2>
            <p className="mt-3">
              Data CV kamu disimpan di Local Storage browser perangkat kamu.
              Kami tidak memiliki akses ke data ini. Kamu dapat menghapusnya
              kapan saja melalui fitur Reset atau pengaturan browser.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Tidak Ada Tracking
            </h2>
            <p className="mt-3">
              Eazy CV tidak menggunakan cookies, Google Analytics, atau layanan
              tracking pihak ketiga manapun.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Verifikasi Sendiri
            </h2>
            <p className="mt-3">
              Buka DevTools → Network tab saat menggunakan Eazy CV. Kamu akan
              melihat bahwa tidak ada request yang mengirim data CV ke server
              eksternal.
            </p>
          </div>
        </section>
      </article>
      <Footer />
    </div>
  );
}