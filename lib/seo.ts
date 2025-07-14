// SEO utilities for programmatic SEO optimization

import { Metadata } from 'next'
import { getCityData as getFullCityData, findCityByOriginalSlug } from './california-cities'

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
export function generateCityMetadata(citySlug: string, baseUrl: string = 'https://your-domain.com'): Metadata {
  // Try new structure first (california-city)
  let cityData = getFullCityData(citySlug)

  // If not found, try old structure (city only) for backward compatibility
  if (!cityData) {
    const oldCityData = CALIFORNIA_CITIES[citySlug]
    if (oldCityData) {
      // Convert old format to new format for compatibility
      cityData = {
        ...oldCityData,
        originalSlug: citySlug,
        objectId: 0
      }
    }
  }

  // If still not found, try to find by original slug
  if (!cityData) {
    cityData = findCityByOriginalSlug(citySlug)
  }

  if (!cityData) {
    // Fallback for cities not in our database
    const cityName = citySlug.includes('california-')
      ? citySlug.replace('california-', '').charAt(0).toUpperCase() + citySlug.replace('california-', '').slice(1).replace(/-/g, " ")
      : citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ")
    return generateFallbackMetadata(cityName, citySlug, baseUrl)
  }

  const { name, coordinates, keywords, localKeywords } = cityData
  
  return {
    title: `Personal Injury Lawyer in ${name}, CA | Free Consultation | No Win No Fee`,
    description: `Injured in ${name}? Get the settlement you deserve. Connect with top-rated personal injury attorneys in ${name}, California. Free case evaluation. No win, no fee guarantee.`,
    keywords: [...keywords, ...localKeywords, `${name} personal injury`, `${name} accident lawyer`].join(', '),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${citySlug}`,
    },
    openGraph: {
      title: `Personal Injury Lawyer in ${name}, CA | Free Consultation`,
      description: `Injured in ${name}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
      url: `${baseUrl}/${citySlug}`,
      siteName: 'LawProactive',
      images: [
        {
          url: `/og-images/${citySlug}.jpg`,
          width: 1200,
          height: 630,
          alt: `Personal Injury Lawyer in ${name}, California`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Personal Injury Lawyer in ${name}, CA | Free Consultation`,
      description: `Injured in ${name}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
      images: [`/og-images/${citySlug}.jpg`],
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
    other: {
      'geo.region': 'US-CA',
      'geo.placename': name,
      'geo.position': `${coordinates.lat};${coordinates.lng}`,
    },
  }
}

// Fallback metadata for cities not in our database
function generateFallbackMetadata(cityName: string, citySlug: string, baseUrl: string): Metadata {
  return {
    title: `Personal Injury Lawyer in ${cityName}, CA | Free Consultation`,
    description: `Injured in ${cityName}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
    keywords: `personal injury lawyer ${cityName}, accident attorney ${cityName}, car accident lawyer ${cityName}`,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${citySlug}`,
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
export function generateLocalBusinessStructuredData(citySlug: string, baseUrl: string = 'https://your-domain.com') {
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

// Get all city slugs for static generation (both old and new format)
export function getAllCitySlugs(): string[] {
  const oldSlugs = Object.keys(CALIFORNIA_CITIES)
  const newSlugs = Object.keys(require('./california-cities').CALIFORNIA_CITIES_FULL)

  // Combine both for backward compatibility and new structure
  return [...oldSlugs, ...newSlugs]
}

// Validate if a city slug exists
export function isValidCitySlug(slug: string): boolean {
  return slug in CALIFORNIA_CITIES
}
