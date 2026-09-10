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
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Nivasa by Arynoxtech — Find Your Perfect Rental in Maharashtra",
  description: "Zero brokerage rental platform by Arynoxtech. Find rooms, apartments, houses & PGs across Mumbai, Pune, Thane, Nagpur, Nashik, Kolhapur, Aurangabad & 100+ cities in Maharashtra. AI-powered search, e-contracts with Aadhaar eSign.",
  keywords: ["rental properties", "Maharashtra", "Mumbai", "Pune", "Nagpur", "Nashik", "Kolhapur", "Aurangabad", "rooms for rent", "apartment", "no brokerage", "rent house", "PG", "hostel", "Arynoxtech", "nivasa", "e-contract", "esign", "zero brokerage"],
  openGraph: {
    title: "Nivasa by Arynoxtech — Find Your Perfect Rental in Maharashtra",
    description: "Zero brokerage rental platform with AI-powered property search by Arynoxtech",
    type: "website",
    locale: "en_IN",
    siteName: "Nivasa - Arynoxtech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nivasa by Arynoxtech — Find Your Perfect Rental in Maharashtra",
    description: "Zero brokerage rental platform with AI-powered property search",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "nivasa",
  },
  other: {
    company: "Arynoxtech",
    product: "nivasa",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Arynoxtech" />
        <link rel="canonical" href="https://nivasa.arynoxtech.com" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Nivasa by Arynoxtech",
          "url": "https://nivasa.arynoxtech.com",
          "description": "Zero brokerage rental platform for Maharashtra. Find rooms, apartments, houses & PGs across Mumbai, Pune, Nagpur with AI-powered search and e-contracts.",
          "applicationCategory": "RealEstate",
          "operatingSystem": "Web, Android",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
          "author": { "@type": "Organization", "name": "Arynoxtech", "url": "https://arynoxtech.com" },
          "potentialAction": { "@type": "SearchAction", "target": "https://nivasa.arynoxtech.com/properties?city={search_term_string}", "query-input": "required name=search_term_string" }
        }) }} />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}` }} />
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
