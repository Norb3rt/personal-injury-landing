// SEO utilities for programmatic SEO optimization
// Updated to support new multi-state architecture with legacy compatibility

import { Metadata } from 'next'
// Removed dependency on california-cities.ts - using static data instead

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

// California cities with coordinates for geo-targeting
export const CALIFORNIA_CITIES: Record<string, CityMetadata> = {
  'los-angeles': {
    name: 'Los Angeles',
    slug: 'los-angeles',
    state: 'CA',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    population: 3898747,
    keywords: ['personal injury lawyer', 'car accident attorney', 'slip and fall lawyer'],
    localKeywords: ['Hollywood accident lawyer', 'Beverly Hills injury attorney', 'Santa Monica personal injury']
  },
  'orange-county': {
    name: 'Orange County',
    slug: 'orange-county',
    state: 'CA',
    coordinates: { lat: 33.7175, lng: -117.8311 },
    population: 3175692,
    keywords: ['personal injury lawyer', 'accident attorney', 'medical malpractice lawyer'],
    localKeywords: ['Anaheim injury lawyer', 'Irvine accident attorney', 'Newport Beach personal injury']
  },
  'san-diego': {
    name: 'San Diego',
    slug: 'san-diego',
    state: 'CA',
    coordinates: { lat: 32.7157, lng: -117.1611 },
    population: 1386932,
    keywords: ['personal injury attorney', 'car crash lawyer', 'workplace injury attorney'],
    localKeywords: ['La Jolla injury lawyer', 'Coronado accident attorney', 'Chula Vista personal injury']
  },
  'san-francisco': {
    name: 'San Francisco',
    slug: 'san-francisco',
    state: 'CA',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    population: 873965,
    keywords: ['personal injury lawyer', 'bicycle accident attorney', 'pedestrian injury lawyer'],
    localKeywords: ['SOMA injury lawyer', 'Mission District accident attorney', 'Financial District personal injury']
  },
  'sacramento': {
    name: 'Sacramento',
    slug: 'sacramento',
    state: 'CA',
    coordinates: { lat: 38.5816, lng: -121.4944 },
    population: 524943,
    keywords: ['personal injury attorney', 'truck accident lawyer', 'workers compensation attorney'],
    localKeywords: ['Midtown Sacramento injury lawyer', 'East Sacramento accident attorney']
  }
}

// Generate comprehensive metadata for city pages
export function generateCityMetadata(citySlug: string, baseUrl: string = 'https://personalinjury.lawproactive.com'): Metadata {
  // Simplified implementation - convert slug to city name
  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ")

  // Check if we have legacy data
  const oldCityData = CALIFORNIA_CITIES[citySlug]
  if (oldCityData) {
    const { name, coordinates, keywords, localKeywords } = oldCityData

    return {
      title: `Personal Injury Lawyer in ${name}, CA | Free Consultation | No Win No Fee`,
      description: `Injured in ${name}? Get the settlement you deserve. Connect with top-rated personal injury attorneys in ${name}, California. Free case evaluation. No win, no fee guarantee.`,
      keywords: [...keywords, ...localKeywords, `${name} personal injury`, `${name} accident lawyer`].join(', '),
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: `${baseUrl}/${citySlug}`,
      },
      openGraph: {
        title: `${name} Personal Injury Lawyer | Free Consultation`,
        description: `Injured in ${name}, CA? Get maximum compensation with our experienced personal injury attorneys. No win, no fee.`,
        url: `${baseUrl}/${citySlug}`,
        siteName: 'Personal Injury Lawyers',
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} Personal Injury Lawyer | Free Consultation`,
        description: `Injured in ${name}, CA? Get maximum compensation with our experienced personal injury attorneys. No win, no fee.`,
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

  // Fallback for cities not in our database
  return generateFallbackMetadata(cityName, citySlug, baseUrl)
}

// Fallback metadata for cities not in our database
function generateFallbackMetadata(cityName: string, citySlug: string, baseUrl: string): Metadata {
  return {
    title: `Personal Injury Lawyer in ${cityName}, CA | Free Consultation`,
    description: `Injured in ${cityName}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
    keywords: `personal injury lawyer ${cityName}, accident attorney ${cityName}, car accident lawyer ${cityName}`,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${citySlug}`,
    },
    openGraph: {
      title: `Personal Injury Lawyer in ${cityName}, CA | Free Consultation`,
      description: `Injured in ${cityName}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
      url: `${baseUrl}/${citySlug}`,
      siteName: 'LawProactive',
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// Generate structured data for local business
export function generateLocalBusinessStructuredData(citySlug: string, baseUrl: string = 'https://personalinjury.lawproactive.com') {
  const cityData = CALIFORNIA_CITIES[citySlug]
  const cityName = cityData?.name || citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ")
  const coordinates = cityData?.coordinates || { lat: 34.0522, lng: -118.2437 }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${baseUrl}/${citySlug}#legalservice`,
        "name": `Personal Injury Lawyers in ${cityName}`,
        "description": `Top-rated personal injury attorneys serving ${cityName}, California. Free consultation, no win no fee.`,
        "url": `${baseUrl}/${citySlug}`,
        "telephone": process.env.NEXT_PUBLIC_PHONE_NUMBER || "+1-800-123-4567",
        "priceRange": "Free Consultation",
        "areaServed": {
          "@type": "City",
          "name": cityName,
          "addressRegion": "CA",
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
                "description": "No-obligation case evaluation"
              },
              "price": "0",
              "priceCurrency": "USD"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "150",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/${citySlug}#webpage`,
        "url": `${baseUrl}/${citySlug}`,
        "name": `Personal Injury Lawyer in ${cityName}, CA | Free Consultation`,
        "description": `Injured in ${cityName}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${baseUrl}#website`
        },
        "about": {
          "@id": `${baseUrl}/${citySlug}#legalservice`
        },
        "mainEntity": {
          "@id": `${baseUrl}/${citySlug}#legalservice`
        }
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        "name": process.env.NEXT_PUBLIC_COMPANY_NAME || "LawProactive",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": process.env.NEXT_PUBLIC_PHONE_NUMBER || "+1-800-123-4567",
          "contactType": "customer service",
          "availableLanguage": ["English", "Spanish"]
        }
      }
    ]
  }
}

// Get all city slugs for static generation - DEPRECATED
// These functions are no longer needed as we use the new [state]/[city] structure
// Keeping for backward compatibility but they should not be used in new code
export async function getAllCitySlugsList(): Promise<string[]> {
  console.warn('getAllCitySlugsList is deprecated. Use StateDataLoader.getAllProcessedLocations() instead.')
  const oldSlugs = Object.keys(CALIFORNIA_CITIES)
  return oldSlugs
}

// Synchronous version for backward compatibility - DEPRECATED
export function getAllCitySlugs(): string[] {
  console.warn('getAllCitySlugs is deprecated. Use StateDataLoader.getAllProcessedLocations() instead.')
  const oldSlugs = Object.keys(CALIFORNIA_CITIES)
  return oldSlugs
}

// Enhanced city metadata generation using legacy system
export async function generateCityMetadataEnhanced(citySlug: string, baseUrl: string): Promise<Metadata> {
  return generateCityMetadataLegacy(citySlug, baseUrl);
}

// Legacy metadata generation (kept for fallback)
function generateCityMetadataLegacy(citySlug: string, baseUrl: string): Metadata {
  const cityData = CALIFORNIA_CITIES[citySlug]
  const cityName = cityData?.name || citySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return {
    title: `${cityName} Personal Injury Lawyer | California Accident Attorney`,
    description: `Injured in ${cityName}, California? Get the settlement you deserve. Connect with top personal injury attorneys in ${cityName}. No win, no fee. Free consultation.`,
    keywords: `${cityName} personal injury lawyer, ${cityName} accident attorney, ${cityName} car accident lawyer, ${cityName} slip and fall attorney`,
    openGraph: {
      title: `${cityName} Personal Injury Lawyer | Free Consultation`,
      description: `Injured in ${cityName}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
      url: `${baseUrl}/${citySlug}`,
      siteName: 'Personal Injury Lawyers',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cityName} Personal Injury Lawyer | Free Consultation`,
      description: `Injured in ${cityName}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
    },
    alternates: {
      canonical: `${baseUrl}/${citySlug}`,
    },
  }
}

// Validate if a city slug exists
export async function isValidCitySlug(slug: string): Promise<boolean> {
  return slug in CALIFORNIA_CITIES;
}
