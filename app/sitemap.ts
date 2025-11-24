import { MetadataRoute } from 'next'
import { StateDataLoader } from '@/lib/data/state-loader'
import { SEOPriority } from '@/lib/types/location.types'

export const revalidate = 86400 // Revalidate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  try {
    // Get all locations from new system
    const allLocations = await StateDataLoader.getAllProcessedLocations()

    console.log(`🗺️ Generating sitemap for ${allLocations.length} locations across multiple states`)

    // Generate sitemap entries for new [state]/[city] structure with personal-injury-lawyer prefix
    const newStatePages = allLocations.map((location) => ({
      url: `${baseUrl}/personal-injury-lawyer/${location.stateSlug}/${location.citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: calculatePriority(location),
    }))

    return [...staticPages, ...newStatePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}

// Helper function to calculate priority based on location data
function calculatePriority(location: any): number {
  // Major cities get higher priority
  const majorCities = [
    'los-angeles', 'san-francisco', 'san-diego', 'sacramento', 'san-jose',
    'houston', 'dallas', 'austin', 'san-antonio', 'fort-worth',
    'miami', 'tampa', 'orlando', 'jacksonville',
    'new-york-city', 'buffalo', 'rochester'
  ]

  if (majorCities.includes(location.citySlug)) {
    return SEOPriority.HIGH
  }

  // State capitals and large cities
  if (location.population && location.population > 100000) {
    return SEOPriority.MEDIUM
  }

  // Default priority for smaller cities
  return SEOPriority.LOW
}