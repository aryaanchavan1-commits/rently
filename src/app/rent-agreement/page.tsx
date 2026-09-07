"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AgreementData {
  landlordName: string;
  landlordAddress: string;
  landlordPhone: string;
  tenantName: string;
  tenantAddress: string;
  tenantPhone: string;
  tenantIdProof: string;
  tenantIdNumber: string;
  propertyAddress: string;
  propertyArea: string;
  propertyCity: string;
  propertyType: string;
  propertyDescription: string;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges: number;
  leaseStart: string;
  leaseEnd: string;
  lockInPeriod: number;
  noticePeriod: number;
  rentDueDate: number;
  paymentMode: string;
  lateFeePercent: number;
  allowedUse: string;
  petPolicy: string;
  guestPolicy: string;
  smokingPolicy: string;
  otherTerms: string;
}

const defaultData: AgreementData = {
  landlordName: "", landlordAddress: "", landlordPhone: "",
  tenantName: "", tenantAddress: "", tenantPhone: "", tenantIdProof: "Aadhaar", tenantIdNumber: "",
  propertyAddress: "", propertyArea: "", propertyCity: "", propertyType: "Apartment",
  propertyDescription: "", monthlyRent: 0, securityDeposit: 0, maintenanceCharges: 0,
  leaseStart: "", leaseEnd: "", lockInPeriod: 6, noticePeriod: 2, rentDueDate: 5,
  paymentMode: "Bank Transfer", lateFeePercent: 2, allowedUse: "Residential",
  petPolicy: "Not Allowed", guestPolicy: "Allowed with prior notice", smokingPolicy: "Not Allowed",
  otherTerms: "",
};

function formatDate(d: string) {
  if (!d) return "___/___/______";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function numberToWords(n: number): string {
  if (n === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + numberToWords(n % 100) : "");
  if (n < 100000) return numberToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numberToWords(n % 1000) : "");
  if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numberToWords(n % 100000) : "");
  return numberToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numberToWords(n % 10000000) : "");
}

export default function RentAgreementPage() {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [data, setData] = useState<AgreementData>(defaultData);
  const [downloading, setDownloading] = useState(false);

  const update = (field: keyof AgreementData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = data.landlordName && data.tenantName && data.propertyAddress && data.monthlyRent > 0 && data.leaseStart && data.leaseEnd;

  function handlePrint() {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  }

  return (
    <div className="page-cream">
      <Navbar />
      <div className="container-app" style={{ padding: "30px 20px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="text-royal" style={{ fontSize: 24, fontWeight: 800 }}>Rent Agreement Generator</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
            Generate a Maharashtra-standard rent agreement. Fill in the details below.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button onClick={() => setStep("form")} className={`btn btn-sm ${step === "form" ? "btn-primary" : "btn-outline"}`}>
            1. Fill Details
          </button>
          <button onClick={() => isValid && setStep("preview")} disabled={!isValid} className={`btn btn-sm ${step === "preview" ? "btn-primary" : "btn-outline"}`}>
            2. Preview & Print
          </button>
        </div>

        {step === "form" ? (
          <div className="fade-in" style={{ display: "grid", gap: 20, maxWidth: 800 }}>
            {/* Landlord Details */}
            <div className="card-cream" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 14 }}>Landlord Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="input" value={data.landlordName} onChange={e => update("landlordName", e.target.value)} placeholder="Rajesh Kumar Sharma" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="input" value={data.landlordPhone} onChange={e => update("landlordPhone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Address</label>
                  <textarea className="input" value={data.landlordAddress} onChange={e => update("landlordAddress", e.target.value)} placeholder="Complete address" rows={2} />
                </div>
              </div>
            </div>

            {/* Tenant Details */}
            <div className="card-cream" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 14 }}>Tenant Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="input" value={data.tenantName} onChange={e => update("tenantName", e.target.value)} placeholder="Priya Patil" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="input" value={data.tenantPhone} onChange={e => update("tenantPhone", e.target.value)} placeholder="+91 98765 43211" />
                </div>
                <div>
                  <label className="form-label">ID Proof</label>
                  <select className="input" value={data.tenantIdProof} onChange={e => update("tenantIdProof", e.target.value)}>
                    <option>Aadhaar</option>
                    <option>PAN Card</option>
                    <option>Passport</option>
                    <option>Voter ID</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">ID Number</label>
                  <input className="input" value={data.tenantIdNumber} onChange={e => update("tenantIdNumber", e.target.value)} placeholder="ID Number" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Address</label>
                  <textarea className="input" value={data.tenantAddress} onChange={e => update("tenantAddress", e.target.value)} placeholder="Permanent address" rows={2} />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="card-cream" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 14 }}>Property Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Full Property Address *</label>
                  <input className="input" value={data.propertyAddress} onChange={e => update("propertyAddress", e.target.value)} placeholder="Flat/House No., Building, Street, Landmark" />
                </div>
                <div>
                  <label className="form-label">Area / Locality</label>
                  <input className="input" value={data.propertyArea} onChange={e => update("propertyArea", e.target.value)} placeholder="Andheri West" />
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <input className="input" value={data.propertyCity} onChange={e => update("propertyCity", e.target.value)} placeholder="Mumbai" />
                </div>
                <div>
                  <label className="form-label">Property Type</label>
                  <select className="input" value={data.propertyType} onChange={e => update("propertyType", e.target.value)}>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Room</option>
                    <option>Office</option>
                    <option>Shop</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Usage</label>
                  <select className="input" value={data.allowedUse} onChange={e => update("allowedUse", e.target.value)}>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Residential-cum-Commercial</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Description (Optional)</label>
                  <textarea className="input" value={data.propertyDescription} onChange={e => update("propertyDescription", e.target.value)} placeholder="2BHK, 3rd floor, east facing, 800 sq ft" rows={2} />
                </div>
              </div>
            </div>

            {/* Financial Terms */}
            <div className="card-cream" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 14 }}>Financial Terms</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Monthly Rent (₹) *</label>
                  <input type="number" className="input" value={data.monthlyRent || ""} onChange={e => update("monthlyRent", Number(e.target.value))} placeholder="22000" />
                </div>
                <div>
                  <label className="form-label">Security Deposit (₹)</label>
                  <input type="number" className="input" value={data.securityDeposit || ""} onChange={e => update("securityDeposit", Number(e.target.value))} placeholder="44000" />
                </div>
                <div>
                  <label className="form-label">Maintenance (₹/month)</label>
                  <input type="number" className="input" value={data.maintenanceCharges || ""} onChange={e => update("maintenanceCharges", Number(e.target.value))} placeholder="2000" />
                </div>
                <div>
                  <label className="form-label">Rent Due Date</label>
                  <select className="input" value={data.rentDueDate} onChange={e => update("rentDueDate", Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 7, 10].map(d => <option key={d} value={d}>{d}{d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th"}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Payment Mode</label>
                  <select className="input" value={data.paymentMode} onChange={e => update("paymentMode", e.target.value)}>
                    <option>Bank Transfer (NEFT/RTGS)</option>
                    <option>UPI</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Late Fee (%/month)</label>
                  <input type="number" className="input" value={data.lateFeePercent} onChange={e => update("lateFeePercent", Number(e.target.value))} />
                </div>
              </div>
            </div>

            {/* Lease Terms */}
            <div className="card-cream" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 14 }}>Lease Terms</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Lease Start Date *</label>
                  <input type="date" className="input" value={data.leaseStart} onChange={e => update("leaseStart", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Lease End Date *</label>
                  <input type="date" className="input" value={data.leaseEnd} onChange={e => update("leaseEnd", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Lock-in Period (months)</label>
                  <input type="number" className="input" value={data.lockInPeriod} onChange={e => update("lockInPeriod", Number(e.target.value))} />
                </div>
                <div>
                  <label className="form-label">Notice Period (months)</label>
                  <input type="number" className="input" value={data.noticePeriod} onChange={e => update("noticePeriod", Number(e.target.value))} />
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="card-cream" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)", marginBottom: 14 }}>House Rules</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Pet Policy</label>
                  <select className="input" value={data.petPolicy} onChange={e => update("petPolicy", e.target.value)}>
                    <option>Not Allowed</option>
                    <option>Allowed</option>
                    <option>Allowed with deposit</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Smoking Policy</label>
                  <select className="input" value={data.smokingPolicy} onChange={e => update("smokingPolicy", e.target.value)}>
                    <option>Not Allowed</option>
                    <option>Allowed on balcony only</option>
                    <option>Allowed</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Guest Policy</label>
                  <input className="input" value={data.guestPolicy} onChange={e => update("guestPolicy", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Other Terms & Conditions</label>
                  <textarea className="input" value={data.otherTerms} onChange={e => update("otherTerms", e.target.value)} placeholder="Any additional terms..." rows={3} />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button onClick={() => isValid && setStep("preview")} disabled={!isValid} className="btn btn-primary" style={{ padding: "14px 28px", fontSize: 16 }}>
              Generate Agreement Preview
            </button>
          </div>
        ) : (
          /* Preview */
          <div className="fade-in">
            <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setStep("form")} className="btn btn-outline btn-sm">Edit Details</button>
              <button onClick={handlePrint} disabled={downloading} className="btn btn-primary btn-sm">
                {downloading ? "Preparing..." : "Print / Save PDF"}
              </button>
            </div>

            <div className="agreement-preview" id="agreement-print">
              <h2>RENT AGREEMENT</h2>
              <h3>Under the Maharashtra Rent Control Act, 1999 & Model Tenancy Act, 2021</h3>

              <div className="agreement-section">
                <div className="agreement-section-title">1. PARTIES</div>
                <div className="agreement-field"><span className="agreement-label">Landlord:</span><span className="agreement-value">{data.landlordName}</span></div>
                {data.landlordAddress && <div className="agreement-field"><span className="agreement-label">Landlord Address:</span><span className="agreement-value">{data.landlordAddress}</span></div>}
                {data.landlordPhone && <div className="agreement-field"><span className="agreement-label">Landlord Phone:</span><span className="agreement-value">{data.landlordPhone}</span></div>}
                <div className="agreement-field"><span className="agreement-label">Tenant:</span><span className="agreement-value">{data.tenantName}</span></div>
                {data.tenantPhone && <div className="agreement-field"><span className="agreement-label">Tenant Phone:</span><span className="agreement-value">{data.tenantPhone}</span></div>}
                {data.tenantIdNumber && <div className="agreement-field"><span className="agreement-label">Tenant ID:</span><span className="agreement-value">{data.tenantIdProof} - {data.tenantIdNumber}</span></div>}
              </div>

              <div className="agreement-section">
                <div className="agreement-section-title">2. PROPERTY</div>
                <div className="agreement-field"><span className="agreement-label">Address:</span><span className="agreement-value">{data.propertyAddress}</span></div>
                {data.propertyArea && <div className="agreement-field"><span className="agreement-label">Area:</span><span className="agreement-value">{data.propertyArea}</span></div>}
                <div className="agreement-field"><span className="agreement-label">City:</span><span className="agreement-value">{data.propertyCity}</span></div>
                <div className="agreement-field"><span className="agreement-label">Type:</span><span className="agreement-value">{data.propertyType} ({data.allowedUse})</span></div>
                {data.propertyDescription && <div className="agreement-field"><span className="agreement-label">Description:</span><span className="agreement-value">{data.propertyDescription}</span></div>}
              </div>

              <div className="agreement-section">
                <div className="agreement-section-title">3. FINANCIAL TERMS</div>
                <div className="agreement-field"><span className="agreement-label">Monthly Rent:</span><span className="agreement-value">₹{data.monthlyRent.toLocaleString("en-IN")} ({numberToWords(data.monthlyRent)} Rupees Only)</span></div>
                {data.securityDeposit > 0 && <div className="agreement-field"><span className="agreement-label">Security Deposit:</span><span className="agreement-value">₹{data.securityDeposit.toLocaleString("en-IN")} ({numberToWords(data.securityDeposit)} Rupees Only)</span></div>}
                {data.maintenanceCharges > 0 && <div className="agreement-field"><span className="agreement-label">Maintenance:</span><span className="agreement-value">₹{data.maintenanceCharges.toLocaleString("en-IN")}/month</span></div>}
                <div className="agreement-field"><span className="agreement-label">Rent Due Date:</span><span className="agreement-value">{data.rentDueDate}{data.rentDueDate === 1 ? "st" : data.rentDueDate === 2 ? "nd" : data.rentDueDate === 3 ? "rd" : "th"} of each month</span></div>
                <div className="agreement-field"><span className="agreement-label">Payment Mode:</span><span className="agreement-value">{data.paymentMode}</span></div>
                <div className="agreement-field"><span className="agreement-label">Late Fee:</span><span className="agreement-value">{data.lateFeePercent}% per month on overdue amount</span></div>
              </div>

              <div className="agreement-section">
                <div className="agreement-section-title">4. LEASE TERM</div>
                <div className="agreement-field"><span className="agreement-label">Commencement:</span><span className="agreement-value">{formatDate(data.leaseStart)}</span></div>
                <div className="agreement-field"><span className="agreement-label">Expiry:</span><span className="agreement-value">{formatDate(data.leaseEnd)}</span></div>
                <div className="agreement-field"><span className="agreement-label">Lock-in Period:</span><span className="agreement-value">{data.lockInPeriod} months</span></div>
                <div className="agreement-field"><span className="agreement-label">Notice Period:</span><span className="agreement-value">{data.noticePeriod} month(s)</span></div>
              </div>

              <div className="agreement-section">
                <div className="agreement-section-title">5. HOUSE RULES</div>
                <div className="agreement-field"><span className="agreement-label">Pets:</span><span className="agreement-value">{data.petPolicy}</span></div>
                <div className="agreement-field"><span className="agreement-label">Smoking:</span><span className="agreement-value">{data.smokingPolicy}</span></div>
                <div className="agreement-field"><span className="agreement-label">Guests:</span><span className="agreement-value">{data.guestPolicy}</span></div>
              </div>

              <div className="agreement-section">
                <div className="agreement-section-title">6. GENERAL CONDITIONS</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <p>a) The Tenant shall use the premises solely for {data.allowedUse.toLowerCase()} purposes.</p>
                  <p>b) The Tenant shall not sub-let, assign, or transfer the premises without written consent of the Landlord.</p>
                  <p>c) The Tenant shall maintain the premises in good condition and shall be liable for damages beyond normal wear and tear.</p>
                  <p>d) The Landlord shall have the right to inspect the premises with 24 hours prior written notice.</p>
                  <p>e) In case of default in payment of rent for more than 30 days, the Landlord may terminate this agreement with 15 days written notice.</p>
                  <p>f) The Security Deposit shall be refunded within 30 days of vacation, after deducting any outstanding dues or damages.</p>
                  <p>g) This agreement is governed by the Maharashtra Rent Control Act, 1999 and the Model Tenancy Act, 2021.</p>
                  <p>h) Any dispute arising out of this agreement shall be subject to the jurisdiction of courts in {data.propertyCity || "Mumbai"}, Maharashtra.</p>
                  {data.otherTerms && <p>i) {data.otherTerms}</p>}
                </div>
              </div>

              {/* Signatures */}
              <div className="agreement-signatures">
                <div className="agreement-sig-block">
                  <div className="agreement-sig-line">Landlord Signature</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.landlordName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Date: {formatDate(data.leaseStart)}</div>
                </div>
                <div className="agreement-sig-block">
                  <div className="agreement-sig-line">Tenant Signature</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{data.tenantName}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Date: {formatDate(data.leaseStart)}</div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: 40, padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
                Generated via Rently by Arynoxtech · {new Date().toLocaleDateString("en-IN")} · This is a template and may need legal review
              </div>
            </div>

            {/* Print styles */}
            <style>{`
              @media print {
                .navbar, .footer, .btn, button, .search-bar-row, nav { display: none !important; }
                .agreement-preview { box-shadow: none; border: none; padding: 20px; }
                body { background: white; }
              }
            `}</style>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
