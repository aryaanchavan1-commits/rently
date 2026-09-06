export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  type: string;
  price: number;
  deposit: number;
  maintenance: number;
  parking: number;
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
  freshness: {
    available: boolean;
    rentConfirmed: boolean;
    photosUpdated: boolean;
    locationChecked: boolean;
    lastVerified: string;
  };
}

export function getFreshnessScore(f: Property["freshness"]): number {
  let score = 0;
  if (f.available) score += 30;
  if (f.rentConfirmed) score += 25;
  if (f.photosUpdated) score += 25;
  if (f.locationChecked) score += 20;
  return score;
}

export function getFreshnessLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Update";
}

export function getTrueCost(p: Property): { rent: number; maintenance: number; parking: number; total: number; deposit: number } {
  return {
    rent: p.price,
    maintenance: p.maintenance || 0,
    parking: p.parking || 0,
    total: p.price + (p.maintenance || 0) + (p.parking || 0),
    deposit: p.deposit,
  };
}

function daysAgo(d: number): string {
  const date = new Date(Date.now() - d * 86400000);
  return date.toISOString();
}

const defaultFreshness = (daysBack: number, full = true): Property["freshness"] => ({
  available: full,
  rentConfirmed: full,
  photosUpdated: daysBack < 15,
  locationChecked: daysBack < 30,
  lastVerified: daysAgo(daysBack),
});

const g = globalThis as unknown as { __rentlyProperties?: Property[] };
if (!g.__rentlyProperties) g.__rentlyProperties = [];
const properties: Property[] = g.__rentlyProperties;

if (properties.length === 0) {
  properties.push(
    // Mumbai
    { id: "1", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Spacious 2BHK with Modern Amenities", type: "apartment", price: 22000, deposit: 44000, maintenance: 2000, parking: 500, address: "15 Sunshine Apartments, Andheri West", area: "Andheri West", city: "Mumbai", state: "Maharashtra", lat: 19.1364, lng: 72.8296, bedrooms: 2, bathrooms: 2, furnishing: "semi", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "AC", "Gym", "Pool", "Security"], rules: "No smoking. Rent by 5th.", description: "Beautiful 2BHK in the heart of Andheri West with modern amenities. Close to metro station and malls.", contactPhone: "+91 98765 43210", isVerified: true, isFeatured: true, status: "active", views: 245, createdAt: daysAgo(30), freshness: defaultFreshness(2) },
    { id: "6", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Luxury 2BHK with Pool Access", type: "apartment", price: 28000, deposit: 56000, maintenance: 3500, parking: 1000, address: "Powai Lake View Society", area: "Powai", city: "Mumbai", state: "Maharashtra", lat: 19.1176, lng: 72.9060, bedrooms: 2, bathrooms: 2, furnishing: "fully", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"], amenities: ["WiFi", "AC", "Pool", "Gym", "Parking", "Security"], rules: "No pets. Rent by 5th.", description: "Luxury apartment with pool and gym access in Powai.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 180, createdAt: daysAgo(25), freshness: defaultFreshness(25) },
    { id: "8", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Modern Studio Apartment", type: "apartment", price: 14000, deposit: 28000, maintenance: 1800, parking: 500, address: "Bandra East, CB Complex", area: "Bandra East", city: "Mumbai", state: "Maharashtra", lat: 19.0596, lng: 72.8656, bedrooms: 1, bathrooms: 1, furnishing: "fully", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"], amenities: ["WiFi", "AC", "Gym", "Security", "Lift"], rules: "Professionals only.", description: "Modern studio in Bandra East. Fully furnished with premium fittings.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: false, status: "active", views: 95, createdAt: daysAgo(12), freshness: defaultFreshness(12) },
    { id: "13", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Budget 1BHK Near Dadar Station", type: "apartment", price: 15000, deposit: 30000, maintenance: 1500, parking: 0, address: "Dadar West, Matoshree Building", area: "Dadar West", city: "Mumbai", state: "Maharashtra", lat: 19.0178, lng: 72.8478, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-20", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply", "Lift"], rules: "Family preferred.", description: "Affordable 1BHK near Dadar station. Great connectivity.", contactPhone: "+91 98765 43213", isVerified: true, isFeatured: false, status: "active", views: 88, createdAt: daysAgo(8), freshness: defaultFreshness(8) },
    { id: "14", ownerId: "owner-2", ownerName: "Priya Patil", title: "Furnished 3BHK in Borivali", type: "apartment", price: 38000, deposit: 76000, maintenance: 4000, parking: 1500, address: "Borivali West, SV Road", area: "Borivali West", city: "Mumbai", state: "Maharashtra", lat: 19.2307, lng: 72.8567, bedrooms: 3, bathrooms: 3, furnishing: "fully", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], amenities: ["WiFi", "AC", "Parking", "Gym", "Pool", "Security", "Lift"], rules: "Family only.", description: "Spacious 3BHK in Borivali with premium amenities.", contactPhone: "+91 98765 43214", isVerified: true, isFeatured: true, status: "active", views: 134, createdAt: daysAgo(5), freshness: defaultFreshness(5) },
    // Pune
    { id: "2", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Cozy 1BHK Near Metro Station", type: "apartment", price: 12000, deposit: 24000, maintenance: 1500, parking: 0, address: "22 Green Valley Society, Kothrud", area: "Kothrud", city: "Pune", state: "Maharashtra", lat: 18.5074, lng: 73.8077, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "AC", "Security", "Lift"], rules: "Rent due by 5th. No smoking.", description: "Cozy 1BHK near Kothrud metro station. Ideal for working professionals.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 98, createdAt: daysAgo(20), freshness: defaultFreshness(20) },
    { id: "3", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Premium 3BHK with Garden View", type: "house", price: 35000, deposit: 70000, maintenance: 3000, parking: 1000, address: "8 Rose Garden Lane, Baner", area: "Baner", city: "Pune", state: "Maharashtra", lat: 18.5596, lng: 73.7868, bedrooms: 3, bathrooms: 3, furnishing: "furnished", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], amenities: ["WiFi", "Parking", "AC", "Garden", "Security"], rules: "Family preferred. 1 month notice.", description: "Premium 3BHK with private garden in upscale Baner locality.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 67, createdAt: daysAgo(15), freshness: defaultFreshness(15) },
    { id: "4", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Furnished Room in Shared Flat", type: "room", price: 6500, deposit: 13000, maintenance: 500, parking: 0, address: "Near IT Park, Hinjewadi", area: "Hinjewadi", city: "Pune", state: "Maharashtra", lat: 18.5913, lng: 73.7389, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-05", images: ["https://images.unsplash.com/photo-1598928506311-c55ez637a513?w=800"], amenities: ["WiFi", "AC", "Meals"], rules: "No smoking, no alcohol.", description: "Furnished room in a shared flat near IT Park. Perfect for techies.", contactPhone: "+91 98765 43210", isVerified: false, isFeatured: false, status: "active", views: 34, createdAt: daysAgo(5), freshness: defaultFreshness(5, false) },
    { id: "7", ownerId: "owner-2", ownerName: "Priya Patil", title: "Budget PG with Meals & WiFi", type: "pg", price: 5500, deposit: 5500, maintenance: 0, parking: 0, address: "Near VIT College, Wadgaon", area: "Wadgaon", city: "Pune", state: "Maharashtra", lat: 18.4524, lng: 73.8470, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-01", images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"], amenities: ["WiFi", "Meals", "Security", "CCTV"], rules: "Students only. In-time 9 PM.", description: "Budget-friendly PG with 3 meals a day. Near VIT campus.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 120, createdAt: daysAgo(8), freshness: defaultFreshness(8) },
    { id: "9", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Office Space in IT Park", type: "office", price: 35000, deposit: 70000, maintenance: 5000, parking: 2000, address: "Blue Ridge IT Park, Hinjewadi", area: "Hinjewadi", city: "Pune", state: "Maharashtra", lat: 18.5912, lng: 73.7380, bedrooms: 0, bathrooms: 2, furnishing: "fully", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"], amenities: ["WiFi", "AC", "Parking", "Security", "CCTV", "Lift"], rules: "Commercial use only.", description: "Ready-to-move office space in premium IT park. 1200 sq ft.", contactPhone: "+91 98765 43210", isVerified: true, isFeatured: false, status: "active", views: 45, createdAt: daysAgo(7), freshness: defaultFreshness(7) },
    { id: "10", ownerId: "owner-2", ownerName: "Priya Patil", title: "Single Room for Students", type: "room", price: 5000, deposit: 10000, maintenance: 0, parking: 0, address: "Near Pune University, Ganeshkhind", area: "Ganeshkhind", city: "Pune", state: "Maharashtra", lat: 18.5362, lng: 73.8344, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-01", images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"], amenities: ["WiFi", "Water Supply"], rules: "Students only. 3-month minimum.", description: "Affordable single room near Pune University. Ideal for students.", contactPhone: "+91 98765 43211", isVerified: false, isFeatured: false, status: "active", views: 67, createdAt: daysAgo(3), freshness: defaultFreshness(3, false) },
    { id: "12", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "Cozy PG Hostel for Women", type: "pg", price: 7000, deposit: 7000, maintenance: 0, parking: 0, address: "Near Deccan Gymkhana, Pune", area: "Deccan", city: "Pune", state: "Maharashtra", lat: 18.5195, lng: 73.8443, bedrooms: 1, bathrooms: 1, furnishing: "furnished", availableFrom: "2026-09-05", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"], amenities: ["WiFi", "Meals", "Security", "CCTV", "AC"], rules: "Women only. In-time 9:30 PM.", description: "Safe and comfortable PG hostel for women near Deccan. 3 meals included.", contactPhone: "+91 98765 43210", isVerified: true, isFeatured: false, status: "active", views: 210, createdAt: daysAgo(22), freshness: defaultFreshness(22) },
    { id: "15", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "2BHK Flat in Wagholi", type: "apartment", price: 16000, deposit: 32000, maintenance: 1500, parking: 500, address: "Wagholi, Near EON IT Park", area: "Wagholi", city: "Pune", state: "Maharashtra", lat: 18.5805, lng: 74.0047, bedrooms: 2, bathrooms: 1, furnishing: "semi", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "Security", "Lift"], rules: "Family preferred.", description: "Affordable 2BHK near EON IT Park, Wagholi. Great for IT professionals.", contactPhone: "+91 98765 43215", isVerified: true, isFeatured: false, status: "active", views: 72, createdAt: daysAgo(10), freshness: defaultFreshness(10) },
    // Thane
    { id: "5", ownerId: "owner-2", ownerName: "Priya Patil", title: "Independent House with Parking", type: "house", price: 18000, deposit: 36000, maintenance: 2000, parking: 0, address: "Thane West, Near Station", area: "Thane West", city: "Thane", state: "Maharashtra", lat: 19.2183, lng: 72.9781, bedrooms: 2, bathrooms: 2, furnishing: "unfurnished", availableFrom: "2026-09-20", images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"], amenities: ["Parking", "Security", "Garden"], rules: "Family only. 2 month deposit.", description: "Independent house with covered parking near Thane station.", contactPhone: "+91 98765 43211", isVerified: true, isFeatured: false, status: "active", views: 52, createdAt: daysAgo(10), freshness: defaultFreshness(10) },
    { id: "16", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "1BHK in Ghodbunder Road", type: "apartment", price: 14000, deposit: 28000, maintenance: 1200, parking: 500, address: "Ghodbunder Road, Thane", area: "Ghodbunder", city: "Thane", state: "Maharashtra", lat: 19.2967, lng: 72.9330, bedrooms: 1, bathrooms: 1, furnishing: "semi", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "Security"], rules: "Rent by 5th.", description: "Well-connected 1BHK on Ghodbunder Road. Near malls and schools.", contactPhone: "+91 98765 43216", isVerified: true, isFeatured: false, status: "active", views: 44, createdAt: daysAgo(14), freshness: defaultFreshness(14) },
    // Navi Mumbai
    { id: "11", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "Premium 3BHK in Gated Society", type: "apartment", price: 32000, deposit: 64000, maintenance: 4000, parking: 1000, address: "Vashi Sector 17, Navi Mumbai", area: "Vashi", city: "Navi Mumbai", state: "Maharashtra", lat: 19.0715, lng: 72.9985, bedrooms: 3, bathrooms: 2, furnishing: "semi", availableFrom: "2026-10-15", images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"], amenities: ["WiFi", "Parking", "AC", "Gym", "Pool", "Security", "Lift"], rules: "Family preferred.", description: "Premium 3BHK in gated society with all modern amenities.", contactPhone: "+91 98765 43212", isVerified: true, isFeatured: true, status: "active", views: 156, createdAt: daysAgo(18), freshness: defaultFreshness(18) },
    { id: "17", ownerId: "owner-2", ownerName: "Priya Patil", title: "2BHK in Kharghar with Hill View", type: "apartment", price: 18000, deposit: 36000, maintenance: 2000, parking: 500, address: "Kharghar, Sector 35", area: "Kharghar", city: "Navi Mumbai", state: "Maharashtra", lat: 19.0474, lng: 73.0722, bedrooms: 2, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-25", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Parking", "Security", "Garden"], rules: "Family only.", description: "Spacious 2BHK in Kharghar with beautiful hill view. Near metro.", contactPhone: "+91 98765 43217", isVerified: true, isFeatured: false, status: "active", views: 63, createdAt: daysAgo(12), freshness: defaultFreshness(12) },
    { id: "18", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "1BHK in Panvel Near Station", type: "apartment", price: 11000, deposit: 22000, maintenance: 1000, parking: 0, address: "Panvel, Station Road", area: "Panvel", city: "Navi Mumbai", state: "Maharashtra", lat: 18.9890, lng: 73.1357, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply", "Lift"], rules: "Rent by 7th.", description: "Affordable 1BHK near Panvel station. Perfect for commuters.", contactPhone: "+91 98765 43218", isVerified: false, isFeatured: false, status: "active", views: 41, createdAt: daysAgo(7), freshness: defaultFreshness(7, false) },
    // Nagpur
    { id: "19", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "2BHK in Dharampeth", type: "apartment", price: 12000, deposit: 24000, maintenance: 1000, parking: 500, address: "Dharampeth, Nagpur", area: "Dharampeth", city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882, bedrooms: 2, bathrooms: 1, furnishing: "semi", availableFrom: "2026-09-20", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "Security"], rules: "Family preferred.", description: "Well-located 2BHK in Dharampeth. Near schools and markets.", contactPhone: "+91 98765 43219", isVerified: true, isFeatured: false, status: "active", views: 56, createdAt: daysAgo(16), freshness: defaultFreshness(16) },
    { id: "20", ownerId: "owner-2", ownerName: "Priya Patil", title: "1BHK in Sitabuldi", type: "apartment", price: 8000, deposit: 16000, maintenance: 800, parking: 0, address: "Sitabuldi, Nagpur", area: "Sitabuldi", city: "Nagpur", state: "Maharashtra", lat: 21.1498, lng: 79.0806, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply"], rules: "Students welcome.", description: "Budget 1BHK in central Sitabuldi. Close to auto and bus stands.", contactPhone: "+91 98765 43220", isVerified: true, isFeatured: false, status: "active", views: 38, createdAt: daysAgo(9), freshness: defaultFreshness(9) },
    { id: "21", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "3BHK inCivil Lines", type: "apartment", price: 25000, deposit: 50000, maintenance: 3000, parking: 1000, address: "Civil Lines, Nagpur", area: "Civil Lines", city: "Nagpur", state: "Maharashtra", lat: 21.1530, lng: 79.0960, bedrooms: 3, bathrooms: 2, furnishing: "furnished", availableFrom: "2026-10-01", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], amenities: ["WiFi", "AC", "Parking", "Gym", "Security", "Lift"], rules: "Family only. 11-month agreement.", description: "Premium 3BHK in upscale Civil Lines area of Nagpur.", contactPhone: "+91 98765 43221", isVerified: true, isFeatured: true, status: "active", views: 92, createdAt: daysAgo(20), freshness: defaultFreshness(20) },
    // Nashik
    { id: "22", ownerId: "owner-2", ownerName: "Priya Patil", title: "2BHK in College Road", type: "apartment", price: 10000, deposit: 20000, maintenance: 1000, parking: 500, address: "College Road, Nashik", area: "College Road", city: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898, bedrooms: 2, bathrooms: 1, furnishing: "semi", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "Security"], rules: "Family preferred.", description: "Affordable 2BHK on College Road. Near colleges and hospitals.", contactPhone: "+91 98765 43222", isVerified: true, isFeatured: false, status: "active", views: 47, createdAt: daysAgo(11), freshness: defaultFreshness(11) },
    { id: "23", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "1BHK in CIDCO", type: "apartment", price: 7500, deposit: 15000, maintenance: 800, parking: 0, address: "CIDCO, Nashik", area: "CIDCO", city: "Nashik", state: "Maharashtra", lat: 20.0050, lng: 73.7720, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply", "Lift"], rules: "Non-veg allowed.", description: "Clean 1BHK in CIDCO layout. Quiet neighborhood.", contactPhone: "+91 98765 43223", isVerified: false, isFeatured: false, status: "active", views: 33, createdAt: daysAgo(6), freshness: defaultFreshness(6, false) },
    // Kolhapur
    { id: "24", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "2BHK Near Shivaji University", type: "apartment", price: 9000, deposit: 18000, maintenance: 800, parking: 0, address: "Taljai, Kolhapur", area: "Taljai", city: "Kolhapur", state: "Maharashtra", lat: 16.7050, lng: 74.2433, bedrooms: 2, bathrooms: 1, furnishing: "semi", availableFrom: "2026-09-20", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking"], rules: "Students preferred.", description: "Affordable 2BHK near Shivaji University campus.", contactPhone: "+91 98765 43224", isVerified: true, isFeatured: false, status: "active", views: 29, createdAt: daysAgo(13), freshness: defaultFreshness(13) },
    // Satara
    { id: "25", ownerId: "owner-2", ownerName: "Priya Patil", title: "1BHK in Satara City", type: "apartment", price: 6000, deposit: 12000, maintenance: 500, parking: 0, address: "Satara City, Main Road", area: "Satara City", city: "Satara", state: "Maharashtra", lat: 17.6868, lng: 73.9985, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply"], rules: "Rent by 10th.", description: "Budget 1BHK in heart of Satara. Peaceful area.", contactPhone: "+91 98765 43225", isVerified: true, isFeatured: false, status: "active", views: 22, createdAt: daysAgo(8), freshness: defaultFreshness(8) },
    // Solapur
    { id: "26", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "2BHK in Solapur Near Railway Station", type: "apartment", price: 8500, deposit: 17000, maintenance: 700, parking: 0, address: "Railway Line, Solapur", area: "Railway Line", city: "Solapur", state: "Maharashtra", lat: 17.6599, lng: 75.9064, bedrooms: 2, bathrooms: 1, furnishing: "semi", availableFrom: "2026-09-25", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Water Supply"], rules: "Family preferred.", description: "Convenient 2BHK near Solapur railway station.", contactPhone: "+91 98765 43226", isVerified: true, isFeatured: false, status: "active", views: 19, createdAt: daysAgo(15), freshness: defaultFreshness(15) },
    // Aurangabad (Chhatrapati Sambhajinagar)
    { id: "27", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "2BHK in Aurangabad Near SB College", type: "apartment", price: 10000, deposit: 20000, maintenance: 1000, parking: 500, address: "Jalna Road, Aurangabad", area: "Jalna Road", city: "Aurangabad", state: "Maharashtra", lat: 19.8762, lng: 75.3433, bedrooms: 2, bathrooms: 1, furnishing: "semi", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["WiFi", "Parking", "Security"], rules: "Family preferred.", description: "Well-connected 2BHK in Aurangabad. Close to SB College.", contactPhone: "+91 98765 43227", isVerified: true, isFeatured: false, status: "active", views: 35, createdAt: daysAgo(10), freshness: defaultFreshness(10) },
    // Amravati
    { id: "28", ownerId: "owner-2", ownerName: "Priya Patil", title: "1BHK in Amravati Near Campus", type: "apartment", price: 5500, deposit: 11000, maintenance: 400, parking: 0, address: "Rajapeth, Amravati", area: "Rajapeth", city: "Amravati", state: "Maharashtra", lat: 20.9374, lng: 77.7796, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-10", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply"], rules: "Students only.", description: "Budget 1BHK near Amravati university campus.", contactPhone: "+91 98765 43228", isVerified: false, isFeatured: false, status: "active", views: 18, createdAt: daysAgo(5), freshness: defaultFreshness(5, false) },
    // Nanded
    { id: "29", ownerId: "owner-3", ownerName: "Suresh Deshmukh", title: "2BHK Near Nanded Gurudwara", type: "apartment", price: 7000, deposit: 14000, maintenance: 600, parking: 0, address: "Vazirabad, Nanded", area: "Vazirabad", city: "Nanded", state: "Maharashtra", lat: 19.1573, lng: 77.3260, bedrooms: 2, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-20", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply", "Lift"], rules: "Family preferred.", description: "Affordable 2BHK near Nanded Gurudwara. Peaceful locality.", contactPhone: "+91 98765 43229", isVerified: true, isFeatured: false, status: "active", views: 25, createdAt: daysAgo(12), freshness: defaultFreshness(12) },
    // Ratnagiri
    { id: "30", ownerId: "owner-1", ownerName: "Rajesh Sharma", title: "1BHK in Ratnagiri Near Beach", type: "apartment", price: 5000, deposit: 10000, maintenance: 300, parking: 0, address: "Thiba Palace Road, Ratnagiri", area: "Thiba Palace", city: "Ratnagiri", state: "Maharashtra", lat: 16.9902, lng: 73.3120, bedrooms: 1, bathrooms: 1, furnishing: "unfurnished", availableFrom: "2026-09-15", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"], amenities: ["Water Supply"], rules: "Rent by 10th.", description: "Cozy 1BHK near Thiba Palace and beach. Tourist-friendly area.", contactPhone: "+91 98765 43230", isVerified: true, isFeatured: false, status: "active", views: 15, createdAt: daysAgo(7), freshness: defaultFreshness(7) }
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
  if (filters.city) {
    const cityLower = filters.city.toLowerCase();
    results = results.filter((p) => p.city.toLowerCase().includes(cityLower) || p.area.toLowerCase().includes(cityLower));
  }
  if (filters.area) results = results.filter((p) => p.area.toLowerCase().includes(filters.area!.toLowerCase()) || p.address.toLowerCase().includes(filters.area!.toLowerCase()));
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

export function addProperty(data: Omit<Property, "id" | "createdAt" | "views" | "status" | "isVerified" | "isFeatured" | "freshness">): Property {
  const now = new Date().toISOString();
  const prop: Property = {
    ...data,
    id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "active",
    isVerified: false,
    isFeatured: false,
    views: 0,
    createdAt: now,
    freshness: { available: true, rentConfirmed: false, photosUpdated: false, locationChecked: false, lastVerified: now },
  };
  properties.unshift(prop);
  return prop;
}

export function updateProperty(id: string, data: Partial<Property>): Property | null {
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const safeData: Record<string, unknown> = { ...data };
  delete safeData.id;
  delete safeData.ownerId;
  delete safeData.isVerified;
  delete safeData.isFeatured;
  delete safeData.views;
  delete safeData.status;
  delete safeData.createdAt;
  delete safeData.freshness;
  properties[idx] = { ...properties[idx], ...safeData };
  return properties[idx];
}

export function deleteProperty(id: string): boolean {
  const idx = properties.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  properties.splice(idx, 1);
  return true;
}
