export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  type: string;
  price: number;
  deposit: number;
  address: string;
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  availableFrom: string;
  images: string[];
  amenities: string[];
  rules: string;
  description: string;
  contactPhone: string;
  isVerified: boolean;
  isFeatured: boolean;
  status: "active" | "pending" | "rented";
  views: number;
  createdAt: string;
}

const g = globalThis as unknown as { __rentlyProperties?: Property[] };
if (!g.__rentlyProperties) g.__rentlyProperties = [];
const properties: Property[] = g.__rentlyProperties;

if (properties.length === 0) {
  properties.push(
    { id: "1", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Spacious 2BHK with Modern Amenities", type: "apartment", price: 22000, deposit: 44000, address: "15 Sunshine Apartments, Andheri West", area: "Andheri West", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "semi", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "AC", "Gym", "Pool", "Security"], rules: "No smoking. Rent by 5th.", description: "Beautiful 2BHK in the heart of Andheri West with modern amenities.", contactPhone: "+91 98765 43210", isVerified: true, isFeatured: true, status: "active", views: 245, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: "2", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Cozy 1BHK Near Metro Station", type: "apartment", price: 12000, deposit: 24000, address: "22 Green Valley Society, Kothrud", area: "Kothrud", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "AC", "Security", "Lift"], rules: "Rent due by 5th. No smoking.", description: "Cozy 1BHK near Kothrud metro station.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 98, createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
    { id: "3", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Premium 3BHK with Garden View", type: "house", price: 35000, deposit: 70000, address: "8 Rose Garden Lane, Baner", area: "Baner", city: "Pune", bedrooms: 3, bathrooms: 3, furnishing: "furnished", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], amenities: ["WiFi", "Parking", "AC", "Garden", "Security"], rules: "Family preferred. 1 month notice.", description: "Premium 3BHK with private garden.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 67, createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: "4", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Furnished Room in Shared Flat", type: "room", price: 6500, deposit: 13000, address: "Near IT Park, Hinjewadi", area: "Hinjewadi", city: "Pune", bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-05", images: ["https://images.unsplash.com/photo-1598928506311-c55ez637a513?w=800"], amenities: ["WiFi", "AC", "Meals"], rules: "No smoking, no alcohol.", description: "Furnished room in a shared flat near IT Park.", contactPhone: "+91 98765 43210", isVerified: false, isFeatured: false, status: "active", views: 34, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "5", ownerId: "owner-2", ownerName: "Priya Patil", title: "Independent House with Parking", type: "house", price: 18000, deposit: 36000, address: "Thane West, Near Station", area: "Thane West", city: "Thane", bedrooms: 2, bathrooms: 2, furnishing: "unfurnished", availableFrom: "2026-09-20", images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"], amenities: ["Parking", "Security", "Garden"], rules: "Family only. 2 month deposit.", description: "Independent house with covered parking.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 52, createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: "6", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Luxury 2BHK with Pool Access", type: "apartment", price: 28000, deposit: 56000, address: "Powai Lake View Society", area: "Powai", city: "Mumbai", bedrooms: 2, bathrooms: 2, furnishing: "fully", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"], amenities: ["WiFi", "AC", "Pool", "Gym", "Parking", "Security"], rules: "No pets. Rent by 5th.", description: "Luxury apartment with pool and gym access.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 180, createdAt: new Date(Date.now() - 25 * 86400000).toISOString() }
  );
}

export function getAllProperties(): Property[] { return [...properties]; }
export function getPropertiesByOwner(ownerId: string): Property[] { return properties.filter((p) => p.ownerId === ownerId); }
export function getPropertyById(id: string): Property | undefined { return properties.find((p) => p.id === id); }

export function addProperty(data: Omit<Property, "id" | "createdAt" | "views" | "status" | "isVerified" | "isFeatured">): Property {
  const prop: Property = {
    ...data,
    id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "active",
    isVerified: false,
    isFeatured: false,
    views: 0,
    createdAt: new Date().toISOString(),
  };
  properties.unshift(prop);
  return prop;
}

export function updateProperty(id: string, data: Partial<Property>): Property | null {
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  properties[idx] = { ...properties[idx], ...data };
  return properties[idx];
}

export function deleteProperty(id: string): boolean {
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  properties.splice(idx, 1);
  return true;
}
