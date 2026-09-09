"use client";
import { useState, useRef, useCallback, ReactNode } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 120));
    }
  }, [pulling, refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(60);
      try {
        await onRefresh();
      } catch {}
      setRefreshing(false);
    }
    setPullDistance(0);
    setPulling(false);
  }, [pullDistance, refreshing, onRefresh]);

  return (
    <div
      ref={containerRef}
      style={{ overflowY: "auto", overscrollBehaviorY: "contain", minHeight: "100%" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          height: pullDistance,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: pulling ? "none" : "height 0.25s ease",
          overflow: "hidden",
        }}
      >
        {pullDistance > 10 && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2.5px solid #e3e7ef",
              borderTopColor: "#1a56db",
              animation: refreshing ? "spin 0.7s linear infinite" : "none",
              transform: `rotate(${pullDistance * 3}deg)`,
              transition: pulling ? "none" : "transform 0.25s ease",
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
