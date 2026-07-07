import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <Logo variant="icon" size="lg" className="mb-8" />
        <p className="text-[7rem] font-black leading-none tracking-tighter text-slate-200">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
          Link salah, halaman sudah dipindah, atau URL tidak ada di Eazy CV.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Home className="h-4 w-4" />
            Ke beranda
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat docs
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}