import { StateDataLoader } from '@/lib/data/state-loader'
import { SEOPriority } from '@/lib/types/location.types'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com'

  try {
    // Get all locations from the system
    const allLocations = await StateDataLoader.getAllProcessedLocations()

    console.log(`🗺️ Generating cities sitemap for ${allLocations.length} locations`)

    // Generate XML for city pages
    const urlEntries = allLocations.map((location) => {
      const priority = calculatePriority(location)
      const lastmod = new Date().toISOString()

      return `  <url>
    <loc>${baseUrl}/${location.stateSlug}/${location.citySlug}</loc>
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
    console.error('Error generating cities sitemap:', error)

    // Return minimal sitemap on error
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/california/los-angeles</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
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

