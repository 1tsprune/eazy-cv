"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { ensurePdfJsWorker } from "@/lib/pdfjs-setup";

ensurePdfJsWorker();

type Layer = { key: number; blob: Blob };

interface Props {
  blob: Blob;
  width: number;
}

/**
 * Renders the PDF blob to <canvas> via pdf.js — reliable across browsers
 * (incl. iOS Safari) unlike the native PDF-in-iframe viewer.
 *
 * Double-buffered: the previously rendered page stays on screen while the next
 * blob renders underneath (hidden); we only swap once it's fully painted, so
 * editing/template changes never flash a blank frame.
 */
export default function PdfCanvasView({ blob, width }: Props) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const keyRef = useRef(0);

  useEffect(() => {
    setLayers((prev) => {
      if (prev.length && prev[prev.length - 1].blob === blob) return prev;
      if (prev.length === 0) return [{ key: keyRef.current++, blob }];
      // keep the visible base + replace the pending overlay with the newest blob
      return [prev[0], { key: keyRef.current++, blob }];
    });
  }, [blob]);

  const promote = useCallback((key: number) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.key === key);
      if (idx <= 0) return prev; // base already, or discarded
      return prev.slice(idx); // drop the older (now-replaced) layers
    });
  }, []);

  if (width <= 0) return null;

  return (
    <div className="relative w-full">
      {layers.map((layer, i) => {
        const isOverlay = i > 0;
        return (
          <div
            key={layer.key}
            className={isOverlay ? "absolute inset-0" : "relative"}
            style={isOverlay ? { opacity: 0, pointerEvents: "none" } : undefined}
          >
            <PdfLayer
              blob={layer.blob}
              width={width}
              onReady={() => promote(layer.key)}
            />
          </div>
        );
      })}
    </div>
  );
}

function PdfLayer({
  blob,
  width,
  onReady,
}: {
  blob: Blob;
  width: number;
  onReady: () => void;
}) {
  const [numPages, setNumPages] = useState(0);
  const renderedRef = useRef(0);
  const firedRef = useRef(false);

  const handlePageRendered = useCallback(() => {
    renderedRef.current += 1;
    if (numPages > 0 && renderedRef.current >= numPages && !firedRef.current) {
      firedRef.current = true;
      onReady();
    }
  }, [numPages, onReady]);

  return (
    <Document
      file={blob}
      loading={null}
      error={null}
      onLoadSuccess={({ numPages: n }) => setNumPages(n)}
    >
      {Array.from({ length: numPages }, (_, i) => (
        <Page
          key={i}
          pageNumber={i + 1}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onRenderSuccess={handlePageRendered}
          className="mb-2 last:mb-0 shadow-sm"
        />
      ))}
    </Document>
  );
}
