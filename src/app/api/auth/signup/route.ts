import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { globalRateLimit, sanitizeString } from "@/lib/api-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ALLOWED_ROLES = ["tenant", "owner"];

export async function POST(req: Request) {
  try {
    if (!globalRateLimit("signup", 10)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { email, password, name, phone, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (!ALLOWED_ROLES.includes(role || "tenant")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const sanitizedEmail = sanitizeString(email, 254);
    const sanitizedName = sanitizeString(name, 100);

    if (!supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await admin.auth.admin.createUser({
      email: sanitizedEmail,
      password,
      email_confirm: true,
      user_metadata: { name: sanitizedName, phone: sanitizeString(phone || "", 20), role: role || "tenant" },
    });

    if (error) {
      if (error.message?.includes("already")) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: "Signup failed" }, { status: 400 });
    }

    try {
      await admin.from("profiles").upsert({
        id: data.user.id,
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizeString(phone || "", 20),
        role: role || "tenant",
      });
    } catch {
      // Profile table may not exist yet
    }

    return NextResponse.json({ success: true, userId: data.user.id });
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
