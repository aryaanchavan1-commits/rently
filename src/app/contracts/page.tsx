"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";

interface Property {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  deposit: number;
}

interface Contract {
  id: string;
  propertyTitle: string;
  propertyCity: string;
  ownerName: string;
  tenantName: string;
  rentAmount: number;
  securityDeposit: number;
  status: string;
  createdAt: string;
}

export default function ContractsPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const t = (en: string, mr: string, hi: string) => lang === "mr" ? mr : lang === "hi" ? hi : en;

  const [properties, setProperties] = useState<Property[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState<"select" | "details" | "payment" | "esign" | "done">("select");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    rentAmount: 0,
    securityDeposit: 0,
    maintenanceCharges: 0,
    leaseStart: "",
    leaseEnd: "",
    specialRequests: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [propRes, contractRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/contracts"),
      ]);
      const propData = await propRes.json();
      const contractData = await contractRes.json();
      setProperties(Array.isArray(propData) ? propData : []);
      setContracts(Array.isArray(contractData.contracts) ? contractData.contracts : []);
    } catch (err) {
      console.error("Load error:", err);
    }
    setLoading(false);
  }

  function handleSelectProperty(prop: Property) {
    setSelectedProperty(prop);
    setFormData((prev) => ({
      ...prev,
      rentAmount: prop.price,
      securityDeposit: prop.deposit,
    }));
    setStep("details");
  }

  async function handleGenerateContract() {
    if (!selectedProperty) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          propertyTitle: selectedProperty.title,
          propertyAddress: selectedProperty.area,
          propertyCity: selectedProperty.city,
          ...formData,
          templateType: "rental",
          language: lang,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep("payment");
      }
    } catch (err) {
      console.error("Generate error:", err);
    }
    setGenerating(false);
  }

  async function handlePayment() {
    if (!selectedProperty) return;

    try {
      const contractRes = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          propertyTitle: selectedProperty.title,
          propertyAddress: selectedProperty.area,
          propertyCity: selectedProperty.city,
          ...formData,
          templateType: "rental",
          language: lang,
        }),
      });
      const contractData = await contractRes.json();
      setContractId(contractData.contract?.id);
      setShowPaymentModal(true);
    } catch (err) {
      console.error("Generate error:", err);
    }
  }

  async function handlePaymentSuccess(paymentId: string) {
    if (!contractId) return;

    try {
      const verifyRes = await fetch("/api/contracts/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          action: "verify_payment",
          razorpay_payment_id: paymentId,
          razorpay_order_id: `order_${Date.now()}`,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setShowPaymentModal(false);
        setStep("esign");
      }
    } catch (err) {
      console.error("Verify error:", err);
    }
  }

  async function handleInitiateESign() {
    try {
      const res = await fetch("/api/contracts/esign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contracts[contracts.length - 1]?.id,
          action: "initiate_esign",
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`eSign links sent!\n\nOwner: ${formData.ownerEmail}\nTenant: ${formData.tenantEmail}\n\nSigning URL: ${data.signingUrl}`);
        setStep("done");
        loadData();
      }
    } catch (err) {
      console.error("eSign error:", err);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed": return "var(--rently-success)";
      case "pending_esign": return "var(--rently-accent)";
      case "pending_payment": return "var(--rently-warning)";
      case "partially_signed": return "#f59e0b";
      default: return "var(--rently-muted)";
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "draft": return t("ड्राफ्ट", "ड्राफ्ट", "Draft");
      case "pending_payment": return t("पेमेंट बाकी", "भुगतान बाकी", "Payment Pending");
      case "pending_esign": return t("eSign बाकी", "eSign बाकी", "Pending eSign");
      case "partially_signed": return t("अर्ध-स्वाक्षरित", "आंशिक रूप से हस्ताक्षरित", "Partially Signed");
      case "completed": return t("पूर्ण", "पूर्ण", "Completed");
      default: return status;
    }
  }

  return (
    <div className="app">
      <Navbar />
      <main style={{ padding: "24px 0 60px", background: "var(--rently-cream)", minHeight: "calc(100vh - 66px)" }}>
        <div className="container-app">
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--rently-text)" }}>
              📝 {t("ई-कॉन्ट्रैक्ट", "ई-करार", "E-Contracts")}
            </h1>
            <p style={{ fontSize: 15, color: "var(--rently-muted)", marginTop: 6 }}>
              {t("कायदेशीर करार तयार करा, eSign करा आणि PDF डाउनलोड करा", "कानूनी अनुबंध बनाएं, eSign करें और PDF डाउनलोड करें", "Generate legally valid contracts, eSign and download PDF")}
            </p>
          </div>

          {step === "select" && (
            <div className="fade-in">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
                {[
                  { icon: "🏠", title: t("भाडे करार", "भाड़ा करार", "Rental Agreement"), desc: t("भाडेकर आणि मालक यांच्यातील करार", "किरायेदार और मालिक के बीच करार", "Agreement between tenant and owner"), price: 50 },
                  { icon: "🏨", title: t("PG करार", "PG करार", "PG Agreement"), desc: t("पीजी/हॉस्टल करार", "PG/हॉस्टल करार", "PG/Hostel agreement"), price: 50 },
                  { icon: "💼", title: t("व्यावसायिक करार", "व्यावसायिक करार", "Commercial Lease"), desc: t("ऑफिस/दुकान करार", "ऑफिस/दुकान करार", "Office/Shop lease"), price: 50 },
                ].map((tpl) => (
                  <button key={tpl.title} onClick={() => setShowCreateForm(true)} style={{
                    padding: 24, borderRadius: 16, textAlign: "left", cursor: "pointer",
                    border: "1px solid var(--rently-border)", background: "var(--rently-card)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--rently-primary)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(44,82,130,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--rently-border)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 12 }}>{tpl.icon}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--rently-text)", marginBottom: 4 }}>{tpl.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--rently-muted)", marginBottom: 12 }}>{tpl.desc}</p>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--rently-primary)" }}>₹{tpl.price}</div>
                    <div style={{ fontSize: 11, color: "var(--rently-muted)" }}>{t("प्रति करार", "प्रति करार", "per contract")}</div>
                  </button>
                ))}
              </div>

              {contracts.length > 0 && (
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--rently-text)", marginBottom: 16 }}>
                    {t("तुमचे करार", "आपके करार", "Your Contracts")}
                  </h2>
                  <div style={{ display: "grid", gap: 12 }}>
                    {contracts.map((c) => (
                      <div key={c.id} style={{
                        padding: 16, borderRadius: 12, border: "1px solid var(--rently-border-light)",
                        background: "var(--rently-card)", display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexWrap: "wrap", gap: 12,
                      }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--rently-text)" }}>{c.propertyTitle}</div>
                          <div style={{ fontSize: 13, color: "var(--rently-muted)" }}>📍 {c.propertyCity} · ₹{c.rentAmount.toLocaleString("en-IN")}/mo</div>
                        </div>
                        <span style={{
                          padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                          background: `${getStatusColor(c.status)}15`, color: getStatusColor(c.status),
                        }}>
                          {getStatusLabel(c.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(step === "details" || (showCreateForm && step === "select")) && (
            <div className="fade-in card-cream" style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--rently-text)", marginBottom: 16 }}>
                {step === "select" ? t("मालमत्ता निवडा", "प्रॉपर्टी चुनें", "Select Property") : t("करार तपशील", "करार विवरण", "Contract Details")}
              </h2>

              {step === "select" && (
                <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                  {properties.map((p) => (
                    <button key={p.id} onClick={() => handleSelectProperty(p)} style={{
                      padding: "12px 16px", borderRadius: 10, textAlign: "left", cursor: "pointer",
                      border: "1px solid var(--rently-border-light)", background: "var(--rently-card)",
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--rently-text)" }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: "var(--rently-muted)" }}>📍 {p.area}, {p.city} · ₹{p.price.toLocaleString("en-IN")}/mo</div>
                    </button>
                  ))}
                </div>
              )}

              {step === "details" && (
                <div style={{ display: "grid", gap: 14 }}>
                  <div style={{ background: "var(--rently-primary-light)", padding: 12, borderRadius: 10, fontSize: 13, color: "var(--rently-primary)" }}>
                    📝 {t("AI तुमचा करार आपोआप तयार करेल", "AI आपका करार स्वचालित रूप से बनाएगा", "AI will automatically generate your contract")}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                        {t("मालकाचे नाव", "मालिक का नाम", "Owner Name")} *
                      </label>
                      <input className="input" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} placeholder="Rajesh Kumar" />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                        {t("मालकाचा फोन", "मालिक का फ़ोन", "Owner Phone")} *
                      </label>
                      <input className="input" value={formData.ownerPhone} onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                      {t("मालकाचा ईमेल", "मालिक का ईमेल", "Owner Email")} *
                    </label>
                    <input className="input" type="email" value={formData.ownerEmail} onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })} placeholder="owner@email.com" />
                  </div>

                  <div style={{ borderTop: "1px solid var(--rently-border-light)", paddingTop: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                          {t("भाडेकराचे नाव", "किरायेदार का नाम", "Tenant Name")} *
                        </label>
                        <input className="input" value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} placeholder="Amit Patil" />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                          {t("भाडेकराचा फोन", "किरायेदार का फ़ोन", "Tenant Phone")} *
                        </label>
                        <input className="input" value={formData.tenantPhone} onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })} placeholder="+91 87654 32109" />
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                        {t("भाडेकराचा ईमेल", "किरायेदार का ईमेल", "Tenant Email")} *
                      </label>
                      <input className="input" type="email" value={formData.tenantEmail} onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })} placeholder="tenant@email.com" />
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--rently-border-light)", paddingTop: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                          {t("मासिक भाडे", "मासिक किराया", "Monthly Rent")} *
                        </label>
                        <input className="input" type="number" value={formData.rentAmount} onChange={(e) => setFormData({ ...formData, rentAmount: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                          {t("सुरक्षा भांडवल", "सिक्योरिटी डिपॉजिट", "Security Deposit")}
                        </label>
                        <input className="input" type="number" value={formData.securityDeposit} onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                          {t("देखभाल शुल्क", "मेंटेनेंस चार्ज", "Maintenance")}
                        </label>
                        <input className="input" type="number" value={formData.maintenanceCharges} onChange={(e) => setFormData({ ...formData, maintenanceCharges: Number(e.target.value) })} />
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--rently-border-light)", paddingTop: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                          {t("सुरू होण्याची तारीख", "शुरू होने की तिथि", "Start Date")} *
                        </label>
                        <input className="input" type="date" value={formData.leaseStart} onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                          {t("संपण्याची तारीख", "खत्म होने की तिथि", "End Date")} *
                        </label>
                        <input className="input" type="date" value={formData.leaseEnd} onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--rently-text)", display: "block", marginBottom: 4 }}>
                      {t("विशेष विनंत्या (AI यांना सांगा)", "विशेष अनुरोध (AI को बताएं)", "Special Requests (Tell AI)")}
                    </label>
                    <textarea className="input" rows={3} value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} placeholder={t("उदा. पालतू प्राणी अनुमत, अतिरिक्त पार्किंग, वायफाय बंधन…", "जैसे पालतू जानवर की अनुमति, अतिरिक्त पार्किंग…", "e.g. Pets allowed, extra parking, WiFi included…")} style={{ resize: "vertical" }} />
                  </div>

                  <button onClick={handleGenerateContract} className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }} disabled={generating || !formData.ownerName || !formData.tenantName || !formData.leaseStart || !formData.leaseEnd}>
                    {generating ? `⏳ ${t("AI करार तयार करत आहे…", "AI करार बना रहा है…", "AI generating contract…")}` : `📝 ${t("AI ने करार तयार करा", "AI से करार बनाएं", "Generate Contract with AI")}`}
                  </button>
                </div>
              )}
            </div>
          )}

          {step === "payment" && (
            <div className="fade-in card-cream" style={{ padding: 24, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--rently-text)", marginBottom: 8 }}>
                {t("पेमेंट आवश्यक", "भुगतान आवश्यक", "Payment Required")}
              </h2>
              <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>
                {t("करार तयार करण्यासाठी ₹50 भरा", "करार बनाने के लिए ₹50 भरें", "Pay ₹50 to generate your contract")}
              </p>
              <div style={{ background: "var(--rently-cream-dark)", borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: "var(--rently-muted)" }}>{t("करार शुल्क", "करार शुल्क", "Contract Fee")}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>₹50</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--rently-muted)" }}>
                  <span>{t("शामिल आहे", "शामिल है", "Includes")}</span>
                  <span>{t("AI करार + eSign + PDF", "AI करार + eSign + PDF", "AI Contract + eSign + PDF")}</span>
                </div>
              </div>
              <button onClick={handlePayment} className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                💳 {t("₹50 भरा", "₹50 भरें", "Pay ₹50")}
              </button>
            </div>
          )}

          {step === "esign" && (
            <div className="fade-in card-cream" style={{ padding: 24, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--rently-text)", marginBottom: 8 }}>
                {t("eSign करा", "eSign करें", "eSign Contract")}
              </h2>
              <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>
                {t("दोन्ही पक्षांना eSign लिंक पाठवली जाईल", "दोनों पक्षों को eSign लिंक भेजा जाएगा", "eSign links will be sent to both parties")}
              </p>
              <div style={{ background: "var(--rently-cream-dark)", borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontSize: 13, color: "var(--rently-muted)", marginBottom: 8 }}>
                  📧 {t("ईमेल प्राप्तकर्ता", "ईमेल प्राप्तकर्ता", "Email Recipients")}:
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>👤 {formData.ownerName}: {formData.ownerEmail}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>👤 {formData.tenantName}: {formData.tenantEmail}</div>
              </div>
              <button onClick={handleInitiateESign} className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                ✉️ {t("eSign लिंक पाठवा", "eSign लिंक भेजें", "Send eSign Links")}
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="fade-in card-cream" style={{ padding: 24, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--rently-text)", marginBottom: 8 }}>
                {t("करार तयार!", "करार तैयार!", "Contract Ready!")}
              </h2>
              <p style={{ fontSize: 14, color: "var(--rently-muted)", marginBottom: 20 }}>
                {t("दोन्ही पक्षांना eSign लिंक मिळाला आहे. स्वाक्षरी झाल्यावर तुम्हाला PDF मिळेल.", "दोनों पक्षों को eSign लिंक मिल गया है। हस्ताक्षर होने पर PDF मिलेगा।", "Both parties received eSign links. You'll get the PDF once signed.")}
              </p>
              <button onClick={() => { setStep("select"); setShowCreateForm(false); loadData(); }} className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }}>
                {t("पुन्हा सुरू करा", "फिर से शुरू करें", "Start Again")}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={50}
        description="E-Contract Generation"
        prefill={{
          name: formData.ownerName,
          email: formData.ownerEmail,
          contact: formData.ownerPhone,
        }}
      />
    </div>
  );
}
