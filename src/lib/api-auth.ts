import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function requireAuth(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (!token) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email || "",
      role: data.user.user_metadata?.role || "tenant",
    };
  } catch {
    return null;
  }
}

export function rateLimit(
  map: Map<string, { count: number; resetAt: number }>,
  key: string,
  limit = 30,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Simple global rate limit store
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
export function globalRateLimit(key: string, limit = 30): boolean {
  return rateLimit(rateLimitStore, key, limit);
}

export function sanitizeString(input: string, maxLength = 500): string {
  return input.replace(/[<>]/g, "").trim().slice(0, maxLength);
}

export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {}
  return "";
}

export function validatePrice(price: number): boolean {
  return price >= 500 && price <= 1000000;
}

export function validateCoords(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
