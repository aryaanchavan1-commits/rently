import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LangProviderWrap from "@/components/LangProviderWrap";
import AuthProviderWrap from "@/components/AuthProviderWrap";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a56db",
};

export const metadata: Metadata = {
  title: "Rently by Arynoxtech — Find Your Perfect Rental in Maharashtra",
  description: "Zero brokerage rental platform by Arynoxtech. Find rooms, apartments, houses & PGs across Mumbai, Pune, Thane, Nagpur, Nashik, Kolhapur, Aurangabad & 100+ cities in Maharashtra. AI-powered search, e-contracts with Aadhaar eSign.",
  keywords: ["rental properties", "Maharashtra", "Mumbai", "Pune", "Nagpur", "Nashik", "Kolhapur", "Aurangabad", "rooms for rent", "apartment", "no brokerage", "rent house", "PG", "hostel", "Arynoxtech", "Rently", "e-contract", "esign", "zero brokerage"],
  openGraph: {
    title: "Rently by Arynoxtech — Find Your Perfect Rental in Maharashtra",
    description: "Zero brokerage rental platform with AI-powered property search by Arynoxtech",
    type: "website",
    locale: "en_IN",
    siteName: "Rently - Arynoxtech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rently by Arynoxtech — Find Your Perfect Rental in Maharashtra",
    description: "Zero brokerage rental platform with AI-powered property search",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rently",
  },
  other: {
    company: "Arynoxtech",
    product: "Rently",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <LangProviderWrap>
          <AuthProviderWrap>
            <ClientLayout>{children}</ClientLayout>
          </AuthProviderWrap>
        </LangProviderWrap>
      </body>
    </html>
  );
}
