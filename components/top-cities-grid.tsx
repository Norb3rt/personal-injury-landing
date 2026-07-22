import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/animations"

interface TopCity {
  name: string
  citySlug: string
  stateSlug: string
  stateName: string
  stateAbbreviation: string
}

interface TopCitiesGridProps {
  cities: TopCity[]
}

// Per-column animation durations (seconds) for a dynamic, non-uniform look.
// Alternating fast/slow creates the parallax feel of the testimonials-columns pattern.
const COLUMN_DURATIONS = ["35s", "45s", "30s", "50s"]

/**
 * Split a flat city list into N columns using round-robin distribution
 * so each column gets an even, visually-varied mix of cities.
 */
function splitIntoColumns(items: TopCity[], columnCount: number): TopCity[][] {
  const cols: TopCity[][] = Array.from({ length: columnCount }, () => [])
  items.forEach((city, index) => {
    cols[index % columnCount].push(city)
  })
  return cols
}

/**
 * A single vertical marquee column: a masked, overflow-hidden container
 * whose inner track scrolls up infinitely. Content is duplicated for a
 * seamless loop. Pure CSS animation (no JS) so links stay crawlable.
 */
function MarqueeColumn({
  columnCities,
  duration,
}: {
  columnCities: TopCity[]
  duration: string
}) {
  return (
    <div className="h-[500px] md:h-[600px] overflow-hidden marquee-mask marquee-pause-hover">
      <div
        className="animate-marquee-vertical flex flex-col gap-3"
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {/* Set 1 */}
        {columnCities.map((city, i) => (
          <CityCard key={`s1-${city.stateSlug}-${city.citySlug}-${i}`} city={city} />
        ))}
        {/* Set 2 (duplicated for seamless infinite loop) */}
        {columnCities.map((city, i) => (
          <CityCard key={`s2-${city.stateSlug}-${city.citySlug}-${i}`} city={city} />
        ))}
      </div>
    </div>
  )
}

/**
 * Server-rendered vertical marquee of the most important city pages.
 *
 * Emits plain <a> tags so Googlebot can crawl them without executing JS,
 * unlike the interactive Leaflet map. Links pass internal PageRank from
 * the high-authority homepage down to the city landing pages.
 *
 * The continuous vertical scroll is pure CSS (keyframes + mask-image),
 * so the component stays a Server Component and SEO is fully preserved.
 *
 * Responsive: 2 columns on mobile, 3 on tablet, 4 on desktop. Each
 * breakpoint gets its own city distribution so every city is visible
 * at every size. Hidden layouts remain in the DOM for SEO.
 */
export function TopCitiesGrid({ cities }: TopCitiesGridProps) {
  if (!cities || cities.length === 0) return null

  const mobileColumns = splitIntoColumns(cities, 2)       // 2 cols (default)
  const tabletColumns = splitIntoColumns(cities, 3)       // 3 cols (md)
  const desktopColumns = splitIntoColumns(cities, 4)      // 4 cols (lg)

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeIn direction="up" delay={0.1}>
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-teal-600 text-teal-700 bg-teal-50">
              Popular Locations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find a Personal Injury Lawyer in Top US Cities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with experienced attorneys serving major metropolitan areas across the country.
              Choose your city for a free, no-obligation case evaluation.
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          {/* Mobile: 2 columns */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {mobileColumns.map((columnCities, columnIndex) => (
              <MarqueeColumn
                key={`mobile-${columnIndex}`}
                columnCities={columnCities}
                duration={COLUMN_DURATIONS[columnIndex]}
              />
            ))}
          </div>

          {/* Tablet: 3 columns */}
          <div className="hidden md:grid md:grid-cols-3 lg:hidden gap-4">
            {tabletColumns.map((columnCities, columnIndex) => (
              <MarqueeColumn
                key={`tablet-${columnIndex}`}
                columnCities={columnCities}
                duration={COLUMN_DURATIONS[columnIndex]}
              />
            ))}
          </div>

          {/* Desktop: 4 columns */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            {desktopColumns.map((columnCities, columnIndex) => (
              <MarqueeColumn
                key={`desktop-${columnIndex}`}
                columnCities={columnCities}
                duration={COLUMN_DURATIONS[columnIndex]}
              />
            ))}
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <div className="text-center mt-10">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-orange-500 transition-colors group"
            >
              View all locations across the USA
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

interface CityCardProps {
  city: TopCity
}

function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/personal-injury-lawyer/${city.stateSlug}/${city.citySlug}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white cursor-pointer group hover:scale-[1.02]">
        <CardContent className="p-4 flex items-center gap-3">
          <MapPin className="h-5 w-5 text-teal-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
          <div className="min-w-0">
            <span className="font-medium text-gray-800 group-hover:text-teal-700 transition-colors block truncate">
              {city.name}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {city.stateName}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
