const LEEGALITY_AUTH_TOKEN = process.env.LEEGALITY_AUTH_TOKEN ?? "";
const LEEGALITY_PRIVATE_SALT = process.env.LEEGALITY_PRIVATE_SALT ?? "";
const LEEGALITY_BASE_URL = "https://sandbox.leegality.com/api";

interface LeegalityInvitee {
  email: string;
  name: string;
  phone: string;
  authType: string;
  signingOrder: number;
  appearances?: {
    x: number;
    y: number;
    page: number;
    width: number;
    height: number;
  }[];
}

interface LeegalityCreateRequest {
  profileId?: string;
  documentName: string;
  documentFile: string;
  invitees: LeegalityInvitee[];
  notifySigners: boolean;
  sendSignLink: boolean;
  positionPicker?: boolean;
}

interface LeegalityCreateResponse {
  documentId: string;
  success: boolean;
  message?: string;
}

interface LeegalityStatusResponse {
  documentId: string;
  status: string;
  invitees: Array<{
    email: string;
    name: string;
    status: string;
    signedAt?: string;
  }>;
  file?: string;
  auditTrail?: string;
}

export async function createLeegalityDocument(
  pdfBase64: string,
  documentName: string,
  invitees: Array<{
    email: string;
    name: string;
    phone: string;
    authType?: string;
  }>
): Promise<{ documentId: string; signingUrl: string }> {
  const requestPayload: LeegalityCreateRequest = {
    documentName,
    documentFile: pdfBase64,
    invitees: invitees.map((inv, idx) => ({
      email: inv.email,
      name: inv.name,
      phone: inv.phone,
      authType: inv.authType || "aadhaar_otp",
      signingOrder: idx + 1,
    })),
    notifySigners: true,
    sendSignLink: true,
  };

  const response = await fetch(`${LEEGALITY_BASE_URL}/v2.1/sign/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": LEEGALITY_AUTH_TOKEN,
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Leegality API error: ${response.status} - ${errorData.message || "Unknown error"}`);
  }

  const data: LeegalityCreateResponse = await response.json();

  if (!data.success) {
    throw new Error(`Leegality document creation failed: ${data.message || "Unknown error"}`);
  }

  const signingUrl = `https://sandbox.leegality.com/sign/${data.documentId}`;

  return {
    documentId: data.documentId,
    signingUrl,
  };
}

export async function getLeegalityDocumentStatus(documentId: string): Promise<LeegalityStatusResponse> {
  const response = await fetch(`${LEEGALITY_BASE_URL}/v2.1/sign/request?documentId=${documentId}`, {
    method: "GET",
    headers: {
      "X-Auth-Token": LEEGALITY_AUTH_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Leegality status check failed: ${response.status}`);
  }

  return response.json();
}

export async function downloadLeegalityDocument(documentId: string): Promise<{ file: string; auditTrail: string }> {
  const response = await fetch(
    `${LEEGALITY_BASE_URL}/v2.1/sign/request?documentId=${documentId}&file=true&auditTrail=true`,
    {
      method: "GET",
      headers: {
        "X-Auth-Token": LEEGALITY_AUTH_TOKEN,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Leegality download failed: ${response.status}`);
  }

  return response.json();
}

export function verifyWebhookSignature(documentId: string, mac: string): boolean {
  const crypto = require("crypto");
  const expectedMac = crypto.createHmac("sha1", documentId).update(LEEGALITY_PRIVATE_SALT).digest("hex");
  return mac === expectedMac;
}
