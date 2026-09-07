"use client";

import { useState, useEffect, useCallback } from "react";

export interface Notification {
  id: string;
  type: "message" | "inquiry" | "contract" | "trust" | "system";
  title: string;
  description: string;
  propertyTitle?: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getNotifIcon(type: string) {
  switch (type) {
    case "message": return { bg: "var(--primary-light)", color: "var(--primary)", emoji: "💬" };
    case "inquiry": return { bg: "var(--accent-light)", color: "var(--accent-hover)", emoji: "📩" };
    case "contract": return { bg: "var(--success-light)", color: "var(--success)", emoji: "📋" };
    case "trust": return { bg: "var(--warning-light)", color: "var(--warning)", emoji: "🛡" };
    default: return { bg: "var(--border-light)", color: "var(--text-muted)", emoji: "🔔" };
  }
}

export function NotificationBell({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="notification-bell" style={{ position: "relative", padding: 8, borderRadius: "var(--radius)", background: "none", border: "none", cursor: "pointer" }}>
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="var(--text-secondary)" strokeWidth="2">
        <path strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {count > 0 && <span className="notification-badge">{count > 9 ? "9+" : count}</span>}
    </button>
  );
}

export function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onClose }: {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
      background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
      display: "flex", justifyContent: "flex-end",
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 400, maxWidth: "100vw", height: "100vh", background: "var(--surface)",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column",
          animation: "slideUp 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)" }}>Notifications</h3>
            {unread > 0 && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{unread} unread</span>}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {unread > 0 && (
              <button onClick={onMarkAllRead} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>Mark all read</button>
            )}
            <button onClick={onClose} style={{ padding: 6, borderRadius: "var(--radius)", background: "none", border: "none", cursor: "pointer" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          {notifications.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map(n => {
              const icon = getNotifIcon(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => !n.read && onMarkRead(n.id)}
                  className={`notification-item ${!n.read ? "unread" : ""}`}
                  style={{ marginBottom: 6 }}
                >
                  <div className="notification-icon" style={{ background: icon.bg, color: icon.color }}>
                    {icon.emoji}
                  </div>
                  <div className="notification-body">
                    <div className="notification-title">{n.title}</div>
                    <div className="notification-desc">{n.description}</div>
                    {n.propertyTitle && <div className="notification-desc" style={{ fontWeight: 600, marginTop: 2 }}>Re: {n.propertyTitle}</div>}
                  </div>
                  <div className="notification-time">{timeAgo(n.createdAt)}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`rently_notifications_${userId}`);
    if (stored) {
      try { setNotifications(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notif: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 50);
      if (userId) localStorage.setItem(`rently_notifications_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      if (userId) localStorage.setItem(`rently_notifications_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      if (userId) localStorage.setItem(`rently_notifications_${userId}`, JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  return { notifications, unreadCount, showPanel, setShowPanel, addNotification, markRead, markAllRead };
}
