import type { Property } from "./properties-store";

// ─── Maharashtra Deposit Cap (2026 Model Tenancy Act) ─────────────────────
const MAHARASHTRA_RESIDENTIAL_DEPOSIT_MONTHS = 2;
const MAHARASHTRA_COMMERCIAL_DEPOSIT_MONTHS = 6;

// ─── Price Benchmarks (approximate per-city averages for seed data) ───────
const CITY_AVG_RENT: Record<string, Record<number, number>> = {
  "Mumbai": { 1: 16000, 2: 24000, 3: 38000 },
  "Pune": { 1: 12000, 2: 18000, 3: 32000 },
  "Thane": { 1: 13000, 2: 18000, 3: 30000 },
  "Navi Mumbai": { 1: 12000, 2: 18000, 3: 30000 },
  "Nagpur": { 1: 8000, 2: 12000, 3: 22000 },
  "Nashik": { 1: 7500, 2: 10000, 3: 18000 },
  "Kolhapur": { 1: 7000, 2: 9000, 3: 15000 },
  "Satara": { 1: 5500, 2: 7000, 3: 12000 },
  "Solapur": { 1: 6000, 2: 8500, 3: 14000 },
  "Sangli": { 1: 6000, 2: 8000, 3: 13000 },
  "Ratnagiri": { 1: 5000, 2: 7000, 3: 11000 },
};

// ─── Trust Score Components ───────────────────────────────────────────────
export interface TrustFactor {
  id: string;
  label: string;
  score: number;      // 0-100 contribution
  weight: number;     // 0-1
  status: "pass" | "warn" | "fail" | "neutral";
  detail: string;
}

export interface TrustScoreResult {
  total: number;       // 0-100
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  gradeLabel: string;
  factors: TrustFactor[];
  warnings: ScamWarning[];
  depositCompliant: boolean;
  depositStatus: "compliant" | "exceeds-cap" | "unknown";
}

export interface ScamWarning {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  message: string;
  detail: string;
}

// ─── Deposit Compliance Check ─────────────────────────────────────────────
export function checkDepositCompliance(p: Property): { compliant: boolean; status: "compliant" | "exceeds-cap" | "unknown"; maxAllowed: number; actualDeposit: number; monthsOfRent: number } {
  const isCommercial = p.type === "office" || p.type === "commercial";
  const capMonths = isCommercial ? MAHARASHTRA_COMMERCIAL_DEPOSIT_MONTHS : MAHARASHTRA_RESIDENTIAL_DEPOSIT_MONTHS;
  const maxAllowed = p.price * capMonths;

  if (p.deposit <= 0) return { compliant: true, status: "unknown", maxAllowed, actualDeposit: p.deposit, monthsOfRent: 0 };

  const monthsOfRent = p.deposit / p.price;
  const compliant = p.deposit <= maxAllowed;

  return {
    compliant,
    status: compliant ? "compliant" : "exceeds-cap",
    maxAllowed,
    actualDeposit: p.deposit,
    monthsOfRent: Math.round(monthsOfRent * 10) / 10,
  };
}

// ─── Scam Detection Engine ────────────────────────────────────────────────
export function detectScams(p: Property, allProperties: Property[]): ScamWarning[] {
  const warnings: ScamWarning[] = [];

  // 1. Suspiciously low price (more than 40% below city average)
  const avgRent = CITY_AVG_RENT[p.city]?.[p.bedrooms] || CITY_AVG_RENT[p.city]?.[2] || 15000;
  const priceRatio = p.price / avgRent;
  if (priceRatio < 0.6) {
    warnings.push({
      id: "low-price",
      severity: "high",
      type: "Pricing",
      message: `Rent is ${Math.round((1 - priceRatio) * 100)}% below average for ${p.bedrooms}BHK in ${p.city}`,
      detail: `Average rent for ${p.bedrooms}BHK in ${p.city} is approximately ₹${avgRent.toLocaleString("en-IN")}/month. This listing is ₹${(avgRent - p.price).toLocaleString("en-IN")} below average. While below-market rents exist, this level of discount may indicate a scam.`,
    });
  }

  // 2. Deposit exceeds Maharashtra cap (2 months residential, 6 months commercial)
  const depositCheck = checkDepositCompliance(p);
  if (depositCheck.status === "exceeds-cap") {
    const capMonths = p.type === "office" ? 6 : 2;
    warnings.push({
      id: "deposit-exceeds",
      severity: "high",
      type: "Legal Compliance",
      message: `Deposit of ₹${p.deposit.toLocaleString("en-IN")} exceeds Maharashtra's ${capMonths}-month cap`,
      detail: `Under Maharashtra's 2026 tenancy rules, residential deposits are capped at 2 months' rent (₹${(p.price * 2).toLocaleString("en-IN")}). You're being asked for ₹${(p.deposit - p.price * 2).toLocaleString("en-IN")} more than the legal maximum. This amount may not be enforceable.`,
    });
  }

  // 3. No images
  if (!p.images || p.images.length === 0) {
    warnings.push({
      id: "no-images",
      severity: "medium",
      type: "Listing Quality",
      message: "No property photos uploaded",
      detail: "Listings without photos are harder to verify. Always insist on a physical visit before paying any amount.",
    });
  }

  // 4. Unverified owner
  if (!p.isVerified) {
    warnings.push({
      id: "unverified-owner",
      severity: "medium",
      type: "Owner Verification",
      message: "Owner identity has not been verified by Rently",
      detail: "This owner has not completed Rently's verification process. We recommend meeting the owner in person and verifying property ownership documents before proceeding.",
    });
  }

  // 5. Duplicate listings from same owner (same area, similar price)
  const duplicates = allProperties.filter(
    (other) =>
      other.id !== p.id &&
      other.ownerId === p.ownerId &&
      other.area === p.area &&
      Math.abs(other.price - p.price) < p.price * 0.15
  );
  if (duplicates.length > 0) {
    warnings.push({
      id: "duplicate-listing",
      severity: "medium",
      type: "Suspicious Pattern",
      message: `Same owner has ${duplicates.length + 1} similar listings in ${p.area}`,
      detail: "Multiple nearly identical listings from the same owner in the same area may indicate bulk posting or duplicate listings. This is a common pattern in rental scams.",
    });
  }

  // 6. Very new listing (< 2 days) with no freshness data
  const daysSinceCreation = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000);
  if (daysSinceCreation <= 2 && !p.freshness?.rentConfirmed) {
    warnings.push({
      id: "very-new",
      severity: "low",
      type: "Listing Freshness",
      message: "Listing created very recently — verify availability",
      detail: "Brand new listings may not have been fully verified yet. Confirm the property is still available before visiting.",
    });
  }

  // 7. No contact phone
  if (!p.contactPhone || p.contactPhone.trim() === "") {
    warnings.push({
      id: "no-phone",
      severity: "medium",
      type: "Contact",
      message: "No contact phone number provided",
      detail: "Legitimate owners almost always provide a phone number. The absence of contact details can be a red flag.",
    });
  }

  // 8. Price round number with no maintenance (suspicious pricing pattern)
  if (p.price % 5000 === 0 && p.maintenance === 0 && p.bedrooms >= 2) {
    warnings.push({
      id: "round-price",
      severity: "low",
      type: "Pricing",
      message: "Round-number rent with zero maintenance",
      detail: "While not necessarily suspicious, legitimate rentals typically have maintenance charges. Verify maintenance terms before signing.",
    });
  }

  // 9. Very high price for area
  if (priceRatio > 1.6) {
    warnings.push({
      id: "high-price",
      severity: "low",
      type: "Pricing",
      message: `Rent is ${Math.round((priceRatio - 1) * 100)}% above average for ${p.bedrooms}BHK in ${p.city}`,
      detail: `This property is significantly more expensive than comparable listings. Verify the premium is justified by amenities, furnishing, and location.`,
    });
  }

  // 10. Listing freshness expired
  if (p.freshness?.lastVerified) {
    const daysSinceVerified = Math.floor((Date.now() - new Date(p.freshness.lastVerified).getTime()) / 86400000);
    if (daysSinceVerified > 60) {
      warnings.push({
        id: "stale-listing",
        severity: "low",
        type: "Listing Freshness",
        message: `Last verified ${daysSinceVerified} days ago`,
        detail: "This listing hasn't been verified recently. Availability and pricing may have changed.",
      });
    }
  }

  return warnings;
}

// ─── Trust Score Calculator ───────────────────────────────────────────────
export function calculateTrustScore(p: Property, allProperties: Property[]): TrustScoreResult {
  const factors: TrustFactor[] = [];
  const warnings = detectScams(p, allProperties);
  const depositCheck = checkDepositCompliance(p);

  // Factor 1: Owner Verification (weight: 0.20)
  factors.push({
    id: "owner-verified",
    label: "Owner Identity Verified",
    score: p.isVerified ? 100 : 0,
    weight: 0.20,
    status: p.isVerified ? "pass" : "warn",
    detail: p.isVerified ? "Owner has completed identity verification" : "Owner identity not yet verified",
  });

  // Factor 2: Deposit Compliance (weight: 0.15)
  const depositScore = depositCheck.status === "compliant" ? 100 : depositCheck.status === "exceeds-cap" ? 0 : 50;
  factors.push({
    id: "deposit-compliance",
    label: "Deposit Within Legal Limit",
    score: depositScore,
    weight: 0.15,
    status: depositCheck.status === "compliant" ? "pass" : depositCheck.status === "exceeds-cap" ? "fail" : "neutral",
    detail: depositCheck.status === "compliant"
      ? `Deposit (₹${depositCheck.actualDeposit.toLocaleString("en-IN")}) is within Maharashtra's 2-month cap`
      : depositCheck.status === "exceeds-cap"
        ? `Deposit (₹${depositCheck.actualDeposit.toLocaleString("en-IN")}) exceeds the 2-month cap of ₹${depositCheck.maxAllowed.toLocaleString("en-IN")}`
        : "Deposit amount not verified",
  });

  // Factor 3: Property Photos (weight: 0.10)
  const hasImages = p.images && p.images.length > 0;
  factors.push({
    id: "has-photos",
    label: "Property Photos Available",
    score: hasImages ? (p.images.length >= 3 ? 100 : 50) : 0,
    weight: 0.10,
    status: hasImages ? "pass" : "warn",
    detail: hasImages ? `${p.images.length} photo(s) uploaded` : "No photos uploaded",
  });

  // Factor 4: Listing Freshness (weight: 0.15)
  const freshnessScore = p.freshness
    ? (p.freshness.available ? 30 : 0) + (p.freshness.rentConfirmed ? 25 : 0) + (p.freshness.photosUpdated ? 25 : 0) + (p.freshness.locationChecked ? 20 : 0)
    : 0;
  factors.push({
    id: "freshness",
    label: "Listing Freshness",
    score: freshnessScore,
    weight: 0.15,
    status: freshnessScore >= 80 ? "pass" : freshnessScore >= 50 ? "warn" : "fail",
    detail: freshnessScore >= 80
      ? "Listing is recently verified and up-to-date"
      : freshnessScore >= 50
        ? "Some listing details need updating"
        : "Listing freshness is outdated — verify current availability",
  });

  // Factor 5: Scam Risk (weight: 0.20)
  const criticalWarnings = warnings.filter((w) => w.severity === "critical").length;
  const highWarnings = warnings.filter((w) => w.severity === "high").length;
  const medWarnings = warnings.filter((w) => w.severity === "medium").length;
  const scamScore = Math.max(0, 100 - (criticalWarnings * 40) - (highWarnings * 20) - (medWarnings * 10));
  factors.push({
    id: "scam-risk",
    label: "Scam Risk Assessment",
    score: scamScore,
    weight: 0.20,
    status: scamScore >= 80 ? "pass" : scamScore >= 50 ? "warn" : "fail",
    detail: scamScore >= 80
      ? "No significant scam indicators detected"
      : scamScore >= 50
        ? `${highWarnings + medWarnings} potential concerns detected — review details carefully`
        : "Multiple scam indicators detected — proceed with extreme caution",
  });

  // Factor 6: Listing Quality (weight: 0.10)
  const hasDescription = p.description && p.description.length > 50;
  const hasAmenities = p.amenities && p.amenities.length > 0;
  const hasAddress = p.address && p.address.length > 10;
  const qualityScore = (hasDescription ? 35 : 0) + (hasAmenities ? 35 : 0) + (hasAddress ? 30 : 0);
  factors.push({
    id: "listing-quality",
    label: "Listing Completeness",
    score: qualityScore,
    weight: 0.10,
    status: qualityScore >= 80 ? "pass" : qualityScore >= 50 ? "warn" : "fail",
    detail: qualityScore >= 80
      ? "Listing is complete with description, amenities, and address"
      : "Some listing details are missing",
  });

  // Factor 7: Price Reasonableness (weight: 0.10)
  const avgForBed = CITY_AVG_RENT[p.city]?.[p.bedrooms] || 15000;
  const priceDeviation = Math.abs(p.price - avgForBed) / avgForBed;
  const priceScore = priceDeviation < 0.2 ? 100 : priceDeviation < 0.4 ? 70 : priceDeviation < 0.6 ? 40 : 10;
  factors.push({
    id: "price-reasonable",
    label: "Price Reasonableness",
    score: priceScore,
    weight: 0.10,
    status: priceScore >= 70 ? "pass" : priceScore >= 40 ? "warn" : "fail",
    detail: priceScore >= 70
      ? `Price is within normal range for ${p.bedrooms}BHK in ${p.city}`
      : `Price is ${priceDeviation > 0.5 ? "significantly" : "somewhat"} different from average for this area`,
  });

  // ─── Calculate Total ──────────────────────────────────────────────────
  const total = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  // ─── Grade ────────────────────────────────────────────────────────────
  let grade: TrustScoreResult["grade"];
  let gradeLabel: string;
  if (total >= 95) { grade = "A+"; gradeLabel = "Exceptional Trust"; }
  else if (total >= 85) { grade = "A"; gradeLabel = "Highly Trusted"; }
  else if (total >= 75) { grade = "B+"; gradeLabel = "Well Verified"; }
  else if (total >= 65) { grade = "B"; gradeLabel = "Moderately Trusted"; }
  else if (total >= 55) { grade = "C+"; gradeLabel = "Some Concerns"; }
  else if (total >= 45) { grade = "C"; gradeLabel = "Proceed with Caution"; }
  else if (total >= 30) { grade = "D"; gradeLabel = "Significant Risks"; }
  else { grade = "F"; gradeLabel = "High Risk — Do Not Proceed"; }

  return {
    total,
    grade,
    gradeLabel,
    factors,
    warnings,
    depositCompliant: depositCheck.compliant,
    depositStatus: depositCheck.status,
  };
}
