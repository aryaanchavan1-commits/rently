"use client";

export default function ShareButton({ propertyId, title }: { propertyId: string; title: string }) {
  async function share() {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/properties/${propertyId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Check out: ${title}`, text: `Found on Nivasa: ${title}`, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); share(); }}
      aria-label="Share property"
      style={{
        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
      }}
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2">
        <path strokeLinecap="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
    </button>
  );
}
