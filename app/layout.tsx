import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
// AuthProvider removed - not needed for production

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Injury Lawyers in California | Free Consultation",
  description:
    "Connect with top personal injury attorneys in California. No win, no fee. Get the settlement you deserve.",
  generator: 'Next.js',
  metadataBase: new URL('https://personalinjury.lawproactive.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Personal Injury Lawyers in California | Free Consultation",
    description: "Connect with top personal injury attorneys in California. No win, no fee. Get the settlement you deserve.",
    url: 'https://personalinjury.lawproactive.com',
    siteName: 'LawProactive',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'Personal Injury Lawyers in California',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Personal Injury Lawyers in California | Free Consultation",
    description: "Connect with top personal injury attorneys in California. No win, no fee. Get the settlement you deserve.",
    images: ['/og-image.jpg'],
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
    google: 'google-site-verification=e6epGc7CkvgzluPqZW1uXdg55I97gZVJKeg-TzdEilA', // Replace with actual verification code
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
      </body>
    </html>
  )
}
