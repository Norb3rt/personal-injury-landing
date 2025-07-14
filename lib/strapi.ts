// Strapi Cloud API integration for programmatic SEO content

const STRAPI_API_URL = process.env.STRAPI_API_URL || 'https://your-strapi-instance.strapiapp.com/api'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface CityData {
  id: number
  attributes: {
    name: string
    slug: string
    state: string
    population: number
    coordinates: {
      lat: number
      lng: number
    }
    seoTitle: string
    seoDescription: string
    seoKeywords: string[]
    localKeywords: string[]
    practiceAreas: string[]
    testimonials: Array<{
      name: string
      rating: number
      review: string
      caseType: string
    }>
    localStats: {
      averageSettlement: string
      casesWon: number
      yearsExperience: number
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface PracticeArea {
  id: number
  attributes: {
    name: string
    slug: string
    description: string
    icon: string
    seoTitle: string
    seoDescription: string
    keywords: string[]
    averageSettlement: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

// Fetch city-specific SEO data from Strapi
export async function getCityData(citySlug: string): Promise<CityData | null> {
  // Disable Strapi during build to prevent deployment errors
  if (process.env.NODE_ENV === 'production' && !STRAPI_API_TOKEN) {
    console.log('Strapi disabled in production build - using fallback data')
    return null
  }

  try {
    const response = await fetch(
      `${STRAPI_API_URL}/cities?filters[slug][$eq]=${citySlug}&populate=*`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch city data: ${response.statusText}`)
    }

    const data: StrapiResponse<CityData[]> = await response.json()
    return data.data[0] || null
  } catch (error) {
    console.error('Error fetching city data from Strapi:', error)
    return null
  }
}

// Fetch all cities for sitemap generation
export async function getAllCities(): Promise<CityData[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/cities?pagination[pageSize]=100&sort=name:asc`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 86400 }, // Revalidate daily
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`)
    }

    const data: StrapiResponse<CityData[]> = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching cities from Strapi:', error)
    return []
  }
}

// Fetch practice areas
export async function getPracticeAreas(): Promise<PracticeArea[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/practice-areas?sort=name:asc`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 86400 }, // Revalidate daily
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch practice areas: ${response.statusText}`)
    }

    const data: StrapiResponse<PracticeArea[]> = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching practice areas from Strapi:', error)
    return []
  }
}

// Submit lead to Strapi
export async function submitLeadToStrapi(leadData: any) {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/leads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...leadData,
            submittedAt: new Date().toISOString(),
            status: 'new',
          }
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to submit lead: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting lead to Strapi:', error)
    throw error
  }
}

// Generate dynamic metadata using Strapi data
export async function generateCityMetadata(citySlug: string) {
  const cityData = await getCityData(citySlug)
  
  if (!cityData) {
    // Fallback to static metadata if Strapi data is not available
    const city = citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " ")
    return {
      title: `Personal Injury Lawyer in ${city}, CA | Free Consultation`,
      description: `Injured in ${city}? Get the settlement you deserve. Connect with top personal injury attorneys. No win, no fee.`,
      keywords: `personal injury lawyer ${city}, accident attorney ${city}, car accident lawyer ${city}`,
    }
  }

  const { attributes } = cityData
  return {
    title: attributes.seoTitle,
    description: attributes.seoDescription,
    keywords: attributes.seoKeywords.join(', '),
    localKeywords: attributes.localKeywords,
    coordinates: attributes.coordinates,
    practiceAreas: attributes.practiceAreas,
    testimonials: attributes.testimonials,
    localStats: attributes.localStats,
  }
}

// Utility function to check if Strapi is available
export async function checkStrapiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${STRAPI_API_URL}/cities?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    return response.ok
  } catch (error) {
    console.error('Strapi connection check failed:', error)
    return false
  }
}
