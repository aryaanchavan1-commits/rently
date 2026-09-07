import type { Contract, ContractFormData } from "@/types/contract";

const contracts: Contract[] = [];

export function generateContractId(): string {
  return `CTR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function createContract(data: ContractFormData, propertyTitle: string, propertyAddress: string, propertyCity: string): Contract {
  const contract: Contract = {
    id: generateContractId(),
    propertyId: data.propertyId,
    ownerId: "",
    ownerName: data.ownerName,
    ownerEmail: data.ownerEmail,
    ownerPhone: data.ownerPhone,
    tenantId: "",
    tenantName: data.tenantName,
    tenantEmail: data.tenantEmail,
    tenantPhone: data.tenantPhone,
    propertyTitle,
    propertyAddress,
    propertyCity,
    rentAmount: data.rentAmount,
    securityDeposit: data.securityDeposit,
    maintenanceCharges: data.maintenanceCharges,
    leaseStart: data.leaseStart,
    leaseEnd: data.leaseEnd,
    duration: calculateDuration(data.leaseStart, data.leaseEnd),
    specialClauses: data.specialClauses,
    status: "draft",
    paymentAmount: 99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  contracts.push(contract);
  return contract;
}

export function getContract(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id);
}

export function getContractsByUser(userId: string): Contract[] {
  return contracts.filter((c) => c.ownerId === userId || c.tenantId === userId);
}

export function getContractsByProperty(propertyId: string): Contract[] {
  return contracts.filter((c) => c.propertyId === propertyId);
}

export function updateContract(id: string, updates: Partial<Contract>): Contract | undefined {
  const idx = contracts.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  contracts[idx] = { ...contracts[idx], ...updates, updatedAt: new Date().toISOString() };
  return contracts[idx];
}

export function deleteContract(id: string): boolean {
  const idx = contracts.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  contracts.splice(idx, 1);
  return true;
}

function calculateDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
  if (diffMonths < 12) return `${diffMonths} months`;
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  return months > 0 ? `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}` : `${years} year${years > 1 ? "s" : ""}`;
}

export function generateContractPdf(contract: Contract): string {
  return `
MAHARASHTRA RENTAL AGREEMENT

This Rental Agreement ("Agreement") is made on ${new Date(contract.createdAt).toLocaleDateString("en-IN")}

BETWEEN:

LANDLORD/OWNER:
Name: ${contract.ownerName}
Email: ${contract.ownerEmail}
Phone: ${contract.ownerPhone}

TENANT:
Name: ${contract.tenantName}
Email: ${contract.tenantEmail}
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
   Payment Mode: Online transfer / UPI / Cheque

3. SECURITY DEPOSIT
   The Tenant shall pay a security deposit of ₹${contract.securityDeposit.toLocaleString("en-IN")} which shall be refundable at the end of the lease period, subject to deductions for damages or unpaid dues.

4. USE OF PREMISES
   The premises shall be used for residential purposes only. The Tenant shall not use the premises for any illegal or commercial activities.

5. MAINTENANCE
   The Tenant shall pay maintenance charges of ₹${contract.maintenanceCharges.toLocaleString("en-IN")} per month in addition to the rent.

6. TERMINATION
   Either party may terminate this Agreement by giving 2 months written notice. Early termination shall attract a penalty of 2 months rent.

7. DEFAULT
   In case of default in payment of rent for more than 30 days, the Owner reserves the right to terminate this Agreement and recover possession of the premises.

8. DISPUTE RESOLUTION
   Any dispute arising out of this Agreement shall be subject to the jurisdiction of courts in Maharashtra.

${contract.specialClauses.length > 0 ? `
9. SPECIAL CLAUSES
${contract.specialClauses.map((clause, i) => `   ${i + 1}. ${clause}`).join("\n")}
` : ""}

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.

LANDLORD/OWNER:
Name: ${contract.ownerName}
Date: ${contract.leaseStart}

TENANT:
Name: ${contract.tenantName}
Date: ${contract.leaseStart}
  `.trim();
}
