import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
// AuthProvider removed - not needed for production

const inter = Inter({ subsets: ["latin"] })

const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'
const ogImageUrl = `${baseUrl}/images/og-image.jpg`

export const metadata: Metadata = {
  title: "Personal Injury Lawyers | Nationwide Legal Help | Free Consultation",
  description:
    "Connect with top personal injury attorneys across the USA. No win, no fee. Get the settlement you deserve.",
  generator: 'Next.js',
  metadataBase: new URL(baseUrl), // Replace with your actual domain
  openGraph: {
    title: "Personal Injury Lawyers | Nationwide Legal Help | Free Consultation",
    description: "Connect with top personal injury attorneys across the USA. No win, no fee. Get the settlement you deserve.",
    url: 'https://personalinjury.lawproactive.com',
    siteName: 'LawProactive',
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        type: 'image/jpeg',
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
    images: [ogImageUrl],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
