import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0b1437",
        color: "white",
        marginTop: 80,
        padding: "60px 0 24px",
      }}
    >
      <div className="container-app">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 800,
                fontSize: 22,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#0d6efd,#0a58ca)",
                  fontWeight: 900,
                }}
              >
                R
              </span>
              <span>
                Rent<span style={{ color: "#ff6a3d" }}>ly</span>
              </span>
            </div>
            <p style={{ color: "#a8b1c8", fontSize: 14, lineHeight: 1.6 }}>
              Maharashtra&apos;s modern rental platform. Find flats, houses & PGs
              across Mumbai, Pune, Thane, Nagpur, Nashik, Kolhapur, Aurangabad,
              and 100+ cities — with zero brokerage and AI-powered search.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14, color: "#ff6a3d" }}>
              Explore
            </h4>
            <FooterLink href="/properties?city=Mumbai">Rent in Mumbai</FooterLink>
            <FooterLink href="/properties?city=Pune">Rent in Pune</FooterLink>
            <FooterLink href="/properties?city=Thane">Rent in Thane</FooterLink>
            <FooterLink href="/properties?city=Nagpur">Rent in Nagpur</FooterLink>
            <FooterLink href="/properties?city=Nashik">Rent in Nashik</FooterLink>
            <FooterLink href="/properties">Browse all Maharashtra →</FooterLink>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14, color: "#ff6a3d" }}>
              Owners
            </h4>
            <FooterLink href="/pricing">₹49/week Plan</FooterLink>
            <FooterLink href="/dashboard">List Property</FooterLink>
            <FooterLink href="/dashboard">Owner Dashboard</FooterLink>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14, color: "#ff6a3d" }}>
              Company
            </h4>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="#">Terms of Use</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Help Center</FooterLink>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 22,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            color: "#a8b1c8",
            fontSize: 13,
          }}
        >
          <div>&copy; 2026 Rently Maharashtra. All rights reserved.</div>
          <div>Made with ❤️ in Pune</div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        color: "#a8b1c8",
        fontSize: 14,
        padding: "5px 0",
        transition: "color 0.15s",
      }}
    >
      {children}
    </Link>
  );
}
