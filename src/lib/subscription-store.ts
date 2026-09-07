export interface Subscription {
  id: string;
  ownerId: string;
  plan: "weekly" | "monthly" | "yearly";
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  price: number;
  paymentId?: string;
  autoRenew: boolean;
  createdAt: string;
}

export interface OwnerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  subscription?: Subscription;
  totalListings: number;
  totalViews: number;
  totalInquiries: number;
  createdAt: string;
}

const subscriptions: Subscription[] = [];
const ownerProfiles: OwnerProfile[] = [];

export const SUBSCRIPTION_PLANS = {
  weekly: { price: 49, duration: 7, label: "Weekly", labelMr: "साप्ताहिक", labelHi: "साप्ताहिक" },
  monthly: { price: 149, duration: 30, label: "Monthly", labelMr: "मासिक", labelHi: "मासिक" },
  yearly: { price: 999, duration: 365, label: "Yearly", labelMr: "वार्षिक", labelHi: "वार्षिक" },
};

export function createSubscription(ownerId: string, plan: keyof typeof SUBSCRIPTION_PLANS, paymentId?: string): Subscription {
  const planDetails = SUBSCRIPTION_PLANS[plan];
  const now = new Date();
  const endDate = new Date(now.getTime() + planDetails.duration * 24 * 60 * 60 * 1000);

  const sub: Subscription = {
    id: `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    ownerId,
    plan,
    status: "active",
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    price: planDetails.price,
    paymentId,
    autoRenew: true,
    createdAt: now.toISOString(),
  };

  subscriptions.push(sub);
  return sub;
}

export function getSubscription(ownerId: string): Subscription | undefined {
  return subscriptions.find((s) => s.ownerId === ownerId && s.status === "active");
}

export function isSubscriptionActive(ownerId: string): boolean {
  const sub = getSubscription(ownerId);
  if (!sub) return false;
  return new Date(sub.endDate) > new Date();
}

export function getDaysUntilExpiry(ownerId: string): number {
  const sub = getSubscription(ownerId);
  if (!sub) return 0;
  const endDate = new Date(sub.endDate);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function cancelSubscription(ownerId: string): boolean {
  const sub = getSubscription(ownerId);
  if (!sub) return false;
  sub.status = "cancelled";
  sub.autoRenew = false;
  return true;
}

export function renewSubscription(ownerId: string, paymentId?: string): Subscription | undefined {
  const oldSub = getSubscription(ownerId);
  if (oldSub) {
    oldSub.status = "cancelled";
  }
  const plan = oldSub?.plan || "monthly";
  return createSubscription(ownerId, plan, paymentId);
}

export function getExpiringSubscriptions(daysBefore: number = 3): Subscription[] {
  const now = new Date();
  const threshold = new Date(now.getTime() + daysBefore * 24 * 60 * 60 * 1000);
  return subscriptions.filter((s) => s.status === "active" && new Date(s.endDate) <= threshold);
}

export function getOwnerProfile(userId: string): OwnerProfile | undefined {
  return ownerProfiles.find((p) => p.userId === userId);
}

export function createOwnerProfile(userId: string, name: string, email: string, phone: string): OwnerProfile {
  const profile: OwnerProfile = {
    id: `OWN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    userId,
    name,
    email,
    phone,
    totalListings: 0,
    totalViews: 0,
    totalInquiries: 0,
    createdAt: new Date().toISOString(),
  };
  ownerProfiles.push(profile);
  return profile;
}

export function updateOwnerStats(userId: string, stats: Partial<Pick<OwnerProfile, "totalListings" | "totalViews" | "totalInquiries">>): void {
  const profile = ownerProfiles.find((p) => p.userId === userId);
  if (profile) {
    Object.assign(profile, stats);
  }
}
