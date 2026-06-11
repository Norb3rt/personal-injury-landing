import { StateDataLoader } from '@/lib/data/state-loader'
import { getAllPracticeAreaSlugs } from '@/lib/data/practice-areas-config'
import { SEOPriority } from '@/lib/types/location.types'

export const revalidate = 86400 // Revalidate daily

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_DOMAIN || 'https://personalinjury.lawproactive.com').replace(/\/$/, '')

  try {
    const allLocations = await StateDataLoader.getAllProcessedLocations()
    const practiceAreaSlugs = getAllPracticeAreaSlugs()

    const combinations = allLocations.flatMap((location) =>
      practiceAreaSlugs.map((practiceSlug) => ({
        stateSlug: location.stateSlug,
        citySlug: location.citySlug,
        practiceSlug,
        population: location.population,
      }))
    )

    console.log(`🗺️ Generating categories route handler sitemap for ${combinations.length} combinations`)

    const urlEntries = combinations.map((combo) => {
      const priority = calculateSubnichePriority(combo)
      const lastmod = new Date().toISOString()

      return `  <url>
    <loc>${baseUrl}/personal-injury-lawyer/${combo.stateSlug}/${combo.citySlug}/${combo.practiceSlug}</loc>
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
    console.error('Error generating categories sitemap:', error)
    return new Response('Error generating categories sitemap', { status: 500 })
  }
}

function calculateSubnichePriority(combo: any): number {
  const majorCities = [
    'los-angeles', 'san-francisco', 'san-diego', 'sacramento', 'san-jose',
    'houston', 'dallas', 'austin', 'san-antonio', 'fort-worth',
    'miami', 'tampa', 'orlando', 'jacksonville',
    'new-york-city', 'buffalo', 'rochester'
  ]

  const highDemandPractices = ['car-accident', 'slip-and-fall', 'medical-malpractice']

  let priority = SEOPriority.LOW

  if (majorCities.includes(combo.citySlug)) {
    priority = SEOPriority.MEDIUM
  }

  if (majorCities.includes(combo.citySlug) && highDemandPractices.includes(combo.practiceSlug)) {
    priority = SEOPriority.HIGH - 0.1 // 0.9
  }

  if (combo.population && combo.population > 100000) {
    priority = Math.min(priority + 0.1, SEOPriority.HIGH - 0.1)
  }

  return priority
}
