import { NextRequest, NextResponse } from "next/server";
import { addMessage, getMessages, markAsRead } from "@/lib/store";

// POST - Send message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, sender, senderName, content } = body;

    if (!conversationId || !sender || !senderName || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const msg = addMessage({ conversationId, sender, senderName, content });
    return NextResponse.json({ success: true, message: msg });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// GET - Get messages for a conversation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  const markRead = searchParams.get("markRead");
  const readBy = searchParams.get("readBy") as "tenant" | "owner" | null;

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  if (markRead && readBy) {
    markAsRead(conversationId, readBy);
  }

  return NextResponse.json(getMessages(conversationId));
}
