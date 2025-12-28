"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"

interface NearbyCitiesProps {
  cities: Array<{
    name: string
    slug: string
  }>
  stateSlug: string
  stateName: string
  currentCity: string
}

export function NearbyCities({ cities, stateSlug, stateName, currentCity }: NearbyCitiesProps) {
  if (!cities || cities.length === 0) return null

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <FadeIn direction="up" delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-800">
            Also Serving Nearby {stateName} Cities
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our network of personal injury attorneys extends beyond {currentCity}. 
            Find experienced legal help in these nearby communities.
          </p>
        </FadeIn>

        <StaggerContainer staggerDelay={0.05} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city, index) => (
            <StaggerItem key={index}>
              <Link href={`/personal-injury-lawyer/${stateSlug}/${city.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white cursor-pointer group hover:scale-[1.02]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-teal-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                    <span className="font-medium text-gray-800 group-hover:text-teal-700 transition-colors truncate">
                      {city.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
