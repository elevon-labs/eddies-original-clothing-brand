import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
import { CartProvider } from "@/components/cart-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { auth } from "@/lib/auth"



export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://eddieoriginals-department.com"),
  title: {
    default: "Eddie Originals - Luxury Streetwear with Identity",
    template: "%s | Eddie Originals",
  },
  description:
    "Premium streetwear crafted with confidence, attitude, and purpose. Bold designs for those who stand out.",
  keywords: ["streetwear", "luxury fashion", "Ejigbo, Lagos Nigeria fashion", "premium clothing", "urban wear", "Nigerian streetwear"],
  authors: [{ name: "Eddie Originals" }],
  creator: "Eddie Originals",
  publisher: "Eddie Originals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    title: "Eddie Originals - Luxury Streetwear with Identity",
    description: "Premium streetwear crafted with confidence, attitude, and purpose. Bold designs for those who stand out.",
    siteName: "Eddie Originals",
    images: [
      {
        url: "/og-image.jpg", // We should ensure this exists or use a fallback
        width: 1200,
        height: 630,
        alt: "Eddie Originals - Luxury Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eddie Originals - Luxury Streetwear with Identity",
    description: "Premium streetwear crafted with confidence, attitude, and purpose. Bold designs for those who stand out.",
    images: ["/og-image.jpg"],
    creator: "@eddieoriginals", // Placeholder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <SessionProvider session={session}>
          <CartProvider>
            <LayoutWrapper header={<Header />} footer={<Footer />}>
              {children}
            </LayoutWrapper>
          </CartProvider>
          <Toaster />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
