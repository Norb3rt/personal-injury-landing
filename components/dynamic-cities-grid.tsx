"use client"

import { useState, useEffect } from "react"
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

// Import types
import type { StateConfig } from "@/lib/types/location.types"

interface CityData {
  city: string
  landmark: string
  population: number
  slug: string
}

interface DynamicCitiesGridProps {
  currentState: string // State slug (e.g., "california", "texas")
  currentCity?: string // Current city slug for context
  maxInitialCities?: number // How many cities to show initially
}

export function DynamicCitiesGrid({
  currentState,
  currentCity,
  maxInitialCities = 6
}: DynamicCitiesGridProps) {
  const [visibleCount, setVisibleCount] = useState(maxInitialCities)
  const [cities, setCities] = useState<CityData[]>([])
  const [stateConfig, setStateConfig] = useState<StateConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load cities data when component mounts or state changes
  useEffect(() => {
    async function loadCitiesData() {
      try {
        setLoading(true)
        setError(null)

        // Load cities data directly from JSON files
        // This approach works in both client and server environments
        let citiesData: CityData[] = []
        let config: StateConfig | null = null

        if (currentState === 'california') {
          // Load California data
          const californiaCitiesData = await import("@/data/states/california-cities.json")
          citiesData = californiaCitiesData.default as CityData[]

          // Load California config
          const statesConfig = await import("@/data/metadata/states-config.json")
          config = statesConfig.default.california as StateConfig
        } else {
          // For other states, try to load their JSON files
          try {
            const stateData = await import(`@/data/states/${currentState}-cities.json`)
            citiesData = stateData.default as CityData[]

            // Load state config
            const statesConfig = await import("@/data/metadata/states-config.json")
            config = (statesConfig.default as any)[currentState] as StateConfig
          } catch (importErr) {
            console.warn(`No data file found for ${currentState}, using fallback`)
            // Fallback: create empty data with basic config
            citiesData = []
            config = {
              name: currentState.charAt(0).toUpperCase() + currentState.slice(1),
              abbreviation: currentState.substring(0, 2).toUpperCase(),
              slug: currentState,
              timezone: "America/New_York",
              majorCities: [],
              seoModifiers: [],
              defaultCoordinates: { lat: 39.8283, lng: -98.5795 },
              enabled: true
            }
          }
        }

        const filteredCities = currentCity
          ? citiesData.filter(c => c.slug === currentCity || c.slug === currentCity.toLowerCase())
          : citiesData
        setCities(filteredCities)
        setStateConfig(config)
      } catch (err) {
        console.error(`Error loading cities for ${currentState}:`, err)
        setError(`Unable to load cities for ${currentState}`)
      } finally {
        setLoading(false)
      }
    }

    loadCitiesData()
  }, [currentState, currentCity])

  const displayedCities = cities.slice(0, visibleCount)
  const hasMoreCities = visibleCount < cities.length
  const remainingCount = cities.length - visibleCount

  const showMoreCities = () => {
    setVisibleCount(prev => Math.min(prev + 6, cities.length))
  }

  // Get state display name
  const stateDisplayName = stateConfig?.name || currentState.charAt(0).toUpperCase() + currentState.slice(1)

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading cities...</p>
      </div>
    )
  }

  if (error && cities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2">{error}</p>
        <p className="text-gray-500">Please try again later.</p>
      </div>
    )
  }

  if (cities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No cities available for {stateDisplayName}.</p>
      </div>
    )
  }

  return (
    <div>
      <StaggerContainer
        key={`${currentState}-${visibleCount}`}
        staggerDelay={0.08}
        once={false}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {displayedCities.map((cityData: CityData) => (
          <StaggerItem key={`${currentState}-${cityData.slug}`}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white group cursor-pointer">
              <Link href={`/${currentState}/${cityData.slug}`}>
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
                        {stateDisplayName}
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
                  {cityData.population > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Population:</h4>
                      <p className="text-lg font-bold text-teal-600">
                        {cityData.population.toLocaleString()}
                      </p>
                    </div>
                  )}
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
