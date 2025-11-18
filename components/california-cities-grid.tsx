"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Link from "next/link"
import {
  StaggerContainer,
  StaggerItem,
  GlowEffect,
  FadeIn,
  AnimatedButton,
} from "@/components/animations"

// Import the California cities data from the new location
import californiaCitiesData from "@/data/states/california-cities.json"

interface CityData {
  city: string
  landmark: string
  population: number
  slug: string
}

export function CaliforniaCitiesGrid() {
  const [visibleCount, setVisibleCount] = useState(6)

  // Use the imported JSON data directly
  const cities = californiaCitiesData as CityData[]

  const displayedCities = cities.slice(0, visibleCount)
  const hasMoreCities = visibleCount < cities.length
  const remainingCount = cities.length - visibleCount

  const showMoreCities = () => {
    setVisibleCount(prev => Math.min(prev + 6, cities.length))
  }

  return (
    <div>
      <StaggerContainer key={visibleCount} staggerDelay={0.08} once={false} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayedCities.map((cityData: CityData) => (
          <StaggerItem key={cityData.slug}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white group cursor-pointer">
              <Link href={`/personal-injury-lawyer/california/${cityData.slug}`}>
                <CardContent className="p-6 h-full">
                  {/* City Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <GlowEffect glowColor="rgba(11, 107, 101, 0.3)">
                      <div className="p-2 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
                        <MapPin className="h-5 w-5 text-teal-600" />
                      </div>
                    </GlowEffect>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors duration-300">
                        {cityData.city}
                      </h3>
                      <p className="text-sm text-gray-500">
                        California
                      </p>
                    </div>
                  </div>

                  {/* Nearby Landmarks */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Landmark:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {cityData.landmark}
                      </span>
                    </div>
                  </div>

                  {/* Population */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Population:</h4>
                    <p className="text-lg font-bold text-teal-600">
                      {cityData.population.toLocaleString()}
                    </p>
                  </div>


                </CardContent>
              </Link>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* View More Button */}
      {hasMoreCities && (
        <div className="text-center">
          <FadeIn direction="up" delay={0.2}>
            <AnimatedButton magneticStrength={0.15} hoverScale={1.05}>
              <Button
                variant="outline"
                size="lg"
                onClick={showMoreCities}
                className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-3"
              >
                View More ({remainingCount} more cities)
              </Button>
            </AnimatedButton>
          </FadeIn>
        </div>
      )}
    </div>
  )
}
