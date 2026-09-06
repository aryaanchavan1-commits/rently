import { NextResponse } from "next/server";
import { globalRateLimit, sanitizeString } from "@/lib/api-auth";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are Ria, the AI rental assistant for Rently — a zero brokerage rental platform for Maharashtra, India.

You help tenants find rental properties and help owners list their properties.

Key facts about Rently:
- Covers 30+ cities across Maharashtra
- Owner pricing: ₹49/week, ₹149/month, ₹999/year
- Zero brokerage for tenants
- AI-powered property matching
- Verified owner profiles
- Direct chat between tenants and owners
- Supports: apartments, houses, rooms, PGs, office spaces

When helping tenants:
- Ask about city preference, budget, property type, number of bedrooms
- Recommend specific areas/localities within Maharashtra cities
- Mention approximate rent ranges for areas
- Be concise and friendly

When helping owners:
- Explain the ₹49/week plan benefits
- Highlight how to get more leads
- Mention verification process

Always respond in the same language the user writes in (English, Hindi, or Marathi).
Keep responses concise (under 200 words) unless the user asks for detail.`;

export async function POST(request: Request) {
  try {
    if (!globalRateLimit("ai", 20)) {
      return NextResponse.json({ response: "You're sending messages too fast. Please wait a moment." });
    }

    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ response: "Please provide a message." });
    }

    const sanitizedMessage = sanitizeString(message, 1000);
    if (!sanitizedMessage) {
      return NextResponse.json({ response: "Please provide a valid message." });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ response: fallbackReply(sanitizedMessage) });
    }

    // Limit history to last 10 messages to prevent token abuse
    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...safeHistory.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: typeof m.content === "string" ? sanitizeString(m.content, 500) : "",
      })),
      { role: "user", content: sanitizedMessage },
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ response: fallbackReply(sanitizedMessage) });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || fallbackReply(sanitizedMessage);

    return NextResponse.json({ response: reply });
  } catch {
    return NextResponse.json({ response: "I'm having trouble connecting. Please try again." });
  }
}

function fallbackReply(msg: string): string {
  const l = msg.toLowerCase();
  if (l.includes("2bhk") || l.includes("2 bhk")) return "2BHK options:\n\n• Andheri West, Mumbai — ₹22,000/mo\n• Kothrud, Pune — ₹18,000/mo\n• Thane West — ₹16,500/mo\n\nWant me to filter by budget?";
  if (l.includes("pune")) return "Best areas in Pune:\n\n• Hinjewadi — IT hub, ₹12K–25K\n• Baner — Modern, ₹15K–30K\n• Kothrud — Family, ₹10K–22K\n• Wakad — Budget, ₹9K–18K\n\nWhat property type do you need?";
  if (l.includes("mumbai")) return "Popular Mumbai areas:\n\n• Andheri West — ₹15K–35K\n• Bandra East — Premium, ₹25K–50K\n• Powai — Modern, ₹18K–40K\n\nWhat's your budget?";
  if (l.includes("pg")) return "PG options:\n\n• Hinjewadi — ₹8K/mo (meals)\n• Andheri — ₹10K/mo (meals)\n• Kothrud — ₹7.5K/mo (meals)";
  if (l.includes("49") || l.includes("price") || l.includes("plan")) return "Owner plans:\n\n• ₹49/week — Up to 3 listings, verified badge\n• ₹149/month — Unlimited listings, featured placement\n\nBoth include direct tenant contact, zero brokerage.";
  return "I can help you find:\n\n• Properties by area, budget, or type\n• Best neighborhoods in Maharashtra\n• Budget-friendly rentals\n\nTry: \"1BHK in Pune under ₹15,000\"";
}
