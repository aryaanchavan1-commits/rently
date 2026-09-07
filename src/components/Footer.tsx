import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-app">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-icon">R</div>
              <div>
                <span className="footer-logo-text">Rent<span className="footer-logo-accent">ly</span></span>
                <span className="footer-logo-byline">by Arynoxtech</span>
              </div>
            </Link>
            <p className="footer-tagline">
              Zero brokerage rental platform connecting tenants directly with verified owners across Maharashtra. AI-powered search, e-contracts, and secure payments.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">For Tenants</h4>
            <Link href="/properties?type=rent" className="footer-link">Rent a Property</Link>
            <Link href="/properties?type=buy" className="footer-link">Buy a Property</Link>
            <Link href="/commute" className="footer-link">Commute Search</Link>
            <Link href="/map" className="footer-link">Live Map</Link>
            <Link href="/contracts" className="footer-link">E-Contracts</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">For Owners</h4>
            <Link href="/owner" className="footer-link">List Property</Link>
            <Link href="/dashboard" className="footer-link">Owner Dashboard</Link>
            <Link href="/pricing" className="footer-link">Pricing Plans</Link>
            <Link href="/contracts" className="footer-link">E-Contract Service</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <Link href="#" className="footer-link">About Arynoxtech</Link>
            <Link href="#" className="footer-link">Terms of Service</Link>
            <Link href="#" className="footer-link">Privacy Policy</Link>
            <Link href="mailto:support@arynoxtech.com" className="footer-link">Contact Us</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} <strong>Arynoxtech</strong>. All rights reserved. | Rently is a product of Arynoxtech.
          </div>
          <div className="footer-made">Made in Maharashtra, India</div>
        </div>
      </div>

      <style>{`
        .footer { background: #0f172a; color: #94a3b8; margin-top: 0; padding: 56px 0 0; }
        .footer-grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 40px; padding-bottom: 40px;
        }
        .footer-brand {}
        .footer-logo {
          display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 14px;
        }
        .footer-logo-icon {
          width: 36px; height: 36px; border-radius: var(--radius);
          background: var(--primary); color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px;
        }
        .footer-logo-text { font-size: 20px; font-weight: 800; color: white; display: block; line-height: 1.1; }
        .footer-logo-accent { color: var(--primary); }
        .footer-logo-byline { font-size: 10px; color: #64748b; display: block; margin-top: 1px; }
        .footer-tagline { font-size: 14px; line-height: 1.7; color: #94a3b8; max-width: 300px; }
        .footer-col-title {
          font-size: 13px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; color: white; margin-bottom: 14px;
        }
        .footer-link {
          display: block; font-size: 14px; color: #94a3b8;
          padding: 4px 0; transition: color 0.15s; text-decoration: none;
        }
        .footer-link:hover { color: white; }
        .footer-bottom {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 13px; flex-wrap: wrap; gap: 8px;
        }
        .footer-copyright { color: #64748b; }
        .footer-copyright strong { color: white; }
        .footer-made { color: #64748b; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
