import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
// AuthProvider removed - not needed for production

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Injury Lawyers | Nationwide Legal Help | Free Consultation",
  description:
    "Connect with top personal injury attorneys across the USA. No win, no fee. Get the settlement you deserve.",
  generator: 'Next.js',
  metadataBase: new URL('https://personalinjury.lawproactive.com'), // Replace with your actual domain
  openGraph: {
    title: "Personal Injury Lawyers | Nationwide Legal Help | Free Consultation",
    description: "Connect with top personal injury attorneys across the USA. No win, no fee. Get the settlement you deserve.",
    url: 'https://personalinjury.lawproactive.com',
    siteName: 'LawProactive',
    images: [
      {
        url: '/images/logo-favicon.jpg',
        width: 1200,
        height: 630,
        alt: 'Nationwide Personal Injury Lawyers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Personal Injury Lawyers | Nationwide Legal Help | Free Consultation",
    description: "Connect with top personal injury attorneys across the USA. No win, no fee. Get the settlement you deserve.",
    images: ['/images/logo-favicon.jpg'],
  },
  icons: {
    icon: '/images/logo-favicon.jpg',
    shortcut: '/images/logo-favicon.jpg',
    apple: '/images/logo-favicon.jpg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/images/logo-favicon.jpg',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'G4TV4D54c2EkINqD9zJ84j5OzRJAfuuyLK7Fhflhbwg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
