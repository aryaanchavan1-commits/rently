import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0b1437 0%, #1a2744 100%)",
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
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg, var(--rently-primary), var(--rently-primary-dark))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 18, color: "white",
              }}>R</div>
              <div>
                <span style={{ fontSize: 22, fontWeight: 800 }}>Rent<span style={{ color: "#C9944A" }}>ly</span></span>
                <div style={{ fontSize: 11, color: "#a8b1c8", marginTop: -2 }}>by Arynoxtech</div>
              </div>
            </div>
            <p style={{ color: "#a8b1c8", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              Maharashtra&apos;s modern rental platform. Find flats, houses & PGs
              across Mumbai, Pune, Thane, Nagpur, Nashik, Kolhapur, Aurangabad,
              and 100+ cities — with zero brokerage and AI-powered search.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                <a key={s} href="#" style={{
                  width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#a8b1c8", fontSize: 14, textDecoration: "none", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#a8b1c8"; }}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, color: "#C9944A" }}>
              Explore
            </h4>
            <FooterLink href="/properties?type=rent">Rent in Mumbai</FooterLink>
            <FooterLink href="/properties?type=rent">Rent in Pune</FooterLink>
            <FooterLink href="/properties?type=rent">Rent in Thane</FooterLink>
            <FooterLink href="/properties?type=rent">Rent in Nagpur</FooterLink>
            <FooterLink href="/properties?type=rent">Rent in Nashik</FooterLink>
            <FooterLink href="/properties">Browse All Maharashtra →</FooterLink>
          </div>

          {/* For Owners */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, color: "#C9944A" }}>
              For Owners
            </h4>
            <FooterLink href="/pricing">Pricing (₹49/week)</FooterLink>
            <FooterLink href="/owner">List Your Property</FooterLink>
            <FooterLink href="/dashboard">Owner Dashboard</FooterLink>
            <FooterLink href="/contracts">E-Contracts (₹50)</FooterLink>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, color: "#C9944A" }}>
              Resources
            </h4>
            <FooterLink href="/commute">Commute Search</FooterLink>
            <FooterLink href="/map">Live Map</FooterLink>
            <FooterLink href="/contracts">AI Contracts</FooterLink>
            <FooterLink href="/inbox">Messages</FooterLink>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, color: "#C9944A" }}>
              Company
            </h4>
            <FooterLink href="#">About Arynoxtech</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Help Center</FooterLink>
            <FooterLink href="mailto:support@arynoxtech.com">Contact Us</FooterLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            color: "#a8b1c8",
            fontSize: 13,
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} <span style={{ fontWeight: 700, color: "white" }}>Arynoxtech</span>. All rights reserved. | Rently is a product of Arynoxtech.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Made with ❤️ in Maharashtra, India
          </div>
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
