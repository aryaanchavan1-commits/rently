// API URL helper for Capacitor compatibility
// In web mode: relative URLs work (empty base)
// In Capacitor: needs full Vercel URL since there's no local server

const PROD_URL = "https://nivasa-green.vercel.app";

export function apiUrl(path: string): string {
  if (typeof window === "undefined") return path;
  const isCapacitor = !!(window as any).Capacitor;
  if (isCapacitor) return `${PROD_URL}${path}`;
  return path;
}
