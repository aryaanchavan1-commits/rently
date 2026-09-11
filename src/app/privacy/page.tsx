export default function PrivacyPage() {
  return (
    <div className="container-app" style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--nivasa-text)", marginBottom: 16 }}>
        Privacy Policy
      </h1>
      <p style={{ color: "var(--nivasa-text-muted)", marginBottom: 24, fontSize: 14 }}>
        Last updated: September 11, 2026
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "var(--nivasa-text)", lineHeight: 1.7 }}>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>1. Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Account information (name, email, phone number)</li>
            <li>Property listings (photos, descriptions, pricing)</li>
            <li>Messages sent through our platform</li>
            <li>Location data (with your permission) for commute search</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>2. How We Use Your Information</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li>To provide and improve our rental platform</li>
            <li>To connect tenants with property owners</li>
            <li>To calculate commute times and nearby amenities</li>
            <li>To detect and prevent scams</li>
            <li>To send important account updates</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We share information only:
          </p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>When you contact a property owner (your inquiry is shared with them)</li>
            <li>When required by law</li>
            <li>With service providers who help us operate (Supabase, Vercel, Leegality)</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>4. Data Security</h2>
          <p>
            We use industry-standard encryption and security measures. Messages are end-to-end encrypted.
            We never store payment card details — payments are processed through Razorpay.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>5. Your Rights</h2>
          <p>You can:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Access and update your personal information</li>
            <li>Delete your account and data</li>
            <li>Opt out of non-essential communications</li>
            <li>Request a copy of your data</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>6. Contact Us</h2>
          <p>
            For privacy concerns, contact us at:{" "}
            <a href="mailto:privacy@nivasa.in" style={{ color: "var(--nivasa-primary)" }}>
              privacy@nivasa.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
