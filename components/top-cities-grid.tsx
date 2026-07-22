import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"

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

/**
 * Server-rendered grid of the most important city pages.
 * Emits plain <a> tags so Googlebot can crawl them without executing JS,
 * unlike the interactive Leaflet map. Links pass internal PageRank from
 * the high-authority homepage down to the city landing pages.
 */
export function TopCitiesGrid({ cities }: TopCitiesGridProps) {
  if (!cities || cities.length === 0) return null

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

        <StaggerContainer staggerDelay={0.04} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {cities.map((city, index) => (
            <StaggerItem key={`${city.stateSlug}-${city.citySlug}-${index}`}>
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
            </StaggerItem>
          ))}
        </StaggerContainer>

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
