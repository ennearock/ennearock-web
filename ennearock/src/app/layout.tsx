import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ennearock.com"),
  title: {
    default: "Ennearock — Digital products that pull their weight",
    template: "%s — Ennearock",
  },
  description: "An independent digital product studio for strategy, design, web development, and launch-ready website templates.",
  keywords: ["web development", "product design", "SaaS templates", "digital studio", "Next.js"],
  openGraph: {
    title: "Ennearock — Digital products that pull their weight",
    description: "Strategy, design, and engineering for ambitious digital teams.",
    siteName: "Ennearock",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ennearock — Digital product studio",
    description: "Strategy, design, and engineering for ambitious digital teams.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f0e8",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
