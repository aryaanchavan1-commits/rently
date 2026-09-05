import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  try {
    const { email, password, name, phone, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (!supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existing } = await admin.auth.admin.listUsers();
    const userExists = existing?.users?.some((u) => u.email === email);

    if (userExists) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone: phone || "", role: role || "tenant" },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    try {
      await admin.from("profiles").upsert({
        id: data.user.id,
        name,
        email,
        phone: phone || "",
        role: role || "tenant",
      });
    } catch {
      // Profile table may not exist yet, that's ok
    }

    return NextResponse.json({ success: true, userId: data.user.id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
