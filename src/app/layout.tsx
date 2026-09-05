import type { Metadata, Viewport } from "next";
import "./globals.css";
import LangProviderWrap from "@/components/LangProviderWrap";
import AuthProviderWrap from "@/components/AuthProviderWrap";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b1437",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Rently — Find Your Perfect Rental in Maharashtra",
  description: "Zero brokerage rental platform with AI-powered search. Find rooms, apartments, houses & PGs across Mumbai, Pune, Thane, Nagpur & Nashik.",
  keywords: ["rental properties", "Maharashtra", "Mumbai", "Pune", "rooms for rent", "apartment", "no brokerage", "rent house"],
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
      </head>
      <body>
        <LangProviderWrap><AuthProviderWrap>{children}</AuthProviderWrap></LangProviderWrap>
      </body>
    </html>
  );
}
