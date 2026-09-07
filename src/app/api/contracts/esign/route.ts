import { NextRequest, NextResponse } from "next/server";
import { getContract, updateContract } from "@/lib/contracts-store";
import { createLeegalityDocument, getLeegalityDocumentStatus } from "@/lib/leegality";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractId, action } = body;

    if (!contractId) {
      return NextResponse.json({ error: "Contract ID required" }, { status: 400 });
    }

    const contract = getContract(contractId);
    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    if (action === "initiate_esign") {
      if (contract.status !== "pending_esign") {
        return NextResponse.json({ error: "Contract not ready for eSign" }, { status: 400 });
      }

      const contractText = generateContractText(contract);
      const pdfBase64 = Buffer.from(contractText).toString("base64");

      const result = await createLeegalityDocument(
        pdfBase64,
        `Rental Agreement - ${contract.propertyTitle}`,
        [
          {
            email: contract.ownerEmail,
            name: contract.ownerName,
            phone: contract.ownerPhone,
            authType: "aadhaar_otp",
          },
          {
            email: contract.tenantEmail,
            name: contract.tenantName,
            phone: contract.tenantPhone,
            authType: "aadhaar_otp",
          },
        ]
      );

      updateContract(contractId, {
        leegalityDocumentId: result.documentId,
        status: "pending_esign",
      });

      return NextResponse.json({
        success: true,
        documentId: result.documentId,
        signingUrl: result.signingUrl,
        message: "eSign links sent to both parties",
      });
    }

    if (action === "check_status") {
      if (!contract.leegalityDocumentId) {
        return NextResponse.json({ error: "No eSign document found" }, { status: 400 });
      }

      const status = await getLeegalityDocumentStatus(contract.leegalityDocumentId);

      let newStatus: typeof contract.status = "pending_esign";
      if (status.status === "completed") {
        newStatus = "completed";
      } else if (status.invitees?.some((inv) => inv.status === "signed")) {
        newStatus = "partially_signed";
      }

      updateContract(contractId, { status: newStatus });

      return NextResponse.json({
        success: true,
        status: newStatus,
        details: status,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("eSign error:", error);
    return NextResponse.json({ error: "eSign operation failed" }, { status: 500 });
  }
}

function generateContractText(contract: any): string {
  return `
MAHARASHTRA RENTAL AGREEMENT

This Rental Agreement ("Agreement") is made on ${new Date(contract.createdAt).toLocaleDateString("en-IN")}

BETWEEN:

LANDLORD/OWNER:
Name: ${contract.ownerName}
Phone: ${contract.ownerPhone}

TENANT:
Name: ${contract.tenantName}
Phone: ${contract.tenantPhone}

PROPERTY DETAILS:
${contract.propertyTitle}
${contract.propertyAddress}
${contract.propertyCity}, Maharashtra

TERMS AND CONDITIONS:

1. LEASE PERIOD
   Start Date: ${contract.leaseStart}
   End Date: ${contract.leaseEnd}
   Duration: ${contract.duration}

2. RENT AND PAYMENT
   Monthly Rent: ₹${contract.rentAmount.toLocaleString("en-IN")}
   Security Deposit: ₹${contract.securityDeposit.toLocaleString("en-IN")}
   Maintenance Charges: ₹${contract.maintenanceCharges.toLocaleString("en-IN")}/month
   Payment Due Date: 5th of each month

3. SECURITY DEPOSIT
   The Tenant shall pay a security deposit of ₹${contract.securityDeposit.toLocaleString("en-IN")} which shall be refundable at the end of the lease period.

4. USE OF PREMISES
   The premises shall be used for residential purposes only.

5. MAINTENANCE
   The Tenant shall pay maintenance charges of ₹${contract.maintenanceCharges.toLocaleString("en-IN")} per month.

6. TERMINATION
   Either party may terminate this Agreement by giving 2 months written notice.

7. DISPUTE RESOLUTION
   Any dispute shall be subject to the jurisdiction of courts in Maharashtra.

${contract.specialClauses.length > 0 ? `
8. SPECIAL CLAUSES
${contract.specialClauses.map((clause: string, i: number) => `   ${i + 1}. ${clause}`).join("\n")}
` : ""}

IN WITNESS WHEREOF, the parties have executed this Agreement.

LANDLORD/OWNER: ${contract.ownerName}
TENANT: ${contract.tenantName}
  `.trim();
}
