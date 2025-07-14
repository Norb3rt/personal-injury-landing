import { MetadataRoute } from 'next'
import { getAllCitySlugs } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://your-domain.com'

  // Get cities from SEO utility and add additional cities
  const mainCities = getAllCitySlugs()
  const additionalCities = [
    "riverside",
    "san-bernardino",
    "ventura",
    "santa-barbara",
    "kern",
    "imperial",
    "fresno",
    "san-jose",
    "oakland",
    "bakersfield",
    "anaheim",
    "santa-ana",
    "stockton",
    "fremont",
    "irvine",
    "chula-vista",
    "modesto",
    "oxnard",
    "fontana",
    "moreno-valley",
    "huntington-beach",
    "glendale",
    "santa-clarita",
    "garden-grove",
    "oceanside",
    "rancho-cucamonga",
    "santa-rosa",
    "ontario",
    "lancaster",
    "elk-grove",
    "palmdale",
    "corona",
    "salinas",
    "pomona",
    "hayward",
    "escondido",
    "torrance",
    "sunnyvale",
    "orange",
    "fullerton",
    "pasadena",
    "thousand-oaks",
    "visalia",
    "simi-valley",
    "concord"
  ]

  const cities = [...mainCities, ...additionalCities]

  // Generate sitemap entries for all city pages
  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

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

  return [...staticPages, ...cityPages]
}
