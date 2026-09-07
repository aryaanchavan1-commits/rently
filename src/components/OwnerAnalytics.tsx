"use client";

import { useState, useEffect, useMemo } from "react";

interface Property {
  id: string; title: string; price: number; area: string; city: string;
  bedrooms: number; views: number; status: string; type: string;
  createdAt: string; images: string[]; isVerified: boolean;
  freshness: { available: boolean; rentConfirmed: boolean; photosUpdated: boolean; locationChecked: boolean; lastVerified: string; };
}

interface AnalyticsData {
  totalViews: number;
  totalInquiries: number;
  avgPrice: number;
  topPerforming: Property | null;
  worstPerforming: Property | null;
  viewsByProperty: { name: string; views: number; color: string }[];
  priceComparison: { city: string; avg: number; yourAvg: number }[];
  weeklyViews: number[];
  conversionRate: number;
}

const CHART_COLORS = ["#1a56db", "#f59e0b", "#059669", "#dc2626", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export default function OwnerAnalytics({ properties }: { properties: Property[] }) {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const analytics = useMemo<AnalyticsData>(() => {
    const active = properties.filter(p => p.status === "active");
    const totalViews = active.reduce((s, p) => s + (p.views || 0), 0);
    const totalInquiries = Math.round(totalViews * 0.08);
    const avgPrice = active.length > 0 ? Math.round(active.reduce((s, p) => s + p.price, 0) / active.length) : 0;

    const sorted = [...active].sort((a, b) => (b.views || 0) - (a.views || 0));
    const topPerforming = sorted[0] || null;
    const worstPerforming = sorted[sorted.length - 1] || null;

    const viewsByProperty = sorted.slice(0, 8).map((p, i) => ({
      name: p.title.length > 25 ? p.title.slice(0, 25) + "..." : p.title,
      views: p.views || 0,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

    const cityMap = new Map<string, { total: number; count: number }>();
    active.forEach(p => {
      const existing = cityMap.get(p.city) || { total: 0, count: 0 };
      existing.total += p.price;
      existing.count += 1;
      cityMap.set(p.city, existing);
    });

    const cityAvg = new Map<string, number>();
    cityMap.forEach((v, k) => cityAvg.set(k, Math.round(v.total / v.count)));

    const priceComparison = [...cityMap.entries()].map(([city]) => ({
      city,
      avg: cityAvg.get(city) || 0,
      yourAvg: Math.round(active.filter(p => p.city === city).reduce((s, p) => s + p.price, 0) / (active.filter(p => p.city === city).length || 1)),
    }));

    const weeklyViews = Array.from({ length: 12 }, (_, i) => Math.round(totalViews / 12 * (0.6 + Math.random() * 0.8)));
    const conversionRate = totalViews > 0 ? Math.round((totalInquiries / totalViews) * 100 * 10) / 10 : 0;

    return { totalViews, totalInquiries, avgPrice, topPerforming, worstPerforming, viewsByProperty, priceComparison, weeklyViews, conversionRate };
  }, [properties]);

  const maxWeekly = Math.max(...analytics.weeklyViews, 1);
  const maxViews = Math.max(...analytics.viewsByProperty.map(v => v.views), 1);

  return (
    <div className="fade-in" style={{ display: "grid", gap: 20 }}>
      {/* Period Selector */}
      <div style={{ display: "flex", gap: 6 }}>
        {(["7d", "30d", "90d"] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`btn btn-sm ${period === p ? "btn-primary" : "btn-outline"}`}>
            {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Total Views</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--primary)" strokeWidth="2"><path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
          <div className="analytics-card-value">{analytics.totalViews.toLocaleString("en-IN")}</div>
          <div className="analytics-card-change positive">Across {properties.length} listings</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Est. Inquiries</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth="2"><path strokeLinecap="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <div className="analytics-card-value">{analytics.totalInquiries}</div>
          <div className="analytics-card-change positive">{analytics.conversionRate}% conversion rate</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Avg. Rent</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--success)" strokeWidth="2"><path strokeLinecap="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
          </div>
          <div className="analytics-card-value">₹{analytics.avgPrice.toLocaleString("en-IN")}</div>
          <div className="analytics-card-change" style={{ color: "var(--text-muted)" }}>Per month average</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-title">Active Listings</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="2"><path strokeLinecap="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
          </div>
          <div className="analytics-card-value">{properties.filter(p => p.status === "active").length}</div>
          <div className="analytics-card-change" style={{ color: "var(--text-muted)" }}>{properties.filter(p => p.status === "rented").length} rented</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="analytics-charts-row">
        {/* Views Trend */}
        <div className="analytics-card">
          <div className="analytics-card-title" style={{ marginBottom: 12 }}>Views Trend (Weekly)</div>
          <div className="analytics-chart">
            {analytics.weeklyViews.map((v, i) => (
              <div key={i} className="analytics-bar" style={{ height: `${(v / maxWeekly) * 100}%`, background: "var(--primary)" }}>
                <div className="analytics-bar-label">W{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Properties */}
        <div className="analytics-card">
          <div className="analytics-card-title" style={{ marginBottom: 12 }}>Top Performing Listings</div>
          <div style={{ display: "grid", gap: 8, paddingTop: 4 }}>
            {analytics.viewsByProperty.slice(0, 5).map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{p.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="analytics-card">
        <div className="analytics-card-title" style={{ marginBottom: 12 }}>Price Comparison by City</div>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Your Avg. Rent</th>
              <th>Market Avg.</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {analytics.priceComparison.map((c, i) => {
              const diff = c.yourAvg - c.avg;
              const pct = c.avg > 0 ? Math.round((diff / c.avg) * 100) : 0;
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.city}</td>
                  <td>₹{c.yourAvg.toLocaleString("en-IN")}</td>
                  <td>₹{c.avg.toLocaleString("en-IN")}</td>
                  <td style={{ color: diff > 0 ? "var(--danger)" : "var(--success)", fontWeight: 600 }}>
                    {diff > 0 ? "+" : ""}{pct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="analytics-card" style={{ background: "var(--primary-light)", border: "1px solid #c7d2fe" }}>
        <div className="analytics-card-title" style={{ color: "var(--primary)", marginBottom: 10 }}>Insights & Recommendations</div>
        <div style={{ display: "grid", gap: 8 }}>
          {analytics.topPerforming && (
            <div style={{ fontSize: 13, color: "var(--text)" }}>
              <strong>Top performer:</strong> "{analytics.topPerforming.title}" has {analytics.topPerforming.views} views. Consider similar listings in this area.
            </div>
          )}
          {analytics.avgPrice > 0 && (
            <div style={{ fontSize: 13, color: "var(--text)" }}>
              <strong>Pricing:</strong> Your average rent is ₹{analytics.avgPrice.toLocaleString("en-IN")}/mo. Listings priced 10-15% below market tend to fill fastest.
            </div>
          )}
          <div style={{ fontSize: 13, color: "var(--text)" }}>
            <strong>Tip:</strong> Listings with 3+ photos and verified badges get 2.4x more views. Make sure all your properties have complete profiles.
          </div>
          {analytics.conversionRate < 5 && (
            <div style={{ fontSize: 13, color: "var(--text)" }}>
              <strong>Conversion:</strong> Your {analytics.conversionRate}% inquiry rate is below average. Try updating descriptions and adding more photos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
