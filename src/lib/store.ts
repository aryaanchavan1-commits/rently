// In-memory store for conversations and messages
// In production, this would be a database

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantMessage: string;
  ownerName: string;
  ownerPhone: string;
  ownerId: string;
  status: "new" | "replied" | "archived";
  createdAt: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "tenant" | "owner";
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// Global store (persists in memory during server lifetime)
const globalStore = globalThis as unknown as {
  conversations: Conversation[];
  messages: Message[];
};

if (!globalStore.conversations) {
  globalStore.conversations = [];
}
if (!globalStore.messages) {
  globalStore.messages = [];
}

export const conversations = globalStore.conversations;
export const messages = globalStore.messages;

export function addConversation(data: Omit<Conversation, "id" | "createdAt" | "lastMessage" | "lastMessageAt" | "unread" | "status">): Conversation {
  const conv: Conversation = {
    ...data,
    id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "new",
    createdAt: new Date().toISOString(),
    lastMessage: data.tenantMessage,
    lastMessageAt: new Date().toISOString(),
    unread: 1,
  };
  conversations.unshift(conv);
  return conv;
}

export function addMessage(data: Omit<Message, "id" | "createdAt" | "read">): Message {
  const msg: Message = {
    ...data,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.push(msg);

  // Update conversation
  const conv = conversations.find((c) => c.id === data.conversationId);
  if (conv) {
    conv.lastMessage = data.content;
    conv.lastMessageAt = new Date().toISOString();
    if (data.sender === "tenant") {
      conv.unread += 1;
    }
  }
  return msg;
}

export function getConversationsByOwner(ownerId: string): Conversation[] {
  return conversations.filter((c) => c.ownerId === ownerId);
}

export function getConversationsByTenant(tenantEmail: string): Conversation[] {
  return conversations.filter((c) => c.tenantEmail === tenantEmail);
}

export function getMessages(conversationId: string): Message[] {
  return messages.filter((m) => m.conversationId === conversationId);
}

export function markAsRead(conversationId: string, sender: "tenant" | "owner") {
  messages.forEach((m) => {
    if (m.conversationId === conversationId && m.sender !== sender) {
      m.read = true;
    }
  });
  const conv = conversations.find((c) => c.id === conversationId);
  if (conv) conv.unread = 0;
}

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

// Seed some demo data
if (conversations.length === 0) {
  const demoConversations: Conversation[] = [
    {
      id: "conv-demo-1",
      propertyId: "1",
      propertyTitle: "Spacious 2BHK with Modern Amenities",
      tenantName: "Amit Kumar",
      tenantEmail: "amit@demo.in",
      tenantPhone: "+91 98765 11111",
      tenantMessage: "Hi, is the 2BHK in Andheri still available? I'd like to schedule a visit this weekend.",
      ownerName: "Rajesh Sharma",
      ownerPhone: "+91 98765 43210",
      ownerId: "owner-1",
      status: "new",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      lastMessage: "Hi, is the 2BHK in Andheri still available? I'd like to schedule a visit this weekend.",
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unread: 1,
    },
    {
      id: "conv-demo-2",
      propertyId: "3",
      propertyTitle: "Premium 3BHK with Garden View",
      tenantName: "Neha Gupta",
      tenantEmail: "neha@demo.in",
      tenantPhone: "+91 98765 22222",
      tenantMessage: "Can you share more photos of the property? Also, is the garden area shared or private?",
      ownerName: "Suresh Deshmukh",
      ownerPhone: "+91 98765 43212",
      ownerId: "owner-1",
      status: "replied",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      lastMessage: "Yes, the garden is private. I'll share more photos shortly.",
      lastMessageAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      unread: 0,
    },
  ];
  conversations.push(...demoConversations);

  const demoMessages: Message[] = [
    {
      id: "msg-demo-1",
      conversationId: "conv-demo-1",
      sender: "tenant",
      senderName: "Amit Kumar",
      content: "Hi, is the 2BHK in Andheri still available? I'd like to schedule a visit this weekend.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "msg-demo-2",
      conversationId: "conv-demo-2",
      sender: "tenant",
      senderName: "Neha Gupta",
      content: "Can you share more photos of the property? Also, is the garden area shared or private?",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg-demo-3",
      conversationId: "conv-demo-2",
      sender: "owner",
      senderName: "Suresh Deshmukh",
      content: "Yes, the garden is private. I'll share more photos shortly.",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ];
  messages.push(...demoMessages);
}
