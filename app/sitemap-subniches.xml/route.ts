import { StateDataLoader } from '@/lib/data/state-loader'
import { getAllPracticeAreaSlugs } from '@/lib/data/practice-areas-config'
import { SEOPriority } from '@/lib/types/location.types'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'

  try {
    // Get all locations and practice areas
    const allLocations = await StateDataLoader.getAllProcessedLocations()
    const practiceAreaSlugs = getAllPracticeAreaSlugs()

    // Generate all combinations
    const combinations = allLocations.flatMap((location) =>
      practiceAreaSlugs.map((practiceSlug) => ({
        stateSlug: location.stateSlug,
        citySlug: location.citySlug,
        practiceSlug,
        population: location.population,
      }))
    )

    console.log(`🗺️ Generating subniches sitemap for ${combinations.length} pages`)

    // Generate XML for subniche pages
    const urlEntries = combinations.map((combo) => {
      const priority = calculateSubnichePriority(combo)
      const lastmod = new Date().toISOString()

      return `  <url>
    <loc>${baseUrl}/${combo.stateSlug}/${combo.citySlug}/${combo.practiceSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating subniches sitemap:', error)

    // Return minimal sitemap on error
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/california/los-angeles/car-accident</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}

// Helper function to calculate priority for subniche pages
function calculateSubnichePriority(combo: any): number {
  // Major cities get higher priority
  const majorCities = [
    'los-angeles', 'san-francisco', 'san-diego', 'sacramento', 'san-jose',
    'houston', 'dallas', 'austin', 'san-antonio', 'fort-worth',
    'miami', 'tampa', 'orlando', 'jacksonville',
    'new-york-city', 'buffalo', 'rochester'
  ]

  // High-demand practice areas
  const highDemandPractices = ['car-accident', 'slip-and-fall', 'medical-malpractice']

  let priority = SEOPriority.LOW

  // Boost priority for major cities
  if (majorCities.includes(combo.citySlug)) {
    priority = SEOPriority.MEDIUM
  }

  // Further boost for high-demand practice areas in major cities
  if (majorCities.includes(combo.citySlug) && highDemandPractices.includes(combo.practiceSlug)) {
    priority = SEOPriority.HIGH - 0.1 // Slightly lower than city pages
  }

  // Boost for large cities (population > 100k)
  if (combo.population && combo.population > 100000) {
    priority = Math.min(priority + 0.1, SEOPriority.HIGH - 0.1)
  }

  return priority
}

