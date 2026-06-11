import { StateDataLoader } from '@/lib/data/state-loader'
import { SEOPriority } from '@/lib/types/location.types'

export const revalidate = 86400 // Revalidate daily

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com').replace(/\/$/, '')

  try {
    const allLocations = await StateDataLoader.getAllProcessedLocations()
    console.log(`🗺️ Generating locations route handler sitemap for ${allLocations.length} locations`)

    const urlEntries = allLocations.map((location) => {
      const priority = calculatePriority(location)
      const lastmod = new Date().toISOString()

      return `  <url>
    <loc>${baseUrl}/personal-injury-lawyer/${location.stateSlug}/${location.citySlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    console.error('Error generating locations sitemap:', error)
    return new Response('Error generating locations sitemap', { status: 500 })
  }
}

function calculatePriority(location: any): number {
  const majorCities = [
    'los-angeles', 'san-francisco', 'san-diego', 'sacramento', 'san-jose',
    'houston', 'dallas', 'austin', 'san-antonio', 'fort-worth',
    'miami', 'tampa', 'orlando', 'jacksonville',
    'new-york-city', 'buffalo', 'rochester'
  ]

  if (majorCities.includes(location.citySlug)) {
    return SEOPriority.HIGH
  }

  if (location.population && location.population > 100000) {
    return SEOPriority.MEDIUM
  }

  return SEOPriority.LOW
}
