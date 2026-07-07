import { pdf, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { ensurePdfSetup } from "@/lib/pdf-setup";

export type PdfDownloadResult = {
  method: "share" | "download" | "tab";
};

function safeFilename(name: string): string {
  const base = name.trim() || "cv";
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

async function sharePdfOnIos(file: File, title: string): Promise<boolean> {
  if (typeof navigator.share !== "function") return false;

  const payload = { files: [file], title };
  try {
    if (navigator.canShare && !navigator.canShare(payload)) {
      return false;
    }
    await navigator.share(payload);
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return true;
    }
    return false;
  }
}

/** Fallback when Web Share API is unavailable or user activation expired. */
export function openPdfInNewTab(blob: Blob, filename: string): boolean {
  const safeName = safeFilename(filename);
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.download = safeName;
  anchor.style.display = "none";
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

export async function deliverPdfBlob(
  blob: Blob,
  filename: string,
): Promise<PdfDownloadResult> {
  const safeName = safeFilename(filename);
  const file = new File([blob], safeName, { type: "application/pdf" });

  if (isIosDevice()) {
    const shared = await sharePdfOnIos(file, safeName);
    if (shared) return { method: "share" };
    openPdfInNewTab(blob, safeName);
    return { method: "tab" };
  }

  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = safeName;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);

  return { method: "download" };
}

export async function renderPdfBlob(
  document: ReactElement<DocumentProps>,
): Promise<Blob> {
  ensurePdfSetup();
  return pdf(document).toBlob();
}

export async function downloadPdfBlob(
  document: ReactElement<DocumentProps>,
  filename: string,
): Promise<PdfDownloadResult> {
  const blob = await renderPdfBlob(document);
  return deliverPdfBlob(blob, filename);
}