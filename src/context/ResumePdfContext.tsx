"use client";

import { usePDF } from "@react-pdf/renderer";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { buildResumePdfDocument } from "@/lib/build-resume-pdf-document";
import { useResume } from "@/context/ResumeContext";
import { ensurePdfSetup } from "@/lib/pdf-setup";

type ResumePdfContextValue = {
  url: string | null;
  blob: Blob | null;
  loading: boolean;
  error: string | null;
  waitForBlob: () => Promise<Blob>;
};

const ResumePdfContext = createContext<ResumePdfContextValue | null>(null);

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ResumePdfProvider({ children }: { children: ReactNode }) {
  const { data, config } = useResume();

  useEffect(() => {
    ensurePdfSetup();
  }, []);

  const document = useMemo(
    () => buildResumePdfDocument(data, config),
    [data, config],
  );

  const [pdfState] = usePDF({ document });
  const stateRef = useRef(pdfState);
  stateRef.current = pdfState;

  const waitForBlob = useCallback(async (): Promise<Blob> => {
    for (let i = 0; i < 400; i++) {
      const state = stateRef.current;
      if (state.blob && !state.loading) return state.blob;
      if (state.error) throw new Error(state.error);
      await waitMs(50);
    }
    throw new Error("pdf_timeout");
  }, []);

  const value = useMemo(
    (): ResumePdfContextValue => ({
      url: pdfState.url,
      blob: pdfState.blob,
      loading: pdfState.loading,
      error: pdfState.error,
      waitForBlob,
    }),
    [
      pdfState.url,
      pdfState.blob,
      pdfState.loading,
      pdfState.error,
      waitForBlob,
    ],
  );

  return (
    <ResumePdfContext.Provider value={value}>
      {children}
    </ResumePdfContext.Provider>
  );
}

export function useResumePdf(): ResumePdfContextValue {
  const ctx = useContext(ResumePdfContext);
  if (!ctx) {
    throw new Error("useResumePdf must be used within ResumePdfProvider");
  }
  return ctx;
}

/** Optional hook for components that may render outside the provider. */
export function useResumePdfOptional(): ResumePdfContextValue | null {
  return useContext(ResumePdfContext);
}