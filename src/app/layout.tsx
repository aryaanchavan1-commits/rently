import type { Metadata, Viewport } from "next";
import "./globals.css";
import LangProviderWrap from "@/components/LangProviderWrap";
import AuthProviderWrap from "@/components/AuthProviderWrap";
import ClientLayout from "@/components/ClientLayout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a365d",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Rently — Find Your Perfect Rental in Maharashtra",
  description: "Zero brokerage rental platform with AI-powered search. Find rooms, apartments, houses & PGs across Mumbai, Pune, Thane, Nagpur, Nashik, Kolhapur, Aurangabad, and 100+ cities in Maharashtra.",
  keywords: ["rental properties", "Maharashtra", "Mumbai", "Pune", "Nagpur", "Nashik", "Kolhapur", "Aurangabad", "rooms for rent", "apartment", "no brokerage", "rent house", "PG", "hostel"],
  openGraph: {
    title: "Rently — Find Your Perfect Rental in Maharashtra",
    description: "Zero brokerage rental platform with AI-powered property search",
    type: "website",
    locale: "en_IN",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rently",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        <LangProviderWrap>
          <AuthProviderWrap>
            <ClientLayout>{children}</ClientLayout>
          </AuthProviderWrap>
        </LangProviderWrap>
      </body>
    </html>
  );
}
