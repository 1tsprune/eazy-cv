"use client";

import { useCallback, useState } from "react";
import "./story.css";

const SLIDE_COUNT = 5;

export function IgStoryDeck() {
  const [index, setIndex] = useState(0);
  const [uiHidden, setUiHidden] = useState(false);

  const show = useCallback((n: number) => {
    setIndex((n + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    (e.currentTarget as HTMLElement).dataset.touchX = String(
      e.touches[0].clientX,
    );
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = Number(
      (e.currentTarget as HTMLElement).dataset.touchX ?? "0",
    );
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  };

  const isDark = index === 4;

  return (
    <div
      className="ig-story-root"
      style={{ background: isDark ? "#18181b" : "#000" }}
    >
      <div className={`ig-story-hint-top ${uiHidden ? "hidden" : ""}`}>
        📱 Screenshot tiap slide (Power + Volume Bawah)
        <br />
        Tap <strong>Sembunyikan UI</strong> dulu biar bersih → geser → screenshot
      </div>

      <div
        className="ig-story-deck"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <section
          className={`ig-story-slide ig-story-bg-grid ${index === 0 ? "active" : ""}`}
        >
          <div className="ig-story-blob ig-story-b1" />
          <div className="ig-story-blob ig-story-b2" />
          <div className="ig-story-content ig-story-spacer-top">
            <h1 className="ig-story-headline">
              lagi nyari kerja,
              <br />
              magang, atau kuliah?
            </h1>
            <p className="ig-story-sub">
              CV masih kosong
              <br />
              atau berantakan? 😭
            </p>
          </div>
        </section>

        <section
          className={`ig-story-slide ig-story-bg-grid ${index === 1 ? "active" : ""}`}
        >
          <div className="ig-story-blob ig-story-b3" />
          <div className="ig-story-content ig-story-spacer-top">
            <h1 className="ig-story-headline">ribet banget kan?</h1>
            <div className="ig-story-list">
              <p className="ig-story-list-item ig-story-red">❌ harus login</p>
              <p className="ig-story-list-item ig-story-red">
                ❌ template jelek / cuma 1
              </p>
              <p className="ig-story-list-item ig-story-red">
                ❌ ga tau siap ATS atau belum
              </p>
            </div>
          </div>
        </section>

        <section
          className={`ig-story-slide ig-story-bg-grid ${index === 2 ? "active" : ""}`}
        >
          <div className="ig-story-blob ig-story-b1" />
          <div className="ig-story-blob ig-story-b2" />
          <div className="ig-story-content ig-story-spacer-top">
            <div className="ig-story-logo">
              <div className="ig-story-logo-icon">CV</div>
              <span className="ig-story-logo-text">Eazy CV</span>
            </div>
            <span className="ig-story-tag">bikin CV satset · gaperlu login</span>
            <p className="ig-story-sub" style={{ marginTop: 20 }}>
              gratis · langsung di browser
              <br />
              data cuma di HP / laptop kamu
            </p>
          </div>
        </section>

        <section
          className={`ig-story-slide ig-story-bg-grid ${index === 3 ? "active" : ""}`}
        >
          <div className="ig-story-blob ig-story-b2" />
          <div className="ig-story-content ig-story-spacer-top">
            <h1 className="ig-story-headline">yang bisa kamu lakuin 👇</h1>
            <div className="ig-story-list">
              <p className="ig-story-list-item ig-story-green">
                ✅ 7 template modern
              </p>
              <p className="ig-story-list-item ig-story-green">
                ✅ mode ATS + download PDF
              </p>
              <p className="ig-story-list-item ig-story-green">
                ✅ skor ATS real-time
              </p>
              <p className="ig-story-list-item ig-story-green">
                ✅ preview = hasil PDF
              </p>
              <p className="ig-story-list-item ig-story-green">
                ✅ CV kerja / magang / pelajar
              </p>
            </div>
            <div className="ig-story-mock">
              <div className="ig-story-mock-header" />
              <div className="ig-story-mock-bar" />
              <div className="ig-story-mock-bar short" />
              <div className="ig-story-mock-bar accent" />
              <span className="ig-story-mock-pill">React</span>
              <span className="ig-story-mock-pill">ATS 87</span>
            </div>
          </div>
        </section>

        <section
          className={`ig-story-slide ig-story-bg-dark ${index === 4 ? "active" : ""}`}
        >
          <div className="ig-story-blob ig-story-b1" style={{ opacity: 0.2 }} />
          <div className="ig-story-content ig-story-spacer-top">
            <div className="ig-story-logo">
              <div className="ig-story-logo-icon">CV</div>
              <span className="ig-story-logo-text white">Eazy CV</span>
            </div>
            <div className="ig-story-cta-box">
              <h1 className="ig-story-headline white" style={{ fontSize: 26 }}>
                coba sekarang 👇
              </h1>
              <p className="ig-story-cta-url">cv.1tsprune.com</p>
            </div>
            <p className="ig-story-footer-note" style={{ color: "#71717a" }}>
              by @itsprune · 100% gratis
            </p>
          </div>
        </section>
      </div>

      <div className={`ig-story-chrome ${uiHidden ? "hidden" : ""}`}>
        <div className="ig-story-dots">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <span
              key={i}
              className={`ig-story-dot ${i === index ? "on" : ""}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="ig-story-btn ig-story-btn-ghost"
          onClick={() => setUiHidden((v) => !v)}
        >
          {uiHidden ? "Tampilkan UI" : "Sembunyikan UI"}
        </button>
        <button
          type="button"
          className="ig-story-btn"
          onClick={() => show(index + 1)}
        >
          {index === SLIDE_COUNT - 1 ? "Selesai ✓" : "Slide berikutnya →"}
        </button>
      </div>
    </div>
  );
}