// SEO utilities for programmatic SEO optimization
// Updated to support new multi-state architecture with legacy compatibility
// SAFETY: Removed aggregateRating to comply with Google's spam policies.
// Organization schema uses the verified contact phone number (Lead Gen / Digital-First model).

import { Metadata } from 'next'
import { buildAbsoluteCityUrl } from './url'
import { StateDataLoader } from '@/lib/data/state-loader'

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
            url: `${baseUrl}/images/logo.png`,
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
        images: [`${baseUrl}/images/logo.png`],
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

const BASE = "https://personalinjury.lawproactive.com".trim();

export const CONFIG = {
  org: {
    name: "LawProactive",
    legalName: "LawProactive, Inc.",
    url: BASE,
    logo: `${BASE}/images/logo.png`.trim(),
    phone: "+1-213-394-5867".trim(),
    email: "lawproactive@gmail.com".trim(),
    address: {
      street: "4001 Inglewood Avenue, Suite 233".trim(),
      city: "Redondo Beach".trim(),
      state: "CA".trim(),
      zip: "90278".trim(),
    },
    social: [
      "https://www.facebook.com/profile.php?id=100093908101031".trim(),
      "https://www.linkedin.com/company/lawproactive".trim(),
      "https://twitter.com/lawproactive".trim(),
    ],
  },

  practiceAreas: [
    "Car Accident",
    "Slip and Fall",
    "Medical Malpractice",
    "Workplace Injuries",
    "Product Liability",
    "Wrongful Death",
  ],
};

// -----------------------------------------------------
// ORGANIZATION SCHEMA
// -----------------------------------------------------
export function orgSchema() {
  const { org } = CONFIG;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#org`,
    name: org.name,
    legalName: org.legalName,
    url: org.url,
    logo: org.logo,
    telephone: org.phone,
    email: org.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address.street,
      addressLocality: org.address.city,
      addressRegion: org.address.state,
      postalCode: org.address.zip,
      addressCountry: "US",
    },
    sameAs: org.social,
  };
}

// -----------------------------------------------------
// WEBSITE SCHEMA
// -----------------------------------------------------
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: CONFIG.org.name,
    alternateName: ["Law Proactive", "LawProactive Personal Injury Lawyers"],
    publisher: { "@id": `${BASE}/#org` },
  };
}

// -----------------------------------------------------
// CITY PAGE SCHEMA (LegalService)
// -----------------------------------------------------
export function citySchema(city: string, state: string, stateCode: string, lat?: number, lng?: number) {
  const url = `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}`;

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${url}/#service`,
    name: `Personal Injury Lawyer ${city}, ${stateCode}`,
    url,
    description: `Connect with experienced personal injury lawyers in ${city}, ${stateCode}. Free consultation. We handle car accidents, slip and fall, medical malpractice, and more.`,
    telephone: CONFIG.org.phone,
    areaServed: {
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: state },
    },
    provider: { "@id": `${BASE}/#org` },
  };
}

// -----------------------------------------------------
// DATASET SCHEMA (Accident Stats)
// -----------------------------------------------------
export function datasetSchema(city: string, state: string, stateCode: string, data?: any) {
  const url = `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}`;

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}/#dataset`,
    name: `${city}, ${stateCode} Accident Statistics`,
    description: `Live accident data for ${city}, ${stateCode} including top accident locations, freeways, and injury types from government sources.`,
    url,
    isPartOf: { "@id": url },
    spatialCoverage: {
      "@type": "City",
      name: city,
    },
    distribution: {
      "@type": "DataDownload",
      contentUrl: url,
      encodingFormat: "HTML",
    },
    keywords: [
      `${city} accidents`,
      `${state} injury statistics`,
      "accident data",
    ],
  };
}

// -----------------------------------------------------
// PRACTICE AREA SUB-PAGE SCHEMA
// -----------------------------------------------------
export function serviceSchema(city: string, state: string, stateCode: string, practiceArea: string) {
  const url = `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}/${practiceArea
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${url}/#service`,
    name: `${practiceArea} Lawyer ${city}, ${stateCode}`,
    url,
    description: `${practiceArea} lawyer in ${city}, ${stateCode}. Free case review. No fee unless you win.`,
    telephone: CONFIG.org.phone,
    areaServed: {
      "@type": "City",
      name: city,
    },
    provider: { "@id": `${BASE}/#org` },
    isPartOf: {
      "@id": `${BASE}/personal-injury-lawyer/${state.toLowerCase()}/${city.toLowerCase()}/#service`,
    },
  };
}

// -----------------------------------------------------
// NEWS ARTICLE SCHEMA
// -----------------------------------------------------
export function newsArticleSchema(city: string, url: string, headline: string, description: string, datePublished: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    url,
    datePublished,
    isPartOf: {
      "@id": `${BASE}/personal-injury-lawyer/${city.toLowerCase()}/#service`,
    },
  };
}