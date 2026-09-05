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
  state: string;
  lat: number;
  lng: number;
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
    { id: "1", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Spacious 2BHK with Modern Amenities", type: "apartment", price: 22000, deposit: 44000, address: "15 Sunshine Apartments, Andheri West", area: "Andheri West", city: "Mumbai", state: "Maharashtra", lat: 19.1364, lng: 72.8296, bedrooms: 2, bathrooms: 2, furnishing: "semi", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "AC", "Gym", "Pool", "Security"], rules: "No smoking. Rent by 5th.", description: "Beautiful 2BHK in the heart of Andheri West with modern amenities. Close to metro station and malls.", contactPhone: "+91 98765 43210", isVerified: true, isFeatured: true, status: "active", views: 245, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: "2", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Cozy 1BHK Near Metro Station", type: "apartment", price: 12000, deposit: 24000, address: "22 Green Valley Society, Kothrud", area: "Kothrud", city: "Pune", state: "Maharashtra", lat: 18.5074, lng: 73.8077, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "AC", "Security", "Lift"], rules: "Rent due by 5th. No smoking.", description: "Cozy 1BHK near Kothrud metro station. Ideal for working professionals.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 98, createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
    { id: "3", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Premium 3BHK with Garden View", type: "house", price: 35000, deposit: 70000, address: "8 Rose Garden Lane, Baner", area: "Baner", city: "Pune", state: "Maharashtra", lat: 18.5596, lng: 73.7868, bedrooms: 3, bathrooms: 3, furnishing: "furnished", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], amenities: ["WiFi", "Parking", "AC", "Garden", "Security"], rules: "Family preferred. 1 month notice.", description: "Premium 3BHK with private garden in upscale Baner locality.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 67, createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: "4", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Furnished Room in Shared Flat", type: "room", price: 6500, deposit: 13000, address: "Near IT Park, Hinjewadi", area: "Hinjewadi", city: "Pune", state: "Maharashtra", lat: 18.5913, lng: 73.7389, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-05", images: ["https://images.unsplash.com/photo-1598928506311-c55ez637a513?w=800"], amenities: ["WiFi", "AC", "Meals"], rules: "No smoking, no alcohol.", description: "Furnished room in a shared flat near IT Park. Perfect for techies.", contactPhone: "+91 98765 43210", isVerified: false, isFeatured: false, status: "active", views: 34, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "5", ownerId: "owner-2", ownerName: "Priya Patil", title: "Independent House with Parking", type: "house", price: 18000, deposit: 36000, address: "Thane West, Near Station", area: "Thane West", city: "Thane", state: "Maharashtra", lat: 19.2183, lng: 72.9781, bedrooms: 2, bathrooms: 2, furnishing: "unfurnished", availableFrom: "2026-09-20", images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"], amenities: ["Parking", "Security", "Garden"], rules: "Family only. 2 month deposit.", description: "Independent house with covered parking near Thane station.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 52, createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: "6", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Luxury 2BHK with Pool Access", type: "apartment", price: 28000, deposit: 56000, address: "Powai Lake View Society", area: "Powai", city: "Mumbai", state: "Maharashtra", lat: 19.1176, lng: 72.9060, bedrooms: 2, bathrooms: 2, furnishing: "fully", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"], amenities: ["WiFi", "AC", "Pool", "Gym", "Parking", "Security"], rules: "No pets. Rent by 5th.", description: "Luxury apartment with pool and gym access in Powai.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 180, createdAt: new Date(Date.now() - 25 * 86400000).toISOString() },
    { id: "7", ownerId: "owner-2", ownerName: "Priya Patil", title: "Budget PG with Meals & WiFi", type: "pg", price: 5500, deposit: 5500, address: "Near VIT College, Wadgaon", area: "Wadgaon", city: "Pune", state: "Maharashtra", lat: 18.4524, lng: 73.8470, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-01", images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"], amenities: ["WiFi", "Meals", "Security", "CCTV"], rules: "Students only. In-time 9 PM.", description: "Budget-friendly PG with 3 meals a day. Near VIT campus.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 120, createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: "8", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Modern Studio Apartment", type: "apartment", price: 14000, deposit: 28000, address: "Bandra East, CB Complex", area: "Bandra East", city: "Mumbai", state: "Maharashtra", lat: 19.0596, lng: 72.8656, bedrooms: 1, bathrooms: 1, furnishing: "fully", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"], amenities: ["WiFi", "AC", "Gym", "Security", "Lift"], rules: "Professionals only.", description: "Modern studio in Bandra East. Fully furnished with premium fittings.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: false, status: "active", views: 95, createdAt: new Date(Date.now() - 12 * 86400000).toISOString() },
    { id: "9", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Office Space in IT Park", type: "office", price: 35000, deposit: 70000, address: "Blue Ridge IT Park, Hinjewadi", area: "Hinjewadi", city: "Pune", state: "Maharashtra", lat: 18.5912, lng: 73.7380, bedrooms: 0, bathrooms: 2, furnishing: "fully", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"], amenities: ["WiFi", "AC", "Parking", "Security", "CCTV", "Lift"], rules: "Commercial use only.", description: "Ready-to-move office space in premium IT park. 1200 sq ft.", contactPhone: "+91 98765 43210", isVerified: true, isFeatured: false, status: "active", views: 45, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "10", ownerId: "owner-2", ownerName: "Priya Patil", title: "Single Room for Students", type: "room", price: 500, deposit: 1000, address: "Near Pune University, Ganeshkhind", area: "Ganeshkhind", city: "Pune", state: "Maharashtra", lat: 18.5362, lng: 73.8344, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-01", images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"], amenities: ["WiFi", "Water Supply"], rules: "Students only. 3-month minimum.", description: "Affordable single room near Pune University. Ideal for students.", contactPhone: "+91 98765 43211", isVerified: false, isFeatured: false, status: "active", views: 67, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "11", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Premium 3BHK in Gated Society", type: "apartment", price: 32000, deposit: 64000, address: "Vashi Sector 17, Navi Mumbai", area: "Vashi", city: "Navi Mumbai", state: "Maharashtra", lat: 19.0715, lng: 72.9985, bedrooms: 3, bathrooms: 2, furnishing: "semi", availableFrom: "2026-10-15", images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"], amenities: ["WiFi", "Parking", "AC", "Gym", "Pool", "Security", "Lift"], rules: "Family preferred.", description: "Premium 3BHK in gated society with all modern amenities.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 156, createdAt: new Date(Date.now() - 18 * 86400000).toISOString() },
    { id: "12", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Cozy PG Hostel for Women", type: "pg", price: 7000, deposit: 7000, address: "Near Deccan Gymkhana, Pune", area: "Deccan", city: "Pune", state: "Maharashtra", lat: 18.5195, lng: 73.8443, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-05", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"], amenities: ["WiFi", "Meals", "Security", "CCTV", "AC"], rules: "Women only. In-time 9:30 PM.", description: "Safe and comfortable PG hostel for women near Deccan. 3 meals included.", contactPhone: "+91 98765 43210", isVerified: true, isFeatured: false, status: "active", views: 210, createdAt: new Date(Date.now() - 22 * 86400000).toISOString() }
  );
}

export function getAllProperties(): Property[] { return [...properties]; }
export function getPropertiesByOwner(ownerId: string): Property[] { return properties.filter((p) => p.ownerId === ownerId); }
export function getPropertyById(id: string): Property | undefined { return properties.find((p) => p.id === id); }

export function searchProperties(filters: {
  city?: string; area?: string; type?: string; minPrice?: number; maxPrice?: number;
  bedrooms?: number; furnishing?: string; amenities?: string[];
}): Property[] {
  let results = properties.filter((p) => p.status === "active");
  if (filters.city) results = results.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
  if (filters.area) results = results.filter((p) => p.area.toLowerCase().includes(filters.area!.toLowerCase()));
  if (filters.type) results = results.filter((p) => p.type === filters.type);
  if (filters.minPrice) results = results.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice) results = results.filter((p) => p.price <= filters.maxPrice!);
  if (filters.bedrooms && filters.bedrooms > 0) results = results.filter((p) => p.bedrooms === filters.bedrooms);
  if (filters.furnishing) results = results.filter((p) => p.furnishing === filters.furnishing);
  if (filters.amenities && filters.amenities.length > 0) {
    results = results.filter((p) => filters.amenities!.every((a) => p.amenities.includes(a)));
  }
  return results;
}

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
