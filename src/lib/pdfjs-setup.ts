import { pdfjs } from "react-pdf";

let ready = false;

/** Configure pdf.js worker for react-pdf canvas preview (same blob as download). */
export function ensurePdfJsWorker(): void {
  if (ready || typeof window === "undefined") return;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  ready = true;
}