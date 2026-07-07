"use client";

import { MessageCircle } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-110 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-4 sm:py-3"
      aria-label="Konsultasi CV via WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-xs font-bold sm:inline">Tanya CV</span>
    </a>
  );
}