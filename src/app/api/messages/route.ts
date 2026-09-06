import { NextRequest, NextResponse } from "next/server";
import { addMessage, getMessages, markAsRead } from "@/lib/store";
import { requireAuth, globalRateLimit, sanitizeString } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  if (!globalRateLimit("msg-write", 20)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { conversationId, sender, senderName, content } = body;

    if (!conversationId || !sender || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["tenant", "owner"].includes(sender)) {
      return NextResponse.json({ error: "Invalid sender" }, { status: 400 });
    }

    const msg = addMessage({
      conversationId: sanitizeString(conversationId, 100),
      sender,
      senderName: sanitizeString(senderName || user.email.split("@")[0], 100),
      content: sanitizeString(content, 2000),
    });
    return NextResponse.json({ success: true, message: msg });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!globalRateLimit("msg-read", 30)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const markRead = searchParams.get("markRead");
  const readBy = searchParams.get("readBy") as "tenant" | "owner" | null;

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  if (markRead && readBy && ["tenant", "owner"].includes(readBy)) {
    markAsRead(sanitizeString(conversationId, 100), readBy);
  }

  return NextResponse.json(getMessages(sanitizeString(conversationId, 100)));
}
