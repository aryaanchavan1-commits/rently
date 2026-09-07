import { NextRequest, NextResponse } from "next/server";
import { createContract, getContract } from "@/lib/contracts-store";
import { createLeegalityDocument } from "@/lib/leegality";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GenerateContractRequest {
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;
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
  specialRequests?: string;
  templateType: "rental" | "license" | "pg" | "commercial";
  language?: "en" | "mr" | "hi";
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateContractRequest = await request.json();

    const {
      propertyId,
      propertyTitle,
      propertyAddress,
      propertyCity,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerAadhaarLast4,
      tenantName,
      tenantEmail,
      tenantPhone,
      tenantAadhaarLast4,
      rentAmount,
      securityDeposit,
      maintenanceCharges,
      leaseStart,
      leaseEnd,
      specialRequests,
      templateType,
      language = "en",
    } = body;

    if (!propertyId || !ownerName || !tenantName || !rentAmount || !leaseStart || !leaseEnd) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const aiPrompt = `Generate a professional ${templateType} agreement for a property in Maharashtra, India.

PROPERTY DETAILS:
- Title: ${propertyTitle}
- Address: ${propertyAddress}
- City: ${propertyCity}

PARTIES:
Landlord: ${ownerName} (Phone: ${ownerPhone})
Tenant: ${tenantName} (Phone: ${tenantPhone})

FINANCIAL TERMS:
- Monthly Rent: ₹${rentAmount.toLocaleString("en-IN")}
- Security Deposit: ₹${securityDeposit.toLocaleString("en-IN")}
- Maintenance: ₹${maintenanceCharges.toLocaleString("en-IN")}/month

LEASE PERIOD:
- Start: ${leaseStart}
- End: ${leaseEnd}

${specialRequests ? `SPECIAL REQUESTS FROM USER:\n${specialRequests}\n` : ""}

Please generate a comprehensive, legally valid rental agreement that:
1. Follows Maharashtra state rental agreement format
2. Includes all standard clauses (rent, deposit, termination, dispute resolution)
3. Is written in ${language === "mr" ? "Marathi" : language === "hi" ? "Hindi" : "English"}
4. Includes clauses for: rent payment, security deposit refund, maintenance responsibilities, termination notice, property handover, and dispute resolution
5. Makes the agreement professional and enforceable in Indian courts
6. Add any special clauses based on the user's special requests

Return ONLY the contract text, no explanations.`;

    const aiResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a legal document specialist expert in Indian rental agreements and Maharashtra property law. Generate professional, legally valid contracts.",
          },
          {
            role: "user",
            content: aiPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("AI contract generation failed");
    }

    const aiData = await aiResponse.json();
    const contractText = aiData.choices[0]?.message?.content || "";

    const contract = createContract(
      {
        propertyId,
        ownerName,
        ownerEmail,
        ownerPhone,
        ownerAadhaarLast4,
        tenantName,
        tenantEmail,
        tenantPhone,
        tenantAadhaarLast4,
        rentAmount,
        securityDeposit,
        maintenanceCharges,
        leaseStart,
        leaseEnd,
        specialClauses: specialRequests ? specialRequests.split("\n").filter(Boolean) : [],
        templateType,
      },
      propertyTitle,
      propertyAddress,
      propertyCity
    );

    return NextResponse.json({
      success: true,
      contract,
      contractText,
      paymentRequired: true,
      paymentAmount: 99,
    });
  } catch (error) {
    console.error("Contract generation error:", error);
    return NextResponse.json({ error: "Failed to generate contract" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get("id");

    if (contractId) {
      const contract = getContract(contractId);
      if (!contract) {
        return NextResponse.json({ error: "Contract not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, contract });
    }

    return NextResponse.json({ error: "Contract ID required" }, { status: 400 });
  } catch (error) {
    console.error("Get contract error:", error);
    return NextResponse.json({ error: "Failed to get contract" }, { status: 500 });
  }
}
