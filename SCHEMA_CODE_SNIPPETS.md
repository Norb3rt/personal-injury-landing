# Schema.org Code Snippets - Ready for Production
**Personal Injury Landing Page - LawProactive**  
**Version:** 1.0  
**Date:** January 2025

---

## Table of Contents

1. [FAQPage Schema](#1-faqpage-schema)
2. [BreadcrumbList Schema](#2-breadcrumblist-schema)
3. [Enhanced LocalBusiness Schema](#3-enhanced-localbusiness-schema)
4. [WebSite Schema](#4-website-schema)
5. [Practice Area Schema](#5-practice-area-schema)
6. [Utility Functions](#6-utility-functions)
7. [Environment Variables](#7-environment-variables)

---

## 1. FAQPage Schema

### 1.1 Utility Function (Add to `lib/seo.ts`)

```typescript
/**
 * Generate FAQPage structured data
 * @param faqItems - Array of FAQ question/answer pairs
 * @param baseUrl - Base URL of the website
 * @param pageUrl - Full URL of the current page
 */
export function generateFAQPageSchema(
  faqItems: Array<{ question: string; answer: string }>,
  baseUrl: string,
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faqpage`,
    "mainEntity": faqItems.map((item, index) => ({
      "@type": "Question",
      "@id": `${pageUrl}#faq-${index}`,
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }
}
```

### 1.2 Implementation in City Page (`app/[state]/[city]/page.tsx`)

**Add after existing structured data (around line 167):**

```typescript
{/* FAQPage Structured Data */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      generateFAQPageSchema(
        faqItems,
        baseUrl,
        `${baseUrl}/${params.state}/${params.city}`
      )
    ),
  }}
/>
```

### 1.3 Implementation in Practice Page (`app/[state]/[city]/[practice]/page.tsx`)

**Add in the component (around line 115):**

```typescript
const faqSchema = generateFAQPageSchema(
  practiceArea.faqItems,
  baseUrl,
  `${baseUrl}/${params.state}/${params.city}/${params.practice}`
)

// Then in JSX (add after opening <div>):
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(faqSchema),
  }}
/>
```

---

## 2. BreadcrumbList Schema

### 2.1 Utility Function (Add to `lib/seo.ts`)

```typescript
/**
 * Generate BreadcrumbList structured data
 * @param items - Array of breadcrumb items with name and URL
 * @param baseUrl - Base URL of the website
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  }
}
```

### 2.2 Implementation in Practice Page

**Add in the component:**

```typescript
const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: state, url: `/${params.state}` },
  { name: city, url: `/${params.state}/${params.city}` },
  { name: practiceArea.name, url: `/${params.state}/${params.city}/${params.practice}` }
]

const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, baseUrl)

// Then in JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(breadcrumbSchema),
  }}
/>
```

---

## 3. Enhanced LocalBusiness Schema

### 3.1 Updated Function (Replace in `lib/seo.ts`)

```typescript
/**
 * Generate enhanced LocalBusiness/LegalService structured data
 * Includes complete address, hours, payment methods, and real contact info
 */
export function generateLocalBusinessStructuredData(
  citySlug: string, 
  baseUrl: string = 'https://personalinjury.lawproactive.com'
) {
  const cityData = CALIFORNIA_CITIES[citySlug]
  const cityName = cityData?.name || citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ")
  const coordinates = cityData?.coordinates || { lat: 34.0522, lng: -118.2437 }

  // Get real business data from environment variables
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "LawProactive"
  const addressStreet = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_STREET
  const addressCity = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_CITY
  const addressState = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_STATE
  const addressZip = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_ZIP
  
  // Only include aggregateRating if we have real review data
  const hasRealReviews = process.env.NEXT_PUBLIC_AGGREGATE_RATING && 
                         process.env.NEXT_PUBLIC_REVIEW_COUNT
  
  const legalServiceSchema: any = {
    "@type": "LegalService",
    "@id": `${baseUrl}/${citySlug}#legalservice`,
    "name": `Personal Injury Lawyers in ${cityName}`,
    "description": `Top-rated personal injury attorneys serving ${cityName}, California. Free consultation, no win no fee.`,
    "url": `${baseUrl}/${citySlug}`,
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
    }
  }

  // Add phone number if available
  if (phoneNumber) {
    legalServiceSchema.telephone = phoneNumber
  }

  // Add physical address if available
  if (addressStreet && addressCity && addressState && addressZip) {
    legalServiceSchema.address = {
      "@type": "PostalAddress",
      "streetAddress": addressStreet,
      "addressLocality": addressCity,
      "addressRegion": addressState,
      "postalCode": addressZip,
      "addressCountry": "US"
    }
  }

  // Add opening hours if available
  if (process.env.NEXT_PUBLIC_BUSINESS_HOURS) {
    legalServiceSchema.openingHoursSpecification = [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    ]
  }

  // Only add aggregateRating if we have real review data
  if (hasRealReviews) {
    legalServiceSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": process.env.NEXT_PUBLIC_AGGREGATE_RATING,
      "reviewCount": process.env.NEXT_PUBLIC_REVIEW_COUNT,
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      legalServiceSchema,
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
        "name": companyName,
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": "600",
          "height": "60"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": phoneNumber,
          "contactType": "customer service",
          "availableLanguage": ["English", "Spanish"],
          "areaServed": "US"
        }
      }
    ]
  }
}
```

---

## 4. WebSite Schema

### 4.1 Utility Function (Add to `lib/seo.ts`)

```typescript
/**
 * Generate WebSite structured data for root layout
 * Enables sitelinks search box in Google
 */
export function generateWebSiteSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    "url": baseUrl,
    "name": "LawProactive Personal Injury Lawyers",
    "description": "Connect with top personal injury attorneys across the United States. Free consultation, no win no fee.",
    "publisher": {
      "@id": `${baseUrl}#organization`
    },
    "inLanguage": "en-US"
  }
}
```

### 4.2 Implementation in Root Layout (`app/layout.tsx`)

**Add in the <head> section (after line 63):**

```typescript
import { generateWebSiteSchema } from "@/lib/seo"

// In the component:
const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'
const websiteSchema = generateWebSiteSchema(baseUrl)

// In JSX (inside <head>):
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(websiteSchema),
  }}
/>
```

---

## 5. Practice Area Schema

### 5.1 Utility Function (Add to `lib/seo.ts`)

```typescript
/**
 * Generate practice area specific LegalService schema
 */
export function generatePracticeAreaSchema(
  practiceArea: { name: string; description: string; keywords: string[] },
  city: string,
  state: string,
  baseUrl: string,
  pageUrl: string
) {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${pageUrl}#legalservice`,
    "name": `${practiceArea.name} Lawyer in ${city}, ${state}`,
    "description": practiceArea.description,
    "url": pageUrl,
    "serviceType": practiceArea.name,
    "areaServed": {
      "@type": "City",
      "name": city,
      "addressRegion": state,
      "addressCountry": "US"
    },
    "provider": {
      "@id": `${baseUrl}#organization`
    },
    "priceRange": "Free Consultation",
    ...(phoneNumber && { telephone: phoneNumber })
  }
}
```

---

## 6. Utility Functions

### 6.1 Schema Validation Helper

```typescript
/**
 * Validate that required environment variables are set
 * Call this in development to catch missing config early
 */
export function validateSchemaEnvironment(): void {
  const required = [
    'NEXT_PUBLIC_PHONE_NUMBER',
    'NEXT_PUBLIC_COMPANY_NAME'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(
      `⚠️ Missing schema environment variables: ${missing.join(', ')}\n` +
      `Some structured data fields will use fallback values.`
    )
  }
}
```

---

## 7. Environment Variables

### 7.1 Add to `.env.local`

```bash
# ============================================
# STRUCTURED DATA CONFIGURATION
# ============================================

# Required: Real contact information
NEXT_PUBLIC_PHONE_NUMBER="+1-XXX-XXX-XXXX"
NEXT_PUBLIC_COMPANY_NAME="LawProactive"

# Required: Physical business address
NEXT_PUBLIC_BUSINESS_ADDRESS_STREET="123 Main Street, Suite 100"
NEXT_PUBLIC_BUSINESS_ADDRESS_CITY="Los Angeles"
NEXT_PUBLIC_BUSINESS_ADDRESS_STATE="CA"
NEXT_PUBLIC_BUSINESS_ADDRESS_ZIP="90001"

# Optional: Business hours
NEXT_PUBLIC_BUSINESS_HOURS="Mon-Fri 9AM-5PM"

# Optional: Real review data (only if you have verified reviews)
# NEXT_PUBLIC_AGGREGATE_RATING="4.8"
# NEXT_PUBLIC_REVIEW_COUNT="247"

# Optional: Social media profiles
NEXT_PUBLIC_FACEBOOK_URL="https://www.facebook.com/lawproactive"
NEXT_PUBLIC_LINKEDIN_URL="https://www.linkedin.com/company/lawproactive"
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/lawproactive"

# Domain configuration
NEXT_PUBLIC_DOMAIN="https://personalinjury.lawproactive.com"
```

---

## Usage Examples

### Example 1: City Page with All Schemas

```typescript
// app/[state]/[city]/page.tsx

import { 
  generateLocalBusinessStructuredData,
  generateFAQPageSchema 
} from "@/lib/seo"

export default async function CityPage({ params }: PageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'
  const pageUrl = `${baseUrl}/${params.state}/${params.city}`
  
  const businessSchema = generateLocalBusinessStructuredData(params.city, baseUrl)
  const faqSchema = generateFAQPageSchema(faqItems, baseUrl, pageUrl)

  return (
    <div>
      {/* LocalBusiness + Organization + WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      
      {/* FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Rest of page content */}
    </div>
  )
}
```

---

**Document Status:** ✅ READY FOR IMPLEMENTATION  
**Next Steps:** Review, test in staging, deploy incrementally

