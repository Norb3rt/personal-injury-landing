// SEO utilities for programmatic SEO optimization
// Updated to support new multi-state architecture with legacy compatibility
// SAFETY UPDATE 1: Removed aggregateRating to comply with Google's spam policies.
// SAFETY UPDATE 2: Removed telephone numbers entirely (Lead Gen / Digital-First model).

import { Metadata } from 'next'
import { buildAbsoluteCityUrl } from './url'
import { StateDataLoader } from '@/lib/data/state-loader'

export interface CityCoordinates {
  lat: number
  lng: number
}

export interface CityMetadata {
  name: string
  slug: string
  state: string
  coordinates: CityCoordinates
  population?: number
  keywords: string[]
  localKeywords: string[]
}

// Generate comprehensive metadata for city pages
export async function generateCityMetadata(
  citySlug: string,
  baseUrl: string = 'https://personalinjury.lawproactive.com',
  stateSlug: string = 'california'
): Promise<Metadata> {
  // Fetch real data from StateDataLoader
  const cityData = await StateDataLoader.findLocation(stateSlug, citySlug)

  const cityName = cityData?.city || citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ")
  const canonicalUrl = buildAbsoluteCityUrl(stateSlug, citySlug, undefined, baseUrl)

  if (cityData) {
    // Construct dynamic keywords based on available data
    const keywords = [
      `personal injury lawyer ${cityName}`,
      `accident attorney ${cityName}`,
      `${cityName} injury law firm`,
      ...(cityData.landmark ? [`lawyer near ${cityData.landmark}`] : [])
    ]

    return {
      title: `Personal Injury Lawyer in ${cityName}, ${cityData.state} | Free Consultation`,
      // Claim-Based Trust: Focus on "Maximum Compensation" in description
      description: `Injured in ${cityName}? Get the settlement you deserve. Connect with top-rated personal injury attorneys in ${cityName}, ${cityData.state}. Free case evaluation. No win, no fee.`,
      keywords: keywords.join(', '),
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${cityName} Personal Injury Lawyer | Free Consultation`,
        description: `Injured in ${cityName}, ${cityData.state}? Get maximum compensation with our experienced personal injury attorneys. No win, no fee.`,
        url: canonicalUrl,
        siteName: 'LawProactive',
        images: [
          {
            url: `${baseUrl}/images/logo-favicon.jpg`,
            width: 1200,
            height: 630,
            alt: `${cityName} Personal Injury Lawyer`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cityName} Personal Injury Lawyer | Free Consultation`,
        description: `Injured in ${cityName}, ${cityData.state}? Get maximum compensation with our experienced personal injury attorneys. No win, no fee.`,
        images: [`${baseUrl}/images/logo-favicon.jpg`],
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
    }
  }

  // Fallback for cities not found (shouldn't happen if sitemap is correct)
  return generateFallbackMetadata(cityName, citySlug, baseUrl, stateSlug)
}

// Fallback metadata for cities not in our database
function generateFallbackMetadata(cityName: string, citySlug: string, baseUrl: string, stateSlug: string = 'california'): Metadata {
  const canonicalUrl = buildAbsoluteCityUrl(stateSlug, citySlug, undefined, baseUrl)

  return {
    title: `Personal Injury Lawyer in ${cityName} | Free Consultation`,
    description: `Injured in ${cityName}? Get settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
    keywords: `personal injury lawyer ${cityName}, accident attorney ${cityName}, car accident lawyer ${cityName}`,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Personal Injury Lawyer in ${cityName} | Free Consultation`,
      description: `Injured in ${cityName}? Get settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
      url: canonicalUrl,
      siteName: 'No Win No Fee',
      images: [
        {
          url: `${baseUrl}/images/logo-favicon.jpg`,
          width: 1200,
          height: 630,
          alt: `${cityName} Personal Injury Lawyer`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Personal Injury Lawyer in ${cityName} | Free Consultation`,
      description: `Injured in ${cityName}? Get settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
      images: [`${baseUrl}/images/logo-favicon.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// Generate structured data for local business
export async function generateLocalBusinessStructuredData(
  citySlug: string,
  baseUrl: string = 'https://personalinjury.lawproactive.com',
  stateSlug: string = 'california'
) {
  const cityData = await StateDataLoader.findLocation(stateSlug, citySlug)
  const cityName = cityData?.city || citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ")
  const coordinates = cityData?.coordinates || { lat: 34.0522, lng: -118.2437 }
  const pageUrl = buildAbsoluteCityUrl(stateSlug, citySlug, undefined, baseUrl)
  const stateName = cityData?.state || 'California'

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${pageUrl}#legalservice`,
        "name": `Personal Injury Lawyers in ${cityName}`,
        // Claim-Based Trust: Description focuses on "Connect" and "Free Consultation"
        "description": `Connecting ${cityName} accident victims with top-rated attorneys. Secure maximum compensation through our network. Free evaluation, no obligation.`,
        "url": pageUrl,
        // REMOVED: Telephone (Digital-First Lead Gen Model)
        "priceRange": "Free Consultation",
        // "areaServed" with GeoCoordinates helps Google understand service region for multi-state/national lead gen
        "areaServed": {
          "@type": "City",
          "name": cityName,
          "addressRegion": stateName,
          "addressCountry": "US",
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": coordinates.lat,
            "longitude": coordinates.lng
          }
        },
        "serviceType": [
          "Personal Injury Law",
          "Car Accident Attorney",
          "Slip and Fall Lawyer",
          "Medical Malpractice Attorney",
          "Wrongful Death Lawyer",
          "Workplace Injury Attorney"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Legal Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Free Legal Consultation",
                "description": "No-obligation case evaluation via secure web form."
              },
              "price": "0",
              "priceCurrency": "USD"
            }
          ]
        }
        // REMOVED: aggregateRating (Policy Compliance)
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        "url": pageUrl,
        "name": `Personal Injury Lawyer in ${cityName}, ${stateName} | Free Consultation`,
        "description": `Injured in ${cityName}? Get settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${baseUrl}#website`
        },
        "about": {
          "@id": `${pageUrl}#legalservice`
        },
        "mainEntity": {
          "@id": `${pageUrl}#legalservice`
        }
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "LawProactive",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/images/logo-favicon.jpg`
        }
        // REMOVED: contactPoint (Depended on phone number)
        // REMOVED: telephone (Digital-First Model)
      }
    ]
  }
}

// Validate if a city slug exists
export async function isValidCitySlug(stateSlug: string, citySlug: string): Promise<boolean> {
  const location = await StateDataLoader.findLocation(stateSlug, citySlug)
  return !!location
}