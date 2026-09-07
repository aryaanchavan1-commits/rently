export interface Contract {
  id: string;
  propertyId: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;
  rentAmount: number;
  securityDeposit: number;
  maintenanceCharges: number;
  leaseStart: string;
  leaseEnd: string;
  duration: string;
  specialClauses: string[];
  status: "draft" | "pending_payment" | "pending_esign" | "partially_signed" | "completed" | "expired";
  leegalityDocumentId?: string;
  signedPdfUrl?: string;
  auditTrailUrl?: string;
  paymentId?: string;
  paymentAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  description: string;
  descriptionMr: string;
  descriptionHi: string;
  type: "rental" | "license" | "pg" | "commercial";
  isPopular: boolean;
  price: number;
}

export interface ESignInvitee {
  email: string;
  name: string;
  phone: string;
  signingOrder: number;
  authType: "aadhaar_otp" | "aadhaar_biometric" | "dsc";
}

export interface LeegalityDocumentResponse {
  documentId: string;
  signingUrl: string;
  status: string;
}

export interface ContractFormData {
  propertyId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAadhaarLast4: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantAadhaarLast4: string;
  rentAmount: number;
  securityDeposit: number;
  maintenanceCharges: number;
  leaseStart: string;
  leaseEnd: string;
  specialClauses: string[];
  templateType: "rental" | "license" | "pg" | "commercial";
}
