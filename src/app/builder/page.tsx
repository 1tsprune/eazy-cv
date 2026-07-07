"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function BuilderRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center">
      <Logo variant="icon" size="md" />
      <p className="text-sm text-zinc-500">Mengalihkan ke builder...</p>
      <Link
        href="/"
        className="text-sm font-semibold text-slate-700 underline-offset-2 hover:underline"
      >
        Klik di sini kalau tidak otomatis
      </Link>
    </div>
  );
}