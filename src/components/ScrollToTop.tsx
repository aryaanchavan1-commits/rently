"use client";
import { useState, useEffect, useCallback } from "react";
import { haptics } from "@/lib/haptics";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = useCallback(() => {
    haptics.light();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollTop}
      aria-label="Scroll to top"
      className="scroll-to-top-btn"
      style={{
        position: "fixed",
        bottom: 76,
        left: 16,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "white",
        border: "1.5px solid #e3e7ef",
        boxShadow: "0 4px 16px rgba(11,20,55,0.12)",
        display: visible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 150,
        transition: "opacity 0.2s, transform 0.2s",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.8)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
